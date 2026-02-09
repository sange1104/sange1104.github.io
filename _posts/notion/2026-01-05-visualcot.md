---
title: "Visual CoT: Advancing Multi-Modal Language Models with a Comprehensive Dataset and Benchmark for Chain-of-Thought Reasoning"
date: 2026-01-05
categories: [blog]
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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662F5NOTT7%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032112Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCHwu5dmO5fI1MDJvN6GLfn0r4MwBPgJHhcdLI1QRVXpgCIQCdNxqQb4MAbvK6bawkCIh0dWIYo%2Fqfi0%2FTeoIQpEKSciqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM54nfJW14j%2FcZGYsaKtwDFWcVuJ0MHxdPdfAJ5TnE6lG%2BFht2tFqVMWdqWX0KvSzv7%2BdZPB4letl74gt0QIbhyLXScrStfFi4OYQy%2Fcy%2BkPHdHJ%2FcF9YMVuk3spBJvAqR%2BjDvRz%2BiCX5XufYJFoS9cOmQrYZ%2FeUqOfcRyGRUe1p6nKhCifSxwGfzg4VW7Ma8560uOolv5IBe5vVSiAeTq1Rfx%2BZPAvcj9u6Chymdow1aeAz5yWU%2F%2F5Ne69i02L9VO65HI3jGHsOyQ0Olt3%2BpNctLk6pNwoAN8cu6OTLixoUdikWMcx08e07vcXM8xf3TCON6Ryikd%2BZ42ydxjUXJhbg1IiC7VMaV854NhM3kUIAHuxpTX0%2BmiW%2B17H4iEZYSs2Ro4abtcPNi99CtTxt8bTX7dN%2FyeQ4NGrXqjrjejhn4mXrTX2zgdXuUugRt8Z4Vi9LGvMWI16ukSYKbp7gf%2FBtQidALfEVuNfaAxvzMSmCzLpqK30DyvNWGgnhG%2FTBcV8uDR1r0I4VyDiIneSRpJ6JkXQHvwPO4lhoMmIVGM9MCPCM9kvyHFzMOdfCj5V6DQIa3Q3vNY2WUQlo1itvRWc8tiHs79VCYrvXsXcDio09BHXHQdC83lRbt7%2FYiYWSzijQC637btfQC086gw8JWlzAY6pgEg6B4USzzvA%2FN%2FfYhpIMr%2BIr56V6jSJhbDyXpAYI1WR2g5SUKRYjgMgYhvz2f6ldeiJ0YtyKYskz3Fiq0RjzOLHasXYO%2BOO6cQaezuQkHOCfBZ%2BuIrAiJvlKDOe42LxZrrqnxuYCNZaEF2Mg%2Frsvt94P3cBn%2BsnyD8jC6mMh8qJV0uJe%2FgJI4WczJMTRZm8SoqubNS09%2BU9oZjFYE5HukSEw3NuE2k&X-Amz-Signature=d5c54787866455a7f4730f0cba2a5969dcfe596110f56bb5968dbd81ad306de1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q2OIPW5N%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032112Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCz8sMyuZUX96gVEpXbVbaZEZh%2FddbM3JjakYYwJakmDgIgP5wZkTPQCwgl9RiURA%2F57a2%2FHJXWziXNHBfAqjyF2g0qiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMkrXOyYGDdQLv80ryrcA%2FfsIYU9E8v%2BlX%2BAwlm%2FF8ubbj0oR%2F%2BB6QxihG57%2BuMC11rjgKK5Slq1XzJOZhXBjDEdT3btDoKeYM0L6%2BGErXwxpeV%2ByHdakm9zjARtk3vRsQnUaB14hKO%2Fjg16g%2BtQOUtRaN9QW58ymVBhRsr7BtRV62kqpcwoYGsyfcVkiz6%2FlmP4Xs5sFSalN6ow35Ke9BEa%2BhKVm9JdyKgYldaO99m56Gb%2Fx7GQfD%2Bepj1d3vH%2Fo29hXdBqV7YAr0oggVm%2BWxKVzWTy4gDzjflkx5ezsMbrP5aLBawEfx60hfYL%2BSzaeSsKTGqDMEo3B37YqJ1tFR5xGVlvJcCqf7MVk8aZ3h297zdnOteL9nrD%2F7yvI4jkOS3Fz4p6nXYvSlZciIMXCm0UwxH%2BN7P%2Fgqq1k4v4VJKyA0UsQf4tOjhIGqVBanC%2BteK2cq4QFQz8TC5LeiATo0GaS%2FH4XYFCbxGr17ftdFk1vFuj4tyBQDDK9cTrjzWKbcAssTVSl%2BPbhTEPJ0mdk5HkkGzygWPkUu8zW88BRAgcGVrei2DAJzdKbN0J0RB54BjVp6%2B6tNKnrqRaSXMCE1qjrSyhfIMJispMQ3JkQFTJPKfKubqwx%2BjqwZOhMNqBvAMnXCdCIpH%2Bi8eGMJCWpcwGOqUB%2FPun3lSDdCj%2F%2FHvkBCwx8enoSCTk9Zgw%2BdpUX4zagFQkdbUHyr4e4GAfsmpfLtdpHOqowT95UJpeQGtkpl3deERdBpJhsnSAISdKgW6T%2FqloHgqMeCSFWoirFCKX1RRwhvBm2L9cy7s%2Fm3CpFiD2eNZiFU33kTvtnZqrHLSP9pdczQ3AHcQMW0uMxrct2iT54OrxzH8JUSTB6JsSJ0UM0C6CNMQv&X-Amz-Signature=603631f42b7eb032a997b7d5d14692e28f3f4ee73e43c4bb99be7c61b183bee4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7OZO7ID%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032100Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCSyMtE6hFZJb0dETPOE0rP8fPxB8XrlbyjUIrJ3skdnwIhANA3AhYVALlWa%2BLzJ%2FgFah%2FIOthxhBYtEmFes16K1EdKKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz5smGuqbxn%2FCSJmswq3APCMfMevnZ3fTFfc8f%2BGVj1x0HH%2Fmd%2F%2BvTnJr%2BNcBUxgkvI3wzmcsQ%2FZvLVAmImfXIVfkKFHuZ07ZW9ZaidZLiW%2B42rHMt0%2FLvIoY3Dbp5sfUizZGBsQiXrg54G%2BAJya5DQ6JMw3HJ%2FaSjtC7viv41OCpkncJIzlyXssaImsbv5vbUTBIOEPx6hfDGhnlimbKdhOEwjZaA%2FN%2BJ7U2VYlkYtnuq2TLkVRZSWskTfJkNxdaex9PBtXB9ayEqLY2BwRNpJAM2XTcNhZ4qpe2D1rYryPa9Q7L%2BHbgLi3Xe6Hz46XHK5Ct5pmAlgiN%2F9g4n1ZDlzo1Ei2EFO%2FZZ9FPZMXwhSDuzXOsBWVoMRynYIutZxnEv%2B82%2FLTR25JAzm9lAuhxnoX53VSZmCkSdVJ0Js%2B0Tuiqs2QbNzGRihZzf0hM2dwrFYxNSmvdhjhCH1pIR%2F22ZCLfKuxhNM%2FlBcJ1n%2BKwuDobNPNQykioFoLOHgyfG2HGDrUzhnnEjaNanRaa0wJNBoPV5q12ExLR1NwoDfT2j441ZGd5U1fx%2FC1IOhoXpwnvR5W6Ae2rNI8dYpC%2BhQ%2F00ajMN0Y9nhoiMDKZz%2BmMekOkQUXuB9ahVll0Lnkyu0US%2Bwa5R5POIrpdz8SDDSlqXMBjqkAWg1jMPWH6Ka91ac3Poh%2BnwtBTinq5RLBBzGCwZ3wS87Zml376TQk11GQrFwSu1TAcuRF8LQnvZIWPXVFdWnOkTRxEkL15k0rgDEqtfJpifMzGqYq4WVmrRkOzPfKgR%2BURBAIkV5m7n4iawpbMqSYdADRQMZ2GkV19B%2FHRUXXxXUvLAIcEO6meNEHzCLpJZ3Amur2JRy1Hx%2BxIW4%2BkCII3%2FpUSQ%2F&X-Amz-Signature=43aacc9f66e30629503e12e1c1994813e5a5c20b8b6679fa47177e720ce336ca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7OZO7ID%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032100Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCSyMtE6hFZJb0dETPOE0rP8fPxB8XrlbyjUIrJ3skdnwIhANA3AhYVALlWa%2BLzJ%2FgFah%2FIOthxhBYtEmFes16K1EdKKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz5smGuqbxn%2FCSJmswq3APCMfMevnZ3fTFfc8f%2BGVj1x0HH%2Fmd%2F%2BvTnJr%2BNcBUxgkvI3wzmcsQ%2FZvLVAmImfXIVfkKFHuZ07ZW9ZaidZLiW%2B42rHMt0%2FLvIoY3Dbp5sfUizZGBsQiXrg54G%2BAJya5DQ6JMw3HJ%2FaSjtC7viv41OCpkncJIzlyXssaImsbv5vbUTBIOEPx6hfDGhnlimbKdhOEwjZaA%2FN%2BJ7U2VYlkYtnuq2TLkVRZSWskTfJkNxdaex9PBtXB9ayEqLY2BwRNpJAM2XTcNhZ4qpe2D1rYryPa9Q7L%2BHbgLi3Xe6Hz46XHK5Ct5pmAlgiN%2F9g4n1ZDlzo1Ei2EFO%2FZZ9FPZMXwhSDuzXOsBWVoMRynYIutZxnEv%2B82%2FLTR25JAzm9lAuhxnoX53VSZmCkSdVJ0Js%2B0Tuiqs2QbNzGRihZzf0hM2dwrFYxNSmvdhjhCH1pIR%2F22ZCLfKuxhNM%2FlBcJ1n%2BKwuDobNPNQykioFoLOHgyfG2HGDrUzhnnEjaNanRaa0wJNBoPV5q12ExLR1NwoDfT2j441ZGd5U1fx%2FC1IOhoXpwnvR5W6Ae2rNI8dYpC%2BhQ%2F00ajMN0Y9nhoiMDKZz%2BmMekOkQUXuB9ahVll0Lnkyu0US%2Bwa5R5POIrpdz8SDDSlqXMBjqkAWg1jMPWH6Ka91ac3Poh%2BnwtBTinq5RLBBzGCwZ3wS87Zml376TQk11GQrFwSu1TAcuRF8LQnvZIWPXVFdWnOkTRxEkL15k0rgDEqtfJpifMzGqYq4WVmrRkOzPfKgR%2BURBAIkV5m7n4iawpbMqSYdADRQMZ2GkV19B%2FHRUXXxXUvLAIcEO6meNEHzCLpJZ3Amur2JRy1Hx%2BxIW4%2BkCII3%2FpUSQ%2F&X-Amz-Signature=957bf1546d0c86820b0a13d544ee8e7cdb34cc00a5f1328951f5f1f9be3977e8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ROCWZP6X%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032120Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICxrsZdExUuHysyj1e8ERKX1lePgF9a5WS%2FOdIC%2BZmCbAiEAlbidaXjgpPGyg%2B1BxAWQQq7kp0piHPC2euQo%2B79IKp0qiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNPfB8iT7W8ZjFDXbyrcA9kFpk7gN%2BH9t9NHMaSeRppB7bD9kdKRFj7TEqeO8NwHxciJMXL%2Fyqd6xckS7QznvOczOl7JsRTGKXAsxz3qc00lMpBCt0VqZwk6lT7tn9Vi18fNShKH7D23zcPENIKT%2BDZCecbkRllo%2FZr9PCr2HrUM8mf3k0Pb59MzGgJuGR09hO4UbODjlsVc0yt2xZ0nTumom%2FoyrzTsNrwjPnHDiJFstwiL1GF6So2dUnA2eB6n7Oxso46DD638gcnHJPQtOimyd0NW6GlP9NpADsFYTA6wJMn78OHQtL96rAl6YE9InDPDsB%2Fb931WCMmw2qsv82OMunKnfs981bG8LMQWxUEuLYMvKvtuDI4MMWn%2FKq4m7fvGAR4xJOYx0hpUhc1fLfLsJWn9SqdsHzzttbFwpiKvclGXwdR8uQirziJK4ijLNfbR5ydex%2B12%2FrtPxRAcmdjqLB1zRc6BGOnq%2BEHzn%2B57icYskTne4MK0oHBlbYKwJ6Glb8CsMx5xVlE2pj3gq%2BJd8vI%2FG7%2BPeAB3WKpMoPM4MSOSWZ8DbFPSQR9FvF15VL0zdqiesFStj%2FVSD0VPGExE2PuzU7j0FQKp%2BLKiwqJqa2nC6Jaa4loZ2pYkU8VAjlv6FXk5Um%2FIY1UAMLKWpcwGOqUBGuLL1qPh4wX8SLbc4hVmhSBrJJINUUWHZPVrwrVr6DtcC9VCBO9soMagOY1c%2BtzAqVuHd6dpF%2FIt6GJj35VQwhqNhQopQF4pDAxq5blHI6IcxsLGkEbMNYs5ZLYqL5IV3nHmOvS27bSUpCym4JTJkMAewfrf3dT%2BERPs9wPBOOGkrsxIRjmkfgCXw%2F4G1Wuc6p4jfY3lP1h%2BAhhxPTeLJcViK6To&X-Amz-Signature=94a630ca8a117d965df5a0bfff2b7dde90d20e5789e2a46240d505021f1b8544&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BJH6CQA%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032127Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDPzX160D09aS5m2SvJqvwTwGsydCM6TRax%2B9UCBts2KwIgKt3mlOviJUbRfoo4gmP6UIFjbQNf0NqatBriGbPuDUkqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDG6PGf5VL7QPk12dfSrcAzbnvHEicikqk3p3Psdh2vaiamyv3mnBoNOv0vuO5TnKZYExbWkBogz%2FIdGAuTZf99XDR5I%2FXbWgZ%2BEsgIj7b9QcWG3I0PyfC%2FCStRQq%2Fr2zfemllJQL%2FUqxNCIfui29ykA7HoWiamxYPp8jF21IkVdCx4qcNxWRNCC63TwwJnoMSWaZSXAhIRrgKbvoxA2vWM2XW4RJblqjoywOTsKcFV41rfh8sLsFgPnFMBxc1kLPYLL68UDJJk25a0DSVQwvlLqeYHWEaA78P8WetDlU8awUiz0hC21mTclWylm2vr9Y66RZvGEuGWHsZ%2FG0T%2BxdrRR%2BCdt0OZYgxuGx8GdqnJBLo797CaCVawlkslfIaWfMwvJqxYRpYHzHpS%2BpAbNNHQCNGOIWBGzEI%2BZbLDltF25bPMhgzs%2F33gvKvvK%2F5pJcjX0VUaam3SIuAKUT%2BlDQnDEqdjnRMa9qF8m%2BWNizsZ4HEgeEgfx2uDHcxzAXQPEWp2u9eEIvTlqXOEwZXEi2r620H%2BO52jdZOHN4uQz%2Fi%2BBRPeGHOer1aJ87LfzM8H0ykGceqwSWvBLcziShhkhfT5dg5Eux1hHmPQuzy9toYN1PVX4mz3iF%2FGkvW8Av%2FGJ7Cwb2u2a7DFu7fg45MKuWpcwGOqUBhJz7WVpE7bYn8i6gaFBuaqSf0u1a3tfDC21n2gSoZx0mBBfiMYYrZPHoB1gdYVjXJjEehjfV1bdwZTGsSjAVts92PgKPoVebapHZ2dzqMmA%2BhGuWujNfED8iZYqeMGiKfWrtodXCfiHjOvPWRKjIPPu%2F0Ql1WycCptjbbigmGl6GnJQ13Jvi1D8BvZaBkifEM5%2B2Vw0iQNvEh38%2B6tBNR%2B6DqmLs&X-Amz-Signature=d02db66b712be9688e53acb5ece7529ae13f0ebcaba4976fc87f66cbd031ff5a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666CDBGCBA%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032128Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEUOvXQYWEkleTz4YpLzLHwOvxEY%2FbR%2FhI%2B0LY9kL0elAiB%2F68Is63ZLDEeDjbrqLkzhsODWaD3TgEi7zYbrNi1AsyqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMHxXjpPOLgTEyVbmYKtwDKv76XJDOhgiH5HdB7XZu1m2bvYyryfIfX5rhvuxfHaD1yjb95L5Zb6U%2BBXw9FTloJk1WodWuPrePuYQjwOa3IfyQAtimLrFGmutRU1zV0hlJtLJSV3Q6lBIE8lrOlJy5%2Fbv2qF3zQX1Z9fwxLbZmU6p2FHqcyT2V8%2FdbJ1o6fKKBqrUCX%2FDCkaSlwffAqqjpreWhmu%2FIt2Sb6%2FWT2e%2FTleiD81bEjpCrBmR00P8WJusmOVtGOzWxSx5WA2Zf%2FIRmnaVhdLvGXdwNUrhbm4889Ep1PgOuNKq8Nbt%2BjYrcrCu%2FSfyYqpC3OMTSy%2Fo9xYksA%2FkoVgw4U0BPQIiFmGJqWH%2FRoh%2BTpPyKl4chByshHSI%2BqgxVvSGb%2BK1p%2Fxl4u65%2FuTnYVDyRGwzXApbXPo7seD8F7pS6RRb6SeM2l0FjBEmV99AvQw74CNhU1ZzitHzCTZOGJ7XGEBelWOfiytlB5XzW5UJH1JVgZzAoJliiAAYMUHOW0nh77z4V9Np8EhkO7ijJaj94GnUr0d7Y9JZfwSQmn31n%2FvIsW7ln5dWLzWP%2BIYdi6CvYX8RVbu8oFSD%2FnBg4gbkq4IdzeyrWOsKIMsZmDdVK5LrgssHl2c7pE6ryYR%2BhEFiNYPzHmcswmpelzAY6pgFwHHj6T2iTRfRLiEePR2zJwD5IL74aPxAZiJUzi4niH%2B6IdHyiPady%2B71G2Y1zxSV2Op3xuWegcFKoz2f6Y16CmAvj81bVVjMq89SREm6McMNvGDMXxeMrwM3W%2BKm2SEwQYEkpL%2Foykr2%2FnVOU%2F5ohzHPBv5sR9IAfRo2DjCJgazVspqUhdHPK6skV%2FiWWURBqSf5Lj%2FG%2FcK6RW6bbP1jfATvixJDo&X-Amz-Signature=7aad5e0a9bd5c7eb3d5bfe290fdcfb51e9c590bf93ecd516581ec266ada20f95&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W6BLB4KO%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032129Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDpi0QLEIkGtBWieO5ZMtn2sjmHjUpR8bKfQt0G7bERlgIhALZkn2smbQ9K5ZrmIJZXCO9tBiVCetmetEH3wj%2BLK3ffKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxvzmcK5GIcdgMRqisq3ANhf5vPzir8fIC%2Fbztq1ryBJ6HGI2Sugr9hTTV4fvooLJRWcyLbCMGL%2BawEosxPRI6LDtKuShmFLwG9LrAS%2Fuy7B95FmcqiDGk339O984zSw9T5D5341PhmL6TCo7TzMDd9U%2Bgjdi9PSF490qz0dVgMyntodAMWkedaeWQd3L%2Bg1hPqJteKgTpTz0Bb739Fi40TtU46B26O8brdaoEe3WwwtBjLnLV%2BORo4mZ4QWpm0XnKgiaYbt%2FA%2B5Pn8BSWqcrqQjwaJwOwrjjmBsHe2T0OcHubxj6RNoyCVDVYDXcA%2BnpZC2FVc73MsI5KRyPGOM03%2FnXcgu1h3qGgjgA9DbniBAhx562Z%2FQlTyrCVUuDrqoWDJCRKFM3sI10%2Fgvedeuyc5vc2%2BWug3JdU%2Fx2AORkuSr790Gx8yNGYKik4eRzGTCHsuLfwQv6tv99SJYZLWy4%2B7IaizA9LvDIHJ70A3g7NFiAzAXDJ7nKK1XhEFwcOm6Qnam9Uns%2FxIJ8ZalWgWS2APWTwn0DUU9ZyfDQakHkQaf1aHOzv8cyYuSivuqXYQIEmHOeUhTL5qI4%2Fx6rRq1NV5%2FwV%2BELtKvBitR%2FtgJn9C2UOM12%2Ba8vubjtc0Bk1CwTxPsq%2BHc2DzKjgZrjDbl6XMBjqkAes2sD77jwtXIeoj795tvUjuy0qQcKdPh2jnBI5bFOkmaf4J%2FX2iMC%2Fwk%2FxpbvLwhOdekDkicgipTXTzGiX4tKaWocBpOrhFeit7mVdqUi6O6Wnupp1qHQAjpwM7uYWqvd0QIktuR76OSe2elB%2BFsLO0eb6J1Cm5RUqVnRF8POOjfJnSXtKmPDI4SdqrZk7pOvsA4pywzlCd4lg3RWDxSe84NrXs&X-Amz-Signature=260c200c5bccfca8f9782bc8c85b2ccab938344cd2a8b2666ff1f5c53639a355&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662HB5L5PQ%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032129Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBSoYlJlA0Qr%2BufIavfq7Ct%2B60T%2BvJ5GXltPvMjaQUn1AiBpTpuVDv15%2Brmd7V3qGUW0%2Fk9t7taEGSh0LuoK2S%2BoFyqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM9ZqztP%2B1R38Zw1XuKtwDGOLZo%2BHPVVmjacM28X%2FcVZltGOEH7V8%2BeFTa4g3CmTX%2BR09W8x1KPlIjSqxgMffJA%2BXTaNGTeN5bOKhbsRk%2FbWFIlgx%2FAa0FuwU4F9lfDrnPbehFjgaENxsUNAHQaZHMi%2FjVVU39JItiwIH7HPCkQRj2sedY3SI8A7tH3u68%2BsjD62AQvFJ1xK4PmB7EaT%2FgmRHtysvKQxcDElHb2yXIzc7LVkXJrki8P3qR9msw8YWJSk9r9UwtXVOnuuTtZuU%2Bmcr994lDB7Gwbx9iaFmttfUG2JPZNnH1LTeb6NV%2FQ%2BRKxar5cMQgZxw8%2FpeUVjWaAl6haPijbSfE5EiPbx%2BJfyIhNPJV0uzH1cbHipizsTzU0sUb1d%2ByXv%2FYMA5%2BS5cfd0OcyrDaP49bo%2FfNX7XHSYWEQsFV8bmuuj8iCiDzbzauvkiN8ZbUi6VraYe%2FjdTIJ4jOH2V17aHu1dQrUnvL2itlAJ3j03Bb7tIgVu8zEVuvfTHNKKUyrQtIAE2UrnCzYTG9Skf2S%2BMnEei%2Bq0TRQXK7x5%2FiHJ644imvNijkOka%2Fw5Ho1EEgCS7RY35gAf8JGKv%2BQQOY4wuhQLWEyIy%2ByGYvnCvgtTTUQNDGkvMFOKjrfbCIi5WbJMgSXGww%2BpelzAY6pgH3e%2FTSJ8sQD%2FNGiInIk1cMH9poyYprrIVIaKsaoLsWdEnJzHY3Q9Zts8mmZNq6gMBXkdEUzfzzDxdygG4AJnTy9Z%2FWrNgbe%2FTJ%2F%2BPcfYHmmG2ZRkueNrVtcWsH9o1UiNMEZoDJqXF15PaELxF4kb3FXfpekEE98kkWHFoqFFz7iXL4nfQsaixuhRD4v%2FqyO2XCw308JioGs3ysQ4rjoEAFYtVbdHoe&X-Amz-Signature=a2abdb43cd81f5d55946cd102bda04c56517ec56513f719532cac4f6c472ab45&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7OZO7ID%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032101Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCSyMtE6hFZJb0dETPOE0rP8fPxB8XrlbyjUIrJ3skdnwIhANA3AhYVALlWa%2BLzJ%2FgFah%2FIOthxhBYtEmFes16K1EdKKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz5smGuqbxn%2FCSJmswq3APCMfMevnZ3fTFfc8f%2BGVj1x0HH%2Fmd%2F%2BvTnJr%2BNcBUxgkvI3wzmcsQ%2FZvLVAmImfXIVfkKFHuZ07ZW9ZaidZLiW%2B42rHMt0%2FLvIoY3Dbp5sfUizZGBsQiXrg54G%2BAJya5DQ6JMw3HJ%2FaSjtC7viv41OCpkncJIzlyXssaImsbv5vbUTBIOEPx6hfDGhnlimbKdhOEwjZaA%2FN%2BJ7U2VYlkYtnuq2TLkVRZSWskTfJkNxdaex9PBtXB9ayEqLY2BwRNpJAM2XTcNhZ4qpe2D1rYryPa9Q7L%2BHbgLi3Xe6Hz46XHK5Ct5pmAlgiN%2F9g4n1ZDlzo1Ei2EFO%2FZZ9FPZMXwhSDuzXOsBWVoMRynYIutZxnEv%2B82%2FLTR25JAzm9lAuhxnoX53VSZmCkSdVJ0Js%2B0Tuiqs2QbNzGRihZzf0hM2dwrFYxNSmvdhjhCH1pIR%2F22ZCLfKuxhNM%2FlBcJ1n%2BKwuDobNPNQykioFoLOHgyfG2HGDrUzhnnEjaNanRaa0wJNBoPV5q12ExLR1NwoDfT2j441ZGd5U1fx%2FC1IOhoXpwnvR5W6Ae2rNI8dYpC%2BhQ%2F00ajMN0Y9nhoiMDKZz%2BmMekOkQUXuB9ahVll0Lnkyu0US%2Bwa5R5POIrpdz8SDDSlqXMBjqkAWg1jMPWH6Ka91ac3Poh%2BnwtBTinq5RLBBzGCwZ3wS87Zml376TQk11GQrFwSu1TAcuRF8LQnvZIWPXVFdWnOkTRxEkL15k0rgDEqtfJpifMzGqYq4WVmrRkOzPfKgR%2BURBAIkV5m7n4iawpbMqSYdADRQMZ2GkV19B%2FHRUXXxXUvLAIcEO6meNEHzCLpJZ3Amur2JRy1Hx%2BxIW4%2BkCII3%2FpUSQ%2F&X-Amz-Signature=4bc2fc4695196b8cbd9b792c044915fc51e5f239df35e9ae7168034b60aeaa7f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
