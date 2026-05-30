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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663UEN74AA%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041728Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQDAuzhP0N3GwP0%2FXeVhSjwB72yqzrK%2FTzVNLLfNhl3mLwIgBy4l9V9lBkihKjIdj3B7%2FYdm60J52DVqzsW2C6qSw84qiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDRhgAUVmlR%2B7TTXRSrcA8yKBewvSrsVOQ2BgGks6iQ79zafYggM%2BI9LGGkIC6LwDdutKhAxu%2BTkxOgikl62jSlF8jgv436w5s%2Fm5flmfMUBX%2Fo7V3cL0vamsmVqEdV6YkM9a%2F0Q6e21zXviUgKlvlpcePj30HU9sZzzq8OdPMbnC2S3ylM1Hb%2F8IjJzCopLGw2DqJkfcKOseWCrQXCkQ0BNRUnPFGiYyIK3xGu5FlKbhj4lQ3LfCCuN3GIhgzZdClsukD1xn85QOmw331qOscJEWcmu5duf0XyF40ci%2Fi8hBdtulBjw6XEM9%2B0kwXBhPJQsCoWnnY2%2Fm5KhyA4OhMXbUsqY%2F%2FwLpzpgAeVVWMXBVBzAkSsexVLu5%2FIBFVBxvbVnZHIljck1IAQTJU7BXIlY%2BLLxYDobY9Z73DmvxtmV6fKzmV6AM6VeoHkJXxJFUnyUpTRJKgprrmbsuLghJjpswf%2Fi9dHdafbEnWYkq0M41R6bgSo0tmh3GK11Ku%2F%2Fmj6S%2B61bPJJhXnd%2FPd9BinNuYYdh7vDCaPFIbbx5IHU5LEdg8%2F63lU%2Fg%2Fz98gGIhMC4o34zoMv0CQKjj%2BWuM2Ad5%2B%2BpYFhkMFYG65YAYq7AKeO%2Fztsjqjuf88AmM3BmU%2BszyosybYIAovixhMNul6dAGOqUBbDWS4SNEFNzzcMhAPjhAVLSb9aS8T9eca65JeaDTNusblfioHzXDM6OtzqFA2YLoEfwlO7qWSMuCRT1pFHrPpbSUdQCUKfD%2BNkxglDQ2jEsaYEmk2AurIe0TcMzlQ1Maho0ZtyTNJKdGaRbq2fRmLc6pcuqaebqco3JVWGI4uW%2FPdc1PlifUU5MdRjrT97%2BL%2F8xhXuGgMhur0NdgL64ViEkXUtkz&X-Amz-Signature=d5bd221f2e027258f543da3c02fa34756f4a6e0f2ed2674494a68c8a8d7f1cdc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TO4VKOQR%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIG51HODrpIZlHNxkt5fL7sCk3wuoFz8uQ8fjHPqWC6PWAiEArgTZfS0gzhIagCHdI%2BPDUl7qfKic3pLlKRsrVRTVxnAqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMDJ%2BYz0xzfmDX4JAircA2gGsmV862aXc7PajZmD9D9F%2Bg1ek2W4Vguxe1PNfB3Xt9bVJQAdQku6i5sUOZ0ppWm82Zf1pmwGkj2Gd23OQ%2B1u9RvPmZOk0dlgx7c2gka1IJH0tW9KfXpqMJwTkJQvGnPC15bThyq%2B8c1Mlnci7XknD7pNz9MmFni96kPgCBqBX0iZkMgpoD9Wd2UkmmONheXl%2Fy6OfnSC48hio4dnIPSO4E4%2BeOjplP7a5lEw433j0OmFEJQfnQ%2FRA%2BdsobalCXtL8Gr4nFAfDJhNPxHVh3PnAbfxblsez5cZwqLrxyk%2FQdmg5XJczNy04xCcBphffQpYPMXe9t%2BATLly2bdVseeic%2BtEkWqQqNArg4bz08tXljLqAdA6meeuYO00NGpn15AfyHO691p3Q42yL5G34poE9oe7OAC1S7vW8gxkGAeHn%2FJIC72aS76gpeJESdjfkhE8Aag%2BbA0qsydkgpMVv3kM7Uhzyo0QVXIwahzysNO2QNu1yBxcJHlviXeiHvNICvrJTgSn%2BBSbjrPThtuFuD8WMsRIfwxSaX9VvFzHS7KOQyQsUG9o%2FpQB9eFBQjzFr6HC%2Bvj59kV0kBVRNY%2F76Mabqq6UvqgPZa83MKIzFbgNwyYeiJklhyR%2FDH6OMP6n6dAGOqUBoYZTU8K8zIUWBXL8Mf1MFdPPtl91itJuTJnuGcJMbh%2FIidEpzThadGp%2Biyp3yYou0U1Gr3JIiKe9QG9r1CCNVavcdkfyxA0VGhIO99TCYLRsAjBv8AwZ6KghoZ92o6LNTEFGVmnh04mOSB1zJrYpI7qse1EuNpQggdcTCwdt79UIBPf5Qa4FT%2FOJPdKjeL9DZ8U9nGIFo33D0CmWtndKiwrp%2BlM8&X-Amz-Signature=637bd57f839511b9dc3b73da7997bf93a8fe5bdd1091078044c44d87d7656d40&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZW5PRSZY%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQC0Ae4FVT%2F%2FoQ4xpwry7ughni7XXHMDvxpZhFiktysRAAIhANU9SHUA60i0vHnATrZuFVXZHdVYI6FFXIX9xWeDoXfNKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx5a4i5UPs2p08y0aAq3ANcEgMgEFvXqyOWNlsH42FhfcW35thjvt9K%2B5aHqRd8WUvbxdzS%2F4WLsiQitucIRUlw%2FUQIxFZlv%2Fh1ebvOmgEBxeFm73BzKmnEhq6e8f0CqE7Kp%2BGb0kO%2Fa6YtbUCWu9jyDJ9CiaY%2F9fmpbXK4wPd3DYQXYKnlVWlgnInQ81Boo%2BJvRcpHLGNX0k4nkzGuZb4Vfby%2Fb7luVZFcUWPL2LHG0tPz54Xio8DzUdNQZd0LoSwy%2BRKudPDGMUTn2vHTrNsWpkEmoH%2BO9JYIbGWjJV7fsKcl8a0RoOePoVmiV6U1gh2kFQxNRMaxplapDzqx3IlsGTzd94eB8GpWaJq348FRQiBLNb7gR9%2B7E4PbjcbUDyM3CIvw2cY%2BqPkXkVGX0sP%2B7bNnkK04vqmX3t9ilUUgLe7ktG04l%2Bv%2B5cAvdVpzSteNAqFdt6Ymf5iBRelMEvgkcL9woz%2FSw7PXNMnxWdpLPfQxxctNkdMeprTIjUlXtJrP5qjx6V2kkbiqFw20c2ijRyLyiXG1jtkVxudJHA%2FdCoAetzkH3T9DzEW3vLMJO9juZLxcf%2BL6Bk8jKoZtnCL9VmOrB3fzeu5UpEqdY0lWJkY5%2FRfecbaiqvieA7bzPKIsVPTjR3xxvjMH8jCfp%2BnQBjqkARdxhpfqB52S3QqFHAKmxP%2BvLO4zwNDb6lrqxTvi0UsLTe6%2BnZtrbgzrXKdYd%2BpPqfHc%2BAhL4SNlfVUThZ%2BHGA2LVfyw5EHqzt6WM0HnjhRlCM%2BRkGfPqQcl5qdflh5tuHzXE9VbkmPjZ3P%2Bgokd98zV%2Btf%2BErOYVaczR6TLrQFETmkU4m4HuJKVFMdq%2FZuJZW0nigp7sj%2FTlPqA4Vv1n9d47P3t&X-Amz-Signature=69eb711751ee155c7bcd5bf694a44852eb4e4d442b0446f10a4714e712299ff4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WFMBTBXQ%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041733Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIB5vB%2BaM%2FUhw96Q2tkr60AuqsJnzFnIAo9qtCj78GZKGAiBEUH7hgfGLlXSN72HVTY9KHTGJWmkvPD5jsUv5WH%2Fu4CqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMoums9ZUKWsYOSwIGKtwD%2BUdHY8uG3bZZIZfPqtAn8eDjE9Bh4z6kgaCt%2FK3V2NgjQ8TYg%2BG1pPosCH9jSKPpTWHqzB1NDKyaz1zTtvz0rXUOWarVN1iu2t%2BRmPGzofH7eS7QGwsjoh8GVh2kM%2BdYK86%2Bo5w790fWWiuQImLgE9bTvkEAiOiyOAmIXC0Vx3nUpAO1qJ1qgeV6mKbIefTJGbIM4FHAaAizVZLxN0IUb2SNNrcIJ3e5XQdYuf%2Fc8kkikoWp3aNb4IU07BiHC8ibawvc6hQl72CWFf1CjKil0CoGc63CsZC%2Fy6jHCTeN6IKvVsR8i9xqg9iq67r%2BXp3KZ5BNSJNMxVFxmwoe19XKWsMBGWi4xUiLve%2BgTSsvl3MIhWGq7N0JujR%2BGYLMazz92rd4nNWANN4gDIRXfCMMLY7aPnwQYHxXFZHcgLOrE91HAY1vBwXZpm5d5a%2FLWyFEYQB96KeLPqLTJ203BItqsIZPPkhPDPzszPlKu7FkqAtBtBT7z04JhPF2kvkr2SneWg%2FvD1DjKFsti1HLsvmGf5QweJqSxH442llOvPTx2oBirVxIgmWCiIobh3lJmKUGRxnwKQKknrYuc6mayYGjVjAPFZ%2FQ%2F1b71KbQlqdhnY4MCAuIg0GUzwcqHXUw6aXp0AY6pgEylnyDGkA8WjVxw8mdclhAwtuMriacBeS3rxR4SSeUXCn3peqPGMoLUINVaqWUYCjvIIQvK7FQBi9DTlWrZ%2BwYIF%2FjI%2BSRmycFXtq6wC%2BWRm9LwIgh%2B8A45rDdJEBNYyppaxBVcKSuYfU0A07%2B3xp7iF5AMU3D5Pl5Z5cKSSOVS%2F4LnHifmqGX2Z2y9fdYTEHgrR6LJBbe4%2Bh32RBauJmaZfBhnNz3&X-Amz-Signature=a8a5c7f1be368a5040a1e18a21d7ac517bdfd6e696994120711e019f5e483e19&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ZFQQ26R%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041734Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCICCwQb%2BXriTzXp1HLod4fW%2FCQXyBxSJldcrNiTvQETZrAiEA7oD%2B0HIeNRzIkbBhvmqq4NEjjX%2BJDNpvVcMRdRXGVNAqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLxYlNCyMqvqeehXayrcA4uVLZ2hVpoelDv%2BnkP9YVvjQTEDF%2ByPXVPTaxSEH4fpEqeM%2BU8aH4oIwtRqFYDZ2QzAEgVxXjOMnvnDh1B%2BiCqiWedxtkzsMDq%2FB4UgOTgZoKxC4QV9UykMLxkSFLI%2Fm7pUH1mJLWmh54fiOdbPz5XqVMfHdI1i1mPW22zC%2BvA6XdqdJeJozU3IsshxlbzQt0ptz71qGCG2Q8FXTmHpVk%2BFy23MBwRXvQ7%2Bja4%2BzOQYgAmRm3NlfGxmS3CoMGEZaJN2dOOe4EYrfZxUmDz2U3BpyoaH3jdyh1W5259WXHJEaGlYd7Gkl24vqJcuAclnHQoA5fXAMABw031vaADOvwqI6d911yMHVYysFOf2gmlGInYD38VhwMhXvcd5f8WQU2JhalSyzuSalMlFVRFL2KpCuc3BYJlui4dg43TfvnpmEuv8vsmZuk4w%2F2o7HPnucfcn8HwhBMRP7b7Ix%2FD5dEdll2eV16OfgGTatVppvtWTvQLFrwSMPJBYsOa4LUDwVSlE1zGDMab67%2BkiYhBtHWnqa3q0o82jhXq%2FxoVNVbu%2F8kJQkAf3TiBhw79KTYMQ%2BZc84gytSG%2B2MiZ%2FUboJ9he5VZD31rtpaXuOfhzBNAtvMvKaWZONlJCt7PIWMJim6dAGOqUBvMzQfA%2FqGhhBzSIk1G9NDRblSuA1ReneeUnBuPjvESEc9ZLd3HM2TUXmumBBFOrwMIfqj2sLHMPkI2XZ1idOjm3t1y0JK4SPeq51MnONBRjBpKfeChD2YbkoIy26CnYJ7Ywt%2BAvKQ3hpLKJXQ%2BKIjvvliDbrNsCUqXGtrM9uwxS3kgGnMVL%2Fb8g8c275U4Iaz9OIZUnXwaWMxuSmRm0hGIm%2Bqodp&X-Amz-Signature=769d751bcda88ad4629688958f838f88a3f6c15514285d28c62249b207d8c182&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XU6JFNPL%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041734Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQD31Dm1rtdQe5IEeiyJMnSWbZwWKXpIo8S9wi8Vcw1n%2BgIgGRMl0i%2B6I8hqT99sZU7IppdOBuAnQoYnCfLalxXwlRQqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIHJ6H3ZU%2BjDxzngWircA42ZbE17aUC%2FiidzwIsRJ%2BryIJw5HY9m9ujAL2BNcjBLUn39LWtmX62SsO1z1ocVWH0UDOGOoHW3%2Bb%2FEdE4CuoJZnDOc3zSCem2uTUrvywjPc6DgvRlYHqgo7qDIjHK3mYTg8AAM1%2Floh2tLJnxLNzr8n2L%2BXCzzr2jAtGsi%2FWg5anFCzv7Fqpaz1LaGuUwqeg%2Bm5dYdb4FiLZH7mmbH0vB%2FBODxsUQv0dGpPUTpAA5LeHX%2FU7giALqe5eZTRToU%2FK4ta96B5kFjQjm17NX4Vus94%2FlikHbJx70cwFKDWz63Wvso6aifHK8%2BzIgDOM1jYBVeGv5a6QWQZK%2BbYqDGr2w4H3q6lS63t5bOTtIl%2Bog9sl9yU4C9T8COt6L%2FQ90AcvnuScLZgGcsb7irKJY4hVEMv3bykX4W1BqxZTMpmT6l2ULqx652L319lTcSjowHO0Mg0EZUkczgajHwz4uc9u6sY51QcEPJofMgAiZ13ful4ZBF8zViNwY6YbTxbvEaxdDeiKlYIrpHusqhMC6D97jLkvTyAKKXMmFuuYW7peGNHgJ8RGvHmBSAoWVARrEN1fouLCZ6PBSaFpkV2FBuWTxNb5oEZ%2BZzQgg0T%2FoLvgZARHNEryBmWfNlSm6yMICo6dAGOqUBRr%2BhkIuskMUVn9RIqziem62HR%2FgpQtizp8ZYepMYol9d%2FyA5HggPyji6KDyi1wVeZhEDQQaail9vkPr4QJMtf2N%2BBGv6x7E1lL1bfXWaRPUNZ13ctgsaNqnYl94OCxDAY96lqrDANxx5JSeYEGFZ%2BZUOujGbhCcBlj0nIIO4u7DkwB7tA6zQDPeTDvq9Gd5AObKDWyLkrAxYOL08v3UDeWj5iQ7i&X-Amz-Signature=e5c934cfbb9144b77fee654fb40a3c402f75f0a16bbaff7e2746ba9d5687f7f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SV5GMSVL%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041735Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIFlNw5MFLOwZKEmrpejnUrmCI4NjNV4nOPOcCC82vYtdAiB7x5GsclHWDeS9xi9Fd5hRTQmoDbGO8zutY9b6o7pXNSqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMtnXMOQgA7QQdAKFGKtwDcqtKeE1rBFKRcicdcvp9R7kKIB4yZWjiYVubv%2BEmpLcUNzJvRDE8pkhcqFNAeaI1Vo%2BHblpRfLkh4IaAngjFDfxwc1B5f%2Fqsiixh93eo9F34w4tGIk6B%2FKqfGd9As7oo%2BcumimhNLavtiaYWb9FMmc2W7m%2B4CVR4XT7wze7yI0FLLSr2x%2BYxqsv1GybSVc3wyaJOSeqCVXZ6FMeJXUyIr8IueZ7e7u81YW9qxtsR4WeImKiRewJXVL%2FoeR4Rz5RzgLtG%2FY5FGy2WnBaD7YVvQdkwc2Ul1jOlN4qfmeg8nZkYFphf9%2Bsm03iWu%2FFFNdtdjla8rEy6y9VF98T7g1m8nGSwaFzN0ZVRCvtCn%2Bfiqxlh0h6adIEGTeg%2FA%2FGEl2aWEucX9nIEdkfzPEomL6p28bzesq%2BjgBL6x1yfDus0QRYqK3tLEzeTPt%2BfUjO7Ds%2B4rSTScvCYzQFiXoBsWGT1YsCDU6MdoPGjA05H94ILrpK1meWxaDPloRq%2Fjzxun3IOhOqvwG1uzhM2gKnqRA64R5HHxIdkbLydW%2FlfZWiWJD%2BeZODytsFWFw1Tup9vZ9kRqBW6%2BhJxrKzeqFnyzKHWoZ2x3w6zfbjFTJ5y17088drUb0fdwtuUxoWmLbIws6fp0AY6pgEJBEd%2BvukOt%2FhVfQeEfeUM6c63POzHtNWsljFuVjwCOV1r7gN5QsfyQ2906z3b7%2F3FpRi915VqEdd3mWrO%2BXA9FYXEpE2tYoTlltvOBmlU8t0FzvEaTg10iYGcbYXhSimlkThDL%2Fr270%2BwKSSuzsHX2zuH0JGV6VhFmRykEG2TXhbSf0lIx4GTp41auZIGXm%2FGFguWXc9Qk1Sbw5Y7svOdVI%2Fivqi2&X-Amz-Signature=9962bc29387e5bb3e4a5034e22d1764800cc0db4cb55106b0f70c7dcb533b50f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XEB2TRQU%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041735Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQDgWUp6yHPNrB5e0PoSv2cB8Yy0CbC%2FpQGefnk7%2B2ahigIhALKxJriDKL1Q9nHoqlWpDm6SmvSPaxj46OKlwSAu1wYfKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyFcFoBq%2FTqmGwmGX8q3AM%2FFgU62NqAOZzC4l3HZzWc4g3t9BX4V5GO%2FDTxDYdu%2FEmQjV728lyT3L4WU%2FccITmwnvWeKn8kLwUw9rzQlOhIQGUFQzuPGPeplvQDPt36iqA50vmHt%2BNg3LmPDlElDXC6ij0dBvME8VZYOMYz9QMyGlPhO4b9YSA7wcj5RiHwsf9RlqraYmXJLTbY7IXZp2zS3%2BXHci69Ln%2FdytKcRyDDkBf4wv9Nxi8AYtMxM4CCFVhqFKP8ZyQYPwnGO%2FVho9sFupO8G9akazMf3jXpqhVWb8M2l%2BAF6vt6SZrsvaSz5OboCisZFiihzQ5%2BPUe7Zx5vMkwipWihCEJV5XsV%2FqAWqoU0igjg4UxkI89FvFXD5euQss4Rn2a5nCGx5%2BIWmivJHmL1VZeE8KE7PW0fkKxQbnedVDkEoz9kSkRiieupss18Chd2bhH2vJSeeQy5PiVBD2wq%2Bshv9yG%2B7QtC%2Fc2PHCSggh%2FCIi7ZKOC%2FVOBAobeOILrU8YdgCgbB1WilaIzq3LPcg1EFc0XYqWLCYhW7So6RLVaLjZZb7Dr3imL%2Fq0zZITzAADcwgBMFgsZ9G%2FCMd6vHVN4XuhG%2F0zDozkVuG%2Fn9oyDS2Gn3NU1tg%2F%2FAf3dnfq4EOOtAbMyLXDCbpunQBjqkATZoGNjQSajTirBQjfAkxHf2Xz6V58I%2BWUwSPsbtRTp0SPgPr%2F6FXF1k4DYuiAXPUEee8V%2F53TVxJXaZ1Z4lNS1cFhyOzO1KjxSA8bClmqsypy%2By2UBSjCF5gDRD3EkVDoZxeyiPKpTCZ17qKembj%2Btv94YdfpWgIvhcV%2B2oRmeP565mPZ6Mpq7c%2BvjnM9dei9YtxUMPhd6P7GtRd3cGOgLYf51n&X-Amz-Signature=6b0784afa02ca6a6d146822be12c9feac14d193a4ee6c8b0ccd32e8427a7a6d4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XSSA7GKT%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041735Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQDNlAAPKdcBLLLZVfpWj6hf1LV8xFga7AzBn3s1xbCUeAIgeGUWMPvGqIr%2FTvfBh%2Bhbdgfk%2FDYOGgRwnH%2F67vIHXNcqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDECsh974%2FtKDKeHhQSrcA2%2BICZ%2BtsNVP4B%2BQmrQ6h8vRShvUtqQrGQmSBMvkDoiM%2B%2B5zs3x2O5FOeZ200BZ7amvpeMt8PIYGA0h%2BAA2iqu8QuJrL5jz%2Bh8T8MgLfZte0sJnhd%2FbzNH3wO0jU3sfIgoVMtQ4a%2FTT%2FHCj6%2BuIDkzUR0kFjTLUx%2BRHmkC3DvOW%2BO5MYDjqtoA5GaqVhUzlwBWNe8HNjxSDlyEA9aGWCdtyrAakZFxDxzPGN6luxHaCDhul5xCkth1OF5ccJJ%2BZllFV57Wlj05crqZoN1vPrFYpCfIiBAu7j3fB9%2B5LUHxeEe6pQEHdihuc7R%2FtT%2FMoSlW0GhJrthxyPqcNoUPdh1mb7oW9yBmV%2FClkkJfIvaw8nJjbim0a9aBEzKH8LdKLmI24Wcf77%2BConsEA3u81xBX0FDgE3%2F3v1aHhaFhU4ZRdz9K%2BxbJaAguI8tqEFXg7YeYvRffPDxOlAU2%2B51OGfvWlf%2F4OxWr55w8%2BblOcs6jBigCpKm5bBxGx%2BCgH2XaDBnSGjsFLYECfGJpy1fFe7itH%2Brx85z2PHeMO1NJF72aXRdfoQPKc%2FWDZJ9Wgm7IqYSDDv8MaXBBMt3k8EsEsXNpm2RHezgUxY5Vgt5dhgSBAm3Kw57WCbcCZLt2UaMNOn6dAGOqUBNR%2FTWDujhD0z%2FUoC2MjE%2Fn8dw9mHSpdPcsqvZeFC23ILJU1Kzw7qIaSEbD9M2AVrBxwPqQ6XdSJC0rBm4VfzUh%2FCkpfiK5XpzfOxaVQVBuaAg7pU2JGuwec6J7QWlWyE1B9sDKG7wo8flGV1dYl96ZjTFNcFtQgFCwE%2FnzKpfbLy5iAX1Kru%2BqldjDqcq6GFq6iyiKE2%2F%2FxpY8uh8HInUe9qVm7J&X-Amz-Signature=52058477b8516c0751974268cece7d61c24f9a69ab6b4d8430674c1c34399539&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662KXHOWQ7%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041736Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIFm01gNlx3d8CGZbVxDtNFoZ6KvJsebnyuarHrOS45qkAiB2GP6Dw829EjSJzVdKM75xXWyHGnKuU502vmyCnagIuiqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMrnGHqn3MR4CxLCEaKtwDywp0XvbK0f1bQSo1SYzEy8lsJEI5Ck4CXi1SdKEthyVtR%2FYatH6118wFKS6nja9PenqUMaLaHfARHCL4G%2FJQngcFLXJ2WftmeI4%2FpmScpB5Hkq8plQaBFBloPvNeSSAEr7mtG3yYzsUyhnUzb8lynWPf2MLMgyPoz1K4AbSuxQ8r%2BZc5OINZYvM6%2Bqgm9CIzQFHYYCdeEtvGJpWiGLrKmgFBlwPHPJXm31skCdhu73bSejv8MPzwJu0%2BxOJL0QeFMthXIsbsrH8J8qZLWtKRBhAo0ToLOk%2B14xwUOCxwJ%2BVisjEi1Rz%2BUMgEjIPGrTW%2BvWBgntbiqANb5A%2BmzA7Qi0pDutCLba%2BiZwB798TMiBm1R9im0dijWtis%2BcGSYahA5gRFZkuEfUv%2BdZ8DFpnPOkJdV4WxxYKg4vXy4T8w5Z2dHlVb%2BscE%2Ff28fT7kO0WilxY7KY2jKwG7eBhX34%2FMvTyAsIsQeenc2v7jlj%2FWlmS5LzwHRQz1WZy41eIut%2F9YavEedVBAEdjSDoKkNWeaJNCJ5UX2bhOkuqvvLcOtLWpqTUKhoQGH11ptqWww5uB72Sv3QDDTJozCHLld%2BbiqgwI7Q7dCS%2B6LX4tj6DXLrJOeJ4wy%2BbPiDjl2LJQwyKjp0AY6pgFGt0jWrWqGI5OXMLmBnXvUjAIWfl5632VHdeHgnV25UKLb315MaDgE76f5H6hIPeyHeU1qTUqiqFOyeLYjWZSsyU872oQwPOF1ukztBj%2F5bjiFwjZnaBv7rubKBZkoNQfcB31FUC1NmlCxkAwVzU2%2BFIEdXaMxFjixyIYGMv8qr6wTSHJ5VJw91p3Ud0jG6TAK9bMbON8hKSQlF7T0RI18QdmpkYAl&X-Amz-Signature=e1231835c2f37afe4c7d26f6abb23cc60193c4cc329ef449af0a15bcc9a693eb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666CLX65BE%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041737Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQCZ2XSXbZhfZYqrlLIcqMY0vakHiCvRNVwRBWMZZ3ZvIwIgSGoF7Xtlpc4OfR9TPmBk3L5mn3TiE3Mi1spI8o6mM%2BwqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBAZxUIjclQ5b4goCyrcAxoig76P5kFhHnzw3fKj7Y3VIXuOpX0QVCQWGKCWfUV2jBL1rSg9o8ELy1xgsHNpvRnc9vXqFK6GEp8jE%2BkWE%2Fx%2BjU%2Fi9VydeF%2BWFkP5XaOKBujNIydAQ1NrYij1PqpGhAWj4IbYJn4wWEeu1BdAHHuYQYJKzXhbouarI4XPs%2F8X0eInRIGVN5t7vkEG7mQyDq7YnpZ8GubOWgUtV7yMyp3XPj2XQUKwVhCRCx0w1QRhzKF5hRYXXNkGg8QhGw%2FtAg2OEe%2BiAcVZQ19RFLOFFHr9ngreIAgQL2XlkRTpYonJ3azjnu58%2BbFAjtVENGfdgzrT1TcJFBsZqO79%2Bxfr497rrMNVV36QZ5Y36%2FYC4tb86u7dSBi1TrMGCpT92eEzmXqrSZB0ECI1Exo07c42%2F6F%2FeMrtPTyETqscIe%2F4nOXHlS5SnPyvtTTGmqHtkxLKj4UwCVkZb0LGoW8cbYJJr0fFncAeE6XKaxfA0SQxrR%2F0GV%2F0En4JGZNNCAktYDPxW8NzhC7FblVMinGJKYZWNRkaXp97dgRn1rtN%2BuVuoTP%2FOfPzEzCOxM807oWM4bqEHoTfPx2z8n9je%2Bwpz67HA9sKkDQJSnjDKyEVwbWY5PNTOhQT%2B42QjK7tGVexMMqm6dAGOqUBdoEFJN1fXDfu27EMJAextvAyMWCRXH%2FpspQH2DK0shxMrPL6tbfik9Jljx90RfdzUf9%2FBq14ckSzGWzf9bP5D26nTeDVe3W1Cnf%2F8A7WpDe54OuV%2FGHjR46pu%2BUKbFQ69GLOG82eSer6sKT2wzl56reR09BrsJzAVZNUvFx7bBDy47e6VMNwqdFNI08zKAzmRNF18YaHIH2AocJ2v7BnMhkT3UuV&X-Amz-Signature=506dbe07e7b0d89e8d0ba1e084ddbcc677ca9153199794a5ea8dbce06e299ed3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667IDCE2YG%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041738Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIAOMPHElQBJ81nREjn5BepaR7KsgzEV969ebyGgZBgp%2FAiAHDzRcmNKNoM2n4RKEfORXhl2O90JI6DGjXDcmoWIeLSqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMXeY%2BXLQ%2BKM6%2Fa%2BQCKtwDaSU%2BwsBswPjpA5lPRJ0vofVK5NeTblpFuCVXH%2BqMmQpnfLg%2FGY4Rcj6zD4Sn6m5G8EnWvSZCY8X6ZwdVMG4D7C%2F6kMYzykaNAo1TeAjVVd%2FoUNZS4mJAfEk%2BW%2BhWDv992B4MYTZtfENcVKof%2B1i4pUXDiWQWpmLMc1ILbJ0QJv98W86PEpIU00zht%2B2YAI5uDQZ4fECDvzd%2F7UbxHHa0SRWqr1K9IJgKQSrpIJOOFq8gVUAhTEv90EHOZ1RYNot4p96Zit%2FJG6Ejs0WskPyJIcS9OO6GEo52Y3om4vTWPWvLx2flCXOAg0SzemkXZnKWsKxSvfD67yhzKhOeoyQEdZyrU125jTZML1jrXyXcZMAPeuKskSLlDeoGsXMG8D%2BJadswEaW3k5WEx99xf%2BzqofD1JIkpcmbGqmfYNEswC%2BzCPQiZhRGvWDIIoZj4P%2Fh2vaoYvA%2Bwr8da6clFrFeTBcqog2Fb7pNfTlD27BCtzUFz4SBNap8DbpRV4qIbVTPEstOg8DdS8PkSEgP7gkOArLLQkbDiF0YswHGv5eQmBi2MyrOmfwLncgxUEQAf8%2FbNOy7mo5UxO5L7cjg7%2FtGv%2B8BqB8dXJFb9MGDEZvzXDL9%2BY8HubvP%2BWAYNMVEw5Kfp0AY6pgHAju5KyGBJkGoTM3aiThv1uuOX0c5tGadhHgJaIP4CtvOHCwlDrnel81ZLSEdbyDOOD9oN7H31V8M7jZqrtGSgoMaDkzOK%2FG2FsTlq%2FFxN%2FmTWM4XBGIMtNeN%2FT6BvKvxVz6t4bWH4eqyTxXr%2F49Syx%2BwVwDmNQFZYVJ4EXNSEx40ojVLYLvotk986%2Fp3nFA5kj%2FeiNPlGUpDiOjVyEkg%2FYBtPk5Tw&X-Amz-Signature=d74bf7f0c234ee061d28b4724819d369a1e42781de027bcd93cd9e09cb8f40dc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664424IU7F%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041738Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQDrzYE%2B9%2FQVncvAOpKXHFSkGpWGU2R1HN7aKHGUBpEgugIgHBzJP2qQAOZvNZkReWmkpezwfq4blFYkxymPl5%2B57QQqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDONKl774UF43TtWRxSrcA%2B%2FdKOPZH6DZ3WCYxedgxRmtmGocCEnleLhr8lyNxTIQ2ZV3%2FCLjW7AwX%2F2QkBQnfZmwUq4clyPd92%2BB4ZT%2FR4O7qE2YZ57yijBTOISDCsdRXUFzF4%2F5RSt9M81zV3G2wn1YuIL2O74ZEvCFroUcU%2BjqpXOUjdYdaoyQK8FVUT2T0ui6ep4c688lE48Fj1Eiyy1SvaF%2Fx9l6LTlAEc7X6NafD9Na7Tz3YAjxHnX%2Ffme6l3QIhthpGfaqn4y8vfAf8W0dvQEKNxzHnNWM%2BAyMHIvYzR3aH8YmhHpOAUBnwwwJbUcpcvgJcRa4SktYO7lKuxUxM7adP3Ed4jfcLXGoPPAxfTVU%2FrH8I%2FDL0ZJs5jWcbxcg6jm7SPP%2BDOpx37rvDcLUjR11X%2F4Dzlqk5IuHJ5nY71Sh0fDGAowzKdrYSV8%2BN5vNIj6mi08y0s%2FPjUHnA1qqy8ISVAERAJLbGitU15RhCXzwwq54q0FE1x1AJIo3F1%2BTrUgH7dgnBMu2vKLX%2BtM4Jpu16yuLgXHKHpveHHjsQMiGR2DOmDnbQAUjQAD2tqvPGjnYbjIbt5mxf%2Bcikx8S%2Br23nSAqH4xw9TEiuQ6AQXD9mbvvrDJCsy1H60EQdRpDRtSeO%2FKIcSdJMJmm6dAGOqUBtUi5TytMp3tC4lfxY3Ai7N8jOYdmzZnBZmVex6NeBstCdxJVW3NTveY%2FK96XUDSUG0j9OgvCkErZTSbFUgFRwp5UBOVscehmbyeaPfuEIW%2BPm%2BnojrUtgP3UplXe78UnZ0DEPuYZoBagzs4G6sYgpAnrUueRyDgHVzeaTDGIfNUzMzG6ZDkGUMn8LfiZTSe0yL29pNU0MegoD1Ye%2B2Gx56Rdnjtw&X-Amz-Signature=912e1945ee985edc5900c61d369a9ed1c7e651241f103705227b67d16959be48&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664424IU7F%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041738Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQDrzYE%2B9%2FQVncvAOpKXHFSkGpWGU2R1HN7aKHGUBpEgugIgHBzJP2qQAOZvNZkReWmkpezwfq4blFYkxymPl5%2B57QQqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDONKl774UF43TtWRxSrcA%2B%2FdKOPZH6DZ3WCYxedgxRmtmGocCEnleLhr8lyNxTIQ2ZV3%2FCLjW7AwX%2F2QkBQnfZmwUq4clyPd92%2BB4ZT%2FR4O7qE2YZ57yijBTOISDCsdRXUFzF4%2F5RSt9M81zV3G2wn1YuIL2O74ZEvCFroUcU%2BjqpXOUjdYdaoyQK8FVUT2T0ui6ep4c688lE48Fj1Eiyy1SvaF%2Fx9l6LTlAEc7X6NafD9Na7Tz3YAjxHnX%2Ffme6l3QIhthpGfaqn4y8vfAf8W0dvQEKNxzHnNWM%2BAyMHIvYzR3aH8YmhHpOAUBnwwwJbUcpcvgJcRa4SktYO7lKuxUxM7adP3Ed4jfcLXGoPPAxfTVU%2FrH8I%2FDL0ZJs5jWcbxcg6jm7SPP%2BDOpx37rvDcLUjR11X%2F4Dzlqk5IuHJ5nY71Sh0fDGAowzKdrYSV8%2BN5vNIj6mi08y0s%2FPjUHnA1qqy8ISVAERAJLbGitU15RhCXzwwq54q0FE1x1AJIo3F1%2BTrUgH7dgnBMu2vKLX%2BtM4Jpu16yuLgXHKHpveHHjsQMiGR2DOmDnbQAUjQAD2tqvPGjnYbjIbt5mxf%2Bcikx8S%2Br23nSAqH4xw9TEiuQ6AQXD9mbvvrDJCsy1H60EQdRpDRtSeO%2FKIcSdJMJmm6dAGOqUBtUi5TytMp3tC4lfxY3Ai7N8jOYdmzZnBZmVex6NeBstCdxJVW3NTveY%2FK96XUDSUG0j9OgvCkErZTSbFUgFRwp5UBOVscehmbyeaPfuEIW%2BPm%2BnojrUtgP3UplXe78UnZ0DEPuYZoBagzs4G6sYgpAnrUueRyDgHVzeaTDGIfNUzMzG6ZDkGUMn8LfiZTSe0yL29pNU0MegoD1Ye%2B2Gx56Rdnjtw&X-Amz-Signature=8483b3671f0d93fb909be1268d95de75798261d64c72c199755e967c22debed1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
