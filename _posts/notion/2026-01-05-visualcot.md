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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46667HBLWNY%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034217Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEwsGnIYmVWeR4l8Z1PDQN1PLY1kUZPkj1Wh0aONsG78AiAFrveMA%2Bvtke0PvgFfhfiP%2FhHgh%2Bxqy44MyGre7UJFzyqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM%2Fka6xqLbuA9fQtt8KtwDTjZ4itGXuVaxOnDGIEYJH8ZcKirAepuLUwUMxTVCbbtIx0qhkIyyvCKKAK629QGOBbuN9BSon6Nir%2FH7M89rulQISZpX6YNV%2FecRUnCKtef7pP98L4NJ3FGMn5mTHmyZ%2F9h68ttQzhH8p5K8aPxRe8RFBgYpgeMroNkQE%2FdSG0b0U9JFQ%2B1r6wbuu2ht1xOaBSuD840f8idCvaFheA1AS3X%2FACR2VOZ2MTjs3uJrZyuFeN0em9FRu31sJ1eLgaYcB3IIWu%2FvRi7P99SZpNRlkx2v8pcmTFS5m9BHT0R492r3HAPx2%2BOZUlmW%2B8CHkpnHT1U%2FVy5AJfUVeDYmZAGEg5VEhldPwCFlwWoMMeokYdBwCcsApttMl9xYlD4Fzfm9dP1ZuGDIbo8qoj6hbRKVFa8Lngvn6hJo%2BlshcK4SQoUZ9JJst1aZgtI9CE%2BUD5TRovGYnvEVEj9tRUhnHK3nw8SgrGHOah2oKE1h%2BOTdEK1mm4APcaz54hhxI1NOPOMwxXpv82LYE9pclR2KwKVVANq9QPQCUSys0tWNpT8hQRJ%2BUxOkrH6vFoD3%2Fyz1UH9Ma%2BdP0E%2FDUrdyQNXiNtCmRRWHvRsQa1GfwAC%2BtVOMRfKmM%2FanokYmYcxYl9Ew0t72zgY6pgH5rVEn9S3p8LrsGLMT0RZ7A%2F2lPaIuBNJkAnxYYUJkLoMqAjedJ8LT42XDNTXFEE7DKUn7QlbEXNHJ1TeATUSZWxWe2eh7DOiY596ODfmgejY%2Bc5rVrjZRbb2uRNccmSFaJgIP%2FjAjcvdso6oyM%2Bwm%2Bs5p1E3lqwQWmKJhR69xix63L7IvCK2%2FMSdoEIARRV96pcJt7ylnU%2BsnBmi7dYILg1%2F2lw3j&X-Amz-Signature=0ffccad92ca955ed91b9e0a188ac603bae53828d445854e5fbedac0b5e51364f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZWZMRZ3O%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034218Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICJ79duxjRIV9y7t%2FEt2dHzFXUntscuKI%2F31zCM1sx29AiAKoFskxCvYV%2BbQvps0azUiF3nh4p3Ybm%2FTdR6RmG81CCqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMmW%2BLHW9DGGDTjAoKKtwDbS%2BvdlizgMQqkgo9aOqNuxYNKmAnUvHRr24CqvyjOlUfZhNqnhWTHowOLBH6RfJum1S%2BJEkazmqD93ftgmdcquOjwqIHYmxZhDXJjkKZGdu6%2BYemdye1k0F%2BOVJUpyE903SYOMevwlAGD2NM02CktMi42pl2oZSpBYZvpwurgSrPdy9HMJij2dMjMwznk9k4e6hI1tW4T6EMv1jg3oRHrgTcqVQ1xeIBQ1GfdBSZdWwrU2qbUJwLglNXDP%2Bpe%2BwGGH59EzExANBjtmoPz4n03h%2FIjktabMV%2FU%2Fhs2I9h2uKr22FPSuZtSMPwk9s9ZRoJD1UPhTCNdsJffucCy%2BPoHlx43ZyCurDhm0bBZ9q4CcCq0KApuk6ZIquxglIJzvqrrtUPY04UporjvBYpkaeZqjUJ4pI0jyz8b%2B6%2FYDctWbeoVgt5J%2F2GqdRFRhC1J0a72G5qClJY6U39uNgPbUzcTMcwu3sCpzYfPenRUQeDfIc4CcGvMd%2FJbHA2E%2Fs5FDMIDneF8rD%2BEg1EF4difqUxME07MujY%2BQfKDRos6xin64ftPwSkBdIDGCWuWUUCysp3Od46JqTT44gw4TXsIMUWIdbMX%2F0h6YcE%2B74N9B%2FH3ZjVzehw3aAxeX17UFEwh%2BH2zgY6pgGLTPZCnpriUBg2jadcPlZ4bpfd0m2sMvBUAhAPQte3GTzHdrDlpBc3eFvWHSLLIKRZ0%2B%2B5l7YVw6g6Byv2VF574p1a78gxUQqNw3qEci8imitYWdC5z6dTqbhGm4zkqg3t1w5NpYByqETd0iJjVxq16cJtqVxjY%2BprLcL3RiYGp4NRhl9qf1rIsh%2FpQljafjYLjcYQ3IH3L6wcBdz6OHoSJfq8D5cA&X-Amz-Signature=931bbb2c5cc6758731acdcd7c7629a38ab52499f3c885a4f6a139a1ba5d95d56&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YXJH4LHA%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034212Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIG2wKcHvMDxYHLcYpxZoqra9ioHJ1Tn2rhFxpXkebWaEAiEAhZwollSnqM%2FcVQAA5q%2FsmNlcCf5sXQ6IVaKWsNi4%2FFEqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDK1pRYC%2Bm%2FE9HWH%2BISrcA3D6fs3w5mpXxp8SknD3uC6tSFvdJRYaSBUkkHZ2%2FdszpVOHn7C%2F3yPlz%2FqZ3CiYslba6%2BNypWMTu9Qw0EgpqAC7vmf8qbXS%2FjQAeJFfTemhyF0flNM9YxbJNoTDQDRFBKb2OOLD%2FJDlK7gif0XuOUWcY8VvyB7dh7BAkcd%2BT7grCWR9uZ2Bv%2FskVk45vn5Ti2LYHauuszXTHxxPUfQVjqUuq1%2F0Xz2gCNBi61F8KyBkamuXawNWSy3yp6%2BhaBca37ikA7lHwQ8QgByvLrhF8EjR1JwJegsDZpmAK0%2F59J9MMhuHFgmoPTPBaKFasfD0qaBtdmc%2B9DY43M6RZ4nQdmznzurUIfRSIRMIlGRBY6qNuip12slomjy4n9%2Flm3D2H3bPsbUiCOK2Qyx3dsoCI%2BLPqZcRCsm%2BjSALfDJmAAdDDYrKUh8ze7rq7PatBFLOcxUXGWnJ36iu%2B2W5CkaVQVPI%2B1dHZL8RQ8%2BcKxQC5Zpi2%2BOqHUGginnoDuoy54W0eJe4teAzyl0tnkBEHfeNTfCZPieSyrIZ5fhtFZHHgb%2FmxsFbD0xDlXyCAXac%2Ffk6cMpamC2b%2B9VITSolG3azm9FIUjwkF3glEn%2FBHQBJXtl4I8E5K%2B12dtTcZPkVMKTe9s4GOqUBxZdmqv%2BkBleELvlRYLDrObIWYu08NwOSam7h7Zgo4YhwwZ3BmRC0exfo6qiMT4vTQN4YhUgHBiDAudEVWvwari0zX%2BjV1YIME6iBoUQlGDpwUbUzq8xOih8YzE6hNtmed1bZZsqwbPnnsHmnk3EbbUOcb7LJCSpDv82xUk5WHS7P5JAoHAohr5KAKfjUPDKCrUdh7EiAn4G1Bh6tDSQzXtefH6i9&X-Amz-Signature=868b1868f5ba510765220259b21137915e7f370a923ff0b2a2c07ab5497dc6b5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YXJH4LHA%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034212Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIG2wKcHvMDxYHLcYpxZoqra9ioHJ1Tn2rhFxpXkebWaEAiEAhZwollSnqM%2FcVQAA5q%2FsmNlcCf5sXQ6IVaKWsNi4%2FFEqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDK1pRYC%2Bm%2FE9HWH%2BISrcA3D6fs3w5mpXxp8SknD3uC6tSFvdJRYaSBUkkHZ2%2FdszpVOHn7C%2F3yPlz%2FqZ3CiYslba6%2BNypWMTu9Qw0EgpqAC7vmf8qbXS%2FjQAeJFfTemhyF0flNM9YxbJNoTDQDRFBKb2OOLD%2FJDlK7gif0XuOUWcY8VvyB7dh7BAkcd%2BT7grCWR9uZ2Bv%2FskVk45vn5Ti2LYHauuszXTHxxPUfQVjqUuq1%2F0Xz2gCNBi61F8KyBkamuXawNWSy3yp6%2BhaBca37ikA7lHwQ8QgByvLrhF8EjR1JwJegsDZpmAK0%2F59J9MMhuHFgmoPTPBaKFasfD0qaBtdmc%2B9DY43M6RZ4nQdmznzurUIfRSIRMIlGRBY6qNuip12slomjy4n9%2Flm3D2H3bPsbUiCOK2Qyx3dsoCI%2BLPqZcRCsm%2BjSALfDJmAAdDDYrKUh8ze7rq7PatBFLOcxUXGWnJ36iu%2B2W5CkaVQVPI%2B1dHZL8RQ8%2BcKxQC5Zpi2%2BOqHUGginnoDuoy54W0eJe4teAzyl0tnkBEHfeNTfCZPieSyrIZ5fhtFZHHgb%2FmxsFbD0xDlXyCAXac%2Ffk6cMpamC2b%2B9VITSolG3azm9FIUjwkF3glEn%2FBHQBJXtl4I8E5K%2B12dtTcZPkVMKTe9s4GOqUBxZdmqv%2BkBleELvlRYLDrObIWYu08NwOSam7h7Zgo4YhwwZ3BmRC0exfo6qiMT4vTQN4YhUgHBiDAudEVWvwari0zX%2BjV1YIME6iBoUQlGDpwUbUzq8xOih8YzE6hNtmed1bZZsqwbPnnsHmnk3EbbUOcb7LJCSpDv82xUk5WHS7P5JAoHAohr5KAKfjUPDKCrUdh7EiAn4G1Bh6tDSQzXtefH6i9&X-Amz-Signature=9d244241d04e5165056eb972e03fa1ecd948ef49085f9368ee8348294c1596ea&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466547HNXRS%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034223Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBGTOkbLr1j3QjkfpaBK4SQwrLpbvJjIOz0xj0NSSF0%2FAiEAksRtDT77bsGokUSbiCKQj1xsztke0tbldy1AsrOuOToqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDB%2FCCLxFjKfVp7%2Fr9SrcA6x%2BPv3r%2BM8ylOqFZQZwB5IFsezjjk%2Fx%2BYYjnnfcTLkwkaAI6zvo0r3NQ1RbJCR341gHf5DE7LRNJ8RjX%2FZ4ZXaUa2GEfceHkXaiqM37SKPTmP79VcYdhHSdCmW%2BAHsVXokTg2hGaP6J7AL0O2lz3w7MG3LZUWlAQlKeldBDI73I6WQSTqrQ9DHrdqhITihRkODKCoghkeLNuhmArIIe0IfCgu10py9iSSjRBEcJ22qHhJJiZgJdZpnK2VTwjYhaFQI92rPibBOZYW8JzTP8%2FyLP1nLW6YqaxxU1KL3IdXhjZZFJEmHcaD6QBvnVgX0BCNCTvo0quaOl8mme%2FcCOhQakhWn82tI5xdaWLrKrIe82l2MK7cCpZF8ZZHtpgAte4RhVK4zcDgaG6n6vtLLWSdRdBVC9RPZIErAD4FXEw2v2Mk8qhtmZw0lo5Zzr3vt4PyZr3IXCna3bR2X0BjJC%2BvDqZMJZhiu%2BeVT3vuAN8lMbCvoxr3Z4nGnrw6IhSMPDgogUiHPjoZLYjvWUIAmdx9NGrsCyQtoKbTqYz2Tv%2B8Yd8IGyFKXJlxzP1nlRce8mqxsed7X%2FTHUu%2BjAU%2FTVIg%2F3IhpRYWIC8o9t6YwXvgTy5ebqdq4mJz12%2F%2BUYQMNvd9s4GOqUBHyRgp%2BASzRopHTnhs61ZDgHRJY%2FooCZUUZUkO4V26rfgr1usKUm1oihtVFt%2FarQ4ghM7txQbdX5o6TDU3IsguJ88QvOfXhxIdBYAYS2DTsENtyUNOcOxv0I7oSFl2gYMNZrKw4SUg7OIiUWRXr3%2BObTvkS9R6qZiSZxCx6ID3YMgyooi%2FHi17UyIWxNwaDoIEQLQbjNRr5DjyzxFIlHncA0kzIA0&X-Amz-Signature=7f22313fe7b87b1ee2a0fb7d1c0f25d2d745d75d4a99f704bef99487161462e9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663M4UQVOS%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034226Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCW%2B%2B5tUZ1J0DlzRu3nvDUJ2AvQ2IU1qaYiPkc6nVV3EQIgFz%2BrSD7%2FY7y5QdFbXEJhgfRd%2F1XQhqFqfGw5EzWmU3cqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHU4qiRfl6lcvT1HQyrcA%2F1uc7Rf%2BbCbXMFhc7Urvg8bucjBCqQ9NPnhQbNu3I69%2BPqZ3GieUGBRvpvSsHssfvMpN4hJyOgNhQ%2FXkwKnfcKZpbEIwvMJthMLQDiTzcx0CWvtVXNPIm0hBbagUktDhgeMbj5FjCO5t0hTwlnudVeI7Msi2Dk%2FxMexbmxW8xRIparAYDoXrBmKNzmKQT1pRNsZi9JX7KGDOZU3t8qGLEcftJiyQqqHy4tWDtdtCCCZgTFCYJB1Rn1R4tlsm84%2FUe5MMwTbjcPK3MBX%2BnZu390hTjybYrMumsgV%2Fuk8FRxFac1ahl5CJUprkyzffqm0HNXbl%2FURhVsQWpkDcV0GqcO316UR1O4qHtdIfeCmRVS2ulR3CFqLC0BNuGZFJ270jij%2FNfS%2B9chqcuCpqy0qa74V4kMQbe63vR%2B1YnRL%2BcINyKjJ1JTNUvzfMoAFoOPWyoL%2BbIfZ%2FTeT0DvbI4eGfdQnWx8Z4lN3B8szsYdF24CTDJPxR1DrAPnm8KZtC17Flf9wZj7mqb%2FVKICkabEBZZi%2FeB0gvLUhrOdegyZWjVc%2Fm0msR4bWlCen9bNGdaY%2FbmXQkM8RMW1F6uNku99Kg9JmHCRqNF6PPvxkzkyZhf0cMiRXuDEdPE8NChC9MIjh9s4GOqUBcOeaouH306VcPYjPYR%2B5ZzYz1Zdo4gFUCm8VWFVvn9lrdkP2d82yklTi8kh%2B5iyZ7TplZ430ZiNp6yrL5nmPsFZ21jarYOv7bOPDGVZqYVVWV1iA23z6ACZVnipl21L0cg5kukULoQ2%2FxgwtM%2Ft7e8%2F%2Fa15Hvopo3bjvOFnj68OFuOfpEhAdvm5fONnPfGrMmvJu97mE0vlRav2kGCsrwCgG4O23&X-Amz-Signature=005f3cec4ccd78109795ffcc1f421dae2d4d7878034c8bc45fced08c09cdb4fe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U264M34G%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034226Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEnGzI7wE%2Bmb5eag6Fog%2FMPeyyqfXz1j1NsTi%2BGpvJ0EAiEA8MsoWT00KX71jbqtTgJKvkpeW%2BvJjVWrMWTYcQokhD8qiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLnpD0Wui4O8dBPHmyrcA6%2FSGZTgywQa0Ta7Nx755vEeOmP36O7HNy0poIiGIZm8vyRddIpKQxX8zNS26XUd%2BgWdQUlRtm%2BmLWb4f80mCtubCPuOGquVDiGH%2Fi3GpNWKFVwoBbawpGVCmqdGZMjcb3RlSnYvRWb5GdxZwlq1tEH5lO63CWgufU9pUXlAue5LKR9Cvd9Fk2hLI%2BfI1reAg603xN2F9c%2Bn%2FhRH7TYhq6n2z%2BfEogGJ%2FuP%2BXqii8IZ9zMZnXPvCrf7zCaEUNW%2FKtLwNH3MKT5qU879%2FQ2KC0WX2pzY9NnY5lfZHHE7sSfSfOvl31%2Fwi%2FA%2B3Ur5%2Bue1%2FNPLlsLS5ZpZS5EuRTI%2ByYtgnAsAeYuDfZW%2FMUhQIDvK7e9je6GaIezpor%2B%2F21o0X%2BJmsv4aosLG6qY0YkJ9J9xqT0PkGx0SJ3E0tJwMw%2BbxMGVCIgS1aFTrSPR7t3OIerIras7RTv0hydkgGTrQ691KBlhP%2BgI8TI3V8QT2LER0G0JTPDwS4H895XjCumWE5yVhrgnouZqipN%2B%2FkF1874u%2F%2Bvr7GQ0awuJnirEYOX%2BrmbTGU6iIvk79H%2BjasFAFu3wQn8mm5XxtJLjq7v%2B8elOohNrL4FHhQJJTcd2V9qnZSdfRQiN6wsN04yUtIMJrg9s4GOqUBVF50qCuS7VujfyT8mKoZTArBpP3f6zSIIIzvdet9iyFHBJOU0BLuBSydrQJourF1EMLEkM8cNgx2F0zXpVw4v8DMjOV30h%2FItDQFrqasBrRi%2F9GQ8IsRLZ%2FgOAmzt1QbwJ1UtjPerwK%2B7vFv%2BHAvq0RZH2RdMvQ60A3W1vvbzBX4LgcVgLJmRdUyTNhNrqfcJm86h3GYKWeqjH1dULmi%2FHgKOO19&X-Amz-Signature=6fb44dfe57468b9b1329611e6c6cf3b52b5a33dabedf7afdaca1547342289a0c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663EZ6OEXG%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034227Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAzpF8ignMsyI1r5nnT%2ByRm1D12KDTyAmOi0ksZxL%2BX8AiEA3D0tUiJG%2FhjNI5ZqHIqV1x8BpYFaFRtNVdwRhNHphMgqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOmjCki7YGBm8mWVaCrcAyayObhaMmcSo4AUeYxUmpMb%2F5Fhlccd4XKzmteVKcgSMkyGdNXVqh5HbHu%2F%2BLh5mJj9XpLTUYJwueRFsMnCwJYhHHWW4O23WNwft1P5B2njYwkzLIXiwQYBYUqwxdTqZxbQDcqMoZ8XS2w8SRt2uJlloYMyFQmKew2jMQXUwGjL08EVOE439FQPQLziNlj6HVuuxnAZzz4B3ssVUXDGsrLv9HjCivXBRucB161M1Y09i4Zruqb1Unegc4AaKTvmZrNXF2fSCT3ADKJd5FlnqujYlylgXGfsUFhRzfIhlobPmOH5cwVo7f%2FMR%2BWo2Xsu5Z2MfgoZ4jWuFL0INJFV7W93ZxsgMQNa56jA9rEBWGQhjqxj9Hd9IGi7JRavBzXmGrbQ8MfkGNp1wjllD%2FGj1NxCCLYoQ9i7HdRN%2B%2BBPyT7BybkW%2BxH7vqTFIL4Fu%2BMK%2BOgLps7V7%2BYBB7rb2vmM0x6nRXPAlBmQq6mSx94c7VQZFvZBVc4bGJlcPYbgHnnbvsjurehMulKYrCiRtxC8Jk7BohIhTjMm%2BcEzmtQ%2B4yUAGToZzmbkXhDQbKKLGDHZSW3hzCIK%2Fvf%2BLeat7kn4LwVqg%2BufzRwq6JFMj9rJGQKOQICXiG%2FlMP5KRuP%2FMJDf9s4GOqUB0dEzpK8%2FaIw1yFZiktROvqSzx%2FvpRkL15TEqhVdoJFcbvfaA1i7uKV2j9OYfa80BHBo4kOo0sNTLF7ffc4Xv06fm6J%2BH9Zb8oVvmtMYOqiHLyFZfIn8VtUATyzkYIK9tK9h25YMKn0PweK1qh7XUQOuZlMLk%2BG6wg4m4wudQpYmA4Qc8XdYrfM%2FQ9JtMo2gX0WmnX6kP3VNmEtubcsce3L%2Bhtl8z&X-Amz-Signature=9a0f4ff61d23d22fd0b07ce1e56dd2734c9c87f4a22e447bfdb058f3f256545d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZSUYBKNK%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034227Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDVRgCh3nv4Q6iiJFKs6K4ARw65ZwlalgxxUdoGh%2BlHbwIgXlXm6jIO50zI8U%2B3xbNmvr1qdlo5jjttFVTn3qVhnFYqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFibgTuiiZIAhjuNxSrcA%2BRjhaNSBA%2BYSm%2FILSb8s1wbjnSAi5seAqHhQcaFLgGQ3JQxFAMeNi4w1X8X7uDUxwq4JwBLnrz%2BuBQqBOK74C0qRl4Is1HRFHZAFTDm5U4%2FYqwLyNeI2HTU5tLsxOlcpiqV92TZXn12opHVDWukNnIJTZpNftisKRczRAPHu8GIvu3xQH9HM0vb7RI5egCDMKcpQloqReV%2BYVIWopj0NCJOb1QCc7DEminClMLBvEJ2u6rK7MleICRIEYAP0nuGG4vbp8dmkBjjxQvHjdoawvvtGfqHPo5w6yX0D7nQyzx9J8%2FtAhE8e%2FdQeh2BFnhj%2BV1NGaH6B80S8y0lJuZ2LmAQG52gjPN8a1ZeA%2FUrFKbLdzTtkdIZfGXxdNvNsJN8l%2F0qZonEt8T%2FMH4TWjWxhfylfP2d5IPpVqrBpxiXTia%2BZJS5OoQohVOTExrHYHamEfvoYIRFlSnUbPoF9Us5xCBlZvIGk4Bsc6q2TvyhPNXeFV2WGsV9pgiXqN4oV1qpjSyKnU9NfMpa7p9XK4QqyXJu6IpFazQOopnzKlpBxYCK63cv9h4pLvIGBauYECdu1GzS0%2B7jEQ87ZafSYs0D%2BZDHo0pMCWeQFNUfDmYk2K0oceTiAHTA2LRuQPGtMJ7g9s4GOqUBEGQ%2Fb34NJnC6G3G6EG11mVLxIsQlzSCgXq7aohUWiD4SMgjD%2BhUet5xcQQi3tSKUyg%2F3MXvT%2BcvnWK8q8vtMqLRbGUzk53bg6hRu9R7siWLLbBNp7gRxEx6ZifdCmIRM5kX1LMqrO1d%2F1e6s%2BjUGQz75WeRyxGHDIBT0H3CTQlSJ%2BqxZQeKr8Xkf%2BwteXx9AQG4kMxM96dJIFDKf%2B%2BiTnfYZFlSr&X-Amz-Signature=4542ca0227c0c0bf83f4333ddb5c1e84b85734da773ab403fa3fe64f2a201ac5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YXJH4LHA%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034212Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIG2wKcHvMDxYHLcYpxZoqra9ioHJ1Tn2rhFxpXkebWaEAiEAhZwollSnqM%2FcVQAA5q%2FsmNlcCf5sXQ6IVaKWsNi4%2FFEqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDK1pRYC%2Bm%2FE9HWH%2BISrcA3D6fs3w5mpXxp8SknD3uC6tSFvdJRYaSBUkkHZ2%2FdszpVOHn7C%2F3yPlz%2FqZ3CiYslba6%2BNypWMTu9Qw0EgpqAC7vmf8qbXS%2FjQAeJFfTemhyF0flNM9YxbJNoTDQDRFBKb2OOLD%2FJDlK7gif0XuOUWcY8VvyB7dh7BAkcd%2BT7grCWR9uZ2Bv%2FskVk45vn5Ti2LYHauuszXTHxxPUfQVjqUuq1%2F0Xz2gCNBi61F8KyBkamuXawNWSy3yp6%2BhaBca37ikA7lHwQ8QgByvLrhF8EjR1JwJegsDZpmAK0%2F59J9MMhuHFgmoPTPBaKFasfD0qaBtdmc%2B9DY43M6RZ4nQdmznzurUIfRSIRMIlGRBY6qNuip12slomjy4n9%2Flm3D2H3bPsbUiCOK2Qyx3dsoCI%2BLPqZcRCsm%2BjSALfDJmAAdDDYrKUh8ze7rq7PatBFLOcxUXGWnJ36iu%2B2W5CkaVQVPI%2B1dHZL8RQ8%2BcKxQC5Zpi2%2BOqHUGginnoDuoy54W0eJe4teAzyl0tnkBEHfeNTfCZPieSyrIZ5fhtFZHHgb%2FmxsFbD0xDlXyCAXac%2Ffk6cMpamC2b%2B9VITSolG3azm9FIUjwkF3glEn%2FBHQBJXtl4I8E5K%2B12dtTcZPkVMKTe9s4GOqUBxZdmqv%2BkBleELvlRYLDrObIWYu08NwOSam7h7Zgo4YhwwZ3BmRC0exfo6qiMT4vTQN4YhUgHBiDAudEVWvwari0zX%2BjV1YIME6iBoUQlGDpwUbUzq8xOih8YzE6hNtmed1bZZsqwbPnnsHmnk3EbbUOcb7LJCSpDv82xUk5WHS7P5JAoHAohr5KAKfjUPDKCrUdh7EiAn4G1Bh6tDSQzXtefH6i9&X-Amz-Signature=dee9f691bef1d7a7c14a875d76a39de23f234800e99698456dee0c80fea4c801&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
