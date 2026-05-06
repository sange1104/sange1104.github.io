---
title: "Visual CoT: Advancing Multi-Modal Language Models with a Comprehensive Dataset and Benchmark for Chain-of-Thought Reasoning"
date: 2026-01-05
categories: [paper-review, vision-language]
tags: [mllm, vision-language]
---


## Abstract

- MLLM의 발전 - 여러 VQA tasks
- 하지만 **interpretability가 약하고**, 답에 관한 정보가 있는 지역의 크기가 작은 **복잡한 visual 입력을 어려워함**
- 이 문제를 해결하기 위해서, 본 연구는 <u>**대규모의 visual CoT 데이터셋을 수집하고 제시함**</u>
    - 438k의 question-answer pairs
    - 질문에 답을 하기 위해 필수적인 핵심 지역을 _**bounding box**_로 표시함
    - 이 중 98k의 데이터셋은 _**상세한 추론 단계**_와 함께 annotation됨
- 또한, multi-turn 프로세싱 파이프라인을 제시함
    - 다이나믹하게 visual 입력에 초점을 맞추고 해석가능한 생각을 제공함
- 관련된 벤치마크도 제시함 - 특정한 지역 파악에 대한 task
- 광범위한 실험을 통해 효과성 입증, better 추론에 대한 가능성 제시

## Introduction

- MLLM의 등장과 발전
    - LLaVA, SPHINX, Qwen-VL
    - 입력 이미지를 시각적 토큰으로 변환해서 llm과 결합하는 방식
    - 여러 task에서 그 성능을 입증함
- 기존 모델의 한계점
    - **블랙박스 구조 & 환각 현상**
        - interpretability가 부족하고 hallucination 생김
        - llm에서 효과를 입증한 chain of thought 기법이 mllm에서는 제대로 탐구되지 않음
    - **비효율적인 이미지 처리**
        - 인간은 복잡한 시각 정보를 처리할때 전체를 훑고 그다음에 중요한 영역에 집중하는 방식을 사용함
        - 하지만 기존 모델들은 고정된 해상도로 전체 이미지를 한번에 처리하려 하기 때문에, 세밀한 정보 파악이 어렵고 인간처럼 효율적인 추론을 못함
        - 인간처럼 추론하려면, 모델은 핵심적인 정보를 담고 있는 지역을 찾아서, 관련된 문맥을 포착하기 위해 그 지역을 확대해야 함
- 이를 해결하기 위해서, multi-turn 대화와 dynamic한 시각적 집중이 가능한 새로운 방법론이 필요함
    - 💡 중간의 visual CoT supervision이 있는 데이터셋이 없음

        **→ Visual CoT 데이터셋 구축**

            - 질문에 답하기 위해서 봐야할 핵심 영역을 바운딩 박스로 표시한 438k의 데이터셋 구축
            - 이 중 98k는 상세한 단계별 추론 과정이 포함됨
    - 💡 유명한 mllm 파이프라인이 정적인 이미지 입력에 의존

        **→ 인간의 인지 과정을 모방한 새로운 모델 파이프라인**

            - 이미지에서 관련된 핵심 영역을 찾고, 확대해서 세부 정보를 파악한 뒤, 전체 이미지 정보와 통합해서 답변을 생성하는 파이프라인
        - 관련된 visual CoT 벤치마크, 사전학습 모델 제시함
- 기여점
    1. <u>visual cot 데이터셋 제시</u>
    2. <u>mllm의 새로운 multi-turn 프로세싱 파이프라인 제시함</u>
    3. <u>새로운 visual cot 벤치마크 제시함 - 특정한 지역 또는 객체를 찾아서 답변해야하는 task</u>

> 💡 기존 모델들은 이미지를 통째로만 보려고 해서 디테일을 놓치거나 엉뚱한 답을 하는데, 인간처럼 중요한 부분을 자세히 들여다보는 능력을 가르치기 위한 새로운 데이터와 방법을 제시함~


## Related Work

- **Multi-modal LLMs**
    - mllm 초기에는 llm을 일종의 scheduler로 사용해서 시각적 작업을 수행하는 전문가 모델들을 연결하는 방식
    - 최근에는 visual과 language라는 두가지 모달리티를 직접 “정렬”하는 데 focus함
        - LLaVA : 이미지 토큰을 llm에 맞게 변환하는 projecter를 학습함
        - BLIP-2: Q-Former라는 구조를 사용해서 이미지 특징을 학습
    - 최근에는 2-stage로 학습함
        1. 이미지-캡션 쌍으로 pretraining
        2. question-answer 쌍으로 alignment를 수행
    - 여러 분야로 확장
