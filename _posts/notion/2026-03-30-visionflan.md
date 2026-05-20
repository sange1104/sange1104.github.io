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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PKTPDYZ%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043545Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIQC%2BlYkb4OUm5CinEWTTQvN%2FuA%2FuR7tYDC7OQTR5aPBzGAIgSFQCCHU2VThw6XD1%2FWU9%2Fg4s3JpI10OvEmgkdutLMdoqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGlxNC%2BxSbihDkryDCrcA2F6c7EL%2F4GL58RU4UVjui8LYYBKwnneWkWytbGA1Ca7ufpv6z0xNqA1udmFg3GBhTRvrWdfd%2BNMVjDLgfh3h90HXu%2BiljsQwQ9LzxXZtnT4yaB6J4hYarapcc0ZBRP4fKU4H%2BjLGcViqPu7FkiQO1JiSxQzXg9QGh9GAKZUYAk%2Bz0MfHS84USIBM7YtoThmPFTY93x03bsIeM86II8FSuU22AgGyxXvxENvMjHetULye45YFFjjFiHHm6K7gNtY1g8t8PzOFUxqSYUgf5XWgJxDXm2gf1C6iDjNK3bxnqfgBeIIS6DrK%2Ff7g0265sZWqRGWs38y9NiTRDifSEIplwr6HJNmRP5bksb2apx%2F%2F9k0E38jrbvZKEgF1sWYVT4ed6waVyFndHBJHNSzvQmQ1D%2BzQnbMYghZfHDaD%2FbaTh1mzSaxui4a%2BuXDxsBzGvGv5c5YbuQqP753jIciD%2B1f%2BqfMk5Pw%2F3r4%2BG8B%2FWPdcD1ObfuuURJFRTX1FcJz1p%2F8pMrm1fCwZ3sbKYvFbUYbOpIILvFe9zGyOLieu8x6CVSgZqAsWDLFi5AYnE1QJFSWi1n1DX1A6BD2pX7SaGG65YKAOk5cPTxau336XuCEX5njO5zNfUv6yBImlNK8MMvatNAGOqUBk5apP7VRF644b2hCe1M5Vw7Ey05Rx0btW7P8u4K6iQjh2yfPAZCmYn02PzMG3FDjNmKmr49Ap%2FYDhLPWt%2F%2BZKTWneuEF2LTWgplhdU24m4sp0Z6%2FRMaMmX0KZOao6ZFaKixnNiLkR%2F57%2BMw%2B0%2FvSWmS8dPIoDyiXhcTQmWhnm6pEyFIhF4WW9sOippKIXcn%2B6M0vGmaGcNkb21LymKeWsg2VprUR&X-Amz-Signature=a552027c2a3a2724ed5777a8c569b1f40b511ecb5b77108cfb77651942680cf9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SGXQ3RMM%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043545Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIEAjte1Co9zx1pkvn2N%2BUXPRTVcNRBFqP%2BQ6Evoxhe5NAiEAjLRMLm2aGaUUrWrjkPO8zi%2BK8doI7MCwv6PayhA5V7AqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDE%2Bn%2BtjePOBYlHB84CrcA3CI3YSdRniwjIw8byfHUIbsEB40T0EF%2Bk9TgFArHoGIviv1deA%2BE0YmmcM%2FmB4po%2FArSjmLn1SJD%2FcuomaY9OBu%2B293SNKLshFfE6Aj6qkm6AhC9OhwuXrc6Pz0Zt0zk%2Bm2TBw%2Fzbc9ShKI37hBy%2Fo%2F3tpNHG7rWjOkCGCBcavSaQhiPXMUiQFW%2FThPtn3kh%2F9T4HEOqehYuIzRlpOO3k3VCKtKFRegvmboJCV6MmGQI8Mmv0rYzwwBTBoTYK461z3laaAdqGryhz5f7JCoDo9UQoZDKYpvNox0LiYBjsH6NShqoQCtDqv6B2neLB1r%2B2TZs8T1TgY8J2TFrGUyJZQk5CR1sKp4koUlDx6ykEC9w2E8EA6%2Bwx6mFEdb8AVcS6TBuJ0i4bnIuY0DLkkKdhrvdyZcmZfdONklkL%2BLFLIVYJKzLRn5BPBGyaxBc9oSUijtdI1Sdjor0ZghE%2FAlRrIEoRSa9TNiS6%2FGgSBf52OtjZRCxFuHM27v7fjiyV8mv3n3LaOSOrOSBBTANCnRmWHtjvdwJhKBoD%2FBTLKMzenX1sTMrCWB%2FP%2Fg7i%2F4%2Bx21YPXBd%2F5jG6z0sBb0%2FWCgGy1CS5L7hCcHiV84La7rxSTdfHvmjfy4%2BOOvpACIMMvbtNAGOqUBsqQUCWsh8bG5xGISlGsGG3GB637S9ado7%2Bhu2Id4CIvu1NLIsiufom2c6yMEdtM0MYT8HP5rD5mxFiFfoW0GObRUT4%2FTmZ3gogH8dqMb4p3DFHDppTfLpoi045hhD9JiyrhdLC5SKQBUk0hiWP%2F38bB9MiHDBqzas4e9K0IvdzQU%2FHMHvOhNmoGFsG5Z40YKOEBGb7MugFmPZE2I%2Fz%2FSFGyJ8NXD&X-Amz-Signature=35aa861383140da67deb3b17bffecbb33b69035105d178a56a05ab6bb75425e3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S4I33OKR%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIQD2Ua4zlyMNon91fQQv9Z%2FT3pXHrbePXiQykfX7Z9V6WAIgbUMBWXVZFMUyj76hxToh%2B%2FbzoaSCU9wxH7CV9hFbt3sqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDnMjJjMDbWy5Ab4BCrcA4d7jc0lOQqNWx64vh6A1O3BmewGgHcYKYFiMy0uNgyohpx2XP7Y0WWRc1AI54HAZptLpLRq6VHnEYnVoFYIiHJSikenWv9SAxTLKtKg5EXViiHwcTcApwKfjC9QclTwh2cXbibth%2FKmTCmYkTgWhOifAhIscKe0G0dUndclmqGAKlvcHu2%2F%2Ba3Y0Iz0cCt%2BFP260js9LWjOsucF0KjALF%2BFPgT0l46ExauGmGUK6Jm3PEsjLvNzxzngP%2Fc8eiobVN8WQkZzrYX%2FIQzKQFZRedXwAXu2%2BF80uwAMeLhaQZPbmcz%2BwMcnT%2BaaJxRci%2Bq2ss9vjUfDeQIrSleIrgH2fKiCZ0bDkkM0mUxfJN62FzsmXLcUXcdM2QttQEAu7MbF4E4YW9ZGnNLwWl%2BLsnrlJ8uM72W0zuvDsS%2FY5nhgJrSIHdH5gQm2DWKlMVUwciw82zUqsYbvbWCm54aLlfL3L%2F6Qd6hIyTUPJBy1Ev0y8ZkfuMnhl0x5XrU%2BryYJ6nMD0jJkUeEOOzN3WKYH6d8C1FAUFQWWqGxYt5%2BYEM93dRcpymFIrdA5GZrinroWypLB7yE1VkiCOu%2FfT8RMMqfFs5iIdcE%2FfwXhRmJVKGmoJxFIwoYQBPEwslhEL2qWMJzatNAGOqUBHA7vzCWQ3Hx1MoRKdvcnA%2Fmqv4UZweRnGfQgBhecAMhSp8cwv8OZayWogeiTeovdSBf6TxEs5zYoAhg%2Bx7qMr%2FpX7hAAOZRyzBCIZNfymakhHlYihg%2FEb%2Fuvo2yhPczgR9mH2ixg2DwTPSzxysg0YXQ%2Bv3vB1M7aRFxmFWYLBTgTquvd5VsnVA1Pbe9ylU%2BShz59xb6R4gGOAhO1rDsDetPHT9HX&X-Amz-Signature=84af5579cd8f7a9581cccd6e28caffffeeff9a1b353d760c5223e337205e9bc2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665RYBLVMI%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043549Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJIMEYCIQC8xCQH8owYa4jq2uxcYQ7Uf9fw1Oui5vqdvs8fQklAmAIhAKCslvgBXEl5pGgWL9inPe5zDZpREGFQs7DVzU3pNZk%2BKogECOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwioDglGIuFtk%2Fa7P8q3AOZNcSRZ6vruwwaQdpr2Dx%2BT4zRYHw1CmonBWdru%2B%2Bmr0wPhOnn%2FAFV4VYAzxYEV7aiTre%2BKc2GBSnCnSdZcEplzN%2FtTe%2FCCHJ5zTRBW5goJQa5ZP6%2FNMMj7z1C%2FkFwFJeBSBC5%2BH3IwDWe5N1CA4A1AJxTXo9rN1E%2FjlSHSEoOOSRJo4vmIpb9VzWnUFLga2eyy6W1YzzjeqfL5AAN8wj2nu1%2BQ%2FubRZ30%2BevXSJ2aNUNNfiP2%2Fdnia1S2pJrxNlPWKsWY%2F5yh6pH2BOTQoPN%2BoLnC5DEdFQZTmdUxrGR7Z8NWTqgzxM92bSuFbKmmqF27810vUlljKAM%2FfNl4Rq2csY0CIUpV%2BlvsZTR%2BzNyi8M4CM823LrECA0Y8yfaSWmdoR5JYoxte80O4WhRKb%2BWgifIcywksumddHOtkSDq9KCARlPjycyWn6VUDSqPf6irzU7V%2F7vCVeSyqGbEjzsbJg8FoTiE2GCrQh%2BC9CJHd8n9a7k8FQPSEKeQkYLJ8rDX6RoE%2FDUyJv41pPJEzPBEGQQSOIfFiMVCQv5r8JVsP1IhLm2GIhjLxmwx0xf2MFYDtiP2r8rSDP0mAYNXE8WOfqIVGjCctWevPp68jXA4JlOcq55Tp2BPLFZXLYDCc2rTQBjqkAcN%2FapPBsqnaEQZCUjLDgqSx8EvLrPZEtLETZ7ax9ZxbK9vtgo%2BA%2FOkl7yLnTk5qaukHeV611BRHN8MKSbe1Z9SMCJDZ92Qxbo2LGyadabg5BsxNV%2Fi7X314aTQwCvG%2FKS8%2BKoqZaq7aExpZOg7r9gqeaqgX1o8V8kmElKiQFeHRgILKWtngpqyK8SXNnvA0oQ3qq%2BnNgs8bT6k4L27qKl9xeZKx&X-Amz-Signature=3d1a0a8c6211e4abcad8c795b2effd75072fbf5d0e8865e10a3c6ae941141632&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U3RRCCXU%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043550Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIQC8%2FOWmQDbWzhtqXc%2B97fr60F7Bnjchfbl9lZTPS1Z4FQIgA8RDflFVxaDVv73lWuGP72kuKURsw%2F5gLAAL3kZJgRMqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOsKFAHLVdVpXUl3AyrcA28jcWZRWRhTHq%2FGHCCL9nF1kYk80t4jky002NvdqB6zL78EubxG9kw2KsNgi0OFLjg04eIUbE%2FAty2275fWj739muK7JI5Sr8pjQYk711b%2FecRJ%2FddE986enZxoziDd2GBPOPCIEt%2BYjlZDBs0L4DLkWz%2FetmrPUFUdnN9A9%2F9bb9pxYsHcWNSzB9F3y5F8yRwoHRYMGVhr1l55bigt01y7ZBVCUjgey2FbrtsdbGyeEI9yT4atT253EcuA6OwHk3C%2BSXZ%2FhjFeRd5XlEKXtXxAKgdQPS3PZfbpIIZYhU0%2BIFgRTsfNAX%2F5PTQYZ8HjOLyEeHQCeZwFuK6lykVmj1cUS9JCjYMM2P5WHHS1SGf%2B9lIAG0%2FzBqfsrtvkHBQ44qNBLZGAb6owMiNDHS0x%2FMdlYsN1yivGNWyjA%2FCoFNTVQK6X4LB3cPlMlPNqzvsNIiafaUEVCVWmnLcoGWS%2FWJ4W5MZOy4PnEfyqWO26yPTTVV3ygPwMIXZNfXNdhjtUtEfQsdNX5K%2FHO9C6UzRCG2WyUvJ%2BquAbvLVpRhxYIwG%2FfB%2BgrBgyp0I4yWjMPOxbOmLwL4b2VvJ04ooflj2aCzagRWJkLjfz%2F5lF0xGLznqeArkfo%2BpAJre8Hjy0MKzctNAGOqUBuT8gt6ErRSst1EOX%2Be1UlbWjp8tDzhAq15vu5tn%2B%2FAecLLPIigjflbGt2QPLC5u2jN2mbSmaPFsGev0Su9PdLzjTSORfeoWPCkBp7K3zRsQJ0yjegNAkkNWzrzvLIn%2FXoFvE38mPaKpNW9wr4oGwITWkRJHtOmpQF1m3Stb4qM7Ae3d7lE31Wsk1KYcTyq7RhugfZ2NeUUXXPgJwHOE4zX2lfWYP&X-Amz-Signature=6d069b1dab9f3a6646a3a7b6fe435afade857ee3ce21a1ecaa560e6f2cf5c293&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TY6POWON%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043551Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIDUq5EXtbqsYr96QSf4qkEnmDif0300TcMzIpxomFmmSAiAKa02zS7K%2BktnevyII0F2RdHN5R3S7s96CuNQFewkRyCqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMrn5e0EpmYXthFiGLKtwDaINlKtWDNVWGSFo1y1BrIThn0tc4svna1FYDZLshd7yaYWacdF4Uhkwb4e5yGgrfmgncWWhcSQrc4RL3jt2SAOQ%2F5pFcUjKw8DFgGbqXynYF9iKotAwP117Qrvk16OtfwFF2Q7U5DSjcn2JnE60fyCgLRRgj30OJw9zCu8HL4m3AN%2BuPfsk0XvuQ7u8qkL9eg1EGnPz2ILV6aEMx9RRXhaZcSYDyJg8qU0sAuN3QWjKxucwoaXnYGbgLwTqph3p9iObs8zXmoYsp4w9noM0JMpOwwq5q2YFu9s%2B48mPrnB4fkXAvXz7fJ7Dm4UXjF4CB3wfT48TKsYI9xC3hr5rfAl4m0G%2B%2BM8to%2BCj4Vd8okEV2tWiraTY61lp6ag9sG9BL8hvEhMDZ%2BoFzmRsCehxorG8Jz0ctk9Pah1kegHQeufXOVJLqFFRqKMsWdt9zz91IzsSFn0w%2BvlBlxoOKOKJY7sVUn5%2BwIjTPh1QM3xkgoQxvIM5Ly1KN3mPEKu3hcze%2F1oi7lLotr82LhK9fD1yx6pYmvnTZscQyhN9waV2ulohRUwJPkqmJqPVW41qouTGdvYBNG%2FBCK61OPVcc6JWME33fsISoP2g%2BA1jdFKHh3%2FFv4SRDNPh4yvAA9OkwqNq00AY6pgHd6DHHrDtgicdRT9eSpPW54jRrvTp%2FzTuq44ii7irCXqAF91f%2FXM2%2B016vUfi1liAaHydqurK97TNP9W0UOJQFCtMS89FgP7%2BPhg%2B3mVPj35jT76l1PeeEq7bCTFQziv46is%2FOAdc%2FYWLUltyKxIPTIurpssOyjMzbIHWZM4Xv6tFXqiCH0vzTA8LFUvzRE3gW03ZBSrLVhtGKP1uNHAm1qGJYHC3a&X-Amz-Signature=aa0037d0b5eea58ae66c26bce0ee497f5fe0145608a28e36853c0af900895ceb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWQGL3UO%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043551Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIH%2FKnOrUfGKgd4shp932VXHgZ6EDcvkitzw4ziP8Fn8mAiEAvQbu1HMeK8xipFHa0Q5Rkw7FOsYApR4r1oJf%2BMc4xP8qiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDO%2FUljwyVLMtB%2FdxZSrcA0vbWlRAjcZMtNJOV%2FRA3KPwDNtMjc%2BATBGgjZBjtHyXaClxaAVxqBZIlZe1uhu0iTl1kfUzYtBo67RNpcj5HZOBKmu2FHTXVI4bsQ8UMp6YkJMH3Hhncw5T%2FzmZoPR7lRBLp2FTDwvxpyCuQuqc4b7nWmaGvtzlsDqRCsSCBYDdmIwTG1Dj5bOG6yWpta0HA4UkjQvKhZ9Toj3n4fwzurCo2n7s1B4wC%2FjsIUqePHJ0SKGDshzDdoSIZeIgBPkoN9L6uE1hfTHLrlKNM3npdS10TPjOYO1FQf0wk4dS1ZY4pRNADqsFfCiBPzbo6pelW1STfg%2BNWfDPo6y4W%2FlxYxTx%2BJvZg3%2FABkBSir%2BeUjPljKax9TWCTGCJmxYr5kSfsDe1Fg8fVFjfENExsdH27VPPepUNvfbfVF0fr3yFzSDZB4ux9ghCcOcY38NBdnHRPJEo5jOxCIIxb%2BTDmQkAEujfkZWwbiaWzjNvUbOsVp3WlH2nGoqjE2w0T7kjNNMoaATjKlCHGl2bNCtyheNjkbVhazjn2SX7%2BV%2FWAlVPEW3Oo1Sb57ZZhnqVmfMfbb9lNRliFwa%2Bp3rpYMRhVuN2taZmPD5Jj2L95PzY083l4gXpMXeeHRrZXzlJ2qQqMLjatNAGOqUBRHKOXQYfLjWK6dt1QWhOvyRotC9DUwTZbhGnCpsdCcLDjJNRKmko5EdoTJbcR%2FphjE6oEE4BTMDCD1SC1bKtPv0zSMtb1ju%2FJLS8BCYuEaugdNCtMSWw8mCgRVVFxnuyz8lfNLG%2BOqJtIq5zWj1oJOHAglHFqZe6uVd2KutMEKFoKMKOOaSl6JIMJdV7YAYBGNFqHK%2Bd4XKmwPhExt%2BCErvC271d&X-Amz-Signature=82ea363c2bb8fdb4dbaebfe3fc4222c9a2befe1bb0743e8ce9032db507b8501f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667MTSXFFK%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043551Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJIMEYCIQCJzBvSgqTSGejMY8qWKjtLSt6IRhxoUYZ2y0KG11JOWwIhAKei5SGYYxsIIOrUyozEpdewinL0DYk9MGwZI8rgu8wRKogECOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igw%2BBhRap8O%2BDBA2YoIq3ANaQALR5cljBSJpYMAOPZGN7ozR1qnQdthEVWsvYHMiOnO5r2B0GX4XVLjJS4LGRnPrIGBjXM43DwGGg4kZzqb3Oev9iwzwxe4HKCufuMWxWM3vz6uw6UsSbBu50i40jdTGWEWtgrHEEYZTnZypWPlP1fLTplchnBQfOhVqqaOl%2F1Jq%2FNCD%2FBwBABHVXcGL27GyV4Kx7FQQKkfzI5TxxinHi9VUNEqJgoH1fJTyEZsqPx%2Fx4HEt4LipQfb7xpCDBm8oNuo78xwqNkduEhtvVpycWh0guBYwTH9T8q%2FVakMpiwszS2vDFOTHZKcpJPjDy1rGWhjNVe1myTaTKM9VTCBbOGfQ8D8wulYQrifO7Lz%2F563psHb3CXM6Ze8Q1iuyY3Y2rIRD7AC7XtLCyrF8eSJ4czznfuMSQ39FQRKaCTrlx%2BVN7eziAkPnZp%2FmwhPmZVNZhY3hvreWISYryktwF2iRNZmOh3bT4bOEOwrRUHTTyqjMnyb74PDicGfrPVayk2m0g43tg28g4tIDQRaQq%2BDBKhw7erTPaQ7lTH0%2Fi2fUF%2FEmzH%2FouvJjJLpqCiWHmP8mVtFtdNMrKmLd0XNfjvaDA7L9E20MzxmC2%2FT8ZNutcoN0xywkgdsiroGq0zDE27TQBjqkAV8OLdP5l8UNhCfpueTB5zUOCf%2BHbSRCqWIT4VwMXuov6X%2BFThCXF6TA%2F3qULZE33AJ1O5UNQvLCZxlo%2BJY6kzQ%2FLnkSmqNDokdO97F89xDvDmF6g0vUJhg8%2BBN7CLfStWrn2j1OJObeAgTOU6R9MK2Auf4IAonGWY75X3nGqYOJiU7vwlgrkSDqkt2wI3Gj2M7OlYzogQ2LexmAyQOd%2F2ml2KBr&X-Amz-Signature=09885f347c6d1da555fa72ac5b70429e455c97638fd4ea1bdd99d0b387358eb0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SSH7T7VI%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043551Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCICrnhRSe%2FEpl70Vg2EcuefS3rf4xsf7NMSdDIxQYqWT0AiEA00MvSWCxt9G4IzmvIjofRSv0aWcJwIcEpDEHG%2FGzYq8qiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKcUV%2By7WJ7L3CnNUSrcAzhHPfqa8Lq8gauqbMRxUBdTisrzzo%2Bik7l2JChSnR3QYX%2FWZ%2F3d3KUjbTJOiKqjktPNeS1VxDEBq0sXjI16fP%2B4sJT5sP8RBaYhKbApn4TgDfhBrty1pq%2B2q1GZwOu9hgnObGWPDFFC65rRIeKEGYiXu%2BHkfxdjQMLZGghyZ3ptmgw2gb1KcReMktaDPzXI2n3pP%2Bn9if5Gb78Ab8t56m0xcdG%2FWSMN66zLJqyXolrGdyLyhzUADY7J8n8MVCXT3%2FpOEyw1XwmrGeGevGYJPksi7oc18BTzcPsPWhmfKUWbUr9JW5Cky8nHOmqNdP046XkN6a3cNt1TAddPJYk%2BKcnh1KKyvx9mHuGqN99MVljalHdFLh0AeYAACZ5lJQ0hrEJxEMap2BzsjwjAyWsbzoVmuvN9JBzr9rAfuP1PBsHygKcE3GpGXXA57jAgzTnMkkpgKDaey382hZWArh%2BdxLydsoAoPPbTcjPbuNsCIf2KY74%2BL%2BUBJpf9sd%2BqEWK82vewMCUs3qOlielBV7AdzUqLIPGRFRvdSD9gj6OkwkeyqyiHwRi8FHw5GpXTlp9uFc5o%2BVBBSJBSjRnpf6VfgL51VEDAL%2F3TWwV5vGKO7ajN4mHcRIL%2FHAdA7gcYMKzctNAGOqUBN5diP3%2BhcKONA8od4Ew2%2BGarga8xiTrbzPNJ2BG%2FIapk2KDdesSNaQOiWIQSeCt0vNTaIC3nFoeRJC2l5yJeOEXJVm2JvZe0twsrsTteeTyuEJq1ZB7lc1xW2Hv9crlsJKMhjlR%2FNqnut%2B82yjHDhp4Y44rykgno7jwLqshtYlDI2hDqdZJfdGX5i3Pjz4aIv01lAFtEJPU8RbsBYOFv2AzAkTOz&X-Amz-Signature=d791e4932a6598336f1a615c66f1bfe429ae2dc3fae6df8794d35baf846f82dc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QMXMFU76%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043553Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJIMEYCIQCJQBiQQq%2BvCW4RuyxOcDVSLDg0SD44vyE8yEReUMyq%2BwIhAPKa4CqXn%2FHXn51m%2BRKyC0gGoK4NaE%2FglS2pU7i0%2For%2FKogECOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxC4CtWRpx8%2FT60hzoq3AMJBjH%2BPSJYMHX3do3ke2E3tLFE4J1b4s5hk6xXny8fWqqQVEHUIgzwslLIizNoU1UxnRZYmj%2BjXo1w0vOqmdj2bvLOowc7pu4k1DQqx2b3lMnfW5pjLb8z%2FDwjx4ZPv8Gs9UoOUjUKgPWbIGQKsu0e1nPc4sQcVw70ox1qAL6qeJ50GaCYEarorCxFsrAcqapA9Sl0pReKmqNsqckpnZX%2F7PU3U59ZT3kVA%2FB%2BiMhfFOaqzq6q6ohfeeTgQoCXXcxwfARD5CJaGIIABLGITs2fex%2B3aCeassmL5ZAToJyp4FZXQ6UmE6bMpSm6U1%2F0ZmDpCLb637wk6KtDYkd%2Buz52EXX681g8eDGBpJz6JTldjMbgd5U8iy15Hxk3SAylxGttMbAH%2BdxP%2FmxUc5nzrMsHEFP4LTDNqPdW66pKQBKmiXi%2FwJVDuBYDMZ5wH%2Baq05nugcOrT9PuRR4kVIWuvaSaB0Pzbu4mOd9RcGDaWuER4HVdMbuOH4AnuLVBmw6nhyvQsRjA5kFj%2BDoP%2FAt6vHfnp%2By088snWqKA3%2Fvn0iHMFA8aFZiAcRcIf%2BTi1PlQbXCtqlDzbJY1nIC7J36qD4WGHVgVks%2F1sVrlwQmlEvTKgmNiEBYi5npTXkXjYjDY27TQBjqkAdI9oG6U%2FKNtN%2FWetkhdGQ%2B%2FmFPB5HNHZk7awrGlbSYesIJ2P9XN%2FkI3yYxzwHAxKYannF%2FrXQ1KDXJB4a95Ft5LNqJ7C4Rm9PkWtXUmsM6opfNkewrrpe%2B2%2BkCXHCcDKuo8nzpQDYmeXYi2VKLJ1ghrNOIyjsDFzB3NxRnXj1BPT0ggvYiiBQlSP6%2BnbQCUa88LMZBSM5xog8j6QzEnvEcs4ik%2F&X-Amz-Signature=de8dae22434836390ccf14875aab94e2394abd2e3750b454764f65ca887a5aa7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666A4F43WB%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043554Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIHo7vsqaFW4wwt1%2BJ8RglM1svcgmhR3fXW3BKV0hSqnwAiA5hxbAJ8IMDdkl3nWqGAvTKhDr4dVKeO%2BlpqpgGP0K9CqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMDnhFX193bgyvu8RDKtwDz0GBFJSI4jAcJ6DRAgnAS34o3aAW5OLIFTb%2FsIVJ6Ytpt%2FS%2BmEFbacZov2H4VsDXOjfy09G31gbDtKR2e0rfTmhEqV5VNqfo%2B2nY4%2F9AHio7SUpbm3ibQv8J8YpozLBlkLWgBZGgPhhf7iCDLU3dNQyHGnLId7h9BuqZV6djgr0eOMicPgehiPT%2FBI9IlYWyXlwzfSNfhKXC6Kywgtyc4%2Fnb9TrhS%2FCxc2kl2NVSa2Ldlu3iOwHpeS19vwUgSUHIGX%2F2COYTcGTZVnQoTetcFvLp9Ikm%2BzcrbHfkmMWWGHnwn3%2Bp%2FzA1d%2FIQC9uGiAu0uCS5s09ehWV%2F36WMM61JbVFYab5Yc6f%2FEcEKPi41l9PSVwQ9yiyDYY6DhhRs0Wk2RjuSvI6fUxgc9sjwIZOhakkVsgxgyytOi4MC298uydCYCcZyYzbopC5vPEgsSR%2Bk%2BtbyXbkuzyNYE0PqdbMMstBTewlj%2Fx9M8OARNYO2RhR%2FCAW%2B20wnDjF44poC2DVE9AtvzvGA2O2kNZ1JC%2Bw%2Bspj8EElXElccP7T1yZ%2BXpDEulwosDP28yUCJj9GXzsCRY61R%2FN%2FPihaYQF%2F6GoYiYRfeBSmkXLejM8qM3zjNT31bz8GRV3hKT93ZN4Uw8tu00AY6pgEXqe6X%2BwOUHaXMskh%2BVhbJa0c0cMK1jrv8HxaROyE3sZnP3VyKzPRe21vfBetyihSRspn7cIIfj4t%2Bv1OmFqTZCaORoka9GKK1n%2BBj8Oq5%2FYfbR7ezqRhwNdd7ZIVxmHnIkEXsLT3qiYKkIEP0GS06qdPk%2FOPQMi3SRnDQ2V3hr6q31KgB2wRvmKO6T0vfGRSF4mWqnHPft%2B8ykQO7rsSggDj3gz%2BQ&X-Amz-Signature=a7689546c198e95d035a40435d381fa17b8751ee5b568cca44f8de1afbeda7a0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46633SRSSPZ%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043554Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIEGm3RG1%2BgFJRBwn%2F6a7jRHZ%2BpyHPQO320O6dNzTSfeNAiBX67VBp0kKGW0dkB99NsBVzQh3SwLlVBt2hkpEuqB8xSqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMOWn62wcfUKyRHC0LKtwD%2BYpZPdgeqVpxUp189HtnbKBqbXJ5Lr7VPsOJryFU1v0g4byMmdZvNAdc7raWrghxLxLI06%2BZme6zom%2FOWPPWjbW6hzJthmhg%2FTAXh0%2BJly02CpGsI3QazGsJYc05VbMgrM76X4H3tmN%2BlWNLF75J%2F6F4XKBD5rMpJ%2F77xQZ67EHb7hv9N7Ya9rAwBwm0XWBjYPPEbSIRdIY9Dfmu30U2dS5jI5%2FlxUweUfOfJ%2FcIdYhG7O3vkmtfL7t28wcne33W5V0fxcrc7QJbhWMJB1uSa%2BUlIMEk7MQ69ve6sHgeyrM4UTLLxsCCbL7HqsCERSt7W53u7wPNHUbF6stnHu8nzUfmucuuLaDJelBtwgjfJ4AhIZaFTqKZaV8kww3KtJnkOCDDeoUJUL0v8IIqwLS%2FGotCts5Mfc7ZIFGub8o6T0QitY8clauJPyQH0U5NJ6uSKWklJKqjjY8kyWgyy7n9ZN%2BDVDqF0QDy8QSifIRJGMJFmQ6oinmqMIwSaSZHb3TduzG1JuTa2x4ERnwpzxNal5caL59z7e2sQs8utIusTL4PKCUqaNDzqM%2Ba4ZO5gpHVI%2Bg7sB%2B8x9Mmuz21DS3ADkK0Dh6r%2F9JjdHDO0rhQTnSBJzGmIokn5h%2B%2FN2gw99m00AY6pgEt2StIqadauPyGOfXCnjlrbUKeUN05urEiNIPThETDTws0WaioNAoVUpWTe7vM0yCULyTtoRJo6gDh1lvoq%2FUtocdmVac4EmkiHCMnbXP7uzKdcVLkkcC6oA%2BW%2B4MZK%2F8bGTZEfQUUYvQDMgZzc3riwwzvt2CXhw0EZQtl11bZrBeAgAhv9W4enDP0WFM2yic7E%2BlMi4LbPLKtesQayLA9sk1YiBLO&X-Amz-Signature=2747f7e9274c73984614daafd5f8a4b4637a14a35ac4f2a570de175f124f93a5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQTROAU4%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJIMEYCIQDHlfVmFEIrhgco10t9D2m7JmX%2FKq9ohzP7ODp5eC94twIhAKx8otg2Dr7ZFdeasPWeuAC9%2BwO9A7AGRvt9EkvwmZ6hKogECOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxBevUmGdIrqMm4q5Uq3APTUYFWQrQBiOF8UehWGu4Zd6gHt4a%2B4UeT7YwH3hAEaanAjzr15%2Fe6oZ4oht%2FNctBKHQyvADqOPO9d8xGYSh%2BBAsw4KquqZRrOjbHawbkHBc6bAlhh9XJB6VLz8iIVLxo4XPaLJ4ck1PkPhpTqv08SiAjlaD%2BLzZCqyzD856jFkx3nnF9O5AI58J1zOpfTe9QGHIPrNXCODgyvlSbHWYbrIkFUf88e1evEYlMp2ED59c4HEpZaWIf5OCwqxg%2Bxsn4jQhcgxuFmnHSk5sTHN2yZjvWUiHFg%2BDYF3ICwvxFWa8os%2FnsyBi29YLDzaFTOkkN31orvrENFOmMCL5NI0vMiE%2BbRT6fZk4jWTOp3DywnqS6sDCr5YUAFbIFbZzY33i9RF3i7ur0O72d97iftoWOjjjqDDclShMeWIz9PpZ6ObSN4HHd8pvWm5MIIUQKKo2XeiRd72yhUsven3KOb2mA7U9s1hGTft3jVbQ539kqD%2Bs6TeOXdA4N0veP5jZ33VEIxh8GcAP%2B2V4BYPMNbaoDEPP3GzGc2qnqeGp1VN8GwLEnDopLySGKhQmbo7Gvh3tDVDGbz0%2BSe3YxlfhpnydAAEUAmJUDAqSqz5IlFE16BB%2B56gfxLoOjmw75dyDCA2rTQBjqkAd%2BZKxSM1wrgUzI5KwtVUrCfl41CNg7pyKOpTjJjPAl186wQCdYFghu6OnMFl38Xohc7lKGI5F7mH8%2Bmzi6oKKHt93IAArRR6gnPz4RXM3sMvT33GJY%2FKoOCmoMFa2eOU9Gb2ZYpoyY1ReAfnUGaZNFrEH6bQ2%2BmdjtvmsuSumjoj9BLWDgu6TLxGrqKix5qX2xrxLANAqJsMYDIC59%2Fh6JZpzSl&X-Amz-Signature=ce105f83748425eb88288b21f567bf40b872715bbfd72e9b3005071843d973fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQTROAU4%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJIMEYCIQDHlfVmFEIrhgco10t9D2m7JmX%2FKq9ohzP7ODp5eC94twIhAKx8otg2Dr7ZFdeasPWeuAC9%2BwO9A7AGRvt9EkvwmZ6hKogECOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxBevUmGdIrqMm4q5Uq3APTUYFWQrQBiOF8UehWGu4Zd6gHt4a%2B4UeT7YwH3hAEaanAjzr15%2Fe6oZ4oht%2FNctBKHQyvADqOPO9d8xGYSh%2BBAsw4KquqZRrOjbHawbkHBc6bAlhh9XJB6VLz8iIVLxo4XPaLJ4ck1PkPhpTqv08SiAjlaD%2BLzZCqyzD856jFkx3nnF9O5AI58J1zOpfTe9QGHIPrNXCODgyvlSbHWYbrIkFUf88e1evEYlMp2ED59c4HEpZaWIf5OCwqxg%2Bxsn4jQhcgxuFmnHSk5sTHN2yZjvWUiHFg%2BDYF3ICwvxFWa8os%2FnsyBi29YLDzaFTOkkN31orvrENFOmMCL5NI0vMiE%2BbRT6fZk4jWTOp3DywnqS6sDCr5YUAFbIFbZzY33i9RF3i7ur0O72d97iftoWOjjjqDDclShMeWIz9PpZ6ObSN4HHd8pvWm5MIIUQKKo2XeiRd72yhUsven3KOb2mA7U9s1hGTft3jVbQ539kqD%2Bs6TeOXdA4N0veP5jZ33VEIxh8GcAP%2B2V4BYPMNbaoDEPP3GzGc2qnqeGp1VN8GwLEnDopLySGKhQmbo7Gvh3tDVDGbz0%2BSe3YxlfhpnydAAEUAmJUDAqSqz5IlFE16BB%2B56gfxLoOjmw75dyDCA2rTQBjqkAd%2BZKxSM1wrgUzI5KwtVUrCfl41CNg7pyKOpTjJjPAl186wQCdYFghu6OnMFl38Xohc7lKGI5F7mH8%2Bmzi6oKKHt93IAArRR6gnPz4RXM3sMvT33GJY%2FKoOCmoMFa2eOU9Gb2ZYpoyY1ReAfnUGaZNFrEH6bQ2%2BmdjtvmsuSumjoj9BLWDgu6TLxGrqKix5qX2xrxLANAqJsMYDIC59%2Fh6JZpzSl&X-Amz-Signature=3e4d37415f44536a8624ae06af9799de98cd051cce6915e752657348c0a591a3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
