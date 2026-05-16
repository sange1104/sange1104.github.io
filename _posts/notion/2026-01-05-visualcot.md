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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S6R4A2KI%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040330Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFDEu0zvVFI4y4s8jg3OX6r%2Fjy%2BIjPCC4LCgEgdJ%2Bcp7AiEAomICuAhgbaaJzcUvXukP7CUh5qdGoAoCy6ERCBS4c7UqiAQIhf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPUzfHl822Vu1gLhzyrcA%2FCy3KGbUahmi87EmE3Ej15b7%2BdwAMvlnLl2kZ%2BQ775XQ5xIMmIZzgpQHer4eBMlnEeGr9cRzkgUe2DaTimG%2BQBSmXZAVH7lqp34f0zlsfYWWmwSrmY9Bi%2BlFp4YvBQIMEJh07IilFsYeEUNP0LTDLCtIU%2Ft9udKZ447CL8qr%2BTRWOxeUkabXb%2FybD4Zvf7C%2BqDmwU8pcFf8ulQQuhuStvOtJLeFJCaJ1z37z3fO9GlOaYGs3iOyxfg5OiPVTztdBVlEfBX7LYIqt%2FXgPovrFqYGa3ZBI6JfGisYOn%2FvmtKBCmDh6S%2BmtokaY2%2FC1l9Z8RVbAtckNfjYRZ1DX6gitnK8alJMqNiApZNLBORgrLhPwgX0D%2FDXByoGK46MoSb4QTWQfgLRAMigi5S1FEqXIxShEwmS%2F7hXvH7hYItExCqhlVBMGdvMRprdrpXOy21K2N7d96PhH2gSO6AEwv5vdR49doBZI40Dr%2BwCuPJk9C4JAGZ7NL%2Fsz9ksgU7I7Bv0pSdwK5rBPTjnimqkzWjUbgsCizOYBC4uhsdhZHBJUYae9gmEKMcZPaxYAdOU3cyAkXk0A8vbPMkWsvTem4oL3AOKk8N2bCs8HceO0TZSmcS48nDeYlGKF0TaqMybMOPFn9AGOqUBQj9oKTs6WmjR3hIPHSIZc2xeYOhw2SyizGknxCh3s1zbG9M00oFkDgjsjnXoSRTc74Z1FiyJcj4YvjA2Q72hkDAA2bJqwhkmTduhRMkHGHo2fs1xybVPjBCYknenQU2v%2Fsozgu3lfaqNTty6rIzPR2kTDdMFLHbiO9eFFFQ3aIG%2BQhlOx2qThynXgk41IFaYisv0ezotoScMw8hsBDC8Fa%2Bjdxub&X-Amz-Signature=d02b416a326e9016376cce4b18eded2ce9b4c5b7cf1503a930a214005d105844&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V3QENCSA%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040331Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD4ckxeEJXcBaC4TzDjxCs7Z%2F4E8Vef5X%2Fb%2FxjAogTRqgIhAPb1tUcbWh5Fs7TM5E0B0s8WzbXhyMHyb1eAa3pLvqvhKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igyb5%2FcJjzpZ5seYd%2FQq3ANTR3hS4B7eNijVr3SY%2BzGSkpb%2BoHOcfWRA%2B3BKlCqYBm5GrSu0EcWzG8KrNs%2BX9jgwKwWCQKGsWwS%2Fi5BtzvAEbdciUPr6ixeF1Uz2kfV51W0rK4cOJP1GkBW2Zsyq%2BITPMWPHZ0c6fBrDkZPYRBE8LYzw5nyvi8HiIhDDZYS6R7LqdoiuQR628wk3AkQiVt0Zw6JLU36DsfwM1QfAtdYxCJRQ1maYgd5YvoMCJufy4S5g1QlD8tDApkHcVSHjWIYWMPB7B0SWTV39MCJAJorZLuZPsyw0ydQya0UUSamQ17CZ2kfsMuuIeAzfjb7bm0F9gtE9J6b7KyiTm3VNAd%2BEiPMhRgzy%2Bo6WnAIbmU28ybNFYnFE937iEfEiPrGoggRry1nT%2B0hyYOKdfyRIpEnCFbdB0PyEgcaU%2BB2nC4cFjhmw9jGtq45XPuOihIAOvqF41diSh3lFA8wRkFUJdn1lVzjp55H1c2JJCZ6ato2kKt6UQTvoVBxQ0PT7uHfj4PnmxPpYpN%2B%2FsZjdVFb%2F8reQeLsxSb%2BB0DXdKV7lvIcdMy9p8Nck%2Fb%2FgtMD2nsQcuRbQaKR7RAc7y2rP4%2BFFPqm%2FpF1gUdx1ZRFpMtOLImA%2Ff0QJTNN8iyFMnfdf0DDPxJ%2FQBjqkAXSLwF%2FqbZ0hWMmZoqXTXlpwZ6b9ZihQQyXGW0WI8h%2FYXeIoxUbEzBfQ%2Brq5dOUmZ9bEL0Uar3rCWmWfs55IE%2B3QPGpD%2BQphzDjQ5fsvlKKZ9Otr6J0xzTm5J%2BQEwreKPllMSlbxc1hUs2JGPCMi5n%2F3nYDJL466jOka119prNRGBMV0LHyzVrUTymyRxidhII20NWyM9ib8a5FS%2FNcmvhOkMU2%2B&X-Amz-Signature=a3e0b2cd49600b35c43b51b16672bf91958541798ae75faae391f918f3feeefe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666AU6IHSG%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCQL3qQhFLDOvg5dD11GWza3ZstChaX5KKjY3nR22%2FGDgIgbBZtKL%2FuImpIZhKpipQDIBhDCYBeTlFSQY%2BZjpJmBaAqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJg7wXn9nvdO4%2F8%2BDSrcA7OD49x7HJfOzYb%2FelQjaZ2TnXz%2FRoJCl1lWrZ%2BuK1VE4LN5Rj5dnVoCI8lt1RhDJjhmHxBhRBESwJ2myO5VeGEIcRb451MXbEN92cZIZDCYbqB5RU9p9qe%2FSCfSagZvATNh6kRi7CnylYI0kqTlVcVOcYWhKLOAi7FQbgTv2xxVGhQZ%2FBf1Mq59UZrk%2FIP%2FGr%2BKfAKHe311dBa7UUn6w%2FYQBHksmMGYeW%2FqCVWnIKDntqmTL6AMT1V2PlHNh6MoRUbf9oIvgx103%2BAhO3tgiKpeIPc9Ji5ysFW%2FcqYItUpK5GCB3ALemMYoNC8%2F8LwjD1Ov2k65Lv64sWGkwKEMPX4ZUnbJz9sak19canyBWD3GxgO1Y1LpvVCx9Sa0Q4slTBhDvwlS52YVD6UM12ixpnj5TKckjRj8BJ%2B%2BL1pircJa%2BWdi28XQZoadiqJRfd7aEpphoRMr%2Fo8vBf6pAA%2Bx0isiG%2B98TLVEauIF73xhPGskrcd%2BF%2FnlZAn6TGwkUxbtnJYgjaNIa8kI%2FbogEuoiwAPuNtMVzqs65IFQw3pe7jCyGMK7vvhJVvE5ji7orL%2BZlw0SODCpSjC41OtbkV1%2FM1f1jTsEdCGgZAcE0lVaHLaWU03kUrTehBdqR1R0MKHDn9AGOqUBPm%2BNi7wN2XOnq5gTvIx7eoaKvicMXSWFzecGE7NgVCwEtYptMnupN6bCdY8RDJHgAH7DtMYu%2FAYqmaI1%2Bx2EgS3CVijxo55pmNS4vJutwLjBoyzhOEw%2FdSF0oA3RLAJ%2B%2B1mDlkT5Xx4p18UX6oYj206X2zXGnuEMXml60kYRzsugIbtSxq%2BuXsiZiYtktJsunUOH178RcCtVeSjuZBeu1DlJcq8B&X-Amz-Signature=3c8e56418665fe71cfc3f2d65539b28d9304ff007af81b29e7164bba2914be27&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666AU6IHSG%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCQL3qQhFLDOvg5dD11GWza3ZstChaX5KKjY3nR22%2FGDgIgbBZtKL%2FuImpIZhKpipQDIBhDCYBeTlFSQY%2BZjpJmBaAqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJg7wXn9nvdO4%2F8%2BDSrcA7OD49x7HJfOzYb%2FelQjaZ2TnXz%2FRoJCl1lWrZ%2BuK1VE4LN5Rj5dnVoCI8lt1RhDJjhmHxBhRBESwJ2myO5VeGEIcRb451MXbEN92cZIZDCYbqB5RU9p9qe%2FSCfSagZvATNh6kRi7CnylYI0kqTlVcVOcYWhKLOAi7FQbgTv2xxVGhQZ%2FBf1Mq59UZrk%2FIP%2FGr%2BKfAKHe311dBa7UUn6w%2FYQBHksmMGYeW%2FqCVWnIKDntqmTL6AMT1V2PlHNh6MoRUbf9oIvgx103%2BAhO3tgiKpeIPc9Ji5ysFW%2FcqYItUpK5GCB3ALemMYoNC8%2F8LwjD1Ov2k65Lv64sWGkwKEMPX4ZUnbJz9sak19canyBWD3GxgO1Y1LpvVCx9Sa0Q4slTBhDvwlS52YVD6UM12ixpnj5TKckjRj8BJ%2B%2BL1pircJa%2BWdi28XQZoadiqJRfd7aEpphoRMr%2Fo8vBf6pAA%2Bx0isiG%2B98TLVEauIF73xhPGskrcd%2BF%2FnlZAn6TGwkUxbtnJYgjaNIa8kI%2FbogEuoiwAPuNtMVzqs65IFQw3pe7jCyGMK7vvhJVvE5ji7orL%2BZlw0SODCpSjC41OtbkV1%2FM1f1jTsEdCGgZAcE0lVaHLaWU03kUrTehBdqR1R0MKHDn9AGOqUBPm%2BNi7wN2XOnq5gTvIx7eoaKvicMXSWFzecGE7NgVCwEtYptMnupN6bCdY8RDJHgAH7DtMYu%2FAYqmaI1%2Bx2EgS3CVijxo55pmNS4vJutwLjBoyzhOEw%2FdSF0oA3RLAJ%2B%2B1mDlkT5Xx4p18UX6oYj206X2zXGnuEMXml60kYRzsugIbtSxq%2BuXsiZiYtktJsunUOH178RcCtVeSjuZBeu1DlJcq8B&X-Amz-Signature=5a4217782da885fc839c32821979a320b655a7617731c5954e32d3bd627fb7d1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WGGQWQSP%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040339Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA%2F26KoeXtvX3pYX2FqCG3Hh0ccpvjQbmqXcOSmrYF3sAiBWfxNMXNdJ8GQ%2FswpceNxnstv2hu88Vilgfvm%2BPQvf%2FCqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMkB5BlbTI3pwE%2FV5UKtwD8RRJ%2FeKExa27Th31wm3oR1l%2BFHv9wdN2Cns11LyH4f49c%2Bm5KsYXuCd2oyVrCcgmi%2FXIhGQtpPFeeci0CP3naQvkF63MDKGZLzQLBqAtto0ybdyeWp8NBG5D93i4iIpLzknQsJAN5rJAJ4pfGj%2BVrk%2FyEb7kIahPt1KXM%2FMVjHtgFnUVtvZ6zG8tF8VqmTd0tB0n8VNgsNwvbGtwbgKiX%2FIkfyANemxH5zcFXiyQMdztOmQzFV87fGiEgb0uyuI6xdTrMyrdtrUCGcHY17yRrgoBD%2BeHFbxwAv9K4RsmBd1FICUk4ntgii0Kc2cPbpV%2BAmEHuDd5LKImiDH3o2Q4XWac%2B4AN2H40h5%2Bn1F%2FrpSY0geeR0lNFUKjfEBx0Yg56LYEv6GMTvzF08sZTSusNyXypEVyiiWwSw8bFxYnSHhVQu5kOaDeSLdDSvMXX6kOnWZwnTfpkK1hk5DXEl5O5mpKbhDGU58LqBcCq7e6DBF5doVGCXgQSnrvw%2BmLn5%2BbwjbZrqhHbzB5i%2FRUNXyw09HYoAjMjOEKfZPkjWzT2nEF8oKKph3aExt9C%2Frc0jcY%2FNXxzUeBrKanGt0ZOA2J0NopDAkm8M8VdwZ24xglnT8rqYyeehK9hCVmxvVkwlsWf0AY6pgEK4vz0yfqVJCa85xFStzaR4hia2TAydazzQLIzh3qPBesWMi4kX%2BojRjBI%2F%2BUMo4u9YZfZQ7PmhAcPxfzjAoKhsohgqTpqL7vWj1X2bK%2BAoAmBsGamEMSEbQCvsFZix2XFQIYfoAzjSEQm%2F8lW0KMuf02PsgKBKMGIs7nJy3o7yOx%2Bk02FSoevLUbYMbrvh71QHmX%2F0GGKRmCIHuhhdhIwoDnyw%2BV1&X-Amz-Signature=455f3ece4caa7da5986ba64250f81ed7eca526738112d8eed6eccb8c18137422&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662Y4X7YKJ%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040341Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCpCCn0Xw74oT1WY6bn2%2BT5lXe2QoyRsK%2FM%2BvxHaLMzkgIhAK6U479RULXlOAP3LDd2ObjLd7CywlJXxuoCvQXI8AMuKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx1ByiBbllwVJ%2F9vmsq3AN9cmlANw324tASMZeOiiDWkedPa7ggNibH%2FPgI%2FdAfaFjQWycfysrvU2dPhtxxO6S7uhZ2O7dJMtpt4NBH3afTfgY1AehlQA8OUnlb0dOceqLFG%2Fw25CahyosB%2BLzwm%2F74%2FRxDkHcMlghYi6xH88%2B3rs67W8dXYhBbKPu20NcrUcsdvFrsGr5iLE5mZHeMoA6oWE1uIO7A4D6bMbCaEHkXJjrrp1F4p338efM8ZTj3uQoBkNxTVClz7a%2FfpgLboahGdh6lN%2FgsOmY72%2BJKXqy0CAfVsMTzjTRlVM8dmNQ51m1m33KwQ88oS98J0D0I%2BdYyWg77lc%2F7jXPpF06nyVpBT1CXeMrhV55X%2FPZyxRkOvfdFKHDiskdXpPKxSt%2F2rKzZHCxMqiLEl%2Fy4vhPOrENGCqSRaZ9zPHekI33YQWiR26YtF4Yz7wM4rR%2Br6FEXELj8JAdEB5ut9T9JLNk5UOuCl5QYORXuvKaSKZ7pJ4wg60slZNY8YZdKyEeLeCTzGzDzcOTk%2BZ6%2FrNaDRsQWVdRMrXkeb1nb84CxG2xwOxa00E0Xsm4%2BG4FgBP2fhj4r1zYYASe000KA1T%2FsT8MyFy4k6Q1kRDwwdLlUQNDY6YqeisKjf5JxgwRsDbV%2BXDCexZ%2FQBjqkAckc4lolBIFWg7lQv%2FeerZYgdr5k1ontJnnPlEY8CnJtQvrrMiSDyQOzg15L2AhpgaarW8IQSC81JDU9kRdcuP8aygE%2BsLON6fJohuoOa5hqCm5vOdvYF7k6fBB1HXg8NSsxqy5tFIm2RPFWqiGkMhFb35F4mvxaq92giQrqD2hOWsKxpS1I%2B8ErX%2BT0wMIXbNujSQgpMzxPC1HmkzTPMBj39kdo&X-Amz-Signature=f0bc4fa57bf83387fdba099d5ad455967a9c104eb672521f629f9766194245cc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UGU77NLV%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040341Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCYg3IuAa3s51JDEfMvAlRL1afl9DogRqzqhQEI8xbZbAIgQyt1sJvuom2Qau99JL4Mhx04b1NCiBJHWDgKC12zSVgqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ2hVb7EXmILKO%2FTGCrcA4bLi221aEmnmh%2F9DwrwxM%2Bm6z5npfZBR%2B4BMePBiuGyG8VSDhHSYf8ay505CmdQxVw6n7Y86vURhn7WkNIAGkVXdLekNFj7Vm4gxX1EUJkgIBUew1yFBwxI45jauo5vTeFyR%2FcmyB5gCOmI2c%2BDDJV%2FV8pEwAV7IqEvexjpLq9zkOkUeRrgUO86njQDXc5aFTiSFZW89xCAs0CzRWrWdXjkZsN%2FJi8J5PnCPATTB5rxZbLdMjIM82pR9SrtqOG21C%2F0e8DqgtE0FtLLbob7KCPelwEnl7ml1H9iNXxTZ2XmcwOx0yhToNDVV%2B8SPGni1xzcCoHWDKBL%2Ft47OLWl6GLBPv6MTZ3rWDMkwvVRtaaDkUxN7h0ZejpBDgfKIH3oHBVajEn42fCc6aPQL3V%2BEFIUQtrx8RqmEY8R0QAfGYC4f995w6oqvOjGfQf53t8ui9GKyoDJ6ScZsyf5yO8Tnja3uVRauL7W87jTX7OnD74PIYWsYCaa55eSp3pSt1xdVmPLGDePyuMINTuZea3MhMdQo87Y%2F3gDXCZ0sFTsOav5KbhaPmqUD2Zl3MuRxCoEx5A1AfiWzi1RP%2FCKVu5ZIs9zz5OmgAfy9HPPv2bHuEKMxcBr5zQUEoMJjfATMOTDn9AGOqUBkdSEIDNDt9wy%2BzyOP1x3LHH8UG7CX6imEcUveB63GFj%2BoWVh92yPw9dKCt8ey8hBUW5OAbvcEUAQ%2FKkq3OfMuPsz2SSYkpXxpxwosGd%2FWLPYQb59JXfErsAtY65tgqcoH3l8%2B6TJlEB56w%2Fhu8Hs0VcD93Ix7AmYdOIGn92ld%2F%2BgmG%2F9f%2BJ%2BqXdNhpHzir2LPwjLM58KDTDOJ0DiItTftVFdBvIJ&X-Amz-Signature=72f8b9c44d3cac8d60f90390deb599b43d23f42e394ca2288d0093d749404a3e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662P6SDWGH%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040342Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFRDvHUYDZo3sZ%2B%2Ffohi0N%2FKRpEGfwRvqwxUyOqw%2BUEKAiEAm6t6G%2FfUBGdqPjdveldzuXo%2FGFatvMEVTbnL3mcCIa4qiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDK3XQUUhuiC3qmtI8yrcAwg3An4boy2CErbBoqMjcS9LQTkep5B4nSLexDydQ%2BNbcKRzJgO3BR%2FesNbtpOIR59RmCWPkC63tn6gRBxCGOjX%2FUDMbpskEjvBuArnJgw4Mgcjnjk%2F7ZfjB7VH78eu63fN3KGbbtz3tO%2BBQyhqiOBKofBRr8S51kZ2BvpKwYxw38%2BzNBENtJNG7TBRgNo4WVTqUDTGvMSqxOf0E1WeAcGzEvEOu%2Bdd7IPkiyExI6l6Eqt6we1Hz26YWhYi%2BLj%2BTZ9DsQBcEVwZZRk3jC5WaRwFeqhzE5gD1CutdcJGVGFd2DmJ0Nvf1nXssTcJ229LiQWeQ0sXJF7XXws8yIsTye97RG7bPgjGyRaWg4FdNCDWbC%2Bjrcj7EcbWB9ObG1%2BGEDvhYSXipSQIQqnrzkBPAw8%2FtmWwjhUQOW5GOvxaamAaYlREHu%2FTd1zby8dweHoREFRktwahtKXuHLjgyvsRi3YOEV8Ky8WqumtlPcdsilbMRLTxXDOIy3JdmdcsXxvA4Qqi%2FPZ%2Fsfae7%2F6EdaPr0Paolt4MwiBVa6l0PJVx3k4rjWo0RRg3w68QweQzZsCsmdd4%2BE50XnESZ1taFXPvxYH%2BYJMPK09WBmhHwM8%2B4jeBdiP7sKSScF%2F7taNxWML%2FDn9AGOqUBcoLR8yezVi8TlqLDMPI7M3IIydQ3C6BBtlVdCSlGQKgE0nE9H8YNEfbDleqeCG9s05n46cWYdYyvNyXfU8iyyXJkS9ihuGm1Wf8b8oPmJlFpVV7XBF4cJ%2B0OZBLL1Z9C42f1%2Bz8sr5W%2BBi7TcVR%2BHIZWYT1ZSX3QvHYRdnR6y1JdTs6MdBdPaANaVXpSDlyiZJZkd61FvrDeuEhKIPK6C9GCRXiC&X-Amz-Signature=b69cda71de895e419c5ffc6263ceacfe360690e37629e2b07ad38818bcb9cc99&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46627DEY24T%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040342Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDYS%2F4oocplHIXZz3Zoet7%2FLTe%2BH2qOOnDj%2Bqa4IcmK%2BgIhAPJYIZ1NRZCsvZMUySka%2FSmFgT%2BaL70he%2BdcBbJ9C%2FP7KogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwAuFIHRnOkK75awSQq3ANtbIk3JYMmASISlOq%2BzeJs9FZkMkdRDWfSvuwsmLIgculRjU3SBHpaSVrH3zEk6fqzpBoiMNOc0R5yF4vFFM1pdrvLNxhAVQMIaZhHuvYyMqLe2BPcC%2FPUuMEgCyhGxxLRsPziSicXQIqPFm5XRViplXDlkPMBKA8RfzHuWavzz%2BmuyXHd%2BfDh7%2BkdJC6pPNnezL8wlY4U5QrUAb90%2FUEKfTPGstoFOSauklWi5nMNZGhHhOn4zkOSVAEDc%2BsmQoNdf%2Bn4FcBlLEH1MrtZPN3Yh3Gew0DiJ2wNM5JAs0bGEWIfmIiwTlUfnmxVv842QPv%2ByXiJzzbr6B5YgFTBK%2FO3WjLJ2RlSwzdpXQCiXdAnExk0KiLUBQedu%2FKbjnQG2xLveeYO2rUnfQ8YgR%2Bi6EydVYoYtiu0f%2BNHGt3RUZuJtCND6RzclDH1Mi5hTZs9TD8BkU%2FGS1dzlV3tEzNqofOkOnvBkFeYt3nwwTIZld76tDGFObZICHP1agk8eX1LpXTe0osLLU75Pv7OZF9qLMfU9Xkm%2BvWhAVMJ9uZb4G0xUEC%2Bi%2F3euRaIV%2Byhgvm8ShN%2B4T%2B2J4EYzUBLVnA42TS2SHXQpFqcu0YbExjGBMP0XwmyyQQp8cQy0hSHPDCtw5%2FQBjqkAVOvDMt6qa8dlFn%2Fi6oq72blzpD6YI1E3ojpgvM9M0IArHVUr09wi7e93GyO0TjdHJU%2FvwI2JcLPgq6QgqkhCzox4uoNDsk5xbrJvZZ4aeiuBf98mcZD3Z%2FdcAlr7D73AmSSDZQKxMsQ266IZYQxj6D1IQZJwMT4javOdKpKecVmA0AIrPWrULucqdZo6lYWcBrFuD6mHgYJDePu3G50S%2BSXIZlO&X-Amz-Signature=e4d2c46dcec909bb20fd12bcf452a99918e62209b550d6a8e8446e0a1a4d18d5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666AU6IHSG%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCQL3qQhFLDOvg5dD11GWza3ZstChaX5KKjY3nR22%2FGDgIgbBZtKL%2FuImpIZhKpipQDIBhDCYBeTlFSQY%2BZjpJmBaAqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJg7wXn9nvdO4%2F8%2BDSrcA7OD49x7HJfOzYb%2FelQjaZ2TnXz%2FRoJCl1lWrZ%2BuK1VE4LN5Rj5dnVoCI8lt1RhDJjhmHxBhRBESwJ2myO5VeGEIcRb451MXbEN92cZIZDCYbqB5RU9p9qe%2FSCfSagZvATNh6kRi7CnylYI0kqTlVcVOcYWhKLOAi7FQbgTv2xxVGhQZ%2FBf1Mq59UZrk%2FIP%2FGr%2BKfAKHe311dBa7UUn6w%2FYQBHksmMGYeW%2FqCVWnIKDntqmTL6AMT1V2PlHNh6MoRUbf9oIvgx103%2BAhO3tgiKpeIPc9Ji5ysFW%2FcqYItUpK5GCB3ALemMYoNC8%2F8LwjD1Ov2k65Lv64sWGkwKEMPX4ZUnbJz9sak19canyBWD3GxgO1Y1LpvVCx9Sa0Q4slTBhDvwlS52YVD6UM12ixpnj5TKckjRj8BJ%2B%2BL1pircJa%2BWdi28XQZoadiqJRfd7aEpphoRMr%2Fo8vBf6pAA%2Bx0isiG%2B98TLVEauIF73xhPGskrcd%2BF%2FnlZAn6TGwkUxbtnJYgjaNIa8kI%2FbogEuoiwAPuNtMVzqs65IFQw3pe7jCyGMK7vvhJVvE5ji7orL%2BZlw0SODCpSjC41OtbkV1%2FM1f1jTsEdCGgZAcE0lVaHLaWU03kUrTehBdqR1R0MKHDn9AGOqUBPm%2BNi7wN2XOnq5gTvIx7eoaKvicMXSWFzecGE7NgVCwEtYptMnupN6bCdY8RDJHgAH7DtMYu%2FAYqmaI1%2Bx2EgS3CVijxo55pmNS4vJutwLjBoyzhOEw%2FdSF0oA3RLAJ%2B%2B1mDlkT5Xx4p18UX6oYj206X2zXGnuEMXml60kYRzsugIbtSxq%2BuXsiZiYtktJsunUOH178RcCtVeSjuZBeu1DlJcq8B&X-Amz-Signature=262fe92cfdb6077adb8b953482c7589714d7d07f19aa6c18076e64a32bfe1f4b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