- **Reasoning Capabilities of LLMs and MLLMs**
    - llm은 in-context learning, cot 프롬프팅을 통해 놀라운 추론 능력을 보여줌
    - 하지만 visual과 language의 domain gap으로 인해 mllm이 이러한 추론 능력을 물려받지는 못함
    - 관련 연구들
        - 데이터 통합: flamingo
        - 시각적 grounding 활용: Shikra, KOSMOS-2
        - 추론 단계 학습: V*, CogCoM
    - 위치 정보를 활용한 선행 연구와 다르게, 본 연구는 단순히 위치를 찾는걸 넘어 중간 단계의 시각적 사고 과정을 명시적으로 데이터셋으로 만들고 파이프라인에 적용했다는 점에서 차별점이 있음

## Visual CoT dataset

- 데이터셋 구축 배경: 기존에는 MLLM이 답변을 생성할 때 <u>**이미지 내의 특정 영역에 집중하도록 훈련할 수 있는 데이터셋이 부족**</u>했음
    - 이 공백을 메우고 모델이 **해석 가능한 중간 단계의 시각적 주의 영역을 출력할 수 있도록** 돕기 위해 데이터셋 구축함
- 구성: 438K개의 데이터셋
    - **Question-answer**
    - **Visual cot bounding box**
    - **상세 추론 단계**: 전체 데이터 중 98k의 쌍에는 단계별 논리적 사고 과정이 추가로 주석처리 되어 있음

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664PHQEB4S%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEE7G9rIk4jsmR7eU%2FAVyn9ZNghrRp4CAtEzCX4FW0SRAiBo4hxz4mmVEd6sPs%2BDBA4cVhaigR6zrVIPSUw5V2hSliqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMR1kyud1F%2F1UcVuTPKtwDkS1wBku5uuge9I8i0%2FljCKKITZF8sUUDN9wlOejU%2F1gsxCDCR9yZtxXAIVwJfJOgVWQcNd88ltqkgeuN3U8%2Bxc5MTufwGP3cPJGp%2F%2FZ17cTvp94LNiopMIYe13ZRbq4TwdpQMadX0CKnpF9LRxMC4QdA9Uvd9f%2F7jehWiW2HkGfoeXDwWXI1SAuY5Hutya5A729sLBfOzEtg7S9m85krzbLfRLXMSSsuHId0A32sEZItOX7xSOHkx4aiAwnOYR6GF%2FtItD%2BwxfMX2ypDA8rgC4GxkMY2ZgrYyKCR4ew23xuHpWJtgVCtd5mX3SsVYRAJ6Fbtod7aDLgYm2KgP4CQSia25Pl6gbBDHp5S18LQW%2B%2FRBBPp4ujg9S68YXyorPhD6TtYhzi3j6Cg5qSEG5I9pZSotdX1UCNq6b4a0wLJBT2P79DmwFCLXBdzJ1YJVcCNhv6Jt%2BOEcicaUCh2vOUyApKfjPkOhRM3hTX3WUKiPTZlWBbvwoLSKfYxVzN%2Bu2JXv%2B7MF5MOuIrobqCSRQWbynJYBqjIByQgx6sdMOeSDFvAXoKlllhV2uzLmKLdS%2Bky%2FjeBC5S0iiojAJvHOOk9q5CxTR3EFcojp4HgpkAfd81h3aLOmURoDAPw0QgwlvjqzwY6pgGiuOCXrMdVql292wF%2BspNjpibh7nOH0Lxh%2Fhpt5I2I1URjW6lMnoZXnvH83PFyzH6o8CYcF46myHn9rdhJCxzxYQNWc31LGeo3klOZALWxVYl7C7BCtfogx%2BBuJcOmsmWKa53t1sMCRmOMTVZ81tUhBZLu%2BW6UTfhH2oZ%2B6jnfdgdQBrxt%2F2Ma%2Fp%2BRUcOAUrS80KBUMm3NyZRHQtYeWzGtT%2B7pByS1&X-Amz-Signature=6566f25155a7f11ddc45507c518c829000ac6710192869ab31f82aa391d4406e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663ZMM6TV3%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCBI1PlS2oC7rJYNqBLwTHlPkW%2BAo49xjqcl1QCPsoiTQIhAO5lN2%2FMnnYhJrtIoWSd%2BuE4UWe4uK1CAmNa6XPRpYt2KogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz%2FtV0JO3IyzyDQ%2Brgq3AOZbahRRCxEVrEaHH45%2BmLZCx8N2hmTho9Wmz%2BXCaeroG0jV0LyZ8jBkEmhkQpQA1%2FM0xfQrWl4nNZE4iDuGfiyXhlHQdaF0GlSVzQgqwi%2FxF8HL4Mz9a%2BZai0TfFztYDIo8rzXrsQnY0RAq5j5Qq6mfmf9tDGnfXEhSMaPg6z%2B3g3pIE0HS1y8SRBxUwmYEBMdJxWa3on%2F9antP0wzbF7SUltn1WC5I4wxjOz0%2BPajer1LHyJZVZQwF3baj9wHLzqyd1B0eRN7z9qxvz59e%2Bg44nNJx98c8dDoWJTfPd5zwPz7h1wX1iF3BjGBt01VTkepWgIkYLKvCkfthnhOUmn2x%2BtpBPhYbJeKjZioSml2hUrw5gp8mMnuv7yvvhrF7liDisLS7NsPm3pTtBlfm3qP%2B%2FBdgdvIG61BEQ348VWFByqa9pBu61WT0GgrUaFFQrPgPZQSjud%2BkIOBXc8bxws1ZjB%2F2jzKbCqHmBTk29zZ%2FNctiBp2nelTJIUQMjjyZZz8es1Z2%2BIdwkIRbQq56vdtBP8IC7dnJurtQOLZq0bvw769Q%2Bvb%2BZnia72qbN8G6sXEFgmgaOc5A%2FtE4MtYn4n5qKuDRA%2BeGXol9pbclnkZCi8qlDCaHZ7aBu1fTjC3%2BerPBjqkAZOAePA6yTCbXI9Z7U077730alKVHBqsB06TcapJMKsNxgf4eDquCT5qkDUL0kwx%2FkAA69z5uq1iotHfWc2tYN84r6w5ptLEZkbyaP%2Fd5z%2BGigQazrhCr5BpSDC2T1BAONvyyp74azO%2BqX9rUG6VHNVBSAxhJNZSs5qHWHqUrmGCtJuXMUm6IaY7KoiQxeYlGRuSE2Qf2sLRq3bUalqmvSV5il52&X-Amz-Signature=b1d363b4935e8021c6d9a675543a20f121bb95bf183b9c8a3facbb0da9459cb0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 모델이 단순히 이미지-텍스트 pair를 넘어서 “어디를 봐야하는지”, “어떻게 생각해야 하는지”를 훈련할 수 있도록 설계된 포괄적인 데이터셋임

