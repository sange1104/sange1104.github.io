---
title: "Vision-Flan: Scaling Human-Labeled Tasks in Visual Instruction Tuning"
date: 2026-03-30
categories: [paper-review, vision-language]
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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664775DIHY%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040413Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGp%2BCHFzk45MZ1df8cZ3RpAUBUisVqAdRpET2NnCl7bzAiARwpLua14erced%2Bmq3v0MZLQcZvYs7sDrCAkRZ%2FCfAKSqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMl2qN9TATFgdK4QrmKtwDx9tRfs%2Fce7%2BGeyRN%2BmMNnJwELgtcGb9OY%2FJQb8mqOBo4zrBE%2BMUI8zCl0wI2JzYOq5UCmqimLYis6ra%2FLdD%2FW9nr%2BrFwJ%2BslQXqAyuAahCP0ZCNd2iisViFzWmcbaYNf6691D6JXfKzK1JJpVYY%2Fr%2B8e5J6aRzj5orhh7RC1sKW%2FjdKh8iLHHpJ%2FBSPVGyPXvj8zq%2BS8%2Bg3K4bzOq2Vq3Bp6p0eVeXVl339g0rgtccWRkuMEPNKDpbf006XegFtwZfsRnN39QY1wZAlamDF2XrGPLTFS7Y8u4tJJtqiCsVhsIY7EjDhpTkSU3IS1mcguG7lQc9%2BFnbldnZ%2Bk%2BR6j%2Fnayn8wMkSZ%2Fr2AtMq9uYz17QKGHx4ZUZGNbOTPU6oFG%2For5zViZ%2B3luO7mp0iNh%2FOrCkTe6PI8nVGVpvpRF4y6pT3CSp7qPmrgSiFkWbqIeh6EiLy%2BeIaMU7yg2IoKtT7O%2FcQyY8JoMTOMc%2BnbU3AbELZTV2%2F1KuJQ7BveN3WmhqGsVlA7crTrI3gj%2F5cZXGXLd6JArBMzJ5%2BrtfSCt474S0riDwqyMNWkLxo%2BGBFc8cm9ENW54X7sRMXiBYftH63dmMYS0%2Flvny6eEA08ve5xkUo%2FC%2Fs632MlOsiwwlYvwzwY6pgEyslQUECxnSEMOGieYjBHsbRKAxeSn38DCXe97TO7Eua3Oimb3npMM9c9pWR4jcA6AsbkBF0lkKMR7TLV%2FXbBhZU%2FCSG2tPTV2f%2BtGwOsr%2FRdyZsoEoFDY0q%2FbxjnALqyBl%2B4iKNi9kF1GCSzDD%2BaT0G7q0e7eMCYaXKrQN2LOBcfmZOAhZPiy7x%2B7klhqxnKKif%2FRPt1Up4BCxrZJYio7VutN%2FXZp&X-Amz-Signature=ade8f082cddcf6b66ba838cd41b9e8a3a1246588c7674d78a1bff8a7ce3e1bde&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46625T3APMX%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040414Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDUGMbzupHFPqzIK9oSZuIceF%2FlDHl6jQRysk2Z9GRDWAiEA9J1VT5eaCeeb6Ipy0hU8kcrZ0EUv00Do28knqPOl%2BNIqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNJqtXB8jd%2B84r1kvyrcA5Ei7XeMiWJG8%2FzEzaCJzKFk6kIhpkgqqDWb8G%2FNUgV3w7ScVCFQVUwgYCXc8RGBigGJiIkn%2FdEHF%2FntE3iA3pwfHW167nxBQKfIYiRElIj8JuVQ3fQgRbMZIPRpp54XEGVpQH4yWzmtKueT4oP%2BWdbi%2BfDnzYY8VrEm%2F%2FbP%2B3CKNz6fR2K%2FqB3GvRN0UcuEBXA0iLkcfF6OO8k3WeaI2yu6VYUPG6sD2tooH0%2FZCYltRmDeomzKtMTi2%2F9yH3rFlX2SJgLFjjY4G7B%2BNQEMTH%2FiraQ4Mo993R0wAGmDJpLKgmGj%2BllTXaux%2BnFAmF0ZmfCbUfHW5PGPhws0Eg2pC61ldZv1H783PKiCwB9TfIfQ686Ws1IwxaTDn7o9JPfhX79PXPxIbWAT5mf1mcCjxhchPwVeBcfjRK7NqxPq2k3yuAeap8ZESayA9Z8%2BzYKp6emP5tkUg2YqcIQ5oDB480yab7Mtn5wxhc1juQoMnze5lizXTQm%2FIV1J4NX70D24n8T3mnMGBK2Zpf7s2JwZznJVGjNrYDDHgWufrmG8eF3msfL7qHezuypqHhjYHKBTX6qxVaM3STvqccMB4Y0t3JicbqDjKl1ckIVrG8Juv%2BXAB1MyXWzzN2L3bCouMNOI8M8GOqUBtfms4Fy6M95JfQvOwnn85oFHT3XE2sFZVEVl%2B1uZDhPfgcc3xHioFHMCzWw2NZ4P5nliyB0thVhRsTdSexzNO6G7H%2F%2FssfiKelGTDCE8Bj7ez9drhNYU5njdL4cXrBQpfe1hc%2FsKZ7Yk%2BEFNEx7tnZD3xFDZM5OLLzoNeDJY8fxW5QPwGx8Q805mvfCUKSOlH3tGXtRUwI9GYStsoyBlOXv0PEU3&X-Amz-Signature=846e49263ca0b509e4c4dd9ac8c87e7c76d9791250130f69b2ea08e746c8f120&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VMSLBQE5%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040407Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAoO3lQoHl2CjO1zqHYZ12bmU6smki83eOwR92R54ntwAiBOfs00PVuZ%2Fq1qigaNqisTE2aE1rjqgGEdevbbcM9MHSqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMzAocPK8KpqudcNU4KtwDit%2F6RqfNSnIErw24tK52t67b%2Bn%2B9uBFH43FVQAuypKTt0tx%2Blhz0xSorWy%2BKQJW%2FTovrUblcKJHLw64ELp%2BF%2F8DCUpNm31v2CEwf4pfRk8xDBi8%2FtWV1EliVe%2B%2BlQA3zCd25BauwukvY%2FWBiycdOyMz1MV418IDj01wRhxnR39eK4B48rKhvcWNaiii6EwzDZOUsIFkcTWfgbiM2szpqXr2FPChbOTxlVQNJa4xtX%2Biuvp4Hm4chFNEiimatYUmJ0IVzUb0dnETWXV6%2FMIHjk28bdRvHM2zu78TF3QsKsH0014Nx9vPEumCEN%2FHIeTdISuuyziFXowWjk%2FxcbAkwa%2F0d69KxUhKXZHQxGLaUJnRdRrXMIARQ2VvtXp0ZOhAFhBnbB4Nrne1WtK6LM0rLN3eGh%2FV%2F6zY%2BoAb%2BZuJDKQeov2XdJM5TfL6vUJcx0%2FoXzqH1SMuX%2FSA78BBEfIWaPgRA6oX2YxuMuf2Ulb9aGISS93Md5eliofAvX%2FNb7zbgXaMxWTVwUS2fAiU%2F9%2FJtgVdAfWxxJwdVEqj1%2BqJnUBOxXcgLxA0p1jZok61b9MdVMlZ45JB7CrMJ4pNZz4lX5HRAL8NlKN6HjTdyiMTpyFOWhyAZdYvuHMl8HjAwgonwzwY6pgHyhKV7KO5pgwmuFTzCZPmwcNlLXuqypRlPFxLPZAGalabPMeQ5MwSAFdz%2F%2F90gJhLrRBTar7YEH7tUQOIw%2B%2FCZj2sHMeS4Tyme0tEr0r%2FBQsS6yc3c%2FPZa3U0aLWAakOA3rQIKZa6KA523YHdbMxQYUHd53EggnlNDfcwVMPG0xBXul6h4kBxp1Chrl%2FzofZ3ZbjdSEl%2F6TEaens%2B4ldAN32MHFDWc&X-Amz-Signature=40f43c69e4cc1406cedc3717c556113f91d8cae08e74e276b7ce92f046241604&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IJJVEWT%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDAex21UJupdGNTJbisy1e1WaLtgAU1KS7wxyozIzyeMQIhAID1%2Bzzu2RITx90esp20Y4rXKxwr5xcZoWbjQCkExZc1KogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwV3gcoKXCaVCp8lqkq3AOokb%2FTqERB2nlYeWry2JziO795oz5hXY7987o13CtFBKS6qfgvzYUOCVXBIDoKv6cbKu589itAv7YDvBxP0g4gcB%2FxbfazhuBAYkUR4RaEX38Bam0D3YDho%2BJHNkt6%2FBl6U4byRM3Yezs1Mj0wYfDGjiKMcok%2BCT0gTq%2FKZGbc4Tc01cv73TppYk%2FDpW8Fi7tOq8z%2Bn1FoS6Y963ZSk4%2FurhXCnpeLWKd6%2FxxGv3YY%2BTBsofOR2BZjnsUmtzuZ7VoyVsJixmEXA5kRNqQOVpkuCMw6ovPFLCi0wYfor1vGCylyzjnYrAzBq2n18%2FirTWvNSrpLmy6%2B%2BbPpBLOxLi8yPL6Edv%2BPtTcI%2Fs%2FDi5IR2rVLr8iwM4bwyUt%2FYbYu4KTZ%2Br%2FO12nLQFVorqeDnDG3EBsHbQUFPucho6Qjg4lQuY%2BYmUYJU9%2F0S%2FAr92H6xUAGsOcSfkN7QPu1nNNIWwwQbWOr7Z1pQcTjot23svP6nj6qfESKyYItZAaQHJBzIoGLPCMwI63KgsqBmZQkqF6uji26u6VKPrdJQv1nK5TMvTjhqwUh71sd1NSP04zVNtsJINbGTiK3%2B2cww5sSueqtYHc6AFSEroLM5bWRzaTnPpARDEmK73qCVmbYnTCxivDPBjqkARcZ2oes3mOZX78Hh4KdJPCW6tRTCSDX%2FiMhwvFqxxzQA4IVun07sfne5TM%2BgdhdsCeSGOpUayscQgEuOb%2F%2FHumbGpx7UKkVVtEZbv7Dn6B7oKrZqVVxcj0fwdaRz2gNq3jPJKg4znn1V%2BsOae2rRxecN12A6a9o6Y2oBCrBrzqN%2FHwH9%2FPLe47J8%2Btp5h52sRpTxZ3Hn9%2BJ1xpe09ujwKujx4yN&X-Amz-Signature=9af6e7a7c0688633303514e6309c00a930f46012f64c3fd9446022a06ddbf9c8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665E6F2EXW%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040424Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEk1639uQ4UrdTHsAp3V%2B7DV%2Ffzh8SpPs39Wym28MM34AiEAzkHyM6Wf4sBBPRdVw6QYeFyBsMbEVe8aIv3Ra%2BjaL4wqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJWn3NEpIuVB5B2ZwyrcA4kItuNTO3Zus9J1U1ZDqkxkQ%2BjjtyloNQLImnYDJXspW9j9YR8EwcpFH8ZxplbzD%2B7Jzl7jeZe%2FWHk1%2F41i297DouSUm4Y%2BBSQ4NmsxRXKwPrS0%2BLZGYkV28fQRzBCl8GAObf%2BENUTNjH0TJMa22SDUJzheDmLlOm1XelcAqGHBkTBRxHWnfUh0tPLxFgVgfEVUQNj9mQ64mNiqaSCLA3RT0B%2F1JFxA%2BHb%2B5L9ljTxrHdo9kFn%2BNJT18xvdh%2BE8phllvnwvhhPa0mP8n0g%2B0Koqbmv5CdbFo0S%2B%2FhKIeXd2aU6AYCqFYRv%2FdYcuAvhSTZIAZRDxxlysKMn5R2U5B%2FxjTizGdzSXZO6UvL7CdyzIXE1gNIiKlOVcWAIl3Z%2FmESshzVlbx7dF8TVmbaSiAqMhAjMZmUqp04ddi%2BbM3bnvQ4F82NYcmsqlIwGcThjzBw5VKWHsWu9EwnGQK7EfBM3NZVZnmdpfTIydkeEFmQ22vRnDzf8rBlCuNPkeVIZjwrKZ%2BRubvx0yg9PvMySBzKQ3IkrOWeXjh4rnJeBmUfKS%2FywwIKS2C0ZAQsuGd8pxig5iA42Ae%2FzhOWph19pTCSUDZu0YbxrmvPHMkaZiFlfZdVyX2wgBxt1LqehwMNiK8M8GOqUBz313TajjWRTgSKkvN%2B5onlvRmuAtxULNZKrs7hESzAD%2B7dRsItUOUHhXj%2F%2Bimlqwo%2FqZ9sHtPi6XV7hrGU2DiJRGJDxaFc9KSWfyZOVD1tTo5vimGGlS6DO%2BEamDi02luhaf4s3cbCFyoCPYwzfWprrMiyVjSbGQNo2RBIrZI20Wh5zQxlmFGw2L7h7EfrX1PzNw1J8b2aj3%2F2oFz84cBMHBqgKs&X-Amz-Signature=2c3e18645cadaef19f8e1ecf7c138422c2f7c6ddbddadbfe216325b943ee7a6c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q5ULH4OE%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040425Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDubENEQt3zInsH9a1TBgbD0ZwsOQbyB85J%2BrcjdU06KAIgEJvS5Xvt7CexwbwqBOc1GPl95%2BuYGSf64BsCCNU3%2FHYqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPOfsqmm9W7MUiCPRSrcA5ieOGNhcyOeyZPIqsWYkxzIJKp16o2Mm81KakoEulaOtKIfEP610FptsEt6CmqzLgrIaVdIc0JlOwvVj%2F8HRQPcjz84Fe1Ua3z2O2gIIX2gWLM7FBNz1%2F6Y9d5wOQpqsIYXtAN5SLQmgwW4GSZ%2Bno0ltU1m%2Furm6vB%2B6355co5K5ZKeTtvfBODnBXd9el2%2Bc52vtvrsrviyJWPG2b%2F9FMixlHGdY54wkVTH2owszVkmW%2BVZ0zbNOjNXmpaZrkMCAeUj3c91wMbSCXpBnw%2BgUuva5sznZs7m0RytDOIMSEfvTidhxMngVf8qFxoC5TNy6tYx6ZDWfo2J7dKe3xqXdx7dc0PQTEaxejJKhYKxNLKiebwn44u%2Fk3%2FTxnqoOuh%2FNPhenNWJNirW%2FoNH5Uhy6vXk79hK432WzVMm3eE9tsSfkpbXPtt4Gft0gt2fsP3CaCHRtFkt5MNsSANn6FmDTfPVwdWyuz9TZxc6xBZ65LnjbYY479d9LPqsrDq9cpmavV6B9rDyhDOdRWy8ATMg1oKrdCmAbdKZ%2BfiPrcOIhBpQYs3FImXop88dH5i3p8of243nN4cyBP%2BnOtVH2dRoSLphN6ylaOHF%2B%2FNQv4KrcQC28HkJKlanAcv79XkoMLeK8M8GOqUBqApWTz5g7sbEqUoE%2F%2B1MTQVbkNFHvgnmpUUXn2Zr%2F94VW2mr7%2Bg3bg5Ps3SMo8R6W8grtYq5hBk2zoiY%2BlhaN%2FAfrZsBZbWAVmLV55Nw%2FE3abmZAjilGLHnajOorHwEpR9XvSb6JM9v%2FF42QRWymikJIBIbBMxh8fVWy20QGs9od79LAWTJuvsfi4IZRrV%2BCqI%2FsOXzFbJ1LXsDKZR4feTyjiLJr&X-Amz-Signature=19dbd8aae49b91ef3096cf5e09f27b63cdc30b7a02e0bd8a5ccacc7629b46a02&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666CXS2CJS%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040425Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCp%2BeQPuvjcf7lgnL4iutPK2vXKJvMlsbwmwqVx0cUDxgIgR7KxBqkA%2BGdJ9fasQuIa%2Fp5cwYL3KoaYrEdD5IJn6bEqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHsnHtPbVdGJLUOaKCrcA6ApATyfASV7PsG3tTjjEGOXaEG2Twp07pifZuRkANpeG6DGRapJ%2FSHaY82mrDCSnwzW9V4Aees4vsL5vJuOqPcnBCufNzpJWlCdE2EKM%2B4cdYSSDuD%2FJjEGpAR1m6RhzzraStLSpQuQ7P2Z8sYK%2FClo4yU4dW5aGwjW%2BPM8oekehsuS6NpE7oX%2BshjFtccdq38cdtsDgUqnLEaLsm4FCa6GqtcwoAJ2Tj2sDe7urP0CeOmQf%2Fd4hXr7o5NYCmWIhz8poEHLWaz5Tl7Nav%2FLY5EPBf5KuvDUkLXyJXOZtj7JBP7l9HXDcO2F7gUMy67lYktxqO1zgnSmmmHu7ZW3EGF%2B7%2FXybeFjRuqoBs7Czq%2F3xS6GKcS26StqdoBOMmsfSHx1YpUajS0DO5o6%2FGvTSwkjIBKcxKz9CBUX%2FygqqbE3E%2BrVm2TF18VKmVKgpsDN%2BXQEO%2By4c%2FQ1vd68ph6%2FzAX17qNeECRuNgyi0TYLm9xQkhn235kS6F4UtWxsSjQisAfCuzuy9tk9A6H0qUj8k1cFA2p4Gk6Etvi55AXAvOt7bNTcK0gGbXmmaFU3MYAhhcggx6FTi94ou3j8U2cmnRSfqVRlhrLMVTfP%2F2kUmA0eXTTSOnRu%2FZydXMlxMNqK8M8GOqUBdF6SpEU1MNJQongiA82O7bhjsKXNsn%2BeaEfSWHaMhWhzKjOW309r2t6oN%2BdLhoPEe2Ulz9iaMpxQQoASrCv0CSriqTVsQc9qk2GBB%2BUq%2Fhkcpe2EU0mHyGMm8jM7ZySv26%2BxmFiln%2FwKvOUXq5mBMzyCG4n2TS3hdz63qPHHNzNqcjW0q7Oh7fNpHy8BlVyaqFGLjplu4B8LVFjSAsCQIrwIEX1c&X-Amz-Signature=a0e207f38131dc4fe0a99d8ad72f645b91fe40b1489b1c01f9027f7f70619a08&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YU7PPJA6%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040426Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQClKm0UpYAFl75FAe%2BZ9Fo3Kn0gEUzzO0TX1gos4LMqEgIhAMHiJIbO35E%2F57B5Nw96uwQBmdbHPxFmQiufUbi8JmP5KogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwFO9LxARf41pmEjlcq3AMyv3D9NF0CbgLJ8b%2BIHPXYHDfWEKa1noh0JEZOZaXkOGio20RFRxaB2xqZzufGATzXN8oF44xuLKnMm%2BnDLw9qWE14p0ihXHcBp9ipMLsCehojQ95TDJneyrC%2FbjKxIWwiyV7Oj%2Bqin28eS%2FoWRcqYP8ybm4bL2pg%2Fw0SSoKORPN%2F5BvzCuD3iEItGQ7%2Fj2fcmH08wPbL7R8iw5F%2FPNVJ%2FkT2F0590P4F4InobqGf%2BeWOn4G8Eyw1sFhS4%2BiU8vyRLA4IoCKUuaqa9MVIr22G4LZDUnqtH6EjOOCjIq7k4SKygXBgCs8sBcg%2F6Q2uhH0xEemlsILUqFbTQ0zeLJriC0iQs7Fl%2Ff3zI1JJNK7cm2uNilaKYx7XU%2FviON4k5vc%2FgcITl2ch%2FLhnhrCN0xJsEXxDuE6OPhF2yIjus3znZLfdnCovrmU1SzEWZIWoqku9aL4OVtr%2FXtFcNG5Rgi7WOHBWljiyK%2Fz2HiEckowFIUN84n5mlZ7VatKFjQSPzcHMaiOAKbEdi2YWcxE3awHw2N2FmbL7jOoWhE3eYnYHqiyU0yzAfdYrDDC%2Bl1xhis714dtDTAqSX4bA0%2B5Ln2rdt2Uc%2B2d%2FlJSGzfeHjO%2FQEouzh5fXvXfUQCa3NnjDOi%2FDPBjqkAcL7NmbWX0VQCRLDQV9ARzIx%2F4T9eJrJpGz5rN%2BbO9y1gk2RNjgktQyvn0VMIifYBIiILu1MHRRu9lWIba%2BjXZeXmYmPE7GUHlcab%2FljoGNzp%2FNBbUUvMsm6jx2JYTvWf110BT7sUqbiXyE0Io0z67RivtLXc%2BYS8UP59bEKnqjd7NCd8pyYTfM0oCxE7x38l9aZP3UQpgp%2B4VttHDR0qupaw8el&X-Amz-Signature=6a4e1c5b526a59c7651f0e854ed125252867e8bf75fc23a474c026cc58660ba5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RO46YELC%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040426Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDfF%2BpxxzVSjRw3PbhMpji2YpQhsksaNG%2F6A8%2FaJnpNBAiAUYKqbg%2FZu%2FS6AXFiiJd4CkYNBdYVQwU%2FPORWcNx9%2BNCqIBAit%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM9elZxHCu9GRee5UDKtwDeAwZBisrM6WyjZoyRzzGDTau3N%2FPO1avlDRhkQToLU5WxbIoIt9SkujigUBE4ouXvexpH%2Fhd8jg3JWBXOutkPw8Cwun%2FINDx0GQuE7o9Il6gbnHKl46SXuYft17eSQSXa0v%2FlHtcKm8MDusxDaj2oR9YTGGxg9ynPjQAA%2Bq0Bc7MfeEVyFqkMOkeaf%2FmkTxtKc8LJcxYEA4%2Fx%2BpI16SH6ZATDv6drnCRdPdxDM7yAI7tEGGR7ywRaqh%2Fs45Thi1e4R%2Fjjcd0Isqz5mE6KOz3XbDwywXSNU00KTVZ7DAbi9yj1DDuywqjEOrOVYBy9qQ0Y%2B9j9w8VGylNwj54y54VggDrwkKIeGCoHE%2Fuu42U1xR%2Bw8omXhW0RL83%2F%2BDuyMnGHWlyM96VtzZiORGa%2BDmtZgfMQ7eKwRu83S5fh9jiij%2BwkTW%2FwOsVCUlxhf71P6yOBFe16JI3r%2BfdobLzDTgklAQqrE6agBNjxB1gxI6DQMWHsRSU6sWj%2BDVcYqcdkdetM%2F91AfpYGhf2VEq7by5D8nSS%2BCtHzF1%2BkCWoQG6BGsGIK1G0suETpvFRhgbgamXE33dSE%2BtbrF5VRTfL0k2h3XOfyq%2FDrUj%2BQWM2zM2FNmbiQh8HwdO0YBHF0cgwgpnwzwY6pgGjodE1Bp5V4hbMdaXE6TgZnn1EGOpOkqaEEnCv1C%2FLwvu6fRlSeLUySjZoUopfj9Qc0aINLFPEsprKOdRA2eqy89IcuTQAraB%2B2FQUGh3sKyBYi83TmStY2hYGJEvUV7PJgBn4g7hL4cll6yBO%2FktTakeqPymkjM8MRD2U9mzlIn3MzU6HPksuUl%2FSPCzQ%2BKXMHpHuwFMMFjHhNud4lR410gO1OO8s&X-Amz-Signature=300904f7337cf36302d4dcb38c418abfc083b63a8f811458b9f1d5058a488657&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663434HB3W%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040427Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFfbmV0AjL8%2BxrR%2Frsihwp5bolkrAENSG6mLBZ1jfvqtAiEA4wv3qUZhpu1r12CQ1pUt3uKjCwo%2BLNZndIkJwQLWuKsqiAQIrf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIXmnkRoNh4BaZvdfSrcAy7yoE65bCzEdVqTAQNs6FSNPXYT%2F%2BM%2FzCJCuaFsGu6bjfEbRN1tI1DJ77US1xu3nNG3r4AChIVzEyvZhBDRKtr6sgzCiA12pVt57rDI0G05RC79ZEEKYmKB4gZ1ipHRDMVG7Q%2Bm24B30Qe2Yatd6HOVx50evy2bRYdt8YsaUjhyalD1LvHxwR6wnV9e6vaH9GVpKyKhYqicrid3%2FKvb8QjJxaYKYv6auXDSm4aMBxMq1CVUIpXSQFOnK9mjb%2F8W7pCpVLTHYEn05CBvQRh68Utd1ha7STQorlj%2FYKpw3eqhAzPx4arQ15QVsATd72Ku6jO8Sk17ZAd151cKG6tCDePYJiS6E4sE6vFRi9cKoJ9Em6aLZfBn5oN8vel6FfGsYj3iE8FJRaIAOE%2FNFw7%2F7V0XnaxOaOLZWX%2B%2FjhNvvxFeqMhMggtH3ihLB%2BQnG9%2BxhAxL4DcssZkDpWyWDHICEQpNMKShLacLAkVrFnlas9xQvloGcd9Dat3HXo7e%2B1srZW9qQCyZ%2BHVxuimyVKcQ4XORaUZZpRvO3UXh5sQ9GBE6%2BNZ7c84U9O4Egvlfl71fdAUKug0exHVApgTQkYO8OjuVpo7VRhrQzkSNtsz8FK0UpWu5vZeBAd10BuxHMMmL8M8GOqUBNuKfX1AKViI%2FQZ2cX5fOx4jjZTpT53HbqXC8bADKZ5IZcyNFVGo%2F98jrpDu48ni0%2Bnzfxy48%2F9rwtyocunBL4ftyOqDnE%2FKg3HYIXZrtJ3Nvse4W2HpCgFLaxJAbMfCnXUQhe3NuYm21MDUfCbdunmIBekDvxEJhdHNb4mLfhXJI9bpBDbOGcxp98grHzv2U2qA%2FeQ7%2BHJy71Xtk1i8xglS5iKol&X-Amz-Signature=bccae3a5bf2cd2e7232aaf3b7c475d59a34513a0e74dff9e40c804d3ae61fb84&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WS3R5W2O%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040428Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAJ2OAgRqvJr8RAHDws0OjdV7T5cE2WoMZwSW7MdXuOfAiA71pm%2FRjtdhqEPQWWcJLm6K7u0Cn%2FVRMROPX9xlvdvVCqIBAit%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMu98I7%2BTLJnl9I2QfKtwDzkarAhls014dRmnu6%2B8oGrGJWCY9uHWCZoi5Zlm2S%2FaCgxCQ3HRvDE35b%2BG0xcT7AO3hkwO6xMnOZKdPJyMNb3sw9pN3h6oAH2sJAutYjV7HxKJctJxYwg%2F0R%2BksPUTSyAOnGyjDf8nwRG6C3LYqZjSv7zLSXTBi5G6nfc4LHmC83ZqMeMuoQD9v47S%2Bout%2BDX6rWasg6W7TVXwihGViWjs3ZwSvjTt9BesSRbidCZVuK2Zs7B5xV6mx3pkdfhrQCRkgazivctT4epDD2eHI2ZUEi7hQ2XnVr%2BFSYiIBPqQqO2jv6ckYZZCLxlJD4FWJo3r4PYKceJlQOQpo3jofa0mphUW7STzSk4LlLXTF1P9hGD7zA60WGLCU%2FZBfcnc2PStW5zUPFrjaPqXrrER8fELRdvgnkfV%2Bi0s2NxdHAV59Dj4xqiJjcPk4Zexhv3DuC0L2r8Bb4CuI6yCTcYayW32O%2BodAI%2BEDFCvCM9sy4aFKXdFfNB8ZOoq32mULIzTMe6tEV40UbdeBApA2YBJI3eES6V8kJTehJLF3CrHh%2BeWiBjRgpp9JBa60Ee2fkxaxseoWH4RAGh3DSR%2FRU%2BRwyIF4e2n1ZsLwAg97j6LxLG%2Bu9nFC1fDjVHSLZfEwnYzwzwY6pgGbOoCxrg4wN%2BwKSKSAH0pq10wWnqZeonBE761r2kVXl1bdDu9YsWtOoRGczv0rILomdKUrgIlYJKldUkV0oU4Th8YWMmCyBW3PHlAdQQSQkRfXSfwKeV4RtMn0J1sDCSCNP06hcokp4HSunTAFmJoNYIAFnbE8%2FkSj6oKSTKumHpar6%2BL8cPLg5BKZmmkn0Uhb5%2FZgzR9mB9pdWTTnQ4M7qrsF7gp8&X-Amz-Signature=cd06b783596a0f4455fe921fc8d14b522f23751b57752d0daaa622459b10f70a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Q75VLZP%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040429Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCSG1ZtKiouQyINcqMvS4NJzWacrEJOpUbKmD514Yz5zwIgfmJ1q6gzaIapDbQ56wqPxqH27QNfJ5FR%2FTqN%2Fe1mcGcqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMv6BXp4jtzxfDD9KSrcA3RbASWYX32GW07syGOpgOUIMO7vkg2WpuQsP0rSjo1qEguwzZNaJykeDbk7DPVa2ylVyds8iS%2BIp0Nb%2B8fgDQOGESFlKqAKol5SE6yfeTgNqwf0TDC6Kd8UFopvO80fvE6qHw0bCBBRM2rJN9eey6bfHxGBljhc3WVO3naIjlZ8VaRwzI5ZAFfKCPFQNZ2Go%2BgLnCUNDEcJDZmFWTEMbUort6MpiCE4N8xxkMMi6ln%2FKQXJX4DP4iRf9mTdBHHkq2DzAu7r0fZ3yFPGV1EKJZNPIzsteMDpDUXTAWjKToGOrN2G%2FstlAwdgvncf45l01miZEVdfup0L1V9AIM4JbB%2FDdiPE%2BN25KcBNqdI6mK5AgNmc3VmvQOu04g%2Bm1VQdMG6Y47ByleEHqzrgeQPDyqHuvlvCtFmBQ%2FPfjgM2Jm2uPGft9rvx0cmEByrwr1wDJJkcU1kdMBE0HoRUq6oj2Cd34Jet%2B%2F5vGKBPEqaE7T6Y2tk5rbhGoyPJyUjPQ0yy%2BdWslXcoQglTHwa8ESb5rKxz5cWmL7IkCkZKuAeFfhNnktAn60s%2Fo2b8G3C%2FeYAVxQoxWjC0XsCWCvtA7ZyFa5dXOMI3mUPNk1RphgfYGqYLW5w4X1AaJnPPacxEMMeK8M8GOqUBWjfjumEh6oisj15ZNyBbZi8ErcEGw5SJngFiaffadQ4MoO24isdtt%2Fx89AX7aoU11nSnKSF%2F5tKdguuo9qMICfnbsdTm5dU%2BLA1rmr5ySfqcjY4i4XQYMpwnwhcxvvG81PKyNDH%2FijWd6p97BNY9WljWtbA%2BLrBsQBktBhWQex2M5DL6x8VFTHaGehEzyBItLVEdZLQdO%2F%2BaMJp3FP8NzP8QK53A&X-Amz-Signature=2c283b33836eab7d28b6dabcf83b45852a3ae1e2955e34513738a6b0016d5174&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3D7AOOB%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040429Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICU1SFmWfla7yn3QmRzv6OS64ZPmUIxtpB2EYUM16%2Fp%2FAiEAwCYKtuZrctBXqOKl4IVUL1BjnBhk%2BlTyIcjzeBTm260qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEn%2BvceJvJhBP7r7aCrcA3bolhKq02WOf5%2FzrVg5MHGlNo7ErZ2IN95avkG7rG8YVsvJwqqXkfAxcSOal8Ip6vZdRxb2Za798Tlp6TGSoTrnMPFpnPidZStDD1uE6Wvu6wN3QeIOZJuioirrTeKq8GHIKiPGM1FhjB4DT5CD3Y2DGptS%2FC3ACxKH3u67M6VSETt0ffaZkWGU74yRwKIYo1BAIMLcdhQo8TupvOhoTrhAJaU3KkrB%2BjgKW6%2B1%2BMIhnpM5CbbEAGGjkJ6uiH3XK%2Bk1dsbZoT75LHsYdNhmqIQ612f4KRg%2FqcwWgg1F2wAgHdx8FncBKk0Yfd3dkRffrkotu8IfzsZqTsXXzn6rN9VUR5ItsqRjaPceMkSmNym8QOPUSYJHR8CfANsmFI2MUM3ymwqgCszApw1mgnoMRGmbckiC3DCOa8z81BV0p4IdtE4jG%2Bf3YhE6njkn4mmpf%2BfXX7NvcbDtsgBAJSnOpD1uX0dZ%2FsgA5Ms5izcrUB%2B0vVXoR%2BCtQ4uHcM6d%2F%2BVs5TC0SlJgk6xYVAs%2FsiDLh7dU5VrDmbj9atAZhH4iCkNVVKgnY7v%2F3LOZM2v1zcWRDqGMw7K%2FfzTQSiUKf9Tw%2FV0U26OiChiTkbwBL3ONbEEfrJQZHZNaesAFVsdaMMCJ8M8GOqUBTVu0MRjlRfo1rshAKp%2B1QvkbmaX9s%2FaxelKAym7zFIGWh8k4vyk30bnZ9bIkokw0fOOcbLhZabycdbvHXESNJiF7OyMbz%2BC3PaAlNzuqWRCSX3frBjVxhj%2FVhn34ZoHgvvBzrPQZxXz7Dh%2FdkIaIi84GOmKFFx9p%2F6TqbgH4V2tTMXS9LaEIEf7J5IeMgZI%2BhuP56eWjnWhqZj3%2B7QLsysxlWBDP&X-Amz-Signature=2e482240b2081a47433aa1d008f80ffc0355768fc5f83f8e05d7e0d58b5f3a74&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3D7AOOB%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040429Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICU1SFmWfla7yn3QmRzv6OS64ZPmUIxtpB2EYUM16%2Fp%2FAiEAwCYKtuZrctBXqOKl4IVUL1BjnBhk%2BlTyIcjzeBTm260qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEn%2BvceJvJhBP7r7aCrcA3bolhKq02WOf5%2FzrVg5MHGlNo7ErZ2IN95avkG7rG8YVsvJwqqXkfAxcSOal8Ip6vZdRxb2Za798Tlp6TGSoTrnMPFpnPidZStDD1uE6Wvu6wN3QeIOZJuioirrTeKq8GHIKiPGM1FhjB4DT5CD3Y2DGptS%2FC3ACxKH3u67M6VSETt0ffaZkWGU74yRwKIYo1BAIMLcdhQo8TupvOhoTrhAJaU3KkrB%2BjgKW6%2B1%2BMIhnpM5CbbEAGGjkJ6uiH3XK%2Bk1dsbZoT75LHsYdNhmqIQ612f4KRg%2FqcwWgg1F2wAgHdx8FncBKk0Yfd3dkRffrkotu8IfzsZqTsXXzn6rN9VUR5ItsqRjaPceMkSmNym8QOPUSYJHR8CfANsmFI2MUM3ymwqgCszApw1mgnoMRGmbckiC3DCOa8z81BV0p4IdtE4jG%2Bf3YhE6njkn4mmpf%2BfXX7NvcbDtsgBAJSnOpD1uX0dZ%2FsgA5Ms5izcrUB%2B0vVXoR%2BCtQ4uHcM6d%2F%2BVs5TC0SlJgk6xYVAs%2FsiDLh7dU5VrDmbj9atAZhH4iCkNVVKgnY7v%2F3LOZM2v1zcWRDqGMw7K%2FfzTQSiUKf9Tw%2FV0U26OiChiTkbwBL3ONbEEfrJQZHZNaesAFVsdaMMCJ8M8GOqUBTVu0MRjlRfo1rshAKp%2B1QvkbmaX9s%2FaxelKAym7zFIGWh8k4vyk30bnZ9bIkokw0fOOcbLhZabycdbvHXESNJiF7OyMbz%2BC3PaAlNzuqWRCSX3frBjVxhj%2FVhn34ZoHgvvBzrPQZxXz7Dh%2FdkIaIi84GOmKFFx9p%2F6TqbgH4V2tTMXS9LaEIEf7J5IeMgZI%2BhuP56eWjnWhqZj3%2B7QLsysxlWBDP&X-Amz-Signature=f85f4524d3f13de59e0a42da3626afcd0a90fa75f318dbc18638c956985de9de&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
