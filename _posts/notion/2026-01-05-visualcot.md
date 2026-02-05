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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46635Y55EH7%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031108Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQC4zvsANOuTc7nLKTUzhMIDXEI7%2BpcNjvl7LOwcMyIo0wIga7PfmTreg8yiSCHu0K9EL9OwlkOQulzN%2F1D5LjFUkCAq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDEuxWd9ftOemscpvxircAxape%2BWfY7QqyNAGfbL7%2ByjWPeNkhHVb0EScEgVQZzcO7cz1e98BnAjbwhkOwer86GNppn%2BS%2B0uHJmnn646Udf49lTX0CqGqHezZXXrHvLqELoR9xJIXyz8ES5Ca1gFyMj0ngTiDWLUVr33xgWzTY7XHM3amPQlYwleT0a50MUeU9osgXTsdEUkIxnrJVsReTmsR0TBmH58IKr6GIIlG62acJUw8Img%2FIoDhPEATpKP%2FESlf6OVY3qXy1j5b8%2BSoIzUhxqdmurnUzCLlaoLpa67g3EwepQIS8bm5%2Fpmd2WEriT1AZejBlROxiOJBRwNxN3G5V235%2FLHPlmKozT%2FjhdyJBN1Nd9cduvoDERES8DQDEu8nVnY81yUwBzK%2FAB5od8reP6RCdN2Jq4np0zNcxpbOpZFARLCJ2L2X5tj0jHibGx%2FoWs5ADt7WPVbhs7fxFD1%2BW0eLBUx7pyOcJtHhWt4e5yHHxUeu8WsrGrCx5c2qoU4zL5pd1gngHSZm78pNiIwIDDhw9xDdfS51E4GFnNAmT3HmD0FoXezLHwSAzztJnJ6x%2F581zg%2BqSDGM3BToC8u%2FIj0NajUCGE7iozGPEUiRjju51wjJegRAZ0QXmMzyTc2ijAFSZjvFXYFAMOmSkMwGOqUBVhz%2FxbFewLWJb87IsyD7FpdrzEimdbyvaZVR6WBjyT4qaHbgMR06gg2lbOaUXwJlVHoxYhOpEALoEiCeqQkR3fGwtkmkUEMCChvp4Kfj196Vx%2BDAQ994FQFRU2IG4fEa7Wo5xGJILnOosFqq6yR6B74g0EpWg9AgHjUOG3GSlMl63snBCGfUHlM1NpTKnWIj61gzZvCY0Z15Tz9vTdVySPfzuTqY&X-Amz-Signature=2042bc758e76a173544c15e04a15c3339504152f4476fa57631527b453be3649&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663VM5X6E3%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031109Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJIMEYCIQDLX0zgnFY8sfTSwRWRTsRydbCb4Ap94FvBaJ1GdWa3jAIhAKGSepGni5XUYUhtfKLWf9oIXLenWWQQKLgsw6LXkoZbKv8DCCIQABoMNjM3NDIzMTgzODA1Igw%2FrF75Wau3FTMo6S4q3AO5%2BiwcJq2Ejn9MAQV%2BDoX2FVCcvuk0yBrwL6j8Jp0rha49T5NQz6cHjkrN86jIBNgjeaGo2vrgXpb8VZuzsOhiVbgyFOOGEktmMIG6aaLQcKy6jZZX98CJw9h7lvHhwGBk6XoA2CZ%2Fb9QwLFwz2oF0mB44Q2KrKuzqIHFONAWDITU53g5zhfbdJ3fVCD2q5bnoCzP1PNEuZcfaqAjotDm0eM0jcSV1bpTBr8TYJZw4feifO%2FdNj03J3qpHB4C3jpaKOBDk2gBmu3DU12pqApye%2B65GzMy1zRAs4SqczuPkd8wB6lm0hfNs%2FPToVxq0g8MsJFvZ%2FySde2xADtvI%2FL6Se4553qGG139KCWBNukwlRqqN0iWPnQK1h%2FmHlqC3ttNghHpPEcIOL5bW3Fhx0tzU1zTrLBvQdTAxszZ0DmHk2XbGW8aIVMuV4IOjIBVddBE1Ma25NUkEv14b0TStvz6ojcwfC9Od6Z30LZkYmm3lSrMPl2DwxpI2dbTHlUiHtE3HHT92tZAPWgYfhT6GiWsZUV20NZ6Zy%2FtSJOEtvDxtdED9iae89WSxeK5zq230uW1%2BZtyv%2FPQPYSShpuYWVGSVcgKYPkfEt3tUHVXzX4ALd3ZfqEzYZ3KaExKoIjDizo%2FMBjqkAUw%2FJ1%2B5l8w9Jrsf6skZfkBAA%2F%2BhFFieI6oJ1sHT8T5Bw%2Fk3t31VcMoyiV%2F5bdPEhNve5z2He7b5F9ZGjRd6QQQLs0RHVGJ%2Bzm7pGbPThgrZL4bRS0N8lQkaFxJOYxnXb1yY4QsLEF3rwpPKIGoHGDaIINj8B6k1PXOyU22XnWLJlC15eBUgSCqZ4J%2BZXYA3%2FAKFIkNYJXjUBzZ02LKGWNmNRHtv&X-Amz-Signature=f59c607792b06e8a53a99832a30af4359e09c2e50b4fec323cc9835aba49c600&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QWSWPEUR%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031059Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJGMEQCIBoRjIM7%2BlASj5cakOWxk7c%2FWzE5U9NXkoK1famb0bpYAiBYuf4baWUdxofx4KaAO3qtPtKXhBlg723BYj9U32punCr%2FAwgiEAAaDDYzNzQyMzE4MzgwNSIMMWagMEyl8gocTQgRKtwDHbMQ4lRguep6A9uVkNfIAyDl7zeWPmAUbvMBaPR7ntMOFUGVmv22AX81bVsQ3XJGlMw%2FsDUlpz8gSREI%2Bpe1IC1iIxywLG1o%2Fg%2FfeXE5tViCVnxNMvp1nyRUSmzHPSsPaQY0xZotbNRJXPAfYIL7q4jaR3yj%2Fvp6P806TIynW%2F0Ng4AsVxbm0vAFzv3BzCSW37p8%2FdPm8lYNGAqt5Q3MLEl10P3SGkUSJ%2F8GAopLhYvXvYFAx9WvtBWQIGmQkWZXPYJZ6FzwChgEUNaIuDOFqiaoioKK6y%2BIdmuUTFk7%2BRE1%2F12ytKqbH%2Ba6NMp4w5RtBATqAmWnew2LpUa%2BAOo8KawSiWz7ijpcGkZNzRr3VyRCAq5CSGBswbus8hg7J90Kd8FR%2F7%2BeNmdvJ7SQKEVnLERez%2BLylGIt7ak9mabUOdnd%2BvG8Fqgp9vT7wnOZeLuEwhV1qe48kkP0dejvGW%2FW9Hd75Ews3BaQ%2FiX2qjnlro6txyzEmr2lLgQjzJDy8WOS5KsrEOEj3wSTczwTy7vxvayJynmvaRmcGacZgMgRWMJKgI7MpleKRwvYq0WrVspVHxVFl%2BV1uzzxk0Atqm6GEg8BG52rNaA%2BZ5S2IaRThY4gz0GWyykSCVIhDYAwu86PzAY6pgGQb2qrmJ3W14Q%2BQVQ%2BYxoPpdqzlDWFQ6%2BX%2Fl%2BNpiIFb7OgWBLILbHw9fw57z4oquI5qnGDtBX9tXdy4sw4fKYhpkDkwl4BNESbC5lBa7JdD27EoObOrqtnwDLlulIXqq2zM2V97OKSNx7W6udka3kCxwaN1dyPKNpPXzbR18N4XYiIIZLVlRHqFLFvLBG%2FUuRPG4o2yt8D8VqxaZFTV%2FF%2BglH8LUkb&X-Amz-Signature=6086c44b14f91a1b950b0468748a3702badac27d6e3e3d4c15d6d3acd52a2008&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QWSWPEUR%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031059Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJGMEQCIBoRjIM7%2BlASj5cakOWxk7c%2FWzE5U9NXkoK1famb0bpYAiBYuf4baWUdxofx4KaAO3qtPtKXhBlg723BYj9U32punCr%2FAwgiEAAaDDYzNzQyMzE4MzgwNSIMMWagMEyl8gocTQgRKtwDHbMQ4lRguep6A9uVkNfIAyDl7zeWPmAUbvMBaPR7ntMOFUGVmv22AX81bVsQ3XJGlMw%2FsDUlpz8gSREI%2Bpe1IC1iIxywLG1o%2Fg%2FfeXE5tViCVnxNMvp1nyRUSmzHPSsPaQY0xZotbNRJXPAfYIL7q4jaR3yj%2Fvp6P806TIynW%2F0Ng4AsVxbm0vAFzv3BzCSW37p8%2FdPm8lYNGAqt5Q3MLEl10P3SGkUSJ%2F8GAopLhYvXvYFAx9WvtBWQIGmQkWZXPYJZ6FzwChgEUNaIuDOFqiaoioKK6y%2BIdmuUTFk7%2BRE1%2F12ytKqbH%2Ba6NMp4w5RtBATqAmWnew2LpUa%2BAOo8KawSiWz7ijpcGkZNzRr3VyRCAq5CSGBswbus8hg7J90Kd8FR%2F7%2BeNmdvJ7SQKEVnLERez%2BLylGIt7ak9mabUOdnd%2BvG8Fqgp9vT7wnOZeLuEwhV1qe48kkP0dejvGW%2FW9Hd75Ews3BaQ%2FiX2qjnlro6txyzEmr2lLgQjzJDy8WOS5KsrEOEj3wSTczwTy7vxvayJynmvaRmcGacZgMgRWMJKgI7MpleKRwvYq0WrVspVHxVFl%2BV1uzzxk0Atqm6GEg8BG52rNaA%2BZ5S2IaRThY4gz0GWyykSCVIhDYAwu86PzAY6pgGQb2qrmJ3W14Q%2BQVQ%2BYxoPpdqzlDWFQ6%2BX%2Fl%2BNpiIFb7OgWBLILbHw9fw57z4oquI5qnGDtBX9tXdy4sw4fKYhpkDkwl4BNESbC5lBa7JdD27EoObOrqtnwDLlulIXqq2zM2V97OKSNx7W6udka3kCxwaN1dyPKNpPXzbR18N4XYiIIZLVlRHqFLFvLBG%2FUuRPG4o2yt8D8VqxaZFTV%2FF%2BglH8LUkb&X-Amz-Signature=01d8c412a4ad7e4daf50ca6be3dc233151bbf90beb32329f4514427a94aa5a3f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QTIB64U7%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031129Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJGMEQCIFxrWGtaUcNgo%2BakA3NJohIX7EevqTOlQvk6IHFtjEyrAiAmyo7RoApzLb8HYnZFd0vy2pCnBOPV6ANjmvRxoOzxYCr%2FAwgiEAAaDDYzNzQyMzE4MzgwNSIMLkKNKa6vWVSa%2BG1cKtwDtMS5EQSfkd7NNxNvfsLsyGsERfYIjQnVoCZVfMd83AphUc%2FRiiZ71eqLPn1D2s0jRBcaiCkRZWAuoAOye6XCpo7UkpmYbeungn832k8eBEWh541ttwDn9HbaVkrXD2Aat%2FV47JD3dSjPNc959LRGksfzK2rZqMZ4R3qKUrS4xaQMaZC4WZgawAXyfnKFue6qWiOB2vmoCftirPAlprFtLbXFHv1gRvZESwxEhVpU4JJUGSXopHPXZyxW%2FOjrMwwJMAU3HI16NF9ziUjSO%2F%2FpeW%2FsyUE5ofmoJGUFKQgpBuZFtEGSW3N0zhLQe%2F%2Fl1hRVFQ7sp7IGjUrH4YEcFmAN0SSB0rZXf6gVAcJ59RV9bU1eageG10e7iOqP%2FTtTTKCzH2p7DWKLLz9aHMmSyjP0Oa4KWQCXXzuu4CBVmbFbCfcWPoF2Y8hEJFrLLAurnSOIWE66Nl%2BwtvXZCrEMv1f%2B40TLeyDlEg9b2Dp0H5cKSQQLxWgdg2C%2B3f4Nl841w40F%2FO6%2Fzci9rQGZFUyA9WbdZZ2FbjpV5iuGtpqAZ2C7u6gwYIRNmvbXIMWvIufkCrBPMZRbvo%2B2JhPZEGrj5jJqF4Mv03bmz4%2FRUKq6btD7m9HqtQf4W7RguiR1d2kw386PzAY6pgHyulFDOKNJB39aRj7P9rYpg3Z8nbuqxNDl3c8hl9KYo703t2pPc%2FcmkAtDhJk3pzDT1aN2HZtj9NsNLwKSCB7mG5Tb%2BnjPsQTqwFCyWLj86htg4vr%2Fb5gU6ztzVd0%2BQOxDkDeOetfpWS7uOjb48hijHh6d%2Bh0V9tIURmeR5kKccs44ZT5GNdnbTmMGASWfAUQGVZVNv0EdUrVkd2e7wOtJxfTzN46w&X-Amz-Signature=1ec1bd33950639362280bf3fcb842fb1dd4a7379bf2f144334bf9ef398506dcf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7MXFP3J%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031133Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJGMEQCIDxFSOUgeWFqtms3HFF9YKlugh3VinH4Bg5hYmlakUnLAiB92ndEnIy3nG7snANsk1m%2FT4Z6wPBGKE8hT0oV0YkgKSr%2FAwgiEAAaDDYzNzQyMzE4MzgwNSIMVn6B6%2BSNM2MaXtt%2FKtwDmxmyBnEAaiEdBxHSPqXEeBK6Mb4npLzMLH2RK0onTG9gQCqNASHN7SPVzFtjS0yaDeSSK4qIMPiELfJ2ivbLBVuNRFW6zZKBrP%2F4WbN2GTKsq8qTQncOzRxtlta%2FXmuA80zN5sIh8ogPukAL3T0DKJ7V0zM6MNq2aAc%2Ba7ctiFbXQ4z0a%2F86gS1UwI3h2ikIu4i41fyVA3%2BIbQ7Bga5NWgW8Cd%2FIKIZ8jtBro5Z0hn%2BwlxkxqAyOMebLj%2BGoaMQX77M7N%2F5QAnsCmuuRNY6VE3%2BfbvPcuoXIjVCjKOJOP3SxMXAgdk4pGBQYG7Xnc6%2FKCuq9RRPDH0Fk4o5V93hNBJsYNUV8QnoNTFKB%2BRTbCkubM5r6iSmaXfCRtaNjJuzrqPh2zPOh0zVZQaKYCkj3SreRvv3%2FVjx4aa1tNUT09CGqShRmyLPYrpBpTOnQ6wjxMFR7Qw0WLp0zdwOPKjxklTjwaRLi3mpRrz9HXSALfGdutmG8PiXlbh4QBjXVjOu77WFKNea5AQGp4EkgVTJlHHTL63yDlrR9NUpbbs7xOsiGfuaL9Nf7bI97vjSKH3YlQvd1zeWS66Ifyg7YxGpIwwSgmciaSZJzgLRUnCOF2CaKJQhep8qv0AFZ5W8wiM6PzAY6pgG%2BnJnK8zRq7kgREJY7A7U7FO6vc9%2FEuPQHLOyAijQiQx8JMOUNKF%2Fmz9EO7NRLef3ItyeC43mOsqs5TMnXAdz%2B%2FchDeCCnS9ZRh%2BGVWS%2FiEDp%2Ffwoiw%2Bun%2FmRf34NXyEESG3M%2BCVSHXEvzgfhoX6RlRuDKfZuKRU1E0fCGNnU%2FGld1dVwScxgmrMwioGC3WEBkZimsyj%2B5FjcxC3%2BOkzkMmLPEhz1U&X-Amz-Signature=8e840b681daca284788626185c453d66a5be8a978c8b2a41d54d715c153345f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YJZJFTP6%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031133Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIHn7iirI9NFYNbba3SkBMNVqHUDNkiLBv8NfzXVXUDiTAiEAk0cLGeQ%2FMFVlAygOJVtLchTp6%2FPsQClA4tVoSbRroZ8q%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDLifQPnj%2BHKzo5VwMircA3HRkfxwys8iPtNPsxXGLahAs32ey3BKR%2FT0rog1djkjacDMn52NxedBAqtN6LgYPJBwojGi9SkQooutvLZxGI1iOdK49u%2BfaiRIN%2FeCCi7xoC83pvFAViI3QMAVbnITHcLEmorUbRXvr0WGOp5A1fNfw4R%2FBhTac3IQemIzDI1ZBMijCywTef3ZRMF8%2BFH8DHN06ucc7fEQZ323krjxm7lwNZLLEXjXA0K%2BI0JJ18JpMM2KTewCmsYy%2FeYbfd6Cu3k%2BPu3EK20CAj%2F6UPKMifIZNlXiCyMOFPAHUme9U5FaDi9S9mh2D9mIrL1qywT0LzuxT3SQ62T55Ndwhx3zcQavQcl91%2FCfOdmsZBM9%2B%2FCNdfYg4qVVwQaY7X7tc3wyGv9PUJgu%2F8qgTrFfMo%2BnvPcJwk1kXpUS4GzzgoV2hR%2Ft537j5P%2BPhN9ZC%2BWEWZn0qiNWymUIAjpSbNyUpd5u8bWiHXPInxh0jyjpu37bXmC3ThfukSQSxgIYTaucsxXNVDTIvXFDR2e5Z%2Fn%2BQHTUiDlVdBmNsfPRCho3FQOPNXMI4Hwzr7S4X97W7i2v08xjOVXZnkm3gr0jsUe2FnMlliaehzXjMApP4gS5B3%2BkaLlXRKaCNzOqT3%2BUQGACMN%2BSkMwGOqUBgVY8hFj2skN%2FGSgMYgsGe7s%2BIxKTN%2BkG2jGot0J6kAqmtAT58vmzOpLwXIaJjzBNbtvGp4aPLW57fUXw04zpXIXucYf9PozTKoX%2Bt4XMiOdOuD0fswsT8OvIv47fVA8iNwufFzLovHa%2BZo2tlSzgknEPCeQ4EZQModUuDEqnP4thq33rs11Tv0LJh2tv9LU8eSl7gnVnGUSG%2BJvW0pHZEvvdno2A&X-Amz-Signature=e491d587dd1b148f6cbe2b9fb44ddeb98eb76d5405b24cc596aa9e38faa893c0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664XRGRMOB%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031134Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJGMEQCIBGqsW4Dk6WGSqeYVqzNnb4b00H9DNgnAurn51pRd6RuAiBvoMMhGZXdrwuCF9fmvNgi%2Bdb4qQyVnnxXJ59%2BlaoXzir%2FAwgiEAAaDDYzNzQyMzE4MzgwNSIMmu%2BDUtuOY3yN%2FOt2KtwD3EtmcGLUdKO0%2FHIjJttR3Z8bVxb2TEBM2nOyUALG4M%2F0SUGkzYylUH0a%2FVbyRj2TUXFnZYOgci9A50QUc7zCLZlSQCZAfKQC2GDAxkb6WgdRnr4Y%2B9NWp4F1G7p5cd55ViOy%2BAiykm098jAnr0U9o%2FZ8VoYsR6aAlM0GsAnV4fhT7VnZMfykf5sq0ZafL%2BNS8ZdrtROL7xkvH51rxqyUiqPT1ltEhy1Cwiy4rlMgVMlXbuGowypNVgeOoNiQK6qifiF5pjs7%2FaqlfBjAdaRi0ROmznaXGMhC5oNOAxQB9q6XG2sjhP%2FPklgYwUuCYAONS4SH01LFf2mjpsw5Ykyo624z8YuURfGQUDPwBATRZmKsZxo6tDHvZXeUrNgItMSfbWsfCg%2Bu5iLN5RO%2Bk4Ehpj3yf3vbY2yA9ChLtZVdTJ8lBXGIB%2Bl09fT991eauIY66cq5NiPg%2BQpTXrJCNP5%2FrE8TJHg9sNmseBNMieSJjGJxXsivQKDVA9CewpmzkixDyVgUsYbXcdy%2BbUGTtBjdCy%2FOr3HMhKgN%2FsKjvFFH3qKXRUIn4rXWGX5Uh6v8YHBrb%2FEQc2MYzwO4wJ%2B%2BmCuw504goUTz44QNcWASNJtpjlrUHpPFETM1TQYQJpQwy86PzAY6pgFd2i2dgPgI985cajslJI%2Bi%2FLbXkZCdnqyi0wXSR6YeNv3LU89lbfFz2BK9KJCKeqKx%2F2jmGYH02YHhW4bisjb6v6Qk9fAlcoafC4nl4gvD2LYgCs3YNQ8yxjm0Cv%2FWNVhjtGZFzjpYv0UyBnmgrDFi%2BUEH7ILUcP5HTIITnHh0sBYj8QiPbRpik9ZmnojnGnksaonhUVg7NDy899goEqgiEvmP3aXO&X-Amz-Signature=f8592e52a37308a8ff7d330713d7339fa333c1856050b5a2e14241ecc6ac8328&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RQ7UTSUC%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031136Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQDpwYtyIKEkBHG4SLaR7gPAcKfUafcSYUDAjnEJWCx3CwIgEB%2B2zftrT987SD5roQ3ba4kBPuEJFX3ViWhxkVoAg4cq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDMmD75bHNc5Eh%2Fw0PyrcA2kGLturrHf%2FEX3qrwGPYfvYBpYjjxHVCzi7TUgAoSQX3iRmqCiV%2F2UgIXT%2Fjoj%2FqRKQxOOoIN1BtVy51iwqgJKY1M4JxdA2DW4%2B9DENdvgFSHLYR5EcCIB9aeMGCaYPAtMF9RE1XZ0K6Dq3hb2bVopqR5%2BMU%2B56ASovbuvJe%2FmLqPA8YLBJYj2ht5G%2FDqt2MPq9chxPPAlR0ocS8%2FJgqHSNJPSSLGrdquYRyOeifFBfIG8uygs3%2FtcZpzFJA8Q1IAUVcoJzORrLSDtg0CMos6crS3a7ybG3YSxSIkQ6MJOVgngyrkTtYCHjGZXthvMPmvKQOqPCUw%2BVXHzxyFUX6pdIjSUL5BNGkJ65rVRNhOu%2FvptQIdzwzp0ktK%2F6WbdGTAxxPlnsd4qA%2FGLBlBjoG0uJKX12jBppkRcuv5BgAvvIN0rbt4G%2FKDJoLZYHGk46%2FD9O9pTwEf%2Fdlt%2FeArg%2B%2Ba%2BWMOjGRTUBw47AKWTbhfpqkOhOIbw74vtBtRpv%2BLool71aL%2F1nriQmUaawpXIuqnBVBeTax0CiueOmc6AuXI1anGk4qeTn5G0FO1oG9o6uqmh3JLtRvq%2FSEZNvjaulbiBXENEyxeiFky4VAdfs8hY30K763aGsbinCWPWkMP6SkMwGOqUB86G4Lq6KBNBDH%2FshnAP9OE2BExtw1uyxPd0a46%2Ba4oOwbs9f47%2BsVylhhj8NYe8VXogjkwlpwRJL3NvW1WQL731CTpov9FTnrXRyrUZVW2TmL5pt1VL6IvBlG%2FvHBvvXp%2FmCm6Ry5vqngqZiyuGycC6YkGHRo3GAtju4Qsff9cScz2o%2BKynkVnEYzR4%2B5KudDoNTZgR10GjdfApCz%2Bf57XMr2tbC&X-Amz-Signature=95418f0980d105dd4292a249146075002d05e234cdd6262501f94190e7776565&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QWSWPEUR%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031059Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJGMEQCIBoRjIM7%2BlASj5cakOWxk7c%2FWzE5U9NXkoK1famb0bpYAiBYuf4baWUdxofx4KaAO3qtPtKXhBlg723BYj9U32punCr%2FAwgiEAAaDDYzNzQyMzE4MzgwNSIMMWagMEyl8gocTQgRKtwDHbMQ4lRguep6A9uVkNfIAyDl7zeWPmAUbvMBaPR7ntMOFUGVmv22AX81bVsQ3XJGlMw%2FsDUlpz8gSREI%2Bpe1IC1iIxywLG1o%2Fg%2FfeXE5tViCVnxNMvp1nyRUSmzHPSsPaQY0xZotbNRJXPAfYIL7q4jaR3yj%2Fvp6P806TIynW%2F0Ng4AsVxbm0vAFzv3BzCSW37p8%2FdPm8lYNGAqt5Q3MLEl10P3SGkUSJ%2F8GAopLhYvXvYFAx9WvtBWQIGmQkWZXPYJZ6FzwChgEUNaIuDOFqiaoioKK6y%2BIdmuUTFk7%2BRE1%2F12ytKqbH%2Ba6NMp4w5RtBATqAmWnew2LpUa%2BAOo8KawSiWz7ijpcGkZNzRr3VyRCAq5CSGBswbus8hg7J90Kd8FR%2F7%2BeNmdvJ7SQKEVnLERez%2BLylGIt7ak9mabUOdnd%2BvG8Fqgp9vT7wnOZeLuEwhV1qe48kkP0dejvGW%2FW9Hd75Ews3BaQ%2FiX2qjnlro6txyzEmr2lLgQjzJDy8WOS5KsrEOEj3wSTczwTy7vxvayJynmvaRmcGacZgMgRWMJKgI7MpleKRwvYq0WrVspVHxVFl%2BV1uzzxk0Atqm6GEg8BG52rNaA%2BZ5S2IaRThY4gz0GWyykSCVIhDYAwu86PzAY6pgGQb2qrmJ3W14Q%2BQVQ%2BYxoPpdqzlDWFQ6%2BX%2Fl%2BNpiIFb7OgWBLILbHw9fw57z4oquI5qnGDtBX9tXdy4sw4fKYhpkDkwl4BNESbC5lBa7JdD27EoObOrqtnwDLlulIXqq2zM2V97OKSNx7W6udka3kCxwaN1dyPKNpPXzbR18N4XYiIIZLVlRHqFLFvLBG%2FUuRPG4o2yt8D8VqxaZFTV%2FF%2BglH8LUkb&X-Amz-Signature=29f9970842de04af3b1d0faffacde93cf3d9a898bc33c34627f81d351f04eaaa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
