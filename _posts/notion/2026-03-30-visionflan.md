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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667RQL3CRP%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034433Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJIMEYCIQDl4YRzsBM9YDmpX3goPH2vQ8EDUGjGL5OdRjk5TRTUXgIhAJWx4%2B4hWEIbpRH5OsMBvxOVdXYMiBY3FllYlo%2B7Wj1EKogECMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyYqiZatJb1ExTI%2Fksq3APvEt70ZW9lB4O6ZTmUp9Y%2BWAUro2omd13x31b%2BOGL14T3KU%2FAilaYPHofSOZBh4hZiHjTYc5vI2j8aj8clh%2FkJtlmGzxt4WZuZ0j%2BbOaYYzSPkLyW0QW4B9bNeHuQ7%2B%2B8HZ9huuY0tc1aO1BvaZmOM3Sjlbdu1MHWbnF9BOq%2FqCARSqYznul3E%2BwLYkklt1RlFFo4KLJIsvxJ2kVmd4uZPOi9rLLmQ7uhZu2ePZUrXokxsfWzAGmUeG3ovEU2l8l3l%2FGjwNjQ0MbxH%2BApYgN%2FwpzdxEHvTytNiiX2ilZVoRPEU6%2FHMV7FD8GN60uUApTEcjbTHCswB%2FJstLXfRhAMWuoF0LNnzvkgOYtnFl1MVfihKzPqNUeEYipftHWRRGhoVTeRmna8uKAHrlkictIHiKK%2BZPuyXIkH8ta1PCG%2FrvScGCMIdwOk0uzoxZf330rzfuajYw2mcHDbDmk2dfLeF9vpGnPOWXhwW2lc2V%2B0lT1pEXULNaRinCQp9JGDHJO%2BAmUsF%2F0CtqUH3UsjUwKfSI%2FixH6rvxnEGyfZjW1yALcwO13ce%2FUJCOry8tl2NQHUwWjxeg8SYtVSBdjxYfQYfTMpcONY46fYLEDYqDLXnnV2e2JMmZLYGK8CY3TDku4bPBjqkAaBJCCsN3uvK4R%2FS7t43pAXSCnNIqP9lSPhQh2fy7z1xwK3hOVYRDqgNjJsHBvXfkwt%2BiFJ%2BaqaWaSKLCMYcUU38hzJa%2Btv%2BCeTX21gj3xAqUkDIT3qgO8uk0HsTSQ0WOmEhlJ%2BZZqaYvO3uxUAgP84c%2Bgo0OYdEGir7cyVwnT7vAth1uSst9TdBvFdMyI3j54l2GKU8JVbNOWpckCj0Lrq%2FvRNA&X-Amz-Signature=590584ba53d0b33f6df7680573f0ef3ca70817400ad017939f7f21c945115428&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46676ZXLDTQ%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034434Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIQDI6%2BEcNcdiZNn2dcnqF5SUJDjHhT6obYdhCE%2FDKbktBgIgFRLIGWuo1YYa8ioFiAQCQCrnsYkjxl9v0th9srVUQQAqiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJBgJzlGMQ%2B1YgS9ZSrcAwrytv%2FvGxtbYnr%2F3S56STBboLYPD2dC7yJBHGv4jZb40MZEOqDXpPu8hMB7LTlgYscSGDuxhZIuvuvRa2RhIzajShjJo032qgP8JjtbzYTYxPlmtQEfpT%2F9AlamiH0Jit17L%2BxMHjOJiyFI%2BE%2F%2BjYMg5PJ0wj2jqvknuPSU%2B33FVPfOyXrs1YklcIYr32lv2bXWh6AKjg7A7XFsvQJT9r3XgNo4gsAiUTs4vgUzjoIxPCjkytghPSc%2Bny4KSfjr3yFJ3wY4Fkn%2F66%2BLG%2B6DcS7Lqx3j%2BG%2BCUiM93tJQgtr2tVaNpt34vrcMyUo2YndkOhVTLWrLMZtwDpviCMbtH5pidxvD5NskJBZuXf7dsFseqw9PU1l7zq2GoZn49qrLGqaQxWlnpPkrJSfcmnkZollDDGmJ02%2B5uXBg%2BEtWIlLK2WBaclroH%2FC54UhS0IlwmphuXNJFXd8UAElYX25MQ1MtAnWRL41KXCcpq9vC69Ai6hwo9pwUqDz2KEbchHk94Sz4omhVC%2FEbu9eLXNTai6XUZVf4RFxzrZsG9Qd6tZxzuKm7vjWJQ%2FS84BC90tR0YTH0T1Flk2WOCWFsDUqrzQqI60%2FlCSy5hg2nQ2kZn2azR0Yvj56BdB2iyN5%2BMOa6hs8GOqUBIZFbJnn6HU8y8fsroyWVU6aEMPN8%2Bz5BF%2Fm6Obhf36cIjp9V1Xob8QQMGs%2FLxABChN3qYKHxe2uCF9BTVNvAbnfOSejuTw%2Bsgs2gEBtAI0arUeDps4GNlHAkZainXREekwCIy5scc4gLYBeOKBc%2FrNmfQO013P1f9HSpNDFQ5UfOjM2c%2Ftx7yEZQSCVdGlW5K%2B8nVzIaGgUOCk6rsotgXPStoQVC&X-Amz-Signature=0fe4d4a240dbcb9be0a480b389836da3699458bd3b20dea2928ca2f78f85bde9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YDATHPYW%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034418Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJGMEQCIAoaIQgX6nqmjCvcaETI8ufGCL4baXWKxGykYdRq5v6QAiBdZYpra3gsnP6Zk70Iqhz7yMFWC2o4uIoCK9yCqufgliqIBAjM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMBuQR9nkmUJ22L03cKtwD8Gq%2Br%2F%2FLcYMoc8oFeUT1u5ddt%2BoIdOI5MTqaoQRoWlwLYX%2Bhcw%2B1lr3K4TaDQ1VgP%2FfiWaeu52Fbl5ZgK%2FqV5Ddbgzh1N%2BdUnhWBpOK5zRimeOeZO8LyLK%2BrG8khVYc%2BqhiG2TqAf9W7GbULMWbBdLci0ZYA%2FVG30MvcKXkAON5lXbX0b80GxLQ966RkVXu57GOksTa5AqoyO9Z4EfsVRJ%2FDl6CDRGtB8J9%2FvuFdRI5H2kQlfhu0rOz9vkEhFKaRHZ%2BWJXQhWGU5LU2q3uzei9SQiemO7FCV4BtORBRD7%2FE4vUeD0e2S9uiHILKwawglLXyt511HeKVxD6IGPNxZ5iN12yCkjCIRGQHjRYL8XT%2FyResaefG7BboNDfaPqCzUcVb05xbJLwEv99K5eXSsZ%2B4kRtLFo0YAZFvupQKBjk3L8C2Nl%2BBc8qVmvnlAD7G2Yz%2FTfEyw86FImyKUV1omzD5d5I4o5SbbyQL46wAVMg0K8v%2Fn1ftMoG38XoCjhMYe7qIKvyIpbI%2FpNIeFmFrBSQTS4lIFKp0KEKuziJgUxZrubXHHqIMrLXzZCCYSYnWKOD0v7sGNw9esRhG1OpE3oCG8BDAJh%2B7oqobGGmcXBeGF47gOv8iL%2BaojG40wjbyGzwY6pgGRHwhTaYbfTSpgi3ucry5%2FAR6wogP1F%2BRK9ivqvRJgCdsrzJZzcVnceotho0xz7YQxaf7Uacpa7xWS5UQur2FDo0BUtWRmbzZF9mYn5UrdcCBNiZKbEzYLleGjH8KKsWh2Xp%2Fpfl0X6UTTu6KE9mZxF6hOrqKdmukOgOd%2FRp5yX%2B%2FNy08PSk1R6ovCqT7tOuP0VLEMo31sMU0b4snCrtt7Ti4TkFcl&X-Amz-Signature=db2423a0c08926ad266d8bf6f6f4dcfb4c60a9fa9c6051ae968bbf96b6032e1d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666DDNTALL%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034440Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJIMEYCIQD6gLlMu%2Bv7howlkNUfkbUN9odijI2jg07w3UHnN633jgIhAJSJEcrXxwffXnHaJto2Qnpw5ADa12hIQxpcVXDi%2BlPVKogECMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzJdwh1WuyHsgu75pAq3ANnGxQUrvCxOfNRNhtmQUwqgsmmXDm5V3IwavVVjdAI4zdunwMtGr2QknVusIR48QlwSSc5EVm7ofyLlRr4VFrEbdyjWDvTvWGwBnypXeDEvQhwwFSI%2F4C99PNhiseijXhiGyDHujA17SctFZLdIDZWsWhTZRTCa1yjicz4ZTzOVyMRoXdvRwTzYyGmU%2FMEpBX8bWU%2BJs1nAjRQfgdepzLGwp2IUKarZqAYRwMO7yRTnu%2FyVByUri1ZGpKM67L1Y62ch4RJXA9kBGD9Uxcfa6UQ6KV0MLEK7fGrNcXhq7A%2F9h1DwBEybeqJ6eJqabHn1rKQLGUIBVGCrE6lTU2ccDleox95NPaHtO7GBri9oZUBlRRVi60bd5daqYDI1kLZyK7PxPOp2HvqakLGhVsBhUdJwASElKVusCrFmcHwijaYtdLuHW6KaTV5YuaZao5TEIZ3%2Bx06WNgKMK1YF97a%2Bo9QXvO1XBwQVgw4CydY0GMQK%2Ft9Dn6d8uQmqUj02C7%2B%2F%2BBDjnYpzoshWYyXaxXRKeL0UqG1ZUyWqbj8qxz0ISmiG4YIq7IZUcdIMxVCppvbDi6UdE%2FmicShJzJNVMeB7bEO6GdhZaYjUnT415UjPWDDD5pBZhhLvepmipzknTDHu4bPBjqkARtoea0WCJvLNZ6Ug9U%2F%2FfIIxeSQPr%2FpZdSkaIZwoQO3BZKL2nW4OZgrTQdEedy8zksAFGPVS8kfdgpZQ9TIHmdD8wXqjnVLgbQDuqnMMA4LKcO90DKqv24LYCzc60eGLq4iUlViSMfqXryHuYL5hTxqi4aqx6TnrlKNoknfxbxSExNDvR0Q%2ByeQQFs1n8u2lfHs1CnaDjheEkxoaQya%2BJ3zDKZO&X-Amz-Signature=5c9f0973feb5307b740018bf154d3bb1f7bcd17ba42a8cf115751d180e1b69bf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VE2AB2MR%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034441Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIGSpIOLA%2Fkw0ve%2BvNjAu77B1uLkWDwbBOInFnrh8MNwWAiEAyaf%2FtjRrYsRfvyWYlEeeyL80HMz8SLFcX%2BvOwMdMs8AqiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLCu9FwVO4u0CBMzjyrcA5AqiBCct2H6xNddbcNmFCenrv4HC1bqOTH%2FTOVeWnhpv8fbFiIuO2OsOw2R8v8HI%2B5KhZgb4BS3k4oT8zby2vEleBvLc1viXdsyJYsyTfYB3wvdRcM41lTfkLE1Y2IgUrBuwQguPREfk1zT01XXbTP2KMRShQfWb5okG%2FXsKj%2F%2Fn37a5dI3IsGs7SuUKLC7hJihAxVWYLPTKMalphlboJw2J0cDFXohNzAqtlUuW5XvUAsSNqvUYAzKPr8K5g%2BhxtZRFgRl6oAfr8i6%2BTroKeicC2zuL0U7q%2B4UEhbuYPJSmpbAaC8N9NDxL2lPeeIqpGsJJGQ7fE21BLsRg%2BYcXF87v7GyJExme1Bj4XaTrtk7dIweZr%2FbpTPZQ5TD8fwCJ%2BvIY9%2BuCIJuXAkL1nPJvnqb8hOYar2meRaJv9mqfgD%2BHAVFi7pGW3jWdPQNvo1fMkQaz7e6zRtUSe3AiJqaOcw%2FnRjsLTNxE8JsWzBvjf%2BpBLObvai7ev2gvmLxm94wXt1ZCDrOKUdhpjbX80b2zyOvNzR%2BSOATqqtuglfYuKVA7%2BEzV%2BhT7fIRlZ%2BxVGVXqKZCr5gTGeN2sXdeus8fWBfOvcjbQEIly95RBIHLQUbw71Kh%2BR%2FbyXgXeptgMJW6hs8GOqUBZK3BCylpLxtczlnNSZXcfID7ce23IWuoQdL0xHxUWRO1RltWjGRhqOsyypJg9Hn2Pa0UInCyqxvRu1rxC7tc4yIVFoPgsDjBq6PrRL5eChAusMQJIdYX1JFrQX%2BYX3W0ghO%2FQA2GBmGYdmVdGg8XlTaXyWFC6a8dBhjLAYHIQD0T1ty8T0%2B1%2FdWc026oQVyPw3Ec61OGOTpWoM80n3FiFc%2BbGYip&X-Amz-Signature=d8e24d754056d5dbcd4e744fe5a539489c7bf3a875a4648bed175c53f7b7951e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VHPHXI3K%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034442Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIC4nZNl%2BaT5sQcei%2Be192ceGMRgJegTvbExjrxGM8l8mAiEAw52GecL9i4RJ86y5XVAH1kdiP2%2BfEmgdtgfjqMHQMNIqiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ3zEz4SkQHAgeSVOCrcA%2FYqBzKjNel%2FPqtAbaDeuDMZs98pU0gaXiiYKtRIYqUEuPTSTWvfghsYvD4lh4pBKLQ7uWBNu7wpk3MJO8qg2S84ErgyLS6bR%2F2nCcg0D%2B8%2FpbcfwZ%2BNd41PRu2arU7%2FSrbPVSlJi1KXS8e%2FvjinGNfwa1o1wiTRB%2FHRABu2qCU%2Fa8O%2BtU3RJ2kUAmpv8JNTG8ZQ%2BHs8D%2BToENdIX2VDdWfxyathRRvVevXOoZ68yLNGsYskPUpik1DNpC6ZX2Tvl04M7dNWwfOZOMu4GrGUwGRirVpX7MHxWLpC%2B3DCYDF6fMgEdaoty5aWRLuUugCrhJbn9pW4A8WrqqBor3Bch3ON9qI%2B68oh1ARX9IxZqbxxNAgk%2BYi7kyhaQZEiUaGm7s5QQluF%2B3dzku%2BZlkUakcOw%2BcSpV1KZtunkTFh%2FaoXWPz217vEUX5kGQtxNQbegKkxINp0ZK%2BzuEXpk2Su%2F7PXL55avdw4yNROqUFPYe0LcTRjSxbGXVyc8W1sUVXLNtgfWMmXbC3Q7DgNFJcTFzK4bj7QHX%2FZ89vhqAByut4gbXTI7awf9yOGuyhcdGaCpEBLBLLYJoEEfDHo5VkmujWAzvdMTwxJRzMCw4AE6K0ZJn%2BOQvU6CJhP4h3rAMMW6hs8GOqUBpZPAMx9gMSpU3QtkW9ZrHgrH8dvTstGQPvhAhzz3HW70BSaL%2BOR%2BsU%2F59FgGvxfskRaKtttSTJJ%2Bx%2FnG%2Fd1W2vMT4gnlONi7lBqzbTj87Ka3j1vqugHDeqDEH2Z1TXrHuzhkRmCjp%2FgmaSZJAqbBUihUsRxcvQFSZ%2FAE0ihkQ6aXrbhffzynCDqKjTrATtpVPR9LFPPUSdMVrNusHDgaOztnn%2BZz&X-Amz-Signature=3b8947f3b3e888e4ba863588412b1d64ba59b34b296906bfe5f9118d13b6581f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W676ETL5%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034442Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJIMEYCIQC2%2FjLLeN%2BND1wX3oStaWBsjcF%2BWMpBqYKcMyKbdS2O%2BwIhAIXJ4nEXw%2BSXwXeA%2FI0kRBtrAWYp9Dxf2fqe3eaYkHlEKogECMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyRvqBK2ThMpmisVqMq3AMc8C%2Fgm3%2FXhBUBalrzuIJao6jerbanZPWO5I0nSjnXRnXiVRkA6NcHXNZ%2BWMPD2uB9VvxqBjydOBRIhwUd6jHJKxT9VePhdGhdyUKpEixKwjVE8zlUimsZH86c4dhCFQrR3sv0dKUbRP92ffJz6%2F37xVtdBJ4Kqfi6O%2FDnLwksGGZVWT7%2FIcRVS9IT1ZTScdLIsvmwQ8pN3079EvSLrI6Yut5gE%2B2U9wiUt5F5qSnc8FO3ha6txlJYQwct69pKZgQyTlH50fRXXPlgDHV9Pw0C8H0ixLE1CxOnlq%2F6%2B3NZzsWFDnPtqVD7c%2B5XTbSEhO8wFE5zqOjLch7joEE2wKMQomf1e4M7EY%2F%2F%2FFqv2NMLOb6zX0eaRm4160DpVOe9JtlhZZT2tDeP0t186VoDglDUri8OArU0%2Fu%2BIoNBmMY2EYMoCj0IDVAER5tmd5M7dUsYWWcn%2F6TzOhsQ%2BsigpFsXNt%2FX7S3UOroYRr3sgYaRkZFnMPutK0FfZ9jI45a8KocodXOSps0plcB1LCL8aB06bT7Fsk%2B%2Bj7VNijoVmGIF9aLyyrarGsrYAsxYUslknSwi7xFNdevRwSRLJctkD5z8s1gZJX9xiTAyoABd2zusc3hvMCTOpEh6jvD3z6jCVuobPBjqkAYf3CyNYfdtDosmdxoPn%2FbTrAgoDNwDRrl3lXT2XGKXoy6E8C2Ed2ykcWXpCa9qd0x4Kb2KnCfhjSVGCP6ipfl6y8DFmpbph1G24yhZ6jwsZQtU7Rd7wAJ%2F35%2FI2Ou5TISjuk2ZH%2B9736LU2OTBfgcgfwt14u9d5kS4yYhLQv0JUrv%2Fsb%2Bo6aAE%2FHEvCwTWPOsM0J6Dy2xd6xEMnEE7FFWFLv5WM&X-Amz-Signature=e58399f09cffe0def363dbd5ca447dcb94b04b6a4a44a31c046afe5c8639c6af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663BM5TMFQ%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034442Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJGMEQCIHSXK%2Fr7np0YFbfnTe8WTxp3Bcme5Nfp2CbIurM0yexxAiACWQ5zz1WnW3J8EAORVQBCsw9EPQxiR%2BEgHLIvuPHK0iqIBAjM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMv6jgvDMh57eMV9zcKtwDXa5KoKnosjTwP5WWslPLW1UECaWKxzVfdUbn185vK57Sd363t%2Bqyztmjpr9rginXGZaCkKijrbTdlzZzu4obZZdjmbVfHyaytvTrG%2BBhzBC%2F3l%2FfAluxeXXZU1IE6sm%2BxN%2BWSgENLO0EwmsONaGGNAcVeHg5WnYymJGzDcAeTXQl4eqLVEi1W61ww2gMAsfvEdkI3yabjDghoVUkzP6b2A%2FLu%2FjTzdBwOoCOg%2BajVBUX7v3qdz%2BbmqgMIClRofLFz4T64BfACV4zuyCCr%2FHI7bHt9RLN%2Fnm7MD7Yju9tM%2FqVFPqsOjS9tAogwKJxi5Rk2hw%2FwagMCKmCldkk9a0PmtDjDu%2FElXR9gmOdubiTPTVnj94l1sWAEzdiOFc3lRt%2B2jpfBrDg4Hy3iNtOOPwP2Bm4EkkldyQLIwI68kr09O7nq%2BOuM0aJuowX02frcFHfgiBw2lzuX8kPD%2B5aSe%2BdPc%2BP1AmNW13WZtAXoBVQOQgY3RgMH7EjqYb0o9hK4xGeAQ9NqrqC%2FFBPhdSUdD4Euq9br%2FjaaygW0KeuvxKTmWj7xHNMxhqLiBVZQEy2xSfooE1fVTW2A1ZsyzV%2Fi72B%2B5FVax5APq3%2B84u%2B4mvLE2euZCFzSMuyBXBEp%2FwwkruGzwY6pgEC5btZ%2FGRHGlpYSNZB%2BRZUqzgucwyniIPPHnSUtY6oyUjtHV86rVNPTZ8fMoAzP9C84bFPcE8fI3hQOQgtQ2poq2hSn9%2FDOvxZVyTxWDan7V2EeCCXAMWsKHUTSvlWzrFpcBDnLnWIX6CuKoBlpQUod3n1AtulzdKmqkbAl93yIcua0HSwJLtUuniEzPub3p%2FXSC6pf9T1g4DplQZPrfkO7yoU9ord&X-Amz-Signature=0b5805980ca55b2e756516ae654feba126f67111313cd2090a2af4b31a703793&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663UXGSQ2O%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034443Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJIMEYCIQCF59qHUHe0sTndPtmq%2FVfbrKbtqb2C5Zn%2FPksBH0zP7AIhAJBMtB%2F36%2B50%2BVwWuzx6L2FW04nsBzmxfL6RpTQNlNwHKogECMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxAMmF0rccF3qjMWLsq3ANKN4RiIw7Vt4lrkNFubS44ekAth7xurPkGnDUe%2F87Z8Uq%2B8wqCir9SHsSt%2FuXAkCHzLpmhoRkkci9YszI%2FWiq%2FNZqYMVBX%2F63btcgQk4d%2FWeRiW27T6MJDyl88EKCz4Z6x3r34B631uNdES2hLK2%2BiNad3s8IsFJqF4gaH3%2F6vIxVsSNvgejtx4AcNC0bkvhU2jg9ANnLR9xnSG6Sgjc%2BBYkrrqJCUBL0diRfbsn%2Bjxlgb6nP4ZC%2BCBHDQeCZ8ndkjjzxoyWdsizrB7dwSbFwb2C9%2FTyW5CmJ2sjGYSnNRVRX1V9zZuyCj47Z3NtgJ0VWmQMpuZVxCiDq1pCHAI9x3OMY47KtZgzH9HeqNAqHfXAUp%2Bp8FVwKgB47GR85caERo32XJcQERxlvFVWmCd2Z3mlMk6tzbv2jg3gOFe4DSzz9h0K53VY02ff9bOyXymEi58%2BdEVgBJGDW1NwOrT6FHrzUgkImJ9n2uMB8deRTdLpL7PiP5r6p%2BLJQLa7hTPVOHgsSkPAOWBS3dlKnwIfhsVT65BbEVypFL5%2FL5OO95jdZBtZobAhBP4zQMANaFhN3pHIBM%2BctDOYtw%2FRkv%2F0FlysLJ8JZYviO3dvZil3EJC%2Fv5evt2ct3dBU7oRjCHvIbPBjqkAaq0jCXr82NCEK8Y2vpgHUby66SyCvz2Mz%2FOs%2BmgnoFkYzEhO63S99Ijno9wW1Utd%2ByxXcCH%2Fgtw%2FA3esoVcilrz2cBCVQqVgpzCL5gZSyuxhvlJfnewB%2FVTYEm9lOoDnryMOnzT%2Byedb7x1sjBC4yDZtOFJhrp6AHHCVteTBu0jhE0x37am7VwRToKaXkkl7MljuzrtM7fr8KKkfHCxf0XTwIoY&X-Amz-Signature=c5033b6b39577ef9eecafb53338c21cab1cd8fe417968aa3e7e350e6a7644d10&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UJWJBOMC%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJIMEYCIQDD5C0tDd0NO0EJiiIhmBWi2Hrej8t22COgQqvI1%2B2b3wIhANLoMt4Sq7F4JG0R8bSqCSvwWErgTkZ64ROSzOYWTgq9KogECMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzG29GKbML8cjxZ24sq3AOuj4zqBaiPZv%2Fde8o0iX9tDL1gShRPHeFf64wjIX4jhBzb0Hd%2FsGQaasiLDJcmp1tTlG7ALRdEvXTy6ofqaaXcZ3Z5j%2FcdChxC8KWy4jeWJDS4kV2dNy48WYEJQdKfpejivSz69YbatYka7AOmf%2BCGdVL75lQiWAOsFpV0IT1onlj5m4XemCxaeY5rv%2Bl5Sml3nzIcilyEYnrDlO2HY0O1PngHNrQBTBcJ%2Blejv74NwEktBsOWA7hqYac1HxbBO2iP%2F9hn8Ig5XIBuVPNorUVgPZGOEeD1Ed%2FbiSDqN7ATWrN8PGvzHkIpPsRRb51zjXfLmFvitbMdzHBnrfRf9Q%2BF9ZZXywwo1UGo534EWZ7WwllI%2BDPIx6drDn0vv3ylTkgojaJv%2FkRprIme23H06PBEhnxhv58j0k11LMeoRrfUAPTOEb0gr%2BX%2BxnyErKDT9uTQjLDuVXnkASSPQmd4XxQq886fwPjUEv0qZ%2BaVnH1IE9gDxEfF5DXHhjHEubnlp3uOzZQz6%2BcC8tT92MvcYPldL4lSjlyO4crTvVBM1LefgtJjH%2BgoFS68A9ceaNgAPsqgUWTT827URChdT7CJmoGgGgllTdB103QUzoSIWLSNfcYILcBykZxa7lmTLjDFvYbPBjqkAauO7q2qvzRAprigVlVdg9cihbe3Q3R04VQVTE%2BXHvNHyq7OjIdYF3Y%2BQia%2FXtBpxd%2Fnxk7rYJHvez0GmccMDLJFoBbhu7TXlHRHIMDL%2B1t4yWPNph69Wr2xI1NR2vIVobvqAaQFtkLGzmDXbn4RiCdzJ8fSACnESiJAM5UBPC8x1%2BjLH056QQyaLAd5zi4nBTYV25GgjRQk7a%2FwBmyKTx5%2FcqxZ&X-Amz-Signature=326b0973d8053635ff0de1d983c4fa49e8a054628828de923a73fe03e369405e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WCFBO2NL%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034445Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJGMEQCIGup5iqnAO2Q5vXlVe39ujWimb1M2KrCLgQDJUL5iJYPAiARjBFl6k%2Bozjd%2B8n4GevcY7O7%2BXnrBY%2FmYEx83zbh6XCqIBAjM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMiDDhbtvWdnHs6cRaKtwDAJsx8%2FLFfGwsagim8fZ6dmte3LLGIyhQx8gm%2BAMcoHMBQEjqj8ZNS58BWQc%2FHeXzwkY1AkhP%2BIXYqUvlo5SnEIaZvuSs92MKydcwDRdSNTvh0fI4LjD%2FtgW9cEiXX2pNvax1r0MtPU2zJu9DQQp7NbgCS%2BpmjmHUjr0TOxrjdbyB%2BzvHBHSO8bPwl9ZclSwX%2BL8gjEd%2BPF8a%2Fm0vEEypCGvL4oT3uPfg4q6%2F%2Bo%2Bf6Si56mZuFRBH235Zy28r%2BPtCU6fADPlUXaTI%2BXZzdO0SrXQuNxHnE3EicnRzhUqjEvt3CVNA%2Bs%2FTZfLcz6DQBdRhddghRHbxVJt0hbXgGb3%2F9ZM3X8pyxF6ZL9pzTRvAt7kX7TPMDUY6RhETeIIZ%2BR8wrAG9qHUrcLFJLp3%2F7rbxwu%2F8HLW6zTlKSTIZ%2BD%2FdSUOiQAojPsX2WoOWC%2F6HMycvDanCXJzC0XIhaB8VFaxYze6g3rUyaH1%2BlHxeBwJN%2F1TkuhZBHq4PfKlAgX0%2F4RDxwYzmCa5vTAcPFvXaT%2FH3gc%2BfvpfUcrybrkyylc4SLaTgT47kHQQW06lkKZjn2fh3c9LvVV9kni0GtrtreXbiUal47GLlI%2FdC6npV2Rvf0quExjAivToDFgU0fRgwybuGzwY6pgEVpDZW8cX%2BXKEe4dzP3bLkX1yMmatG61SBIyg4%2Bt%2FnwdpYY6OZwNDYRuZrRGI49ZCr8XRTfwArgTxCGUm4Jnizt5ytjBA5zc9nPKTIaY3oamagmrlXIztsUHL0fatnC9NlZwcC%2Bcr7iNT709MT2yB%2B%2Fy4GFcv5KNVB9DrvkZDkwtWqFYTZuUZSk%2Fv07u4vuAU6LRCScp0GfIhwAqW%2Br%2BnLodm%2FFy7v&X-Amz-Signature=2f8239967d19c3957fae547164a6d507953a4be0db35aec3ff5f7516dc08caba&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46662FEFYOU%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034447Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJGMEQCIGBoF95vJj%2Bm5NVbhT5Xrn2zlP%2FeP7vuYU9yK%2B5n4sfiAiA3COS1jLQL%2F2evEV9cz%2F7ITvP4qUWiTreo6abM2AbG%2BCqIBAjM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMTMfwNQ4Z9t%2FH80bTKtwDiFnwSY6wUHFLuPGkbS49Okt2e%2BgfPvLYOyrUNGWGpC1WO%2BMS6ZY3U%2FyGh1VyDArszk9Yyhvco%2BL9qa%2BCb0XLwW5UffjZ5xaSSrYSatO%2FsUOPfdylGOWc9gw7mLbNgrpy67qd7RHydhnQtGkli6hsnvJPwboJPKNM85sF%2Fh5F2vCcP%2Fh7i%2FxjlimuQj5PgZACdmHecPoXB%2FQDMu9%2B9cLyLbJQ0VXWsdh5JlU6VD%2BhsftDLOpGsR3pp7yPykhvgY2Zw3DH%2BMGhD5M%2BR4H1jGPu3eNuGps6dTuxAQDWgyfRBnuhI9OrpA3uzdKOp8fPWZFtHQ3j9sdTu1Cdzj6eq94%2FrhTAktmOWwlUxNRGb9WxjZMgboP0NVR0VuoHvU6GdBNmqOwRCCVHDNHmZY82FTBXvUIq8Q6ZJHDJzEWJyeG1tnV0abIOg0S2IAGC7e7pwZIOIhfqdG9AU9Lo4sVGfWnaM%2FNgZK%2FEQGQO63boa%2BCYFLSCrTDVilbNkDUYYWOJORnYznQO8XqKTQWsM%2BzmGS2jFBAipTOJpwPV5%2BgoTJJk%2FReuDglUDUCuaALN%2BRmrIxBtIRtSjSi5j4ovDfNfvSHAWIigxiOoaTIKAOnN5XT1BVSWzLptJi2BXYuFuUcw2ruGzwY6pgGWTBIfUIh8WirFL8x1VlBTa1hrvDnDnQgLEGRtK3EH%2F6Jn22rIGJgaEdnXfNw4xkgZML43IsIZL3ItWM60sh8mTvA%2Bz4v4D0rWTJExa5EpZ6vLooXhP2Nb2r%2B8ORq%2B%2FVQK9DIuh1eNVt17OSrBrKUYM%2BNgXWzhFIanJB3qCWVEQ0TREhMGlAmXqMQ8f9oMumZxKPIcIXitRxRtLM5re1J0OqD0D79u&X-Amz-Signature=213927a2ce993e35ed9c503c8ea84891264c88ff4e56a21f1d563bc2d8ae3661&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662SAWDVJU%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034447Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIDyPejYwMkxI8WLq%2F9RYiaIlVhrXNO4ROZ%2B9dvMwpawpAiEAm7lSv2h%2FTc2PQdo4S6OrZPwMoLFioR40UYebhi36Qe4qiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEWVYjrCm31L6qathSrcAy73G0WWGD7uLskbNOTq1ItQF81pu82Cyql1TJWuYf8oh7I7PwClxLkefmNfaXwpUz4qfxAD3lUAasZbImzgw7rVKDdeEkBSzBW4aaEtA0yci2hWj2pZwfAqSLOzf4WDkFsgr0P7U38pPaFliCEB0o1USBK20e7SncVEeQ5b93gRq6J5ZyXiG3hfkquGZTLyxENGlN9uHZgKT4VbInc2pIw%2BhLt8y%2B0UtkBO5n2B5ajFIFC7DC%2BebZfjWD14JP%2FTIKH3iyhly5C2Cz8vmt1IvADXKaSiVYhdKOOSzcUIpXbEFBuzf8Bx4Jsx6A%2F%2FQu%2FvFvtUtF7V4NStW1vP9biS4CMqWfcU7jwinq8xTVUhz55pbGx4Quj2kEHBZTUUbAO%2FwNm69F%2BCfO35DpbBjjKkLFbw8mq9GVpCjkNhM54tmM8uOwLO0jgiQfgzvJUItWTSW6oCvB37wjb4s05Pp5u53qQWOCxRLRdVoHyneYsGREj5%2BjvXmZT2MxF1Rv9S50jie8gsMgDQy32WxGWVtCGqW5Vwu517x%2BgtCkwEy7BPhaHIRNmhOQhr5AZHwkzD3kXfLwzx0YyczS4Yu%2BhrOJPKydgElJTnH7vYp%2FMCq0n1lICDeB83f8Hyzj0IGKBLMKy9hs8GOqUBfcxwj9qukuydZ2ryRIPwEv9AeK0aGpKPQSzPrRGB9H1ySpgot%2BZBvYuGaCfhzaTrRyqgfAGfLKzJVyWv8h9FW4PJIcTVqY9Y0yeJqx5l9Rx4BN0B1Di11vdC1KgYwqmdh7DqyGiyfg%2F5RdtIKW0Y%2B5wWZ8CZ8DLFwjocWO7vvChUkK9H%2BiTsScJS7QMq7OL%2Bxz1%2BCPNyBVOwYC0oAEBkUnPGUu3F&X-Amz-Signature=fc96c7528857f60e143e97d38ba15a9807969d849ad6a239f9b97e9a62b67c06&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662SAWDVJU%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034447Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIDyPejYwMkxI8WLq%2F9RYiaIlVhrXNO4ROZ%2B9dvMwpawpAiEAm7lSv2h%2FTc2PQdo4S6OrZPwMoLFioR40UYebhi36Qe4qiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEWVYjrCm31L6qathSrcAy73G0WWGD7uLskbNOTq1ItQF81pu82Cyql1TJWuYf8oh7I7PwClxLkefmNfaXwpUz4qfxAD3lUAasZbImzgw7rVKDdeEkBSzBW4aaEtA0yci2hWj2pZwfAqSLOzf4WDkFsgr0P7U38pPaFliCEB0o1USBK20e7SncVEeQ5b93gRq6J5ZyXiG3hfkquGZTLyxENGlN9uHZgKT4VbInc2pIw%2BhLt8y%2B0UtkBO5n2B5ajFIFC7DC%2BebZfjWD14JP%2FTIKH3iyhly5C2Cz8vmt1IvADXKaSiVYhdKOOSzcUIpXbEFBuzf8Bx4Jsx6A%2F%2FQu%2FvFvtUtF7V4NStW1vP9biS4CMqWfcU7jwinq8xTVUhz55pbGx4Quj2kEHBZTUUbAO%2FwNm69F%2BCfO35DpbBjjKkLFbw8mq9GVpCjkNhM54tmM8uOwLO0jgiQfgzvJUItWTSW6oCvB37wjb4s05Pp5u53qQWOCxRLRdVoHyneYsGREj5%2BjvXmZT2MxF1Rv9S50jie8gsMgDQy32WxGWVtCGqW5Vwu517x%2BgtCkwEy7BPhaHIRNmhOQhr5AZHwkzD3kXfLwzx0YyczS4Yu%2BhrOJPKydgElJTnH7vYp%2FMCq0n1lICDeB83f8Hyzj0IGKBLMKy9hs8GOqUBfcxwj9qukuydZ2ryRIPwEv9AeK0aGpKPQSzPrRGB9H1ySpgot%2BZBvYuGaCfhzaTrRyqgfAGfLKzJVyWv8h9FW4PJIcTVqY9Y0yeJqx5l9Rx4BN0B1Di11vdC1KgYwqmdh7DqyGiyfg%2F5RdtIKW0Y%2B5wWZ8CZ8DLFwjocWO7vvChUkK9H%2BiTsScJS7QMq7OL%2Bxz1%2BCPNyBVOwYC0oAEBkUnPGUu3F&X-Amz-Signature=afb53fe48f47364fd442f54ea1105be28ca12bb9706a2c36e7854b9695725d6b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
