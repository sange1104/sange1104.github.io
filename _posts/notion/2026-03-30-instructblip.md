---
title: "InstructBLIP: Towards General-purpose Vision-Language Models with Instruction Tuning"
date: 2026-03-30
categories: [paper-review]
tags: [mllm, vision-language]
---

- NIPS, 2023
- salesforce research, hongkong U, NTU

[bookmark](https://github.com/salesforce/LAVIS/tree/main/projects/instructblip)


한줄 요약: blip을 instruct-following하도록 개선 - 모델 구조 변경 + 데이터 format 변경


### Abstract

- 대규모 사전학습 + instruction tuning으로 llm은 일반적인 능력을 갖게됨
    - 하지만 vlm은 아직 일반화 부족
        - 이미지 입력의 분포가 훨씬 복잡하고
        - task 종류가 훨씬 다양함
- VLM 사전학습 연구는 다수, 하지만 instruction tuning 연구는 부족한 실정
- 본 연구는 blip2를 기반으로 VLM의 instruction tuning을 체계적으로 연구함
    - **데이터셋**: 26개의 공개 데이터셋 수집해서 **instruction format으로 바꿈**
    - **모델 구조**: **기존 blip2에서 instruction을 고려해서 feature를 추출**하도록 구조 변경
        - “instruction-aware Query Transformer”
- 결과: 13개 데이터셋으로 학습, 13개 데이터셋의 unseen으로 평가했더니 모두 sota 달성
    - blip2보다 좋고 더 큰 크기의 flamingo보다도 좋음
    - → 모델 크기보다 구조 + 데이터가 더 중요
    - downstream task에 대해서 finetuning하면 더 높은 성능 ex. ScienceQA
- 정량 성능뿐 아니라 실제 출력 품질도 더 좋고, 오픈소스로 모델 공개함

### Introduction

- AI의 궁극적인 목표: 사용자가 자연어로 지시하면 어떤 task도 해결하는 단일 모델
    - nlp에서는 어느정도 달성됨 - instruction tuning을 통해서
        - instruction tuning: 다양한 task를 자연어 instruction으로 학습시키면 새로운 instruction에 대해서도 잘 따름
- 최근 instruction tuning을 VLM에도 적용하려는 시도들
    - 문제점
        - **데이터 분포의 다양성 증가**
        - **task의 다양성 증가**

        <u>→ 하나의 모델이 일반화하기 훨씬 어려움</u>

    - 기존 접근 방식
        1. multitask learning
            - 여러 task를 같은 형식으로 학습
            - instruction x, **unseen에 대한 일반화 능력 낮음**

            → task를 섞는 것만으로는 부족함

        2. LLM + vision adapter 방식
            - frozen llm + visual module
            - caption 데이터로 학습
            - 이 데이터는 제한적이라서 여러 task를 커버 못함

            → **데이터의 다양성이 부족함**

- 본 연구의 방법 InstructBLIP
    - 목표: “하나의 모델이 다양한 vision-language task를 자연어 instruction으로 해결할 것”
    - 구조
        - blip2 기반: frozen image encoder, llm / **learnable q-former**
        - **“instruction-aware visual feature extraction”**
            - 기존에는 이미지 → feature가 고정된 경로
            - **instruction + 이미지 → feature**
                - 어떤 피처를 뽑을지 instruction에 따라 달라지도록 함
                - instruction을 llm 뿐만 아니라 q-former에도 입력함
    - **데이터**
        - 다양한 instruction 데이터 사용 - vlm의 instruction tuning용
        - 26개의 데이터셋을 instruction 형태로 변환
        - 11개의 task category를 구성함
        - 학습: 13개 데이터셋의 seen
            - balanced sampling
        - 평가: 13개 데이터셋의 unseen → 일반화 능력 평가
    - 모델 - llm
        - Flan-T5
        - Vicuna
        - → 구조가 특정 llm에 의존 x을 보여주기 위함
- 결과
    - 여러 vlm task에서 zero-shot sota, finetuning sota 달성함

    **→ instruction tuning + 구조 개선 → 강한 일반화 능력**

- 기여점
    1. **VLM instruction tuning에 대한 체계적인 연구**
        - 26개 데이터셋을 instruction format으로 변경
        - 11개의 task category 구성
        - 13개로 학습 / 평가
        - 일부 task category를 제외하고 평가 → 강한 일반화 능력 검증
    2. **instruction-aware visual feature extraction**
        - instruction을 llm뿐 아니라 q-former에도 입력해서 instruction에 따라 task-depndent한 피처를 뽑을 수 있게 됨
    3. **llm 2개로 다양한 구조에서 일관된 성능을 확인**
        - 다양한 VL task에서 zero-shot SOTA 달성
        - fine-tuning에서도 최고 성능을 보임

### Vision-Language Instruction Tuning

- instructblip의 목표: vlm을 instruction tuning해서 unseen data/task에서도 잘 동작하는 일반화 성능이 좋은 모델 만들기

**2.1. Tasks and Datasets**

- 데이터셋 수집
    - **공개된 vision-language 데이터셋 26개**, 11개의 task category
- task 종류

    ![노랑 - held-in, 흰색 - held-out](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b8cfba8b-856c-46d2-b746-d439114dce86/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RKT33LPE%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032924Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJHMEUCIHUzuRfA6TgSadlDPVqgRBzNe5gY6XBdeRQGplPSWHNJAiEAh%2BBfGl7Phm6FbLfVktEuwoE0cQkd1dh8YzXVtLCBJ8QqiAQI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAhkPk4f7WSzRKgNrCrcAwX4cx7ais%2ByKaTDoS6w7I7DxW4%2B3vnpa6b3B%2Fi0lzQM7MQCNC0n0ZIucZcM8kTcxafePPo%2BDfsLohds4qLd6x4MKhwYG21QXXTijZWE3sUu%2BNpyTbrBEQ1PZv2NnC5zSNZo18rXkBAC2T5IcG0QN%2FsXPPFxivghUiHnwAyc8o14kFP3R4br1CnIKdL6wxJEX85T2BulCTzWuDj9YRwmh7FlhxpE2SPTrCWxYrbfIZhYr8o41UtCFExSVyrjjk6bQcsFj0K9OXmC2i9l9iY9%2FfaLGgaX3%2FN%2Ber1EYOVr%2FBBfxCKD%2BXHPHLb1OrZtoojxSUhWnwSxfWX6xQmOeHWWmVvs%2BTGLrfln%2FtlGyo4oZjs6dCJi3DyjXR%2FUEt8Wq1%2FrNRhsjPuMSjiAatNE%2F9bD01Gg6WYRoaeuJYKIVAh4MW%2FM7IdzbGi2tFYXlMx8rhlEX0NVFZGwNl8A3Znr5TtRme48V2yk%2FZBZmRSG29mGkpo9iAQbOTHxCr5wo%2F%2Bn0a6fxFcHROQA%2BVXaycz20VRRakFFMVTRvarwwha9iTZSW7vVQTGU2CYtC7lmNhBlZkZUM9NzWOlhsJwedijpXcGo8FiyZLBrZYWjCneHx%2FdDf2x5fMojrUuetByDfwkwMLOvi88GOqUBQIiYjX3o7ka%2B07bqXgN4uIOKTxu5YgOfV2kfafr7NEjEG8pnhMHVWJNFq4gRm2qJjbyOP%2B91wjWid%2FQcIWFoMuctKUTxsNnfL8YHBajXGg16XqXBHzh7InRvPFkqA%2BT0kKh9ihu4y6acOEDKQWKw952DMoHjQilwekAnZyDXaGCBOts5PbUXWZroE%2B26GFkdhKzytVNE9k0ZDqJGsxNVHIquxN5M&X-Amz-Signature=8a1a515e417b11887a5e1375eac5a44dca20a97a53107b6c0992395bd9a1713c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 단순 caption, qa가 아니라 다양한 난이도/형태의 task를 포괄함
- instruction 데이터 생성 방식
    - <u>**각 task마다 10~15개의 서로 다른 instruction 템플릿 제작**</u>
    - 같은 task라도 다양한 표현의 instruction으로 학습
    - 원래 답이 짧은 task의 경우에는 instruction에 ‘briefly’, ‘short’ 같은 표현 추가
        - 모델이 항상 짧게만 답하는 bias 방지
    - LLAVA Instruct 150k 데이터셋의 경우 이미 instruction 형태여서 추가 템플릿 적용 x

**2.2. Training and Evaluation Protocols**

- 26개 데이터셋
    - held-in 13개
        - 학습: held-in의 학습 set
        - 내부 평가: held-in의 val/test set
    - held-out 13개 → zero-shot 평가 목적
        - seen task
            - task는 학습했지만, 데이터셋은 처음 보는 경우 → **데이터 분포 변화에 대한 대응 능력** 평가
        - unseen task
            - task도 처음보고, 데이터셋도 처음 보는 경우 → **진짜 일반화 능력** 평가
            - ex. visual reasoning, visual conversation qa 등..
- visual dialogue의 경우 - 일부 이미지가 held-in 학습 데이터랑 겹침
    - 근데 대체 dataset이 없어서 포함
- 학습 방식
    - held-in 데이터셋을 모두 섞어서 학습
    - 각 데이터셋에 대해서 instruction template을 uniform하게 샘플링
- 학습 objective: 표준 language modeling loss
    - instruction + image → response 생성
- ocr 정보 활용
    - 텍스트가 포함된 이미지의 경우 ocr 결과를 instruction에 추가함

**2.3. Instruction-aware Visual Feature Extraction**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/26ad8e84-7e03-46da-b5cd-630e92a97fef/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QIBZ3F3V%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032908Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJGMEQCIGGnapQQLzRuvHV0IggLjvyv5x2lpWjDa%2FQmaSdXcXsvAiBjAcO64SJX4983tqQwd4vTD0fvmhbr9gShJ8Ikql4wdSqIBAji%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM3mfi7ApZdTHVLE5SKtwDznnHyHgLxfBqKPKOE3KSUDPrmU%2BkEZTTIiHnMmwcNMP4gh8EKVuu8E1dIik9aCsByYt4KqGKJHKKVCLyaf%2F0X1qAM4lcmA7XNya1SbCdlwP2mZ3T110W1KoX%2BPELlFy5ANfRnQBKeb58rud%2Fv4pZKYAN5LPZ%2BjzRsBX7nbAqa6rk%2BvxcvTTlFrP3avZ4hUbOgEfIokTx4szqrD5Qt3p7P0eSniiLzH%2F3MMcZ6A35En9QVFmBvAbh6j9iKJxy8v0YqeTMvbt%2FVZNRNtVeQyt%2FuK6uKPdaA4zzd3MRaVVaEnDRzGquJ4PKTC21%2BKj8U0R0zwZCwX6wDRGITo%2FtQflGj3lNs1PfYQXvDf5erqKcluL1ZCq4D6rj%2F6MYmC1F7Nh30MeOcS9UNP6PNtIe7fQLY9GIFMkAywfOfHSO0PLw5c6BjgexJjYQBMuxZeHnH%2FdFGRv5csQUXSuOeR6cTObS9Sw3v0r20eRgstJCQbjvvKQQhLnus4ZYIP0TlAmT84e6sWVpxUG15q4r6C9bFGvIYiXVC8aW7mi8B9KuJy3Wlh2In2j1uOhN6G26xaSIR4LtaG%2BWqtv1XxOhPK%2FqYhRVPgdjlMd%2BaF8f5eO6tmor%2BG5gNa7XUCoISomSdLEw5a6LzwY6pgHE4BLad8INmTDls8k8XgsCfH0mwUiMwYwrNhW0XpNji5YS%2FEtm0qkfzbgiFFvBb9z5iQ%2BqiMNT1qe3e0irzYucrh4QtjITMakEVY2HUWivfdxmj37QJ49H8tzw%2FGgUYL6krgd%2BfL76Qhc87CGUuAY8N9zviuBg27Xllcd%2B1G%2FzuWr1dDmtesYLW%2FMplIMPghJUKKEoWusbGxYMuv3VOq2BFICdQvK8&X-Amz-Signature=c7ee7ca5eb8b6fd546cfc6e0843f4025a5795a6c97b955fed347471632de2f5f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 기존 방식의 한계
    - blip2포함 기존 방식들은 instruction과 무관하게 visual feature를 추출함
    - 같은 이미지라도 instruction이 다르면 다른 정보가 필요한데, 기존 방식은 항상 같은 feature를 사용함
- 핵심 아이디어: _**“instruction을 반영해서 visual feature를 다르게 뽑자”**_
    - InstructBLIP은 BLIP-2 구조를 그대로 사용: image encoder, q-former, llm

    ```javascript
    feature = f(image, instruction)
    ```

    - 기존 Q-former
        - 입력: k개의 learnable query embeddings
        - 과정: query들이 image encoder output과 cross attn으로 상호작용
        - 출력: k개의 visual vector 생성 → linear projection → llm
    - InstructBLIP의 Q-former
        - 기존 q-former와 동일하게 2단계의 사전학습 과정을 거침
            1. visual-language representation learning
            2. text generation
        - **사전학습이 끝난 후, q-former를 instruction tuning함**
            - q-former의 입력: 기존에 learnable query만 받앗다면, instructblip의 q-former는 query와 instruction을 함께 받음
            - query는 image feature, instruction과 모두 함께 상호작용함
            - query ↔ instruction은 self attention으로 상호작용함
    - 결과적으로,
        - 기존: image만 보고 피처 추출
        - 현재: image, instruction을 모두 보고 피처 추출
        - _“무엇을 볼지”를 instruction이 결정 → 필요한 피처를 생성_

**2.4. Balancing Training Datasets**

- 여러 데이터셋을 함께 학습할때 …
    - 단순 uniform 샘플링
        - 작은 데이터셋 → overfit
        - 큰 데이터셋 →  학습 부족
    - 데이터셋 크기를 고려해야함!
- <u>**√(size) 기반 샘플링**</u>
    - 각 데이터셋의 샘플링 확률을 dataset 크기에 비례하도록

        ```javascript
        p_d ∝ √(S_d)
        ```

    - 왜 √를 쓰는가: 그냥 비례하도록 하면 큰 데이터셋만 자꾸 뽑힘
    - √는 uniform 샘플링과 완전 크기 비례 샘플링의 중간값 역할을 함
- 이 size 기반 샘플링을 토대로 하되, **dataset/task를 고려해서 weight를 수동적으로 조정함**
    - 각 task에 따라 난이도와 학습 속도가 다르기 때문
    - A-OKVQA (객관식) weight ↓, OKVQA (자유 생성) weight ↑
- 이 샘플링 기법 적용 시 held-in, out 성능 오름

**2.5. Inference Methods**

- 각 데이터셋 별로 다른 생성 방법을 사용함
1. **기본 생성 방식 - 일반적인 경우**
    - image + instruction → 모델이 자유롭게 답 생성
    - 캡셔닝, vqa 등
    - 생성된 답을 gt와 비교해서 평가함
2. **분류 / 객관식 문제**
    - **vocabulary ranking**
        - 모델에게 답을 생성하도록 하되, <u>가능한 답 후보를 제한함</u>
        - 후보: {A, B, C, D}

        ```javascript
        log P(candidate | image + instruction)
        ```

        - <u>**가장 높은 확률을 가진 후보를 선택하게 함**</u>
    - ScienceQA, IconQA, A-OKVQA (객관식), HatefulMemes, Visual Dialog, MSVD, MSRVTT (video QA)
    - **Binary classification 처리**
        - yes/no 확률 뿐 아니라 pos/neg, true/false 확률 계산에 활용함
        - 각 클래스를 좀 더 여러 표현으로 만들어서 안정적으로 확률을 계산함
    - video qa: 영상전체를 쓰지 않고 영상에서 4개의 프레임을 샘플링 → feature concat해서 llm에 입력

**2.6. Implementation Details**

- 구조
    - Image Encoder: ViT-g/14
    - LLM : FlanT5-XL (3B),  FlanT5-XXL (11B), Vicuna-7B, Vicuna-13B
    - BLIP-2 pretrained checkpoint 사용
    - finetuning 시에도 마찬가지로 q-former만 학습
    - query embedding 개수 32개
- 학습 & 하이퍼파라미터
    - 60k step
    - batch size: 3b모델 - 192, 7b모델 - 128
    - a100 40gb * 16개 = 1.5일 학습 시간

### Experimental Results and Analysis


3.1. Zero-shot Evaluation


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c21abd49-6187-4db6-8ccc-78d871a99c43/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QIBZ3F3V%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032908Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJGMEQCIGGnapQQLzRuvHV0IggLjvyv5x2lpWjDa%2FQmaSdXcXsvAiBjAcO64SJX4983tqQwd4vTD0fvmhbr9gShJ8Ikql4wdSqIBAji%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM3mfi7ApZdTHVLE5SKtwDznnHyHgLxfBqKPKOE3KSUDPrmU%2BkEZTTIiHnMmwcNMP4gh8EKVuu8E1dIik9aCsByYt4KqGKJHKKVCLyaf%2F0X1qAM4lcmA7XNya1SbCdlwP2mZ3T110W1KoX%2BPELlFy5ANfRnQBKeb58rud%2Fv4pZKYAN5LPZ%2BjzRsBX7nbAqa6rk%2BvxcvTTlFrP3avZ4hUbOgEfIokTx4szqrD5Qt3p7P0eSniiLzH%2F3MMcZ6A35En9QVFmBvAbh6j9iKJxy8v0YqeTMvbt%2FVZNRNtVeQyt%2FuK6uKPdaA4zzd3MRaVVaEnDRzGquJ4PKTC21%2BKj8U0R0zwZCwX6wDRGITo%2FtQflGj3lNs1PfYQXvDf5erqKcluL1ZCq4D6rj%2F6MYmC1F7Nh30MeOcS9UNP6PNtIe7fQLY9GIFMkAywfOfHSO0PLw5c6BjgexJjYQBMuxZeHnH%2FdFGRv5csQUXSuOeR6cTObS9Sw3v0r20eRgstJCQbjvvKQQhLnus4ZYIP0TlAmT84e6sWVpxUG15q4r6C9bFGvIYiXVC8aW7mi8B9KuJy3Wlh2In2j1uOhN6G26xaSIR4LtaG%2BWqtv1XxOhPK%2FqYhRVPgdjlMd%2BaF8f5eO6tmor%2BG5gNa7XUCoISomSdLEw5a6LzwY6pgHE4BLad8INmTDls8k8XgsCfH0mwUiMwYwrNhW0XpNji5YS%2FEtm0qkfzbgiFFvBb9z5iQ%2BqiMNT1qe3e0irzYucrh4QtjITMakEVY2HUWivfdxmj37QJ49H8tzw%2FGgUYL6krgd%2BfL76Qhc87CGUuAY8N9zviuBg27Xllcd%2B1G%2FzuWr1dDmtesYLW%2FMplIMPghJUKKEoWusbGxYMuv3VOq2BFICdQvK8&X-Amz-Signature=920262c1ad2eb542403e68833f44c983b7feca3dbf0001381909a1adcb675215&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 13개 held-out 데이터셋에 대해서 평가함 → 보지 않은 데이터에서의 일반화 성능 확인
- 베이스라인: flamingo, blip2
- **모든 데이터셋에서 sota 달성**
- **blip2 대비 큰 성능 향상 - 특히 동일한 backbone 기준 성능 향상**
    - 평균적으로 15% 성능 향상
- **unseen task에서도 일반화 성능 높음 → videoqa task**
    - msrvtt-qa
    - 비디오 데이터로 학습 안했는데도 성능 향상
- **모델 크기 대비 효율성**
    - instructblip 4b (flanT5 XL) >> flamingo 80b
    - 단순히 큰 모델이 중요한게 아님
- visual dialogue 데이터셋에 대해서는 mean reciprocal rank 점수를 사용함
    - normalized discounted cumulative gain 점수는 애매하고 일반적인 답도 높은점수를 줌

3.2. Ablation Study on Instruction Tuning Techniques


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c6440dea-37f4-4390-a9b4-23f91e7ebc2e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QIBZ3F3V%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032908Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJGMEQCIGGnapQQLzRuvHV0IggLjvyv5x2lpWjDa%2FQmaSdXcXsvAiBjAcO64SJX4983tqQwd4vTD0fvmhbr9gShJ8Ikql4wdSqIBAji%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM3mfi7ApZdTHVLE5SKtwDznnHyHgLxfBqKPKOE3KSUDPrmU%2BkEZTTIiHnMmwcNMP4gh8EKVuu8E1dIik9aCsByYt4KqGKJHKKVCLyaf%2F0X1qAM4lcmA7XNya1SbCdlwP2mZ3T110W1KoX%2BPELlFy5ANfRnQBKeb58rud%2Fv4pZKYAN5LPZ%2BjzRsBX7nbAqa6rk%2BvxcvTTlFrP3avZ4hUbOgEfIokTx4szqrD5Qt3p7P0eSniiLzH%2F3MMcZ6A35En9QVFmBvAbh6j9iKJxy8v0YqeTMvbt%2FVZNRNtVeQyt%2FuK6uKPdaA4zzd3MRaVVaEnDRzGquJ4PKTC21%2BKj8U0R0zwZCwX6wDRGITo%2FtQflGj3lNs1PfYQXvDf5erqKcluL1ZCq4D6rj%2F6MYmC1F7Nh30MeOcS9UNP6PNtIe7fQLY9GIFMkAywfOfHSO0PLw5c6BjgexJjYQBMuxZeHnH%2FdFGRv5csQUXSuOeR6cTObS9Sw3v0r20eRgstJCQbjvvKQQhLnus4ZYIP0TlAmT84e6sWVpxUG15q4r6C9bFGvIYiXVC8aW7mi8B9KuJy3Wlh2In2j1uOhN6G26xaSIR4LtaG%2BWqtv1XxOhPK%2FqYhRVPgdjlMd%2BaF8f5eO6tmor%2BG5gNa7XUCoISomSdLEw5a6LzwY6pgHE4BLad8INmTDls8k8XgsCfH0mwUiMwYwrNhW0XpNji5YS%2FEtm0qkfzbgiFFvBb9z5iQ%2BqiMNT1qe3e0irzYucrh4QtjITMakEVY2HUWivfdxmj37QJ49H8tzw%2FGgUYL6krgd%2BfL76Qhc87CGUuAY8N9zviuBg27Xllcd%2B1G%2FzuWr1dDmtesYLW%2FMplIMPghJUKKEoWusbGxYMuv3VOq2BFICdQvK8&X-Amz-Signature=ec6afd8d015cbd1f72ffa5a5b7879bfde0a929e4759693e27cdae47663a0ec43&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- <u>**instruction-aware visual feature**</u>의 효과 검증
    - 모든 데이터셋에서 성능이 크게 하락함
    - 특히 ScienceQA같은 공간적 추론, iVQA와 같이 시간적 추론이 중요한 task에서 성능 하락
    - instruction이 있어야 중요한 영역/정보에 attention 가능
- <u>**balanced dataset sampling**</u>의 효과 검증
    - 학습이 불안정, 서로 다른 시점에 성능 peak 발생 → 전체 성능이 저하됨
- 요약하자면,
    - instruction-aware feature는 성능 향상에 중요함
    - balanced dataset sampling은 안정적인 학습을 위해 중요함

3.3. Qualitative Evalution


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b88ebf5-2f56-43ba-9dcb-e5f6b9a28ff1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QIBZ3F3V%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032908Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJGMEQCIGGnapQQLzRuvHV0IggLjvyv5x2lpWjDa%2FQmaSdXcXsvAiBjAcO64SJX4983tqQwd4vTD0fvmhbr9gShJ8Ikql4wdSqIBAji%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM3mfi7ApZdTHVLE5SKtwDznnHyHgLxfBqKPKOE3KSUDPrmU%2BkEZTTIiHnMmwcNMP4gh8EKVuu8E1dIik9aCsByYt4KqGKJHKKVCLyaf%2F0X1qAM4lcmA7XNya1SbCdlwP2mZ3T110W1KoX%2BPELlFy5ANfRnQBKeb58rud%2Fv4pZKYAN5LPZ%2BjzRsBX7nbAqa6rk%2BvxcvTTlFrP3avZ4hUbOgEfIokTx4szqrD5Qt3p7P0eSniiLzH%2F3MMcZ6A35En9QVFmBvAbh6j9iKJxy8v0YqeTMvbt%2FVZNRNtVeQyt%2FuK6uKPdaA4zzd3MRaVVaEnDRzGquJ4PKTC21%2BKj8U0R0zwZCwX6wDRGITo%2FtQflGj3lNs1PfYQXvDf5erqKcluL1ZCq4D6rj%2F6MYmC1F7Nh30MeOcS9UNP6PNtIe7fQLY9GIFMkAywfOfHSO0PLw5c6BjgexJjYQBMuxZeHnH%2FdFGRv5csQUXSuOeR6cTObS9Sw3v0r20eRgstJCQbjvvKQQhLnus4ZYIP0TlAmT84e6sWVpxUG15q4r6C9bFGvIYiXVC8aW7mi8B9KuJy3Wlh2In2j1uOhN6G26xaSIR4LtaG%2BWqtv1XxOhPK%2FqYhRVPgdjlMd%2BaF8f5eO6tmor%2BG5gNa7XUCoISomSdLEw5a6LzwY6pgHE4BLad8INmTDls8k8XgsCfH0mwUiMwYwrNhW0XpNji5YS%2FEtm0qkfzbgiFFvBb9z5iQ%2BqiMNT1qe3e0irzYucrh4QtjITMakEVY2HUWivfdxmj37QJ49H8tzw%2FGgUYL6krgd%2BfL76Qhc87CGUuAY8N9zviuBg27Xllcd%2B1G%2FzuWr1dDmtesYLW%2FMplIMPghJUKKEoWusbGxYMuv3VOq2BFICdQvK8&X-Amz-Signature=543e5e4f3e1a7135d17a591c22b240349a53618016e8a897ca370e9d145d058a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 복잡한 시각적 추론 가능
    - 상황을 추론, 사건을 유추
- 시각 정보 + 지식 결합
    - 유명 작품을 설명
- 분위기 및 은유 이해
- 멀티턴 대화 가능
- 다른 모델들과 비교: gpt4, llava, minigpt-4

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d859b7b1-1acd-4851-8fa7-6a3ba5cfc217/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QIBZ3F3V%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032908Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJGMEQCIGGnapQQLzRuvHV0IggLjvyv5x2lpWjDa%2FQmaSdXcXsvAiBjAcO64SJX4983tqQwd4vTD0fvmhbr9gShJ8Ikql4wdSqIBAji%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM3mfi7ApZdTHVLE5SKtwDznnHyHgLxfBqKPKOE3KSUDPrmU%2BkEZTTIiHnMmwcNMP4gh8EKVuu8E1dIik9aCsByYt4KqGKJHKKVCLyaf%2F0X1qAM4lcmA7XNya1SbCdlwP2mZ3T110W1KoX%2BPELlFy5ANfRnQBKeb58rud%2Fv4pZKYAN5LPZ%2BjzRsBX7nbAqa6rk%2BvxcvTTlFrP3avZ4hUbOgEfIokTx4szqrD5Qt3p7P0eSniiLzH%2F3MMcZ6A35En9QVFmBvAbh6j9iKJxy8v0YqeTMvbt%2FVZNRNtVeQyt%2FuK6uKPdaA4zzd3MRaVVaEnDRzGquJ4PKTC21%2BKj8U0R0zwZCwX6wDRGITo%2FtQflGj3lNs1PfYQXvDf5erqKcluL1ZCq4D6rj%2F6MYmC1F7Nh30MeOcS9UNP6PNtIe7fQLY9GIFMkAywfOfHSO0PLw5c6BjgexJjYQBMuxZeHnH%2FdFGRv5csQUXSuOeR6cTObS9Sw3v0r20eRgstJCQbjvvKQQhLnus4ZYIP0TlAmT84e6sWVpxUG15q4r6C9bFGvIYiXVC8aW7mi8B9KuJy3Wlh2In2j1uOhN6G26xaSIR4LtaG%2BWqtv1XxOhPK%2FqYhRVPgdjlMd%2BaF8f5eO6tmor%2BG5gNa7XUCoISomSdLEw5a6LzwY6pgHE4BLad8INmTDls8k8XgsCfH0mwUiMwYwrNhW0XpNji5YS%2FEtm0qkfzbgiFFvBb9z5iQ%2BqiMNT1qe3e0irzYucrh4QtjITMakEVY2HUWivfdxmj37QJ49H8tzw%2FGgUYL6krgd%2BfL76Qhc87CGUuAY8N9zviuBg27Xllcd%2B1G%2FzuWr1dDmtesYLW%2FMplIMPghJUKKEoWusbGxYMuv3VOq2BFICdQvK8&X-Amz-Signature=5fafdb712a91f4a25f847ba148c403477631cdb3cb323f81610e79c02f9c02a8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 모두 긴 답변 생성 가능하지만
- instructblip은 더 정확한 visual detail을 포함하고 더 논리적으로 일관된 reasoning
    - llava - 길지만 불필요한 내용을 포함

<u>“단순히 길게 말하는 게 아니라, 더 정확하고 맥락에 맞는 답을 생성한다.”</u>


3.4. Instruction Tuning vs. Multitask Learning


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/69bd73cc-6671-491a-af5b-ab9909b71df7/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QIBZ3F3V%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032908Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJGMEQCIGGnapQQLzRuvHV0IggLjvyv5x2lpWjDa%2FQmaSdXcXsvAiBjAcO64SJX4983tqQwd4vTD0fvmhbr9gShJ8Ikql4wdSqIBAji%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM3mfi7ApZdTHVLE5SKtwDznnHyHgLxfBqKPKOE3KSUDPrmU%2BkEZTTIiHnMmwcNMP4gh8EKVuu8E1dIik9aCsByYt4KqGKJHKKVCLyaf%2F0X1qAM4lcmA7XNya1SbCdlwP2mZ3T110W1KoX%2BPELlFy5ANfRnQBKeb58rud%2Fv4pZKYAN5LPZ%2BjzRsBX7nbAqa6rk%2BvxcvTTlFrP3avZ4hUbOgEfIokTx4szqrD5Qt3p7P0eSniiLzH%2F3MMcZ6A35En9QVFmBvAbh6j9iKJxy8v0YqeTMvbt%2FVZNRNtVeQyt%2FuK6uKPdaA4zzd3MRaVVaEnDRzGquJ4PKTC21%2BKj8U0R0zwZCwX6wDRGITo%2FtQflGj3lNs1PfYQXvDf5erqKcluL1ZCq4D6rj%2F6MYmC1F7Nh30MeOcS9UNP6PNtIe7fQLY9GIFMkAywfOfHSO0PLw5c6BjgexJjYQBMuxZeHnH%2FdFGRv5csQUXSuOeR6cTObS9Sw3v0r20eRgstJCQbjvvKQQhLnus4ZYIP0TlAmT84e6sWVpxUG15q4r6C9bFGvIYiXVC8aW7mi8B9KuJy3Wlh2In2j1uOhN6G26xaSIR4LtaG%2BWqtv1XxOhPK%2FqYhRVPgdjlMd%2BaF8f5eO6tmor%2BG5gNa7XUCoISomSdLEw5a6LzwY6pgHE4BLad8INmTDls8k8XgsCfH0mwUiMwYwrNhW0XpNji5YS%2FEtm0qkfzbgiFFvBb9z5iQ%2BqiMNT1qe3e0irzYucrh4QtjITMakEVY2HUWivfdxmj37QJ49H8tzw%2FGgUYL6krgd%2BfL76Qhc87CGUuAY8N9zviuBg27Xllcd%2B1G%2FzuWr1dDmtesYLW%2FMplIMPghJUKKEoWusbGxYMuv3VOq2BFICdQvK8&X-Amz-Signature=32a6b4d124d97783091c42e18e4d68b1c85f3b71817e11127dfaf3b784071956&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- instructblip의 성능 향상 원인이 무엇인가?
    - instruction format 덕분인지, multi-task 학습 효과인지
- 2가지 multi-task 방식을 비교해봄
    - vanilla multitask
        - instruction X
        - 원래 input-output 그대로 학습
        - 평가할때는 instruction 입력
    - task identifier
        - 입력 앞에 task 정보 추가
            - ex. [Visual question answering:VQAv2] + input
        - 평가할때는 instruction or identifier 사용
        - heldout dataset - dataset 이름은 안쓰고 task 이름만 사용
- held-in 결과
    - instruction tuning과 multitask learning과 성능 거의 비슷함
- held-out 결과
    - instruction tuning >> multitask learning
    - multitask는 zeroshot blip2와 비슷한 수준임
    - → multitask는 일반화에 도움 거의 안됨

3.5. Finetuning InstructBLIP on Downstream Tasks

- InstructBLIP을 **특정 데이터셋에 맞게 추가 finetuning**했을 때 성능 확인

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff562478-0a4b-4af6-bc59-16adc0611b97/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RMYOL6TR%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T032939Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJGMEQCIBH%2Ba8fDP2QBd42%2B34u1LUzOHUi8rcLJHCSoHLFSsnWfAiBMAuA7UQqBEdNV9cXsMfNdlKLaCQpO3Ga7QwWYAEQvtiqIBAji%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM7x3rkdWj3Nuys2DBKtwDfZYi72e8Jn%2FX6zmfNU9UYXM8KNBkbM%2FyQpbZIKWZ9X%2BIqSyhgCJ2XDyLye1Pd4%2BSYV3fEriwchDgWFqb6XfUsOZgd0vwA9Aku%2FVgEERgLw%2FMBykORtp%2FJZajUF7t3rgS8OMRXNPBrOuZMNlur%2BgbU58m7zEuREVhvs2cgLb9WGtGGeyUZ6yWVI0J4nQaUrH7YdY12Xg%2B3PSsyEqoTOQFdtDOZZza48evVJckr8ZTRfX9O3LiARO32X%2BpuepLBVXM3JywvSGilyrMkS7vhKVuG663MqKaOEozOLjqAbJuTxXdILP%2B2B4UGsLNKH7iz4gZGcEiVI5caYBy9HIZcLXAJbOv95p5KVNqHcOc5aAYGpmzkzYYWR9lyuV%2B9FiUvkU3Py3C3o0sDZnYPmPsGJ3XkuDX0jTnMglGE2bL42tNqJQqnkpu%2BUKeKlwBmvYWgpDymsPtyBA3dCGlQ0Bd0FKOXrOoahqyX9gBRB5Rqphg9fomb97QTD7S9sN3O9yIVHvomnu5F3mJtWga3r3jNxABjovSWx2H%2FyKsZst4Vg7uYj02TqnEu8MCQ6M%2FNo0raBvB8BvHS3mn%2F0g8hsVCn3C46vP8G6UcH2D9uGi0fzHGh10K4bb61QRz%2F85ZCqswqKyLzwY6pgHhC743%2BatvgbXTx%2BboHaxAL25B4OexmFCUpSni1TfUeyKKEfu3S6KxMMuol9%2FcxiIuGnXtU5StFmEoSq0czs%2FWGy2vvEmiF2nIGIoSRYF%2FArIBn%2B%2Bs5jbYikCpa3wvdpszKvVl78jr8gZZXG1nZyK7PShVQWf2s9oAtvs%2B0OZPjIYYg1RO075VKCy%2F86%2ByADnU5eBM%2FSmcld9tGDx8bCfCnajCj239&X-Amz-Signature=5e4dbf20b00be6aa467e0cb6d501cdcdc1f0500a76ab864c3cc3eb43316b5bc6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 기존 방법은 고해상도 이미지를 사용, visual encoder도 함께 finetuning해서 학습 파라미터 많고, 학습 비용이 큼
- instructblip은 해상도를 224로 유지, visual encoder는 학습 x
    - 학습 효율이 크게 향상됨 (**더 적은 파라미터로 더 높은 finetuning 성능**)
- 모든 데이터셋에서 blip2보다 성능 우수
    - 일부 데이터셋에서는 SOTA 달성
    - OKVQA에서는 PaLM-E (562B) > InstructBLIP
        - 모델 크기 차이가 매우 큼
- LLM 차이
    - T5 : 객관식, 분류 문제에 강함
    - Vicuna: open-ended 생성에 강함

### Related Work

- instruction tuning in NLP
    - 템플릿 기반, llm 기반 instruction dataset 생성
- instruction tuned LLM → VLM 확장
    - llm에 visual 정보를 주입해서 VL task를 수행하게끔
    - blip2, minigpt-4, llava, mPLUG-Owl, MultiInstruct
- instructblip은,
    - **다양한 instruction 데이터를 사용**
    - **instruction aware visual feature 추출 구조**

### Conclusion

- 본 연구는 간단하지만 새로운 vision-language instruction tuning 프레임워크를 제안함
- InstructBLIP은 다양한 unseen task에서 SOTA 달성, 다양한 일반화 능력을 확인, downstream task finetuning에서도 SOTA를 달성
- <u>_“vision-language에서도 instruction tuning이 일반화의 핵심이다”_</u>
