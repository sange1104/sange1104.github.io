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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZFFQ7CKS%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035545Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDYYN5%2BOYFMrqeN%2Fie9Joy4ZuXZ4CYVkHIGGSJMHMPRwAIhAIGd0k015Eo4CbjCmIr1rTsE0f%2F5QbSdJFdCc6tP8oqIKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwL6extRPVshqDzKpAq3AMIFIFE5qYGdvevx%2F%2BDNvRwKbeTJoPIJTv9HNYkf2WLYvodcwcnrgqwp83NeZd068uvNas0pA8y8GPAB45pPu9fg5K7e7mfE%2BDz6qzSIcgEV4vA2FqzE6w9c1lABKVanbULbWt3ab6U9LUjLjS1tghtiZDywR1I%2BHNlF6JkLRM7jT9mAdVO41R6qt8G2OOZxcBIn%2FW3ciX8WATNQwdpLrw2O%2BCKhFNznMpkUTcV3AkY%2F60xvR05b%2FJ2v2Qtdc3SuC9KzjK1Jq8RTPlasCaTwDpQTOfbJ6nizFh%2Bh0n0p1TA%2BE1XskSil3WO26IkhY7c14WHShKhTlGvQVBWfINgvqacWif75fld7K2No6%2BfypVd6x0e2QXDk%2BfIllrN7Lju1B5YaeJ9KK8LPpJ7jt7t2J6Nv%2FRTbI9p8ry92KtMPNfItOurlXQ6l1juwwxsrvAVEA7q28Dn9ZBM7IEv3J8efghO0xOhHHH02krNHaEEw%2B2Jw8Nonyajne8NRkrrXvtyh6LFfuY4GeUnu1pLn9wzp8Fzj%2F2kHpN3vk7pDFEtz%2BWU3eN5FNkvmdZoJ4mRys4ys7ramHgfpeL7FS4bM7adRfhfmqC%2Bd70hIM34gOt94%2BdZesPpIjNJpp4pSSO36DC1mvXPBjqkAT4yo6G1qtBy8ItDsL4dy60OCYACuxLp%2FGToXunROTqgqvAYCbK2L%2F7Otr2oA2s%2FRvDq3VFKXHfQCb98njZ6JD4R650tzkoo8QxlxclsWcB7POjKtbPKH4zcYGcGjENpbNMmLvB%2FOIJxrFXylOy6GUB%2FVm2SL38oC9ZZ%2BGAGUEb3JE85yusEEayGlFc%2BKNDjcdFKZdDvtKqjwsS%2BwAr2T8pUivDD&X-Amz-Signature=cb641cec9ecb23f624af67db995461e81c4b2b101790a3de5d4b42300c0246cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U3NBTGWM%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035547Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCK0hgg1aZt8L2s6bpwsgIOLDoSbdPNMfIzQiJQjTadRgIgM1BcJL9sI86ZT1NNbQyOOjLjgmuOH1t5Y%2Bu4bp43mFYqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDL7apHyKSAGjZtwV1yrcAytS%2BBI6sJnAwXXZ%2Bvj8ValrPhe2KjFKE0qT6gd9BtZJMpXsXDxOVw4IWy6jOsO9FHfJwg4SQsRqma4b%2BImZgibxIas8Aq840S6Pp3KgyBWqCTqSUYZF04iT2meS4xznBMOIKyk41xvQUZcQPA2voEcmXHT3v1FFng%2B38qMx17G4YCqxe8eR3zYbeUORfw%2FeMyzoOZ3gYV8uf9DzDiOzZnyxScAdasWU%2B42dnNWVxS%2B%2BRRL3isrMjuJ2GtHbqtdNfKijBKlPxNzyE9tqqb2VqwWQty4FaFuYm82khNTudaIzhruqHEU28VaFbx1U8wSUUzfuxunfsz7TZxbUelIPAUZnWAEdWqZBA5nGNILqzluSpx3sch%2BKotRdctTwUcIa3SGwYFpBm5McmL5SdzbIlQlA0USspXx7eEkbZeQ1AEVYzbvC4v0ehv%2FtvDaUvysvoXbF2OoOVg890umpgtPHWbpTBmqam%2B9cC2MRJ3Y8fNiMRHAzulNVXMB9kTw%2B4x3bonM2SjBFZvQiFLNFRpSPaHiQIS0Zl0%2B6vkL5QurFp0GvYVeART7j4UpMiENw1ZSKI38FZm2bza0uN5Wbcr430ukZ6xoitfys3tVYowpCNbgIvcYk5q0l3Y3N3KrrMOua9c8GOqUBzAxuqG1mXMVpjM%2Fk8HdlHyU61O39lC7APVDE6mnRXV5qLa8lyR%2F8Vm6xL1FuX06dnT0YF5VPW40roKISOiBU2OCyW2niiFwnoVDVvUGoJMEJgGR%2FFoGcn3DFIgJXmhd9suJB9V02G30PjlxFXeeV7Gly5S9TKPO8caBJR7cCrSuYwssr19v7eJSsxGvs4M%2BHSqlmYjNDROKZnw7clIW4SPKjEn8v&X-Amz-Signature=42c78557f5c8f7af141d9436b250032b2c733e4935c547e6c0a5a83a45d42516&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TSWDBXNP%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035539Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDmO%2BhQ3e9uFtHCPQao5cuf2a%2FogYA3L%2Bc0FAfxRZR8%2FQIhALUU7MK9wWUZAO03fiL3BwcwQYDCxAVfdTnJxskSis9jKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzRM%2B9%2FfNP774NxMI0q3AOArYvi0xe97kyLODowfGClZCGETG%2FThGAE%2F%2Bocc11wExm24lUeWfEdFWnoKslwVu9NjYq%2BKi7CEg7bO%2FlGdy3729JSL6PrGPtbHqoL7un1Dg9NjxyEj5f1xeCB9CaN5tiNNxYf%2B64k1R9uuRqBC120ZosODUxUridT8lm5vC8SKz57qSxOQVe2ebNttCHeZ0zO3HjA8vvKpcXNkjQJtb4cDvN2Pg2gclrHoOi%2B5%2BwXHUUgVK3l%2FUGfPuT%2FpWNRatSoEdbVB0P80FEGccbfZo%2BhMYHWXX5poKOiFatvHb79ZDB1vwMl0w8knH4O3tes5HanC8cDbLDCuJJFOJgu%2BSbkJOgRsqcDTMkp1YbbkXIjLZhIttjBShTC09LvBLpLQZKRTCkbIRt4x1wjGKCw9e1v5zlGe25TxOIo8Wseec3wzRBdJKQe%2FlKqjuKcfqOydHmbVBhfS33xaqufCgHCajQ5KHvwgu6nKMf34YSuZyvlBlcKMYy0Npw8Yr8WpWo1tKXeEMw7I9LbQ47HIZjLSaH5RFSax%2F6LrjPgdiv6DNacqV1lWnBsOwUixPaEd2xfhUQpSmmMXdgP6uGQ1MrV5QMLE2Z%2FZz6FfUxpLUV%2Bo9n1QPtbdN5Gr5ZIS1akszC3m%2FXPBjqkAYEh9hfe3%2BeALrWBZN1FHVT%2B7GYoz%2FzBkmuVMUcYx8d3SACEWb3ylIgbRjQmComLaX2AL6EAjswpdX%2FyUt2psyp2vdgdeTEFNlz%2Biw4MfVE%2B%2Bf7QwYCe3HW4JuPYs%2BJqDH4ghgJ5r6%2F418x4jfNtXPXhICvj7kM5%2F5VnHomPx%2FW9eFkjxYkqPnXRHXlunV1w9%2FsB6%2FZI9v5s5uV8W4KMnGM1BIOT&X-Amz-Signature=2b65d4c19084f1cac97d660c7062534613569fe662c098d450dc06ee4d450b08&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TSWDBXNP%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035539Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDmO%2BhQ3e9uFtHCPQao5cuf2a%2FogYA3L%2Bc0FAfxRZR8%2FQIhALUU7MK9wWUZAO03fiL3BwcwQYDCxAVfdTnJxskSis9jKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzRM%2B9%2FfNP774NxMI0q3AOArYvi0xe97kyLODowfGClZCGETG%2FThGAE%2F%2Bocc11wExm24lUeWfEdFWnoKslwVu9NjYq%2BKi7CEg7bO%2FlGdy3729JSL6PrGPtbHqoL7un1Dg9NjxyEj5f1xeCB9CaN5tiNNxYf%2B64k1R9uuRqBC120ZosODUxUridT8lm5vC8SKz57qSxOQVe2ebNttCHeZ0zO3HjA8vvKpcXNkjQJtb4cDvN2Pg2gclrHoOi%2B5%2BwXHUUgVK3l%2FUGfPuT%2FpWNRatSoEdbVB0P80FEGccbfZo%2BhMYHWXX5poKOiFatvHb79ZDB1vwMl0w8knH4O3tes5HanC8cDbLDCuJJFOJgu%2BSbkJOgRsqcDTMkp1YbbkXIjLZhIttjBShTC09LvBLpLQZKRTCkbIRt4x1wjGKCw9e1v5zlGe25TxOIo8Wseec3wzRBdJKQe%2FlKqjuKcfqOydHmbVBhfS33xaqufCgHCajQ5KHvwgu6nKMf34YSuZyvlBlcKMYy0Npw8Yr8WpWo1tKXeEMw7I9LbQ47HIZjLSaH5RFSax%2F6LrjPgdiv6DNacqV1lWnBsOwUixPaEd2xfhUQpSmmMXdgP6uGQ1MrV5QMLE2Z%2FZz6FfUxpLUV%2Bo9n1QPtbdN5Gr5ZIS1akszC3m%2FXPBjqkAYEh9hfe3%2BeALrWBZN1FHVT%2B7GYoz%2FzBkmuVMUcYx8d3SACEWb3ylIgbRjQmComLaX2AL6EAjswpdX%2FyUt2psyp2vdgdeTEFNlz%2Biw4MfVE%2B%2Bf7QwYCe3HW4JuPYs%2BJqDH4ghgJ5r6%2F418x4jfNtXPXhICvj7kM5%2F5VnHomPx%2FW9eFkjxYkqPnXRHXlunV1w9%2FsB6%2FZI9v5s5uV8W4KMnGM1BIOT&X-Amz-Signature=30593265d8a2e75f7b81dd8b140759e31ea81b2f2824c4931bd31d73bc6bdd49&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662NZ45LVR%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035552Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAhT66nI1%2Bq8%2BAT4aG8aaYHVHM8tRfGq%2F9eOmM29Mu0KAiBOcLfVSDjEdRNuH5QmbezBf%2FZorzEpBpCgWDOuTRd45SqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMhD0MIWgrAp0DhYqJKtwDaN54Mg%2BBmwQsmxfhZXPoJYNlNWlx5XtdDbxGaT7RMA2WNXnJ7L3vj%2FR2LdKxGETh3TNy2f0Vs0q2kw%2FbeKWwiH2w5V3PnT1AU0fboEeBlzj9V9kYKw%2FlD3SptoP7poocA3FCMixwjjpKsMubi2AO7Gw6HNyMqXJ0w3xpx2zVGvRthBB8MlYx7Xh7AHDDnPtdJPDS%2B6ILvDgMz%2BMd9Rk4pjdqOSMIBaqy2S3YNaupnE50k%2FlrIlKIBtLX48rkYcsS6vDgZIbh%2B4CasgBwo0blzO0mDPvtJM5kwAIKSMwHYkQj87KbiHMKNOUN%2FlxzgZj%2Bfg2HjF8Rq8ZkN3jXib1pgOuFsM6S6bUNub3%2B2z5bj%2B6s34w4s8tMkEjJpxUmJZWsM6qq%2FmYv9b6fIpdF0rgQRnqaVvpSCr%2B%2FeV7Fo4TEJs8a1EacGzpL0G4%2FFwy0moHvmsMZWHR3lGiCCEtAaVFz3WE3z9bJ%2FZnP7KCgvNicn966jFZx2iGwlAJzU4y8nQaUQ90HVYJl9Ot3D1yqga3vRDltxlbZz73UmoSNka7uMy4uO1S%2FwRKRSEGr5VRWu9d0uicNNftXhoGLdRTFPpnuKs6Gjw4i5PJCVoF6HfmaU3SNtBwp%2F4%2F%2Fq6CFmkIwx5r1zwY6pgFLK5NuAgEahX2YV%2BCbhIKUZxXlxJAngnAaBU1lN72rm%2BPZKpeCyirvjD1pGjwoZqKHPG6siXqG%2FnImw4r9aki05JVZBwyY2aVmnBzXGuyMC2n8p19XMNo4lsYhsczDfXjHBlqVlZ%2FwgeppKPlEmRBasejxeOOwKFqCXf4%2FFMPkorxwMJJm0QC%2FSm4iuYC4qbxEn73DL9AQsCu3JkJEZEodSrEzdbz1&X-Amz-Signature=49d3fdf250fb2795e2e3571e712b77d5e70b556eae7f411f6afbea8766772378&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667BLAGMJI%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035554Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGVv6o0As%2BWkqnBCBZGkPwHaO15f3UJuDBhdbPhUb4%2F2AiBBIJOav5ki%2B2a2CQRB8Nv0uniivlK%2BmyZrBjNFiIt9GiqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMsXELwB4AoMr4QjYsKtwDDXFfdCkY1cohRP1tdEYh%2FZ4Fhc2sX%2FwfMuCdtMz2M6D3d9sHP2MqFpucY2RCKpfZgLI7ez7qWrO5joG15LDbrGDkLXyMGtaHp81V%2FuC9O26xMjDP15OwaBVZ6etUx%2B%2BUDMf1nMJA800m%2FuIJ51i5Hv1NH2qm907eKtPk9EC7Rj8d1cL6nYvDCRSncHetHcWUFRHn9p0Fktp1eSEMmXBLVcjfK2cMgdgRPWSXREesGCvzDQyFjlPBBIw8hvl8mzAK8%2Br%2FRYJ%2F8g7B%2BB6dfGD5KlAQBMYfPs0UTaaFib3FaMDY3n6lprnubAFq09FJPRQaxnAzCJNlarqQcmaWXarGyUKbdrda5Zp2gePaIGNx0Mg24jKOjFzUq9ZrAve5ppclmD5yzq64inepHCge6wmwHtykIOmJOrHKhSCfJMSxt5yHreu8XB98J0mUcpgbsTttFW0%2FlYVt%2FLSZ7zSKvbcHnXh3r3xmA9gM6O28VPbxyMIDNWQwy3NMXO5UPZFlvoE4p%2BQ2p7yS928lrR7VqMXKhZi1JVJWXAYBQ6Fb%2BLM1CfhPZMGj96H8YgEUKbwao8eNGhdkhGEcEtkzn%2FP9J7YGPnauDcPlvk%2Fghr7lNhUq44HFGir34Ze8E8SAzbAw75n1zwY6pgE17kW9gy8jyh08VZBhBfLLYhO85VJrdHPEtg7pJ3I8vNcsaoac5sx8bCzWCeVAWPQjWw%2F1BtFW3wnB3zWKui0QlAJVMsla%2Fs%2B0gkWg8e47o8ezV3tbPJg5JxRj3TnwQeN6YijLfvq4AYAtrj%2B%2F06y7Vbbr9HpWBDWPl6kLIL20MVrzSqGWP6L%2Ft1GJlzZ7h3139%2B6o2KPqTpWgKa2XQWSUy4bm0uns&X-Amz-Signature=6efa8a8f37381445bb98e2ac4c5bb3d2f4219d6c4ae8c424314a16b9a1613fef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663U2IRURA%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035557Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICwMEwjXOjP8xOPQFJxg840QRgzne%2Bi3%2FCsp4QXFJOD5AiEA5uBaIezUO4gtDPZ2ifjScS0g9XQH6n1T3rzaJo8JlfgqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMYp%2BUSRai0Ck8zHcircA2U7rVZ19a%2BD0D5e22byjSgOXiHqUg4%2FDLyumKZXfQnv7Qe7nbqcfI7dVyJBWSxvBM3pV%2FbbQnjFDL0elK6ta0BnTced2rxPnujvggPgnR0eri%2FAsxrhCM%2BAywV2UtBKtcB222lWJm1oVqj3dQDgoX95%2BH1JRMzFkWEd%2BNOP1Fj7kw95LbkYIDP4tFca4UTfnEDM7dmZMSWezlUpNgAGo%2BiS4UVgpCblz6776HTLoPpWiBBROeZxXdfwiot22fRa5eT0nOoK7UFp8oOA8ywrVa99GTW1VNz6NvbC4PoVmrLwRc4itdWqvRhVaHLuZXswg%2FFKUhxnCh6u24CCiH%2F3Saa4ULy6vN%2BokipBiA3ivB3n93x6ukliOHS4RtyFwZWpCNC7Ft3769ZfnOXJYvpmqpNwW80elinuc0x2bqB0SceS67fHiqzTWmEru1E6zYTQ8yI6F2BFa5nU7jCpsLPO1JxUMXVvTfVvZfCUSSxNku%2FnFvQbrMp1ErjIxDTi1wFG5u4u7HMYlVu7FXtN2KtxrrWpco%2Bw0Z5Zz6RxYdkWWkYM5NHnUYOgrBJsr4Ce9ECxhPmuaJs%2B1L5yjlH2OvGeRx5qzhHLg6cS46jCJM77FhhlMyPlsQf9AwJz%2BltPMNCZ9c8GOqUBiYiQoBADcVqNliam24LlL8MAGV1Qlebgwj4M%2FyfSgxNLUA8tBD71fnw%2BGRnmdzso7OJ9%2B30tib4pua4LtLixRxqRX3Jy%2BBLWr3P9H1m1Wk6xHh%2BHRd8MlmTHIgkeJNqfAXTU23BSe%2B5UtcNPwITTxoToQbFNpzyMcXkHSwOXWpOIq5lWMfRoxbS6Ty%2FCZSyNsGik3Og%2Fl%2FruBHy9fWBAi1siKFwS&X-Amz-Signature=f8be0fbf7b1e56196bc1c5da96025ef6e66158d870541011092c0b2755e7f452&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665GKHYQU5%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035557Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDJDC6USFN%2F40TO5HnHKKIia50gTStG9BdIVjOZLy2%2FAAIgGeUf2daMHgAjlERumZzHQr4BuL3rkeL67OrrsyN9k6MqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKnQ18Y7rfgqKcn8eCrcA6QWDI38YNEOmoSvf3yiBk36UPPlLyhe5l1WRpEL5vPoioVdAcswSAYqzA2KaZIjEpxc69KTKz77KTFVlx7kAcckzm3nwkuNe8sUyeHirKeQNCe%2F2kCdviTIOzb1UFNdCRD5fRV9uPL16UzBG308rcvMcMxOwFx1GIllTj1oDcbCsPBrBx%2BEH1j54ZBwd2ZLRrU4Ni2jdgza73TKgfb%2BZD7ffWWbSo6XpsHyU6CcOOAdN7vBsgZg%2Ff%2FfUCnSJXurEcJcTSJ3TRByfQgNtX5AUFi4qR4n7uRQzxqs4FzRGT7TC%2FHnfmxEITQEnyipNhaJgOK4nHHxceVsbpDkwIkPxGCpYWbsMPrBDrMNYv3pOzvViFXErQfFCJ0mpYnJFUBVJKDCGjK6OQxymfNLc6utjwu1AhHKb6cJQOjARaIADgj8HtidsCMnzq6%2BG%2BzzNX%2BZUWuqiyCJFaJDZnY6CAciV1mmeNyR3d3%2B2M5rswhW8QLD4ugdVVZ55x%2BwdOBs1NUP1U%2FK60F%2Bp4MnNbrwBG%2FiJVev99THDU3rLt7bvOca3QnfXgQkDY04BmxMar0PRuDmjdlTRyCMhfHFRGsIXGvLmJ5%2FqCRpSCH%2BbvsYRRuyLsZmupRlIgakHhRMKoP0MMab9c8GOqUBniCRy8audAIPBEACT0Hrhy73Lc4lNQ8AdJV4gcpiBJEQw6td4By3kDHSfn9mvWkfcCt9N5nvlbcoPWCO1LQ8TnDporQOeT1YOJlv9ZjY7zYpJDLn98iXex3qfOqiKg2mF5va123G2ol4yVJcnLMYtPlCWTO9Qih7Nmvx5tS5sZR1kHYSeIggCnTq2VefpeUTEBfDyNiv9qW3rduUPD2%2BKSLtzHJ6&X-Amz-Signature=877497c807afdc2d8bdcbdf1f8997bf944e948c6e0d74798c49a255f38f2f010&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665KOKAWFP%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035558Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEgwVMrOGCh55Ttth3tnN%2BvE9q4Iyhfrnm%2FBfqS2WIuBAiBRtchyzWMLjzbFWwAx%2B8fcNmNZrLGbIkY%2FSDhX3fvEmSqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM%2Fd87vLf1PAIc4qfOKtwDeR2gnk3iPxLca4Mkg97kV4yn8C6eX26e5NVfbbXaHOFlQsSVH5wo6KK9H8Lav8ZU5ZqEZPckPybF7gkp1ViddliMsp6MYFyY%2F2jsS7zcDYWb%2BeaAV7M%2BMunfAtUicNxl9TPf1OFH5vBrugNi5FA5zkib2urlFFpSHvPYOzrSD6qnWSVVI3bnxrPqPYfUDZqDiNYNbheM3q4iafH4isWoVG9PecZGwb2kKUJ%2B45QhFeMPd2h%2Ft6Dp2IDfav%2FDBTebfJz0LqJX6rGsH1MwSlawjt8%2FNHiuGA7K9E5PkeXySReGE8z%2FNrUMJ4g0koHUxFwkBD%2F4ymsVlYplDuQ%2FQBUI6adUo4yET6E0VJIiclF8U7qzHeKZ%2FyPzWXEMEkaWKnfCuHAIzOwtjuDlN7sPTmusZ1dyVWC2ZMe7bmU2mXhj6oiF1Cms8Aq%2B9oKpZAar47jQpV6t1GoX4A4lmg7G8o2GaTD8nMCsAOd4T0XIBaypXo6o8sFVUO%2BSZzjv4NH%2FcGkcC2mziMvuzvGoO31DPp3P2SDAXw9WN4fcObL%2Fo8vvXerwO6X58I%2BjGrN9Y1l1v0UaiiQo9eXss%2BUjt1NId%2ForEfzzFG4xc8fLdQ3V1eNk9afqskn4HPb3r%2B3H2jww55r1zwY6pgG%2FVxo8%2FSCU1VPd%2F2loiCZ1v33jkbR8TAkKPkufjXTI5kBUwNIahAK2m9U6NY1Ges65S%2FwH%2FLDJh8Ux64nlSLTXQJoZtaf6K3MTF2oPwpEa7Opk6BnfrBm2Paz6U7hbg7GB7YHJf6uzE1RRmJlaK59FJcyod3rAZafs%2BcfQurG8kJDpyRpYxv8GhdGzOkOqRSrw%2FZFYn%2FYJ4l6bLCUCykJ%2F6czJOTOL&X-Amz-Signature=d45783d3cc4b4de430d693f2cad348bd776fac8f28a7163ab4fe8e71fcc1bce0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TSWDBXNP%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035539Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDmO%2BhQ3e9uFtHCPQao5cuf2a%2FogYA3L%2Bc0FAfxRZR8%2FQIhALUU7MK9wWUZAO03fiL3BwcwQYDCxAVfdTnJxskSis9jKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzRM%2B9%2FfNP774NxMI0q3AOArYvi0xe97kyLODowfGClZCGETG%2FThGAE%2F%2Bocc11wExm24lUeWfEdFWnoKslwVu9NjYq%2BKi7CEg7bO%2FlGdy3729JSL6PrGPtbHqoL7un1Dg9NjxyEj5f1xeCB9CaN5tiNNxYf%2B64k1R9uuRqBC120ZosODUxUridT8lm5vC8SKz57qSxOQVe2ebNttCHeZ0zO3HjA8vvKpcXNkjQJtb4cDvN2Pg2gclrHoOi%2B5%2BwXHUUgVK3l%2FUGfPuT%2FpWNRatSoEdbVB0P80FEGccbfZo%2BhMYHWXX5poKOiFatvHb79ZDB1vwMl0w8knH4O3tes5HanC8cDbLDCuJJFOJgu%2BSbkJOgRsqcDTMkp1YbbkXIjLZhIttjBShTC09LvBLpLQZKRTCkbIRt4x1wjGKCw9e1v5zlGe25TxOIo8Wseec3wzRBdJKQe%2FlKqjuKcfqOydHmbVBhfS33xaqufCgHCajQ5KHvwgu6nKMf34YSuZyvlBlcKMYy0Npw8Yr8WpWo1tKXeEMw7I9LbQ47HIZjLSaH5RFSax%2F6LrjPgdiv6DNacqV1lWnBsOwUixPaEd2xfhUQpSmmMXdgP6uGQ1MrV5QMLE2Z%2FZz6FfUxpLUV%2Bo9n1QPtbdN5Gr5ZIS1akszC3m%2FXPBjqkAYEh9hfe3%2BeALrWBZN1FHVT%2B7GYoz%2FzBkmuVMUcYx8d3SACEWb3ylIgbRjQmComLaX2AL6EAjswpdX%2FyUt2psyp2vdgdeTEFNlz%2Biw4MfVE%2B%2Bf7QwYCe3HW4JuPYs%2BJqDH4ghgJ5r6%2F418x4jfNtXPXhICvj7kM5%2F5VnHomPx%2FW9eFkjxYkqPnXRHXlunV1w9%2FsB6%2FZI9v5s5uV8W4KMnGM1BIOT&X-Amz-Signature=e75f5807299caeafe8b4af9fc2c3d73056ec1f796a733be050207ad860d3fe13&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
