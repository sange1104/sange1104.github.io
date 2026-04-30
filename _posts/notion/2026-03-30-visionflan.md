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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662VY74VET%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040206Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJGMEQCICMrL7qCZ481d9x0rgZBGUVK6GwWdWjTvsK0VETHzBa1AiAy80XJmntuIef2UaMX6y1ApQjnrnM3EDG9MnmPEAGNxir%2FAwgEEAAaDDYzNzQyMzE4MzgwNSIMNnByZy1JFB52yBRzKtwD1T%2BpA9nXSCQmZyYgmdWi%2BsVkATJrjCssLzkbyQJ5OJQiblYSk4ZuWC2Tgf4Agc6qTVB0vhnA0UNUsFdv14t5kiu1zz%2FSVHc4nlHW%2BRDMKmPWT2W7JwSfPoUjPv64yHWI82BIdVgRXgOJeCYkXOKrulV3AR%2BmscchchUNBWhj%2BHy6shREc2uc6QyVuPHIeGlhbBiy6OdOsl%2Bs7s1A6%2FlHDkoC2etHUDwIR5Co3M2RrkIAUuzH5NY%2FUCQQqykgsnleVCvOUc%2Fm8CdbNVRdMK9fcTOWejxerMgqOQCGq5zlbmxoOSG4a2UL%2F6a%2FvZn0pTiHGOmoJkT%2BMR66heshBpczPPRrR%2FElwQAl7xY58rLsuMw2x2kUhG98XwjSiymyacuthPcP36lusCjY6PUFJxK9JnkuFLsRHu1ZA6yEWKozCnsZEuSV98iZe0V35KxbFjcUrOm5LoyKNJSiMM95Djy9AKB9ajkje0q2ssHYZfc0nKLys%2BzxVbxGniLuPbJIwIhPfT6gxJYiGN5g4rZWWoiT45DAEOQwyn6AddBFX%2BKSZMKdCRRdGStmsTE5iWsCOUUgygrVUSS9vZJJ%2F3IG1G4r1Y%2FlrIyMSliOni59u9IO%2FzJA%2BQIoh1a0bvm16g4wnY%2FLzwY6pgGowmYpstTddWuvkDBtd%2BLOl%2FvF45HOvii4AWtTDi%2BSJZq%2BtQqqRxCJSEr8bXwqOEVDggikqnY4vqj4pmkdF7VjiTk2JB1J2Spe2Hv3QNlbJUSFWa7kY0yG14bO39PRn25QnuJqo%2FBzqte8HwpOCTvMb%2B4wzW22b8Kl9HSW09TW7oIYcxkc0%2B4B2q%2FlabAAQaWWcuN9t6LnOSLKyFmcLngB8O5GzT%2Bw&X-Amz-Signature=3d63828e5e80d41a8c9b14829f70cf461de6f9a725fa6b0557ddae48935d47cc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QDVK6ZB2%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040208Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIQD0NkR4szGp%2BTduXl5HTio94uD0ithqhLZQ%2BdGvQIIBlwIgGnrSfxOYPRG5YSkjM7CPIqcIqW97bFzBvypXSYtRVmgq%2FwMIBBAAGgw2Mzc0MjMxODM4MDUiDKQaXyifEm6w7Y2FASrcA4BRq0NWe0GB9uIPEW0Idw2IonQ0SLgKafOC8YAMRhAfnP0nvai5AKJ737%2FLhgbMLSWNgtlzSq2HUk7R9oYzl%2FUbI6k%2FhH64ERbWW%2FzIYfWB5YtfRyjPLRu3B6nf88B25PvkOEOE%2FukBfODkVj3GTEeYL4KfuzQbFnGkJGJ%2FDktnXFk5Te4m%2BIVGQ9W36Vjp0%2Br4NklCWfqdH7ofhfX3C3qdhAHHNGpjH2k1aK%2FzTvNDvIiFGm19Nv%2Boo09tQLMWPXpl1wkyNpHZB%2F0JwxpOKX%2FWP8v9%2FlXk0U3dNIWTTsfEHcl6tq1%2Fyp5aPn9gRQ3SalP7xzHzmNHThlbDu0JqOYIwmmImNGfoFPefnhFPkSd5IrvDgBk6avSbG3dZJZr2jy8jIBSO3dHgA2P6cz%2F2s8pyOdA%2FZ%2BBZtlKeInZZhUmvsi4VdLCvT2yaWV8AyHmDwSv3ESNGUZEvBhDDcbrL9tl47raUVD4eG9ng8ZgZAXT%2Fbsebo%2FLcQ9qJ7DtkfleYMEfqiyvEKChPNgN%2BavMoJtleRUuJGnvaEYQToXYzW5%2FolGkkSQPEpsQed2M87RT5WXrXDDGjbKBwuVzKbtwKpueIzE571bNnlT%2B5SwrTEcN6XJNZD4QTaryfIGa9MPCMy88GOqUBl6sWQcpVOZ6oHhx4xKHgchobq8GyQOkbnTF%2F%2F6w39Z5YexKwNtvrk1nNuJXOCfU8nqfSTrKIVtNl9sL9vzhP5sEg6%2F2NraQu4Jmijuq6THTAqdTnvM4lkxtyPVXwVmRSo1JTnJM1U2KXXw9583ReLOFz8PqHWi3%2BUSh7Ge%2BMu6ctc8T4UpYOvyTRb2QcwHLG%2FrbnDSBhSKC0MpXvQSPVuGDkkkEx&X-Amz-Signature=21dc529070104f5ce8fb91775ceed110e8826e22831beb9aa464723db4e77524&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BSPZOJW%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040200Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIQCepPeSaDfRKBjo9rb0bu509nUrokPPJMGN9D%2FOY8n6QQIgTXjlkMnlpqeJLGggyBsGEo4t7w4oDa8ZWU6WDcF0YTgq%2FwMIBBAAGgw2Mzc0MjMxODM4MDUiDMmaODuLIaMyx2LxKyrcA%2B%2F2WENU%2FwfhBMWind5atANR6wfhrDj5J6oY8W40y6jwNmQfn23eTvNPgExf%2BGoZLrX14xpusj08KkVyXmjxoLXMolnwx9tZXjWDCZCJXjslRRJ4v6Xgo9Ezg963hzXCbfD1k5C7USFj1FIxGmZaq7V41c8dbNG%2BK1IjLwpqXKcCn%2BuNC0DM1gP%2BhCkyA0dFoSOO%2Fd%2FBPWhu5XrWIz3azpZirhkNJtremz9k78uC1wXW6bhru6vY1UVKZuca9wP1JOrsUOKSHtn%2BHLqTQMHRxffEv%2BHVXFNjki9cnw7n%2BteH7biDrxSg3OrSsiGof8kdvnELtvdhnAd5f%2BTwT6exr%2FotdWcWAdVpuRfu8jSImXsjahM9DbkgdT5pMeViwnoN5y3pMuEjn0mzndIlrS8qTW21J4c9lpMCQFaYaWSPtC8rwM8C0R6j4slQ1Jbf%2B6S0%2Bw2ZHy%2FuyxKkSO2D7Cr6yrjAki7rlVfrwvSZiS4%2Bojarx3Mitwh7GQN4Qjphb3mSwUoqqgNMYyOHk%2Fbjpd4cjlvvvoqJpbetPi%2BcuAuivMjKIsMQBSFSqIWCTanMduumna5%2BDSdfn93lOpODzSResrpof%2B6vK9Bgt1cyYWTb60%2BOmdbkUf0zrswxYCFIMJ2Ny88GOqUB0EdyNpu3yD2TE5YO89z9WzXgNHFQrIjDDTEZZAYp4cM6ZwIaflcgxi%2Bt5V30AzMXgw8nbbgmUuBQLYutqJvI2TORi42VvmsVN7qvEFw0yXmBMcApHdt4%2FznbZBZ5lzv1KTtag2mql337WUpsXoRhWxMAi41cLPAV3W2UyP7SKK9HNjXnKc2ANPtNrcAYYsZMnRJn7vCcm1Bo8lYs%2FMOQIFG2uoDl&X-Amz-Signature=a81ba98895e5bbed65bf145858a410d0df942ade56182782f2ef55ab27850472&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZB5HO7DK%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040212Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIGbE5YGT6UUbPgpkDbKcUGlUxi1TjrJ8%2FdczjUTiaFkuAiEA8w4sD%2BiECPZ6jJmJTUyuaU3gN5i82VxUz%2B5zQpTA6hYq%2FwMIBBAAGgw2Mzc0MjMxODM4MDUiDB1Mb1%2FcXS%2BegkYf5yrcA88Sej8GEIVcOfP5d5%2B9XTjG%2F0omBepfhFyHQz6lpZQOXhuNybNiUzuOMncXPWZ3WXDfuvd1OgELGXCWRiFPoPTIHw1cvkC7001R2JuoKRniTuziqKeLbozPDjtl%2FNkfd8WZB%2BshPndwHxRGwWdbam9lpmsFebcrsEIV70BNobNVe0oiZ%2BV7OW4u6nUvFatqsfKMR26%2F2ImlLwRPjoIifvFN4nRoD0o4rm4qQqycuzXwbjij4Vnb%2FlXQb62gPdpWznuWNHT%2F4YIgtXt%2FITMkRGs9eb9ckDvCbjarV1lX6qnQ4pDHWTV9GcDyc4%2F8YxSzDZZ1qf8z6Bg5GE%2BzyUdNdAPBqCPpUst09xdCWQqG9X0XUXVhhF%2Bii%2BLsw0gu0x08dJGc096sK309P7A2Cv5zhYLxlX3jH7asPeARJrQjoxq12JPJR8Z9I1fRr3B6wKFJyTpACCZXIKmp1eMMWP51EDAZfE%2BnaBdbu6gyU83rrGJUhpDJVgTTIAsTa04W5%2Fcaxw0%2BXAEyz1iheUkHVD0xh3V6XhzVK6clSBESQypVMlIb5l2YyiMGtvrlO2VfAGhRwpTFkXGzOG23DB60OXxssiZblnWFgepoLPaXfykuveUEufyJgOYlVXp%2FS1f5MJ2Py88GOqUB421Kk1wb2%2Bw%2Fw%2BlM%2FT2yu%2FggP020DbzxdWzfUytjiVi4aALtr3eNljwvbWQCqnvAJIJntXGssGZ4OONg%2FIHRy9gpRsHPXKJH2R%2BCJZja49EG4m96YAOxh8rb1vy1bbT1bxpUaOT0YCeexWNI7BYDc%2FQCM20NM1LCalQLXNnBKzRPCeFwF4wsJC3daSfrFWXDP1Teg%2BNOcRpeD%2BgvlVqG1IqZeLzo&X-Amz-Signature=908f8400b7cd9360f3360c078bb8f8d04b278d022078315005cd8e4f47c2d3b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YCGRG3FH%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040216Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIQDZv8gpRG5FeuqJUGG0GVrUFRzPaRIRTMLbSTd3NKCpQQIgJJBhK8LCpdqvn5rhR3fmHliTAiB9SateNNwSvXG9g2Uq%2FwMIBBAAGgw2Mzc0MjMxODM4MDUiDOdQB9%2FHxb3hXS1lHSrcA7THzCfrE9OIhEyfgqT5Q%2F5rkVwwh%2Ff%2FvQSXwX%2Fb3wPhmXg3H%2BTM0W9GooWQNnnPsBUlza3OCtXagBXqpOoACKVCnD8usqh0jBx5SnXT70X%2FcYDW%2FdHhkii5UbpJ4XQb5rqRtz8nyup%2FDVN%2BDkpA8l0a738%2Bd42YCeEjKcwTvUeW6QX6P8yT4kRKmzwPLJhW%2BtjFSQQ4gQPU1a%2B8a5COc7U3ZvEazRozX%2F%2FKgrWs6SPlRPtRPH6pbBen3bUOvXUhG7aBiBLDmqoxlrXKvGUvyy4rp%2FBjaqG2Ijm4%2F9rzx%2FE5%2FOqhdRg6ahNNFtHeyJLMIY6O968G1DCCDFUy%2Ff0jnF3XtwSuX7Ak2HDFqCq3aUpw2NTGdlCeLgYVDvUbeUspvXtcVj0CHlgWmGWpau%2Bya3ZgW6egSaRXIRCqeans1dXs7lEUqQM%2B%2FS5FE6g18evyQEIS8iplQEU%2B2M8b%2FImXrMQqEFCh84HWivTlMhrCktVQyzoKXnIbsWJETrPf4HF3U5fgC%2F4mgMQjc2%2FNYnj1NwLFgbSCZ5BRq50d%2FxR6fOoPzUkGyO2Kib5Y%2FwTK0zxRhOSijlFKKO%2BaCpGWMEiMdvofZFxLj6E6GAHkhlw6p0VKY1rIDuJ2GUdYruXnMKCOy88GOqUB50%2FWk4IoDJd1%2BLM91zLi%2FaIOQCVQQYA0XhNDmpfwkC8mxRN3igprHJZFKUKFs19Qo8alSysXYgI2C1cX1BGmGYUdeuw105R43klPjdT7fI%2Bkfz6XrG3hm8di164QHf0ENU%2BpNZFym7lEjXy8MW51sRuVsnfXaSXdqussDyjs2eX%2BOmkP6VK6Gcuw9PTd%2BEbO2brFjWQnbVuBiAfmhkH3ZOwbNJi8&X-Amz-Signature=98f292d2b66f51227e56fff9361e13236613e19312740f6f957a9894ea1b2098&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663BOMCPJ5%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040218Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJGMEQCIBTQwaDUsNI43gLeVQh64xQzVpHbKTOcKJSincMhUdUsAiAoFTFmHul8g1hGmquRRp19LqRPl%2BLWNSnSJB8KyFpVQir%2FAwgEEAAaDDYzNzQyMzE4MzgwNSIMC5XfQPh%2BCHwyQmlqKtwDWVa7SQu9n4f6XvrzvXEY%2BDtMXZm0hjTBS2IwuYfFvhPADPSVyeZ4S7Puj3XiCHpaYDS%2BY9Y7I7rjrsfLqGuYudSlCqu8weyfQlrK1r453Z0lJi8IYMH6lPw7g1zQFoGOj7na2ohFSg14lVrAYKQ4TZe2VVfKqUm0%2FCPSh2ACrBosZ9g6jRV5WecPz2F359zAy5r%2FfKnbdKZFSG04k3euTtlDUXVe7AjedBxYtRhcZiyxYT0JelZNt89dOyyw2suovbyiWFRkv0YoZXd0RC9o0nhuLQVAJ%2FjqDeSx7VAaGuudJkJNM32WjoT7yi8NTDmJZ3s1UlDc1mEE5cO66farjFMBhSX4P9B2BsDI%2B8sahDedfOx%2BtGY%2F5LoKdDtsVI8iewj8p9dMXTcAmCn3gdHRu0nNkdT26zdwvWr0N1rOB%2B3ao37kAHGl9GLcqEDsiO6rVVtsDPPtP9Zw7kXHb2fI2pNNYS46SF%2BZHw6TD3%2BTc4Djlr6d17fgESmPmE55whMmSATpo0pHbRryi9eVHc7rYVpHPIlluyYn5gX%2FBlsfuK3n%2ByDQMFDwf8GrbYypUJEbWNqRkLsxlXuSn7%2FUxeiYNZ0B0jrKe0%2FBn%2F8a3%2BdqtOdOFOGBG5XqxdQUPrUwnY%2FLzwY6pgEuMrQAOukNyXTQ4Kd6cF5MONbJBT8mo1%2BqwAzgxO65G2XNuYLuufpJEqq2fp2yfy1DTxVtc%2FtERWEOvLt7oSQrbZ5S3DbMmJqBg3YDFNBC2gKOeqngbywqH9bCqNhtpdkAJTa7SumbVqrrsrHjjt3Y1HMRKbokoVGLtWrXeWPfQJ01lrqSb0vWwh%2BKqWU5FJSG5NSbA9sfBmcXak5tenuk2f3EjpLj&X-Amz-Signature=2c8ba64f08defaa06816a4c13a506f1300de30217eb604d05c1c13b553094490&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RU56CYPH%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040218Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQD4p7xj2Tad%2BmFti2La0FkS%2FFFjPhxe6A2y0sAGAn9q5QIhANGSSf4zgzlESvOGZ8fCeii%2BBypZRCTPhynqGesTazy2Kv8DCAQQABoMNjM3NDIzMTgzODA1IgwaRs6Tl3YJWfyJRjAq3AMsShlM39zSkYTZ3ID3HbZ5mK%2FEDY8K00DpU3eSvjbeGah8tguW2LzseUlghsWrwIBF%2BajvHwRq%2Bq%2F53nYtKOn69j%2FrrMu08gYuT0QIxieOZcH%2BvrWMnF4HuZRWdbdbxCZ9iiFjjU2byROzDf9GrlSn%2BBVkzC5rMwOmwtxXtmnIKV1XoJYaHfFsg%2FxkuuzaxClW6C2QFXyB4szPjhysMy2Yh1tk3%2BU3M42UeSK2%2B8AHFb705B1q4TB2gCiWItDt9rITp%2F%2F3UFZqYRYGN87PUtY%2FR%2FQB5%2F6kxD%2BCCmeDQ9Vp8e5LaGM1pWMdXcJAQHYNPPeVdOqnCNF5SeS9w7CKcYrbAzfx8C8dFgzcCdu0ruQJKEa%2F39Tz299r9WIvfV2DqHqQWMTCRKJHQqp0O8L9dzaizlxFwHElrd%2BbVXgUXmKBYH%2Bonsp8JaYAhIkSjp%2Fq02YA8QD1qtzrCbg5wUCRomkAW50n6MYBBPrWBxwHceNxlAUq8nuJAPPOpyYuen5Zwj5QAyqAZTa%2FMt5DOb1Cbkgzc9fihx7sHIb1wO%2F1xJl1LgF4vJnIfxqPpirH1uCGs4f0jtYNe%2Fk2wiAxQRx1tuKW1s2dEyNiflrCeN8DjXBfuIO1IgSpSOrJEe9jdzDMj8vPBjqkAdaHPscBe4TDyclmy5QwS7A3WRiZcswwaqAGjqXkSZ9KQWACmQwYFS6XsoRmVMGe3jOA2PrMOXmWF8kEtEFQCLOecFnVO2Ez6yIiJ1lPSj2Yt9rxW9at%2Bp9e9SYA74V7Xx8gIu4xLpleXHCJ5kAmN1NFH3aPZSaWZRC0fbYSSgg7ffBi2y%2FLqbBlJjJ0wyy7NXziWv8N%2FvOsP97Zh3pML%2Bl8S3a1&X-Amz-Signature=8bcb390faf020401cc796481927c149dad70318b04b713d227cb321c9b4ea076&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UNFBXGC4%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040218Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIQDeNFr%2BtDX3ZE8hXRBUluFLFzgWWZqXwJsRtcLnkbY%2BcAIgSiKKqUHsz%2B%2Fq28xQtSuv5TmWbHfKj8zUy%2BSQdRcUXEsq%2FwMIBBAAGgw2Mzc0MjMxODM4MDUiDALih4IddmCdXfgWqCrcAzEvLe9okR4P%2FYSEfEl%2FcUv9uy6Fhwhlxxg4XNFfcSvUSIgbn%2FCmpnXr%2BG12tQsbCI2WdsrIqwhfLVZBYQkwguRpHJJ11DU5zPa0GSAfoEIEd95A7%2FR6IhRuJKhL%2FeUruxhQiCAAR4Qt0KOBHDyMMz0G9%2BZwZ9dOPojPWs2q8G1wyWe1Gd0K96KuQgfMEmR3DiUrcXDswIaHZ0Bilj%2FOUP%2B8Lp0JkWDiXmPV84QDpuCffDSjC0tI0qBGpfmr00IBilVUuh%2F02KT7QkxwueDguXB6rmJMeohzbDhCbBXcklRlXfE09bmE%2Fq3%2FhMWkPch7OQMJBKTXXRD1BNJGEtpuuqGJz1p8LmgLkyI1c7Zrmn%2BzzcXj6AYatcpFYeOuXDOPKNeweTzIAUr3faPgQYnQ9CdZsNqCmHjg04xVWVZtUMO8RIgHRL7bPu6snojwm%2BvmArKNx%2BhWwQQHdE2ljfNzz%2B5JgzbIkpWUDZsfER1YA%2FIhuSuQteAmTgcpt1YyOIq2h5kfox7ooHVokCxExmxbiO8RzRSfGOz%2BSoJ8yYSzw3olcX2YIDS9q%2FrAaaNCjr%2BpZ9QeEVaErQFWqrGWTdn2%2Fx6cUEaxHL5MPG7aJSw4Nk25b%2FpZ14aapXDKMS3iMI%2BNy88GOqUBP%2BMp%2B%2BTHkFyCUWv%2BbNgIeTm6Sq1MswlxyFjqKgTKbdEOl4%2BhUGeM8f4eoQyWUkKbHHL3igblrZW5KtgMKvEKsQfgnvV7XRoTH%2Bg2aJQGVquV2bZUt%2F5uvV4I6FjkMTxuoXhnW%2BqDsvB0hp4fnA6xmiU%2BoAO8wVE13b2XTKIy2%2Br1L1TE9tX9vqOdvryqIL25tExoJE3tiOjNwgd4XFDB2wSs8kr%2F&X-Amz-Signature=a9f058bce550a79058ef411d1570eda353e7a6c74be89ee4ad9e417bf923b7db&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YLPL4Q6S%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040219Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQCyEmYUEp5wPHC3ELhsevEycdDn4jtwo%2FDUSoxTk%2BdWIAIhANhhPYnPpoHK2c1OuZbrQlZiAU4NmsW9N1%2Fht9U%2BejhJKv8DCAQQABoMNjM3NDIzMTgzODA1IgydZXhXc5IdPdzypwYq3ANUp6nw83o%2BT3A3jGyrUPOvdYCTWEL6rORM3hFD2F1HIX84FSVdlRyvrzsCxsDi8KJ5O159WEo0Oj3RcYP7TGCM0XuUKztl16NeGWSqtHdIMhh7btmiG7XiV75r3HnHOMdcYJlL7IweCYZdjDkbCyjvzByncoyaIbx8hXtZIKTVibkjs2m1flNhMqX03rLWTr4Q5%2BXS95eIhQj0zoSthKZA7sYmREH4PzAqVEyu%2FHS39qzNRudyaLh4QlJRE74X1%2BjV8faAH70pmFbHtSekxOILyFA1prmV5qbt3DkIOImgEMdwR%2FKRf7mkk26iqISisLP7JKP3h8Vuq9GUTjX%2F1V%2FWI5yDCMfBCBcsxoCt0q780Un8%2F9jQYLSRKn2mijougOkPW00MQ3k3l%2BMSC5DBVamHMLjnITN5%2BY3C1Hs4p0aHf4dqK4rAdh2AaCxlxypwOeWEWV3YpVKUbN9z5B5j4VoHWNQmmPiXoqQB7W1RRQyRRQc4xDZDlfeh0%2FXKE%2BGDQxKB6F8tv3mBXJXU5%2FyTHQogjOhqBv02v8z92P5LIkYv8%2BD2%2FC6i22WRSkPeJw2rTPwMoeEGKVQbgJ%2Bkhz0VIOZsNS7bQw9VU1AtnPq%2BbXFPGL%2BKXQx7rUyGdAAHBDCgj8vPBjqkAaSE3uIZsiprdsjJrx8fRZf9%2BRvLZ8o329S3SL74FlmjoeiY22NPOirDKA7pu%2BiiGiWR7j50V2B6WjRel6J0ZqzFvtO3T7SJxJM7bcG33AEyQtS8fN1DGEoDaOgOGV%2FhxegdZC9weaeLrqJ5AiscV6ydOdYk15WAmqsYIcMQCr84omEp4HXB09j4VqZVdzQSOmfyyCuw1YOat5zxmGA4JKwgAVuS&X-Amz-Signature=b71cacd1fb50f6d670b26661f1c9c5c2013495e15da29af7eaab2e3305bf7432&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667VGHMIQW%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040219Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIAnCvrgHWIgk7LlhvzbgSV0ri1ic5IPicJxxMcl4HEFyAiEAkUc1sFkAxdiPLyZ%2BX8Wf6EQyRQ%2BSU%2BwvNBPs9pk1b9gq%2FwMIBBAAGgw2Mzc0MjMxODM4MDUiDNbvtqXY5HXXag9etSrcA4CGNunkmpGV521GoHFdSifhT9ksUJ%2BPkDRZWrd9vTkvyhNBq8%2BPJHogAtgCayyZrv9YH3kvLep7Rwzn3U%2B5AfIgOPF7%2Br06F1MxfrIivi3i6Co4gcuyzrGhk3xvMDn5c8nypnZbmDqZX96tLv9WFE44dTE1X2d9gPZ0LeEsT6haN9sCcPMm3uv4NKCrNk2PJe724FmgTaqc4tc0EZTRdPX1pILDSOQuRi67%2FxafN%2FbFH%2FKWZMg8CKfzNBq6Vf8%2BaV%2F4fuyHNooTtlMoMdpHBNBIdsgXYoERb%2B1%2FVicbwTc78xWX79mvDD11pUDFCLxhnA3ysAd3AUsgFajnelGoIZR%2FkTUbgijdFkQmciBdoP8cUnNRaJWn4co8N4LofvbVZnHZVF51YBjqRCtfbFYxIDdRTmM3bny2fjIMfmj7DNXyGpERw0qCnrH3jKtP5eev8r3HCu6GZ39jLNO%2BbQYHFScuzZu9u%2FaveJeMPSwuiAVIqxxQC6ug%2FAfimHNqVSIkWHu5kLE0kDxX0rzc2vl%2BZ%2FL698GpxoNe9GbbJJBTR8phz0%2FHu9cIZD2AeqYgbGPqfyMmhXHEs%2BRJcsGtnGe6Z77Sw3RmCDHrVaeJzm2gacWhN8pZjCy5WLxWMZbLMOuOy88GOqUBsPij7ljTOve4zbZ%2Bqg%2FherCMUZxE91%2FNG8kn43v2RqgDPZtOyS5FKtc0vKST0dmhQDTC09%2FYLtKEgt4FlSr40vKRKEnUXuL7dBqBIKVawMui%2BIht86uqtXOrNKn4iVwRgTAkgdRD83E8dRniBrqJr%2Bau%2F3fy3%2F4g7P%2BGHwweI7SlF83puz0KblFIUA7vKkbTh3lcTmKuFZv%2B5VqmlYmhG8JtxEfc&X-Amz-Signature=79e307945281793bf455804cf6b6e66fc975eb15cc9887532ea3138759b57c52&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664J2EXXU4%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040220Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIHhuEzLHEimDdLacJNU480qaZlmOXJWl%2F3a3qKTJ8%2F7IAiEA%2FjHwI%2FcLZE2ZQgq3m9C4VWUoyrECgN1WGSJ18413Iq4q%2FwMIBBAAGgw2Mzc0MjMxODM4MDUiDO67BVc%2Bsmn6xiFdgCrcA13xn0A4oUoHfgql8IFEMHBJEUJ6plrEqo7Fc1BBLhkrEbss%2BKEoyxTX80gDh3fZ8Mtzo5GD0Cqg6dDS29Gj2wbRbgwGzz3Mc7zUgBm0B%2BtlWgofm%2FnZS96ar%2BV7Ea40pcKKdqflxoo4OSoGvjO%2FyW%2BsSAtntBXyqDRPAsgCo8ZF2zjkjGnl0wEHSwnvX%2FzkTPqaxwGzxVw2bspyBh1UgkBGJlQ421A2rVrjoAymQ9ZynKeCIL3gbBUpLsohyL2XLR%2FqPJt6KO6K%2BL70RnOl2iCwcV2JlHgaitbr%2F9OvOxdn03qOxwoai5BBwyJDMqPVoTR5m687QLgesxPSyK6IsIYJ5zm2rL4vIqZGhrdMDaaQSotbz8VYuDldPrMhB0GT1wORX3TOvKvyc%2Fw4zICsORRoXHUjn5vOKN8NUsI22pw6UtvDvQJVSwgcj5CWqmh66hFHlhR5kucmfVcI%2FqlQ%2FJUrZMzjewhx%2BWlW9wYLcWYIX%2B1ghc0LPaB2sdPraq%2BGlk4PFqQ1HpH1oi%2FqEhthAyttsT9vXX%2Boz1%2BqBgkW4Td330oyBLJ123Aa3Fjk6GCavR66qS8whgEfoyKEw8Sj81ScxAFxWcFNApR1Px7KH9ccy%2FfO%2FL60vKxFLO19MOqMy88GOqUBfsSLf0hM1LqMsQFsTPX0rkN3clU3rQ7eTOGWYYWaIosnqGz9RS5xMdGLmFlTlurbmg9K%2FzdrYsqPyMcrlyji1Xlyvpvw1XWPN0dlPSTqd1W828huwutdMyd8adPlecRryRJYmjsCwCfSay%2Fs5xSFlGjZ4dYe4asnqlHSC1OwGTycwq0Usf1ggRwXmJOwlCy9nVWlxZ%2FiMc6N%2B6bgLYCS6%2BdFZrku&X-Amz-Signature=a36504c3e487367fbf1ee216345d2da55025341d26da533d4fce0ea0f42dc5ed&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662EPKA7Y7%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040221Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQDBWsbvJ%2F9TuBXl7bmWDacjHNei6%2FlLf63RYDu1zRC9YQIhAKzGB0YImIGWrXXkyLz2JQj7C23yKlbbQNyA75XftsOVKv8DCAQQABoMNjM3NDIzMTgzODA1Igxeo1TXd5FTnGjgzbMq3APL9c%2BHaYGh8i64ZOsOBCyHs8cJecjXDVlN%2BIG1Hx%2FJs92NJOcfQMzuhviVEF882muXyOW5dSuAj3fWHTMuOrDdZB0rFvKtj03P4sx%2BmqfqwnZVxsnrup0TOdytYWsXTXsRy4wS5VWvAftbIkIe5cPS1Yyao8lbBRN4OpjLBJ9gItdYyPvLlKXLklry0lfW4zqShLqygr4C715wwOFLx5al%2BPXG4PGQjD7hvK2A5DJ2%2Fz7olGAfLEqoBh1pmsDRiMYCdJT1pXrFYTvsA3WzruLXKcdHNM7raAspKcEADJrGRvj2g9TF3SugnwNaHffY%2Fs7r9Oee1X%2FFlfFh%2FnAiWltcJp3R%2BINs5nx6I0zD3dhS%2B6dm4S0I8yq9o2YAch6ghlLUVZ2Dwm%2BowxSzYgqFMfabQxZ26P%2FW%2Bfc3sLPvNERa70QDv2VWVzMNxdfdQ9CzIGjpOKNvxHbHw39LtSjrInk%2FepHPS8K2cjzAd3VfSAXmn3nmUtIDUUvzGKIiOxiNe7%2BJ%2FTfb6KThDHnr91WDC5IiSrRUJQZXniH7BqLx1l30KnB79GF1iFRPVywvWxLtneTaibdY7EYf4fuLwqGrUYm6DM47%2FtAtqB4adaIrm1hB%2BPWlNvAJ6lFxHFcKVjCkjsvPBjqkAWyQ7mNk51dtuspbwwJ9duVJyr%2BDAi7EqHXxMNyR62gJpQfn%2FyyMb%2BimCYGTNnjTXJ%2FYC9WQpwPCKcHAegEPtlfbynUjltTrCLdxQfOh9Dzc3Tazo1F2jP%2FGY6VvoFcW4gJBhu3gEA34wxqtzZ18JIRzzK6jOl4JrUhkB%2BdFgIB%2FsIbtwXdah%2FjmjoEIMPYjxBDs2IdDNXFN8qmwKWvAf6nUwyX%2F&X-Amz-Signature=eaede78221fb69d5522166a79c58e567bb05e8ae579689d22173a24b14c35fcb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666JFEHP4Y%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040224Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIQDxBnRkHwBnv2ZvxbsdkknD0KqBiJ0MQCaN9VHqN9UxXwIgBFJj9%2Fnh2163nNAKhbDdrEdqzU55ICNCBMmRwIZgYjsq%2FwMIBBAAGgw2Mzc0MjMxODM4MDUiDM3t5MGXy2ASP7be6ircA%2BkGJB9NbnxLpO9w%2FPVnp6Jy3Jp%2FuxugIhkr%2BIf4E23MSjdmbHQY%2BLYrlSm7Hg5SgtN4aViA%2B6qwURlfOy80dFOf4YELDvZ%2BvKp8j8QqQWdyDsgPOYnfiDohq0ppzuJkLIZQBVbJ7KjZz1myClbfttlfpja7EyiqBlMuiSby0ZAeNaggGl0qZm3aOc01cbClrhrVYw%2FnumW8mXzSIaU3SNx8rvyYkPeQwNtuC6FNxbpMAju8bIb3qN8pzsu6Iwe2eQ60%2FwkOS6hsGuSl5hQPmqbh60rOGLHTQ9VU30uF0c2GDX7vcosJZv9a%2FEFee14t6oscOdYHSTt9pvdAqPAXQrz2PBkTO73my4GhoBjjsac0I%2BYp%2BeoDWgaMuFk3K54YNEQJ0Qxed9na7oArazheds4U85bz62%2Feb6ugmxY3t1mVFr5wvGOpvl0e6uVM5kuh5sZ%2B2wboP1Kb4mEx5nOZIxrcOXpGOJ0P1%2BnqkjNLswuGpowCgyrXOfrmLJ4%2FZbgbO7zHjBHUt%2FbsR5CkZK8CT4e4UNEYxTVXP7AzPN2itl5UWkUuLf%2Bmwpo3QhUrxU7l4D%2FLwusPim2oSejnhoHTo44ieNb8xpo0Zr0mLytJKEUlDIAFHdNlmHg0fM2RMMGOy88GOqUBeM2AGB6UY3EnjS%2Bn93oT6retdPKSw2Z%2F%2BfIuOoBG58Uq2jx6KcTRD9L2CeMRYFQE60rIM6Ic0RUwss2OgNdHI7sh8hC54O3HR%2Fc2%2FE28%2BMpoxdT8a%2Bqc4pbzJfJhoE4jru0nYkxprLHszgsPGX%2BzL06%2BNWPeZUUYKZkYuRnmHVD2sk%2BiXsWLqCIKz2HYSxw4ooenX1dPFo68rJ8un8Zhkxbxx6tz&X-Amz-Signature=2b2b1c61c964a3f117e6e839c445e59151160c52326066ef66504035727ea47a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666JFEHP4Y%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040224Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIQDxBnRkHwBnv2ZvxbsdkknD0KqBiJ0MQCaN9VHqN9UxXwIgBFJj9%2Fnh2163nNAKhbDdrEdqzU55ICNCBMmRwIZgYjsq%2FwMIBBAAGgw2Mzc0MjMxODM4MDUiDM3t5MGXy2ASP7be6ircA%2BkGJB9NbnxLpO9w%2FPVnp6Jy3Jp%2FuxugIhkr%2BIf4E23MSjdmbHQY%2BLYrlSm7Hg5SgtN4aViA%2B6qwURlfOy80dFOf4YELDvZ%2BvKp8j8QqQWdyDsgPOYnfiDohq0ppzuJkLIZQBVbJ7KjZz1myClbfttlfpja7EyiqBlMuiSby0ZAeNaggGl0qZm3aOc01cbClrhrVYw%2FnumW8mXzSIaU3SNx8rvyYkPeQwNtuC6FNxbpMAju8bIb3qN8pzsu6Iwe2eQ60%2FwkOS6hsGuSl5hQPmqbh60rOGLHTQ9VU30uF0c2GDX7vcosJZv9a%2FEFee14t6oscOdYHSTt9pvdAqPAXQrz2PBkTO73my4GhoBjjsac0I%2BYp%2BeoDWgaMuFk3K54YNEQJ0Qxed9na7oArazheds4U85bz62%2Feb6ugmxY3t1mVFr5wvGOpvl0e6uVM5kuh5sZ%2B2wboP1Kb4mEx5nOZIxrcOXpGOJ0P1%2BnqkjNLswuGpowCgyrXOfrmLJ4%2FZbgbO7zHjBHUt%2FbsR5CkZK8CT4e4UNEYxTVXP7AzPN2itl5UWkUuLf%2Bmwpo3QhUrxU7l4D%2FLwusPim2oSejnhoHTo44ieNb8xpo0Zr0mLytJKEUlDIAFHdNlmHg0fM2RMMGOy88GOqUBeM2AGB6UY3EnjS%2Bn93oT6retdPKSw2Z%2F%2BfIuOoBG58Uq2jx6KcTRD9L2CeMRYFQE60rIM6Ic0RUwss2OgNdHI7sh8hC54O3HR%2Fc2%2FE28%2BMpoxdT8a%2Bqc4pbzJfJhoE4jru0nYkxprLHszgsPGX%2BzL06%2BNWPeZUUYKZkYuRnmHVD2sk%2BiXsWLqCIKz2HYSxw4ooenX1dPFo68rJ8un8Zhkxbxx6tz&X-Amz-Signature=24b729cf8134e642a8507529c46f69d4c5b03bc775971f0ddfec9e7f8c74e1d3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
