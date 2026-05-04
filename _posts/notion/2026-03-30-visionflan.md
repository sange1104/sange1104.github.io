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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664E6I545L%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040720Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEFK%2Fi3GEAaq4xkoVTnMsZUg%2FgLgUdobxIrQ0StyKZxRAiEAswjxVRFJq3aNiHu1D6ZRE7XDw7SCDwqGvuME5lwS7V0q%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDFHBcD9joolUi1lbkircA3qKmIz38M3MDM4tWH%2Fz880VSn5XxWmVoUC34LFezxWCL2953L6L3Tfo07ux1Br168ogiDxwIPyf8tVED%2FB7kPWvbuBZmjXDXkVcXqY8MaLpDm95f%2BNIFdK7uMlfIaYZz2flUsjpY48HyfoSbmg%2FOX%2BVJ%2F0PpIs0FKBU0aCkvgoPgIJlHv%2Ba5L%2B%2FEKjMhmx%2FvPN2MBRLFhH5kn5F%2BsvvFEWITVJUDYD4hCe%2Fq3%2BTK%2FsjBk8nX%2FgrIlPILrUeyJqQxvAoiTXvKAQriC%2FYTBizu4xEQPmZ7Nun2ZZZRDOvzIHcACHXfF%2BWj%2Bea639szj0CgWotM81l6tb13rsoiupgsGoI6GkjjWG7%2Bh3opVR9%2BjKxdHV9zze0xcyJ3Fl29vLrkuGeDUQdvk%2BjL9AmjaGC1StL%2Fyk61tdWapKdhSg6ym57RZncz8pGZC95%2Fm6xrQIYW8CsOQdE2GGiCDIKOhrbpWNybJKZ%2Ba9V6uY2W9BdpyDiuxZl8OCIyPsQhWkW2u%2BDDBkziSQQOloNf%2FnriGebsAzmzXrJzGB9BCJ54P2Ztq1eaXAQ7%2BJ9EILt63R70KQTHNptKUljo%2Bvbhm8V6nCxAgvGUAcgVB7GMBZCN8PwJmr5F673KZM2hqob8OyWMMr2388GOqUBJLgv3cGSNlFLVLssgUklME6D8PTyGZ9DVDPJ3UV7Ii5nMF%2FCOx5mEpYXqkWlJrzjD5e2zyiHqPhABY7kpDsEysnRlmsYx6QfKQyvkdo5rharpQ3XQmNj6pNPfDzoRFoQxwSh3pUtExMC91dpJ8S%2FwKv7JCItZY5KpPFhF298BOpZPgpNqDQqYIPDqQ%2Bu%2BqZtDUPkCCYyZmvPGF7y5geusm1VJpiO&X-Amz-Signature=2c851696a6d3e6d82bbde39d23d61fb287928169a3043f436605780eb37d8b24&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666UCJ6SRN%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040720Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCMRrPNUowEj8k4IlXCtgXINcK4x%2BLQEWBT0YPPrYWMLQIhANctMHQedw91sLgEpXLrXtNE%2BobvpKQMblfl3%2BUpxgg4Kv8DCGMQABoMNjM3NDIzMTgzODA1IgwbACnjWuLBOokEX6Iq3APcpvv5I7Nn3wvlJEilx%2FNhOJdBeig4vnVG3O%2BAYXkTCB1RMDn%2F5YCAV5VkganEMXxFzQ1bGis86ZvDDWfuM86KJl%2F2FPBX79Ywn6Ov5gOMEpo10EKOQ7NyKt2uXmNAHEjFpOqbKhIDIwh5ismlQ%2Fr%2FhFbjsmQq72NffUprHXPO4CSnyt7Cxr7mlFxIbse0vE6pLz0MrTjePeVBLu006F0m%2BSYpyGLbaLdvM8LK0KwE%2FzOSJgoETsWV6DbyIYIAj1l88gJmt%2BVfhDakJ0WobG8VC5GMmnflKYgBVJgauDe1tth0RQZbj%2FZ%2BHq3UGrKFGbe0Kw9mvsz1ylDC8%2Fw0%2BcgGNonxlJSEIGAhbtawlg9tffn2oO11UFiAhD7YNYlU8WjOlXmsEUwtbfVgF34ReI5mV8f3%2Fb%2Fy0Ms8ZiQrnRYrJX0G5F%2B48QgOUqhx1fbGguFQafI44AsbiB1tSAoxKLUfmIRvNoBdjYo1eAU2nNPQTScovN%2FAI57d5MO52aYKVuamzTyhdbLvj9plp8K0vtAQC6TgF7CKcG5isUt8TsWmAcrvUjqdYi7Jl18FsEH69ctxt%2F3K%2Fs2MY4shfKuNV2R9qt7AdbJLIDZl6Nfn%2FlL2jY1m7j%2BkJ%2B2CqWMnYzCM%2Bd%2FPBjqkAcuyK33nyka%2F5A0NYSmtYPzVonoTXwxtmUvv2iNHGOeWfUBqQ%2BAuOhQsIo9pno1zEQs2Tqp1NJlj%2FYGNAUBtqePH660T5htj7mzi%2F1d82zzbNmlunhtNr%2B1qBzhdLwfL0eGm3O41noBws8eB1wcMjMnjbUolVV2pr5c0oDM29Jpb0gHYnLuPzx65IdZtfAZBlx3VrhwFTFxCyvtc%2FkpZ8KzNDWt1&X-Amz-Signature=1ac1da4e148c87b9282bcf4acb721c3f69d417d309667c07097ee09596e9c794&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YJV2YQWQ%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040708Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC0CCYM2ItAWg0pE4oYVsUFJPzJ8T%2FA2uFJAp%2F40kNW%2FAIhAMfAx2IRCDsFkGdtAt7wII2y5U0FqM6FsnR%2FvSs7H3RXKv8DCGMQABoMNjM3NDIzMTgzODA1IgzJeQmDA53JUrjOSRYq3APMgjcoojP3ysDqnB%2FwskvUxxCCc2%2F6TfpZuVQcgI92U5dvkxImkhamlTfY2DQj8DhUVj2jay1dPmGbGEp2NfSAQAdo1E4sfoVUvjVMWhAyYIkBnE5vLE5%2BgIqWvHRgpPnnoAT3tcVRYKIXiY1ECF6JzGzj%2FHouYd%2BvYzneZbuQnW78E1pkDmm%2Fipvf0LO0HVErwhITSp9E0%2FDcFhU7PC8wXJ7GpILHld1Fk8YiKSjCpGh%2FPaa8ZWPCkwr%2BkzA6%2F%2B8IHc6T%2BMI84aZY83XaXuLHfjffSyLVz7Ky5oiZesEROaIe%2FoI19IPkQuwrjL5lEBDFbxps5WiV4U6FoF8XAHTZdW9XA0OVl%2B1hJeODbb191RPe9o5TeHxlhggk5skoGjBWl7vVxwejnDaj4PGp2qMMSkPX9NeFj4VGps9Auv%2B3wBlglhVnyDtHxVWer%2BRFmhCraPO0K7DnXj6NMOcOVb1YTe%2BtlpNHCw%2FgDj8UmSrbPQSzfcqRJRZiSig4HCzeORti2vX6L9p9lT0%2BDQV3tU3DladZkmTcxsuBf7N1YhOM4yICVkgTGHstmPY7qh0C5p5VFR6eU1H0t8FGnmblgHXcmdLevQul9y9MtqYRDAoLjvkwnnVpQZwTp%2Fw7ZzCi%2Bd%2FPBjqkARfGXn3%2FSyVH4nLt8hiKbJU9SaauoBZkxBVGVyns5THtPhkr9pMAjeeTU%2FQY8z6ET8av6kjDX%2Bk%2FucxRc1TqLaHBx75aV5khw%2B5w14bYn121pmjixhPj4u4kVRUGVFHoYFc9QTIk0X8rL4IIzsjUhyIHZnFxI0R92y9fJeN0YszJLb2kCA9fvUia4WXgmfjWZ1brZC3UyiHxaR7TaTsdvnjqWxHm&X-Amz-Signature=14830bb39fe1550fbd6f4b3ee4e483bbaac594e6db7f2a0c6432f42b8a4a54cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TPJU6GGY%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040726Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC%2FTECFXR0eBg9bLE2zb9K%2BxZcVU7SduVVyX9vC9vvV9QIgFamT58hoOS4lwCtYh4aj8BDGjK2q5fdgvuUT5T2c0LUq%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDICeK4XeSp0A6gCRKircA%2B3jfvEvyy9LAvpDiur0E%2Fko89tc8CQ%2B%2F1Z30M9JjPmygmozAsQSzvlEFgj6dOIA4xUoEEG4Yd6VCB7nKfU4tpxSlsMJM9mZ%2FVaQZyE0mk7Uej2RAlD1R8MxdM8Z4C2sEKo2EfUWFx7uykryNZqTwJyNPqscaY%2BB8pojj%2BDsAZznVzHClgVxKcQ4lS%2FB0WVSvXZ0nKTvQ%2BTX4bV2MDeRaVAlNqm0youFTD%2F7WlrFhBRKwWnyIWKgYFG%2B7jKxosvY5a5QE5WEAKh8Mf0wmH0LuGXXOXeRX5HdScfMi0O6I9yxnYTEpaWuIrAjSWUFtx9DdVtn5Ry%2FfTJEIJXDzkYevFBO6VJEZD0h5uVHrdy4cpq4F%2FMLIeofukNWPLB0Teblf8bK%2BdvKjZn%2BcYSSEP%2BR%2FZc9y2d6JSjrl5oQpqZK1CPWbgIy7yVkPXzi4TsmcQx1el%2FgV97nsDXmtCSlPPacFmL1GJIOjXywU1rKHebfBTvgYQJ38ZG50M1Xt3cpQzlYideFqvI7nTHv4ZcbAbxCmb58z%2FgK10TnrTK%2BT85NMTdKE8Bgsaqd%2BGlf0o%2BAcLd3EW%2FUXAsOfgakXyq13oHwymkoP%2FTfnkRXveI3mXj73x1aGQimUvielq7vKZm4MJ%2F3388GOqUBJNlTeYMsEWG40Zgt%2BV2hfLHEAGkFfiq9lGxXjZ%2BrGbcBRn%2FHR%2FKPmXqPx%2FAB220TXSxMEizpd5k7nXBwFLJPYDUrgIk8ryOvBwSuJi4IkNwBNzU3Qo40y1fHhDY99LoTCwhk02dkedWyqTW3tpbFE2D7dPVMjPEsRLm%2FKPoIpf2OaRAXfH%2FrR5aQUDzlyia5MpFsbYzBvi%2B8tCZrK0IruJJzsbjK&X-Amz-Signature=e550867d37054f46dfc6c5a69a8228f766d7153dc0d1a3ac8caad98f4bfd7621&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QCJZHCWT%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040728Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHA9FTtbCm9fHkcWgs92doac8wp9ns2vx3ICL9dRSQc8AiAwvcyNi8rkXSbhtvDI9U3ZBaVlzuWzKgVw0LIaR0soLyr%2FAwhjEAAaDDYzNzQyMzE4MzgwNSIMb3tDSR7PvQImluL6KtwD2RvttV7hgvmEJSU2FgTasIoBJ6ORQZCZINCn7pT1L%2F0WA9CJxRnNTlcolhscL1Vtz5Suf%2BrPFwH2uJU%2F1z4fAYDKERKCv4gaQopLM0V9982MvTbIVN6%2BETwPk%2FlOMbKIS4usR7yS5aby%2BFIyE5U0iMidYZg5Dy14AQ12W%2BpyFoC0SAc9SXmZrvSxrDjWdhaoEfacZx%2BS9i30XPeg%2Bnqxi0WtXV7FpgMWlTDIe8CLwOBMyghkssMKC8%2Biwxe7oBlCX9YoTYQvs3zwhSXxPN%2BHlam2RDU3Fo7sNMx6eMMC5TgexGv2zqlt4DA4w2dp6yo6SeA0gaFCgFPYNhoUfJbEjy5iYdvnnP6PMxY4ICRGlG1tWOyibDp090R5yg65KNIGws6J%2Bom410EgTCAPZ1PEp2YXBjorPL5gJow2cO%2Bpc2m5%2F4b6yyqGJERBncVJJobD8gLMxz4oIRP93KA2ugpocLCwOk9FDZywZbyHt3gjf6Z3zOtVYodB4qOfF9E0NrYSNNkTMRvN9csrrMbvxzt%2F41QS9bn3aWISKIwpjkNN%2FFWXMJmSzwsengdNQKX1HZG2F61fUQNyKl2EtrVkr0s44Z%2Fbf%2BmgI76dF5Q2%2B50ngX%2BrRXAn4Ve8YAJ4UxowzfbfzwY6pgEkjdRfnpQKj6%2FlAum4P8r%2F4pDpwzEYI8wL2Cm6BKwfDNnPEy532k7sFysgGGx4hUo%2Fu1GB3kK1ARDjRMkOgrkY27Dntur12S7t5XuKb0Zz4cE94l%2F0EE3ihcJwa%2FdIRnVHaD4G3fYiS5mI%2FgxNsQ3KeuojzSNVh2ViagNOw6AcfDK%2FsuX%2FvrMT339YLBAE%2F3czK3ygvqI2EoJuu2jk1%2Bg4dXzQorHz&X-Amz-Signature=73c4c5a06a3bd56382446d30900de9c0e9b3c8c277427193cc78bdc480f6fa51&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UYO5VHXG%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040728Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAxAaMM7UeXsOE63O9tL9iGprrXMY99D7kFVx0NGLzdnAiEA4vTfmbmNiRi7MSomZd7ix1UG%2BIpqRBnWtk6TO8BtmHkq%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDBEXKUZqCtx6728D6yrcA6nfVSpbtED117XYGa2oSjRu6BCK2nWx%2BKjCIqYno6M5NF86D44%2FT4m4BA11X64kLjuv513KSzPrUg%2F3ZFVgNP5%2Bm9OSorQJRV7L4Pht6p0aHjhOjhDvTHLj9RWFC0DbKqvS0mCOszPMxc2BaC2IaZGZ6aGJ28QbatWaY%2BDqUB321XR2nKNRKgDdfPZF3aaVMcOMtlhvIKnZpQxNCXV%2FouKbzUwqaezWc%2BWUFZ9bVUfo%2BL12ZHse6z%2FJtm2XSXbWC3dtkg6jv6uSWgZ9g83NUSn3VnPKri76yVtzHMTEBnJDZtYPAKoCr2VTKCEZF6kEH2v37Mo4wKsprR7ALStyEBEBVljRuAyJcRODpILlPzTs%2FtOnb1FvqvHOmy6aDpVT94WkdGvHMlR9Bwju4vDgsSzQ7rFt3oBudtt30RLKyX6dVjI5P%2Bue%2FX%2FzORgWN04GWiDAMpXALHiXBAfP5Ev%2B4j10SuJydcDoSah9uUD0ronL46P91ho2KesNpWX4wopfWOp5Uhp5fTOMD6k%2Fw9FA%2Fmcr%2FPC4bYupgkY7FjPQbFYhML2FmKoVZc2JjbqFVypJYM0z8MW6rkvu3Nb9NL5hQPAwpPogjOz1dwDMFluNth3jLeZf%2BP9ZQgGx4dukMIf5388GOqUBTo1hVTVaCNyHNSStJ%2FVlxnYu2HdFb3bG4BLSzb0Y05NgkCLHHuLhrQqP%2BIrSjP4SA0MQOoOZY8EZru0HZRxabJP5m7U8dNnJ7sMKHDxqGD69dbnTJ5yYziyodxnq6johtad%2B2PWqh3Bka%2B8ijArOWh6Ys7e0mSa%2FPIFYJsBBaZe9IoeNk0pIBYjgBj1xLfFWLObXSHJbT9qQpNpuFsxCOboFrZbs&X-Amz-Signature=cc1108aac36ab80e96884f2d49166ac3c44bfb8ac30ceaa3ba8c3ab4bd8789bf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGMNKPCI%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040728Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDtKHzNToXcCCBWXdtGgDOvTHit8x9WrqtVG46dUB9HbgIgcQwSv3KEK23LDOpMbDtNXU1hEoO%2BiVpeNuSvOQv3Ui0q%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDHMF3na5iVq%2FbUXsfyrcA2nIRwz7SPjVKH0GahtMXHoRfFWkHB4KnNZoGgtRn%2FD5acmPc%2FkTRaBVnaIZ6Ho2nvbRU8NEMEHclYfiptjM9HnjrV%2BDMVk87EP2rvu1g9zSzxpOV6lXlWEWtMSiqE3dXCWPXx5dqV%2BeKeeLOVk0k0g9ONp0wfkS3Qabcf%2F6dJnqzfK8Gi0Xtj%2FmaD0KEWdVFVaWzqi1fWlUI%2FzUU53fdyCR5ODlVUxoqVKT%2BREB5Fb8fZu27lg5DuKTm0IbegvdozzYUsbdPy8txP7s1WZC5bfzgK%2FBhPZweSCtZNMMVx6OtCGONBiUCNnRQlv1YRmWJ5hZt%2FUogeN%2BII6YTbwVNG0ZSuCX0IChxyZkmJ9WVDUB22BL2RTQOPbuSVa0lVVXk621O6PVK1fVCyqF9osPC1vPcl6V7nFPajUmpaCpV39BhxYdpNGb1ht5pIMLN81zyhPhbXl06r0lqIE0Wd%2FnRvI7b85M%2FfVfFOIsdGXtfjOkRJvyuFbS5XefZbzw4%2BTIyBjVsQu2c0p25qyW9z%2FkllO8Kk5KRnULrf2r8k5x0mCz1gSTWn8tIrtubpiJzqQXDd8oSdSo7Xp%2FV4%2ByQPWqByAAsqe6RsFj%2F2piShJTK582RWBBys2bWHZXnUyEMLv3388GOqUBM%2BDFHIJo0sKynbpDo3f32p7LzmvPBNnLImjsnkECbsvEd%2FB4gVKWVe%2FYCIPwoh4dHGjdGnPwgw2XAhYacTVld6QAli%2FoGSdXOpWxbkoVyyBLRdLjDU0QcB9Ce8D1ihPkToNxTdBBwJvg65XPQ1BOgnsYOCUusfBUCLmAu6rCvQ%2Fdhmls09DwFVCCA0ejjDjhetXPfilxKtgcbcUCEcU%2BBlXeqjHX&X-Amz-Signature=54488006fed3d62141653103443b7d41cf30cafec8da19a02782978148fa2031&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WIBAHOBD%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDC%2FCljKR8Mi2vwjTh9dGMexfpkY1hkP5KsF6BV4VFf5wIgV6MG%2FyA13qpYAq5Oe63FnOtrWROZjXP48G8AuWTQxv0q%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDMK7b%2By6oj%2FWvfNsVCrcA%2FMvohjBvFuIBgWCuew6DyHD2tAiwiq4etz7KeNKPqaliOuL47JRzLx8cSoKdbmiJ0qJ3Us4v34TFmgwhccyeQAgEfVTqlFPBnqMXce51tpVT7eh5sdmXdWydkuVl%2B31rASRSOtGAgObNOjJc13gFySpIRWmA%2BMP6Yq911lOsSudwMDBonE1MSrtYJaZ0SScHiI19P%2FGBVc%2Bh7wY11sdX6xH3qngpNIcmKAr5UecAGWEPzanY28TbqO9irwNDS%2BO6ijEFcYEGb1PLe7QYp3KgfzCV0JwOiYFA4w5Ge7lbghr8pavxDuoxVcUkaKP3SgyFH4wqn3nyZtuBHtiUdrmQkNukqk0aEZLQy8cYCWyg0Ko8Y1EItcVM4t5q0hELQfGl2qtzh%2F3bbaLrBXL25R9kTVG7A5Y8tA3MUIHak8C32E6kfz5rrR2qvEP4IQLFheNWGhpSMtpse5jZg%2B1XPVZzbDSad3mIFeajS9z3XvuyyKktR95N1hF2zr03Qcj%2BPkm7%2FAFFa1FsCnyB%2F9CHWxa4y81SwAFraUem579Zjv9qkZlQZZAaPRa6rYZJLAEXiEh0RnILU3Z%2BjhEbg0aUawzRoGLk8CSreZvt5yzMeC4SScPaKkhMqwgZHzGJzZHMPH4388GOqUBIddTDCgGiG62f5DMUiOGpsSuROYRIhS53orvLMOIqO2%2BkJ09Lf%2FCjlFmq53L456DI9kNEgHQMjZLzIgpXa7kB5KDhaqvg%2Fxzbd9qny3j39ykupKxhfpa6Ljkerx%2BRAjkoxh5pVQan%2BTcr%2BTh1p7aK0mjUNE2UKV785KL4onZAdaoRtyD6qm1fPKJ8Bkd5Pmf%2FRIO9xkWquJ5vQJOpsvLW7jdOqnf&X-Amz-Signature=63eab7c6dbd19839a55c79a461ef2ca522f6f94f4111f8cf7f3672c2c7cca896&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UR5OBJT3%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC5Z4XDPCLPlvfHH24l3jqlKP%2BtBjAs8FmYCgnhZOUqNwIhAJ98BC02zeqq5c2OkqfCtNoT20LycL7%2Bue%2Fa%2BC2BOGbsKv8DCGUQABoMNjM3NDIzMTgzODA1IgzOrcfkMVxqgIX2teYq3ANKf2M%2BLvPDtk3YYmtLrNCz3RgQo%2FYVCfqthDLGbLBloLe0ZtIpuS0cI%2BXUti1ItoxI3akLbVIXa8feoNyO8IubZy0xCjxUHKzffBMLl79uGMGPixj4kN0SeUuh1kunrSP9YX1cP0UH9ZLiHNgGPwrbhy9Xiv2BCa5OHFevD1nfUwkXwosb2JIKDqbBeD%2FMl%2FUxvXfYWxEWc7QbtI54ZmOSAIdWgHdzwuBNZKd5Fyq%2BfHT3qf90JaE%2BTEaXEoLHkx7kTuZlUiX6n6REGuDRv2YdEfDwSa3jQptOLTvA3eRCJq4YwuEcfQtB2xAbPgFAGnjIl%2BvED1jLgPLaQDUqNqnDzlWdnGjJaldXLNRb5ly5mNq3Sc%2BdQVxu5nQHTOwdVNCq0Gfo4as2a%2B9Jia%2BlEEQi%2F9CuhwsZIO5v5YQ1lzkKpzTRlVlsYEHVFqjyCUBFEw6wObPbPwa3QJ%2FY8wZ5DQ2SZvH7xBfwQYdssoNnWB6yibQKtSqToMC00DByjLxn2DGVLTQtb7G2Lm%2BvHNPkmhit1azxRnu04MOlL%2BSMdHwDud8C8KMjqvAaBGCgxk2Gk%2BkkEzioxiT8Djuprv6SamvH%2FsGOrde%2BeB0jLNRocn9HZ16byB4NgtTdIl2ERjDos%2BDPBjqkAfFqgvFv%2Bb1o4v3Ij5iZvdAwh%2BPUAKq%2BbN7x7Gyv%2BNNyRi1nbTXjMepfEM4QpuCRfwvSiXacb65dUS4IhBdXeSCkkiBIUj6LI0t6OEIVbDKv6gbtLjLnQOmQ%2F1gHkg8B62PoDtUuWhT1ZxX1GjWUy8o7eExi2hMDz0P2iWKQwqUaOwGiveABE7AfATMcHeskC7rk3L4RszJeq8g5nrAYrO1ZmUYk&X-Amz-Signature=592d00a00cff76a2baec9cdea836fdb6374dc5ad2dfbc0c31a36c8c2208c28de&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46646AUB3WS%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDXuOj5TOw2gfOrnivKs%2FjDIJUmdMtZoogJGQVj5sjrIwIgH2mnED50%2BpEttYdwXAUR9sZ8rVAWSBxDGAwBJGfR3vYq%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDPHOEiMuoF0eerZ8PSrcAxG7DdQRmuNES3NW6t0d00vkuRxoxjsK%2BK0tSGQU7E%2Bj9ae3u3qQ9ek%2BVEfXXJ1C7twbDFOaO4yOWrlaFhu2ikqWhf%2FCvX1I%2Fa%2FJxQrZB2U734MF4Kc7EVAzaoVMv6RuB9VF29o2ix2urAk7O4Pt5WHQWjujA%2FIzLyyana17D4d8Tk4KDS1z0083tFa%2FCBf930qBKDe3WsPzSyv5wGP2dmc%2BVeLW%2BY%2FP%2Bh4cwIjV%2BlUbzTNSV8%2BcySEwRbhrCD9rXUuuKL0dTt3ZEjdi1Yp0L%2BnRsAE4AyKhUzmM%2BvMDdeZ7iFzS7nfBNB0TJ%2BBmK6eSX%2FtpX6uwUnMf4ywq781F2PHbhLjR36twl77n871jVc3FR7ROeqos1MRxZ6ETCD7JymVDtnoZxrPRNpuacrm%2FN6YZlnLyhUGkw1nAijxvy30zPG19VH%2BOHbAiLWQMn5Vzk0aBOg7hHGgU1w7LM%2FPDsMj%2FpyTtk6Roeh8%2BCHA6zgk0v%2BtMNqJ9eAKQ3OQv9JlMP354AYq322e8U0qsfIKFOsDIvf7jSjqMW1dhfpYRTemAspc9etXxsnjogsvKxNuSGMdj2XvgkZ8HnVIUeSmXRLMkpQ4ZeF46oyTpc3cv4Oj%2BxBThjLay0g56rFDWMLj4388GOqUBFJ3bRVu6xZzGyFhMhdCmdVTH0XiOJoYk29mgIwdrVIjR3m6CYRFjuPCqiyMd4UZJO71Ak4Xe5xO4cJ9hLZQijbwlkgGMy1CJKbuxNfAlMgSAZX1%2Bd%2F0RDTHUCNh5Sw%2BUYc30zFyeFz1yIIRY%2Fu%2FPrPbXAaNwgmE0O1AHW4G4Ztu6U8LBZz8k9a9DrAkc68BYWl1ao%2FiSp7pmAeqW0aIJXWIAf1WN&X-Amz-Signature=4cd79b4ccb89c1b2ec96308928eead8bb418e1c9696671b5fc80aaea8fb10d94&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SUPOCM5X%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFeSC4soUyoNKgVSsb230V4HKwIe0nF85V1H4BOhXDK5AiBfyyeI%2FZaGgQX2bmXzC6qN2OOC6Yz6IMXJz%2B2vsDyXAir%2FAwhjEAAaDDYzNzQyMzE4MzgwNSIM%2FPb%2FnSahfrP7H%2F4BKtwDkFOfG6Gh420vAYSigOGJuSt8KzfKgQ25yZkTyaa1X%2FrpgyIgbFkIsBYlePq1IogE99%2FICrTDHZBL89FkwI27hcDaXJMi1Covqoxtn51Yo6YgoFKJlPBC6vSHcf7phTQA5QCI31jJ%2FXvCxeONNCYMLze7ANTlDgH%2BIJcN5iAiHyapqD6cOq%2BIeaWYd%2FzlORQWZ7x9qLlFEIrtsevtQunpom6b642fNy%2BUcgmfI3WfQuT%2BoH6fSZA5e2D6dl2%2BPwSQ%2Fqw0xCGUhpzBL26gCLI0KbRyLo4b%2F%2F3Gyuu7XNiGgmhHDTPBfrm7TM%2Bc8O2gDqkdOMw1cwCJSU1JI8o6KJm9r%2FbkWrDSL7vZNxOixsf%2Bo2GnzO%2B9M08uuy0yDW04Ym%2BqeakoTLu8HsI7Ku1fx2zxq54N7axHxbk545QUDeyvg7M2UqrxT3qD4skewhaHZfNdrd2rdp1BJQfv%2BlpDZrxlOLG%2Bw84TDC%2FtTtZjMci%2Fw9JjLVwA01S9ggXL2OwHyG3WeM0jtlFNwA%2FSodCo6EL3AsNjSZwDtLMWtURnZWJ6Geb%2BoIIeIOcXykG7bobzHi0HPyPaJ4TwAKPKP5rw32S4fDDrpHHFtkl9deEQ4j%2BrevOCnsx5e1cwwR1Yn5Ew%2BPbfzwY6pgEJymL%2F4cIWr%2FvrqfAuty7jMHpMbhji%2BR5JWNY72GUBy8eccE%2BK4yeXDepqtvlTr0m%2FxoeXPBUp7Q2D9TSuC%2FC2MWpGOWrlplP39ueD8u5C0w0l%2FANs3VFo1gBX8%2BtM%2Fooo5Su4vVA34XQqWaOklyQYpGtTfLsnGKQrTpSGZAigMY%2Fj1gUbrH8Bk7SbSghL0iH47KsX3caLzeiSvTgFCOSy8aimf0bV&X-Amz-Signature=0cdf30a7bc64029d2b4c64de67c7a259958a49943a93bd83dc1afe9152647113&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U5VVGWEB%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040731Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFYpp243Pel4OUSdJ3CSRca1mPaTIKJW9THdVHs8wkrCAiBKy31Gi185z7IaKuLRz%2F8tW%2Fu5S%2FaNx1cthr%2FQw2zKpSr%2FAwhjEAAaDDYzNzQyMzE4MzgwNSIMOsec45VoVZ025yHhKtwDesgwqOH%2FhJBc5nh9hIFlRm6IGRezu780Zf9tgtEU5p8HcQSvQfHSKzKRH02VqibzPBAySikGGxI4uTXNueXS9rWVv8h9zKm4qu07G0ATbyXE1UPS2IDcPgboqX2CnaEOgejMiSbDQ0ch6tQikAi6XaLDWSlbfOrQuVe30Nrn%2BYaE3%2F%2BulfL%2B7VbEgZ6JNdGSDX90ThnFY4feJhmh8%2FdfepOtPrbVmSLeNVKxJQgNYObA2tG5g%2FCrF13WBJohtBRfvHUPDbzbny74QRDfVJmYBvF1bIPdtZ%2FqLhxmyVq92rUsqj%2Fnwp8JsqVlctVGBgbrc4YOD7jrqDGCGzlCj4OBIv2v0fBmSPoYMdtD9d%2BjTg2qA6hZniv2K0ZYYwElvlWjwgWQPC%2B9C5f%2BcovJl8kD85b7sHWhBThYk%2FCxsFUOL92Y1CUVPLUOh8x1VwszVB3FYAI35voipq5%2FeZgoe78kq4SovtPxdbSykwZrwH%2FpoybEN1HdBJHoQhnIJoLGRdzOgRxXOxX%2B0HPK%2BDIDYz4R8icRUK8K0Zm5iZXy0zx8e4gz47Z7w5zeIysvOlyjjXdAF6P3kUaCVnnQYgQbwBAQNfWwQQko3zQyVGmEhky%2FysjxxAcojA7n25S5UM4wgIPgzwY6pgEE4JguPe2tLtAOWn6Q9Z7WMUQgApSyuNIrbfO75Jd%2F2dAt9kRtuem8%2FB7uqMdKijNpgU0cQauo9HmG5NNPz2GWBy45TudmEdfE64yXekJLCPlBVIWMRdXmpuvczm0q8Tiump5S1vKTBDqyFYcJ3h%2FmTNo6aFGxpT4Mx2pLhLKmTNxeNFyzbsnYTMhtBjipZINVDJGHXO10l9200EXhbMT3uMGenROD&X-Amz-Signature=5b91346481d5cf15ffc53d11e70802b87e0ff7eca75ee768454fedb4c2c30977&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665Y3GBXBO%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040731Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDRVIEDOEQAsYkMIy4v5Yy3ktf4nd4nIgsKfbtOLRI%2BzAiEAiD371khMmMc0scX9UHPKQBXyljX0ssIeyF%2FuGOj4%2BoEq%2FwMIZRAAGgw2Mzc0MjMxODM4MDUiDI0rtJ2R2hQath1spSrcAxZXejQApp0Aubs5tKKc%2F2%2FEOHSg0Rl4Ins0A5C2feAYcYoMEUDqySyJ6%2FiOXMjrvNx6ywjnaUwOoxYBElDHlY%2FlJuLBO5KLsygplwqj3xHhps8jchRYqlSJcZtHB4uQ63nkegSko7QmQCRQLJDaOV13o5sTJ6oUr0X7WRuW7IULxnwNGm2B3VRQYw2Yasd6gozvm%2F%2Fl%2BMZ7%2B51s6jFm8SCnOmcB7zN6fW0P6DihJOr105Zh6vkWY6SNOA0rQorqc0z%2FPkCgsWagR3KS55kKKMPdiaB8HLBLDFkCPXGSpsiqGuusapxJEcvz4JWegFePgapVZSorC2K6J9RTF%2Be8bX15Mbe4YnAvg3Q84Lh0vUNo9hfcGjBZQHBoSWcZ41OoCQDixCBU9ftrTjjp3vzM%2BgKpwHzPRvrh0bDkRzq2FAXRExlbhif7UtfPDfoFfTK0ulMRJNgHlC92kNNSD7CVx%2Fbfs2%2FIKpPKkAzHkunG7eoPeAE1BKJkHrXg%2BugKvQXg8gIiPQvPfvET9SQyKkM5Gw4eOaQu%2F4F1BtwF%2BrCdMMVbbTlmuEwP%2BsHX4iwJrX8M%2FCpvBmDe7OiRfRv6uLZShZz2C%2BoWSgGoLgvTRjND0ZuSYweAlbgYCsGI325%2FMPCr4M8GOqUBTFwbhpgphi6iAtEDuc9S3%2B73k9vSWe%2F6tuEVLK5AcL1S0E2%2Bkr%2F3o%2FcXws4Cers1UikE82w86oEfr6%2Bl3oxmGDKIhs2LcvVbWW0G7OakliAiFSCXe7iwh6ngn1xZxreHzt9nwkeTMt80qL7l4pFI2nRcWQTRtSmscUFUwA43dfFvZ%2Bk0CGfP6bqeFN2ZDxsSAACx6MBkXRHnWJiUGqFioviIrOhy&X-Amz-Signature=2e2b204af9e413f4efcefeee8eba69b177a52cd7510c1c02fdb22cc7045a4583&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665Y3GBXBO%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040731Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDRVIEDOEQAsYkMIy4v5Yy3ktf4nd4nIgsKfbtOLRI%2BzAiEAiD371khMmMc0scX9UHPKQBXyljX0ssIeyF%2FuGOj4%2BoEq%2FwMIZRAAGgw2Mzc0MjMxODM4MDUiDI0rtJ2R2hQath1spSrcAxZXejQApp0Aubs5tKKc%2F2%2FEOHSg0Rl4Ins0A5C2feAYcYoMEUDqySyJ6%2FiOXMjrvNx6ywjnaUwOoxYBElDHlY%2FlJuLBO5KLsygplwqj3xHhps8jchRYqlSJcZtHB4uQ63nkegSko7QmQCRQLJDaOV13o5sTJ6oUr0X7WRuW7IULxnwNGm2B3VRQYw2Yasd6gozvm%2F%2Fl%2BMZ7%2B51s6jFm8SCnOmcB7zN6fW0P6DihJOr105Zh6vkWY6SNOA0rQorqc0z%2FPkCgsWagR3KS55kKKMPdiaB8HLBLDFkCPXGSpsiqGuusapxJEcvz4JWegFePgapVZSorC2K6J9RTF%2Be8bX15Mbe4YnAvg3Q84Lh0vUNo9hfcGjBZQHBoSWcZ41OoCQDixCBU9ftrTjjp3vzM%2BgKpwHzPRvrh0bDkRzq2FAXRExlbhif7UtfPDfoFfTK0ulMRJNgHlC92kNNSD7CVx%2Fbfs2%2FIKpPKkAzHkunG7eoPeAE1BKJkHrXg%2BugKvQXg8gIiPQvPfvET9SQyKkM5Gw4eOaQu%2F4F1BtwF%2BrCdMMVbbTlmuEwP%2BsHX4iwJrX8M%2FCpvBmDe7OiRfRv6uLZShZz2C%2BoWSgGoLgvTRjND0ZuSYweAlbgYCsGI325%2FMPCr4M8GOqUBTFwbhpgphi6iAtEDuc9S3%2B73k9vSWe%2F6tuEVLK5AcL1S0E2%2Bkr%2F3o%2FcXws4Cers1UikE82w86oEfr6%2Bl3oxmGDKIhs2LcvVbWW0G7OakliAiFSCXe7iwh6ngn1xZxreHzt9nwkeTMt80qL7l4pFI2nRcWQTRtSmscUFUwA43dfFvZ%2Bk0CGfP6bqeFN2ZDxsSAACx6MBkXRHnWJiUGqFioviIrOhy&X-Amz-Signature=8b7d2611f41c7b03455fdcc88ed635b0e6ee4a8dc5fa9a027e35d1ab9e4ebb9e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
