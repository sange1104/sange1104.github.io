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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ROU4KVFU%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035229Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJGMEQCIBFYvdRV2ez7h%2BT6KlRr8AhmtJC0O01G6hz0MylC6OV7AiAokWCh%2FtU8dUjLAldq3ADYVch43lcelvX2ziWgknNmmSr%2FAwgTEAAaDDYzNzQyMzE4MzgwNSIM4EY6vfPQr%2BfBnuO3KtwD%2B3L4YBZIDQ1pXw3RWGi%2Fz%2F2Tx1QlF6LhdCrnKAMuOZU%2BcSam7BOR0OnPiM19NsDzZqF5He0EptNRazs4SjbA8gQY7huy7%2FBubn7Ig%2B6RSmFDEfaWNKvSf%2FvHwcrh2Lsjb25a93trJ4i8W4Qt8niiZ4YMjX8A8v5vLmTwHkM9J%2B%2BNsiXS%2Ff2Uj%2B71X61ICIWK7G7EgxZM7ikfbZHvpKdQjdGMypOuBv1yHSHYKE%2BQaAhCEJ9HUkmy22Cx6JPCE9ZwTwuhUTZO0E8js88wzmvd%2FP8bCEZbpL8cOO8UTuboKHJnH9kzhGLRvJjg8aQZ80PAzg%2FQ%2FFaU6i%2FQPlh7lBhKO7wNTVDzad6itu3FkncXtpoAHpBciYbOgR3EuH5Vnxy1ipecwAI9VUQrkjNzYrIt8bL4yfaE91d5PQY6FknCGsaRp%2Fzd40XXDTSu8wVh2MAoPOPGoqMCmIuXVbOx%2B5VDBVJWN%2BgDO9zFUjHqp8C87kYNUg9bTjrHFTu3xD%2FxXSs0I3exgcYV33qfWWuj48mtQU0Z8y6ez59S%2F9YSJkzJXAWJoxLi7Yznvt7kOEEYWZKKYIzDqb1fYF8qpEj2aH80AxZyN6l0V1TVlwsdRC6Yj5Dzat%2BY3oCObRFQo2Mw25eWzwY6pgHOT9JfrQFkU1hobn%2BV%2BDGq9zGuZrmtZzJV6y7lU8KeFI44FY9MD6WKEnoRMFLQqcwTAfd9U2HGZ0r9G5yyYNhXc5bjN33cicCwqkSP72Dm%2FNs%2FKJ710%2FFxIbvHgF8vvtGTsE5kQGV5T5vj8qvl7eax4vtVM9vr6bv8GeNJ9UPeoC9Bbuqt9ng4Lo1%2BhEcSr1sHkVcpw9xfnppFVlDpNmEJHNVixqhm&X-Amz-Signature=c3befcf0718ca781654722984d8d173323a86a7684726acd6096101aea1878e9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3GL4GRF%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035229Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJHMEUCIQCC4HKPAYRyBtbH7aNCK4uw6Ge53Qn005brOUBkYQVEjwIgXXMZloAKHD73bzao4HwJcPhdFCI0I5gP06%2Ff8YzshRYq%2FwMIExAAGgw2Mzc0MjMxODM4MDUiDHsHnj8BcUAxwXLe2SrcA9g2FsP1JxoFOS5Cdlgxz%2Bs6jWAnKKBRj2woJ9lU3SsqMiLDZ7%2FUDJmIiCM3W%2Bs0MCYztnp%2BD0%2FKiMSOIqvXbcmPUFmJHeQlamhSYAc2Fas4uNU2WpwPNmSP%2Fodcd74iAaDR6QPOEQNIQtlYTpSui7OPRFkrrH9gO7IPMxK7o2ip02Q5rmWKF1NNH1tlVtHk5D3JEry88UN0rjQu636PpaDckNzgJ8uBz7L9ERg1ufMESRUq5awXl%2BmGH4fBV1uY9j2%2Bde1K6YXWENj4WgC5hMR60MdSNx5n%2Bqb2xXrYnqh%2Fba601ynocZaQfE1nxaaIKIAsi7XXQfN6l1M%2Fz35%2FjUugM3jq20vp3aTYs5I0S%2BGirMkZKay5nJNTNaEWEBUdkhPqdL5HD%2B6QOGMpAS4kvq9Od%2FdnO%2FXNkUo%2FwELNaY4HR3QEZWw9YuQod6sKBFBaIC4UAdyNt4gcExq5WqI14mcAJ05xhG3ZFotaHzfVA%2B%2BYBlg0X0cljgXvRWaNZPumlO%2FWJF71CLuzu6ucNmMZfqPS7l%2FJfrcsCi3RVQAe4tQGN02b%2Bs4O5bQaIYbGz%2BXla7iOTXA5VWZsD%2Fm5%2BjwSwG%2BHjZepP54dvgOHHroJGE9VBK7dhp%2BLtRXRY86xMIiYls8GOqUBg9g3cWcdvkFWP6PaY0nf%2B5IbVBZt2TGE5BUHlAecSfmKWsVhSZjt8e87uLyejs1YLcAlWphsrQKs6k2wP8FFCnqqzKLk%2FKgHH6F0ptGX%2BVZAmTT3J%2FjjOT361dbOhL0PgRS6XcsTzyGuKYPtu%2BYr8f%2Fs1NVsKtu4QTSkU2yZFN9kn8WCjBz7tFLHrDBdp2gBs9zo0te8gJgFE62ZYrnrgM3pcicY&X-Amz-Signature=dcefbbb64b8b05ff287e0e72347fca07baff5b1d317479bd3e19fffbd8ae0524&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46627ISJO66%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035222Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJIMEYCIQCAwLpQbdGg05AY3MXcmslPgPKRC24E4APay1S8wk3y1AIhAL4RVK1AkjruBk6Rcfm%2FgvIXSo%2FZFWOSzwvQfiVSPi5yKv8DCBMQABoMNjM3NDIzMTgzODA1Igxd8jH7KBtseFj8Pggq3AOh35lkXgbUz49QvDUTVJ3cEwrDoOmievet%2FNLpuXTYmSoGBe0lJjwKKApWJ3SGSSQgESR%2FduhiPq4mymDbUA%2FDSA3DRFzSGjfhvLXS2VKYR212mbBgw23plRGP25ZHv22pfLB8x717LLagTX%2F4JFgvzSqr0LkOZg8JIRXWa9yHSgiX42oRbLiyD7C75jiWUCkl%2Bn55vUF9z1c1%2BaEOVdyD8Gom0IiP047L%2Fj4PvY%2BY06JhrAGj3AeuJjqn21yfPVROyK4kUaP%2Bsjd61JuigOUf6KRnW9Lw3gODBsuIjvCRY4xSReYT%2FAXxVBIkHti0bCWCdbg7JUymIjJDbAdXnUV50RivFC%2B1Nx6ntzX78lm8sX%2BKudUk9pkA0g%2F3J25fALlEBw2T6uRBZwpeoBvZAc6HlHKUUKxW%2BfsH8VYTnVYEbJDn2GLLLoRVXOhrWmUu3H3qAV%2FW%2FV94Vk6xhTn7LnGG9nP7hYgGJOkyda684vYfyUSqCqJidMiWlp0suHhGRsGy9g3zhozWM6%2Fy8SqOZNIOcMxdSL8DQ2vPNSKpO%2BHVWlJJ6Jap9wam1l7xEshs77USKMS85Bw1OSScCyNLVb%2F1EvGsMn1U0VDVADL92PNeqL9Vk5EqBZSzslNH0TDnlJbPBjqkAaMqHB8YvP60rhDnWvQNcw7nAgxmM9lks8BPdZONtbnqsFrU2xUEP7iksWCh9c6uZe6GFmhMAB5%2BKYaQz3hM4bXGb7QI3TyKCxFb5q0ZZeRkM%2Bt9Opsi9wFcd065RRH6vF%2FO3EdHTTyQ272FzWPSQkq4TNGxtpP80J9Dic9YDGQS3w8fKh9ehKrisuToucnhAscP4E7yKgSApS4TGrB%2BjeMOQUtL&X-Amz-Signature=d4e86b72d3364661c1934ad25e51cfd01278a8a542c0ddcd39a461fafaa4fe1b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46627ISJO66%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035222Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJIMEYCIQCAwLpQbdGg05AY3MXcmslPgPKRC24E4APay1S8wk3y1AIhAL4RVK1AkjruBk6Rcfm%2FgvIXSo%2FZFWOSzwvQfiVSPi5yKv8DCBMQABoMNjM3NDIzMTgzODA1Igxd8jH7KBtseFj8Pggq3AOh35lkXgbUz49QvDUTVJ3cEwrDoOmievet%2FNLpuXTYmSoGBe0lJjwKKApWJ3SGSSQgESR%2FduhiPq4mymDbUA%2FDSA3DRFzSGjfhvLXS2VKYR212mbBgw23plRGP25ZHv22pfLB8x717LLagTX%2F4JFgvzSqr0LkOZg8JIRXWa9yHSgiX42oRbLiyD7C75jiWUCkl%2Bn55vUF9z1c1%2BaEOVdyD8Gom0IiP047L%2Fj4PvY%2BY06JhrAGj3AeuJjqn21yfPVROyK4kUaP%2Bsjd61JuigOUf6KRnW9Lw3gODBsuIjvCRY4xSReYT%2FAXxVBIkHti0bCWCdbg7JUymIjJDbAdXnUV50RivFC%2B1Nx6ntzX78lm8sX%2BKudUk9pkA0g%2F3J25fALlEBw2T6uRBZwpeoBvZAc6HlHKUUKxW%2BfsH8VYTnVYEbJDn2GLLLoRVXOhrWmUu3H3qAV%2FW%2FV94Vk6xhTn7LnGG9nP7hYgGJOkyda684vYfyUSqCqJidMiWlp0suHhGRsGy9g3zhozWM6%2Fy8SqOZNIOcMxdSL8DQ2vPNSKpO%2BHVWlJJ6Jap9wam1l7xEshs77USKMS85Bw1OSScCyNLVb%2F1EvGsMn1U0VDVADL92PNeqL9Vk5EqBZSzslNH0TDnlJbPBjqkAaMqHB8YvP60rhDnWvQNcw7nAgxmM9lks8BPdZONtbnqsFrU2xUEP7iksWCh9c6uZe6GFmhMAB5%2BKYaQz3hM4bXGb7QI3TyKCxFb5q0ZZeRkM%2Bt9Opsi9wFcd065RRH6vF%2FO3EdHTTyQ272FzWPSQkq4TNGxtpP80J9Dic9YDGQS3w8fKh9ehKrisuToucnhAscP4E7yKgSApS4TGrB%2BjeMOQUtL&X-Amz-Signature=40c19814e54d7a3387ef66cd06e98cd96a60d237b872d04969275dc129399e09&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662IKYQEUA%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035233Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJHMEUCIGEZbfVEedRBhs8qlcYZVdw%2BMHz%2FDsFQTGqiJNVG4bD6AiEAlHQi28mfG7kpGZ327GA7RkDOetkyHWw89eoRyAzKpK8q%2FwMIExAAGgw2Mzc0MjMxODM4MDUiDHLanylzzdU2hoCwGyrcA9lWAu8OVfADAx2OQHSvEVEWh5G2imG%2Flq27dhWqoXKhEts4KX7d6W9jzLeuJByPnxiPCkKpcQzoMI%2F5Re7bIjmpvjyz1N0TQX4FnvipqBIUndFZZDiZrftlOGbJpXhXkhRKjXnOZXw2nV0r9y5rvg3Mx08tjRPFx8R9O%2F1itgPbqZfqOSJ9FVWCnwRHyAaHjbYmPSRxNtdHcZZ6Vjt1d%2B%2BRjYU%2Fom5HeQ1XTc1yv1VwgxncQjj116gDQXlP%2B%2BYxDwWNHh5nd540oW50E8k6KOaStQHRIaXhNbdS6vEuFKi%2FNtzk%2Bm1pWe0zoq7Mf0lnSGqiSdC72H4Sp3n2%2FDNznLkcXwfozVI5cZZ1h44ln4msGqD%2BulsWVdQ3Zf6d%2BWKmQgUT0alJNmtq1u75hkZjoQoHx8smLOYu%2BLVLtkSJDB4XfSWA0UCZORTYhqGSDShAhI9eDglfNtsvNUpBVMNzup6EflQlMc%2FGtRukPMZOSt5LJfoFglzqwYxD96LIITbRdpQffo8da%2BDCGVEnxTOQWTRftegDq6eXtm5hvvJXarfBQ9lr2r9jNuYeor5fTXGlwrGX%2FtEjKrlY22aWo%2BjzXtM4XCAxSMCyMVbreadz1zLziWYxoN2P3Yfbd5AtMOWWls8GOqUBzqoq4gZQKfWvorTpIryJPn0WqymN8swE0PnmbysmIUMupZt7ZfYAg5odmenllrfs%2FirN%2Fnxm%2BfxN93ULV99UeN32h1Qu0vrG9tqsh0bVsJSVcMg9qGvPDt5qFOjTxVsDVD%2F%2BPEOGtHb4TqJS%2FQ%2BcaNWWG%2BQJwceWcDWNJNxGkuIbrJkJmixhn4tGTVN%2BDbR1U6j5LqEMJES9sdY6OuwmUT7SQ9cB&X-Amz-Signature=970b7ff2b31920ba143048b3c4ef57ec78a31472bdeae0d8f9cb1faa0523a81b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V2KMBCWM%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035236Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJHMEUCIQCP8h%2F8SuQHASH4%2BwWQ0wLwgG4cgC7BW%2Fj8897s3BxZYAIgGeKc%2FceVIdQpzYQWB%2FN73zmXF0hS4efh87ZFgKc1PDAq%2FwMIExAAGgw2Mzc0MjMxODM4MDUiDK%2BFlVV%2FuhrvZNg4iircA1l8w%2BW14GbxToITZs8wDpmuE8z0wdKGdrrdpWiXmVm%2B37CAsjfgt%2BWNh3qGApcECfaRjwFVJ2tvHuUaTApps8XTDfr4zf%2FBGNi0fMSLUfZiXAl06UFy6lIiRYR3%2BF64Qv%2F8mbZmbGSM6RwcBbgF9Ij4JgDLCXkLIG2Zm3h5tDgwLV4Z0B6Q1CWrKsGrC8ZQY1pZnA9ss5xxvhg6qYNafMrYHTHeugTb3GtTLBTgYzEfWbrEuT4lCyhCH4erLUGubaPzu7YwgII6sAMKIEuk7UUWFVonNu5%2BfXPpWLUaqp74lPCfdNMjvCjahve6eeoDin12YoVgVZr9%2F7PX%2BZkz5rfHbLEh0Psazt%2FEREKPhOcXS23Bep4wB%2FWI7Ze3rHBVUnJd3LTDdvjMzzuuWGgbSfS6PQQ8fgrvz6L0Ip2b%2Fys6TXQzO7CJOvX1FU6AXbia8S73nK6GKBbNH5aLZifqoJOqjSlAjX3gHgwOQ%2Fp0GhXx3AE0mj4Hd4SDeDrcs9JvmT8R%2BPgiJmh2cGcH2hkJj%2BxDnWoh3U%2Bohj6Osfsu9DgcZxXKzJ13I1WA0jG6xtUxJVmmwSy26W4vFHWW3tA4shlVxyFBcUBbOtrpEGbtSoI6NrRq4mzjzx7%2FMJW5MOmVls8GOqUBS1VXf6s%2Bxk6jAanSUVP9TSiSqIIKOv4WkqDfumeu4wzfMUsQR2Lizv4eiukjZocdXB4MnUxZMUTwvzxBZuixz3R9w4pqqOpwz%2BGWF587jFULnaagARTc8Kb3yh83dw5W%2Fj4vfoRdk1c8kzhrZr%2BQnm31kNhQerySkNe8jwhJKjVVJ0QyRImuRBs38FvJGAWLFP0TrUU4QBalE4csG7LeVuG31voj&X-Amz-Signature=f00279e349bd644d2b906f05f3346e4877b184891286b705184469877b3dce3e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZF5KXSE%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035236Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJIMEYCIQDGg5XGjZwL95k68zYo5h9dVZFKdDQKcNtpEcUc2TdoaQIhAP3o34jGsmLqwLx3S2zdz%2BzT09FiaeSriZHlkB5Qzti8Kv8DCBMQABoMNjM3NDIzMTgzODA1IgyR080oB%2FqGX3aHuZ0q3AOuLQgNEq5B1wXtUyuieRJkAYCRUuCuDHwLrUegNOunAB3GB8CZLVCAvtwKMSSgozIcDaLQtpETV1slXylhcC9xJltYFdD3goyfNNV7HS35aV5Co4fs7dXdtI2mDuXp3e4ZFRu0pnyoLf9jjChoNrOIpe5UKvrGjayr3DCnxFkFVEQvdg5AdJ3QBsdxHnFFkWfRgPTmaJdx2Ws3w1dSRRBw1JYcroJrzyMwOfoBfCRHZJA%2FZGul5G%2FyXWCPmV85GHSwKaPOMXRGfFbJouiubBH%2Bg0uchgXgAI%2FL9O4Rc%2BA3EVIsNBBImEa3xFem43k0nHwdDthxxIevCiQbBLa8WltwlZigy0RoPHNk7eNMqC1D1QGjt%2BMmKBG3PvACQiZyW7Vqum6m75MBJE4xzu4TtXGVK9cOLt1YAhrd%2B4CTTfr%2FcVk11CjH7Esdm91JlOlzM8xdETOcBG8h1kIscQbTcgPZZDaQaFrTPRRWlYj5hjyfTgYGrx5CnEtiv85GBnowL0hlUMdTZasjd9blNwlNX%2Fl6wi4CTWca0NOL6zyevm36tglkGjhX8u3k4yqo8rVQF52ki0aqDOTgZ8RDmU8OdKfdEnT%2F0UwmpnNnoIOLR41L5irAqkrJMNUr908%2FAzDklJbPBjqkAeo3IVE94optOqVY7SF3wbGdR9cIhNMsy3YeKW%2FH1nt9yqVY5WTf6k6psKNgcsaRawEhHMOZEzINJ5qsrUkNtqNx0iMzesO43p8mUyxQBQGzLu2OdQ3w7t9ir1%2BQzRyGqIgUmk5Fvur3snhKcrrzTC7uA%2BoQgoyBP4c9fex1G%2FvmU%2FZjnaJEGIK2nKzQiD%2B3a84rQQ0H9JABEh8butEPLVuHPCDf&X-Amz-Signature=48f80553f4bd685b79230eec11ce3d1e10c3dcab0e668a20e7bf7cb31ebf23f0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QY66MASX%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035236Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJGMEQCIDVG2hoXDypGXjIWtw8ZE%2FMZDhC4EvjPf4jwnjNvimagAiAA2lQV1q9Yg3LB0%2FOfNFXBCb79BFAhtHrZ6Igw7hF73Sr%2FAwgTEAAaDDYzNzQyMzE4MzgwNSIMNaXbBd48nrjhvGC1KtwDGNBWSW%2BGayP9WT1ciFkXiB8egpQDtnTeV%2B8H55lej%2FgiCaX24nrKwuHPoHFuWE6QSaTQdDZmfc%2BhPAShgYbJUKcXQxkyVaGTp0IwjyhZQXcD9jGSFRY5IyaiiAQ9uqVkL2P%2FJv%2FOmJ34ZtZ7RDaN0GhBT5dDpqk38jtyLU3Apjh%2FRDSyEjqy4J8pELqeXAiABb%2B%2BJuRlCWLLVouotxtJ30WB%2F2wLLwcLTh0Hwolm3YalOMctMT2IATx0iAs%2BNlBfSaJA0eUQM9I2m7tyPQA87zw1nRghRasMPk%2FC3aQDuqwdZs1hJt2%2B1LFTekC6GGQC7E323j0fnwRJpGFA8CJC4X8XKRTzVV3UqTbtMzkmuK0gTqKPJWIc7ogT%2Bv3lacAEyI%2Fa9EaegHrdt7j3cxAyin3YXCtkaZCDwUPYMNi6KTOyZbXh6qpogbdkB%2BAwjHcMKZZXErEPBAYpPHVLKhBR7pySs1WNQIunG2KZtSiq9tlOz6rqJ9foDgUiMO%2BUy0HAklicxkerFu62XtXT6u%2B5tFuR3cxPCKPhV4OsP1HXZys8mYsHKkWAZLILXGmp7%2Fm8eR911B3N8FF4odbsGtPo1Q13q8Bz0SZMRanUU49nx9sgYuozNjzM1ExgzsswmZWWzwY6pgFSZ2qJTSWD4wJ0wNv%2FH5IQe8iFtF0R1lS4UazkiTmPbVRPceASIL7wHZFhHL7QJ8JV8lrGKfQ9KPSmxOfgkYWgV1UDw2ZC0%2B1JxD%2FsEBeAfnBsBgJeSDGcAgEl0cfXKenR6oEN%2FS3Hzfy20gskG12MHIth9iQuRq3rTvOK9X65Jxvpqkl6RrGurYmgp0v3sO8K4sDQiesMeB26xMEZOxwQS%2FMvIFe4&X-Amz-Signature=638a1a70018daf25b253d709ac9450901160da33d5bfd32ef47a52d2f207a4af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UR2ADBWM%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035236Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJHMEUCIALXW6Xyj5J3W6wey94ItjWi36rBs9d8VqQWL8XbmLzgAiEA%2F8PlBXUjpLXqbC7bBDIx2xw5ii5skfn4gxY%2BBLK%2BhVIq%2FwMIExAAGgw2Mzc0MjMxODM4MDUiDAWcewflwbExp2V2QSrcA9pGEzshwQlQTif0FgFOYcwMdd5%2F2ncyTRb8PqH0zTD0rXNMC6rLmvx3sLk4GBNkPkfgfwS6SKtX49iRgSFJBDSBBjFM56SzU3IJo71H%2BE8XAvTuE28VR%2FOuB2RgkDjzB9HHGsMFZ05EbNiEU9iTzbOqyfwP7Z%2BCR7fFev39PcDSuf8qrVVQqI5qO4s5IERysO2gcZAT7TRHtSblOn56G1blgfmXZyDszupGkNt3NB4JBP1%2B%2BcGZ5wqcWV8L5pElEqQ1IrjDdvKBMKY37EaILM3C3Us1xuLrCW7PntQHbDwJV2DGs%2FPR%2Fnu78PSGtVd7cddEitHDkxR5Ij9lr%2FeVpVKZ3E4sWPAS%2Bbm48Lq5JHGeeTJp2CWPdPSb%2BOcv7DVue3PUkS5jI0pz8UvpTrnn8L9W5vJUZCyD3rKpJzKv72enidkuR1esCie7T4pRwm1fiPbDPkAXuUndSTJOY7yf2kzxXfujUaAQ3KIkwNg5AUecj8RFWJlX1NcBBOuHqrlRK8krZg6MK51I7aaOqJoU2mhkU7sWYRq6E3itYIBjtWT2Of8FOgM5%2FFgbhWfgxxm7AaRivr0MYxROMNR6FHwgYMDO6%2BIpmedjrN11ByEBgIUOrol8va%2F2nDvzWqGPMPyVls8GOqUB7rpYO1VxgXLDKRHTHAJNisBux4yluOlpA7c%2BjyZ%2BZbcyOIBUR%2FdZpX7QtumZIJMxrzJaym7DNRVCO4EXAud7wgiVairZj4wxSBz1a5m9fuCI1YZDVo%2FTuymBQgIAU2b%2FysalkLHn1mnCfI7iuJhpYG%2F4as80pLYi2ey%2B%2BCJtbtu877LbUDSv%2FsZTj6HPgUX2uGUl96UcKvEopbkUZ%2BArcvh6hC8g&X-Amz-Signature=02c5554e53d62ea7189f3d22ead92ddbba88f627072c0f9f7da2616fcaebe5d6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46627ISJO66%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035222Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJIMEYCIQCAwLpQbdGg05AY3MXcmslPgPKRC24E4APay1S8wk3y1AIhAL4RVK1AkjruBk6Rcfm%2FgvIXSo%2FZFWOSzwvQfiVSPi5yKv8DCBMQABoMNjM3NDIzMTgzODA1Igxd8jH7KBtseFj8Pggq3AOh35lkXgbUz49QvDUTVJ3cEwrDoOmievet%2FNLpuXTYmSoGBe0lJjwKKApWJ3SGSSQgESR%2FduhiPq4mymDbUA%2FDSA3DRFzSGjfhvLXS2VKYR212mbBgw23plRGP25ZHv22pfLB8x717LLagTX%2F4JFgvzSqr0LkOZg8JIRXWa9yHSgiX42oRbLiyD7C75jiWUCkl%2Bn55vUF9z1c1%2BaEOVdyD8Gom0IiP047L%2Fj4PvY%2BY06JhrAGj3AeuJjqn21yfPVROyK4kUaP%2Bsjd61JuigOUf6KRnW9Lw3gODBsuIjvCRY4xSReYT%2FAXxVBIkHti0bCWCdbg7JUymIjJDbAdXnUV50RivFC%2B1Nx6ntzX78lm8sX%2BKudUk9pkA0g%2F3J25fALlEBw2T6uRBZwpeoBvZAc6HlHKUUKxW%2BfsH8VYTnVYEbJDn2GLLLoRVXOhrWmUu3H3qAV%2FW%2FV94Vk6xhTn7LnGG9nP7hYgGJOkyda684vYfyUSqCqJidMiWlp0suHhGRsGy9g3zhozWM6%2Fy8SqOZNIOcMxdSL8DQ2vPNSKpO%2BHVWlJJ6Jap9wam1l7xEshs77USKMS85Bw1OSScCyNLVb%2F1EvGsMn1U0VDVADL92PNeqL9Vk5EqBZSzslNH0TDnlJbPBjqkAaMqHB8YvP60rhDnWvQNcw7nAgxmM9lks8BPdZONtbnqsFrU2xUEP7iksWCh9c6uZe6GFmhMAB5%2BKYaQz3hM4bXGb7QI3TyKCxFb5q0ZZeRkM%2Bt9Opsi9wFcd065RRH6vF%2FO3EdHTTyQ272FzWPSQkq4TNGxtpP80J9Dic9YDGQS3w8fKh9ehKrisuToucnhAscP4E7yKgSApS4TGrB%2BjeMOQUtL&X-Amz-Signature=95b384971df06565406fdb99a8ed761cbce9e834bbdc2e1cf9375d20ba67ba68&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
