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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VVRDGV4D%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051523Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIBuXNde%2BVqIhd5tEufV9BqxD1fPYvb4AQGSMZ%2Bzv8B1MAiEA1aZG8nUx2gCJyQNyNtGdVskN6XXFwEVFmHHHOGXT94Aq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDLHA5iXFhOCowOce2SrcA4IRtfNaQKLrY3xkS64uN2S3NE8wyGWFnQ5JLlxb4BiFIKuSH3XmY9aOFMXNZuRJ1%2Ba%2F28FGJtPRPnSp2uF1d%2BkFPfHa64Pe8Xux5whfgX0QvfNxCO5ac3%2BSXl%2BbaiDFwOtS8D1wqm81o%2FLCuMvEFJ31zJvEQkqIHiJGb7%2BscPrhSPqdMzHjVJxHuRTWE8zEHRs%2FczSx4JVbJz38dKSxhE1Jfimtj%2FZiGWRecTW8Ls9HIZBwzEMt43dSEbhIUtlcbfjqMG9fCTLOozj9ZjSShJtb9VJfOTAxs8C5qPUDRsY99Rk8PNnSs2QE9kavWleRJl%2B%2FWh0%2FpgYpeOpzfSiIB2oWMYyOyf1%2B18iQrjGP%2FhlzvdVDKk7WuWiZaHFaxuWgAJQn%2Bx68zRXxok55UGHsgo%2BOjfmaTwWUjIE7DX8W8P0mLxVnGq0XRaor4GD39EkbiE97j9pK8qzzJ6iYQPZ08ijB1uiKQ%2FaPdrYDaNGFhroEUM4lGxlh7Uty31Q4t4i47K3tqD3d7AjSDaAfvVG5oqAH8fbuqUSZUDJJed3CPRomtuTuLzV4cfoBzDfhhu5OgTUN1lKgWZphUtz990T7YV%2BcQf7bVcu%2BIXUUKTrUfItGl%2FqoalA3Uxj1G3kNMP7D%2FtAGOqUB3ZuQWdvlM4rgSmOcEtvyyDWQRaDgmagYF6mViufuGjGYjIOGJjrbScfFPXEdcVWq3%2BJuiXUGPI%2BRYlpKzIQVVWMsnJfbeY4neFBkOzJ8YaUFguVhdpWATFogSDuN33CEl0rsYpbm5Uev6FKSnaFMZWGk0HwiEYFwC4UDX6ZrzoVmPvGdO7uqhwL6YXJxAew77ccFe7bEzCm3TIaKgIrfvnAx8Oj%2F&X-Amz-Signature=705b87e142035539bdd5ccb49247b6ce9f31c7d799487cadee1c65933ad21071&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662P3PIUHU%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051524Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQDu5GHwiVTLOFVYeE%2BNOL1PJ9kSgViHR%2F3zHp6pl3N%2BOwIhAMpLWAkDjQHZaD4sGXJH4wVqJmyJHqmuY9GOgOFxm4XMKv8DCDUQABoMNjM3NDIzMTgzODA1Igw6pwUn6TrWnHYCAuQq3AMUoG5zF%2FNMjLXA4BG7P5pkuvUAfXVH0FeERmA65J6%2Fo28kq%2FWwoni33Pq4V3RBX%2Bh9EghBS1tsZGpeshFGuHgpelaZKdbYiqkf2UpXVF8pZ66TzeY5uwRvNRUR5psRFYNCHRf47nn%2Bz35DRXlaWGWpgLvfZNY3gbC7fGGoAtFRF4PQHXbu7inLO4IUYDLS3gvSALBirBn3AzSEjeVH4rigFONFhv%2BRu1ZKufHWrWOWW0PBIcEIWR%2BI9RLpD8QgoxAmH1qNgmD9VO3M%2BGCAuv%2BiA2DncZSmh38BJ9cm70z9hNdZTmIS03SftP3vuEncj7N6wdUOXchsh0ADHv6n4dXKYZZ1Zr9EOOvTrZhSTHoUtnwSfxuA6jije5QAfMOKY7b2uXC3AZW35MeQ1laap2DaAt3TdGPhAaSLCAXE5uJG%2BvntNpiQ81dFFSY5fbfKHBv8OISRjOSgLIFHxFx8D2GzJ5evT3tfWbbzdiaCSKLIJNQTCu6HqcyVvWhN4qyVyHqxABywXJNT4RpAvAFK%2BpM%2Bml6WHMeTuKw3I2BwsUB6kAaSHQtkdsEr9%2Bo6ISl9zJ7NwAJtm4xGYy4uZc9YQq8UqbnC9xa1HVucveyrbTE1zZ0QzlyG6lu2RqHzfjC4xP7QBjqkATbDngsdDWJazsqhFC%2F0XIrhdrCoAmDzVSySRg%2FsnwjYiGr3sv%2BfQokXcaH9ehFEVHd7s9a2%2F0fsmOyCSQoC8mJ95cF5WkFV2apry84UZruwjDltZdjMv9G0EqOl4TWphk%2BkIziLcFDcmq7wzP%2FGDJJcgqlNR4MChYmAsKjJ3oyLa%2FjjPG16vhZg3RM2eW7n7DL8%2FDVUDssc1cofmazXmMRwzvTo&X-Amz-Signature=ea5cb019a64869b0d3853492b76ff994df2b917fd96f8907d4e8aa602a4f818b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YYNP52KY%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051516Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQCXG4EG1KblXTc8puywxtoTndECq6H%2BB4S0OeNfVnCrJQIgbMivrsKLbRTcz3W0fafKlUY9kHxCx8wh9AN%2FL7Yn3eEq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDJjYL24Y8tPrFCUeQCrcAynt9zTYc1pIrIThJxgdb0hnX07LJde3ygYH8GjATu9YkeOw9SFsQIIkOXXGBO7jKzP2FaITS5MbpyH%2F%2BRO561ZhENLCqlu3tAi%2BbSwvsOFAkoX2JIzbl6oG%2FiX3d5JLMLz5GyWPvSaJf68FPMM%2BTJ6Yj16uDewiI05fyiRW4ypLHcjg7JNop2nCVhKXtnppS4ESKDoTSG0PfjS%2FTQwQPY2imRjCs6rP5JD%2BqFTNIshtokmLp1QZygo6ZUjxmG%2FGvXpy8SfFtMPqOl9rkNxjdcaIBio1zejmch3q95L6tvdWqxmEd5h3RdC1wgtveZWp1esycM6R4Xb4wffhgjc6bx6qJTkV8FQ2ByxCRgDnSOPOoFJkCUqEqrGFYG4L2zQKEnCF3Z7zjqW%2BrEU9Vp6t3Jj0Gv8zom80LrCrbi0AE%2FW0LlnL5jfhxkAonE8qHJpwxkzp7no2n93vX2eQ0P%2BOYR23XA9frIfXxmABSTyOmhu65%2FuGej3vEB6NSYIBWqmSk%2FcVbTvR7H0bT7jFbxqX7xE0zbMDCVFANxQ187euexH5F%2FRvUKJenS4LwXkw3hT%2FcDF11pqZsYqnRkFypPwubtJuoLjGX8GDuEu9L46nKOQVpk01n6LwsCqcNNB7MKTE%2FtAGOqUB9TPGnRAzikh0%2F8B58wRtEfcJNnTlyDEW%2BtsyZVxw3hxcY5OzD3ieKh%2BmWt6muwGDnQx84fRXToh3hRUbA1sk9MEw2w3xG80ZVugClgz%2B%2FG2i91RuMjw%2FfVqBvoPoX%2FkJ5t%2BpkKb8t%2F254RUT0e2Hbg5nSoUIgo%2BcyjiIBWefZphw%2FaY3VXmhe21t4O76tywPpNnwM93W%2BttD0496poNzJM9lyavT&X-Amz-Signature=06c032f9107b866ae1e8622d41d48772dd4dd04e709894069004c09f6dfdd76c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VAQNGOOH%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051534Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQCStIAN4RgmIZHbEmuBhzjW0VTY760InpjcuVQ04rKkKAIgInnAv1pZp8heQgCKXGScoJ9Y%2Br%2BmM4fqKueOKrJMJlkq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDAUoK2CglFrP%2Buj34yrcAzUlbVLoAjP9f5RfLuZML5yKIQ%2BSbq3BAyunOVnt7m%2Fn%2Fu9bWAhjruVcxWPzDmq%2Bqgv%2BwinGxULfK5NhbNyaZ1ltoX9mAPDbb8auyCzzIQYxdVfmNaADu9lFMhnsutho9Is%2BjnTmxTw%2B9UJCzCg80vEb6%2FRLcgsXvXDWKtxsQsMfNAPZX6Ferq%2Bw8xTuwZtKHQWDBnR3T%2BWK4LQVZD7l%2FGFK%2BHaA2CBREhqSoV16aUVmzncOIS8xk8jzVmr5G8Y6%2Brhk4WrdIxkEs5vEaVJxGAPg7VX2l9f0NjMy%2Ft9KxKjSxOWO%2FkABN%2BbZj5TR4OmssC6M6YfczMSDLYA%2F2aQyco35Regz7MFDIqtUvvXVc7AJxagMJn0X1k7yP0sjaUpcygL7CSHrjFaSEJfhRBpw0LupCdlUYv0PyhgkTogJC%2BPAWfft5DVNr8PKHA7bQxUkxK8DO0X3p6c5P%2Bp1NrBCH602b%2F3zlBtmk11k3iSkNuyKhOLWx9HdounET6h%2FWBNBXnk7zXyHoukX%2BLm3R7aLvSy1NZ1OqEZpei2bt6U9xG9go%2FOmZmK8EZYVckN2VcblP5Aqwg721yfbSmXHyB%2Bl3uHb4cpY3cRuOM6EDlZ1Kl6APQ6M1R%2B0xwIwb5VkMO3D%2FtAGOqUBD%2FgabIPkQ670ZD8Wr%2B4L%2F76C1mjL7lqtZKskmGsuj4utLjXONKCT18zNDtsuruFGlr7INOBEInFJETHoOjePQeYEqYPe%2BhukU9Ta8OOdiwHRTbWAYefy0ggdwnVYXDufFMoEyyEM1u%2Bsp61hvbJgJ%2BoyEufYMGA9bfSXmgbpOODS48DiE4BTt6s3W%2BD8nZHELF1DPf%2BiTdxIxVfQedmSburqIDXF&X-Amz-Signature=f7ef0190ff8bd429d4c0eb7ea15e4cc46311fb63a5999c0751847fce2763e477&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663NZWU4UB%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051535Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQCK%2F9xdj4tUMxDHEBB0zMnDXSyS%2BBe6xwIvOBsstL8OZgIgAdBL3cvH1n2%2BERTcjI2q%2FkoYY0WdDVbFyUtbRjYG0PMq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDGp5x7XiEmUdZd0qCircA3c8XamsR%2Fxl2nGYv0yy12hTNEdnqa9eZHw%2F29DDiZgv1qPZxVy0LQxTFucoVHGzxxpMo66AjmYE3IHPbvdFobWV9RLWcpBqLQaQDdkReZPyFHoX%2BNU12d%2FFcYSnYSuJ784QjEFTMv%2BDsIRKSAmVYeOyOZNFa2Xo6o1eXJm306lhAQ66bju0Pwb%2FKqjO%2F0sHuRT90u6qvvm9lXIt33MWGCHjQENC8kCHpeam800LjKjLt68g%2B5oR0YdLuwUWXz%2BnoVpkZJIO50CY7CO7nf6c5PdF5DwYXulQgCXPxfoys5fLh%2BrAlrE0Foakes7xLDSp0CKHNPh3uKDzwiwcrRqy%2F%2FnTZexYcX3l65y6rv4Zy7bH%2B9sey6xOOW%2F%2F0ZUIgl61qlTDGkEos10%2Fdc7yAqQpdYRAVdp0TaaLFgjKoVZmPp%2BYb0iWaOcsHGDLPMH68qRz2m2S7HKgz97Rcy2aa99%2F3%2B1q2FPP2kqT7VGgEbjt%2FheQkF7Dv6FOrzC%2FAsqxxhSqHpDPX00Gw9QsDQMZ4moN6orAw72EXNZzDRZsHJA1ZzZWU3IzqDQdoveiJDpsR3oYG8It3yRi%2FY2Vhher23RnQylb4A7aYPFoeKNgIsdJ8fWVwZVnmQTGtTkZs4CZMLvE%2FtAGOqUB%2BrSmOvdfnR0ybqWnNFg0rkjaKMKWoOG2nOxjbHsek8xCwVzPDEr%2FV4eBHz9jQF2960dGUNLvJciWgWyJC6zTEr9xN7upuxVZnT%2BWqurk60raTrxWHDBlEntLyA9X7I4ZG1%2FWkh3hG6U9HUZpszoZFd46rN9PBuiJ0JuIDx%2B6DovhYSdajG2Rq37U39p5YuEslhqzQSKodol%2BTT%2BoHHiQjWau%2B748&X-Amz-Signature=1308fc532198191f641068b0ea79480cea22f8b7ae155b5d20af1c7b8f02cedd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664ZUSYLTV%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051536Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJGMEQCIBpSU%2FCLEeN0TC69z7iAVvlGOVH9gVr7xITsbFEh0WabAiB5TKdG56dtiNtrPTq2iDDK6SvtmIWjfA17cTAEgaB9kir%2FAwg1EAAaDDYzNzQyMzE4MzgwNSIMCAzFEvBBJ2HOZnFzKtwDCY4iwmqp6cxQZQ%2FNGOJJloTId%2FhAA4BliePRauz3IBbZPP7Zl78gNeITuaAPSiqO6HiOnnig4nZj2Y1xX09g4ByhV%2FS2oQ%2B9ZtpchwuM4LCSvne6b%2Bs3FyPwdGkqX8KxlKzS6fvHAsJYDzGT8NIPvFmnIw4X1YdeV6KILxatKU%2BKXXONf8vdJ%2B0ZBrgi4MWOchdWaTFNDAWRIUdMFj7sS5P1PswyK8TIlPd%2FWzz021Tu6fEglJqr0bP85qozWjU4rGkhHXXST7aqEtdJFfTEmp8mj9%2FmHesSTWvAPAFupvnvMlQnEG7Bp%2F7CWG%2BH8q0NyJy16t7Cd7RU1SHN6u0tfHkrNjixlObMsYdKl30ZOAK2PAXIaFOjXTkmILB2APpqpmufQAc%2BVM7w2S%2FcvWiGoHCMFRZbVT2q7DnInn%2Bk8J1iYBx9DQJoqjat2f0kkPx366ur%2Bqf5f4VIl6x%2BXuSW7malXGgtOkqABnYEyp%2BofIh7N%2FBAhpVmij%2BilrISDKwBpiL0qQH%2FyDKF%2FtJ8%2BlQhMEar0ziUi1V%2BKt7uV%2Bog3UIxqtVxbGos4Vqb4A2Q7sEBjSYkMRJdmiKCS5KRYtWewimA8uL7k3TBjzPHSpG5YszC9t8I4PqXa%2FA%2FjCUwhcP%2B0AY6pgFZhCCgQ%2BzsY7fPJaJ1vCUTb8UIouoqsJtsk8az2CUlsIzS2FYX7UJdAaMvkVQ9eFLcdb4eAV925qYUYIKEiyXMV2shxC7KO1gTYB8LGLY2muGEuFbO71FXTJr02iseXDD0wMJLXtkVd%2Bi%2FEhu9p%2FG4qui2i8yvIjFLdDeqxcjKASPHNbkDXp0g6Xi7mgqDaduToTPVveHWGFlbnGjTfdEzzRdrslFS&X-Amz-Signature=1c9df4ed087c4ad79a1a1310edba805192cddff25d2c5bdcf79642b1f5aeefe7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q36SDQ7T%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051536Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQCT0E3HjGijxVZryMwy2Mm%2Bm7xwGCcodVNXsc5j1Q5qZAIgeMSWsgCfB57aS4SxXObyNHeGC%2FeYB8bbG%2Ff4Brb4JOoq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDPQc6%2BX8Pu4ozhPDAircA3Zy9cy30z8MmCviH%2F%2Fe6R08%2B%2BPOrHxUL8%2FBsV4wA%2BejpdeCDOEscPZfI2R%2FKYBdmlVI54WH0zwLFOKtLEzuKEfzQ%2BNifSH7Hmzf1DaWVJcNN8NIy%2BEkf7cfEce9UrvjhSK7hrpkWZvYBck5%2Br3IvCsq20n4uPOrQ8Jh0%2BrnWRi33SPG6ODsharjkvyuEdczXZ4%2BPS2UtW1nKSkDDZ9FGBRkwVUfZrxfPefBBbr7nlcSINR9XDY9QFIZk8rDzFnpXHvKxVmQVTunnjp7IYZP7qovxBnXnDX2sfmqzxr09bONCFP%2By3L159UGUSYWsc%2BYdXp64j28ExmoOv%2BiLmbXDNYvNHrzUpY5%2F8D8BJWGXOOQ9A6V9zidkzeB%2B0zRHYcxFQGR1okC09hSbvGpz%2FLBTWY4bpymFtfBJ9PtwaB8%2BMNGn01sTNywJw97s7COdFGEPeiXenQ7MjEFtV0LIbXXTWHHDEsN0DmM2GCt%2FjDiqy3LHlWQZtpaaUIJVTsi7Jgaoeu2GWUFqd95PghL7wHg%2BnUJuS1OBkqtmkpwPeKbRlVWnVyTEnlpEgEHqJM%2B8EEZ22dNHoD4krCb%2FjnNsZhCOPOcqxQjCK1DDKNKjVs10tTrJvMolneK6m6hlSVWMKPE%2FtAGOqUBVvALV9wbWeAu95d3KRF4yzFDcxowdlszzf%2FXJVWvfvtUYxE9FL7W04Lr6zeBjhgnKN8ocHOLKsRMD8%2FhlQ%2FDLUANrESDTu5AoG0fUZ%2BhA7zDDE0xaAMsj326yYU62BvEbLaGKlfmQaZOSG62V6nIpl6ZJC2QXQlZUauJ6Uv89QGOyx3bdLkr3dkfJk3Zk0nzKAnngy%2Bt7kofXws2hxdTyBYPwe%2Bw&X-Amz-Signature=e23ae2efe26399876c0fa4e8c05427b8e85cf3817857d103b7769739567b1afe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T62BUDDN%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051537Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQDDkCAv3qCIsSCMT0Z8IDUwCacrk9W8d59ZWBssUM8K6gIgf4TfYNVR8TCInkzIVZ8eGllCWE0QbN%2FZQ0zAJ%2B5QvLMq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDGq0150NPzS1gm%2F5dircA6vHKaEWsFitIhdWmpF58uolO3%2FCJX9PS9th48Lu5Iymfn16we%2BBIuCR6%2F4sgvmy5erDtpaDV9K2DQws%2BMLVTHVhJ5nN4WDtHMDeKnNGYhDpHwjGe4brwjkoy7bKAfEfJ1FGP86ycPxR3SJvL31sIOk02Otybfvch%2Fp8vaVv8J8R9%2Fxyw%2BHHGbC5XBvERTfd%2BcR%2FzmyluM0KBlNGWwbgo0HusCdcK5t527U99lA%2F3PdXye10pASuPVPvKdpEIxTLiTXmwLSakVARDq9MuyFM8mjYYtUKeEHaxuw5LWre8zb%2BXjeFbZHzJBr4rn650cgQCDlZyet9AZzsIR2E%2Fou5rUXKo9Bd0%2FsNQzQCyTrmi8xWF3tCuVxX2AW6H82lk878ohDLdkJmI0U%2BmGSh3cF5dTUaHucHwp%2BKMvYCWwMcr6nl5Epku206ovXqzs1XHgQGLdSubXZNcuZXeR6rz0Pu1HLSrOqZjmDGGQmllTeeNO1lLCd4kv%2FlOjclI%2BYRfgESIcSd8AXiTOwG8v%2F3JjvUEYx%2BRkPPPlj8Rm2InqnEIrA%2F%2Fm2Twf7kA4uC98%2BwSZEc%2B%2FL%2BCqSBhKolPSGARKPpLqVeesYcdEcYW%2FZ0ps%2BudGfeAWvn%2BwZrC9t4IzcHMP3D%2FtAGOqUBt24OtaGOQincAc4mVkXcTNYYL9ss9K4Y7lfRUXkRP8B2Z2JTsh1rNN%2BmzENnrAi0XbAlSydbHLWxXpyJ9UOo1Fd6VBBefkAg9AAqh7sjoiIU%2Fpmiiy06xdeqHoxOt8el0mxBPq60zo7TZsK0USRcMICCBjuJ94TAdnaNmqoXXsCFajhTdgQgK6WWPV%2FEyAPbzM%2FbmROOCtlZrYqdXMH8knjo57oY&X-Amz-Signature=96d1f3507662e6f6cd2b9d0464444b6a697a5854b9bcb923ffc1173338b73609&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666E5CQHT3%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051537Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQCaj%2FSoMnD%2FplUfvlmm%2BCO5w%2FqKF0mn%2FxhcsoXhGauYCAIhAL1n1crvCheovFXWS7pYrGmsJutbT0WxF0%2BI3IaE2mDnKv8DCDUQABoMNjM3NDIzMTgzODA1IgwfBrT%2FFhgi7tWl1J8q3ANhKOiV1HgZrMcRL3UKpL7ZzvLmAXK1g0ZHHFCBv8pYejlM%2BSSXlQHPUTBDtq%2BpcMBfe5uMlAf9QRbw9QJsN3luPRpYsQ%2FwV5fxSZZSeB86EG%2Fyk0QMUGbP8s9Gh5eYdgrGvsghyWJf3f4kRFMbk16mmVnnheQEFqh%2FD%2BscJlbDvxtVOgFK8a0vVySfy7siV18ZhUbDRMXcAuE4ma7XwBlvrNLrKXVWMmYVnR1yS%2Fu9bbkXy88CRVrZVRMjhWsHyH0oT6M5eYYUqH7ybioKyz1fTlrPBwgVjcCv1UNNvp9ERhWIqnuMgOAnaN2ewoc7yavpGFuUMpfmd57E3hOKcLEKzJ6rJvaczDrqLJkBgPjbkekd5yqMk3WuBdwuCchq2YBAHLFXRUQyOknayPBE6c38TUGIQVGlLccXUftS1UazKgfrtvaC3FI9FSapXygGtu23bILSMqth%2FUyKvhdgjrrqa0uAgyDgHizOQ%2B6bIdIsmW54W0RvLqHwcyvkZSYpPMNBuVbW8x1w9RDZzunJx3FUAq7MAQpMEelA%2FtWpabDd23tWX3L7JKw%2Fhcj0VncIef9GPwpGX7TsIetuoAovQlg%2FSbjrhZpn%2BSLT4meV2wiGpPY9JKVKc0URksCXLTD1wv7QBjqkATOJodyHTA%2B%2FSezTBa%2B48eua%2FQejJH3NZ%2Bv5I%2Fbao7Zt8lGoSlTulm%2BTvwOzWXmeK8inwh8C6k8Dho7Zvr862L2i7vu1%2BKnk9%2FCc%2BN3Mr6xZyK13%2BzFVGhK8GYS%2BLKf7ucRK7PJxKFR7tVfwqMqF%2B8W312qXIiGjC%2BaBBbOFezEDAPHhrRPWuN%2ByHf2dJzZcOYFyK1x%2BDr2Xdma7%2Fur8joDfKQ%2Fh&X-Amz-Signature=0005ace90020f87a0ec736d06046b1676c472493497359b74a9c0f264e05b59d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666XAO24AT%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051538Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIAG9IWiSScikGRsHqdtGlwsFjfOdH86oTi1cnhLxFhN6AiEAh95n2PudxQBRnvmbKkQvZxYMWXKybFiW8eJ%2Fj9rrCEQq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDCkABCYZmK1vuHWUoyrcAyM2Iyw%2F1FWomtu43XYC6b%2BK4nZrdSZDmZYVLAq8Xm3j7REf%2FKXkM8pEEwPS7mJMqId0HMeCcBMg2%2FqKm1ejiRbaafCDDmNSPTZNcUFALyoQ%2B6ytuwhy0DuusqcEMxgMK9cPRWOBf%2B4QIcIb32xExfkL0Q7Oys4RfJfkSO47OIa2az63BAT%2BOHIHyUSiP1nOfIv63yk0L2Lwh%2FvlYXfl%2BTkMcs4oKUx1misKS3QmHxzgewrplOdV7UWWWQND2y1TCV36My1xgvhWf4%2Fpoc7zvPsQA%2FdsbpqvFpzLMIEfPr40JuGlLdmkhZQAtf9fm45wAX3167VIlwQXI3c2pdjPEgRyv232SeKNhRDugIIflmOSQmPtCl7S%2B7WhhiFvHEEzt7Unoq%2BAyOvCysASxbVF5XXxGkHNe2ugj3Df5OJH0%2FLWC%2B9h2icN9TfT3cHtizoR2wGU%2BrrrJIeiwuHNUDG1K9TivvAEAZeTv9BKXRXBF7Al3ogiOOUxPjwrHg2BtMFNIMyyNvSYYM8TTLcB4PXr2MAeOQA5pHyraM4bW28T2PnO9mWoerTXgu5q5bvfO6ZLFNmhfh7axBOGb3Sr%2BfzJeAHNN8RCNo2VLg92cdHbpqQwbRLK%2F9CWuJ%2FqDG0HMNPC%2FtAGOqUBv24Pkfx6PmYEo9koUrfCa%2BiYrMCgX5luU6Ys28NrJ0hV6jFUe%2FFfZMteys%2B5C3WqZ0JdsOBHHI%2FxcyywBRqK9YasMO%2B0vBqBNf9RCYdUjVyVSb53yt00XxQ%2FWCqd2uRGhMZ0BDymCI%2BWDXUtnISEIJrkVG5RpKKb2q5eMdeiAe%2FkExaX%2B1sLhIav64C6LbybHVu%2B%2FbbKaufXjb6L39%2Fwtc4hct5r&X-Amz-Signature=edb9a64ed9351fd91af7bc1d3b9fb11c1d80c36eed8ac8ebdb3e09626283bcf4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJTO3IVV%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051538Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQCRTX%2BYMTdgEgmukOljCG6gHUpJvrDFwb25un2fq1cjtgIgGDt7rjpuItYC06fQx%2FzsHlEPhl0AxFsqEpLUC2iZdukq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDBrMPulPrPT9fKBQmCrcA%2FCOgPQ%2F%2BHvOv3FjNVD1LVXnAUJ%2FvZFffMKapg%2BDtHOLkanFb8Ah471UXJ2k4iOaPTAiSNZlZ1vfMvsqqwETdgb9Pi1IUp9Y30VSMB8R1t02b1KLORvBxgRiQ2Qvu8mGumfNKsI8I1CbjBmNnR8HdEqgMfXNqFNI4L%2BRwF6MbKmgio79CxzoN19X3Yg%2BBXXIHaLyZgylDOZ9ROPQ%2FPyIm%2BMxo432NmJW24G5exGY41DAgsGteSo%2FNOhwzm7RDsf76Eo0lqBRMeyx1KBmqkig3BxJ8zaeqcY9dE7xc6oylHcNnOEB40yfBGzVVSREmQ%2BBAojWzSR45pVmU4L9xDIQKcOP63nBtq4fsKK0WRym3mDWyZ9IfZ6jGAcFs%2BIWb24oiAtNrgeZkIycFH748jB%2FDahRUN5QFTMH0rO8L2keRL%2BtUqlpzfdqmYRJKpXlng56zG1b0XbE0bsf8qRaxAuuOgchJz3YSR9lfLnGXy%2B%2BvGPxFOYLzwsrce9MZO10bCYFDIRasat0%2BGt6kC7jLHbhJMjJEXl0UaK9y0TVYAs4Btn7fKILNllcXq0QBX3fb%2F%2Fa%2F02mVpLnluJH7iz%2FIMoyRTwwpfZxxAs2ski8HAYAG0zFqT1%2Bn3G0HQcCbH4TMOPE%2FtAGOqUB7EUwWdUEyobH2M8T15TZ%2BFNWGvaIevhUfp7MDSncu3osWsN14zRCbZFQ3C52AbnOIjRrCgUOmOru9UIQaPD%2FkjhKyC%2FLHxdjUtsJDt9b5YrDtgLPz%2Fz3RTCvEJ3Rqkfj5N4kiVa%2BtG%2FBGLdxzTeckbcDPBGKYDYCbKrzqBmt9tx0Y%2Bb1JrbFPHifnVK77ihabeHbDWtDVTVeTJo57aOS1ay2QCPl&X-Amz-Signature=d43203792fdc506bac7eb0564177b48c5a48031011d310dcfc3b0092e48cf00c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666XAO24AT%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051539Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIAG9IWiSScikGRsHqdtGlwsFjfOdH86oTi1cnhLxFhN6AiEAh95n2PudxQBRnvmbKkQvZxYMWXKybFiW8eJ%2Fj9rrCEQq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDCkABCYZmK1vuHWUoyrcAyM2Iyw%2F1FWomtu43XYC6b%2BK4nZrdSZDmZYVLAq8Xm3j7REf%2FKXkM8pEEwPS7mJMqId0HMeCcBMg2%2FqKm1ejiRbaafCDDmNSPTZNcUFALyoQ%2B6ytuwhy0DuusqcEMxgMK9cPRWOBf%2B4QIcIb32xExfkL0Q7Oys4RfJfkSO47OIa2az63BAT%2BOHIHyUSiP1nOfIv63yk0L2Lwh%2FvlYXfl%2BTkMcs4oKUx1misKS3QmHxzgewrplOdV7UWWWQND2y1TCV36My1xgvhWf4%2Fpoc7zvPsQA%2FdsbpqvFpzLMIEfPr40JuGlLdmkhZQAtf9fm45wAX3167VIlwQXI3c2pdjPEgRyv232SeKNhRDugIIflmOSQmPtCl7S%2B7WhhiFvHEEzt7Unoq%2BAyOvCysASxbVF5XXxGkHNe2ugj3Df5OJH0%2FLWC%2B9h2icN9TfT3cHtizoR2wGU%2BrrrJIeiwuHNUDG1K9TivvAEAZeTv9BKXRXBF7Al3ogiOOUxPjwrHg2BtMFNIMyyNvSYYM8TTLcB4PXr2MAeOQA5pHyraM4bW28T2PnO9mWoerTXgu5q5bvfO6ZLFNmhfh7axBOGb3Sr%2BfzJeAHNN8RCNo2VLg92cdHbpqQwbRLK%2F9CWuJ%2FqDG0HMNPC%2FtAGOqUBv24Pkfx6PmYEo9koUrfCa%2BiYrMCgX5luU6Ys28NrJ0hV6jFUe%2FFfZMteys%2B5C3WqZ0JdsOBHHI%2FxcyywBRqK9YasMO%2B0vBqBNf9RCYdUjVyVSb53yt00XxQ%2FWCqd2uRGhMZ0BDymCI%2BWDXUtnISEIJrkVG5RpKKb2q5eMdeiAe%2FkExaX%2B1sLhIav64C6LbybHVu%2B%2FbbKaufXjb6L39%2Fwtc4hct5r&X-Amz-Signature=482a3f3a8a274d62c755840b8ab55e99155782ed914b417c19dc5f9e414c6916&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V3V7IBA7%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051539Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCID1yJc2vncOmcUPA2ypT1xQzJa7se6bel8S4rDSDH%2B65AiEAvrTbOFGYX5Wqeec8CW8jnO3uf%2BOJx2yX1r5YMlkt%2B8Yq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDBmFJlNrEjqcHd6hlCrcA0e1PhpBGQo3VWjDsEzSmOE98tReau0C5HbcP1%2B3rLPNFKqCulU48AmToS7Sk1jOnhXaepLtoGePYJdLza3IY4YdtdZTdxGS82CVMhaxpf7EYVkils1sOc%2Fm6YQDVvCugF1tTOK9CJg47%2F8gSvH900zMcCWXiyI%2Fin1Se9toTqqrFvHwR8Y71Aam2wRr%2Fxlv4el8zeurQ8uSh2UbYQyjPF9l1oL7tGRLJTAQF1xyIPm97qBWJexJymL6Yle4syUALysGVjyw77PMh0WHz98BEEfSxwkGpr%2FWtkEGLpktV%2F3u4w%2FRwvBLlOrPu2KNiPagBOdISEQIDbw%2F6ftNN5uCCVDvCEhov4vWSVvYjz1DXlPPzqhlygIDClBZqWm0yrUbLaFQdnhogjA7dRlUUFLy%2FLSxTfX069b1y0CN7Ci%2FvFRS14xHLGR1dLLXawU%2B%2B0R6FVk4rixrnpovA0RyH5%2FCvpsngtdSL9PjtE%2FIvFgOM%2FiXRSLNXJvKR12mBXH%2BQVXsAFh%2Bo%2BAKTRnfNTGH7QkA5CPzIpkLkY3QyNjDOL%2F%2B1Y8avYQd%2B4Gbsdjb3QOvaJbrIVlqNbewtzP2RejTlGaBkLU02QLm%2F76wLCwrcWnbs0HdYMe6wEbsI9fVir1OMKbD%2FtAGOqUBum5qqGkXfuJemhHYoMfkK%2FNYOoBiZN%2BDUt5hImbDc8nnVBkB3gE%2FjwVi%2BGNQWsI1OVbSY9WVghwR8OYo1xH1cydi5KlPolgt6Rex6x191ZjjwbOK6iQcZB4edp6JiwN8f%2BczkiGIMOCO2%2BnfJf4paJI3Cv4qudW5Zfvm5OBgQbnx0dZR4jDk7zEdRgd9BaslmccfGjDyOjFsWoZxuoSJ4CTjOKcn&X-Amz-Signature=8ca1e5da51ed6f5fc2ca9993e32c6739e3352e44e4fb5cbd09b00678047222fe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V3V7IBA7%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051539Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCID1yJc2vncOmcUPA2ypT1xQzJa7se6bel8S4rDSDH%2B65AiEAvrTbOFGYX5Wqeec8CW8jnO3uf%2BOJx2yX1r5YMlkt%2B8Yq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDBmFJlNrEjqcHd6hlCrcA0e1PhpBGQo3VWjDsEzSmOE98tReau0C5HbcP1%2B3rLPNFKqCulU48AmToS7Sk1jOnhXaepLtoGePYJdLza3IY4YdtdZTdxGS82CVMhaxpf7EYVkils1sOc%2Fm6YQDVvCugF1tTOK9CJg47%2F8gSvH900zMcCWXiyI%2Fin1Se9toTqqrFvHwR8Y71Aam2wRr%2Fxlv4el8zeurQ8uSh2UbYQyjPF9l1oL7tGRLJTAQF1xyIPm97qBWJexJymL6Yle4syUALysGVjyw77PMh0WHz98BEEfSxwkGpr%2FWtkEGLpktV%2F3u4w%2FRwvBLlOrPu2KNiPagBOdISEQIDbw%2F6ftNN5uCCVDvCEhov4vWSVvYjz1DXlPPzqhlygIDClBZqWm0yrUbLaFQdnhogjA7dRlUUFLy%2FLSxTfX069b1y0CN7Ci%2FvFRS14xHLGR1dLLXawU%2B%2B0R6FVk4rixrnpovA0RyH5%2FCvpsngtdSL9PjtE%2FIvFgOM%2FiXRSLNXJvKR12mBXH%2BQVXsAFh%2Bo%2BAKTRnfNTGH7QkA5CPzIpkLkY3QyNjDOL%2F%2B1Y8avYQd%2B4Gbsdjb3QOvaJbrIVlqNbewtzP2RejTlGaBkLU02QLm%2F76wLCwrcWnbs0HdYMe6wEbsI9fVir1OMKbD%2FtAGOqUBum5qqGkXfuJemhHYoMfkK%2FNYOoBiZN%2BDUt5hImbDc8nnVBkB3gE%2FjwVi%2BGNQWsI1OVbSY9WVghwR8OYo1xH1cydi5KlPolgt6Rex6x191ZjjwbOK6iQcZB4edp6JiwN8f%2BczkiGIMOCO2%2BnfJf4paJI3Cv4qudW5Zfvm5OBgQbnx0dZR4jDk7zEdRgd9BaslmccfGjDyOjFsWoZxuoSJ4CTjOKcn&X-Amz-Signature=cd5f6065251bf3ac22214707d28dbee3993a5b001c5180bd36b792cee3c59259&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