### **3.1 Data Generation**

- 어떻게 원본 12개의 데이터셋을 활용해서 visual cot 데이터셋을 구축했는가
    - 기존의 이미지, 주석을 사용하되, gpt-4와 paddleOCR 같은 도구를 활용하여 부족한 질문-답변 쌍을 생성하거나 시각적 근거 (Bounding box)를 자동으로 추출함
1. **Text/Doc**
    - 데이터셋: TextVQA, DocVQA, DUDE, SROIE, TextCaps
    - 이미 질문과 정답이 있는 데이터셋은 그대로 사용
    - 캡션만 있는 textcaps의 경우, gpt-4가 캡션을 기반으로 질문-정답을 생성함
    - paddleOCR를 사용해서 이미지 내의 텍스를 감지하고, 정답과 일치하는 단어나 문장이 포함된 영역을 visual CoT 바운딩 박스로 지정함
    - 필터링 파이프라인을 통해 지정된 bbox가 직접 질문과 관련있는지를 보장함
2. **Fine-grained understanding**
    - 데이터셋: birds-200-2011 (새의 종류와 속성, 부위별 위치 정보가 포함)
    - 모델이 이미지 내의 미세한 디테일을 식별하는 능력을 테스트하기 위해서 **특정 새의 특징을 묻는 질문을 구성함**
3. **General VQA**
    - 데이터셋: Flickr30k, Visual7W
    - Flickr30k - 이미지 캡션과 객체 위치 정보가 있음
        - 이 객체에 대한 질문을 gpt-4를 통해 만들어냄
        - 이 객체 위치가 bbox가 됨
    - Visual7w - 객체 수준의 위치 정보가 있는 question-answer pair가 있어서 바로 활용
4. **Charts**
    - InfographicsVQA
    - ocr 기술을 활용해서 정답이 위치한 영역을 식별하고 bbox로 활용함
5. **Relation reasoning**
    - Visual Spatial Reasoning (VSR), GQA, Open Images
    - 위 데이터셋들은 객체 간의 **공간적 관계 정보가 풍부**한 데이터셋들임
    - 질문과 관련된 객체의 bbox를 cot bbox로 지정함
    - detailed reasoning steps
        - **gqa 데이터셋** - 객체와 관계에 대한 <u>**scene graph를 기반으로 gpt-4**</u>를 이용해 단계별 추론 과정을 함

