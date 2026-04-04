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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RW5NGL67%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031834Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB61wbCf5sIkzFrlAEF8i36aSUxcMskfmiqQnlBCQ1CpAiEAnluG8%2FDRB7m4d99vFc3iYYzOllQ%2BkGxFxxr3l2pOs18qiAQIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLJFV7uW0S1m7rbYbSrcA7pGgsAbfesKA5ZK%2BfDMtDBry8uenA%2BG9%2BO%2Fg1mqCoeTAAbEK7FnBwU4azRNtKywxG1h7WwyqwCGU1WpRMP4%2BLIWJ8Jc8HgbwnzCxHH%2F7BUmjHq0qjleCUGxhybrOUaJ4Khd7Va34t%2FJbX1tfL0FFzrxrY%2B6l4plsVCU5RCi35Rm2aMoGtZy%2F%2FEQaDErZqBb5ZqjkAWNuqGH8tJQeJ2XZvT8DHHHWB0mJQt3LHGySQNSBDGWuL6E%2FDfBaSzSyrGH3qjX3Tv%2BL8MKSc0tpTVuBa08pvxH5DgvTVHTAd3I8uUY4AbwFRuMBJWk7vhOrQa2DLO5OC7JdFERwJJCgBiDWGfuOu%2Be1BAcu1DpTWSY%2F%2FzddfKda7zoiD5ELcHnZdCSqXgCCeuicjRdShealuXnbrt5hA6QyHUCw0KI8Syyy30jb6Wl%2F0bJU2rkPSfMZH4BX2LgXhgSfpOpubiyTAJiEvm%2By4KI0xDclxqcOll%2F7HYDDXDpctmfItG0s0YU6n%2FMw5IN0rhek2i2xG4eQyppGmrvzMYRlGwthtTR9ZCfM5%2F%2BIpi5rj10DFMw7pI%2BX1Mc%2BjhwdLTL2T0X7QeY3DyjYz4540aKzxPISm7zCDwx6ifNDIpjTSuBmC5XBrBfMITmwc4GOqUBMpWKByyd0%2BejB0uCQq3IhNFrXMjZ9OXFtnhjuJ04s9mbkpCg9Fg5CBlKSGaRWJ9biSor1HA6PNr4nuppX3LRsYnn2hLm2FaV6idXWhNyXXfAVtC8PsbMDSorbo01nFsaCmKdOI3eJ5aQrhqKBXuHy3mYxzXZWR9QqOOQEu%2FOkqm4PbbJ6n%2F%2FyQwWLdoCCLsf0pPx82kU9olfMym3nsGmxr8zKh5X&X-Amz-Signature=baa245d82dca7185e93f5eb17ceaa5c048ab7c10f0e8eeaf9837f3dd41f879ac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XZ7WOO3W%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031836Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDKwTqgXxTu47KjFibcH2BT29W14BKilpai9XmLI8RISQIhANnoWrTvrWWiBnUm6npbo3QY4qGVggba15yrmC7stbp6KogECJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyKuWX8AG%2F3hU9btOcq3APHc5TfSZauIuZJrTBz1mQGYivCjek3vEkRVYxOWYGCw8OiNDHWTuVDdxPrTLHdUtBn7Hgyj3f%2FXmYxdA9sBUHQwuXzd3xBSU%2BDhEILDXIaaRAmHCOHTmRaV2sNg7fF7ENbUcMFazNGhA6pWTWNg6G01ZHww0APujlhSzLp2jrK1J%2B9G%2FzSrjjlgLzIDcSyLX6L12ghO47VfFWstmQnK%2FWtZL5NQ4XP%2FxxhSfaQU3RI%2BJezrOnJtv2qz0tIzfDWn8bSIzeldJTGKEF7g12e14hPDoVuW%2Bud9XpHBJB62tkv90FTKTpY8MFMvejg%2BVjfelL8q47U31Su94VnnXQ%2Fg6ue57ss1LKf7c5D8mQwH%2F4ZV0h%2BXTE8f6x5KjCmWeyB9eCsE%2BJiAu9ZH7EqQMlJr78KpqORFc6zXt%2F5nH9Ji6yvLAktuOALaLRDYNP86evM%2FY%2Fr9MoqJOfBPemDvuWi2B7E0zmwt46w2dcEGgoElO2h1fePqYEXsSIXoBV1tfxT9wIBgcxnUzTdnlcuadfDSoTcMQMhNSxGtRZXe%2FWZtkFmSU1GW5u8dk7c%2B7IgHY8ISPynZr6L%2BAEeGokSV6oYbtBhBAFD9ua9Gq%2FUY1EdWVvLlhXmI66qFbunb58LqDDa48HOBjqkAb%2BTxoTI1SlwpCiqjWw3QhZjLPwk0DlWFiQXLj8HaHn1QYk4Z8nhgMRmKTD%2BYlwyINIV1xFfmttQvVE%2FPAw3fZCxh9SKJ3XFYAIgU8x3pINlCsG0GPHzWlj9ILgRCvO%2FoiMJm6t25TFQJRsgXD6v0V8oUqayiCiKoO84QYZMmrVI90lbg%2BO%2F1BkFH7rzC4Y5Q1iLQWxnTff%2BrShv1mJ%2BhWkFgBuY&X-Amz-Signature=87c2d54c2c53067a876c5312aa81b2e4eb9e35833a6907e46953782242dd91f8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667M2I3ZZY%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031826Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDEundIdP28%2FrkGe33GV7rPdbes6boFS%2BVqPXei8g2ACwIgFHJYXw1e8bwdRSWn1HNuOk4Uz7ioPBEbykODg1jkGXkqiAQIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCOA8HhBajcVWNFXgircAyP0fBXjU%2BhpEOpfRBGEgGr7D0smiX4UWpgKcZbrlPVonPn8kcu4U48%2Fc8xfl5MOeFSv1%2B7DPIR6lfceq4neBheEWsc%2FbMVMOZRCEqJuFqpwuI3sFnCJhztoK84qbbMb0J5IBNV4iSdUV2qGkxZgeC8KyJL%2F437w%2FhsjP%2FsPnKpMYBHPIXvdJg6%2FVHWwkllj9544yIZVjZZqUHRZ7RRdrmNSOUj%2FFLVKOevZKFumwPMRF5pj5UTUHiiIlFAtO%2Bqrcjr12GTGeJNBPXZHXtw%2F%2Faz84q5XovsMQ99NvSsf6u18UA%2B4qDjqdFXM8xA8mYwcc0nJN1mVyxENZez6QXeJ4WhP%2BC2zJBIi5brUUfZZtqcot1iOa38CEWNy3cpGWYZdvolmE6AM8NJKSlYxCAQac9QwAm%2Bc97etW5bFIlTMlI4EtYzaQmZc%2Fy7FmBdd%2Bzf66BUgIYO%2F7JKCkrG45xsUdMpkCR1YYZA5iwqXu%2F3RQ%2FaYObEwlDdjqzcW3QeiGdIhg4wbjidS9Ev76lmZZjzRWmD%2FheEGsXUpXxd1Fxdwn96M9w2IbVUJBRXXHyHnYF5tkZD%2FDReZkLsvaPW9OWzg9YRI6B3ubUbjxHw%2F4bLIs5dE56XpYFSvQXoV7OBYMP3jwc4GOqUBIkMDlgsp0M083SYXerkCkZIGJfPA5bwT4JOnxawFsBLvwViwfvbcBTtw32nlTKZRmIeKV8reUrKbw9CY%2BGD4PrQH1pm3RZhH4ZrQ7KYHk5Aj12ziN1cMf9pjRDb13bgh9OmUUmFgAa8hQJiLcEHCl8NqqtMW5hKDEvTpM4lc52dM%2FMh9V3aKkK2N%2BtfN9sW%2BmyLCcONxWSBJkqrIuxwoPzxT9jh6&X-Amz-Signature=874c8c1a5ee661701cdf65973618aaba121b380aef3ede9d6ef09c8ee336e503&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667M2I3ZZY%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031826Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDEundIdP28%2FrkGe33GV7rPdbes6boFS%2BVqPXei8g2ACwIgFHJYXw1e8bwdRSWn1HNuOk4Uz7ioPBEbykODg1jkGXkqiAQIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCOA8HhBajcVWNFXgircAyP0fBXjU%2BhpEOpfRBGEgGr7D0smiX4UWpgKcZbrlPVonPn8kcu4U48%2Fc8xfl5MOeFSv1%2B7DPIR6lfceq4neBheEWsc%2FbMVMOZRCEqJuFqpwuI3sFnCJhztoK84qbbMb0J5IBNV4iSdUV2qGkxZgeC8KyJL%2F437w%2FhsjP%2FsPnKpMYBHPIXvdJg6%2FVHWwkllj9544yIZVjZZqUHRZ7RRdrmNSOUj%2FFLVKOevZKFumwPMRF5pj5UTUHiiIlFAtO%2Bqrcjr12GTGeJNBPXZHXtw%2F%2Faz84q5XovsMQ99NvSsf6u18UA%2B4qDjqdFXM8xA8mYwcc0nJN1mVyxENZez6QXeJ4WhP%2BC2zJBIi5brUUfZZtqcot1iOa38CEWNy3cpGWYZdvolmE6AM8NJKSlYxCAQac9QwAm%2Bc97etW5bFIlTMlI4EtYzaQmZc%2Fy7FmBdd%2Bzf66BUgIYO%2F7JKCkrG45xsUdMpkCR1YYZA5iwqXu%2F3RQ%2FaYObEwlDdjqzcW3QeiGdIhg4wbjidS9Ev76lmZZjzRWmD%2FheEGsXUpXxd1Fxdwn96M9w2IbVUJBRXXHyHnYF5tkZD%2FDReZkLsvaPW9OWzg9YRI6B3ubUbjxHw%2F4bLIs5dE56XpYFSvQXoV7OBYMP3jwc4GOqUBIkMDlgsp0M083SYXerkCkZIGJfPA5bwT4JOnxawFsBLvwViwfvbcBTtw32nlTKZRmIeKV8reUrKbw9CY%2BGD4PrQH1pm3RZhH4ZrQ7KYHk5Aj12ziN1cMf9pjRDb13bgh9OmUUmFgAa8hQJiLcEHCl8NqqtMW5hKDEvTpM4lc52dM%2FMh9V3aKkK2N%2BtfN9sW%2BmyLCcONxWSBJkqrIuxwoPzxT9jh6&X-Amz-Signature=6d10ef162e18718a4f2ed047a9b739ef7ad19972c34ae57ed61fe169c64f9a77&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664U6OR7B4%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031841Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEtWEK3jeYxSezD8P4vhpqOS9EY56fRUPRaOF7I5nBj9AiEAlQUrD8X4mj9Sq4GZWrsExOl561gDzX%2FcAvTyceWixSMqiAQIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBivg3xWrzWkdzDtFCrcA65tw94jXbyp1eyvmokTc7zAXGhA6TpjiYli6UXpE2Vn9SppYt2BbacSZvNQ8ip4mgQUMLdq9Gh5tWA0sbbCi88L25EFxQgRJ3qiWzP9d%2FZVDfwe5RTyfugLPETcHvDNB8pj6otzHGUI%2BBX%2BoYDuNaXGA2aeAhs9XLxNd6%2FxkSgSbr2c%2FNHo0hLJIjvFnxWqtyrF%2BpI7SczNdcJqZEwGZx0jXwdXt%2FHFTCxC0Y7aWTiYhZdw3Yj%2F4EEHKBbYUppYKiFx%2FzL5xY9YXDfnHzdzk3l4BMDZ4AQZi7fxsuPz6vf%2FK4iiduRzFn1cQqDXK26KcdC4XnL%2BOLXfBzkfdPoub5JMlc4DhMvNuIRPlDF%2FTCOTmivFHJg7rweTrufp933hme1oRqChXe5sukWnGh8Iw%2FC51%2FeDnYRaN9QyYkXSJWf3eDv6YMVUvy42BUKPOKO6UH2iD0EHd3MXd19DhulUyiP7aiJTW6lhOqlOtRXM8i2PXsJnhAPztEw4K3YJIJ7yYZCm7phYTNSOLP6GLiPkvyZUlwDMzq1Jb3ue5tQSZFeEAq6lIFfZKpuM%2Fll%2FIw8eLmF4dQdd1dwCwUqtesDUizYlq5cTsw8hRbzSZJTSEXo3JDP5gDcfnK56%2Bof5MMbmwc4GOqUBpma%2B0FP%2FuJRFKldM89LrhkKFn7rBIYKy04DcO2ENumBSdABy3KXFjFYNmVauTicU%2BMV8COJ076Ccz435%2F0cU9%2BXSDwzwUG%2FpTyGnKPqBqhk3nCok5%2FbzOsp4rxk%2F1C1Tle3M9DtL6ritNDzVpE5clTqqadKPPFn6OiVHEee1j1gYT%2FS0if8GSrpFX7c%2B8t9sdn0exiMWj6co%2Fn430S%2BxSCtI9bZ2&X-Amz-Signature=e410e03247ef85f6a7001e8e4babe3c90303c46245cbdf20a6c9367e7ef54905&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U7VQZIZE%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031844Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIApqobo0l5a6bN96BQDJjLKxjCl5xq3izRniObf9RiRkAiEAs0fbHBUS74DnsJqR20FX%2BM47yJgGwCSwuFXbo5IYpukqiAQIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDOgyzL1Ibyzziv0VyrcA8nn8RlKiV294nuNx8FFCKEd9IazZlOC6iBcXEJvNvayOPGwSczs0%2Frxty4RbZkKqPkZXkdvEdpHkQG78voY3D31a%2BaCDTZ9ribnCPmrjTgdyXx86VrtWH3t6alpxcIcM%2FWQG5ol6muguLE%2FJNUW7y4VldW3iSZPC3MtBKuAopFIOEynYBjT2bEMj4vsqjYn7Rz0B%2FksCmvi%2BgKCtwDAPXjHMuSF7P1KjUoy99UEJ2yfzS7Lro8%2FzOA0rA1Nlh4bK60gEA3FLaQnGqfpxXqGmoqXs28c6s1h52BFbV75HmmZtb1Bq06DMz%2B9mGokMan7e087jq5z9MawUb9piBgOqp4pOmO0JIiIYSVXaHaO8xQ211SrtmyapkkOD95qYzlNrhSlVNqk6TdvOTDTBg1Tnu0%2BoADtI%2FudtTBnTKW3NdBcHPztMPDH5%2F8SvwoLA9HKI5w1w2EZUr2maBcrUjuRWRt5q3W1cjjzAamt0J2E2SYIhJU607Rvxu17B4b9GyomOVbbBoWFclkgDWCT8%2FGsN6TIAxp6JjKqLgqXw1RF0es3WHR6nh1YynDlA20ae3%2BM2Z0s2ARR1dp12DaeNLK6caH647wjszg8xm2FFy%2BXA520fUddb4pWCdg0Z4AFMOPjwc4GOqUB6n9qnftB6U5hEyOAylkWRdw8grn4SFWrrrZOEp72slOBIySw1AembBbFsnq1jI4HQ7dwY%2FNB8mvAayl1Gh%2FuSEsdpqkzatRzrOeRJ5L%2BrmN95Peh1SLc0LNunhKt%2F7hULSVl0xPtNZDBSUCc0BXWMGflIEYsOZER9cXe86VPQfo43xbcLJQHs0rk8rFB04dh5kU1IyUbKfzy%2F3qq9vjElxJ%2BIvW%2B&X-Amz-Signature=8405de9dcd715a421b50135f7f1a1783fd1d7b2407ef2379aa1f1915633b4e66&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XOH5NX4F%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031844Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEM90QFgbx8XX6KXgfNEUahtvW3zIYH%2BIhnAY461T89AAiBFPtABewpd4sRWHoNzptnCwCaam2pSqQ347yW%2BkCOYOCqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM9cBptJtlT0ug2f3TKtwDmORaOKLbCm%2FLIeKP1V5AbdbW0jGheE8nH%2BqOTf1HgCMQmT7CxE7zrQK6pDv8bRq1JL5RoNhrQMLa%2Bg0hmUHSbPFfdpT87In3Ob%2FJZ4IRVAi6i93Dh4ccUTMoAQKiXRRM5szgTmWqjY6azQTWVkNcO1yGeHnMByGCb0u7AIGy9xNKnbtF33fj4SiDZzlB0aRTlXZQyG61oZQDM3BmHQMa6BdfOmFjqqxigOUfSk5wYpKU05G3JX83mDZcFAEQGoT%2BemCt99IUrgQwhsa1TClcygAS5rSXruxWExJ7XejpQPL1FkJLTL1C2RXsvtTU2YYpP7tHqaDE%2FTcAz1%2BR%2FH6z%2BntMgtbpkonykptnz4jOhFXI9ezEwK3Nn3%2Bqyk2fGT2TC3nU%2BGVeyXt8ySmR5jG38%2B%2F51tLZd2Vci9tpNIWTgtKKHzFUbjhTg42FZNy6Sgfb0H1We9RDbJ30Nujc0clX%2B1OAtLJjQzOEzm%2B6isGT80qLP5A%2FTeebkfANYMAL9EQzjgsUUWECq1Y72NqttaXfJlFrAtUdShABnm8fqJV8AjYg1zReCpgrHfCyE0oPTsDPo6H2NuwA2Ic75eHDM3xIqHz9W5RM4RNBcrN3QbBdLCaKDeHChVIzz3IPnZswxeTBzgY6pgF2QubPBK5tGQKZAXAGlIlKnBf9PiEq6QAN23qAeO%2BReaItvU%2Ff%2BLuQahiJ0JW%2Fx5WU%2BRriIOTdU%2B1M97J4m%2B0qdjvglb7zuqprpzUl8VLI3mN2SRQmjd3Ul%2BbrrqGSCJOeM%2BXsUMtrHju84wts8hy6q9I8GZiQpnR1FgsK83Lwv6SJVx0lHRqLMLZh2JAjjm2On8EMBuhKR3iv7u%2BWtPRwMlY2KN24&X-Amz-Signature=d3aea5efcedaf2dd9a50c73940f107ce1abfc981b7f7ef57fc9d84f91e791ca5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UEJCO6BQ%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031844Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHmY4LFtB7u%2FPglzrY7BcUkL5Zv%2F4B9JxHAYOJtgrED%2FAiAkXklYw6tpb8w0o4a9puiXa9XjcwYtgBZukHCTyrxfeSqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMYDhx2M1k4HY0oVvEKtwDnSooO%2BNe3pcnyht0sanNIDYKiafNs%2BYdbYdzg7OxKuEkXu4pG%2Boe13hHZwW7%2B%2BEg7mAfARKaA8aKVitKmExPFHoAKQuCrlBitnWBhEqWYfZS24%2BS%2FWyRp87ySA0gxGbggqb%2FvlDbJKsEV%2Fi3qF0Cf5a1Z9Pff%2FTE2vq0tZNFZTVX2DaviYNeWYqWPh0xRM0fh1ppnjiu0lwO5sJ%2B4poxklBJUvDxamEG7%2BkbRI2fQNOgA25c5nIjFxwWSCK%2BJT33pXXsgK1EsVkjs8f0sg7KegE4q8AkIrjWk%2BCk96bxeKwlk67G5tKMQl6rb8sQipYJd8JuNqb3uQY7YStwrss0M%2BNTqnV24YW7P8jk7c%2FnQS5to%2FbkdduMaQyl%2BQapk7dqIN7S3EEqJ4cBp1NnD1at%2BGN101FFkNYTdqdKJ7a8v%2FELxmLawC0DWDSvt2IsCaBWj8UCTh3%2B5II704AFgOzQaURkSyP%2FvPLNvpO7zu0i9%2FrCUUXA%2B10ZM3tj4puazb9oFOP5dKABrXzXvWQhWAV%2FJMSv6SB1E6mgOURCVOGLASG6uMbfs5ZrvxJOkwz45meZH3OAejnlB3C%2FymkYwUhe6Ra1Wm7Dr8myFvxTQlgaH8ZcEK1umupPuY%2FHd6ww1eXBzgY6pgH3GiCB4gBkkAYRFSf4KB2O3pB6zYae9%2FMBvi7Q3rQEt2s95N%2B7yCsA5iMyUEzraOKJ0%2FYZVES0uGtrErpBiaOnwdh%2BknyKfl84NcpQpja1jayi4MPJSed1%2FW7XSnRF%2BQTxCZfvxMMTdk2mnsw%2BsMJtUhmkMOWLCzGNGtcrJ8rlhGWvBWOdAbACJoc3oK6svoJasEk0nw7Uz3bFTHMOOknCki%2BIlkx8&X-Amz-Signature=2562ae8fd9b4157082219a45f089914f67bc179bec7b1b7e69a2d5552083ac1a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VAPSDWR5%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031848Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDRsFXQJMOl9zsw%2Ffe2IPOjNTS1pHZr7t1xoRdNe05fjgIhAPrGTKlY5zK%2F%2BXhNdFgDXk4S0FX1IEHa2I0zTsHDQicSKogECJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwJ6eHkEi0quGb9puAq3AO55DXJLec55U2OVR40kYyWT5lSzkNIjX4iGFk7U6Oox7gk3KAadCVg77Sdrr4M7GWSeHQLyimznPeFkFZRcuA%2BPjIOcZY71o4inR1MA69Mw3JwoPodutTBsQU1TqPYNCoNyhoD0RXI6dxXSf8FjLyruBW6DGYWA%2FpVuNda87JMU4T5YW0nO%2BNduOhOZuEJ%2BSe1r%2BpkJLVq9pQYVT9%2FQcdInNnejAQ%2BYgPz8zJBHLbvZFQwxeV1UHrgNrMCJAISfo0Gr7ORxoNiD1DCj39OWWrwXp20sSSaXPgEyUNEns3J6PZBUcSEcRDbCDWWEx70UFEr26ZjwpNheGeF%2FzjpeF69eszWZ9%2B7Vg7IVfrbcZl8bKIx1g5iopltf0wEc1rQlt0rgZAlXsvivEVMLkM1AcpkGFojZTpWcd1zkro7fYLwcPlsH%2Fn6Q2K7y7CchkCI4s1Q019TYNU%2FvL4k09ZD4tPt17guqIODmaUfIjx5Bzti1BPguelOlm6epRmn%2F6zCSc38NUG79tIePHxEDw%2Fyzr8Pn8R7Li07pmFOOnCP1s%2FvviVkki5oNcqhWnNSqx1HsWv4ejX%2B7HWD9YhD5r0nVdL9be%2Berrsy1HJYRiQCGp0X3DWUmdAUJXvmALY9dzC35sHOBjqkAY9mb0Hz6RyPd1OyheEanGVUMcbG7PlJwnJ6U7L%2B%2BI9kvWesGpLfXIZOepHUMBfBrGMmwY%2FOVtYDR%2BQ%2F%2BM5jH65xdZEsnmUDesjK9mR9IiCtEtqcjV6CQD0R5KdltmxHcEdOvTPff2NKUPLDob4qJwFfvJLnbbsgVGih4KAuqVHxbLr1Pn%2B2V2Nz2gOdH%2FEMUqAgIkAdnO1fkwMZva%2F20iIyJbGB&X-Amz-Signature=5bdac373ea3dd30047b589c322d981b7922745d1acf2d693a6ee5d62db8c0231&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667M2I3ZZY%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031827Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDEundIdP28%2FrkGe33GV7rPdbes6boFS%2BVqPXei8g2ACwIgFHJYXw1e8bwdRSWn1HNuOk4Uz7ioPBEbykODg1jkGXkqiAQIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCOA8HhBajcVWNFXgircAyP0fBXjU%2BhpEOpfRBGEgGr7D0smiX4UWpgKcZbrlPVonPn8kcu4U48%2Fc8xfl5MOeFSv1%2B7DPIR6lfceq4neBheEWsc%2FbMVMOZRCEqJuFqpwuI3sFnCJhztoK84qbbMb0J5IBNV4iSdUV2qGkxZgeC8KyJL%2F437w%2FhsjP%2FsPnKpMYBHPIXvdJg6%2FVHWwkllj9544yIZVjZZqUHRZ7RRdrmNSOUj%2FFLVKOevZKFumwPMRF5pj5UTUHiiIlFAtO%2Bqrcjr12GTGeJNBPXZHXtw%2F%2Faz84q5XovsMQ99NvSsf6u18UA%2B4qDjqdFXM8xA8mYwcc0nJN1mVyxENZez6QXeJ4WhP%2BC2zJBIi5brUUfZZtqcot1iOa38CEWNy3cpGWYZdvolmE6AM8NJKSlYxCAQac9QwAm%2Bc97etW5bFIlTMlI4EtYzaQmZc%2Fy7FmBdd%2Bzf66BUgIYO%2F7JKCkrG45xsUdMpkCR1YYZA5iwqXu%2F3RQ%2FaYObEwlDdjqzcW3QeiGdIhg4wbjidS9Ev76lmZZjzRWmD%2FheEGsXUpXxd1Fxdwn96M9w2IbVUJBRXXHyHnYF5tkZD%2FDReZkLsvaPW9OWzg9YRI6B3ubUbjxHw%2F4bLIs5dE56XpYFSvQXoV7OBYMP3jwc4GOqUBIkMDlgsp0M083SYXerkCkZIGJfPA5bwT4JOnxawFsBLvwViwfvbcBTtw32nlTKZRmIeKV8reUrKbw9CY%2BGD4PrQH1pm3RZhH4ZrQ7KYHk5Aj12ziN1cMf9pjRDb13bgh9OmUUmFgAa8hQJiLcEHCl8NqqtMW5hKDEvTpM4lc52dM%2FMh9V3aKkK2N%2BtfN9sW%2BmyLCcONxWSBJkqrIuxwoPzxT9jh6&X-Amz-Signature=65d7da3a93fe713a05327496fabd7386130480fd3237f321c30bd4ff32cdb71c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
