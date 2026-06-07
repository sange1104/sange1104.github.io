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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QZEHYLZO%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045552Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDtAOvWxY18sdftF37L8fmdYh366BWcna4GH3lbpjMdFAIhANa1vpGAATyaN87ARel1hkfWqjl5c5kYzZPq6cm%2FLkz5KogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxniNbKS74Vqcja2Xoq3AMQv9Q04dx8nyRjjusHWGAWA8sUbaJDNh3tE7ZRchveeVBWY8FT7REjO4cjj9sodGjTVedCu2OZQUu6xiynOZtQiwaCPUBjlsafX%2B%2FUWxMMA2EzZaFkjUIBiLwz3vCUyp0hKMhs2M44BXB95zcnGu5is6VuvpEW4AfqVKyaqs7tbzIuTmV7BX226EeGpigqfth2w4NnF0SsfBgJtxdBAAk0s0bvIrbf9xeI1TSa4ni%2FsKZF1PpaL7a7OFzq0Zr7knH6H4CLNoZkYsgxQPI9YeHw4ndQOwkcbMIj%2BoehIzlA3j7%2F39oC9W0J3C2NgSFabIeif%2FfZsG%2Bv6Ges5eoxIZrDKiohHD1taNZEYDLWj8wAu%2F8Nue4Bp9J63CDov4fasBrbmKCMvOr4ivxiSOhC3wum4ZZiOzYEA%2F28lJ1wL3DhtqNXWEY02R%2BD02tVCuVodKKQebIM7pCVOmfFzBQtrBZJhjSRocATZJ%2FIoPcKyyxKdRDU0jtMl%2BhmpEe%2BgwtuglxWyrmqzsH%2Flz%2BkqpLzOa8fMNxzC846NFLI3Y3Rl9dgbSXh28H07UJuxadsqhczNi2xo97n5GJFJ2GpbGiK8aSj%2FF5KSlqxJpE8xrCiaeqW7Co74fV32JVrT7BsADDS0pPRBjqkAVuVdBrbMiy%2BZBgl%2FpM0KFpLQiMWbAatyjIQhkameGGej0mWNHWd6K%2BN8YAooe4meoaX%2BTWQ3eNn2zAd%2Fz1YMkHiLMskou65ps7GFApblEgWVkYsfwQMdC8Ds9fLslr4XAqYUv3hF2zTUE0e%2Bl4tyDXmw6eTIKPiP77nxvmLdhB6cRMpN0iLh%2BmGt9SdEV%2FLpuZb%2F%2BuGdLZLxddXjIScXwGfCnIq&X-Amz-Signature=c00c1e33c7606343651dfb9e46875048157facf2d832d0741975c0ca875eb890&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662VOLRFVH%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045553Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC3ng%2FmTkKD6prKJ0Tj7UcZZPLzs11dyR2kL%2Fw8UE8WgwIgSQh4aCr4HUDVpkXVWrN6sukDTyhtadkdadaIPArDKsoqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFfbP%2BkRFuRm3D7m8SrcA%2Flw0%2FFCGX%2Fw0e0A1Gib5AwDSq4xCjwxHdEqLh7A0s0VXZ5d5o2BSiQcZPWlaJ1ZOUv4ewwLGn0ek32ENAqjySsVcx7WJjCcFJlxaWIQFxhBQLYxaWpDQ5%2BwKJi77zxTFSxhvCrYDkxY7nKyzTGfFAtLxULjRNiH3knWiBdihL0SsSdqs%2FZAMgQcijwMw%2Brl5ggaPAnkh3yhftDjqozt13N6VQgXqU9s36Y2EPTlTJIEHRARTgGR%2BJak49aMlUa5jxclIPPJkz%2BZWKARHQp9J%2Bi4tvl5aR1%2Bu7LLTvz0aPQw%2BAMhTmTkP1vYb4ltwQ2wnEabFFuEwXXKZ9kpS55YyXnG1Tj63viS%2BjDDzWLvoqZ1bWhwcQBB3kR%2FFBHch%2FJi%2Fnf33vbBP5DAuH4Yp8kHG7Gbe2FOPHl8QdZfVdobykTihVvH7MT4k6pxaI3DErg%2FHIfsqYGX%2FyMatI7D46VgZMc7%2BVVdz%2BBPMlsEqMNj3jN4s%2FCymsiZh2b0xYwpGJJ7BZlHOp37R33JQuT%2FLi%2BIO1EufiR1b%2FzV1ssspwEWgHV9KgNRyLfbQejY6RQ029JPlhoRG1teh8y3da2%2BRG6aCyRJ5%2B46BpByaTo5QygNAjr2Sf51cD0TJczqKIp9MPvQk9EGOqUBT%2FWjD55tLr0wEXMLrLc7XP2QLIYNrhYujeW0xWsGX9MwiFM3RBceFc5KEx6aODAbhNcaK63tz9durcu%2BqxRCnDGh48Fl0eArlHeT5TGQvwyPEDWhm8rICl%2Bygo5%2B9Rre7c8eQMLTIYyP%2B%2Bc0X%2BGH5mibOsqnDwwh1Yw6ijEZYzH%2Fz1E9RJpFm2X4PKCAjAqcmeym%2B2D39%2BXu9yBXedWEUfNMRVZI&X-Amz-Signature=28abbe32a533a8c795f1b83eabe8c431a84bf144e25e6365ba5285de03a6b390&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W6KYUNRD%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045543Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBW3%2Fwe3ANn6mb%2FG8IzAXC18VLo8ObszQpQ8DQcZ%2BdLaAiAnIaQg3p46HWi8L0PiBo2nqDL%2Be1tmiyt2BoKrLDdEfCqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMocmWsKfAOqRVd7niKtwD0fQODaIdkO%2B1I4dxxIydjb15XlMZoSMqSOFzGHuh7hWYqCTbn4W9jBS0vB7LQJdd%2FIIiGbhrj9WlSDu0e4a8BQNq%2Fml4JjpdzKSZov4gsBAvX4q6V7Vc%2FW%2ByW2xt5XZEUYRF6XRzQ%2F%2BVDPbAjNz0LdGOhO0n9376bMKhmxyz836vOfefjRgSUBzNrjh4p3544CvXx%2B6rhf8lLnu2JsphAEUU9K%2BjvBSyANLN%2BR99w8pC%2FPTipksMtNcgrbG61%2FZstDO3kvHZdpYCnEx59ddbno715Bj9%2BWsRRDD7RkSNYWXtwYMdHrBEv7PppaAlCbZnW%2FBgjS0q1rpQkGlQbQKIq4qOwObstOC7UPRlqE7jpL%2FTrVVagln9s5GisOPdMhcGxZfNYyB9raoENrKmmoMj%2BVbWSUWNVVzJRvTc7J931hV0p3k2Q8cbZDAzz1%2Bp12UPHj57Z6%2BXb0s6LBvmmfbIJjPFs5Hj69vB2UB%2F9gPlrG4UtzD6kmrhb7yOe8uKS%2B5X3gsStVDTiRdybKMAC%2BWRUrs561Vk2rkuOS%2FOrl4YQVbaKzcGsXjNBsrJIp0qKFxvx7A091%2FfvWM8NL9yEhgmHrbHDs3R9jFo%2FEWPylm%2F7VT36Djn7edHjKJAeMsw49CT0QY6pgGCwo9Z1c%2Bz46k9FQzWjFTkDzQiITybLZuAQa0f5zDoo6c8Ttz5kelFFmJo49tFv0zG2KKvYmOh4efoECqXbpzc2hm6VpNu2RXbf74nZkbWehM%2BVOHr1cHJLE5TkcJb%2BaCP6C4NGWPOM99S4WnAkBiXzYRmU63HorYQE3K109863a26iz7tcLztgQ8AeCqKUBZXUNtvy83qlAVnM08hufOUYja1nt6y&X-Amz-Signature=f9a9ce62e951a99b8476bc8b401740fc808dae2aacb2a6b21667a20386a68510&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VAPLQ5GQ%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045558Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDwGTpuWhyEUny5i5TkAWtfG7lfGWqAD%2FIowbU%2B0H4UlgIgPshz041XQtA4OIBC0oxMM7lDjMp%2F%2BV8mB8YvuF%2BS6%2FgqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLHxbyr2coJjX3r7NCrcA25%2FDbHWwCGKAFVTIjJRPxczggGmjSdR4rm6mZocoMrUYpRY76Ot6%2BMLVZpO%2FA0fa6LpJQHFuKNJD7NxXu1%2FdjH6u9%2BA8aNyhx6OJ9E59J9Oh7pF7It6ZiMk251JMG0RgE5K4GCaVuCrhHx72f6sMMwlqCxO4kHmWEq47GcAQ7%2BgT5EC66gxwvlJp52ifSzzq4ul4Wxvk22R2Gel0w8EV9EqAWvBtud5uoKEan0GVErmteu19J3raVXfQvoxGYBHeH1PcW40NxTE5oAV3DyQXrdNd6uD0kjoQTwSLg4PJQUNgYHb97%2FRU8%2FxlFbxyoZ%2Bj%2FSawcmNjLl4hh58Oa9dGjW1fo5esUXdPIzGkr%2BDWuHQ%2FCs3muSMGR2uhZcHFUbkCNw%2B6nyZPwGw3sPv8%2BbI30MRA6pgSvMdqmEbqw1k53vqMA2%2Bw1wjeAM%2B%2B2jFRS3UAr3nbKeL3jOPWaeChMAomhTscAfcJUw4wE3sNWfjiEESe1HP0o%2FmSvdruNqAIstWZQORim8nUG4Sgu4LV%2FvdJgwAHtDSwPtNKpUzfI%2FoMzsdB0l5jcrPdawr2L2yLjxXsW3yxH01HvVCrNh1DjsEH8qAVAaNQzjCNPwN%2BlrpvhB%2Ft%2BZIY1lxHQo4JThaMK%2FRk9EGOqUBmEEbBF0BMZoaxcSyLWmRyLGWvftFrHgu1uxwmOrrHo6eNeTz0P4p8QR%2FLDXY%2B9fVKDQ0%2FPsVpsXdq4L02G1gi8zC60d74yJsYl3oth1i4n7euvEm5DZccTnUK%2F4Z9wqucwMvhsIWvjD5hCz9rYUmYYiVJ07n9BMv7wz2hno6v0V6Qp8i7XVCwFLMLkYEpPA1QrGNdkjJKsubLIApoYTYAeqVRQZW&X-Amz-Signature=cf12eca67e73c6d1fdaeb9bdbbb8febd862c447b31607431c6ecf95844bf9bae&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WEV4RAS3%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045559Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICnGvWesHQ8h9uM02lu20mkTSt9MMh%2F%2BAevv1YEzL693AiEA7z0lQQpIn2vVa3piH3NgMJ46%2BW2yfGNa2pi%2FaHnofOAqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPtssnXWerd%2FWyMNsircA9aqdbGZDzvjxOqgjG8AWuZs6H6ENclM98wN2NLsnnEjfBb7PScOz2WxECrWBYhRU%2FpeF1WLF3p2HJwJ0Xjo%2BpNOyg1ioT9cVsgSGxUSrQ5f0NrB3Fev%2BgzOj7cWQB1jsBJxegu6p7eJ1vkX%2BH8mkJpXXsVbPrSTZ9dT6HycvgUfbO%2BZNuIc21DhYwgm5ZtUObZLpMSD7bdt%2FjppFIf3M6AsWLgCIJTNysiRzTvD6r6raaSApfOISYGFOXeUC%2BY4qq9j%2FFSIh5F4KMtXLnOqv%2Blba5%2BUJr8R2AdYaJbLZkN%2BIsrctJhr359lwax8nmE4XFKLSZWD4aA4NIjRSfLZ8be8IHcgJxYigsXoXv13IfjosNUUb1af8uyAdN90HS7C6Us4isivdoov7qbDKDyMD5hrbSosPbkWI0q758eT3RFFNbeftrkUOiV%2FRSR0wnqbMcW3gFN0fXSPOpRTqfTifLkk2D3%2Ft5Qi2uVtMG6ggkCp2slk7Zi%2FMtShvRDjl0%2FrBfDsccUY53g72PrBPGEWpOEYU81QSYufD8l4eRu3%2BhVlUffCcTOT0pUOB4lWQdL3XINHN1A9NHHJBemjm5gR%2Brw7fqf0a7fdCHAsdV6%2FCjfH2nOFlt6FnpLAzhXtMITRk9EGOqUBglaUvk9uRXwCRUw1QGuQ3QunnZsG5vZWqUSYWxf76ORoAwMUt4qlckNFHlGKDbggTIUnOzPk2zWOavEf5iHdOL3NOXpwE1%2Fqd8ykYRoQbpCMcdKK5Rx6KuQr%2FZvJ%2BoUHeW5YAS8621rwTTvg81sXsF5aSx%2Ba%2Bp0W3Jeh7NBz%2Fq7A%2FqleLetDqZPHnXVEd0MlIEZXz6xtz%2Bzgh2TMNptMHmnbHXb6&X-Amz-Signature=bf6fb7a1cf37c519b321e4602214a802061bc39214db7d2252328abcd660fc88&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQ4KT27R%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045600Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCNy8qJ44qrndIvUFczDrO6cTc%2F9f1WO12YUgTrcq7XMgIhANJ%2FILlG4K50ug%2FtsteunqZ%2BgR%2BU6mNVgYDDLa709R99KogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz%2BhYgsB7EYSGCt7a8q3APzhnJydVBxWOrB0Iy3%2FX8Pk1nuhYKa0lK1Kc1tToeRzVOVGLog4cZ612sU%2BnMS2w77HWvNU8IbuxgQVGil5yfhOn5QWyBFZeiwgwsmPxx8vpv4kxWS9fNJGU0JP0mUspLytwU8HtYEqJ%2FTCHDXdOEVJGk3zsZPU1Awzos5qPI9w25rZRD2LKYUt9GB5eGjq43uwLM9g%2BVaeAPWKMrxODeNMFfp8wwv7kcB4%2FAdIKWEVMN7s5hOOEJDNuesIlWohkT63emi8VmRKgVDuwxRmsAvdl9lKhACtxIwRzi2mM4UO638E1dHibKORhK%2BPj28hp22%2BORzg0nE2c3nXxdbOfsPpnI03fIskfKweqPJHgZXa8RgUKl9n32N0wfPdBq2TQjZMRTr%2BfTkle3prf67LBnkjiCdnQN9Ur4AmjhToYeCe14MxcGMMp1zSPH3neqoQJiNuX1hnoW67Z78ozcGg3JZCE1ZwAbjoYMk2qHGAO01KvUzZcIgKxSj9rI9iJepEJRxwO6sI%2Fy69Bh%2F8nA36m9EXjJeHdCd75csww%2FtUL6r5nz6Ztr1xAZNi9Z7XU9aaGkJLzl2PGAiH%2F2K%2FY1Clhmr3ZHB0IAtJ5G5%2FNkQyJMkxnuxtbliFQ5DSRnQUDCh0pPRBjqkAZ8y82YifPY5LJrf2SHpm%2FYxXUGS4OodKmnPWubyaaDcghnDASRrna7ZBLKYLqG%2FC6LT2vZA0Q5QIc19C2m6%2FLs2srg8OZmoUkCJD%2FLJbUMJ4CtrJHNHacAo2OGa4FrfSnlc%2FrtMB4ibIsdLjWTP%2BOD3e2jVqWNtK3EYFeTDxIQ9vfRlcydJf9omNbqG3%2BC9%2FBrsuhhF38dqtLPUr3vnklDoqW0H&X-Amz-Signature=68e8bd24d705f2d067f18b6edddcae01cccf7b27b27e78afaf0675ca362e1b7e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S4U5PNIA%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045600Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDka51xY632ukhOdlzrCe1DEu4wpaC%2FF0Vv1c3iK%2B%2FTvQIgLn4uMzX6uHFJBRJGWEUUJtAaY6UCl2UrwBpyDO6hhRIqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPvv4u%2FhZ7vDdl1DpSrcA4dk147Z1pC97jogHBJ6z6qSWsXAo0dCC9g9xUs6un5UubBZaGMiV4b6tzGkHFSPXZvE%2FjD3ep9NLVcg2xBZAo%2BOpdwGFnsP5wsl1ehOjHaagJpHCB6QOZWNCZx%2BmLFCGqD6U%2F2Pp8KYX%2F3llXqlEmq%2FacCCBfcfGUd6ReO3afBrIKDM7TRBemYUvehVFUYjR2W3CZXuO72CUNKlk%2Fq5LwENe1N3YnMXj2zs%2BsYTUG6JzM0%2FQBZKwWfjasPdRBh8b%2B0B7ySFwEfyK1IM8hx01PD7ja%2B1oVX8cEjgCxt6BfIQ%2BX6uZIHbB0%2FQT%2Fd4BaDkq%2BFovOQXWoGRgk8ZCgXvG2h6G3SRsTVI6cPp5NZGd33TtmBeg6aWEoVmVVB52aMMiDr8nSe%2BPN0BwfaNuYy4MEAc%2Fj7qlQSuE2fYMJS%2FfuST%2BuzRwq3Deaz0ErmeiuoC9J%2B0J9w8lqT%2F05e4OeHjUVn361zPMtMOgGV%2B7SciwwjUEHy5Bh1%2FHrg%2BMV38WY4AW4qQ7NqK0Du8UM0D4nrQYFrsLRZ1%2B90Wucoxt5Sio181e49ozykAYk%2BVLUjNvUyaZWFTwoSzfls%2F1hmEfeaojTiPuYr1szTJNVAHcF%2Byi13%2F1eYiogJwjWBrgJdvMN7Rk9EGOqUBHIRsXLDWptYv0qAcPE3ku3U9npWYNJoGQPD5uomQxO8usT8mR%2FNDrLXBnSYN4dfcLQ62P9tVh34KpwH67%2FY9CC6iMjnlKM5soDLWwUxjU0%2FXhFdlorYhWs3Bpd81lvzXzq19VjDNiEiqFTcxLon8G%2B2MDoY66ZZFBs%2F%2BT6%2Bao6mReYQ5VtfU1WaESVKTmwRtRItOt%2FAqbPK0oaYYDHZqvOPssgS%2B&X-Amz-Signature=fd3b0b838ba50c2bca5e61194b8fc509e1b1c24bf971a088e0a9677d427b65e3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WEVNDTIC%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045600Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDUCxAjy3M%2BFmHMl2iRAcMqvfKw9oHlEQUhu1EZKLdJ6gIhAPWilCwFbymg5zlUF6WZCqnEBR%2F%2F5yyiOCCGmBA%2FqWU3KogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxzg3FxHwRyT4zB1jsq3AP3WMNcv%2BAomarXFbSiMWtAtHlC3HgOhQzhL8MmtpasSVblRxlkwGnbIKqVFkoBOSro%2FqC2D2UtPM6JAmpWr%2FB%2Btq8tHERRm88Dk%2FRKRA00433VaIR8h7ibHoux4sswZHYzAkJLHNW6uF6uSgXZGEGhSF4vm3mtl1lyNL6zEUD18sje4Li8I7yiTLH%2FuM6%2B41KL6eRMLg7AI4rIpdZJzMPrV7WO5OGPENbBW22yFRJjmvrimqHiFFddN63raPug4KTV8hOKBiPnuM7kgi1RnVCw64RhVuvGvlp9hNHS4eYjW1Qt%2BjgLDNl%2BRQWTWUa0SZb0mMQFO3PSmEcCFg1%2BBPnFhikkAblVBvct8rHeW088ERk%2FH853bCNbtS9KP7DmiLBJH43X%2FBmy0NQ1MNJgT6ZmqB0zFoSq1TEyD5mqHS8iIVeoJgHobJiBoDc7wDMQYd4%2FT3bj0Ccit8N9DxSmkITD2J7dwziT21Em3nYK9Q71jkDU0ulZwVH7Eiu0lznK6s4fYH2hL%2BSv0XJUuWErmYm9nymbY2%2F4i3Wqj7tspTAwWT3OXihYozDSrDMRvfpwZi1rGZUhV%2FKc89WYLXFeZmchZVmumUZccqPV5MZazSdaxpVzDnbyWVS7DozOiDCE05PRBjqkAfZnSooYqIli4KN3KLdo01hMKM%2BPbdt9EPsIQXNZdoEVEVndEkBetLX1sDheSZSroCdePf243B7%2BE3K1IkfvSyOefg%2F%2BF5ZES9%2BzSWtjmTRYgANlBOjOFYOeIG1bS2dtexB4naZuZyZuzYfZLxAZGwK%2Bd5t1VXtnMKDOJUMUlm7%2Fkz7QjkP8UysGmEj74PDNht1f2lzfWJqXQ6PqHY7l5UD8mIhe&X-Amz-Signature=2cc2eb84a4f992907547e945d56be66fb45953612dcaf1565eb21f2f58b84431&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RWOJLCA4%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045600Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCFWQnHTt6WE73%2FzMEA7nRbg8P8hY8XhDEhZf2%2FBZColQIgPElyuQ%2BzLTZ5lvlAcykVJtDCSp6E%2BKum%2B896qB0jOksqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDB0pnab6pWuKuD0WaircA7t4VFQ5ZRXe9SGaoYT4%2Bcjo3fWXhlnkmKnN7m0MLLzvsfMp4ykEj7AUdPeRvrqQa3WRIDaKm9UcHOzgluTcoYQfpRkPlS5EHFcraeAiLCoecrccMvCcZQJq%2FbdLVqE7pMnHkyS4Ilx3DBtTxLNYMep8q1CU7HEFrH2j8J33eoFtYfmYUM8tz3PaRxgsdGPpShqxfoCsXh0m%2BuNZsVyITzgFLEja7spqusdnn9JiTnxrxolBxWPcFfrhDWwGXHZNROvZnRsYbgawTQ%2FmQ%2FeUlbbylhQqwPl%2FA8lOt3Y5OYrBEpygVDCjOonNS%2FkGsOsiDfJHh7cNjvd%2F7Q6W35DXyI%2FGch0FoEfGhZ%2FDbJASuixhbyvdYYIG42d9AorMe7IbRXjdy5nOQ3P%2Bzh8j%2FZJU36o7zEv542L8JBMTvzr9fOPlHE1pqACYTmPqBuCFOinjXdx6yH2WKy%2F4yIgzbSSIyejFEhnYzmmLrkNHLaQ9%2FagNVcX5glksSwX4YbMNyeq8Vvz3IWhQj45aNT5NeW8FlATPqKV95ZCal%2FHf2gz%2FuihDOFa26x%2FNLLnojDLNzo6VjtxESf8LYGbLjfidifOGqEkxQsUqHEub7sWTLwRwUWwC6%2BVA6fLHluIezz2WMODQk9EGOqUBvkd0Cm0NMXsPGuWWKbXhcdNDaYZwVSgnNU8%2FFUGnzAi%2FQ5sXAXJveFES2CKeSwEQNxjvSMgfBHlQ3YSZ1%2Ba%2FYnFzfJrdKhHNIhKp9vdgvHmVppwjNhcEwQbEqRi5hw30PgS2m5qKKaOVWmfGoGb%2FJso4snJP5zVVLozsQPhynz6sdORq1VEIrE57sOf7vvzv%2Fv4HnfQV7SB7JU7Z9tVTPmGBt8Kf&X-Amz-Signature=c8de2fee99dd5515f5081b22c6ffd4191c908eb819589f011ced9eb89f0a77e3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WHOIDEZF%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045601Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDBqdE0hUHSzBTwAab4Nhffn%2BUP%2Be9rT%2B3IHl8a%2BkjvrAiAi13VyfTyHH7y9P35%2FGJ5y2DZCfLpphg1S6%2FFzZWbLmiqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMW2IizbftudpRTKC7KtwDV25PNaFzaMsf7QpOy3RV7qu1ZtWlBo2VF1lvhpggLIXeCxKp3GL0AHbUn%2F7ftt5NR6zQnXUfsawdNkv1qd3n4C8VrYkvizaMr86geBUcNDm42iBqq6f9W8bo4Wy%2BazaM8y2%2BnFmjcm6wfIelaRp0Jss%2BsiyJq481U8XVCqnFIs9h9%2BGsus7SaH8Qmf2hzelyH2v70VB1LBOvD3lmPFEVHMK3d%2FVGThCuhh6LBgiJlrKuP5TQK3%2FasGHy1oXk%2FG4fTjJpCcxDwUXCNMbXMuo%2FwjTChJvhgUkQzkKBBeo9IfOPfNLT9XYM6EWSHrSlCTDz5WP3FzI0Cdua%2B7WIPk1kB6q9rB%2FgbZeG31T8tWdaic0tgl4Rvn5NBz%2FSSHhpWBW0PhTby%2BEcgJycrmhdgDCgYqSgIfRbKmI%2FAoNF%2B3SU2rsFsC9MRz6k05Ve0nH6dsQaMC%2BK%2BN%2FKhepO0yhpZkmIDeb78aXqINAR8zO3ptrjlGJwh6wn7LMbefXITxcoieNgOtklGlCLr2Dmptyq5vUATnRCJaD4KSm8uwahqM%2Bl0xZuys7teqg2Utmo6y9%2BiZxGv2eJKn5oeAY0O9p5HV%2B2SchjgX39Xd3Gi0R%2FU5aq1zTuVH1cPayO9CX%2FtPYwhdKT0QY6pgErQACoiEaNZmEWkIFJRFPFmNPagoqqcjZ8pfgGFUUEAXDlEKfHb%2Bajf%2Bqpo1kkBtetBR3H3yPVQOTdUmgdC%2FYY72h9iacJ1qLLnklp5xAiSRvob4M%2BOdrrIPYBYdQL2pLvvZ4aJbA9JkTL0fNVS60hdItZqp4WGjMmNjhZDq8OfCIKOsWGGYnkT6k8wCf0XN%2Fk5jBt%2BqoGaygF5L9tcIcxPvoJFLiu&X-Amz-Signature=93203d931216864e0e439acbab7b12449a312ff7f8d9d830be60cfb0e7d28aab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z4VBN3GN%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045601Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHuiig2xf6ErOKlkp1AQWrlk7RYWgTSmLLMUwbbQQ9emAiEA%2BX9RB2GdVHHyYs0ihXTuag806oOl6vv44Xo5QGryXTEqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJK7o2W3Mv2T%2BlfWnyrcA8Ar7aYl6%2BG0MWBr2D0kskjVVJIlXU6mCTmmhQ5fSuFeATTCcVE5CtAaCHT63LL5fqlxo8dKXq%2BLJsSPqIpWTIWHeIllZYiNlRJENqkgW6Jy2aZZbjJmsPKgHBhbeSaLzO0UuyEgstpXBTJhgMS%2FaVYaE4HvF%2FBY8ZNNO3AvZ5nsE0wtGgdcsBCAiwvzCPtwuEiu%2BoHDqR91QHRCeKp8fhiNjQYk5p1icyXJkHi7jwIGIv98SpcjTUE3EGd44O%2B7aYoPv6xQRQFcWCzG8Al8LBEC4zEws6OZNsT9iFdoji9%2FCtM9fMMRYtEQJhB0XDpvfxzXECkZUBPKmMysPmGFfo7huxVKaTrRlfVZmOy0FQloDzqvSU2pdFDV8cChNQu8Qqbw6aHzXmQMzQXA1Sz99YOFuC2BvUKfszQbV9R6aX1dEbwZCwrLPQx9QAo%2BQnFsDHV2%2B0ypIU8XrmfGQ2NdaOAaov8ojprdtp64HAxR4FCwTZqqSUj9JAWFeysMTuVXa4Q%2FvEWjcWos%2FrXVZUAkQ%2F0nUdK%2BGYQinfBTovDkZnlojFCaw3TfSZrOZoXK1N8p21qgTODTUcVTMnFSKztYLgoxX%2FnaFU0YvrUhA%2FTMOJ2%2F8bKQh6Hlir2tC51yMPTRk9EGOqUBRNFhlK1wy1s91rdzkXaBACmMpbnr3jPSf6dZJUn7b0dv0XXtQ63R1b%2F51CejlIC4qq3NIEzGoC7Pnj5%2B6eBOqlXCVNWTXUjzelGNB2bsKz%2F8vhzFJt9ZLiGzAmtVjdbLU3%2BjayOJwCvihmGbEyc3iUMFBD789Q1Q4esvW92oaKKCLFF6enbNt5rZt8R04CKDywaZQ%2FhTwb5EtOiwO4%2FY%2BmGRoMHE&X-Amz-Signature=0792d28db266a13a4ac3b4f26675c524c0f0103909fb697067ed9141fe55009f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VGJ5IRHC%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045602Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCbeE3s0kuZ3KjSXdsXIXb0H2FM04TTeWDR1EvACbVfywIhAM%2BelD76uDjbZySKcTLPqZDnbFJTrWEcflZvn2MdFMQ%2BKogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igwwf21XrWKHvsiBzEMq3AMv7IGmnnxlqp6yK0aaVAOCbseupcA1nQM7kq8jU5GN1ZMTfDxQJvVuacCBd2kybmviYps7CXQClkQJC6rylitMh8v5LYd8wWFusU5UT3WGTF1Ngx%2BrcK3y2xTOlljyllb4KGzklZ45eUkD9xor163cV7RCa1szhpbCWqbZ6Lra8%2ForhREOaQLMCW7nAegbnXHsgCzwFgfPJNtX6N70Tr0DnrMUA6opya4N9vpipEqi%2FSad8HeJH%2F%2F50f7gJr81%2BpzOQWYcmCx1aM0BeMBz6kYTaXLY7UxELaw7ulbqwcv8CWHfvixQUfftLnrCXlO22%2BjDkzbqyuyAfUCZYjdP8RO1YKgAT5nTNb5keps6IbCmO7ESKK57ly5%2FGL5YkcjDYD7xTQ9TCR8IOx5DuLkeoi%2BOagrDCNkA16%2B8HDJDcUJvKLrPDnZu8tiOVcQ5JO1PcMenGN8Q2cefR0tr1uVqBFRahQFrdYHKeEwX%2B%2B5tFl13CvHetAFd7PB7CenJ%2BzzWHSp%2FHEDLr28qKE2oI4%2FcQzO1oQYrjb1UnznaQ%2BownZchgB9cuXgbr%2BphAgm2Ob3YerrDuDrRxHDMOiPNPTTfH8QsHat7q14GZC6FMi6tyKHmBg7a%2BOhWSpaF%2BpveKjCf0pPRBjqkAeqzL0BC0dcvarhronRWQdwmOlxGWO9eAIIzqN85vFiMM9ws4HdQEGQt2GSSzqT4j1Q699ad1Oh0eImqdWkQS46yVRRWmwmC6Cv7VPurk%2BZxo0gnI6asgoku8%2BTareZaB7TdgqyUXSM%2FV54r%2BBnUcLV76we4dkDxSmuRk%2FndaiCK6JfA1mQJwRtBVTl42Ha2MTHzw98Eucx2BPRjn34Ma%2Fini2eI&X-Amz-Signature=96bad0b5cf93582c0737ead151d4a2149d91285807ab6b1a2e2c3c41a88cbd51&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662DO7NCRW%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDYDpDy3JqiMad2xLDuGRU4gzjOAa4QQehsrb%2FawjaRNgIgXKVA%2F%2BIabjMj9%2BO4itE%2BDvz0Saa84Nyxg0B5IEZyWFYqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDl4fxmHPYFxdFlhbCrcA0dJNQuGNgeZiyOeK6PmA%2BbYEwECeoTSND2y1cdWIujzIQiaeHlHkPjHMyldhRL%2FpaSkmkP8oAy%2Fw0y%2Bz3eXFGM8cTNb%2FL7zuFgbpk0ZbORsa36e6CLExql%2BeevbG7PzyRUVtjqyFqSV7%2Br6jkeo6ONvyD%2Bu6%2Fx35ADfboA1peIbxMjaJtkIpH5pn98zhJVpwFjzSuudWwPgMFoatTnAepfw%2FN9Ejca1kIUCpw3wBMHmm8mXsFj%2BmBxnEhCBDc2EGcquan8m%2B7Si9HWjvXaiYt6%2FEj%2BJm%2FqgSB%2FHEiIy4rzNOy1GSQhl03doD%2FDt0jRNaC%2FgC2KUYeDF0wqBY9CPERzyJBdVNR4%2FnzYDFwCqQNUNxcGbfRL4B3yjiXxV9nbL3oXcCiA7p5%2BpEt3fVKxWsSL5kvhqhOxwS9YdenvKIjbchJHhMoYbN5prLlEjWZ1T0Aot7EURpt2qTIzGcnez%2FDDV0Gy4QMj7nt8tKWF0G1g98aHHD%2F%2BgYdqNrux66SyU2O2aX25ex%2FoMiuaM64q2aH8%2BtkvxwfnjWr63dZZUAHvwnMmfkOJcjXmiUpJvlFr2tPMVhUvfH849vNIAbe51hlyEMVJaoCk4iHUsDeeKZZ8EKKFKEZ9m9gyPMU%2BIMM3Sk9EGOqUBtApB4LvHuklfmotwtRdcDFP5EdQUAU182%2FzFrINkKT2xQMUvFNQQ%2FJuxWwnYmpcEkYEnBYFr7djH6afq9GD0bJ8uCl5iXWlNKqddQG9sDX0KDF1HxNwgpeQ32Oytwsf4ToYZspobGWO5qNCDXkQuWeHRDnh6DG5sXhN%2FxTN6rTJOxBpGDyts7z14PiR4KptNmkBke8WXgi3hk2xdTsmy%2F2RolPOD&X-Amz-Signature=693443e2f84cde5c988f2be8d61198397d894eaf8561ad21cf6135e9ffeba323&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662DO7NCRW%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDYDpDy3JqiMad2xLDuGRU4gzjOAa4QQehsrb%2FawjaRNgIgXKVA%2F%2BIabjMj9%2BO4itE%2BDvz0Saa84Nyxg0B5IEZyWFYqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDl4fxmHPYFxdFlhbCrcA0dJNQuGNgeZiyOeK6PmA%2BbYEwECeoTSND2y1cdWIujzIQiaeHlHkPjHMyldhRL%2FpaSkmkP8oAy%2Fw0y%2Bz3eXFGM8cTNb%2FL7zuFgbpk0ZbORsa36e6CLExql%2BeevbG7PzyRUVtjqyFqSV7%2Br6jkeo6ONvyD%2Bu6%2Fx35ADfboA1peIbxMjaJtkIpH5pn98zhJVpwFjzSuudWwPgMFoatTnAepfw%2FN9Ejca1kIUCpw3wBMHmm8mXsFj%2BmBxnEhCBDc2EGcquan8m%2B7Si9HWjvXaiYt6%2FEj%2BJm%2FqgSB%2FHEiIy4rzNOy1GSQhl03doD%2FDt0jRNaC%2FgC2KUYeDF0wqBY9CPERzyJBdVNR4%2FnzYDFwCqQNUNxcGbfRL4B3yjiXxV9nbL3oXcCiA7p5%2BpEt3fVKxWsSL5kvhqhOxwS9YdenvKIjbchJHhMoYbN5prLlEjWZ1T0Aot7EURpt2qTIzGcnez%2FDDV0Gy4QMj7nt8tKWF0G1g98aHHD%2F%2BgYdqNrux66SyU2O2aX25ex%2FoMiuaM64q2aH8%2BtkvxwfnjWr63dZZUAHvwnMmfkOJcjXmiUpJvlFr2tPMVhUvfH849vNIAbe51hlyEMVJaoCk4iHUsDeeKZZ8EKKFKEZ9m9gyPMU%2BIMM3Sk9EGOqUBtApB4LvHuklfmotwtRdcDFP5EdQUAU182%2FzFrINkKT2xQMUvFNQQ%2FJuxWwnYmpcEkYEnBYFr7djH6afq9GD0bJ8uCl5iXWlNKqddQG9sDX0KDF1HxNwgpeQ32Oytwsf4ToYZspobGWO5qNCDXkQuWeHRDnh6DG5sXhN%2FxTN6rTJOxBpGDyts7z14PiR4KptNmkBke8WXgi3hk2xdTsmy%2F2RolPOD&X-Amz-Signature=32e7b44d5cc289783cf825ad3166549bd53a9f3489239e2830ec272f7e7cea89&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
