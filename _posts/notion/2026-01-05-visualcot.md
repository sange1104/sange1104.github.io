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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QAH32IPG%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041908Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAau17u7E8ixbtrYGHCkeu0GkgjYqM9rJQCFoEaH2XixAiB2FyUusMLEcbQg4KMveScgoFyoqa5JNQlYCSlm92baJir%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMn59m2UkNTWjVhff7KtwDz8S%2FkgYixVQ1EKSBDGCzX8rQlsv4aWapoyHK4wvtvlBXEp1Iy45%2BXgaBD74EvCVKW4KYcdu9%2FTwb8YQXpEmizOU5WqjBJzDG24nc5P0jF0rq4SWno2G4bpp9ZDfxc2YMYZkDdr%2FxfrM5HBCT1XbXKqhQbbAozxK23eGvbUBdWNeGmYVRpcdTjJ2v%2F9EUJeIBP4hHTfBj5SaK5hp7cDvyoE0vkfA%2FSjdFTj7fkt%2FngsXIUFOKLI6MznL7TobPD8z1Q7yHe%2FMfZL5Qw7aHGuP4E8y9g8ZxKc3JueYDfR6UJrPhTzmYWEKh631KIyGbuGo%2FLk1nCWHOSf6eVWZFKAw0w9bCds2Az0hUpGkEHVjTZpxNLSw6ZjF%2FQzaM1Sf8OInNnmmLDQ4ZiMHlPBACFtCfmEcNdexPgs7nr2wjtCI6%2BRBHeFPnBfaVUjdZ1s728ibwa63%2FLx47Eza8FQUnzjt4GqSVhNGAPQSQ4zS5AqeD4IUfDZ%2Bl0XNEi8yHJkAwF46WFnkyWduWrMsMOVzubjsC5gCQhcwlEWyUcb4K1QKKUy%2BE%2BSgVv8DNOzEFh2kr9OzTyBs9h2jMdIWlqVxtFo24qg8%2FsJHTDQbqG8pU4F9HQw0zD7o8bTkyePbPXWwwnZaa0AY6pgEZMATNoJtU3d%2BmHrIy1BTGjnZ7wLr1KQClekgOcNEC7JjtfkZ46jMKcHNUarUJ5mxmnlr3049WzshQyws1CPiV0MQzTBshOgWaDYQAw3KaEEnhCxnFK6fQ%2BpS%2FrBVBeXA02jRC2wLV5k0wiXcerr%2BtGwNsIknmkMSdXGGwfcBuhrnkKXDI%2FomsK6KEjhzcgK%2F%2BlnSEcVrTmNE3okSJLqVGHgnnK4ie&X-Amz-Signature=3097c78e8288a7f2696808845ab3f7bd484487c06ff4c4826c1197351cd72e99&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W4FS5WZE%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041908Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFdrKf846TmOFHLMVSZPPMsVedOHNn8rUx0fZHe2rDIPAiEApklVo2oljqbN%2Bt6WCioX00xjb3jsCq643wat82%2B1p6wq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDFUs8AWO2xrx6yGN%2FCrcA%2FLHjfOv4aK6SNQn2DojNE5ennBiDKaQbsUaWILqiF%2F7dF8qVlwlqi%2BbmS%2B3kbUQz%2F7P5Rp5YmOl8%2BX8qqHTSsbEUyct7ZKFTs2%2FELDVvMUU9w4JdLpGCLed9yAK3vUyWEhBERS3JeZCIomzva7ngestiDYV%2FRDsw6%2BpTzUwjnpsNGjJNSbJA3vJ8%2BrlLlX2xGg1dv1m09aT9q%2BejEVMxF5ljU8AkwqgVqXAh3jzCwJBKOCLtOU5wqMHJqFeza6YQtXVGstMZTFOuiAkCdFHb0arlEXR6XicgxKzypMPB2h0FJ5sVM5eTPdvn4Ar1p01hEAP%2F3RrHKwqlPuvXZYmSYuX8r8EcJp1L%2FIhZsMCqVN8lyIOTyGEuKyuhrZAbLxu2igtyTIxX4nGlJD0xh8xj%2ByxKmaJkzB27DGB%2FqXnPTT3zOQaM2TdHHMuBl8Zbzs%2FTSIAoAzZapZ384Q%2BiEtz8ZjMPheo1coiSyxbwWSkS85Pe6li5NEXMAXKNWtY%2BDLAP6Od%2FivpxvSZSx2UFBKs02sHAcJdpD%2F7es5Iz%2BjdS%2FfnaOQlFFFrwI3ab8Bp36f9AdJJ6Im3My4REpRobSn7%2BRx70PDkekvp1Cn4oXdxgY6wdNLBj26wP8MRTM15MN%2BTmtAGOqUB%2Bs3ZtuF5TlDkEziW6Mu2kP532fli2Gs%2BMl0BBFEnf%2FSjBqw6RbxwwWFpuci2nCq%2BOqYgtf%2FeBB9hPS367rzea%2Fu6FiXPMUNhRrECgohC35eFGma6TG%2B0TsrTK5nuY4jCQnsmVOHWqWNXWa6e2D%2BP%2BKB%2FIjSMccinrbVLQrn7Ov6Mx%2B1U1XuONh8dXeB8WYgLE2tXGs1Jz39LoU87Lji4bPw7th6V&X-Amz-Signature=7aa160b454dd704e300c27f0f93ad4dfbe4bd343860d63d4c4958ac37ddcacd9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662C56JNIT%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041903Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC5Pitnfa0w4DKa2QF7MQQxeieYtUMAO9hT7L2MEkOEewIgSqMv5l%2BI%2FO8pp9yDlTcTnWBTSbU2isnE1VKlzHyRV4Yq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDPBW8IZDZVN1u0LDAircAyfdjNNS%2FD8Q9H9c%2BsfPGG1IG1VQT9zChiWt1mGfKmqzfwB6P%2BzzRgoe%2BmdD7HNO%2BRbSsnOyyjkdbMU48yCH2pmrh89Bb5ztV8%2FxRGhUkQ0NRafS%2ByZSaOcD9Gx%2BBy8s7HY33qzTHsQXoOw3K2cfLVkCHWGHDDcUr44GgwEtNybNN%2FE2aC88dzkAdi3XvzcRIwK8yrk79UuDRQmen%2BocmS6Yjd8MdmCqkjbxBZYT7f%2Fbi6gYu7RIi4te3L5uZ8bS%2FWN0TjmUUHp9dWTUTa3djd2xbL%2B6HFMqRdBF6GVJcvGN18fFIg6qRrG45ytjnNUeqLUxynGyuEqcm%2F6kUeKdv4MTkVJFqevZ3rl4KvQHdcLA7I5mbhgmjkfHlUtv3CwK%2B8kpLKiWOczhBbwPQF0YlVnMiHyMDE8mSBMsRxuu5jUxlFVmB2QjYRebjd8AlghF1hp9YHdL2%2BsTTdC%2FnaYVxErPkBjGJdFF2fpRYyVeNdVkWPWNqnkcuHBTCsUh5%2FvY%2BNLcO4BMhohoSk%2FtiYrKTib%2BpuwHagzirnk5YU9tcrs%2Byo157XmootKxGPerf5syHXpJceQ6AjEtdT%2B2SASDYnXrC1CdQV5c6EgtGswb%2B45qZjQ357vh6d3JX2t4MICVmtAGOqUBkgUgLkrJIfoL%2FCS5zJP0IBFrgYL4qC9%2FQOzR3q3G0ahN7YgdQydBsB0mK3PLG10WSd4%2FbI2mTlvT1iTMeBC56YJxT2tdHSq65pGOP5EcXpJMpM1KsQYgztB5pJgH9i85bm4GUS1JgEAer6jsnpf97jQRNerXT4hiTpiTX0u3wCvXKuw%2B9WzO%2BYtEtIdxO%2F7tm9LaCY0Eve4ep4pOP5BXBmQUGkuK&X-Amz-Signature=d309ed4d9b4c3eee8410cddcb772f8d718958a2c757544c67845fede1b643a5b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662C56JNIT%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041903Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC5Pitnfa0w4DKa2QF7MQQxeieYtUMAO9hT7L2MEkOEewIgSqMv5l%2BI%2FO8pp9yDlTcTnWBTSbU2isnE1VKlzHyRV4Yq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDPBW8IZDZVN1u0LDAircAyfdjNNS%2FD8Q9H9c%2BsfPGG1IG1VQT9zChiWt1mGfKmqzfwB6P%2BzzRgoe%2BmdD7HNO%2BRbSsnOyyjkdbMU48yCH2pmrh89Bb5ztV8%2FxRGhUkQ0NRafS%2ByZSaOcD9Gx%2BBy8s7HY33qzTHsQXoOw3K2cfLVkCHWGHDDcUr44GgwEtNybNN%2FE2aC88dzkAdi3XvzcRIwK8yrk79UuDRQmen%2BocmS6Yjd8MdmCqkjbxBZYT7f%2Fbi6gYu7RIi4te3L5uZ8bS%2FWN0TjmUUHp9dWTUTa3djd2xbL%2B6HFMqRdBF6GVJcvGN18fFIg6qRrG45ytjnNUeqLUxynGyuEqcm%2F6kUeKdv4MTkVJFqevZ3rl4KvQHdcLA7I5mbhgmjkfHlUtv3CwK%2B8kpLKiWOczhBbwPQF0YlVnMiHyMDE8mSBMsRxuu5jUxlFVmB2QjYRebjd8AlghF1hp9YHdL2%2BsTTdC%2FnaYVxErPkBjGJdFF2fpRYyVeNdVkWPWNqnkcuHBTCsUh5%2FvY%2BNLcO4BMhohoSk%2FtiYrKTib%2BpuwHagzirnk5YU9tcrs%2Byo157XmootKxGPerf5syHXpJceQ6AjEtdT%2B2SASDYnXrC1CdQV5c6EgtGswb%2B45qZjQ357vh6d3JX2t4MICVmtAGOqUBkgUgLkrJIfoL%2FCS5zJP0IBFrgYL4qC9%2FQOzR3q3G0ahN7YgdQydBsB0mK3PLG10WSd4%2FbI2mTlvT1iTMeBC56YJxT2tdHSq65pGOP5EcXpJMpM1KsQYgztB5pJgH9i85bm4GUS1JgEAer6jsnpf97jQRNerXT4hiTpiTX0u3wCvXKuw%2B9WzO%2BYtEtIdxO%2F7tm9LaCY0Eve4ep4pOP5BXBmQUGkuK&X-Amz-Signature=8e5677fdf6e8f70824cc24c09709e174573901a301dd7ac5bd4b64371404e5ca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664FSIAVJT%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041912Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDQ4JUHskL%2BAxsTyTgoxYCI2P%2B%2BiwlSedU8a7qdjCDiDAIhAMmAMsPaJllSMbaSCeW0HVXKaJqG%2Bnv0sqNsrmutDfEvKv8DCGwQABoMNjM3NDIzMTgzODA1IgwAwv8lUWGGYjmXeSIq3AOTCTVm5W1aJL46podjh5%2Fz33n3v%2BWqEpmPDBdkp2XS19coqhCr1x7Tbsl6FFcgsy4crSoe%2FdSdGz577c0DtYR2ob63%2FCtUEP86mpyRLW0VA7UrDX0ZA6UWIZlzhXUU7w8yROgYX%2F%2FifWwUMADRMVS6i7i4%2BJ8OeLmrkhPUWH%2Fcklca123F36JQWPJlpenFXyB62rWn%2FyC26SJoQ9300pVdVVU54YrOXjbIpxV5gtoOHMICdrqWH0iRsfjJ14Mx97525s7OIPSmno%2FXtSDetgCY7s5azdtomj1pUaZ7aUC9WLT8OvLLzgAN6ZV0gS91Ma%2BhA0oJgY6FGRiJrad6jlMOQG%2FdVPy%2FJsW8JXnc%2FIM67zn9haMuO7hUSyw0d7tlwMxfoU8s30iL8R3waduXj5A1t6M2yOB%2BtBd2vNhFuaOxTKwNvzzC%2Fjo%2Fea3PVqI%2BYEjZGl9I01zKvQxxg%2F7xnQVBKsOHQyG9BqDRSUwY4wOoMmrs0sNeENApYQRAVN7MnCUzrxT%2BKrPwP7%2B1CAVWCOoTEV5G1t5UNd1wVXWbVEZd5MV0BGMO8PVlghZVRj4ktMQqj%2B1Z8Nv2ztzeEq%2Fh0EV%2FoYryCuKJ9%2BG76SL8k6rM7kCnlGIMZ97inkuSNDCzlprQBjqkAZwp6bsB4SfYuUJ3ffzSx7p94ddfYzylZeQyHa%2Fe%2BTUXTuX1EZ7k9BNLuy8mTtpwDgNNVaGzxVE7ViRD7nS%2BR6go1eC0XP6p0osfyDM4IoXjIjKOPC9UpFuYBRD8YC2ZQ6D0N3fLVibWYoT6zBrhm3ON9viLpxXNmehw6rCgdc09YAFevls8IuZ%2B9R8YqR9oNA%2FeUZkmmx8TaIk6Q%2BIszQJsTivc&X-Amz-Signature=c29fcbafd21a5263aab9a164c5e637edb42d4e386647c4368eb964a4233998a7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466762WPDDL%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041914Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGHdWvm7wHlJooNGzofRgcep9zaQe9sfYCWEIZdjQbdlAiB6TYIMQJVIoxVhOGxtQ5BP6qZ%2F6B1UUJRd9QG46oFW3ir%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMxB4h5vL%2F%2BCdJFr2ZKtwDq0aCMXDAScue%2F94WXRWNOm5xQYMSqzAG8SxWxS1OqedmnnxTeeOq1kDcOW%2BMy788cII6DkX2rj6nK2fTeAdM6sQ1KtAgc7%2FR0Is9mh08hcD8biPynNq%2B2nz5SU%2FQImnLttWLF5ca7AE4Etj8qm7vtGNCupz6D8LZYjL87w4pFNcOG4rCNQiTX2L%2FccWriwJUQBE%2F0rwqpGlpdiQYrpl4r6HzeJfnuX8l2EcV5vtq7RxZStL6ip%2B3W5VYdHSXlf5IazAfHi7P9u7YSfWHbcsm8X91rIpJtEjscDTmCUKC%2FRpnG2l0zR8FbrJzNHJEmxlXAoyj7pIOpYMqy47vsfDRkbF2sq31zCNCcj9WnBo9OSUd7rdrjw4XMwvrHz0htBJmEJCVeI%2FOtaFzKlc67qtslocHKwPl%2FUetLe2dBjSH9r0wzu8KNiOQ6MSWW073J6J4%2FM2Jg5xf18xoHoqAO1UHHMTOhDYTXDEJaxecnj1f4IqPj06OvOWkZe484AhLxrk%2F1Qa%2BRgv8UY7xtfdu4big66vhKFWywTeMw6HADyhTPCyh12FtFqO%2BHv84EeRHi0rJJkAM78YT11N2woOYwFCnczXbp5gYXm%2Ba9NoP74eappAc%2BP9rrlEYaz9aXVAw7JOa0AY6pgFgPPL4%2BlZueF9KN2PVWK45OykyzTcR%2F1U812i%2BMrA64F8tLWDKuDzl7J7o9WRhvRrJYA2nFJVmHPV8u%2Fa6KqF3ZN4YWhmOlqxespWX5G9mWGV6c7Zq8nL%2FWAtreNX2T4fvzGBMQNGyDYpf1xRSLo64aVdO8Z51t87A1J26zbIAGSrydVbGJlVLhfG97vXxrUFHAYuDHq4mQNrPCZb7%2FQoh9vbg0meq&X-Amz-Signature=69e583e93f6a06044807d4ec16d7eca07ab57e8703903f29fbe8b55f2a7f541c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SMS4ITFR%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041915Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFpa3o1wAA9fYYKkIuKLEdXAgIEMMTKbRnVeN2XaJJ4mAiB7ACWy9G5atSNE5bG8nYWz%2FWrRfhZqrhELUnlTf%2B9W%2Fyr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMoK7odWrapN4kSyzDKtwDq3PYUfUCuyiSxQqKis3aISNY24MkzX6tWAQVBASMfLH7H0PLWaXlmBuzzRtak5sH2N4CcpRhPrFWia1fpu6KCgIW2t4pNHJr4poeX0kbhBiauGU66eM0IcUh2%2FV1gDalYLA89p4J5Nlt3Oax6R3utSNlxdNGSLFUSQMCuaab0oFJhuHBl3dhwv0A0zfq1ObLRD%2BAh2Au59yTlSsLbr131ICwJ5%2FUz8xcANrIWLhvJ7VOAkb7gwtYmrw4U8cZWJ8ZqOOwmeeXBQWhRgdTEmqrGCuThtBz4mSZ32%2FabVDVXyMzQEVQArLeUXEc2uJovk%2B3UEN8kgWjP79G31voU7KEsLEw9nMpm0RYD9WuCgeeOPneinoptVYDlRBim15oF1IPvv5R%2BXkzVPFuewYyAwcz00GFQVLMyAsRUZLNZMERYTAna8DAmShH%2FQ%2Bm65SP5FnBEDWMV3GfzSRHKNWxJvA%2FXkKWMJfkrnvwrWizb5nN1RuV8CykgdKrd1RN%2B4yhG5Mky%2By0g9VVJghC7hsKUTz7YnaWmVwoHUoCEytdXZ0ZEC30bL7z1TdVXKqcJnYiEtmXrCX7EByiY165WLyLSLpJQ%2FPrhFdOeC604wqimTYvEXM1X32JE5YDuJLJ9VYwxpOa0AY6pgGTLh%2F%2BA0tGlGHk8HST2oCTEIDJu8Yoh6GTK9gB7MD%2B%2FAeIWWtGgbfifDstkjduFJ%2BXsM01b0%2FhxcUrXCo49UFYM7qbmb2QVkquoSctqidYnbjS4%2FHTjDXXnxDf4%2FWwJVNWJVhMSSFEcmZkFeQkSz%2BTaiITvBmLFpo49%2BmiwHgiww9oPgAo%2FOhLwru0t%2B08sDBMzZgULfNVFSda1vz%2FHK3HVIusmO39&X-Amz-Signature=611f1702911630d0287fa10caf495091d52233cf902374dfb8f90ac59e31e63d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667DHOFCEI%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041915Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBRYWbNVaSRSEQ9pGTu4BYBipqgx7hVe2Sj7niN%2B1%2FASAiBamoeiw8KAkLQdPM7FPDBeRHGlDHX52twC0IBxxBE9rSr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMmsiXJxufxSwg4ETYKtwDzEfhWun0wjQNtu9fnehxqNQBmzoIiQUf8OAaQyssY2fpqUd%2F9ZOxZytv81mRd4kclW%2FUZTgAgZ9JIt5YIiJ4NFKmUHwyh1iC77v5fdPguVoiM00b8JBsf1%2BCZJQs5379xOYbbQhLSrILsoj%2FSWCZg5PzOuUen73kDdx7J8kdqf2%2Bg%2FTc68bwjsP%2BW0guB%2FVkOSMpuz5gM9%2Fva%2BYUscS%2BVENVgwsnM%2BXxjQ5y7VSOO3kBvzC%2FavIGonqG0lo%2Fcuq4kHyADJwOup1yIAWxH7HGhixm3wAqI5%2F3jJLIL%2B9etvr29%2BJ1nlc7xxPX6KKM%2BGKK0LvA7f3uRySAhs5LjY0drnABYAUczXeJS2L4yyHFEyq4oC5haWobxSigbvX6dvD9TqbRADlLv016DPvvqbgkd9z8qiAgut23wId0UDj%2FMTmrALcFT0xGCi7HKDk5oZXxW%2BbperiTRkmsS90%2FeyKqWy35GfoQEFBgoGGUcQRFc9pvCqbK2pHqbLPwEx4nwafhS%2B6IZ96qa7AhWau20wisyRDG78vq8Ts7zjndTysBx5Tug4pAlb7OrIrs4M3aK2KHrV2H%2B8yUSjaM97lq37noeFEsJy1om6etDain9usq1yaZxnIJkp378vCCokYw7pSa0AY6pgEdyNKjGDIMLnZ5ceYUuK5mUTputWTB3qnmAcipbJTFBQm88%2BjLe5yBy1gaLKPqd4bugi44S6jQDITZY6FVHBAvGYdQLCpF7y9hY0wg4rupuZ2iUJ3ghST6QEg5ZuWZvv%2FfD2X3NwOa6YxPVvXMYBKut%2FKYLaailU0HfwbCUpeIH5g%2FkcFAEBhtOXsUteCuQV1%2FYTapRxgXWw0OYyH4Owc%2B1hvwjnr3&X-Amz-Signature=4b55f183eff2aae1cdead523741ec66d9f6080e78202df5262be8f61bddd5aee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662HF6ZT5Z%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041915Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDyplglVrIRvkTn802QowcbeIzrxu%2B0nAaiLrX7ksm8OAIhAIJrXXReXypEv%2BPA6MnbOE8WyeoeScmbACxt%2BRzPvsmEKv8DCGwQABoMNjM3NDIzMTgzODA1IgxI%2FVXve1wokWfMEQAq3AMcLOEprnQViHoM5qvOvH8g%2FxLBbWoVJhJY8ZmVNW3cZlhhWeTzRi%2F%2B52y6dfY9lCkfUSoasJJgvIgeOy5dHAWIRld9sWgGJD%2BFxNJp4y2RKTPBZlNOGb1SRuXz2Qn%2FsSUOTQD%2BejoC1stAwye7SVNnn%2BciCbjWQPxSzWoCoXQ4jqajE6ufb7wUo5iIvj6ak8u6hCLmPO5J3%2B4fZYlv9vV1T1EOssNRbULZPyLV5QhlrMn%2BUrMtVNG81YE9d4rW1WKgtZ4akEpuJGl%2Bazn0%2BIHcxkgKQfAgIQ7IA1Grw16uefP71f4%2FYeapjbh51RZmGnEkVWG8muCxbjhPuuVF2bQX%2FgMnyUW27DoLbx%2FEXzB9EgQzRY3fYM9fpPYBD2EmjPPRna6s%2Fi49aYStMjXnN0G%2BybJq741SVcXhGB03xriqCh%2FdvoHQB0wP8jbUbe%2B427YO2eK8%2BtAKrmxbvIDTRf%2FMBXJMARt8QjFFek2a%2FpFSXeqhM4T5VoCRbp4AafJd0h91gCW4HqCnoSTnQ1pnJaQQ%2BNSpjoVzDqB%2F9scnpD1P2fpdA3QXFd0tHB42d0SZQ8lq9ghi58RVqaaJqPlGuF0%2F0J%2Fc9osD4LsVMg1KnxQyhS4sIdBUDM3FJ7vVADC0lprQBjqkAS2G6NORB%2BM9%2F9CIF2YY9wENWLQgDwSbDsN4Z7baDNriNTlvytKqq9UVQys6fqyyIAlszAO7GNW6M0AafKZIiyp9svE4yiOhQf09r7Q9IccIj1QDlcDZiU%2FA1ZdEr%2BapgDjw9bC6vAMuYhjYI455675kmFbWY1LpRJuEhtkny590jDxrAtAdKjJ%2FGUB4nckBHLZVt7RH7Y5Wu%2BwlIGZmZCW5SKRr&X-Amz-Signature=44895ef88779979a53f3597a226ca1c3705aa887cb1912e7b4df6cd302721dc2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662C56JNIT%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041903Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC5Pitnfa0w4DKa2QF7MQQxeieYtUMAO9hT7L2MEkOEewIgSqMv5l%2BI%2FO8pp9yDlTcTnWBTSbU2isnE1VKlzHyRV4Yq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDPBW8IZDZVN1u0LDAircAyfdjNNS%2FD8Q9H9c%2BsfPGG1IG1VQT9zChiWt1mGfKmqzfwB6P%2BzzRgoe%2BmdD7HNO%2BRbSsnOyyjkdbMU48yCH2pmrh89Bb5ztV8%2FxRGhUkQ0NRafS%2ByZSaOcD9Gx%2BBy8s7HY33qzTHsQXoOw3K2cfLVkCHWGHDDcUr44GgwEtNybNN%2FE2aC88dzkAdi3XvzcRIwK8yrk79UuDRQmen%2BocmS6Yjd8MdmCqkjbxBZYT7f%2Fbi6gYu7RIi4te3L5uZ8bS%2FWN0TjmUUHp9dWTUTa3djd2xbL%2B6HFMqRdBF6GVJcvGN18fFIg6qRrG45ytjnNUeqLUxynGyuEqcm%2F6kUeKdv4MTkVJFqevZ3rl4KvQHdcLA7I5mbhgmjkfHlUtv3CwK%2B8kpLKiWOczhBbwPQF0YlVnMiHyMDE8mSBMsRxuu5jUxlFVmB2QjYRebjd8AlghF1hp9YHdL2%2BsTTdC%2FnaYVxErPkBjGJdFF2fpRYyVeNdVkWPWNqnkcuHBTCsUh5%2FvY%2BNLcO4BMhohoSk%2FtiYrKTib%2BpuwHagzirnk5YU9tcrs%2Byo157XmootKxGPerf5syHXpJceQ6AjEtdT%2B2SASDYnXrC1CdQV5c6EgtGswb%2B45qZjQ357vh6d3JX2t4MICVmtAGOqUBkgUgLkrJIfoL%2FCS5zJP0IBFrgYL4qC9%2FQOzR3q3G0ahN7YgdQydBsB0mK3PLG10WSd4%2FbI2mTlvT1iTMeBC56YJxT2tdHSq65pGOP5EcXpJMpM1KsQYgztB5pJgH9i85bm4GUS1JgEAer6jsnpf97jQRNerXT4hiTpiTX0u3wCvXKuw%2B9WzO%2BYtEtIdxO%2F7tm9LaCY0Eve4ep4pOP5BXBmQUGkuK&X-Amz-Signature=8f6bc75f2cc29d0781dbd44e8803abfd3fc6a041d6f6d5cada91f4fede997c2f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
