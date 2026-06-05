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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664GBA7CLC%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044843Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCUf8M51ItGwJnmel4tndOmYaqiKbPbXk9lHa5X%2BmQ1owIgXpfylgTcKFCVmLaGU96ndoENrRAt%2BuWWmJ%2FWFQJdNjYq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDCK6DwEv6fhYYuy69ircA0gnM03%2BjVJKovQB0sjrC5RIIrCUEdjS6u8kMqa5CV3jBpUHHbqI7vb8RC0sgwiE4FykjH8xJaCB9KbSMjiPheoL5UzE%2FG9xeCIV2%2FSNvm59sLLuTNMkP4NB7qvGeFcueAZKUBWekMB4KS0AbWZqRs7CTfBGhzXFPqQtd0RQ0Fg%2Bm7LCgRRH9VXvPZx2wvwk9NfbsmHn6ZlXvEfMnr6v4ipj9uSfCklsW4fwXYkyG89weqPwuFgL7uOIIRuQCrJQrMcfARllFgmNEHLwuL3PVqwGYxVm09feA2wN6xFs4bDBCyXTLf8x02I6sKT6VZt%2FKJXPqf7C79mA%2B%2BHD6sqKmLkOnpby%2BRx0tkCHUk5K3UYJaqAIZunozklsmUTg0RZ3N%2BBSOljA2URttmOnvpmsj1veD41rS3T7D2MyeFV18jXgCA4Y8YNjxE%2BoqgDps9JSH8z%2BPIx%2FEr20%2FfVhph0CRvJWk%2B2NeroxqyBCmoWFNyGyaBZS%2Bl3sv%2BAA%2FaQoVA95k0SWeLtrhnHtpICBdeV1MVOh%2BUdmUGQunbSwgH2S0KLxXPSty9N0C0ZL4oFqyWn95ya9ung12%2BuQTpPgev%2BuQ4eIVisHb%2FrjeXITmoTaJLdzBdoputr95zI1nZ%2BLMPH%2FiNEGOqUBu57RpV0VeRCsRM%2BOfmuPf8Ib%2FxnKrTScFJp%2FqNJE5dFD1p5%2FQd23p6OCPla3aqI7vVfOYFNW5Ky1govZm9wULRcW0uOmF6jBCz7N6OL1Epymb%2BI5zxlfrNlOvYo2ePbr9OeAd9WjAGyPzXWcZ8DImB0qi2OlBRjX1ovKDqFDlKvKyLQur3zuuPcVAL0y8KxB7xhr2ko3MaYhUWxIkKCu6ERVSMoI&X-Amz-Signature=22b89e07a56967d011d2031b60cd9d14f6e8e453c9e91ad97ae4899ae8c796e8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWDL3YDQ%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044843Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCJwaNIoMTEUxKjIZADw5G9mmtymQMLOnomFtGahUFo9wIgUomJMzZV5qvHSSqcwHZlX%2BrU6TGnY%2F5fxvrIqIjBJkkq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDLoSOu90uvN49QeVoyrcA3sHnenkxTxniwqt6ND%2Blahjglai9SoiuGF7L5sCn%2FPGPE%2FAuu8XQlNCn64kdLAvGAM9h5XvasoiN84uMEnSTEItmCgJzAGznZ1wqkuy8ivjFyV2ltEM6o0BLZhDSX8zoAVrWzSm11rUueEofeBrf9XjtrjqFr2IYJaw9fzqTs8JrIviq7pPv7Y01iWMKgVQYPUdQKcvH3SSDnCKjQEhC4xNX%2BXIYv1WizkaT65EYJ48HfKaYt8F0lnsprl3bYpSN9OxnqJEl%2B3EXayE57KPYTkzExNF8xVpJ%2Fpwdiy6Dzo64VUgIfG4EzPrPBSCS7K63AS%2F2MBFa7UJBTv82Qmqk2BwnL5WzJTrBJqwa7qpbx1fzRS%2BbAAl1YMqjgo%2FFYdFGTzYJ99Ps8STC2K7Qt2i4pzERP2IfZvdHMPBVZxzbD8ZL7lDTMyTa9pOEeoxTEPleFTJBIImS%2F0OekNez3T3bGCDiNK0%2FiShInIIS4pAfXCtkvfyNwnmnG%2BEmWASzfozWIHTyeAmw6ox9c6YZNw9%2Bon3zcnoSQc97B9iUc5%2BH3tMSO8AD3GOejPQVQhPZfKkNLuCA0eGe5g%2F1IQK7rpNeffV4RNf3ggBK2gvrIVDt3GuaugeFc475iecwRxoMOf%2BiNEGOqUBINZrhjR%2BpkTKeAz76byoEYijN2HbiMLUQHi0j7ekhv26ZEIuoPeORoOJgoT%2BurkwFv8sPFCNY2fcc%2B4FDXKWE%2FlX7bFypSb4sNEmQCmN4Ozf96urOptDdfY2HfC8H2ZIKxDs6DdyrB9bZwE3MZRwCt0b6fZ5Jf0ucAKDgxI6zJUSLPMkkDnL6NRSiRfHc2dh%2BO1u%2BzuydZM2ogUYTf7wzm9crR8E&X-Amz-Signature=75586b4d95833895af98c96f15a64d97e4d64999e2e9be553101abfbca8876e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZB5RYOKN%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044838Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDgYscnKLGDa7CMkoq4LZLv7dFqKTaTQmio%2Fts8baObJwIhAK5kqpE2UzTuo4tf9e1AK5C%2B2AK76DDJdPOixfTHrGw4Kv8DCGQQABoMNjM3NDIzMTgzODA1IgyA0Y3LNNIPYnhFnRcq3ANBVxGKuaepEsdogf18eVyxLJLjK1j1Gt%2BZIhZjRAG6FpYvTwZSccKWqaqQArI5U4Zr%2FL2vqQHuswatPtZeu3QfsMZ4JGKplimoVAaTooqYC8AvYul8%2FSjx2lb23C2URNDKhnTRLGeByzUQQN2k8xQElbTxV3kJyQVSGmKVJRMrm67YXwY5jwi%2BYFQPmUhWFgRd17UYw1ER3QIixBWudjrOZIle8EpGtjTCc8YtvMgCP4rUkaiOyKtIv4x%2FoKS8py6WcCRoKnHLFQtqOMltNeD%2F%2Fb%2F8tM9cHa253NwYW0FIQEBX%2FSBUmyupOo8hkbqY1KswiAJ5kNe1bB4zMV0RSpFzO8RS%2FKiIe0B3hkFv%2FAtGmgTfP0iR%2BmvcLi5boYq%2FPo7ElYJdUEbLMGuCpM43zYgrRR6gvrc9t8vP1zpK3QaXG%2FPwVMEF5juaIzqS%2Bj7PV1cF%2Fo6YU%2BV0D445smjlqQTV46ibwWgK6S0JItsrDNwQ0rVXxNP4WEg5m%2BYLRwQO%2B6%2FioA4CpRVbSl3PhE5apSAy8SyoZRsAPCQOnuWdcYpaUKmAxsOWHfeJljefSdQrhGTPNcEsmIfikqCkdTizKZS3u0jC06Uj4H0T9OHs%2FkPe7M395fzrPNA0jkEkmzDG%2F4jRBjqkAXPhiwB310oguEBbTfgGx1xWIww8J3X7q0wmXy1inv9%2BhbwnwK%2FOb9aiHNKD4wXsV8VVXtVrQnvwZtP7gKjzS%2FqcYOr5VBlJ%2FN5WvDWW3XYItxAyTNpRhtI22REvspit6n0DXY7BPK3NrnkT8deRpu1YDXErWQY22Wav9bxngt7%2BFwOAx7hiYf92MBY79W%2BM%2FxDOjUfXWq4by5H4Uh%2BpyEsPn5oK&X-Amz-Signature=f777441006fd65679e0c2f57f776ebaa2b0c4dc8b683e69171cab8351d463b09&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZB5RYOKN%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044838Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDgYscnKLGDa7CMkoq4LZLv7dFqKTaTQmio%2Fts8baObJwIhAK5kqpE2UzTuo4tf9e1AK5C%2B2AK76DDJdPOixfTHrGw4Kv8DCGQQABoMNjM3NDIzMTgzODA1IgyA0Y3LNNIPYnhFnRcq3ANBVxGKuaepEsdogf18eVyxLJLjK1j1Gt%2BZIhZjRAG6FpYvTwZSccKWqaqQArI5U4Zr%2FL2vqQHuswatPtZeu3QfsMZ4JGKplimoVAaTooqYC8AvYul8%2FSjx2lb23C2URNDKhnTRLGeByzUQQN2k8xQElbTxV3kJyQVSGmKVJRMrm67YXwY5jwi%2BYFQPmUhWFgRd17UYw1ER3QIixBWudjrOZIle8EpGtjTCc8YtvMgCP4rUkaiOyKtIv4x%2FoKS8py6WcCRoKnHLFQtqOMltNeD%2F%2Fb%2F8tM9cHa253NwYW0FIQEBX%2FSBUmyupOo8hkbqY1KswiAJ5kNe1bB4zMV0RSpFzO8RS%2FKiIe0B3hkFv%2FAtGmgTfP0iR%2BmvcLi5boYq%2FPo7ElYJdUEbLMGuCpM43zYgrRR6gvrc9t8vP1zpK3QaXG%2FPwVMEF5juaIzqS%2Bj7PV1cF%2Fo6YU%2BV0D445smjlqQTV46ibwWgK6S0JItsrDNwQ0rVXxNP4WEg5m%2BYLRwQO%2B6%2FioA4CpRVbSl3PhE5apSAy8SyoZRsAPCQOnuWdcYpaUKmAxsOWHfeJljefSdQrhGTPNcEsmIfikqCkdTizKZS3u0jC06Uj4H0T9OHs%2FkPe7M395fzrPNA0jkEkmzDG%2F4jRBjqkAXPhiwB310oguEBbTfgGx1xWIww8J3X7q0wmXy1inv9%2BhbwnwK%2FOb9aiHNKD4wXsV8VVXtVrQnvwZtP7gKjzS%2FqcYOr5VBlJ%2FN5WvDWW3XYItxAyTNpRhtI22REvspit6n0DXY7BPK3NrnkT8deRpu1YDXErWQY22Wav9bxngt7%2BFwOAx7hiYf92MBY79W%2BM%2FxDOjUfXWq4by5H4Uh%2BpyEsPn5oK&X-Amz-Signature=ea05821dff7584ca4f715e15ee624ebac094630c896e8664174657eaaf108dd6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QM3GOXUB%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBDSyZakN3TlNs2jr8rB9WM2vVqyAObf3kZL6hMvy8zqAiEApBGQxULz6D3325C%2BAW9BKfm2AiwFnRBbVKqqA0wFKcsq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDLn8uXhq5qMeILSyKSrcA4DRi7%2BzHNQwcivUH%2BXRaMffCzy0guAcTnPgC0YqxVJE%2F85FGfGLBRTbJLkcjCD%2FGi63ZXQG8BWshT4QQN4HjwICcGibcIZv60wXytmxk3pBPxLjO7e7oqAI7vrMgFMuduXNdkDSJJ5KFHQl8jWmaj8T63o5rEJ950eEzxXr1hR1%2F7UajPGaprRYpx4P5cJgq86QQTr77oEDVmKlsEiEDzD%2BRcVzqvvwf2wLuUvrxfQqtVw%2BaaT7YVl%2BM5GDNiMLCbVlj4qEXdaeb%2F4Pban4EFNeHz5yrKhIBVF9q5xnw%2BwBEC6dKjLSNUuEp5VaTrbFcYmNO23vxiYh6ZVP0g7CFrkH3HzgKQbc%2FIi8HZS2ysB2CxGdII7fixOjpOk59T6fa5z9KjxxURf9LA%2BMw%2B4MHVv0WmP5P1LZRXow9KtzQlVbxpKaOgCiplYO60PL7iwBCIumveC9LHD9dKLurQe3vC%2FjB7qptYgLC6fYaucCKpkmpKGWD8HTtqXY1WsqFKACdXqjl%2FFWsPV2sGlOrqnM1kLs9VqD8cKrvaBhMzzgaDUxFlzROQn8vP4ID%2BzkODpyQyjKhWuHlvwmj1UVab4Zcj8ZKh5aCajlIlz%2BDjUNcfRMNYEnYcJVl7L%2BvDiOMK%2F%2BiNEGOqUBs79XnYxmw5pkmtk%2Br2fS%2Faq32VVrN85j9s8koj%2B4CHiOYgf0RTl3Q4BSAAlzdW7HDTMxXf5NR%2Bo8E09UzI8Tpbi97TH5NgWDKOfZ12ogEQ%2FmMizWId7E7nAcdxRv30rr%2FJ2egIYhfaG7dlTQA%2FRUvX%2FtI7B%2B6WFA4isfq5QDvAx0Hs3OD9ZcPob4Z2sVx2K2tfbaiPNGiyn7712ENkKMgLkpHfvi&X-Amz-Signature=7a5d1b07df47b8ac5cb0ee5417c5c0caaabc96642bf3aa0f900cca2e8802eaf5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664D47J2T3%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044852Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGLzV%2FQ%2BkRd%2BOchoAZij6NC87j7eSNWXRqi2%2FS2YKfV2AiEAuNjZDyTw7KU%2BcPjTYMDZMT7UphBCe33Di9sOZdhjK70q%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDLTbAWPwSzLThu5AHSrcAyTtMD%2BcWJwh6NJx5yXSzk5EMIMJG1nV0%2FkhGycd8C2vt6XQLiaajSfY1hkDrkdBSOy3aHZjTtbzTB2YqDU6Yc1I%2BazD1XEdJMi%2B20bQypzKu5H0cRZ2RdLWUT94EHubA7IuSxncVbB8VMzNQ%2B51SGec03zifkGEIZeDcbxJRJyk9uuEsjiK1s3QQ%2Fmfsu%2Fq65SII3wJOmMhpLaDOOOfLCG9iIWz7OscgCrJKmmxVc9owTj5YdP7CbIxyM1FYlv0YpfaoWQ3LEevwodcOIOMy7ggXWCiIQ%2FMQeuU1Snb8n2eMSEHRk%2BXc2SPg4VGgq4hci3KskTQcuUKtk%2B7esdZLAjlX2oNBZ9yTMB5RZ1nGBD8o%2BTYApn%2BoXC4DLYZeuqDHdWri6htE9ngx0TqRvFByFJiKLXaBUqOFHdmhV7YJhM1KdphgdxZ2U9LSAtak7BBbWXdA9mKqLalIcP3YMVgVT%2FmtxJvSATy2%2FvqVGD9WwG4g4%2BrwZ9YOPcd%2FBax0VDtt0%2BottjjYQyJuhc91HlJGcBi86B6lNcoNtoZQrIFoSM01JJ8D9yYqSrfPWUT9fv5M08%2Bx%2FvSu1Kx3k%2BhBPy9sEymKQiZ1BMSu5rVDcS%2FQOi2TQkKjQV%2FAA2%2B1F0SMPD9iNEGOqUBsPuOeciAOM6JP6YxC587cgSem%2FghePz3wkamxBntAW6JR%2B6EyMYvuTFehJ4Wc%2BBuCmZfR0zukNe3h0TQbQ%2FeIShf77ghje2DwY1dW4Y0t20ByryYQsZsIrQw01pJjqqzVvNuBpHrGDOLq%2BthXsUmDIEijC%2F9%2FHQaZWX3RuZR4pvvn6aVFOQssPq1elG%2FAQ7wKI6rQR4z42fxiPPMpNnyhDyRtnQJ&X-Amz-Signature=fe8a764c7e833ed2b603ae66db5baa2170aedfc2d08777f7e16bbf523c521455&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662FAHQ5RP%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044852Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDRPf6%2FTYOK3KfCHeNbSRxesjJ1shFd%2FtvHwVPKY33PYAiEAwzI0Pt%2Fi1wuumaRkQRjyt5zYYVyPRiWlgCC%2FimeMeAAq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDPFmdgfwkWhzyrfYRyrcAxPcDvx8WkiEYv3d2VQjcbNaR3JLbOGYMHZ1XnH8or2bIGv8Qmbaoaf2fshY0LPFv1IBT5lkD8dVG5ee0UJAPopE3R4QNDiQD96q4s8dJt96VzxWzKSStDgpmc743u%2FT7v4n4qrDr0JH0AmqoDHGP5%2F8reMYCzYO3sPFTUcI%2BIMXNKDqnEnz3h0f0YuxeytfRPhgh03DfPE4eCL2D92zQ9EuDAUnwk5nFvFGzBqmuDD7lnCpFoJ3i4R8d946pIjzSB2K9wEnmc8EhksymXJAjcASI8nLsRr7cF1qPmRYhL3emFmNJOvWEqb4LUKTTRNcjDwNlZPSS%2FQyfNMCQNjsczrdajLFx%2FalAGfiuXdgfkrSXLNdhYusC7Io7YzJOPKhrEAjgvhPHVe%2FCrH0TcTcb0X%2FgqM42izJzmzo%2FHSWa92QkoYDf%2B%2FoHlWWwoKfkm42rs7O257o2fT0J0QqpwFsGODKoJoFbjiDuIhrICl%2BBcxGLLm6SqxGvAQ2%2Bm5JGUoGnNitDREGmv3rDe%2BCX2LlUGwDt07quSDWXjxHzr1lPsVj0Z14fvk7TqoK%2FCj7ypQ1EN03%2BKnCCBd75zPOizJ%2BbsWzKNucHuVTBgzL5NUQZlKJxjyc8yCQ01YzDqpAMNv9iNEGOqUB%2FXAOBsxExs15MKmNzoTZDj9Vr8T12mvVKMpv4iJYmkUCapEl2zFERB6Wf0ncmUXktEuE6WfWpG5K4zPFJIH9TBqtbURCSt7KZd8NTutBP6A4jOaERRXW0VmrXxyhzap43mFaz%2BhAyXqfsi%2B%2B%2FI9P%2F%2BKyj1OMBfE4NkXX%2BfibQC2eZnyXpPlUTMfogX7NGcsUZlRtiK%2FiE8P%2BrkGb1mNJJ8%2FtjlCb&X-Amz-Signature=139a4311f81e1bf550ae4678cce6873580a1bbcd393d8a1939490034cb72689d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QV4Q55V%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044853Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGtTVLsjkje5hNDj64p1tEyf1gN7kZpcH4QBhbnwHHasAiEAsqefuidsSnqorPJXytQ4bMvoVI7GckI3YL8MpfocNaUq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDPzt8erDssAFO2sOUSrcAwuFJa0qqrRemEaDS%2BRyve%2Fv9pBNyeKYNaZyPWtih1LktpxBg2UwasXHFO3cWIPv%2FG4kBW1oZT%2BWmR22gghXhBbldYxGN1F7iVVQ1LYHJRVrXfmjPEmv8kg7pYpgek1LdASap%2Ff7hPRWGriHKpnA9qLgU6Hy3TrSULg%2FuFgW%2Bl99P1FNP%2B8%2BBOiOESVAeUEtBORvzTJZFfWJS7EuCx6fjU2pXsrTsTKgteu%2BN9hKPRZIWt11k%2BLBFRTN51fBH9qnfPUJke6Np9WDF0eXizTa4EIPnwK1KXdFU7RKpTSgbKnD759OLYuc2TTSTgOu%2Bkp7VVb%2BPW30qYFovsd91k5q5n9LhYheEIpwmA%2FG9N4lm28ystBI2xO900Jcscbd7zlEavskDxVsPa8iypBG2UKvjMVawnXOp32D9USPIjufM1khXB4lPAwGJpP9pB0nrrqNhu60%2B6yAmdSnXA%2F7Yod36v%2FnRtN1bI5ttGo4zK5AxcSqZRPCL63RMZV2WkM2eIs9SPWNEehaLOwtfpuajn1UNBI1ttHRLmnpd4LX5KxeaG52NXdcclQO95ZQJAwNavHtOpkfL1Ag6HIp64TLXnutXz8RCT4sfFDn7FNEiBq9jaLSeOvzSCYU4QFpXCBfMND%2FiNEGOqUBz0Db96bnwLqvQN34R1L3MLM7RpukBk0kBWQMWNvfWk2Sbz0FbPBhFdz6wCKaOdkB8pXGZrcXoiG4E5wZisvlnyGwlBom0d4Sbow91MUYr6Zx1FKJ2ZQAuo2Wqu5VMpxGJec9Yuls%2BGCK%2F7Yj3z4K5XrA5HyBFUSRTQPNQz%2B3%2BB4uTZHsMLVBVJ%2FXRlfd1LbcqVzImEIL3da70YcDYNtjT%2BhGjfX1&X-Amz-Signature=b18080783686482e3922877daa0aa7f073609c3cd46030220ab2024a6ff0b895&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q5XXA7JD%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044853Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDUX0jzfByKh%2B%2B1nfAtHu2B45HysuiEBhmm61xubReKzAIhAMhvAiAIIPKWXHQqO3vz4E52QX1L0hr4gc5LfjudF3UiKv8DCGQQABoMNjM3NDIzMTgzODA1IgwOnH7A540B39TVWJ8q3AN699mSVk%2B4MBNWpGQQfsNg5i1L56T%2FzYUTLmdQWbhOJky%2BmUhiyMW7tcsPZLI5vsCkpXVyw6W25gryUA8cL8yeAjs2Ke8DaD7l6Sa0CVCIjDvOKbwQEOr0rU11DPmduOVylWdnP4EWzxP4B%2BO7cStapRa8V9PNyIVUdZRQIiCjmpYAzVmZ89ed24xojxR6YuVs1TQYTsh8xkzlQEi61VZioYlHfFn0E9MmJPzX1MMtc%2FXMfMoyGltGT7Q6IfjpFdHSFn%2BIzuzGEmbhbOgT1fp0zRJq%2FeQwYVgGBtUv%2F1FKb4G55QfEt4u6ukdqrMBtJpRMZatAmURV1bmCksC3cf1ylRB0sIvujKeLBUM5cEh%2BMen6QSweD7qI%2F6dCpbHT02CjWld7i7U7P4xo4McYOH43HIpe%2FoPbxzFA9pPu1jho9%2F0cZfAoStjYAhbqobLKf8X%2F7%2BBA6cGmE4FYh1bixPCfowROgtJmicUWpM9JgoBmXcfvXQj78o7zsuGX2yz6D4gaQ2VoA6lqU%2FtrJqJKkEMj7%2F6zXEj%2Bpp3mgcJ9boRHL%2F3R%2FRkaSjJzRmJlezES%2BJhMOsq8liX7HMmas4uxnn7VdiQxcN%2Fii603hUx%2Bf120nVxwHVHXkjLicDunUzDKgInRBjqkAfswnQXJ6pZP6oJnTSOeeIm9Ta71B1UKMi0BGbDkC%2BRnqXOm6gO%2B18P3VKzRaIae2vHshB1rdQMhojcu%2BFHBifDc1YEmP5eoNtEfYVZL%2BFZ9b8tQKsCVbwbkQAyx5NOKM9RzayB6dCDbkiatc3kXf8Fa7Fqqs8FQLp14a1KOy8cTrhDFIps3NU5vmYcHI%2BuHXrJSnXvCXsgmeNzUnC1uOkzOYp%2BD&X-Amz-Signature=b5d09f8a91c8b45c57fac6970d2227f29f23d6a64adb0927ac490eb77df2a424&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZB5RYOKN%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044838Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDgYscnKLGDa7CMkoq4LZLv7dFqKTaTQmio%2Fts8baObJwIhAK5kqpE2UzTuo4tf9e1AK5C%2B2AK76DDJdPOixfTHrGw4Kv8DCGQQABoMNjM3NDIzMTgzODA1IgyA0Y3LNNIPYnhFnRcq3ANBVxGKuaepEsdogf18eVyxLJLjK1j1Gt%2BZIhZjRAG6FpYvTwZSccKWqaqQArI5U4Zr%2FL2vqQHuswatPtZeu3QfsMZ4JGKplimoVAaTooqYC8AvYul8%2FSjx2lb23C2URNDKhnTRLGeByzUQQN2k8xQElbTxV3kJyQVSGmKVJRMrm67YXwY5jwi%2BYFQPmUhWFgRd17UYw1ER3QIixBWudjrOZIle8EpGtjTCc8YtvMgCP4rUkaiOyKtIv4x%2FoKS8py6WcCRoKnHLFQtqOMltNeD%2F%2Fb%2F8tM9cHa253NwYW0FIQEBX%2FSBUmyupOo8hkbqY1KswiAJ5kNe1bB4zMV0RSpFzO8RS%2FKiIe0B3hkFv%2FAtGmgTfP0iR%2BmvcLi5boYq%2FPo7ElYJdUEbLMGuCpM43zYgrRR6gvrc9t8vP1zpK3QaXG%2FPwVMEF5juaIzqS%2Bj7PV1cF%2Fo6YU%2BV0D445smjlqQTV46ibwWgK6S0JItsrDNwQ0rVXxNP4WEg5m%2BYLRwQO%2B6%2FioA4CpRVbSl3PhE5apSAy8SyoZRsAPCQOnuWdcYpaUKmAxsOWHfeJljefSdQrhGTPNcEsmIfikqCkdTizKZS3u0jC06Uj4H0T9OHs%2FkPe7M395fzrPNA0jkEkmzDG%2F4jRBjqkAXPhiwB310oguEBbTfgGx1xWIww8J3X7q0wmXy1inv9%2BhbwnwK%2FOb9aiHNKD4wXsV8VVXtVrQnvwZtP7gKjzS%2FqcYOr5VBlJ%2FN5WvDWW3XYItxAyTNpRhtI22REvspit6n0DXY7BPK3NrnkT8deRpu1YDXErWQY22Wav9bxngt7%2BFwOAx7hiYf92MBY79W%2BM%2FxDOjUfXWq4by5H4Uh%2BpyEsPn5oK&X-Amz-Signature=0ccb137cd7d562adeda209759f58cd22e44e456712006e18198b3d66e2088075&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
