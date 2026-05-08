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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RARO54YK%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035305Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCMrFlCJwYBIL9ZO%2BZ1EUoA9Vt%2F5aW9qaHuxaKjDQu8TwIhAJnvBM0DjAmHZEgvW%2BXob%2BZemQc6brMbgCgyf4vuYQ4BKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwYuqJe27gZCq4akvYq3APchpAXW120mpPKu0JBp9TxhLcf6lXO80WpCRusDF%2BQipWt40oGYj9%2Fdg9azZfnCpT030SfnEO%2FiX7vFAN6JMmin5GlJwYORP82bDO5f6EJUILcKAiSZ%2FKptESavZE0SzNPlU2i3MnxgTXlD9wDss4%2Fe7zyumy8n6%2FpZpRbzANVtlF9YBIeSB8Bvk9XLLIUIO836GjIZPTxx1bKJVse5N9a%2FN2WaRRlfrbh8aejCiS9pBD3Ml6ve%2FEf%2BQTzG3Dfo4Obkf8aDw4nB77jYJ%2F9nFuRQqv9rhlMw4KDNj5D99x%2BVmlWW25j1WV981mG7BluWpAVjr9tP9PtrtKrue%2FhNf%2BeLPLYPbFv6UMQhaedHsxrj4hIG8qH%2BJZmiqXO9XJvdOLqMVrK401XEzeUnyZfNQMjjNT2ZQzKZtZqolREkqI%2BI%2Bt59R%2Bv1U5FTHAVNNTAU2j%2BOIO13pft1OfyagmkY7A6akJh4aFvGOMJwAGcpCI2aAkn412je9%2B4Iukev20HjAs4ERsMYfHTmiblBfRNRK2pTngANgj0pHwaJKKFYXm%2BAQhsRwaa5CypNa8T1AqgxNRVGWwdqtACxl5RiIt9Se%2FIDXCks8yvMVRQXBq3ex%2F9EfxvpZMJiRcLmjWLATCHmvXPBjqkAXAH%2FLKDEkw6%2FdSUeAsXhPXaqrVhFoWxjxoNOdArZKj0RUjRneJypHYOpYDGDKf7yD9H7NHs0VPw%2BheavxoXQZzGybfYtHQIwt%2BrSwswYrly0nLl2fjKyjyEJHsJO45%2FSv1qC9uNNez0g0hfSIYk7x4142hggfEei8BRsXKZnCDC6p7rWVhX0Jx2CyXx9gA6IKTgVHl93ZH2TBXbgyjsxjnAihKP&X-Amz-Signature=2946c646633d34f1f29c41e403d34d9ab72726daf456a45b6914e04a75b20db8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667UPYST3B%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035306Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCf7%2F0rV9%2FriJy99CwLEVPxXaRr8YBL5eRpKsK2I7X04gIgel2aBwUj0TtYLEGCoDDSIFVISrX0JxGrrzZTeIjpUywqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHV%2FRYebyay414UxrircA0BG6rmX4lU%2BcLsnn8kct5LL5YJULfEvBPkE5yRuO%2FKii50tmieQAebzab5IZtEwGBkY2Rx4eHopY13LmL81Rgn6amElos6JsUQ26odPEIOMOU5FRcd2uYXdodZ4LYZsZoxtl90fWcaJepthp0rPDXd9oHJrqJ2LAM8bqpYB1bquuM7qaMC4fi6SFDmbfFSB8rrnsoX80nQFyhxZ8JTMH0upwxazujf5PnErS6zP5WDf431mxnX1%2BFf6Ji%2FAmlfejboFaADufco0lv7wKF3xvHMylQNA3RCI%2F6ajM6Wt9fPv8Twp6zQ4nkz7k0F5ksTjrZTGHFUtEQAXyLDSNN0RXOq6bfz1xwPAN5vd99R8CaG97RVr4%2FPraQC8vNKq%2F3UC3agUHQNvLE2Q0h4Y51UU4LgDq%2FfymGxunJOu%2F2FqLKQ3SFShUZKMufKndIjDiq7knIhWceE6ntI6wiEQBkZfjWHIGaxalEAmhactKtWExN%2Bu1dPF7FfONT%2FAfTG5p4SAvWajfbiaLZu6dk987pyhVoxNcSFQtIFbyHn7y%2FsGMSF%2FbZ5eRz0ZrBYbmtb2IpmWsSnmJV%2Ft%2BkMO9gc%2ByUuMzRjGUC6UHgbCa%2Fm4zjm1F2IKlVLqbJcivLvE6Eb6MJyc9c8GOqUB0JHF%2Fn8zZyTOPhs%2Bprh9n6MS45bSkYwSEQVdD5VfHetYuYcOQ0tXR4KjIfrRN3LMlCasmWm%2BoyMwTL6rN72%2FRo2qIR1ov8fj3czG%2FlA8IAZ9VsoZk2%2BVE8Wclbdr6%2F6YdsgnDGZo%2B8EPiKzrtsb1LXyR5DREi7ZiO%2F8dyOHnkdTvAPmS9oni6k2btnB%2FCWT5fRrnABb8%2B5TuAi6Ycwnww8bfJUJY&X-Amz-Signature=08e9cdb96b5a6838d76d967d8d1209af91480578d837e3299aaccd90c2cc1b41&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZBQ54VEC%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035258Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICP8sgUxbIYTdIUYsOGcku3w60mL69952GFOPmuQbuWxAiBX6RbXLi6p7dTwWu%2BylkFtgi0ZAmqk1U17EWrXEkbLTCqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMnKD5azgverxx0PhQKtwDz6CyuFO8eZ86VaQkMK2iqQ%2FOZSRwv7VOQ2zuc7nouYlMGqw5jROlE04NQoibXGZnn4U9k%2BrfvIVRrqxtDZe9tDue1GJZEhhTQKuO6UTBdR%2B3Hm1UQz1Gs8B%2B8ygP%2FDR2ZzJcEhjjNUx3bYkNAtFD620w6T6iTBvaSdOF7RJafGCcHAWs2DvLdsa%2F13mKcyRqqyjSuZQv2ixwMV06YfrpDhHovjXb0%2F5kvnI1LDNj4FFQnqTOoW2Hqe%2Fq%2BIeOcfhoBywL0oVC0ZwxR2MYKL4XiMlYMU03Mfbo3kl%2BdewxIuIwES0mSTPzlSJGjYDqxyguboExlnxvBhF5HotoxnJfEN0C47kHWacAOSL5R2J4fUlri%2BIi4YyihpDzBlVB1SPN6Z2813Pm2vW3l%2Bqbn0WgL5xnKHx1llfvoeRO8t5qw7mvJM7Rd73bP82qRRGWk7R%2F4Y5eNTHLVqYztwbAZGWH9ImvodeJFk7EtcE6p49ByDA6RG4K3WQnuXNL6B7E9mFwK7VemHPggDuq2Sk3qxC5NbeEA2P%2BLNkw2KnKQdhn9uRR%2F1%2FV%2FjCQJbyCz89AKXayAZAkQBkdk%2BlX2D8y0dF3imvecfOJdTkfzf9tsUWPKdzUfWoqdrW0Ed6VfJ0wtJr1zwY6pgHLmDP88PE1tqxuCOc8puitGh8LMQ8om8rJivONCUMHcyKpAm4kOwz168CUJVeclep408ajzNSMmoW2n5Ie6kzI0Tkc%2FkuofSGAGUnMpt32fmjzJtPjVlOlPl6cJiU0BJzGDewSV6SgL9wPylw6pFITlApGyfga1iQniKG25iYBJIrTNaPrd07hbgIRFeMxD5JtDgmuQWZ%2FqkA1%2BSq76dhVa8IM5FCF&X-Amz-Signature=a97e4ff1875e8435d043a2a3a9712e432d27db68ccc852e39c593fc660ccfba2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QXIN5ULJ%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035312Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDL8LK5pSyzRsRkr4yTUbBwSLwYRXSEPlMsgBSPQcWvyAIgMj1EyrK9wkpGJWvA5QBArd%2Fk4O5tx6kzL4G27UcPLJsqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJdJkSh%2Fwv4Ic1ztBCrcA5%2FO%2FuW9SIonMFwqyQg6A1xVJqXnh6GucEBfa4%2Bkw%2BoWCZoKLCtqrjVoyN%2Fv%2BS2hlJXXyds5HFOQL6CTxAcX6fean7FgGcL%2Ff9G3pfvWwrZICsiEH2w0ib%2BTVwqsi98sYJFrPpmoq5KG5MPyF9YXFgyp4kmaJImkF4TF6m0cN1USvP0KnA%2Bvus105apgX5CrPP5J6IwaQRMjTvo4UA5a3C1KSEevNyubPQXP7M%2BiJKi6XWL%2Bm4OWYGGvVpT2%2BL0PmpbL7SgKr3rq%2FY1Fe%2F4cP5Hj6HGibnOvip%2BYjpHCNmyQBuzlLFStWXfdfKMmwi%2BLlXE0VFjNd2J%2FeOCcYOWYqD4Uu53PCozhWM4a80KuIpAeFxZKCBE0oyK88cHZ3X5XWVkr6glzP%2F%2FD1YO%2BhIWNIbp34%2BhfgAOBcN77Cc3tmNzA%2BVa6oOZBxCs8Ww4MHERQ0y1CR%2FgNtcj8w%2BzBQBhXPhGBZcKWa9uQYmXH7MMGCVlylzrYq1uj682%2F1gHirk0%2Bxw1IBlDm5hk%2BmE73F92xXOVvqoNxSikzM4Tp%2FAJQJVLzpUVHjKnjYcEr4qdBvyXzPKmNCmkiTJZZga1RVdm5seWtQ5rQ0sgMSb5v7HncmpSVqpOWht03dLUL5mazMI2b9c8GOqUBPi3vEwvIanvUZQmoRqMdbAH4LI%2BSE9lyRWIf1FKXkT2CvTFDe1Do7qeDuBMccWVyhvomrQNiwjSgX3Y7BnEsyn3wv6Tf1bia1sCe5OdEvMqx6I%2BxoPgxK80KNXzMH%2BoUDcMqleEyCLn36kHpZCqF5TxHWYXDdtOFlmA02WmkxYWHTzTF3xWw4zadiV4%2FH0WVa80nmoVmHL8qZO5rSbHz8VrTaGqu&X-Amz-Signature=dbe0c22f752707b393f4303f1f6a87a0477a565fee4f384a3af74ed4b9978e67&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VD7CDSNG%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035318Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFuPSe2njUensUQLiWbwaE1fKe4UYapcgo5iQoEhKfYbAiAe%2FqSmSTABp8FEjbn8Obpfo1%2BdZJEOkz034WlDZ02nYSqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMg9EMwGoKIi1Cr%2FrPKtwDVD5cSlil%2F65G1H67OJAdrgVDjJet9c2Fmb1VHacS%2FrC9e%2FShVU19ZyNFN9yQVjv%2FodLWFBb8OniWQb3yZNyqPoDPQrH0ghq4hWKag82sDCONzkSioILPH6eEdkB5uYY7ydcv%2BLiShLrDuchriW29rwgQclP5MIxVp97GNnoeTpNvRQxMPl7eYqmvcftqvCfIhIlf%2F2V4IPDwZ0wwhl%2FxAWbBcPSpEifBsjEvpuNzJ3ljFchzcMnFnkE3c3NdRKAIxMTk%2BN3Y2NmlWr1hHVgZtC14PdVezago1nvvAqWPKmJ9iUm%2BeGf%2BziZy8sKUko5sAqeHEjNuCY2WwlhRAxB4wnCABhG70Vk9E29eN7JB8OBQkcIt7fTXhf323%2BOW%2FrDqgAhTWUcpRZulCVUVKWmxjSbJ8KEJJmo2Y1ETz8F75pT69Y551cbOFI3ueQ9PXmx3mJOUIW2VEZLEzdkvEsDrc7gLflYA8vkkIfxgf0JL68HcD8ZCMYp%2FCiWF%2BlX22WB8QePruXwSKt1PRJ30NJHMEkYNnPZCy%2FbZlw2cQ4%2BVv2HlDGma3szfsHgOXecam4SDR2oGtqaY8AsRmEkmmRTDqBezjTG4dUQcGhe8IxCpNKf8RB%2FMoANxN6sLiAswp5r1zwY6pgF%2BQbBl7%2Fnq6HXluMXcN%2BsWTFnlxnk1apWOhgFpilIckuWmCv2XVhWIu3rQSnRnJD9is9oyeWGhBgxf8e%2B%2BxIPg4TL%2B%2BmsRHiUMgXxQAUbX0u3YmHfRWHou5hpANSyJQslRMzSO7nxpfpoWIwVe%2Bh5inpkgOdMpglpSS9HTAL%2F699N1fYmOdwHIOy%2BDkv4ZvczT4akBiSLkWyPlCMDVuAI4xlC5ji28&X-Amz-Signature=b479323ef692fd2d6a89b5a8bfe590653157d2439da301bee642c2b6d3ac0467&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YCYETYXU%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035318Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD5Ok12u9ZU%2Fzcx1kNrho0Y2TbGbKJpAFZ4qe9mbc555wIgO5%2BK6OTdvmNkYkAUt7Rrln5j6JTQ0k3WXVL5%2BJeMyBcqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDB4j%2BwxwOu2769iZWCrcA1V1omWyOV2QmfC1YO35MM0LD53EglRjLH9kOu6S3%2FrpewLdnBSU4R30BRuapB64KkIvjHB7v2dJ%2Fj4h7YHF3iKWv%2BRRGTWpSldTEqr30Zi%2BqR384QkqJIPVrI5fJGPBv949NF1x%2Bpes07NIO8H4VqoyZwO6WSS1Jeb6QdXUAVCdug4kgRj8cBZchoAI3C5fMt7G1dv1Lvn%2BBRhVSL2rtg%2FXyexlk4E4xuFkS%2F3zvMxKQtL%2BL3Ncr4GcIzCSbYVulYY6%2BD4w4W4SXI6RbXrSCRdhxnLW3SBqZeWMaWPTj6VSIlnbD8pqS4twlX%2FVswghlwWLbmu%2BPB0JcvHnWu%2B7aajajJdTJ58pnBMkJFPNc%2FwQewtBI8uJyt4%2FMKTXW%2FIsqivSPv0CTqqoM5geMzhZdemkefqL1Xvwd8Ckg5g2uJU2%2BQQWZmRtR3XMWTEJaj1wZj2LYeOZkeA3EFsCEZZtAXxbkUx%2FNELtV3xwBIDvKwvHSqoY%2Fsg1ip1HVZd5JOLitIeJlXm1hdV27ITdxQ4sf5wVKkvF8oxehpExUjg3tUj4fOWfhVXT2eTi%2BaD%2FuUYAcNWRSfidZgz4UaNGsoEZ7kxh%2FWyaA6mvJFC32WhjIyQbGbQC5quQhEUMwbxeMMOb9c8GOqUBRRgNwZISdUQHc8%2BF02Oah6gI9ZAOtRSGwVUFSLjI54wA%2Fw8r4zxgWYwV608TDjslNg9EFOIYMquI3NH3vb5ZGxuJ92ZGI4bNi8BsCQk6NiWaLoOE3TQMivtzosu%2BEsn0nDGnSVyzrKYrmxUGK2PphLqMGGn1ZkEQ%2BER793kEeVY0GsSNoJetArJKFDK0WzoLKRH2UhjHIFs8sDCbBdeY9wNNFTU1&X-Amz-Signature=214f615b830b4ab5ce55022a39117e0f83e3e5571e5ea08931a821b4f743a82c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V6PTAHWE%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCSgtRpdOCDYiJoU7KjWdHsVFny2dDBsGWuDObQ%2FyFwBQIgOq%2FjNGtfP6JwogRlXkHbN0wMsuERlW%2FOrEZ5W9HSeJoqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPXqtQbsjW1qoZSJ9ircA2IspAUnVdQ7qkYk1Y0fvip9LJcjpLJFqwmtwE%2F05h5EJoWGaJGWSdibUb1qoVtZVr8%2BOX8rFJR8ONZo8f%2Bvf3WwsaRfbX9%2Fx6SfB%2FSnf%2FbfN7OYGHGVuydZiHsfjigcdmChXB0nnob5CDfp%2F5KVPx7v8IgJlxoSxZM6WN1ZafVay66yFYP99ib6VrClSsD0Tye7hvlDix%2Bav1gzC8nEm0Wr2xDLC5RzBpxv59hpgdi%2F5Q9TyEGHHWpl5ocV8xKGd%2F4hgHRbFD0JF%2F90tR1hdflLJwG7LG%2Bm2RdjYTQ%2BwmuHSwAW26TDPNjwux5jujGljaC1nrBndaEpd6jQk2rVRVzoQaASIFCc7dBZUp1bAPDFThUQSCZZp1B%2Fu%2F8SSTmj9wX%2BxCJsu09JRHVhWCa4twnSi%2BHsu1cxXMMqGpO79g9lILjjfX0r2cX7a2Q8NL4hOHnhLvtdtVwRVAgGRttWuUQ9thYO%2BRA6MaYuivpYf7m2L3vZYQIKO078lCujWIBCOMiGwq9PSTmSVzBFMJqdWqTluNKZe25Rnv8pbKg7T7a8LeJeJZJAfCXyXzOtrYe88m6H0Edx9AyX2CAGbD4oPDD08fBZ6ZQy59etLPTyHnnvZa1QId%2Bnrg2Oh3MeMMea9c8GOqUB05EXUXlZFQSgXSWfwPqfmq3D1mtITu9TynXiW77jqo2sqoZPMvZoMAxcRiItXds4Y9bgHVTo7jjkdfrpdSTNJ1eL5q96YNQ3nl1evExm4RZLtkuJKTh8BxCgUC45X%2FFvPc%2FSV7zgTcqRQwfuYKVVlYsjI0%2BrLGNjBo77n80buD2B8umC4G3Bmjrh6WFwUChY22KBcbtpGN2qo0ZLJ4FAibycIlLQ&X-Amz-Signature=79a4650942465d7975fc0c5b9d0457f39061cd1c77f69dfd5dcf5a7fab4fb0a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664MO34C2K%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDO9b4YIO8OuHc2L%2FKvgOjH4d8Che%2FdnyZ4k6%2FQRpzPVAiEAxZliOt8YXsyFQKHDRmbADsajSu6QRcD%2FkvnZtLLYVHYqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPc0KsmHpsWMHr4hhyrcAzgoyXR6Cx6FrzEKvPJNeNt8yDL6RIcyTmyAqf8ib9JrRKkMw9SX%2Be9opdmiKf12ypXGBsT%2FdBWA10f5pnbpta1gxA7hw8GSgqjYxvoWZK88fYAStuhOZ7ROQ%2Bt9XTaebnNck3XboR61bZyXbdT3JvCWqRf67CYj5qdFMVI%2FqsQ1hIwBVupaBaMXLkOTvxUFDZi4V4UBe2ZkwnKluQv73g%2FMag6A4yxtv2imqvXuePEU6f3qAiM5LCP27znW2cEoRLvn9CzvGd42JgcMUJywTSwcbu%2Fq%2FAHdMbglKaGSpBuU796NxPXSCzsL%2BA2ePOTSwva%2BTRPdKS9iasaUJ33m1chKixG6ft%2Fcki%2FsrJ6uwnb%2FOOKmUJQWab02tXxVv4xJGajwgdM4DXh2TsjebXSoUkbSUGDrC1fKpOxp8lfmoAw0yD69zidySyWO63arO7BLVCDtYIkh9q9LFGOQqLM6mY0zlcoo8zld2fl%2B3TzDKkK20cC%2BVcDW6LZLCCGtpODaTYFT59oP5u5AhFNln3DybqFaGq66KzYCG1%2FXWuTOr7jLG0bQCgtfJVtZcdf8bZ4BsSB3X4bdpeuVd5TTe3tsI%2FJxNbf1HTsD%2Fzb1ZFuboYK5DbRQ0TknUp7uEKgHMPao9c8GOqUBce1EePKLeXbkYuUUD%2F4xjM%2BFgbdfKQR%2B3JEoyWd38oup6OJyc6c5zwjZlVF4OD%2FK8H%2FMaLQlzqeqILE5OK9S5oiF38AuP%2B8VTIrEVPNbses43onSTnZ04JHcT42EX%2FoLZVcRc4NQGdClwywkNePzs7IbBPDFxjI3aE6Soa1vnT5CtMf%2BvTrsGDqCbGkF3K%2FIXFFD10yAoc4n%2BT%2BOmb80TQdIThrk&X-Amz-Signature=069bd0f9b7274d8ee00e774772f64977edd3ed5c431b988ec074475758d02dfb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662XTA4ZMG%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBf7J5%2Fsbo4%2FoyzE9QoYhKDTIDntdHT5PzipeLOfht%2FDAiBKwV%2BuZoA8KhWEBN884n%2Fpb65XmcUoueam9nnbC4fyyCqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMYSEaodzAmDaoQvWcKtwDsu9MtCfALQJeoEV8b0M9L81zbfsGUNbOqa5HPaPTlCiqKfI4xaPnmQfHmzVihlPg7Hq%2B%2Fw7W1SmbcNwfOWW4pupPVZY%2FT9EVGg9RBVL6uRzx6q9V3u%2BbIAQUH91TldOLIFRpMUROWDwo8DyHPGJV0%2BPchleLdi1QXkzw%2BzRjzDGMPyvhrVE9eY3mQmr0%2Bf7hx9esmxUZiZ4yoy%2FZJJsyC48R5YsiAx%2B7CPR9mh55Tiiq%2BgQF1RZRl1K9JADCF1BTWu%2BF1kBclCIaFcWTlLW2XO%2FSOdqSUUWlg5mFrrFvj3EV%2FQ6bKU0WaMztI1spHor7yT%2FQoHkoIgqXnMU6m1Sm%2F86dJdee%2B%2FKb07xDf5IEeDmr0elAgWGpIMF2u4gQ7%2FLF0xRJX7%2Bs%2F86ff%2BvRN3KijghUuPKvAoHrbhdTDAi9HybxAAXI5kuJ1UnhnzOK59HGLUsn8mmBJ6l9jjUaDcwEj7VLX%2Fpt4EKgyRU5QK14JBhfy2VfTIuISJERJPGWVnKZrkpqDMQQbkxPmAr%2BgwLVIdsgVxTTJmPsEiksEuJmVu44agaSsHOZjpCXGnO1eL8rRFxaGXUR%2F8f9%2FIH0ANIoSQbdNWYNFTUSVPchMx7YVYA3EtGKoXqQonhKClww%2BJn1zwY6pgGpRp62DwKS5BcoEySu1MvLIYcdHvP%2BOeqasUiHAIMC%2Fc%2Fpycst%2FfBswD%2FV1IrFPWb1tBMAkThGIilqJkS1VeH1JuS3kIgb501KsGTmjC1UF5xpLBQvGQpeZPLWCioitAmjnyqddUkeC1pYkpjspOxLxkKtIliYVpVyg4Aim%2BDTT6py7lXVk3TXfgeM22e1kyXq%2F60UfeX82KEalMwt97FQZSobr8ZV&X-Amz-Signature=608147f280fd122a2a98f2fba530183a06e75285c2c16b65efdf42b6cd61700f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665PMQPDU6%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035321Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC0gvNUp6NtwZ21ix2aVj9Dq%2Bot0IMcSUZcAptQS55bZAIhAMYbWSrvX2ZmKz%2BE9VBRSPGlLXxJRbQJbqNIJEbBBrZZKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyWaew3IKUe1ree9w0q3AMSziSAgwVKsRyG6qwJ2QUajtDKukrJHy%2F9r8BoBvtfTWET3%2BpWf%2FQXP1MRVq5VidlGoyJXRQavfWo96bz10G43CIKVryo5uPUyWFzTpE4ns5m%2FiMkvqhxmi79ipL%2BVCMzq0Y1g%2BM1MyAmlN3f1rwyNbZD9xo5J%2F1C%2B8akzW9bxvPWM7BDfmsFNAj7iDczQ60ssoNP%2BCCJTZfG1tZiZXoNkfnyCEpEcfhl3cAq%2BgpJSKv5Rtk8hFbdjWfYPVkpG5Qqk7vki1g7GfIbtLQ35JtJ1VCHL9v%2FuGdcPiaZZBxbLJn17PPBGcdm7TRbdwGu8pSa%2BbKHdtndXwQWk6rUG9q5VA0husmEPZLFHhGzMTlS6%2BOpd6ivNjjYFejWhtrbjTPvCAW4UvF5x3hbyk7o3YB2nRnAnnGPQo9dGabmYzFCnJzdPwwPziQUMZO1dgUEIw%2FBBWxoQDp0ozFlgf426DfS4g59y8RriAQCFc7c5yqFkDvrxErq8uv28oFKHZDZueBuo3nA0xeLzbTqdQWRmVJ2UPj95BGcDofDaVZin67ahK1AlRye6zxYRNGBztopt%2B2GOzzq%2Fk%2FrbnnUGWFLdeCv0EXCD8eve0iqFaFNfwqO40mWfskjdcEdh7cI0oTDlmvXPBjqkARFceYchLxqR7IuKNoubHwM3QQ41MWh58BI8VE5c0z6l%2F4FBlEPLR3ZHHEi5p1DRWF6cluJWWKtdk6mqBQ4Y%2Fgut8h2K%2FaRyzOe%2B24XKjL2kVpOdvwYYIQuI%2BTrx89dELm%2Bc%2B8beZGApzCaWfTVemPEGBh%2F5LmQAnt%2BnwxsLxMYhKqABIu1RdOTUbO0sCTCX0xVlG5HWnmevyJt9QHsU7%2B9TPwLE&X-Amz-Signature=2cc3437da520321d8b25d0c23b47925e53d549f80b6683bc880f9918489d418f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663RBIRYSA%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD08Laddjl6lqvzjjri7SgHro0fdl5TVOdpYy8sMuY%2B8wIhAN8JoGbXd1LyayBoF8Z2Kw28Warz2y%2Bg9i7vD9uBbFGxKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxlRIDPLhE6SGeXHVUq3ANn1u%2Fw2n6%2BB%2FvochZ9%2Bdeot8MdG6iRxYDqIcbWTAhaYNc5Zuz4UPmDdcTPS0uLhLBRRTxrNnkPcZCI34AvKVZLg3DQT8M1WOqn%2BtT7hHtKPR0YXWkcuwCSRJqBeZEK9otJK69pYayDthEpBHQw9q58F5eyWdSTsUJSK48Ep8OUV3CkkbIgKuctfNX%2BWolBhi%2Fq2cLcMrvyWUbcugw1Obz%2Fo9XQZVKWeGm1lZT99r2HR00l%2BdaPfK2RyeyycGP%2BcMvkebb4CCPP70RysF00hfNPxuaaBHGPQgvvQqkAr6XfJHZXqoYi9Mzd7V6FVDaFwxoGM9z0jTvU769Ycnx1Ay4rY6Lthr2rrY0FB%2F89uQh2jOOEJXJak%2B283GjvwWckVYVw0HOd9aqO%2BdPCIYwxmjV7sbQdqchCslXv2DICsA7VsPUHVHBgeKu0lzoDZ58t4Vbekle2%2FIZXGXbwFDmXxBY22WQE9HLQYAwjRBCWoyHzI%2FNrokWIAiYAXh%2BTR0ZnkzxlNWX0E%2FZV8WP7Q1f8KQx6bOGnxlTCRhi%2Bjs1Of%2F%2FivMaT%2F2EtXX9h7ARY0MLPoPzH8kLyLf%2FWTd1VLancOa57OUz69DK19W9x6CENTIQMtgCMBdssMsvkv%2F6RTjDOnPXPBjqkAVz7Oh%2BjkYH3jC1ay2JtUQSYuCP%2FVzK8pa1Y4XRZGHlFWKsyDy79V9nyJuQPxzSlAesaRJbmAqqSg8z4fcGCl3hHdU6t8RLVmJkn53Zw1MrF6G416eUE7gz2Qt4jAUzajX8jiU40795i3jbUOB2VWbTzLuB6wqO5VTuRe75AWzlYhP9QCfihA8X1ibpzRgrIPP5AEyn8895W4%2FUnCiH40SfVaS1T&X-Amz-Signature=1ba39938ba767a1168cda19dcd6f183a20ae53816f764910c7a36dba67dffa43&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664MF4P5EZ%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035326Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCIv55Qcv47VLnokc7jDuMjO9GHItUmewADSVhqTR37bwIgSY0G1goVfssXPm3yCTm8yxR%2BYoJnCWDpsKwlcclomQUqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDB2WVaGuTi5wbGDwECrcAxqm%2FST8xWfYvGVhE1nqTu9hfW2CeA5eLAkrp0PvS5D6RB9jkDsujMZX4s6LP17rAdFbFUXZRPL%2BjBVMhcy4vfpdA7sE2RojOMp5mb%2FP4Az7n8ZrrkekVUDMTj%2FTuzr8uV1cDC4hfuiuJhWdPboMhSr%2BAfRYIm%2FFCiHtAABq8nSZQ9Tme36Sv4NM0kp%2B%2FIP8InQXdyR65UOCMgf4q9FlTETelRTXdT8LnzEj6tuJEBHPs1ESmdVZR6wE5TySfTwy%2FkZmh%2F98jk8uTiyZ7wtp6%2BQyWUnXQ9u7TXD5Xl6yQkmHmrq%2FJmd4ShPCrSk8%2B1yjOcPOLB7MgsRBz5ewo8m2jy9xarNCFAGMEmPBxFQONf3%2BB3eqvCPB%2BttuhGXU9OV0y45FgUGsudiLg5OsEWmXzhr5j942VlPx%2Bk2yf%2BcQSzzNXrNDcTNDsGhgSy52wRPomQpUUBwKASdLvaMCb3DQZvA6O%2BWnH0pbnFa1loBF%2FFV%2FYimhgP4U5Dw8DYCYogz58bCtUfiBUjy1t2PrZMbST8FWsuZHGCGMnT97BFRhg5Sjp4Ku7d3eKd%2FKkWyEC9uVKmhO1c03KljoYWlWztiAEIF3fKDxfpK4bJoYZfrioRoDnHlSGWj1bTf%2BnUbSMNWa9c8GOqUB8pGmu%2FSFblCY67BJ8UkRfNTAyvf%2FvlJvzZ0CLLqOT5ZMm5EbSBcptTCL8YfZ2fkNwI61MFmFU0d2gYlJ3yDo2sGkFzDGhW8UqoXV8h%2FFVGD7ZKdmcJcxVal5thQp78GqywuZhNoCTFBfnX5avX6MxxPDwsXLinsh4K00JRainZGxoI6JT4cO3A62XIN31TIu5PvXF3rJW5959slon%2F51jYe7lDQn&X-Amz-Signature=9af214dcfbf5be66c4490227185454d30954b3de46b242e16fcd02c486a47a1c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RF57W2HT%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035326Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFTgPylbm%2BeacW21Yv%2FusrM734CYKxZl4DmflPsKhd9gAiEA0kjKfCN8N7e5JV%2FZEyjut1dkx%2Bg8A1fqJ5XXEXwdY%2FAqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCRx%2B9ZT%2BSd1NF5PqyrcA4G78BvBXl7paaKfCJWglyUbE7V9QmoCoByRf4%2B14i%2BrxAg9f6zfDGTl%2BZq6I%2B0Yw%2BbBvFQJQJLp8lSZK9xQtoXT1NolX6UJuAmwfBJmlQGY0iY93n6q6hzxXVpM4FQqdQhp5tknqCQBA6mIMqeW3yEtjFLpELEWM%2FgwdAfs6A%2BzOf3JZxp%2BUjI8BHLnwdUKZu6ugdlsYjZNQimd%2FVuT2EXz%2BmY2OAQvtXtjr6rNFzqISEWRS4U35lTjWXdb2XfuP4rUwJvlZtil%2BgafTJNitmhPAaV52OJAJWPZ3eVTZ9%2FysJLB6%2B50ZF3ZklS2OZvDJZ9krLb8q41JKv9t9%2BmH0lrbV%2B5Xr%2F9TSpbrVGBXAlJj7%2FVpLaY8dNuNi9iT5YU84emEJwL7pTDbkX%2F4TRpmGf0mIl7kP1AFtiUXQtdqbwDV9s9%2FvjDNCjjabIpq%2BAFKTV40ASEffOX6EcKb79bBn3VJTLZMPoDAXrmvX1iEp3Tk3trd4TrMpkeHh8RoMuNWprKIXwwAg%2FFJXMJSzFpnhmfXxmYt2GRWit7KZ5kAeRM0VVTPRC%2F3R%2FQJMCAJOZH1IoBI7mHJo9sqgHY%2FVWv3JzM224mczZcGwBfWbnak9UKQDEqexWDJbwGZlEBlMLqa9c8GOqUBGm9kjclZ%2BmbW4UbAT4TqgH5P%2F72n9xVQiwT2x9kj3iEgR4H0iplTrx%2FI2JTLx5EVDkTSzyq5SsWR23Kv92t0LEsInwh7PVAPwZLiIQjhYxqeLW%2Fg4Q2%2FkGcpEP%2F8yha7xQQnsc9X7sgVOzu1zrW7rd%2F3LJiz7HUhZrtLyta%2FUt9gymigbZSAUiM4EMv8yf7mhA2DayKB5K3ofpt%2FwSLwJFjWf4R4&X-Amz-Signature=f1e15781bb1a3577e26a74ba7a067011bb94364928ff40f3e89b01e26b00dbe2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RF57W2HT%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035326Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFTgPylbm%2BeacW21Yv%2FusrM734CYKxZl4DmflPsKhd9gAiEA0kjKfCN8N7e5JV%2FZEyjut1dkx%2Bg8A1fqJ5XXEXwdY%2FAqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCRx%2B9ZT%2BSd1NF5PqyrcA4G78BvBXl7paaKfCJWglyUbE7V9QmoCoByRf4%2B14i%2BrxAg9f6zfDGTl%2BZq6I%2B0Yw%2BbBvFQJQJLp8lSZK9xQtoXT1NolX6UJuAmwfBJmlQGY0iY93n6q6hzxXVpM4FQqdQhp5tknqCQBA6mIMqeW3yEtjFLpELEWM%2FgwdAfs6A%2BzOf3JZxp%2BUjI8BHLnwdUKZu6ugdlsYjZNQimd%2FVuT2EXz%2BmY2OAQvtXtjr6rNFzqISEWRS4U35lTjWXdb2XfuP4rUwJvlZtil%2BgafTJNitmhPAaV52OJAJWPZ3eVTZ9%2FysJLB6%2B50ZF3ZklS2OZvDJZ9krLb8q41JKv9t9%2BmH0lrbV%2B5Xr%2F9TSpbrVGBXAlJj7%2FVpLaY8dNuNi9iT5YU84emEJwL7pTDbkX%2F4TRpmGf0mIl7kP1AFtiUXQtdqbwDV9s9%2FvjDNCjjabIpq%2BAFKTV40ASEffOX6EcKb79bBn3VJTLZMPoDAXrmvX1iEp3Tk3trd4TrMpkeHh8RoMuNWprKIXwwAg%2FFJXMJSzFpnhmfXxmYt2GRWit7KZ5kAeRM0VVTPRC%2F3R%2FQJMCAJOZH1IoBI7mHJo9sqgHY%2FVWv3JzM224mczZcGwBfWbnak9UKQDEqexWDJbwGZlEBlMLqa9c8GOqUBGm9kjclZ%2BmbW4UbAT4TqgH5P%2F72n9xVQiwT2x9kj3iEgR4H0iplTrx%2FI2JTLx5EVDkTSzyq5SsWR23Kv92t0LEsInwh7PVAPwZLiIQjhYxqeLW%2Fg4Q2%2FkGcpEP%2F8yha7xQQnsc9X7sgVOzu1zrW7rd%2F3LJiz7HUhZrtLyta%2FUt9gymigbZSAUiM4EMv8yf7mhA2DayKB5K3ofpt%2FwSLwJFjWf4R4&X-Amz-Signature=b85a97b118a4bbc6353b2080c97550faadcf791693b6add997a50950bda7efeb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
