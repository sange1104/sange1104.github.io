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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RRWJ3Z3E%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050010Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQDM8JvBdjHzaFFNGcnCM0StHSV8kMDrWcLbT2zBiUu4PAIgaUDoUjUsjKFH0jKCi0OmGD3tCUh47MOxw5q0AJ1QesEq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDLBveV1Riuy4O9kXySrcA5hlpeOtz1SJJtiltH6Xb%2FfJcHONMaThYUqFcqshWMCsgA4Lz4uo%2BVWZv8IvlSLUpl%2BwzFMIt9bJb310xj%2BymbPAwCS7qi0W6rB8%2BWtWDdRsQyXUx0yAGXCHjOBw2EAO%2Bz9r1FMoGFFSsfD5bXPFZTlomU%2FTUPAIr%2Fj1uNb%2FISUrDY5w%2Byf4oTQxlJHtO%2FJE28v1E11iMxoBCMpzChc55hpKWq9U6WO8L3bgHwWIOkwop4poo0h%2FkOxrYEG8WhLjz554ltnJHOnsQ5wRQBMGbicHu7Vxz%2FsrnWEu6ccFzQpouDsHPOPoauxk8dwiEry%2F%2Fs1nz4hbbN28PH3mAKaajmsKFxaqfBaRH%2FdD1DPXzpqiTCXXhke5d%2FaqaOI9Nj%2BLTWEM3hibkGNjFHK9MUM%2B5J2eBl3mERHfdPIjFbM%2FbdCf%2FwD80bp3TB%2BKnnUyMu7%2FyI%2B2bc%2FMkT5lP692evL7jQdk4NogoOCT53%2Frj0T62XBfvmbpvHpOlzTJWvf5lXlr64FYUArKuV8aXFPNUrXAxSx%2Bia2n1WlNo35n5tvfwRKiwz3Gt2IT0jZyi1IMkQv%2FVI6NoTiJcVLXqjeW6OiXQDhxPJrxEx09DHLUr6UrOSlHmF4pLs0M1PSnQ77lMPii%2BdAGOqUBoTOS7%2FhrSQ1ugs8nC8NHHLY%2Bo%2B2dk%2BHeQ0vsIEvQdcPy31x3RbgA0ERbaXnnZfkpgZxkey5DfBZ5p1okDXpvPx2jc6%2Fg%2FGhhvZqGExIIMILL%2Fq03l8Fc3b1k6CU3MTJp0p%2F7kk9pg5GbHt0a8%2BYj3nFK2p2qBSuXirEHrBAWH6ShyH9ZIyDf8ja%2Bt6gaEJodZiqgSWQhnHRwyFI8H%2BRDMPqbjIJQ&X-Amz-Signature=09f7ed47fd6d47447bab079ed6cd340cc62d621616106193d4e2ab88b89dc3d3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666O3AJ2C7%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050011Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFUaCXVzLXdlc3QtMiJIMEYCIQDdym1ba9CBoLFOeDV1gmVah9XknHpME0ec40OEU47vTwIhAPzqdmUlJL8G419PglQbT5YP2ZgUY72S8rQHvFLucuHQKv8DCB0QABoMNjM3NDIzMTgzODA1IgzlUWE%2B7W7vpd2%2BFB8q3AMRLwSMrOO8MD5ntEdUWmgU19CFSTpTZW5jXWLLcqUv89wMYneaNh6Aw5sKmEzB884d8tnbYoGdGvy5mIpXkgLFK1%2FdTYFonVBeN7o5IROp7ARTigpyP3eXZuetECqhWu5%2FbkbCVzBR2NzLh6Aiq3lRlLhBCG52aH4HvswADHYFN%2F9k5sVGfA%2FKFapTl5hWPmE0VwvtP%2Bo1FCYTTc2P8JDElBFvOE6OeITYAjRIeochjbCJBE%2FGkr5u%2BR8QEjOLrSBIY7TgoZCv1QFjL7KbCrTmWGMnNDfTOsMMmXYxIMah21yA%2By4zxw%2FuabYsvmra2iWLcVVAPDNGr7qmwAphfSt073RkgUeu44JPsxIQPBFuDPCJX%2FvH2lv1IWG4pG3z9HJmHQUoHKQosDTmBh2AyfD62uDcoelMDfA1EGRn6HWX5NFqyPIb9tSWz0V4dti0PlNlHLY0OSeu38NundGR4sD8yKAHw8cnCn2AlXic1USnFcgkVyBbe6YIAG2VP3kODwIWT%2BaQrTPfx4ZQ8xA6FmyB%2FrR%2BerBSH5dARzTkUc7H2Gre%2FFbbofO%2FqCfnjh8daPuN3TOy5%2F4wlr332C14adXdbGs9MvnmSAoYroatdQmgZpxhcHaEEd7BtmKemTCNtvnQBjqkAU9sI7J%2FWoW6m9L%2BIVmRrmvxnL8YiSyevyDe2safjyZjFpCdzKNU%2FrYuD7N7%2BN0c191YN48N%2BzIaexb%2F1GWxOINQkTMQXPMZ8F87igExsFS%2FXrdzChO2cs3Sg5ArJiRCFgQoUymrJ61eiL%2FL9FlTVGPKWsjC9OBZzsXkOaaco93pF%2FppmhiqA1N%2BFzJ0Ty%2BMtAxhCS1EjmK0XoTtXjQOYFL2xemq&X-Amz-Signature=3f26dd8038f3a28266a5be0716390822b9276937372ce123d014b21bcd988881&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UB6CMS3B%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050004Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIBZZ3ggEMwdRqWPBtBkNbJP%2BwM5hkiX%2FgL0Kf80Jid4xAiBeikCwiVwIv%2Bf5Ae%2FN2OOtEyoQwMOn58kwbdpAGnedFir%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMyokHr6KQdd4auPCkKtwDzqjQzaPDpagNM05pgYUBX%2F%2FSW3cx1K7Pg8TiTQsEI2TSeym34uG9Usyz4r6ISslzm7yynwS5K%2F2FsSKv6Jbmo9TSGy%2FS2CvqZRlf%2Foh%2F6q5blzrY%2FMYepzC17iwp2hSFoSajWcnuuMObtZhjRcrJsEvdP8hlak6odPkL0b1HanE3wwBDcgVjDJaY67nIUDkGaRvNkkgx9HzfMP%2Fj%2F7YVZbH2o84yaKXQpqVdk0ohWd%2BL7rQgoJLJi5SFCuiv2%2B%2Btdxjbmq4jdM8KOSHrEi7%2FNsVg3ziFcF8wzcWBRgywMHOko9v153NTZZILXYUxRgRIWOaD1cz7gkrcs6u7cXiVhnP9EFk2OQ84tMqsfk%2BOO5qs0y5c0JxUTdUm3%2FBpZltY9b4j6rwEe7jFrqYXQQX%2BgMjt04IknIhjlr8c2sWRQi9%2FkxCI8nQkdZ5S4jj%2B1%2FEG5IfeOB%2F2dQKWwJlZix%2BuM%2FT39aXrAvrc4IX2L5fjUYx1xFZMGr76bcXHFWln9kUib%2FtO6KGBeYppSNeHN9mWXoxkssg1SlgsytgZYyaJpY8GuyqhV71R%2BvOsUpjmhTVJtORJQ6oJF%2FOcn9lHpnPtu%2B0HpSPLYw8iV8vD4Fo6Dznd6XkaFkQxVCxf1ecwpqj50AY6pgGQVSDiYdqMQUV4Cu9rOzZHAKH9bu%2FNngNBjpv%2FlmUnsuBezxxZE67YRwzJcHC0PUuCeLPDxDJQssbRRAeklxSMrDhbSKM7Ose3FoQ5vbudau4RiLw06cZFQKgcQcws7D8yeSfvc4RP9dOLpi%2BABVyrIP84efZXmjktQOpzw4nUeZ7mvw21mrxYIW23wqCbL%2B32%2FrJg%2FokYBi5iSHCT1zEe9J9zkr%2BM&X-Amz-Signature=c12767b1db8834800bf455d53a7b953520abebae05d5a3a8e478f1d11a84cba8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QS47QJ6D%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050017Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIB7APo0GCDIVIrbzcYvWC5eNZMdktEBG6QDy4NqQxhx8AiEAzQFGFkZs5%2F63iZNBdjrRD5SML%2FsFlaMFep%2BI16AckQAq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDIeOKkKF262ixoYfHircA%2FGKjI%2FpinMWjY%2B9762cXmjGtN0TCqwdCuHoBJ7pY2vKuW1ckRsYcPaj5raqVTUnV0rryiCMvBgvSM12wcaBYHThWfKUIDs6EiJJdYdrB4WrlgO07GI8o3AueGBGnPfCUNyRP3KSeSyaZg3dOoscHfJVh4omjmssTLlazQ4uQoOip0JjXgtwtokJP03P2Mzv1gUblAkY%2FGiGmJL%2BPKoPBk8qYvbvOb%2Bv%2FsmG82GAmskXgXX%2BHf0nAKmoNKatjQM8M30m3Ir5pvTa96N8LQAvZXNmkSlgxASvHYFYH3N0m7W04QbjpDah5p%2BIHWVaHPYDujX1bZvqvclWvZRz5feX8BKbQB784u8YT23HdQMpiLaWynzTGeF05BCVlAQg%2BSqZ%2BvgD0GZysJjjbEvfCVC7HjgVorcwcZVnB%2F%2FyBZVWp8sE6GCfdFMhZwOvaXnfi3MMtfX%2FLZMuNG%2BC21BCGghOcF2%2BfIODFST4lcZrz7KQ%2FTViOEdiFgjH22MnGyRk0IeBUmcwD%2Fp9p9qNHVX7vb9DEP8%2FNHevTO5eFhZV7TsQe44c00C0IJVVlkbaeJtDV6Y6u9RVibLEyBjNKag%2BYIDHaWdQmOKCHncKjIt4gTrv5DQdtHPMPB6HwSkGERE7MLat%2BdAGOqUB%2FQeduaOQGP0khVJBtayHNORcaMheLdgJRQEQ4d61Tfi7%2FqXVCXBRHKEL5FFySnYQnIjyqxwrxBAfhoYvQlrcCU0iErt3fveelYwz1lauFnrSgDsoFUNnn7pQiJu93Cq2KwCRucNzLp5qH%2B6nvWG%2F%2FmJq1UBHqrKXtMd%2BYcSbsbrrxsWkadUh1%2Bk1iPfQU07fhXkiVmpef6FkjuDHelBbgK1H%2FQSi&X-Amz-Signature=5fd25d7d3fce2327718c507c32a239f518c4f431991c48513be5f8f53bc20dab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RYG6ZPLW%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050018Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCICjl9keJA%2FZjIrA2RJUpBwBtNwWjcp1lSTHMvTMQpa9DAiBulWCtgRqSgNx3M%2BoSY3M%2BEMk0eLzHS8kRECQ0hWMkhSr%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMR67f8Nm68YFgxOTkKtwDiQrXWzrpHWGxzwuuuvDR6DZ%2BxJKCc7SMLdQqLScjBors%2F656XndMZgm3fLTU2i6Ut%2B86RTR99%2Fohvdn6vrVE4VbWr63fP8Pn4lP4LzYRSlDxs%2FPYcur3i8Wk4SunCPgAycT%2Bc4kYGOEy3KWlTdtoG5OTEfpeMrGgr5c2wGjRqq6BA%2FBDvI5YuG53l%2FL8RyfqFIzPds5MmFlTSQwI9eT1VRfvK3mJt15K0ZKkZydECPI0DROYv%2B%2F5ykN0W4KC6KB%2B7lsA72cSE5iXbnq%2BdeYoMEQJ2dEtJjczM%2Fk33O%2BfGwaN5wlnRghx%2FfTwEHb7ZtdJnLNTP0CT8V1qdsGaGmTl8dOfoud%2B3eV%2BEG1k0b4D1RrxQmK32uJcB1gSEAzoG%2BHqM%2BF27tQAe1jJQKmOuB0yZ0jViRltWWu7TB%2FQt8aJF7O3ZmyCZtGxtZgV7Mf2EEXteeqSP0q0iz8Mr6h5Rb%2Fdyr96UsS3bf9JB8znm1YM6fm9jxScxH0yPiNfSSLEUZPQJI9hdjMBVeg3efMis3U8g%2FxtsPtIDeocNvQ2MgSJFJ19ylLfOj98qawCYmQ6BMAy%2FWkPxS%2Bgbv%2BvSklVpLm%2BprkcbitVElU9dJScm8h9HHn7U7li%2FY5JsaNH9EQwoaz50AY6pgE18f5NRqGmdQcLFQz8yZEIungzrwQVgXpz6Oh8%2F%2BK85lzEb6ocMxKAPjNBX0ENy5GMH%2B5vuhqYomJKUgj%2B7Vu64xaMp%2FxdOGSYiVJQen5hIA%2BZJzKvDFfHO0iw3HIt3gE7YBOGC%2BAoDAhRoiJhz62vRbG7N%2BAHSjwsQfbL%2FFegxd%2BRvzLlysTDgd9jy9vQOFKA6riQyQ47ofpmLsSjENS3CN0hreie&X-Amz-Signature=976e184245fda94d70fea059df8094f049d28ec230c5d1bd0be861f1a97c3557&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOHWY3ZC%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050019Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQD8%2BeBF1dRYYVF3xOSAQCo7zbRwbzUsWpTcYYc79fpX1QIhAJHT9Rq2T4DgtYdcoCpgAmrMpVeJ2ZDKzdf1VL81dWDdKv8DCB0QABoMNjM3NDIzMTgzODA1IgxOtK7o%2BIdKihg97FEq3AMYLtAQ1qNfiwfwnJEjQ5HinXgmYgdLkKYMyrt9NwHyIQV0xItLegvwZQIVsKfjd%2Fxuc7%2FiKoEcCZF4o2jnhg6O5yjJVCzVOGjahPHIkD8soUr%2B211OaQHsU64ub%2B4P2Jeg%2FBYxNhyFp8hO4kYYHU604pvYkBCXDvJjxM1oPABjvy7EbMvQPh19lYx7Z3rsXvgvqW8zyWIANgBDbpqAkaSYNpt8bbX7krje%2FB7%2FPbNb8BhAzNnJpfirmEKSiSKvHSWsKEoU7LlF%2F1mjWxUqY7suqQTYuCF8kv5czNMnXiZI74I2Dp2%2FjO1m68HiRBvcpXSFzfy5uTjTE5h%2F7XUhzBhoinX4Qn3ER2ew41oaOa%2FuBKQDtqu9XJtv11zZZxsfBUBm7xLS2E%2Fj%2Fr94AD67q3saDxxSRdEL58N7efW09Q%2Fi8Lw2OOnPC4YmrMySkdwELIzdEGqataQBC72eUDHxtHw7Prv1exfV81%2BYajTAj4pe8Qr2nQEwqc%2BDjSH9p1Wa9SrTZwY0IHqo%2BvitzMukz52x9endkcO3aVeEFy%2FbcWW79pV2XpiE92l%2Fg7j6%2F8aqP%2F4WFOWV0pzjsCEGZFf%2F5KLfTdpyV9nOvpVmQJGg2EmHHj6IF8rnjv%2BGh2tSQzDEqfnQBjqkAXhLRFRw2UPuXH3DuX0KwTkWt6oZgjRTKC0zJl%2FlTmzEMdA%2FWrEkMbOQZAHROI2C2M5nbCgW4JfUgTeEBIuzEJZmiHyNjZQVyBTcikmf2YE0AiUKVRpLiP33p%2BrpOK7tBi0rUlpYeUd1hk30s43YFCOmIwMmy%2Fl9DFCupO1W6rzh5K3n3AqffmOYrjlKsaLkZLF01MbPQVpEOnC0iawGXsfCjteA&X-Amz-Signature=834804e75bdc3b816f47478d64ed42269bdce45fb63bac69b6d5d1274da237b5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q3VJTFWU%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050019Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCBIjYJVOHt80EC%2Fy%2Bgdgf400gU21l0t5T6K7eNFpY1sAIhAJ%2Fz7v3qOx7s%2F1EDJKzfo%2BffCoDb0ypxunlfNgjBWc7MKv8DCB0QABoMNjM3NDIzMTgzODA1Igw7x1rPFd58nOW9ijUq3ANDASzyBWipB55quyfzYg94sJskDcTpQqTLG2bovg9jgb8%2FUk%2FCdksuCqGNP0AnzX6SAYCJrtGK6LrwopEf8rnhzhXQk1Om7FH2W1h3UQmnPk1Fd7DvYYAbcdgWI2KnTaLHqX514V9xaeHVUn47nMbj6sleiECJtSSTLxSCDWJxVKmG8RNDhkr%2FmGUd5aYKtEovVfAPai%2FQnbUiLHYRvQDe02HPLvZKl0zuWNfCFFMSQlIFsWLqS7H0EbCA%2FgnNvE99zZ0QP5nfNGD4H%2B%2FVPoWssPxYRy%2Ft6gVWG10Rd%2BjKiXmal9VLVp4Al4eiuyATeaj2Ed6JIf6BPRPzpui7A0uw39pYU3GolRhjPJX5k5yHkAOx7gUAM7KszBat%2BLWNxs%2BUKbUn3N9GCiY1t7XOuwzqW7G7J%2B2ltRV5IaWAgbVGNrtoiWnQCch6TNTJj5ch4%2FygUvngVzCHUsMmkfuPpYDskS7UgTxTWAlzp5il6wctOzQSsy1H2zeBQxtvacPG1z2x1fx%2BKCrpYHtJgaTb9qQwiLZ3%2BcLywHvNSTzrfUEmF9al%2BaWAgBsHKdee2vb97NCVSYM%2BVgTm6tdjzMZK3btc7Xu9pzkdD2SlRhqOeZDEYkyyWufL%2FLFCUMBC2zDMpvnQBjqkAXjkSpnehLlSLlIrn3%2B7MO3YREcd%2BzA2QQKV9Z3AmxypvKp1ih%2FGdzKAM%2FA7zfUUqg2eI6bLteV2Q7%2BidN8kMcEiWMnuor%2F1u2EESeFh7ZihVUA94zpdP8PY%2BoVm%2FrCgIndxm3ZfhcfsX9teijnxFk4RzJe7PTlOCdyW8IB9T3WPtex9Hrn2sw3kVyM1481n9wsc9kPKMUxhEJHdbFWx6EmXllOS&X-Amz-Signature=833f90bc2497c64b1aaca2174d9865ef2a5b72b3e3819bc5974776440c7bf080&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QLF4WW37%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050020Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIDjgAfp2rlUwSxMNutPAwmZQkOidnnChROl4yspvJJRYAiEA4e4L9oau78TdRNjoRcY%2FOUf%2BAl4SZ0p%2BHhr1x2DlTUoq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDOgaSC8KVSYVjpWGfCrcA6M62yxbG749e6sLTVoLv0FZq5f79rkiDPJrY33UDQlvEA0qqHFRy0S%2F1QmO5ikJWinaysdvJyw82AZ%2F0fN%2Fl0jauvT7fo2Uqhe%2BgTulPFUbz39QU1eoemIf765dS5DyETz60MusDyixuyN5qa%2Fy00L6x18YaTcm7dsKCX8putqiNeRrGxB2j4Y5jfF3pW%2BGUu5sh5qwmwVk4mOYoTxrRpCWuBLOpc0LJPFBTmgZ76kvzc4sP4g87vwHv9uEiqO9CijuKvO4HLqz1L9PU3kTuC9nh7qbcSuFv3IZDwkw4AxT9nhFgcae%2Bz8ILa615IQVImgmuSNfsPkjdWocXZCPo6PIpCy2rmsH8Iip4vt3hzAYocPwbHasR5RI9sVOqKnd7CoTBEwbpD0DrDOvEN6upE9%2FfAh7CtzRZMfctVKPMXd1dEWX0M4H1faBJlvWcSy2Dk65dOGssCkH0m4lY2HwZr4Y%2Bq0X2KpV6C3jsmIXXoCABupzpzl1AFp9m9d%2BGKdXi8wGXZbp5mJ6u4oZmFuvAIPm1JzZsPu4jUzwNCWkFJBcF%2FbXTAex9SwnsBpAMVReBhXZSdc3ucZWybTL2eF%2Fmy%2FKAhQZcCI5cIEY2TS2hAPbe8HzCOmzqJDedenFMOOm%2BdAGOqUB3pn7wb6pGGvXxK5iHxRWmPMHQkeLcZ2HceYKLpZfTZbF9f5OF5yyr7QMjAKv0XKa%2FSzuA2d16zJj2EEWjzprcWbfAy1hbg5QwQeceBnez69%2BJSTs8qVEykr31%2F8f4Xb%2B9dN%2B0dxV1VROjOM0pPNMmzDgp0AmXl8QigYQj7lwYn7qKzRrvnZ03T4mRcGafrie%2B8j3NoeIeC7GoMXEamtdK9vC8WLb&X-Amz-Signature=6fa5b47c25c8ad7e516e37d0a0280b1df255c55b90638ba042c54e7b08b8550c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466US3O3WN7%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050020Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIGZfYAm1rmNjka3APnWylIJOAYkP10OZrgC2MSaKWFqgAiAFMYYzfRfD1KBt2oz0nCU0S4CeKnD4RJ%2FPxvcD%2BCUgoCr%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMGb%2F6RJdj2%2FSrhvkzKtwDZlnIoXp38iuYTAaKzWIgbWk5r3edTuTdkskr2R67k0zGDKHkcVypGXS2KjEvpSx40uFinFnNS3jtjE9jfNr5l6UN8JCSX2ncSbpi0xHPwG8QhIJb3aZOeraWk%2FcbUX2pPIIRZHYzqK7LDeOO9oPBxw4wtgI9MCz9rYOv0zmVK40j79qAv2evioS8HTQt6BJoSP4NeXlmv2IB%2Fz3T6drKA7D9wflRiTllUSyRnZansJw1%2FDByvmb169mZzEF08lFo3rxF%2FXxPgc12JxWlJlylyycx3x4A8NJeGbWUVNj84vLqqVI5u36FMuImHpMKRTJDyMGJ%2FkEx96DPoz05hiNz22b63kvEvyEnOWS2fXIOsZ4rGpSQuTWSbl%2B7i55UBo1zQr8s2A3b5pfSY1Sz6in7ZZrTT89chxgyfqZUrpsaU7rsJbC7VF%2BirJhSd821pBKUp6VGC4sYQKZ75R4q8RIRX6uEYzbZVyiH1zjBgE1H3M0XiC2h25mXy09W99WTBA2S78v7Q%2FgoO2HwEMtyvBTfQtBPQsW7K3NhkkU2aG6eMglvU0EnyWaV2n9J3KwbrhhFzWGwAMOxmvzModmJZq%2BQSFsQCIPxC0s5sS0IM9vavIBVnx3mJFghN2625UQw%2F6f50AY6pgEyterWP6j9Nh0TYFOjEiwi82x2epOlkS1HcmZ%2FAyxFIwpo9m9Ky9JyHmTzBuM2C84Osyc4VGbFnTIsJ%2Bl2H0lRyaXFyEgpQr0J0f9iZao8rdc9XD6vBgDa97CDH8K1pEg3wVYxswn7WRr2JRl%2FPiY%2FtCDb6M4%2F%2BhRgqINSMlrP4fo5Q0KX5sB18m1uj7xp803eOq7E6EUpMhfLt3JB15%2FngO3%2B4VHb&X-Amz-Signature=2d017fcbc2acdb301f101f5018cd533ddcc15396df94f1b2f66a5c1c05acd075&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y6FSQOHD%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050020Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQDgXCH0SyE92sl3QxtaFaIok7aCGFT%2BYEfuUWMgJdv5awIhAIIyullBMp1IhdJxt7Ro88onU4Fu3eEZWQaaxdLuXop0Kv8DCB0QABoMNjM3NDIzMTgzODA1IgyJquTCn2DPFlvuY%2FIq3AMiANFnZUp%2FponbiZPfeY5jGX8PT7%2BR%2BQgD1GFcbUspqbjP%2FyfJxa2q68RsZQHzOGVqWOjw2Nys3zeSLz4ADE8FIpMwocrgckfRSVupybnkieGcosU3FQ7OMOWzn%2BQVLIvXulL0WczYC6UoNqm22p9NoqNs%2BjUCFTkQmK9Nei4jZqeSxo%2BZ4o%2BLFQ0WvOBW636ZlgRi8mmp7IZd7NIWXAxWCZ2SCt1Au%2Fpismlj0HHagIH7gVL9z3vuwaGhCHXjqcte9XmVeWCODFgUZzk%2BZzzrDLrKl1FTV9Zif3Z%2FWC5J1e%2FU18eb872LQb8xglaFGHyljsee5MCLEh8dkdUx1o7TV7jApUjgs7X1UU3HJmGumjc5p6uE74hW1657TM9UDfsuY5QeXzAUQFVf1VLt5WvBgzwVIJdr1Deo5Yp7wrm5Cvtn53%2Ft7PhqAFC3WHTs1dLWe1Pspr1EK0z5LSagPWseOlsJNdl32oC%2FFDcOqcAp2bQIByzSREhCiK7EoKbguBeBiUhkgIU3Ke1LYnfsGR%2BbzoLJqcO61mmD%2FQj919UKsZYC7IxRrvz9NtXr7fi81iVOvyDBWrzAMxJn777vDUOkf5KUIAW0l3UmoNPqlZmItMC2M74o60664F1aRDC6qfnQBjqkAUjhfkVhIukEH9qhhmvRo%2FqUeSwfy3FCxiNbZ7OH%2BLTN8vkMVlT6A3IXbWhJ6hleLkBBsp0f%2FMhdRJ6oq1WVYzJvz3hmpt8sfqyVIqNcMmHZYMGl2H0c3AQvQsaNBsSDusl4iXJK85bzbfYOGBHbu7%2BorldA%2BYOzFBg5ko31kU1rPHO13TMOW%2B8qlLj%2F4gXTaqRVUrMEHrcDp9Mo5ttN1qkMLWnr&X-Amz-Signature=290b810477967c94be180b71f3df9cddd577d9c6aa58b081933ac456761b5123&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667HU72ESG%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050021Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCDMqDNLQye7XJnevlbefIAhcXwEVNnXODAUC0ukdvCIAIhAI%2FfRekKjQ7ZpignwcsZ0AyaS2Y38Ld97MjKGDgVZdfyKv8DCB0QABoMNjM3NDIzMTgzODA1IgxD%2FAwHBFSN8eYPV1wq3AMBfsjcuGiJAsZB8P%2BlaZk3aJoE0sIBD4ESAjg2Du%2BzDnwyrIpCpnwIl2R%2B3Qsan%2FjGO%2F34uQK1ogMkI%2B9ZiWPhkT%2Fff8r4W0c3cGwi6fFrVJDeGhHVsoumVh4HJjLp0Ze6Bl078jBS4gqKqBLb2uv8MYY3SxthE3o0FLzBfrgUKOJ6ktNKN8BZW%2BANPwBbAfbg3UiQE3Ddy4JMkJeEWJnhBF0exAXzp0jeccvmnI2yQRqMXcFSXbC%2B3Yi4TDa7DVNx5mvdPTanYQdzP2dDiWK%2FcteEn8rMw3%2BWxzopY0kCYOW4ijGHPmQlIiX7atrR65K3tTxfAAxwU0hdcRWFsbI7oCi0GZgGOqZosOjeKfjC2DmhEtyX6zoBLElDVeDHOyNT9YjbYp%2BpCx6iKvPEJ8mTDQysF2Jhk3ZtoVRy2Ud7EkGQMixe5Gtykug8qAmo09pPUcm7ZEYMfX41bswyCmb8GOxxKEvayP%2FV8FQw2Qr2P0kYI%2BbnFBa5KVQIT63AumINHCo193Hp9U2R1fhHOJdZ4Gpfadwwe65M2WZHVWvJqlxDgfoQ6J0y7LgU2E61OcPYESawu4iJ67TxPqaberRWyV5nEwfUbFowFgpxS%2BaqEPwHNe1A%2BlbGUchm8TDEqfnQBjqkAbnkNV2jDVtJ6DX1QfwwosEt6ilLXa6elEPpcIm2Tvyjhmpw1Q9q41OPh5b1o1aj45BoRxMjSJkFLVFLEM0Dv0Nvj3WqzimmIRd2djOVmfG9ElL1R5h6%2F9vzklNEzaRBphNKP6%2FkMfAbmoHr7aoqvFe%2F9V3lQOJ2gRkj%2FJpq3Yc87MLxTLFkGoY6p2KazuXa4RYgN6YDF0p%2FIvqYRTjlJmCuqm8W&X-Amz-Signature=10bc2750518aa65267dec049aa2e9a7e15fcd5aed4fd6f7fdf252b490ad3111b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664XQWAUTU%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050022Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQCeo%2FRwzwYZmBpgagrsnETBHVkNRu97GvqYa760TWFrvwIgboi33DNkglytewiqMm4LPqD4HSgcZuqFcwjW%2FqxGiDsq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDJcDkjwbYn5wK7H3mSrcA2IM8q3h1vtcZi4dp8XFoATG8KcCkvdonc3%2FtnP9aHhmXyN8PlxJYBZh41KRvfUA2sRzcm7lKO35WBVmMXeHuY3YlW%2BrirDrnMtHYjV38Z2WjeLiwYpsM0O8U4fhLKpdrcrWUZ1c7L7Z6PiPhSWpJSEAReVqRdh860stqYbKgGPC1EevWo633BMR5ivl1a38rwli1rv1Hcy8Zl9o%2B5%2FAM3Ny1A2Gnj1JSGLc4MMI5n1pxCurz0vbKVLyDULnkUjnH8tPtRCJYWJXR4%2FASm9P9DftdiyZF6uiP5LSuV15AcYBbGepXVx8fzlK4nE%2FjCOXgLwR2tatYXCNqMEdOjt%2FSjAYCEylKeN3Ydw%2FzUl1f8fYn8iNDss9tLUMvnr3ipJ%2BJmSFI4K97LYLrv01YK0zvLhYitGZos8FDAfKiTBT1OfHpB%2B8w9RK%2B44D3V8tUct8EAFufauFz8NkZd0Q2dOE3YRkx8MfgWjL8ka9dNGbm0GlzQBPs5UzuActCTV%2Fo91sxUMApIO1Hp5xSM9ETw7PRDCUVLPSZZIBefmZxC9GNNUBYFKNYNeKBWK%2BxMhDlAPTKKf56InHSFnJm3tOoqc22wNzRPadZ3wA3F7nprIgpz0sG7Vu%2Foau0qIcftzKMMWn%2BdAGOqUBryp%2B%2FM1claMsfkdEUoZ8zCEnNObr%2BigSmmaPIvH9PQ2o1fKxMMRjQd6PQ%2FrN8lPudQyCMankL8jq73vhH%2FOirxsQ7zbrNOZInkqA4I2w8DKbtnnPmePu%2FTrNUN3FkUAprtM45tUQC3nM4JzNP93n6hTO52Hk9nmJ9j3pOrstMKs9CaVWLgBuTO%2FP9mHxCi9XyklUgYIQY9j%2Bx35ZHX1oAmZXs%2Bie&X-Amz-Signature=3387a8067ef565d7b01ad48dbdcad737232ff6d5864ad383b87932d3bbd6ed3c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZYYCVNQK%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050023Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIERRTFWv%2FVSzB6xy9BlIGGYlP5U9QTbc4lv86ixQSLkGAiEA5w5R5R1gU6pBk00vMOpq0i4lbZsIh16RtYbZjAonNBAq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDJQ%2FrNjgRkg2Ktb6WSrcA%2F%2BT12pvNYCECVXN%2F7EraAA3ehPrRmj4LWDTFAYq4OqO%2BMxzDNr4LpBC1W2fssgRpieovyX66WYECCyhi4hijsyH%2FahReassrthZ3N%2Fkj46czUGrhwTjslDfuBTmnHu1k9g7LIJWTB70tYmc8Fr1rJQ7PXGoLT9nG15OcZRnofbHD7z0k3IMPRguob0MDZlYb7v3Q0Y0sgH%2FM2ZYPwY7seVjb2a6kSKgfibPXF1tgPtHYw4Jx0P55iNLb1OVTTQbzonN8n1vB9tDMfrtBPM2%2BZtU6x6xCqFJjftB1TgFgaP9KTEfWsj0xgA3NryW0SvdPgpOfwgFbt%2FAL4%2Bh%2BwOwcZRkdN7wuO5CboBQWVL%2FZFOJh6vF9fk58205RdUDHSfHs29wvfiVr0x7QkgLx8L8GjAxMgOz9efwgeEPET9VFIrlj1CZ6LbthfLsOLp%2F9dABA69L9Bu7PiGnjRwpGlbJ6E33nJ%2FmP4uQrW3aeYsNRJUSx%2BBHILSUKcuqopECEQA5KZQ5%2B%2FyNqpA2y0m8kEUO2Z%2BTWru%2BE8N4OfdsgDl1aer9r5EUMLuvUhevYqRMDIpdENtWrLFaUVjRNLnUw%2FAISGs2BGs%2BJ7QGq5xulJg8KW0GCbh%2Bz3%2FA%2F5QOT7u3MNmm%2BdAGOqUBKxd3jLnrnSqFl%2FXCE85pzkKA4OD%2Bk58yWRrkiZgR5uDHaNL%2B7zDUKnxGBLuGSFlljM00IM2JPCq3yX1kP9ikcR%2FjN8cPf%2Fwj1O8o5TOqldXBRqZOXVPARz2OOOF4TOhveQXrjTWqQA5KFNJUvSlK451aUkIKpXrmyq2EblXB5i9%2FXx%2BVi4zC9UqcMlJpj%2BWUxkRNhfkRP%2BhGZLkB70n1xFvVoQmu&X-Amz-Signature=2a3c39a4710da85a93cf2862b94b5d234a7d9cb37176d38bec8335b087972856&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZYYCVNQK%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050023Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIERRTFWv%2FVSzB6xy9BlIGGYlP5U9QTbc4lv86ixQSLkGAiEA5w5R5R1gU6pBk00vMOpq0i4lbZsIh16RtYbZjAonNBAq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDJQ%2FrNjgRkg2Ktb6WSrcA%2F%2BT12pvNYCECVXN%2F7EraAA3ehPrRmj4LWDTFAYq4OqO%2BMxzDNr4LpBC1W2fssgRpieovyX66WYECCyhi4hijsyH%2FahReassrthZ3N%2Fkj46czUGrhwTjslDfuBTmnHu1k9g7LIJWTB70tYmc8Fr1rJQ7PXGoLT9nG15OcZRnofbHD7z0k3IMPRguob0MDZlYb7v3Q0Y0sgH%2FM2ZYPwY7seVjb2a6kSKgfibPXF1tgPtHYw4Jx0P55iNLb1OVTTQbzonN8n1vB9tDMfrtBPM2%2BZtU6x6xCqFJjftB1TgFgaP9KTEfWsj0xgA3NryW0SvdPgpOfwgFbt%2FAL4%2Bh%2BwOwcZRkdN7wuO5CboBQWVL%2FZFOJh6vF9fk58205RdUDHSfHs29wvfiVr0x7QkgLx8L8GjAxMgOz9efwgeEPET9VFIrlj1CZ6LbthfLsOLp%2F9dABA69L9Bu7PiGnjRwpGlbJ6E33nJ%2FmP4uQrW3aeYsNRJUSx%2BBHILSUKcuqopECEQA5KZQ5%2B%2FyNqpA2y0m8kEUO2Z%2BTWru%2BE8N4OfdsgDl1aer9r5EUMLuvUhevYqRMDIpdENtWrLFaUVjRNLnUw%2FAISGs2BGs%2BJ7QGq5xulJg8KW0GCbh%2Bz3%2FA%2F5QOT7u3MNmm%2BdAGOqUBKxd3jLnrnSqFl%2FXCE85pzkKA4OD%2Bk58yWRrkiZgR5uDHaNL%2B7zDUKnxGBLuGSFlljM00IM2JPCq3yX1kP9ikcR%2FjN8cPf%2Fwj1O8o5TOqldXBRqZOXVPARz2OOOF4TOhveQXrjTWqQA5KFNJUvSlK451aUkIKpXrmyq2EblXB5i9%2FXx%2BVi4zC9UqcMlJpj%2BWUxkRNhfkRP%2BhGZLkB70n1xFvVoQmu&X-Amz-Signature=878f0ab56f560252026730ad0f0963b236b4b0d4b0718e6172995c608ce94b29&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
