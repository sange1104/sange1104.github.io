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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664GPJBKNL%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034602Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCoU8Y8EQAl28o5e4a1kJ%2FeeGaIFWjVAI1uTPlUKCP3mwIhAIziBh0yqoNhFKg9dKscOpb4M8S0Mz1BMN5WYIVX71gaKogECLX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igzmw7sED93%2FqaMsaMUq3ANpFbmZe0cM78ifiGtmaIx4Uf5otuEnLLd0M2Eev0uHsh5jCd%2FGFNIe3ptb3jAxK2pjuwcDRYnHZv1tOSh3g44tt2wNziB6ec5vFbme8oaF%2FBYrEZz89XX9C77xwUpB6MoHTuek5huIgrbxsje63SF1vgEZjXyfDEdIJYV4TjzzpLLp3HbyvvD4hlac77qtfIOWVZGEhc9tMTvfozg4gZ5APqJwOXFWYP9UBY3kUPPt1vRfveTq1qgbufewZR%2BS6X8%2BowuGYqTFWSPn%2Bu7rGA1rDDxUSYX0qzjgFm00vxE27WvotrO5otrNdC09qyqxGEA2R44Pj3XbDIEJj0qnTm8Nyom0AzQkjQEkM9YScF7K5StjAfpfMZD%2F4DzFinyrjYiT%2F1Y7njKqKP81Zh7AkKUWtDRWvWuv7g8VCLFuQo3ot7QwlQH%2FAmeScMiWMQZRJYPLBVh%2FjpXWjCBJ6bq8NM0ZRM5SwVFvYwj0A5O3DYgwDEteFaQVGU8yh2Dow%2Be11WXjmkM%2BH%2FUFfArGVloOd7RSwHLh784o72QV%2B7CYpeR7PUdnoTUZono2HUqU0%2FU%2Fp8ElFlmkaJUp8nl3D14IRRqmQI3LRmC2pRG3EeeRgVLwo3LYFFC89yMGK24ABjDss4HPBjqkAZ0ybvDlFQcFL8QAHKnX%2BOWy7fMVHyfu3T4EkyvqizL%2F%2FXT%2BoIaLqIlrksQEaio3zjKQ3zKQGtw0IdSEKshm0k91QClEpuoz6Vb1fqznZLVTbwnDPpiEOr9zyRKMo%2B6Srxfgh9mYdZdNS%2BnxClWZ17bDRtuczdV8iiWuesHOrR0J0EEvqM%2FcuQ%2BXhN95sWdcTFfi649B3Mnj4gVrIeJEWn3ro3Ou&X-Amz-Signature=047b5a44d93778d2a4bdfa3d48627b2e105f8728e940d197acb9e06390fa2b58&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S4OKYWBF%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD0ymijfNWlYBOqwejihhRzGMCdnSzAl%2F1k5Y%2BFoOUh0QIgM8raBYDVjkS9wMrz8zEF6KTAgi4oZgIbqb2vB91eCRQqiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDB%2B6ND9sfIhvHMHbdSrcA2CYDFqAz1SYUN8mBQ8iBqx2v%2FzbX4INXxlTy3oFGHJaFjb1Uhv8CBmrElZK%2FyHdmvU%2FQcx2eCN0%2BMAIcX95mMKDVYn%2BzBu3lMdAHONGzlYr7VROn3Yicldk6aPcP9pfIr4szBCuo1hbf18VxI8UiUdT%2Bj1eo6vGmSGSA6xyYTKBZKbkBTuM2DifAN9kqauD7FyQgOl2b4oST2ef4pRkZISqdXuJfksNYjgDqEvyX3%2FcBjizKaXhOCrp3cAB25HkiyqI4Hurd4P0LisArR1wd8TsbzxZhibgdeErlGgZfllXvOO1mhLoo%2BCyTf1r1PRymYmsZLLHeHi1nGubsqBbOUvbO1%2BwKp8vNq0Vn8sU3sKV3YytFC1KReQcYK3m28SlxIGAAUGte6FqKELgT7zz5EmX1a4olRLNgRPsp5zsD1mUqmY3v1nWt5BLy%2FWJNTlZXm74CJSgbScLcAIMgk3WLHLiI45qnCkaSBF9tWzulvwSej8I93qHTw%2FCdKU%2BNH374kU16iE9AuJr9pjD1LKYY13Hckex3WuxJUwmyn8jUn12o8%2BsP%2FL4PM49WjIMph5NF%2BtqlwH5ESMBZN4CsMCCp1SBh63GinSREXwOsHH9%2FoLVD%2BGSuUC7FmJn42piMO%2B0gc8GOqUBHjX2Tu%2Fv48z9IkTEUAgz1dCDlxKBZpMxMfEADNeVfPpFFRvrdfvDhrtdgJmLvLh6Pt3VZ%2FNBJIn6BLzjAGjv5ivL1%2BhOtAl%2Bnko2mzfK2%2BOExlqg%2Feu%2B2II1ww2NH2XlYZ81KRsP9hueOHR2Vicr5FVsNbVXJZpAMfkOMGY%2FsW6qi4saf8G67UVWbOl%2BOkZITNpFkL9IzrH9dN833LYiiIezzdmv&X-Amz-Signature=6ff6763d4e73c7447ba62d39f9d8fae4d7f053620d9e61ea20c4c7a0f872dffb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WATUCMLL%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034556Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHx9DeEdYjehTHiDWA9gzMgZXDXxJeNq1FIMSGaBpt8fAiAaq4vTs3U2F2kyCQ4j5cG90F4Q3Y9DvxDefwhQXbdwMCqIBAi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMpNl%2ByRAq6iBk%2BbLdKtwDP4mZAS3A%2FouClqGAXgVmH9BePBVxg%2FXhw836M1vaAc7XlEMBmJJ0AcZgHO3sy2dUCw4xjnJSB3EzovQ3vbiaxw4DHGrq5a0CPzKragdu6jKes2u2EDCmmC7MS0qwbkHFTzwOsqPKEmsJCV5xcge1vdKMNCGXLWTPgAdhOBIdsNJN4c99KQ%2BZ7jWO%2Fspge%2BBFsWh2IBqCLyG%2Bmq0xtGwNnHI2g98VJvoBAPBOHHnrUGqio6OXLExA28LHIifDXNZDjbWsXiPZrup6m1BFWRBywv0VRdm%2FurCkAxrJxg57k7nxITS0P%2FQgP8R9g7zsAmvurHyWPiCPSD6Matpj5jrgcWydieKZoiWrTe%2BqkJBcI5GUfz4UQijsBwzTltWUI662RntfNgdc0LqhLK6VnEWetvRSAanW7R0u1wBMEbi3bQ%2BpTWmoapHQFDtZUDQ%2B7uFg1VPaKq4INNEKtYD3D1Uw9tlbDqxBosWf4jToOQnJhsYnHptc%2FwNksg6z2EkIKcu3mU8uzp0gOFBOe11IpOfXi2FR0OFyD8afClnm%2BSrAsYmy7Vn0FXqlJ81LBnxcWyq5hsIyGjQ1tbNiLBcixaOkLu6eNxxiKCV%2FZKv%2BMwgRXHKsROIjHwic1P7r%2BF0wi7WBzwY6pgGItW5TKegF%2FnvHJX61SWGecfFF1mGFeqRszAwtJ8yEZL4QEYxGZi%2Bvq9J29czOnq97ac%2BapNEA5h6%2Bsau%2FmoBqucgiDRhqnjEMN0Hc08cmxPUC4lkuSulCJMlSeG0cxUwBYQaLrqqeNoJbV3MoW9sdSgkHrtpz7gOq96wXcg4Bsp6RDCB1U0PVp1OMWg1iBg86jP%2FW1muzrySHANAK6W47J8k4U3hx&X-Amz-Signature=46c1a056909328ee5c516df2e482a7e226917e3a9103668d6e233814bb04ed55&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZXUTLFJG%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034609Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDix4UDSzMbjbAlagNzUuvbqWQ1yaWME5kwi25gEo4z1AIgBwIScLvhC8dKGkMmEAAbPlk5N7FA4ih7Iwb9rWN8Oy0qiAQIs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMucar0TeLrTJQvHmSrcA55cVYP4qmCOnIA1%2FYbchL3yirHpAGRX5xUIbGiEe6Q7Wnd2rqSpK9GQNPISuaNFlDsQy6tNFzmYrI9fMRn7piKNgEfuo5dU3GBa9H6W3eQM9SxM75%2BnR6L6dXfRRFEsu5m3%2F9%2BwW9FObEZicwfc057qyR3%2BMsqyjRGvmO950jFNBeCWPfLClFK2EjYqDk5JlpyEQqR1%2BiMweTY%2BE0SBbO2ucTp10sLs%2BgO1C2boL8WvE%2FR5JzBsLgdm%2F1guNMsQXbJ2%2BdWGSy80Go%2BHDHydggmyj%2FhofquXHSlzw52V%2FUssNVcggn4MTumjyRtZlG6fdxyJp7wW0scTfskCMou0Dv6uCS4zw6oX7n6zEx4toNXpoFSoIiqx%2FOtfFPyrnzbl5zVyUFlShGW6vYY%2F%2FTZOquG4eHXBBy4r1eUEBvRilaVLOVX3%2FqNe%2BSYgtbdaaRm6VmPeUY%2Fp6eRNBXhlz1HHS4xhaY6eSRh3qj%2BH1CtA1%2FqbmYk9CSISKVHhTKKDX1%2Fz84H9N%2FlF3tn0vOXp9mwqJ7myTRrXprg7tECzvCnueW8GTtxXKZCJRb7og130T2jaE81jT38fg5HfUpECQRoFY2nhY4mfw0tVt6IKAp%2FLwkIl2M6gj5wIMqUK%2F%2FGyMLeJgc8GOqUBarFYMkm8gMRd%2F6QjmYKE%2BJ5GNQK9UzzFHVaoKkvEuAn2R4%2Bq86FwE3WGc5Fe%2BPiTn5Ab%2BgOYcx3rfxbzdYvRe4TcOzpt%2FzczII0YWVW%2F%2BB%2FRfCJkSLe9S4o3ilAriN3JbfRi5nzB5rq%2BHKlWVuCzQ4VTEQkY4yjS3vvNlkl7s4HkVqzuei8jpXJ2QgaFIdjqXEtel9nbVBps8X9yHmCeZ1bkgZce&X-Amz-Signature=55c6b64e2c8c951b3ba0a815437f94619a667957638ebbf09ea33435e543045b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UR2DUNKL%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034611Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCn6RlAGrCDM2emAiNFrKZBVx7c6%2F9y5ZRYm3eoQaL4ZQIhAJvecksG%2BEEVkjB03uq02jiumqQIgt%2BwJAvA%2FzPQCVdCKogECLX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxvI46K1ZjA8oLnwJ0q3AMSVl0TdtjZ6RGEirvqs7xsQhbOa5RBXigizBzIUxrQ46HVq3E4BBW3vW53Ftwxgg93SMxp5vIT1P3JajLnbN7qCmEiXXOdp4nqevar18po4UtBuPzkyrkcskK4wkHovcy4RDNUw6b3CeejpZUK%2Beb28buSievFkcSEDAbnlALzUBKgFqkpYnnDWGjluMYhWgwGhV2hJVmbMlm2RkAImGzoPf2jkkFI%2BMQS2O3ExKZhihuWgSHguPaYVy0liPE7yH9jh4e9EJ1BkBquEZNsAanijOCYNxrjdHvcead5IFrmtaY2lpI37M1h16JemIWYGB3HG48HAyJocPbjT2zINMvFz9rmjvnCcErtGk04UtCgE8Lnh8ZJwS6V%2FAwIpEmYDfuCAfaO1sSMXXMpWutR0SKjgcMuWgaIiWu5J5SOmvEovLkUeUMpq%2Bo4mhPmIfGsiOGoYCjAPBNQEToy3l1ivVsHpD0HYIB5WdA8j3nYrQTmD4%2BjkM4kTNT85P%2BfQxgKrfB9vffhQVVULjlCpkyJFzPlpXJfcUhWhEYh%2FKPkLNf%2FgwBE%2BolSgPqZDiPJd8d1sIVws8MEB7MPXL%2B0x5nvnsLHU8B%2FrvQ5pupK%2FieSdeptRJrAwZlE%2Fseh0E5MqzD9s4HPBjqkATK3gg%2BlTREK%2BU1%2FX45x3lxnEIeWmLBXPTHuSQey7PMiWGe2vM9gyBiZR9OaTcPUry1lLPDh3OoQZSaNLbFJnpjlpOB3lylsS2sLy6xD7IiCX5xAuvoC%2BGkgze0ajKljcm6LNfq4djNhIMM%2F7zfbPp7QmxaGZEdG%2Fyui0bfst3hL1t4l3WgrKRAFcer9ugClIK0Byuoc5nIu9Ko1AR574b0Sqn1e&X-Amz-Signature=a29f5fc0a711396e163e574ed32cd3f477f398648ec0003284c9a8f8af95a721&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VALWG636%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034614Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCErIunKEbU34AiGYyaH%2BhjR6shgNUmQlNAFy5iYrDwdAIgapyGuF%2FXa4Zl5%2FBRzeVHaKFXdnl2O5DafWwHPyLCgb4qiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGka9%2BK%2Fqyr9l3EPgircA9VqUajBWX8c5Av%2B3qWhcC1sgtkZluLrNWJC08UK0UEz0GmC1z4nTzPgLSzxJZHdbLsnf62kTRTiHHjTIoGJN85qt51AFUlQpTiZHLRTS1psMo6K5cPMow43acGOdFYLsmIOMY7VA9SejztlnURdNxpotNid%2B%2FyZnOW%2BH8foS%2FYRbO3P0ip6hm0TwErK5HaIc1KEBbWaOkzAAPMWQYP5%2FA2WAqWYmanLJo0SAZhjA5k99347aGHo0RkPBtP2eskKh375Y%2Bq%2FnsRMy7uc7o5zBD7shxuljt4CVaa9av1HjV7PvXQg2S15D9qklbqERK%2Fn8m3bc5ymIsQJMpKL4dOQDBS7yLe7pjeGDG3eZ%2FTkrXGqWQEOOnHoJTH75oLRLC7UVTTfLELsp6cVI0u1YNZt864Ve5OrwU%2FUf4EY38sDIy%2BuLAmhpvCQUpEcWC%2FUSyHqMMfYoPiWMegyQ80Z3SLmVPUHU1o6C2SFWGDczHDYbOhB3RO1ITbNw%2B4NBjWMbs%2FoY28EfY9oPqO9j1cK9aWPmTv4eSiuQNXz2FGgYgkRNvRC0rcz2T%2FbX7B3Onq4vZc%2FQ6HbHiJOF7jjURz51%2FpMS9fnhkJMtRRMVbzQYc3sT2ihBPGWYo%2B8ieSsGSnPMNi1gc8GOqUBHguIUePxeOH7WjvJiV9AEJAlqLnonp07Bwnb%2BVfKbC06Et5CP0IhEfLYQv9wiaB7S%2Fw8I6EmPvndUmXQPW37oQ0qbL%2FZgVgu6Lxq4tmmC9lq8YsNeD2SVwZrryynOxJH4HkCBHGVpY7v%2FlMHeBqdXTuoOTAE6ucDlw6%2B2nkJvm65PZ0z5XLjhKu0bpXuiPQK4%2FCH5Jyv5BOyz1U6bvh0A47hRLjH&X-Amz-Signature=c6551e092ef07625319a5ebf14f68c73af8728ae7d9d18debbf6f24f500c837b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666ZHVFTTG%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCkvBwnYCeQ%2FW%2Bds%2B0mZ2jUIWUD7Xm1bMkFdofGl728OQIgfurLOiS2gPo6ei0yDjX5ifoWPcIIFpICMBVRgMdme84qiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCLoYRgC4Li2FzaJdircAyhDYFjwMZt7tj%2BPqTfkJghKv9n5MP3fsq5Chk%2FsHa52HNeNV%2FXC%2FPNC8t2aJBMoyAp4v2TpGbNqQx6WmNXl%2Bm0vP7XRSxsPg29TjtGw%2FvNT8Kckosk9v73NIwGeRhF9WIDGFm%2BfPZNaJybzFOLR9KTs2hXMQgvso94S74OAZDIRjy4zTCwUgr87HDySGBHJM6u%2F%2B4PQqH4pegTApYXsPOqxAwV%2B%2FMOGj0dR5OH%2BimUhFtsubWWTmWuqyEZsudq44iRE80jjQzqsapNrgX7DWVpHsTXH8KQE1iGLDfCRpNh7rLlAUIpT0E%2BcUIouKPRxunTbL54UKqrvPLtjObQe7VdMvxZnMwN6RmbJErP4WBAP5Xs%2FybXlbGWWPnIfkPJnG0LAyqBWC3vhgeqoF0LL4boFUmOrN62VaCtjASESq6eQsLAsKzQ1fcsSHBhavoxBR2F%2BazqrYny1UKtLcqPQ7a2B5JMmnRDvvPTMYIG2Vbw4yGY1f%2FZcNfTu1G%2FJEDAbXnqzTLK2bcJWGx5eRYSaMYPRmb8RCtoKv3NGCG2lX2nqmoTTC%2BRLhC35nLLus9GVGkSdXW2%2BP0lOYozr%2FOZ04q63N4ABb9y5c3VdMHmJpnWIaVPR90wdHeAt8OBDMMqzgc8GOqUBL2Yxqo5KOUP%2FbSuT%2FOTOQp7e2ZN3ILYKq21D3Jwo%2Fz5iidqBZoT7Ss8BomArU66VaHOme63KFE7XOiSRrPuTCmYlBrx6kKfzM4Eal8daOpJGG9y7wCzDC7uCBYEv3PI%2B9XabTuUY9W4dEJD3EzK60AJelAox6LJ46B4E3Ur796FkoyhggMcboxMXJBlzkCtDQWt%2BshDJPEtz03H2fX3I4Ecq5hg5&X-Amz-Signature=84ded094f5e2100fd1466bf4e0dccb3cd668b3c82ee14cfae5634be27fe0fd7b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZFVEOUGF%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDMhnJX1VVzYow8v11oV%2FPKhSpe4I7JNO%2FddKTSplRmVQIgLAbh1kpoEfoUmnOIwxohzSKj8FckEjXArLA7c2MubJoqiAQIs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDENIA1Px6WRWjp1CQSrcA2z8FL1yqeWC5K4FZl7jF%2FJjqLQJC5O7i3NudeKdQhReBELQMJZ9tWXkrKH7l7dIbJlfx3z8d47h7DOcSjE2WZycqwxqrzyhr6Zjxdk7fG5XZKS1pz7%2Fe%2FDBjBJXGBGZnzVkc2QZfhzwM9af%2FXMKvW5D4dtL7PT8I81oyzIKI%2BYw7B0lC2y7ysfePKmhbregyuy7%2B%2F8MAxiKaCyYMuwY9a4xXWH6PHbb0em%2BxDcypHVS4CZxWOBvR%2BORRS%2BLbYOY833%2BgPnWKvMBqnLGcqv3dwtw%2BLpUXGxshVW6wH3bRZUF4PN3oTqP9%2BOxv4A6s4CWhExhsbJiEF8foWpO0Dk%2F9m4eduFeqTeco%2BiQpWzM3Qxp8jzXyAmTTiBY7RcgkMyaA0NgMaF%2Fr4zPRPAAR5l8NcoqdP6z7LVQwsg9Se05NF9Zyr8zOCBOI9EbX%2F8N3Td3xtUijrxp7dap%2FVw7E0J1N1ycdnN%2F6NMWLHEBAysOEJikmst0jDJ%2BhPe%2F9d0mKwWk4BXRiPN3fNXMse8%2BDCuWRWZxNUvLmpbTEWZBOfZEPWAOH%2Bk81wtpeVhuQlyHGnehQe7raAe6xDhXyRsN61YnK%2FP1KNrEXuDwU8hDvXyOOGs5E%2BSriksK%2B8Uxl9RwMIiHgc8GOqUBeraCtMPqJWjpqT1GHr2b4TOF%2FJq8G5CqNqS94Ujm0X4RCPTU9%2F9qWAH2gDAF%2F7TOiszI9THOE4M%2Bzs%2BhH6j4E5fQ7MBhjDXN%2Bo0sUjW1%2FCZPr%2F1VOriu2leBtJCAYw8SCxCHEksALezypBEjKbcQEUrcSAvac3uabfoCkTFRKinn7nMjP2mEGV54UfqyBqz%2B9lpnwzTMD3gsTqe9HiIIBIKX%2B4MK&X-Amz-Signature=05f61ddac251436af9fdf5d944ef4df915cd94279f5b45a813aa392d96536783&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SZX3GLJ7%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICNKAqqPJKsuIhYUjt882Naaiy%2F7kH3M2XTmR9TwfmG9AiEA55u32NBK6ubHknyu59M47mCxfU%2FE1sZs9c0DleobQQMqiAQIs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOPDGhTjGql%2FwfYKxyrcAwdrMAJW4O0RLDuZcSfEfeieJAyQTH%2FvH%2FHNopGmF%2Bwp8sFlNKpnvTD6Jq32ug839CCI%2FpNbJcjuRpYpBQAv%2FrFNVHErY%2Bj2NGgnjb9Vj1W%2FgYhCLOY6RgBqfoJaBIlAzXCriiIG3alBLxjjYpvlEcOoQORPPPSmelUsbXoC3KuJHiQuBDz5nVDRAFxgK%2B1EamiVShF5YIJZ4gg0fbF9LUuTXFsSfNh9hx6lSrPXG5SasDLNYH1mcPwL04IoMGPwGmDbn98itQXvZweM7nO%2B9rmOoyRZ%2Fif7MvD9YUSpl1tPUA7j3b%2BrBrO38FjJ0I3vw%2FPmSjNbkpaFsQWCI1za%2F4Psz8cuVXqJpsYMW2kgntM9W7JvdH0kfBjNmhX4ZpsbuJAgPcm%2BC8NVW%2BCDSIjDaHYiEcwFh0Q8aoIiR3AP4QeZ%2BFDoKHW%2BjRyBwaOT5siGCg%2FO1hXixm%2Bf29JOBMhlRYs3AmQyfEQjhxo1%2F2dVv%2BBjZOoOJRCxRUfkTXhv2uOMvPfLTKHbTsmsq4A5P3eIxUOJtV1QGBCXz2Gd7U3UF8Bt6jaMfF5YyP83F0LlZvuLP5sPNBPMOQNsKLlzEo%2F0UFd%2BCkHlxdfLvr4wcUgSNYdBNehAO08oseRRVuk2MIOIgc8GOqUBfHKcvuft05kiKOvBuOSAn6tQqzPoffkoWo13Efvh52SMynZd%2FBXNPW8G2hxcdkWz5x7h8M0VoELAqwRUex%2BuS36svi%2B0hBGYR%2BcsQwjnsVZUh5Wiw6XG5562OQra65A6N6vjIGS0qAH0c1ckok%2FLY83G7bgJM6Ov61RcH%2F%2FIkM67icLblq5Cj%2Fy3HMgG0HOuxv7Vf4IEcma4IspF4TPMedBQVqaV&X-Amz-Signature=1abd826151b3346bb0d917c89f2c876fb0ce3737b990b59b45db49b10c722560&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666EP4SIBS%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034616Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDunH9qAuM10n5WhhZNmExUsht43XF16cou5UKFW508rQIhAPY3BdOGRp7GnTXJgVxU8PKuH73l0wZQjO4f9oPt382jKogECLX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz%2FoFtaKHKL7AvZPjIq3AOjFdvQKvjABqZdQstBDsS7kYZjj8tI8PykS9y4ztyEtDClnijp1J%2FhxzyLIGrOUKvuY%2BJlByXwTnv79xrcZx8kKr4a8F7s2VOCkd8HUIQZE%2BvgPzcES0V9ABC1%2FPhhmoO3%2Fjj1A2bLNsZ8B4IlZSYeTz3hx2MZ%2B9sWvKVamstOr80ibahUtH3tzb%2FhUoryX6UVLdU8kDhMrYxODzcbsYRjfJE%2FnFXARnrmnVmvE7Xm2m3697KMkDzTkvmD85zg3y64NUViXKvVh%2FAAQGk1uP1jIX7gjEUs8hBtCqjBVf7jjIH%2Fd8c1OYAONCzIC1BBQBlctDCJrn4Guzkvd7HDCSxsZ3UA85mDNg8FSB86%2F7emCxB1z76qlmPOadCZ1koQEi%2FAPunt6h1C0pCgPM0wfq7Ed0oicfBpcLjnECLlysRhfFRH8PgF5xpR0w4iDtsrbpqi2bCERZtMUH3ah09XZArOzEVkCSChumZ2pZJ5aJXo%2F%2FDhFvFgEs11pXS0KdngXJtqa%2FGQ65bDsudaKscBqNTH4Rx80%2Ffi7B%2FktP%2B4w2BWo9NAAgXqOvRX9ewVg5N5y%2BpiXq7SRJRmxm2ov21OyFMkG1JR29oy4R70xTGMllw3pMVlILhUgk9D3QsCFzCFtoHPBjqkAdlfjYAz61fsJ6mj2IRPp%2BtUhJuckEP3IXADDe852RTEXL00pXaZWnJuM47ntSOfVbPUBudgjdbqUFadl1lIGCwtebwIFlKxmhpNHLBhTkcRZqPC9iqr6eYdFCVS6Tq0c3F599doeX%2FjHO1kWIgqHobP954CrttzrYAvyl4PSL%2FrEJdRHfeSMHLS2t%2FKiOYsXXYaO7El%2BgjPwQrBtwQVHregJU9l&X-Amz-Signature=158b5be69f20d77901ae5ba3370ab5ac611cd3b8c7d5a43fea3383012b84307e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QMDOL5R4%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034616Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHI8vlvSj1EtliLtxx%2BdqI%2Bey8xsJCdNg%2BTsYGuC2dQXAiEAkdr3ZBky66FRz0YX23D8o6fpeemdJ%2FNNaJ7wmS6Q34MqiAQIs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDTn2ozihDrx%2F1szkCrcA5jUxXokczCqWBMfNFAY4xEc8j34a2C5B8gmop8UWCq9HIiSGCcLoKamY4EyHcNHVfLxW11vgtTnbj6lsm3veWwmKK%2BKhhNrzHDpC0POqOhTBfvktxyxjMB8S8oulNPcwsewjyelChiJ8TMY7VH39%2FMQ6D%2B8gDc7OeCSY%2F3VuSL9oWH%2FvjX%2BSMla1ot0rbMKVPUElYNGXv0Dg%2BFI0VbRrHHqunXJ5VDchLHczByWeMG%2Bi1ayoSe0nKivA6JtIXwMD4Bc0ZuohTWJ3jZPNvSdgyCqsuGntScWMKEG6uWJMS0UWxrM%2FdZCzUUUqmITdn%2Ba%2FONiwgmu%2F2T7jFG07b9BUeeWTDr8N0I4fUkFOpa7MX1LnGmHddKd0fdEpBNuatJ2zYpjLoA4cejVmLUmOhw0ydRN%2B4D24MDMejZVnmaJ2yoWmyxQNgQ8jt0wVruT%2FYGzqpwKtz%2Fx6EJumnC%2F1vq5PBVr%2FAI6AY4pzkvsyoMo6WMHBevM7icsdaKUng9IImKI%2B%2Fm%2FtEwEjVLzZgESW7aaL9FC6hgrfAa%2Fp6P%2FRU%2F%2BHrlDiVIg53YjblBkS9Olj0P9Tg5SbpPc9n5WGy5ljDNaZOrkf9KM9o%2BRgWQMORtZZKvC%2Fjjtc3h%2FTwEp21dAMOOIgc8GOqUBETwfoazUHFF0qyn20tmbSNjJ0COtp1chfPbL7%2FWZjE9OzlhtZXNn%2FAecZb4fGqJPdakbzzZcAkq%2FSMjAq9ThNhEjt70prvTIxbgSBcqFFGZc26XaKHmLtbaeUOKxKlVSVLdcr4s8ueR7qs8ZSKQwiMvieto8cfcaJbNT64Y4I1luLsTW3m7gsZ2c2oiNaPacmOusdgGWd8Z8z5uVe0VUXHfM1MDN&X-Amz-Signature=062512c5d86b7951ca6fe44ec887a25f2b58bd72e2e75a97da656af879251cfa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YIAVN53S%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034617Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDr6dopvdDc7DivDNC5V4sTCOp1WjpQQ%2BL3CR%2FV1P13DAIhANVtNexVic6BgHmDtdFPPBnCW%2Fdts%2Bfi07T%2FXsW6L73WKogECLP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igw6pboJB%2FPTth3QScYq3AP56%2FAeGl6KZh2FN0Z1ekcGmgZ9FnWZuQktaNufM%2Fsm18uO4tm0c0WdJHbutmB7sDGVpraQpBAh%2BtYMhmtGS4b9IP5XfJq4OoIx7yA3AJMK4Q6oxCA9YcKy%2BF5MuVRzUzIzBGXOYr3LZgfYochW4SpPqjY%2B5PN90G7HXngd6l%2BMOMVSPfI3%2FalhQ2fhDdRZcnQtNRs9njcSSKgYFK0dLzKZJdvA5aexIDBhcqJJjD3Pp3h9ncEubGkxgfB98CcbdR0xi1H7g2l8cJTukQNBUmuJfeBjZlF8CO5aPl1vtaVwq5NQKnX6coqKs9JxAX5WwazKeHBg%2FA108MzXk%2BtQpCml07ZZt2cDZIZJRQtE7odCsKkQy4Evun95TgNbbibfiPHoTitvFq3xHdPuM8MUzH%2BJ8lPJBkZvgALM7DmP00jrTdeAppHH9ViQ3O00QOzK4brApYIhgdupNM64CT2UKU5yPgRlglzKr1RDZMYMKxHUjWv4A1zFvwFPtl0YRKhzeyR2rP8AMM9yytd9hkqqFULvdkL9WoTYCqlh0FyBa%2BGH6YZLgvdvJJvxjcaq6BPpxSp3jFN3Iwu0vEXPirS%2FnPCqEXjIukjy1JMLY3YxG2xAa5wOQx1Cze8ozhFFjDC4iYHPBjqkATYFls3%2FW5157z1V9p%2Beizi%2BHVY%2BZVEHV0TmDw6gE5VU2BfZR7OUeuyO4Oqr%2BaiyBVvmU2N8tVtAQ%2F7l3EZ4ZOcLLuyC0OTn6FckGjsgpwW24AXD9SgfOoQkNeV96Jhg17KLa4VAgkr3ma0rWKKBQSQTRIX69kbqaHMd2OKzYycvPZFZ5%2FCo0OFfE7v%2BJb1Xrwsim78VIk0OTCH94X5JGT9sh8bX&X-Amz-Signature=a1906416f7ca6282d93366c6b5f630a28bf624feee7cca8211a091a521c51ff9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TRRBQVZN%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034618Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDmMQpAkxhmTRb6sqVD7KuQd1pqWpArfVvk2ohOkvnpyAIhAOX8jG1CAfMhSMMA3XQhHiF5pCbDHM17YRx5m5JKxdNRKogECLX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyjK8TFioPjfBAg4NYq3AOGVQF%2BhR0qVkLTycCyeTFJmT%2BRPy0beQBp1%2B%2FKPn2W9DUmnWfucAiefnw%2F1mbJKTfFZtZFDg1t7eWAkQ%2FCRNQbwW1QBOFNcbJx1q%2Bvk3H7HiRg57yrCBs2NzaIA5iW6Nx3TZ0It3uhjItrDc4Y5jPL3ZdwUxtzZs%2FTZqPzYZywdEnvwjREel6ExlIay41ssWMSzuW3jiXekZsx6pYxX%2B8pXLzaiGTETOKCV6Z%2BkUALtPf%2FEaszWAn7hxBvF0%2Br%2BASn%2BrnfnDEbmSjyg%2Fx09VmtiJzURgD0lv%2FofrYUOBJq1S8hdEQ1LbCZCtaSdm1oQRh06r8jhnNNhFJwMMEyzTf%2BJhN%2FDJpEyaIbJtXQr98%2BLaGv0xcLmjHIJighr0v%2B3wda%2FVASc1yOMQOaIHVuDTLOoNWZGIhU3oYfSxK6j2d%2B2LxcTz8jWSQpUNIiUYPpCDvM1p4JNp0L4ULDSvbmCe2%2BKmYlxlTSk8TaDnnD1zMlRlFC9xtEkc5JGv5qnOMZh5PG%2BqU08iZ2f98nzUD4hT3WMaTo7pL%2ButD2giWqtXFn4zH7BA%2B1HEI%2Bvw1DwuOHAmP4AzVvdI%2FzcauKtntLd9qAzltbN5id0gjnz8OIS%2BiAzEV6e7%2FWNYOJOmh0xDCatoHPBjqkASaaREXxmjLGMDp%2FR7kwzwIpkoxdp74f3f59JotWeM5OMUEcAudqjY4BWCOzT%2BNUuDn5hfywareFzJHmpMfRtZhGqverbBTxxpPukD1agZb%2B9WSMUPv4b7YR8LJjpH4OJFnz%2FIiTU06c1qajWkbni%2BFqGuI2cI%2BlhH4fkrqiR2oM%2Fojf68FjhYgvyQVGU9HFofNzm3WAyOS%2BQSLOTmlEkCUY3E7o&X-Amz-Signature=ec6762e190b672aafb1bd3335593c5a7ed30d1ff8dfa119672d264631da28c3c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TRRBQVZN%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034618Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDmMQpAkxhmTRb6sqVD7KuQd1pqWpArfVvk2ohOkvnpyAIhAOX8jG1CAfMhSMMA3XQhHiF5pCbDHM17YRx5m5JKxdNRKogECLX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyjK8TFioPjfBAg4NYq3AOGVQF%2BhR0qVkLTycCyeTFJmT%2BRPy0beQBp1%2B%2FKPn2W9DUmnWfucAiefnw%2F1mbJKTfFZtZFDg1t7eWAkQ%2FCRNQbwW1QBOFNcbJx1q%2Bvk3H7HiRg57yrCBs2NzaIA5iW6Nx3TZ0It3uhjItrDc4Y5jPL3ZdwUxtzZs%2FTZqPzYZywdEnvwjREel6ExlIay41ssWMSzuW3jiXekZsx6pYxX%2B8pXLzaiGTETOKCV6Z%2BkUALtPf%2FEaszWAn7hxBvF0%2Br%2BASn%2BrnfnDEbmSjyg%2Fx09VmtiJzURgD0lv%2FofrYUOBJq1S8hdEQ1LbCZCtaSdm1oQRh06r8jhnNNhFJwMMEyzTf%2BJhN%2FDJpEyaIbJtXQr98%2BLaGv0xcLmjHIJighr0v%2B3wda%2FVASc1yOMQOaIHVuDTLOoNWZGIhU3oYfSxK6j2d%2B2LxcTz8jWSQpUNIiUYPpCDvM1p4JNp0L4ULDSvbmCe2%2BKmYlxlTSk8TaDnnD1zMlRlFC9xtEkc5JGv5qnOMZh5PG%2BqU08iZ2f98nzUD4hT3WMaTo7pL%2ButD2giWqtXFn4zH7BA%2B1HEI%2Bvw1DwuOHAmP4AzVvdI%2FzcauKtntLd9qAzltbN5id0gjnz8OIS%2BiAzEV6e7%2FWNYOJOmh0xDCatoHPBjqkASaaREXxmjLGMDp%2FR7kwzwIpkoxdp74f3f59JotWeM5OMUEcAudqjY4BWCOzT%2BNUuDn5hfywareFzJHmpMfRtZhGqverbBTxxpPukD1agZb%2B9WSMUPv4b7YR8LJjpH4OJFnz%2FIiTU06c1qajWkbni%2BFqGuI2cI%2BlhH4fkrqiR2oM%2Fojf68FjhYgvyQVGU9HFofNzm3WAyOS%2BQSLOTmlEkCUY3E7o&X-Amz-Signature=3e732cbfaf3907ab27f220e5f19fc62e2fdbce5a716cc7a3eb059c13872be9b5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
