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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46627EYFKPA%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051524Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIEoTRx5uq063EbMYd9Jeg6f9jBP4J6qIYj%2BDZEQZFSwIAiEAodPG0S7Fquc4c9A%2FTl2NebdncW7YtWn3A%2Fz8dtva7pwq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDJQpIrC8ykGyD2snlyrcA1BxHWEfhcf7UVU7AjUMzq0t%2BsHEW%2BZACE56hrfvGEeD8TCFJCpftperkcFKsmCzk2%2FmWDEhlDmooihjAOm%2Bbq65uQnWl5b2prM8w8mJ%2BBw%2Bn3i7fyq4G%2B4F2t71C4YyH7ObEVOORDKVzEvZxAdZTEMktiIyewxccayLEcFwEtKQRrbRvB0WwQ9HV0YpEnEnYJKF6AjngBsDue4xC8jxEAzIwKWpDkPcddxhOYRYHRGYFtG6Y0CPyyPe61beCqnBNOWXJjiaNSJufvS2Jha7r%2FAc5wqHkguoDcjaQ6gi0BmWNzSHGoQQ4359frYEefjRmGRL399fLnsAQ%2FMX%2Buw5HfBLE3gNYkTL6Yzn0c6VGTN2cGPHxbuSv8bjlgCcnDcujP%2FZXvSA%2BndgQRqMtwGYHRnZG%2FOqm7EIj2l4rHwi57tb%2FUgg5YxFEg%2BkGZAAeH66T%2BDeSxeBiRiiBPNl8SdAWcl3fsyLCtxqog1VtiwtWOjOtHPbkDeDti%2F%2BOwWfXkXWYbV%2FrFYEn4kIttErCB222n5CEE0GIyihqGDnVayihWpske2QVyUiqcglbYnrwRaN6saFsAz2YDw%2BRtizOHdgcfsjJEOM2X6rpqmwviSqI59mbUlC%2FdTRrWNmxVfFMPWl89AGOqUB79V7ZhDL3BpcWo5Ytc4BIaZza5IK2ATGAgE4jia3M9plib50KW4EwNRNc2shM1Ls%2FJ6rebfMgQxD8yxjJ6pC1wuoZb%2Fr43Yh3EPcc%2FiBAs3axiSnTsXzi3KrxIA9acXk7WjL%2BHaxDhq%2BBso1a4LGfbPBRWsNpV2XqsTCvqNeo3GzTZrCpQefjr%2BhY6e10cIqopZNvjUt8KcpsiXUwK4f1L0OjSnr&X-Amz-Signature=6d0cced33bb7ec4e0ef6ee8ec6c27639038ab4dc25985531585a5c331c508637&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662SH7KXHL%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051525Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQDHNGJcap8IpD3baN%2BTYFAx6IqOxO7Iz%2BQx2pAmlBR%2B3wIhAI7B6jujWjoAukONE18GQxupq8YQiHsk8pb1t%2BkTTydTKv8DCAIQABoMNjM3NDIzMTgzODA1IgxbB1MgU7iOnJVLGocq3ANAZmvHo4ndPwYLAPCZUbasW3tVMAI2aU3WCZNoYDFKiK2grDOINhd%2BYAPB7VmHY4b9VwB8tUuhfE1w38v5sMyr7Rnxa4FfJYxzNAT1lulpd4K8Z4wayJ8XOa%2Feiv45pyeiFKgqF19FEAFB5VVnC9ctJfClvApCAtHGD84cona8h9bVeldJi2frP1bj%2FWH4b5a882mN901%2BjiQahQKdRzlP8sB5RWXwE57Let6Zlt7A%2Fk5GzSyCLLTLAWRZzoQhWudbahZ8AbYfLvQGCAAVd8kVYQjosaKGHQr%2FooQmvxpn%2B2PCfUKKPGs7TrtjvbGZghi5o9Vr63SvqYT83YZk0kHSwHFr%2BRYzKXACHxwfZdnGQyHiCNsDMELmu9shpQQD5ZNKWVpy1aM%2F98MmWs4mu2ZXnk%2BcbU%2FH0kk94VFNRYq5kDgIdOeM3s93XMFZJ8y20SnxnBB1gCvQUXKUui6TxLEy69WFC2qeD45%2F%2FUQSlbFcaYvIV37pdfYjD9EoCx0ah8b2YXYZ21cFVkNXp2DDsld0TDa9pg6HUP0GdmZPgrlvyBjEtU7xbU5FQxLE0QBT0kdKU%2FmaboKBYPNuqg6URx59tUbf1KL1UpZ3H0WJRI%2F0CGHlrB5%2F93PUlDMWDDDXpvPQBjqkARN2Oq6b3QL%2B%2FsuPPfqacxPRcVjv704xnDmtWCHz0tCkT%2Ffta9eaeW8BfhdQdUDW%2FchEsxPD0pd5KoZLEBq%2BHxtTlWdVrg3cKaPdIGFVA3HgazJTb2zblJOuLDEGkujMKS%2FKLyVhxyykfvurfgxO34zrxiNjMPnWjIymM15rV5irCKBjg1HyP4GkEyBQU%2FW91RN0YoDFn%2BR18YZaj1emJVofZ811&X-Amz-Signature=6a4d69db09b80b27be6b3409f7471585d9b1c7b703f47a48a9018336923ff432&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YH2EOXFK%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051514Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQDesky%2BJrjqSiVwDdh44SoCJy32F19CW5qFsGfzCvrsGAIhAOYFtzv7rOR6pOGQxeu2I2b0tpq1WvnBjCuK9UAWChWzKv8DCAIQABoMNjM3NDIzMTgzODA1IgyhxHJsjq3oiR4gLpsq3AMeahRveqKAoDc7TDFpgUnq4yNKrwpSSJjEuYBzSuaP3myeOXZ%2B7LpQBmVFAiv8SvIgZSLkeQhCEPztNpj4%2BeGNPLeB99p5mrsLYFuqUaN%2BPLGNhFLuw%2BUqkh1Wr3GCVokg%2Bo0k4hXnXUNKHAJzzl3i3BZsNDiVC%2FBs%2Br9FTKBGrePRTrJ2DPFnvzYLtkwHMy3fWbvEXCyZsGewy%2F2SMmv1Rng3zMlVa%2BwK4bprxvVcabhKyKCxJTO4%2BoJdOt9k%2FG8gO4vAD%2BfgWfZvsEB5vQNL2nC5T7HipLjKL%2Bbt%2FgIPIZpUGE3SRI9evt0EgCSn%2Fo7cq1%2BeCnS4J4MxkmVx7KEFZSaRil7vvd1uXx1ktymf1Sp2krQ%2FHR0qCv%2BwVToU3oU%2BouMrjNpctX16PjsTvvosejpk5nW50eWxnurl92PhXoWC7zTFw4kRNOuJ59kKgxDB6qHnc9pAyor9xR99GMH3K4x0NkPTqKTREgkpQ%2B8bPBb%2BokhJOw71Amuvxi8PhrQ7JWYnxyj9FN%2F532r3mI76PbT%2BW2sRgIupgbCTs1M0qFmon6OL1SFnSwoqdZiY9XmSlPfkdvShWGGFU2kWrFljEwWueMeV8gEdz8sLsQmTLkQP%2FIVZtf35A9Q2fTC9pfPQBjqkATRCJFoUNSfYe0bNRj8Ql%2BBIlYKz214KKihLLNtoE2iqnwFo2%2BeSSkWiZXTnbdyH2%2BjzgIKoYbMVYgxKmpODWggh42r1MyR2X4V%2BEC1ypRFDUqAr3QKna3VrPxMDO0W6rmFJZ6rrZU%2FhWWbcjIMeLdbfPQhoOGHNl33oQwgOt7SRrdIjneoEli73JNUGqpo9hprCnV0g6YOW2yww3CXxrDfVXxT%2B&X-Amz-Signature=b40875ef52f10c1096575fb74770013055d8a2f98b664f1913df22fdaab54ffd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662VPDXXE4%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051529Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIFLFJzRdM5X6zhnyLaLOof0OxhwUY7BmyqWXcxCJcFRqAiEAyXb51Q2XPhJOZgpqOgsu1VzbKLN23OQVo%2Bmuz5OkHzMq%2FwMIARAAGgw2Mzc0MjMxODM4MDUiDCnsKL8dsG30kInEHCrcAxrmjcdyoIsfer1l61OasJGYsgGOFJ3xC53jwpMPoW%2FWwAE7mNrq1qxMFHaGGze8GSv%2FNYolX4EnIewOg1HavsVt9G7LrN4EMYkAkX0DLnNgjd4tu2rfIpxj2mI0GJfB0gznvNiYqc%2FhGYaGedRaRzLcT76KLkoLf6fBtCFUng9jR7GNAvoM8wiRUsrbdJTXKxtoi8%2FY1YZGj7WJqPE1K4GDgiDD9ZEldd2J4PqRiih29o%2Bz%2FXfAKKCMCvq%2BSyNGL9O45yGcQ%2F7R1dR%2FmmcQQPO1izRjJWrJcvu6EgEj%2Bo9KoY%2BFtZ75x%2BfDSVm%2B7b0GJow2hWt3Tl7pOKdyQg5GtVbegC85LgfwJ9A1DyyX03Hm8a3jGss8%2FlHHU2nlsBVPr6G2nBIEtrdrLpoLHBdirCo%2FUHPLBa8jTqeeMh8iN2N%2F1e3HLem9cqFQhkLUNaqan9wTtEreeQEZUlJDUulhBeb5aa12jRfpZ2XkF1yrtrRcx02ZdkS7Y5q0L%2BikaWxKA0UlV2aTcduMlggnD9W9H0OxjYvFrj%2FVI26Lv45sR5XO0rQp6Dh26ZR2Mc11zaquDlpp5ymHWvM5hUH%2Byi3Nm2fQxK02LB2%2BPr0RdYsGhyAfl0K5cUatZ9JsoO1wMJal89AGOqUB0fKz7bJaEt7hyAyqc6P%2Fvvklie%2BKswOkoOrC8XMcpkUXYVFyGB4hUtx3dxPddluz60BGORiBpL2uiG23a9qDs7oyx0iSWLo7moIviTEADKNRU9KlrEZidOGY3S2Ev%2BT5Yi0FbrGGJ2tQo1CupkPXAQUnEM73EgvGb9R4pBdVAUTaxRTJ5FOagFva%2BQG3WgVTqOXXCF7oHwLcvj6kndZ8XcgiDV9r&X-Amz-Signature=c48ae360a61f267d3984cba1aca40870a3abce0da916731c4cfde3ae5e26d402&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662M7WSH62%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051530Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQCLW9KnzeYs8m%2B5%2Ftt2byPwCEsnQC%2F8WbRa1Vn4eBgAewIgTUpqiiMqaFvYLFquz3N1fSzkgN%2FSVgoluy8iF6Na31sq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDBYwozmrPurs%2Bu%2BntircA5RcE1CH2lkp7FYADTZIZYL4%2FD3uCcZbhNoq8eBS6NjGasEYSeVYKNTK81iKVhd2j4wcjEgInBowZ2t%2FxaAaTsxyjcnw%2BS%2B%2BSrG1I9Dy1nqs04EPytmsQVnH9JLU4ainUa6Nhtp%2FahjlhHv9PGle%2BHx7lG3V4MhHfa0a7EJoQKo7gb8BoPwfsgiiDciAhVP4nJY5e6pxN%2B8oovphtPX95moQX0GlkLDkC1cSiqso4SqEqs9A1NNG9HMYL%2FlsLra8XVlyLB7e6EYSo%2FEAW%2BgLpqEEf9Ws5JvyWaFK7Sq7fDQOpCkoOu8koSlQkiYE%2Btvf28OW8TEACZbuCU%2F8UR7sd%2Fr2M8t%2BZCtqDZz%2BBk1VABrp7Zft4s1DJquEzBqpxLh7PJ%2FnCx98w02LzXT%2BsAtP81z8l%2BYLY2OUzKUPaKw66b6HCLF7qcnZS0LMoxG1C4krCMRN5l6IFaZXN4%2FAr%2BIDaAqz09Jql7ggRdNNi9p1wgAJzpaEc2OS8%2Btcz8gU6Iir7zlTWtEaen3egRqaBDhqAyKTJz7j8SuxObB4kDeFFGcMSwNg48BAn%2FMA4Jk421lRSlItrqKcT6BhcYWVFsZ8Kh9TtVpHeaV1VTLRtiWG6musELQddSDHtdMq0qDWMMKk89AGOqUBuaRUtmCSZUjg8kjAy2ZKUvzdafDOEFBeyWfK73SXGaiufOlnE9hbA%2Bn%2F6WVzoGSkzEXhMqDuC2%2Fpl68zfmVavDunGgvsUWH%2BJuWR1LcZlYwhDk1NYt0pms2A5XfdxQDxy7sIZUJwJE%2Bisif%2BLvYLFmscuc%2BP4pw8XB6DXJLRb%2FO7X%2BZgzLRlcFmxBQfWV6xxXQzdR7PdfGeJX8QHZHmI1jpD440g&X-Amz-Signature=1eef5ddf2a59ece4928328313b0d710808adac737fa000dff85430fc35d8494d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGU4DZJ6%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051530Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIEYwIaZc7wBvLTl69rzkf2CamWEahbGEvolN8iFsYvJGAiEA12Jf6ZTa2R%2BRPQcYca3DUCr12BdMcpuybx3hsSy5NNUq%2FwMIAxAAGgw2Mzc0MjMxODM4MDUiDM8KrIyFT30bagggOircA60y%2F5TP3nz8QyjOLU%2F58MZa4LW6aE4WDHOGMS2l184%2BcVBiZaLmbLqoQdMH36E%2FXs0blIAlSoXcpU9MwVNHivepCGiYZfs1UuEYp6KGXvL5nUXiB3Yp3eSbtD2mNQcjbTOojTRFTo3f40F8GWUvxQMOgK0WTjkngKIbhRt7%2Bnx2D0e4CY9VZxi8ESKtqni0djAIbyg3k1DRj11mvRbzd2PKP3czwH%2FTUnkwUGRvf3dTe7UBdK1QfVC2FUK06KZaWqDQIyO8eFY8e2Y21aWY%2FiHTCgu25hx25JHEvjBcG5mF1gURl3vqyslRTdPr50TBp%2BCaKKqQle7xp0KQ1ib0GA1KEI65frZRf%2B1ueXbNJ2n1zyxDikbhboAUgUdm87HimekEVuwSVxjxXeYy9ugpc1QCK8i%2FOaxIr4XuTwhkiCeYPKN2rPDBWL4fdYENoOblnkYrrQvJillitY3CBchOVW2mnlya4SL%2B%2FTeasm5HF9smbY1aeK3wa6Xq%2By9c6gtg03wiyCLfhjq08g4eF%2FbWArMrS84Hj47BuHeatuMGC5ywikqQhW12jDA3Fp4ORvbQh3kWYfhh5GTm64zeGAyqbmpCzqcpgxpgzzJgc5Ed%2FkUiOOe7BgU1r5taYvN1MNrY89AGOqUBz%2Ba5cqY0COtNpKFZSxYtfjKX1KTua7wCSvBPVpYiBFkRxtq3YkG21Nnd%2F8Bqr3e9xvB7txhCgyNZnFkziKUcl1MHxU14I%2BBmrHNHioUFTESJTZwuRF3e48W%2FxhyIAi6TN2bFqN7ydvWE4QOsV8qv2h%2FtpeHyymDRfsLPxKunPLisp7vOMz7ljYdGK%2BPaLZ8uEGxnzf225vM37IpdupAH%2BGNxqckq&X-Amz-Signature=8958fcd461b9276446dffa23a89f52fe2ee95c6a4529f57f233fca63c378abf2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665WF6R4OE%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051531Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIFkmwJ3qtQ2kY29ixL3d29iegBwd%2BkV08qvtmD%2FQERIkAiEA0YjFIo%2FcQcHlSnNr4fkmatKcWvYVVkzM1Yidj6%2Ba%2F%2B0q%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDAYyHbOqi44VLthUcCrcA7U%2F0cVBFn1FCAJDqGEEI%2FzBcFxVt0kw4sjg49WVSA2gqO1jain1LEDW%2B2a%2Bi3EFcSJTi0gbVxcki%2BYhy5byyD1IS1vqb6VYNZh0diiK0k1duW0ffgITSSGgn7Eetx51t75eJf7k2lv8Fe8bjPZGYGXT0dC8r9omSbgfP4csVnpUJVRuIu25lnqdt7w7gLfCSD%2BpijEgeji2REF%2FTwIbRlliAX3NfDXAW6vO7OJzMnpGRGDmzeje5Koq7MhQZHmk1vgayk1bFGvRTktCR1Jg9Q5Fit%2BFhaCUk45LFD3HpIkOFPSIi1RXD0YuhjDmzNlJmk3NLSgoiHsae4l5PMoNyeF3WNkveHAzfW1RkCACwpjbHnloMAdLY0b4XA8ZwV%2FXrcocJKt3KJOWyYsj63u4POxxtxP3HeVxx4P3eRuwwl5lLpdmsCdnmEnsNuN3zFOl99daq5dgMkbmEXAYrYerB1IatHcfQxBeYCekM5OKWNOKR%2Fz7L67pkCXcNORFBTkdjmmYVQOZYFPA8w3k%2FX74ZnrwDGUf0oyXgcOqgCjnzdMT3%2BgRVThiYhdmEx38EJq1zWtyW%2BUyZzbB6S25%2BTSEFqioOOAuH7%2BGe8RcTYY1ejoNIMljscq6ICcqI3mXMOqm89AGOqUBAJXsnHGgqLJNDbPsCRom5itxp8OHJ7ZUCgXFQoM0iHKiruWFa3A8qi%2FlAPOLOc4AMAjMwra1opugPuu7YKkohSd6RaWuHQMrwY%2FEFWVdxtT8UPQkAE8XhopTrOUueAAF2O3VZYTq1TIUmxcFVxYABbT%2FAibuo%2Fd2aZmZp8VaCCNF08%2FD7K%2BXPrg8I6LnjatA%2BmmnR8tIyJqqWPO7Z5Qia3yiGeGg&X-Amz-Signature=ff250fda3802841c61986deb08e43e72fc2aadd861f796c69e044914fcc29877&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665KKNORMO%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051533Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQDo3P6NhlNrl7OgQ1XB0WLuzeuPIqRqhtoy0MUSfBeP5AIgW5kb%2FjJB4MObpuwAmkoX1vbP%2Bg6q%2FEtK6zUwexYpmZQq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDFrOnSd7NE%2BLxl0P3ircAxGM7EMMUuUYX2X5loGi%2F3uGbGhjIpS4Mh%2BAcszo%2FN8Yhn0ZkiRclseyrRJuGdislm3jJUHKlQKi3tDzSLM5K7OdhBKIS5JWgSd%2F%2BJ1eJZHaUXS2DXwIyg4cO%2B75%2FYhzThTmOW6y9HvgBm8kKHWzCebwGlUjFChyC79shSY8C7xrCEqTz9hV2R7y3vi%2BsCvl1uBWB20TM9tYuew8XcDREvEXuTRkamZ%2B1MFRT0sT7kxr8bSEJlfGgNYGJHnCPYOT7TfHt0ivsJxr56MmY%2BApahbXV%2BVSIjEXn4OQm5e8cw5ooudmAU8nPc3Y9e9%2FT%2Bnw9rxAxiM9HzBsRL%2FKmEMNkoH%2BtewPQL2hh0oqgs5hBeWWOOOOgPKzgmyUJONcfVgElVw%2BxYC3%2FniD4fUZvaBYGSvhDGMLkV9wLqs0272FFR1TpCqSZ7q4rSW%2Byi0tlUmos9L9os7KyGWv51yUZtLXK8KPatlWkkSCLyySShRgPEWBbv5H%2BXRjLUAVlxtldGS4XxTUKrCmKXDfc1y7jPytLI9M23ZCyU1eoPeWgX7%2FRNN7xg%2FmwetcMW8xq8XFFvXungdXtQwxjrlJugwvkw%2Blbm5G4ey1FVidBGConSU%2BrWP1QcVHxeBVHO638lb6MIKl89AGOqUB3XBxqQ2KsCLatXUx%2BiMXs3F0RJVLVxIPfhFem9Sr%2B9me%2B6x8TrMnQsGgJQp1yVXlmxyxex3yJZQGNF9lAcc7vIqzYxXGbapIxS3zxLhz4lLg8LRARouGbLrg6tqnacIWTlp6P1FJb1vWpv5pwQF9xtcue02laQL3rFpXkaMwTJMNsIAZvWgDZTVO6rDEhyDAd%2BVPFIEJs%2BsV10PE4jcDr8eIVlLM&X-Amz-Signature=29abd811345aaa712499f39fd61a652fff2dc65e78c6275d20aa89829075c752&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667XSY3PER%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051533Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIBJiVvtF1xYGbDnY84utOzKA9oAxJJ7guhz4JQYBysi5AiEAxWzLGvs%2BpZMplWFA3qQVdwIAGcfKYnTsD3rYo1OhGGsq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDIF8gStEDTIOZITOoCrcAxH1%2BcyGMQYaMJ%2F%2BDBO85HzC4Pbz%2B%2FP4w0wIcESfoAC5pY68uuuXDmBnooIo8SE%2FVI1rr7O5bJ71ePwlpGqJJVQtDrgqvbcobYjEq0TSozhu7IBfiNQ5guTm0n41rOY%2B%2BfjeqEPidYXsmSP6ZLdupbcyqHrrkIt1T66hDNiNoTJXnfh2ESjynX8cdimXJANYXLWl0qdUNCafMFts6c6cy7AFURzRxyDvOO5na8ubzZT8my%2BMYzS%2BaqX6SbFfYjIapcrswxFmh3MU7qapbK9zpgJ8AeHrvUwQhDFg9N85eJVguaVogeR5YBfJKFtTRM9VRnp4L27QLDErFsQlYi92bSZamY2DwrlZAdq4VV02VNrGefTwrEb24eNZxUhKxWHey%2Fb2j5Oi%2BQbgwLOJr0asdCL45RIxnFQxdhiH9sGxt85wB5GV0uUjuj%2BWW8zf8i5gC6uBRCiY1j8YXzJXoI%2Ft1iQt%2FsA4znZnvGO8qqJ0vOddqXoHEG8KD59Menfhcp%2BFYrqjUtWPDsoWjXPHqcLB9FEpgebzQ%2FgdiJgMYDcLGzdqdIZKYgzLWZTo6mnOag%2BC7ifhWZyD0AXh5vrqbyAp2wW%2BYKzZfAwAXK7IFtjtqq46KwiMkTovY%2FrKhryAMMWk89AGOqUBkDvgwn0MW0J0QiakdVVfbneySZnGzwsMezXMas42Xff896A8iOZkTZ8xmnewb6ROBdWyPyzChGk5r5p7Aj5TG7rNfDdHtRmIsFkFaz%2Fp1zCq%2BWSSvHTYlo%2FcnoCLsXGDJURp0NwpdQ4Qq4%2BqZhSkFSCcxErvHFTs%2FrQj%2Fv17wrdShfYHRII6SkdsJ3wx%2FjSApYmxC9t6W02uXLFaGh%2BJaqlBz60D&X-Amz-Signature=2215791243fd42b823612d301f9be793908e9f3fa0c768b96c7ab8fe02a66425&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XT7JB6D6%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051534Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDoaCXVzLXdlc3QtMiJHMEUCIF1WZ2N5qB%2Fu9YRgHdYvIsJQFO6pU%2Bk8JtmcJgTflAeSAiEA49li9%2FPWBTJ%2BaVzvCfs44lqOWQQv3nUsptozj2XhxPwq%2FwMIAxAAGgw2Mzc0MjMxODM4MDUiDIOev49R7SLFO%2BWpwSrcA2ZgBNXgylKV3moRgw%2BV%2B0H0H%2Fs71Eul7YnuiA%2FiiBT2ZOfGhtmhyf7HsaJjlFjhnXPebQLl3YG1qW36h0Jo%2FofO5Mph%2FHz2XPfqREXOH4Fk4B73p7P9sGZD0Jqhl%2B6N34sA%2BrDGMnfk3GXOoXjVUCGJLCOEGQvdq%2BU%2BtdAuUyVhDcMENvrSJWrGxAnXlNZvsp2VMJvms%2FAADvTs8%2BzKoZ5y5uMwV6%2FkNX0nxPq1XSNVkrdY%2BZE30ziNJnQZW4NDiOggPVaJyV%2Bbju6JhaibgHMufdxfgF4Zx8UAlqHPkIDu8GuLqRMAwAZ7AACO8Y3%2Bs1j5c0qfI0EkU%2BgZj6LgqBWQewm5lM4tZA%2F%2BM78eH%2FUh46YZY1bKRynyTo4gTBVPnMLno80cfx2w%2BgOZJZ%2Fk21UCAvnlSn5oC%2BkLlmUIzeFA4eP1QhrOhXmBwzyolekZCL%2FhWXzZU82IkCOoui2gbKntVAcejvicaHrb3ie23Dp97ZslaypM395Ba60wKwENpahUSKzF1E5WzpFECa4lawdR7B9YmLK0XJ7ucNywisfrBlclyS1meUC0uDEp%2FEEsglGsbEGym4l4MQzM6ff%2FTvwT7Ac6EH4cp%2FlGInijM%2BL42K9KNLx5utlg%2FMmQML%2FS89AGOqUBns1PJsonM%2B9BM9u26AcTBXIS3tdy2VW3i03DS96KtEiwdEWYkooxNQBaiPCZBgiq3lvMOq%2FLeUvJ4J69yscWSV%2FhYjV%2FNjJ3YQHT%2F68IDC46IrEM43zohGjPkqEyMsPnMvTvi1GRyw4%2FW70dJ8%2FJxKoUu5UxfWeN1BvmeOXZcgNYE52E2yjyYjpaUONzfndcx85gCzZvGt8wWStvCiPusSdSzpx1&X-Amz-Signature=4a1572e79ecab80c66dc5785c934c7b1097da6d5dbc42779d7b3a590f7922f42&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QAFKMJVI%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051534Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQCt8b5co4Np%2B90fDdg68R9dKPScyjn21Bjr1ZpnqieRWAIhAJAsaERdgVtnG5e4rf5K%2B%2BWVh%2Bd4txE9BiNSD4TvfcSSKv8DCAIQABoMNjM3NDIzMTgzODA1Igzo5G52fz3NNvwwlfkq3APpbGlt%2FnhtVhH6ETXdTX%2BjcLuSCWQVcyIFfsdiLoidISVEgIRO3uHfN1nA81S8baZaQ2uHMSJ1NgRHz42d50aakvryiFS0ajmWWL0yDs6XKCk6y5Yexouse%2F%2BiZ6pDtN3XifDpMWWLRMPIrw7EcnwJeu5rVO4N5A4jwM8apykGoXIjB11UF7EyD8eNG0yD0qPmiJg80suYNtvYo3VSfNPjeymBBKN9xxB2fUOLX4SaFIuGsauau0Kg%2BiybPTX41t%2FgDvifZW5eE8TP16fxhjYUJKm9BZwIBFlKtqVM5zEE4kPiBh6IgSjjP4wUuxZnrGsCoF7EuFgkpOYwsHEEb7rl9sQL4FPwWMRq%2FRLQyPp%2FIpSUk4HGviJHwEnjmEx1U2bhZDMW7%2ByC9WX1s2Ge1q9vyewsb09HlMJZBU770OnRhSVgnJZdRBCAN%2FFfl6QPvM%2Btnr8iQUs5N3b9NTL7yE1ibifyCITwMqOElPMbM5fNDT2rfuqZMONTo6OtInVc1kQYTljoYnUNHulnykzzW7BHYkyh5yFwQwrkM4Ln3KFK%2BAXFUkjOxTm2IQeq8DWI%2BYp1OfMSMK1vGz%2B1YoJVyIKDLKD2o%2BDFuA4xVqQD9tVwYjKYEWC6I9bgGtD96TDPpfPQBjqkAQ9fuKzeWakqnW%2Bxi%2FBRQhNJ3IsPDAg2klgF2vUm9FbWh1dS3nwPOia63VtmMYfOY3vgWBRIAJgNJ7wd5WNhi2dgW3u0G3aqpkJftdYc1L9EM2PorbYQchbgOQutj7Ah09Jsh1iC5EV8XG283pOS%2F7pwIn4QgviXGcha5QDvRts9rT2vwUpCn6B%2FZcFZCNlx3pIkGuxYhSHGWWc2Gzau%2Fr19iwQn&X-Amz-Signature=a8c1e561938ce8752411a43d25e158d8fa80be19734add37e0b95833c1bd8e47&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SGM6IOCV%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051535Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQCnKT9w%2FmNlRQhYVKvkWrwTL%2F2p4Kuo78zFKY2KuNvaGQIhAJcbERrGzOzSNgRQz8KIn3wRlfKgF8EHOE%2Bdo%2FvMb57gKv8DCAIQABoMNjM3NDIzMTgzODA1Igw1U876PavZWYrl6IMq3APgvO2CtY6xvxF%2FLHQu45EiOwvVXze%2FriJvUkEc98ciSm37sHrYG24NMWTFCAQInh5fRThxfOiKqcPSQA9m7EYNEza3ZB3yNFlbv7lLRqn9mMMADzHUE4PGag2Y%2FFUOFY8EDvZOVvDgJ3JRb6Qd0fLM4a%2Bafy%2F2QQrqqVbfSCB4lO0yIZq%2BOXLsb85ARaeYDk23QZSwGTd2wnRBEVS%2FOgXn4cRZ1v2M2l7xMzj5HCH3sjxHeuolG1ILsVOsvo8fplYLky43UeTtDSMNPdafZemO%2BjW%2Fad5ake8bymqBFWgfcqOJ8c26JxN%2FuQbCjEXHZKjSGm9UBA7Mxhk0WI%2BAypaQp9aJEWGVxqInciC8CML7ULH12X8HzJxmuAKQO8USISt632FTefFmR96q%2FNSFtyE22e%2F33NDyUMdyVibVqd%2FjD%2FFU1Q2Y6cakR%2FJ7fJuiI9u5ohKNYztC4Or6p8z1LX2dAuISfTIozDo6eVMSJcAk5FG3Lw198KbwKpZwQy9aAknF8OuoWtxcBne6JgWZVFcdggc5b5NGzzxbAeZlvg7IDA0aGcpwkHxX4ubJX%2BykBq1314AiD4iT1NPuhsYkrwCjK%2Fyi26QV82FQWW1Rco%2FwNewC8OLt4k5uA74UbjClpfPQBjqkAc%2F1wm2k%2BJLIc79sIEDDNmWxbqVH%2FC4ppCAeDZFrgiBd1j3A0Qo8sJY%2FR5vQfygowDMe3j9kWftxPP%2Btdp1ossZEV95Nw9YDbXJh0ROtplVkeHrxnAOvPLlWOG%2FN%2FtsjKjSNSzYBQj%2BgfgUOENSX3Pwp0FwyQNb%2FDwiUocUycEX0kvdYigeXsIuAutY0RUXz6aizrEEgLHUiPsXVYAaIL1QEc0tG&X-Amz-Signature=f965927fd3eeb839eb462b08d43721f6565f817f738b3eca19f4ef51c3159ab2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665BTXWARK%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051536Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQD8%2Bf91JffOMpd8AVx40W2H2CXH7k2v1U1PDL84wOGPaAIhAKZCff%2Bj2SOhuHDDC9uh1g9iGTwisOQbnuzypWIOJTjmKv8DCAIQABoMNjM3NDIzMTgzODA1Igz%2FFzO8N%2B2B7%2BQhYIIq3AOCNwPTRaYmXXGOlC%2FhRNokZ266LHaek1agQVl4eOWMH8vLuYxtrriIvCfneJoTE7ln%2BHjFRHaaYD54OsGIn4NYIpr84dlribef2NOsCoM87EPWXcW%2BwDDKC%2BpJSCavkfGRJnrCW%2FHoo2jGEz7xtPBO5ursnmpN8KttKJ7NcurfHlhtm077ZbtM4A3f3h69zH2Z9Nb7tCfOK54uKQDyNetcZWYuUgY3YK1ja7oxvd4zAxg3Ovq3tBoydWKqzZxJ0kvXAX9PDLFjZCQmKrqJ9LMBH06BWP9TcAbXL40PzfP7nx9x5UH8W%2Byx%2FF%2B65dxZqgXFKlghYWW66qp1%2FFUNHY2a%2Bw0weUU9I31lWoWtYBZKcpt6BGuudaT7JehqxSv5Q2xtyOOPtI9EQK7I7Qf6x3Gg1XCmiTskSL6fksZqKAgwBWwgLXlmZ2cEl%2FRSefj8ReRA6hxJJwojtA1hfdfDHn95b5SJ2SZhQxptGQt4mf48NW298bXy1spDwbqQEeZxh9POq2nyYrZavFa%2Fmd8MpiRWvj0jIQA6XwZDvJXz76sOh1lwj%2F7h2I26tr58qGj9A8TjeFm3wEJUU0gWLtce6eSysqRAQNRs8FAT%2FusQ75md3z6vo8skm4qH0UtkazCmp%2FPQBjqkAU4yegqdFS1jFVW7QcW%2BCAGWrsyoqefJa5houUWiboXz24123AJPF0u04kjKIebQmXZevl5L9U3YixvqW9U7oVEiPeLMhFiSxBdCvp4LItVClaZDVw51UG2Zhtxy6mM6wHSSSzposGDyWNXPyLESHxeLvfBvGK0s2a3F5Bj8Hcf044eVZLSR3UDPjIFxLlKc2dQbXFdf2fbwp16mjWrGCMHcE95I&X-Amz-Signature=205562bb02974dba394a00a7f3490294ccd1eff848cbd6dababd968bfaa74f63&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665BTXWARK%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051536Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQD8%2Bf91JffOMpd8AVx40W2H2CXH7k2v1U1PDL84wOGPaAIhAKZCff%2Bj2SOhuHDDC9uh1g9iGTwisOQbnuzypWIOJTjmKv8DCAIQABoMNjM3NDIzMTgzODA1Igz%2FFzO8N%2B2B7%2BQhYIIq3AOCNwPTRaYmXXGOlC%2FhRNokZ266LHaek1agQVl4eOWMH8vLuYxtrriIvCfneJoTE7ln%2BHjFRHaaYD54OsGIn4NYIpr84dlribef2NOsCoM87EPWXcW%2BwDDKC%2BpJSCavkfGRJnrCW%2FHoo2jGEz7xtPBO5ursnmpN8KttKJ7NcurfHlhtm077ZbtM4A3f3h69zH2Z9Nb7tCfOK54uKQDyNetcZWYuUgY3YK1ja7oxvd4zAxg3Ovq3tBoydWKqzZxJ0kvXAX9PDLFjZCQmKrqJ9LMBH06BWP9TcAbXL40PzfP7nx9x5UH8W%2Byx%2FF%2B65dxZqgXFKlghYWW66qp1%2FFUNHY2a%2Bw0weUU9I31lWoWtYBZKcpt6BGuudaT7JehqxSv5Q2xtyOOPtI9EQK7I7Qf6x3Gg1XCmiTskSL6fksZqKAgwBWwgLXlmZ2cEl%2FRSefj8ReRA6hxJJwojtA1hfdfDHn95b5SJ2SZhQxptGQt4mf48NW298bXy1spDwbqQEeZxh9POq2nyYrZavFa%2Fmd8MpiRWvj0jIQA6XwZDvJXz76sOh1lwj%2F7h2I26tr58qGj9A8TjeFm3wEJUU0gWLtce6eSysqRAQNRs8FAT%2FusQ75md3z6vo8skm4qH0UtkazCmp%2FPQBjqkAU4yegqdFS1jFVW7QcW%2BCAGWrsyoqefJa5houUWiboXz24123AJPF0u04kjKIebQmXZevl5L9U3YixvqW9U7oVEiPeLMhFiSxBdCvp4LItVClaZDVw51UG2Zhtxy6mM6wHSSSzposGDyWNXPyLESHxeLvfBvGK0s2a3F5Bj8Hcf044eVZLSR3UDPjIFxLlKc2dQbXFdf2fbwp16mjWrGCMHcE95I&X-Amz-Signature=fbffbafba2042cd95fb7b119e8d20f5d85dc7468d9dc4212719c989812860cc1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
