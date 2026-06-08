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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YJ44QCDA%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050106Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDouJYFsucABjHd4c3L%2BD%2Fsy4Q970NGYBex0JdFYrQHmwIhAOkxzBRQpKujDfSZtOxfGn%2F6aGcEW5z7HAnuZO0qxnf%2BKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz0yzZnkaAvOg7FFvsq3AOznsninKiWVUwEJwIRlh6c7M07RG%2BRk7BqCrK1uvF7I2G0inNI9tFZjsqKj6rQUX0ftNOnCWlnjvupGqXMnKeNUGSfy8I0fOsWOEQ%2Btp9TYjFRHWGaNAh3w5jlTvdsWcVpc7HLW%2B%2FnzAtBfiYoQxy30ytODQfVKcBGXarfxDUvvXLOo3EGwwyfgvcOVWSO4PnjSoFJCDSc8qYOIw22DUARby162ABKssoUn6TbAnCYSwrvQBJdOLAU6%2Ftd9bu8xML%2Buu%2BDkzQ00S%2FEomtQNEM3LC58xBo1D%2B5FsBAm5zisQ9NL9CN5D5I5w%2FZ3c2uL4fBwNPLb%2Fr%2ByVbwYqi6PucX%2B2Zd8PXeIm3Gr6snzGYgTsGG9GuJm3UsAS7ZSebQqQZmlOcJW%2FFD%2BN3%2BXonFMkCVQTxlYCH0xv61iLGUWLKUZmb120fJAxzlBYzBpxM60I3U8JERy94ub1urZXFJHdrYDSR36AZ7Yhmn%2FnGrAoW7rgKZG58kByRPi%2B9990VE2N6nF30rO707ytYg6V%2FKHoyQvuqgYfeXiQF3q6lI2bcDb3I7LnAlSDHlB9jZhllRcUqO7OukbDFYxF9B9AQmRtDtGMPAFsZCSTnZBT9E217RJixCV4p%2FCdS%2FpXzT4zzCNi5nRBjqkAZy%2BbPX33PCkrs%2B%2Fri%2BufUpmVodEkbcMlvNmaHWFgKRVXIoi%2Fbjl6rzWKTTQ1WyXgdIRPgoDdfxEG6I8rNmmsRYg44sgF4t8KzmxwvyzveQaO8CubiHILo7oBdQMqGMyh%2F3agY1cUGh01pHrKvyxBO993t07541G95vIdbRxgXLmd7eFPYrl0v3BlyyuK0L25YM9bGQpkb6BihDhBv%2B7BzSRxU7J&X-Amz-Signature=6c91344c4ebaae286cefcc08739e0872eadaa8d042817d8be5441c006a0bdb7b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SXN5BLYA%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050107Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD8RV3Nh3cL8jQNvYCFsHA65T79KuJ67AqWYpRecH7LZgIgVc2YGgc9wAnRYDxBbrTEH%2FNDtW%2BBGYeQQf9TmLx2ni4qiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBCv6gHwXwytY9XKAyrcA6RAWBbEnCypu9jq39AGyd1x4Hm1QxCj3NOrAF4qG7%2FbZo2dKYEh%2BK3i1qG1goPNWlDgaB3PhRldKLnswnpR2Cun1hM1WxST0iNcuxu4dE1eP41XzdUFdQLB6ReR3R%2BjADWRyeP0Jkqk%2FEW586xHy%2F7VELoeFFWlabHwZvFk6sPJl1tVFEqtvXqzQdIfi7Z6dst2Nq410%2BT0Hdf0DOGBeruCH9VRXe2ZN4jdz8G944%2FxA%2FtSuTvJa8%2F8mcpU4MggmVrPrQX4hZ%2B%2FLAiqgbuFlL57ESZF1Ul8H7KlgwnTAS7QxC97JGyqA6pkSEvLUYFgu30s6fqwKAndMgMLpY8Gq5pHEbm6v6z%2F4pNY%2B2lswOE%2FA%2Fh6wSQ1%2B41VNWPT%2FsFNKyjz%2BDyR01TQzj21YWhu5MKXkyhsX5swjkO2BeliQyf8pWSRAwdZwodxGSqjs5SVef9IdlbQaYuX8kxbRTF3XvbQQ3BPzqus3VF8%2BZGWWpjilnzxCTsrZHQN6dCOHD%2Fnr6xwTw%2BzTGcOTi7rSWFMAS7twcWEyzKyUkOvVzZYqaqPgtkMtJ1mLVmyhICuZ2ssHw0XGnqERyZByVqP%2BfbsvNf6QJ0ruKktr8YVNXHZLiY%2FsyhCdMJiwRN%2B2AO4MIiKmdEGOqUBkMF6AregunrQaixvC5lWab0XBfn0Ds1DCkBIdp9ivN2UqPyfNdIkIZAal44f2HyF3uphCG8eFVBhZ1X7kRIXBqj6AOJ5QTxEIlUp1ffDZa%2FsbcAqRfe3F6V4N8X93G%2BK9TBcbK7NZMrjDOiQuwnTPHbAoVLK%2FzvAsTjdWwxuCw%2FqKv0iGuouSPCxL6QqnANrKENRO10X9B2dU%2FbbmcCX3d3PJQLl&X-Amz-Signature=71a0275587a777b7b6e8d397325babbdbb3954e62804fadcd3a80bfc8d9ac4aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UMSI2ZQ7%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050059Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDZhdVL4i6CqN%2FT2K0ECbTfxROD06%2FyaYtFRIENcSEF3wIhAI3F0xfOeosXWen%2F80NRNKIgoFkBMrHA%2FWf%2FMgRk14ReKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgycQtsom9K5m7lh8boq3AOnNA2HrF%2Bu1B%2BfBO2PUujvFdFm4%2FlgMo9Oh6o4zFPj2x%2FV0MWgtRSlUgVVDtQxspg6HVYUx23gQFD2v68UIC%2FbrkX4nBu8dglDl69JWBQ%2BZ1nw5AtEj4q4L1wWmL70Regq84dOt46FszABQMUr1SKcv2T33A1iA%2F5Odio5L%2Fn2RHiJLM78JiFLKk7lnZGcTjGOsThmOpTjcT3qY0GbUV5yeFPWIGYLobKGAWFYaCsccu5Zy0ax0lcgH5N8ehsnBTheO44%2Fho2iZ6d3hRyt5MyFVnhTwjlOTZswP9h%2F%2FBGwle4VEBV5VhRLjpn8Crp%2FSCH66GKi5DpLoy8Odz4kqHtMYrkPqK8GdyID6f95GFCAZMMR%2BlkE9LPRK6EpUAwJD5IbHJR0HnG9IM2U6Fw%2BdbAo4YAmv369oPQek9SObERIESybc29RAsaR074ayaTA%2FeW8Ktgt8q5W2aukuBd5b2Hp15V%2FdXqnEcfguvoIXGGppnX%2FzoSS%2F5plLydzrSzF4E%2FaHIsaTU8zA5d65pKhTsDrnxUiyCBhErJqU9vG0H1FSIeHurmnyplq7AuFv9gL1asEmRs2lvE3NjB1%2Bpn1WcBaTMN1%2BkBXMY1JY8Rrj6sVFEfT3E1iSVtAaCkehTDRipnRBjqkATWlgAyODy1DRpjZ1Nd2M5vaxEyez4EqySuhhFhdFygJip%2FRSu%2BJpsz%2BQl1tc6cMx5si%2BleigRKu8FojaAlwd9usb8EEJ10nMlTyPJS7xBDApW4oP0R0zsQkDTd34%2BYUGnCibOH07fDTWZDLrfg%2FglnkS0rVZqu4ixRzpEoM8fa8wTkgwLqcpVADgsDNbvRkNPg8KoxJa%2FemopxBWRtX5%2Fhq2Msa&X-Amz-Signature=8896ce3b1c2ad22420439bdabb001a020d29e051cb4bfd618af93fdaa6645cfe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RXO6VFY7%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050112Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGN%2FUwn6bKdH0gPNiApoUni2yYZ7SU13K7UbOQvXo5FtAiBGQxODjGmbq70yPQ2gzlzXk%2FUhHQbPa6%2BVM9KUrol7FSqIBAiu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMCSh7NaPlo43ZGUv2KtwDs%2FcbeyzoMA0%2FFqF5BGHUZkmLSsrfsNZSDYAYD79ZsdsGMPqz6BourF1tRkxUe4VOONEMi2CC0mYI8vi3SNxsM5PrOzuJPNz5yLel8o4tajxxoipcGgsv%2B9bSbQDki8%2FLvszbqphMrS5nRnKCcaA5Uf0ua6hZ%2B2vRb35mC26WPY%2F5s2KuDoWlopmxniW6xza0VXHNLIL%2BOYnsjD8zW9gdoCS0y4nh0Iv0FtHtq6OU8G7Zpmh48xD4t0ynfMS8qDYgGulx1Nbknbu4kIo%2FBCmQ%2BXmOUWvsZXMGTVQ3JBYcduymjDTVTbFLhqLBcuFuQBEbb09SMEvecPk05WLdO6ppfuULQp4T5L2WA32zAiQfZPaAiwl5Z981nS%2B8K3mtlCam2bBVjsTuQLTGFTH6fHMgNmdW0JMPbPD5YKGFCJDz89ivtADKc0xGbvzqHpdNVteSuzFkozKo%2Bmh2YK%2BlKDWNAdqg0t5zqJwHszZiWXkEownJ171BmzxP29BWoGjdDYOZINdXPI3ptlXQroNedUKEox3bHrPzoMFzhAld1N0mGL0KErazse17baXQS97joqEtTKpWcZz2aDm7Ysqj2jZ%2FyUkcNtaPLMK0ju1uZ9BBcWbibXwa19%2F9znOxWmcwhYyZ0QY6pgFYD3XHnRwDlTrebiewQGEvNJhUoiZh%2Fq1bR8ldc3UJrEuu5vJ1iWBYaKkGqit3sLOcFnSSWHSmAaxwPahO84xsYjBCw5jIuYzrmGRauYGKFo31thnHHX43rDv8RcC7i0Ay2fqAUJbGkWRRZEFII9ST3J%2Byv3zAU8bop1JbvbrHUvdnZXlpyXQug4xbD%2BquYzouNz%2BejObfPmvLjcxlecWIZS7OWiCK&X-Amz-Signature=6eeb86055698ff5dbfa635cd36f6df967078908d9c3ac1ac120b9fecd2b3f0bf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3DJ5TFI%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050113Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHMX%2BsMlnw5nji7rZFtMawRFAvRi0%2F1Hro%2F6n274N98iAiEAtzukFsGExIzjS3fFxPtYO267d%2FMqa3u2J6kZpUcx2owqiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNC5Mhq8X9ycECFweSrcA7ihfcZyfMdUfwa0N06Gtj6pvRpG1iYe0UvACLWpp4sUup38rcEIp%2FQtYrGxuHY538zd9fIfzE9DrNdNcSknqAJBSvjLLEm5WMXoRs%2BtflyAKU9VZ0F3cUyjgNkB6aMzpTQkOOfhCGwDfLn7vgw7IpBseaNV7m4xmujMXMycIAM9PiXkqtOm24ErKoOu1XiannOfwflx77ZxC%2B1hQfpmAXO%2FNLjg85Ur7vD%2FG7PQmOk%2FKFZ2eozgmPDppUyXofgR8xGZikHdl7Uef6FYumhdFWGz8AJU3HwxL2hlE9JeQ9l%2Bn1n97U33VXTu88Zm9ihZ0tPP439Q17gjd074KzRn1LUuTSZEVxQk10qsZMB1YrDJLuxtu5ilicgYmvXlLZVae4GlXBE52V%2FOWZ72MVgqXMGFj8sr%2FhL6uS%2F%2BnhLLF3vLf27uirCl9kuDEp%2FPniqIhbzGK2hJemPsnSUbbSt%2B0Cxoo85s3kWQRBqqvlYxrByW7Si3j0h1DO7RLju9XjQqHUsts%2F3KKeDcJm5zIDvykbCDVbuaXeJW%2FEpapSqphjanWrdNwskaNzeeVkvvGICwgVoPgLiynPG5vLRAa9HXjxx%2BQZ8IGXe4swLPzPa6yLYmb1ysZ%2B31LsrQ6Z%2BoMKmMmdEGOqUBHyNys6xmgRe%2BnCIIQbIldP50upaa1mEc9opkY%2FNBQEyCFJ%2Bel3WE1F%2Bb58Cd%2B1OHzXcQPzHYR0Esz1Y0SQL0ieh3Ryv%2FPo%2BXlQvv8q9XjuFlBAxOtDV6Ma0t0hlgPUOaNgPCXLmp7TZLsFfKUXMORWa7%2F5H3e1YpJRnckrvwkTP%2FYYK%2BjnMceiTbO%2FfVcGW2w9thYv3mVOOZJGg4X%2FU6dIoHpV9j&X-Amz-Signature=1e457b45b696e0d50f7d230f8fac0aa94dcf4d9c8592b5996938100ee777d169&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZGPRTBZ4%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050113Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDiM%2BmKLdLqV8AnGuPonAZtTO%2BtTjRHcfWUp%2Bq1aUZ5MwIgeSMCnGN8djehxgdkS0GgbZTcBTAQYfXTeDNxceclF0UqiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDORgTrtjPBQW7ZsZuSrcA%2Bbqu9Q6qvomZ%2FoIDmYtoBuxl0eLkkbsJ5ArFC0q%2FTQPaBzdB4timDjF1vTr3s%2BuXDwWD0yJwvEEWNp%2Fs8PB2m0HBLD%2FyRzauQSOVqDjuC03kihEpplumpT8BGjidrWWGi7Q%2Feefc6ovgIgAs72w8CiEd2M5qRA%2B4BN9j8LuLtu%2FFV1IeGjNnrRyIP0JP8v5nbIy1o3PiE5pzCoxU%2F2uozs94jTj4uc306jdy8hmzqokDw1qgf4R3aWlnur06CX1mmAlIvzgbmV5HnSQ4eUczV%2BX77hWTgko4%2FMuiCK9SsL%2BO6Z0yMs0Y0CfJXMuRjgUpML5%2BsJsILZ3BZcVtFG7Puh1RbvMwYIRsnq4WkYbI7kjYY%2BULqnOlaCLRJOB77qTntnD775%2B27kKt6jdELpKL7ntbe8AZ4Svx%2B%2BC3z0YkIb4MWM1Haw61kIX8%2Bk5mDeX2wo9tJIl6PynygAvp219qM%2BtHyfEdQ9DbFYjMpJdlD4NmFeUXlG9bJXpccNhMrog0RsYuALMe3u4KcIY5kYJHx%2BA7MYHYL4tuZ6PVf34%2BLo3%2BjRMol%2BQZ2AYWZadHTib6VtE4hieEnuiOzeRY1c0KM1WnAv8Y7XMdd7zvZ1RVZfd3Akp7cLFgkVoLvpiMN6LmdEGOqUBDr6oxYTFnCy%2BOvwg45d8jCYhZNIaYTQBXO60kmammHUbge1pXOyxqu5cO0ZkXXh5LkgufDyH%2F2oliACgHra5ra6fdEJy1f1idKX0zIMuJrc5c8OavR7%2Fx9K1dVwb%2Bdd5%2BE9B4W%2BOofWKChoqX3a6wv4IsEUogeU5xaugO8S975f3wxz2RLY0slZUzRibYZPtB8Qze5CO%2F47rgCnfV5dnyMZljnBT&X-Amz-Signature=8b992a79eaa21a945967a83c87d3f122b65f60689eef575752813742e4de0f0c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666JP46DPL%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050113Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGzQ8n0pDkguMcvna20jR%2Fr1dHOjCGKYuxgUfrMpCU4dAiBLenw0ZVhaYni681f8K1g7utXKNSRWUQtvF9DY744OMSqIBAiu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMViBQLayin%2FuoavrkKtwDegQ6FUVbJ129xrIq8Ot8C2%2FoaVLbeEUHyUOc4IJERawvdQZbV13A%2BAniRYXL1uJBEGXm4rkf9NMo7kqIqqaEIJtZAQyrDqKbWwZThUfzo6cCl%2FEbt25Btg%2BDOzwJ1y8yfyzDVdoS4IqXlw%2FFvWS5%2FQAt4w5X4rFPGz8pKufPgUHcVCSBEFD7%2BpVN837S9LfGYvJh%2FdZ6MTW2nmZataSNpKakcwjpCNtwAqMB979yGjMsyjVDQI%2FWi1CS9f%2FACIvSYqQlPvim8fk3spQOGR%2FXOqK1FBtTsW%2FeQ0gkszwuY25C8B%2BbfiH7rtrR3zixKIw5YH5XiITAE85CKWu3DotiVf6tgOIOhX7vNKFsFYVPUJ89sO31XZU5kQzPa5%2FM0UyA7x8q4teu1KvHE3KcEPalYCNMgW%2B78xXsrlj69ZCZM4%2FQuGqyeM0riatjmqd%2Fv3RSRwB3nfwL7AFLwrj4jEgtksrQwO9A%2BL7OESguzJEtCyIZOZWQDwq5Hs4psKnikuHlEDdKSCafybI1C7FqOkWZxnTcBygS%2BdG0qap%2Fx2TN%2FGfokts%2BstRs%2FxRFpP6KhLjROtk3p%2Fcf8JKfMsWniMCqosEtzq%2FvHRLS7CTVQB5MzyMyziRrhfkJgi9P3%2FYw74yZ0QY6pgH2TEKxqyuixgUkKoLjGDFdB5%2F5Ah6rSVl9wflG5JukiYPMqHv1F40slvGQFI0H5qMIpINxR%2BPL5yiVLPI4MpyrBaVLdeXYzksEZixrZbwrCJRiFNIldtthHMzHmY1oyLk1bq%2BxiBm6bn0J1Z50KdknsuXGj%2BdxVtgch7T2a%2FQxV7vFtHNwdaOSE8ModE9%2BXC7SrOcSQ4JpQZ7FRWNAh3%2BCMHEx1nnd&X-Amz-Signature=38c330ce32a608f1b03a050adfdb3e97a3b3c2fddcffded6157c513c940fb8d8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46632LTOKNG%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050115Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCID2wexjZQJGBM3SbZqhuHG2dwcdS3GvzAHxFav4IY7gEAiEA3JfT40vu9SUZL1PT79jjTFa%2FEc5fl%2BghPnYyBRTx2HEqiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPbLfs9lrW2IkJf2MCrcA762G1KvgCLLB9OGeZtokYL8ARQ%2Bs1L7iHeg26eRyQBxiIHPCUdx9JPDCdoCfw2JndlxY5YQ7K2wHcpcTbq3ikJ59K0DWKWcoZxsnAVZefb3x1F%2FUXepzOTn%2FfZrBjHNEWiDGSIyNBQj1VbKAc7boJhOxMaeTdG7PmfWbCyShJKEEbmdyLQVhPf3eoxmbadOQ8Zb%2FN1R0efiEikwGkWVy7yRivYobrZovWaHPcJBsX%2Fm2bwvab11rhp1cQoIy8thBXMaFPuj5%2Bedpz%2B8fFONNYTN8Jc2k6Esntu%2BiVShErTxhz9xnXJY0UgmRI7yrhDJ7sLCwNAG%2FOg5k%2Bx6zzMM7M7O5ZKG3EQRdWZGKSYUgxVZ7hMTb%2BN%2FJJsA%2FjRSne4kX2DDxjZzFCqS3IzpNl57Is%2BM5dysgO8%2B32mrdXpNV7w%2FysuX495DiLkYbUaZRexI5BX0L5j%2FtzQcIubj2Vxh0Kz%2BuO1Ic%2B6s4SYMbMXkWWAKg3h07nuL0U4msrhM1pWzEHEJqcIaaR%2FfvrK0zE%2F3%2B%2FNrDX3GJW7FsXwrmAMV4ZqG7Lib8VRbcXpFi7m4OYryOVyIujZ7clTthlNTa%2F96G%2FBudLl%2BkrDBvztAq%2BH92fhXkU3SxhCZQeAb8oXuMOCLmdEGOqUBB32AWC13JuK2tCE2GchlRj5iKKdGpuqHwMrR6yxTN9y6mFTUTrRc7spQpvxfgzeRfRyO1GNw1ntT5beNwtpYqADk14IR5H5KPvzZuQjhbxbiF1mJg7La6v58O9LX5PiMqUG6QEg8SpkA9s9Fr593Zx7BfcVO5yRGhZf1kGRJhRuHYa3nwRkGxQmWUguYqFeVGzSOtXBJlcJWsv5dyjdofrrwZYd4&X-Amz-Signature=34f55ffd1be05f5da7285016874d06a4308110f7def6341d3f7571e85f5490c4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RXAU4423%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050116Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIE85CaQyZQG0dlp4EGRWbbaJW%2BZODqSu9FJQ30%2BeVm5CAiBXsRGaVpnNOMbT6%2B2OIxFWFREEha7eTBYh%2BYr%2BkG6x0iqIBAiu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM0fxdOie5AgjQMTJvKtwD7Utj067cUnqkakROd4S7IrQKBX8IvI8wS91HJ4R7M9NJ6BhRFHGv%2FioeYfmk4BYq8ro1kcKzFxqMpHi%2FF2MOLxV1D8rXqnEebaH7cER9Equ5J4YBtB6yQ0G3lCA9tKRZzisT6KltZtEVzYEEACQUadvk9wG4tobv0vxF2d8M4yrdtLpamPZGFWHQvhsHCmz3AmYHWfFIOH%2BdMmE02piCxvl4HxE%2BK3t7q6gzTvnkvcYyD7J0CSf2v%2FG1POELKWBRPoe%2FkTFCRIx0dSyoHLTWNieekvvo5mC3BgHMamp0%2BJN3mM8AriaA51ZGXXqHW4edIqV5itNI5kFV2kuTvlCAy%2F8U8Jnxt3ln%2FzD7Ji7ZwZcHqYtbhbIzQDiHMGEE1jBKi5kyQd7CqrLOyBR9oz31crYu%2B6LT88FJmMIn%2BuL0vH593hZQA293q%2BLBfsHwl7AU6qIKyELkvRJb2YCiDIAKKGdw3eecwplHhNRjQb0zWgld0OUdu9QehRBXPozVfbBBLslXpjix4oCVScbbsmGTwUoYaS7r88ymhRrCuexKT2WKv9ugh9IKlKsZARdgwyMHAdE%2F7MPL3xYZJLVtkVqLvuc0vGnTeSgafkk7ZiCKm40Z3tuKQVriR7iOMigwrIuZ0QY6pgFmlvVokunD5Uh%2BqGSw5qdKW%2F5i8cWr7QjRvb0ZFUJ1oAcsiKcSXoaMgTvNgkvEbh191ZIJM7Jswi6RAH2JhQiB1mEYRIjQcf5vjZU%2BJ5vEoz90b33%2B4b%2BSXPSFFB8xwmWwA8HpmEf1D090iJV8N1hvB86Vw0zfEj7aNGS3T3A6CIxts9iXIYhvG9XatMYHyAxWxIXbR5WvQZt4CqT9Up9USnmz1QCc&X-Amz-Signature=1929ef2ec4daaad35e0b90d97e52b339474de8824f5f7c5bdeb3ca473a3f7a1d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XZ6V2GGX%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050116Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAoSC7a0MekdE%2BflLqHFO237m2T8zGbXBbUl8CUl6jWaAiAl%2FYN6wgieb8S%2F5BdM%2F%2F0xwdteJGLJExrEQ%2FV7NdTVBCqIBAiu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMzS9Onb8k9u1r3%2BqDKtwDYJ0ylwIUJXL7nVXom68xnKmYobeal08%2FzWClD2Qkoz8yc5quH4raNpuz6B8x0t2IXeHJ4pstusqkmljghFF6IDpk1TRGaNuNSWmcb%2F%2FHn1RLdc%2FDAVn2r%2FvJAGgEO13JbSonql4mJRGvZQ3frzYCJm57s94BhHXZmfCO0yj%2F3%2B1%2FGXf0ryQs0m8ntg7PvYJN2cBWenkmuILa%2BDUi%2FJom2dY1zQbjXXe26rHZdtcX1DzShupkHAIOGtkZ9rKIHDCDicmuY0Q0HOme69N73ZxR6tlU8c1%2FMJAsoYAVdsDcl9m6GUyVE7THy2BTAwFbYvphRpzG%2BJKGbYhe5cGgObLFwTcHD%2FrJHtms1mjiWiQ0eJlV09b8D4i7tLiHLaozoTacXE%2FOmQjIu0nQYu5vJrvgRYIIEaxBpcUs3EwwmSAMFrQK%2FJHsWdvn6ensWTSyU6I71uJ%2FqaoC0vJWBbK1FTBXE3S%2BGjZWHBshxYpYm8%2BsCdaJZiWoP%2FQQ9JT7jSigdgigdxaAqrEzfQLiacJN0bVIdTknjyCOs1yxWcdkjlo4LNBcbe6emVWoS6whMdJ1ytsNLWyI5e79dxxwMdaIb8%2FgOcinmp3qTlavtoXAZ%2BWgQ8X8MctV7%2FjiUQpQjxgw7IyZ0QY6pgG3N4hDKRrJdZXPKlrYXbo95y69iym%2B5%2FAY7NUYBD6ydigOgLI4ZrmUGjwijihERwUuvXNxfjAPeCCmM8CbLBwesq%2FOUI%2BIerOzCav0VvvPZcaRL9VMaZmN1lBQFCDw0X9kTgTe4LXhm7PF1iBnzchpLOUlTHruqOyuilRCFeAJi2U6sjqQYLVNwqFh2cyCO07egBGCZ6oImmsWyKnkpqIQocSn%2B2U3&X-Amz-Signature=6c6555f210c05ff115de348bdc7bc64b53e2a88fd791b95de49e2a47b7c8925b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZXBJDRRA%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050118Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDmjgeww1%2BNjfzBHjpNYHwngMet%2F1wl0OmeF1ws5d4eFQIga88wOjb297lVH1Wy9KfuQHlJGG9kynJu05Zl1qgESMYqiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBHOJJtw7NoX5%2FF8qyrcA5MshiXyUkcubjdDWs0YuGtlp34N4rZhuhCQKbMvv7kFhoCCC5HiEXPuET5cwty1pRm%2Bs2Tv4LNdrBocmXnSG%2BpjwcDIu5JkGBBbWiPxIeuJXXA%2FRfTaihJE5IO9%2FeUoGDgz1gCCbPvzzQPRZDIgN9McRt19t%2B8bJqQlyZ43Dx6eN92gwgx%2BBkvsO3FJAQZOIhtgf6HFneDtdsWtt1Q2cGKIwjncje1IvcI7fMYk5lO3WimPgOdM4Hwm23BvccglKGVMIuw%2Bj4aYab8BHmPhYcqW60guPI4KqYhHr80ASUrny9ro3X9eSyktRPwVKka1MHLJzdd7oMu9UZuXv1TyKf4wg684AoqpSldwYBklbWv%2Ffr6YhqLyL6FlEfw1Fih3J6%2BiF6fyZ9Cht4WhYAzP3zOc3Sf8Dsvje3sO1IU3Baua5FxdHn6KXU976Q7Kt3irAxOBXRnWDuHXAXCvnQhWhjw6xE9vu2A6%2BeOad4LKgzgUn89fhQGOQHg3tdeIaGdwjSoMS1Zz%2B%2BxzY9iI0U%2BNxupgMmrTNYz4F6KWpWF%2BECdvqIJHpG5I1Nnh8UeOhkPhlgFKvKn6YJxWQq2ElTb7N0b25ki5deZyfZiMWECAKMrLITQc51twQk2mbk8kMMuLmdEGOqUBXztTKyRFuxlCgtuGZnsLofyDp%2B0yKhlcSCGgMKuGGepkppBMf1%2Bcq0WxTj%2FtozBZiQnlSChPpc3IkuBxFX5afHexAZjVR7pIPx6ky%2Fh1hX8M6ckK63CJ09p0tcSmmEeRwXHgPsLTqgqOzo7J43PN96dcDIgMEGFlp3%2BF%2F%2B3JGCa1FA3BKBfVQLtrfTBYIzMjBKLrhuhzUYMj0717jqsNTAGhJOzE&X-Amz-Signature=1e8f1f6da61c252bf11e008b745a0f2ec1d99e560135828783fa31379f69c93f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X4HJ3GJE%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050118Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDZ8Xmv6IvERbmsaR%2F%2FFfCgYdzErU1VayxbnFyqiPjtaQIhAP4MrbQpkxt2ZMYFXOFXZ6HqKc8X5Wnnc7ukkfrq2VVwKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzXOw04m8J8YBBhlRIq3APyBOOb3v1Vc6kXcLO114Yc20T7Ez2TyYiflZKbWbXFnTNIx3%2BdhejC7M6wa4R4UQz%2Fff51%2FsRUzb7X5L2pWyb7NNlQEaGaLQqaRKEtBEha1gYRRSUFI5odRaly0nA5Vxw4Frwe0RgRAHNIhSV2lV7DIIZiG6N%2FiSgviV%2FSO9GT%2BA6pXBTx5Ztiohinc8UJgy1KUOfPmjQnC4RhX%2BxeQBkbUn4ue2l0IKhMo4oqTMIXyfye%2Fw%2Fz%2Bmq5QrtQDhfka6X%2BapxV0BQvWmXRmAljlumBfwmLxJAoSTIJoAkJJlhgbwp%2FuZxafy5EKK%2FZ71%2BNScKbnX8%2BGfOL%2FlCsgMhXt8mCU6JauMzzRUtBcOPxMnTyfol9ywSZRl5p15gIwwS4d4OjpB8rtL3fC2RiC27biQDXw5VrFVM9k2GZZT2cTxq%2BEq93ohxoCbloZSiea8x%2B9euM595OlzDyXpgRPzt2MFvLqVLtU9ZV6WbeCHo%2BkDTmKlpzyL32zvITDQFAEjQiOg5p0ipbF0yW%2FWt2X0N%2FjN%2FanUmDCTlyiuc2B7BGYqkPAFyj19o3aXzUdxOBa039DNJf6gyImCe6DuZujw7vsZK88%2FQKZsaIDI5blpSHTDsH%2FuU7hD41g7FgaswdBzCjipnRBjqkAQYjH9HLb463IfjJKfmHyzWMrsnRCbS3Hb1CJpZKaxa0xSjCvrCC71g5gAedE6%2FI%2Fg2nL7pQvjvnZ0WaRUfa9IgnBrcCWjidWD6wWl1VzdGIBLu0fda8rdyy544bCQpngE9%2Fvg%2BLubFVWGhjSSB4jWj3GCAFcEY7I2a8H13vZFr7RtF6U64lW0qSWwKSa2UPVhwtKxhpUMTLr37RqWE8yNBlkSie&X-Amz-Signature=9c5a6bc59d5fc5a433aad639b18da350c2f9d4300c660a4a4e2155c1bae92dd2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664EAS3LML%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050119Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDdTHYCfdoFQ0uZPNUJCeEqIUmt5esPng%2B%2FtcaVG7nNrQIhAJFTDI2Sfa0%2BsZhiHACnbIloN3Rq12ISp54PbANnLnUhKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyJtYGuAK1oFx8N23sq3AO7ot9BaEAFUA74Khp3Cb2jX9UhXL4DI%2BgGRLF84TX6%2BmBj4lsb0Wnt%2Fx%2B%2FCqjfF1Htk5erx8OOtkkfQkf%2Bh20oLigaUFENM5qtgZFBYtD9BbX%2FikobXZTc0c4W38%2BLGoGt4TzPXFbguBEwwQfqUWicaXUSpiDXfyuA8rhVPgQ1KCv2%2FlYZk2G9HBOX83bPk9EoopgErJRJrcI1D0hJZkgpUUFwAeRKXOeHQpysTs18092cvuB%2BGzVJzsJBZAMR44VFOR%2FvOtdGcI%2FboJAgqcD5prgfrqfDZOE6vL42sHz2mIt21eaMyr%2BCor2ApAJihrQwtQff18f5tBqKTYWzY6MjoFIih0kFm3wxAqhnmSEi%2BgDI3BM3PkqL2eF%2FrRO27n8Ztg8ZrYeNXE%2Bx%2Bf9cQvaz10xEwuSXSJhAz1JcE4UycJxmuSKQ4Smwvpt36D6D%2BvdGidEVIB4RZC%2BDmMBIb8v1AODjEQZ04n9Uu%2BVGOgG%2FfpRa80%2FNy0s0bMryfWL7%2BYgWpr74TAdzT5NJwyybfknEVfT2KYWRCmtK4cObWbkRDLfxrpC2HbG6yLGH%2FHuL7iBr0HhgR3hGNid6xwhdobrKuubAoJcfd5NV7VzOabmRURuM%2BMoSjA9MKJ5DPTDAipnRBjqkAaBWdNh7S4QTY2nq3S3mBzvUgBWxiv1g3UkWuuLx6UDIX0eewtF96CA1XS5BbBGgsGbem53qLakyhs9lu4k26NCwEQEyeAysKCUbbn2dCNyP6w1Jr1WRtLO7MvdTF5ewu5deLcCbq1MEM6pOszOoPojDeXtsOBURHGievUz9JNGFceWPB6Fx1KVLSufQjwrtC2PG4U0cdGDfHc4BDObQeQaqh7R6&X-Amz-Signature=de8bdbb5ff516b478ab926f9abe51ff9d9d668bf211f01c2937ad00e1cc287e2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664EAS3LML%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050119Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDdTHYCfdoFQ0uZPNUJCeEqIUmt5esPng%2B%2FtcaVG7nNrQIhAJFTDI2Sfa0%2BsZhiHACnbIloN3Rq12ISp54PbANnLnUhKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyJtYGuAK1oFx8N23sq3AO7ot9BaEAFUA74Khp3Cb2jX9UhXL4DI%2BgGRLF84TX6%2BmBj4lsb0Wnt%2Fx%2B%2FCqjfF1Htk5erx8OOtkkfQkf%2Bh20oLigaUFENM5qtgZFBYtD9BbX%2FikobXZTc0c4W38%2BLGoGt4TzPXFbguBEwwQfqUWicaXUSpiDXfyuA8rhVPgQ1KCv2%2FlYZk2G9HBOX83bPk9EoopgErJRJrcI1D0hJZkgpUUFwAeRKXOeHQpysTs18092cvuB%2BGzVJzsJBZAMR44VFOR%2FvOtdGcI%2FboJAgqcD5prgfrqfDZOE6vL42sHz2mIt21eaMyr%2BCor2ApAJihrQwtQff18f5tBqKTYWzY6MjoFIih0kFm3wxAqhnmSEi%2BgDI3BM3PkqL2eF%2FrRO27n8Ztg8ZrYeNXE%2Bx%2Bf9cQvaz10xEwuSXSJhAz1JcE4UycJxmuSKQ4Smwvpt36D6D%2BvdGidEVIB4RZC%2BDmMBIb8v1AODjEQZ04n9Uu%2BVGOgG%2FfpRa80%2FNy0s0bMryfWL7%2BYgWpr74TAdzT5NJwyybfknEVfT2KYWRCmtK4cObWbkRDLfxrpC2HbG6yLGH%2FHuL7iBr0HhgR3hGNid6xwhdobrKuubAoJcfd5NV7VzOabmRURuM%2BMoSjA9MKJ5DPTDAipnRBjqkAaBWdNh7S4QTY2nq3S3mBzvUgBWxiv1g3UkWuuLx6UDIX0eewtF96CA1XS5BbBGgsGbem53qLakyhs9lu4k26NCwEQEyeAysKCUbbn2dCNyP6w1Jr1WRtLO7MvdTF5ewu5deLcCbq1MEM6pOszOoPojDeXtsOBURHGievUz9JNGFceWPB6Fx1KVLSufQjwrtC2PG4U0cdGDfHc4BDObQeQaqh7R6&X-Amz-Signature=9408e27f5de8f32e8b15ba1055644cf2ab4e6def856eb6d7d47779a719143b1d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
