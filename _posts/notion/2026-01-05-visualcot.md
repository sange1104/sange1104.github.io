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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663COKVTAT%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031332Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCktuYLn%2FZR%2FTFInLx9i5dIuau3Qkov%2Bq59ghUNzio%2BVQIgIQ16EckYX4TeIgeEe9CXVVcOOhmoN2BEIf35%2FX8H2P8q%2FwMIaxAAGgw2Mzc0MjMxODM4MDUiDLHzvmmLd3dSOoYrASrcAxINS3H3J%2FA%2BxG9HCuMizZ%2BMZ0XexWoot19xqIGwkmB0F4QkKlmiJbJhY9QtyaZuo6rnU9AvVfpYoso1mydszLfH3T6%2FkfxkmxInCyw0gqwpMwUjOgeIYsQqjAGXXewFInKwp%2F%2FLWgLkZIrm%2FmXdK0h5QfJHIG616UGXBgZ3YWpjeBIlKIrflkOyiof73y9Bp%2FjKWc5k%2B88e3BFpqtwu5j6uCtj8jej9mV0ok2lHin9yistzx3NhcTIY1sHzDbEBaI5AArvc4Wd92mnDWJiayLGQUwo%2ByYStEGY3Huq8hohL95n374xsyWZP4tLerr2rhwHDwV8rpTv8dgx1hQttZUTWUW1jpvILMXFK0cbKwj2Ve7lr4bmpVxv0OQe1oOfNP6R11paZyMEXHPmQ3y8fW%2Ft23x757jeM%2F%2Bp1xbt5ZVZ4FbdBxFuN91TygwVJU1r2AUbxYzFId2p7CaifjmHuBULJfLR9movNPmmgxGFpLn9KVOslRe0ol01naWrtuoCfQAdhVTJQgt%2BzMJ68joaYWNzedG%2FDAw2Apjfvz%2B3%2FQN3dTphaQNLLVuhXWynvvrPI6rbrhsjprWIgdEqLAfKSteyj4BHA1qVxDuck7RX87PAk95XxNbWbYr0ed%2BW9MJqzyM0GOqUBWYunAvzwHWSR8wSV1K0jtcosokIsi1coMDUGhNcS8A22pqoXGEvjdInXT4pUg%2BN2ztu6Ous2YouAylk2PmLR%2FGCO%2FfbB3lgZXEKX9kYYWpBAUkQi25EmIP9hqq5yBxoV7y%2FtxZogf2K6Qdsgz2GhJEjpRo6jfiu%2FbUucE8%2BHNzz6QKaQvH3ImahN%2FE2W3Qv1dvHoisMg8dpNcIAkaY4LfdjYe8dQ&X-Amz-Signature=3037d7b886bd0456f7c818ddc15f603444a3193be3f090c6cb27884db5851ed4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663V333522%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031332Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIASF%2F0CKHpEOLhyd0anNJIAmg35nEtPA6q4uDf%2Bmi5JmAiBfha%2Bv4xZNL2wTZh4UolEbBQDe00o5PWqOtdCP3MXjmir%2FAwhrEAAaDDYzNzQyMzE4MzgwNSIMAFd8gu%2BOZ0lpGbDxKtwDQYeAWzFv5Dlyzih5OCl%2Bx%2FHOWKjJC1kwxk30AzKXkOFwCMcROlC91U5ufxJfwcHwMqidvvG1VPJ55WMuFROsL13D4N%2BGdgKOUvN1mtnQlNuunZNKuzIW6h0mSVtzn5owMfcbBf3fUiUBnIaF%2FLVQKG4Bf8CPBeeBYVyN7B%2BL4fmQqOoDZnSgI1cm5bAfpwc%2FwmvTIxf2MssOreYrHP2kXCjBrxmNrZvslIM7FjWNgITMol6JQ6PR2TXePmL1zEYaFnDYKoK66%2FcEfbzk4jbdWkpAPh4v%2BwpZZdtyZKBR76ff1W9dTqHSARFvUI2PiDnD0RhQJGu%2BJheHi5itdrNBCKo7Q7d4llTZ19mJRiSL54n%2FRW9ftS3ScV60FdVWrHq7yTEBpm0ZULuBiMyxu0LYEk%2FpJgkc9sn58Pn31KZMhDlRBdgf3%2F1tOTCURO3TgWKx1nzCSeUq8y5FgxzHcACAUqqGvg1Rch2A9GRxnJP9esZwS6EQyP2mo%2BOcnXfBEiYYpYdxXWbqYcEhiKpAvpHjFHDYkEA6HISqp0D8ckZaW%2BgivTrJU18bmqKcaSnOP4JZdNswKJdGPYPUR%2BkuRgw6fH2Rr4gf9AzWrznHrWkeLqbr5UiAzttn9SUixj0w37LIzQY6pgHpSuHKJb7%2BnpAmZX75xTxFCAk9B4p2cJ0BJi03pV71wIh86j6iUOKogT%2BpMBTmTmCp%2Bm3bW%2B9%2BTGyrRlgq5dzLTMTr2YhDtbJkbE%2FdJUg5Vo4nBZED8mkXaR9c3OFnu6Oi%2BbqHWpX7ryodASKeBFm3qbbPiNlZ9Zy57oz4%2F1xKXGViLq4nUcXQrMxyaFDbWa5nk7Nofse7OjzT3xYoUWZeu2K1hUK7&X-Amz-Signature=b819b5cc848de5b8dbcd54eba865ea4e18eb3fdb90e1e3d0750486bcce30bdf0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWC5OXXU%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC12Kw%2Fod6O5b%2BFVBf4h1NCRj4mfn4fWcOwH%2FtxercO3gIgXZxfB%2Bgjn3stERXch58IVrczz10sFp0ApTsYVTMO1yAq%2FwMIaxAAGgw2Mzc0MjMxODM4MDUiDHpn1D7R7%2BhRTBn1yircA8280D%2BszPP7dFHfJlUMXWveqIsW%2B1j3R28CnzXBgJKCDbPtS1KHwufOUNvC0o5LnMPbuQ3pM7Oqe%2FaSFaA5g8fzQqF2YhLPtfZVBoeGclQofthkqD1%2BgNXcsiV1kf6y0sxVXQznuYNaJ8qSG5%2BORemtoJj74heQEVCktFKxuLeyiJZ1A2t9eNoCJliFpmo6FjJhBRpv8Hrf1YD1E%2BO%2BHpqS9OEG6QSRb2NN1J%2BUhAh9RD6nFaBZhrFuAJCL2irTVC2Xq6%2BGGrzUxvQvrpvckskTRxM%2Fz61Aa2IQOaF9QD5zIilw1OKMTGfznWeMJ0oe6Frh18ldpYJ56bdFX7hAi0OJ00gPYc9kr9SFODwSP4yuQM5MN8q9TZ3mKMIo%2BwP3%2FN3rNhp5LD3YYjO9ix2yJP22Cfsf9pj4lLbmdoAGrZhn2ecEW8NLj0eCvj5UvqNKaJpH0y5LCDVGndxsYRGYdmXF9vL2katSIJEFBomIFzL7rYPXBr2NWoRShRBUSytGuanq%2FswQd17I4IYO%2FWk%2F0cVnf%2BlmypT1dsbNxksMFkUbCm%2Fsq%2Fxhb3I9Ty2wNMMa4KC0GcTK%2BDC%2Be%2FUfwv8%2B4MoB4hoXLgRQkri6yzWExxR7PPjZff5D06%2BqItl%2BMIiyyM0GOqUBtxnIhrihRuxqFEHdmq7eHILYTUF%2B2s8ub7KY9YLQk%2BckkudzyCMRb23Oamfp8BX4AgEdkSulcpaCg1y6MPdtEwTk%2BeDM37r1nLhJcPX%2F%2FBGpEL3JuD44QtyCojMYqR6OdwJjNqc1eX5bF1XoLNq0urriv3lWLaZbi6YZy%2BqsfAsleYFtTKIojbaOmZnR4EhupAM%2FOZ3uDUk1m0qHiEYXO%2BsvN1wO&X-Amz-Signature=89725a82452643c90e9cde8c269bf9608610fc8c9656fbed386e9cf524b998f4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWC5OXXU%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC12Kw%2Fod6O5b%2BFVBf4h1NCRj4mfn4fWcOwH%2FtxercO3gIgXZxfB%2Bgjn3stERXch58IVrczz10sFp0ApTsYVTMO1yAq%2FwMIaxAAGgw2Mzc0MjMxODM4MDUiDHpn1D7R7%2BhRTBn1yircA8280D%2BszPP7dFHfJlUMXWveqIsW%2B1j3R28CnzXBgJKCDbPtS1KHwufOUNvC0o5LnMPbuQ3pM7Oqe%2FaSFaA5g8fzQqF2YhLPtfZVBoeGclQofthkqD1%2BgNXcsiV1kf6y0sxVXQznuYNaJ8qSG5%2BORemtoJj74heQEVCktFKxuLeyiJZ1A2t9eNoCJliFpmo6FjJhBRpv8Hrf1YD1E%2BO%2BHpqS9OEG6QSRb2NN1J%2BUhAh9RD6nFaBZhrFuAJCL2irTVC2Xq6%2BGGrzUxvQvrpvckskTRxM%2Fz61Aa2IQOaF9QD5zIilw1OKMTGfznWeMJ0oe6Frh18ldpYJ56bdFX7hAi0OJ00gPYc9kr9SFODwSP4yuQM5MN8q9TZ3mKMIo%2BwP3%2FN3rNhp5LD3YYjO9ix2yJP22Cfsf9pj4lLbmdoAGrZhn2ecEW8NLj0eCvj5UvqNKaJpH0y5LCDVGndxsYRGYdmXF9vL2katSIJEFBomIFzL7rYPXBr2NWoRShRBUSytGuanq%2FswQd17I4IYO%2FWk%2F0cVnf%2BlmypT1dsbNxksMFkUbCm%2Fsq%2Fxhb3I9Ty2wNMMa4KC0GcTK%2BDC%2Be%2FUfwv8%2B4MoB4hoXLgRQkri6yzWExxR7PPjZff5D06%2BqItl%2BMIiyyM0GOqUBtxnIhrihRuxqFEHdmq7eHILYTUF%2B2s8ub7KY9YLQk%2BckkudzyCMRb23Oamfp8BX4AgEdkSulcpaCg1y6MPdtEwTk%2BeDM37r1nLhJcPX%2F%2FBGpEL3JuD44QtyCojMYqR6OdwJjNqc1eX5bF1XoLNq0urriv3lWLaZbi6YZy%2BqsfAsleYFtTKIojbaOmZnR4EhupAM%2FOZ3uDUk1m0qHiEYXO%2BsvN1wO&X-Amz-Signature=f63ffd646fb19ef9541129b55014aab821aab238d486f0384683e631232a4b37&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663NIVVA7M%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031341Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDL0mpejGnZYbitCRWxKSi23S855HJxYsJmyKbMyiaThwIhAPfp3mNgaxn6PV0mWiixlIPTMA6%2BgfT416WKabkEH6fWKv8DCGsQABoMNjM3NDIzMTgzODA1IgzYcAP5yKlQvUkEOEAq3ANd4PFcF6zxkPotxGyD8DvGeQAZdj2I%2BdKVJrFALyRGD%2BZl6wUsEevCaCQAqrXN%2Fb452hdEdxCW0wynU2KzSE1VmSTh9DnAfHBMsZ08p6E1uTJcPwuGYV9YhcsOXikej1Ojll4lm1bWHBJRxMekLEnPVhNpGn8JtUZClLRQl7oAcemBB8wCd1P%2B%2FSk38ZNlLWSpRHUYQAiexkJFVP8YW8%2F5WeEsLf4JaUSxbaBruy8ZDoVXCzsXqFWBmWzpUww59vnUD1%2B2pBcW6jd2CJBwesNTF7N8GyNQMe4Nh%2BuZgNKyPRtMRsq8dZphcMcT9NVyExpDDFfuuKdQ8NEmGVqFLBM2kltmjGgp7%2Fuuo6eF7kSUv70keJWMeelIFFGa%2BPofvOxKwB3rq0MPak6jnOQet%2FYGevNFy9hdDtj7A2tKgilvs3gtJ2rTKErpKSJl7LmJold79FOsjKlVNgBF7X1ucrgH4QHbAzIcDT2GQk94mFBTFbJ0KEYPYdAJAw3mEXqA6pNUKULQhDlhHAgaPTsOGOJ4d07sLDwfpGNib5jAKP0A772%2F0xTvbHxQC4eAI20ARUPv3CfuV14%2BJflP8vJsjL6q2Ij5LLycWzAj%2BlSewtg6FmwA%2FFksoKTlfNQ8lzDussjNBjqkATNC7%2FVKLVGDz8YVwMg97v%2BwRUo%2Flm3RC7MfO%2F8xqFVpqe7K2t%2F1VwzwGrh7sl8Vk6fdVS1uQXuZhfxO3n6xNpkezFpv3eqgJQCdunPPXlIRiCkmtG0jRLKRESK9GgrQUE5WVW%2F4ohwGA2183zpXzSAtzQN76JBJj8xLhNM8ju4JKohKAceUA1vS3NZeDIC5CsiPcHaK2v8xjrsFEyUaoumh6bhU&X-Amz-Signature=38eb06e0a0ba16231185860961c82125ceb2678f2aca26359a1c5a1a35ef74b4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RTQPXNG6%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCO7mqO1nifv07oGZHpV1PF3trBqn%2BYmgK5HKAFaAbEBQIgGIFhNG94PBYRTQiRcrAaBFzoF%2BGuibLPqQaeXZeyihMq%2FwMIaxAAGgw2Mzc0MjMxODM4MDUiDO%2F63JCt75HTqfD3PSrcAyKzZlYfDxQwUvSCUepnY%2BrOZxxQRdLgn7OAJAbHXrSMW9jiSZ4w0FMecmS6SACfWPeWEmVeTlclXoVgh6f1gYnqSowpKbEMLG8AYYRGuzH7C1DOaP4NR22a2CJnjJrrNwOkpgVY%2FNUzSB%2BGsPIy49KgjG4UgEzXA5d2XrdD%2FuBtjzJ34CCYt91GJnEi43aSlxLGwuA1un3qkhBn1qB0t55OZjfp7BcUVQbheJCeC4cHv%2BbeGD7qNZ3BGVnoMY%2BllHNIN1LgObbSTZ9sMooSeGoKzCB0KAZ1c%2F0P03g34C7bjAeYG%2Fuu2MBviOGrOxCW8b2HREallvdM%2BN8OZj5CVDc9dQBCTs4y%2FXGYTuSgtpZhuG9CM%2BleyNr27ZmSAcCwn5RxA5j3lbzm0aPcJ2zZLUaKfJBBnnh4Wx7GYXcs8Gg31mL913qM%2FQ7Eqnaowwj1O1x2TTsb1LzM%2FBlBiKLJI7fV9nAbGjWo7jKNM6H%2BxTTO6PcdI7sLu3xuaoFgAUCIAWh22%2FAb8jLqQsPlWjhK5a77D2RTztwYEAOpkTxm0nc5jf70VLp8JNRhQyMaX08NBgAvpDh3nJIRvZ0Hs399d9f1xmu3adxRzPz%2BtlUwC6DNEIJ49JxXur75IkQuMISzyM0GOqUBQB2elBHvfW1mFyAO48fIfgtY%2F3I4a3dOhJY5N7gNBFVBNifz%2F7iY3e9qigO21E9XW8TNhIiR3yJFA%2BkrFX3oLEyCCCJyd9fnNMKFrsLdYq3uFvovmzMBQf34yowWE6oDa18wdKOsFRojjlXPR9ZAKMv3GhQbYDgIJgrhi7vRnAeDJNwfbjUNtJjLhxNFhSCSgNZ18qtngo%2Fj8t5RkjmZOBaLioIf&X-Amz-Signature=580b93e818eec185360fa9fd5c53e1d253ee0d05d62cf08cf36e170856e68d83&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VIE7RZMG%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC4PofUm13JntzEQXJ1l762jV%2F3%2FnQW2QnfIhYe7oecRQIhAJ4FWWFlrxexLiwmZQCjezY41Y6psgInhBP1SASvNfmzKv8DCGsQABoMNjM3NDIzMTgzODA1IgwDbOjzjNMpSYnBHAYq3ANqhJdtRMXw3XNU1XWsuuIZgsuthYnnN2QX78bkxmnhyudpeNap68KDp88zVb%2FydrXofv6o2%2FKaP5qwS89FAtwu%2FGXEr3K9h8%2BnQJcBXomSokjhC3FETwkVbg45EAmG5XbHoazWXq2nEYtu1qELUu2uUGEReFYCHOex3W2kJcoz4U1QLLNXy5mauXfs%2BnnYx%2B70KcYy70tHaomA4g4v1Kifta0q8EInNZjqzCnzcswHXsIJCIH65ESNCIr6vfS%2BXTaByJD8Hw2f1LPni%2FT3mt2A5ce%2BPtt24bMiElex4yKBH8VQlm9CEAXlQ9SCmRTCm1PkVKJKiEt%2ByCT5ei6LzCnUbeB34YZUd1HvE9H5PzOnzCta3MuY6fGyQ2NwRGe8rZjDQSjmqfTsqMue8TZcQCoOJryEjo0HZydYROZSbbjtMTE%2FH4AsdMy2dWND0TAV8rX8K%2BG692V44%2BrUCL2lMnun5%2F3ea4KfIVDJ9kIADLRVbV32SXJ1pwR2XFEc%2FV28DUSYJ7jJoCP91xL9s6eK4bGXx3JDHCQlq7pYnVplsgfipkYzNPtuR%2BcHmGqKioUb1Csc1wLhftYwv%2FbKpdhfSEroRzdyfDEqOv%2FwFe0QJ%2F8Q5v%2BxFZ%2FnR6U0zP3mLjDus8jNBjqkAeNqzpkkWNiRdFVUsuRi0FvPjqqdgeJWNNuBf%2ByFvznYGHzax%2BGsozp9pU7imqnxGu7qY62%2BQaa7ZlpFCB0GstnG%2FYjBzUFfbbxVZ9SKazgCHO9N7cvo%2B9IEag7Vq5DHqX6mKUuJH%2F1c5ICqDJPA6w9SqxCb7WHK7YSjCwl1xG1i1myJJeYZpwu5%2BVxhUqfLoI5ppRVxrWD5jvkj8sJ9PFMEHnAf&X-Amz-Signature=467f0e6403daab0419e66671427efbac5425437e2e0b23d53bab18e1ded4ca2e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665QZL2NET%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC9YZOFkYFIUzgUkU1HeYPtz8SqBe7H99pfkl53Zwm7yAIgPmEQmEjpjZ8sa0b1Ta6IGVeRBDr77SXeWgaVRBX8AK0q%2FwMIaxAAGgw2Mzc0MjMxODM4MDUiDCGt9s55Ob4cRJejASrcA%2FE2hrmqukDYuf3gXzXp%2BYL2i8GOW%2Bm9NL%2BO9fCppIws6UpmdbvMAekLmsDywnjJFRttm%2BWbXQ%2FVikn1Fq1pHrmiFHFK9GXJijJkR%2BOVygYup3d%2BYLATH21UnWUqLG9GTa5rycTo%2FUxuEN5EqiDf%2FXgAIYoTlUE6b%2BiieC%2F6cxTgLZ3qPxzAWOdj6vx4dxIMGQYrDOrEqTt5HvPGpOgV%2FH%2Fo3wkVyrdbue676k4AqiquT5Fmu84G2FE33hsN15dXsKf%2BxYnnxQg6wGHiRWqwdzU3AmlKczVaTy6jTkMUouPL7T3Hw8YpukDiw4ji0RaydsO4hz7kRxwtDQG1YH8d1558YshdlfNmmGhPTk4tUppimx8xJwnKmDPrkM4j%2Bl6xevyj09QJHxsIeL7IJ1zde6I66EB767nSPt7IsMFUwS0UdwOy2ysTAZNydrghkAZqi2NvvfHkxrO7Hd9XAugI3wxq%2F9adZAidqYNVwpgism3J%2FyuFjVw0cAttE3pIwwy5g7O0y1HbPuU0LoUJcJDRnHDANisaOfR90nvORGiVYV6eSDheX5dsNxDqfR8tNCdA3msdsilVPFsmo5PozW8luXTpcFGEhJjjY8jgn4%2FBBMxiQp4gtq961fk7M4x%2BMJ6yyM0GOqUBIBv8ajw7Pgqf7FsfvY5325ZdA2yM2OrkM2KBfDsFcHVu8HKa8bZaGQxMF2s2LTYKtq10igD7cK%2FeIgdm6W%2BMwVTLGLQdXbd1LacOSMZab%2BHMG2011onAs%2FyXX4kSx63TKrqutfIQV4xEPYl3jDrhFX0qvrp7G50NJyGzSs1omLyVLK%2FnT%2FKleMF3VofBiZwYwst8ukQeKcrXeOvuGiS58CyjGBTe&X-Amz-Signature=f3a0cf3172777066badcb2cf1b51fd9556f95e36b9adbd2c07e38a2674672d4b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VSB673DA%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGLmqTn1tb%2B7JAZuNZKIqCSYZLXKG8ikuGgtLb4c4M9oAiEA5jxjCQiLcQ9%2FZo1OP%2FCioPjhzx4r3Hc%2F6u2FJyHRSL0q%2FwMIaxAAGgw2Mzc0MjMxODM4MDUiDNzKTQOASQaypmf5rCrcA6pb6PuclaIXAHNIi6PRFLBm8%2BKgLt%2FWsYTZsVM63JAxr3ZghmMjcev8mznDyDBVNI74aRNlIIqY9DXz05ajCTqDjwoIRKYSOmi7Xyc%2FZMTPhDnXPZh1Ne9WKRESQ7wDN4kk%2BcL7Ss9wE8THxt6Af%2BhQi2Ckw0z94QkmOhSEyetQOqKC%2FEoZf4OBspVxFb2%2F%2FHCygGIx2W4Yv6PLfi0Io3c0riogiB%2B3Le1HP4qvcc8IXYVwVuY59gQorRtqWJs7SzaH7rcqNaUyiPfhx14QccxoiBTIwvTUICKsesFPl3GahQVhFKvPDFjPVsc4wPxt2KznslDnEuC8oWPwZI%2BQVJ4dlyg7ksRajYnMy248rQJUnHQSfMwTqA2XqRPTcNZLlOZ4RMk9gul0usLFEQF3t11DJ8VPlpK1OdLGi8hTnn7ZveuxKrhtpplr07VwGa1LnmBBXvIwyVemkbfShBnW0zRd14FpkGpN0s%2FxBbWrvNr%2FK8VPx1JlGlUb%2FTTwIj9638HB6KR6QsSzul5BwVppb0gYnKc8aNPBzPo1odx5NIj2iq5erhub4QTrYWEQyLnm5w5V3hjI%2Fc1z%2FbN9nBI0daylqoOzG2JEgewIionSauxBOevN5y6jKnCRVmF9MImzyM0GOqUBPRW6R2FHp5wB32hQAhSVyY1OJH4esGhRQA2GZzB7O6na2W8NrQq0Kz4iMQmkZ8rf8sMSIg05l0WmVzhh1V3n83HpmjDPsSB1iESEPqDpVo5DUFUqTaiFC%2Fd8E4hGL93KYj1fwreIcM0tl6dAneIsYxzMBZpA%2BGT0FzaXOcbS9%2B6g8sNmHIniXLSh4HhtYfl10LCxNIGq2jK9WP8Y2lSlSMG0YjXp&X-Amz-Signature=ebb29bdce02dd95e07ed8975a088cea6c3888ce762e194bd73ffabdabd07d5e0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWC5OXXU%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC12Kw%2Fod6O5b%2BFVBf4h1NCRj4mfn4fWcOwH%2FtxercO3gIgXZxfB%2Bgjn3stERXch58IVrczz10sFp0ApTsYVTMO1yAq%2FwMIaxAAGgw2Mzc0MjMxODM4MDUiDHpn1D7R7%2BhRTBn1yircA8280D%2BszPP7dFHfJlUMXWveqIsW%2B1j3R28CnzXBgJKCDbPtS1KHwufOUNvC0o5LnMPbuQ3pM7Oqe%2FaSFaA5g8fzQqF2YhLPtfZVBoeGclQofthkqD1%2BgNXcsiV1kf6y0sxVXQznuYNaJ8qSG5%2BORemtoJj74heQEVCktFKxuLeyiJZ1A2t9eNoCJliFpmo6FjJhBRpv8Hrf1YD1E%2BO%2BHpqS9OEG6QSRb2NN1J%2BUhAh9RD6nFaBZhrFuAJCL2irTVC2Xq6%2BGGrzUxvQvrpvckskTRxM%2Fz61Aa2IQOaF9QD5zIilw1OKMTGfznWeMJ0oe6Frh18ldpYJ56bdFX7hAi0OJ00gPYc9kr9SFODwSP4yuQM5MN8q9TZ3mKMIo%2BwP3%2FN3rNhp5LD3YYjO9ix2yJP22Cfsf9pj4lLbmdoAGrZhn2ecEW8NLj0eCvj5UvqNKaJpH0y5LCDVGndxsYRGYdmXF9vL2katSIJEFBomIFzL7rYPXBr2NWoRShRBUSytGuanq%2FswQd17I4IYO%2FWk%2F0cVnf%2BlmypT1dsbNxksMFkUbCm%2Fsq%2Fxhb3I9Ty2wNMMa4KC0GcTK%2BDC%2Be%2FUfwv8%2B4MoB4hoXLgRQkri6yzWExxR7PPjZff5D06%2BqItl%2BMIiyyM0GOqUBtxnIhrihRuxqFEHdmq7eHILYTUF%2B2s8ub7KY9YLQk%2BckkudzyCMRb23Oamfp8BX4AgEdkSulcpaCg1y6MPdtEwTk%2BeDM37r1nLhJcPX%2F%2FBGpEL3JuD44QtyCojMYqR6OdwJjNqc1eX5bF1XoLNq0urriv3lWLaZbi6YZy%2BqsfAsleYFtTKIojbaOmZnR4EhupAM%2FOZ3uDUk1m0qHiEYXO%2BsvN1wO&X-Amz-Signature=0fd8801440533a8cbcd9db249dacd3d485fd5ca4551c4e8a5e21b367c90f983c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
