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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662L3QNBZ7%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T033847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD5bfVzRkC8Mf5K2X9Yzeti4sdO3eL9fA8tq4tCT4YdrAIhAKQUffaoLqM5Th1m6h0qzZTG4upQN%2FqzXzj964AlxhqDKogECMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwIon74yme2Xv%2Bfmwwq3APwvg7UYOk6uSULDBVeJmgJz%2FveDs%2Fwyetr7%2FsyKtA4KfYOF%2BSwpLEgGcaISRed5IK7q6EvzLizO5OPbJ3IWWPYNCAEo7Vy50swFh%2B9amDYp0CSw2kSEDwz4caqeTO7hNoEDD8Ma8UDXQZmD4eR4iz5yRq54xIpmUaXd4JuLt86yi6hTjPxWfg29FssfFUigWL5MSkOVejHwHYBTxhZZsReOnbEvs42asMJMgN1pW%2FCIAwCgpY%2FuL3tm28Jlur3SUrIx35JLn%2FH%2FQ4agAXhqFWEFWWtfqmL1gq5U8SsuZzzLa18%2FFXfL7oMCxDbz0FXfjxQyB%2FlCBnDcQ2J0yzCRBrzTVv3zfYeFOa4EkJ8qtE8zOhRbGlNqVfIAdVxwo9bKmPVZv%2FLQ9xz%2Bh7EXCDUlFy0kA%2Fq8gsX61QnLJH4NLye7X7LMHOkxOEaEtt1%2FvszyuLlTueg%2BBGoKV80S%2BoZQzMpLfDwt2NYDDIUK%2Ba5QA5PrO7a2fn3bKW12pjlVn2X4C9pMldvptX3wlZAReL3Se2m%2BhFOWeEL6DjmwdqfJ2wEZpNAUzuoLewWeP%2FJXKjx1hY0K6mhcBNZ%2FxZ%2FTITNFYzbEKNN0b6cQM8FCVMXhj4IZbx34UHnB7RBahuOuDCMs8zOBjqkASvNI9x0UIgqKrOKplA1DIt%2FVZshanNsrdy0%2FMyRs2t%2FcjW9UdjpDoeyBFFn%2Bvs5NFdaPTI07%2FvQbChAqcqqtzhYksgB2zx9aDUbSo6rH%2B%2FLZIf2X16oo5tb0HeMlaRqTaVhwtdCLFYpVIwKiAub4MHtp33oBDRkdWrtlySa%2BOJSZ099%2FHSjqHL154hG%2FNPhKxYYxc0UqbjgWOUQdPjWegl48Jms&X-Amz-Signature=e6c3766bc15e6f2b37b085a6cbdde04f7b41244560958f24a3f2e1e3bb8157b5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LAIPP5C%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T033848Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCA%2FBCDhwVGFeVnfQBgLuupuP7SGKXhkkU%2By5Ps%2Fq6FkAIhANmBIMSMVS9Q5CSvtPIMYx6akFrLAWyFWHz4pLXhwUzFKogECMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz6sLv1%2FcJ14D%2B80OIq3AO%2FR8cmfZvMSG3PKPp6CMcgt6JnyabfFaFFZHGfHTzHqh9TLJshYJ%2FcYlBWMpV%2BJ4VfZym0fDa6%2FwzWBUMY8RIyQwmNQG5v3aNCRDEz5RRn6Xw1hk6fTHZOVNHh466F7y%2B0Dw2kZbB%2FDxK9LDgA4xK54mQfuSC2kK1bZTBS7gr3fQ%2Bq9YK0m0BsbXLH7UpTpTjA27fnCRwLReSluBAA7Vv4D3a7vSLOhA8McfOYHvF3KdRKs3JXXOBVlUd3od6cO75XWzksDc8Fhrii3csEA8byKjFXT6z%2F0ZabZzzyklu89u6dohw6mHZuxJ%2BAuKZsiCpdrWs1Ps8RInsu7BhgB8ftE9%2BkgHgivPjE5%2B8u8yXsYN5Kb8pLRbs9YY%2FD4pg3sgpPM6trZkNZd0O5BEVJp%2BH9Cr72Xdv13b%2FanFMXptU5kRxhwdiFrfH4XN1VWtcQy4Lc4dV8UIFdpqt2xTu4S8VLFqj5UFoVWrkrS66E2yU%2FBoUI5c87SCfKpRiAx8l0rhbKov%2Ft%2BRkZI2gEnnbAJd1cV432oX4KEWqKJvZgIfU3E7AiLnNmAO5djpIHJRBiho7b01R72NxF5%2FB8bsC5jNtxkg2MzTdyMcy8M0Lp%2BrfP7Z8lNyQLPibfwYDMVjD4sMzOBjqkAWAax5LKtOpol4XdYYMhXsJ6P774GVFB1ZESrXmw6bgJkYC7itsVNnGiB70S%2BqxOyGvtMstEF4EpAdg7XErJkQFNLa0nxliyTdNlKm6jTANUeRPQq%2FE3HsCwR8c5fr7n%2BDY9aIoEa46t8kXevhQMZL%2F%2FR9D%2FKJEPEDcKoId5XZzAc5A9UbV6hALh9TprkyKhW%2FSwXnToFOsNQiVRPfGruOB6Ryi%2B&X-Amz-Signature=ab6cb78f5222d23fbc9317997764bef2ba241f8346eaec86a239531ae2ccc7fe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666URAAUIL%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T033836Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIChdBDfr1%2Bsm%2FOIOf5sZt0cpNhxBnWEAAQMOHlI26cYxAiBLHkIca1HMD2rXGlA4l47dq0S6A5xBTzTUt9ki2rcysiqIBAjD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM2UYQ7A1iuzP%2F6HSdKtwDgnQk9SNLaVuwTZSAoqdWniZOCBOfTOl8KOftQv%2BuOGwuc8BmcH%2FveC5eqkSE4%2FpxSXlaLdY8aUWAPLZYMjurW6LHZs4UcTY0glITDSlhK1D0ynELw6eNwcM18NQz6BBkqAJkAJ24tm6nGpGBBdI%2BTiRuvnJmsdPRy33RQGMTl13AXvS3%2BdfTZNX%2FxL7Em2HhPt08Pi7cIDT3IDC9RYTksaaGNnX6R14r7xZlihDMHWU4sJqdeQD0rjKsX6hr4p7zsTMmhmtNEUX7M7sF6vfTadH%2FVb1sXZPL0yHgebeNRrtv7OQHm9u5x%2FqNtDwmQyD7%2F9hlBaZrZMqcn1LOq2SZ6Mq4oGY3i9LBp8pd25zW6%2Fvz2RXUop6u8f2sRLILN2dTfOXtDNpLJDPv8jhWvFX8oVwuhVro6gXYIJLP8iWRNVVYsowBHBnJsAql2PaBjeT1ABT9Igo2tYDp9kBEc6tDBEFrbJfMk4kRcFwpKl65qeKn8kgEC8cLkP976ShFdCcEIUs9l8ojS6nefz7fPhTJnD6GFBCYRgU8mS4giNCXDbPQT%2BO5KdxtW2BO2HiGKsRbDa4qr7r8Nv0ZaSGYT53Bo7%2BXKYXjGHgBIhpgYTPh6gl4%2BPfHFBETVpEHQyUw6rDMzgY6pgGMd0%2FBzfENOqYENarM8C%2Bn8N60snLKadaO7AYgsVm%2FP%2BDYMngnb7QXSUsleP5MxHilw0lhAhMO%2FrnJnDwCzJdnSjenbZsXNHYbiL3ctwQglYO11LV6HfDHKTNADpqySZ6G1tIUYZO9SBDFKSWFijT%2Ba9JU8KrLJUN%2FOq%2Byky1pkO36q9fi5YH%2Fa7lSz6nJwgGujUqnx3btlzW5szWCg7ITyk6AwIEw&X-Amz-Signature=ca2df29ebb001248021985f78b0f372f2644b7dff6ff4365fc00d8c8b94562ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QE327V6W%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T033856Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDUQWXV%2BVlLxbO2varpjOpXQet4egKHztFHtU6EQ1qwRQIgGYpzJmMo0e1WZ6Iv3v4UiRpeHQWf1ROWePt4X8Xa7xEqiAQIw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH7Y1vf8cI7wVjsn9yrcA%2F28oARtdfJXCjnUwdgYlbBbh3RNp8%2BpZMHHUi85fYpkuc96mH%2BIuhAdWQB0quaqTEw203CQG7sKbCV%2BY%2FlhGbN11eyygMJzepWmTyegudR5tuNsO8q4mq8H%2Bn8jfdLk80RFenhfP4oLdFFzoYQThZZDr9nVCwvU%2FjN8uRZLybJC%2FTxBW%2F1hN6Nnq6EzS%2BNO6UgedVrxY2jLYKv5Ax5mQxnc9LGtiigF5ULxy91YZBYHGNoqtAUzFWAWtIcfz%2BoBsywdBziBu%2BYeqj813J6r6gCu3NfhBv8xBIeEQekM0ZcmbCbS3DekefUyTRIIcqIaBMgpe1d2LN3YJiHVYj%2BQUsG5kPQYdgPCzXwlylMolTuC%2F2VSv4a0X62YlGWBY5ATY5zyKfsM6QCBtAe2sZ8haCLWX6FRXebD6zvNyq7mkkHgZafp4%2BjpApsOxFwnT4K35rT6J%2FRhN%2Fxeum9GG8scNFIS%2Fh5IwVbTJ1S45yhPV1laHyUr2Bj9CmFGMyKfQcwWK6eIERClBlDRwkU7fW1SbDkMQLGDi30y9WKPUbXMoTRdAQ%2FLcWhny%2Fs0hinjJDDWd5pB7g53GpxN7OnT512a5b%2BGcRG3Q1Y9NaK7I0SIVYlDI1IG%2FH8SDMdjNwQaMOyxzM4GOqUBKXMRULiw1RA5ksDRjXM79O96W%2BQqBe8kzjR8A4hnMy2O7ZEw8f6zP5v3BdUl%2FWft3T%2FQsctGv3AuZSNjJiGn8KkYMDGJ%2Bn0ImibHZNqkoqTKdx%2BuwKwijhVi%2B%2BwU%2FjpLcjsJemlNUqP9QNo55ZL5eUfyzE1JceZd3juc6x41cBDq79Gy%2BHE19V8rGnN3leGNAi76s%2FQQ3gWpeOHFA%2BtuebYslpYZ&X-Amz-Signature=25cb8bb3a1ab7c4d0f38b5d5b9c1745e1c1040cacb1a6b76add24b1811fd1d07&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W3YOKEKB%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T033859Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBGAh78DyCZ5Sy%2FRRbMc1P4f2n0Ov6hN5atjkdp3eb6QAiACqIz9SDA1mj5xXPNMQ6hTgplEa%2FM3EEeMM7KyK%2BTTTiqIBAjD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMMbAVbByWqZSykSHcKtwDtsZC1v%2FnNvu3Sxn724%2FvH8V2kGhA7UKIGYcFfZMH84LHcouKZauNOS6tLHcwH%2BhSUZLvruNTpI07CgcOmi6CVfnz5bhvu0A%2BkcWryd3ZLYlajCFrlyEnWRJ6HyLI0%2Bmia%2FTYYBbUjbC95a3N%2Fn692Le6mSZUOjG0DZpS9CCUdjY7da1%2FdlwUtytUPZ4DYwd2xikLxvY205Wo4sfhkPtjT3Xun%2FYIw%2Fkkcgxou9hlkAlhZ2pNmWnhH5kRn7jCxp4oFguAEzY7z9bfJElDeVkVm2jcj%2Bq%2FvWd9zojiEuX1Ad8mfR4%2BzrAFi4%2FfS7vyRQvtccNkZphkjSqppFSkcYsdj02v%2BmvQRs3Ea9hwprBd2Voyw%2ByrGl17IPCwkGAaf6auh2AnGZ5hPuRoreAPWJvjsBovWYfn%2F0vwb1fw%2FwzM39PCedZ9vjtFf7BaTZr3qJJcI4ddXrN0VDpZV7tpRwwYIt7HpScoJSdipDmtdMjy4nj%2Fg92InYb2%2B72o2%2BTo5XjDyqPIiKt9B1wCOboAUkRrSI48cwmFL105X%2Fr7OaxdDA9QcXHQVIcOMWjGyYRKmST9ibNnCe%2BbyzlKsxbnZR29N7h5jE0eG4kZ%2FBsoqjRe1846IoJnCyRWlO%2FHD4Ywh7HMzgY6pgHVXVl0C5MiXfnuWiIWcOsuj6KSSvfCW7C5af%2BVXzTOoKxvlwbL39vqT%2BDuXxSgSANwon8FEsxuwri3Ii1io6cjI4%2FlHMAxCUmDMeQOPAyiSgaxdHiYXTJb%2Fyw9ELxdiCBuP8oO7zRyK9ZYz9Zlk3gXD6e%2BHZklQcXkLKOQppdjZK5BDcHlVaeCq76LBlaXTZLIJMbeHR82j5Tcjh%2Fp4GUqn0H%2F8GR0&X-Amz-Signature=197baad3a48665d29557fefb7db64ee7099c3943528315e4d6905ee07f92c9a1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SYJ3XJ7X%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T033900Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCL03j0xhoyuHBqfLElzM9M3vdIPOOPdguWB26TwXvvVQIhAMiaEKbvzOheDbl3S4YtAUBb2ajsDsd4xC7%2B2FbG7PP0KogECMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz%2Bc85z2P6GQsbPzLEq3APs%2FYNBtR%2BAdq%2Bqc4wtM30up9hgpTnR538uXcf%2BnHCLc6Q72VWO3x205MDjCvsQ%2B7XtD9vIj1HLaBrrU4jzW0OSI5ZVoPgTYjVb441%2F0%2FUGRhS6QoiQul1e5j6mOdiSprIGdt%2B%2BLTAKz6swOgyycHLwxgSrXpuJgM5U48hR8SLb1ErwMUiAi%2FRqEwBe2MRM7rit0m27g5W%2BOph658fKjk%2BGoBPaUNU0IWM3wmmQcvvN0CKq4%2FG8h1Og3Nv9t03rmU1BjMAyBMlPa3JHeklCF47U5n5OVUcxN7PV1Red%2FHabOjI4Y7R%2FXjl%2BYj6r3znHS4hQd8uL%2FFx2sVoHjZsghpOf898zQRJsRgiWcB7diZmznVc6hOATTmHAUg97kEAclnUj5Y9tYI5oOBlDJRrgAHtkMHKZ6Rhp5xm8F6W9uX723gkAo0o5wMj6V0ZZaDo3w1As3fYmTRk3wESS3bJRRydPjUVFS4WeJCuMK%2BfQ2LotAbojzjAFu2Ce%2FDqFQ30d5k6txTNdnZ8PLgwRX7HY7bTvCLsWvcFLFPEY5fCfNt8rzh10y5m5ED555evEjrizGpGLV%2F5mjWMqCVFggo7U2ZHAMuPUn1sPk1hN5F1cEeumbMqTimpSbA8Q7HD%2FVjCJsczOBjqkAVv409EAxtt0YwMqrfga4KFg6GNwVgqljtBdCeaHXXSK8%2B0QQhMYEId2wHAHKuCTpuMXge22n0zCzbuQ796RZuQCFceSXwxyITAWg3WNm%2BAPREE5z7e2uIeD7BVpOlx%2BSfGlgY8jHrKFnvxYHA3sLnEucnnnycsjiLfHlRF8%2FuZEyIaE61ycW9HEDXwOEpQDEU4vucpXyW53%2FVeDKTPDPK78YR%2Fu&X-Amz-Signature=039ac598cc8921b349f516eb3ea452b92070f6117f3ea75bedaa323d302a4ce8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SMCVSW42%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T033902Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDhPedWjYjPNr0M5HmWOikzFocZz9eyke4K8krTvD%2Bx0AiBQAM8SfnB%2BgbVJKswsSLBiqwGVUYypOecUVa7GGKwVfiqIBAjD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMwcXlgrFHefhuC7%2BUKtwD3%2BsKjS5yOJLRujhNXBPsuq6Z2RE3cymg5UbSakERM3%2Ba9vauBfklGb0tpAvySxPJK7%2FVbl8XwbNqCnuPujOaAT%2FHPvT6FfHTWk7RxlH6tPgJNWNtM4H4eKh4sslvoYHu%2Bh2UEFHZx%2BLbEDd7BY4idLdLdQIqW%2FkuULcfciDcxu2wmBEdJmofQWmCsFbkCLOvgQH0HAEMPdwM0geWP%2FPYqN2pdU5KDHynHLbtMHc2E4jW4J23W1oDOTLHbfklajMaCts8N72xW56xOPAdq3M%2FSKupMdIr%2FPwH7zItZ6uIBrdfHKwj3XHU%2BFyv1ZerGsr4G0qw9OvrdcxAV%2BbBClC%2Bbe%2Fwf8Pp3oocGT%2FrkSS5A%2FBOR4CH5ywVQZxArjpFvqrdSYhIi3qqbkDZ2Cy893FzxWIhcgxBpgIUiYv9Wd8Pla%2BhpgpJvPfTbq%2B3CrMDhdWFpZoyu2gLOU0yLCZS1WdWg0ekHqMkv2jPVQwC35ZoOkbNLUbMVzngzL%2F2S2YxEv%2B3Y43t%2FglW7iNmshzB1eqGebT6dOoP3yOGyhEzLtPWv5A6QMjDgTgWCAGo28%2FyRfvFGZmnCkl8jCpAe3%2FakvLe8senUKfztoBdJ8PxPyBgB3vtaf91wqbVjTGdNV0wn7LMzgY6pgFOQhnhpOvH0A0Dq3JXsKoQxmgXHSJSIUn5mo0LD32A9Z6PuznykUt8B07BA1kgLgG3I7%2FRtU5OGjxkOZtuz%2B6ejPM2YsMn%2BOh7mkCA7TvzV4NxtryzDTGz01AtH9e8N46L2JwIU6JxKEmdj14XRlhFV6JZLCxoUbq7WuzTVTu0KqdVnHyaLYltlw7E25IksfBFZ5PGmhrYSqIqaYBYRsS8VxKGwMCe&X-Amz-Signature=260621f68bdff297196ea88995ec9e75e39905c78e754de0b692b24027dc1246&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664N6C6A7P%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T033903Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIA1R3ZL3QLuca5g437VB0o7bN%2Bkf%2BeLx%2BVksU4yPrTuZAiEA5Z4h7IS3CXB6PV8l3q%2BviNHMoYxsZ4IJCgobsxZIxBEqiAQIw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKHpro1cILvsP8nxyCrcA7yw1%2BxPV3WvYy5ghSGbkuXvAAWxhE7GOqZCd4BE%2FwTx%2FWBBKAll3F%2F1G0JX5K%2F6vtQ1wFJq3eX%2FIC5UfIkERGa5iKXMRNRMD9n32%2BbHSw23tYNVXag43xoolLoJBr8R%2BrwH2JJSFDLyD4rUXZa01avbxTpcYtvNpL1xNvKS8wO0FBzFBMWuxuo%2F27BlIfH47EiAAUsNDUTKXwTteauLa5VDlL8CfPuOXvPWUeN6p8%2F5GlOoToPAQANGHiuSA716VpycLyuIwl7e3Bj5DoCgBB3rnARWLHwJkLdceg13TG67RSSx6sthtKEq6F2LDlxEQpwgBDDpjBvxIfVMeFS9rmQuFB4WY%2F5A9FJ1Wod0VLz3B%2BVTfKDuhc1iY0iNp1kTBzrISJD0As4700Es6M6DBlTVXDdMrf1P0n5YTlYRMoX2sbxSHLh6EOE9ru8odKB3uETf%2BhCrudOOpQ2QeiZs6O0Ayv%2B6QFbzgmo%2F08Ju%2FRRl2hq6Vh8mTNRY2mEr5CGJ92hZeMcBgC7XowncQXv8JYa2rIl%2FqVpWh3%2BVkE9%2Fv9zdBkwofYYVrz23D%2FMNMShhGL7BosJ2oChoWQ476%2BdWTHOwM3C4M9MHdVJlHQfIGAaysU8YaFV6SVLh6KweMPiwzM4GOqUBlf4i7Zul%2BNJXQHkLrRgyHDUbdSmOqFJVl%2BApGcvbXwnQtjutGnBYVgwseNZ9yhjkqQNmaWCEkCVZKYMbjolDfnEuC1jpPHt%2Bi4%2B1ne9AbE9t3k%2BnwdmfN1V9RJtdeqXlcYunqbdLxV3bcRwRz0XlzsemLM4DMReZ8zYcwA689LeRAESKOep%2Bi5C4uu0PHilxt%2BReupdUGeuMnkN6wP%2BvPgL5Mevk&X-Amz-Signature=4496237693d8b5e0a600845496578f433c1437b726121874e3d02052f0c6bec3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46656VC7FP4%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T033905Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFFT10gw83DDOBrPfT%2BqBAyMhx1KpPtpqTxym8RZZ7H%2BAiEAsS48wLWc1MQvpw5617waODvhvqH%2Fh6I2kaVwLdfmWu0qiAQIw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFOTeOf84%2Fijxijf1ircA7upRDdPpWmZhWGXECbBztBey2PyYGJ660P1BsVylPNfg%2B3ooeLXOirm%2FNYein%2BATqLvY5gTeqjCG5HqkHYj9I%2FYTnYu%2FU60VCurPKOiGtfsMwIz4Wzkx55RlzKnm3JoV8gzX%2BCFmz4JRvtGdiaeIhHLe2dO66bAgMkkT%2FNXxbbQULGAvTBidc2Q3w3FtV4xnuBgmxPgidawd3oQkOf%2BZ24zO72dtzxNoN6IMx7PYJ00N5V01HVD3gaHVEvGxCw5kR3KA1KusBybOqnNuhYwX%2Fi00C6pqd2EM2uhkD1jctipF6IQAKHX%2BZPgh08ux0p73D%2BYNx3ToxB9vDd2aO60CxMrmtmDPZdCvWRbYkW%2BppZ5Qj9yCgwUdH%2F1OVKayL5kJcq13k03yMBCNlcIU7854iOI2LiwSxf7DofmjoRTki8SdyJywdSvAEdqzepM%2FKqMj2XBsZe7qD4303zxpmwCRn1bxpI4vL8f5aixq88VV98D%2BP5gP8T1E%2F6ZTY45iqROF6l8hFQMDgANIuj8QxNIeVrxyP5C%2F8efvgJpGiDxOpSDEmjEUHAfKbP%2FbqORD9c9zR0lO%2BqI%2FshC%2ByfOtR15oscnDNn7Bo1%2F4PkXUHNUFoJ4gxDylLSNraw9WZpVMPSxzM4GOqUBOm9AZQw%2FNTiY7aHfMHs9DTWjs%2FVfQN052l%2BxwDwLzYpDtUPXNYcVDRKrDxSZJsyjJMQhzJgrR2zaLcb15UrG1Nk7ux219PCLyaI%2FNctabIqrwKT%2BdK%2FwslR9V2PzUOp8rfeub7RAD5cgCs75SxWT25zoHMisXDo7HrwWp3%2BGIuSqd5K53lZ4gOUV6rikcFUaQLQ18dAinRrhbc2YDlqwUrUT0H9r&X-Amz-Signature=8d9904e4817217408998d517e6a5fd5eaf0e5559d3f71fadb19fb13207dbd65f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UQ7ECBTX%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T033908Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDMlI%2BPEuDC1bY4rWMxMu%2BKXQ1vJcjje0iy%2BBnhQeiycgIhAOcX0thsmiHlMBqp0EVJt99RxWH%2FCosqsNH00e9%2F87b6KogECMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwK%2BWF6MPTVqJDtfUgq3AOJD0lyEbRBezt1lCxR%2FEe0Rp%2FgFaK%2BTMX7pDO6pQqhmn5gstTTLZwDV8gsz8F0es%2BW%2Bj53R1oMYpZIlV%2BnCGeBgWYlXyiLzvuP1qOMRENPTbDLg8LC4OkJBSLMUpByGC6TvhFqgCtqA%2FcSSUHvS7vb3cR4oTuQJcbdvsRgijeYDUWEct8%2FqbA3w7JiPsuqk8j5%2BYfYA9DkBMYDJ%2Fe2P5ybLKgJMtBylHwNdt4kn3QuoLRckGAqc%2Bx1CPc7mgaUVao1Ta5nC%2B7pyEUwdqqXS6xEimnXAJ23eIs%2BFyOx7EO6ufR%2FFdCTFQVQ4i83LJt7yLJVrbpVzQcG37rmif99GoeWVrz0worrsYbPr6gfSKbw26ASjSrI75q5E5ZwrjvVhvByqBs9f4%2B4zl3SI6ST2wc06CEwemSjhiwTwGUc4p33d%2FIJ16XDqGTACUPd1Gr3a1wAi3vaH5C%2FHSnabXfd3QHlZcPy%2BwYdXJ6AYbiGDh%2FxH5BEMbokyOWFAXoo1IwDVBWR4PCWDJeS2GcMXwCUOdz920hNz0vpKoBV6o2Ko5j4dmYy29zM%2BPTQY0A1eXmmvFXCGh53Ky5NGuFEiA39xT7SnN9NhunQMYoYbtNKAj0QEDwa9En6DNgLf3FCDjD8sMzOBjqkAdcVoIAfzrpY1FAceXdXS5Jh7OiNTwRRA%2BY4XoZmdc2vcF7lJjfXidpaa83G1AYSYpmGb9K4nU5IIUS0udOoRM6ho%2F0dLwj9lXrO3cXzrjW3QKPGSR0g9sWOeT4Te87qj0HrewhuLRpQ0B0TMsiqj3Ua5Zq6suVpdMDU0n2LzO1uJCUWJN7QLV4Dxyz5c08i7e%2B4NPem1wliu8aUPhNqjo3CNPWG&X-Amz-Signature=c8eb71c2db0267b38c257b234280878c1a7966ff83be767c8016d6d8dfcc5977&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WGNGRZ2Y%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T033909Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDGmS2Thfw1u06ppNL%2Flbtd4%2BbELh%2FhYwN%2BRevKVbJy%2FwIgGzLw%2FuPYi5PoC8coJCA1DHKaf%2BZ%2Bq6Fk57%2F7q1KlMigqiAQIw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHf71uCdp4nnVBdCUyrcA3mBSknybxA3Rwey%2B92j6DwO1DxMWY8noRK75pgiOUX7Ift3mWFJH3gv50KyCFL5LTlvXlATLPTfehilBv8UIf1YODCmgYZRVBqJGDvtM9ILyjwNlhsFXu4dplek1duk0yFzHm0WisDeDWZd79976BF%2F3O4dpsW3fEDslXEWHphCtdcB5rtl8%2BTyotpiDNZv2l2Xsvw4Fr1Kuyb%2FmF2BUigIJB%2B%2FJZ%2Fxd2Br%2Fo2jreNmc2Vu%2FZcUB5dEVuVGdKcv9rxxJei3GqM18NUiYMCBzSpfdYDZbeia5ZHWYZCI%2FVMak8yOVTkC%2FRCnH3cNOlBAs%2BLfcbZcE%2B0Q8Luxe0kKyoVnw6dqkqyr0RGPZFqqdslCkoEgtfovoI0LccCTWzYbx2a4I7waUqr7f76xuzbSWECfGsR5FIwy%2Ffp2shfCfbG3Ba8dxSFkSeXttawBppp01jtx%2FMyH3BOwI1YEsBZjqzya1bD7ZJvEqMBml3MMGgprJV0LKqfvJWEGx8G2UsFBAMUca5M79Qz5oEvq8MsBkfYR%2BMo3VmYwJyfro%2BZITpS4mWU291s%2BVid8T4RliKI0yHuHmuzVeD5Latk96tMlGopzFvRY9ievx%2Fc%2FW1omgDij2G7amJMj%2FS0YcTqsMPKvzM4GOqUBsThpfwStZgpAsxnJ6%2FKrf8QdbVQrUqJP%2BL9HHvcso302rLEzhmSmTykk5htmj2e1bWJsQwN58O%2BbtwryRrU6myOgGjBd4QEcigIm6XaxrmSxNu0DW6CD16wDO%2FaEGXpQ%2FLPX8FOyrblYj5EG2JpAiVVPKMKTNCC07Mz1e%2FlFvIad4hwSkZPZ%2FGiVUe8%2BZiGCRHDkJz6Z7vlS5F8d0F%2FqzVCmvL9v&X-Amz-Signature=de10b83cc6548a89dfea4ccaaa9dcb140bc1b7999aa8b2f6bff0ed18ecef461d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VHSHZRH5%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T033910Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAy3AfGg2sojm66ZpX8B1MBHjTy6%2BM5nxMJ6EwUsQJSvAiEAmlojnMl1QH%2FiGqcntiopG%2F6jhi5rbt6PZAE8ZxptKYcqiAQIw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAqwAl9%2FZMUfxt9P5yrcA2PHjIhWp%2Fg6n19o2x%2FSUZtfe0EexnPxA4TENBuo8Tb84hT6nKndTg4fLPl5ZzI4K6HzpjwKicuhFxzXCOz4YLrot7Sn94eHwWJIYNUzfjpe86ebfhEWEE8tEDJolLQTrIn7zH1wcIK0bDlH4pPSYuPB3rhiD%2FJbJ%2BfVM3roiW9uhsr4ZgDxdtzzBC%2BrXFc%2BSMLpXAAnIS9iVQtCsdbm3smoEvzlYBwRbNVXy1XZW%2FU%2BayAjihYLHTfqDv9kPwmKbrj%2FCNmPJMMz6zUN52ScwZftf61xIM8Gy4gk0KXT0asoZ3MUsueSTCiuWOF0qyzC6SYqRH44CGT52mBV%2F%2FNeof9khn3gGpLT6IxRf49%2FPgeNCPhfHwtJfnaehyxXONM%2BIFX6mBa7K09A0aHn59OmP3nwlzvRqTbj7o13FbedmaUMgBZJTuu98TFe4nR76OWqV69FJxFmBiJd8Jwztxy78dX8IZ6ajWoQnOyXwtabu4RhKdY%2Bibc8TFvOc5iU1pph8RAjDxw3x6AuNvrB6fu1M405fhzi%2ByqdcT4E9XrUZujPWniqDLl7LGhWh9oUGO%2BPtn86SUKRGWI1iLdfZcv8Hqa4kW8u%2FSVxRRIBl7rwh11B0OiZHlPxQ6StZS0MMJ%2ByzM4GOqUBAdBHipO0okJDhtgcDHz%2B5FQgnNp5FHUia3VBen2WkWuL9aOFDlnpO%2B2jQ7ZFfYv3V5mNFMRN0e1ZZFsiLaB9Bu9dXm6DZqHZmiD3Uz2kEwncCugXI8zxWLDxdoTE8Uh%2B19UXOUTpz7i6eriUalsiA%2FokkNfpqPzWIn5XwsfaugApgdf0xyfq1sLvMNHwx7WoFNzKa8BvxA3ekhijlFij7rh9d3hy&X-Amz-Signature=221dd5b791ef6353ea059f3ef3a646d40304e00d5b03936465ae51ab4d1e98cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZFZGAXYM%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T033912Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBYz3mxfSooBnW7yQG707kl660NBxuzR8QyfvNjaAOLIAiEAmmbCY4WrxA4zMa0LlwHmDA1JuL7P4KE%2BTrghU82papQqiAQIw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDK5ttqqBTRvn3TmKVSrcAxc9n9P7g%2Bk9B0%2BS2PFm4XxCUgu2vbkW47kgMu8Fe2OFS%2Fm6Z1XCsRx6Gaa%2BnDeS%2BzoKr20ZrIYFnwCzMbWXoW3QFPsyMX5%2BlskddSv6JGM01eVzCowL8%2FGZcbajMEDgQncOiuRDMEVU3P21tvEGOgo19yPa0tJVyNfCJwsdSeBZqMN7dr8wTFxWKq8VeQf5W%2BT309leIVIclEFvsaqSa1RVYMtbGbIoDfCMfVfcoFgA79o7hy%2BCJfNxfThe23Ht7ulFog%2FbvEzhV%2FBLoqXrJrXZM8cR4K3UmfWGD%2FX3IrRFQLorkpcUn2oSLkfLNjigSMheX69BgsfGDJAmXpIpgkWJ3jRhNnQWTO1dtuufwOth21Sl%2FIbOYkVFJz9EopHlCJmdUozsqrBXDl8bfMsUbIf%2B2AAopDS0M6jNRZhrSXOFo2xMN2kp9aBSI6Kq5Y6r3YOuGz8zKQso69aGq0r8ckK0ji3oqx%2F82OyNebk07ZndI%2BDbpLs6eAqMtre%2FE4TLwQQMbKpTKFe9iEkuK2r5pUrE81BLTmyz8KZe1AgUXWtaIWcba6jb3m3L7dDOFgqHzMUSr0dLLv6hjoJvv8U%2F6ZamPRrga0dHCqDYh2Z7I7eLEEnzyVrLvukogoe5MLiyzM4GOqUB0Wq%2Bnm%2BbW6tF7rCogTT%2FTfXKHJICxEAktxvKfXGj7KUfbSV322Lr7KbuzrSZ9fMl%2F0RQ%2FKW03tAxsl1nBazWUxd%2FXgqBgppI1uAkIfNoz9Wqc4jOD1TMjqPnlHgTAxth9ovZoAHyAFZxN0EN46YZvPs23mGEV6K7nFMHf5IAyA1JHsuJwsqx3qzChHSvv94IxetZsYbOQz2jRz4viVJkcH6ZVZ6d&X-Amz-Signature=5337db975d3fd3c5dd23ff6b997dd24746f294959179c8d4056bb04f7f49d319&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZFZGAXYM%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T033912Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBYz3mxfSooBnW7yQG707kl660NBxuzR8QyfvNjaAOLIAiEAmmbCY4WrxA4zMa0LlwHmDA1JuL7P4KE%2BTrghU82papQqiAQIw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDK5ttqqBTRvn3TmKVSrcAxc9n9P7g%2Bk9B0%2BS2PFm4XxCUgu2vbkW47kgMu8Fe2OFS%2Fm6Z1XCsRx6Gaa%2BnDeS%2BzoKr20ZrIYFnwCzMbWXoW3QFPsyMX5%2BlskddSv6JGM01eVzCowL8%2FGZcbajMEDgQncOiuRDMEVU3P21tvEGOgo19yPa0tJVyNfCJwsdSeBZqMN7dr8wTFxWKq8VeQf5W%2BT309leIVIclEFvsaqSa1RVYMtbGbIoDfCMfVfcoFgA79o7hy%2BCJfNxfThe23Ht7ulFog%2FbvEzhV%2FBLoqXrJrXZM8cR4K3UmfWGD%2FX3IrRFQLorkpcUn2oSLkfLNjigSMheX69BgsfGDJAmXpIpgkWJ3jRhNnQWTO1dtuufwOth21Sl%2FIbOYkVFJz9EopHlCJmdUozsqrBXDl8bfMsUbIf%2B2AAopDS0M6jNRZhrSXOFo2xMN2kp9aBSI6Kq5Y6r3YOuGz8zKQso69aGq0r8ckK0ji3oqx%2F82OyNebk07ZndI%2BDbpLs6eAqMtre%2FE4TLwQQMbKpTKFe9iEkuK2r5pUrE81BLTmyz8KZe1AgUXWtaIWcba6jb3m3L7dDOFgqHzMUSr0dLLv6hjoJvv8U%2F6ZamPRrga0dHCqDYh2Z7I7eLEEnzyVrLvukogoe5MLiyzM4GOqUB0Wq%2Bnm%2BbW6tF7rCogTT%2FTfXKHJICxEAktxvKfXGj7KUfbSV322Lr7KbuzrSZ9fMl%2F0RQ%2FKW03tAxsl1nBazWUxd%2FXgqBgppI1uAkIfNoz9Wqc4jOD1TMjqPnlHgTAxth9ovZoAHyAFZxN0EN46YZvPs23mGEV6K7nFMHf5IAyA1JHsuJwsqx3qzChHSvv94IxetZsYbOQz2jRz4viVJkcH6ZVZ6d&X-Amz-Signature=0f6ede044b0e16e714304ae4f9480a4f637aab7b7bd0a27482900d83dc7a5361&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
