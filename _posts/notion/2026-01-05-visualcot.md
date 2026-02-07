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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YMFCQZOM%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025035Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4M4I2mbWVX5P7YCd2P%2FIYTlpACOLejR%2FLQnZFdXl3NQIgJK6KQZYPlB0n32BWjXnCxg7bHJP%2B3trUfM8lEOkCbIAq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDDrCYprnFn9BqD5LFircA7HXQEjivmraXBUw%2BQlC6Umjc9YcNOyyP5HwKeAkHrpnb2eLM%2Fx8JzB%2Fu6kHLKc7t5EaeiUt%2Fl8671aNmXO11CSwLsAZi66D2pkmDlB9A2H3HJKhvHlrh%2F4E6VJmuBBL2SfHudHQNBeKyL3Mzyc%2FyNymLx%2F1Pe9rdA7aPIbj3oUYSDfYep0P9Tw0IpnEt3quxHFIk7%2BfQutU7txJtMl2BOFOGI3KOQtqKlLMNtuNQ4zPaTJ%2BXc9gMdlEDrAV4WqcwNNj%2F7R9JAPQk8VqASeBraLXTjaEodstNiwi9ZzG8UHztjjZvtk7%2FPRD1JfC4oeKv2JsBKfkt4FX9DouJ1pjF2W0pOk75J7WxI8jSTHZU%2F%2Bfy9vCE5D9ac52Qo8beCrdWFvnTkKQmueVT%2Bu%2F5R4FctpUu2m1Owos%2BmwyTuVWk4OW4brXyGPvCkvIR9uPN6P9gNuCiBefi%2FaQ3qGDvMokoEWqAIeNLfG5uWnzNrVckTtQdDY890GElutzLDAysrQrO5VmzS7LtTZrWXilpFQa2ukO%2BULRWpOn%2FpA%2B%2FXZDE%2F6K6ETn2hwKjmUy3tF9nSYUFIg8tX4%2F3mtWIaaPGOXHwA7Dh6nGfs9%2Bsn6WrGQHjBcZD606TeAP7aaiMcfHMOfDmswGOqUBuZBId7O6OmZ35b7tXY%2FGb7Yh1fiE3w7w6wr8eG0Mr175c%2F9JrYMhuQGSqFixkJqy7X4t9%2Fa0WzcrmaR5asEsrhAconu%2BFaW8%2BmxP9aLUwg%2BuS2VqlSYZM0OwcOb3W3%2FkrQcmpOzLIXJqb1L%2F1KDw4sZSKBO3tI03qBXtrd%2BzKm8hjDb2t7a714R8KbLCb893vTzt5ngwSuOWyoW6oFXkSa0xdjIx&X-Amz-Signature=bf3357c0285abe388ce61109792519d8f88b1b13d060b5b8a88faea55a7472ba&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662N7L4AS7%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025035Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCZX5qJrEKR3WR17R4Xp%2BSAwncB89cNsCb6cJtuvQpvaQIhAJepPyTy5usrs3i588wHxRpZkp94yKm2MqzovsJyzUHIKv8DCFMQABoMNjM3NDIzMTgzODA1IgwYQCRJHCo7QYTW0Hgq3APj%2B5zHHYo5C9%2BsrvOUecUrVyr1MR3Bxg%2BGLfxvUyHOyUOJ9gswClzIHzASAwY24QCqPPdfvSuGqwUCZDWcZYFQ0hirjyHQdb%2BmznLlyVXFv6QLWLqYyi57vzBCO%2FycPLw%2FhBe3qeA6Ct9ylanURMRrRk31frW7rVmSzSUYGhL23PkQyzWEFhjwxHflz7bBQkZ1TgfnroyITOE9%2Bb3mFLVtmAvSXf%2FSQ0wOqw9p8uvZKuONfPXQmlaoBnT7aqIHdqRPhTLOR85tp6eYgmasAkd2wM2sZcs9IlBpUcYAcpMXafzI4M9wOpw0hvuoOmdi4MYHAiAJOhE9%2F%2FqKCvcjm07oiaV41iUvOtH0Ke5KkieiauIQU9WYSOF5rXbRIMuJn4qvKgzB3wyW7SvTOfI%2FecgRGTwV0pNhtAdc4U3JR0Ced%2BNSR98GWOXlwB98QP5v2Oih8jdOPQZUwaqwiDhxysB2sjo8cuiGsFUIIbdS4NDu1kEyN0jDJErGxp%2BqDhG7diR2cO2pT6HeTt3coljbdhaA%2BVyWlem1qVZwFk%2Bd45uqyhWmipq4SGENQ4bDH1T2Riu%2BBOwvodm%2BCFYRtjnGqX6Vg6wSl0HQauqKlFERq80iPWt67Tc47oyM1M7F9jCBxJrMBjqkASnlCp1rvJIBG2bj2lo7RcKOusnQMbPcWr623nR0MoJWxPDKdAwUDNCGLV3R30UpsgOaNI9Xdoh%2FBpA03V1P2dg1B9gcvg9nwUr%2BBneiUgbnlg%2BVsWAV298Yyky0nb8hISc0ARLECvG5qyslCFAq0fhYM9fMjtzSlj5nBbt3zoctmX4R9eELFHpazOS1WY7fVGIX9VMo5N0oXUGriTCnwD%2Bj0HQn&X-Amz-Signature=bf09277638dc4ead676e98d7c74dffa0b8a18129e3a7e8f048c35259e36a0570&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UBIPQHRO%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025027Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDkUToy06r1bAKEL0FfpIiKmG1oCI9vlOH19CFBgo4aLgIgb%2F%2F8P3dkjL4iv42fYUEfUOxWsLzVdM62IQscrCg6WhMq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDF227S%2Bwd9miISJ3gSrcAyYC6igUBbbnSc%2FdM4mxG1HMeIFUAPFcU36iWMsp92WEywnVzX0rBJ5nK84Bm6Zu3cnTNK3kKCgIR8lb7KLiRF2ItsVgR73VCEojnjKiNLtDeE8KY%2BM1c1GdPMWBsq4jxTGHS2SAAyne8Jf5n6ILZqByiFanripYS8kARv9RWsyU2UFMj3Vrh%2BUSXkcOJswvpT6973QEYSITm9Cey1GMyN9NcfhfNIfmfeLCoV5pL4OD1Rxfyu96DLbJF07fRv54XGbl4pve80gb8UFW5LGYM1%2B%2BMi238Ko4B5etd6YNkWzlrDisPNh6LuKxQZ1xsdeutxV25hmvaYYiBrs5xqkKiOd73pqHuE3uEltXVn7HBp8C%2FIrHz1dxMbFEvnbaARtW6wVm2Ij06rGrJL%2BUp8I%2B%2BmnTqMt%2B7EVepCvjKxKKHzvN%2BU5tCyF4UWtW2f6y3p0J4qDK16xvVjGT5uPnuQdCvjdCVxO0eYR9pvooT%2BrhXYC76Asch0gSejXdEbXDwPamQwg7MRjeRA5UbOUctowdt6tS8vJuwq65U6skFV%2FprI%2Fk%2FwFzJbb7kUXxj6zH6Z9%2Bm9194JGe7aCuVce0dsFK7pQh2anI9JhSkRbgnKuFJCT7YiCeFU60bwFhZWGlMInEmswGOqUBRgssI%2BRabYBAkdhpzDxsXLWWHrAZvFM4brIJ0SBxTYQoHR%2FS0q102Ko6HDF0j67HZNzaV7hzJ8v2ZhWHPhRzs3EBObbuL%2FXQcCMurpqOF3C1OBvSmGXkpFht3AZ5Te8kPi1j43sw6o40gd39pOOcwEcxyhD8yOcPL%2F72jtkuEDAV3ZmaPwlGotYC13R379byVwR9LYgRBjWoLY7OUZp5PLqW8Fhq&X-Amz-Signature=924901c03387df026e6ac404c75ca78ce85ac875f86396ef3de9800a8707ecb1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UBIPQHRO%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025027Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDkUToy06r1bAKEL0FfpIiKmG1oCI9vlOH19CFBgo4aLgIgb%2F%2F8P3dkjL4iv42fYUEfUOxWsLzVdM62IQscrCg6WhMq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDF227S%2Bwd9miISJ3gSrcAyYC6igUBbbnSc%2FdM4mxG1HMeIFUAPFcU36iWMsp92WEywnVzX0rBJ5nK84Bm6Zu3cnTNK3kKCgIR8lb7KLiRF2ItsVgR73VCEojnjKiNLtDeE8KY%2BM1c1GdPMWBsq4jxTGHS2SAAyne8Jf5n6ILZqByiFanripYS8kARv9RWsyU2UFMj3Vrh%2BUSXkcOJswvpT6973QEYSITm9Cey1GMyN9NcfhfNIfmfeLCoV5pL4OD1Rxfyu96DLbJF07fRv54XGbl4pve80gb8UFW5LGYM1%2B%2BMi238Ko4B5etd6YNkWzlrDisPNh6LuKxQZ1xsdeutxV25hmvaYYiBrs5xqkKiOd73pqHuE3uEltXVn7HBp8C%2FIrHz1dxMbFEvnbaARtW6wVm2Ij06rGrJL%2BUp8I%2B%2BmnTqMt%2B7EVepCvjKxKKHzvN%2BU5tCyF4UWtW2f6y3p0J4qDK16xvVjGT5uPnuQdCvjdCVxO0eYR9pvooT%2BrhXYC76Asch0gSejXdEbXDwPamQwg7MRjeRA5UbOUctowdt6tS8vJuwq65U6skFV%2FprI%2Fk%2FwFzJbb7kUXxj6zH6Z9%2Bm9194JGe7aCuVce0dsFK7pQh2anI9JhSkRbgnKuFJCT7YiCeFU60bwFhZWGlMInEmswGOqUBRgssI%2BRabYBAkdhpzDxsXLWWHrAZvFM4brIJ0SBxTYQoHR%2FS0q102Ko6HDF0j67HZNzaV7hzJ8v2ZhWHPhRzs3EBObbuL%2FXQcCMurpqOF3C1OBvSmGXkpFht3AZ5Te8kPi1j43sw6o40gd39pOOcwEcxyhD8yOcPL%2F72jtkuEDAV3ZmaPwlGotYC13R379byVwR9LYgRBjWoLY7OUZp5PLqW8Fhq&X-Amz-Signature=46a2cd6f1b910a5e6700d819a04e942f7c9a8a4bc571e94aa0410fef998b2362&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466URYLLPIA%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025040Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCBNq487LYiEWijI6unQmrqorW%2FDYqpQuMW%2BxY0Ls%2B5WwIhAKKzeHtX87Fwdg91KhQRzuROTeELwNrOJlfLwnkzLEMHKv8DCFQQABoMNjM3NDIzMTgzODA1IgwNa5f0fbyVpH5XWbAq3AOYnz3M3J0ziKgLLXK5k4pt8vWl%2FHA%2BbKn99m6dXau2TX5eCqmsfnSKtzWsoiUbbWE32xDdgoR4MalsGKYY%2Brn%2FxWcs%2FBdmNAANE06811xjma1cKoXAa2seFBdbQuCca%2FwuXCqYmZctyh9dCxhVie1eqsjOI%2BbScAniE%2BQUOG1nNASNDQIn77wdsrFgnZNjjAvlaJ5wWGqcjIOjbZ5A%2BxaZJIkMvzTDQESN6%2FGUobtAA57kfrF4BQCI7wxPiGaSx7QLyoGv4A6qVNNgMAJNZxmP7oo9jfX9X2D1roewOKVh8uEju8EOp5Qu5NoMCjGpKtfZRxyv%2F%2Bm9LVyAWOT%2BhzNpnuLfswG0%2Fet7avqY1ZNuk2khBsyhoak68NkLBuNbw3oTnwCOadk69fbmogDfxVgIg%2BgGNwn96nGSzjDNXPkFMxEPmqx8%2BXEHCqkAmSU%2FFcYk6%2FfbK7JSCXr33Fbb4kBKYQA4OpLNDntsTuPF2X0UZ7gAs91soU4OmSXXIIJILOGaotp%2BzpLx5iAT7Itax4g9WPQZ9mEnd%2FkSC9tH3kpMC6%2BccIgGGqzmPWa7igKEG2OGcxf%2Brd8H31hcTaDIzbf5DWFrF0liBR%2FvQm1oje7Vg1%2FLteldX%2Bwk%2FhIqlTCSxJrMBjqkAYnJi86IWHBmiGPzP79KhrRqGfChrfNxXM3SV47eIvpZsmwTwLy8vWE8gARsXcyXiJ9csjpTbC1d9ruBOiXelfY5z%2Fjn3P5XNmubujw%2Bd%2FTyz4Ugec8tcL7VwbF5hVgOtClSujwjp7tuQXX7PUmEdRZn013snefpr54OAtOVM%2BgtC7USwYi%2Fc7K3IGdSm0v2ruY%2B6uZ10T6WsVZwXfepcsY5ZuPh&X-Amz-Signature=5a71679d182995894d76c98ea69e0d478e5739c373c4d6f727b6813980026fce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666NC7P7J7%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025045Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHtURm%2Bf393zFpPieOiesXOTc2a65y1ntdmJPufqbWF6AiEA7Qrnb6EcZzgwP7DvU70BywxyTIULXJ6yuazJyFSRsZEq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDAjx6%2F5yK2%2B7jEXf9CrcA5qYbszP958LAoTbtIGgqpbmdCPf6LuSSy5tB7Wt9hS%2BJfZIMTJNapBB6csEoG9O6yQ1ysenkTEYPPuWOTDwh5oBgIpFqtfl4jojxh1WUEtnwMAF162G5sKy78L0HbRMcBk%2FYsJhwhBnF6Vjc471ySK%2BV0V7FedA6M3k7M5tFfG%2BN%2Ba6nPb4Cr1t%2FEBOcIoTnv%2FA53hLhoyT95j5kf0UOYyjuHYlMNUwVs%2BJeGoRwv3ErmsRfTJMiMVwo2DzirHs36A%2F%2BiWbpzdlO%2BTmGLB%2BG29vUp8alzERN7PGe6yqdNDVZSeJrs18Q2eGyKKzOabeh%2FTKd6CBithKmUNNcqI6GSwslyJr%2F5ofw5tTS1xnTGu8vR0BiApvHfdC5QshEdvbXC0NfhX%2FWIayuvzaR0rTFz5mTYVhCOSg2ecerBMGWkbbDYzoqnCrXaRGrh1j2anF4H7TadlXrlC%2BTm3kKEf%2FmdPWbvbBtUIcf9UNW3v1DrrH5AGrz3ZDi4j449IDPFFCHMBDR50hA%2Fn4NoyB3cB9RY8eHlmFQRZzLjzYLE0SXXd2pHb5YRYQxf58eyB%2BgX6O14fRDBBfcl54a3d9N1rZsd26%2F2cwTmE%2FTqVUYLdv6D9Th2avk4cyeNKStC7JMOjDmswGOqUBDpYB6pYXAiYfpVzLtommFRZRKJvPodkz5YdBa4YENjvYDsWByfBBp1zd%2Fkq3QfHv32sLsda4DeAFQ4yEvApV1GR23kozaBJ3nEHeaffJ9MCyhQWAwO0W3JiHRjz3JSUoZZ9SvsQeo89KDtph4VZJZvj08pR%2FyUcQfW4Nh6tH2yJIoutN%2Fyl4mHruC2VmwWLRArMiNgeh9sbeqPlayP44un7nSuFg&X-Amz-Signature=afbfdd288f61f23e2a5c67d54afa6f09202ff1f48cea25d3e58601cb69220c01&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VGGLXGIS%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025045Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDgbZCIGCAE%2FSXTuL4udx6fbbW5IWdXvyK%2FVpt9jzyXsAIgWxWPaeR%2BD%2FROz3%2FTKmpuXaq4dm4s6zaJVs97OJx3msgq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDKzY36k6%2FVHGuDpmAyrcA8vO96T9XD3fFiTyEo1pTG9MX1xGb9xvwTjh6mUJE%2F7ZjGFj%2B9o4jIZYszpmvOhfnqMNUO2fKvYLQVFzXfbN2uP8YR5QSNhcwLDJfIwKBj33ZvF87GRYxf4IOOU3%2Fmwkf9Ef%2FJwajE%2BXlam7AOWTfPt%2FZU7dLQQlAvg03AvojHoBmSgIgljaYj27%2F7A6sNWFC5D9wT384nb6BbEoRxbnKxHuZo%2BWgy%2Fz%2FhpAcdeGo4hD3vuP%2FXAXwnhzjXM%2BPR0JaNwoyV3nlG5VBj7dpDphQSv6FZNTjjOEL0%2BFQ1K%2BHedIiunVyb%2BP1sj7KFgR7YY5R7nb64uc3aYPbz7JIUXVc7zgVWYNymtJqJiiPu0sDN48RFCrihJEZtbQUL5LCboTd5SQQZtJy9bARKs0YDniWR0OVxISYRh6dZa7e37QPFN0StlFnuxtOszwL17c2qyiJcdSdTYTYqtjSFvfxLlTtrEAGUTE6IL9AE48kzTBng7mgyfv9Z7A%2FhwTEelvhnGM%2BaDa12AYNhYS2NbXkf%2FgVKJg21YjGYIWrb2fSRB%2BwtkrBpxOudYGK2R9%2BUs0ZSi3zwRpmSgsjAZ%2Fy8fQuj382yoP1RJWyY10l1e6aPXdDZg2i8It37JZDI61GvVOMOjEmswGOqUBW2vgMj2YkXCNo9s1ztNFldcaCXtduWjyEbVL05iGC7goya8YQ2Cgb%2FJBMv6dSdP08LDKm9A%2B4WjkoiR2WbYvVS86U%2FkjoV6a9hdaiCEsEYkh5F3SuDOgHElmw3nEhYStAoQEtdz1J3wQNEyab7IvusOebiTRMXoBMPur%2FDAADs4alyJkjcDMTjB0QNVEpXxWXsujQr08mk4UQ6AtaHkvXaa26vnX&X-Amz-Signature=34a6132d3f619cb6152d7308cc8128d113010329c0bc703efab29abb8512d49b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X7ST4HT6%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025049Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHp2UY85yKNWPQjJOV7TqT6HI2JT7Cu1CB2OpspJFqLdAiEA7ojUslJyMHYy7m%2BmlL5Ae%2FqoDVRymd2C16%2BvE%2BfRdjQq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDPxexzEzOOhQzggHyircA5uiYTbDSkBfIHiLgoHlNgrsmDoI5%2Fr0chLnbXLTqM7OlQIKFfEgfP0fQpaB45cbgH%2Bse98BT5KO%2F%2Ft42vmyxRP%2BlM32cx8fCuy9tbUCWsndJMWiFFipnBH%2B14qxv8R%2BNRlNyUldu%2F7FLOzK6j3jJRIvUl7wNul67Y6LaKm1SsFDeNwiiMHXtu746fcqs61gYp2f1L85fQ4QmftgunaXDXgeIT3DkFXXrYmpgMeQe9Nw6sXXzr0VzzRyZRjoVEangpAbmf9BbpUlGEfdedhvw794MyvCwh3qWSfjKOBjG%2BQp%2FNByT2S9wILpgcd4qGjs3b6%2Fa4OOKzVtXlrosyU48J2RshTyiWJeuIijl8pnE01xQkHL%2F92EeNnk4hh7XQve97QJVJc%2FThUBj591K7qQd809KrkzTwXhxxkmUTmwlmh4ife7tvU1eLOwAuOYxsIP3W8CnKCdR5NKu0F0s2KFqRcouYhBhMWNcT4OF27qlAxaFt6Ihf2eKjoorpaqIEEnUZIlVGLyH9d%2FWwMq96t3NwB%2BwpflGK377bjQwxh3%2Bt6IXdZln7conhqyNZhIr6MT39QT9iksjV7CmIjSRhKbVgClZsxENNFNP%2BClVBGWt6dMKU7q3VoYbj65QeyvMI3EmswGOqUBLWJ0lWCa0AWd%2FnXgqRsTTjGrQMhbZDT%2BWSFqWn3JjxFWVHRW1p%2FyHrVp69BxKttQMe0z3edkyIFXJmRcyM27XY3%2F%2F5VyaQTctMiIizsdjhuZXi94yvAMkOCdk56OsvixVJGES8itsJxtfw9SDhTrR6O49qU%2FFxuLXCT%2BvDVOWvL9PyNqc84Fa93kH7I7CjdVRWuYHAEZgkBFBAZO0CrTmKPOQuMq&X-Amz-Signature=5560d5250d9129d3386128b166d2b74e1333763addc607805271331e22f791f3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QCSWNDUR%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025049Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDI%2FVMkywKZMAHFLYMlFrxic9lluvWix6jk3b%2FtLYvIkAIgY3DCOFqhOjAW0IHMVuqZiUWR3J3nyADd%2FyeLq6iEl4cq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDLat7aLMeGHlQFjb%2BircA7WUqblO6ekqNRhCDknX2Fpsy6yzHWgeaZN8j%2FsVCjTioARPXQ%2BrpiXFRuWNgjUhU1Zo5FIwUtQmnnbZL7d3BIKKjVf2f0%2B2Q5DExXVilau7%2F49F3hu3BO28CfJJX2UiF5RqLfY9lDLOXtgovz0trJbF2MjShoeYU5nyweB5X2HpH0G21rPqHmpKsj4F8vjkosDonQzcTVWX4DtHW%2FPsN%2BxsNhONqPyqI%2BCmbb9CtzvAdtuLaAN%2FznmSk%2BUVK3yeixquXUfUnVr%2FbJGEGieK4DtYE7kbyzz5UtZsTPnLNahTO5YGIiWAGxX8faImkk2949i8J%2BftSGmMiz9Q75VOjLZpsX9onDs%2FikXMNHCF4%2BTbZuFcrqsabTDefOH9HADqyTVyUoW2c7t8SzrqTZHrVt1eMKI34KvngL57yrGvO0RJpd40NCg4w8RJDLotPTZKptAL%2Bj6U%2BjfiymdcUi4tS6IMVPH7Rf4i%2BBLtWiseY8%2FCXLgR85dCsEEnE8K4jugcJStDZWkd5YcqCHtqstWJyteJd68AX1Z8BxVAGGSmTPL98XZGd7WDa6%2BELTheUeKBWAXoW894w%2FKkkIgGHMu%2FNEYKxCLg7pxbrVLx8D8Ut5TkmIej%2F0nufcT2Sjh6MIPFmswGOqUBp1fnXvRMjdfgU4EaBvJKwkRofnQyZNDQIrfME166B3jIZevJNsjjEpVxJLIv6O9laQ3okuXUqYYQG7mJvrHLZH1996DgkeYES8tzOT7w%2BsHSJPZrmdlw2t%2FqnYp0uYLUlJSmg6F2NSZ0jfaQ3p%2FORRbL81z3g40WLGIPGz1GTc01kZYArd4V12YtphFGclAek9JiexpsrmFRQjvHEqbGRjkV0En7&X-Amz-Signature=0ec264b198c6574476c0c7e4e8ee0da09084e87df3f36820c4d1681a1d012d4f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UBIPQHRO%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025027Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDkUToy06r1bAKEL0FfpIiKmG1oCI9vlOH19CFBgo4aLgIgb%2F%2F8P3dkjL4iv42fYUEfUOxWsLzVdM62IQscrCg6WhMq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDF227S%2Bwd9miISJ3gSrcAyYC6igUBbbnSc%2FdM4mxG1HMeIFUAPFcU36iWMsp92WEywnVzX0rBJ5nK84Bm6Zu3cnTNK3kKCgIR8lb7KLiRF2ItsVgR73VCEojnjKiNLtDeE8KY%2BM1c1GdPMWBsq4jxTGHS2SAAyne8Jf5n6ILZqByiFanripYS8kARv9RWsyU2UFMj3Vrh%2BUSXkcOJswvpT6973QEYSITm9Cey1GMyN9NcfhfNIfmfeLCoV5pL4OD1Rxfyu96DLbJF07fRv54XGbl4pve80gb8UFW5LGYM1%2B%2BMi238Ko4B5etd6YNkWzlrDisPNh6LuKxQZ1xsdeutxV25hmvaYYiBrs5xqkKiOd73pqHuE3uEltXVn7HBp8C%2FIrHz1dxMbFEvnbaARtW6wVm2Ij06rGrJL%2BUp8I%2B%2BmnTqMt%2B7EVepCvjKxKKHzvN%2BU5tCyF4UWtW2f6y3p0J4qDK16xvVjGT5uPnuQdCvjdCVxO0eYR9pvooT%2BrhXYC76Asch0gSejXdEbXDwPamQwg7MRjeRA5UbOUctowdt6tS8vJuwq65U6skFV%2FprI%2Fk%2FwFzJbb7kUXxj6zH6Z9%2Bm9194JGe7aCuVce0dsFK7pQh2anI9JhSkRbgnKuFJCT7YiCeFU60bwFhZWGlMInEmswGOqUBRgssI%2BRabYBAkdhpzDxsXLWWHrAZvFM4brIJ0SBxTYQoHR%2FS0q102Ko6HDF0j67HZNzaV7hzJ8v2ZhWHPhRzs3EBObbuL%2FXQcCMurpqOF3C1OBvSmGXkpFht3AZ5Te8kPi1j43sw6o40gd39pOOcwEcxyhD8yOcPL%2F72jtkuEDAV3ZmaPwlGotYC13R379byVwR9LYgRBjWoLY7OUZp5PLqW8Fhq&X-Amz-Signature=91a6bd23a2516ec6a336dc252d398cde4d6dff0aa5c75937a93668f846b23121&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
