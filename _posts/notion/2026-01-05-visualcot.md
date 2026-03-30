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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TBR5VY34%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIAHBWpDRcjpswED1LRDEwR7RQIb3Q0v16PFVi7Zgnmo8AiEAri8jmBHuuDDUHvc4gyrZOLkdEwsO296oa3qvrpYLBXIq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDAHc%2FKO5MeXHsJtEdCrcA%2F1eFL8dGBmh48KnRT9GeVd33uvyhppQBjAqXusadjdvoBvr58hjHIggCr0IUluiv6lO8xsYUlac9DU9lPg8iSfwsMu%2FmfTWBti9OxLjDJwGNFfHrnQyz4J%2B8Xxgh%2FZCJsQcu6GFvVX9xDt8QOCgbtTyuFGMHgTOqE2RqAODeg%2Bm2RGIhBhx%2BW%2BaoLdwtmKuLnAogtK0FYAPKrZJwXr5NnIxs%2Fbc%2BIMIupio56FzMp%2BwFVwVXz%2BIRa6Qs3XgldaL7Lq2EV3FG5McQtJ%2B5g4NMgOJaSTCSduO%2FVLnVl9SJtbRPw0f0tavG2bSZxHDL7kpR81cSRnUK7MAWpyl35ExyL4l15e2Pgun8arssffU3FswmxJQjUDwMsx4qqGJi4Lsoktap3Bkcp38V%2FaoCpX%2FroDZzCF7zxqI133Gn8vaZe1gNCLQxxw%2FmR35aI8%2FgDx9IdN1lHK5vbLoja6rh40XWm0mQJikbdtNyB38hCpHV5jBsObIizrUflc8RX%2B9ZvGo1fTvEFU9q%2BNKCjMxs9p%2FrSxCVJVUqBkSTrNRESqbL8AmUQJ8S0TK5Zo2tNtySSduImpuWKnF45L1bRqotzU%2FC4%2Bl7Ws%2FgGRUgicE2%2BGHguzKCTZdmZHpx%2F3rDVUzMPLHp84GOqUBtdjC6r8hLeWf48L3OkuAwoCOHiSIoPLQmS1zpMl8RvFQe2sjg0%2BPylWSC9pnkPpIYPrvF7kwrDTdzEbgWmW8EQG3LW78DYrfr3ienYS%2FUIBRY%2FYzoaORnxZvyGQIIzjB5x8Ywoz3Yk%2FW8Om2Kt4xvqCtYkupgcf%2FaETkdv52J%2FNtDEb79pT7FkORc0SltKlpzLYPyKBKIQ6dBgpMkE0qOPLFznKl&X-Amz-Signature=fe603698fc99339f58b22902e8e87b2059583fed2717c64222627d598468142d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WT5WYZNB%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034143Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIBKEWhbr6U%2FTjoLaxh5Z84FUTJgCBDntgx6Y%2FOAbtkIUAiAxmneqvBr394bCxQow3lMzwAQ8HoUDKw6DIUqPWNct%2Byr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIM8QysU5PP9e1d6z8WKtwDe56BZoMPc3fqEMaMGGBoknrI9hPbWd9dJS0kZn%2Bjv1PS%2F4ueewFDQVT%2FV773QY2iQmGSbvPRKsHUf6aSbGKbst91i2dZAG7i13igVI0wyQHsTkmIbHJR6Hapn%2F7aZJNP4NPVieCnid%2BzpQGh%2BgDBMyUtyO006mM%2FXb1fdeTDR2F%2BMRtAKgYN%2FPIly662eQbrV%2FZ6W1UuHPX%2F5QUJDOsSfw1vbFbd7TKGuSPTmzpGBghIRSp4XJxV9xu1%2F7b%2FtTOUP%2BqVER338ZxOcDPiN3uL%2Fz0yaLcPdK9dR1cX%2BguHMHiUquOI2ydpZA4ZPsAuTq8tAn6Xlsuc8zLbz%2FMWfUYl4W13vIc6aAZgEpZ6j1ki25fvFQiLVg8y7gA5r%2B0LKd8kfzpem31db5QILcBbkXPMiDtiFyA09fYcsdKQvzjUCXV0d5f7BKkXXDXb94C1pFnhocjIWLX1Jti7AYkJ2Nlu8O1%2FVarOSlBaUArNOJAB2MtQnstjsiM13hUz%2BSxJtBWtrKjktAZaEblffIcrTE4rbrjJMPLh4jpPihRH6sRwPqSGf%2FmS8VrcbdxHiUqdo2FFLAtJCCHC3coTlC8R88xsioJAeijloGdtUU46hg7hiOUKo1%2FjKRmGg6cs3fAwzcmnzgY6pgFU8hDfm3iWRivI3fFkarW4htDS8qGfLsITLm8oDlOilclvH4yYUvuhac%2B8FjzbHRe0NxnXpvrUa3ea2m1vGqXO0sRhanGuRFlpkFo%2BPO9F0gq5%2FxAeuZUGFcrHd%2Bu7NGFjmC1N9HlNQckZmV%2FKClhf4Cy%2Bogrff2C4%2Fy%2B3VQEuNzzI51GEZ2k5GgjaabC8jPcOyPhzUrcy7e5vU7fOZV3JJY9LGFNs&X-Amz-Signature=aad0700da312ddcb1d8981e865bbbbd2582aaa82b34d950cb598a1d08dcf37d8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666YUNALUN%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034128Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIC0%2Bt0MLhK5qmpl4fYM6T9upTEyd3nN9r6QjqGeKL5GOAiEAmv5mL3vme1kry61Q11rJTdSuF4qQgPTtFkaCqeM8jeYq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDEMNfet6M82wseuMOSrcA7mUpTHy5grB7HajC0bG7B6uJCNc%2F1CY6uXMEpj866yr7bTkMEg87kKoMqQgf6hEjQvpvpq0rNwKpRg6GkkJqkZdsXYRkOQl%2BkIDlG1SylEkMpcvfsf0CR5iUj%2FVqA%2BkFmxzZ1GlE7YqmQSvpGnCtnXaw7VIIAQ69EB8rFpMBAnzO2e0BwUDZF8cqwEdF0WZ3bDeL4fmoYmGx0hTMbV0N7igUKdE1k7rBy1rxa3t3QYroM8QmjrchzI4Jijzauyocr4LrbCJXEv07Zqu%2FJleAcpRAGjoiU7ARsk0ZTgk714FTUVeoFm%2FQsFu8vpBStn45eqc4oAgOSs3fTtvxTOC4Au0UXjUgfurL0A9voMvs9EsWGBqbGHk31Vm0lwVbPX1ObSw0CixBgl7B7V9YZNL6dkdFW4mtksXUFYjh8ROrjCElncAKU1UxSd%2BZE4Xtprd%2FtrpCVzGFF%2FkwyLhPGyPr2hULYB3fuwMTawcOajoL3IoTWHxafMLQNa%2FcnH2Rh6yM4Y6y9Rjo2ApO%2BmgM09dr21bd4Dgd%2F1jbk5Ztabr5mdS1F%2FiQGRmYXW5ULjEY0UOTI7ueWnTgKZsgzdAGazscWzzjGV9hANgYe%2F8MTKQC2tL3tk%2BP%2BcQtvw7AXbnMLrJp84GOqUBd49kZDONcJaOwtUQYifM7ulsLkibQac7adiBdcSgjITLcbRb2WY1R0sZL5Ljcs9rUpaSQQdSZ%2FedV5zIiExP1iT3bnMbF4KBqb%2FACJNay3m8q4gED3ZTr83gJ4CFmteS2OQuZ0xFbJwz%2BEtKdTxVIy%2FL69qI7rLmsIB67EbVlFpE50ZuFZNFwKu9tOnzlh4%2FzWJZcU1%2FbvIQAkbOknL5aFZfKiko&X-Amz-Signature=cde7a8fd0cdc0850377892dbb8f6033375621a93a1942d78b6f3985e89721d4c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666YUNALUN%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034128Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIC0%2Bt0MLhK5qmpl4fYM6T9upTEyd3nN9r6QjqGeKL5GOAiEAmv5mL3vme1kry61Q11rJTdSuF4qQgPTtFkaCqeM8jeYq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDEMNfet6M82wseuMOSrcA7mUpTHy5grB7HajC0bG7B6uJCNc%2F1CY6uXMEpj866yr7bTkMEg87kKoMqQgf6hEjQvpvpq0rNwKpRg6GkkJqkZdsXYRkOQl%2BkIDlG1SylEkMpcvfsf0CR5iUj%2FVqA%2BkFmxzZ1GlE7YqmQSvpGnCtnXaw7VIIAQ69EB8rFpMBAnzO2e0BwUDZF8cqwEdF0WZ3bDeL4fmoYmGx0hTMbV0N7igUKdE1k7rBy1rxa3t3QYroM8QmjrchzI4Jijzauyocr4LrbCJXEv07Zqu%2FJleAcpRAGjoiU7ARsk0ZTgk714FTUVeoFm%2FQsFu8vpBStn45eqc4oAgOSs3fTtvxTOC4Au0UXjUgfurL0A9voMvs9EsWGBqbGHk31Vm0lwVbPX1ObSw0CixBgl7B7V9YZNL6dkdFW4mtksXUFYjh8ROrjCElncAKU1UxSd%2BZE4Xtprd%2FtrpCVzGFF%2FkwyLhPGyPr2hULYB3fuwMTawcOajoL3IoTWHxafMLQNa%2FcnH2Rh6yM4Y6y9Rjo2ApO%2BmgM09dr21bd4Dgd%2F1jbk5Ztabr5mdS1F%2FiQGRmYXW5ULjEY0UOTI7ueWnTgKZsgzdAGazscWzzjGV9hANgYe%2F8MTKQC2tL3tk%2BP%2BcQtvw7AXbnMLrJp84GOqUBd49kZDONcJaOwtUQYifM7ulsLkibQac7adiBdcSgjITLcbRb2WY1R0sZL5Ljcs9rUpaSQQdSZ%2FedV5zIiExP1iT3bnMbF4KBqb%2FACJNay3m8q4gED3ZTr83gJ4CFmteS2OQuZ0xFbJwz%2BEtKdTxVIy%2FL69qI7rLmsIB67EbVlFpE50ZuFZNFwKu9tOnzlh4%2FzWJZcU1%2FbvIQAkbOknL5aFZfKiko&X-Amz-Signature=9fa564d39c158116023c18af079cda24a08da6865fd618352b5fd0632bd33a1f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46676RHKLGT%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034150Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIQC3ZZpp6zC5MneFBIbCGh2vNc3cJKVxMVPF1r%2BtS7hKpQIgXEFw5i%2Bpo%2BhGAVk%2BcZogOcTLd438zVf9NRUe0wSelDYq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDKqEiOmoPnLeYYgTGircA9cLc5OXjx8I0HL1OjznLc1um3eBHwIdvtqMIC16%2FU5Jz1KP1VeMMxeHRYWSdyZ0gpf7JrUE4aPXvVczSkDaZQHZHkaR9mOxD16gpPeWEXxROYNHju%2BMdgEQfhb8ApeztK00wPDT6rfwDl%2FwssAX3XjS8u%2BzR2Ygnce0AryYQAOc1FF36wxQr610eBar9WgcocqvsvijQeFDP%2FwasPe840OtFKVYTwXVqtES1vPRZkrckiu%2BPZPV%2BRkRkitmDf0D5KxRPezuLiBw1OySWwIYNHLvT8Sz4iYBKDVLI8Jqr%2BdBPvf%2BV2s2A0pbI9NMmiygCNS2BfyVpCzUTllZuim%2FQkBqy3NVv6ZJ%2Btejvzju5VaWeYG%2BlbUXvCc2ET8YTYSrnyqoLZFUPKTwRmAH2CkLR2bU3WOba%2BYHP7HAMtI4i8BBaqDBT0HF0oUgj6JihcBrCGPDgahlTT%2BffNWBhnGWEvhIgzFB8K1ynAR3Hil%2Bh50%2F0JL1z4312tZSX%2FjeCQpt63fAJ%2FH5DxbMbytmMTmhdiutaTxSL53gIMoXoDHAvFmRCpJN7xn5%2BkGch2EQIKQN27TeedqmoFmHh7DMk1F4Y3cgDkaFAkL2p9Zv%2B4V13zYU%2BF4fIa%2FV4FREUxRhMITJp84GOqUBIlnKuB%2FUFmpKHt%2BDvFBtAgvRbAf2zb%2BAEttfeVUm33cxvBT4vXRH%2BZgSFEcnKUjEB3loyQ1tEfLs90J%2F%2F2oZCo%2FsaxGQJ9CzuZPiKKQ8N1bjI%2BqrSKRPmnD349oQZeKfvleZcxCPLrH7DLjuiBCeu6RJULcSeNBpF62xTZBI0SZ%2FDQN%2Be32PrjNi3mviUycdgwn7ztwbXh483DbypWffEYtBehAE&X-Amz-Signature=be5eaa383822afdda011bfebbe68e893cf06e5d52e4b5a196122fbea976e72b1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UGTNFCYQ%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIAvL8djv8QwIoNbKrEchVGPcUjxE4fnMj9Ounb5Sh6KAAiAlgUdjH%2F5N%2BjdbyFDQHYtl2su0eypQ6x%2F02x1IsL5i8Cr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMcarMnOkd4Z%2Fb7OpjKtwDcOZ5WC6R%2F5L8kLc8F8fvjI%2FqlB0WF%2Bk5V9MZdP86jjW6%2BU8ou9pfy6He4CzXGVFZydjGhsU2qK3LxqCPPFs3pUl85bXUrD2SQJUbulP4aFIZSW862PQoFO%2Ff8SnMX8ZfYWSzzAQADZ0se7EL5RvkRv8y1uhPw5C7ED1kHVgNY16BS58SGEI9C4NfP2YWg9w4m1RjKxeBCIPTKaMhDMbJFUK67%2FSa2o06Nd23OKTmpXnTN6HuoYx%2F8rFZBGpy1%2FQ1%2BL2ZBn4gFtPtx1yImGjPZ1dNNeRg3C%2FYyFxW8zu8WUN7UoSsc7sx76xgQrZ61A%2FdNlC2RX2pL%2FQXPdvCfoWaizXiFyy6NALe6xMygQ%2BOE%2FGjQs7w5G7oPhcpnAKogD8ar8gi1A4lbCjywh0Rf1YGcR0PKOWbWrntGE5ID%2FbnHSq0NlPAWU3iREoAx4E8Ju8onNRrJ5PnkPaLKTTMxwSEQr6f006CSgA8%2FLjHHYTlTTvS3mMOGhHP5TuwOHOohKTmIRaDMQQ0yMYXhqmS5ovke86sBxmLhLqM0QbZd3dh7nSThqyh5PjdYcrb1z%2BgkDMIHd7NzHeQSXboVXN1NjUvCJnv9tk6zIyWmRdlwHQbf9NRZglmEIV%2BcTPTNPMwkcmnzgY6pgHLj6SyTfHNr%2BnVHvUTNoba5DV7kxmjZVmFf%2Bgz0zsRi9yLcpiL9Xg5lPPZzG8qXAQEO%2B8kQiFELdmgTpyZRzpdtxyCfuZP1O50hnlKYaSC0IsCSUqhtDPKkucg2C%2FqBsTmlRAVv3WXWnS%2F0c2vznODfA6zH9KcDIKYL86W6Wg71MLSiAJ%2FKN%2BncbRDFmH9RCX%2FgsnOtkLW%2FNF8Un%2Faq0MLbHDDlIzG&X-Amz-Signature=a47cdd69c27ddcde0bc0fbd75ec5cbb24cdf7dcad1f45648900873847a2b5205&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZLISOMDW%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIGEVwoF4okFyGhEQCzAp1aNP5pRIvIjHo0VuTW09Fvo8AiEAydjALjZIVgE2aZRxlD4oq7ZNlflWyxVEgR2UxsgFwAwq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDKdwq5EXet8zM4FBDCrcA3ZAtI%2B4r%2BTeV9A%2BcttFqAVsZS8ILpkMBBzT6g7%2Bv8ke%2B09XKXLEd4A4S4cyW3eJVQIeGoj7RR1pj7bfrLaGM2AYvciw4hfveLPtimBzRZXt0QScaaJ05ETAo82lHvxTOrisXW8U53pDyqSNCnXZ9W9o8XUTJ7nyYTZ8afHxOVXHsH2dJPenLUVHEGY7lt6AoiQnsygIa6kRSR318waexyH4zPFr1p7eeL60AjrCSy5aBtcrPpJ%2F7Ehn6AtdN8%2FLams4KUYuqpD3yd%2B4E98y%2Fc13FxtbWmdoL9wHE0%2FJJrCeXVLuqpXWozq0ThKHkEo13xsrdEco53R6%2Fw8%2BFDSielYPl17TvLy7nSle5AkFo1ZNOSjOhp1npWpOEYRFIeuIs%2FjZC6GIFdmvvSgrGmOzjTyVPN4ERwui1NFZm2h3IfqFq6eTjV5gmYj7P3gcOYDBd9MPYoaOvZjtGtxk2AEP5qECuShAqVSKkkgt%2BioCS%2BG8cuZ7Zo1KQb4KpipaPNwSFDkRfYDIydLRlsEQZvyIkkfuzF0ARlWw%2BDLMD0cSdwS4ZW1nYkJUdfwfNoIrW4HbN%2FD3VO82kxoCQyqFjgw4oyTerj94IP5avPPp7y9tdFsMO6H2SxRru7nSX5PrMIfJp84GOqUBQxWZYHXrucCOXiS2ISKP0plkjPpcwO4U%2FCMR0FNtmgFftJ4Wb7wjMjHtk7fUj632KfUP2VgLmXC0IQIiSBYkcTTBOhF0H0IzwPZnkVBKaGtRdn4MUZ94%2FY1WnJDz7cQhvLWIuOGbaKZpHDjrjgFvzrnwUNOuNHEzUkTwqUNF0wFs9lwxTb0i0W04mkuXuMVRn76T5KPIxuYd%2Bl6dCDZtVHLmmj8U&X-Amz-Signature=10e4c1c860ca2c8c28175a4eccafa243af07886286491e56f6ba94280ccad1d1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662HAC2QNB%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIBLi4gymB9QhyCTkhf3Whx%2BSUmk971MS%2FG2VudSnMuODAiA6kznEX15smhzs8wxcoUetEG2rqx9vcoT5vEEJVS2jrSr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMBWXXoXRwzKXTqM%2FuKtwDtbBNVGy8xC9X8kNnVYlev%2BQNC3zOpLlPyfFepMQy%2FeX10jboIDH0WXU0QmOoU74US9hR%2FN5Y2M%2B254Mfw0QprfhwjKIJHF2CcJnhWHGxg%2BhNwQE5gB41UT2dDp%2BO1NUSZaPPybzJnNSmQc%2B8YxevweDQAP4718k%2F2C%2Ba8aCoePgTReIq8KhfV%2BoNgMHUqfDG8Yj4n8oNEurD%2B%2BN%2BPUE4fTE7z8cYSbJN%2Fna45kCwHyiZezuh0w5K%2F3S7BCar9TWDD6eaRopmktgK3O%2ByqNIKNKo1OQakXxGwd1Meem2VX9JyL8cTtgljEntOb45OhVQzqDRWnZtcHz5XjCRpUu%2ByatqyQesRc21PIiID%2Fo%2Fj758EbhI%2BDlK%2BhL3cAWCo1msDMatSsZxGzEtwLSIbPXotEsaar9LqAD0tXmtuvQaImFbe%2FFOhgR6uqnqVFYqk%2BvN3rQ73kgEelwbr2XWZExoyvQ7LDpnIPEYgP6dyVXymEcdGU1mHdVpV96AuFtE9ELZr8WRSM97%2FzTJv14%2F6AiSiw%2Foxo1%2BU3y4vwOia66zrug6hvx4OdBuF3Og4gyRvZq7jI232HCLQIXH1a%2F8dt8cR3N9t6kAoF4PKxlD50P5sBKZC9pNJIOYYru%2FCoQMw38mnzgY6pgF0n%2BIX2Y4wR5t7pW4fkeCiRw1MuIUNKrmg8RpoUi7LOncFiGIo1zYyYDaSQEW8tH2uRChyAzbEU%2BiOoAoilL2hkqXqnffZRng%2Fqb6hMI1vYi5rETeOiZfFyPD9NAZniA%2B3%2BatpqbbhiOElzWkR2JgUEJgH0XrmWCV93ZL%2F%2B0Q7EklV6lfey6JkGz9aJulBmSRSqpbdXt4SV6zT2eFRh1LuMihCw%2BW4&X-Amz-Signature=3d2fca309182cada8b9eb5bae3317d07db5b107e90be04a82d7bb2093ce499db&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJFSWWLW%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034155Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIDQI6Khq6i0xCOTsNg8PpbKMM9Q4FPlHzHRbR818X45WAiA86REgYmZoK%2BRksUTCAAzv%2Fqe%2BVsZNAQKhPgRBRYo%2Ffyr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMTDR64hiWR8SGmGKKKtwDJeYvpYb7WVHn%2Fz9RwzTwXBEYOvPxG45Dq5pd%2BoeItKJxbLIPKNY9gQ9qxzg9WAkrl3cBHacDKkN0xe%2B9niNafavRhh9opEO3ylWd6YcKSSWWUgYlTdNWbKqD4KRq%2BoVEJiio5WF6aB35wXTQqenSPjHsBINXsSpwfpvjB3%2FeQbC05l4678uO3yTBxjdYgJsOXClV3RZwez2IbIvmLZPF6By0JxIODhhMLs8aKddmXKzidOvaNBNPjCRoqDWFKNalWzjAHJW%2FV9f%2FgtFI6kM4YmCvkN7YF1hOi7aBfZQaheGd0XB9aS5M8HRr%2Bgsnr80iOcWi1ZtUTU23NC8mcEvDQk93V8AAmyn1FkMXKN7NFx%2BdjDi%2BuyWSgZVYzgO1d0g%2Bq6K1KmHy9nOdFyUjRBnu45N9ySG708FuFnIcYHVVChyOrsl9ox3maRk%2BWCrvl7nJWD68N4R7PMGvKfglNExvz2KjX4HJvrOVcXWUHUY8XmEqTmZasU2M5WlyyJmls22XBDtdHQWs%2BFCdpFf%2B3zt%2BxVabtvnGvIG7Ir4OByx7NWyMWtB5cPL2S63GPQdNqmuk2qx598rtCAJFC5KaYVli5l4EgCadPWFRQDP01k0Zp0dy81guXtD5ewrcx5ww68inzgY6pgEvlz%2Bruu5jzLLto4SSgqMbN3Uk4zKgaUz2dX60wmCtqMchNsyfyq0whovv8xPT4ViyGGN7ekcYGDcp0hRhsfj38ZMj5o7JdjUHSP2X4c2pfZFA66VcsW11q07%2FP7x%2FN7W2p0GSStqBpyiCjFHSMV%2FLzwWEN60TY6eKBq0UiS2UwPWW0sj3TCZV1GxjWGnBV3rkZWmsqkkKlVN8U6AesA7wCIu4a0Uv&X-Amz-Signature=0a8c271c8903c7c4e2bcb275cc11e1666fb934b824fd2dadbf50bfade8302806&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666YUNALUN%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034128Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIC0%2Bt0MLhK5qmpl4fYM6T9upTEyd3nN9r6QjqGeKL5GOAiEAmv5mL3vme1kry61Q11rJTdSuF4qQgPTtFkaCqeM8jeYq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDEMNfet6M82wseuMOSrcA7mUpTHy5grB7HajC0bG7B6uJCNc%2F1CY6uXMEpj866yr7bTkMEg87kKoMqQgf6hEjQvpvpq0rNwKpRg6GkkJqkZdsXYRkOQl%2BkIDlG1SylEkMpcvfsf0CR5iUj%2FVqA%2BkFmxzZ1GlE7YqmQSvpGnCtnXaw7VIIAQ69EB8rFpMBAnzO2e0BwUDZF8cqwEdF0WZ3bDeL4fmoYmGx0hTMbV0N7igUKdE1k7rBy1rxa3t3QYroM8QmjrchzI4Jijzauyocr4LrbCJXEv07Zqu%2FJleAcpRAGjoiU7ARsk0ZTgk714FTUVeoFm%2FQsFu8vpBStn45eqc4oAgOSs3fTtvxTOC4Au0UXjUgfurL0A9voMvs9EsWGBqbGHk31Vm0lwVbPX1ObSw0CixBgl7B7V9YZNL6dkdFW4mtksXUFYjh8ROrjCElncAKU1UxSd%2BZE4Xtprd%2FtrpCVzGFF%2FkwyLhPGyPr2hULYB3fuwMTawcOajoL3IoTWHxafMLQNa%2FcnH2Rh6yM4Y6y9Rjo2ApO%2BmgM09dr21bd4Dgd%2F1jbk5Ztabr5mdS1F%2FiQGRmYXW5ULjEY0UOTI7ueWnTgKZsgzdAGazscWzzjGV9hANgYe%2F8MTKQC2tL3tk%2BP%2BcQtvw7AXbnMLrJp84GOqUBd49kZDONcJaOwtUQYifM7ulsLkibQac7adiBdcSgjITLcbRb2WY1R0sZL5Ljcs9rUpaSQQdSZ%2FedV5zIiExP1iT3bnMbF4KBqb%2FACJNay3m8q4gED3ZTr83gJ4CFmteS2OQuZ0xFbJwz%2BEtKdTxVIy%2FL69qI7rLmsIB67EbVlFpE50ZuFZNFwKu9tOnzlh4%2FzWJZcU1%2FbvIQAkbOknL5aFZfKiko&X-Amz-Signature=aed26af72adf208aa4f0bf1b5ba0a0d8e4bd27377d9763f268ecebffadacd025&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
