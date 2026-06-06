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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666WPYKOF5%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041950Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIF0gVGIbTnXttCmlxSjhyAVNIAHyZ1uqzOr1HRK4XMDgAiEAr81xqhHjH%2FbToQF2EgyLs8kpy9c6Uw5zEWtf2FsuLl0q%2FwMIfRAAGgw2Mzc0MjMxODM4MDUiDKbbnOxENjcz%2FpQzESrcA4XJUjQOckWzQbLOAlguxGhKANhoeRmf2wF7SN0u4xVCT06Naez6bizRC0xXE7UMFeks3SZ%2BC%2BPsbLwU8QD2J8WnQYjKLizHWwW6lMEoWlgB8qJJUHvsZM0Hn6URqMsreJAiSgF5%2FnIob%2FsqiXENXCzftIOR7vXkad8ecnJd%2BC%2FdKDVK4HUwHP1aRZk3RDRNDyp4eWnDF6FFlY1SuHI6pA%2F%2B9xUZqEbn1jrh17XsMzNjmBd9xK5E5qu7VPfBZRZ1dV8g%2FDxRQKEVLvCoV4HD4MbcFuZw2%2FX%2BKV8aoLy5fz5NNVdyGpuah5JCrmY3wevlodWU6BXXh0R%2FYoaOFp8kg1PhVRp48kOJiakVhfGsKRHAHgXYxCJ2OcPVyuJAe%2BrT30%2BssDmrBEvHsvrcm7Sklv88mVN9tUd8td5rzgifnydSTcZGm3BgZ7c7f6NvTOCZoKeIN258nD%2BQ%2BJiJHH%2Bv7OT47wBie9kH8zpw6I2fublvBQZPUAP6ulZZv3LMcMrG6tMBfPkIplV8zqrRap7zyrEpIgelnW9CHC81373NxKvcSQ82DWhNQ4LkviOpPCMbDcykR4jq2pp6Js0WJjhCTlkPlmQCTdLCMheC3RfsAw%2BuYfPBtii1dZA8wnd4MImljtEGOqUBNO5fBDA6RyewBVjuWzVpQ2lcqcaJfXixJtebVIh1x7gieJu8a28dGXXRrZpHyjZ9BPsLaW%2FQ2EeXfIVy2ll80om5aMsCReeUVMoahL1RV%2BHUH0lfs6NUTQdkMTcqAACxbiRlXjjF97OFSFokc4xYvBE5BR4%2BlAI4UaJqCO73i3R4S9c9qiHnzI%2FjZ4m%2FYO9Medkd04mI5jnLyr%2BHvV%2FXUiCW4a51&X-Amz-Signature=84663f7dde26c6b09a3718a4caa9e7e1f29772968e25378c491d622dd10a4a56&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XHVGBKUI%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041958Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHxzefZopQs%2FJiB3XQh0rlUYO9shh%2BNTmp3HeqF7wfFvAiACgCv41o%2BLSQY1pIxYCc4MuBFpGO9ptOHNOixXIPjzCCr%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIMjckR5KLJs%2BFqS9EdKtwDhjjEhjSp%2FVdbuE3fHq7BTqOE8gkTf8TQs1rWqwyYgs1ukmZF8ZFiu9rm9jMrsAsafrcMmy1sNWqEdjrPxvcN374w6Y%2BlQRZQ5ARBKvV3lozGhnsy5e3FG5a%2Fv6QDmCqxIpm0VDHnuQbdtyBnRJ0ySfcSJrnbBzcyVpQlLgLxkU9vEB91Gp34G7zxQlh%2BL87%2BxVorPlD8zXhIdiag5Q6WRmRjmEaJ6p%2FHnddO9s1c5%2FWWXDIFwue%2FGPs4LoHFRBjFuVDAVN8PCpYzTMgmX1%2FXB%2B7ZR1Q3re1FTHdXdrDDePT%2FFQ%2BTMj065JGYlespcCTqaREjPnsLZM%2Fl%2Fxnj9JO5mVn%2BD9eKgcDsbgYnEKOyv7819gukAWWK8EJmGTsDQm2EgHazJWXNWYPqPfMoMUKV0zyo7Nf3ZfbwpXLMRlYggqFNWpDhYCitHwPVv9hepkhhGesnK5qjwwC49%2Bhnv58%2FmtrbnHEBe9y%2FJh4zPac7tem0reRM%2BiyjRvd7TiO8%2Brb1Ri1QwpKjSRU88rjAdLnOR8wpCvzMoCDR9tOwNT82V%2F0JQ7h7%2F%2BDyTC0uU7O34zW9XAuQQzXoPoowvSr6POMaD2ilRfF46TDd88lk4PGH1h09i0ua7E5H5XxBzcYwu6WO0QY6pgEOxizPHA%2BNws%2F96CbOR3cs%2BRb%2FkKLd4xd1SJRETUXzfztF7SDHp8S0AwArcvSF8w8Xv6odP7SG2GT0kKdlcVUQzcZeAnTqHAOWrtrmDxvMEl7m53RTJa7YqOnwWpfn6c%2FCb97RprQAuVNXUM4KVwS2jdYVqIDyhq5r0vVNZGpxVdcz%2F0kQ%2B3tN9hvKQHXImmMk4hKiH3WdK%2FREQ9%2B%2Frkru6jIGS7nN&X-Amz-Signature=1fdd397f75388fa65e2d33b976a5de02815ff2f7be4b82d289fe1a22a7a18365&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QZUSW7WR%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041938Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEhVTI%2B0yvpxPt8tL7rujJ1Ya0Y65HEz7h87dkOLzrMlAiEApmXb4yYOIqhEIhtK1PDaLEvspLErQ2g3To96zFtki00q%2FwMIfRAAGgw2Mzc0MjMxODM4MDUiDLsaBiHGewJHU1x8HSrcAx7Gg3CJDDpfu%2BYqMNCQsR5afjHHI7tx5lQ9GC3NNys6ZuIA7fLDpqve5uDOIQrKfS3HCPrs01DSEpYDSxwlJiCVHTSgx%2FwAkEpLe9C%2Fu5akDbzslvAzrDroBIEwQYTdzPia1XQLZI2XXsJK6iiXr1MlzUk8BxBYXcjCDU2Ik1zooixNXPq6k%2BVBsauGHjyN0IEhxXx0SvRqiA7gKyYetQieE%2FWI3aF3dHJsvjVwPnLl7C6TD4unXkxg9ZLw4dLnxR5T9p%2B8CQdVy45aUjwze8mjrvq9N7AdufQdgiYyOrEAukSAe7PHQYv33ALgpz2az1%2BYw1Gj6Xjj2lcDy2hogzr0sbrT%2BtDCQW7G2u%2BGFRjGX8iwl01EqBTN9nULrUAcpEzTspgV6TsxAiu1xHQDaDINkfiR7uNchI0Ec5ejvj1xZWis6ftlbnBQarDwy4km4gjiggPUrmrpoiUl0UJkdRNLxwOgmjJyvIKyS2vsPqRg1RzAGJV2MxWJMdTg6ZM%2B9Q6FxPVwzAgGFm4In7kBvEKf%2BSLDjHQ0jXULp20zlN%2Fi4WeTlAglAYDpASih9WLXTgnyTjdBj6jXWalw5MrzBvVEJsIsPoVhn9nKVmDHYVrpP348r01EhHHjSf9PMOiljtEGOqUBrSKiYJNBXi%2BAnfBpVQi8I8E%2B1FGqbrHZ7pKlrwuvmey4R1n1h3SLI4yXqOglxueCXxLXGUyALEt3VxO3YTUvzeKc641l2DhXcL7fn%2FkRTD5Ruuy5vwbGLB97MF3CuswuleFaeFzWzoc4pDJd3ZHyKKUDGM01uzzDBIB6M8khU9CLk8Q4EotZnfilU8TZTsK%2BonIGaytzvNX7gU41w%2BEXhz7Yf3%2BO&X-Amz-Signature=9d8b7cb40522cb66ea35ae7e5e8adaa020af31048fd4810b18d5f2017d27f32b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RYK5VEPZ%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042002Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDiOqgDpGLXFZEjW2jm%2BZjDzrlRqwtyipzomG2yZntZGgIgBJTBkVor%2BA9eAIrWmBizDYtR%2FiCfc0axkCPG8uDoAvsq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDPD03Vy7nbqqizd9sircAwfBkeI6JjJQxI9F0%2FUUJ16YV7FyJvlzI%2B0Zgy5OnCwYk%2B8iJY1D%2B69Kqdb51qUU2LrPcoh%2FvIiXhHEuhCCaDLWnqFg1pXFFy3Pb10Ow2k1vU22py1trDPoqD3G3%2FRwo7vxRlU3gBR53rZRbOQodrEj4PYD3krN%2Fu3zLa4EFpKnlri%2B%2BfGoHcbAswCZVt1rHa1vPj%2F3RbLpDkBJYlPqcJzCGJdX8eTq2M0lPmV9e9UmFz47lM6xcf3CSUhErjxlzWbmGD46LpWwXU3PZHdIDoLjzsT%2BudeDT21Dk%2BTyhBIMZnL2KVHM9s4hl6ufgudFMIDXoRnAGHKObuyGztQvNetMEFPSNozXFVIwacystHkZ4HVtiebHlN4L9lEW0UDrHCVIcWkhjgUGFwwM80hPj6RsTE58qywoMrZtLWEJ9Jgt92BR1YK%2Fox2ggJNiq8ucA01TihNr8Mk%2Fg0IOOK4L2OZsrO2hAqp%2BPis%2BGg%2B330COySxAhuVSsNQ9SbOpEsPGmAfMZlrZBpbYkfQ3cUCdG0TIrDxdeIZj82zxr%2BkhAhAfGrlpMOGmuleCh2babjRAz%2B8UdTUxA6whxHG9%2FLwxci8%2F%2F5oiT3trx3wErRwdaN2PskpSHI6EXLFnUGCo9MIyljtEGOqUBLx3E4RQ4EPE1PJrvGxRZXYJCvp0kLGWrLZIbCN6fMBGG%2FmvNZ09DHiE8P8ZSQrb4x01k6WFRKJ%2FHbWuHvlvoyFOnxenQlUggK0a5%2Bjq5COoV19anYtk%2BaCjYZ%2FyO0Jb2vCsUJE6H8xXuvIWi%2F8TMkb9xjrWVd1QUPfKKfv08g%2FLRlSdgA7w%2FOnv6X0ySCUc%2Bs5nKp99iZ18Zq5liMXqBUtHyA0Hy&X-Amz-Signature=5dcea079947e0f5e86d0394c3fa279df2e10f3a4f6aab473e1cf0508cb5a1c55&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662POFGAML%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042003Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFW10zCEzihrVqoMHbMSNex6nSkNWzY6vtWsMJCrI4%2BQAiBskou7vG1VTaoc5qJvHIaaACWst%2BaYgsVJbd%2Bb6eNPTSr%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIMNJ8282pDOTnyaq11KtwDmY5wkTF35RbChcE6nvBokPINVYA7kp%2BSSnZ7fgiu5EJSgeeTi4TeALF4a3RTEfT49GHZ2I0I9aMtzI5p0v%2B4FzvcE9m0LOTyMX%2Fyg2ESpUt8y0MX3ca9idVjjwFJSwXCN3UN1QVa%2B2nfpb4psqPgr2l9dY9LCDAxhH1pO0CN8ClcEW9eeqUa%2BZ5gkge5E6GXfTxrRAisxZcnEbgz2UGVKQ8SmBmrNt6KWv6UPIXXvjlp4eIzn3nxP5fKCGmPc3QPAG%2BL9rU5qdDBkqQrqUo2XsgfHUm535P%2BDMe8FGqe%2BqwGbkBRHidhKNRUTqkcmXnObAz3JM2tHa1tpKEZWVLWfzddykzRi3AcgNVq3%2F%2Fb6JzMyStLimR5N1OP1611jPkxBX6QuiFMql6AuDDVr%2Bbn2%2BAiNFkBpWZkNL7DDGVRx5rYlTavJA2OqRQyENQodKK7So32tUgs%2FyGaLej%2BfZ7naBeVyIpSmU4yC9wuMdbKcXNKIZjdhEpC3jYBJsbmrGRWSychlg%2FAL5R2xq11s0RsMhggp3l%2FwE7F7Vbj57SPIHiXNzqRliCS5Y4hh%2FVqZ%2FqxvkTHuIaivb7QQ5%2BzOu0%2Fa0p%2BL%2BAyNiTL9Xocz8pyElg7s67R%2FI6ozUSWmhUwtKOO0QY6pgFFeoRMVXSBVliqVsB9HSwGEZKonrElRVT6q%2BAXyPYOkpt42S2a0PRn%2BaKmF5Wj0vLRyJFBSKe2XKbk%2Fg%2ByQHGzFEM3lJ25gq2Lxlq7dg7Xc%2Be4KFciYs3t5B%2B4f%2BDU8vocZMe1zkCDMUONNwJ5P6H90bxRxU43qwQ%2FJmF17QO6ubN9lUsD5Bv9KDTcqTKXD6qE4PedAvY43SL2R5uO92aPoogR7pWy&X-Amz-Signature=3ebb60b2e6e5a803d97f32da914f3b5ea86d60573c7087225c3f33c2c3a684e5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664EIP3NCN%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042003Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDAzR%2FGzdLkgB4UdBIFC3qjim0E1RWvTtlKcLzsH5jmpAiEAy0Uz24RlNuOR%2BeFkEIYH8bTVJK64LO%2BFNXe%2BeP5%2FJPwq%2FwMIfRAAGgw2Mzc0MjMxODM4MDUiDMOumoQZR1ib24iFzyrcAwhB9d4UvTyLcsyC1t%2FrwcykdcBjR37Hc%2B%2BumzTcRHNpyUOsxnDbHihzW2JptfDGrMtg2tFGfi76oTQLtM9a%2B%2BZR%2BAnd00DCnxyJvaUNj7GNRNdW4t%2FcRFCEGpCYsOC0%2BEyvXY%2Fhv78LJ5i%2BG3z2gLebwgzTiwVryMQuGFOetxjw32K5XMyiPWKolbLFLkcIA6nd67Wlh5VSsZH7o31MosYpdJZWYu5PLFgHCSyJba8JwSbqiOILO7E2Vgz1E2Q1tlCzPkbQJkJSlAgsuMHn1fvQf0kuyUq1%2FCYflpkeFIJT%2FMeYxhyY%2Bx6Z2AGUKe3r7USjM2%2FlI%2BARHsss%2FU508k%2BK5GBTGZtkm4ILrxt5%2FnmKwoFybcIdeUwaipF9hN497FncZhUI9uliACM4RzcD%2FJnZeFnstZIv0b6JQZbgZPrDo60By09GcFo%2BEfPiwjnrt2kbZ0hHpcSdlakcHrNtyuZE44JRHLxKvGsfYGdcAVXyQbQL3H4Me%2FfojGKMoSZVd5W6gSg14kdvXyIH%2BFiwNMRnu3%2FPVcwx1tYcMZ1G7G6OLk3DdAsfkhWvXO10zaMUvJLU1DZplCFexGkrN0%2BSn%2BhwuxGTEos7clgfJ5BDW67SAYTlrpHPlYnUEQgyMJCljtEGOqUBeD8PajzewD2zEeoa0QxqROQEzZLvnhHZhtzchTXG1s2CUbxmMzUpT1Q9x8SMMsRLehHPmpQjPvy%2BdPMnlK9O37LI3IMKElIEwE8H5obJ0aKwLCh75Z%2BMNYfl%2BsFDCXzykXA8CLadxqUuGVPQUnDjr2zLyaz2vIMo5evE4xcQEQVB2DxfcX1bagxALTTno6vLctRAIP3G9q8q3TYBz7ctzYYeAHWi&X-Amz-Signature=f105a590e5e210a05552681d4430eee7558ce2d30050d69d73c50544c579855b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGCUPEN6%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042004Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCg41EDIMnI86pBG2jh6zobSqayWofQ%2BMYj3chkX0C%2BxwIgb2zLikA05PhD4wQ2yBAAte2OBuTAGkB2VtI2Cvl4RxIq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDKMP5V6dfjIBlUtGESrcA9sTgqN23DPHRJIQ6zaYOgamdkUjABnlUV27BqYezPIMJ%2F%2FBCgssM2yCpkRRitQYL1aQKXE1K08%2FwerZqlQADHb9P453YbIBQ2IKf%2B92UzJ36ScvFrtmqfdSyNckQnMs6lBgCCWsqy7GULWuSt6mdgUY0pwaGFsGK9hW6JUuSDDZpP%2Bih42JyYP7hKZdwFtW%2FgzytdJse9OjSERlvCVFEFIpeltD39FCNPmHe2%2FCSgrOJcrjSEax6YjX%2BlVeW8OgPrrA%2FIoAB0tgpW71Ji07By8wM8V%2Fu76NNQtF4HFkXsKwHs8Tvnj2DBJnbtUYSO463BRDM5MKuFJ7xLMKdTxbgVFltQpM1m990g2UloJRGywva6jX%2BaVuUSVWjiLnqHt6v%2BJp5FT6C1BAbBlePl5aWsIQmmmcXMUICnYJfrkSLadlUg7KD1Y52WZnakCyAeKK1iYdfNec4PY5YDqLSXz3KgYACJzynxRj%2BLRCEcF5gMrj1aw3wF08U5a0%2Fzqb39SciV21bYmf4inIwTnWP7Ybp96SH0shJ7IiWGhA%2FeYocpRd%2Fch7EmA79LxyMSR2y7I5dNrR6EkAxOmJ6V526qcuVGPr7YfOZt9ORsYdhwMcBa56IPdqdHshtDBRgK0ZMP%2BijtEGOqUB1604Ly7S%2BaeBn%2BnHo460FQun0VbOgoR%2F6EZE5HJVfl8a46zUiWTG3iBryhJw%2FUwMgzzyCGqznNX4GVkFctByKbBQo%2BiAnLmntBw%2BMx%2BQvTHURR4rOpqsxmkyrKPu8yWQyYpF9Hjz9%2B5DtV29tmkQvypyp9ifPHHTFYes%2FxxjWXDVQi0a%2Fiv6tC7sI%2BMcgzubJNdyFURlou3VkmGgntvi2%2BqHNXif&X-Amz-Signature=a76d55d90f6f334b5b357ca874d535a57feb8a7866bf42dc96f0c2aef468e2a0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466425J2PHD%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042004Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAZCkxIf6eWuealRhLqOLK%2BHR4wej01X853TBw6mCT4hAiEAjgGDgrVy4%2FDpiDX0ied4%2BwZNVeOBJBYRiM49xQHTHQMq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDOg2qO2U%2Bn1rNTwXXCrcA1qd3KmCUa%2Buoo2gw9tCdZbT4r6XUKI3lBGXvI0eAnLzPnGzgDY9ee43Rh%2FY6knB9Sm3tWpWSfDCqj6vK%2Bxur7OI1URW0a8ojjFUR6Qe8odHD2UbAqQOB%2FQGYjkc%2B%2FFQsFjTEYrG7gLGi7eqBVG1467QBmSoiQKTHeVihtgAuRTtEkzvtGlsecyUcl2%2FLiRhCxzC1UCyQmWcOP48IV4OV4acgJqFvxH381pYwha9Il495asKBqCZoHAFIWXddF6a9fUrdGeiG5KnfgxXdldrRBwN9NCJ1LM0jIsy%2FMQJldsQuZUwGd2KUXz4u9INlXoSWxd7fsEppccw30oUpqwyGyw6pDNIxj72iX6C9R3zj8thJ5FGMZTnvsVkFGhYBWGb%2FOwrGYFwREbsDJdJLrJCGk7LHfQRsq2yYKy%2FtRxS030XUckN7zZZz5t5%2Bbr4JBOzfFRf0XtIVr%2BWF6wxWd9nKXJYA6EGhHlcesXDNsnD%2BeuyLF3B0E%2FDt03jGm5cgCNj0NVGn5fhhTGAg9M2mplvhMSWmLjiTkbeCKtSizTmV9F2gAngzCiogVnEhekF%2BFl7RYP4Dcu%2F6wlLBBVctH4oiTV5HN7I3oWVAd%2BlZlCivfFfz4rTaDigcapm%2Bml2MJGljtEGOqUBmTWi%2BXHQveh%2B5%2BdbZ4iXFZ%2FCx36xmO1uy23BcG9cvEH5%2B%2BF06kp0ve7FVLTGWNwRCP11H8Gxk0QT9177Kze%2FDA%2BilTd1o3QsqpFgsLMU7RwTLhdImQNZ3XraElwpICEZAMJ4CSacCmK1jgW%2BwbXDmDc94%2BkAjUeCnNkUiCh1Suv1COXVOIYjfqTwaryTHAQD4dX00OMtjQkk6kU1fyel6YU5O98B&X-Amz-Signature=1e3a33398eb167398b702a1cbd7a3ab6e276269614311b7da5e54f0bac0bdc37&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667YQ2P6ZN%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042004Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCtDBySFS9ctrt62bN7VUWevZTKtt2hlvOtwvtiT0r18QIgU4vWpnes9mkkYJuqieoSQW9sd7gqManX3vScdvW7l8Eq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDPbQqx3GTZsRELOcJyrcA1uJZyt4QB83P2w7iDFZN8yfY9opX2gKM2t2rp6pap40zDYtxIAVWKgXp3fOBBlb6x8r94XpQBbP50J7hOqRJ3qbLG8znp27KufjV8e60s8JiMGWW1Sl5kSHCHlGbqKeZcALqqy1kEPNMtZYW6vE5ApgFoZ6dXl3YsFhewcoczNsJpWBEcLCmYXL6UWvQC11q7mc%2FJvA72HY2IQO0mQxW%2BCYBx1KN2aHEc1ndRKbdULnj1i1jC2Q1%2BuANesqvA%2B7Rp2MiyO4yMVnJmtZhSaSETGBqNKHrZTcxMjNIAV8ci8QM6fMQegQeZDD6dshApmY6mlcMBsRq7CGvbtInwhJc4TiYCPVXy2vlDUFN05cCJ1s97cTy9h26HTBE2A55olw4jv2tH5gErZ6fkAQP1ucEkq8lxt3KNOojFvSIVcLKGpeqXTN%2BF8KD1icmiE29Rw4i1UVjJQdOaqW9wwTk0lxtaGikBftq%2F6NACae2UckuEKSanRnxjRx%2By%2BSwl%2Bw8Bw1lkr%2BLvmi0f5UYzawL9SXE2NOvnlW%2BwFAmASW654rxeh%2Fk1kgOeOOvn6mNG8iWZ0S%2BN61O%2FiTJjV0Cy8u%2FZVHrnLx%2BHBaF4xAM%2FTXhDN2yJWduhEl01%2FkBCzz3HDHMNakjtEGOqUBDO40bqQqsI3aNdSPlGfZw%2FvuFkkYuYdsZYhl2mEoEuFB%2B0WA1n0a%2F1RMxWSswPuOrtBFQxvJCuOvZFeZ%2FxTL1aVSIT%2FcuIt7utic6TIsh4vjWl5Jgwo%2BNF8wT%2FsAl2%2BSTuWWPU%2B%2FD16UvsZBvoYJ1rGgOTfaeapTSXS%2FACiqtoYOXXhi0QOYTj1DsijAoz3c3xhxGsA1s6McTpNgVfbASFGbltJ%2F&X-Amz-Signature=3f034a0f8787604325ed76bc9e787525260132745a6997cd5a2d8ae25f2eccf2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZCA3XUAK%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042005Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCK9jNzd7z%2FkXl45MsnSHZerAce7nCPF%2FaNvfyZugQGrQIhANI625pa7tbHSqZfo87Gcrb2vkuEe6TVD7SrYWOpvtPKKv8DCHwQABoMNjM3NDIzMTgzODA1Igzs8q%2F6e5AoibiSNasq3ANcr58LanFuaaQkB1pKLLnjhAlIYlx%2BRsoT0hHJKorU4OYqy%2Ffr8u52QqhynFvVK0PQo%2BkoSaK9Stj7MHbTsEZpb47ygCPtFCbzF%2B3idI57eKnksaK4UamvBnkMilTC%2BwaCeh18%2Bcrs39pmBXiv0EQl91%2ForXJRS%2BqIBlCGlQKYJDesH%2FscLzonEq1aeSDu5x6nUpYL%2B4Hw8aoBzzcG5Jrqtx3R2XcFd98Ar%2BP%2FslSaE0sFVkRiMoWCSU144tTGB5nl1zLKZeCaGdK3RJSxhCHsBvho%2FzOWD1NkErKF4nV1NAOtPc9zIYULofPBZQUoM64yO%2BUOIwtldsk%2F%2FfDzJKyc2x1BDALaXt%2F9cHVjnyvxs02y%2BSptcZc%2FvGYCN2jntuVVJwJPM6pWkMvQ7mtW%2BuGrWwII524fw%2BQt9ZoBYI%2BLLK0U7%2F4QnmuZqVELjfKSVvIyCBL4sdqpPokuEJzrsC4Ie78FmzcEFgE%2B3UNI6aqs1co6oCtxnmsQ94E5c1IagDBmvfTpTXEMIkBIce8ZFI%2BDJs0%2B0PmH7c4Oz72oeGRYGZtfNKCkWhfQQXbCaGG2ZggiOGBY6CCTVRfnFyzL4PS%2B%2F41Dho6oHQKCsQtc668xHiLgVk0YylcsPnXp7jDtoo7RBjqkAfvucyqEwKptauelh1lmhYXVgmWSX4IxhKFjLTqHykzi%2B5RFiqkZtrvDUTe44jcLdv9LPdQ19KC2lpqqfPfzpI0EFiihiuaOyMhfHlR8Ir2zPTyiVH9saKvT0ZBGAz7YMQRVsYEW2cZfYAzqyUZV32vXjqLOsZSppRxTIldJMV%2B2PsrlW5rSXF%2F4u2ZUt%2BKy8vmSNPvQf%2Ff3d3ZwuzAUZq2Uq3QZ&X-Amz-Signature=4ecc4f12cbab67c26cd8ab0ede8a4ff8215e38a11ffc4e316aaab9940b46494b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XEKF335S%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042005Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDanfiKQzeISni93TyludAYGPP0WNWP%2BzZwC66PWgdNjgIgQ%2FgwiUXNkkRPuJCdCm2CRjitioLg88hztyqJ%2B16F1ywq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDMerQlOyFmhuQg8A0SrcA%2FsRFPW8rxIE4dLfkf4c4AMrKJQboNSMYV0dMXPHD5YPdqZnJmumpccThuSxdCukyfZIAY7Cu7jftp3Dg1krIRPj8e37Igi3sLVe1pW5MwUEJN5h7Jd9qpGWAKm2QKruZWfasvTi5CXidYrYAhBQaM6klhLXLOiMnCPf8tLb%2BJMNSP3RACTD6fkj4uyYN8lGBFx85TIZJdvVqyvgcPOdz5w311rwaC6SRoMlwWBC5TDA0ZlRyec4CszJ5KtlJoXNHAtsM%2FrjYoz3fwNYlwf3ARTXmpyPwKL0Q%2BxV2SYgBLyx%2FLm8qmAsZ5FC%2FUOH%2F6BN6s0ZX9Ohvocs8QQul6d2IG9riqn1pL7DXiVUXmNtcR%2F%2BltFfei%2FohApJCoJBhbyqWoLEP2CCmv8dMK%2BMFwSrS2cPtUyCR%2Boh%2B%2FJhyrQCSfOu1AGog%2FNIIaZm103ESE2dk5oNqpz4yWCWvpVJkA9SD%2Fq1VW8dfhke7ekG%2BE0CM%2F22KNGdWqMw%2B4lueOVA%2B%2BFWU4DKUdllO9GqwQwP%2Fw3TBSuvqE70LblVSAukJmeutz3utAsZ9JyQFZcXFTSTSPSx%2F3UX4URuYUa0g4ldH4R63Yfb48fHc%2FjkqJlacoTv5pQZmtp%2BJDWsj2VVadK4MMKjjtEGOqUB18%2B3y49sRkE1G4ZpsO7c%2BzZ9Uk4Q0L919FENx2CyKDwYFJUmmGIViO%2FFQcZNQQ0%2BnMq7ZKKxc1yQO4C5gY8WVMQVRE7uatPdmI%2FYxq7UECm2B%2F3K%2BC1CCKn4dXxs1uXDT67gtFvhthuTP22TnzP4j%2FFnkACRr684ih9lUo%2FJOpvrbql7PAUuqMEJR1nTJA4qmQblb1GGoE%2BMWO%2BT8gL09ReMjNGq&X-Amz-Signature=6665cee6c450a0e00c49d35a2a69ba7443596f3525abcf40e8c81c11c25bb5b6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SFVF7EZF%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042006Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDK5PST%2B5aq5anBwRjgLPfKGLTUzSMsMJj0y6NKD17teAiEAuC%2FxC2022faKnfFghs12AVZH3Sdzd%2Fs1pT7EnwTuDGoq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDG59sHuLEV1LeclZ9yrcA4WMntcCIdsDmYQR6L9UlzUQz5pOmrcJ%2BnXEOL3LGqQIoUTI3IUhrrl4xjtvI0uAxb5rFY1HVorNJbCzx%2BwOzFLby4QwF41r6lICrEvmVdyiMak0BHffkXQ33iATWQFC2SKCK4q1uWzB9MbtFgOGvORD2BCRopdSr0GbdR%2FrNgS%2Fe9YD%2F4HOgDCLLfiVUy%2FUecoyPcXcbg58sJVxlLOjyiM04rhrPnGgbsajSWcJT1bSP9E3Y4YdGiTklU7UNM5mLVfTWaaguuDKZurnizeEDaUws95eXjt98gfg2FMk6BBeomBVIaGuVaNWXuoNqQ0S9cP4jfG9CoX2U47C6rTze5bICM1L4ZxhDhLA%2FZ83KnCMDwvS7N4s6ccXoTj2wn%2BnLtJF2IPwDUlWclYxQfYvydWB78G8ACJDjgxitgSV95PO9kqddb6MMjKDLdrOiDsgxLcmoMKtL92tT%2B4n4bthJ7yZY6B269xB9ObF9H%2FgnA0FIDpx4eIEzigeCkg9SiwGrip%2B5lswfd03gYNtEuXyvGV%2FRhTpS6JPC5ewc4vrg0o9daRKLI0iUnBIutoP7mjdZ7ZSu2SZn2CvtBV6QkUUMbCwXrolJHma6h3murbS%2BQy3JbAW%2Bsx1rEz7J%2F3vMK%2BjjtEGOqUB%2B%2Ftl%2Bx9jZRClAHAiPG%2FUK1uaoX1uPMZYqldUYeosllPubSTaUw60ZYTSmSPI63QgtykeRZBsou6P2qSwESDItjLbCfHBoMwY1MB0GfbRRDiXA6rHm8yF2BP7U%2F7FjLGMUeFu%2BApIaoa5nnxgm05PWxBwDvw7LHHBjz8wHCeLeV3Z3obuWwoe2CzRILyAD%2Fk2uIVIBwOhw5WmWriT3f5eF6oyUHQ%2F&X-Amz-Signature=1e1efbb7bdc39ea383772a8dd3cb0b3865c3fd96d79143b6f95c0f9cb2012471&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662K3TCJUP%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042008Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCC7P1TiVrJ2v7%2BnDL1EGbcGhTo5xS8dbWKyVB8dEOO2wIhAPEkhcvmGaPETMdOFq2Mgil2vJ27qoZSNPl7osYNUP6SKv8DCHwQABoMNjM3NDIzMTgzODA1IgyuNxDFebhD%2BQGzVXYq3AObylX%2BWLb%2FkX%2FgTBay12PqZLYGapyPXgIsjKT%2FZwHJiMGYBmLNK2d0r3dGwvk33ZJkgsyVVWDWHXR%2F8ZecFT2TIB5EGobPI%2Fa74yMpst4QULUMLzMM%2B0hK%2Flz0ANz409YK2hkR15QesazjmtXMyJAwv4L6JfL3s9bBlf4R52b1B%2F4%2F43YLXnjLpbQouha9ANx99JlbMJGkXRb5JPw%2FSUrscicAX%2FEaowaekRzNG%2FhVCgx0qy1QPnQKhX%2F9GLvMp2RT6DiGzwtEXh0DSIxneyhcstAaSU4aKFNwXfR7%2FaNz9aEElcqz9q82A1nqL%2Fz8i0h3OYF3VXESncmuWy6q7B27iS7x%2BwYlRFUQcwh4jXvHNA99063%2FLwMBY20Af2gsjrWT%2FAG4ZSmrx3T%2F4fnYP4MdVjSaH%2B%2BR3pr133wv9fBT%2FIVqzvRnZVvVxcYt9bXpYA%2BUqjJa%2BzOeDtI%2B7jvxULDMsqMorp8UpnsFURK5jzyE3Cdb8o1k2pA2apRo6qlody3AWRbAF1Z92AwyBCIZPvPshPanYj3p9AnVuRkbPMNkM9yhy7icUtRd065jPa%2BGXOzxAppD%2BttB%2BWKiPNdNIJL3q3cxrLWWlqkHefHcccBj4Uz5w41uROUjPGJICzCkpI7RBjqkAUuZ3yYKPnIPSSGiQ4XxSN%2BX3ob%2Fwva9%2FRYwdUbtu6177pdzZZmn8lH1yhjr4eFQg3k%2Fq3oQ6GklZLy8yFlQO2wNzTRCKEMhV2iApxEW%2FT91Ma%2FVdD1seRCXg%2FPmyPYjBvoB3RWJ3UqiWC7gepaxEM6pwSNScm4z%2B4KVB7kbWMYDFKV6EJSbc0px7VaZkYOukgYJ%2BhWsxCVMbAWtQe4IzxBTJoTT&X-Amz-Signature=aa136d8990de13f604e06b9f792fef0cb2946f862464be84cfd7bdccfadfafbd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662K3TCJUP%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042008Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCC7P1TiVrJ2v7%2BnDL1EGbcGhTo5xS8dbWKyVB8dEOO2wIhAPEkhcvmGaPETMdOFq2Mgil2vJ27qoZSNPl7osYNUP6SKv8DCHwQABoMNjM3NDIzMTgzODA1IgyuNxDFebhD%2BQGzVXYq3AObylX%2BWLb%2FkX%2FgTBay12PqZLYGapyPXgIsjKT%2FZwHJiMGYBmLNK2d0r3dGwvk33ZJkgsyVVWDWHXR%2F8ZecFT2TIB5EGobPI%2Fa74yMpst4QULUMLzMM%2B0hK%2Flz0ANz409YK2hkR15QesazjmtXMyJAwv4L6JfL3s9bBlf4R52b1B%2F4%2F43YLXnjLpbQouha9ANx99JlbMJGkXRb5JPw%2FSUrscicAX%2FEaowaekRzNG%2FhVCgx0qy1QPnQKhX%2F9GLvMp2RT6DiGzwtEXh0DSIxneyhcstAaSU4aKFNwXfR7%2FaNz9aEElcqz9q82A1nqL%2Fz8i0h3OYF3VXESncmuWy6q7B27iS7x%2BwYlRFUQcwh4jXvHNA99063%2FLwMBY20Af2gsjrWT%2FAG4ZSmrx3T%2F4fnYP4MdVjSaH%2B%2BR3pr133wv9fBT%2FIVqzvRnZVvVxcYt9bXpYA%2BUqjJa%2BzOeDtI%2B7jvxULDMsqMorp8UpnsFURK5jzyE3Cdb8o1k2pA2apRo6qlody3AWRbAF1Z92AwyBCIZPvPshPanYj3p9AnVuRkbPMNkM9yhy7icUtRd065jPa%2BGXOzxAppD%2BttB%2BWKiPNdNIJL3q3cxrLWWlqkHefHcccBj4Uz5w41uROUjPGJICzCkpI7RBjqkAUuZ3yYKPnIPSSGiQ4XxSN%2BX3ob%2Fwva9%2FRYwdUbtu6177pdzZZmn8lH1yhjr4eFQg3k%2Fq3oQ6GklZLy8yFlQO2wNzTRCKEMhV2iApxEW%2FT91Ma%2FVdD1seRCXg%2FPmyPYjBvoB3RWJ3UqiWC7gepaxEM6pwSNScm4z%2B4KVB7kbWMYDFKV6EJSbc0px7VaZkYOukgYJ%2BhWsxCVMbAWtQe4IzxBTJoTT&X-Amz-Signature=b015ec47feea49182c3ad71224b2c923ab60fb5731d5b219c47e18ec563e449d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
