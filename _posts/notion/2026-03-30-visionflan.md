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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662ZCIHVKL%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032948Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJHMEUCIAO7J4YSectEgzecNlpeN9areYjjMHtqLshxQuZcJMBSAiEAwqs36W9hlvkNP9wt%2FsfC7YiLCl0pyHqj2ObcCswb6xkqiAQI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJEiPDhX4lzuf3%2FT0ircAxJ69K9Vbrkd9OXRzwwhdOMjUel96tbaNNIRkR4rlDq%2BHsvx6BSpf2Z5wGfEkkfxSxotDDc6zk38gTSx%2BptQkHCn0genTaBR1gXwY%2BMdb4gKTSvcVZPRP0zfGrX6h9diIsoDbs4YjIgw%2BPGe8HCnXVOQgCU6hmiPRawiq%2BB758rxgFftl3%2Bp85K8p9vPGnuwB%2B6zKlQvx%2Fg5lnItzKjXr7mxkXDeOtXrftooixOlQMO8sCMLB35m3BJzeBIoRbjlIKp2NwcljGhSYE2eXU3CLSPYjrzxbGpn6AesFF%2BqGuTHUB3kp%2FkOV%2Be%2F9qE8e9WaqoJExMEI6jd3Gv0sp03dK3Kl%2B9U7ZXoAdWBG7EMINUN6%2FdztcsBCs1qX%2BkfBIeEaDzNKxiTlcTgd2FtkG4bfJ%2BnWlzvyhEYXdO1IOSfmqOuLEDf998ieZS%2Bm0toONeeGmck0EhLFgPb9xDXK196wteUKwxSdQ1rNs1nr5W3nUWcBG5PXp0MjgDkYu49SEv6jYa0mv1fuATdbBygBGCLvLjXIV9qYbzNWFSVltCyAq%2FPwAONw5ubXyBZTMuzIRQeBSDcT%2B2ypthNYe5DGJkrKr%2FVGYlSpuX28FSwm88%2FAvxezFAYjw5Whluq75H3MMJSvi88GOqUBlnxdPmAO9ulcebkU2gxO1aNzrkF4OsA3FXsib7m7L2qWRQUjKc32FZ26uuYkUqyBB1vqC5HClZOgNrI4Ksd8IECXEvB9CW%2FR2yZ7V9BjvAHnW%2BjMxZPQEmKHvQ8PI1kfDGwoBEOX9gS2soLNP%2BTU8D7Z9U1aUlJuRTOXZ25fjIif%2FQDbxi8F1kvq8nuBW4LU7n63BN0MNV5yqGGBYzV1jDbl4P%2B4&X-Amz-Signature=c38b90ff5abfce5e0a6c4e268263c6fde2a21363cb6e6e5e52331718fb20a56e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667MPK24A5%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032948Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJHMEUCIQDSc4QGeFEaYXyCsDNMndY9Vyo0cxKgUSwT19eD%2BU2UbwIgMrtB1M6egVSUoia4IHVeDtJNLqWiPcW9eJRVbJDAr0cqiAQI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDO%2BEnuTWVJtGRdVhiyrcA1IIbSlrrm4hkvcTyQUI8NH73xfpeCGhIyAD8LWkdj0XRuHlX8jcx9Z3tOknPCZycGEOfJakfNFnaJdPF2X8peFek5pmr2Kjy5Vq3ukIz8FFXDi4yexSvIi0xBQjNckcswzStz25KcQ4Rpww99ehJjCvWl4hG7wLg5vNqlxLAGAXaIkrU2dlX3ZqtdhuPQIqKRuPf6xXAJAFQngvIwl09aZJRuq10lEonQaPw98heYsCDYemtBSeb%2BxZn8ukbyTK1MldyQ9Me3EHSKgRzaru09mH5tqjx2el23sjBn9KHaaCvhfZIMxQwvsuzB4VwvWHbqLdQLQj3P4P%2BukSQrSYhGHWMLV7PkRXV55MzvXS8QbrebSgEt0IYC8lxrAwNh9ekTci3kxP50camp7H2yCd4d0iQQ32vRXDonuV1tAhhhrZOSp3Wnv9KRkfNe4LqOHMd%2B4xQUwdlX%2BFQaLIizR%2BpCCssl5hyz06YXydeSdVZrbFYgw%2FL2BNEbUPXGvCGvpqxIhiFdIi%2BlIMqYqS5lIVzBvCERJOR%2B1NKcMCABRU3VYEupgMSwnZZa9Ee4yW4Cwlp77jEnCZo3X0401NUHC537jSXMHZelHs%2BJSgILBjZnnamaW%2FSDIDD9XK%2BZwaMPWti88GOqUBy%2BnPs5burKSSV7aRyaW8rju3OMlZiQulxp5ElOqZAKs08222Hx7F8rKHsmwoQ0h%2F314rAgxZVRc%2F7XhSnIDTn%2FQJidVYsJ4XAG0OlVmHwXiQMUEL2aOW0N9HHD89oT6Y46HNqf7cvkYO%2FtnXv0q5NY0b35hT%2BIwkdzhNLjUoa6vchX0gr0AHBeymgpOGum%2F1HX4Zl%2FFyujf40pQPTFqbXsLN7Ivg&X-Amz-Signature=7bf3e656fdac45b3f14d4291ff1efc0c6bbebb7e9bc72e09cc0205c4c664790a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QJITJQUT%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032942Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJIMEYCIQC4jFISPhZnZ8v68SOrqRlUStH4095J5t4b14QJdOyV0gIhAPirkE73QodbFZ5V6qC1ncIeRbn%2B8UKEEonSntF4cGRnKogECOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxDZ19RQ2IbRC%2FAZnIq3AOTXms9KYvcyjHcLUxc4PEtcI0q4sHZUH8xFHxPeHdYbyX3yYl9iEFPLgQCQ0UGMX%2B3w4aOjFlcd21XMWQ2J%2Bvacj8CAgo7kiU8gtPUi4xj00jvIPPlyB19E0cX1mieRIyrbtJ7t%2FKM%2FzNeawqJVLVumzTMLs3Qh5mEaSCoYNrzKkZizZZcelIDe48mxfPvSLnDsVxbNvY7xGBO1A7ulft3C1ba1N%2BEqS6fMx%2BJAp7R1oaWdvqyHwqT%2BP%2BgMl2N3JNfoVsZ3VG6CSveVPifrKr4lKv3kW9N4SBZpsf34DzAyqMuVHfuTTJC1aUll82vibtVArxcOyD%2Fz6NfaTB%2F8Kb97rU%2B8i8imnb4N9%2FtB8hNcrrh9M%2Bfiz3D%2BYFbnsqt1yVCX9wIt%2FghT7TRuRJ6sFSGEGPGsnH%2BRSp021kr6QcL5SQPvd28LCkfewMEWKSO2Jf97SOfyQNn8ROCe8Rztw95PKNWSHFH5odmOFD0glG4fcP%2F9N3b0fQnm2SUTXlbigbWtbwDJw97W%2FScAWzB1lFm%2F1Kcg13J%2BP6teXN5hZC0CTUFn2Jn4PKloWZ62QphKqORcXWKo1P%2Fa%2BhEpCwKLJcGxp30gPD%2Bm6VzNRcMO77L1v8tB7w0NCDJXRRy4DCOrovPBjqkARPV3%2Fkiqo7W32%2FdvGaCCHNjOMv%2B2Mf8Q%2FfmoKNA0Ozn45GqId%2FJ6hbfe%2F3rr%2BYpv58qV6igxJ%2FSd8NvFKSC4sCNLzGtdFHxlimn%2FZ4yqmLy0%2B1XeWPcG%2BWKAxDAQXL5FK5hvzI%2F0TLKKUASkkMt2M73E9bMSY%2FqnY2UvVLeiV6ZPNzvPlT%2BVFaOw4QESoLFX7vCaSrkrjSsDlxYJzlpFRnL65JC&X-Amz-Signature=cf6dd7d33274a4b06129f8a17216253ce96e0bde780d5be3574f4c49dc870399&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666CUDQY2C%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032952Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJHMEUCIQCSd88AxR%2FBV1mvPP%2BzbB2R07DVJkNnCB2fWztjtNg2fQIgW6qYqAAAP6WGCuE1cEYoD%2FVEAizgQDjdMpFfpV5BxkMqiAQI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJiZvhEumprf63AGCCrcA%2BUITz%2Bnl7qyLbgFMdqFmSYbAZWbR8RznmXlPHLwA9i2XJKjcnbDCksjKCGUxvZI0epibKwL9v76nEHPFoB574qPJJhjLvSuopNNwpewZ8WBn3sCpe4XRbhzI6tDRQmTvmrSX%2FP7UEq04KEoFN6XIj%2BecEYJM%2FLjMHnXB4Lb1gJpRKmklca1uorwKIxX%2B4QbNtW%2FbWfAuTC49GzaOhXSwqPkayErDTZU3c1s7KiTGJ5%2F3V%2FZ2lot3luiuz%2FnZPqDgKn8AMaZYIwPeMNmQKJYZyrRUD62DSD4MMqo%2FbYZLZseF8XkaaYrmP8a0iwBIM%2FP501JNxpzCmv%2FrO5MsGhP%2B7SuXiQJ2VHCH%2Bq%2FNS5mxEiFnJmeh4GMxtgRk97DNvnql%2ByVBbhvrMa74475dwzDYb4TaVHgRrO1BeKTbgVQo8Sc5tm4%2F4JySZBJgK5tNbVWoC8uQWk0BoxcBmx9%2F7RZ8DDC8n4vmAFN%2FCaLjgYvHp4CYurbIUiFengOGHRmeVh9ycWeVJGkExnvh0GwedSByNWvQ6XkdaLD2%2FinnSdkMuBFV81sgs4SsihcyL%2BUheyraRqJSRPYW5hX7LvaPr1eZAKfBk2ZHCrP4m7tMkOMwayJNBRjR8gH8%2BESx2d1MI2ui88GOqUBcCx3fV8cDtfrnJW9T2%2B0hbmoZ5Aj5L8WqdI8bdaZYNGMUZxGt%2Bpf%2BUFnE3%2BQJxKejd02mpmqRajz13SrKGk1HcxPhuh7Zrjr7hmBM%2B%2FQ%2B5MVFISk5rjKr%2BRhjnRJfVVf0vh5f9iF6b9hGJh5in94XS1Q9JU3yOfzzGf%2BrLBoAYGYi4bURx3xNEgAlSbRcxbEikQqccKVafRUWmleNteI%2B8bFhh9X&X-Amz-Signature=ff7a7a61b050909f676587d684c837ae934a4ef3d0ee6d5ed5be3df653cf0dde&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QIE3R7PT%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032954Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJHMEUCICbfs2UcvqYzQ58XtK5yYlcE0kCYJFej7LY8QffeHZ%2FuAiEA3N7a4j4TMaDnzDbuY%2Fvici1zIp4IkWdeao9FaUyWPS0qiAQI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIkrHkEEGDgjWCFOBSrcA7hhPwdjK7QdvtK%2FXVZujqriTC%2Bc3FxZbsnc1AHr3S2YqmdM1bXgp1%2Flg0MXEvy2adxouajD7TNZTI3AzRWANC5pnYm8waZIW7vRCXhf2bdjUknrfwJXnn%2BHESS9O1cLEtvo%2B1krcNJIezwN2054DpUgOatrgzpSGBOIoqK2y2fvNhJcK%2B46SB0i9myizfUx2WsuvumT9RaC4%2Bnq%2F7n%2FPXUYvXhwAiIkumdQCffpRuqGpeKvwdcT9AEIZrCz4Wj8pGPUUBeR5xzefgEVhchouoFl1TQdqdaGH4sLwivNrOWcvLVTEbREfg%2F7JmOhoBfRfsUn3hFquA6Jx%2Fx1BdhJnXaUHHYf%2FijrG%2FNP%2BtLbNGYNdr5o6nj%2F66%2FbC78B%2BOKmB%2Bu8MAow6P%2BGKv9vxisuz8bOIG9Dbo%2Ffu0sIk3oVykcyV5se5UAgN%2BSnJtzC8tiijxCkHQzlVr8%2BOmPe8ngRFXAwA08ThKvVYWv8oCc0jtt3z5VgEPkhsuc%2BJtwvoOKTH6kIt5we4xvkiM1PARs5h4cXkCs9UMcGsSzz9cfJLlZYxxMc187Nc4rfo3zQ%2BacFaXI0SedSCFFTPm6%2BGlvF%2BSNMq4nQYKMG8ETCScZFIFeQbfLN4VbkZZ616gYwMNSui88GOqUBz%2FS6kD2A49dLxmi7CUEvuUE4NDllLd6eLIRfqgmgvZpOwyBD946k6x%2FAlocaJw27BQBrGuEqlysGazvdA5SqScuJqYmjCHGM%2FpJYUmisUWzwXOxG7ja%2B3SJq88xffqdDWXq4JKGx3bKZdF7%2FfwZtv3ZH%2BVhzknHqxMowsbwOsQgGF25aos5KeoSailqyaWTUMwoO5bxhDb8OIr9rgdy6DhTbytdN&X-Amz-Signature=0ba4b8b305a0622db7f8b896193259c404abf040b95248274b2c9271056d0fbf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664W7AKOLG%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032954Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJHMEUCIQDLmumoRfiqi8h1%2BNgatL0x1XIodcfj4J%2FOw8ilfrkJhgIgdCqFsDwsZJlQgYy%2FEAtrlfxMhZfs6c0llOWN5OBjXisqiAQI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPDLVMxhyFoe6XTtQyrcA%2B5LrbgWCXJ5%2BXjLijowYFciwwYSvPm0QEeOQ7awWDIakk5psWP3NDU58wFXDQb%2FpIjneZ2LZCAEqMAK9RDJcO%2FM%2BSk7M4%2BQe2tRUouXqOSpn%2F%2B%2BK0Y4p5jMqdqec%2FKUhQbTPeV%2FfRHjsvOUDO0vaz6SycmnQIWk1i1xo1v0o14m9i9fBeLCxHnZ6PczQinmo%2FBO%2BmYaddW8KSubeHZoinU59hV9%2Bt21m0A4zq%2FS%2FHdsyBnp1UpapvxI5Sq1EHJ%2FiL2mk9xkdNSZJj91991EvBVBfF9LZCxeVAY14D%2F8AhvZTbefy%2FAeCO%2F2qPBQYFNGzeputCaYhgW5BVn2gT6jz9RQqOt0cdx2lLXqGI0guz%2FmFZd2wUlG3fa4L6pgtzX47V5AoQLCVHMF09PUKGgPZgGtTWqZPcDOCEJ48t%2BeARKW2pJOfhh5tksHvfh0ZkRuvp8BNjEmWNKIYUBFKQCS5QkCcHCze3J%2FuxNg2iDPyCacSZuDbmTbXGo%2BmXLYi%2BU4oUFlYVx54nc98YnR9YE6hnQ%2BLR7%2FgjrZW0abU2FCJYvJIROfL21%2FlHS8FtZ6K7vekTO6NuaexWfOahld%2FDbeZsUy40%2FP46u6J6DwQ798bXoKPRuIqP85Qb8oUy6VMPSti88GOqUBzboClZKbYD4Y76cRh5ZkYc8Tc4LNe8XLpztNdeTmcgq2GUjL%2BHU87mozlBKZswmvFhRCimSbxFvLN0Zi5D2qjzzbznvcZcqMh%2BC%2FxddwLc7gZcD0yyxzet7UZcniSD%2FWkZPSYA1S3cU4DPj%2BIY3Ing00kEWDUDEDR2RXPq%2Bd7zDe6g9EKDUQdhM%2BWNAc2jHgKVSm483GoErAvTJmyETMC7XY7xU%2B&X-Amz-Signature=796104287a1c765a7a73b144f113fa1f811e1a526480d0a58c5fe3a1dcd0fa7a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UKYRWVSC%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032954Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJGMEQCIGE7s4T2RppSBBU6iyGL8LhsWII990R%2FM%2BCjF0iG3brbAiB9H9LjQs8PoA1Ww%2B%2BYXdzc%2F9J2davcduwFzjf1%2Fcz%2BiSqIBAji%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMVpnW7OFNPDg2yv43KtwDUqyfrMmkC5lGzZDSFj1XHUMA8dEW6z4IR3CrLf7cpRcwOfqNyu9JGf6nTK3dANDwEGd7jU5A6eeulQtgRbZhBaXWjNPegvnSej%2FpzNWEmfzDSp0a67NSi1KWhNkOlcYk68b5aloRTXGK6wuDlO8I%2BbSSAioMSGlnsHW%2Ftc4vDTlgkQ7bHN8NHEVTawko0qbQVyRCvdgTggo6euWEVn6C0zMERx8Thui5rd4kE7H3H3PdEWt%2FQUkP2Tz4hL6LOsEsd%2FbYsXCwM7a3ORT8gAH9%2FS3XI6N3KeNLAwS0mm9mlMUMRnMCQuZr7EyFcPPQ3Bk54GMmpadfNThEtMpkpfXfROIKxVgzVSGPaN8zGvEcXqWmySZ7bfp7gWhyOE%2B8FhwWhp%2FaIZyMbxZZLrRiQ%2FbcK%2BYE5rNPvzkNEBPrCgI82ceUPXms4z7cNvWXi6IloXec5Ipb7aZGvjrTwav%2B9Pt7gpOPbMfzIDKDv1%2Fzt6dAagYmdycXF7uTPiz8e7MBHbNl9VPztOxaETWtoQw8OZwow04WsYEkT04J8%2FG%2B4rPALvMQsA94EoiXQhDDyd3a%2F2Jb7NkCODuPxzU5HlZTcri5sv9cegFCnRFdl9j%2B6J67QbkWADgE5Gc2gOwXLw8w96yLzwY6pgElJqAkG7foF1iVLB7NzgR2RhuuX1bGpW9NOK7eHFmqfj6iWDqSb9t1hTM2okw6J%2B1F1vHKFHd3%2FfOPS3OCSLWdcjrj4pBNYItbaqMcHjFpasePtFbrIED%2FvFXSEaQ65WE1e17LzFIXT33NkkL4NZiV4OEJSPOid%2BvbPrCzM%2BdiH0IzVkury0lDSpiH9ZsZNlHawvS53HTlSH63QQxKxIfi3cvx5z8w&X-Amz-Signature=071f92024ef53fd31ea47d127f8b6a03c4455697cd332edf49c0f4ab47626107&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WUOZUAWP%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032954Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJGMEQCIDMWtfvqr853ZUKfeIwXgltkpVzq44QpPnRr8%2FnUiTDlAiAVNs9RIxWMWyAn0bpm4buxl7m9GKqxDo9sCX%2BEsyD1siqIBAji%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMcUMtZ%2FFuQlpTa%2FpRKtwDOpD6VKFZWbCdnKMOQeNtWp1hOJScHjGv%2FRiN3TxX4iJLJsze9rmVOoUh71oIZoPF02PN2q0Twrm%2FdjzDrgQDF7ggBEPLD%2B42kO8XuNehMFananTSdJQMZU7f0Cwhpmz8HWuiac%2FC%2FPAkCRX6tw%2F2Msrz98L6fPr2gpDzeunpZiEsDygxo%2BabZjFMs%2FpEjtyMXLwPQoAeTU40EoPyA05JzfVZ2GnsBZbaMmzobCDx65OdDSFoJQkTsL6RlPplr%2FBVBbnMwanwI8UY37kVfmX1RTuFB2JNQV9tIHChy76jovFit2gnj5dAF7Io61Xw2TSnhhmebgv%2FgtwaicvCx88VOpsfCG9KqJ1Do1d0ZIWQRdwexg%2BHf9lG4zduJQQU7%2BT3gIMm6pitQy7CIKUlAHINSM7BZpiWttUsx8%2BQrs0o4jjuwm0LAUS7lL30PK6ZKHuA7cQ0dRKBYDtHBg2mdgWjz9u3oUyb5zSgmVEaKK0RnNzPHz2SYzHMJc6csfbL2YMRlChjrrNrR%2BX2UjOW%2FQmU9zJQ6bmQzHQ8MFHb8HOG5j%2Bh7mrCsAEHC9%2FglI0Nkqp6%2F56CJ%2BKpLOYpxiDrQhTGfHrbuw9h2DpGSSEUVZzVl65iOTRaAsdj%2Bot3oZQwi62LzwY6pgFk3Y%2FbBgCmPlPcRJQC86eiwxzB9gFb9JlJndmvh8OcbOFwALm2L0g3aDaIX0hoUGOlgTWq1%2FoWKexHtPTQoRO%2BZhtWbQUqDnuw6R%2Brg1m%2BPspa0XpU9vpjMbju62Xdz2Btm4BxAd3QbKSnG4nvlb4lPILAbSpYRTf4kcBCc%2FBUKwA%2B72VFftWF4nzJjgNKNZZNtfTFRmi7jpwyp%2BIiSbv3CxvNkgGY&X-Amz-Signature=bc94663368c8c9a1812795fba79498caa57d5d9e993e2bce770529a67e0b46d9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XRK7XRUG%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032956Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJHMEUCIQCVv9fbqZIVxfdokypa6BPrp0BXkFOH79XZity%2BZNDSnAIgBohMJKY%2F9pG9D5BkAqzwJUngqrqNFg95T%2BBH19KWJewqiAQI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDC7SHibBj0t91hk6ySrcA%2BUPj34HntJDmzqJ6NObK8dg9OyZnqDbtnLtbEXz0kFaSsOClAdA1VCMe4MdXwoe7wuUgXEpH7ZkPz2EArBQdGWBMmGZfC9dze%2FRg2UzR%2FS1bylWStbtq7HH5SbydHH7zdKdET%2FOEzMP7Lr%2FpCiyfU%2BXg%2FDSt3BrBza%2BdXhAIUf1QzmCYov0RgQ9gC%2FGYmC5CXaJ6XdA0VDES6JTpEIHZIrQnVi03xTOJbAHfV6NTs0jIFZZ1ISNXniS0ZOYJJL%2FHPhF20iWWCu6LbrMbkVruCbYeZPh8tITltOuCTpRglU2Sv0jo1Khhtdp4sOcGxEonsBOezrXqvJ0yUWxsH%2BMxB3ceAtQQ3NllWKF0dE5HnQSth27fcii0%2FHs1a0Z%2FA7R%2F9sKYFBzMGLxupJN5a0nk7HdgZ%2BWexpKG0kFpZtedEhwxheIYhlOx3oHU3w%2Fcrn6%2FlTUl2QrKcaRcBaOGvQR4nmz8GtjIvEWtsEgZZLz7iZUbkY7z%2BGHO25pA%2BnEGoGo0%2BXd6jmL0jfDuzcKS%2FgT51PCginWvZ6nQ6Mcq56Lr77tVyR9PHE%2BPE1zAiSHgVIgotmPxw%2F6FewA4svz4UK4n%2BO1BsHcclC79mTVl7D8Djv4RJVxCCRdtkQW%2BnapMJGvi88GOqUBOItbxVmxgK2UjPvBwJYZ8im6zqmxFCax9CE5qJEGTWhB4UUYAarwg8qS9Bd4f9XqBaYz%2BuqsAUZbaKgqboPjtTrN%2BIH%2BvkV38Se8VsQ12pUUF43b7gzskoU3wCTyPj%2FmCVTWwK49i1IT4IKn2hBhNw5iNljAm7PQQcdZJONyYdVeG2Aa3K31gRd2lHng7Ix7cBVBnErUcfKkhTsGi6cTDlf0VVjd&X-Amz-Signature=68050e25a0c46d9ad62925d1da461a1b070db6b1da728afbd51efffef53981dc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663Q3BEDES%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032956Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJHMEUCIQDnruOaBAjF91v6Ai9280U1gitD9uxeBTrVFlOrl82yKQIgCAOkrCo9pwNTRhIK4ycGFbPpLF8P57PDT3l527u%2F7ZMqiAQI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOjXo64ZOIjcvrYyKCrcA1p1ll2RHwW1hMUBqZx5D4DGUtmMqPaMk7HiIA%2BuzWxa2T2ASVFl36CLdMv3DiLhvW1sRHd5C8dxbMOQ857XwonDFmT%2F4oOPHpSLGDfzrGaIAh8D866C31jvYSlp%2Bp7%2F9vDpDJXO5%2B3CWbyLxcmIJ8Mrs1NBPFnPUMvUvi25ehPM%2Bx9J39dUFDWikfCPH2yAsWSQ1mi%2BfJQ%2FIK8UXC0QbtMMG0b3uLXccqNKpBnUKLQNqvlCzdp6YAX3iA%2BJnMa9POo65LMigvyxhKkROCpy7uTAaA4S2Sfzrfp4TRGWZWm5Q3MFbpJ7%2F1YfPZHGTi1mVoqVexU66b%2FEolQxjSDuac%2BScjdam8xUVj%2B2dqcuPHOs69v8oBByrV54rIK3g0s63ATm5r7u3uxEUBPOQDVKCNZTL8jUP4GV6QGfSveFMm29RM69Q4BvpQcFcebGZrEpEoBYI5a%2Ff%2BeMLPdCzo80loHrspAgP434ltDMQPky2LrxW0695qxWGHra8RX3lUf8scLOlF40jam3BlTOFXHLukt%2BZuGy1F4cy93qPOlQXCKBEmhwC92by5WZgk0Rgff4YhFfk9SFCESSLya4BA8KrR6x3Cc%2F%2F7D6hOZpNNcBD8CfUPEJZe5z4kA0IWUPMMGsi88GOqUBQO9%2BNKFE4qX3oKpPALM8obqGxq0C0oaCcx7SEufpYkpAbjWw%2F3gOcdjSBNCOXV09%2FuX95CMc%2FLWdM9micTk%2B1xm48L2XGbx%2FDYZsJ8GHZi3O%2Fe%2FjMIQTlHG%2BH%2F7JoNo5B0s1WyPww5u0nD%2FFZ5XL9MdBGbrLfsvhcQk2iQjgX1%2BbqgDlHvgSsH1LZeexwgK3hkXfm0F1f1lwOCyMm6tckAgW2ECa&X-Amz-Signature=56ee8d1267ea43f51b2300aa8acde3b7cf9a0756af3ecbaf6bb011f68cdf00f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663RG4HXBS%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032957Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJHMEUCIQC4ICUlNhs9Krbl3D%2FbUe0g5ONnlXgKBoolhzcO4D%2FIzQIgfng4uPQv2cgkRf4i5tnk6itTCmDH7vIof0x5Ba0FMYkqiAQI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDB0CYAa%2FuXocmKcaryrcA39KW25SMdJr7kpMya3utjxYzZrZ%2B9nS%2FDfSYeEoktPZplM8h%2B%2FuRnvtNR%2BcCVbIELqtDhYeBsWRgZkvjDhEpEybdj%2FpxPiZLqPoHshCEYDUmiLmTxiBqTo6I34PstW0NVTdMTEbrDBI7CV4gDFMWJa%2Bv7VxGnY3aY6Q1RYJLoPtbicn1CxpK%2FzVXC2yi6szHPgDF51B3veTEVwJs8HJ1fVEHt41MAG67I4dvqTlMytraQXXpXYv34R9k9VLKr2Y5R47s62t8KNSDk8Fdnd33wVF7T6yy02CY6hJWCuG6vhDChkJEThZfP2%2BJIuECvFDIs3g2CkWMPiF5R8bPJds%2BIhUMlkMT8yGGA6t0zYpwtloFWUuZKnXnyQ1phlaCEqo8%2FMInaAj4jxy%2F9BEGiB6We7IL5XJ9%2B06F%2BfDIovhuKNMZtC%2B02aSSXyvho58PcihtNINl1wmEkRi%2FLGbkNZSMGN8fJgZ9PNkI6I%2BU5aQ3CIZ45ihortHsmkdMz4A9z6t%2FD6b%2BSNLc0%2FCew7PXcbpzXAykPo%2BfB4w4VM7yk0DMu2dHG6Bn9eHZ6ILtVWI798NNsw%2FnIWcN4zzMe9jfXZdOaNAhZdydYaHwj1EzxUeXOIsM73KOZ3Xwfq4%2FU70MJqsi88GOqUBFxyhCSfx0yyGnChwPr%2BeAJ%2B2ndzJocl4gLDV2Vaq9U8JsfaAEfmG1jzHkDnEh00PcY5LPdQPTRpP7J6FPs5zeY6gXf9J9yZQ3QAfiRIJV3WtrWz0k9Blqy3vdYaL%2F9%2BDLd55MxiTgBnmdsuLVvqoFVKE5F1Nc7Ky5IVdkI3pUdQ9DgB%2F5r6JU2msmaZBOcP%2F4ahWiEzYNofsQqeNmdVC9IluT24G&X-Amz-Signature=d1e9f175941b5861bbebee445277331f02ea3d1c28c3ff3c1927230f63845e8b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RQDKGMNG%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032958Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJHMEUCIENXs5PZ3awpOzfED%2Bsk%2B43YdhYFU714Fc7%2FeDPNnrtiAiEA3IWJaLiZtiM5NcnNAMve1NwvRhIVxalJaEPNiD08dxQqiAQI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJpitmWcIyM52ErfQCrcAzSFp%2FV6nN%2BjDwrWUAhLw8%2B6lKFWtFz8p5%2FLeOA0MaxPtkU%2B5Bbb47EQwh3wt%2F7LwGXyAovAEeshxBrdy80hamjRTqy0veIV2NEAeZzMBOOu%2FC2bvvgeFfFQSLgDdGMi4MWhoxjooyO4pKUXJ7WwqjDc4LvNhdh0e7xCjqIqw5ooYN6MfBsxOFUPUobF8fj0TZcjoLbcoWtmBGXP4veJjEyl9Cjpz6Nk22%2FaiB%2BdGyzZ%2FePXMRZXp%2BWND1kP2w1iavHdpRUokOV%2BYwlnhr6K8a0B5RQTzgyFJq7aZaAoL2Mnn7dQszjZiToz7TDJLrkN5O7TBx97DU4egEqOE2khPQvgy%2BjIlmEzlAwUD2QiUvK5nEAx02LNA4YBKz9WFLo4kcchtFdhHZjCO%2B6yHVd5TmKkgxdQNjcd5IDT10hYpapFQa9KXDTi6RqNqvc1P%2BQwoJg8ae4zCfNf5h7GNS5MZJ63O%2BT7pjP2QFZl6GNIOcJMB79Jqr0chBXySitpIReuIx%2BCY39eLLBMwXgC9cXoTTTG12K1brZlVbzI3bafuZQ2sabeAjKIAaSTp0y2BjdKvB7iRl0rn8S9lx1Q%2FPJI5cG%2BRHvQ55tSxfTuwaf68HJBPKuwxhvP9ZtfXQ%2B5MLSti88GOqUB2pw7PCvWccmrguwzUJQJoGVA66I4XVTljn2c7d%2B3LqG7HK4gUCx5ZRMvlM3V98l%2FJ8WgO1JeEL5LwYMXFCKKAXB%2BAkFZOWM1yARxPp1ru5%2FIuDJsdUJt4VBKsgdF0vvzFDZ4LCWMLd68bkBTr0l1A6n7XW7XbP%2Fqp0nzZyfvHMELg6Cf1ycrsKH6uYxqDjSPnmrXZfDVNN2ydj6OkMBUAB5ngqlP&X-Amz-Signature=02fd55a352837481bc8566e8fb87030f54164d8c7fe6f292ba51f14094f177dd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YM7AJVNK%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032958Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJIMEYCIQC4JXW%2BBtthA1FkSDupT2M8euby2LyPZ4pcAbM8HFcVTgIhAKTcjTSNiDxOZlTkbyoEniGI7BQResqTlqFZdwWcVenBKogECOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwTBBOEsl9LvYBQWAoq3AO%2FriFNR0XFVl8F6PW5HZ7dVF%2Bolwi97FVFi9e2otO1JmPvs6fEewIc4e05LYSH%2BF5x4CvdYOwiajHB9jHH4xH40F8SD9C3OwqAdLyTa%2BYTizS2AtSpZFbvlTwrvYpxyDM%2FmOxRjF8X0kAn%2BGE%2FHOYgPEXho2gVL5pV7SHNHHEQ8RAmoSK31SSnXuELl7p%2FRKSRJFHp67adA6CBEQOlvH4tHg8JIuJrSDEccgyD5a1uxD5MjMXaYQwp0RPvnkcF9T4ZsflirlL17kGzqX7fqdfWeqNXIN0W9DSWpZx8XgE3fXVda8hyijsO3REQnCY3gO3u9wGh78kdJXUUCJ%2BI9KzQw%2BIuOfNF3kbihMMjzf0H3PjI94owgwwAjrJxnByRktAoQWf9eXEdVd69hNflZZzpJZR2AWhVB7kWDl8LxNvnRyFGy3qGgpg%2FmE8XiBcx%2B3Hmx2er6xAW5lbwwugB24FE5WGmbNkyYnXHCyj7C5IOy5jnGhNzw2BVeBaLOM59%2FSs%2FY00lQDZUHxu%2BbSsTEIAQj7NcnVpePDqfS7O9swlRw6ziY02vSSSzjk%2Fd%2FP%2FMBS6fAwSnI%2Fw4RfYsLsE3UWoQobFyd7BIJzf2tVikYZT79DhWFCcbVwoqp6bKLTCcrovPBjqkAU6d7QBnqpc4hPsSvK1B%2FtKbFpfny1hJcF6jEscGVW61gwbR2P92UFjT8T7MwGsBU1jZU%2B2UUSpbxye805LEEWdIV94q6RgbkkoyWVwz2kZyRlGFU0Fbgzv4n6PYxN6%2Bc3ot9NACNJWhtnaUxYFEby72GgL%2ByY6vTDtUWygYjSAXQohT0juYITQA085fvvPOlYZcOqv%2Bfqxx7s1p7KPmzjG5u4Ie&X-Amz-Signature=1524e5a6f46f206e1ebac033fe338ef1c5e25b941d176d910d95eef65b032434&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YM7AJVNK%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032958Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJIMEYCIQC4JXW%2BBtthA1FkSDupT2M8euby2LyPZ4pcAbM8HFcVTgIhAKTcjTSNiDxOZlTkbyoEniGI7BQResqTlqFZdwWcVenBKogECOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwTBBOEsl9LvYBQWAoq3AO%2FriFNR0XFVl8F6PW5HZ7dVF%2Bolwi97FVFi9e2otO1JmPvs6fEewIc4e05LYSH%2BF5x4CvdYOwiajHB9jHH4xH40F8SD9C3OwqAdLyTa%2BYTizS2AtSpZFbvlTwrvYpxyDM%2FmOxRjF8X0kAn%2BGE%2FHOYgPEXho2gVL5pV7SHNHHEQ8RAmoSK31SSnXuELl7p%2FRKSRJFHp67adA6CBEQOlvH4tHg8JIuJrSDEccgyD5a1uxD5MjMXaYQwp0RPvnkcF9T4ZsflirlL17kGzqX7fqdfWeqNXIN0W9DSWpZx8XgE3fXVda8hyijsO3REQnCY3gO3u9wGh78kdJXUUCJ%2BI9KzQw%2BIuOfNF3kbihMMjzf0H3PjI94owgwwAjrJxnByRktAoQWf9eXEdVd69hNflZZzpJZR2AWhVB7kWDl8LxNvnRyFGy3qGgpg%2FmE8XiBcx%2B3Hmx2er6xAW5lbwwugB24FE5WGmbNkyYnXHCyj7C5IOy5jnGhNzw2BVeBaLOM59%2FSs%2FY00lQDZUHxu%2BbSsTEIAQj7NcnVpePDqfS7O9swlRw6ziY02vSSSzjk%2Fd%2FP%2FMBS6fAwSnI%2Fw4RfYsLsE3UWoQobFyd7BIJzf2tVikYZT79DhWFCcbVwoqp6bKLTCcrovPBjqkAU6d7QBnqpc4hPsSvK1B%2FtKbFpfny1hJcF6jEscGVW61gwbR2P92UFjT8T7MwGsBU1jZU%2B2UUSpbxye805LEEWdIV94q6RgbkkoyWVwz2kZyRlGFU0Fbgzv4n6PYxN6%2Bc3ot9NACNJWhtnaUxYFEby72GgL%2ByY6vTDtUWygYjSAXQohT0juYITQA085fvvPOlYZcOqv%2Bfqxx7s1p7KPmzjG5u4Ie&X-Amz-Signature=398024bfd974921f1e28466c0f484031cca3da60ab279ccee06da7a4d5229552&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
