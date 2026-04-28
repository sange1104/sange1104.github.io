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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664CDJJCGR%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040429Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQCxReKM76aaQ3LSXCHrKAkIu3uZvwJBg3XISmHFARlkcAIgSiluEcLz7MeOa8y0dGImEp%2FtPzQSwUUoic9vDaXf%2FUMqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBRNAGFVC3xB21%2FodyrcA4Si8ET1q3pmo9pphTTY66CUyeoWbwvq7LV%2Bzn0v4X63lbetvpqURmZNf6oyj1pJ%2Bgt5o0QuihZotCVPM9bQygE4x1hP2vdDMyBDLhjUY3vKubqQntoyMS9HthEtdKc7ndRNjDEBvOlcJrFMbnwFUkvBNKEkqJD4RaICne0OApLD%2BaH2RVx5tnRtJ9HiP4cVE2LDZ%2FpQRjihImtfULq4VMklJ1OKWqHpYjuZ04P8aC7eL35tNTSy%2BzXbsPc4n6UpPGmtfLeNJyab1vF8G%2BMB%2FJaK940%2BZbQRG5L1xFs%2FrdojBcFsvW9l9if%2FZ3gIpmzQAC7V8g6n%2BmDRb7tLMrPsbvgYzPGf8YstAAyNBeC5htTDkjpj1Wd891Hwt%2B9KtvX2oyLV4PzNoBh7FtBv4bvY7pESK7qcgN70inMcpQCrBoo8QA2LHx17BBsVbQlExKs2agmNbywktPzhefj0kDlVj2Dkgw2uC6H%2BtWlLvCb%2BEZKz4JRt%2BoBhpsLozHBUUMi08nH3c%2BeRPOUJQAjGTNnENesH%2FPIkUYkli%2FYU1%2FlMVXeLv9wR7T4%2FqsykQXppO%2FkXIrdNt6DF5SmZRKk5Eb2WsKHrJtHF7eD53CMWk%2FQ7D6jwm6yfhmD0A6f4WDhRMPzGwM8GOqUBKaLn7M5HU6SjMyX2OtNBMawnXopZG0AUEpb%2BdeDLeiNnbVs7V%2FwunCu%2FeHbH6bJRN9teLGDce0b3kDosFt4THk654XlCiPnU1jw1tGO8g%2FWYS9P6v29ZJiPtJ94LeuJ6HCzpJQbu6GNHHZrJyRT5SpehRuH2CNz89Yzb5osSjBtt6aahIe0Q%2B%2B6GehzGHzdR4GJHcIJtdiX6useKLA%2FRrbvQGVab&X-Amz-Signature=f7e8bb42519d369a2c39f40bbd798fcb94924db0b1eabf9c11951ba9bc8bacf7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666LIWF7WU%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040430Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQDpMAb9SXl6zKsKr4nduv9xRrsaHP5zPRhOTYRQOoiN0wIgC63iX4YSrJLZ0QvCBlgbcGnQUcHnkPbv8xxZgabfplAqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDP0xS7kaMw4PE9qY7yrcA0oFhQtRdaAGEbmuu1dUIfhMC4kVdZirg39u%2FP9PCUz%2FfjbBA0XyG7gTl6d1TAVQjKhs%2FweExH9v%2BAaIu6y%2BvMkYVS3XHmmpmrM8kIYDZFBwxqscfZEBachZiPEIJb%2FtJu9AHBMvvEXmm7KjsIGWGzBWzu2uQipDYWZ%2FRRfQidXmKiiGQKKLczeg5nIkK0OaziwJjxyOdxADLblyygIcN65q%2BujKlJxnYwm3mgLnd5LAYUG6jeMHY6vr8y77o8BXe1pb54VfB03b3GTD04hY4lanYTPByVOAM4mSkyyHoSmet8U4E4jjvjgYbgtLHC1%2F4EohKVyJkvHdaY3YhzFRO%2BZySjC8p2lVUUbP1aJ%2BmOi82bkSKBBhoTocXvtGx8teRo3Obg%2BGYv0uXXHwV%2FCHauZ43zpQazfQVD%2Bks2NC8DX5QGLEpEjIcZxyJMlsq4lE4Wdv%2FjBZubjKiCKQzvF%2Fh3T6MOXa0Lw4U9jOP8V%2F3xjINw3%2BrJOwPHMy%2BxKLfywk68JRHLMLncXT%2BuxINTMmmDvkFCGmTsuFkG2V3%2FhoQCCzjyVwxHNXTUMAUMluZHR62rWfzPOBlow09bvRhjkMfVkcGzqcP8pr9g6FQ4WQVBHyM4eZ9FnhirqLn%2B99MLLIwM8GOqUBN5DrmajoKPbFatFz9Z8AX70O1H2czkbdqO%2FOfn8O7dvuGws%2BW76ZrEN%2BK0frjjWq5Q2N52tHQm0Civ%2FSx0q2z6bay9lqVSYz5lGdKAGjO1O%2FWnX5qIjs%2BAcx0MvknzJDANGtDoi33yCf5WRh1W20kCKPz1uZtqDk52vqnIa%2BayAsbZAs6k2lzi%2FhD4DGY206ggB2YK%2BiOoOqmj%2Bve4WYq0T5BqeT&X-Amz-Signature=92cf43551c909d898aa5793492962bc882fd16457bee4f07884dcf89760a2f95&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XSOIJ4YB%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040417Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQDmIbnek7%2BkJ2KY7y8vMkWrbdxSboTZjQEZdVqM0r%2B0OAIgRZkYWsoaMcaPZKmoRVM1iHy4TLfD%2FihngQHfdkYudQMqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLqxmjThUF3WcA7LgircA26A5uOxE15J0LeLNxImLyPROspCt%2FLkjNivKa%2F1cw1Hz8LD1dkABCXwva2WukS102siMZz5OEp9dFdHrTaLvOC%2F%2BYiAumC5T3uITej8gAe3VxlM9wgV%2B17JbF%2FpOVxlrq7hLHY6VdK%2B3gFUcTyPyKqu7R53C8AkEYXpJeVk1x3LFV03%2FEOQwS4Dyde35W%2F3dAOarcQpBriQW7A4nwUHg0l3X80GFL87HtGOrRvvsjpfTBbZZ5ysKUJn3WGfHA0c7qOv%2BbwfC%2FY0DuF4PUquFCC42ZIDJWWrWt9vFAR5AW%2FzB7plJ4yywyhWihsjJpddRUG5Uac6L2XXhALehvv7QyexS5mYknJIgEgdclwBd82WARDlwQ61vqCl7IfjekJSEKajKTTvf4TC4%2FEfHUH1DsHqkJbkuMmhZgHdCS2%2B%2FZlrKjgPOQVGYoVCDqTq1U8T6DisWVSG%2BSIayID%2FEFyFvoht7jd4Npr%2BBFC%2BJXQeDwCm%2FPbRibenSmDklKkE%2B7e5yaRZuUTDRICl4w%2FBftkeXwIxJXNmdagIUTOtL1BuiHJjdj1yVJaAygYkS0YLjF2tn1ini92lL%2B6SsJJ8uZVA13XLJiQnM8kQezJwKq7V3FH3m%2FsWQ5wO5Fr5cLbiMNjGwM8GOqUBKOz60%2BvpGf26txTn4kjjPyozKJRrIUXyJjCZPBh2WpWxJw%2BjF90znH7Qc3u7oGuNorjeEfw9gT%2BD1NEebGSVdOu6DPVAXSmoXbzx73zHym1AK1vtcD%2BIQW33C5UgsC6rSiOPHps849QCO8seeIBrG8GTPYBii9o99QsDzrG7wVim9plhS%2Fbh4RGByEIpS3k6dN%2F65krNyld2JWqUD4IuTIPbr0Oz&X-Amz-Signature=7f1d1d46df66c64ed214c2999d68311ed8927c93d36cf9da8a79a23b5b672cb2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XC6JUHTC%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040436Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIBKZ2DR7J3jtsfMOQEjpfCLdpjHNzEr4%2BgVxlDtRtn5FAiEAwKflXo12SVI%2BzOT2M0tHaR4rsW%2F14CZ%2BYQnwYE%2FMPxMqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOGgjO5eVCNKB8CWICrcA12RxwCTijOQ%2FVoKu%2FAh8YDWVak%2Fl1UU92E8QEO8ODJYpbAtNTHFCpKVT6EI2F5632qGflTxTPRyn9j7plwNoxhuzwigQFnl6UH0E4GApchGDTeGI3aDiuDY0zAfBPt8%2F2OCMlHRpSW1Hjy8idzMMp2Gr9MzvkKg7jXgKFJ78FeOXY3YQbX5gCjXzYIdv5A%2BG7HCZ5SPb%2F%2BFxITsqvQfxFZeCNV%2BlRnGzYOAM1z6tgKZrdGojrUVeoM1Ae%2BDVDbQq65plVvqrfS1vnA%2FqMTupGz1eQPoJrnB8nZuUqnekudnIpONTL7oUS4vH7FqJMv1Hf6MdOQsnEDpjrB%2FAI9IUuvy6ESyHlB8BiYX3IRIJC%2Bsl6dUKApsS2piTRXdn6xQHx1mBOp%2BdnCRk4IIKUjOLRvHsEZ9u97KVH%2BXTEAYzYAuIF9M7qo0RztMB6gO%2FmYqDf%2BSUzhUjBoCMtJgxdi0Bqfs28wQFurkLBq2YE8BQ9AIKt2d%2FDtAvQqIgiL2FkXY4kKZMzrbYFK%2F6m8jTLpGAvf6D9NE9LAE%2BXIpfIx7h4Srw5IxrxRSV6lKCjd1eJ32RS4gN26JDjVSof26o15u8lxcfi%2FAuq%2FpzpcNOyZJpianyEW%2B6%2FVjydOR9706MPrIwM8GOqUBwfyjs4l2BsPRxcmAqOsS0EsnVQ5Bq1POPx6DMNtQN0sHGE%2ByimKZOI9azcCxUqgR4nloO5tDr4DcZrF9KNuOB0pe2qhF77pHN4km0CIMRWmrG0JZwWCJAnvnnq8594KbUDmqm6DNnHcQrHE%2FKuNOOKbgQcjgDAADQ%2FegOKVJvt5xyIOjttCfkiKQF8NIeFHJVnVBngA43IirM4%2BWUwhbcrYahnFj&X-Amz-Signature=1054fd89b1babded89a7d7f945b1e382f4d3f25f94bff51a31706209f66e2626&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMIHJ7NG%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040438Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCICXmGL8RvE4GRYfC4cFmgfjvwE7x9olpkPvB23aQSiW8AiEAlMD2JtINJ4Lc8SXqxEA9biLrr6YMaAal1c9VBahP0GcqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPL8Dyle8%2B6rTPazGSrcAzWbbZZDGecuQUxYEvZGttdzbOoEBLSa2KXwrO3EzJ7aB%2F3RXjAlu3pt%2Bc89ZRMC38wWZ9byggUxuT4Vh9Pyl8aQFaaJ8Xy725AI2i%2Bb15Q9qDbG%2Bk%2Bv%2B7ARokjlxzCz4%2BbKJMW9axGLXVDV9GnYZvRfgYBRT%2FRcQmCCjlBUSiCs9yxQoSICL%2FBhsUBiJPapMk6qenDHMrv85dT0On8PLQLYKrFYB%2F7VV5f6e5eoHVk%2BN1iO%2FjfzFUkQIn%2BOorcmafM7fsb75ufL4ohDbJ4eWgya%2BmWOrwGTVH5MIRgEiI11k7vPBjIk3CcJRYx193ltCEnPuiMFHZ7wiijgynToNvGFkbpVd4JkxgqlEyEvAcJ5EcCtGjbS7z9uhcPMXXEPffQZBUJAPFzQ4n60NWwaVFtIikaRdd5tKWdS%2FQiTfPED8sRF0FyneRUgBPnQNDbhisvceJjf4hQ8xnJJ9CKk37EFjrNWjkagtSpZOpqK9AwWUGpIyeoEzjM7M9rxkDZpNhY1WRG%2Bn7q5bWOkwokAWBGk43VNLGXSFKMjueMVGVf3lwN%2BsHrywYFrJvAbvk%2FR0%2BUttDlYeYQdS42E0N9V9EQBPkRVIb9tTiETM3TA6Bnq19MKIwPd7mgvUoFgMPzGwM8GOqUBC6X5kHHsRrSZAxrRd%2BRuWiRi5iD71npmN7e9J1nr3BzVEG8EdfV%2Fy2%2BnvPGDkUq4Glqc4em8jOpYnJDW%2BFrzxAf7u26Nx1UqE3lQ%2BBq9rfPoPtFL0n1eXRNEoO5IByt0J7OodYsYVncZ8W%2BbVJLyCFX6SywCVUDqtHXQISYnRiBWTDIgbnrBJ6VXvuEqZIFdxjgYeXsH7mycirWwQpkpHJDculCS&X-Amz-Signature=29017322c80a5ddd438a8b44a5e5529d8091156a4b69bf1d7f0d5fc2a32dfe20&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S2V5XS4Y%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040439Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQD1tAyD5yJIxCWbWSw6BrK8zFwQAqaemTi7CNJyYTMVEgIhALdtlhYxiulpmmfTalSPWfElonLr3MJO7Cx2%2Bi4W6sbfKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyTuiIp2vwtLEet%2F60q3ANwvThpsvy7NrVMrn0gv9nOzdrJITUtsr1Pm%2BMu1F2RJF8xFb9NTgRymtHoer%2FbhxTCe0u%2FSojHlArUVUbAPulvxgTyr4RaJpyAsFhB7FcrYHt54u8HE6RvMO2BZtE9BgTSEST6Vf9cmYv87j9TrACJHNxuWad%2Fx2edGqOFNeSpi023wdigc4iJ%2F8YRBvDL4G%2BZTLSBt9RHCDGV%2B9ayV3IG3Wfm4p6MugMQTQqe5zKb4b8orVpNU%2Bth0jDMn1w1C0M4x2nAdTRxeMo3pY7ykk3g11EcxGzvXomLYCbB9Rvn7dPDb8YiaR2Dk2jgfbttug9ArsswPuSPS0iuVwApb3Qzge7dqJFLEVdtFfePSr9jKFI3iRvUsc0tVdvEqto%2FwdrKGab0TpKlWBvyl0T%2B3v56qGrsklEmv4YKW7Q58o8Brp5IvFD3cC4Moxmtg4WpwTPjnEnHVUwigfOUA%2Fi5lWhhFlfEc3CHBfM5khOkJsQFvXhMGQ0a1sVbj0QbDn4g717vNR9Ussnnbzh42kJL8a%2BKikwaO3wp%2BrySNfpNKXq%2F%2Bl%2BWHLuauW5dy61OkQfvsSio3K7ovHNQh70C26at2Pexx7S9v4P5tBWBgOlHxZ6be1aHmYQae5TbRVbLszDPyMDPBjqkAVpYRpwlC%2BKRpPhZefLHOoXpkFLb5Nm6sSQ6aCvPbY2ox9kKL9aq2QYtPQ2p36vbJDG%2Fc6zXH0%2B%2FUmoVbAxRdTlsDIv4LariWgtGPcttdZ81QUC%2BCPTONci0p9Hz7jkh2DKTY2Jv%2F6G3Ts%2FZPw9YuMY2dgMWNNH055c%2BtkI5qnvjx2n6%2F6kM1DuwcDQ2YPFDfA7DgViMoujhsOADYi52PKzPCKqb&X-Amz-Signature=766cc3656a212ee312912f2e6f7268fcdab68066901edaa0eed43e9a456a71a1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466237KDOXQ%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040440Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQD%2BTcBWPLjsjHT%2Bpre5PSdwH2uzCKnCqG0zhzJvmKMPQgIhAONVKGHHcTxSuXLeXomnyAuXUE%2FpBZNQxYafCzDrfvhOKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx3zzSI4bCKF90d3%2FEq3AOPFVWjIwLyKmL38dVzJjorAnFojB2mkSFDrtGPBpmz631Hb13Ifl426SuPffFeZlbLH7CnjD0D3U43P2MwJNf%2F8%2BLXy5dJppqH6uJ9r8t7us%2FPgj2RNNynzLWlBxN4JbalGu74yE33yevPXYGJK7zDqQfPdPicjleinpqo0jub%2Fi39bGDQOJxRPfiLf0FqzbrdsEQeYNjcpS7kvY%2Bd3XdLWskHDR2I%2BE4b9McHo91Ei6p6dVnJJhYm%2Fm4%2BW0xc0UOMmRZMb0dJVsza0BgiGOsXICIz9rcQoji4LlWeB6uiuT4VMlxCBdlLgge2oqGmur1F%2BLA%2FOkL9PDRbXssaZF0km9efb1wflrTi9Pm1u4QaPHm4LIyxjcjDSZqTcTjB4reKXio6HRdaAvF4nAFWtbzCbB4Ek3i63Z0cJ3p%2FoFF%2F2Gj7Rf3JQfv6Hln%2BDTCAHZLXAVgySLXDaMH%2FvqRwHn8zyFoqAM%2BnPAQ2g9XAxFwBT8Kn7FYB4gUS%2FhNxZsWe7D6LCBltLx19xsfTMfMJKs48rLQszAZ%2Fg4pb%2B8SLlmN2LEkQr4Tb0uSR6WBbEVH%2BkQv5RylRZGX4lxndNgmlLOH%2FNzn6ce51yaOEtdpZ6Y01hIbf9HDqWFY%2BYzrs%2FjDgyMDPBjqkARN2B8W31uluMtu%2BqtvJSe374TnE0yDbImtYabl75vGeyrMyg%2BfRX2aXVrF7zg5s3etTEN%2Fnc3e49M8LusLad8J4hOJnmfI4SUuchfb%2FjHn8qNK7I6p3l52YAqqSWYkHO7sltiiV3848HvS%2Fr%2BTDmVXraCGl%2BPvMOcK0njAhdBjzdHDGdEZOpeN%2BUKGOuob6AugBM46uGsHUdagUKEB%2BJ5ZWin%2B%2B&X-Amz-Signature=74a983b7ec1ad94846f87b1753fadaa95ba422a6c8d0c8be1891090a36fdde85&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WIYFPQBV%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040440Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQCzi6YcgOBaWPjTsNLCyAWcLR47R5aQAtkMIc4Ja7cKtQIhAOVsNHjiZfLFzLrHsb2mXscaVayJggXm74rOPEuHeFWbKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwX5s99LGMfH5W8nmcq3AOihospdSFs8zV1aNOK%2BuWNWqsEv94F5BSdlO56AuPm%2Boh5SUto3Es3GLylr3KBdFooeeC0P66cpuTR6T1QNIq4yLdHOoKfkhGGyw%2BIBMSEVrgLFGdAaTEB90jcmX9Jg1iRtjKXZavXbZky%2BzZIJVg3jAHJvb86b3A14jh0vc0ihLrlvdCSt3k3Ghnd5%2BrUj86x3mDEG7rs8xvzk7eR%2F0%2FdpOdS%2BEhsbmGT6vVhMMQ84eXOcbCSi8zAdNOmTfhUFioOHEdBqeXJXvK1h4hZG6PgG62%2BY4gwIk20xyKueuUPiNlJdJtXRbSWWRMebgjHhMDs06pAG9uIU5FFhWv2snJXvYE2exTms%2BmkKsI8RUhkN4n5847ts3pu%2FeMM43MH6EztVw%2Bkz6XxF5FHUhpGFaIwxFfVPdzMplDCpszVraySaCyfGS6YZRLwbkWJUaRM%2FyLeFiLgIyM6jZqT1TLQNzLY4TiHH%2FwQfiUfjI53X5xUplF0u%2B%2BXHnAf7msVLKxQHloWS6mKAl0GeYVAhP6b1FitpI3EXxkD8MTMCBkWriS7akqrfOc%2FUrl8Y7IDbbEprtfXQWdtBEA767ZtzeUOsPZu2ISUXHF7TIK6HJ%2B7wOLqSoYfTZIZ%2BX49bw9icTCdyMDPBjqkAUwOSkc9XtC%2FLXIJ860A%2Ff%2FcrfD07sQhn6W8byY1%2Bad6JQzX3FKT5yYGQQpEolJrUs2s4VWaRL0vaNRptjCsg%2BxDv3VvlATPP5XQ0ijF4wKy0SasUvOnBTLygepMA27A2EC9fAbrd%2Fvjj%2BF2DFt2fm5mWEuwVK6naPfmUYTOTlLUnSL3B9Oyv1rp202axoZhLlgJMA9PP%2FGnl6LBpSkxdqY%2FhLcI&X-Amz-Signature=ddf40db03bf7ad79d035d419b76ca017c7a08c5c063ec3b5e07f87d83ffd4e05&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RJA4T6IX%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040441Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQDhFht0Sc8lMQu93JSasLM0Sux9CuY%2BFKZU4heyTGTgHAIhAPdYZfzkI0nLbl%2FzmIRzxsU2VVQd9YhPWh4qiyuMcH3WKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzfXG%2BE7fzf8V%2BzI5Eq3AP1R6saD6%2Bq%2Ff6wjUq8m9xmjcJru8nX%2Ff2tVGcZC9GZmyUnmeaBg61MfEAbh2DWU1SknSLVdhAg37Jzu6JC2Hr%2FOVfnCOjb%2F2osOqiHXSEQplKuas6b4d5vjDdwfHU0e25jOAO9Dabt5JDDRk15w27kKMkAU5IeEO0kcjXzvVduhzy5%2B7QceEuNX06N%2FFi4b0EBLeNRfyoXp%2FU3OTuLZ%2BRcA2oEQYEOzrzeNyWBTQQYZcY%2BdvJ5jscB0IKeiBT0BKzBCivF0MW3W3hlYH0Cg7ezAR1Z3D4oQ3B9%2FcrPfXFbzZ91XL0E%2FIsGNZJkYDEW%2FA6v6Ngq1PB3KuSEELkSBTg2KFvvewsoYLtrcV68Hqt%2FxglTYcrfuxKImzpI%2FeXJq1dRLgrnlb3YRtp5jEimDwnsEjR0qTYJutiJeOKTfGff7uq3BQkpvBQHYDqVbEhyHLRQelHgYUBaRa%2FDz4eXUcJ%2B882B9eCqlPxAcCSi7zRTL%2FNWrFkd4hdqoBbWKOUFeXADTEUIQP%2Fg91i6rbMG1EKr3Cw20WHOYlI4gH5wI3C3cl1gyKm4Ne%2F9dAHl%2F8yHe3gOkAPvlyx%2Fln6tpWq4ihWRJBgq0zxUTVTTeYnBJLHqob5PaYYJEzvMi6Eh0DCtx8DPBjqkAdDPvimFYYdBrxwnFI6GBtXp%2Bv5J6jiSeu%2FzbN1QRgY4djTN1Vd2n48tYesSdRAEhrCRpXql42wGCxjPTRj3g%2F6rupKQmaWMEnWBXwhT6zOCRDpoIty4slHzYNtkNtyafFBrgOFq2Aem7bjpdaD34X3JyBsBUim2p%2Fymp0BStyrXklvJZ35nEhiytHVYSgGeourGGm9ynO6h2imnlDyBRF2jXV3i&X-Amz-Signature=c3913f23ccfe7c34dc27f11e6fb6baafe94fdfd43ef96fd9c96d64e8b18d55e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666CFRLLWE%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040442Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQCAqkPawM1sfAnb8aA8aNGdBeUv7ONL%2BdUKhfM3eNB7ZQIhAJaOkly37uqoh%2BQcZJ1zQXEM%2B5dA4oXXqHRovNYJqd2JKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyDunN6zIQ%2BUsAZ5GQq3AOwfWBvpx2d4fD0zCabxQNynMx3zbl6t61oVFdsUOqVudrxt8vHEexM5Z51JBTSDNS3RK2c0qNRO1Dq6CYGGZlEWtjQyHZh%2B8Fkou6YNHpOV7pqSiwvlviVa7P3G2vrn7JK7muqfpWIHsrYBxze0TbAlp%2F%2FUQRde%2F5Seui1jb6uk%2F%2ByazwV0eVTE4yafChoxePUg2LNk0dlJdAgRNz2oce4NW7d1%2FoEAywIcg17lz3QSNAGM368xtsWvrLop8LgQlFjDdrd8verLOEV%2BexaZdP9t6GhOH8oRQYrh1qgenr3Fk%2FT%2FTMAvAzSTLK75%2FF0dp4Zv2Sm8b7eubdSAAm61YeWgW2fMz9zvoFrUdPybkFldtXZgp2kYScX4dK9%2BEM2ChIt1RTT3jWJIy4o9rmyzRDk3gAw2A3NPS46d1nsGYZC8Pm7bi2Jek%2B%2BxR6Xdxf7LVRickeVG%2FCp%2Bhaet%2BgNY8WG37sexpJntv7DLh8ckAsuVdhdwHks6NwrpM1SVly0uRRYOAQdKNyFU34s9QKymixm2ZxQjSAsZwJ2NDpnzeAxntwS26rLQRE1bNyz7aMlNGuRW95KF%2F9KCh4t4H%2BPzCpdZ8TSqBH7%2F5bBwlw8jFqrCDsbdYRkBjvrLQWpCzC5x8DPBjqkATArZPHT4XZjqJt%2FIicBeK3MzGDYxVF3DsOYMJqGA49Rm72TmBPotpm%2B%2FnJ%2F93I0rldOsgRjeBafeK9fZ35nwS4ejhiMgC9P8bEJtLUaWkVau8GdQLhppp8dOA%2FZCQJEpla58YnZEgFEtrcNMLKOLghvk0tphIjNB0zUi%2B1UB0I2JHx9BaVR1BQuqlgCSVCCQD67zRQ9y4V9fcKEbBsvsfvvL3o7&X-Amz-Signature=16355362fd969af2cfe71d75e9e5490fcae55b387ca4b577d12793e3c09eed6a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665S5YXHVV%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040442Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQC7MO4uLcAHmL91UpcQlcAsDyv0bFYgjpNIGt3E2yrG6wIgQS%2B4MjpyPUH5FscJI51p%2Bg9LePEMu%2F9A5yLjporWtcgqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHZh9%2FLSLDZenQ6QOSrcAz9vLUveorGcXxRh3568Wyn5SghHPFSRTTj1IU44LWm%2FvUNYuMkbNTlKcgN%2F51Kf3XqhOkxNG7wATdT2Dcomqd5umTalK8IYHZXvY8SQ%2Bb0neW4V5F6bAfG2vav6gnE9lZKhDFjS3PjBVypYli0EpyH7PZHxlYFsUStQpcS7pT5M9dn4QWZEnPDcOAG03EIJ0zDcAdm9%2FQAfHuhU4oJek9eOoCz82%2Byr7DxUkGmgSWC%2BcxKw3%2FhAvvKF6uPaTAQT7kl096xWOaC2iDpPIJQ2gmUKuG9TDg9BNCVBIPmKlcmEHniEjqbIrqUJ6x5tsXZtfC5dFIUbQFyZrVsMROWFGBNyBdbZbUXPX179T2w8dF7g14R8hznlqzfkYXIrAkC1zo1MaB7CuVqot8VvEh0zoku5Vyy4V7Oemxd9jyS%2BsQBS5oQ2Wv%2BcxMGYezZ%2F7lZeAK9n2BYGnEOcXCDian3T6RlKDJ2GlByN6C0PcSKHfaGVqahAK9GkyoHWOtPs%2FTmALQEj72R4VxYqP4t9Pu8RdciE6ehkPczcplISzTGLgFTO42jb6N6y24aZ54Xplk8xRoF9jKR84qzXgcoEfxkHJ9p7thISb3tScDv%2FFpyCwzbq4y3vK773KAJ2O8BQMOnGwM8GOqUBHXEhs%2Fm8NUN3h7yru4qh9MsfdjoxQTnIu2xsHygdt5A5Mb%2BZej54T%2BNZQEWLKh5vmYARY9JoLjb7H8bZiNGnQrM6C5Bzy7Mi6YBSX5XiDP78vZ4OFt0S4tggFvxnof1KiSDxF3rAlXkdbNJ1uoe2RjOZK66iDXrjdqY4GGdN7AXfyiplyLIJLfCpKOHA%2FOrfLmO0ECECUkufVKG%2Bhimr1e7rNUrR&X-Amz-Signature=852ab902ca418295b12e8e8e9907a58e25fee6ca4a7d20e869c73652e2a17ffa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VY44TOGA%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040443Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIH9u14z8ugjkRYef%2B00MzGZIY3n0KS%2Fs1fkRSFh6SVSzAiEAkK%2FT5lxJZTTLx4H7%2BjqLbzuT9pmGRI7ZH5s%2FKa699w8qiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKxF4uyy0h8BwUGc%2FircAwWsTFTh6ZP31KzCOzc9XgZjhvcbRHyorkDrDsIHDXWMv7rGkMHqhAsCCxklbjiRIBkkf86cU46XgcVsdP74PL1mo4Y29dceWOGn3pJLFV5GlK3jg95g7Fe9jrtjcNx5Tx2HuNDe1UlfmhA6%2F5uHOXCsYYyVE7DsuR5E94xP1ZJUMQo9R8XtReWThcr4WJZGZ50qGZ7ZiOijyokMQEJEeBxdUG2R5dyAujMo4U9MqwlU5FKWoRt59%2B%2BnizscgV8AcrqZtP%2FKer1izE%2FkeC8uPyMSvoV0ixBYynZmOSSgpPUdWYHq7vCdhALgdhgquV72j9Xgr1xCfQeheyzmThGQyQb2ylNYzuXNMzYZB21NtWQBuEP%2FMW45OMSpJOjO0%2Fh6HlwmrPDQpoEXq%2BGhFGy%2Fgab4Yxi3YeOYWIFF85gapUFsMdUz4XZlo2Td4fFibiT3GrufrEa3FT0oTPyWAe5YxwcDjxzaUTP16IEcxGfPeAPYImTsCliHzkCX6GY5E330s9UYo%2Fp5LjPUnc58s2yZRYyuIB6usHK7JrqX2kBA1UVdiuMMwpRAxGPxMLgH5qU1MwTymPlgmu0KS6mksmU995F3miNglvN2NdIUJNq%2FL1HKty1TK1WiwC4uogMOMKnJwM8GOqUB61oF3ZxprxyuaLfIun%2ByZ%2Btn5J1GAH55u%2Bj3UcoA4uMl56LT%2FGkIW6RCWkBRAZqo9IgnquyMJoNom0RmsCtKp5f2CZybZ21uln%2B9c1zCU4yMJGy2rRPsiJYrg1mUpiLkxDhVmvLcIgGAivKyMMX9w5H099sWrhGM4Mmvz2lVJWS%2F3zq3suARwFZx%2F5EepfJHYXFoI7YVDGuz7Smmh0yZAnt2oDwV&X-Amz-Signature=dfe756809854b0079ae73b76c5ad59a8cfb545a035953dd5c44697cf383fef7e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663VYQYIWW%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040447Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQCHH9Q5M2v0tn5KgctxPgaXIpwU7KDMVTZWicYyepjAnwIhAJ1v5ws1G0ALMEjYc3shSk3gU%2FE6CHJMDqDHlV8Rv%2F6QKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzMxfsJZGlVHqugpJoq3AMPfjT%2Bx5aTYCDwLx0YoJHp4orsDrJtI0Fy%2BYhX5dCkY3H64D8zJvjY3fw8CsCvwC67CJjDgR%2FE6kWKX8kxh0yZt%2FO4ybW5UmfrKyFKOi5SZ0AR4wmd21RFUzNuxTRvgPgvyYKxDQ%2BWED2ICzR9PlQllhXM5dliYaYVmW0NEFEPn41p0hWpzSZpSEun8ibb%2BvCqvVm1aGCVz4bwsr3E0RyhiV%2BKD0x4Y8K%2F22ZBNWgnJkdtQxpfv1XW%2FbPFwEG95V3LQz0Y8LpMV5b%2BQHMy7ELKI5RpFd6Y1FohPLLYbefdPvl2sDZm%2BW%2FFzVFa7gK%2B7vH4eTOvg%2Fsw5QHzqGoq4Waw57lFh8ZWGBh%2FeJ%2Fjr1NlGXbW0WqPgaNcVCYm%2FASHhFF1IuVYOrphumB%2FKFzA7qOJeWpbXqxOYEl96fPRoG799RzTrT0S9nLoc75N%2B6zze0%2FVANaBdtsbv%2FGTpRP%2FFSHvGpPUeoA4jzAeXkpQpvko%2Bo%2FKNkXeCH9t6E2dbgf3VkcWFez5WQs7Y0MXIH1tZnEhhHWEKPlaOeafC%2FXXJfkBBTPI1yvnTMJSE0xlEEeNimSFdaVxQKXncTZE2Q7DmjF0Cb7y7GkHRkm7QyVWhSuhX%2FyK0wMEKMht05V6nTDxx8DPBjqkATowiIPO0S36uCpQQTxQ0eXgwbAMyiFPPeBpchZwnIM8o18bcf9myDh3kJWZOKc8d8v9J9MrqllAp5mJ8mbJoObtM1go5SR%2BGEhx25fLxg%2B5uggQcwh%2F1aI0hSd19APwAHvxJk%2FxcsBViwaiaR1Orar1VFOvOrXFVfaLLsWqS4qb4KLopuPBzwi8JtFOb3%2FXKVlEQqAacCL2YlXWG902w8Fx2cCo&X-Amz-Signature=aef23ea9352527511f11096246320f574ed74b9e34c8cadebeadb9d68b9d931c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663VYQYIWW%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040447Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQCHH9Q5M2v0tn5KgctxPgaXIpwU7KDMVTZWicYyepjAnwIhAJ1v5ws1G0ALMEjYc3shSk3gU%2FE6CHJMDqDHlV8Rv%2F6QKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzMxfsJZGlVHqugpJoq3AMPfjT%2Bx5aTYCDwLx0YoJHp4orsDrJtI0Fy%2BYhX5dCkY3H64D8zJvjY3fw8CsCvwC67CJjDgR%2FE6kWKX8kxh0yZt%2FO4ybW5UmfrKyFKOi5SZ0AR4wmd21RFUzNuxTRvgPgvyYKxDQ%2BWED2ICzR9PlQllhXM5dliYaYVmW0NEFEPn41p0hWpzSZpSEun8ibb%2BvCqvVm1aGCVz4bwsr3E0RyhiV%2BKD0x4Y8K%2F22ZBNWgnJkdtQxpfv1XW%2FbPFwEG95V3LQz0Y8LpMV5b%2BQHMy7ELKI5RpFd6Y1FohPLLYbefdPvl2sDZm%2BW%2FFzVFa7gK%2B7vH4eTOvg%2Fsw5QHzqGoq4Waw57lFh8ZWGBh%2FeJ%2Fjr1NlGXbW0WqPgaNcVCYm%2FASHhFF1IuVYOrphumB%2FKFzA7qOJeWpbXqxOYEl96fPRoG799RzTrT0S9nLoc75N%2B6zze0%2FVANaBdtsbv%2FGTpRP%2FFSHvGpPUeoA4jzAeXkpQpvko%2Bo%2FKNkXeCH9t6E2dbgf3VkcWFez5WQs7Y0MXIH1tZnEhhHWEKPlaOeafC%2FXXJfkBBTPI1yvnTMJSE0xlEEeNimSFdaVxQKXncTZE2Q7DmjF0Cb7y7GkHRkm7QyVWhSuhX%2FyK0wMEKMht05V6nTDxx8DPBjqkATowiIPO0S36uCpQQTxQ0eXgwbAMyiFPPeBpchZwnIM8o18bcf9myDh3kJWZOKc8d8v9J9MrqllAp5mJ8mbJoObtM1go5SR%2BGEhx25fLxg%2B5uggQcwh%2F1aI0hSd19APwAHvxJk%2FxcsBViwaiaR1Orar1VFOvOrXFVfaLLsWqS4qb4KLopuPBzwi8JtFOb3%2FXKVlEQqAacCL2YlXWG902w8Fx2cCo&X-Amz-Signature=9352500167daa35e2f8465336987e8a53ab6610ee290e5e2237c67eb116e9d62&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
