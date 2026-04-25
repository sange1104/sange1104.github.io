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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665PZATEFA%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033105Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCAUfwXUVZ3rpqQN7CJA34%2FfHTf8KyKM8QNxApOBEZkNAIhAPZ9p02O%2BBUWoD8Nij3BzxY34itvduxC68oE9JzvAAv0KogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxcF2Gx9TIydVV0tS4q3APiv8GbQ33XIapJmolOdXVRZAtQT5SfKBtXDmhO9okAA6oe%2F%2FxoV7BgufmSIrwBYruhT%2F0PuvvCRyxiZuJwYGN0o0N2R%2BkUSSklA43kxVhD3cG4JLS2jgfIFFsPRlembj%2FoS04OledWRnTTJnT8e5lC6DWGadPr%2BzYJhWOwY1ug%2B05WqMh7I1XJPyEFfVkFujwFNhVBaHgVG8iQqHb%2FWrFHhPnbCZlptIPYu2TylxDC7bXT5SU1QLNyfiRzu8Wlx3hcSj4EI7Os5p4m%2Fi2ZBYy93h8q0Z4L0aK90DuQ60PPRrz0fqvFK1sfM8YkHH%2FP%2FCFPsPt1Y53W3XLfHTU5N1xKGvTI26qDRTZH4viatqXqnLg9RYMhAVjbAvDlLZ%2BL0o3xYlf2eFmSLyeVkGrnFQxv%2B0udsR%2FqQyB3h2n79tLGWISHf7rU4D0C35drp08EWPl4NORHF39eHrWKog6j9YDdKA7QOtFqpW6tWOKFvhKx3ESFLMB8Zyu9Tub7MDjRmjzttmXdAXuoPOM0AF7s3eDw4vqgZ9KW4JV8Ite%2BuHOykLbXrqAw%2B%2Fd8r5FHnYy3ZFwcnVPOOXuRrI2TtX%2Bhoow8SBa1SWqZ05%2FN2kYMzFckF%2Fj%2F8vNRiQpMiIygSDDO07DPBjqkAQM8zLe1j8Sfd3Sny576iUTkKAZB4VdYxeJZTXbM%2BD4MEraZER7DdoUPaEj8EJ5Vof5N0Uh1lsGkaG8TXkqGAXZM1TOu0TbvjJrRMxCs5A4kW%2FDbl5fuN3C7PjOsOB%2Fsd6qZgDCAEmnYIiCPtiF8CCHf5bxDiHbXL15m4Qf%2Fre%2F3yMs22VndZMFR6Pu9LRN7%2B2lOng90jUHYrOI8utt5u48juGrm&X-Amz-Signature=fa8734bc22120a58f6e639c0a99d02b5ed74fad16e85be08a52c3b5217cc682a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W6QQVJBZ%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033106Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCP%2BGQQBIKkO4jCgIgfcsou84qPBOpR%2BrLtPU0qP1btUAIhAN1FGGT5zRdT2ubZYeR%2FWv0K7WWgodHVkI%2B8gIEDgJ92KogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwXDABgOotO%2BfApORsq3APQ40wDDH7SV0ULRiC4vyizz%2FJQQJqM6D18pBV9mYvHhGxDu6VWUaUjF72SYupJS8nzmrfcOSfhJseZDZo6CENlpQimCPNALxD90PPyhXg%2FxZLMoorMl%2B4Uc6tjLAuaTYs5FQEzu3U2HGnzGH2Tqehd8DPiVS768FjJdcS2d3qS6Ot%2Fs7IGcMCpe%2BJbtOvoEw2ANlrQnYhj3WnbmzZbjFEyifyGjjTNClCleHa2tieU%2FKVJWpr648sZ77GV7%2Bcbc49evL0W8oKFOdjc7pegPWA2udT2KNhEM3snH4Ycypc5ypEkCNcf2xZWycxWqQGkNssbIzOyC8gsmyAVZ8KdbpqINqquaBtgoVbMY9FjEcQNdj%2B%2FHCnqCm0lWYKt3Z9ebqfVPll8jjV18oeSPwzLStpDNC64TjNvxHbrXPRBbuIw6TzPoXFRNg7TQJ6Gx5WKrPW9YI8pCcsS148kX%2Fx0BSeI4nRP0fQMiOWoFwKzbYOxMfGP0yyLKA%2BEv14COcv%2F%2Boq9%2BU6gS9%2B7bsS6vZyM4cDcFSsV%2Bq%2Blines8a6XwfBR%2B7ZFlX2kfcheP%2BfL8%2BKqy%2F%2FC2%2BIU10Yprs17tEavuO7UpNJgdGyPD9nGDK64Zm8vS2HDiAEfhawS453mTDC%2B0rDPBjqkATew6QnIzoqQpFXY2X%2Bv42x2poCeeRwux8gGMRfaOUJ09pCC1MLImX5bUjHTAjZ3kcFc8968%2Bn13OfTeLCfjNMqKUEH5NEQEMzIEWo3zpV8QPt5nzIlXUd0q0DlAAIeDu7tV6O6V0zU3QEFspdmNXmcaoxMT26IWfTWHacGydK5GWRL4Fr0UH3p0EUIRfPeiTW39BZ68ESqAcc%2B%2FZT4moYBCrGKV&X-Amz-Signature=7249cfce5184b2f78e81aa9da81990c9520136a4fecc72e2776fb9df8e81a472&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WY272RYU%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033059Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD%2BOLjJs%2FIpOaiUeP845U2vokJcWBAH2NYHv%2Bj1mT3HJQIhAM3reu%2BDKrzfIvQvhefSfHy6zqybOI%2FR0U3HMvWn%2FqgsKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxyh6tGRaFH7uioJEIq3APdFj%2BF9%2FfLnpiZkZgovwDJtjFCFBrVSYZDwMtCu585ifi128wwPrb6efo1a%2B23APy7yyKzdv5AewYLmk2JANbTtUA9mk9r7Ql%2FLLHrxzNhChyzfFOk1rMkGuQ0AHJBI9Eixe00VlPAjuwkOZ68ogPnANvUlr81wch%2FtViKfQ1Mo%2BvAJptHOekPJxNYIjQCW%2BLhL5Sv8ZXOm0hH910SnESGxCFMo3yLKcfWOnfTy25nE9jQ1FcIBYoKylVd%2FUVnUFeORYRoCFgHwVjj8jrO6jTXgchHbBv8vxCMx6zNdauW%2Fwg60L1%2FBho6FIrK%2BspyiBTckctovALNs9iDyDjMI6IyYhBMFv1HUzIz3x8bR58RclxNvmgYJNqBQQXEHwKLszWfYVyZpbA4vZS6PPhz5gbcAU8yhjL6pVFrVrFPY17Y%2BoFK%2BJR%2B1GZtATM479I2AFfZ1zjVZFFJkldtTAiC3kJtjvWdImNRdR6Okh5AsttR4teg%2B%2Bqgp1DGzGqgowww4zAP%2BLjrQvpHif7OBSz7y7K6YRwZ0XOg6BuG8P3e4Y0FBM%2FDhAK3u3n2kKFHiHCh2bH0t4FEVwl0ve109b4usLi%2FsW%2BaKazpjmwGcvbZwWLoCR6ikX77zh%2F8MiCbQzDV0rDPBjqkAehQ%2BK7o3yFeLhCJkQp9sfDuOQ4yNpZtuqIhRoQ7up5%2Fe4kk4KfuXGKGHlbifBBO9gJ3gJNvun6S5uWGyyG%2FdVy8CAa2ifRSG2kJ1JUGGU1nTiFS0a8FApSVhCLVmT2a%2Fxny74Ji98dshLBT9UtjU53j7dlfGuneWB7r6QNCQj0xmmkB08lcEd2LvQtTG%2BwwwzNrpSExU7st%2B2zb06Tvla09Zn2d&X-Amz-Signature=85538732c0bef9a06a1fe537eb69b426fa3103d56d990462c6ce2c5e455b81bc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RM66T6W2%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033110Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGqXx%2B2zGX97eK0xB4Mw97dx7HifHgp%2Fedcr8xUFoPChAiAVm8Co6S9EElCnL9i2arMJW%2FE3GydxSjyO%2BdbzTvT4fyqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMvW3tDk8%2FT7uZUnJ5KtwDrZyp88B9GqNcNM7XyCf6yNOeHam6slqjct5zxqLx%2BxLkV6wNzihRN99Xt8OL6y6uPmRkr%2F9LDu87G8lxEHEfIabXHmf5fnk1iiRrvMUOb7S6bT96ItHMwwCg5VuIvfM6HwM2nSALXe8p5Okus0zWmSFT%2FeM9v5e1blPGBgAqqBAMM6Pob8bMTb64h2a5S6bh17QIbWQVZMpdd3DR7%2FP8HxQcbsne4skLED0giRuvhhLd9xDk2HhlJUfTsBBJVo7wXbbo2xjIysQ0v17k%2FQ1hi8L4qtjh%2BRZX71tez82flMl2IfGSeVw3gCQaDxQAMY8OnwXSW9MbyttiixlAgR2pr6SpDy8Ic3nfmuwtdfXCJP9KM1CFPAWRroSgmPkmJkQvmjnzQsHRxM5Ev0Y5RAfi5zO6smFsIWMe5291Rxm85KkWOzusAbFx7FFJkt6xa02yHY2pKbtFJaKaye2map%2Byok%2BBf2pietpvBRFO2S8savudOM4yLP18ulifpPQFq7QSz5kcd3Np%2BU2q1bwAGeDrtfrbvaY2WxfLmPgJogn%2FWJN%2FvUoKpp7uEUz1hxqGuBvooSF5wJ%2FHFMNFyP%2BUaxfkpSWyacwP8WCIbtRh5SWklQSqtLNIpAmTUC4KI04w89KwzwY6pgH938%2FRJ8yJsS4bKDvTBsAxQkCr7Fw3hkzz3jh3CtRIumMMkuTU5ZPR16XNlfrWpmGSNGIW71MrmIwqbt%2Fc0neLMU2Au7vHiGqDur%2Bb6LdNwlxGqBmT7CIlPPeuYWkgAUzA2XZZjL0tsu9fWtXQsp3rev4fJrTDZ%2BwQF1z0sUh1h1OBEAJprJgt59xyt2vyxoQBN%2BBo9fh1N8LOnW8fTAKBCi91NjDP&X-Amz-Signature=8fb3e7c88c8aa5581f20ed59c3b54fd799dd83be0513afa698349ee601abb409&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TZGCSPFB%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033111Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC22zMPsTl%2FOOl8c6CUztQoVRLq7PlOQcjm5Y69dP3FFQIhAMg3qNPPxZ3fTPLuOl%2FZABM0w5tZ8TF67KI3l4AL0saYKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx80WepfMMJAyjLJiEq3APppXVrBJJaT2uujNtxobmTxZRz%2BNRpuFSh%2BsbcLSVBQEvKtOArVpmkU5lfWYTqMfj%2B3VTtDRkzu%2Fz97dP%2FNL1sVQWV4RaRAiSZgkHxKnUnw9qvKft8B%2Bf%2FhLhrtrU1QFZMe6nX7P3LYQ%2BIMQmbI%2FwRifiR5xUgIv9AIMwYovFULhTjaVZvk%2BwJ90Q0aLzAPxgwFovQN%2BjPNyIWQ4Fgl8DHmrxNevCck1A66owXmn%2BMtzY3VXSLWty1f%2FslLolyb4hGWJslHV%2FAqVZwETy2XwCQeOw5YmJ3ngwlhTqU6uo%2FTkdiv5bLv4wAX7j%2B8rGPDbsduKv%2FNnpvslpNSVYY5uOEg7yZ0TvfPNMLrM6CddtZgJvrP3KTCB40xRigC9LqBymq4Rapdqi6Hhn05jp4rUBdogL7WTKTstnS4sapJZ4veTd49QZ9cVEhdefnj0Z%2B42KhDa%2BSakO85qoqDm0VzylRWrlvVbpv4g4UTaBLMOMacnivzmPPXRvERlVaTXEgRlp4jmoi%2FEB8X6hLTKfeon6ms7x6Bw9YdYXauSdkGpyQbFL9oa%2BZDqfkQdmsv7juWMrUQrvvw%2F4pSXfNooXNazwCX0evofl5uj%2B%2F73WxKw2zlBBQOWZo7yiVvnginTDk07DPBjqkAbrB8CG0EfRESpN9bZVVpUmoN44miTqg578TgqM6gqZIV4lN6lkE%2FaGCioROAAa27k5mFnKtFEO1TIAniLKDuyeSS5fhCmSmT%2B9UHWdS41lTnxK2rZn1YCahTZC9wHvfcMQFJv01LDPE%2BwZh2sAq3r90ErV0T4IY9ijRW2Lq8XoVjdfVga7eA2ArhGjvMJeexuNQOqhs%2FmBE8DG%2Bem0yhbaRvpEH&X-Amz-Signature=70af00552abef4771e8133aa9f70a5cc185d011d1b9bcd44628b1e3dee24df61&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WJB5PHLB%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033111Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGCH4CNI7%2BY5ZuvvO5Wv7pgdgw39waclfiaS0ZIWImhJAiAFfImTrgNAOuA37IFOnFzvHZdWuCWYXV%2B9DLoZPEjiISqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMZlP05d2loKKfY5f4KtwDjiexsERNcITAsc1YUtEH%2FCYfp5Bk1gxF2BBoKFs8qSWhjNosj3e%2F7Aen4TbiTJtIXhrK3mdcK5t5T9QLCBNmhQAVSAlSsdoR79wTBC55B%2BK4Ex9gFoCo5SWYUG2C%2FzlIhqM%2BBVqlApiWImEUN6OS1RoYjt5icNTAwaM8j88rgvq1gcPK6pedPVDSKfum06OZruPN8AEnennBcoSQixiCNoenl4AQPl0YVTb03oB8AX9wxVPlmoU93Gyo2AMqCiICQrHWJsaeEU5VxbvdMkn76XONsNO%2Fk3B0c11w9UyiWPhgEgiTaALmC9QC%2Bm6Skm22DsWH9ONYSA%2Fbhxm934SGkor2j03JhU1MT25omcYJfkAv7%2Fn5%2FJG5Q92Fi%2BeFONHXjiHG%2FIimVSdpO6ejyYc%2Ba6C6LGCwsU%2BBq6dwX%2Fydb4PGdyk%2Bacy2O7OFSYMgWT6COeQ0KVO0gfi8a2ogSeBcZg50TgXD8v1ux21e6VAk0nYoXHTaVH%2B%2FzOdRBXJrKTvbHkb335h4mFeEn58pHGgeDIDAF4ohJZiFhVk8WM%2FPIY5W5NMJ%2FTP6Lu%2BOClozj5hzACXgs9pAVI32AZtg50%2BhANrHNsVcJKtQPdf9vJkxtSmmKE0KtinsjaZ5naIwsNKwzwY6pgExJCQ%2FyS618WZH%2Fd7N7bQTwjwWEGxruJCMfdsDddAHAVxHMNITFBdDwK2PI6Hd5QE46xcquiSIb9%2FNKNtNMtXwEkYkDLqrzZZkSxgIufA0igxwXfAy%2FvZvmNn1ReWL%2BIBo9%2BRBXNneLNaik%2FwGUe2ZuJ2mCyg4ReyITp%2B61MgsQe%2B1Wv6MxqQH8Jn01HtxE4AwdRnmu%2F7ip7cl%2FcieEnbHkeEHmPsV&X-Amz-Signature=bb77dc5c7cee5e1c918cbd98173460a9f371fdfaa64162e6fb4642b9ca20c261&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WCWHMRRU%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033111Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQChwdpbbw0%2BVJpSPEvmSNY%2BhNNE7srAry069mc9R0lUfQIhAIKYz1Su9xzXfvxcEOS7VQZ%2FeHaUXfXQk6Tbv9R%2FP9BgKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxD0JCMjWzM35K5hvgq3ANFnWHyZhl65SUIgR4AZiPhSwR5gBIz%2BfcF0mxdB4BBHHMyvxFe62NE9xUcj8l4%2FuFrytOk8%2BgFtgfaNXjRDVj%2BW7BIc8tGNQJd%2Bwf7Bq0HizceVpQpzOPP9Agh6p2uwk63JsGqgMEB5KSEs6bWa0e4zyWuzHZqOTnq2MdQeB9ObhSmb8VrIKuFG1HQZOm%2BWuX7%2FWUuIegulHUTbLuS6RpDPCa3D%2FRbDZRZsnIgpRDEvfiDCwrxuPhsl%2Faq3D7Nt5XNlBiZwWMuIIpUI0LanPMt9gSuOwU%2BgG%2Bbl7ltGCdrvLVJOjcNrl6yVrZBlBd8n%2FTa1fIGF%2BSCkShSHWr6TNWq9o3VC80QDMwyWSINdcMKWdhT3qQAhqN8PxzGr9PgnwLAF8PmBO0fFQvSmpTVMTQZV50pwcqsiEVZOr9unDPXQvxdhPc2bZcxJkyymUQWLqS4XA7Zo5c2rI7VQd2rguwRUl1VzPHRcF5BQncXxTiuReuZ4ud3typghUFEpGOlD62CIsFiecrX8FgGoQnGBl3wAz57s5pk7DIYAqsxarHs2U7J372pe6ZUG%2Bu2AWpCDtUt9wHsChOcox44yl374MxrPmrHx3Yj2JyZgX5BGW4kRXWy6h7%2BbQiUaH893TDh0rDPBjqkAdqsFASs7f8nqkz0OAGUtahU9tIT7QWkrCtvJR1FoCidByaXWwo2PaduNso66HcSOYUDtz4TFTmvm3jY1Djh3yb74en6Fzs8gZkK3Id0oTF3ARIEjgjR8F3YwNOFhWrV7lZ1zUnIQHbFdmt2qWL1YE5VOAWJhZTQy%2BkZpnHCqKezAqCVBjJ3shYjhBf1%2Bro2suzhcitTv7yiiG78sj%2Bq2R%2FC7mP9&X-Amz-Signature=b12affe06c4543a492f978c73e44d0b33d0803b0c86a8f60f0f5ff80a095a7f3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666F2RPYZP%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033112Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC1CK9pvwx5%2BzfMNBfvMNv4kMFtkWb5o0JX95NVjPnH8AIhAPZietWYjB8lnXAjlA49PI6nRj%2BhLhlcSw%2BFYWC8kyxzKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwYnAWDJb77bwwaH5Aq3AP1oAeUHzYQMfpEJEpqaWQkJudInb50B1se7DIsAiLvLAXImqVK%2FI7oVxXeFe%2F%2BvzmX9Yi5l05cqS9BtoWHV72E32Ro77D1HvV6z%2F0%2FlyXgoOMhOyKQVtKq7Q81pED9QqEt0%2FA7Zy2JO2i7JlZ6sEJgVExDJ%2BIoYDuiYt2JGIBldo4Bia5axjjolnm7aZFSelsjG92PhF9iYBeqxriRDtyFFUatuwidbBGX48ebAhsFZy21F9CKH3o0ZGHY8fKIEno13E4pKmerDeh8t8%2FGofFFQwkCWxwBkZANnqrzmscdgyKY3IpxScRmNYDfOw0iYAkrJuwZH1gE001wtc4o%2Fqg3aj4TeCcGlVY1lHob2WJttSRleC78WbBZq%2BfhymOUuZBjO%2FpRnuuL2WmC0xktn1T6YOztNLSG95lkg04tCJuZGEOGQ7KOqr3XpJ023MWfEVarTa%2Fn0FQIPNlu6jpWrCXSZ5cQmmb0TsUykh533B0qjy9fFzi6FYgGhfwpN6NDjGKscLFaeOAqQ7GTT5bg5oNZyo5iArE9apyyjAq1VSNx2pAd5vq3Syl4nIwNqdODDKA06qaMUipEhIsPqIIlDSWo2WvDRdA6toSiDd1bPPiXCT4td3lQO%2FVZ%2FvgwbDDl07DPBjqkAX%2FjQ%2FQx%2FSL%2By%2BzGyMr3Fzt7Qi9mg%2BNLBQQq6Njwu7o4Vw2EBZKy15AKlqvGVAam5%2Bx5efIRdXknsl99N21K7sAtfddQLYf6XCdEqbkhkjhJtBGs2Zjb5mjfTilHoxqIu2MOLutwGJ0JB3sVQ%2BRb12KHTjTqrwO7WZRdD%2Bc%2B8pDIwxixju8ISKAHC7MXolRVLUajTXziCJc62N8IDv8Z2uiNPebC&X-Amz-Signature=5b78859114180d87d6f50758411400eeb2c36f907f9e7d6e3fd1ee2a2fd9ce3f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S36SDKE3%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033113Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCaDVO60IngSK0qoXKjFHQNLjIXh0N3G7mrALkeTjQqhAIgPUd0mFYO0FFSLSV%2BqrmhhRhdssqgEA6Hso%2FRmucZWMgqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEJG0qhk1cho7MpeRCrcA74ZBnB8YN6cj9Mf9ReQ%2BRFFY9j%2FnJ%2FLHw6JGao4aG%2BCaf9OJsKL5VgNVNgsbgYHaWVI88itY8eY7HA7Y3t0xG6JOf%2F2fLu0vjyAkEVxG%2BNmsCcTipGBInHLWQ5POH4SGxAHonTlaFofMJ2ZaLWE3OaDiV2NMFGeK1wHRZdznIAPDbFJWZOFi18rKzsALNEZPqwidh9kGnMmsWYUC%2BuScVdf4MpmPvc38m94mCWi4tbdexan2wcvYsDqkOj3tAsj6zv5qBRmHSDCGEmbRhuLKJMfQQMAugw3ZTyynG5jCjWofQYPXyiaHhNNK%2BYk8P24C2LmAo8Y2VzljPuQ1LScHITGviQVJUUp1c3z%2BhZEwnLih2yNErZ26XF0qjGbvZfbRVTo1I77Qy2ZDNTQaLukFJZeqdF7kYpuA1ggbnw5jfQP%2FbCsiT7RPsQbUkMNQEaFgwtJMvne%2FKx747YrYlyYJCheHfvu9vTu%2FI9rN88kzbvoWDfHPuIxnv5sqgBPYyjOXDMWCNxm55dnCqOrN3d%2FR5knmRNmnrG8%2FmVHIgbEYOSt6XFLW6e6Zo91X0XVBnyb7ILiEEAwtE%2F0dzrzhiGTwtrgWa%2BCJiubP18mN2Mt53UGRD%2FALTdq4q9434MWMLvUsM8GOqUByXWYaRpptXebFznyKV7IEL85tYnq9%2Be9ySwYXjj8uyyiXm%2F8v%2BPpOMN9MchJWIr48MLDpK9A3pw1TzBjNHjnHpRRCbPvzH6h9HNJ6tY3MxiZYwIlWG594fYt3erbQJzrLWtDKluM92c0VrI%2BxXb3QNRMWMbd%2BX83b1GQMR9eNbNqQrJ0MPU9H1hCHgKQtetEk5g9mVWT1mi%2FhDLH9e%2F%2BSch51xPr&X-Amz-Signature=e133131579b6c77d91b34551c067d5e7417e08bff51d35d87486042ef66b1464&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RWLSF25E%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033116Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDCp8uZfF8VKhPynBs%2BNG7G4GdYdFVhHSPbay2UTJe71AiEAzTYv89p%2Ftqe1%2BrNaYdZMn0errIRjsMG%2BXYu3HWkBEssqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDG2jsgKh0PW4nDoOFSrcA2X3G3cEvFA6tCYa2JgVehXboZKrq2cOtTlmwW1KnhfNgA31HTSkNEq196LqvnlzaLlpktmvyM1ST9qBxS38aHu2hwAy0XNoLqyS%2FV7slds6A9qfqbm%2Bt4M8QXAttbxdZpw6AKBhrtbhGAQFUfGSU%2FfTP3br8BhxcAmb2BbFGeXSA%2ByUgdALqhvJeQnGKtH286cV9bs%2FH4OEFiSECuB0Eo9R2%2B0cP10HTBhyPbi0sXNbXCIliXHBnSYLbXHYfYM%2FGLeRIXXnn%2FHNRCl2b25Rx5H0xh5PSIbR7llgUjTvrCWkqahP0qhrDc86nE%2F%2FdE7%2BVmvlKyEwT%2B%2Bnby%2FLNyh5x%2FoCPsh4UxBep2%2FXbGFthF2MbgCKIjK0ibETpcNcRv56U%2B1jCbhYtQaZdBWF7YqNyck%2BfMMLX2yZdWSDswEnXiNUOo7xg9t9UO1IrCqEgFGrKA18bPxvx7kAbgS0G%2FcACSFAbVaCK3DR8WjTXuhVa4TMSlLg2Xk1cxVI7pjCIhsPoJuDL6OsZP8iSXgYjBQXbRNwXZ8BIEgEg6Z5taw8X3Zztf%2BLXq8ngGs4y0ox7IvqU5wAFQrelEghHD9EezxiHxHpuP0NycDsRxrCmxZR5H0RGfpE%2BXuUfFLMP7eUMOfSsM8GOqUBKERwjkjG7uR9zQEPDg5Ujr9KcZX7JPLlOoU1W3NCOPEAo%2FkVy9Jy22CYEu9JmGVxGsZRuudd1jXXj%2B6b5trSR7XDuwhuRvT%2FWUgRNzXH0FHfbsuiGHANc3VU7oQZRxIb%2BodekrR9meBk%2BP4GDr3rAG1HP%2B4FUsaWywL1nJIftnHVZJNmFWTezLjkW%2BJtz9o8EQQC78KTZl3cZM%2FV3CJ5fB0rCT3h&X-Amz-Signature=f6fc389b168ec93190fdd58c5c4c0266628d25405208be597d998707ea454512&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XDQAGNX5%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIC4tafG70BpAoh2cuzN5Z9p9uLe5BPHQn9TwsrQpgbOsAiBAGks5mMbaH9OHHZfrpYIKVwPdW7eEE%2BhgTbqYvy%2BPkSqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMOpG10dJrPw2oxuD3KtwDeyiJ%2FqjU%2B2yl9ALtAMM%2F49aEnhJSHWOU9D7gy%2BO1ieD%2BZZSs2FLX5NV1hAWkN%2FMDaQer2zW3U%2Fwl%2Bt34GCwlxX%2Baalp3Zp1qhaLL0SWpMjnYJS0Bi5IcWD0jK442wkR3S7JtaSC5u7iQ2S%2FUE2jSGDyveEdAGdbopZq0%2FMeezk2J%2FBdWviS8Qb7qtzZW0ZILruXAV8Np%2BtDPL77eIuwef%2FexRq0eF8XQt06joCGDpc%2BhH9B5vFJkLC%2BCJyb5YtVI7bUiFYgsEWJJg49snncAT%2F0gxYhtUEF0U4D%2FVhB%2FfSUsx%2BZwhmJ0LU%2FO%2BwkLLBIMj6y8CN4ipwI5vreIG6XWjfwiBaj87myh838BgiZOYiis2sfeS%2FiShaz7TIPmLhm39KWUKmjeLVcJSf5%2BzVLQLQv4W%2BrSsnZICtz5urWfxxvE5E2n04Go7dkSfGjrBqWJXZhdViOOEBecR3nIGRxTvFX05JQQULsSNefMd0IafRnJleKUZrajHc4CT3PqcBW%2BqJ%2FwA93XNmqbmEST8NS27fUqjsMMKaZNT79f8xM19LU3ONUWpZYZIyqdF3KbuEnXF7v9puTuMMSJX3p0CCcH7LTZ90eAOQjjzB9SwuOxgTrALLlopo0bAhNdiOwwpNSwzwY6pgF6txVT7LfuW80SE659ABw0cM4BkLox6jwsL5oQ2T9xpw%2FbxfIznq7yl%2Fkw8q6EZyg0iWqjsCcetlxR2veF1HO03YYFezvRHrJ15dJ5bGkqG%2B%2FLeI5Zy0rPiPMoY8fig90%2BstF370IhIyF4MOcbAv5rOruQU5Nc3Scoh%2F5%2BoaTgHZTFWlZ71%2FsRfCSbcQCV6L4UEg68Aefv%2BTW%2BE8xm2WX0SBsbVGYX&X-Amz-Signature=a5229f1273ebd1761506748ccdca420aaab8ca47c2fa77992ce3c7ff6edfbdef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665XVPACWE%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD0%2B%2B0Kz6rIzUfH0vtSOdDSyZq7vt8XnuX3t6Vm8JbcNAIgRtNXbLhcqGKhfrxbmMHClgNgKbVwNFXZx%2F6TYITDteQqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ4cp%2B%2FuJf%2BXtJGJRSrcA7bhVIeAyPzqqbnWdIQgx%2Bf6BWJk1mYqW8O7Bt2G5ArIGwvgBwr1Fh6RMMpSWes8WD6Myx41A1AU1GrVXkgOFE1n%2FT7F5TcyEGeOOoR0ZMqhdRSEpk21xxyh%2B7lbJV751ujs8BAI57xiWTILuJR9DNg8rUwiyKOPMJUjJ6ch3nldIgetcsDTdH9MJ41ZTnXXFcf4Dh34MA4JLUD1LCZ8hAahnO600HCz1BZkcpyz%2F77XiTY7xYgVyyeQh50qqIoRXzNCy3lCr4yBXJg%2FQRAnbtUYsNgUkchE7fWLQeTaPyRnDnhjazs%2B7Z59p58XNfILYhR4ZlGVOg5APrHjqRxoYVzp0sq0bCan%2BNeGfcZUfshKxhGNsakwHrKA6G0LmZqM4UPAj7JOKNVwoQma%2FJFt7ZysnrtsVPmz0oQVvtkudfbyhBZanJgE7r2P8WY%2B9A9aEuIrtwL5KFdytryl5YPNMyGTewSl%2B4xu%2BdLN0ByUm1%2BN5sc6nMSZQFUMpQn%2B5gORSLb684NsYg%2BGWW%2FN5JHkBxgJ8GuLeXtm3JjnekAuSJO72XdVPhUfhkZApo5Jrh1WURt9TpVHTM2LiUB5A7cGqydLT7jmNA%2Bx1ikECgRX%2BT69pdVia%2FTNx3I0epPiMIXSsM8GOqUBFLAwXMc6kv%2BT3tKBv183lkWEYQFdoj4PYPxRaQfHT%2FdA%2F9UVadq%2BvTvzUYSoCA0wHc2ctJY%2Fm7S%2BPXseFOH4uKD7AYkGc7NbeDv4v%2Fy8HV4G4%2FPxZ1%2B1DvbPy6jL2BekWNHpNkOweNNBliRAS%2BJMZt9jzLp3m9wgKrXdWvEFguyEz2aePO2hH%2B0JL6OzL6cpuQZOlBgMgU0tWG3Quw8K4%2F9FV4ZO&X-Amz-Signature=68048c7c279064a538a74ff462de3c2c58cea5c65dc2272212b6ce7a2f26b272&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46674XLGWI6%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033118Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHAKjKAqPIIN75%2BOXMPzrcJIJ%2Bq6VvRGHgMYjIVHkIlEAiAdLZOKhg%2FqvsB%2B3XDk6EKA7%2F9xODnuYIeybNLWvyY3WyqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMGnoOeszUSdj2%2FkC7KtwDYfvBbVV6vcT%2BWiLeh16bk1r9YHIes14iqq4fThCzp0oUKGJCWzRXhq7gnP36NRJBcHmv5PDIC06nx8n%2FPHOrS3WdG1UY1M00bl%2Bh9lErEHW3gycpDR%2FPMwcRzt%2B6P7wpFgMTaK3QY4j2TqsCIWtQP5GG%2BZ%2B%2BrXSuJKXh8qaGTgMjrazP9ghzVgG7EkdDOj%2FaMLAJGmkeSBL9LluXhVlFe7VIh0nE6jb8UgekltN3mjWvRO5z7bNDY845VC%2BSmo0z6pyOJsDHBYbT11Qgq4SHCfGBwi3zzndPki%2BNQhHBt97auwIOGzI7722d4W96TJffFKdbMu3oydcd%2FAdakj9AqGNuS%2F99BM9e4ikiDGsFEMlUDeTYEyN6hfxEIj6M8zg5Iz7FXH3ljFUSU8ghCoUYVkGRHC2aTxxIBFb4KEwm2PFlXfrSE6N0EN2dwhfjQg7W1K%2Bua7xdbVZ7AvfGgxBi0NI7UHji4UyT85SgVXLwpieZjIhD12jolFDaIEFzuuWHZD5T8yBO1vwI0lAcfUnl0iqPASK1Y7jbqsQokmro%2FfM3yXfYGJU7m7rrFCCFtMpTxPQ1nm5y3CCj4J9C9NUFpwhW6vGXxdIA5VxdUU0oMeAuY9Hbs0lO%2F%2BvymyUw6NKwzwY6pgHt%2FwtLGkYPAQbwOfbJHPXPKgYIlVykfxcdQDxVkDgteQUxcXkUyRKjhLpILG4Mfn7Rq85z2WWUndIyvz8Ch9JIeNjyYWmOOzpzh%2F5RIdBAv8V4HpoS3m3ZY3G98SHf2yEsdfEKQuHJj7%2F3Ajr7M5iYdfcq%2BCsqKu5Zx9gfpRXQM5cttN0JBPd17zNuONri2QXKOemzYQ7Sq2mWgplF%2Bdugz6FJZlCx&X-Amz-Signature=f4345d69cd1c839387cd7d1c442d19538694ad8325315236c43477c8c5d8237c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46674XLGWI6%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033118Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHAKjKAqPIIN75%2BOXMPzrcJIJ%2Bq6VvRGHgMYjIVHkIlEAiAdLZOKhg%2FqvsB%2B3XDk6EKA7%2F9xODnuYIeybNLWvyY3WyqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMGnoOeszUSdj2%2FkC7KtwDYfvBbVV6vcT%2BWiLeh16bk1r9YHIes14iqq4fThCzp0oUKGJCWzRXhq7gnP36NRJBcHmv5PDIC06nx8n%2FPHOrS3WdG1UY1M00bl%2Bh9lErEHW3gycpDR%2FPMwcRzt%2B6P7wpFgMTaK3QY4j2TqsCIWtQP5GG%2BZ%2B%2BrXSuJKXh8qaGTgMjrazP9ghzVgG7EkdDOj%2FaMLAJGmkeSBL9LluXhVlFe7VIh0nE6jb8UgekltN3mjWvRO5z7bNDY845VC%2BSmo0z6pyOJsDHBYbT11Qgq4SHCfGBwi3zzndPki%2BNQhHBt97auwIOGzI7722d4W96TJffFKdbMu3oydcd%2FAdakj9AqGNuS%2F99BM9e4ikiDGsFEMlUDeTYEyN6hfxEIj6M8zg5Iz7FXH3ljFUSU8ghCoUYVkGRHC2aTxxIBFb4KEwm2PFlXfrSE6N0EN2dwhfjQg7W1K%2Bua7xdbVZ7AvfGgxBi0NI7UHji4UyT85SgVXLwpieZjIhD12jolFDaIEFzuuWHZD5T8yBO1vwI0lAcfUnl0iqPASK1Y7jbqsQokmro%2FfM3yXfYGJU7m7rrFCCFtMpTxPQ1nm5y3CCj4J9C9NUFpwhW6vGXxdIA5VxdUU0oMeAuY9Hbs0lO%2F%2BvymyUw6NKwzwY6pgHt%2FwtLGkYPAQbwOfbJHPXPKgYIlVykfxcdQDxVkDgteQUxcXkUyRKjhLpILG4Mfn7Rq85z2WWUndIyvz8Ch9JIeNjyYWmOOzpzh%2F5RIdBAv8V4HpoS3m3ZY3G98SHf2yEsdfEKQuHJj7%2F3Ajr7M5iYdfcq%2BCsqKu5Zx9gfpRXQM5cttN0JBPd17zNuONri2QXKOemzYQ7Sq2mWgplF%2Bdugz6FJZlCx&X-Amz-Signature=e2f5c946eb14e8bd3400074727a8128e8435528aaa5bcc77e68fbf9153ec2405&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
