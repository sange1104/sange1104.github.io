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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662CPN2IVT%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041436Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCuKFI6uO7UUD8gbre6xrqAbFYgYbu4bzG%2BeiZJH1mYgQIhANmqUhhhKaQuj77j0mYZGKhg1KpW0g%2FN25iSl%2BruvsHHKv8DCBwQABoMNjM3NDIzMTgzODA1IgymOhkBqoQH2JM8oDwq3AN33DQjOZZAuVekKUuS%2Bpdz%2FfVI%2FCx%2BYstH6IQuyoQ3QZT957mELTWQ5DymoV7LNqJV6HLuMa9JpRMwt1VopbfmI3S85j0KizM61NtpXIUZ838CL85klBogi1pdBa8y4HhxcyLVkABeU50KlWI99HjH9wf82mvc0vjkPPCiXvoHu2mr7dEB2lEzaW0we2O2oREYilBzA34GNJFgaamnhJ4lKelwnuAuGDLXUWc7ePceuNunbvqAx3635DxCw9d%2Bp75MmmR2cYtHyxvFl1u7qWSlzwh3kEUlI9fwEeyNcPiwwc5wfWut60rtZ2Rxc3e9tToRSR8hKZdh6K7hXVk4HxNLjxW1RyJ%2BG8%2FsAFQjszKz0UKMEY9u8by6s2P1VMrF3x1lEVM0abf2UYl2t3dBDjtUKrCIB%2Fh8Dv1PxG4p4Y7iwz0Ip5IgJxY5JZfkx6l8hEhvs5I%2FFsggnCkyN03Hj6cTPHCutckGf4Cp8ZZ3ySLGxO%2BUmN%2FakAO4nzQVTv%2BexCUzXNvtIm8T%2FlOc3MefNCQTmut9i%2FkYb9Cqbc1xCl0mveKj2Er4EhBmEL95xqDJAxp529zTYEl7j0bwEkjDyvGT4TsO4EKv8O5eZmGJ1KygWVQAkp7c8RoKjNfP%2BjCvudDPBjqkAXxx%2BF0J7duLno3BbKvIZxw1Aq%2BfpF8BVnRdKhop3GyXl0Zw%2BriQkrnSYYfijiMsGiZt7Zpkijf0mFCRJzXnOMI9lJ8Jg%2Ba1ABTY5RJpntnvXgHZf4o1PNA8oqPSL4Qx%2Fi%2FjYlkoIygN6U1b6CgCl4GcngwaIkq0ooGG9QTdeCnd%2Fx%2FxlYy5s7FTgK8NY%2B%2BHR9A8ymtqTCqIdT5iUfpFIONEdZpQ&X-Amz-Signature=e2496b95c40e15d160b41f387cb1f2ade4e1c05ce780f3edcd98013249606e87&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YVBYPC3H%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041437Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQDqgc15GM22P0bjU2%2FHhBq5s0ImMJe4N%2BRBQsNVUxZtSAIgGIxoVTwhuJWvv%2BL9%2B%2FGdh6PGfShgvhdJa8xDOn8tPUEq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDCcmPj4eo1aHn0oN5SrcA1SN2ko5QeaOmWL416jkj91ADeTUKpW3XViovsQ5Qk02S1UPuLRYJ6YOGuRPQrjSWncI6EBiqviDjCtAqSGnf4Xi224fn9QUfp3wZHm5NM%2B9kweTi9ilvqqGZmS2jrA7oi9E8X80C9uf%2B%2BP71GGOw7gJSHhZXU48nNwW95eDWsw2xFPOotxQ53LOaqYvt5qRZTW7BRDVY61WsJQpto21hpEKVeh%2FtQYdF9t5seI2NaqI2UHWOaUD%2FWMl5IJ3DaZe2IriepcPY7hUel38tANbbMHsAn%2FnHwYWgAxTlisCDsbtFz1tD01MPc273w7rLb4rQFDo6eqtXFANQm6RMVhY0RvpP2Y%2Fiq7pBuxf5fUX0doB0grfmiDCAtW0EeO2CHRl6Ki7iGT%2F2fdm4n%2BSpLkHtSG5MACU%2BPIu%2BABwMFX6K6bD%2BBvEnEked81drU%2FW52SMKdMgYN3K3a67V4C8Inq0fPm3UArrD3HKMfzIlOomRHPm4cUwpXf8QjDXWg4uRPxjBpdwPvjZ8Q5Ftle%2FIALY7Yb3GJQ9pVP3pL4s4sjRzqk%2BcYEWegBg3RZEe%2BkDAGetWUFMm9RYubVT%2FvEsjvuvx2bohSeYw2cK7vBH7WUIxmYCAbTyMUJ%2BhzSA7V7yMOW70M8GOqUB5i%2BRU7MA09vgicn%2Fby4rrQPu0AbQDJRs5pNSIXqzI4yF2PnpZvDhyLO2JU%2BSMeyiFlB9HCFvmcFHqPfn%2BrUY9fun6uOXmSwNe0BsoQrzERAQJ1a16EHLptnPryoY3cq7X%2B4YwJKY7UVguzKbzfMQC5bf%2B1Mq7EmpctR2oMLWZz5RjFuai1KOwzooVhyL7jLzBX93xrYRB%2BwRNrJYtehBxr9whQhZ&X-Amz-Signature=920839adcb9c3d14c836c58ad674611a45f7ffc186c7631804695da3cfdfab1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SU3E5DHT%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041429Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIHIa7G9EOfHPwXsZXBHDGwL3ml%2F%2BEydOridzNsyb2YJEAiAC%2BsJSoHKRk7DN86WZUiD%2FhLO41lOipa8qJcgC%2FWQwjSr%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMhQl0Q15JExKGWAZ%2FKtwDdyCqelYyeMExJTPM7sf0eS8Kem7LO5B3tA3XNwCdZzVCeZbPdGjG0fuC%2BHoquhl9H%2FOdzQJCUObzk9nRuiqtfruQWWKVHqyrmQLgxXlWG1kD1iYvn144hJrcL0Tg7ci3BL7aDKazcaxY%2BpejBuXqgeNQ0cir50%2Fm2XAmUuu5RWw5C2whOPa%2FyrR2HfhCv0PguOMm5Sm0FIocIZyMPijD6ewLCteZoN4VTdDxR1IPtYDwhPgc3A%2BuRtqumBTrAte1RF4I016w2my4hIqLwkCOTUQtn6BKOigSA8YlUaC7YDw0JH8sc%2Fy0fRpW%2BsGebtp9O8U5u%2BdYYlWI5xhxNAQ5%2B0CtI9oqEafjEr%2FBcqxugpUrPRYeNltbjWrbFfOxH56TCXGercYgxnAIPWa9KTwG%2BkMm6T5t0ZdO6hqlyPXodi%2Bpj80scGnos1KFW5h6mS6VYfKlXsMKDYBgDbMmCdvzzAkw2pqdTeQfhWgNKAhGe%2B%2F9gmcFfXrmnZyP7sWh3soijGRChxJyBN6rQZltkDS5c3yAYvlmmqMigphiAG1FBN88fGBuMauMzDSSXSaVX4AbaEzRfUXVY5PGZyo2tLVNWCv6%2B7rHQ87V1gtKfKfa2U3RDFZ8%2B2yzroCWafQwpMvQzwY6pgFczeOAPWQjPxE4LoREFyvpdyC2IzQ7A7IZJ60GBIdRAl4IlJXxgc3iFu68rlThx4wy%2BZS6ESD7aaBIVxKKQGk7hOXNgwX8pj3M%2F9jgDGDNoiQhgwLoKJbOlQYonN1ErikuMtg%2BwFkAk2tyDw7ow9RNq9UtwkG5hd%2FhVwXp9PekiS3JC2lp63wmElmT8IUzbnf5jX2WqDgpaPdXAgfDraK18XxtLDVJ&X-Amz-Signature=301beb9b62e263874a177c68f9c5b94ccdde8f88b27dc8bb430db383dbff7f4d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RCDOMJ3C%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041442Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQDjqxPFFqhvpP9Xrn978APMHEM5YiAbGr5ZhOJeqm6rIQIgVM8gEUyWNbqjLVHxPcC7Ch2Zfskg8N1Pv9IOQ%2B8niOQq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDPCpFyLWGTwxcg4ohyrcA9y0F7gnjMcpvnBvuNbh7KJMHOVsbgvyvP9Vqa%2Frh5N2rmLrMWHjRQ0Gf4Kd5e32ANeF7WBrebLJSCnrm5mzKdbIfcrJVexEh4bchK7qIxHCiXGZsPZtn943Rw1o0SHZlnJS%2FA7d3KIUr%2FnRAXzwOxNvZ7UWyifrl48xRU8pb12%2F%2FUvDZj5n8fO4mmI73Q%2BBGpEZj7KOf4ZItXn%2Ffw2hCDwtO9MNbyg7AdZnhFUfKeDCX2xqvdSdyigekNDMvII6bY0%2Fm3IpKH7AJHgzYduih%2FA4ZoNt0uto2%2BlotzEERJ2XE54wnF3Q3IZW5x%2BBpEJqFSRtMblOgNS4cqaGh6EVdZHN8ESAjU1ZGz%2BRr7%2BzDFiOWwoOMZdz5hVyBcgXxf%2FkUEGQlCKrhLtYI%2BJc34kfBTdgt61M4KRu4ETC8gsxb65XWRFtiYjNZIt3dU8ADlk2PvhbScaCcvuhAXeeHAVNsN%2BUzSXSMfPjdJwavEkllFEhH31lNUcB%2BXjfsG51wjlD47HJU45A1NF3f%2BNyWZ%2FCUBiB3zqiSL7hOySIKZe1ARny6tRn1O4MVrNv1MH7%2FOtd2h%2BBcXMII83y0BVBBn%2FhoSD1U%2FzQGwSyVWbK3uMpHAyuM1%2FJtLiLFImmsYZ1MOK50M8GOqUBytxVJ5K5d4ipAX8TNRwkLb6t%2BmJx9t7RhuHy217H7VI%2Bwo9pwHHjOJSeQ0%2B2owfFlPRe0KRT%2BPw5m2ieycUWn0iP2hdA8SoA4QEg2vnhdjMq5r4uWCKi1i0%2BOvcMJO0cAzCy5Ah5%2B2mAy%2BhoKBuvz9%2Fwboew7pymKciCawWXP7cb8RDGoLQqZPcYvlfnTl3ahZl0%2BvgHfPUL65mZHSy6VO9Or2a7&X-Amz-Signature=5254e20875dd21ab8d4fdc581119c95538fa6c6bcf8489c98c3b9c7d4d7a1009&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665KWFYZ7D%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQDDPk8paaVExjZcRUSeK9YH6iNmPUnwHwWAnN4PkUN%2FkQIhAPZe1d3EDa6f1mjfIKxPPRtzDfhnA2nOLHEVZTFdjPs%2FKv8DCB0QABoMNjM3NDIzMTgzODA1IgzwlVKZj%2F9NxiTPNnsq3APXuC9CsqhcV%2BvxBT%2BJdGt5hPPY%2B8tMGCF%2BJQsr49nIx2NEABp0RZdGuxJsVuMyRXFvltLqu514istVen7seLgNuamt%2BKXMBBtbOe2AztBi4liONjeFjImlgwnkwXRESWuY%2BiPcOlahhMe666%2Ff8apf%2BOLml%2BrIB1D29xmx0gT9im0wbuAIYNBUfrtWyQ9qzyzAOvD4YPmXm%2FLg2482eOvouqQsmTAQEVLtgJTZdd4ZDVxj%2BZx27nQpL%2F%2BZfqrcAb%2FEdTjL1YWxC1bBIa8B64dWC0daq2y6jcQfvnHlrz29%2Fg3U1%2BIoanhv53%2Fxdt8zowRpCZvRNqrU1QBzfC9gVSPAsbj2IwQQTgO7UHT%2Bnb5NLmLHH%2F7%2BAZ6X53l8UCPkHYbwfaxZ%2FESa1nQTrqv8bQ0K776WdXvsPHHSNgg3MOAopgSRzdu30lRV9SHc9qlgE%2BYbYblAI82b9n8RmbbqsNZbTEDNiMUzdtm92FznuQUhBXJowtT4MCv6HR9OjQyyKZJfVR7uS7BAB%2BfsRbGvyqW2yfYNvUJgdMlj2%2BcVsGOXNkZvguLJU4z1An88BF05vGImdfgDpibpsBr94R9AcrR%2B4norgxyoX8CFS%2F%2F7V9SJ5G6Y8%2FZ1l3XerSq4VzDwxNDPBjqkAc5KdG3%2F5%2FT5SHaGHPt6fPZ1WO6bRvbSSdPeTdHsc4sJ7do1tIVtV1%2BZL%2FFh4E8AinQV2EePt1g1qICV1O2b7K0cwebtzFZwJsgxeTy85QVuBAexMTOvpis8jFPtF2ssYELDjq9lv7MCb6fGoKUbDWAUTq1JUX1rzq1bKzfD6CSK0f4ndY90UTBlRAjwQKGGEu0scFn5kDeTiLX3xtQdJ9PDQ%2BOi&X-Amz-Signature=62e1df91a2614280aae5e6a300b0474720cec3baf5963b4efb7b38992654d467&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZRCA2GEJ%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIGk7Z3r6ZDRhJ9WGTIGodiXgo%2BnZ6gml7gsL%2BTMy1q%2BaAiAEO1%2FUn0982Y3IZt7YcoODgAmG7kvudqgWcXok8040DCr%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMK%2FFNt9v7Sv4cFQ%2F2KtwDJvcMIqUSqfJmas%2Bbns4l1k5q5WWxdzeUlUhghUdG0sWLUHeqEdwmaxNI3aZqBXPgcOeTyVH92pmOx3FQxfYGdA7dGvPrXVVgcqVFTUcsXwNX2jT%2FMcQJVzMv4u48H6UUhlnvVp9EBvUTymevhkZYpup4iJuSsqK4XwCdwOoVPFNTe3kymuUihH7bbLBS57pKE%2BbQAXu3vNyfILOSGO2bfUEYVn4Iln3vCTX2qsJBvF%2Fz%2FS6BMO9Iw05ryF2Z30vyc5Qwzq%2Fh%2F0s9tOGzLjQwihqM%2BpeD%2BB3bATStZSL2u9NB3%2Bj4y4vi0yeZ%2BK6uOSoqFZOLYguyWEQP215nlttWWj5GE3OXA3CXEy94KNJIjLjaA8HNW4Q7DAFXNZWFTI34aW%2Fi8IPTuQKOqncpDS3SQty8mF%2BZ6QJXr5Dyl78Am6wLubzc6lKKSRVsdbJCGBoV8%2FyHEnrLFwAfMggTJ6cXlvQSK8RRVOWEOkmKfHfKUEXibZZqgfu6gsFAhTYexRCLaDcFOLUz0U%2FFHRlj8HPu4qjIVdP69Lbnomrz6yMdAxVt9E9Epg8Nai8q%2FbGAwKCVBqJULa%2Bu%2BkJRKqo9qNkxsQtpuC2tv9NcYjju1xqr6jFI1fXUsmc1alG%2FUqcworvQzwY6pgEB85MbQ8i25Rfm3mhgWgclqSeNmEZmez10nDdFABDaxNG%2FFotT2aKPlXvHqodBPIxZyhy3Ot%2F%2Btiy%2FjpzgRlNB7YrVGoz0UNUhDvOmrIrQbnefgJ5FX81tOw4Y8KEvN5%2BRLtVuEX3ZdfkYRcFSM%2BvjUXty2c%2BXk6En4FzC7ZK9r1g0wxDQ8YlO%2BOY5F13Frl2NEoYI%2FSXDtGgE6A02QEbdDvZ460a4&X-Amz-Signature=2a877896fba6e26683fee1e142396f07a8be60c20a48a467b77bbb476331205e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VKIC63TX%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCICui%2FtvsNIE7N5Xvd8Op785v7AOLLsCqg8qTfd4SHfUcAiEA1zVbJflT42ngFPTGnC4ijnq20F64G4GKcPF9dy8jvxAq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDA1Q7EC0cJkQD2aA1ircA3PYY5Yy9TDieGu7yFnpalCcN9Vw6jvbeRvkfhzwYKMTfI11H5%2BBRN0xKt%2BgqS5pwrhGrnjEW6u5g9tKgfb70aH9lqTsE43OSX2wzHQkgTCO%2BbKIeZM9h2zcLI2AoK15VguctjpWCFktf86inwB%2FcTNSk7mU1Bp01fPaOHVg7%2BZ9WJG6WMw4Uekt9oKidKgpbquRO0lxdJpn26CCHfc7QI3Jz3OB9V2kkjWFhn28A9BgBYGKgY5QCAt0CyY8vmNXGGZyoFhdRwUyQFXPNiDZiUFi6BRuTQcFpB%2F3bIV32yWkpaYQPcaH7vIjgwSXfHrHNaSDROdEED4EMk9xrHd904pAVUXFTsRS1aUnhtx%2Fnv6QQqU8KgA6ound1W4X7Jklem3SXC1zeW3wDTKhBNumXnWEIe5%2BsR53tUwsyVV1acqGGPksDBChdqE7ji%2Fhh0jDp9mRcGMDA9Odf3mNWnUH1w99nWL3TOV2QzQHVUu6MyzMGx2o4IijYGampJ6nRXubQA9EFR6K%2FPYb2FANo5qbKblcC%2FBXSIP5eTqsKRVD%2FtbcRxMItKzly%2BMBpKhz3M7EvCozBj9GwT8cgFH5h%2FclgDS00oKs5yhx7UfsO8b%2FUgNQK6o2AcIDGf0vIhqtMNDN0M8GOqUBNOdi1vsvrMGxvabxQpEWIzOHuzK%2BkDaHBzkIiuIn6Lvrv5POL910KzNq3hvieMAS3hBAXTRlalhO9WDd0uLXN3ct8IwetIXYFQq58qF%2By0Kgzai69Pu6iHQc4%2BMIz3Nkqnv0Lq5pbeM%2BZF4oe7TpUtj38rlTqx4xtuSzMuoIzKiz5yvjIT1A%2Bf%2FcXH3aoBKygmvNES74yeQhhY4MNA4OZik65IUY&X-Amz-Signature=32bd4e44fecfde1fed45715992effae6692179547b13a6ce0405dbd859f04ad8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZLFE7JFU%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041445Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIHrqkrRMsHYJtys8bmOApI%2BjKGZtG3qw4Jibf6FB8uLgAiEAzVpTQzB5L2ebAW6rY%2F5ug8zAqycDJe%2Biz9MdoBU0xpMq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDDJrvU8VtglD95%2BgeCrcA1F70J70oB8lBOSBSil9mLcfDUIU3NT%2B2kDAoepK3kdX0lEpxDtMBDavuQYCM%2BTj89jTL02vB81rjSG4HEkYylKanQ%2B72XU%2FTF7tzYAYEZot138c5ncQ8hPJJH30T4WbwO69hZ3W5doaZ52%2FQ23MFM%2FuB2%2BfwZdKfsEPaPDmLa1VO8Gdo42B%2F%2BzIpU7OXtXm%2Fb9pnc5e6mGF3XykgnrUCMYT9N0STKLwEjEaPd9hovIsKlk3G9DQOnryMJGOw0HKVlFK%2FBI2%2FyvIj7ugjq6Skr4QL4oBYo99qwP8gEmF13BTmIE16XFBLcBfLJuNvJR9W2C7JcpWGV%2BAwFgj%2Fj2Ud%2FNAgybSx%2Fui0a8RTiVKtG2eTn5wFgpvtvbfZUNOCu1PSyrJFnOQHJcDph5sPrAWpfknMMOUrY3WzC%2BsYTM%2FwtRtGk5pYeSYqxjJj858lCFnACozORiPBQ654%2F8BNTrf9CgKLSHTiwvGULnFetJJBwpnJQVTMrZU1mrAFcmNrIhgLNwQQ47WLWGfdxc559JZtxbf71Z1y9FuHVedcuSezInglsvcQvbWcTCk043NODC1jUY4etN7p3ppK2AazTXVsub%2F9fiU2PNuZzeGxABvPB%2F7A11XeRUZ8dVKufUiMMq60M8GOqUB2c5UyqkyUCNNfhiU1mrcf89bPXkWAfV%2BWvA7sErKsIk7iNZtylD4FBPU%2FnoOQEkh6MG8xW6oHxqblOGI6lvsQlUiYQ4kdgOrLE2Yn%2FaXZDY7SkFwZk4AbTGqCzGf2Xllj9%2Bdlrzca5FfUTiGlEVaqiHTZi%2FY4N1TP4R5V8kkk32aG4AXwNTpeiigJyqO3U%2Ba3fAN9U2r3s4XN0XYpDLbPvCZTMrG&X-Amz-Signature=47016ec5cad5b19ff17a8817303423b193f4bd064f45896cab2705736dc46ca9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VQQKDR7M%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041445Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCICa2%2Fg6Sgn54mdVCYR19QgF5z5mxleMC1duEZcIhK5nEAiEAniUWSy811oJi%2BjdSXhIC9j9%2FbAfxNgl1tXZM4kFzzTUq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDCQRLEUSx%2Br0qwZHvyrcA7Yt%2BWDJ0ilRPSzPKayOh4wZVuGLhwc1BzLlDXSyOcM78L1Oa7d%2F6FCCLpSMhMvE5egMEPrmlb4dJKvJZ7XCwP3rWZ8rlTINlClC4xVOz7pNUovMnrZf631zA%2FE5Ou8GxkFMN3Ot434WN%2FBsyRD%2BoorIBtVOh9muWO%2BGoABF0FHRYWwqgZ8pMNvre%2F%2FeSCwUjHkFs8C4NQqvm3Fk8bNIiBT%2BNpWK5frSQ7MAeSMltOdSeaOugbbZvf%2FEpKrNu%2BaI14Na9vNIA32NcQdntfXoJoutROwL%2B6%2FTYJb%2Fjb9KBmplaIA%2BZvnFug2GIzYRxeohlKFRy6yyDW%2BXZuI6iXpKikYl8YNzdFHbF41jUbGDyLt1ri6ay7y2trjRJAISJ17iRK9wRs3WxY0grnoTN7EAGMomhuYY9lUb8smW1%2Bnx09ez17ru1zEq5LbUguMTwQxBLESuU%2BAXPUXTWOV0BiTZ0ikm2vVYrrI4LbJkxrbt9MjxHKVti7CkovIAQvW3oyNK1hbcp3FfiXTc%2F7dB41Hx5%2BEci7qVNUjPKsV8FvDdFzmQEZdLl%2BdxFF0VNuznK4xRzxnbAqmnpawLIfcqdfCSMMXH6F2wRYQ60gLNJDktvWShwmeVfhjE%2B6tntu%2BoMMq60M8GOqUBGpAhteQlN%2BIFfr7Siyn6cxe6OWOMc6To2cvF6KBswDFU%2F%2FKxGn2VBExz9pg%2FihVd4C4ZTs6IWGSWJ%2FhT%2BWdfo2SaaAKRwz6g0dCVCOBILgzg5CPOjjDwQo7PnRtI1MZdE2x73U8%2BOxIvcbnOPeGhMMSzWa%2BVs5nhYFXY%2B9qhEnJX2cCJud8927h4lct1PkHqZU7Jc4zFw%2FGLOCayvJxOLOiuAEEC&X-Amz-Signature=17fe5733075fa0eac505f221d1b99ee5503b7595296641b4124a631d873ed4ef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46637GZSBFP%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041445Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIDQFGxkgVk2BNeQwAmwix0GEyhsFFIk6E1jLYFvvnijVAiB2%2BvTu8%2F%2FonTx0lfj5LauQXA5s9BPO8xRpoeUTxs3b6Cr%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMnLBx9U0O2PAd9O5FKtwD2CeSrj8ijPYXaCNvnkFA2gP6O8Hj64Z3dc%2FraE5czQOS3nPNczpL8g08%2B2fj%2FcCFXaWy8y9voU%2Bv0ZnucI2ADPFJmTRFON2DYg%2F1z9mXyVAGLj7q%2FSws9PmPbPHM%2FgevooPDqOpB3MbUqK1LuieNS08J2841dU1AjxT4PVMTRzROPLv83HdFVVneaJ3hsGM9GJdK78FBba3lh6N0O71WInKSuyykfLGCryXoM256FTsb5twkZLtzkZBWEe5lQBce3C%2FNwAB5MwpSIUJmty3yo1jQRlELVF3WYv0vthH4ZNLdA9oZlKbrdFRo62sQ5kQoiZSMAgHZBNr4hAtxk0qPz7rPCMUipXkmr9tqH%2FPqVEl79tDdIcEqijvqcPz9IgpTPs7XSOphXLcHyTASIlpxZe79AnL1OyD47qhjWaVvhuDtzpAWriLOAdOXvNYzZEJAfwF9oWL9DPW5OqN1gPFmmM3XAEmVCWBSCaH170YPtQPULTVJKCrT8wqXnbYue11VmYuYk2J94Hdm%2FjqhOxKWnGoBiwiVvoubpQCepoPPel%2FWPIcd2gER9SrWKVqduDTa%2By9%2Ba%2FySggcBcDl4edtPSJbl4s%2FH0Ihj9ekbigyQfUpjHvrfg6mvafl%2FZbswyrvQzwY6pgHjnYcbBQAIhji0coJlGWGXpRZP%2FBABnDcD2noUIDBxXWQ2U4%2Fhfo06AgDqSB84gQ0Nym9pln0ugxyDaAXp5XUIZu5WQrlzoV%2BW9itSZcmCMRrX4sOtCW%2BAVlURI2WyG6XPRa6zb2OtFysgH2Iu8YKZ1DouBRuGyPbLHdjboymiTfib3IiWRQ0PDbuS4qvkLqH7xcU3XocZ1eeTdTP6kxAlc39hJz%2Fe&X-Amz-Signature=633193db0cbe72cf9637e2d28b97101103661a6a9a65bed4eb7a6e8df91d2893&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46645IUYAKQ%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041446Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIFX2ppxTbsm3B0QyG%2BvofxROlk%2F%2FWyCRVg2K7dG%2FqBvFAiAOzx6OdX86ek2TTSWb4522ILhiwQacY%2BUUSxho9Pefnyr%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMpeDMKFcweSqRGmQEKtwDXmjN2uTQPJyws0ClXGwT1JB80%2FTaaZG2jhaMLP9ciCchT4gbQaB4IxZG%2FFEpStyCe%2BolfuYSozXIsJqJHJeUu8xXJK8AUkZtl3y%2BPv%2Bg2Bs5tjH19oMEqW2hR0sNs3%2F%2BOvWuKuvA%2FDltFoZM2Lu%2BUb5ORRIOkoMeX2FBlRpEoAfEiA9vbzhCtLjXew9qgp4JFcxa53CTooGsgAkPZBnDjF2C0R0khpNbr8t4NI1xzfK65eplneoy8VD0eLZCNO9VY4dspNV%2FXmICb7%2FiAIq%2FI1FY3g6HNqjfmsEhI1ddQDDGYC0DOn%2BOcJLYFD0xXy2KesZBTWdusIPOh5bBBzCe4W3wkqj%2FJ%2FQJM50IGon8cePE3W6TfqfwqxlO1SsYcDW3fqE%2Fjmx24u%2FMtKVTjl54J2jIr5IqpoCaFncgBFRq%2BpgFeCd0dDtb7dqFXRVUtfu4jaaWfRs3EoskuaGHBgEqzqpHlOAe2RJYoJZMmYBHXD7ZwBpoJDq6%2FAPevITB%2FHmj33DZxEno5ZlZ69fmoHKZizh8mhFjUjR47aLiFe2bO5BYZVPOc2SzMi3ZlSRP25mMb%2FJmCai%2F1Uf9Kz8MeSvnEUYl23D8q0XAO4V1tF%2FTxNfP%2FIlB5tR10xIj7zww%2FbvQzwY6pgGWbUIWITFZSGeiZJgzRqPwZ7XfmbeEdx3RmNiqIfFFVEyuLJhR7ZQ6qmTb5Q080N%2BlHCYAwK8VcBJjwymW%2Fq1Ah5TWh0UZtE%2FE5Rmnqv%2FP4pumcuCf21vdlUECwxThluL2L1PButS2On8GfEvfil2HnVSdqg5gg82YF0vANJ4D%2FiQNXiK8nfo1ASdBIgWPztoyqvTUNfaQ0J9UG9AdNfES6ktDB6WL&X-Amz-Signature=76e67a493804802db3fa48d192c837c5b23cd5a5cd1a695c5201b9f2e4fa0d9c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WNYZMXLK%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041447Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQDPIZasWHE%2FuzAx58hXpRXC1wy3AKE2ByDUKW6IvU%2BZVgIgJy1d9RV4AV8Jv2QGiXPjh7vr1KmOdFm47dUp1OJM2hYq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDKDGZBNRfYzZzhkD4yrcA1oqgDKeVY5xTvAzLU9OTsxf2hLBOWou74RhGzD1RDAYccL77u1CBy1nX96BzSHR%2Fo%2BP68ANg9G6CPqEyHSu1n2GazkuPfN5kePBVRgD%2F%2BBRt3amM3M%2BN1YbUUM5iLBUVi3C1JVpGuqAAUjKIBIsJsNUfFJQneumkm1f4DeFYlMivWlTeTcd8UUryrFPu52uXYm%2FDmwV9AfEMtFT1%2FLR3Xw766OGu0ojQ20x6%2BircleTCo%2BHQmOveSkr6EynIWnXhoXj7KBLVYrXV85jJRprKBERAof5VPTkrYXlIJAHBh1krGTio%2FGwzmZNLn98A2oJ4KZcSbPGT%2BMr%2BLhCoJwBc%2BMgfY6YBJyTFOKZnH0x3liMgRxYyWDY%2FMbywubSdQyUafrnlWbNXFIkGpQW81045QGeSVb1yCUMjNMx3KP1kzaxWu1gQO3NhsHjpNJH9b%2Bs4BvKMwBUlAk3scfdn98t0XHFRaAlhIyiVbsU93g92aHLdz5XlNnuZJaY9%2BxwJ1Quc8D%2BcJXiaYtNlaYU%2FxHoXPcNFd5xePiqGnzT54Avr767jqrbdQX63Y9jo39FEsP%2FcL4BHt6OZP1s7l%2F2ywCPvnoqQVMRZHLFguoCnQd%2BPtFxw2P7QiMnYmUDgo6yMOa70M8GOqUBADptXbTg7qm%2BevVIqrKyYL3PugM8ldDkTINVr3DuAif1pWu5jXPIeForDKjEt%2F11BLjTVzhj%2Fo9kPCDy%2BQwpx2ZaBM4Ck2n3nElm54yFP1u0gzDM%2FuDNbcJuyWsdQfg%2F9c2L5hglGdKnli8jxkAWz33%2FX4wac1mEQrbqB7NjvotZaEzt7CuDLVpJIXW23qgpEtXZvtJ9%2F6OkpNpfRVO8bxp7KX3x&X-Amz-Signature=f69730a687e806375aa94aba9c774c413605d3b98fb0c1b40879b54f1d6db365&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q4TSX2PB%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041447Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIBxaF6rbWaF5FEwrVQlBrZLoT99hu%2Fz8S0zw2BKz6oqYAiAdZ9dFrrrAjtxZ9UVz4aWdMzDc%2BZU4jqdg%2FL6WyHEwsyr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMP4JgQmrlaTuNhNCzKtwDHf5vQzTCyCtAIkt4VjD5R67LO8ZdtEerjRmwXgiyryvrBSGUJSAfgpXIr%2B16dw9FwTZVIUXzU3hc5UtcKrk6oN6FGvmjpjeCs46V48KShxROpVrgVG9%2BDjgxKcS13WExH0Vx1a9IacF5RZWnXCy1tWgu2y4B%2BAr6GW03tzTjf9Uw95n6Zdg3McweG0unDRzygOyE9ZxHwR7Bk%2BHSJcgnvUjWjn1%2FujgDxIavyGOQtX2GgG02ZT5xSBFABkQUbJrsQAkOZzGqqqCHW3bMQmgCJW3%2FAxJs8HQGTwNLVlQvKWJ0yXRUyaBA1Vvzp64KyPJp2ZU8VpHAh3BP1ZCnQ3T5Lk0ppUO7HFxvoBA6JHEHeIvNQYC5GDwayzjnExnWYLoglbQQxjpw7%2BekUeGz5PCa0yhIsACOkrXu6EPgYAwZJCOW4Aouuugh3PJSP0VsaTWoG1x2sQasBzj%2Bv6fJlihvNM%2F9tmKCFTbdP1awP56QQvvoOeOn9Zsu6GjXd4jr2rToqxw7NbdTSUxLMqeaovFeWD8IHwxb1G6Seir5kNcKb52zsX%2BD2m3V3GrOt0VxrpN4GetNzGIxOlfW9miw26pEywvK8uSymuJZDogx7dk6t3wOry4sR0Y4AzVVUtAwk7nQzwY6pgFq%2Fa8iw7J%2Fbu7E4oPPYXgMuBsWWrPYxufEZVr9KbdPx0J2c2D53Ep6m0i0Tdgh3djMQO%2BT7jJXRP%2BROGlaz7f%2B2q%2FXCu%2F%2B2ogqgz2qu2HiuyDJQz0U8gfPw1jUNSVOhRgWakEN3jku8H0H0S%2Fb8caqkaE7xfQfU2ejIIf6gcbKTmsM5UijvZoMg69JbZoru9i81WHAxT1eNqm4JuoGNqUctVJPlM%2BV&X-Amz-Signature=00486f9c6c885b252580bd0537779f33e328ec36c9366940f2dbdf6e2ef923ed&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q4TSX2PB%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041447Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIBxaF6rbWaF5FEwrVQlBrZLoT99hu%2Fz8S0zw2BKz6oqYAiAdZ9dFrrrAjtxZ9UVz4aWdMzDc%2BZU4jqdg%2FL6WyHEwsyr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMP4JgQmrlaTuNhNCzKtwDHf5vQzTCyCtAIkt4VjD5R67LO8ZdtEerjRmwXgiyryvrBSGUJSAfgpXIr%2B16dw9FwTZVIUXzU3hc5UtcKrk6oN6FGvmjpjeCs46V48KShxROpVrgVG9%2BDjgxKcS13WExH0Vx1a9IacF5RZWnXCy1tWgu2y4B%2BAr6GW03tzTjf9Uw95n6Zdg3McweG0unDRzygOyE9ZxHwR7Bk%2BHSJcgnvUjWjn1%2FujgDxIavyGOQtX2GgG02ZT5xSBFABkQUbJrsQAkOZzGqqqCHW3bMQmgCJW3%2FAxJs8HQGTwNLVlQvKWJ0yXRUyaBA1Vvzp64KyPJp2ZU8VpHAh3BP1ZCnQ3T5Lk0ppUO7HFxvoBA6JHEHeIvNQYC5GDwayzjnExnWYLoglbQQxjpw7%2BekUeGz5PCa0yhIsACOkrXu6EPgYAwZJCOW4Aouuugh3PJSP0VsaTWoG1x2sQasBzj%2Bv6fJlihvNM%2F9tmKCFTbdP1awP56QQvvoOeOn9Zsu6GjXd4jr2rToqxw7NbdTSUxLMqeaovFeWD8IHwxb1G6Seir5kNcKb52zsX%2BD2m3V3GrOt0VxrpN4GetNzGIxOlfW9miw26pEywvK8uSymuJZDogx7dk6t3wOry4sR0Y4AzVVUtAwk7nQzwY6pgFq%2Fa8iw7J%2Fbu7E4oPPYXgMuBsWWrPYxufEZVr9KbdPx0J2c2D53Ep6m0i0Tdgh3djMQO%2BT7jJXRP%2BROGlaz7f%2B2q%2FXCu%2F%2B2ogqgz2qu2HiuyDJQz0U8gfPw1jUNSVOhRgWakEN3jku8H0H0S%2Fb8caqkaE7xfQfU2ejIIf6gcbKTmsM5UijvZoMg69JbZoru9i81WHAxT1eNqm4JuoGNqUctVJPlM%2BV&X-Amz-Signature=cd4bed597febb553a5a99a6de131c77877e0eb852b89535d65f38a863a4dba3c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
