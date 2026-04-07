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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WW4FYRV5%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T032921Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIDKDW65SSF%2BoPlQztmssI6GLe7YFlOWHLYzWd9B7VHIMAiB3uFA9QZleEm%2BU5WW7M8K77cxE56UoMvH2VYUfF%2BM8eiqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM54fIL85B%2B4P%2BesUNKtwDKk22DXQffANm87p3QA8X%2Fsqwj1LhpBtkugPUPO6XYCBBMaYf1PTkuAyJt6dY%2BtkrrAQOj%2BMy8joHHkhpp4JRoiz7Zj5vLBR%2BrG%2BL8T0tTk%2FVWWqW3UDXMM3eq51YhwxtpxYx1%2B0J0gNx3%2Bewh9DtqCyRMSPKekmUGWMHujeRUKAin4ccpMCBMfwRY86B7aAoviOvuHn6eWdKjMy6DDWRZXO7xERY1qk2BmX5hDPD4R43%2BkWLxIGV7d28EnC%2BoLpw5kyZC3DVJkV8VpvwIfCN3aKvLTRq%2FUxL73OEvbnEEeupLtwUzmQI8OVNJUdK1dbAE%2Bp0fThOCj1ilErnmyddYcP2aql2D9GaxOdQM%2FKBZR2agTKgmkwyRGZ%2FxSY%2FpZ7V2CbvjiTPUXduiOexYSUE%2F81dF%2Bf71BNqOmr0A7kUFgubmpWlCwpF4suPeE9rtMpij9tg4mHlV74WXPjRiL2memgJh5Jiab%2Bb%2BOqVOWTf8ASLswlEgaDmhS8eGpCu6jYg0HwMHLPvZVhm9jv4S1Xa29dOqDppd2dGTbjHTZiR4hDwuF2YHgo4cCpCKY120yXPtxXj9lNoeTM3iBA6NNUEQT4YRinhn8mzDsZt2PbY0AfWjIWvexswcpThInkwy8jRzgY6pgGfm8OxZsvoA2ImTm3YWAFSx7G7uL9LB5ZZv%2FlMNS3km7FtL1MxPnCkSEiIrTyCGYPsSl335INnuC2s0NurG9IPC8PLRGf%2BD9WKa%2BQpIVrpblczM%2BtzlH7kx4GvXKCF7Vq8vqUQBwvXzn6lYbCUF8IZw5cnRzxzSd%2B4vORhpmNhbsZvJGF95gijkRWglzMhP%2BNl4%2Bq%2B1PiMK8XEwrDGZkg6FkKD3MOK&X-Amz-Signature=dc0d8a02dfc1aa3d3eb91cb45d8aa7eda1f39e0248991d6df7b52ff1157d2ad8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YHU7JSHV%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T032925Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIGC7M916jk%2BFh894G%2FSy7SgHwcwGf9n5uEHHU2f0L4KQAiEA7ixV0YR9rAXVgQ3wjthzLShydO7oM1Puh%2B6lnTk78csqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM8T9sS%2B1H45lXQRnircA6uEVeUU701taq6j0l%2Bp9upAJUQkcMYcZe58ltwsgB58h5gjLP7jumy%2BSyl%2B8l6N%2FBZGMVAeBkZfrknvrVirTdB5Um1VXW9vpuk8%2BFoS7Wu9rGP6vMetDWAtPJpqHkau%2FUYqcpW9i0HA70e%2Bmn397d27xUlrLJbNRwcj39lYmdum3aJDVV55odeCQYiB42HahuQ29UraaoNZGgB%2Bs3RiOu93t5zmMy9nP1INqs0KcTWZw3eqd%2BJ7jb3ro98LWTpv1gVl7fzbNJxxN3OrP5CdiClvTs69yMzh4aIahFxhYETjnHjwQuxkrDvvH3MgtRF3F%2FLS%2F9Jw%2BgOpDY8459E6PW4pgpMRV6cwwoVioTlLSjMa9J661TSuqu2dpMXdH9YWNUugRHeiiGHRGVBU5qOm%2Bz1voYcwHc0neCpv6ryt%2FfXRqe%2FPjKRbknhB7o1a8zvw0eWLbm9aVOLCGPEJ6jIAMKNB%2FHPdFabGKY7dR8OOPs7rrVU%2BULHZ05cI4BXYM6nHpZ%2BzzZh13rDYt4Rp8C0Aif2vSpLQoeh%2B5tbwxklBUiR93OFIPHCN4AY26s0OcmAnzF3StqZhMFtpkdaFKtsrkV4DgKH1rz602Sxhc3v2M3uSdjj4B%2BHJMZVdRTK0MKLJ0c4GOqUBNBr1%2BDsjBko1b140T3b5785YHY5Z6uwzrPd6XQcF3K8hjb3pihMEUsM9IBtgt%2Fk9wtx4gb%2BBHJVe35cy6d8JjkwZ1fA2kD5CGrTxKdMMLJZIhkwhgZcR7vrd7cMjyOXM0KgBLc1vJPvQ2TNYfwafow76SWu5qhV%2BAVD2POTNxlECVwpjS82JacKiOiGWl7ltG0ajyZe%2FSof07rVRjo5V4EMBr7oW&X-Amz-Signature=d109d06980792d36dd052b207fb1f2eb9e71fadb59f2059ba2c7929abf135d1c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466USTDXFMN%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T032903Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJIMEYCIQDRiGAJtLXVabl9XwD%2BHNqheHlfpuZY7oFSPzIMzGxLHwIhAKHDYnze4eL0tXmLrI%2FpsW%2FiN2vAUkGV0aunQAgqxxbOKogECNv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxyJjCOdIEDZzJegWEq3APten%2BrMMyDZtYGzZ3jE8UXHJuWjyEH2jQf1XdIzbL648pLtdj%2FyVW8o3SdPT72S9zEiTtsmgASHJbovKLeau4YY2AVLZEaCkUXs76q4Q4dtNKbeZ4%2B3zUpBpdeNw60d0jmXCSMvw%2FqyJx9ASwfGCfNHTTTjmY%2Bq5EVTZIoqkiIRH1tsBVwmxf4%2FgQNmNGLosU5f1JnYf2jRCeHVZ5jq%2Fb6b6lwIQ%2F4riRiTbq5K9429WhJRaXuBaWqJOvfu4J2r5uAqYWFB%2BifXhaTrOBXVFgf0vZoSaE6%2BD6i10IL9bgtoqqjFUEXWBMG1Xyy4Ynx50z6F%2Flza%2BBa%2BEu6s%2BElRsX1SXf%2Fwdd0ly9NvNZLVf0%2BcLl8qRiM%2BT36NUWBnWEFVlw7dcPeICRNcV5g5%2BIqSVZWHLSxD4pdGIdn79bGJCp4GFZ3AJyHnt7dTXLLBAEg9F6dq1Rn%2BNodRs%2BOrz%2FRFUmyiTVnaXWle2kPw8FeMPM6bBFNVM%2F5Rmn6Jque8uzy1DzPn5g3mtOFoh3OnpSSOkj1OHYCquN3OGmH%2BBLdP0KNeIwtmwXKa%2Fce2ehc0ud6RVaulQ1uxKLU4jFYrs0okL6rY5F4igPUS4hLc8NAC1X5JfPrzLbLf9kwjWTO4TCLydHOBjqkATS8gO%2FcbzsntWb6rPiw2cfIEyAOu9n4pTaLoH9DQQCup5furyDiCRmIzRTLnp12xkWSnP8CB%2BZ5Yawvyyf7fh638KPvsP%2BHHyjLjWbwiZp0GK1VEwhknFsBezsah85hKSm43LhwMc5KFFGOQmk42W5y1Q2Us%2Fm5XNLnigxogZ007Hav4N6piMGToJlt7Kai%2FYa%2FJrKijjXIukWe9Og2mvYWinEJ&X-Amz-Signature=cb447d7e338f16ecbc886cf485211c940d234696e0c63a7281b255a6164c47ad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TW7OWQMM%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T032939Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIQDn0C88jAK6mEYTM2eR5pwKFlOIiV6OBpLtohpwQksP9gIgQLihZvM%2Bd%2FNSCtjHRgZ%2BKMOG8zNBSXftbcgz4uv9%2BQkqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLMo7S8AmzHf7XxZZSrcAxt4NJq2m%2FvzakVXk0zM1IETnTSKmvTyfogZWILa%2FCoovCUmheJigvEiDk4T%2BhIr%2Fz65o1wHjP28K%2FNCDEOz8IBUD2iAl0oMaR4fm4TReSBHK0qDVZbEdcrgq%2B9rJPfruvCxaeoHiUiToNTpzUNw1LDNjvL%2BW%2BL7CnMuPmoloBUpMXOHNIkBZtIzOMGk18C9TU1WsWiHPPdqFVXRaXDJTw2FObxSuTaWZZbU5g1tEtDTP629ViL50ANU3ZsPLSJZ1YJHMQ%2FfkrUBwJn95CiGJksfZCD9iN9UOzTls2BP5Enfvk%2BBFe4nSRVdB6lzv82aBanTRW%2BN%2FdHbqwsqmq4rsKHeoFC%2F8ULiwZvKmgZp3gnEf7JmscAlM%2FJ6WlBjhC7k8nciwvY8IHy20459v8t26rCzYzjCdIXSFkf1BD1J7G3h6vVXPVl6LDGVC8qbJhorwk730YOeIBGINnPZ5%2FodERHnwfvVzWtZvN9UkRSWfOn5t8JARnSr80IOGYvVOHIms6Gf%2FrBQVgMaWAUMi5O%2BdZCL3y59DUFMMOj5Em0Yh6lKZ6Qk0i1n8DwDamsX1C4ca9wOUraasmL3BsuhrNv2T0AI2vqPy5KNpHHSHsLy%2FPIMxCOAX6GFfjbEp7hXMLHG0c4GOqUBydIGOC5wrLgxN86URHDgex8pjPaKdCN75vLoiHY72%2BIe%2By%2F358nOu0IjNBSnblVkepCw7zdPalAGJ8uOjLt6iTvvqBiy43%2BpbwFlrXYfhoO5xJMjyCPD%2FlOij6OpZs5iKK2o6W%2BBCX3qiahT7lzf7Q2FsIDporn%2FJY6rYuzmNYSuwKHEy6MpI%2BH8huQjADu%2BEBK2xfYhcaSKsNvVHehl%2BT1bsU8J&X-Amz-Signature=01b3066defa0926e2031f6a36c223f84911be06cc62db2863386451fd6a79cfb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QQAVTRNZ%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T032944Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIAyH8Yxdmu1uYV14gOn73SEj3mAZI%2FZmtC5S6DESAa%2B%2BAiEAuaQc1LD7d9lWJtlvwvp2Q4UG1RVBhMY1GnNYiBdGL7QqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFFfryi6YKUO94YPdCrcA2HwrrU6XM%2F8dmM%2F6FaezdR5%2FCk1KurBq72Y478DXqTwKIkSFRJQE9v8ksA%2Ft4DJR5Ev%2FTJbSMpaBw7HO48A%2FU5RLB5bxbyeU%2FfLAmLBSq5iiwy3vaMZmiAi7rymzzkVg3MDUpb5u3zg3F7K5%2B03cL7aExgOGB6zfhsJs%2Fi7leuOHU4FoYxafZ%2B2eywwAKGK2nZ4c9CrAYmZ29AxzGU7faCMR8g2WdL59r6ytq4MbAb9OUU69qi0OJlRdcfYm8hd8LUWIv%2F6IIa5zGCwOquPgiwMyQq1%2BKF%2FPWpOxe0cW8lHCKo5ALFEeWPLOl8F1rAwl%2BUthhs6tjtPTHBUycR5GgDVdsXPHXiJMYgX8EXmxk0YuRw6q8DInneUsH%2FOHXAJw4uzlzRfbxN%2Bbi5xkrNgv%2FCEWRJWK1H%2BdmSGZYijfeyJNxvCHIvw6zuZCWJj7BOyGG8%2FNIHOqFeQcEK7L5lhTRibTItABB1e1bisPx6FQbbHY5SSK%2BID7EMVpwnvK1ghK72ny3D45u5PJssfjTFbLAbODLyvd1BEVSrVy0xoWSXxt57UyVOsvIxzz9Zsis8JZn2Nsi5POIB3UoLwatPrMcpSeZh7ahvukIcKpkySqg7bPMk7PSdmqzipqEDcMK%2FH0c4GOqUBED05ek98si%2FummjivneSfycgSbnP6NvDfipxwAgQUlDaWNlU9cA5tSVYrbbeb6lEUrpq00SY59E5QbjhPA%2FbuAYgp5uckjBtRdGg0Y3WZ6IETDy5pD1vspwBd6reC9UrWrc5f8cTpva9SH93dre7hROvVOHs5cWyssyaaz6cB6RxC2C5uCeSUZ1Yb5bEewWF6axZnn3ZWiPXXP%2BnJ%2Fq1JbojvVce&X-Amz-Signature=2113e22d69f361cae7388292cbd4e4c6060550b4e551760c5895677f642ccf77&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XEMNJXFH%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T032945Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIQCYK7ZsBVF6DYz4181ku7Jjnru33gjc4uqSo1WF32UIrAIgc%2FSKLJSh8b7Wx6KQ9sQ7K0z081cKP%2FqrKcpxaNip1dYqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAgsZG%2BCsusIu42lBCrcA2NglhTjOGE7bDwodlqH%2BL%2F6b5C%2BQsZHlBGFGNId13OPJkyXKr7pKeNNfJ3oreOBKHw6cHyJCgVIXuqgiVsZMFJLXtY5z0KeBDh8s7A12YJy5TXhRy72lAHc3fj5yQN65EaAKnBBa5X%2Fuoc%2Fe290foALhVpxQE65YB8qYtB0BNTexKWGYSWLMq4P2WwFNaUEUSwQikNFyu8zOUYujsTct1a8NwZ565N9jwq3g7%2FfNhdDefmH4CuIvznBlZcC9TG9PYJGaOjc7YuehQp2suRDqLrmmkFOk7tRxHd%2FplNPelZrdr7ksvGiM3Y%2FtcoYYH65JhFjjAgHMQVPGuUo1c53Jt1RwH4cRG0Yy3Rlpfc2b83ez6oxVgKWpQXdHeE4dl9FANLdvDUawUWqadPtKfrvJ0TF8uDaRcxkUSAPAZ1R1bAywOBcye0ivCruZ%2Bhy2z3%2BH1hyJl%2Bq8WSo3Jxyy2ECxuIQ8aalr76g%2FqM%2Fcu4ujZgNNAllqM55t3uRG%2BMpq9QXzWaCJdXDZ5wTnRFr2E9F9MJoWNl5WKc03M21iiOnbBJfZKxRc9v2fnQNpuE7G0%2F0NdpgKRhA4ScFUk44%2BFe5npQ66hEF4CzNGDCmq1jj101yOpxcuwa5SpNREsXzMPDI0c4GOqUB4Wxc3oQ8crXESV76fp7D%2FqFUMdiwLX1uUBFSvlfVYTDnU79FyRhKw94DkaYCZBRbwUJtMz3JMABmBrKxp6PyW6ozuv76OKDgZ7DzoRdFphSNCJJGXr6hllYo95VN7vBUsNeBogX6FExLMHTUeufmZUjvXtwf13PNhGCsf7xe62rx28%2F%2BBnTdj85y56%2BFh3YZD0HGx6bcspPtpHkniWLMktpcfj5E&X-Amz-Signature=6c720d0adfb499e116cb3af380cc2358a71540e47a4193efbdf4a57fb0b5975b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46664UWSRVV%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T032945Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIFjpbc%2FilaezYPxsIL%2FexhVKHN44IygNh%2FTCAyJ9BPWxAiAWhAIfur4utuOSYaQcTwiDqNRmKmGKBJ4UdgWcbyCLnSqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMwYcJ0L5VZpTIjUYmKtwDhhmTrpWF8tjxubz0lLTHW6Z7mITKVSK2H%2Ff%2FQ%2FHNsVM2Y%2BFM0OoS%2BpDzzn%2FiSPP%2Fnt17u90naR%2FpjmCPOYLDhlbdS9AZxTq6CmpJqtaeE5yBlPfLyd%2BXngZZMXRXa1dPVVexHu3dkvXhHXGAY3o1w2yY4nA1vogK2CR8qoyA%2BedayRB5pD2Uk5pyHUZnI2El7pFHGZu%2BPgifjh%2FhSlbL1Qfl3jOUITgHEIok3Be4DJWSSP7L0tlSOYr7w081MwO7bCrqD2bUNZL6nRx5Ipk%2FeLxhTfmJ4lzyZwqA77Xwi%2F1vwFX22W96QTZ1SOMxeG2%2FWltvVxtFu4fQ6kUKAnSRsxB0caDUjHmWQW7LOlSDYgpFI9w1fwpetLsT0DksLH7JlnUJt%2BvKAEBtEBkGmb8hILmjPmd5cO1SOKOmRS%2Bs%2Fdd57eI1MkMPA5qIQeJc10fBNB%2FgVuZMQxdshPM6ynEb6vgJhdlFGodoETypfXIeDHZDTv8kQzFlswKK9bnOaRtSQEt121txDLbsorB9E54rABDjdCzx7JU0WMBRgaO7kD%2FJlEGMoyge45GbkWmhVXhwWqecZpfQFJc%2FkIpwfLEvwo3zWqpxw3PWH8KlBNA60uxB2KuUwiXaOF71EjAw8sjRzgY6pgF928onlDLh6QtXs2VZXm%2B2gA6OncTWXQLSMZxDlimoCiswShOZ2AVXMrQSbcEo7FdXJZcUE47oJiuAURvfEqHzQVfOLNU5s2wIDjvFde%2BySvMybLgWk7Hr4QGavMgzhuZOdRt%2B7%2B41TT7SYyV0RUvBjJMoQH9rF3Kk6eXmMH5grqmsTyKfroKLBw6Gks2lU%2BlOT04FhWesVvJqCHneboHFuGaXtzV7&X-Amz-Signature=0ae564c50a9f4463c2e104bf0934e5b5a1f004c4f71a2faf324b6296f6f84499&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XS4JUPNU%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T032945Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJIMEYCIQDeVkSMVat0RtE%2BHpPCPje%2Fy4H5rNsPjYS9I0j4zVEwcwIhAIrHWnQkRxGVlbr2P5VhT5acIyBxU2PyYPhROJk8AhnyKogECNv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxua%2F7DJO3RIYPI%2BKgq3AMx6Z48vjssGY0%2FZCXGHlvz5NxAmNnWwnxqk5%2BBXLsE5u4vyVHPZrKpCKvgnp0Z6bPtFERGzdOp4U3H4gYG0eLYvmJAVAeRwYgdcS%2F6IpG5ZruxNR38JStVd%2Bi2KoN6Ge3iXzSq5ZDsH%2Ffe64y1vfXiGIG5GmhTbuhQW2EBCd4RKz0CxedO7N6XJq%2B2Ty5NV8tx0BaIYKselUl8q32mb51yfnkwW3fnwiz1F6yku6gpTIA4aU5DI9nAjxRYWxZH%2F6l6%2FqeKhH%2Fv8S%2BgazfhPFkdO%2BXozCvXsuyc5snwoaugeCHJ%2FRasKIzkfCtVfQQ8783zip3bQAfUkvfGW52dnLcj7laUejH6R28WvjUdwhrgq%2FxJgiLM4djlnTWE%2FuUp%2FKkrY0SsVt%2BwwePIvG8MWVw8Gn9PMs%2FfEscjt%2F5IdVWIvd3V0IAUeB8%2BwS74F2W0UsIXD892XRXUQjfuhD8jyyNOcgDbf%2FCV1K1cp%2FHKRi%2FZDWTJGLJQxDT1FdNZavAmVEmrAL2ycWtNbLgLaDsNWMKvEq3XsiBoRaXw8MYih7AkHkBlqmb1sUwKQGzRCS0Eh2%2B9JV%2FdEZ%2BN7i27js2X4OwyLxKGAOTEzCpJ1UiO5EyAJuHilFBD%2BpkLrY5arjCEyNHOBjqkAfJbTvdza4JT%2B8QbmcfjWlQewJdvzKoES2E27EbiLY4cQeF0DeMm2yfmdyPbuXsoyS8Qe3KjCaw6W%2BYS9w%2BH3nlbjZZN0E42POegjm6OhcaES1qh3ny9CbZQZtCh9p%2FcPa2hPiQLolwCJos3erM%2F50W8saButBhKfUw%2FgaFeoEvhMzVWyGkcNNT7NfkE3rdx0vxVrZUQCV1lRZIozqXD%2Bd2v1eWc&X-Amz-Signature=9dad4f762d292d96e5c800a5879a6de9cf56ec433dd4bf73714eddf08a1668b6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666HGCY5DA%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T032946Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIQDV0w%2Bwlg%2FYiZaH9Bj5IcTPUtL839jN1v6qMpQWfBmnAAIgd4oogUpE%2FMojYITmCyRSrpqePQXU3YqNVppqu5PWizQqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOKIbH60nqr1%2Bf7zhyrcAxlcR7C5g2Z4uZVI2vtTKJMf4BoohghoxdjMxsjEygHSh6s372fIluErOs6nnwaOj3OiIQLuDRhu4%2FUkOz23E%2FffwjyvF%2FHGp5CbPb5LKMiFs7PuvuxJ%2FkfSLBYNRxpH%2FyQpirc1LN2MXUC4wXou3mbpgT6ut0KEbOSFlyETjJQlK3TXieT504kpktW0u6ADjQg9gDr4%2BsAaZsFB8FBNraim4%2BhcKm3YdnZxS%2F97OZnzNuMsPIfq1Hlm1VC74WbNbbezX5XWDZLRa6eUNu4xtcX%2B%2FFh5kADqHdu8wWrx37Vpbd9rp4WBHKOwi6KhGMjDiU0K%2BbzZKzmC78PWq1T1OXZ4vc61wru83i6zqHCeeq%2BZyLLtEFRh%2FxwXoEE4bXzfbNaOcycvt0peiRM%2FpEM3x9QeqvTG%2Fos6Q2Y0RAl7JoTNunZ5TZVpfWQXIwfOp7NWnTWnauktdIYoaRJHfECg0aO3C7HyuRaBWArfFY6566rN0yAHh5BMTqqIB%2FmKUT6uLLSq4Xors4oUtNkslhshfkh8oC3NEUwVWWYSkMS%2BX0U2jS8zQsBDzSfRnLHRdhT6GX693weUd3aAjqlNf4yOweBIncHtODYBjh0fuhNUQPl8NkCRi%2BsR8uFLI%2FLxMK7H0c4GOqUBK5V8ZykQ1bUydDAq3q4TlQNHzFTqg%2BuDQgOSHfur8J5uY3dqng5mik4fugTQ9cYez2Wg%2FHmPz0ed%2B2kA52APLGMClFJf4FA0JDyZkQb3rf2gBmvlidOfECOhx3Uf3XFrjeimc%2FhSQlZBs9jyH1mDqSZTx8sz1cZHhkFPmFPktmdsyhYrpVipiAqQbrhrXVrDHy6HlSDEdea0pDolt2kqFG6Qeynh&X-Amz-Signature=64713780b59afa2200e90f9500bd5137fe3783dd881aa2b763fb821d4a5922fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466USALQQSG%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T032946Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIGMYK3v%2FaM4x4ylf8Cdnomh5SQpsDcL0wGpV7jmhcNB4AiAxlres2Klo8jSdXKwNy1oeddTvq468lVryIf43WwxuuiqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMBE3jmjC25Pi9NU2zKtwD9qEWisRz8eDYZqC%2Be89E6h6lTWyxfD6XrY4vb91LUmEZJ8%2BafF4dJl%2BeOPXKrvJxBzVKZzHR0rNR3h8Uv6yh5sAANwGeGdUtVtNekCS4Lx4wTMwm4rm5DYQoWNCJKXEwkJXGSC%2FhTrxgpe2fWZlvgQNEO7%2BjoA8DXdPduoklXQ8CbERNSQm5EnMSlUYzMs4syVv3lXypRB3rdF%2BYgyXS0kWq7gKkw%2FnF8p8RpPDaazqMZfaNOmyg8Qs588sAKNN8edoVnUgc1gSWYGTf9HKIXJAvkpCdsV3kAqJiG6HzuUEZcwRgXQkcWDRKALi2as%2F1FFj8RXNUf%2FZ5BCId1%2FLUjf9yuTei5Pa2mXwOgxgxPrHq1zuMOoRSARGEvBvSl94%2BBji0ADRijbL9Q6HqeltVmVPfZTy%2FHQqv0kFqPh8NK%2FO6BePqI3US%2Fn6kt8W6o66mMT2MM9KpbhwrLuSALTG%2FBt2B6Xsnsg6Dn524KE26jkTj2cCYLaM8rSGOg%2BOI6vn3XXEm%2FQiLDf8mD%2F91o4v1jkJYeaVc9ysKvZ%2Fpf4emYJTVJNaOmVq8FcARO5nbmRMgC20grYFqnMcV2TLzS4%2BH%2FYx3ppCF6DiertM5yjejDpTxUpaFCjNpPJK5UnEw3MnRzgY6pgGm5B3rGJKQLSvxyN974oFsKTE%2BZ23T6tvel5ocS1IXv%2Bjrr5NXL48o9OkHjhdHtHJi10V63rkrQGp137c4PqiP30swY7ogvRWyruFaG5c6F706mRDa81HceCS7zEz9ya2J%2FG9G5ybFzSw%2Bd1Es%2FB2YVM%2FZa9N5S3uJBWIkXkQ7kJppRAPXxxIu7dG9N%2FQH4n43FIE7sDKxQ5nhX6Od6slHcMxt53Bf&X-Amz-Signature=d4a29b13d2470058704847924772f5af26c56b9491ed628b768276e9c889a873&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663K4QV6SO%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T032948Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIH4V1FqrwyBbgCKHbb4ZsYDkBkhzvqUwe1tPPht%2Fy70JAiEA9wkjupKy2z5kvdsYZHpNv0v8ygPYCyCs78LH0o46YZcqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMX9Bfmmsb6I7vbnRSrcA5F2v64tKIJ%2FkXAT6DZ2OURXjbl7XdRy6d%2Fk2yNSbgTFrO5L5QtRd86DE9dyPLLRGeCHDzgmdwGcg5OfbTeqD%2BiWYxQdKBv3K4T14au4S6ousw6WD3Ov%2BNXTMCwd4pcsD%2Bn6j84HI4es1uufj1XEOlw6sBZ0wOjGpeFTUKc1UMvM%2FDryp8HB1EPQDRGpjt6T3H38wbTDzVvn6tW3dw0xFEvnN9FmZ8fkMUwHGt7LuBMg7u1WY3ES%2F8ejJhTJ2%2BtR7jC6qHsakSaQGiFvn3rpTWt1bnFZx2t0TntzwIewAFgxplHVXE0dqSBLeSmFfOtizBNkJOGpUX%2BYOtxrqmswUILEeUGKqnigor84Cinm7In5tIyxoCO%2FSv32UmwzzlBsY2%2FPbLc3iJ%2BgvWVYf6sMi5uNTDQz4Bb1Qs7dSdLBmVHFeQPYcX7HLvhaBzKD6NQoZBYNE1rqjrGTKGk82AB7v1nsAAJ8WjrvZHJJ8VrviZv4yaA0QK9VMGeDNQChgxw107VlubC6psAqo5fOPYjn4fRkT4Iaa0tLTeHBSTkBxxpcDgkT70MpCOXLk2qdDm8wtapLnpQBC2AwZCqtljbWjvyjfMyITTZEEQeE%2BHStl5K8%2FeIL1Nef7umUFCxEMNLG0c4GOqUBEVv86nUepZodboua63uCC1qGV6U%2FsY%2Bq3pYdmy9YRo1FGx0gCtzFoseT1LNfAzyzCvAYVIQv3xF1QPEBYoNONCq7HQARvd43JRztnmR3y4S9dg5jEUerN%2BsK1xdtaFWVCNQLbD5zGl9ANVmjnQEavpbE1hJZEt6OzkBGrtX3bVRaouDnqiPGkMGhViHLG%2BNiiOv35djnHV3s7uY3j1g3doRRI%2BpM&X-Amz-Signature=2d790e2d4db4cac78575afbd359a253d50bac06f4a657362e4353c5bd3f5c936&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662S35RWX3%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T032948Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIQDKWfVcaBCqAUGxIeSBOhFuGE0hS3C%2FNrdRG%2BYP2UOjFwIgBEdJ8H%2F86uWgW4u8mAc%2FAU8g8vwZDbm7EtFROLpTL%2FIqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLkSN1ZjQRAPYqfmnCrcA2YwqbcOOsQES8R21ap4jHh7mhFRTb2u1oABF%2Fov3CMlG6Ymd84wiyJSPX9guOYLal2JlMvvxyR5ZQPD4oQHLH%2FN14HkDX8EPF7Z4%2FWA%2B%2BwdRiuquKIJO%2F4dvmuxmGUSb4%2Fy9%2BSaVFHgYXvB9ArLxUoHW0p8xdn0mqR46ErisVID1ZYArbjasbXkfKVSRMiM%2FNsKe%2BnaziM7Ziw9ojI2iP8tMPk7FtN4ABJ54%2BsYxd3avRiPMjPYbcEzwoDaINZlQNSQsRQikl5ZjPJ0%2FRuTwU009nJtnypy0Zvy1PolPIC92wvDksacZM5vKQLSOcbFE377W3iM6SZQOPeKimOzBP9Wacm8MvJL%2BVqFSf%2BFJ6NC8q%2FHSOFMOZJCSjKLUdejYgSTNXLVP0SESe1kWz5u7p1zh6zxSEdZdC0vHCf%2FhKnvFQY7ZWrb8YISfN17oyoz0T3jYNcBoki2sSIt01X8GRgEkehCojNG4mj5L5cxupviwzQgyg4HO3Ed%2BQpKCq41A1c3RlZ4t%2FYuZJUHJWxAUbjzuIXaY0oWUn15bmXSkuXAbL2s6fMioMQOPULGob8j6t5EsIGY5LKBIRWQtoEzU0oOVO%2FYzeYLkag5aNdulvQUGdTz1tCsBMLUEhybMPDI0c4GOqUBbLWv7lRjHrCtE0vnZKGdjgvSXJ964cpN0IiMsard7m5XF55c%2B%2FFacQqcAo7KshiywC2U3JOQ6r5%2B7I8eBFJphtp%2BdekoCdlOOhpwoTbueqw6mZnJnl%2BPSDSP20%2FlqKBBAS0t6DBLVFUNVysYwS9Ecnw9XocOirFfJMQb%2BKFk%2BgjspJMk1yIIe5oZm7E3nl1XZ7vKhfUa6nxc6y3jhIzYd7ZZf1qz&X-Amz-Signature=581fb3a9d5b65b947e8809ebe9acd84ce0523b643119729a254e5bcd7dec1f9c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UKRWVALG%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T032949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIHNWDbLCpe0RmqktDnSC3jPStDP7cgVq%2BvVUDA%2B%2FCnkmAiAc0jQz1CgcTtxLVkFU09JNf%2FYgtfWyxW7oB8BGGFS7kyqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMkn9iYmu6AKyud3C0KtwDsdmsM0w4qrZ13trC5VTwGR82%2BiCatDdF4NJSLrg32oPV%2F8ofuj7l4MvmTyb%2FW%2BV9CWlqJLuZ2I0EJFMhxLK6kM%2B8bK8FlhEyMZXHHOOXL%2F3HCbzl8A8KuBM42IjzViZwPRgjKpsy2npwObHJFEX9Lee9CwS0K8p7lkpOu7HVsqnz%2Fa6uAmEcewFwiZg8B4DLAHfdecnloSfz5VDImBAIV%2FuEcfPMAgWqsJMd8ehrbKidzZO6pWWzkWlNDth97BdUFDJd3ZDbSOEUG%2FFezOxjkjFmTQ53TyUq1kO7LjlOj8qo1W0WCiALBIO0bb2UliNhjtULfuonwhmr5RBD50K5l6KHk2glcyLnSWIdlNbuQ0PvR4nSCT3Gj%2F4XBEzmyQm4%2FO62kZaVWjAfGtPeLPgsYHPlM4JGPc0oF1fkd1Ous0vcr9Tu%2B8yG7B4iwbYu2%2BOCP0p%2BgyWF6%2BYGX8nEp4%2FuuP3rVaWLm6IvSsr64gB1SjL6MdcsgvcmC4eMjdKn6mCdb3cP%2Fg6%2FIuEWVOdxz2jXV5fUEi0owrg7I9YERMm2N2kTMZHWXLRljrO0tffEvD8%2BwIpF4YauMBNid7GpUu81MKu2Lfx%2FVSCpeSqKU2SoCL8AC9%2FqlwvzMLa2TB8w3MbRzgY6pgFhNO5A%2FBvHv77e74CfDbvuigl77pJyN1ClwWfP5MyOOVxW3IgkN9LutG2sXhUlsl4BhV45%2B80719I6%2BQVsz2Cssshqzo6dhLWYltAc0N8LX8xOUihzUZcnQOxxnkpwbDbEJia2F4bvm4Iar1iLTqO%2F1xVuqvqAyfMP%2FmuASPTDxRefVsJ3OYrUmlo0%2BWPwxnPpR0%2BJHzHk3lpR9Uxc3yPZT4KsKTwW&X-Amz-Signature=2e1b1e15f3eeb35a8f4193cce822da768c5213d3e838205cffc996172032174d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UKRWVALG%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T032949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIHNWDbLCpe0RmqktDnSC3jPStDP7cgVq%2BvVUDA%2B%2FCnkmAiAc0jQz1CgcTtxLVkFU09JNf%2FYgtfWyxW7oB8BGGFS7kyqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMkn9iYmu6AKyud3C0KtwDsdmsM0w4qrZ13trC5VTwGR82%2BiCatDdF4NJSLrg32oPV%2F8ofuj7l4MvmTyb%2FW%2BV9CWlqJLuZ2I0EJFMhxLK6kM%2B8bK8FlhEyMZXHHOOXL%2F3HCbzl8A8KuBM42IjzViZwPRgjKpsy2npwObHJFEX9Lee9CwS0K8p7lkpOu7HVsqnz%2Fa6uAmEcewFwiZg8B4DLAHfdecnloSfz5VDImBAIV%2FuEcfPMAgWqsJMd8ehrbKidzZO6pWWzkWlNDth97BdUFDJd3ZDbSOEUG%2FFezOxjkjFmTQ53TyUq1kO7LjlOj8qo1W0WCiALBIO0bb2UliNhjtULfuonwhmr5RBD50K5l6KHk2glcyLnSWIdlNbuQ0PvR4nSCT3Gj%2F4XBEzmyQm4%2FO62kZaVWjAfGtPeLPgsYHPlM4JGPc0oF1fkd1Ous0vcr9Tu%2B8yG7B4iwbYu2%2BOCP0p%2BgyWF6%2BYGX8nEp4%2FuuP3rVaWLm6IvSsr64gB1SjL6MdcsgvcmC4eMjdKn6mCdb3cP%2Fg6%2FIuEWVOdxz2jXV5fUEi0owrg7I9YERMm2N2kTMZHWXLRljrO0tffEvD8%2BwIpF4YauMBNid7GpUu81MKu2Lfx%2FVSCpeSqKU2SoCL8AC9%2FqlwvzMLa2TB8w3MbRzgY6pgFhNO5A%2FBvHv77e74CfDbvuigl77pJyN1ClwWfP5MyOOVxW3IgkN9LutG2sXhUlsl4BhV45%2B80719I6%2BQVsz2Cssshqzo6dhLWYltAc0N8LX8xOUihzUZcnQOxxnkpwbDbEJia2F4bvm4Iar1iLTqO%2F1xVuqvqAyfMP%2FmuASPTDxRefVsJ3OYrUmlo0%2BWPwxnPpR0%2BJHzHk3lpR9Uxc3yPZT4KsKTwW&X-Amz-Signature=245d7d9cb9d5bfc3b07ffa5566af62b66a5bb585183cc9c971ebc9cd321265ee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
