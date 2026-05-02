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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XDARB553%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T034923Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIHZ%2F9cV8wx9Qd%2F1jk4HyH0CjXlc8p39ijNCs8%2FNxDvALAiEAsu5PywAnTWBO06y7yQekBaJSv8tuGY%2BWTYsW5zPNwJ8q%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDPGRFAtbVIeylLng3SrcA7uS4tt8Bq6i0yKyAGmuBhAs%2FJhJoF9PTHNjDG9J3rdVBdy%2B8DK0gEnHcbQbVg7KFlhqmFcfe9%2B29T%2B%2BU5FrWB%2BQbNbZy3DkEsxAwQ5%2BGSGoNKqIIgXBnMtqyuveeW7okQQ%2BD6hhf9tNQAF14Q48s0VYM2FMcAZRoj6CTQRwGMLhjy9psRsAGmXDl%2Brlik8hTcZANZvZun9ekjGtJtluGCPqn34DElzd6e6FApgUL1JVrrPvP6sZmdrJFLXMVNchAezPRfRms%2BLTbyFCNKRY5lK4g77Za%2BYdJFC3m0rg6lHY%2BVCaqZJZs7Eb1avsfgbljHJ3Z9dOrpTg%2B2%2BDVMHTU5sNPRVrVcW82MQQwIMwFlo8T%2F4sA1NMr5DTTapr%2BC98bUKe0trftqBToSegyOmv6Ae9BFcINu98PaZZfUp%2BH1F6WyDKd1LdaeOhc6KJT7qGEW00gkKQj6NVRqPQVN%2BAq%2FY6jBr73RLXOYXwY6jCWyIYglYFDbzFIYmBXtVgoK2YyB%2BF2mmbf9WdEsbkEbo5TV52ee9H%2Ft9RU6Q1Llvh2EMJl4BUvl8krH%2B8zfzNHMovb8dTOoE1dFCC0uhPqMN52zj5l2ICbE5Qzy8jhieIef6V8UGBPZT9ONn5kE2ZMN7J1c8GOqUBaJHzQeL1rL%2BKp7Vil%2BoOy2cBluf%2FxscvVwQpiOwplqaZwZyy5RZyeKcIxaf4cliDn1jTWpBT%2FxxpVE1G85HRHJR2Ql7NBdUwPM1rLnlbFGx93DIXpz8f8X%2FAbWzaK9n7fjqReaY6gD6fAdl7HYacr3RzUDs%2B%2FLF%2FVBct9L1%2F5TCifuBYQXRbcm1NxOFQwlK9tStReDbEN0qAuJbNgA1DeuLzEDyL&X-Amz-Signature=4454ece87ed819dd5804686fe68a6f331048c616dc8b7555a970cee73fef305a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SG2JCHE6%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T034924Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIQDUz3vMr4aDFTBJHIAr7aCB79ONW4MnxPLK1XYQHAXKVAIgU3xs4%2BTBMMn4iZBM%2FO4%2FPQYLPkbSC9OqLVnNCAR3pbQq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDGpDYgflGTInKF8E2ircAw6dpZ9XhmTnzgcfP%2BYraEEuT15lsFlR4ufl%2F3AgkKWScyEe4xCHNrWMNzd9jW4vmJODaOY19IoT%2B85Ju9zS%2FmqZawHJYkfN0ZIeFzsbk7TdLHcD55nupodlYoWbGO1Rb%2F9wxgiUrIKJNrqLMIZ16Z%2FN9waBXpxJ%2BsSx%2Fr7QMxYxRlrvCQ00t0hO6YvK%2BgesL%2BDFwRj0%2BPh1vhCb5amIBWSWgyizm4QMyU7w3nm6ikw3FLdCEEu5b9bpjsttOGbGkdQjkPKxQia6XS%2BEgNm4n72auYUAONUEMawJdxhkKVNQ1YdKtXkujE6CZ0w2ljhh8xYd1QDnmzph7ZrEBWG0degM5q8jpMOln2Jk7jPXIqwEcbrTb2jzyzdFHN39eDMZlTgd%2B8B08AJl%2FFDeZ45ajwL2ef1bxEqy87N1bDL0y%2FrR9luxC26TgxG6eFqYrQczM7eNR6huDAq6umO1E9he%2FgS%2Bv8SBwnj4lOY6R4o%2BnI1ofmQGNW%2BX7euDv%2BtMvr%2BBk5SxvuhVXm0hpDLFetvq6BU8%2FaXwWO78fpNE5KWCxMSVZzPea3zQDc0CCscQgZQpe6b5ZKBjVw%2BNNanAxLqIMV2uojMjsJbIUNCSD9qMO3pr1lTQ3Ezh9aDvZYe%2FMKHL1c8GOqUBAmSHtSaBf8aWDIr10lDfDiTIp3zGh6Jl9d8ZqH12ltUNZhrmV7W7REO9rAaDSIr9wBooNu8dfcPQgIQpAdCvb9MgEHozl0oU28l3asL%2FJVpN98SRulZ3ZrBaMW%2Bdr7AMSzBkMp036sfJOcApdAuK2kzGqkw4mzmAKte4CljIN5nAQeUp1e91L0vHxDsmJjBubej7rlx%2BJB3%2FNYK23U0odQLguYvX&X-Amz-Signature=bf8f21f9ee33e6765227d1937e94608087a290c44d1e187a9bc266ed0b3e2e55&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7VWC6RM%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T034911Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJGMEQCIA55tcGNGhCOCKuvKRG8ouvdaN1p3d%2BCRtCzHIuNXtZGAiByelHAvT2%2FD1sVhCIDWdh3FqLSsq2pyiEffxwaI5kMzyr%2FAwg0EAAaDDYzNzQyMzE4MzgwNSIME3lYPy%2Bxp283o24qKtwDhoSSB25d0lY5FmqwrjegPbGmGOD9lvhylxEgLZf0YEKjSeOBXVHBCFp5gMv7XnDd0SK0NisAYPQj24Pvpl5L5aPuUi1KcvKt0R9vK%2ByGZJRD94qK8fm9%2FuxBQB6si6Q0E4UaWqlgPNcswyDWkzRvUKxtfJEUckFj4VirWo181f%2BIuoN7XuW8jOIDt5K3A782l4evK9z9PnhI4z8WvZNdYqllG%2Fpj18m5W7%2FNBX9TM4ifoNwcZaOjbqlLSfMjFua36LAQkZYTQHWVskWKmsjpeW0uACKzjnohR4SH6h%2BX9cw3ui9GxTf1Zth7glqTCb5P1ETSBznecrYNhu28X6OAfrUQAsCthsagWQmsdSFq%2FGDTiptYWPkqrxX8QshgbrPTuF6su5CBymg7HiV5KV9VWn4XtitfZzpAU05SawkFfr7bRw5rnIgE0%2F032JGa8%2B%2B2z4SBeahNfyumF9KohUa9lUeHmiKaQUYpaU0g%2Bc2GILBqvbWezYnKhuHaxt%2FdumVXM4xtwOqcBipJUv7F0zRyUjl9wyF6QvP8bxvlr0drPnZyl%2BwvBMj%2Fgt0JHURo2AxkcxKDMSDSbL3Gx9W2aWNfTbtUhJ4eApnLmXCSCXl27pqLhjjFx0VlYMncNhcwm8nVzwY6pgFdWoCaSuZ2OINaR6FdoVfI0AIYy0oasfBM6tSojLfS%2Fm9w4PphoYFKCgewR11N8YErE2I9M9WlhFjvTFI8ZncG89s%2BOcVLrM33j9eiUlIoYEsgoIbbcAqvPr7BcYrtnARXkR%2Bfgr2BZL28Mgbbh0ZYj8RN7RQNVFYpPeMhJdlEssQIn7flPSb5Kx7raRVlyfJ5QSRGeHmViGRl9%2BVdX5IMHtlu5hZT&X-Amz-Signature=7bd3c80fa160699e4707f9fad1d8924bb9a4e2ecc407cab5f03beea65d77cb4d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664BPIYZIJ%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T034929Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIA9gSrF4Q%2FUx945UQ6Bg7RvHZOWz2IjUHQ2Dv8Cul8KjAiEA2uJIiqV%2BKz4EPbdbzEWyWRkZpd9qXfHgwqyO8TWiz4Iq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDHHusmB4WPeFAovZxircA%2FaeAQHaUt7OI%2BRd%2FO0UpHmZfCYDjSIfalcS3xoJdZKv0PBnpEoSgWY1ngYeXXkREZXbZh%2B2EI3xBRXYZzyPdN0FGSZFGggjux5KMf1thrM1n4iZWDiF4kdb%2BnM1FwgDjtRVZzS3xbLE%2Bv1%2FiEG3HCh4qwviy6s6XpAqiqH%2Bd%2F1iytBHLdXmtx%2FNpbn6PsqKeLeb3t%2BweDBxDDEBpb40NQp5jyMp29MhKk9bkON7KQdWYY%2Fz2CaqHRinDbuJke%2FMS8dGi4To3yrrAlU%2B1pJK0CHHk34bNWbty9vPsDuR7pYWKVJyqY8Ct0cBUHXKS%2FruTxiK%2B6ZTSiWlg0ruMjry5knCcxcCCIzSeLN4jTwOuVJVRaL6M9uCXNSMLL2GsEvhSy1mgW8HvCBFi%2BXUMy553B87kaWcwP9i3KKUlhzlLQrsLSs2QXoJO2fJt%2BDRCQ%2BRXYlY1w2X99f5DwBjiTm5f%2B3estpkmcfGu7DZgCDmcPecT58qO88KBPdMaauESqF3qYB6cTvCHojsx6uQGdfADna%2B2Qfg3jD2yZSDkPCvAEEpSfA3ZDf4Prb5ezzZPLWrU0T8UREqRJp7TJhdfK5CFcxXtErfWKHqk%2F4qgoHgYsyo5lBsp3OrMjaoAdTvMNPj1c8GOqUBc6VLMFkuTOaoE2licK39dnXfCxQy7D1Hz9A4rBHch3eACQxGk5HbDDMoEerBF74XV%2BvGXTqM48kehzwE7bsN1NUOa0a0Dgt80YdMqrlefw7D6Bt1FlpZ4WgjKwTn5jUH9b2J%2FrMWbekvsj8KfevW2yJoD%2BvQXidKH31QvBT91ygaC7xw9nX%2B9bNxvh3A9UggSG5%2BlQGdaHVxJ9snznDYNVrJwz9Z&X-Amz-Signature=315b48409417393356397cea2415667f2bad56a27af6b7397bc82183bd1e5983&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663OV23QC6%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T034930Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQCLHl%2FOXLhpM81Ijt%2BzbK4%2Ffuj2eO8fFfX3Zc9wOzCV4wIgGbBkgebkOXMnFI4nfVrAjJlSwY63%2FPpFIoSiH8ZS8D4q%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDOafRDZkMlPMibSHMSrcA4vTtIw%2BlWXbH3iLuLED46O8dv29DNBUdO%2BzhP45JgPW6nDYAeu1KK1BRWmrn8mgL1s%2FG03ZlX%2FlA%2BZYa20mDdx6YBcswMTHZegMptfnt%2Ft5PCP3YLjH5mE%2BLyCvOPPICKhW5BQD869sTT0H4U4hMQPGTXGtCa7iaE21zTlb1%2F5V05F1dzjEObo9vS14rjyoIUruFUeV6g17uwOEHOH%2B5y%2FOxSuzJ67yTCH%2BnTujzHoPtTOWUm%2FGy2mfMLpnS9%2F%2FiVDPvJ77XkLzbPVXcdH4ywCmJNCSY5xq0wbWq9nXiv0xUIh%2BWYlGSDxEs58O7VeO3FISvRf4RsCReMw1qJvAP0d%2FsAj%2FnwbFZuLyTgSUCni5OeB4NZtC60v%2F3CiOnoRcLriKHgdPp6plXQd03%2FR6xBSSI5NK3QBewLT5Y7O6Nd7rEuJJ4phNtDsRkqK89DeDWYdv2PZCA14AJkPYTQcRlsi1QByKf9mEffmgfZhsH5QJmQv4Z3a5cLYpvSE1fHRy%2B71lHcNc5zel6G84hxCupcR4eO8ZeA%2BJ%2FHUB8qhjWs78YzU8a1DFCwGpvh5EYoWNFCTM7oBxhW69abAN0M5r7pu8UQ%2B9rh3j4tYl1WysEzJsk%2FgVddiav2GnBUXNMPDb1c8GOqUBEQaF2EPADUrGokdJSl%2F8MxgpZecPBGzxQe6YQduZ1vO9hfMMzfoT%2Bs8m%2Bu8%2B3lwytYPsHEhWHRrd4bRKZbdL70uPUAonC6HLADlPhz8B%2BupaOI7Kx8khtXf6bbzbSwXMozqBMJ7bmiu0nHJxBC%2FkgKLbG2cFKen%2FjENPnZJwPyS9XKnIgUGzQU0Cjq5s56kpBqAnOShbutf62W4ZZjw1UPeojjAc&X-Amz-Signature=77a978f195d8b8e251bc39da5a26a55c0e78689f8c734fb007ce67137c1f70b4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665IMIB7VB%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T034931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIQDN4pI0i9xM0VGsNHfc9fa7o08f7i9tEQd7M2NBWNOc1gIgKIXGSEwgLXu74UKKeRUFOkL6awIJwYCa%2BOI2O4uJ%2F3Aq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDCCgtUdmprpD%2FvayDCrcAwUknV6oLP4%2Bn8aJUvwi1L9RR0RN%2Fjw%2FcI2IW5xI7xOeS4ebhdHMst0%2FBtHPMf1aG8O%2FDgGAcwiaxGMPlXqrZlSsxx3w5kOxPjoaYB75Eb2T5272WOd8fhhT%2BzckL2nd1NlAHAWvWHJrgnRvPK5r1OXKq%2B7FYnnC7BUUnhuM0Zo8nONDaf4B08HeK2tqeFf8cAVnQtxD6%2F3zJiYTWR4UQ0T4BQXLIi7sLukMbUkjioe5DuzjoEg5lxt6qZM0KByM3pMQo8w1%2Bspd6TkGmhCC2K3jk1W74EH%2BH1NlctdQ2vu3RXxtGUlk5YqhLMqtetmteAWbh8lEBP5iGB%2BdPz%2BR%2B6vCeo4jtyrlxjRs%2FUi7dowGqNGoI2wzsVpkuUBBDgUs1lmcTU8AOR6nl2Z7FWA2ieXttQhyBzgYeL4uEF4pArPGw4D6Duj43%2BZrYskD7sqk3Ep1fGEAOid7H3FMt9ASrDnfKQ1c0lLW8PxutPG0YlAeC3CKJuRTiMJSPWlSV1hCJKzZ9stzLFTR0HFAOcASXcso%2BvebuZWOwVZ%2BBVEeCRfsRXpoEKf39EvY5OOkhePCG3NksLEgB0ps8xU4wrHuxmFmXGOvmGCNcXif6ZpApNDBAvAwZZFbPTOhfx5VMNDJ1c8GOqUB2dqHS5wpMjCF3DoDweQOc1hjwpL6obMzVFE6mJS0Nfp2tOlYR7IsutuHu0d%2FXJAgx0Ox%2Bm4s1OZRwuHcKWWbv1coepX5h5Gwp%2BO4yAsE8vj79rmt1A2FZmEWQffmtJxAxCSpaFlsacTcHI0XrzjN%2BJpW9trptwDWPcaieBULXvRl9VODp7Ih0WvOX%2B8AniXR6Wki2xtcr4r4PJbF%2Fl5DF5b%2Fifqe&X-Amz-Signature=03f3bd9d6353d561321c4dcca338691c4d0610d1c3e35e63f9332a47f685f355&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X72TA4IC%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T034931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIQClIXX98x61hwiKhhnWxxg3Mzh0sGB4jH475wJgwj6W0QIgB8U5isEs5VwCF1wBBn06ynk5mA7ODtHsepPWFLvrNqoq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDJ3FZwl3OnVCmhC%2BmyrcA6coXMWMdmSjQ6%2FOHyKH2VigfvgsCEfUQKQxCZH%2Fi%2BbxbznHWNoXenIupgBZPZvotaxJKACOxW85DXOqYsdP9brSb3F2n8l5nap%2FP%2FzSv4sLWcctRblbB6ND%2BK8AnGXrZyW3uZD1BZglAs%2B3MDdyLsv6BsRKfd0DUh0p21eSotdWqkiGIy5mSh8MfmoAFUFsrJNcjucPxwXSb1PBwTK%2FukLQS5gc1m4zdA7bzkUG8kNg2lamk%2BVQS5ix9wxTcJftxkr8RKS%2Bzu91hH%2BKzFKC7EFZEe1%2FIG%2Bg%2B5hzgE5kRQfMlQ8RiAD6lyyvoD5Jbk%2BOYIBJgm8msgNtebypKmTx4bBjSAosn7JOShAB41k7AfEKKptza37ztZuM9EWQJpHcekc%2B6Tpca29Fmz6e8Pi7RimiB4KdJCjDflPOx2bWzEMQtyw0yZCvz366UA6rozu1ANXts%2BKww50JdF23eVluxEcDWCUr57h3d%2BS%2Fe75j7KVLQ2T14UPScLOdBbG8cmi7Ja%2F7Ka4w%2FojVsSnML%2F1ELk6dlBL81nkawU5X%2FHvo6bXFF95EJBG2L7w6culUX%2FwfcRLNF5Nh9SIo%2BnRS8w5XJXVV5eHRE%2FIXH98cZAjqYwKjmoceFAAyX8nUs%2BCXMKvJ1c8GOqUB09XDl8rjGCpz8WZaYVroj2u%2Buw2Hb1W9UVjUbKNUJ1TV%2FKgBo3rbmkFl8%2BD7NDyi6gWqXvfOLQ7kkKfi0%2BaiKqx8dG73b3gtZhZ7ko2LuBufYrkCThW3gfhHyYbiTGfOtKXpEmc3GmfAJZ8lbVlcDVsqT9der7lrFNGRf0tJKQsSdmqLMLAvyeHQk7cvfFWEGGSHkP6tKS5gn%2F52akXoJV8NrTps&X-Amz-Signature=d3497a3a28dca329a3ae9630f481dab085fd917614a304a47b1073d6bd733e1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466THYB2BGD%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T034931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJIMEYCIQC12l7J%2BJvRK3EICiqGwP6QuYZ%2FIOT%2BdvhKeJdMUaAaEQIhANiovpPAvRzg6oiCW4lE%2BmzKmMUcz7IB3ueMEcCYj0nFKv8DCDQQABoMNjM3NDIzMTgzODA1IgwgLt3lx6VMl3BrZocq3ANAiwFqHk6RCFJPU0h378jKuH77LL52ekzuTgWi3zcwkfWiUqFu1NNvKwmGTnzuxdFNdSlyaAMj8cD%2BJFFZFBeHZr9whlt6BzC8qMBI%2BqZcoOtU9jFN0cc3IYOLWKq%2BIkUWniCpBj3wbTO13uDmal7A3DfJMCcb9GJMmiddyt7Njzo7lz6JFQzNkIDYfbTsLr7dgep8ksKGfYDoT7yrcc9uKUccYqT9avzwQFy7c8vezxrKzI15QB5%2BToHLnyBSDKWkbN8CBjyXT8yJ%2FJMG5sjJ6NTr4sdrW8swbTJrTq1NHUNRUQT8t25zZ5DRk48%2FTdhqTIpCl6KBJ8RKhbhM6caHEf74apAJMJdCGysTTkNmlXIi%2F3cgnt11IgeRB4t4YtypQdcC7ofOjGsDKBwug0NIgkW6F00LuY04kLgeUyi9ObkUfaFjDD55xoFnz6SFaUHgl8kXbqa3DvN7T2rutDWOYkWNDQyarNhClEMVe6iXnMUIRyhTeBBzUmTpZtWMbqpMecmSyka8b8ahTRSDeZR6W%2Bdzcom%2F%2Bnpbuf9HWqKRv3lHpUn%2B33uZfr1oqow1D1rde65eWIDGV8w6KBRYbA0sbUlccxmRMScp%2BD%2BaYRdEnbOaihytq12ObqbVyTDmyNXPBjqkAaqfCRrJlRp%2FK%2BU2L%2B0BtvcKsta%2FjQRGeden1Ias30q2dF7LivpvIxa%2BQY4MWl1uITTX%2B%2FUiHdR3ZJLQbA%2Bxl5%2FgDkSFA3V1fA6k8T8X2oTJMH%2FkeuDjLFeAMqxrcEaaUn9STNfubxfEc3hmLN14LHg0mSZJtf%2FxluBiH4nrdDpwPEVw0rmIuDe33mErovRKaV83Cvn%2FyAwkt%2B5T%2FNffYGu8NzeG&X-Amz-Signature=53be0b21a0ab268bc2312ce822c7910f634ec691414c552d5b8446a131f3c4e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466446QPV4D%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T034931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJIMEYCIQCcFx8kZn2wrhFie9JIgpblqodpfcSdk19izqarDzMBbQIhAJLR9zMket1777dhciPd7tLFqQkOH95BO3q8SgRlGrLdKv8DCDQQABoMNjM3NDIzMTgzODA1Igzhka%2FscrbVHHoBp8Eq3AOmoKr9WMhkqXqetAUlAe9MXlrsM5%2FypFsgGNGRifexx215BCvueVKtUwznQylDDjX1IYaHU6Wtllt%2F7f9PqwIxpUrA3EuZxa14s%2FgINv4KaTyA1vlYxe%2FdEwGjd3jN7y5i4DLbYpvEzxOJi%2B5725YupgjH9EBE5RP1b5LBc9DRxxSEyMcpWwxOyDX89P6KsD9ysuENMiZ%2BAw1QvjwTpQiuQWdDjE8TEFSqD1sOEaE3iavVC%2BU5kHrBw39iBEU%2FRgfi4qH1ywFF%2FrtQkVcjUmCh3VfbJUhNoxjcJL%2FdDc%2F6AV3DLURELJWxu6clh0J69gVRpyQjeV55fiOBj2m4WtMUgXwEfczLYaz0iHezNoKbz3H5mtmpUANKLhkbvS%2FKKoEJdlsdqPmP3MgDVEpwRkc7Vd3niD%2BUox9In7q5Luvm%2FTv7u0dOeGVXIprw1gqyO%2FTmZH7XjNIfkYyYXpJw4mpzp7zW3Oy%2Fgop%2FiRUeitmyLWoyJKRWUPnv2iwCBqgGN00nEpnXwmPpjgQpMyQ%2B%2FAuWeBvFN9caKr11%2Frq911UIq%2B8TbbsqHz1xCAkAkQIGPnAw4VZJchWlMbJ%2BnJulHyWkcldvJcOQTbkiL5%2Fho7V9J8To3w5OhLmQnLVnYDCzydXPBjqkAQ32pIhzZ1IRNBOdeIac%2BfWu2CxXdeud7b8%2FbdDp%2BPUY2a%2BgNzN%2BiivUinHUkxwwL6hvCYMLAyOyIQ%2Bz8Bzot5yJq19cK53ZVcATvVXC9O%2Bi8GhtMWKfWVglVPDfzAdowHmRchD0%2BG%2FsW37p%2BrnnkNPsmTffGAbovnOPtDR0BQlBRKktMkDSNKiW7oGCwHCwFL%2BfD5P%2FfUs%2B4GPkwNlGqva63QzH&X-Amz-Signature=ec5e78eb746da779577e7c4a36e257092e9154c9874a519695c519fb9c9d0cca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665CXEE462%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T034932Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJIMEYCIQCPz555ctINLIDAJj0H8ic4NJwM2SuUcEa484WRMI7kcgIhAI%2B0MShCRfT5vKeudxjPUCpQfGhg4GiVQHH1sYn6CZLJKv8DCDQQABoMNjM3NDIzMTgzODA1IgzxrTKs0iSwhWvtIJUq3AO3f4HZphITaMrN3XUNfXXlJErk4fTHIlrME2UK4BDx0cyzZioec9wbHokPzWCAAU5xB2a2axTnVyDMLvX1pKTawS%2Fa9TwIwf1OI5DZI4xk1RFYPG2JK28s391wcwv%2Ba04%2B7hz5ss5YRlnY4Nc53HG%2F%2FRTzrbQd2cliAn35LlZDJEk207KvYoJyqnuKQ%2FVxjjGjKLoRgHKi%2F4ErBO0woiFG5HKu96yXv5fZNt%2BzXR5S3XpAbGcOhsxZmJiK7dJBEbf99a9%2FF55kM4%2FT3kk1QNW6SJ349RZOfVlFnGbjy7hgpSha8oE9YHcvX3Ct9hLkar9KyW9MYxparB0B%2FlpKnIBjntUgcbHPFbkUKFE8hvWfW4%2FcwiVMd%2FBBPUUdQd8pWrNY8pwYSZplZO8vWhwkLq5dKSgE7jLYes4mnGVmOCdWFJg5M0pthVe5iIaw7Y84oDzRjjzc7BUTBxjTf1pbXk0OHzDzEnyVmZK4L6QbnfMgjCWr84X19AGN1tHnCBVSUFtDOf%2BLtBPgvUWn9Gq1hz4U9a682s4AcoFcZsPOmHaf2hEO7KQVrpVN%2F6OvK2t0b2QPo0s%2BpW1ivJhziawvQnnNiltCwGurmUOpBPazDa1bdvC8guaehu%2FSMIeAZzC1ydXPBjqkAZTCOrSw0Eds67GTCVPtLc4nup53K%2BS8t5OYaDmxvYdUrpIpCfBcEHtuH%2BsNNPI5YVP%2FITu0eEdJm80lzwlCfNBX62m3Flg5Oc0cAOL92zH3IZzosCSeymcMqojjswioQM%2BUudQ9dM6WA%2BvOVIJI%2FZkrhxq5YlWapASbGJjUZw2zZh%2FXcBc8M2tWjcVSEr0UlKZwOCAl2BBgdt4isP3XjlVm2l6g&X-Amz-Signature=21ddb3c93287abcad188d7c76254ea978f4708062dcc0b1747b53fc468557264&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QV5UVCJ%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T034933Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIQDvkrGk90nk%2ByPvXrC1knZ%2FbDvpwfI9ero0zAxzOrWKJAIgAjuAkmQ9EmxWmekYbzATlSTj0Zjd3f8hUQCclLhr8Rkq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDD43rh2Fmqtg%2B75JOSrcA09eyVMCwq1w%2FD1DgxAgVYnKo6RvxVbQiDm556xXn4AJK9WcrK1BAEuZgKHg%2FjwFLayZ3NXcb%2BFi7jIcJnAkNxyIhyuPMJQDJWT%2F%2BfSwdqzP%2BmZUl7z8IJHg8z4CBLYW1icdKVU538H9y0BSyadYH4%2Blh6VZdzLOZ7h7Vopo9lrsu%2FlEg97AHSGo4pwqvowcjUvlc%2FrDHVj8IfFQoXC%2BUHSdkhdUVlabyYdY6LE3%2FiMWEZqd8%2BLRGSgQLIRtIf7E9MwGnOFN3iXmFSWFKP4qP4EHTWH%2FB9lwTBQkHnwkmgL9SsbU%2FSqzO%2BVOfLHj4u28XtLUuRGzFdrByWs8PUq6SczHyyip2UuEHh%2FlDMTXRcHqm8%2FSJx%2B5mgaIO4s92iPofQ13WPCvhJvqJoDMMagFENOi0uWviL24Z6Wvh%2Bb1Sq1DbbFF59eCzkC2fjQY2lFuUXH6l8BdE7RevDaskM6ccQNEDwMcKSJxSYqEsaz2AtsR6R%2FVcxCdVcJW0ca%2B3UFw8lRKmO7Si3F5j5YtaUgcb3luWmolq%2FS%2BzEWGf57akw%2BQUBEjMHb%2FrlWSjlUv4PoNhinj3FY%2BzwHddXLPBw%2B0zX9HJGsU98cpRzD9PT8G%2F8O5DEWdciZK16d88L4SMOjL1c8GOqUBrqmcVnnOQUfLfTqyFQGgoi06wvx7WGLj5Jq6mkrIGYrKDvbXrtCgegAhYs%2FPImGE9RIR05nyvx%2FA0AspkJnc52P6az2m826CszcYRVH%2FgrAWqfS1u6v1axnfOP1FF5uC%2Fj2rK8Sv07yqePv%2B%2FMK2wceE5DRmBCwwkt1M6IHEgN2tIzjnnhcthSQ9xD19zyAIwD2Ez%2B3180BoE097MQe0BntbMFfF&X-Amz-Signature=9e31a757c3b7130992e8e745b5910c0023a1e93c671cee1e23ca276d34dc51ab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UUDIJ3IK%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T034933Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJGMEQCIDcB2mpZFp6NKLRCN1Nc6t7p7Pp7NQg5Uqa7swDTIPh4AiA6BhLyFHOQF9ZLhc6o1Rwd6w0oYpTnxNowU%2FSmuQ7GxSr%2FAwg0EAAaDDYzNzQyMzE4MzgwNSIMG1S4pvFmS5AWnc%2BSKtwDsTy66FYW4f3a1vO45qioxumie9oQUd4c1Xr4FjVNjnGTbzAMlVjS%2FtkO4G7LIIpGDP6rHzSht4xEHUxqNkCUH23VrZpNDWbRpzBurWbUPNgMrrrsJLltXbn1a9FGoR7KHtPI852KP3pqwhK2QzY%2FZJPBlWYPyxIOI0Dp20gJerf1%2Fb%2Fw11BnGLkzvImqfZEcAQKZAwGHRhHiuXwqOsZ%2BmK8yaghZ9%2FgFrXHEQRdigbA%2B7xdveNb0V8DRg9Rha%2FM7e0be1ByZPDx4gAYA333XhgD%2BIkfPetSZ3ErwB%2BZTp%2BRlQs01N8dk6EsGwYU53yhAJVRdWfUlp44gwf8g4SGDO%2FwqeP%2FQWegkPQSwqul1pnMgsFhqbVl1l%2BZttbh4k7BHLftAVOFTpb8pxsEOMi0SdUyKghGXVt3mFqDxfbA221ic537HSGHk%2B7qzs09Z9IpCdoN4iXh1ywD2ksY6Mu0v3bPFQNeO6qLRJxyYbz%2BDjFmYsmA%2BGAdhOvAV1bGboQiKBBbub9BIlY1D6qjqMp9%2BS73Cox7yl0NL5d%2FOd%2Fw1UvwDKvU3UxiLlYn55lLJPKvEyoTvee21UDW2OuMrcqigeThrAc8gZPCmU6HKk2P3NbJMRxY1J6GpP4Iia1YwpMnVzwY6pgGZIlkFa4wPaCzyW4KOKtS79z%2FVaTNA9PpxVYUdGWOaV9s%2FJigA%2F8uZMV0CIh2GzVqpYTcGiB6McJ0iWe30IwDr5AkgRI4qqFH1nrmub3AhLu7UchunJIFQbY8yGvVynFMPQByOi9QArL6S2QeRoSZr8WAZzOs2UJ9heI45OGi8GnMi4O47zK3smsKfkpJVdwgSjDsivkQ9yr9OWJSkP7E4z0zGIZnq&X-Amz-Signature=ef7bfe535f98da50f4a2044608943fa4e468c500bbd96f328a3b84d4408fbe3d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZU47SVP5%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T034934Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJGMEQCIEl4wyPqCH9LaDiOPPLBplONy4qpYrODoUZbIfxnBu8CAiBMstMHS9BNpHOIHNcpoCqmJSJFt%2FTJwi%2FFS%2BonPr8%2BMyr%2FAwg0EAAaDDYzNzQyMzE4MzgwNSIMnt96q14Ijwse506jKtwDmQmTA%2B%2Btk1LHFApmz4MvctmfUz4cKR6GzY%2FZqWiSebqkUAlQOQrxuLRFCGKXLihbz30z7AnKUieg1mQvwK%2FPq8AR0fxRxita3U%2BzrQGoym%2FovttRx3ASePZ8oj9Oe8fZSIaVRwGNhIioL4lqWRRfbNNhjF6AWyPXYUKd4mEdF2qLn76PN1XqsalJWKqx110ePR3HDFuRGcHTHlSnhNtL98OUUbVDPaceUGmYh%2BH2XsDCYFoUZSHXGTEUVAmnKHyYrj78VKu8AQGzCip8MAyClUHn8IvibpbftQIFQAPW%2By5anbivTVegLPodwgE1nFLdYDcYSpBm2QoDdQi7hdMMntUvR4p2baWSMxGwGr7HBMIidlK25s9SVIb0CtayCww7hTzKc5lGVZznxX8e5DLNJ8RoPKvHrDfLrRpCr9VYzWvC2ObeOkCnlvwHgOfY8dLiSeW%2FjZF92P8L5rJuiHOi4en574b3w0tQbkaiY03kV7NQR9J7bPtF9tcPGvgPolhtjTFK9lH8IzOlYLrB3hctwuFkKbcaD%2B8tPKxqqUaF7L0%2FuPPlLxaEDEhJEdesozuhjSoMSR5STRE7CJrAcsKUC286RkAGAz4%2F6eny%2BBy19e24gURVcffTlm6suEIwjcnVzwY6pgFPHnFPavJUZy0wW0Sgh36US%2BjfAR4xWVj0atJDrCE8TE0l0woLsQZikfxiAHHeSjEWj0e1JJNoBKaF%2BojFNks4Wa4QbcI8%2FA1%2FsAZeWzqZFAkNDyEfRTroB6qwfc0tzY%2BZlvz%2FhDQxWz8b1UHIEyqfYRIyNTLwNtkP36yohdQvMXMmpO%2F3i0qVyWYOiOO9zAl9uIO6J4%2F4YqMKR5SLipq3aGCBxcaz&X-Amz-Signature=366c4a3e5bd236bbff26bf53c3cb396d8af9d5da137f10c72b3dabba3a4a9bb0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZU47SVP5%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T034934Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJGMEQCIEl4wyPqCH9LaDiOPPLBplONy4qpYrODoUZbIfxnBu8CAiBMstMHS9BNpHOIHNcpoCqmJSJFt%2FTJwi%2FFS%2BonPr8%2BMyr%2FAwg0EAAaDDYzNzQyMzE4MzgwNSIMnt96q14Ijwse506jKtwDmQmTA%2B%2Btk1LHFApmz4MvctmfUz4cKR6GzY%2FZqWiSebqkUAlQOQrxuLRFCGKXLihbz30z7AnKUieg1mQvwK%2FPq8AR0fxRxita3U%2BzrQGoym%2FovttRx3ASePZ8oj9Oe8fZSIaVRwGNhIioL4lqWRRfbNNhjF6AWyPXYUKd4mEdF2qLn76PN1XqsalJWKqx110ePR3HDFuRGcHTHlSnhNtL98OUUbVDPaceUGmYh%2BH2XsDCYFoUZSHXGTEUVAmnKHyYrj78VKu8AQGzCip8MAyClUHn8IvibpbftQIFQAPW%2By5anbivTVegLPodwgE1nFLdYDcYSpBm2QoDdQi7hdMMntUvR4p2baWSMxGwGr7HBMIidlK25s9SVIb0CtayCww7hTzKc5lGVZznxX8e5DLNJ8RoPKvHrDfLrRpCr9VYzWvC2ObeOkCnlvwHgOfY8dLiSeW%2FjZF92P8L5rJuiHOi4en574b3w0tQbkaiY03kV7NQR9J7bPtF9tcPGvgPolhtjTFK9lH8IzOlYLrB3hctwuFkKbcaD%2B8tPKxqqUaF7L0%2FuPPlLxaEDEhJEdesozuhjSoMSR5STRE7CJrAcsKUC286RkAGAz4%2F6eny%2BBy19e24gURVcffTlm6suEIwjcnVzwY6pgFPHnFPavJUZy0wW0Sgh36US%2BjfAR4xWVj0atJDrCE8TE0l0woLsQZikfxiAHHeSjEWj0e1JJNoBKaF%2BojFNks4Wa4QbcI8%2FA1%2FsAZeWzqZFAkNDyEfRTroB6qwfc0tzY%2BZlvz%2FhDQxWz8b1UHIEyqfYRIyNTLwNtkP36yohdQvMXMmpO%2F3i0qVyWYOiOO9zAl9uIO6J4%2F4YqMKR5SLipq3aGCBxcaz&X-Amz-Signature=0e62c27b92f3d06db352832a7e2d36d09da5ed334406b30535187f5f9b588404&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
