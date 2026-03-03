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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ULOMPZMS%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031932Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDdz1G0nbUCeCj6Vms1Qm7Hf09THB58iuDWpLLBTilUXgIhAML3SbU%2B7FrxRKx4YB%2BOxzrrhuO7%2BzFML2VKEwDVPla3KogECJD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzzWvHGhoZtrUlmGzAq3APEorQC5goEFENrLoqUtL%2BL9b3YwGzFOYeoZo7ymcdEWJljgi9d0Z1MLrtAh3ZmKDKHHv77DSfZBIFRujacQhVxMnsYOZLa9NRv0RDG5xAzuoWp4l3KUloKQqHTVbHpOEpkSuJDAAMfMU1kdUyz0wbRVqJPY1kUUKdev684zycCm%2FjWPJMP%2FTJmxGsc3Kv95OY5VPPIgOYeLkick1Yozt%2FimBjgmxTAfwQKEO9E31xVpYOWvE8ElprniWMtIdwtfNArW1KzQVyo%2FuLeK4hi%2B90a7RrogKNiRjhM5UcCK3JN9zxS7vFeSkSaVRImo9zSv4OZFKpAUw2xvrAB4JD9QrWROzuH64Ipz9jB5JQE5B2mIo%2FU3d96HnJZnsW7sbgPzl8iq76kOo4UuyIOrLnpK9WzfwKXTfkWulM71AVf2%2B1M5MZSgPPAUx8ZsCWkYleCs6QLGhZmHsLpT2BCmqmQE%2FAaS%2Bg0P8LfvYlFmGH%2BbuCXsrZN2viDK8N%2B6kgGxqcyLSf3vXvfJG%2FBRVqvF8jplRM2SSj0qVtFHvgl7Z4cq8kWkz5ouSea7HrAzma8MnFgdsEjIrFJjehHaH0nDDIbn3sVdcpXl7RnI3pogjwicRWSqDezm2H6qc0XlIoRMzDTtpjNBjqkAT8LXDLXq3yvD2Wc17j7OVNox4AjhX4oXd9dGbw6YTMk9nr1sjcfLpaVnySBToUy7O9E0jfYi2NIN5I3OIYK4M96IKMTag9%2FrzLmK0K64HwUUHP9RNRCLVzRMQHu1TtOHYBRDlR3fxzZJ3nAmtYoMrwWm8HxZJ3vJggmmMRjnUtUOpLcKx1d1ZjMW8D3vHJoAmVaO9DWM%2B78yhPBYzz5JnkJu%2FXX&X-Amz-Signature=68a4b53b1aa4aae3a412b39dc6ebd3bac9539e50c5d954f400674a1aa351bff8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667AOD5AYI%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031933Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCaHzgpVGoxuZTa1ceVhd%2Bk62NF8fDk1jtrFolGhccLeQIgLMrUoTMXvGVmT31GAHBWbqJqdReBTOnbXPoZC3OsUIUqiAQIkP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEL3wZqtcTsDJ76XGSrcA0LlHPp9bDxk5WAlolRmVUZ%2FjqGK4uWGhpNbD%2FVETqPwZB80hiWShXx0cF1plubhfaoNvSNiLvjJKYWqrf8nR%2BgYcvcCO%2BLFsWWiaSmtW48FoOswGV2aa3KKfdOzBdC9F6k24KuIqaDq6p87KSjXIkTjd2I7ffJ7bZsJJx%2B8e6pza1mTWsYBOkv0b2FV8fjZk3UMaf1NM3ZBoC0GZqAkttWWR3AmAt8TKQle%2F4Gvg6LDbrWE1f0%2BlTvMzrBNOvjIFtNtxvItSGmsX0foWLtDkWuxYxtCeKTykWTJyHuK%2F3vp4d6u%2FwywOENa4BfocyfVhtPNb6puWSz7VHyqX7uBonEFXwnJFzvc5d6CzY4YoXiPTzQUTSWSzbPL1%2B4vhbumIqeqwETQpV2%2F%2FM2%2FuS4qgQwk33Vmx8abJCagC9oQS6QYCK6zTe1%2FJGlAi%2F7bcJHHZeSy7Rgr82BnjNezaq5dzkB9l%2Bkogc%2FSeA2Pmu%2F7fyKisbvRpY%2Fb35VzJQHFx22f6yyTx9WwUwa6XA9q%2FNKUvXxBiCO6wa%2FwTvIxD23zM2Uln0Wm7r8w9LwW%2BxZTnIw7ED86yT4%2FMlwy4%2FKLBxH8PqNK3rmQZQLA%2B32rs1I04S24rP3Tm4ymKrr2FdEPMI22mM0GOqUBQfnha7DxDe4Y%2BVDJV10GrRh6fsqQ6RqlZkq3uydxRfM0JJQn4STeKKuItN7n2jjtALpnnRjpscQlw4euoRejjcNBngv59WpmVEtS9xeR93AUF59asKZDEkCVO9Q4L8RxgHecC7hAPjSUgbRDkys8E4joVqUwiclhUccK0HotQXYi9rfPNJV%2BJ4I7s93GXJPyFzLcb9L3IxZz0GyQnSDmhyxQt590&X-Amz-Signature=21140409483e6e2f9308a8ce8dd2b12a457278f1ed372cff31f8370e201a4e69&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJUBK4HH%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031925Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICMlMyC%2B0FozzdRXDM1j28O5bWt6d4C5UlmHetc7ZYrHAiAbEXw9H9WXmQ%2BO5RlahyHMzbRqvFLDTDzyRvKBoiQ4kSqIBAiQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMbY%2B5wmIVYOH41fBMKtwDp8e%2FBJe%2Flw%2Fbvb%2BTPm0XPRKy6JoiqzVdgqnacM6slD%2FLxmfyQZqANyODIxSaBqLmbY3QXCCEgLk2CgzfHgvSL3XbHXhNopeToNNELyLLvwx8DxV20Ha9x%2B2ZQ1Pc1yAnw%2FTVoZdzKnpdk3Zv8x6qRldGrZ3feToVNkCSCGLIO7DdgAI0mknyC%2Bfbv6%2Fp6kovJnMZoedYw8oSj035QTco1d%2FqQBl3uII5%2B5vCUxpYEsFN%2BwUycvU5ru%2F69Xv4BGKRiEWuXIVpjJcV%2FWMt3W0lw3TOji5SG6%2FEu%2FFOckv8Ln2TUvSxkRM0ReeaS3HPo0eDXjmxhJfeBkrYGQYdKPz6G2gPKD68nbN0knsD8%2Bj9pPZdLmScP%2B04Dapy7uTkZZPFJKYJFa3MPgXa2xapZBSCTOXLuPTtOE5iTcYeNuoeYoxo21%2FZ8NSHN89bmsnEgHb7vZ7me1AQPeqQlWBnJ1333qVfD0E4NoFSfjuq2Z%2BF1OdnItH%2B2D4oSwDwiyN5p71Zy3K%2FFVhvsHDgETnOZZEdVeXYdgpGP%2BAlVPNNMIfQl52ROclaII2bOqq0iIQ%2BxF8d1axOo87UXgorLdrGDdokorefsPxOBXwt%2F09z6C8mEMt%2FKL9pwpbua%2FjdXwYwgbaYzQY6pgGGXdeWycoGAd3fYRxAd8j4bLkAIlcZx%2FH6pVhYGH46xHeASY8IlFdse6jj7pAGhVpdRqAs%2BT35xnu9%2FTsXEIfkUbBygcr%2FUMJg4ylKvC%2BaPtPnznKmFlb1zwufo1afu0JWaQGRtBflJFknEvJ4TBjJDinDaVi8Qms%2F7GqkbFZB5u2aLkvHjdC25uwbOZqi%2FbyekhDzdmBUuGVcHEWwNnoaYSrkDzio&X-Amz-Signature=48a5e05b1f2cfae8c831b2221e7214f8f9366cf7298f0deec9e864186a9bce2c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJUBK4HH%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031925Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICMlMyC%2B0FozzdRXDM1j28O5bWt6d4C5UlmHetc7ZYrHAiAbEXw9H9WXmQ%2BO5RlahyHMzbRqvFLDTDzyRvKBoiQ4kSqIBAiQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMbY%2B5wmIVYOH41fBMKtwDp8e%2FBJe%2Flw%2Fbvb%2BTPm0XPRKy6JoiqzVdgqnacM6slD%2FLxmfyQZqANyODIxSaBqLmbY3QXCCEgLk2CgzfHgvSL3XbHXhNopeToNNELyLLvwx8DxV20Ha9x%2B2ZQ1Pc1yAnw%2FTVoZdzKnpdk3Zv8x6qRldGrZ3feToVNkCSCGLIO7DdgAI0mknyC%2Bfbv6%2Fp6kovJnMZoedYw8oSj035QTco1d%2FqQBl3uII5%2B5vCUxpYEsFN%2BwUycvU5ru%2F69Xv4BGKRiEWuXIVpjJcV%2FWMt3W0lw3TOji5SG6%2FEu%2FFOckv8Ln2TUvSxkRM0ReeaS3HPo0eDXjmxhJfeBkrYGQYdKPz6G2gPKD68nbN0knsD8%2Bj9pPZdLmScP%2B04Dapy7uTkZZPFJKYJFa3MPgXa2xapZBSCTOXLuPTtOE5iTcYeNuoeYoxo21%2FZ8NSHN89bmsnEgHb7vZ7me1AQPeqQlWBnJ1333qVfD0E4NoFSfjuq2Z%2BF1OdnItH%2B2D4oSwDwiyN5p71Zy3K%2FFVhvsHDgETnOZZEdVeXYdgpGP%2BAlVPNNMIfQl52ROclaII2bOqq0iIQ%2BxF8d1axOo87UXgorLdrGDdokorefsPxOBXwt%2F09z6C8mEMt%2FKL9pwpbua%2FjdXwYwgbaYzQY6pgGGXdeWycoGAd3fYRxAd8j4bLkAIlcZx%2FH6pVhYGH46xHeASY8IlFdse6jj7pAGhVpdRqAs%2BT35xnu9%2FTsXEIfkUbBygcr%2FUMJg4ylKvC%2BaPtPnznKmFlb1zwufo1afu0JWaQGRtBflJFknEvJ4TBjJDinDaVi8Qms%2F7GqkbFZB5u2aLkvHjdC25uwbOZqi%2FbyekhDzdmBUuGVcHEWwNnoaYSrkDzio&X-Amz-Signature=4abdd2162595b113240cb82da0bc8d5ef60cf4e7a9f0cf5f1891e87c1d436665&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QL25IJWH%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031948Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIQDo3Nw8KEHdHJ5i5krjU9uy1uyqsL%2FAM8waeQwo4QVzigIfWSz7lLAgjuuPQZkvaRChhfT6S48JR0pIrpcH%2B%2FtnUCqIBAiQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMiaiwPn0UhP2V2RZEKtwDL9iALmZzVVq10IAA2fbf9ldG%2BkCMQkISa6ZMZAaVBkppckaq2uN1ce3TrhZk7eHaL37dlWva0eaMWsJpmi%2FmxXC5p9kuWdVRWSFU6jmbq0RX9%2BT0OGOLq3i4OLRnWw7Nmyn%2FoS8hp%2FnFevaSKu4ynfEEtv08U1EreBcqIrYiAO67BV86C9pPUAlgD1WlPFoGkUarzjOQYI9pyuJ%2BUJR%2BbKC4dJopTPGQOHgrFxx6waO1CAis6eJgA1v9JtKE4FKaTLkNzYJufOj%2F8dj5vOCyDhGuIUTFo0ZSOypVG3hHm%2F%2FAEaROsBfegw%2F3s7kD0yK%2Fj3Tubbtx0uHc8vMhsS4EKisBhyMgcQzkdmfNZZG%2FXI81mefzQoWpESCH4ZWny3OotLRQvuihSjYX9tlWVtIO7K8knS%2Fz5RyCdqGmcXnNcCxgAfLUJp4z44F%2FpkOrGdO7%2F955lojqZsXn7cWH%2B5EFVZOWzDSQbvDfS%2FWjTxW2uKsf5Cn7eoDwQQVpTb4AmVeRcTvGsRdltfGWCI4jDdDtEOGeX%2BNns35SRl290pzpQ5jgfpfJ1y%2BIZ%2Fv9yD388pLRZKY9ehUR9iiFYUwEKVBFi%2BWsUBrJvo%2FERESnJXVeRS83CMemPTdpfm55XZ0wtLWYzQY6pgH1w0ZNTnR0M2sIWM%2BZNEFqCQtgKA%2FiGap8kUgho2q6HHdcMIJKml93IJrzLcOWY6eMBonmANdJ2%2Foz33GL6CiNhLO2XmfCcBxfWMJEj5qgQC13QW3tPXMPcHK1V7QcuNZksoFEFJmOToKl2d8eIiUH%2FyLaG2ER%2FCyDYvDr0zcHjGRtDepH6xWbhlgcthjzvAWqYpPMHKgC9F4DeOhJcT9PiOYMO%2Bho&X-Amz-Signature=d6ddd72660ad2bbdd7a4a7cececb2e42484e6139549f677e731d824cee936d6f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667IKRSPII%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031957Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDFF4251hkF0L5CjGr6PnN0zQ9RVASiYcfP%2BRUPk9bVGAIhAJjuJljVh1ev8Go0cZXsOYA8wionO2TUeCC0nH84OfVsKogECJD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxumulLeiZl06yeGlEq3AM0FFWGVuyIFrYzRgxCGnd2EWC8Gx2aj04eVcDeKy4Uby9cOemUn%2FjHBpx7feauhOTCSvFnzE5oxlm0EbSvFRSmzawz7YJPAvhz6fFRDK8d%2BlfOsh0LGZw6yv5tEi2Pwl6IWkPrgJ9unJ8fj7XmEYwho%2BjOIqz3OT9m5wlZuLxeRaa0atZ1rB1TWBn2EY01NDH8StpsR5XO42kU0vx1kZb4DjurLKwicRP2kfTnp2hUGL603Sxobn2h8g5fNrZApL%2FF%2FVMu3D8mwqWW6pQt3Q%2Fkn7r05TVJbiJZBWBcOWe%2Fr8ftvUVOIjOEcW7LjELj9odtmelaKdlAwonKnYtD0h2A10mMr2glIQYjL9%2FarnvX0cIFN1tKFxIbRx4LNOtpKbN2qI6n3mCdCquqdHx3OXqqDCUi8JV7qhvfadDmHSF8XFGZs6Pwtpj1h4nWz5QxUFHKaWLoReuquFgFlPH%2F09EGpwAyCinfbxLhv%2Fe57blAPX46g8BiSr8hajZrQcofWRogqj2p500ieRkSZCaT1iRRPpgCFgbXbPdtzVxhTHo%2B0g047kOfLmNdqt77VR7UyyM0uTFaF0XLnMqmOQNG17WaHziZ%2B3smC%2BfCLvndVZER6syGYw0adaYQvzNtzzDMtZjNBjqkAb2d9xjqiV5Z%2FWk6s3DnI%2FpiQ7pHFsw9x8S%2FlNTtDMbltkpAlEABv2mNzEtEmA3fxHYGv7fWQ%2Fu7%2BEAWhB8nsbPl3aTbtO2HtHGgGwir527oz5G5Er9HDkOuC4Cpdua7Ay%2FlQDKx2HTTlEy2zL%2BZ%2BQogYVK7NUTDcy%2F8wtuKsxvbaZltLRxSKFcjZbQE2178Bub5OUq%2FQELCR5%2FE3PvAqRPL2buf&X-Amz-Signature=7310f0606c951cd95afaa62feca606e6c91e374b7254fda9fc4a1a9bfbccbb37&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662CCZSRDX%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031958Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD%2BP82%2BGzNgBxpOTOTwYNSybP9KhvteCcN%2FjOUQWwkUvwIhAMlLzvAuzMAZjUMqmT0tJ47yzBH69YnU2MjVhTEFdcRWKogECJD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyPc9LGsSzNd0xeEiwq3ANp691JXT%2B2RGRCWybG3Yarc9cycEq9OmBCTdQo5L41eCzA%2B3RvTXFe9g7MpX2IAxnkd4dpatie2O%2BPOth2b4KHtWIP%2B97rvf4QLmtTTgnhc7ngWSBQKOLoodd5EiN1ZeVC4KF%2BHAbH2j0Pw3PcxmpbIOMs9NBKr4A9o2QotoXm8g4zvLBDj4lqpzbvlX1xEIn4OWAbxW%2F3zChRBfAEwZ8%2FMPp7jvX%2F%2B8ChQmHGt79orcFTln%2FKc9dE3lNDm4qlsVBwUjWuC3JMU9OkyPNPqAFJdjwROThjZOw6DPtIpnucQSVcVzeckibCPRBk7whFYvhWvNsUXwNmw9az075%2F0jmWqiPwQu4%2FvbrVkZ6S%2FK3TjVP7I3w%2BCHhRlQgJLGF%2B0pgHzyNc1JkmyLoWdASAuMY6BfGyyORjQvnIU%2BMd8dZpj4meyjQhlgVwWJB0ji%2BAaHo2p7eZ9sXSp2rru3jLEzJMws%2FT20Uhr9KPZNBgHtohGKwVQFVdfQvDjomLeNleY%2FAoZifk8JLAlgF15QSDg46KsM34hqLJP%2ByVwl1xos4uq9kVflHRyaHK0zJOkDg1O08K%2BCKycuaJwxuGEUSvVgv38ZVdf8G05mLbvxYhGuFCdIbQPZ%2F5IjQd2ebFZzCptpjNBjqkAVgk9JkgZFgoG%2B5warxUagWd4u86rsJYcZQmWBo8oN6UEz0crW%2Fg9%2FhocN%2Bs8LjAi868w1L6OzEMcCplt%2BNBhxpUsofUxS4j9siwa9vsRybWB71pANZAGBkmxhjn3NqyrjdREtMqfdGCvSuU7FVC1xWSkdrpv78rGpTlzwvOlzoSIbIY7ng9HMf7PoGu4zeMPcRuqmPxq6w%2FOeW2tYVWVDRjEYL3&X-Amz-Signature=369adfe8132f4462cdb4c0a5f5ca076a3258a16b51052538694f963403573187&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VLMMQ7IH%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031958Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDZhkFZzXR6l25EciU6UGZBqZujvTHzv6GF5q%2FM6rxY2QIgOEY1BDVl39xRKuo%2F4Y2g8MT1OkwmmMrc8tkva4%2BKUYgqiAQIkP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGYo2a4p0LE186yCZircAy3P%2BMkxpi04bAm1oAM6g%2F9wgCrVuMT0pA1pdk0S6YVSbCh%2BhgK9z4sYreg0ND%2BmiJg5iBic4AjE5LdZSSUppQj9DGbZ15fPLI2lKJsjLH%2BqMX%2F6hNo1e2BOII9z3xqJQzYp7OWkn8BY29zTZL8ggydrLwognNCS41AR2sF%2Bntlhwm5ahayWx40hwLf42TV7yCFF5cbLyz5Dwpr4Xef0EInobSVcAGvpr0JliwKC1hlIPUMznKrYMlV8DcenIf0FT%2BSDpsg0Pri87PRxAhd5elkQSMR1apdxZMg05u5sO3sjpVRwihOLaL%2BnJZfsxMOes1ZwI2NoSBA6K6%2B%2BYDJisE%2FVTdd15PNZDBO7OJuHnSVyMuYDOL%2BBEIaRhBTJLH9OajqQJxGvVAfV3jWRvvHAlYVeOlrd1JshcyqZexmwJW3TLrZx63semqVCc%2Fud4sJsMMXLBV4vQwe0k7Q%2BC5iDUt0W7xCjKBnsOdGxnjzlBl1VKvXTpkUEkq8s8C2IGBsAJixfcnkTZbTjIABOuWlRpmiZ08jdp6XCdQKIdhui%2BldMexlPylU6iYJnl%2FCjjVRM7%2BH2lRXRksMMTnwKvxsDkhlpvIXSIlUNXKTWXZQ2A92PGVvpJkcC8fsantnrMLC2mM0GOqUBH%2FKUzJs7gE2%2BsM9FeOFg2jOcU1U7C0ynjWsecnLGu%2FUo247wv%2BLPNLBefdyNwcR%2Bk8%2FyD1MhPp4HVHZ7BGHsINyfvpf5e3vl5JUbyOASlEhWdfqQS7guF3vbY2m%2BbeMgzTtSKVGTqsgqnVU%2FUgCuhHmR7Wf12QSZmwIRXv7LU%2Bck9bgQAz%2BZ2%2FgjQmecPwq0Wjy2LRoSCfleLi7PoH4lJNCpRO8J&X-Amz-Signature=7b38f7f0b7146ecf0a0608fc5c61eb1d6be93b375f6a04789cbe5c55e7be2ea7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QTUXKO3D%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T032001Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCUKBw%2F%2Ff1y5m129XVEiKczIJIceh%2FRak3gz0T8vbeX3AIgBTzwWeq0UIhTI6wkGGgeXzr4ahhmIjLmq3L6JFAIgZ4qiAQIkP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEZiea%2FXEfTgEWPGKircA%2BHZodny%2B%2FtiEQ7ep7xM1%2BchsabZE3PGYBEb4yoFW3nwqrdspKEpoWWH7dTW3lWnpwC4uU7kW%2B6E%2BE6W13PXtBeIoXf8xPJsYoEV3%2FcxZ9aliolDBgsoSehp3pLUn%2BZKCZKrl%2B7NnurNKkTDjTYghneqp06de8XzOiF4mJKSqp0fMyPDKx9mPgGs4ZnB3iZJQl8FlrqGklbSVL%2FlVZs9dyaxbA2cdSwmQSAnO5zih1Fw67FtqVL7DMMPFQlUnMAlYxW6jdYksKaWW9M3Es1D2zDT78jKTW4NujN5XRJin2ISNMb6uokD0ZJGLqfuYIWxM97XxM%2BT2d8vEJf7eLMc03jhWcHp7ZcPFcQ19MSnP1ZH7aZnmM0vHRo6PcQVXrYGkM1WcsMeQVvhzaGrItvAZgQrnh5R8uw%2BN68hWLWG4byfMBIpwb3zmRpAOpTVwtaTxBRBjcrhiBOAiV8qUCoIDjbc7k7yxjhYatvDlziuFvRbeadpbt0fp8EMteMVnw%2Bx5BClMBBV6agHIM5WGY7bVP7btPRZjnD2uPLmNKKVeMA%2BTHvhO%2FdnIFFxjvEmxtNX11HGztMmDUsy7zGMjOPuR9Pbz7GKalUpifcTu2%2B9lMafF2XacpAU80ikKGjyMLG2mM0GOqUBrDE4vQO573S6f17k5%2BWXq7S80JcnN9XxFhnN3Pu3FzQInrM%2BNebxY35nY0e4477NjdJNxlrrzAaDEGDsmqJHC6jRnVnHFkykHRuIB442APaWsuC0%2FP1sqasF6htn2KjJUFcAWf3wGySSvL1cFzefWbXwKOeqsP1K%2F%2FD5d2JywQDT8F4SVFcFW04sSgxHHYxK1YMpkxGg1kTExwkWau%2F6NSPuLH%2F7&X-Amz-Signature=f7ca5a85281efeffbe0ecd5289a95e98da8b6b249fae5c7f59548b366e932fa5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJUBK4HH%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031925Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICMlMyC%2B0FozzdRXDM1j28O5bWt6d4C5UlmHetc7ZYrHAiAbEXw9H9WXmQ%2BO5RlahyHMzbRqvFLDTDzyRvKBoiQ4kSqIBAiQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMbY%2B5wmIVYOH41fBMKtwDp8e%2FBJe%2Flw%2Fbvb%2BTPm0XPRKy6JoiqzVdgqnacM6slD%2FLxmfyQZqANyODIxSaBqLmbY3QXCCEgLk2CgzfHgvSL3XbHXhNopeToNNELyLLvwx8DxV20Ha9x%2B2ZQ1Pc1yAnw%2FTVoZdzKnpdk3Zv8x6qRldGrZ3feToVNkCSCGLIO7DdgAI0mknyC%2Bfbv6%2Fp6kovJnMZoedYw8oSj035QTco1d%2FqQBl3uII5%2B5vCUxpYEsFN%2BwUycvU5ru%2F69Xv4BGKRiEWuXIVpjJcV%2FWMt3W0lw3TOji5SG6%2FEu%2FFOckv8Ln2TUvSxkRM0ReeaS3HPo0eDXjmxhJfeBkrYGQYdKPz6G2gPKD68nbN0knsD8%2Bj9pPZdLmScP%2B04Dapy7uTkZZPFJKYJFa3MPgXa2xapZBSCTOXLuPTtOE5iTcYeNuoeYoxo21%2FZ8NSHN89bmsnEgHb7vZ7me1AQPeqQlWBnJ1333qVfD0E4NoFSfjuq2Z%2BF1OdnItH%2B2D4oSwDwiyN5p71Zy3K%2FFVhvsHDgETnOZZEdVeXYdgpGP%2BAlVPNNMIfQl52ROclaII2bOqq0iIQ%2BxF8d1axOo87UXgorLdrGDdokorefsPxOBXwt%2F09z6C8mEMt%2FKL9pwpbua%2FjdXwYwgbaYzQY6pgGGXdeWycoGAd3fYRxAd8j4bLkAIlcZx%2FH6pVhYGH46xHeASY8IlFdse6jj7pAGhVpdRqAs%2BT35xnu9%2FTsXEIfkUbBygcr%2FUMJg4ylKvC%2BaPtPnznKmFlb1zwufo1afu0JWaQGRtBflJFknEvJ4TBjJDinDaVi8Qms%2F7GqkbFZB5u2aLkvHjdC25uwbOZqi%2FbyekhDzdmBUuGVcHEWwNnoaYSrkDzio&X-Amz-Signature=f932b9f87fc733dc445c8e3e0ca63ce7441671597407084cd94dd1e9e270548e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
