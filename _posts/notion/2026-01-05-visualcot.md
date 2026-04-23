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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667WK4BDBT%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034703Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCKtivApRx%2Bz2n9xfqaMeGziau%2FIVooR%2BOwc53VfCRZBAIgIkqxcngcSvz9DOytmz9S2UbQDi8vHu%2BC%2FsIAFPIr3Mcq%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDHf4YlgNHeActwiN2yrcA3k0xdhveuf3jnZIhD7pUcv5qZEc6%2Bdo6yXEz5%2BP6qvZEmOEc22hB2yD6wd74Bbm1pnDWXFZ3iJCmYcMGWVnFcRJqYeza9Bh3cZ%2BRD%2FX3e%2BdnyagrlXMmUFXpMEUXXQStsyQtDPB7ZnVDKVivZN6GS%2Fv2mc%2BcSSWge5n8MRjyuB1%2FBFqYq39ie3jVN4glRx4enxtUsHS55mEUIPmY045dK3A%2BYNRZPbkhovUO%2F7Er5BEiXwNwVq2tcWbOvdFZsJ89FE45bI4pfEG69D3HkjrlRxgFp%2BkxhM%2B4pI2iqdO4dSk6QNWMmllyiEinD94TReUJbhEBie9CtMzGKupPd9hVnV51YkjYKSzbNcR73wYqRQN4QhHP42AV%2BGh7bS3RUcevsjcCy3h%2FHzacXQ%2FvUaxZkFPRlYQQpnQpNmwyxKEs8DMiuaEfULh3Mq9%2F7rLhw8jIiw8CpMrTIh2fQZHna8FF3PN%2BOrtLn4DsujGEv%2BTZp%2BHD%2BrH686a8vYqtUw7OAN681OHGW6Spztuw9RSoeM9XB7DIX4IdkJQXyUxl79GA%2Fz%2FUG2%2B4WJwMQsiJ6%2B7oLovwKZ%2FcNoXF28OVd3M9OX7Yf%2Fv2bGAGUOo3vpqndCZOa81yYC45lfuEz8HXtUlMPugps8GOqUBqmR94X4VgTk7KdECE19Oc8khgJqUdZtNTc3ahUAFtRK6T2u%2FAjcFLXLieTv2Wney8JKL1PMeMsBZEReq2gEDYoeou1a%2BHXo1f%2FWvVYy6b%2FxJH%2BeMR9s2gipQq6zb6F745qhycjY%2FsxWk9DeC0ajTbDy%2FQVCEOzov%2BicdrmzeqTqPZOihBYnmyS1OFQvRVf1E83%2F8RQRHH3ZaldWmVx%2BYoUqx7omv&X-Amz-Signature=a2f4c14da1a87fbfbeed54664beaf839da92a3166fc61a60aa2e41c97d6c8bf8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664E44UGRJ%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034703Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBEu2Jdhui9NZ7Z5%2FbHN8P%2B7wZC053YzDAWv48ZomIzSAiBvf62VOKCPfU0vA47jwfxSzjtXEDAuVJPqc%2BxXbi5B2Cr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIM3Dy1uWJR7swo4JQoKtwDc6CpN21rS7KgiEkPRV9YAFaLL3knmOBG5xkGQ3UUHUiqMWynSTE59w0DmpDJesXYdt213GMOJJpbwRMrw7pBBwn%2Fd5Zzttklq%2BmSpqpeG8kZmt3a0w%2BtY49uU%2BnhUOpZfFerVoUG%2BmmWV2x%2FAnaUwzkwYEQLRgQ12Ako9SovzdQTzval4t0dvXuMODefbgwvw3E0Vi7vWKFV3e5VO7CkxlAojAxg8NnvHj81EoOtINokyKaqhgte%2BzwpXJSa7k%2BT2coPBHeEaRTd2Ap7JPZFiLEohOdGkaQic5jbFpVUrADogAO%2BapIkvokPozwzsw%2B5BkEmPJqCRhYjV%2FzdEQynd5CZ6vGnMco%2BfJm2BYLJ%2B4O6gmCZmsDd3YknLjHLNycsWqhZF6yX8Eg2mmkCkHArORcfMEskeO%2Fn7Ck7a6I%2BJcH9uIn4A6dd3svSuu5OgChCkOsLqBUAM307iu2arIVMk2agpiZiPopX8vcNoEGcfV%2F%2F3iWf8B9XaGYiWiUwStkh5PCTaeCuO70vGMtwZlAaj%2FHdIT6W6WHvbI9hbQjfHIk%2B7QocjE5PFf9dh2ZZveD%2FIuFthjSLsYnhJ4foIttqZVQ%2Bi2wAAGTAUxPk%2BASwPptKtdvCh3vni8rQkggwpJumzwY6pgHPc2OC9az0FNrrcwcS8Dpxnb8u9mMND7QBvilVcXaGiivofnt5qfsAvwGlpabU%2Fg6rD%2Bv7Xkw32AhuxcQsEKeb%2B%2F3ug%2FIusn4T9%2FQilFOTOTqerSxn4GtyBN22LUrDXVxtmv8uKRT62tKQ3FzWsKhoDk5VXX8sS%2Fz7LKniJFVl548bhomNIqDV9MEt6tNDMgXIAM%2BncOC4qN17RU1CUVMTzKRCFRpd&X-Amz-Signature=4754fc37e388af9416c246a9b2942eff8b8966635686f506cab40c9ffeb833ae&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LTDRFKK%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDrIzCHwPcrfBHwNYqIoZLniW7%2Bv1drBByTL%2BPKhIgN%2FgIhAIccrg6MF3V60WMxXwo3hUFis7ksvZ4BfgBE4ZbBMlC%2FKv8DCFwQABoMNjM3NDIzMTgzODA1IgwGbRqg9s8FVoYhx7sq3ANDCCDaE%2Bz%2B%2F8wosMBt2uNcphiXma9QtSQTuhXX8X1tU2AelItwNGFbx%2BBsfOxhBZqtsINx67nT%2F24xo9otoji7cMoXOoBfJcOpHAOg6Th6F1E7qq9JA6DCdh87YS1RtRrmszX8voLswxj6a3z6zxFnzQfOf%2BqhBf03gipFAppYWZAwgz4jbzMiiqnKLp9f48Nk81rHqluwJBsIztUIUVyOAN41Zw3dq%2B7eigy2zoAGqMJKX4JdNHe%2BVIKAh922zlfwEMt4GuVvqRspDPPHjG4%2BmxnitXISwA%2BGHEYLFoi4K1hi0k%2F0vHvLBVgHGmA9e1siOH67ttimwGRdXNdkFL64rG44c5IzrFGkI9vTao%2F0RMI5ZzINNbCo16yAoRAgX%2FLPXGvv8Z1p0DcqQCCVjJiTugckhjGQ74NllKbQbiMFgtUJoMoqcMGBBSFcoKqf6YSl8bjRk2fSOw0jt36bGNfUiJ3tCyB6I0sKzK7h%2FL%2B9zJPfe4J7lU8ICi6dV%2FiWw1MKppaK4IRXPsyX3LQJaxrrwvOTYdL4BoBqUHhx9P7ZO64bwe9aWXBQa5AfCAjB0wgLO5zreOmnmvBZtlNZi5mo0In5LUAg0pxbCQzTT492033BEWmIrgsFSMFmoTDrnqbPBjqkAdFadMLq0PcyKjC7nsgF5bHxE5KfXQZx4muvqwT5a3BSto1pM6SxlqF9CQdmltP3U0y1Pmqe5Wi0PpwqPI4cBV6Rx6OvYoj3N1sbIMr%2BproLnzW%2F%2F8qmoQMIjR0pNe2UZKmgpb59hf%2FOKA%2FaQFfYBhFJ3fWQT%2FdZS6Ug1eg%2FR5djlTMAKNBt%2B7ndcU%2F%2FDSubUaRP3iLH5EhzF6fHjqPdRDQ0N8ZK&X-Amz-Signature=9c02991899d6b7e2814ac138079e928bc183364cb6adf8ad2849fc2d33ee5994&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LTDRFKK%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDrIzCHwPcrfBHwNYqIoZLniW7%2Bv1drBByTL%2BPKhIgN%2FgIhAIccrg6MF3V60WMxXwo3hUFis7ksvZ4BfgBE4ZbBMlC%2FKv8DCFwQABoMNjM3NDIzMTgzODA1IgwGbRqg9s8FVoYhx7sq3ANDCCDaE%2Bz%2B%2F8wosMBt2uNcphiXma9QtSQTuhXX8X1tU2AelItwNGFbx%2BBsfOxhBZqtsINx67nT%2F24xo9otoji7cMoXOoBfJcOpHAOg6Th6F1E7qq9JA6DCdh87YS1RtRrmszX8voLswxj6a3z6zxFnzQfOf%2BqhBf03gipFAppYWZAwgz4jbzMiiqnKLp9f48Nk81rHqluwJBsIztUIUVyOAN41Zw3dq%2B7eigy2zoAGqMJKX4JdNHe%2BVIKAh922zlfwEMt4GuVvqRspDPPHjG4%2BmxnitXISwA%2BGHEYLFoi4K1hi0k%2F0vHvLBVgHGmA9e1siOH67ttimwGRdXNdkFL64rG44c5IzrFGkI9vTao%2F0RMI5ZzINNbCo16yAoRAgX%2FLPXGvv8Z1p0DcqQCCVjJiTugckhjGQ74NllKbQbiMFgtUJoMoqcMGBBSFcoKqf6YSl8bjRk2fSOw0jt36bGNfUiJ3tCyB6I0sKzK7h%2FL%2B9zJPfe4J7lU8ICi6dV%2FiWw1MKppaK4IRXPsyX3LQJaxrrwvOTYdL4BoBqUHhx9P7ZO64bwe9aWXBQa5AfCAjB0wgLO5zreOmnmvBZtlNZi5mo0In5LUAg0pxbCQzTT492033BEWmIrgsFSMFmoTDrnqbPBjqkAdFadMLq0PcyKjC7nsgF5bHxE5KfXQZx4muvqwT5a3BSto1pM6SxlqF9CQdmltP3U0y1Pmqe5Wi0PpwqPI4cBV6Rx6OvYoj3N1sbIMr%2BproLnzW%2F%2F8qmoQMIjR0pNe2UZKmgpb59hf%2FOKA%2FaQFfYBhFJ3fWQT%2FdZS6Ug1eg%2FR5djlTMAKNBt%2B7ndcU%2F%2FDSubUaRP3iLH5EhzF6fHjqPdRDQ0N8ZK&X-Amz-Signature=63a245294398db5fc198f45d49754690c43694bf8aa5bd95da634f32b3f7c20e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666JPIYY52%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034743Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHGGvhwjJHh23SgCG3D2N6wbOc2C5MsUGnXXDcUC3vy9AiEA4A0%2BNAy8xMqhxedAHpRp4r2xeR%2Ft3B0lp7RATTovSJ0q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDMexJDoGf0b4aYHCFCrcA%2FsRMOBelPi7VHJaeiswQN%2FSuKZEfvMmvTj5AZivLcChOQtN6tKUx8wFE5dZT%2FhKTy6hrlE2NiDt4Udyc7DzIQ77ylQTNjwe589Rtqpf1TkAh%2BelhwtrfBiKuH65LIg%2FesJl5nmuWWkAl5Curjz9M8ahNfEoI%2B%2BQwuS%2BkxyqBbuLumsw9Q3JbwgoKXnaJXPyFSBUdg945qdPOnO%2Fuj1yX7BupRVf4iZk2iUiwWiHOnBZqoFZ6k8aSYCC7cLOMyhPS4niDZvtI%2FV65GV%2BS96Tl%2FT384TekvYYd8iEerB%2B%2FlReIFe1AheXq3m%2BVcNeFTQGIo53WVLUgQ2gdf0X4Tk7THGw6ogoow1eLRXnI4rheftDs8t74el7bvgb3f0qJnj8iKLgMcoIavysESVVA1o9c7XSF8gE7RMHlCSEKJ7olizUC%2B8P92N0gaEv1gPK4kS3wXwmbtdalzWMa7cancB2OLqBqdIT0aRV2wVt5gNDg69i19gQIlc2hmiyQI32yGDh8Yi%2F0RYGo3kXZVc6XAA3xxWC22hmOSJCOS2lnbDwQS0xPnV%2FN3Ze4nKLR2H08NVN%2BQqjNKP3srgIw2U3R3%2FZjft4YwOPHeHiQF8KHtYhe6Sgv8AWzBNf1YFXbBoDMPCZps8GOqUBL3yqMUHbo6vpHYKi%2BdTP8n6N8hgOjBJqK9jwKxZv0KQqE5w4OdXgnN9ScNH3%2BZ2Dc8f2DJbrNI8sOKvfJO4sYk2XFHceFAgOxLPNcj9fZ38dfZ3gJ%2FAUjXh%2BFd7nLsdrd6Qb4WnWaGyyZBl9htasCETqWu9gULJrVFl9eEF3HQBnZ2GxcCUnF%2F57D1p9fopGuJ57y2OkwNfIYNm%2FuFn2j6EZ1ofo&X-Amz-Signature=fa670c1c459d8fceb9375f0a4f144cd09339a2b12c9ce63a608e46f7242beb06&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VLOULMRT%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034747Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBDgnymLwGFBfvFX7uNwWZkrRXCHmNF7R%2BmIhJZ2oFfgAiBV%2F9mrIjZSCBw8QnlNaPKqCZFU30DjQpQ4zyBHShn5YCr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIMAIhDMZMFQNWhqURWKtwDVHWgF0hDB54hpa13QQwxt9T9YEVrI9QWdS3BfxQ%2BBYvhQL5UBe7YToxhaX1AYb656y4gyRCTgujoM7JBmBnVRVu1oUTj6LxIP1yahtTeGZoVknnR%2F7sRCPBVezr8wFPvUFHgxjEjJ1cvUuGF1282TNjUM9uNCiT0EcIwrIeqzXz0q1DCfDv76LPWs9WUuSNxX%2FtEefgL8kuuMW1XHPy7%2FTiDJ6I2GTI8tL70XabZN1%2Fa5NKoJ8cGrCQeyZzvAAzfEQFj08pbu0D7XiDx57dKDWTyhH%2FTfcnC%2BllEDggF7kYP42PYslVAbOBFe8H5BXrHYuV98VhWs6nk22%2BJpp%2FfQRSh8o9CXacHUx79xtwi%2BlZvQX6rlzSyn4uHSpOoj4N0YnzXkz4fWEvqtu8T6YlZTnVrwTvuRyz7QLiqywAzQ0hBPHzKJ%2BXALNynZ6hnRU2v0qX0wCzVNWExl2HBl5QsKQp3P3oyj7%2BI06%2BehMyvdbvpLhFPznZwlORLcLYBis8RQfFlSU%2BHCALYCtH3jvcXIUdXVDJH0T9rBSTWPXF271iJmMzxOmiqTSM%2Bj74tnVy6a6TS1Pf4B9lmge%2FACzQHJ966Sm%2FJBCFiskNwUNZtyN1qM%2FwMqucB82GdqXgwoJ2mzwY6pgHO0PrgpawplP%2F4628TMsyzXGFb5PGsg9zozOr7E0xsAcQva7ry0sXZ69Z3UHZOxvbtR16j9jtzJ%2Fs6GOlJc6I6CnUpZwREubN2hh5z5CCAryl202Jp5t27IQpVugKpzh3vFUiIRjhmds14jWu9C47Jh1knv5MnqyobecKafadXlMzZnuLKumoa0TE4uZRZUZWyLSDULFyfG2q8sIv5dFLBaatk1HgN&X-Amz-Signature=9f66882f59737f3e24d0c22ad10855ee4685b310bd8898511ae1552f2236772a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQNKH3MO%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034748Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDbdiYsMElrukQ%2FO%2FF8LBWLsxZ6vPwSn3gmHOY%2BPwF30wIhAMWjEtUyNREqC7MLFlyC3CEsxVd1Vz9JQKAR8uQYFdjyKv8DCFwQABoMNjM3NDIzMTgzODA1Igz01azvdBG87JyhEd0q3AN319yUuNCdNnOAivbvu4mnGx4hYFj2tvvo%2BNEOoN9nSc44%2FPRKOQQRWrVneqMGJiTOxfeFUN%2BE%2FfBOAo4UPZhS3isM26R%2Fe%2Bi%2FGBdSAHnD3zRepmMD7mqmYJ%2FtRVZttRkOIQWNqVJpQkHQAvueDdi4rQJBlDZRs%2BgZspasgEjrgT7nMd2nSnr1KZbdS6MVgsJ4%2BBl8QE30m5jqOJzYhiyf7K5vgDqlVPNaT%2FBwECPggutLM0pXaDVAPLjo5KvQa2aSSTAS6QFnCZqzIPAbExC4Ys7QH0LZDNQvB3TnjewuvFdpyX6fjm1fiLCVy9X1QG3mHoBV7fVsarz8YPAV8I9dtUFg78Vm9URKujS0K%2B%2FcWTa36TsZL5Cig2n0pcX2cWT8HCsJZDDGQrFwJ4f1sDYKXaru5LKlSh%2FsZ7HKCKBNgPgGwZOKsm3CNqtkp1TyyEB55liJluA8dVj11Vbd1H33hLGofnxCN8G0TAYfucYREKT%2FBVSClpnlkjmFAvTVuWTW%2BbYJjssZqFGQzMJRL8lHNk9qWG61GoPQ%2Bb3UplJ9FUfVvrRWbsOu8VKB0wp%2BTUfroItIPrCuu69khQ8i20yOvBnK4Aukd3QjRZMctU8YEu59LnJmlPYQUiRLXjCinabPBjqkAfZZO8eHrx2%2FnLsatS56R6IkQ%2Fgi20rnk0sY%2BnLubd8GiW8mvWmlvxbZ%2F2b7ht1oLRn%2B8dwX3mCX2y4UOn%2BbDHedOQK87pOXQWn%2F6H0IvuUx%2F6UuxN43WEhymVIwOSKq8GP5Fnwra7Pjx634Wc%2F3lc5FyOcsEPMutPAIHs2Be0iX6D1zNosE66Wf7yCAGpC6VxuQUo9wt5FoCJfqkbk5ld89lwep&X-Amz-Signature=0d583fed9bfe93f0f6d5f82260125d553643d5c514c8b2caff840f8f947fbd6c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666BNLBWD3%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034748Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDNeTBtl3NlRtxYTCd82qEmcH%2FJUWk2944cdb9AUIzGuAiEA7Pn3EopOZla1%2Fmtb5GYtZqwenfeZDoTgsnLorN04Unkq%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDFu9WgOrYU0XtfUOtircAxAiwMwgCSWYVn%2FtxvpYMfnZRqgZQVPACzo%2F%2BvSun0RnFtvMzrbTSz1MgVlga083rTPI4QNAiCECFQKvS8wfs1IIPe7KxkEwLo06uZlK3I2aWA7ah1p%2F6tj%2Bx28TQEAgIhq4j1qILY%2FO0x6jUnOkBvyZaXZsHAK44mF9ICpSE5vxcGrQ6ju6FtGdj7Sar16k0NzhHrXOVnkDrh%2BhnH8prSmoGxfUe3kwofdbUC5vX%2BrIJndjbXygMQmS6QWBgJ2V3w9JFxAwJLjwoI8EJdms8c9mThIitOclYH1RmXcRelKw72oFSt%2BS6x1CcMhvaTfSS%2FU6eF7okPKOUHXAjdYisfUSKVqflxCye948qHTY9f7dLQW8yOXRSB%2F0ggeVy98oXOE%2Blgwi5puq7pcyFaYnaYJmLVjQ9fyI7x0nNtmoX3SU%2FnDY5odYBMFCB6fL9%2BIlA%2BC%2ByEbNihZ6smj77ZSgusssVbrZmWZwTSnxdmF0dNZeHsUHSvR5KO4WWSMme0%2BBW893f5D5W9T%2BoHNK1C8SKcy4%2FEfmprUHyng0%2F%2FonoeIoJmcqBJAZc865DNodM4SkbjVvOv3tHxg3KCp2FouH79dw%2FsfKhHf%2BFnB8IRFTqWQ4d1gr6yhom8xZYx5GMPSfps8GOqUBSfRSdiKUd6xe5aptSeBbNHXsKjV7W043wM7UyAka17rSWrGjRfNcZZVKXfVifmwpLh0%2Fkzj8Y%2BDgexrlGfaRrDkhHnU1CfhlX4%2BnWJgjexKHq58wCwKL77R459cdThlfDYFU%2FDYoE8QhNY09RG5rIOCzcOa9IIWs6x4SlgiUGfW1G2O6CDpBUBDwFHREVrOEv6M5owVv6lKMyije%2BtcXHWc6g9Gy&X-Amz-Signature=21dfa65017378d334db6e828c9fe45d604357ff653dd04499122af0ce44dd1f9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W6NYYKGL%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034748Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFwb0ZPvuzQn9t0HEVyDY2P%2BUOzl33RFQvxMVWqMnntTAiAN%2BX7wWQVQAGo8cgImQUmG8sALFWMP639JTE0kmrpxeCr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIMOKRITmoB3HflPX10KtwDFmgm9mOH95AprKTHIbE08aHWSOhhQEuJ3E%2B4soWkPbCvfOm5yiq4KjA4fecAyeG%2BLO8a0qyEKF2%2F0Io6KUtmx632tDR%2BblDj%2BVXjzpWIqZEJ94BnKUNrCdGfD4xcBue05AywteHgE0lEyEGyB10AERKwKHmunCbRVhy1sEgGoerJRMCtQyoBiVOrpPM6f%2FGP0Z8BGKYzI08cMLtg8BK6EPIL7fPxk%2FSjGwdo3NU8gbALEUDBryZvYaxKcn8N9O%2BPm%2FUgt%2BqnMnl5SoqWgxkQMHjSN8HIymDbsp1rry4FPYJIytBnkSb6FLjwskmXVHx3%2B7CEtJKOdEvXTiJROWWBfSfihPEQHXGTYM8sifxt%2FsJNBZkBXB2drDTmhnDSQHbRpb%2BlPwV%2B7q63eHr4VQesMcof2TZkYm6b7Y25PvVZhvLq3nJVu2tRC7HuhGnqHwJlYvOSu9QSp5MGMUWDFpPmgRrI4cip5BbWpPtgVBuMKhO6EdJcQXGUlet0SvxCccMFpY5sTssYB%2FuaaFUD4UvL%2Fem39a5ns%2Bg50RT0EyXbhQ%2FzsSP4h8ECL5EH5RZQ%2BuGMVP8jTVKGCP6YWxvWY643Smz%2FBrQ6%2F8GD8kfpokgFo51QU6a3pFzJgkzchNMwhaGmzwY6pgEWCu9VIeAjvkM2IIlRG%2Blb2SXnIDCapec%2FQbErtQlo5KgOp3SwokgBLNAk%2FcPiIGAVStLk75crE7xtbQDLRAZG6Hfr%2FLBfksUOXPlXuA5cAgLaTckxgIxQVBO3LjkRyu89DEUHhduDalq8eY%2BtVcbvGN86r7g178EVndrbW8T%2FE7e5ReGOrfBoDPXM7njKkiGgMktJPEwuJvtl1IwlALRvV31bEqKy&X-Amz-Signature=d1e3c0257f305c16d338e15a5c5a195beed426332e12001aedf9856b846d47e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LTDRFKK%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDrIzCHwPcrfBHwNYqIoZLniW7%2Bv1drBByTL%2BPKhIgN%2FgIhAIccrg6MF3V60WMxXwo3hUFis7ksvZ4BfgBE4ZbBMlC%2FKv8DCFwQABoMNjM3NDIzMTgzODA1IgwGbRqg9s8FVoYhx7sq3ANDCCDaE%2Bz%2B%2F8wosMBt2uNcphiXma9QtSQTuhXX8X1tU2AelItwNGFbx%2BBsfOxhBZqtsINx67nT%2F24xo9otoji7cMoXOoBfJcOpHAOg6Th6F1E7qq9JA6DCdh87YS1RtRrmszX8voLswxj6a3z6zxFnzQfOf%2BqhBf03gipFAppYWZAwgz4jbzMiiqnKLp9f48Nk81rHqluwJBsIztUIUVyOAN41Zw3dq%2B7eigy2zoAGqMJKX4JdNHe%2BVIKAh922zlfwEMt4GuVvqRspDPPHjG4%2BmxnitXISwA%2BGHEYLFoi4K1hi0k%2F0vHvLBVgHGmA9e1siOH67ttimwGRdXNdkFL64rG44c5IzrFGkI9vTao%2F0RMI5ZzINNbCo16yAoRAgX%2FLPXGvv8Z1p0DcqQCCVjJiTugckhjGQ74NllKbQbiMFgtUJoMoqcMGBBSFcoKqf6YSl8bjRk2fSOw0jt36bGNfUiJ3tCyB6I0sKzK7h%2FL%2B9zJPfe4J7lU8ICi6dV%2FiWw1MKppaK4IRXPsyX3LQJaxrrwvOTYdL4BoBqUHhx9P7ZO64bwe9aWXBQa5AfCAjB0wgLO5zreOmnmvBZtlNZi5mo0In5LUAg0pxbCQzTT492033BEWmIrgsFSMFmoTDrnqbPBjqkAdFadMLq0PcyKjC7nsgF5bHxE5KfXQZx4muvqwT5a3BSto1pM6SxlqF9CQdmltP3U0y1Pmqe5Wi0PpwqPI4cBV6Rx6OvYoj3N1sbIMr%2BproLnzW%2F%2F8qmoQMIjR0pNe2UZKmgpb59hf%2FOKA%2FaQFfYBhFJ3fWQT%2FdZS6Ug1eg%2FR5djlTMAKNBt%2B7ndcU%2F%2FDSubUaRP3iLH5EhzF6fHjqPdRDQ0N8ZK&X-Amz-Signature=954f123e6ecc85535834b2494c04d848aa5eb828f8ce6eda929603d119e2adfd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
