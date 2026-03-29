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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666F77PBJW%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033711Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJGMEQCIGjw9PGapmpFdFgKXNzZb2PXhDNqbP5pPTnQwUh68wNcAiAg91vzrTuJkv5bN6FTMxbcN6Gi03xmbGAyThxH0V9PBCr%2FAwgEEAAaDDYzNzQyMzE4MzgwNSIMcqeeME3CvAf4wVu%2FKtwDDtIko3NyqeV9hgzob%2BhkHNkhLmh2NaxsTGz5RnQXdpm%2Fwd9Ms6joPvcXdHLyIHGOw4ugZnJAlXkq2uaJ1y0i%2BHtBB1t6%2F9PB6HhOujTWrx5d4NBa%2Fnsyf625RhUcDXbmm%2FKJn6CiFLSAhHq4dBsfAhz7hHbHgmWBcL8jEJOZ1rg7zR8rr%2BcgvNvWFsWTQiPkaEqGubIvY0z6fYUAC9Eq3YawLJFoUen3WvRmPWQViYtfE3fkhajINATya3Ft1eUluO99zMPgtMCoOXNY9U0tfF6fX32ksFBID6QxcsP8eDIkcFSl8lIRWzpw%2F%2FDPm9fQckUh8IVlMnryq4zG2J2q2sQki%2B9GfspsSQ5V7l1ptajZ5V%2FOKwGMgIZyB0DcSX4xbET1QeKkKcFSzQ72AiyCR2APNslShe9ocIrfTqSushU2kn%2BvRgq6erYPsiqnV3ggJE00cQVHKg%2BwI4duMTSR%2BUOf3BOSkEM0TqzUznyCI9ksTnem0yu4h7Of8nDmFAtewQlmVBkht%2FAc37d6Kl73JWHKkGZGGn%2BEvwtjupt21jB5LRtEiQ%2B9CB3o%2BTy8duHaZkujaF%2BWYk0SBhh1PebmWi5oAAYeLFYQeT2StpsnmctvFlYoB2Tdpc4BhCQw1puizgY6pgF2lv1R%2FleEA9UeGRzVaEkugfm6Z5Py3KHeUwYZLL71P3NEoaGVesK2ncYpglZhMSvYyAP11g1kvRpuVNy3rjqL%2B8bqGAie2hvtDXG8vbawi08rcuZpPux84zeEs9mt%2FOw2Sq8ZCTaXR2eTujkaLmYBN6bhoZlgOiajw1cMNkAcB%2BoA0Sml5jTBzMv1I688L%2BuSPzKX%2Bbl1QSHBRBuWm6JZKR5HWScH&X-Amz-Signature=16ebd532a7c6e21de025c4c1ad15fd3407967d17dce8b2d730cf0860ce51439e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46635OMASHK%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033711Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJGMEQCIBJ8CeprwpB36K5M4bNppAX6KQoLcxm5gKmGu4OLLFKNAiA2%2BENAgjIXcg24iy2IOBMiSMStS9F5P2pPSg5KdDhrRir%2FAwgEEAAaDDYzNzQyMzE4MzgwNSIMdTYOcwXTV46Iepb%2FKtwD4PS4K%2BQGaQMEmyvoK476S3EfEZ%2BXDb1p97OLHqlFLMOwtBgDwlOH7EZCimt7RG%2Ft%2BpzqS3DzqRaP0TIWTDjZbOE2Li2GET4K3Gscz5wdKIlj3xULKnEZQIQlScHB4jfNBNQo6AihqJAl%2FEOHmLcVBtKl2op8eZ1TxRqF84qB%2FIT6hQIh8zFWhhD0qp3ao9TpX7gAIl%2B3ME%2BcMCRbKgLS6Pfw3RddbRUP5FTSsmJ50qynJI%2BeW85qy4Cuc%2Bxnwv5janOOozKm03fi2%2BRdPlaKUwz63Ry49oNEBJ5SI%2B907YWZqOC1CEeHvRGJFlZsZPzn%2B1mgR%2Bxfs0FMSLEFbyo9RKyFif0DwKhH9eXH8Hp70nOwNJk91wQ3QJIGidJ67nW74xAdM2r%2B9hve4XM5LkKpu82BMdjAnwQRHcDbIWaQVnB0%2Fk7Ge6i1dJOomhOJejI1W%2BJf4PgJh5GKYFSzNfI7Kl9Ixql8BK6F8Mgetb4xHkI0ShsM2jn2fjAVcTlvCZ3q%2B3PM7BXuyrX8IwgqO7LAdGlLMl70kIwFO1j9MzHVyZZwnZW%2FO9lJJcrH2eFAHbBkEVNAcvuMpm6YSbPB0xFWbyoT4vVAJOt50ctAeGGX%2BfR1ru0G95eZShAvn%2FAw%2BJqizgY6pgEF%2BJdqfvyU%2FQnSX%2BLq3QAJgeeDeybfaaYzksJ%2FUvBQrhnSvu6YlvEWY%2FuW%2BHdltP68UBSmL45S2%2B4%2BCefyGiEDwnD4NgQ%2Fr1%2Bg4axv5mhLFGWVgKvXBBY3HUg%2F7n3ab6zd4un7PYO7I0M5K5N6C2t3LMpYLnsJ4jR3cDHSsY3cm81Bed8IDlgFLhPoeJDNHR9qKtnoPj79ip8Ni%2BrX8ahscjeMz7PT&X-Amz-Signature=c5f11efd087ede7a97a5f44124326fbb5a6acc444470cb85473f09ed3b2edc5a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667RWWZNNA%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033700Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQCS1D6FswHpwmNXJf%2BMBxXnACKs2kZT3tsG4dVaHtV0xAIhAJvLB745uGFISbI3dR%2F2YkOvhjO4U86Js8ebo%2B9c1stzKv8DCAQQABoMNjM3NDIzMTgzODA1IgzjgL%2BbWk3tTBYNbDcq3AMIQ4HDcGwtrw8qO7xUZe2K4459kqQNZf7qo9lesCAcpVk5YkeLgFVpEqu9BfsW9dRVbKz%2F9%2Fv9ukL9n%2FnIxwf%2BVXxRMJeTcElKNuM0YEvrP0LwW9aIXkf4q0nPJ6kgZ3vmCAAwjXWZ2ve4921nY3XPPd0tjD0pvdz8UpNm%2BZM9jylZf07BffiafyVzz4ppQSQlWWPmN3KRXjb9hkbOL4rBx0E%2FzKgV6XmCodDxbVSMQ%2F3%2BktSH28NfLvB7OKwKEIv5hG9hnwpZ0ARGgdRcu9mUhVrfYlOpsORYgMqYti1Hrij8ceiwUBrHCH3qHAnEIyClrF69BfnYj715kIylJ4zwZfvhEpLY93v0DHqtWubcSxXy8Bv0enXeymw5f7s2FOqEUqIXSToy%2FSMAf2WUsGV8dDaMo3oNrfP98nq%2FBCYqNrPfTy96CjyF1uZEsMLb3X6YWtDu2ZSCo2OsV8RAvILreK62eW%2BuCPn5FV8iohycLqv16NrH6I22g7w3vQXiTBlbN60TsVAZ5zIUYbRU5Yo7yUfjeVAMndmj8o4oCiRt4Y0tfMww4RVH%2FK9sPjMX3qncfoYU0vi9zcCUkTMhFMZlAz7PFujs3xDBgj7TlbuqKWHki%2BFEqpCpPTJ7SjDhm6LOBjqkAXv032INmyloEanI9cxiBK0YFZu81piPdlynMjmQkjvG1dvDWWpVbp4VZNyco%2FzSvzAYnPNP51yoWCJoIy3KNIdImvq9KsSQVsrgd%2Fo%2BaxxFrMgHBi%2B0OPjy2nHWBgyDAE%2BhtJP95WqK9N9nvBx8d%2BP1if9D1bzBVc7MVO5GtR10u4ihP5XkDsoYvK1ZJzgyuIH6dEklcIUplXsyNYx3HpIB6VZT&X-Amz-Signature=642a54aa91b7be5019a10272cfd12c15cba69cdba642368853802dc0f73c168f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667RWWZNNA%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033700Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQCS1D6FswHpwmNXJf%2BMBxXnACKs2kZT3tsG4dVaHtV0xAIhAJvLB745uGFISbI3dR%2F2YkOvhjO4U86Js8ebo%2B9c1stzKv8DCAQQABoMNjM3NDIzMTgzODA1IgzjgL%2BbWk3tTBYNbDcq3AMIQ4HDcGwtrw8qO7xUZe2K4459kqQNZf7qo9lesCAcpVk5YkeLgFVpEqu9BfsW9dRVbKz%2F9%2Fv9ukL9n%2FnIxwf%2BVXxRMJeTcElKNuM0YEvrP0LwW9aIXkf4q0nPJ6kgZ3vmCAAwjXWZ2ve4921nY3XPPd0tjD0pvdz8UpNm%2BZM9jylZf07BffiafyVzz4ppQSQlWWPmN3KRXjb9hkbOL4rBx0E%2FzKgV6XmCodDxbVSMQ%2F3%2BktSH28NfLvB7OKwKEIv5hG9hnwpZ0ARGgdRcu9mUhVrfYlOpsORYgMqYti1Hrij8ceiwUBrHCH3qHAnEIyClrF69BfnYj715kIylJ4zwZfvhEpLY93v0DHqtWubcSxXy8Bv0enXeymw5f7s2FOqEUqIXSToy%2FSMAf2WUsGV8dDaMo3oNrfP98nq%2FBCYqNrPfTy96CjyF1uZEsMLb3X6YWtDu2ZSCo2OsV8RAvILreK62eW%2BuCPn5FV8iohycLqv16NrH6I22g7w3vQXiTBlbN60TsVAZ5zIUYbRU5Yo7yUfjeVAMndmj8o4oCiRt4Y0tfMww4RVH%2FK9sPjMX3qncfoYU0vi9zcCUkTMhFMZlAz7PFujs3xDBgj7TlbuqKWHki%2BFEqpCpPTJ7SjDhm6LOBjqkAXv032INmyloEanI9cxiBK0YFZu81piPdlynMjmQkjvG1dvDWWpVbp4VZNyco%2FzSvzAYnPNP51yoWCJoIy3KNIdImvq9KsSQVsrgd%2Fo%2BaxxFrMgHBi%2B0OPjy2nHWBgyDAE%2BhtJP95WqK9N9nvBx8d%2BP1if9D1bzBVc7MVO5GtR10u4ihP5XkDsoYvK1ZJzgyuIH6dEklcIUplXsyNYx3HpIB6VZT&X-Amz-Signature=cd5e4e2594d30b271cb98ea4803a1dd927cf3ebfe7c5d34752d9aeae15ca1fd2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665N2573YR%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIQCNsRjYFLuK0ivwKHl1uFyQuEdsIlLxjLnXVdQ1XtXhKwIgOWLrGTCvxZVPboY2X1iVOpLsEDv1%2FOelUg2xHDbevqoq%2FwMIAxAAGgw2Mzc0MjMxODM4MDUiDCSXjlIMiIGJRNKznircA4UORVFK4v58Y1gjdcufIeClD6ZdYWbu%2FlXKnCxRTDRNKg6qVdcMfYTMz4WxsWFV6chKbAM7hJnrehBH%2BTb37Qh4pAHMgMyPZkTnhpwYSJPcAoa0pdZqcjU%2BldoJbsVEuwvGgGP8u6LmOBxg%2Bv2pRf3Hw4JRT3CjuO3aG9UbpM6vEQ2LnPUt1dyZN6ry6ZmcoIcgR5kVZ7j1YjFpIsqjZswbYJYJpaHqqspowi4bJH7pa%2BtC8s8trLfh1riJOK%2FTFe0PdtasTk1GttT65yIxOyp%2BYPazgSzw%2FoE5Z2qN2xDSrApuWNe5ccDp0GZYT5MqnfMChUtHTvQOq2s4UM%2FN32SBHvFzFNI6CUzIv3os%2BoZOKrV81fny0EVRxOrvfrXJCV0UeAcqSzdLLtpdQWAxP4ZnGwei%2F19zrLOgfIqpVdkdepCmk7cUiaoFkBl1v5O0G8JRNCNWRpyCJFcCotFCSYG7XRaIUvHc%2BARvUhftkMKIKiJTkHDdy6J1gtK1pU5D0Uc%2FEs4KhfuhXGBXXVbCvk%2B9Q9qWDk2O5ihst6YzRRDFhk8LpgOqXgf5gsjzcjWs9l%2BTQs0a3dP4QYV7x3gQ3TsBmr7BPU%2BAcuEIwncTR2BgGtQBU9M9%2F0m3sUAbMJabos4GOqUBdI48iFn3ql61NH13QyXhKV%2FJSU%2F5iZZTDeQSPuzQx7F07npdDccc%2BbMOuj7KgKLBFDp0tgr4QL5rsBRRPjqcB6yUCEFCrdb6YhxetFSle7gFk14nWBvMd50syPIdAF6h0%2FmMVE673QWuBJ9In9UQDJ%2FLX7OaNMc3Mb2%2Fj57KbAZgBEL%2B8BCVh5GpXW7JDfiIFgrkKfDLc8elCKHYt5fQ5m7CdB3o&X-Amz-Signature=610bc0fdf86d82a9230799594801d10cc0a19bd5ae04261f898dd02167cad115&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z63P5ROU%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033727Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQCLw2Ur4sEqiC6OrVC0G0hvDHF9lfT1dZdUMwc1jEX7FQIhAL6chgY8MzLPZxm6kSVQU9MXa2QMWxPmLx91CBGhlqk%2FKv8DCAMQABoMNjM3NDIzMTgzODA1IgzvPOzIX2LQFlZ6yfYq3AN9ao3jjhOuDsW7OlmsDDA7YSrZSTIkp6hDo9qQPR6BleurDsBfMnDQ6KMRYKzQSvSwsNR9bFrpMViJH3EDD7jVBMplkZt356CMzDM1C3NMhxPGV057vrqQ3FvLDd1qdFobNmBDLndsKYnPESnYJJt6r0Ufl3ngUznO8Gk24BY8ZtCseTQ1DU%2Bk5OYyquuNI81LmogPElUP1CC1kaYZHooLz2r8Cnz0odHHj4ChTIXMIxQLupT6eCfhTr4V9rJ11xSuDb%2FFCVbd8dsItGuPcO7F2mOM2cpwCyEbK%2FCIGjKZmzhwZhXsWeG4PzCOJGkQbwSPG2k6BgBHh9DQQUlnCIXOn454PSTttbFUVYs97XyVpeHiXbYHGc9qnwJtK7vXvrSFbSgj7UVhIpEqhxgWIh1eBrbbRbIcfnCsTmHa42HP6l%2F%2FJjtUlcsJLtaZrs6mtqUvt7Ty9j6a8F6kg0gB%2BJ7OFoBBodFfM3z8eIVVFnAJh2tr28%2F2ceSlvAQ%2B9V%2FiC%2FmYJqUTFPQWALE9ykSKEOl61InYE0R%2FzVRVxpyYAUCdB6MdVC0pVWkzjy3rmbyXwbLcoTWhzB7IKnIObqVCRolBlhyUyDtnUlK47BheWEMbtp1TyYBRX4xPBpFj%2BzDum6LOBjqkAZeNXfxgAQq0cpTaJI%2BMrrMwMTZnCUfwr376Ia%2FEvp3b2%2FfwytTjc80Whg%2BKZBmxptkE1HhgRsvAxBc%2FqIwxtFXs9y7zgocTMBIBbHrU27wvU%2FSNHY%2B0TA3Mysny9xVw9oM1PS7LgwnSGpdU0QTUTIIkojTOU6%2BV67sJQcQ5nIHh%2BKfcUn9l4h0v8VU9g%2B9BZ7vtfFOIKJ%2FnXbO%2FAOfxW4RsJhhQ&X-Amz-Signature=f38ebb6379cc4f458394423676a3e96501dd18f6fa9863628bab76772c4efcc9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BYRPXGS%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033728Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJGMEQCIHDMBcTUOmLRwTUbMeSsvfGhBejs1hI57H4UJttx%2FiU6AiBsealMFYfyYc0XcJZpHyRjBf0LTyrQgFKRGeI3eY3W3yr%2FAwgEEAAaDDYzNzQyMzE4MzgwNSIM6464hvf8zIdrJhddKtwDt7ftY0q63hthWcMxDkm0O%2FmabE6benSXk3BaxMHsZM9BBsPv9vl8YZn7dNiZLIm%2FPW4zjUHeZZFs9YncRZXqY1VYX8UtlTCTsj%2F06AH9XRnQijh7Dp6tJczGOlYmibQ2W1P%2FqngWB%2FcuqNVrVGdYHEtCDGNdDSG76fA5MISJfZZtOZ6sng177qi3f2F1ddfDzLVouZTEV99c2vLC9uCfScDnoE0wD9u%2BO2O8KUc9dd9%2Fv8n6vfsyDYZVlzSZIb%2BjBgNlHstmZ8Y1Dxk0lnLW%2FduUAQKSQ2DCEKqwVr2CRhewn50q%2BFlCwJNcDKdR6D2%2F1sWoiEtRXh6rNH38DVMRghujtP6CvHkyA1TM7gf%2F2JfFw65hNJ4o5PmyXjEOrOnUKRmUw4CUJkJzGUorLjv4bnIPtKdddRgR8bGtF%2Fd0ryEeTlqdd1Orp8SrOuLCNPHfRQfJU0Cjf%2FoypRCDR9s4GfI7TxJEaGceveEQDeyx8ipkyiUnhypZurRodqqItFvuFq8xsAYi6jF0DrUVsnk0Rqh%2BRZJRww7wPfLNG6pxSlLmvMTwAmaEi34x5hyWnp0I96RwdE6VXd4CELWfP6aZh0i05O4Tj5%2BHk6VYTzHGRp3XbNmBF5SatZvHgiMwsZuizgY6pgEMFDhKB4%2FR8hGdXM4ioUEFIqR2fORr9aNXxin9dwRNKmJQIkm0CKf3i%2FvndEUWPnzVjIxGF5FjlDj3VOHBK2EeNq8d0v9ibV%2BzYMCM0XLAfEKguUs9x8jpEo1kgdwwaj24p6t%2FneXjwhe416aBhmzqyddpHv9gbEO%2BDGsNDHFE%2FjbC5XXvg%2F6TNlwGQAihhbhAtHaQE1r4Y6TL%2Bg8KMHRXe15TDnFM&X-Amz-Signature=c7c7fc4db1ed8fd6f7d2ae612cea09f7a65668a3449d7bcb569b765d3d01e434&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SAXNH5JE%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033728Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIB4ecUlP4%2BLrCTdJUYxGUr8lBWvDumTyZK94DJXj0oXGAiEA%2FZ%2FpKKuZQ%2BaVWkmKlB0pFzxWOR2mE%2F%2B8vm5ZKE2kXjAq%2FwMIBBAAGgw2Mzc0MjMxODM4MDUiDDsgXbCbJ7igJfou%2ByrcA5Co%2FWpdx%2FT92q1HBZKqrnwg4Wza35stHmfyWRCA%2B3gHtTDwiSxHU0ZpjOHN%2FMoYbCck5EI7mkMF4vZefUdGt0vW1j9aYwL3CqdA72gJl5jgzoOOz4MjPdnemH%2BpM16GsjtDubBIPxLC%2FCBPBS9cxxZRdBdbjxsw9KUgh%2FRwYIA5esWW0zytLiG9EPwFdeM%2B6ZjJWmtk3kIqWRKbarE%2FofHWQu088tTlqwcfB4hwBjkmem099VT7nsE92zfd%2B08ZDToIszrKOI0w%2BZFo88Z1uiZrZFGJznmXkXqC%2Fcu6gdimL0ZTfV6WvTbLTih7v%2Frto5Or07jyJSdlz86NPBp9jOqtInXobl7oZfnP%2BJhdLBB1Z5GNxn%2Fj4SwB4qz5XfpZk0Cz9QU%2FD2rLQM0TRniSyOlyQXnLTJSuTpagLMLCDbW%2BUoefjEYmpg0tN4pomVXz%2FFJVyw7QslZpGGlNFckEs5ZclEQKJp8eCoouofoHC%2BuRb%2BIPBC2Ub4MhPf0cQMMS0OXf3yAuL9t982aqeJiHgrjkV%2F4jQQpNaHlXnXP11y%2Fsf3oiEUPr6ccZPo%2FFo3kmXxK59L1Xwc0tB3AvCC70MkN9KziaM0W3LqKjHFK4KetpNiHaL341EhVkvSb%2BMI2bos4GOqUBKJQXVG04mOclEbbjqJ3GA87hexpEAE9NZsLeMEWd3HdFlclzdpppYy2rF9jyaHskvmglcuT5Lpcxq9BUFra5BUuws%2BItbNcT1Mpm6Y%2BFGzpClVaIEH3PcWabTDlJuGVopH6rcJIHKVGOvOeO2gtUrchd4QCDWp4eZoBJXbaJXS%2BggP96JmhhB8cKqpqdytn6Z%2FwXUNBdF0tW%2Bevaf4HakM2TFHOQ&X-Amz-Signature=2f3a18e612b43b75787f7e13b1804cb9afba11bcdb83911eee65d13f32540275&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SB3PK3IY%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIQDHNFf738t2LgjSJFn458GObrL9umb0WytgXp8dCZYbjwIga853dd9gyxbbVE1CIn16G51wgyKoy0PuH6x8%2BFyIKxcq%2FwMIBBAAGgw2Mzc0MjMxODM4MDUiDNXZYU6%2F88W4nRB6XCrcA6hWyRGVrrkg54vpMZZo%2BenaFIwazqVLV6%2BKNsuYur%2FPd4krpXNC%2B0B%2FcDslBJq%2FJ%2FPK4BzCcCEZ5wkWAgwhHt7Z0gdoCw%2FrnQ5DHOGG8RjK7DEwslXrMOE9BrLoAoBRzHqIsAYn00h525E3BJqvmh2R1WoGmAm0OC8trMhH%2BnH0PCFTS4mwQXP9TtLIKqwN58whBEoMbPcwPhtbAingg1IsUvSpJbI55QnWPWG%2BJkWrlztIgaOyU%2FF%2B%2BYR0O4dKlCVOx5P4iViD%2BSwRytZi6ePvcOnWOiY5tP0oNbpwt%2Ba19kt%2BYC8XgvUfVxVnZXhc8A3qiokzRkpi2ftgPVAuNP%2BKnByEVjDnTrU0Ge2dTBFnYuZZ6rCb7XTfZe2yMPmq%2FQy8uzAFt9%2FcqBOEl1DpQj%2Fbw5HD1emUNY32xhxqnMXGGQnMyD7uKeXQOIxotDsiIYWqXEWi3QeRVxwBTAAVdLKcIjCjt5m%2BuAOIgq2Aok1%2FO%2BHL7ESnqjWHdyoKtBogzTkj8iIE9ksjyzWRLVrSC6%2Bnt9C785fkQr%2Fic9zXKXjizV2LaZqgqFHqBDlDw2iq%2F5%2B%2FzMUAJSAyrFLFjcUTCJMK7fjrqYMYz9u9p0Hh5FUjK9YsSzk7yGMi0ZakMOGbos4GOqUBthkWYM4Tqz8ENw6yirZ0ZNeTY6%2FsZQ3I6EQ%2FeHF6u2kMCTWhxJ1%2BvT4FghA%2FABGgEBek9FubQcrvw7GtkwIBFi2zJceNt1upyHoNM2v68VwSDO6UVtiS8J2VK9bwcXfwI0B57%2BqqUuYi%2FvGltUk0OMEl6B5RuLLvM0%2FBGrRtQerIv%2FvJbF%2B5JECsdU0Fb9rS4Fswf2oPQHAw8P0Egl5eQUXAf6wR&X-Amz-Signature=9365ca52dcb3d5df119b6d7f10e3387588a17e01824bf9d7d9bd0ada95d5d33f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667RWWZNNA%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033700Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQCS1D6FswHpwmNXJf%2BMBxXnACKs2kZT3tsG4dVaHtV0xAIhAJvLB745uGFISbI3dR%2F2YkOvhjO4U86Js8ebo%2B9c1stzKv8DCAQQABoMNjM3NDIzMTgzODA1IgzjgL%2BbWk3tTBYNbDcq3AMIQ4HDcGwtrw8qO7xUZe2K4459kqQNZf7qo9lesCAcpVk5YkeLgFVpEqu9BfsW9dRVbKz%2F9%2Fv9ukL9n%2FnIxwf%2BVXxRMJeTcElKNuM0YEvrP0LwW9aIXkf4q0nPJ6kgZ3vmCAAwjXWZ2ve4921nY3XPPd0tjD0pvdz8UpNm%2BZM9jylZf07BffiafyVzz4ppQSQlWWPmN3KRXjb9hkbOL4rBx0E%2FzKgV6XmCodDxbVSMQ%2F3%2BktSH28NfLvB7OKwKEIv5hG9hnwpZ0ARGgdRcu9mUhVrfYlOpsORYgMqYti1Hrij8ceiwUBrHCH3qHAnEIyClrF69BfnYj715kIylJ4zwZfvhEpLY93v0DHqtWubcSxXy8Bv0enXeymw5f7s2FOqEUqIXSToy%2FSMAf2WUsGV8dDaMo3oNrfP98nq%2FBCYqNrPfTy96CjyF1uZEsMLb3X6YWtDu2ZSCo2OsV8RAvILreK62eW%2BuCPn5FV8iohycLqv16NrH6I22g7w3vQXiTBlbN60TsVAZ5zIUYbRU5Yo7yUfjeVAMndmj8o4oCiRt4Y0tfMww4RVH%2FK9sPjMX3qncfoYU0vi9zcCUkTMhFMZlAz7PFujs3xDBgj7TlbuqKWHki%2BFEqpCpPTJ7SjDhm6LOBjqkAXv032INmyloEanI9cxiBK0YFZu81piPdlynMjmQkjvG1dvDWWpVbp4VZNyco%2FzSvzAYnPNP51yoWCJoIy3KNIdImvq9KsSQVsrgd%2Fo%2BaxxFrMgHBi%2B0OPjy2nHWBgyDAE%2BhtJP95WqK9N9nvBx8d%2BP1if9D1bzBVc7MVO5GtR10u4ihP5XkDsoYvK1ZJzgyuIH6dEklcIUplXsyNYx3HpIB6VZT&X-Amz-Signature=666cba8262a6de0937aaf96c35fb6d0e517ebc1a828102dee36233f9ee3079de&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