### **3.2 Dataset Analysis**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664JDRR52H%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040609Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQK6sFwZU5DhB7fbPVUsG3G3hSsk1%2F9b1%2F%2BndCbmX6jAIgHjzQtwnindtSCTN1Kr7Pl4W3ZQmIOuT8xsFvdo1iAVYqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ%2BCJnsxu1fBryXzpSrcA1pz%2B3DmyzjMmQKQm%2Bq2CNCRIqKpEUd%2B1gGcgjBVnnXsR27ucLOiaqxeldvpRGg%2FOT5ZdMcLveDa%2BxSlY%2BPf%2BFGT96O7xbPCgM1v2lB16onWztpUesU9V7yQ2NV96D4%2BeavzLFrG7r2WDYdr08U%2BcJlReAqD7qrv2%2FDw3ERIBzZKQwbN51ntPAzeMTN3qd62dujnwJM41NYBtEd4I%2Bt9uZmt8yH2zKDR24J350tjVTnr7t3AGmeOEYrVDbdglfoEQZ9ZyanPKV6gkNSWEiGKzWu4b3PKGBRZJqARWbFtfv3myKLLwr%2F9EjAv42wPm6%2Fww%2FjktAq98dFFwrNfmvpx8LTSE%2Bnet2kZYDx4WaGVl%2F0JfafWTLkV1UGC8e6oaK0JZsWmeuA%2FvyG4Axa8m0grY3Puz0Auj1rSDHAz9d8l8keAOedRrWW%2B6n8AM1XtNf07cOUB%2BIgWMJlhf2JByqwa53C99XUASocdHQ9paucWAxo8v7%2BhJzfQWfU8WvBOyES0qz1QKbB6pSfuU4bke47l17X1fAn%2FFVueOVbQCuO2oGErNVJft5DO21aDwJBc9Lbk77BtkbVM0BND5k9p4Geb6nWt1Cs7Mbx0MbuFRzpOoGsQHi2OyF6%2Bh3tx5fOkMOP26s8GOqUBXwCLmMIHBHByYBDWD0WqP%2FbGYKHs6ggthmI7kOwjlYOUSbnfSqwkePtyxaXji8iNtZtIQEWsQbmkpai4HRXEqQ016MWKrspXat3nt5lpzkdM%2BCb3bHse0PLhyFLmmP58oha947NmjQ09J8e6WM9KTa%2Be44T4MwiL%2BtXKLSJrvcXoI%2BGuM%2F03NkaDoqAbleCo2mm6Fz9WJqFU3%2BmdNwdsK0iH%2Bd6R&X-Amz-Signature=254ae73e6095f01573820ec5c6353b7d20f034d4a12112ddd0238dea68c2da1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- bounding box 크기 분석
    - 전체 이미지에서 bbox가 차지하는 비율을 기준으로
    - 소형 (1% 미만), 중형 (1~20%), 대형 (20% 초과)
    - text/doc 데이터셋에서 대부분 small/medium임
- 평균 영역 비율: 전체 이미지 면적의 13.2%
    - 나머지 86%는 질문 해결에 불필요한 정보일 가능성이 높음
- 평균 픽셀 크기: cot bbox의 평균 픽셀 크기는 247.82 픽셀임
    - 일반적인 비전 인코더의 입력 해상도가 보통 224~336 → 핵심 영역만 잘라내면 화질 저하 없이 딱 입력 가능함
    - 입력 이미지는 매우 큰데 비전 인코더의 입력 크기는 작아서, 보통 down sampling해서 이미지를 넣음 → **핵심 영역의 정보가 손실됨**
    - visual cot의 필요성: <u>**모델이 핵심 영역을 먼저 찾고, 그 부분만 확대해서 보는 능력이 필수적임**</u>

## Enhancing MLLMs with Chain-of-Thought Capabilities

- visual cot 데이터셋을 활용해서 멀티모달 성능을 높이기 위해 제안된 **VisCoT 프레임워크**와 파이프라인

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664JDRR52H%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040609Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQK6sFwZU5DhB7fbPVUsG3G3hSsk1%2F9b1%2F%2BndCbmX6jAIgHjzQtwnindtSCTN1Kr7Pl4W3ZQmIOuT8xsFvdo1iAVYqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ%2BCJnsxu1fBryXzpSrcA1pz%2B3DmyzjMmQKQm%2Bq2CNCRIqKpEUd%2B1gGcgjBVnnXsR27ucLOiaqxeldvpRGg%2FOT5ZdMcLveDa%2BxSlY%2BPf%2BFGT96O7xbPCgM1v2lB16onWztpUesU9V7yQ2NV96D4%2BeavzLFrG7r2WDYdr08U%2BcJlReAqD7qrv2%2FDw3ERIBzZKQwbN51ntPAzeMTN3qd62dujnwJM41NYBtEd4I%2Bt9uZmt8yH2zKDR24J350tjVTnr7t3AGmeOEYrVDbdglfoEQZ9ZyanPKV6gkNSWEiGKzWu4b3PKGBRZJqARWbFtfv3myKLLwr%2F9EjAv42wPm6%2Fww%2FjktAq98dFFwrNfmvpx8LTSE%2Bnet2kZYDx4WaGVl%2F0JfafWTLkV1UGC8e6oaK0JZsWmeuA%2FvyG4Axa8m0grY3Puz0Auj1rSDHAz9d8l8keAOedRrWW%2B6n8AM1XtNf07cOUB%2BIgWMJlhf2JByqwa53C99XUASocdHQ9paucWAxo8v7%2BhJzfQWfU8WvBOyES0qz1QKbB6pSfuU4bke47l17X1fAn%2FFVueOVbQCuO2oGErNVJft5DO21aDwJBc9Lbk77BtkbVM0BND5k9p4Geb6nWt1Cs7Mbx0MbuFRzpOoGsQHi2OyF6%2Bh3tx5fOkMOP26s8GOqUBXwCLmMIHBHByYBDWD0WqP%2FbGYKHs6ggthmI7kOwjlYOUSbnfSqwkePtyxaXji8iNtZtIQEWsQbmkpai4HRXEqQ016MWKrspXat3nt5lpzkdM%2BCb3bHse0PLhyFLmmP58oha947NmjQ09J8e6WM9KTa%2Be44T4MwiL%2BtXKLSJrvcXoI%2BGuM%2F03NkaDoqAbleCo2mm6Fz9WJqFU3%2BmdNwdsK0iH%2Bd6R&X-Amz-Signature=8a9231707ca305abd278ec30e268607227d1eace40f6be9af48aa8b2351a98e8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 특별히 복잡한 구조 x, visual encoder로 clip, llm으로 vicuna를 사용함
- **multi-turn 처리 방식**
    1. **CoT 프롬프트 입력**
        1. _"Please provide the bounding box coordinate of the region that can help you answer the question better."_
        2. 위 프롬프트를 질문 뒤에 추가해서 입력함
    2. **핵심 영역 식별**
        1. 모델은 전체 이미지를 보고 질문과 관련된 가장 중요한 영역을 bbox 형태로 예측해서 출력함
        2. 훈련 시에는 **정답** bbox, 추론 시에는 모델이 **예측한** bbox
    3. **이미지 크롭**: 예측된 bbox 부분을 잘라내서 local 이미지 x1을 만듦
    4. **feature 통합 및 답변 생성**
        1. 전체 이미지의 특징 + 로컬 이미지의 특징
        2. 통합된 특징을 모델에 넣고 최종 답변을 생성함
