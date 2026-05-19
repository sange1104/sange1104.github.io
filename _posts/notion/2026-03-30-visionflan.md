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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YXSTL67N%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJGMEQCIHhnRUginvpsi3Vctw%2BpBuPm8adaRr8D1wD3GExTN%2Ft4AiB4lpGcFHxEOl3am0PKWhST16%2Br8hvDOfgasNyDf8b9QCqIBAjN%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMhUFjbJX2p5Y1v2InKtwDoWV6%2FFugHAsWq1eLnWKx3tob1Xhk9maXe1v7PiONmzgsMJEnZ4c8rxl1wffsLDmqSwzISP974Jrm%2BO60lMVn9Jsy%2FBhclqy5gzwR%2FH2m8GKb%2FG0Sho%2B1fiQ0bc%2B5WzmG66fTd0ED664R2vTa9hhnN%2FS4kOlRW9iOZ3j3u2eWOWGSJLWQcOVU6aELCZlwneyhnKjWSKh7x1%2BMj%2FCBblNSJuCbq9JBDIhvm16PSIQWrj9UxHzDEm9X%2FFxq8PUtStvFeR1Sh%2FidVrpIjuyK%2FphbnM5wvApBPROEVu72TlHRGZ9FpZQDQXjchzsnLI8xaAk1h7lrTZtOYuW37UhUl1QRXGXnxktL0MDBg9XrVno7Gj6z2n9%2FuMdzqU6rF9AXeZ2i1X2ngzTkwWNAiO%2Bjj35FpyYkPafaL5kCgctXdPw%2FybaGZ9%2F2831HXAdPWxPJLBVexzDIfwQRtjOVBz1g%2B6uEEF6uiRB4NndzJi69UqhU1KOhBDaz1Ezh%2FYXgx9BOW%2FfnstkTBxKVH3%2FhBkxB07l3MZ5LyQD2%2BMVXDE3Z4bWRWUQtOiINLnfUH8Mc8m4kT8cf1PSU51DYW6yuFjEgVwh812hfnU49Nq%2FL1wEREo7e9dpVu73LgMRFesEtewUw37iv0AY6pgHkSSl8g5oCbn8CbrCxwZgZLFhs%2F959ior64%2B0JaVW%2Bmudmo%2BcevWChHfGYuhBsr%2BTkLg9lTDceYNw5UssZXPECQutGxEaPjFgVZ44bnqutcJ6%2FStQdgUFLDBCSuhpY2cJRhWRTo3jXGmzfUv8IjIi0cWzJ1vmxJodlMXLe4HF0nErGt0NpPJjweGC78AoFiyPePjNsvaWqD3M7qRdK%2FrUf%2BR4zxudH&X-Amz-Signature=3dd0cef49a72b6d2e81959e0fdffe74307ee43b61a368a6081133665b998f3aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664PXXFVWZ%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIF7pIUvNQkr913lERyrO1HKJJ7ib2RzuU5idC%2FDjx2QRAiEA4vz7xOGsXUHnRSvGBWrfRqYFJloiuRc7NoEPCzw6zEsqiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEqXOFMnWxp8sDg7KSrcA93MUW8ILM8vq5IksKjk3I8jdS8MI%2FYEjyldli4KUOIBwvpiH5Pkw5GBcD6JmvIfvaoeftmFbDs0sL2IIScFGIVFSQt3sDjBMOycvIqOSWFragfhjf6v1lqxYXciP%2FnqLFVd0c6iAzUF%2FXdRgQBQpfUqJTVstPq913CbxTbqJt86C5kSWKoEQ2MWfLcz1BkS7vQj82%2BO7g1WRYvNjpdS1ppy9pxKqZ2Ey8AuECrUP%2BPGQE%2F4WIZL5QylN7z4trtmMRGo8zB8uX%2Bf7MELifCRRLXMqhnUerMUAfKdHV0EzL%2BvQJMfSgBmx6mXihO%2BG%2ByjmzAxKfE%2BLLOVW8ykJ%2BET7Sdpgf3MHtwoTzJQAj9Z7s7n8hmB2NJzc5BmDZmdK3khNUrfYTxnNYdQxmb%2FMjrj53QgpVE3hosQxEu0ZjaB%2BpidQlYR55bFHvOOv0V9oUAzbd2a4X7RQ3mHul1MwgFhfZM50WBtfKuD%2FKe4CF%2BmS1bXxGzgaB0ic21CONH3Ln8ZLwMWh3CeP035tO6TgmIiA2K%2BO47Xln1dXUapcoMfWFSQ4N0NeKBWzQmugoFCF5BzdxGAIgVbDd5F9fjLiYMjeE22qbk9dHivKBvhQSMvEyQ3OJXACUZuMTnpAkiyMMW5r9AGOqUB5R0Fuo9Ak%2BoJat435jwzQOFiyA1n0tXauOkOtR7jc%2F50fUM57vzEOLxB%2BdZn%2Bv2OWxJIZjLiiljYD7dHqMpA8ZR6KZ6VeKRgpS9EZE%2B7bmALjrI0WViYjnol86w2X9GQjnwHoLQaxe%2BEQimiFuTQx44cVm7roFA9iqNZwAzT5%2B4fwMT8CFyrcqloAJhbm0mYx89Soz1AgMg6D2Rxadrl%2FsYV%2FeQf&X-Amz-Signature=1e87e189c16897dfd473aa3a0333987d0f0fadd6b339d901a210c34cdc1c1f3e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQ5DLDCU%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043311Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDFrPa%2FBvRECXG0xt1kC76hWMQUdCy7mu1sd7RAwNpIxwIhAINuNt6PBXNuYTjk2%2FcQwue8LlK5Z%2BHF%2B5hb7DKfsZhHKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzMMbjwYmK4wcke%2FoUq3ANKoxt2RuDr%2BrlS3jaOCjreGbx8wA1mg5ysKcpO%2BXtR0M%2BkMvqM0PMytVMox2ScRWLNeMcZlSUb2N7inFXLA571M0RdgfI24C0Y%2BRdNhGRgwhIqTwPd3YBbfDt7e%2Fx%2BvEnWqZaXwiMr0GCNM11FuZo6OZYtNLmxR0NojjMe3AFGUgX2bzqNLGI%2FJWJpKbh3joxYPW%2Fdwku8DFGVUnwjsbTBgMdg1wBZUht%2B3cJRw7m1dyBzcDK%2BIcw0ro8Y324wPKH8gpZMADTMis761KfXP2nbUQZqjvZyt9dfP3GRr1or7Xe9mhX7ONTNhpcVWDMsaugiBW4l5BQm3ijtnwd1V4uDXBLtxAzX%2BfDPM6mVeawNO701kmkU5OO6urQa6AkEWuVuOWaNHfx4crP%2B0rV64UWisWn98bWKiZZjJs00WsWQ96OTJVTE3CYa9HHPlno%2BAA4zBxPFGUxw%2F073MxnJVtAYyvuTEoa6Tbf54Q8wX4iDSDFNdtKMIujkOsnXe1JRyq6V6Sl107aXhLGCi%2B6eNuGhcKep5qgvvZMu7gOmpfqvkFg3K4SEe9qCG%2FIjI5qeYHziMW5lrzknn7SYzutQpF3Y8kL4pPTHNoyvy3lyfvHjZYozxbdveGiRVIVJujCZuK%2FQBjqkAcezUlgrQ%2FE%2Fq30rFfHho5uspPGq0WeGYsHKcNMw2ZEtVfz8uvDjlayvuEEeJ5wPdFCDtxiIMaIvffqQDYdPiHoMDK6wfV5JPLesDR8OUw%2Biw6OJ6mhNSCZqWcxiC6sQmnFiwz%2F36LTZ9dVhL3DiRrLt458Pfaft4nyA5T9H%2FVIgJ40njkcd%2Ff5DdsL6zHOwbabQ5JqFzW3xG5OKWgoNxlE74W3H&X-Amz-Signature=f2f578e23ecd016967140fca866e1c29d390572dc2410921c14153f5fe97762c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46642LXYEIJ%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDBfRpv%2BDJCgnkX0dZ0o5HYFl18lgo%2BInh3VVO8uhNFWQIhALILHjJjiC%2FN0JNg99wtwg5qprmMMf4hmUUvdNmu7M%2FkKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igw038tbhpRRFuqecMQq3AO6DlAzZ%2F38aT%2FNDp1HpIDHzVXZoBiI5wToQi7Ybr3qEdiPyGXl%2BwLaYJIgBQG8ZmMcuj6JCwgDJbfeZ%2FlEpwbYp11ZR304RgWbYN353XMZbgB%2B44GXjpZZUJRt0mXCGnT9DJW9leCHtylKl9ltmiEg3X3K759N%2F1IDIjARso5kw4rSs0p095ro0FCuYUEg38cot5K53oDX9XgarTXTMcULHVVIDk7CrpT32SQ3CXZ8mOTIQL7uDDHTwimMcRRc8ehthIR1hgrXVxNMpoll%2FXzG%2BjJF6bKjoKpnlOqD39ag8wEas3SHb%2BeANKTJm%2Fc4bXoDPX7XsJqviH%2BRN7HOnmAjxQGzGayWGlgfDMBwpZ34mLytHuCcAfZeQgA1EStq6RPkU%2FPs5Xa5lTcoCK2OlFNumxKGeQXM%2B0IQei9rGsAKJJcKacievZZTh%2Fobuw72DZFRgkebL%2FUgZpQlzTLQ%2BZig5jcqkjv6v9V6cGloca7H%2FomPAupDKPfX5z4u6v%2B4sW3pNeulmgZoxGs%2BxvSWq5raCnEX2j6tdaiOGR1RoisuX51aHpYkMB21E2KELd3GiFZu3MTH5qjQAfOn6UX63g24WEM85phQuBHrMrUEWA7hW8IdJ7vB8up51G6TQzDqt6%2FQBjqkAZ8P3nhOnOh8KAMk2PCWYqwOuXNvrJzXLNgV3T52MZw3sEbbKzk8%2FCJAMiZJ2QK4jhz%2FwmcQPWHTXoix%2BMv7keik68kKkkrGa1%2FFqCGMyzHIfhyG7srRaOd7YS4de5lrTUiGHHHe2fWxrPZ%2BScH5UXcj%2FMzyk8rhJGaNVgqYayuKYEQGrkkI4vLBUSisBXL8EsAZbx9rJ156AR7Fmh0A1Y4%2FdV4k&X-Amz-Signature=5f27403f306f22590c6da9fb32188e89cba5456239a13474dc436447612e2760&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663RQXRXSK%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043326Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDnPXZG4GkQwF4HpufulU80UR5JKv07kud6LeASHYg7ZAIhAJ0TKMWZuqo8RODvkYpu8rXdvPJW09Qd4d%2FaqkoY9MndKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyNY8qOTCDGXRhjZNIq3AOC1LUM2U4lyQP0d%2FM%2BrONbvm%2BOo5qapihxzH8RrAjboB9aiwrDCb9gu1ls30%2B4ob2QjcFfM0PF9UN6HoHHgz9omDTzUHDNX0jaDmZLM4KrhkYRNhlztSuoAJz5faQ9X0Usa31AJomEt%2FfGjPVSE9MHO%2Bg7gyj5VuEC2Ko2%2FgWlnxVnLyHHBw3nM4c%2B6CyCrQgSCgpi68xwSaStkRnSbHEt9brFRIhK5Njjt1K%2BKi7GJHFsUCn3pIEncfHrG58ZguUOzECEFNRfCDknMeEhRFcj3FRytkVFigyq1GpdqiJBd008tcLnWZmTCC9MrP2hZxJQc%2BPV3eWa%2B%2FkxRvp8KtZpSQORioVbxqKKfKDC2VWhofG4W%2FjlIyb4MMykqAJUUJOyr%2BtEt69bpPixSuFz6ia6DRdlyN420OYXPFGB8Uo4YiVL7u53cM1Zs1IddS9rUDW6l2mQb5dFzptxi%2FrWlztC0Pj1uhd24BF0EoXo8ROCSX0dHWlpLGCkcu4wMFqDFoFFQOUXRRqmikmbLIC0EGDTQGEUQCYP14H3fKYY8qQN0mFHXkyIuO%2FAqtNpXHDleLtPeqX2FAPI0BcABsI5wYeGy4lSr0y%2BAFpOJ5LwJ2gTwf80NAiYnXqoEa6XcDCwua%2FQBjqkAUz0qphqxfGjFfADe4QIvo7WEYO2qaVNHVav6D2UwhB%2Fcgeo%2F1ffCtPvXhAg%2BkzqGFxvNe7bH7B3VLXhh9AXejLbsHs4JNMaNfPSQEfI%2FieNPO84RPjgFcnKHEkBAsjKyAdD7mA5KOZ%2ByQ%2BzdAMw%2BbqtudzTpbqduvzfhr6eNUg6diboj3%2Bxf2xMP6%2FXvJBXeU0iCz53VdP%2Fjp4SfVcbZmoZQ4OI&X-Amz-Signature=ef4df4a4f407dff4cf511a6ef5c821177cd0778649e37ef7aa8e214cab9bb1eb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ULDLFUIU%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043326Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIQDwTBVBh4qHuXYq1JRpa%2BQjX1O1okuKbPiD6Y9%2FVVXS6wIgTLVHfjb1qs6%2BKDq%2BG00oU1Z5RnD43zdjI2XzlaBkvx8qiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEEa7B5jPh%2BeRL7OtyrcA4RclkjHp05HmOOl2voE6R%2FZ24DpzHRbYzbnITo7oU%2F1C%2Bnh2n7yWpxobMOLkOd%2BR4wiP%2FsQ8t5z6V45Q%2BKEWBzopPpBxOEAycC%2FxHnq3d%2FAZhbOoNSMAPTiWv8IBghWuU5adDHwXQI6n%2Bw3RLYAt5%2F7ebc63%2F7o7qFQE17xlWltp0mmWv%2BGhd40e%2BduTEiGY4x9yxEt5zLb2KrB%2FD%2BUosBeFKEqYgPngg9lOJerog%2BuLVFJf5ebkwWVkC2asZhAae5pFsZsN4%2BZiRu8EOgBbCqOCzfDIdK03D%2Bjqt%2FLE11H%2BJoKm3k4Pob4WyUcitJOVOdWS0Uc5%2BHpwoDQZPpCk2CjRrTJbgIq8u7mw%2BeqoSAWiIOaLbHHjqJNhyoFPcOqmOFVer3OwIZiBDexal50p1LhhZKapxmg8GEGXAql766YsyJpMovRCO3OXbiZj3iSaIWPogpppHT2cKuPrQz7nu5fdcqUCbwsJ1%2BDgX13MJrUif%2FSasr5iN3l0g4gR%2B9Lk46Amq%2BQYZaLAbQRLeF79cPoABJAQEoh49Os5VlbvXs4bX%2FaXW0sK86CfZbM1GxfkLasHO6OFkbevZAnsqu0FytrtZ%2Bd%2BZYNNAoUlB%2BiweAHgnlY2eyzEVWJoMXXMKu3r9AGOqUBR5ozAQqKsQYUwRwWQkGfnlFi2K%2B48Mcc8ibdy%2FedsvpjGxvYmXvrmGn9MGwqaFdeMLTIaur5jfMmg%2FgQpC99a4T2hunztVz94FCQfirl0emJrp2fh3qFN6vbv6JneqEhNMFdxu6yRgu7UmnehhyhR8eU5fdbGqLGoensjr6LYLECUVe7MqSIHpvxB%2BUscO4JjlP6e5hTIemqyuiLTbGak8lKZI9s&X-Amz-Signature=5976e87dd3d8a636e205a84ca5026428701640c768ebe81141d6362429cff972&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZRPTFXOK%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043326Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQCaPXa6%2F5JGLal2IvtFnWelVGnnTK85xPiVVnUW4xiU6AIhAPnW9lC5gAGnzum49I57tPnMRDjizB0OfX3k458Qr4ypKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyBiA%2Bmy5IgvKnt%2Fgkq3APIqG15e0sN1M2XqFVbFRVwRgCzpA5sJaZrmJCDcmO5ocIWVnz6wIF1OTkLM7UYvN0AVu7lUXd1PIYQj3afvtQHyw0iiv4EX5dJf8tvA1OIfTMvVla7FLGYPRoqlzPj4Yo8HObjTWbXyblaAq1EfA2O%2F7bIw6KtgIGxuCrXtoGoxWEcRqNEdGNEzZrCaDX6yjJbHmHKUrBH7Ll1yXzFb7Cew181fL5DUKSV2ddC0JSXgVNHhqmYtCaPep3OeZgrm0mOgcwdLC2otf%2FknOzdetUFo1Sh0iA2AtJuUJq3ZNbRhaFd9LxDby0MSyO1CB3vkO4rA%2B4dIqg07NVjPerZcWFZTI9F2mFkGGlmwT0Q2Q9J8E39sKLY5inTcnOBPkhFsiA8QXCp9xecmz3pWq8tNvrcVmWmOAPTiBlvfxqTNaSpcVSarViBjw0nC0kEE0hbHDVasMFbjmtPwIzTW2K%2B%2BSkyC9AH4pSDUl%2BXDHmMbx5jvQNFvoMsYmderCqULJCChAMx9ohhFM5kdTfoaL8Dlj%2BJZ%2FwcxWNFWi2OEKXsehm%2FX1Gmtqw%2F82kGjhAsHxm3Rm0FAC0FHnS536r%2BKZ%2BrJc4wqK2IFTiAAxsERfhhkNihJmK7og19YOJYHmMjLjCBt6%2FQBjqkAUUauYMZl%2BqlFias7xUJuTU9AuNYRL%2B0p6qlWPrr1MCxT2MzYrkB5BNqr2jMGOvwOgXeau3d77hXk8q3s5MyG8Jo4NNyztaijHXr4wcBmYQDv5GY4ymsQfy1rggw3z8HVq2IUSYcQCNALbC8gTJt1RlsxcOzPBXSq9bHs94gnRF8sjYYsKCmEAtL7qruUBSqIy89ts1tPxpIAl2W1lxNtMR%2BLUK8&X-Amz-Signature=294d35b4911af2ce05ef279ed07a6677693bb9b7e4c5d62703b0b1027678ee2c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T2CDWHGP%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIGa47IAwQHTIO5MzvNJAWA1hTf0HdKq9JcVmBCgoDcauAiEA4%2B5ziuQ1nx0WIC6AvGGj3d8IEqqkMmRkTwEwtEvyZZAqiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGXyjDOKHGupOtXH6ircAyxVnGsXkMJaWMmEB6hQXZ2ls52RJqxbY5iKpQ5EMuFMwK%2BZTkepcqdGWIroC%2BiTPtdR3ztQ3A9hRLXeO4VWD%2Fv8nnGpsLON8%2Ff1fgrQVzrBCMzUh4QR7sIjPctyIcmS%2FLZwDS%2Fm1Jp0HpvAe9o%2FFiWujxEY%2FzE%2F0cFMwYXQiyp28xWxLXnXQyjHCOHHyjpDIUtQuAuNQJHv%2FPPLPoK7K%2FmhWtBOh4aK1yI%2BneizL1oNXfb0nJqSEFjKTZGC4f4adpP7fZJYnobT%2BhmBYBBy%2FsW9709rH1GtLKltchjtsX%2F6X6IZQ9%2FJ80uJLtKzd67q5T%2F7umATO%2BIEA%2F7zrIQr24GdwZKKJBU9l8333XmPT%2B8h0TTci9FN%2FczQKLkoYb9zNHrMWrL7B%2BnXEjj2o6JgyvBzB3lCmh%2F%2FlLskd0rQhzZJ9w3jR68XnYyQy2gZA9X%2BpBGdTuqH0tA10djAjpN3oJ83RPm7bErR5h3%2Bwy5qEgiJRV%2Bi0QNxz0GUbW4%2F5ndd1QWPk%2FTtocYQwypKvfM4WtgzSyMEjdAL5YDqnypjAf5slufDScWdOYUagh4PelL%2B3dteQUA6GNHMxabtCfIPZ2DQS70n32Fawnev1onH22inV2Dym6wT6G7E%2FjOmMOS3r9AGOqUBEG9hfpWBtb8TTeOLzOybB2791pS8CBqT4B3CATIwABbkDfnWNo0Qyp8QvxmCrbj5aLmJsJ7ZfFL8RVAGyZByi8LtTnmEHN735daBxJTRAypYa2B66X7sCWeTajCzHWldqWVnbjFfLCwCc2kDMEmmorMlHR5Q%2BKpwc00ryu7WG2WuMojq2rmmmKTW6gvJt4hyttMRHVb%2B8roYubARbKo971tSetil&X-Amz-Signature=730e6115adf338f5cf7117e2f597e74fca92ec21653f95090d02e7cde8aff4e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XTJSCUBA%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQClQktR82C2fQQPCE%2Bxn37Qalroh7KcKvUWjhIjjCKpTgIhAL9lOMGaG%2B7J%2F%2FeME8HLPYnU5oWhKMKSloELiqCZRJsTKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzCJao58tu0vSDJ%2FFMq3AM5ryOKri5TG%2B47aCHJW5PXja6JoCGzmyvmarY1nmb3JPvZuVOnMXak%2B1tdRy3K5Br6Qstpivtb%2FxRkMnd7%2B3VUHgS0coq4dYjL12YUL1bCwetgkdtefia5WyVqbzgYxg8EKJkWLqj9IVcJkxD%2FMlY88tVqRMcia0N%2FLfyORm0%2FN%2Fom9Qrd%2Btk%2BVfwXvHjLttKK6UgTeYk8Tr%2FYM3UAzrU3VORCxIRWTpXEd7ADjohVJeyPNY3BQcMBxm4seRtiQDZbZ9wH4w6RgOQkVl3bt%2FWBRHZ6iRki9c7%2FDQVbLfwnpwC8aO8ouq8M0A6WebrIArapeD9ewbU0KF%2BrvYrUtrnF2eBx5yA2JLB%2F7vT40ByoziePN%2Fr22e5h9hx78WGmndpQpdHOH3%2Bk%2BdrBMRPSaZJGYugritwAw7jKVzTZ8QOL5mopLbg72DA%2FZmLANdyMOQVn06whwyKSd7WMlpaTFHwAQTFFyH8iFGqNcKmF6PxQS9W297U3lPyJIh8JNKbxHpFKX0PBUWfGVb%2Fk8znmjKZMlLVp%2FEwprMsveDgo%2Bdtz3%2BLcW0b9GXk1QIof8Rxlk5E93gUB%2Bout54Ii1IJ9JVfc5M5c%2Bi5EofEVCU1X6G8guqdfR4QPSDTe8w0vwjDuxq%2FQBjqkAcEy1wbabQuDGv7MbGHfocSMHXEJahDtiOF1u4pNknQ%2B%2Bx3%2FBSpiK5Zxvp%2BDa6ENmiHcAvIZIwD7PARkDY0XCaXvxeEJQ1uxRSxgCXiyK%2BaBVAfWz4%2FH7qaFrNmpIY7tAjJtCOZYsMkPrdVkfLrcr9gmhQmRk0A%2BTtNlixjEP7qZWWeXU1OPhWdcIMBl8YHTSUojlLVSt8akDsBCVmqOBoU2bL6W&X-Amz-Signature=4dea0bd7b5747e43734fe4719fbcc1b433946bd56ba012a16f93e5791f20c236&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664HHHCCEQ%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJGMEQCIDmIpKZiWrmbK%2B5PSBSDB1BNtDMQAFF6bnjXwabK%2F%2F8dAiB10sxCkSkdMs3wKmNckXHQJYKsARlXfL3oeBrNNF6mYiqIBAjN%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMKlQ0kTODU8fM1Z6CKtwDpgRzUIUd4N8QuCuZahfby5Ux3WMffmstJ%2B8U6KPdQ4xIH8KIMpP3xDInDsCrgGeXrNdXV0uGyqjhRyQPRGi6BRsos0iYzXgdUGMLXKgHdoScXVq9lQ3DjlM561ThXq1FfDLgGEJtsjOzzq4ylI7%2Fcnqx12PWKcnFzCiASD6rrkYDGBPAg1Q0hq1JCdTjk6MoINWdeRaSBXTt8irD8ZzYdRASOzoaCb%2FhqtPCec4GPmI6uUcfK3pAfU3TYRBxY9hSeR2xggntC3LCDLmDau5wt7luOruCK2aZsH5xVboe51M5ARqjQmnYn03tFqLNj4BKJjtBWbELpMVEeeMVIJLWiIU6isvWE39vw4%2BOFVbKdUMh4k44t19mQafhpBek00C3X9yhZYQ4wuaZ1akKINiv9D0q0skvZoF8BbdTGqr8Owk9LJNJaXXgPqRZGaKGod3BbK8LXkeBaBhccqrOXhuCb03euZOYbl0AfFsYTrgjFlBOXUrzNOPIB2aK9EURigCyicbzwNbLpVtO7s0jELngqrEruX8CQ%2FRTgaCZJgKC%2BDEr%2F22WjQaXirKh04f%2Bh3Zf3GDX3nfRRgAyAqWz0KjGDoxefFkfR%2F%2BHj1C0ysHgRrOyZhJB846f6FuyP80w2rev0AY6pgEDny%2Bn4iT7vHSX%2BjLb3%2BKRA8Sqk9lRLs6Eao1V6xd7DpawXJrKBipGYSPxLosC2JxLvY5gnfRYcj%2F%2Fn%2FgbbU%2BHwsC8kUgT0NoTlrLVer4DUXMAaKEJtQx84lHjFCf%2FBxQONZqlVjq0f%2F1extSsISxa4SQSSpzpqjI8fMZnHjgXGdixU130AiCFtl4FUCfBHp%2BZGh0sxKmmQmsw8iRhtC6LbEtrcjff&X-Amz-Signature=7ace59a6b9017d629689a77e6363a8baea77c65e95b4159789f0b67303affc3a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665RKN7KQU%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJGMEQCIBvpFC6HxAgNzSRQdVVmOrwO0vpM5iXn9yIe%2BeD7LpF6AiAwndfXscHmp%2BpE6835xXTzsgpWMtJ5Y5rGFK%2B%2BfZaBfSqIBAjN%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMfryUP4%2FO%2BJa1rGb8KtwDGu9DHLbb1lTuUVTagfbNaurU3NuGKzX6phrmddBez3p31eBXjsqQfXezk5ImVhmdLk4XUQjli9cpMqfPk67SjTutTLxs7KrZYqIt5vc4fu%2FDh5ZX0cae%2FbY56yQVYfMjM3oZvl4vENSX9YsFmWw2sOaHaV0wT5PKVcQRErSj7qSFcqn5iTepLjUc14AbAVkjqogUvtX%2FPgoKLdUtDeoy2xA3NZ%2BeIE4iNZzK%2BDOE0%2BWJQ4wirK7FkUdw%2BjJKhESbLGyZxU9i%2BDBPtN20aQ%2FEDMHJP%2FHa2eWmCxONcU7QJKv8TzvKSuf4cq7klQbStkRr3heUWphKHh0oS4FIxfhjQCiNDHIigqxeK9U3uD265wi7FL4W5afd10sxQbSwtTZnQ70lmw5UeSUD6c%2B%2Bxr1zAX1gN7C01EmM3pMsJcbrEXRP3LMrHbqQqxN86hEGbkI%2FpkCa6GMWXfA%2BSBDMaTWBWQKayeFLmNfydXM2DLtCNZuiwSp%2BAvd7VJ1%2FMZUCTDIAxVkRA%2BPQDrQhpRivxsA0vo9Me2QPde8zDuwsC6q16OxbiytqWxJfB3sIDHHJGpJ5DGW4jaeVc%2FFf0xlIj%2FPj%2Bq1PXSUDnLGKwYCiCiedUdjFnNngD7SK3eH7s1wwxbmv0AY6pgGOELohLyLidqDqIlJ3%2F5mJHiJC%2FL5eouD7BDRw%2FYoBxjrCa4cw0aDtQElHa4rSwAUjJCtrBptiGNdm9LkpLb0OAo%2Fkk3jDMT6jtbA9tQSBS79fl%2Fk6UudYBQAx1bZoIM7EPACjaAXYS4ocvhE5zCQbWMZomSbfRU484yIABN8AYy5tOiGS9F3ysfu%2BkpU5BVf8RJMEZA7SXLsYGy6Qlfo5rnJiiHLf&X-Amz-Signature=4e7781833efe1882c4dd508ec834622daf20e6023df5c704e47e9c75afe4d9e7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466245V3SYR%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDQzTX0EZs3FSNZBghUEbofSIJk7%2FpQFmBhJYppB1mtdAIhAIEUQ%2BagaiIWBuoOfNXdR9FHy%2BEf3darvaGqqBHJBeltKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwyGA0F7LPWKmb9Z8Uq3AOtExZkJFSbb2yQt9FHWBNjVUrFG7YVtNE%2B0YfQKAqQ2ADciGKem6gosG3FRPHhAKz50pWcXTzfSFmFp5pp0vjuJd7ujMI5sw10jrIPoLCRAXvzpko%2BuxiNNvugb3sYeRwAbUKB6goTfRyK0BLTEg1Ijw38YDn%2FdCxJEHM%2BoBHlnlOO4i4%2FLtKPljuoH6VV%2B8hBWHXaCpreEb2Ey%2FI1j%2B0WoaRd7K5R2QWs7r23pXQgbp5WIObS9XX3gzM%2FcqUmuhNSaD6tBd0S0eEFylIqKXRSwb2xki9scSI3RnTFfFUxEX10jHOS0jSPdtWNu97kSv6FFRmcKIxEdFGhqHzvvNAOIYSArrXBoh%2F9GxpCX1eqCTvbifeD2SerZG5rEQJQ5FUytx5rDTtdER7pUxTGW7PL6HYMKF9IPnKv%2B%2FKic2%2FQb4NABqets589xisIRNv4dtZ%2FKYZU3DjtaxL%2FepQbGYTkk005vtD6rmZR5yRQHXG13abzHEqw9phPnf8igFZvSmFkGG6nhMfSLOFwxzM6F0nJiIRYy7X9XONAibcYzniGhy01VL68Q1pjtdogX3QyeBLtcodE6s0fGrKAZsauLfi1o5WZn2sC4UapFFQyvqmO55RGW41k5asi2oDokzCRt6%2FQBjqkAbNkeGK5g3sQYMk%2Bu3%2FSJZyM1EW%2FZcoSymdff8uN0f3sgQ3H60MDcy40RZFxaSlfKTBVigTiW2qZ7T4mG3G2G9KWECpQ7VO4JPhVA3RIetEvvETKv9cf1m54tCLTR6PPkvshqgCzIw%2FHrQ47yerTa8qouIVGBASVbcLMtKzTTGvh6lSXuYCjsg2g4smuPmnBCDcFnJMtfNS0lZIpRqp3Ye8kQhuH&X-Amz-Signature=fea9a0b891cd126dfd3dc76b37c540101dc4d675fb94c258376b711670444cb8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663QP3FRJT%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043329Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDbnoex3T4mLTikmnlMwyMHMKsXS5UvXiOr%2BHGOWUi6rwIhAK1DMKVWpBHb7HnuJvVXT33PBU0Hbx5hs9nLJXTUBasRKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzqZoTyVgdUsHGm2qAq3ANFzOCuFd2krwwemmsHH%2Fzf2SoxgRuJ%2BtBRYLOIqUb4kmzNny9aUa3vNTC2zpavQVq6yInMqxA0%2FdAgut0Ok5%2FliRWn426ruxxK89lAtUpBRT%2FPSfFCMJD4nGDB3aJictHn%2BAfYlBmxGtogJa6Axp67tYJ1T79FxI%2FYVUXHNjjhujjW%2BIj41zb9QYn1QpYIS41vFRR2Cg0DfibTcZcJgLecf%2Fzifj9LGsDA0MoeEBVgZdfSA5MnbOuonwt%2FGfdFaWbHgvhpYDm%2FPh7P0Wp9wU8tABGuvGP%2BuWhNKtxYPU1g6fvYH2mezcLykc3lyf2S7SQJ5FABBX7%2FSBKwvZJd2li9VO%2BntInB55aXIe199upL4Adj531VyDlY%2B03iQ8uPU%2B%2F5RkN2DwYm0LC8kIHpgUyDRz12CCThEi0dNvQ2xoJ2ZNe1jI1nsNRSJb5fSfbT7wArUCYc%2FmtxYn1E3IDNKNlgMBcVaMMSlJ8%2BnNeTTTPrGh%2FEzFkxLwewrP7KJUY0jmsogVkcTswV2EOYSb6psr7llWQa6ng7xtU4qruMNc%2BtUwYwN4HvFcojgAM2CI5v7td1G7s4XvVY1tCu%2F4sQMxZ%2BYZyUYZdWVnsIZiJ60G0o3aF1Pv%2F4357aB9oneTDbuK%2FQBjqkAbdf5ZYJZkmSH21btkXdiq4lWMX9JlQOXnGDEb7OgqveJxe2Kw9OXCsYr4rKdYpeBoZ%2FlNlsAGydg6%2BsSJ97CdLeh4oj1c0Cu5C2HGu7WaFKWno%2B%2BLjbN65oE6lfHyzEJXDl%2FPEh%2FDXwl83UQxD0S%2Fpse5ZIui6rhs0E1%2FiJYRLDqLnAktg0j3hOW7WoyWNnuxZEkVwwyleksw8FuLVNKzT1m2IK&X-Amz-Signature=bc4c6fb39bf55876ea240d27bed7e7fa06526a2b1c58e6742faf257a1c71b4a7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663QP3FRJT%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043329Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDbnoex3T4mLTikmnlMwyMHMKsXS5UvXiOr%2BHGOWUi6rwIhAK1DMKVWpBHb7HnuJvVXT33PBU0Hbx5hs9nLJXTUBasRKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzqZoTyVgdUsHGm2qAq3ANFzOCuFd2krwwemmsHH%2Fzf2SoxgRuJ%2BtBRYLOIqUb4kmzNny9aUa3vNTC2zpavQVq6yInMqxA0%2FdAgut0Ok5%2FliRWn426ruxxK89lAtUpBRT%2FPSfFCMJD4nGDB3aJictHn%2BAfYlBmxGtogJa6Axp67tYJ1T79FxI%2FYVUXHNjjhujjW%2BIj41zb9QYn1QpYIS41vFRR2Cg0DfibTcZcJgLecf%2Fzifj9LGsDA0MoeEBVgZdfSA5MnbOuonwt%2FGfdFaWbHgvhpYDm%2FPh7P0Wp9wU8tABGuvGP%2BuWhNKtxYPU1g6fvYH2mezcLykc3lyf2S7SQJ5FABBX7%2FSBKwvZJd2li9VO%2BntInB55aXIe199upL4Adj531VyDlY%2B03iQ8uPU%2B%2F5RkN2DwYm0LC8kIHpgUyDRz12CCThEi0dNvQ2xoJ2ZNe1jI1nsNRSJb5fSfbT7wArUCYc%2FmtxYn1E3IDNKNlgMBcVaMMSlJ8%2BnNeTTTPrGh%2FEzFkxLwewrP7KJUY0jmsogVkcTswV2EOYSb6psr7llWQa6ng7xtU4qruMNc%2BtUwYwN4HvFcojgAM2CI5v7td1G7s4XvVY1tCu%2F4sQMxZ%2BYZyUYZdWVnsIZiJ60G0o3aF1Pv%2F4357aB9oneTDbuK%2FQBjqkAbdf5ZYJZkmSH21btkXdiq4lWMX9JlQOXnGDEb7OgqveJxe2Kw9OXCsYr4rKdYpeBoZ%2FlNlsAGydg6%2BsSJ97CdLeh4oj1c0Cu5C2HGu7WaFKWno%2B%2BLjbN65oE6lfHyzEJXDl%2FPEh%2FDXwl83UQxD0S%2Fpse5ZIui6rhs0E1%2FiJYRLDqLnAktg0j3hOW7WoyWNnuxZEkVwwyleksw8FuLVNKzT1m2IK&X-Amz-Signature=a2ca4962e650aa91be64891a2a2e0c4d648674e199c15ab8c90e0f641efdcb5f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
