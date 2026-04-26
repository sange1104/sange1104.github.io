---
title: "Visual CoT: Advancing Multi-Modal Language Models with a Comprehensive Dataset and Benchmark for Chain-of-Thought Reasoning"
date: 2026-01-05
categories: [paper-review]
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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46637LCQO27%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035643Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDF%2BG7XxA5IIyDW5ZJgxDsvkF7S9Ll%2BwO6WeTZHq4%2BqSAiEAyh1mOp93rTbF%2Fd%2FnRO5bQscQ%2FUNn%2FUaf%2Fy0uEbjxUMIqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOWFq7ZOHMueoIoqXircAx6SD8oZmt%2F4Q0KTawffVZJNnapN1xT6giQtiQlmmTN%2Fis%2FDHQumEIPlPlT17GwvP%2F3JODcbLoKoRTaALqAz74JAMDeFFbJAIbPBTyzX6jqNQf3881oxalPggB3qWY7Yrm5hOOVSpeNHS2kId6kYrf8bhlxI23mSuauJ2XSIIhxMqFvp0hiQeBXNSDglFed9BiKHMS9Tf%2FCFFkEP%2BdqHNxJxCP1TvFQMSRMP0YvzssHYN%2BaVFvBnfk%2BiAAUL7pbB8C6GcbCgBY%2BtA7xsmyKMF4l%2F%2B9cUqUFNOlIIxisaMe6gjqeTE8%2FLUMTBK3aqlWo6uoz9qjliHjsUvi72gVP1MUkcofh%2FOXAhRtZmMDwtUvMzMMmng1EyO%2F4xWGbef3VtB8bWDMWDikjdFPlr9qHtnxxEV1xcA%2BvTSoJ22%2FV43Vd4OypFX3Oh0cbk0NsKwQqNjtp8HWqMVO4GVfVcuqA8fb4kIpbA2fDxKg0J0v%2BDL0CG9QK62SVQ8Q%2FZBN0nTl51AhDofbn0l8lq26BkkSUMuznwlldRLNnYM2PqzyhJKJWv4BnwpTsMqXbXFGfvmkzAkmkQYyPozvUKj9nhPHPZFcQ6HrXQbU90w5F%2F0F81%2B7S2LYknLX5dIfUcjd7EMPmOts8GOqUBQbt9nX6f%2B3w4piGUecwyGfIiCmACOxoc7mfKDec0XUjfTe7MYSkrRjo3g2426P1y%2Fe3qnTY9rVz1V8JmMR9EuXNvu9HlwRJrvuip9EaMsyXcp%2BvKxsGtEr%2B%2F653AqndSGudeqJ9KQdEST0YZzVdzU%2Bkg%2Bkb%2Fja6NSsSa4E0SAATgwRHZRNU3ZeUHNrw9GBVmnCpxU4jULjGypMpdQHdT4zfxOocJ&X-Amz-Signature=e03b7555f02e3518f5e3035645b42c6cef096fc01a2aeef6d9b3bb2a1bd558c0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LH3XZ2B%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035643Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCID0HCofIHYAXvbp8Beb5Ja%2BT88r0AA1QoSc224tqQB3rAiEA0eCawvMZ1CHY%2BSzBIm7XbLWxA7dbWD4yPSoMMFkpXF0qiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNK5k%2Fvzk4HgipzR5ircA7YVuvVXJKJtQa7eeRwcgEuugeeMTqGD35dpZktmkoJDl2ntX8HwceUt%2BI%2FwMYMKFQV94WczarndGgXZdDjz8Z%2B4khB9PkXY7i80TacRUUiDXN5a1iR1FrF0XCwF5BdMR1DgkgfewRaicuMDVDdxQys43dnVITxlp8WAi2kUGirj%2F8JAAZXD06BoTXilq7xWJ5XIrbWLWRi7qt%2FbTwSW6f39GhgQY7e3vmQVKzh6kOmqV65BieLQ7J4vuyc46SwJeFdzqScQ1sAF%2BIZGe1XoQOMEbaWkvlG7cvKk1MG2rtQ0c0pl%2F6CoCUmilKyHqY%2BgBU7zG1ExKrJO0eoqWyf1acmNQWhvFh8%2Byq42Lsgm2K%2BhLuFZfsxC3SC9j92cnzSnPrM%2BQ%2Fx%2BV4XGLT2J7HSAODDbpNhu31h9AAMlSj0hc%2Bk7l%2FcP6UySDkwtarsEZ1e%2FG7nmKGq4MWUGZnEO49Z3RqxT1yKg5N2L7JGuomP1BaE0ZWQ1%2BFN6VvZJCTSeUv%2B8Hfr96JGqx%2BHX1oGreDMopP%2FJ%2BDs7hGYOhG0fZA1fv3S4PrgKV3erxQYX1z8AgpTkNfmELiXq3eL6s5vLS1B%2Bcs5KqPHbpKgVDNzo3pbyWSNKxa9gTidrcULHiiIHMLGPts8GOqUBPoTfoDohgBaXct6jKJJCWmq9SAfkIP1e8Shukqg%2BdfaiMZ%2F7fT5NKMZWrxJLBrbWmFSMKvfCOKplLq%2BEJgWoD%2FLtt%2Bumd%2Fc6pXGSjqiC5yEOm%2B9DWbB5o6c9JzZddZhM%2BqkFXOpWTZDOf8HCFzyGqjklokap9oq%2FxSGYBdwiv9SohX43PcFpA6k7UJzHEvjaloNTsOhJGbh0LIKuwXql7Fq3nNs7&X-Amz-Signature=800ad3af8dbf58384d6f60eb7ec0ff378e92ca97ccdb92e450ed356d1b5b29a4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46647OMMAHO%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035637Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAXcrbIgzxQ%2BFznO%2FNDBew%2BLf3WtkEh9QHqh7rMR0j5cAiAjT7mw1s4GwYJu1tIGZdXz9NBOvbpgUBH7ElsgeZ35ySqIBAil%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMmnNon8MOnJPoDXKyKtwDhxsaXRiEOKKQ2ALcPi2RMTX%2Bw4S9KqrU4epaD8Bom%2F4A78WBSVdjCoBnM4ZHc8ruCbHbz3kkqPTrskn5xoXWfESB6TXreB9GMRs0yuM1eOPr8VzfCyEfFm%2BI8aQemMMf6TcN69vgDwNtMQAOz4x5SLbQ%2BrNB2Y7tzkwiLBYQVwxa5pv1OyEhsUNpY%2FJ3g41DT%2BtP10xC5Q8SCbOxpla8jhRn0GdAZg3FWCBY4ZPw7hmwR5FNnc1wReWJtqCdI8dAKo8mC1RGGGu%2Fuq3YnaK1rMSWGRS70NUDXjQE3uvjJR1fQv7FipZaE56wOUJc1vjtuaZC5741y%2BYc4G78OkJ60IZLgq0QPxVJuK%2FE%2F0d4pSoeW0Jjj%2F7d7b0%2FwdBjR46SknDlzggy11rP1avboHsJrXepKb2VgsTOI5qGMJpoda%2BQp9EIYEMUgYLTEJUEI8d8Du35VhqS0lmXo%2FtuHOKgtyH8pQH8AFqBWYDoj2yjoyGGFGbmupVj4HcPupTqS9x2QhvFrNMbkbtCts90HR%2BY2T606drjDsrZbcdX%2F%2Bq9oCXU%2Fil6tKv2s4kjH12ClKukVYYIa009x%2FE3sXnMzJpxpqQhOljMb11iXRyql7nZ9OomE0zRDsd7VrPdQyUwm5G2zwY6pgGuY%2BARtyeaaE32rT%2BJi8SlIPS6HBNZ36Teu8Kuw30310McFYIZuG7vc2%2FJy3qpwE2rH%2F9CbW4%2FPznKQoUkxzZSqHGZsVQz%2BBv%2F0O4dkydt0LhvcUMXCaHMT0SkY2BoR6q8D7EQBUrjdn2sit%2FFxR7yJUfwxHGdnvs1gNBol7SAD9d5ewh4EePkxKij15GBu3U06yHjCrTl5SxwYzBoAIYzzGI9tN57&X-Amz-Signature=2bb4f6d6de090782d502217f2d63bf7d675875ef44a85af8b03b69b186e6dca2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46647OMMAHO%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035637Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAXcrbIgzxQ%2BFznO%2FNDBew%2BLf3WtkEh9QHqh7rMR0j5cAiAjT7mw1s4GwYJu1tIGZdXz9NBOvbpgUBH7ElsgeZ35ySqIBAil%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMmnNon8MOnJPoDXKyKtwDhxsaXRiEOKKQ2ALcPi2RMTX%2Bw4S9KqrU4epaD8Bom%2F4A78WBSVdjCoBnM4ZHc8ruCbHbz3kkqPTrskn5xoXWfESB6TXreB9GMRs0yuM1eOPr8VzfCyEfFm%2BI8aQemMMf6TcN69vgDwNtMQAOz4x5SLbQ%2BrNB2Y7tzkwiLBYQVwxa5pv1OyEhsUNpY%2FJ3g41DT%2BtP10xC5Q8SCbOxpla8jhRn0GdAZg3FWCBY4ZPw7hmwR5FNnc1wReWJtqCdI8dAKo8mC1RGGGu%2Fuq3YnaK1rMSWGRS70NUDXjQE3uvjJR1fQv7FipZaE56wOUJc1vjtuaZC5741y%2BYc4G78OkJ60IZLgq0QPxVJuK%2FE%2F0d4pSoeW0Jjj%2F7d7b0%2FwdBjR46SknDlzggy11rP1avboHsJrXepKb2VgsTOI5qGMJpoda%2BQp9EIYEMUgYLTEJUEI8d8Du35VhqS0lmXo%2FtuHOKgtyH8pQH8AFqBWYDoj2yjoyGGFGbmupVj4HcPupTqS9x2QhvFrNMbkbtCts90HR%2BY2T606drjDsrZbcdX%2F%2Bq9oCXU%2Fil6tKv2s4kjH12ClKukVYYIa009x%2FE3sXnMzJpxpqQhOljMb11iXRyql7nZ9OomE0zRDsd7VrPdQyUwm5G2zwY6pgGuY%2BARtyeaaE32rT%2BJi8SlIPS6HBNZ36Teu8Kuw30310McFYIZuG7vc2%2FJy3qpwE2rH%2F9CbW4%2FPznKQoUkxzZSqHGZsVQz%2BBv%2F0O4dkydt0LhvcUMXCaHMT0SkY2BoR6q8D7EQBUrjdn2sit%2FFxR7yJUfwxHGdnvs1gNBol7SAD9d5ewh4EePkxKij15GBu3U06yHjCrTl5SxwYzBoAIYzzGI9tN57&X-Amz-Signature=69c68aa0d86e111920d0b43a36254464b791bc64a1d834ea8712ff59a9ac4957&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666LWPU2QI%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035650Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDjfLy%2FPU0yriDQwXlupEDRIRuqVmYMr%2B1cqh%2BdvW4%2FoAiBgZiTPQxFpn3cMDIkiptc7kGl2OmtVd%2Bg%2BIDhPexuN3iqIBAil%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM%2BmvX%2FWwhmaZVHd6RKtwDPymCv4wqirNpREoqDm5slGG%2B5Iwl1HysiiAdLVFejaenbOjLuaVfh0Q%2BR2rTyLpGNV2nqnU8jk0kQKhXPdJ2csitK4tknSocEA0waJGldfkI%2BfmYtZ%2BYeVQkHoUL11xGri9BpuvLMpNK1FF1Cy9XVvzzDnuUwrScNTHOiQT2ggku6A7ooJIfU8mqU7Xif%2FzPlbBN%2FpbhT8Zcl%2BMRtSbS5DEWoa99uIvpqiQxLpprC9hvbnvo7Xkjfg1GEFbA6mrVUwZ8USNVtgbSw8ywMIOZPTo1XLmpiJoEgx0mI94iUiCjbKdLfYasdMB3A%2BF1baVF7JifCsUiRQt9ok5ZbeI6lKIlfeDHgHBxQL1W8yNtFfr3dh6NBMdxp1mEz2XIxYZfEyjScntN5YNZbE3e8exJF%2FljpI8P9PAf8evbWa0U7mGpORG39tU%2BP3ManSiJQUrXzQwE7NSI81sRExvwP4%2FUw6L183flAD8CUtcfnrX1q9cW6QWb%2BXdlfaTQEMrwK4tcgwxkewh5tI3PsKnaHYknjwuL4eAXRfx%2FQ2FagsAZEd0MzLV2kgSqDhnIk88WjmleNXBM9dt%2Fc3d2ZaGproyEEgD9WaK4Gc1UWk0Qd%2FQpG58k2n7pdu3r%2F1KWgmUwmJG2zwY6pgEl5LMqxb3%2Bs%2BEoJkTXCROEsGbcMFqjYBQ3Pz7b1okxVUn7ytauxayzAI%2FSxgeT6yzaKy84m33GqW94dr9cgtQZWU5bbjfBFtcUw5XL9yUCWhanAB35awCjkYdRuKeXLp9jDb8S0JnZW0jI%2Fm7gqxCf5EqJZGPOJSe0r4rt5dW0AMIwsPIC2gGpytOhy81vCcKVRipPrLkjWU%2B40u9V5cPq6rBlwVDc&X-Amz-Signature=93510b1d924e7433dce7b6cfa7852b2ea830b309411f4f1caee076189bb41bd9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664THEOT4S%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035651Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICFstlcATVR3%2F%2F4%2Bu0QlU9kwY0opV%2B0u93EMOxWC5PwZAiEAh6zPTdENAaC4jupArwTK8LBQUjylWZcVHp4kXqwpWnMqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPRcU86XDdw21NCM1CrcA8swH7dKO6FD0emc%2BNzOigozcHaWJSJTqjKGv3Jxtwl3WiaUF5KiJL5NgPybjE1KobfYINlZNKeYAD7IL%2FxkHQVfDtWec7XBbPQ1xb9o657s8Ua9OEDWvQwFVaOXr%2B%2BGHssW59YRB9GdZKaSXbr2m5mw7U8QP4mYRgP0UzmpddcAqveea5ZBtrDW0imwzoxSIg0PCU5v2%2BmVpAve030ybMgSHoBg8b2129l4BZd2XhdKgQLTeDv%2BTTZXGL14powU8%2FAU5mBRUabFO2RaGo1tLKvcJTP4i5r20El5TVV9QPh5xDGIdxqfnLz%2Bbve6K9H0%2FhKqC%2FAyPO73UrMyTneiEZwlg%2BPLiWAaRQHqmpfO%2FdtRvC%2FctsTWaBNDaOKu03mGsQPLPNonbhw1JKPQcQ%2Beh0iijgLCALwD2HwW26QMCtWP1fWdig8MrbxFi9m3siZbaBOfqKG%2FXrYUmNHJo6oQUctMfkgn7DYErlny0fOWQEk3Uz2FKPDgYHFMzcso701zGvBED9xBv7YyXJaaQcfAGlqhcLtJM9B6qTOr9CUi8%2BqB0ZNmwyFKzyLUEn2gAPL3pPMPgf%2FwO8ijuQL0Q5W8Rd%2FsmvOspz7Geb2bWpWBiwrjClUyt7jg55G%2B55CKMNeQts8GOqUBWXwGZ%2F4un24PQ7HraMM%2FVHDag16B4k5CWE9X%2FZuwiyXbopNHyUQHJ2mRjnojDYVfMkgLCvf1bK2snN%2B0sSA41o%2BO7PtH67HbOhjnp4XoSR0OogIA%2F79Hh%2FFwU4%2BmC5gkTIIyBi7mCejn0hRE%2BKWsON11rw3WeSZe7wblELdmtsz6BkLylCnRu2QIYm1vuBtfnSs6cidJf92DzSB1rC0qaMOuSw%2F0&X-Amz-Signature=c0fec3f619ec80d828e361e8c2d0d6616be9940f186d579420ba33da917a7be8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667DKEQ2XC%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035652Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFasKfG2cKRljO9aCKG2%2BzVefcjZjalJ77pR2YSW%2F4wWAiEA742Xan1pdftI48bu9AwJq3K2gy%2Fw2ey030zBiBeUxdkqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBYgefJsNm%2F%2FUYzTqyrcAyljtElZIfxqqesnfqaa3e6AHpnr5SjE%2F8aM3FoZu0kXlgtbTfN3Cbk7DRdmLAZ%2FifBDX9vmA4uhX%2FamF3ZnfI67g0or2w9G5zhEQDMVmk8hOdJfdf7mRt8Z158%2F9eRvgAdZLqe52mqDWb3o4IKToh64akrHdVfltUsTn7Dd2B4NWkhZGIslfuqgQesqyv8chl6s1tmkWI3cL%2BL4OVRVdgnJucJjDvArS%2B1c0QkUxhThUHBvMVeL%2B8dERFXXspJBwl4ZhtL2v2S%2BSrnOZaTSOJlbRufwctedpUQg6ooJV0b50XeMGDjTjbNZvWBw7660ZZ8Xcbg4HUFodm6xhje6z3MXHjI2HiwptkZ6o%2BEqiFcHQrK5SkZNJWQIesk3j5y%2Fm85zuEw%2BOhSG9bq7FY3Zc7JbGpYVjfzRwE9YWRz183GAJ1UI%2BAlZKlILFMfaosR8UR6f12kdk1Rl05GXx7qhu5qWwYhGxRXcuzSVrZFOK%2FFvaxc%2FlevoE08FT1ORuuywXjaCOl0NaH52Vt62NLRW5x1NO85V2h8V2mdbLbmV1Jb6PXmEa%2BMZLgo8gvvsfMQY6fH6jps9m%2FBcU2v2g1IXM5Ov3Iv7tjhxYBl1wvbzDkru9nd0Yn7fpA3SL4nuMNGPts8GOqUBCxlUsJOgeRpIvXhYsP18O0ARasMLEI5uvry73lHHuP5Rigt9BskNpNF9BGVrd%2BDnuHCbv8j24BtsuAlbj%2F2C%2FOsQF%2FO7jvbHnnigDrCHpM%2BX2uJrNJWj006l4OfR2NVrW4xflo7LC%2B47mENHnQXKJuGoxmeLy7ih9EXqU%2F1S3rLJEOim476doTI%2BaXOzTqhdPw7ponWI6zuBGVrVFnGdynSrTXi4&X-Amz-Signature=8c0f9cae168258cccddcedc890d8817393d266ad6f0eed8819a729268558b0c5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666T5P4ZNF%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035652Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF5WKUhTGv11QNBC5aLalW%2Fd0MsVdjFUukfDpECqlqvCAiANemGG1jQt1Yq6Med5l3oVdv%2FrtJGT%2FHEXPpVh%2BJjLTiqIBAil%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMiHZcwKC6iSrJ3lMOKtwD4nKGSsG6imi66gB5GKzjjAqpkriaSMerVP2Y%2BCG%2FNeVc2sTMvTZ6pXTIrPBmuOmzBKeS9qisgs48TFE%2Fis54zMgC4t36TjR2n4xmYHO8z%2F3criwjFoRMPhEve8bXPGavZ0qLiL6zCT1E%2Fo9vuK9K3Pmo0GeBdj6Ze%2B7gYAqMjLIJIOrm5n1sV8zYAqd2Z34fRj8VihMD4%2BbtUjQEVcKO6qQdgzMR5eKEV%2B1WxWoC5YUAg68JIF8RPmOtQRESVQ%2BucwSRoJ7Tv2yQYZBVHpasroFTS47iruvH7fC5ne3%2BAsJIEKdocpJEPp4I%2BtmHNXIj3Hmg8UEL0zvl8J26dM1cFoLkbFXmHMrR9b8dZuSJjxJiel2wDKJVafFCh8o9XM7pp8cnRPtVERYkqlmBStrOwrtNR56wcgrtOgRnit2%2BVJH2wYllFShV6EnuK3uqIE%2BXEO08HWJDt4crgiCrNJfwiLI2Sl9bDwlci7Rz4p0J0thtBTIxc%2BZecCx3JCg3qn93CQ37hdDXaokCqPyIfJ4rD3GM2KyJ3YzXguTK9ljgNK8YzjLXIKP7XenJ2wNKgvwYQlH6v5kcFcc9Br6VZg9mi9LwwWpgbpRuJUHzJIsLXEkKFtg3oagj8Oy8lT8w3o62zwY6pgEQ0KKm72dQtevEqEHFkuY7%2FMmHKLCmZQqMNoVA74N7A2uhYHAK5A1RkbijvpSG%2BQJJkgFNq7Gu8enJPhW0MjI77Axyz55ZF%2BxxLwEXz7Jr15%2FNJTRA4h%2FHfXsftx%2FKDwT2%2BiOIIgBUdC6MplYfVtKQz761ZYWSMHHFJtv3h%2Bw3Do9CVyQ7mUhoMiOnxdNKLo7IFBa57QIfsD%2BCRtNTb2jtoBQjvnlX&X-Amz-Signature=aad3c033391f88199954055f2f75624d30dc8afabeed8bf73a15b17388b313d3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UBXH762V%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035652Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDyaNaKayjBrKhMW8YR69fuyOJu3KKzsN3I8QeZEQIcgAIgRMpMehjYM4gt1qa2C93kYJUZyerKa8wOUK0HrOz0hJoqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBVdHHG57lpHYIrTSSrcA86ITTpTh34OcuOSVdhCSQH%2F2OhJ5E94n9AtcwB2uYgvJj%2BAYaPmqDjeMNzSdL07Hxd06JXHSLuWhECf%2F3YyZMqaKGCesIRUhm4eaNJmQE5S89DnPbsAjmy8q8BeO4LbLSkIAhq%2BXAsCG48klD7ItDvUhdzGxGygvjirFHCJEMv5WQsqosTrimQ44cFxB0tbLjcogyYd4xshqkBtdyrjc35KDT1NaOoZyVXHmQBTzLdoqe3Kd4psHKVxnPf7IyXxG1LE2x9MD3CF3feiL64YqQfz2R7bRq5Tt6fnwS40HKGidreMIexC6K5ReAecZeZz7xyIyXt8Twd82ZAtdqYQ1AlL0yv5PxXyBvJj3I%2B3Kwg5td%2BJMYCt9sS2YaVqHAiKQOe8tIGZGBbbPX5IR4iOtolAax4A1hAfd0sN43ZJRuhv1YV%2Fg8T4rgmaq2butFWwA8BLmZAj9XMjBnsY1dv2A1raGNZVYTdEBb0mqp3wkOrpHPUqnxD8%2BUy5k9%2BAuUBn3WuAIEDByvjUlvpcOjnWP%2Fz0j%2BulspUkWBjWSgfW1b0MtSqY7wCPd4S%2B%2F%2FdpflERDnPWm4MJp4NRWQNfAscTfuEZ%2FUdySFmEna0bqgQDafbdVSL4HIUv7RDw1kxAMJWQts8GOqUBtlYtpUqHzC7XSiWh3ptGVVVTBaDho%2BMStQm5DTf8W9%2Bhne2Pcz3FiNIY2hlMocDKOsxso5TPMhnFNTIagbSNvv3su0b66qO7uiKeOLOfRFsqHvADEmgBxvflEUkmt0eLYph6VTgpz0EULsKXvg4Lzq9bMcz6P1jIHU1Z2rMasEIPHwl5YeykDoI1Kovb6I1aefiuUrTR6Q0lnadwiRdorrc0cBv4&X-Amz-Signature=27681c0e39168b3b677aa6dc02d25740401bd0610d7ca5673529021e3dfd909d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46647OMMAHO%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035637Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAXcrbIgzxQ%2BFznO%2FNDBew%2BLf3WtkEh9QHqh7rMR0j5cAiAjT7mw1s4GwYJu1tIGZdXz9NBOvbpgUBH7ElsgeZ35ySqIBAil%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMmnNon8MOnJPoDXKyKtwDhxsaXRiEOKKQ2ALcPi2RMTX%2Bw4S9KqrU4epaD8Bom%2F4A78WBSVdjCoBnM4ZHc8ruCbHbz3kkqPTrskn5xoXWfESB6TXreB9GMRs0yuM1eOPr8VzfCyEfFm%2BI8aQemMMf6TcN69vgDwNtMQAOz4x5SLbQ%2BrNB2Y7tzkwiLBYQVwxa5pv1OyEhsUNpY%2FJ3g41DT%2BtP10xC5Q8SCbOxpla8jhRn0GdAZg3FWCBY4ZPw7hmwR5FNnc1wReWJtqCdI8dAKo8mC1RGGGu%2Fuq3YnaK1rMSWGRS70NUDXjQE3uvjJR1fQv7FipZaE56wOUJc1vjtuaZC5741y%2BYc4G78OkJ60IZLgq0QPxVJuK%2FE%2F0d4pSoeW0Jjj%2F7d7b0%2FwdBjR46SknDlzggy11rP1avboHsJrXepKb2VgsTOI5qGMJpoda%2BQp9EIYEMUgYLTEJUEI8d8Du35VhqS0lmXo%2FtuHOKgtyH8pQH8AFqBWYDoj2yjoyGGFGbmupVj4HcPupTqS9x2QhvFrNMbkbtCts90HR%2BY2T606drjDsrZbcdX%2F%2Bq9oCXU%2Fil6tKv2s4kjH12ClKukVYYIa009x%2FE3sXnMzJpxpqQhOljMb11iXRyql7nZ9OomE0zRDsd7VrPdQyUwm5G2zwY6pgGuY%2BARtyeaaE32rT%2BJi8SlIPS6HBNZ36Teu8Kuw30310McFYIZuG7vc2%2FJy3qpwE2rH%2F9CbW4%2FPznKQoUkxzZSqHGZsVQz%2BBv%2F0O4dkydt0LhvcUMXCaHMT0SkY2BoR6q8D7EQBUrjdn2sit%2FFxR7yJUfwxHGdnvs1gNBol7SAD9d5ewh4EePkxKij15GBu3U06yHjCrTl5SxwYzBoAIYzzGI9tN57&X-Amz-Signature=0483d2588569ff6a4c341d14ca43ec17401dd98e86098b53d9bdf6f2761498d8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
