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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662WVYAU74%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031246Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIDy%2FmMCx8nAlFSTg8MtRetEVmypYcTgNHewmpHvanMM2AiEAjUWoiCkQh3GfAaOkg8F9ZOLvogCj8%2Fa4pKh8lwzv13Mq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDBksa5bHFC1C63uQYSrcAw2BfRMMzRZjWjhNGXz5LlKo%2FAzCvR%2FqnunCOJcoWQyXz0Jg1Z7YJfQowb2oIXcwgVjyA%2FTOnYAbqTPfM0QhTdIA%2FBmJ24ryFFtQ8u8ZqB%2FBmcGwJ0OQG3dzpfPbm2HKu23luV%2BqJYRAsN4l3AkDxOYxWwmcqKbmbN5BrCZpc6VoTKW05mtQPy9JqTXWRV0HJT73Y1msI4GJFwzWPoD9fGL9wCLGE52p%2FmHpXJrq9%2FLYdbIqo7%2FcxGzLP8oDlpOpLvCPov5qFJhGjJewBi44lzbwRlApAUW8EDmzgqDqi5qznZf%2FUiwu2X%2Fx44yJY9Y8SkdFl%2BQmnlR6KqQNakhnhc24XTwhFXv5hErmf5DkvXVrVkF%2FZH%2BXS5xc%2FSSE7lVwIKjAB8231siImTN8Fn8JRDtNFKgpEcLPuDivZDaCc46I9NcE%2B8P9lpIdkOR%2FB4VCgnwAK3Lf6c%2Bxf1g%2FCgX8wIxcGD4iTDZFBiCXMSTyBTuMRAFLywGezGb5I0Enfi2GgKn7j1okRlZ5b7lGs%2B3neTp1ZLFpAfpFk5QE4qdPlYclXdppUBO40JQI%2FuPUFJ9BHg77xqRRr2ZIRRmkcvMnF%2Fo2UicIfEyLkTmswTgvvsZMns0tnjDHG600FJJ0MKe38s0GOqUBUvYHVT%2FguuC0wYW9IbThKqrxf1XbstYW%2FiV%2FZMQi5w0C5NAxeUVmQ1LInUE5PjT2Mih%2F69glMiWMiCgJpa00Lt4KV8Eqq8wYtwWA9e3r76rnBuqVwMTeo%2B26FEE4vltm6rwgWCI6cw5pMdrOampWiANV%2B6k%2B0oIcnUfFCt9bhP4Ez61THyMLllUt2aCzjEWBMbE5WEcSyfluu6hJ1xMUH4VIfxHc&X-Amz-Signature=28142ffa9456b7649b34ade49b13d22cc9331aa320ec180b6ac0234db612c0fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MVE5JOL%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031246Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIGnetFy8pw83a%2FG2Pn%2BW0QR5nTsad%2F5qUTFSOeSbi6bmAiEA0d04W0pc7Iho8AIk67vELr7yFtIFHmGSbTZB3eb0Mj4q%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDDrhRWPvIhZ%2F7YlYxCrcAxO56%2Fk0ceq7yugDDkWl67QTNV2TlLqVE8br7zlD8DlI8hpgZWlFjTd57icuLTrKcla%2Fr3rOwDzpSqdCe1KJNGAsTXNmDYCO4VkeEw6XjjNpIbNuWp8mmUhK%2BiW1OL6w36OLfI57vlnT9srT0b4dyADHpx0Wcq2%2Bb3xmWa0L13Q1gHqyjjXvUho26m5pmKMMpxHYz1DMc2rMsYKliOF7mNQGifNx5G6U%2F7yrSiH5Tyreu0iZ1wA9uz6raBOKjoVDHecpySNRp9GzDXWV%2BWSAr4pXDfIwJGhHgP96lVdHg7YPH%2Bs5hLINS9Zts3f8zIqDdQj%2FlBZM8bREANEqdscwgJs6MQviWZDsq965TtPX6IU6P65H6iXnwjm1Mwhc9X%2BohFl%2FfhDLD1D11JGeaSelP9P9MA318MvATqBxQiLkt3Lh4jqnQjKu4WDin6iiXwwsEZ3bkczVlf41YyzKHMylVWbp1hdujBp7tcdGW9Y8nczfmFMCxib2g%2BUDRU12JX%2FdGdCbbvYSJSUWJnMvSE5JL7oDMQxhPRzvPym9zMXDs0NOOg0lDKl2UTaXcUDAFFd0j5a8EIuWKkYkdFLBOi56I3aqBe6IVqNEalmRfyrIWdWQw9yyDrQ5sCmUEQwaMJO38s0GOqUBnqTuoasGd%2Fy20ab%2B93CAw7nx7KZMvuoKqexq%2BqjrnXrlEvLV%2BxoUdf%2FY5y4WVFpx%2Fod7%2BqUeLabR5Xn1YQBmPxHjA1SJpibY4bGluqsKf3cp3Coip0yjhfXRrxlu5XLkZcrkS%2B6LNu9moGkUW8IPRBv3%2F8Wtti3c0pSluTXdefodRXyWO5azi2DQewxLdqdyq2gbod2NfZ%2F3z8NKBAs%2BRvptQ2vJ&X-Amz-Signature=ac08b274a95f547cf26783587051adaa79188e1ddbfec9cad088f06f63e3bb69&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664UC3Q2OU%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031238Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJGMEQCIAmatA7oi1VRySBwG12Grtnd2nQSr4uwJyJl7%2BsdhQggAiBe30V9XQAG0b9FoV9bz61cPa7pZynkJDGSI5SyrvnGJCr%2FAwgqEAAaDDYzNzQyMzE4MzgwNSIM4iwV3Pu7T5K5D77LKtwDSuJGehJxU2a0Jh6euLQpA79KJb%2BhT94T7lEjcsZ4MneAkG81XamVYiTlWhxvrW00zq7gy2NaPQPcSmNUABU5dA9KDApO%2FXHeVMaQZmMh28%2F%2BKfsCHhkeTdQG%2FVxIp3qUflwSH6BxjzjtHfFMVFaBeSgWUdVFrlpHwSqKKQ5RViaZy%2FdmM75%2BhOTzbCfmxGqK6wgOs7XMnjfI8LE61oHAo8fwS%2FZNfg%2BCEc2uAPdsnEU9rZt8ONQ3Guk%2BlXcENbO8ZtRmUodzs90X8R2SOOVGnIobYk%2FuA48J9yyzqUkRQYgPLCRBxKdWy0rP3PC65cAr3y%2BPwaJrqgGqsowG7A%2BYp480sQa4XAC5Jg%2FsDbUkrnM25x31WeUyzIoK6BBiZ86OQ5dDSrWCYpVikQJR3SwD21xm87rkGpWb%2FNJuM7r%2Bqhig0v0Hbc4kJ7tRKUpxnmux9Zy63tOyRGnAlbx2rrEqdARR4S%2FQhyl4%2F7Mvd8%2BU3Y8OhOJ7b8H6SXtAMEuY3pFPfdEjQeHbh3tLUIKpY78ijArBYh8FGPGLCIGnCtQxoGOgo4O%2BhTobGnDgnqCPiLEn7vGFEoq1FKuN%2F8fUXNL3s%2Bu3EZqvL9ghIYy4T8VOmtcoPswwVMYa4bbabQUw7rjyzQY6pgGboL5jgD2VxEeRjPi01pxTpkzozP6wU5Dmh61nY46E11fp0sHRon7Ffhq3YKXwZpUaYNLFApDK4kCqb%2BWFX0sjlkx4KT45yslIxFtJQg7vmp4emABMQ4rrcxfrBwY6QVCEbo4LbjnRZi9Pdi15AzidV%2FcJeNbgK9Dy%2FD4Chhhp1utJ7g8i9ykW8QFaD6Rq7hSJPhv7a%2FE05jeTSV072Mu79KlYOUEC&X-Amz-Signature=b77069c5d8e8fc665561ac6623daab0788fcc71a0ae1ba8fdd65d72305f1af62&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664UC3Q2OU%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031238Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJGMEQCIAmatA7oi1VRySBwG12Grtnd2nQSr4uwJyJl7%2BsdhQggAiBe30V9XQAG0b9FoV9bz61cPa7pZynkJDGSI5SyrvnGJCr%2FAwgqEAAaDDYzNzQyMzE4MzgwNSIM4iwV3Pu7T5K5D77LKtwDSuJGehJxU2a0Jh6euLQpA79KJb%2BhT94T7lEjcsZ4MneAkG81XamVYiTlWhxvrW00zq7gy2NaPQPcSmNUABU5dA9KDApO%2FXHeVMaQZmMh28%2F%2BKfsCHhkeTdQG%2FVxIp3qUflwSH6BxjzjtHfFMVFaBeSgWUdVFrlpHwSqKKQ5RViaZy%2FdmM75%2BhOTzbCfmxGqK6wgOs7XMnjfI8LE61oHAo8fwS%2FZNfg%2BCEc2uAPdsnEU9rZt8ONQ3Guk%2BlXcENbO8ZtRmUodzs90X8R2SOOVGnIobYk%2FuA48J9yyzqUkRQYgPLCRBxKdWy0rP3PC65cAr3y%2BPwaJrqgGqsowG7A%2BYp480sQa4XAC5Jg%2FsDbUkrnM25x31WeUyzIoK6BBiZ86OQ5dDSrWCYpVikQJR3SwD21xm87rkGpWb%2FNJuM7r%2Bqhig0v0Hbc4kJ7tRKUpxnmux9Zy63tOyRGnAlbx2rrEqdARR4S%2FQhyl4%2F7Mvd8%2BU3Y8OhOJ7b8H6SXtAMEuY3pFPfdEjQeHbh3tLUIKpY78ijArBYh8FGPGLCIGnCtQxoGOgo4O%2BhTobGnDgnqCPiLEn7vGFEoq1FKuN%2F8fUXNL3s%2Bu3EZqvL9ghIYy4T8VOmtcoPswwVMYa4bbabQUw7rjyzQY6pgGboL5jgD2VxEeRjPi01pxTpkzozP6wU5Dmh61nY46E11fp0sHRon7Ffhq3YKXwZpUaYNLFApDK4kCqb%2BWFX0sjlkx4KT45yslIxFtJQg7vmp4emABMQ4rrcxfrBwY6QVCEbo4LbjnRZi9Pdi15AzidV%2FcJeNbgK9Dy%2FD4Chhhp1utJ7g8i9ykW8QFaD6Rq7hSJPhv7a%2FE05jeTSV072Mu79KlYOUEC&X-Amz-Signature=b47151624a1c4063a81472ca219c2f476d76b17ac1f3abbe134497ac589f9444&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665VK5K7ZP%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031255Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIQCB1QPbZjqmZlpny3ES%2B%2BDez3nJNlmspoPGmx9WQbmFUQIgLuZb5hVfuoZq9vrHU%2FHmk9mDA98%2BGySUE1DYRMVXo5wq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDFykm2%2FWDjJfZdfJWyrcAwdBuM15txPyrRTWzwVQRrkptyzz5l00UhwPa1rMIu7gNUpf0e%2F0LWQzabjaH1EsVn5kP4RLD6XJbbm9cAtYiw7m1%2Fd5mQ0SFONLqIaMss9ugEmPFdZOAoXUIYbtOBq9lKjxxyruHquHf%2FDgpCJFCZvTLyhcvRQIUJsUpW%2FAWZCVPzqliR1Z5Wtb5Li2j5y5m0MZG%2BeAI4Kj5sf1pmqH83JaVFlg0WkZNcvJGxycRpDFKeAAXCrZXS3c%2BX%2FDuRKzQ4UdIfa0XJyCN99DLy2AG4bL3wHE%2FAIj6322R85IJ6WqeFQt8hdkQkeCbOb5XDxv9%2F8jomAshrTrp%2BjKFzvDaNEZzckpMIjUas7QMpxpoHo9DRXssMZsOhW5mjGnRrMQu9Eo%2FOTcKBucXZmzlpKcFwyhyFknYxVNsCCqCQ1pDHoMGMppP4%2FrlJV8LEhTIbXW8IgKZQTB3PqTnA970A4Lx42RsHpkgrAjvArvR%2F3BDie1HKrbWe%2Bhz8RnGDoD%2BbFBZbY%2FdteaEYgPKBU0I92OATEaBk7rL%2FxLVPNWh0AU2sZYnpKefH6LvJ0x%2BBNQrbs2mvJLwu33LMyiiZINIM8lv08TSo1gEcbWglCNZZO0Wgobv3u26iwWs6roOYP8MIG48s0GOqUBWRu%2Fb8JmGqu0RtwJ%2FRZPCfkZfUhLyeSOw5FgQUj5IIFzcfemRJ3aCjReW3u0EBrRx4ANYlkhJpJ7ftnvn8o5UXU5vmeJG%2FvoqrF8fAZiZbKq%2BnWFio8zoLzgr%2Bg34LWZzq66RqrsZH9P%2BoDd7y3BHjYT088sNVel5FxG2kgR3a0BqxsdbxT7gng1AZc9lFJ%2BEhshguoW9IE9MOqdjOtCV7Iqp2Vt&X-Amz-Signature=4b720311d5e5e292f85cd19cab6c3ce427d19e73325b00e19c727ae26567f8af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SG46P6UE%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031303Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGIaCXVzLXdlc3QtMiJHMEUCIDoYY4y26Bzf93h8IRBpPLYq1Pax4l8XEpzpqj7zXirnAiEA%2FWkkebVHSvxiwVtXz3BmdLAHMoP8D4IgNifVgT5Aut0q%2FwMIKxAAGgw2Mzc0MjMxODM4MDUiDHDN5GV41q3bKvVPNircAy4P4yTEMDQUgSv1AVYGnR0HUaemlTv6KX01uUJAuwG7%2BwDfnzQLHF%2FIHuLUtafSdvy0slexlbX%2F0eKP19Cka8HR1344vovkVX9ni70T8Ye4nHue8KP%2F9TH8QnRy8zi%2BttfO8gZ7dV7v9phUUmeIYY6b6ALK%2B9P1S7my4eQGu6C1KQKV7of8YFL%2BlQN0IABeIAVtNvaatgVLPPEUfDpJiavti03fD8q%2FcbkqmmMy32%2BLMptXZvzKyoiiY9QVa%2Bb%2BJDN45R8tM%2Brg9VQQDo9GxAjRcPbU2kW4s4O1%2BDeIZcqJ0asf5z1bHDFPvf3J1K0eCRRR93IbYtSvI%2B5wSZsfqOIbr0B07Tsza8g%2F3k2m6c41kM032kOI6DtdjeQYTymJBK9FJpG2ngz18kS%2FocwyRNYb8Qyr0MzAt5RCw9fOBQmqtij1kDgrSyEbRh85JutCTR0MgHF8cBIuwLKT3g2vUzLu0%2BdyOPncGmrqtXodjsarcZxrpW5fftTXSwkANFxYarXr6xAFgd1gyTxoS9%2BCFtMMNWZ6pJ%2FR4%2F5HSq002o8HpmVgx0P%2F0GNMTamJGZ7llRDd8HbXo%2BvgT7o1Uq0RXkbkgLOZjbJU7v1ZXAR4WDn2KQh%2FTVXwRrMIkGI%2FMP%2FH8s0GOqUB2JjwE0DyAwEeS0IVtZRbO8bX0X5CRXFAuogkBkjlmz9AGfAMr4%2F%2FIbO29OyPu4Mzn2gAP7%2BdENGloM9CPK6G0o3VWluOToDk2sGrjkhXyoRk1ANCIZ%2B%2BLYBz2svAuhFLDz15PoEVy8Iamr4sO93boB1elMt0F4lUSCdTnw8Z8S5UOGkfXA2ot4Kji%2BY9IbOWock%2Bq7p2L%2F8tvDPRugqlBjdNW%2F%2B7&X-Amz-Signature=7a016481be232851021cc60f4eaa963dc7184dfe82b5d0595b074de07b0cdbf9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UXHSLAHP%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031303Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJIMEYCIQDA%2F5v0RYFxjzeWleCXJxTxYA9XY7rxNbDbWDdMGYZPqAIhAL48FznBkdOtCgxtVRGhA0fpZRwapDv95OGWtJ7sRsojKv8DCCoQABoMNjM3NDIzMTgzODA1IgxYMOan%2BrbhQbX159sq3ANKz0z4S0o5bFnaLupTfLkQuZSVsEJyxMK%2BkfUAS0NoLnOT1OGpoS%2FmAIDZqjx6othzB0mEVc%2BRoSCk%2BAtirqOTcgAcOlznDmh0w0d3nYcHik1v44fctaqIjSIkvMgyalOTW5uhLaFiiM8uyJ7yk2fhfMaZu%2F70wl0A4RdqPZcfj3Tc0X6gm2VgS2%2Bj%2F75NIJJkY8Sqvx7vvJLLKDj%2F8v8e7D3nBN8ioW1gGypvg4YtXKGvnaftt8WO8pT05HDm9kbVHCOxc1L44Ba%2FIhH7b2FImncOzXvEV%2BE8kZdjdLvn6AS9FvkdcaeiwVxSqH%2BLjADWnTlvD6Qs6yzedooZNxxK5AasDauCm59BLU%2Bhc%2FCqNyn1gb9RZuCmBduZQQGvbXGaqllFE4dDjH1TcwE1rp542tCWDCil6tlK1c32o2OqE%2FS9BVy3o8fYrqoWRR3tfk5oANZ4IwZWCddCqa1PPqTHuZRSL43mp6Jz2Xg4VrBJ4LYZYqGyQJJrFg7O%2F9pKBaWpifB8%2FzGW%2F%2F8skH0aioYa32GS0EIOcOYNrKqO3HdDLi9giPhJFHAdP30KUVIbREKkTwycpYDX6RHqpiQOwFGonw7ihumomzYGKHBpbpCDoe3LuVwMLiX6pUm52zD8t%2FLNBjqkARpre%2FX9BgiL9iZwel%2BxkiHpr1innhyfIbTQ0dbvcd3rHSKvVj9hskeXgYoaSCErVEr81%2FBZ1KlIPVTCW7%2B8drAEVAtzjuKbP6LgWaPFBsqFhTjWSpUUaJjjb22uvzGZnvI8%2Fx2HWias4IMsqoOE%2FxNc4vD9Svkxl%2FYg0TSCIonYkO3l2hoNKZ2eHbsrN9gIc6jKAEX95ZvMuH2OLjfgXXta9CZc&X-Amz-Signature=8c6a8bad0391f7cb220e04b8888b030f566cf3e6f99562023537eaa29d146a4a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z6VROU2N%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031304Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJIMEYCIQDE7%2BAm8FAuDVk7ozbvdqyaTIGssHgsxhAPzA98PFpKpwIhAIsYePEMKtNqfzEB76TsCsKwXm%2BtmE5stoicjbD7eQ2jKv8DCCoQABoMNjM3NDIzMTgzODA1Igzv5P38wqGs%2BY%2BRhGYq3AOribIs05jZSyJXOD6mPypSSVcgeYusmhARQvU%2BPj52kdlxYHVT7oaaPovqcXWNOffGr2T1kO54W2By0Jb6X5soRb8zXhK5LPRjsGsAopReAEvsw8qx%2BU97TyErogUG%2FR70x%2FON15190%2BZ2OnbC4C354heR3M41yCTqAKPfQPa0gxIiEpJpNC3u6yrXXB%2BoKXK6bRFOKG28gUBlNSD4wd4sgDe7QARlgeWwmdtdb3MzQYjJvhn1fWIuyqnKAqHYZ3UsHWCBwaas%2Bx%2BvpS5mRfTG%2FhxoPDMFM31P6YJVilEev1wOEcoXGY3BV%2FUFqFHGIcGNvBjodHhRfXbkBJ9hhWtnaAEbR4O1WvQ36CPxzgd2wMOmvjVgHUq3k%2F7quIUUcMIL9O0HqJjwy55w8nGz6MIUNKIn34ZeQCLzBAp%2FW15SPgqfmvmJUrd2RYSrrSld8fmhYFR3nBvvAhAc0Wb1zaQsKkv1vsX9eSuvJYdMPQgyNfu1SdUK332gyMzTBTs7oNYImSrEr4ggoruNizRUEVhuuog3%2FrGIaT%2B6GWqdPsmjhJ1uxo%2B87iCt0jtyTzQA3kJ32bjdDs3FEuPK4XHkIo662jnt%2Bllo%2Fx7KWfc7v8JVg858Xw4OCbf4s8w2nTDpuPLNBjqkAelrjF%2Fhu8rPHrfFSvU%2B6Swy0V1Wz8q9%2FgCEzBzj8XB8s9iBvff4ZgAZr8klu13HUcLp%2BLFUXz%2FI5W7xQj9yac7XYZsESaTqUsUysL6NJO4RDokp%2FMX67APnI1j7Pz39i5T5Ze3I%2BAlLP2FN3i7SHNikNCbE4biwA3YLGS05Yyob9gSzmIgfNnF7cYJwLB9QGVRa%2FOoorU8JdSlGavNXgnnXxJqc&X-Amz-Signature=276d37fadec2ed8d0c1c42916a2e1c815ee54a3a454c8ebc38d912cd3b7c87f9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666BDXBPNR%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031305Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIQCcU3rtVhxfakcv5uGuM52%2Fnlj04JocU99nizXXP3%2FxCAIgNujsYD6lf2TBhHCaNvS%2Bu%2BNJu0n5eO0eQulUuGF2Dvkq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDMV89xTzMdZ9DlEbmircA6vAQ1NLixGnDlisjf3fXNzWQE02tSCtMO0DmPfH9HbXDZa6SP9WjIv9dNz9HhV9N53AhmEgdpu1lW3Hj6tREkJw%2FbO%2BVfgLfh9IdxadXBG%2B%2B5QbGD9qpi0Fl8u0D8St5ldHTnqTDQfp74XisRhSerbbpoFTAphFZgMpYiPPLT0Pq9Yf%2FqzdZTLSFjiGp7Rdz4Ary8Tyy9ydm2v3WohvIyRuqZmlmvApyGFhuNwXx1MW1TTr%2BUAYXDjVj9t%2FPouhbfDrAgbKcBclPBXlUgv5%2FCswPQ4g9BZrxaGhEQsASnpn3efewOMRZJTR%2BGuk5Abu6Zhq5HS%2F1q0DbLJvRtxLkzZXjdvGA%2BM3YKN12b3BSZEw%2BAIGFdWgdTyaVSFhgo27wyaT5vdnndYt7yJ40Tu4MzOd7ffsXH3qvBD6RBnhWnskVThExv9sJcyPPB%2FS7%2FKbsqY8h8UifmEfbiAzl%2BwRpNVno8Pij5p8AXKOIfYjNwG27ip8R%2FkGzBuTdqIDiWVekyGUCRYv4uJ8ZNd3YsupPUzmVf3UMgiRzaDX5JEfK0z2EfWq0ZePVzSB1Wyv0Y2UOPsHqfNoKgLANGpz0MkNGpit%2FKwZwl7kOS98tbAUQADYq5rOeLvOltm2eM49MLy38s0GOqUBXK57eeKFYfXVz0fH2AmWlcC3CdA%2BavVR9%2Bh8wocwY1DnGn8TWBPUQUVwQqpjRIgkGwMSCG5Zy57wdlcTn%2FswmRVmbLNJT%2FJvuo0yaxu%2FzRF5a1AETMc4Smgzl4ewabvBostbnV53vLR5sd6yyINHJtRCvV6eM69Gl8q%2Bmdr84aNEMVNBM05OYHZvm%2BdrWkGBs%2BuQi7dJ7K9TKpfq9TKnp6JTO6pN&X-Amz-Signature=776101bf7839f8af3e3d8621e423ade1e9ccc1d51b61b35f17614e8c96489f6e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664UC3Q2OU%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031238Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJGMEQCIAmatA7oi1VRySBwG12Grtnd2nQSr4uwJyJl7%2BsdhQggAiBe30V9XQAG0b9FoV9bz61cPa7pZynkJDGSI5SyrvnGJCr%2FAwgqEAAaDDYzNzQyMzE4MzgwNSIM4iwV3Pu7T5K5D77LKtwDSuJGehJxU2a0Jh6euLQpA79KJb%2BhT94T7lEjcsZ4MneAkG81XamVYiTlWhxvrW00zq7gy2NaPQPcSmNUABU5dA9KDApO%2FXHeVMaQZmMh28%2F%2BKfsCHhkeTdQG%2FVxIp3qUflwSH6BxjzjtHfFMVFaBeSgWUdVFrlpHwSqKKQ5RViaZy%2FdmM75%2BhOTzbCfmxGqK6wgOs7XMnjfI8LE61oHAo8fwS%2FZNfg%2BCEc2uAPdsnEU9rZt8ONQ3Guk%2BlXcENbO8ZtRmUodzs90X8R2SOOVGnIobYk%2FuA48J9yyzqUkRQYgPLCRBxKdWy0rP3PC65cAr3y%2BPwaJrqgGqsowG7A%2BYp480sQa4XAC5Jg%2FsDbUkrnM25x31WeUyzIoK6BBiZ86OQ5dDSrWCYpVikQJR3SwD21xm87rkGpWb%2FNJuM7r%2Bqhig0v0Hbc4kJ7tRKUpxnmux9Zy63tOyRGnAlbx2rrEqdARR4S%2FQhyl4%2F7Mvd8%2BU3Y8OhOJ7b8H6SXtAMEuY3pFPfdEjQeHbh3tLUIKpY78ijArBYh8FGPGLCIGnCtQxoGOgo4O%2BhTobGnDgnqCPiLEn7vGFEoq1FKuN%2F8fUXNL3s%2Bu3EZqvL9ghIYy4T8VOmtcoPswwVMYa4bbabQUw7rjyzQY6pgGboL5jgD2VxEeRjPi01pxTpkzozP6wU5Dmh61nY46E11fp0sHRon7Ffhq3YKXwZpUaYNLFApDK4kCqb%2BWFX0sjlkx4KT45yslIxFtJQg7vmp4emABMQ4rrcxfrBwY6QVCEbo4LbjnRZi9Pdi15AzidV%2FcJeNbgK9Dy%2FD4Chhhp1utJ7g8i9ykW8QFaD6Rq7hSJPhv7a%2FE05jeTSV072Mu79KlYOUEC&X-Amz-Signature=6821fe06f9b4043b9545433dd3cb4bac9706a97887d731eb46c0066cd13b98f5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
