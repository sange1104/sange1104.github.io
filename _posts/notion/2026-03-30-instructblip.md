---
title: "InstructBLIP: Towards General-purpose Vision-Language Models with Instruction Tuning"
date: 2026-03-30
categories: [paper-review, vision-language]
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

    ![노랑 - held-in, 흰색 - held-out](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b8cfba8b-856c-46d2-b746-d439114dce86/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XOSDFB6W%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040443Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCYZviJVFA%2Bgrdl9uPfWDj%2FZTPP5Y4jdULplAgxtIXvQwIhAJ7EH3xO7jbvpdhH4DS5bVtPvNmPn4RGU31y8Hjf7j1sKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwY4a%2FJoIIEAN2LtpUq3ANtgkGRSY6UQzfcZE62SKqACoHs5EThgHP%2BYgfLiYS%2BYtjK9MLPFuzcugpA41O21tz0K%2BVq8tT%2FWU%2BrJ%2BLY%2BVHPuhi1T6kC0OMvRt0x1rBPGehNo%2F96O%2FN8qPunsIG2hxweyQplbeVUgN%2BhP49GFHvx%2FZeFEG8v5XENBKqfJxzBlxWKhGMqtjTZNcC75H%2FfLPhDCp%2FjuhrGKXsLvva3xt6VoVcSEQEUVcVmmURjiRqaZ8igCfn8qe5RQdl8%2FY6HGltyDwySOTHvnDrQiTjfCy5EOk6205u7UUTsh20W3IquXHkrsPpb4DB%2FbSwIhnmXTDynXNN2uOdxLQ1weJY1j9xr%2BeB9QuB9ObgIUtEnmx9Zs5RtEl93B6ERGFpx8kx6cYp%2BNiUwsj3M2o7blminiIZA4Cd6KbQSZySA9J4OQ8ldT99Ht9BqL8j%2BYlDzhkin0wY9%2F0ejuRXqv%2FWMcEgN8hz8t85N36qSz80N%2BjquDyD3MIYABkQMiDcFTiGwsFCQK16lG4%2B3amLZVcT01%2FXvcr7xG3yyfPk7BBej05fGZjJxEV8sSCyiskNA0bZfIRVCR6shxZHXkYwlMdiTC6Prclm%2BYiHdetLdRT6RXrB7zd%2Fv6KfbKP5lwc4GKGlI3TCkivDPBjqkAUCaW2qbUGL5%2FGHgd%2B2r58nw%2F0k8SRCIda4eHcrOFlVXDtn3f5a2cMGx0sWFWCjt17DysLYhLbDw0tpDybaBpMU33o7r%2BCQWp3PMYdWNla2KRctMLrQg2Nf0P9FL4OsM6beSZ4JR31K0FTWr%2BPrHKMvkHF9Ugg%2F982od93Zdz5PuInPko9Yxw8R8si01JD5avjuYKBZ8LztW05Xj89gQox2sw8FC&X-Amz-Signature=8e6f161389b1716b4de50e7ee336ceab5c94483d70cbb5af281c76767bbbd810&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/26ad8e84-7e03-46da-b5cd-630e92a97fef/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TG2SMZC2%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040433Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDdit3Sios%2Bx%2B7fGIZ2jzN%2B5tZgxP1od0ViyAmDOX6fjAiEAphiNdcKgtu1UZ3lIhMrZXx2%2FS7DnAdrEud7NBkRvWqAqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBbZorGFjTOlmGB4PyrcAye%2Bl7ZPHUDoirv2nDFfYK%2BnPnaR79LRu4jSVqFHGDHWVkvCekiAlH8lg4rlH5GxQb6cRkjj6h6nNrfNlZ62uP4J0jdGHKk5NGV7iGBwtK%2BavWzIPzo01Wo712wNbDj4%2BaJjKdHf7Z4S1jVcvfAcN0Ul0SPcgiztRdd8v%2FqBBHY4RzKxis45ouxVC%2BJCTbMAP%2BOyPzfbpo1cl8T09w7SNqs3nC7OCTgjrUXDMv0blHTe0kt0%2BqiuA0VQ%2F8YnSljXdpO2%2BwAcJk8Fx0lgy2NS9DVkkRWuKSQgJfPpxSRQxoJycAZs%2BkO4CSamrAEg%2B9z%2BNoTmnjbxb82uHDNklmHgIaxE%2F%2FG292qBtcfCgRuovr7o846DbE6rOHJL%2BJxT5nAik9gzDwmoTgUJK59e3%2BPpzQPKtsafo44yLzu99vhMy6vAdchVgz00KTPUJMsn5PHcEZcXEX%2Fv5b8rR9nlkitM1utNgDT16HA%2BaTFwtHhfGHviNt8jSjCcHODnCGzYFZJH3GjKZab6%2BstoaVFi1n3cjNqX5LC288CjfTUYvbDqjgHLGaGfT03ZKaSQNliwRN1WuXSItLwj4dWfm8kIdf4Dx1jsoDgIXH%2B8g9%2BK%2FU77NYLku1Zp3IMffe4VDclaMPiI8M8GOqUB3UdDvwUOp1z8L4lJm4U0DzOXbZL2L%2BZRh%2BAeuwRBFasvlj7i3A6awUDb4w0x%2BaOpiBbjHHt8oFplmoMp5AvkkifocE8fy%2BripNC3wjOiiWc354yh9DiWrCzFYiye6l8vLgDfRyeRbdpWcvrFH2zs3R%2FbDyH%2FbclhjqOE0luvP5znm2eQOa6NDx9oehBIejCb5XTU0ACWTkUv1jKa%2FfeNyA4DGfio&X-Amz-Signature=4b7d3915cdcd1f422f5d757aa8a3ef68e73ce9787c59a29193639b279b071aed&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c21abd49-6187-4db6-8ccc-78d871a99c43/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TG2SMZC2%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040433Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDdit3Sios%2Bx%2B7fGIZ2jzN%2B5tZgxP1od0ViyAmDOX6fjAiEAphiNdcKgtu1UZ3lIhMrZXx2%2FS7DnAdrEud7NBkRvWqAqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBbZorGFjTOlmGB4PyrcAye%2Bl7ZPHUDoirv2nDFfYK%2BnPnaR79LRu4jSVqFHGDHWVkvCekiAlH8lg4rlH5GxQb6cRkjj6h6nNrfNlZ62uP4J0jdGHKk5NGV7iGBwtK%2BavWzIPzo01Wo712wNbDj4%2BaJjKdHf7Z4S1jVcvfAcN0Ul0SPcgiztRdd8v%2FqBBHY4RzKxis45ouxVC%2BJCTbMAP%2BOyPzfbpo1cl8T09w7SNqs3nC7OCTgjrUXDMv0blHTe0kt0%2BqiuA0VQ%2F8YnSljXdpO2%2BwAcJk8Fx0lgy2NS9DVkkRWuKSQgJfPpxSRQxoJycAZs%2BkO4CSamrAEg%2B9z%2BNoTmnjbxb82uHDNklmHgIaxE%2F%2FG292qBtcfCgRuovr7o846DbE6rOHJL%2BJxT5nAik9gzDwmoTgUJK59e3%2BPpzQPKtsafo44yLzu99vhMy6vAdchVgz00KTPUJMsn5PHcEZcXEX%2Fv5b8rR9nlkitM1utNgDT16HA%2BaTFwtHhfGHviNt8jSjCcHODnCGzYFZJH3GjKZab6%2BstoaVFi1n3cjNqX5LC288CjfTUYvbDqjgHLGaGfT03ZKaSQNliwRN1WuXSItLwj4dWfm8kIdf4Dx1jsoDgIXH%2B8g9%2BK%2FU77NYLku1Zp3IMffe4VDclaMPiI8M8GOqUB3UdDvwUOp1z8L4lJm4U0DzOXbZL2L%2BZRh%2BAeuwRBFasvlj7i3A6awUDb4w0x%2BaOpiBbjHHt8oFplmoMp5AvkkifocE8fy%2BripNC3wjOiiWc354yh9DiWrCzFYiye6l8vLgDfRyeRbdpWcvrFH2zs3R%2FbDyH%2FbclhjqOE0luvP5znm2eQOa6NDx9oehBIejCb5XTU0ACWTkUv1jKa%2FfeNyA4DGfio&X-Amz-Signature=3967a6e413fa1bb1c1c567ad2ad03b13455d749ec17148e451df5fda3a3c8d31&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c6440dea-37f4-4390-a9b4-23f91e7ebc2e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TG2SMZC2%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040433Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDdit3Sios%2Bx%2B7fGIZ2jzN%2B5tZgxP1od0ViyAmDOX6fjAiEAphiNdcKgtu1UZ3lIhMrZXx2%2FS7DnAdrEud7NBkRvWqAqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBbZorGFjTOlmGB4PyrcAye%2Bl7ZPHUDoirv2nDFfYK%2BnPnaR79LRu4jSVqFHGDHWVkvCekiAlH8lg4rlH5GxQb6cRkjj6h6nNrfNlZ62uP4J0jdGHKk5NGV7iGBwtK%2BavWzIPzo01Wo712wNbDj4%2BaJjKdHf7Z4S1jVcvfAcN0Ul0SPcgiztRdd8v%2FqBBHY4RzKxis45ouxVC%2BJCTbMAP%2BOyPzfbpo1cl8T09w7SNqs3nC7OCTgjrUXDMv0blHTe0kt0%2BqiuA0VQ%2F8YnSljXdpO2%2BwAcJk8Fx0lgy2NS9DVkkRWuKSQgJfPpxSRQxoJycAZs%2BkO4CSamrAEg%2B9z%2BNoTmnjbxb82uHDNklmHgIaxE%2F%2FG292qBtcfCgRuovr7o846DbE6rOHJL%2BJxT5nAik9gzDwmoTgUJK59e3%2BPpzQPKtsafo44yLzu99vhMy6vAdchVgz00KTPUJMsn5PHcEZcXEX%2Fv5b8rR9nlkitM1utNgDT16HA%2BaTFwtHhfGHviNt8jSjCcHODnCGzYFZJH3GjKZab6%2BstoaVFi1n3cjNqX5LC288CjfTUYvbDqjgHLGaGfT03ZKaSQNliwRN1WuXSItLwj4dWfm8kIdf4Dx1jsoDgIXH%2B8g9%2BK%2FU77NYLku1Zp3IMffe4VDclaMPiI8M8GOqUB3UdDvwUOp1z8L4lJm4U0DzOXbZL2L%2BZRh%2BAeuwRBFasvlj7i3A6awUDb4w0x%2BaOpiBbjHHt8oFplmoMp5AvkkifocE8fy%2BripNC3wjOiiWc354yh9DiWrCzFYiye6l8vLgDfRyeRbdpWcvrFH2zs3R%2FbDyH%2FbclhjqOE0luvP5znm2eQOa6NDx9oehBIejCb5XTU0ACWTkUv1jKa%2FfeNyA4DGfio&X-Amz-Signature=520882a6b7906e26026ad5b070a6e16a107ef1c1ac694c299a7f39a969bb2034&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b88ebf5-2f56-43ba-9dcb-e5f6b9a28ff1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TG2SMZC2%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040433Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDdit3Sios%2Bx%2B7fGIZ2jzN%2B5tZgxP1od0ViyAmDOX6fjAiEAphiNdcKgtu1UZ3lIhMrZXx2%2FS7DnAdrEud7NBkRvWqAqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBbZorGFjTOlmGB4PyrcAye%2Bl7ZPHUDoirv2nDFfYK%2BnPnaR79LRu4jSVqFHGDHWVkvCekiAlH8lg4rlH5GxQb6cRkjj6h6nNrfNlZ62uP4J0jdGHKk5NGV7iGBwtK%2BavWzIPzo01Wo712wNbDj4%2BaJjKdHf7Z4S1jVcvfAcN0Ul0SPcgiztRdd8v%2FqBBHY4RzKxis45ouxVC%2BJCTbMAP%2BOyPzfbpo1cl8T09w7SNqs3nC7OCTgjrUXDMv0blHTe0kt0%2BqiuA0VQ%2F8YnSljXdpO2%2BwAcJk8Fx0lgy2NS9DVkkRWuKSQgJfPpxSRQxoJycAZs%2BkO4CSamrAEg%2B9z%2BNoTmnjbxb82uHDNklmHgIaxE%2F%2FG292qBtcfCgRuovr7o846DbE6rOHJL%2BJxT5nAik9gzDwmoTgUJK59e3%2BPpzQPKtsafo44yLzu99vhMy6vAdchVgz00KTPUJMsn5PHcEZcXEX%2Fv5b8rR9nlkitM1utNgDT16HA%2BaTFwtHhfGHviNt8jSjCcHODnCGzYFZJH3GjKZab6%2BstoaVFi1n3cjNqX5LC288CjfTUYvbDqjgHLGaGfT03ZKaSQNliwRN1WuXSItLwj4dWfm8kIdf4Dx1jsoDgIXH%2B8g9%2BK%2FU77NYLku1Zp3IMffe4VDclaMPiI8M8GOqUB3UdDvwUOp1z8L4lJm4U0DzOXbZL2L%2BZRh%2BAeuwRBFasvlj7i3A6awUDb4w0x%2BaOpiBbjHHt8oFplmoMp5AvkkifocE8fy%2BripNC3wjOiiWc354yh9DiWrCzFYiye6l8vLgDfRyeRbdpWcvrFH2zs3R%2FbDyH%2FbclhjqOE0luvP5znm2eQOa6NDx9oehBIejCb5XTU0ACWTkUv1jKa%2FfeNyA4DGfio&X-Amz-Signature=a8f60c24236efa0be4b1383be4a5fe57390f1aed586524932911a8a94498b415&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 복잡한 시각적 추론 가능
    - 상황을 추론, 사건을 유추
- 시각 정보 + 지식 결합
    - 유명 작품을 설명
- 분위기 및 은유 이해
- 멀티턴 대화 가능
- 다른 모델들과 비교: gpt4, llava, minigpt-4

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d859b7b1-1acd-4851-8fa7-6a3ba5cfc217/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TG2SMZC2%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040433Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDdit3Sios%2Bx%2B7fGIZ2jzN%2B5tZgxP1od0ViyAmDOX6fjAiEAphiNdcKgtu1UZ3lIhMrZXx2%2FS7DnAdrEud7NBkRvWqAqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBbZorGFjTOlmGB4PyrcAye%2Bl7ZPHUDoirv2nDFfYK%2BnPnaR79LRu4jSVqFHGDHWVkvCekiAlH8lg4rlH5GxQb6cRkjj6h6nNrfNlZ62uP4J0jdGHKk5NGV7iGBwtK%2BavWzIPzo01Wo712wNbDj4%2BaJjKdHf7Z4S1jVcvfAcN0Ul0SPcgiztRdd8v%2FqBBHY4RzKxis45ouxVC%2BJCTbMAP%2BOyPzfbpo1cl8T09w7SNqs3nC7OCTgjrUXDMv0blHTe0kt0%2BqiuA0VQ%2F8YnSljXdpO2%2BwAcJk8Fx0lgy2NS9DVkkRWuKSQgJfPpxSRQxoJycAZs%2BkO4CSamrAEg%2B9z%2BNoTmnjbxb82uHDNklmHgIaxE%2F%2FG292qBtcfCgRuovr7o846DbE6rOHJL%2BJxT5nAik9gzDwmoTgUJK59e3%2BPpzQPKtsafo44yLzu99vhMy6vAdchVgz00KTPUJMsn5PHcEZcXEX%2Fv5b8rR9nlkitM1utNgDT16HA%2BaTFwtHhfGHviNt8jSjCcHODnCGzYFZJH3GjKZab6%2BstoaVFi1n3cjNqX5LC288CjfTUYvbDqjgHLGaGfT03ZKaSQNliwRN1WuXSItLwj4dWfm8kIdf4Dx1jsoDgIXH%2B8g9%2BK%2FU77NYLku1Zp3IMffe4VDclaMPiI8M8GOqUB3UdDvwUOp1z8L4lJm4U0DzOXbZL2L%2BZRh%2BAeuwRBFasvlj7i3A6awUDb4w0x%2BaOpiBbjHHt8oFplmoMp5AvkkifocE8fy%2BripNC3wjOiiWc354yh9DiWrCzFYiye6l8vLgDfRyeRbdpWcvrFH2zs3R%2FbDyH%2FbclhjqOE0luvP5znm2eQOa6NDx9oehBIejCb5XTU0ACWTkUv1jKa%2FfeNyA4DGfio&X-Amz-Signature=b6c057edda0116a44749c1404e866eae1de84b4ac73601063f2145aa75e52bab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 모두 긴 답변 생성 가능하지만
- instructblip은 더 정확한 visual detail을 포함하고 더 논리적으로 일관된 reasoning
    - llava - 길지만 불필요한 내용을 포함

<u>“단순히 길게 말하는 게 아니라, 더 정확하고 맥락에 맞는 답을 생성한다.”</u>


3.4. Instruction Tuning vs. Multitask Learning


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/69bd73cc-6671-491a-af5b-ab9909b71df7/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TG2SMZC2%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040433Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDdit3Sios%2Bx%2B7fGIZ2jzN%2B5tZgxP1od0ViyAmDOX6fjAiEAphiNdcKgtu1UZ3lIhMrZXx2%2FS7DnAdrEud7NBkRvWqAqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBbZorGFjTOlmGB4PyrcAye%2Bl7ZPHUDoirv2nDFfYK%2BnPnaR79LRu4jSVqFHGDHWVkvCekiAlH8lg4rlH5GxQb6cRkjj6h6nNrfNlZ62uP4J0jdGHKk5NGV7iGBwtK%2BavWzIPzo01Wo712wNbDj4%2BaJjKdHf7Z4S1jVcvfAcN0Ul0SPcgiztRdd8v%2FqBBHY4RzKxis45ouxVC%2BJCTbMAP%2BOyPzfbpo1cl8T09w7SNqs3nC7OCTgjrUXDMv0blHTe0kt0%2BqiuA0VQ%2F8YnSljXdpO2%2BwAcJk8Fx0lgy2NS9DVkkRWuKSQgJfPpxSRQxoJycAZs%2BkO4CSamrAEg%2B9z%2BNoTmnjbxb82uHDNklmHgIaxE%2F%2FG292qBtcfCgRuovr7o846DbE6rOHJL%2BJxT5nAik9gzDwmoTgUJK59e3%2BPpzQPKtsafo44yLzu99vhMy6vAdchVgz00KTPUJMsn5PHcEZcXEX%2Fv5b8rR9nlkitM1utNgDT16HA%2BaTFwtHhfGHviNt8jSjCcHODnCGzYFZJH3GjKZab6%2BstoaVFi1n3cjNqX5LC288CjfTUYvbDqjgHLGaGfT03ZKaSQNliwRN1WuXSItLwj4dWfm8kIdf4Dx1jsoDgIXH%2B8g9%2BK%2FU77NYLku1Zp3IMffe4VDclaMPiI8M8GOqUB3UdDvwUOp1z8L4lJm4U0DzOXbZL2L%2BZRh%2BAeuwRBFasvlj7i3A6awUDb4w0x%2BaOpiBbjHHt8oFplmoMp5AvkkifocE8fy%2BripNC3wjOiiWc354yh9DiWrCzFYiye6l8vLgDfRyeRbdpWcvrFH2zs3R%2FbDyH%2FbclhjqOE0luvP5znm2eQOa6NDx9oehBIejCb5XTU0ACWTkUv1jKa%2FfeNyA4DGfio&X-Amz-Signature=8735f81a05aad9a76fa02ac683774dbbaa9ab8529b20b76f06a3cb2dbc82f374&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff562478-0a4b-4af6-bc59-16adc0611b97/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YINZUC4Q%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040502Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEAbAg%2BQAAF7GKwt5hLeF8JrvcM0%2FXxx1mmdQhk7xJ8bAiEAkyBgIBBm6K%2Fe0YwXqjuhPB8QV7PRxok40OhDHuFpwgYqiAQIrf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKloBJOQ31zFrINsjircA%2Bus1rF7E8FOUMYS%2BKPBmBta%2FXLcM%2BKlUCO1AUWDbRylwZQS2XRbx5IPgZsHaDMFw%2BQ1XUTOzlC2Q6%2BCxhsXMJ36cxnb1xYrj1ZOhPW2qpJnoQYFWxfHJ4a9g9CcTjIGs3oreE3kw7ecv4yJKmFm3tDviKQChZGJHz5%2F3CNye0s6F91eU8rYPV1YyUZ%2BMKTNn0X6FA73EbUd2MXhOa%2FOdmqZ58h8jbohCAEIpVN3PInDbbWNkHoC1yOJUaW1AOOn%2BQk4qcocqXyMRp6VSiR%2FrV8zHqlwCTl6xHonYWlv%2FoRAIqqKoKHrHYiMkJjcGWLn0rLrNlPhL3OU2ixlgVfZ1EvHEdoJJBesDJeADhAln3ctRI83ZZGbDC9M4HKXIkeihRq4U4B13Gu9tSYDTCpZvHXWxgrGxmyL5Sn7A6ZgemcNd6CUiCagEb5soAKvONvpQYZPGXF%2Bk6brR7QV6XqRO99Yt1UXeW6%2Fn5VYOJ%2FUpRDO85AJ%2FkVWz7hRlD0fbk86suLQRmm%2F2uubGwRx7Ms5wjtgwYWTqbhpsm9gO0RCIeFWiHMC2cbdjBzEtnXd5gGHm786o3XdVJuNpGzmLKX3II6OrPxhqlgSvrfrGB23dq7Z6Ln20dJJDHuxe13XMKaV8M8GOqUB8hzXI0jn04iERh0UowWn0w2F6r2mQy%2FfPgYJpa%2FanR3EZvtRqSERVLQd7NBLWQzixVlb6jG24uMHOjQzbIsJ%2BId1BW2tZRDGDRsPgkeh6yts%2FYVVDS1Ulpl0Oj9dA9DV2m9g9K1tCqCjlEAOB8Qxmohy57RcrbV31QI6h%2BJtxea1I4ixCz0F8xNJHRWcxoouv0X2ulJdY12wI6Nyr0kHSoefNDZf&X-Amz-Signature=332abdf244d9e11748cd2a50d04c9abdd21334b74a0f57dbde997eec2cb68d1c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
