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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46633BKAVNR%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042207Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDpL5ALbVSDguvcucE0inErdJgs%2F7RboLxWDQgw3INzgAIhAPc%2BqiF7QtwRK%2F1jR91xVUmzuFC8WINDbwJtW27xYlLnKv8DCHwQABoMNjM3NDIzMTgzODA1IgyJhXjO3xmNKHPxi9Mq3APWgZxOrlHRL7A1Sb%2FJngwW5Vfi9Wt%2FXCx%2B0DiZ9zs1k2RfBOwUQUefNbQ05oH8YGcUDYbJ3h7xAtDVItdRMdhFL6SXoT9wsJRoJ9XNl1V2mXcrnJJMHaXPnpWGBqJXqsVb5Q%2FtWCiVGVsI64FWROr3OSOGkyuozOcSGDfuOAv3EuOEIEHXDF4nSN3Stsv9NWuo9rozekbmGdPI4OFBdG1bN9389%2Bsnc0YXy0K1%2BHZqQXdRaHCQqNuMbZf1NAamJPKeEAbTA3KraCvERvQjkOZmRsQ%2BoeKai0dYZbZ0h1OPj6m5WS1oTJn6sPvHaXdoQmw%2BqYiXVEJDsqq%2BIV1R%2FoQz2Uj%2FdsXtPJoucA1Vz%2F33r7dUf%2FBmrtQ9UY9F7I2s9dHHoM7wz0uqj1fTZY9uyJLPOFu9Qzk3kOTY%2Fk0ZuGbzWFB8Nz0BsjHbatn%2F9sfwjKQ0cKSwN6PbvTfLrR1Lcitf3XBbc%2BlVhiW7qPOxKUoIk2m7H1LNvhmtXIZ6lUPAJ73ss5lkUaQ0AZJp%2Bx4xzC3DzJuYJNYcVDbPTZVHnUczS%2B%2FzO04jWwVX0ts3g3jD%2FOgttxQrRf83E2l7iAgXLHS%2BgCNHk2F9VbHA9eRU3iUOHmBsakWeYY8reAwhYDDco47RBjqkAes1oeHjy5IULX9wE%2BK0FhE6lzpURmRAxnPoGzbMxGuDZA7XklFxll%2FrcjjgIOOgBy45cVZyRjSr8cROC1jN%2Fw6Y5t0149npk7sm9CjME9yDGvdjQkJcwGO9cLoCGo92M8GuQOcnvFpb377nSmZOgW4%2FlD4nb5UfhJcVrJ53G0xjZqsuRHVRq0weny6QBaAsXZvO3ixHmwc1PJ7m68TyWexkTwI9&X-Amz-Signature=8453c112934bdc1bcd5b769bb0869b258da91599b0336fdd2cf869a9cf88c307&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VYDVMHE6%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042207Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAgx9ZD4zml4WcxraOz7B896uVgYo%2BykxhKXZUhHz1fsAiBlNm7FGfH2gyt6y4IOVZInM3NQgrAFUEfaeKBap3O3sSr%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIME8tof4X3CxCwI%2BgaKtwDNkP5%2BrmQZ6Kfd3D0G5ECrV3vY7ef%2BULP9prDxdaTgKyaH%2F%2BksgBeV5nyZR6tD07KOAroVjLKpKyg7cnQqt8csMTRyV9MjwMnEOkY8%2BnNCrV%2BKhiyRxOnjRyIUYH4cIe5%2B5aVtq8gdz9nHsdlBjmHhzmk4vedMdZCBKtdcgoQqqK37UZCWmzViDSnu8gSuobQglL9DcZ1diSji7MW5337qsV8OfXs2GxgGyQfGzew%2FAQdJX%2FixFTGROClSKevJwyCJz30gtzqj6T1bEE58tkbAECzTQ6%2FJ5hPjaqtpuOB5SCVmDCM99qkMCO0eQ%2FL63VMUBHz6dhYmuMT6fT8W1rqcgZwtpoX4mSoD27mIksYSH48X%2FQ3eR8eOnzrGPAM1LPMtZapObNGRgiOPfLaVyBURDpSFlUrA4aHe3SiQhskzxNeeOZDUki1BTBt0jMpJiZRXAJSqQpaZ34MeUHUnQb%2FUg%2FyV8QZ5Ho5YSs3HhNnJ5xTMPa%2FdhtiP3dvDAhF%2B%2Brpabz7SA%2Byaw%2FANx1Cmg3EZznA2FeoRWicbC7Bvu6yD2CLGwKYR2su6BHRcpLImA79ubVOnKx6LXp%2Fcv%2F2VyJPRH33jnDoCw%2BM2kB58wfcTGdFxbYPbr%2Fwe74AgUgwl6OO0QY6pgEk%2F8UKU3UVQHiS13Te25yy%2F7lCi0seL%2Bk7HliXfTFbv5fpiB7pmgjF%2F%2F4OKpR0a06jmRFGEjwD2wVSqWWgO7qVQ%2FzngUOcDAh44K2mPyC3URGKHylEu%2FEiZOxBbf07rWxOy9L63Kkj%2FUMSLWhABB0p0Nv70oJFhNZ9l%2BeYKAq7LSZewvzuKazGXUBsvq3hwfw9rn2zFXN90Wr9cgj5l1Z%2BLpS6MkDx&X-Amz-Signature=3ee4f0b3d8a43a0cb8dc2cbf69a02d5532d612fdfc91332edcc819eb6335df93&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S2HAQ2XX%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042157Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDdEYb4uYIOEtrdUi7HT%2FdT38ch5Cje45hXA1W%2FR7aTaAiEAl4h%2FPPNZzzbcRjOIp0fzF9UHEyKVP1%2BkX%2B%2FgsqdUq8Aq%2FwMIfRAAGgw2Mzc0MjMxODM4MDUiDNMzIbsoO5nkfirzGSrcA%2B79AsmYqqBeOX582c8XZhseAOLYulsDGEvGTszAoVExZkvg4KEeficMV7YMv0gu2I%2BIRmeBv8r7WKdxtFOgBXAE16Go9Fl7sphtSZR3LNaf%2FCxYm6nikXbN4lYw39o033qOYm1iHNibJ955YkB2lxhs08KE53JS1aUFtbA28u99z1La90U43bbrOvWaAMaVziaCAkwLQk9mxy2a9HWEW4OISEr%2Bu4yxI8W7Wv5XpJZnRrxgQyrN2KEMEw6gh5W9R7jb9TGohYlThCTsUBhPiIWk6hD%2FvRt6uEpHJqN4VECofudjDVdXeQztE3gv6w22NiKue8S375%2F0AlZigGUt8Ca5uzc%2F0TCdkgedP6vuSNdIhKMQRUW4y2xa0OUyOmSyOPbyyVZUZ8uIjX1oL7RHo1PA5eMslIXsw700oCFLDh%2BoqwEef4UQL6T%2FWERK3vTMyiJi2P0OP9qZMVNL6VPVF2yzkXdD6kD%2FBSQGDo4IHtI%2FhKT2HwKGbPwovTfmldvb0QEeUaHcpNW%2Fzty8Mj7regGInL5lKE9nvxI%2BBjmeBrHS%2FIfTduCwWstC8CYFH2R5q%2BJlOhx3COhlStmxeP%2Bu2%2BT1U0XgjsCR5S62%2Ffb1gaf19%2Bq%2BeyV%2FNgLbmaqRMNGljtEGOqUBCJrhaL1MnWkoyn6WZw2xOqhemIiw53vEI4NfEC1F9T27uWB7ytxKS3ty8TytILqRqS1Fi1YLy2L0%2BSl8bPDsQeKoOfbnQZ6bq4F1jZKjC50vHaS%2F2rPzUsFqgn8KE%2Baq%2B9sGgHsraOHbrMNthq5jyH9EPieQ7yyMvCXwu0YHx1tpF2sms1W4r8CICSt8%2BgxkeuMdByGAjSRN7mqQt%2FbDVxWwM6mt&X-Amz-Signature=11d3bb0539939865e30314d4caa4785916955fdcfdde067cfeebcc2610c06f80&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S2HAQ2XX%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042157Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDdEYb4uYIOEtrdUi7HT%2FdT38ch5Cje45hXA1W%2FR7aTaAiEAl4h%2FPPNZzzbcRjOIp0fzF9UHEyKVP1%2BkX%2B%2FgsqdUq8Aq%2FwMIfRAAGgw2Mzc0MjMxODM4MDUiDNMzIbsoO5nkfirzGSrcA%2B79AsmYqqBeOX582c8XZhseAOLYulsDGEvGTszAoVExZkvg4KEeficMV7YMv0gu2I%2BIRmeBv8r7WKdxtFOgBXAE16Go9Fl7sphtSZR3LNaf%2FCxYm6nikXbN4lYw39o033qOYm1iHNibJ955YkB2lxhs08KE53JS1aUFtbA28u99z1La90U43bbrOvWaAMaVziaCAkwLQk9mxy2a9HWEW4OISEr%2Bu4yxI8W7Wv5XpJZnRrxgQyrN2KEMEw6gh5W9R7jb9TGohYlThCTsUBhPiIWk6hD%2FvRt6uEpHJqN4VECofudjDVdXeQztE3gv6w22NiKue8S375%2F0AlZigGUt8Ca5uzc%2F0TCdkgedP6vuSNdIhKMQRUW4y2xa0OUyOmSyOPbyyVZUZ8uIjX1oL7RHo1PA5eMslIXsw700oCFLDh%2BoqwEef4UQL6T%2FWERK3vTMyiJi2P0OP9qZMVNL6VPVF2yzkXdD6kD%2FBSQGDo4IHtI%2FhKT2HwKGbPwovTfmldvb0QEeUaHcpNW%2Fzty8Mj7regGInL5lKE9nvxI%2BBjmeBrHS%2FIfTduCwWstC8CYFH2R5q%2BJlOhx3COhlStmxeP%2Bu2%2BT1U0XgjsCR5S62%2Ffb1gaf19%2Bq%2BeyV%2FNgLbmaqRMNGljtEGOqUBCJrhaL1MnWkoyn6WZw2xOqhemIiw53vEI4NfEC1F9T27uWB7ytxKS3ty8TytILqRqS1Fi1YLy2L0%2BSl8bPDsQeKoOfbnQZ6bq4F1jZKjC50vHaS%2F2rPzUsFqgn8KE%2Baq%2B9sGgHsraOHbrMNthq5jyH9EPieQ7yyMvCXwu0YHx1tpF2sms1W4r8CICSt8%2BgxkeuMdByGAjSRN7mqQt%2FbDVxWwM6mt&X-Amz-Signature=e870197f80c99545e3a577c091a3854164dc27b19832d3673f98505160e9e79c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VOCATSAM%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042211Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHxZ4OZsNM8ejnh6N3ub0RyBYLahgyKBozFa5BBBPlS1AiEA%2Bczf9dKnv0ZFpFL%2FFuAwPk62KZhwrDPBZ8TeMZVdcv0q%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDA4Bg0PA63ONIZcXQircA%2B68dOAMc8NBE5HRwiLcj%2BZQ05exawdUri%2B63Ka3tLUcNrV%2BMdAu%2FkIEh%2F9aXdDth9s3iO5%2B75%2FvylpHbvrOt0HUa3FryxrxOsvUwJWTooX3Uj61%2FeX7w3%2BefKWntVD7WIYOwezwaeQei5U7OZQ%2FmxAp9vy8kUYDwY%2Fk37iqFx2b3qenbNbo8p%2FH%2BYVZewxCdcf%2BUFFLTsLancxrMzyF%2FF4X6eXbj7vzstJjWfGZSRXLLT8Au3gZ0Vs8kNUTdnuqo51rOM2JqVr69m5KV%2FMhMbIBqO39FHE%2FbFlgUNirJLJyeF%2FCFaMTK%2BhElNtWG522VfgVyY8JxRRN1WChHk7gLyYT8kBPfzZVra%2FxGxliW94nbWcPZUv3yrNCvrhspYVtKIN%2F3s%2BwesorEpzNBaoeGCEwSIUFxZ8x2zk5TIPQ0635Stql7d4BAYNQzfNZ%2FDkYtaUV2%2BuSE1rJYI%2FNw2W3KrPjP0onru09G3ST9OCTGdpKk0IvxbWZzQhm6RVXK8olTdMKI6521NvrfLpKksZwKBMFiFBSJkshA26QdN4MbwHFT1m18udl6fWCAZobuWShRd7nTcOs%2BqGa6myTiFBeU3RqxoIUpYPubBS16sBTO0qxz6%2Be7SWdFCwIy9vFMOmkjtEGOqUBlPkKHVyzYQ8%2BtbPqW%2BCcv6PKPhREbk1ACWaepfj7VI5v1Fg9dOMciTdrc5ID6ylvQTTrN0q9vFx5V%2B5Y1RqBGJTdalqErSmy28rimPbVxsjMDJecKGLE6cYsEHQo19GHbDB48DBJ3eV0GMRUDRm8CzMMMWXZkIaSlano11OOw6coKQhBqLhzd3%2Fp5e002ISwCMyY3cZSGBuwg%2FhRv4IdeDNM27if&X-Amz-Signature=c6a7dff860bf6bfdcbc706980ada9cd6a760bd45577c5d53e6f86910f8a16cbc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665KNHKLDM%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042212Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD8R%2BNCo%2By4RYzpcnXQKSIvYFUuJ3Q4jyj4Mp3NfSku2QIhALSZM8T4UoqXy93pGUNZ9SOzauF%2FqDGD6UeP04PlJ6TKKv8DCHwQABoMNjM3NDIzMTgzODA1Igy7uVyalwUawczsV9wq3AMlpEadj0xIqve8uuSB%2Bh75Miv4N%2FK9OXDndmSiPFtC7aNF%2FxwdrC8UTDMpOc%2Fzf3QlKBswthGi5CbGFBbVZiL3ADtEayJ0YOg7mdvgfhnomVK5BjpZBSbGPJhhbU2BoQtBkXJzkp7FJapUqmJi%2B%2FDBBO1I9If5NX%2F5B%2FsCYELNGVcoEterpUn3c%2FLfBMAIG%2BuwiF6bdrEjS5Vx3%2BfYyNrViqPnhvf18t4uz1L3730ai9ljKxM%2FP%2BSzvMnnEb04C7hz2T95SQWk6n6vQNvYneZmkr2msDKAlVvggPuDWIn%2ByBZqYAvBXa0WRagYiyRKIb3gGdVwCcodOgr75xSCYx6c2BxzMd2hRjk1fI6LVWElfwkLm4XfdQn72RcEQ4448X6yp%2F4AZ1BvHTi0GTj%2FjZ4faQRyZk0DVzbcdbD81jqyV5db8daZFeZ3mzs5kYioQWm%2Fgmmyou2XxedIQwvEXplx0mbYbHVH1oj3s8bFpNiKFSXCcQ4vg2ayA2Y4DHuZvm8H8eD3bJquThXflE98tOovqen%2BaE%2BqO3y24%2FEF8%2B8zhjNjH10qfPjRXqz%2F2UHL3lCHAiP5kCIf6X9QfxEKn91rUL2FWwr%2B%2FnuNJ7%2BAt8BEQnJ%2FhNMeH4BooQFY4TDxo47RBjqkAfTPzyiUsx5ynt%2BQlvPODzQdFAG7Z0H0qYmhW6StT4pHyMpcCQGDjx50H2H2w7k9iLrqqCGtlI8A5TCH2HIwUnMlxFwBaLfy%2FdfaA%2Bkhgz4LT4tTlNU9lbUcavh%2B94gSRKA0RMDme1pyOpeQ9zD2AcN7sWUbTC4Xn%2Flm4LjnWYwOju2VP6MDgJ5TIsGY%2FcCzvIsv9m3MSl4uMQFS5lIWtWvvbzHP&X-Amz-Signature=5071db4e5cbb9c9a0c357c77be7f5f2408cd08d694380ad7468ffed7bf5803a4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YVJ67TIH%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042214Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDKjWgafe9fXl3RFAO5qL6MKK0cfhUenG4dDMO9nL%2B2%2FwIhAJloNODT1tgqnFJ6ctQbGzShffwfNEsp%2BmUfIyN76r0YKv8DCHwQABoMNjM3NDIzMTgzODA1IgyhTQa4Yo6IG48OFoYq3APSYfQI7SLKwcbXes7w%2B%2FONnD30StW5zejmN8FukpzPYfqRwNBrGTQ8hc6cxP5KxUuU0AJlIf4yJ26WC9JGHAfD5GrAe7b6Nw1RXMBWQCpW%2BnTdxaoYzzvHYtgCI3PyMp1wqR%2B93jEzoFU5bD2LlQdDm0OZGQ8ovOnF0fnijyRRYER5I5RmzkxNKtaIJEtwRse0blSHYDHusARZ6HH0vTqn0tbFKEDC2rHJL2lV3A3Mh%2BzAdc1HTGJn1G34YwQwJFIVzk4fckkwK5ZMVaSpId%2B3b9phDCqjliIgMuQ9ZmgLbxr3fzJCMhstjnkNMs9I0QKbKxKiDnrgl1Rx5RNfYbYBvJ1GQLeKTIjJOfMzUV%2BokhKXJ8UQZK%2BFF5wuCBQ6AyCft9qtx4wzkKsPNZhg43OUJmd7XQ4rqeaOT4vjQXGx%2B7exIoyb%2Bejqcftd8r3DsM%2FwmdFPtmJXufVUcBFo03r41c1pkgjU2RLd%2Fuk0cpxrSJuZ1PCML4cc90s6ULY1VGubmD9480AiWQBKkqTHBSSe8AaHEjNKnrVOWYBr56%2BPohk7xUO5bEDLo84oLHClwdubCedy%2BZBZOpiXeWWTd0bET7MRP%2FwoATO5ZuryW%2B2zM31I7rJkMVW0jVsHrTDao47RBjqkAVeA7U0mKnvsivFvSabbkhTvz%2F1KXY%2FAaMkJKLMT5ve0vFSHGM8PUfqh6%2FSykZQlgQuYu2S1OY9TiG7oV%2BEJasND1IgitM87QZeNDEHJWjE8bitqk15bt%2Fiyd6gYDONLwM2ONOxcEIlZAP%2BSvB8BGZZw0NXnk0%2BACyFr9w4P5Q9eh7QbAlWgVgu%2BXY8Xp7GWdvEBs42QjG3qwP5jwm3JpNK1vW6n&X-Amz-Signature=e5ac95c6e3d7440f938b9bbef934ae74db56204cddfd2384f5e7ad0697c3ddfd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665EPRPN2R%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042214Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDXUNl5USFcRCXllhrnOpXECeqgQ97eHlquyhPxUmJVnwIgbEqFQDYUhCbe6JAEKj5IK0BwXRBz%2FF8c3G4hGI3Zhk0q%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDHbMuVZVAQ5Fj35l7ircA5%2FiMwVt10p%2BnMZ%2FoF11riBCGhAXqtcJ6Rvm%2BldHkBKPnUvNGb9Yh7R4KkeDn%2BZPVg4X%2BU5Gm08a%2FK3602PXDZFbDr8%2BRPx6BpkaFdI%2B2gWrSxziCxoOe0JiUUdlv%2FAKj%2BJGGFtBl%2F%2F12G3sQo4EDslp5uGDvpP2T5QyPNoylgXvNhMDXA6h14VAgdTLJF3z3Xpbju6fQtFO1NjNYvWiFFRDK1wZ7TlsGeuzLOdbKiHWFSZnEgwpJDrpX1Nxt6GtpnvkVeZzwWAefp3iuRuRhycyt7e6%2BteowvzjXuft39HHcQiGB0zpBeKA6z5ocyPIaq%2BB7HJUkq%2BkpsDr%2FuEIgKxEnVE49KzOh8aphpwDbV2c6FhLbPwdmUZtvmwdNJ6mJQ%2FBe89dzU6nUv%2BC%2FMpOY2DHVQg7Dcgt0TTmUJT4b7Udk3kgN%2BdsdIOCcHF%2BNYuS%2Ba%2BpOULTd1zfOaCynDmwz86BnGO6Dvob8DhOqHgldiyHmDAhIH3FhzJo8Q1ug2TVIywmkUWYJcTcZvRo0xUzc3wVuNGYj6eMUJpVdc13TQuwf3tQNtCd874nMUmqMxVnviM9J8jODy4mhA%2FvAZwpKRD7rF1CErIB7fZPajGlZjGb4%2BrgrC34Jw4smgUTMIejjtEGOqUBI9vv6v%2BoaWAUQV2I7Hz%2Fr761WpY%2FwXZfEijTUYfGSz0Y%2BkagoaCsdjNwiCh19zsFwYWyLAGRj59%2Bkbm473AaMi8R65UCYl9y2pKgfJ%2BQcZWb%2FzAfIonwevm0BMpCYjpP%2Bw%2FDUbIB54sRAaAqSctgBfVvxOnXwUpkMsOxXsj%2FC%2BozZv88ihySnBLrNVb5IPt5o4xHOlzH8mvirAuHw5qT5D6LwT8l&X-Amz-Signature=2ed5f1f8bd46a0c224f93b4de3cab1a0fd7a4c657413530ebebac07f6bf43557&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667PCJX5A3%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042214Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAYw6CvW%2Fe94%2B9QleLEWhe%2BEMkQI9tsXXOwuUn9ZOPimAiEApknzBjyfHoBDOph%2Beqt1NRcem0dHK8nlwak%2FEJCxtvIq%2FwMIfRAAGgw2Mzc0MjMxODM4MDUiDOpSpFGZA5vcp5q25ircA%2BZfKjqF36dpoiMzioZPuLkqQz9mTujDYHjtKc%2FcgYEIxA1JkPMDZ936YayeH1Hz2jL%2BlDMU%2FCtCHGzB6B3J4WQMQhnut0mDdZIqK69KDUNfYlrB4xFHTYHI4RPX6kEE3oSOE%2BfV%2BrztpW4qI8NUME4NILGjG3VmpkxlA0LjdPUm64%2F8rwPVryDvGVQSmtSyG3Y4gYoqpdAM7mmN3PnbzKSUDIhWqLmZbPsvUKzpBjU4UsfltVeanq61rgWTZGLoGI2YjApq3hL6tB0Kvcmw9Tcz7SssvvnM3xHXxYh2UG%2BNZDis6AnQKgfdWe2uFfbbzML7o0K2I39N4GP2Y5SrYZK9QNj4ny5zXEqyOYTcvt2Sd1Im5d1iuQdqrlFqjZdVj0ujgIJLc04Vs5B657a5J0XP7M774P2Wq7GoH74I98KZNbBPuvvOlaY%2FoMvFwNgzq5gflyVyW0OPKqdm8b2erZBV%2BAEWOoR53t8MPxCqC8rV%2BlfWFYEGWS5UGNb7E2YKD%2FGTdsH7fM91vHvp9BdTEVWaf6mMDo6fNQxYgRHTn3LyfnZNExoKj9juivnH%2FUvehrDhJFx4%2F9c%2BvX2JXcSBfCGD8iXfF%2B2H5PPuE9rQkjo4Kg9CZFap2UeH4iK5MOiljtEGOqUBGzTWvgK%2Fxi1Iy4WbUQ9q%2Bw7Ud392VZSdn77QK2IGQz24rlcpiLre8MOOTdAZUdOynElt%2FPI0gKbebRWw4dAU4xMTgiQuaKBFc5Gaa6Z83kxJZq%2FH3kJOzUEBgCBwaJKpX%2BlMpw7OTW3beohwZ7VJwWu9jlR1vcUqhwWctzSe8mLqUEYUvnzqJwZTY1bjIPST4QHzH2AWKuDB8Y8IJrmZnC1jSkbF&X-Amz-Signature=63aa72b15040f154a7433aa477efb7b51a2233096b453805252a6a2d2e2a149a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S2HAQ2XX%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042157Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDdEYb4uYIOEtrdUi7HT%2FdT38ch5Cje45hXA1W%2FR7aTaAiEAl4h%2FPPNZzzbcRjOIp0fzF9UHEyKVP1%2BkX%2B%2FgsqdUq8Aq%2FwMIfRAAGgw2Mzc0MjMxODM4MDUiDNMzIbsoO5nkfirzGSrcA%2B79AsmYqqBeOX582c8XZhseAOLYulsDGEvGTszAoVExZkvg4KEeficMV7YMv0gu2I%2BIRmeBv8r7WKdxtFOgBXAE16Go9Fl7sphtSZR3LNaf%2FCxYm6nikXbN4lYw39o033qOYm1iHNibJ955YkB2lxhs08KE53JS1aUFtbA28u99z1La90U43bbrOvWaAMaVziaCAkwLQk9mxy2a9HWEW4OISEr%2Bu4yxI8W7Wv5XpJZnRrxgQyrN2KEMEw6gh5W9R7jb9TGohYlThCTsUBhPiIWk6hD%2FvRt6uEpHJqN4VECofudjDVdXeQztE3gv6w22NiKue8S375%2F0AlZigGUt8Ca5uzc%2F0TCdkgedP6vuSNdIhKMQRUW4y2xa0OUyOmSyOPbyyVZUZ8uIjX1oL7RHo1PA5eMslIXsw700oCFLDh%2BoqwEef4UQL6T%2FWERK3vTMyiJi2P0OP9qZMVNL6VPVF2yzkXdD6kD%2FBSQGDo4IHtI%2FhKT2HwKGbPwovTfmldvb0QEeUaHcpNW%2Fzty8Mj7regGInL5lKE9nvxI%2BBjmeBrHS%2FIfTduCwWstC8CYFH2R5q%2BJlOhx3COhlStmxeP%2Bu2%2BT1U0XgjsCR5S62%2Ffb1gaf19%2Bq%2BeyV%2FNgLbmaqRMNGljtEGOqUBCJrhaL1MnWkoyn6WZw2xOqhemIiw53vEI4NfEC1F9T27uWB7ytxKS3ty8TytILqRqS1Fi1YLy2L0%2BSl8bPDsQeKoOfbnQZ6bq4F1jZKjC50vHaS%2F2rPzUsFqgn8KE%2Baq%2B9sGgHsraOHbrMNthq5jyH9EPieQ7yyMvCXwu0YHx1tpF2sms1W4r8CICSt8%2BgxkeuMdByGAjSRN7mqQt%2FbDVxWwM6mt&X-Amz-Signature=b79e1386b867fdcf39f42ec779feec3a3a6d728ba0777e595fbcfe116bec8379&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
