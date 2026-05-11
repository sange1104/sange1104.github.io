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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YHUJ2MCS%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043530Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIGfhsezb%2FsK0ZGMZY9hHACGk2KWnZwz1GcKZkMSy%2FmGQAiEA1tEfVeQ9MYeV8tdKv%2FFSvdKmiIj2rk%2FNDkL6XMc0PfUq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDOQE8Te9jjzDYUVjKyrcA4aF8nEOv7Kilg5z6egA0h5rsvHds8EGV5n3rZrr17sj5QvrK0T5I6i7yr8uhXFNftivyKxCdDrtveK%2F7OlN8QzAK5xBVf9icuSB3FT6nTbU9CoMSk260UZopE8Y9nLqRL48wt0gci47Y9PfqsbJQPV%2Blh7CjFIKLvHxcJ7dI5BPVfDCfLwlWdXvp0aPsZUgHyuCAXLxtRT5JPDnpZwE0vLDdO6%2B7nxi%2FPFjI9fzHHBI3CPEchbeJUoLufmLFCpIzTlABqIHcyfQVb9gTeBxVkL8x9iAs7Qdm3ck8Fs3d6Hj%2BRzrRJIAv830oYobP92a%2BFAChZG3F0MMq7HT2FhJLdjh74li4Ql38gdzXmMHaZsbAZOUHjFGcUkYpUHNwsBpnaIE9psV8MQD4MxG9fkquxxyQPE9KsT0N3dF8%2Bv%2BO1xLT7Qh4yKaEcHt4mGAHOscFJFv5bsVF%2F8F%2F3Cs9xrHRRZIbzMzEuukgLGnMsWOJC5%2BvK1nLFibwCqT8EG5PeEwmAQyxiFS%2F3qMVkb490leAGf5YYLVa3k3nOTlSvyf4TSHRBIyy7hTgEqFEdV%2FpzwM6BlhOCdrjYgAGLyilfW3y79SjnOJudo8vrk5qP4tDZSrpzjjtYAvyvFSEvcaMOG2hdAGOqUBnO5RU5eKB8MuZyKm0f5LoiHr96MHnNsAHE0cBzi4kZXgrswpkVXXoLkjacCjVrMWI%2FusUmz2%2FM2B2cMGFab7hJueL3AC8EyC9f9YT7HEtbsGl29%2FChNZcVPmP5WHFeSbdazSPsNV2lrV6DuniHr%2FMBnkXqQ0Lr%2B2O9jPfq8pkNsFj44AaAgQ15C5mYLLbqXvHsPRlK0EAaXveQJRnhB1X8qpcKt2&X-Amz-Signature=33e92e781df9a13121292780dafa34f3b3eca0eff0a91a79894c64f7c48ea3a7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666BIBN4YN%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043538Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIQC3npbKnOOsx%2FZRsuQZxzLqTWkn71aOQQMIx635qbPNAQIgMbIZ91kOu08iHqWjj3VmWnFwVIp9CfiRQ3VeElnEJoMq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDJj5mWXTUW2hBjRtuircA6gr7%2BQ4IdwwbjXhlDQML5EHDN4Qc3%2B2Nz7mcwgDF7rm03Pan3JNrsPQC1exrRJrqSWvTu2FLGMdjjHRwy4daE7Cq1H4ZZkcpPYhGUK%2FroZS8b7pY3N725OAKeRbW35QL7yURrPkqz4irFsrqDvE2N3E%2FQHoULpjNwxfu6V%2Fl0l1JjCJcMuYUqL%2FmIp3j7jbNrpsxvF%2Ba3K0Z8v8bMw1v%2BinIs1RWDJ4%2FVs8azdjj14oMHAVDTTvrk8a%2FncqV1XhWawJJqj5caBmPv7mKXNGnS9jDWd9p3K6n5z%2Bkoc51%2Bkao0FLuVvJD8N2lx9nGZOjW4ENP%2Fy3x4a93K14%2Fb5zyjuaJUSz8YLqkoI3L7B4%2Fe7sL0PIrAfKWuYMbffe1cs7j4KESgaxuxvjaBJkfU%2B2DZVxX9BsEcHAWiZx1qD4cls4QhXT6%2FdHsA0pZXAzN6xQoLIBUjQjeBv9v%2BW6KCE1dMiP23esJeA0Vmwlgm0AbnCyG%2BR8oBRKjl4RArfC1C3PvvEj1AruHfqyFmy03CkIfFVIP6uaLPB8Khne3OZ6tChllD5at4vlgDB1Eij%2FeWCllPcCJKFhpx7gTjkYcZgyA8XVtRhu405OgvX3723Urm9tjj2xHAvyOmeJmRGsMM63hdAGOqUBIdsA1j73eBohJlQEGa2RafOcH0MqM6Bh02ehTphPSlKuZPWZCBso7%2FXC6nPZ7%2BCsykJOKYIyQI52riu3c8vkTuC4vyXsY07VcxWAcoCqDAq1ar6GQvlTT7YcQXvLNLRG3LMpVDG9uZ%2BTMnvibrzrOGgTETy8tPbc8n%2B9RGeOri%2FotiaYkqMv5iMX%2FFHPn2TNx2c9Qi%2FcqTdogVG2Me3uiDO2Jb%2Bg&X-Amz-Signature=dae75c65b679bd62e8bcafbc4170f47cffd64569b73b7ca42cb37124ae2fcd94&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SKTKXHKP%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043523Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIH%2BwC8tp9ZlLOZKIUkKnf19zfhsfEw3FHYKxvoU8mWGDAiEA62uL05aDnKXAZg2En09G46cKNauBxwjpB70%2FdA3FHeQq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDO7xEfTeeGBnNvtEbCrcA66GAkw40zfSzBPewLh1oOLjpHLiaAeDNE3mFyOySXXKNpTfwIyvt8zP5pt6UiMgi448ReWTY2X1dLK9Y1uwNHfdqAOEQNQsdy%2FRI6mDBtU7dN6Rzn61IjiPivzPxnEXS%2FRUzZTYwMmDdy2gM1iv%2BYACP9PfL0PD3Egq%2B3Zj086xYsqevI7SSwnz1A%2FlmfPHOIapbpK%2Fg8K9sp3pKDX8YtnGJZ6VWtBymyLg65UnLLTfcWwgFOg0Fvyz6nN8YeCFA3YEhqFtuvG4qE9jrbBaw2ETZxPAcz3VxI2wt%2FDQyKc5X0mxL5FC0WamN2gV8dqh3A2Rbnz5TU0cRori%2Fhrl00NuUIyacP8ZyJ1%2BnY%2FyAiWGioz8TK4EuLhQ7v5jYoya%2BxBhal%2FHENiabKx9dB8BpbIdLfk4h2WhJzf4i0mLyceNeTFW8weMyOtaNWSbJErXTupsCj%2BRrsgxbsl3gEOmWPMnHYup9%2FwNqR5Zgy2xi06%2BtjOy6JHQr5QriIUKoo7LWOxUh2EN8VcY%2FNfwCCtTbIwMAJxcufj%2F7mR%2BxQv4P7Vr2CBWv5tScj6t7Wo5JEDav%2FSiGYbdh4Ti4uLwZxVMNp7TMgtNSzvTrA5KDu%2BnyUj4ErxARYCAikL8qgQcMLW3hdAGOqUBcIzP%2F3saBpuis4t%2F0qhjTaQqLWFJmm8M%2Fv6RaOHnoK2VSPFmMQ0%2FsyYbVvtX8NAcGGM6eZ4SvADV0i49bwfQryV8eWVcjpDTFMKDURH9frShelcNSjnB6SGJw6tG24UKyQphVyrgn6uPlSRpQiRDKeH4eJvdRdm4AJSrkd5Cde%2B1CyAhl2N8kizFp1b%2F3K1D9gPcS2cgELCxuHOkFxJX3xiu0Nf7&X-Amz-Signature=489db5f9f1f433f329b61a9bd4a609017ca4c8334f1cdd6298c19cd79d75a89b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XOZPRIQ4%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043544Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIBMP15JWBmMEvenCb42NS51BsDLAWl9m%2BwtBdCbZEMUcAiEAk3E4UbZfN5knT2mEyMnVds3jss52ITy%2FCkQuig73oDkq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDPR3nHHF97geVLeovircA24JOPt2UYU7%2FTGMk4c6QNbZDZbz3vjJ4c9yWc9UEqhZc8EPIw2aZ%2BzXXyGKP%2FoT%2BiZQh0RMODrQK00WuAyLE%2FWCvGitwcunhQrrxoPElDYtNvisyn%2B91%2Bgrhb9n6k%2BDZ6L9ye3NXislLQesP5TYbzL4ZIEInuzaLJhuK801F98lyDwRjZ3Aopsk3d2aUPf2sCoMzzJtIxnSvM66Md32uSMf5vslaQYeYHtdLUhi09A8A7ay5MZyLf7NtZGwN5I1%2FkICbpvXVDhyzbl50hxBQYfKxl9vK4BaPQjqp0rfU3NnxTMn5CzCA3lI1SX9ptG2ZufPE%2BWpM%2FC20%2BzUuTwSgA%2BGIIfCt3ZqV%2FXKoXYFd1GvVtQBEEuMW0W6KbwUMdmVK2LVX4AQjGYGw7ECDCrCWMGOC%2BEaFPmD2TVbd4rAWG8i8MhgVQqbzR8TO%2FWp63gdyRI3l73VVjeiA3o2r9Z3qUSetDsAYiDrq%2BdJb4PVRFv6N9xDaZDH0SjOKNJS5dSpNr4E7W%2F6%2BgymBNbUgA39f4d4y4NxFtiyMyKichCiKZ8LZPwt%2BwWgAtBBPeEE4d96YqrDa9sLmvwdO1HWnSP93C6o8UtevZ4bO1pfdLMxXMgzsjDOsQEb9o38WgFQMLi3hdAGOqUBA0zjJCfb60O0tHMBr3A32VvH8htKoWpvdgnxamdx8Dg6n25fCGPbqLEcxjpH1ZoNQj6XU4sPMStempi5oDUi%2Fffs52L4qGLPxYkpoafJ2sy6jB3vOdADv5NQQ5nXgUYw4yg%2BhU8OypyNivItykr%2B7zL6I29FsPMupIRVpPH58joZx0c3FTHmh0DqUeaQNghkvjD%2BeKks9NVpWHp0tdv2OS6B0gdj&X-Amz-Signature=7b6e8e3cbec0ac7c002e66a59319efee933bd0007c72c7a85f46ee762eb5d41a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T5BRGOQH%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043548Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIQC64Ww43PbiIiKsXJxet5sb63JZv%2Bem7QRaPnoz2%2FjZEwIgAJ0DrbiXgRcph9GKrcHFSW9sWh7r6%2B4PFDNzGaq4UXQq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDDQu4%2F5keiPD%2FdZ%2FSCrcAxARknCFoSPGryjTt1FbBc0K0lJQDZ%2FxOlwzE894bPHS670RrF8f5k0NBgwx%2BhYnV2Q4AM3ds10JrAi7SZ935hWiZcRCiu01P64W6l2sqgM4AabMqFGjWm6XYiOgP2ZDh1wgyXPNDXTtuWiXCwAIzSYkRKneRMSxd1HSGmq4sSYbC1y7yqwaSl1FA51xVbjPkU%2BCiiXcml1ALR%2FtW%2BzHtIjEzygeFFvvOHwSD02VYVRwZHByVE0gg1HfqskmExTvACvUVCbmi5vtqIiywAWjarl%2Bxc57W8k1x6wh%2BYa7VidFwg6KoSJPnxQHkkI3jbf2NEEd9lbOeU6km1qJ%2FE2TdIMMpZ3BvIx4eG0Hfc6i6ND2HLJJtwlmmnIhQc%2FbCNmGQXbzfm%2BGJ1%2Fk9VLSDAE3tnGrh02trukDHl3Rxk64wzIQg6iOI1suTAKxra%2BqmfXuDr240O%2BN9FnkDgUfbukuviBes5jC4oeFzjVHkISqWEjYTQUIp4Mua4Mstdp1USkGT%2FZmS0Y%2FtXCzBZ1O2RnyHxfV1NQb8ehr1eIm6CUKBXTjXqsnBJ4B51RV01GNrzSmgTBhiYQTHClqQ0AXXOpHDtCp9hjn7TrdJFuUsFtVajVuAwOrzICIpaw%2FT0FuMOi3hdAGOqUBo9J9btD%2BKkZaeS%2F4IhHbVUCN1OHljUZ%2BWAULYZvUk2JzbOIpZPLloTAf8NTTSPSwAH44s5kw3X9t%2FSvLTxHGVfqzxiDoFyusFx2D2h0n7fVfKhF5ekj8RtF%2FWmdWqmqxx0%2BEGA3cyZGUGXHZSNghnXQz6RoKkUfZz3aIspkFwxQ%2F95K1QP7hB59FbJRjiD8ZiAxaJ5FkMTxFbJsFnGCXeyqdJAoh&X-Amz-Signature=f11e6b220a1003fc977f28370c982c972e631af7ee0f7045069b44b5fe398ab4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QQ2UKY75%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043548Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIAh6V326RTEX%2BhKgvIq5ZhcZcx06FIDH9AonZCrZrN%2BzAiEAu%2B2a1jP5o2DsA7ziBaYdNjTvZkgbaPkEXLNjkzBuf60q%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDAOakOg66a1fywPSCSrcA4Voj%2FxxXmCXEM2TfNi5kbZo5b3rL4K9tWPglcy%2FsilLC855DFSLtpaUXIxJJhdwQhvE9SvCNfWJQQ1a%2BXjIZDKgBsvs%2BGAyg8YCQU3oj7vkBT0XuNZoSseXMxVzgJ6Cy9PWVstB1NHK0U77PMpiHTv5pxoe9j8tuQ2no4gDdx5ptMnXATFKQ3V0GrZRCZZMXnmPf7RPKpcEK%2FvCwS2DShMqwC36z%2BqV4x3Q1GVVxiKCDT6lLY6Mv9S00nfELqtPyPl8MXoGEU%2BOggoYmPcuqvLgnHTr1LIipNk2wJs3dEg%2BEHPul7PUhayhqlzLE30Gh7MdeSHG47qbZ25jfMbkafvRL2zsq9c%2B4m0stLuCgowsuAMVoQAWoYlSsejQOSFzWo%2FRK95iAd1AfoG%2F%2FcCHLDJqq4RvtU4Swyl7%2Fd3x9CLwXv0vnpOACmWSY2%2Ff1Y4HkOwEw6HdirRCIQRoNx3f07gyesulSts3nia4Azah4obGQKWuWNYFmzLkaRTj%2B2FxpQPRjQSFPUPnajQjnNcnIzCzWDJNKQlEDiWgOlHjXIUHoa2GixLmgfUvVIAcOFgSaKGSSjbltqmKhxPVxEnfIENEoouOW75miHQsHORn0B%2FgpUgZJmi10YNyjicaMJ%2B4hdAGOqUB8sLcyrYyo8pvsgigO0zruiQZqP%2F8fzxAGrBPkxVlpwEeJl96srL0knHeStHgFsDJWde1tyhpiuW7VVCjL741g8fmJq%2BZUB1jBWGh7jziKwZ%2FznyGt35gAT6w%2F81%2BCdqkKrzxsq5z5rtTqIy0O7Ag04CBCTNaF0puY8zHJxUzWXQhudnQUbcrUYqIESf8%2FFEv%2Bi8234PjY8AUYmx4jHBcvE5JFI4C&X-Amz-Signature=ada31e2c18e8019616c107e954647147f869564c5ac1ded83804a0855baeabc8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNGHGD5Y%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043548Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIQDOhYyte7bgAzL0WJT36wMh4ElMOAqVHIqXA0biflqb2gIgcMAPpGDASyQJ1Y9xU%2B2199%2B8pFAvM6ix5QnIUKsLqcEq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDMDmZTGSwThCPoqPSCrcA7YuukyeOGmSCbJvPObmGr9Dr9oVx%2BkKviNsaUU8YazPmkeAL4j77a2aXlgIXRbLROI3LGwCzpZhJMZVjyBifhGjl0YMYhb7NciufZPCGG7oODSXbOK6FSg5KaQ6RIWjD20sskVe3Ppp3JpIKhoQaCMQDOy7QGGOe%2F%2FgyuCMwKo3%2FgujjQXBIpHSiMG8ZY%2BaKqE9BEbzk6UTCGdBDn%2FaQIAERPUkKbsEWLcX4iLIckTz%2BMLg7v150LibaQxRnRBxiVeL3IDQgsHI2IX3cMCGRk1ESk1aOXUkwNSpn8heNPRPrtJHDKeZziIiwToX20c74J0FWTQDxFeMUYi2gJxcsitSmauH0XXH%2FgN%2BGeVJPZFOVzaBiIm3ha3qJIxdqevGcM2KSFl4633myak8uGVYa9K8KxyD97iyIFLelIDegujjxzIlzA%2FY5IdqRrjn%2B0k1IpmI091ARon6dxpGVsptGK8S51W8HFSN4sREsXUNWhS%2FuFivy1WSLUDS1NydexlezozVqe0HVW%2FtOpxbFb7C40pmSs1aDI5bL%2Fhaq8KTnjYU5HNY%2BTfKXVbSzGa%2FJvxmJNGZu4W9Z5kEKgfAJAubqcaIKTVA7USWfc%2Bysxcp1ASYi%2FwzcqOA7BPFv1TvMLW1hdAGOqUBZgSO6GYIxWDQMLtrWni1aiGvllhHfsf5%2F%2FJo2fvUKSvV1eG3K7Q%2Fc5SUnzdMc%2BJxSlUOlkEphSNXRZMHOi9PZ3gyEldko3pdJEWX1R2Z65r8cCT0cOjbwSAL5gghL9AGESpKTNEXIShEk1Z%2BsdsNxO0Huga2kHzWrpfpQn%2FgUdkBykzi1VCLaZooa8Ky%2FvVmOABPoJJ7ExoZkYsEM6F5VD%2FujQ9G&X-Amz-Signature=6b982c56ebd9de70d4ad4d0559bd872f25c95ce6f99efc76b3fd5b15a68ebca6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UOJ62VDD%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043549Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIBjWzVvxfRlnaDDbGYtq76njVSBPe7D2JRuEkb10Aaq6AiEAiiu8IG2BxtfjNmGFO2DUiCkTr86f1kBGjts3zXuCp1Qq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDJBomNkPjhYjyLpNZSrcA9buIPQYBx56oHWYFA60gQRvA2Dy%2FttocRZpOAHsaUKpyNbpoFrmHJwBTQsEIP1OvQieNoO7FiXJAg0kFCBucgz%2BniVvASDJuGjhxz%2BngFoCiUIvYY3oS1q9TOO1WQMtIJeZK7K7zLt%2BNzJAbExUfncPWOurAHbTjrX%2FmwO50dQK5ZpZbiUnko%2FOUlpLpGyTXTd%2B5bdnBxED%2FqZHgGwGPhUI9dhMCWSyIJShYOBbZKMqB%2BgnjtQC3%2BKwOB5abLTeeKepzLZsxUoRA1ww55XJTnqEcIs6VyXONEQvnLF0emhDFIYw%2FwJPzPE%2BwnqT4FAdwCOKLRbpMRd9sI0CXBo0J2Ct8mzXw1WfSg6GvU2WRGr5CBZ0%2BKNxfqN43AKcHLnKbpaIC7r6E9%2FZq4WvIw0Rg0IyEKdpexCul1IyaeIuqEv%2Fn4WNk2QtMLvehaOzC4qfuAX1AY4aD9%2FuFTEVWyPPvKbweK3bl2mwB0eYXPgKw412ARDTyfMP1DmFqh8hEPOntUpWxAYGYeZKPdnDaf%2B2SQn9s7pIpYEkMIgVTJ5IFsnTbP2qG7t6lc6jdyAyE2G0QVXdN%2BStYjw3STGRdXhy86iSdcGN356LaaTZ%2BlzdhBBhRf%2F1wOL5CicUiKEKMKe4hdAGOqUBbT8FqPCHiYS9ocau5d0UlRuwwUg2UwQ8E8iIABOOQ9Fhz8%2BFxVEWWWePQWCmi2Pb3mPb4OEH0yX%2Fg1nhRsy3AwMaVmouZo2Xm9EWSJJjF7BHLHxwP3HTuWqGpvcodvm9OzIKeX4NHQ1fteXIJz83mUSdF7T%2BKbWjnxl0JPc3bDl2U3AdqIMcRZmmwmyNu90YZGLG5CgEytKw1PhGtRCN%2FB%2FjUn4k&X-Amz-Signature=a909b10b73920b3a61157e399c7bd660d5c4554fdba80b510eeb2485513ad6f5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TR75FSZY%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043549Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIA4EzW0ta0fyUbLr79ERnQN50iCXz5SLde4OHTvZMq0gAiEA0%2BcW0VoQVMStsKj4%2BnIAK1QkvSEfYJQcUpDp%2F6SKOMEq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDKlNT%2B50U0A5CCorKircA7bj5MVtGaJsGuhj9q1XYdyJ1PUALoE2W8t0%2BYCJx6WarlS9S6l9i4Vke8CeByT6i0ymjrg55IfUvar0CHWtarqVgYkOU5%2Bb1c%2B4RMrdAxD6n%2F%2BO1xsg2WNeK3a2DDZztuXI04mEPwFBqug5e2oBP5W3iHTWWuyzGrFu0tTFuaepHMu7sG5S5txwIztQaAWqlHNJbFcBg2YFUlDLJqcwq8Sy9VPrGv8Q5HPJG2%2B3o59KuITzjP0KN04%2FjfTq8JqmoQVhsfQAoheOc5M4eA%2F3yt91CvfJDd3gfrGEEt3h3dGFT5RRE1nkkAk5zrkcM8Iq3pznzr2hr3IJHwBwsMU1cDhsUu%2B6YLdaGR7o05SwWdeHZVvArgBaVLcnx3Wahth%2B7kcrrvknDtaoJiiq22qd7UpOLyEokynnxRJ57h%2FZPq64hDiysdXvC6e8Jnp1lLrhuYPlU1TC%2B3Nz0iv86lQrifsc80J5N9VzINNY1Ptoav%2F5htGyBa1HqQ4RBG62XqikcqYyTGRofnC897V%2B3sgkeX%2Fxi0Uhi6cFdr96%2BrpQ0F752yh31rAymeFLW4LOil4y6%2BTgZhzIMJTUpbkYfX1GKkfc4Hwf05HjmujPGXPtBfOnwpWg%2BvFgouWtIAjaMIC3hdAGOqUBDnoZvaeliRO6NcOmPguVxMnJKYaINR9IRaPQ7F2G0uGVGgwuoP66xbx4f6nYLz5c3ZDGB%2BKcWtL8EIuA07nswXzeRkIjZal6LNaG8u7TKr9LuPIVa0VA72xnH9Jo4eYirBXXVkhWGYsXUavzpGbbh8R1HB6w2FiMy8Xgp3rvw%2BYDJYGBdZhsh1k7kbf0C2kJl3L8Png0oczzcNL%2Be7VoNv5rYw3U&X-Amz-Signature=d28430342926951d35adeb9ace19fa94c2fd549486e327d8497b4880d28743ee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SJHZWNOS%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043551Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJIMEYCIQDu%2F%2BOtBeU7ASWcFICzKIJaKBt%2BLGGAsn4G%2F5QHaED3gQIhAP%2Bn51oKklvl41CLkmzXM7Er6cxg2OVBU8R8VdS6LqMPKv8DCA4QABoMNjM3NDIzMTgzODA1IgyOtG4yGgx1pR95ZoYq3ANyGg7j%2BKxSng1UrHBeZLF9r618%2BVCk7ooNZLLHMhziCU2utEAqfzewPokitqUQJresWjOe9h9%2BEuVkBYrKEAYfrIRtZfne%2BtP%2FNuP4xHpz3YDCQZSs2HZCahzDKeVyarg9rNOB%2BnXIHj3JKlc%2BvhYgyle5mUiTOZXHWKvBW5ic7qfylHCNFQJokIPBv62L4nGKOh0DZE1WOThDHeNosHhyBf81%2FHZgndYgNzpr5ClTulBQAhD5%2BuuWGIgYiyCO%2B0n7ABDtyLk3xS8Tlwm488v2m3VZPPg%2FIHdR%2BrWUGsN2JVa9lmBGa3WozkWUYTIpFSbQjVlzKmV7fqiOwIWttZmQoU8rgkiUZEPbRXOjPW2QgtDnC2jmr3xXaieY1Oc9ogH1blk7flBSSC36niQM0EyDMT%2BHtwHyB98JhHx0TyfkqQHozonMx4OPFQiCUNSVBUJNG7eU2d9GhzuuN2hIgzmLbUSyJYMiYWwN3%2FxGAyz4gHbDhHYFJ23N9aWcd3bhEdEMW2Kv35im7%2FsmdZhidQrABQCcT3ljmi08g5IBExdZHg6IHXzLn5n7JoKxU%2BRx8QpXpdjQbbyK%2FrJBH4I8DMwDD9ymx%2Bhzsd6%2F0aKBFCr3%2Fy%2BveEbekZ0CSOoJDjCWtYXQBjqkAafusg0TQXPvWnIs9bhIWat0xmSZtQuC9hTk3npQXDmDCmkT1%2FNxrW4qK42d%2B2MC4ZOLs92D%2BQAQhtCKjMA84AouKuGptJz7S2JSUXigwzVh3GqNudmFgVsWOSurygpKc4VMzQmMMPPl%2BcehCMYhX6ZoZxMhyW46GM0TFHRIPaUuWfOuvn9Zik2uDhIjiqsghFQmLBzEoDLy2GnLNPR7GcNZY%2BSc&X-Amz-Signature=f0f7998eb26561b06f8721823d2cf4504473f068484a8d024ad3bd8c7f1fcefb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667MXTSYTZ%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043551Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIQDNG9Lz4GiB2xgBRj%2FPmIWCKeiUnRXC9T0Qulz9KRxR%2FQIgOeHhVZR5zsOKwUiZ7BR5uuGWCpVvUxDvKlCt3KHuvBsq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDCNlNzmar7%2BDOpl%2FxircA6VR5%2Bce3i%2FUK0fNABHq6PsKfAcLdpPVY6eFl3qtbJ13PlTRfAdXP%2Fa7sK8ityJ31QU5NxKvm4WReBfbruVyBbWdUtF3MbOQzUQVl9g1MNuodAIAeWK0oxKqPsld0KzEVSiqnvABvwf6Ln0mCPr5vkMGAfSxuL7hjBfwReOo22%2FE6KcfkTnpjSgkpDIpLLVfQvO0qZ3V36KApBKiijzUS9UjrZ1N35QIv3m9G8zn%2BWPbxVfOPAFezaX8Hr28w0Ep4QQ4gVOCBDl%2BGEguFgAxy6X%2BuinlKOQRxeSZX8Z%2FqnyWAeUh%2FkcDgLdZaH%2BgxYUEgZL2ecZyRIop%2Fw%2BZ6RxrDgsNjY5z%2BFeO7KPMPFOqG8ACH51ARlocTuUe4524YiC4QrqA6IZPTaLtmle8GyrtVnLQhDvEaPGSoWQdh0rIl3eHToM%2F1AA%2BjT6IR3fxdVynaBT5dKP6r%2BF8OA4tbVKi2yF0%2BmPM%2FhpbnLpPKDhQYoa%2B6f8BTKX%2FUAMc0SZyJdL0PNLjDY%2B33R3xgBi1dkToKn69pU1eaSEmcXmwHI8446U3djBSyIshryFtY1GSaCJQ5coehAzJeBHrFqDUrfx2L%2BIVSOTPDQp01Mb9pZB6NxBcpMX9q5rx2zkogP4rMPC2hdAGOqUBxu8QZXwM9XFkYcycdbc1aAprTfpi9pdIURcoUEeSPr5SLcBJjN2JHickj3xGrfHRJGy0shG7TIIW2jBpiZBHtkTaFyJVaihM2ptlZ2722IGxrSpAcdXhjs%2B1YhbueGQptluZ3Jldja0pgoqtbK3pnd56JC6csV5hptsBgUfHXfCcq%2FCy%2F5Q0uzb2CVJ6qxwqeokz4bPvTYTlu4BU2CjjpM2fKyOL&X-Amz-Signature=b993f9bdb3dad383ede876334f716bf32df902b01fe1202795e4910d59993927&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QP7ZUGKD%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043553Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJIMEYCIQDejiSSz3v5THJX5fVwzw%2F8GSGp%2Fhui69p9A5tY5DjH5wIhALqBw4WmcvheCSrA4Pcd7OeCkMOwPJXIFBDNpqhVLyAPKv8DCA4QABoMNjM3NDIzMTgzODA1IgxPDibEHgj00vzXNysq3ANyaV6%2FfhNMIl0Jx9URvR4HfcUU%2BR27HnhgMEEz6QbkT%2B%2FugjWE7%2FXkKc41CDvvIpgG3WtHKurz7tgN1Mji9wHxTw%2Fj9QhmGxNzkp%2FQ6OLh2INSRZJggyqQ8gkYy9eynnIB0rXG0oe%2Blg%2BQmuudP6Uh6afSRNrWU6ZLSQjijOvRwQb2R2bLnCyEzLnIqjqFTjewIlErS4xg3zmtXs201h6sFm3ZoaAlQSzcCB25%2FX6exQSuvJ8%2Fy%2FQ4v6LfQogvyNvBvZdA3CxNstKGPC0Ze0QC2F8XCSzfpQ8PzLHlYw47XVfR7fc1MG6lRSnmk2r6%2BD3lyfhzgXeCXt2DDMfBCnzrAS3VACuQtSHZtZP9lnL4PavnUgtpHiS4ptD9LZ62Du9ZsnUOcjLgLOsU35A9LdYaV42KBgRYsY6QkdgsY9LMBgtA1bDFqZLpUE6goWX%2B9TRzs4OIjeR%2BHdzGluIWXIervsWSw1rZTtlQKHIsGbHE4FOItsDzsnlSz0rmre2tnopL8Btol6%2FCL7pB831hxYnkYj0V%2FZVK0KrI8CCmV6i5moML0%2Fg5vIAf1UzDxDbwTxT7E%2BDqeV5Le388Vc0vHwcB4WBgguRRrbCAajlj1LJrNlsBUyzogRmyB5sAXDD5tYXQBjqkAV7sKs9bz9FjfTqR2Tl11i8ImwSA1Zf9AWvpNOgVg4F5SXzq7WUJYbwCIL6%2BXhwmPljQSIWfZN1W8phjGFm60jsnhkZrmWNdnOyTv54NjkJmcxfk3k5fwSkc2bInJ5vTG4VtZOyaQtcvsqxtrM89Op6mAc%2BQ9bMMN8rHn8VrMcX9OBBLHYKJslbf3%2B65A0criICjMlHDlN2m53PtMQgiKwzmbD8W&X-Amz-Signature=27af448add2679b989ebe9e5fcb9235e7b4b9981d62ecf5531062a924742fefb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665NYBJCO6%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCIFdjUtpnviWjN%2BRaBO6IP1i4nMsOlRkl1GzbeUnhTVCDAiA7zYjBKuWbhfvc771%2Brahz7RhMoSUJ054UJ0kx1mk8Byr%2FAwgOEAAaDDYzNzQyMzE4MzgwNSIM0QG%2BKgigDXn7H3V8KtwDN0fxmNhI77LqXcdPqNkwmENGrRgTXUfSKwCe%2FjUzZV8iHvW1u91hnIiF%2Bu1ArmZWW5P%2BzmSCIuH4v2I31oLAgSAm8rHoDJRQELQBbSKHujG6xT6EXKT1s4JXIDfRkMQYwFzGZ1sfo6uDUBgEJ%2BtV8T696DntOoNjD5DG8BwJx3upxAU1i8J8MVxc8iP095tPfo8cEn5GItTXSS8unYoXxbPpHLqAKVJ%2FLmeTac%2FaFhi5leqlr0rVFwSk1Fwf9Cu9VbUPvOPuMxGq%2FStnw20HaO0EzfazH3bbarnVfVeatwk6x6J8206%2BsMgECdogs2wRZwMxBVbV5cOOKbRfeCIdwu2453x%2BJsV5qklxj60Qn1RdD0RVG8b8dJpLHjhe3cqYbVy6RDcT9Qp9roZ8oPtO3Wg7mQmq9NJHZ9dm2LpN93qyW6YdrEPXpIbe2fSyUa7ahYICXYkBMBHDlobpVCR%2FJjEszdGpbPc%2Fk5FL6o4l%2Ft7zFwLFybQq2dvNu2oF0gi1TnsPHPH2eEx0MsIYDpN4CSUlVih48cZO%2Fq3ouhKh9BhYZMYEhPZ6Yd7rSRHIi77Ls2g2SBl7vBjGBlPQfe8NyuylN2feiztD%2FToA%2BQSc8cHChDauxapK7XX93rMwtbeF0AY6pgG%2F7kRxyLT5H9oORb%2BdZNA7jkovWvGGX%2F1txvyh7%2F47SU9tQOPpnGBOVvJ7N8rSuKcqFHY1s4tp3t1UPW7csGvuuF4H6TQbIfZ%2FpbnFGQLAfHictXn76HmLXiFmx47cI80vyCZuVEXzpfIqNoY5JPQsqLMWcaTzHo1mPNuGp7vASp%2FLR9V1NTM1T2SEK1K4c5l%2Fvjh8M4rm3sWruFESrqdYps4ZpILH&X-Amz-Signature=ffb95923a993301104000c1fecb10dfa5a9d4c7a39c35b86cacf2a25581de453&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665NYBJCO6%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCIFdjUtpnviWjN%2BRaBO6IP1i4nMsOlRkl1GzbeUnhTVCDAiA7zYjBKuWbhfvc771%2Brahz7RhMoSUJ054UJ0kx1mk8Byr%2FAwgOEAAaDDYzNzQyMzE4MzgwNSIM0QG%2BKgigDXn7H3V8KtwDN0fxmNhI77LqXcdPqNkwmENGrRgTXUfSKwCe%2FjUzZV8iHvW1u91hnIiF%2Bu1ArmZWW5P%2BzmSCIuH4v2I31oLAgSAm8rHoDJRQELQBbSKHujG6xT6EXKT1s4JXIDfRkMQYwFzGZ1sfo6uDUBgEJ%2BtV8T696DntOoNjD5DG8BwJx3upxAU1i8J8MVxc8iP095tPfo8cEn5GItTXSS8unYoXxbPpHLqAKVJ%2FLmeTac%2FaFhi5leqlr0rVFwSk1Fwf9Cu9VbUPvOPuMxGq%2FStnw20HaO0EzfazH3bbarnVfVeatwk6x6J8206%2BsMgECdogs2wRZwMxBVbV5cOOKbRfeCIdwu2453x%2BJsV5qklxj60Qn1RdD0RVG8b8dJpLHjhe3cqYbVy6RDcT9Qp9roZ8oPtO3Wg7mQmq9NJHZ9dm2LpN93qyW6YdrEPXpIbe2fSyUa7ahYICXYkBMBHDlobpVCR%2FJjEszdGpbPc%2Fk5FL6o4l%2Ft7zFwLFybQq2dvNu2oF0gi1TnsPHPH2eEx0MsIYDpN4CSUlVih48cZO%2Fq3ouhKh9BhYZMYEhPZ6Yd7rSRHIi77Ls2g2SBl7vBjGBlPQfe8NyuylN2feiztD%2FToA%2BQSc8cHChDauxapK7XX93rMwtbeF0AY6pgG%2F7kRxyLT5H9oORb%2BdZNA7jkovWvGGX%2F1txvyh7%2F47SU9tQOPpnGBOVvJ7N8rSuKcqFHY1s4tp3t1UPW7csGvuuF4H6TQbIfZ%2FpbnFGQLAfHictXn76HmLXiFmx47cI80vyCZuVEXzpfIqNoY5JPQsqLMWcaTzHo1mPNuGp7vASp%2FLR9V1NTM1T2SEK1K4c5l%2Fvjh8M4rm3sWruFESrqdYps4ZpILH&X-Amz-Signature=c32c898ccdacaff462cc70ec625632f60d7db6c6a360d62b7f3fbd05140b16d7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
