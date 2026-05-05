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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WALCJ7OU%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034929Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC900VoxhdLfVXeHdmcdM%2BFknOkJoTm2bMZUSbdaK4Y8AIgWhdGTsXC2q%2B%2F0uSHtllNSgrr4cVEmnvguP0vFaVWRDsq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDL3oNBbN6igCKZ05HCrcA9BG8SHJkQdjgiPSYtfDHtydGReucEI3SCaGauwFcKRejs63H5Wc%2Byotx3OWYpOne9otbailV4Rq77WGgdYWy06Kvkb3RHNZifG0uYVg7NhMKOJ8s%2FjX8iA0rqSfbXZR1NzYtg75EPueERL6Ju2gR7kpFO4jDNEIbJ5RUsUAKuC0M81muD7hcCLBf%2Fz6aHzK5uzgkfaowWLx4dOmD7vE4%2FVT8PQ5b%2FCANaTn1jRAa4WySPmlvaVRD1KTJFobDKHgX0W3sFZaIa3neGJo0tMk3Ndst0XCcERdV5PYXiL79%2FydjuDtbkbTCV4VB9ekhpZpfbmUR6AWfNMyunomoULB9aU54ntJO4UX3LHym2FGTtOuq08jLu%2BD5BGLHeKjNv1TWxOT2tXm2RQ%2FLxeHYBxad0cSbqgvcu1eAQkCH%2BLB3SaNF679EYGzVxI1Tka2gKrJcNwTCbNtpXRP78F3yckCtLeybHR%2F7VuNTGOj233hQSC3q4sRreSZ4IgFrwrK6pgoFCkqm9uIK%2FV2z2lSFbRH8KhCQnQ8hiC6uLpUk3%2F3GY8SR3z5yhTzlR9lui%2FrsiL7qimQwW%2B2DWtslYtFQUMZhD1lkPbIis89Lfpl%2FLl0SHJkBle1JOZkP1Fn435ZMLSm5c8GOqUBNoGJSWD%2BdVmB%2FJ3u872c8Kb9bnzcOE%2BXdkxmNkraKiR0hRqA41ILER1KCNCQpfiCfUetVUg1CvdBdAMXFe9hLD4TaJiGGNF0sjyESsAzPsu3C%2FaEwsEE35%2F7T1xgyw8f9udvC4s78KcVHtbrPvEb0JjO2spVbEz3qYrH9PYbtZN8Yk35vOKYJ0JjI%2BLkW9MYQhE%2BycpfXkaFWpMc563o6%2FY%2FIS%2B5&X-Amz-Signature=23278ea4e1d750444aeca1da73c20e065a4d3a4e21186fe33690ab8ee17d3f7d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662CC54T4P%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034930Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEQaBxxcPdcCAd58obkMfeahGJAcqdvRN03dADGTcUhEAiEA8hzM1gkI7gR4orHDYwkBf39xhK6gkKFrB%2BJU1yiJLgAq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDDgOCLuoughC%2FPM%2BLSrcA22VLt4WNCLCfFGk7wNAczjryGnFAN23TtTtjm%2FS5m1%2BjEWrA1%2BVITgjKLNUpwT0Js0wYdwZs5ZiCw1lTlIKaDyzc62TOqOMJGXH%2FKIcuDcYzYTn9ez2i7Ov4ejBTAtVE7CRYAUSqsr0PpTCJL30wtw64m14SRbJ7zJADEuWEBPBSaAB7PKdp7%2B1dWVSVE3CrOweL5Z1zM4VHrOg7m5tSEtAHFTdOtY8ImJib05URPZxv2ZBzthp5RPaOTLDrkphB0OVaVOstOBb9EaE4oqnVZi66YZuEijaZM4AglWg9V0AvKxBnvUoWZw41AWMV1J6McszxgwNIxaXU%2BvuWy5tCJxJqfd1hL1tKAcikTOBUxn00IpQUIpH8AlEIS4TNAETaGImvaMYlAxm%2BLdovOcXuO4hPgPX5MsL3Y42nVcy94FGNSmQk49YcgzrAyrhQMH58ZucXSX48ew7mtKw%2FlItApQeP5LU0y1h7Oo8O%2Bn5iwr5sZs8cXpQGf9bl3RGoFaHNYVyX3DkBucvhxp7UwZv9QgmFJHHSKhgw3gtD6DZvMIpu68D49FCWgNjEI%2FDkhFfNAa6j8tMu2tmJt8GgJlAc2ABtVR1wZWbjTwQsViluc%2Fb1xzgN6Y5I78%2FTcG7MOqn5c8GOqUBO9%2FrHsqcO9X1faNoufs2tPaKkS%2BYw9%2FKZBZhGtpqtdaOE1IplRAdGNXofRdZoNjx2bESv5xOrzDOPSdvW3ycElYIM4rLlwnJ9JOW%2BznFs5dq%2F1rHbeLQnjvSrgTfpvNk1tvHTcbKp9EwL6Y97QknwhTtW3sRnGX%2FzYNCNN5B%2B13UoejTcBt9BPMEQNkKEA3ve%2BFLT%2Btq2rowgD65N1h%2BohTiX7NJ&X-Amz-Signature=88d33142ccce0385a94c8252139b1167502751d294d5eedfe9902c4b5c0f8fef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNHODM2K%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034913Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAwvdo%2BPUIALkg38poh5ERJ%2B1xfzzAV0SYeDWHJKj0k7AiEAt3a%2FNiznwkmVrJTOKG%2BY2sx4cc87fFVAmrl6ORnKUTcq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDAV9muySPu5u70IF5SrcAxgXj9psN5VZLRnWGq7eL99Dt6H96MkrD6i6NI1zwIA8r%2FOdWkdDZZob6sm0yDOqG%2B3fSOnV5TE%2FubvbOdc%2FVXrjdWOXHekFRejHha1e4XYQns5Fju6e3x19a%2BXlJmxbvO2nsRJq%2Br471eH5duOnUpFoXe2ESYOiGx94XCutKa%2FXvAOfS5lmHZgOGihsa%2FzK9AeeKnZD2y%2F1DPuRGpvXOujerRi3w6c7wbUweT%2Bc%2BSphNLz%2B0xa9yEbCCISQugF0CT9ZJCgEcWCQuNEroDomUIAsV1BWp8HMVOPUh%2BphsQKja4sW2PXT%2FTp6bE%2F%2B0853Rw2TxQaFB15NAMWjg2Zg%2FKoy%2BBXckhA1heJ87znlsgF8o85HuC%2FMzot0Ka43MWBfjYd0lM%2B57wde1VCSImaRcLWNv5Ylr4mzN1V5PKppzTMoIibNzyvdjgB5VAzGofCNKnofqNTPYYqLgpY9ND3N0dAFQLy7CsCSFXn4pbzBoB0zj3c1t%2BkSph1v8ukjkWAhnqGO86PcrlQbtRDl7x4QpF%2F1IrKCSnD5O235r9%2BUEGCZ8QXyVeb5jTQR3Q3YJ%2BfJBRYbW%2FuFdvfQIiflRoV2AYnNAmD8RNplZb2KWhDQVz2ToW1HiiDynLl1BO%2BOMLen5c8GOqUBBnZKukzfeUSF4fii4a6MD2uEuU33%2FjwmkcIUmrO4WNcz%2B2nX58%2BrRTzDjxNW6Qt0NmibdbGOAkp%2Bvj502zcWts4zg%2FczDSJha3zfdTrhPHG8OWvl1jNGmQjpvZreEHW4Oiew79a%2FApMLh41nmi3ci1yZKtoXFOkhxWrS3sxipI%2B6mxjXWb8V8agMWyN2w5D74MTILJ%2BS7wMR1M%2FXq52GsO0RKfTA&X-Amz-Signature=3af7295335c18b37d73de8ca296ec0d07b5be43370da74d5a5445568c1e3df11&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666BRGY7QJ%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034938Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDj%2B2b%2BBEysgj00juVC3cqS5X8RWrg0XDVsSO%2BCE6au1AiEA4fOMYgAqZFjBs%2B0nFZhBtnZ3SqPBU5PqKlY5LkQR3Boq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDFZlB%2FBqTh4hVsmenCrcA6ygpeMZ1OzvUtTHu8yWSFpIvZ4eg2ou3%2FoKtbX6AazUm%2FF6tXLqYa27wghfkoxruvcEc%2Bl6wjD%2BI9UatXEedx9gAFU64XN6FkT26dFuZMk0BmzDJZfM8jND4Olg9cnDQAS0wPYNRrxKKuo%2B7CZ%2BR1oMgP7TGt2wb8grPSbQxclh8VbOsOhEyjg%2FKAW46hXi8EfUopQI7%2Ba43hzJUC8oX6dmM5c%2BCjClUATzyMT0hCMD4YEFsuN8ynJ15oLGtYBhYIF%2Fedc6bEYkmz9UPHNdREMj8%2FSRzjtSvlkwoXHCwDh%2BYwt6WrHyOn43KiYDTT0aDBHUw1EqopeQyYzTtIb6SB%2FqunNbddEjUdNjAdrrot8KdRoifaLQDPYG4zNTiMM33ut1gi5nsEUKHJelVZVQqMZjI4rzGu7MaazGuWlfxuYF70fzOSltRGrs07KL0zsonbAlYHkG4mo6wctBqUSF4C9PqOAM3Gfoopn7GxhmH8d3eJwMKUY4HZgH6aU%2FpOp06xOnkpKJ%2Bl60YFlThk625eikCftJQZzjB%2FZTPqKJnlGCer3Hw0UElYFXfnX5sVUlwjOCVtmQ%2BDttljtHoJfbrUft5UascwX%2FEESoBAu2qUyOuxmqm2pLwKj%2BS566MKi65c8GOqUBgu2geYoQ2cPA8Fc4t7IuNVUOb3%2F9QeSB3uQvz6pqWQOXEZM5uF8epU2Y%2F4NSk6L8Waz6UWcLF8zHPJcGNWBFLAMmXd8GR1hos%2BttOtJVs7Vxb0Tv%2Flv%2FecvG%2F20qdIG3FlTGNN45%2BUV0WCBiqlF5wiZLrOPNJyUvuqixxosp3DIUW923vqu6MEQmZd%2F9hX7i9UEE7h8f3wDKMvu42LLoAepMRFZ6&X-Amz-Signature=e0623bd8a19223768d59a5d95f4992a6fc45a7dfd5ab9ceb07013c518b3d7a3e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZA7SPUT5%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034938Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCqmfafL71JgUQmmQgfYmmw5uFzIQMO8FppdVfEwE%2BMqQIhAJFL3RzWjikKTKgHyrvnEZr8RuLNwwvDIm4l3PN%2FH3EyKv8DCH0QABoMNjM3NDIzMTgzODA1IgzbcPvDgBdDwBvN65gq3AP80n8fHSJ19CaNclusAwPxigzlVIuaxg4XrpBCV%2BDUcSSmwPqKGxYL%2F2CGoTDQMeH%2FmV7wQ3%2FackQkk5gmwCvQtvQF7euf8%2Fo7eIhJkKXPiP4lrSAMeEDiMVxZh028dFLQacPnhiWgprYr8EC%2Bq%2Fh1bq8JNjYPezt%2BAUqbXhKXJDYqKeFM4Wq2kfKTkVeGDcy7zII8TVXYw8P1sUlcjKEgLvwFutyoZBjAoty1WzawCvEwnWk%2B1NQFXOjEVHQyk4awKbY61o5CmmRaqPJePIwXfUwrbsHynOwHoe1%2FSskKq%2BsOHKSTw12ozONvpAGWYcrTaIZJ6baiJ%2FmvNEYzY1SLoQQ9UQrCl1eMuYPtrsmCUhc4a0ld0OxVPJBIg4adnII9LDY%2BH8CaCek8woPqkSMIskfKsHYqRLu3ddaOveazDAq1bFNgYtKc4O%2FjXkfpYl%2F5sP%2B0U1vaNPEVVSNTvZCnRSlbTPAW3AVCXf6XMCcVXk2PcJYpDV9eyGtT84oOwMidgOFhIuGLHFZNdZuLCX2pM48T8TIbRKPnh0%2FwM2n4ztOrxByjeZKE8zCxwF0y5AvANW4moWOI4pqgYE9JAwsCddwdKyK9uiug%2B7wcf6n5Vc7IleUSLtD0vpZuBTCwyeXPBjqkAap9li4bnLUO30hyVjgjZrayJIftprGMtpG5D6xvhK8D2XCHsx0ENBMXvjl2XZimRzirfO9dAXyIk0hGqwhYME74kN%2BIt6QicLF%2BppbHpa7sgNWctqGFbUsy%2FkfGABhdS7FSmkWQEds0%2B6H%2Bz6Kf9X57p1hrx9htCFzCXNVLr4TS2Kz5TUxyi8VtxtlL9U2%2FM19Kd%2BqDrE2S9Xh56Xxr5cpO5Cvf&X-Amz-Signature=6783cbd3921aea5e62d757f96b451216b2505b09499ae1680c3a012b3fc52aff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666LUHQXIY%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034939Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBzDKQxCj%2FVszojtHSzl%2BKq5g54BV3eC4nj6lwwTdIwSAiEAlFR4IHj4AC03JsOyHUOkhCoCmiiM51g4Tkp0dxKEba4q%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDO%2Br%2Fd3yNOeazJHNVircAx5GXFhx6JKSApc%2BlMPm4W5pPqVNUgUhIcg5xfggWfNH97QDu6tDixJROnPpX51W39%2BbAVWYwVhsq%2BDF2xSF%2BFMrAeNpnbQTLwz1fSJe8qEnQKLyje4xr6J11Zy7lBWR8S3P9FmmWpiO%2BM%2FEsY3ZaGxybwsFkrBp%2Fqw0K%2F7VkWNB4K708grPnaiswrV%2B7D1VQp2EUTeLYncQArLMEALGmX1Kw9lglAx4o9L7W%2Bmtf%2FtSvElEjURQfudraSSXcjPi2WPUP2aEDJIEhaxYosFH6fTpyMOWjwCEdWXiNusKujBCK1I%2BWA8Svtg%2BPqxoraN2CDQ%2Fw4ps7AJHo3JddE%2B2g9WORXjfkWzfwbMwLng2S1HO064HzNp45jJypeqfEdWxQobIDJ9v9SBmME99zh686SoeoNcBJo7EwIPPCtYt97j6Wphy3lqgLWy6zASGkL1AfO%2BfE72PDqWxKUOxlPdL96NZ8MbsSBm2rvRG%2F71zW62aO58QEAPQGxw5mA0WorJFctpjmoK6c9PWZfrT6EzA%2BO0N3ckOCbWSR9T2vN2ge281Qq6ikeB4U0XmNIkJm1KyuLpLB5u80hneSyypZt%2BU1lmuUx%2Bg8KaenWU1Yl8fJYRA6LNJ1lOMlv060AuLMOun5c8GOqUBHJ6k3daX4tU%2BxdQEVy2KbjP5HacqHlUDJjb%2FCYtB%2FbNGUXIihTkXRml7mcwYQnWmEb%2FOWdosL4ZZUTdCwleBwGkIYy1GK8Ztbitc1WbTKRZwFCg2Hea6AUXgk95S4VVi9k0ewTEClvOQdBCN%2BnRAkkFvli8eFKdOLJ62SqBGW1MFvk7iAnubkGdqfgS6bK2b7R0uyoiJXSyG2zgBlmuhOtrYcuDr&X-Amz-Signature=ac890c4b33b43bcfde0438dcbd3f89d038d62d4628721e5f06b93907257c0106&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664DDNGN7D%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034939Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCYxDjAclZmd1u%2Fjscbadlz8N3OxWC0EwKbIhfNgt4T%2BwIhAOJJ80DorJaRfBQk6Uy%2BIy74yh42wxNd%2BRf0XMK%2B0rKgKv8DCHwQABoMNjM3NDIzMTgzODA1IgxZuKrzYtIZV%2B%2BSFwYq3ANBAopHU1%2FXM8XGJjjThYqSdrJD%2B5ydm1vau%2BCzDORc%2BTvc7ehs5z3VFwaQq4Zz8vD9DMHAW60fPOjUcvoXc2pmcUOX22vyRaAgPg5rzKstyGoh8PVelxddL2sB%2FasFxxJE3n095v0pRjBSor7AFJw9cfeOc3yGuzf21T6ygMj7klbHZxjK5%2F1TnXLx3WWOvBguBUj%2FTHLqIOijE4unPSaprkTzewNDtuyPPb2jgflFE3Gh2Tf%2FJ7RT%2FAMIYqWf62tIN95pmvIUevUJ4OfCvTn6PT6TDpvtmYI6qRlu%2FKo5%2BOIKqHrgz0DeKDqFGHsyq%2FRY2%2BHFvkw5v7ziDQBFsNzFuFd2cjgaFjyAVugucSlatev7ZEfF1SFUElcpTKxZanol%2F7ncAUzFN1tIHz2fI7ZM5tbEh4G0O5j%2FBoA%2Fhb8Dk4nIg8GiNgfeEW3qwdgQS1GsgRKMStraUcsYCwaxN5v526Cw4ShGPoDrHjqlUb97R2YXfs8BNGfv%2FVD1Fb9FHCa1A5UUyO4xJSpCrOYcTS5901i5LXM0az3Uvki4Zp1ARj%2FQoDGl%2FfoQs6lusVX2sV4fpnm%2F28RXYiiEPRaZWlffnZSe318bx1U0Cl0UlKXAZ2nncdUSyVSYJkV4KTC0xuXPBjqkAV8mq%2BgfUnhctXZJIXlmsS3MuYvYdTv%2BFUlNFg%2FPcfRQp2RDIJ6YW8h4te5xYuNOxCqGuW2bbQujn2P1AjPLEqP6FqbMH6m%2F2t9tNRpT7t%2Btt5Swj23PzSFHp%2F55a35McRHsOmvtJ0H8LuJAogqphZBvH%2Fhjl0WZI6jhUzMAhCIym2nlEC9D4Uttetnv5XYLwCFMWm5j0gxJdsSiHmyvk9UtA4na&X-Amz-Signature=11eabaef1131fd72aa775c342196784fb6d76274401337446e66a70110e6ab02&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z2LGRVQA%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034939Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC5pCJre9I0gIhluUeYA3BkZuP8QndajNTVJUxx5m%2BOJAIgUkGU4P87EcHGIRo%2Fey%2FS3DQRK4F4Abfke7OfGiBJEKUq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDLX59vektq0zO6AwECrcA0kf5jX2yP1qD5kEL0nPngPPIFAcvD%2F9dFEfTVVzqEICP%2BffaLxCoimWO1uvqWMdiLVvts2QigxvVhFDXPN6Q3JACQHBaxKS2bsh%2Bv5kyt3JsnPAcESEEPA18NzLVHCJPo6AfsZ6E49%2FrDMRnWBwmUe26h4qZLie6R3obyFjDLI3EwdxQt7Du9wMYdeJRyk6HcGJvag%2FnIJb2%2B%2FcaFu7AMNpek0cmbiK%2FJR3qc%2F%2Fmb98ebhCOPu%2B%2FQgeDZwEhO9LSHqaPzBwnd0Dnlai6DPcqOD%2FZo7G%2FU%2BjhZzoXkMexeOVMEGQFpnkq9nCWpHpPfA7GdfLSRJkSEP5OxmgMX6bf%2BonAvVNzFZtoSsNFv5vIE1I%2BXIa9L3F%2FpnEhqIhO1ELOT2sl1c44BgfspW2QGHnL84%2FoMLLQ7Jw7h0qwONNYE76xyW5NoYiKsQ7Xn0pHqpzaXMmV9OMaiDFII%2FyZYo%2Fwda6uJuDJxDDxXAsVSN9O%2FO5tcBS4wZ3mkaX83YUZLxmDVDWYIw9LNuIO2j05jNyjqsej84modSsu%2BKUuuF2GU039vQbZUcOjsEOCmbhZ%2FntIyqQbQXMYKmCmGh8AM4D5T0deaWUyPlaLEItxFE%2FDQCgi0prFf2A4qf6HO20MNem5c8GOqUBUmIb1gCHOXuentiq6EsKnbJqvWbc4rUf2dLrnOB%2F0qHGdshv7ZOpBZ4az7Bt03Pj%2B4gXbTBUN88lcbBUkBiA8munkTEr1Fx9tD3wQTOydd0EO0SWf8yaOo0regVPFLJGK%2FuV70tE%2F72U09fWg69NLvFBYQa68aMzOWw3w75s4vYTrY%2Fx5%2FVMxLA4lhz02kwIbst7wh94sbv3T3EEq%2Fmah9agUEOa&X-Amz-Signature=16bd730625e89b02ae3fc5626bee0efb0d8bb58e32ff67523e4c2ddbc06a32e2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X6ATYPOS%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034940Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCrPNqBocbLi5BGFcGD2NOVTkUWZeO1eC%2BxiDp63sYI3wIgALobDe69BtKm%2FHBW%2FlNo%2BucjhKZkrfZFkyQynC5NhsQq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDFPqSazLQi%2FZ6mPmHSrcA67rx5ojHRb4NVG6%2F36v8Pxmx97wLn6Fp%2FTTAUYcLxu7r6e74kRU6ERQMR9c0JbGM2V5mYyRzavXyUC6uHmbdi2dblrVnqeNmHfcAOds49IIVptj9yrW%2BDOEN4tetvHjj9Bh6fYJU179K8du0gBmQYYnJiM1D298xeHNYMjZblz7H0Vf9r6wbiRL%2F%2BZZk%2BiBNIXJg97qaYv5SXkV1ttZ%2Fe%2BQt4ZM8DtKLrNe8K3kERj8KCWYtDp7PdmIeabcb0NmFPTwa4xqdF4eCVeYuEvrtNvoXEZRHDP0bX8eefG1Z5Fmhc1nfOfjVPdTNgEyuIinwrSucDSsxVOw4tUnuaK3zuA7pDeo%2Bci07NctI18jljjCY5bvo4%2FjfgKK4NYRL%2FByITXWWeVHOYwwnpw42jDaaTA5KkJ1bjdm2JuhTNu8GgG6XM1Vxvf33cAgffbhPEHbp92r0gH0J2Wf%2B%2FaHi1sLDuTz3suf40BFIywPc4i9BNlr%2BK%2FKpCWHnrCSvv1aNleXHnmZOPx4zr4kM8LrHNWF%2FCTwEvoAHvbwy6PsM%2BxePdju5IOLnhWSGDxMvXuyXrQX%2Fg3UkIxFBG1iOyW2wRicsZeRelmnUrwUEorGqYR9qc7sjbErSmZJGhuWrGXjMLCl5c8GOqUBM7kXBHpfe%2FEIxlvIasea%2FMxHSXWajlgJoZmlrZfXtz%2FVDAP4Jm6A4lp7o%2BwkQru7MIP15JD1Uk408yHJFxlm%2FJLw3SvxXqt7MF0zedc4xgupACPh9Kg20RJYzJVDfOqsg9Ilya7dfXYYVoJB0WI2EcMhyxsR%2Fie6tKR1GyOKuGaWv2ysVhy6ZmNYP9NQzfEgF%2BvSBDMK0k%2BTDIEbMvk7wBpATyRt&X-Amz-Signature=d17afdeb6c7e8fe18f119b1efc2ea0461b3cb0c5a6e5791ce2f94679a6594ca1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TLXKPYGY%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034941Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAq%2F1RO7pKPuNThxiYsULyWtZ87BDTbGBbWwZAgyRUX1AiEA%2F7QP7VbTLBtiC3vi4NrQqbeWk6cJ1B3jXIhZQIhadS4q%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDKpvhQCCVKsr4ia9fyrcA3xEFSYq6%2FYsKUMWaFoU4tMDfyFdvB9zSYHD84xCQOdogFyhvM1XYFqGbFy7eZAV4v9RJjF2kCKj%2F0gapNFVutHx0qT5xJzS7SbZDt7PdXe8zD0iLjD9lzUDGwf7DjbjjNu06yqmS2%2Bfg5sz%2BXbiape%2BFrFKxe9bEXFv7eIJ%2FZKWfCgklISHA1WY7FjekJhjRQZ%2BU7vhlxzj0U7x5Um17fRCQuazfAmOlfueNdYe4JbhVZCWa0cQRI%2B%2ByXEdNsnqXXEhl3ghpJsX5R8jjjNCMTynq8%2BeSKiTHppJcjUSeFlm6WYA3eDTrl4zlu063YDn5ybKaeqqqZ8wVFBbBGP07xlKhEdrN1nO4tN4lPwjtZSCLWc7%2BOc3phb2K%2Br2EN1%2Fw4%2F9JSuhKyX5tpfllYO%2FKkeK%2FbcJ%2F1BQM1TtckqlSH5f0njOd3iWd2x7PGhTcOd5Zqq50V%2BT8WnSRGUqCJuBBpMopNRGw2%2B7AfVj1DQfdSFzlwCCHYMG%2Fr5UVtyV1nd1wAdXbNXe4KA8t7aSBLdrE5GxQvLb3Djo394zPiW8Bw52x7ZNLWZppfRrgv3160sOXdFgS3clLy5z5hCTj1SpJnOOm0gfsQkd%2B3VUWeGPxsJ%2BFdpuPz3ID8lUc3BNMMSm5c8GOqUBmx4nPELxq2Fuu7JCfxSV24jixYM3QsgDs88v6aQwnUWVK%2FRC0uZTjM3b5qP2mmF%2FWhCwnT7A6MgdivfMAQpsD5AdDBNmw7tgynKj7QoDhzX7H470Vgr3Di7ZpwrMwsoauof3tR013%2FYbnj79uWGmEt4xXsc0MAVpguDv7wg0XuRmkogDKSRgpxYTl0CeB5oxANksGZBgeBolegtZ96eJRhB0NtLV&X-Amz-Signature=7752d759387f3aeb738cf7d797609628e5452dee057fd45c8c2c97f8ec4dad9c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SMNJLDLO%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034942Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCY%2FQke9XDPszHRLXlfKJo9TLm6M%2FosWGymosKzx%2B8z7wIgZbocGloH%2BdOM5xEpGYcyUea3rT9GoA5Q13Km9XqRFTIq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDPZ8ZukSqhHcS%2BBKJSrcAwwNNkLC5O%2BxEYGlaft2emCGsDSX8YVOeW32wqn7KMTwwpgZsNeIHdWIR%2ByWMgS8XB3IAv%2FC3vaf6tVLZ%2Bj6h08wWXD1L1il2YDSJtkdi4Kf9dQfVDM9lgpONFSfaoCbNt5d98lZZtLGkxDj%2F5z12w25rmpkaOzeG8VxQMkUJK%2BFtXEIF%2Bfmj5sKvdsrrZiwQwUokv%2FVsalOb1uwJDZcPtIr3DOdF%2F6kLi%2FkJMnz0z%2FojTb6nweRqBi2SGfqHhlW0LvK%2BbP8da5izZpfpgetiBFdk83hf4Ur26B8qXlGphxhWl30RZm8vM2YXZJ6FX6e46osFyQHRPzoz%2BCkTx%2BzCY4vGk%2B1E1C80VxC0fVwF1VIBzz8z1iHnEg0R%2FESI518shhcORnHfTG8hYj%2B%2FWD8%2FwJtr%2BilFKIiec4NnfZIvnykrD8IjF2iOgFPRCC01Tp6i00W%2FJ0sD80mpxv%2BiWoaSymaVwrokFDx7f0TBXAtLpF%2BLNwOAELr7cuyoJP7S7VQL3upoIz%2B4O28a4zt92BkBzni6kTHfPWR92N3XNRmiij3H54zL0K9F5M6H3e75wFso2QmPl0%2FP5zYVEEJFhEsuHCF%2FXnn1cKS8g53P%2BEhBC%2BYVvo0wm30Pmuw6YDSMOSl5c8GOqUBTPQ1ybBhKf%2B6UkFNWCmovLWEC2XXAImqmSAKS1j6wf1C%2FRsax0AcofRWMOSxNPWX9JGD7M%2BGM7Uu4GS6G7jn4PR5NiPTLcMncORSqRK%2FrbZ7B6mcVh6fI3aXRfOReiaClqb0%2FpvBU8F4PNA1tJg%2F6W0%2BE8QOlp9Stu76oxcyHEWqPyvlaEWyFyeoDBMZ%2BOe5RW%2BGnTxeB5PXM5NZuRfbAOAKHWm%2F&X-Amz-Signature=b8f771957bf15b251ccbc863a5599db5217a8847d2f8ba24266529d54e2012c5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664LJKKGJU%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034942Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDZyIgFTE2ZgFqY54aHC4OZJukvwBVd4iSH7ZMbNOk96gIhALv3Er9%2BtBeedvuMxBqC7EXliXCSYS379jy7OnCoNZPUKv8DCHwQABoMNjM3NDIzMTgzODA1IgxfLHgc51MAUjWxJpQq3ANmoAiTzSoQUynm%2Bf7DfSTubGnAC%2BJG%2F85O%2BpWvKPCUyAm0TardNMhXwTMSFsLfUU9nltKr5%2BmiGpaxNHM1H0GroPJahX8%2FXaUn0SFUy35EJhoksPhFhfB79jhZrs3x0gCIQrmsaBBqdyx%2BpmC2gAjhxNh6CBTBqvtwx4OeQGMmqOSc1E6Tcm%2BudFOSJmRMSx3fyeaxNCuvnlw9UFL%2BevqlQatzPoFCVAelaJdyR92jKt1yFTFc%2BGlw8ZLZqWSb066sP%2BTtg974YGtSUlntBI752%2Bc5y9WTfID%2FqzXqHujShhigLamNoacxOtm1KdwVCzZNLkl7U932nK5j5iU4cxDEcvHMrNLXmNcsRKJT5x7PWsGzuvAYW2qV22uMDpswLwVLbixxMkN3B6iRUjkrtoflFtT%2BeB9SVUykjRVtuYnyrxGZBYVQs6S%2B8U52fwm0FTjfnBkb%2FZ62JnOo7%2FFwIqr3M7%2FwyN%2F%2FBVdshLu1oBglS2LOG%2FJkGBUmUOI%2B1XDKGNHzG6k2yq18%2FCOhLYwBWXWKUCJFBXVGyd9MSd2X18i5A885DPC71GGBOtNVvV1KKPIR79W4MYTlOB1wQlgF4k3mXIP4eWchwpSIjW2VrdXL%2Bi%2FjzR2UIXRnC07sNTCqteXPBjqkAXAlxSTO%2B9kl21tRlhLkBkHmebWfW9KXV2CVwS%2FiE6v2LQPHuC31Q4zDfrfM0G6HGnbV1UkmdSfYLYTklIDaSPeL%2F509szVdx7XC463TT9Q3WaaC4d0kIcPD2oa9oBRdRZjaHnuL%2F9I3oT7l9rKvK%2FhipblMXBnps5IfQplgUsvY%2FurLsBMJbcwavp7DL5JIGrpZeQ6mKnGyQK3R%2BhF7Mx8SfK%2FA&X-Amz-Signature=9e4ce0d1c2265defe1585d7778ce9098e0ab7daa358c5668df5a32cede16ff5e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QIAZIMNA%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034944Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAWqbSrx7UYeV1KDuREYvpfWld4xJM83evMkWAOZ15wrAiEA7SDG8rSA8VY4aduRs6U1AeL1ZIEtGoQ68WuzSGCekfwq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDDn%2B63XhRd9qJn5NJyrcAz%2BjcdJfBECRyCRH5EmNW76WEROY6%2BuYzZMEwmi3ZwZ4BPdEwVz%2FoUJbxUrjSuR9gst%2BJXfweDMTWDuE7rIegr2KRkt%2Fni7EOLgul8K%2BHsnhVskgtbcIUhnIZp2tkhxGr0b78oQC8m64MarlPTut8XAAMjk9kbVJQxsL8OtfRo5%2BY53v5KIkgLc50ou0RZHp144VYbrm0U0RJTATYqvrngpFIRUlk1vCkTCiweiWEY0Pkbx%2Ft%2BwOEhfzioV2Z%2FWRYPjKVMFcX0S5xkdLdDiX6Ar3IDOrArcfje63eMj8zXt%2BAOEr8PlNUVYsCdZh9oQs0MCQimfo2xfvK7NVWV171ACX09%2BzOs%2B%2Baw5wroU727H3chnVdBEw1NvA6NWeJSsHfCcK1e%2B72YbrW9NZpsb0mypWOeM5oPniLm4xFeLY6Hs0lt0syKeWjcr2xdo9mlWzpuCKMmCfnKB8Tqfm6f7UIbMe%2BaSgrfcCt9jd9Q%2BZrR0YI6FW15VIcjlLvWSuR7nxGRXKrJ3snUzL2KTsPSILc%2B18LKuEIoFbI8o2tplD%2BTqECYn5xICdRDLuFG70V0rB57TS7XNfTMbrJbLtgkWe2%2B7VzM12d1oR%2BdMPn2MtfjjWn1aBt08FPttwHoztMJOm5c8GOqUBmfX3gy5xth%2BoAtcEOJP%2FmS7UTqknIm4kqmYySghKNl7iPJYqK177ANKiqWE2xlJmCxnbJKxG09NN0pD%2FEQdP30TcVEU1%2FAXMxebBdkog6UaKGCfctauNymPCpSvwb0rtofhphd0sZuSPdz%2F2vvcZKg1XE902NpNDSI5BZb7Pk8adjKgtYzVBUcyDj3pr3CjCGrb%2F7DYnNEvemQ1Dbc41x3d6yGVb&X-Amz-Signature=80739b5073549dd14987025c55553a4de7c4fd236c609f812b292e457e63aa0b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QIAZIMNA%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034944Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAWqbSrx7UYeV1KDuREYvpfWld4xJM83evMkWAOZ15wrAiEA7SDG8rSA8VY4aduRs6U1AeL1ZIEtGoQ68WuzSGCekfwq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDDn%2B63XhRd9qJn5NJyrcAz%2BjcdJfBECRyCRH5EmNW76WEROY6%2BuYzZMEwmi3ZwZ4BPdEwVz%2FoUJbxUrjSuR9gst%2BJXfweDMTWDuE7rIegr2KRkt%2Fni7EOLgul8K%2BHsnhVskgtbcIUhnIZp2tkhxGr0b78oQC8m64MarlPTut8XAAMjk9kbVJQxsL8OtfRo5%2BY53v5KIkgLc50ou0RZHp144VYbrm0U0RJTATYqvrngpFIRUlk1vCkTCiweiWEY0Pkbx%2Ft%2BwOEhfzioV2Z%2FWRYPjKVMFcX0S5xkdLdDiX6Ar3IDOrArcfje63eMj8zXt%2BAOEr8PlNUVYsCdZh9oQs0MCQimfo2xfvK7NVWV171ACX09%2BzOs%2B%2Baw5wroU727H3chnVdBEw1NvA6NWeJSsHfCcK1e%2B72YbrW9NZpsb0mypWOeM5oPniLm4xFeLY6Hs0lt0syKeWjcr2xdo9mlWzpuCKMmCfnKB8Tqfm6f7UIbMe%2BaSgrfcCt9jd9Q%2BZrR0YI6FW15VIcjlLvWSuR7nxGRXKrJ3snUzL2KTsPSILc%2B18LKuEIoFbI8o2tplD%2BTqECYn5xICdRDLuFG70V0rB57TS7XNfTMbrJbLtgkWe2%2B7VzM12d1oR%2BdMPn2MtfjjWn1aBt08FPttwHoztMJOm5c8GOqUBmfX3gy5xth%2BoAtcEOJP%2FmS7UTqknIm4kqmYySghKNl7iPJYqK177ANKiqWE2xlJmCxnbJKxG09NN0pD%2FEQdP30TcVEU1%2FAXMxebBdkog6UaKGCfctauNymPCpSvwb0rtofhphd0sZuSPdz%2F2vvcZKg1XE902NpNDSI5BZb7Pk8adjKgtYzVBUcyDj3pr3CjCGrb%2F7DYnNEvemQ1Dbc41x3d6yGVb&X-Amz-Signature=dac2181c8da740599f6a90b20d29e11b7f54be5e10e54f6bd4f55995abb177f7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