- **visual sampler**
    - 단순히 bbox대로 자르는 것이 아니라, 비전 인코더의 특성에 맞춰 이미지를 처리하는 중요한 모듈
    - **정사각형 유지**: clip 모델은 정사각형 입력을 선호
        - bbox의 가로/세로 중 긴 쪽이나 인코더의 입력 크기 절반 중 가장 큰 값을 기준으로 샘플링 크기를 정함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RF3AATUR%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040619Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIE15gkrCrFIcr7I7Wqzz2Fbtpemp0ei1BURGgOkX0w09AiEAikUWvjMRg%2F7RfGml8inQE7KNBYeGfgFhoB31%2Bqueg10qiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDI9AxLWhDhjNi5dYeircAxfpi47m93Zh5ByaEWTtsmrAPAqwWaeCyEa5QOmU2LpLiKiFw%2FmWmVBFPmrDrHZhkyw0cu4MeST1drJ3%2BJnJ8EDXQzeKy%2FDWGNY%2BzDLTcvWuOncnRKpINomU1CYF5M4z5vzNNCLMHggWKHT1djD1eWEUwQGwPt4YsURDedb04EnKwaCOZPLaqsIH1sTU70Lq%2FHYAds4VbIcvhPohwcPKjpttbjViZP1Z4FlgY47V620tlPeQA1L0EIQ6r%2By7nEMbVKNK6meBfysEsc%2Fxlyw8EzYKZf%2BfxsLlnOxc0V5ZsmkqhmFxPNwRTu0HnjjuZb1V%2BiqfO03MhTVdgFBVzWPJQ0CZKpNyOPnNYEZWdqPg07jmhSxBHjFrnb7APdUHBL1ti0vD707uLOxGaMzH9t0mikZB9XOVAfM%2Ff4bJ9QH%2FB2gBfwIj%2B%2BNa78VLsQYMOecWyNeOgUFLuUBPBceuuHsUjCo92vI%2BzcWjTO%2FOUzixgUckqBTRx7wKCO%2B6rW5NHS3qUn8boWA7CuHaypoKoKSM%2BUC6ijbrGKnVH21%2BT%2Bz7TBPVzpzIariEna6JHbLufrV%2BefJAeIftbvpz6hs6tPTvKDChntnJUr4mpa7yd%2F0VT73sBPPNTBo%2FK7wlQ2gGMOz26s8GOqUBRaq8burea2fqxxG8k%2B7n8PrCjJZtelL2OEzjQO48y8JUnhup9MbH2y2HbnkBUJKNwldXC7UD1s4A12wwFyQsDohbnU2LwkDPTXHdqmwY2lPCN%2F73qLQZISxboxrmFYgcOeee%2Fbv7NYvG7Uj2t6wQKrAOXPBxR1BTrWqFM7lWE%2FU8lJBg%2FhiHmmoz3K0b28R4rNm%2Fozmk%2FUNup4DaMylmEM%2FniITq&X-Amz-Signature=e580cc410a5f7b80090ac2866e6dcebdd838daacd2210605b3510700dbe3adbf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 문맥 보존: 너무 타이트하게 자르지 않고 **주변 문맥을 포함하도록** 영역을 설정함
    - 경계 보정: 잘라낼 영역이 이미지 바깥으로 나간다면, **중심점을 이미지 안쪽으로 이동시켜서 검은 여백 없이 유효한 이미지 정보만 담기도록 조정함**
        - 가장 바깥 부분에 해당하는 영역인데, bbox가 크기보다 작아서 크기대로 자르려면 이미지 바깥으로 나가야하는 경
