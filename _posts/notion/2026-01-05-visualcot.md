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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667T2755M3%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024302Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCqfeS%2BPsNCcextYk6ZbXkHzSLcDCvqIIvUec7rCCfqggIhALEGYH%2FozCZKGmFDyQzW7AuFls6yzx8ugctjerMdduf9Kv8DCEsQABoMNjM3NDIzMTgzODA1IgxC7FJED2u1Sr1LuDQq3ANoi8rKAPsQvwimEWqbrtgSRf9z6v%2Berxj6lOmfCW7vDg7iInc%2Bs%2FgvwteIVkGQEglN8uEyN7Jk7wGn%2BDPJ%2BcxlKFt6XgUIZjVVoY5fLwSjiLkhKNKbF0bEEZnTvnOUVl%2BsMlfwAZTwXMf11Jv5mUZeZ0OWF4YifGMNQY6wf1T%2BWcc4MyLc13kW68M4KgBWZc3PpGElUCkTfAhCvnjQB4oN2PPfpRGgRb0L9JqjMw3YOet7GDBgR0pOOHL7yPfg785DHD0ahG6JhYtiG%2FsEHjL7DVdMqgDUabdkaF3Z56T6IP3SaEFpTrfqvrZPGsG3%2FbpUfKSipIxHsOXaSt4gt313fixnxxygp9qNCjKU4%2Fy1VsQNiDQ7k0%2FHY5wBdfKT7REkw1D5q0lkJzUm2ZnXkYDhbby%2Fo8TwaxLZ0q4xVMEOgz5ISwsRVfmtVHJg63YNTJsxrytk0uw7tRnoC082WRtM1e%2FTVAdwZbsCME7z7%2BQ%2BrJ0D4APOwL9n2yB0NIYqXRLaAFQIkSwGdjRXXGOwUOwsD%2FZYeuY6RZRSm%2FDOBV5W97S5KHGjK6Pq%2Fra1SyBfNQeoICDJU%2BhMsXO8yiZJzwCennNwfpdUNSMEiPididnNNLSHGygXkFEu8LK0FTC1lonNBjqkAVo9UqGTcaaUiLvqzoCVXyx8ywFakJ0079en8jsZqIFv2qT0G%2BgpWWXfu58acRzLYgH2BN3vr%2Bk8kqynMWwXqSFp1NsF5Ig6YNbKjEkadR3N9lIROrClte9747pONVWPyew78NDNfoY18kuUhJIhQ6D2G6g1LxWBH2ljGlxJIWW%2BRspsx3M7Xl0ED3tkosJJr3Bs1bQhsMFO%2BxAPNUK6b6%2FLe0af&X-Amz-Signature=f5c1cfb6c7fa1997227930bb7622a10c219f967f48f83c0153f2a657d0f51673&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WX42GVYZ%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024302Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQChZnHqii%2BJkREVMCeLjTWnj2gOoYSai8T3MuGA59AbgQIhAN7V8xh%2B3KOl2zYLWobUmifMzrazgZJHM3i22Bhz0MlbKv8DCEsQABoMNjM3NDIzMTgzODA1IgyqSyS0JjVsEuc0070q3AMEp97JS54nZ%2Bmf7U8tN8%2B7tUwv5TwBm7Wa50rTsSCO1ZGAIBzsVdstd5SGBiUGgk19uIN%2BEQQexbhht5biphcUwG25AeJvRjCJCYPlAyL7ne3Wu2R2Dj3nrhuszggscGsF%2BpZIrECpnE9djQYwpfX7F8QlwONzAkKbSQyiHAd%2BVEUaeUC6dmLQe1RglaCv7%2Fe75E%2BLFspPsiREjpSlhDRLjVmtgJeoQ3kneGK6v8j50RM6Fr18ir%2BlV1T3FT%2F2Bqx9iM%2B4bV3qYqDmJzl2U7SnzzEG2BBM5EC%2FxUsNN5%2BnHPobQ6OIwNPnJUHhKcWv2t6TSysvFCA%2FSYIdiNHW9qtN0zC7CYjZIeX0wodXW5ol4uhFBfPtI3WYW1tCtqZGwhneH4eaif0O4DuLVXqFUWkUaR%2BC93%2BOmMJf5IOUUbcCFb5k8KXiUy%2FK0zj46o8WGedBlFlRpfQ1K6U2H5IeP0lbZhFShuSwve8lMTIje0bx2ynSnt1K5VSztcTkDlMsS4B4o1DfgK5ExN7nx%2Ftwl3hKK492EndkjcXe%2FYqjv0KjrKzLJfbBzL53Peg8CaKeq8jiLWuWcwrqtPt7VKuy3fOS9PiBU4UFEHaEP0f9v6vBidxv%2Fqja54OMOxNcijC6lonNBjqkAX8waEuRfuCpEAFIbWkCGJpK6TVQrkfO5JvLzPia4wkixE04WGRbv4eTtisrGkRQ%2Bh40Diu%2BcL1scbl%2Fe8LZ6b1dWHQpUUe%2BCyZgLSEQjgLOpB7J4i7wPQjeRYRdslVSpUcEbTOBOa1bfBPVrlSfJXT%2BuUabcZFFAwJ41riB6AYixmJogON%2BcJ8b4zr9jOZYe4vsAvVDux2wiy6%2BN7cZojj6keU7&X-Amz-Signature=72e264862502af4c161a457ec18edb53823a17da8e0506f06d550f157697fa78&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663OJAFIXY%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024244Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGbxXooEMemiYiRfiuEIbKzWegbPnvFUQcvYThvVQ%2FxjAiA0jwHLvojAmgT%2FooM0dL4P4HDUwsCObGj%2FdqUccgBDyyr%2FAwhLEAAaDDYzNzQyMzE4MzgwNSIMJrU9VX%2FNVOU9%2Fui0KtwDF%2BvM%2FA%2BlEGwhlaWXtgXYWOWgTuLWExrv%2Bb6wM5JLmJFltD9NSJh4xufEmIOKMtzbHFBwnh0f6Z5awQXK%2ByS31GZnMQdEjkCPUotEoeJlhVsPEGhIQBPmMyb2riP50a%2B%2B8xqJnlwUybpQtvWSg9nbGd3oJXnnwsbZw02hzsW%2BZt8%2FcE%2BuX9Qd%2BV%2BiUpMziDAa2nwPJXYGJLmc9BqrJgAwJKjC7Xz4x%2BV4Xtc3FEUxBwyaj%2BuZEsCWKAtlwuzNhR7S5zmFirqXIwB9jekfM%2Bbcmk%2Bd0%2FDuGWFiXiRcQ49bpXj%2F%2FfkLUywR7Yfdzik%2B3QcXx7t8Z7A8z45wm%2BzdvG0xy3B5bX3PTWRDkGZLva6HBCm6vQDLpxCO9ysUdiX5Ex0zyna5dy76TjKfQixm%2BS6klEz8Z7LpSGgwm6ok2a%2Bm5farolNgBjhUbARjrlQg3lQy5yh%2F1qxIoUGekgS1wxUJP5Tep8qobA5bRwyT5%2Fax5yj%2Ff7euFWep3RtxZiS2wxyecfqT5zqslaYoR9%2F%2Bq3s1QlZmr98wGounVv1ihly0Y2KZvVM9btJkFYD0iacVuEbcVBVLg8xVQJ84KhWA2YPDZg6BbQl%2FB4vi5hIG856kUqUp1bzFytyJp57%2Fuu0wgpaJzQY6pgEBp8MfskbSLjsE7nVlOqaV6qs7%2BL1PFrEt%2BL8h%2Fo4t6zdOjgyTMckPHYf9a5ce6HKft8eNVL0%2Fhyd1rEfL6LILAoZ0Ymsorae6rlnGoZ20YsP0dL1RBVGZRP70fyrlA0lMkWXGVuwas5tAM2oN6Ml16lBJQAaj5ts2A0jElAisiwpp3cKI9P9iniBk0Uac5jEW8eR7qH0oGdmKO6OVi2XGKjmEeaku&X-Amz-Signature=e88a91f29c7a72e697b9334e290a4a2c8aabc9247694c29b51ee2d66c96db1fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663OJAFIXY%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024244Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGbxXooEMemiYiRfiuEIbKzWegbPnvFUQcvYThvVQ%2FxjAiA0jwHLvojAmgT%2FooM0dL4P4HDUwsCObGj%2FdqUccgBDyyr%2FAwhLEAAaDDYzNzQyMzE4MzgwNSIMJrU9VX%2FNVOU9%2Fui0KtwDF%2BvM%2FA%2BlEGwhlaWXtgXYWOWgTuLWExrv%2Bb6wM5JLmJFltD9NSJh4xufEmIOKMtzbHFBwnh0f6Z5awQXK%2ByS31GZnMQdEjkCPUotEoeJlhVsPEGhIQBPmMyb2riP50a%2B%2B8xqJnlwUybpQtvWSg9nbGd3oJXnnwsbZw02hzsW%2BZt8%2FcE%2BuX9Qd%2BV%2BiUpMziDAa2nwPJXYGJLmc9BqrJgAwJKjC7Xz4x%2BV4Xtc3FEUxBwyaj%2BuZEsCWKAtlwuzNhR7S5zmFirqXIwB9jekfM%2Bbcmk%2Bd0%2FDuGWFiXiRcQ49bpXj%2F%2FfkLUywR7Yfdzik%2B3QcXx7t8Z7A8z45wm%2BzdvG0xy3B5bX3PTWRDkGZLva6HBCm6vQDLpxCO9ysUdiX5Ex0zyna5dy76TjKfQixm%2BS6klEz8Z7LpSGgwm6ok2a%2Bm5farolNgBjhUbARjrlQg3lQy5yh%2F1qxIoUGekgS1wxUJP5Tep8qobA5bRwyT5%2Fax5yj%2Ff7euFWep3RtxZiS2wxyecfqT5zqslaYoR9%2F%2Bq3s1QlZmr98wGounVv1ihly0Y2KZvVM9btJkFYD0iacVuEbcVBVLg8xVQJ84KhWA2YPDZg6BbQl%2FB4vi5hIG856kUqUp1bzFytyJp57%2Fuu0wgpaJzQY6pgEBp8MfskbSLjsE7nVlOqaV6qs7%2BL1PFrEt%2BL8h%2Fo4t6zdOjgyTMckPHYf9a5ce6HKft8eNVL0%2Fhyd1rEfL6LILAoZ0Ymsorae6rlnGoZ20YsP0dL1RBVGZRP70fyrlA0lMkWXGVuwas5tAM2oN6Ml16lBJQAaj5ts2A0jElAisiwpp3cKI9P9iniBk0Uac5jEW8eR7qH0oGdmKO6OVi2XGKjmEeaku&X-Amz-Signature=f2a4f26510f5760d904d069b1b6b7d511ade76b816605235189d178ca232b5f1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46625YI4G7O%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024311Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHACB%2BZ%2BBjUFnu2T1piegUEqME17AM88ZUHULHYCA05EAiEA4D0VauTdIhJzADk1C%2BhX%2BEn%2Fakbb76f%2B6anl68lwa18q%2FwMISxAAGgw2Mzc0MjMxODM4MDUiDCy8WeBeSxy6%2BxDE0SrcAyDLODinNS9%2F7G82GFpp5FNx1mvcySGNoK8QLg%2B7sfUeumFPo6HgjEBsnmbTfELXtlxZBYN8CZT6fyNhuj2TYzNdzoCbi0h3QcKj7iF2ke90PObvJeFLOxn83FBkfzM259%2FPkvJS3unBsMY%2FdvC%2FUK2stZlMlxkDV4gdUj657O2shkd%2FUcaKeYGJhtWLJcERCQA1JWkW4g3vcVoV2CWqDJTCFbcxWJr6X2Kuqen%2Fgvpzx99FluHDrwPSGwq%2B5fy%2FiRGfL3FiNZEcbaAbGZBViFs7L7an9ndMJ9sJeQA2fKfhqVu93UhqrjwwKrv0%2BcBu4sOeyDwS32%2FTbuSh0loCRX2Ew5vEKyBNJBLX0ZFQcqe8DmqN0xx8hP3ul6KUQFdRcmkUOJQtvavgEJVpivZ%2BJ5Qc7jsdS81YE7qvopYl6X8bYhcSrVYDQKRMn9QlmCvf4NPJk0P9kkfzdBx6ehMFAqt3Rg8HK979Ku%2FdE%2FhkvtfkK2gfJjlAtF%2FjyAWWXxpHyHsV1c8Xrj5xPHjoKqRCuKlO2dZ88WdgiLHBTH7XDu59%2BcCfZE9KY4Wv5TLZrUyzVSHmAF5dR869fkytRJ4qdoR3375qob6smoZUeYqVdBu66G5pkjnx1vTixMaNMOaVic0GOqUBih8zpgc3oXRwaW6KlL0Yl3f1FqiKvOTJNopIyGRg8HwxDHTHdhbRo5lqcLE4A3icrbaFSAHZBPFZy9QKJwpwVeBHUwvkmHXQR1k23j6qZ2TU7GKMKxd5sKzwkwd58tEByWa4XUSbHL8%2FBAZtA29WuxO3%2F5HmRwi%2B0OVFSv5lKsyo2T8thZlY63rqtRlJSpHwXl6p1bP9okmaz6SUkz%2FxEY2d7%2FQU&X-Amz-Signature=1dea09982223ed67b54dddd18589b35f8e3392621cb8d1588a130cd6977c5685&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WEXXJPEE%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024322Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICI8j3NZd9KdNja5Ty82lf2QnNU2%2FuxW96xNqdwLhMTAAiA%2BhFCSi5dVRMgcRnL0RrdR6yFojhHiNH1mnhbUkQnY4yr%2FAwhLEAAaDDYzNzQyMzE4MzgwNSIMAGbwMrHRvY3TDRfZKtwD3ss48qqLfB02Li3ClXYeo%2Bw7sOTiCYYgozb5iJdbvq5IH5mdhEZNVypSXNbUdJpjSBe0E%2Fd50tzbBcgTnQwkrxnNnQdaonIADghjOhDMQIwhHfW7TklHr046PLHN4UogIpBWziytHytRkV0kL4tJn0i%2FWBHfG3yrMr6dmYqbiD0UtvdY%2FBokEyCBO8u1kBrzEnsO8a2dZXlUubfa%2B6uB7jDBGND9DuEsw0X3T2zx6YhFocZUNZtTP5sMnUvDLVbQkraQOlN4usW59yS0%2BnbWAJyiT%2BydlMzl3ba%2BTjR1zEcRQl3rPchyCvip0zisZLhp1txUNTkA%2B8YD1av8XUdtjLiFJWiEg5EmICk1Pn0UI7IxEfW8BXbs7UZ1X4kubcK1QTt6j8T8tdPVQ13z9t2hOU4eCM6Q5kFrd9ln8hYLoGrYqm7tbRe0pjmcGRTCB8jfu23UrAxACdWzFRk3Ws6Xkvc6r%2FWe6Rrp6FVaJkgmJnDTDrnCvDI%2BITQi1ImyXOxknwmi69vpKfjVa2IKho51Y%2BnBdClEFHMpRKHDj9L2HWPsguxn2%2BJEmpfMyKaIFt4iUqzUSBlSxJ%2Ffm%2F%2FnVrZFsBd2sKa6ECdfRC0azruhvEwQWAH4cIg0UiKyjsswkZaJzQY6pgHgX%2FAx%2Bhp0%2B66AkRI4%2BrGbQXm8RtLj6RB86HCnlfdZw2XRA%2BjwqhphlLy1YntjGOr0EtCL7NcorM1vsI1%2FSIms89I1y2UpggAJbrejmnNx%2FFK0oXFCdnLP97eQPkZMK1sOlg7B5KWn4LaGfof%2FRJrr3ixbpidc3INwl7fTe75gFvmA4fx%2BXCUKuzuk5brRPF2aJp%2Fn4M5qLl5IBDY7%2BypkUpyEjTKy&X-Amz-Signature=5860fbfa1d43be254de76556af688a0a1ba6c4985547d0d003e0efd821c1d2ab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S5XMPRNU%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024323Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEMN69sGVUfaKAYeWZxXZGNwTfHLzKhAFfdbAVr1DLDNAiEAmhBHhyt%2FhZRrvlnjkTSJhUe3MG7EAFuxQAeEq5Id9yUq%2FwMISxAAGgw2Mzc0MjMxODM4MDUiDHi1vHwiM%2Bh%2FgIDujyrcA5sYg%2Bb4LjlL%2Bah%2BDDNTF3zplybleaOwq%2Fu%2BbgEKkZu6ugzhO0IxIpZUExFOeRN%2BNwGNPureZLn10nkJXNKrZ83jdgpyzned4YEFVRm99q8VYgK4gavG7wNjEEAh2tCZ5Jz0ioAjje2JES9YezRGcdIOgfYBE6NVbG9FKCivDY1GBGKr1IqCunhdaPWbEr3brk9vbUs4CY7GKOphOb2ZFaldlt33QUSUOwN20S2srJ%2FkEAPVOX6PW1NdoaALNheX3iq5WX7DTyvCurgsGwZmf%2Fn8BF7WXAvaHmEHwwFwNlHGUeWKBMjNYCj87jjn2vgtyy1WQ8oJBqkxak93hBh4%2FUgNPh0dcjVCLP1uOcp%2B%2FmD%2Fl6fLk3X1TWtphKhwpM7%2FXpAPgwaXAS8uIsehXwor55%2B3%2FnIC3a3hBeVHF4QkF5Psf1fYfnyixMBhe2BT2ugoCz7%2FNUsl1KHW7783gkVPn9yU6DJNTv4h4Jjuo7q0%2FnGK5liukAOP0sidIYMDgfPMwnIsCdoHbRRp6OB60qwoBSx9h4%2FeVE72rWEyPAebSAR5hJDcf4MTkHnl7xmy5n6yDJRWX%2BV9TPtcuuqkc382yeo%2B%2BpvU6aEpmy3%2F84y3muCqnWuRYpOFjkE1uQFpMIGWic0GOqUBq%2BZkAaI%2BeGjcLE9zyezRu2R8rM4ePhXQvymtBxmDIxygsTcKfF%2BAcmjJIHnoq%2FkzXfo8UVmGf6HAq%2FDvBUgXECrDJEs2%2FghgsQ01QBMaf5FAM405WHWPPa%2BOIzCVGAKg32TyMzzvWls%2BEMjvqg1TZg6FqdDOITf5N0x%2FiJcmc%2BSCUjkeBzCYtCZk1f8BNk1IAThYGWIvsxmfKiLClqyqFQWXYvCr&X-Amz-Signature=77d5991883a38dce2acf73bf4318a0e300f64485c661ba71fd661e1f59c6ee32&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RTFYZEE3%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024323Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCExW%2F6Uar65DI4xThknux5RHLQD0YVaycz6iKFX9O%2BfAIgUiQjlJhFl%2Bi7u1NVXzAhPtPDkABYVDvA%2FjVLML3Q7t8q%2FwMISxAAGgw2Mzc0MjMxODM4MDUiDFG5c%2BTbvoTjfTb9jSrcA8ro6dEChZUAnwHqiyh%2FfWCbaPfT13edffFY%2FXXApb0CGJhqneNMCCrJDMYwhnI69LteISaQMWabegQoj%2FbOS6ctTXAQXvdzNTsVdOSERAJCfpaneNsqVWpuefQ8LYEUYvaKaSRrkVXu4mxx%2B3mPMehKPm597XAi5AARDO2lcETVQ2qLJxV5AZlMynbZW9SPHvB4TslVGDmvJb8yhK58ahqUGf3A00Fbdf7GZ7nId8do10C3m5oz%2FI3k1V76IBcnKr8Jgp7MzSr9bOWJ1aH5LWaNw6EZ7ilgOFMO2f20jp7AKshVYMuYgDCcUckvGunqIWPIfU0O6g0kp4%2BOc7ZBO2ZE1cmce6D5OHXc3Kmnl%2Ffas3jvoFXbCDUhkuqftUFFxM4f0YOuBb5Fl%2Bb03UI74UsVv2R7Z0CaO17GJfBpDf0dHmfxXgiNXTmQkqEQzdZ2ow8CKpi4AaI9CDA8YUkVCLC26Ko7oN1JO4qT%2FeY8qeVN48FiPvOMjK3271adJgG2TLYmQwfZm8LL5DptiRlKBht02wytoIKsXYNXpZlrvJOKNY0TjQCDrFXBapR32QCr7upCTx2dv0BuPF5HskwXL8usTwjoQUjJgCkSEctZBiY6BdDYbjhBOy%2FS6p0uMOOVic0GOqUBeTokg8YDzIuE%2B%2Fkziq8%2F62XrWNcEOjkmgVIKgahBEKOFdHOf%2BMKxZ3mg9a177vpXss3TbvR6o592Mx%2F8QVx9hRHBLqBFuigFLOCsZ84FlKr6ASEsNpArdREOfHgVFe6gs3V5d%2BGWNx4V4TKvT%2FHpYo7HsqIPa8rqqXjie0Etx%2BjmaJtIW75wQqh2JGwhbi2CVbitbo5DPtAAT9oI3tm%2B0vCMXqrI&X-Amz-Signature=293bd1f64231e038db60688ec86a12705f493d8c6e4ee338e6a535598aa92182&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666UK6OAVO%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024323Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCkr4kILgeI58ME99YIk4E0qv7AC5faM8JOSALbWeHPcAIgNPdmWShBJsVGPznZ4yUPLFlk8gc%2FNAk7eLpvPqM9O3oq%2FwMISxAAGgw2Mzc0MjMxODM4MDUiDOCguo8iD8GOWTPvgyrcA0%2FfDyr%2FHvSgGqVkVzFrpKXu69NMQO89Rk8GnXPnHzcpwLGU8MihrzJNgFIOrl3gaAr4rYW2JK%2BVIwJlwKiCvbidkCyKdhNGUhn1etdGdg7CR0iBQq0%2F7DddLuWOwD5Oy61IWg95SQABa%2B%2FSmbAAShUMMqFBE%2Bjmpl4XlCTqqQ3R7LvUz%2FVYzpp8Cv4ha3WU9a4lYPlvuLDIsqLhKne4wM33%2FNTzYpmP6GFzucldmeuCmX18yEYajhwIcovdODgwNkCRfZAs7cUQMgZJ4ARAzLuRI%2FR35rnaYgoUh0bRc9%2Bo88Et5%2BT5ewAMsOQmbG2P8FLC68m8JP5RH6aWyicK6t9JJQpVgmuKO5HQ4rWIYtKDBMZUIXcKK7IRegMoDMzoqbd22ny4tE2y1fyZvwAz4hqoFxczYe7wSfhpUMKd%2FynPx7fyi8586ZXbIo%2B%2F8dzgQ%2FkcIiGrW0YOy3P0IksNljtRvTlUKv8FUMI21gjuY6RmX46Mdo3Fi4H%2FsC18gdSPYa0zaHr%2Fb8NQJBt45wOKwoD9APPi%2F2awAb7eHycBfoEHuBCxWP09O1XAZF1xu2yrHalDAR%2Fb3%2FjYp%2Fb%2F8kgGNM%2F9nn2CVngJjnw83KzqaCIfPcYqm%2BHnzcg3T3coMKmVic0GOqUBhMZ39z8EGuoNf4KqEGfR%2Fkv8OxAi09DhwQaWL59zyVQB2NZ4HjTrPb44PkHTLOMtEALM3GxSBEmUewcywuvpfMak1JckgmOEtFB9ggUnx85OKi%2BsUS8NZz%2BFwMQQVRX%2BcZ5jHWDuMGEwURDlLXrpehhXLObFoGgyqUlp32KRoR4cGZla2YKEZpPYVAMjGXSuugNnV6dy6%2F6bF3MdYbmWyqX%2BgiLD&X-Amz-Signature=bd2dd65718d20789d7bb80f1dd17da0357be8d0fc38c74b111ee85d0691a0939&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663OJAFIXY%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024245Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGbxXooEMemiYiRfiuEIbKzWegbPnvFUQcvYThvVQ%2FxjAiA0jwHLvojAmgT%2FooM0dL4P4HDUwsCObGj%2FdqUccgBDyyr%2FAwhLEAAaDDYzNzQyMzE4MzgwNSIMJrU9VX%2FNVOU9%2Fui0KtwDF%2BvM%2FA%2BlEGwhlaWXtgXYWOWgTuLWExrv%2Bb6wM5JLmJFltD9NSJh4xufEmIOKMtzbHFBwnh0f6Z5awQXK%2ByS31GZnMQdEjkCPUotEoeJlhVsPEGhIQBPmMyb2riP50a%2B%2B8xqJnlwUybpQtvWSg9nbGd3oJXnnwsbZw02hzsW%2BZt8%2FcE%2BuX9Qd%2BV%2BiUpMziDAa2nwPJXYGJLmc9BqrJgAwJKjC7Xz4x%2BV4Xtc3FEUxBwyaj%2BuZEsCWKAtlwuzNhR7S5zmFirqXIwB9jekfM%2Bbcmk%2Bd0%2FDuGWFiXiRcQ49bpXj%2F%2FfkLUywR7Yfdzik%2B3QcXx7t8Z7A8z45wm%2BzdvG0xy3B5bX3PTWRDkGZLva6HBCm6vQDLpxCO9ysUdiX5Ex0zyna5dy76TjKfQixm%2BS6klEz8Z7LpSGgwm6ok2a%2Bm5farolNgBjhUbARjrlQg3lQy5yh%2F1qxIoUGekgS1wxUJP5Tep8qobA5bRwyT5%2Fax5yj%2Ff7euFWep3RtxZiS2wxyecfqT5zqslaYoR9%2F%2Bq3s1QlZmr98wGounVv1ihly0Y2KZvVM9btJkFYD0iacVuEbcVBVLg8xVQJ84KhWA2YPDZg6BbQl%2FB4vi5hIG856kUqUp1bzFytyJp57%2Fuu0wgpaJzQY6pgEBp8MfskbSLjsE7nVlOqaV6qs7%2BL1PFrEt%2BL8h%2Fo4t6zdOjgyTMckPHYf9a5ce6HKft8eNVL0%2Fhyd1rEfL6LILAoZ0Ymsorae6rlnGoZ20YsP0dL1RBVGZRP70fyrlA0lMkWXGVuwas5tAM2oN6Ml16lBJQAaj5ts2A0jElAisiwpp3cKI9P9iniBk0Uac5jEW8eR7qH0oGdmKO6OVi2XGKjmEeaku&X-Amz-Signature=b8c4fbbef72ce7f7e0b93c6034ec6f271482c43002639bed99927719e9dc8f87&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
