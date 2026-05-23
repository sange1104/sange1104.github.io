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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QYYF2ZW7%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040720Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIE9P42jfdMl0NUeJkS4MMRVYOYQ33uzBabz3ZmOGys8CAiEAtzcoR7oBPw99d9v1QFqN9mpmBdmScaYNt4LiA%2Fqoauwq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDO%2FtLSFcJk5anatymCrcA0NqaHo7myOhP5OnIzQzpAagczAaVtwymL1llvkH7lnDNRU9answsh4G4pwbagWWWbBeZkMKYtuAkYgdHRrK4qNPKPLdkBQh%2FCakZono5ke%2BN57%2F3Bur6u%2B%2BjqK7nibwSj5Yt9xMW46%2FzDJCZ3MQtM3pApt2mOmR1aTv1Myp6KW1S1YhWgVGOLetfbqb6UFFzj7ZuhUUNriTI%2B12dvTzhoXMkeyf3A0hPsKFUpBE8JDLdqwoj8xNyhmVfKkwwUx8j07J0%2FfFBKBtFQj1tAPvd%2BLNwAVgh0cw5MuZZi73sx3nK7bfGpdxmUaqsW0ecXQ%2F9dx7CG5a4n0VnVR4P86Xfi0%2BoKZZkcl6X2w4iCOBCvYc4T3JSsLUIrZSUNZxBEzLycIQWTRG03rmIIy4P%2F8NBJNP0RqTCBCJfKs%2F%2BuRbueFr0%2B%2Bt42yb3FgqDSCykAuaAxZp2Jzu%2Br3GVlfGfSiYdnWGGpAndVvt8W4S9vhrYmOgotywPjZ9Po46MbCSKC7Z4kwlbzP%2FxO9bZHOzMsfphXozxcfikC8XPQ7hwh3lGU3E%2FZs4b3EmY0pBpnUPZG44cLLVlS7LyJVfZyHtAKdfOpTxwIkB5aWXzlFOELBGy8xrDXUqINIXihrjYZ3rMPXKxNAGOqUB%2FKOltKNlTDWOAqgaovXm1sIYRzDFY4faU6WivG%2BjCZHLdsModXp5VpPB6ai215i%2F5ebJGE%2FXQCfXXjtR0%2FWNIZgoY6J95NGN5r9v78WC8%2FBkR4RwW2kk1sCU%2FnYyQmlEW9pa3HEiJPcdRObSCbRIi7DgfDAGpVQftqgQ80WQBAji7ab7FM05fVdg1Xv657CO2HqoYOaOlV0bgVJxCBETQYeRAZ18&X-Amz-Signature=5166d6687e4239bc16aa2f9b0e979d67f54d2302cab9901965adbe08243fd376&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YEZKGHW5%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040722Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJIMEYCIQDQwWY7FTsgFZkmM3VV3N9aqPMIpm6u9aw%2BSrplZieWAQIhAMxjdCk3BDjg7fxfeage403q4Zs57D%2BpDzjS0LsPd4sMKv8DCC0QABoMNjM3NDIzMTgzODA1IgzR9c0VvkW6D3aKfNEq3AO2FqKA5qUzx3llwXOk6YdWRcPf7rPZHYTX2OLaPpIUm2OHl6GYT0CZo8rsUW%2B%2Bu3Qlc%2F58GSFSJswV1Z9wkvtUNe6sH9pgNuG%2BtSM9fbRmXVz61DtdJIdaMzlZ%2FKUG7nOZ%2F1%2FJI824Qy%2B3WUwTSIr0LorayX31M0txdvXo3zeFuFpWCSVFIUGw9swieYX9vJu45ItJplxOvMnnYJ1a5lcxKH1Q2qdVo0pf95nkun6uIEF1rdquAz0dx02IFVr2hcBEAjYS3J%2BSP0DaQ4nz6ZqCkTIEhKC06iOV%2B%2FdUrotKqEePVCbwps4K1G37qUp0d5O6Cepub5j9w9KaFcM6zDgjYHqpZm8mgciAYA5LdPThdkgryimzoWPbLyMM8L2fxRW%2Bt9UIQVVgG7zuGUpx1K8qgZMuVxaXW8UVkgsLb3jQ8SHzIzPUORoqddUdBCIKO845tnMwQhEpX%2Feqkeod%2BjgRmI9NL1wrg%2BxjL5MYnCg1jW%2BBBO1R7pIjAUuoWYwtgOVEhp98GhqprATD5lTzifs5zrjAut7VyHk4ZpxRe8OgCu2R00Vz0TyVO6Hos4DknUJxr8QwidSkiwjp%2BQ9J0xfHVveSfDnVrgKt6LDSTvwOr7X7f6VJCBCIewhIbzDKy8TQBjqkAX3Fx40%2FeuOIy0gcqWr4eBwRoVrhXdHoTMRTCma3X1FCzsOaoCqrMOCvmU5Raa0mrwlKVPlA9XnzVt5bbw%2FVInKJP%2FJHTWdUH%2FpYXpPcogAunb29FXqzFtQpssOn%2FHWm3%2FuUobffofnON53%2F3p4asg1fakNU7IbOkh9LPD7TfAxEDQTfDc3KDrnAjL6ONG1VyPHqCKRia8Z2%2FjNxTqA9DWG5cxqK&X-Amz-Signature=e9e7f982421bd71c0c7347169bcfd8ec0b4ed10125c3cef15d18e9f92b7d8f3e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664KFNYPXW%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040714Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIBtaMuMbkL%2Fpr%2BqBi6tketUfdim0lCXhrFSXhU7CLnRfAiEA9TDxDTKy4gwOYz70gIwKzI0MTIy7ddkSZ%2BCqBGWNu04q%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDDEcmg2tUMGEQszg7yrcA90s89c1tmAZL3B7%2BNfUteq36T5b2Wn5WGFxNCWA0LOrU5nNoHUwxJ81mxPD%2BtBqM80qU0FmQXonBi3RtTJ3nTFSxWU%2FFWeKp4ZLyFCl3gxbIF1p9TWv0UMXG%2BB6b3u4t85yGOZrUoqxBVyRlFe5giHRB9lYynXQmb%2B0tFHPzcjassBtLjS6pCkmBhp%2F14Ct40L593X9L4omOBGhU%2Fsp9Bx9CK2coBDiBrgcTQTH2NPqxLJymVgWVqx3B6bPMmaKqYLFFmmt5x6VxBj1ZRAo4%2FK%2BrqOSERXlYWc%2BpHlGiyaqzwy%2BGIh6T%2FOIRQvt3kwk4Sf4y9Z72IyuHRFsNR%2Bw3A0ydv3Hp2KaMo8w%2Fga4NL%2BPDfEo8zy%2BTIot4hzyUAon7CunGrfROuVqaOfqs9Hj41cqv4XJP%2BwjKE6PC72kfRNTri2ty%2Br%2FyWCDbbjGNRljUFYaeqC6TjpmTHcR%2B32f9wjcajjKJ3wh0lvSu9yjKVGQfw%2FkkcIAyy6x9aZ8dahhbX%2FtszgT%2FPI3d%2F27kxT9IJnlSBMfzYDD0fGqpC0Wr2BOtVAMXxkCoYQgLwardVbUXQ0TKJE7UpBXlXCCeJLmZxhae1UFS42m9fTZMuW%2BBpSAhslBjca%2FP9nyhJz5MO%2FLxNAGOqUBX5JyOvULvjcA7Iawt5m6pWkjASOg6S1zRwUU4ElcjmXtZxPe%2B2hdjNHcSpQFW4kUS8oB24P4mC99YXR0%2BqmS6H9ByFd8be56Yuqgnh8PqREpUsekmQEyPk8r%2BOVG2fLxjiDXhxB8ZC47HmrKyGxk7IQQkwingt%2BOglN8un2100hIPU02DyV2GCmbAz3NDvu3ay%2BtTk%2BF6CHhG8FwbU9EB%2F385EXw&X-Amz-Signature=e6ba4e961ae8a7957596d8c2a902b3afac023f02010c5bc65dc882b218dcce99&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WYYAUI73%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJIMEYCIQCI2t9aBrNmPwSiTkcHpY09kuhYpgER%2FJQbaaWi2GykAQIhAJF48tb0UdvUlwAoKKRaljARQUHR4dp140TfrHHwWQtHKv8DCC0QABoMNjM3NDIzMTgzODA1IgzK6V83XsTnfYFlUvgq3APf7ExcQ%2B8oCjULybykzLSczT43Ru%2FwgpFowQG5qzKrCPCf%2FyP5PFvUncRc22laz2%2FobwbhygRO7YvtaUTlyIgKz4XRKTo7fXHcglkBAaygphFKJWGTiVk1W01aTxlCT2gGj%2F1h4itwdHGa9EJ0isIxe1g5z1NpqCMeDrRi9ZqX0rHHnYmXUKZvey3%2BKG2SLioH46lyc2nP7Pf4IncLzZh%2BlgkomM%2Bk6FXyoLBfH5PXsb5mSUZUp61lIQKf6rGVgf0Hh2dz13Z%2Fj74oG2duK3QE06RXSAb%2FN8ptPQUZLX3drhPsiUYox2386Xw0tko9j%2FFq6pUPI9neoK54cjnxUEASTX5MbLqfFvKCIjdp%2BIEHut%2BJPvu50g%2BHuN0yhgsWcLA%2BRZ7hgzGAMDzZdP2U5UJbynIaz6H%2FS1w1Nj%2FyMAOySY3kSiSGB2NHjVtdO9uLcjySftBxwSCKObscZGH2WIqP16DrUBlHbB06Pf8%2BsjAg9PMloP2OuGTiNQfkTpB7B1N2iUx7uPRX0MDKAxtN1sqt%2BiYtFV6OE2DzdoUFaiQy9IE9K%2BLT1%2BHxC0TPA03C3qKJiGh2SaZNfl8pYSLXjikyvQoheozHY3YFZAbm%2Fe1Iv%2Fx%2FW2K7qYcd786p0DC9zMTQBjqkASzQUdZWRW2pWH0tnj5L%2FPpcge2qzSb%2BoORFeAuAjyRifP0dGqoTIh0EqRefuDBhG2TxyPWTmtwt9JVnN9YlmsFSACb2ZPFugQddr%2BISSTsQEB895MC5yjEB64Q1gI0ry7NriaRP3y1WbMofvWexEVOvghEzy2mznhS9DROrF95y3sywlK3EsRUDcCGjv%2FhnnRPa2mPbivr3camQoerOst5tGY9z&X-Amz-Signature=be68e2a6a3993ec65e44b9a7b5eed57927faa1443fb40fe8f408cf92d3201cd8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RSRBPPZX%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040725Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIEtQ96fFcTgc46u7Q1dLxKqQm%2Bx4nzMu%2BroqOsjhD8CoAiAeGB93ATRWcfzuLq3ab3IZVmvBGmnW7D4dHG5oD0WaGyr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIMv1ImGrhcJ%2F%2Bezh2%2FKtwDlGhUhL%2F0AHSgI9pOldtRqlNbpk%2BxpiEDDcuydREIcXePyr1n%2BKW6BlNf3BEcF4BI7QjO3tuLskHu3wMOaF4IZx%2Blov24R54j4X7e7YKbxtuV9be1oJTK3Bx%2B1flgYwGpW46C879zW1JC2HP%2Fu4xvo31gylPGcm9RrHIzXXoo8V%2B7n68KjGKSqGp%2B1rqUUnKIfdYvQ10ZuLQeXN9yo7FKgNJfQZD0ovPnjsq1hDKlyXHkP%2FCLJx3Q6eus8MEQaPmeTrmhWzkDP2oTYUw6ghhck2Z1lzAwAnheXCc%2BAYm92cA%2FYGDRXbxTrtztxRyW8%2BGjMvdbmlN3zsm%2FVyfcEqq1K2nH1o9CI4WCFM5K3%2BSzwF8w3gtxHEAkcG5bQwl0fkBa5srF3IxFr73Xq%2FIr3v3t%2FUiH%2B2nS2ZbYnFoCnU%2F0%2Fc6gDyl92GVT5%2FUTxbH71JV%2BY93Wiye2xUoS41ybFlLi%2Bv2VmMgea1Mv8GnyOeQ2nVo3RzyVXIEkHt37DI5GcXhCUOuDSrWw0ZJn0wEtMCPq%2BsC29hUnTDV1P141U%2BIVtkoLZLwcAUzaMZJtxpaQNNizy881mNj4jmVpbSfNyNpctd7uKpHX6%2FXRXvCpMwPNwcK0129kZrQrwC7nE3ww1MzE0AY6pgHb8MXFB%2FiSecN6G7KSGGxUBEui6xQBtgqLyVsX4DdO7pnS23rDZCDB9mFpugPrx5GFVZCqJO9vUjuBJvTJPFpzJaOtgcnyH6hBIv3hYFNJJgwfou0Yh4e37Dh2kvXa5SReDNrMNujmXTcI3kDX2mJSejC1dCT%2F6Jtu%2FOWBaM8NgPSm0ZzPDj2GjHjQsZ1OOUAxZNwv021OxVS4%2Bo7FANa%2Fwkyf2CfZ&X-Amz-Signature=975d8b3abcccb9658e0a91c70e9a507ef628c6419d0376bfb6652a8df05341ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666RFMST4Z%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040726Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJIMEYCIQCAcXcQ1P73FTJPP9Mf3vWUsIThgkgt4ST1GSNyty6fPgIhALceAZCqFITI0XRdUGslsHI1ITaV0GUl8L8ISO0hkQdUKv8DCC0QABoMNjM3NDIzMTgzODA1IgxLeDJclNe4%2BDwENI0q3AN8ZZO5ZRdpQOtHP9KpU5QHr55x35pqzQo1ctEgM3zOHOcujN0Mm4PPpN0z1i%2B5dF%2FrMjg8nOO1UnXmDLZJ8myagGbYYF6EgAnqK2n2TQb%2FZK%2BhkBOAahysx0l%2FehCe2N0Js85JgOxe6%2BfSU5tlqokjPByKFgEh3w1tOXoDyQaA0F4q1hw5NfK3S3%2F4KVcUbC83KX%2BGkO%2BT0dm9icZKgZ%2Fja505kvzbbE7PufJT%2B%2BrwynqX29pgDvJwLEYnKiPqeQCxMnERzKvS1EXxFBPlKnly0gwHB86QQE8MhC8jwMk%2B%2BGB78MHvrU0VwpkGttoH8wer2LgwSIymOxqjE%2FqNWioUiyhnmhSoqT7P6g8RQc8fyy6Un%2BSjDnZcDxAGkL6q3%2BNZKp4d%2BKgGhVrWOTPvbyt5O1L6iAbakmeq6vZJxZOTA106ZRnigV2KblOz4J3zUc1Xf%2FCdpgR1uXcb57PVCIcARgie5YCVYuc8p1ppqIi9CJzcQHRjzFV0isSzWLTXlSlWmpE1Z9keLtEor6PGRl6c0Ceyj%2F999kMrzkuri8i0anaZKviE9XZ9e%2BnujGaVEU0HQ96nmLRgqcoE0z0SEgySm2EU78AaxIv5bqenYYKKk7P1kXYpw7qg6GWoxjDszMTQBjqkAfJ3wV9Qvx1oQT5V3tX4f6My6Ol0sYPyoDhLrDUE4bPYDoYjyGzTkfy%2BAtHQ7zKzfSsO1Dpwyy7TDfHqga%2FE2P%2FXWAhknnlxZeX7J0YayEMf09m4r7%2FqmcBdnMDlP%2FJ6Cy4e1nsbl2xDIA2GihgxeEigoAEbiBRIvIE0ZX5v34UqFPcsgauidJG%2FQ79NO7Kg6tDIMY7FfjH8quAiQjQQPHfa%2BQF9&X-Amz-Signature=fe931950b4289ced6d763624aabc2716c85a0c43a73612ce3b409993c561af2f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TEUNJFX4%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040726Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIEt%2BZ4c%2B%2F2Ke41EJ1yJLGspm3PN65j0TVALqH%2F8j9LprAiEA7OtiR%2FCr%2B%2BFUg9j%2F2ofKr8peHmvGzvgtC2kr9rAcJm8q%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDM9cgBudg6JO2Ju%2BySrcA1BXy2Ss4f403o7SiHtOBlcSCsN%2Bk3SjBpeUUhWNRIfAn8ioUIluWMvh1oCKAmqIeBfRTTRj8zW18Kj%2FHSki3iziDAX9WXjzLcxC8qxqdxDng8MttkdVHbpa5AK1O9PCjYpgSqJMXnn0mwZJWlLoE5%2B0mkmp9hVZaKv5QlT%2BM9UnK8xr0KQNXvJQmpQtvuorwb2Lrttqkc0S7a3k9AKS2I8wCa68Yfqqv%2BHL5W6C9mWIf5rL8yWmdWlejv4CMbZNPJrghk3e%2BVnV%2FiWttCZeh9PGkD6vdBpIzbNwTD%2FMABUvrgf8p0JRRHnPtLrVPWwauZyRcf1vpQBWRcFNLNZq9MPiC2E0BOKLnnOLo%2B7AP18tU7%2BTLIjh42gzsroSW97VBRzf3adeIO3tWrfs6OG1XpNC9bzhjHlStOOBCbWVGsaPmiwdnEgr4xxLQJ9C4UPpnsIwsKycFpdNIrgz5gji0Q2oExAXTZKBuXgpI0LjTup8Xqw92mLlvq02VuQai%2BDlmo5TmZMy7K7Z44ocjwAAfpgoasVAiPzT8EbL36NQZMeR%2BHU9jJEHNoyjdzj9rx0eruKulpWyLZNlOQhcXDsOwuuEgveLor%2FIBBpmPmLmEjkPmLb3TSQosWTjn1wIMJnLxNAGOqUBdcqY5do67c%2FusEiMMmhN0Ar1LXqFkjVvGKSVb0SZ8fKc6Nta03I%2BLQATvKdMs4tIKyN512QmswjawJToIqQvmjRqVI3%2FX2Rwdf1LvhHxYQ%2F623IQ%2BjFKeqDN8LyUnIIEyGvCyJckCe%2FqkS8Lacl1f2Z%2FT4ihZH1EbCe7pjAZ8wPpzJ177fNNU9qI1oTpCDpPvovCFbx5Qrqx9NLCMwG5jxFcPr6i&X-Amz-Signature=dbfcc10cf845449bbb6b61b830c59d4529cac0e096b8331feaa4b5f1dc13395e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VD3ZX7IB%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040726Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIB9XnpeykxupsghcIhVMJ0EBrMwCDwlGWEBzXchNDtnnAiB6v0KGA7NG8cJBzCTGdpcTtTVm8ZPi7U8vXHjtGr2F%2BCr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIMs3Ys0hgqLxXUJABsKtwD16P0zQ9pIUX1vTkdTR4zM8qHkq%2BOlR8b8MJmx5%2Br%2F1hSJqKB7dnA9haNlxpEh1V4VVbJMH8djSgnRzCV7fZqmjHnLSMdV8D9Jo7YMXZw0%2B2AWOSgXzJn9RIygKwfIKCkHouNMJMDI2aOolEl7E1tKJOL2Ju%2FETVk6o%2BTaBrfGDp0KF5%2FOyVJ1b2EryRUpFmaZWHDVaIhDasQJi2vCozB6B1K1Tk30OVmui0pk7DP%2BLEEF9R8HCy6gKC006TK6Cg2Qh3PYYp0CQtM18Z5pS3xseKM0oNtLRrbtNC9z6IJCrwU35YRZ94tqhqcmJ963laUpK30FhSesJzEt8kztqnsflfBFATOo3hVjBF7T3tnKlukUvdgmLzXtiKIWJWnLpx8zouaaP5116Q9SaBNdSwrPCQVQkRdChFDXW2DwaCvWMB60EQhInvoenAZE8WRSaMnOTDgceRho9zuft%2BhE%2F1ksMqSWHAzkZyb506WeJ3pckojUujQBDw3wSTwU4mVYVQtjBuBlsr96hDM5wk86McJRDv2DFxSFFvHLpknqFj%2B6yVOVmukvv6Eolq5g5k%2BbePuwwI40SbS5Xp2KjG7osyu%2FQRHLCDvNT8eSrGqOME4PmxL0UkRiZgJ9BCC2dQwicvE0AY6pgHHbbZ1EFFu4h9mXIfqAQzZ4M84p3lb1%2FbUORGbg0b%2FTCAbrFQHeXDjUR3m29IdJ7DXber2vFB3Yb1I5JinMxA5ZCJdYGPu7KzWHhMuYAlu%2FlxWnPHyu0YCI2rLNfwXj%2B5ye6Kp%2Bhj4yngzScIY6pi2Ashz0z1ipQOtmZEDN4hXWBGST55F%2BxxKRFIpVwiOB0MHjGKIDKRaq2ZC8neEHtmsJlIw3Tq9&X-Amz-Signature=09d50f93f9b5e07e457488b46e19a5ff47f54c9d44bbabe9eeabaa2f185a37e8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YFURA724%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040726Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIGo0lgynzev0C4e8eco5LZ52C%2Fat4rceP3Y%2FeEPLPlMEAiABVEsQkp5n09%2FFduAmFHr29mIJH%2FLWSVyJKCn%2FTukhmyr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIM0gYfITqQ26pSKpwtKtwDl4IaYCgBJJteevz43JmJ0APFwTU0VsnmXRDXEdLX60maaiiHnpiskYMp%2FQaqKPZXp0J%2FCEn8JBvzXfwEV1XkBZccX3JYHKDF8N7tFtVAy9tL1Cnwk6Kg%2FiCb2T9X7StY80AstI9mKjnz%2FL7pjvw3%2F4tbk46O3cPKl9dka2jncn2ITOgX7QgWn0dO5JWXivL9vPR2ACBfa%2FlSmKEtqEB6YM%2BwA1WYF8p7xaYj3AqUmS%2BTdA0H9fAAphlIOveu30AElEWMYjHn1I%2BZRnfeefWomjGQ%2Fb%2FWjmziQCt4%2Bv6223UzBC5Zi2kyi9TQeZIC8RYzFxs7CnzDlz9USHb60F6K1Wq3t1KORYPry93jHRu3JlJAGfP2tB8ULzDaO2NTeH6f%2BzZ%2Bqicf6cyhIeisgi%2BjLE00osXbkvrgbitlWjdj9evGg%2Fh735dgpWv8ek8rsroczcF6muEJLEQ0gX108vMcwdpYohJxf0zG%2Bi%2BJC24g%2BHuy7DKSBFvznIYvQ5TSBeb1sL12LYJuNL%2F5TnrA0OJLe8OL7O6v0DO6k2uNbyp%2BD%2FJMdLWFnZA4bEs8Ubo8tvugcyqSkhGz3ElHVIjq8tWy3AQH%2BGl%2B60yk5pOpFw%2FyZfjAcTk8D32wqcDgJKQw18rE0AY6pgF1bNB7YJIAeiGQglQuCcc%2FsHyrq2oX%2FLfu8lCr0SSTiVeSHchfGnNE3CUC4OlsznVkitME0VdFOtrb6cBfeW%2FQajxyFum25YdGVFxqsptIB1Kr8pCwTTsfYD8q9GYnbQ1H85mf6wYsOBAhFtct5aa07aXVmZouyruhkH5q30EHLeRWiEY7afA8DCoYzFssCwDNx4UDLutsCOpDCqCuI4cOSixBwCc4&X-Amz-Signature=b0861912617809f71c691cec0769a53df8d0c9065eb473f604fa5aaaa00aa22d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664235D266%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040727Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCICcFb4Ei9LXugeLXaVe9R22UKi1rOWXU5LeeNQMJztxnAiEA8jGY1RDdJervv%2F34DLnTR8JLJjIfKcpfyk7zx14KHlMq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDBClGQ3FYpG3Aolj%2FircAx53yNIAXNNex0mePLBroP3tUUiTha4wdmmnjnTEhAf16K02bt%2BK%2FnVJlASbkkcrYpYNG0%2BKeG9XqrpP3GSbGZhZT7hpUUKjpFbOzPsmh1ECUkKmB%2B39Wy8vKYevxsq1nClQxgHS60W8ae5h2egsc6ynwQv3VNev5YgsirHGhtdxv4FzRNe2xYZIlcBkxkA3UCEqdDtsKgm40n3tVmcCqiXpgcUS388xByt58OOpjg4K45yG0N77IMdwEKLwNauTMv41l0HAE0NV1m%2Buokhso1tJ%2BmUsJdMomHhQD9UKmwPTjWQPqVJ4bgnz6gvWyxWYjbWsiCqWdz%2FZNlCFTICqIMnAeshOoADcIBcOFwdtpXxCSXLhUJ1qDqPrHCzYcAfInX3rukg9z%2BXQlUhE0EmTuycpoa%2Fo0GLGYS3o%2B9BEs2Bjndm%2BWHQ2hks5R3G1LsYbX3KDlxpoaqUA%2FxhHbNSCQe7ifXAs5aRIInaCZz%2BShfAzp1hUc2cCUx2i%2FMLoChCGfU822qW1kBlo8nVXgDwx7hJVZzwwuX3iD0iFxAc4z1w29I6yvERqqBVAfsI1M1BWsB0LQOdlwqU7Ijwc%2BYPrJLBEykoIBRjeknh7CGx1GUOZVOeLI5eMt31I1bLHMN7LxNAGOqUBcTtYU4DVtZRLDA%2BXq64rAoVqDU82l9rDvc71G7qh%2F4ee4Cawd5aEnQFUnaFin9lNuhCwNNymyvvSgb%2F4%2BBs%2BSasSZTz4hZFRwEL1ES%2BlhklKT7e5Lk5pxm23czcO8A4d%2BUIDI6a7y%2BnbIalpPidFl0NP1LnTFumZNLD%2FFqmISm20o%2Bz5YXwyXDdlV1NHy3UWBYlpInZsg3BwqWz3xYLvSvJ50m0m&X-Amz-Signature=e587b6aa25cbf60c55eca343bd1f2f4b802d076e00cd1d984e899469a2eadf7a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UVLVIX7U%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040728Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJIMEYCIQDVob9dAR1bu0zZWmFPhKQzpfTuA0%2FzDs4b934r194pvQIhAI%2BEQOERrGGYXOGhnDPTmAuechc6yXlrmIMOqJ0ljYqaKv8DCC0QABoMNjM3NDIzMTgzODA1IgwdtbzKaQBbl%2F8nl5Qq3AMbx41K7BBHgw0so6TIIV%2B8BsJKSIHgI%2F9tqeI%2BFJotNL3IzZBRWbUYdys8xxT7g2NhRPKV4F0%2BFeMR2Qwu61RDayliAezuCU1Ibp9i9tXwQnezjke%2BEQ1X1yUWgX09BlTzlVCLJ5x7csuconPZnZ797GXGFGsN4LYePYNdu2zE%2FcBMt5guRw2KhK2lB5wtgGcYH%2F9JtqXszYRLzx9QxiJk0Q3OMN1zyLIlFZYC4jtpgPIR4g83hrDISUsXuZxvTdaSeGDaI6NX13Bf98aH6rlag42f3X0lVIg2CDXTN5w4uuLlt75vA3%2FDvKK5U%2F6L7K%2B%2FlqEUnL8RUAm2z7a3kLEgy%2BF6nIlVKybq5rXNmhusdK9uQnl7wcd8tRo4lXiWphp0VB05LucO0QUOpwk%2BETXXqVoIygEJDb53jaW9gT87TTpDTr00FPkIdahFjZFpdnBHo5T3ceUZpP5oxAKfxHotIXecKP46dRMlwpvRX7ZfvWNHRFnLsWrzQdCWhl0W8mc2S2Iwe7uJvg3h8JvMsRWiaPd9oM9s398%2BZcm8JJ79swlaL7jYKpJLQVMEO4zQCSfVDC%2FimnA9Veu0y6%2B6dKm3zNtGmA%2FNq4y6IQOK9859Ie4Md%2FMcoPsbjGxdBTCSzMTQBjqkATcBhZghBjCxcS4s0d%2BCuBX8H6HhCKWWfUfPH5OdQvILR34119gt%2F1DZMD53ERJqT5GT9WfNxPYLLFqO1Dve862eZxykfs52IsDF%2FnHr0M5DfUf5aDoWSHKVPRRgDHFQgcJhudvk7UJgrd7bQGZx0PigZFM%2BpwFYrSZy6%2B6SfETPhSnL6qIrox%2BwBluKTQAanXGOQMjprBzJ4sd0V5gfXkSEDQJo&X-Amz-Signature=d7ac9a3f78b32a96ab6dc6f6bfeaf4c11fd9a705de0a48a649225cc3d0dab7b4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMRY64S6%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040728Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIQCNg2NqZVdUyu5TwqHEvi5SBPOYGcPCk1UggNMSOPZRIwIgSbiqDou76Tw6Yyk%2BbzHuDSadiGK5vP8jfIsyfxi2f48q%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDNOX9YzDszPsqZxBmCrcA8l9eAHrkGNPiNQCewrZkbTojGR6oqRO0AiJFgFmRSPsANoQaqjeNtHbTH48I8kS3dul2C%2BGqCApKOwj6KasfXmepUdZ8VJmngIRJm2Mh5fW718MmSJFtwQ26QClPkcPCZjIQjfn5%2BjPbe%2F3d0gAm8geGSSnQZww02N7By%2FTywEjCx2puXKPorRWirp6OM8sGPkzqAPhZqSO42hUOgW%2BQNjPKfVlMW5opjsSGoAGSXRhkwqHLlW9bQAGvROwXIyWmr%2F6p8XQH3cJ%2B0LVtQ8ra6Kx2K2vqr88wEMqq3F3JF5PbiHvDC6Zr%2F8ua1Ov8agXdWcohVuPo4mWdw6mx2kaRnXs6%2F2zTnH2URv8qQ9audL9IxSCxTlU%2FPwvs6NnvTRWF63JTT6f08pmw%2FFbk0OIne1aegr%2B0PDBd1TNaHvm7GW8AxZKxf9Ih%2BK1YLnF64x80muZwSUeL2yOV3giGyNacmgpeTZckil1N%2BS9z7VHkV6iptKYRDx9AwzHIxoYrY5X0nfxEImce3BHDCN77cYEVYlQ76Y9%2BCN3mkDDhZhs%2Fejx6%2F%2F4LBXPwb9JBaEJPZnpFAY13kDe7z59Te4UIGPXDpaq71IlYEKaf0ff6fT5y2spKrlXQhfMm0hcAAWuMLzNxNAGOqUBgt7Xcxae6VEkZX1rNtt%2Fypf8VP8pB6nmMmHMhAM27kzTd9wCybqQ541NfgR9nbWHfLdNXeFLK%2FckM%2Fru5%2B1l3pFcSsR7sqkooB04VJehm9PVBpNUEF0mceloVJRKJq65muqxvNCpgCNvhs2Wqwq0Q7P62kt2T2BEbUtWENg2c2I8xzcIz9tomx6WekYIpN2kaSJ2JVGTeA2b7HKvuCT5jNLmNeDm&X-Amz-Signature=fdbc27faf5bc0a2646f8981cac0a6f9a092c86ea9fd9e3ad9001ef42a70f3d56&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VUWXEULW%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIASvZhyRuf%2Fx7aKp94q7HBnCnIEy6EylXkuRNu7B7XF7AiAur7g%2BadorBcJt9Um6j%2B%2F6C6n%2FyuaAELnrxjO7fseJqyr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIM9%2FGH6P%2FI7xCQtdUnKtwDFMsg8WuMXK75nvsGrC5my3yyZ8UgJyfd0%2FOw6018pyOvlGvx0cTRPxuue5DjwcjcbgIUOzJk9UYyZSWh5VU7TlxxEj1f67FS%2FGVCnocXVxelNSCTVXEDchTc8g7wxSKFzG%2Bu2XJyjEx%2FrdlXN5beuNOQIEMsBkEl3bJqZHCMri0E1ZlA5XUczBD%2FvTL27FWAm9PRjLyr6EAfuPk81QvsN%2B888kYmNxOlYFApS4YwzU4ARBbzJ7ZyndFVSfMdvS10tLVl4Y27jUAhwHUhyQzKU4nyN7ZKJmVKtzsmIJ1poLwsv6AxPdkDtFpJyWca9cBpig%2B8sOrzuMRAdzIWjLELwuax7%2FC9HzspZJFlSVZsGeN05Ba1j964hXgLkRO7DeaDEslOOpKM2%2BB7aYXP4R2AZIuPeNSktRCP68SKY3WPR71W57QpLNrT1%2BwPUCjNgphKumLuo%2BKqMM%2F%2FAf24L82NzndgyQUDcytBbKNksgI6DDoso5%2B23%2FdfZSksSI%2FU15cwoNbNU1%2FIHUMWXVZxDFVA94m0NDlyU0UDvPPWVrs9Wck3vAyFEdsOUtOlKV8c7aJrKt7K4wY5YfT9FtURMDIfH299Tp6ppWYgfW2kC3WcH0xs0hTmayJeZy6giV0wmsvE0AY6pgFGfNyROGPgv2qYNRD0GprFc7%2B1e8Ry0Np6CR79S7kDJRJyYOGLlpkAkVBvxrtW8l4qjLx8NXAVL2BBf808FLxlTBKsqiyv%2BT6pwCdFJ2PHiGhlAjet4W1suUkcoLtoeACNRaSxhvEi3EvRKKuJWlveUq6z1RTJmAlQN5SjzvVdiUDtv229hnwvq3GjbprnlLKDZFVf532vE0SQ%2Fa%2BQKOoBVXEUKtM0&X-Amz-Signature=d82e357d3c696805cfffa0f7ca20bbc8b72b92aa5ccc2a27160712b98fe17846&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VUWXEULW%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIASvZhyRuf%2Fx7aKp94q7HBnCnIEy6EylXkuRNu7B7XF7AiAur7g%2BadorBcJt9Um6j%2B%2F6C6n%2FyuaAELnrxjO7fseJqyr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIM9%2FGH6P%2FI7xCQtdUnKtwDFMsg8WuMXK75nvsGrC5my3yyZ8UgJyfd0%2FOw6018pyOvlGvx0cTRPxuue5DjwcjcbgIUOzJk9UYyZSWh5VU7TlxxEj1f67FS%2FGVCnocXVxelNSCTVXEDchTc8g7wxSKFzG%2Bu2XJyjEx%2FrdlXN5beuNOQIEMsBkEl3bJqZHCMri0E1ZlA5XUczBD%2FvTL27FWAm9PRjLyr6EAfuPk81QvsN%2B888kYmNxOlYFApS4YwzU4ARBbzJ7ZyndFVSfMdvS10tLVl4Y27jUAhwHUhyQzKU4nyN7ZKJmVKtzsmIJ1poLwsv6AxPdkDtFpJyWca9cBpig%2B8sOrzuMRAdzIWjLELwuax7%2FC9HzspZJFlSVZsGeN05Ba1j964hXgLkRO7DeaDEslOOpKM2%2BB7aYXP4R2AZIuPeNSktRCP68SKY3WPR71W57QpLNrT1%2BwPUCjNgphKumLuo%2BKqMM%2F%2FAf24L82NzndgyQUDcytBbKNksgI6DDoso5%2B23%2FdfZSksSI%2FU15cwoNbNU1%2FIHUMWXVZxDFVA94m0NDlyU0UDvPPWVrs9Wck3vAyFEdsOUtOlKV8c7aJrKt7K4wY5YfT9FtURMDIfH299Tp6ppWYgfW2kC3WcH0xs0hTmayJeZy6giV0wmsvE0AY6pgFGfNyROGPgv2qYNRD0GprFc7%2B1e8Ry0Np6CR79S7kDJRJyYOGLlpkAkVBvxrtW8l4qjLx8NXAVL2BBf808FLxlTBKsqiyv%2BT6pwCdFJ2PHiGhlAjet4W1suUkcoLtoeACNRaSxhvEi3EvRKKuJWlveUq6z1RTJmAlQN5SjzvVdiUDtv229hnwvq3GjbprnlLKDZFVf532vE0SQ%2Fa%2BQKOoBVXEUKtM0&X-Amz-Signature=b5f31b6a4f54e33f480924b81df680a87bcb3eb8dbc0af8fbb51a355c09f8ff3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
