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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YW4PD4XJ%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041217Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDPmQO5tj1neoy8OglmioCCceUK7AwTfZgQhYccBQdR0gIhAJmaUhrrd5QTT336Z5%2B79Y2a2LwA2nbNnLTbH2BiodpoKv8DCFAQABoMNjM3NDIzMTgzODA1IgxHfLZc%2BXAuP0FHAkUq3ANkblwKlA1elJhpm4dl1AOFYjGjzbgbkhoveksWa17m8lT9jAax4p8RzrWr1tAJegbvHMXqJp1rhp1TlpJ9pN3QJw8a%2FgoZ%2BrkXyGj9uHS%2BB%2FChqozU1orEnNMuRkLRQCYq4IVnqNM2kpewqLPoLUzofvIfhuZYvSysbYXdd1EDA1QiS%2FUoyfHr%2BmjzIbWINiH3t79lJ3GPs7QKRFPMB6kj51bOjMWl0Hf14DKK9QUF9gN7T2LvEYNCbIJho7MS45x2lXapm83A%2BDQD67Q3icxwLgKW3jqCJIthfQb2qrBNDl7Vqp9WoeZvOhL3MQwfrTLllT3km23xdtBTNZfwNCeWzrEaHO8Ee%2BwMAx4mMdxUGcweJlW5fio49HDk%2BGNQUf8NSShImLcCKP2B2lHVAiZpRS3tk4SIe9MyVY7R6lCkY4RFFOcSd48NArM0A5ebap2EfFTq6CqYkeP3jhZQx93TxNJAkHWVxf8wZ6vlT3Vnr43%2FLjHSs8p1Bdxw%2FpG9f0DXS7a8TzFMQwMlAccWvdMkCmEQckc0kGG81VwBFbarGtw1baVcWg6WfGXka9Vt9PSCUYA%2Bd4Gz3fxvuLpeXPtNVuxKliLwESJCJAQVlqcmrqNNw68Sf4uoPlYGeTCUh5TQBjqkAdDGRp6oGUy6D05qGQfwoisJPZ%2BHA7uWwI5TwbS731koYiwKB6EJPBZi%2BnLP8B%2FYAhxwpWBvzIMLSZWxoZQt3eU1Yc%2FVEX2B%2BtEwHlY5v4MO1TZH9S7PWzDtIYEtGpSS6e0mWhKo4FHm%2BCfIvB7TN4ZIgLKLC0N2vU4y2gARxZXYLYj3%2BL2cCDFHcTN9a%2BMGwf1VpHSPOskmmUPOfBuGw6ganBAP&X-Amz-Signature=54affb440b50437aa84da3e9f968726ccf5f4f0c490184a4802308d1e54d1483&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WASN46QY%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041219Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHjF9YVCZvK1m6HVNr9GCFAUWjnqNSTTPAycuqRiM5HsAiEAsiCnqk%2F4HxiNA8skrOuexNpWcYEjHDPx4mu5kOBVeHMq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDEJz1AOJHzfSU3WGZCrcA%2BIKKgkVVavKjNi6MKxqHdER%2FGDSUzbcOf3SPD0ONxmEnARBQnNr3XKvjVVFJMUjETuYvkLWu%2B%2FiNT7MRA6U3ammOZPEeNiAIY%2FHXetrhSEJefeEFxoAvUzicxQ5nYhJu0Nu%2BCJzlMAmz6nOmsYs5kr77nOVDgd5Q0t%2Fh4cgKr47XrxuRkn%2Bbp6JJSQeifFn%2BR%2B1lClEebx3%2FYURZsJjOjUQse90hU%2FSRFKvqmZdPNInooVvV4vTXCMERuvUosX9F%2BAHhx%2Fm1ZkELauWyrrdsf1UAATrCwmR53Rhx%2B%2BPfGWfq5OtcFNX%2FKXfv8b9evzkQwZiiEUmZKrMJe1GvEfKUMMBlO4CaQ0VkomRohDAeqCQ1gLunXyHeeCRinpEnHGrcTVMHH07bsA8OGbj20JOHH7Rm4P52qYqBALiXuBTYOIJNrdNHZWx9qkiLmDkE3DCf%2Fg4BPCGRKQsVoKYnaTATU%2BAgUqf%2FLkV5SUHl5Bl1pHHb1XAmSYICdwnE%2BTH01cjDXMrT9x5OSJGknEImgYOC9qiu3zWNhTUCYDBfqOjIKYJNeQz665bxqQQlzANcBJmTlROdV%2F7fjXqwyZT0AbUgrBY5TN4DMmoNSH5C9Q%2FfO2kjGWojsl47rukC6jwMPH2lNAGOqUBwW1StDjR6yw6Ut8FqyECSuVOwHv7xzlSoDfe%2F0qAD1u4n1D%2BXfWMaAuq4e5SJ3Mx9N%2BOQS3NrFESUQ7fr%2FjedZWiYFX1%2FOBp1kbBXalXmUNU7tEvjQCgJb30cE4ARwXljtaTSoYto23TNVrdlo2gcpFxYV7qj58iaRzVjkbCra%2F%2BCSAE0gwYvGel2Yerlvg%2BnTlOoZIxmisIZ5iwSF1MjrdNoRtS&X-Amz-Signature=83600bac7b36ad306c43bc34c73f3d3cbe376413f764c4d36b7d153f2331cec6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663ODBYGWG%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041210Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCPe%2FEyexY%2BEWQYQ3CY0k4rCDvUtk8FhGodhD5UINq63gIgXXGR4FYE4EBnPJuaCFvi7ACjcvYKHav04BFd16bW3PQq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDKc1P0t8VlkegMkzqSrcA1dOt3kCGMM6YwusIR%2FUXJ8qT2AHttKGGhwO%2FFTxKsRSx%2B1q411roaLN0f0NQoSX4qpR%2B%2BWrjqcLLfnUQh14%2BIs4xa1zsozGGdrHfV7XmzRp5bZ7W8ZzCGljEH0y0VatDnAlU4vFQ3%2Bfs2%2B9kw4jTRQiXLYl0eKvZcMsrfvPE9NVJVMvCkEq80uFQRKda9leKbPcGR4pO4SFestbnDT%2FIf5A4506Fti6NSE%2Bj3APuqXpGnFZ765LPdbVVe2fkifztQ9Q3G9uPrCbp440RUUF433CIU9FijaFqvNsVTLlo4a5HmTq7btAiewNkrs0I2T7TLTKDxmgxhpi%2BOUnJ6LJV3N1pyCHfcdoUyxU0qDxPfmOj%2FgHnjRhs7MPpQCf4wLW20qFe0NzNA0n%2Fox9u%2BlEae%2FmDRC3pV5NR0hx6uiYB0y4xkoU22cQaLt%2FBGphmdllAGkAwqObZumJ5Uz8ZW%2BTWDcWJel2l4OkPH5uDoNFb1aIX%2BUV3mTLD3eLOAITvwTMqODtneb2ipJ7hDGRh6oepXaHxgEjhKgvQA5l61BBY%2B%2FhRZE97bkZpni3CIpsGMbsTVdOQXSnyEsJNNQPlFMvF%2FxNmxjsjlVmTmL46%2F4S%2FksyeWOlWAOSSG7Dgxm6MNbglNAGOqUB1aMrGNMZOS%2FmIg0RUjdQKEI%2FGajO3ScdV0NMwwehRuHs5lCgehtOtnebJKIBh4efBZoFVfGRVLgjd408tDRAyA3bJ4anXCO3Kvo%2FUdyAnaVDLT9QvEg0bdpKEr3euu352XXfvjEfCvP88gH8ykbNa25nRCynQrhr5ULHzwR5i8CCpt7s6DM5%2Bh6Ji4Ah6KFcHwrKTxK082bmY0FkfvKZmPDd9hhZ&X-Amz-Signature=74ab0a7ae809a9646f881a1b4f40fb44f8509d2b4c20b744b698bce5ae67327b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QL5HCOXL%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041228Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFJ%2B6ViVfgqogR63sCF8IQeT5jO6sBFoNfROUde48nHJAiB1GViUVNV74BR4VeCYfVJkTAJfSm2%2Br0h3S%2F4MP%2BvDfSr%2FAwhVEAAaDDYzNzQyMzE4MzgwNSIMoyEsNipkTwo44oHjKtwDmPfKD31l6%2FMLbHfpLI4fV8%2FuHBa0cbtIoONHPNFYWrKXtrEefxiPkosmlTlUAwwrl%2BswZYh%2BMBn7fvRQmcdF82%2BbkukhIQwVlakTV9bTYSiRQZ4%2Fs5acgDD7QfKWnLb31oHb%2FXb4Cekfl1Y1dJVcR4NGZkssA8LeEd%2FK25%2F%2BeF%2ByP0iPsxGsuNmnADHT2NiRY3DQI3%2Bz7RSHpG35P%2B9H9EwUM60UvgeVRSjrddEqP9IXOvgYtbrhqRDR7PNCWUJ32GY6%2FCGb9piZs4%2FYLVVcRSwhGbDsqm5RumLTtSS1kNBmGGxpPUsGI0rBl2rpiWDFyK8GoLGIP1WudUG%2BaIzlxk7kH%2BRRFrNzto%2FRPOJHD4gqjfM%2BZtTlFjQy6klCa6zpfsLtfUi1%2F8lm%2BXw9i1a%2B5XEYCCvs3c%2BJbB17IIQNSZkQiuka%2Bl4hoLCg6NOxbuZq8dY85kSmWBuI4GY70w%2FS9mZQicwF3jTGjrrfwnNVmQpkGxxgqEYw5H%2BWTuOtmj2a8VWwQKKpVuUgbF91rmIZaoLN1OwyXbulIQh9Js8O%2BKmMWnDbgtvLodQtb50DcQXcL%2B%2FPUY9Sx6Zfb4ovAwNgB908W3bXm9NFOu03h4kOOHMeGDljlP7i%2B2%2BaJWIw0YeV0AY6pgH%2FHa6cxeio4Qfq5Nk%2FcGZIH6ShTG5UXE7k3lbcLpUA4yEo6KlEW4bQoxTYECq0IEhziaoS0xQbJfFYUu4jUPW%2Fbn%2FiN3IrO1T%2BGyJm61NXeylpK3gdj5jisGYl%2F7bvxr5Ry79T9GYAeK9XCXwXLLHvxfDeKEAkc6AU8RKdBvz5lGR8pgR%2F8HTnuCBI0zQXcHAJ7yUAAJee0k5ov%2BhSHGRQwx6Q%2FXGm&X-Amz-Signature=089c1ef5a4105ffed323c9fa68c074f7a45666fb467497586f2662e66dcf0921&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VH7FX47I%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041231Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDrK7vCF92mNwv%2Bht38uu6eUfp2EHwVxMve9sdDYWQ4JAIgf%2BPfGmc4ZCML%2F9qwLPsU%2BQNNwYTDFtzB5Z8JP1JLhVoq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDAIX1bqi6dBA0kptlSrcA9r2YkwyWET9XziN3heEfhjB8LsvSK9w7ubSkOOmvqGIMhZmZ0wIXHy%2B00o1YBmx1LHh%2F1CsWpIgUAyGBPzN8Qct64O3fSHfL58LgxAKVZC6pwC3zPMK7P9g%2Fax0OMwJ9py4hbf5DRLihrJ3MCNRAH4CwO3r7mA4uylUF%2F4BtEjLnRQxJfTSOjP3kmgqDgPt4DnOTNAbpllRkPlAvOnTwOLmUPgE81jDew2thnznJiSsuyDLEMOMUNVEhq4r8VuwUlZTei8yVJgKC%2Bn0JZTQwW3FHXVWkv0Er96iLvhGB5s0%2BgMynDBDd8v0Q8EU%2BmdB9TxkqIO9zJf1lIkJ2nhrIq2EmX2WKtfeugJBUN%2BM2U0EJ5XpBTcuN69pZvYrV6tJ08sRUj9qb3F6XimHovq24499hDTPx03jxcP6CojChny8WEtHNPTpVN8BX6Inztt7XRce9i%2Bg6%2B2kcNR8PR%2Fm29C7roCZZTxk5rSt5B3YclfR%2FUEImlzrofBvEFTlg%2FKjjcD%2FrqnyHlgqmwhhGK%2BDzwH82Wu%2FOJ4E3BUNpArFn%2FiWjbepqN1FC8Wub6hVzSbkHxvfVcoJShDrfod%2B00%2Fc2HbsbAJiBzjXe8zR%2BTIk4PWfq4Fozl5ZvhKsauihMMD%2BlNAGOqUBidytn2%2F6SJbm3cmbHRl441IoiXrq8jHe5xGPdQXc7C5pGx%2B6TMQ7AxRdA%2BfA0ULEVVqck2Yqx5WURLL6%2FbiL2xJgaeQ4yFgrYCiwBde7VdYXLRwYKFGKF1MsUrL33La%2BUioyttjwKMIUVu2bUrPHsxrnRElT9PEkj4WFH25QcHfZupUjP538Ukf92o9%2BmMe88pK405tcmI3x61csrD5uBllpMhtd&X-Amz-Signature=636818adc7e695e5571f90e741094df3f344acbfc14730cfa94f5ab601eba30a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WHW7S65H%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041232Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEGHAl7G4Tj74Kddo4e%2Fx0flFJf8IqQ4B%2FKCHgQfAg6PAiEA3ewcFxWWNIJxs%2FE485ZY0lzFJSCb%2FiVEXhJNXiTGkY4q%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDN5bUqS8PJM1t9yYdyrcA20SsrSG3jyj9C4UTDiTaiSdA9mxHZKYXKTx20Ep5w1UokWsO6uQ68G4DeDBaIZ7%2FnkB52mZKH4s0rzzmI4YbX1aKqR4l0dHOefUPIxMOq00YmRL91vUuupILFAYPMBqYU31nbcaJG6u31drznjg7y6FGW%2BJ39jCy0JWdDOUyKQcH2XfoTdjYM0%2BvWtvZ465E65pTN0sMgJeuD67Bh6kp9XaEnO0aERg2Fy6xBWDVXWQo3%2B8vp7WFTrFAKsCkcrC44bjBZ4EDcemwxi%2FH7XaGRZuV3Nsh8XHoIMJaPLq%2BhJm5Nbf53CuUVSc28S2T%2FOJWHChmKA9bzN8wf7DOzfeGeJFHgzdq8xnWcc5RpAa%2BSHuG3vLeNPHLYIx6TcdhSQ4%2BMUbczLIwvP0LgwyKi4TXuJpuJTsKpy6DPF7YVWqs8hxYdIHk5jb6lhtiU1N7DUDwaVsmOIGznFkEyaoXdnjWoUCSwkjTezA1lGKUqfifNDMU7wX4Q59GDmyMNFJ14YLY6XcW731%2FV44nfTccFLBMbUoVetTO0vAQc%2FEcWUEtyfym4K1AYMk%2FEIg%2FnUDIcwfCXSFBZOQLrz07P4N0rKQzRUyQgrP%2FSdPp1pR0mashj97C8%2B1%2FLiF%2BWe%2FIqdTMIjFlNAGOqUBPidmnafWhwqZNmAgnqUBvahMFqdNreNy9rGkjDuLzPm%2FL2wujbs1o%2Bl5kutEYyZ%2FSNrKFQzmdmzTE%2BbBcU1BkYZAb8zTGtoF2W25PL3F%2B9I2OXhZW7Mw6rO2oTsSEs3Ll4H7Zxqhn%2FQoSitDYTxRmlZhgki9Qbc8OQkcrbL9yq7kzRtBXbRc%2BNxE%2FATj6qUzFSgKMc4bE8b8NElYYL%2FuX4VeWB6b&X-Amz-Signature=654c973f35789c3adf3939392c4e9491df6d6fc522c3d7d0d9d58b264dce02bc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664TTKFPCT%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041233Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDiaieEUB%2Bcm3t9e10mPcyoDVHtSn%2FPseaLuD%2F38ANtigIhANPB8sZLkK6PGogQoGD6%2Fi5y1sZd3XT1gCs%2BQCHzjgxQKv8DCFQQABoMNjM3NDIzMTgzODA1Igwq1XiBO4y%2BtmmaIWYq3AOPtcgrmUudphwyMHDMJ1apCf3sCCpSWfa2NM7MrLylVnDTK9tfz%2BcVGnnXk6ktwl%2BJIdQV5bN%2BbEN6HI%2FWG0seM21RUdmU0HLuceuq%2B14L9WH3uyVnM4TRrpJWNT0rvBTZ44BVWR7s9EzpVCvYcMXAo4v7Kvcj4PUXVAg1rJ3qpZOjR3oEvsW7w9tUsviX8a6rQnv6jJ2uFhohfWh2azJmztR4qufgGSr7uN8IN2WaxC2dLH7oXgikBh239u9C1vm7dvRFWTn5tRefcGo3ZO%2F37bYiq0cwoU5s24uvfUZ0XsWCxfy%2BQcKBkkgkPFN3EYckM%2F%2BJeO0c7dlNCi5VZm4XPRMLi%2B98oMh9DNQ9%2BUJHgjd%2BGj38CXrZAJPM4XSmZgrRWMms%2FUIh5Ea1cCCaXBeYj7q0XPB%2FYxkO1ECT5tDx%2BSCmCZp%2BQPpLxsAdPHsiZhWii82W9xty4fskZDKmPKLm4pBh0ddFhVZar750nKUI4B9DavpNMgZstymdFMye5zu%2BKEwgXOyAIljyH%2B%2FAEOfxi4AZ3QC93Xr0LfguvuLrjXFCXp8e1VovjMk9Cbqqmzva3anix58Eo3lFR9HA89OsPsdGtqDoHuRmVH3rCxcwk16tg77f5WHGzgaNmjCc9JTQBjqkASgRe%2BDOYi5gjE47W6vhcZ%2FY2IFTmGcfE%2FrscaWRhNdvkXsoQ%2F%2BGPmewjMJZbEjKnWrUubDnUT48rQQQynYSnjL4ZK99HQWmXmKnxVF19tUDUj%2FSiN5BvUZ4VyovLpXVdJgciTVJtJWyYIAQqEu0WqHZaKK1PTIF%2Fe2qtkp1OxUy1bQtphlz1opDkjbHGtugMffvxx%2BgasYKYDFaqssme6MRqN80&X-Amz-Signature=5799e32b8b7fbca429c9ed31f57810dcae7de8a85c0780bbd2ab30b97dcaae9b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VKYT7XQV%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041233Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIES3ULkVjPY9xh3q%2FekDS4EQjBpAZtRA%2BDVnTv7Oc8zdAiEAv7oG9utt04cxIGbeWyQhX7jPDnu8M2Kx1%2BCK1cw9iwMq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDHtUkY%2BebDJW1JU6kircA30L3UHXEKii9oZmQr6Ry%2Fan2tEOmiDqHQSEt98NR2asjikh0imLl3HKT%2FXCIedwUGOt97kqv4zKZnMcxYRcQxbotYm2iaSpLbVF1JaLvopP6gvJQjDHkniIZlkmPCaB%2BAVOscn9CcJhDdz1Ql7qqWPwmXhG7q33YKxsWqSr0U6EpW%2FeNGE4cNvqXxc2cM6bMTuhne5FXGXMbEVnRGZ8ZsyXqlEKo7RUN6CEE%2F4l0FQgHglC%2FkF0mXyty9cHv8MmE9vopqX9W9uanzUfjqjxckHtyE88614krzKMV1LvdbLZ9e%2FfBHeHFab244cct7DXcJFWmU6ruGbLovraxGn57rR0bEqqXxS4pklaQpZ9P0%2FAYFEKCuBuriZYjA6MtXdvlW6T7NS%2FFDOe83A2Tq7DiKKOIiGMQD8rwfIouf%2BZ%2Fx2UHG4rRagUqx70bLXbFhZabbsT6BNuPbVKdBsJVhAwc3%2BtKDkjCggrAiVaK4QnpMshg9amtuURjZDALhT%2F2gWOO6S8sUABqVQ2b%2BYH%2B%2FogEPhNLtZKD5UnQuEvehYkkJcxzdlbPVE8faXv8lruMvoe5q%2BU5jy7CpQWc625dF6sFgNJhMRWMKPQ%2FvFUzaG8gnzDkrxZuGidyEs3M9KMMMf%2BlNAGOqUBXkLPhvKoFeVsrQue4SnXohzEM73US4Wc2wvO8liOzBofkQB9f49iwqjJKbh47R8S7vaKJILysrt7tDPDlxkfLIrNmSprYp4TY%2BAzN5y6pA0HgBmNfh2Eea1vtTpI6Gj7W0BzHY8hcINXmxGYAXs25dGVh86X%2BFLzORHqZPxvnSiRu3a85fcRrlxJcH7U5dtBQuAtjqKDEhZfPpiD0r6r%2FX%2FzocjG&X-Amz-Signature=1b4e2d3aa29b4507118b91913e474bc4337749f8346060533d9b13112e08c4dc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y267NF5O%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041233Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICxl8EgJ6MIdoXqWwmqlDomJWPyxCfRtlO9eYqHp5GRFAiBGa8Cx6%2FelwPfACiTkXxiKgwkUlW5afQ088fc%2B7UJo0Sr%2FAwhUEAAaDDYzNzQyMzE4MzgwNSIMulfxuFPeX10jUsWfKtwD0rwa%2FuW6ItHHMA%2FiqQCSsWAwvWy%2FeN9eB0odxgA8heNNKL4a4JN2RQqD3jOulevIitKkVqQHtGvfvFDvkk8ouOi%2FqyjqrrL270W%2FdpD%2B%2F1J29TINXXcVuA6%2Ba4%2FMhSii0sd7PkKvH9WitROreCWgwlKVZyQ8FbgoiBqjc%2BzwKUySXN2Vx1%2BDnDaPPRQrzIRVB1ZOMB7fkZ0Vyxju%2FoCOmvwN755tJ6cnVrEPhRkVkjEP4MMocj5d0GMMsZuv%2F7dRLt7D2r9tBNvdHqnEpiyJdjnjkCeIIvkF3%2BReMK%2BuB9lHGQ4Ri7DIgPioxitlxF8hjZrI58eVOP595i8gZnMNkzOy87glMhi5H3c%2F31N7e6c56yC6oyIEY%2FvSlGv0r5x5GoR5Lb8OiEJRKpfmnHzP6x%2BU3x4RJd0Ssi7mHz1LQrFDb9Ce8%2Bv3V4C1HlpOELdaiMR09E%2BKJ%2Bxk8yoSyU5qHFckXgmrlH7%2FV24dMT5j5w0h7zZm5Q4m1t2arHaxU%2FptZun0mbOGXyZdcWXYegdGv9VcQqu%2Fc5rI98aOcjgRcrKVY3KNMczd6%2Fe3fRvb3RW%2FLidBz%2BdclqrcCmgsVU%2BcuAZdp%2FtjcIIO5q1gEqtjF%2FEPrU8BixPUsD5JR2Iw0%2FyU0AY6pgG97fxwzUKRziGIvx1isJcSbMwoPo%2FFzsqvLPa955A9uHb1Hk4y1SjomLOAUhRZWt2C9rbGlu34DEQujU%2Bovm0LtMzub9rWlMp0ini%2B598NOSlpJ8S6kbkqiv81%2FlqQeF1hCbLbfxB7xyirZcryoi1wR1IZYSDrnWFG3c3SooqNUfDglRMntNT1UOvsEsn7EBeU9oJDGDCXfyFCJTHqukmBNBbeXM6l&X-Amz-Signature=865e04f22f8647586c56dd6bc3adc5f7bacae7ced3b1769f682faaf288ff47a8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TGDWVWUN%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICv9jxMZVQDPe5pg7tSXRQqnzSBNxnx6Si%2FNt0DkcPvEAiBIuKPgOkL6d%2FDQqooqbuh%2BvHyapOELUa5ORYc9Z6%2BPQSr%2FAwhUEAAaDDYzNzQyMzE4MzgwNSIMAR0U53OoY3UHBFPSKtwDfA236bJD1%2BouKBE%2BzjCAGqlOh83pyJiYraM3fSumxa4CvufAwEc1n9rxrXNqwZVFCVhMsMqPvlEu6zebgphVvzfACt4OZvbi%2FmykNvkUJcgZVprO1rRyKwnagzhC4AD3aCO1YVFwyPUuGTVUnu5MrKd%2Fz9wiLMaEetNIFIV%2FSC%2FRtIANKluDE2YOD7WMV14dyCNCMOu8newyoheOYzVmE%2Fj1bEPdiNDc%2FjvWJNa1%2FqvyHB5S8kf9FicoqX1Q5Z2mVwUsDQOHxlzVOwLUkmhPrrLjFtqnWxjDXpQ8srZlEDn2tYeRBLgQInauF9K7KKK1Cka4tDhz6aI9uh7UJkF1xVqWf4xeiT1NR8M1BzdV649xclUUHNDF%2BGFGK08BmkJhEkA94g2XiKO95jyizBI8u0k9V1fOPb8irrqdylkfbIXgUu9E2tPaAE0ptHALb5phXOOb1MfpWwJqbRfVdSh%2FaJdhe3pQ4dm1eaHOjJ3EHwinJzjSDtVaZVIluipqwM1TfHmvu6Q5qY7oloaSNM4A4Y04%2FodAT9sKTFwy%2FlX%2B4HmWwVFBDZtlODNpcfOeHavGOC1SO8DYOAjwu97MuhGmQZg74lt1xxFKtWV9%2F61tSnj5tCoLZPAigc2R7jUw3%2FmU0AY6pgF2luw5rRW%2BBrc12ScYY7Cxn2%2FMLIpY8XMRtTPphXhAWGejlXnjsqg6gmuf4jSWA9BweoqV8QXzHAk%2Bid2aAG8GBNvQKpKmxPSZG1j1dFs1kf5TvSvWwwc%2F6iuKkVIUoM5HvjYKnA%2F4SgXes5KSO%2BCNxGU1cIrUFKAAzmKrK%2Bg08QAWgwA%2BxXu4FBsN3Y06JRwwehW%2F7eIs1UhFr7xY6EaRtLJmgU%2Bh&X-Amz-Signature=a3ad20a25a24878b6f16b64acbba9decd5eca49d729fc992a9e6ae8509cada5e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RTQGRURP%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICW4GTqw%2BWevvWiEtc%2BvN4qZVeYkifrgs36%2FFdzad89cAiBuE0BYf8j9KmrYn1ZIzUTaRpA88jpCcBjPRlzbCzl1qir%2FAwhUEAAaDDYzNzQyMzE4MzgwNSIMiDj%2Bu3mBlGVZHlLKKtwDuVDpOjkYJ4KOQeex9mfP0cndfWELkt4m4NrFmSk0KOz%2F8icxn6ZGxV8NU3BXfe3R0xMe1xY4Kke3fUGHPs8yui9b98y1P6z3bcwudgxb5gj6W1GwXqWuIQnu4dDSuOoxnBGwVsuk5acRxU%2BYSYGvqyhdcUVmeIHGwSdONCsuyNcWh8HTtK9y0WTwVj6l0apXeG3UDLQYQPgzwzB%2FVu8U8SBUEWP8EZhMiX%2Bp2n53mOpZ1MHYrzivk8w9gdNHn1N1qrbXaO3DOA2tkXYx9NsCuTR%2F6fKOQVd9liB7vq6Fv%2BgJzDmvIa2H2hIL1nwjeG4SGPm%2B6XGBCpMg4JYk2%2Bih2ei723f%2F6sP39%2FmOV49z0kF9mkWsGgZVWvR6fV4%2FkDoIIiFtKZallJcMDZpHXHF8nifrRB9Wg64DlTrke2UlOUziD3ABvLjnwcmZMrgQx%2BYk2HdZL6As3Wgr8Jtk30LDgslpIdhgQgm97pqSVOuPVJzTrGTxd21tMtNkrVARLMi4J7OWD%2FaXDkE3uRNIw6%2BxFx75niJytXeY%2B5CvnMGvekO3HMY7nn10Bq2QHKQFtRBDPWzQ%2FmIS3CfsAgypOtMkQDcxtQNTZR2pkZPHfL0%2BPjxgPwVO0rfCAB1C4AcwtfeU0AY6pgFNdU39lJcaOdB4ASWHQra5Ftz%2B6SefTsH8T4jtCpcoqVHo05h9OM%2FPZ3xHYwfP63a9CIMgR%2F809A4tMZax924%2BuWGzHTPyUuMT%2FkoAV0nrRhZQSA0%2BJUt1sIOjXhB5srepH1ibcIWVblz0U5dr7zoQVZIb4%2BWgZ7vFpWRzb1Ac6JHfXACIO25AzXwDRDE1vnu8sjVzIVp7c7weEMnGKmeVdSuSdQzQ&X-Amz-Signature=d2641a627b1285e0982db1f082ab9c51d39383787b902d6763e894091ebf93f3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XYCG7TW7%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041235Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEqtzrxG3eY9c95go%2BsYWaLWo77%2FryMfJbAVyCO2OzoCAiEAt31cNWqsZZ8w7ySYjq6bKlIP6VHdPKMKOKfi26clA%2BIq%2FwMIVRAAGgw2Mzc0MjMxODM4MDUiDCjdrdgt5rUAuaJnkircA0LYH89wR1uWFh8K0CcRoZUQt1LkAGW9uqs%2BDWE0HPUqXEdYhODBTod9wIeKb4ysf9jRAnSiNC2JuZIZD2ETI%2B6pg1NA2PwnBxEJKA5VKrXTWb8sXDDFKUj1Gfo3DVWHGzIDCoC3I95XdTYeBqJ429jQzHnvktrzijqdKuohT43ehqaQYBnfIdZ7NmfG9JHoJD1mLtxIOGd6FrCAHY9%2BMtU6TwazdnKOv5278JC8B%2FDp6ipIQZMcrJGYFMmTzpuqBLOKguUEmFSXRm9a%2BouOFcnrWwUqcCWqKS%2FQdi1Hh1902Ry%2BS1rdTWCiTMqM%2B8YUliOaCEl3XjokdFKKn8kcTAw3GD0cZ0BGZd44vcdK6V2YvUvU7dQdjhk3xZMVuBc3ZIZg2KfrEDKglC8lLm3pPQkg8CqZlBiPJPliiYPv5pzAU%2B7RHD2kcwgifnDYl6j6Ky2%2BGRy5RElxepyW5epj1xVFtickHyuKVoHRXkoUQmaKuSTMNYXZWErkAFs7Ngi778Tyzg9hm9VAK8jgZvaQ%2BQqBhL%2ByBtkntusVVHJsG3UIIew17tI%2BimpGVQWalHQimooHJLtBXll8SWheITyAMUoz8t7tWHzW7%2BsyDWh3PVOkiFoJNgQShjO1zSUSMNOMldAGOqUBoNyqaIpjJynX0bziWrKfNhtqi66ogFbW9y6TIZwEMpBK1bHy1uI7msEIFk%2BpqzzSm8tCdhvK2BgomgdLwO4AZwyy8Qd8%2Fbs3GC2aFsKLuh%2FKZUwdgmTo%2FO3tngYdu069Vc6%2FFWtoqBYWmyUEQl0lVIqUbFV4MCWLoeTPCya9NLfmx7pi%2BaabxdOXUdQMEaXbf8UxCshub6CAhsyPN9k93sW3k7Ya&X-Amz-Signature=0b2c08d7b1ad7bef0d81552c88b44f5ae4c94aa3cc3c42b5e6e6a4c27c38e740&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PDIXP3B%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041237Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCKmZUqVGi6LtUnrgQbagZgTfLNjuD1s01S9tNt7za1ggIhAOo32xphx8ap8znjdeV3Wc7rVh8h1w8XGnrzRrkqHNGuKv8DCFIQABoMNjM3NDIzMTgzODA1IgwiQsg2XNsfXwFZZWUq3AMHlwPlteHvsor0A0Ye13dbxq0VeIsVcRhheJ4NPGUq7p4xR2S%2BPR1jMB1sNTBAzrj9O2QRaCtzrRnV6CCXCUkPLdyTgKmJJcLeiC3Z5K9u56B6yVDmHmCkBGboVMPUU90ZncdlBiIiS3nzsH50tCSaLuXDso2M69FQlzTjzIOa%2B3IY62uR276YAF1m4lBAhHRqlGeImgKEmS1xXjLn79NLihlx9YrSg3XzrUqbYgrYA5Mcey%2BbXXlDmnRLYRmOMNNC2aT4GCOc%2B28RycFOEsQrOpgV7v7iT%2BFGX20k4ulXbXdgCWfwYFuYggIyUGTEPFyYjOVKJBf1JA4R8hiWczykmFAgvWwQ7d2HO6MQLUYLfjwKnq%2FBHaGgs4skJ6IYJ07%2BDTwjkzA04T5wFxBfjDFiJ%2FO%2BuEgJ7Ci1%2Frwa6TGp204Kb5kLceExY9VIj8viL5Mxt5amOq5Az7v3bvqelIL9o2b3Qk%2BpU%2Fb31TL2%2Ba19ApUg0MaiHTFqR7b8PH5%2BTEmDv7cYnpIskBUmM5EwAwYeOzFWstx8BQvtLLce%2B71N7yXn8IY3i3%2FSDzLS6Y57VVwY0fv%2FmeWItB52%2FPz8imzX5ObmTVN2xBqpj7SzJLgBr7Q61s%2FJQoGeeELqmzCBv5TQBjqkAXv5IlCSMC7JdRz393cHhKteJUQ%2Fqh3s8pgJCS7xzjZXLqsy0qJxy20ySs7hwBgt8rVf4MMvxeAN6%2FRnn5%2Bk%2Bjisvb3Ju2ovCmkmdMEzPEkkpzoQSxfisSoH2InhOShBKPmGrVDkZv0zyejOEBAJKrXO1VZplQg0umMXhT%2BKtVq75lEQi6NF9y1tC%2FiratZann1%2BbHvL7WvCx%2Bvp7LGDhntTORbg&X-Amz-Signature=d1c29d18c80929dd77c4620a2d30f15ed15aab62fb450005757a24e18882828f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PDIXP3B%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041237Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCKmZUqVGi6LtUnrgQbagZgTfLNjuD1s01S9tNt7za1ggIhAOo32xphx8ap8znjdeV3Wc7rVh8h1w8XGnrzRrkqHNGuKv8DCFIQABoMNjM3NDIzMTgzODA1IgwiQsg2XNsfXwFZZWUq3AMHlwPlteHvsor0A0Ye13dbxq0VeIsVcRhheJ4NPGUq7p4xR2S%2BPR1jMB1sNTBAzrj9O2QRaCtzrRnV6CCXCUkPLdyTgKmJJcLeiC3Z5K9u56B6yVDmHmCkBGboVMPUU90ZncdlBiIiS3nzsH50tCSaLuXDso2M69FQlzTjzIOa%2B3IY62uR276YAF1m4lBAhHRqlGeImgKEmS1xXjLn79NLihlx9YrSg3XzrUqbYgrYA5Mcey%2BbXXlDmnRLYRmOMNNC2aT4GCOc%2B28RycFOEsQrOpgV7v7iT%2BFGX20k4ulXbXdgCWfwYFuYggIyUGTEPFyYjOVKJBf1JA4R8hiWczykmFAgvWwQ7d2HO6MQLUYLfjwKnq%2FBHaGgs4skJ6IYJ07%2BDTwjkzA04T5wFxBfjDFiJ%2FO%2BuEgJ7Ci1%2Frwa6TGp204Kb5kLceExY9VIj8viL5Mxt5amOq5Az7v3bvqelIL9o2b3Qk%2BpU%2Fb31TL2%2Ba19ApUg0MaiHTFqR7b8PH5%2BTEmDv7cYnpIskBUmM5EwAwYeOzFWstx8BQvtLLce%2B71N7yXn8IY3i3%2FSDzLS6Y57VVwY0fv%2FmeWItB52%2FPz8imzX5ObmTVN2xBqpj7SzJLgBr7Q61s%2FJQoGeeELqmzCBv5TQBjqkAXv5IlCSMC7JdRz393cHhKteJUQ%2Fqh3s8pgJCS7xzjZXLqsy0qJxy20ySs7hwBgt8rVf4MMvxeAN6%2FRnn5%2Bk%2Bjisvb3Ju2ovCmkmdMEzPEkkpzoQSxfisSoH2InhOShBKPmGrVDkZv0zyejOEBAJKrXO1VZplQg0umMXhT%2BKtVq75lEQi6NF9y1tC%2FiratZann1%2BbHvL7WvCx%2Bvp7LGDhntTORbg&X-Amz-Signature=441a3fca3a261f064fb128ad39b0f70b1343360242cdf92ea1cec221fa40439f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
