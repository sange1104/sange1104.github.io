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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WAX2RK22%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034736Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQCPcE2koZdiANSPPgP%2FJi5P3GhXwFHshuE77SDFlVdGKgIgG78EknAn8lyAtRWeWF%2BHYpNPCfURF8bHF8aVm6F2lioq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDEA6lM7Q%2Fi4rsSVZ8yrcA7ZuKZz633JkdqhZ8N%2BeeyUtxNeLKXEbgUFXkG2deDTP87ccdXvrQoz4cVcZbG5Gf7fx5NhDU4CykwO6MdV1dJ%2FXa4xaiALhapW%2FnKmW%2BPHUUddo%2BWkVMbetKYWRVi%2BUPFheSyaEIUaGVT3OIwKM0ZLE6RVnfhRZJdxDGk4V1Oy3NzDQ05TNTQjAfsuDZ2Set7L4kE73foLfMkfaEhOrgl8gf2kAtSFhCbanr5awDIJ3FKMEFQ%2B4p1tDUym%2FbL9DWRYeWnukGjAHWcBCtBWGgmH9308LR%2FhUIVKQ8py3tDPVmRq3J1x2L7gAVrdkZlPP5008MA7rjL4tq4wKWPBwA7UmxOX3li7q1ddN9bnE2V6jTLtQotqLEYx4ulZFqnfWunkwS0t2Y3w%2FY2IxH2IcNmrNRE19thNZw4H2bdJJFcxZUxDdU6ROxO%2FknVvCne09oiiOlf61Z2uPphi6IP9EuZymKvi8%2BT%2B0pNljJ74Nk5Gmm8towJX6LDKnkckcCF1jd38kB%2BmXgjE4WBqkFqTT%2BOri0Jpej7uv2eJw%2Bm%2FdGXeBaVWAk7a0wg5QHQN6YHTrIHLx7cK7keUerHsn90UO2g5jdktngMCZ1%2FiIsRlQ8TnNpKdUlZXLd76kqGZoMN3Vm88GOqUBbggLcLhOF0GnOohm5T%2BMoIepixcUpLvPv2S4xc3GAUxq3On7UtaTFP%2B3CamP9pmPuxOfhSo2E8hv%2BHXVJmxhhtt4rOSiG1hln%2B7HMScV3hWChuwEaOPXVlmVyJSZWz7nYZyYBW7u1%2F30cXAGgNzeZeJ36PCLYsEk5WWsDH6DreKne7eCPshk4yrMPE%2FOZbYl0evIbkRCWp31wYbDRhFpTHVKOKsu&X-Amz-Signature=c1daf223bf4cb76e28a9dfb3da8de26d3c2fe65b5ddddbe8d27fa65cf5a2ce49&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46634I2IFLQ%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034737Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQC2BzyhHONdnSubcZanAQ3qS51kMEVxDw4DbVeMmPYOnwIgX5OekDH43MsbPIJSbha2XcKAlVrLQ9iRydKkEbkp9mMq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDP3MVG3Cc9SC66z1QCrcAz4HzOjhyEObh7o0YsYRaINaq5ScraXUqiXJmzkzoUVh5lMEQf5IedtD%2BnB4GBaUb22R32qAZhvCBOWDMqhhFKwzAkejiZeuG05spfIwWZ8IsiMoCIbkqDHTJSy4ansmhLvwXjHt4iWzU304qQpp0E%2BtwtU1Tem%2BHJPAu7%2BV4eZA3p0Gv%2BshJKU0GcNa1RoLFM%2FvSUaJz8Wn0aV5ehI2HOGj6UDBtW9c7uiVmakr342Dub6AsX5FVs1bZ03%2B64T0dHNDAwqR5PvV8wn19q80S6DYX8CnVgawv2rJckCQWUGhWenpzCyw1cWqxWWQgb0iDFgJF6xhshNFe%2FpCJAGiDCpt086FaUKEXQuNPYc0BdJ7DhN8BCBozo68z4YFv2lfBlR%2Bu%2BW2bgeOn16nroHQF%2FUbYkKZcVj1z7fSCzXPuI7V%2BSMdpNAYUmhY4wfPXJrqaBYkUC0S5DeXfdc0Pk56vp5umglTB34c5i1n%2FpPjBJfHM3SEc7IapRuTbxvynTgFQWhHP%2F1DH7R0OKu40UbvrUydCSKNmG9HNDZ9bWY8ifPs2ApH7MH%2BVEzoLe38o1ZT2MAqx1AgFE9XEs%2BEPVB%2FGEpluEaDsAvvOnKiv1B4qz5rVL4YW9TOmbSmE6vHMI7Xm88GOqUBVS0kkgufGJRqO%2F6gYhsiukm0V68OrcALxnCI4%2F7vvchRbx8QpPPnWdWG6%2FQ6ivyFBn4%2B%2FHhqopasbQkn0mN4xahXQTxVn14J3lJ4M%2FUfQY6fRs8VvNLOocUQTQIVjJY8aPKWhgHjkoc85YYSAPWqwcMeLbnOI59a9xv4B79revnHNbSOaM68LAL%2B%2FKkqIFyA7ORbPw8x808fxEFJLu%2B6ME7FtsFk&X-Amz-Signature=532af7eb9aab9b356af0cf12d4349d5708da2bd6b3f9dc98c0374f55bcd07f1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662L2NH6XG%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034731Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQCEJ0J7sQXi9uKTj3aoWY2hNRw%2FfjtAv7lcvqf60121agIgPwyCmg%2BZu54Djb1%2Fyu%2BpcOjKVg%2FyHc0icTimLtV38wIq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDAKGUTqR2NNxa7ZclircA29TPmqrYdxqlZ93k2o9LpY9OA6L7aG2qc0B4hyLYeMbeCquyxd0RaJq0R7pTIz5%2FKoqXyShd2b%2BLYrOzCPKuw5Jm%2B1NIS%2BkakaqJTKDxwXDiMFGEdJjo%2Bhieu%2Bd77qDX9XJdbFH3QKzG8nAFjaTUJBK1%2Bx%2BYcathkKz%2F1nqdn6OLbmBXGdkHhZpDCnwBaT2s1l3w5hbcV3ulXLIUWvCkUXv4T0PsGRAxOq2kIzyhHWQP303HPcNrI%2BOg0oaaLlzZG6dylGolbasJ0XYq%2FH0G0Wmkx6W2dMJMtm0bXpTZMAPdrqW0391mUqZ6JDx1%2F9BD7Hfv1VZTgRnwQY%2BZZZz8ZX1fEu0jLwpDOPlPNVwwZiYA%2F845j43O6rHIpFCb4lztkt3zueMhlrM6G0osLiliXegwHugQtat%2FUcxcKitllWQNhi6A7dWPWP%2BqbHM2lTPfudh6w0Z9eEzFdY2OGtciBEWy55D0W2cGVqPSner%2Fg4MUu5lJqjhBbjDGhb4GISs4rvffcv21jvpIsAbgFnHea6zbAqWdtSrZBK0KT1%2BztF6XNtbxrmMREUVzL9kHVoJ9uFO%2BMXGF7kU8jPOalpH5gb2zqq0MZyxe4%2F2tCYMgYvYM00YNrlOISa5uN9eMIzUm88GOqUB8UxzXvHj1Hk%2FtbzYX%2FrhnG%2BXFr7lrU7BP4a8Ls0sUHm6zjlVlWHPTqKvGIjBwEHaRMQvA%2F9nP3j1zyvE%2FUjw2wsl%2BtcxtFVAGB9QgIUEyw7vIr9lyvDH8vvlU7T2aF3876zr%2B8hi7oxFMc0%2FpCS81tUWxlZp73U%2FXUL4nOBrPIRhXMNVTFen2dw1PokUvYPZrc0ABVfDqe9Quy0ZlB5%2FtpS2QfY6&X-Amz-Signature=3bde3a839a8ecec343e65d695a44f7cf82170d8811d8b94330bae53de5db39c8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662L2NH6XG%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034731Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQCEJ0J7sQXi9uKTj3aoWY2hNRw%2FfjtAv7lcvqf60121agIgPwyCmg%2BZu54Djb1%2Fyu%2BpcOjKVg%2FyHc0icTimLtV38wIq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDAKGUTqR2NNxa7ZclircA29TPmqrYdxqlZ93k2o9LpY9OA6L7aG2qc0B4hyLYeMbeCquyxd0RaJq0R7pTIz5%2FKoqXyShd2b%2BLYrOzCPKuw5Jm%2B1NIS%2BkakaqJTKDxwXDiMFGEdJjo%2Bhieu%2Bd77qDX9XJdbFH3QKzG8nAFjaTUJBK1%2Bx%2BYcathkKz%2F1nqdn6OLbmBXGdkHhZpDCnwBaT2s1l3w5hbcV3ulXLIUWvCkUXv4T0PsGRAxOq2kIzyhHWQP303HPcNrI%2BOg0oaaLlzZG6dylGolbasJ0XYq%2FH0G0Wmkx6W2dMJMtm0bXpTZMAPdrqW0391mUqZ6JDx1%2F9BD7Hfv1VZTgRnwQY%2BZZZz8ZX1fEu0jLwpDOPlPNVwwZiYA%2F845j43O6rHIpFCb4lztkt3zueMhlrM6G0osLiliXegwHugQtat%2FUcxcKitllWQNhi6A7dWPWP%2BqbHM2lTPfudh6w0Z9eEzFdY2OGtciBEWy55D0W2cGVqPSner%2Fg4MUu5lJqjhBbjDGhb4GISs4rvffcv21jvpIsAbgFnHea6zbAqWdtSrZBK0KT1%2BztF6XNtbxrmMREUVzL9kHVoJ9uFO%2BMXGF7kU8jPOalpH5gb2zqq0MZyxe4%2F2tCYMgYvYM00YNrlOISa5uN9eMIzUm88GOqUB8UxzXvHj1Hk%2FtbzYX%2FrhnG%2BXFr7lrU7BP4a8Ls0sUHm6zjlVlWHPTqKvGIjBwEHaRMQvA%2F9nP3j1zyvE%2FUjw2wsl%2BtcxtFVAGB9QgIUEyw7vIr9lyvDH8vvlU7T2aF3876zr%2B8hi7oxFMc0%2FpCS81tUWxlZp73U%2FXUL4nOBrPIRhXMNVTFen2dw1PokUvYPZrc0ABVfDqe9Quy0ZlB5%2FtpS2QfY6&X-Amz-Signature=3f8dce6243651442e2ff0b4338954f647c9e0293781506c9918b0a9006793f6a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZMATL6IP%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034743Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJIMEYCIQCBgL9o15EClwwcYx8vgdaO4GZXSegBSscof2G65%2Bz2owIhALyouI2l9lYXHB0TYCdftioPAjLCL6PH6cZ8%2FlmNwIeuKv8DCCwQABoMNjM3NDIzMTgzODA1Igw5po0rMtFgfrAcR5Aq3APCqdf2gXMyBpK0vZcYct63OMJnu2vgQ%2F3w7n6VTLR7lfYP9%2FdbEfpJRqfWEuQ%2FeBj7tT61LMB93YVL2ShWHpjACt7Ov4Jpstd653m2pLCmVF73aXZB66o5wjxCKDuikrCkhbhwJsjxjS65FRMMO4MQ2D1Q2soZ4SukKhEujTuJp2nXWYdRctHGCBJZIMmgfIQc%2BP1K5ddsy8i%2BkAV%2FY1vLgQMmxMif1QILqFF1MBm1MRt7UxtfAdC9zxvBEdwDU46MlNRAdT6%2F%2FqfSH6si4OoGgH1UhNEoWzSE%2FJL%2FNy6XRl7p%2Br9N1%2FYXY%2FCdM03heZRymCqIyzazHYS8yBYriQ0JvNHhivF3S8pjNV%2FL8kK8n1sHAkbwse%2F8SFOc2It52SLYoOxZ38vA5AnhPCusAzy1ohZBf0Y40YmuQyy%2BSo46bYHXCadKxP1cHHfXE3JBb8OJuaKRCAfr9MybtTp5rU%2Bj59zfbk1HQr7Dk281bUqp%2B3pNbxg1ceOTwf7bs%2F6v%2BiLVYNyCRF6Xb%2BiScUMob6PqepvshcFWNcbJF%2B3tCSQtr8OXZrLFJazt9hxLaG3f3ScZ1TaeA%2FDQ0xjU5qmb%2FTqiGupDBDIQe12tbWA%2B6TGFhjqJnZNk2pgUQOYivzD205vPBjqkAeXoc2%2BjRPkowii37slRTECsEDR2XYjke5bJ3MWEJVINZmDmecuANIOgzfM4ClVl73D%2Fe10UI%2FIonfCGdOfshUBrURlfqQMlqYkgA1xsPUpXiHo%2FGhKcDBRZq2N9DGa8jyf%2BnLrFwBYCz5bNyBaV%2Fgq61l%2B9BKq%2B2Di1I%2BNzGh7kQb0umHRRTipOjpIr6LVtxplHzR3X%2FlVdZr4B6jU0ahROetTT&X-Amz-Signature=bc236d77cd29cae83395b42c99f33da53f77c6e6a0bbea2a710d7388e64145cd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VDLFJ33H%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034745Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQCLiR9J5zVH3qIQpTjJFdRuBS5Gs6j%2FQwzA%2Fv8yufmDQAIgQ3LppX0a8Hc2xUqHsGuQ%2FPDV%2FVpJ%2FbwO6N7m8QeT3Vsq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDC2dkQffhA2UOEB1EyrcAyBYZRRao0N4WBIuEFidxjUW0inRly7JTxf0oH%2B9Rr51VmKoxKWQi%2Bg5L%2B6ZV1yqqzsgU2cCfooic%2BwTs3gkQ1V%2BKmP5LNdlvNTd%2FPSZAnne%2F0fjbnh284gliJfwWvhiviNbsMcLmY8KxJuK3afftvvGtlfyQGOutDMgcc4sMHC4fCo9gZDfZfgKDfzkQ9VZqbAPYsmvErJWGnEz0WFVEpHkydTWRNb28AUvP6Rl5v37CSAxHPlMnDfo9m8%2FflR%2BZmo0D0Id%2F8tlpWuj32aRBL1mgHAv4FVjCYHqE8J1thaADQGfwhemK7s2Kn5sZOBJDbzGMHu%2Bg4HNaL8%2BX5oXBXYvzq3Mrdg6V77GCY4x1loCen4gzbS6FkYQAewtW89NcIc1cr%2FF8ZhD%2BylFbJ6icy%2Bs9dfxr8LBw03k%2BuNhIOijqGTaLTgx1NhCcDWpG136WU6CDT0fCPEBbTXNUw7kf0T94nsBhqEAuO8%2BzlMYVlL6ss%2BkYRCY9ZM9zGhtK6ntBY4n4l1OewjNmaeITrMPZYF56FW6aVWiJYVaH2LOAoZ9o5FaVAYMRxGw97kc6zafwI%2Bk%2BkxWWAP5%2FQnC1MVGqk%2Bq4in04cnE7uUf049B28WiNBiPwOSvbAAM62aQMLDUm88GOqUBo9V35GllYztu3WMEe6TUHdNPkls6vW0LeAUqXEU7wWOxw3orkqJ%2Btl%2Fe982BbEJ0ijLiVdErE%2BzgfjpjIruB%2FmdIPQi3HWSGxnDe8vdZTIBmWNIMcNhPLp6lWqDQ0jHMY5bp05dfD95C0E9JAhJg%2FGbxB9%2BZWpnoRlDF1hrVRaCcRxQGvaLILYXuhZNsn6CUqZhkPea10fNgngmXMrtJ6S%2FsZEW5&X-Amz-Signature=0eb8362f2bda4d2cf878bff8803ba18478c0969d80d56749d237ea980e019745&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666X3M3Y3F%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034745Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJIMEYCIQC7jeTLNw6mhN12KLSHe4DOJIWe9CUapcXukflBDoaefwIhAMd9o6W1WzZFijiwzfPF0jn1EJYL8CBs3we84IZ8l%2BX6Kv8DCCwQABoMNjM3NDIzMTgzODA1IgyaZwg3zhONCh7WU6Iq3ANevWWOkkaxsRarRw9qHwnJnkJrAmMlkg3UFUSkIY4WKbtQAWg2IB74RzaywMpws3DEZKhHulKi1%2B3TUX4jZ6UXzUfGVATDppHD8GYSRyCBqlb3x6%2F%2FdQfoz%2B7UJ9y0%2Bs%2BmMXIE6X3qOgJOhHMelC4G2m27TZbA4203RmU01S1Joznbosy7UioBEPQS6%2FZ36wCrTJxNFpZ6fNBsbs9QRYoLyGCGWlge0CDMqIxeoZAC8U%2BDH4EUlAtVCJYR0BCFeL8ZM1EyEJ5Jf6CQyleo%2F4I7KZa%2BjjwLucBSUCW%2FrTByged7Gr3alrr4C8E%2FVXRn3RXhgFyfM5G0Vk%2F%2B0Amd3kNQgW1yON9A50NnxljsZBGdIuFO64gfHbvg4LEWNr3DscTzsXc9J8CfKhAEKZOdEpza53jzgAXvl40feYDN77Emu%2B1eyC41bJF9AW2OgaTbtgH61Ece%2BJmDji8DAZUhrOmNVsfPX5nFfuXAzbVJvo7raxRR2%2B%2FPLREQqF6V9%2FkoeqBdL5eK8bFRB1TUrbvKLqF1SFAKiFkdgIK6RruMXQJvP2AK%2FbTD9%2FGQ8kOzV8T8%2Fsg6nzQHoiKYKhCj3ClWOL%2Fu4GviKY5vZLKCsHMcHB9eFDht5GcjRc6b0eYX8DC31pvPBjqkAcmPkCAJYGuGtlYEGgrq44WH%2FeJN6Q%2FehsGLOc9p3KsjWUDfAye%2F6RU0JgvVPqVmYCOpmtNTe7fQ7IXQeMbWQrmyR7%2BEpofvx04bFUcXkaqZxUguyi8Ukp7iQEaIqUr5mdO0pbvtxpSswF9MgEszYm2bJ%2Be9w6NJFDQ6pFFqBFQRCTLRAIci1kOIBXYhowDD4lw3DhnlETbpQgEf4jXdQWmOMJiS&X-Amz-Signature=487225f16cf274e08ab190ce0a20349bbc1963000f542a51e813c6a60a59c6b6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QZ72CPXI%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034745Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCICppl5tp5m%2FwPB%2BMQ%2F7Epk47OM7yGnNltPBXyNlhrZG4AiEA6ZkHUR%2B9jDLi%2BVYe2I4p6gRMRPETQKAK8Ysmznskc8gq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDKs1GIrd4ZRec2lfJSrcA5kvhIrKI650UqwYEJBGSVqURXnyid36UKTEzuWpTTg7T4%2BwQJaE6a7TxfANfScdr%2B85ZTHvUt%2FfZ19t4WtXDsmtE7oSps%2FIg2OCc0tq545D1dcWPtCmfoe2tvmwrtbVkDftDsjL270HK%2Fkl3YeMsAS86cWmXpwjqBpPm6XQx96UgXDdh1Gml2lp284XCOVFTjXUrBkI3spOVs6tTs437cDdNrZFY0FiTEMycG8rgpjeD41DPzZoaixeDPQMKZDxB4AF4t%2BmmTnvype8DKx%2BQRl57T2hEdQyG79Bxu4N%2BFcpNq0rSCKMbNwUI1PpRNZpRwWD1ESjm656IkKvc5AM19is9oMOjLm4VoY9XhSJc7ZOe1VY5st49EeeLGhL4NVmxkaPjbs3XRP2y9HCBJqRS0LGKKB%2BhFfEvtUzyZlXwbByeDz3raK0Cq74FTy7f6dW5jfYrCYd8zG4bKGHpaA5tL%2F7GNIkKZOXQMnWTUAGZJisfrO%2FnnuSSYPexgknK2iSu9Ko4BOo6ufe8N2%2FnGJIVfavQb8JQUjCIlvlE1koTy8Lk1De77o7lZehlySqZUJEV8z6NS2czQidDQCtVnfQ92E3KRlktA5tyKq9DHedI98UsTUT%2F9sxRnPew%2FbFMJHXm88GOqUBa6CCJwvrp8Upz%2FZrQ3SAsYGK%2Fxr%2BLvUTgDKiBa1w2tVH2OB7eDBVMBLhbr1kjNTRB%2BogL0530UpDeOhzNJFKdUJbSo7roEaWgRkOKvYVK0s%2F2v3Ni5heGRRR%2Fu0WZghAEMSrv6Ts5thMaof54ocuWak2IjJxMzGNPjF2vJd13XXzo3zv5KRrtyiDICA4KAKcr3R%2FfTaJ%2FMkyS4ZbWI61XHQknVh5&X-Amz-Signature=c2a064bdb79b98b657263870d1b7c9ef08bf61aa215195b2090e61fa48c5a257&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q2EXSH75%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034746Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJIMEYCIQDBJi7dLFemmmjusOUHug2Sw7lfDteNuXPktqKcBy9PWQIhANUA7V9NiVLwXRp6YnyNdP9Yepi1%2F1H1xk%2BA%2FDqgp6a%2FKv8DCCwQABoMNjM3NDIzMTgzODA1Igxyy0WhmcAhdguYoiAq3APlTDB3fspMNHnw%2BExlg70sEtbeoCthx%2BDDiiNVL2iY93J73lWQzYyIxp8rOapN6FY4bzF9yIvNSpncYBIVX1rDSxTglmBNxjsoVT%2BzTVkxIyh53uWjfJUhoKBWFtPy2SuX2mnb5x9c%2FmInjg1UCxW1nQaiSRqoS82nrDCWBwJ45KiEF0jjqIytSveUZxrh6jTCCJL2rLqW5JG%2FOr%2BH4GGq5hKkVtZMZbAbDWRH2zW9ysFeIWAWS8JZI3fTK7UM6a1RnNrDiUgNd4GNZll5DYn8E2afc%2FTSTX80mAdM%2BSvfsww3EeIqDc%2Bcqu%2BRw8IoSnUXuMwpMe%2BmuyzSCFwWClKEQA2IvsEWA5ctWlN607l3cHWV2S7vic44YCz2trVSlrSwwq%2FUw%2F%2BQYHfBFqnWjF3wqmjYnipKh2HGt65kTJ%2FPOnt1VHpR%2BWwwAltCp45q8V2aCevgjDHiqGTXYXPyCvu7Ri3qAICNLaiJtMxblzw3jfA6n1U261OLEyFptuTjKX%2FbdpB2FNj23IalB%2Ft2nYWjzt53XDXqAILMIB1BKZEl5OLm3kAoqj4KK8zmHUZBFjs3bQiBAKZCHobNh7hOgECnwA371yzPQUcNB9ZsMYkUuzm8OTR6skUjHR7k5TDq05vPBjqkARkeBsmIdRZpllRXU4kbl%2FvTQfCqD9pxDDHOCAmRKtmnrjyWpXAzSmVCIXXbyn%2Bziui6Xz75%2FAkT%2FR910GwvGawa35h4AxEL90Mwkl27IIqEZtaIdpn9Gs4vZrtM%2FXPD1Wviaz5h7rxk08bnvpESjdsYXxunU0IObMLZoqlI6Rtd%2F3xu8NFL2OjMlDMoEEzUi6esLxEjOq%2FlHQ9mtfPozzHZsLc6&X-Amz-Signature=a6d1c09eb341e81cb74a53d611585a188bff292d8e506c0e82a95e1bb7114c18&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662L2NH6XG%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034731Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQCEJ0J7sQXi9uKTj3aoWY2hNRw%2FfjtAv7lcvqf60121agIgPwyCmg%2BZu54Djb1%2Fyu%2BpcOjKVg%2FyHc0icTimLtV38wIq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDAKGUTqR2NNxa7ZclircA29TPmqrYdxqlZ93k2o9LpY9OA6L7aG2qc0B4hyLYeMbeCquyxd0RaJq0R7pTIz5%2FKoqXyShd2b%2BLYrOzCPKuw5Jm%2B1NIS%2BkakaqJTKDxwXDiMFGEdJjo%2Bhieu%2Bd77qDX9XJdbFH3QKzG8nAFjaTUJBK1%2Bx%2BYcathkKz%2F1nqdn6OLbmBXGdkHhZpDCnwBaT2s1l3w5hbcV3ulXLIUWvCkUXv4T0PsGRAxOq2kIzyhHWQP303HPcNrI%2BOg0oaaLlzZG6dylGolbasJ0XYq%2FH0G0Wmkx6W2dMJMtm0bXpTZMAPdrqW0391mUqZ6JDx1%2F9BD7Hfv1VZTgRnwQY%2BZZZz8ZX1fEu0jLwpDOPlPNVwwZiYA%2F845j43O6rHIpFCb4lztkt3zueMhlrM6G0osLiliXegwHugQtat%2FUcxcKitllWQNhi6A7dWPWP%2BqbHM2lTPfudh6w0Z9eEzFdY2OGtciBEWy55D0W2cGVqPSner%2Fg4MUu5lJqjhBbjDGhb4GISs4rvffcv21jvpIsAbgFnHea6zbAqWdtSrZBK0KT1%2BztF6XNtbxrmMREUVzL9kHVoJ9uFO%2BMXGF7kU8jPOalpH5gb2zqq0MZyxe4%2F2tCYMgYvYM00YNrlOISa5uN9eMIzUm88GOqUB8UxzXvHj1Hk%2FtbzYX%2FrhnG%2BXFr7lrU7BP4a8Ls0sUHm6zjlVlWHPTqKvGIjBwEHaRMQvA%2F9nP3j1zyvE%2FUjw2wsl%2BtcxtFVAGB9QgIUEyw7vIr9lyvDH8vvlU7T2aF3876zr%2B8hi7oxFMc0%2FpCS81tUWxlZp73U%2FXUL4nOBrPIRhXMNVTFen2dw1PokUvYPZrc0ABVfDqe9Quy0ZlB5%2FtpS2QfY6&X-Amz-Signature=e9badba4523451f410fdc95b98941c0b45980c3fe2166aa0a922404cd78f06cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
