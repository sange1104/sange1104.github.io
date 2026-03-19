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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TFSDDWJJ%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032315Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIETSBeVNY%2FFzpL5FAwy5%2BSrS0xdrs1fyk38yrGJKowafAiEA%2F6Vsr1uFK9G99Uxe96iv8%2F50ddk7K7tMWLiFGjxBaisq%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDA4wC30wDla6N6G0byrcAxiED7Fkp4YkUeDZd6Zxv5pJZXgjR71mFCW%2Ff4v3lXpU2JCJnzoC8iUVJuHkgOVTvrN1w%2BAKzRagAevMVcP5%2Fnie9FgR61CBV%2F3e5c4SQhv3CRZ4v4khweMVyJk3hWmcl2yAseQmdBZceDifUI%2BXi%2B9px5BdX%2FCfA5tmph9PhdxMsFP1K2CyH%2Bzci%2FXvSyDSiuQ%2Fijz8TEdrF4Ej4hPksivooLDZXasHGy0HD3Ydb2oKKe2nme%2BDBL7iDyuBUORaddSqQsAAo7dM4ZBpg%2Fat7hto324aU5RDc6AA5rmj1zrDU9UfJ9WDZyxlcw7HOjmylqN3eJpCVq5rxU8WF7bcnHlNEhDVKV5BZqf%2FlSzs0CgNL03H6LSfZ2LX3Zz2Ra2nr8Qb1qRDK7vGR%2BE3gvY2oTU1JkdYkRB8BMPa358ys0m4lL4VenICTuRnrBi9VtvqvwCNnLAjgwKNcTFYYydxsC1dqDPZFnnIISWCjEC4yhJPMvQn05AlLn0i9qx%2Fy8raEhRh7Tdc6mARwll7Y4PmL%2Fx8nckftycttrvfovUwa70GOUU6vEcUhqdQq5hp7ds04TAo3%2BUS2JVCbDsHsFv9v6EZMKYlOhYqfU8Om%2FpYXP%2BcXiJItkc30RamPpBYMKrH7c0GOqUBV5o0xjpveCGYmudRcA7mZoBIriRWBJK74SYW2Bw90R2eNL%2Bk0Q7SpEJygkav8a5sVxp5KLTK%2BvDrYBgMGnhlSYVUgKAebVL7bMR%2F8gZg18sgfKzVFwOnWLYnL1QUv7cv%2BOX1hdgthbaP7OEgw3avs2tfhqGBCWUU95NJY69P%2BJX8ynpkuzgNXVEudTowWaCZCaB50ZOtG6SilReh%2BKjxCGU3W%2Bka&X-Amz-Signature=298ba8e5b265ee81abb9be047b1f39cfcd0cd76dbf865803862adf675fec07cd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SUUCIZGZ%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJIMEYCIQDp1SjhhlnuEEfB9ICuPlihZ5K4vCT5AUcJoj16CgTxSgIhAPxo6C06IO3oFsmm2Hh3rfmA1wCg9FrNFOeDUjxcVLe6Kv8DCBQQABoMNjM3NDIzMTgzODA1IgwsmsqQClGq0JSZaGYq3AOKqg8JD4JLfT3K4IU7SmQatjGCOt0BhgEXcg%2Fuz6MrdhSuPXcoYeA7iY1fntx4sR%2FyeW%2FgzuCGWfcPaNvwNZa%2F%2FB%2FJyarNzMAGvS4p3FICNrsJz8OVHbhLz9cRYEHgVvYv1OosYxuX64JqYjc81D%2FeQb2ojIh9KYdR4Y7o4I6eKTKIEm8ZAzh3niu9mQVfjmB%2BRMMm8ArlMOpOYYjzQpSYswruIMq0KBhdeJpcqGzq2niy4zp1%2FZ2WGOmtLGg9q0eRo%2BOD7H1h3XQfi0rEeUw6zDdrugsZ3l5U6PlwPDKH7MxQX2wbIyy0HC%2F4DS0AdW%2FStBbhxdJoyzxu%2FT8BE0Tz%2BOLxCxeqlOnxhOAMRbCEhlHMkMZEVmC8XKQw0%2F0c61LEGci%2FJU6OXL4R3wfGYOezW2EKVm4V6liLnrdcZQOgJoL05iO%2F38B1%2FBZ9PKLu0mzEH8TlD%2BaZsVzux9niWjAcKdJ4mOHlthGTZq8j94m9fIN9Y5OuoT5TzqS7zADX2KYKZIF9CXCD%2BLl3k5jU17lCzs2u0x%2FUtb7Z69u7biYcgtOvHW4FnfDW8gl7yLVN6pQBehRGGVumyplVgcT5jFzQVx7LVx36zhbU8DtZFEyXMbhmP72mJ8YTa0joTjCjyO3NBjqkAdQv897LEZcPBLUXV3DyUgeiOo3BBLklsL%2BEsTgQCkhQC4w9gOh6WMMUkqmMkt9B1SBmusTAWqZowfXKCKywkV4Zm9UD3RjiGl93a9iM1FvGMc%2BEJXiQWoeYcB%2F1mcakYx3yFta6Nqupd42D9q%2FipBRCTCk18UK%2FEvSCfg%2FwllUoHQoXbolcnrc71LP3m40TIVgUVWiTD1PNWyAfBo6GNYojIHSh&X-Amz-Signature=ac0bc4c9a3dab4098c32a71a5679c693cb20310695db72475d67a98cc36890a5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666SYO2QBY%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032253Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIAmaASQ71L7B3B2n9Me6SV%2FJyuMd%2Bt4b%2BeCPtONXGtijAiEA4mYrZpoBqtMVxaG5wW%2BNsN2MhQwvediodIoRGdnSb74q%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDCwUJMzNuqi6xCbwCyrcA%2B6b5H8OD9k7eXFXa0lnl7AgHVdfFSSVVY91QKAioFejXCT9k6i6hQaJDs62ma45wWJxCRFqBWl5JkJDCE1RcKp%2BxCvkeSHCv71K649%2BfiXknn6lhqQUZGrnQVBXM0Sz%2FSaiTk8MhSsl3Dedb5f3grA%2Ffr4NLWs0S3yEmF15Cx61NOZTXwR7fOOrPzD8vikJtXUhzqC17SCMjKX415Cxo32Dz7XaqQ4OPgsBsy8jQ9OgGigZ9erNh7pBnEnCZ2s49G%2FKJAM1aLcfkeTpqT%2Bqf2OImdzoshfcIU7sRua3wqYqe7KeYDXLKnnZO1qgEgST2%2FtWp7NOnSv3iiX4Pi2x92g74OeM3IxLzBG0z7%2B5AzOrLMVNKkI3wjs4i4DxW5X222wvsVuS66%2FGzB%2BAf6j1a8V4lVne%2FDfzCYZBiddWbfAZzPx07zL868B4fT7HzRYnV0b2dRy%2Fqek8MQFkrWOwqauZbJoaEr28jHYcst8sD6uUMvdfsDTU%2Fut8%2BrRQ36gex56Paz1fDZ8Jzk4iOMLlpcXDg%2F1czNJk%2FPMBa6b9hxIOqsF%2BBJCXjZgxqS48Puqca46t10dztezHcwlUADIg%2BjTdEDyKnKRRekCcaEceY9L9WbR4n5lO894zh1hoMLTH7c0GOqUBcKwp6dPmjpDFMOMIA0CKYNnhjL%2Fk5PdZIexIV56S0KRCP9DnkqpzDiryYarEo7u8W0z7es7ThmHSCafJUc3w%2FLX7SK4TYEgBDDSeKW3RTNk1%2B4wmm302G%2FtskZ6Ck1biBTRlE87Qv942G%2FgYbPyKOYw8bVWdrC40DgeMkQtdFw%2FHVH1wO3zy6L51f%2Bg6kTxS70Ce9IDIWjbegesjdAZSVDgAGMaE&X-Amz-Signature=468d839992968004c2224cbfa626e614d7d6c04ac88ccf8cd9716b6dbe8d6be0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666SYO2QBY%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032253Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIAmaASQ71L7B3B2n9Me6SV%2FJyuMd%2Bt4b%2BeCPtONXGtijAiEA4mYrZpoBqtMVxaG5wW%2BNsN2MhQwvediodIoRGdnSb74q%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDCwUJMzNuqi6xCbwCyrcA%2B6b5H8OD9k7eXFXa0lnl7AgHVdfFSSVVY91QKAioFejXCT9k6i6hQaJDs62ma45wWJxCRFqBWl5JkJDCE1RcKp%2BxCvkeSHCv71K649%2BfiXknn6lhqQUZGrnQVBXM0Sz%2FSaiTk8MhSsl3Dedb5f3grA%2Ffr4NLWs0S3yEmF15Cx61NOZTXwR7fOOrPzD8vikJtXUhzqC17SCMjKX415Cxo32Dz7XaqQ4OPgsBsy8jQ9OgGigZ9erNh7pBnEnCZ2s49G%2FKJAM1aLcfkeTpqT%2Bqf2OImdzoshfcIU7sRua3wqYqe7KeYDXLKnnZO1qgEgST2%2FtWp7NOnSv3iiX4Pi2x92g74OeM3IxLzBG0z7%2B5AzOrLMVNKkI3wjs4i4DxW5X222wvsVuS66%2FGzB%2BAf6j1a8V4lVne%2FDfzCYZBiddWbfAZzPx07zL868B4fT7HzRYnV0b2dRy%2Fqek8MQFkrWOwqauZbJoaEr28jHYcst8sD6uUMvdfsDTU%2Fut8%2BrRQ36gex56Paz1fDZ8Jzk4iOMLlpcXDg%2F1czNJk%2FPMBa6b9hxIOqsF%2BBJCXjZgxqS48Puqca46t10dztezHcwlUADIg%2BjTdEDyKnKRRekCcaEceY9L9WbR4n5lO894zh1hoMLTH7c0GOqUBcKwp6dPmjpDFMOMIA0CKYNnhjL%2Fk5PdZIexIV56S0KRCP9DnkqpzDiryYarEo7u8W0z7es7ThmHSCafJUc3w%2FLX7SK4TYEgBDDSeKW3RTNk1%2B4wmm302G%2FtskZ6Ck1biBTRlE87Qv942G%2FgYbPyKOYw8bVWdrC40DgeMkQtdFw%2FHVH1wO3zy6L51f%2Bg6kTxS70Ce9IDIWjbegesjdAZSVDgAGMaE&X-Amz-Signature=66ad8d5f78bfbe826177323f543e398a10a537aa9701f6e3271572a03ddf7afe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WYXC3KCV%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032322Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIE8VpXXY4WZBZRy0cXI%2Bs4ZLvj%2FUckEfG2UE2eochOKkAiEA8yh%2FedgJNTx%2FNzteKPTc9VGMuMSrsRDlRndShIvGgPgq%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDEnMbhVQ%2FwcmH2PoaircAxVAR6uvz4nmFBAv7CLMYlt2wtWiYADDL3u5V2zhKtlxgWnH7z2DXFsWtb09Psm%2BjxQ4IAXcNdEQObe1hF4bkCtgXDJzl0Y9HpVzricQ1QL2%2BJhhb3kR1m950Bbn6nCVLScU4BEb2%2FpY%2Bm20tdXghvon%2Bb90RsjKZjwp%2B9Jzv%2BRNcQTU71eiKXlv9NoRSn2RMALCwrHgtvHImDHNWzbkq52Tdz%2Bn8j5mUGoMVD0tGa6zOviDbUWW4qwJi%2F1vczw7kBunW8TPQ4CspYXltCpRPdj4eNhMk2byX8BS06QPPyUpdqvCHE0FLadPJtp96R2vvJ4ueD%2FpsWVR2su0f6cEGyoCyKsRSer4w5ELP%2FZNhq7ih7ujPCYGiXtfH6BuAS1nMxmI1sWSCLbnFPhvEs1sv3gkOroFocRfkoxBQelp8MhaH5eNCTwMwxn57BjX0Ftbh0%2Bi2%2FVIafShCxbYPmMGA3cSxabUSF4kCA51wEl9W1atXx%2Bup%2F%2FS1gF6cCsFjEuYt36mgeBNDdb30SonL%2FfBWgDkTMlznaBp844xnifL3gOntaoY16DFHTtbvRf9BmVxzBG4LxUGuvMkO6zN%2BPytgXiAelx0N4dJUnwlw4z8nO0uKUOCZwd2az9A5WQ2MOfH7c0GOqUBvFn%2F7IaHD8Qvc9Zy2X9J121DqdjjnT9eZOR%2BwJTpY%2BUksVCgGSuRkkb7AxEQQgrOzmr1nDEXLDmGZCzHdRFfVejjQmaC10GYXbimYiGuSL7n8cd6l2AAqz%2Bv0kv%2FuxBfcN7HSLC3YKgevipIsd6dDB%2BeU5XxnVQYBOzKI8d7yO1SQ2Cq%2F1bHMccl13jLj4Cl%2BOzm57RBZhX4aADyKhvEdC8C%2FowW&X-Amz-Signature=ffcfa8c915317ac1e24aafe6cd2c4707b523d10eb9c35b9a3ac5a2bef490027d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKH4QSS3%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032326Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJIMEYCIQD3MlatsJDYp9%2FpcMjxl9UM8uqyHr5BCMrn9ajd%2FRQ2tQIhAIwzm1MnVRZMUakkf9XzJRVXdo8W7GJeAZeQCTyOa%2BgmKv8DCBQQABoMNjM3NDIzMTgzODA1IgzFLMBLBhYRfYGYVQMq3APwsERjd50XJ3oOXyujdK%2FIKdyhrLH6GhSuFW4g3vlRGjkvkBiORiDOMd8zoj0VjAG%2Bc70oO1QVmte%2B%2Bc%2FAULpKLVnLQkmx5Ojoyb09IOZpqsX90bdGaqE99sXBub7TiCSD5dIeAGixrwXP3pO%2BpVYoKPM0fpoFC%2FcCJLpNaoY9j9IuqkTe3zxp6NpHSkQ%2BYIaVK%2B1Dr5eWo9j9h%2FLgt%2BXBfmDcjRnbS3RP1Bnrohi5O14TjaPLYLQfNLvA3DjpEi0PGX4gj4X4Tv4L2oILz0tQn%2F2PyU4xzh8mby%2BPVQ5CwWOoTdOdSI2fqtZ55GRnKy0GwGLK1oSiEtztxjQvkZKZVaUXtdOLIvk3xGp2wvvR3%2B%2B6lE8NSaAlRu%2Bi73Z%2B2IHQh8crdAYeys4Ceca1UglE9imOo8zY1raQcz%2BRzCNZbOFIBXk31CyJZxc%2BWEAFcP49fSG1iKoII%2FROJwX5WMaV3BrUFUqmXb3pIcCha5AFKGTHh7EsdxSJp9MGSvwGaC2pE%2FmvlTbLIkSU7D4j6DA%2B3rXix7JUeE%2F%2Bf0EUKkG0NLYVM6IjaQOy%2FDP8LPevlhwdv3QD9O2ChFmHrSUmWB0rOnQGPzRLs6OvZiGn8PAl7xrf3Wa0Cyjg4fKq6zCIx%2B3NBjqkAbsptsT2nsH2T07TBindqZdE8vMrbYSCNlUbvt6d5yLAAJ8pjNBQZbH7UXMilFffFI33GjiDoBMNFEu7U8OyBFbidaCTYm7aLq%2BzOKeRaUZHwLr8uvLd6uZiIiwB5QEaNwJVOVPrwI7UxN8AYcoU0XQQMngLZMYjzrYn1j7ohE6KXt03JIvjPvhSPL7Lb5m5aK88S0Qx9KwyknzVagsiPSu8CoSJ&X-Amz-Signature=da096f21f21db134e379ac8eb2bb293cfd3ee122b6703c5635945d0aea0f114d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46665V6KCEP%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032326Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJGMEQCIGNGAFmVo13ruv98m4ZqbKFkrMhtLTkeY%2BB17zvBhKEXAiAW4d12Fz6LXZicoyWqNln4H0U9uApG7BoMpUus1ihZeCr%2FAwgUEAAaDDYzNzQyMzE4MzgwNSIMzBTGUUj5jaVGOLTYKtwD1CNYFY%2FGSzFUPKw0LW7j3rDJBmDCzB8FKysMju7rX3SkyKiO2Npf5o6VnUfZQ%2BZCIqKHVbKOqXiYo4UInJ4CuzhllD1lABBYtvHm4hESCCuAQuODBrUPZ5SE8tuuJIxp3lBpKOpxa2Cpds6Oir00ut%2BeOU%2BnW1nGRJ8EgFxY0XLxGV3DkGQWcmsKmk9sc7KQKwp7xpp5JpkOrOPKkhcUeAGU5jQ%2Ff1ZOlrZuLL%2F7q63Tj0U1pIj0bFa6naIqVCEPw0m%2BorA%2BP1h5szSbkWKML7WHqXa2uxCapsdM0eoxpTIgLkO8hqbeKnAs8j3uS4kp8ajOrr8g61jxd9LkaJRaySxsFQzqCtIRS56U412htrUtUmA%2BCqwiow%2FdoCI3SPGYxtmkJ81FDQAMe1A%2BabA4D7DEc8PerEN63sU38n5SWUX1aYD0IuBkdWfvkWAYbfrtSV1aGyZs1Om3u8JTBKaYfyjMloPmXFqd9K1yKrxTa%2B%2Bz9Pn2ZADmo5FaxPL6i5erd%2FjSihYK%2BO3Y76KTbe%2BxiUsyFJiRPLXbEG%2FM1fjlnHVvVpRo%2FpV6Z%2FO%2B7%2FepjVC%2F%2BsMZO7Q4vAkBZjmT26AhoxBByhg%2FsnWuSGe8DaydaxqsNhMpXPG6JhT%2FTJowssftzQY6pgHOvx08GnIMt3jpPi%2FZRR494eh0DkW1Zx9jFq%2FzgDms%2FldYH0rVlFfWrDE0xBEf9lXbEgr5OeIUsbIbNBrMp2cnGARsxLjAh7DJ9a4Y3MoJUShxt2yHJQmk%2F5Wsb32rBD47NAvusFXCeYakKvSLlHyqX9mG6dmFCFtKNx5%2BPR5zsUv0hQHQwG0xT925MvY42pBQSHva8%2FXFUwyB3UASBsYKoIonc8Py&X-Amz-Signature=dfc4bd3a5902b892fe5f426d82964e6aedfe21f072aa63fd88f808ab7d7ccb52&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TLQJJRKQ%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032326Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIHWUtyEVfXW8g3oD2vkOudpLCY7zA2hQUj1AuVXNodklAiEApzztYdBvnIOSqyyVBE22MWDDOhI5pe2yOrEW%2BNGJHS0q%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDNhLLCt7NqbE1tDEyircA4VzjcgYGlMBtkYYcbPvV8UWT1UP4E%2BrajIIA0cCVFVIRrb9RlzwVHIdL2jw5mjaM3OGGDiQ%2Fa8A0rAsii%2BTL8hlRkWsN4vyuTxQKk4WSutTLdnEhjFrj5SvJU6r5ms3EXTXV7fD7kncfXu1210cpHX8boF6MjuZZjGXLve8t5Lzi%2FnIT%2B5COwgvM6OmnlL5hyWhBW9%2FjwqBq5ZLaPAlNv1fA5PQoj4DrqfkdqrZb5HQwFt93E1hQv19pUGSdqFdSF3S3ya0%2FT8cF%2BlIOZAtOq7DSY7y%2FDNBSvPOMxAasMELLqYFQ2XdTufXmhiY41oXHkXcEHFNFol3CHsJ9XlBnzEjAhtTbD17cluymd0lxlOlNZFyN%2F0R8oZyk1VVGMZ8HIsP2Vcc3oePIZXtivi8HROeB5uyAb%2BFME3SUptzM6G8XAsPHHQ6l2HR6%2F7KiihVqDClV7mofX1bv0yUU0eknhTvBsY50T6PZ7YIhtZo9kK1m1EqI4mhpvjIdmceHKx9drW0jp6PV3mDF2s%2BWEt7M%2FDT%2BSBIQK972Vkb9kJ6DknivbRfqU9aXQ1UZZg%2FxuJEZSKRkGRzV70V6dMorlIBsSoPGZoO%2FIbBVg0t8ZivFoC7giCuGXDi1swNUsxhMKrH7c0GOqUB7opsniRLQ6yEsCc%2BbE3wDG6FllP%2BhsDjCJvN5u5BSLK3%2BpvXk5UcdYC%2BrPjGyXhXLFXAfdCiSvuPgrZeBv8lxRS2RjiopUy8toRCQAgtkJEmZ6q39pkm6AEqXp4jP7vImg6J6z6lBAmXH4pRmvGxgi%2Fa7dzMwpNjQ4PWrfTEUSydoU8V6XludSyCvWoUR4uHHMPZLncZdFnGZqPLs%2BDgB4NMq%2FxM&X-Amz-Signature=aeff164b6135550b833796a894cf747115cd4435e677e9d9c538efe457259d01&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46646VO7ZEJ%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIQCZ1DbgVFmfO6wSURchfLQExTN6gJx3E6WrMwEQB4QGFwIgAMVHiOOexeoIqL6tGDZf3ENyxXEczBkR8qh%2BJE15NW8q%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDINa7eWv1PVtl9DmsyrcA62qnJCvpGUzJXNC4bj4t3sptMyYvjsHgcE8Q3FoPnVAE8uRBneR5ttrecc9Iy8DlNslV3yfVUiGZUfSfeNPNkptdyeI4HBL8G1b2XXiK8vB41KDDzyZ5EwbSQNFBm%2BhXGvKLu3zJfejYip5YPQx2%2B5TWnCrfThRUbvqL4kDlfgeuyzqYcG8ETGlYn%2FWD9%2Fb70PeuRbFaaYWwL%2B2ocaWlV7FDayTp9D8SiqXq0ylDPnyhOVAMIz%2F66QRsMbo3fBP4UdcuI71hue3a0pUs6qyjYhU7KkkgR6AAEgFK4N%2Fef4qVENBvWztCKN%2BmE9gTjiyi4YS6s5dcRq23EcIi3INLFSU1y3836i4Fx6iGQe0wGzVAiRP51ExoNJiY58CuuElRlNqcXgma7Hom81Zo2N8eU%2F4MiZFstTKD858KQZtK6u2DyqWyIUwGjhd%2BPCxbf8wW8Iujtl5nT3B9le9KrRXqfI0RbYKAuJjo4SWYAJTu7z%2BBk8mqjEc%2FgYSnHEiDQEReuWmjiCi52ivgKfL9%2BJ2vhBXHQAEedtc%2BMxJWzE1SUFhx8%2Fg59B0tdcJAxquAf02z98cPR5x3kfKmjNd7KAGVwGZcXZuOcI7VFrz1L0QqdYoXoAhVywA6WkWKfckMJHH7c0GOqUB6hVlRQdjHtE1aXjCfOMUCGwSpFoULy%2FCkqSDuNlKvNfIdzrLQMpge36O0JlwAOjUd6CZZmH3Fp86rM%2B2aOf3U2vOsZkKZAZpCn3JnDHuTP85DUXaQP9HZBGjXi%2Fr8MXIYyGsjyVihS639m4l5Tjg%2Ba170PTnDKMGZ%2B4FWxhOVpn5rBHA6JpNuxNp8z7AFMNRwsnHgJDQFBOydRbgqpxn33%2BS4SG9&X-Amz-Signature=2a57425d8126701a4a943f5d4d7a83dc592bc039a91bafd3b50ba1e727f4d1b5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666SYO2QBY%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032253Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIAmaASQ71L7B3B2n9Me6SV%2FJyuMd%2Bt4b%2BeCPtONXGtijAiEA4mYrZpoBqtMVxaG5wW%2BNsN2MhQwvediodIoRGdnSb74q%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDCwUJMzNuqi6xCbwCyrcA%2B6b5H8OD9k7eXFXa0lnl7AgHVdfFSSVVY91QKAioFejXCT9k6i6hQaJDs62ma45wWJxCRFqBWl5JkJDCE1RcKp%2BxCvkeSHCv71K649%2BfiXknn6lhqQUZGrnQVBXM0Sz%2FSaiTk8MhSsl3Dedb5f3grA%2Ffr4NLWs0S3yEmF15Cx61NOZTXwR7fOOrPzD8vikJtXUhzqC17SCMjKX415Cxo32Dz7XaqQ4OPgsBsy8jQ9OgGigZ9erNh7pBnEnCZ2s49G%2FKJAM1aLcfkeTpqT%2Bqf2OImdzoshfcIU7sRua3wqYqe7KeYDXLKnnZO1qgEgST2%2FtWp7NOnSv3iiX4Pi2x92g74OeM3IxLzBG0z7%2B5AzOrLMVNKkI3wjs4i4DxW5X222wvsVuS66%2FGzB%2BAf6j1a8V4lVne%2FDfzCYZBiddWbfAZzPx07zL868B4fT7HzRYnV0b2dRy%2Fqek8MQFkrWOwqauZbJoaEr28jHYcst8sD6uUMvdfsDTU%2Fut8%2BrRQ36gex56Paz1fDZ8Jzk4iOMLlpcXDg%2F1czNJk%2FPMBa6b9hxIOqsF%2BBJCXjZgxqS48Puqca46t10dztezHcwlUADIg%2BjTdEDyKnKRRekCcaEceY9L9WbR4n5lO894zh1hoMLTH7c0GOqUBcKwp6dPmjpDFMOMIA0CKYNnhjL%2Fk5PdZIexIV56S0KRCP9DnkqpzDiryYarEo7u8W0z7es7ThmHSCafJUc3w%2FLX7SK4TYEgBDDSeKW3RTNk1%2B4wmm302G%2FtskZ6Ck1biBTRlE87Qv942G%2FgYbPyKOYw8bVWdrC40DgeMkQtdFw%2FHVH1wO3zy6L51f%2Bg6kTxS70Ce9IDIWjbegesjdAZSVDgAGMaE&X-Amz-Signature=7d007771093808547b02992afc57cd6318816e5b6a1c42918df5b68e31e78aea&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
