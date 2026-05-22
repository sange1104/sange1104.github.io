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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664OF4GNIZ%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043507Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJGMEQCIDPwoUiKu4ZugAPam3VOivONoqSdGF9i7Sy4ZOms3tyfAiB3VJQPdBqvG%2BEceQBN69g0SsNhd%2FGl5GFfKAdPJPF%2F8Sr%2FAwgVEAAaDDYzNzQyMzE4MzgwNSIMQA9QTKpwHLLQ%2BuQ7KtwDizr0H%2BUFHfdUeQoKAW%2FvltFNFzClxjlKIvRpQQ0H95AqOPjZROuvVOudSBVPDuVsnxf67dGywEhFiUUG3iWrtMEzqbvH56plMb1OzR%2Byche%2BFlwWxA%2BiFCQSR0LC5KTjupZ9UJ%2FWfp4C5yYZ7YJW8KEHhPky8Jr9jL%2FdVYN2fvtLXhqU%2Bd%2BSpMU6icsElL2dJQybrob2Sr6ywB4ILfLzevgG7254JdjJsghrUC%2FGnc5KZY6A%2B3ySuCHtvl%2FJur%2FVrNqUvnsmD8%2FkHcbY%2BBSluaXGY1QqH%2F26PoBne9U2m6gDtNNUOnRtgW4xiqN64nGKlJNOL6uUAehaBJrJLHWAGafisxYQ6EekMPdNqpFWGtZRpIOdjHasMHzDQCOiTYBK8bAJlWAdCWRAwgy9btTjnurDzkDLEADyssfUI3npAQa2PCNkkd0wScaN5CkgIA11t%2Fogry6d%2FpoFUltJgmRhTmqBtAaS2O%2FQrOJcNth5vAUaNm2iwI5bjIdkHzeFCqaF3VHrc4pAm9TVG2TehAP%2FfvTRPBo1tyafAl7tIl9NEnWcoc%2FdyMHYxDeodbOKtXqPm%2F9O0t1J6yCoP6whVM%2BqIxm%2FskGRkrLVadBQ3KHqY5Ayltx2JxP0RPzqS70w57K%2F0AY6pgHdQoBGL1HMLPURWDu0azV5gHh%2BmXDFcV3KrRbqGsiOUqjzYcklv%2FopN0uZjMtSRK1tOvlQW2FKHSMI4LPNAqXzsonwzaPPbyL5CYq1BKksIAv0bB%2Ff0Flb7Mr77FLwduNljGsY2FE%2BZyntwFK7q64%2B1KJ2xzhwVLPm1jhlqHaXT1V7O1bWba3emryi6MSMl3ibk9RSTAiQRLOsE0BKPApQZqA%2Btjmy&X-Amz-Signature=c2f7d176dbc27bb72bc14a9e2571441317dcf96b50b43f337f964466ce7b93b2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XBNMOVZC%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043508Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJGMEQCIGkSWksXaln09bHQX5m0cOcylcHaseJWRG%2FRzCu85thxAiAjMSl2hhZI5YCIS6%2F1T42mT91KWjdkKOeBZFkzdsshSCr%2FAwgVEAAaDDYzNzQyMzE4MzgwNSIMZIsB5o00VhX25IvOKtwDJtXi8NcEMHFLaqMOGTdnEM1eXCEDysPG9OErkWl5Dq637%2FlTKFF2YTtUc%2BiSGTd2jhfYOCGmnB46P6FolqPCjTrzkOry%2FmfNl55GGqoEGpaxBqa9L7FPwHkR7Kk8%2BaxuPl6wSpZ2H3JCEargWYTglvegdciPsmF5VInRj%2FpYzRMwotiaIqF8uDarZCIrgyi2XTrJrHlz6zt6hcyb9vnmwm9Ig9vzv2ad1j%2FLjSO1xGKpu%2BIhd62YBIwaGWfoRNDAlYF2FUhoSgI1FFOy91jEe1AcDJUvPwHo4uGROtfmf2F8%2Bj%2BKP0FdsbgX%2BfA0T2O5KzoFOZIT3D56Ij955R3zy33DueOhlTEDODoxAp4wpTWZ%2FkCcyUtc30gxurnMIn6jLLcbR5FVYU70zihzQi2RCfe6piOFA7lX3J5kMS6uFC9HcKkAdquheMUs7QHuy3g0ZDiUAYZsVUmVfnyBBdoWXCt4K%2BQt4KC4vQ031Mz7oykS7MoB12g3dcYNMib6QHPS8Kh2JSNYI%2FzeUcDP0b%2BDezedtgyd8XCTHYITja0hz6%2BX3O2vsjEf%2BT1CvOfPYBycCA5iFlBOGS5Bl6Bhsuqra%2FYDnF%2FG15mUP3sF%2F8IXy3QrUI6TUhkIV6chLxUwmrK%2F0AY6pgEt2zd0I1uPepyMsGIYVKZ2pnuPUnw3gjH6RCFpv8Ed67dvOYLdTarNT5%2F6MIUqo1HlpyS9bw6koyO%2FoCHjn4zOAVgsrbE8322DQZub0H8E%2F5Gp0aYCKtWhLdmO7Cj2JT8NvSyABXOhniOkqTxR5H%2Bw4%2BVOWbiBC0tQ%2F9TwrnmVtxfC9RXqwgcUGTvGR%2BCJx8cXCKPGW%2FXpvlsy85sg652BG9yBYtxf&X-Amz-Signature=1adcb0448a119c12f0964bea909fdccc185139714d089e6e45ad6f790b589952&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664WT4KYBD%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043459Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJHMEUCIQC3iXAzfIVNvwpBdMFLVuLB8cu9m%2FvspjBp9nIs2xLz4gIgbzSjetpgzrHm5O67EgptuOxefzGllyxF%2Frj5bHXGyT8q%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDIrb9d5eC8G4P4YjqircA6S1yKjNWrcxM0pn0jLFZumANnR3%2FcZVIr5KPl3a2IASiR8I15k1yGt8joU%2FBkSCmzbzPulo%2F3vQqWXZ%2BRjGEIqjTrBHeu6M7sDYH90lSvN1uOlBK3Or7zSwLkU9doniXFbaxXMuqRg%2FLRAHRwuMgnFSiSLy13UBgZeuyN4QZLPCMkAYE0zybwDxGI3q%2BgTkgnIakpKfjs6de40YkjlZooqDfF%2FIPiTR83jdsSnkref0ZaBtiNcTi6PExjlmOc5UOO9RoMHkyPr2OeBoaZj2LEtJ3ltX6qA%2FsSF1MXbHX21faP9PNBu6re1gU3VodL6g%2FkvGeVBnAJQoZUeg4LEYmQTVT7rwUnPNVgyBMdgO%2BvedWXcTYOzshvfFoNQRs1wJRqigcHc4wyVRN%2BCPvtnnRDj4JQu4XTd7tO7NgjnYALQzKdLfoLx5opMM1MnsscshUkrH6jrQpnSuIkJloymd4xpIiRzT6BXtAitrse8cgGirLu82OnkgMry%2FS5rUB5s1XUa9XdBEirtLgFMgUMLlIwP8sdjQWMJr%2FnU%2B81IaE1aTz4ys4b0A0dz8s7cDSVrOrye9xdbjPAsnA4QF7Q%2F8Z4jljHNWPejTJTq8MsbSOMPEaf7UYFuT2e40DbpcMIOyv9AGOqUB%2BWQiN%2FxzEXKDPZDsnqKBh1QoQO7cT12nObGojmQClutN1uYJcriLuOOecSzExTteaMEpy6h84b2r4dVbCaVLpCtSeE6bO%2Fci8uh%2BMJHX%2BmEqI4KrpxZcLwczVDDQJjeNTirPcUWhHqQYe4iHRk%2B55%2F%2FQped2ZGgbbIgtGNjWhYgaWEEf4fjmqc9e7CU%2B%2BMgVuUD9BPXmhHv3g%2BKTRFsFiMyYyo2B&X-Amz-Signature=0eeb753825144759bc284e28ef51ed816fbb8bd87f2841dea753e37904ff8b68&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XKAR35CG%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043513Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIFC5VeQ54%2BokaKRL%2BJDcLcYd%2Bd82yrsi%2FLII2aCd5KEWAiEA3acoCnri1XyPsaNW2TMT3HnFl0qGvPovTPLNEUS7RWwq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDHsFRTQW7J5BfeL7tCrcA2R9lyaOWXxLuFTwWFGdcSyKVyqPPKwA07JUKDT7jgdG7bXKDE7NAhfjr2Xi0H1C00FU1ZPUZwXTpJkmMUP4fkklJHiSuthfu%2FLYFVVVk8lZ%2Fvhzj9AmnLZGQ%2B9GFUvMvk15n%2BaE6JpbVZ7ogoVyR1u7O6zW9JrB4vbtF21b2UhoA0aLJDcVNTa4wkRW7acy5N34LUMbrLNj8wv259EWdGccvWsgz4HUvhk9lpN9XbE6Tz8nKIrwE8Nek5Hr%2BxML%2BA7fg75GIFpRR02cdAhtvzMUvm0YkveO3buREFhxfh2YgI9Tv09RPXzgeqLb9YQY3GtIRgiE8l4CZtNTDblcuijKI7DRf5RhREIBWFkVMUyBB45DwROO9UbgAhMf%2FMkmePVgSOAlbypgZwvv3nbGRoGqYW5CKxSEE%2B0EDd9eYtGjSNOEzDb6%2BG7%2F%2F%2F5T1bBiphzhG45dzwYnxHlpL%2FmWSl9eHZgxiMwdcORs1zBeFBds3eXs2Ia5Hahos89tCf%2FCrM8MD1Svgda1av0sxFemRy7oDaDw%2FiMGykNnQRBsOtf7LX4EwwM9kI9wpOmSESL6p9Mtt5q2gtRmnP47QqKw6kVT90L0nIf87Sg6mQaUlyGyu8Z9nDEzRAtqJuqVMOewv9AGOqUBz%2BE6fjOnTw2n%2BzDTCyxpcR7aouuA3HVmw4LD2X9MG%2Bv6Mghcz2uRGeuuMfWXb%2BfydQ3wZlCoO%2BkOF5kKaW3Os5%2BeYEldYyXLpqSZp%2Bs4NYBGXvOEUNZnNfdiGOLWLBkjgf%2Fxhkau2qTA%2Fz4YcY8e2CvooZbuNCnnjG1Os8O8bXSL4beZwz1ryVKjnbFqQ4HLPAtV0aOLhfvOg33tVwKUCRjq5vFh&X-Amz-Signature=22964eca5a0af2c21130663482b40c01e891534c99abcc902ac46ddef6584bde&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XVVBACXJ%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043514Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJIMEYCIQCXxIuTw34A5tOWEBl69ucF1vRY0yqXhDSiUDxLrp3gLwIhAOwXY6pljtD9aqGttNIjQlqoyw3kMqp2PisD75PuFNvrKv8DCBUQABoMNjM3NDIzMTgzODA1IgxcgzNReujrwx05SC8q3AMJe%2F1h19EM%2FrDJNFrxjPyPoMICmXVa%2FLOoVVLCNi2DmT3AQG6DfqRJGahCfbz0d902r%2FHvou%2BlyWSPzgfbx7J62eXPGNNEqqMXTv2CWX2Su%2FLWvsfp4Mn%2F1pMN8Qa3bYzlBLKV52VeAozEaeaRvszOo%2BrypcRFPlAtTst8YF8WAgyyZJKTqUsk6h17rJfadvs3RWBEw%2BU3yjuVNfqDQNHhLA%2BggBre%2BTF%2B%2BdbCVzaCY3oPK4zc1VB6lKh2EZh6OmbWF%2Bc3HgJ5EOavicn4QQoHIJNTryImE25GTh%2FTeYjmLgoBNhO62fAt87mOkwtHN%2BucYZFi2EWEWKhgpMRme170IrJmj4VxYidxRXxl2xb9N5sGiF6xi%2FReQLnvKyhexQF%2FZa4GzVpIu1JmMf%2Bb%2FlTzJryzOwNz%2Btai9gMAlxzQMBiKOy43fvPU6mHYEC07ZefjitsiaYE5M6Sj2k8IshIVsrO%2BIv64YfEws%2BAC%2FBQRGJz0zYBgFz%2BW%2FgnIxJPmeVtbqemuCB%2BYGyQDU%2BEgK1Ct76wd3cz90JRu5NY228EXnj%2Fuefb8rRDq%2FFIAAVqukwDK4wr8c9%2FxYeOhntNWSkiI9cjll4PkJKXFdfxVnbLCNikbcEg4KO1jHqmBoDDnr7%2FQBjqkAV%2FKAf7LUYmMZrq5kzRJ0pnIrg01PpK3B01JXuvTqzjb32eyXHVWKns4%2BL%2FClhA1gAkD0ufskVALhQNbJbZ1i8p4s81G2rAwPp6T7jeS5IwTRqypkhfk0MSPYDxmtXdyK81hvqNmoBFF%2F8aY3TiQ10yG4%2FxtjPtkfFu8%2F7S%2FsTQCl%2BhyHLSL6Fc6ThyyKTjDjFspuLBrLp6ws1Jipzd0eiwHDhUG&X-Amz-Signature=78fa22d66f0215e07c5f4b7dd3a9eb5d11e34a06a2a3ffee52c26a10dca60344&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SR32EYKW%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043514Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIFH7ju9HSTUIObpG0NjIXuZn9XZopX2Sv%2BKixCso40dzAiEAra2aV4x6mv6G7JJgXzslvGpo6E%2BglGFNEupK5n9QH4Uq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDNKEiGvTvgokot0fNircA416G0NqHEj3kaeJqX%2BezoIO%2BUcVoh6IhRuGuEyRkFbZJhONyoDvENyNNnV3njg%2F2m0KSVYsbe%2BaJKk333yjl09zwtIutF23NcyfWVWhofj%2FlQgcEpWxLpqc%2FXYMs3O85034qmvY80kDfxHoqiBwtsV5xV5HE1%2FHCpF75kNgvj9RVRqMUFPfKx9%2FkxWz8gfQqMLhaQNo4D55Yp6w0zX2MILAafV%2BN7N5eo1HDskSML2fT3nKjhNOxXbTmMTP2%2B2%2Bn4PL7F5QHVxaoHjC2qx%2Bi3Kbecfovum%2FA6STaqGyBQd2qw4Fvp%2FWLB1pltHd0SlkJU6OhG6ELHs62n4LOipwEuvMs%2Bmu1jSHhYF%2FlkTdeYtDEfrWnZeC6iWPzYKNf6kOzgQb3XmBDRwc3PlPyzfzu%2Fx23MBbXUPMYcgvolio9uHiKkDq1Cfp3w8XINR7zkzBYs2iwXLhvxJAHKAN6TeE7zMISKPp1rZLrMiZoQEgX8SXqPIUS4JTjoJ%2B4EZRUS%2FSxYO9lhKLFDEIcsWdSIiYa2tTENvS9vrTwN5vYA7EtZOxNkiDaT%2BOAVecF6NZRBNsDdxS9UYpPjHuiaoKqoxtcTUFtDwgsNAt%2ByQzH8%2FOdduS5E%2BSj6nElmZCt7DeMPavv9AGOqUBpMopx153bx4JElmZ%2BW8O%2B6xJA%2BYSajRd4SdwVqq2WbRULPIRhmWbUW9N0LI74MperxUMERqZJ6LzceQSOn%2FC9m8sFXYbh3pHs2zz2JiyPp2Ju%2BrVNvXltNmthr0SJiCYr1Z1tdjpfRK%2BIKO9Hocd%2FZ3ziZl51V56hnA%2B4X9Ui7cRqziYwHoAegLcFzzlyEkCHFptDlvz9AT7dXFvS0B8oJQ4aaKa&X-Amz-Signature=6bd741ee561782d58f34258f6e412bc9fdbb066c8a61f8c21051ae8d426f1778&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XOFQEDLB%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043515Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJGMEQCIGDMcUXPHlR7%2F2Gco%2BuaMzcFDb5aeBb8mv1CNZI7S5QxAiB70ksVzUiZ09f71LSQM9rEaDWzkWv0sVISXaNxszHqMir%2FAwgVEAAaDDYzNzQyMzE4MzgwNSIM3d3BnIGSzpeVe%2FLkKtwDpBwMwQvuNKekYKXghoOvYAbwjlLEFc8pDuK%2FV%2BHyxsqoWpebDTQdqRWhM%2FJocHF3SJ7ql3%2F8hq4EE93aIOK%2BpNJoffgNwRjYDlou3YeyLjh1oNZeHoveqJXee8tZqkOwPESjfajpU1M0UrdkTYg3ovEwANaTtfHdetFMnlsz60si0tTsfp%2FOVeA7ZFEDw5xCF%2FLaQup%2BNtwX%2FZ1yORe5W9JnU5jN7Fspo3nTz6QjGftV%2BslziFnVroGIp22q%2BabiUNV1fyZ5fervqe6hEFYmICQjdUIt6oBtMmA3z4RkC6TItl7u52ZnP5eHIP%2FtlauUzMHlupzSlcamJG5UWZrf6mqle22ELVug4mit1dcKtLjLks7Eu%2FuQcJNaHuaghuraAye%2FabgL1NuZ1u23WpA41iEpfh%2BghhGj0LqsAj2I551zlNkwRzvkxL6pAtoFyEZ4bnd4JlNMECtSWVykQK65FdTmOHX%2Br8dlaHz61%2FmCWQ2%2FMAborc1kGLw4AjUlr%2B7xAbce4lvQxfXlM8mmloIGFBY9r%2F5oRdMuyu88F6VtpB%2FJHSZrAZr%2F6TCYWY4UF5K4d%2FgfLXAdnEBviZbVRbJOpQe1DTUR6O2gEcPase3lGVQn8BIBlu%2BvzCFjbygwmbK%2F0AY6pgElJTUj3RxK85GzGmj99kaJWhW62XW0D%2FL0UutTuTutf1ZEDDJC3lbks36ufk01H4g%2FFsFn7v3L5LMx5QaMJ9MTLAsn%2BH791rssN1DnLiX00QyvUW50o1naor95VybYlXjJFMtNJA1T16jo08imX%2BLbFHsYLClKGxIH%2FP3dDvWmlaUGBjjL79Nr7RJHi%2BsVMsvBOfwEStBEL81DRsmn2%2FU4quwzW4Or&X-Amz-Signature=cb0ea071a9d354bcc9582dc08c3b573037aa42088ecc59320ca719cc2a3a4559&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YADWNY32%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043515Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJHMEUCIQD37G%2BPKgPw0NJaCFURXBm%2BoDTUlxNgcXRUpQt0b5YNBwIgKm5CUXGcLsHM4Lph50NMIMDygmCCCazi4%2B5nr%2FeGt4Mq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDC31EnD0w4u8xZzLaCrcA5685g1tsGogmFQis%2FXzLBFaRewg5c9eBr1trORKWnlxsFjBhsk2FZkG%2F6nfjYHPl2jbLYab5tuL4Zuf%2BNvAH4OTkPBD82%2F236k5FG882xULocb82LCwy2WrFAnWVtaLH2CThNbYFWd2X9Ki6eViEI4BZ2YwsLfOPSVIrTXj8wM75flOQb5HNJxJMozuvdZvX2oCrH3vzzrJgUe3W1h3oocqw59WdXIHGqaPIznDTixBoRDlDTt73Vxv22%2BcII8p%2BiQ31LZib%2Fd4dEgsxafDRK31r67SJQOidfKXngf2jRDC1m5zQcniORnoDt%2Bx2WEzkD8RBQ3LdKNlR%2FTCkaYezIzvX%2B1mBLe5ycynyvMG1KV5lydedOyEAdvuc1X4rplDRxqjDruzyFwCAE7mO0NbE2288RuejFscwjh%2Fq%2FYKJYPD15odtr6jKKKIXKcY0VzLaWI2qlXwoUprDbnJKLoGUl6%2FzTgo%2FuHcCGUEXJeyki9Jte%2FihE6txd%2BK%2B9D8kmECY9BT7IoDs%2FmgWJtOoD%2BjSnbzrh2WFYx2VboIM%2Fl8oOVJWAbaIjXouDRBLR36TbXhjihF922gdxXBBPfuSxB%2BTS7rT9YprgXA%2BoWPAB8YqV2vjmdgDDnhCWMfhnBVMKmyv9AGOqUB6Jhs3cILVRtgcGf44klbde3Lit%2BG3TzGuSxsPQ0iIJgQoSYZHksTILzmobwmuxoL1S1%2BHAqgAWO7DEX0VF5%2FoQPgy25oKGC2KLt7S53m7%2BE4fX9q0kSkbJLu5EFFT9HkWSmE4VLa7Dhq39KWAZ7MBzYNoHLVXfLW5k%2F8iAzshekGXUXtWN4T4EaLDz7eIM1NsJFvKF1ftwNn5xLDIcJ%2F34O%2Bwa%2B%2F&X-Amz-Signature=f8e1891127de5c561ff75ca6ddda826242f5c532e09409b56aad4c50f1472860&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3DDUH4W%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043515Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIQChj7GrfO5uQSYiImQvf2JoIV%2BjEgE6yyBwJ3NJ%2BpoPYwIgVMS2CN0DuFfOZP6NDzZEJKN3afj8pcdK8cwppsSznSMq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDMKM%2Fo3nXSKlRVf3kSrcA%2B0dqDW05Wpx3UU7psRs4mZ3bf5y3%2F3fPDp%2BB5jonYYHUMzh%2BsAEowC%2FFe6BgBdkOR7OfcSXOckiHg%2BPp5vDSsVjZoZUUvelrG%2FGrO6yJzO2QwQG%2FROyRk52oBEWwvjTuGUXZgjDHx6PxVkkVOZ0ATY1K5UDecZ9P9jNPxwE7nxgiLmdSjFg%2FkdU9W8m3Ht1cnIZrRglDZ2FmJEZU7s1osmoU4mVd9loJZMM8ORafWJOi9u2Rav7u5F2WIdKgGD4aw6sdwLWyNVmsRzkb7tF8%2FpU40MB2CMMsqMhvvd64wjTrLU3F4L4AZIMwp8%2FfM9oB9K1eQp7CcdmRdCxEhzZEZocZdy0YO0OAUbMxL8kDbW9U0v%2FO9zYeZQZo0uwz8xvCS4C%2BVzoYRkdoZjDRcpH0MdyavUVcGYRXyk2VzQlnolZAG1sS5rIW%2BZkBCUope%2F0%2Fky8Vs%2FtcJs4piYhAxseDz3xlWVfP2tTDfP6pvi5pLO87ps%2F1N5hCBhiySZ5PTzzc8pPzkbCkt1JM4wFMfwf2ayN7DUipwrU6dwoVQFMpUnLwM6gvXSvayDzZxLisNZCT6G5og%2BtwpUXr68uMPOFCG17V5059XAplN5pr%2FI%2BoNo9TVHsshcPZow1UoaVMNyxv9AGOqUBqwlqvy%2BPO7vbHaSEwzTSQQVQcZkg4cScK74uCT%2FYS1ZP0I5uqVUhSiTsky%2BA6jU5VZSntrJYovqAO3r%2FET6j8dxXRG9YTs8rm0XsZkrrRL15ZmpsH%2FfWOSLqt9JG7LvYpBq3k1UXnm%2BMAQvY5igIXvwk9tEp4chlmufvVe1bprwh%2FIRT1kWP0b%2B2MXXJTRIFxtbcQgNXRWzM86DIdDLQoG%2FNeWhY&X-Amz-Signature=943ef2fe181aa29d1a7ffa928f97ff01a16471760599fd661cbbcb6c25639637&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SJN47OQH%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043516Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJHMEUCIFDxH3%2Bv6LamsCknZyOC3lBG4KDHLQ2wAFoFNnR%2F6KywAiEA59op8hmR3fFp3OOUJFKGEICXG8KkuVUbAddmULGNPzQq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDPdmZZehDWslgAYGZyrcA7JqaafXRN%2FeuYIYu4Vzs%2FrfpBn9Xhw4vqhlIjKfxbFMjJaCHCbkBYob45HXG9AknjzJehASPBif9VJmARypzqTKN%2BmurPXT%2F5KQhKScOXdrfxZetE3kIjkFfaLjfjvAuCjVXhWnvdTrrcokf8x58RUt4xemOLJ7GovwUWp6zkuy1JzTonv2bbyFvA%2FSncZgGZTtdNGBdBpNt0WwCFhQop9AUZizHLVCgWC5dYTbwXZ8awntihra8uP%2FgdHW%2BrhVsubM%2BKPHFQqrLDOYkN1GpOe3RabPVJOM4iaGQ3lz4af3Fek0wL%2BaljshoK69aYPUNOaDiFuMzhXsvPirjYmVx3wAnQhoNePsWDZXt3GAjyirytfPfXkxXu2f8pmIQPeLb4IvTzPRCvKN1dcA3B4ngFvWSQivIMVP3DPz8wHoOTicqHJA0fpxADdWy2UsxL36dE%2BbsBvL54FeCAfjcx9sbuj0Dhhhl6EGJjv%2FM1zUdVsI0r3m0%2FuyzYV9YoqbtHhPEwuUMBDTy8aC7459TtFj1B%2BEuLNzfR4S83fEVQRaph22c2bXDUGvM006tH%2FDojjecxxC%2FZ1%2Bs%2BJg78SRVquW4VfRFS5C9yErB3egDX3K0yZZWWWFfwvu%2BVWMmF2sMMmyv9AGOqUBVo6Zwr6MhfU8iDQveExG%2BbDq%2B7aDUo4VNbC%2FdPRIk9a14xEXzRNjSZv3NasaDtayfPMf4ylDCZVGu%2FCLnbib720OdP0ai4FMJVwEm4Vkb3w2hpkh7rI2Bq2ke8YHMbCYNCJdI7w0VvnK5Mn4%2FgUhBaMQQgxIhdzR7mv%2BuC9xVs18Me%2FSl4Ojp%2FvDjoVvz46TudJ4GIkU5qPOXl1ygSjDroGaQmhE&X-Amz-Signature=c9bd9d6a517b3c05628f9b740271d3aee9cfea24e04be16edb4a744f65539d5d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q33DJ2JJ%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043518Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIQD8S8wYEPazXGXfI3g5jMyu6Ar%2BvDb9KXleaYng0tY92AIgc6SlkR3gaP%2FabpdFzSS4ENPu8rSPpgmEN1nnzCm6IqQq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDOvAn4WP2hID4iYCXyrcAwIASG9AI6qLvWCQen6%2B5v45FMVRF%2BQPDCpi1VyPEPwX3ddE99m4wy9XToVY%2BBLRJIw6cxX0lPIL2AdmaDENXj3V2cUwWrcDGez8INW6D3HN5sySE%2BQOVjOjpsuBTNEFKhA4la4BKQeQiEno5lGtKx6RAPrt%2BM3CQD8Sv45a4k6Woc4UVgfY6kyF3oAHLZdOrDIPUBujWMjqS%2FYYysYFHso0fzeSp%2BpVJmT3K%2Ba2PVDL%2BiB8Vj8zHYqhsd3pGtWbpbRB9bFnxEKjb2uTpHaenhwwwilqWqVW4Z%2FRoDxqcoIJcmnBUwr%2B1ucKGGYYxCEBjp94NYInHadYXDM%2BEBApFZk66tt8KeLTuvxE6UyfQvIYKZH6VbXp8iCm5Rg0n9DTFrC0W%2Bq3G%2BpCavKTPYlLb4GslARR3fRepZRUrvqG8l%2BXe9P1SEk3TnkEANzi6pvT0q92WReCBbo9v%2FnRG043pwj%2B5drJTU8J5q0OEBccXe9trdIALdM6k7sCeyGfVwK%2BpF6vnR9HqrSnXD2rKlgBAicbkjFRP3ug4HRdTiPkAGxNo8e%2BF8DfjupA1x2wOFPB5pUQWMCNmEDF33ziOlBl%2B48gTIUb%2BG%2BK9KTZhBHd9FBLDeCb0ZwYE2EfyLUhMP%2Bwv9AGOqUBfuc4%2B5x9NXv0FHSCDx2hNHasfQ6j04S4cCRvlxAgZlRPwi%2BRbsnxC4MoTkLfKHWcWSBMRHwtTyS7lbkXf9aVS6ky5X2Afx4cDslvCfR8frKxlLIOM0o860giIqQqBmtPAM4tmlQ8K22HLdxy357rMcAoh0MSC3cjA2wutiSZ8FKSkYFpN%2BhVFc4g0MDCl5FNObTg70vwYEgMN9EXi5zekcLedvBq&X-Amz-Signature=0f0aa231685b02341d7e75fe7369c98772c92d635ef9f48cc160f8432ec85817&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WM3BABFV%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043518Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIFGccoYmisipAq8woMI8ZwqJ0YwIlI4Fn6Deq%2FCEWtwsAiEAjfaZYDUO1c7VRhJjldHsnf9PzfdxnjNe7nadpuM3Wu8q%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDCFPXEBgSSWjZ2q33ircA86r%2FEuakuOX4TRSuciy1Y7tTeLPsXoSFBTLYxId7x7S%2FhdEWMyHvc8eToLxwnPzybzp5hS7gnbBTgGkKNBk1JcQWDezZeekDUYG0PPXy7Q02CdZG%2BpBKTeMifS%2FLUBq5M0RQKyYqfmRWYJ%2BJE%2F04NzERMjtK5IFy7OScdgUIEFFDKF27RNQTKR%2BfjGvohkLNBTPsPmQJ1uG6KtAIOdRWEWAL6yJrTz65S0yHfJoh9BlJXH3NCWnruFlyLMaZePzLc74ipwuWravqHXnifxtprwSJn%2FwJSrLRzPnQoDoHbCALFr0D57QGousWaeCmcDt1by7WwQF13cOIYs%2FRdGe8Ux%2B%2Bhg%2FPTNLXdVhh%2BhA2JAhJHcsFU%2FrvNPeHlhszOFz94LEvLmAyHgyxbSuEe88MKcYbSMiMdDFQZrl4Z8smtBiAZMOtZC7UVa3IBKmWVx38scZkbVsPlX6nmNl%2BNF7PP3WjwjkBDbhaeezhWRXMaH7atX346s1DsXqvbyeByhrix6XK9P7FjjQ2etVzPbeMoQCvaZ8h%2B2Hm0RWvBAvv6kzD3Bo97PQPXGv0SV%2FT2nTyF8KAphR0j%2FxOUqXZbPSPhZb%2FZrrovMSFv%2FPHoEXhpRBkgRRWPpm347VT%2FuYMJ6wv9AGOqUBW1%2FMD%2BglahSPL6fA8RwQUPiwiA5mGBLdTh1DMuDfOypfQeg1EiyuH033N%2BJzTNm8RZTRnVPHgLFQCjQTzlBZeLqAvR6h6TKlPbcGJVxCN6RxhyS%2BJ4f7a841rLojuks38pi9rDGebvNedj4eTLuMa6pOy6d%2FN2nWaPIvR9bk3Crc6mhq3DR6Lj51AlbwK0J%2FzpTnwvKW7rXb9XUFSevcptX4sGPv&X-Amz-Signature=787ed4daafe0d344a5e4f3ba30ab893eeb14816935325940b3ec77d845e2f867&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667GVKH2RD%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJHMEUCIGa2hgfO8sNgRkj97kGZq76JsathPpurqSQ9tlVjicmCAiEA%2FwMRdWXefr55ZWJ%2Bk59iWWmRpIqQvwxVZ%2BXOxOTcfnwq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDPy03N1vaLKGiSDH9SrcA0YNdgKOmY4O1ndx643uYenxZIAETg8JsMJ3hNgLZVBXC0dfU4ibBgtPvFrGMGNaQrJUrTwwIpExoF5rsgTdEJrSNbdlX3OIfyCfutmsHNGDmEdpsauGtTdpIgFXCo%2FAToBYuM0SvcNa%2FolE0Md%2BLHzfDUfasmGQgvp3SFQEMNGndl1joHbRhfmgf5%2B0sjfeH5PdJ2%2F6bRzeW6MWvF0VxOg4btAmFL%2F%2B1ZY16mbupDPyIZVTlFtYEeMAe3YlQb0SPLYkKMYv9fJSOdvDZIS0z%2FZ0zZf5sBQorQqz4qw7olv%2BKssjYnXdeQHg%2BhwWqIBXOiXKU%2BNi49uPqk%2B5Tc2a%2FcfT5eKkcE%2F6VpqQpSQrMxmRnwgswEwkySK2Xsm%2FpDkfSHzVLM0y3SlAqHZwAPYklVGC2Xhl5z3uWqfIrw%2B0Tr2RFIGjexicWAUMauWFzE8gZZwx1I2aIEzIc9s%2BnfZ6BPoS767%2BRkpFeAV2FseBUKJ%2BOGayNtoNJDpq8IyHhUejW9Upt9C34drusc5yfDfeCxrX6Ab0UIuwNLZ0P6L3i45ftkdQTVO4BCLe9DIDRYSnymnFR73kT9bAd8qXzrZylKEY0JmXP5kvYzT%2BH7l7gBcKhQ3md3uWPWNfH3ekMIOyv9AGOqUBUdPaTtIUqloYXZxGJiU1MCIXC5LSWuITmbzL3rLlz2yQTxKBv9Z5aqSXNN2mXe1LhWhAYKZnxvyPgpjt8XgBxVKqqo6Ga560hiOdVEWQH2ItZxpPX0eFOpOU2dkLSXA1diXjWoGt3S7P%2Bk8CxD1o53X6Y5WPssEKZd6dWYJd8zEy5NsCqi726nXqqnDHB3iEDy%2FSHl2Fu35REl8HVd5V78cJUcA0&X-Amz-Signature=08e9ba8d1c3c0474ea2a128ee2ae86b0aea6d1e1cea61b2061f6fc4a0a562cbc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667GVKH2RD%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJHMEUCIGa2hgfO8sNgRkj97kGZq76JsathPpurqSQ9tlVjicmCAiEA%2FwMRdWXefr55ZWJ%2Bk59iWWmRpIqQvwxVZ%2BXOxOTcfnwq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDPy03N1vaLKGiSDH9SrcA0YNdgKOmY4O1ndx643uYenxZIAETg8JsMJ3hNgLZVBXC0dfU4ibBgtPvFrGMGNaQrJUrTwwIpExoF5rsgTdEJrSNbdlX3OIfyCfutmsHNGDmEdpsauGtTdpIgFXCo%2FAToBYuM0SvcNa%2FolE0Md%2BLHzfDUfasmGQgvp3SFQEMNGndl1joHbRhfmgf5%2B0sjfeH5PdJ2%2F6bRzeW6MWvF0VxOg4btAmFL%2F%2B1ZY16mbupDPyIZVTlFtYEeMAe3YlQb0SPLYkKMYv9fJSOdvDZIS0z%2FZ0zZf5sBQorQqz4qw7olv%2BKssjYnXdeQHg%2BhwWqIBXOiXKU%2BNi49uPqk%2B5Tc2a%2FcfT5eKkcE%2F6VpqQpSQrMxmRnwgswEwkySK2Xsm%2FpDkfSHzVLM0y3SlAqHZwAPYklVGC2Xhl5z3uWqfIrw%2B0Tr2RFIGjexicWAUMauWFzE8gZZwx1I2aIEzIc9s%2BnfZ6BPoS767%2BRkpFeAV2FseBUKJ%2BOGayNtoNJDpq8IyHhUejW9Upt9C34drusc5yfDfeCxrX6Ab0UIuwNLZ0P6L3i45ftkdQTVO4BCLe9DIDRYSnymnFR73kT9bAd8qXzrZylKEY0JmXP5kvYzT%2BH7l7gBcKhQ3md3uWPWNfH3ekMIOyv9AGOqUBUdPaTtIUqloYXZxGJiU1MCIXC5LSWuITmbzL3rLlz2yQTxKBv9Z5aqSXNN2mXe1LhWhAYKZnxvyPgpjt8XgBxVKqqo6Ga560hiOdVEWQH2ItZxpPX0eFOpOU2dkLSXA1diXjWoGt3S7P%2Bk8CxD1o53X6Y5WPssEKZd6dWYJd8zEy5NsCqi726nXqqnDHB3iEDy%2FSHl2Fu35REl8HVd5V78cJUcA0&X-Amz-Signature=a4ffda3dc21ae58ae3741ea0dcb387463e5c8c2054713a1cfb0e1be61f77c86c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
