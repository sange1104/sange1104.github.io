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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662EABNSCQ%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T033955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQCcyrt4cKlLQP87Dk0172kJ0Fv865J55IHVaUnqW2XizQIgUrWsSxL%2F4vRjXzS0%2B2YBxCYpeKSvYGtjdZlo4xtbAqIq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDCJfcG3rJkJduET2%2FyrcA2pdfdhwhXrrP6N4Jylo9RKb0ogInjGacepwimN8l%2F0t8Ikji4Gj7Y3EHgy59ZHtlQ%2B%2BsvZN7vlfRrDSJ5g4GFI%2BDDzkvS61JmqqXFdNYhKKOUmo4q8QDt6gIM6IlUDdK3wI8YLNsRIqqG38%2BucJlarwodYUYFCIbE0flqPlN5pdedlb9hTEOxDNPRWJhiw0%2B9GEgo2RCNpS8i%2B8IQjYnnsdaNMmWAX0cstypJzudjFaeY4aNWLT5dgEDtNm2wLemiurt7FWaZoLLohFS6fbr9MBxoVL0GdMsPAJPhndXgbbxmXI509MRksxsQBMBGbypwZ1xF%2FoD0Z1Js04Osr0Sy9I%2FkHG%2FzKcEvKQ5D3zrvT5mlfiAGQUj7sudhEtEcxEJzZxWxuh5GxHuoKWJB0z2ogBsjMw3AcIoXcPpNugWsKp1hgTwqZpJ72BRD7qm%2FkJnoGpe2pL7tEeQEHQs8%2BKdHsS3GEdI23zgswVyUHQhdACenOP1a0Kg0Pzo2Q6RLak9sOA2EkcrNWwE6LH%2FLMBV9bzTlqLuHjEOMlFFzI9VNNzPdQp7xAzH7bOWw5gbtml%2F2KoJT7Fxqr4p1NuYiqW31%2BjodiwQ8RiHdaLhoENF4NWOdd85yVYiYIIY6G%2BMNPE4c4GOqUBHK0Tdjx9rA7sV4BZeDwUM86W8tMuXmVcqQrM9YWWMYWcAnX5Zj%2B3vFuAIQuAAT1Ou8K%2B1CbEG%2BskGGX9vs2WNukuG75VXwZ8kmIscbkRZoxCqJ8MNNl9RyjRffiSs3A19Ejm72xbXjwavId%2B0s%2F91eImruzrjUgBSMG7mqpq6FFtd0jgkFmfFbhN2%2FwSgzSD764Ijwgh9SpXcflIbzl8Q9qE4%2ByW&X-Amz-Signature=dcc5da785a1d2ba5ec8be2fb24342764fc71017226141eb898489e3acb6b47ab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666FIIMHC7%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T033957Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIAmxXs6TfHrAMcl4gaOxnuWopk3hg%2BE9R5vMELpRUkE0AiAFt8NRx3rNpCiO8OR2MCByRYqAoEZwQP1qPSHaM7wTMCr%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMkRMY%2FQm56dxqr%2B6dKtwDGEJry2xCKmfk%2FSI8JZW2iJ9GmyNrMAwcSPyAYRNkWhGteALX87iofV5AfdbVr%2BQYE%2BmSkLUrOXjRpT%2BmNxBnRsjJGM9ngoyM7HUn%2F%2FvWxITv8lw2agltA0tCN%2BLfJDnTvs75TVgNQhGqMm0jjoWvxQ%2FhkPwkssx%2FNkKesgZabTo6utNstVc9K7pWZAsmwWpdPnIFs%2BsYlh5dJz2u6OF3MsVEcx82h9bOj35uhL1sJf1vVfZVdm1BICC2ElVtF70AtiPgEhA8kMzdWClrxP77slD9OdJAe8nr8RBN7%2BJT6O6sSvO47dhruhJ%2BdaZW8x3nkbBotMaoAb9zjumXG0jNr5SSY4C8Qjs80UuIl5MwR2o%2BErDznq%2BtJY2sHKqL4ah6tAdLv03079SMvOu4fVheiOvPRqy0TBcAxkoSzdHDXSIE8%2FDdXHrVN4mNzeHzgc0qlffkDhvtWOXqYhEIJw5X3CumsZZDUXvl7K8UIc7RSdsmEy9mR70KueZDGdb8niVxllgRNLXbgjCqOzhfkiQYsR2mnXS2EsO2iZ8DX0x21ysSTpO%2B2BdEloK66JmfwYBuesR18SugaNVR4cCuP4eXA4X9%2FWnmCnNrgttJIm0SgxF%2FCXWXdheXsN5X0ZQw1sbhzgY6pgEgrrlMODlG54lorSkKsXsMgtDRv9Js3GW0H3F89PVqaqLRqJFGSiRq8Ikt8my0IQBZy2uTnhhdMjq98pZF3Ahz4A%2FLgJDCpFhLYSBdDvlyODHAgU501cW3GfPXK9cXFlLfFFwoGCz%2B3P8%2B2c67fUvb2YEVambFr54OAyY%2Fc%2BwZTYQ65caJXMpUIhSUluR8F%2ByZggnbOIIkk%2FO2hOvZY2kQv8%2F2RRHb&X-Amz-Signature=5b0e1a13d46726cb92228e9a87b83692ebfa78371d64fba8bd7305b3c04e5035&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZZ4YKCQA%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T033939Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQCz4hL2PRY2FHejJpKD5xXMbu4cM0iV6zgDjwy6atWGCwIgOCBdKTSC8TzIMQwMJv7otzlRGdyMkwzTZIZyR5nZ1LAq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDIC%2BKcwujF9pOGjyySrcA%2B0ncp1Q0EOL%2FeuOmUOJ1VBl0ZBxUm5zr8pU9DDbN3xIJlQfSdzTo7isDuLB7%2BhhMuSe3CubpIZ7IrOFTTx%2FBy5cKHTI7MSEmX6gvOwKveHKIsNR4qm%2FNqDYFNKvWlt0odqsYfUdMqDQxK3aQqhmlc8ZmwUSXdkAxUwaqBa2DAI6ASJ%2FxNLUTkChITOvQz2aRnDjrcjwX%2FOMfrSRc%2BwITtZdQotC%2FVtCL%2FLe3xBKJxa4lD44KYaXPVxI39RYRit9WVq20UYYU8P2J1Nj7QYO3EsnofMxeSKMnPqCecFgCOHnj3Y2MjFMngT1W73pmFC3IdzASDswt30IJqmSMHUKAHkejERATKdQSH8Rd7iMvOsYPiDxn5%2Be3DaRzz8nbrszk%2FnPzRQeZpCBcJ0aGdhtG4EOyPHQER9xGVRW5OJVHtFSEQ8m1GM7sUfQGUv6pEKW9hcGUxe2lfFwu9P%2FOsDgw1jMTHH4styialH%2FYmmerenfuWJrGpC9cuynshXLwFEe9KDT9aQK3CcyeXmijTb6TntM%2FDQffKt97hdzScnPKs8dnTfSafgvq8mj6mntZaw5hNBSu%2Bz1XCjTJ4VRG61ESPNbfJ7BviE35VKyXfJWmKrUaItZFp2eFK51h1YbMITH4c4GOqUBWz2tBjWpmO2%2B3SVnAs6%2BjFQFR7HCIZkZT0SarhkEV%2FTPHu1M%2FLn7oUR%2BMBCOKfhbJg%2BSt3mvDNVgzEtfBWSWLfA0rQWFj%2FQ7QldllTeGGBguRUC2uZkie5u66MgAioc5QQObvdnF%2BOwEofCLPbo1UXPoW3kPBZwW4XNSRkWDuPnujt%2FfkTCX5r2nrWmjYCB%2FSPHO8%2Bsv0a%2F5uVQZX%2FOoSQDi74sg&X-Amz-Signature=624b5737dbd4623fde64afe5363e274ab2335aa2f75fe2027c68ee078ff9dee7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RYNXT3JQ%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034006Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIAt2Ow0ttzEMg9zeo3RsN5lnHN8wltiZeSvM68NqMAclAiEA4W6pZno6ZhAn3%2Fp8y7qOCbxyxpQ3pez5PyzwXKS7EAYq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDA%2FNMfsk8hMCZEVkiircA3zrMrviW6OrygZtUz%2FWmMn94CIMlYbusb6WgDxrfDFoM%2BgF5JCnHuAykbFgK7BuWPtUs7AEPCZm7yXn6bGVJjITEV3bgpLZxO%2FprJiX5cljKzcEpdVoB0oazZJ19BQ5xjlTxHoJV0U3WLogGYPpTGjSJW5XLG18TBk9qBcFDAORVAUbfyKL831H3wfA6jGd3gPbNM%2Bg7I1sEqqMOpWVACU8lknUBa8r1pYJkNcAWTGpn63R05UXxsQqWfzuZobdDGrZrDBkDnA3ZtyxO3nCEWK2taG4Ru%2FK4N%2BtF7lWQTQdqd9fBEtndnTxVl9wW0Psyey1kOLNmZCpW0FXKFWgRXUo%2BKW0pvYkMDLXQk%2BDxkW0TgSTIzFpQXKzRs5c%2BAwhHii23hmn775OHB50OS3uvuc%2Fwdk9OzIWP9g6LY8XUnA2SoD1CdlosmDX3vy3lUAbRISfcKrD4gaiThNc3ItZxPc71gMbG6nNQvoOFiUkfPkJkrVhuu2hVMPdvwuky7jIWMUK8n5kao5XBnZQe1Hz3LMnj%2FYXQIRdaZBN6FJ43QPIbL1qU2omzOtnUjMyM6DHEGgwL3Obmm1ZGFTwS4%2Bxf1YB%2Bs7wtcOXj2Cqx0NhtgBBGNwQeSNtRjS2NQR%2FMOvE4c4GOqUBH2VMnNtN8FD6%2BQVHo8dF57BJ1ZQSELT9LJ8rX%2BrgOoNpWrX0Ep1U6EUh83MmfjggwLhbFtgoXJ6iXF%2F1rFGmqhBwufS8LUaLhQdEFOdheDkBQbDDpTGsnO6dmolyB5FylzhBuna6qftIDAdrqJm0TFMN5sOGR4MBjZYA7GrEsLWIk13i8Qe1WyV217ZPW%2FlQ5LOEiEeG0lDiMPP%2B1s0dDLRphsKM&X-Amz-Signature=4576088c23662c0d3ed1af561a5f0c756df42125d5b0f536599fcef57f4d157d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663WGJCOCO%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034008Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIGEAmloNvTjWSgWi4rtMjvkj3PV2YVrSMukUi7T4T5GyAiEAiMUN3OYA6w1B5BiqHoKXJ4mFkNd7At%2B2KLPFIAcs6rkq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDJymIBwHtjFbaUmEFircA4%2B4YAXApyMZdi%2BKg45eXwMbGLri4RPPAD607Zq5FkOCidsQ7TAJ31ieSxcD3s7RGL0f6kkaMX5%2FuSDleSfTXAsnLR0AGuAlvOy7hukc7uTR2pdyqM9LAdyyCoY9JTA2aFiPnYACRMJTCzYQC6hgTpeM51myqcsBXGBgzrbTSou%2BtO%2FrvigSNMSBUcUcTUxWeFrjpDVb5DtlKM9scKJGAFgKVtz3bb2ogH5kHYUFBcXhjBgOhPIsPzKsIw75%2F3vC2YfSxHGyxqBPXOQyil%2Bzg2i4TvRLCaailr7G%2FGYYImBNonbAIX94hmlwk7xpy6ChKPN8tSdG2ocNXrWuybNIrEaEqFzsmP0S5tN6oMQDLcUOgqlB5f9DRkAOQjbORt%2BHHdyDNZaO%2F%2F8jgO09d014vOHLHJIhuaZoolp2aN1Ru3azFWpNrFmgEcbqqozfMlybG%2FIGlI8Mm9Yv3gD30SripZQMDxu%2BfivI3mS3dKoW%2FZxOmfDIeUQT6c015wgqKAk35FCkPk%2FFL32VrYk5KIZ3UNa2u3vShr4K5iQE9nSkNqF8hBwKx9YBtX5j%2FU0IHMzIEUfkIRhOAhB4GhvXA6sLbsKUWIiZRldAvEAz3ApS5aEc%2Bm6ZovJ9MwaxMsK7MMXF4c4GOqUBLNqTL3HmYVEfBI%2FqDmKdLHRPnYe18u7QmlWs8aBDdasXC2gnNK7FBpTS%2F4STTkYvjI11vpuJwvZ886%2F5NGPiZTzTD1Lpg2YxP2BQJLNBtt7weBFJMuIKLQAmiZi8BvrJG0iYfYxoJTS%2B1L2QfktgFOyXGg1tIW5BYoYTYuZ2N%2F3eZ3XbuVmc80xcb6wMVvdJskdb9nrH5eOMXJx1BG0SL2eVIftR&X-Amz-Signature=b8cbc3af28083fe235cbc426ca5cd53d0e547d970b45738cb7bd1f100d5b97b8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TZ3VRZVW%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034008Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCuZZXhodabYHqTzwojqgbFvEolO7hoi29CP26o9vi1pwIhAPAHZIb7yTnLnJHyYWpSEA%2B%2BmkRLe90edzADunRpLysTKv8DCCQQABoMNjM3NDIzMTgzODA1IgxiQS%2FUx%2Frg4JF2bmoq3AN4BhuvdJPphrsG9NP%2FQNKmdpj4FrcXfZf6CKKh0QfZROzKYbKdiCGld0gP%2BKaBfwibKJwbT1EpkCcaeHFfZabFrx0W%2Btfw5rlXh47HKtKPFX3W4T4tMPNZpmHtwUmk%2FxnPusXbaemAWvn9vwzaCrlgLDV6Zh8%2Fd4WdQ5gP7TRVVjrnBvfmQG9Ch4YFOF1coEcTzQslWCBe0h5h1lq70iUN7eT25GYGhDL2eTH0EA4W%2BaFtFnXsS9763BbxpBPtbyGajZtMqe18qVfiU%2BimbZWrvP4UYvirIDcvidb6rlEclW3DQeoD2opCmuHiK189DOalRcWMUJDoV7zQcilNOQvngwKQzws3KEbHCLzwzbuLec%2BM1p0GVXJWiHN6wLMnNe6aa0pQk3vx%2B47smIUNLSKThUe%2FQAwR3cUzSGGTRvERTqs2LFQCRjGnPXk52StkyQjr1LPvmP9ki76u4fTJztlMwss4kJxdkFuFJ78kGlmQCMith8M0bHHBpr6MsYOjubvl%2Ba12vcCWE20Mw254xIscZ4j7HAuu%2BUQwNBcCWZOgl%2FPu4n9ycmR4hrIlbk7%2Frk%2B7oWAnOrXEC%2B8wV8N5SIO3WZ4qRIZvGQoL1WGt80aORrgzAJH0JbeqoYEz%2FjC%2BxOHOBjqkAZ9bU%2BH0N9Nj9NwasQa3mams8UPWOT4VWeXvwAVFx2bxyj6K5sNNs%2Fu4JHiq7YtoCcu5xoLpIFJ8Rrzssfg3a%2F2jHVJOGCSCSxaW%2B8vKWDidNCy6CAGsX%2BQ9m%2BH8acLU2URbKy7xKk7URKcN6boqGPuhIylV54Saltp%2F5Ycgi%2FiEAZfY2s3d2G7o5nuwQ8e07mhyv5S7RXngUvjogFEr%2FXCg%2FhjC&X-Amz-Signature=43da8865fc08953f3288d9625397067c059de54b5f04948458bd7872bffa95cd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZKMFAWV5%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034009Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQDM2yJTBwUtXTsn0hy7esq%2FKR4OiI5KwP1rFa%2BKL%2FeUAgIhAMzxif808rYX%2Fd75Rx65bk71%2F%2BaDpwuzjhAXQh7U1z3eKv8DCCQQABoMNjM3NDIzMTgzODA1IgxUR23yaskGZ54Aogkq3AOWLSDe%2F4xF7yac5y6GEE7NJO7bh%2BsMHtsjOrHm6jyjnSEX38%2FlE6T9GKgagA25%2Flj2zgv8wYiJn2Nk%2FLm7BoKCUG%2BVgTrQsnkgGkk6Y1JJk1YUFfvGV6Pf6mZrl2yTAtjKZXrSrs%2BGtckUUWJh0E2Ddjm%2FkzrDfzOCSBzRPV89FtEbmH744F1RQL1K%2F5Qsel5fsFAXm4ZBIMGWtDnEbvu6RgjJbRzqug7R6gbmPHv%2FL%2FNlE%2Fe0dcPJYZ6F8eo24pkAuU3Zx31xUAJk2izqvhwJXzLnztm1iYk1apGwzvyBQRjes6AvZVY8vXK7CoC8CRTWRi4NA%2F%2FTQ%2FEUwAbSxKZEjebwa0L4W7CcLP2kN2wRCcwhXF7xlXJ1gxWjfaa91%2Fgx%2BfiAHmVAXH7e3CJsijiXE0fW6x%2BL50yN%2FUpOfqQeNlFKKzkFUwP8il9fBCL32X%2F81G9QHLdWBk7RIZ0DdYxRxIsPWjPKixUi%2BJYaQvPLNkNdy0fiQqXdahwksSoUCzNXza%2BNA1hIGu6yo3BQzYTaCoevUH69QqI3mZkBuvhyICfnMCX2ZwIHR%2FGciIt%2BNRyT20qHISrlprJtHnZYRro%2BufPqII8taBq4Ob9UX4AHUFGDxxXrhiSgiQUB6jC9xuHOBjqkAbnFnTtlUMj3qSxH1Nva%2B3T8C3rnR7TZwn4I55EPAktzMkqCo9nHLT6DTVlv3RMDdCZw1TxF9c9E5TOlRidFU%2FmnQ8sKWEYpYmrWjtW0CwfEnHgr3pL8eFM3x7y2PXqWCdOV8f7IuIRwRwOHsI1ycJd1dLhk5h7mKUFCe%2BtxfLr4%2BNObsQeWxWFzpe0inc%2BuXm7P8I8z%2BccbZevT9GzDtURQOeVI&X-Amz-Signature=c61baefc60a129d8206da44de9bbd220e9828cded8ac513d8794ff9a86fe7c2c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BYOC3VM%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034009Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIBX4d4jX5o71404%2BpkQpqtJLr%2BA07hXfG%2BKGHTSGuUBwAiBMeSmDrJEpMiI0yMrjofgIsHOiry5hxmkDtIc5wVKUJSr%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMyzaR%2B%2BUL%2BIjXTNdoKtwDTUl1b2BiXOovn5dF9GCbk7eeIuKJDA926VKgK%2BK9f1C9vySa92Q3XKz%2FClI4h6zfbxc3UTdZbnZDuffA1QaRd5SmEIwLAW6JsfxkbmUBvC0Q2ecXb%2FMCnUxrQNpAuuJfd5qmujTPGFKrbkhIERqdI8tsyDwNRRrj%2BQ%2FJRFOCifOz8SweLulSK9DOcmBGTmy7JDIfUtWPhCTuxKEHa8zZvMvfY8oi%2FvNh6etlWnroc1QoN3HwT0tr3sWSF5TzfOTa%2FOhvilzG0YGH1l4v8srEhjNAgnjbfzDJEay2jkz7Ext0g9s%2F5NajnVExBdWSXo8REyy8rMGvp9%2B7k4cKbnvhBig%2FKc2SWiBkDz30rM8MpM0j5cAVas1xJL3ilitTJHHiAjbdRzMOJGFLVGRr0yrYdPmB23zFTcyjyRLfGrxb4Q3q6MDx3DZpxb1lsztP3lpTIN8ql3c91rON57ZzwqyouDEM%2FuGmgeeegJ3QL8ZmI6Awtq8UlqnBxB2Nx%2FlvwhuOYuOe99oTzWe5LCrspC%2FIBukRadYPUAUGqFBrYHY%2B1yANzJDG4XujW0%2BLhvMVhnhARZPYPcdY9hfD1orNKsN33aZGIt5GAHOy7wYQsPTJIn7CwVtUAvWZGdwrGRowtcfhzgY6pgG4HmOQlDgjV1infBhIoparJTTUOXD%2FKyIP2uGR%2FLng6AbZIxqXwziQXbJRDZOLRArvU8DLvvsnhuZjOZp13bwopFjiRzAK0jAIG8hTrO4%2FO7aSqQHvCo2NjNKI50JwW7VgQbAwQP1lV5R6PhMiQjtZ1SZm5ooWeLrqA%2BIgan229gBXzb9rdZP%2BcLEj%2Bpl7h3KHaf0etDcuPNRbq64O6g3EsGtLMAsr&X-Amz-Signature=fde4fa249c3b191f1c3e4099341d212e68e0c08dad67d557c65731488e2d2daa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665PYODZCY%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034009Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIAntXMc68HNSIlI%2BwgraFMQBmOXCf%2F%2FAmG3hi%2Fgd%2BJo4AiBdUc1UJf8tmFAJYiUedK27x%2Bb%2BljATloYlhsPFAsH4QCr%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMnb8RJ3vgPIb%2FCJ9IKtwD268Asti7Zvb2AQ%2F3Ne3101yEph6v6AXgfH4c2cgjcdLJnG7lQ9s%2FhBv%2BSZtPVOo2bL7ZIwVVSM9tWvYroo2fDV1QL%2Frp3R1vGMstzhH2Q4IHcKgh6LCW92SUdTQc6uWNApWttreSo0WyVPJYzfjt0GSuVofW74xRHm8DfGw%2BuRggvgqvbElAW4yve0SZPfn%2Bvxt5XKsvz6NU5n6dznYlbFxXH7xuAlgYNotGZIaapBB27ryuy1yraSaPG8h4NPlMxS%2BTA1NPAyj4HBmQl8NrrYb%2BHl7TzRqNptGYxEqqieLveRCb%2FTc8SjdRuYe8fCwAbve9js%2FXL%2F%2FF2OWYpga4e6czl4IBL2AxryGhONSMcPIp38ZkTZpaqtkYm77WBZtv9qZPbSfCeHvO%2Fi8vWAyQFh0CELiMrTAiwILnOoZdTHgq%2BrFy5DH9bcl%2FnnCuuRst2%2ByW4yJbPdIhlpatwm1eRIIK2BwVY5rjD7k57KH9rpv528EwAb9JHoY4lHSNsqcI%2F%2FmbgNOgmyGXRgvJ6dtruZ43ec0EEI7Hg%2Fd6okXnqC5DoTma8bImIVmcsB73NtNSWfVgke1Wz75AsDOhZNLfJXlVTaBGh68xDjScwgmjMmthaBg68A7Uqsw4YG8wvsThzgY6pgHyRhE3%2Fv6L4NYAb0MO4ti4dxjKb2%2FXNJsDja7YnIlov869IhffDkyCtDdeELsOSE80P6QvJcUHDoO4abztDrG%2BjykHmGvILTTwyXHiWDo0KdUh221MYWzuh2pxRg0KbEz0lHZ0HI6XqlYzkdHGzWrWtCZjoNaqhDc3ok8Bq%2B273jdDkriYapwTowFEbRuxg9w4UDlhsct0JYXH0DLiPuNXV4s4ovHc&X-Amz-Signature=f824c02ddf95f90754956b71d767bf51b88389fd5537355880b358b766cc8779&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VCXCGI56%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034010Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQDWzrsEKLRMvmV7mAwJZW0PDpp%2FXYkD57bFf5A29AcBdgIhAI34v537w3JNKjlP5sxxcEFekcZxNOASt%2FvupI59l1NxKv8DCCQQABoMNjM3NDIzMTgzODA1Igw%2F7G7QQt47nJCg4TEq3ANMIxH5NfhIthGm6R4pnVV7bBUZ3ZPaI1nRgF%2BYl%2B6gePywx1cZPa54w%2BeO1hGCrYbcD0%2B1h4l4924zgCGW%2BqyjSV6Um3UknG8uY1p2rZPkg%2BHVGMFTVFSooCsdPYLJeRMEwKaPx%2F0pLCKijxMJxQOGinUbrsx3P79%2FBfie2KCnju8K1gZf%2F76DFBVNsu7yQM9eJSvwEjBGt98Tlo1Qks5Z26iHrmWCJKbTobSf1%2F2P7f1m3w3f30XE3GCMWw6faBm7rcqIzioNOo%2FRfanpNOd1QTI4P0bEEd7vBGBq6iJjw6UqVKmTbvR%2FYo6FL9RdyApFFCAf7W%2Bj1ZRNPLx8Fv9lNMTI2sJESJkxTI0Jb%2B94kburogpCtzRrqWMMXuc21cBsUG%2BXgXRll9rXQgoAT4XH3GdRqfbVgeMCrafWKhHuOhf3akcPHd9itJobl%2BpYqTBkn8%2F14cB6nEZ%2BhXV2oJhFbAL5DJZHMeMY3waN3FuiLw8Q6xw5RPlIaF8M23oEWMULCtSyFxUrAHDabjbjjEhvKBRZiGEntqpCZcwPsrdgxouY0Fm6fdyeVQlhYcOEXsMireroi1MMmVBnfWnkDA%2FyZkDCTZNa0yvLsmj84a5oWMI0o4Ww6gc3ZP5%2FUjDoxeHOBjqkAfHirgvju8xcNVlkvNK5XA7qmrVq4VjJGanmviGKLdqkebIQjxSB0EpHOBaGbEsVjbdcgmRwYzHqTvgjnpAHDQz3oJqynxKZb7A4FMhhTIAOGR%2Btr1be1irm5EZnNSxUgk%2BUWq698QLlDdrpgEKp%2Bxzs7kNI6uVBoNE%2FbZcxZtushTC8UTtFp5TvAVl1c6rzgtVy5XPH3U2%2BK4zbgurH3TUXWbop&X-Amz-Signature=b5f015e257a3cfe5b87614b57524559893b263e6e91d299d83f23968517e2ee4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664SSGA7BS%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034011Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQDWRwNQhjODJQ%2FwKAiR6M6oTzdG3xPcUBMBdahiMbv2eQIhAKPruLjf%2Bdsnx5QLG4AZt%2Bxi6YMG7U4lKkmDOnHOQ9j%2BKv8DCCQQABoMNjM3NDIzMTgzODA1IgyswZWpYkGfn8QXgmAq3ANBmm%2F4XoyHbNXjF6XJmHQDXaTZjoVLqPhhnmkOBXPAGrNmxqayI%2BnLkVl%2Bb3wRovjL%2BhfNuBq%2FaTezHlrn5FqYgXibW%2Fye7ooH%2BRAm1GFOTIKZxEzCTm2%2FYcbrncI4A9X5OK3MqmyQ7z%2B%2BUezp%2BJg9XDvkf%2BwQz8jAC%2FEkn44NGy%2FLEMfkaUpZTqieBZRUgqSjZsZNqcdV1v281ISCBRNDWmHPSHTH2guYuKph3ftepjysStVEQ70cBz8zIzEtPAM1CcdFkbPnFtb4K%2BjdsOuzVDybxTvqII2W%2F0s%2FJ4MuS8Zq0W0YZlNFSIABEoxLI1nTLmLRK6f5fOT6yArezRXAiVo5I4xkQOwvw0GAS%2F1QWGrvJYu98zIZlqpFMAUcYqoIKmiZaBw1oZDby7JiX1QdwBAg5cTtLkMbWNMYYzBmRuVyXiERtz49tOYc292TM%2BZbjXgcqM207bBPb2kD9c4KPjt1BkARBjM%2FApT%2BDRnCmbZ7w8USlroMQ%2BVdD3xbpP1bMd5aeu6gkwjD6ljCkWMuNSlvUlXmuJ6WfzhhP9SCwEpiCdQFbL8Li0ySR16C6xE9GFhAALRcb3V27DHaRDYe1gxmb1kJSw8zXEKXGbQaSM71zl5%2FOYGXJ4X3bDC3x%2BHOBjqkARI5u93UkckfGkq0C3ZBqKh7MT8UrxBH1E1Tu8Vcm6cPT1HfNiDkZ7OmRAAu4jJ4Bu9aOOb10Ns5pQ8emR2Y1hBVtJemcnYyJvR3eWjd7BrkGZHmaR9U9Zd%2FDEQurtPfV7CUPX6UMC8%2B%2BZndpjxtsgR8hrlfK9nMizv3ZEmVA9%2BmYRcA6lLay7Ch7elq2perSTqBnSSOSgAsYoQLitJ4cKYdpz%2Bq&X-Amz-Signature=5cb500489a98c425c2c526badefd911d6c19f7ab129e517eb1eb04b5d440cf60&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SGWN6NLG%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQD9FYfVNfcNG0%2B8TKsqvRUHB2%2BpZPy%2BFVibXgQJRT8fSQIgKI2UGAalXgvS4kr6b4WctBxTKSJPuuVjhyCqSMUvAPoq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDKzV1ePMcH%2FNwtSQoircA9J6H%2F8u06stE6T0hthP8RtzqmMhXNCPwraShMc0Dw1ej7yr3gjBNEhgVEjOB9FK4AuZvJtLkwOgS3Mw8%2BixNRejVKQWab39C%2BaECBRG0iULGMTqOyj6tgGJAAqnCrfdpDcDQLIILIcYLQ4xe7%2BNj3CqJv0amogLaMYm71SasjuCNhDd5Ghp9R6yR7f53WbSzRM2aj%2FjFW6%2BllzGrFhEs1ycIYGLCc3k7hcRnhR%2F%2BJdH21hOf8PAmhO9xJ7l9KY1f23hQqPa8gaPYbu8eHkss5Ep4tLwpvXYi8fB9MBlhMMeNS6ezIXXEIt78KZUiFP2%2BCux%2B1ojsXRKqhq2mE%2BSRDCxxR9WAlR0bN%2B1EO91RdHDWF6fv4IzGV1lJW9XOWNyAXc5cDWuqE4UzvksbgreONLqPwwPibLjA8Ne23aw86Qh57ebvAW5fGOfxuXLITWUtmqjusxOAW1Ggxgxu9al1DWpM2pOjBi%2BulcbKxNFJNuuAbascbbEl652hD3k14LrJ%2BC1ljrVm7eR7Uq7xlnvZzOP0qQS2Ym1ZBCcJd2PgKuraP%2FvgZ%2BaEPolk18f4HQ1YZ%2FSTBkXIYCTI6oblZvJcD%2Fx7zBbYOwzqHPDQ9C2PLOcSZRGsF%2BUIl503lplMLzG4c4GOqUBNv9%2F4HgdGxwISMCH2I2RPgdlam9zO9io7j9mxjAF3I%2FeEGKJDyEU8zFfNLaCb4y3o%2FXvoWRlEJggL3aFazsNOuOIAn%2FahGbJDbK%2BZ1x35GExyc6AiQO0O7vz4LdTMDDkrkZPOqKXuWM7qoxnqgVWQMdEAwJJjfaecvvwZkWRKyOAQga%2BTJiOaCCjhUv3JBtM8PnUB8zpCsXKkLG0omsg%2FQ7pWpOy&X-Amz-Signature=2a01c2fc2a9d45201851617ea5ee6343c7a5d332696f3d47e0a4fdd0d6a2e2bb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VSZ2MQP7%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCdqU0qaYfDF9DNDVhR28c1kwmFWygY6dsQcM%2Fq1Beu1QIhAN2YgmcUATKMzwaeKWensf3E21S9fk5MTe7ooJkr%2BdXDKv8DCCQQABoMNjM3NDIzMTgzODA1Igwcng%2FOanCWgxRG3woq3ANnZoc9EGuKbFEK7iR8oevMBAOPcOuCAGR0CYVTxb9yr%2FnfSVPMywo4DzcKpqAlk%2FMsIwns9tz4DzkIlZoYxgslLhlU%2BKQS7YstyriKrQ59jedbhN5CK50JJrTv%2BMJG1kd5cLCNjtYxY%2Fe4R9qjssZEXRzX5tgHOVuzhpYY%2BoV0RJrDl8tZYe7ko8uv9pcEyXh4d3yYpdVb%2FhcCqAcXz7qAVSj9G7W3%2F8IG2XUUitDrP1Q76r7%2F4XBDvwZYZ8LL15UWQscq%2FRIkefwNn1EhW75iETOBBb22SmSget7nyroHynP%2F%2BJ7fWl0%2F4PW8XJ7D5jgLBHJG5u9JyGzHgoWKPzswje7XCUbbpyojbpf4qpryz0wGb%2BHvtyEHlPT1zZRv45ZDuqabMfcT8T8BT3TIEcVgkux2vVLcZIF8QqfIw6w2rL5cqywfO9EmO3MxxTfEkKVmPjeln6Qj2FXGtAic0fzYZHO8nmMCHcj0xl4QHnSyM27yWShaaVQtxR3D9wcxYPR6G%2FPdSfz87R1HnM5IKH%2BE2X8jpuLy5w7gWAcUeUaYCD7aSak2egGOTdobLAr%2BFM1umFoLyxIBJPCOGJu2fK6PSNIN2JpT26H4eOzdmnsRE29N75Ew7pOpvW%2Bq9DC%2BxOHOBjqkARxKzkaFoiK9H4J5bcbsUpCtnt95wLrVrmzYjwKIW9kL1QJ6FGBxdnfvYVjecWNxbZKCEkRlkvDKu2q5AqwsWRYSUGXMyyBkyPUD2l4uQLCU9Z%2FaiMDSES1PtOHZzgg21jaVGFBmUn3xapQ8UvvpdP0WiVMwASkOTTer%2BkoXFA66gfEnCY9ITrUWzPWTmaXsYTFpY%2FLa7z7LjVE4xBdEDSTy6jML&X-Amz-Signature=7d2805637d5b3258ce879a2d360c924f347ac98dd94a6612a910f361ccb10fb8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VSZ2MQP7%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCdqU0qaYfDF9DNDVhR28c1kwmFWygY6dsQcM%2Fq1Beu1QIhAN2YgmcUATKMzwaeKWensf3E21S9fk5MTe7ooJkr%2BdXDKv8DCCQQABoMNjM3NDIzMTgzODA1Igwcng%2FOanCWgxRG3woq3ANnZoc9EGuKbFEK7iR8oevMBAOPcOuCAGR0CYVTxb9yr%2FnfSVPMywo4DzcKpqAlk%2FMsIwns9tz4DzkIlZoYxgslLhlU%2BKQS7YstyriKrQ59jedbhN5CK50JJrTv%2BMJG1kd5cLCNjtYxY%2Fe4R9qjssZEXRzX5tgHOVuzhpYY%2BoV0RJrDl8tZYe7ko8uv9pcEyXh4d3yYpdVb%2FhcCqAcXz7qAVSj9G7W3%2F8IG2XUUitDrP1Q76r7%2F4XBDvwZYZ8LL15UWQscq%2FRIkefwNn1EhW75iETOBBb22SmSget7nyroHynP%2F%2BJ7fWl0%2F4PW8XJ7D5jgLBHJG5u9JyGzHgoWKPzswje7XCUbbpyojbpf4qpryz0wGb%2BHvtyEHlPT1zZRv45ZDuqabMfcT8T8BT3TIEcVgkux2vVLcZIF8QqfIw6w2rL5cqywfO9EmO3MxxTfEkKVmPjeln6Qj2FXGtAic0fzYZHO8nmMCHcj0xl4QHnSyM27yWShaaVQtxR3D9wcxYPR6G%2FPdSfz87R1HnM5IKH%2BE2X8jpuLy5w7gWAcUeUaYCD7aSak2egGOTdobLAr%2BFM1umFoLyxIBJPCOGJu2fK6PSNIN2JpT26H4eOzdmnsRE29N75Ew7pOpvW%2Bq9DC%2BxOHOBjqkARxKzkaFoiK9H4J5bcbsUpCtnt95wLrVrmzYjwKIW9kL1QJ6FGBxdnfvYVjecWNxbZKCEkRlkvDKu2q5AqwsWRYSUGXMyyBkyPUD2l4uQLCU9Z%2FaiMDSES1PtOHZzgg21jaVGFBmUn3xapQ8UvvpdP0WiVMwASkOTTer%2BkoXFA66gfEnCY9ITrUWzPWTmaXsYTFpY%2FLa7z7LjVE4xBdEDSTy6jML&X-Amz-Signature=eaf78ccc5277f1df448ed2c1c4972e0b2dcdba4e35c7835b7725c0a4ae026947&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
