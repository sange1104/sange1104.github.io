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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SVG272X3%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043754Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIDHzBdmNFSX6D0Tsf7UCIYlWPChJ1vmDkXEJHhooNXFMAiEAuvpgAY%2B%2BmL9KMx0IzLlEQtWGnQ0NrDdS7MMJrYDCxm8q%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDHIEpsUX8%2BlZkH9O%2BircA%2FHrv4wlKq%2F9hborBKu3huSDINJJLN%2BrYgckYaCxANaq2Kyx42WnTGVqej%2FPNwce0%2BBBQubes5DZPGggMAZQNn5LcKu2rbPMkFn%2FNbYVWDdhXkx3mZdF5blgzYmKqDcX430IA2ZjNBcRWjw3Ov5EgVehpP9KBnxwPFJKnwysAVvSm%2FviTGPBpto9G86OQGzj0IR6HJbK1PKqNluTwL5oPWW%2FLp3P%2FfuCKKJE0VKVo%2BAX755%2FT%2Btb4Gqk2KUILrEC5LQnal8NBrk7vIkEpTyEx1I4cO07jxAc%2BFfNlwuXnSI8GtoPkdp0x1syUpMPlR0QIHrFIngm%2FatcyfXX6DraklENCzMPl6PqtMVQPclAhr3x%2BvD9EcS%2FLzPBWU0GHBqddnoRdjZZJPbW42%2Bf97oSzUc7k73ZzgzkUdH671EElf0yJ9kvEjRDq9gljKkknHJkMZ9ZSuNCUvHCjVJI3EUc7gaAHZSYskzsegL6cD0KuIBCNqpfhKVu9Oc92bjijsOj3BrXStsxd0TL5%2ByCvTXv02METmtPfmlfLoeF8x67XAF2limfwXlASl2sojbjyhj60PqE6XnW6vFQ3bzxNp2nzfN4t3cFVQE9dibdCOGP795Kyrj3MqYCdrJUBa%2BeMKK2hdAGOqUBamMJC3wbE3ZSldp3TQSlx3VItd33phecdrO6weLrmBnm2vCGWGlOWQq8HA3xd%2BOGlGLrM7AN0DwCVkedz6wvsGxjI0CIWjc290muRB61iGSWE1ot9S%2F8EB5qoL1rAuxdTMgP2%2FxE2pIAJFGHNSXFUlWkPM9nPDg3W9LsTINtqgI6KmIyJyDxLL6PT60SflzsSQtj1%2BbsC5yN%2BEPZM3abFtyScZ00&X-Amz-Signature=6d097710c3171e8d3e3054c72d6d978e1d3cf12ce61ede9693b56dd5a9a1371a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466477B7HSB%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043755Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJIMEYCIQDfqlvAvXtsGs4VwpIy2IWQVNUGYI1UAtphjLe4cYpiswIhALpIHZ62Ow%2BzJLUqQmr%2FR7ENNk2vu0hVXlV4YHVJBCYtKv8DCA4QABoMNjM3NDIzMTgzODA1Igyd8It1uO2V5zGpS0wq3APQpZhapBi865d9Jr4LU5vZpOy7xK1niPu26zspXnhej75DHKFbwjcBObB4SXnCtc%2BsZ8YMVMGJS7GO0vhajQcQolBvVV6R%2FV%2FGKOHzuNM7HXrz7kAuvvbeMgKsBQSL6eemuJq3rps2fE4Byp5XGutMdoBr4Kg6Gt0Aad9hTp%2BXoQiyc7aILepV6UG49rBP20GGNkXP%2BGolOe3ctBavfTzkFN9A9VPcuFlc%2FjQHMnPJvcW%2FvY6RSnczDkVogUB1FIJTJVgbv5mTk3NVqx5657X94P3JaOnOLgyFVH7GH1HtNXG1X%2F5AJYuHiWKNLocCyiS09PFFNySQOgYI9y6ldCdSkOZbpbddVpH10ST7JCsS3rOK6CK2JvyecZoXP5x5pDRLYFA02I07qVpHaUMkx%2FWtAjDxPrg9l2yKLsQZ9Hv8636StF0XLmCAyOqc1Tt6Cw%2BsJiSY%2BZMHas8whsYTMpFkoO28X3pPM5MKYvfAFe14uww%2FpI18mykThkacGDoixc8fG6c7nJWDGwb3%2B0RdHwqogFXtLHLMVcPiXtKidFHhtL2WoGFnPaUmGklPe1rznwWdbmrgy%2BX5OzDHxYYEssm%2BegioZK2fZEDgvnkU0soJSIAsN%2FZ1sgRGAeyTWjCUuIXQBjqkAWTL1qkKuJm6P6CpgIQrov1KGzOZVE08yGe0%2BLIDQnLTNcnK9YR7sU%2FOv5HEOT3phs68kCQ9chg77OEiHgFFhSeAhrvDyTxl2Vht2ahF2Mf2T5%2Fkc190hxQhiZveg4KhREaG2yXOCFJxcVG1EW8DIipEiVWKj6O6UhmoaCjbFUy08USoGTWrJ3kUHgkUPZH0YdFL5W%2FlsS8SuQBVii%2FnVJINidxA&X-Amz-Signature=bcba907f5178bfd41a8996f38e9a4d0279ff35fdbc423afcc90007f309a6fa11&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PRBS4QW%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043747Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIAapym6er8Zpdbo5wNcs30EJgquBHoqdfUaJmkjjfQ%2FBAiEAjFYPrnq6mcxQr92DcNnkQb2KLMyluzWovxXWI72YXDEq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDC0sM5Hg1FViPWA%2BrircAzbjeVRw%2F%2BxN8ZM2QYSN6oQiXTd6DiX3VmMGiEFhU62y5VkuehhLDbDlmDM7JN9zWUUwnIfiOVraeUAIYLwUWqgA6vXTyb5ptuPTu8Pkla92b4gWxyTE8otFgxNtnohAoUdzf72lGXZ28EogGgyP5PT6NnuKr0v8D9nL89MMUsl8hfif5VIYNqHrz5nBY1qhmg4a9dcyoai1k8EViBKaitdEEXZfQqzswrqo44YBfovzmFJQq5PtpGDDOrGlFFSfI9lLEwwIv2eBHaIiBkwjW8ldOKUtgsOQon64pZrRNDdUy5s%2BRrHroDrpXLv1cEdNGVJbAv6GVxZB4iRYfSU%2BrYLknug0oDtLGGzGyQsxeGFjDZBbgHukwhByPqhTDvTPyEmY%2FHjyCe7CAiCuwXLG87Jj8X616XjtgHdgAnIQHRDoCM749x7DTA9AjDv5Qjrh%2F5qYXY6ENVZJ1NruQ%2BGis5EsYp0Zz63Ypps1DizTkTFP%2Fmf4obsE6f6nI61wpunW%2FamilGB%2BaAgl64fXr8bNha6b8uJcIWaBu72WLEDSLklBQtCGr8B3y1dtVWr7kzzKSwJOszFHY8bOhxLIAjATRQRbue6l2A9YORlVc1JN8hE97G20gq0z3vmUIzOfMMa1hdAGOqUBgZhMN1ntJNFygwSrdZlXzId7rmh%2ByOO4CNMCzp5gEb4pzlLfVtJDzisOY0E8fBupTJDdrNwF0HRVouaAtLQVS4f2S2JD8qkC2HQhKmpFHLbp7J6r%2BLknfNKNmpicKx%2FE9L1zQJ1Hb%2FMYlyQvez1DzNYssnuofy844SnuR0ynbl1wUYUXoJngLP911Sab4NQkEi0Ip5Blsu8R8v4gLTOsZWLQH4HD&X-Amz-Signature=5ff43e08ab864db8d464c50ff1dddd5b2c5482fd33900b9b1883d06b3993d799&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PRBS4QW%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043747Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIAapym6er8Zpdbo5wNcs30EJgquBHoqdfUaJmkjjfQ%2FBAiEAjFYPrnq6mcxQr92DcNnkQb2KLMyluzWovxXWI72YXDEq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDC0sM5Hg1FViPWA%2BrircAzbjeVRw%2F%2BxN8ZM2QYSN6oQiXTd6DiX3VmMGiEFhU62y5VkuehhLDbDlmDM7JN9zWUUwnIfiOVraeUAIYLwUWqgA6vXTyb5ptuPTu8Pkla92b4gWxyTE8otFgxNtnohAoUdzf72lGXZ28EogGgyP5PT6NnuKr0v8D9nL89MMUsl8hfif5VIYNqHrz5nBY1qhmg4a9dcyoai1k8EViBKaitdEEXZfQqzswrqo44YBfovzmFJQq5PtpGDDOrGlFFSfI9lLEwwIv2eBHaIiBkwjW8ldOKUtgsOQon64pZrRNDdUy5s%2BRrHroDrpXLv1cEdNGVJbAv6GVxZB4iRYfSU%2BrYLknug0oDtLGGzGyQsxeGFjDZBbgHukwhByPqhTDvTPyEmY%2FHjyCe7CAiCuwXLG87Jj8X616XjtgHdgAnIQHRDoCM749x7DTA9AjDv5Qjrh%2F5qYXY6ENVZJ1NruQ%2BGis5EsYp0Zz63Ypps1DizTkTFP%2Fmf4obsE6f6nI61wpunW%2FamilGB%2BaAgl64fXr8bNha6b8uJcIWaBu72WLEDSLklBQtCGr8B3y1dtVWr7kzzKSwJOszFHY8bOhxLIAjATRQRbue6l2A9YORlVc1JN8hE97G20gq0z3vmUIzOfMMa1hdAGOqUBgZhMN1ntJNFygwSrdZlXzId7rmh%2ByOO4CNMCzp5gEb4pzlLfVtJDzisOY0E8fBupTJDdrNwF0HRVouaAtLQVS4f2S2JD8qkC2HQhKmpFHLbp7J6r%2BLknfNKNmpicKx%2FE9L1zQJ1Hb%2FMYlyQvez1DzNYssnuofy844SnuR0ynbl1wUYUXoJngLP911Sab4NQkEi0Ip5Blsu8R8v4gLTOsZWLQH4HD&X-Amz-Signature=1f11ed9e01504eee9b93eef70ad1df165bddd4b44251392987ae18985472669d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662VZ3ZQX5%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043759Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIAcH7StqYZFyW7HjE0uj61nlXpaF3%2F8NNftWlR70XkTSAiEAuYkHTBWTctFkFE6GnyK9kfJK4F%2BgDbageZ6NNf4Sl0kq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDMkkSsr9g7VT%2BFXrfircA%2Brmdz%2BqAR1%2FpysgkPwdrtyAeV3A2ewcDRkmNRx3QuhwGrRRRIc0eM6%2FHbbJ3DiLstLOiBAyIKj0o9GoWcqoHYhaw2jofdmsGors0SuEkXiqvoMBT7nIsB4wqLLfvI%2BBvXO1%2BvpIIBLDO%2BGYQ50fc%2F9D3Vb1arFIIpROqEMNM3At22xmYEZS48ZcXKi2wi3iYQQR5diLSC7EV7Ric4KFnFK52FIeXun19QMEF44uef3x1pVAQbLuGxUaS8gIK5S3uk873ViOfLg%2FUXJsGoyWxED4YEGx04%2FlcZTymcCK%2BpbYyCq1XrMOPNT%2Fourm6vzImQ0QMuVctEg9DbixpgjdVPxxiw2ZiubYIdye4yBItL9ySFi5B9G4uE6ef6SBpQmsqdz4069xrBZ3IvS3%2FucZbXkif0FFdemzpRDyAWDYiYItk8ihLqXwDlZ1CSqjBa1V1YXHTeDPKZbdLEt9l0LTV5DZ8%2BeZgI0UFOkFyuBGJhmXQ4t8jPnUUV8m5SIimjpp3h9h1U7pSrjzzpu93IvApeVI0Ri%2F2f6t04Yh6rE6Dk5zmbjKAKieIL2suzXv1H%2F4s4NKu%2FRspmmqaiVFfdbrF7fS2g9u3xvMVViD8AxNBoSWvhNynIoCG03DtLueMKG2hdAGOqUBHFkCEKgKQI6Sp5B2WkauN9ZWAL%2FXfUoMCjpWs0fKEB3FYhQXaQsrQutPWb7h%2FUEtvLPsDEysbC9LCsYE%2BpOzHOBp9q5LB0xk6ptbc4wAYLv5EAx9n3eKJteD9HCp%2FifP6qNr8hjd%2FQAheVo4ZbmeHu%2Fj3L60f14R4HeWqwrEDJT8BOs3lV77gD06aLt1CWAzSVmB5OwxG0M8qxEzzVj4w9nB6%2FPd&X-Amz-Signature=a45b6dd049b844d60f61a018e85bd52820121cb407417a3be4d48a6c0eabb833&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XFUA6G5N%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043801Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCIHbhoJ7sR8wgQ8t%2BtRk79giE7Vq95mxeFoTIMcgUlxi4AiAuUo9sm87rFZ4NgoEz%2FRaIW6tin8i3T5gp9lnhh0M5zSr%2FAwgOEAAaDDYzNzQyMzE4MzgwNSIM1iStuyOhdRqlTYlPKtwDSSYHzkzeyGljy7SSOT3x%2BN4j0nF636hleSeQQlZoq%2Fu6udiSkgiR6mQVbRJ%2BWbNmX4z3K2cQN3Y381l9M7tntSEyWLo49KvG1j3WTLq2PfOkbu0RpEbf6JbERY%2F2Zks%2FVz0oNefSzXO1m8LOXM1mHY%2Fytuy1UK6UJXUaFY3P6SJ6TMSbgT1di1BFilpQ91v0lFvbTwpFe2AzsqzCgPK2bWzUJY48J16jTuVOFdFrYNs5sNxzsvck0JZniY%2BAgt21vFCztLts%2FgEQdu3Fcx64w461M4DmQOsPQHhr7apNz%2F1HOgq3z0bW5kNCvgZuRlwSW4o1myc%2BxTRnLWQrDnI6UBGgIII5TklXYs6sM5rKzMEDTEI%2BVrXMOoXbhU7SvEN1hsVhGKwjhLX9h9ZvM%2BIWc02rlJmJQWPhEK7BLV9MbjaraFa6R8QdlcaLkIdiAc0FkjYp5Ly%2B5A8mnKrKcvE0Mgio6qrJ%2B7a757Dw8%2BuxvFHxJcYU13fTFb8mLwRB0jEyWAxlz4HHneFBlntw2UnItTD88sqOKYzbmrIPIg0gj%2F8gOt4J2Xf6%2F5EOp66C%2BpHAy48khPIiZI61yZf6u9i7xXWLRO1w2DHdQhs8j7f4hRXPSFMj6RD%2FdjHz6m0wsreF0AY6pgGahKnEZ8pbldrRlkCbFdbjVTCgFgY2Nb8JEB5qrw8rizMUBsbHhcsIYQYQetyl%2BI9iL8UoQVRzqZmiHeHghDAhQBSRvF%2FA7NW0ae1hvH54V1MJvY7ZijJX3QicJRH4pr1eRIiWeFZl%2Bw3Lr0UYRdu9QXHSad7t8Kf4Yr3UPN3E6mJXkKgKxpMsSyr13jIhB76r9Dqqp%2FkosxRwSezgwUVDSvad%2BGx0&X-Amz-Signature=f79f6c904e9674fbbbedd4d08b945d01d3cf2ffef9ea714d415257c02d223d93&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PMGFPGN%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043802Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIQChRIlPqaAfx61Tjs9DO0WyrkuEPHba6DAKZgLi1UCzYgIgLOX%2FSKiNFxiLkO%2FOeLD60CqCQdGjI7xnaYhtA1VvU5Uq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDPcyt%2BpRz6Zw40eSdyrcAyoAK2%2FJydZtgMK1isqFgnh3PqCHhD3k0rAm%2FsE7O82inZoCvo2pWEPgT7Kz37feoy3NItfxd98k9fONFsE6n%2BshMA5MPdvT8%2B6YHWbgi1NPjzLo%2FvN0FeqE0LP%2BIgIUa3QfNIjGFQSKPBI9hUldjT1SiPJIRvN3%2BUtPR42xICPG0UvOkezcaJXXxE30CJWKuzUE1W%2B23AHJeAtWiJBNCPkaEJzeKtsDk5TDx0QAP6e0hL0YBJKol9Z0V%2BIjEg1mpxu%2FtfFKIFZ9QtMghjPqlgg%2FiKqNelGVI37UJja3ZFQsMt3zfVdznqhLb9Nmo8EMiG5Ht90eQsKQM9wuEKNi0JY0%2BCJy9ov1WWfIv2QHiUmBar%2FcV%2FezBSD8unEBnWOmDpoiJkw18odjRbYGuKjLEM2pEc%2Bs2iGjhHE94uEhH1067fLV%2Bv1T4hR2D%2B1hVV0V38D79TrXGWopj%2Fo4O5CjJj36puvOqqc6yb99Hdi14Wik0DvzVMZvYo%2F5gJvJ00PVguiBLUFNCLx3nnF4uVvHIhnKvCWfUcgjRpcLGcqqoWSul2AFp05i8tLRzN4Ylfb2SgoCAfFLFU7wv567MQQLMG47EbUZPvQd8Kt5JBeCIoP1UtScXkODwlaNtXwvMNi1hdAGOqUBf3MYO8T2A89yCaGIzhIbeFtF%2B4T5uPSpr6OTyYCvFP4QU30GR937gWH17O3PZh56D%2BqGfukQYntVhUc2LfuXp33XRFvwjhhtIiup8DXLpkM9OPKjI7%2FC9hAKSIuWW7WZHURmVUbWmkFvvjv9hfPSnhAlA84hVDe5WY9W8fg4SfesyjuXLhgF8QTS8ZRXc2vI2Wjx%2F6tGi8t%2B2pLyNd6DuDgZYI69&X-Amz-Signature=043c531c6059533425f4cf83b90e3f5ac1adbe7e7cebf7a919ef32ad662ee15a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IE3RI5D%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043802Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJIMEYCIQC0i4lZsn0BYpoZiC%2BRMq5fkLmuxSEVGzDCJy4iNfpn%2FAIhAIClSTPgVspKaZVI%2F2%2BQFSl9eXLx7IUMj2QmsmyOmfGkKv8DCA4QABoMNjM3NDIzMTgzODA1IgwdxdJLnVZg2Q2xENoq3AP9X8XwvHVxDRSTf7aMfEFp5dHoe8OgQlvKLUHzI3SnwwCxuwvNTi77Ph%2BzSqN79zzjaTK3RUfIJ%2FBG3SOcjZR%2B7RvZ64b%2BK10L3QQHCpU4Extde5UOYMKGeyspXBazSNXP7Ieyqbhw%2Fk4FuXZOCroPXp%2BtE1Wp%2FlXWMbq%2FH4RULLUC7ZUe%2Bm0m5afAmjbSQbN00Ig%2B7Zpuo3jcblRTm11JKfyZ4iT06ZtIvkpRo%2BAc583BYfF3H9dWIL4M%2F%2FKo2IYWjPNJi1vzsQgh8dfa2U%2BZeZR1n1jkNagSY4ozPHtovf7GjniHOaodwrjhFBywaoOl3CY8V9a4Ft6Sw9Sz%2Fd71x8KnZBbU7ctb%2BEU7OYgDOC1tl%2BF%2FkMRlW0BsyLN3GvZnkGndTlD%2Bfpm%2FPN0%2FWOyO39Nq8M0d%2F1t3VIpMcWYPrVhfpAQKzXpCWIND1yZW6w4VqGTl%2BWzmccLENf66xhmZ4fjXBKMTe0%2B7vAUqhbB4BTVg%2FTNGrxIZzOmFrQ4xFzNci1vrFkH1BSrGAmMh8WbeRTghGaGsC%2Bp3J%2FfijB%2BUxgZZFgG7zCGwQAUbveraXvzPr3cOKuBCwdmUZ%2F67gCWwCen5%2Fkbd1HwrA68fLVhqEcnp1bzK%2BD6GO5qMCjD%2Ft4XQBjqkARUEAIJeQ%2B3Gk0R8awiy5HGba7Zq9LsABx5P4TfVXIUoZzvnM1VrPvOL%2BcEMU2Xk7r0jwcqC4q3NQqzJOBAjjpkBo1pRjkpRLnjQSB8ChrcP8sSacgk76xztXkbkVExhJmmATIopiG1lXGHXOP549wvohvnff6wYe6%2FJLw4lZOUZco073vGMC9s866K%2BswEsFI8ftg01FOuLhsuP6p%2BLdg60zcX0&X-Amz-Signature=c1f1e5a0d80dd29732f5ced62bb00d04ac062eabd7e2204b27cb23f8205ea347&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666D2CVR2V%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043803Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIQCpv3qaJSIUbK1sMtcnHsxcG8pFCIBSHMwjWdRGSrDl9AIgDjk7s8RC9XdmBo3lcjbwW%2Fz75gEgnvHY5xY1%2FEA0JXYq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDIGKrLnxqux8PA1CICrcA6AsrQu9sNhx9ADOiY%2FlemSJ1VZ2W3wS%2BGIwkKZttfut19w1A49ocOhxPvCxKy5B70FgAwJJpws44MdkXxw3GOkJP%2FrZ2heD5OmczHD5V8D4FzznCl3%2BVFVqwhJjsSA6wXUcTp7NvOr71yKJamlZIs3ftZ9vcnQ%2B3U1scnf1IIIsR9rqVCQ3nnOsWYGK0hxCBg4dxtgDNvCkDoulmellKfMAx78pRj0gPPgcAQv2KDv2dcp2y92D8wf%2F5gfSTc7zvt8BzKWL2CDpt44xlFvgZ9Dz1fB%2B18Fj6FYT7AvB6uvUh4rlvCX%2FO%2BhDeXOIT%2FNXdMtN8RToxTDO3uftrV124bMt%2FyBMOEU%2FvpA%2FGnxrVtXnXw1Q4GCsLc%2BF0AOA3VPfuAfEqF3xbh0NHqZkOiVapCKx4FXNkEZfo3OPJ2%2FCflJ%2FWFje70swYSFUuQXLOvWfRvjuF2O2Nqrri2DG0Xe%2BKYrkACUTnRL5vZV2QUqC%2FwAvAiITRwleUwhTmV5CBymi%2F0hAu7q%2BJRnHaLA1gLS43%2Bg19PKx8dBpvpiq%2Bg%2FJXreKWDEnyQGnpS2xCgUFhO3qVFXyd316B3Tf4JwEHhbguXbh%2F8JyFwbvHG%2FKju%2BIiFi%2B0PNqJpMOGaA1Rb9dMO22hdAGOqUB2dBBQ%2BRtLAoYClCItSO3vLqCWr7gzUjltyNewCFuyKLCtLeO1VuDigBuxx3aLhQqr5Fx8ZgOxMzekmC0onxHdNKbsrw8DCfmg8%2FSLweB3bJEFrsuNexCOLZAixUcxat2Jl7I5nZslmwuhlNiZjLFkyC5VMryppalrOk9Zq6te78WY4yDNRFR91p5wcyTR8yiMDLekbia9bGnHSXmZ5oUUMfOniJO&X-Amz-Signature=45ac200359031ab45909c640e928fba5d21b1f229e056b19f73634682a0ae26b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PRBS4QW%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043748Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIAapym6er8Zpdbo5wNcs30EJgquBHoqdfUaJmkjjfQ%2FBAiEAjFYPrnq6mcxQr92DcNnkQb2KLMyluzWovxXWI72YXDEq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDC0sM5Hg1FViPWA%2BrircAzbjeVRw%2F%2BxN8ZM2QYSN6oQiXTd6DiX3VmMGiEFhU62y5VkuehhLDbDlmDM7JN9zWUUwnIfiOVraeUAIYLwUWqgA6vXTyb5ptuPTu8Pkla92b4gWxyTE8otFgxNtnohAoUdzf72lGXZ28EogGgyP5PT6NnuKr0v8D9nL89MMUsl8hfif5VIYNqHrz5nBY1qhmg4a9dcyoai1k8EViBKaitdEEXZfQqzswrqo44YBfovzmFJQq5PtpGDDOrGlFFSfI9lLEwwIv2eBHaIiBkwjW8ldOKUtgsOQon64pZrRNDdUy5s%2BRrHroDrpXLv1cEdNGVJbAv6GVxZB4iRYfSU%2BrYLknug0oDtLGGzGyQsxeGFjDZBbgHukwhByPqhTDvTPyEmY%2FHjyCe7CAiCuwXLG87Jj8X616XjtgHdgAnIQHRDoCM749x7DTA9AjDv5Qjrh%2F5qYXY6ENVZJ1NruQ%2BGis5EsYp0Zz63Ypps1DizTkTFP%2Fmf4obsE6f6nI61wpunW%2FamilGB%2BaAgl64fXr8bNha6b8uJcIWaBu72WLEDSLklBQtCGr8B3y1dtVWr7kzzKSwJOszFHY8bOhxLIAjATRQRbue6l2A9YORlVc1JN8hE97G20gq0z3vmUIzOfMMa1hdAGOqUBgZhMN1ntJNFygwSrdZlXzId7rmh%2ByOO4CNMCzp5gEb4pzlLfVtJDzisOY0E8fBupTJDdrNwF0HRVouaAtLQVS4f2S2JD8qkC2HQhKmpFHLbp7J6r%2BLknfNKNmpicKx%2FE9L1zQJ1Hb%2FMYlyQvez1DzNYssnuofy844SnuR0ynbl1wUYUXoJngLP911Sab4NQkEi0Ip5Blsu8R8v4gLTOsZWLQH4HD&X-Amz-Signature=5a2a0b7cdd48fb0b2e7c05804b71020fea314db7155fa7d8f930220c7aeeeb6c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
