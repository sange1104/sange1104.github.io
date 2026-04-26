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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46677UK6HU4%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035450Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDsh5PEA3SqxWbtySnfDMIyGMYYxPQl0oXo%2Fxw13rqU2gIhAK02kZRx25wUCBO2aJcKZLSVLsV2nxGsh4U%2FBhhcpTzlKogECKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzDAvd4UgSeTh96HVMq3AM4adlRBZ2cy0hsuYl0vWYdjYpEAwVyJSvKT%2F3vAfwX7k3Vw2yUu4%2FcOdlgKKQ4TSWuTlcD449Rq7UoN2ZqOWKW8p6FBG66UErKr1gErAksrxkIrRhsVcgo%2B5wxq2dBXrBOSN%2FjBmnjz9eeayJn7sukjhkFCy45tjmGPmV60QlB5C8Y8ihhoK2kpi9DpxdWUIMPGFypZdo7yaBqraOilDV2hyjD8talw6RCuY658tl1hY9IiVZH730p8yeESaI%2FQOmOmXmPVUwFTqe6GSSIbRIaR7%2F%2BzcM5XvK9gV%2FOBa7f1J%2BoP%2BcKSR29iERMSVmUw06hJa6nRe1cY1Z0oo4ugTLcPataYM3D8e6SE02CNpfEZcbv8Oddb4vFG6%2BtkDNNpoHoYsqJIXpBpF4Kxvyu2aLxWE00v2R0HpflgNiDH7IDbzDiUXUyWRktViovOyJvodAj54lD%2F1PSR8gngUzVIqsrBkAwXNrD2iX3jV3uFfzoPQ9QcN7YX0gi1kPJzqBGpjnRCFNJG5UWX4ZcnqisKOXhssRnziU%2FiWHgMP9pjCtpFjL9bN3K9KjVbw074Hg6TOMDcuVjgTSfy5WMXlDRvPYDaj%2F5YSyi00TymYXyUj9SoW8XnuHDJXtF0ZwvnTCUkLbPBjqkAWAyiUaa2iixtsRhrVSjInYfmunIh4eOoMCQY%2BKvGjOTVMEKMzzqvBXEb21%2Bxt6S6AEqmQg8EpQ%2FOQWM%2F%2Fssj%2B4Pai%2F%2BfxX4ZVDYLCywyvNHUO6%2BFY7pSsAg7%2F0dpR5Ku4rHHPT%2Bei43R1OjcAY3n0dcVY0K7uASf1QEw1mxxPmbC3drEWx5KUeYVL%2BzOnZ%2Fh%2BiqIdVVhpaDlTIqKYMMNQeCCGMT&X-Amz-Signature=c628f5f7eab69838d7cbe3c123b2405342ea4bfd4f22c6c9142a4b4cae0bc45c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z53L427M%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035452Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDUi4MlKx3M6MYuTbYCjiIBGB5iO7hlNZE5NbaU91SSvwIgVczyk%2FuQlMNzllz67eVcZjQV5KSXDdqNYbygqiRXT%2FMqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDN2ZnN7T7L45oIe6ZircA5luojbK7kgpKAPnWsiNTJKB8U7k8jkGO6cq6SrN7%2FspwJL6RfTBdppwB9RWFF%2FX9HhoC5Gk8TX31Iet5TEoH23cqufQl5biglgUZRWacKGMXXS%2BpnFRWsl%2Fenx1gAgP8raj2J67ISMkcpZI3Z6TEjChXkqC7LeimkSgVCu5FvHaNg7xwte%2FVlqSmVFIoSPNA0OPHD%2F3icljjywT32NK4ryFYdLDg5xAuFujZXKZopR%2FN1drnpU84uYbme6gZglCU%2FnLMBJR3QZ73FjkgzExBPQt%2FndUBv%2BJwOICoSWcQevIrOOln4EFbXG9EIfqFMA5qcbhJ3VMfYNVR9lylRnPfMlUTJoeWx3R9gFzSLBtQZvZOSjEldgOLrGoM0%2BUqJoEHEU9IQl%2FfuAFk0C4I7CnjacseFg6dUAnSSm3AptBwOMEBmf30gndBnS7lmJJJdplr1boeu1xxmtGVQ%2FfH3Uyahg4m4JpO7RcdHZaJI3XNHboNExlILCW4UfDnImaMN7MUjueEuGrGpVivkGYJTucrr%2FyNkL%2BcFL%2FJ3SxheONbZqbLs4TNzLQxO4PRTHkJdb3gZyPSaD0G7iuzYjoWotlTIsb45pdX%2FD272ekI0VlUkbEQxu8e384esAevjDdMIeQts8GOqUBq%2FyQx%2FVn9mD7eWDBi5gvu%2BP9V%2BwFkE22S%2F%2F%2FAbBBKlKR%2FSAb%2BwSY9OfGrJ3307ZCSoIyalKZHHH%2Ff%2FsY%2Fu%2F6o8Rc8uTLgbwUW9YWuaG0Sa7jXz7jeKhKDPJ7uG1JQq6U4RbOs6swqu1b%2BgmLs%2BAFL8BxuTaR6N%2FfggVie%2FtqdcyuBuaDLVvrcnqG5oRhNqiMFxTCybwK%2B4hmPvDjtFR3gaNPxtSn&X-Amz-Signature=f76859c10723f15e8b68f8e855445211e04beef05f914d43d1798550e2650934&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46642RCU45G%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAO90Yie9OsOyBkuhulSSc2fSmue0frs9Fa%2F8LhVAh5TAiA%2BeUlxhtEneBhLGKyW%2F8NL2Kp6ITn%2ByWvgUy2nGwfuQiqIBAil%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMZJhaJw9ziyAb4LoIKtwDyiyIit34NlcNjYtZJWIvExpN5Ze3tWMkFmPO1Rr0pwAQF0gUNEw%2F%2B0x%2BEJUF3CV%2BkeFCGciuYRx56DYhg%2FJNR7zawiFgHrxydJC0F9Bk9BBHLcMuMVHbrbZI7RnNhgSvlpucLumhwfSoSfj8lG5FWik3a0uR5fFaWnzhaZgLNErjwsC%2F1Yi%2FKxjGuEMdo5ic8EM8YkR7d2q06nrsAQe1V878vY6hOETzXBbPCh9Z3080Z3WEWuNDtfI855tbHBZEc80F56qQQ9zLnyOCSq4Evi5jUnH7qs4FUxbQQDuzVtsWZwZj%2Bu%2BbfTyYtg6q2PK8LWsdhxqqyAfdVJbaX6h6%2FL7SU0PS8t95eViR7sImbay%2FNthjGazKsORXPCi1UtFPGB096do7Qu5DJzhcdkH4TvSFtakSkQsOmortAeQdLVG%2Bhk%2FV5zZzYDQC7zs6HaahdxyjOdRJfJLctRqE6W5B7PsavSRhYU3OaNsEYgppzm4CqOe94IpDZLQsb%2FRDBQGOWqRXtWUZ6hmNP1q5c6H3KJDX0Cus9PnNJRo5rbueqzr7RxmLIvJBZ2U3ZtgcjSnVlu682nprA0LkYTWGlgUz9rUBTpz6GcywM1%2BMh8PRX7AdaroGT2zpY3jd5N4w7o62zwY6pgEblt9r4P93wB6jC5PyhSbEY1LPZdHQLhICK2Od5SxARqYCY2GkCpkBQj78Z1YbEfy22Zpbha3P9ShTDJcIXG5f6%2FrvOz7VSlEOku%2FFJVzt0DFepT6HSX01Kc4R31hHgQKoDdV1RXpvDWxkiqA2Ci1T74QbRmrMh2HDmYbeaNKcpj3EYMPsXlq0oK3bSpyWU0YiDpn5j5Nokm8uSVNhFvcHxG%2FwXxoO&X-Amz-Signature=919157b229f0f057269e775a15b4b77c3b2b900284fffa8950dff372257ab205&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663SAY36OR%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035456Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCl6CwoPdwPDs3L0HV%2FUeqdhLW2R33EeXjbO6d1KslXIQIgdrmZrYAeMjW9VUNlgKPk5NQkyMxsyq%2BepXQxHtTKSHIqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKlL7eTkZ0cH2XCWyCrcA0nb1VQBd2bJb%2Bt6h7Fsb%2FRWGWXOQsvLl8qzCZt1I5FwQPZJa4AA4ECMDdrzv7tZz6dFRKJNqYyCMFCFWk6fvk5JytByRXNOIe2TcvsL68OoPdoEMc4Pr6qNxCFbZCilMlsR4iy1mtsQcLdKKfHZBptKCh3TEGuptcXW26S1Yx4YKuEKIVF%2FsAePanSYqa%2FRYEX1neeeSYBfg%2BxWJwUZq%2F6oWFWsodOqeRRrgfnt8Xgyrw1w8MlB7Vnv88%2BvuumbvrwBp0czPYYKT18n2%2BOUjPRfsDBtqKKOsoFMwLxh4lIuHSThwxkJtt54%2B0NUWKVTqHYvROGe1taoiwMA7UugOAiOfGFHf68eZOsX7HODmsjfGtHa9hz8uJCBg%2B8n98iVBrhJ9K09Y8GCBWop1X1EWHYa%2FvnRo6a51vbaubyPo3NNOAjEJCKE8Q9el4C6d3DQnF0H1Pc40MXalcLpWnNid8oIntQ5V2ELLKiMGixZgA0k%2FA0hpk997x%2BertU%2FHwU0qRCtxVxgMIqVQN0ojng34MF4ZmH8NNaiE9mAyBn2w0B71zlVHjfgbu6SJF7gN6Vak%2FdmZI9dSoxgjArwkt2pmE%2FhDUQr5VcuUIvUkTgz6HIdL7b%2BdO2Oyy1DbDMiMOCOts8GOqUBroJyuIh7ZxjJkc0Ocv0RdGVKJqcI9SI%2BcDDoGHrtVXsrY7NP8S%2F0Qe%2BL%2B49UiDfk40Gm5bIxveR%2BxQEvcYvTNgN0bnbX4OIUmXzlUPG%2B5fbP6EAdvwv1bxE9mV9meY3diIK7XKzAoifgPpyaZykakq0VXR0ceVGxAF7xYOI2rs9pU%2B7UGY0YRfQkZdE%2BzXxzNkJgWPjfFYVfZiiPMWIFmGGHGs32&X-Amz-Signature=517f5248560409e746ac2a88b39856b76f0856a4506a5c2f9c367705afa003d1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RHEPIU4O%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035458Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDWIKNFsNsk5ww%2BBXpMGGJJMEP1iVyMZ0%2BGobVjeGhvKAiAjy3peuK%2FezojVQCfG3TaWgpYmLKTLO9D89wLoroTDciqIBAil%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMArdrk6roD5QFnptXKtwD3Y0A3NW8ZSWK5pY7TjZWfhnqtrzlnrMXh8t%2BOO%2Fdc9OAi9hy5EEwqZfWPgLYZgLCR4NUMk7LXjQTlIz5TzZPCxknUChZFxafQaLSA8ZSQCpIYrJp%2FguaPNdOY8m9QpjhAUGSb6trzJUNkqTY3rwntdIxhSBef8dfxEDSJJrOR9Q5d%2FwMTAKyE%2BAzn2RYHHfuWATpddctCNY5VUT0OX0UndJXUW3%2B4SKWi8W3wV5nd5ATgMoEO%2B%2Bgbd3kehBRFgYCwncZO3E4lYJmP9N7usncfN8mXYQauIZyUX1aFjxWv0FPUUweNlnZDaX3cJawzPFkBVpUgHqZgZWD1cxDq3xCnzZWAbaUsAVpfzZ1YGe2%2BJ2leF8IcCCFa6XT2tzO1Utrtf%2BNuEtYaJKOSBWX9XBjrL7wAkPGov30y7GlCGITOALhym8Ujp4w6MlXGwa0yulsuc6IoueTJSqY%2BcKCbheziLztmSxLqyho7f4dssgegrq8mZ2SgTM5NGZsJWE%2Bp5BTxXD6aIxv73oGzZT5gG%2Fac8TPdkktxrbHYeJ4z8sSOpxtskO6zGDgoan4Q%2BAzDNZG%2BXRO3Ud5BDUHzpB%2BQNYkiHP8p9GnuXn9sPwHTVQUpzEw6daS2zgFohwvFTEwvY%2B2zwY6pgHCoDwDVywCEPoSsODGclzx36fwGIbhP47bVLFOTmiFP%2FeEqlK1LsGVQB2rn%2BdiT4Ry7N3LUIz0CLlvEseWQvcKya3wwcf%2Bre20pXp4O9y7mr6Q1VdfV9ELMyiyEzFW9gp8i67bg4RdxjJwgT0ubmTDaGo3EtQSLoyMvtbPaxqjp6JgRkrspoZX%2BgxEWVP%2B1S0MVlZX9RC1i18639jhV0W%2BAmeIBlZs&X-Amz-Signature=45db3ad2fee70d841716dc655a7c75d122ba84accba63a393204988deb0caedb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SJ4G2HCS%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035459Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQClcpzzYj%2BI8JSxYFcOTefZdIt0djtlpv6NLPYHyzOjwQIgerHGav1HYYM7rvaZMSXuXwkKXSBc72zGrRuWcVD5Ps4qiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOQtwmtQ1lDepHUgvCrcA2tmP0EqLvRB3n3d23oVVkI1zXBEC%2Bn6LvtSBewJeAqe0PmJh%2BT990LXf3sQ%2B4TWzsVDLiXY7SwzndLvK66FjKqd1193QSa%2Bm8INSkbc6I8EAV%2BKVNTAE8KDFLx0wldx6%2B73M%2Fy7VSqHoVcc1HxEmtihD%2FhdXzmeDdQhUEz4XRFlnUghpQPEhoL2W9cibpZSDItAtV6DQ0h1TxIbMWdcDl9x%2BAdusDVi4F9rEGGWkCkPVDNEbmJn7r%2BCDhP%2FIAxgkYlFQBHOaHFUlyTOvMcGQFHiG%2FAAdrVdz5Sik6afOQw0qAXF8LYvWqfc7qIUU0ZNFZfLA3uf685AmMeZw5zZZTswUAfbD4otyC8f%2Ba56EH9Tc77U6BfyI%2FYKPrYmdjykYKQ4Dp1Xwu6DxwrZ9epBmozwyfqdjxnHxca1tYP7%2BnvgLqtHHJAKcp7uj%2FhaQv5so0cWKv5sTdHnIDnKsfCcLepCcAkcrjovwWZ3HAqWx%2Fm0cvhiSTMEoAD%2B8QhdsbFLBj0jnuMQEtAa3cCKz%2Ff7oAh%2BXrsecUo4L%2B1fQSsRdmkPj2NrrbgZ7g0%2BkJJYGoUDqdbrduszWs0cnP%2FTlVcEGkfsnBlHNFF3yu2LUgwL9G%2Bscm3s407Uvo6JBEVeMPmPts8GOqUBgVylmKOoq2U%2FE%2FA07Ug5ufdVAX4nFUOqRuIk5wK1g9tgcotsAUzcKF5ONEgUNwsT55jrqDwN0Btw9Y5zh2ws1%2F%2FHrtj2CAyXuUq5rnf9TW2fhcGyqIddOevUWZWHdklqE4obC3AdtAchre2JHbidHIRfTqO98gPWrLHmG5f%2BFlRaR42nn0b4ZleY6EICvYwimY2J2EqODVXcbMW7WtDEdsVo4ZOi&X-Amz-Signature=43ee5a6eff194661cc47c477083984d27bf285339c8dec56d16cb564ec7ed58b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664UJLBRUM%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035459Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCTctgNmWK0%2FxBnX2t0wi4ZAxxOkoC6jq62t5nBgrN4NAIgbLI%2FQV7gSzP1xcfA0WJhl6IKtdxBeAEzP%2Bbg8ruZFdIqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIJLCCfYhd0qyx908ircAy7F%2BLZ36RizfI7d00%2Br%2Bx7yQ2wXktMKAQtEGjkkw%2BgY4lFlQqdeElLvzb5wWXOdPFlFaOeKJRMQNZ%2FLby%2BJgXD4S5o02wrjCIvvFQPux99oGAh2XZ%2BN7%2BVRgqf7P9KSW0Nu6kgNzso%2F8MW4WPCdcBfloPTWJVnYyojfUnp%2BC3ZrkryzuMF%2FBhKX65SAKGHuf0557xA%2BgSPgr9Tw3hP2hOemSiPzbzWAFk%2FlbxKRuD%2F0BrLl52JY6ilqhzRslu2189CB5m51ndCTqXVZFhf8LtCM0Ly1P0TkhtH7PRForoVmrhvT8mCa4f1gfkusmEAjsVn%2BgeawwfaqDM4RkjgizRiaw9LrKg5F%2Bkq5Q0R2b1qplTebEF90SeJX7H%2B%2BuPrKS151zdDgYNxaWeVY2cJlpdg6mbRxDQit6a5u6RBMZS7WWKy56uQm6Ax%2BJ4l2sFEGJQOFdRt2u51S0yXhhlL6o8mRL7P%2FI9loZCKmEll7n99jmMhIT41sn7C3o3yY4Iicrwd3zzaZayaFqoKWghx9DVGpMW2f87PWTU%2BWTwpLh%2FF2sOWpbaNtee9CO3BKNy%2BU6rMmE333oyEADxllSYp0jideaHXQ0QgCT8IbHy4bcfExo4uBTGSXdpIfnunSMOOPts8GOqUBdqll620JR0uaUccYdVaGQLxCMGxdbaoBZbHyhWW0u4x7wfT0X36TrG6OoUBg2hks8j56U0F4z%2B4c8OSr9h85RvnYol6Wk%2BeiYSpsXNu33bE5w1MY0E2K9foqSQpH1Ok2zu0oAOYwj6PcLH4j8jCJYxpA6XsYCeToKt1V088kTsip55Cew7cc1q610x3GknRUG%2BlWNyyZ3IoUlH2eTomC06mQrTrq&X-Amz-Signature=95071e2239e8669d4e978b703dc99922885c9b969aaad7a5801166d90c4056e2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZPI3WR4A%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035500Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGz0%2B1eArZB%2BMsl0ALZyVW4cL99jEM2I2yme%2BVq10JE1AiBqtcWYmaaPuU26b1IOfzayRHll%2F8mXd6lPGdrU2fB0%2BiqIBAil%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMuPeALlpmHFuaTPiqKtwDO4wqKZbo21nyVO0gXZB6G5y%2FXfQ082zWuLUkHWe1tdTasmS0uOdlw4Y04z3%2FnurwUhDxpYO5b4%2FPav51DITNyrkLQjYBHhKVXoCM6q096DBc3W%2BEBQ3ZdnXqTgSFqoUPh8KkTWWY%2B6pNqpnyXUxpO5ZSBetnRe0YU2QTge%2F%2F5hZeOUSvHH79JBhcRH3JAHT7b%2BJDDj47KAyOrUqjiNlKxAVv4ynQxtql5PAyHEB8jkHOykCviQPqz6AbPUNk76eGCoICTX5CMvBfNMEHdZZmnX781MdNTthzNickl9IvrfrzWduEYHUMFQ%2BFZvXcww4pI0UipyEC0pUGJr5A%2BGsDfwwRCI4FashYuZRVzAEKP2aVBTB2D3AVhpJJGRkxR34t1BmdP8fljUh2EbnHjc0SUNZjpaS5f%2B%2FC28kDtbLpwENCCML0vS7VCM1dG9BEqhOQp6PEDUpHYgcQoIhLLEhH%2F%2BwQ4GRAWo8IlQIGf0WvZfBE5rCMjDDlUJUJIgJs5B8aXwtyxuWF9sjUgT%2BTZeuIomWv4VWUrP9pqPYRoAApfH5w%2B9YiYFLDYqktQGXQpd3qfHHHvuHYNIZvKtDJmVXaYXvj3felNAhfnGFv50Ds1oZ0XGh9bNndIJvPTx0wspG2zwY6pgH5OnCwLiJfVTzz%2BrSiWsHaCqhWQF2NWcHJ0pkrh2xnxvWmLRnbMWSWc3CCfxk5g7paZG1AreMAgp%2Bg5eu2coOzdxVHhSzEw9es2hy6m1H%2BW7ldLdP5lCH9UhWpr%2FFpXZrVS0mIXgQIcIauIt5CVM%2Bacdl%2BE6FJqMJo0iLUAz3FzB2KB28V97x%2BD2bkkELKpX0dlTZYn%2B60DX3hiN9FItVmys9UrOEA&X-Amz-Signature=658b6abb2588dcf78102ffbcd034a8a8fcf60f254ed7264dbc5592a49584f49d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZD7T2XLW%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035500Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC2%2FEs3cqPmAWPCyglieZuWJQd%2BsG%2FtVjgyTdnCwshBVAiEA8MjxqnjqjYltJGGtxxrl1xjN1J7K81FNL16m7GQQurEqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLGQQ0NJTdxfT6UBqircA%2FRALwX5YnXt3XYrFmIPthv%2FdnL4CmAmQXjbtSYThdpTbicN10Vq5qsj5efMpbw0w3wc7cNcSsiIS%2FwFlYMRqmkcgTl26e8z1Q3iD5vQndxbGMMBcaJ3Ro1w3gpQrkkek3aKJGe4OmkrLMI37lxKohrqBedd7j2TooFqWC9VvMEg%2B0aX3DPKYVb84bSkGbXFhNAB6OQcuuRyrMi63iY4SbiE84e2miuNybcEM0XY%2Bhzwsu9ZBmsaaWvOqOEcvVj05orK319luQa27BrE2DiPBVvXWKBTYqLpxQ7a4KjgqYDuPSH6fuQsRFKwPJ8m0hOD7LJhTCOkm5neOCi8%2B3mSaRJWgUZeSmdPH5caWls0dpQNR4TYIRAePMgGh%2Fa%2FUbNWBsItncLTgwoCzoRz4jlcZN%2FByg4NueRzwbUOwshdMM449EjKGQyx9c4UIAr1tFDFVU2C7OGg%2FrOThwfhf0EKhZLB00iUgpos2LP%2F9pi%2FAV%2FYP%2FYNkNVFlzhHOE8eA7ikbHhbZStag65%2Fb4iI6Y%2Fn88NIqPrK1%2B4lYJJrpUGzen2anenBWqF5DBbOwaBu3tlTkVeosIH3LxmbUBWMRbnV%2FLBm%2BLNLoC0m%2BN6Hmq%2B2vtcam5WH7%2BlI1XD7hliWMOCRts8GOqUB3RLqT8dvW2%2B%2Bk4aU10C0OEACI0j7E1q9xIIN81r%2Be0mm4pB3QDt%2F2bIT%2BquQOUzjYyMFrGkc2leQ3RItkXuaQZbZetpcHSG4UkJJi38VpRA6nNq6K3GN1uRfpXACwWq79SP712KCBZ4tf8YQ7x3eIOkBK3f%2FvJyJrPAL9YQVHZPeSSTi4pNWaSB1qWHQIoN8DvkUsSlontjyUOFBYKDrXyZxPsGZ&X-Amz-Signature=14a8b8456a4d31aea0773644a1402d142ef8435f7b309a3297fd31a63a0e0942&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQAV2WNV%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035500Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHUODZA5lanMQs1zbVjNWJUzbVsMgGeP6eowSqzNF9asAiBY8LGwOEKtCwbjWfVsSZpiWX3QhioO3KPTrxCvVmY7cSqIBAil%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMzrrd%2BEo8ZZjt2HLbKtwDEVfzttEJQqsDnjBDNbjkXHDOH93gv%2FA2DVJYXgvGFO%2BubXyFUBbiNX8AQ%2BAV4b6NK1dchC9cxGNgaHWgM0LU%2BlM0TO7yjcBn64a%2BA4K0tsFnulxwP%2BeIaI%2Beh7Hb%2FemdPjmrit5Imp7TBkYyDR9D1hIKgqJanaP6mXM%2Bd1yt4aTawlyjtZ8qoOAqtHdDP4cAJa7kFCHdBGj7byzkDZge4S65aKus%2BMCRQLndhb785ZZAyosYki9zASZqUR46zrLJyZShxBD8hPgk6OCoolMoPG6sIlsPjWzmvXqZ7LonzttmzrrMtmFcxDqYDs2c%2FVpHpDcEpM0hUTHPz%2BjF56lsc4UzyPSX4iz3VgFsR0g9mFjZqZkL%2B5CXoQ4j%2BwRTIDNqPs1hVZyczpJ6poaee%2F2iPRHx5wMslUDo8BAXWkGOB9CcKu3AD08sumWYPa46ctpt%2FsZCUh9eft3%2FSUXZ3MQnGEGfh4YOl9Yc8kRwBWgtZRHDoT615f6uNEUQ0n0y7IQp%2FbPLdXxZ%2FVlS5K3pO7YL3aR8vdy7dDAihndBwhdv9cSfC9PqPDj0Exm5co%2Fli7X8xFRr58nSVLg8i6LJmrxSlPfh71zI8mNlTCB3NbwKm1wO3sabr0sBH4O4frQwxJG2zwY6pgFFr4qyxvGadtayqb6Mnslnbs5vk4GacUvrtqa9laQGHXOEEQSHI%2BVAufzU81eROTu8nsrl2ldfKKCcXgtqH7nuo3P3U4sgmqqxo4tm66VZsMv00%2FWpV9MWNRzpNd39OEw5w7UIrIuXcoP33Lb%2BapCHVXxlNQB%2FNWr0DXwI%2FMlfp1ipHw%2Bc0j5QMF7G%2FwQbt5V3m6eXjha%2FdwGr%2BaxwJNDcQZ%2B1C6mx&X-Amz-Signature=3e33a8ee90174324c109cd44e6b3f98e0adc5fc863da484f141a69c2fa68538c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664U7L5AUG%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035501Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDoxOveKoWpd6jrNX%2FJcp%2BRf%2FvPM7gqF8S%2FqfqtsI%2F7CAiAkuAjftUOIGCY6lYIEKLAIR3gH8QVu%2F3%2FocSTWc%2FFMwiqIBAil%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMtMXGJcd4vMMnnmL%2BKtwDdO0tYpp8Bf7aJlvu8XV004VOwrCnL6OOANIaEcKJ1wB6ksDvW1ZG65kzdQVqqJCs1IgxpSTL%2BntG1kVtNxCTxMMQZFbEIMomUQSI43rihdZrM1zugZDD%2F%2FdCHPrcJzzQ5XVJMhI3mQ1oqvz%2FmUHVo6ZHLlpijr9iwxIfU4GPMAHfCpR68Gz8oz%2BFjiRWumz3Agmh9LnKGH9VpXs6aRD9nm%2B73ToolgmevxVV1HJZ62oAiKVX%2BZTFOAW9bGUnceGJ8TBW%2BDjBf7UTfsal8AK0TGkL5R72sh0YyvkapriXrx%2Fpw4Th%2FyqgzQxJ2LxVipgCxWckm50yjIOSFkXZ5ByCrP6V3lXxvd7up1i2S4g5sDuFRjSW39jkUUggBDN6SuHCwVy3BsWi00jyvF1jKbii832nDTAEOsy7f852spW%2F2bJ%2BPJT1sUanYuuIweBX2dwB1c3%2F9sOaCT5wF0L4gxB3djglRIUJADZ7P2tuw5s1EURAPR8AswpbOgMyUdCGUlz3RycWOc0J6Ho5ju8jztZF%2ByVAZwnBYB%2Br7mfHj2EdOT5vvCkRBh7matzOFVpOU5GCSo91PZHKAOy40dZW9Am%2F%2FKr9P5YdGmQdbLYRaHXwC92gWtaIW0gUFSyNTdUwhpC2zwY6pgGxKUwSe%2B%2F6ZofaYlDld6FOqNLfgBYQije2ocEht9lSEk1cgGNFDaW1HIxiw3dDz22VclLbt%2BnjugKragNI%2BTsS7qskBN23FQeslbHQBh%2Fkh7ujiF2kFqJ3nRtXL%2BYfCmRCR2DiXy3BbNBN4I5vcKNeWwy%2B6JlNN3lhEm1SgyUfysixdB6WBTqa%2FSjoedqbVs35KNSda6FRCqIDkf5TZ5hrJUyTuzuT&X-Amz-Signature=8485be27865242b3deb18c31edc9276dfe2937d434123a085a23e5a0e76bd8ff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667ENZGYHO%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035502Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCva%2FgpbfRSC8PXNI%2FvEo4yoiP19GQCXx%2Fi2UvGCb1AHQIgLlCqihIVZq0PnxkvwxT0h9vEKiJ2vt2sjvFfrekeLuYqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDL0SYxOy%2FnROnGXKtyrcA8oJBAxOgS6ErpHNE4n1%2BcfJejalSwNtV%2BKsdCuD3w01DJybbKaPZUsplMS0Jo5xC79KU3dexRI%2FxsyZJSU6CcsVFRgyuwBKDWTqF%2BApwGeuBfGCbobB2me%2F0gSSzLZnnVyvwJNJdhkqMEnswoFonx7Y312OidQMeGZp4gwNCf8nEnvNKnb5JFKCeJqPOhgmQSkFLChnFxZ0TFupwOK6yIBN5WSh4LfKK2GCf0VSX2lfG2s2mbJXCuO8v50LJHsu0O8XBWkNJCEVGBqQ3cYnTdcFVsPmuS8yM%2FVvZOK0ie3qodCIKNIpluy72ENMlXCn3hHFY%2F%2BQjNXRvGeTciJqxANx%2FaOxA%2Bdpo2i3zNakBLIEQHh4L6unLb2eShtFJHKfsO7oXe1lOdQrFBV78BzfdgGUl50TtBqvLed3IA9lDwsuZMrTAeANs6iBGrYz42bSU9WsnOnVePwWMR7exogUntyLjtD%2B4WH4W5s%2FvORUl4LlsPEWI%2BAXdxK65Pa1mXhGCMr2LAe8d3y8fi1MDPNuzWBx84AmmjmO06yxUSqY9BCC1ewmbH%2F7Wul%2FCcd%2BiJvez45fiqQUg2X8drAVzkS6iDfYR0MD4S%2Fv2kOtvWFlgum7pocLXtBAY2TlJ3sZMJaQts8GOqUBHJbiXc2h42RTf6ETPci688u3nox0zA%2B9teuHXksBeUve6vBfKwSTcx87r6IuJ1qhpFlo8clu5cfKuAzvZ1PMOquzhTRBlX%2BzFMtBLgzhft6nJOfBQdPWBtmp%2BeuTTjw1Z%2FaoLBCU%2FkAcHPFhWpMJTISQncMcXcnSnVE9R4fAEUeLQEAihJ%2FbKvhUKXfUsWi3cPJc83a5UtsqhaZ4yTv1sedyFm%2FR&X-Amz-Signature=b86915472b86d8fbb4012cfd8faf84ca48e3fc031fa7c61c39add01416d6b1f9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667FTKDUSE%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035502Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCH2UBS4%2F9XHif4l6HpMrT3VIwmu7rXCHlUk0ybqilWjAIhAL94Jep0uRMk94UzzQ7eXKET%2FMn6S27YkgZhRcTlZ1jcKogECKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyFTNWQpBuO9BIsTSkq3ANKQBmHz3%2FRNty0rGsPnoR07DSZ6sLm02RaMQcliMJjXlNFKOuVLhp0U4X1O2EPePfWsbbPYsgomn8Dmspjl%2BjZakN3%2FH13UHzi3pkakNl2%2BqGor2emaAcgfkMBgCd8weWvqOtpE8UJZXdhzX9cDQEKYF3OJQ4YT5IFI90Rbklq3gIjGvcIhfEC97TS3bEVTJfWNk%2BtH2rp%2B3GisBhisoWf0Z3QEdtGxLWM7bf2vbnsH9h9cx519cVz9g2VERF1pWMwPOZ9aLHBHOtmdkH7DjuEsVkZfLnWGnF58RHuitRuRJMSJWrDxuDaaYzvkW9iltq2FRbC3baWKsWDD%2B4JRF8iJyWObPou63rIPgyxTPKUEWtDwgfrmeMpZwNlZ0bDSlF3ehHUMqkhoxpTgLLApIDVP1OakTh48A9K%2FViIw7v%2BAn07ZGBSquyOl%2B9MxFFHIVWUKJSkdtE50pnaaI4fufzuTPvP8CW%2F7zBbdlXF3aW%2FSFjramIKda9VD5wziA7pBvzemPa4qUQQWzgn7yOkes4O%2BNiMnjFfcBWpLg8NHN8WTuZKd2PZWsldgW%2Fz%2BE7t0WIufz7uXYjMl%2BSWdwRUy6AlvuwQ0mx6ZjQEBvGgQmGuP0aAw2hTyPTWxRcQfzDFkbbPBjqkAUI2AoXGN7p0Lkkq9%2F4DJgo51xoa9sRUWeLX%2BPyV6WFQcguG6PQLzF8Ci82oirZYrWt4kk673SzEz8QePjTLY79kQWT%2BU73MpNYefiCk%2B2t8B0o0wddpnb7NG5034JHR9lgIpQgVvxI2ZAkGDhg3fgtQVObWGFBHjRHt7Zx5Y26mQ9a3mR7q43rnO61olrSYeA4YrCf%2FHWd38ZXpnvBWJz3A1O%2F2&X-Amz-Signature=26e0ccc09fdee17e9f14a7efd53a0f5eef7502604878e69c581f80855863e665&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667FTKDUSE%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035502Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCH2UBS4%2F9XHif4l6HpMrT3VIwmu7rXCHlUk0ybqilWjAIhAL94Jep0uRMk94UzzQ7eXKET%2FMn6S27YkgZhRcTlZ1jcKogECKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyFTNWQpBuO9BIsTSkq3ANKQBmHz3%2FRNty0rGsPnoR07DSZ6sLm02RaMQcliMJjXlNFKOuVLhp0U4X1O2EPePfWsbbPYsgomn8Dmspjl%2BjZakN3%2FH13UHzi3pkakNl2%2BqGor2emaAcgfkMBgCd8weWvqOtpE8UJZXdhzX9cDQEKYF3OJQ4YT5IFI90Rbklq3gIjGvcIhfEC97TS3bEVTJfWNk%2BtH2rp%2B3GisBhisoWf0Z3QEdtGxLWM7bf2vbnsH9h9cx519cVz9g2VERF1pWMwPOZ9aLHBHOtmdkH7DjuEsVkZfLnWGnF58RHuitRuRJMSJWrDxuDaaYzvkW9iltq2FRbC3baWKsWDD%2B4JRF8iJyWObPou63rIPgyxTPKUEWtDwgfrmeMpZwNlZ0bDSlF3ehHUMqkhoxpTgLLApIDVP1OakTh48A9K%2FViIw7v%2BAn07ZGBSquyOl%2B9MxFFHIVWUKJSkdtE50pnaaI4fufzuTPvP8CW%2F7zBbdlXF3aW%2FSFjramIKda9VD5wziA7pBvzemPa4qUQQWzgn7yOkes4O%2BNiMnjFfcBWpLg8NHN8WTuZKd2PZWsldgW%2Fz%2BE7t0WIufz7uXYjMl%2BSWdwRUy6AlvuwQ0mx6ZjQEBvGgQmGuP0aAw2hTyPTWxRcQfzDFkbbPBjqkAUI2AoXGN7p0Lkkq9%2F4DJgo51xoa9sRUWeLX%2BPyV6WFQcguG6PQLzF8Ci82oirZYrWt4kk673SzEz8QePjTLY79kQWT%2BU73MpNYefiCk%2B2t8B0o0wddpnb7NG5034JHR9lgIpQgVvxI2ZAkGDhg3fgtQVObWGFBHjRHt7Zx5Y26mQ9a3mR7q43rnO61olrSYeA4YrCf%2FHWd38ZXpnvBWJz3A1O%2F2&X-Amz-Signature=08d55b76b53541f021095264315f31635cddf6a27f97006cc36a2e025f38f926&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
