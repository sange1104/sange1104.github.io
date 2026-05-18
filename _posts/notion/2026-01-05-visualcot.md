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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZKGD5JMY%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044449Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEpAmONTgQSasvNOxij59BH6Q%2FduM%2BGU4OotxrO3iJNMAiB%2FAEGXEa8El4QQsdoWKvzxDmXzVvv6qIBDai3iDXY0SCqIBAi0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMQT6BBpPJj49fKjd%2FKtwDd6Zrv1hjqcyq0OPxO0KI45NuUyXlLRgg7dco%2FGrNCN4x9b1lZNuXnWp8O9%2FGa869wCUsM2jGIgd%2Fczj1Bp6nEMLmmxHayKm%2BYDnp8USR7Ro54mhCaineGvcTf0vpMukJ5F0HKYFD%2FQj8RupAdbMTLmTA7e6g24wgS%2FNlTFU%2BqmlDcFQrKrsQbdQPYuHHkzP1s9G7k5o6Sb7%2Bgfm0%2FcfKPwsxxKZ6x%2B48UEIDnfNblvph7ItLupIYcHQuS86Qaw87XdJN01xTUREsFM%2F7bY%2Br5mdZbhQhcINmTT0XH5lQhL127KZ6KgGP94M1N5gpTjYWZ%2FF1ngFjUZaexjWmlg0QwBNDGDlzMdMydK%2F5%2Bb4J82EnPF14Vq8a6iKRYDODnZOcS%2FMszTcHn8l35nuaa33ZYeckBjOt9%2BGJByBmvNGKiCcCGE6C0fopGbrdgHAN3b0YaovkVxMPVZt4NLR2SuTy%2FGsbNiYDjwyXCL%2BZ7L25TS5ooYKb1G2B8VhamSxlz2gSoehA9iacLFDcm4%2BU8w1mHz%2B53ZRWpPDazOxzUT1KRmzetZeLrC%2BDEs1aFlzUVtmQC7gVNPsau3fvUGaW4AeNzl%2Ffo5CgCHXeB6dHlNLNMKK16kC4m05HYmZNrJIw0Yaq0AY6pgGrKXjuoS5KwHRtSh%2Fl4f5SI57ApLBvQxN7jdMYKZg8WOn8G%2BLtv6U2ILkIUsDwD%2FhF%2B6pCFdjL%2Bp0OwKBO%2FuRg2AByKVqm8F1iWEWBG73UjHAtWEnMNgRQ7ZsVxmu7h3N5RLkWLXxone1cGkjci2HpKbjLXOee%2Fq9wWAAZpMmT7Rnsgs3cvRBMd4eiK7t%2BqzczYFhzcklH3VTv5rQhosvtgSWOFySV&X-Amz-Signature=f6d1d7e09a23ac8f69f2a15b30cd16b290488701b6dc8b38e0fdd1d72c3a7cfc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667K2UZOBF%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044450Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC8YgxD7XE73W%2FmQAFxBo6IPN5tdYh4h3dJ2Ht%2F2%2FAeZgIgMNwgoRLR6nVIqEstuLSfx%2FK9jDTUuhQTYsSRoPfxwP4qiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM%2BxLbSaOgf3UOeqpCrcAwpPJ7xbiE%2BZSo1VyDQdiMYdHVQbC6c%2FJOg%2FIK0ZITu40hgIpv%2BXhAEZIV%2BJ1OL%2Ftj5ot9qf4ocZv8%2Bc83uzYoJ1iCaVE9MWHTfTesdxxXH4%2FSJAjfYnbaCWvDNsUfrimyido2qNalJrA75N%2B4YwPytyUYve%2Bi1N76UqXJkBqnK5hYo2ZhSGXX5EGutOLpCVRA3gaVP%2FgFB1TUdZ%2Ft0xZbdy9%2FkGGG7FsEDXKkQPOayxCMV7XPj2Wriid311Sen8I3o952FoUtLtO4kBg2chnthsLTa3TV%2Fhwnt1cpqelip8G7L9AZBrWlXfluSz%2B1a%2FOFA1cQg03toa%2FI1ilgQJeLXn7NVSGp30Hd507j2JuAu1uubtwRXZfD1F9LeQHN1P%2Br9sHDciNBrIf2jkXf93qSy%2FrHQY6AcZgAE2LpWOvaSeU9G5%2Bt3eTa02QwZVUxN24Vkf0KD1fKC%2BUc3LFT3WghM7ZBQYfiLLIK%2Fd98U%2F5AQTv9IA4fAi%2F15o5pqZ33wiXvX%2FpCr6cbGZdJGCL6QgKAWwl6UgEYBDfJjdBVupgfd59cfo028nhmy7MFMSmZFCzw3fyC4254g031jRthTwNl8uFus6b0gu9fkov1rT1YVVOs9X8Cn2%2Bwg7yJF9MK2SqtAGOqUB6MUgWflsWemVgfqjpYjUW6n8GGMCGWFIIzEGXxCIdrVHxtw0wmIgCmW7UOl9VKY7AiMAAX3ZmXOirPAR58vh7ynJGh3IZSbX%2BBT1KgAMKz5Ck9T0iQtaGdxqHl4pIrHuZLNWWXS42a%2Fwcg3P%2FWYkmg%2FsQqQ1G91EoCugZCkZ4FKaupLJM5S837xjBz7GllKP2XOWzOpR%2B%2BZaeb3LlXeA3dLDrl%2Fl&X-Amz-Signature=3731e3a564287096de11a6ef6ca3a4936508a7631e0f1fd868d02b16440e1536&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665SRR45U5%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDcVKg27iQjOQ72O5XJQIgl%2B044WQLO3%2FnQmamn1g8bogIgLa%2FAk9tKD2gE1%2BD9shUZxqaEIPLAqzmRHA%2BFdcJv7JAqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDJxho6%2Fkg0nIg3AdircAw1rGZBf%2BnoXPK2lQWXSmyXrXGaeH3SfxIoHqmCikyYTAu8pWrj%2B6uxhBQffU76sNz2f4m3Khn5bcahzXYUCg1gs74Dfsp4K0%2B6PPgjOIrfHCAZJfsQvZMCfI6ShnK4%2BhYtVvW4flYAdnMSF0Cho1LdvoWZJ4TESF%2BAwfxJXLCXcbs6M7tMlait7fCuQ6eSkvG7iz5zpdDBlACHSGG4uyJTibx5nZg8rXb3SpPQKljUl4Tk6%2BGiMjpwZDvH2hF27MZeeKym5rvKDJXr9YPKMCEBKjf%2BOGtdIhDmgSlr4St9l5YJWUxG%2FbShVqCHlYny8pX4zn05AdODtxarbFolhrdh6cjgs2Mg%2B8VUK2tPeh8OARXGrFA4qjC18sQXGPMwq%2BAnWBSobKCayBXAuQ9cZBBY4aI4JeZL33icEmW7TJb%2BkcTjJ4b06NeBqmIHYHz4tlpfdSr4pes7DyUJP1KuvxJ7IufSIVLnG2n3bOv7bQJQoHPay8x4jzJefPkqOXv%2By2coAgXDRx9lcNbtMn%2F6X6a83Pw5KsrcbAxtdChQuKBiyWGGCe25rkpZpWl7FLsejJPLlUIB0FPlM3MQao%2Fz32mcffpHBkyMmLGZcv82FyRjbiCAEqBSTQSUh5rR2MImHqtAGOqUBDFXzeOki72iMOosBwCfvtvhsd5%2BT4HqvucHEnnJAd1IHYDAryVL%2FeNGdgpIfeX3Q9Awj5hG78FZgHihNA%2F97wyO40X%2F8krPtQq1qPMHoJXEJMFXAUUyfQR5daU4%2Bk0tYrR%2Fw3LYlU9wIqpll7SmXeNA8p%2BEex6z4gc978DObKpnFfEahVBGvOHW3WOV1sVZxc8S3kF2i0cBE2lTbfjaGKQKKvJ6H&X-Amz-Signature=4b718ce7ed82025df01e579ecb6c55d8202c416af1606104d273e4b703ddd67a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665SRR45U5%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDcVKg27iQjOQ72O5XJQIgl%2B044WQLO3%2FnQmamn1g8bogIgLa%2FAk9tKD2gE1%2BD9shUZxqaEIPLAqzmRHA%2BFdcJv7JAqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDJxho6%2Fkg0nIg3AdircAw1rGZBf%2BnoXPK2lQWXSmyXrXGaeH3SfxIoHqmCikyYTAu8pWrj%2B6uxhBQffU76sNz2f4m3Khn5bcahzXYUCg1gs74Dfsp4K0%2B6PPgjOIrfHCAZJfsQvZMCfI6ShnK4%2BhYtVvW4flYAdnMSF0Cho1LdvoWZJ4TESF%2BAwfxJXLCXcbs6M7tMlait7fCuQ6eSkvG7iz5zpdDBlACHSGG4uyJTibx5nZg8rXb3SpPQKljUl4Tk6%2BGiMjpwZDvH2hF27MZeeKym5rvKDJXr9YPKMCEBKjf%2BOGtdIhDmgSlr4St9l5YJWUxG%2FbShVqCHlYny8pX4zn05AdODtxarbFolhrdh6cjgs2Mg%2B8VUK2tPeh8OARXGrFA4qjC18sQXGPMwq%2BAnWBSobKCayBXAuQ9cZBBY4aI4JeZL33icEmW7TJb%2BkcTjJ4b06NeBqmIHYHz4tlpfdSr4pes7DyUJP1KuvxJ7IufSIVLnG2n3bOv7bQJQoHPay8x4jzJefPkqOXv%2By2coAgXDRx9lcNbtMn%2F6X6a83Pw5KsrcbAxtdChQuKBiyWGGCe25rkpZpWl7FLsejJPLlUIB0FPlM3MQao%2Fz32mcffpHBkyMmLGZcv82FyRjbiCAEqBSTQSUh5rR2MImHqtAGOqUBDFXzeOki72iMOosBwCfvtvhsd5%2BT4HqvucHEnnJAd1IHYDAryVL%2FeNGdgpIfeX3Q9Awj5hG78FZgHihNA%2F97wyO40X%2F8krPtQq1qPMHoJXEJMFXAUUyfQR5daU4%2Bk0tYrR%2Fw3LYlU9wIqpll7SmXeNA8p%2BEex6z4gc978DObKpnFfEahVBGvOHW3WOV1sVZxc8S3kF2i0cBE2lTbfjaGKQKKvJ6H&X-Amz-Signature=ad1e612dab32dab3272073028425fbad1f04ebb3c9445dac67bc19c4c10d31b3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZ3DETUV%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044457Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBRvWaMJ9nK82WJP4Gtjb1MBckWkwAXRbfFNriInGZ%2FLAiEA4VTek6%2BZkeOnCqDNaYMyf7IHzRcBwHK7mY3NS8dCC70qiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDwMS4rxO%2FvA%2BiqmqSrcA2rjmgePKYkRU7hbMAIx%2BrmWjkA%2Bd49sKVRVlWzqj9SXA6Br93XYdXnch83sTISPBQKjPQ0UsYIVpSZxuTB7%2FgHDBxmjpGeuKU8jRLc2PAb%2FtAru4ES%2FIknUhfjWY%2BF6xEa10SwC3am2o5MvkZNKS1EIhsIMclMBShfsHdMx%2B4PGA6uZ6mAMeWmu0nNa1F%2BK1AmRi6Wi292yTFYgViFJI2%2BURkJ0lFbexKqEaL%2BKIfPt8Q2wj4e1iNwztgINdOiUmX%2B6i8DqjCHmtYm32z0p1toW%2FMwhUwpc1PJkZ3jXNYHPydA%2BXuNNviWarqyT3sqz368mpH2YNkFqjQLZmCV5fudPVoW9itpvGuYjGOCp2YX%2FyIXsi7DS1uaNcFt3FE4EKamE5g%2BLmlThghjUGpGX5puiR%2BVqE7lL5HhlSG3GeC9hL8WGKO90FtKU%2F%2FVgNtcNDGTOpOIMivT6yMHVIn6zMseKiOkV7rL%2BWAAKuPmwj9AY4z53zXyKnlxQh1bGi1VOFncMN%2FHqPD%2BC4e1zdHqwwSeqjnkzzmXlIiZOhGmL%2FI2ZSr4RegOQb9HxOY4AvIAKgWEN2%2Bg1Ytw65m%2FbSWEgC%2F4wHMkWo%2BA8M5ygEe1G3tzFwEOAgbJYDu28WWb5MO%2BiqtAGOqUBwlR32KrIceHIp0Me5b5mzKIU3KVOK1TAvKJBeLM6VwzUPJtMEs%2B8ZTkjlADvEo%2B%2FrBAncaHRqh7IB4LF%2FsnL3KQU089SPg0Eq0Y%2FlcR%2BUfohgxqQ%2B0AJMciiogzFhIjLj81kWVhmjN%2FPP37KGEzxww5MowXNZ07IqyDnOGe%2Fc5g5GEfygcU4WRThG%2B%2F3sa6vusz8SQQc3uKRsXuzsJYwq2DH1ObE&X-Amz-Signature=b6e039aef106e60d59b46869eade7de05abe370f9da90db96b945722b2445ab2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667WXY64ZA%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044502Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFEQXLwoEf%2FcI716alp5%2FhG6%2FeGvNfXA2puoovX9y7SpAiEAneDL2lP0cguRbztUzhV0W%2BGserpX8cZ0sxavnEArjtEqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLfx7SbPfAUpCePPZyrcAwYI2vVCsPizvcNnVn9UMLSGzrDV2ZpPByZDAxOTAwbD1IxU7wMq4IpJUW6zAMzTDBhu2f11Z2CH%2BkoZGpfIpXbcUijPIt%2BRGtdeNRazidxiz1H%2B8HHIT4arsZcsv%2F0ZFvkTAlU%2Fb02phLrC%2FXFSMCzNAXldxmsBeNjwFK%2B8anx5faJdEs2u0ymDdLvzI7%2FFj5xqDXUow3KIDuYe8wl5SRuclnM0vxTfoTpE5Iv9bvoyuyp4xYrrPpY7CWzh%2FMTrw80gL1iIhjKECZKA%2BELP1UvgtNRH8NOr3%2FAsBmjAun%2FIWJAP0QtRsL2Cr4mpQovuIs6aiX5wDahUGesrq0UssnmYwqyBrXGoXNtSfRdOvmGeS3DcvJNlt%2FaWY18spIKpvWgmBFqqdvhw9QL5XFk1NHJlsyhpjwwE5JNxs8GMH0mYAPRguYc52rVb1Zyk6rpVL9K2A5xqHICY0HKR5ZYowPIGwU%2BcejlwgvBlTW6ofdPBsjl5Xrs7whimTGevZTEfMfN4FgimAFyNdqLMoKxeeWvp%2Fwffz62uRY7wtSND1LwVn6Jc9NlTZmdLCaZSQkC7lWZKH34ItCMxrheL9L8lzSGJrNtWi1gKn6L78SyRAJobp3rbCVmJ4KzoYs9vMNGGqtAGOqUBCTt7khMNmz0m0PRpcJjZaDM6rhdWKy9cPGY%2BqyOokzRGATk%2B5B6LBbRLLsQ3pyxDTzTqHKpHsCB154S2dHuB0SyZk%2Fjcr54Rll8y8gTi3BEjsUKVRmFra3JRi1N32FvjYPgFNconfrI1ImGDYlImJCSF98d5qIH1WZgYwwdZsbeT1d%2FmEqINqf0gNQky7IvL3JWigs2Ds0z4QD1831Fyl790XPV4&X-Amz-Signature=aa04056ffd67d82e28ebb2b06446ff5d3750656f1a94745e798e265be35174ac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X4OLMKPO%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDzcbBDLgVdJnf9%2BhYjQPQmMz1YicCppFtOq8Pwb9sKkgIhAJjAifwpVCubQ%2B%2FRH7p0C3yO%2B0a58VqhRQ0KhrFY%2Fa1mKogECLT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwOYeTetrlDB5kxRUsq3AOTiquObxXSZziVNhSsH%2FuA4XAaFWB%2FetVcoeO87efoANwFwcCNWE51dI7j7gM2n3IEq72sF5kEoCEPVs1u%2FUukI3SO%2FEETsRPcqvwFWET9hzskUv5BbcOF%2BkDAbxt1qmtJD%2B8Km3sBS%2BNB2X9B1z9CSfPyLj01y0%2FCJeZv6zXX2TJvf6LFlZ%2BFt5CXnsjMYcwnyLy3Pt3zmDAHR9m42tuRCYXgTq7SubUipjmyMNJZKNFVb0KngeqLuDiN4QbqmzxoMd8bJSi0uGIR7JUkE4eTemq6KH5ZhPuHhiFfmWlZ0F4pL2K4R%2FdEcr74ki391VTpkJ2%2FJ6GMtt9MTbLwpHsE%2B6lfBsRJ9otDBjebJUNpkban1CLzv1tnCtrHqQdBAbmmyYa6oiacs9Hq5UJKR3fDDKy1bTM%2B%2BAPCPlX8v%2FliqHKYc%2FHUvJEYm00QRXXWY7gFO1y8JVxzhRcqpwqR8joJzULRzmsIYXmRH8digf%2FodJyg0XqjrlSMHqabXuuRci77Uy3Of%2F1ZhlON7NinHRRi4MRSr%2FLnAwV12FOmBxjEMjFKUDB9ieXODPPUzNYV9V4TYecU0G8Z6ERcyfEwmeIO%2Bx7okm5S3URVhzTpeZz3L%2BYSxX3wv75aZWbFjTD8hKrQBjqkAWU1OF%2BmW%2FY1%2B92hKP%2BFN5WWeg8ol0JPqYL1Uj%2FiXi0f%2FhVDv6mbeCim6SiGN9kzBbaaEmASz3PhC1fj6yCUSutN0VHGb8THn4evg%2BZ8lSWIkzo36pKO3ShVTbHNB4yfxvN1NyXoiJrrSwZO%2FMkK1bV3EEPp7Y6uoUbcXACGKaTs3xX7RWYFQCz%2Bme%2BshYhP%2BRhMFl5fFJTdrj13CUXedRQvMzpC&X-Amz-Signature=d8b8136ef243849616e8267329f1735067275118d5d6d4a9e4c361cd05168a9a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662VMS7RTF%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICIss9wLWcK808s7ZkfcNarSj06BgAXdYZY1mkRbJoekAiEAnXb9PwB3SZH%2Fmf4cVP4u2DlB%2ByhbES4PNz9o2tkxQVEqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDE0HnvfL03EBEsMVnCrcA7%2BKxXueX61WLiKJuR9d%2BxesxvNhnpHnX99oO4gG6cS4w%2BggjD7lq2RtQ69YwS0WBEpYOJwVCetQMGlb%2Focya0vEQ5D4%2FFB7RBgWWpMGDnAl7msKpIHC2whPOKepzcQfueZZWmrqouQb3HKwVLVMZvWHmKb7hHuXFOm%2FUwxm%2Bzf%2Bx%2Bx%2B4VFvuamDFrP6TwHmlLf%2FqB%2FjtO2YGHPuIc%2BiWBqSrdZ9Eg4B4uIpWgI8KPjlRcxOfmHYB3coOaWNDXLkL0%2BHXm1CutW0Yejm0lbxZJQBTYhreLRLmI69YsWTWz8KB1VD4Ol2%2F6sejfBRTr13jIzBCDRJ0mJ68CQIARsq90r5djPdklWPea4i%2F%2FMiZ35%2BjxOZXVAi6CqhjxiBzOhxMeSy81J1pKg05P0UxOA6EVL5r1PYM4TpjLIumjwLhWjwFa%2Ff%2F4M09Ox7BwfQC1l%2FL2PO6WfQAObCcfpOhO2WXZIWL8DnO19gd%2FRY3QmEfmSOHjlyPtRrEIF2uYZFhd%2BbdQgX9Tpx9xak5fgD5hxVg4Yq%2FXlCOErXmvFCVceL50aZWkqHaL5Vg1iasooPaj%2B9xMeT5b2TMUMUBuGR%2FVlwHhawRetg8MOqYlB6fwVVrE%2FNFC7Rk5l3OrNM5SCpMP2DqtAGOqUB5Q0kPstJ7RuKB8ixu8FZ9EaQT%2Fgwg1iE9FfQDwNUw%2BZGvRNJYsUbntrwUk73RV5ymvxgv0NtZ9j4TjpUtaRpqfdpCgaHfCxSvoIhpDWmioP2XAvbpxjf0d7LtQSGexSjtkiV3RO143DS2gnYBLPaouxGPnd8Qt8ZOQUBG4S3hZOa11EDWzaDhatr89DcL2hYKwS3kXMy8ibLWdbTt6UU6aF3ZpiW&X-Amz-Signature=1768f386b4545efad5164a91e6fb7e8b2170b2580513c9c10316b7c1b1c24147&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UGFMBAI5%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIErmtGwTllDiqHC4N9xay818k7JCJnwuVhOoc7ndUDFFAiBAXrYDJfSDg%2BVhdCfB3xB1DKNnMem8%2B7Vu1CzAeiRhAiqIBAi0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMD4fgRu%2FKwTpfWcRbKtwDPJz3lHzJaQs1yLfuUOmjNvmR%2Bp3jM0O1difwv6yZp0EEGmjUTNMOcwPKGR%2B%2B%2FSs1YP%2FLZqmPy56nWU2K7ySHj5f87lsGs1LCd1i5Y6JOaNglivcWTc9JZVtktAp7BIoAatw9oBWotRSdmPb%2BgJQ8J0RBSqoVN9UavlhKCDh5yv87cCJGhPgxWgKmTdnRAiGS4T7xEDs8V8R2yZ%2FUYEK9U5Ka3hprOpBRjx0vLJuJf426ORfbQTSgOrWNPC5WWiuSvWkQCF4SU35nWsy3PZuHWsgaPwlOK84zHpGFvQ2mgFA5yjFauHmwfabnpRoi4BMwCGKBsRrgMTZ8Dvtw7I7OR89BL%2B%2Bvc6tOUCnfkxJO%2BNXHDny5TbUMRlVb2GgTNP%2BJn%2BHAu8wXElLcgmDXz551mdXykfivu3S9ytsyceHZJ5%2FANHW9%2ByFYL5umK6TaW3K6%2Bk7OIe6Pi9fUtzETzT3dCEKh0tKl087s73GVFHiz1N6Gc1EE9F6%2BB1Stvvk6nkEBrF09p80JSHST%2B8X0TEhKa1e6UxxorRV%2FZwWFgUI36g6rTGSMaSAZ3%2BPY%2BPDLrbToi1Dfi0dU8%2Fb10vM6W0BdojH6Jhi4ICS8292bXZPhZQJAX3D6c8%2FUqVBDdGQwjYaq0AY6pgEWkollyU5qmXntRLnwGiY3oVulZFvM61rrqQ%2BOzHZ7%2BVm%2B%2B78P%2FjTFxCMMHiinEuf4m%2Fki95Nw37vUAzkHeeZoOprKn1g%2Fpi676wWV0p5Ik%2FSwN%2BipHv6LR8nTZm9ni62KOEE3dcJV9eVDtv1Lt7lxXAiT4wLaqMOeM4fidUmFHgu%2B2Rd%2BE9cP65B3I76kM8axvyF60pHDKGSdMuuJP%2FQbJ8a3Mi8G&X-Amz-Signature=31829c503abdbd0427ed3ee4605e8520324ff38165174b7df713af37979639f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665SRR45U5%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDcVKg27iQjOQ72O5XJQIgl%2B044WQLO3%2FnQmamn1g8bogIgLa%2FAk9tKD2gE1%2BD9shUZxqaEIPLAqzmRHA%2BFdcJv7JAqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDJxho6%2Fkg0nIg3AdircAw1rGZBf%2BnoXPK2lQWXSmyXrXGaeH3SfxIoHqmCikyYTAu8pWrj%2B6uxhBQffU76sNz2f4m3Khn5bcahzXYUCg1gs74Dfsp4K0%2B6PPgjOIrfHCAZJfsQvZMCfI6ShnK4%2BhYtVvW4flYAdnMSF0Cho1LdvoWZJ4TESF%2BAwfxJXLCXcbs6M7tMlait7fCuQ6eSkvG7iz5zpdDBlACHSGG4uyJTibx5nZg8rXb3SpPQKljUl4Tk6%2BGiMjpwZDvH2hF27MZeeKym5rvKDJXr9YPKMCEBKjf%2BOGtdIhDmgSlr4St9l5YJWUxG%2FbShVqCHlYny8pX4zn05AdODtxarbFolhrdh6cjgs2Mg%2B8VUK2tPeh8OARXGrFA4qjC18sQXGPMwq%2BAnWBSobKCayBXAuQ9cZBBY4aI4JeZL33icEmW7TJb%2BkcTjJ4b06NeBqmIHYHz4tlpfdSr4pes7DyUJP1KuvxJ7IufSIVLnG2n3bOv7bQJQoHPay8x4jzJefPkqOXv%2By2coAgXDRx9lcNbtMn%2F6X6a83Pw5KsrcbAxtdChQuKBiyWGGCe25rkpZpWl7FLsejJPLlUIB0FPlM3MQao%2Fz32mcffpHBkyMmLGZcv82FyRjbiCAEqBSTQSUh5rR2MImHqtAGOqUBDFXzeOki72iMOosBwCfvtvhsd5%2BT4HqvucHEnnJAd1IHYDAryVL%2FeNGdgpIfeX3Q9Awj5hG78FZgHihNA%2F97wyO40X%2F8krPtQq1qPMHoJXEJMFXAUUyfQR5daU4%2Bk0tYrR%2Fw3LYlU9wIqpll7SmXeNA8p%2BEex6z4gc978DObKpnFfEahVBGvOHW3WOV1sVZxc8S3kF2i0cBE2lTbfjaGKQKKvJ6H&X-Amz-Signature=0121382ff62a72f4885f7ba4a79d18d55edf85067cb752e30b74638d84f66973&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
