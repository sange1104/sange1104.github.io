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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VNONMM5X%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIBKu05awY9KNcWlLbvbq3q5ECoI9UF3wu5UAswZEXasnAiBI7%2BA4zlYJe803RgVSlatLMYtArQ241CpEMSgua%2B8OnSr%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMGNkpX%2BsLuFnb1PpEKtwDYeZjHkvhChdxqZ%2F1hgyDHzPA%2B%2BhnWCeYAv2zaBMaXzLzBp%2BJLxyQ8YVj7mNQMHoRou4qPwncVQEboU3bKLGuJiHcKReaDK1w2KFOw%2Bvg7KYhUSSFlwLY%2BqymBjdb0PxwBaPy%2FQqVB3%2BvU0hH7RIXYBmdfMMy90iip%2BJJ4bn%2BsvwA7%2FmdGy7qM86lLYlXTnkn7b0rWhQYZKEvfBOjfwN8NCrhHpMcfkaZbK7qmObQLiIxD3%2Ba6ASyogijah34U5fMZbcfIHymYmuPQUTygszXdD3kyeQkQ71Mf4iBa0jFYl%2B%2BTjv%2Bwj9LhGtJ7TyNp2RTDuhBQn1PaRyVU1TRswaoh2AmSRSzqU%2FLkYYwkCKYUVdfyHeZC9Pl9byYbYjZidvIUYAgyyPdbbGftQT%2BSYlZT2zeSmi47RZmHfhMJeLaMVDMWwRMUrdiIpaqkg2g6Qg6H23S0ri1SDy6tlUF3F71Cbmlsq7VvoSkeRLJq0Eui%2BgIf2yy7KsRKf2kVG1ZwR86P5%2F6JZA1i1D4w2MH%2FvvMEI7PMcdy%2BalFLezQCpOqMS7Widw8xVn1urW3MsIShi3bG7D7wJfTLjw1VlPCpmMVMcFF05dBqd95Vk96HoT3uxRTX2BM9aZlOACvIl0wmcfhzgY6pgH%2FIXiV1FxH%2BUs2tnLmyVcSjVt6lnODQCUWTeVxt9zq1zWk4AfFQlNE7okuBYWjgxxd30dOTpgZsRGfwWnY5N3CW13BD%2BzkZtSOAKW30sBgYO1qJfCEdyhsx9v3s5byOcasWFFHlm6Qabrep2qFeLCgtRsFd7pJCZc5PdnlzRNJkokNH06WxnqHx2zeE%2Fxe3GPRzVSOq9tPAAarcOOnr%2BHBysxGqEEF&X-Amz-Signature=4b98fc87bf8b207e695d0b2be7dd0764e995329afb4d4ba8b6e6bbc01f27c73c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46635OUFR3D%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIHsFBs%2BCbbRd%2Fw6KaJ%2Flcf2od33jft7Qs9zr0UXmE%2BHJAiAW2yFWYwHCHTb5Tv%2Fa9Las%2FvZ2wTpefETk5jHEXpOGXCr%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMSc0L1W2O2ARuqQZtKtwDgWrSsCe%2F1wc%2FI%2FSbOy8z%2FSgW1V7SXmjOYsFL27fLMICzm%2F6El3aBhMtDTenD1ZQhePoyjPtNf3GPfDcrspVJvXfpkUioUCMJhup0aDwi3gVzF99QqeFQdqkGvfaImfD8VeNXiKvWr6IDt07%2FmtHfyAmcC10Qx1rJBEag2UzbvKKspO9xpuwiEwjdnfpdolEnlznms0jXSOCkIRO5AlhQMQiZVVMcUXTkykl5xsnFGQ%2BxhGogrRCOxashe8cqMxjsUkzvcKHOJpNnuFz1QAGqQMQhIFY9i7PvozrQcUQLqaexST72ukJmOZEu7f%2BpngNtf8mMFGejbo8rXlQTfXYQg2qLhnKnfiW93h9ZZd3oyRuSwWoVa5GVTvYlzpDHT%2BimMO9CLxw3iZew%2BzOvNmi4G%2Br1wMhBxCZH%2BlAl%2FFFz5T7cfPeka%2B4DwITMnXK65e7DDDzlTETtUCk7tqPG4vzzkcMbMO6kW5v6Fqc%2BMnUJ%2F8UzpQlB6dJZS5BQ%2BzGfteksadCjIF0uksroe3jsvYgyHGeZQWtmVcgxQ%2F2qBJ1bdYn0q1kQkGSVKVec3fyARiY5Dsa%2F5xIF5lLZKp%2Ba4XuIAq4oji9w4B49fTmepWQG2jjVGOdpm5t6%2FojBz0IwmMThzgY6pgHPbbJC5kgR3ptDuxYUDLIutw6dImBzusotz4D46pRU2NaUM%2F3Z9uyuSLpg6ys43XQGfcBvmcux%2BeKsuGarOGjI6qGokyPUffCO9o%2FFN0BrHvPeWbR%2BgGAnvqVDPh0V2bGKt%2B1II5tEzZfkaCfiabBbbaaLfWC3IP6%2BATBpVQfUts1ZClWCqmlX9N%2BoAhsQ8w2Ez8Qh4oQmQ2z8Wug326qMFDDQkmZD&X-Amz-Signature=15f5dc25bf9c0d058317b1c99d97ea6d16f2ea4768fceecc8ed347df442a85da&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666LPF6NKN%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034321Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCC5K0f2KSoP5T%2BKwtguOPWqU7pGs%2B9wL8Y8hr3ZCHqYQIhANMa5Q6Ys0n6aODgI7Lx4erxbQ9DsLD8NJrQLoiCYfneKv8DCCQQABoMNjM3NDIzMTgzODA1IgyfQx8hOJ51SG5oAjEq3APKEIl7ErGFeJcRckhyGZJ1sW3M4y%2FJbGqFgvab1CaKVyTVxjM7r7Tz%2FKsUY0aWsExLycb8miHjhnflMRk3URWLORsrSUxjOUf1nSDCOIzunC2Y8wn6wQ0SxRr1CzkBmTkAWb9up4s5b4uBOH14Ik72dYHIje6SUVng%2F%2BY6v7rpNtRvKMcYQvleS8I2Xiu8j%2Bl6M6uBV1ecTxLnwhrRs8Gwy3WC%2BC%2Brn2U5ep6a3xPp6GSF%2Bw2mwxw53E3dCRGhEggxXfaFx%2FPRnHtoEwFtw70nuvJzNgCAncgdz0idj9M7bEQuF6KysU7Fya2NwEfXnc%2Bj4JOGsweX0PDbMdyu3ma2QW3XOph9QRtwKoF3TFxPA0T0CgnG%2FPlRqBGd1W2J%2FmG3DD1eYV%2FGGsTOkpxfS8t6lKTnkm48ae1CGi680TpxAFU%2F%2FTM7CKmaG3Xy%2FsvgCCIV2gB7YwZv9NvMociJHZGa3BcBJcpVU3dGCHOMx5%2Fo%2FIpzAUoRY0f4BcLU%2BfvJY6em%2Bw7Rbp9mMd%2FjDixpAGL9ojch9IwzGcrmy1nLgdQujAzLgzzydN7%2BFWJs2pdTiC7L9iKeTnYsRjM2sJK5umLHJu5ygePIltxmpkL6JZ%2FSkcVNwyycDx95%2B4t6rzCYxeHOBjqkAQ3pbsH9WknKdaho2U7D4JSXOKs5hny2ZV8BUBv2wyoGpV0APBMN0SnjX0%2BjDSNwIemmQCnH98rqH%2BjgoeWCJKCU%2FFzs9HKTLuc2llbkXtUkCEdfvlrI4G5ZfRY3Q24t%2FWRxgBNw70zy9L%2Bo2ze%2Bivu5iXdpwNZGjRBnH28ewi9%2BeHogF0kXCtQL3tC5AncIw3%2FhJpSL2sX9AQW%2F3fs49zMKVWPS&X-Amz-Signature=7323bfc3640bd217913d79a743a28851b5a4f3af95e24a3af0bb651c13b606c0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666LPF6NKN%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034321Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCC5K0f2KSoP5T%2BKwtguOPWqU7pGs%2B9wL8Y8hr3ZCHqYQIhANMa5Q6Ys0n6aODgI7Lx4erxbQ9DsLD8NJrQLoiCYfneKv8DCCQQABoMNjM3NDIzMTgzODA1IgyfQx8hOJ51SG5oAjEq3APKEIl7ErGFeJcRckhyGZJ1sW3M4y%2FJbGqFgvab1CaKVyTVxjM7r7Tz%2FKsUY0aWsExLycb8miHjhnflMRk3URWLORsrSUxjOUf1nSDCOIzunC2Y8wn6wQ0SxRr1CzkBmTkAWb9up4s5b4uBOH14Ik72dYHIje6SUVng%2F%2BY6v7rpNtRvKMcYQvleS8I2Xiu8j%2Bl6M6uBV1ecTxLnwhrRs8Gwy3WC%2BC%2Brn2U5ep6a3xPp6GSF%2Bw2mwxw53E3dCRGhEggxXfaFx%2FPRnHtoEwFtw70nuvJzNgCAncgdz0idj9M7bEQuF6KysU7Fya2NwEfXnc%2Bj4JOGsweX0PDbMdyu3ma2QW3XOph9QRtwKoF3TFxPA0T0CgnG%2FPlRqBGd1W2J%2FmG3DD1eYV%2FGGsTOkpxfS8t6lKTnkm48ae1CGi680TpxAFU%2F%2FTM7CKmaG3Xy%2FsvgCCIV2gB7YwZv9NvMociJHZGa3BcBJcpVU3dGCHOMx5%2Fo%2FIpzAUoRY0f4BcLU%2BfvJY6em%2Bw7Rbp9mMd%2FjDixpAGL9ojch9IwzGcrmy1nLgdQujAzLgzzydN7%2BFWJs2pdTiC7L9iKeTnYsRjM2sJK5umLHJu5ygePIltxmpkL6JZ%2FSkcVNwyycDx95%2B4t6rzCYxeHOBjqkAQ3pbsH9WknKdaho2U7D4JSXOKs5hny2ZV8BUBv2wyoGpV0APBMN0SnjX0%2BjDSNwIemmQCnH98rqH%2BjgoeWCJKCU%2FFzs9HKTLuc2llbkXtUkCEdfvlrI4G5ZfRY3Q24t%2FWRxgBNw70zy9L%2Bo2ze%2Bivu5iXdpwNZGjRBnH28ewi9%2BeHogF0kXCtQL3tC5AncIw3%2FhJpSL2sX9AQW%2F3fs49zMKVWPS&X-Amz-Signature=b0936ae938305579f274b6242bf832cc4092491aaa228a34d99f4ad306cc9c2e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZLJ55KO%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034332Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIHfuqJO5ppU5ZTw5kgvP5fU8LMBN9E5afHhHUuYzU8YnAiBLhSZV%2B6PRfT8uUrdIhc82ZfhCHn3MKHk9ESul6TFUvSr%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIM5qCen7f%2FhuvQELFYKtwD%2FEk4xj2DyuGBSiOB2dRckt6xXEi2eAVAtLWK0LJ%2B%2F80trRNsrXOe%2FdVAGlb%2BNlNq8s3jmX2dwss30AoSm9cqQQHzSwh1DOcqsfrl13z5H%2B1z0KVb%2BEqALW7tYX3td9%2BB78Lpg1mblVmnLfmHlYa2OVeAetRm1YV2sYVOBKPI4Vukj8D8JVzlT8xdWlJeOMoSJP%2Bk4Lhu949GEyOFawrWxa93qrOReSKB%2BKzMUHL5Uvwm79Oev8CT7745nsv84WZqB39S3GQ0gAwkh1oG6q2uhdgVt%2BGUzUAw6qxV8z%2FsbYOYc6CQRirvT3X6Ec03MLiAQwbJJ3UWue4bC8BhfVVaYpEPGt9ZzVWfiy0ZVXJHv20yiFWZGzL5x%2BUfUwJjgxDZ7jYrUyRl25oSGWbpYLTkuX6HaxR5OYiIC8YJ0SHUr3rD0b8PVLugozR33nIn5EmJ79tDq1PvcWrG6IVgrX%2FLVvG03viaQdpEOPUQoztRm9LmAwJIYBRhg%2F0nyd3KJYFd%2FM3dMibWWcyymJuqMKlTvBbHy68xynOZx8oDyhZztxuvC8yD7CV84FEA2cfTlhcWc3D1%2FLWLN7aVxdBWwgseZ6b1U%2BA6TG0Bw5b1caUkY2U06AAQhrb51NqTl20wucXhzgY6pgFvXMGR3Vk9jEzUGNVHe0GkVS84O2enKRcYyJ11JwWf4VAWIl3K0usUpxlNvs%2BXcRrNE8SdLYYoVzOit0qZcZoRWauNQRJCXd5ZZI5JUsn2goX22lrsUAOr0quTlnZkLhFGQIao0kv3LFMGqtN6hSEH2GPqmIgCZgPZ8Glh131ZrNWv3wxuKqEh0u8ZT7yuxIC7Z5ARQBlvtgpzKTf%2BlN9Xzv8s88NT&X-Amz-Signature=b9daad134c417a8ace27a092ae3ecce6794976e467beebe4291665369aea4253&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z2FYCTDU%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034335Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQDBE7pXTRHcp%2B%2BZp2PnoCfdPl6qgI1JDr9ZRo2PD%2BltjwIgETk43HqfWHxKTmDxsdhtopmW%2F4InKm%2F7vCvuBVjl9l0q%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDMweOtvucG2bEgOneircA6Jdn2lTz4zGTKC1nGjWf6kWsUElSTJoMPcy%2Ffn5DqZ24LYJGf8k3HCaqU%2BpN%2FSEc98F5qNI5f9RrftwJLK2SsbBnnJpTQKcNvNDdZzhZQ5bsTHNsIkXijkCsjIUqHLf0KRjxB2sXD7qiM%2BRJuy5XSF40S5Tyh7LBFWD2%2FKJ2gMtMwXfMS2ZPcRyAqhOfob4Nn1ZyeKvNifRCHY4IvKJ4IB6WPNEfQFN4jk9z8MF4URss%2FKMKcUqU4%2Fpfvf0WsJV9swKc%2F7rNd2lA8NhzFsE88ZTnAUUDfXTJAV8chLNdPT28h6DwtrNUau3wsN%2Fd5tIseY6JwefYfqnN05Wci%2FHsJpB6h7ecBYSWVj8tKeCzxHFl6rXRCCSpiwrt3J1RApyMY0FkROAAjjuqpLHF%2FFYO3mY%2Bi467e2HjLLGcY86YKzT%2BCbI3gwAKAgGJd2GLWhzSXQiIaSnzBygVySuqvVJCpWIqaXmo75afIP9aR9F9l%2ByxQ%2FYZE9q%2BNXh4FFDE4PcHSyKEz1m%2FCHXfJpYoAajvv%2FGWjTJeFFmuTpOvblNXlUy%2BFMe7y2hYtIWPUorHma6O3ob%2FHBpA9G%2F1tbwGYwZMWltwRpxGjwmms5DJ9wGV%2FyvccBtCtNQz3s7g6GvMNPE4c4GOqUBQI1FeY4ZLAayMUTT%2FlG1d08%2F8KsAqZ%2FcLfkPyBjYdCD7%2B4N04HxUrsf%2F0z6mk3askp%2B8ZCjYtG28uKDkN9bmG9Tk2DlES2TEJhXmmZ8vLICpCsN1OgiJC3L6PRGvT7VVuValiv2PmBcVD0FOLZi%2BBsdj0CbhtZgGTkA0RiHcQTClouRIUrhseiW9my95cCpBogi0yuxwHi%2BOJufxfPJJWbkOIUuR&X-Amz-Signature=89d8a2f080130c86c3af5061e43c7d2c511a19f762d735f4293a2d23f755ad06&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z5NRMKVG%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034337Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQCAn0xjImrwZ%2Fx1UFGt6LUbUREup34o9NtLoyV4D6TGowIga1t2uXy%2B%2BOwz5pc0%2FUtJlbuoCRxbsB%2B%2BN338LoBxB7Aq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDFJDOiI%2FlqH18r3HAyrcAyzXTza4GDnTYiRSNNShKLx67Uuz782hxAx6GWpcT1jXVoiQKR3V9F3hv366Rj9ivzJoqLYrHddqqMQiiFeRACyKKqOv%2FARrZtmUpqZ8RkP8poWlSW9oKiKgNcB%2FAbINGF%2BdCYn8ZBVKnmtwVtw0eH3NogW%2BOP%2F3UTaZzBaO0r3b1qIfIr%2FuhJsbLsbSF9Vbj3Rp7oth8T%2FdUsNjNTqxwK3wAnzmzksZKdgDR277Ax01QIrq45iXzOjgvF7V6iquDAEd0cgv9Q8dfaYCiVGqFuvJ%2BSvvSbZanjKEZJE%2F9%2Fl9KZqpQAD94LM7tETUpQVZkW%2BfrhTRyAE8eyfnq%2BirujzhpoDSRwZ8hjR2MSqt%2FY7ZJdgBmdQPFHGn2EIUhQc4umAa9K1I322%2FCwWMCxqlLeWAZa6NXkO2xaVyU7ntLbC7ogjXmO7oauBrQb3t4jT9k3x3Pu40Y4ffRwpGnS%2BgXYE57fMoJS79kfjQvDTQk6qE0ottxpqqrpXt%2BsxHM1t%2BndeJudGOfCcqz9dlRL3wIz6HnUfKr3t5t8BshLfEjtl8rEFe5HxQSdkv%2F8iKp9dl%2BR7rdbnZ3eUTnrSfh4xLsr19d4d%2Fn7mJSp0m8SF0qMvFoVj129TVoq%2FpbnJwMInH4c4GOqUBUp%2BjS0hjt5%2FWp1xeqz98%2FE85QU9jTfRSefWc96POqa1oFPqPpdmOer2IBdHo1TKVIJppRjTU%2FkTVHzFZvxPulFjnM6sZPDZVfmPKT%2BuAEYJQ%2Bmrq%2BkovrxlsYO5%2BHVs307xA7JresB1RPX6TzikHa81QdV3OUsaaMKY3CQOvXhc5sDMrZCvh%2Fdp5WCriFRCIPq0B%2FG57aoqovrIYoZh5npbom5L8&X-Amz-Signature=7e79537d43237610b9e80f036d2b7aae6c68f7394e5e40f8d3afa2dd2456e22a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667MGCM3QB%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034338Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQDFhzvtnAgFTaIsItjaAQY4Qr6vbFWblBSA8yYs19RT%2FgIgHsuAP0PXGofu3RnMDymilW9CdVIzoQ4r7XFnHWYbQLgq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDMxonjzj%2B%2FGS4Hn9ySrcA34Ajt%2FK%2Fbel66XSQHVpCjWXo4vUhS5Yj35pflWfs8F3X6Lsj1Sg9hL2zWbyAGXJk728ssVyCVLNYyWBpNZjCDWdi%2BTtJduVnXv%2BqpA6bNK%2FZzsdpKH4Z2521C%2FVheqAyBjcQ2fU1W9mzY5RDqTtvvGfz3nnEiEIN8BSclsQGmMe5JmENU3AATBWfNSevgCo0nucT39WLcDCmRabNDjxwgk4NsEZDzp6DyZXMeRhx%2BgjzFJEdH8BZMo7AA1At%2BFW3sppSPLjitQrAK3THiHO9FnTrHOMVDGCUyh671mOp4HhbQ5TIdi1kaNP1JhhyFD%2FoCH%2FwTv90xodQz45WiSnkVkQtLAZwLMzNfxoiVihu08%2FvYn1PnqwxM4vB7j7uldRRifpyjgU71LXyW4mUxSLSFXaQkFRGmQrHizYwaNGCqpvWhwI25bpoO8xQDOz7dlbM8vOBATNHGi5n%2BRH%2Fs2ZtZjrOnoAaIsPOhV1cbjSR3sYmbijjvIQ6b1JGJ3FHP%2FKCMAEnVepWA67dRE4FDh%2B0pi8RnkDeqCNwPcchK1GdUH0qccgUP5y9F5CoXLpfMHT5i0UdEqJjyAxYRjTsoLuWCVJ4Po0a%2BJAnOaMpKf9xCAdj08CyL%2BOshkXSCniMNHG4c4GOqUBFer4wab788xcxEwdwR8U6Q%2B%2F0g4UqZqo%2F2P4O3%2BKyhcXtI2KCzKbnhcD0V0bOYSvUab4iVzuFdpo1q%2BZrjJg%2By8Uv8grfKtMlZGcuE14oRoLgwrfonRDsdkbULkH%2Fgw4Jvi5jA%2FuNUvXpJVdt0MQe4Lodbs2VdOb0HZl5p%2BFEvhmlHxXXJJjgnHXbD0NTa%2F2y5OfoWIJKHPe09jMLE1%2BlMNpIL%2FN&X-Amz-Signature=daa8e1806fc2b609cfc45796005118a1ab31bb2da3e9beda85b638f3a66b7dd9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666GLJH6AS%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034338Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIDuMG08Mo3unrc4xKHfJ6vQWHO5rvjpzfUoWyKWizLrDAiEA2hVYARFbTsYVumcEAO0Sm25guyfzv6YysrkaUcTe88Uq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDDXi2zemx2VMb8G67SrcA0V3SyK6LM9HKkntZcXCjOR6%2BeIUhzu96pyzLiGawipIPxQDieQnfkMvb0nnC9N1YpahCSitO2xlWGPTW2F5F7mA0l3CVu%2BpHeM4RxEalpOWwiaVhFsVyxyv9r3DvhCTI2m4fgevQfhsqSfGw8msDfx9PqsKELjza%2F8DXWiXKTiQfUJOAf06TM8Znj%2B%2FjtywYna5bmuqYyB76vfSn9SeJ%2FEfGXpsTyYWdwd3ZNjR6X6xEioykswSVvM5ixzhic2k1KlaZCNO7QsR%2FRIQiLYg8bYa%2FVSLblEqlesnas4c%2BJgLsvL9P%2BMx%2Bspx8VilnHWlTD%2BzwXIYZZBrKOh9rMmmV53SCcV5v3jDmIWSS5MMQYxZSOmt1iXrj%2BCjuViceyi6mDsfWA4OkxV1TiPhe4eLT8C17wgf%2BohqJkZVSuiVqLntKqQJYDXcpIIGYPkPVZLRPazOh1dznHDrI2rZYqmrxMv%2F2%2FZ%2F5%2BgH0Vg3xMVVe%2Fu6cBYaGqCfz7ndoRl0qpJXRsBBomqmxF7lAq%2FFojeOTorvO7INdwiF2%2BJsJ%2BZb6rGwuVDOmZejLN1RS9xLn%2FuhQtiTMnnyFizrjBoUYoi1cmFiBTMW%2Fln1I5fq8LuFpGtjApJGJyixA%2FGpwBcaMJjE4c4GOqUB%2FWJC%2FDUXnNBuy%2BWGymE4LkGRC8kRes5I5WrVTDNuZ0ztCrOe2MVltmkIVXY4j2TtDVCFkMMDTOwd1aCqAjT8TwSdLqWxXGrXvuo363e7BtxswkoQXVKewsE8HXitr3%2F24x%2Fnm3kvP7EgftCohRfkbgyguUZeGfor44X9Q058zmoB6EoJMzN4CPuIdcOSl6BaofE1t%2BCRYZM5harxBi2E0RBXfeOa&X-Amz-Signature=a945e2ad4cdb9f7e699483002ec7b71ba00caf9b99d6e510fb1f1d1e8645089f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666LPF6NKN%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034321Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCC5K0f2KSoP5T%2BKwtguOPWqU7pGs%2B9wL8Y8hr3ZCHqYQIhANMa5Q6Ys0n6aODgI7Lx4erxbQ9DsLD8NJrQLoiCYfneKv8DCCQQABoMNjM3NDIzMTgzODA1IgyfQx8hOJ51SG5oAjEq3APKEIl7ErGFeJcRckhyGZJ1sW3M4y%2FJbGqFgvab1CaKVyTVxjM7r7Tz%2FKsUY0aWsExLycb8miHjhnflMRk3URWLORsrSUxjOUf1nSDCOIzunC2Y8wn6wQ0SxRr1CzkBmTkAWb9up4s5b4uBOH14Ik72dYHIje6SUVng%2F%2BY6v7rpNtRvKMcYQvleS8I2Xiu8j%2Bl6M6uBV1ecTxLnwhrRs8Gwy3WC%2BC%2Brn2U5ep6a3xPp6GSF%2Bw2mwxw53E3dCRGhEggxXfaFx%2FPRnHtoEwFtw70nuvJzNgCAncgdz0idj9M7bEQuF6KysU7Fya2NwEfXnc%2Bj4JOGsweX0PDbMdyu3ma2QW3XOph9QRtwKoF3TFxPA0T0CgnG%2FPlRqBGd1W2J%2FmG3DD1eYV%2FGGsTOkpxfS8t6lKTnkm48ae1CGi680TpxAFU%2F%2FTM7CKmaG3Xy%2FsvgCCIV2gB7YwZv9NvMociJHZGa3BcBJcpVU3dGCHOMx5%2Fo%2FIpzAUoRY0f4BcLU%2BfvJY6em%2Bw7Rbp9mMd%2FjDixpAGL9ojch9IwzGcrmy1nLgdQujAzLgzzydN7%2BFWJs2pdTiC7L9iKeTnYsRjM2sJK5umLHJu5ygePIltxmpkL6JZ%2FSkcVNwyycDx95%2B4t6rzCYxeHOBjqkAQ3pbsH9WknKdaho2U7D4JSXOKs5hny2ZV8BUBv2wyoGpV0APBMN0SnjX0%2BjDSNwIemmQCnH98rqH%2BjgoeWCJKCU%2FFzs9HKTLuc2llbkXtUkCEdfvlrI4G5ZfRY3Q24t%2FWRxgBNw70zy9L%2Bo2ze%2Bivu5iXdpwNZGjRBnH28ewi9%2BeHogF0kXCtQL3tC5AncIw3%2FhJpSL2sX9AQW%2F3fs49zMKVWPS&X-Amz-Signature=2247375cdadf86e08b2257a82c0348e8a0fa15cfec646a11fab9cf4e19097780&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
