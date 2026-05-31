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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662TOUYJ3K%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045000Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIDjX6umw%2B5YMSvS8OnKU0GHI%2BGzg%2BsHJ97EZT8RbA3CZAiEA3VC9RpzJa1u8bBj%2B0BTcNg8RNtuayRZuJ%2BihPk%2F5vHYqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBQTB5wt94yC4v5%2BJSrcA%2FBTSO0FSPZIbTmFai7aLRqZ%2FMzcG55TcT%2B1usRX6zyzP1CKfqqj7OJdMmIhBTogd62PUO00ZbJH07L9rSKgItAytd6yp%2FYAbvTKARmiYY%2BmGdRVSz3zmwxIm5H6jj1ClUX5MVUuE3oodr99Hp4akck1S%2Bh%2BHNY8mRH6p%2Bq2xsUTnmtOjktCF5sAWR1%2FXvEgttkgV13OtUWbGjUL%2F03sY%2FE%2BOGJnhWBQLuNiFv9kXdZDYGjJpPeoQeGtVGcFY3QFXgYlWDDIZJ%2FYgH2jhcFzUdsgKTZMKg2Zsp0yP6w%2BVCvdNb5ApI40B6mhhJDBWaZz6X4%2BdVooPBGhCOHsD5vTcJkxEAIjaWNzIFiPF%2FaCV3wrq0ddHn4PByFxWWVf7leQUcUTs39wDtDwanJvQ8fUxdTVMbt8O7BN8oLfqQDUGuy0NX9KtBAzxUmw8VM5qlBAssuO7lHaeHgC0fDFIAA%2Fg0AV9G1MxYJDvW0QJVa9Iy7fLfZKWLDiA7NZUUJYKjPzaeXLKq%2B5iw9i4NmAyTZNLcDg%2B01ztgrldUKa9OKK8L9S3eTtp87eGMHKzoaFHOo0m%2FlAkQn45YNBjotceLvZq51YmeGSx5eZGcks2gkQRFIhnDGxwrWojsW8rMriMMXX7tAGOqUBPXvx2zopoLMQGr55PQURscOUg943rM%2FidctbrmExWGnQ0C89NtNXnX2lZ2uiU4v8KgYYZVinr3zXf%2BZUfTjj%2FkLcaXjQIElSD1H%2BHUzptcRhCUvIqMtjpIiqQlQApUp7Te9FjY7EGpVRe56NwpFo7FMxRQvNCCZ%2FI25GSoPaqmE9FILiXjBjKJu8CuTfQZSsk7xFVoLuR6IsWaQm5OnQxNfo1KKH&X-Amz-Signature=c525e5c568ac7d4e994b61540f9484b4093248e329565707242a6d7cd358a99f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662A3GJDAX%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045002Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJGMEQCIFEDL%2BOv0dIsyPz0h1rJtsCc8zXW8If7ApN7EUzv2a66AiBkZP9%2BK9wmF4qaZ%2B5Z1SuyIp29DsoYi4e2vCZvgiynZiqIBAjs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMpU5vShiu1fJoytnEKtwDxvp%2Bu4XKaUJQOikwA2s3bkm7O3CNKooqKTfP1IS%2BhRLvpKd77W67V15z4zxCQnCWrvrjoNB00WMsTsI16soXSVPa1detgyzM3L4zK%2ByNAcdY5gt88Vq43JWytNzrqIHkCHeFgH74sal06D32UOVt48lNzO775Tcs3qB2VU%2FHvLRNTT6Ch2sS74tWLSFBXhFqDH8W%2FRmYcYJzOmAwGN6y2ENHMqCDFI5obVU5XFumkPumdCOrLZ0nx1OdC6fIXBFN%2B5rMBMXS8qRilA%2BrM%2BdoviOLVGtEja49ZqxHyfWUuR6GqNcEAKg90dLtWp5Kt0yI8J9UKhuFrNipSTdNj0dFIOCKSWnZ0fqKHTXxGDK%2B1NaZL3AobMPaQFBmuORRmQd2CqdV%2F0C92WyZrUGLbXSRRnqaeIhC8OMGFKVd22NerT701MbosATb%2Fxs8%2BEqpjeyyn03A%2Fo2sAJHj0UBBa7w4P8mWcyRDOTEIyAiCmRkRNDcHsYUf9jBkWX%2Ft9vbLHmK1w58oek6Sdi0xwVe8emU74YjCawW3HYjVphSqx6qulIm8Ixnoc59xsZmyzWy%2BXOfQNB86Oanj3ob6Up6nsAw6CwgBr4Ry2UIlsJ%2FohwBkeLti4tDVT%2FUB2x6iQmQwwtXu0AY6pgGiR%2BV60GzastUnEzbkyGNautFy8%2F35g%2FnGIu7obTVrj2oGRvKwZXJm%2F0zCcryogT0du3JQDptl5S%2F5mB49mw4V5Ic%2BM0wMjluCSgICXGD9VrRsGIGFaK%2BRkpspWguQyNf4SAT5CPpA8nnG8%2FMpfOWLTY5bYHBeKCBeR19zUH6C69V1M2yoOOELmKlcy33Ow%2FTRpCWjRDC4sUNJMnc1uvH%2BdtOEsXY3&X-Amz-Signature=1d0c2551fa8676fd3ed4b8713a331c5c2a4c845a8a0e3f98e7717c6a776042eb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665XYPXQGM%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044951Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIQDo0ud7LB72sX%2B80s%2B0%2B8IBiWIKwyFUs6I9H6Llz%2Bzl6QIgN6%2FvURAEWK0fD4KBiI%2FucLwqS5KYhqp4dyj3uReiuNwqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKp4qnJ%2FTPRoMOiAqSrcA7wLXZMS3n0mswGGjwNUZrtfiKj9sKE1VFZIcI4m7ntsj9gGZG2Si49uPtjpr6IF5SMtXhJ63s%2F3Kj4SBLIWp35qTPM4EkLdX2GvGA1NmXbAt7rmh%2Bewv6uCmk9kElsnPmsTU%2FbczV7F4n3QvJI5qvYz1uF8inavdmS0fDgUq0ABQ1FfLcE3czlVwNMLOMXTOexO3xxUzVCfsc6MMIL5Nl3i1A27QaS7dLcwaTIZ6FrLW6kS9Es4bzu8oICj536zx4ikUB6rjhV89csR7KDGdZkGxNO6Ipbwv%2FonRldHLGuW1U3YcI9COftRxhGfvPznl6CIGiWTwOItWNTsb9xlolI2L6Y04c8GgantVXk2dMwBs84LaU6vQ84gSu4iZ2wphCK3%2B4C8bcM3XWpVReq2%2BMAV%2Bp3WZP4BeQFL1pYTGu0%2Fdsza6cUeOrYN9%2Fz4EvC%2Byzc6hzoR%2BO1T2TYgsikIZf%2FlfQ%2FwjNfdoMitdiTabZ%2FgBWbQgEPl3ONtJCZIa2r3f%2BlOBw3NnxsH5G0K%2BpmevHeke%2BaGOLy29v0dRYL52ZO1qKuo7DIv9wNcsn20tn9JpCpLXLhoL%2FTZPcUWYSDxiz4aCXDR0Kyl6ntrEQk93NaQAkOpUg4E9uhUqeC5MP3V7tAGOqUBUfGjpEe9%2BLNdKw5MHWqlHqngIwzXb3PxQCie%2BbdQZR5QmYk4F7nJgM9RWsVNSmc99gE%2Bh5QLLikc6p8K4kA7QG2c7rCeFyehogeF4RXSvqI4ph4WXM2Mw1n6CdSY7kMi8D6iPm5ezkcxkXa37L22t7Y7FckpME1WM6EzCGiP3COC9msJTNiVQGvaUIegGGkg%2FsFg2k%2FHi9mo1B5yi4f2WldDrSYM&X-Amz-Signature=94bea4d4906e1f29f139b95a66948f42a123b837c6d347b24ebc9e8ca7ea1974&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VNNQGHIG%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045006Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQDrKdhdHBzb7Dwsa4JD3bXtHjuZZszjDzJvDMXfllJozQIhAO6kcSChFVlyeeB3U5aj83Dd5vcTHWPwxJvhEi%2FgLcFuKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igwr35W1861ThGi6mFUq3AM9oyfFARScQLtPkXU%2F6K6eShA%2F8oSdz2ptgHltJHdVOYOQlh4qS0%2BSuk2DOP3PM92MSL%2FURVxeTH%2F77dQzppuUM95Hth9fkHjHM8QkrM6GcGdRr%2BIHR4tiwJjRdsmb2qL%2FCEj3OJTkm3ab%2BIEO4pND5rEaGUOz53u3rZxlkS4KjoDbdlT%2F87xlYbx4I5ppwv66mPz4CBhjY1moFUhqDOgWrPTiwZIWT3ImIVCZb2g%2FxGM87wVxwfvTdr2SBFt3JxCI18CVFgYcu3ImatDcL6Qz6tLsjwoDcXvOa%2B4PutH3CtTKwfjADMeJyeXhX70dR0mnjix8BiwD2xKPe0chxV5cSWOPj5bmw1TP5GPcWrbsMxksXPDUuctRR3MmOOieP%2Fcapu%2BpAh%2FsoraoJ5iENH5YVy%2B%2BClHq4Bw9xlL7NpTFNvFMjFHFFjfaQ2wu%2BrIqmUv89NBI0P8VGs32tkLhCTdOoPtf%2FFC5krpI7YAFCDEaZivjZu86lMVhwuiV5V5%2FD3i9b4EkZ1NMugGIu3CzdzXVPj3p7zgrQG%2BJfMkkLLOkDy6oUkLtpU5cV4dQX4FTMR%2Fim3g9VwuLTH66l6CpNIusPRVFwyrpbLvFclTscXzSN062p7nKO01u27%2BYWTDo1O7QBjqkAawwDplkKCMSK9ui7m2lol%2FGWq0AX77UBnmySTi1OLvYVOkSOp6IciNSRVPJKKeSe%2Bf4QuxdENuXQM%2FG3hHZ2qLIeu9NnVvUbHUVmzdkeMmvFhVZHNQ%2Bh1KdeS%2FbiWVAmmX65Yw6bU2UmH6UkutmhvIrjgznaak8kS5RMYqe%2FBJc9xiAgaPiyczsDbu90vSaVWS%2FjlU38HVkvHONLrruU41Kq3g1&X-Amz-Signature=4ab841fe8d896202e103a3886071d87d9eb62b7de0595ed42dc6e6a9d40a19dd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662NSLXHCD%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045008Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIApeh%2BV41wmG5BxN6%2BCFLvcHvtvW9HhXo4eCfyk6oPq2AiEAkQZENNLE1cI8prz8pLMOKP4QW7xZK%2BEa6YYZVw4GeWgqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIx4KwC1ly3EXU5%2FMSrcA20AzhlEb9LcmC0o8%2FGvciFnc4EfWN%2F49IiXMmyqM9bF%2B5sJh5Nnqdxaax1ZV9rtnvodXUsFhwAly%2F0RB6bKOrcetXPL1eXl7X4I8ja4RD%2B3fgq1BO7o65iDkM8al0p3Z22WAgMTY7XWUYHa12ZzT8Dr2osDobSWtgUBejCEcoL8LlrdOyyM3QZSMW8ZlP%2F1%2FgtvvLgDMDwbLQIFxlJGWskiBiAPHwKP86jej1H1wFnfU3QRO2RKHEkID35XEImAMvCAsI5eIfYLAYE6WJ%2BP1DoJCKmJYhSzRZ%2Br7rw6Ix%2FaZTwPq1kS7PPSfFNCa8gkN1iLN5vwCJwZb32g42TVv2TTeqCp0CZm5cqL%2FPN1lqmk%2F99TjuVbgrbyrcM%2BqfKjbCARZ7axbKpCi4DhJKv84jah5nKLq9%2BfDSQOBJ%2Fk9uOsrWglDL51eKdGKewJQFeJJwtG3qDMjclK5TzhavhdIluz0Yt6I%2B3G5BMJRljnHlaR7G%2B0pTjxreCC6G8YAWJo669tvtY5nTY3gET7Uz4wA1YJ7qcaEwUpol6sfctmka%2FfYajpU5JwnP1jBlwhOHaXs8KeUHEsrN3OIwwKpz7%2BWtKlRfQR4sfnCzS6HLjkfqH%2FZHnUeqlRnR%2FNhP9rMLXW7tAGOqUBCkQfmymWs3MmKp3gVTq2M%2BWOaeBUhnVBmPpWsL15N5d20wuUgwd2PcWYiKyy4sfrbTSKOZL09V80jgTJqFe2OaHGnmzGrbgPMTzhdiZ8bm67YO%2FGsc3PUK%2BfIszR2QfUfITyWXTpSkMJcySf3NTDzrA88GG3vZro00BW44q4kxu9uSpLAKTdbk0dOnuzqig%2BGh6WDM2uXAsbGupFgu4zV%2F%2FOBT20&X-Amz-Signature=4afb59b0c9f83ab8cf9e5fafc8de3c3ba107db6e4338cdd18d6e6641e0c58bb3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YBW6YSNM%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045008Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQCAVzl8Y0c73ZwomUMyWKJJLhJr%2BU%2BqtXZU%2Bp8%2FTZE%2BxgIhAKIUWXqR%2B3lxvN%2FwXVEBU6IUT1TwTmfQepQaByNsCVAuKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxkKY1PSuMAp7%2FiSKMq3APd%2F1aC%2FGWz42VqFkXOicqBPiYke8kzTq5xnCnkz%2Bm56ATXiDDOhOADqrF%2F%2Bt7D06RSNnoGQ%2FUh04LQpXnQ24tFa3rFIcyoFqusvB8BWKMdW3wi2Qe3%2FWKXHnfK%2BwoYg5TyRwUlkfyQF1bJJKK1K2fnp6l7GpEUy2nCzfIpxYJhOsuerw%2Fc62bgsLiF%2FyWGu1qEqhghSe8TxeSt6%2FI0YXdkunQutzlsr2lvgoB0AT5TlqNgsgCmgUHgcKr2t06BQITKwZsOEsy8vN88o2QJoMzU7bn65VU3Ftz2zfbW3zmwUILyper2GVISO1%2BOcMf0lVZXHKsRdyEYOFzW5flReZTEsYmlsTnOzqNv%2FdbVk2Ho4kKyoHVSaDKr8GcgAbgU67FHvhPM6ajrTZsbrOB5RG5G1kl7Rtj%2FKJ21%2FlOCvFYeYby2ASXgg6l7%2BOFBiAL0jtyg%2BugCh3UqwwYfALmFaReCE5R7zQJKkNjGRuA3%2FaZwcBCa04MFEH%2BnmcGG4BrlT8RvUVHoqlEzEOQoOggGLYC5tbP4yoQ31z28aGhNEVsXZOn2i7PufYI%2BECrzb6Wf0UYyELOqtOag19pSV%2Fwn0DjPvrwHK7tK1v6GoNNoBgvu2y70XPB9USocaNw%2FLjDR1e7QBjqkAVnPQsH1lFLNyqt6QMKWOVitR%2B69DIB0WwjpqE7VOa1u427c16Py%2Fj8C%2F8XFSkRHfhvRHGj11NL4APP6i5UbmMl06mKj67OV8Xlp2mrLQTcDrx1CdRDTMRanweyeAOhZSgpaeQ5Hwz2tM8ecTodbD5%2BZqTx%2B8UYjLnR9Sl5run1h3AuEahf5dYNcM3xsuLrb%2BrvU7NZSNJ4p0ErLSJRO2ExiKEDT&X-Amz-Signature=0a3b0cd66cc9f07f49fcbad0986652c12adfd33353afa44b1126bc504c44f2ee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q6XTIEMT%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045010Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIQDQ8KLmWAlrPVpqa95oXwGrBXfj4wp%2FxhxKCaGFMVYXjQIgVmluhOTA1cMPDVO1OHOfveFbAMFTAvnRtkaIvGIc2roqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKGJoJPnnSUqtJ4eJSrcA2Qe1asXPSlo8X7EA7VOVARTRIGmd8LxuqGEGll7gBCmLyW1zqN4xQZak9J0dFqg2iC0o%2Fgj7btuFfBIpYE8oCxYnmaToaPkP28Vr8GUlfkI2GKkmlAT8ffqxmqQxlA3W0P8Y%2BKo11cjIr7G7PdTOGNdM1y%2BHXenG1J4RFHncq%2BNddrovKNy%2FybISd%2FOSK%2BGdANhZDz9jDyqafSElnkWKKugc%2BMaoN8E9sOPj4BGHyhu6S1x940s8KbBeGZOYloFaygGiFtfHspYBbeRAkhL3xT4NPjZZjm5FdfIMEReMcZG0nskV6q%2BKTb8K23T6nj%2FjqdB6n1gLfknQAW7xzc1bP63230xLbZ1CSmLRbgfqLAyBDiGPNdL381Ai0yp7cMTTQ9jchJFOEfTMvs5RUcb0ANNzO2gfl3RvCcArVHKxVrMN1wSzJvBlBz6xDq610wwZVn33FfiHEzRvlbltDeZ%2Ftv3kJw%2BCcMeDpORd%2F7VTo56ByMktTbwBIr9jHdQAXkES%2FAJGXiRlW1u7HPICqwU7BxW9ZogstZ17uGGP1jDQ%2BWxLZHgpo9QWIZccup8EZaiCDiT7K17BuP%2FhDy9%2BfuGy0h3G0cSTrZxEGBRixsMwfsxhaBi4Tt0flX1r6GBMM%2FV7tAGOqUBAc1DC2xARqlxMXK6Lcu179R4AoUPidp0Y2Cw4fWm0aYAXTVp1MzZiFzuQS%2FWiykyL4GU59veKzjpXsi%2BjusKrbE5FEiMYIPajx8dFC0KlcJtl7KM0KHATJFEB58xDSWQQrsi1bgnTpgstFCBQ2q7cYx6P007YJxik%2BB7114JZXFoI4GI0Le1KGVxO3DWGhLdMxpWb%2FUnC0S%2FRT1s0xGJEnNazwBh&X-Amz-Signature=b2f6e0579b8942fba9023a2caaf55640c770efee08ad787219a5855e3bf3e7a0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46646RCBOBX%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045011Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIC3hCoA3g%2FQv7OcsKW0P0NnMPiguheldJODtnq05sJA1AiEA%2FPFZL%2BxwnKm63XPii6ZdM1l%2FOFkKUIglDPuWmqEnpmsqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDG0FfWn0ifv0uI4pByrcAyD2NZR6sLfVIO6eVA%2Bf0b83DEFpyj6p1Nmvl9rk5IpjNNvt855ehypz61%2B4l3tLgDGPTWuFLhvhh6%2F0bODAOX6oVtruJsC7vYzVMxGBgsnXhFlfzcFS%2Bc6XB%2FnIcnRZMf7dNaEKiv8tc%2BA8XZdk%2BobQMxZOu%2BZ%2FzWppx%2F2ZNqlk%2FRunpXihFgxwIp09ttsJiNZDw2o%2FrNDWepR7eBZ61dFg7XBrHavjyTnG1PgizFQdrSkOKqvI2yd9jJIzxcCvqxaBe1Txo1V%2FZR7HS%2B4Bo%2FqWyFZ1rz5GULAeMgJHzL3%2Bs9E8N97ungnl8Mp28a%2FNi1ie7CVzlWONXkYM50Ibiv7eyI%2Fkk2qGnhLjBOdUr0TQLJlznq4zZEIvEJ7XFyYdrtfjPqvuG6ajHX%2BVsFOUjuuk0IhFn0wKs4JZ9xSL%2B7Cd4RtEcUu9DLxzIYThAAWXsv8uP5tymooAqZDmy7zWIjUXDeSITWlvxV7LvYuMsKYbRSdp7DbdsvvTM894FkS6MA6s9%2BzSUeiRYGCJ6PDFtlNoTWUv2m8LikFSjSbAjq7XT7btGqHUd754tNxilmxAQHx9MX2yDpWKFzE%2BPfV6LE1XHicrfeYpU8jokshxvPSuXPrztG8LUmtK%2Fdq8MO%2FV7tAGOqUBhRG1zzCe9vV14rltSeVGT75mYY%2BLDfSwG5Fi5pr46Lc8TC07Ll9Jr631awvJOZrKg6Gv%2FgbnuiBKM54zoKBv4DTkd3TUREqy0TXV0RuMQCqEwigVTEohvopUdW9c2BAd%2FWUA0YprHJDM5CBzaXk%2BgkeNI1UdB9fTAkIUTW1qOJbULdOBwuEN%2FTLs4EONN9z%2BcFJ%2F2JrhiW4I42oQv27dJVRmfIPN&X-Amz-Signature=32411aa9524055c4c21123c2deb0429f567e93ec75fda1ef9fb790f222d2724b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VBB4DCC2%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045011Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIQDkgBlrV14Jy6Zmk80qVYsoih5NILtdKpEIHZwt3NX1awIgJ%2FKgS9ey%2BkKvJo8yVfQlONyE%2FV0xxiTAvTvYXY7hVhEqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLEKhc%2B3zcOwCKNV%2FSrcA%2FPPRGGAAkFg4CZxbsaTjrshp6qR3mWcj4DOoPfTlaVe9FnFALvqmxq6BQEc6MqGNkx4W3BE6boxsJNfFlRWQ8VH%2B0nwBBnBH%2BgnchLuZewUExxgFuODAo4CU3O%2BtSdaG0GhdGrI7Gtn5xrBGzwlNZfDW3AIkyKMfrNL0hEQuofB4f0WCf3rv8qg1JnO9YERIcf5tIpNYN1Jk23ByBRNCKYuHLXqG%2FXy%2FzdOcbp%2B%2Fj%2BbUGMzT7XbOdcaxqYLr4ciC%2B05cUu2GYnLF4luZUn658GmPs4YhKQEo7FI3bTQi9QMcJyZp6vQfSJ7da9GLlVLnoF0bd2VBBNoh8LwFgxK5Sq1PkiKdHvYfjt36HVSBbBrbrc9jnlikc0PKpCfh2RSSXh0I9ePzbJ1YC%2FthdXZ0NBcYyEOgbQIsowkUECFV8b9Egxm2thtyQhnxVFIbuBogKtOCRn8TDD5fUshqbIMMNfpcfeX2xQnroX6hS8hzMWe0v3vCmZwcGlQRelxDFKMAShIXhnUHvenEYw%2B%2FZlGqcOLCeySrWqQbXcH8xlGf6n8Z5FKXmYGPr%2FlvRE0CJngE8xfKY6TiKydEgPTLv5pukEclwY%2BakVRG7ArwoGsgNFzRvHSB5eTc%2FmT%2FGv%2FMIDW7tAGOqUBbbME5T4g2sDdmgNyLsD9m%2Fnm2egSo4qRyJJXta%2BJw9iJnsnxIO8IVDCCat3QSMQFcZdJgtuuuwORDMCTBo8OvZfBowutaXe7%2FpN7sRfaPJLfsang8h5MC3sdEJVEqoEfhr3YJbGx4xHLc4ruSakamRdojF40vfKMRAFFhvpdURaIzoPuu0DjPg2X6fdW43zdb8fApVwtSGhQ8sy3n8yuUPP9JFn0&X-Amz-Signature=6ed1f712fcab421238276acc12d171bbc88409d0755822afb3ea5f3414d65e79&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46634MSQZQQ%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045012Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJGMEQCIGcMLMCnGCcBLKLxbUtWsaVF07uFHswySnDqfYAY8%2BnXAiAVEp4UR9Vl58HlwT7KaCblKLH%2Bjfj9Xx5eMJ6Of19gJCqIBAjt%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMNeQZVADNWzhjjZJzKtwDFZcaxMrbkgrR%2BIYfh9JxuLWuDFSpLOnTeF09GuDsDqC27TbM2jJ%2BKll%2BEnrcZdFKO50rZ74fqVx9qghv%2BwNrf2g2M7CuAPAVm48E1vQY9HJGT8NAUEFp8gyQhQyDmauMkbREN%2BZT%2BCdtZANGm2lrzvfI74aUNj7JVxYJ39ncIwhKi4TMBYescVssyKQRcCusomHhI7da2zTIdK0EbVH%2BA2yU%2FASidowA%2BUlREU%2FjD%2BXCRwZObwU4nGDGmnj6kPZ%2B87ocW1KmA9LBriQOLVhGK9fXXATiIEGLqgtW33lfsoD%2BIHaUS4B4Qd0PsPE9wBpzIkLvs%2FwlcQS3r1kxXMgSJGqdwRjedgz5p2LgndoGmJbDQOiXkJK9v6ojAFKNo7cFSDGD0VFW5IZHe7Iku1slJLMfnEtmdh3LcVvDpejnDge1FgArhCZkzj08N5%2FIIVyvsk7CsMOzmPBDhFmKjvnWMsyf1PxR3kMSmgWDEXMqVKwk5%2F5ZoX%2F1k41ZkYV3IPn6XEt4F2ru5NvaRMmJfUU4ILm%2BBY7I4FnsNunaqnolyZqCBnBETqoHpbGdQsi%2FIWDyZNkDrQRy9XaUwZJZZPJ7jDh%2Fd8vg5dl%2F0CRZVxTJvXwIhwYjMOwiH3%2BKnUkwkNfu0AY6pgEKTQjmRZwrg1LGWK7S9uCIAmGT1d8F7n%2B2mUWJPS5R5s2nXmOAqjHV6p77o0j5bN6Ic683DThPFvfUBR0WUVI6jhBxmKQVzOeazyFYl%2F2I9Iaz8V3W1yiFKSM%2BD8AYGAU%2B0%2B237iMCQcJFVxepw772wkgGkZMR%2FDo2MN83sVTT2o33M9BpLXjx5IwZiD2fSZcnV8EPmaxykiDTG0BbwE4E9S0kX9V3&X-Amz-Signature=7cd66e48749683de7519ede86be4715974103d1e287e3f7fa61c6fc94c44a1e5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VL6UX6GU%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIDpc5gGKZRmvlXgj5D8jyr49qmUpN8F0xgN%2FJC63zT35AiEA354SxLxH5uIXDJi2Hfla11SW93EvmRHjcBVBHs%2BUbywqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOD5dN5uQxX7MaTs3yrcA%2Bc21oejrtsyiPusnLTiwKIaq8lUXMm4USsRzt6T4nh2SiTYSg1OjGio%2BUvm7JHNR8g7fXmhFIZ5kNjLIxMpzZjc78a%2FVXfNLZ3NSDE%2BuK7NdjSIPqVVcWdc0lnUvwYpplVlNaUJELGmch48%2BV7ZCzn122jy198a6Ux95jEW5Z7CEMvIeGeP%2B4ROUHvxUBBLl%2BMgG8PxblnI6xKeZQ8ADDxp1AWnQHnT60yuacfqysgAj8rZf9GGYvnWl%2FWoppvLk%2B942xvfufmn6K%2FrFj%2FRSlEutsAfVdlmVqrhfYUpkMOsDWc6YbHIv%2FUXAPc7s%2F%2BxUjlZtgRCrqlWP2cdgitGERPbaoO9WLktQSDefRxT6I251cK8CqqtpBsaSfZLr4s1KsEremWN4bUTE7upl3n3k6P8NVeeu6pOEY%2BYXaXiGuoNIu%2FxOL3UoesZIAsuLVysVxNw0xh2njdj8eWl1o6d77bbCGxtPev7ow2z3Z2DsjODiFS5ATA2Hfd%2Bds1EU20%2FYOaZ7lRhvzQkfUlqJrXWSN4lBiBo6N13vQG1jLmFRrqBBvzXmX0BPDUYMeHmrXna8fXZDig1nsXH%2BlmACzrERiTYTJnVPVYodROEzfZy3K5jUtrV5H7vbSVLGeDUMI7X7tAGOqUBx%2FYn0TqSrTriNOBak2%2By1gaLpCTwlxOvPk9QgsmplG%2B0qOScTinFY1c4UoWQAlo2ynXngzZ2zK%2BDC%2FuK52eNzohJ%2Bd4zhCXN1is9bn1UycKRkFKrNGkt9puMfdGTAjZC7KHmwE%2Bi1DuQ6IkRWbVoEs%2BxCBf4i%2FQih2I%2FfpX7IEpbYShzCunVh0xzS7cnzMy5LrJMQbsM5RRCvUWTIA0GUcSSdnXJ&X-Amz-Signature=e34e666b30f39140f281b67b926e44be981e9263208baf2d8728bc00ed710d72&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664MG72TUV%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQC2T8Fkk3gOJ8%2Fj0cn4ydOzAVq5dGYX9CgigWdQIggAvAIhAKWCM%2BiBdmG5vmrs5I2F8ZqQa8SRsdLFC9DEPH30BrTiKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyufHEVJd8pDFOgzpoq3AO6SGbSB1WEoCRi%2FZDa6NcO0i2EMFP8Es1MPRDdyV%2BD9Z6lIZd6US4zh5relrFK237zyl8g7B2BqHKnL289eYjZ4bTf1XUg2BNKgnXWhjL75NGA92k1IlCaEnFWxSJ6vAKC%2B0umOEepwbZ9Ct1T3ug15gS8jeI2KrzFEqFTQYf%2BYmGTxoLLYw0WLTy2SS2NmaksBOEuL3t5S3sz3uAmljeNPF%2B2Cl6zqWXmGYObGx%2BtxBvkymz97QJcYyTDGAQK5OW%2BPz1ls2NQYCEeI96MwqzjkdSELqakGi266hB8aLMs3RNfG3b5GSH0%2BpsO98VkKGH6%2BlKisTBnvs5joQrKntllyOtNGfpE6JW9w8NTRREDp0YGLaBlFq6lNp6pQd240jjreimkqLa3KS8bkfdqmSqdj8fto4ZD5AZRlCpGuPVTNGZaB86RBvIRrWuTZ4h6YMJcFg%2BAt7mTpqt%2Fr20wySqRfXpoIHPMd9TIWmceZqA1x9ymIgWBZbnFMAJ79tZJBOwnaVuRuRn0ZsIg24gR3N3EmaDTp3Fq5sj954nNm8umDzuPDm0yozhQc7DIyllqcRDXmkWLDTiVVBUZBW8FcvvxSW3iJH%2B%2F3mwIIHjzg6YsoMRKz88xnLX5HjG7rTDE1%2B7QBjqkAYI5dIfM6m9xvThM5GuP3BDQncufVMmHBMw6R0IPaU40LS1CPAbmasjLWmDy7tr%2BjHiKsTwSDUDJ35P6pd8w8LKOyyUr08Sy9ZUT2xhu2ajF02vCIyfemvuqaTVSjTi2jmYZcsNupPVg2nkjJlskaA2ohn5od0areKHv5HUraKm2lsiWuKNW10ckkyKMke5czuQg43t3Uxu4cAZ6pDH1xtMs7lUN&X-Amz-Signature=60fded3efd7368d9887e764d487df61d72d1f3c5a55f9e6806d7041e6ac7f923&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S4SCSVJO%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045014Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIQD9qoTlT6jZ4n2j1CzNcQw4OTAmiUzgpIYwqfwwYWm9%2BgIgKMBx8AQPjYrNDMEPtPat4ezuUHYWSFVpgY69tgjOjWYqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDG94G6tl2La8%2FP6%2BwCrcA%2BvZZFBbX3EDZ9aqDzBifjDDewe%2B5aGotbRfgwEZpF9Zr3sEOkwfgZ2XQ8QOtRmB9vMnVCKFvw44HIE3Pwc3noQB9%2Bxp93Oy2gAGNFXAQlN4kCp%2FmVaa3mWQfUr2XTlolcQA9R%2Bz2xj0uR9OymzLxGeBqvrT8UscuQzg9Ay6wxkjJCbt7G6biUGKJFtYPpjiu63mvGBt3zNHcCw%2B3xgymh%2Fie2kHFzqXda6vqOl4OvhkjxJ5QO%2FADCShhu6L6hkCjIyDXwPG%2FxVy9jGrSx6dG2Dyh1V9fAy5NcOCgyx3pl1YyGbGWi9mZF%2B4K2aDkotTvneyMxT3rIdeecEiwFoinooOg8um6u6SJCwn0OWWcsBPlBPLo06pdFWgQIhKQ3nlDiF%2BNT60ZPoLHyh2YDAndQcPnsQqgQS%2B3ynNjvi8vHd%2BQBLfudY2BodNOPqxIT7RCSxTuTL2hXuWL4iw8jDFAL2zfQ6N17aH6doOaIXYrgzZocIxeoBIkfx4mH3oWcmtCdabYeFaqsoJLnXfvTT%2FhsANTJXz6Vi2SuPhe5VGyWfKvRNcMeVhieoXzLS1Y1r1FdTymFUEMOLGAkUtgMMfH4kKl%2F1yR1f2k9f4Vovo7cSOwNy%2Fh0q1OJ7jPFWpMK3X7tAGOqUB6hEmUEe%2BFKbYLfMdeUwTksB34saOX6KL0R8e%2B7%2B8vFaZemcepfzenAXwmLPSPF29Y77rh0Goqw1DHLWLEVg7npkggCnUHY36XxXLYg7qBfIoWsMj26REB8Ed27vKtAJXhvElCgc1Z5p71iZryZ9t8659vWzF0ZmGyqu%2FIrkO9GHnoDeYGMB%2FR%2BvNpmVCO927g1%2FRaeKTj567ZRfhvAy02Zu39NLh&X-Amz-Signature=6590635a67dba2648a7e004185285f1defd0fec5d31f0a39df7fe29b5f9e5dc8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S4SCSVJO%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045014Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIQD9qoTlT6jZ4n2j1CzNcQw4OTAmiUzgpIYwqfwwYWm9%2BgIgKMBx8AQPjYrNDMEPtPat4ezuUHYWSFVpgY69tgjOjWYqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDG94G6tl2La8%2FP6%2BwCrcA%2BvZZFBbX3EDZ9aqDzBifjDDewe%2B5aGotbRfgwEZpF9Zr3sEOkwfgZ2XQ8QOtRmB9vMnVCKFvw44HIE3Pwc3noQB9%2Bxp93Oy2gAGNFXAQlN4kCp%2FmVaa3mWQfUr2XTlolcQA9R%2Bz2xj0uR9OymzLxGeBqvrT8UscuQzg9Ay6wxkjJCbt7G6biUGKJFtYPpjiu63mvGBt3zNHcCw%2B3xgymh%2Fie2kHFzqXda6vqOl4OvhkjxJ5QO%2FADCShhu6L6hkCjIyDXwPG%2FxVy9jGrSx6dG2Dyh1V9fAy5NcOCgyx3pl1YyGbGWi9mZF%2B4K2aDkotTvneyMxT3rIdeecEiwFoinooOg8um6u6SJCwn0OWWcsBPlBPLo06pdFWgQIhKQ3nlDiF%2BNT60ZPoLHyh2YDAndQcPnsQqgQS%2B3ynNjvi8vHd%2BQBLfudY2BodNOPqxIT7RCSxTuTL2hXuWL4iw8jDFAL2zfQ6N17aH6doOaIXYrgzZocIxeoBIkfx4mH3oWcmtCdabYeFaqsoJLnXfvTT%2FhsANTJXz6Vi2SuPhe5VGyWfKvRNcMeVhieoXzLS1Y1r1FdTymFUEMOLGAkUtgMMfH4kKl%2F1yR1f2k9f4Vovo7cSOwNy%2Fh0q1OJ7jPFWpMK3X7tAGOqUB6hEmUEe%2BFKbYLfMdeUwTksB34saOX6KL0R8e%2B7%2B8vFaZemcepfzenAXwmLPSPF29Y77rh0Goqw1DHLWLEVg7npkggCnUHY36XxXLYg7qBfIoWsMj26REB8Ed27vKtAJXhvElCgc1Z5p71iZryZ9t8659vWzF0ZmGyqu%2FIrkO9GHnoDeYGMB%2FR%2BvNpmVCO927g1%2FRaeKTj567ZRfhvAy02Zu39NLh&X-Amz-Signature=55f73b6f7e69f3ad0e96c3996e9f84c553693ce9488932691b44630ee1dfc3c8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
