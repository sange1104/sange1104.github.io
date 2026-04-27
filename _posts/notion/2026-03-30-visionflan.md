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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W7XKUTWX%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T035848Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGzH%2F4Sew3bUIh1U0RYMowkfahNwpj7ks%2ByMl%2F3%2BxhNrAiEAkzAGOpTnvJoEFQWP4GL5ICkO5UTigsJul9%2F%2BV%2FQTH%2BUqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDP5kCFiGzJfrt6RAyyrcA%2B%2Bmlg%2BOVn13drcX%2Fl4R81yCammwwfVp34GPNITrHhQnIqn63Tw8dAGt%2F3U74JMnJ7Va7wWb39tU7pzE%2BnIzD4BFb1YzkCEnDVj5k9QtenbHsO2Q%2BUECv2HT40gWYikCT2RqFS%2B5YIGCAvZPWtQb0JR11Fxim%2FkmkGKvjU1obrOvj2NnG4Gh3WqeDZ%2FuJ079WEgplIoyQo4Z70SmQEXJZnN%2F5s1vQeWk4qBXZEUJx7DsK3QLtJA%2BBxi3zyKlWV2zpQzqkWVg8V7JsK1AADzkE%2BweoZEQgrPeUTgyb%2BNEQTXllAxF370gpHn2NcXz84wdMa9wvp51CS8ekaqeClkT61i%2FZ1Ner5072e06XeX1gFdUMqhtu6hRlp0mUxDsbavTHV1qSu9aXptQGETpkw7lRDGJZUO8pyO3F1oDrByEqOaslHCIWHWyE9AKHaLfAeZG0moBT0M3uubYHOmrtKkTJVwz2yK0633FB5OI1QmSVeCRUeA%2FUJVZx0PqsikITsZSZrQ35w2m%2FryZwuN%2FfRDLqUWlP1u0xXHpoxAgY%2BifUMbGu2Ex4KxzdIFJDd5DHURdSJJN6YeAPBai72ozcildj82NXjZCQp%2BxiSKjvqcIRsZM3yz663%2F8Y4uLzl5aMNi0u88GOqUBHKgwpT9E93hofdjOjyDx8imWn5AfwbL0NJMcbjzGNYAq35RboiZQGs4Kc65%2FvYWvq6vVZwliKJseHba%2Bp3U5Yo%2BHcgz95qUj5WInwi1MGFns%2FgTXBB6TwBQ47TM5K2TNQttg%2FAid1CTDM0AUxYYU0uHNpHHrFcHVYB46ue5fO0CeVCddIFPEt61h4F8taqkCtIgvE9KxiWiJVdTpCTKbQKhrWfy2&X-Amz-Signature=4124c0d87c1b174fd753b167cbf56d396a7ba347f0ff2722081fd7662342095a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XNO5VUY3%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T035849Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCSPDnyURenwie31lbS7OII9wWnzAc3UoxU46Y3bUBAygIgTrFC3vMqsIZ0BHy0Ijg%2B4Pr%2FyzcKmN4xYkOn12RFj4wqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNhdM7i7wTztGX67yCrcA%2BNCe57TBo5AzUfUCA6U2kDTifECkB2quyzedEitsPP%2FHJVFsWr2DwxGEvEsecPKGiSAZUSgk7JoySbsrwOn4FaL%2F3b00HOyB%2B1zgLBjHPXOUwg4LwZY7fMnOBoVjjl9JHLM1%2BEnl%2FplvdarABzDDtOVDhLTW971i0%2Fx3K4PuWFR7s0kuXnrvORm2SuzfE474cJ3i9EfbRJIED0wreT6r8aoOomNiUDY88iTfkze%2B5CEPAWmrW7Uk8ZqNZ0evhCYtJtzOlqF5FpHr%2F%2B4FivNpydewFG3fnpjm%2B20MAWL7dC93ZLGx3pltEe0jfO9FU2tvgdOOXQE4iONGRpFzG5933IWgvOrEMh3stDriFqznC0kXyMnzhcPv8is8uwbFcbTwLGJUGufZS2XWQLhe2F%2BmjV5s3ufuMAodrml4SQLW66YyRMj889EBoScoZOngkr0%2BwYrlyQAIegRWAjIxNfZUoIPos69jatRkNGfqxahPobmEYOyp8ecRASlIYTTKOv6UwNjHjvgomeymXwzjl%2BmYWpmiApFq8IkREz4sgUYiCUChIc3825FezQ2N1yUom2e3iDgo%2Bl1cjyXGL%2Br9GbLk1jFARZVX1NCNA1ph6SNb6j4CanOSs0GLgwBYUMUMNG2u88GOqUBQQKgC7Rc5fdWX06rt7GggcvyuT6PQ1qLvXjcCpCLPfzIx88I9%2FTllWbsGScc%2F%2BSPg0ZipDIBYTDWJGTBI%2B0d4WKXjEkdYoCDzwm0Cp9JK50fMRMn9T21GPuFNK8lh6NxfkXojJBDqLWl83bIJoM%2F8iyZBinlzY6Oc4xjG2OGMYB%2FKkP5f8XZZSGc2jvxHIpwWCuFgax62%2BKScm7Y%2FwnaglFrBPHW&X-Amz-Signature=c62ff164e628ef553b49df5b70d54241aa94d235f48062c723b8021aaefa7dfa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663SM64G5B%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T035841Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD7QoW3ANTo8ZO630xH4gLiyP0mBLjc%2BXVuPe%2BZmooipAIhALycB1i8v0Ld9aCqvaY%2BTu2F1MG6KpdFG2vADTynuWvFKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igyz6VO6kGTNZ%2FZw%2F%2Foq3APcHsceaeMSZN1jHqGubj0cW6XRfSopnrR9oG7R%2BSlVOVk8ue7UnkE0ieEypQm9J90iSGX9SCbzkLAWHy2xKoaOzKT0jE9HmifAU9gLk67zU7aIh5JsnQVmnxjnuWQgG8X5pIrjXT5uARAn80cbytKKHMZgYR3kmII4FCkvFKj4m%2FzsSsKLaqRuGDhQXyxjSybiUrpfItwqNspiG65VV6frD0N90Kh%2FIy6%2FzbWubFlHGlWGpnbpuZv8wjFcQJUSd5qK%2BCmK9ekTqd9WgiPnIwItpvQ0Wmxi6KWQzwea3crQ7M%2F%2BCg71XerUpPceuhdxJe0mCXUv6J1bMAIQjVxTGJGOjZ0WUkoeIjLq1plFX1m7dt1jLTd9ESNFYroTsfEipr76Klby3h2NwKXTvnwS0SuPZWL37MrbEFlzrjzHoelVdyCyB9QCah2%2FFEElsryXyPHC7DKaGVslflutIb3jQBmNgJUIaKhVvhSiAvQl9LBmzAKS0zY8U94SZhIm1vJgbPf9WOiHhUTQby6XjixoAOCLkIqKCytkbcmHoYy00AJmZznmxVwQTJcv6G8jSYAWKpeFQuXZuqj1DmS0hYuptHCW0O3rkVwz3Y5h05XOiVqLwCVJfKDjoxYRwpa6BDCmt7vPBjqkAejon7gDuQI%2F2xwwKCEgZx3QDU9%2F5VWEqAA40RPd0J9HkVoFV1qHEgVh5XBfzwRbeuUF77WIymXSukDuBdj99kQQhHleE5biac8WYmOdBNg3TjeCsyMx6BBd5u60ETwiw0VaEPjbB3ZkEm880zRuU9Y%2B5yZ6QrFh%2FJ2zb1wOX2x%2BvlOCN5D9RQCQmjaZwPGh2Ubh2a5KwdsujF2L8BAW1auHkDuX&X-Amz-Signature=f39b8d473f1d53ca1b2d4c1cc9e9f99404fda2d42704b291e3a0ae056228d941&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466526DXDQ3%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T035859Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCKbCMtagJetdb4euSoBvYrdjEp%2B4oG825zoAhzRsYFawIhAPy6tAHKLlp87xryJyb7ZOoSsov3sCy49CH4P6m3p3vYKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igzgbfzmu1Ii3%2B%2BOLwIq3AOrKMj2LKeF%2B4NS4Z9iuTfG4qoFSkGkZqsOLE94n5yNAzP%2Fk%2BDAnmLj0XXkeQYzc6R8l8wYzy8pmoU8O2E0Yz%2FkvYuwqgwx9OewLoWNlBOblb0NLwzSNLcBhJbUp4UxgrZYSuYdXGfZt7wHu28IH%2B9RspfBzvLhOf%2BIRKogHMtRNC2IKFSQwmz8BJNo9Q4fQtZeRxk6%2B9sHjfv033X%2FLkEwb8Q0ZqEpYRN2RWeVnzWMVd0%2FXyXCBn86t4Ll%2BYbMPDPSEZVOLe4GcaF%2B%2BF9DrxXqPT8aBT6mR%2FIM8bMyMo2JsKXj7p%2BvsXOFPhlzlY%2FnYqsNpMqCsqCMrKcXD%2FCrfGVEaI%2Fs6XYx8W1bSnAS3dOlNJMxd77mbvQEVGZ4yEhDbrq4C07DzVyIbaK7lR8mj7YZqs7n1lmQqhcgZ7l6l2u7BsuyAkzVOZ%2BjulfnI8MZ39paDM1XIphr7vcy2IkEC%2F2BnMbDoB5lIwk4T2z%2BwFbai54CYu%2BvyqRq1MyI1L0aFm%2FRebSGcKiW754OIGIX69mz%2BQiJ2fmdiPDUP7Cu37WCcJGpn7MLLzb334Ey5ZRiVZkFJnGTKDCOqSOSJc3uc%2B9ebUXHh4sEV0ZcJPhINi19izvrtU9wbwYLjORNezCmt7vPBjqkAbbzNubdJK5pR%2FV1%2F1u1NLn8L8tR%2BJZoC2KmVRwgTVeG1mKK2J60zMzNFrOHaDp9t0ha1NKnLBwANvM7Ica%2BwAPnxToWSN52PnUiuV%2F51iZOZJkCi2GvoksRlbrRcFTUzhOri1k0DjjFO8AB9FqERuRwJv1254cv0rwvqTQGbO40A1CyxFg0cG5%2FGxhlyKFcDMMZqQSDZJytdRcm5CHwmpr33xZt&X-Amz-Signature=8e6046c41c4e826f5d09cd95b9653b48b1f843707b5d01cfedb96ab27bdba662&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666IOSJGEJ%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T035900Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG0x6z4imUN9n4OkwrskM%2BsOp04%2Fbg9XKomGzb8TP8tJAiARQBbTzXn2g4u0cnABMFcHaq3aefbbZUyYTsGktwcIRiqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMzLLsgXDbSLwn5gy7KtwDsIQSSjAT%2F0cXvgyG7xOK9J3iVy9qWnOndCF7S43tLRVcZKQHD2DxYkdW4VVl4x23n0MpKwuHdQlERLvzmYC6jgXCy6Cr8iPf%2FWsoFz%2FvIx%2FGyn5au2iLoduuRAbpGFu8nW9gUk3glYZ3770IqHbAne65mY947ZhJCrpUVSDv6cDA9TGam%2FINjn5FcZU0HxxwzjcxsEW3DJppp7rQ27hPswuVaY4BWMkiECSuJJH1ny8KvaSGTQej57iR98pY3%2F4LwyAAGLVIEvvxTjlFV9%2FGsqNXrBTfNe5p10Bpq%2B4h5JdqjdYpHUFiHoQJ0tFte96IxwRKBquV6RUIw6BP5nyBCl0O7VUrh8fP1l%2FhP3QdOoc5V0BLGk1YAOsqMsILOsnzBUMaTlWhE%2FyjawlpcueQhXSTby0jVfwGW3VUBWAgu%2BbZii97zHApT%2FgWbAmXiHDiraml%2FmiRlshr8Y1Kf5MINEKqKPxjNXMwVVtGGjWMOV2wZKcbOnBqdqL9BayICTosPagQMVH4PJtubKfH%2BfxqlEyZUR5VUsrKacqW8agXQsz6yOUBfBFeGsG4IFLfp4MSnPjpufV91782onM9KissyuXrBn0JtGaUAEQR%2FYbRztzSu7S4efHpbVYEitkw3LS7zwY6pgF4BtZbxVsEY1HQqbp7nHn7EDFnRiMptrRsCu%2FgHs%2FQjVqz7rzHryNSQOIiLCPToCLtRQMSaR%2BSdRm%2FNVJJcWGP%2BKbfDveaKedR%2BqxA%2FqHHbxSX3vSlYqFKO7YSM0gaZmfch8L94t%2Be58klDvugWKvzeJDH%2FgutADXqD93FZ1kx9qF8IVDDIemQnSXm4tNcum%2Fy%2BwX5qwdVKl5JrQDCtiGnAfRJMpY4&X-Amz-Signature=2265617c38e1e556518ba0309552f338a155c879ecfad2003a5d8a144de66697&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VOKGTAU5%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T035900Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICVEkLgDZiSvkP2CRqihyVNaMnSp5SdYwqg%2FUAMsTNDhAiEAu8Ir4bAAXzcqtmMgPLja06C91f8GJR0AFQMt5fsGXHsqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKzv7ZhcSYebHsaMcyrcA8h6n%2Bkdzbf2ZwfoCqPpy5QxeJCmM%2F4OzGFL9GO26tDM5Ron2Qm5dNXbNf5f%2B9AsLLeX6u4dt%2BMplxO23HSeH4oIIw3MU9t5YDhidy1RAnHjL%2F5A7f9TOQJAj%2BiN0ZZvvv7ZBmtGepAHH6h8jc7goVc12N4yv2inzJZSIZ5D%2BRSs3JDeW0hB%2BowmDJYsA5BIfKNIPZjAqe%2BjerR4maCLyQi64Yn1a6mI9%2BEvB0wFo3BIux4jwTNooqzG1zVMHDA0vnDUxR9O%2Bjzm21fGMYwhBtQgCW5c%2B%2Bl9RBVJ2NVr%2Fs%2FKzPwOuNIiEVjdST7358JGSSJAcWl8EnD2ovGT7Z83w3ODQ1y8M%2FR%2FZ6%2Fz9h9P8aKIVvdzwiwC8c8huF5fenqyUGwAPH%2F94LjMV3e4Z0%2Fg9aAgqE5eq1gEbuoAtHLeLw488DVg%2FFF8OS76%2FYGvSvQCI724288DLpDf16gOYl3Rc5neh3VF5b1g%2FXeTeJtiDYed6%2FhO0%2FqXvISIHRxJFL00fmBqA81tVQZuHsyeQ%2F62uyiC2aRTkf%2Bl%2FUEegFT3qUADIuV6O1RdeeiBaDbOJB1t4OYZVWz6Q6NA3C5SlZqezBCh5Hwki5v1gT54pb%2BLKnRczzqnsdPmJtL7syXcMP61u88GOqUB%2FWO7gXlaUHQxEGqFvxZxyvaR10C3kLIQYKhDY%2FFNwjtGOdNCyqF4A%2ByAM2X7YZ6JfnY00WEFlckGrP43dC91%2B%2BvRR1V1nIOH3GVevjBwcfCjGDceaUDVfahas8Ozq38qOxDBBBig5DThagpGnNouw57nXBtkdnG00NZtjkZXN5N9nZc3wumIVLC%2BGPXeHjTDHnkCePG2A1SQWCoAk2U1Rr1NSHbA&X-Amz-Signature=ca819e85f87e706b1334198ebbe63a533f122a9ee0154939f4271e1a8ebee72e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667GWPDUAD%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T035900Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIANIv6aJkxvJaENp1TziYOvlhXuyPv3F5TbB9%2B9MIEMlAiEA6TlOA%2FJwShZelnH8%2FwBjG7lkr7kklctXenVfWnpQUGsqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOjpaZfTGQYuFe4xVCrcA5dR7Sq%2BBDIf%2BgdFO4mhEN8ojfASEElfGQ7mQykjPCM6%2Bjp3SuzmCNnNqp94Tt4g9engedCrt09kWkxGIDurWsn9Ff1hMzRI7%2FWiVW6uQVrFwP5EKQiqlxNjFjp4Sza06sGvol4oDh3afy2ZLNSsNkBamzIfR76Qi3pe%2BvhHuVoZ6sGUvjM01x8IhhX%2Fe51WywZfLcSkktKjV9ivS9fNGRSnpkctr5qCIVrA2xo2dp0RhdmAAQ3mbLZB%2BtG46dlUxWNuS7BbjM%2F%2FsZ7qxf5TxYFEuUQ5ht5l47ccl%2F98YDEkYKCS2OrM8GvtO6nIbC07pyvZK%2Fucxo1lYK%2Bt%2BxejH2ewThiq9Go6gMOU1LiYeDuRsMsOH8TS8Cu%2BXNF6yFtcNl08MT7Ih%2B%2BadCQg7OYJ1IrDMbTSv8oI7f7g%2FJP%2FhZIkW6h95JY5EkLP3LvGaAvkpvtaGWhhRG1%2F2mxvUl0Wz47a7iyErWbvZgvTi8qtBX69xO%2F0OPVGJ9AsHSR7PnOhmsSsF1KikiAYbo148PBnxTNszotXb3gLz%2FwsnSAlxw3Ju2XE2TPd4s9BYqFhTSq%2F7UbjDIjpyCvVGBog0upGccC8MhLYzrm5yzYY86Wr0HKJIzI%2BPp0UREXnllgoMIq1u88GOqUBH37VQW2CTZRaUJtM9dVbfykKX9kwgP%2FzVVbMSWIkcffoMk0kiugLEh2LnpP%2FvE9Wm16E7XdsNRjWguxaV5v%2FZTB6zO%2F7GX7AcBnplXiPG7yigZOWppf4rnAQXL8%2FW6g4UhqW%2Bl1bkLZmRyqdnCgDOT1ogKGtp0DIk%2F12NStfGnRGGH%2BN31Wmq%2F01Ow2i5OZmGn%2F4XuYmfFktDIdWsJ%2FdUdXakFgP&X-Amz-Signature=60b3028c6ada79f6e8d3ad191fc3d065a72f1114549d24702ecfba78bf8be0f8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46672KSHTIQ%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T035901Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC9QAkPYHd%2FmBksbccM%2F3MwmK5u%2FUf8BX7EGovuAjRQugIgX1qIXh8X3qxx9Owf14H7QOAWgbZ7e7p6830Dsg%2FATOAqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAWdV2BejObZ9uUMnyrcA55xUOD57ZqcBqUmkG65B8V%2BKZTTjgypGaWgmsevsm%2FLlV3LdHU45waNtte1YVoiBam0LnbiRsAMbwj7BIigkHkX9pu1Njh0gtjykkpKLR9HP18LUfDxFv5xevZNeqLB4hsW2gn1%2BQUX1GRQ%2F1Lzds2DqPTW68XcKiPabjiDY57xcKSiKDlwqRO8lURYh%2F5bmkLWzBI2mZ%2BE6izHTmhKZJGlghKDD7PpKUaunMv7qFAX%2FMeI9Bri8PSr7UOlt%2FNH2Pu9XIkiuT5aC0vDcsCWNa%2BuDzVq6mshogzgN6IEgJFQ%2FgiJpOGbHJ4FHVEJxDzw7c85PL86ci4DagM2ginQLtO58LBiOI6uHBgLiQHW6EuVx%2BkTa1ddBN26akwnkpcSN5qlgJ5IkRtdsPWgLS9IXDvx1hBIDWVpvFjnBF4oivSiYkWqIFLhodxFnXH%2F3xiEHve5xfggNVFjJQ4HZ18LRK6%2B2ck%2FIiCwEBRLyLQdgkNZ%2Fofr1fCNP1QQfIIEBo7DqOWmpWQ%2F7ixOJxNXaDYk3mtLE8zxjfLMM5gzq%2BKKR1LoIVGuuGHRdIxSEkhlMRXq78vh9n5vvffpCqyeNTkQGh2BLdoTj4VTmoYexzn3Yzee1kojx8j%2BRCqCxssmMI63u88GOqUBrY9ruUruxrKouxzNqmDjjCSAQ63ETTjNcyedSBS3UZKllUrg0VXtCwXWz2DzjzTazzja1ZUi2Km67dbu7ivH4rECOOl9Z88qorl8MNCJqpTidy5hUy0pzCOekGt6R0lSRDzH9e6M0G0KLIyIR6Y1YiDxW%2FTIPXN8Lu1yHTHjBcp3gK6nCY4lS8Esa1M%2FfQatN0%2FSpyoSGzYAMfjxfiZ9u66ClCyg&X-Amz-Signature=9c3df365dc240fa48ada2c33153aabfc7651339605a58ffe018aad37ea670880&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46672APJHJH%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T035901Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHbkSEsykqeHCy0iSHe0VFEwbiQyb89Wtc3NKRfeYhZtAiEA6k%2Bz6KhymuYqnJWv15fmuNCUFS8%2BJ6%2Bzfj%2BjJQCMgicqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDENZrbbWnoXeR1MmWircAxmp6Nu0OW3KY%2Fr7omGRsRj4HEbTeiqoWYARWAJhTydqLWe%2FF9rUgykbNnWuzSPrpkV0qK5x27vIGQjLJtZDZb%2Bw7qRK6hg1RFX90sFUwswWn8Zz5GRxn%2Bng2ix9QhpSreTYXZb1SiANa%2BoTrbqY5kyEJtydVLN2674V4yBDZyuwpGPyxIsb95EKzMNR27wKvxaywgAhL2DkTa44YV7OEMVORKxbwEuVayh%2Bus7KCWtSeVOTxINC%2F962ApZJ2u9ivjEQYYj0zmdv0c9XQtIm5%2Fr3ghLt8wr4pBXaghy%2FgvNe4rqj8ZM1TN5SYR1%2BKAMBZt4bHyELOAtcHfLD%2BKmxrAxfFhcOSMbjAZByaje5r1djVvWrFJ5mGnWEeEvceZjr5djgiVupYcuIdnryn2ioDvpuiCa5%2BesxWhTRof0qx%2FPEotki3Hjmsbrs91y56u%2FMWMR4fRWcjqfzg3xnfYnFvI99DkzuVyb9aslN7okiQSv4MWRoa%2Bl0y316XQBfli8UPP3Vbmr%2BIorjh2HkKK0kA1oLC42t4UqsV5gzAQ3KwvsjuNufGQGsAYdoygpDI41MSIcbnc%2FIFHOyrvVhSO7XJiXL411At2CvZdwu82uc6kfnOSIzBH4mMyXjRJa5MJG3u88GOqUBNjwEWgaHRh7qmZn5v%2FVxaOxi%2FIPFDO%2FJce1IpLwS4GDGjLOgX7BRaIDOZqiNWxCANBgzSLOGdGkvqERcAo1hHEF%2BT2MnuKIyLhSmtMImhb1ULb6elWz781JCkiy736Qojpp8w1bglN1W0lEM5Btm0hvL29iA5rbH5wuZp%2FGEJebwvtnJiKvhYHBxslWu5ebD4egdVg2nZXuo6G1QWETGpU4sVwUJ&X-Amz-Signature=5bbada658dab2cd750bf1853ca1c52ce6493e85488268fe3188e6768a61fe2eb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667XVXXCVL%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T035903Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAvz16WwbTMJUtVT7pxr2nXdlJ6GGM4vGsteR8P%2FOIs%2FAiEAncpCXLQZ9JyVdQ%2B0GN2deD%2FGRrzjZXRu1smPxw%2BjJT4qiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLab%2FycpLFlBTC8awircA%2F4xosy209YzJtqfXPAC%2FxdNRrcGiEkzwZPQY51DCjlUTBJdcMCvgY9bvc%2BEKeu1%2BwG%2BNyZfuLHS7sUJ26%2FyJ2YiHPqnMLsttQSnr1z3iFWiqjGng%2BEowD8GIBA2FWbPdGqRHjpa%2FI%2F0NFTzeK6ipmzJaLBRE91FqsUc3fTi0pjyJlgwP%2B9Hl%2FVZACnnhLzxgWEti%2FX5FXdS7T9%2FY1sM4%2BJE247Wwb%2Fn10vuNUVwM%2FEx%2FzIjf5aWiGJAzwKxct5RmClyEOOBDjp%2BNmMm8q2Fh%2BBN64fik8aoi0AMNe4VLDbG%2BzvJZGBjWXNkO3Bb9AXJQx1a4ngjJswpHeq%2F3plFbWLrzlhIhoTbMPRzl%2BVWRqgk6%2B%2FhPD%2BxwdlRs656wSROcdsMmgKHxUFLsy0%2BagBqaDvgTIXlss7WHahu3AprtllajEszxWmT0v9bk52WK1wGxAXzD79kGSxZq82614YN4TUONXS%2BnFxxYyO%2B06%2FMoDzIUM8cTONw%2FUjpnY5kqk6zHaJJ6mUn1eV6NQfcx61Pr7ExTwdXA14kRz8xPpmlUrjKuKunb%2FJqSv8%2BZab1RxGLXrd5nDGWCLDa8h5jx1PDF6IYH7OiY4u9I7Umab%2F4hf608Q3H2mTycOsyDrz2MJy1u88GOqUB6Us7K5Rto5hQdLDpKZrY%2Fwxilr%2BLfoyzNuK4c4ZlmhRM3XAJn3tugla%2FRAergQjR7hRpaQ%2FL8Rs283npK2mNNSQxb8rl0Tn83WwR1DnbnCSSvTHGcRiTzgKSV0GzSTo1yHvG2rct6BuVBO7OGuC%2B%2BTGZds897zGNgb9tLk3BI2Qsck13JfIYPtoSS2YQHCdoFU%2BVbkHhOVL9DEcFBFNAeOL%2Fu9Te&X-Amz-Signature=6b06bed57cc6950452503683717ff2957105c5aff10aa6002df80d0782f472c5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46622HL7HAT%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T035903Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCAe%2FV6bb6q5Sc%2FhvjtNiP%2BcvxdsjuDPG0svqBIUCkjzgIgUONQyxac4yBTeLnE4aiAGpoT0T%2FQkyHbKpQkuFqlvBsqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH4ZAh%2F4yYIBDUOZ5SrcA46F8ig4aL6MQ3QioLpMGaRAGtJzjVMwINyDPvS%2FWcwpek3Be0bgw13e1lHAkEwhwqgv%2BtICCh3%2BsNQCc46aAUSvSi2dx2bHWOIojrh9FPKE6gYCDNuOYgV6iENMR3fUwDbNWnDqF5Ldwyuvoj4TnrTM29vySopKkprjfFqVBWXQ%2Bg%2BDeQGroDgsup%2Bs8WrIQw6Y0RoMoLkYAptJKKrjO7py5Mzb%2FCQfLh%2F2D2hH2vGPC%2FIcNLS1rT8lRNhlicwDT8lMKwzzEeLG%2BI8T25cEOjsC7zhK4qq%2Fw4uLiLjPEZ8JwMRDmbj6hUHhShhx6xbukGUAx16k2yvSuI8Fzc2KjnydO7ssnAFi2zhwjMau7A1xyMNvoB%2FcvQOoYfl1gxVEPCL2Zft2RqGe4Y9wjB40fKAa9CfYZp1GiuFA4ICPhKX9d8QWR7CaO%2FMix8fs8IHDHYLucAJkZiuJEllAYLFA2PcBQ%2BYSiYhgQGY6sErdHPoDvo2CMqruzQzd9cowe01jptrpSwXSGtlYGytSPTCy0M15VhmBuAzbRy6mdqvAXhRbTmEISFvbWEIYqxRTtrpH9r6vD%2FvlEUQ4PUwUwq8tv4bZWr2U%2BkPEYtY7OOLz8SKnQ0Dw34DcoHe%2BmUnmML21u88GOqUBQtSrp8nNf6ZyRunKElhUCBQRftL0GQGq7HqYYO25atPU0gO3xyQsgVwOLTcTlbSaOjWpzn4soAc%2Fr6Xzt9OpLHyjOqAIxZgTDCNZxxa2f1FMh1I7hlaROy2N54vlVcyuqIBmauK5GTUJXxcSO%2FMq3BQyNYXdcLQD32uf9y25YzTiXHseQ8nH6GKXobAbAr5EqyAFxWETpQm0%2Bk6nLgpN7ZDekGw1&X-Amz-Signature=ab3955e35728086045a9082784f8a99e96fed5d897c5ec3de5db63dcde8e1502&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665X7CB5WT%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T035907Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDLPor%2BFcPBz4Ds9zlzM6j5PMrRmvkUjmhhzkL%2Bf1EjDAiBVvmSC%2Bra%2B3W93vqY9y00djIHKgDMTJibdqawcY7gHxCqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMgrllSwe2ttmDTRVpKtwDDrdfhRacSCX9Sv7q4X5g0%2BNY2RNRif4peX6Rz3CYznctXZjqlFaPVDo6Ak5kqP8kaTQmdQbqR2n0klNnJQeHHhZ5p5JisgMWwZYfGiaObxis%2BkONE9G5yDWmi9Du6BDNYAvtHSW1XQFbMZrwXZYnaGR99sMQjmQj6EeJIbZ8r1PWi0OqEOAGjtD5SuOqTtjzk%2FEvH%2FRFcUSKzsYFiYJuGDJNeaEJF6su%2Bw658CysU5Fslo8%2FQm7X2QwFDWD4%2FoePCt0kG8TJLEQlp6Ij2iyl9JifmHSVLcrM1VpdoQBhuZMzTvRlPnYPmS%2FTOgkMa0rRlw4Cs6lSJ1XNyEvQ3ZlANwT5vzYMVWFSdvGp%2FCqhQ3Vm4zni63n9i7llCirspctPzC5nsW%2BEAwDV8VoBZTLgv4CY0NQ4MTC9thKdJ8qyryMNAQO2Ffy8y%2FnlxkZgctTjS4hFl5ipuCWjVojq9L5Uo1Sm32NsrORTUs6BHcS5nelCYmXm2dB4XZ7odr1e6UAEnnDzD7%2FU6ZT1OvQ9pp9xf6yWEdV6mkoddZ%2FXUjuaGHxkIDS%2FZnOVAyVF1s1Jk7PyeIuvXiJ691TuQCuOdfrhw396VVV6VK9Ce7%2BUzz1fBsoRJ412HvpVB7oH080wvra7zwY6pgEcVQU5iEMvj0cHqW0gRkJqlDh%2BBRzdmF7bIeNOynIv4qmCBQF1pvAGtk5BLf8xRDKrnwy7zOqpCOyLY18rJJ0dfZWSK1shKjQCSwlx6dbSZ21Ri1DBm0SyCegrb7K2p51ZNElFRqxvh73aAv8eDBXGy7NYVIXsesvmkO8I763szxb6G9X9NXjgzCboc4NYJvZeLnM1h9lR6JaLG3WAucfcCZLaRcRg&X-Amz-Signature=ce99fe510dfe9cbd68f4f3f83f6d720f2638f676e47a0d4b5741cff0c9ef9cfc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VRZJVCXI%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T035907Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAYCG%2BmSykdItuJJ4PR%2FTwV0Zwe5mwbf7KAPyJ5%2FHo3iAiEAzX4A3lpb6wmbBBTiXdvIR7gbkWPmr7DP%2FHSXxhXzjhQqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDeYuk1MN0xoQtBQzyrcA0F2An42z8aiCLuFsNnjvnecdciRWGQif7ndcokVFfDZyJDGHTbSbbXRDLvaKk9Gf2G1tqF0nNrk4lo5RinojbCKNSQdIdLGA9M19ipbeCmBGGvlcYNT%2B6eeDmZyXV8akSwOmhY3M6RWg%2B5DgLc19NVpg%2FSQE1ELUqxEzeV%2BNTlXIfGbI9%2BktPG21fne6O%2BrwcRFV3utBWUt9eDXZCQLSn2XXzvhyiqkAUJHioSzngYtURwxwUeDNQWNuIqpgBER5%2FA3ytJ%2B51k67ZjqX%2BuaM4lxI27w1BU9tUw9%2FUXRmlb4jvIeCqqa3q%2FlHhwh2UWIhKCCQHywYwIHJB%2BzSXu2kfKrTXbPRL1jUj4xBp9zSeznp%2F0nD5L2rjIoc9dXhjmRYvr2rmZf3W2ddKnoyjf5h3zMxVUbgf8BqWs%2F10rB4C6%2F7N5unyWi6sZmfUJsv2KMGzkuWtx%2FuT3t7PPEAPbHaNM0Wz0TnnKHRjECoJvL5qviB7jY1lyNLT%2BpYbN%2FgeljU6MCsY4TOMmkkDYp%2FYEYMcJB2LXli0nteLdhWvtrGgscSxWY%2BVfOzXABB7%2BruTuCsQxB91Wy62mtb9QPGubExYsV0RU1oNiB%2FE6VTDlkHPD9jANiEc%2F6vHaNa4bbMJm2u88GOqUBFRSvO3e71qCjPWsXRj%2F7d1D3D2SHGNjzUrAmJqJRuuG7T%2BHc7r5e%2BQ32IzpBsrDS5b5t6ieE9a7ysK1EhsWcxUlf1QRdR7xDiKNH4oAL%2BrmwRHYDZh%2FbfjTFKvcgYNkN%2B2sYgA3Zi6i%2FQsllIDGt5nL0gDwJqSRNFNON%2Bzon0PCqrD54K6WfWwKz0fYGn%2Bby%2BQq1LGB43wX%2B23rZBVKpZ3QASGHs&X-Amz-Signature=4006050c5e7f3562dd82519969d6c2deca421df2abb4fa57f5d5889bba524c88&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VRZJVCXI%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T035907Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAYCG%2BmSykdItuJJ4PR%2FTwV0Zwe5mwbf7KAPyJ5%2FHo3iAiEAzX4A3lpb6wmbBBTiXdvIR7gbkWPmr7DP%2FHSXxhXzjhQqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDeYuk1MN0xoQtBQzyrcA0F2An42z8aiCLuFsNnjvnecdciRWGQif7ndcokVFfDZyJDGHTbSbbXRDLvaKk9Gf2G1tqF0nNrk4lo5RinojbCKNSQdIdLGA9M19ipbeCmBGGvlcYNT%2B6eeDmZyXV8akSwOmhY3M6RWg%2B5DgLc19NVpg%2FSQE1ELUqxEzeV%2BNTlXIfGbI9%2BktPG21fne6O%2BrwcRFV3utBWUt9eDXZCQLSn2XXzvhyiqkAUJHioSzngYtURwxwUeDNQWNuIqpgBER5%2FA3ytJ%2B51k67ZjqX%2BuaM4lxI27w1BU9tUw9%2FUXRmlb4jvIeCqqa3q%2FlHhwh2UWIhKCCQHywYwIHJB%2BzSXu2kfKrTXbPRL1jUj4xBp9zSeznp%2F0nD5L2rjIoc9dXhjmRYvr2rmZf3W2ddKnoyjf5h3zMxVUbgf8BqWs%2F10rB4C6%2F7N5unyWi6sZmfUJsv2KMGzkuWtx%2FuT3t7PPEAPbHaNM0Wz0TnnKHRjECoJvL5qviB7jY1lyNLT%2BpYbN%2FgeljU6MCsY4TOMmkkDYp%2FYEYMcJB2LXli0nteLdhWvtrGgscSxWY%2BVfOzXABB7%2BruTuCsQxB91Wy62mtb9QPGubExYsV0RU1oNiB%2FE6VTDlkHPD9jANiEc%2F6vHaNa4bbMJm2u88GOqUBFRSvO3e71qCjPWsXRj%2F7d1D3D2SHGNjzUrAmJqJRuuG7T%2BHc7r5e%2BQ32IzpBsrDS5b5t6ieE9a7ysK1EhsWcxUlf1QRdR7xDiKNH4oAL%2BrmwRHYDZh%2FbfjTFKvcgYNkN%2B2sYgA3Zi6i%2FQsllIDGt5nL0gDwJqSRNFNON%2Bzon0PCqrD54K6WfWwKz0fYGn%2Bby%2BQq1LGB43wX%2B23rZBVKpZ3QASGHs&X-Amz-Signature=922f08de7c3295d09cb8eb2158a073eccf64b2a78976c2725d033663f12f6807&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
