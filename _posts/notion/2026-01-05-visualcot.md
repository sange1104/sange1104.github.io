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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662PKSHWA5%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044415Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDs2D2XKNCkqvoC0RjKm8gUwLbD5fgK7x5mDsTGdfPlrAIhAPR4xGGQZXzEhtdOM3qOZnEuNYpU2ZxLo%2BkKoXAJbnNpKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy6MgiFSqSzJHTXhqUq3AMED51dtbGPLKEwgwdXQGRelit5cCgapArD8hbYHFNi%2FTCmyP2rH530dVAME44e09ixqQwEjx1p19daH%2Fq1kUiCXchXiQGBto8YME4Si%2F9Z%2BHSnf77YUsNC%2FxXRqR%2B9eOIeWWDRqLYYMZefl6yUxeLjnmlZ1uwpi3QYlLrteI8uxBRHV9p3zAMzBCjdssJeeK2zVs0qofazvwM92ikciCs5jyDrujIl6GWaVfzvZwyKodEHYGLrwV%2BxyZSX%2Bo2tp3IdHZfKH08hRQW0dtQhtU62eHTISnt3YT22r0rIzITLDB9cmGdsiyiFmQA1QabJP7ENQfyZbLleGuxRS5oXHTWwqEMM4e2CQ9YveAWfE9FAXCdT5qMGs0K5gsDjKTFxPJncUsonxrj8K7jW%2Bh03FW%2FH%2BNPtSMZ52TwaYWZvM7pjJBkT3kp2VYH9qA99%2FX9iBIvI5AeBezhRBB2M5olDDj1M4kgLwE%2FAKotfN29XWU0RAIFSBuFEOTl2cYAbwsylbQDJV27EoZH45f0daoecuNBktOYcxwbtX7HooD51u39W7pUca4utT9MI8OBeX%2FqiroqK3MbVqTpfrM4dPFSOnlYpP8l5zV2zlbBvE4JPaJ3sZC514aHby%2BRo2h5HFTCsluTQBjqkASnWUez1WEInWCHwYGnjUVHipTjUDSLQlgOqvO22nUsKKXDGTUv9aKm8WGduCJukaDQMbz%2BLpl7fe6V5BRAFeQZhVgb%2BHQRtRbjeaBBADAAe4HvHJ%2BSUoyvAvzPPZYpMh%2BGbkSqlHcY30HbjmKWXF4AESOYQYLGlmvsBCPe%2BrcTtDGYvON1ZM9FtSppacWfBwvZOc2vdMQi4s4AL27KsCbff5HAZ&X-Amz-Signature=28425949fb30d4d5fc3515ba67ad859755dd21052ba6045253e49cc3058f2f5f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666QSUFAO7%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044415Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICiL85twrZXTxnwZ13UR0UUV%2Bz557BxaMjeJQxmHwdjvAiB5mr7N9MBXeuOhP384kj0kcikt4S29inETYdubNySQFCqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMB0E8suU2T8m96ioFKtwD1Bq0y5scR8KVLiJlpHZul2JjKe%2F8sCXZi4GMc24fc%2ByODpiq3BRPXenU%2FF5xaltDTfuAqxuemLpsLhI2SiRmnagJXHdupTFiNOEmw%2Fc%2BshyybqAg0%2BJTDOv9Wv47BbPU0vwmq%2FxPdAVcrXFJUxLb4qCE3UxobBb4NppFFQtFemLSmHpmdR6lrPBeGWOEVIj4LVfekRw%2FF0dD5KApj1bM5h2chP%2FRonIhB9qfJk7DPZACfPOl19vUEvKfMCzWTWI7PbOjl6HtDACNqOHdhg7fUuxQDyR167r58UCf4qbmNzZwjK4I9OlJyAk3h1AyFeTFGh3YKHyQStag70g6yavNcicJnZAk4Aaos3dAlBU2ksnt7EILC74ZxSvmqsjqOE9Iy7ti6YeuZHOqU70DqaFfKZZoCH8ef%2FUQuqYqYjr%2F4tPyw0aIxZwSxy%2FWKUYJmJSwxiWWJyczDXhJd9le1Noz3NCWVMVSMsZmHC6JUeoQBTv2eNJjOpTBxCrdg4D711DajOhxyAm60qS6NhmuoiehwleaUOEZHQFyaPo8cpN7C71QZWv6pgKcyMpVz1%2FMMfa9I5hOWEQu5Ftr1g9JukV5Tdt4cJmpo902d9G%2BG2irQmv7Y3ehOpsBy3n3hf0wgZbk0AY6pgGShsWvAGZiQyUzknLmSVux1fdFX7M6MhY9Kvrbaeh9T8sONhq2gKPUGf22gP7gg8cKv2rhzAMf6haNkxlA9XJR5NtZsrRQySAYAH%2F%2B5iVc7TC96itXRrhLEzsRIl%2BkITcMW2c0Wcd2RI%2BJR%2BwGdZN6%2FbDOpQmG%2Bhay4O%2FDsDvkKKfjIpzIYMdAaYjKUYfKQ7nrlpg6PJ%2F3%2BwrOAgLS%2BUMZFWRvVRHn&X-Amz-Signature=fdbba109fd6fae75fe6b703746b40b452bdefe1986cd12492021b9bdf20e4dcd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662B5475V7%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044411Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDwszEBezLMlWuYOZ1Qr5v4YI2xxHnXqa1YqZ2JbF%2FyFwIgRmy7plaPOSNYLF65LeRygCciSxq9XHChRtr%2BfIjqYkQqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIKwjsgJVY9XSi9tsircA94nFo6yUGmvmvJMXZTzBb%2Fm927uHQyWC%2Fc2qiZ8I%2B2tIfJu2KFzT4vTQjaab2VeLSQY8%2BPFdVSBDx6q5GwJJrr0DUZ%2Fl7y%2BnTauYnK%2BN5Jn3WJ3TdswRQ5Ez3PsTE%2FZcp0xuEFwphFRegvcL7Xme1BkgTawu9sUOlj7AHW%2BXm7ZwVcjz3qEMFivBz9B3HHesAfzVqKARROyZ7NlpQ7tN2PzRx7K5zgtsDIUFAZDrO87LG%2FJY%2BNuPwN46ZRYEqJfiUzzETVkFE3ELipp%2FR6QNKrJpLkCPbO0ul5%2BN4AZo4wIsZlAKWCXbkWSFmgY0UW0%2Frl2yOcEOhT%2FhlNJ2AeS76zDHTo3K8wro4ZdFLRf2govlVEa5vpMQhMnigIGsDioQVn%2BKpMl%2BCuRfjXKB6M2QEp6ujkvJ5jaBiCHrkXVcukmd3iMlBDa8pbFSvrA%2FKW0KGR6Qou%2B0aLkMRI447JC3mDW0VZ1419dMaafYrpjUm%2FeSBxNr8CyZZjGDH4jfdKRDMVqvVt6uDyFvQ1lO8Sm5V%2BWmi1k8V00dxBJ52IfNACv4XsBD9pV57G66%2BtxPSLMnOov8hikSRZJkhizCu5Eqe%2ByPwdGhenD%2BPfO89qpK5V0NgzChRQdDZV258oEMJiX5NAGOqUBNXNLqvOr1RzDn0o3BV0Y5cywpbd0Ut46Bh4dBX%2FA35wQtaee4LFczAjIJjcdAVwE6Tick1wBTwoAIAWhld1o2%2FQrfs7LMlyuNKbPdFt65w2DoQt3sYenBwixdOSdV58vrWqfgiPZB7pUuRgIHgMGgN0JkrgGCQMEmEMH2ggijpvGzDzt4WY8zQ%2B6bbv7ECLGmwb%2BnBaMlff%2BTRqTuxJKbny1iRI8&X-Amz-Signature=205c2d58b51e1ede27ce4d23013c7b112d57c0b76d57dcd2d83b7c38eb7cf06e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662B5475V7%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044411Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDwszEBezLMlWuYOZ1Qr5v4YI2xxHnXqa1YqZ2JbF%2FyFwIgRmy7plaPOSNYLF65LeRygCciSxq9XHChRtr%2BfIjqYkQqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIKwjsgJVY9XSi9tsircA94nFo6yUGmvmvJMXZTzBb%2Fm927uHQyWC%2Fc2qiZ8I%2B2tIfJu2KFzT4vTQjaab2VeLSQY8%2BPFdVSBDx6q5GwJJrr0DUZ%2Fl7y%2BnTauYnK%2BN5Jn3WJ3TdswRQ5Ez3PsTE%2FZcp0xuEFwphFRegvcL7Xme1BkgTawu9sUOlj7AHW%2BXm7ZwVcjz3qEMFivBz9B3HHesAfzVqKARROyZ7NlpQ7tN2PzRx7K5zgtsDIUFAZDrO87LG%2FJY%2BNuPwN46ZRYEqJfiUzzETVkFE3ELipp%2FR6QNKrJpLkCPbO0ul5%2BN4AZo4wIsZlAKWCXbkWSFmgY0UW0%2Frl2yOcEOhT%2FhlNJ2AeS76zDHTo3K8wro4ZdFLRf2govlVEa5vpMQhMnigIGsDioQVn%2BKpMl%2BCuRfjXKB6M2QEp6ujkvJ5jaBiCHrkXVcukmd3iMlBDa8pbFSvrA%2FKW0KGR6Qou%2B0aLkMRI447JC3mDW0VZ1419dMaafYrpjUm%2FeSBxNr8CyZZjGDH4jfdKRDMVqvVt6uDyFvQ1lO8Sm5V%2BWmi1k8V00dxBJ52IfNACv4XsBD9pV57G66%2BtxPSLMnOov8hikSRZJkhizCu5Eqe%2ByPwdGhenD%2BPfO89qpK5V0NgzChRQdDZV258oEMJiX5NAGOqUBNXNLqvOr1RzDn0o3BV0Y5cywpbd0Ut46Bh4dBX%2FA35wQtaee4LFczAjIJjcdAVwE6Tick1wBTwoAIAWhld1o2%2FQrfs7LMlyuNKbPdFt65w2DoQt3sYenBwixdOSdV58vrWqfgiPZB7pUuRgIHgMGgN0JkrgGCQMEmEMH2ggijpvGzDzt4WY8zQ%2B6bbv7ECLGmwb%2BnBaMlff%2BTRqTuxJKbny1iRI8&X-Amz-Signature=8c451380a3acedb7d95eb7e961038d4fc9a7e105b0f262fd73918185a8f80a48&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T2PHGCIR%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044419Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHIaFMoJ%2Bac9TwWQ2KgBepG%2BIajZ9RDpHVDJ3K7wGB%2B%2BAiEA05MMU2b5hHWTUjhVziUkDiXErNHIwszxIE40HB%2BvcDIqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOGpnpmYEjrwvWmMRSrcA1EDvssfQMjpfuk0xg5RSBK59f2pJZcmnytPBw9gGhHYkyHaq1Zcddrw2WQZW6VtrZ%2FFUIhids9t%2F9G9kAFj6btyXZLKtTs2CyN0E8bfC0JHDhAof1umu2j%2FzGXBZGIYU%2BhjPHczEwF%2BV%2FOUhdGek9r7kqtobq%2FqQu03uIPpsDnz2dmY8XYnF7Kc%2B%2Fcj8si0tP3LjCKXmBbfDoUHws1ZFlCFdwv%2F31ojx0HX3ZdpaJIMhP9b3xes%2Bkn9exYDukjpVjGpNZHXbKffqKw3US4ALDfYnWtjQNrXDLxO8w24e6dh%2B1Lym4IX3HjUJWMz2ZIgw7%2BrVsaOu4Au%2BZaQ61VL9d8o53lH581gP3ce235WpxMZBcBif2AkrDNtz3%2BhYY43Rj%2B7BZC5sFJ2ldqVQxPtlNTbEg0KVLOCt0IrBBnvChb%2BnsvB2lbZo%2B7ZeLKnY07JPT4YN6%2Fw8SfVyAwDLqo2cT1jTahLs%2FrTY4IOUhfbMqILcR6H%2BSvpy7QncJ1QIfk9I72SuyXP7NugrwPFKwIjG5ex2bueqHvQcb7tO%2FByNX4dKHLyaVKSf6Ei%2B48W5Ow3gyd4uYGRKiWQDUpZKQp7gA0QVcsl9ZSjhTSYXxHpVBllQxqb91eJ%2FHhBcxjgMOKW5NAGOqUB%2FnM%2BtnVjgWfPeozTm4nS7WZT7tLLfryv6R2i1DmX5KamqOf2bsG7jdpv2OrDiiqux1A6VsHH8QB883nfpdj8Q3Y6eG2CqjmppYCCUlcm1dm4iYIAD30B0r5wRqwZWTON3H0uPvB41%2Bn8PRF8nuj%2BAHqlQEK6BTScmKKMMxJjICyyk6Ezq%2B%2Bwq4bfXn8oUGhEiBCYsTMctq5yExKVMUr%2FxrFz7oEz&X-Amz-Signature=761817fa4a4b4784bdcfc97edc61e80c51f3a916541727f690d71949b98189db&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VCMJMCII%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044421Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFG7rkOt2ONdQ5POLxe3jUEqirULv6rKFqiCrC6dTgfUAiEAog7EDriiHJVBvWTQDQ1ovXEeX2CqPO7sEoR2HhpE0xkqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDC3v1UEJx7hhnCy2uircA8xknZgIic9j6OE%2BqyoLUkP7sfn2eHzd7JR3yCfXonijbTks0lzhNmRxBBQ24zTbgnDoIoL7ZsZvKPVDWUJGByGZ10uxgDtWVzDU7gp4VChCQTTSGAVFPpMDVQLRSwPuN7%2Fzv5neVsZILaHZs24zzcuzwL40D0eIzt4xTMTwxij9Q3PDM2NeD53A1gTbXsG4Uzp9SdUNibaPDrr3sBXUrVTuWOFsMGL19CYcaNxowT78TuUZTdx%2Bq9oXU3eRAljrM8zB70uQoPhcgUz2VnAnaVNeHaAlJZ%2FKxOjFf4GZtSWlDbZ4xoZ5SxzKqe8hNAkvlqT7SRjxmxbZx%2BeqxUMexdkempGZHAQCjfHyAWpL1jqyzq8io5F6MrZdD2rRHIBmgh2xkPqWmKQTjBKGoff0BznqBoEQcyM%2Ft1cQ3oeaCfTBFec80kn%2B6MKcFFqMEKlpA1vcrBHL5YPhnraoC5lUJEbhkkO2TtebfDdGpnERDhLLuqcLW9%2F3M1wWFimcUI7dKI9cNaoAxbf6E8SAUMueHboxoEclqyJkZN4EnB3x%2Fs%2Fq%2BoG2AwNQyR5Yv4wWzaV0x2ML5X3IyriWM0%2FzmV7iv5Zpwe8uxYGK53%2FXIFe%2F3aSNiOPWBVvETYAMk9QUMKSV5NAGOqUBewKCcnW1MVsiXlu%2Bz8%2BNQN01HumWCiV0%2FpfkdTJN%2ByhDCmajYLi%2B3xzpNDqIsf2PqqKGC7P6%2FIyZiC1TC%2FLjMhex%2BUP4v2lLUkE9n8j1LXFfaefOe3VNSYfP4J61eevWSRnxK5kEGhZRSAFDelSeg8FSmyNXpffRvlmwv%2F83deOmXcENjLTRnrfr3rBQhKDRuycGFxp7iyDDBvuOMkUw7zvWPna9&X-Amz-Signature=4fb0cdfffc517e1f180e5180cad6da33759ba113fe9a95ef49a5aa5599d12f05&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QEU65VWD%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044422Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAQzNsK2tYPHuMlcvKTjGtOjqhgOwd7NQjFkv%2BlNxlxnAiEAzN1loFKS74r2iJ0znG8GuMqFE5oRwVH7nYqFAkxxgHsqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAyWlSEC21YwrkjKjSrcA6o9USuzdM7fKQserPELGZxu%2BuhE%2BtEpbZPIqqGb5Uxr18feA1EwLeNSpjyVmXEmYe%2B5MF7ZD7bZZfC84iY9noBZrL9x303QSvbMhPm8OF9qt2%2FszyR9Tk2BzW1wv%2BbzZ9lEljEBbKEL8qenNDlr5DX%2FTKPHWKQQTP22%2FzuDlDsYC0baGAcV81BiGRp4UvWGQWoaMMsGo73Q6MtYvunac4qMnwPaKijT441Yw3QhC65IBuiXvZIpvp35a3Q05JvhYQoOqqZVseNbRF%2FCA7bi8Vyk%2FZ%2FgQ%2FXb%2F%2F4g9yMqiE3itCpGXOTWGl291pau0mmuwz3%2BpI72cm5Pjua71lqz7RjcudNMgxPNCedrkrLTAR18SxSzRFyA5Z7XdzlEYYkkJ6wYRsSukv4onimaO17u%2F2fpN75mrLvTFFMrWj3dQQhNc7KuKZmF1K54Lc84SbHcq1ikMWf6mZvd0OKGnjVmxrer%2BKrINxBRZBdmtUPzYxzBdznktJ6Kb832KHIaGBLzWM6Nk1AdPU1vUmLT6GFiZgAy4JTF5tlUp%2F4TFTscNWxtn6PtVyif37i7lq0TSkc7rI6uqmeY22NNgzexsEjCVvwDuNzP0ruOCCFLQg0UYFEjodfiWkmZN53jUiOoMKiV5NAGOqUBjpwt0XjFrEHfYvsD%2F0GDjfOrm5X1GzwY4B2UnBRHnj5TDt4YOXIqJgPdO%2FFwMxB%2FGutxzrxyF5iY4fXsJ4a00L2n3Bp9Sif9s1s%2BADYMtMBTQxs6N1IVjSsqUae%2B2GqWf3JzxA2Bv5ZRJtnn6NY2EP%2Fl3GK87aQhibz0xyOoSDR6VaGAvSZTXDym%2BnHSsGBeDU0iWPpQAk9ZXr7%2B2%2FW3E7FUOESL&X-Amz-Signature=ee719fd2d175bc2b9e2d53240a917971cf7825521cfe9f4b175ae6feac86b0d9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TENFPKX2%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044422Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCbDGBarta1EFo7mhXN5i8cHIW%2F8N%2B5vW3%2Flu%2B89GptagIhAKwo%2BYf0U%2BVAXm%2BXgU7psCp2ERYmVUSN8M5QigsLhqs4KogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx2gx0YlEsbOj4jJwIq3AN%2F5Hgor0OCr5TEuVRVJLCISYjFVTSakuMXsJFM5Je%2Bgy4bxhm7zIDoW4xtxxxxTJ5Y1BDug0XOFnu4AQ%2BKCeszvFylKSPV61cMCQgHbsXfzsOoql4SZxiGGqTlKNN%2F5KKBlo8U7cTwwdxRq0IHWVpphtKXSJXgi6W1cINoXLsEeAOU5gdE98i1I%2BROgfT%2BjRc9tzIZjS%2Fu2ZmvrAu5RguzXpTXCjPMpYBUbbkevOT%2FFDebM%2FQX%2F%2F9Wlr1hmsKyChlSAcD5GCfp7fDfUO4U2%2BNp%2FQR72AFQr3ce5DhFLcv1qzjVVyeJxZvKNCtrm1VnKe%2FR3b4%2BWf%2FYbsYSbWpQow%2B5TcCw7M7XwRxewJ64qKWMfXajlLXa45aZi%2FnOuCJMHvWxNHO0g9YrMZklYr456MwC50m2NEMxbZ9QLJJUSA5rm51Iu2%2FVGzESQeLtWh%2FvVvfEJdFFbZhR42qf9Cu19qK93kTk1SQdwlWB6B2g5tjiUcdpGYGja7Z6wjpPOkQqHLEybIkvQhaJoHxut2zkBh%2BwFqMEiX5pORXF7lX8Rq2l1slegxHjVTaGJEcVVLZGbpqsSfha%2Foi7RohJ2sWdlTBeNdv9hIPSCQhyh5RUuDBSi1UmvvqA8Wise0VSazDilOTQBjqkAf54Hh3fzYHxCV85N8qlMh0cbtDLMe2bkgf4spEatjFVjvukxg7WZ108NAkvhmLXz35bYnBTpUKXmj%2Bd6yLbmFihu3qMVbch3uS1JmLQPPYkHY7XKaott6AgZjB8aISZpTEO1XxX52kyub6stQeUdcf%2BSWlhwiSj7Heay6z%2BIjoG3XVxtZIIktOGwC1M%2Brr5ziXBER68Xbwl3YKIAWZVkLab9D8X&X-Amz-Signature=ca8a2af56f37c47f4eac51e7c80b8559d3756736ad6790ebb9fa5f5080e2a00a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZDCL7BKB%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044422Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGwwUWueHImS9kUejKKgZSPIeqM5zz4zdy6oDmHAmHj5AiBX9qx1DYbpps%2Fx7mnQkwsi9nWuuGwFJbs6x4R7uPtPkSqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM3CXFZv03I5Ao1MLlKtwDMoVqq%2F3PTceUzm5SaTA8xq6FkIcsw2t7RWKbIVUsUnIl0rc2AQfSSfe0l1W3A7VWm11nBxOwIusOIlja%2BE4F7CzRhPZwtKmFf7PLczJOxSbOSGKO49etEGalYTzoHQK%2BXy8zO1vAlf2eqjJN6rbJvcFvFWt6h7lv08TNvycCP2PpnQrkoxB%2FOChCXShmT2yLKwE15qVJf5HrOevXl%2BbYvuE28mDbp1WHEvN1F0uYTbzcrH8nBQuLhHZkmP1MyuIaf9VdHWONyvusWo7jRbI00A0RG6%2B7DcHkX%2BpgX1BlrVekIUnF2xYX%2Bsg55IE2iPnmx8mFFRUKAreAaCmz9MjGk%2F3imGEgcvah9bgkg7rL4Kr4MRu9nt%2Fg%2Bsa0oZ9UGeEPYZh7MDqggRHelwhSMUpMHqIVsDFs5ttz9qHlOwr9H2vUW4LK21s%2BJpuPDgzaGp5f6ez1isDiyl3aoVIhoNuOK5ztgt%2BwziNdcIxAILsyEa5SY2R4wFEEtrygNFc1e1PQJsJEhl5hqFpGTZ5YVDhdXWCl3E2Y9AXKEjpgP0AV%2FVhbOV4HrfNZ%2FoEcnJ558qvajBFWfxEheZa0B1SBpnsSP1%2FKKOr%2BAAJWwpS6ToOIVkjL0dlC9CutapCu06Yw4pTk0AY6pgF4xuweF8zYhNzjOawxe8KUasLaebJwjYhzjRMN8YkLgCSffD1E5e4SMVgdJtFAQzIo5d61dmF3d605%2Bn6WFOArbO9reVR3McmO7Ena3El1OHwWgK1qSKxtFnGjpPORQDarRcnXDcFctXH0OuSqS%2FEjjUJUJ028DIAxG1x6bui5IxKWt1wrHEltB6XAo6C9pqQSGW%2FHYFThyYt47%2FtZh%2FSgzPfFgGBY&X-Amz-Signature=368e2ca5ddf9ce91deb36520d60089604b346b42973e1873ec421cbc66521260&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662B5475V7%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044411Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDwszEBezLMlWuYOZ1Qr5v4YI2xxHnXqa1YqZ2JbF%2FyFwIgRmy7plaPOSNYLF65LeRygCciSxq9XHChRtr%2BfIjqYkQqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIKwjsgJVY9XSi9tsircA94nFo6yUGmvmvJMXZTzBb%2Fm927uHQyWC%2Fc2qiZ8I%2B2tIfJu2KFzT4vTQjaab2VeLSQY8%2BPFdVSBDx6q5GwJJrr0DUZ%2Fl7y%2BnTauYnK%2BN5Jn3WJ3TdswRQ5Ez3PsTE%2FZcp0xuEFwphFRegvcL7Xme1BkgTawu9sUOlj7AHW%2BXm7ZwVcjz3qEMFivBz9B3HHesAfzVqKARROyZ7NlpQ7tN2PzRx7K5zgtsDIUFAZDrO87LG%2FJY%2BNuPwN46ZRYEqJfiUzzETVkFE3ELipp%2FR6QNKrJpLkCPbO0ul5%2BN4AZo4wIsZlAKWCXbkWSFmgY0UW0%2Frl2yOcEOhT%2FhlNJ2AeS76zDHTo3K8wro4ZdFLRf2govlVEa5vpMQhMnigIGsDioQVn%2BKpMl%2BCuRfjXKB6M2QEp6ujkvJ5jaBiCHrkXVcukmd3iMlBDa8pbFSvrA%2FKW0KGR6Qou%2B0aLkMRI447JC3mDW0VZ1419dMaafYrpjUm%2FeSBxNr8CyZZjGDH4jfdKRDMVqvVt6uDyFvQ1lO8Sm5V%2BWmi1k8V00dxBJ52IfNACv4XsBD9pV57G66%2BtxPSLMnOov8hikSRZJkhizCu5Eqe%2ByPwdGhenD%2BPfO89qpK5V0NgzChRQdDZV258oEMJiX5NAGOqUBNXNLqvOr1RzDn0o3BV0Y5cywpbd0Ut46Bh4dBX%2FA35wQtaee4LFczAjIJjcdAVwE6Tick1wBTwoAIAWhld1o2%2FQrfs7LMlyuNKbPdFt65w2DoQt3sYenBwixdOSdV58vrWqfgiPZB7pUuRgIHgMGgN0JkrgGCQMEmEMH2ggijpvGzDzt4WY8zQ%2B6bbv7ECLGmwb%2BnBaMlff%2BTRqTuxJKbny1iRI8&X-Amz-Signature=e95fb7bbffd99363dcbb7e7ef65f6214331267e379c616b71d28faeaeb923cd7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
