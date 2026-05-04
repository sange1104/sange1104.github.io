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

    ![노랑 - held-in, 흰색 - held-out](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b8cfba8b-856c-46d2-b746-d439114dce86/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQVZEULZ%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040652Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICFbshq3jBuI2XnEOvQwJc7tFWLtYrcIZRas2qjvLoA2AiBsfysXXfav7qboAxo3BOhe7WqedXuS6ohWJ0IrGRuzuir%2FAwhjEAAaDDYzNzQyMzE4MzgwNSIMyq%2FxD8D5F0zw3rM0KtwDWhWSXYk2G9QN13s89k6QIYZJ1c2z86B6ro9bnUpmML9guNvuIbm63rbTnObnjbHDvF0s0FbhmRErE1rJpWdJshsrdwjXjiqu5nsdUWY4KYL3b%2BylLZBpJ8r3XwoPAQf%2Fz0%2B8naoFEX4yfhWl%2Bz8HoDgOR8VDfuwFRQRVL5CqLSdlPuvjNGJ0jqTJDGlimk1wBc%2F8unDPpAcc9zBZ7%2FXwMaNx6WrsWByy69AlqX5VmIlWMqP1l%2F5DHuXBZjBzxF9HGXK2y7HRHLPJN4GdIDW0WVXsStWLW8Jk%2BT%2BBGdKnb8dRFedczhci5%2BSvVh9sPjN9Urfe7DbD5m9n4snFCWC%2BjhLUI3w%2BX%2FNH%2F77gLQKV1BgnUiJYgd2K6PiTwFpAhr0VJJFgXL6jWARiMwPjfVEZ0QbtPgSg4PvNcqHkgPEqIRAhUFcB8f7H2R3UmXb73DBKu4qAHs9DT1b%2FBLfojJzFaG6zfcRPPEHdNY0tVAW2CtSpAyWZkifjZdWwuAz1A%2Bh5Tzcgb0hDDK%2FvDZkzVPvH%2FIZAUhuV%2B5AhZsHh0VWCwzIPPrP3w2u3KqS4K7swCfhcr0G9FUof6X%2FY3kuUa8JRTHaNvVhQoRet2VDU8WMDmaBX%2F0cyIg0QNMQk%2Fzsw%2BvbfzwY6pgGzvD7wioVMK6zxs5ftV4raImvehwaY38Huy0mF04K4334rDAh6eas3pM%2Fpf3rztf29wNUPv3aBb5UEHiB7XIq9gJwyjAcCLBWFRPifMhooF0HzHk0bbd1nSetRv00tztK%2F8299HTP%2BgRhw7JqGHAr2XREvXcGU8lcDqnKv%2FBOkf50ZXbcHDwataI3qqxGbpCkf5R%2Fo%2BohKrksh36lZBieolYHbgdpq&X-Amz-Signature=e673c003906b001a5e47a303ec75283f63d2995b2423a60629e6049173d76d05&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/26ad8e84-7e03-46da-b5cd-630e92a97fef/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQ5WOJGE%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040644Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGYzJ6N5KWVCvnrGiYPa1Pe9S4Irl0UVD5yiOVV0mGTGAiA4EXTOA1IvpZTPPMoa3GL6TgjrzPz1u0hO%2FCgwir48BCr%2FAwhjEAAaDDYzNzQyMzE4MzgwNSIMRvcxiKkOFgY1Z0HDKtwDmsVgXx5jvI7edoQvJT%2FRtAL%2BbekUFxv1PWm2WOsXpYPqusXs%2Bh64YNhyK1pOw9M0D%2Fh5BYmQyCAWf7tf9DwH7ozqiI%2FvaAo8I4wzb0tfsQerbzUmo9J4puo3pLnKvAOwJvxf9lgkG7UnU4OGIRj6UJCPxp2dG%2FLOKD7jWVDCFkSMhH0w%2F%2FPKmixDIKQiFJLRPdOH8DvRVgrMd%2FrMdUeedAM9roqxdgJF2kWKBWnf4QH1es%2BBO3TxlYKPQ%2BkzuSLgJUeZHAn3f1HY5vZPCJztD%2FHw7H5DnVSxFwuHt46lhkNgdE90byVGDdxKtUijJlaWoCnToLAZd7%2B1qX7IhOCfk6y2mT9eteNFfWl0PH6ihgBuHxZPIGhayFXoV6WcIJLYsYr9T3%2FxwRrYV84EpA%2BD45t6ZMSoLwuPIW7ka5rMJGlx%2B4rmjgeF%2Bo9U5wxHE5x7z%2B1T%2FdVuDrk9D8zg%2FGfcof06cEorNQNZh95UXgPK%2FNPzM9OqddnGUKdwA%2FKIIWsQFGSNulWxRZ%2Fo73XsWTAZz7CDCopUcmm0wwRsPJhDbESEF%2BzVTYGbFIyJezvtxgIz48wnli62h252WO3SB7f0q%2Fh5ClS4yswBG7TxvQb0eWeYt0%2Fqn82cL9f84xkwvPffzwY6pgFXOV%2F9df%2FFo2abVT1G3JxM1wLppR0M5mCAHafWMJ6ZwCTrTvu%2FATITy1UFhxpUi%2B6dG4WDLL27ghV90zrYMMCRv9n%2F6IVc6qgvPVoVjZLcwDPI%2FYZazLnmB8pojCO3O%2FKaNvTVCeAHFoTFNIX8cPSOq7m70KgiIZ6oqB1Gy5MZUYHxx60vaQlt3LzWBQuGUFZXonl7DIFkYlqSyTDRWFFC%2Bm4AlJXw&X-Amz-Signature=4e16c32b714e5e4fab61a5a040ac0229c06686afee63d4979fbd507da3be191e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c21abd49-6187-4db6-8ccc-78d871a99c43/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQ5WOJGE%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040644Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGYzJ6N5KWVCvnrGiYPa1Pe9S4Irl0UVD5yiOVV0mGTGAiA4EXTOA1IvpZTPPMoa3GL6TgjrzPz1u0hO%2FCgwir48BCr%2FAwhjEAAaDDYzNzQyMzE4MzgwNSIMRvcxiKkOFgY1Z0HDKtwDmsVgXx5jvI7edoQvJT%2FRtAL%2BbekUFxv1PWm2WOsXpYPqusXs%2Bh64YNhyK1pOw9M0D%2Fh5BYmQyCAWf7tf9DwH7ozqiI%2FvaAo8I4wzb0tfsQerbzUmo9J4puo3pLnKvAOwJvxf9lgkG7UnU4OGIRj6UJCPxp2dG%2FLOKD7jWVDCFkSMhH0w%2F%2FPKmixDIKQiFJLRPdOH8DvRVgrMd%2FrMdUeedAM9roqxdgJF2kWKBWnf4QH1es%2BBO3TxlYKPQ%2BkzuSLgJUeZHAn3f1HY5vZPCJztD%2FHw7H5DnVSxFwuHt46lhkNgdE90byVGDdxKtUijJlaWoCnToLAZd7%2B1qX7IhOCfk6y2mT9eteNFfWl0PH6ihgBuHxZPIGhayFXoV6WcIJLYsYr9T3%2FxwRrYV84EpA%2BD45t6ZMSoLwuPIW7ka5rMJGlx%2B4rmjgeF%2Bo9U5wxHE5x7z%2B1T%2FdVuDrk9D8zg%2FGfcof06cEorNQNZh95UXgPK%2FNPzM9OqddnGUKdwA%2FKIIWsQFGSNulWxRZ%2Fo73XsWTAZz7CDCopUcmm0wwRsPJhDbESEF%2BzVTYGbFIyJezvtxgIz48wnli62h252WO3SB7f0q%2Fh5ClS4yswBG7TxvQb0eWeYt0%2Fqn82cL9f84xkwvPffzwY6pgFXOV%2F9df%2FFo2abVT1G3JxM1wLppR0M5mCAHafWMJ6ZwCTrTvu%2FATITy1UFhxpUi%2B6dG4WDLL27ghV90zrYMMCRv9n%2F6IVc6qgvPVoVjZLcwDPI%2FYZazLnmB8pojCO3O%2FKaNvTVCeAHFoTFNIX8cPSOq7m70KgiIZ6oqB1Gy5MZUYHxx60vaQlt3LzWBQuGUFZXonl7DIFkYlqSyTDRWFFC%2Bm4AlJXw&X-Amz-Signature=317ad0bb7cf3dcafa8cbb4c0285ffa5da5902e032510e34f3c4c42a850ac0227&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c6440dea-37f4-4390-a9b4-23f91e7ebc2e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQ5WOJGE%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040644Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGYzJ6N5KWVCvnrGiYPa1Pe9S4Irl0UVD5yiOVV0mGTGAiA4EXTOA1IvpZTPPMoa3GL6TgjrzPz1u0hO%2FCgwir48BCr%2FAwhjEAAaDDYzNzQyMzE4MzgwNSIMRvcxiKkOFgY1Z0HDKtwDmsVgXx5jvI7edoQvJT%2FRtAL%2BbekUFxv1PWm2WOsXpYPqusXs%2Bh64YNhyK1pOw9M0D%2Fh5BYmQyCAWf7tf9DwH7ozqiI%2FvaAo8I4wzb0tfsQerbzUmo9J4puo3pLnKvAOwJvxf9lgkG7UnU4OGIRj6UJCPxp2dG%2FLOKD7jWVDCFkSMhH0w%2F%2FPKmixDIKQiFJLRPdOH8DvRVgrMd%2FrMdUeedAM9roqxdgJF2kWKBWnf4QH1es%2BBO3TxlYKPQ%2BkzuSLgJUeZHAn3f1HY5vZPCJztD%2FHw7H5DnVSxFwuHt46lhkNgdE90byVGDdxKtUijJlaWoCnToLAZd7%2B1qX7IhOCfk6y2mT9eteNFfWl0PH6ihgBuHxZPIGhayFXoV6WcIJLYsYr9T3%2FxwRrYV84EpA%2BD45t6ZMSoLwuPIW7ka5rMJGlx%2B4rmjgeF%2Bo9U5wxHE5x7z%2B1T%2FdVuDrk9D8zg%2FGfcof06cEorNQNZh95UXgPK%2FNPzM9OqddnGUKdwA%2FKIIWsQFGSNulWxRZ%2Fo73XsWTAZz7CDCopUcmm0wwRsPJhDbESEF%2BzVTYGbFIyJezvtxgIz48wnli62h252WO3SB7f0q%2Fh5ClS4yswBG7TxvQb0eWeYt0%2Fqn82cL9f84xkwvPffzwY6pgFXOV%2F9df%2FFo2abVT1G3JxM1wLppR0M5mCAHafWMJ6ZwCTrTvu%2FATITy1UFhxpUi%2B6dG4WDLL27ghV90zrYMMCRv9n%2F6IVc6qgvPVoVjZLcwDPI%2FYZazLnmB8pojCO3O%2FKaNvTVCeAHFoTFNIX8cPSOq7m70KgiIZ6oqB1Gy5MZUYHxx60vaQlt3LzWBQuGUFZXonl7DIFkYlqSyTDRWFFC%2Bm4AlJXw&X-Amz-Signature=1a6919e5f0447894460cbba83d4406f2b9450478eb152aad032a8189bfdc61e2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b88ebf5-2f56-43ba-9dcb-e5f6b9a28ff1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQ5WOJGE%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040644Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGYzJ6N5KWVCvnrGiYPa1Pe9S4Irl0UVD5yiOVV0mGTGAiA4EXTOA1IvpZTPPMoa3GL6TgjrzPz1u0hO%2FCgwir48BCr%2FAwhjEAAaDDYzNzQyMzE4MzgwNSIMRvcxiKkOFgY1Z0HDKtwDmsVgXx5jvI7edoQvJT%2FRtAL%2BbekUFxv1PWm2WOsXpYPqusXs%2Bh64YNhyK1pOw9M0D%2Fh5BYmQyCAWf7tf9DwH7ozqiI%2FvaAo8I4wzb0tfsQerbzUmo9J4puo3pLnKvAOwJvxf9lgkG7UnU4OGIRj6UJCPxp2dG%2FLOKD7jWVDCFkSMhH0w%2F%2FPKmixDIKQiFJLRPdOH8DvRVgrMd%2FrMdUeedAM9roqxdgJF2kWKBWnf4QH1es%2BBO3TxlYKPQ%2BkzuSLgJUeZHAn3f1HY5vZPCJztD%2FHw7H5DnVSxFwuHt46lhkNgdE90byVGDdxKtUijJlaWoCnToLAZd7%2B1qX7IhOCfk6y2mT9eteNFfWl0PH6ihgBuHxZPIGhayFXoV6WcIJLYsYr9T3%2FxwRrYV84EpA%2BD45t6ZMSoLwuPIW7ka5rMJGlx%2B4rmjgeF%2Bo9U5wxHE5x7z%2B1T%2FdVuDrk9D8zg%2FGfcof06cEorNQNZh95UXgPK%2FNPzM9OqddnGUKdwA%2FKIIWsQFGSNulWxRZ%2Fo73XsWTAZz7CDCopUcmm0wwRsPJhDbESEF%2BzVTYGbFIyJezvtxgIz48wnli62h252WO3SB7f0q%2Fh5ClS4yswBG7TxvQb0eWeYt0%2Fqn82cL9f84xkwvPffzwY6pgFXOV%2F9df%2FFo2abVT1G3JxM1wLppR0M5mCAHafWMJ6ZwCTrTvu%2FATITy1UFhxpUi%2B6dG4WDLL27ghV90zrYMMCRv9n%2F6IVc6qgvPVoVjZLcwDPI%2FYZazLnmB8pojCO3O%2FKaNvTVCeAHFoTFNIX8cPSOq7m70KgiIZ6oqB1Gy5MZUYHxx60vaQlt3LzWBQuGUFZXonl7DIFkYlqSyTDRWFFC%2Bm4AlJXw&X-Amz-Signature=a84b511478080f963a637d06e84f5d871df551e97179e8d03d21cbfc732f1efe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 복잡한 시각적 추론 가능
    - 상황을 추론, 사건을 유추
- 시각 정보 + 지식 결합
    - 유명 작품을 설명
- 분위기 및 은유 이해
- 멀티턴 대화 가능
- 다른 모델들과 비교: gpt4, llava, minigpt-4

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d859b7b1-1acd-4851-8fa7-6a3ba5cfc217/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQ5WOJGE%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040644Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGYzJ6N5KWVCvnrGiYPa1Pe9S4Irl0UVD5yiOVV0mGTGAiA4EXTOA1IvpZTPPMoa3GL6TgjrzPz1u0hO%2FCgwir48BCr%2FAwhjEAAaDDYzNzQyMzE4MzgwNSIMRvcxiKkOFgY1Z0HDKtwDmsVgXx5jvI7edoQvJT%2FRtAL%2BbekUFxv1PWm2WOsXpYPqusXs%2Bh64YNhyK1pOw9M0D%2Fh5BYmQyCAWf7tf9DwH7ozqiI%2FvaAo8I4wzb0tfsQerbzUmo9J4puo3pLnKvAOwJvxf9lgkG7UnU4OGIRj6UJCPxp2dG%2FLOKD7jWVDCFkSMhH0w%2F%2FPKmixDIKQiFJLRPdOH8DvRVgrMd%2FrMdUeedAM9roqxdgJF2kWKBWnf4QH1es%2BBO3TxlYKPQ%2BkzuSLgJUeZHAn3f1HY5vZPCJztD%2FHw7H5DnVSxFwuHt46lhkNgdE90byVGDdxKtUijJlaWoCnToLAZd7%2B1qX7IhOCfk6y2mT9eteNFfWl0PH6ihgBuHxZPIGhayFXoV6WcIJLYsYr9T3%2FxwRrYV84EpA%2BD45t6ZMSoLwuPIW7ka5rMJGlx%2B4rmjgeF%2Bo9U5wxHE5x7z%2B1T%2FdVuDrk9D8zg%2FGfcof06cEorNQNZh95UXgPK%2FNPzM9OqddnGUKdwA%2FKIIWsQFGSNulWxRZ%2Fo73XsWTAZz7CDCopUcmm0wwRsPJhDbESEF%2BzVTYGbFIyJezvtxgIz48wnli62h252WO3SB7f0q%2Fh5ClS4yswBG7TxvQb0eWeYt0%2Fqn82cL9f84xkwvPffzwY6pgFXOV%2F9df%2FFo2abVT1G3JxM1wLppR0M5mCAHafWMJ6ZwCTrTvu%2FATITy1UFhxpUi%2B6dG4WDLL27ghV90zrYMMCRv9n%2F6IVc6qgvPVoVjZLcwDPI%2FYZazLnmB8pojCO3O%2FKaNvTVCeAHFoTFNIX8cPSOq7m70KgiIZ6oqB1Gy5MZUYHxx60vaQlt3LzWBQuGUFZXonl7DIFkYlqSyTDRWFFC%2Bm4AlJXw&X-Amz-Signature=593398d8ba08d5ee0aedfb3be43fc84177f949163f2cc970d1d2c90e198c64e2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 모두 긴 답변 생성 가능하지만
- instructblip은 더 정확한 visual detail을 포함하고 더 논리적으로 일관된 reasoning
    - llava - 길지만 불필요한 내용을 포함

<u>“단순히 길게 말하는 게 아니라, 더 정확하고 맥락에 맞는 답을 생성한다.”</u>


3.4. Instruction Tuning vs. Multitask Learning


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/69bd73cc-6671-491a-af5b-ab9909b71df7/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQ5WOJGE%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040644Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGYzJ6N5KWVCvnrGiYPa1Pe9S4Irl0UVD5yiOVV0mGTGAiA4EXTOA1IvpZTPPMoa3GL6TgjrzPz1u0hO%2FCgwir48BCr%2FAwhjEAAaDDYzNzQyMzE4MzgwNSIMRvcxiKkOFgY1Z0HDKtwDmsVgXx5jvI7edoQvJT%2FRtAL%2BbekUFxv1PWm2WOsXpYPqusXs%2Bh64YNhyK1pOw9M0D%2Fh5BYmQyCAWf7tf9DwH7ozqiI%2FvaAo8I4wzb0tfsQerbzUmo9J4puo3pLnKvAOwJvxf9lgkG7UnU4OGIRj6UJCPxp2dG%2FLOKD7jWVDCFkSMhH0w%2F%2FPKmixDIKQiFJLRPdOH8DvRVgrMd%2FrMdUeedAM9roqxdgJF2kWKBWnf4QH1es%2BBO3TxlYKPQ%2BkzuSLgJUeZHAn3f1HY5vZPCJztD%2FHw7H5DnVSxFwuHt46lhkNgdE90byVGDdxKtUijJlaWoCnToLAZd7%2B1qX7IhOCfk6y2mT9eteNFfWl0PH6ihgBuHxZPIGhayFXoV6WcIJLYsYr9T3%2FxwRrYV84EpA%2BD45t6ZMSoLwuPIW7ka5rMJGlx%2B4rmjgeF%2Bo9U5wxHE5x7z%2B1T%2FdVuDrk9D8zg%2FGfcof06cEorNQNZh95UXgPK%2FNPzM9OqddnGUKdwA%2FKIIWsQFGSNulWxRZ%2Fo73XsWTAZz7CDCopUcmm0wwRsPJhDbESEF%2BzVTYGbFIyJezvtxgIz48wnli62h252WO3SB7f0q%2Fh5ClS4yswBG7TxvQb0eWeYt0%2Fqn82cL9f84xkwvPffzwY6pgFXOV%2F9df%2FFo2abVT1G3JxM1wLppR0M5mCAHafWMJ6ZwCTrTvu%2FATITy1UFhxpUi%2B6dG4WDLL27ghV90zrYMMCRv9n%2F6IVc6qgvPVoVjZLcwDPI%2FYZazLnmB8pojCO3O%2FKaNvTVCeAHFoTFNIX8cPSOq7m70KgiIZ6oqB1Gy5MZUYHxx60vaQlt3LzWBQuGUFZXonl7DIFkYlqSyTDRWFFC%2Bm4AlJXw&X-Amz-Signature=c588805f5da32aced4c05dbba8a5470f839e309ac8fac4f696b701b70170760a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff562478-0a4b-4af6-bc59-16adc0611b97/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TEXMIEOW%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040705Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICBd0zKfxcY%2BPN4Esv4Ql30aUwvSuE2oeGyvYeM5D%2B%2FFAiEAnvbyiydT03VKxqo%2BODBv83rTvRfg91VSGTgZHwzv6%2Bsq%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDMTPSP00adOkUGMBICrcA%2FGE558cJUrmsCC0%2BIhUQ5Q5iYqlhI1wc8d0LZw%2Bl1Qu4z%2ByM3tGjzNbJa75alwuA5D1BkH9MAC1p8XTREtImgO91Sj%2F3jRGESXRX6bx7ZfCBi9PCGhDEIpODT81TFBS5pHgptuFkXb%2FJS%2BKQA6KKy1C3hqF3qbY6Zde1%2FVeZYo0RkoKiI0VNOW1nCNGlorMJo%2FID%2FJHx4U6l4j49tQIOFsvpew785VAsshfStpDKXc1M7%2FEKVE6ORkKeA9RMZsZCf%2F3kO0xUF2NePMBTkrCh2eVbdvcMRfv7yNd3KhJxCOxcyxnznRnUCsK%2FyOnYXSNrguuSVDMfTryRKy6Mq2DwgG2Fm3MTGQYw%2BlXDFjqu0Db9Y8%2F7wgO4yjfHtkTJofYRebJlvTjvBwkHs3o4KDJ3w3KwOvu5CaizIgdVwB4y3oWC%2F%2BbhEMWzxOWMp39lfq%2F5G%2BVpP7yR1E9%2B71NCgHE34oJuZX4tnjEGOpGJtyZ1D%2FzHYnCgfEOLlzMUPcL%2Bz%2F2qfIfBWF265a8RaMFmmBDnq3WtVBOf5%2FIg1Rad00S3D7gzGSrN80s73syeavW4vy6jvSSv2%2F0HH52j5X7TIWZ1c23vuhj5VZU%2BYNJmsrJwS2bUHS%2F6eZY6fhTDwbSMNf2388GOqUBRY%2FXrhqnakJNWedzGay1AZkZA5sJHBIdOrTbSdHJkqs0vdA%2BocuGImR2AkHZgaxjTmB6wjuW7DbaxO3t1vJwNtWf%2BkizjVsu7f9jyN88gtxlW6lnw53kgXqXAHQ3hlrxdQ88zfSYrcxDkmxu2%2BQ46H0OrkSiEUAssrrcNT%2Bzm5izTRDlS1ITvfnCnVZ5X%2FfffC3Tf8vUIDimdXO61wVn2XghWHxv&X-Amz-Signature=61f3265954c6a82fa230832ec3d63cfa30a9c64b1018ca20fa4fff2ebfe3fc51&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
