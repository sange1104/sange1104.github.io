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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UVF6PSJV%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJGMEQCIGyaGtQlhw5OGNbltV%2FOYqJh%2BY3VvzdfHcKI7%2BQawpIrAiAU3QAHQekYcPd%2F0Om2MAIH1RvNPqEIhY1cSoCte09NoyqIBAjM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMs0iZazvXNMh5P8UFKtwD0ZYmBsK0qIqdnJUg3KDkTfOxRJghFpJpVN1Na2jJMBU%2BtVzkv65emIlwBiMiDIlAstDTAeKI%2BjXdm4pjhrbdscgRH7iExENHyHSLfyPKH46yUgI99ULT0V3b%2BpEL1YLR2lQrrRAoyldWGSjO7HvN6tk%2FU%2B8xpMvBaMDxNmzKdqrfqg8u5qfmU7YnBD7OFuN8r%2F%2FYRdXmcDuDtiyT5Tv9p9HRF19Wo02B5WbYFuvpLKOmJ%2BmjI4cZy5eEvNEEXGaw%2B0kn61fxuakgxztiXT2A5lSLrOJ1h%2B%2F%2BLUsLEtu%2FHt4ZYfRA2Ixn0T3mW09O4cjwLbKDNSNGHMy3jQLaUiiZgnWi65xEKXwjFS%2BxEJvOIjBLANk2dPd72xEUPVN04sV%2BM8LWd%2FH%2BMySZ1v95dvAmTE8Ks8Q97hTxpJq7ZgOMANQ8fqWBDgEPaa9LNGQq6JBrqpr1pTUl3J2NkdgMEKetEzXGIswurMecYfkBTJ0sL18A3C62gFbDLW3yRz7DKH7K1FvVYu50QvnoNDIs6OxBzlVbw73%2FThyNa4VPY1qpA4U9B4VSCutR4S%2Be1jHkf4eKan8Zwm3BqPoKh6o7j6MQ649lxtbExio9rDPlRp1sLljFiMsyCpvsNsS0VPwworuGzwY6pgGFy2uRhgKxvZlUK2U2eKj%2Fzpfwxva8jHYFLQrlM0X2j%2BU%2FdXNd5crzYunpKS6CbI05dreyy%2FJ0LUIj8UJBR21Hz9CDL%2Fq4ncrvhewhtQcwEHZ9T%2FjN%2BRoa31m8Bp6NGoNETrHN0CK7dz1t%2BwvmQ2LD1qkCeFPqhAglGfNPWpLXkdIUaXLHx5Do3sfO6q86zVYbxibWJJUSykXCrJcduhal8f7R0WBU&X-Amz-Signature=61809387b14bda8334f138f02fc0990a5339d2b9ef2181bbaacc41a4b2e16076&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666XYGOU7L%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJIMEYCIQDIad3svWly9fbt%2FVLAjaaCKY3RYL%2BL4frU4lKgIlyV2AIhAOhtSjPXB6Av46OIywLrHPISCBzH0Hjo8xDTmiLf%2BqlTKogECMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwsVc%2FJoUwn05xYb90q3APMWtm3EAYKK0yvLfEJfVlwMJY9Rhr8HTpgMmZwWMB3TtFmdkg%2Ff9R%2BhbjlFNN8zmjY67ihxzuiJatm13TUZ2IKl3uWs2SKEhQhtHreZJ8sWn9SO5W30GpZzLEENQBuE6lBdWF0RPejjVkD0Sb4RmUOeUyFGB4x9iTcCzgZ3f%2BqxKqXqzbMJ9ZpIPkXnWj71BwFZ8bgCvfKN6zMef6kJcq73HIZ6u9jFDANGdgzuX1BdqihCdrjoVUlFZ%2FNPL19M4SEHeQbu8uDrdonXO39v56wd0FutJ%2B%2Fjzn7lih0uHptebCr7dEKmtZEkF00%2BbyHwMBwTyujIgOCGu00hBCmx73Wk6G%2F1HhP7R%2BtdsNKuUozs%2FZehysASDgjOqJw8vrSsRLBlSSoVwkDSM3UG9QykE%2F%2BR8c9VIHo9b3yxMU67%2F%2BgqpDpIkGzJ7i8YKGQQBYxGN451lAQl5J9YLsOnUDfRmRzQEi4XfzpMxxPhWhs8f3Pg2ecDJKpjdRCyp7%2FwJYTdKctghwFrlMO4vJstjjexwt7R8CPlCU6jzlMqDLdC5KgVtc2sDD92kbdBRBbmUabGz%2FD4Buf5UD1crCzoyGh0JFvbtdTqmckEy7iK4NDLEz4Gq1yqc9TONzFEK3DEzDAvIbPBjqkAQiAW8DR%2B28QrN%2BBnd7yeGLbr4jUSxwRKs5NdzpUxlwOUY96KO7Ae2S8KyaAmoWoGZHgty5f0A2wIBs62fc35fmhWyuLnX%2FsySCQoTTTNLjPla7LpuOoOIsvV81nFtgGfatikc9PwhO02e9ejhYT3jOiHHwlKAfqkXJB%2BjRxgh8aFFKE7VcrUu%2FiJ4%2BiUcJlCvK3KHHCow8xSeZTeqgDZvsfqX%2Bp&X-Amz-Signature=22577b52cae7f1094eacb6d25c39e8a71d35f42bd0840c3d180a964eaee48543&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667KKWLKHB%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034717Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJGMEQCIBdufDt7efJr1zbf%2BMMOFu1QjRBW%2FvkGdLczcFiAuX3MAiBR%2F19pbG5B4UkF15YCyF9n8XJB06enj%2Bgv4K63m%2BRt4SqIBAjM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMOqtYxqoAsSRKWSLBKtwDuHzV31aMKWq7XZX7hmib%2B4PC0b28DmNOAqVGdf7Fhy%2FJ3KFZYay7KwGCmmPTyc0E5ZqVxgeKUv8Y6FVc7g1d5ueuUyqGnYYKMJL3XRDui4rbD2Sgfa2xSavxtKCsODrMD%2Bef36Vf6AcvAy%2ByISKR0wSbQ5vxDbCkT7PlEt2OEe4%2FN%2FV8j%2B0sqOnEfmwaP7Qd8ZyygOkGeBfra47vj%2F428OcUZaE50huPKeS80U2AWztbtoAQ%2BJ8yYFj%2FF6QrKnJPfHGjC71CfmY3I2eL5uwsdJ6gzZg%2FdKB9680vMXgIYgQosWeqAS6g6oqjBuJRFyOSC96xdQISrd6gBgIh9Y1A%2FioUGEpbTm7K26bFFe05w0Yvx8PcBGeqEelsE%2FYZmPecPAqqZpswofpRlXAH5dRQE5ceXWfK6LG4zuGrIxGSREzuQ7qJUFStYIZ%2F4NTi%2FLABoll2CpGuUEXUwJGJ41kI1n234%2BsORppoG1dSwwV1UwxiC1Hw%2Bf4LjhtcNo6bgbtketX3D8K2%2FAEWFiROnYYiFZvXDxH219%2Br54QZxyRo4xNCDLkwt2l83RO%2FcZIItO%2BncCEK%2FfpIfbAEQC3WBZmsptwzWTlsnrMm5qb7VbiAsw%2BPkdcHVe%2BmksWKriEwtruGzwY6pgGvcvRgAtGdCz2w9JTXXvXMRPi2xOJYqVtMSIohjuK2yFZQbXCeJttQ8sXc50kz7%2BkjYc1WVxMigoPfznLnbFXN6gWvup4vUcT60tBd0RGWz2CE2XMZzQYKZzrLbGn%2FWUrP5lEacAibSllHwVzgc2JhXsRTModrB%2FETofgoDmOerW6v4uu1Gchhi1%2Fj9WHUxW0TubiDHsog5WQV0ohPEig9wzMdrhVd&X-Amz-Signature=fad62205033d52fc2a9570465a35e50eaff30afd9b6efa4f08294c186f3e510d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667KKWLKHB%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034717Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJGMEQCIBdufDt7efJr1zbf%2BMMOFu1QjRBW%2FvkGdLczcFiAuX3MAiBR%2F19pbG5B4UkF15YCyF9n8XJB06enj%2Bgv4K63m%2BRt4SqIBAjM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMOqtYxqoAsSRKWSLBKtwDuHzV31aMKWq7XZX7hmib%2B4PC0b28DmNOAqVGdf7Fhy%2FJ3KFZYay7KwGCmmPTyc0E5ZqVxgeKUv8Y6FVc7g1d5ueuUyqGnYYKMJL3XRDui4rbD2Sgfa2xSavxtKCsODrMD%2Bef36Vf6AcvAy%2ByISKR0wSbQ5vxDbCkT7PlEt2OEe4%2FN%2FV8j%2B0sqOnEfmwaP7Qd8ZyygOkGeBfra47vj%2F428OcUZaE50huPKeS80U2AWztbtoAQ%2BJ8yYFj%2FF6QrKnJPfHGjC71CfmY3I2eL5uwsdJ6gzZg%2FdKB9680vMXgIYgQosWeqAS6g6oqjBuJRFyOSC96xdQISrd6gBgIh9Y1A%2FioUGEpbTm7K26bFFe05w0Yvx8PcBGeqEelsE%2FYZmPecPAqqZpswofpRlXAH5dRQE5ceXWfK6LG4zuGrIxGSREzuQ7qJUFStYIZ%2F4NTi%2FLABoll2CpGuUEXUwJGJ41kI1n234%2BsORppoG1dSwwV1UwxiC1Hw%2Bf4LjhtcNo6bgbtketX3D8K2%2FAEWFiROnYYiFZvXDxH219%2Br54QZxyRo4xNCDLkwt2l83RO%2FcZIItO%2BncCEK%2FfpIfbAEQC3WBZmsptwzWTlsnrMm5qb7VbiAsw%2BPkdcHVe%2BmksWKriEwtruGzwY6pgGvcvRgAtGdCz2w9JTXXvXMRPi2xOJYqVtMSIohjuK2yFZQbXCeJttQ8sXc50kz7%2BkjYc1WVxMigoPfznLnbFXN6gWvup4vUcT60tBd0RGWz2CE2XMZzQYKZzrLbGn%2FWUrP5lEacAibSllHwVzgc2JhXsRTModrB%2FETofgoDmOerW6v4uu1Gchhi1%2Fj9WHUxW0TubiDHsog5WQV0ohPEig9wzMdrhVd&X-Amz-Signature=d56646c5e2dea2507de67d9900fcc0b8940b317c0859afca67440ce13585f42c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RZW4LCUO%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034736Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIQDA2ZIdgwa4nEPJsDXtejWtGz0RfsLf9tw49pNBB6dmUAIgEc67%2FjlUHaLLNByItE8CpamTNgLRPrIluKLNPPW%2B50EqiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPeVbKrZgwHG79lMAircA9AxvGNW3xXPLwmOS%2BiDLx4W%2FXu%2BVjrWFOduPSCcB202BmqbnU415lK7zso7GuWX5p6HKxUU9PeSM4lJGRvTIVAo08IHMyXbfjs8ShcoUpw%2BA8tdLscj9rbig9ec7DR8J9HZm77nv%2FbNnQvG%2Fbw4Yo3Ks1k0BkMWD3Uo6CPo7Kg44AwTqGFA4M4nkRjaMDEyRHQAQICFdCj0TPCMhqWRRPwUjvxr2sYyA5zCRnSAWhKmiMoj7pFkdem3F4bmUKrJre%2BYc15evhtgOXkscuIl5M9sVPHhpZWWB%2BKup3w%2BzfDZWSfMZsLzm202SESDmi4WYvsK1PkS2h7vnUX%2F%2Bc85j8KWyi2StMdEPuMWb3NUbtE%2BDHrHA1gEE3QBgmAFo8NnMenjYKnueCuidgwGWXGpRBLsedQ%2F3D%2BOnBtH6L3DDoha5%2Bu2XD0d6rIh9fRi2rfF%2BaTpZNRzw9clA4ipKX79jbuUM0YNwsduAWemHPIP%2B8GY3EfbWpoD8E0Q8OVfTkn6BEXS6zp7TmGl6rVB7wmK6IYwLPjbJGDicWSnxlNZBwe50%2BpzfztwituqZ4mZkkbK836Ag9%2BAbTffDrbYbwk%2FSKDvVoJyRNKUIeNyt5YgPZOueec4orDBXRPmlOBhMK%2B9hs8GOqUB%2Fezma%2FTzcX%2BDGOyDw6RVxv9Pdsoj44D4WdLw62lOFMEhLZIZpNUahlEf7WQqbhvyaJCedOAjDLgcJ5tstT6Sq8CVpVaFpVudCeelEdnF%2BWU9B1ICPZ%2Bhlm6Z6C5WvwZaveHcksC3jTrQQn9zRQ8UefeYESeO44oGmRMCso6r3KOVWSxxTAFNjxiMtYRSFOsPiC4afBeZR%2FLM%2F1Euc8lwotCxWrZV&X-Amz-Signature=1b9e23433122bff92c59552cef9ef5b39d4f2c58ab324eccf856d6b0d104fb0b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RB6WMZZ2%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034740Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIQDfTNGv58P0tKTYTqkcHgfV7v5DMmGmJC4L%2FqU%2Fk6visAIgMA%2BUEGKtRx6tbuElkoI3jKfxVhK04sJ67T9G9csE2WkqiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJnjH0MWV1SrN%2FqndCrcAyY7F%2F%2FJjktZBss90wy4M5No81%2B3c%2Fhyr1y5o1FEwhc0iTOBF7tLxVgwVWW9gw1qKcVAmrq0sL%2B5jVyVn0BY9KcWYHmDjQNLvttDZRMwwVzpzs5nH%2By3QiHlyAhy%2Bfp99gpqCKmiNINQD%2BCEGsO0EvyTRa7HrrLRuGEXM7b%2BKZTB4jkv0K4kp6HX9cpWjd0c8Ab4yGdcJ43KWg6KgQ8f0GjTNI6ILmL3YDEwT81xD2CNiSmX07akNof9vPaRWRm3eVsjfFnuA2pHCZtVfXQKhikJIoF%2FYFOSeu8KD2SxLSCytiTFmXihZYsy%2FAMazozI0G1bErHBwLP%2Fg7PRPH5d%2BJVjEy%2F%2F6Gk5XmPjJOPZLYJ8R1nHxzKMzAj4oqfw7LU36aLBIiauJErbAC6EiLfnN0CTU8DXgasi%2BOK3v8k6K9I9VncayZtjh%2Bzs6QDy7OVaonjSAiOGPF0Ul7PGQltIlp9yfQ2yPjoERIfkA69prA2A5SsBQAOjALgTMpWsFmIV3dKJZPH3GjdftlmsbVfdTx9aF48e%2B%2F9NstwEiLYwTFiSJx9rsdH6g90PDIwZBW4CX9OywKtecnAnIqthsD152LNHiJFEeOUnSrTNpU1uj4zHRwxF9kC0pquDspBZMKa8hs8GOqUBFCakUot4bGHslMGW%2BPwAeMDW8KF30d1BSysapFIILG5J%2BJRMPN5ZjDgN1xnRnnBCsOe7gN0%2F6uXwOQMWs1PnHoZoP1Pt%2Bq7X%2BmH%2Fv54Rlzp3v1KUmNazaWDvkBWX0xBGIk6CiyjiJASMgs3deEhCa6q0IHnGHExbXQcPnxaqUVTuxMh4iuyxQeG7b%2BydynChT6ijEHFwouuh7M8P02I1Si0h8H8y&X-Amz-Signature=56d1388655195bce021ee9b9e0a4dbd4ba1cab8b4387dd3dee304db2a733c427&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZFWAZ6X5%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034740Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJGMEQCIA4L%2FBm%2ByftZAlAgHUgrpId3bZ0Hw3bzEb6I58s%2FcdxjAiAHmrgWpxPEbOgebLPDBSK9WC6%2B2o5tOM1i3knVrWIYtCqIBAjM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMOzQ7qQf%2F0KtvQSiYKtwDzcas993erfGKc%2B4pAM0R4ebQah5V79%2BCnBT8Rbl0ttmhnKSzqYZsH2z83zjXU1AJFpmg9mXq308FZz1d%2Ff3QZHolT0GgShNyU2%2B%2BgkSkgbH7e%2FPFQxODwQsuz22hkYIh9Q9s%2Fqc9vGvvtKHOQzY1Bfd%2F12Ap%2FZH3teMa6EDQqzQOY9RQ%2FiqL%2FnQdzFrd0AIJn3Pd1F7zkeBnVEPz52wcnbW0XPrkPelpkQ%2B8FheCNrFCuL3gkhdAOmi%2Fz9eAuKvGesuUwCZhLeSziWrd9VMGu7csmWh67Y0%2BAhTEchnyLPsWX9%2F4DXJKr4ou1tfUCbNI5oTiw5zubH9LDXQbTUUSvGh7fHmAsYXRVKyFf2uIcVm9q0%2BNPAwUGj05iADOTrNoMIK8kM65nHlPpj7nhNZV6D94PpFTXCzI%2BrqFML59LYOlaUexFlTtc6AcbBdnQbnCGsrF46by8KRmsZLJH0oSawdDno8MiZHQF1T5Mt9zIuFN1hKqa%2B%2F7K0kUI8pZy84Z0DNvv72LqcQj5PjuUpkZhExbXIVhBNqBZah7Zx5jGlhqE2%2BAo89UJRFwOX2ZYXonOz%2F31ybVvrBjjbzRc7RmXsjIDvnBrP7Tj70dg4qcz5MWmebxB3lJJVd7qDAw4rmGzwY6pgEWaZkH4anmWulHTGoyHDxPiwr1Uv45%2FzGo81V%2B6tpsk7tS4JAKiynm8l08e9IK66nh6rtt%2BFARCERRbKUDRRjzdbfZI8WlHI5ie%2BjBfdL6d3HpT99gyc80E9tX7q6CjgzzbXgHZuiM4cKaFmTBufDZEUavo2pMKf2JEKltUIA4smpyOHu0u01nqKyEz0E2UegSbk3tPnAFr9qaYGmVrxDRnB30061q&X-Amz-Signature=bf165a11916ebb2df1658baa2d088ed0f951d1766d65b7b5ba9e1b855e11a08a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667V335QJZ%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034741Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJIMEYCIQD6p7B5xupCMOdfMpHZBmFAMV0Id36ipy4XipouzAmyGgIhAIw%2F%2F914j%2FnIx2QEb0%2FkRTLjrfmDF8KDPJ1madMwSW9PKogECMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxckUou3QhGCVl1HSoq3AOmgkOICscvxre%2BBG3jTLHgv9IiSBYVUEcV76yG5rEef7cNC6a4VAEFsVgr%2FfU6CCOnzOrphrsMJnHjCfapSlqAZZAbCITAmv5xPiryDS9Wt5USB0KKI5JCQ0jXtNgnrID5Qo9JCsgxv0%2BNETTllmp0MiWipyn5Zgqg%2FQYfAqfYMwHEhcTh0kH1x3oCuixTnHhUUWB9HEYAOwBSVhgx%2FzCdfx34rczMCVnd%2F%2BNsSO3s6mKegUcgPqUzG425N3bB5CuZkBcplSWb%2BXOml52OtL8oSvpK8Y5%2F0HkxkueCw%2FBs4%2BKlaPTNwp2TBYnfTt9%2Fu0SjGrBuwDX68T1ajSHx8xAkq%2F1UtpiKb7ZHlUVIifdhxvlYSadaekb0c2OQb7z96ffW%2F3IktfVG9YYudx8yOomGkZhIzjqK6CsGlVF0UGQSX%2FTMBzHg9PcoAPbmAlZV41LCaTMloc1gUmczk2lVjffHN3prf5%2BW4Nc18FvG5sOMrTE4htWMQDbdGxn1HbLfVqx7GbU7hZ5bqZ7QRQvFw53%2BLQeyr%2Buw3xAClNOrsN8Ax4xeomo8%2Fkr13ck2KCmzlZ5Zp%2BVPyzf6a4gOxZ2V8m0NTlWBMlpynCVt5iVorG1hdgLifXCPq5SahrL%2FBDDiu4bPBjqkAcMX8F9%2Bk2uiEqECLpJFNFgju8XSu1lSKhgt3%2B85zALUrWmWWQg532HoGDs6pBycA4PSclS6nbrwAGPR%2FbvU4M4IlDficqgb%2BSPzqukw9oh6JwgD3zqlOuSZ9DVzefHc0hBJJVcWL9kpLIj2w9oMFJduN6LpyQ12YCDsZVNW1Jwg8TE1zTtQhJgt3gDq%2B26%2BUF2pFvNp81OU4%2F5OdXWNbOdK7xHq&X-Amz-Signature=17ec3f0aa9905e95e51c7bcd414958af56269d25c41442081f82154662d4ce87&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UBOIDN2U%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034741Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIH3QExtnbeiDo%2BzJeVQFWQNQYz%2F8t8tjlsVaHN93f1e0AiEA8jzVfmqSrKBqCDjld6Ik539lhDmT6alAvtpdlqhcTpMqiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDv9XRgVvYDkAqIUOyrcA%2F9nGF8BToknCPaoVU775l0RjS4zAPF%2B3Q9%2BuMFNB3IHnpEBRSp5wlF4mhjfWMHrlPMsDOxD2kPHT5QiDGINpEUVtb5TMlZKyf%2Fdi8XArQAdPX0KJggnm25hNijQcFkniF5%2FpM%2BVoPnh%2BT2X2QZl9lQbzY0IFBb6sRse%2FrtOKqSYs%2FbeNq1VymSJUcVO31CgCmLmZRsNKt0EDtHAqJJo0t98G43fNjk7Pne4ZqLW20hVY2RTos8MR1vyxXXEft4EjwIQcIaBtcJcU0HnnIR4JDBddU%2FfkJ5dtBf80CSEc8R3rLW%2FFkOphhFpVk0YNbKdV%2BNREeQ2RO1ZkGdqYctCTC4t%2F3QlXnPlI03SaaLgNkR9blGCu91zNnvqfB7sD%2FY9RcxbZWYbi9xhW9NBVfbAMOKvtQQpmVbvGEyuV28NyCnOoUJc7IeW8cLvxbeN7bgAbr8Ib%2FWfirbMSQ9BTYAcEo4PQxcHJUzEj6Mqw89Tsw7aF0aIu3n6aGm6EybT0JjE%2FVl9cPMR5DQQ1cP%2BMoIdnh7RnA0ldPWMBdhd2KdE0OQernBBwNVGW5tamRYYzPRe64pvlFBpkqBS11%2FlMRh7j4OgDMvPncXnjB4ERKRdEXkJwHn42Glj2Wu%2BiXM6MMO7hs8GOqUBDjBoief0s3RXSN2yN8LijE6itlm3N73hFWgN4LCO5u96d%2BSQYf%2FjFX761K2a46Wne0QVhTGb651Xssl7nQCuUV1rQ1HI5WFfobgnxXVVsI%2F%2FLN2zzmX%2BTr12lycXE%2BuWk89yGr3Rkg847GbcSO%2B3x0r%2BinCpgX%2FjzlaPLJMd0mNxBf%2B%2B2CCKmV44Jjfnong0Vym02KUcL13tsmmp7fPacpbPr0hO&X-Amz-Signature=5de3147e0fe8e190900f8d29f312f8b01a716723de988f763bee3fc32bee0d37&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667KKWLKHB%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034717Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJGMEQCIBdufDt7efJr1zbf%2BMMOFu1QjRBW%2FvkGdLczcFiAuX3MAiBR%2F19pbG5B4UkF15YCyF9n8XJB06enj%2Bgv4K63m%2BRt4SqIBAjM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMOqtYxqoAsSRKWSLBKtwDuHzV31aMKWq7XZX7hmib%2B4PC0b28DmNOAqVGdf7Fhy%2FJ3KFZYay7KwGCmmPTyc0E5ZqVxgeKUv8Y6FVc7g1d5ueuUyqGnYYKMJL3XRDui4rbD2Sgfa2xSavxtKCsODrMD%2Bef36Vf6AcvAy%2ByISKR0wSbQ5vxDbCkT7PlEt2OEe4%2FN%2FV8j%2B0sqOnEfmwaP7Qd8ZyygOkGeBfra47vj%2F428OcUZaE50huPKeS80U2AWztbtoAQ%2BJ8yYFj%2FF6QrKnJPfHGjC71CfmY3I2eL5uwsdJ6gzZg%2FdKB9680vMXgIYgQosWeqAS6g6oqjBuJRFyOSC96xdQISrd6gBgIh9Y1A%2FioUGEpbTm7K26bFFe05w0Yvx8PcBGeqEelsE%2FYZmPecPAqqZpswofpRlXAH5dRQE5ceXWfK6LG4zuGrIxGSREzuQ7qJUFStYIZ%2F4NTi%2FLABoll2CpGuUEXUwJGJ41kI1n234%2BsORppoG1dSwwV1UwxiC1Hw%2Bf4LjhtcNo6bgbtketX3D8K2%2FAEWFiROnYYiFZvXDxH219%2Br54QZxyRo4xNCDLkwt2l83RO%2FcZIItO%2BncCEK%2FfpIfbAEQC3WBZmsptwzWTlsnrMm5qb7VbiAsw%2BPkdcHVe%2BmksWKriEwtruGzwY6pgGvcvRgAtGdCz2w9JTXXvXMRPi2xOJYqVtMSIohjuK2yFZQbXCeJttQ8sXc50kz7%2BkjYc1WVxMigoPfznLnbFXN6gWvup4vUcT60tBd0RGWz2CE2XMZzQYKZzrLbGn%2FWUrP5lEacAibSllHwVzgc2JhXsRTModrB%2FETofgoDmOerW6v4uu1Gchhi1%2Fj9WHUxW0TubiDHsog5WQV0ohPEig9wzMdrhVd&X-Amz-Signature=825e21bb0a1d4eac9ca75abb793261ef8517c998735de86b71376fe98da0cd0a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
