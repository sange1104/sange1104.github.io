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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TEDPLJNX%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034109Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIG%2FrSIec7Ook%2Fjx5C%2FO6OY%2FCQrm7ahjkXwja%2FWVxSAaCAiEA6kRm8CFq8v%2FQrvt5r6rkQiyCnFQpS%2BFWhxROwNAkBvsqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGN%2BO2jO1LpeJpcPkCrcA1h29Lnk5qv81r2GNGzmodWOGyoDsYD9D1PphztwgPOm9QJU3%2F1gIgBgJPtgBHZ5koTjLDS1IOZm6g0MZyNxY%2BSe4PdgwSGw%2B18y%2FxKrqGaAkU793HbZqNTXdVKp15MHjWlD5rPyreGqMnNcZYUKZjB3bJHGw764Hfw2BAPgVtb%2BiuEcAcrf8aj3VNk3FQqnqZnqfNKOOO7VoQf7nWNeOcJqdUwFv9DiekPCkrkqFIeeDS4SzrmJoW5hVNLpRUPEvDsO2LWUGIJOraOcVlsDI1hcYoyfwROBs0BadpOTZLjbIJ%2B3mWvo0SvsPF0KE%2BzrIPvF1SpIKUqRS3TR7KSnmxJdlEq9XHjfwiUNEfYpc9xwZXYCP5UgBYxqFA4wWLsBjV101PqZo6AvLqbPGY0xXwQ5KycJWMuZ4blSPAzGs8KXqlyBh6%2FGrXrIoyVYQriwNdMBB%2BmtxxN08oChWmIJHCSTcXADb0RjfzQQb3OzmgBkBom9G1r6txxUR1vBUpXb2WuqHRaJqXO6k6S2zsfvfQNxtzZkwWwsPNwKZzHiU2%2Bm8CiYEz0GE%2BZBglGM9kJ%2FcJHsVVR7O3pE%2BP%2FfU4tQE51FmsviETpmY6Oy%2FDXzswVGxHBL%2BY6y5eGrs%2FjWMJTi%2B84GOqUBXLXppcrXoz3dEtcszZ6bYs4xlwRqOV0ed8ZhOpNmd%2Fj%2B0zdlh%2B%2BR19Oj5jrLhccR6eMU4LB3xolQ7IzU03u5kKCa2IlPQw6HktWlmemrikCcfIod%2FUkFKddP7UcXxIV3wN9oFfAgQu4rDYfJJCfF7L6d3MeaYKc5Iq0lunE%2BrJ82IdyZD9Cxuk%2F59TpvlEoS6oU6%2B3XtfyDtcl84F4%2BdKKPlJvjm&X-Amz-Signature=dd235de6ae33a5e2f797687c89527fcb433357b728a0f3c5fe3a3f5f7b238e5f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665HRPVDAK%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFtu32A5PVuAVonsayFEMuWp8z7ZAUoMZQqK0rb0EXBlAiEAli%2Fs3lOQ%2BunwinHYeiGMS3%2FDCtSoIfxeGR0gjWMZkr8qiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEXu21fB6AQ4Yd0U3SrcA44%2FKJVAzkW0rNoilFQ%2BLNu46Qz0IJBA%2BAbtSA5bCml2aLbEZfTJBUdzvq9TsSdSombCvWn1ckfqT%2FPkYy5zYJs64tmPZc7kMujGnevcC4GBFgytW0cMipuKzv5rBQS9bKoByRuMZ368R1%2FNGC35vbhWm95uBMcLAVgVkS6FxSiorGlDScyVbCxKoyWRr25iB6O%2FbiWPnmO38s4iPIDRS12fyS1f5lwOjeRsa6uxgXp8ORevsPQhYr%2FLCjeOPNK1znwdPDfR37dvh8uNP7ioY2k0PqLtN%2FNxYXNGPZV39bvJMLmMdj2AE3CDfS%2BUhvcvItbI8f8jZY3L5ZscuE19t%2BXqYauUiOqOyorEGdiSQnxnlvEtO%2B77sjmsleEQnnL0I5DC2sHl9%2F2pTouSDW%2F5MTFZ%2F4tlsgSV2AHACiaJrYu1Lq3il2Pghu%2F1u7gXjKd5cbJCec%2FPSJas24ghTMIvm%2BCKd5oKl8x2%2BBm5xLA3ul4KtCECUbfD%2F0JeDvbhtIlxvLmF6hRchRpqUQbL5MVhbI5dLw1tvOVXxJqzc7mm9qy0LceMd9jH2TQ48EU6gHEMUXAjQ1xKJTpylRR9iycBe6396LTFCcKXcgV83boHuRkPNmTHL5k4LJkSo8EcMOvj%2B84GOqUBh36V%2ByJsNve4hqbLsrVzsitranewxcoTa1nOg3EBmG7%2BdJCtN5Q3dPeDOFoe2CS5V2cCOEU0Ctjv0lKtczwzeme8x5W%2BbGc8ZVqwxu20FM%2FKYZW7PlVvSvCcHtA6G32wuitUVflPfem%2FHb5P2vzhMvjmcZ1TJjoHEtDnky4bUQc8ly9LSkQj%2B4XtNK%2FOLDjDNnr17QcoQGHZhMXKg5JcM%2FBSfWU%2F&X-Amz-Signature=343ddacf535e42e0065258140f575d8a87e668bcbc9f0459682cbd867b601d15&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QZTDPOJH%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034105Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDhrS5Xdd5Ck1tu%2Bod4389VDpSfxjnTRQZ9EP2BzBzIYwIhAIKNt9w%2BoUZQhypLeW065cYCVJe2PgN8rxDtOgLLuMZKKogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxoUthXsg2enW5lbnsq3AM5OIFnUgb89oZydTOwqVpwujXERONndEnNbD2u3ZBY6PkcTCvD5CmH1UcjX9fmGSJpWnwldwZ31IczpZg0P%2F9PvuQHYXvhLktRWu%2FfcJ3V4bR864xw9rPAILdXUWxzeNoLAPGBPgYKioTF2%2FIfVLr%2FY1cVmV8dpphp5fhuGBs%2FywOJTYrDqaGT4Tyixh8A%2FYO4yW1TOPGdgO%2FoBqlsSrE%2BGjsrXSDdLEaadiB9XiwJ7MDwIDA1yE3jdd8moGY3t1q6HprVIr98Zf9NBeqOsBhDu1xqhrky37wzj5lT648mB%2F3fm%2BBN96o0o%2FjegDq7XQkRmLYcweKXzVR4nyFloM9qz8Uc7Qm%2ByrRlbxIg1yps9mm%2FBhLykUvFSGVj2kEl6r5%2B37UWcP%2BXeRB71QRqCqx5T5LfjNa1POkfdCUS2w0F%2BKvJ8N30RuEQiboTxBC%2FnGqUXUR20HZ9RYt5vzKIdNR6NoRSKJEOCmPnIkGHeTepcn7cIKjtUvBD%2BT%2FFssX6qZKrTfnqrv458MoPmPqd3T4h9tTzT98w7GBch3m5Lp5RpVH%2Birx3NSytjIvhHn8NmNVDEsTpgyl6ZmSjTDVR%2FEqTRS67k0d9KgzasrfefmsTEZJFvhFF5o78LS%2BOIzDN4%2FvOBjqkASJs%2BDLz%2FCV6iJC9bpNdBREKifxYlKEgLRcdRRqZS8uD07liU1JB39ORgQ0pp45gEl%2FsfsAY%2FAJp5opgeUoTA3in2dX3RUeo%2BogSeXgcPn1z8V3BhXjvzq1PxnhW7CYk3eA4t3PvqK1oFmCciKXpyXQh5dKzs3H3zZlKOhluyi%2BjIMqgbnpd8ELPhrFu%2FfYkZib6xaI8Cm2nortlvgQm%2FsoYMcYC&X-Amz-Signature=218febedffff6af92cb11a4f1e3a4878cb8ebebd641f9065ae5ea357bdb781f5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QZTDPOJH%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034105Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDhrS5Xdd5Ck1tu%2Bod4389VDpSfxjnTRQZ9EP2BzBzIYwIhAIKNt9w%2BoUZQhypLeW065cYCVJe2PgN8rxDtOgLLuMZKKogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxoUthXsg2enW5lbnsq3AM5OIFnUgb89oZydTOwqVpwujXERONndEnNbD2u3ZBY6PkcTCvD5CmH1UcjX9fmGSJpWnwldwZ31IczpZg0P%2F9PvuQHYXvhLktRWu%2FfcJ3V4bR864xw9rPAILdXUWxzeNoLAPGBPgYKioTF2%2FIfVLr%2FY1cVmV8dpphp5fhuGBs%2FywOJTYrDqaGT4Tyixh8A%2FYO4yW1TOPGdgO%2FoBqlsSrE%2BGjsrXSDdLEaadiB9XiwJ7MDwIDA1yE3jdd8moGY3t1q6HprVIr98Zf9NBeqOsBhDu1xqhrky37wzj5lT648mB%2F3fm%2BBN96o0o%2FjegDq7XQkRmLYcweKXzVR4nyFloM9qz8Uc7Qm%2ByrRlbxIg1yps9mm%2FBhLykUvFSGVj2kEl6r5%2B37UWcP%2BXeRB71QRqCqx5T5LfjNa1POkfdCUS2w0F%2BKvJ8N30RuEQiboTxBC%2FnGqUXUR20HZ9RYt5vzKIdNR6NoRSKJEOCmPnIkGHeTepcn7cIKjtUvBD%2BT%2FFssX6qZKrTfnqrv458MoPmPqd3T4h9tTzT98w7GBch3m5Lp5RpVH%2Birx3NSytjIvhHn8NmNVDEsTpgyl6ZmSjTDVR%2FEqTRS67k0d9KgzasrfefmsTEZJFvhFF5o78LS%2BOIzDN4%2FvOBjqkASJs%2BDLz%2FCV6iJC9bpNdBREKifxYlKEgLRcdRRqZS8uD07liU1JB39ORgQ0pp45gEl%2FsfsAY%2FAJp5opgeUoTA3in2dX3RUeo%2BogSeXgcPn1z8V3BhXjvzq1PxnhW7CYk3eA4t3PvqK1oFmCciKXpyXQh5dKzs3H3zZlKOhluyi%2BjIMqgbnpd8ELPhrFu%2FfYkZib6xaI8Cm2nortlvgQm%2FsoYMcYC&X-Amz-Signature=63521db2e9d8736e7ecc355326cf9aeac2b0fa6b2e7b453af6f426803a605f6f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XKUGG2AY%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034123Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCXR8gHFaUzHF1AmqXQYPdDidMN55shPuMhRUucew21kAIhAPLBZdEsFLi7gnbDC1Ry7KaAfM0jM5WfBG7bWPea7DvyKogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxmekZz820SkExeImUq3AP8rtfhMGCG%2FlnolukNy6%2FK1z5VaIzI%2F6qzsJbQjqXyAXXUM7Uwrg4GWXAojuVO2UC3GGn8oREP2k7zrFv7s%2BrceFVptXVHdvVFM0xMPDCloUNI30YFXWI5wIGylkKCNACGEIR9e1zgoOvBM94CDSuLyUPINJQJbJEeEqlWVPthZ2JtuANgoWX9MziM%2B6Cc7mGmMiahTjH3LYcHBBZZyeXBcNuRrBdXc2xqtwTnKgItvH6umAt%2BW57MOWrMIQ69JfbfvTTaAeQWonAws50PTiEJvY%2FyX4tQXJTbFgk5AtPnp87gl2%2FTbHPGeQJXG4BtPQCxBt7jl7Nrw2dNLf76oT8tKpHE2NYp9ag2kJKFQAeoPEStV18Gq2AheT1flsoT4rGw2KLJLnufYXH3VjyWVogHT3PqhNocGAhJ82zSGUmTK5xbh5Vp%2BXeSlpPgUjM4GXXCAnOBuIiIT%2B2OFhuStGbQ3WdzXglZf5MuC1ClLRowUaD3wJAQEMuQrp1%2Fxgloz8ZVt0rkvQqJ6y9pnNK8%2BL8aEthroDbIvEdGxRBOZwhh3H33GfZkIO9DNCrQiv7t3UU88ivFQi928nftNfOkGyfSGSe10mEkTNhNLuSngy8c3fyGU46MdwXV6qumCjCM4vvOBjqkAYrgiICpGbQ5uXSH%2FZ6vDmNzVXG5ZRPEAi%2BzL2Mn3TqUb1hkx3rltFjhrh12ORIWEfcFuMzSA%2BkuCc2Bdgs1ZujhelujkcNmtvXzF2XnA4%2B2OEb9dAsWlrAddkDfEYIrhkXYmO6%2B9eS24%2F9Z7SG2pfWDdd5L4EWTBGvp4mWkZ%2FRZxhK2mKII7KqjBjnwMPl3HV%2FkNXaemKD84aTE2tY3zUBe6%2FDo&X-Amz-Signature=10803667fe21104e312dd8211a13a386a42a7f38bb0d1661696e789f749535a6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662QBF4K4X%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034125Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDHA0dp9P2M2Wxpr%2Bl%2Bm%2FpZenTGq7AQE%2BqHNo9fCcE0WAIgf3FfJlhcNxmZO4FgWMdl99wifXywWYGu7%2FrpFX%2Fp9YYqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ0jVoJQGwpRvGlsoircAwY%2BML8fSjIiA%2BXOIebIrxjJBwh%2BGWuYOBesuhUzCtRDUt%2BST9uzGYhmYcGJT87OXe%2BbFcJLiBRvl5ovEXC%2BZiRVVyAl8J7GBR%2BlFsaiv%2FlJVrp9MuI6eAyK0rWyZX%2Fmv5Hs2gKmr6b6fqrhBiwak%2FEseaXlaY3twEejsfEpRDnYaj2Q4YpT4LH3Q2CJ9XCzXhLC9VmIE6TslQdahiJ4hUlenrErFdhMFGD7jXyR9764SQRpBfXZSm5m0N%2Bk2XbDS7FRprxo4B5SFxcHRxU%2FriHfZMQa0DKCh%2FFNFakcQKNO6hboh01m5FEqkQi7UrY%2F1zC8eg7FzRlFo3jzRmwEm30GOev23kABzmfpZaiT0pDlrGCWYwhY2VbTLMdGjzOKeTGPzED4KYiqOCtnxW%2BAdXHW0n7uN4xhC%2FFMBL2FjS4nxO3OYJMf8MnAhHLYJu0pALhMq5xy50puuxH8T7pEXNZDwq61MLEU%2BJZ0YBNJC%2FvAlMCJXfIn16dP7%2B%2FeqhGclgyNf3jBHfsbh0a50Ducq0lEuHmyvhEDRiaXlHtUV5%2B301SDoDvxkXLSH7RhL2Cij7H7HNjcSfOjbfGWc4wg536WtxA4EWQpJegVJQn9M%2B%2F%2Fee7WxiggFWritMi8MPLj%2B84GOqUB9vyyfhMS0yQUCzO9nut8gSsEQ6sUUzlbSl6PtJK4lG%2BQCuZboJ5dEQ8aqZQLisP0lfA0wWKmd2OskmmJttEPw0z1fhyatesZcq0pq8q0I2Hrl0q8z37WCArfsrrgaL%2FsCji84IyaXyvj1rS3UNEUItcnlnoRkAVmAKcWgaVkT4BmxSiUTUCTKYt%2B%2Bt9UOjA7e53YZ6lCfCwt1a9EdOWDb3Ajfu2a&X-Amz-Signature=70d91a075f1e72a4149213ae33a1c4441372b60d0aaa3fa5d9ebec740ec1cce8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RZ5U7AXZ%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034126Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHOKSPBQEDDnloARNLjb%2Fr%2B%2BOgVLkXYbQNUDrZdyscf3AiA2THCOcJjx7hodrzMCev4YZ%2BnOigJkjUMsLDoeczPQiiqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJB9EhdxBNlFyFMKEKtwDaMiq2660O6rokjvuC7NQOZPIaNz6ZU%2Bax4iRtijrSFXAlKgRJti4uRGb0bvXbqq41ezEtN10VjjS7gBzFtHxZEaIcpHdDdf%2BOF3rIol53J2m0uNV6iF1Kp9b%2BR3qBiMRAmJDXS7AuuIlFFIxCGNt7cSCSr4S%2Bbo%2F5fl6Lu7mk5xwU6b7MDgn3NiHPCanYxQK84NUWCQQ6c%2FKhg4eHYYJgqNxhSiM0iAEITe5pWSqWbKk12oYQioUJsJRXXCCJz3oD6f8i77lw54z%2BJUS3Vsk1Vo%2F7sP%2Fu%2FLkikn6NylucZcVZnoVqc%2FEnAcG%2BzbNponowvyNyLYKrsNQ9ndHO%2B8J3hypN1HQMFaV1032tslUQla%2FLzUHslIBAaljAZH%2Bj5A9mxg3191JW8PmVptP%2FQRQU68cZOVgiKcRn00ndAs9cFJvU88tsL%2FzXvfCCzDpDfjA5LUxU8kp4IXJZcvR81hugGON%2FMCdvu8lnkUSCjioeOdi%2B9QKbkGBLSR5%2BetclZ385yWD3pHNoIfOGWo7ap3c2fkHldHORrxlYTLrQkw2%2FLauuPwUaOLd%2Bf3EY5MvhBdt5%2FZlhKNiWZ0oqyy3MmV3EY7is0zIwMd2yXwrntrsv37TAZCr0EUoXl5xFMwwjuL7zgY6pgF%2BAAk03c9T4W0HbYoqwvcgS1UYY8BUBdldt8Q9Tgjdelot%2FA%2B1KUMbLUtnKiJm%2Bokr74iIztYJwN5I%2Ffm6ANSpnB6pfcCZylw8D98JJ3Vtc4hVKqGKWoi1l6xRlswDEw2w0s%2FHGpY4XPZHOxFx8b0YxG8ZApjgX5j6CX0tRTi8lNcxOgpLE0EFmt56R%2F8dZfuBfNbXoBeFKMsZ36O6UDp0VDS9Ztnu&X-Amz-Signature=35a030fd6b6f9b2562dff6defa5749115b3c34654f87c9a10d968360468d84fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QEQ6NFT%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034126Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCVr8XhBHEwkbmJA3JL%2B9ABdGkNqjIJpymNofng5j5sRgIgKTwGNrH%2FqR9lB%2F0rVT%2BOXqXyTkNroTlpCRfAqa%2BMNVQqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNw5X48DV0i%2FO33GxyrcA4hWQYgJVbrm0l5Dhn%2F55Fdll3gxPlmXFBLIOBzrag2e%2FA4x4hveBI5k8UCzu5qQ7zmJ4iIzrxhsZ51xgshn2or0gMjwBCUpf7XJUHfbv2HldRd01lBCi4OtuC71S92cu49828n%2BaW3v6SsydjGiXPHn8gPOw4ZGWW9srwB7bl8F24FBevMmQc97GzXPuOTRAQgRe9jvQwQa68zqYVFK485DL0cfsoBo2lonWGu%2FQ6sZ%2F2nOJUXrjyh1%2BiYnMG4pVbaj7EcWw1iZpIN3B4iwYRbCN%2FJuYRFvIpWmCW3vhC7Zdl48hjazejSh82eXZHZ%2FdVGa5eW2iOV%2BChBy5TbpVjR8v%2FxMsfZQGbFuvj7BfGrXoFeGsGyDUef0aPJ2KsNC50jgZ7%2FUaW3Vn%2BXz66U%2BgqT5TMLLi0qkGPTq8sZbEVUo0rj1cb5Lb45uUM4Mwf%2B4ADwdisxYzka8sxN3q1HMHDdWap4YG%2BOv%2F6bn9kqD7X0xLIQoqYFAE%2BRR3AQa%2FvKmxZWCLL9d4czJYWgcls%2BYinaH%2BS%2FQ2ibytu%2BvBEhHlvouev8xUEJPDHer0L7YWEowBHd0OOHpctand5daxSxjtlf2dgZ1K70ZoApBdaXkquvvIvFvdjhSIfh%2F8b1EMIXj%2B84GOqUBHkXxZQ0iTj7ZWDiivj3ZpH%2BMPuZmrai8F6wvQqr5OFtOPi18XVZYhSHsS2gNtQuSRKMFvwiLRSqx76cZyy1QR6wQWEpRbv416z1KApGW%2BA3emwgdRQfnGd1UgxqYUV8YEweGKKDp455gfeZ0g%2BgLS0k0XsTL3CjoXhQxFzrYIXYgL6vwuPQ2GMqpEYtvKWp3W9JxqdvQ7BYGVDrXKjJ8XpyVxMM8&X-Amz-Signature=149f5444182f1120e4b18616341b5754b7435dfc92dc05cdc64c2a5430191aa3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665QIBKK35%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034126Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGvdlJDgDfpHf5DC8TkbStBsPqYJrouLrYJJF9bgndSYAiEAxYjgiymt0mHWRyhIY9BMDsXI6eEKY72J6iwl9EZMzQcqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGT0Ld4SZah5Z9OmwSrcA%2FzoYkNypcF%2FhaKrl%2BDxFFecRJdTEEpu4RupbSdcsqEgxjWbxb1Odvf4GOfRpjn739qTVH4Yy0YDpcKni1%2FaBbBfFFhaeeLbn48AUx5NLJ5q3FW2FbRN6QeK8T7Ut7ZNh%2BfU65FF7DQT5YM6vYeNN%2BZv8C%2FgmD69ezEcGAsO4MVM20nwR8QjjW%2BJK3wiTmmvM858Jp6picm49CAVxWlq%2FrpKYDGrEOLBedCzL%2B2o3pgf3hSmGDXtS6Qcw1WZWOOmZd1FAZmjMCG%2Fv53jwne49uUxsv55J8DTOmZG3f8k9WYzTeb0PcHvvh%2FHUIzS66TgsYgpsXtMORE2Xo6RZCyGoyfCtXEw9gpRL9PHNLeprvy%2F6WLuWMd%2FeY1Nedy8C06Z5%2B9GJ3L8D40YOT5i2y95irAdBftnI0Mjd6bBFPCCffukPZaecJNJbWoJ4aU1gprkFRyEkBwSPlQ%2FStIkY4uSUjZIJWRF8fqQU6i6skaevKc%2BNwkjm6pmPo4hMYFv%2B%2FNlS3eFRaIRIBG1OFB15wNBHba5H7Jj8u8Hv40rQkNrooMQhe%2FskhjNFYteEAlPuZ%2BnvhoMYKIlWldyXCx575GIKuwwMPF7ieLDGBCQjODzuAKiLgJDfe4yvY4Bg87xMN7j%2B84GOqUBTbuzc3wNydAPg5sfFP8x874Od7byBaL%2FE%2BchRRPS2vHZpUiWk0oIwA9bDbO6qEIvORIAEcvwzSS5NbvdKN%2B86c29W3zHQKh%2FxRyb46IgbzBciBSSDwvbcooruhcxUZ2RMXGk3poiT0AxsEAkk5nDLGNDR3vVWscw4Ul6WbsHpqt%2Fw5rK7lGlr%2Fy5lkvNG94kuDhOwhIfq4NgiuaVvYC3Wm0f0xhA&X-Amz-Signature=60b04c91a25839fe513a41deb86f3551a9f2debaff89b30d26a02af5e187529d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QZTDPOJH%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034105Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDhrS5Xdd5Ck1tu%2Bod4389VDpSfxjnTRQZ9EP2BzBzIYwIhAIKNt9w%2BoUZQhypLeW065cYCVJe2PgN8rxDtOgLLuMZKKogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxoUthXsg2enW5lbnsq3AM5OIFnUgb89oZydTOwqVpwujXERONndEnNbD2u3ZBY6PkcTCvD5CmH1UcjX9fmGSJpWnwldwZ31IczpZg0P%2F9PvuQHYXvhLktRWu%2FfcJ3V4bR864xw9rPAILdXUWxzeNoLAPGBPgYKioTF2%2FIfVLr%2FY1cVmV8dpphp5fhuGBs%2FywOJTYrDqaGT4Tyixh8A%2FYO4yW1TOPGdgO%2FoBqlsSrE%2BGjsrXSDdLEaadiB9XiwJ7MDwIDA1yE3jdd8moGY3t1q6HprVIr98Zf9NBeqOsBhDu1xqhrky37wzj5lT648mB%2F3fm%2BBN96o0o%2FjegDq7XQkRmLYcweKXzVR4nyFloM9qz8Uc7Qm%2ByrRlbxIg1yps9mm%2FBhLykUvFSGVj2kEl6r5%2B37UWcP%2BXeRB71QRqCqx5T5LfjNa1POkfdCUS2w0F%2BKvJ8N30RuEQiboTxBC%2FnGqUXUR20HZ9RYt5vzKIdNR6NoRSKJEOCmPnIkGHeTepcn7cIKjtUvBD%2BT%2FFssX6qZKrTfnqrv458MoPmPqd3T4h9tTzT98w7GBch3m5Lp5RpVH%2Birx3NSytjIvhHn8NmNVDEsTpgyl6ZmSjTDVR%2FEqTRS67k0d9KgzasrfefmsTEZJFvhFF5o78LS%2BOIzDN4%2FvOBjqkASJs%2BDLz%2FCV6iJC9bpNdBREKifxYlKEgLRcdRRqZS8uD07liU1JB39ORgQ0pp45gEl%2FsfsAY%2FAJp5opgeUoTA3in2dX3RUeo%2BogSeXgcPn1z8V3BhXjvzq1PxnhW7CYk3eA4t3PvqK1oFmCciKXpyXQh5dKzs3H3zZlKOhluyi%2BjIMqgbnpd8ELPhrFu%2FfYkZib6xaI8Cm2nortlvgQm%2FsoYMcYC&X-Amz-Signature=28d9a8197c8ef3a43887596445d4fe4025beef8d309777bf527eb5c635f172f3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
