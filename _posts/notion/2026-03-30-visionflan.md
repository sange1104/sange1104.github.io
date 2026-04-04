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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZLIACBZV%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031454Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICJbM%2FrCThMm7%2Fyr0%2BsWLZTjvHjyyS1uI7%2BLD18FqDEpAiBO63H9bCVOL0wO2nD1QdVUZQjiEt9OSyC%2BoHlUl%2FskcyqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMHGYW6WdCxj1h6U2GKtwDnEzOO6gysyiYutXg10mQQgYmdp%2FzYluwxTRZRYU4YWX8MFXIVYgZ22%2F0Qxde5ZUQDl05FVMpMoYAOV4DH97xomjfL1rdNDFO04STiH3qqr3MbUX4Ubt4FGq4hQxU1TbN5Xyv7DjpNBmbtdUSN6WIceOeTX5t83CLZxLqg0hD4YVgFJUbMULPf56goYh37vQMAsR0LwH%2B%2Bco2NUx1%2BVy6BusUCT%2F0caT6Mpm2ExserBJaUzRSK6oXY%2BXdHL9R29fss5KPlQv2u8UTLugMRJNeJhWFu5m5Q%2FtGmKlUHu%2BVW7XrGfmW018WjpZo1p2Y9q2yI%2BbE7E%2F8SSnUpa3rnuusq%2FLtzDiTrPopZnGk5yaGs3PESv8M%2BQwKt0%2BjqYYXaYJqu8L%2FhooqptUraJjCbWXyNHq0nz8klCexUoPFw65k8tr0YcDzpdlDu%2BECRSlBVVSdfYJzlz4%2FvBchPkOb8gORmEh0nl5p1Rcf13IBIT0xm8PwFjq398aCHFyyotBIojTu4GEbvriBLXkbMQBrJRgZgJHy6dle%2BPjaJUxHGz5GJn5RUngupzjDAIQVWcqzcpJhiJVyHbdOIeEl8eNLR0UJvaMNQWRUkDISZYvq%2B%2FhagcloxxxBjKBWQN3ydM8wxOTBzgY6pgEMSMOhIDvsMA3xXrAeCSMlkcv%2F4Fu4B8W0Txr3qIZwoih9jw7fRmf2MwTtrsjMDszcGu7ICoumw6dY%2BKZ2lvQjS0MO%2FRSLNrXyA9YI7IsdpjUZUQz9M8eCUDSgHmsc5GaczOl5i2kV9W86BUKTUPKQN%2FWKB3l3Z0pgwF9lzZREH7KNpQRifYfXZ7mvfV7M9rK1y00Bd8cSmItMO7ax3ZmgjaA3%2BhoB&X-Amz-Signature=370fba6918037c553ae0ddce4f146a07c46c55eb4377adccf07f41da4d9423d3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663TKY43KA%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031456Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDkr%2BhQcV4h2L21GECHvbwE74wV9UbdkXCyWQpkhr%2Bk9AIhAOk%2Bggixce1VwTgRADB2QpbT3r0JBpnpRi1b20TwUpgqKogECJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyeyqImKq21m7t%2B4a8q3ANkaIZ7re7DgoysTVeFOKTM%2BbZgbzGIZOlRwcAMPOwByVHV1Fp1%2BB%2FXDhQtaVNkQAlIgShnhfu4p5n9u9uVYH3rpRgL%2FxLh8dyvL9vvs4M4GRkQEZggdlM%2FJ1N7jGaLobTqh44Tpjnsx7dWw0mm4ArUL51uh%2BiylQ0i1pD%2FA5gQhjPfV%2B4YbHWZbb%2Bh%2FC%2FCAGbnOdA0bOji%2FWXMAIFtrKOVbMdcSK3BplsrRM0dEWLxoPVepEtTyQQWrwKCqCfgXZPg1zIJNspVI1ZD4XVsqFzqEJH1jUfVSNeolUxUeMZ6zf1tdqw0nqNhyow8%2B0fhGeAoyIXPdW0EGqyuyOOunlrIT%2FP5n21sPDHyywcilrG%2BnFMDXKsNlU%2FSRW0qcKJYJ85Mh%2ByF%2FpsVCvvVmHiuc3d6H3tD1FBw03%2FXRxWWt%2Fn%2FdseSqistub3SMUPLPBJoQU3528DwOtdj4fdhzkCZMixliLhuOeU0U3tNMz1rDEsJp5KcuEAFaUSBPyC%2B6zjifV50Dlxy5ww%2FT7tTegorHuP%2FnTVx6A3ShdmaM9Jz78iGH5fXyAe3EYESpSvci4D0j8J%2FqJ9qAuOgHP90lMfccjOXC27wGD2g70xBU3wWGLviQDgBmqdaPBPpPT1K0TDE5sHOBjqkAQBb4zf5THedwyE%2B7U7YTq%2BZOZRznVNqQ12hjJpdXLAU8Epm56cjvOm5NM9k2u7h07WeSJILboo6eOT8Fpb94Ndev83MDom3Ism6NpTCyL4bwCqmUaXpx1oBpnXAGUgN1rKQRYK2GhuwIufPPWMieQDBhgjditbuiIrzyMGIeXAA1atZihuk8qdeVI9q1PSi2unWQ%2BN1b0q0uXjtAGnjn6gBtEd7&X-Amz-Signature=a940f30dc645289d5515a151b8762992fa1faea074ecde8f5e0584ada37b014f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WTYSQHOI%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031432Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCKUqBovwpb1M3dW19sf5xWRaeBLe0LdvQb75cBvD28ZAIhAN17gEpvMfyrYvNrs0a0dIL3jxhi7XelSJQAwvmafbxbKogECJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxvski53z0NiLMiUw4q3AM20hduw1jUgOfYIwp4G55GvIRNzytBwSZ3T979XDdogIm0sXlgXHtFDpfgrccueGMa2P8zFta4I3pmVH22S0ImlaZUFJnXzh1TgX4Nob253rnnIOmXN1U90MoTf2%2B7YlrQbBwA5FcmBU%2BaelJR5QYhqlfJNrU5CDmt1F9MF2mFJ5yUZHJZiRlEUaRQsZUCIpJ6xVVTrIaEteypj5lozFn80xcbAkbh1bvZdMMGH%2Bc8ZBoBz5tHTatFJJ8G0XTNXomwJA3psLfSvCC5H9tLqPoYv7BFrP%2Fx00X9DOdXt%2FrhgmADAl4hxan22Kt526CcAiVDRHu8xF9frKPEp1tzyBhZ%2FpfiySBhn4T88VpTiAL%2BkzvYLUZYmGTjxQob%2BnAHnd9qQ0yB8peoLr55ibzqeZmvnDelgi%2FjUq6Kxto01akHRx2IxWFXqX%2B8KbJS8GwwYsFUiQEYyr29qklMprGNZgdVfUwrpwiPDEgWA%2FMAfucall7q7%2F6Yv7IjXjIP1lx7YJO79YVLAqLX1C42Wh7JthVHuiI1eSUx%2BjYAty9gjBdosfo81FJBujMkLOGoz7lS%2BENGmqNl%2BFABaCczLpP%2BA6rtu7T3ejGtRoCUkvfQYOgNMiiNtBoH4%2BF6wd0BSjDf48HOBjqkAUJUeVRyTyazoDszOzmIkUYpzO3Pl9yXT6NV6CrBL4oV6Ht15Sl%2F9j%2F8M9Fkcbp9vE2gy9nGxxcVb9nBQoove%2FXGv2og4uTB3uGh7Q7a%2FAmB8N%2BHZ%2Fg98P3shYKXn6fycIx9msiI%2FYYkAKNV%2BkTJkd9zbsPUvbJkhPa%2Fb6J5xF7EH6InK%2FbWhbG8Axmd5V2m1vbTTa%2B8DvJwuotZNrlmHJTB0MiN&X-Amz-Signature=4c42b8b0f775a7e050e13befc3b09037d42dc7b2e032e135e58b7378beecff77&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46672BRCUKK%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031502Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDPzquPJHoN1Tj1sUBdb8QOKNaeKrO5a2uJb9Wi7YIE%2BgIgLTMrYptRiXp5Z0rM96dHG57T2fOy1OIbWy0cd3raCTQqiAQIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHvaO8CW6MlP59IKdircA0GTbF6htEKrP2IBkCBEjXqLSmgoupPE%2BzaRF2cPUs%2FQCn4WC3cIfxXuqj7xRk14vl14C%2FWuxrPVLgZAZBv5kjdOQpiy%2B10Sb40RwSXOThtV2mkEv4Jnsprir0KJDrieVu0Fvh6paS19Gy13zCFpXIGi9MI7bPOnaGBmQGz38%2FmsBPFUetMQt2aQnLjAXMkKIHg%2BCwdMjRxvS%2Bcxn5%2BM8xNRfaIFXSn6pVgpUg%2B8u67duTxL%2BidcSCO8DQ7IjcHH4WOjSlbovz7rcPfEcyt3xDGLvTrtkKKaXGXdjzL%2F6IUQBUp9hRT2D5DIbxh7cMXz38kuuxrFKjI0hGKLEO%2FuPr2rs6N27EnsosvMjSvUrYmk5remeQgGFMyV0Gbw3I0Io09GtlT8CN9uK5wCEHFmPAoFhM472SQXZDBEu0RuPQ3svapklUO6V51s8hSX4C1r%2Bbh8VIiceUDYoKZt5Xkg%2BdinDYcAxgBXswp0ku7dwDuRFzzcqo2II%2FWi96pHr0p6gSrr6txghQdVn4AZbSwwmR1ADH7OrP3LtAYXP3ZC64GcmAtzGWe86H7qmmX5t3EyGSfA2WeiazMgFhiawI2YCOFf%2BsIiXHpmyAxkY%2FrP9noxAyzCUTO%2BbsuKqXTsMLLmwc4GOqUB3siNCElE5A4I%2FfbTu9t%2FjkjSQdARmdCDqKwjl1wiMfRNx6QohGO6W4kHSptJocrERxjTCl2shWtY0GQv2RmGjp8lJpgav%2BW7h5CaUDXQeiP46tWerhEIm%2B4RGqQ4UEn0INMTALgEUszNPR3lowjMgX3e%2BiOCYnqbp5vUTJP7pEO%2FmNBrkE7%2FR2%2BVwGX6GfZbMWP1JGlq7MxRQE1%2Bzt55gHfkoota&X-Amz-Signature=93a5919a2bb0c23b175fac41ff2a35dbaef308f834b27e5876ceba75f3f15646&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZMLI5ES%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031506Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDFoaRo6Eay78ulGEphgGIVos6s3t3bxV%2FcHUTxEhpkKAIgREtiPnIqI67cjDXmSB91CrFZga%2FIJkP4tLjSoVcnIEQqiAQIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIrjY4HtdRV5ild%2BKCrcA4nJhu1oZ4lfkz0tiQsC%2FjW5J8L6QpRJz%2Bxi8bHghLOzG7thOYVi9xsAojqrrUmQcV6YfKiWI2BC4OGzQpPharvBaTOjKjdF5MOkPmxo5kxAYRrrBgh046IrrdwJnOtF442b0Ehwcj5V5vFa6Iof3ufYYXnLe0IyHnt33R0ZIu%2FiX%2BeT3lhwVOQIMj1U%2FO4sqLdtIQeQsNkjqAJMJyLiQzNCJeGb359oaYVQs4xxpwau%2Fg0IFAwY1gwCSyUI4FS9h%2FMt9%2BiU7sJK4h3GciBcP6T4J9D3%2F%2BkXeLOlnLUP3DCFhy8SuNaoagFK0lTiDgU9jWJ3ICEUSFB8YzcWJdmlh2X5iMlyQjGRI8giU77XyofLncwWygD3TW4sDXUyb8we%2BtooqraAKTRu9GbNFS5z2sxwVf%2FtGaBm4mSzx2rCmYmP%2BHBQrl%2FV75WGzIo%2BFeLC2lMX9R5DKlE1q5IjAnRmW7Owcmn11bWzCLcZ1kJjh7FiOclBwBa9FNuEK9eIWPRWOVx8S0NemX8Qp2yQ9aPTI1PXGJtaRWmV4TMk%2FSjbAKMjeKMOB4zUQbod0i5%2B2BGDbX%2Fd7QVu1z9lzdx0x1QM5FeYTQeRKD8blM6zPe2VTxObEZW3q0%2BuMp1tSghqMKLkwc4GOqUBO%2FOJlMsyrHptnfd%2FpeJiUuekuki6B9fnXbDOaRT%2FJbVOBtrMtVMEBzVXWQNQXOOgURiv59mBZy3Tt59SVg%2FMrwo9xiRP4FuWpUG75R5o1AW83IrM3JYkGn%2BuBhuim8ShLWjCNqfmXfI0V7gN6Z9%2FFELOHo56cYgpyb0TJqGATHo%2Bf3lgllP3Fjg%2B3xbvPTi95QhfgUawXYpPvQw4%2FeElf%2BFNqU5f&X-Amz-Signature=efd6b0ce971268dada2b499eba236ad616dde5a649bd74a7790ea8ba06efd034&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YV2XME6R%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031507Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCysMeenPkIl4dp8xp6cdqQoFf0KP395M%2F8meE3%2FBbYpgIhAOlM3ggmVECQz8LXxk%2FZTO0klyJm4d6HvkHyt8b8kWzXKogECJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyvRphxhE%2BSbc3T6mUq3AO95N%2Fl2Cqnh6b%2FtmiVtEMRvqlqrd8ETIIngSgAYuL7Yfh5UONr%2BXNPIVFS1GbTILYv4omFs4zKzUvNLsegCFmMjqbq5EeDxCWW1TP0ZyYZq6d5%2BQKHGrI2PYQUTcaQhMBQiT7q0rspWw9MdXcUN4cK3inE9VEXNBZDOM4qvB5DRp47%2Bpv%2Bt0G%2BYfP6JZYfIay5Fxq6Z%2F7mljj0vG0OPfLhASRQ7ArRLhK761mjLallODlUV2O2bRowbEknOLFLfnftGpz7kLB4sBtk0psfD1hr0lv9SGB6cmPsAvtBikkubRf9pKRWN75lgVlyHodzCIfrknhw%2F7bDKoLDd2%2BqWjqSmDeRuQqYymMU5sAokvDl%2Ba1YpuEMB6ponDEBo82oPQMIPhO8I8xRkAPxAfJhd5UOFbhWyC4bbWiaBZBjam4GP3Uq82mFlxTbVQa15EaG9stxXuyDDloA47AybWk%2ByOR39bHcCeQN9ueLKdmvjRpe53oJAD6n6BXtv6Hn%2BP6fZzyBw7p0apdybP0G2Dd7mvapY8HaG1CwoHhDvklJPi%2FHRGmZJFlPWYoxUE9L7vbE7Q3Sa7nk%2BPJkoxYtDudffAdhG%2BnV7SqgVRM6sSf9WqB%2FcF20O5yVACRKcLsX%2BDCf5cHOBjqkARjGXI%2Fegjv3UGgqJuvsEvQxZk1Mooh7xAy7JH2QAsrpxioOQzSEKFGK978FwZODSC2CKKnsQXpAi0%2B6f57yiYDpRIkF6MFj7xJutCyu5qmxZaR1TFtmCE5H730zAo2jKw84KC2BzOCMZYj5SgwCG%2BS0sVB0DAXJbOTAn2VQNRI0%2Fj4zqoGN%2FtQsLEe%2Fv6NPwFY1ZhqHRkMWSJkzKDhfa2h9TydQ&X-Amz-Signature=7f36f3c6c011edcc02669e10a6e26a3b8e46d795ff22af5dc191d2bf28654df8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662PJCCKCN%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031507Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIE2E7NElDxGV%2BjZvCNwTUIuu2zcbRzWqQEuSAFfvWKt%2FAiAwDrE8QR0OmGr3EeP2BLrR6KQSWGF5iY7C8YhH9%2BqpMCqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMks1HSXEf1hxq00ueKtwD9EqWe530djrX43EVyAI708PKocRsVoVjPcfCesbQXGSjQAc%2BFqvSI16NrOzNeX6Lu2iBpO3me%2BTaOkf2oQ1yVSX21HqTguHkgyWDQAoB7XK3h2FvB%2F0sv7aVZKW8ESoeDxRFrScEz%2FbKWnv9Sgu%2B6%2FxBs29PrCiIljxEBNC1EMT5yuIJ%2B8qsi2wxaywo2UtuUiTfVLrmdf8doeNI50Z6HFJ9nE6I1egAYJ4oMUebVXjsDxtymCplrOtG2X1T%2FbwqYpk9b2regJUcvdQF717aWaC%2F7kI4IrFnGq1SaCG%2BPdF0HCnY9%2FNsUWTeoCAAEKQovlOSFTz4H%2FCR%2F0HBnqwx7QbfAsqH9QfWdbv09l%2BRRBMAC9QJMSTzKZDRbIVKAVSLjw4ELoQshVGdXEFTwOP8g2T5%2FLG31fQhnjm7P0Luf%2BWXr414U%2BsNHMq7uZfb47VH%2Bb2OeXo1JDR5S2NbkEH0wYcKYDzk8YLZtaVXiTBDa%2B6fsKIEoNdDz1IVoymzeFsEGoxE11oA9zEMPhLjYtiXGnrHmhY3kO2bYBDkpMXSdp%2BXgOdgU%2BZkreUDnOc1BvezoQbQ%2BCDA5wFLy8VPQDb5DgqmFMHeqyIitve4a2bkNRG7mdh50jGPv4yr56IwnubBzgY6pgHml669%2FM4VgQhor3OttwVAzKE7BKvI6dfoHumQx4vgjBoFiW8w8BSjAoe72Xh9ikeUmRx8fKrE7rqu9AYm7xutlyJ6I5Jp54A97H0wVs%2FcJ8iiJfIQdcPh3bnxrBSOzCdsQwYLV5ErmMLiIBQ5g57EMl%2ByOo%2FAatbrtYLDezAcTix55XnccvizWQpH8t7jj5VffA8zJypXuhjUZGjRLDutGGo8ft3c&X-Amz-Signature=79c9e057d33570d5759ed9b7f10a35fe5d4164df3809312c4901a06bdf19963c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667WRMYE4B%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031507Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDwc54tvNNOt58ZHyOvB0FEBt9%2F%2FZBV8QwGURXavRmqqwIgbFzjyOum2uhMMsOgIW5VjgHzcQJ%2FFmd7jl2O2v%2Fp2LAqiAQIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMvmOU16nZ7hLVNhbircAzeZlWIkhOjQfWWxIM%2BJAMbAYTAt3WC7LCFWEcVXOnsu5bBz3Fdf9bLovAZRqdbevPol8CoWGirP3zLLgd7TTAi8taBsA5VlnmYUSEFAxgcabbAJRslsn3Z1VruEWhdjfu0r1q4wjsO23IX39lQkuQJM%2Bed%2FL9bHZFCEYVKl2sv6T3pf%2FqDwF0VfUwpaiqZYJOcOVGo1%2Bei7X%2FbjAebg6r6YmCnCVwILwt3cpk37Pyx72Umzhd4VPxp63nDuJ6XZghlqsE2lYzNfy%2Fgj9CmSlN0e6E%2B7sM0qRe%2FJ%2BBvgAhLi%2Bf%2FwPGlggrWVclCrEUqFr%2FVcNdRZUch%2FABnRLMC3toOD2pT9Q72qj3LYzNSm6afOGopZH6nKLVwDkKUyp13K4KzrRngO5wokQNaXDIS3Fm54yQugjT5CclcYWSpko03yYr5v4mTVlUlNhKPMet905wdOW%2BK39yJRY1kqqB9lGOW3PQH6FnJU8xjHVqnkmfD4NxhkH0fqx1aPgFa7vzOOamhLcaVqnki6%2FM5vmxZk0%2FMUZULzZba6KfbdMoIkUteRBnqofLD%2FTrJdEZ%2FXyEpedxenPW8hH2ZibGnRcYqcWIwQme8Op6lAJUZoX2xZhJPh5Fm4iMP9ltB24NltMMbkwc4GOqUBvsklLNHoQHBdvMPo0AQ3urJcimVhvh8hYSuDwQnhN5TpQEY50eu1TsMzli07rSSA3vHbfbxsVbQdN6ElhkjsgHm6rYS0Gy6lOrX3SDgXilyDIQ123251oFPG%2FviaU67cz315iLF9L8hUH7v%2BDlg1C0%2BVgRYYmUZ0Tq5cAb9Cv1WbH4NZJwvRA8dKVpG0LHKN%2BzV7actzyPICCpVFjihIkzzn0Ya%2F&X-Amz-Signature=f5562b919a026dd23a733ec0e1e990660a680549f34b080a474105ac8f94f0e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RYZBAN5%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031508Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCdJsW%2BAPkeU%2B7SsWnfRSQFgds%2F3QMBLEyr7U%2BirWp2NwIhAJTQVMapVFs653J5HD%2B37QB5tbkD5G8aR160evFSV0ezKogECJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwTfdXi93II4LxXYPUq3AOWt3wUJgF%2FoPUgv4D82t%2FWClO5XGWfvGEpkOFlp7309bhBcA4NiA4g6cIJj4vlFjBrkiVb017eYvkR%2BZPMIzNOh1iBE%2Bl1pwVKpvL1lz3XABs9p52mMN%2Fd5uO87XUNe6svU6Iko%2B78BnBtuMFNdfGkDLDoZqgUxm%2FkUKaJSRPKLZ1tgEg910ynnVQxo4HO4gG0oL%2F5BqWm8n9iM9Z%2FlPvmGS3ykLOKbZIEt8xU8jc9sqfX49ZgBOpVjCK7o7e4%2BphnDS3rGXctNeG%2FfbUPqMjOtpIwA6645xG8UIwE7GX%2FNur8ioMCWfNlUv2MxdZd1pKVFdNoBdQmjzvvCqBrESJzgKQD3b1EoUAGqLaEKn3Q9AM67Czpzq7Z%2FHxDq6NDMnSGTziQM%2FZHx5zbRuMfu9joFW4coOc4o5OUe9qKPyf87XuBHLkwrVfRMtpwUnXRZEB67CGkYGRdDvdZAQItUxYvoVqOzMhWWkbeWvei7EK7jRYeL%2BnnMJ9tUIPp%2B9qm8wGQr%2FxpQVQSQegWWXv91Ck6ueSstCzAETIkYpAfFUIhI469Sp8P8wvGW11T%2B%2BpSKyfMiKeRrn0nQ%2Bi0FfUpJvGTU4933r1iDVSY5JQ79%2FvaapJ1mp6UdjbEpaZm%2FDDD5sHOBjqkAThL81dETHf7he3eNh%2BMUCA%2B%2FKVd%2FsApZx9WeDVM%2F%2BjySLohzTCye72BxwWwx5MKR23SF7Bc%2BTL%2Fan5HjAf28YTfpNhkvaCXAg5KMDPi4FsppSGtCNMjg%2BQLDx%2F3suTNqpgEQMyejJDz6JtbsJKVhRA2twV4ILKUudEL8WcEGDxfWfFjVBQHahXEJE1uwVSQaV9EljFjv8IGi5SK0QfO9z%2BrVvrm&X-Amz-Signature=a56e57f54d82ab49faed0bf6c6a9658f55b68778b60db5c6e7158e14acdc7b40&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663TXHVY53%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031510Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHF%2BZCSsO6VnCA3VoxMdVhZ5XcRuCpLbCdfN7vVHljgEAiAYizWoPh67aFSIKIGs9IDi%2FqmSUm8A2g5wF0JDBt%2F%2B5CqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMe6hxvxx8sUV3rDQpKtwDZMWXldtImQLAMYYqCOxxNiQAuc%2Foz%2B4aQwtmHfrc3702OSWnLkQmejoCes11M%2Bbkdj9SvsHIWmWRKfeuH0FpYmoRodZDugx5ZyUWgDXU1%2F4e7IvRtU%2FOzaPRdO%2FwdRdrbXkxLyczHtamoBobCQULvRiUXEdsZ7rZzHXlXxdIa1%2FIfA%2FWAO9YqcdDXWiNO24fMV3EEuTOX%2FMVpCYXe%2Bm7k%2BrukjzmgDWyvR2v7E%2BtKxlJPew1B8jDVXfqA25bSTGS4QPeoApDPqZiHz%2FrV2Oyo%2FtmfMiEDm2hmEflC%2FT1K%2FldYdSJCHDS%2FT0DKq0fsOx79YQsW2HELdBaUA5SSqoTFLO3sx5D%2BQImkbtyTsnwm5E5Gh77IWCMVlE8n5YMPohUZNxUeZvleLM2y0c9T1n6UZ0clKvU4lnCET8yoXSPv32q3aGGECjEFRwb%2Fqsb6ma6O9cmzSBZvof8iOUARMZkUHFPiWIpEIWXk2ZE7x4N2w3rF5jUMdGSjnKmT56333v4HSMwyYLmIjkhfrPnZF1W3ZMy%2BkSxhPJcqq%2BDn6FnRndV7uguygHAxOQPOlNdwZyfGlJL68OVZUXembDKPBQYd%2BIDBRtI5uTnNax0GyPcjt7rVS2SfLKIzZb6VggwpeTBzgY6pgFXwcHDOEr4cwQ2H52t56sn03f%2FecwOANCgOyPDpEGZ6ov8WnPrIcgqcci2hrLz4rKHVB9Wc3w%2F4%2BabUIxDxq8elB5rf9LaeXL6rOWShzbN0jswI5JqNHtSW%2Fge63d6eUcQs9GKfyVDzpfXdIl4MnVlX%2BsUdi2t7g3kQ1zWfFlHYkNvNZMtPA3AIKl1vKav16zD%2FpbVWS1XjXf1GSTVqpENlNC6v%2BhN&X-Amz-Signature=65b6e585c8d4bda4649f34a1ae4345f5ef75c69bff08483ba2ec121a0d05d117&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666DKS7BEO%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031518Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAwHGNWhWM%2Fg7JVBRRCsiuVMSj%2FfPau0KGE2PO5DmCcWAiEAuyGKUnGzrZfZBgAIOdM%2FVd9Yp6rvRyb7Pv%2F%2F9AE9IFEqiAQIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDm6YmLJTmcGoUFS1SrcAxhKhaHZ5%2F8F%2FzJPz%2Fh1dRWpgfc3JJRf5jX55kZ%2B0Z4sIlEEesb%2ByzDUXIbv0F0x3E%2FiL9YiuDgOdwfIA%2F1BLW8gZ46D8P3%2F89sWaZiyBFMpRTweMJ0Y1ZS4MdFn76%2BI2lwhor6zaQHXqOAq1GQOFXuq1MdjDuhnBzod2k%2B964FPZlqBWkHelGDg7bMXqzbgENNOXF%2BvdFQH3b9ammynnLhnEAwt7%2B5f%2BeGFIGDdANzhfgXd3hrBx7nnVh7OEHqSaO2abRrmtaY0PzW14lGqGWNvScJZypQ%2B0tm2v9KWIr74emPCPMV3vqimz0NLwLeoEvSM0jSjIs4EBOT1jLDDUYgF954vjOgDopw05CB6CfKxYvPt9%2F55Y8IDo025PXASEGNTvJemXIol2qtfKVEn3dS3ZVRg8Zwbm5pfO%2F0CAl%2Bs21wVQDNC9wVqIWzxyZGmX%2Fp4AyFQmOSJlAOqgsXH9DenaMbkzXPy8F7yj6TsONIVnySIUx2q1KPh1mJG38DX398Uftwo%2Fsbhe%2B7Ps4f58NZBnG%2F2Of%2F9EC6Qo%2FrIjCsShOYFLhoSiJlH52%2FSkflB1qQ60vesV4boDRIzFXZswtf4hXViUWCElfbD3GoWBsAGpgMBNJIYyswstYmIMIXkwc4GOqUBLL5fUAFDOLgkdUmim%2FpfOojexKprvxxRQm69knasJqPo%2FBjd%2BddnuSGjA45%2BN11k6lM0giMdOW1%2FTImLnyAfnbrjnGHiyIo4skh48pwUtTMnEfyqcOxWU6uz%2FJGmtBtKQvo70t4prIK4U55TmJI2eadGu8DGrVvwiDeAyKtmlfm4tyHZReQvIP3upT2WgQ8HFeDe3O4ONJDaFVYU9XWnvTkrFYBp&X-Amz-Signature=a1eaaca20ce4b8c6611ef9699d9dadc5c89df71bd95b088927d8f17dc859d6ec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IZ5YPKF%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCjaqNkoKMwZfHlaNj5UWbtQh%2Fj46mnSNHOBOluso6KTAIhAN3xlr1EUcGdGlu9sfzYeHgE2C5r%2BIV7SLz%2BoPnrBn4BKogECJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxXX7YcpmRfUXsY%2B%2Bgq3AP%2FxmnyQS4AygcizeX574vLlwjISN47ikFL7TVD%2F0VqreDLfsqCzMUx3HVlqjsm%2Fj6nr6CVAtZjfXfbAhgWFxwhk0tAHbHvExg6CkFPsoHHitojpFJ4w3UOoL7bnJ9Z%2FJUokeeyoX%2FRKXBpmCpwy69Ipbze798pkLFJYOtBd3pqvn9c9dnI%2BPnQavC8krPmH1tgq8OGirfJUa6z4osgWOKWfpaGXNHIWr1dnI8qKa7y%2Fdu3EmwjpXishhs9rV56hOAgVwTbC3bYMuR8CpVBU9nQ3faPrmlqN%2BIJikcmM52rvNnfAx%2FagPYGdbslQZBFPNY%2BskvmwKpgRqskqvO9vfvRyxaS%2F5MjCXd6ClhxVR32my0XTNHkKTD2Rw47%2BsmEhvXDzeB5M%2F2u986aEI0XV5Qvk8nB3VJD1f2mv7F8dBkEid7ElfQtEUH3vS4qTUtCth0t0wOgdkwRnVkZQ2X%2FVL2WGfsfY7i7tdTofz5gyLnhmgRH0suHwInD2rr71wUAvNUhLkBFbMj2%2BJtAS3iLj%2FLjTug5H0ehyAfUUiIMF0KiYfjabgSQKm2Ad%2BfxhTfwgTgEXlPn0ZywlqmkNZZO6%2FwYpvK2gOj7ibFEUJkn1VVlpWYEJB7Pi5lV1ee6SzDX5cHOBjqkAeBFA%2BfllqZQ0LMcX57cPCbipp7gaxrGtQhGWvNK1qpHOhCOGRUB13JrubMZgl1vat0nwqsnaELbNIZN2cXPGg7K6917K1VpYJQO1IR9wqyNJ682bwQ8Tq288RuyIWKD9YTxU02TmoRBuzWXM7vbATKQ2A4ld5Od1MY2KSqmAXbU1c%2BbsnueEM8Rt4a33qsUmBX3biF15hPjbOFybcL3QcsqnVlW&X-Amz-Signature=b3636a2537f2619530f4f1310fc12e0d1829641995d9b8a66c05b675413ee404&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665FOA6MUG%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031522Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDtEHXg%2FFWohCKtYHoj98%2BvVgh4Wa7%2Fnqjv9nGhWuzNrwIgY8NrEVPsfg8XVeRXOqPfcWDyDucjXLUrpQv1IZRd4YAqiAQIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHJXpJTqekJTIQK9lircA1TYlSBKp3XIozTyCXfz0WQsNEtaF%2BwuzC3xzy8Oz0fizqyJe9ue%2BFcIUsOaauxQ14WWbtDNEm2gcAUvL6miuyeeenKHGnSaSk4TtwLE8zz31BpbZWCl%2FzDxIpEHcxVh6X74gd06kO%2BnwR3y%2BOlAUOH4fU8Nu5lWps7tDkR27a4w%2F76O248ZakXmkpqCpqW2kXHkRBXOapqSHAkF7JVyl1xJs%2Fo6ma2PJNSFcW6Te%2BVRLngfYXIukKvAkD0ElUNwCgqBlUveluy%2F0E0j9rhwle%2FbdSBE2Bkb4gQh0UDK4yAUjT6gFmKLvwilGdpLssr2kJ7tw4xrn0RgsMTDo3bHUTyNtWgfiGhX5i30A3XIwREqGW8BMCQwTQCt9xqTpWMfmnXmsGNG3o3cjULdek3VatRuZscNuHrSlAtnuhIL9p3rb3%2FPozX6f26rJKVos6LfW56aWGlIqU0KCNYCrtuoUT1zolC35jlkqyRPVkeF0AuBcW8cjm32s7fl%2BA1cwIYysaXxLpABtQ%2FA1rdWa6N3t0MVlPKuVs0qxOqSSi1i9fS7F04XO3vW2Q8BEOBzu96z0GX3a8k1hur3lGNEhJa7eDmN8OtGCq6xQJfX86ty1R8qUMt8IG07eKrPzSSvMOLkwc4GOqUBDIgMWWJNljiRWpt65f4aozUezm90s7%2Bfs35G4bF%2FW1ME%2BKZqXxhrGyDvMXCJl9h3tXII4NVmevu1l18%2FnyKy1c4IC%2Bu7CzQ%2B1BWDzL411LkqjiB6X8A25gxtu%2FZ57wOJAzCYmHJXrTzo7bhVeta6QmqYHtDK8jXL77prf%2B5eD9rdFABxfbekbzzEtiqQDgXk%2ByJaePY9Ks8us%2FBMKM0dzGE%2B7frE&X-Amz-Signature=83cc9182db28cf2e7dfb31af867db5d60631e1995785c7113457f7f3ee957b96&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665FOA6MUG%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031522Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDtEHXg%2FFWohCKtYHoj98%2BvVgh4Wa7%2Fnqjv9nGhWuzNrwIgY8NrEVPsfg8XVeRXOqPfcWDyDucjXLUrpQv1IZRd4YAqiAQIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHJXpJTqekJTIQK9lircA1TYlSBKp3XIozTyCXfz0WQsNEtaF%2BwuzC3xzy8Oz0fizqyJe9ue%2BFcIUsOaauxQ14WWbtDNEm2gcAUvL6miuyeeenKHGnSaSk4TtwLE8zz31BpbZWCl%2FzDxIpEHcxVh6X74gd06kO%2BnwR3y%2BOlAUOH4fU8Nu5lWps7tDkR27a4w%2F76O248ZakXmkpqCpqW2kXHkRBXOapqSHAkF7JVyl1xJs%2Fo6ma2PJNSFcW6Te%2BVRLngfYXIukKvAkD0ElUNwCgqBlUveluy%2F0E0j9rhwle%2FbdSBE2Bkb4gQh0UDK4yAUjT6gFmKLvwilGdpLssr2kJ7tw4xrn0RgsMTDo3bHUTyNtWgfiGhX5i30A3XIwREqGW8BMCQwTQCt9xqTpWMfmnXmsGNG3o3cjULdek3VatRuZscNuHrSlAtnuhIL9p3rb3%2FPozX6f26rJKVos6LfW56aWGlIqU0KCNYCrtuoUT1zolC35jlkqyRPVkeF0AuBcW8cjm32s7fl%2BA1cwIYysaXxLpABtQ%2FA1rdWa6N3t0MVlPKuVs0qxOqSSi1i9fS7F04XO3vW2Q8BEOBzu96z0GX3a8k1hur3lGNEhJa7eDmN8OtGCq6xQJfX86ty1R8qUMt8IG07eKrPzSSvMOLkwc4GOqUBDIgMWWJNljiRWpt65f4aozUezm90s7%2Bfs35G4bF%2FW1ME%2BKZqXxhrGyDvMXCJl9h3tXII4NVmevu1l18%2FnyKy1c4IC%2Bu7CzQ%2B1BWDzL411LkqjiB6X8A25gxtu%2FZ57wOJAzCYmHJXrTzo7bhVeta6QmqYHtDK8jXL77prf%2B5eD9rdFABxfbekbzzEtiqQDgXk%2ByJaePY9Ks8us%2FBMKM0dzGE%2B7frE&X-Amz-Signature=1b517302e2a56e6c25bfca1134efca6cb38126dc98097af14c60e8309d8b560d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
