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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WX4GUJA2%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034535Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDNMir4x7nCyAdx1EJrXm%2FkGfis0cbjN2vGA94q5dPMtAiBNUkI1Me6Phth9UvfUM49RlFhcSo%2FqkTJT3ZuC3NV%2BySr%2FAwhUEAAaDDYzNzQyMzE4MzgwNSIMXhIhdYG9DF1mB5w2KtwDWTSGxJWjxzPtYXwtGeWkhaGhqLTIjV1NrrMaFWsN8bFuPQC9gIrX6hNPmiDyW%2BenyrTdF3lVvkRvCAOAzQWSNmvEJ1zuBaShlBrddwmHd3qMgNmA%2Fm8fHKIp1xJZERIs%2BtrJLpOh3CFPeKP7ILL4%2BOvPbkVmuWNZ1TveALjDvJK10u1jAnnwyYnAB9tsqRawXwG6%2B%2BDt9n9GMDAR5F0O%2FKUNd%2BJU9ZtcXNQgNyoPYTRPbPugB7PEfX2H7BOHoHaKTST23PKW9AC2HPS30cLgDN9YChbjrRRYD2%2FusPB%2Fgnz6KPKjWSRqVEO0OGS%2BedFx%2B%2BAyJysYeXXHgxJl7A7dWtmQ3JyAIGbzM3Gl%2BHdalTr4hk%2FDbOc3dqLUsaDUzyRRurmb7QQMceczpy613DGCK6z5Dyr34WncolQk87%2B7bEgHmWU%2B8Jhryw4bOGn0YyxLi9m5%2BWd1MzWK4NH%2FFa2bnOttV%2B23bRymlfG8riJJBNu69QQYWP3W02dbpSAuU74sBcD0zVu1ecVxft3eHDhL%2BPqcvAjbe2cJx8vQlmaExne7Yf%2BteOW5f%2BukfQLuByW66EbRo3Kl0Nw8Xp%2B5kfebhnzD3GJSDojyVVG1fAOdXg65b%2FYo4ZwCqQQr%2BAowlIjszgY6pgGdQst5Qkw%2F1%2F8Z6foj5NgX8R7lMaddAu7wqZQTE1QFdMTHAzCcMs%2BoYo4ksIMeelk4kMIXkVsytBjw02zMDtFDMoFEUDU%2BKDAX%2FD5evVqCbfBrDYIBAl80ItsbkyIBP30tTYp5VfR%2F46rZm6WoE4aD2%2FPR%2FsoQeR5mheRMtqyCAhu8NupigGFPRckLClsm9lFDogCsvQk3e%2FqMSkJpex4ydINBYtCO&X-Amz-Signature=8fcf00cce50a53136ab9ed4b12c4e738bae481fa6d9277f57a37882bafb7393a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WYINTWTR%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034535Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF2BQaE39aRKqhzUBT6ez5BJ6XcQF%2B%2FMhD%2BMJSdNbvheAiAYkxKXu2PZFOZ1Um369nGvqBXm1UqEmq4XtyImnPgERir%2FAwhUEAAaDDYzNzQyMzE4MzgwNSIMHozZQnMh3W74QXOCKtwDjmakUmnje0n1kz%2FnNjQQfkE2QNBuQa%2BIeHFbdx4ze3Ji0L%2FiBsS970VYHv7A7%2FqTRJnq2YFMNc46GWL%2B8kZKuto6ZHmlkQOuMy5rtyFJ%2BDUEJxUeaJJGtoyAbhsrpub6oKbGlGvn4nu11c%2BCaKmnLvJqFgA1%2FYW8DOQLiXtOiTlBk%2B5vl736ZqHot%2FluNzkSbvIzvgUFAyYQ%2BzQZgcXT5N%2FPRIo91lp8EB4SRZHkSUueTwYTgbGPOSyXhLf%2BCIAJh9kAH%2FMLJymosLHLyZcVMd8PBnZhkvY9urAM5fg7l8jDOJy8OMB2reRXhbeyMyEba%2FTNGTkdrEoT%2BH4qB9wUPQTjjzsqs7uTlNX1GPgMzXizyBmDKwf9Tj8EwJtwiAYacTuftR%2FFeEZJV7NeIrZ39WPxA%2BIcrFxxy%2Bjd7jNsC%2F%2BiorCDKHShbBmyllnKyZIclDQC%2Fk2LKL6JwL0pQkIXDWCnCDYqe%2BFMSoP6Bq6S8LQZyeuWgfjix0vvvMnMSfS5OpGAnDeSFc9gl6ERyyIRfWiQrdBDFYXozf4csPOPrS1%2FC1lNmcV%2Fl3x8UYQACgRKyy9G64lAYZDJBpt2RqvYcdiY625SbwSjCuGrLVtFCDdRj865lhpJYGMYTs0wuInszgY6pgHVZvYugKGy4i1RGEdI2m7CE6pFh3ENpa7sz0b8Xbvq%2FSrm3iRNmAdS0ZynhZUT2raen0tKvg3E9lgJvYsZS2gA0yqupowdZEsG49G18kwaVgPg5dcpYwFnEhHJJxIcO1BwymjwjtLKV46xb7npUiq2cvOk84q%2BtfcV1Ea%2BaipZoKYzWvcm0R0vJHt6m9x1cl8CWMpcvVviE2RjN0u9x32txw8cj6n0&X-Amz-Signature=00303b26890133e7c365db9fc3ae7c4fd0b9b3713d71186f7edf721957078835&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667CVPNXZC%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034525Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCHNrLQKbpUd%2BBBeYnOQLcFNy9vO3mcAsdpH7GmhAoMhAIhAPcjHdlx%2FFgbNsB%2BrzFgB%2FU3xmnFlNG3Vq00QvC%2F7GY2Kv8DCFQQABoMNjM3NDIzMTgzODA1IgxwubgyFnCZKGwmPfAq3ANBH9wvCIAjvT1WaWWKnq7wwMx4Ac7yfX7ckjYOrVbOPri3Ggvp9Dm5ESyDcGj1MvUtohRVAktEhitEqKwT7e67aLwTZE7hjwAP%2FuRJS81O%2B6iuhpp7oAGhstnCC5lfnrQ9%2Fl2Lhi1oPCW6AwChU8yLgSMEcDq25gJbBXWfAxuxdGRs4vFfi5MffE5EnNzngKLciEhCTnpC3vhH1AW8FGIVgM%2F98tHpIL6B0C34MzApE2uRj9DFg2sw%2B%2BSTG6fG5fM6r79IkunwnlTMhBVADlLJZaW1MC%2FFDglRjfhjqm2DTFCZggcaiYEL9Pa9hn5chrzazP9HOAevHMep9%2F%2Fheo3ABemoyVxoNThS68iHWoRcnDdxJPm8xHScH7k%2Bkwen%2BRudQK%2FdlqilQmnTRIPlAEH0EIBHtMr21UsMwsN%2FJCY7EIXrLvqqfUnt6uM8GIlA1AP%2Fw4Zm81SSFSFw8pqzDp8QDfPiuZi71lDlT0QQVozE%2Frb%2BDO402sWvueKNnyjY%2FN%2FvggAsp6VsI95PRVfjb6wG93QlPwHqOJnQ3NrvVTlKSxt7HYpI2AjC46tQeh1d97A7r%2Fb6u2GdA1ttz%2B34XIa74SG9wFvX8YVVzqR7VuCq2VGg6PQt0wRzXTlNoTDIiOzOBjqkAc9dtgwwEEmtACRx1n081AZdASDoIjva%2BE84sn9NU8B%2Bp6qIn%2Fk63HjSdKH8dZRcYJ2FAniDTXh9H5fsF1%2B%2BIxlEOh0DwZimPaN7nZod5Y%2BLW%2BID1%2Bc6wOf1RY3VL9sPG0tbrgUA4ln92LAZnAxdUpNHc%2BNp98t90G2bAVCZulBynXC4REWr0%2FC9Zf5KAY7A9g3EyOIkHEmFmNmeA58b3oW4H3P5&X-Amz-Signature=23547abf6e323fcf504a7f9ab668455d34befa63da6915dccd9617af4672bcd0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YDFHIP3X%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034539Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGZ%2FUUawGmBVGQsFmHvkcMr4tktyGUKpmQdZuKIv3QWVAiBUw6jaSfnQ78Zayne9UDn9tbXkSpD7gfQvSXLIKQbjWCr%2FAwhUEAAaDDYzNzQyMzE4MzgwNSIMjA9CXOqsK6tonPlXKtwDRR31MEbCHBkiKb9dArEyohrY2I5IJULhzokrO8%2FFXP6%2FDVq0bOYvyIxIxLam%2FbuZQ3XWZ6Pl2ImNdnMnB7j3JN80veQfBEE%2F%2FkOmAYApAZe0t1jtdsr52IC9Trmi7fMdnizHrF11Baqj81qxyE91%2Fm6xDIu4AhTB58mPIp5IhpUmVBF48oeMsX4060CnbyYCa8DOcVtvfd%2FwERqhBKFI8ZjEyLmxQ%2BLqr5G%2FJvNC8BxZmenGe7WZ4GKu%2FdWpqqm24Y0Ozcj3W5p5MLCXtG8F%2BUa5%2BRRcJY5W3h1OPcCtuhFN5xHgpj4IYp3M5gfsLVQPQp4570BcEJK3K6vDqBPUrf8G7K6o4j803%2F5fO2%2FjZm8K2xXPDqpKwblAsdoaX74s3pTa2gUMrxlIF9nHcwQhIxiyipqIbdvvQeIXm34e%2BNajBpeOdh6FngXSR%2BNEwWXzy4%2Bq9eGOOcgfbXYdOLT2TMOL3tr%2BiI5Qvd%2F5VGujW1CwId1nWxe%2FO%2F6yBZC0YgTsKZa6ACuDryYlJbdZigDt3bm7S%2B1neFGHKBMoumhKMCMHh1gmKPz%2Bpf0hmcvcT2ghVTGaL6%2F7TgV3NrDHnNGtqFUGXZGvcTyXTuA0kWBHhUryhu18e1WG4Yrrpc8w7obszgY6pgHo19nKXbLK3jwE9sG%2FqRyKzzJ0f2glbb8n0pClOGTSkQ%2FIZurboC8ux2zl94Rxe%2B1N9DNGFoQarR2WeWy5YaIh8w63m4Xso5jx0GBmAEaeRnGY%2BxLBpb5v5W7%2FOmIR%2BbYLYBbGiLsGKjP%2BdJ5hOVYj6l%2BFd9jp6zOSdqntKefD%2FeDEiMeew6hpU5qKP2wvn9CzNovH2GnbNU%2FolPlx4ucjD7e4stzV&X-Amz-Signature=5fd097a78877dd6a4e7f448cb8da4a3d2093ec0ef86014c58112b6312f116ef9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UWAEDWV4%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDM4uirtGtlsI9JVoDStDydXhSNtXzvWysKjPxW0yqQaQIhAOcBYS54KIUTdJCKzpyO4OgdZbEj5Mv1tcyk9c3eIzZeKv8DCFQQABoMNjM3NDIzMTgzODA1Igz1ang1eQiFOISpthsq3AMs4LDN3pzdSDA2eOYpmoWFpnHbekishOUVzu282KXmToZE71wW4dtVSj7TiEt6PxakGvjy4jqgzynqUbl1vU8ccQcldHRkxPz5enJE1aPwRxZcEKcMoDPiQk0o%2BviPSQPryXMJ6HtP1IAyuLC%2BKVjcXvpeUFmdUD1IVsWi%2FdLxxwBTfDesn3kdTs6M5glSom2tjdj7zlHNOTpYCmNeNfyZJgOxb3KDzrIC%2FzDlEHj%2FiKY8YqhIQ7%2BxzTMCBgHQ0%2BnD1i6oYZ7Du0DrhkTg1ffjq5QqsuKJ9i9LTKEr5%2FA%2Bl08ro8iTAvUbt2EASu3%2Bk8M9%2FDXutIZCBh2H2fD%2FD7vRAzAwAAjjb6IFBLI8MtI%2BLzUuG%2BZVlI4r0LTS%2FjZoaw65XBRtCwDbUVqUOY0h1PRGyTRouXUqsrMN6GWVw8BvJxHn1kfx3uheZIZk%2BoTQutY2gL0tVsYAhX8StVHi1af5UEgBRVu2Drn4wLWOAej5%2BDwyNc%2FvWFpDODke%2FzKVWL5GXMSeaUkuSffWkwlBkFDBJ0Dxq%2BWX4S1jwkYa55cAZ%2F3YSLdDVQYUpyd6nfWZx9pkNGjoQGmSOxvgUOGAQ1BlsUaTMlBD2dp48dclbOcRWSv0NWbZdtcxQ7xosDDrhuzOBjqkAQfGJWPo%2BZwnLG1cBbrEUqDonJyjN%2F02JA9BSsBn6%2BgVFP%2FcpUojqqv2I7uBpemoi5xZu%2BH2b1f2MyqwKtfXUUFYuhVXaPsOVymQQfTbspRzGSkDqkxEfDCL%2BBrQ2BE0Qi4NU%2BHCntUsReCQDPVw9p20fz1myj80p%2FOWqEbjyDtLIHEXRBCS%2FhzP7SxAECq68sDa0WpJ%2Bhe%2FLv2O3c85fsxKw56t&X-Amz-Signature=b0bc81e8516bc6ef348ac25e5b64684d8b311860c567ba04d55b51fd301ca5fd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QIOICN2Q%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034541Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG3h0B8sm%2B2TLUpz86I3DNq8fmNbBjcH0HzarKEiNeULAiAdk1qSyYC%2BYvltQLsMs8WI1axIboSPNUwwhR1uCzA48ir%2FAwhUEAAaDDYzNzQyMzE4MzgwNSIM3CtLYTZuUfwe3mupKtwDnk7Vd%2F493HBjPndd6AjvaUST7IAevApQ2G8bpNynSKhWLIErDQ2NLaikug0Cu1Gtfe8ufAGxOpjZPAfi8Rzh0jj91GThr2LBp8%2BUtP4P%2B%2FDQeNeOyasXxmniU3E48%2B%2FfwvQkY%2FMoS52exmlqhM4X%2FF5yeMIE7q80QfmcH6njrOSvn9x%2BDwHGQMiFPbRmkVTyGWYxfD1Cnklt8R6tFGqrsInQK2urrTGNvWmJv3Ij2dVG8TxEx7j5P6ocDtDmX5b%2BlUQkqS6mFSBU0MPUeBHkFEUwKP00q1KA01dnPSYrmWcgnB%2FWhB8XfzNe%2BVty3NF6WE4EzV2OnfKFimMt1puU%2F4rc0kPJPWBwGMZruta9wIaf%2BHM39cJGADrRj9%2F53XvMWR%2FERshgKRAjjfddqUAsy6QHOWnHuUDnvwHuaVuW%2Bu1HcIcEECnW6ynSQltLVYnR3K4u1lWRFcrGxRF3zO%2BymfNmqDFaXFVZBmdk%2F57%2Bzab88MVOLeXLoWYSxMD54hZjAULUE1dDT6lIT5KqAgKFIqHhokajwByL6LlEDQHVeWURPzhwsezEgc0%2Br9t%2FZSijhNOKP%2B48F0%2BaVNj2ctcYV4gO7OVyNBSTV9f7%2Bx6xS9VMtudNSIf4%2FItRJxEw24fszgY6pgHoid8O6sdKEyuivYORladHZEou2dimPGGcLCI40uBVeY7hbBv5K03t%2BVKt3zvBvszSJqy6FKz1kECgovVi9ytk8Igfu4lsT9aCYHULTRytrCDDprCckr%2FqJLTKz0spvrayrWYjsgEl%2FAaipISlo4H78DnDlnCLJ92Stvbikv42j2h6As1nw5uZbhm64YZA4DKpUoD5Fjcr31ek0x6e0ZsVR0eLRa2J&X-Amz-Signature=cefd51bcc327a3f424e9219b1a40c369e6b461c3493c162ba8f0146cfcfeadca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YUNQ35DN%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034541Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDqIFJET7V0vBUwtAluqYR1gyr%2BdT0HW4SfmJEmW%2Bk6ugIhAJBplheLvaGk7fIxGXmiE6BsBIlxH7ZvtAqWVihpGUR9Kv8DCFUQABoMNjM3NDIzMTgzODA1Igwx38BChosyahxszbgq3ANPwq4C4BvJ2eUevPHrDn1u3vaXNBqiTmz9F5Zwf7o5jtSSv48E5rE%2BDSq%2BBL5MQnidm6HvhfWs9%2Fo6lbnX261%2Fi9%2Fu9zlL%2B9IQL3CgpgB1pfRyMcljb5p7dgacc6xR7htCoSE218DZNCVUkX16rurRC4Nm2msEmfsUusrY%2BN1AMS1dprWqdrUfR6haZXdmrGbjGx3YbArUQD48HOGk%2FDroAxUpL9FWc4x9%2Fmhz8UG8n1dyjJChdsDMOE0k2esbExFyJgR0KfMJAQ8I9DMVk1Q%2FAn0HDL25FaWn6d7CldYdCGTy2gujhAHYluIsGnm0%2FXM%2FRCN6nuIGAndrzQ6aaO6pxkXqYzpmj0dqsIwCFXnmg57gIbR36jD%2FMUI%2BJDNdeYAXNwIPubCsDUEF6fzPXziY6LMLm95%2FZZglVXRafgWeDAyDHpQOGKu9X8Q04zEiTW6AvLcznnpdcz9dq70tOIOa8FtvBFCJKa8olhl6G0XZ7NiUmrqaVmWxYUNPYL2wBsWrohfy3rEnzs4QYwSlN2fajUGFQue6Sf%2BoE0wUrHKapZLB6i7HkmaG%2BJtz5sG858Y2learcfSB4y1QlbKSxoLorWmr2XoIGH6fGmrgAujCgvW9muQZv1IGMNqvSDCKpezOBjqkAaUROxQ%2FM2sHnClIDqE%2FzUxncO2wY27Zh2pc4CyS4X0pdZ2oFO7LnfVXSUTMk0bvfMNfgEjZeB7ElQVZZWAJEDHdJJ0ZWujsvw6yzaWDvNcawfI1h2Zfto4B1%2BvJZf7hrT0EnAr7M1ZGwZpnt5q1mGS7Yobx7UzdizvCOR7utUCf3WhjCyTcQpvUhM70OiQ5mkMCe7Von0hUVuGfIxtHh%2BIVQ2ep&X-Amz-Signature=95915929056ae50e74b0f27d0137ef03f7f544efe1eb6d4e95afbec805c4951e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YA22U2IA%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034541Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDBTQ%2B2scsOvbq9uE%2BBzw7f8J47qFQpwdQkQEdyXCUzCgIgA%2FhZMiJBezmCZmtIfJx5T9H64Wa9Aah3mMHQ0v0VGvwq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDKSfI3ofDgh4gfNIqircA7lw9LHDEBB4XORNaACzt1p7h30Yv%2BPn2r3%2F0uPWkn0gGAzQ8u8%2BAHzCay6ClEeSDD1%2FhpkkXbIYEpFwRDuV4HHCsjJT%2F7FFU7JoSrEFtS5%2BuQJz8dAl3gEWCsMa2TQfTy23FCEtLS5zd21BvBXE8gr%2FOfJPl1JvLO1Ms7Jl3R33JIzP3bEEt4OmYWZcOVDSHl9w%2FLyYCIZIgcfqS6g4hmp0e2pjYJuBFsC7%2Bg8OReYE0mlYb502IeiwzXp9u9XktKARFer4ST0j%2B8GK9dIZBwScsNqHSilAHDWpiA%2BOLPdpf8AKeWdZbnvj5ZAg%2FNsxOb7vqoauMjFb6TA8AWIs4qRxE735bq24d0bMyY8xqbHCGqbd2mvGuKf3%2B9mRKiZi1HhL20LB7tz8CxKNeVhkf5LeAjsd0wPZDmfFraEAWdf%2FmsvGCLfAvD3pvSME3F9%2F1aIijlOFM%2BIYfk7usUq6eBfwA8neDx1CfDho6RNNIjrLPxctr06aRBr0MnTVbLPh%2Bgg61lQMstGy56jnq%2F0m2i8P8MNh3Tsfs%2B8KUi%2FnAvRWqi6dq9UjNzKuZwFdkAPjPyg13gIODd7QhLzz7jagciHBItrq%2BA1bf%2FYbVsjgnQjd0txBttYgdvkTqIaYMIKH7M4GOqUBnxGofhDQlNIu3fI%2BQkIo4nrSSfhYFfwFNn8v8tcw4vpUARSoWhE8mkWK8XCQBa2hYQg4be7ZQqYFRec6RJ6%2FSCt5uRq4VsgnNhN6f6swJGbuaeC3fmUP8NE9Sn%2BNcNe1e7w6GTPVOH1ruRorzZpQFYT8vL3xthSb8gajrsVBJ9N7z2EJU8ALCvGeXo9AzsZJ0lg1JNa33hlBfWP%2B79%2BC8WRti0j5&X-Amz-Signature=bc95fab189b91aaf3db5d1a12995ab6006a45e54fea95d4e53ce646e5d5842e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TN4KL7ZT%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034541Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID8b0h8N%2BLeneBCq11%2BWJeYWn9r8vy3Ku94tPfOYjRScAiAmY227UGSGBYAofm%2F5hyzj84NJDoUqtJX2EoZHRbgoRSr%2FAwhUEAAaDDYzNzQyMzE4MzgwNSIMZ43J1lJ1zSRrcQ8TKtwDc3MqE7j64LtVel33wp2nctNDxyDuzbHF3OZ%2Bd8V7a3phPrkmJ51F09bOT9xG0uvoB%2BZr7QRYnqXKsFJu46WqWsUEsR732RyfehER83E5iXXJftgghQDwLyNZH6BSU3urRe2wIZe3zq77t1AlcBW8B41pkL%2BUWsHBbej5XsHzTxEOgr%2BqiOdJblq%2FPI%2Fw7vwGtOd3N1a1DSEPxfsOrhVBuY2WmGh59b0vKpbg0jA5B%2BU887l54Xj%2B%2BGifR5qm9g8UJuC9F2EDyR0by2deaNr5pmgWcsvqAEqKKZZkibR3nbYg3bB2V6ytDYeNmC02f3smrDCHakHx%2BhCEXTcCqkjcsOjNuPIVeIxdkmD5hmMt5pUuasAKmXrPiYi9g8eF5pJJU9a%2FoOUZBfRRabfY2c7r1qxIfr1lRzEU50rtxnVmpXlnin%2F2BTJvt2ow1bCqYK0dU4Q4iMpCA0u3g%2FVsIRBij0O9bhFTMpdZ4vswdkJI8y%2FNWWkJnUMc%2B%2Bj9cmvbAQ7JtnQIhigN1Vq%2BI5z1XBWKTavp0uxUEL%2BVgG0ZOvADJ2jbPa0%2B818dPZoQ0G3IZnZvswd1hDctU29Lvz0xOOcfvX5u%2BuXSnDF2TsOyQHSyEH%2BB33w279BitBzC2Qsw6ofszgY6pgGUWbBWKHX%2BOs%2Fjb6x%2B4cczdAsC41T%2BNdebNw0v4SoWXBg0rvZ8WqL4Jl%2F2JQNVFVOxRaoAZlGZceigZjyX0eI97bIUnU44RMcmLnwGVrgSft9%2BoMJoiKE5cv5Hi0ldebgw7m5c%2BJZ4oK3EYgZtZ6GFqLt5XfH8H5gjp%2FA%2BApVPXO%2BiYtdO%2F4xe%2BikvcED1bcaBajNevzJyEv5dg0yRgOhLx5cxNfKx&X-Amz-Signature=bcfc5bb958362f191f8dcb9104b2f0282c8238b1403f962396faac9b12ffec55&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662TKT33GQ%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034544Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDN4N8rXrLjdmlbsZWkzcSKslQhWwqEWVFMhCrcPO1apwIgCaH3Gwev8fNcHWG%2B7lShGIthHrjriRitNCThg%2BqD8igq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDGoi2mSX75hR7qWv%2BCrcA2wg7C6iy3vmr1KafUzyOY1whyhH7qIUDr7qmUJvBLAhQTHpQhIdVbH9BxQLQWHICVl9lsrYJwcQWh7p2bXylDI9YtG%2Buqhl%2BNu%2FZh5m3W372dgVYNPGGnfmVQBctBpcNQcXl5X2xmg%2B8SgFKCPnv%2BJQFcIRhDJ6Ql3f%2BnZ93fagDYnzmIyBWeAi1PRtoUWdyJmFD8fa8FQ5GtCyYpmJsxVfV%2BUtzG6uIYBjHjhoFc2%2BpxlJc6XERI%2BS6tt040x1Y7uwn7dpRrwC5wk7YUYOpC%2BoZeh4wxYvtbV7nBRgJXwg2VgcF6UWbpZeMBHvI%2B34IRXjimr8T%2FbGz6NRrYYwmKBJxSOyLirH27sPcxZFVuZmZpEVs5z%2FzR3q9QpOZQHyNyDpG0CtYFkSEEImzZCbo4qIdONejM7CRfb8vazxCEqtzp1lpBEi5%2FKvHsmBSxJimrD8HbxypFxAL5Al8MouBoTr1StQeQT5tuqkgutElZUoGhwxciZBUkm8SyWf%2F6H%2FFvtC1iTwvvbAKmSfwUyQQQR%2BzdIucd7pMJvdeiVkhbSOXf3fUkZpMynjb4kpT2SYOMXTgYeiwAGpNB1yWeXvOalV4x8w50YhWs8QDvpuP1UMOocWT6xJe0gDG0hqMKuI7M4GOqUBpeslmoTy2wY8WvyEmRTjrbOqEZEedLGrq43pL2%2BG1zPODIfDQpornAKUN9%2Ff3NaNxXRdKRsze7nuaHlkMhjKWx9Oapj44mArI17X2iZG3VhzZJ18%2FqyHDAAI36tApUeDaJIl4E7Toq6%2BQH%2FMGmbZy0dbfeIup4pO0UB%2B8wiZPvrOIhNGG4kC3MUXzA0VZvZ7XDYyhPAd6fFhBpR9VSO7CmYW%2BO0n&X-Amz-Signature=afa7ae572b4feba55ac75df72b74a5954304e2c45c8f5c5baa895cf4da977ad8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVKVEKMT%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034545Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDP3C0NNS9zIttLnsRSSqz46NEG69MoCpOO32MFJjlTfAIgCulr0g%2Fd%2Fx0U2W7Bs4pYSaM0FSMZ0DXSPk5CoD4UvuQq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDIvNIemZ42WUgmY41CrcAwiWOLzgRI1QpH0%2F%2FQtkEFUPsNYEkWLJa1GETSZBk13gWVKg6f8qufZty1gVHXJr%2BN0Uywgg3u9MouE1oYCDJ0PcL1vJt8fAt6GpqGfHIprVemFe0OqCcgKrC6a3prC3CxOALOTzhJxcBTtH5gLw4TQf7xT4dUl2LWZPc8XCeUJtYG37EN%2BFWMBX1Yhwo2R0CqITRhxVqBSYPyhmMGL3ddcQCSDgxeyLOZco97JzmweWPtulPFthw0lYyYPtKZmVXBEUEvnUdZzIm1HTxmw7wQfRcD4bl3dYE33Wwt%2Fe4cUnEpxbKXZEJMLrS8DlycA7JZbf9IxiWlQcXtwi1X7pkPTDF6xPiOySutoeKQchoVs7uPWJoz1lXGk3VtKQDiH7yvrmxYpr%2BtTtH3gaNVPNlEmHZ6353XVV%2BlseuLQhIAKv%2FCoQA%2BqOIrRZGOoeD2fw4dZiqM03c7oo4DNYuMkVylb98znV5ohr6lw5o8vsdcw1s%2B39ZvUik7qDvsIrP5Zgj9aibVnPIhMOqq3%2FT%2BvladB1DMcRnw22jKjPdaa7%2BJUDqCiejVUDZU5eI8tbNcjjJnNUtpJNm3uyZMVVAPJqum3PHU4VugzpaL4RdMBpY%2Bvrg5IONy%2BPr4urkp5RMJ6H7M4GOqUB9rotUcjSWrwgrTwd0BWDMl2iGoBAlbFF3rqgtgq1b28CtfB68WsWFl96FqxXXNfkspqddZjecPDV7XEd3YnQPYj8zIPnbr%2B6Gbr%2FHjK8M9PBVhwi%2BjumZPDxZXNpe9KrxuEChF%2BiVVPzhLcgqWEvjWGUHqnLvUop806srUKTFF8RbNUBs7gQN4kVfY6LrABPjl8Cg44de%2BPzOT%2FwNMpiDXSuIlbD&X-Amz-Signature=78f2a3fe86a7d19a00ea836a7f43f1f7959ea6de96768af501185b1d7132b8eb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QVRVWXXW%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034546Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICCkXo54%2FIP5vi%2FCs3i1bkptUivcYwAAoXaqV1n6bKWQAiEA9p%2ByaY9NOKj%2BiN8GjVe1QeL00GNVkvFeCnva2vtym0Iq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDFnDtEF7fhlgBDX54yrcA8eC9jwSm2UtctR15HJ%2FMHjlldU6ufc9xvZu9txRF%2FZFvlGe%2FgmDXfCxKyqvhiQgFq3d8muq0rLnsv%2B81TBrAtsK6YAWNuHQyevzS%2F1Jjz154V4mp5kbqH5pEuirSKDPnUPCjwbBE%2FMFgqTJT5JaWrHZ9Z84gLcgTyIOXmD6zvQGANT%2FuGw5W4bCSmLArD6fxL0nkiJVkV5hQWbd%2BjtCrQuTh6zuN8DVKLonilHF6s4iTWKnAgbXKueUgI3Agln%2BeixzwqU4P1aF3YsqSa2Xez7BjATQ95sZJrt24mLZjVppIny0PzTyJLGDP9pYc1MAPV3EAXbLDpILDliXB5%2F6LVIn6mShgfTWyhZilLH%2BYeG%2BhupSBoIKSiyypq2a36oJWrh8OZDs1pCjf%2BCFO5f%2F%2B36WUbF4GKeFun2e4KMaw9gq%2BKnHnynOHqTU6ivtWZORAnYvh2YGlN3sfgRzWrtDTLNWKWn77An0iOEthflmZyeoVv9JNaFpKIbguBUXvLGap14%2BomveIL5ac5j%2FIcALHBAw3V9sr4%2B0thBB6Eszd2leb8h16GaJ3ku0t9WGDMFKTHVOg50wrXLWW5W1AtiDD3FYFXEz8m2Dzt2F%2Fkj4t%2Fbt8eSStuHaZGBMhHV%2BMN6H7M4GOqUBvA1TYzWfNjIIcae1YZOPzpC29GnETyjSxEQadUgMQOiVApjRgRLyPS9yoDMyTr8rJWo4gxhbJOd4%2FyPFQngfr%2F6Eo8oOJMruIanzEMFyEviIPqf0nZEVo6CzFDB27FwYrkcaJbZ196dK7ow0g%2BGtXo1E9dmVCdEzsAflbgIi6HrQxZta8Wa4bYksNOwj5%2FWn6i3GazWYPQWcFMDMZ9ogaWSCos2d&X-Amz-Signature=fd5cd75f245370bce2c05c8b4684959aede0f4be9564f9e1e375953483ce4c08&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666WLMFWRD%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034547Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDib0n6GI%2FA0JAEU%2FiRIVAl7wyRJP6%2BPK4dWd4pL6j6iwIhAJqhP4%2FnT3T1KrdVpG2uF2QEeB3kY2acpcFK%2ByPhecBQKv8DCFQQABoMNjM3NDIzMTgzODA1IgyrEmuOfpL2fqYTaRwq3AMFqgTcrgaGGQGDlH%2FE1L%2FCHNB6cZ%2BGA0DAoFM68uJPWSbpiOGzSonsQiOmeuhxoJtUb%2BRCrkKUb5x1KxbVrARcdj1FvykbAx7%2BKMZQ4BZeeyd9vh4I%2F68pG2Vwa6CgmnJb6aCUH7BJXVP6sPz%2Fvqw004M72L1P4ITg3wrAifGz9anAKnLAYpyXBskxKkR%2FxU1Xp%2BejRXhW5KDMeJC3jeWEJk4WkL5Zg%2FjNHsdVPXHXD13VXOGpLbJFNBexvzmj7tWS6tS2o1UHrfOhCTjZ%2Fko6ECsZHf3pweOHezknzoBy%2FK6Ml5tHbg2xrtZyhllZFci40crJUyInCFv1oTErlf97ill2YUFHEjd%2B%2B4nVcLfe04I2JO69g39PoynbTvWN2dBWxlV%2F6zWIT8bwkP5oANlELM8vajnfWVBG1a1SKmguXVwly5gvvTbUYW6z9yUFN19AJL%2B7k0SWGApdgY9n%2FaDiPssEU%2FJumkJYwhUYKXq1I3pRVR5N90jbCtf7yfUdv2DXwOwIcRagpY1VzFoS4KRPAN8OO2CzxDlhBeM%2BeZqBZcTB3ZHc3%2FbS1Y6RsRSUoLfjo74GQ9NagY50ynf2b17tX97Q0o1EilPhq1caVlkv1yyEjA8e1WbXi%2FdWgTDthuzOBjqkAUw5BJY5Bx4z9%2BZ3O4CIujSTwpYiZaqkclN2YIoAVK7eJQdOOWli2UFc3SBdufiT2qjV7QukDYRbBEiQFeOTA8FSwmc1fjH7hRyNnBd6PXS786oFi5opXLmwiIPGNi6N5UlGqiJ4GkzKVTKv5WTZoVyuoRcLivbob2w99UHMILPYNqS5d0yER1BjyJDd83Et3WxJnNAmai3IMg8RModOGRVRo0k9&X-Amz-Signature=acccfa5fd8c42298ba6d4105bbf81b7c9b43fe70469c2f87c00161ee6579e0b4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666WLMFWRD%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034547Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDib0n6GI%2FA0JAEU%2FiRIVAl7wyRJP6%2BPK4dWd4pL6j6iwIhAJqhP4%2FnT3T1KrdVpG2uF2QEeB3kY2acpcFK%2ByPhecBQKv8DCFQQABoMNjM3NDIzMTgzODA1IgyrEmuOfpL2fqYTaRwq3AMFqgTcrgaGGQGDlH%2FE1L%2FCHNB6cZ%2BGA0DAoFM68uJPWSbpiOGzSonsQiOmeuhxoJtUb%2BRCrkKUb5x1KxbVrARcdj1FvykbAx7%2BKMZQ4BZeeyd9vh4I%2F68pG2Vwa6CgmnJb6aCUH7BJXVP6sPz%2Fvqw004M72L1P4ITg3wrAifGz9anAKnLAYpyXBskxKkR%2FxU1Xp%2BejRXhW5KDMeJC3jeWEJk4WkL5Zg%2FjNHsdVPXHXD13VXOGpLbJFNBexvzmj7tWS6tS2o1UHrfOhCTjZ%2Fko6ECsZHf3pweOHezknzoBy%2FK6Ml5tHbg2xrtZyhllZFci40crJUyInCFv1oTErlf97ill2YUFHEjd%2B%2B4nVcLfe04I2JO69g39PoynbTvWN2dBWxlV%2F6zWIT8bwkP5oANlELM8vajnfWVBG1a1SKmguXVwly5gvvTbUYW6z9yUFN19AJL%2B7k0SWGApdgY9n%2FaDiPssEU%2FJumkJYwhUYKXq1I3pRVR5N90jbCtf7yfUdv2DXwOwIcRagpY1VzFoS4KRPAN8OO2CzxDlhBeM%2BeZqBZcTB3ZHc3%2FbS1Y6RsRSUoLfjo74GQ9NagY50ynf2b17tX97Q0o1EilPhq1caVlkv1yyEjA8e1WbXi%2FdWgTDthuzOBjqkAUw5BJY5Bx4z9%2BZ3O4CIujSTwpYiZaqkclN2YIoAVK7eJQdOOWli2UFc3SBdufiT2qjV7QukDYRbBEiQFeOTA8FSwmc1fjH7hRyNnBd6PXS786oFi5opXLmwiIPGNi6N5UlGqiJ4GkzKVTKv5WTZoVyuoRcLivbob2w99UHMILPYNqS5d0yER1BjyJDd83Et3WxJnNAmai3IMg8RModOGRVRo0k9&X-Amz-Signature=989da2c1a1b0433eeda4dd4b9b5b96e429b84342cb46ae3e45289454c61a071a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
