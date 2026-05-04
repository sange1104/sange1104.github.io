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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QIKUQIMZ%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050821Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDOSfaYrRO4yKmLZLjtIlKYBo89DE6HDAr99X02XTJXfwIgcRh2Dz88PdxA7grk9YLli8UmOMiXteXFp9UagvbpU44q%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDEPMbhav6XnRBLRPJyrcA0IIsMbkBTXdWpXbza93BpTR%2FcjkOpGAVdWVMN2MSukdYMcfpUlns6S4s6cyeEdqcHI3GNLc%2FxAg%2FlEREexZtFLMcuB0TeUkeyU5gLHxcYMbzJt0jF88gtILxtdJocGc%2BzfOcZjRLqqYsBF0pqzVE7NSrosvwkks%2F1N9whM1PKSYCYCSbUX0iUnLoZQ3imDPy5d7eSF3l7pIkj0lLwDqbJUNie%2BiVv8q0JBYZ909IcCoSTt9pOmye1Z3B3opMZP1FQ6ct8SzaxbcZsSp833614TlGwGySQ216dzAkMReGTpJiET9HBatenoBnlcTTBxpbHTSyMr0QJzf8%2B98Jlcmh%2BffZPC4AcFkpZ7ZnSY0xaOCuApSb4NwtLKq%2FERcQtya0HrVD2XCoukiRXERaDdShZenYa54t8B9QwwkuSIFAuk0xuUKLDTkxoy5vgvefak3QWkeCODJlFzULLF%2BedTi%2BxmxkHlbAr8MW2OENMvevqRhJn%2F4ps76%2FCP%2BPkpd9e5kD5%2Bzz0NTp1lwRHUGRKxYmqTGzjl0vrEw7%2BOmb3jvHycSdSO0%2B1Wage4HAxiEwS1sN8kwkFPNy2il7a%2FAsewQDN3ZT4fq%2BoCFP%2FGX9n8mrA6Ti10cLQBEBcnK4nb5MOPF4M8GOqUBRFN7RY7pKZbEtbtQevWLwBZ2HdAlamJdTE1FaPFb7HTy2nBTwYbTRb3HSkm6fQdtjDHTTaGmWDTp0KBEaGp%2Bg7kDeHGnvjjs3J9Hir9IZCKEL0uQydC1sSgcvRacwwdVusC04pPIH%2FtlNigbcUVlkmYnymA8MQiEFrMX6FVhrCRQD7NviOz5yQBJcdDW0dYPRl27Fp3z0MR1gXgTf7yX1Z94%2FHjQ&X-Amz-Signature=ac1efa6768fb84549e739b9ad7bcd74457a15950b7c6123d7cfb98365ea39de0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46647HXMUIU%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050822Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCudWvF0twBWS8541pxQVV8vIpGPCIZ9vH%2B2aw%2B%2F9L%2FtwIhAPqk6GD9jbSwP1eZa%2BPcY7ujA4aJ34jDVH3uIKaY%2B6KOKv8DCGYQABoMNjM3NDIzMTgzODA1IgyzUyIgx7KixIVv5Bsq3AN6vfqtxSZMS5tdv8zPojeTr4JfNO8xfLdA0%2Fmcbly740GQ4hvzCK%2FB6XexlEPjuIV8X7QJUIlIgfuSnmXcuVj1ahpUBz0mpJETWDBK9TH%2F3kXISIIjqD2hHy3GfGPmcPlanHoLBryJ96jxZ2vazTsHuSBir2z17n5vIScN01bXcYmW7PQXxel1EFeA%2BTijC30lOBtmPTYkwIOYzIdJQMe9%2B4%2FN65WBV52YIQgRrSIRvqW08MjOGX%2BAvPfuG12vSoZKoFUQ2HIE6nu%2BsQx%2FfWgFE%2FWFN1VVH1lBGVcGl77SAfWmmFBGpP4xtWvnv1a5cu9EcfZwNH3%2FU2GqnUn1P8BMzBxUSAgiAQ%2BZDWpdS2qHvqWfXdYBHSiOiWwmRq0eV%2FamgxmmqieBwGy9WxuvCghnUwARlmToiP2DTSit%2FTf75CBSVggS49y3WJFgW0SGtciYCZcVhJXUmusXEpcnomO4w1vGyM6llWkpfSaX6AsN7o6UiKjpXaIBSD2bwZhT6DaqJVxQt0F2HUTVOTPVn9rOniyURVE6K%2FiNyLALYS3iMUEmsoYiQ%2BXxnwBQxiLNY3fmMD6LWr%2FXwvZ1cvAEXd6%2BYIeG4UCk%2FcpSIyjZg%2FFEPiojO8axgLk1oOTqZTCMx%2BDPBjqkAZfjW2EF7xwwSw61Rb9LpFJUPKOLQ5VESWa0AkYTIVZwz7Q5Vcv13lNi9v4lX8%2FTZaUwxrH6%2BPEpj9cUgfWLCU3bsJeZGzMwPILH4vG%2Fzs5oPvoqxWs0nFDE6wbIiPpC4ZQ30CztIZe7TiUfCvAS9Om7HT%2FKfPxFby16%2FtVeRW0fVvbI%2Bj%2Bd8rzxb4zvm1oTIN8FW5hYodRR1vMbLlZJ4PCEjMhv&X-Amz-Signature=63dfe3243aaf2a5eaac9f4cbeebdb6d1161c89d4ecbfaafaadd9e6927e3e09cd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MCQORNA%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050818Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDCu%2Fpkllc5PWFnLSw%2Btj4%2BkfUka53YFrkfiXt%2BJmhFYQIhALUCSN4M%2FO59IfcL4HorGmJgta%2BXpMvp3hLWHHuYU931Kv8DCGYQABoMNjM3NDIzMTgzODA1IgxLsnoKbWI6sfGn0sQq3AM58%2Bbky1XWZPqfhTo%2Fw2sN9ph4fV89xvIxjWGQlf%2FjG60Zf0XmBNVEutGhJ3O2skYs8zmSa3QmQ76hp400e2dD7Q6i7KxxbnyxiKKyKbTBYth0NYtCWAOhulX6kJRujAzWJ1t4uUGplPKJSS%2FWhXcF9qF52YD0nQutcp2VECNC1OnqKNgxmToUNRkosvVQiG8pqYtda5tpzWyOD%2FjYbrbriuwBEPpGerDXQjw4DIEpr2E0%2Bx7QiJ64X5g4Hacf8dRDXZaCwhIm9lc170q5cPbcwPrwsRaZtydkC31SfhnNprTKo1jwZM72NLeIYSDu2QAUclBnHTe%2FrTJhnKo0IH2hH0wxmFtg3t0aQDBIF3pC5Y06XmiY8pDT%2FsGsLXlenkXSEVtK0mlWXLjkKbee%2BwYhhgpvJKLOdCOZOIrkKf6l5rQaeGWRX5O23tSHD8AW7UX8QvpcJw2HKc1HQIoX935ilRAg2M1brRGXFND0C28pHK%2BTG5Q9RO3ldPbvL1sAWdr%2FlkQD31RK1PFsQJ5h8AfZbUb6sB0uigi3K8x5MXO%2FmhoWNE%2BtwMSTBlSv0jVCWJXgg7uZjXMQ5kbYDD9VlhPvU%2FLxguVawc44Q5kcOYQQA2omRouMBjiM%2Bjmo9TC3xeDPBjqkAWMghiojdAO5lFTqGqe2%2BCG5ODgJCV132CRdYqTwo1DUK0q55u9prUo3qYGqYxpBPnBwmopeb7znZvO1PJ9icNW0WXX9%2FFk2BPCOUjqo6hA%2B5lwkkyvX31aYs8J66Wt7%2BpfemOUoC2agiXnDxLVM%2BDRLmDvElUy9juhdaRMsxxYDpsZPtbhLGcxvqPlemgeD3wTxEvQNyoVZl9Hcmb1PG%2Fc9Qz87&X-Amz-Signature=b06f7e59e33db4b1dc053cdc72ba5c6c8900abfcf7bae51889045244454a2d5a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MCQORNA%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050818Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDCu%2Fpkllc5PWFnLSw%2Btj4%2BkfUka53YFrkfiXt%2BJmhFYQIhALUCSN4M%2FO59IfcL4HorGmJgta%2BXpMvp3hLWHHuYU931Kv8DCGYQABoMNjM3NDIzMTgzODA1IgxLsnoKbWI6sfGn0sQq3AM58%2Bbky1XWZPqfhTo%2Fw2sN9ph4fV89xvIxjWGQlf%2FjG60Zf0XmBNVEutGhJ3O2skYs8zmSa3QmQ76hp400e2dD7Q6i7KxxbnyxiKKyKbTBYth0NYtCWAOhulX6kJRujAzWJ1t4uUGplPKJSS%2FWhXcF9qF52YD0nQutcp2VECNC1OnqKNgxmToUNRkosvVQiG8pqYtda5tpzWyOD%2FjYbrbriuwBEPpGerDXQjw4DIEpr2E0%2Bx7QiJ64X5g4Hacf8dRDXZaCwhIm9lc170q5cPbcwPrwsRaZtydkC31SfhnNprTKo1jwZM72NLeIYSDu2QAUclBnHTe%2FrTJhnKo0IH2hH0wxmFtg3t0aQDBIF3pC5Y06XmiY8pDT%2FsGsLXlenkXSEVtK0mlWXLjkKbee%2BwYhhgpvJKLOdCOZOIrkKf6l5rQaeGWRX5O23tSHD8AW7UX8QvpcJw2HKc1HQIoX935ilRAg2M1brRGXFND0C28pHK%2BTG5Q9RO3ldPbvL1sAWdr%2FlkQD31RK1PFsQJ5h8AfZbUb6sB0uigi3K8x5MXO%2FmhoWNE%2BtwMSTBlSv0jVCWJXgg7uZjXMQ5kbYDD9VlhPvU%2FLxguVawc44Q5kcOYQQA2omRouMBjiM%2Bjmo9TC3xeDPBjqkAWMghiojdAO5lFTqGqe2%2BCG5ODgJCV132CRdYqTwo1DUK0q55u9prUo3qYGqYxpBPnBwmopeb7znZvO1PJ9icNW0WXX9%2FFk2BPCOUjqo6hA%2B5lwkkyvX31aYs8J66Wt7%2BpfemOUoC2agiXnDxLVM%2BDRLmDvElUy9juhdaRMsxxYDpsZPtbhLGcxvqPlemgeD3wTxEvQNyoVZl9Hcmb1PG%2Fc9Qz87&X-Amz-Signature=c86f47db47235cb0e501c3bb4ec3c3c5235b108cbef705d973118539ec64b64d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664WBDIRQ2%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050825Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIB8o94oeoqa3x1ViPh%2FedvrRvXbD%2FdoYlPtuKzKnwXPeAiBIoQhM8LCMSIc0B7eJvMawJhzTS9PQJT9H6PfCc%2FShoCr%2FAwhmEAAaDDYzNzQyMzE4MzgwNSIM2uZou5XTD7Ay5DSjKtwD8NEo3CFaB%2BLPTxs4dqDfyKY54y2iLeLUc8mTuVWwtyzEJ3%2BM%2BoCv9jDorXrYM9c0x5VZ%2F6IhkfE68MuWfEdIKRWYgcFerymBppUxPGxxRxUmvg10%2BXKWTS9IbcGJEYV%2FbDdc%2FUpKhbH3j6FSAvk%2FpuQW%2F%2BX54HDYKhAWQ0GmQGExixoDU6yBAIeavh5qb264UdYvAVKCH%2Fn%2B2AI5Lkjhzma87cAV1cekztr2HPusIonlkQGLQPL5LhK%2BiXKl%2FJUsVuNIVwt8yXX9Vn8CU3JA3DiB9XB6tZgFvjv3jYVnWIFMN8WHjH2M5dK%2BJJ5C0fQH7hpVGNRIzWO0j3m0E3xQ%2Fs0VRVuUPiablJOy0BwFsJnehTT4hzmbeKAWgpMUnyRoAciR1ybAZkg7p2BdneTl%2FatzFOj1R2KtVoYYBQk2VVzVy%2BWaFJrSmFBcIychQ0hmjyvjeOL5DMfgHJAwZIhfcpLhxsh9eGmrwYDh9N2BEnA4bs5ill5gJ2HKn6CULA%2FYrJpfuTq%2By3mDtPCdBTx4r8yiEvHnlVmEFrsXFJWpe2RDdw6M0jKyxqajUzeP4cDI177dKRjEdttWyCmuPWSwCkIlcMVKizL7eHVGY8t7LzAsdPUKVNwOADunMs8w08XgzwY6pgFVLq%2Bl9w37o0p2OAlT5UaooCuEuKVDcRYtPxaQupbQmn75qNFsuyXEIwm1Qpd%2Bj0dYl4T7F6Dv7n4hFvSzY8n3frTQ1fxMBMUbVadgdIAPgturyD4Rv4BGBCxJzyuCwaJNtMxeA7wMD35GBFVa1w8mfz%2Fyz7QL%2BuCAlzKsqHANVwyr%2BGi27CnoH9Y2OpRUG7Ks6uJqvSHr8%2BDPxGEOXsWVaVLN8%2FYx&X-Amz-Signature=4ec13e2b85a457c3718d3a58cd5dc81b4885b576b0a5aad8f957046f8eac49ab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U7LAYO67%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050828Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEj0J4VRugEL5oHc%2FibgnnqlyKpUeyFHwQp5GLffaWyTAiEA9%2BXCxJM3gOTqqjOiUiukOYDg6qMFWK35CotRoq%2BL4hgq%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDMCpRXZYBhX2XNW%2FMircA5%2BvpgEXf61L1P1Ab17gd34awFBDp3cAJmKJGf3VZ91fEb5dKfk6Yq9xpOpyKjKTKYdPQMCQ1IUqJwf0PZ0p5PLWpORNoL%2B%2BadzVPo5VkOhGi8xRkF%2B5s0R0FUH3%2F2IQKQeXA22XQdSL3mjw5pcZM%2BQiXY2QTW4FkU3WP38Vn9%2Bob8dAp0HLkoosZwQRIzh5mr9sa8zD1Cj2TMshCc34zLRq66q8U7haB4ArDG9eWFv94qnGrv%2BDp%2F1B%2Fj9lcJxQa6XwCe8D3vs5tywQB%2FYv0W0oDi2bkyKm0uQzjKFMXZGt%2FtET3CPfn7P4ROQtHy1HoUvgplUmyQTmWN2RxnXxZR3NV2ld9jI5A7b752X4t%2BuMn0KRwRtNFg5N%2BbSUBPqpWN6D%2F4aMdZ4Dvs7IYHX%2Fk7vwv9OqxgmVAtTMP9qUPy0Tb1qRskI7SFkHkYhGwLhQq0vbRx1njfZaPVjmm7KLpVsRjfHqHZ6n8pk2MbxUHpur8K8TcvvA0cpdm7Bn9evq1TC%2Bks8Kf8ICZVyex5VpRXl4N1ZSmhEE8diNTJFUOoBsGycoFezADtZdyO1PsU7MnzPgEnWDCnj%2FVfL1NzPb3RPGz%2F44Pv9z4zBYSTkuNziOE1EsmcP7FWhc%2FZVGMMzG4M8GOqUBaR%2F8fFkpoqFFubIvkxXHKGZQIqVyaVcFM2fWrxUaSwJ5mZhdHDsNy932ymTJq8Qk8GRjAJIJ1fQL5YgP4iUEYnKD%2Fl22mlOY3N9hCj%2FeC%2Bw7u4%2BaxdZGc%2BIYtnirMd0Lc22gs7Np9Rk05YwI87GS9o2bAypyRa9nUFKgFBsrt9rNYQnFJxQUl5rCnFNkfk92lQYVyKgKRp4A13q9B2ArkLvaoU4%2B&X-Amz-Signature=6d67d5f6b8314f3b564c1ac249ea9064b78e325907ba9a114a3bf47ecf17aaf9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662YA7X4ZK%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050828Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHi0p3B7RbsVbkzP0bY%2B6N08K6lkxcKTStGlmyajyDedAiBy4zszkEuWbdveiI2P7c%2F6io4hqzQiqqaBTe6HfEY%2FqCr%2FAwhmEAAaDDYzNzQyMzE4MzgwNSIMltkEfdo4Wamm9NHVKtwDK0i7%2Bxg822XdTk%2B4uXefOrQXADu2zSo5Oz1VBJgC4obqQdK36p1mDzQH5Fw%2FTLuhQcuAxTNA2M1ei5uLyhDTqhCPBEfO46griA%2BOvKT99n%2BNJkFkdhTr0Iyq44pnw3q%2BeZnHQDcCyzr4U4PmG%2FvoDDYccQyG78GEMwQLTn08ns5T8sLGKbnUb6VY97se9D8MICSetxgJX32MpZCb4nzQ0dlmVfdjpQsSHHsRxbE%2FK0z0BIcvfQJa1HnEuNUHmLRWj%2F0UbzrdbE3ZQKlLxo%2BzAAl8WExk8Dy3mj%2FXX3qbwaZDpj3UkR4qkaxNWNj2pMmgE5o0Ips%2BKUFUSbU3T%2BtA0wHu8bXq9rOPSSNJ9C3MWFIe%2Fb%2Fxk4Wz0sbFgXm4LjDyX4OKX9DFNJkzeDmf%2F%2BPX8OnpcXNSaJ4xYp%2F898KzGecXoAR0BfhJdkRv6CFjTNQ2W7BiqMCrXWFZeuJslCSKIqOEpN%2F52qVJdG6g4qfIjhKHSY5e4zIyyTcrWUwPqRbwMq1eMECYbMezWnhWBApMdpsJcx4Nfwh8qBQxeuDob%2F%2FObOJuytoqbU6WtKQgPwtphjfyL2rVSMi8V5Bv2%2F3VPigkTnEVQu0RUEUnxMFiux1KwuaKNpznskLyWfUwxMXgzwY6pgHhGwx0Aec2XXgmnSZj8Be%2F%2B9WHsq%2BxyO8bZcKZFdq761j6rDPM%2BDlwv5L4pjLuruH8iINKBCvLwU9Rf3BZs2zlYsQiWUkN7c3ifOqX6qO%2FqlEVmxwKXmX9sikpaOvX7CwRIplWbAUbXdN7%2F%2BpSJ9vl%2Fq%2FwXeHubvt8C4eCfJfCyUYOT8V3j%2Bl2aquiGMY5St19HIXqg2Zx%2F8wG8VUnwW0ccag%2B0uFm&X-Amz-Signature=e99de72671a2023d57c4a988869173b1ec69dcbe3a52a4ee6894337ff7c1a5b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664MLW6TIN%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050828Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDrb222vjvTqWehxoQj%2BBiz%2BGqJl0fkD%2BzkarJXwoDuKAiA8J58Cfg%2FY4Aj2sR2rRqGMr8CVQ7%2F8ZGV7v%2BgWRCTsmCr%2FAwhmEAAaDDYzNzQyMzE4MzgwNSIMY4k7ZbmRaCmHz1j7KtwDce6DQ94LDPALDew01OyUpfzgLwI3th3%2Fzjcgwo72P%2FHRrwrY88m5tiVIj5SIMLIk5lMaNIz6egNmDdOn72yrnfBqdfuIv%2B%2BHrg3oVhFRznpojAlATvujDLfW3Ivg8l%2FXlQrGIPN%2F98sJ62aRULFeLlF0o6nedSo4KKazZV8nsc8qtois1njuxzX%2B2SRo7TApgpceDsE1wyDUXdIhKM7v08K7KXLAW3WPZ6sWe8E58YsIHcjYH78wyLwitHzkAWt6uaBwNOCrlrxFAUGeGYU6h%2BdBfrKE9iHoDILg2vR%2FePyOfckT3Az9p3F5mFvzna9kAUwUYCIeRDAJFBrFiMYTQo1nn24r7ozRy%2BXib%2F8JcsZHUDfq24nlkOpw3vKYYPgBLEgqhudesnIhlnoOjnd6AZUrmkI6GJcvqLnCmbxFD4WL6CjEgoBpp3mmszZlYrthao3ff2fAvr%2F7bwmXo%2BnHbiffdjKbkoKagvIMUAsZj1V2KJ5Ruqmk%2FCEW7rrYWilXpIwkqh24DnfPQuKOUemS8C9RS%2BEQWQd5CMRX1xwsK6UORzOG2IMEnwzBD2mJzOaNB4xvvAsjmvXXnanA1iEMib%2F6orhhrsclFeRtEg%2FfqdJJ6M%2FQe7ht5l9bM58wgcjgzwY6pgFCyCq799MvKY2eMRWN9m%2B%2F31uxdk3zm%2FQ0shE5Z4a%2B9JG46Hu3g2XnMZjdVAps%2FAeF8hNsocbVJcpHd1%2FXX7EH10r6yqMWOUcDNX%2F6%2FcntyahRA4HdE6Lea3j4CL2LeoamliRZGL85g3QZ0gToQ394qpWI2P%2BeUM2IORrvG3E0sY3AM8Gv9W0Q4Tle8in0q7gf6T9BSttLbjnPAlOL92XmCHAaT1J1&X-Amz-Signature=80c5e564774269a31c0a4aad75c1f7dd4d7c392f2413b96d59f145ecd68eb682&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQQGKSAF%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050829Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGL%2BtK2bj7E%2BZWCJBMXuOB1hwNn1eEpckDuhcGm%2FREvSAiEA5tzJl%2FvraqdUaTPJcRAxZ4oQIlgreTtzW9sl07M%2FirIq%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDHoe5YjpnkOCGkuhcyrcAwyWIsKWWAVYNTDVXMpJ11tLxhw0YLXsZ778OMGiW9KEyoxXQbKRLrf6EB%2FLy20GaGH8Jc0xBiWyKXgi3IawslpKMRJQUA%2FRmoaHiat2gNqQRSLa3roZ7zzxx9fzHu8FLceF1hOPMopSX%2BuOtlzhdOUxrFJrDM1dJt0JXStI9JL8STqNH00NRLAWvtUMMVNf0K4VYez%2FkobyxfKsAcDTjhM27jNztnpzvs4TfaX1UhxdtUOJQiuwtsPiiSacMUEcm5HoaB8KCoabSnrO2MMqoCRPRCGMCkSWIR96ZpbR16EBPpL5sY6B50Wsq1Qa8rb9guoyjg285dOTad85cFtHvBhmzSEo1s0tUc4zkHMq6JMU7VaHxiiI2CK6ot59Mn5TvMTY%2Br8e0cwmXP6qATWc83dCsS7qtyXT%2F0pz%2FR1ILJQV96G62ef8OZmZFQRf1b1MsG5j2pWTq56WdO76QE1dTvn61xZAYQWAcZ%2Fnje%2Ft1zP9TKZPKGO6z7KqiLNipNNjJv9wTOLZFhhEXzxx2r%2BCO9m4z1RbQzMYih24D7HCtIqLWSw4YGp45gHoRuoDCX19oHYrHgI1a5BR1Xlc1qZxTq80hH5cwe%2FeeSKLa63qPrPVxg2TC5pFDpqba%2FWLMNvH4M8GOqUBGdNqZWxGFDPiyNPM%2F0Q57Tvy7p4kzSxn32EbJ7cT20WewOFjpopFKak6%2Fa%2BVP9u%2BgMUo%2Fu12FNxu4BYfd8NVas51Pnxv4dt%2BiOofcHqfegnp9j2MAvD96V7b6rDSThGSPDaYLp6CS1nlfDrMGX9kfAzCAZLcw3VcecVmRBJBGrT5bsAWetiCRBwuKKJrOGOBtME5WMaSLIvslUu%2B%2FvO3wpOEUeNL&X-Amz-Signature=7f545f0b7cfa6a268985bf7de1c302b6c305fd45051d33cbc207304ee53e9d15&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MCQORNA%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050818Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDCu%2Fpkllc5PWFnLSw%2Btj4%2BkfUka53YFrkfiXt%2BJmhFYQIhALUCSN4M%2FO59IfcL4HorGmJgta%2BXpMvp3hLWHHuYU931Kv8DCGYQABoMNjM3NDIzMTgzODA1IgxLsnoKbWI6sfGn0sQq3AM58%2Bbky1XWZPqfhTo%2Fw2sN9ph4fV89xvIxjWGQlf%2FjG60Zf0XmBNVEutGhJ3O2skYs8zmSa3QmQ76hp400e2dD7Q6i7KxxbnyxiKKyKbTBYth0NYtCWAOhulX6kJRujAzWJ1t4uUGplPKJSS%2FWhXcF9qF52YD0nQutcp2VECNC1OnqKNgxmToUNRkosvVQiG8pqYtda5tpzWyOD%2FjYbrbriuwBEPpGerDXQjw4DIEpr2E0%2Bx7QiJ64X5g4Hacf8dRDXZaCwhIm9lc170q5cPbcwPrwsRaZtydkC31SfhnNprTKo1jwZM72NLeIYSDu2QAUclBnHTe%2FrTJhnKo0IH2hH0wxmFtg3t0aQDBIF3pC5Y06XmiY8pDT%2FsGsLXlenkXSEVtK0mlWXLjkKbee%2BwYhhgpvJKLOdCOZOIrkKf6l5rQaeGWRX5O23tSHD8AW7UX8QvpcJw2HKc1HQIoX935ilRAg2M1brRGXFND0C28pHK%2BTG5Q9RO3ldPbvL1sAWdr%2FlkQD31RK1PFsQJ5h8AfZbUb6sB0uigi3K8x5MXO%2FmhoWNE%2BtwMSTBlSv0jVCWJXgg7uZjXMQ5kbYDD9VlhPvU%2FLxguVawc44Q5kcOYQQA2omRouMBjiM%2Bjmo9TC3xeDPBjqkAWMghiojdAO5lFTqGqe2%2BCG5ODgJCV132CRdYqTwo1DUK0q55u9prUo3qYGqYxpBPnBwmopeb7znZvO1PJ9icNW0WXX9%2FFk2BPCOUjqo6hA%2B5lwkkyvX31aYs8J66Wt7%2BpfemOUoC2agiXnDxLVM%2BDRLmDvElUy9juhdaRMsxxYDpsZPtbhLGcxvqPlemgeD3wTxEvQNyoVZl9Hcmb1PG%2Fc9Qz87&X-Amz-Signature=fe7fa5d7fb0b5a11074fe56ceb5bd5b1ec0e0dc9b4ec8999d5c19573b3e55381&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
