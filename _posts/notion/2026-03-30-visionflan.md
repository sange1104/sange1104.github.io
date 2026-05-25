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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666HTX7XHQ%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045007Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCJBMC%2FjxHZQLfZiaW46DFhFciSyvYwukctmj5%2FCTJLFgIhAK%2FTVPEWZlW%2F5lWS3wUAex4Lsxn1mKMaO%2FEDw5D5j1bGKv8DCFoQABoMNjM3NDIzMTgzODA1IgyPWyT%2FhyXmxA%2Blfocq3AMk9r1oYHmsAkalKpXVoLxoOn06j45tfvOZ6lWEcOHYgvpPPYBIocsZ0lerO49j7E%2FH9WHcCD0DcG1QJe5bTsjxl3aKkcgRj%2FWJZ2hbYqDStqZAEmhKKKah45Z5DwKjRkbDUIlM3IRPedLMflaWv3Uvn3C%2Bsi9U%2FTSvTajEvK8ZmiuuJbP1zdj1YD4567OCPgGbHl7iUZ8LXWec7u5yCXxwUz%2BZfTHw7wrCgl0ZR6CxKkmPZI2rGwWIuWnJxVL9vSvoKVelWKRxqEnJ1P402UsrWk91DeNiKeG0aXlvZiGxvxIbNwqTAjGKxys%2BlRP%2BLKOkOc6xm3vFGkLKasyngBIBxrQk%2FjuHvLKCza0pF8uaY5BaVyS5AV%2B0Tkv3zcwmeaWjvxTVVMDTqlDwMEY2RSy8cmovmRqbqkFNcGkajZIK0nmFCizZpW7jfovT4ktz71LA9H6pkVTSfyE8frkdGCbLwDoWv3sSNwESQqZ%2BLDtVwzsVUvj1iYSdR%2FZoIF0QjUjscYeP7A3eThENBDuR%2FR0W3%2FiUZ6vysyrMcsn8oaf7an7OIXjMapfE6cuNafSnRNH%2BJN%2F1AVxFdGuTcBWLky6%2B8KIM7r%2Bf%2FnpCu%2BflhyCvuXXxN5IpNSwnjt812zDQtM7QBjqkATDDcDiebuUdHyeXtOjwLA%2FN8PRQ%2BM0baJfyZW2GrE2eR6ZGmN3myMNFB%2FDAUhILVpTj%2FPpRl0VyJCrmpgoSKOxsOzUcIoD6i9nclocCc%2BCYNdHs8VY%2FmtxQnLcxazqrkwgCA9oS00ZPT%2FuvrhcEgN4PfEj704QdBu4PiSYwVSTqDzQVA7AG9DjeJLV6eU3nxnsqxUJA1QsCunLHHeuzKvq2fU1i&X-Amz-Signature=929576651b1c2ff7301cadd8edaa27ad1a6ff6bd4d5b9f12c5544a016366c414&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z63HTWJO%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045008Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCf1kNsc1EO9KV2mTmxhFeMWd3fDNcKAsiocihWOuTySAIgK2eMxxlVz2aAnrJ6sjVzMQRS8EfBw4aW%2F%2BJpVeUb%2BUcq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDN21NPDsJAPuzAJ3zircAwZEhGwWLRNpDLaWSQgaUgWLGiB7xvCDjDId6s02W54xakfkDf17bBhnRho1X29Fi4viRYuTFYFI%2B%2FjQoVUjpTtTjn3FJEDc2njnyy9pSHqIuhMSIFS5rWohR%2FzJ25UZOEVimbPYo1IxANU1IFAzmfnRdc5qxgGKw%2BP%2FJBhqg9XP9AqNjQOxCvLxub6m%2FpPI36o%2BjxkK6SRVOPGhDUVXNBxI6XZlARa2a%2F1SefTOIcCT3sF0vrAUuzO%2FuZjRblz47rQhDD%2F4cT52NS%2FIb6rDJbZvXYYRfxKkp8RML71Vd3AuoOyse0LchBg1yA6OMCcobFazLpCZr2U6Qa45wAgBYERdpZ7FmTitI1xPLJZW47Ei5NJ58HbsAId5y6MZUEI%2Fgb3vC83693BaGLJZWZeoJqLeLWNYbf8FWKuH7DwhRO4K0ijSqyWuJWoLg4DYzG9MRY8ByHmumc%2Bn17EWM6099S6uhC95m6WkV1BWL2C%2BX2%2Fx08%2BOVUrWTiLHppnGv9h7KhvNwUxWk7B7oyp3FLv437xD9RDpiGhsIZY3OSJ%2B%2B%2FFolQK6qnxqjuLABaQ0%2FSPcLS59qkO0HRau2mY%2BxWvrzGppIJXYZmS2ThjjIzoB%2Fq4bP1dNaH9Vs8CsGU4ZMPqzztAGOqUBnes0PQaShudoRexE%2Br33%2Fq7xtJQ9K5JSrJf0K%2FcIRbYgy6Q4TO9jddbrRry5p%2BFpVZucdwNgPaADw7GSszHIHstQtKUljrr5palU5pkCdXBTlJ94JlZCMVvKvaQoMREViAMf%2B05KJPNroEYmgPGgPEsFVNsWMfa7s8c8AuEhug8DAZVl95II0Tm4pP2OSj%2F7aoF4nTDHbmPwAMAU8eE9aJdgD0nV&X-Amz-Signature=7077347ad64a336e0147c9ab53a8f3355e39e537bddbfe51613824e2ac10f434&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46662XFB6WI%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045000Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEqLDTYHJFG2cMNnThS7MdT8EXXAJMGhwe3601SvmbRsAiEAzGbgY70ydey7H7J%2FHf2ODg6TStaiddBz%2BgUjoEUM6E0q%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDMq9b%2B0zh7pXjkRJ%2FCrcA8OQxrxzZbtfYezGJ4SB06DWrpRjhqaXlkDyD5BEVLM9mTFpZvwSeaGzjg7uIcOK5yI1JpCBFcYZJzUI0Ry%2FkrGaHNwoqTdoqgxj9kaRhxEYHVpRZDbyjbJxlv2HrGyqArxz1a50L0geFbItJbSvR2gx1Lfxr7mBiZgnNljf9EeYLc636QB%2BN8OMv6Xyh673he%2FURhxkoFVyd2VqyQk34gglTnI5oHzl5cj92cZe%2FtTK28He3NI7Ugvigv6czLIYCRb8L6yaTrMkoRSQwzSbL8dlMYyakopfsHS0%2BlhTG6PcXmP5GvIvY8v9SbIZYdgt%2BWbQPoIqG%2BD2TwSXtFV32doyXe%2FdTYWZFHfCFGXVhrTsbl285SYiJyTPJKAubTYvvBOVYLVqVcWR%2BizzDLF8AuS19%2B%2B2%2BNzxJ2yAxGPCtxV23xBEYE8sQZoYGslsRm4%2BPcRJiRa7c5zhOSNCBgBkVcpBd9lMihjbQMV341kJgq6m%2BCfA2r%2FqYsUy08kU%2FRVm6asc7I6wNSD0TR%2Bu9mdePWpc%2F9chylxej7UJZpGHlahbbWlJGqrlnBbu3eKC%2FybgmvAQWXUXo5%2Fh1iUv5%2FSqnCyohthznaP4cLEViOjtTkbcqBIgxv6KzUIHbaFOMJ%2BzztAGOqUB24cgEs%2FcYkonYIdrbW1P4QQGYMKhpP4i35I7DAvkPMEGfO7OiyMH9EEgUaStpIJN5Jvop8ywHcyC%2FQpNFmAcojJ8uCaL5KvWLVaM4x88a0azNj1hLTRGmXse22Usp8rQg34lhcTD687Aj%2BahHIEXinB2RuYDoTi2Y1b4kGzXvv5IQyPQi8yJBHe9SQUMP7SUgSb0iBY%2BrFXVxY9C6JUtgoXR87%2F3&X-Amz-Signature=e6776175a026a15b6d572a75bee45be523351eac1a78d4ee9a73d93235a0fc03&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VTZEE2W4%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045011Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDYDWW%2BvLkk%2BhwZMRhThoaA3eKBu3vcc4Ez6NlJ%2BsCvwwIhAMf4AMygUqRegGD5lVWXspHw%2F3WvgmQXjTnDgrpUUvHqKv8DCFoQABoMNjM3NDIzMTgzODA1IgwVHBPzep5VsddpVdAq3ANIG%2BiVYcHUtTkDwG8qryCPeTOCEIrjok%2BCwwECPBOBf23UjCF1Hj77zFbMwKoyqecEN0L4t3QtSIG85f8umaTPZ3A3MePRUu9kxUkmi5brwTCpcqKPWLtEIxeuSdBOPNLUIHsIobnB0ZKV%2BYfeQAAP1cUIqJH%2FZ82Mtny8uV5cwQXL1bBYrwmZYL83THFefpPupzanXYVIlfiEpOT%2Bj7adVHjUmWNiMAYlTYU5ruS32hQ6rhOLY7dJghRXDHWaYgzyTecWKwFnehSEtHhAqR1tkFjGqvq98hm0dRk1g4gzJGXhwdxuRrKZ03y9gC0mMOUCJ65l8S1JS0faCw2evHhltex0SgkIMj32F56rTUWKB06O2LiXNJ0IijurbvTl57VaMsqZT%2BjNsijGg6nDlMwAkE51CJLbV6QfrxH3vf4%2FhR7umHY2QUdYMyVaOIYXOnwVCGQ7fPKRkPpK%2Bx7FoDEljysIe7VZmwSRRC0TA%2BtxgUFybiVMFtumd89OlMkB6GxuOwpEFMBDHi01WkLgHCqr3QWeWcYLkvlZCCoDEeSB%2BSML1mIh6mndlBA%2BKO768I7X1gz8sko3zOmgt7CkevwkdGYTJ8O0cYhRIfanvZ%2BX0eVQNTY5OJTUOkOeczCxtM7QBjqkAbsnQgYUbtD8C9zXPxkLfP9schf7NNcRI6aMxALrgLTCEXHzj47OzyfdQGklbnNcJL0QmtWhleFrV1VXKqJ%2B6WKBd3kdDKK%2FCgANg0A6dmcHIxclmpVfNgkTicv594tXSzVY7nXZ7Acfw5nslH7nzH9OD%2Bv03Qus%2FDSQC3htpoB3ji3etnVyfnvZlx7IWRHA5BILXL0XxFXh3vU%2FgRvIJUD%2BNeEW&X-Amz-Signature=dc5d3ec65a1b84e007de55637dd5414b565665a9802d8b2c134aed0fcf94776c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664P4YN2KV%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045012Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDNvhrSv8nvG2dCK6htYCzhd5xng1cTvfNoMB2SjynLyAiAZz0xNkgWPT8a08%2FvPEWwfI3C94ZAU%2FF14%2FW6MCJAcJir%2FAwhdEAAaDDYzNzQyMzE4MzgwNSIMjQkafdkZ%2B%2Bw3VJPWKtwDPIuOnm6p0GLO%2BGwuBAxVcjT0lazhX1%2FY0WAvOjA3zqQYloflBlu%2BRC4PxOu50Y8JQdIW6H9bE38exnzrs0Xo3WXVMtgR3ZFfL5cqWOyWhZ4tWeRDcw9ZJhta0R0tH3HVbgXQpoFppo1meMvRg5auBHUPJxSF57w0YIVqyQ80fsDv6DUzn8d25uk%2Br2T67rNz5kNLG2KYh2g6zWB4cDfn3rDlG9tZ%2BSSsRoThyO8VjOY5lpqQvo0HpWTL6Ueia8GYCEJ5rk6UfUcPJFO78xA5ZdZm2PDd%2FkadW%2Fbo%2FibQlQSKRpRxL55tRDGJwA7eMfyxapru1PaXvuWaaEZR9R84IkqmopJNcg8irsvxpUhx7k7TLZw6V3YzDjZAwZZYY%2F3S9E%2FAG9kXyllJwrCg51fcJjnc0VaSFQ2B0Q8whYvrwKz3g4SK1hmassS3FybGI8dNeNrrrIpVPILjtzg9d63SbQ07ALddtu4F3gm882RBSPVRhdt5YwUvK7TIyOy25uqZ%2BJB27I5Y%2BRclAG7jy1%2Br7%2BgY4z4412fHkYI5Oa%2F%2Bk2S0SYK%2FRQ3cNge57Iz1j9zH%2FS2h9MVOJpstI9MXzgD1Itd35%2F7VOKv8ZBBvcnlShbJmiYYa%2B%2BxW%2F11TQYYw3pzP0AY6pgEC9A6rbAuuoSZLlij2amJj1WyF8nxuwHa39m4te73QNsJBTHEKFq%2FIUBLDJvTHCNFw9jdADGoaZzr1%2FnFG%2F2kbdRbfWugh9WWDOAoYJUl%2FizrqsExcDAQeBQJEzP56SjzoACen%2BafHJJ1ZGDzq0lLOXeyoPFUIDD25QS0lEQLJuxeFQPDoGpIMIkyAR93w9VG%2FfGmN4QCKWtBNN9GECPcEslGYhwAy&X-Amz-Signature=59c1382e10bde8af015205a144b030d30302878ad16941b032659897093aa46c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RZF23JNO%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045012Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDXdEfCozxjIHC44v%2BWcbhLeDPLWlC5o2ZQ4ViG8WcLSgIhAOEjYDgogXQw4jFbY64U15vFw6MwW07wQCLcJD%2BbvFLJKv8DCFoQABoMNjM3NDIzMTgzODA1IgzvFvs%2BGM9XludjN8oq3ANvrMvNZfdKFWHxuStFaDaPQw8PyNv9a3Q9KqR7SxwPdpHVkQCfi3Ex1DbDnRWArmSZp165Hf7c8mv%2B5evgLg9gCwCIJd3j95K7Gqhj%2BXkxXudly1bQJWdtwaxo42VycRltFNGa0ABGpyhRlB3p1mPrknFjt5eNBoD0BxDGQwaEMIe5epuNkPYx2vYQ7DlhAOX%2BVDIrBlVVyd6TsNWDmWm%2B3%2FWVwKQFONmudlFWYNfPaai13ZPNh5JIZ%2FMEacXbMXB2MDMFsv2Kb%2BYcchfaT%2FEO7%2F8zEkkx0PbJp04lCYDInNgy9AepuxloG5QFzPWHWb3VQo6EOC5RPfN9J0bZ1IZ%2FwGIGtePsONTCIMiXSPZQRE3GaPRoaJlLTD%2FDmFDSUNxklb4iqdtVJxYmSVBZEHV7LXQ8mzYtrzw2IvUTVhk%2FMXR3QHDNIyYqD9CJueyGRwa%2FK5qwN7iQiTix0DiglXMaRkwLg0qQJ2wZsjXzIklLnuO7gSk%2FNyzsNEvO%2F%2FNIxowUkRrFOufH1U%2FYZjPApkgFKFHpPZEwFh7x23kd1%2B8DePCvKst%2Be8IfBIbGrU5U20kdgN4JqWzRdGRp2sFyBih%2BCydJYg8VRT5bJeYVTPVqaknFDkxX1lVtzx0hIDCIs87QBjqkAYwmpAyes12j9Su4Q%2ByQ1dw6Qw762YWudHlrM3fPGFf38A%2FMCmGLdn%2BF1K5Ie6sEp1ZOv6t86U2hRaQThjWunzmv3bWBzTT%2FKsfSvn%2BgQC9qe7YVGj5xTABtnNyyLuGp0at%2BXQW05h9R%2FQ7S2mdEfWHm8bJ7njVTFSMhJlmgxn%2BzpMcYibJBqvvbic3WIU0BoU2lBVm0i%2FoNoa9%2FUYvkVaWrxAh6&X-Amz-Signature=829b860f4e15bf0711af9e24ea8cfe1b7a99fa21b155f4c9b1a8ffff7f63d1b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XMR2VUBF%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045012Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICkSQQ8n4SIEwIxi2GxDgowhqCqBU4X0Jcsy40Rii%2BLXAiEA6h04qvT43sUhwVySqgmAwnlCZ3LaHqc9%2BRv4mqHqRWwq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDD%2BV2r426ZWTE2FBzyrcA2lX2uOhq7Gz1eem0ajZfGDdKnwx52ogEp%2FAYfF%2B7KtjD%2BAJWL9hesEl0ei977X9SDm5HG1tuyW7aVUFSfmW%2BDD4ebtQ%2Bc1R%2BgsWN%2FjpyySjxAJcISdhTYcEZXjadAgHKJU0Og%2FEhrexiEqwlC5dwwa4MGGTdwKNbzMo9PYI73O6UDctxPhyZ6Yxs6JYqo7VN7eLlWUohdXe4%2FCtaRbpHQgIKWxLchwdvhOiYLBRRbAbejuH%2B9WiI0ld45%2BalX%2FooxUaDLUXCCMIc7YN%2FIp69Y3cwF9kL4JtnOoOtxZyQ5Vv2gVTCIQa93cnXX%2FPCbqd2g7LEemaBij5tlRKLimtAhHnJk0pL9ef%2FiMgvXzKGHQ2MvkAO5yrJSgzEWUqdg9Ph0GjopJNcroTDArkeoRKckOX8J%2BWxAlPZFovlJ%2BU8TKhT8LE8VMUJMflL6Q8qgowdFGNZTUR9XOOJtKg8ihdYqmAYyRjF%2BDDvmZaikHBr9EoAVF41RLvEB1ad6FBP4uouXkvfYMm930Ydx4deQSGzrXc%2BJ%2Bk46cgghr7pHJMV7ttiCjYg2O2kb9gVmKRCgq0%2FYcBtVVMRVJXNSJ0jEKlAqpC93PuOoW2VQkA4UyB56rNj7xQJbGTRrSWtLT0MPu0ztAGOqUB0P%2BnIZw93FOzlUPOWZqv%2Bg%2FGWUE%2F%2FJyxz9Pt4GjXs6G2nlH6noavrM%2FBwXXcEy3EZqmMkZBktqrTtJAGRCm9SC%2BFKFwSmq6Bdz3fib3oqbAmMO96TKHz1DdJPqRB31aoSy1lXS%2FtQJWOAlOaxZQUWF%2BitKHTv%2FZOsKFNuMCeUjo80KIX0EQf59XBCpOWFTkLJj0w6woBoNaM2bCh8rZw9whsltNt&X-Amz-Signature=eadb7c5abbc60d3a1c2004da9c8859e49efb8c178dc273438ffd901be815ee12&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SWFKH5ZB%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCSzzn%2FHL7otXOIvbc4S39GBjaPLuDy6Cgw8b2eFlGBtgIhAIEMFl90yANqMb4MuoVWovHDy7rvt2V7cqao%2FjaSwmWXKv8DCFoQABoMNjM3NDIzMTgzODA1Igxk%2FJtoOXLL4A1jL3Uq3AOmUIWEur1uR0%2FJCFAqI2DBn%2FImg15QBH78VoLQ6frQW9UHzIRFQqe9xlAajIKlnX5tNL05UII8RAXMXNoUUUGAPugdztJawlMbGJzUF1Z02tsirfdkH74lgJxcSnzoZrAi5pfSv0ew6to7T%2FBH0xAsy%2FYqokCwjcFCiJG850LPajeqTYEFbLNJHT1yxg2Ub2zjk6Uj%2FfQOerPxG1WAF5MyZ1s2D4CBdoYrC2yavZXcMKxgjGCf9ikEu%2BlDOR%2FUMP1hSLY0zXh9OvTTnCGmz1npzrQ0%2FNGQZ8zbh3%2FHDx9DvrR9DKTh43bbMG5%2Bwd3%2BugLyrWX3lPFJvGJKof3vEHjVKUY%2BvpdEHSP6LLCkDSbC1hXqa8bqC%2FIoAkT9Kb9%2BY1LH2U842QjM2e7QJmSKIOEigcyDRAbhohAoBT%2F8e1SDb%2Fb%2BZaEfC%2FXLvq9AGArIKwMKzEEsyQSCIURV%2B7t%2BA7iT%2BylZkAl5K3i0lsxJRDiaej753IzS4xsqS5Oq3oGhFJhie8gxVcIgPL25XcfDAFth3zZ2isaIi8yqV2b%2BFqVJHiPTLBseYmk5vnJMUNOO0CCh%2BTHW1%2BhDOVv3A0p1tjuMQg7BQCv0ymntgO1rFJy%2FRfGJDBILpztXrHH1gTDHs87QBjqkAWjJYFzF34R1YtTc%2BCoOdZRnT3FRrs%2BNqFrsACP6Ga%2B9dwchMZXgsaJuSagYRTVOp0L3KzbLT2lczxW8vSeFiaYRI4uLkRu4wV3dAZA8wtb0abc2WcEzxlnoZHGgx99vyR2vwFOJrL%2BpydrHzhqbeie1TxLFLbHZAUbsgZHg8dXXGudI1hDywj0JmmS8R0avOYTlveG8xMFL5qWz4FcUFsGQWWQm&X-Amz-Signature=ade6c25ef6fd94c37747b89e6c9a21c0797c85dbe9d3cf06843cd35c489ee4b0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667QHUIVQW%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHcqpjTcfAO%2BrHkKSPEUvBcHG2j87Z9kXbqUw0aGg64oAiEAztDBFlAee7FMWGL7V5wM4uZvZCV1ZKn%2BcZlHM1Js7r4q%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDAqyhfeByrz5PAsP1ircA7%2B4xV5U%2BHeIlbQwJVdqA0t%2FVktjGtLKQK%2ByTDYNRNlodSAHzLNsT7X7Gd7Ehkvmhomcrhu01OKCztmadrrrl%2FoeF7GSuYBhzJWholHfEYmU3RvrouMuWkic7aaPwJpzvPtqX89c82lMOWlJVQoJMnMgXCFJ6ganH34H5ayK%2ByzXGb%2FKHvVa18KRw0APWSdbmKgrIC7NGg5MNdlA6p0qRiWgxGsx6UOdii1R9gvhXZf5%2BkDiclhInqVSju4noxP39MAzOHASd%2FyIQA29pnCw9Sejg2y0acJUh7njSPG%2B5WQK0BDP6gpBDiZgm67CvgHh3x9tmSO6EnWOGIBW0gyUoDk04lctj75v1OtaCyzTNwRArcb12Tdp3aZHQy2UYMnaoQ9H7wy9D3ButH%2FFDmAu6H3g0i7gayBAkezqhjaXjO49RofUoHKZ73RnKIaI5DLAD04tvZHIlbza9lZe%2Fqwg%2BomKpTp5p45QINHsV1mYzW8Dae7%2FhzRvhc7%2BOVosV958ovvqFISSxNMK6%2B9ooBH0dAWXSy8D3A%2F1g7oEugS9yE03q52xUiMZkNqADO%2BTRuuR%2BZ5nO7q7TVhLUB1gpAMYQBgjMXtJWrqzQBgh%2FbO75lXaZeCQ8QUfo%2BRVBoS9MIazztAGOqUB%2FXZKCuYn00QAWAJYqtNpnL2S8OoF3Gwns8rDYm1Id%2BsHSjD2b6NRmnwEs1OHOUiLVnp61WYSWyC8x%2FvENaDVoErM5N2LUjqW30otrJq3G2ENSEstrlFK0%2BgDOBk3FGQWWr7O%2B%2B2aU0ad%2BQKDrsRyzTSuXwuNmRgeobcrANxgfKOdKfcnNo1XREhOpSpSKdmhNjsUJp7n0X3gkgGWlfHQPmxfwBZD&X-Amz-Signature=d32e2550bc94b1ffd0dd91075e11b3dd56e9f061578d927089df4dd5c7cf9d56&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666VVBWD7W%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045014Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCKN%2F3g%2F54OcmR8wogNe8GXI5CUW9grmcx4kndTCzdPlAIgfDPGp5XcMVmMeJoH0g8w2BBfj%2BQEIgVAb2IAxqr9kL0q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDFdFTvCyhSfp7qbgBCrcA%2FeWeQGW5OVAJlcATXpcZLbbMRe5i1dPfSUhNG8CFBEshmkypgsLAZms6l7DFS4DshPsVqcVOnsPFM8o0fZN45udKWc%2Bxm0B311LSKb%2BrfLus2Tiu9awJnlQDkg9ZDs9carp3P0l6Iuf5Z0fog9GHjpBawP3z6%2Ftmqwk5Qm0RmJ1Id609JJSRxWc2fuYY%2BeDUhaGXl3IZa83%2BBN7BnNo3QFeDYLcsIbhYWrnyyyny6yw%2BBDtJ9j7TQxyJdDgEU6WGMrM5dQEjH288hd80wrAd9GCAlSjruB29yT%2Ba%2BSdPL1W8QJfBGImcHOJvkJbMX1nzFaq6YbhqFplxdmGVUPzARJK%2FuU03Rl1GBzW0ur5ruXVh0n9F2AvUQGYcZ5jc7EbrU3W1uO9NIeczQhgSfHzc47mIRz9V9XjLgvK3sRFwT%2F6byXcYgMrh8AM1T28sjY9w3jgkW1L4cBuODj1bFs0ni3J5nf8BwBYqh600Fy6QWDiO%2B149NZoZmpf401FgMfMlnphzMcXTckSLo0qi6OR%2B4TgZEkiayvyfgwR3p7h8QHzNp5DbseNputMcDawpvK6Ahz4FHDlw7U%2FgTtySzk9sKqvNDBxRL9V4TYkYVnL3aer37WAi8TRx9ZcasnwMJz4ztAGOqUBEmyHNnEmkeUtRRDTaMkwPxKnXAOmolB8O%2BpnBdebiOFpbySRRACSkCd1K4S6wumAVTL1WpJoryowsJlGRqSSHc2atNq7Hwoes%2BGrrjbMW5ofgYlkSHCU6S36KyaV62ORKTYXmqadDgKkAl221Vfzw%2FtT4BGUQUh3wJLhcccGj7cZwyP1CUpqIvQhyiwr%2FPu36gnaBgoc1xY9fr10XxrgCKRLm4AY&X-Amz-Signature=7c864fd984068175d89b22f67969f60f2e05d5b680200e99a307752c6da25370&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675PIIOGG%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045014Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDBvr2Azg16KD89uvzmrSMRy%2FX%2BGyX%2FAfNx3UQidcOGfQIgHULHsh1NBW%2Fcn3vKZJtbyzG2H7%2FvwKuxMOxbo0I%2B9xcq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDIO2ZG%2BLBo5jnlWX1CrcAzm0P6OKmKZbypAcnHCHu%2FcigNpBW%2Fr74opBGLSRDFIXU28CtqVLIwvdy0lA2sFzdOnK8Za6Vpt279jWyad6h2i47QGrAdfcBZDjO85J0UiVv9U4bVeUv%2BDpt0E6uo1cWFm0UJmfmneMygxAgPFIkvdA7ZVWME%2BSzXylaIx1RMHOAltWGNtzpWfPRiqWkGh9hUabQ2TeXpNqhN4qM8U3MMPMqK1EmkivSdXHSsA675NyDFMptCE8uH85ePRkXqaJ9caWhI0tzafGCnJL1hebk27XG5q9ODvC2ijl6tYw4mhCURFuyQ3oDzC%2B6X%2BNgupBbSi9YHj4nXEGMjsJJKdsey4tFnLYCktdZxUBXlU8zP5k4pvrOhh%2F6nf9L1uj%2Bf150A%2BoUeqcy3V5jex71tt5SBshpILZPUPWlKYKXfWUphcZkOox3eaigUv0RQAIZcij4voXSFWJfxG7R2m5MylgE7zkQcdtZ%2FDHKT4KTZNnam4jK5oziKHnx2XcQQh2ZXLYpPj4LN%2FHno8%2BRltXvg%2Fseech%2FsMxZkFdPcP7RONJxYtbqSkjmsYJSCVCVGBiEVuKiWeb8ANVmBJibg%2BcFmmkr0F69JFmgPRANYZOMVhwdKXPXAOwo7OrZPaaweoJMPyzztAGOqUBfY7Z2JjgV1K%2BB5G2OnqLYSe9r3ImfFFOqXvh%2FUHonyKNKrQcMQvhq6oYKnkYnbmSlRVq51QwCKBMW3pw3QS1zjQ1qeppDVpQUvbQVOKTL3a3mH7lthwelrY84v%2BpHD%2BggIEUf2IYPoTVkXhPnbuf8LEEMdlHqc1JpFtDm1SYLqtI4Q3gTJo8fo1E5O7mrwfkR0tWa8Pune%2FCpPwYE3POW%2Fm99%2FNN&X-Amz-Signature=52e649b04775eb27e7fa22dbbd0f9f95949ad1188bd6e50c969f29841d4ef22b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667ZD5WW5V%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045015Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD%2FbF9Zp2bEVAa2Dkmn3xWWeLOiHwvrXx5niWDM3VE39QIgFnOyKlzXnPoDdJEO11e%2FmjDkepf5xVNMC943ELdTJpgq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDMf6rvVq0PjINTV%2FtyrcA2CGUVry5CsMaqjsEdNuZD5PVF%2Bbm4JuEfhFe2KJXNf8LHAZWXpuQKD6Ty5Nn1QLyFqrukbb4%2FTqWEixI4UXnZ8qYU1rJ%2FTz9IdvJ6hYdnxvnR1LQWBR5ISp3egGdoK33BHENsZacFTPm9Iqu0eVq6fsebwrNcX%2BG6egLFp3YDFXrOhq8GA8bRCGId0oukkrC4AaCcnbR9sH8wYopkPlZaAOSHh4Xi1EoikhPgTUHdRwf2MZpN0zOoXXqwjdcG37bgHi0wqoUreEedvKR6NsWuE5VNReD17Zi3ALAhbSoMJp%2BvfZzWed5FIunshVhPaTo2OxgMyg%2Fd8SujVHR%2BeUNhZmltYt%2FZch5n%2FiFCu6RORQPtPzNAEfW%2F%2FvUpRCkZfHua%2BVI7ozeC42JQ0WGKQq8YQAI6EH1mTzJ62ts0mKic2zrRb02yt2VtGuFoAlP9mVfXkBJp%2Fscq20Kvzfss8XQLRn6yRhsys45a0tvCgAmxmTKGwWDwrfcz6TMaMKZuqn2%2BYTdgtKhtx8TNXrsWsWPb5%2BmKogdDZjeohf7TuiAp1cwPsoRb8Ditivv3Um%2Ft4Dml2VXJO4ibEgeWtg27eUl3dvGEJJyIXos7jW93uOi%2FHDaNkHN6CIjJTDRYBWMPi0ztAGOqUBgy1otr4iuTmSE8bAWRSws4y0%2BgCZyJFPlEEvlHAqijjcQRnStZ98nlVml2fsir%2FvS8YH6EuU4RpwYKFBLaf0%2F5hBFN39DmCM%2FcO1Sw6RkfLZQI4gPAu%2FAl1KaHVkXT8DX8kGuTBs%2B7sMbcIDovvNwNVbHlyPtBbZp8ZtDPYD9FP%2FXmI%2BY9mVzE5jq2YrQVPVO6eqHhGYZJPVfnw%2Bl3PBp8hOEA%2Fe&X-Amz-Signature=2a3ee45472c0d641f46b5a378c562cce1945bd939e771e88784154c836232432&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SFVUW6MM%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045016Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIG7DLxsOs7Jfl%2F%2BowiR2foicxJ5ESf7JLVSX8%2FxIr3k0AiEAyi7zhO7tjOBtboW%2BfsAuT5qB0tNTOvF3Krxs%2BtJzvQoq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDD4fWbHOnKL90gaiASrcA5dC47aDwZOg30O81vPxW50DAXhE9h1YdHMRVlZhCo%2FgXf4s%2BknjZ9S2FfAN22JA5qQbyNEIHNGbW6LFnr0ZKm8eDjo%2BI0RsgfRg0PpxMmIp5LF5kFXRs4NIVAHxggP4MPq3eG8w0uWCjvXYQkXsh2%2B%2Bwce%2FFRTomAcTbcWYbpYf7snUc3NvS%2BpZeW6d4c8w%2FNfZVx49LJklk1dtA%2Bs35NixdnRf1Vh3d9P3amuKLsRTjm4oVAoGj4vi3so1uaUaXUA6HxFbWp9Ce0HVUCuQusfcbOIsbJ65j2Ws%2BndkPOOWnphDTJvukiplVlwXhvl%2FFGsg3%2F4WjgqA%2BX6be0dQS8KT5RGxCyBvszm064aJjqIkgzdjeDvxrQBQnXqXt7KDnDGx%2BUOrdoJcplLIxm6ezpJXRkkr8InjVVDQWCnPEnvr6sYYaY9uqke%2FqROLN7C%2FgLMuRLXGufz4fV07rHsHStAdc2ZhkJiiOLck8kV1nvp16YrYJt9euMCi4fIhR58XXBh8WEWc6tdFjBF1ErD7DLADkuIpqy2Sm8KAwtZUZZMtSB4hb7p3%2F%2FPpiOJFifxOCzNbWNG8hq0TtLyxbjPAdTAdPkAadjsYUynSzSiQ3NAN%2B1M%2FTOHOlD4ThmXEMIezztAGOqUB6ZvsgmgF0dD%2BFpbXST0T3n48QOYAoaqaGRSl5R3WXha9VeKBf2LaJ%2FA4JinZ2SEGKKbCbdKrk%2BWjIskrJlxWhMhIF%2BD0iPRBOqdPVOSjozMSoE77l%2BDOjeN5Wo%2BAZA4mew7BpPHztfpgaQtdOJWJUZyT8A8m3Of7%2FVa8QizLRgjn1clFBnzdoGc3t106AVisPjvVu7piRrpnv6jJ92BVgRN%2BhSSp&X-Amz-Signature=a7371c229c7f230ab6ef04321b428845b64358845acd7418ffb2d5d15ade0a6a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SFVUW6MM%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045016Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIG7DLxsOs7Jfl%2F%2BowiR2foicxJ5ESf7JLVSX8%2FxIr3k0AiEAyi7zhO7tjOBtboW%2BfsAuT5qB0tNTOvF3Krxs%2BtJzvQoq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDD4fWbHOnKL90gaiASrcA5dC47aDwZOg30O81vPxW50DAXhE9h1YdHMRVlZhCo%2FgXf4s%2BknjZ9S2FfAN22JA5qQbyNEIHNGbW6LFnr0ZKm8eDjo%2BI0RsgfRg0PpxMmIp5LF5kFXRs4NIVAHxggP4MPq3eG8w0uWCjvXYQkXsh2%2B%2Bwce%2FFRTomAcTbcWYbpYf7snUc3NvS%2BpZeW6d4c8w%2FNfZVx49LJklk1dtA%2Bs35NixdnRf1Vh3d9P3amuKLsRTjm4oVAoGj4vi3so1uaUaXUA6HxFbWp9Ce0HVUCuQusfcbOIsbJ65j2Ws%2BndkPOOWnphDTJvukiplVlwXhvl%2FFGsg3%2F4WjgqA%2BX6be0dQS8KT5RGxCyBvszm064aJjqIkgzdjeDvxrQBQnXqXt7KDnDGx%2BUOrdoJcplLIxm6ezpJXRkkr8InjVVDQWCnPEnvr6sYYaY9uqke%2FqROLN7C%2FgLMuRLXGufz4fV07rHsHStAdc2ZhkJiiOLck8kV1nvp16YrYJt9euMCi4fIhR58XXBh8WEWc6tdFjBF1ErD7DLADkuIpqy2Sm8KAwtZUZZMtSB4hb7p3%2F%2FPpiOJFifxOCzNbWNG8hq0TtLyxbjPAdTAdPkAadjsYUynSzSiQ3NAN%2B1M%2FTOHOlD4ThmXEMIezztAGOqUB6ZvsgmgF0dD%2BFpbXST0T3n48QOYAoaqaGRSl5R3WXha9VeKBf2LaJ%2FA4JinZ2SEGKKbCbdKrk%2BWjIskrJlxWhMhIF%2BD0iPRBOqdPVOSjozMSoE77l%2BDOjeN5Wo%2BAZA4mew7BpPHztfpgaQtdOJWJUZyT8A8m3Of7%2FVa8QizLRgjn1clFBnzdoGc3t106AVisPjvVu7piRrpnv6jJ92BVgRN%2BhSSp&X-Amz-Signature=0e5d750ec5854cf365165894f5cb63c396a1e23d1216edb77a946f64b2fc9c31&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