- 추론 시 2가지 모드로 작동함
    - with visual cot: cot 프롬프트를 추가하는 경우
    - without visual cot: 일반적인 mllm처럼 이미지와 질문만 입력해서 빠르게 답변 가능
- 학습
    - 1-stage: llava1.5처럼 visual encoder랑 llm은 freeze하고, image-text 캡션 데이터를 사용해서 projector만 학습
    - 2-stage: 모든 weight는 trainable / visual cot 데이터 사용함

## Experiments

- **Visual CoT benchmark**
    - 이미지 내의 특정 영역에 집중해야만 답을 할 수 있는 시나리오를 평가하기 위해서 어떻게 벤치마크를 구성했는가?
    - 데이터 구성
        - visual cot에서 사용한 5개 도메인의 12개 원본 데이터셋을 활용함
        - 이미 공식적인 train/val 분할이 있으면 그걸 사용함
        - 없으면 random하게 나눠서 벤치마크를 구성함
    - zero-shot 평가 설정
        - 모델의 범용적인 능력을 테스트하기 위함
        - SROIE, DUDE, Visual7w의 test split을 사용해서 zero shot 성능을 측정함
    - 평가 방법
        - chat gpt를 평가자로 사용
        - 모델의 답변과 정답을 주고, 의미가 얼마나 일치하는지를 판단해서 0부터 1까지의 점수를 매기도록 함
