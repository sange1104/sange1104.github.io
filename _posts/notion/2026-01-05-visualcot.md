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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666VWNGRVI%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040405Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQD9yOsL%2BRHxjwMrtSCjv6LJM72jt7o4xjUza1rf3M0cagIhAK3Axr5OQ3hlATYJlO1me0TAOCnWIsoMTB6%2Bv%2BGfPGcAKv8DCAQQABoMNjM3NDIzMTgzODA1IgxjrUvm1dIG1b8if4oq3AO5SrnuhNlAvRXPo3ehu5We1%2Fk%2BAuxPLfqMiDk%2BNks42eZZvcZ8Z7eVHtXZMmhwK7hvB04fFf9fBF4g6m%2BvVYf97DtIkXvNaxRis92i38MUH8MU7LaDDn5DYrrWfXVxnCA%2BqzABSTQXQZQYmdFsxwSavg1roqArVELm0cVXxVqiTFJbMmk5cKCfnF%2BmjAculvvb58XGZntu1HuAvtwvzUPp1BbxYs1dfMzx2G30S5gMR9%2B1WvhDe09RyIj%2B3EyYwxmDmTpxxkT7YT83DFiRnGT50A%2BSZspB6Z6%2BITsl4RigGJpdpFUoRuaosofvVGjcKYdzl%2B45CDGFSQcUX2QnsF89QD%2FM6jAYjCaiIN29H5eC1WjuCOtgX6QXa1d9gQHJgux0mD1kyCxM89%2FPaCSDvSCaW1WcCLfX2XFwdTNsK%2BH34IkJUn9hnOwFAFG0%2BC6PRoRR133CQDo%2FGkUuluI8%2FdleBnxeXB2WiVVf6h5N%2BAzgSHEzkR52Jw1gJGGiM6YNrkE2o73mdTC0T2PzGcSJZS1wKWEjjMcc%2B8TigrR7TrZHCJGckcGgGMpDNzOXgRAzJxQ8YHp0504kyM0jUVh5XQi5%2FSoEprsVyQl48ZNHjq2nH%2BXSztt4yCCr0X6WzTCFj8vPBjqkAc0Lk7U9g0J85lYBRgZ7Tn58iO%2FIlS11wGGT9a6lV1u1hh4GDGLltw1t8BZKj46mXj%2BWTgQutazpYiTki0rlxXrzagxhpg7wkoqYX0d%2BhkdPIRyer4FBom9KY%2FzE4Gdk9WUxUndgmSLJP61yJb57fIYWuvA6U7%2Fzo6er5y3czoxYDfy6lfcOv%2F5HS3i0J1jBAFrwet8qmvhwiaw0%2FUni5HWPwe62&X-Amz-Signature=558a7e4e3546fbb429335119a6d267b7d89fb70c05c235a594331a4c4fb56b44&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XDBCPXBW%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040405Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQCqxSqcg8iq%2BzCiXD745FdAnEmXcV06QBT5c9VUTAOYUAIhAMj9UjqKmQcD9glfC1OAsc54fVd%2FmReGA1JlFt5ccIVzKv8DCAQQABoMNjM3NDIzMTgzODA1IgxVwF2lXq%2BEhIDSQO0q3AOMsHRIuqO9OGS6BeQpnBXOWoELRhv4vj4sQjOQzmTnCC053XCUOYiU%2Fz1vAkaio4xU%2Fe1ekKd2qDm9aBu96HpfSf%2Bi71WDvdI0hr6ACEkDE7YBOPPEjaeJ%2BbEzRVaKjSEPB78wM1eZ09OTDxPGDVrPtuNjImq5eOvsOUmB7o%2B1xbvihmxqaiv4TmyMPvYsWR54gkAVga%2FaRW5638UKPnAf%2FejtOjAYIwvEt3InlYIs5ZWy%2BoVetUSXo5yStQTvJ7kTsaXNX1cLnQKMa6oNXiJ1CSdzwgwiOhm8oYXnwmzxMwuz9L8RlLedADuFbQ%2BAKOMSDIJzbQ3RjJXQwFrQCRAetUdkjcGCN8XqgU%2FnRygnT8VZ3Vg98T%2FhttRATYcqT8UqN815BC6jsJNdtAreeLe33wUVWkSuO31%2FNZPJUSqjT2yYT0iPF7xPiujJlAjIJahne36HUZ8enpJFuipoKueAwGPoqgqCblYHKPB4ejm3weY%2BolFLgv94SYQjaMk%2BZC6g9cm27YhPxRanS1msuXRA9mBR4hKj0WjvfTICKCJATTj9kkmsMWEU77H0u%2BYwBO75VjhVmDDDOTfmNRI4uWjynOmUBgLBZBM7ahsLjiV0p7PljMu4lO9iJEAwJjCAjsvPBjqkAeMg6YhmY0aMHhpCDtpK0XdneuaA6rZ1XgYbF5NmD635cgN1%2BbX%2FUmNUeIkYquAgTqSLgg5med9twHngfQaSiyYhRRbO9iMSmyUMsPUf9OjOeHwt7n6iWPXreQkJGqdbegQoMOSpVOc7%2FGJIvONpN23A1n1QS8em4nbhvfRRZFZpeURe0njMy4sygLa%2FfItpabfDQGlhCDY%2Bc0XqnbpkJCBwPesa&X-Amz-Signature=3badcc48946643d450c15df6ddcd07a7c3ee341c832e99fa202d26e0fcd6ce82&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667NEXCW5T%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040357Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJGMEQCIBY8KDzy5w%2Bphzxw1aiRMFvxwjNdpkSsg3OgHlf1wNOkAiAspwDRS2MvvDwd1Ds%2BoDb0zOHWL63NHWBw3kI7VSK5Iir%2FAwgEEAAaDDYzNzQyMzE4MzgwNSIMmZTwRCJDyH7D8mSJKtwDRNTpXg8%2Fwbh6OmQVfmLGU7N77BGCv9VmhRf8GV8l555uepiOPL1nLrXTAInD6gF8%2BYCVmaVtdUmL1Yq2TjrZsSkMZzLD3z%2BSwT6HzeV49Yqv0LTCcOvXhytmZb%2FPVYIU12ID%2FtepY2RkQqUvGgyyuifsyRXets6GcryRkzGzZFq95NbD%2BrAwA6o5PEXRpz9El71MlchKRx749gfhqPRLILiFfsx1WgPVy8xuTYWcnedKU6ou7bLfFFtNabXDF4iCKGrshyMLYtnVjNwKqJTANaRnVmD%2BkjufNpE2ejiFC9Uwry5Cf6eLXyikUsrFaHSiL%2FEDX8QQU25MczxyajFUWr1VTwAuL3G3amZG97pC7k12knhNjP6Gi2XCdgCdhqUk4cEIzB5epUMTwhQoJKmPAUvZ1QAcJRy%2FkS%2B8LUOZ%2BmQGDZbBpw%2B%2BchGYKhHL%2F2VMUarLgX0cjoi32lvwGHwvqS%2FApM3Zh40rJSf4UHugAWegzJhhFj1Pg1JbHbKbMw5AsvqbOZdUvbNiXkANlnE5iGYfg9Do3j3ZLgu%2F5H1WEgcigZq5tydN47kI3qWDRkvroDnukzAQLs1GR2fevhfTTBKMAdrCgKvjToX%2BOCSmJxnb8FLad%2FnOpuSd2WwwrI3LzwY6pgF946mlJjDGJsINGrwXMDQ4WFZsBrOz5ezApaURegIMrxTRXju8PXMaZn6yB%2BK6y7PkWfYNuwecPcYwIlh8XCBcfdO78r7MjeFbX4GlLbIPlbA01rdtdGwdawu8jkP7pMO4%2F7dKIY6qvsZzY87FLv2k3MzTEgYwzIKOx7xc%2FrTierpXPsnOjowR4PqyDC6Uraxc3SUJmZotxm1gWz3YVqPHQh2vHI02&X-Amz-Signature=d5eef099fcff89bc0b5087fdb57f3977574e56ce044f4d0fdc63a16e23563f43&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667NEXCW5T%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040357Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJGMEQCIBY8KDzy5w%2Bphzxw1aiRMFvxwjNdpkSsg3OgHlf1wNOkAiAspwDRS2MvvDwd1Ds%2BoDb0zOHWL63NHWBw3kI7VSK5Iir%2FAwgEEAAaDDYzNzQyMzE4MzgwNSIMmZTwRCJDyH7D8mSJKtwDRNTpXg8%2Fwbh6OmQVfmLGU7N77BGCv9VmhRf8GV8l555uepiOPL1nLrXTAInD6gF8%2BYCVmaVtdUmL1Yq2TjrZsSkMZzLD3z%2BSwT6HzeV49Yqv0LTCcOvXhytmZb%2FPVYIU12ID%2FtepY2RkQqUvGgyyuifsyRXets6GcryRkzGzZFq95NbD%2BrAwA6o5PEXRpz9El71MlchKRx749gfhqPRLILiFfsx1WgPVy8xuTYWcnedKU6ou7bLfFFtNabXDF4iCKGrshyMLYtnVjNwKqJTANaRnVmD%2BkjufNpE2ejiFC9Uwry5Cf6eLXyikUsrFaHSiL%2FEDX8QQU25MczxyajFUWr1VTwAuL3G3amZG97pC7k12knhNjP6Gi2XCdgCdhqUk4cEIzB5epUMTwhQoJKmPAUvZ1QAcJRy%2FkS%2B8LUOZ%2BmQGDZbBpw%2B%2BchGYKhHL%2F2VMUarLgX0cjoi32lvwGHwvqS%2FApM3Zh40rJSf4UHugAWegzJhhFj1Pg1JbHbKbMw5AsvqbOZdUvbNiXkANlnE5iGYfg9Do3j3ZLgu%2F5H1WEgcigZq5tydN47kI3qWDRkvroDnukzAQLs1GR2fevhfTTBKMAdrCgKvjToX%2BOCSmJxnb8FLad%2FnOpuSd2WwwrI3LzwY6pgF946mlJjDGJsINGrwXMDQ4WFZsBrOz5ezApaURegIMrxTRXju8PXMaZn6yB%2BK6y7PkWfYNuwecPcYwIlh8XCBcfdO78r7MjeFbX4GlLbIPlbA01rdtdGwdawu8jkP7pMO4%2F7dKIY6qvsZzY87FLv2k3MzTEgYwzIKOx7xc%2FrTierpXPsnOjowR4PqyDC6Uraxc3SUJmZotxm1gWz3YVqPHQh2vHI02&X-Amz-Signature=4a96c09302b3988f6a2f34f27e93fa9ef44862cfb641576ad209fe9ae975ac7f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QRP6P6TM%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040409Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJGMEQCIAaJ%2FDBuPk95nxwxGKBJuciod3XWgtrp8C1iurR7Vzt2AiAmIEZlPuqdXXxJTWMIbYcAHM%2BxQUubdoP4VwpHrVm5%2Bir%2FAwgEEAAaDDYzNzQyMzE4MzgwNSIM2i%2BLq8lqpW1vID1NKtwDSbPrLAvydzz8M0wX5%2BiwC%2F5kfeScJycqx%2FiG%2FUSK0ttrLbziDl9dEG0J8ikvwNoi6DOvaL9YUSQz1Xm2wtpy9YwNzDJBp4iO1PqfU9Xy0VkILxuoN3gkP2tt2YIAOEPQUHWUmEWiQmRjXo2i2SEbC2o1ByU9iI2vPosvJhTHFVuNtSc6F29ZWyyi7cPhYKORLWnWmmFkq2OPRufoCz9pf81WKDIGje6H5I1%2BCBNxNuROpR8VLX2xXNyNRwYY%2F6agSRujpJhJotmRPgOk1FyJCTuhkMHw4h7vce3sL%2BEFzfmAfQhJChyOjRFwkzdlM3lRFmHXmk6nWrmfA%2FPZtmQwmkmzyd11wCeSaFmyxqNpYWbyQo1mk9wGSJvY8Z1cWnDSFYEe94Umat3h%2BdXpQMsxpprijkI%2Buid%2F8GI56XdPNxXtUU2Vd3UrIN3YmWilnOX%2Fdp176Hhhfwm%2FMajvh0Z5CrM7jkN8sYnIP%2F9%2F3RYe%2Bfj1YXHcXtighZaEDqtdlWfRlVqyE3pTWlqQnT%2FFf%2Fuj1SYNZlt2%2FPTppzblBefx8nLcnHCmKOHyL0hR8GkQVzZ6yaZ7XrwPiXoYuuaCumRUzmZaBB%2BkOiVuM3CIxNrk0W%2BBFO9GlZ71OLRe2sEwtY3LzwY6pgEjoKKqMOWhccrpYYCSmwMgAzxa6Erw7hCca4w5RmRFmv7bTJiDLno3R7Vmd6a5e0a5suHN5XgVvD0xVyPtHDHipeSUDjAVviGsRFoAdIfSqD5fQPgAqc9RiY2c26sm1LzgOZfi7bo9TQJzOTcFwUVqd46u0xwc8F0sRbYtbxLukPRfow4UGKNOsr%2FKiCz8UQ3nJdt%2FamSvlme2w8TBZc6qaMdPP2MJ&X-Amz-Signature=69c013bf024f5f65cc281b1c7d37b8feeeb7d844d9c2f67dc8420a581939886f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662FUESC2H%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040411Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQDmQrM0ueXO6RFaECpX%2FKmBM5GddDwG4hsKjM3RZ3mHogIhAOmzjG6JZXoA4pVkkOnm2khOTfl7nNLO7MhcJhi1%2FNv5Kv8DCAQQABoMNjM3NDIzMTgzODA1IgyEodiwEjzyiykZHSUq3APbDgYGcmLGuA%2FtBSORmYGVcAZ6KZdJ%2BSneJj8K9o8FkFDCYcqmIUf9DIeTlXc9TiOYHbETcVyAWrl4crC1We%2BX7k%2B2HazOVhgdGi8Eid6WDdzECSxb%2FQdtoKPfVKp8EFA42GPARqzX1ShzVyiVvmXXhrlkoBHiRMWRaVphZ%2Fvp0n%2FdeqNATRo0FgHOPtiJNgnMyfvemwoPPG2MkEtjP8bCXosIkVatGcX8hLCpFwoB%2BkVl68RzyQuHOAmAZRQP%2FqDLZ7a%2Fsrml5BcZBs2fChQxdLHSdAWvtn00xGB2P%2BdTTdKcj6dNXJuX8iWZJ9RL6toJP332ah1KOlBN2fVWSyEdxF6y%2FpUxLEuKgOyoISA23UzxrpekEn1OpvO4kgYPdf1FcMxrVlDQXNTumJu%2FgK%2F%2BUCIm6z3Fdqi7Epp%2BiS5DVINxLJpF5O5wHAOmAXn003SZXZSIoM2DXfZG4uEofcQQ2MxRB0zxS0h6eVKDjEBX%2FZR9AWAZhvljCzpQIBwlN%2FQoQIaAdcAArvNE57KkaKxfo5qFuFt8lfAPPtXdjAkNWLfJz1rOJmkiLQaYeWTDMATdKcC2AquKtc%2BezElZNms6rqW%2FNcpN7IpCU81ZtnQaEMrkZrheXZhY2gXOHzCEjcvPBjqkASYhD5XdHprhbIiAHndQsEBKmsXTOORhHsWVOJ8dyf8byMiYjk0k%2FApOUOWhihNbwpWOZ%2BO4rZysMwFg2xFhGghiscyOsxEOuIbmDRDCMHV32ZAts5b9sdkrvPLWKLNfIuXwTv0xL8FNL6zeGB6Ytc%2BBi4Q4CvTAxsAUjikqjANXJiQUHyOH7eUeetAv6C32ptvAztVOGQHQ8XpAOi3XDr6UUaD2&X-Amz-Signature=988d7a04aac1182f4f3520963d27fcd62da8136eca00b1d735d07e7635ecb761&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XZ3BLAV5%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040411Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQCuAqSzilKeEN1eeVoIVwSznJQ3vkwr0cPWKrppXe54IQIhAIxe%2FWL%2FBNTAatSOnATr81FVU5Ua01jVwAcNOUy8jC8oKv8DCAQQABoMNjM3NDIzMTgzODA1Igy8WkLPjfR%2BkyY8ou4q3AOX%2BnDcbzK%2BUJse%2FHzLNqscEQyVCX%2F2Fy5vfOxhBivIGSry6qBbIf37gialqiJ5FN0dmT1%2BKBoWbxRRE1HxPgsjDLdwvKGBAMl0DvJYZlTR%2FQBbWeVhlsHGeO9gRtQIuYf8LsZRjuBPYqoyhh8nqytlA5RugVw8GKfndWeH97wFWjhzeIAwNL%2BEMW5JDbLZL6nCcJ2iPZvdI6cYJupHgCYRtpm5lVO3RE1nZibw1z1o9CEmC6Csx9rhG5zln6SoGQH0smNbjlzFGZsu7O2GFaQopxSPakO2a3wA80QFph7P%2F46cqlJ%2FpnK7DIz8TjVcV2JoS501Sr0cTdaKGtJzEBjD2zDO6TXA1tJhy48EfDwP8MeiZCM3myPaK%2BK2BqrzuLr2KiNUA7HuQpZGMPlpsQfXVCFBq%2FlO6MXJD8WyDqpuW3BXMUDAVGWP2kKowUDpzJ2LkRfb27dRsmbHPRpXdk7slDEZDlDjb24%2BBl0uch6gcGFj%2Fqvt7LYhWvDGsFnV3aKzW85b%2BvDaPYLIiQ77kDj5NryaEDbbrUR5Y8CDY0P6luBIvveeNPzkLqEF3Xm1KkSJdhWXOuSgGlYrCSfjsy2bix0XMe%2B%2FZF242TDwaWZhWhtow%2FPl%2Bgqs67IWdzCdjcvPBjqkAeXVLo76hJwF6nq0eZkxg6mOR8LaE2rcLT%2FACInN00BGYn1zMl8JTZWnzb%2BsrrPX0Yeq5M3nmS0lbVtLXrY1Addy%2Fk582PoZQ0dXbhpcg6VdINg0MWkquTUk%2BH%2Fasx7F1ONEmAPRxrU0Nb3JWvJIJvzg3A54NuPl9KjTEdW4XaAOaQATSdW8oNJChRpVCr1tlLjLKkEVt49KaBSY5%2Fhauu9mSfbD&X-Amz-Signature=93858576991b336122e6aa59334dacbe41a54988df3a726f87aead570fae9de6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X6EIAJA4%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040412Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQCjhyD0BfBysM%2F42gZ6k8Q9GfTf%2BfriVpRDaYT67F%2FQhAIhAPjeWwCMubz7eGOv3og1WBlUFVcUMpQUi3vqsQ09IK4qKv8DCAQQABoMNjM3NDIzMTgzODA1IgzkrKvYOCy76kAHXm8q3AMK12jIwpGJ1wxYdJwfPI5O8L38PKjWyldByklIb7TJjfgm8%2BL4e%2BhByEUNKwmWxP1xkEJsxmB5tUBQXHjeYNtKhW32TCB5SJfQPtu%2F%2F7vpWL17CyL7FNU8JlEi7AcYaL9cQJpF0r8hKGA44aDa7REgG7UjAwZYeD8aXTfbxwt9b2zYKZPERaxk5YRb1boGIQlsnrCYCq7ZWdRnpQ3G%2FAKsnvYrIakw5Rls%2BuP6aa9wb9mGGIrdUSQVW%2BaGfzfy3XYQjZJI6B8Y9fDdKNBliMKzPBfHGBpRy1YtBvTXnD14H85eErmPCrWGd2gsPfUQkJFxm1o6h%2F3bdfe%2BOekcn8snJDUoPrxugjOFyG8wvyT2KJH%2FMN4uw5SaLyGDPgbPNCpDPkOG3iGlc%2FvsD1IwJXWyRg%2BZQeWrfuc2QSBrTHimrRVzKlmg2F9QyEVJn2wlv6TRDgPTn12mahKySpXt%2F%2BZz06IU6niqQd9hFgN2yy9qfI4GNcsTDb3W1aRdwbc8Jb9DYveWrj9BCe6mnI0%2F2ORLpkWFPR%2FLFs4t8PK73%2B31Nw8E0JProKP09%2Bm9mZL1%2Btkg86g7M6IbdnKWhEeYm5OHK4q4gollfuXcEQY%2Fc1qMWE0OPeUqW9JHJCj2QTD%2FjMvPBjqkAU3ghJqHQCuHnWn6DBM4tKFdAg4DTE%2BLuUG0PeXXjCZczPSifYVDgLRLjwW6j7WQ5PNy2%2Fv6JEGwzTCPAX3U0cUkHpLNy2gzKk6vjnUkobnmQsrykd6eYqB2rTczdx5iw4rgLSG2%2FNH7dP7cIPnI7dywTONj7dd5de1T8eqFPwY3a%2F6BNZqxR4Seh3L8WxGVGCoCAnkblfRNIMRYr2Wrac8o7GnY&X-Amz-Signature=a7ea9b3f539e356482e49b88d1a4ff49085bd1b2aa7b240a26c758d97bc4d232&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y44LTX26%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040412Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIQCuLkk35YzJy%2BG%2FTT82072ZNpAvxj7xmcN8MsEBNwXrKAIgA8DttQk%2BKpGcV5XSZKx03et6S1fIWcFsKAwoS7AUPxsq%2FwMIBBAAGgw2Mzc0MjMxODM4MDUiDGvmsZTffdKSDQTT8CrcAyPtGPf5xu0R8Nw0zuQadz%2BYvsyeYcTTQBA5u25mQAzTMwKPxxBVs2LOYYGtCDw1%2BL5%2B7enRdEEA6Ua9sxyfRvWMz0cfOxNWdVDgphaniohGiwCXYOiZSeB6xLH8%2Fn6W7Eo7he2X3xCKSFvdwClQbhedyadjUTmkZvO0hdUgIxQpIgc2QBXDOkN9nvC642ckYKCyMZZg1ePIojbBs65SC3J%2BLw69HmIZ8GJWxMBcLn6V5MPJhsL3IsMnvinDogtZ2jIjT%2BfY3mCzqVjUtM2DoTGd13N4uPAC0gzGqjER5a3fwvLROkzlUfd3pETxIN59Brhx3pLbD0ftgW7II76klsBVr7eBhhWQt7AVgMQyT7BWxHyeI0J7ih7kYrtIMVRNnE%2FhVTF16KY0tDU5cQYZCBNdxG2jcIWShCeX%2B1SeHbpvJTro%2FVPE38Vyxm%2FN4hrkQdPSM5c3HgTW92qEiAjjUomUUq0SfDEHTSZYLAeY2ycea1BU6F6d494dHKEjhVp4Bo%2FYieJKJENi2jfNPWdvwbhFi72zcwHGxlePRo9M6PtY%2FYMIFtRCd1EfYbsOQ19IWJpKvNNCFoCATLYVF27v3EU5rJHQhqz9IaQshX1qxw4xRNZvPC1wh01ZK4f1MJqNy88GOqUBhDdUcd6fsxE%2F2ipSWCggBt1SLetal5Ljqr4E1gb2RL5KqRrXIUS6JpM2dCUmBq%2FbtyFYuLCmHhj4CEgwa76noTtq%2FKNPIDVRWdbmONBeFWvAKGqPgQNF6mrbN3RCQN6w3GVRj92R4f%2BKVjWwDZTvxkL8HkDr6acj2HIdH4OXLhX2Pk3lMPJ38tRMdKbVsxhWqomjTDww9Lo7cMuCbOU0JsFBwwws&X-Amz-Signature=3e3d24bf80d044c0b9f31f1eef915c5cea81bfa6f25b7f1b8bbf6a317c95d462&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667NEXCW5T%2F20260430%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260430T040357Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJGMEQCIBY8KDzy5w%2Bphzxw1aiRMFvxwjNdpkSsg3OgHlf1wNOkAiAspwDRS2MvvDwd1Ds%2BoDb0zOHWL63NHWBw3kI7VSK5Iir%2FAwgEEAAaDDYzNzQyMzE4MzgwNSIMmZTwRCJDyH7D8mSJKtwDRNTpXg8%2Fwbh6OmQVfmLGU7N77BGCv9VmhRf8GV8l555uepiOPL1nLrXTAInD6gF8%2BYCVmaVtdUmL1Yq2TjrZsSkMZzLD3z%2BSwT6HzeV49Yqv0LTCcOvXhytmZb%2FPVYIU12ID%2FtepY2RkQqUvGgyyuifsyRXets6GcryRkzGzZFq95NbD%2BrAwA6o5PEXRpz9El71MlchKRx749gfhqPRLILiFfsx1WgPVy8xuTYWcnedKU6ou7bLfFFtNabXDF4iCKGrshyMLYtnVjNwKqJTANaRnVmD%2BkjufNpE2ejiFC9Uwry5Cf6eLXyikUsrFaHSiL%2FEDX8QQU25MczxyajFUWr1VTwAuL3G3amZG97pC7k12knhNjP6Gi2XCdgCdhqUk4cEIzB5epUMTwhQoJKmPAUvZ1QAcJRy%2FkS%2B8LUOZ%2BmQGDZbBpw%2B%2BchGYKhHL%2F2VMUarLgX0cjoi32lvwGHwvqS%2FApM3Zh40rJSf4UHugAWegzJhhFj1Pg1JbHbKbMw5AsvqbOZdUvbNiXkANlnE5iGYfg9Do3j3ZLgu%2F5H1WEgcigZq5tydN47kI3qWDRkvroDnukzAQLs1GR2fevhfTTBKMAdrCgKvjToX%2BOCSmJxnb8FLad%2FnOpuSd2WwwrI3LzwY6pgF946mlJjDGJsINGrwXMDQ4WFZsBrOz5ezApaURegIMrxTRXju8PXMaZn6yB%2BK6y7PkWfYNuwecPcYwIlh8XCBcfdO78r7MjeFbX4GlLbIPlbA01rdtdGwdawu8jkP7pMO4%2F7dKIY6qvsZzY87FLv2k3MzTEgYwzIKOx7xc%2FrTierpXPsnOjowR4PqyDC6Uraxc3SUJmZotxm1gWz3YVqPHQh2vHI02&X-Amz-Signature=6382698cf63abfdfd1258a20f1345c27b635b877f5a0c5b1d0f46862b576d0ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
