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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46644PD4QE6%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034018Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCfixC%2F1e5Y0zDju4kXZqZtuiPezr4vnrkHHvp5SsdRpQIhAL729%2B3Rwc1Q4Y7h9KL1XOJvcxUfA129xbR5xw6QZielKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwuXOzdl2U2vCKIT7gq3ANYNZWtmYFwOEJp7ElgA72cyhhQ%2B%2FQskTEHYaGB76qoP1W76OUeybQ6mch6yk%2FHZaAb6Cx%2BO5hUxoQT9hkwxhueWAuI3D%2FqmRLK7UxoYWxADQ2e2wEd%2BSTbKaYj2mMlWwO%2FKMu%2BVgo4geYwWCE2%2BkiT5olmRr%2BR3qk3TlFFl%2Fqul3OKe71iaWPxrZ%2FBe5BtpDolLkmnDtFU6BOujopClrU5w4oo5DoHKsqtc4TV7CAPXvJTPOohS3LLrXR%2F1DFjzZ2GHnGj80uqOlOBon%2BnzQDqe0iHd0y0HGng9tkzAo4ZvfVvIkyd81Kr9z9YnDMfbey%2BpVBVosEZTRZSC8D4Nua66I7HzgGnqhwugNm50Pj%2FqbWbQOetH1BfpY0S7ZWCvViHeDH7JXKBFYCdwdQdG15WUX2VIZB6i0JXcHpKx5606uFbZcclzMqPjSG6BYlxP4uTUC1hnyMLY3XaJmw57dI3sdkxrk45qz29OU61DkvScgvxwz8sszlMTyL2bv3wOX%2FFq0Frlo5T20ZU51GHErpFvALpP3KU0%2FfUc4aFBMUsuhSQTwI%2BTr8TbkYJOVZN8F%2BtP6y%2BzxxN8Ken9AEbkww94UrO8lV4FRjffxYQc6d8oxeibp01cdDxx6EEjDCD4PbOBjqkASCNXM2vn4NPz%2FQoM7Xc776tOnCq7h9NHGnQaAg65mvR6AcwtbbbD7aRuLPRUkPUWBuQP2LjKaCxvP6M0Sr5ldLYS6WIrwLCOXbPms6h08a111Uz1K8hP1r5yulbTx8C91RZqmVf8UjBajFuKouaWF9Ogfl%2BrcoYP%2FNd2VhllYO0wRW9%2B6QUSIv9PUwi%2F3hQuCwNbFkYZqODb%2BpSATuOEtBD44tD&X-Amz-Signature=8d72b5dc5aa56b64236e527d5b412786391f15b9726ab2f2e8e1c8f92da18c17&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R7WGO3YI%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034019Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDvFszNcYMYH9EZyXHGG1bjwF%2Bwrtxz9JYfuW4a13lZWwIgHZ59mezd0Kg5AHDCmAsUMOJBSToZm1Wv88lkQFg70VoqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMbStV35h%2BBioM4lCyrcA%2Fba2b4MaEge5f7vyQMENxoWyHmYBYLzAkplDxDxT5Q8wbBi681rgtKA%2Bi4gUh2wF0E%2FTnfouwlj7ffDOJXNS3YHEY69kVNXzYllchOmQlFWJjB6k42lmq8Im5jFjEtbXYQuFr%2BKH%2BgtWOqd4IkabCYGtwZMducm2cegqwltrabzTCBlfl8KaNHK%2B1SrZc1q5XAl2jeaVLC3wsB8eA%2B2qE1fyAaxcdrr2NyqojazHZCkwYAFjHudNm4HizFvAXE2jqb2i3uhA1Mgd%2FHJ5jY%2FHq7xX2EyVkv1RCGJC7SFAuyIfbdb9XGI75xT8SAuFAimE4BLkyIv7b4MUebhqZrOPPUYamEAKDEx4HLXuEcSxDBCAmAyle4U6R5Z%2FJ7dvhC62AIVI8wQiUg9TF8WrWNpqrNshMp%2BlJR5poj5beZXwvSDrJD%2F5dsKMLeWajQ2bNJjKthx7HASJ4mG9sVO8Nym%2BS%2BROE0ihli52nbra%2BMXa2M1j0RnOIx%2F4GQFnpp5s%2FNylR4yztDr2Q4CD%2FwTdJvHUw8P99k3DVKRfE0OgIwEClOwgba9mnqcCfo23xKJgc2WK0It8ctMYfXRG6xgwpG8aa9SjElwEpPcMT6jGBS0cmde01yBl6UqbYGXu02kMNjf9s4GOqUBLv0uuQTuzDsckLci1inpDbZo7nBX%2BPEBqtKbrh3nAMLTEN%2B5qcBkq3mrG%2BV9My%2BifsLgPTovz2bnTe6MQ61pmk%2FBEaeaRc%2FysNHtzHWPUBsQzv9fEx2Mxkaj6XhlOR6wp0m5P%2FBJL7An6NXviuiJqHN0HtmLHbIzrpRSffD9nrir539iI9Sw4FTLWcmTV3G7M%2BxrFGNjy7XZS7Pcq%2Fwk5zwOo9nU&X-Amz-Signature=2aea47c69341e9c057fad0a1123ca89becaa18d55f4830c35395b09604f657bc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666KDU6REF%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDt0MS8aCCi4MTqub2Guf6Kf7aWO6YSF2BotjLt7LygbwIgZlr8B4cSInOk2YgJfPWD2pdSYfqm%2B3te6Cn%2BoQYnm7UqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKXD%2BGQC9lHWnnJ%2FByrcAwnWSt3ncINZGkykRoUQwpoic7RyQzom1VhHqi4PQgTxQJqg93bItlRR8TAFXgIMcH0dGF6UVZOnLACl5snYMm6xLuKoOM2XUYnjAXymKQxpqYh8IBKg7ndq3GPaNJyowt%2FXXRe%2BZ2hD6PsmsaIFOLWpCB4KO0MKiORYT38E%2FJDwymErT4EeIAsf5jxNMmgBb989jAqczSCXuf2zvwU5Ek7twrsJ2wWlglsqfPpEyOn%2BHdWZ7BFKRICAjCY4TxyB%2By3mCuJwZZ0KzvkeLsG8tIPlbyS0gZvcClJ%2FrFBLNsIfqBp0K4DTOUKebWHMYbuf9FBcXY42su775SHodVzdivRdbG7RMFTW3wp9c9VN0zDBCWVOurJytXtEwJwoiSmtt62Az%2Bzk9nGRxmdDPeyGoKwXjKDbuXXAxdsn1%2B%2FXSNjmEhbLsVRHoq4fvjlqe%2F2v8%2BXi0h8f2Qyk1g43fQchvISl3qA%2BbqOrlpxeWpo97p0X%2B3H6r2DXmmKrqhMhcKwXSwytQKOtdr3PpqOUgTpUq4UaRTBkGakTcPSCmYnQxqeN1Ob1k%2F69VsskZhrB38gvxxdAHiOgqDSHIksD2bHnEM5aOwEsY2lVbqeByKWTRNhlMe1D4bMfcLZwcNHWMLng9s4GOqUB9BVTx7d71yzESMuKvxp3qcu5jIYv9Wqi7zSYjfSz%2BLrNlOZFO5byt0ncxebwBeY3HABmVL5WNPf8DtkciY3XSpfgMNdTTjDZbBp1QAtm7YgS5MrW98iHukmmBiDwHOb8n9FWF6cED4zt81irnYnjVSqf1xJvJ5wUtuSwlhw%2FXQsajNzHgTugfpE1YViniMVWYYDN4xTNIOEp%2BOBWkMpiXiPi5xeK&X-Amz-Signature=0d98cde6b05f7dcfb3907b08d47a105a5fc7bf36da42152b2242c0544bdaff48&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664SXCFI66%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034024Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHft3ggNzBsJ%2FX7hVXDEInrFMBTfQcOkLNzZUkDjMnCWAiAKEgaGj5f3dOwx3gCjtVDfapKtzpGT6CBeAXYWNnpWDyqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM%2BJWHNdP2ZmWegx7JKtwD2C7ZmonnRc%2BM%2BpfIYP5KGq8Lp8FopqknnOlUvdNCU7vIkXwCFw%2BnaifcPpqesHpruZ9mTsI3YkUUSSYtt3%2FTTe455Wr1Hn8MKSnu%2BFp257QWsnngaEdSFVpNLXxbV5V6Ez8WNn2WO4ODkrbRZwZPTbprTijVlI5hcYPZy8PTMbBIRSqKEDxFNDg%2FCsLT32EVwcszxhxkQtrdu3BVHvdbNrw67s7qWhlN9sdtD7itIN3zCRmFM6Qi4NvoOaYTi2WG7HUJaK8gLzkfShIcxeVcHUGfp%2FCofTffCOcGf3Gcswye1GeUFgy9CGgRVdPAmQaNt2xd%2FrfpjoknW2C46XkcPUX1svg4opOcNSSdcWnRCvgI1owpwldFpVFveqUhle7sGhIVdsGzh7yi7n56kjfq5kRT9UmSnw5iLUp0MgLmOd55cl0nrayzf83m88ofm3SzmooSuwpGKIsd3eUYYwEa5dgBZybwUcISmuHUnfCoNKvUP%2FDl18cQ7x%2F6Kx52%2FSrVnsn7ocwVePqtjajHujnkYnjQ2vlKbYG3SA5GKyVjfB%2BlUF3fTOG5ue092pc8%2BWvmPVRgLK85ehK%2FTzZrma63%2BqOpueaLGbnnPOJjKYwcpNk3Oar9HETmY%2FH79XUwzOD2zgY6pgGNTuC3CFuXz%2Ft17Qu8eguiSs5BTzCpG2n%2FBKoSNYojIL5HjcKpjdZBqcuaJhVIMPPXnDcWHSjBl4NfzllkEqM8DDVffCLg60TC6XH%2B23rAnUPuPGGDse5Xfk%2BjX5BQTIsEMWAXY0a3D9o3%2By0DtUqq%2BuJJBa4ZF4bsK%2FrSsEb%2B98lT5BSHMa0mUtrTiCKiAkJJg1RbRfwrWYRI7O3c0h2%2BbPuU3MZf&X-Amz-Signature=127a89207edc4f58c5a4e64045521778bf7448df24df89e7176db91bb34658aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46653QTQ556%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034026Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICGxT11%2F3ByiAvCou3XVwnm2jxvdkbtGnKA8KiaV63aHAiBcoKEOfoluYsopePE58oxhImfTGaGvPOnV72oKOuivmSqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMCeujIqb%2Bmmwow7IJKtwD%2BNRzX26kTZm63qirumTsSjf4lCOZmB99ewUEGadcPb1TZoLR5REajck6XxXYrv5r8WW48H2gxKllMBxPcgO6V1Nn5pxq6U%2FSIe7F%2B2jDDgwEufn%2Bb%2FKbB1fGp5a6m4CLZN%2FUHtnDyulIG%2FCwjHI0QuGF1OqoZ5UVEB6CU%2FwE2dQ8PsXOwntugm5Nt8L%2FcwdWWd7Ui%2Fgw8Ov5QFqBbihjxfFuCrIab3OMN09EqQL0bYffrcG61erOeTfT6RDaNigENTa8HzIqSaG6aHXEJvhKfLtdF0Vng0oAlSYQqn5DRk2PRx4ba5mGyYvIEf9WgJpR3cXSkILMQZxtb7JDMeSFG7f2EZo6z9D729Kw6Uff9fG5uBWkNuu0R43qilgI%2FsiDGpU2yYcHpYfnUTx4m3Ijlugu3Pd3yusT7yh%2BErqDwpjSvWZfL%2FHoS0xX67nX%2Bd46%2BLCZUUXiovNBo2oOp%2FEIEhd%2Ftw5qkur9aW2YQRvRwne1SA6fHcKwYNn0VV6MP0v10tqPwmwqeNqdN%2BprHOxsCIZMP27AVK1Xn27b42nXQTx4g4ddBCTDJOy1kEaP82qq8lapyF%2BfCUoKEBLxUM9hczoU4H9pyi%2BnGWnKpwRbdf7FLkyQ7DyNUQ0MhqYw0uD2zgY6pgFn5nbK%2FL81dvANgfqxYSde8x5AeDA5jQ0axNdoV3MLKeimrfcdzL5krhwfEgOyz5%2BTQBlkfFYYGifTAFSyWhUKz%2Fd5%2FzUg%2FR%2BwGBlZub6L5iDq44YfRrjHYDonojnW6U464Qnw1U2I0Xatu0t3pqZ9%2FwtjBfwncpbECiPAUs27JU0s9lT6q4km1VfxnLtRFk9icZin9p0%2Fl5atyA6XKA9RIbvZ5Mv2&X-Amz-Signature=c5f41f9bc6159ff40409d0258a35e33e4fdfe358a02db67e32b8b621b1a7b0f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VZW5TJ2Y%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034026Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCXRJTLPPPrpVzb7St778CRhHu%2FykQR2QMjSnJrjkRQaAIhAN20t9DPF13eZRBMEE2kM8xD%2FKjkojVbZlxfzJZhmNq%2BKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwqQ0j1%2BQQqBczS2%2F0q3AM0KaYLMZCxAdDexg46nN6ROzlNA1rYEqrtLXsxDN3E4oerzfHVUBwW7%2BOqXi8DuQ2gOggMOy6qFzKmwWeHSOz5c1Dn1PpQEcd%2FpSQvm97wX82GGHqHex9mf71x7%2BhjOlO1mSpIAdb8sNNnfzm2pYDy83DeKhWleR2x7sYqIL18ekbhFAJfXu4pmIARN3YiVw2EAyjDvO2fkQecjVIeXxgJEztWWg%2BeCWrFuE8Hfi1nBxvC3NjN8z8dAs1eLYNZj2fxZMbHCFlMyKdXZW8f99nwh%2Brnf%2F0KGrg8Clxk5HaRbAml11YH3ADSYWU2d7oSBVWr0eM9TSVOttC78V8uWxlxNcIzEo%2Ft2evcKg0kYqCtBn12Ll3E1X2EKnOkhIka7kJxZ%2B1ubZYxWNqYjJNfIZk%2FvWh3KkDKOI1qQGg1mwjRkzOEyFBhZEzmpyaiCtEPZDWszt74trpwE%2FxEzNl0lQXroAsNGsYxgsfYvaVTT4ZsA9Hwpqmai9X18cPLkb9lqpi6X6HtKorMiO10WUci4n3iGv9wQmB6qNv%2BScFdXD2%2FUH0xlLnhAzyAAUkcuC5DHKjFiEbm2rNgaIMArwZvargGFpbH2zVjdydixDg5ehL2115xESyF7DM2IjJ4UTD33fbOBjqkAU6K2fvEah74vgmwrlFki6lXcgyZmBNiNaSYWs%2F8JTjwuDhZJuEKkEzbnKJsurCITJBkMRycLqM4Upu%2F9ZrulgruNdOfxpcL0FPG%2FB6EVT8FpE30nghBq80%2F03dXbHkynzfxmpwNtiHo7JMhzmX3srwL8pRz%2B2WQpNQ1pWTPOiZnR5aaP%2FzH5Vh5SQ%2FGZE4H4koaD2CpUBfu4enx%2FDczAN%2BqWiIO&X-Amz-Signature=b804fac185f9cd577f47b0a018c35b3e44393a587ad2db689ae0723af64a7d9a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665JK5NQRM%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034027Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC6ETj2Fpnqally3EcojzbtlXYTd31Fvnyk26Nrqwpp2AiEAgH4LUrPo7dVP2L2yg%2FIBT3GSv7Ekr65BImwMlzt18TAqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMavKG%2BPgCw8ErpG0ircA4UvaLJd9YyMP1GvrPbBGZkAirdw4t7I8wcNa8X2Y1c5PGee9JNi8f4bKXXPly1K5f0%2BivhgjlGpJ4qPaTCqVNf8lYV%2B7PXszE2M5oQNZxTFANsw7rcFvFByDpQ0qY1X7S44o8Gw5uxRJJm14PBatB2Y%2FA1fKE3U%2F0N0rWvuu%2BZWAfMyFybCJb8LxHjO0V%2Fm%2B4gN%2BVnjWx%2BO6cxFexMzR1F3I29BX184nhcTe19xeMXZQtuW5fyDaJQu1GcA%2FCWp59jcq%2FiBDFlgqXRAJoHxQvy2lSetpXoALJOWspy5yqYSIswkJU6AGfhFmGP329f51sEXF762LYHULPXfHOtkS6G1EIHlib6MA3aZnxXi%2Fn%2F1a%2B1gIqnwfwA4rUlt8ip4qPLkXOnbMrafXLtdjDtuq%2BTgksaX15c96w%2BDqp%2F%2BuvcwE8VsB0mrhZvb6q2HHMWzbOfwOZZOZ1nGyGMUanqO%2BPYLSBdo58EjXc65MlN47Zuu8UMzKR3hH7dScTy%2FqGm4jFJs6Cg80bdWuhLITX9CCdaP4S%2B3jWlXg9%2BbR9vOTfUlsRAF1sYqQO0KeXHlF%2FUQ7iStTgMY1rAxcI68rTO4b3X2P0qABS8B6pgoD2Va3bNOW1s1KYMif12XQJD7MKbg9s4GOqUBrDrO7heNeRnjm%2BZEybBEv91r8F0EUygV%2F7SfpGw6xYFFAoG1Tg20zbwEHVNJn1%2BXcG2VD3BLjl8UoA4ygB7BhtzDYvvOdqUbsX1zHSehMH%2FZQCF0JutrhoRZTn%2Ft20%2FvS8SckdwGfX%2Fiu3qXhRRPxmfzbEHsnUCSmgZEb7t0I%2FE8vRt3DSpcim6kXaLAWXFRF9GdyMSa1lf3VWOxN6fa3FZHRcC5&X-Amz-Signature=c385ad0b82cb4cfbaf281678570e4dabc562bb3d320f07b174335b5ee70624be&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664EXFSLYM%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034027Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDGUvTnooijvgN7JZxju7xAxQPtCbALuAbT6QsEFh1c9wIhAMyuSRSmhMMbu%2BH2EKlAWC1iY62q89LBvT1I7rxLV6CLKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igyqvd0A%2B72uLvgXa8cq3APznvpJmMOKe1aKN2wdCEJkFarvtJasN2kyD3CBVx5mKdByyPrpkf5Fwhs3FTtYzazSTWEKtZ30Yt9mwnavxhxruHSE0LbQpn4C9W2tnpCUQfcxJghML2RsSOmVdUsA%2FfdutBISBVgOPGJHdd0kNuyQeSeNkaqdDNopPEeNXuVSxmE3Ab9UcLkON77gI9yZbPnT68JqluKF1FIfFJ3MydY09NSKDIa7PekpEEu0JpG9%2BCjC8h%2BoxPL%2F%2F0Uco4I6nu7fCCSRNtFUEqX3TzGDcVzSpBbDIUPkKezm%2BsnibqVCKD22BcrdWWrxKV6Tb%2FWFe3XToxDfwnc%2F3pWdHJgngwNEUtBTY6PFmzQldbyRCzni6LWJfKmYIN4CesYrlTf%2Fmgbt4kax4s20iVqI%2Bym8MhQhe3b9TPNYM2Oy08aHgdv5vAgkk4G91hjzAhKrUbE0twfT%2B865Qbbtenvm2YlUHvi6tVLSw8ZjplwvwZbaTfScp4NmmsT30EpEbGv5YOCZX4JL2QLC2y5sIbX2R20C2Oi657zuwuSPcZLGkmbe8Vf0WYjGeEnPcQpgj8x%2F99PyfpcfoO1JxTkyXH9P44H%2BMwEDqHE0M9u8%2Bribg8yHKkuKO1NmzFd8mQtv2GLJsjDY3%2FbOBjqkAUbPtbmh5A9MBgHypcahOg6Oqdb7D4websdxOKp4YYmEsApvJtwnk0SzyGc2DDn2ZkzACl1YVdFthR43MZOPmPMEdI4Mk7%2Bkry%2FpxXCj23062t2UZVt3zC5Z1RCA4Zf3ed87uUVCSA%2FMh3dHfEDqwzBZTXg1lbmVZN1RDfk18mH7atDopMRyO6KBG5sAUGYMBjpJzvdvHHZGRSgc07sbpZ0KssxP&X-Amz-Signature=34e10d5c24fdf9aae49e16a6f7674ff357de246a101148af74f1ec8938eeb199&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662M2CRVVF%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034027Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD7GmP%2FuQryTvC8EKuJCGN9fjG3oXfc4xkchZWMYmQ5eQIgGcEy6A%2FaMZF0PH5uucb9cgSTMHpOPS8ghKSLr1ed9AkqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIywQouZQa3TzxrY%2FircA0m0SbAc2EP8dP9XhkAqtzMLZ4lZsgsgW7sa337R8u0dAufZw3lJuAFG7gSTIKsKwNx6suR%2FY1dib4pdyGV4ArlBWrvba8ve%2FC8TaI7rQItOAmbNuZxFlGfltxf2s2tEoXFKugt2jclZFzymW3krJ%2BNWrF7561s%2FreeLBE1209QDLz9WGa7rzE5pw%2Fgl0cSdgma3UH8NSSap73ycvBMer5JCqAEkzMskyxE1kyCxUYqfm7W8Bb3TFe1m%2B3zieC%2BrBfTzKPzYRD%2BEwjiZ5O3%2BvBDCnJWyljcET83lK75lTDPpEU8vUZrk%2BrCkY8p9oVSd%2BRAZ3dOpcBf1EkOIadvCQZFYyGNzNU6twMPMIap6EA9VMBAsoFC1%2FK3nNESVZJsRCi2I9aIcGj5osJrNWTZypNyLoIHABMF%2BqpMYfVu7k5A5hX4l0ukqipJFGqbjprraBSdCo%2BsmLNLdEBa6anwq7SOX5ZAA%2FEzerdERt21P3UlVYxtBu9KBA2%2BUJjf0w46lsImK67cgyF67B0FNgFtJkykRHDGu1%2FzsVpB%2BL%2BVKVHVXZuNCBeNtDgkdc4%2FVnQy0SyVv9z%2Bl%2FLzjhEb08nJbX%2F%2FH%2BXLR%2FrocyhJTXuk%2B7SHC2NCL74JOrCEeTRmWML3h9s4GOqUBCL19PUroiEpW2R90rqXeCYfKYriqtAmC6T3tFx7band9HVO4US1Lp4N81o94V7awjyKU4Wqm%2Bh88DPxZBOspc65a%2FSrAQX778n28M2yd9UTIxJkKe3%2BJ6%2FDCehlU4zRtpt%2FNB4EelMLnMrpxbceqPT80myWnOgV2clFoBaHeXkJQX5mYxfgEW2y5mOtzUcibHyvyQEKDj1NeNepU8TRLfkzEEayK&X-Amz-Signature=07025b5862067e65d81cc81fbd19f7bcb88a807b3314286fb72e9de16d8c96af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QSMEOFYN%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034028Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCqR8ZW8VzH3GZs2W%2BDjHIC8xD9GjRBq0wyt8PRAnVIAQIgJ5gwfUF8HROYTb0LV1gjvoEwvrGY0ddt5XIcYCkLE10qiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNpraVN0k10P4FzjSircAwWrnD%2BLRP2TC80EBx1v%2F3mBTvfwtMC5hjFiv1NWQWDF1Z80ce14da6rJC1QugYk6FaUADcc3Pn6DWNFr7aREr7ky19coBJ88T3Ri88fzZJuFA6nNOBqW5N%2B2ryCJqTdczsrHQWAEj1mQCiemLUoBNftDsKskKOQFzexSFDKVL4wGGdoIBMZ1%2Bc%2FZxnueK10%2BzXZDZfQLgppdYDrUdaVxSaP6YzOgrPkQx5nujbK7rfIsUpGnJjtOFWhklR%2BZ0Yof7UBiSMuLiYHEYQNdwu%2BF%2FztPatf5yk975OOqbMtZ65xAHoN9LqYXvzV9ZyIRP66vTEPgGSQRnNQE3ZgoLx%2FCc2V1y5UD0EFZbVHnktCkhtOi%2B90W7eARDfH8%2BUxjoIS%2B80I9nTBLEVRd6OHoHvslYH%2Bx5MJYfRNOC%2FrVvBZ9hWGWSa1RkJh4vCLIPttsBDbc4jcTYb8ZN4BHIx6ohvR0R%2F8wIn%2F0Wm02rEy1%2Fz%2FPY3kB3cBRN693m4Yvg1hm19aqUwQrNTvdRgKXFK1FvinSE0G%2FRPz%2BFlCSja93%2FdT9Xr%2BHPbbnJDvogv3MwYCLtjNyYMtCRAQyFM35ZEP4MfmKQxJSMT5Rlly7U8nA0Tjmx6jPNGNt2BN9m1vem8aMNrg9s4GOqUBALL8ZjZfX8vXV5QQGrAj3jNCt%2FbEiSH51OWU4I1LMJZflcwSCa1H60IlUBVXMX45H3MFS%2FWf5mX84xGjTRXNvAPtjKeImkzS3%2BxuSElAxUqIjQh0VZccwSc9NzFJtwhJMuULzjnVqg5IrjrnFUA9ZffGEKSrUFnb9h1Lk46axwcX7SIIVZx1LgJJ%2BhFlYcgz1wx16PWKdjRtUqOS9fj8nQLFTMmy&X-Amz-Signature=695164adbd80977d1d5d0b9ab48eb6cf89dc04f312d74c22aa8abe64691d1ea3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TPC5HU6J%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034030Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDS%2BTJ%2BvyUf8I0Bvx6GO5LkDjQkH8HkcIB65O%2B2P2lxYwIgXnY3fHz86aG9HZseUcimC3pvm2VlrZOri1eYOlt3P3UqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAlVnVBoICrD6vjVbSrcA6Q8u%2FVoU6r%2F5AS4Em9uSdsL1AgBr5khv3cr9x%2BWimiunS3epFCIWF%2FDsoSTdVSxQ1jJ7EH60CClrKas2S%2Fqt%2F9SzFGuC%2FxCGIghB%2B3fFC%2FT6IWsTY2TzZwsXJuOhJI0ns%2BCeF6wj8ambjbUmf%2F6srYFRFNmvNWxiCSoUOPlCh341PczpZZrjamdYQmD7dFLE0O15xHQdR64r26tJn7ppwvMoYNvdc6CiuvN5vaHYoYErEo51NUPz12mFPnD%2FZbaLYpED8jNHNdqj548eIqhh2OqC9pH1TgRGUpFMVLjUMpABphphzRaYqogGcDPcykg%2Bc2Pt%2BF3jAKTNxEEZK9nm9ot1T4xov08GvByjPfCOirFq8ApigejM6aOsHrJtE9XQ%2Fk9%2BGXXvJjtZeeNhM%2BBQ1rFmrUb70xDULAqcOAA2ptYDgCrxoB6G815GapOg6%2FUazgG4C9H4ykaLyIbtJf8GgH8fPY6KxNi1eSo6B%2Be0UULjbeTJFAF2qsBU9q8mSv6%2B2M89zgseV01ETLeUbxxZTTnGOUZGeIbivL8umKJ5YGXBHVNRQWBNJ3a0WSfMszl3jLKjHBbS7zmFOoaHlNXjF%2FawWnUj%2FQXJK%2F%2BJDcNH5O8%2BSRsc13UBT4NJ%2FI7MJng9s4GOqUBIh85SYRw3a9jAe%2BDnQDe2x1pOdcN0hjGk8zGWUozqvz1Isr4EZGeRQ7kkKeoIfPa%2BATmHt2up3760sE3mLdVvJUZDxm9Dfu07Z8ZZUGWb%2BlYEXAdnvPykUzx9GlsELD3YI60ax521ut5k2hvp%2FTKG1jsQup6FtxTwNyd3lrgGU2Se8oK11bb4AXlaIRTgJokNac7C8mz4LQXv0Oz8hKY4tnDvd2G&X-Amz-Signature=980600aa80e6939ba01e177e14d7f76cfc9dc4063f2b75c51ad4757da9bee963&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663JJ2YZTM%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034031Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHBjzkIM0DJERSfjbr9VvgUR0wWSPN8%2F4mam%2Bm7o%2B%2FVAAiBcZy8H25vXfZGzGgTo8ypyKCH7AS5sVuKNN%2FGfui9yZSqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMHvZWPb9LvTXHZ%2F5FKtwDFkvXF5CzecgQ9fAxyCVFdlPp5NCKwoiT4YM7r909Q%2BZD7Mgs9Y%2B2Fl%2FNVTXJYtNJKq476iqkTdAZnwup09dDGYD16nBBQj%2Fdi494QjUDtlKEHRKrBrfsAbwHFHF9Ez%2Bz6ygMRfUwMa9cPQiXBzvJ2GXwFJvZsqV4n1X3RZXgTEJP42gbW7g3WWozkYguGEQVC%2BF6FHzN5fL%2FuOCDcaVTICWRcjc%2BMRa0kdY9XrXmTBBGzkmvos3DYLHk1jtDEJcJpcGmL6%2FVeFwdmeNdpb6Ja3yK067DeLv%2BTOVDsGXLWnemOtrZD5efoDAVa6D9AAHAsdOt1nwUNNOmW0%2FJHbLeJDcA724QLOc7zasejp1BlxcodlGuHtXZme6VqE%2FBsOQxYRAL89IyxwejuHs44YpKaZpOGgA7g51fMHGraNxb951yfym7K8eilqPxqyqe96FVnnc0FuARMpDFSBFX4xXRjYGxn9jrbGU8hjTpuhIntlHT8kayXUCY8VoOWfAQNSdBjTWw8f48pOx%2F4qN2RfH9FMSZijdngpq37Xx9PODcubGEn9HkFeGwMnLxhD9B%2BvCJ3OmrIZYLm9Qyr2f1MknY3pY3OHoQhinfHSsSNWtP1qfIxG9l539nv1Z9TSEwk972zgY6pgGLWFisuNKDqGFleygwuzipSPCGZMbSm4dsaYv3vTAJmSBkJ%2Bau7QzY123P9tIk2OttLQtW9IOOYExmig5bmgrZEiMpKQoPbxnojZR%2BHACB%2B0BnYfWR9SGVx4GjYp%2BUwk9XibrsQorin8%2FYDM7jQHThn9R2TnKAp%2BJxHRHP%2BpXzb24eGHhGsOn%2BmrFUisK4kkP0WFSXIWNYibtzqKT98zJCrGDiXVTe&X-Amz-Signature=d8ec1e83cbf47e4b97a69154c99ede798513f3e94ed51a083e8287c2b280d45d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UAO3P6DL%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034031Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEp3eePwtNMiPX1LDQXG6doF94OsbQv7R0Txmrqm7hcRAiEAmt2eEXCW0EwZl3GcxgSB4mgsOMdcTej%2Fl3HXCnRhgTIqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNFEzpv3vcGdSaz60SrcAwW3KBgdKHqHn5uOsX1m6MyJz8nP2Ex4vvHEiekC%2BCjnmyFlf4a0dAbSZgNmS%2FDKBhXrGyGULmh%2FVKINUaQfTIMAtg%2FCQzSiK4LBxd8Z754iLNu%2FRpLTXNg%2BCPKaBHxbGNr9na3Y3%2FIchB5ZG4k%2BXCs2BeFhjoDfUa2N4NZ2fs%2BfiFcqg2Yq6mKBhhQbw6u%2B350Tf1IyjtIob78QwLZvl%2BolGbKv%2Fc0UeK4p%2BykAEn8Guh52BD5VjUKsr13CcUHnpqd%2BtBQYnnC8JhoYa11jYVfLW5pPogNehI%2FZjZ%2FrQs0nPMHfsnrnTaIGbroi4aKrH75Av5f%2Bp%2BmFCKlfhGcrE15BUL3KSHV8RoJampBxSSk9jfy9LvvcfcPnHV%2BBye8NIFCEBJLk2vqxyjmzQQU5GgXkqRe4rG7O6%2FhM4kQnhJ5HwRDzVnt%2BKG2t80mBZ5pEQ5oFOCjS%2B1P5eBOSbpGATweBFC31BMs9TbHYTVeE1l2M2Aub71RLO0HE2W%2FhgmY32KpFNW2kVZCgtJtD0o4tbNVBEcJKPhJiE%2BL64NbzPtIzLzxCpBoLyW5u%2FGXNJAWaFlxZa8PrvSDuWeqGUaCNBDIpIx7insbPf4TdPoZsZsFjLAraHo4oXZq5fSIpMILf9s4GOqUBWEBotiBAmi0eo%2BkLKF%2BEcwMq9iTn5%2BOYnMeNtApeWx7qZI589n25jE4Wqs9xu%2FemcXVEn28YiONddu3aOEE2qfKM9eE%2BbrP8XIV7GGJm6n1FEkuM6t3c4qxGLgNMZPi2KhysUh0EfoY16AlTdltkPviCIgimrycvKhvvj%2B0DafNyUyByshhVMmtwRUycCMHMsVYJjVVmTCxizUQ66gzKR2UE%2Bw4p&X-Amz-Signature=03981f616608cf13d6a5c00127e08b69f78f1d21fc965a892872a1f35802be76&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UAO3P6DL%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034031Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEp3eePwtNMiPX1LDQXG6doF94OsbQv7R0Txmrqm7hcRAiEAmt2eEXCW0EwZl3GcxgSB4mgsOMdcTej%2Fl3HXCnRhgTIqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNFEzpv3vcGdSaz60SrcAwW3KBgdKHqHn5uOsX1m6MyJz8nP2Ex4vvHEiekC%2BCjnmyFlf4a0dAbSZgNmS%2FDKBhXrGyGULmh%2FVKINUaQfTIMAtg%2FCQzSiK4LBxd8Z754iLNu%2FRpLTXNg%2BCPKaBHxbGNr9na3Y3%2FIchB5ZG4k%2BXCs2BeFhjoDfUa2N4NZ2fs%2BfiFcqg2Yq6mKBhhQbw6u%2B350Tf1IyjtIob78QwLZvl%2BolGbKv%2Fc0UeK4p%2BykAEn8Guh52BD5VjUKsr13CcUHnpqd%2BtBQYnnC8JhoYa11jYVfLW5pPogNehI%2FZjZ%2FrQs0nPMHfsnrnTaIGbroi4aKrH75Av5f%2Bp%2BmFCKlfhGcrE15BUL3KSHV8RoJampBxSSk9jfy9LvvcfcPnHV%2BBye8NIFCEBJLk2vqxyjmzQQU5GgXkqRe4rG7O6%2FhM4kQnhJ5HwRDzVnt%2BKG2t80mBZ5pEQ5oFOCjS%2B1P5eBOSbpGATweBFC31BMs9TbHYTVeE1l2M2Aub71RLO0HE2W%2FhgmY32KpFNW2kVZCgtJtD0o4tbNVBEcJKPhJiE%2BL64NbzPtIzLzxCpBoLyW5u%2FGXNJAWaFlxZa8PrvSDuWeqGUaCNBDIpIx7insbPf4TdPoZsZsFjLAraHo4oXZq5fSIpMILf9s4GOqUBWEBotiBAmi0eo%2BkLKF%2BEcwMq9iTn5%2BOYnMeNtApeWx7qZI589n25jE4Wqs9xu%2FemcXVEn28YiONddu3aOEE2qfKM9eE%2BbrP8XIV7GGJm6n1FEkuM6t3c4qxGLgNMZPi2KhysUh0EfoY16AlTdltkPviCIgimrycvKhvvj%2B0DafNyUyByshhVMmtwRUycCMHMsVYJjVVmTCxizUQ66gzKR2UE%2Bw4p&X-Amz-Signature=bbb687f3b044d7755b502e34c8c86bb3c678f210127cf45ca0714262b3f384ac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