- **성능 평가**
    - VisCoT 모델, LLaVA-1.5, SPHINX

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QGK6YRZE%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040622Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDjjGdc9eqEYBcGzoYdM4h8XOja5oBdOZn5Y2aiCumzIwIhAP%2BjztC%2BAhUTUsAXkAh8p6t%2BjoT2H%2Bk8R7nCgNYJVkQ4KogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxx3XeZS2Cktw721mgq3ANx%2Fzkgda7lM21v944taftzegYYRM2Mq3g9G27xi2NIzEo%2BOEhcZAKdcUbgQ8Vg5ZXVNwuAozqYK7puceDlsy8Vh1iN3hXIq4UnxmE2QbU9ckPgsOFNDYB%2BvUtaQya9g9bCdUywNo%2BHQXBuQ%2Bg1LVnfLWTEEuVYlBySTArIg5aB000zDJMl8vR%2BpEd0pEG6beyy%2FcnzoCGk7QZIzIjtSmihGGu9ZhQHrUrRy%2FKiIR0Nbn1V9ve2B%2FBYMICgMM5yimWxkaV6b9FEdlKQgSfU%2FPhezoR5yRvxy1Rkzr9b%2FJ3HXiEMsgBzpZuEqbpxsqlCz3buB%2FqcIoCTV8wFt0sqXQoR8DDbrNEMrMJAB0wA%2FBFhLwtmn18jPMwd04nuL3I%2B5obKALI4qToiWjI%2Fb6t2zb8MplLj%2FU98hshixH4ByeYO5qtbOARKcweVCeKDYzwlhfWrMosfF42ckrfBzC15FqmO73jBFH9AfLYobGqY9M%2FpDCMQCoPfUS6x1%2FCiCurseOEaiYk6TJx5NUrVJFqncymo0psLQ9up64MhRcbVK9c%2B6fLKpB7lYcUn5J4rFBgjrGXYB3050PEMMMPXwW1bHh4zv1wyFq1zvA50SGIANe%2B4%2FHj9WJUsZLKAhQvdcDDA9%2BrPBjqkAfKVgNyOBWv7Sq1P2Quti13vSyT9nPfae6mNTHLIOMOk27nBFXFChWzJv00F7sibde%2B36qzdj0BEFEKVnperzomzClXAdyVIl1We5s92%2BSlodUgp0fm9FWui%2B2FnTTxppcOGQKKVK%2Ftltmv5%2Fd8AoISTQ78tYv4D%2BxhgX%2Be%2BGhnafOVsrXr0XKYzq64wHu0OjdZ%2Fq3MxXEoWHVMHIHq0DLwAuIoC&X-Amz-Signature=be31406b8fe7f9e3e87a2fcb65f5ee123fe9ef9b37f24d810619ff94ca0e8b5c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RBFKWTFN%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040624Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQChp2TJptg7rBLf%2Bv8wVvBBCirfwRdRwgVFbtbnLL7WPQIhAKliNN1OMIxYNV5l%2BWvVNEPAamko8j84iGELgFBIBgvYKogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxMWwyihDRwhRrR444q3APsCMuI0QZkOftPQpH6X74vcRlYZFw5Pa2rdeHq8o5vBgT5Qod03AIYBZtUvv5CsqQcUUYsG9WKLRMbkMNLTphNE%2BSBoszQEelRFsJh6uNV8nqL2HHlM0NIzeP2lOuHhVZrX46JzzyyBy1sffYF9KnCXLPriJ0VC456irke%2Bqlh100EY07q8E15hazKaIDcAdcgGn8wWeQ5xBC8A95lgQcFGDJiTiJA%2FavUjzH9zMBtu6%2BKqAjMI1H9DSY%2B0X01PWaeB7BL5M40uANhdHRR2ghf8z8BbUZCUiIP0l2zLS%2F6HolG5FsXZauM2XQunaZqqH8iJ8dHh%2BYRrl%2FONOX3eroF8rx4xQYGVdiX%2Fh9y22nREqOryIloJFi9RW598CWH3gwR4zlFGYgiMDUEQ37EOjP9%2BbLCUaQrc%2FfG4TcZLRSA7ikhqq%2BtzLEPkCEzffG9IqT4hTDInbsaJVA69to2z3OxrN3%2BoeHKye%2FnID4NzxKJlF8UbfenrxtT4jJLlot7jnyCKfzOcG9uXLe366NY0PsK8FUCu6KYwpEvt3ilLBoH6pCZB69mzdmKO3wQqlHv5AtuOEMUJVacs24%2BbPebsA32uoM3SOXi6gB4JO0VBwsTsc9LaYi%2Fpeugz%2FwwXTDZ%2BOrPBjqkAebCO5m0DyrsjxCYIBDzkOHTQJtPGWpnC5A%2FLaDqOCMqJFBP8Eo2RNgB1pTWHjE1bxEfyyTcIibf09uMkGO4GfrM2%2FHgiMQ1AJTdO7PyXH8yNhirlEKb7tfjIeRsGsTeP3sfHP7WKPahaui7BeAgUvDpup7DEK7kWwiLO%2FaLcxBnDOjHkTeAjYB2tQ9sjAZOH3cDEj9SSSnlOXbUac4T7Vpr498T&X-Amz-Signature=8216d2a1a7a06e994ef52041238f95dbb7d58fe18c1dd5a1786c47628913c632&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662NQ77HOG%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040624Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGjeojVaLQE88UPCoQ3bVWYgHtaaIQF29n2nOsEgMycKAiBEAPIyK%2FY3QpsMSKcWBP11yRDENpj0cVDaylT%2BfC7LCiqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMZvLrvFLhyNWJskgSKtwDEHL4G3kk9T2JWmZO0a0BpE742YsB4YyUihVcysH%2BeAMDq0V6Gr20xc6DuP05G9QflaXKVbzjUzYAUMYpQAdaO5mdcF3b%2BQSY3Cfgbi%2FM8GUihE5leKY158%2BXImg%2Bg%2B6sORWZhIpU%2FKEc5y1KBE8nyPHO1cCdqOEZf0uWpHqkRGhFp0n1f4Ina0S%2FiLpwEf9MsT7bRJ1kuLZ%2BpnPrSEjaVBggTOChyDHCBXL4DMU6AsrvSttJUh0CgyPRWR9hVoafUBqexHY7YGNENyamoqYq%2FykoGrH7%2BsCyaWweehzYkRRMCcOD%2Bum2BrI878Eo7cjIyQaTmXrXONbJSt%2Ferqhq0nOO09f3g1WDcRgXHLRQ9Yprjgpj8xIvN%2BoXHmuQhCbhkRV0TjBwq6EFZzK%2BApY5VIGlhwaM0SDM0Y7K5LNQucvKhpP3O%2Bo0T%2B86jjhl6oP3FVeK6Y2kDroekxYvxXEVrxHfOsrbyUAMLPU2mkitulwsTq%2Fw8WTxDavQbpN2JZfHy8xI856YLqmwlbk91JYglEhDuf90lNCLUkmGrru1fg7M3gSmmzqKKH9U3NFVavAiJSvwLkBRD1UXnrdRMNAei5mEgp4sxFdr258%2FrXI10at7NkKREKxTPnil4PQwsvjqzwY6pgHF0y%2FAQoKCeFFIkeImkm15LZjZwLOoRximwisAr7exhHjcSFjTlx%2BZ1JKOt%2Fyf6f6bIRTzh%2BGkMQ8GMGVYNHd92FK8jEw4ONmnh7VkqKEt2RMauW75%2BrKqst8w781r7zEvVEIQxsV0tQ8S1oFWB0Vq7ZRclVIlYoV%2FQr4%2FJ3PdtpI8XLJbSEs2wUJKTJFU%2FlCdCYEsnmMs8NtWD3JNUWlEHqC0qW1V&X-Amz-Signature=bab154d44c9a803241f4500b041ac0bd5eacf4729fed445717c5f830ba8a48af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VDCIOOMR%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040624Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIH8cqiXh8Jsr4to4Bpi9Towd%2F7m5GoBYKW9S7EM21Zk%2FAiAHUuBeJkWZ8wFYoPFabqZpfdidAI4WZGwtbBII2fpWWiqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMaxo%2BV7a1Ax5IFeuiKtwDw4OGTTWdCyIhki0fQNotkb9eGhpzi6hpFa5YTdlpOxXNRkrsSWjl%2B5s8OEIy9MED%2FZr%2B%2Fqn7zQv4AYIId%2BmUVvgAvkONX27aGrDuaGRCwWurKKCofYA4YvFDFFA9hI9rnEiEEBRnnPr1NhYWxT3ehR3pKsWaK0P%2FVs6chr6qfh6bXlbOlzetaq0KhVdYaWayvmVuLXo4vu3jD%2BCgyGOEFIQ13OreDpxrYh7FT8s48UaS0%2BukZ%2Fxv%2B91j0jXjVR%2FUqoZr8Ux9CIAFOZryyZ7HDReIJ%2BVjFk6S7vCakSmOhnfGew%2B2XFQIbMNfXPwMoWdwBhoVgh7FTwJ3CAI4Qg2BJnSPDebSfWx11%2FNIlyjAWtTN3HdfNkW3QeD9MBRk3tbZMXKHyi0ju2yYg5%2Fv0YehbvH6A8ljS3sKFFbugL%2Fr9gKKqg0hddxXmDIGFKcx8r3xMrHhl4bPTnE%2BA%2F%2B4tWqyDLQixJ4n0kIMQfZH6cPjhjU8ekTV3Fg1%2BUEnvrgJo7KWlt4swTJr53MFvQhy1zwQytpsxhl06%2F%2FUFpG3Ewx8FBUMaC4oMFiZxvyRsHHl3VdtISlsdg8GONU5NnYpgx4iCiWbzJAjzQl9pcExBnkDX6lU3dUXKC90ynuFp1kw%2FffqzwY6pgFfRsgJmeiwGzfLuS3s0%2Bza14Ike3ukNgpW4mikacgCZzsYp0vRLLWHzzoRErF4BP4LuTUboGCYHJHfOBnnBHmfj5R5l3CrS9nHFM2HhWfMa1gIajecHbV1zjW%2F61knC9B7XmZuoZ3Ud8sEhnL9SW8MWqFZpOcdkyxfvWJ1yo13%2FG2h%2FNiq8nZs8XaEeQ2ntonJY3jJESKLErhWh0X5l4Yaa9Tefi%2F7&X-Amz-Signature=c49ca0ef7d3dde28a4ab24654134ebf9e5680ae2272fb989ff3455c97354c7b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664JDRR52H%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040609Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQK6sFwZU5DhB7fbPVUsG3G3hSsk1%2F9b1%2F%2BndCbmX6jAIgHjzQtwnindtSCTN1Kr7Pl4W3ZQmIOuT8xsFvdo1iAVYqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ%2BCJnsxu1fBryXzpSrcA1pz%2B3DmyzjMmQKQm%2Bq2CNCRIqKpEUd%2B1gGcgjBVnnXsR27ucLOiaqxeldvpRGg%2FOT5ZdMcLveDa%2BxSlY%2BPf%2BFGT96O7xbPCgM1v2lB16onWztpUesU9V7yQ2NV96D4%2BeavzLFrG7r2WDYdr08U%2BcJlReAqD7qrv2%2FDw3ERIBzZKQwbN51ntPAzeMTN3qd62dujnwJM41NYBtEd4I%2Bt9uZmt8yH2zKDR24J350tjVTnr7t3AGmeOEYrVDbdglfoEQZ9ZyanPKV6gkNSWEiGKzWu4b3PKGBRZJqARWbFtfv3myKLLwr%2F9EjAv42wPm6%2Fww%2FjktAq98dFFwrNfmvpx8LTSE%2Bnet2kZYDx4WaGVl%2F0JfafWTLkV1UGC8e6oaK0JZsWmeuA%2FvyG4Axa8m0grY3Puz0Auj1rSDHAz9d8l8keAOedRrWW%2B6n8AM1XtNf07cOUB%2BIgWMJlhf2JByqwa53C99XUASocdHQ9paucWAxo8v7%2BhJzfQWfU8WvBOyES0qz1QKbB6pSfuU4bke47l17X1fAn%2FFVueOVbQCuO2oGErNVJft5DO21aDwJBc9Lbk77BtkbVM0BND5k9p4Geb6nWt1Cs7Mbx0MbuFRzpOoGsQHi2OyF6%2Bh3tx5fOkMOP26s8GOqUBXwCLmMIHBHByYBDWD0WqP%2FbGYKHs6ggthmI7kOwjlYOUSbnfSqwkePtyxaXji8iNtZtIQEWsQbmkpai4HRXEqQ016MWKrspXat3nt5lpzkdM%2BCb3bHse0PLhyFLmmP58oha947NmjQ09J8e6WM9KTa%2Be44T4MwiL%2BtXKLSJrvcXoI%2BGuM%2F03NkaDoqAbleCo2mm6Fz9WJqFU3%2BmdNwdsK0iH%2Bd6R&X-Amz-Signature=b484f2ba4457a537ba6de94f5e18a61b048101a1ab214f6e2a045c076562b1e0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
