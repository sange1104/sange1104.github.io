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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XS354AD4%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T031849Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIQCxN5CBAGv9jG8b27yjZz3ZUIN0qEo0UTchVdeLge5GEQIgffeD8F71rwFN0ex6HJBNa83FQ593vWc9ScHYfQFF0d0q%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDExfTElU1%2FmX%2BdXPVCrcA9hNNn3EueWZJvX0mTHWApltexfMNU8QR0332rQHn0eOCDZyF4yL67KlMVxpgwVPOxY6QKzcuCuv2RHU19DURh3kAcYV%2BvP9QuFOljb10YNBgSTy%2BhTwM2z7CRp1qCaEQGqYO8vPF%2FPE6ryOKhmpW0xvOdXXRldjcvTHDgyLW3Wu6dbh7jMk1FucfjTlfPzBULx5jUyGsEABOS8EUA60KXdg5qY1b6cy05QokigxW%2BHEhVkmFBkv7zk0Bsn0I5MImuRE%2FVHJHH%2F27QQmMfFUPjXI3qd8cMAlygisbG96GLyeox2oRF%2FsVwwWga424stdn5C4dOByGJ3PkqdZb5zd6Vl8NRSGed67wOxnufpT0SfBmAU%2F47KrQBpkgEaMOyeLNy9jS5ZH7wmvT9jAu6Ggv0VvD%2FsWDkYL1AAyi5CfIwnLW0yALQY4%2BCh94isDBnC3uuNFwl%2B4%2FqYp2cMkaV79wLwwPuCzziOsQN6pyNoM1WJ9gwuuU1ZppSO4kdsMRqUog0qlLY%2BybUp3rlASGdZAfHgi5aSNrOu54DLfpLoip%2BAmJKT%2BmNlSbyNkACjXyhC3CvCC4bRta%2BJVZmLwzSqpEj%2BpT62NuOhl6hFrKv%2FGhUJsc%2BfRA%2BiTjQu1Z5Y%2BMMzp5s4GOqUBv9Pysm6Yt65%2F3UNr1d%2FzFYHEcvTqqLAjX4Cl1PPTGN41jbvDiBeq7F9GLcKM8D8WvaVXvEjRb6LvfZgRQ6wLLREBYLtzLdtFkW5nA2hpiYaGSIEVfGgmBAFQaDQpZ7wxcoUM0tY6uN51oa31OMEE%2BSsj9yd%2Fxk0%2BeAitjnoteGFIi99jGXj%2B8XlGf%2B53NDUoWiMyEGqedq%2FKrAMIz3zC9EbRPxpq&X-Amz-Signature=49514e30294e30b04fbbe22142cb8805a0ea7397c5c3b379639b78e8e08ab114&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VAFHDUWB%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T031849Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIQC%2B3bHTqoaWOdMwExV%2FolUGvpP23a951rwpo%2FX8CJA3fgIgIzNIrDzegCubMK4S6wxTUbuqiRcBOws1dWLJ5v6IlSsq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDM4qR11rIjvuWtXlkCrcAwltADBCWlXYspjbtREeWVN2bW8Lx8u7UKUvBFbd7hWjylExjwt85GJiMCzGJB6fGdeIxVqVXp5BBXhZDRWNXdwwiLdxqf8EBiKP6nz0yX5vZ5cAb%2FlDNTCJ3TW8GoNa7o4fN99ow1tgxXf9z0lv5JIi7Lh5MB%2BpWJUMTHku%2B%2F7XhaNkL%2BAhP9m20UyK8qn9OuH0AwTZq%2Bc%2FsYAmHgBRNv8beIXbhhWFwi%2BeLJe64zYZN490agB5pCPHe9PlCCamBgkHgtyDA7xtzWhC0XCqrqXe19iafvKlhPuf5Z0Rz3chnvdDCCxUXakRWDiXIr3pU4T3OyvsWe4IPnIAQdLXPD%2B4udy0ail%2BhsgT6fSizF9wH152ibcc4gf%2FXzza6x3Ey1c%2BJmo1UpC4JbDYnAiwY9wtRWyXwkL6oN3SkoP6cAcWOZ%2BJrGhFUDXY1QX0SgQD4L%2BKqw%2F7pHgHDFZWnMPTFjZWhcsaS7k7c1jxU9Gt%2F%2BuqPBAqzHwnL16EnVqE%2BPyAYnsIqIycUgjq3%2FfsmkYiwMC17KcP2v6RVqfN2jyiiagSO8z%2Fu7nzzv%2FuNZF7L32U5hYdK1IN1qaLoa%2Bs%2B64F8NIh8xtcXWxQU0ZNtmPdt%2F%2Bab5qYdHQOQffK2S%2BbMJ%2Fr5s4GOqUBVbOSN8AkhcB9zSq6DPQU6646jO7xvTw4Q%2F9qZLoyYh0MikXK%2FspCoDyqEvHF%2FLT9yMiU0ulPGj78QvP7XrcpuI5T5Nbq6%2BQ8no7GDqlSUeCfIXYDRG3RR6xjf2Fo2vTmz99uX8o7i7FfAXgbXAUxFC%2BdfT9BEnERc%2FvmIdgyYHVkD%2B5i5eCSm4GAHzvNInrSkwHqQ4sQe%2FfIjtqNJTlNHjdbaavG&X-Amz-Signature=aad06abd3b08c1deb456fc9085f0b057d538c632bd7cffc69cc83826083a90a4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X4DMGVRK%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T031836Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIQCZAhwvYpr10TE4ZIv16lrL8%2F8qiq1aD9VzVFZ%2BaC6tBAIgNFBwcJBBxnIcOF4lhJkwEJLtCq8WHuNXCWFPu5YMnQIq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDF%2FNHQqqElRXz6Q5ECrcA0qSegGW2Mp6inb40jmdDE4gigIEuEYWbHnmBeAQh6RNllQ8lBZUWmC%2B%2BkzZFJqFce7EQ%2Bmuv%2BuNh7GIT43UiXOx1S9MvvAfVKdZWE2Omo%2FEYIdSOUqPFCqtprrC4vIVQQ1rYFCK3aEQ%2FfRj%2BzL4%2BClhAW4kdbFMCAy%2FdTK3q6HHfnqictR9Rx9Y8SXSQeoyj4VYUJmEycy%2BYR9Tvx5EsE%2BY2LXFc1anleu%2BvOnYAxjbxTt7f4PBwTPUpoqMSjz%2FzOX24llY2%2FyyhjzYk9Edxz%2BSZiOgHQZtyB93Eomp87B6yI3DSfwmxob78ny0UFYKf138Jb3ufx4AUyVE8tzoYXvgPGG5z%2BEnCnxfXwLwc1iJmVr7%2BDZxksOofMBiEs4KOWZ5H2%2BtoktvDp70A5yjUjmfvltTEFJh5L%2FjhgsVbR5eTKRP2%2FAdgsa6VcYz32Ssty9nM2RPdlqFJm6znIKHDjfIPdgP61yBWPnHU4b2kC6m3ZGZ50T%2BM4Smpg7cbDlAqGdlTLWw4FPHqgximxLtjvQN%2FiI3eeqWsFdU0BBnxoqHrcadtqG80iMD%2FbPm6gXNFjbciACagX3RXKJGl0xwPT6%2F%2BxKAnkndaDkvyYblY0H%2BAumVJHnh%2FLVLO%2B47MMTp5s4GOqUBrXORraeQ6M0ZNMP5mazGaypwSQrU5mYfZ88zIXQ%2Bc4ha9zgR%2FSDxBCLc6GhRItuIg6fIMvWwHvWgPVx4hNEpnDHf5E9tVxNQZ2Y0%2B%2FKWs5u%2FBNlslEyZ2emQMeJMg1ZMpQxa3hH%2FpJeFc5pfUPRRQFuxc7ot284upRjdAQ4M%2B5Vg5khP26qt%2FSwATDDfeMqUsGZa4iCE8grMgjnJru90W76UiRGZ&X-Amz-Signature=6719a524f8faa2bd29a06922773716c0b80662dc9900aa46d754162eefb5948f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664V6C7LRJ%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T031857Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIDMz3n2vGaYsj7i6LkPG0TPqt6i9feYhmYKBiTzFeYuSAiEA%2Fu6c3Akmd0FE2%2F%2B8dTkQYlKJwWi6g4Wo0%2BlhmP9ZxeQq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDEBUI%2BtxvSjj8wBbKircA3BFrDuNdiYttmIv81Nn7fTvbNIRu8jrl0TkLaPEO7yn3cZLPF47ctBl51Krwqdtuyc%2FukQEYmdxOdZi2Fyu7xkN3ShNTN6BPTObIz0XyqOZ7zwM%2BC%2FjGvAwCgV2AeDxxXFDYgnEq7uiozXGJbLIjS3kr7vzBbA%2FvxC%2Bz65Tlc4yp3Ft05A5S1SmV5Nj7SGxIAaR%2FZk4QrsHpb%2B343l0vNNuo083Jd5peY5jgTJg%2FTUasI%2FPCzJsFyq4CsROlv6LlMpCk%2BsbmFCAi32KcXoi%2BdBeVTWNkBAMinOo%2F%2FHUpM2%2FHHz2UM6qVeZCFePI3QhMRxyvnMS8YJGXjgfiGnTs9jEO2ENN4bFuqtMjLdVZ2VROjUByFlnGz0nyFD2zfpWqI%2B6mHIqM7DZ9pTOthNbe51Cb5Kl8ZCMn7NMInX8kLMNNO5ylFyO9Roqa0nnxFJ5zLoayL7tFYtcKstl6wOqTWSVaCsncTf0vqzblJuUgDMc%2BV7wPLxPpcB1EOOidelM2hz3G%2BU%2FzNhwFLPjl%2Fz3x%2FTX0EklF7IRMU46mJiNsxSHqIzn7mNR8mwRv6LvdcUT3REWZ2nwqOiT7%2BN%2Fae5esk6HT9mW9C32R3sPrk1zwVUT5OStAoHmqxKnxZ3vbMInp5s4GOqUBS4BUB14sFeUThqh5m9nBVC1iL%2B6LDiM1Lu7z5HpRU%2FWvN0w3Cetf0pGS65U40TR2iczh96j0TwJ7giIhlzXf2UX6GSfWwka7xt78TGjiYjLL03mEFqcVJcSxVMnMcrjh%2F2GfFFHCMnjUQUHb%2FxOTUrHB%2FF4%2FrQU1iEVbvmJjbbfAiAieTS3lv6riGbeq7HPPxbVnRYl2BZdVym%2FYJOHkX3EpUc8A&X-Amz-Signature=b52e77134f82e27d5cab0af99467cf44720ca5ebcc600976995b740ab654edd6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YEJ3MXXV%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T031858Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJGMEQCICZrJ5XHnthWrBHDqv4UAotvlGNRyGEM1GLqfqfLjb%2BnAiAr%2FiphrvZ24jpMcYxFNNQsFLSPhGdL1WzNYsWz8mlv2Cr%2FAwg8EAAaDDYzNzQyMzE4MzgwNSIM3wgiVBrG3FK4bZAAKtwDNSTFzjJn41nPTlBs%2B36EyYCColLCpKSAKDL0Wy2UDykBikmZrQYxxckbO9%2B%2FGZ0eBDBgbmpDurY9kztpfKrfOn0kYXD%2F3zTbv%2B09WS6lcKmvX9htnKHeeRGSQaZsSpYBs31XxrNlr7C%2BTp56Ri4d8zYUX4hE%2B587JoCBa%2FHlxeTtgJQB%2FbjGNt7fP2p9ZIPB43801KxlvJqKMwFaHshIKo0IBLPTDG%2BKQwVkOFjf4habwePJz0BoZcCIrn%2F7CWvYS0f2NsASBlu9ofHCVmr0vF50y8b3UtcNOWn4kUs%2BFo67psgcFuGz%2B%2FEQKxK40rthJLSOmcqHzRZjWP7W88zbj1Le9fGtVjbwAhIM9rdHJQM9UW%2B1iaJ7CCzgx5ym6VYW4A2hzFrNagcvz%2BvCT4sUstVcAMG1LOlLqveeSRrsg62hFNnHmlqmitqrqTlI6V5MyIrO%2BdAbI28dt%2F1V0BKfgMFumR3PZb6AvY6lKt5SCMhSYpyp8EpdVDzHarGmEITFXtFdZqaxtR7wC3j1jEoFeILevsqHZimYQPC0kfCqd4VFGskDhKVmdHErt%2FZnBaTn8wAsCMuoE0vquTZPnhCw4w%2FpNd5sUNY7%2BGmPDuExta5nsFBiZ%2B2skLa3GcAw6OnmzgY6pgEQ4FbMK937Qgs9hXUmm3zyLhVacNwYP4QMuPrP88YGYt%2BsoLG%2Bc%2BqG5%2BChLbbi8wXc4bJjiJz5pd0ZGvC%2FtRwt0JpGmnDG081PUcu1w1uTwS3KxGnNej21C7RwUm1HCmEkx%2Fev9CZ6VAqjfNJ6awYI4qUmafE4JVxp1ghdCflAAzLCZwSbOokXELFGxRV1mHdOf2vuPvO7rC2dgCE0eTArWr1JUhb%2B&X-Amz-Signature=f1fdc8ca71273137784fb8404f6feefb1864b1b5a6ea2dbd4c2bd0cca9b2f207&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XV2VIECN%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T031859Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQCEKOH6ImAAK5yoFdfqCmTU950NgyYhkxdKSJ82z21DIAIhAN7iPvKT%2Fnbp%2B%2FeJBeaDWgF2bCBm6qVxBFxRJIgCHZDkKv8DCDwQABoMNjM3NDIzMTgzODA1IgyWupRNufYnvpyS%2FJcq3AO3M07W4hN4x677Iu5E7eVHnr0jallX9aItFX%2F3jVdPk%2FnAPZHT1TJkbO%2BrroGhhPHwqwuZ98g6Pv8ViZ%2Bp3%2Fq4OabSIF2PwR9xIb1bmEmaTjwiUUQrxKXXqJuRy2ieHd%2BeEyGbp8ink9LpHO%2BbRsiXjxyVJ6c4WSbYskqBr80V6tZreqHxlXtBmDhippzbqPXFxfVo%2F9rwX%2Frg7kL7VEdTzkklG7%2Bb3RZDiBdHFszaG6h%2FHgHy1pCaX0u5r25HS2T9dcoYJSz7Lea5UrpYyPkWZdEp6wMprwu1j6SxaPspH8JpujYeEmwyl3Hoeo9P345qg3AkVmr2NrNpegS6tst1i39vE202jDuLZSITnFSRW2Gd%2Fs%2BrZHhB0GsYw%2F9Bpwrzfr8v5JQd0DOueH72FH%2FfDczTAY4%2BLZzROy8CKeAdy8bantJ%2FJ4edqDOYjaVeBZZZFMnzPE1ZMtZNMUoYC%2FppX9v4V6Xf%2FJyc53%2FomRVNhiQlYeRz0Tj5xgWBLpwdsPKqWngsQTMtK2mFRqam640ITs9Uu5D9hZrT2vgTSIZVptrff55DT%2FELWzmMbBZUWi6Voa6ebcgBMQX%2Fuz14T5OL0tVBlGSJJQiEsXLyCPqpt7cwqJ6sCPrYTlW%2B0DCJ6ebOBjqkAQBfEiFhoslXnB3XhvztcbzCbv9h%2F5u2GZjGgR%2BF5b1XZ%2B8lorDZhLngrNAwUe6GvffuOcoKkbqWtWwANVgIVTF8c1DkZD2mUFHnUDK%2BOA07%2B09%2Fz4s3wLh12S%2BNr%2BEGGXEKWSv26lgFU%2FHhZhMwMmPIRHu5dxe0YWlDJIXblkk3iuXwZhiwHpVu6bypBHhFA5OOigOScyTO2lxMIPg%2B579Ucrdc&X-Amz-Signature=d6bb1caebf63ae35996beb20cac044b236e06b4440a069518284abf4fa6d0d01&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WR642L3K%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T031900Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQDOknS9h7KvQy0xwQAdVjcN3k7aobn1QNfFZvwpmdqIRAIhAIx0uOGRUGgLwAyOb92GW2v6n1n%2FIe5jVVIWuz0GYMwmKv8DCDwQABoMNjM3NDIzMTgzODA1Igz2fAYdGZaeAEEcR1cq3AM4M80ISgcGphTzxrAJ32xnnffnGishWExuwsVNvaRZvt6RUNFqtMvlPEhbu%2Fu%2BovMmty0CO9dPfwU3o%2B0ZhyeAY3bvUaYkIXd4OIZ01gjuelgjjgWblzAC8JH1tfvwjqwZ82NMwEl5GSpPLD8Ls%2BYpkBiq3fLs73Qgbo0ZiL5Bo8PzwXsxbWF2zbGBqSBZuGeYiiJ2QqhZYu0%2B6Y%2ByTXcml%2BCjnVBC7yRSKHulcRGqK9DXoWrYm1iWCSzniTOYKX%2BQshxbLgAn0oMPFjINjuCk8hoRlO8jk8zJ2k2gT9nks%2BXVhJr0kFxvsdsOzSCgzYM5i3h7WkUtrPxh%2BbZKIRbGcxJZk4qDLsM0BfangKFFAC9QS1EeT3o7Okr%2FIsU6aezMlS4MZoV0Jp%2B%2BbEprEo%2FjMHaWYY5%2BabFv58exfuFMkiQpGNfomy5S%2FEhPvgTPE3jRUxU7UnzW7055kOMA0UDCfDlPMZ6uN9RXOTKYVGndZ%2Bo7HtafVMT%2FqepWJFpMr8OExBXaBrV%2Bh0QPW%2FqcTFxucnXBLm0pfUhZghQEf6R857ZT7ihf1B8Qdyt6CFzTqbQsiFoABmRa1I3HIiUAaiq%2BccyaSPi0wYMkqektvtKtKsx9bmL6TJYB6J0oszCa6%2BbOBjqkAf0oB2VFrB815IESy8o1NttJzpj8xaACXKHC9zz4bXlJaOukZSHAkN0N5Nq8JsJK2ffkjF5elI%2BDYRTsRhu27sCIu7kbFz0k3wNMnqhv3V7mBcSiGfGuEPnryYv6HM%2FuzSpEhoiN1wBmQX2JT2hQvXVPzxiz46ArlCbLFq8jUiRqRxCmTCv9RxyhUItbntdOX2uj2IH3%2FJGAARo0W9790iVFsszj&X-Amz-Signature=72ef66b9dcbb94a956d319ca959c83a52297c9dcb95782d24c912d9b3112b2e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X3TOBFIS%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T031901Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJGMEQCIC9tirqM18S6oEL1CBJNDcYY2THD1wtvmxuk3X7vqMNLAiAPIQjBVe82ujnD2HsPMmawmDB4YodYHdhMrlbLR%2BsmpSr%2FAwg8EAAaDDYzNzQyMzE4MzgwNSIMCj2jh7baimvVOj0uKtwDDwY%2BWqHtncMX3IfMOKZtID7gz713sfupK6VAuBMVLnt4dAJpLTSsgbzo8ZU%2FrmBf44dAcBDjJEKODCjRXn3jlG9CNx%2BZKdcg4LV5HM0Ub2pwjaJKujhG4TF4by7mYPD7bYgeG1TTmFRJ374nxJislabedBaAbKrVQsgbxlN65npx6dPMlkm4BacwCDX%2B0sD6JRAtFFi3vTLRvI3yQazg5BXkHAbe5ODp2TVDtAElXC1UgwDalbR0RpqQkgpGO1lmOjn3tiHzBh4kVQq4VvpwkW0%2BEwbByhz44GiycEO8ZYJVb0N16dVTfgySyUvjzWy91FQLh23CXhyfvhyFxQ0h3Een%2B79R5yhKNg3MSBGIiR1%2BXc59vPb4TfJGBwy%2FK3oYFgr0BPJUiFduGQWSsjNG9%2FtVxFsory2%2FiuiPEHz9BMDYo9x%2FFhQUHRptrlJ7nALRqGdvCQ5tI%2BjzE%2Bw7PCxIpzkCNah6WPj%2FNuE0HLNotIjb%2FjEYhZcYy9%2FB6H4uweYZEEL7M1gVchNa%2FPq9iGZ%2BGkDUUJpNbsgG7E1od4QTSBjoRD4XA826X%2FATgfgvRy%2FH%2FQQrKCyno7KmmGeP9soIls3Zo2K0f3tvuvRHAZpuZYt5jJoXpS0RsVo8bc0wvOnmzgY6pgF%2FSJqcoLjKfddjsX%2FP7xqo9EnEMUmzotjdgRns%2FDwzeAE0hcxmxoRE0wJGnZYXc55poMCzi553o0CIEHIuc4QARqgjjiqDaYBNbsD6SGShBFZ853LJAWk2YZ6K%2B2YnW4%2Fqxk%2Fcb%2ByMdN%2B2g9gg0n0iicCROuxM%2Fn9uymOq5N76WHlAFCddJzIqXzduZlTrpsMZ2rOSPF%2BRsKx3bEnjUSaFTZPkaQ4R&X-Amz-Signature=d136e4cc338d6376fb75ab08aed29c2d93292ec34f2f770441d028be7eda8d39&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QOHQS6K3%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T031901Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQDAevJMFhY9Ub4tPg1GnwKD6aiHdWL54%2BGp37%2FtgjzuAQIhAOZo%2BoG79IeApM16JacqANGBjJG8aY6KowY9iG54h%2FrNKv8DCDwQABoMNjM3NDIzMTgzODA1Igxmp%2FrMH7QUClQ0WOAq3AN765%2BrrXbBdDrJwg1jfY%2BjW%2Bo9%2BHZrt7Pjei3j1oz%2F%2Fm%2FbbhcQyqxEgqBL0RBGxmLYl8f3hqdXRbkXNPjYef0SzOszUcdC2b6FoOJ8wC6v2tDa5fhHYkfOF%2BHCVNAfEeP3KigWSyXxJU4UXbRn8CtDMi5R2tFoAJJK1j%2FKXPCM17ndPTKYHUg9GNlgPNCQcljLPLWiJ%2Bk91tZF9ELxs3H3DFfqYcDs%2FtroI4YLHaJd6HLoT%2FTwMb%2FobpLVG6ye1%2Fw4AgLzAcPQIi8rT2bGWyow3%2BmpOOei0vv46w9U7fxzXRDSkOT%2BHPuIrDxMNrsOeg1BqgJj47SQhYyvZnGVC0Gj%2FKB6j0QxoIyAVEyspnt1wcUk%2FegwA0Z4jp6KNJa82wudR6kZw2q3B6AqDLRozoMi3C%2F5GdDBY0gATYuDOlrm9UjTiNZDaDN1sLQWt%2FTaOT%2FtCjR10E2N93qRXPF77KkAHFnfjBghzI2wXOsOMk9Caw5LSOXP5Q3zFLR9rhZB77Mxfwf%2Bl8qEtOpHKwKHMLwpEWNtySC5E8YYC7tSWv5eCCFuSPVI7s9cgL2H3kD8GUFV6gCk%2FRALEkxOkuonJbXpTfmU5RR91Ef1%2FTRV0hgN8sHvg7umvb1KSgkzdjC%2B6ubOBjqkASett%2Bf50hwURyw1sqloXvUAYACIcsXdHDsslxJGLX93K6lDpQXwGczN4afrGNV%2BVcAED2cAWM7zV9Azc2UxVXieg5i1%2B8851USx%2B4TqjJ1QiMrw6jEjMnwzS1KdaaPCibm1MruzebU8D3d33DOj3kIYVBob0wkIw%2B2i87SXNPlVhueiGXLNRCG1gCH5CEj%2Bts%2FW99GzNDPXI2BIoDWzL2FsoEEI&X-Amz-Signature=29f315436568ced762954d666639c479beeb62eda593b8c6d87fdd3d64e7ca9b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YNI6FWXY%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T031902Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIQDS1S8pnuSPEzHu%2BoJIlVklgSGuJSROtrbSz%2FEZyucmIgIgCi5WSGvDr4b7VP95ku%2BaNrAIjtbcMbS9jzI95pnm8Psq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDC%2B7KySrHTI6gL2ixSrcA7DHLKnAY41q1qG6G9sPHQEf19TAbN9eESqKeZuHxk6Dj3ORgkK4bY1bqxXtas5fy9MhZ6pdJ4HqxoVnrdEhHroCNZhRKnU%2FXAU5LQC2p2MTb5nFetPCHJHDB9bqCX5OVCXtt%2BHd7i63pLqvq8HOe8kxy2vBhSOTyQGfJzciFF9tu73vz6S4xPgJgrwuwShMdSYmB0F2helhol%2FJSTqtYRAV9z4I5o1%2FmoN1R5ejkpWDi5RKL%2FkgZ7SkWqeE5iINg%2FUzX3d6htICdyqpLJxoYzslfeenoOV2zAtbhjZTwLqdmO3N18qAVtjElrcUJKISrkBOIkXg%2FtPmNugq2ev2DZ6ZbHl%2B1xiG7tsgQON91oDSTcgFvLm7SGoBHp9QZWQUHlp1IAeYDYdiWuiDwBM08pzWoSSLRcfbmfv1oqGN6CE4UTVuaHHV9agtyPVPL3d%2FWF5uHAL6Nu%2F%2FURD8%2Bb7SekK1K3gWkbnxuMe7KX0v%2Fd4G6VkKx8keZJWhPKueDYOxAievdjJPlAvB5bv468SiWyRGmRuHHp0vi849bHqxcCpZ877gZ%2BKHyzcZ62XMIDpznrjgGfEl2gQpwY5lmSBpuTagWG44wnbbskA1mIVoDT8UIl3IzrTIOA2kTXSAMPfo5s4GOqUB3XAAbIfoZH4NO4F%2BLGRR6CUYlo04mIfXuzvkbfmTwybjIZoAQgflyFqTiwAS7c3jUQWjvw%2B2r0ZFub3MeazNLOtHzSektjMhdTtE0gjVTWuCrBa42lbyYhMdiu9gilHIwRjJXYdVV9TEnghzmWco4rRiCcMjVKlnQngMnGIcn3cVUMXx56igyd16TByw60bzp3qu001Ko52i5eqvSPFXaVPV7LWC&X-Amz-Signature=5096372aef9513e133cec8e153f89e96fdf8eccb640c647dc008af15f4331b85&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZPL5SWZC%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T031904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIE6%2BkJrm3iw1efAyVZ6ZGPoKHwOpYw2VUklvZWpQRqjdAiEAw%2BnJDyFgIaTEcZ2bXNLZzzm79bsQBkaKRwb18KWnj0kq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDJCJ1S1FMWejFiQ%2FnyrcA0LoI2S3NzpIksLMe3hGADAexHZlz3bIJKAS0ZNfTinIznt505Qod3CcOR2Lu1ayx45qhxgMzpG%2FCJfGvv7sZm0MQP%2FRK8BmTkYCbmmVShScb5WeNx36xKK1IgeMbEcPwto69egE44Cd2Gt2h6w8btBZDsYt8XPT0WqScV%2FCibVxGtihCNIE%2FdpY1kYfvhhzvP42znHKynePEtZiasTQqPTzKJYPRAbt2ykV4qp3wyqiEeHR49JSa4haFakqwf58uA0aG8p7ywXBWzC4QeikKZkmxe0Cj7xhZRQQHeNif9Z%2BOS2R2f4eCebSLhwuJt9%2BPKJIZJYVPd5LiHBnyy4kBcOJpibAm1kv69cDsKSs%2BomsHA1RfwHJ8g1Mg%2Fh1YyQyc%2FzMG8oDy7zjVMsVipA%2F%2FwRnFdEhZUbgmOFAAJsNp1Csm806Bm0%2FGHEj%2FbKHuY1SiX9SAK7SHbxUuzGuWGntSVDts88tKTvh17B0%2FuCv4oYpIRjyf0MIG66vXq0xnpc56Ja7wLNclnFcR5Fbi6ATMIamMHxFtFkfKsUECqS37CwqDSk3r5WUFVstOyEgYgU0e33ap7x3dOfPznRo5s27XwnZvZlUQ1IyFBow8pqci0VcZJyiYBZhUbseyMdGMMPp5s4GOqUBKv2OQt0Bx1f%2F%2FDFbcD8qwCSA%2Fucu5wR5UREGZ%2FeI0NTdno5JFWiowOdbuH2LjNt%2B44YUo6eFXC5oavSzMKEZmyEoHpGgBqr%2BynrIru801vdQcF4sY2mAgNo%2FNghUE4E%2FaZK12Qfj2It9wbpx018a%2FJGCzIiPN%2FkwrFQGS9aaSTP4pKgf2XYYi0M2Z98Z200jy0faDswcQRnf%2FfWoh1EeDCMLA%2BkG&X-Amz-Signature=3f3218a8376262d46e9cd7ad8e7bdf42a4e8c662f9b5c29e64d0a25886ce30c9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R2QHE62H%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T031905Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIQC%2B9J1RIoZBbdIeYOee6nfN37rgTfnAyQcOTPoxBkOxdAIgFSwjaBu9cLOeDnTDzQs8EchsnuKtRZChxHovmagim%2Fcq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDLdZZIeCFDEz0WQ2EircA2oCHf0qKV0EjpzJVfYkVWqfxsj5MSZ9Ja3apQHtLNFPAWPrszSOgHIRq36UMen20YgsYMRpTfcNJ6z04ZDxDCtZZmrpWUJJCyzbU5Kwe18JfTKu%2F0QpiMxlAVYT2AEHIOJjSDUgYXxKKDNI2DejusfAfCGZtFdOOe8N9vluG%2FRKSFl7xPgn2d4TSbVXV05WTlyB3yjkRtuvD9f8txNdsZT%2BW7XsykmEs6f7Q2u6gio20ayJ6uAKMGr6FS9VtA5is22Pc5%2BeH93gGXRAVHnEjWYakcP4vj4Up53CwoKIcBaa8pIg039lrFyQWnzqNq8U8tjEic8EtjBpfIj8sROBmWmQ7OPGK3el9VzpUuIquYXyXQca%2BrJ%2F7iOfWDhi3eZppI5utmFXVdM%2F8XrC3MzI8kPRCFEbtmDZu%2FtIT4gjiYdzOzZZgQCZJRkiPG94WwlruxhkXmNcX5vVVKIX%2FtvcgbCcdT41%2FIiFbjCgs3scxBhlSlN2piYLBEZ%2B2dlUJ6UgtdvyIUPi5HgWtqOUIAQDF74y67Eg3gzpTaZ8VKBTiv1tADEs68SmD0uAauDpu4uHb0p9gC8p8UDiWHtWjVwIVFQ%2FF45anvt4ruiYwfmKPhCQVxDMrAGXP77JALIQMODo5s4GOqUBIcYkwXfGmHXeW50ucsHcR71OSAh%2FSRPEERNhYZVWJCExkuR%2FkFNu390k6Z%2FG3%2FvKSm2m0ZTU7aEk9UTTo9jNXpQdJJFUydxfQRJnNxqRuUlZpo09C1p3nb6bsZsDcYKZJR2t5JLhQh24q9krxRXKyhIy6w2%2Ffax3TJu3zHlrHA6l%2FMghWpRFY8JitiLi20OQ80iyJG9y4reEk%2FSpXvkpyt6hOKpK&X-Amz-Signature=4c72d888f0b1bf782395151fad972fa87341d1b6c88d8420faa034d5d039e8e7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664ZYN7E6S%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T031908Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQD%2F2ZXciDerHvdwrR401iJtCqtpgsXl%2BHsrGaxo7JpbZwIhAP3D6j6%2BH5PTaYvOlGIa8sOFRPztBskzSASFRsPi%2F29GKv8DCDwQABoMNjM3NDIzMTgzODA1IgxecXDpyNQtPR%2F0lWYq3ANtsg6VgxMaw9eIh7l72J43WLVWIfIJ1bCGWsKjGp%2FvI%2FwkjXg5DPwPZF%2FH2Hhjor78tY8kXc01sJZAO8YlhDozBws8qwK6lOsLWV%2BDA9i51Ez%2FNuX4EBTqAZeFWfu3OqCqdhhtns2s1sgLLR4%2F3iHv3kBHlNhO6CgIOZbW60Muzwvm28xYpQMDkYfq4W8e9zFTyQ0LWoeYWBblYQPPra2DsUOrTDGULCGGDt%2F1JHn%2BmMWCGcIEkSpkXCRqYmVoq0Iemm0VQdSgwpk%2BIJUa8eQfGzjRcX6vJUB897S%2BqEW0%2BiExdSs7X4KEQLqhX%2FOr9hAR4Q6iiHd1GS%2BmLg%2FeErGWqOI8wJtI9aZ2QOt0wJ7YnB%2BGCu2OW1DEZFJWxlZFoIoXICfGIWrRuG%2Fi5k5GBC5uIRbeAx4kB4m0B3EJ8xMeM8oUWvtdbXA4mfai6bpeAwd5Eh8XIR46Q1DZSAZ0YlFP48WmiYHnpIhQm%2FLGPnzndTtbNsnUIoOTUnAj1RBd%2FwDMf1qb6qUHLpu5aRTwnl5qrRCdTMJWf7iYgVk7tvMYktpxvi6znw0BR01syD8bXWiH8EudVh8yu5UKziBqhAnC9LlewA%2BBgKE0NPbskfo%2F0nb3x1zGN3F0t0AWejCZ6%2BbOBjqkAVDaG%2Bsxxe4UHTv%2BTvMolhSF%2Bwip6BPfma0FTEm76x4jkhpiKGFFjWgW92odbVdKH5%2Fp%2FBU4g0yR4zGmbm5xdWPiIBVhU4lOmGA5NC3wHs1QyjbpGAq1gnke20QnM1ZDLT%2Bu8SCk%2B%2Bk2r339lfh3hvYSlTBSXwbMGy8XCkb0ZTEoHQ5gxQfo1Lp%2BjA%2FZdTDyJPMbM7gB7q12EbtUenZoEPO8sN5J&X-Amz-Signature=7384b280bc5a2608110308c5cedf644f00c0d802f2c39c66aa28a972530588dc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664ZYN7E6S%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T031908Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQD%2F2ZXciDerHvdwrR401iJtCqtpgsXl%2BHsrGaxo7JpbZwIhAP3D6j6%2BH5PTaYvOlGIa8sOFRPztBskzSASFRsPi%2F29GKv8DCDwQABoMNjM3NDIzMTgzODA1IgxecXDpyNQtPR%2F0lWYq3ANtsg6VgxMaw9eIh7l72J43WLVWIfIJ1bCGWsKjGp%2FvI%2FwkjXg5DPwPZF%2FH2Hhjor78tY8kXc01sJZAO8YlhDozBws8qwK6lOsLWV%2BDA9i51Ez%2FNuX4EBTqAZeFWfu3OqCqdhhtns2s1sgLLR4%2F3iHv3kBHlNhO6CgIOZbW60Muzwvm28xYpQMDkYfq4W8e9zFTyQ0LWoeYWBblYQPPra2DsUOrTDGULCGGDt%2F1JHn%2BmMWCGcIEkSpkXCRqYmVoq0Iemm0VQdSgwpk%2BIJUa8eQfGzjRcX6vJUB897S%2BqEW0%2BiExdSs7X4KEQLqhX%2FOr9hAR4Q6iiHd1GS%2BmLg%2FeErGWqOI8wJtI9aZ2QOt0wJ7YnB%2BGCu2OW1DEZFJWxlZFoIoXICfGIWrRuG%2Fi5k5GBC5uIRbeAx4kB4m0B3EJ8xMeM8oUWvtdbXA4mfai6bpeAwd5Eh8XIR46Q1DZSAZ0YlFP48WmiYHnpIhQm%2FLGPnzndTtbNsnUIoOTUnAj1RBd%2FwDMf1qb6qUHLpu5aRTwnl5qrRCdTMJWf7iYgVk7tvMYktpxvi6znw0BR01syD8bXWiH8EudVh8yu5UKziBqhAnC9LlewA%2BBgKE0NPbskfo%2F0nb3x1zGN3F0t0AWejCZ6%2BbOBjqkAVDaG%2Bsxxe4UHTv%2BTvMolhSF%2Bwip6BPfma0FTEm76x4jkhpiKGFFjWgW92odbVdKH5%2Fp%2FBU4g0yR4zGmbm5xdWPiIBVhU4lOmGA5NC3wHs1QyjbpGAq1gnke20QnM1ZDLT%2Bu8SCk%2B%2Bk2r339lfh3hvYSlTBSXwbMGy8XCkb0ZTEoHQ5gxQfo1Lp%2BjA%2FZdTDyJPMbM7gB7q12EbtUenZoEPO8sN5J&X-Amz-Signature=a8bc4efe3a2a0ae888588e031bb2d218be2c5d10c7a69ddfff070e8742421959&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
