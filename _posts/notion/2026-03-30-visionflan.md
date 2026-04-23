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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466URMB272Q%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDyy%2BZiDQ2i5uo3kRl9eitUOh4ZM9c82OiFWW1R5Vy%2FVAiAECJG0988khoGGKkujTUK%2B3vdX7RLU2F1GWG3h8G9CJyr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIMMXBHXJvdFijFNHnfKtwDdvVhfQSYtwCuVPGJTGo%2FB54KJP8mJedJxl1VNFd06JhSMhymFy3IIZRRRHDqnkBuHMM9gn1erWMo%2F1CIsdqFzzl4zm104u%2BDDLbmfM3e%2BVUa30LYn22B%2BnflY8mpAxeoJHYnZLzFaMKYoA2EyEFsb%2BYcHga3wsz0suUbJXNL4F%2BZ78NtpkSEd55utwZCFVesO8UyuDUWw7F2UHwpHG9ksLlod%2F8PqPIfK0qzRyUJp8n2Os7uDD2JoHHmSvNq8IRUfoe6x%2Fx1f9g6BFCgLwkzzWBxljZhpPNSU2%2BMniuATWuYy4v5z%2BwaJv6f5e2NZTIfFcsBT2N2%2BEfrAxME%2FqH0AvRpcKKlQDqdqtzhZZsBLOXzcm6DwrC1OBliX4AGNT4s%2BeHkGjW%2Fp28ZKyZsMTxXFx1UJzCYAcH4DK4f%2FYcqBze%2BkYhK98QmIeV%2Fd94gYx7Z8VTIq45un4Z%2FjpnrU5FvJuSdYyvO%2F%2FSMuKBo8xsfZXQvyKNS%2B2jUPiISKk6s7O5lY2Il3HOKo4H6t1T26KoLOM80u7m2pfnnXvWAhL%2BOKCDFi3j1KLiTReJhFlx4k5CSGo8dO2O5pPJB5wG7HOaOjnxkhIV3wHxRss2UpPZKi319KtiP69T7cDHx6okw%2BZamzwY6pgGbc2nbVaJKVT%2Bwgs6LAQvKZNc3ddZuiIR15LNdCxE48RfRO1MdRnOJ3%2FkkEATi82bCS4Lmt5FYX19suLqmsG8LzonX9i48L9FMpGAYb%2BU2fTb6b52%2FmPx89Hbfs501aNJS0hZKTBhyStvifLtalGzjEVJSnQoVDNGCmREHtBtG0d0Kuw8kA8HN1itojqwEZVNItimLYMTkvVLNEzHNsPcmMEZNmP3u&X-Amz-Signature=e054a53adfafc1fe619371b79bb6c361b4d3619c7b5cd6185d8ee5a864fba172&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662AGLA33J%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034520Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDzTGn1Ey9aQ5VziF3qmb3b2487jD62MgCiFddUd8hlqQIgUTjaJMr39kPBq%2BTf7ntiUxce8nwtlBKMgAoP5jhFt1Uq%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDO5x2%2Fge%2BIFJnbWZsyrcA%2FrIqdH4vPEOwTUzt3Z8hZkVe2A3w%2FkMK7AdNnKkcotDDStow4bWUShqjXh7Xm9uLm6eecPJpIt9iBShRXCTf11xChOpz%2BJdc5oaPIukOH%2BjqvpDZ%2F%2FpY%2FPNQT8G1%2BntyD9bY5JJxttQexLCfHsbIjw89YbPXfoIBeaFHhjsi3glxQfRXa%2FnW%2FN75ebA1MaGvTyq4AgKdOFEsw%2FOe9FXH8Jx5ssGhvIh3YfIIttabQ5Lr%2BTP14T40ZggSTeTtlWm4pQaJTSV04wPwjU0RX1Fw5AUD5SBjgJL%2BkzL7xul7aNNeXApajRCBI%2FbGUb6FkyhLOXs341tHTJ0256ZMBo5%2BBH%2BdkUUbI6wxxtPrEOM8BcJu5Qa4PBH4dkgeSDMdDS%2BfAmWnvT2qn5QG0nPMhd6gTbWJa8y%2BsaDmPahbnVRm4vME2iarxJUcq4hUtg7cjA9lUvfWXWJdnad%2BuMQRZ4ZZwDmIMABf0oeInGcNAEXlywb%2FTIqqeG8Zv9qjiy7nH%2BmnEe%2FlAu%2BeeXSMArdxekeKWBjqZtD4Kry0MwgY6x3tAtB%2BmIrYPMrLwZUgx6imraNlpkFg4f3PoSnOpuwoP4G2ZdnWO2MqVQjLkSIr%2BMzlEE6IYjkeJtzGAfSAYjJMNKdps8GOqUBLIvs8O%2Fu72JM%2BhK7lsYij6gpSN%2F8m9XY%2F3XOXB2UhZW3Im14qNbcGcyKhzEj%2BJTgyfR9VWXZ%2FHO8e9OgaHw0pMzhGgJyyrbHo0rYme1cSXw5q5rZWZlhC%2FEkrPgXDHNc0iI4csgRpWz2q1PLckMQ%2BAf6vIHH%2BiU%2FVCmxsmiOZN%2BR%2FHdfgn%2F0vT3DenNkeD0ief5IxIh6ilOBaNsczNKcqY4wUexh&X-Amz-Signature=86fe36b5f5d25e2d5c1b0bd4bad048d871b9ef7883c3a73620fa623ea8672b0f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XLXSZXWL%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034511Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAoYKGVT28mRBzH5ScwJiSpahkJndMTydWJI%2BgFOcSqZAiEAlizhSL7CTTE9NQBRK5GY73PccGKvSxER6MzeYmoiWqcq%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDCBRIDa8skh%2FYZloWyrcA5Te6MpZnBqhkVmOBw8Rp6MXSvMB43A683QUC88HcaY0cMk6hbNFwQHDEfUOuRFwMXMw3CXvEGW2v%2FBSTXupgvJzttCJ78OIv1CZwn0hnx%2BqxHPrcQF9tiS3FemE%2B6b9FgubFtStqlKhJxAJLXwsytk2sddji%2FZMBeh8RC4GPM%2BG%2BY3ar14Mr7vt8%2FbPd%2FzPT7AgI8LsFTkG6STpaWMrLzducj1QnWLol6%2FJyOqgW%2BED1G5D65uWEzyr2op7XwIcnTCcpTwmuoiLApw%2BccbPdudZADUHRy2R%2BwLIF5yMzY8PODBISLtLeT%2FStfNCCS9JbKOo4y8krd9mL7yzs4LD42uNKpFMObF8EvB0zRG0OMUY%2BMVTxIpsAya5LskmFMEG15N%2BqJaAFE1swVUPd9bt%2FnRrHAaOvSAKOPy3ox%2F4%2BYKl%2FzmDbYDWffqGfurvvA7WPuiDDGg%2BO5BHh11PkUiJY25GKKHJrkL4T%2FcwcAzEgFAeLdIUpMoT3jGHa2N8hFrxqC6EN%2Bq2Mpm1yd%2F3GV%2Fs0YSptH9Ehn%2FuwEF7uqgKcMz6x3A2ktVtl4sEkqGlC1gXwxxyLUQFy0t%2FEpG%2FtwX8qBOoXwyNvI1aFYrFq2pF91MuuOjJaeFr7ivww7ZSMKObps8GOqUBFeHA%2Bt9%2F7HJBExO%2FsDOEFgFmaLpcy1CeIfgaT3oDl9Ksv2BfzAB%2BPaluwBrI%2BtbW%2FHFQ8yBmsSuWJEPLWdlWN0%2FmPypR322WE%2F3veuwP%2BTaB9m%2BFUUz1xC3teKjtDncj29IOmtk8l%2FNZ9Ddw1bh5ABduQcY6EpHw00zcUhkXaW%2BX01M4kiY4L3Gx9YirJqL0LQiSKsA%2FQ%2FbcFSyo2GPM3OOd9GYD&X-Amz-Signature=2316d778a9c7037c7ab50bd9d2cf3f3e03bb750771ecebcecf7eec2a2b21332c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666TV4IQYR%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034528Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDHddryc73nbihW8GRqcQTlc%2BxNqZk81qzU0mUctaVoJgIhAOCU%2BgbVZEZCD94xJToO97kS8W9%2B1JHT6Ani4yoo8kGhKv8DCFwQABoMNjM3NDIzMTgzODA1IgzScn8RBSU3xUxEPykq3AMLZYKj0zRDNYbgLWp7xjiTlnOE54JL6gfRXW4m8V7EEDQa2dg3rqX62n47nNglvIYnR%2FjJv4IqIRmBdLgp1K%2BRjDPMeC5m%2F%2Ff9PaikmUFCHzGTmYuLyJlmVTXtGFsafsIKdrIG160KjXUMnQDLai0sG2bLJzXQkHT%2BO8cRKzFfJ4U06LQGkzL3HB6aliku%2Fp5IaCrdeSlY5%2BvgdVQsOD0ooQ5%2FYm%2BKEcKjspfQRFsvj51RODQgj5zU1cCYeNnQmXAPdGlL4QU71e9xt6OkPA7TBGXQxeSiuB6Nnw%2BnTgfiTmRpvS7YNFveVchOEKPYDcaqIV4%2BNmypmT8Cy0PaAgX7SIIGLvz2hPa99q%2FJGSkpCUFOXepeQRgH46DOWoTuDV2%2FIKTqhFmYfoMPGw2Y6dCRG6VOOoJ1nJS%2FGtHw9rmJwEjCvLJSQJQxGj5h8TSbeAxclp2r%2BBRCSQTiLi6j5c3tIeeRCeYLziz5KUZMnVmNiUW0JWdyPRMRQcWmaIE2ZEpZUz%2Be%2Bg1of86yt9dZJCyT4WE3AFFT88l5ZQqaPvE%2FoZIQjhpOuWJP5tVorwrmuF7wAXDemiHoHHNU04GZaLi5dInQdUbTGmWOF7PXHoOhAHpAk2YnY81kZyZgWzDFnqbPBjqkAYaTCRrl046A6c9KVf26hPv77ail5AyUh7qmquTK9%2FrnS5E6yY3%2BtpvQPVVaq99O9a2mBQ8%2Bmpn0MY6sMeuQqb7szuFlRDPKjq%2B9L3oTaAN3FmC%2FMrK1fYtkP1HQzvBuffb660TsRXV%2BpsVJN5vMbc3BaWigAz%2BMxsxxL2rOmNxCQKietdlDsgrF%2FUdhcPu2kne81GY2p2npYKF2bo4L94CK2BKa&X-Amz-Signature=30b4e5aa692013a665ffaa42c7f6acaff6714f7d4b858e0cdf4d1ec5be7fd6fd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QYWC3FB2%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034529Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDcgSWPc6GTmj4UkqsL%2FCuN8oBn2KYMmE4DbcV4MYV4QwIhAKOfyn%2F107WkZCoHOEKKlvTrFyWui3jKCeiQtFM3nAcDKv8DCFwQABoMNjM3NDIzMTgzODA1IgykY6dHqmti9LKMFf8q3AP%2FdKGcAvNFoIPJ88J4AUXMgFQC2tEUYhmC9EU3hDc%2F0dnYvWqjBpUHlGoiQ%2FEiaQhG5O0Za19MQUeLrq9%2Fk3%2FX4%2FOsc%2FCZ4Bq%2F9hr5gi5Cl6pfdTqSpIXceTXkOjKnQpzQ4VdNL2qF1CoHWB0E6C5EwVNj%2FhBLH2jZW2VmJOGizkSG7G6EXBZCfWiPjZYKt60HcocdlUxhwAClqu%2Fjfmoe9%2BCBIj1Uq5aphcYDDClu%2FZdX7%2B3NRUY%2BEjZiL0Rs2%2FhdKYul9zuX8DdSzdFq3bUul%2FXbZI3luR%2BiPa6GHJ1BPah4wddnTN3PIlvIg56nQN3wa%2FzAgH8mofMd9TJRPQMNmFJ%2BAFaLnbj9G9RDVIWUgC11CwBlqcucaZqNTSt0fJMksmChnECsfF4xRyFKcG%2Fw8zM843R0u7tned1avLfXn2FIKdadWkM6ep94%2BKdycYLDwIqyFhKM7W2svVBU6EcKaY7MO%2FvNtvlCRd8KcSp5OuSxUz4GM6Q1wf0NTHUbT0H5qGARb4HGkiIZ5%2BeZGaCMzAOBDm1bzPrscxR5W%2F6o%2BgjR4G654eJhYj9xq4vR302xqIqE65b%2FeMIlWnQaUZJyKZlsFfK%2BVeBAXyyZaafW7R1TCjSDx25k70QxMjDpoKbPBjqkAVCmiBZ1bl7EpCyUaT4%2FTzpiC3fdqNZwWsy9Axa3YHuiMfQ7i2b13RW5XvbCDrH52A57BvPmrPx%2BDpWj71k0ALk90xRlM9X%2FxlMKmoyAzMhGd3xFv6l7aczHGaMSuNeAKIrd2Bplhwf2cU8b6HZQRRLdNHtHNxPN%2FODpJVQg1ikmKpTi2JdBHrnxMkgNvw5UwXvDHfqYiwS83Yhsn2wCckma8JAs&X-Amz-Signature=57998b295f480b301257c5e462a7eba885ed48fdfeb33d65d74eb3a4232dacad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W4GZVIY3%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034530Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCn6rZrIZYcp4nT1Ccxv5pGVpGCKj5ZrCF%2BrGC8IGJ3AwIgV9KmfXCxUyrCxNDz1JfQvsWT1PTDyp2ar3Ut80PP6o4q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDMswlRB6tQ%2FZYQDsyircAx1NXqZGJYgk9D6%2BBVyAWCnAereuDJvJ8b2RC%2F49ifnqoCfVIO%2B2rycCBbOxNlhU8jtSl6h2h83t%2BBuAcanvpmT%2BqX8DTeLZjvgeiZBOfPEfYlVMUWNo9%2BwPk9vS9VtOpG9mnL4EILci%2BHDERhYxbwMHam5w%2BEwFITzINY%2BBNItiNxP4jS6uxlHk2B%2FUNYwhxJM9Oxf0sBkHJxvcDCtkjTR4XrmnhQhLy2J%2FWkjm6sLHaPQ4GzWFqFb%2FTaIf%2BVqYQf3HOjk17wj7egeXfik7M47TiriPVSMYe%2FRVZLPWDoCzQfCanE4WvV68KbtL8HiVsSxmDFWElLJmG9DFy21%2B1fCOCyeT%2BpYcVIF3XTLwMi5jLkJ2ienM3c6fJLr9GYhbZKXzHHWeEGMm6xUtBStK7StPPv6jHnXZeiTP7Bts7bHUHrkb4gWG9oKreekhd9pjjzq2DR26mZkJs6K2RgMNCjCsyIxERhUgk1HLXtMNjDAcVuONS81c7yoloVQe62%2FdC5hcOTqOfSxDxJ2w4OUciakldFYp6A7ZRyal6aPbOzjUROjqKCqck9%2BRu7LjNVM2oqFKOx40iUtaVYQEdsLKQyLMhCERZ2An6GMAE%2FUZE3z0KXBC7vcxjz1WYNzYMMKeps8GOqUB1Htut5u787REkhMCKvRTgwtonjfClJbYvmclLze0ehFI6XPTfGuN88v%2F6qfk5lv2cPe8eLmkhWY4kpmhVmYHQPwVIpAWNOwJii4aWjciyh8yO4ICZw6ROmFtFwGuComNrCGtNMZZqmb0Fuj2dVRsMk%2B0lWznvJZdK4jeZmOmTiFJe%2BEGMQ1Gln5V9geW7pxSr8G0htQB4%2F8EAbgAZSrTSz8nlide&X-Amz-Signature=4afbf7ca88aa089de33c0071b05472b223b00d5f8136c4bd3e0967f2d149ccb1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RQUHHRQ7%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034530Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDHPS%2BgLimXBOZxYYrIe8HViMQqEvl2DLzqXvZtVVdkOAIgUsto6TrtWJgQrcKlPFmd9HSvdodtaW1OGetlMkCpXS0q%2FwMIXRAAGgw2Mzc0MjMxODM4MDUiDJMboEd97PiHpKifdSrcA6ciAwm67oKg8ImiCwif5BIeDdIwEbtaS9I9LkBuJetLI7K4OZcvSkv6eApaBYnz7mMjzN3uGQ%2FM353aIDIT%2F4AhphBqDNzbzBLVoQObyogyE4K6pcK0A8SJzKt3wwrQ%2BBBCP4ep3ieBSviivDdH9wUAfOPnTVpnlh48i%2FFc9u1ygSBGuwCXieWu8gQFwZwhttJb24D02%2BRVKy5X34RpeK1vefJWUxdjYhDbBqf8RFN7ntC5Oo6jXqHjZX0300RO7tnjFeuMVuPPVJRT84za1zONEvC9A4UzwQhbpwuHLxhMdm%2FVt0pPovGNWvCDEvIn7zzRJn5NZdb%2BkS5Hcwap8Q%2BfyHUAOyqv%2Bujzs9EIrWpN6iNqtuwyYnAfS3ptRfISsQjIMe0ct7o%2Ferlwm1iD6oT7e3j5%2BMGkdFa5sOJMsHVJfGhZx%2Ff6CdBBLPPdwIYpMVPSx%2Fim1S9GJ%2BFKfsotSFSzR9TCwTAhEIDMk%2FUl4IZfCZ2OhYa6SATSVRrYBnuCd8MseSUE%2FXES20Ii98Xg%2B3eIwXDxRc1MTjLg18Brdu24dxYficRkfuqvx%2BXYxuG8hLQ4Zdar1OHg6uX3FFGFxfiKDaUTPVgQSIa%2FDmr1ivFW0rWmlz7iJGUFROCDMJqhps8GOqUBukVap2w0C6ypQ%2FqqRYL8D7JnCwsP0dNhmmqVgtr6cn5LNUaZ%2Fjs5ukpFIxxQrPAmiIYhU7fLp9SDm5Wu%2F%2FXNX6yZwEKm2oiNYgpXt%2BR%2F0rAnLee3uD2QeUOBhJrKzchmKmEwSwy4%2BsncWAZ1biwgnlSADP0u2ofoyKnm%2B86Ir83VMxQrBW7gyZ0IB7F33QAcpU4T9ITCBT0E%2B5bhGgTM%2FSNmJtH4&X-Amz-Signature=0a1e7471dee015b44f5dff37cb2aaee1e1991e8fc09a6b071ae8b4ab605d94d4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJQCBKKR%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034530Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHIUUO8Hci2ko18egTxdTjKMyijgBPt%2FOLc8TWiw6qOPAiEA1GvIamLN%2BHyUnq%2Fg0aRMatKuQUUCj3YRG41c0WVWbwIq%2FwMIXRAAGgw2Mzc0MjMxODM4MDUiDNJLjMvUNhrC7dn5AircAzbMlM%2FaL4454Pv0aieW7sqbnPQTdrz84WV1D%2BEmQik%2F18vz4V3oMwmbxZd0%2FN5UiteBO30NFCEaaggB1umyhxkE6hotqLiOFJA8k509YvdSzZREMQn9pXvuVq9D8OAvEjZajrwT%2BwKGoVLjgxPBs2ieR8wOhrLFyYF5vLIesRIU3lNKv0jYN3zfgVvnN3mQMQF8Ga41iU3QfIerDKW1nbAfc0F%2BlSlv9CTMTX2FH5TuTz8xLaDJ16vghb4AMSs%2Fo1XWIbmbCJOCjDg7v%2FW4wqCBS0EjjqDQG3AHPiRDZK%2FkQ2vIEbfszIyE2uZhtRsLUlN0FFPVLb5OibYQens2C1ILAEAo6XA9ujK6iBhRFX5hU4WeiAUdIBpfWAuXtvZUOxmeqPJg%2FhN4Ljp4Hj3IhH%2FRQlchrmpCFOKVCruXEF0Mma5yzjtPRsvfVKx0aG1%2FOaMf18B3GFZ256%2BdRYW5vKKpD5lb0sQqFO5p8xmQG4I5dVTpu%2BKjfb8NOLyNQF3c9Pnk4w8WKOwOcBdXE5wt4sw0PbqHasM8MUCLXsrSZE3iW%2BCbl2Vmjd1dHqUKOSqgtVZ5i3GbOMGqqEwHXCXKpE8bNyijfRkEcmgIn6jrYMdqoJXqKPQnriOty9tCMIWkps8GOqUBGe6%2BnmWKC%2BoXvueVbWQT3N7%2B29NNpsV4wX8DjyYD2ctN0AKKToCQtkUVsrJHXE8yh%2BPAPVkp0G4fJV%2B0G1Y4gyYMAsAYCzvrE%2FA4xuSYZd3PK22mLfjIi2wOU3V2jN8%2FD5yNk8D25CnbS7h9EOZFUzXyrbvdmYFr%2B%2B2yYoOw974KLwNtJb%2BNcjCKTmB4mXDNawTGyKWTAkKk3MNFXM8FmdY56G0o&X-Amz-Signature=9dd84bea1fdc3ae9c67f027811023efcad3070043aa9ecb510c94e862ac305f1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RKA57M7M%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034531Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBoJUdJG99dn%2B2%2Bvsp6Pivn2bTpLoFXUNiybLLvW%2FZDlAiBHJWCOXXSMY%2FLzsGKkakxw968QryE3Lerricx%2BLHQdCSr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIMojzIzCa0MrF7v9XqKtwDPxtYVFKniLalvSnbcv%2BT%2B%2FO2k4zOIz4Y1lf2OGJWLvf5lq2kXxGGSy6H2MDErqZVKgjvPoHM441zpeRrzKGrwPRg45MZprMiCi0vX8rinUvZzltY6E8%2B8Z4wU8HEPtPvZqtLuzuzZ4q3CB509%2BflFZZXLs1a09BgI4cmTI9TotJRf8sswmqXK5MRya6u5%2BCNmbT3XpWoBHB2KuJhuI1CqlUJRaGvkeFnOs33WKcy1sbOG25KsZBwdLzCWMwUOzwwfNHmW87ZoCG2Girc5GN%2FPDzMsAO2uwCIDZna27%2BbxbntRHD7P4xtPRcGFxWLTbQ6BzuPB%2F7Ea0beQJoGhCt4otA0xmDeM5ymAi44AodsECKdV%2BCMAml0R597BEgnWKzrh9UUQ3vzOR8YHE6V3dYGXP7oA%2BA9mRqgoMcFm1zbjlg%2B9KXt%2FhNTvyDd806SZdv3Sfdb51B5f43ypa24mNSzzluya%2BzgT%2Fax%2BtXeOvvnQh%2B75z4YMzTDU7zeNK6Cx9zzeqqokikhgknl7LZbrmabajkVSEPdk%2BQfZsWJi%2FcolRGo1F%2FWA0lXYI%2BJuucHKLzD83%2FJ%2FppnsFg1E37FGQ79uwfXN1FiUbYMKCVgxxVClBfSMcz7r80Yij%2BtnV4wvZ%2BmzwY6pgGoGKV0Oej3FMaB2e5X%2FlHn0gfYkC96Zt08hZiD9pCERiTuoJpq%2F2yGNTW17WoW6J30MsT4DZezkF20nF4PQ%2Fkgtz1rz%2BgSlr5C2DbwKr9TRERAvz6YFBra0WNWskWF0pSDtC8YGt9VP17JrQONf8%2FgBg%2BnI5KkPpBioo7eEeiWbZ4RIH%2FNqRJOB2h5VEiAA%2Fn3JkGgKFIK6x22UsPJUP937ztxrkt1&X-Amz-Signature=5b3f8065ecb0bd6f136d4b2a99cb9a75c22115f0e78d85caa9062b140fd32064&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XB57KBCX%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034531Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHjqxObXfrVV9WxjUC%2B0oNlCzhOCoN12Y%2FXAXaXUPTYxAiEAjxxc02ldGui5XtZHpAWOw9cV%2Fu%2FMSihX9WJ2VobGPf4q%2FwMIXRAAGgw2Mzc0MjMxODM4MDUiDBaeOJszCiqUxFK%2B%2FyrcA%2BIU3fr2TwEQN0cxldTT2A5IGmbJnCruqE2EK0mtGrJZ7GQHD%2BeK%2F%2Bc%2F41ntT3gO4qqqgy%2Fqb%2BL%2Fx1%2BcLNh76RCQM75BymC6zHy2%2BZDXqL%2FJbSCtSmwK%2B8mY1hRJyo1Z5Uf2I9NXesY%2BlDHzreWeIvH%2Byfq2ZdsDzHpczZexZLLn5AVlYq2X7sxjyoCOdJIWALMKrSegNO%2F8lMLIB4R9ulKNO8OE3Wnid3a62uDw8O2qrQ%2B9uFBF%2BFeHE9yNtOQzFoxQ5MKZPj6qa4LjHpp1Gm8%2BihY7N66uF9heDy4P1cefXAG40aRfOD9wUCMv%2BEBvBDMVlj8nkvbO7YDbQo5GNrgEPqNrmIXE%2BOk7YYqnbDv0dQlH%2FiDEv8%2F%2BboyVOezoAVg1aI9cbyhQ%2BlyFPoV6tvT8j8BmV%2BFry27GcPWTXN2Yqw%2B8P3H8ZAaDfguc%2BUu8ajsmvIs1DohNWpAWqDTdZBoStKnhJbWN04GGAVhFEVAF5HLUdO5Eo9xZyH%2BPo%2Fo%2BdZLCGGIJruyawVW1CwTPRjr%2FItXFB%2BcoWSYbIwR6wEBofpiAPJvNXzJkH1BhO6w90p1n%2F%2BnE18I6rGXGnC4jdwztCcuyxomSARcLYdPyrz%2By0hqmdEeA0KqnYPxGMIWkps8GOqUB6cCgpChuEeafgn1SMOjdtXbpbv%2FUGA6KJ%2FapqoD70i45dQpqUmav2C79khRq690JzGPoy9KBnIHckv9Owcc9DFEV9tpooDVSzj8G%2FzPgd1Ag0Z5Jt0ziWKJd0qrJLxZZE5LneluwRGVHINvzjLiQt9X0ijVxyNs5s9ufPXpj5ajKe5htwwI63%2FITPScie6Os31KviOsQUG5UQV2X1vw%2B5K1SpS%2F%2B&X-Amz-Signature=0a23c10e1d9fe69fde03a909a9c9ee87a1599b75fa7b48f25d2bef0aaf05653f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZMAYTAC3%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034532Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGxA8YWxNWnq8%2BqTwSDdWG6HB3aDhYEoO11z%2F7wA02eeAiEA7QJ%2FvbNU9l2grvIxodMGOij8pnoG80MvzKWCCozeVxsq%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDPMx6zq0dkSG11ixXyrcA0n8XYxSSKtgKXjw3ViK605VVL%2FljEMHLN5tHtnLN89PENhGSJml3IPJ2ib%2BzBASoeWZaMBCGbOCWXMaMVA74c52G%2BqeLhVn%2BEfvxPROFLgf%2BVl0utyT97UZIpAKSQQlyKT3yZiRanjvpThSq9HQZbqLz%2BPuhmDcz0BKvCgCt3KntAcPUQeZbvtGwIwqikqn3NzIh3CIW1Ns33Z9AscgTq5sCACRhT8vRSM8AuOQ7uOwYnL4FFmc%2F3RwUIkWaB7ueFHmUpatk9%2BnNhO6EbCAcoP89QlPjLvJRric5Cw0FO1w2jwhq1bxavbU9V3K%2BI9AkoP%2BzVz50bOsrHojnlVKWAftO71L7JM9V%2B%2FArMhsCBGb7KoVmBpI3KNE0ARR0IAnWMKfaaS9Cxj0vL8pejIog6a%2BHBzulFEUqnwAGxZAMnWGABhn8ry5apakrXG0Cgh7IrBco9vIgkkLfcmGk97l3bzka8vytvCsz5phVtMwgCzcSC%2FJjl3wWCcQIeTLrXlBLtdbaajAU%2FG%2BEcvCOquZzKl2PmnPRwbReUx%2F0hORur%2FzNLAY6t3jPSNJjNa%2F1ZRzRXB092v5SoGQTV8XKHt081yzr%2FHfz26ZyG1AMINTSU3kO56VIhoyf%2FvOpZgRMOOgps8GOqUBpD4%2F5EPr6qkU9uuwouzXpWHuz0cEQUXJjbOAxy9h2w4VUhjIFNfinh7Ae6dXQFJ9aiuBAAaGEZIH5sJbhIb2Nz4sn2mMZs0S0gCn%2BmeXw6YZrA0XnTYFJQUT8S3COjqV1vMuwJlM4PV2kf2CmbwU2TRXfvPK5emU7IVG6RD6SkxMeNU5WlxO9JX6Ij3fsTRoHKSBkVdwcvbl0mDFqFcJ9yvKX9Ie&X-Amz-Signature=aaf7323096e00759a863e7f53ca48fdb3b5730be18131bb3236992ce2fc3d82d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SQTRMVTH%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034532Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFz3bJwwSMEDXzexAwiXLBXit1Byzen06b6hrFmdQI6SAiEAteCNnqAird3wKRyeOBe7zPi7RZRe4%2FnU9%2FUxZhneeI4q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDAFzcWx9nmIqpRjMMCrcAwLYsZgYSw0X9xmKF3mkV7NT9%2B93lt1PiLKuUE4Ll8qhKTl%2BR6maLyJW%2F8gHpBqmmh%2BsIGSJ6aM7B4fBbJyS3CmmDjR9qnJe1CUor723xL1Qw7Zq6Hs1dDE0tPNMR5GLQdqVJg22wfvgeSIos87YLlcbuvaKUtHuMDJXrxuojKKGqAJCCwd5u%2ByNduagB4TQoHSma2OO1ksimWgjkJz6k1VdcQi85c05a5fUhGS5h1SWviPErTBXC8EIfjV8N8JG1tOSUpnRm3p3Lblz%2B1un9b5wEZS2vh1H%2FJJlbR3SvYcCcy3R91Ob4604k0vevjxyFfPhTr8wFbxMGe5cprCz9ZE7eHrMPMAvZjuXVoL1oQLH9ENwbiGigeYsqv1vFPgpIKM0%2FV0Rspg6NtN0Uik%2BdHSHQSnMgTx2TgGs4oLAq4jaI8gGvn1Bd9ujrPgV6EuKdI8Jrv0KKeP4JTpBY9aLYQtOZ7QQV4R8mngK9xMwGQyUfUa0KIGqGCrj%2FNgghUC%2BpaXq3pgvvY4wYLCvCoJHRcjsazfcUBPLmiNGDZLb1RMPeyu5SevMN%2F05BVZELWJehEkH5vREMrV2MIXxO%2B8EgkPDlrBQyH5LQWtgIUhDFGY5lS1U2B2le1%2FQ5kfTMN6eps8GOqUBh5agoOxNYl%2BeP7hXz1hXNGwqiBT3IxsSyMmQtQMmwma%2B%2Fpjs0qDV3Ngu%2BBfqngt3qNB421Mv9c08tWDP3j7gKW1MpGoSTVLvzzam1u5XJ2gzKKxhzVR%2B8aM%2FdOTkyg7H4cBc5Q5a5mS6Jx4srqPRYgV8G1Do1HDOHe14yHsa4164uNb%2FYb2ZN9%2Fxf4sHre13d6XjFsJzjAlNwLsQaqZeWv4gQSlp&X-Amz-Signature=03d4b9c11c6b7d0a7f06d2f2d9ce233b3becdba1a38935a7b3a8799083b34af1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665Y4THP4R%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034533Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGfmRCfsAEhsxDgvGXukbKfKJqNY8fpqVQmBQL2gbyKhAiEAujayZCRcNocYCaoEV%2B%2FLefDb0dO1OdJzKWPTBuBNyVgq%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDKca9E1EYc8ZZ7G%2B5SrcA5ZMSSpGSZLQ9dlHdoL0yg7xgN8UxtryZ%2FXH7LidjWovC1QmfPp3xCwqYBnrTxmOtWR34ArxYxaawb9nk17lqvUsxNDcJ9xYLcK10RDVU92c%2FfzL1ohVtVMixit9%2BbLdHkndizPkGES1B11ZAukUXx9I9CrsAJJPpTEYs0DUAijgKRH1Cl6L2urV85lV8k0ukJFBHrLA2ffIp2V%2Bhz3mkvCpO9fMoMAkGsa0DArQ19PmQGVBdJ0GDc86J5eNOGh3Kq4%2Fu8XnTW502wIClsnFi80XC2ezm9Y7R8RwNjTebsl2z9Ggy6fQTBz3EoiMvxeBKKMB%2FE8ssXz4qNXoHXymlJ0RqpjM9XsqbGd%2BZ5lpM9665IXHATnu%2BAcFa8PlElKOi85MQOHreOmsIbZ5hknTQ4AkNew1uWOiodvoREcZkACDa%2BoxEOqfrVyWQLDHSJc2lReqDpyjn8YMqxWHYQAV6nEy%2By%2BOJQ1wKqfKJrH0XNJHkKg2vCiyQUcu8CIP%2FBfmhLoZTlANpFY3%2BwakilZ3edeRNkZ4WGDtq1bbTzWjfS1vxpJ4dyPFmcYCZj7wqsyk9QKxzR3luyizFXghDp%2BuQYXx1X5SDvUhaRsnMm57yEEvKjzDUiO6lHzW59wIMMSZps8GOqUBOQDGgfIg4PiI4AD8H%2BqsJNcVRg%2BSYfN%2F999aL27bHenPTEaX2DtTrCKUN0LPJsdgm4niMN3%2BbG3T28FjiZQ5sK85tF5k%2Bk8ImOqWFrQUWWWfBl7zQsE8qmvO5FfxgqTDUYWdTmT%2F3PKV2bh1IFya6jjCJp9uMTpD1EoShwKzYrxkXN1ZcNPMNvTBw6XuW5o68vEigv%2Bh%2FF8kJ0fEgNrxVrGg9vkK&X-Amz-Signature=179a7b40f56c269750197e7b3cbdde4b6c97148ded67c512435707d7b6977309&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665Y4THP4R%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034533Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGfmRCfsAEhsxDgvGXukbKfKJqNY8fpqVQmBQL2gbyKhAiEAujayZCRcNocYCaoEV%2B%2FLefDb0dO1OdJzKWPTBuBNyVgq%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDKca9E1EYc8ZZ7G%2B5SrcA5ZMSSpGSZLQ9dlHdoL0yg7xgN8UxtryZ%2FXH7LidjWovC1QmfPp3xCwqYBnrTxmOtWR34ArxYxaawb9nk17lqvUsxNDcJ9xYLcK10RDVU92c%2FfzL1ohVtVMixit9%2BbLdHkndizPkGES1B11ZAukUXx9I9CrsAJJPpTEYs0DUAijgKRH1Cl6L2urV85lV8k0ukJFBHrLA2ffIp2V%2Bhz3mkvCpO9fMoMAkGsa0DArQ19PmQGVBdJ0GDc86J5eNOGh3Kq4%2Fu8XnTW502wIClsnFi80XC2ezm9Y7R8RwNjTebsl2z9Ggy6fQTBz3EoiMvxeBKKMB%2FE8ssXz4qNXoHXymlJ0RqpjM9XsqbGd%2BZ5lpM9665IXHATnu%2BAcFa8PlElKOi85MQOHreOmsIbZ5hknTQ4AkNew1uWOiodvoREcZkACDa%2BoxEOqfrVyWQLDHSJc2lReqDpyjn8YMqxWHYQAV6nEy%2By%2BOJQ1wKqfKJrH0XNJHkKg2vCiyQUcu8CIP%2FBfmhLoZTlANpFY3%2BwakilZ3edeRNkZ4WGDtq1bbTzWjfS1vxpJ4dyPFmcYCZj7wqsyk9QKxzR3luyizFXghDp%2BuQYXx1X5SDvUhaRsnMm57yEEvKjzDUiO6lHzW59wIMMSZps8GOqUBOQDGgfIg4PiI4AD8H%2BqsJNcVRg%2BSYfN%2F999aL27bHenPTEaX2DtTrCKUN0LPJsdgm4niMN3%2BbG3T28FjiZQ5sK85tF5k%2Bk8ImOqWFrQUWWWfBl7zQsE8qmvO5FfxgqTDUYWdTmT%2F3PKV2bh1IFya6jjCJp9uMTpD1EoShwKzYrxkXN1ZcNPMNvTBw6XuW5o68vEigv%2Bh%2FF8kJ0fEgNrxVrGg9vkK&X-Amz-Signature=a1446902119176396464f324bd3c37822663d8e88cc9f3a77f138fc74b6d57f0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
