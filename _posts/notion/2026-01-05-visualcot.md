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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XXEYVJJQ%2F20260204%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260204T025228Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQClSMjKZGroPP8kVegXVOx8leSwPmCpVYhK2zk79rozAgIgYdRhqS6jXx6%2BVnFS0AgfRWSHwJw3Zn9QJSNje%2FLPBNIq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDLqWYeCxD7UJodEeoCrcAxfs5hV6R5T1tbBOxQ2JFwLTknmGciC9cmgvCWaERGeajy48R9vs6H1T5Brizi%2F8uj9wtXGVQm1ynRTFRCGZt2Lbs8odH4CMxDknqAefM8OQKmdMeOxn%2FFh52TXNw2wKSYmqaVuH4c8xqHhSTf%2BWp3qCeHA4dKMRvopo2aT37J8nM94C1DpYo2%2B6mvTo6ymyuUWVW%2BSwyE1Y1b0tQcKj%2FkvtS1IT%2FWIUHkgK3eE%2FcCbT0cFrP49FkN7SoW2wWfhc5znnwtYRKoWTgF4Rf4WmWPHkRnrjMoATVzRzUHW0QSb2wLiWFbuNE%2BgYANWpk48J4pjcW54hNJyhVNbFpZFdhHOvJr96om%2FgGcBZ0dJ4kYkfu1R2N8VZ4%2Bc3KFn6IRF9l%2F8xRUpQSHBml5jxCEZHuTBhIlcrVATMlK7Phf1KXPvmZgEakOrxLzlNftLIgSBgRgFO%2FWtL2vdH0IJPfFH3L%2B1DNdiR3FTjxdjoEuUwrMypIgOCOoG7p2s8JhB5SISsc3rKAreyRgy7eTGl7n6LPLOhaRMZLQedyJ89JcJEm0BwD%2BiEiLmqTT6dkU%2FGXvs%2FQF5pknV8wkC1vyuoX4JO871q9RWJKpokguvvXuJO7NhlK%2BSmijOOUBM9bNktMO7niswGOqUBAg0m7CPTUw8ccAkp%2Blgp4nEpsNbSTpMDTZIvGgpOSH8EDfAqkoZypoGSfFHpORcfChNPnpo9WQAJ33ML9hcxte3au2UKI%2Fr85a93fRbwSRKvKb4%2BT5pWVNQcwoxz553rtdwG2jzRS%2FpY6K3VDB8vGvOJEfQi%2BJ21IOVFvu5VW72bFhDiuQx%2FNMjUxf1kdrV2Ozmb%2FXPdpgzn4WIKSC3nIPRl1900&X-Amz-Signature=e314f589b3b4ea5903cd9f874d069f83a427f77627ef65d680838aeba0ab9b80&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMD7PW3C%2F20260204%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260204T025230Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQDkhushlrcCoZmYxAlKflQcELsJRB0%2BixoIUCNHIs2b8QIgQ6xeOvjBGCNzvfA6OBUUKkRE2VmXGWsGFcDGZZZ0xb0q%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDOJG%2BVsZcfbfNzyjQyrcA9UYYHIAlVIS%2FvW2Nd83JhxXI0%2Bjrp%2BTvQtvKhCm5%2BqpvgF%2BfJJHTUyyiHMoaHphlDgaNVIB8er6XQPIvnX4zIqywdT3VPC0V5X%2F3K9wYn1jMlShUnIXaLGK%2F18dCtjY5qeMpbHHQf9jQe6ufRCSyskkzSn4mADwYLH6jwqu7yyK7h362MEdWAcTBULfjx3awEJ6Ihkcy2NC2JP6i8lomeX%2BrifV%2BHeplYYr0vHNKBINDTbSUqP49k7EAVB25dKtJJPz%2FXa%2BT%2B2rpmDYUE%2BxvxITr1bMUZO0LH%2B%2F1A%2BWg1ayrEA7x6%2F8tLpecix3T1P4OzSrbRFqEXip1D7hqIDmxnkNhgXczpk7iqKrFlNL%2Bf7Pkx29GL0X8VvBFGD5sT7fWiTd5KmTp00SuJyCmfWTx6EpHGNp%2F6VUDSC4amHCyv7ncLG0pFo2FABlJcm%2BLjzUZo0qcK1FC3ue6%2BibOpUz6JvGI8vrT%2FTIahweV0C6qcogdjNfPVN39qhq41dYwh63CUdbWTalej8zmimO%2F%2BISNa0BOyK%2F5iYu4UtbNSQZeEUPjGHTHVq%2Fd92x4COotqEDUKbyVllIGCZkSltz9dDr2VikhQXaj0x9fgB6cicbEL5yX2I03mW9Try7NYX0MPfniswGOqUB3KD2z%2FIYzCfZdQNIlesOxGTkgXRM3RPruZ4TObDp65QQi2lPDeRfUyndC6oR4WevOeh4ikQPAkrNroithwpql1OmbhOTI7VjI2SU9GVCJzXqCNPxBiGRq89cp2j2JMI%2BDAfaY7elKay%2BOlCuWfqcygwhEJE%2BlthZxtMcPftVUtSt7PuebHe8KKvqjixgec8HuM5puuZpvkbNCdByUkJGZcOLXRWp&X-Amz-Signature=be0162631e1b15534330936072b0cd853919574aa6020e5c263621d28b285b1c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQ3BEFA5%2F20260204%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260204T025211Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEIaCXVzLXdlc3QtMiJIMEYCIQCQvCcD0eIfsy9qmrjRyT3ezdfYhMb5SLNsLvhv1iWXZwIhANngiLnY4BljM3%2B8t2DtQtMzfnenIh6BR5FNC4wvohJDKv8DCAsQABoMNjM3NDIzMTgzODA1Igw7BwN%2FZfnDuz%2BzBlEq3AOVWizlLihAFIeHcmS2MV%2BF7edpu0yZylNMd7vCk4%2BxksCIVcNKzci64gPUMRHwQa%2BpUxahReWf5dJvGhoUzgYG7DJOBHnlyvalMvUsvgmagKQgdD0oqeRnb1Q5B7Sgt%2Bn9s2hYt7Vo1rdkFJfNAPdjTpn22A%2BOVIUTy6WueXxivUExOLtWwia17SZtIIpa5japXQq8v3Bj%2Bp3TiKXrXgqR%2BRgN0PF51l6LKHbyVZCggqfO4VGRYoud1s9F1%2F7W5htCz%2BUNBDSVX7y5GAp6RXMgSYyCSolHBwWD%2BWlq7x1HvN0WajsAghVeZQ8US8S83F7gssNd8zUgRMpFYhHCXUvwua55ZgvXEvZFa9fC3F5pDKV6b7E50%2BQopNDLsPsF5yDpnoMANKUmQBkukpy3NCNJAvCw0J5%2BYxsMwQPRsQgmkYBr%2B7cCkMYIQfmyhmTpVmJwCT%2BuuNgxvjnsYyKUC4ek0xnVzjgnqyjgCyCm9WEmMTuapoDJt4gNtGlF39PV8O2OTrWFImGiF53G4r7K6HvgVc78zNknPhbcfGCPYfeOVpqsrCdDlanTLy8c2%2FWcQjrD8lTJj4Y4xnqOjxyy90SlG%2Bk3MxvGmt1H4wwbqYCRefK%2FspomYQT3TluXdzDkyYrMBjqkAROX8H7AFubA6G6dPPpaZspWCVd6mYVAlFqYig1pgj6pDAc9UWXgWvdZbUZMrDzlaHl2%2B4IHQoRU0SZEkL9olh2GdlbiDg%2BdYqlbNAuuQ3%2FNZ8HH0SZn%2FU1TY7jy70eWvMVOonvgv6LbUuD51IwQ4kgvaOCPwh31YC6SizH3xR9dZSi9PNjgvY34EAXxRDruD9J7TQGiVV3ckhK8WkP29MftjnqZ&X-Amz-Signature=4de5547a737b16ef2e2c5c5e4a39a9c20593ac911c00b8b37e62ebca56f4d6ff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQ3BEFA5%2F20260204%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260204T025211Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEIaCXVzLXdlc3QtMiJIMEYCIQCQvCcD0eIfsy9qmrjRyT3ezdfYhMb5SLNsLvhv1iWXZwIhANngiLnY4BljM3%2B8t2DtQtMzfnenIh6BR5FNC4wvohJDKv8DCAsQABoMNjM3NDIzMTgzODA1Igw7BwN%2FZfnDuz%2BzBlEq3AOVWizlLihAFIeHcmS2MV%2BF7edpu0yZylNMd7vCk4%2BxksCIVcNKzci64gPUMRHwQa%2BpUxahReWf5dJvGhoUzgYG7DJOBHnlyvalMvUsvgmagKQgdD0oqeRnb1Q5B7Sgt%2Bn9s2hYt7Vo1rdkFJfNAPdjTpn22A%2BOVIUTy6WueXxivUExOLtWwia17SZtIIpa5japXQq8v3Bj%2Bp3TiKXrXgqR%2BRgN0PF51l6LKHbyVZCggqfO4VGRYoud1s9F1%2F7W5htCz%2BUNBDSVX7y5GAp6RXMgSYyCSolHBwWD%2BWlq7x1HvN0WajsAghVeZQ8US8S83F7gssNd8zUgRMpFYhHCXUvwua55ZgvXEvZFa9fC3F5pDKV6b7E50%2BQopNDLsPsF5yDpnoMANKUmQBkukpy3NCNJAvCw0J5%2BYxsMwQPRsQgmkYBr%2B7cCkMYIQfmyhmTpVmJwCT%2BuuNgxvjnsYyKUC4ek0xnVzjgnqyjgCyCm9WEmMTuapoDJt4gNtGlF39PV8O2OTrWFImGiF53G4r7K6HvgVc78zNknPhbcfGCPYfeOVpqsrCdDlanTLy8c2%2FWcQjrD8lTJj4Y4xnqOjxyy90SlG%2Bk3MxvGmt1H4wwbqYCRefK%2FspomYQT3TluXdzDkyYrMBjqkAROX8H7AFubA6G6dPPpaZspWCVd6mYVAlFqYig1pgj6pDAc9UWXgWvdZbUZMrDzlaHl2%2B4IHQoRU0SZEkL9olh2GdlbiDg%2BdYqlbNAuuQ3%2FNZ8HH0SZn%2FU1TY7jy70eWvMVOonvgv6LbUuD51IwQ4kgvaOCPwh31YC6SizH3xR9dZSi9PNjgvY34EAXxRDruD9J7TQGiVV3ckhK8WkP29MftjnqZ&X-Amz-Signature=0851c68bcb59b1d79625e612d4aa6de47d80f9f4e8da66c9a356bb1626b5b8f2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665RHKBS34%2F20260204%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260204T025249Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEIaCXVzLXdlc3QtMiJHMEUCIQDA%2BfiJv7Dyrcpkpjjy1ZJnLLBNKYvLlvpCqhOYqQg4ogIgICOGMrJemQetAV1vHTFxe1CfM%2Bf14dbbaW7O8Y8Eo%2Bwq%2FwMICxAAGgw2Mzc0MjMxODM4MDUiDBVoLOIFPtbMtB7KHCrcA6NcG8hkFItIx%2FOa3Ya7sv4el8oIwWF2rXnXd%2BiQSUnAbE9WI77a34OVMg9vngETcPqp91eV84gVDJoCpT0EtM4M1f5tDxmyEcSFZlI3v77vlefOPx2p%2F6hN4BJ5DKLRdUpvQdPYH1vXrqdom%2BJzJg%2FQxbDbelhfHw9z1w2LvW21P3RkAGCVBC5XQvL4qQb%2FWImyzuVr2VxAavzTkrt2cYPh0qrCZJSbxRqYL3xKSAZNMFeEkJfJCk3v2aQASRDZ6w%2B1i4XHoCi4zLYw2oWwB48kQyROp9EPIhHKIVVMFnSfH%2B5modB9OGHIbvjXbPAG8Q52u7YEKZNSaB4I15loHBXHbQuDi%2BFx0kyRqTvYHmQBlJwdm7fxMty7WfOqQQNX2xeJXVlw7Ue7IN7p7jYAhSxR10V14QU%2BqU0%2B0OfJhzSF%2FDlH9%2F1JYjvAA30cij2Aauyr0N%2B9el1Sxcw7UX325LrrN96kIiR6P9uLCGT9kkknse86TqVLzU%2FWHru2VW30grbnQAZBlA%2FXOSuCo%2FRsyzdgcsdWVUP7dSiZPzfrU3JJ3u6qs4h2pyIA4nrKd7Lp3tVSZhb6bPgqvH4BcCYWzCnQGkrEtNJX7s7qaYCB9cD943ti6NM9v1W7DgtRMKrJiswGOqUBLHPVGcTMnlF%2F%2FKSbLB7WJenu3Y7QMZ3nCTR5dxxXCkfHmDpL%2B3pwBlDhquo%2BrEXfqCkPXYpsA5sFC1u4OHa6omuRY2cFtI6qPyvtlb6ADshUGV3JwCwC%2BFDvVBdp1MV0R%2BvSkknDPS3O4UDK0b1RrV7ymYKEp1Uo%2F0XMsDG3e3kEVqydVPjy3uO59BzRhV8zHbSy11N%2Bp7Nz7%2F5zdQmNn3P7CPDf&X-Amz-Signature=69152e1b5583e2b84c61be55a7f2fe1dc9cfee7e8a00da106c6cadf3691cb1be&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666SOZE4NP%2F20260204%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260204T025258Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEIaCXVzLXdlc3QtMiJIMEYCIQC3bXjzcFm%2FMXgj0skTI%2Fvp1KqqhdlktODJ6yNgofH0eQIhAKEMUmnD6jsXKM%2BtxdmbGCynnI3SgjvRtzNG%2BBnaHM9YKv8DCAsQABoMNjM3NDIzMTgzODA1IgxY3Hzpl4zLGiUTt3Uq3AOxs4npAJCmEJKy206anAAM672UI3cgKwDMyzIw5Ohyi%2BZrP0W2jSUScIz5%2FX1KZyrypM8Ces5f90DozvkFqnsu4%2BuqifT26oviuwmcDOCjZGjnSXGrqRMFCNE8e2tGOcSejrrNqjbrj6Fn3H1TPFk9X7TeTD6eQKaQPsuDJi89ACyvleCb42YnCkvtoeILVkzU2j3Y9E5haVqv7CANQP5vWfOFiTtDBFSKIa90BumuG3QsxpQSRJK92xQHUSWOchh1av4lBof4dKGbmWiIqankGIm%2BCJXaceInbAVFlB%2F83V5khMomTWqObOFoIoGOMOBnUpr0JNj7LDLe7PmPRBU1avX3GGjyUmBX5Ssz6NAHf3k63P0NMPs2NcU6ua5DR09JP9YYYVN4IqWiQVdo5qgFTtKNp0K1nc%2FapPm73Vpxs2QNNSZRtl8LgQsLzuB%2BcEgt9g1ruFHk0co1GXLHyNnl3h2xPGHUVT7S5rs29QltCr6MJHEpChUQFrWS9rXliEdP3u4P3hP0urIoLpgwHj6kgtP6nw2vReYtypJq1CDN1zewn7XIV3zPJyZqdL6WhMikCWQyEpRmjVoPsSAS70Xn7oOVyXF8kwcf%2BXxxQVgvUixbwyQlduLsY%2BI%2BPjDuyYrMBjqkAeiLoXs%2Be4Sw3m1hIg6rKdu5gwRjy1hTsGPaZuf1A3ZTc%2Bb%2BoDbCKMKCOCRNjLqR0VVUVzGhA7xTpvG%2Bjc2IvUmL2JXBTQHNzzHUKt%2Bnf7ngZa61nnTFID871qJC6TPw0HShHSL6IluwnhNBI%2BAJzFE7wLiclrfX7kp8TqlCi7hxLERd1dl1AstfmE5iX8FqidvKgXo%2FaCnzmn5xDgVJ1gZwup2W&X-Amz-Signature=ba5cda6ecf32c220a1d266d32fd5646493bcd27be8ac53b965407192d7cc8620&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W3FM3OME%2F20260204%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260204T025259Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEIaCXVzLXdlc3QtMiJHMEUCIGfRO0gzAioKwuYjTEwo6pQ3yAPZvtt759CQgNt0NYhpAiEA7NXdG5L13EvH%2Bmhgv%2Fzl%2BlcwW%2Fjix9qJyEbK1s%2Fj%2B9sq%2FwMICxAAGgw2Mzc0MjMxODM4MDUiDC%2FUYZnEDu4lLV1cmyrcA%2Fw86bU4V27jlG11fT0sXaHVshE9uCOkn5E9%2FgDeSBq19euK5hobiZWs%2BS7txGYJDq9CtfqAXd9Luvf4ADHUcJx9Vn7ZZNhmaLQsSxKyGEPT9%2Fi8RKrcx%2Bc9ygz5mvng0UCaZmHcVTTBC0AxFjGgG5Zbsn8WWOKWaQ5y6LE0IomVwipwdhL0RX%2FX1S6a%2F%2FDIU2rS861JLxFylhCFoCL0wHYbHyw%2F6oy3KFpYxD5ANIufqmHuvaNFUOdf2yOaPRGtjJbKRTxigD0MY6y17N2klpOm%2F54npBFucXD1usjdpsVE1ild6LRI5dKma6Bm2Oj1wYjBNbHS%2FOnoxIryf7yJhvfl0GYsuMPWnKPR9z%2Fh%2FxkfDG1wE8eF2WT4TqPt1VLnZCV%2BtbY%2FGgqAcTIAStrWHFYySl3UfmrwMyvF7o8z802F9wkvzPsRpYQnSM9hPIg%2BxPcla1Nf%2FOb7Qk1FQbtgaaBM3NkTS75a52V4QSbnwWPR4i6dyvbK2a%2FXcmuTz7u5aAa4ayXhNxyE23QPyKmYnBxkCRSKC4sxaKYzUJ7ir4oR0%2BguTtg3gEGLtpI0Kef0ioA2l8xjUdB%2FmMmS2xnY8alj9tyfIZIVc7rSltp0Wmfl4ZT%2FYtthxne6xuf5MMDIiswGOqUBlzAjEGzxtA20IcSkwlP2EBFBPvMb89ol3wElM7q%2BE5qJetLYiYxwjRq7RBVna5sPuGrQSAs%2F%2BX5mq9UsvhLCIM97fSNGh00TfdLr9UPAM41D9IfJykrkBgmf2xbIrsHrSXXu1wo8jc1QzTAC95nk%2ByeZ6CZCSnQqTqCqqtrb%2FeNMUIeKyqQPGOKrIaRt3KP1hIS0LV8HoxHh3CymNMRb9%2BESeuWz&X-Amz-Signature=6f795a46ba4f9b58ec7684f354f6ce34f3cf4cb8f7c98bf48ec83ff3533569fc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664ONDASR7%2F20260204%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260204T025259Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIEF0iH9ugr3y6Lw9JBihvG4IyWrLCtSx8QlYnoZZUDJsAiEAh1%2FGkGiS0tHSLqqIXhJgmfla3MxmgcAT76Fyu6GpMCcq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDCH7Tef21NxmMZswJCrcA3q9D3%2B%2FYnZLwQPqDYy%2BIiAFayCj%2F9sgiHRnXg4kYvPCJXvZiLOia8lyqCyGaxbNn4r8bv1tn6TczvQg1Xus8fy4N3%2FjW66%2Fbu7JGLAxUgg01q8wTVIaZZLTFNiAFRsylXXjcElguMp%2BJPvGAtV92yTDWauQKd8E3yJtsFYBKk6%2FumsMHWPRojgQKGKwI3gOIfw2FzKRhEicuNYs3raeem6QHmtZhXQCG7NI5FAhJABDZqQVG%2FT1sliBY8RlpTTDL1Ne6Y63k4Yno41gLKTw6PDT3sVsDJIE3odWhyg0iau6tSAK3UYvRFjcUzYoDsmdb3YmgjjAZiOYz68NRKHInqUNnvyvey7IGBM3qA1z6%2BFqO0ooF%2Bf2gXWMMmTB9zIGPdt4DayKayMBQiy1pk8D21%2BJ03FMR5dx4%2BfpPiWpcCJu4okjUYD3nFQV8NNcI7qUkczrrw8tgUw3C8taJ6R9Yix%2B7YPRbLgIK%2FTSk%2BAmwr94uFK29FOFDvgFZg94zUfqs19SE%2BEx4u55f2KAoVj%2B8Pf2KawBmCpaWQ8hstVh02WZZfJqmbOZlKrkbKKKL%2F6atj7NUmrbQNA9b%2BLlSfJXvj6Qo%2FGe5QCzzLxO%2FTpCd%2BFyOU0L7KrWjnv%2F8SGMMKToiswGOqUBUNumRZ7BrowukrRpujPZHtSEXH22zISfUwiMpAKz6oiYJP0Kj%2FaLDBSj11yeJpMxXmL2il0WDfdBzm8r7Z64FtaosX2JbK0S7zLg17FuL77WXDbMV2ZOcoBFe9v4MxE25epb91hJurU3DpbQpZ7%2BdguKIByQNeXYv4O9yKGX3i1FTSEqSEc2YMSuzv9k7HLV%2FQUHgE0WvtZtD3EUmKR1MT3kltXi&X-Amz-Signature=d73ce2678c3900eba5857e3b9e2e20908912d8e99de091d83ff4c7d6609678bb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667QBP77KB%2F20260204%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260204T025259Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEIaCXVzLXdlc3QtMiJHMEUCIGj3Vtx2xswXU8Vx%2BJ0ynfbor708ZP8pEqEa2uRwHWvDAiEAjjyNerQ9%2BE4Z45bKVbQ1f4taFO0YX%2FSuzgc4iAA%2BLR0q%2FwMICxAAGgw2Mzc0MjMxODM4MDUiDKC7B5q5OyYQnrFTpircAzPj16lRVIrjSLQ9%2F6oHsgl9rSYwdTYNqDaVe1ys%2B9qVVLJX%2BjlFDfl1J8K8mvgp%2FmPnNBGKXKg6xLYCUYIFQr%2Bn7aetosPDz6643S%2FJM924I04Uik43Wkmv0utqiB8%2BF3vSBeJo4Hws9y3VDjY7y5%2B%2F%2FGDNFt0T7bfxEIlGpmoQnrNGLWFy0xrK0NBL%2BLM%2BefkpkxfeGYXo9ApgbMhgvBUf5WiGkmSfomoHKkPO8Z87E1YY7gizmi%2BcBPVb8oPMQd2EjyRlAaBjlkk0%2B1QaJBgLn63TMYo%2Bj1ij8kkiLjztamDybxBj4tXItfNbeVOIjkn8JH%2BQ%2BqAC0cacsNlroyX%2Bbtbuu8Q6BYdqvKW4qBh21ZuSZh6rQOWa3VT3bYcOxX9nG3Ads2edn0ut3oLIl97MtsGb8UwNfgBujP2B8%2BRpptqrq6XLFecR1NZSBuOA2%2BuozTKXftZadw5rpLdygzEVFKjwR2mulMI8wkkCvHbtzlwQtgtwEfQcP5f5SOSUdUX%2BrBsC0pw1cv2wp2Npf%2FBRC6RptqrBcgWZ3v7uIvm62FCKQ42uIpX%2FGX7otQLyjkjeSKDc3rCbc%2FzRTYn%2BEdXjpT7D0Q4YY9UQG141rjZBHG9Zdow50k%2BpqjrCMLnIiswGOqUBBZ6CqpB8FB19JKBN%2Fwitmj%2BgXw4mLtz%2B89TEqbVFg%2FSjwxjkscXuFzSWFMY8003u96lw5cEy%2BUd1CJEr%2B00U5kEUez6KELYtFY4K7wZ3Tet0gdN8drGGyQKuMPEGseklt%2BsAl2qDoV2C631fCy4mgfsdb4T4QJ6%2BsCH1z6QbBd3b13Qvj0w%2FyZFwJJ2ogJSbC2ymMUt8u4Ot7FapqhsUNf3GjRms&X-Amz-Signature=89d5900b468dbb10db4186aa567bae063a81b4efc582fc5cbc093af6447220e3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQ3BEFA5%2F20260204%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260204T025211Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEIaCXVzLXdlc3QtMiJIMEYCIQCQvCcD0eIfsy9qmrjRyT3ezdfYhMb5SLNsLvhv1iWXZwIhANngiLnY4BljM3%2B8t2DtQtMzfnenIh6BR5FNC4wvohJDKv8DCAsQABoMNjM3NDIzMTgzODA1Igw7BwN%2FZfnDuz%2BzBlEq3AOVWizlLihAFIeHcmS2MV%2BF7edpu0yZylNMd7vCk4%2BxksCIVcNKzci64gPUMRHwQa%2BpUxahReWf5dJvGhoUzgYG7DJOBHnlyvalMvUsvgmagKQgdD0oqeRnb1Q5B7Sgt%2Bn9s2hYt7Vo1rdkFJfNAPdjTpn22A%2BOVIUTy6WueXxivUExOLtWwia17SZtIIpa5japXQq8v3Bj%2Bp3TiKXrXgqR%2BRgN0PF51l6LKHbyVZCggqfO4VGRYoud1s9F1%2F7W5htCz%2BUNBDSVX7y5GAp6RXMgSYyCSolHBwWD%2BWlq7x1HvN0WajsAghVeZQ8US8S83F7gssNd8zUgRMpFYhHCXUvwua55ZgvXEvZFa9fC3F5pDKV6b7E50%2BQopNDLsPsF5yDpnoMANKUmQBkukpy3NCNJAvCw0J5%2BYxsMwQPRsQgmkYBr%2B7cCkMYIQfmyhmTpVmJwCT%2BuuNgxvjnsYyKUC4ek0xnVzjgnqyjgCyCm9WEmMTuapoDJt4gNtGlF39PV8O2OTrWFImGiF53G4r7K6HvgVc78zNknPhbcfGCPYfeOVpqsrCdDlanTLy8c2%2FWcQjrD8lTJj4Y4xnqOjxyy90SlG%2Bk3MxvGmt1H4wwbqYCRefK%2FspomYQT3TluXdzDkyYrMBjqkAROX8H7AFubA6G6dPPpaZspWCVd6mYVAlFqYig1pgj6pDAc9UWXgWvdZbUZMrDzlaHl2%2B4IHQoRU0SZEkL9olh2GdlbiDg%2BdYqlbNAuuQ3%2FNZ8HH0SZn%2FU1TY7jy70eWvMVOonvgv6LbUuD51IwQ4kgvaOCPwh31YC6SizH3xR9dZSi9PNjgvY34EAXxRDruD9J7TQGiVV3ckhK8WkP29MftjnqZ&X-Amz-Signature=8d428d7db83ea11ba005cdf35181b9b3b263f9183287ecf71369b4287123c08f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
