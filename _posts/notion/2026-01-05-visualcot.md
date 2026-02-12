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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XK7DJDXE%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032206Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJIMEYCIQCt6YGCJ9suVTRJJWGOweqYOfm2CDbnI0b7BbsjEH35BgIhANEAGFDM9p%2B7iCTCHwTZvykWlfKmfNCUEVD0p1zqzCCSKogECMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igwtm3tEjsZnSQ7c9Ioq3ANyLhnR%2Ff75xWy5%2F1F7njPvQ2b8fm6U39lb4myv1JXwO8y2W0b3nFPE71No295nlNjG5a7esHrtVJS2ftJ%2FEzAPpblB%2B8EaCUHVwtEj4oqmqGXiS5Nuck1Dx7cYfK2OppgKO0ta5AULSbC5zQPOaojCYSoJuKPnb0nKgtjPvfBOoIg684qAETpcWhpiWtBnTqvDjZ2z1k%2FT2YWyxRW9IrdY%2F8brEjnMe4CcObMtSltXTuHtZyyxLr6ILy4i4aKqI9HzAySVptiNn5FVhO%2FNhMUaW1Cr4%2FCCnXMFz16NtSgl3ynhZZ%2F4BwZMfhYWZyf%2Bhz3LuN0QEei%2B81ONoPhpYwNpkrxun%2FBb2EwHT6aLxCohBOBC3JSLw7uXeX1y%2BS6lclh7KOTJkILo5atvTLd6SpzLlXwFdEKrf7UCMrAeP9mf16BK%2BY8Z2oUudNKscWk2Ggal5u%2FVfPTErKX3I9T9POTqc4Yw1AG7dcRw59LbsM6AXWuelDjDLW3U0XfzigNSX2Ad1zpWxMg0dIddYzlIvgy4Ytr0HamOijJB2hcaghGYgaMNt5jTMy99EtVipS4%2BbXWLwj%2B%2FqT%2FtQoyeisnjRP4GiZDG7jRqTuZyXybCTO3RwBGGBfSXV43ZK53ZrTC30bTMBjqkAVvp4yXhA5it0iq3xtNjVkvIqpPn%2BhF448B%2B1lL1WaY2mQM6REf5tqwygp8MCwhdgoRo4fivM9MW2fEGbyD8w7e3kMht5%2BBC8gBN5UGlgKN5ZNzs2n6GRjQUlsYHz72LY8kQTJUmkvRtwCrpiIvUmkFNAlLC3iU0lZ3HvwkVeaYQCEG65lXS6zsjRgYrr80K8ph%2Fl2feV1ntvpAvNdlMoV9nSlHp&X-Amz-Signature=470d66e367c94a2f3e19eb4a5eac92990599870d5515966923b93f5cfd8cd44e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662KKX6EAD%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032206Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJIMEYCIQC9rIJASz83o82sXxGR6DeGNw3TyW3NJOfkFJicWjHR0gIhALnEUguBxsBbxC5SF%2Bk1uCHbvbTK0Ua1AL9npD1Jgo9%2BKogECMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwI87QsN5CvSpIX9b8q3ANkRVNTjgyB1zFGarCZcMCOH6R1flGqV%2Bcdq06rrU4Mt9STN%2B87hhrdsa3XkawRIsVED0nQoeOmYR76b5rnbb%2FPLsl3l6jAXRadtCvo0t8MemyQrjPab8KqCMLJDwnPo6S0yny2PKm7x0Ps30RFaOsFdPMPveK%2Fen1cOBeRtj8A9lG0kbUIsJ5sEVXenUo6HNHMZJV0s%2FxdK4hzp0DdWcAKkICv%2FM6FSgmaUfdJKhyQNWQkApD4nxC4f0hQdQU6s1O2WrkWq9cswMOL3iEqoaYfCEAq0gzXWnr4B%2B0gtVYcunXe367KcgRBhqnVvrbSdfTmyoITluhyjtZbFhyesMliZUbekZmz%2BPyE4o6FQSKP%2B%2BlupY2XT0ICvvTmAJq2YRL6i%2ByY2ixkQ%2FfsrNTVlCcOdhQseM1viT0XQmWHGl4xj4%2Be5q4MNLef52vHUsDjF9waPzWf1%2FnoM07MTgg%2FvXG23pFAZjlVChaH9sjgKxGCH8u5%2Bb%2FG1c71yvJu8O0XP0XxD%2BMc2lGSayfrUiNvp0dClvo1n%2BJKrUhmGe%2Bz3scVqGBi8FJgj4e%2BEf6fePHjHPA7jpMBbX2PNa4bll4pJXQ%2BheXm3R5B0xE2eNjYip9gR1DIpoRacpOnKWIgHjCL07TMBjqkAc7F%2F4QdLWZZZWgei3mANPo9%2By0G3wn6AbOitjkAaQzmi1y%2FstKLMwWW2XEhT6FHDY%2Bcp4%2BvdKTdbImL1lPfslM1kXsna8%2BbUKm8iS4rQRN2NlEbXeNJto9CSGpujs8o0sehvMcu2kHaTUPrCg6aqcOY4lEAaezv%2Bbf6KJ1qkWabrot09orc7ANcAK6xpiTcJtWWxdwu4fIt4K5bLi2sBAVj9SWS&X-Amz-Signature=e596744789b722e11734ff55b4c69b8e2e190e97ba106954fb75ef3d30aca1a4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XPWXLPX5%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032137Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJGMEQCIEUuly7eGjWI21nlzwF9FSpZqzssJHVwSEtcybCLNZ5%2FAiBDQGGGGNcvLeXFoWWL78qpyQk2G4G0%2BptFZOVpUfoMwiqIBAjK%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM0JgHfAzL4prwPd6NKtwDkMonosznF05cSaWZctZ7gULpBEpCFbu7wQI49SjQ7bPcme2rLoWqxkggmgoyrtQugAEnV1ch9HHi%2Bj7MW6tYZKgvrSMaMqborRazl8J8ZTNB62PNBBM1RI9kDfgmxwBws03qhB0zF%2BuDMm3y9EcnJO6VTut5zhySG0YbjW%2BWgevDZFanGhOk%2BpimEQR7vm6WJrQRy25Ztzcp4M6nOpQq4wOTNsZweA%2BFczbK%2Bez407XNOpzbvu%2BBXX9q%2F5Aw%2BKlsN2oyHYfUooC2SKysTrwpuC8vCQPFiKnMDn5%2BXrusXJEPccliAJFFq%2Fx3CnoL0C%2BDvnO5PoDtUsPpdN0KnfjgRDWti6ZolLal37JVGkbjntA6%2FpBoVYwZ9SWHc5aTpvfJ3Xek1OZHLu52lMKfOptEm2ibaTsUA4ZTzRmsG6C12z9xx1kkxoDJaSi%2Bag9v6ZbcKLn5HnHi8TApvH%2FANSkPOmBpTWTrSNug7DIvwBSIo6BxfM85mzQy2Xrhgp0OZ2eESwQF4BihAuidQEZV4VR%2FMmaMT91Wmph1YIWRnkZzRYMxtJv4TNSjn2jgvUVfSRRyQpVlc7RLAdN55DornJvC7A2KKzPpnmTUkpxubI%2FCaWSZTrb%2FxgAdQC%2B9QdIw2Mi0zAY6pgEhhgUUmJs8O4cpUKeHsof549YrP9bFsNgrag5IJzlX8pEupvZhdWyymjF4%2FtSAGirYQ30zP%2BPjAwcOgMg89zsuHOQeXGBve0oi7wM8nhhJsXSMdGg4KPQ8XUjn6CLwd%2B5eBDEbDJv%2BULN8wkMzgVw6%2FJPO9UNkBbMcYpyq5Yo62beDKBEuCnLHIbYpeO2rm%2BCBafr0wTaqhp00SKZps7VsOHRl9f42&X-Amz-Signature=b7b5374bb496855bfd5c820fe0e1a0ec03196b00f39e155cd3917c795a66b4d4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XPWXLPX5%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032137Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJGMEQCIEUuly7eGjWI21nlzwF9FSpZqzssJHVwSEtcybCLNZ5%2FAiBDQGGGGNcvLeXFoWWL78qpyQk2G4G0%2BptFZOVpUfoMwiqIBAjK%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM0JgHfAzL4prwPd6NKtwDkMonosznF05cSaWZctZ7gULpBEpCFbu7wQI49SjQ7bPcme2rLoWqxkggmgoyrtQugAEnV1ch9HHi%2Bj7MW6tYZKgvrSMaMqborRazl8J8ZTNB62PNBBM1RI9kDfgmxwBws03qhB0zF%2BuDMm3y9EcnJO6VTut5zhySG0YbjW%2BWgevDZFanGhOk%2BpimEQR7vm6WJrQRy25Ztzcp4M6nOpQq4wOTNsZweA%2BFczbK%2Bez407XNOpzbvu%2BBXX9q%2F5Aw%2BKlsN2oyHYfUooC2SKysTrwpuC8vCQPFiKnMDn5%2BXrusXJEPccliAJFFq%2Fx3CnoL0C%2BDvnO5PoDtUsPpdN0KnfjgRDWti6ZolLal37JVGkbjntA6%2FpBoVYwZ9SWHc5aTpvfJ3Xek1OZHLu52lMKfOptEm2ibaTsUA4ZTzRmsG6C12z9xx1kkxoDJaSi%2Bag9v6ZbcKLn5HnHi8TApvH%2FANSkPOmBpTWTrSNug7DIvwBSIo6BxfM85mzQy2Xrhgp0OZ2eESwQF4BihAuidQEZV4VR%2FMmaMT91Wmph1YIWRnkZzRYMxtJv4TNSjn2jgvUVfSRRyQpVlc7RLAdN55DornJvC7A2KKzPpnmTUkpxubI%2FCaWSZTrb%2FxgAdQC%2B9QdIw2Mi0zAY6pgEhhgUUmJs8O4cpUKeHsof549YrP9bFsNgrag5IJzlX8pEupvZhdWyymjF4%2FtSAGirYQ30zP%2BPjAwcOgMg89zsuHOQeXGBve0oi7wM8nhhJsXSMdGg4KPQ8XUjn6CLwd%2B5eBDEbDJv%2BULN8wkMzgVw6%2FJPO9UNkBbMcYpyq5Yo62beDKBEuCnLHIbYpeO2rm%2BCBafr0wTaqhp00SKZps7VsOHRl9f42&X-Amz-Signature=78ffe0ceee82e1a1558771e63db98a713a0740e0419e32f3c1f31cc4f1e6df8d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663ZXGJ5RM%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032215Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJHMEUCIQDa40oFky5fyVv6%2BeUKjhMLoN%2FPDZ1IcI368r0uKM%2B%2B3wIgSrBSWsi9Lwwjlxne8yvF7NuOA9ArtWNZEMmvGLTn1DUqiAQIyv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH9I3ef22w8k0VX6aSrcA6OSN8mlmyL%2FoOg4%2FT%2FMBV%2FhtPf9EhTJULCUj5if2gQDZ2jFxKc6vg11D0%2FyYcvfKUsjD%2BcNt3LsgDL519PhN%2BJtreu64GNcRAVU50BDYaXGW8hNuElhrd87foXZA1S8sunkVVskzHyfBn4FRVJeL7ThIKZVv8NjfK6J5qh86HOT51BrUNuedQZww1%2FPGlKAfl9%2Bg%2Fb09wlEbnyTLqPtZO2AimnfRJbWYgY486g2VvNRnVmpdv%2B2Z%2BWDgvaTaxWjzAWvknYIvqO2OmJhGT76BguStkpsn8bpLIwWn8I6xuoxY72AA34JN3%2BDS8nQDeexeWOZW7PXGPUvSnX46PcxuGLr4U%2FfA6JaXJJVTBkSjdz91VT%2FUedxGqPmb%2B4b1z6WTHPmusfEMGAcidLiRk2agAd0uROsGarCx77nvMBevPJkR%2FysYApe6m%2FqSZ8z2ZSVwqlymojSFFrYAZDX8okuytfWMcqwZYFkCVJpY9xlosyh9F2Z5FnfTIrYpO1P%2Bv6JmrT8zyEX4XmcNVUH1fburDkvDKR2tmabjws9vRAosKP47lHQdOTwcdnobhJRza9Eo4xdYxiV1K5zXzpqOhMuUG2FOip5x%2B3yVJHKbjVmVt%2BAfCmXR9BMczUzj%2Bn6MKDPtMwGOqUBnTwNQhL%2BNHdMzv8OjP78Tgj%2BKhWlCmmV3H2aG4CzNLfaA8irW1m%2BMvdF4mA6%2B6gYR98Hy2ebU2Kvc2%2B2jnhgxAaqyNJEV13N5%2BfZsq%2F5j%2B46Aq78FOacaWjiAyC%2F1sWAWaDnDO8dFdx8ZTeyiOvEb8f8Q1q35SCxI85AJD1X3AR3zCpeMLtGQIf8QKjevH63P66JyyUmz19UJ08JkcddergPUv8%2F&X-Amz-Signature=068e547fde13ba1ba731b2574e3f9409c5c1d3fb07caac6dfdb6350cfe78f3b7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X5XBM56O%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032221Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJHMEUCIEBtUaOQPReoxG7Iv8yboBqnYKjXzIGbJXykehJr2ik0AiEA%2BCwP%2BIM9HNaRDqXby8cvmmcCFjXr5NwLhQjK81o7L98qiAQIyv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPvuTP4aak8w7AblhSrcAyA6s4mK2GEBNz1HQbgy5DYp7SXe%2BlBoFmcAwQzRUxJiYrpgocdXwlSmC5Lm%2FrxUoYstM1nqktXZXJjrAVz7DWO2mSkShN88QQcOdIVDvEMQ0gW4kAxQzHYnAqvx9vCynrQq0psvT%2FUEdNpohH6A3uhk7g0Smm6lojKhUukYQROOvX%2Ba4LWMLBliqXDCMPRJyK5GtoJ9YFDAMtzWGSLeBoH59RY3eAjT1XQua3SDk%2BSENlRI4CqmzNHwK4nKLKIoPtiHXgDQoJoE7Inmr%2Fgi%2BPqxyCHk4kmVz1gHLFPXe5pzb5C0lZm00a%2FWInk3YZ5lIvOtsOwOIYtZ4uz6kpp9vp4YqOUQncVO%2BcXHVLZ65H84gpOFFgejlN2CckG36a982D9dCcY47%2BsYGGPt%2BVCEPH4DJsczrpzjaq8B80ri2pw9odDn8g29QgX5ME9gjoN6Il%2F3LC8Xnf4jzc2R%2BJ7pYnDMrg3iqnxVvw%2B%2B6XWmqYtgLpyBqh7yRsVntJN8xNua2Ntvcb1mc2Svw2cDKdc4QcLaZmVH8eW6MbPYizVqZxMAmCluDS1j56U2ISCvX9MZI%2FOdZ0VDi4c58s3WEe61ETbo6A525vUgYR3yOJkSmeyD%2Bdq8M5ZMxi%2FOzrCkMNnPtMwGOqUBqnWnvkyLcB64%2Fq6UIA0lyOTl%2FFcevShlVcnd%2FdGPJcEz4dFKPg7nDVaZ6JiZ%2FjnjnORndCQYrIIqUIXMkt6CcaJ9%2F3m0JLj64aH9GYYhm6m1pNTPTjIAucnMnnaLiQ9oXYTXOk61sZmsXQQZmslG7vpf9%2BGt2vwp6gUSR2O2qMYn0XmDcCeVz%2B1YKp%2BYu3C3eIxatNRYqEa1npagwgvPP6UUh7WW&X-Amz-Signature=9a7b7bb809a2c310a1d2d6dcf7866fd55f88ee14a1bd43a4780ec8eb1ee189a2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SLNWJ3J5%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032222Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJIMEYCIQD%2FapQ0ytCX6dIhKgZ06YKpD1b2qBFGP%2BBL7RGaK%2BxB2wIhALDYBpOAH%2BnDKZF7N5Usk1YMhrBDmDNTzYhFZzbVdlUDKogECMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyZ3MYw6dKaUQ0ioEsq3AM%2FnIZWULepEApt0q4j7TTTxTPoRi%2FVd3rLjAZyRsOAAXDGHp8SbQrhkSEO2xh4JkH9wcqR7nYOgChKthlWg5QUiFwvh6DrA7mVzlnXkR1ZCuO7A6SZVHyioUOM6E2z5TtmHjduSBmyTCoUKPC87RZdu864gUdwMsMzgelFzb7BcCVhxA2aGaoNsy6QRPsjyiZ3MElYB5vT6exzDOJNLelGhCKLSswHUoy%2BmH5qhvXrl59mukxb3O4RR29nfZpoes9XrbuDPmqVeb5%2Br1w0f5Xjw%2B8ip70lz28SPMtQbDLvcxbu1ggku%2BRFzOQk0MYLx9Sh8nla0CDoc1BPJvPeMMFEPl%2BeZ3T%2FV8GEcEuWg%2BxVPD%2B1HnJGNrMlyfx%2B2bz3sCQbD0o%2FWwdwVQug98QXQ4hlgn%2FwxwxoeADj0dcuBcwOy4z0Qk2WDMzG6Vek9wQG%2FlUt6EvLpNUm%2BixBBK3pfNdtVujtdK17q8tdGgUvLB4beWIwew97QMHih6wo2YWXn5%2BTHio3rN4qADVQjXdS64eujW11K9OxwUt%2Fn0NWY56KoHeuKA0bGdOfM9vzO0OSsFn%2Fle3b25G9Xu5zcYNehcvRJO04ezAzyG6x8%2FjXZh%2FxKwFyGJDsYxirQZIIjDCBzLTMBjqkAbdDfuT1jJB5WR64G5qSNgd91OP1LeWI7mZ%2BYPOVBJVo5qEz1T1W1Efg53qWrM4ld%2BrrsiM25jmlaNVqTC1GaLiOqQjbJVXLiZYitqBugDmPGoHbFMDjhkr99WIZosj8RNNWp6w%2FoSWUcePygCt9Pb6pmQBC4IDNRGTe717bNFxri%2BylPXSkpvvH8wVzJnHD3EMD8W%2BJCu1SJDxsWcNe8CIYfUmO&X-Amz-Signature=6ff4039623b2fc621bf6bce5824354c2873b2d937bc026c6abf9158c6bffca1b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46666ARLHFD%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032223Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJHMEUCIGnjDOWXJ58tQ3xHqZZcjxBGqJJmnVdlys283AUT35bwAiEAjT1kWfYesqGBMiV9i6HH5N1GWYjbjbMSMLIIvyB4dD8qiAQIyv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOelZeYh4zpO%2Fl1%2BLyrcA7yw%2FE%2BMZBR0q3KaoX%2BWLp19ciclFWeCIieAq9Bsb82LSUaPyXphR9xzLgKg2HNaZlk0GlT1DO0H061MiV5T4EvJOPyL8fEzA9gLLE3euCT4AHHDFFJD2Eu8rRccyYWUS8kx8eB2%2BoJyG5k1DilEpwebHq0Mbg4Ymswms59x5x5k0M4WkRfDUcKXg99Y2oo8tKNCUUStEVJe1hFYQ75VC1wiu5Zl4wY%2BAR3snF8NGRPzzPVW%2B8tN6oj2r%2FortZdF8wwxG%2B8bY93OybkFmgMa2f9lMpOuxkgeW80HqzUP4v%2B%2BkIMJllTlXYnjzA%2FR%2FonmlVb0Ks0ny9LbsrhlOHFMyW8cS4OohSFmw3tI%2FdKbnrPEqZemk0nJuizAbC4v%2F%2Bqhtsj7%2BRbrKsIStqKaHJGHtBojZBGCSpEa3k8vUoFuISP4NlXBRwkUrYXH4mVUVtzhBLdLjV%2BlkQSu5AGu08tT%2FhOYhXa%2FX%2ByEihK1x2BQoDHUEBNSSPJOr7grlbw4zBew1q1LpG0EDarLpnaMyajLE9SPNXdxiUBswPnWfd9cTQ1775BmCaReRPtX13IFoT16wy1hMmx9uQlU0YBlPManDgjDre4%2B%2F9SGc0ZhSgr9nzi6dOWZzrgZCRlcbS10MKHItMwGOqUBuIem94nrwhsXAHhxAV69CsP55gsiSApVTH4STuZ5VM557j3rC5Kd6oNmAzFwo28tR8Bn8423SZAkucOiQTNaUJtRNBbo8G974VRnmDc6i%2FoKiYglZpFcAf0pyTo5BlZC26vIEomS4QsQbrnIsXizYd6HbEpc3R9vMBX1XqSTSWLzL2iOzEmCVCUco0s%2BSJz2cm99iqtGeFg2Z15HpIMUKy2y%2FldP&X-Amz-Signature=f4e45584eaf1afe985c18c297a2fe511a7b1f54dd80f7ca8e39c61bee1fc7c34&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RXYKH263%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032223Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJIMEYCIQC6ISSptJks562iPEdATnyNched983%2FEgHYHeeGY6qtFQIhALVmyDHch5LCqqxIitvNVBdpXAJ9mQJrcJ5qykY74RAcKogECMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwJUKB1wRyzaA48fCAq3ANKCUnuZ0%2BZiZDZT%2FFcSZLeTdQHUtF21Eq6FX9bvuysSHeRult1sNfMietquqZPudb4Mg39mhmOxXf6HPr5ATigo2FDsERw0DRafRuBUL%2BVNOO7jfRKgpfZpoL7l740dAp5MpnkkAXCA%2B2rZoEKm0XLMQbyndXzfM0xDasAe%2F9fjQiCSQPWJXT5C8tNDIQMYXBTv4kgIlnL6LtjCt%2BLqhGQwBd7a%2B08CofTJxf8g5p6U90zdktalp8pn8kFvzoblueqyb%2BDNseXJ%2F479sUkNHJoQeSO1iypzeNxvNzO%2BjHOYNr%2BZiCJUPJxGsg454eb3JSMkdaH1th5VeBkeT4uyfx%2BDQLjKILNXWJ67v8TlBalOBiYXixp0XHUznCotPUumc9Y8oPlC5Am1OL6I%2B5egFoln5hdCd36n2y2HK3PEU5%2FztizZPbCjwxCIcHT3B5zWvf6adrnq2dVFXc2fn6WNiarMRhnUCqWjjfiyRGOmi%2B4y%2FTB7l2oXA8OZjuupQRHjykGjewmzJ2DtzcRLJoxgsMTo58MtiOsrEJftvH%2F9HxKuxf%2B9myWJFr54nQDiXSSPI49SNKEEsxUUFACEdAWDy4pQDMKLO9ouH%2BVir8H6GPZWRLrdmvliMWSdckaLjDny7TMBjqkATJZ7iVTLSw1t58zmZsVjuIxKRnW3iltKPB8tj0QoaIippA02tn2jEBSnLJvNbpHuv7GsHZloGJyoQ88J7vFueLzw0w9pJnxS6XtZnLNiSchTvH7QfVBp205EnaRCZRcmeXhL0M2U5GNAAS225ZoqigTnIxqyWzf1hSWGN2TzS6dfMPxwkQHc2V%2Bu%2Fjxv9jh2Acfp45RAIwAwEZ0RwDqI8MDE%2BBD&X-Amz-Signature=cd3b968a3ed316e1952796666e2a0dcc43c2ea10f632dfed0f4e86ec731a598e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XPWXLPX5%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032137Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJGMEQCIEUuly7eGjWI21nlzwF9FSpZqzssJHVwSEtcybCLNZ5%2FAiBDQGGGGNcvLeXFoWWL78qpyQk2G4G0%2BptFZOVpUfoMwiqIBAjK%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM0JgHfAzL4prwPd6NKtwDkMonosznF05cSaWZctZ7gULpBEpCFbu7wQI49SjQ7bPcme2rLoWqxkggmgoyrtQugAEnV1ch9HHi%2Bj7MW6tYZKgvrSMaMqborRazl8J8ZTNB62PNBBM1RI9kDfgmxwBws03qhB0zF%2BuDMm3y9EcnJO6VTut5zhySG0YbjW%2BWgevDZFanGhOk%2BpimEQR7vm6WJrQRy25Ztzcp4M6nOpQq4wOTNsZweA%2BFczbK%2Bez407XNOpzbvu%2BBXX9q%2F5Aw%2BKlsN2oyHYfUooC2SKysTrwpuC8vCQPFiKnMDn5%2BXrusXJEPccliAJFFq%2Fx3CnoL0C%2BDvnO5PoDtUsPpdN0KnfjgRDWti6ZolLal37JVGkbjntA6%2FpBoVYwZ9SWHc5aTpvfJ3Xek1OZHLu52lMKfOptEm2ibaTsUA4ZTzRmsG6C12z9xx1kkxoDJaSi%2Bag9v6ZbcKLn5HnHi8TApvH%2FANSkPOmBpTWTrSNug7DIvwBSIo6BxfM85mzQy2Xrhgp0OZ2eESwQF4BihAuidQEZV4VR%2FMmaMT91Wmph1YIWRnkZzRYMxtJv4TNSjn2jgvUVfSRRyQpVlc7RLAdN55DornJvC7A2KKzPpnmTUkpxubI%2FCaWSZTrb%2FxgAdQC%2B9QdIw2Mi0zAY6pgEhhgUUmJs8O4cpUKeHsof549YrP9bFsNgrag5IJzlX8pEupvZhdWyymjF4%2FtSAGirYQ30zP%2BPjAwcOgMg89zsuHOQeXGBve0oi7wM8nhhJsXSMdGg4KPQ8XUjn6CLwd%2B5eBDEbDJv%2BULN8wkMzgVw6%2FJPO9UNkBbMcYpyq5Yo62beDKBEuCnLHIbYpeO2rm%2BCBafr0wTaqhp00SKZps7VsOHRl9f42&X-Amz-Signature=fbdd68a7feebfe68601b5a62a5514afd5ba7f56a4e7f3607b39001068644ae80&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
