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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46636AXD724%2F20260304%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260304T025321Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIH2IWQStrV8m48CnokenPcR%2F7grqR76XuWxD1o6td17gAiBfgapP9z4ZrLJuChL%2BFc0uIhoi2l%2BzRSfqohpPFLS8XiqIBAir%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMfegEEoS%2FK6ZS%2FoB0KtwDok7LZ4WrRY7BGw%2FtTQXFe4cGMPxCC%2FgOFYsEa0Anmc9irSDncg4E6%2Bja0oPfkM00UHTMG8OtA4K9txLoZiDmXKesYixlewVgXiAR8%2BMCUMzNl4wtu%2Bg%2B5FO09sIs8Br1dLdt7z%2BEP3VayjSGpD4g8hVWTWSaBd6yWUe%2FVyWtKrdTldV3Eow3d4%2BnLf%2BF7RFfgfsw7iaxzhxY%2FYm5F%2BirjKeXwYYJAYX4JNMz6MCMzB93E%2F4O1QxkbBQLHvXm77bf9gxq4V05mBG6eWShUSfOqHBAFtBOncHMSu4%2BuXveQAT6YA85ofTDg3DQSl6ihqlUfzEk4sUUgrazr5X%2F0qyN3g8LZZcYz0yaTfVvvW57LRTshtf%2FKnIh2B%2BenCygvkhx1raF7IL7gz%2Bzr1fIW8M956ex3KCTVbGT4jKKtVH%2F5fwa62v6y%2FPKNfDk0pn5MMs%2FlJqTNsFw4Gg75rvfmv%2B7nte76wUMN6IYqO%2FOzt582zJTtg5HcNnn0hPiSRjMwiuh%2F%2FEUx3Pup%2BKoYbh%2F%2BS7gffWZCXADbTRAiNZYZZw92UEWitZgkZKa1UMV%2FfPKpWWG55%2Fi2kodHqIBrqRu3mJ554vF7MJDDbEcxy7f8gOhP6LuddTsHNiPOoEgIT0w45iezQY6pgFfZXgc01CnnEQa1hl3DlYqYNnrk36CXd50PyY1Xw%2FXfgBoAyo5ooD1KJVGTTraMXDCCTS%2FrdJT90oybQtXw%2BM%2FgXJG3J1APJRx5LUV%2BiLuuRjYe7t7XkcLGpzyxDzazC4QTRRIFlke8VR87aZV0NFkFEEzCus2G8z4FLLlJfBZRCPVqJvd0PKKGkyaUQaIBBc2Dho8bZMaZaOFoyDdU7YRX8PsR%2BVl&X-Amz-Signature=3f5097fced13cd362913172a80f876bf1eee7d63aba60c10c71f67fc048734d5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XHENHFHG%2F20260304%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260304T025321Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICBfGX9JtvhBmURPb4jSjCLj0K5n7UCHrXuKLhjVvIdEAiATLM139BaMNTvYcSNGIDHxuLZGTItt8eKS138AP%2FXoeCqIBAir%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMNWsu55ryvcoagoitKtwDrcU50xTtIKy3bK0vgUow92uZNaB1uRqc0BAR0QFM9JGWgNSLyRjkppy%2FK48ZhGGw4yXl%2FpRSRPVUyAhB%2BegIMyk%2BJ%2BowrJtfSu1M6OrZewv%2B2kZoVhHw3tWHfK9MonHw59ndiRuaby3tYY7tXV9f0EUPS0GH3ArErWwWunxAcDZpurEAC6Yx1bfEJKPNYjv9BigpfTF8sa5Z3RQgtwejvYBFHwWcYEmDsoM2D%2FMTUAlJUeK5BpmTTHxsJKA7KoXiBACQHsHL27F9Bna31eJTmYy3TZIUnKLsMWYqFCHnRkKVfLGkkR14dMhXANSlGy7RP4TFVCuI4HoDgXm%2BPgyEvL4weepRpp5lGZmQFICJjPVZneJigQt5kAIZdyZO8wAhdDmJXHAvt4v4eJbHBDduHzCF5hcj8rwBfoibbMQ%2B2VHT40m5Nl1nx9GWShymjYevIsBoAEUk05qNWNHR0D%2F1n9fQ%2FrgA9WqGxM0lH7M6pubxsJFZggLFq9ZbOG7A2cpLOVADP91fcy1xqTLGd7bQWxOt2dcmdVoH3ebIParu5wHLJe3t2VyZ7n80uUTsmyJ8tLvKgTQ5s3OKBDhQp2ay5Fz5jPNssWzojTOm%2F0gwKBvfVj6Fm2C8YYNHGKYw0pmezQY6pgE11T0Hd25vN7zoZvL%2BerDwFPGzu5nj6rPx697HBy3Gqcg%2Bz8XpmMUzH3%2BLgjv4az5y33J0njci4st0mMdtF7k5WrfQm98KMvUzxDEhEILxemUez9o0exkgoxiPCb%2FbBXnsL%2Fs226ZFcpQhlYy%2BhFRYp7QD3ZHrE9uN1%2FTu4WEKG12LnhpXSyooVtQ%2FKM6M0%2FhF%2Fuj4Nr7ZBsfxrGJMRI%2BY1CFJqMnZ&X-Amz-Signature=4b2cad9ec41830b9fd178a329f6f15f9050e417a9eedf201aa9cf04373091f8b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667OY7FMWI%2F20260304%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260304T025306Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCsm8wJf8Cm5ZCwXHf3f620A%2BYaRyzMHWt4EP1o9cLMyQIgQNSzLqHM3g7BTLr2E%2Bx8yU3pIQjjQVGQCWuoRWKae20qiAQIq%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFk7%2Bems9SGBEFIQgCrcA36DHg%2FinlVpJj%2B8F8CRnvM9jGROEO4OJlefGPVCr1y8g56lGuO4iyLFwipyc9rxrevV18MqP0z0FKqb57VO4eiCOyBdDKDZIJIcsACPVdDLbRcabMUxJOpM14AYSeVUXSzH%2F4JehmAZUr36yHZCCTDCxoFVDed5P8KTgaU5WpkO2yFZ3PA6iEuBSzEeyQ9bz9zcrB%2Fs91lhhLiYaKkM9Nbcj5DAYno31UJJ8nL9zT5858XTckAK7QOog7x1bUruFZsm028u1fS73GhVDYQysGIk79N9FpjKUaveTr4VfxqjMjcWo900A24ltTADfF%2FdLCVUvw3%2FIhXIxVhtAv5eT7IBcasqozHCXqh1zCpPIcxdO03lYDpIAJufS8hqFP9rJkcTKeQpJdyre7bYqrTdUNCAs8ZRjlFM8a8TIClHw0dTcOqo8S1j1yds5qhYj5AY2Ef07KI%2BIC7B7H0IHh3vJDwsVy3AJpMX3K3JH65NgbWEy692S6iz%2B3QpYc39zSXdrvd%2FLe3fpFxNYYsKmJs1csQjiMvBDtAeb9liNLs8dWdvw4cU4kYqJUQee3qg0BgjxoCoG6xq6P2cOaHFCMmCcktYCaCe%2BDYnK0TjOhab9YOwb9e8EvQUCoyx0d0PMJOZns0GOqUBE5HQH4pHtHaNpXZtRL8%2Bc1tWFTxn0yBsBvlpApkRMkph5NSA%2FLwz8MYR8GTCet6BX5fRBwW2JPImfGeUDtxqMlHSJ0U8hG%2BwcSHgO0cHtfPCYDxehL%2Br3U2cK7Q3CJS%2BfR9I0xw7iUheFZsYAhhyfdriZtx%2F6k6CYOsSn9oOHOHlzpE5i5UBZ%2F3FaPGPpAJBiqo1%2Fe0Yf7sjC5H3tB3AvHk8i5te&X-Amz-Signature=4c8fde0e9798f6a7b0281399a40a8e1cb226d38355c2eb525699f24e7b86b18e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667OY7FMWI%2F20260304%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260304T025306Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCsm8wJf8Cm5ZCwXHf3f620A%2BYaRyzMHWt4EP1o9cLMyQIgQNSzLqHM3g7BTLr2E%2Bx8yU3pIQjjQVGQCWuoRWKae20qiAQIq%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFk7%2Bems9SGBEFIQgCrcA36DHg%2FinlVpJj%2B8F8CRnvM9jGROEO4OJlefGPVCr1y8g56lGuO4iyLFwipyc9rxrevV18MqP0z0FKqb57VO4eiCOyBdDKDZIJIcsACPVdDLbRcabMUxJOpM14AYSeVUXSzH%2F4JehmAZUr36yHZCCTDCxoFVDed5P8KTgaU5WpkO2yFZ3PA6iEuBSzEeyQ9bz9zcrB%2Fs91lhhLiYaKkM9Nbcj5DAYno31UJJ8nL9zT5858XTckAK7QOog7x1bUruFZsm028u1fS73GhVDYQysGIk79N9FpjKUaveTr4VfxqjMjcWo900A24ltTADfF%2FdLCVUvw3%2FIhXIxVhtAv5eT7IBcasqozHCXqh1zCpPIcxdO03lYDpIAJufS8hqFP9rJkcTKeQpJdyre7bYqrTdUNCAs8ZRjlFM8a8TIClHw0dTcOqo8S1j1yds5qhYj5AY2Ef07KI%2BIC7B7H0IHh3vJDwsVy3AJpMX3K3JH65NgbWEy692S6iz%2B3QpYc39zSXdrvd%2FLe3fpFxNYYsKmJs1csQjiMvBDtAeb9liNLs8dWdvw4cU4kYqJUQee3qg0BgjxoCoG6xq6P2cOaHFCMmCcktYCaCe%2BDYnK0TjOhab9YOwb9e8EvQUCoyx0d0PMJOZns0GOqUBE5HQH4pHtHaNpXZtRL8%2Bc1tWFTxn0yBsBvlpApkRMkph5NSA%2FLwz8MYR8GTCet6BX5fRBwW2JPImfGeUDtxqMlHSJ0U8hG%2BwcSHgO0cHtfPCYDxehL%2Br3U2cK7Q3CJS%2BfR9I0xw7iUheFZsYAhhyfdriZtx%2F6k6CYOsSn9oOHOHlzpE5i5UBZ%2F3FaPGPpAJBiqo1%2Fe0Yf7sjC5H3tB3AvHk8i5te&X-Amz-Signature=867c6127d4201d2229c34d4f20932d0752b7ba55d7250cc8e9698bd4ab0090d5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665Q5TD72M%2F20260304%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260304T025334Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIH82G2DMnKxKgGJZthkMR2uEz7d%2BaIKTrQfvBdyl2n2EAiBfY4oiMAulzEcl7nJ9D3mGavlofbd0IcnQithFHTOHKiqIBAir%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM2UStGOH%2FWKlEUwJlKtwDdULsJJ6UslGyKZbj66EpQ4X6gfXbzuFQu2diDST%2Ba1z%2BvTDoyM3EeKxNrfUZM9Pc8T%2B7BoOecO%2FBwzJ1xrsqsdqtEgXwl6S0dEDa6JyX%2Fhk2qKVXRTaQFk9a8bzBSxoIxbpqWGHCnAZeG96jZhYXMAIjd%2FSql9KayhL6tIqS3xkIBIwa5WUPL4RLrohQbUhNJvp3u478oklyvpISk3s8OtP79oaZ6ZWilTDA3PYmAjpI%2FLHxv3gmKYh6xgvt6s%2F7rn672UWwo%2BGxYC6kp2hCBHGhk6815Re00pioVax%2FB7tfJh4SR3n8CzeA6ZnafpF9O9eqQ9SFwWk39PUUli7jDrc9lDlM4oAfzZxlJiYB0wyyDUs91n8C%2B9WZvsglUqVtAWQGA94j37BGvK37wlCA5boS3Ksp7emL9OMZNL21qtaladrfphFhD88%2B1wpwBUn4HwuSyIMrAT0zSajhwDT3pXSPcUGoi8TtnQ01Jc3Z%2B0j6NxU3oLLMrOXNbjrlGhkyRcQQnRmynw0zVC1ob5iI25V3L15oCBw%2FxOyXPTckc%2B4r%2FR4VgZYaCAh8Nw%2FJQ8h0v8oJEVhWLZ8lIwa%2BUHKxTtuuaNQl5E9UkUW3lB0UcZXCJb7S%2F%2BQv8ySRd2sw1piezQY6pgECJu8jAi0BP8FQ7Av5Bwx6NcoCw4z7zVrVldZycFq3FNuzpv%2FwAqm%2FcYECgTUtNV1eFQkN%2BdnXhNN0xeJyB3OcSeJ54rDo2DbXuCjSMp%2FTRC%2F8%2Bslj1LtXxu6LFoTWsTUp7Po3jG%2FtIjMZ1MSYRVwshixPC%2B5Z50e8p3wHqNkQCmBUn2%2FGYsEr7jyHLWNEf5QCdsIt45U2n9HC0Gg3rLfUNNmDPajv&X-Amz-Signature=c846fcae8786cffb69d7638157909ee20675d1a9a97e0e20390ab231f24f7988&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RAZ5KREE%2F20260304%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260304T025338Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCID08KrxMwqnghwsDQg5Yr40v0YJ9%2FuaB5hO%2BOmIjlVTuAiEA7wwWVOZSCko%2FC4gn%2FfOCOTYOfcFg41KWK1lv51KFuUYqiAQIq%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMygUdskU0mYHCtFHircA1TK0mi%2BepYLPH3V28mk491SAWVEUhrU6FYqI3yGpKQLkhwJbi9j6WXxy7mTWeV9PL15vAJnFHJi4J6YtUHy7GwS5g5vyBg8Z7egeg9Ggsp3Qcttzi6Ynw48HXz8rhOhaDehEl2act4ouSpEmGU%2BKyBrz7vCokP3AydrQc3dzfr1UnVHap5mIgm88yvqjfpRw%2F7FRufnAr8PWXcFoRp%2BSGVq0YluprbKbT%2BtcBNVHmZQzcjEFAiwayTrX2Ze49opi9uKsqJLa7cI3pUkwHTJ7Sg65inYKdpvq50mkNh0etT%2BFg%2BtN%2BrvFmBdZHJBaDGgYvgYLhgRS5BaZoEPe8IbXryvC%2BapdO7tTWvxlwlUmSNgakmqIME84ft64dDKgZNhu6Y%2FZHZx%2FrKnf%2FT%2FVDBXaJCbRhsUbs7BzMCATDJhKlz4y2FoUlLvp3HRL79Xh8mShFkzRkiPPfrSQFGFpsEJMqY59AhnyqmuSReMf2faFCR8RAy0T%2Br90uAymPFDqqqDyKTxgFCJ1smifEuCHw6E%2Bp1UpuyfC2ZaVgCpxTkZ1PdUyEKitXx85dyQWB3eePpPkPNAnKHYvwHpZ40seyat%2BX%2F%2FI8C6xbAXNMFWe9CdfY%2F%2FxovVzS2NV8G2mnHiMKKVns0GOqUBgw3f%2FFIAhKs%2BYYDEylK2uu8HmcNR3%2FZWK5fNNxNLip3wUc%2B0a58TP6%2B%2BK0EgZUSR24SDpEaqTbiQXF%2F8s7HrzvuAvb5V%2B%2FE6THyAdJFvEmmhLzrqZM7w6GYjiFicbk7zZzqFi0JfLD7eRiIzmYtg1%2FAAWpOOgFV5DUuyt76R%2BE4iEFonyUZ%2F4ZIa9P5Kyg6No7e12%2BgO4855oSoCq%2Bxs0hhZV0b3&X-Amz-Signature=119cce9453b8a6040d5a914969d02651488be0b77447429eb12853dd48130bca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667UWFSKKL%2F20260304%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260304T025339Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFCVDZ4Qi0HQ5tuwZOyZLfUwNmajQyf5fBpdl8j95VgSAiBTVL%2FGaS519HCH5FiHsgs8XUDrR%2FpVNkawA6GeiFZJgCqIBAir%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMluxag5b%2BjbCs58BvKtwDA8VZ32iscNpo2g1Mi%2B7c0XztsmQKN2KgvpgzyF0rfpER9pa10Z7kwH6DyQb1%2B2xZb7yJipnDx0ZPQTa0s9%2BVc%2BO%2FJdWtrFnTul7GM8I609ZoFjrwr1Fnwm7Facj3l%2BxcxkHIoPvhSTz0TwJswJ46UYYM6EHTt3l2br%2BlNwvIvNzgMhD2rBJYgWVfWm5hYBYDJ6rHJ3vIk4oWELmHWbAElpSRAN74%2BdzLoIwkt5i6Fa7cXh2DcZw%2FDzCfqieMdMEopVj6X6gXH9KsywG9NxsORSceDLrXlBqG0F90Ri1ldWhQaKPG1EczsWFN8ylsACxwQiQUbeQSBfmvpf7WJfxW8yxqfVybwPa0EUSHGedkop8xBiKU2u8Qopv8vLQC3LPzm7iXJxNOi65qxf%2B%2FoYP4UZ3gLSxHTMexFIWr9YU022pU6OBf0z9cOLW5YNyCp%2BeL%2Bx2ZEQ96lLPHrnx1zgPE%2F24MwGeppxRU2ksGDIRKlJWIhV16PhtnkaafIBVDOqYfI0Je99vNP23DZRDGUt4%2B87E6HHZho8ZrOC0WdBhoUcV%2FlCyn%2FGwmI9EyeMI%2FJyTGUi%2F3KxCJOFZykOudzU3zKGDJPMnbRZHLEUivINENr6SrnH%2BeMtNZpoL8m8owzJiezQY6pgEhwiJGs0tCJokJK70pKEVsQNXWbRPCbXS9lKXUyexgfRdRztx%2F%2B5dZ9RN1s613G1Z6OBCTu87Z7JFk9Xkj6L6mvlWU435icd7CvK%2BEnGRwrIm%2BI%2BkImpkF9wsOB9nhSCzC97sLNSN3SgsCGTwrCTg2EqRfk6H6QtUrrUgadAwZjW59Za34zM0Rg8AhbnrYzxKwt7dWJ%2B4y7ng2kiiWnEsPY08tTvia&X-Amz-Signature=121ec43291543ce29d8912fb5c7a05133c46d1c2238360fc306caefdeb0e54e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QVEFNWD3%2F20260304%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260304T025339Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDD8cpS3D7Ixp4JtPzyEPC6X94axlAlh7sRZBzAf7hlYAIhAPOXiHswB2ThmJtwPMS9gyVkEZJc4rewABAe%2FLgldZ9XKogECKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwRajx6akQLe5IER6Mq3API6EyaBdXiLWczfYH4enVcgLy0xxenaXzUE9z%2BdLJ4FC2uOJRcI34SQeLtPRU%2FOem0zsdtmQEjj%2Fl6DPjpYb42VO8B0Q1iF9ca4e5SP28Z%2Fr5CR%2BkPkCJLVUJNL4NcDRlRowH30fs9p3NJrt%2FkbZuq4%2Bzj0DliQeec4vccYsvAkzR8Qn60wExlh%2BnvlB7HWQbwhgwbvqmjIvt11WWpTkuc5OVMEJW1D1iqgDsOhV%2F57oIPeIA3aFyX8Dzzyn2MLxtThDbqWEzeivGPPqOcWYW9AGSp73PeopJsZD4DLwu9TyIt8vTRzQXHwxNP1MpggtRUW0WMisnxYLj3IKEaVuruVEzkiZzq4rDnOXQ%2FDYTuDHUpasoWGPZiX50t9w0ewPgmAQLA1Tt9VPrjgAShXj3PYp5yE7sdCV14UTCG9LuUlagXlS28cGELhomaL0XAMkl2rNtUKgX3Jsuv9dhXrFKQ8zTnw45ltCClXDYKelSfCyzxZOcwjGU4PtabfRriA7iXJvLOzjEL4j%2BQLoNIuw7KvA%2B6uPyQb%2BrirQBpXpTelVbHs8vVOwy2R7PBwxOo0dipHmK0GGxX8dnHTjkKDxEtSfFTcgSqesWVGA7Nji%2FcqOj4%2BS1Yj1rW3PMzSzCamp7NBjqkAfDXdYVIz9CWv6UYG72nKmSJvD7yKm4ah12SI1%2F69j1EcdwxtmsJEaWEsOiaknkSaRz8dyBtSia3uQWczF21A5hCxNCMCL9UiDrORr2%2BmBuTYfwAxA8AQpQKBhj2UCgL10uOdDVdHIUfeKCs9ORPuKE7brlFyAssiToBHVdYA9rLiOw9B3SyCuI%2FHPbT2UrxG3MgAzE7YvVHpuf%2BtZ49TImE5MhQ&X-Amz-Signature=bd802c97b163b8f5c0c1749bd48c1a7dfdd2b30ad10acb084a991534ac2318a4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667WGOJ3LQ%2F20260304%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260304T025339Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDXJIatsFbQk0cohgMtVwvwwlAc%2BbLgSqB%2FOK1lZIItKQIgeTMGx5srpYT2ApdipusOiUh7R3L%2BjHxLxRM5SGZFs0gqiAQIq%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEWPgsOem9yop%2BzM1CrcA4KvZF0rwcfkr%2BKoqzPaAvMS%2Fom6usE0tCAk9qcXHa8f0r5koQiE80FICgDF3%2FLHZHiCEsFWHw5K3l8Vs%2FENYzYZoGFn%2BuNsAd2BT2cdqb5eKYiPkb3vbJIjNmHb6PgVezpZCgNea770IMkPcN8VBCOMR%2FOZVzh9Li51tastbcYaGIAdYoqYk1%2By4tioQUJhr4VkuX1S8HpMzZffEgqXuKnTau2UhJNbUX%2BTjl5xpvSEJzRlE0y%2F9HgiG2kmXSVJG3jW6yuPdMd1VygUybkQNnypXt2xUs91bJw6RlhjymXv%2FSds7xKvXlhzQrbE5YPzQI7gV3McPHLJGk8szVfSVD2xpaPBDslKoh03zFAiFniXiqgo2c8t0xWyYgfXnbmXL%2FoWHsaAxEUinsmjZeFM9bxdaCynai5siJdE6NkRz1jeZG2ffgkkSZ9IXmhrFPujsNVHWnzHHi8%2BehTMIww4Kjod2pjX4JxwFvnSJTa7MPXK8dhaS0owc8yyxOL%2FekEM08iE2kKyCvIiZn424VCQQEfg5J8oBdCYPqaWnrjNtqZUv1AwGo%2B3DTLkSuY6Wv6%2BxxkUwO1kOS69tEQPqT92U2%2Fao4V9cshlPE6CNd76WXFITjW2vcLszZlcw%2F39MJ%2BZns0GOqUB9k9Bjco8NiTonaI0tio5iiHhytbFQdFOtARVTCf5GhNJhZM2ohDe8Ex9BNKjL6dgBrPiGEYWewHkyiEPAeIHprQFiLYThb4qWo0kn9dvJImD50cv%2FJa8m5HT33MckzsHOdX66aEscnNakVoxEU%2B8l5w7Zl5vXlMlWuomOP1zC3dWsoBhZtjfE19e8KZQSSrz%2BIGMF9CPOT5kaV9rRiX4CjzcWK2N&X-Amz-Signature=756d4facf8602d224ef4e6199509acd044296ae65525f91493a9ba1c7b03f165&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667OY7FMWI%2F20260304%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260304T025307Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCsm8wJf8Cm5ZCwXHf3f620A%2BYaRyzMHWt4EP1o9cLMyQIgQNSzLqHM3g7BTLr2E%2Bx8yU3pIQjjQVGQCWuoRWKae20qiAQIq%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFk7%2Bems9SGBEFIQgCrcA36DHg%2FinlVpJj%2B8F8CRnvM9jGROEO4OJlefGPVCr1y8g56lGuO4iyLFwipyc9rxrevV18MqP0z0FKqb57VO4eiCOyBdDKDZIJIcsACPVdDLbRcabMUxJOpM14AYSeVUXSzH%2F4JehmAZUr36yHZCCTDCxoFVDed5P8KTgaU5WpkO2yFZ3PA6iEuBSzEeyQ9bz9zcrB%2Fs91lhhLiYaKkM9Nbcj5DAYno31UJJ8nL9zT5858XTckAK7QOog7x1bUruFZsm028u1fS73GhVDYQysGIk79N9FpjKUaveTr4VfxqjMjcWo900A24ltTADfF%2FdLCVUvw3%2FIhXIxVhtAv5eT7IBcasqozHCXqh1zCpPIcxdO03lYDpIAJufS8hqFP9rJkcTKeQpJdyre7bYqrTdUNCAs8ZRjlFM8a8TIClHw0dTcOqo8S1j1yds5qhYj5AY2Ef07KI%2BIC7B7H0IHh3vJDwsVy3AJpMX3K3JH65NgbWEy692S6iz%2B3QpYc39zSXdrvd%2FLe3fpFxNYYsKmJs1csQjiMvBDtAeb9liNLs8dWdvw4cU4kYqJUQee3qg0BgjxoCoG6xq6P2cOaHFCMmCcktYCaCe%2BDYnK0TjOhab9YOwb9e8EvQUCoyx0d0PMJOZns0GOqUBE5HQH4pHtHaNpXZtRL8%2Bc1tWFTxn0yBsBvlpApkRMkph5NSA%2FLwz8MYR8GTCet6BX5fRBwW2JPImfGeUDtxqMlHSJ0U8hG%2BwcSHgO0cHtfPCYDxehL%2Br3U2cK7Q3CJS%2BfR9I0xw7iUheFZsYAhhyfdriZtx%2F6k6CYOsSn9oOHOHlzpE5i5UBZ%2F3FaPGPpAJBiqo1%2Fe0Yf7sjC5H3tB3AvHk8i5te&X-Amz-Signature=ccf71a80179c3d94e8e1ccd2d8a103f4b6f25ef68d6ddef7485b8798b7e3773c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
