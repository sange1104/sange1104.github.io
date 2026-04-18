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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664JAQ6OFO%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T033217Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJHMEUCIQCIodj%2FwBwuZs00UpLps7SstDWdUK6TX8k5HB5LCrrAzQIgRpOSMl3CDE10ss8zi634DmCtYsmzgUfFPzfRRM6OeREqiAQI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDC%2BQ6Ng1vmbGcg6RrCrcA1%2F92edRguuht4C5QnyrydDd6uVpFPYfBDtF44BgvP0GZKwNum5Ag79VDfIOnzjW38s1xPzbRM2iHTSYcRcu8cB0%2BbSclbnMTa0BoCT7ltRO8TOB1MlQOHXI%2BF7dnGcjDpmOiwif%2BBYgqVhIYkbZ4DHby8q40%2FcVM7WfQ1TECUJ5AHCSEkNIj3c5RrlO5wnmVN26qRM4X5dXi2HBrvARp1snFUM4QIvX9wiEqUWhvhbjb7x%2B0agbwTNHhLN3t4WhS9k4qwhBu%2Bji9L97aOgXJ1zfIbv0SzRP%2B5aa8TUExSjs5DF29RNWdwm4aqelf1%2BAXOS4OexcM2O6P4o9LpAf6%2BUNaVgn40xrvMcBRcBwZ5WH8KUGOn9sSy0UsG%2BnFMFvU0aYoQkCIERlxF4VjEFQCOPtJYBU3VvJc8%2BVWXOjWRxr2%2FDJ2FI9ufQ62QEU6gps8pgeXejOndsSyItJk96ya3ajfc7Wt2FHIC9NFmONFqZr%2FgwlOUDu9mRHletk5Dmt%2BWTAtyWE%2FF7Z3Xz%2Fm7VFUtKjsDflUgC5VA8g%2F%2FKbyU06H4V946ha7rEHDZJQB06Ns1hiZrHhx%2BF%2F6wXCfbGJhg4sqqPB3ljBztSwoYr%2B7OYjqXTYq0lPytyxkMCeMJCsi88GOqUBfHjLvtJedXnIH3uZGYa6lykw3bLkSF0a7%2FY%2Fpf70DuiwrIstEwytBpWznX3dF2qe1SCNAlvCivslSdTM1llJn7I2vepVuPkN5itL9Q11mhhx7dF4aA60BB%2FG6nbEKcK92C0u5ZYxgHfduaMqLfUFEuivjuNKOqYdx8T3%2BPDgBw02AYfWt43q6zoLzu%2Fj1d8sUJgqlICUNPEeMsRPiW%2BCpJ2a0D4Z&X-Amz-Signature=11b62229f469a48e4ea95a1e8fb4853c939d78685251a85600efea90731fada4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UBHE32RO%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T033217Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJGMEQCIExDnF%2FQ0F4k5vGqCcCgrqDmFP54A44LUnRLfFVKGKsNAiAJkiLhR8KDJN1jZy45xuhwD0C6qkPFRp1WxOKWL5VJTyqIBAjk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMO1eS3gZrPJd%2BjPluKtwDmkkmFLKeOTyrK3PnA0p9slsrQj1sVlT8fbGnBdcl8x19UI%2B%2BiyTv%2F03E51Dw9P48i3mPgp4JRdiaNZdp0pyvN2rmVE0jD8THlxV%2BU0wPOv418DUYkfhUlqt8jk8yRJcBzBISFPHycE1WyYHaDEDSXXfPx0bZ90N9ku62nzTI7mq9nZClJmPrwKCwz6xoPmQ041FquMkfTbKpreefS83HxnAM37TD4c4YLneQaYjtbrgyhNjsbf9u%2Fo513MuRx063Xd8jFAsdO8T%2FQIG2LZKO%2FaYp3QIwMi3m089n8pGj56Mf4OCilv%2BNhwSC4fO5GVGt97Gyr4aQ5EbxAC9UOkA7SzWvT8byihMsDxzJ6RvEa7VJkUORsi2TADZsFaRpu%2FmyZYtV%2FY8uyU93HB6a2HxAx3JkcLCPuYx4kgUT%2Bb5pJJzEQB0vk1%2BkvcMs2PPTMf%2B5d%2BNAOmXWr8D4MEcBzVETqHgSGw7VqeRL1ODIgF%2FAw0TT%2Bkw2lupkZP9bS8d41w643LhZ1t32xdmvUs1J7%2BIKWaNqnkEfD7VCtYQ3m%2FoXNsxLpB8D9%2Fpxu5KhSZLlYTUZBW1oeadW5wRb8GhOHo4pj2GeML0uJA0uRZHoJnjpXIeV35%2FWzu2U%2FnQjvq8w8tWLzwY6pgGzo0wksMtlfzvgnEsqh25bxKqUind9V6FOGTKxN8FXixXBh0hXBSwMH1%2B1%2B83r1o8xavvYZY8lLJouYEadyuDW7W5oC3HtXg9DTmKxDc7xJWgRLJwU%2F16HvkXT%2FstxPfCL5hkajFudCJ4%2BpjbcnldbOXaGtTQcVp%2B1L2YQvC2sFk8q72bsj2adNj6d%2BTVCKmiJEpxFD19f35CjkMDx4bpf5AQNm45x&X-Amz-Signature=cfcb1d8c2adaaf16f6fdd9981f13d985bd1050bdb276981ce9d28bc9a7bb8f18&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665P5JLEBN%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T033210Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJGMEQCIG2yGk%2Fk5HX1ZeZF5vhZclIY2h8gR28Dn%2BmKUgi4W0uzAiB62VrRhCz7fgOpDOIZ0eZOJ6%2F%2FXHTUn6uj9LiqIcHYzCqIBAji%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMInfohtsAaNhydjYTKtwD0b2fL5M9RMLKclcmour1XOTO9Q9h3kX%2FHFkoQ3NlALzL924MXcem20%2BQIDBCAKMrouNYnLwceM60AfIx948r6HhQ5ZEu%2FVmfX8SNK%2FabOEEmtnv1L4jlo46a4RoXKQO897%2B3feNYTSOTNsvFg1T0BdkTgIse6HkUKc26vUzstQvVdcyyZW717X2YSqMU28Gr2qAtZMeMtEslu3qxqeK4guL1GJoaqpLjMSzuAQGs7tPoLqxJCTxLrU92yZTdIYOto1dxUWM8rkhlgAT1DT5UDd%2FZ6x0ENWaPMJxoiqydJ6PqoXWwOFjnbN5SvsimXRbStUKwSlOezNR79MimaDXcuB1db61dB%2BiGpzOxAVjQq3TMXyc%2FF%2FyX%2FSSOzcGTL5CBCtZshW1O6wmRatt%2FTR41xSlfcCIpa3U%2BwbJLa4BzHAQq2HbsuWeQEvnOwRZtZ19dBVmBsYzScz653UTZXUg0E8G4EMx65fwvf5Mf%2BO0uIFP7M0E13llwUVEKLXdpO37OyalvyD6d4hz0oZsAVDT8sepezI2Rsf6lItvG4StYzy2Kk5HKADZciVU%2Bzn1n9k21L%2FsckhFP2U%2F1lnimxfVfkWGbRqiFSDgNx%2BmIMpgIyrs2GAXKz%2FDkh6vy8KMw566LzwY6pgFM7KoY%2FbbQrptuguLRk3H%2FfMan2rqzfMFHLE3cIv2maxqVhQj24mSVj00RtZrRL%2FY7gCcWgolnfqAe0Wo9wReXkvedyQc39jw2444y8VgckWb1H%2FVz%2BvhsuQ%2FaHJQnsxVn%2BzM3ZnzSWr7%2Fnsg4pG3pHoPkpSqw%2BbdkTf9MZoM6YjetJmV9xJOKKPpY%2BoeB%2FEr07QGUbTB%2BHvhzfSS7KZkzhGk%2B9FTz&X-Amz-Signature=77224b289dfe46f815f96341ec3f953ff180a5a7df144f6c99123612d6b6147f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665P5JLEBN%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T033210Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJGMEQCIG2yGk%2Fk5HX1ZeZF5vhZclIY2h8gR28Dn%2BmKUgi4W0uzAiB62VrRhCz7fgOpDOIZ0eZOJ6%2F%2FXHTUn6uj9LiqIcHYzCqIBAji%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMInfohtsAaNhydjYTKtwD0b2fL5M9RMLKclcmour1XOTO9Q9h3kX%2FHFkoQ3NlALzL924MXcem20%2BQIDBCAKMrouNYnLwceM60AfIx948r6HhQ5ZEu%2FVmfX8SNK%2FabOEEmtnv1L4jlo46a4RoXKQO897%2B3feNYTSOTNsvFg1T0BdkTgIse6HkUKc26vUzstQvVdcyyZW717X2YSqMU28Gr2qAtZMeMtEslu3qxqeK4guL1GJoaqpLjMSzuAQGs7tPoLqxJCTxLrU92yZTdIYOto1dxUWM8rkhlgAT1DT5UDd%2FZ6x0ENWaPMJxoiqydJ6PqoXWwOFjnbN5SvsimXRbStUKwSlOezNR79MimaDXcuB1db61dB%2BiGpzOxAVjQq3TMXyc%2FF%2FyX%2FSSOzcGTL5CBCtZshW1O6wmRatt%2FTR41xSlfcCIpa3U%2BwbJLa4BzHAQq2HbsuWeQEvnOwRZtZ19dBVmBsYzScz653UTZXUg0E8G4EMx65fwvf5Mf%2BO0uIFP7M0E13llwUVEKLXdpO37OyalvyD6d4hz0oZsAVDT8sepezI2Rsf6lItvG4StYzy2Kk5HKADZciVU%2Bzn1n9k21L%2FsckhFP2U%2F1lnimxfVfkWGbRqiFSDgNx%2BmIMpgIyrs2GAXKz%2FDkh6vy8KMw566LzwY6pgFM7KoY%2FbbQrptuguLRk3H%2FfMan2rqzfMFHLE3cIv2maxqVhQj24mSVj00RtZrRL%2FY7gCcWgolnfqAe0Wo9wReXkvedyQc39jw2444y8VgckWb1H%2FVz%2BvhsuQ%2FaHJQnsxVn%2BzM3ZnzSWr7%2Fnsg4pG3pHoPkpSqw%2BbdkTf9MZoM6YjetJmV9xJOKKPpY%2BoeB%2FEr07QGUbTB%2BHvhzfSS7KZkzhGk%2B9FTz&X-Amz-Signature=0a7437a1d500164200062240766b9bd12e433826217ef55d3942ab5ffd314143&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UG2XWLXN%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T033225Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJGMEQCIBCUaasCAFqfIZmm7OBeUXcF7t1npVZxX0rRsBJILzOKAiAwd%2BMbvlyi6pUaoWOofbHfSXugdTvXlL4RyDFPOt%2BJRiqIBAji%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMdTKVVS4fk61OYPwXKtwDXxp4O%2B5iuMpL1cwdRijtjo4PGim3l2tZY%2FRY4Du%2F9Od2Btwb196rXy8hfYjHn%2BuZFOMtnE2P12u3QpXpjnpU3syNJSyapcHi3D9OYay%2B8iuPgxpt0NPtHcypHIrDt3xSDD7CqKh7EsTy1V26wOWoxwYKI4xKzuof0J3ng2s3X5nVvlrDMtiMt00qcxjZrcGEUmRUGfj8%2BhJyyJ97Klx5tnWTFkHhiOMTWL4d6RkVre5YCRj3B%2B4LYCzxRzoYEYiPAddXX%2FlLeRrPJQvEIKN8wL8ZoWDhAM%2FFTGdJaEZa6IX%2B5KvaD1ot13IaHQAmoITa12inxtlrhyZz2pUic1Wi%2B0eK6zgeVHG62%2BFVLGPh0kqc1D6gc3tnoSPC%2BA0eXDJznkEH4lbzMhtc6tYkAjq6z1b2lrM5KtSlrVCFqpmxrtbZDnOFCJV2NSknYOsAnsrC8xoIlySToxfc2RlLOfLmb0BXR94gLzv4niZlSU%2FB80Z0VlLuF0kt6zrT6t%2FY0Sp16tyfj0rNQ21ImgOIVXZ5bufa4KalpEuFDtymQPxY1LySoNOS4LbV4mJZ8YasEioMNazFJpQPhiPR4YC%2BO9FmFLie8MLWP0Ne0%2FxnX4VGanSmju3L8%2BmhyzXhEuswja6LzwY6pgGvUP5g6ngpVtI798V8rV0SuQR6Cq0723ZwNkUozPA5gQSLieWfkQWarvEf9%2BM23jZ1kMAcmTirnlkfbEpuVmDTwL0CfKFBtrl8p7p08Ovg5lWULxTVDatHbxRP0t8ILzUn85Z5WGtNMzu33c6u1U9Cn1JvzSKd9q4axu0dMBDOZIvMjN40eCqmoDEqRNK0MTSwGEmUVqxs5SsMasFhMPRsqDen%2BvzT&X-Amz-Signature=5a841aec92d132c27ff652090d61eb521b550d817345bdc91a7ca1357b87dadd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XIKH5CYY%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T033227Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJGMEQCIDvJ2sfSCk6Z2vQXU3Bxom19jKWF0R%2Bqh20iVWikroGkAiBbI37MnpoX%2FyCoTgHkcgwa3aFVpK1gehsH379IUMjdJyqIBAji%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMmOcENglV4N5J%2B9PjKtwDhzbDh0xbYul2AD%2BJ8PBTweUJ1ZbmZDLiU2bdB3aOhHTtQKVRN6f5r6aW%2BnUxgOGxPOvLUYv7bh83AZLRVMqJO1xXtQ7IqmaF08YLHNh%2B1ZEO0OPtppVcIpfeMPqbTi3o7C99C5qV%2F4KT9gw4olNtY%2BVfBglBnfDQNqmJsD0iBaWSF34RvNdpEoR59PCPhO%2F0eoMsUCkCDtwzOA8q1lFzLPvjl%2B28YnPg66awG%2F1xGjSMsjoLyQ%2BVM3nYDkmmPfUOPyin68amaR%2FttApUsHvA2cs20hQlZOUTjVgpAO%2Fv6bZOjfzMqB44dF0r7J3XTymtHVxuSlSPGjt1Mw6tfkgsfXogQAYShc8qNJ%2BjZdFg7aKod5WxaUF6%2BeBiTFvbpsOFbD0h0XDAopCA7yh1idtX5xQC8sZZnowK8i%2BZ9%2BSHQAeN9Qji66LS6LNpm9JzHKZJoGtkvMWr5f22HoX1JkvYwFvVl8pJzdwwriKkqtK0W56C9FJOnFHFOW%2BRVM5%2BhvO23Zi7MnVZBgTNUPv%2Bc3nlIsxK%2Bf%2Fd%2BK%2FCSrMtd2h1fbkHHWceRSsIW23%2FrFhNi0dONbfg%2BaEACXmmNzIylDK094ZI29QIv3qtCAPjp5xhvSmG45AstxlHhT6YwMIwjq6LzwY6pgGnlPYy3LGImQsitSTcfENe9RGkBFLD4E59cPutr7WvjDAK6%2FYVpLm4T3002eSMgfjGsVTzdUTfhUy7FOUgaTO%2FKHkRoHQXmGKBoh7mPKspYtkGoQTRYxFx%2BwExjgkjNti2XUG%2BTdI44Jkm%2BViK4NaXwMdpOwARLphW8b%2BV9zSE05S8B%2Blwkr2QMosT9Rml7wV4wlB89qDynOFIIXBQznTeXXhUTumv&X-Amz-Signature=f4c0e8ce92ec6d2be2abc1b5daf1d7ece8e23455abae41de343ef6fcbd1dc5d0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662KWTUPWV%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T033227Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJHMEUCIADZYz03P3qz8M9%2Bc7WnbclV26hJwVyVFB4Mp2SZ34zYAiEAtLKnDvT8jhIbLx8WV1vK4fceaNDhrggJeT3xqSUDm9MqiAQI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMQ6ytJXT65FTYbSXyrcA7ukYE6%2B7paryYDcMHfV3V6osubXa6iO8VqZa5Af3rt4ndVUWQ3A2o8lunK%2BP3DNjF7%2FYCsO1ml8Atm6Vz9KbXQSPXihog6%2BfvB592lWRlMgIWYAES%2BCDA3%2BLXVMMsBDwLAfw6hEgrl%2BExps7wXssTwv0LMzpGKHvObj7TpHM5D6EtG5QdRVxxkpNTMGS8xZ91%2Bd6CyD6hye7RRqptckJFFFO15XZDFg9Ne7ulKm%2FshWI7TxfgLzpQ%2F338KJ5qGo%2FqqQ7N8iK8uRKHVsgRamkbMTeLlerxHQuh2Op2dftCOkEHqmr6tboYqj7zHtR5ueUKOqyrQuRr9T1EOqdUOU2bNZ4bxqvcfzT2YWO8%2FwmNP3fjrpPBSaYP%2FVud6W0mKF7Le733t1nm0KI75f%2BnLnXq9m6dCjdzur2D4mAc2o6HAH75IUY%2FO0K24J4%2FtZcc6pSj0wWsyPacndAPJ1au2UKTxyYTVuPbFk2PzeIrZQyztuAVP6tZeKj0iFBnG%2BGYw8hFDw6GmhHnZ8dUza8yJO8CWqFTiHRJlzJH2UerMJLwbNf%2FGcwzEjGUMW3xMskUxoVJwSEVdFvfTSCtxGK6hfosqQuaENRfe%2F20qG%2F1eNkP76jFVAENtCKuregxkhMJSsi88GOqUBbggeFEvh5NI11mPX5EN0fp3LKS77sLjDy%2F%2FeGjdn0aqFIagIEtAIpzAT%2BPT96KnNKqBtSnDwvjcD80PpwBeRUkFvYGJw7nZhAYMnlq%2FyA6D%2B%2B%2BxaczmqMcWx1tdyLEDC5Qt6QQmo2uXRZChh4tuakxHb5PfdisBy%2BTg8I%2FoGVgEe%2BqeDVX8EGrKe9Y5wTN5gnHb%2Fwv9n55ANJekyDZyDgA2nV9P1&X-Amz-Signature=3fabd20959bb38b88d61a071d48d4eb6a67e0605c2f151310679c0266170907f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46623BBFZZ2%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T033227Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJHMEUCICT4iGzN7FwrxIGdN45tsed5tTQ9h3khmJrZ%2BRlwsDmyAiEAhEemTZSiWyJ0n2ichEdB2GcoAG8mwEm%2BIN7cKYItzyMqiAQI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKSRNCLjKbAy5iWH%2BSrcA2cfGhi5X383m3BHhxM5EWc7%2FSpO6MBkg9RlJENjoU%2B9ggIvf%2B1TDauvS629P7YrGyRInXQxkvHSTlj7AEtvEPfPNmoE0vi66RnbepzRCxDVBiv6sAlNcWgOlrTbwtpJzaWaVG1WsMNCW67C%2BC6wdcZCywyF%2Bx29YTbl9hCYBiktdGPMwxLrSsATGozvOvq8xKs1ulMK49OZlFmbBg0J9RzNSkDzu4bPAVDKb3AuxjteQ4iXTjlgx4vjSvZX79dt61J8bZBnAkRs8Rhc8aWFZzQ1nwpTho1tRpszOPYTJWhtHvRynZiHRiB%2BmctmiBjP3cxrPODmeig3ml8BYz6klXyVC9OOO3j2j6u42ZZoMa%2Bh1Sef3ELkMDJZFTffRpbBUPXrnXFrMHlceLl04nG6wOqMl88oF3YD7rlYnwGrPdMwdTKpvmQfNrfMi%2Bype3Hmbk%2BxL0s%2FOeWSgcBAfPEXkTeJc3hlBu1oaZH3jY3EXWjLE%2BrjndTn%2BLpTpjzLFpQKJnODW%2FzTh35%2B8Ijm%2BqSio7GSP6YD%2FvhpvxfgMgtRy%2BBpPAZ32w1c%2F4NtnZdB1Qd7xnRhnK%2BeCln6nhhb0MDiM3rO1zPEdsZYECgbaPt8NApLbxJAzCkvuWhW2fo6MICsi88GOqUB%2FoqCaL0E97%2BisuWwHALlpNMNF9GW0flPfxyGKtZ1k8t6SvKN8H2BZ5nsrBvZCuDAlRY2IIDOLvhFH2UQjGvBGWGo8g5zW0ZlRewvrhEwVKuPA5QVDKfhQh3KDKkNkOcubm%2FhDuYbAW9WSGt1roQRtmqQPpUbXa%2B5rvbFTL7qH9lTa8xEyIBsC8mmpslJ1M3Hl7xgu4Gd9HNAkvmXYsRFfsHG8zaG&X-Amz-Signature=fbc0d73f6f5362c5cda510a38640f381e265a9bdac3d149bf26f852d0a171a60&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZNLXPLTL%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T033228Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJIMEYCIQCfF8RJeNeK61Mthiq6OuA07YZeuzyqS7zCxS5EwrgnjQIhAPNwkS%2B8Fco3wXGEAO5e8C%2B%2Bp7xqkdLHZu%2B6LvDiER82KogECOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwR76mngIshLfc6rXQq3AP0rzaG6xzk963addp779cJ1%2B2Pp8wYyz05rFXQk%2FEivHRRyJvltNYWdQ%2FpI9qZtVesyOGdopnf2dgo1GRaSGV%2FzYWlvsWJs%2FqRsfiqYvTtzIlzmV3yEi7My7fVgpJsslq539wc%2BEgaKTf1eIlJuZoFZdjAcN2g6Qu4uL1e9cDB7V971XUITcrZaKU2618SYfkrtkmNf3tIhlwKPT1r0KlqrYB9QQVLDFD07j2v7tUoCpk7Pxx%2Fa1BfWzysXEZ%2FkmpqwEhhlUn5lwje91QeWZqGo2sukulWw88b9s4P9Ie1%2FR39BU%2BrgFiZmTgkaXN76PDx3tsqTcd5EXUMGQprXU%2BJ4oAKkxL3DLv%2F2LWY2mVrhCkSMik2vIJLPmZIvEMXwj1h%2FtflkeiLo0z6X7mdZ%2BNNHgr7%2Bu5YAOJRlV8woxb8H97j6YmrCsdzSFKNuZhqBtC6rxU3MD8PD9aFqK4FkJsyMGdAIehuGo5O20%2FypYhFUVeHNzdSpc7lG4htjIZnRjN8yGZmtt8KkPa0CXIpR1T%2BsTVzYATyDrhoNZMcbpRUiqr%2FmLbTKETVuliDIDLAtib1ogbOI7UIi%2Fmn%2BsUrL9%2FFZl1%2BYD5IoMSsr6OsgNTAV7f8iIqb5OVjp5trdzCcrIvPBjqkAYlGXsdyFTrWrANdSc%2B11n%2Fo8j7SaCPX4dAA96cDlHGKI8k9EbCsYrYdYU2Bh040p%2BZffMd9Z6CEafQGaoSC8bJjUFeRKWrSFkj3Vh92d3rqKLcriP8pi5xuwj0y1AwcjncBuV7LYhL6g0IKTdtsB7N%2F5jf2TB9%2BBDnVT0irLh2ijrix3vOFISTyxCuBEAoyd2dD4q3tUkMDGqvBa09uAnE97Rfu&X-Amz-Signature=eef9a15062a3de75046a334ebc865353e816c110dc4ac2bd4a5b973f305d42be&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665P5JLEBN%2F20260418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260418T033210Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLXdlc3QtMiJGMEQCIG2yGk%2Fk5HX1ZeZF5vhZclIY2h8gR28Dn%2BmKUgi4W0uzAiB62VrRhCz7fgOpDOIZ0eZOJ6%2F%2FXHTUn6uj9LiqIcHYzCqIBAji%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMInfohtsAaNhydjYTKtwD0b2fL5M9RMLKclcmour1XOTO9Q9h3kX%2FHFkoQ3NlALzL924MXcem20%2BQIDBCAKMrouNYnLwceM60AfIx948r6HhQ5ZEu%2FVmfX8SNK%2FabOEEmtnv1L4jlo46a4RoXKQO897%2B3feNYTSOTNsvFg1T0BdkTgIse6HkUKc26vUzstQvVdcyyZW717X2YSqMU28Gr2qAtZMeMtEslu3qxqeK4guL1GJoaqpLjMSzuAQGs7tPoLqxJCTxLrU92yZTdIYOto1dxUWM8rkhlgAT1DT5UDd%2FZ6x0ENWaPMJxoiqydJ6PqoXWwOFjnbN5SvsimXRbStUKwSlOezNR79MimaDXcuB1db61dB%2BiGpzOxAVjQq3TMXyc%2FF%2FyX%2FSSOzcGTL5CBCtZshW1O6wmRatt%2FTR41xSlfcCIpa3U%2BwbJLa4BzHAQq2HbsuWeQEvnOwRZtZ19dBVmBsYzScz653UTZXUg0E8G4EMx65fwvf5Mf%2BO0uIFP7M0E13llwUVEKLXdpO37OyalvyD6d4hz0oZsAVDT8sepezI2Rsf6lItvG4StYzy2Kk5HKADZciVU%2Bzn1n9k21L%2FsckhFP2U%2F1lnimxfVfkWGbRqiFSDgNx%2BmIMpgIyrs2GAXKz%2FDkh6vy8KMw566LzwY6pgFM7KoY%2FbbQrptuguLRk3H%2FfMan2rqzfMFHLE3cIv2maxqVhQj24mSVj00RtZrRL%2FY7gCcWgolnfqAe0Wo9wReXkvedyQc39jw2444y8VgckWb1H%2FVz%2BvhsuQ%2FaHJQnsxVn%2BzM3ZnzSWr7%2Fnsg4pG3pHoPkpSqw%2BbdkTf9MZoM6YjetJmV9xJOKKPpY%2BoeB%2FEr07QGUbTB%2BHvhzfSS7KZkzhGk%2B9FTz&X-Amz-Signature=9e4790f69f9fe0d541897a5cd1e133add9b74ca6d66214edba1c1e43751e331b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
