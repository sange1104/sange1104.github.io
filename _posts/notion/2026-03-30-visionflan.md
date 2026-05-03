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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WRLMZX6A%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T040932Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID%2Fcx9VBo4m317Ui93DYERPXEznv7EOjzA1Kn%2FX0PxIdAiBvn6bbyM2zDK8J%2BHPpnbR4bv5mUvMQJbqXbCIaQ5kpiyr%2FAwhMEAAaDDYzNzQyMzE4MzgwNSIMkXRZQBfBk5WNNSYBKtwD1vd8JZ1K2hb9vsmtT5nv%2FLEoD82PwfGX%2FGfWmevarkmjoUC0NTDv3UnQ3AG8DSSPBO8l7UhOuOdH%2FglM0nq7RprH1hiD01%2BNaYX%2BS5Rw7oTz%2FDa971TjazBuJ1A%2FsyCckqwf2RUBRsvQrsxjv0uLDs6MPR5ALv4hzVa1%2F2aojYUtlyp%2FijyD6%2FFFPduEXosRSCn0h5RBQg84IaqLO4XgFEBKHn1x%2FizPloYIgBz%2Bh38C6n1DC6V7o2jCAntZSa1L7l9rYwNIHPyOW1HiHHNH%2B2Mub0z6RziRrdlsHgy6gkZkqjSRNwPN%2BsG%2FRTiIS8VdYg%2B%2Fy9W9TFvI8BOLxPsAgBnQ2puTjPGRPsyg6xNVDKgn%2BM1otEthHPaCRqh3tsjKa5HpY06hgvNwfxyKfUxmZKtrghWiS3kwQTUml4s%2Ft0DaPH7OeOiCrMnBWgjA1%2BVOizld%2Fjeqo%2BDTl4auUxQ0oDS%2BpE%2Fy769DX%2By9PBwkCbe6OR2JxxUoFa10rXUcUhb6Rvc4YtdNmqqaWVULpmY4cZSuzztooGAlLFg6TIwjCGk3qm8de2Snlc0lgG8TGWLvX6EtRRUvStxn0AJWfJnWGaIcuorYzLavKEcDV5h2Zcq%2BvUX%2B45AlpYS4iN0wlPbazwY6pgHJDvedBFNQ2PDQ%2BpHA2IiqARnfaGSYnGsX9dHbw8wcmeBhv7Kpsbba9zn79dUbW3IxvzJBD5ugRA1ZB9%2BTuH%2BUHTTm4u%2BAmrppldVfcK9rNEtDaRABhGtru92RF5IQuzxKLNfoumVmFlbOKFfCwc%2FKe1Mec2uZJGEf8dh444lECfcgZE5ruwRqy%2FW6xrkGWIOsWRVjBpa7VyeCgIlAJYhQUXuu5%2Bl9&X-Amz-Signature=4974707b83f49dae2e1a2dbc93a23967b025de13d7345e4c2e4074e99807778d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SO6NCTL6%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T040935Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGstWUojszW4xTfB0Dh63T7H%2Fb5HRPNNBZMPr6ZtE%2BFZAiBpv9KTWlvKd2ZSY3Gg8%2FVE%2FKqr2U4YQXlhRyA6wPoLJyr%2FAwhNEAAaDDYzNzQyMzE4MzgwNSIMn%2FCEj%2FG47GpF8DTzKtwD5xgSNmIzO6jwSGzkfRCxYwnpxcSXtjZkHcdZwlSONQ8AMw7o3gnkp6EzDCwibNhLijoJ7%2F9q6sL6gwgECL71YulI9BZf2%2BvbhjOBXelQpNgsrJf6Lj6vu4E6xD0ul3I01dRw9qrxh1ReirWa1dg91QvE4yXDVAWDtwNS9VWsRsU%2F1TcJWDDgIkF0drWbH4sAEnt9nySh%2BQn5cTBRNKqWbyoc57viIjvLk1uXO9ceLkJF58orBURluTXH036se7HUBZ4wj1O%2FuAhDBAXs42cwMRx%2BuIyEv7cFM8bzQS7Y5lgsuUY67yoqGBBVdmvVhDK3pLirUU6m%2F9fHSvr4voHXpErAvi1CBR5BV6o%2FPeJPf1%2FLy99LUzbf8akArVNazI8NlUFn57k1z%2FPZjqSWTynHF02v%2BF0%2FQKEmaoHQFcAjClL7B1vyZpBBK3eTZupTFS07v1dPeUItadrVvbxES3tZgMzz6xWeJqiHfU7kpuUPRduBtuGvgek3RCWEhz63FfvT4bCIZr2aBBiyfuqqNuGDUXH2AlSMT5wp%2BdRNVY5iO%2BPwdLaLxXVW3Fp5koVvgO4FmSFSp2wP%2BB%2BKPiW6goMAGRYLSD5buuGLwUnRZec3lwG%2FFnwce3OHk8aY%2BQswhY3bzwY6pgFR%2Bd6izT7p5jC0yeXxxxEyHky916Fl8eXS1BeKKgcPmjv43AOXuWBu%2F5P%2Bfx9WFDv5wgiMhkiqdnPDHyziIpr1cjPNeII6nlUBp0PZbZc1%2F7uPyDxlJKEzH4vABsZPVWdfDkR1rzj7n3m4xH2tCi7NWWJkq3rWmT53zbycGF9tDpp2U4k2ufd6TwjCwUjrWI%2BtH8TSQ%2BSy6EQxyNV9dOUxq95ME5D%2F&X-Amz-Signature=fb73a2a4f013a0ca8f841619156af124a91b6d82c6b33d29a975f9ad7c4517de&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q4A7SMEO%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T040928Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCQs%2Fy5BMr8mJSn%2Bl88sedCHfgvSN8AI05nyIB4S6zzZQIgKeTjFJ1inePTslf0XzqU%2FAWJjWb%2BV6LLKeQSQPX1JMUq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDFnqt0wVTic90lM%2BUCrcA%2BQUhrv6mk80LbcpBCm%2BpIitSUWGypTf7t6DKa98%2F1rM5EFOT8gtQdI5YwAi1WENoF9jCQuVbFGaak1PTVDuERM1GyQP1v9S9gAVowu4500b9d6kMFWp7VYye2RVfI7i72%2FBUiw42QTzpPMn7isJvEwo91Ou%2F2x3d%2BWTpAD6w4etXH%2FbtjzliLB9r8j3kUunME5PgbW%2FsivvktTfEzQbYyz4JzAn6rxvJ3GKzxTnvrm%2F549m2al6tTdZdrIRL3DlTMB6A%2Br2Cyw94JCw22uGrP4ZQ6YXOuM7IPxcEoCJOurOAh8%2B%2BQj6IIqIrNNRHOQhvFcKI2dwqV24Re23QTrpji7whZEl1EPynpddtcegOPQoi3GNvpn1OkphbfVr2ntdMwHGL6cMn%2BcLUainMNotmWkAgV3XT7tp%2BWSrk6EasAj0niufsK%2FXqyK21TvW8BRGyBP6yXVvTy6XKJlPnBxc0M8XIqXKh6%2F2iXb9Z9K4CAHCTKqEwGpn%2F5bSD9J%2B4rasLBPK1UM6XUU%2B8%2FtSUQNXyi5UJE7dXG%2BBF7f%2Ff149XG4TXNrxQJJ3OGsPhK89RdFe0de6G702eaFv3serM%2Fq6uqxsyWzbVObbRFBaJKv2I95SEbnzF4FTNur%2FpuQCMOb12s8GOqUB5QzDx6qYRGT7%2BSdVseYq5fBBiOWQxsGFLw6au083%2FtBoBanFaSLH4ODeXgb0v%2FJsAdpNOG1wh9Z3lqTr4J8T%2BOyn7jHXXGQDBPRf%2F%2FOFf3ZjlzBEJL%2BYOIB0JfUp%2FuHikmmTQumD9QqLTCWckev6uJIhCRv7EHYz8ctz9z%2FDUjKcBLdnihi8gjivvxgw%2BuQCRommgCH4pkQ7imp7h4VbqLo0MV5G&X-Amz-Signature=315acc9235047cb102bd4b1de3076e4df39577194c6047081d9d669b93763ebf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XOD6ONKR%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T040940Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDMtv4VkqrS%2FQfXX2Zk4iy36lhT8ofco0zTkWgf5cMs6QIgCQrHPuNdCJ2MLW3f0Z94VdX7cP91xdj%2BIBDiWnCZdfwq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDHtwRM%2BpPj5bXfh0VSrcAyXMB4Yxd5KDZ5NWEOHU9pdyQN1SN1j4j8dl161KTvh0NeVPZbbBNGo02ZF1jwOlNTVIGdXVvDZJnPYeM36GFC9y%2FkpHZ7gfl84aUkfIP1q9EiHikhAV8HnmnNskgeR4Pmze%2FSW2CW17b8bVMtnBpvoU%2FPr%2F43BPkgK3f5k6qvhSOWlFsbN5tNi2DnmIkdavcp0BRZEOh1AW3S2Vxl1WoAlO5dR2cihfNYZSiKvvL6VRR6fXVZWht7mcTdGsgPpIXTZLVjw8CagvLUnMoAwdlilzJ5N1AlhS73L7NqioTMniom9a1opaq6KFcNaQuj4Q%2FZakwcB4PRDEQCJzi9IlRnHcOSIE80dTtb8jWNEy%2Bqd%2Bcxl39giaSavLF4CofGQSP0dhzboDZaE%2Fm83Y9akeJQATKNuXI0pbm5MgxWwhkaabVZvcNvVCrkAPihZtC2ZBCNyRYAFZtT6%2BbPEtJgiaOYdn%2BOn%2Bw997Ff%2BKhUw9zQFsthn2Wwn8%2FHY5Gb8zMIfsQatIo2VZfO7Ma6TKZzN7j1gy4gCD5ADZIXiviOhUf6abYAMnhtWnbLIJOvWbU6%2BTTSF7Y%2FhN0h%2FA7aUKE7MNaipoG70IvNxVf%2Bv17jlqlhUwXZo11PYENjNgHBcsMN322s8GOqUBxX8i0igBg881i8Ip3g385gG8srmXs%2Fri4MvJ1iEHA8vWIQO68JBDOKr%2FTgCcPGaoqmpNn7ISP10uzhcCTHtDigIAdcrcDOVLk6uw7fxHYbxjD2KvMtI3VOpM%2BOv%2BnSnTbfOUSBgZOXFJ%2FBRPFjS8XQTQbyJ2%2BEsc4zJV8%2FEMMemOHnngh3t7hZ3sm4Fn5G%2BGgzmN8xEGiEeTSSrE%2FEDBBg4iRDFk&X-Amz-Signature=ecca85a9e8ef4f857cabbc128acf18708d512032b1503868d5d0fd8472853a68&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIDNNKUM%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T040941Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHBIAgVomNc8GhSROa4dH3CYzYYKgVDUDNwQZEJq6YWuAiEAiy40aC6zu5JA%2F0UigjlDJ5qRzigLSLQqY54bh9KtRDoq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDG42uSO1OucNhaccDircAx5NMpvH9Rf065zlee6G9AZzAA6zehlt7Q57IxVHmmhtLBuhTtLgzfkKhIxmYSFCDsax2eDLWmKXZj0qbME9kWBeUlbqcXonGkFGJNZaC5NEOerAtCo7v1g6GhoQdxFX2%2FdFehc90MOKPRWIwMDeHPnp94a5SYaljxThTe%2FuGckNK7xfdXaVjde9%2F%2BOzrpI28TEklkvTXOi2Llsvf1a2ruI%2FNsfbtTJ8j0Orr3dK1XVJhPwxEtU4rC4YUwUSly230VaWh9CLSfc%2FmdEMhaB9zqO%2BWhfMT2GTinpXBFNetMqfnEo%2F2ZHjXY2jJgPU83vGWKtVlfzTHpqTznjb6u7XAhUyawB%2Fnqw1M4Dq%2FGsR8ppsb11mymgC7oE1S3IrFpIEKC72dRRYDY9v4b7ImCzrou3G2loIlqfEmT8MgMkRIKL1f%2Fl1MIa8qxsqq04k0icIxXAiv9JdtDVedbFXrR8YCfljIVS3v8gUvGvvOmZjPSlDXcWM43fSrkv3Ha6X9LtdvnPssPD%2B7MxC%2F1JCScL%2BTFqUCbmLx76RmXjZ9wuhmUgROTSHSiLbIups9FY9dDSmBLOmk0F9pNICg1ME6Ohvox8%2ByXEgkh7zVEO9rS1hb4U5hRc3%2F%2BsN010RH29uMNH32s8GOqUBdUV9VXGYVa%2FBfRBh1pMVazFt0aIC4l3%2FH3yPvrmyGXGUb9VaVWRSnko15dq0Yr%2F3S1EPdIj3tDIkA%2Bup5ONGNosoosipZWRDK6a45tFY1U0Fi7riOlzzWM%2FWj6SQgLXdwp2oi%2Fl1JKJZNWs6i8%2BHE6lpJnE6FK9B0tbmmhiX%2FGJhltcLfh5OlOxtjvk%2Fwa%2FPrQ%2FuoAJw9cdAJ%2FAR%2BdzCADOn4UsW&X-Amz-Signature=cdd393d7ff3a4fa02768e91e6a4c2dd8049b6cb3e4c1adf3d28111611c80a72c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666NURKDAH%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T040941Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCf%2FWgZE%2Bjc17q%2FFDqf9%2FIuAqNr5OCOB1R7QH7boRDLnAIgT4OmsAH4c1JbK%2FtRYSmznLmZ8fAGIPacH8tQhEwk%2F2Eq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDPN5UHLJLHacKW6yQircA9zX8KS0NycwVNqA4IOIeF8%2Blir9Wdluw9N58ifvCsRrcZGFuuIOG6EBg48gr1npBUDjk9F2U1emyqY8XVhfex3bmZsI5NMoWAsggc7VNXiUlgYYzCiU5j3un2m22iS3ScSTH8Cn9LNUWpdD%2F7FmKvEQDkGw0lZbIarEmR0vJ5Xcy%2FGoHJhV9bhgzpni2t%2B7FMSll1wyLEpajM34t2%2FlNsn%2FMDktSphZTV7ndUCYSslfrAdiGDcMj8MQgKK2QWqvQR2T7Jpr9H3ThfgbgI1PHHGGfeuIM5MMwALRYZF2JSEIMzsCqcFS%2BNmbVPhivvyuFFZXuul6cMEilCLorW7ltS3jlE0fhPHpHHE3dZH7M1g6MSlPmMU3VxLAL8nhVXDza1FhKC4enuXioDtZuBSZ%2B89FXArF%2Fce%2BO39J1vVzBoxHD1LNR2sYbnO3wchcwiFWDsPld9FIcma24Ukxe7Z4mSy85IErPnQNtl2UyEL1cdmGE7lxzIdmd6XmyJi58P8jNnXwJrfD6ptVvZA61JwSJ%2B4UCUQiQ58hVrqnH8IY9jMqG%2BV2XmB6aHdjrZ5lf3Z3%2BJx%2BffYr3pI3zMwLeIvnPIUx%2ByHP3d0sXsD9rzbSadv24B9OzjvDaHstvGwkMOH92s8GOqUBKX0AvmzcypzfrmNNKSfB06TWycbAxTXJ7UFdONX%2B4H9eBINDAoXrx4osnllkT%2BHh9XGAhEh2SL2CE3F%2FOlD0bEsDhLa2PPCPuBm31k7ugRhjzBFEQzf4F%2FTc5QGWZ1%2FbDYKdIbuqDsri2c6q9W23nb5UfM5U0pV768yx9MreX6zcKxF5cGxDHWnTX%2BUDN7i9iT%2FN8%2Bb1WzCjNgwez%2BQ%2BgzAo%2B6ms&X-Amz-Signature=6c8d4b8e00d78a8ae2a87ed5e3e07261008e66b01cb302505664eb7b4b7f1c3b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QPMD3ISG%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T040942Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIH67aJbjTmWMqXokx9pwBvApxS9CqegUA7%2FIW34TEAkzAiEAr74L8VLby12cbDFhvHYvnLkswAlDNNoxbg2pXb7i404q%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDDnKAjbSEFDrSNHjkircA24nn7fY0w1S2WUY3ZUvpCIR%2BcDAQM%2BPZYI55LJI0nzZFG2Ju0bxZVLIG0eNrvgYT0XQ0jtudu%2BlrFkmR7s53uf3uiZjwq2XQskDiDsx5HpJmUu9sfb%2BlS%2BctjoJsD6yBkDPrJlabCDdhYB44iLSTop0r7ZAh0J0nv7LMMbdqnw5HsoJ4s1Qi%2BE9VUSTALon%2FkzRlg7yTN7DzkFuKLMNFDgQhHjlNO6%2FMbshX8JT%2FKZDlikCI38E5uKeHiQnuPOBiJ9G3%2BcbSkVnvsctzFuGLsOm9%2FOobQtZsMrCj2Z1ybbPjHe7xX3hJC9t5YfkL3B1Puxx%2BEKLVbSJXR79ss8iSVEGaA5MQCpQPcJZ8QyO%2Bl6atI4NnRmm6KaafOTNZDNlhh4WOxFDlLL81rsmaBUfWDOLbbpDxwg7lS5V2UsK6Fep5V3HjdhU69bk5WWtC6oe%2F5XLJvuIOWozAjXjcqjUD3VToRjb202uSLyMHeBEEnq5s0lnG1WATUFRsVlGmjMu9n8QymnLGyNCkF8waQjS9MJ%2BFAhM8a6gmFaB3Nla9svnUTfgjCaRJ56JHFxN2uu3hUWNv0lhqhPU3Ri9xPW0XN3v6dj3wBGGxGkly6nkHKayI3%2BEb4tGKz94gBvbMN%2F22s8GOqUB67U3i26dK5a%2BiDXthDBWtQiKlcJGmUrRaodjy%2BwjxOdNXJQfIU04s3k9oWPxrhUItRHJkfndR32DvKHiCiHPk8dPV2Q%2BR5SyovaEuK6%2BKyjqa3ADj4%2FxxZdoZxZHsnGCfnyWfiJy6bKX3htEM51BodQ8Li2FoZe0KvUTBM4O1cnMylWB8auqxxLaZT88OsLnRCPO0sEt9flFI6dog%2BC09pdrYBTM&X-Amz-Signature=74521bf40516e04e70cd364245e63563abdf52e367caf25a154b53c229b7c755&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T2JHTOOG%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T040945Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDk%2FxE6KAHU1xQqiHUaVNEirRtmWTcQMmOyhV8V4AKY9AIhAIWY%2FxkXVMGMkgoB10jKgvVh7DI7GJ6N9PDmUC9lEbt0Kv8DCEwQABoMNjM3NDIzMTgzODA1IgyoXPUvYmsvNdQ8pE0q3AMVU%2FvWy7ZqpvrDL0E3i9ToYXeo3TxmncxWCFLsx9lcwge1J%2B7cm5pe4JzIYxM4RWMIzFSpSm%2FJJNI5eT9SK0TKIFdt5dUzDEdZJH5Hx8S12650TyLAdviWJdS5foAUEcN4hcDdQ%2BneekU8XnRKfGUiTYI%2FcROPxM1xNdYHTIJB0jKC5eN7tgo1pLMcgdxpSkvXd8%2Fwt7fhBApea%2FBZl%2FZQ%2F%2FE0Wd1eGDdKj%2FiTWuLXU%2BPCr83loDI0sgng7XqFO%2Ff9FYorZJbePxp6EkpOeK%2BjF8sQ4kK4ZY9DZLfy7x%2FrnnRuCHIvjvRVATW2%2FGNFdAVMu8skq%2BLqjSClOi8pINjtZGU%2FDIVILaRJ2vU9%2Bz638rRjDnraxkdxNj38al5jH3ShQvPMH3upkj5q%2FY3daRjEqprABziWp46Gup8Qg2nWrsDwjNoMZqv79ergKb%2BpioqKH3EFz8Hi%2B55IXWe%2FJblLCg7KEQenMHQurnfTWYev%2FGPB%2BjI2fp3BOqRNzNT0bvRRldln%2FmzYtFT9Pd%2BbcBsSfUjU6wcdroLW5gBCtjkExN5yoNRAm%2FDkfE5NIUA2DvP%2BKrSIMWowG7XwasiYDGVShmiLKIZe4YUVvbfil8JAdUI6COxCRiT0WtC3ODDh9trPBjqkAfkPimmmdJs10R614ODGPN0NNZqnoO%2BHcy5%2B4pQDGbV1zcdEJNAA033ROzm0%2FIuxIrNd7Jd1M18xcpizdzUB1QSu3xEbEFg2bAO8q6M%2FBjE0vIOWLJSrJifmSbamWlTCj%2F5Di0arn9T6TKDLd0iG79AZqcADI3rqWh7P4SWaO%2BEXjWapero7hzeiuOWhYiX1MtBDrn%2FYnvHf3jl%2B01bzQ8JdRRkp&X-Amz-Signature=c3b0f408203bb605fad7f621e8138932eb5dfc4225795d2878d70837c0dc26a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y54XAAEC%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T040946Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCsKv3ZlUqW1OBVTOiNhIzuZ2WRrTb9oZ5Qt7Sz46CaFQIgOhBTDfsATag6JCmBAFPDnuR53POP%2BiPgiSxOTtQjD4Eq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDC9Bxkk1h4Gqcad5RyrcAxicNxZUMEjq9R2z2D3YQeoM2xTzkb9oo9w%2BDlBS1DvF3bbhtNXKjoII0b%2Bbu5r%2Bs5fxwiyuJ7ng6%2FUXW4kOcIsWCVppLmUXxOZyyG9wFpIY7dgoRXH3viqmbfUVsu1c9LZDVweTEwhxW6I9fEJQavAV5hrf6yVUijdxuz8qC3kBGHzwqOO3%2F2ngIdNtmeXr3vyveEvodwF5%2Bzm1RIbMpV0pCzwIs2GmO4tg6d1QzkW%2BQQahHu0AdxOB8t3ypXY9Bi6TvxZZ%2BLhoIz%2B5tZE6RiHYLeczwB%2BZcCdAj4Fd5T0rMcx65DaKZQdsDeXsQXpFsF9mYiJ71dlwB5mZxq3kRgyijDUCvhVPJirSGBk%2BDbdejIHKclk3ZlvbCt7G0jLHa%2BSwOVO9NF4ZEerAZXVJmSoamga8u0SvWCLQvU7ZYupP2iGw4KQkTdi2p4ozhOzxeSLRYi2Ij1Bn0srWCNEuLtgRuQGQDdjSwipx%2BtwT4R8aEl9kSFVXAB3gWfOnQVJDvwWTeo7tonfOSX%2BpS3Ta5xoFyfAGj4wtsz9LVNgxhYkCouZznFxtXtTJItcE4FkGE3SBSX3Zdu27hCHzAReViNJ7Qf0v23hjK0xJ0JCHt6r%2BWjqP9YgJHbVABNEpMPj32s8GOqUBY94YlBfIYt4oZzioauFRHr7W5f8LD6wv6c2u1qY0wlcwpIt7xKEUDZyjFHa%2F6V%2FGAdnEtnpKJDys5aI%2Fz56vANxDvBS3RHpWSxVnpdBwc%2BCfsHhn8KlrvpcPlFh6WxLVWT%2BHVrgT%2FZI1dSlnXHOkllFCZn4IJcuqBeWvK5jDX7U6f4jdvNjJI4bmJ%2BBugdJdFAuqHWylg6fPhTjeVLZEJkF68BOv&X-Amz-Signature=7703925dfbc789c7297307dc7b7d35f3e9ab1a4d725b7e5006ced933beaf5eac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667UKMBUHL%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T040949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFcTDFdavZhKtaWZomJWYcjbToHNyFkfBOdI57FxCDJSAiEA2MmLiMTmMXaLWxiCc%2Bi4Qc7v4YvNKyVByrrpULRquMQq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDA3JG44KL9T4XuzNsSrcA9wDuBUqJXBUKdkt5YjpM3La8moGz8e%2BSzNheFoV0lopPknybpRe20GyKZxbvkq%2FRinq75Ee7Mv23UVHFVWj68r4eabu8PspToGFgWN27IxA0%2Fs7VOs9J%2Fz8b3VSuQptOOsPbtw8j5rzjO5Jh%2BCSFUn0t8TJtwr0GiaiZNj4AZfuuNflOXwpy8IX7q5MZtsg1ZOdgkGjngclurLItDIkrd%2F3pD4pmTQhHLjPy8PC7EJqt8Qn3nj4InkASAT1waNgxK97FC8w%2FAmJrpgj5f8l8vtquhTLxaMkAjkTyP0x54iTSLLgZq2FuBK9YiLe%2Bx0vbGtqbvo502dh0pGDCXGUNRLaUtoXP4TPEYoEe2R8MFjWBXLgTUdOek8rDdp%2BlZSlR6UxlmaLrZkaJPcI3IqEJzVWqOrc%2FQZi04oQk0CLiVslOop%2FrRhUZ4mCR3RMXbdztYy%2Bk7l5m0862JBP8ojMFrSimoeeV2IcrH%2FWzKNfGQICSfN7wVZ%2FDWe%2BJblrHcKUAUUzbHyBbYoaX1P9Jplk02AQxeiRtez3PhC%2BNpWI2DIHJSagmmi3xNKziza5dgHItNVuWv0WgdcCh8Qn%2FNPwg%2Fd0KbTfg8%2BsXwAni5eSJ4jNhfXVHcAictvCGg81MP332s8GOqUBxMd8jXL7ceRJNxeorXLQmmNIIPenlp3frf5p3uc2%2FivAtSfSlfH%2F1PUv0SPwL1mlls6gjE0XFgtVbouxTIto9rjWl1Xrblx8c5Q9LQrgXkDCZCk9KTMcJvSA7wNlSgMaTW0iJHpv9XekCGciV2elTP7Kqw2D9dF3X1L5lcm5pLGio2He9apa4MxRmH4Z3UFHv%2B5Ex7NchkD9EE%2F%2BLZpvdlu%2FvTfA&X-Amz-Signature=38af550711d4f858c81bbcbe90c9aafa35f89a83e459a86b1e1c195acb8b09bb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YISTCMKR%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T040949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4N85d7wfbE5Hw2rSAYTG%2FQ8EN7rfuTSgwZR8anlX%2B5gIgdxJNsD2U9bE%2Fa6WHSSxU4nEThq1wqTVj2ivpA8bNQLsq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDD1GAikZmQn6rnL2QCrcA1%2Fajj9rL4GrLkOJxzsOFOHU%2Booeq%2FZoRm4xq7B4iwRNy9bCaA9ehGsTT1KBFsiQn5Tz%2FtPCJ9bpIBnenewEG7hu4AWwbiLC1YeohnRsSYdyY7JzBd07Bf8sM20nu6sd5OEc8OOQbEfMlNMVrsgP3qelX4mL9biu%2BOnvd6qZZ1NZji0zBs357N0gHnDCH7klG7BT0TlIFtadkdusfu7x7wtaxGG%2B22qx7Lww6ELSQcvHPyDlSzR95iOBRDlEIiWUsjbWYDankqyUGhBQy1u8Wi2TCLl%2BvN5EFPiZIQw1uMyS%2BRmkr36bSZ9fQ%2Bu28G5b8KCD9Pd6QBpE3vtWdJLOlFT1BZfA%2Fui2lzXZYAj5yUe1qymIGxZg12eIwd4OuLBj1BzOKJHmq7DyiLMXT2bDl8RM2k1vc%2BP57ZbYsCTKvmN%2Fte3cxT%2BW9y4YEz3f7aTxDOFbIYc4yLyugU2k0eq8lz%2B0DVpxeHt72oaqz2K9YIO7YIEne3QXPu4cdbXKoSadKpuZrawOXRfJ%2BHokF63gFhLUZUFpTnmwPoHIJM%2BF9cONzGnZxZdZUZyVenP7G%2FGGswsb0o5FW4O8GAQbVL3fNN%2F%2FYwiQaaPGaf1vPwt4JXNlT1hX1UAJODBSlm37MLz32s8GOqUBxAG8%2F3UR4Gm53eCd81Z5Rifi%2BfPNbQaM0uijEXJSs323GA1j8XzJAaTfVkbt5gXJd3k1jVhUJ5IUTQ6LAZmrkIqEa8eOTldxwe4hxcBPzB9VJ%2BThipCpQnfHdOjbdyMMREUsWhcmWSAKtrcD50tfMV4tLRSlp9bmNIfRm4tiiqdWLzWHWO%2F3ZbZ%2Bp5jH5LlRuu3DuDpbcKhB2yL0pOlDXFcNu5Ka&X-Amz-Signature=927aeb84539336f8896cf8331959b858fd1bbca92aa3045e18f266b511627125&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YULXCJ3D%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T040950Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCdM2ewbH9qHRVk5pYntqZBz4fGgLPfe45S4pQB1R3kXQIhAMGTM2%2BQLMNIEKoyNMijtIxx2ZtSNKMwQ9hceTwHsB7SKv8DCEwQABoMNjM3NDIzMTgzODA1IgzyH9iQnFKDoavgw6Iq3ANmo0EhbtlAdSfdbwLoaid%2BtEb%2B%2FKt%2BYCCypgUdmfqKk9t6j13XJECrHsMRmIMaZTtQZK5nGSO8JpQcGuSz73jD9vgIAci76lwhQKqE9EreEqWkL9eAMBKuZ4%2Blzc%2Fa%2F%2B78NZ12%2FxZeYeS1op%2FuhJw%2BXBBmsQgISKhm%2BtI2ffEK2Kvm%2B5LtuewRqXPnVTKNy1HdH1c4OUQABLDdB9oRc68eXxKV1mZ09%2BBimRfpVAZ3RZi1tsWUTJF2WyQa8aONoZ81xru9Ff8GqSI%2FtI5czDEwEnTx9kFf%2FB%2FAxRXRrFjuUUpsfyJIR%2Fls19bzonCpwOM0MVhe2%2FO6n8UJjES%2FUY5Ie%2B0vFZVmyGNsmMZ6ft31bbx4XqlG46Ur4XmuNU5Mr1d0AKfwtV0B1v2jD7gVtGcxEHdRnhKNfuEwvJw4YPsbs32NXjWY4HZtP%2FV3XMh8zCEkTBEYpXX6qQkVJ3wkmXBvFNbdt9%2BgK5yXegwub5BKnFI1TG7SmLJSabACX5tPKaxHtzECjlsBkOeASqPbSYFsRCSm2PGfAN6AlSKAryULsJ9R7R52Tg7lxzo8H7v%2B%2F8qjtRdBBi2Lt2x6KgMGt2HXPeVAqUszYAzSBtggYsl8bf3sv3bNKoY9fM8r3jC499rPBjqkAb4tx3MCQNnvHIcesbHpVRjykVBnz%2FjG5mmfcED1DxCj9VxpCJIenljjZB14l%2BNqBaSMk85YY0iBzAZ07gLZDpv4bts4Wd%2FLx5Xs2cwhkpsBWbei9CiWE2%2FERJKs1%2F3Jz40vbH8ha%2Bvx1s2PBI9uYtOgnwgyQIAWXOColctQQUO1rTJkaEmyCPZO9jU2VbCtUfVvYK1tmkogIZ5D2uP%2F0lizs27w&X-Amz-Signature=ad8ff3769bf2eb9483f1a6d7ab07da292c04672ab90c887ace78e7a32b39a825&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKN5NH2Z%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T040950Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAogieZeC%2B6pZUlsXNRjt5jDaK3RySY1ruvMpA4wtMmzAiEAvYdT%2Bsz6rz%2F2tGzfYE7IJprzMA0ErLTB0pxtr4G%2BzYwq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDMjjuJXOTT6CXEsmXSrcA8zRVB4RLT0%2FlYE25JJBNUKxrkJrgFRDx4aRVOolwU2oWDxl3ecWO2mFdf423bYcnq%2FgO4gpSf5Wc68iy%2B1RNH%2Bp20yjR3FoRBdW6ogYCpqLTH7C4ADz9S4ixYQsPWXAwgeCXovP5lYnAFgL%2BRiI6Alx54UJ7mqljhvpPftbAbBffd2i0BIERfj2nJaNpw%2FjCHmLvyejx1yd4F9f3zbZcy5V9Ds%2Ft49qAvPsqJPs7Sw9g7LQ5PzSw20qpuZvzfBXLq0%2By2H3iWwAtQK86g9SoBS4AjwKz%2FezTNhJ1HkFM3Y%2F%2FGDwVGLDSWGAI1O425sdL6E6AfmkSUqFH3sYeFiffAsSGXdMR4ro0MukUTizgbV2WW%2Fnz2iJLOG4Rx364tW4%2Bmpi6cdLUgLx0iBkpJoRRNGihgOB73X%2BWbsOsucXGweg0N9Rtqx0vKZcYRFy5%2BKC0hfQuPronKVh7Texw7QK3mW1xlhiLVqTBxq0WZAEi4HgXQxvTweerY%2FuCemNI0dD%2FYOSKVi6btGYsQeKA%2Ff34aSyEUgY5KHlJknqqMvjRr6552kezoZ8iIc6RapoYFvj6X1Ee7YR3GUfFCfD3T2%2Ff%2BBxYsc6Ucv0PuyZLVQ452qyRTdKt0Lp%2BFY7H0rmMNH32s8GOqUB%2FEUhkURBM54uVHALRHkkXb5u0SsMN6lZmFRU%2BQ1v%2FLSQ10x5ro575Uxgu27bxuzQe3q%2BODJm4iirpxFgYaUTy78wmZBAxRr%2BiABwu1vbkaAuL%2BcKR3FzDNCFpB2kgnhn%2BO2egF6luwMeWqqky%2BIF1OTYKyqEbGb%2BsZSosu88MqE%2FI42yZmbZr0kEg1miJtaZTjLjWKlKvmVtakaalUsJD1E5%2BNoy&X-Amz-Signature=ca8aed17d572cb3b450689190d685a5072851d5927315de44e378244a7f4b6a7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKN5NH2Z%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T040950Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAogieZeC%2B6pZUlsXNRjt5jDaK3RySY1ruvMpA4wtMmzAiEAvYdT%2Bsz6rz%2F2tGzfYE7IJprzMA0ErLTB0pxtr4G%2BzYwq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDMjjuJXOTT6CXEsmXSrcA8zRVB4RLT0%2FlYE25JJBNUKxrkJrgFRDx4aRVOolwU2oWDxl3ecWO2mFdf423bYcnq%2FgO4gpSf5Wc68iy%2B1RNH%2Bp20yjR3FoRBdW6ogYCpqLTH7C4ADz9S4ixYQsPWXAwgeCXovP5lYnAFgL%2BRiI6Alx54UJ7mqljhvpPftbAbBffd2i0BIERfj2nJaNpw%2FjCHmLvyejx1yd4F9f3zbZcy5V9Ds%2Ft49qAvPsqJPs7Sw9g7LQ5PzSw20qpuZvzfBXLq0%2By2H3iWwAtQK86g9SoBS4AjwKz%2FezTNhJ1HkFM3Y%2F%2FGDwVGLDSWGAI1O425sdL6E6AfmkSUqFH3sYeFiffAsSGXdMR4ro0MukUTizgbV2WW%2Fnz2iJLOG4Rx364tW4%2Bmpi6cdLUgLx0iBkpJoRRNGihgOB73X%2BWbsOsucXGweg0N9Rtqx0vKZcYRFy5%2BKC0hfQuPronKVh7Texw7QK3mW1xlhiLVqTBxq0WZAEi4HgXQxvTweerY%2FuCemNI0dD%2FYOSKVi6btGYsQeKA%2Ff34aSyEUgY5KHlJknqqMvjRr6552kezoZ8iIc6RapoYFvj6X1Ee7YR3GUfFCfD3T2%2Ff%2BBxYsc6Ucv0PuyZLVQ452qyRTdKt0Lp%2BFY7H0rmMNH32s8GOqUB%2FEUhkURBM54uVHALRHkkXb5u0SsMN6lZmFRU%2BQ1v%2FLSQ10x5ro575Uxgu27bxuzQe3q%2BODJm4iirpxFgYaUTy78wmZBAxRr%2BiABwu1vbkaAuL%2BcKR3FzDNCFpB2kgnhn%2BO2egF6luwMeWqqky%2BIF1OTYKyqEbGb%2BsZSosu88MqE%2FI42yZmbZr0kEg1miJtaZTjLjWKlKvmVtakaalUsJD1E5%2BNoy&X-Amz-Signature=975ac2cda5641b593a0e0d34b16100d72d51b77f0aa501e009363dfd1e568088&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
