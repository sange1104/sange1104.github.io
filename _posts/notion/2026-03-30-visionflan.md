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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YJLLMRON%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042332Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCXCkA%2BitdB4hEVpkTtbiVYt7SZW41YUTsTZukEytRObwIgc90Iy7fIqnpPz0bwnYLwG%2BxMFiHG2WMeppubQ9Rb3KQqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGiKLRp98pjZ0AJiCCrcA7RbCVP0bDSrzhHbnqkMI8sHDZaIpl4uRBe6GUYeCPhVgrs0u7Upp%2Bmk27O3z5s7dsbaVVuXi7BcvYbCB7L9hgxM8KkoatvQ5XgTiNFFnxIpB6s9VnBMs8rEasOZ8B11OeUslZFny4kdOA7T9R4UgOUOSJKRElVeU%2FfIAj%2BLrTGyVTvVnJoA%2FiTYZEALEBPtt28GEHQv2UaPMAwv%2FFYyFjGlwyW7vzoINjFAPKhcJcgvjV9l5S2rp9VYhElcsV4fJko4%2BjIPbeRhFp%2F5IBBzueQtsa6ag1Xs09uVcmUQAvUBk9IeXoYp1tMSEETb80TPakg2Cu8a3uuts%2BD5Sx0KNYYX83cyDEbpcVAmfqRcqwbuVg2TTV7jHh2IuY8KwuuAhKa%2FfmXX3o1RilJlSvscv86HKPZS%2B2lKzt36IKGjCft4aDmqSyCNDXTz6rUUU7oAqhWgbBJJaNK5VqDZtnY1jG16a%2BE8%2F%2BXpqe3uBIic95HSzfGFAziMaq44sV8ZG%2BJ4zJPnxYc2XvsoMbGOUUGjQsERZ3wOh%2FW3Etkny4CxwrZ7h2TUfqcc3T8yTCqbn2m5eQzcovMAOfW4eHG5WMrTTElnwjRBCh9YGQBwE1O7psuAohv1gbCCzty7VQTVMOaEntEGOqUBeMOHgL4fR0gZqgZTiwwfB02rdBun0%2Bq%2FKdXtAGyPiXmMwXUizE5UdvJWBFw5wI54UBtftbQPfd8S2%2Fz8zWvTHa2Gr%2BDtGRrC1NDCafc0K55C0VCmCn0A2DoG0hRIXIWY7qDn7avI68o9IXwjO5aEAFBmX%2FgB7Eg1rC6U7DdM90589LmcCHmiUMxqD1vPWzsKeXV%2FkPH4ijpQPGnl4Friu3URDiCd&X-Amz-Signature=d4f83bafb4f5b8b6005c5feb54ad24ec7606d6a030f463b677604b26b9688c18&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZKMSEVWW%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042332Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDeR2rj2yXQy%2ByawjyN%2BBu%2Ff2zRnH4PiDVRe2JTe8vWoAIhANxagRfU%2FxygZoxK2YuZ25VeQVexsWxxg6XImCf%2FcIZmKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzMX6TI4LdqU4ZeXQ4q3AP5R9WkaqIqxt17%2FswU3TmYHab0UyTR%2B1cji3WvXWgj7FHclJYlUeg6XxRSsHLdFXPEXm7yHQ2aHWzwkd%2BWQw5%2FryEmNiLUsqWyw786uhCL1fC7%2F5u4D01Rk5vH%2FAfF%2F3nx6pyxmFV%2BpAs%2FxKLGR9Ut8nIKlxHZZ44phBdBvs1Qo4Z8oKkjOnNCovx%2Fts9A7C0%2BbL9r%2FB9UUv8cK8Zee53rTZweyQWxD2nNgX7BxgL0JzF7UsUyT1peBeO7%2Fr5dZCWxhYaUdVKqbyy4QksPtkS6bjted%2BqPAjBJPlJo98ysMd6Kdvu7aTJ3LdnQihgL4%2FK2Gwm9XQPVaCwxzLxoTV%2BHNElxm0HlJ2HoDc%2FyUq%2Bh3ppXw9SNqEL9pTVk8fm6vax6vJcS66XOQ4uLrNQqkv5jLfLRKIKhxWJQ2bZwQNiE7iTA%2BkBU58a6K233uESh4AZkVADvRZMztK%2FeArCXEOp%2FdZu25YqNDtpFWGj7kx3dka1itm9mJaq3sZz0tFKW45IptGNjt7kfe%2BFQ1wPHttzkW%2Bw9jXWvmbjSVpx5QNbGleP1M6KQB5FFedmnvxbk6USgnbB25H601uSVCqOOb0po471NT0%2BDQgBmySiSQ%2F4kgbJNPhgsbkE3RB7ekTD%2Bhp7RBjqkAdcoBL68iDz9dqInofCGdNZoV72lFwQ0oEBO7jGswQJafDGDpNn5X0M3smEY2tPfVgqZ3xjuCUD3mNiIaZqiRs0nOqG%2FiNWmnCoC%2Fgyy0CsZ0TjpTSOMRqYOh4ZW%2Fw4Nxns%2FgyROwYXGsZ5T8gcLJDrw2PY%2FwFXGYrXVizlxVwJq7ddMjqq9if8ogpzyiMfc8Qj6oYTKrz3Zc49ouLial9CpG0D8&X-Amz-Signature=840c1fa7b8666e0e71b517617f0ac3f9719fc8b951dcbe35bd1ae1325b2e04c6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U5NUO4H2%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042320Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIH2FDDSwohqHcU3GtE%2Buf0Pp%2BelMyL4wu4KTEmtSN9FtAiAz4wyU4zEjnwIHx63VosWwm27NU7b3ybgAA3diNxn4USqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMhe%2BlLjU23h7PXCi4KtwDk7nv47%2BLxRqzkPThYdZoJCdvsAZqWeNppg65CvVvTfQIvHPdZGNft9%2B3hqmA0vPj0O%2FbJpuaP2PD35SYDG9PufJ2eSV8AdVhG2wOmBJ5x3VCIDqx3qnAryBPEGFqEYoHAl1o0%2FJCe9CWVYF3U3yQ2JWBVGch7g%2FE5tMeQ0Ug9gltEr3%2BqFR1Ajn0RJEid%2BGzD%2BiqA9B6Wrh44k1LuA44dvT6IwPFlr5m0NglJ%2FfcNbcRQDEyHDIcWEB1vSim9sUA18GeSTWbeTiKKWhQTxs8ns3pATWsSwhyviQ6saYF65HFTgJkvK%2Fl9tNFJAbQ%2FyBOs%2F8l3QOXb4YZD6M1QVXiQzyEOHnU8zx4dW%2FjgRsaaCvkGHiPWnwnCE8KwPuFji9pHyfK0e3o9HFhpNDOXu2D6khHKJH4LgrNlhChls%2BCBC%2FIy3MaBf677zIU%2FDLIdx9ZySVK1TzLS1jNCh%2BfalUDPKKyr8PEqni3GEabzpGcyAmFszB5hqxgDstG0HJZALxMMuH6uYUEEF7Zrf2RkNTh9Q7uZqC%2BYsG2ZDa69o3fe4pSR%2FiKbhbmNnJK2GEb5MQBkbzR%2FQ1HPYs6A3N4d%2BbwSRZ%2B9LIqklmjlxRiXuju5nB0HNnbUM32dJD3UKgw5Iae0QY6pgFT%2B0pNs8IaGgOH6eeRM2NyYDsYmvf6ybO6lcp6%2FUqEAHNC4AEPHcm8nlpZ%2BKkn6S8ekg2%2FHS73nepxGQQIVtaFsPQI3gQPf3K07IsvkUMpL8DxNBkOdBZOua3y4wzg8UvahBwyOBBiCAh62sYPOi03UybkmORW%2BHyN%2BfSBNPSp6YF0zLo2E1EAsR4rMH9avkQMhcou%2FN7aPPXdsILZpUzUkmH5Cbk6&X-Amz-Signature=60206061b98d58ae10d1d00de5c47426d3a977bcbef91121591dab2ab7b73846&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UIVJKXFN%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042337Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCQAiQHBRaqSynsad3emwpUU5XbCWhzgoLeraXQfph5lAIhAOagbvp%2FPWsE4IyTktbefjreXZT0p3lLW%2Fy04nN4rXVEKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzaO8SI0Coe7ZPq7tkq3AM7gogpmXRUI4O1ss8n6Ect%2FUj8QPCho0RlWYAs%2FbEcM1b8arZ5HZxRKjIwdX13Z%2F6ixCd3%2F%2Fh9M7ugI%2BUMtM8pXjPzXdjnrcCUc2KXcgKyDKjV944MBrTaNHBdwisBjgMkclm%2F1IiYVpso7%2FgmGPYg3iudKTDh%2FAdMu5En%2BJshD8rN4gtZrJOWRtiFpF6G7jlQFgzgKIPK9UEMFsEoNJHE01uYf8Pzv6TfIabEjjGdnWI9Wt13qP15%2BpIaeesPoWJJN8AJu9UK25SOC2r4YgAXY0XBox%2BJHFUwg3A55D4h%2B6xQe6Fuzi1HVuPDTOxbB0oPXtdAh83EobDIw1IP6tuJRspGGVy3LzHgvWc%2FT8LBycT7QgLq6dFrGNvUVf1Qu72vevkuTXZvqyhDYeG%2FeG8RS8H6b4Ml6TmZjN6XV7tIN8qwkQuEd9BskX6PwbGlsodlo4mwqOxxIpyuENidohgdPGGiCf6uppmwk5anijNeIhfwPpK0ej%2BFP0ZHj3POzu60Qkq28Rpf%2Fe1wH8j%2Bl0AMx5VRcq9BQtrJEbxLF4bRtcDKklM7KkaPSvlXYQ1eypbpkVAFr1NV1Ua8sDaPjkSlHL0XpvvebHRHrl0z94Niuu5quwlJ7Wan6dePHDCWh57RBjqkAaRiGphG2dBGtqtHE0h50rwQky2YP7E1jLx8EscrR2%2FgJM25m3uQZSzqn1lJGe58Ul9dtzhLd5zuv7Tnn1uaPzElFoGUVhoTQnbL92OtC8oY1%2BvE6uVS8qF70s%2B1nj%2BWQ8nilXwYC7w6bEuoOu%2FSCWh%2BgSGrK6nkIyskKIhKNmqqui7ScGZnUSGlG7SQZ%2FCOW6HWuxqZ1bZalLOnT9FUn7uC5UlN&X-Amz-Signature=c79015ea32fd10964abbefa27212a5944b47ad8761753befba382b5d9494f8aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662IQLICJY%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042338Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCQeQ%2BX2uh78xxDl5xOYoDeEC2lU11uzMs8p4KRGARDpQIgQeshcUtLYelNQJw02bMu0EP2kTqnnSSeabtKS9bT6PwqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFga8yKdBnlIl8KppSrcA%2FbdycVRcS5%2BKA7k3SnNokr7DKHAvn8Ie91T2X0FjJGu%2FyAwBkjkdvNkFA2iFITUZEWr0Vqz2ftcwwDMmG9ljoSQ7COGEbQWVBvYcGcexj%2Bs%2BH8RFquwZZpLgL4hhP6OOsJahswnIEy2R46COmxVLrux1P%2FMRDtGubhAK1sVhBWeyMG7YwmhNOf3KnFUmd%2F264LtaEmT0dtt6I1%2FgtaaqqjtY4LiFKO90kv2WMsl6hSWbUgP1aDEe0z%2Bq%2BWtTSMlYurX9htsqVLeEGReOecRjlEa3FLFAPAEqsjlI%2FIFVAJ1O0zJz7jqPc6B%2BxQTW5AkSqmJE7EuKtzOqxFC0O7k0%2BesyNUK0cEqO3f5GEEJVsjNBYXn5ED3GqnSa1dfHl%2BlyjACxGm3Ks8Qt18IeDSeUvZAVykU6ZFJjEf8wrB0ag5LI%2BNcgSpCSwGsxFOZkhRi3wL4SrMd5REXTDHwFeH9B0mlJbzjscHx9vxdhDvT8Q7WKuux49ymWZtgL%2BIDvCGCFU%2FZsyztdsH5ae6zXVebJwQrbjraL0E4UPUFk4wKCpdgHi%2BGePi1YFZsRtX%2BpxV7%2BAHgI5wstiSstD5vEC%2FImxNGcFmxXZHR4TZfERVQ7ZlwezwfCgAcYqP3HOubMM6GntEGOqUBaBD7a4I8Wcv90uWn5pV%2BbubwXcDolnZFwMq7GB2kGaDZ54YvFOnj%2FegZdpjVB99KpPPF6eM4Yy9acve9HuelgLegILXS31ArqCtjD6mnx1FRLG60gf5Oc0HBUBcxpSffUneWOHKd7aOhImZvb8Pw0XP4TkJpbHproeHhHJfSE21xDjqxuOTLq8aRu0raiNsy9KEcrKWByL3lyWHjyxs4qHF9ZOT4&X-Amz-Signature=fb0bb79adf696e00eaff3e1637f15c6eca25ffaba5e3e872bd7245abaa4980a2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X5XCGVQV%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042339Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFHgtuKTfaYEuenwIbipdX6n0Nmu8IpZJFQV9IfYBQo9AiAJz8bR%2F6h0kvPmjP8z4dl8SPEBmlW2QpL0LHnA6gWVwSqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMB5M7PUvQAqQmz1cOKtwDpnBgPTiJ22z7B3lQt7poLR1A4QCpyujWpWyM98C102B3Y5rCohCptqYn17f%2BRNS00tJZKYj6QO0RHZAHcqbfERbLp7%2BBBYl%2FaW3Aom8cwomkibCutpwXEoYmWpudCzyxB8M346uqBIcZpQL2yREaGMNgM6yUrjwArvD2XRzM5j2OpJed%2BARwUvNfjXXmNN2%2FTNsfl23giWrgExXWFd1uYGokg3aMCZNE2z7quCtnOmXl1LDl1UuUvCg3D9PkbNog3qb%2Bp0OYTjDu5%2FjJWUP%2FcuiCh18L33H37QP5FPfL0mOHyeijxixjrgnLxYKm44fgazuVgw8zqZVx3A7Z%2BSP3O%2FDYGV5b7%2FaZpgoRFgcyLFh8A17Tq%2FjElGBEO3A6HnxMlVmBIOnd6%2BnVsqYTZQSxqS1a1wmaTb2Qoe9tacR634nasZcOOfZXjWMeTi0nOYcqx2M0ckXUT8CASk3MUm3Ci4CvSlBSS7JU4TRTkXaS91Czuncq6HlvKD4QAjMbJI6WrX99WdpA%2FbRKFPBM0jojdR09OIHSZVDEJ%2FRMHzAGlQw%2Bm7WbS6DR3%2Bt5QKXsizQh%2F9icDKzpxgRdc5tqb3qyyy4Qn1aGrTM7Lp7uQ%2BdB9f6P91n%2BO7%2B0muet8tQw54ae0QY6pgET7LWqI0qfwG3gIN1VissEiYHQcflri7nupjeyXbCLV93eGcUeYVhNqfHDk62AA7exFLRdw4Zfc7kVYIc6bBj1VaOvdW1k%2Fkkodj4k6KHxY2yj5%2BgFADlM6Xb%2BGl%2FdoFnyIozRbjVhyFcY%2Fsiri8ZWx2H6hKghoB52nykqySkWXV%2BflJSAsG8kUoSU1MRJcIOSj%2B7L%2FgtX5mdjgJil8KiGpkm%2Bp3mC&X-Amz-Signature=f0da1c1a284f8af8a47af526615461f8f2051824f0e81fadab1df7d480257a24&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664VHBGR5A%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042339Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2Fn9T%2F3JyYZWACC67Kc%2BRlfST6nPYYW6ILN69AnblBawIhAJjqyNMfPIiJGwT6cfQ2KhiPVb6nWawF4Qk3TrglkoemKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzECzLklJ3HqK5N9IUq3APefmWcVbq8XVe3KZG1QeeswYzYpL0dCuZRv3uHCSDVOE%2Bwms1jJ%2F6TKHVurbwOuAVKugcCoflfJDTidBm5y4QgTpVT3bwz7hGzlV2Ov1HaTXe6We6ps%2FiohwAFlg3JmsWZhyg9o8LSm6Wq0Oyo2AJbU6hx%2BpQ2jv3%2Ff6mSRpJw65TbazUOTkgJr1WFJ%2BLym8s70irlT8N2ZbvNiFKiB1rDopKrq3S6sv2FFLtElS8hRa1coJ9ohuJvU0%2FAOvzIOqXGH3KhDEvzm5SYZ4Cs1HCJK7jP4PjWdlhxPTrCoE%2B%2F%2BArrcoIemcjUAwCQXVALcASJUa311dBGGM2Jh8H7Lv8HThscN7MaZNqEvSSa%2Fr8Qu5xJQW3KZlzfYbb0FduVlB4N7mIhGivFOSytirxtu6dVpUTdjn3X0yWr%2BsQWZVZhuxBgFICUGCmaxAghu%2BRBvOFQEvEiCiLWI8OLPvrpj27OWuzZt22R9rwp%2F89MviBjps7ue7SHYmywOTNbC2KSM%2BkP7vbPAd3bw%2FlA0lEKBMCrabMICzMlqY2ozXEDTkBGZo0WF%2FytPgSoy3G1QvCQQfTpT6BDocOdv%2F45d%2FE1mW%2FYYwMVpBU6Apo8AmcKYutSJKz0hnKHk80PaZciUDDzhJ7RBjqkAZ0GnCcL7i5xuwbHyWAaLeV7mJnVJpz4lP6mFz10sFQ%2BdBH%2FJ%2BiEj5aBF5ADRB9%2B1y0eTwEpsZ88xpWYCn1j8pBZjAbG1WbyPj13KLPvQYaOpno8jEza0HTRAR3oTesqBhGUO3ehd1kybyYsHV9OweHOe0%2F%2BPHLj%2FtXPg%2FZN4xKJ9VNBPL5FrFIfBzrvl0xnK86Ln9YnY6iPWGGDiLcqTwAg%2BRUV&X-Amz-Signature=a82c2b8024d2b3e5ae340289c7742b86cb9648e16baec870171d4f6417fecfe3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663XENNZAZ%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042340Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDo7W7c4DxA%2FLBDcRAN4yRXww%2BDEGUlPVjAmKSdKDlsWwIhALLEnHe6TushDxw%2FdiyTYzbqNLdB22exLaLTtlzw5uo3KogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyXHOzW79sIOA3H338q3APhIfFpJU9vDwBEDCJzS5jyFJDu8C7GMwuUpQQoX%2FmH3R5qzZkDPHkxfLBtoSCEj6DSlYkZgEunaPCeQfWOgtZht8ggmOAEHxi3p21yRH%2BPbgj4VmLo6t%2BXoVTUOLGVHJBDjeN3lbBCBGfhGuSU3e0zByeaYN%2BjFsKq4v2kXFOjqQExktuoq98aAha1ONm7Eo5%2FYCtk1IPkuQ5kTERajZBPq259zYgdiRyWIo%2FmLZ%2FXml9IvW86wEf3dfDyXpu9C%2F8eOhYjmiqV5fZQOvT2I3%2BYtxKTxiTWuGO1IcQiIa5LhHBa9bNlaihnP7DdKZbt0dfX9gDzSSD9PxFVebXrz2g6p24EEEFrfF%2FG7S4oPSiWzmj8kGyNCniu8FoqaDY0y2Qgn%2BJFp4Y4%2B%2FyqF85wmF0CF8m8tEiJTUB4a5tXawrE8lCbX14LpD3s3pZjhMsFxLBud3orcCHCrN5vQKNRVdFAR%2Fro3IcXdERIrxHH%2FpSe2wNEiPmMBmMhFZqVcOkA5riU4bOGC42Wub66k6t%2B0up85rBlBk9OLXUjkzOKO0ewhFDtVazWQCXlkPtQAL2UFgF1vSb8fCtHWheJ13gcnUKDb15K%2BHiDc5TeBCR7nb0kFkvw2DccgJipk8xYJTDwhZ7RBjqkAXCnbhC%2FxDQi0TBOMWaP81Isc%2BVx62kUPAzVa%2B8DKK%2Ff52c7ooh5Mu6oVS2zgAnGuhWY23eR7zqWxsATBIsCaafw3uRF9wgVEiroVJxN58BQgkvo2zmCVtCumdnM%2Fo0Txmal3w8bjFOPpinydmfKHKBGe%2F9zB2BQDxRE%2BBZwxbb%2BemsjzS2F1OCkwFqtNDBjE%2BchHmzAwSiIEysaeZUd1zTh15dR&X-Amz-Signature=8eb7376cac89e86a18a6daed357617e8e976e89e590b36dfd74c89c50ca90956&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UQV2G42F%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042340Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC4hXgByEL9%2Feynl4jaWZ0IWNp0d2hvmI86H9mHKpB6GAIhAJ8QVU405IN4RrQF8uwyO4%2BH33PkrRS51VOJex1%2BokmiKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz9g%2Btd%2BpQb%2FFnCN5Uq3AMrSalLMoy%2BV7leLCicWoO6psW6KRiZUDFkWVYLfUHrKP025heeSegAGedPYQQUrLL5%2FgucexAQcy6b%2FPaW2fVib7yULpxu%2B4Axy0AlrwSxBhvJUO63qUDOYwrnRslrTRYcOO2OQb%2FDdTjTBstm6DzcXnW6FbMdpLGxctrhuse61soMFtR04NXbmcvsPsQMjGUwmp4HunwG39Xwyr5oL0%2FM44OucwKdvwF1eUFShECZIFZwrJMby2I7jb4tGuKagnh7tNCgIulViMWbI9n7kqpupzS6Ja%2B74DifcMH2VT9GF4vNOQ%2BMw8bPsskvRI6iLKLdgCaeIFgEOhK4QP4gxuUqwI7tztc3NlG0Fz09mzqa1IuLzvv%2BNC97Xs%2BUPNeIxNkHsHtOMxfhu1oXj3gpGtBfhSApQb6S7ba5YFkwAIh9TTlkzU%2Buk%2BsVFDL47x7mBK8SIgRy0Guamt%2FC0Ves%2B7vKI%2FbhGPXaox5o90glJxVYGGEf9j6LMpJxINWwh0t%2FgnrzVsc%2Bvam%2F4QkU6ZG5BaEiiDQhl5GTHjX1AJKANNO9HB5SlYGYJWjS%2BYqz1rprreuViFlN%2FwZUErK1JKo%2BXOwmg8nAFL2o6kWrxfQApEFxYwPwE8FXxOgvm9QnRDDzhJ7RBjqkASpwu0Ve1rZfUR3fFHjXWXtO1CUFb6wOJHyUmsQnWC9Du7NUMTpDcNt%2FMTiCB7DWpujEIulD9gLhER8VSYbeqU%2Bu%2F%2B%2BaDYEapt4H%2FdrwybEHbxMK0yZ7DbOVP9UTQCmko7LTe9ZCICoUJlT3a08dDwRS3hf7UX6KmWEKINJzGXlEh3z3%2FGZO337fmTdboOcnFfvfESNyVIxlD%2Bmii5gVzgQZsYuH&X-Amz-Signature=c106d92a6c760d13a7a1652a9cb2ea0525c69064083dfa137700d07b9d19971e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664F5JSIML%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042340Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDano4d6o1%2BeEEl%2BNMze1AIlewUSMUdgNb%2BZ1iNngpHdQIhALa88M830OI9%2BmN7HaHMcETxNc87NXybLe5VOTyhRrQdKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxvrc1SAlaCZiUL31Yq3ANRC4kqGrw00ax8em3%2BTMu36YTEpaqetwouSemPPC5kmgvkZ3L38hWoqryVPIuNyKPdObaqA%2F0MW8jOJ7kAQeuFSY8jVOqMgl2RydFEpdywAwAW9KhT5HahXbGl4R1kOsi4k9VEhLKdqdAomZQNlqCbUCeGt0bdgRWa4Kjh375l9JrWgYA3nQG0IvklDVycaxo5vvnJC5QPyVi%2F8w0qC%2BZPjS48ee71dWBDD0gs7ATTCgk%2F7ZrC3DFlk%2Fd4naGgZ5ZPIurRSO1fcQXrrybdhs13DKcRzkDkD2dsSKVPpLkp70sxWWNEaAQ8o%2BnvF57WPCsO%2BkOfII2V6haiqE9dH6bNRFYzNnzcC5BVoBAhbMnAlhiahqMKALalcbnJil3rLh7vSCcQZXPRUBffIXbo8yAKPd1PiExdz3tsZZaVH8gQTs4h6vbjkYm3AUWyY5%2B7JedLCJSAF56G0SE%2BtDeuZSLBBN7OEGtAYdrsIPHs06EZReck2qGzQJ%2F1qtIFb2OZwmYSP5gDvBPZA6oyP%2Fowd3767GlZNxwJXCFWJEEcQxZtm5tDnVmfzB%2B4aLQfTaVFRhagog1AiY4W6Zn9Fi6CIJI92HNVad%2B98KRz9ot2Dg9xf4St5rOn0UDJMgODajCbh57RBjqkAaCEK6VgKbi14gpZi2%2FVW%2Bi%2FK76Xjb%2FzWKaOkk0a5ela2HbJlP1ydyvT7k0A47ER2BBGs9Exm0jl6odIDYrcQj5p4zrU9jB%2B%2BSnhphAYd8f3M3lmkTJ1OsNXH8J7IbFVDTWGWjQipWaPi9%2Fc3l2r6j9Nzxa94Ka9glYbWu59t5rmB4pGJC0yqCbUTgsIqCXhYURt5GxEfTliO6TRkOO4yZQy0KWl&X-Amz-Signature=bb0cec97acfdfaf8362079f6c1e0ef9363dfd41be31f1f21721800f1302da439&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664TPO2MMA%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042341Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHXvLfBt6eC1lnhyQT%2FP7PpZx7QR7AaKcNAG6fSVobvzAiEAtqDz2%2Bb%2BEq%2Fm0DNJBKMZx1qXk176NSO7kEw7QvG49PkqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOxR5R45xiecgRlFnSrcA%2BxCn4tSScReYqVFKpIZ29jdcLYTfuTBCcDGSLar1jBL4CE0pHp0xI1s8hII6qmearh9rYXhqfKLTZPdb%2BS%2F0L9uK6EVHXHXcFV8RAVkACsag%2BbIHMf8ZoEgr88%2B1KfC21KeiFukewNnxGUbNTSSy%2FbfQ4UVqI7%2BoDR%2F63sQUb9w5B%2FCHX0z%2BElkFkO6jxVCrx8rNGcPSbYEBNxb%2BNyJgyqzDJEBQFrMMQbwfaZDlE8s%2BD1vamavtXECd1LpMKfpGtoWSvRUiSgtz2EEuXNNYrvG4%2FAFaqB0jAr3fjoc%2Fx1xEx2S%2Bo8%2FJ7%2F8CfIqZvts82DwYyt86DMFq832zsMGRxm4BFVtNhKTdnV96i5LrTN64rvRw%2BSSobEyLksWqQ9FWef%2FzurOgJ3hEadyIZCdiH3SozGm7YrV7Yk3cmCKH4btUwWMxsOrGmPFes9F77WOKqW9TxUd8IV8hS9xzN3Fj2AFQttUqSMqQXPuazWGAP8zX2fXHHgA4W2c8fL1W%2B2u%2F0IOrTM2hXDv10fR3E%2BJJLCxAMiqXPt6p%2FnVspwpUbg5Tgq0G4hYDMwsdfrQClQupyz50lJHtlVsIvqWUyCuExQ4vjwyUeLh5nPyndAe2Bs%2BPRjuLBPTtZCGoXNAMM6HntEGOqUBQH0y%2BK5KotHGObqnlkIvvibr0vfEl%2F42zE%2FWsYKxbLn34qioUgVb05b6SKeu6XJe%2B3AIlaFxTlge9m9rUJLR%2F%2B2IH2sTInXaxsFYGfh7yWWbPSsGynvg2JZ0fJYs6iUvYD93bRrl7cIBzgGDbRjdSOXTV315yKw3kvxPDBYTTjbYCGxo8BBgICeSRURcuKVaBZdnsRHgiOpsBOxuAG3aQ%2FNtXuge&X-Amz-Signature=4356cadeaeb041f20b3ba8d079a51c923f77f8a0298a0a4ed0ab484b4f9047bc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XKHWRM3D%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042342Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCjn19gYzlQW3N61YKW%2F0bKXlpih6jN0TUFH%2FGb35JXJAIgaSGvx5D%2B9Negf130JDwgrU6Getf2Sr7m9ukvgjM%2FoNEqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMiGvI1JE9%2F%2Fo7N17SrcA6JoZszbnXlU1EBhtlOzax9UbKfTMpcw3NS5rM5mvVIzpg%2FvCHPNq2uUBJ%2FR%2FrnsSwYbDeZq%2FsN3hlo4FDyo3TQ20ecWwMlUZDYrufoVSAgAli860jplYaXqksGnN%2B2TMMKUuhpPLq8SVORdfcYL26RRKTUbnMTTKE6ibDjvVImCd4EkvJaSqEb1qsy6fliNlatmEFaF%2BcD9JxBokB1CSX3zd306H6lKZlDJXqL2y87hsO9Lg7%2BGNNvBW09fATyzIfWa31wClRvGkCzNFHH1RFnJI9VxbXHZeQQWNWXRlhDSIo6t7r64cgMybkELM4yyQQ1Y9epzShrVheXO5JBRMtIFThuhqlI5qye1enfglNNmzB6FWyLbGOZfIPbx%2FI4Wkd0corWysUjeLIqf%2Fx0JteJodOAZ41snqdXTWLn%2FZFkMUxgK6diay6a4PnoSYs1VuLNMbuH0jd0yojPj1a0vIYEHNSR4Uxt1fnOMMdjJdXe535oDTumVvOH9voGvuzUKoucIn775hlHKKE9KmxDqSVdhVu8AjWs7BIj1gVUojlCUezrTlsR1dmja%2B7zsDS9PUKpcM%2FlJGQ%2FzziZlx%2BWsiJpvf7ON5qbqoYiA1lW1Zi5mxfcEDTqjcXqIpAM6MMKFntEGOqUBfZNfzx4Dx9yWc8fxMbZ215z2ol9Drdxbi8a1kUOh4WPUOO0fAl3t9FaW%2BBDpbJSNXblwP%2Ft%2BQMkLly%2BknBG8fxo2pzlNTdAdh2stWaZzvaodGyzypMoeMVVnz79XI%2F3wGa4E5Znw%2Bf2l2aQojrre9Lao%2BPT68U0Qgs8dsm7xD9%2Fo0Wg0rj6ME62fdg4089t4nJF9fFGnTcVJFfZHkYoCD0VLP4%2BJ&X-Amz-Signature=e2243944fe50341af13b9ea788ffa25294cea852bbec7c06dcd549a000b0d911&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46637TIH3N5%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042343Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCB8oJjaH5nTFfW3mYkjh5P%2B7iIIWrRkHO2hDDdtfVPDwIhAO19fxRYLuzWIXzHda6D9%2FW5%2Fl%2BdimkTu0yuzTMi1W2HKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxJMY77VuYePV8wt9Qq3AO2UPL%2FRRFhjWADj%2FNCyzCLhU2z4njpJA4VABd55jIaNLKu%2B5E3VGqLh8deQPsqVQYgdSL6gpfbnr1e2nBXzrR9eON6eJ%2FAQBS3GZklf6qY70tzynVtB09Db0loW9XFi5BLsNZkXroKRph33Tqf%2B5E4QWlGyMP8Ny8Qvbl3KFZ9%2FY048R2Vg43iJnh3jK1h3TsosJx7cIuh1SlaTlc2XQbEoTmNofoGmgCBQrK93ZxFQKtEPODKmTKM%2FMGkHU9NpJPnbO%2BF3NLWihDIlLZnDhFdyOHX9YAyM2PP%2F97t2aBV1qFKDap2xlYO4FRIs3WFLlppvZr0eiHivkTtN21KCcObwsbK0i8AYO%2F0qNx7rN8ePW9uLiXx2%2FDime0Ayk91otixy71KX2ZFBx0w5pJwpl7JsH7rC9gprN8EgvEX7ld3QppY5ALycgEy6OFBsS18AlcSV5Co5ozmvi8tUz733Cg5IXF1KIQv2ZO8znqz6QaKwZyh%2Fe2R%2Bucat%2BSpbv6JYwjajnmVBbsfVYVGtSGruVIof2jI3fkKgOJIki8AlOArL7IXsZBoOl2s05T2bM7dubViqpGcV8qcVtLoS%2Bucd%2F0WbvWb3B%2FfLzKVZNR5bomHUtWgqvHUB6iQQvMBRjD9hp7RBjqkASq%2B9k9owJUMZF9CG6l8xutmEHUDoOC0wBkPFhCK9FnGL6awuZfWT5PvDuY69xp6IwveFL5dfcwqy5RPyh1NaoQfDwAfIQ6VnkKy%2By5J6Wu5PWH9ycnAEsCf120H%2BRJHEiCLVCaPPBovHA8CPT7SaeWYYvOD085OOu12wxUngsw%2BupSW6VE15eUYLphOTceA3%2BlZCGD8DwWYGkYTdpVu6XOY52eI&X-Amz-Signature=1e228455d1374ca9c7da080d38e535af2c868e75d6c1a3ed6d5ae565e340d21a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46637TIH3N5%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042343Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCB8oJjaH5nTFfW3mYkjh5P%2B7iIIWrRkHO2hDDdtfVPDwIhAO19fxRYLuzWIXzHda6D9%2FW5%2Fl%2BdimkTu0yuzTMi1W2HKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxJMY77VuYePV8wt9Qq3AO2UPL%2FRRFhjWADj%2FNCyzCLhU2z4njpJA4VABd55jIaNLKu%2B5E3VGqLh8deQPsqVQYgdSL6gpfbnr1e2nBXzrR9eON6eJ%2FAQBS3GZklf6qY70tzynVtB09Db0loW9XFi5BLsNZkXroKRph33Tqf%2B5E4QWlGyMP8Ny8Qvbl3KFZ9%2FY048R2Vg43iJnh3jK1h3TsosJx7cIuh1SlaTlc2XQbEoTmNofoGmgCBQrK93ZxFQKtEPODKmTKM%2FMGkHU9NpJPnbO%2BF3NLWihDIlLZnDhFdyOHX9YAyM2PP%2F97t2aBV1qFKDap2xlYO4FRIs3WFLlppvZr0eiHivkTtN21KCcObwsbK0i8AYO%2F0qNx7rN8ePW9uLiXx2%2FDime0Ayk91otixy71KX2ZFBx0w5pJwpl7JsH7rC9gprN8EgvEX7ld3QppY5ALycgEy6OFBsS18AlcSV5Co5ozmvi8tUz733Cg5IXF1KIQv2ZO8znqz6QaKwZyh%2Fe2R%2Bucat%2BSpbv6JYwjajnmVBbsfVYVGtSGruVIof2jI3fkKgOJIki8AlOArL7IXsZBoOl2s05T2bM7dubViqpGcV8qcVtLoS%2Bucd%2F0WbvWb3B%2FfLzKVZNR5bomHUtWgqvHUB6iQQvMBRjD9hp7RBjqkASq%2B9k9owJUMZF9CG6l8xutmEHUDoOC0wBkPFhCK9FnGL6awuZfWT5PvDuY69xp6IwveFL5dfcwqy5RPyh1NaoQfDwAfIQ6VnkKy%2By5J6Wu5PWH9ycnAEsCf120H%2BRJHEiCLVCaPPBovHA8CPT7SaeWYYvOD085OOu12wxUngsw%2BupSW6VE15eUYLphOTceA3%2BlZCGD8DwWYGkYTdpVu6XOY52eI&X-Amz-Signature=25eebf86bef13872abc6858ba1aae2fb7bff9cc2378fd169fdb5f9d82c0db34a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
