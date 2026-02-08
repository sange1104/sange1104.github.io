---
title: "Visual CoT: Advancing Multi-Modal Language Models with a Comprehensive Dataset and Benchmark for Chain-of-Thought Reasoning"
date: 2026-01-05
categories: [blog]
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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667BZUUYCQ%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033440Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEHPV8Yvj686djWeXbW0YqgFea7UNMX3SVvn830d0I3BAiAJzuiJvwkslkL9HRLxyHsx8RHgEX8Hn%2Fa2gp3SfN8h9Sr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMV7rnmnifVvBi5UVqKtwD4792jXPipZ4YptjbxA3tOER0uuBHX4r4u0TUAyv0PdYQYR6wi8bR4HhgoqRzI4QehJTaIyciDiPMfzgzMkzN4Kvb0MfglTZwqytfdjsm%2BbOPytITs5rX%2FA07jte20kN8D0igsNVM7H4u%2B0LZmgwpz8xA21AC7q2djkpmjRC7YhktzVwal0m5yieqLLIXl%2FydG22tQG72nZMPU%2BZYDj2AQJfQc6%2BnvP9ukM4KklQCPC6XWd9v3cBlkZC1VFdCeGAeZthy2l3zcBCtkMLIlB1Nsm7RInaqN7gAe97yejUKSdqhHnsbYF55hMVdPHvkzxCfGDcojA8e7hlHvebywgb0OcpNG2KuqzLXNWhsBIyzsBBQ58zmdf6YsWzV0WBOdzhb2nM77GUnkci%2FENrPEFy%2BI5qgG%2Fh0BFA0oHD4NtpioZJlqqL0WtXNHca0m5u%2BbhW9Dyvwp3nCqDpg5JpPohHF6jAZ6mCOIh42xiFsNJCfzLNeEwExcfkLB4WN4eqrbZaveHR5%2FnxFdrtfHoAFVQsXXcrNVtmJWS9KzRYO3ZOe3aEHDUSZHe7ZVNsuvYVmOBwBH1%2Fq8XMCM9d%2BQBaArXzf6kDEi6e2uhYmj4YGhoJE6%2Fo3dfv%2F%2BRHKxS1bWt4w5uqfzAY6pgHai1mNhQN5cTmVO04Ncos8LHrCuAclszte0qrxLnJ7NTaD4HYVr8mc8gxWaZ72juYRHiSpYQDyF1R095vJ6y9bPSKOhB4NiTIUBOwToj%2BqxBh1poE8CwSJJo%2FN1KbsjsuXIbSnTitrna35bmm0qRRUPIABEEnXlxOtHCFLA5%2FNTAWouTjGWjK50yR%2Be5Fg1%2BwjWn%2FVoWKU1MobbntIvrtyXzK7n%2Buf&X-Amz-Signature=ba66a9473889e86a45f543db1c8ab93bcd69b82e02485ddcdeb8113b9fde78d1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664OQQDEF5%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033440Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHg4ivACzTttn%2FfuGk35vg1CxQ6ZI3DlnZGd5Yq1EV8%2BAiAQ%2F6h162BN134kQxEBwYhfaWkLS0pYe1cWhEeVwc6BYyr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMOCMIMJ2oLSCmUaArKtwDMLe4dx7PVM6ibMD2trTLh52HGXnlYjWHJVs%2Fz2CtR%2FoUzAOB%2BgeNG5%2BkhRPT2QoVwyVc3eeruZ6kIDOl7maU7HyhuQ7O%2B%2BQEWFnZv67%2BdQYhBNJV7eSzpLxyrvlDY80YokNROydcmxykrpoHkT%2FciVn8uzOf1%2FPYzeJmNRauYqbEizODtXaF7SZYLm7ULj1K4vWbtIyeLgJhZgdtyP34qm6WUhtMhNqHMjxBYSIpOxb%2FGwLdcCL2ew2%2F5JSkTkPPMaKwWWNeEFhZevfBMlFLEszPckdB%2BWjHDcvohNRYcOa9D0MGCRUciJ%2FOg1p1o5CMVmvEputKfX46W%2FbRhPqLh3fOMadmJNPsO%2Fgjb6PQ4pyd5k1F0JkmufBL5AOAPDc2Zj2RSvitfbkiDGFYmGvsyDlIRlMnO5TdsXGMKXir9kagFXJLsSeSkybNMfJ8l9qrcZvdv6C902wD%2FkXl98U1e6qpCISTOKDWqLKDShTqrYBunQisTFv2hwSlt%2BZFEIZtUuKLA4TRtrqtkaBZaGgZsRbCdr6fhKRqgU2i6sdeTuRnhRJqsMliLnlaug%2FGpHChdIu%2BPT5wL4sIJwrc8dVBbKfMH%2BIOangf7Ftbic9ICS6pUu8q9V5zT2q7p4AwjuqfzAY6pgHtfWFfX6OdR7G4%2FUQRul6ILyfZOnYeyycI0%2FprtZNjy6zOhwgL6f8ft1JKvIiq%2BDDjNYNgmZxtDsagf5IUmozhN5DXzH6o8pnJNHl4x2igynBWYI3HCAJ9hIWJUmaR0MPzqUAQIMfKBj8dA0Q%2BkxLbEzhMETFRrbtRlTu2OaYERY1rnOjV9atArAKuiySvcjus7jSX71vVZuwtiIhctdMoiuZtNSGL&X-Amz-Signature=a155c63467bd57296d92e2ab0babbdb17e6a34dfb99b77d7278a7cd4ed6b4d10&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QCOVWO5D%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033424Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCd%2FV82Xo7p%2B4nXxRhSUtCLSwVTlyXVLylFdnFYvYRVAQIhAJA9Bf7VtHkN62gbUxTZGftQ6zv0CvMhSxSfNGUyzUGQKv8DCGwQABoMNjM3NDIzMTgzODA1IgxWxiBQ1Q0ZI1zUFMkq3ANQe2GSXcUXuIxBUDD0nRUUz%2FTi0H4ZTeFRAoEeZtPfZobXuWgnQSjdcPYnVbZMtQ%2BCuon2dtjviKCuY%2BWD9kGr0xV8QI2iSBt1DsOuwKgLUls7X6dwCs5MFTYVwKnfS8m%2Fg9HR%2FyY%2Ft7hptmHqXrhnfJXa%2F8EAD4K7qfFwxao%2B%2Bq59JWfj%2FiA7sxpfQgKqQkQQBqTNVIqo5XASVRv8wei5AiGs9jGUTWljBjRSb9xugRM3BQ%2B85OjavG3%2BIAOioEUm0lpAvsHryMnahy%2F1MAHzb%2BdJB07t7LuoI8E6AGFEcSJGeCIua%2BzZvqDKRgxvYSiowQXu3UmADOofd3RUbDyyV3Z2wvqbFhZHNVz9yGFrOgMhI6zp3bPPcoLqdaRq%2BAqyp%2BQSyTq%2FURcWQNJRKQJGsAC4gNoIKXiGkFSDLNvaKOwWFf9iBEnXrP0SIdenElu0cmC452urMUmXyxxSlBSPm%2F4HTosO4R0%2FRxzpTrVhyISGWQhLSxmc1R%2B%2Bcezf63hF0XSSlny6adMmpF249sr6kKbpXIufWwRdIrDmaMllxOmKT27qGrqh%2FPyr2vZWC95r%2FWhLZ889OaO21Peg9d%2BdmtsOqm1%2FgYpQnfIiOwenAB5KvU6XLceMlcUqDDCo65%2FMBjqkAQpS6pcYSRowC9yi%2FjwWSJQbQZ7Lx5alY5ou5jmMqqE6M3v7xbtMcaLT8DemAOcmXRVTseffM0yBDdgf%2FvKr79udNFMpsVO%2FMYsVGCSA%2FFO52FGpG5srjxNq4v8vRcVlIyzNXNw4db4KaKNt8uu8D%2F9DVUOpUBw9jWdHPDd9zMIYbNmK18MaGSqzusX5nQ38LJWWqLqRXf%2Bf4qtPixui67dmmY3V&X-Amz-Signature=f159153cd1fc1000900dac54098a456ad949d2e8a0251eab57c2b25b3909e5fd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QCOVWO5D%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033424Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCd%2FV82Xo7p%2B4nXxRhSUtCLSwVTlyXVLylFdnFYvYRVAQIhAJA9Bf7VtHkN62gbUxTZGftQ6zv0CvMhSxSfNGUyzUGQKv8DCGwQABoMNjM3NDIzMTgzODA1IgxWxiBQ1Q0ZI1zUFMkq3ANQe2GSXcUXuIxBUDD0nRUUz%2FTi0H4ZTeFRAoEeZtPfZobXuWgnQSjdcPYnVbZMtQ%2BCuon2dtjviKCuY%2BWD9kGr0xV8QI2iSBt1DsOuwKgLUls7X6dwCs5MFTYVwKnfS8m%2Fg9HR%2FyY%2Ft7hptmHqXrhnfJXa%2F8EAD4K7qfFwxao%2B%2Bq59JWfj%2FiA7sxpfQgKqQkQQBqTNVIqo5XASVRv8wei5AiGs9jGUTWljBjRSb9xugRM3BQ%2B85OjavG3%2BIAOioEUm0lpAvsHryMnahy%2F1MAHzb%2BdJB07t7LuoI8E6AGFEcSJGeCIua%2BzZvqDKRgxvYSiowQXu3UmADOofd3RUbDyyV3Z2wvqbFhZHNVz9yGFrOgMhI6zp3bPPcoLqdaRq%2BAqyp%2BQSyTq%2FURcWQNJRKQJGsAC4gNoIKXiGkFSDLNvaKOwWFf9iBEnXrP0SIdenElu0cmC452urMUmXyxxSlBSPm%2F4HTosO4R0%2FRxzpTrVhyISGWQhLSxmc1R%2B%2Bcezf63hF0XSSlny6adMmpF249sr6kKbpXIufWwRdIrDmaMllxOmKT27qGrqh%2FPyr2vZWC95r%2FWhLZ889OaO21Peg9d%2BdmtsOqm1%2FgYpQnfIiOwenAB5KvU6XLceMlcUqDDCo65%2FMBjqkAQpS6pcYSRowC9yi%2FjwWSJQbQZ7Lx5alY5ou5jmMqqE6M3v7xbtMcaLT8DemAOcmXRVTseffM0yBDdgf%2FvKr79udNFMpsVO%2FMYsVGCSA%2FFO52FGpG5srjxNq4v8vRcVlIyzNXNw4db4KaKNt8uu8D%2F9DVUOpUBw9jWdHPDd9zMIYbNmK18MaGSqzusX5nQ38LJWWqLqRXf%2Bf4qtPixui67dmmY3V&X-Amz-Signature=8e66ffa552b16bc50ac010f5934e917fbcf0753fdb5c7660edba1008fe0b08f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667V533LVH%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033451Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCID9AfrsHTbZNXpReejpghZza7frluDa97lW9pdKwXPl%2BAiEA6v5V1HJLNqDKk5YYJmp9UbZWtRnHVsER4%2BvN56scfLEq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDD%2FEBwSWnZIKe4wYPyrcAyxJXMoN6q0i%2FpUJwiiP3%2FVX9LU24qSvh7COakcW%2FcCrFE6255vsO6B1sROkN2sVtnJ7DOA3KWWOJGwrTVBrF8Vl5CDrHmYUKiVmjQoJio2RSrz9Tz3C4gprS3ofU2Hog13wIjh7UR2Tvdur9Fnc10T5SSp0E4BAJEH%2B42oZ9FmBIJFyjO0ceXHRZbxfuPESVwZcygzzgjtQN9TVLXziNNQKp3ibjLZ2NdrZ1%2F5pBTOwIQu31a96kMR5Cy6d%2FjVxzs9S6ScnqZ4Hk%2FgISxM2%2BmiEChSQ8Fff4acCXN6DjJNjdR1Vnx5GxrG8HL6A4Ve20foq1RZ3803X%2BSFLvHBTtSsu6MBgBUPxl57VH5vB7yABzbBt7dPdxzv6fHCeQhsFP6YG%2BqUIEsgplG%2Fml0%2FvuPbIx0iKm9jbtSUF0WY4YWN6o6628WQJ5WTAa81a9geCS7MEGLLrT2OgqL07qSN2RFmu0x%2BEplHBDWrSeuBbIbYc6IRxHfcmR8vaeSKn0SfHRpITLaUClAchYQu9oir95xjGhTXVR0mah9IvWqd7yb4n02zYQ2LqgheQlmHn2MJNiHdYj%2BaM%2Bf7FIFCRnbyCys4BeHF0%2FmhvSCqM9zwqA%2BC6pAatdnAAOsi8tA9mMIPrn8wGOqUB6w7S68X4tp5lNVepTDs8qlfC40NluSpRTnFht6TVT7WD3sRpGcRAiEdSEG0ymQuoYeyubdvlJ%2BMpZXgSsCWMoUZssdinbItA4flO%2FT6Y2wquovaA80raSYvBdIFLUPoqhpLZgMWTdf9vG3VjkyG7t4gnB0Edp6kC7nLT%2BX2lCY1btnp3a%2FBmQ4eyD8tU%2FOO9s48nAWddm49TYDmJ9eaA5xlXXEiL&X-Amz-Signature=901d1f2b9242d0a560ae29b1ec27be3302225ae84d31c16e7d59b5d4353eaaad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T743DC52%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033457Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBjSq9hHmqNKKN7InbuVmPbpCjP1uR80I9aqFbcu%2BYTiAiEAxR8rjD41nDIW94rEVr8bwxRE5Fef0Es9d%2BG5mhJDAngq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDFRE1q4spiOOEKIl7yrcA9p0xXZupUr9c5kYM0Wp5XrcF5wr0Vp%2BBA850IpDTQIg8Cn9VQSwPh8mb00aOOWpqUPhQ%2F5EPCQuJ5D7QC17tMdZzY3hAcda6l9ezZKunQ%2FWK%2F3vWlLi7GYAgyiy4BUlufmzFdINYNT5UBx%2BTG5v%2Bzip9R0NOM1lDkfDOvkpkis%2FaLSD6w96OhhJd19tnnD1qStJwtorJShoOCoUs3OiV%2B9gSMyuTaBNB2Xf%2BhY3MgicyVruDiAb7eqK5eqZXJHrIKeY7z4CbKsBZzk0oC8RLS6Sx39RFXipWaCnQDzfbRq28V1WIarpWBJ1E3mQXxgOJGtkcLudMC06rvE9jppIJHCuatH3o%2BoG57SNSfDOX%2FG%2F7sidto8lLOf%2FaK8I%2BR8rcc9201IDqKz9ppkz83teJUnXxxRbbS4G%2BrNbohypMpGjyN4gfwmJJqdBzrHXr1FkIPwThdmZ0EulYnXdUWep%2BFwSTJe0i%2FYkAT3Jny3UbXIm1vKYiWEaar6PTlj7T4%2Ff0%2Fr%2FJxlqQoOQ3hfe%2FyzWLNWyWLOmb6Cy%2BDnDWLrFphZhVXdpM8jCx7JZBqRTRd%2F5Udh3U6SDtq7BbDYqSvOVKTMLUxD1z%2BpT%2FmXhHEOWVyi%2BLv1xH4UlodsKTyGcMIDqn8wGOqUBhJlO6D9QSKnAZ1ewBkPE7t8Ppf10nDcVMg10X1wytWbDMuxpTNuC7wvVJaM9mv47NXsoH9ZvqUbLS0qtHb4F993lGv6XViTtF58PcrOUBwSrcumJ124PLIABWS%2Bw%2BYLPiOG9sxFwjL%2Bc3T%2FhElv7Ew7tYbmht7CQ%2BXZIRS%2Fiy71%2BeKD1A39bdOsw713rw%2BDjke5kpOFFgm6Qwg5XT9UGiymcd05W&X-Amz-Signature=3f86b206e91c3ff038f0650cb02d148e51489bed143750892f67b670b0955e9c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666UOWNF4P%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033457Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC9J3oy3%2BCGCHiHMwUiKtGQ4947otphzjKIL8TpOxRnFQIgZcUY%2Bi1y44PwpyZ8e%2BOgddK3eU6gpNPSagDhOE7MxH4q%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDJ8I6IXMK3Tyjj3t8CrcA21311UymCAJZeGWJy1Wn2jH6Se2HbSgxwPcLGly7l9d%2F4zjA2K2vAMt6dAzzNX26tmoYZV%2Bx24j9gRY0cGIIZMZGIVqLxlT1S0BEfYSxLhAq8tL3bkhx0FTzO9QMqtxsh136jrjsNZhIJwpU%2BlqIHLZH%2FRlOxf6pPdZfal9M8Pp1h8euzNFE5%2BywdqRF81jkWn0h3OqDNmyEE7gqNgMqfOHmYh61os5naOJUQzUhEzAlXFXdyNAZAx%2FEQWjmqYycWGtYYaRaiE6RpVNaExwWGW34ZRsaQWr70gIE6Bvk52PZm4sWskk1N%2BRyiun73pUk4Yc7WOWR498N5ka18FqZ1PbMbkrYv%2FS4XXIo%2BEzbbPqwq%2Fv4Kug5Lyo5oAQAWy54seWvwQv%2F2t9BW4Miw5UeBVc19pPWx34VPk0a9ZGimk2FbBwyWFvMsErd6836QFe%2BK3sgvktXRnvOTMOckM%2BgbkH2fniNPMkhjSAek4LUkanpD7vftTHrVwzxMeVXa%2B8UQvEvkAU1LLsxfjYk7sUxY0nPxgjVApdvZ1%2BZtnhOpqAS2iBV31gnGEbhMzunxRZPLPwq5z5OrV1nraeLo0Zpde7Pd3ACskDYkm%2FAF0y9drB9P%2BhdBbOpLV23XtoMNPqn8wGOqUBgLBZzrMOAA626B2CeEK5TBIGxW1mBXSc8ZZVlyPb8ZFJ8P3vu6zBZ%2BdjoZWLcV96vL%2FpqAI4HLStYDOKdiAYUj3uo9sti%2BnHgXO5NOj7dkCBbUNu%2B%2Fj88S7RarPwU43FHsG2WPNBRLag4mvSn2chHAgbNOGMh2Ds8DVIrohroyHzll8AEP2Kwj0NzdsOWrD8qIjIgigY7zyAcFkOyMXi92wNLO4H&X-Amz-Signature=cac4b1ebc7760f88c7d4ed9ef55cb808047aea2b644e8d89a862f44593730767&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665CVZJUAM%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033457Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICEkzAXkBH2hr1r1CWHCFn48lDPwdunsHOhdqxK2y2nMAiAsoNK7HznzgQkGaM7SLEgNzcDX6XXOIjIN4m2tLnsCayr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIM9ndVhXzxFEcz76OdKtwDmlcnCP9%2BhP6nhJBMMU%2Fxc4UCkR5ItBgtHtRm7XqyN4ug4oqRHfbLwLE4nJU%2FTkMjVAvHpaaR5AHd7J56oPj4WIB9ReEsZ0AyIKEhIb4gghCas2ONxEc%2FCEjD%2FELsQH7aIoJiDiCk4%2FRDE3MHsY3%2F%2FowXdQ4%2BxlLftapiHg2z5bl5tTP1ICqxdebZgOw9%2FocTiNh%2F4ewwmlAAfmVsIDyyNl9WYipHNtw8oN4IXLtQ7T53Aug%2Btprr8nfaKFMDYdKlVHhWI60bmJIT40WXFRpJAAd46Dm0F3RY00TiBSQPF8zLSlbqlA4o5UKfZuZMlaznfloJm3mLiRkgMTik0NAucEanQ8NnICZzkP8XjdbjaXHL2mjDp7j0ghTdPJrGGALhaAPFWlclRZjj3qCSINr3LcgYU%2BIEhPFPbXxgr4ugRnQhR2lJcElfb5%2BLvTscj7FYozfpJuVtdeCfeQr2BQ4EJjyq9z48ovEnnWJd78Qxq2h4sQ8D00XIt5xd8MyAtYiWVioYdwGdFdOQExslC11XLFMTviKO8%2BRZpRiMqmKCzGDak3RZyLmsCJ8NUFgESOQLsgR1tGbl34mPkmM9%2FFD%2FRrC6tejFcDZvnzNfPmbUd%2BFkE4a1bN2PGI7nhfowjOufzAY6pgEU%2BE3SsfR%2By2rKbmAJgn67QmTjNg3gL9JPDzWAX4upAEHmPro7OdsDQl0gj4ewTGkro6rXaS21Gdk3fqZRfNwXOS9uCF8h6Bk8zSRM%2BqA8OLjn82gM2G8R2xPQaLFgNLXx0uk%2FLEy6gXqWBLxUaqUOURaL1dbjk3Irepac0C6VIPfUM%2BhJvo95xVZcCJv5PZxgKfeP50SFt%2BSubsYj204nrG3xwIlz&X-Amz-Signature=5b87975d8e0f8d067dc85660f71fa2833f89b39c835acfa9d5eca6b8b1e7bb84&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XG5VDJZV%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033458Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDzfktdBTZLo5AUaZsxzjMxvNsTxZfv4VCC3F7eL%2BdmyAiAohAbFBMDQXVapJLNeoK7cp9ynPKI6wdjYVN8cBVvE1ir%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMIcuxNVwdsRZt5VtHKtwD%2BcdkEyU0Wav9Tfgr3y3uwu3PRXyIGNvu5si3EhSVC03KlEtxTJiLk%2Fq5NJuvK6hW%2Bb4nFSq94U3sfq4G7nMaME1ckPaOYPGpHYiLwNrB8uWVSdvHrGc%2BiPZdkM6tX1msbpZCR6r%2BdDyYscS%2FeJvGn%2B4rtM8IwUOpG5CF5TnSQmpFsb95SZQm56xAx25YMu1r0ktRI5Uj12AmO4IEheZYsPTAzMGoOnid3vl1tPjfX0Lsen2XdIACapZTB9IKCSS2XtNKTzKcVpBdKIf0cjnaI30smuytuPM5jSayUkctu6Jji2z3xucEVQ0%2BoIHiaTC3A8AS9hk2saHl0ueZzWsM5G8cIOwuI8VeC6nfyF6zqdDT14jbtWllt5wfsGgisOny%2BXSt0M8miXW1572BjkL%2BIGxd4zuhqIwpbO3ucAEPKsXISvQUWOYI7TVmKfbMOj9Qbtcv7mgRItct6MPmShF5L3SCfuG8xdE%2Fq%2Fdq8wKzqgzTFawwwh7A3j7CHg1d9gyGQ6O9xEULWZviuj9VwcvAH56JOz9hdQASj9NeMExL6DVoDCYXz%2BNohOjakqo5WaqZbUuseC9axDybQnp%2BAsEkjbvm0%2BszwPYrXpQHm3GZHMTldL52raiDqSwzDiow2uqfzAY6pgHZxOL8vjn8lqki5sIgcfOZAKEzpxbErlGLRzo6Wf8JTWo81yuZxN%2FlXi%2FN3MndpMw%2BIgA9VGDGLpxo9ean2%2BxUvLiTc1%2BCc4C1vz7%2Fjy%2FbOIn4lQ0%2FQBrJYwU3o4HQKesPzYSw6NiQfeKHyY66xJCTGBd%2F%2B%2B0nEiz9sL20iw1ftlU3WAa2kK8W6c39KtNOrs3SOtIvq3WKFiCJe734fSrWZuXB%2B%2FRe&X-Amz-Signature=17fb310a8afe87bc57b21f3cd402e9688629edbdfca0e726ffdff26aacac150c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QCOVWO5D%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033425Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCd%2FV82Xo7p%2B4nXxRhSUtCLSwVTlyXVLylFdnFYvYRVAQIhAJA9Bf7VtHkN62gbUxTZGftQ6zv0CvMhSxSfNGUyzUGQKv8DCGwQABoMNjM3NDIzMTgzODA1IgxWxiBQ1Q0ZI1zUFMkq3ANQe2GSXcUXuIxBUDD0nRUUz%2FTi0H4ZTeFRAoEeZtPfZobXuWgnQSjdcPYnVbZMtQ%2BCuon2dtjviKCuY%2BWD9kGr0xV8QI2iSBt1DsOuwKgLUls7X6dwCs5MFTYVwKnfS8m%2Fg9HR%2FyY%2Ft7hptmHqXrhnfJXa%2F8EAD4K7qfFwxao%2B%2Bq59JWfj%2FiA7sxpfQgKqQkQQBqTNVIqo5XASVRv8wei5AiGs9jGUTWljBjRSb9xugRM3BQ%2B85OjavG3%2BIAOioEUm0lpAvsHryMnahy%2F1MAHzb%2BdJB07t7LuoI8E6AGFEcSJGeCIua%2BzZvqDKRgxvYSiowQXu3UmADOofd3RUbDyyV3Z2wvqbFhZHNVz9yGFrOgMhI6zp3bPPcoLqdaRq%2BAqyp%2BQSyTq%2FURcWQNJRKQJGsAC4gNoIKXiGkFSDLNvaKOwWFf9iBEnXrP0SIdenElu0cmC452urMUmXyxxSlBSPm%2F4HTosO4R0%2FRxzpTrVhyISGWQhLSxmc1R%2B%2Bcezf63hF0XSSlny6adMmpF249sr6kKbpXIufWwRdIrDmaMllxOmKT27qGrqh%2FPyr2vZWC95r%2FWhLZ889OaO21Peg9d%2BdmtsOqm1%2FgYpQnfIiOwenAB5KvU6XLceMlcUqDDCo65%2FMBjqkAQpS6pcYSRowC9yi%2FjwWSJQbQZ7Lx5alY5ou5jmMqqE6M3v7xbtMcaLT8DemAOcmXRVTseffM0yBDdgf%2FvKr79udNFMpsVO%2FMYsVGCSA%2FFO52FGpG5srjxNq4v8vRcVlIyzNXNw4db4KaKNt8uu8D%2F9DVUOpUBw9jWdHPDd9zMIYbNmK18MaGSqzusX5nQ38LJWWqLqRXf%2Bf4qtPixui67dmmY3V&X-Amz-Signature=d0fc330f173360135275878c2ab1e89a7b34d7f1e007c5e55c15dfc578c0dc2e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
