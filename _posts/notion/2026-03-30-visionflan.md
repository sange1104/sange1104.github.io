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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R5DD57C6%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044633Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDgV8GddbmLngFrY1QcEfSkKu8lyuNdYmSDCux6w8OeKQIgeQ%2FaGRCfiy0ObQVA1zJVx0mC83df%2Ft7rM6yczbqW920q%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDHGJ1dLNFC0Q1NJTVircA50FhFfVrrE3PgMVZrCpoVMYUgD2Dc9gi9rwYVPuks3tQgEi5oO2uhMRW%2BwcQUCE4fVtofVoCzD1vLA55%2BP8klGe8sl8%2BOP4%2BKU57N%2BxOvHc2z3VkB8DmqeO3JQzml1C8T6MRradIwCCm13TDdK57RSfwV9c20rHgwoTr1qkl1Om3VP1e7lOZ2Vp9rT%2FuZ%2Bz6r%2BOxNPF5QlyXQH3TvlEzFgv8Q%2Bup0SiK9myDWxL1CgfhJbSex%2FsfFmyVxnJSsi74BCQHyVqJzkJV5xt9ErAFMw7a1erNUOTnw2VNKuX44y6sUUjHIwToN%2BXXlQk1tvzG%2FmANgGHM6Vy7B1yhtOkPA3VFqiuSSYzzsuBekH3Kb%2F8AwrLhmXrTn7v0GNj3dz0aaC8cZtxqySRaoHwAfd%2FCPKIr7U36RFjU1v%2FL0dOj3yQgVmrSJ4yRVb0P1E5TfRkbwzguINtGnnPz0x4LvTK8Etagva1GxHxYsLp54UHU4E%2Bhlrme12C%2BASu1O%2FPhDEYgdtcvq%2Bb86dBl8nXaTAdx1e5R4s16u9qFXIcX6D%2FlnRzXDV5urYBy2BQfUDVEQ%2FQad9Zai9NJISJG5rCoo7V3wXgA%2FdI29fLtRPK%2Fp5bYUYTLVdoqsT%2BUJ5lF4cyMJf%2BiNEGOqUBR1STDyMbm%2Bpm2uKcfRsAI1jRxIWXDcM3xuE6LuCbzPvS6EcXddFErIDGe7vKHQGG%2F2a2BwaavcmTp13fEf07okqF0BrB3jENDvzOD4lDRHRLVirJvUFPHGZoUVHlx5ZjU5eamshlfACu5gLyQrduyuBcGviG54%2BLZSucvpzzGx62mH6q4cHhiiTtNBuBiqQsqH56lyUKGVP5fWila1BrrEECJ5sL&X-Amz-Signature=c7d937f6d26f163355f50e1b71b19ddede688f339a5ff812bbc66d9f07494700&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VCBVPJXC%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044634Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDTn9dmF7mblC1g1ZUmV1Of0OOcaaRbmRjQEWgznD98SAIgK15qiNyW9ThOZkJYutcHubtZxz%2F%2BT1hnnj2Mqla5aq4q%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDDpAHziGSK21HP836CrcA9%2B%2FKPp0grEg%2F50m%2BPGO6DphezpzGc0eE5uNjYmEOh6U8P2IyNMnSv5fuYn2Yy3IEj%2FRlEkHPzvWcWFPEeweSl7E6ihriyhPrQV4nblwqa4K0HwgO2i1%2FVsbIorF2logOUEgLxQUZsACAYlrYrIih3NrBpiA6BLHeDzH6WlCjUkQbl%2FqGwLkgdywFIQKmqW38zMULxlr3XaYVPODFDM%2BpJr2YtdQXtdgZNj1ky0AeForlfRr4VnhvO%2BZew3qJb7Z1ed6yz%2BtB9RZTnonUvBXa5Cdgz9WHmPI1RJTeOScj6trt5Eh7CRSiRyDF2heeFqhlqbz8Y%2BMdsEWyDU4n%2BPMw8aJyQN8RibRQM7fBm5j1d7%2B9k5OpbpniXs7NF52sYz%2B%2BHRCVhpfpqxm%2FMeoYd%2B8zq1rhvfGG34NLf%2FQeaG2cyoNt9tU%2FEmN1dWoDG6yfP0GvqW1xBWNuWoC8d5GxnP7EuVrlYdMmNKoyyqClEdvqpZdVmJ9fggQWWhjja84fPBxo7YyBJ8ln2151fE0BRZ2qJvCZY9UaZkec7lsQFQcb17EMYR8hEVq9%2BGcyrKtQhYgOIs1OmCqCgkbfm5Ar7r8VOCHMSJeSEu3wuvz3dcKOiiLOHzXssdN%2FUEV9L%2FaMIqAidEGOqUBb%2BOgTgFWQ44fFwkc2WKkyD3ACk0RSRnBPAwxjncPqSaQfUkb%2BAzcp2%2FrF70ffgn%2BR1KhnaYKZ6PL1AWvsEC6fk74T321rMc6QuNAkz6nUjiP5mTlW3qaaVDaBd5hYmWcH1tiGXfdALV3BjG4rhlOCWvScapgVey5sdm8CCO575fXQYkemEN5DoIErnGwFBGTlgc3Mt875C3q5crGtWsy5RIKuqWg&X-Amz-Signature=a52c6b58681d02b08c90829e2fcbf3b9b564666bd6bc0dabe64ba5e130383bca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667U3P7JER%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044626Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCH7aPOEMU8AAPY1HstHHrPmbV8QgbAvHLLZcXPZQfQFwIhANiF%2B15TyB%2BL%2BeSB21fhkhmbmczhiBdu85R0SuAzazDmKv8DCGQQABoMNjM3NDIzMTgzODA1IgyKwYUqJ5okEf8u9xkq3AMHQit%2BjyKdEDj5cFs%2BbUY8VEpv%2B%2B720gNWSvTy9N6F4ifeAVThRgmVfkJBzcaPM1qLsx%2FLmSpVGoEvzOwMsfqFxLkHQqEkjdggZDVkDTzWE3a1sc%2Bjx3QSNzYUNZ6MJOoVD%2FaW6b69wtinKlDUIL4yEvOEBQLrPVIxMhpFGoLDBxBLfqqnWhp39lvCWPKLXG%2F%2FT3zhHBllnyUMCuAssC1miVuMoRU8uSLwU0NBdbkrq7icbnQMmkMj8wrLJh1yqSJEAPTKyeTTJVJnccTdV8ePk7dDF4x5dsPWNewzcTeIXesbNPi9HG3k%2BywmcW2bVP0bNviVG2Lmnww8OmMrdOk9%2BWHjCidesv79aD7AsPzhNFP8AE2XT7R8W6dkhfGdcfR5WMBFVot3YkhYec0kg6CTHz0BwaS%2BkXyyC6tndDxGNIPwS%2Be%2Bb2rssu0C%2FBWBBONqj8Lspdgpn8TiYHYVStSz97wvN7y7oUUhrvenvqc522di5veIock2ipgtSl48cbRe61k8O9KrSBBkRzfJt0cW%2B4Hv8TIiZuHrQBnUs1Gf0L%2BmUmJTZSjqC5280DCSRDF3P2OcRY44pe5eDepX7q%2Bb0%2F2LdFND%2BQM21jf1Fi2sfjjZwxf%2BdpaI0SuQwDCt%2F4jRBjqkAdEgLFctUhTvLts9hFNYEYCOy%2F%2BDzq4EKI8%2B81%2BGoUO5Yw2mD7%2BYshFFzhIy8jDPlXFqnslMYEDqijEi0VYD%2BfLnvVEFGW%2FbAO6kgB3BLqHOwHvNY1jVjLV5a8lcWBXQGsYoiUWFzsBDj64L6fMSoRBDYmTxcoDhtBz5QuoXIeXHyDHLV15XicliVOGFzJ9C6M0IuITPlsfIKb5PG3hba2x0PNf6&X-Amz-Signature=5a377537d8d9e824ce360699645253ceb71ac15bde3d72ced6cd730a5f098d0c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663ALBCXKT%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044638Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCcPaaFrn08NQh7XcF%2FLnFApqf1ckPAvW6jl%2ByGVTN8iQIhAN%2FNoKQdJrh2pghxOAs9bxj5sV2M3Zprx9fUlzyoCutmKv8DCGQQABoMNjM3NDIzMTgzODA1IgzKRnKqKbDOwTGw%2BXcq3ANvrfTKev41HVR2Q0xkMycrrXXCmfI0RHt6%2FH3vYL3yD4yYlDUMtmRb4d0ddrrRXvH8WLNOFxXmyn9kVjykgQnPdBHH7NmsGZliwdzTjKsdkkt3ZTCL7Sykq45SlWe5BikDTvsmzU00aWWW6pb%2BRVq7kJpkLwIaiWs9U%2FXEWFtvGeAh0KrdwVd0ZT9yCLaZVgK3rtOeVOUglkdo9M6bG3c4XFNrp5qPYbNbt3vflNcuk3PAmKgdkomXEZWU6gxTcQ4IuUXpKyA7qB%2BSCjjxo%2F4sutgcNkAwLyZE5q%2FiftV3HmPunvHacL5GAp6D9ASE5n4A8ISF82Rkgz6OMHwNovj7TBORpgRcxiQNa%2FcPhn%2B8XxQh%2F%2Brr2w01Wdxo%2FtPrGhEB1WVLfULjfup4o0bOxVoT%2BCRApyFq6dQrZOKS9ZpweUBsrPks1dqT8iW1DNHXH4iQTulAcc9DSHJDjybPNn8rAkijZ2w5%2FcevUgdGJLfvTf6HGiQiXWO1XOap56%2BLMYKbUw5Kno2b8wY8p%2BLCHnw7DX1M4hG8h5AnBpmKGXD67NtXMn3AowJMtbCRNQflUE1730zgf3tAChmZzbIBPJX1Sp7VstN6W23HM76XqRljlg0O3rQs8AYb3dEgUDDg%2FojRBjqkAXmfK09TPmtTDX4NH%2FWGY61IDEuR9S7oVSP9dQv2QlY57wLuJVjKRsuB7KyeSyDJbHZWiMP3isICQh3frkx1nL06wM8VH%2Fx7zyPJzJpreCgZgylp3J9fkJK%2BXHSXaQRAGzzGaiZkgjryAnWap3YZ1RqZGLJ9kUPikvvwR47w0yJ9ZrrcVL3A%2BPcoFZDC2jyU%2BQ3Dac3fOPdrCKnJfDWhfvp3bl%2Bl&X-Amz-Signature=023cef3ba93b1772c5c30e50d540ee8145bfa3fed63e93cad782e9145e274019&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TXNXIWE6%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044639Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDh%2FZDRI1tvVsLnjiH0j0bKbB2%2BHRdrO%2BULB8WNERE51AIhAIGXfYABq6oc%2FXwupyv7dRLnyKK9uEbvNEA2Ij2Ma9ERKv8DCGQQABoMNjM3NDIzMTgzODA1Igzuwyfmw6355mBLyYgq3AMRavyeUj2C8PLwQpZpYKPhXn2sWgOogXyo62e0OnCRHZnWjJY9aFFXi4S8nFTujLVspSqYcOx9M50RUXJa9QCVVbl0BK27n%2BVkhN6yJaXQYuxW0fP%2BcI7U%2B0mvn2QJhzBA9LbTj9oq5TsV%2BZCaZG%2Bj15A031VupHF7B5RmsS8xZnduih1It7QOKFlDb%2BiKtd9kTd8BAPTafGcOBGaF7JsEw2ocuAELf8ek%2F7yM9fpZgAL72E8uaw%2BlgKrRB7idAA5sfIQZ4fvo2l5fDeND6EVGsKLUqfIyGVKF7rAWYOG7jH5tR4sbN1szr3jrYmcjpSDmi7tGJPfWTAU3Fu7l366ed9g7jSReWo745qOc0dkW%2BWIIiAy2z9cI2S%2Bz3YrQV72q7N82s11vfICUiCb%2BRmiYslocDdm0EuKP7LQxzgxaayBj4BFU2Lfcr9f4X98g4hkX4b7VNcyu7WuzMcU%2B57FAzDZt0Jh1a4ET9SfkIlCIM1KXEhE03YSHKfbEl2tfESBO6FNkMuAU%2F6uanWgNaxDoOGSOjwMV8WWiLnGiEYT3zYmUQforh%2Ba66MzDvTf9G9Ji69UZmnyS%2FaOTyrO9n4g2CpKBDRybbm3Qyr1T8l2B1Od7pVTS5j917aJEZzCIgInRBjqkAeUdKjTBFMMPjV0b%2FhctyGDSrFQmSyZ7204AdXoGwov3upNUvVy8eWB8AsXnj1pcQw5ckaHStWNzsu9BbBMbyKPLCYW%2Fo73SH3lxpKHvtVvKLtzVVHtLfgpn5V8amhCknbUY19YSubHLhVoTXGe2txjBjbS61wpz%2FTjOcWIMG9NvvKcS%2FjYztldmN0gkMFV%2BjbgKia7SF0aiuvhheoankVwOsIwD&X-Amz-Signature=24a1da2b2e24c02e0aeae71283995c6cca6fa8483e36f3cfe33648939c887bf2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667HSZQWPL%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCSuwm1qEUw0LRXJrIIdi3MbXenveu4JNmqMQS96%2FY0KAIhAJwoGttyr3yRgpl%2FOC%2F6MzXCnAqwLaz%2B%2BE6Trk4VqFS2Kv8DCGQQABoMNjM3NDIzMTgzODA1IgzWt3QWFPX9OoxyujUq3AOPeZJ6%2FnOTrf1BVXGmS5DYYEo3%2FiH4d4S81Wc8yP7J0qURg%2FWp0ol7pNZXlWFzXCW1kQHFJQoRCTOAm5JefwBG7WrlwFD4TDTrL8ECHlKX8%2FP10PSF7r6C6jOVhVSMxknu2G8zvZADMBfABVbDK%2BkNd08I3AL0ya%2BtkJtz1WuCRYZn9tbUSH6kvqGjmWL6x51DUEkVoVyps5UmPeR9i5dotW6JdtqPDyAO7TGLUu%2BVeNoUT4Ai%2BU5rRJXZMGkCIXhtNSI3tjzd521YQGVraeeRW9ZC5Glp%2B64dyEq4senV2JtS%2FAxUsul3jkzm5NWQRds%2FncExTunzYIPbPqQnqvtm067Ftygjj%2BqZPD3SHjQhEwzuaXEXtYKQfsYIYUQnVBMUC7B0NaRjroZuXPSxplbwGdCZQcvXA4kf5vXqOBP71BIjaGrRAZ7Vja6Ar3aHtrOH6%2FtGPq9zMuob%2FmRXtNsLLr8V7aW%2FFn8WNSmr8vV0E3qqp6X3yDeZgcWDZLGmAEKZs9s9AaCmCfOGVFajWebctn5F4N7SOQM3vw2xOrp2IntYJ2lzBMHFpI8k%2BIP1jq8c37xn11zPUeBrfkis%2FwDSjGwO11qn3gAKBvRF%2FIjmEF5htXRs3QKTJv5imDC0%2FYjRBjqkAWmHTT2q0iLQCenFEG69dV7xslR3%2BhEHErK%2BLMKtdKEgzD3KsAPLnB%2BYLUAbWjhef2i%2BS7j5gPam6GxWDQi%2BYZ9aRzCn41Fj5fK9rCnaVgNb8B8Yd%2BvflVbB11G2K7lkTXcm0H9bHCC4FoOQMGtXdc5pk%2BLNRNGK5xzrAkl7tZFwlyXu6NkcGQOeSHRmI6liHzbWp%2BrflPoKzIPmSzjvfdYePaVp&X-Amz-Signature=28d5fc27078b31358688b9c7c339c8c7a6b9f67f1923a6e8f385220fc36e8070&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R5NR4WAC%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDujWNFJAKB7IreIpGZYsEug3Lu8a8u9Uy6hMaIVPVXLQIgBQlOvtb2qWxcBww4gvWqBtToWcEd8vcfZkycziOObGIq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDODNSWd8%2F8I0%2F7nUqCrcA1HpNFsmtRer9wgCAw3Ca3HuE1vwH%2FNdrUlSde05PjT5XVbIGwo7o%2FFwSve7KdrfS%2FYr04aadwee6cpNnu6i4cveSJZ88ECFw8ph7IWCxFzIdTHx46bS0v2%2BmzDPiD3oxUaQPWayutg6IodKou74cM4KijqwoUQEsnc4em1UYMA8BEeRANybwjZ0T1%2Fmfgf9e2x1GEWL5hEY4m1bTtlgYFSJCr%2FynjEAlzLaVGBFbPThwkY59AV%2FQPaecCE26q9u62iILcNWiBbQNY3X0UI2RG98TdBLctpkKS02nWcbDda29mCz5OUYs3Wzhr42deONrUMbzgc%2BQ%2F186SeAfvg9cZKVy2eMDwUdb2Wpgv6zkMcDlbRcAIotCxCd%2BoxBrTL9UUnq09QSTYHYLpfC4P%2BaW1LNlKyVfF%2Ffk3z0NNmKXc1WReDw7vVI5tzvFZ%2Fgm5L%2BykhybLQc7cTEuO8BIQIdGOFhMGAoKCaQHiJ8zjTwIOpHUP5UdkLPg3zpOVJxIn1mZkZBFoaTVQ0CfZCzh%2Bb7ybJfd7qcon7WPrOrFpuINCV0GaMCS4Gc3zAP5Q0UomUuzxClWnH2xmvApTlw0ASI4JZaXFlAqp7rzxC4xps3RPPQhmVwG%2FW%2FFAHhnjPiMJD%2FiNEGOqUBC7GGS1b0yYPzazSxbGVwrR%2BFPCb7yckVJoZaCaBA6dAWDmMIp%2BM8aCdD6j666MaLeEL1adxZ%2FaKs%2BZA3o1PN4iH9ZpCNUoS32H4xv0ICshYitfDLO8c%2FJnEtQ4U1lFWvW9CKBIENBtRXQooNyTiJ%2FJG%2F9rxkE4DnBK1czzFbUVIDc5qoGKKLjpoThcrCRcIk%2BHcAOGMZz5RMxIVCgGxRo4kLKZUW&X-Amz-Signature=126346087f2b7935d04331e19413ab4a4e98270d83ea4bf1546f7a0a326fcdc4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466462ICSYW%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCNSoqg2e9maltUF%2B2Jtz0zRKhtKxo184XnYpnjq%2FwTRgIgc1VYjUvOhTS2ABRmm%2BmAa%2B8%2FvXGYa1FzkJRfO0WCQOIq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDAlC8VJT0WNivRqhCircA1sX7ZxR%2BHIUgcIFtb5PeKDfxL1hWZgh0j1t5OvjHqMDknY0YkXqHPoe7NcUW7CNAF7HXhGV0pQOqeqo6sbR88soLFlSqI7u5xzs8SWlWHNKW7wHpvFMsXDeGrzyn80JmGvds9xeBiK02LPMVvhqyIQ6ps1vmjFf1s25ma%2BBYAmySd9jrOCmmT6vu3yqYMpNI6PyIWPpSFIdyS3V0ETGvULv25R%2FawdnnkAmbQ8MzKLPwMxaAcgiCiWmGTLpuhI67ipcz5BUgcfRYQUOV7Y0XTMnKVRlzh8mbHRNnFXQ4mkdp8J1XQTrNO7oIGOTbiyZMquGjGCEMKleHVXoeFQITUOTI1WQh6wfp4t1o2xGgyxWXMtVWW08z%2B1kXvE4YaW4YBRVoHcsfN01ePO32h8LxZ7TLHexe9try3CTRGq%2BvQ3NOCbZxATO%2FuTxMHLYDI3W2jW0HmXKNiBV3A2oXMlX0tMTbgHA6INpGiBO7iG8JgpeG6yiQ%2BCRpK6WGpJnQGNdSaY7IKK6yyN5ePewUn5OycvYtOeAIqfoxoiAqA9qAQZ8pmNYAy8LDthAnfkqKF0IE%2F5YuJj%2FRFfVAk7TaG8oDrYEJcgyrSnQAm5HU0TW9nSU9NxGyw88rqaRGluKMN%2F%2BiNEGOqUBX5E%2BP4ltVJU3NUKLXhx%2FUF3LhwrBSOw84o2P0Kpm3brGEya1uaFLOtM%2BoUBh0Mgn2ZraYJZcD3sqcgFoh2dcLaTep4xLi3aSIgeEJmQeqnD3qQe5nL068LnZtC7VOag9%2FRoOW2tTBd5ChwTqSu%2FfcdfDkrHGRlg7VWgikFXIGGUp6%2BggwxrJOXJw7Ei60MaiaTf4CTVMMDDT0WtSByAUkprWuLGO&X-Amz-Signature=98242a515ce45b4af816f28da61ab25da02e080acb677d963f1439c09c9448c7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R65H5OF7%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCkHMx75no39Jae2unvgXiY65ZKwxCOyCvXhPRcZzUJGAIhAOwR%2FqVEnFY%2FbDLCrmRdva4tpa0tHJ09cDLOObeXCerBKv8DCGQQABoMNjM3NDIzMTgzODA1IgyuXxT4Y%2FwPxzw0x0kq3APa2uC763fQBxpftTjTB0Ur8aZzTPuMu8q9TTm8PHOJ3QAKPmDr%2FDLsjecx1mjQPy2gaOo1k6LQ2ZNeZXEhipvBJNdPARHdfd%2Fkn6N2%2FUbRrc%2F4erHf1D4cE4%2FSvZXKcUmIHQ2CsMdanJ8JrKmVbaTkUv6rifi2sxqxfd1hzrpKU4cmD1o1IQioOtAR13AWY8XP1YM%2BWGkZXeFGCUWPLSD6pCBODZM9YakgdYkLwKJ0Lymx3l58ZtVZagaoUFMPf9Nu1SLS0dF0%2FH%2FJUdL%2FF%2FPcTnjcY3euBY9Di1lgDOfMriYKavMtNnwphTkCauZgEgFcGSJ2NWivnWlu7e4ddghGlk4xZE9FGGll46SCfw6qB2CXijKYHQ3BETWzGEd28YWoxIR%2Bo6YHs5%2FTc6cRnvmKyg22NsppNYTZthQRfhAGrUrUFPiX46zHd2EP6wVbei8BeATK2xEdK1rwGrOwOULcwFI9NOHmN8sQ8jq%2F8ooVt3Pc8ysPN%2FVUoSMOb%2FJBz%2BOjX%2FQuxHqrCdyXYRVl06YDYuSjrQnQ674esIOcul6il9a2Y5CPEB4%2FApZYPbp7A5vQeGq%2FDuCkHICSn2Z15Azzgkxp%2FzYSe2xPmlowYebIwpB7dgn2SdwKhO%2FsIDCx%2FojRBjqkAXKaqGOUsL2J4yiLur0p6bJozqYFRqH5BM3IjaPJL0UK6mKZ49FU7k1um59SmgifJxMqkKBnlXd5hG3GRB4%2B5o%2Fddb%2FjoTzuIKan%2FTIYpO8uj2v7lfwZ73SwhG8uQmAd5SnL4iG8mXqMOlcVJQVh%2BGAr%2F3Zx72h9VAalBaJBSDksCK7lnGJPC2xeFOh%2FQanqKwPiuPcTganEpJ586AoD4qvO28Dy&X-Amz-Signature=85295039d846b149dab8edc1db1d8eaaf5c50ffd64610bff44b9b09be357adb2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TUOXVTMV%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044641Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQj6%2B%2BknPNOTNJ51MHSNx%2Fkq0uzKhu%2FdLJsOUE9W%2F6TwIgUTsdjUcQF0b4FdGYQPCEQOJ8537DM0ifFQi2CE3hZNUq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDGJgThodUfJSdvN6SyrcA%2BYVHx%2F8w6YdVWeAYBKVSl6YvPD0ERuh4AufN5G5Kmx7EmVpI%2BekXcQa8HAQ7ly2PiQeWfgz6YMc%2B%2Fh2KgQWanjoiwNQ7JjsAVXM2fLUhveD38wqudbp39ntHG6ng%2B3ZVo%2Fb7j%2B%2B%2FZ1EATsAOthZ9jOxRmRtjyTiTobazepW0A0%2FTknKGdaa%2BJQ2HWaVPMF0HB%2BgCxk9HkVn0X9nPyQn%2BmJWXRqpYd9UVIE5oW0w7n5teeXr7i2eY9pfd8ZFhN0xazo6eYD05djt6ZIG2ks3G5mHq08ctyUuLJTVttZvoknH45sttE9Gv9TYGQckn0E%2FqpX9fajnEeOpz2vTjLlESdtpSBJ0yRScNNdU2F2F%2F3Qc0ldDtXR8OkVGBdfWdTwr1L7sy5HrSPkW335IIKYYq%2BGHLhLBB7neBypLyz8AtggKqnq%2BnhiOwFXPnLeQH4kFLF9YtnROOPs4pgGYdj9EW18o9Ih%2BF4tcQcdNFOcvXSJIFrDRZyIXHZKDYX6uK39TtxEvtKMeiOpqJVizYHCkW3TfUu%2Bjyt6VQBmkjpyQ5e03y%2F0xCBA6E3VZgqNyxOXw7Rb2DjpuGvSrUeqAVgbzspDgiz6K3uqneUR9R%2FT0GNQpzejiJlMfMqcVZHx2MNb%2BiNEGOqUBS3ueZtBTxa%2BJYeT1m8nsdRWvhnGV0dr6%2FRQXLpZqtFtyw44uK3sfQeAUGjUcAyDr5zqPDgWOcP4Ua2yoRbfPlkFfBGxfwif%2Bmwk53dkDuYXHytQdY1fr7NzqGrnAXtaxcvXSuTX8v4wXXFUhusfcTRKgdaqzKvZPJKn2hFTh2VMcYIZ4X01Da0bCOPQf%2FFfhSyBNj5POY9Id4jzC4fwAuiWCGuf%2B&X-Amz-Signature=be46b6b8af6090c7896ee061219f29ee7bbe98acbe737b4d7576856657399dd9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466REIFTKM5%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044642Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDY9oXWDfcihRbIGcjP8KdXs%2FrekZm4CH2ijlyNF1afiAiEA59%2BkY0cmw2DYyTGJdDRdHT8cduwOUheDNgOd8U1LIisq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDKrXcYNtZtmzDBobByrcA%2FKRh9yE27eKW9Oa2HziS5JqtO4CDkzsplMK%2BqomN1Vx4nkfQQztEBW8%2BIFtkX7wFX5DqMSkmhftFmZRTHGs8U1%2FzFB5gXkU8o%2FkHEJcjJqqUZr6omoiZGJFji2vtj0tRUpTuS%2BDUVxBw%2BRIX%2FnLAzLhF%2B3oHkyKBrwMLc%2BLxRfIPxSWC5K1TKwBW2Rft4tb8yUBN7ASxRsHWS%2F7135TcfaP5Dw1W23K0S37TDhjGs9f7plRoSPaGLKzUeWmYOTzgR7NOWanBn8jrGZfj2TGD2CdPkiXzTz1FaL%2BVNEERr2xBfwt0JQ3NxSMP03G6Zi0ISzeQbWACv36n8Wh0JfdoBt%2ByWr3DjOoSjuvXXBy7WqLxt%2FaixsMxEq00J42e%2B8FblQfacf16%2F1NCDmKaL0UeZyEV6bGzkZIcc2hcBVzbn%2BoIztBTGtWuuX1EYd2pP2FSxABHO6QQq1clh%2BZrDPrmdTqvxEr5VfmvsrKqGychQh3l9ep3Cjo%2BhXcnaTkEtF7HXiAVTuVmQNMieZVQI%2FKkFS3WAlh4Im2zWQeoRJbMz%2FKgQh08dMNVEB%2FxGzJzQIEsLpubDHBDuYoA4C%2FLV5kopHwXRNx45jjLja7xlqkzCSODgw26Wh1EtXy0grHMLL%2BiNEGOqUBJSwFL3%2FbZ57CxzV7UWhdLBu9aZTgL4idZkiYs0y%2FKUmSetBUTAgM3isutBEN%2BPKURXMawyCKSmxdr0grbOTCNxp9jrtM9piaydkzI%2BANrMoRLxgHSALurIGU8AX04TWDTvy3JE9vGyaOIvrFYCZVXLfgsy%2BdqrHyw2WSGWQt0CspLrvmQ0GM%2BttUEzi1ISsaYicHl5yOQ02n3Yw6%2FVtVbC32bKA%2F&X-Amz-Signature=53e1c32d82bb5323d8fa32f282cca6364edcca726e82ada643def57475f090c3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SV6IDDFP%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044642Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCs0ZQcXZJ8XYe1glOU87tbaPLj%2By2YevUSfQJ6SgfLFgIgFHBXjRSKC3RD4aUYO3go%2B75oyMFgEKzIRiW2HlnVKgoq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDFx3hPCOOavAdMlZ3yrcA66rWjJrBGCZruMxluBDxxpyxESUEhQZ77BgSEJXCbN3%2BSmVaVi8HqWTEnU9zz1mpP6ZbpdLGzh7iX8GYi%2B%2BFZzM%2BgTqLC0zRMAZaFPCx0LqU%2FiJLUhIsUfsi7ptsFa1V1sDJgI1tZRh45vNKJtkNiLKtv1v3kWh1YMTfiuT3jsgcNAPzH9jtQUFr2z90omDjkLnd576Qf9gEMYxitUNoKBZVtQiWVqY3TmHJOx9s9kAfs8m4F4rehSvLI4KQ7H8u%2BFKqg8MSW5P%2B2KAcTwG0vdbWKSVa5Ha8mnaPlgwKtMRmlEc2UNKKUhudDuR2HP22IzHt0MEUsV4Km7gudRwiQfohe6ksjwGhdNUuQWdAbLr6Ujqts0MT%2F%2BY8hgPgMK8fD81haSMthFPR6iv8RuxC%2B0WNE%2B5SAH5WX11hi6RA1RTHNttOwOEJYkI5UQO4qx0RvGpqsZOlwDyFd2j116g5phn1IAbZnN5yt9W%2F5TaLuIiPPGW27Nyr9Mmh%2FcOvg8uzcof4s2mwnwJSS5MwIC54vwuBLh7nSE8VD2lkxMPpLwU0R6t%2BxBeybgxvlofspa9QdBrnWRo%2BRI9jVrO9B28jhYp8ENRlIVgZUfS%2FEaFuPN4MUUupONBITD%2BWkAMMOb%2BiNEGOqUB%2FSK%2Fi%2BMU73b4%2BRcGUE5FDjUD%2Ftrl1FQH8frvbZS7TVRa1oA7nPg0ay88WT1EZXSXG3ilkZaVoEweaz1NsH3xPAKcZUTlPEtNmYh%2FMj7CuI7TifbSPtlK932i5oqLK5xfuAbReEUMtu81VwmcNZuinQJKaVJG%2BTjCsHBwGxe3KxZH4u1ZxN42J95oLSDhtGOtN4MXMziQAAU3hFdbm7p48uEBlLh7&X-Amz-Signature=104cf1a9fba81001899068aac24c1c798682eb3a209f2a9f4c4bdac2d5013041&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662D2GB2VQ%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044643Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDGigT63loh06A%2BA9fPKp5%2B361Zys%2B0L4SAcfc%2Br3WIiwIhANUTSa0vjDvROFQi48GgpBSuTSzC292CTIpoZi7Di0S6Kv8DCGQQABoMNjM3NDIzMTgzODA1IgxkgFLdXqtGzn%2FoJkMq3AOdmrqb%2BpGMdKQpmsT65Rv9iesJJxoRV7OOk0pByjHmzeA8bx8j5bUaaXY3DaDDjQ4BPZ8M5nfvzQvfuDPy9wTp5IFiYqAZG0zmPEVukqt4JBtiZ4rx5VryQxjSyFLdm8u%2F%2BMSHmmWik75ibYS9omQ3qnXoVDa0MNRaV5lC3wQskUupx0TiTGl0Ca%2B6%2Bu6UlYBZJaJVugQMS5nNO0jhUvYVRFDOaaXi6Jee9j2HWTGCR9BwrWKyltuspL0rbjdjJcXFxkAXoUjScW3U2TQs49Ihj4ub7PtOwIMsJbXbiUEDf5h2xK%2FlvSun6PI1zoXcD2xXb8KRWrXdzTTuNd0lXrdm5f9d4wL3hTZOJEA5uY1e5DCh7wqpg1MGkQ4VxHxr%2B%2B0dZTAl8tt4CGyixAD5HsOMc2p3HMt%2FWvnNb%2FEvDAwCGDFFEUKr7DFEPsN4ctGamR50bTqcd7OzHGinXXoozAACIESX6CQrdyLaJ5bilveU9Tkz7DhxdTwT8keAth1Ci463zwMK%2BHbPh7glR71oJuiC7QXY0PwywiJIIoPtZl3C4iCjbYoioyCdNgzTQEoRrug%2FnYSf0hCwV2E7nVhfKyAer6d%2Fx8TmCOJ1OuODYxmDB1%2FdsHiy3pCRErEoOzC7%2F4jRBjqkARqEQwg7dROTTujNzbeHwm%2BEg2%2FnSqY6E6841AMC0yZIyG8Cz9Q0xjFdDLGvn%2FIhV31fmcTEV4XTgvyPzwkzy6yhV0v6rVRJWKpBXXzZbeDTkHtpk7XDFL5YCw%2BtqgD%2F5Cme3zSUA6JxrHbuIjcVjl71DRWnQY76DfW2lL1qv15AYHa4%2BdWO37U3uyCx%2Fu%2FPgkf9MNFzggHL1LQCSegWIE0mPL%2B4&X-Amz-Signature=94af27d48035420bfd30f8c12f036e0a13b6694b6503faabbd6582fd8a782d8b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662D2GB2VQ%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044643Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDGigT63loh06A%2BA9fPKp5%2B361Zys%2B0L4SAcfc%2Br3WIiwIhANUTSa0vjDvROFQi48GgpBSuTSzC292CTIpoZi7Di0S6Kv8DCGQQABoMNjM3NDIzMTgzODA1IgxkgFLdXqtGzn%2FoJkMq3AOdmrqb%2BpGMdKQpmsT65Rv9iesJJxoRV7OOk0pByjHmzeA8bx8j5bUaaXY3DaDDjQ4BPZ8M5nfvzQvfuDPy9wTp5IFiYqAZG0zmPEVukqt4JBtiZ4rx5VryQxjSyFLdm8u%2F%2BMSHmmWik75ibYS9omQ3qnXoVDa0MNRaV5lC3wQskUupx0TiTGl0Ca%2B6%2Bu6UlYBZJaJVugQMS5nNO0jhUvYVRFDOaaXi6Jee9j2HWTGCR9BwrWKyltuspL0rbjdjJcXFxkAXoUjScW3U2TQs49Ihj4ub7PtOwIMsJbXbiUEDf5h2xK%2FlvSun6PI1zoXcD2xXb8KRWrXdzTTuNd0lXrdm5f9d4wL3hTZOJEA5uY1e5DCh7wqpg1MGkQ4VxHxr%2B%2B0dZTAl8tt4CGyixAD5HsOMc2p3HMt%2FWvnNb%2FEvDAwCGDFFEUKr7DFEPsN4ctGamR50bTqcd7OzHGinXXoozAACIESX6CQrdyLaJ5bilveU9Tkz7DhxdTwT8keAth1Ci463zwMK%2BHbPh7glR71oJuiC7QXY0PwywiJIIoPtZl3C4iCjbYoioyCdNgzTQEoRrug%2FnYSf0hCwV2E7nVhfKyAer6d%2Fx8TmCOJ1OuODYxmDB1%2FdsHiy3pCRErEoOzC7%2F4jRBjqkARqEQwg7dROTTujNzbeHwm%2BEg2%2FnSqY6E6841AMC0yZIyG8Cz9Q0xjFdDLGvn%2FIhV31fmcTEV4XTgvyPzwkzy6yhV0v6rVRJWKpBXXzZbeDTkHtpk7XDFL5YCw%2BtqgD%2F5Cme3zSUA6JxrHbuIjcVjl71DRWnQY76DfW2lL1qv15AYHa4%2BdWO37U3uyCx%2Fu%2FPgkf9MNFzggHL1LQCSegWIE0mPL%2B4&X-Amz-Signature=76764bc3451efa8a71ea271eb33bf998c7816920062c3deaf1acf693c7de60ee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
