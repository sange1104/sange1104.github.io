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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46662HGEOEM%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033911Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAYDtt5tMDfh1y8qZVyyFxWFrDNM%2BWLjY%2BJFEgZF%2FcoNAiEAyfa%2FipW06RtDWGESUDzJqPAVZG7sSy2XAcK%2BD68Y5vAqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDGJJcm2arTaMUYohircAxLgN7XIw2%2BLTa39f%2FKtEPPmfZVyrxW3AICYQq20qaHMdVZpPb%2FtBz3ttgjTvMcnl7b5BfWgiJieidoBQ5RLaL4kLrfUxyya4aceKEl9nTYiT5nBHwYr9z%2F1Ftle3rA9kcmghF5DRIqM4T8ZNybdY6jKFe%2FZCrLE5olQIEZF7iteQNF0sDVJiXTzDBstuWMMmTXip9hCF6L6TZvfrBjgN%2FDVeVte0zAKiY6U57KIPxjiFwrCnNTuz9VgWo7cxPebMaEvFJCLDhzlL%2Be4eAKKdHNI77gIRXyasVu8ZI%2BR5oTM062avLiQLYFf4U5TgXSWCJ6CeKYDzulzfWZV988YrANgWVlk%2BX%2BrpcRYGHc%2FJ%2Bu4qf6ngNoQO%2FKM%2F6sbX80AWFDFBzM13E%2FTgySaNYQSmkRhgfR%2FbneANrK7V8dd9scQGvjuinzVEfsW07XFQwMkIfhp%2FU%2BnPh%2FPSVCnbC5e69ik0kpZtuqipGqf4zc1EIfl1PuXYQKfUaGrPeDq5k9YK8Ku6Dl19M0DSg%2BLhKd%2B%2FCOzhKqFCtpbfBLiDEceo0KMO%2FfR7xd3zJKpTmYj%2BIDE1r6A557UuxuOHC%2B%2BcP%2BKNsMbb1yaMjI8dls4BAWytUXzm7Y05D4fviwo3ClUMIGex84GOqUBAgaNBmeDLeNpPS%2Bk3LnQPF8JTx0r0yuNWrvnweYVAFHx8tD5lkbTqczOTbwgj%2BrxunAAoKUAXr29Z8on7PqAydb1ozyYggeScnfX%2BGW9jSF8TZwf%2BdD89Vmcpy946lgV8z%2Ff%2F9LfWf%2F9dJszLQ89L1YOwV4wGNWQngjtBnF0Dwx3u5%2B1Iti18%2FV5vJ8u%2BSQ%2FzPCkqnshxISRy37LPblML1HwNyGc&X-Amz-Signature=83d6df66a7f61dc70a061080f12efd7121cbdd8a4f4233f31c1d0949ecd5f084&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46664GNJB6X%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033912Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDkdiiF95oIxwGUolDgLMsafzSOdOHklqcu4XHU5Slh7wIgQ%2Fuk1oG%2BcB1WAPw0l7NRs54fy5kzVyMBicW93fRXzHkqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDELnPw8qF51bYYWJiircAymPlCLf4o5jewfL4peuBvcDrytb5QmCfDDmBZ7WG68pBPRvTlOjaNvHM8alyfzC9Ubt%2F1CPLBSKqwObBNopPmW0Lj112y6ofgleSKMLMo4X5376vQft6AsT6KER1WwaI%2B18IOG0dFeD%2FkTNR2VROh4ah7GCxegQoKPgKE8a07rzMSPETikNby8dH6r3iDbrEoz9ZdsMJIGPW8NcinhFKoPgmIuvO18nJQB%2BNt2tEDs3IB4ueoB7B%2FTCE9HqHTpy6C5Ar9u8Pw1S%2BlJ7589bII0BoxgoQywhcKTJEUzkBRfCgILYEzzVSkMtRnCoIJSr3l0okAxgADJhH0E10rDDAUJYevK%2FGckV7kvNq4W8bS09lOHGbLfkFvEsnMaGbgFWRmSqjxLN%2BbCFYyHpuUhOXtHiYsYcwPBSTm6BM%2FzZEkoR5dGKzyY7IB61WQhdX8IaWEDJt7VfsEghXwhiBTzExkJuU77ZV8o9gNLA%2B0zv9H769Yvvu2WtNZvOIU9h6hlX3f0nO98vCTJpx2FWHMF%2FvuCKSYl8WujGMFOyU8ORoiBjez7j7NxCXB7NU4cEtvPnqg7smkGRWKvIxLIwCP5l4hT2tDnEkoWW0DvJOu%2FmSzzEklZ70Am%2BeZEjQyyHMOOdx84GOqUBvxpwgKqdgHXHp3tU%2FwtLbK7glvjFJ6Xq4ixssul0oQA9hZHSxSmHD82MdcIyW2bWw7Eg5KP%2FyffByG6iEUOfQk2KtzA9LB3NnxUVM%2BDC9T%2BYRQPFBZj7z0bPTy%2F5g9aQMR2wNzOBR9IczmdlwNvAIXmkjK5en35ataftA7gURVqiIQGeSfxaXoYQ0mOTc4%2FM0Wmux13fOlUjcRfIm%2FXWfbiYqp09&X-Amz-Signature=df7dc0bd4835a96918b06f9385e498ff43f2440dcc2b895d4b0799ed29f47a2a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y6NVN3HG%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033901Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIB62S%2FnyKD0dxPYzNAjR8PEVWDN%2Bf8XpSV3vok2vMngGAiBPolQO63NTX%2BpJxryxqjJQ8GYlZwiYQ8UaAj%2BZxSV4IyqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMpJM7RPa8KR1hKaovKtwDyyW9nYbYPWoW4dMT%2Fq%2Bckpzdztg%2BiRHH5H3FFibYYVUHeWvt8rtV8evLSiqsHCh5N7dBS22yoAvJMElcRk%2F6weSy65NjnL3MQoSniIg5VWr4PnO3XPdvz2ugaJwZCwSuv9YxtSmeT516l4MesSIndN2tqxw1fD47zhT5CUtzIUOfiBEKLPu25X5bYWjFM4SYkZkwdtH%2FoyxOi4xQ5koGhTEPSFU1jRVdx8URw5wIqg%2FuB8pbVlS1NgAo4Vz4hheRtXeiHZEFdv4oA8NsWSYO9QsLYreIEaSMK1jmrnpMtIxZD7DP7etnoQOrxOJiou9g1EJPhU%2BXG1bN4%2BWROxWUmYWZXCQ4usj1uqhJFxhTPisxDq9uJah094cwP8dVuAv8M31sQobVvS7BPxrTAGLmAJf8IZMjqHrgvqyXh4z96IqfKQ3OIhGxOk7SpbThCdwHS%2BIVqjyF2uRUz0eyWCqV%2F9sB1j9%2F9CUdMRRgfjuF0UNafRieRS3bq%2BXgrfMnEd52ileNysOfn48W3WkYcIp0YY04wT4mRA%2BkJ%2BeZvQcS%2BUVO6u8fJ7CWx%2FMQjlduUx99YOU%2FcEOgk%2BiaPSwMJ%2FQI6aq4hK2utT9GQdOJ3eRjS8IzgmxmtroVLrS3rCQw8J%2FHzgY6pgHdan8Ut1FVzFJ2E8UTtUYy9odvBoFSJb1LBdqG2JIp0A%2FDEM8RflVY7uefTeobqWlgJ51pOc6dBr4Hk4XrXHkg4H1bExyCAe89oHCwFwd3iYODvwJgp9TJHRWwrlS5sRoaqPQHWxq4kHSqYwQ5%2B0FvdQcGgbPZnKy9E6CokhewO9lzAqA11MMJ7wbUzevtMdFqfLqAm%2BX3qY1l6qJChZTjN85kgjFv&X-Amz-Signature=247b54183b815874c32166d09cf0236023fda2732ada50b4bfff4d7246af323a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y6NVN3HG%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033901Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIB62S%2FnyKD0dxPYzNAjR8PEVWDN%2Bf8XpSV3vok2vMngGAiBPolQO63NTX%2BpJxryxqjJQ8GYlZwiYQ8UaAj%2BZxSV4IyqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMpJM7RPa8KR1hKaovKtwDyyW9nYbYPWoW4dMT%2Fq%2Bckpzdztg%2BiRHH5H3FFibYYVUHeWvt8rtV8evLSiqsHCh5N7dBS22yoAvJMElcRk%2F6weSy65NjnL3MQoSniIg5VWr4PnO3XPdvz2ugaJwZCwSuv9YxtSmeT516l4MesSIndN2tqxw1fD47zhT5CUtzIUOfiBEKLPu25X5bYWjFM4SYkZkwdtH%2FoyxOi4xQ5koGhTEPSFU1jRVdx8URw5wIqg%2FuB8pbVlS1NgAo4Vz4hheRtXeiHZEFdv4oA8NsWSYO9QsLYreIEaSMK1jmrnpMtIxZD7DP7etnoQOrxOJiou9g1EJPhU%2BXG1bN4%2BWROxWUmYWZXCQ4usj1uqhJFxhTPisxDq9uJah094cwP8dVuAv8M31sQobVvS7BPxrTAGLmAJf8IZMjqHrgvqyXh4z96IqfKQ3OIhGxOk7SpbThCdwHS%2BIVqjyF2uRUz0eyWCqV%2F9sB1j9%2F9CUdMRRgfjuF0UNafRieRS3bq%2BXgrfMnEd52ileNysOfn48W3WkYcIp0YY04wT4mRA%2BkJ%2BeZvQcS%2BUVO6u8fJ7CWx%2FMQjlduUx99YOU%2FcEOgk%2BiaPSwMJ%2FQI6aq4hK2utT9GQdOJ3eRjS8IzgmxmtroVLrS3rCQw8J%2FHzgY6pgHdan8Ut1FVzFJ2E8UTtUYy9odvBoFSJb1LBdqG2JIp0A%2FDEM8RflVY7uefTeobqWlgJ51pOc6dBr4Hk4XrXHkg4H1bExyCAe89oHCwFwd3iYODvwJgp9TJHRWwrlS5sRoaqPQHWxq4kHSqYwQ5%2B0FvdQcGgbPZnKy9E6CokhewO9lzAqA11MMJ7wbUzevtMdFqfLqAm%2BX3qY1l6qJChZTjN85kgjFv&X-Amz-Signature=78f390be0f507e27a45561039fd38a517ce3fc0ac53bcd7ff2434e3e455fb559&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XAFYXHL2%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033925Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBYgny5pWx08eX9EV5PgPXxHWgVJQwgdLC7xncxAvGCkAiB3b3t1j1J8TLOjeibr7vt4Zbn4ngUUmhkvCdyGDJinNyqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMDSy3%2FOf74KeNHi3SKtwDJpJlrs3k0Tduc76T20yTDTksl0gq9W5lSa3SiGv%2FSa1cLnrWPsifmxHDLTDIyag5R79mLMOOOBTSGnOSmivZTqsKBeI%2BAEE8LZ1lVY4gZgDe8IB28rgqAdCGDHO8UQZa0UQF3ivBgtdo8HiHf9JWxs%2FGOpRGfug2RLQ4vCHSLKGhN1%2Buu%2BYZBBhONTvmJjcXwuB0wUQ%2FVKZat6sANGsd6s1dNwgCXTJXIOj712M9r7vikmMNtFevGE%2BWoyhfOpHvr2LsJ9C%2FRq7VF7v4jZd7yuIuSNIdoOEVwhZ2YsaBYhUscHS56PguFElC3FvEFtNKd1tTMf%2FRVYYkewgZrsIfJPk8BlDj3ymXRYYIm1eEpy7gXcMy1libRGUz0keRZ6B4BZCroKAx%2BnSYzsUag01jDAhS59EL4YT2n6q9%2FlwEfvIepX8vBPdjF8VGrMW3Yep6X5%2FbS2i8xYiwdUyeGO9Fx45SRqkv3OtR3Cfcu%2BwaW7%2Boa6Ah8uVyvn8OcEkeCLzABK4xgB0nmF6guZosFYue3hcP1bmO%2BDZWFQB%2B9F5Yx6vZCaP7sBqgoFKOTFsGW2nTXQk8WP94vUKrF2bzWFSwcShfEcBALRG%2Fuk8LjRi6Wg%2FacT9OzaUHsLTkaKIwmJ%2FHzgY6pgHMRTbRpKCSJDdEnCxFx8xRNnm4D5gmUP%2FCKjwejidXgb3mzon7ZicmGJBUHvWD0q2Dq1yqyxCJURXDitO8Ftz6BufcUPJj018aQikJ0c6qPMUcqXyNiNrXNey5suglNpjNSOB722PVyFvzNIVvzvGYcbSifQzeBFTCsNoX9YkeEATxoLo5dMAy50eQy%2BbGFoTs4OK%2FeSi4UC6XnewQLMsH%2FexruG24&X-Amz-Signature=c17e33a2cfdc76d7b4d40d63e9baf8c3a07ecd7b63f276d31444ed7577a527f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WNAC3DM5%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033927Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDszg%2BcnD3mhzQJiBZlvTczpjMQpke8GJCCRlpwKeyVLAIgE2FYiXBx2%2B5wPx%2BsdxR%2B9aUm0%2FLVUYyy42qoz%2FBgrkgqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMrGH4BEmpViY4CryCrcA1Fv0z5xKWM8%2BoSgxeFBIgXxw%2FH51PvM60TFyeAliWJkkz9loWddh4iSYIPOxrWn16HTqE1%2FWdr1C%2FhEGOilftWK7l6EsnGt%2BdGXKmO4%2Bsbv98RLpWeVp6aGGxXMBLPEybfFttDIQ9N%2BHyrP4OzFOYh%2F8Kt8UAFAFAfeuQPjMEnQ1eAW0CDf22Va4WCuLERrwxJcWomWO%2BJe8XlYn675yKjm%2Fsmgd5Epzk6HitCCUqE43QHHVwsEk9UHszul0RqUVmbZFjBPNoaqh6S3YV4BkGueDKWe5dikK%2FtnUvnhfPHYTnbYvQJLRKH0MYvS41Ae5UEH7gFBAcWUjYu%2FdYgGOxx26PH8L3JksYRGN2LAzjlwMzft%2BYSPoXzmF8cAch4rgu4SP2RzQ3dRMflQApmjKIUkkufNB646%2FtOEQ52bWEgd%2BnAfu0iW1N%2B%2BY%2FZZVcAPFVbubeqTsf%2FxsGjIq%2F4cohIEJnIiUxQUBdAf7QrpFH5L9Lh1xo7agmVqdSYFrDCrs2B%2F9dyujuTEklih%2FtOI6ICu3beG1MtJoTJ8WFEEOyLDeFiC4CRD4K99HOQxns%2FzH3KBlWrYBLi7U64iF83ea%2BsRPRzEI3VZY8wsDpdA%2B0NSDYabdVKPBXL1%2FNs8MIqdx84GOqUBdScYynTpQMmwiqDnITGGHFO2zzs5RtWGR1N%2FBklGOznXT7BvHTER1YLa8oKimNsHQUv2ZlhjMOH0ci%2Bpe1PodosAug08z%2FTYTeplQ33e97LsUsEZHnXLaD6GvY%2BRe0vLIfo0Q%2BmzCxCJWlcThbsN%2Fkgn4hVvNbXeq0Qi%2BcPWpC72PkZqFtlTPPZRLV6Dj%2BZdLQK6F%2BoQXEplD8XQ11plgKM%2Bpyxb&X-Amz-Signature=9ed073fea7ffd531e81bc9ff7b2d4945fb03caa8ac97d36dcdeabf8a3df890f3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V6KXP2IT%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033932Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCt4dsTMPpIQ9RKshVRfwCYACh0rHgowGJ%2BlVVasQLCNQIhAIOqUN9bNQ5qlHbkn36AfqfxPJqCrPM2M%2B19NUutC5mgKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyjfbEZ4mvWjQME6V8q3AOdJ6gAgBjrU2YDNqLmCXkonVGiT%2B%2FobC8xakENKWL4QBo6BweXBd7at4pvEcQ7p444GU6umhBsEClPeQh3Ihhwy0C3hl5GcbVMsZXTq3Ptv7qn5hrbT8aC1BYu0ofunzz04mN2EKIdxSRybYPgxyZmNkEvRXPCPs2SIhOggQIQz2mRT44u6TTIQ%2B363rEJZSMPSvGweqFwfFJgOehQu49ppwoUofzkl9jS5%2FIDDAxv6CBlnRpKnC1J8UoYezoHM7feATxWp4GGI3FdfX%2FSHG9WOO5rLIpv4woo%2BBNLharb4Tb7prCNAHxote9RlaJcJZlzztV6%2FNuDnvAqBCmt2BCnSC1T1EjiejCW6hrPOujOkXqn6aLOB2idzXHJCcMNX3pr2AzwSEEacfsZssLsvVVFK34jNJgEzU%2FFBti8jFkeOi910THcHL8Rj6qQJ4SUH5Ks7IBk617kXvJyQqXviK3nG9K50RVE6KzAs%2FWgFULv8xQeVP9CZ2TB%2B5tmf%2FCbY8LnV%2Fqv5tyM8sWKYyxxMHkTxBWTDrThIH4U3sO%2F6H%2FhrFrhc5ACBv9SBok3qGmW24BpUAp98eWdKRhTPL6zkGe8ucU2MWYbMMnrrLxEe0FkwnuPxF9dEcXSJFVWTjDPncfOBjqkAZ3FhpbjJTdTtUEsR7TS1iuvcIuRu7gEkDFPQZD9dp0Lv88SgRMMQtK5N4tbBnZReXJss8rsj1FNTMSQEZ%2F%2FdjzbxeItROMzlBB8OpVWJH2ZyGUSla%2FHIHaNfvNFOnB1oCWzQVfEOin%2B8QEJ4kI87mke3zniWwbKrGnFkk9xCagpkss5PVef9dfsJKS3VpM8jjy%2FX1JzGOjkMz4MhJEmsC8RItt0&X-Amz-Signature=4a246237873dc5bd2b04e8c3626a5fda203e0d3061e87035e55710b5152186a2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TNPBXZLR%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033932Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIH3sjGwICUiDAJu2iQVDx2f254JylWg2pObpslidMYPtAiEArM9cPsc%2FgNMZq5WiHiO%2FK7DhOxUHTPPxHnul7mZVVSIqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF7houM%2F6QXHHg0BGyrcA2pywJveCDMaLsIMGTuBoEO1OYfqkOG8yP3GIwtsSyo0C53xye2%2FqluOfYg9gKlujei%2Fmcst4Bn7xlswO9FvcZhLBZoEQiEKsiqNxhwSOVVo0L%2FWcWMp5HK%2F5wXT6QzRuUz5sLiTPgsYoUdZAzk9DykE3dwGq1Q%2FkSA%2BwqJP8ihXYezMLxo1v0AQmVwbEHHwW3NJEqKNFtZkh6TcuIrwrGI8jOi2g0R2%2BbMZACLkeebsrDzIpGy2rjEHxhBYITgXJWR7nDouKIq1bc8jgTpVfbkW9KF7YLlgzo5ac0iYuhbVF%2FvyrnJkJuU3xRlRRm44MtSMOAM8U0CRRk91%2Bic1KHeTVekwuCaRLmV37MS9L8I4%2BmzzHgeXbYxiH5%2Bd%2Brtaf3UKxKBCDrCgzmPYXgfeT5wX4w%2BoFLLA56T5kFD2OTUJ2T4o5tEpeJVuV0MAhpy8bsG4mRuKHVD22nHVzSiZ38g%2BDZbIOU6cZeNfA8TWe7Bvj%2Fs%2Flff5OhnRPMpBGSqjB8HIuW%2F%2BKWI3ZibEzZNiu1jCEeDc8Q%2FUHVhSp%2BseRs0m%2FbEiY%2BzqTDiHgBvqE2MrMOp7wcRwMZiPsJNMXxpDjKqHq5dw3XxrBgKzdS1bo05%2FinVHDLepX3QAkCUpMJifx84GOqUBMjMkNNc7MjYgqd0pBfMRmMkiIzQUwA7J1b%2B3Z6IhRqoDqN92PIk0NSEEOrwcvETIBahwA%2BtDjJLfOSMRmoXgJDgOcUNeyQBHBT4YxgT6GpE%2BfYJA4JMFRdFmvchMRGwnoIZg4mJmdeusskrzvLsZmjygg2KjCWpP8KxYTKxbKx78svnuahjpIIsrjwoTSUOndPZ%2BlD120eQO1zcKAOqxPsOud1lN&X-Amz-Signature=0124d70a92378cc1091c56d844fde649dd61858f2459c8afd279dd6254bbed23&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YRUFKAJ%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033932Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDrJOO9HfB%2BGT0pxVb3IvJ5EF61%2FjLt9045dOMMNsOFxgIhAKauiWVzB1a2skpakIngyxQS1vAR2z6xfnvPx%2FFWoYobKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxYvZf5rm3hsZHRbLMq3APHFcC4ihXUaBYU%2Bw8jkr%2FgXcHR%2B9EpSXxEq8bTG5slYkG5sBC8jkbNUIb%2FfFn1%2F0hWhNNG6mxBDhSNhl7aN3%2FLxXXV9F7JrGrgbMbRUm091vQtXM%2F34nzpNT2dw6Rri%2BMQd2nZlqQsbi%2BMgSUwBJCXLXTXFgdyr2iQYMvdL3aCjRpx%2B%2F0361yTZWtMty33LDrq892MDpztiq1ddLq7QhTM0w9wd5SO%2BJvX3zu6KYqEf3tD24uj%2BeLO0%2F2bkCDeyiQkAl56Bnoeh%2FmGE6EkZbsG5n7bFFyhfa2JTqy%2BVcYhkEEE6clfmlfDGBiZNKVh%2BhCbBA%2B5y3xT%2FhgauOKmd6zGij3S0cRPQwckyyfAX%2FFhaAgLVhBhvasj6Kh385jGfn8yxjgLmE6c8GEwV9wsuBk7jza38Xd0RvWoCdFeDXUAwRlk5FOt7AKh2LBS%2FxXXIlrE4FUiHOVEm2esGsjikd5hQjB0LUHTWHDBMp7zRW0scGtQoxfvfoDbt9CxEOcUPwBb0bSM3yaE6y9HI21bewfUipE1%2F%2FDAUQeAyP%2FC6mtkOgkZ%2FxLYHZHLsFVMpfXVHXa7eggTrCP8FUs5hiduwTvgH1UXwXmNUvVm9R%2B8%2BY2IHAUCcnEXh2Pmd7v0lTChoMfOBjqkAYFsMkyq4J3Wcy22jY%2BczFFqwGgEhvSN23FCyK%2BDMKPzyhppeDoqlC28lr60TNcgBzjtbFfXcB2or%2F74BW%2BHGGyqtOtTiPPCy827yDGtj9a2QHR%2F3glOBvM4bxLBflPf7B5ibvq5%2BiC3ubY0HsSpYLLcN73MW16OeG7GRD%2BvupGilSnzlxxkgnhOv04NQsB%2BEwOd7rB6uHNMjLTmPge98ktGjQt1&X-Amz-Signature=9f06fe9364b704a4cedb744ff53399fbc82457730d3aa29333a8753ee3a49f88&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y6NVN3HG%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033901Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIB62S%2FnyKD0dxPYzNAjR8PEVWDN%2Bf8XpSV3vok2vMngGAiBPolQO63NTX%2BpJxryxqjJQ8GYlZwiYQ8UaAj%2BZxSV4IyqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMpJM7RPa8KR1hKaovKtwDyyW9nYbYPWoW4dMT%2Fq%2Bckpzdztg%2BiRHH5H3FFibYYVUHeWvt8rtV8evLSiqsHCh5N7dBS22yoAvJMElcRk%2F6weSy65NjnL3MQoSniIg5VWr4PnO3XPdvz2ugaJwZCwSuv9YxtSmeT516l4MesSIndN2tqxw1fD47zhT5CUtzIUOfiBEKLPu25X5bYWjFM4SYkZkwdtH%2FoyxOi4xQ5koGhTEPSFU1jRVdx8URw5wIqg%2FuB8pbVlS1NgAo4Vz4hheRtXeiHZEFdv4oA8NsWSYO9QsLYreIEaSMK1jmrnpMtIxZD7DP7etnoQOrxOJiou9g1EJPhU%2BXG1bN4%2BWROxWUmYWZXCQ4usj1uqhJFxhTPisxDq9uJah094cwP8dVuAv8M31sQobVvS7BPxrTAGLmAJf8IZMjqHrgvqyXh4z96IqfKQ3OIhGxOk7SpbThCdwHS%2BIVqjyF2uRUz0eyWCqV%2F9sB1j9%2F9CUdMRRgfjuF0UNafRieRS3bq%2BXgrfMnEd52ileNysOfn48W3WkYcIp0YY04wT4mRA%2BkJ%2BeZvQcS%2BUVO6u8fJ7CWx%2FMQjlduUx99YOU%2FcEOgk%2BiaPSwMJ%2FQI6aq4hK2utT9GQdOJ3eRjS8IzgmxmtroVLrS3rCQw8J%2FHzgY6pgHdan8Ut1FVzFJ2E8UTtUYy9odvBoFSJb1LBdqG2JIp0A%2FDEM8RflVY7uefTeobqWlgJ51pOc6dBr4Hk4XrXHkg4H1bExyCAe89oHCwFwd3iYODvwJgp9TJHRWwrlS5sRoaqPQHWxq4kHSqYwQ5%2B0FvdQcGgbPZnKy9E6CokhewO9lzAqA11MMJ7wbUzevtMdFqfLqAm%2BX3qY1l6qJChZTjN85kgjFv&X-Amz-Signature=673019327bbc8a49631f0934c10c24862deba8bc78f33ab37eb5fa7e77891037&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
