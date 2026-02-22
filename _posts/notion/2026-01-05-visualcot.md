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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UFXQRCWP%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031650Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCSNxApd26%2B8ffFnhTxGThHxpyvEKLuOGTyopvj1QhoogIhAKI5vsPe7d6lAezKe4GKAIdA%2BrKI15duwGErwJ7yjPcCKogECLv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyGpusGRaQwJCMDw8cq3AO68GtENLvPuWxLOOykg424ctuNzplhLqi4tnNgPiix%2B1iQ6C%2FwS5ZHpOVD9v02oHoyT1SSTJztgi0r8obJCQJ4WaAcsjH%2B2zUpH7xnFX169zKInbBm5NuxHJrNOAyPbHxGndnyFyVZLMS4UESUM4BaK3So9vc1N0dbLPsFOt7Aj0hn%2FreW86YrqoJsgDG8Pw7NjzHznZTZ%2FiC4uiASnz%2Byl2YRquoIPy3SiYbhQlJoJfmxdyV0KjVRbjbG8yL0yKwWLVbURdnosE6nBtL6A2qejCbPfd3Fasf4a67A9mpg4QWIkU3BEcooM11EyoCoxOm9Yo6KZFBNPeoD%2Bfju0wUaVdQKNd3cfZyQrjJfRwvTb3bv3BM%2BpRcB0NvIMr87OCpTUY%2BUiSYy4YhXWX0WbzNsHQPMBTwZsNEmMmTIc75OEVfKUfGHdptGNSLzerG4wUhVNl1oe65p8cCLsfLTnqq66oZfvxaiBLqjBKogt6XgqfaXPPYerrvPAJd3nN7dgnSTrU8UZcQGMq4ut3v%2FGqsoPYrzr36eS%2BSimcWENxxEFhhF9a6%2B3Thn1u%2BWvn%2BV2TYcM8d1ELsi8Ky8tiH%2F155A9Y9xZAflva4PHCbWcMehwzTTXxehVStTUMwngjDczOnMBjqkAUTC347duT1Gdqd91aEp1UVr0Hv1QE6CshGLgAa1Ar5DIlcLP5rS0qzw2J3cCHTEQpuO67mrAxuY83musQ6Sockvlp%2FqIjMbbbbN4z1XduI0gSzhT3%2Bcp%2Fj9wnqXwEiouTZ%2FWS7iCbIxOVQr8pyIa3mUXZJFOiLR55qLfSxkMKnrErApKdJOjhf2EwKig80MUlUugWxCTnJt%2FxK3A0eiQPozBpdr&X-Amz-Signature=0c83e1330b1003c6618d59c27e9e070d5b9ea551fd44ccae1887ef952b239475&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664OSXVBPK%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031650Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDzM9CKE0pC2Q75SLTVZn6SMI0s%2FW2idWMjCyWLXUM4PwIgH8cMdFeKdF5HBllYvLGFiFq5FUckArTzr6TkTbL58E8qiAQIu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGc5u%2F6injC0a6iNCCrcA9iC0bYcTan7KSn%2FQyDGcDZmGQuhVdtCwaaBTfPm3FdBZh8uNbDmQ1cYyyNyYiQM1EQp4nVRkCRj2ATRGKBsvVdllm5gxLVd7NfsotiXLNkBgMjOqoKAhNwb%2FXFD6gWEFMe1cY%2FYI9Xd3WTElkeA4G%2FNnEz57pSC8F4rnULFvk%2FWasvpj%2BTbImA8CljWTZp2yncSGx3na7u9acHi977o8Ara7b1uoyWUfnrM3WpyCoPrjvrqjxibpA5n3eAwx3mOZwYfZttpgBi0bZS75jwDGy8HrUun%2FixojjOUcG1lQlp4f4wytkDdUcn6Yaq3yTDq8D8l9ZKoshUXcgFtaO2naVBQLy01OV0UFAn1gnX9COsNU9rgeg%2BAnYiVBDWu0q9bxzd2OwRIx0txKluBy%2Bqlr7xggp6atmfPb9GMedZiXSaLIJBvQ5sSHHynEbkvqY%2FK7f2rRi1GXAAfvb0g%2FQpDzgU6rDalBrYMnq39KXDbWFOoPz6yWpBehmlQrVpBbxjAYRBAJUojM%2FK9akgoLMW6%2FAz1MGwYo4%2BCiizpSkVKUx2LYGDQr7NsZ0MR5R0iPZO9qHKGIX2u53MprUwIHCZjGRLTnmStv8sY0l0Cldye9Zo2f1%2F3Aru1E%2FYv1SCkMMPM6cwGOqUBMZ3vrTHJJbKFTbrJADYFbVM%2BRaiRd2JtN18d80JqIBrcOWi3ELV3fYoY3SJHT6CMQTrfdWeaitn8ar0%2FVyAAiEy8gboBt1ry8ifU2jmc07jaRvNbgIYgC13nVOFXes6sb8W8SnBwU4wWKz14nkSTTaNa9%2FIHl4qSoDX0VDN9oqCjp6NTSWbNshuySgjARAUbN5%2Fa0Mcizm2dw4XDOfq9IeJm%2Bdtf&X-Amz-Signature=1018e11a116e3db3ee41b8551c1d7621eb19380f94c3ef16ce3968f41e5aca4c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665REE2L5U%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031638Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDSN3WiI1N%2FoRgUzQxadSYkRtuo%2FgK2W8TvHTuoOf2t7AIgOgUjkUANSSkBEdDUatjrKji%2FExe6FR0%2BAqX0%2FVi09B4qiAQIu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH3rrUu8kMbYnvvusyrcA5G3CUnWbyF%2BOA3SSBJijUE32pLxaaTLTHOhmfNwikUBFh82iIyu%2FsEGRFCJy2h7PokiTD%2BSY3UZcgOww9M2eUY8JP9nPUJovias78vfZOMc3St7VZ%2BOVPF%2Brf5%2FSj%2BBduYJYxq5loXzCHX%2FOE0kAkntmeOkrf%2Bb5JrtnzJPvcLMfuc3w8A6nP%2BfHVCc0GJFX91canpDv5Dr6OHyM2p%2FClDRjXkIwxYqQWgDsu1UpEqZ5bUKWInruiibbQq9cwKebSuWJUyGjJKDeRKdf1likFWfV2%2BYDh42rjHJRrhYofCAgp8hZQY2UnBu2LLxCOgPwz4LTbgmaEHsyAfevwu0HbyQzqv0ngtSXkIvYFS4KJDY0eWDjB3mMjpFZuDYZWlQNhfQtB2pGfmbHLu1NNLiMkI2EPpC8ojiOl6mWcwttfDwGvj7SVDfqUf8gakyYdSRzNYmpUEr4aabdi0OIjAb%2FpjIQk6FPUwZXTZAMogeX6YZUwsHViu7I1cOvhX6SCQa%2BlN%2FVw8RGKewKpYmsP3I5Bian%2FAAqrGs%2BZ3YwjqMs8EJxZHnIvTHuF2gwdkB13Ias2tgmAZ6kKhaIKgW5Bg7mUFrs9lSo5YLnmJCP9NRflZVvQXsB31c%2F%2FBvjumpMJPM6cwGOqUBhMeJn9NB37LERYnKyx4psbu0KFqT5k9sBCJxYDo5I4VS1RQbODvNOOajGHgBu5G3ts%2FU%2FuMNgxd3QPeocnpnRs9e%2BJL9ggogQSu3JwYWqDlMzxC1aV4xQ%2BMetPfbcVAMd5M3jlCBo14fULHtxwmys7yRcj1HaZ7Pa0a%2B%2BW0Ha%2BR9S%2Fn8qovz2mfxl9viMDLDJYbr9ZJA9JHttl%2BUBlJi2p1aB7y%2B&X-Amz-Signature=4b12c135d59e7bf438683fa71a095329a95d2a970934bf773868faaae8e3abff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665REE2L5U%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031638Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDSN3WiI1N%2FoRgUzQxadSYkRtuo%2FgK2W8TvHTuoOf2t7AIgOgUjkUANSSkBEdDUatjrKji%2FExe6FR0%2BAqX0%2FVi09B4qiAQIu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH3rrUu8kMbYnvvusyrcA5G3CUnWbyF%2BOA3SSBJijUE32pLxaaTLTHOhmfNwikUBFh82iIyu%2FsEGRFCJy2h7PokiTD%2BSY3UZcgOww9M2eUY8JP9nPUJovias78vfZOMc3St7VZ%2BOVPF%2Brf5%2FSj%2BBduYJYxq5loXzCHX%2FOE0kAkntmeOkrf%2Bb5JrtnzJPvcLMfuc3w8A6nP%2BfHVCc0GJFX91canpDv5Dr6OHyM2p%2FClDRjXkIwxYqQWgDsu1UpEqZ5bUKWInruiibbQq9cwKebSuWJUyGjJKDeRKdf1likFWfV2%2BYDh42rjHJRrhYofCAgp8hZQY2UnBu2LLxCOgPwz4LTbgmaEHsyAfevwu0HbyQzqv0ngtSXkIvYFS4KJDY0eWDjB3mMjpFZuDYZWlQNhfQtB2pGfmbHLu1NNLiMkI2EPpC8ojiOl6mWcwttfDwGvj7SVDfqUf8gakyYdSRzNYmpUEr4aabdi0OIjAb%2FpjIQk6FPUwZXTZAMogeX6YZUwsHViu7I1cOvhX6SCQa%2BlN%2FVw8RGKewKpYmsP3I5Bian%2FAAqrGs%2BZ3YwjqMs8EJxZHnIvTHuF2gwdkB13Ias2tgmAZ6kKhaIKgW5Bg7mUFrs9lSo5YLnmJCP9NRflZVvQXsB31c%2F%2FBvjumpMJPM6cwGOqUBhMeJn9NB37LERYnKyx4psbu0KFqT5k9sBCJxYDo5I4VS1RQbODvNOOajGHgBu5G3ts%2FU%2FuMNgxd3QPeocnpnRs9e%2BJL9ggogQSu3JwYWqDlMzxC1aV4xQ%2BMetPfbcVAMd5M3jlCBo14fULHtxwmys7yRcj1HaZ7Pa0a%2B%2BW0Ha%2BR9S%2Fn8qovz2mfxl9viMDLDJYbr9ZJA9JHttl%2BUBlJi2p1aB7y%2B&X-Amz-Signature=559beedf680ab1b9e45eff022835d4144e223ba2624f55bd54ba73a19c3fcc44&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662IYTRWUW%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031656Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG5FxETWLufCgzKcPAp2NgIiVOuo2P0G6n7OOun0DHD4AiAlayMs5Rkznnm8TkCRvqrrVuQL7ITzjNUZZH7NrsHi8yqIBAi7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM3iecZLlE2PxOD%2FGtKtwDE2XHxTMmgvmsegGUZ77U5W7XfvfJPFvWV3%2FjRbB5WyZbE1yGhs0IVA7cQkpPIl9AogvcNa0z8IIFoXp9iH47ThY%2B8Bodg9NO0U558WyJpHoexRDIM1v%2FMi%2F7fSFomE16H1Ig0RvEMANXL88ThALN6OHZb0WwADFg0hNsOILc9f0Lci%2Fugy9lyMxpCJlsJy7ruGTEiSpyUjkyF%2F%2Fb4kN1hqZy9CRz8eXodhYm2xHhh62JddxYpF78Y0gbVKLrKxj9SVernOT0N5HcxthtQwRhrr0DNZuCI9KGxOG2GtAwbAs8V71Tw%2BAFLVPMvzSHNfoUMPlGE1VmLKtwtC4wtKkPyj7GrA0mgTEterLzL0oJsrQi0MH0gCS%2B1pg2SCd7Y4ZFrMIUPw%2Bkb48CA21Sz7jWbCRFQsg1w%2Fr%2F%2F2LgVei2h3YeHXywKWXxiFclvajZuc2rhYMMLpvOhncSyc0I31GXEpAiG3Ie7osBmqCZaP%2BVRY5vTo9e5g8Y4sZgpzzajABKpbavlXOoeRzwoK7IjOFg8C6fY5%2FJ%2FLGbowdrfzxyygJmhN4imNarRLhQDE%2BH%2FV6L8IlEGNdsU0Mch6RI%2FzJM5d84nUv0E%2FnpeyslL3xweZ6h9wbPf%2BSpO5yo9ZowqszpzAY6pgFAQiRoMabH4Qrkfj1SKcRZijysUmNuQpTlRb9s2cXroOaLrUjG9u%2Fe7lMzJ40FgDnvnMudXTBDPbJuubI%2FCyCJQ8TkvXedTN%2FB%2FkslnAtnIMTBjdKQrgwxptfs9IgVxsoDj8udHVKP7qJRiUynF%2By8xzayJ%2BDopjMDAG7q0Qq7i%2BUhzyaM2ZuGuYADu0pxzDpk3%2FJ5sE9MyrIIFy%2BeX%2BOce09sbHIZ&X-Amz-Signature=d09aae6292afb80d331f886a67cb643eb34f28969c7c0dbc266a972519af592f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667FBOVS7U%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031704Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDztgSnit6kASa75%2FPDb3%2FE3tnt2urDCSFhyBhpUyQDkgIhAL5rynahTkHRJvHYNMRclz750lfCFutK%2BHTT0Ew27OJ7KogECLv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igwt2CxACeZbrNKeQhEq3AOWyQCQ3Nb781CeecgiDXOaUW2iGB%2FKKYCtRGonQ4o2jiDMe2OBzWI8%2FEMh8lnnOeLz0q8PfSgsaCyuzRwVQnJisllutdy3oHm6u%2FUtHXrrSW3MdXgcjfm73DiVQjWGrkHZMMZBtGcwSVGQTTqNdRE0hC2sCz7M7BikDVwE4wCR%2FFEuxZyjyBdHDl4MS92LK9uyNyKWBvSGCpJF%2FaHSV3%2BDq49zYCk%2BYfRHSdkqE0LBqRA1B1NiqQlfX3EVOe0IjstE1jkKyD3CzF08OsoXKwx5iiL0t1BfwR4HmKJL%2BypjjHZKLRVcIfY0iG%2B3v3CIit4R6e9hjSvHYkZGZ0bDmvXZF2phuve3%2BvkeFEqkaz1r9vQpYx08plyHVwtCDxXEjcni6p3jLu6HME1tBRgRtxT4R9NHEpnifKAEOC1ILUYhhy6LrcRdvuC0g528t6wkvo35lbWG%2FfHrdtHVezzZ7JpuDQFwkYviTgpL%2FGzIEG%2BXHdsykH3KbxayhejhtZwq42ShUzWAv2Z4dxtbEK6NXLw8NRW%2B6Kp%2BorpiZRR3IiJ4ZVLGMvE%2B0CbXZw5CmIdHeIQLYS08JwFWOSBIAiV2FTN8dpfITC4dWUG2%2FZP72KmkCUnT8UNSrQ2SRS8b%2FTDtzOnMBjqkAW4U5ANDSWwzsVfo4dWtVjH0c4IVMWnQU3NZxxGgTNCUH%2FsY60x92QyROLG%2BF0pvEiCdTCKNO1daInkN7YzH53wjS93bxxcDrEHWOiVxK6ZZOeMkjeZZDh4UnUSVxU2fofM3mHWF9l75e4KKFb5d1Sztrdjcns7%2BJtDmIDiMDazU1kepYShSshoV0aujU71LDqVj9CNPOL2EeWJaCqOgaaFgS7vH&X-Amz-Signature=7a818040283d6c0cce3ae7a8eb1979cdf8f5790f1a28556dca0b253d5cbe4b4e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q55WYZOL%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031705Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHvttdZBMS0D0%2F88YF3fm41Ea%2BXwch7kON7k9b7PsyWdAiEA2IAdg1N3l%2BFdFmv3sgAAOgacDABwcTTF5ucD5QQHBfsqiAQIu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHbQ4bBj9hT60PPH%2FSrcA0mr9gvM4lFZ06lOckCz7crp1CZlDTmZLJeNY7WycwHemSNvpt8J5GaV7ypWQyicjkHTvjZGplm4JGRbiSlJRi8TssnNYPr2Wo4eue9WpsKGeyg0pshB384AbOvA2Apk4Pqm8IXYaKI3%2Btr6ojNI0Tr1qV%2Bl%2FXXzRGmZ68FdPXg%2Fu195e%2Bn2LRexDCOD5zSHR8NJSDEaJuiKO%2FGuNcRlLjWuEwyCK3XHU1MN%2ByYKcQkFCiXAO6ZWkRFZQm5L8B%2FfYJMpJ8f1NvFxmvkwuePIvRD1%2BoySw7KPf8mNmdJBuKJeUjB8Wp%2FYTuAdRWAIcqEoKJjMW%2Bd3ewYrqe5Wbur2yx499DuuEefgsikWadbDWk0tgiqS0V68l5Ua72%2BAmdXkOTqQ1tQkdQmW3T9P%2BoYOzx7Lj2pqPHJIVaOs88U3wgiXuKrHkzsOKqONJrzBFj25uiVHsu%2BfTb%2BEpFe3MjJ%2BsrMqs1slM%2FLzO80qdk5haUk%2BU3YpgHL9g6b3BkOwmjJlTVzrvrlZ0cN5%2FK8T9Ju%2BjgfwFy%2BeGxXbtSlvdbP%2FA1cXMi1I2%2F4guMLPnGek19Wf5%2BUmvJrkTUPVtk4QbmDPBJVpCvoxy4m86rwbT%2FE%2FtAtX%2FZgt%2Bpe7l5mB5ImeMKrM6cwGOqUB2p7lruwqv0ZK3xc5N1%2BaIVbfH4OhXWIV%2BznjHiZidAb%2Bcs31Z3gQKKta0tmv7G3a8YKodXpGOROjrCuLCu0eMfBJxZCm0kx65%2F6lL6jTjuY6cwHvHrOnSphgN%2FLI0PATrY6DeEXzjp4UD7siYUrm3jnOoq5i1w8RPbW3ULm86CvmQywiLvlCLq330WvEsmpB4klP%2FpNIRnvXM27mSPGhKIkhCLiI&X-Amz-Signature=30f1de3d8b2ebb9500d190f364394fb89567cad31be5dbd1a20bce7d89159fb3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TEQKYCSY%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCuaECjvp1kvMCrjRCF9Pb4Vtt1wh3eO9Jb9UixxgpGnAIgeB79wT7IQiMLrwfE2GeFUgV8qzz1q64UjQeR1hJjqkYqiAQIu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDK49zJt0IZ1P6ABa%2FSrcA%2BYgx%2BeKY3xcKuqPbjxuwuYiA2aCdVtxsNuuJoGZNe%2BUHH5kxibbV71vB6nATjSyo1FMz0PuDOTXnRzMZt4K7ncoLQtfTCfXc5PqtDpJU%2FxhSaeozLAU6X8pMPqROG7sZTqYSXBboryh5ZmHS8p%2Bbqve9DZzGsSlE8YKYvPgc%2BqcDbSZS4zMO%2BqZj3Zx7pmYDEwnEW6byXXrc7EG3SykF2sNkZAssPNj%2FOaHF%2FTsllJnbZP%2Bm19PmX9UIdmW4bgLBCPBi23JjPB1JEek2b3YsZSbrXrL3oycp2V4tDs0E1mU0s8TYaJGs3pnLIHdqwiMTz65LOMZEJvNuXQDM2Dwq373CuFXwEh0ErM2xeEFQgEiBLrHrXLrf4rBdvfG%2BwtfdKncu8BsF77TUgdni9xeRQQxKTI6TVIMCDERAkwOMB5rnwcp%2Fg2KJzL53a5ePuu1hJTLjkcTCe%2FZv1XqNkB1RoW1MpFtAXD8WReVKxAEgvmMEqlx%2FCKyTiUdbjNmWjrEtEPtHBY41ejUeMyl6dRAwEsEkzpxzLRwvc0p4KaEUNCj1H1fWgJNt8kxOUYV3T1C3b35ZtSkGZw%2BpXD9yQMaIqBBH4uKtpPbczb3DZb3cyNT3FthaGbJT6FC3%2FRhMIvM6cwGOqUBjrmHra9Iyn1PlhMo%2Botq5JbmciFYyHAh%2BDbbBfBEqsO96pdLlhMFhMFVNFgMq19Sv8VTBcRzYrOlHLaPyaqQXK5FHhbZVDY2a5DISbxlKYrCoGVA21TvQKEzSZtyuGF6TCK8RKOT7DIW4tWAySXTTatpO8ronHsrSok54yZyTeW3r2LTe14QCFoCgCo%2FPkQr%2F2DwOkd66rtC67eOHkjD%2FT1TlI%2Ba&X-Amz-Signature=4dc8446a48371002a16ca4ae338e33e89d773e1fd1e3bde29919654e994253fe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666WRSWG37%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCzwqO4XCpfngFrMmCs7o8BSZ0xIih88UWZvz1qGVqWgAIgfpTfRxc9384gZNiWPFHdL7h2GVSuEoMXmwt35IgV0KoqiAQIu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKd5r1qANpsEx3O%2FBSrcA20v%2B2k4l%2ByNcU%2Fxdjf7D1h3IRA7%2Ft9CdqBX81qBc2ztROdgGRlJtmUZ0yltDRXgCbVGNj0T55hqG2W38it%2FLlLBPr55BBWgQ7JZoASQAJ2TzudrgWwn6X6mG3ZHy0t7s7T0bc3JsvRCV7lvaDvdf6KKXDkXqRro9a2urT5%2FiHa49Nbd08FtQTPltnfjLPiERZ6Ui1eRTGK5BhvKSHrI3aHBEOShq%2FwMkHscxug8Uke%2BuL%2FjvTleXDSUIjjJwDzPYKvMeqKJCitKu1IJtuD3LnF4K%2FfI8u9sNdHmeLA5Ua1uAiKIkJOQfkMmctAJoqzYrc7k7KEWJv5hHrp2cJxe90VahYQsRMJ0hz7SPQQSiOTHnRsNczKkiucTNNX5jWJG9NjOoFZ9KJHdwMaQpCaZHQ3hNcHVbynCJMPDvA%2FjZNBbZJCgt6MRFjvEKRSBXvgXlh%2F7DiBpRDkCcryJPw2TMOY%2FnX%2FZQ4XyaEa1Gd47EEuxVb1WG4VY6TM3z5FeT6eCr3DyhN0yeH2Xu1o2eKZ4lLzIK1bXV2CjiGQE9zOZR6m17qIse8meSCPkX8r4HnHHXk9kx7QqUisSmDmtYwh%2Baktvkrgpt0nuOIbqU9DhD4mlpPzxSL8QcxNkAcacMJ7M6cwGOqUBZLw4MKev8%2FnlqFyiEq9YAO4NSxdY%2BzuGYk0Y6cX5n%2FBliUpcS0lWHBKQxwDOX3gif%2B4Ca5n86btVNF8Bnh2P10ZfPSN9SqHs3SMt3VOoqLwY0axcAnsjOTjqOhhJlpBbWXFnQ4tR4F30gV7CBdHqOj7GndyJjFD47uZw49RfQp2j0Qhi1ixxU52JxY7KmW7iDGICKD2r4Gx0wTWHh1E5BPUcGrCB&X-Amz-Signature=1480b25258854d2e617e1043e7ad9b280e97ccc92056dd8aeffd45275f9eaab3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665REE2L5U%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031639Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDSN3WiI1N%2FoRgUzQxadSYkRtuo%2FgK2W8TvHTuoOf2t7AIgOgUjkUANSSkBEdDUatjrKji%2FExe6FR0%2BAqX0%2FVi09B4qiAQIu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH3rrUu8kMbYnvvusyrcA5G3CUnWbyF%2BOA3SSBJijUE32pLxaaTLTHOhmfNwikUBFh82iIyu%2FsEGRFCJy2h7PokiTD%2BSY3UZcgOww9M2eUY8JP9nPUJovias78vfZOMc3St7VZ%2BOVPF%2Brf5%2FSj%2BBduYJYxq5loXzCHX%2FOE0kAkntmeOkrf%2Bb5JrtnzJPvcLMfuc3w8A6nP%2BfHVCc0GJFX91canpDv5Dr6OHyM2p%2FClDRjXkIwxYqQWgDsu1UpEqZ5bUKWInruiibbQq9cwKebSuWJUyGjJKDeRKdf1likFWfV2%2BYDh42rjHJRrhYofCAgp8hZQY2UnBu2LLxCOgPwz4LTbgmaEHsyAfevwu0HbyQzqv0ngtSXkIvYFS4KJDY0eWDjB3mMjpFZuDYZWlQNhfQtB2pGfmbHLu1NNLiMkI2EPpC8ojiOl6mWcwttfDwGvj7SVDfqUf8gakyYdSRzNYmpUEr4aabdi0OIjAb%2FpjIQk6FPUwZXTZAMogeX6YZUwsHViu7I1cOvhX6SCQa%2BlN%2FVw8RGKewKpYmsP3I5Bian%2FAAqrGs%2BZ3YwjqMs8EJxZHnIvTHuF2gwdkB13Ias2tgmAZ6kKhaIKgW5Bg7mUFrs9lSo5YLnmJCP9NRflZVvQXsB31c%2F%2FBvjumpMJPM6cwGOqUBhMeJn9NB37LERYnKyx4psbu0KFqT5k9sBCJxYDo5I4VS1RQbODvNOOajGHgBu5G3ts%2FU%2FuMNgxd3QPeocnpnRs9e%2BJL9ggogQSu3JwYWqDlMzxC1aV4xQ%2BMetPfbcVAMd5M3jlCBo14fULHtxwmys7yRcj1HaZ7Pa0a%2B%2BW0Ha%2BR9S%2Fn8qovz2mfxl9viMDLDJYbr9ZJA9JHttl%2BUBlJi2p1aB7y%2B&X-Amz-Signature=0f27fe225a88ec961df09ac0d40a213fcc0e5216461e3560051098e3067cabd3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
