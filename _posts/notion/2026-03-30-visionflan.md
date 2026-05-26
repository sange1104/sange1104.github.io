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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X4EHTMVQ%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043418Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDr2at3AKg0D%2B9a2cOXuF2XZ1PifcmPQ9I%2BwYEsnNB2CAiEAjQe8fDJU6mtB0f4vKhl%2FcoQFAeWNbnZ%2Ff5rqPRItlqkq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDPnPkCG4SwXFpWEQdircA0%2Bdz3KXlIdDI6kzAOSbW1uFgWfM5L9s35CtU1IwIKTd%2F5NC7lAWta%2BdVOA1srfpTFw8MAjVj1sI%2BJpeuHHnOsNZeR9sYnrzfHZjPEVMYe%2F1Ryg%2FBbqtL706FuSV7oZlpKyHao65LoVAaFHYwvmP3IK6CKh7EC4prFbM8JAjg2K3tPhX%2F%2Fv6Zo80XkkkzJhObwoVkCxBi%2BNKEzjEx0DGwiU0MkQCpTxXpW3WfDes%2BFb2CVmaYbbnWHwXdSA2MbZqWc0j55WkKjHfXc0%2FtXPYzkVCtaj8m3%2FqwNxqd%2FS%2FSZXuGFQENgYQB9kKSneJtERlXA9LpG%2F1r1%2F7VrcF%2FovD58Iw7iC%2F%2FTRkoTbLIkc89Pw8VFMod%2Fdr5qFIS1mSOfKQMut1DK0jz7qrmbEVhmapFQtILzYkICGGoXUSNAi%2F6G1af4cTeiDWZLf0M3hhYesU0EDVpqIIjqfSmOplwGV%2BRLRQRwgWz7NlN3nFd68MWeT7Gm9e4Xa%2B0Iy3S5G%2FZtQRLzCIexL9bjsF%2FiwlQJXbacSBgITp%2F9u%2BvICk1OOFLIVqML1EzByJqNGvamtrj3VuvQGyoHQWab11wdNnqcEurlbzFJYvkeYLwouWNuV552VisIUKEnFH6ux4UQOiMO7409AGOqUBEhAvpL5xQcBQ5an7vDO4g9G9MT%2BzNgrlDkt9nFFnou2dkyGAM3yZGe9Lbt%2FH0um5cTacCGQl%2FuzKanBs4SGiKWHb7Nntfw84bCYC6K3H3JNtmIhCQIIqlT%2FY%2BaepH4vhAp2mRwvCNljGg6I%2ByHuZMKBeALXFPAIk4Do00EqAQAwqaKs%2FA3KAlowubk5s%2BfoSlUuIdf7TPrH%2BSQx7QeaIkRb024m1&X-Amz-Signature=1fdd1a06cb08b6351e523746455d588caaa59e9a55d42cd3c4c5cde25404f0eb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VJLB4MYA%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043419Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQChqg4j6NFwg7Tj8ybcpzzGx%2BwO1AuH17WpiDcuJOHoMgIhAMxVOnLWEh%2FdjjJrHRq5ugippvUgFPhY6p8%2FWZnuxQ35Kv8DCHMQABoMNjM3NDIzMTgzODA1IgyZPTqPY1sGWuL6pNQq3AO62rEky3Wu5ALvG%2BM98MyWPzdBooTjIeyY23wGEoQcfzh8X3TUyuqqIZpwpFBxcCjg91fynDAlCkLU4NqW2sms3tgW5a%2BYc2pnySqVwJdjqmvQs5Tv3gF%2FSYYNEkXfCJUKUUkw%2BrsTkDKGcMOEiWUXnE6F0vHxoV%2FivAMNhZ6RzAIawbEojp7qk%2FhV%2BntFlALqiWYw3Xgkb2kGqoUVvdKL12CzmioIjmCo4BuLLyTGqyxwHCJsxSQPLDgnZt%2BktZQbQqyr4HIdfpW5HCJTsYZn6%2FmBKU8AgFQw4CxHSQD2T5aeEllYiMDTOY382t9gPItDeRPOFsjIfGmvKY8eVTQvX6I5QI6tfHFFsk6JLM1Qbg02j2T1bQZAaSGVDRIUdSwXM%2BTfeVGq1HwN3CfdCZL3YCzTfp1uHeLl2g2lK%2FNflxKi%2F%2B5eZINSXgy%2BWOnv0OrpCeNnpmbXYSUlnzCeJ33Pe5z9hzDVaJcXrbTjUSH7SAtowbgzPDgs88U65VHtDe9KlOIwJ6h%2ByinGFAftaqQwGuc2NwGv%2BDPuGAJp%2BYNrTz%2FtgGc0PGzytu5uPMAuNkreMMeEq%2FdeiHBo9i8DJR79IKpP8JJ3tCdqne%2BmhsDyQd0bwy6TqR2B7ls3FDCt%2BNPQBjqkASrRYunwf1d1YqO7hfBOOUuJIQZ%2BgXI3lMRDvpcTzsqkpk69ibCGaZqLGGQuolPnZtY0NEmfNdpwfQlVmSl857PYi05vHE7t1zZCkpTDusN3AojC5raa7ldSMkYX406TYOw1i0rrBV%2FdBafzFvQL3hTzGHjcjr3w2Cj5%2FGVd0jqLMiuI8Xg%2FvdjRT39NCZ1RJwSBHMELUD3Nx%2Fh0CFK8oQO4VpCk&X-Amz-Signature=4928114abca73922cf92f4246550c8c6086a27aa84780769ce4a90084bf16b32&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S4F3664I%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043414Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCFMUWvE6ytj3eizOrjUWAngbZLUNzbR2chL9IK7a%2BXgQIgVJlKcYoypVlgk7bc3E9KsxlA0FwW%2B1HC1xuePMOneK8q%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDL9hFmMUmqxpKhg6UCrcA8FPDWCM4w1aVq2AD6TA7luYzl5O284KIWxH6U9w5Hzuokk1siCKyKopu8pX7tRhOo7vUs7VatFMNrXn1U1lNeCUJi%2BH8k5WpLv6Gi8psIqlzydzBuMjKYjTCo5AQ8LzbXP9yju%2FVuCtlp4CVlra4Ev9980NmCe1slz9kIQMGiRgdZvENOqbiAJ1ub%2FEg5mGhoKUThfhBYEze%2F%2Fkuqtf%2BJwfe1M1VX2XRk4D0EMsl0%2FFVkiGrxJS1q6FOImi5C5Y3RMG4HHdeTD431KL%2F%2BXMkCuCW0cXgSfcEIr2B99OnO4vJSJd3Zr5X%2BFKe%2Femlro4a%2BDMP6UFAjJmQOMFqK3Zqj%2FnBO89v6gUoq%2BRpMwiMv7piuCsAn1KXN2HlPHgN65lKOQWSW%2F2OM0b8aBZHtLZha9Bs1GIw1Fyt1wfd%2FelQeA70%2B4V%2FV4GKAfK4kCV163ojo9EkAHVoQJklwhgZcc2WjoATadn78U2tZrdFnjMYWy%2BHhs7oE3ObU2HA2EjeeSNkCFgPhOPoZhX9qUS3Qr0NX8MfqYNNFuqHKcZx2Ftk%2B60AofzLhSpyuHWjBzMs7YGYrw%2F8DkksdAfbltuYwMImmfH3uOFTCCIbJ%2F2d%2BjOmZNO6TIZx2aetxxgCnCyMJj409AGOqUBjYJa4YeMD8Ho%2BAwhagMDByl58RWfiBde%2FSmBX5fdQps1HgrQKs4kiGDKVaRsnbYyiVYDpyRaVjldllBzHiL5wAyTRHl5Rl4OsI6ZgWysg%2Fq%2Bh3UhoQw2qmuBQrgxO4zAZ10E5xaT9ykv65n7dRwL7rF%2Bs8W%2F9w85emycm5qAOdLry1KP23NkH3IjeEXgtsayZPrGalPvNOUC11WknJdLts%2FvFhVI&X-Amz-Signature=6adcae6b07cc17f050d81e1f5d72baa91d043a709e6b4faa57c1fbadbb9e409c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664UT4IUXC%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043424Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDqH71v%2FvKJX4Z3XetLK58E2qaVnQkIcELfHOQDdwh3gAIhANaDak%2F%2FYupSkWD3LcTPtGPsNY780jVh4TfIy6t1K27FKv8DCHMQABoMNjM3NDIzMTgzODA1IgxfE11GbfZMBqi01pcq3AMjzUKLtFlkb%2F0Ipp7ubVWXpTuvXUSJhVjauPD5ak2RTZbagUtOEYvVHeQsABkLojuPFhvBrEl8f1dEkmjszFSrVfRrYuOrkIkWof7fotM0eeZHK3%2FWjb7aQW2V1Sj76YAuiNRQnLDgGJfAWpkrdcgwgcx57%2FPaCaMVa9Pf7J2XbPrZySeB1GYPtn3N3%2BE0VEiFnA1waK%2FP%2BZ03U6ewDE5n11RctMHIWDQcxHKhSq1pj1tycTuN085thNBzmkhV8urUa32UE24qLXgKT%2F7cXaMuVudKtSUMp8JcqHnYw4OgG%2FEdZGEyQlSPMB0oJsUm3xnluTdOyKNO4Io5kYY8NdCciZmwWewzpOTqBY3J6oxfugwGD81ym93FFsXqVSUHoWTpi%2FFk7yy%2Ft4pDVIWM2Dhl7LoC4X%2FCTG8qFYd9SUCSYEmVXtl4uOISPXuic8%2FO021Q0oCd6Qck9LuDaeOCboLuCYjDHlHGp353hGOYowmsl2Sx0NUpDPe3Tcxke2Dh%2BQFtEVn6l%2BNxtx5yNoa2dFlAgAnqUnR1cMMjWuoq8mhcg32OWj%2BtXJ%2B20dW%2Fv6hhztWWegj8r2dxMCw99nN3l%2Fsw0OTJ7WyJnwwkRNsyJ7J%2Bp6MTgF%2FzahVeZzjTAzD9%2BNPQBjqkAaru0HkmKtI5RskirR9F4AdsXus3s27XCtm64%2F9XN39Ht9%2FLWky3rA%2BzYTNVmBsefwXSAODJ8tL5NfISFNtHW8%2BPhcxhi%2F5Vpo45LFVVxd8xcsyHlNS%2BfrCYJfQcRusycjENYqtQIpGGotpGvmhI0nYYhxVZvTyPIBS2DIWK1r%2BJl25kvsflE%2FX728K7sIWqQDzqV%2FxIwV2lix16hIPVOLxOKTEB&X-Amz-Signature=5394cc06e07941f42b9b737aa190318b5ed25fe48cf8568bd783621f4833abc8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46644MK24OB%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043425Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIASP%2F%2F0FKQ6th6Lx0qnlm6IUe3me44r4UBLfmDCUpEJfAiAIR5ZsCSZ8dT1EACMsQgLcuTZ7500lis%2FA4V4JvmGOnSr%2FAwhzEAAaDDYzNzQyMzE4MzgwNSIMBBzaDLKC0ST9CT8dKtwDOKSU0ud8dtSKwTyknwkbprCRujVGp6B4Hd5%2BR%2FUDkVBW8RWfr7dwEQH7IEiNof3SqFcH2rwtB2i3rHv0V7UYWeB093E77ZJTzbfh2Gchgp85eHAGa599qcXvE%2BJq7OiDVkTascMdRrDUSHTx2yQfPkgFIOFk6jvh538aP9PN9SnkWwkAfJ%2B334mWrM3U4zBmKr%2FWSuFzeerGwCtgitE2vniY7ZuWHpUJ5kHhm4ecJMZA3axaAPQoR1mDmKHCh6pMbnj5gKNadfWQyCFN4Th7imyBhvj80QRPzOl6%2FIY4wtAMzhs%2Fk4mOuvhkhw%2FOyOmyj5Xt9YouW%2BKT8RaWbt9PCy2gwvT%2BgHvUqxDZirEjRbhniwxQSGx8%2FmmY0t0MQm2abED2F0WB3qolvD4OJrUnNug8no%2FaTV2jPY%2B6%2Bx5rhUlbUA8JvvdVqxFehVffyVCi89rq58TFFQuzkugBTrzcA3O41TVuQwDroVx%2F1ppW1WnHT62yTgSu8vu9U7aROwQZpuhpzRjKAeVG2MlvDVOIiEvX%2FCaPlQaESCInVF5PWcXN0CC6%2FvJGHv89xt1R%2Fwu1dWcVmepxNybQWbg8dzIl3E6bx%2BYxSCLCZRSf9WiXUQqj7bYqeXAhEt%2B7GKEwsvrT0AY6pgF9FD7kaeVLKbZf6hlpLEBGy1AIDDJleneEBDR%2BhkQwOnkbrqAdtXXult5aAITx1sFmE79cmH1bagSBTZXz4w2VAqudCBykpi3tJ9i94sY%2FVdnq5heNeM0gWnc28dfvDGHr%2BxT5UuUD5DcNLSrCLtYPMg2G5AE%2B2sAp%2F498fUwz1UaJgABz4MiZ3CD6IPkYgO7WLZSLSDxbMwZAD2GXlzOp%2F9o3oMye&X-Amz-Signature=45674a39600ef57319ebd021057b78ee1050237eb1e729954dfdc2497b4d4bcd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VXOA7UUE%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043425Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIARUwenWc5DBsoQ%2BWahtHseXP5PwrDpozHhk83XXO4AHAiBf7G7GxqKDyE%2FkDxOe%2BoCCSBn7BCup9sEUM2Amc3Hg1Sr%2FAwhzEAAaDDYzNzQyMzE4MzgwNSIMbF4zUmNB2oqtQOUFKtwDPoQ7tu6WludGMeh1tz%2F6ffyO8upNGe%2BadJ9Fk0qNo5Z4gr7jUVKcX2dY%2BczDQqC3%2B2pJr9jiMe%2B1pGp128Hg%2BzP%2BzsmnqRQ4WOYZG23qqEEPSRNJ2h1%2F2%2FWjJfcl7b9VoXLfRyjBPDLS9KVi3wQoVE%2BcSC93fnX%2B9n2xC8j01eT%2FYbCgWiRWrBFzc9%2BHts%2B0JqowsEDXGdhpIle%2B8N6cELbKl9wz5G9OlF3ItFf6TyyvrVHwY8NueAl8%2BjhDQP297p1ftEKX%2FzlSHijNvzDec5zTv2oqFakoKjZkGvvWfBGHc2v0KUr%2FUVXs7bLT5d%2F3LVjeVE%2Baczs1YaHYV4%2FjnwArUSOrxmBMW7wtPDBifBc4MmShXgU9SNMaqXSZVrEB0W4tCYI44ExNn1hN2Hqdim0qEvXlp4Jhott1PhnMHpt4c1yhgtS4bXsAmWjheXr%2BrT0XFwyZypm3z4aoEQpo51e4BIu363y3DZ0eSdn5rIE%2Fm8Dch55D28S3naxNQq%2B3os1gxtXVa5LfJ4%2BREi2UNJY12M1Ghklvfyfaux1%2F%2B6%2FafQ0iN400pxcT0VzTKdOiUQInEUQsz0ugZ1sfcJM7VhiAurYcoTkmK2zNyxZJ16d94hDH98WrlSRFfpAwlvnT0AY6pgFu7SMaE6SlGVxIGB5nOhqURuzt%2FiuHZaqNQ9bT4xgLpyWnQ%2BRLjutEWv1CaOsLfnH5uKlCRwZzbuz3tQFgilPhG3VNN1iIDn4Xt6Sp%2Bodl1jBvFTjvTXoF6rrw4XmuWWdIpUEF6bS9eLXuE5R5spGVdHknGjasl4x4Ye3pywuf%2B2zgmxEmIip%2BV0cDGbx%2BHVlQvQRxYE6Ud7JOeln04ARUTz5vL7Rk&X-Amz-Signature=5529b6f904ecb7e5ee8fbf0f6f43fd0fa862967f33d96b770b0ca7f662beea41&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QXAWDLR6%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043425Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHD1Od%2BOoz7PHiOSVofq6P2Fcbj%2B5pHV2j2TE4gVjad8AiEA2XWgTaXCYkYFWXc2DA2lmw3Eg0J6Go9azHOE70GLmnoq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDNwiU19569UozRHExircA3%2FxzJnNHLFl3xurvtPrbU1kue5ieyz7pY4rHWEoZxhfRgL2j1ryM2wtU5CGV8zT2%2BK5bnbR0suZLujG11GeBPIHJaQCk59N14GI3O%2F3LJEVPHN0Vvot9AmrkrvZUhGdT%2FneSyBlfwmfTcriWCTnyZdo%2FtZVgDAN%2B6q0svGZOKrBHKY5JMvFgRaezS9xQ92sse5L22kGCG8gbU2w0t67j%2BhWGNcdImm%2BkfDK%2FUtfy5Iqfx700JPXMvxB%2FgG3NVS%2BZoSBhHSy8H9R5470cbsXTqwRLwwlUEC1vh%2BFcC471052C69soWoLKoDoIxUsmLnuagWsoduPuEvVkU5b2LutVm2AXpI7O1Vk21GT5qsGvP6LHgdBDB1IIJdkQH6rLqn5g5fUl9UjJfXa56lLvRZO5%2FKgSPSAS0IaD5ctjUTW4qs6CL6N%2FQZMIkn1HOUrCUPb21h3%2BaV14cJYOBGeBXuRX8vxL2taCOchMOVmPqx6gDhwSCoqI0AULkruBTLnOQ%2BZDbFmKD8HTYMqLQTxEuyKgnCFDoeMnOmVZUv5jjGpkzukbGrENqovzhRRIYG%2F0buDsfBBjj6B6RKyoRTaocCzNxx2mgQcw69nu4szBSw2H0kgvvtY%2B5y5F6tT9dRMMMj609AGOqUBHzUe6%2FwN2byzi5qY9xojLCTyOVKqyjKdvCQx2y4VYMKIZqM3gWNEJOppHCb9iHqO%2FsXWz0QqelXuheo3UrSmDlJVO9vrzwHO1qW31nuE0CLHLcjzflfQZx6XBZaiC0o9yg870A65vv6BHl%2BP3OqL4Dw1ut%2FOr%2FuqxYBsB%2BeY%2FbCrobjEOMe%2BgYpmajwK0AaCEzzzAqD2hPuyZpj0m0NJBV5QzsYo&X-Amz-Signature=cbdaa4d6077371fdad2c9cfbd46de6662e75753bb475ce8302145aaa1115b345&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UI3E5DTH%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043425Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC7bNIXKbZ0yShXPI6W%2BTpOIrN36eiwzi2QnPNKcIKReQIhAPpl7hhH%2Fi098PcO8gU7XzGbUdCmhjN4du%2BS5VpSgvirKv8DCHMQABoMNjM3NDIzMTgzODA1IgxBImqEUAK4TsUORTgq3AOXQa95qMw1yHYy%2BRN6bUE%2FlvsB9nCXJ4fcXC7vfsY1X7%2FcvPTx7644wwIZyIWbf06UpISrBsmp%2F%2FFvdCotk5IAobrBmjiDCidEL1cUtOU61%2Bm7Ji%2FbnAiKV31uIQiUE2nwBd2IzbVkmk8Uhtc4k9l0KDFPR%2B59B5WEKbq%2BGm7hiQh%2BagwGhCCC7GG4jnIA4irK%2BS4BY5qNTMLNvBfeVW%2Bo8AKGmASQ0tmeUDU%2FZcZwyDVqnpYhPBsXHvqLuTGa7MSlZuVZ7wMucFY8LUuCkk%2F3vz3DFbrangjKlCkKPexF1Kc78VvIesCETP3Uv5%2Fr6TESOCkzrwA8EUs1Y2tvzCQBBveFTSuXp71nyl4XDcgvaG4KZ%2B9wVHkF%2B1oJd8WUGwER9uNKmgK4nEIBKHo%2FhYfWDlMWbI2kdRBOwHThOKMe8raTLy%2BsFy%2FpC%2FouwgidYXHihYJIzC0xIZzYWoJXBS7DrbPDyVKXQdotLwyThlKmpwgGQkY%2Bcfw0PwRDBsA7hdIceMN11alkJ1%2FQSFB7ZtSAXJiWfoKQoy6PIJrIxp1a3qWo0gZOmWDWU2RmA8pEOAB%2Fo96or3MCdagwwfkr2ZxqjwPkCx%2FjdPUTxTPiYCZeRs%2BcIxJ80r8xKpVlkTCs%2BNPQBjqkAUSaKNg4sa3NVoMlrqLyLDwW365iZ5wCfK5rueABtZO1QDtSy%2FJsYh9AbKpBotvOq4eXNjyP0nGlOvTzu89XBeQUH5IOYbXEoE1g76HDWV8N4NOaMt3AM5%2BQpoPYOSb%2BUTz9qomq%2BnpUnVyganXwQ5cSF8dEAuFP4CdRfGfsgfSOktbpel3xChcIXnoM5RwQ3Uqh685T6ebKZ2lpjZAO6wi5kRPk&X-Amz-Signature=fca1acc9818c881800e3dbc1aea88ee39743a0744c357a7feda031136eca0001&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RMIBXM7P%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043426Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIE9A6YKUWod0oE4ihXHDA6PqVysOfI4ZPG0wnlLezLk2AiEAuQEMvpQbbR2eScauNQ2KDqdRZs5wRaFbJVuVpansiXMq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDD3kqBu91sF8U5SAZyrcA9m0Y147KC0FJg0L0HWXLsi715IMwW%2FEtCjxun7SZxTMRDO4Y1X8nxATsImj3LPyxSYy6zpWl1bfP9xhLxG98aoi1m3JVjJ0RMMJkxbVRhfO2OXZgVsn24QNW8AKsWQYZNKsWp0%2FBwHjSjXikLq%2BaC3PvkwUtzMiz5z7CK2QH%2FE6ypPQ8Qc3nuL3s%2FZxVvrp%2FwGDfD46ivtd1F4hfflhKRk6%2B%2BUVmN8cQWpmkw776B6c4rIDwA9%2BQPKJT4Pk0U%2FmOwh%2F0rHmpi7CVk4N%2FKDN2BtRJZy55Go5VwG1lmxgQ%2FLc%2B8zLWzVTQ1yWcGNaf7dFyypSQ9bGeyBhJcp0SUtAshjeZnT3PHsm6j7o9UXLuYrAhLYRqk8F0vAO%2FkNd6Fc4h8%2FuIL%2BUc5gibOACgAGxvkg2pOrGL9e5C6VLMAzo1fHqYnQR%2FB7aaiJbvmgKJO3bHFdk6xe%2BORmiFLSQJS%2B3yiX%2BoFOMG4rdXu%2FrM4sRpxPlxFaWOdfGC%2BrJaeyX6p2b2Nniz6rGiK6qk1934kZhyqlMTgR%2BhTjD%2BnQuR61k9CCnUqdhLiFg90OeVttcq1zO8Qj%2FD%2BReTm0cVF7L8LEj4n3qzBJsDS07q0W9WbhdHUwbOYa7t04Mu9ZqorvoMJX509AGOqUBrSKF%2BPtxBIqr8W1MDTMx1tpKwrgRS%2FX%2B7ir28MEdTrjQsI988nL21LtqdJjX5GV5%2FUFqngZ%2B7YxF%2B6YwCymb5Sh9v3N3OhgzZumur8wm%2BnIu2u8XeC6aHibLKuYglVLZGnYqqC6WQy2QEuyCzl%2FGM2odgi8F6aALCNWFkc46xrhp3hSiCDwa0SP6C7H6KuSqOa2IhYnCLOYkv%2FEjxltzHja2fahN&X-Amz-Signature=59dc53141bf00b1dd02afad03722f38f6f32e7fdc56b05682b9940ac97b4f8ea&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664F3IMR4H%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043427Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC8441yy6HV5LsPeWeqp1S5n9MWjRIwrRKwBPxBMdLboAIhAM8g7WMIaeu0%2BLYDmS%2BsPJhFZtuvTXjKhM1GRdXidqF0Kv8DCHMQABoMNjM3NDIzMTgzODA1IgwXWxNcZOSXgP%2BVwJ4q3APWZOoy7nA%2B9ieAZ4MJ43iAIr3z8gCdr9DRik7xIFgTTGnmuJSAu3fftw5%2FSNeS%2BL%2F6sa2%2FdsbUuXxDmFyp33XbnSZgZJgyya1SuzY4Stqiy0Do91WVoixJKIpDmDZisncJGOL%2FRcf%2BwZspnBjWR3ChUnxRpnQa06TUNljgWw3bcrNFfn0Q2RFQ0igxtuVNAwvvB7gt36wkfdXMzs7CZeCMTid5ubj9S%2FF6K%2BLd2M5hbEnCepSymhe4Oj9m%2Fi6Aq1RhmXwYT3scXDSN%2FHqOoZe1cxZ8H8duXzmlnRElhYbOy3574U55fnKD5IUMIWb6jTBhQ94ne51iR4x2KXgpdPhjl%2FE1Us87wSipq7G4Yi1QNiqWvcnMAQ8uIgzj16F5miDBSYeH7OD04AOJFL4d7aSVL2fi8T1YD1ueIa6bkbqD0%2FK%2FboDbQgsXNUa%2B%2BeeKYoiAVkIhvR8pI4af%2F7N4qFahkCb5FQ3LUe0IFJVOw%2BtLIimVoQNQ970vWtbEFVSvmHlYkQIGp9YMOWEQE1nnrpue8%2FcwriGzQdgxODmTVkSwOpWd2F0gO%2BS4wurye5u9ZZ2ZMHl%2FtuBDRgkGZdN%2Fpe4Mi4YPgx2%2FzdtK2yTixNamrEhDzjoLTAT3yngioTC199PQBjqkAWZQsuWwPcG%2BQOY5IC4VXvifWmhcFtuezdodvVOwLP0obNSLAd2YyQEQOuUteQs2jxZ5mjdXZG9srZ3iSkADKsCxL1KsnGOQTZQXWMXw5zrjwMUQl8IwvHnMPLiTTU28qvz3u%2FiYv1er3bBO6W24cmQbpj%2FV%2FvmS6n%2BrJI%2F9Dn8nENM5sSw3JKgOChW6QV4nOx6J804JIkTdj7he7VXi%2FTLxNMib&X-Amz-Signature=4ea4d1a9be12a97344fe3ffc2eed79559c3d8a7f891d34d56a8d47f46745d7be&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RWO7UGSA%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043427Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDV1bceszxr03vEP9UHGd%2BkkTWGHLSnktY9q4nPQ5dIKAiEA%2BQQItlwFQJ5jkBq%2Fzyf%2F%2BtakmTJS8qA8I6aVShBvbF8q%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDLKsMJl2O%2B5chOe4XCrcAw6MneBxd2RN3FJQTuFH%2F%2BLpi1flX8Lsg9lp4m%2BiocuoqirZNnF5Fdp%2Fz8EjNXO8uobFCEZXR4pInRy0F4JG4qJaCWXflSEKA0f9JfkaqtUohHVdwbXjn9sp%2FpUWPGUHY8aC55Vyg1vwwrUSHGnLVXTOEWqmIpRQgJznfwxieFDgpB09MMRiCb1znzqZLIoyqk3FLh4BzPzSa2uabKomFzVootEyTcpPyB78szcH%2BangU9L3NMQnzWQKPcrwFP395TicV7VUFRc660le5bmtGoftrj3Id1b0c4aplZ4Dl%2FDcxH%2FpO3ITRM%2BSk9lq3MsfMAeCUjBgEN9zUpV%2FsIztChPRJhKptmxxohMJiV0Ykt76%2FPaVK9%2B0ZjNFASNHNvZfJgHkj8EqDO9ytPa0bnBt3iEgxA5nqxjbjwwar5sn4EgxdK36fxGF8Nn6RKppsvX60f3SYdbKW6eGvySdnsjhyKIOmDJJ91qFQnpeUaARTkq3r%2FvyVcMl%2BApBSXnH1dAnWl6mdUcOObDXP1vSzjbuAsxx3H3DnMDk7KSv5yxbyb%2Bs3NBvjletR6ygsmSRse4GhiRttFX6lzJ%2BntYIbYCZ4%2Bw%2FGkYc23I9JDI1aP7uP2IrZFqD1LbIB%2F%2FOqgTXMK7409AGOqUBJXFIDBKqV4aCBZFn9oZ9BAoV%2FG3ySQxgbZkl11L802KE5pVeT7PdBft3n5f0WPogW85Pi1L0GtKAaptVzZvcA4YT5vrrTxdNHgqJ8Vx%2F97y2nbcl1AjI4JDs0YN59cSgkqHTyKBqUh8KO0%2BatF6BhmpdkoQ%2FEXkdzpyn0wYkM%2FiShfk2Cb9tYcg5qyiTxlFyPDd8SZlZ60F5C%2B%2BivYWsN20%2B7%2FEJ&X-Amz-Signature=343cd1fa5400c60b425e8bfb74cad43839d372b8f98f9d991381bb1269361dc6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663WEVQXGT%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043427Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDKGJ3AoRHSsaeNJ064oN7pTkB4VievMw4OLBk3G%2Fpg5AIhAIqVNYWQ4QId2btiKY0oUrLuX8iJIGH5Am4MRJsiaZ3wKv8DCHMQABoMNjM3NDIzMTgzODA1Igywn6zq%2B3Gq9p6vOS0q3AMeN9Nj%2FXoypP94DBMZlcZ%2FbvcZp6QOZeFgo%2BYiYxd4Afiqn7OfIoOwuZORC8ApevqMKx%2FAlEUkFsCSY87KAF2CM3z7JO9ynpMwmWTBUARUnsL9MWlEWfxFKM149ncEy8lARWVM%2FzCB6XuyZt0mVk26GdaRHZsVgOIK%2FKegtYPjR5TDO1JPYg3YR%2Bm7eaM9LXggXfsNMQEDQEnMUjC6ZC6XroLRzKyk8NoxMlqs0csqmkUtCtUbA1CIvUJaWytlOvKUWuPlAT9TatIQBqznU0xptUMJac9N9acBsyxMOwn8yTaqw4W19ckrxq6qgladmaQX%2B07u62qCG4G8%2FYfCf4rF6PNgoHLUzZ116LQh%2BlKyj6Bebve2t%2BdxjAY4C%2BGLteOAbo4XH6dH2uRom0Nsfkr5qbwF0E%2BXHoUVMyOKOc8MCffyvRkLYXMuOAgk7O6YjpjsoQMPUc%2FrRRPg9mJ5xLDtPq9JjAwX%2FEIlrm2%2BW5cUOQntYNrnvLj3lL4ifT2Cv9lqHpErmCegWzfm39%2FXI66si7IFpZC%2BYYyYA4b3LTQNGwBs9l%2BZvXxpVCBr8PBdspSP4DCH%2BNFyo%2F1F64Yb1T5RLBk2gkRfnSW2ksdvuOR%2FZ9TD4XtduomR4770hjC8%2BNPQBjqkAU1jHPurYsWGACTxOqfIzeGNr5bJrsHZLc%2B8LpuGcTYY09KnPFB2kcGTLEeKXu3nHt22orUzy7y%2BH9hA8psFikbedJO%2BJk4TX69aUPYgjPxY%2Bu92yi4YpB5WsLEgl%2FXotFAUF%2Bv6nr1u7fbQJYwVajcOybcMLFJawe34hMJ0EjfuhkvH1u5vThLRkyost0tFkhp01HFcAxWHZjuwy%2BgM1CUXu%2FS0&X-Amz-Signature=aa428cbde11c1a7a2e98f4102a3fee1816cca6a43710ceb205214b669d3ac278&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QA5WOLOS%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043428Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFfGLmpy7DaE6acm9byJPqwRclAzpBjZESkssrD4k%2F2qAiEAn4yNr5qhLk56I%2Fn70hFIOdXpZjcWA8S2u4qBxoIQxqkq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDC02%2FbOrVTFMn5Vv%2FCrcA2pABK70k6T%2BrqLEeEj4DsowpkVNK%2B3Kco84ZlgK0UNKKzFLAwcb4%2F8ieIx3SPHtvpWanbDEL7WapdMtbGUOS7FRXR%2BCIKLa4hAVyzkb4PIjZMLkyPizqNAO3TcgO1Ak2BctEb6DJfNWjxnZca4bKEC%2FmbXl4GOhZwewjfxSI7RyKUSZ5Yy0yuIcq3%2FC0u08El8F9p9F%2Fwvb%2BGzU6BedZryEEKxFa9T7adUJhFAhdqkROd4rOuvrxgUGtTSuPc3nCzsGfmuEy4n628I4PW7m67wEPU1zbGFx8BIOEgCzms%2Ft5kWZiqb7Kh45VrMMln9edZdWpChSyXM8NJU%2FIkqDVKQJCjGVOxS%2B%2BMkAUcV7BSfggbAZrsLwF6lCSC9gVhqijM7Atj1QC9ErbreGwEMjj75wjCedIzb%2BmfsnRTN3hn%2FSuyVSYdnsCYOXdPBXvJy1iEwZKYkjESZBUjQqRdfMSo91XRBPc4NqiW8NvH00%2FJF9SC4r6FKBHQWzKf%2FvpgwEaHVr13mB1pZabpUKFOgdbfv1oJMYMeRc4WRPLZB7keb2AlnMAjQKFO4Hx3nfhSb2ZrUpQV93GmAKg4pWY5tyq0bmHuPYVvz%2FTFiVrCcxEutIlsCYh9OBReok0747MJb509AGOqUBhU8rHqjx5oaZ4FiCCIHu%2FrVZqVpYwWnumgs9ani0buDiFivCjInl41OprrvqsiTYB8dLh1WPVdJg6lYc6Dd%2BF1JWDJPH%2F2NC5cQ77Z2rpD3lydvS7Y%2FHc3%2BxREHN%2FW6Lmy%2BsRJm4yRWdNznRG%2FvUtIFnXWWM7IMVA5HmlijnsfdA3WughCXufUcUJWG%2BOPHwYaGyHsXyWEiWsoAfn4MYunHcWNsz&X-Amz-Signature=91f09617b3fdeb1f4abb874632fd0f8646b8544869bf7e6a706a82886d0a59c0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QA5WOLOS%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043428Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFfGLmpy7DaE6acm9byJPqwRclAzpBjZESkssrD4k%2F2qAiEAn4yNr5qhLk56I%2Fn70hFIOdXpZjcWA8S2u4qBxoIQxqkq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDC02%2FbOrVTFMn5Vv%2FCrcA2pABK70k6T%2BrqLEeEj4DsowpkVNK%2B3Kco84ZlgK0UNKKzFLAwcb4%2F8ieIx3SPHtvpWanbDEL7WapdMtbGUOS7FRXR%2BCIKLa4hAVyzkb4PIjZMLkyPizqNAO3TcgO1Ak2BctEb6DJfNWjxnZca4bKEC%2FmbXl4GOhZwewjfxSI7RyKUSZ5Yy0yuIcq3%2FC0u08El8F9p9F%2Fwvb%2BGzU6BedZryEEKxFa9T7adUJhFAhdqkROd4rOuvrxgUGtTSuPc3nCzsGfmuEy4n628I4PW7m67wEPU1zbGFx8BIOEgCzms%2Ft5kWZiqb7Kh45VrMMln9edZdWpChSyXM8NJU%2FIkqDVKQJCjGVOxS%2B%2BMkAUcV7BSfggbAZrsLwF6lCSC9gVhqijM7Atj1QC9ErbreGwEMjj75wjCedIzb%2BmfsnRTN3hn%2FSuyVSYdnsCYOXdPBXvJy1iEwZKYkjESZBUjQqRdfMSo91XRBPc4NqiW8NvH00%2FJF9SC4r6FKBHQWzKf%2FvpgwEaHVr13mB1pZabpUKFOgdbfv1oJMYMeRc4WRPLZB7keb2AlnMAjQKFO4Hx3nfhSb2ZrUpQV93GmAKg4pWY5tyq0bmHuPYVvz%2FTFiVrCcxEutIlsCYh9OBReok0747MJb509AGOqUBhU8rHqjx5oaZ4FiCCIHu%2FrVZqVpYwWnumgs9ani0buDiFivCjInl41OprrvqsiTYB8dLh1WPVdJg6lYc6Dd%2BF1JWDJPH%2F2NC5cQ77Z2rpD3lydvS7Y%2FHc3%2BxREHN%2FW6Lmy%2BsRJm4yRWdNznRG%2FvUtIFnXWWM7IMVA5HmlijnsfdA3WughCXufUcUJWG%2BOPHwYaGyHsXyWEiWsoAfn4MYunHcWNsz&X-Amz-Signature=f382e1cd0ad2f6d511d5e8e7d56655a3ed777efb1b88e3c88a74874689735c16&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
