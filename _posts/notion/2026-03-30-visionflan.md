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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ZKIDNAK%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033542Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEP3Cbz%2FaC7plliDbsZK6YzevOttKTKWgIRwleQDJuoKAiEA2O3XQdtvf3kpaGlcr%2BjgKlzVo%2F1vNy%2FlkF04H7HtNP0qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGNTN2rl28wAsaJX9yrcAzaluAGu6XFZfbeJ1xWc62iIPMLrsBQBGacLuCnLUE2NQHAMVFBdVvDsG7vm7CzbMbgqFDQQ4wRDckkbRkYMdGvvbwgrKBG3x01LZs7YPB59eLFpRS4zsiNcTvR8557Wxi7C5c3mIpjwy0C%2B3%2FzxYpop9BVFeHr7JTBUv6SOEXk4cDBbZ38AKqssf1b78FG6JR0CRlrrsDt2CzQ5AsmLs9NkKPmCRn5NM12XD4SJVMxirAqUA3hyBvaEHj2cz1894mMVGDgNuhFeNDKnFDfZpLeP1dY%2FInDpA5d%2F9v7woVJXxSc3RtwV8zE7mr0uHB238oQcWH3kF4CnxL23GVJ%2BP9z4DEek4HvNoY3BGQrx83QoROg%2FGwoup6XKmwi8FTBkVYvjd1aVOwK259pICgXEmn%2BonHr0gsDLPPmRTJn4ov9sg0AH9z6JoMrKi8BKm8GEthUfQxPWR0p%2B4URXV%2BFPvWNVa9scQRCj3uLrHzUQBcXUiPWoJZQCYtwswIkL%2FBADwb2oklBh%2BPIjIVnQ2PkPVaz1TlO0LO8HJI5818ILo1UyV9ruUIzUZWJZcUwBAIWSEDQoLbIZq%2Bwa6k7ANizr%2B2RgrPrhMYn0odUHckeKO0xxWEr6pLHm%2BAzsciFCMMKdx84GOqUBZBvbb2A18yGNt8pTk0O4SZMK8F%2F8TMwdAxXxeXy31ytqD8k1cTcxzOn3rlFz14Qer07WVzq8AQph0cGRTWYH4MumrU6U0fHhvrxe2dkOObBdZkfgyx2%2F8KcxVng6h14XWjj1SnawLuzy%2FsUJueZhQY%2F5bmeHyAzslLpshMxsBkNfjcUziwYMSBDEPC0p9Yu8g%2B9OnF%2BsyzE3xwga9LPJUqCnMzzo&X-Amz-Signature=4126d8501a26d1ad57e2a381adbaf8c804647667f12377a1d85c052f96ce1c2c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667P7SXSLQ%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033544Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDxSe2pXuJeCVUerZ185V9blEjeevQX%2B%2BKThAMeaXfYLQIgNDI158%2BhAK7N72dIb8H5OTLW%2FcDgj0%2FYF3rNfjEYvH4qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDIHdhjYm%2F%2Bomq5ZUircA6GtMX6LRTEqUBvh%2BIgyUeTu3ggLy45lgcJtDoGRi%2F%2BpvPGF0u9vFf%2B9WM8Pr%2BM3quvAbp2ve4mDV6cyuLYZmxxQmZhODBVA5y7HZuF%2BxtQk2gT2%2FzX0JgmdWBB9ZLGKxPqJHeuqUjMLUHSYVOeqtKJS8KKz6dmtRju%2FYtkAiZq%2Bft4Paqmhh7dE5tqfTs41xEv%2B73n4zjdKmWoVmZBDahzFgDdbM8kcIFCap0qL%2BAP2lMk0e1z3wkOXVYk%2F%2BEodq2WOp9SAQ6gxr8uUYyE9mh80SuWFMQEmu%2BTt0yhCYmPLgTZ%2FY0hMzqeaYInNB6krUGHESOWwJcfD2qstMHpBIuwdv4ReM4k%2F%2Fa1Z4RzfjiiuJtdUUMpqQifLJ%2BmbH%2B1QANG05O0Ehqzief2fBMRCw7UABcnKfodzgB6FEYM3V%2BSO%2FGOelyNQvGkTEbuq2BhFCKeSW%2BD48lMys3XuVsBOQaoAKQrQ7hRpkHlKwb9ZWkmSOZHCKvsIBP9XtjcT%2FAwIu4ltKDRxtoOIVq%2Bb7I%2BTZPQ1IZvprHGWuHAxz1qmwSmTOQ4RdoSv%2BfySBitkUf3POsNQ2SAZKm6aQ9kN3bM%2BVJ%2BztA73MtfVXG7s9nnJqxUTWx5JfO3W8UQsU6MPMK6fx84GOqUB27dgwlqvQN4aqDpxZ%2FAFVu9wXdUl3F1%2Fqm2DtBFTZeb%2FFwalDpSoFXBqGCpIbkgETlsRC3StwGu7KnYEQ2Q4mAeQzmWflrru6RIkImeu9arC5PntC3IZzV%2BGpU2Uxfxs2r2IDD7OZ%2BkDzx0mh6uEWjmqZ9vw6w4gwECfYjXooJfgiYJbpYRAZkCfdtx9soQDdEZEVoNlcw1MApcrtYBfX%2BUfp0lz&X-Amz-Signature=f74aed816bb7ff592d35a8803b142bdae3c67f0500e49261fa8921bb1c2b143c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RICONUVW%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033536Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGkItenYs2RmwQQRcQvLuWVFBVgQBZcQnHLR1VmMzpz4AiA2qq84lLr0zosK%2Bid%2BMdcMU5oC6p18ZAjGbO4Pci5OuSqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMI364Y%2BV0PCz56UVEKtwD3ZGyH0py9RJWhIJhWwYFt5EbNTrjMTtBVbxFqDi9y1GrTJ1pwA4Oo%2B60JQzAYmyaz4vtqNmDjbp30hteZi0UcmSgcYKeVJzEQ%2BmlthtkYnvaliZqHi6PJaRu8Y%2B751slaF5UmEm74cGpIpHqSWQgOUuF9%2BF1Wp%2FJtkqbTUlo8bKvmv1yG3gxGh7Ql8tBGqDujGOtZcv0b%2FRNXtf0hAf10hyNYJiCnw6lBNo7LSlk6ux2jK6UfpgFFNJEG0nY2ydLxB2H%2B6MHZ9oUAzLaGs1uc0FK0fBpMqPpCkiEyWTlp%2BXZiSOGz5bY3yQruBdAOwAMMScY0Wt91N5BJ%2F6NlF5hlLww13DipMwCQx6Yc6VAXtOaR2t%2BMD58dlxFK7WIlSRlpHZH47fEZGTkLqSOzup4PQ%2BndNU6P2jmtgCBiV4rZCPIbjbODaNvXXHzMYMx9Fsbv7%2B3xXiENVwKHP7cR2sTV%2B23P6%2FiCQXD6ZlQ4%2BpnHevVWI3pvbipaeplxCVmpIr7iBfbMQgyM4XDpZxRGmuyN5JxfpVasxgUk9tGpTeUjVecTeQ%2BXjl8o89jZhw1poKxyOvwgRSYrvtacRVZbBbgyrKgugR2PL6YyIo9Pt9Uw3v%2BnpiQAhLSkFwVYiYwwJ%2FHzgY6pgFHxPokhY%2FXmL9eDVrPMJrj1JxQhvzVK3XmOtzwCI8ON3g%2BFubeXkn%2FWEJkkjfPtRQz17A%2BcyjsA1qLKpF3HMV7T5tgsGgOHdjF7NN%2FCCloC9y%2FiVtY1ysqjXVKKmFgXe3HpA%2F%2FW1vtOgysn%2F53Mr%2FeW%2FpwW1a6sN0qPYFN7yvV08%2F43fmoAzaHVUsFg8Xc9soxckhUxr9laohduPEGCgbrYWrJfnMt&X-Amz-Signature=d44fbf60bf49ef1498face50e689f91f40cc82b619d5281a8af2c123acba7d0e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663KE6XX77%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033554Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDIDKX3jxJ%2FBFGmZivSqMVjo0sNZPhZK%2FPWB8gRlO1uuAIhAMYXivp7dLdoBZ05taF3i8tUPGQ9ByGzIxC6gxP5gdcvKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyBW6EFLnzV%2BEwrQ74q3ANyvIIWqMXiGlI1sBB6G9E1rJR3JAj%2BQU9Bk49uZs2d2ztaOe5Vta9M%2Buz%2Bov9twCNR7NWFXGkoOfQq3YZoNGUVcUtbKpvPyOvb8qJ50Q3fTm1sWxYqx5N9TcGZMshMIoD0hUceZbUTKQ4wENaHt1f1xe0UbF4fUM5B3imnIAj69DKoqT3dPnpQqxNBnSPPjutCv5Hd6xpQmlFXOmYkX6pxsPgS6J9cSnanDY0swtSFircts6RQiX%2BUI44eZI%2FAl6V9Btyu%2FKoWpQ38lUmyAYa4XDL1MpJOjtXuIVRKJMQzq5SH4BNW5DCFvR46kxI3bezd8nTwCpP5URh%2FcoufRH%2Fs8m1XtHHkOzLLthoxewfQp2tsqQTJI8%2BWudEKYbgJ3RNbp97e5y%2B2UQ5utghUWbkNd6nmBBPT4HZPXXldznyjJ9I037oy9RR1Dou7I%2BxrI9Td1Rl9obQGiIHVl%2BfypS1JIWSipQXon7LTTveb9NfEOp%2ByIUQbeEJrt835DweM%2FcxrXmq106LIGfC64NU2PCoWwvcbWuinuCMFPMbV5W5ZPFNDncy19JtBAzlC4Gavfn%2BmlrnpkFGAk2H7ABvjNxF4n5rJTHjU5auHyaiAa4egPqJzq3s6b%2BaWDIGBCjD5nMfOBjqkAVoI0Zc6EX7roggX8%2BRbOX78af7yL%2FD%2F2R5G6HnKefM2aotfrU2j5Yt96ISHCwsvSc1aGG17%2FmX7yc9gzCd%2BG%2BF7Gyds8AYTnDh5pafRKNhFuAbqkpaNzkuwPylE9cYfkXH09VcZrh3RxzXMoQbDC5KWeT9x1WsSK8hcFTnPdUeoj1ArWNKPvqkbctHqhPnU1ELI1z5MKxZh85HDomCDWnjOdcGE&X-Amz-Signature=8480bca4c9c816351f60cc3c3090e206c041805108f44c1145da8b37f1299264&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U76M4OVT%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033559Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD9taSRB8Er24%2FRWN5LNv3lvyA0AbyWRiug9dPerpPckQIgfVJKoxfqpE%2BYroHKfsd1IwRkCISEJQ6kvcQteQoUfN8qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCIy3rgN%2FtAaaVh6syrcA26X16YCoT0JrX%2BAUl3Is1IjH7%2BsC%2FOic5eyDpihWPhX1XLCzCSONRyZsfV3wORq%2FM0NCIkvOkZmDtjEPUgnz5seI8eR6ZgWv1QDTtfqXbrw8Is0HouSKxpTGTch2096KO7qxrgNrDnctY975NER2NyfPqOMVdvKQf%2BiVTgpR7JsQjbl7%2F3Vlwb1DMIzjl5MCnuikQglDylStAbJn1iR4QWBZQ7T4IwEhJW4d%2BzSK%2FKPPNV80HxS7GqK%2BWTH%2Bx%2FXC%2B9%2BweG39QgGz7x5CftQW%2Ft6bJHES24pGY12aDdxDvV5L6o9E%2FJ5I4Eduzt17df3PIFn8rxHbebmfuZhIQW30RyOkyCAPHJ0QF5TReGVWsCES%2B%2FmDehQWShuH5P9221LVm%2FpCdnE100jnYgoFZl4Y7kkWDNd%2BoOvrt7hSGy904fX8nT15Pwfu5SSfCRaElreyRD%2FMFh%2Fdx3a2jgJNwk%2BUa1sOz1lKxWB460B5kgK%2BdEHpgx23NUJPiHF7NKA1TwaDgT1Z%2F6%2Bl9Ab5%2FylZrZTy1%2FCdS%2BsY4Ot5qy7N3ztzrtjKLDEyYdu1fWtylwq4HjL5HkN%2Bcb8bPuWu629ypdY7vLAqWlvzYs1sQ9n6RRpqO9kaiJbx%2BHMxHa29uieMJafx84GOqUBG6231QphsiwzeywZ9dInLh3uhT4JvV%2B6qnQLlgRXAV9gUvTMn%2FMflXh2F5cMcwb%2BMlwvXEAP%2B98KArS%2BszYCcBAKmeVV9l9fpghxw%2BORGoktTlbDFb1TqFdtF4S9yUC8CvgoW%2BG3zxEOW%2FnQO50omch6BHjbLCV3D1WCJhfrwvD2qkAsofXMg9VXol5MrWJE2b5SFT3VLB19BMLrkSl0xfyy98%2Fx&X-Amz-Signature=96750b38175bded9fc2d46f5654c4b2e0de9169ffcdcf926aab300d4f3fdfe86&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662GZPXO4Z%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033600Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCglGyif9TJSgpWBSnLt9oM6LYRn5WKSeqNojd0gqjbTAIhAJjq5L6ujptjhjT8jYJ9ojtFGuKGOG3kTFimxsNEPOBKKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxnwzrPmotMMqekCVkq3AMxWwUtJqrxUq36qNwE7jKTv7u4mwUQkTy7EYAHI5LkeO%2FlkzqxAzlPrwZUA66Sew%2BVowr7hIQFMwEHvuvQnHPonEnIxXacTbOP%2BsiR0WLz3%2FoHGThYhwzD%2FKZkcdDzqbG5iH9BY1cdtGoMhnB6c%2FxKDnfIo4JIGsiLM3AEt%2BhKFB2hyq4EvYTaf2irO9yP254HqxUn4B0GgK1PXgHzwRHjFwKaN4CnGmWYWdQwaxlhaNy5CMknQ8s1hw5T%2B%2FxmGCf%2F8ssmCB685PoA4fyzvqDQ9XDQ%2BH%2BPo1tOBhUH9ERuQ6nQDYlAjbmgYfTCYSm%2BJmLnRDauNbaS1Sxcxrbsjxo4uYC9I%2BJtMCXf4KxzzHDrIRX%2FOJb%2BoK1Z0iP%2BOi%2BKXG3UmmUnZkPcOO2GDHFmyS%2FiHmhDX%2FJp8KCtaKrdyY5ad0NWXhWDC4LMoWdsCMVaZELlHwJxcfzjOcuUwWHWjGwDI67eEjcU44YkvL4l1Ru%2BotJhOlHEeTN14i20zOUWH0PSmyj8PqRe7daCI%2Bwb%2B5JqzPy8Rw1T6aGfSW4DaGDxE7UdUF%2BLvNdyd92Mj4IemIujk5P45MZ8xvYAKOwR721k%2BBv8VcaGTEKkjPIg4KVJHzb4sUqNows4riG0KDDCnsfOBjqkAWQiw2HSJ8Ngc8j1hRu0pSWzHeH144ahXlx7mfWI6Jn0HTwO8a0w05HGThczfAW9jcujUjULwq2Jl5L2ODsO6uUOOnR4t7WF69jw8qS8jUQKdm6wAfL3BOF66h0RM9DIRppjlxrvM4dfUK%2B6bInJzE3Wvn%2BhgMtL%2Bsg0PszHyVHfp6ruXxncAfvePYjW84zGalzvOCShOTZU9QhCNjKQpUt%2FiC7%2F&X-Amz-Signature=6bb0fb9639f9b647881696ba98d462a407a8d1a931be23e9268611266a5a2d17&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q6MDJB56%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033600Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC8169tZpqBDEvO8RicNXrohzWtUufvfx%2Fv0k0HG1KJqQIgDLxIJfkaJRRQ1dbWPnVGErp8P5IaX%2FXTn0VM%2FRYvXs8qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEBZs64C%2BMDCDDO02ircA7TqcsdleNV2whsxWxI9hVmmy8JDb8eKvoZOKaQgTIQBYuQlSOAd7IMos951SwiZuOn61%2Fse54W46A%2Fe%2FVskOt3E6k33LO8uhfNPzoifBDXNIyB4kO1ymiGKHbt52L7%2BY%2B3C7MuQNA4dqduovsPD2MV%2FQsERSCHh8Ux0daFOjiExBQAkxW2bEeb5OirXGXztyh2OLMjdM3v1pk68gBJkETwoU7kLQsa9PAtVND1NUlmcMhqmt4%2BS1j8VdXfnjj4rbuNn3efaeeIvnwSmOD5pXyWOjZguLNjTsAJ4kbQOPOOwsVBwkJrMC4FvTba2OahGsq5CoyE5S%2FEpR4s4Y4XNnQSmSQfg%2FvLbNuaZCo0luYVZWm6LS7BiMroan3OmL7qtv%2BkiNf6YzB8tHhNugLuIFNH3IDqu8xBcsKb6j%2B1aUm78WOt4iKjIsj%2BqTtaCcxY0v7Ll%2FS0hnDWTzzyzCqh5vmLxhHVqhMEYjoKMEGqiLxe4j6m0zEuBqDUOwAPUQNSM8obGAE3oEmhMTCaL39KkM2IZvFp3iGhUWwn%2BXv88b5MhdTgjlkHpYrvWeCwpb9Eznyq3VtNApT0T0MLbC8BNhSx4rwC%2FrCmrMMx73HesVRcUHRv42f5tPLEdLgI4MJqdx84GOqUBkeybKr2%2FJZI3Bjm2V3Wfik%2FZv9bJf539zkh1s3sEHvLirvauB6YLPm%2BEqgaJlwtIo8WoxfT688fWY46du5HJFKBZ%2BmVoRIhQuWZZa8WJ7%2B3EVQchAcf92o%2FgG8w95MpatBPgyvGGE8kJskX%2FQauI8iKopf%2Fe1vKvfYS1Ka9CXRCwWh7F4Vdw3tWqMbJ02QqHwlpLdwCYqSkW6EA8EnW5EKWoKPVS&X-Amz-Signature=888927591d6b348b39d66c8c5efb7c9a64768ebcc1d5b263c71b2fb0f507e604&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZQTK6AR%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033601Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDpdwAg6Hen2LQKwPlX85CmUewCUxF4pKQsJLv1XpbAJAIhAIFTJu%2B6KSyBKAnRlLxraLgq0iOJMEXt1%2BnXqQA6C8IVKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgynL5Xp%2Fh81mfLGAfYq3AOmefaZ8Sc%2FGiDyqvlfGRCfirLMkxl7vnQGH3CkiENmy1da2P%2Buvv185NZiBUMwys8678Xf%2FAGiM0e7%2BjvwXob%2FbTbJcfFwdQx5tj7%2BQTlteoFuNOVMykKwVL12bRPjVK4uGy09MdPIFTTLXxX9XDmvu0GciK3mII5rpB7jJ8Z06eXr%2BYUGvDXLroAZdxzSqc3DoHF0kpYD19n27oWqjEnU8Q47mAZxCHCcezApbI2fiBm7shnZWMPFxVQFLj45ufzOywetXzBfCPtvGJdkVtsnLAfM0kLRznLL751v7D3I1QOtEuwVwa%2BuGC6jk8qFhEtcRrO9PIRGE4S6oz9UZtNWyPGTPHsAyHxgHIHbSINxNPTDE6Tm8Bgjal84Agp6XdeIKxQfQQL%2BLCFRQkFWmZ5xqgFel7Rs%2FofzKylLYK%2FFL4FN7O0yUIoLyQMgyV1XkwUt5XCAjQlA5jmbd3AgGPknWAo%2BfyOB102mcxA7D3L4go%2B7zgae%2FonJUnrNxJjYzpYA7TFT94%2F1lO8mGqmRPK%2BjKyJHLlr1dFDT%2Bm7w%2FzYP9pJb3y6fccPD6VpsLD%2BbExOIBUuoSq8ahhoat0hEd7EQTrtFPsU%2FZ0sWCw56cC1ZLy8BGDDOfsG4DPtRMzCuncfOBjqkARoAwLB6oeUA7RZA0XKLWbQyCxheWAKbhto%2Fiyd6SI88wnDTsD%2FIrfN5W8aKXF2VVtnQj7OBIPnpkkawwrzOkEhImmkCnpkjL3o8bD02TtXuxw1d2c%2BUNexnsGlMMweBU75znl5m4zHeKpdqFaAZyv6Ca4FD82tyPfNAcDbY8VCn22wXomajeSMtDtWIoZLK5e4wTWaKJDo8MDixo8B1TUX%2Br1BZ&X-Amz-Signature=16fecbeb482da3c397e74f8b91f385be146c3d8f7ebaaedf04b5991c5adf4608&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46667EPZIEX%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033601Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDo0G2rNCmrr2KQPKmPytgUrrB0oejXNf3XK%2F%2BCUcyalQIhANyOXofqRQq9l%2Fp0fpLfPwxCLtrWtCyg1jzH1SwRQEWrKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx65kAMGhmkLskP5rkq3ANctDSrYU1ahIknjWXHG8uTu1FCg5K%2FF5zDEF3gOJEXmv7QeAIUBsFkRPi8kgwHqmv4s71KdaYH2BdV5TDhmONFOkwyKqAQHnjA6Qi6rKdGIxlNUnTHE%2BiYsPbETSGvkg78nxghXnNiTwSH66XtqIqfnEuEhyNqwkINYxjNLFL9oItw118I51K%2B9r4VNm3oSzPKJxqdImfkqIoWtTrXu8aRI7sRJk9zdIuxTM5TPcUg3O%2FcDPFKr5jhTj2lUW0y23sfVLt8bwC%2B2Hlvr0cNBtMaUIO7xJoSjMUwHyqvmqwIvkdvR3IG272j8bXE9siw6lRwPokf4r7zq%2BBoSegW3i1R9Rh%2Bc4%2BV4HvxZ8jlzQmbgMglHacb42LsuMwoapZtZ1kQmpTyKO%2F9WCeKSjcYwXXMuDUBQdOPog6dAymxPvZl%2BE%2BEqbeVTJenuCSQJNGXK%2BYNAfgbdmnaYMFMxvx%2BmrXtc30otLy5Bsls7iQ2lzlV0kyzOvw1cCl78mTqxcjNirDF6DWcH%2FurcbA7i1q9xs0%2BAhjTSNeFs3sJ%2F7ro%2BfGKCW7%2Fy%2Fo0QT0nmJtmgjmfioUufKW15WivjBgEENpaFZSmhwuAAtpQqOMGmwgI2T3JclMZVgj66sLF9o7%2BFDC1oMfOBjqkAYpc63zWOX66yHRYBfDuwW%2BtejzpTj%2BBxm%2Fm%2BA71RspQ2eaLe1f2dDaYF7pxzMOPgogI2Q2zfW72GS8wrW9hlIsRVqeZPRaPpDVi0ONiu%2BvdjxuUJh9zKKCEYKcBliISonodwNXRzfybk5%2FIpmlsoPx2y7pb6Uoi8v%2Bky43rB84KTALaOK1zMpCdxWZwFIhYL3kcIgRWXyyq%2FdSgJYIkKbqcC0ju&X-Amz-Signature=880c52d68a09698e0069d087d35f4d9c7945cedb7be915b917ee475783ab89de&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667K7GVTWD%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033602Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFpKcURJ0KnEzL2zOP%2FiZIWlBaKwstFOSzUwRbKfntAjAiBLxfWly5tSzYsk3Y4rRdXNxOdiT3nR2eSgta5upp3tLCqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMCjrSCTrsPF6FciEWKtwDwdHmvE8%2BzkGTHrTKyg4OuLeFD%2BSC%2FfpFCcSYxMq3a4NArI5VLmMpYEVXJi95kgShPV1%2BCyf3Ojs%2FUnmOsyr6rGrRhbcsEre%2FFDijloaJwWaD7GpCYsKth5rd1oJpsskTge%2F58v0d8s73Pn0ZJebx9kNtzF717nUOD3F%2B4tWx3icn73GBTGkQ7lo%2BY00RpXvoMBdtGbVnmAXx92jD13oZNHThxmBlqSwLHRK7KE2%2BnET%2FW0nv3S1Cy9KH2FSfU8rcVT2wTZk3qg2unCoi3DVCoAMW9Jdjfa2Pfie8r6FCswitflh0IGpQp4UzB7aOqHBugfdfTCoPl7dAsP2EwMjOlJu6hzVogjv%2FOmRuEEYw0IJtZXLsZe6wJ%2Ft3Gk8wminCt3aKpgH1PtNfpdqVwDaCEClWTFjv4Dps%2FQuQXEcYKLWr%2FitpRKx7owpDaqLMb%2FHsaie7Rctcg9bC0H25%2BJfYWjjCjq%2Fqgeva86qbKr2XFV6KD85gQsWkznIiijt1gvxbTEp%2Fj47nH9AEsnoqgOjl9w7LuUUvjx%2FLpFkf6XDHM%2F23C1IwW7E6xviVuBK1JNYxGhileUT0A1jh06TAM1DcpmJPm%2B40%2FewhHW2NvTTwXvG1be1cVbACFMQbUYUwl53HzgY6pgEtoHVkrqABD22JE17PqUUlV1IAlxDeraTFezRwqPtoOx9ul8Kq77fx0qNR3l8aFcHFpC6scB44%2B3etJWLaeWoosLMR8Qx%2FS54fGKgt%2FqKeVSnpRrLmbRei%2FA%2BkyCNuYiNoeDGGhAkmMZ575MdmGt5ASEOEi1VEdq1wHJ6yKNeVdvFKJ6Ytt5pLYhfL1FZVTLtH5%2B5iqtqFJfV3WyA6LtmbVo5fn41e&X-Amz-Signature=65674f85d27358a2df0907e50af049f4a8be7ce5f65832ee500d3341b6a7e210&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664UOZIJP7%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICt2esuti3gVe4bJwRtZSDYBVGtbPzvC1laNWVhTlft9AiB9KRQdro8ZDPW9VAPF9dJ2OzNijMfFARJ4HSkFIb972iqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMOJKMTRXGrwN5HcGlKtwDjYXBel%2FTmCKUKHDAsTR9d%2FwTLIZpsJ6wVfJDGXbdjmav7ND7DJFCVEW78CuyUzExcfHpoKCC%2FEiDxOVCu3GNnFB0VmQn6dNnRPnlEH3He2YShJk6GtMl6EBSC9TfmiaIBQy9rTEtfMpdUf%2Fhk19VgiZh89NljL1Zir38HU4%2FOcwsLvWYZKlqWgaz2q7MDZw6upR0FDAkCdl492CJJxRGPNBtK6YOnyGRIqD4ZSdJ0ETBusKFpz%2FDzsbZzMFxhpuixCYcScTUOSdZE6csJVeVrohQ2DTc66bE6bnTg7NCsNYjKIfM7Do%2BP5TEN6UIAKFFh0D02RBljGeHCbETdB3vqN13I%2B4%2FpFylhjLuj32WRzjkUcPUUT4BoykdwxSZITtbKd9leTZayO3MlJm%2FgO5c1DZvwi43eCZs6udlOEZ9rd%2BkAJmAsNqxZ1AAgNDNbyeiCYkw1LgwIXlsSNUMUbNIxi0wLVTwEx0ZPEpfqdiBm1Jo40MpfAr7Mi8qViPKSy5mqg5L5MLeEruzxe7u3K8HWfPKlBG2LBlw90GteOmJbkZsRlJgqZy096P6lRju1q0%2FfSlk48JRyxtS31scN4GwTmXuRtukJLas5rme4xCmJXNGmjPbIYWYiwBg2zcwmp3HzgY6pgHDObVEvKyqj5OYF23U3VOYZ%2Bx8Pxi8Zora4ApWBB0SfFkDGUByk%2FSlT%2FIdeC37Lz5Asb2JS628GkfwCMlrPD0JNIzG8Ct%2B5f2npjKEQEdpeicWg5pldU2fwIfi8Cudvkd6%2BxBNbvHY%2BgVgY5q1lma%2FCxRWTjz2EFCnsouExMlItgmIyoCAHzomeHw%2FXFgbR9wUq6Cvn3a%2Bp%2BwRoYlr8R5GlCzpLPS6&X-Amz-Signature=0c45614648885d080973195763f2128c868920c1431918a3fd0a4d287c525ac3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YR2IHZH4%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033606Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFIyW5gSo7gCrm17CojTfpnxk5zs8dKYNtXerOBoaR2IAiEAtNVzo4egKVDg5KWb3k4Dq4NUiWa%2B5ak%2BoZTNYbyiOLcqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBFYvq3iChOSDoTE6ircAwFsCSwcxI%2BuEja2RrP3HYk50MkMpl6RD6pGJ9GuWCEVqSczdWjpBIOCea7ZQZBkmCQL5NZsEgYqpkPlf8WHH%2BI6aGTnH2voojDm%2FohzgWaSZQ5iawNIhypP%2BBYmtVFI7OGn%2BtfO8aTjrAnXiCx9kGNuS5FU00Wi6W17PW%2Fksnsjs0aOULcC3ri5kiFqEkQLrHOw2XvnJo32fp2XJuKPCvpKAEUCtukoOpu7XtTBfLXTGUndH0crWje%2BlmAGHZjTTxw1cmMhlZfMMUSit1X8%2F8x3m4mpIScwLAbAgz3KAMkCyZZnA4QZC%2BaQOZjo2cEAriC4rju0KBok38Ykyje86c1Kl%2FfmOLpHJ8L5eZS0%2B1fKsexgc%2BdFPU8ZcR4K4w4Hk6BNbMOQfvHBPwIOPZdZwvuBXQgKd4KWf44ONuv95ycjlnqOBtzklrt%2FgkvndvYLJVbh3krcibVe5sIpAUQFwIQ6aLws%2FTnzW9k1GkvlEwu3l63EQL23Ndh8f1t5oxZZY1KtBpBIsVMJnO%2BJmXf2l74IpC3CxVc7yj%2FEg6vykiq%2FCaYG6VoZrlKhaSbo7HJwFEr4BetxzdYAsUs9lPM9F4jaFTec4AKipSicfO8R6zQO8UltfBI7Ok9SrIvFMMKdx84GOqUB5qqDHA04CGYedgtQS5zv%2FavQY%2BvuTZellIORtYUu%2Fp9RmysknilKmL%2B1v%2Brh2W3AXkoYoMppHpQUDbRAOzLzx9GgNcRTmdMSHVn%2BZJnqghOcfsLyb33zW4DhURWzCYTW8SEy%2FJJjlzBPwZyxBlmMpToWwVh2Ez6YSuO5Rwp6z3dVzDI0GcyG0sR%2FM1IDVZ2Wr%2FjoidndnbfevGnXLAXQYDYFEVcJ&X-Amz-Signature=f43405685d0036c08b1240def4beb167815b18deabdaced4cf6acac4a91dd23a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466REV3T7CB%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033606Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2BZW5w12FPXehux2VjVI%2FBpt9uq8R3QcFnbeJ54hCA5AIhAI6zVDRTUoSBm8Qj57EPAbmD1BYS28DrE1OEPrS6PK7LKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz1l%2FcWfFDUuctZvJgq3ANNf2DGsRoLwog26n0oisePl3d0fjRGJ%2B4on0oSbbkRCGxLpa4np1DohokLRfoSohrdLsGqnjqGZ0i4poNAsRwOOlPcK19JD6v1whyiK6AALl5%2BMq1LYfhVnS2bxIgHfhn8XhcCHP1oJnOj%2FFIv6KNhEPtD%2F1JoKiykCntTx52dFjE0pxOFLKALHteSmVy1nBy99cFG%2B%2Fpa%2BNUdJ836IvcFMrNmIjprV5fS0vy%2B8nsSLIssIYxRwCqrCA7oBsh5sqgfkDm5gdL1OMff5tdvSe%2Bo9JpXuBnrmnFW1WkYLvMYLqRIwRkFT7tAzZ%2FKseCtvglKsNHr10ylG0M6VD8TDcYw3YuuGMIiasf7uHx2zXsyvNcmxRs2TO2URJ1t9gZRxHcwHTcRROiMk%2F7O7w6B3BydauqQwtuPBF5wE6aDgVlFXAgxG5YOps%2Byd78OdXWwryEcl7M6tAtHUYnDwa7PZXdStwdckVQqKV5Cbmj2u1RRIL6A1BvOXwKEurbtBMn4tAzB%2FlXyZUx3qkVWRR7MlNYjoOrDDJLsMbw7MkkSOpXJAkUZlOhAcGTIsoB%2BnoXQG%2BPqzhcUkgttuH%2BkpgROd%2BKSrCgXGsFCGljfZoe%2FVeCpZp14tpezqEwnakmrlDCqnsfOBjqkAbTyAB%2F%2BqTjuGZPnhzULU2rP39Tss9ptV9j8OAM3LoW%2Bo208iagBPBg1jcCn4EKDFkpcOa%2Fw97ktDUKgtg3Yj5IRqZQSPM4WK6tyDv9B3Qmx3UmkKoyePq84TkFsOES2Ttfc6Qwh7fTHMD6mpWdD77970KHWVv4AZSTIUBdKjdwhlLRCNIUth2SJDE1aKZkCGC5DMs75Vn0J9iH8pF9uALwp46Ch&X-Amz-Signature=7f9be0543e426cfa043f87edc1919bae0b15b2ca5d822f2478beaeab62fc7305&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466REV3T7CB%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033606Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2BZW5w12FPXehux2VjVI%2FBpt9uq8R3QcFnbeJ54hCA5AIhAI6zVDRTUoSBm8Qj57EPAbmD1BYS28DrE1OEPrS6PK7LKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz1l%2FcWfFDUuctZvJgq3ANNf2DGsRoLwog26n0oisePl3d0fjRGJ%2B4on0oSbbkRCGxLpa4np1DohokLRfoSohrdLsGqnjqGZ0i4poNAsRwOOlPcK19JD6v1whyiK6AALl5%2BMq1LYfhVnS2bxIgHfhn8XhcCHP1oJnOj%2FFIv6KNhEPtD%2F1JoKiykCntTx52dFjE0pxOFLKALHteSmVy1nBy99cFG%2B%2Fpa%2BNUdJ836IvcFMrNmIjprV5fS0vy%2B8nsSLIssIYxRwCqrCA7oBsh5sqgfkDm5gdL1OMff5tdvSe%2Bo9JpXuBnrmnFW1WkYLvMYLqRIwRkFT7tAzZ%2FKseCtvglKsNHr10ylG0M6VD8TDcYw3YuuGMIiasf7uHx2zXsyvNcmxRs2TO2URJ1t9gZRxHcwHTcRROiMk%2F7O7w6B3BydauqQwtuPBF5wE6aDgVlFXAgxG5YOps%2Byd78OdXWwryEcl7M6tAtHUYnDwa7PZXdStwdckVQqKV5Cbmj2u1RRIL6A1BvOXwKEurbtBMn4tAzB%2FlXyZUx3qkVWRR7MlNYjoOrDDJLsMbw7MkkSOpXJAkUZlOhAcGTIsoB%2BnoXQG%2BPqzhcUkgttuH%2BkpgROd%2BKSrCgXGsFCGljfZoe%2FVeCpZp14tpezqEwnakmrlDCqnsfOBjqkAbTyAB%2F%2BqTjuGZPnhzULU2rP39Tss9ptV9j8OAM3LoW%2Bo208iagBPBg1jcCn4EKDFkpcOa%2Fw97ktDUKgtg3Yj5IRqZQSPM4WK6tyDv9B3Qmx3UmkKoyePq84TkFsOES2Ttfc6Qwh7fTHMD6mpWdD77970KHWVv4AZSTIUBdKjdwhlLRCNIUth2SJDE1aKZkCGC5DMs75Vn0J9iH8pF9uALwp46Ch&X-Amz-Signature=78da86916b4f2c70302f22233bb4eeeeb34988b487bfa2c1dcfaf9f0e5f3c7a8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
