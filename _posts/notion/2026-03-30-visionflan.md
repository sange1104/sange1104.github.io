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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666BGMYC27%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044638Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJIMEYCIQCbGzV%2Fc0u8FvQYVUaq9QqGNS%2BLqLZsPqFW3ygj542bqwIhAP4wVKLoq6ylFhY98b%2FCeoeKhQwhJr%2BX0xORtLAd%2BMM5KogECN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwrEZF9dmLa%2BqzQgsUq3ANJIJ3IHu3GHUk3%2B%2F8MBvgNZleL5ajYSqqqn4CEctM0zDTmT8wwarUs5xY9UDvnSKd1ych%2FucS87Sa1%2Br4hw2rSeOsbXF5u8gHS0jzYJSrGEc8pKJ%2BIqY2YoV0%2F3ULAjhmq5RSI96%2BH5NfilKCI5DZag1Ewk7muYYcfHRPHaDpEC%2FZHC0AcPsLu1ljdAXaIqgIwj9ELX94mLfdTZ1gKOXbIuY5S8ibHm2%2BHZcCepF5j%2B5XC7o2u6qj9VaVzmmhJ5xH1pEwJGG43HUwtEV1fWFJdNL1U50Gzk7srEEWF9aaRz0fcZUXg%2FT2WM3cBqGhK5BW%2BlqzUeMCXlekulwTTsIqoXUSgyyRnW%2FjkzhturyEs8Mb47Btzs71x2qXM73J9Sfotg03I6YH%2BsivHJBlZpI9wXGx4XYyCJdVT1PzyTUpivGdL%2FgzdfOAChfjp5kL4llIGf%2Biq%2FLH7MU9hlriuYBBEi2%2FjwEKEfFnOUvTRs8b4iQhtLPpTlOLDYcMfGRicqPvJLOGcS2oUkGarqK%2BKwavHb5zLVSuWkjiWTml0XLAe2QVFMvGsVUqPPBWftHo0%2FHluj4q6hjhKb8m5NToanE7dis3MSBhpr6T%2B6pBN5%2BFrP09FQRrYH7iK5ZmbuTD8u6PRBjqkAVO%2BAvOw6dDQDk9bngp8dIpbNupGrXYjyrZXSocPOkKqsFSKbvnQlUDDc828CZHwjnhzNQXO0%2FuKENnPs2jCujDGx4vfTykbDgoQW%2Fqqd01Cv4oMuff3HEHSIEDWZvBxtDB2xVnx2baIeQwnXbyT5RcrgdsXcwuXld6gMkqnTZHQ%2F1yEjVsJPQJDl8kIttQWtGz2MiXmRukDJWhyxSB49SLjU5Bx&X-Amz-Signature=73786d69211a06b46d5e98e02d99a9297aa40c4c89ff5b2eabf263cb5a51c4dc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VH6G62DG%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJIMEYCIQCHkgWCgpx74g%2BqFKt1aLslzH7Nh06NavUtEcy3dzEHDAIhAKG7T0ev88c6ru5CCKZcDcOH02Cgbd3tjyXycCQSZHayKogECN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwnIIU%2FeXQgXMc%2B0jIq3AMtsBDMIXIsijrTulDtrhkIuqUXwfvyEFVDSaqirlD3hXPHqkS70igYECpX%2BXL%2BHWVW8I0YGBhWQshfkOS0UkxnxiSvLliZKrj7Cvcd84PX0IEEb2kwwU9PDh8Hxp%2BhAq4ShvnmQpAu8mKRhVDTH59aQFUbYXoxOpytT2ncbP4BzeVUFPGXbC%2B1KQUUaH6hdqH3gXBWxpKxNldGBwlXoKuDkTVyvIdS8LckPz06CEmi2YqSkP9yryH1FI6gr4bbpmOYTFlaoTtT3CK7FbAZVPb4qP5ytctmnJfDBZwnj3J0fOWZzTaKovmXuPDoNkn%2FXwxkv8NlOWxVPL2KI%2B%2FMJkolzopFbBBANQ0dA%2FNV8ONpNd5FZ0k9It28z8S1f8gme2MzHKNqcekO5O4I%2BJwmf4aQ5x%2FlYn0TXzYCpBPb0sxn%2FhIi1NvChDVrtfLe5BccSm8DkzFb7F7I37aCKSCGXUHJC9JjBB2fkuf0C%2FmeghM1NDH87p%2Bgi8wCL%2FNSphNI2SldvU0mM79%2BMWn9b07Lx9zxgItguIBySClc50ZiXPs5E7DAJAntbZvk5Qmhuhh11biFtrrixzRkDEyCsmbtVxaaVJcRNrxor%2FSEYRYMNwFFXslHPc3shkfwgSTw%2FjDluaPRBjqkAbiSD2ePN%2BVIiONFYC5KSpKgGv%2Bdo3aiixnGnyQm7c99iiEbcJOiaNiMvHamKKuNEFHynJjFMfwDxSbrXeda%2Bktj7EqZGaZDyT16iuferATQwrnIIUvAFARyK89m6u7yHyy0B0FKH0j3zvdmhaakoOC6S4%2Brh79ZljBhV0aX4%2BeXEEsSmOc3zyfYsCPrSHyczdEYsnVXjDmy4P39alW%2BdLYznCGR&X-Amz-Signature=f3c62312a69a42765601249cb07ac766fc92abc82765af774871f337c3ebe606&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJS76BEB%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044631Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJIMEYCIQCUXcaXH2%2F2%2BvpZsUSGlViUTQvm0%2B0AI6BZLI4qAdDfzwIhAPAEALShRY6dtbN%2BLqJ3uSlQXaisHPslUW5ibqnq2kCfKogECN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxP8YRF9PBuQ%2BiC37Aq3AMVJp2TwUlTnlR%2F1lrIJ9yP454bnvOu7AlZsAgrDiVXuX6cvcOwQ7lZJNMbMsFTDEsz8GmznVe%2BXrKcN0keyezpk1dya9Jgn98O0vzDjrVwqvL48%2FSOPPJC45vQvQrqkQX5l%2BwPcoKmEYZx3Rewqu35akZpr7df0NeD7IFuKu7yfWIgwI28zxH4BEa08rkX2M3eltWIX6lGPt6G8yXwHkqdclMy35OWlvjOrZooSzqWSxLzlxql5yYLTsGQW7jMwNImDHhUM66IwqfAXo02gCyoY%2B%2B56VyEyppaOORpk58%2B65293MxYM6XxFp408g69gd8Irlggprgz5B70tpmfMJ3w4hgsbUUfjeBrOfqKhw9BL91KqSLPJiE88cXkikTuLMOYuFQ%2B44On5wIBDCfKXukd42rgxSahIC4%2Br4DzDAwrUiEUnhj5oj64ckF%2B1wygh8dH5nhumMG3BHXdfaHYEXW%2F8ipu6YurZne8os4giBYnaXNdJUYvbsgY3rLdT%2BOkvcQNCAOPABik3qPmWyEuKf6JroEjuuSmneINQZ%2FsnWRqUiL77cm68NgDhuuRpEGBgokXlYpVpp6PWu6EiY260hRUwBJI5vbIsCOzei3IaM%2F%2BbOX82l6XIRn1Nn1IIzC6vKPRBjqkAYtM3cEq4UL5CJK%2F7bRIqI1NmqFfmNxb8XJmcm%2B6hnUrCJZiLMuVGv1IFy37cFuHXFA4hYjSO1t1bz3QzAK%2Bti4H%2FYhidSbWeLbZtw1UFKp1rFKub7C85WaRi2yd%2F00OK6zsnon%2F%2BU4KTh5GL%2BgXvrHI8agKcXaS56Z4kkyP3ssdbpVg8WvL8DnSI%2FAdJRBhetQdNJpq9og3qNgadt%2BUZ5tR1ip0&X-Amz-Signature=47cfb5b51dc20110b2dbc0373dcf140706dca4103fc4e2630e981518fd407497&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SEWBHDSN%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044650Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIQCvoYj6uLG2euSWyo634%2Byyd3%2BucODtVyLA8RE2ZHjuzAIgfBXOYWZ63f39P1X6Axwoe1tVzt5YFoAP8CNYE2tJsukqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGwFs%2FzSO8blqJS8IircA%2Bk6PEhwsEcT8U8njIHU%2B%2FvhFBym7Q%2FDqzRAJGWLglkUPgStmNpjU7L4g7Ft1uChnH3oB2641vigmW08wlEjDE7nN7N6hMfnRv4pms1QLxAvX3i0Vzx5PeexI0QuDthGV7bw%2BfKo0%2B5msYN6A3TTL7bM23ip6FspF%2BscmK1LtPc378soaCLItTJ%2FrU2OsjVR4XCJ4P7KeS8ND7XlFcA%2BmXmgpJ3R5kMMnaybHEBLcvnVrRQxaMEts864vu3Tsji42eErOVjLjTJiI9JuewpH6UyPrWXXWQjQlja2H6E4%2B4znBdfD057iuzeldZ4geATGyRYlY4anYAmOi26YD2dejVrP9sXdU6vwDYGrhFU6urD0syqeYA5mxM4UsRrtRHoPj%2BcFgQZnB%2BiU8kHk2TWWGb027IRhkFwvwjTYryUYVDFhfHsOyWiGzMo9X76mX8r0UiExH0N1%2FgbM3ra6uvHxqK%2BskW5IKZIw8hPrXYJFlN6cPjIF%2FqsLdZyVlwla5Jhx5JAoJ%2B9T2rugG8ohj4yebuE1vOSD54XFLpLqdY6wu6sdW8eKHA1sP7iKicE4Kd6IgFdvWWaFvNSnEogaT15SzDmECIKAaceh3MbLGXor8O8IAUTJLVZVh3dlaUHgMJy6o9EGOqUBBLpuEfhLjuYuluv4vFCRH4xauIVU%2FyybFeN2PPcY6MffaZ56uySmoSwRyaDEAPcz2doU0maikxj0sKODHfMTAZbPM0E1x2VeEDJOWZO8bI7jy0%2Fh1Vt5RgsXYZiFheOMYEzXldcyKwAW0ddOEJB0XWMHX3FqI%2Fjy0Axudan8Xraw5nXA95lvPtlnVbfl5500o4uhZFhxPgVnQ3PKrmEY5F1ZGcyD&X-Amz-Signature=061905c4090c9ceca5ced9f5db32a52f6a990921d1a4972afd68b22ebf81edf4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666RMTIU2N%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044653Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIQC3wlvXXAzFEdCncP%2F7cZqo3KbsNE90Zz1VWazRRaoeWQIgDqUEuV7AnudVZEtM%2BM66G%2F1XO%2FzPtH75qbpKg76zFPQqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDI9W9PV6ZPz7EQebqyrcAz2ZTwSMiHGgED9Xhmo6CfNqAAZua3FmnpntCisCWLLk2bK%2BCC2Ac9Sl87oDpIpavwmUkVU7qqtyaMioNdPzBJVnSFwLYr8scLC4Itbn0wwcntVsvVbEDSmjQuftn%2FYn%2FzozVzAoc03sFJHhwG7ci3MUppz64yeY2HmDBS%2FyHzwePCKQif4aLvdU7Hl9C39hweTB76W6h7%2F45T2TrAwscR%2BSGzFjFG6rU61f4781DP1IFT5hpRYoJtqEn1EZruBJCfhHFv0YugjXNW8VuXZV7mEoRgvhv52pvWKsP1KNBDOPRU13cZwB6W4B7njgW8KHXNnXhEfaF%2BoZC%2Bs57QdXjvJ8i0vgQYukva5xA9i8Agp0ghI68MkQm26JWUEC86PGHlkKZW3DsKV2HoWMcJSiWc02DQrFSJfcfy5oJe7R4qY2gX64pu0BcDZ6XImjKu4Mnz5rL3A%2FMJAfjJd5YV3fG%2FdQb5L3KdIP4w%2BZDWTzWB6ELxqObFi5PS5b4tvC0lb6BeERVNVOeb568x8PNf9fC%2B3QyNt6PhZmh88TRGk%2BKFGqsgJpQddFqOjcPUh7Zx0EUsCbO%2F8f5Bv0guEBHbm6gq8mTY%2FVK3tyF8TT27wJFi%2B%2B1GdelSU9sbDYOwSIMPO5o9EGOqUByA728%2BMdPMjPF88sKuejGv07SKZqiq2%2Ff8qKMg3Mt8ie7%2FyEsu3czAkepZ%2Fhx8awWBYhIO7qQUDp5sLwXD0eNu1LnIYRhXJLRerejitEfWJacYJFPJpDT0DKfvMRrpEn%2FwRMHIkBKbYDalU%2B2nci5w5NYqzsBoHWsIcYXQ3sN04jZj%2B5NJMxbyJATJXBQhGVUWkxSMhZZKn1y%2BbitFPri4YkNMj9&X-Amz-Signature=7929351a0aacfe9ec46da8325d2be6bae84888b5eda494d0b192bac1d8ed0be8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663FVBBKEK%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044655Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJGMEQCIBka5JWBa9u1o68%2FsVfCc8fYmSNWWPgQR8b6RbuN2L%2B2AiB1nvEOJ%2FyUmX6uddOII711mySFVnf3PRhEPEby1tnWhiqIBAjd%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMQ4M9pNGvprqbZ9rAKtwDQNZqP8QVO6JfInLbBEXV1ovmGYwnkYnNFcewViDtiu6H%2B8sTdXeM2%2Fjb9GoORqhqfBEWSTL3Aph%2BnoTBEoLcOaVgBK%2FbY%2FVwxMDVsie6KcnoRxXS83eQyK1RKTPJYxUTNvYt0B7pItoFFUVrTqJLjegD%2Fgzx33ZjJpAXnG9Dil6%2BazirA7FOti2Yb5nRXgZ7mkQrzbg4pwG%2Fo3W6ZBgIddpoUVb1%2Bd3NphEfRPka7LFto7IicS2qoZKslz3tyDiavrxKB%2BKPTEO2RVjN4QcMwMBXYLQCAIBmR5jG1HUjJvn4gwMvppMduA8rQRR69bvYr8MLbam1OthutEiLPgQs6X19n%2BqzEj4Py5k7Ypz5RYPl%2BeuDKPCcW49clAP6kZgtvh2D0e6ft63niE5Q60fuVFEONkkvmkc1CQ06WMAr7VpUnXisZNeJESXRZbcmG9sf3lDk5Dvl7FmzUjzJHzdm2DpCLWQeYAALTu4Thk0UR6jYYZ6tFjfhof50LBtZap5p3T6TwfgFrj6ZyyYphKCQ8%2BqvZwhJ5C3i8B8EOVrNUTxwLmjk3ASdC1vqQrZxXUCBoFNEHES4WusTD0qUdd9PsUlFA%2BZOZ8a3glhWMmW6NHcmrmSDwEE3y%2BDYAYAwrbuj0QY6pgEDaQo9KVbKnTPNMAqMKD8hzXaztzaSMCXBtYcbxxeXwNsIxBXRB5M6wlaDKXH7vuaCFpng8ldoHbDmPPU%2BXNGe3jYaiHG1rxQkCYmKiXcyalxMjh1xT5TiiB1ty6LCf87%2BhG9CJ0q0XVtrLfFIO3XSrdHteWeeDMpXCF4uat5VW%2BybITRdu1oQ9W4V%2F%2BR%2BtFG3ihBJj8kVv3i0m3EKCTN8QdhWJytY&X-Amz-Signature=64f26e34090596a36a06b2fab67ff598b6af11a2c1b150fafde1a94074f6dd1a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QDT23GX%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044655Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJIMEYCIQCPIK35ymURiAm8CI98sOBHj3KqzQ%2F9N8mpJ3eYBztM3wIhAOKE85JK9TP98MVf41RE2GFvISAW5azfke6K12vYmUK0KogECN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgywCjKFsQ%2BNm6IHVfUq3ANdNh7NalR2lDH%2BsegY7nJPD2MLlYCtYI%2BgLTDcCKCVIZbWeR5ZHb%2Fi0ou0YJJ9mzXJ7prfzRyBQVK8d%2FNvlN57NkDxnAK37hpxt7ASsw0krc8o2p5%2BLqgVOozKStXBGFw9DAd%2BGV8rIP5eu%2F5gkMT7I%2Bs7LjVPUlfqNz6bP%2BrXUcIbSwRQedM9VTlOJhpgxJebquh5XA%2FTFALBz8IIl0%2F21UD22zgXfGUujvEFMP6S0HohbuPgLMr9W0cxHqZZvPHwt%2FaHE%2Fwt5T2JXXGXYQZiq2AmG7VJsB2ZEL4BW4w%2FVrUB4rgUpf3DSL0unVppE6KTgDES%2B6%2F5HhqDEqgloU%2FHmsBD5Ld%2F%2Bq%2FDLE5iErHq9X75MkURFg4lg2sn9OVGEAO0%2Bmenhaby%2Fdaz4yMaRTy0Alsg%2FdhF%2FhoJ0z4E7eVx6zel0G3G9vG0r15oYbxgNL0Qi1Bt8S7uK9KPb8%2B3Oy7PQtDbjgIY26EGmX2%2Fh8aiaainCTi4DnYoHF7AGGC3b5WNIDnRQYtcVUvPi6vDD%2FgKgR9Ixf2tkVI75j31Yqq3WGk%2F5AdAN4mntJcbePRAJU%2FQ%2FVPiI9H3VLLFvwpccIYY561y2uvWB7SQmcIpBCqtOUFMG3vbs9QGwfWlOzCGu6PRBjqkARqtqtNsoYbd8L%2BuNTWaIQvLDXTEbOoXLO0kDxY228hOyERelVFPLayADNngeaMWiUnKXmwxe7Yq%2FpiP8rH0ifGiEelOTRXycUEe012tl1rZYP6x2UAIicfmihwaIJSUQ1cwYCGlymt9pdsNRGDq%2Be6fLAe8lenr1T5hKASW5SgT%2FKguvLhmCnGHkBsb1LCrK8%2FA0LlCcQzVWO2POU%2F7RrEp12Og&X-Amz-Signature=cd1f65d2a5f8f421a478c16f6aae4675b3fad1c85ca9364db3cd93b1f638c142&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UXVNWJST%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044655Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIQCq7kzTtlZgxulOMcmM1ihWQl4ix2qa0h0qRDVwUhPyqQIgSdt34QSClQtjYXPxMYljYv4Q%2FM9tnzAeDHOJV0mboCAqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPOcSzv7KHkv3H%2BZfCrcA%2FBFqs%2BBjs07XdHkvxQ0iNAzH0jxUOVhzBFj29fVme9fKmOOvmwUewelrjyMBiKBn7mr6Zy59g15Fntm5nwMiuLZYU1lW7weWhegRxgwORE%2BUKxEsvL8zytFfci7TYnLpneQkhflD2DCrTvE0niY%2FQptRGju%2BcOO3Ug6eol%2BfPECqr3agCiBkpF4u7Jx9otOJLuZhOyZyL53Xlol7Ch56SI%2Fde%2FWgg3RqRjmFQEDczKZfTNVhdrjOpiW0SBxR4qw3ad0zX2FiJMJY4umVUxxCylnrCgZW5%2Bq%2BFrGG5gUH7az4q85rryMcIYFpL5RpqVn3bXNUvNS2AuMh%2BTHOFZndiBsxfJ2fAw5PDWb6ypaH6PxNfw433WacGpFMpNsESbkKADKn42jp4kIwmkSdz8SGUexNxJ1QuzWXNgYtQAyJMV2jpWUb%2FdP1rCsfWpAzZ%2FVMSbjenXJHnUXF5Pvt9zOWiM5zsPfzmk8b%2FMdkqvoOApBfLRMXQ%2BJnInxJ1ZQsKlhQ4pQq5ZII0TNURd77cn7HaJKxwIGgUJ5wJaXZanKrO985NcapnkKR6t2MB9Cnu%2BJ6VdBNWF7DenR5MOx9KGMgBVFuOIV%2FdiPGtP8FQ%2F2GkNHg30GK1LGdGcRwcwbMNq6o9EGOqUBvoIUMyfDxSOgTqM8DvKqAj1bMMTBjl%2FmjCNg%2FuLOSRM7JE8aUp5WSDloldl22EehTAEi%2BFibv4Qh6yGXhx1gFMGmDieeSGQf%2BjAMVe%2FAnaH%2FcuBSnEq221UHW44v42cuEZCx0cqDTUYF9tHwLHcZWkd8C3b1jJ4mVxEElxy061ugkxniJyKzp6HZDzjPIusuKK13RTkoffYUKd70%2FKHT6KbS8fLV&X-Amz-Signature=80d5ac2b170e184ae4b70547e12bd4d4361c3454c0fc9fa1e8708eff37c14647&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662DUZL54F%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044656Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCICJHdeoFVLm2I9VJeX%2B22FhhKOlxXaDoZRvfw%2BjLT0CCAiEA34VFiB0ZYfWBvPqG8TyI9Vfos856i%2B1mYB7kz8wbbxIqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLRIqMvcqjHbyPN22CrcA6uzRleVo%2ByZ6ewD9SGwbmbo3swDCBrOoktL1E5ZpK7TTIrZbnLtbDutQieHW9iR0q1aBV%2BvEvC8eDXLDPjucOoj8imsOpOMuOh2H7crgMUzZQeH7II57rUbgJd95oIHDtaM1RkHZ7uWHpNuijysYc%2FuULBZ6HAsaqLXRqM6z4%2FSAsmY4d3A7aNAncBbkjG7vWQb9rJ67Gj61Vi3PI4hN5lhBghSxJMDW2KJ22UWfdB2ocFLLezYVZyAiVV3ANgDKU92BEYnnMtG0BSZD65sEc8hdUzkkyfyyEzurjVLW4jwllz%2FdSSOVtONY26NJfqkpzKwP5o14fb1V4RNDpGCzJrg4J%2FPt%2FNMdkOCtCBJ0UNTV67cocjMWTF4eg8toRVdkAoluJ4ECeIsTfaReUh8jpBnwWIwKIT8xxS0rpvFwVwgp9Q%2B6mhPn2E3NWpWnjI8u1wrL1ziX1xTvQ5QQBCCQOD%2Bz7QjATGj%2BEO%2FRpiBvlJS7Mk5TjT4IjgAW7SjMr3hopCh%2FkimpDxzxqXyeaGMKCRZsZuUV80DpTkma7t2tojMe3Q69%2BFfnmU4DuoO5BP2kTxA2sxUh3nWj3IS9Q74SFaX%2B4wS0qyy%2FY1T%2FbV57WHGBUNEjHKGGOX7bhiqMNO6o9EGOqUB6CM2l5ABcF61DWRp7pqbWkS4Gi9OJK5rFOCRs410nXO35PCQBwR%2B0p5G3ZEMduAyObOEW7Ga58wQ4v%2Bv16F5Mw%2Ffhc3mlUvx9Sd7RyEjJfgWi8y%2BqSHevYGrDDHNhAbiCDGUE5ITL6bKfEP12Yo4DG91ukwTUELxrbf%2BnmQDG51gYaeMIDL8Lri5oTaEY5Z%2B8m7QxERGDH%2BxIULYtqDJVEB0exMo&X-Amz-Signature=e9509d2ea08f4c569d2fc593d066c80b983bf3c95d312bc9ca842887352a95a7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WFUKAZVV%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044656Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJIMEYCIQCW%2FwbGV3W%2BH80vX2tJTCa%2BpISDPDPGAetJk868pAGQSAIhAJM0BIDWXOfJ%2BwINUGrpVgUzeJoMQO6J3PUOGO6xFIRRKogECN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyEWXfa7Qzuq0kbYIkq3AMwe4Afs0oE1d8pJCXhelmbcS%2BsdYy7Yos5PURvmkJzFDH4i6FqtKeatJmgleKk2Dc2hyHuFslQgbb3FLgreDRhRJ86w4i3Eb2v%2BJX3t6FQi36pnRZti8I1%2B5agKk%2BhPC81PhRymFwyjOzXUAv6ntuHGY7e5XTzw3k%2FlyxDhZ1qPExYc7Ry0btmxn9Z%2F8JI2eIWMUVHuhg%2BTJnXyeTJ16Nvp%2BCVM3sh0L%2FF8QE4ngPrz%2F%2Fva33rVy7tuAyoy6pkzbhgNYB5FJewYaGFGs%2BnWyH8aSjMXm8%2FJTrzaTFfqxTH11M8ZEhNMwHJM97MkfzsW2mawCQAIZ%2BbYxAwYe3%2FW1GM5QYf0dn7dgv7IlJwxQfx%2FxGaGYAUQAPd5UqTYRxrfdQYmJJTv%2BFWA8KWCYYTi4r2377NoWHyRP5PoHgQgrxw3qIQ%2FuehFJen8koJNycqfRNPjCIk2vnyCUf7CZxFRwaFXdVf1LXxbDjSOcr40R4T6Sr5vwIT2A5Q8lxjt5mLdXK1YwzljP7eK1jze%2FwPXGZjz2hpFhGGu%2BdaAjoVPauwN4xC9sTGWJpyFZYtmpW47FerbTrK8Ft37Ux45lugLw90Ni8Nu0woQZb9htljME4CDorGNmAHYDC92FaR4jCUvKPRBjqkAXlMT1E%2BMjh3m0PSpEJSPgQkRWQUb8Xv24Onk56p4ez0AffkQBO1tcgWWuRsG8%2B0J5XFNveI2HqlNQutzuOy45fFkypkJWbFPYwSVTiEE2WccdrNtpA%2B7mF2NJr459RNMArm4Grifuq6ElnKPQop5hcs9QM4mhxGqkCdyS3%2FsjsvfB0VwWNTm%2BoLdPkkYyJP%2FmP5%2BiiUIvOIENH65DNg46coEDFV&X-Amz-Signature=3d9fee98d6d46f77bfddb2209fc5dc914121b3d3bb5a7f4095f14a2388d1ee87&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666NP6SVWA%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044657Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIGpRGiPk%2Fd5%2F2Ap515LH1eA%2Br70NK8nRQXDcNUOKsiP3AiEApH77%2BuLQNvXVegA%2BEuneATCaVur2LLlr%2Fbw%2Bh6l2jP8qiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAXzAVrcsF8b0k64PSrcA8wsrDKyXvnzNePhqdiFW3q3ltxbwn%2FMZlNW0tTJ8TICU88LSvFNCosHUOYWftokGssefje66hL7Ixx0zIcx4SMrMI28tqI8YGTccZfFQ9e%2F8d%2BSDky5eh1pAANIJEyVQdTAZR2TfuTNjPXhtr%2BoHChWo8UE965KHm%2FIfypvgk8JipeCUjNljInF5GcxyUUMG%2F6XR71O7BEadHBIEn6VdBato%2Fz7wzqCJRGfGAh4vRYpJLiw9RwQLLNmXLYpv5ff4DRfgSBcFIwT3VsanPgATCDJfQknvia%2F1cmYmsEJnQus2vHbqpsS9eQ2ZRWbmtitLccyfylrVahc0FUDEMy%2FdBxUPcYt3fKNLpX8fXqTgBKX3SoDZwD%2B3r82ASjrinoIXrEEiQfSy3Dm%2Bj8t9cARXi80O0nGnDE83nIgIV%2BBSI7f8JW8hkGCvjAu%2F%2BmnsOA%2B7o%2Fe%2BXyDXt44NF1wrigdA2h6k4aMSrAuf4YazLMoKClB0oY2XdYuhwMcMaC%2BRlFgq%2FEhwPis7qvrep4JgFUDMyHnsWYaRnJvv1hH943yQNkyBtJGn6TYtPDNPOPMmewqWZWqsDFovk5sr1cp9B4pZmotv%2BEEESTbg%2BTyP2fwdW4T08vY9sks461QfNnkMKe8o9EGOqUBF%2Bn6c%2BXa8iG2q0ENBiBLuyDCAxkJ409K7xIznqSBnq2OGVOnTikEwP8fuxUlQTFfuevLuFaZOD0SJt%2FKhapMTA8OzFefqo%2B2b2KPNSvoAF%2FsUd3NX5Y4xgANUQ8BQVbG8%2BI3eI2c%2BuInEQ%2Bth4AzvCXOyZ6HC1mZ8BVFpSPRgF8SqO%2B1OUGSrrFCc%2Fh%2B63qkokLuapNwiYgHv6oVEeWS4dBpUFnj&X-Amz-Signature=37db2fe05123c6787397b9b3155f4e32511005b8e8020e48ce3481b283e2afd8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663UGQRDXU%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIAJliUMHZY2YRyUdpH2QSBwC8ISr0DZv91fcNHav%2F4NlAiEAt8t88qgfNBILd5RJii6k7RSBE%2FUoR00c%2BMmwXjcMgyQqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFmb7D98BLCZLF7vEyrcA2NKWGGLwmBEwDb8SzgS%2F%2Fu2KwIz%2BoXTrpmDJgqqaa3fdMqBrpVu%2FP1fKpXgygaxXAwPqegUuquFrHjQ7BQcksuOekr%2FkmRp995muCILUZaYi6m02M2vjJ2RAxSR0zbqFNAmrgoiqWvX8aMk7rpK6YyRHnVQBAnZYPCXwtSzfJ2FmLNKApAh9OBNyBtsKc4%2BNr1hCDDpZAJgnBPHi1KdCOldpKqc0sljdhg28uJjpNJWta2qGOMYpOrvXTTz2z0He0rm5HcGcT3jHI4S6f0Z0J%2B5phqYYPuH%2BvsKORKX1pek37vZVHWOaBUtepd2rdh71Vkuq7fuKW0k7bh0a1g7cs6zikAlUI7DAOqcxcPTjynfBXXNKXFtLPjskcE4Ze7P8nz6vvM7I2LarKs8xDWouaCI8rzpMGsG064y8ehVxbc7dJzvBovTi%2F1Crr%2FCW2Yyi%2BqLgTqPAm9jueCG2AuOPLG11SOcIeKdkKQn93M9nnW5rVdVwNOgb9HxgU3jCSDSaeyC4E9a9pNPtfzqCf%2B3pW24shblkeLss%2BmVv45Ruvnvc4rb08PF0djyyYRJsXBAXcPBDwivQwMQvBt54hb%2BwiGVfCUkeefJFmaCxaEDUyRaMOyZBqyr1Lm78o4VMNi7o9EGOqUB00PzUYHOE%2BpuoXS5klhsIF4%2FTmEvtosBzQyItmHg20kTxs1zXWfPRiwOHTGpbvv4u1%2BHfjDvr4mz92T1OJkcv9iYy4H4bs%2Fg38fFkFEMIXJAu%2FtTmWHhaTDKvqRhtAlsETjDhGmJv4wnP03ycbCOc54yBuEKEq07AJs8fBphIQyIB34OMw2teROVLHjP3u04V2kUsZK3yIJnNK%2BB%2F8GHUogR15Pa&X-Amz-Signature=53c87bc549d68e4c0f1f11d21154d629efd99852820ecada9897e334c109f9a4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WSZ23DFN%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJGMEQCIBS%2F93bKTpJfUcpQi8JI%2BMFSgptS%2FgWUKFDC3z5Ud0jbAiBgn%2BYZ4YwjzWb%2FBuLs9ta7%2BKpUfYtJSMDQiAz%2Bgmi9IyqIBAjd%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMyzeSGLZoiJf7llfzKtwDHFQ5P%2FWUeZy2uzd%2F42H08y6JQZsKzJCMhntfwUB4skHcF4pJXvXog23lku%2FJKVKs14GIgBXhfe%2FKNjByYY%2FZi%2F7rwCkmZmy8jAQo8dJuo7nF4gibF2e%2BDAL9Amq9HoxV7gHl2Z2XLBzW3f8canT0w7J%2FBDpLfWX8z4%2B6yqunYABtfVxQ6J2Iv8z1a%2BAnWMVNUwtV0e5Uhbbph2gjVMfpSzJHNj3yQcInuwLZSlkIQpVi%2BnzjB3kR8Of%2Bb4mkPFRYCu74uOKv%2B%2FwF1WdjtW%2BtUcvGZVOYp2aPmiENd6WL9KJC0Tcf9hhkazEi452FqQ7LOYyj24IoxHIWG27EehPg7dPi7YHbX%2Fa37HCvMrCWBE5O0y5Xa8ZyDsOovc1BJK3qpb6FfH4v5DTQt6Ks3IujsS7A1Gw580C8J2MDJQuOeEsz4VEONN7ksNzCcbZL6czxCxC784ULX1xHiQGYUt9OTs5UZ38akwVyUQidY4kkNcv76TeVjP1K8a0PIaZGMK6DpvK5xl6xg8AErEM9q4xTSwnHiKvLAj4WgM0cGvd3GPk%2FQi0tJfrvF9zkiK6B%2FjMRkE19Dr20lGSerlAmUhBGK4%2BG5p1MZ9%2BACOXF3glxqb%2B8LxRe2zfiqJXgKM4wtbqj0QY6pgEeCcR4EAlJn4vb70LxebXqs6wOr2wpoBuH%2BpZnG8eKE8YCpyuGG2Vm9hhKT5pXxr2G0ezAE0bJZW2vf7rPdQ5Rif0dKP4B5glMpBxMk4%2BDBivqjB%2FmKARReK3HDqHxD2wE0MKC5Ly1m8D0k0rmClwSF%2FiUOarvqwGZQ4q5apJ%2BjHwZ1YDdEhBjIsP5uw%2BAWpAI4B0KaGxpOu4U6%2BXpMVh1xvTzYqSf&X-Amz-Signature=a7a2fbe614980508c40c78c4b826b2ed9559a0d0a102b01f8f0be6b84cf543bb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WSZ23DFN%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJGMEQCIBS%2F93bKTpJfUcpQi8JI%2BMFSgptS%2FgWUKFDC3z5Ud0jbAiBgn%2BYZ4YwjzWb%2FBuLs9ta7%2BKpUfYtJSMDQiAz%2Bgmi9IyqIBAjd%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMyzeSGLZoiJf7llfzKtwDHFQ5P%2FWUeZy2uzd%2F42H08y6JQZsKzJCMhntfwUB4skHcF4pJXvXog23lku%2FJKVKs14GIgBXhfe%2FKNjByYY%2FZi%2F7rwCkmZmy8jAQo8dJuo7nF4gibF2e%2BDAL9Amq9HoxV7gHl2Z2XLBzW3f8canT0w7J%2FBDpLfWX8z4%2B6yqunYABtfVxQ6J2Iv8z1a%2BAnWMVNUwtV0e5Uhbbph2gjVMfpSzJHNj3yQcInuwLZSlkIQpVi%2BnzjB3kR8Of%2Bb4mkPFRYCu74uOKv%2B%2FwF1WdjtW%2BtUcvGZVOYp2aPmiENd6WL9KJC0Tcf9hhkazEi452FqQ7LOYyj24IoxHIWG27EehPg7dPi7YHbX%2Fa37HCvMrCWBE5O0y5Xa8ZyDsOovc1BJK3qpb6FfH4v5DTQt6Ks3IujsS7A1Gw580C8J2MDJQuOeEsz4VEONN7ksNzCcbZL6czxCxC784ULX1xHiQGYUt9OTs5UZ38akwVyUQidY4kkNcv76TeVjP1K8a0PIaZGMK6DpvK5xl6xg8AErEM9q4xTSwnHiKvLAj4WgM0cGvd3GPk%2FQi0tJfrvF9zkiK6B%2FjMRkE19Dr20lGSerlAmUhBGK4%2BG5p1MZ9%2BACOXF3glxqb%2B8LxRe2zfiqJXgKM4wtbqj0QY6pgEeCcR4EAlJn4vb70LxebXqs6wOr2wpoBuH%2BpZnG8eKE8YCpyuGG2Vm9hhKT5pXxr2G0ezAE0bJZW2vf7rPdQ5Rif0dKP4B5glMpBxMk4%2BDBivqjB%2FmKARReK3HDqHxD2wE0MKC5Ly1m8D0k0rmClwSF%2FiUOarvqwGZQ4q5apJ%2BjHwZ1YDdEhBjIsP5uw%2BAWpAI4B0KaGxpOu4U6%2BXpMVh1xvTzYqSf&X-Amz-Signature=a23698ef691f969cc8d5e31b30db36b114286d9fa5e5febc5000b61f2269ee5a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
