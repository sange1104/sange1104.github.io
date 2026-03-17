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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SCYHMVZP%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031415Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIC%2BHDXwKPuc6DbVGs%2BlQAWcGlWX%2BA8rKKbJ8WtNf4j%2FLAiEAu7FyuyzEvVOtzTeeYczoaCnGcqe9DJJwgLe%2BbG5VhbsqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM1SI7t8qsBsjOS7QyrcAwVDExmogVgLsPq6NtI913Atk7%2BlL2XEh2Gq%2Fu9W4Y%2BTW4M4pSfNIojEMa4NNcYFCrCkLY1hLOrzOvDcNNhqvfHDQ0bX2UMbNu3DdILBtC8Sqsj7vlv8P31AioLdcod%2BmWKzu63MnIU77hN11%2B0oITAgQMhaf6ix4%2BRLAVoljXqVWhVu68K4CiIUT5Om2s1UaON3Rm0RVZzf16eCrv5lrOkoaCOxb%2Fv6JKoHT8nlDLe%2FAV5jHJjNAjshhCI5RK51py5Pb9iU%2FiDHS%2FqKleOIVhlS2RXYxJl13TskGZPp5o4jpEj3JhoQxZNI4XDkqvBHlJbV%2B1TAqKg0SyLUwiJpL0w7zOVfMnXXc9yEITi8hYwgwD9ZDPH1mjbyAKt%2Boqk7iaSUHAz8%2FWE9SOfh%2BlYaXY%2Fr1CNKW6IcH3VPn27s8yh5g3nMnfL2JXfFOwaj2I9kFrKOsBDZaP5jv1FOnAdrQ7wYmwe9bXDKvX9PYDSQ9b3rfsKcL%2B%2FyQGU6deU5t%2F2BGXOI0t59lbMgFP%2BuPAIGYqg5v6fc7OSnwaosOUWZLu%2FXiRivxehi1vVez4CWk6EmK%2B73ASW%2FHO3CG9EqnpG2rGxHYAeF4ismT%2F4D9J4ZSRXcU%2Bm602ZKDoVIKlvPMMfo4s0GOqUBGGq43Wvk6CY9UA3ukFBXsBVlZK%2Fuu5UTGsLHosh5rKSydL83I0IwFXplq80JRTjDCc5Yz58p0ULjeuoVd0FQbTl%2BMP0o5LzqyBQzzwKwVv2QeiKMD9eV9pehtBqNmeuEOL5bmjbAtfurN9ckpeDMq88LQlUXciop6vp1UuJ6HarUAxJP8D%2FLBX7j1xJEZNbuXyIHVdyawiOSLrqlS1Ew5nNmzN0X&X-Amz-Signature=939680908729a03af021df1d95ed57135287cbca577c452cb1e588333c30ad29&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662IYWLVYT%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031416Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJIMEYCIQD2gpolhRfB1DhmbTjVtsKYgOG5JGBcXx6%2FPcKc3IB8%2BQIhAPeTMz%2FDVHQVYd1RO%2F%2BhjS%2FC5v4JaIqQ%2F6xWAsgPlb6oKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxAkj%2Fs7YoleD3vCPwq3AN%2FpxZ8UzHZC6X6SJSAFbpm12xvZ57qSuWfSmwgYyeTwT2QIq8tIbcpG90gH8c%2B8e4ymFPVI3zgGRiVLOGyZASJqmJ5ifvs46u8SxxdXQYlkbOL1VPzOl64mTeUGfHb9lcGJXh3NRA2YP3%2Fwe7MD7pgrfRnw5C9JulGINa5zlnf20qBZbzlFBirqnjFG7HT1E1xCNYHR1IyLtYdc57vMpbkGpIupJvT98hfoqDnaLM%2B2xrtBNUcSx5MJ5JoSQyfBLXchJQHkahwm%2F0RmCBup0XopDshOom%2F8eX%2BIrq7oEoadJP4CQNG3JLEeT0xTffZkGRKiy0xA73WNGSKUAkYrLVtl3yM%2B4%2F1CO9X4%2FuwUfuA6aASQukZwqjM690Xj0Cw0MWpn1WoqeWywzm8oeD6ztGOELYSPcz2SLLH9Jkx1dENHiwkVLX%2FnvfP7CfuFv1XhkGjCJr3CaH4HEKdK3nA1BaR0VLL6PI6RYdqeD7dIBUcn7JlXo717gIbriWaOmtyNlq7szPbdFoDD3t%2B3oIiiH20VR%2BTUvn0Vzb4sHOWHJZyj425op9cwTQXnOpQcMk9Gpn0bUJ%2F%2FkIL4YPnjvck7gQ3Re5QPPkiXDOQ5OhHAi2J9d3aO2PFkwPAdUYDFDD%2B5%2BLNBjqkAePnTEFYHZZv1%2FQu9MukDxW6KNDWWwdRRwiN%2BHFms%2BKQoWGu3UR4ohjTJweKR%2BAblFUa9hpFjG9skMGWr1Ug75fEKEGQVJ0scSOBosMuT3ZsYKHb3Dqv%2FtRN3XPM0L%2Fq2n9wKsZxKDRibQoZ2%2FSUMwoTGT0dvTpML8CbVvcQxd935od72mD9r7DuFawtxNBwu0MztPvPuh6Zqcoxd6RMyauv7REC&X-Amz-Signature=e93bbbf405466c7de196c31ab939f396a7f8935789713034310217531b7d1ff2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663TMYOSWH%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031402Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJGMEQCIC9LEqfX5hweiGSY49s4uOlKk8OexemlSUQdf9o3PvVEAiBnNK%2FR4hq%2FbHmbqIJ39CwpLYICLcbrT5vtl3ewenArniqIBAjj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMrdIpZ%2B6gsy34QooMKtwDJxz2pwAWKMt%2FKJpEEygdpp%2BNmAjl6qCllte3sMEauJbq58EghKie1nF7cvH2ugLFIuUy9z7F5lQtDWKDkBM2%2FtY%2BzX6Wp0BNHagnhg7v7ILUg05TcPXp5aavMI4BlLvUZX%2FvxxxgmXJCI4cglwzcScXl65sLgEEN4%2BtZnP%2Fi93moCrnxmjBlo2px3ux7QfRQKkZW4ElLS5GOP8gFSnw1ox4tumAvLQ0mB%2ByynviGk0EbE18A8hm0JMnbsdoBfv7LvR5d2f9W1qGjgCKhA8pw99tRqG11IcW0OoaJc0qFI3gQUV%2FGdjUQ0gLXmzSoXCmIOZ0r0wbwZUEPVfV5kKZ62ipRmC4C4JLac6QtY6GUUKgpW3DtIpOLtZMYs0Q6m3Fuzl0hvgCsNnryqKVTV18GSxNAP5ArflV6ELB9aHG0fM9sPGp6TFOovAgKq4gGNJH7CvlZe7Nqio1qlSCFH5BUoKy3osctrNpbrqOVPDHQYBx3j8f88KDQh0Xiyy%2BeMajO%2FPVweRmHZGw78YCjTLxCUJYdMWCLe7TUUF06VzB4bZfB%2B%2Be5U2TiFEAfPn2duBvcR5ZV30epk6yi8fawGZihNALc%2Fv65d%2FRpzFq1MMyQYl0xoRj4owKdsauztPUwqefizQY6pgEFCY4NeV32cJwsyyrNGgn7RUT8PHWdKPXMWIFpfjJ%2BEa0dzDbM%2FK005l%2FLb4%2Bi4y5JJm4hzBgB%2BloXdHdocGLO6HJD%2BJv%2FZzDgU7NGPLBuAterfvggoNUGFt21qZprlvWL178TQELp7B%2B7MtC9%2F38jEoAiOao6xBflulPeYkY7hgnMBrZ81SnI5un6Vw7XFcTW5pkZnsSRPzj4OP7dbexOUYQfsi55&X-Amz-Signature=7ee80b4caa3da21edae974e27438f8caf1e0fd9615730712e7bcec8a6f22179b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663TMYOSWH%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031402Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJGMEQCIC9LEqfX5hweiGSY49s4uOlKk8OexemlSUQdf9o3PvVEAiBnNK%2FR4hq%2FbHmbqIJ39CwpLYICLcbrT5vtl3ewenArniqIBAjj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMrdIpZ%2B6gsy34QooMKtwDJxz2pwAWKMt%2FKJpEEygdpp%2BNmAjl6qCllte3sMEauJbq58EghKie1nF7cvH2ugLFIuUy9z7F5lQtDWKDkBM2%2FtY%2BzX6Wp0BNHagnhg7v7ILUg05TcPXp5aavMI4BlLvUZX%2FvxxxgmXJCI4cglwzcScXl65sLgEEN4%2BtZnP%2Fi93moCrnxmjBlo2px3ux7QfRQKkZW4ElLS5GOP8gFSnw1ox4tumAvLQ0mB%2ByynviGk0EbE18A8hm0JMnbsdoBfv7LvR5d2f9W1qGjgCKhA8pw99tRqG11IcW0OoaJc0qFI3gQUV%2FGdjUQ0gLXmzSoXCmIOZ0r0wbwZUEPVfV5kKZ62ipRmC4C4JLac6QtY6GUUKgpW3DtIpOLtZMYs0Q6m3Fuzl0hvgCsNnryqKVTV18GSxNAP5ArflV6ELB9aHG0fM9sPGp6TFOovAgKq4gGNJH7CvlZe7Nqio1qlSCFH5BUoKy3osctrNpbrqOVPDHQYBx3j8f88KDQh0Xiyy%2BeMajO%2FPVweRmHZGw78YCjTLxCUJYdMWCLe7TUUF06VzB4bZfB%2B%2Be5U2TiFEAfPn2duBvcR5ZV30epk6yi8fawGZihNALc%2Fv65d%2FRpzFq1MMyQYl0xoRj4owKdsauztPUwqefizQY6pgEFCY4NeV32cJwsyyrNGgn7RUT8PHWdKPXMWIFpfjJ%2BEa0dzDbM%2FK005l%2FLb4%2Bi4y5JJm4hzBgB%2BloXdHdocGLO6HJD%2BJv%2FZzDgU7NGPLBuAterfvggoNUGFt21qZprlvWL178TQELp7B%2B7MtC9%2F38jEoAiOao6xBflulPeYkY7hgnMBrZ81SnI5un6Vw7XFcTW5pkZnsSRPzj4OP7dbexOUYQfsi55&X-Amz-Signature=0ab49bc2c38b0c808a4984530bc9498f62dc635ebee7a030de797ae8a2848759&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46652XUUVGG%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031420Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJGMEQCIGb3ESmtjutObTpWck8hwAKOZPTiPmWaflHNCbE5ubeNAiBtnV6VtXQ5eSsxOcbXjFrwZfZHQ0u7k%2F%2B0hQodNG4QxCqIBAjj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMhPmwqlazocmy7qNOKtwDbtWasYE%2F8kfAOn%2Bued2jUZlbyFDnHtjGqz9v6iCB87p3ydUtV0%2FrKlyF7ZpmWzfpjNlNrN7r6c8vnX4zl6SL2ysJY6OvKB0AgsuIPlXEiJd9YdYLdWPPauJwGoAL45WAEDsL6356I39l2aI9AhMPyLQM%2BgkOFaWScz55lbniAenh0KBbK4wfv%2FMsCn1fo0UemzythbnL%2Fjjz3deCfRoqqmq3yXPRcM9ZNZ4QdVDZC6phjD1krYLVvjPhcxsMDFSWJBVBVGOTSWWVSpH8trfSUYEbGb1Qt0zcDQIp5HZhdFrn3yPa3ur6sfG0yAZKwDIYIQVfPILzkMwrTSt3pwC7efNq6Z6uPl0pSawKZ5tfAhrIH%2B6ZciFCqPQOUZhFSi8FCYiFSJ7yjPDRDk4JViqFTu6N7olJRq%2BSB6QTBIIlKt9WaaKL4Od%2BCHFv6GAWDNzBzQEhYOWRYuWeEPd3oYNYMezaTzbsL8oqqp65b7ZjquINeb3m7xv7Mfk8EMqrIBonJtfoGFKjb5vrUxKTqgIV9mPbB%2FhI0DYoGbquyX6FmyO%2BHv4eRKaHViUznk0deVjifbbJJJM64ab1pyu8hIuxq%2Bvt4paD23SoEaDL6bjox3%2BtjSCJHzrH18ag3fMw%2FOfizQY6pgEr223PSwOQsqcsDpqtJHlXoWXtawQWTYKkh%2FB8R7tGw8KALOYwD%2BAYAoMPn659sJr5wh%2BoBClNc1P8sdpGeLeAEtDmYYYIAhwMIBoJrQwNGZr2wdjBBnE9UcIIfCjdGePRWrT2tg%2FIEaFEyYglJzJAGqiXOa0pBQ5gdtC3WHjGmLJ4bBGY8ltz%2FC8lejAZMgz2O9MVaCImhuRW7ZAT4qpVc4i6Q45V&X-Amz-Signature=1bc1d70ae47385ce7d33fbb8092d4031eced7c17e7e9942cb0d0c144d9f97ea3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664AIUUIHO%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIFSfILbqyYcKRrjZmL9eZkUCNRNSIzhHc1pNXLVR4lBdAiEAqxZO%2BIhPQwOt%2Bb1YrsryCwor43Ys6wLxZqITI3tc%2FwsqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDY%2BI3Xn4iSeWQcFLircAzwXhZUKtzok8zy23BaNQGH2ZMTRgw8gRi1kaPJ19xiwGF4tdHyv62nRdVUs9Y3GaesoxQnd6rlzJiLI3pwA7lLu77bOvcLMevbtr14Ul0TNSkgA%2BXEQzbUkXyhTXN7R5VFOL6TvCoFpa%2FTWpzMg%2BTARDqZXDIKnWwy0TmGZUWjTtQASHmp90KYy3i4jMwlyOrbcZoq%2BsRipG8HQWcu3rRsMhQxKLSGQNlRgrQUsWbHMGRFYShpL7ml8tiVP8PRynDf2NJfVYYhM0K4KC2wExW%2FEasU4KmIdqZR7ER6q%2F1RkCGGT%2Fe0z%2BjGr6p6puXvEehSBoDPjbku3JsqROokI7HMxBDNV0b%2Fl4y897LFYmNiXZ%2BYPwaSkk8Q8ZVox%2B8Gcw6DpfYDl1f9iPoHDWxGW5lkY30hhn3DvGkj%2FK%2B24oMy4%2FG3RbFI2GvZ1BDfrGcavC%2B0L8tdFLiyMLyZd0qB6cvXFcsxtKRCIJq80BQxlUvMWd9oDQZkPL13EUDGZEgeD4kCDOztkrsLVrWQfwOefTg5U7WtXrqGsBF9%2FvbpTZ6zYBt%2FR7qOpthQwlRdo%2Bq%2Fv0yeGBOXgUnO1ZAxQ9aY1efeuAxC4F2sYvBQ2xt0mTQ3iBDc2DgAPacINfbA3MLnn4s0GOqUBNqgX4M7MaVUgov%2BuWYcqldVodxANrlxlxuVW2RmkL0227maM%2BShEkAlHCAMbEtjPQeHHgJtrpL6831SLaYmg%2B9c08bQOlzHCZJwUofMaZchl22WcJTK%2FaZkiz412RrT%2BbketSIlFNO6K%2BeyFcqlyUnwUxB2g0W2qTfixo6sk0%2BF%2BM03TJEuK7VEpPr19pcOJZ7WYFKBCiM2JbPIPZ0SLK8%2BbEQ%2FW&X-Amz-Signature=d54c34b269f16894ea69d3bc57f15af8ecbc9eae3c71e6d959b17aeb81a81354&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YISR5OOA%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031424Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIAp28ubWVR%2BLwzDm9WZju3XRIz%2FX6NMfvO4fisMIa1SDAiEA%2BGSjh8f0VXs2XEWrkc4SFsDkV30j9uVV4M2zOauiuicqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKsbWHSzrVUiuDd01CrcA0eG0c0PuA8aV0U9VOSCBMnk59MRfOgP3z83oe7Yvj5G2jkC0v8%2Bf8vl84Ks1WJpms0qEfCrQHXI4W6Sr5GLcTxNvBQjfC68rbm%2Fn1MPzK6T7J9hDEgbZCHqZ7ILR9pX9hjKOE1IJoz9I64G4xqaGvZv%2Bbc%2FQ7KlJI8NxUAVyxv3glwxsBC3GLu70Kbk7MphtS1kAajjcexC6QhQK5ezEmgK55lJrAura%2FHOl40S7%2FLDgPKIEIzwatD%2BFZVNG5vN2NK63ftoi0fmY1W7A4Ljn3yN5F6se%2BpwgpEiIPra%2BChL2Edz5AeB28kDPtntjAfod5U7ew3zOiRW1cnY5sOSO5fRf7R5XE7J0jAbhqMbJKiZQBg96kqVPbHeGcOjHgiYO7%2FO7JuSehTZIDHQwpzNfrHJLcE1tC%2BxV7OdWGwt75J5CtjE0HiM60Zbxxs%2FuA1cz3Gl2LdC5T5AHg5hJYv7%2FBCfiTkdoUVHQA9Qr0nMQI5UyHQg0o1iKvsEBltMQeDFiiiwvaFpYEUAUu7Ub2jSWtAD%2FbkPAB0aEBpf8kmryb7b00FXN%2BBDDld11R%2FqjXB90taSuMaMGyR8VCQh3f%2BrWgSUBUswNO9XUoTNo6di9mEEfOIb1WZ%2FQ46AnbOgMM3n4s0GOqUBP0%2FoL0wdiRtv%2BbyqO4MA8XocSvAFmAU75PL%2B0JNbUiVfREAHEg4ZEyRY%2BXzl6teGe3dob%2Fr9tnC7iack%2BH%2BwCwTK4Gyb%2Fl4ejXz3RienQVh07dSyCikBJIuYZWK0gvU0CQ1BKFxRR1gYjZVSUsznNUEA%2BwBmlE6%2Fze1VMQK07ZPl0WFOBEfxIv2rsLPT6gdipvkoYnOdzJ9zNnLu1nZAP5iYe823&X-Amz-Signature=2891891ce507317d7bf89c820d921b9e58b0070fab04b6497bce9eada2784211&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664YFM2HA6%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031425Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIC0B%2BFvkz%2FoM2tA1nSVDacH8qjdiz0pc1VHg1iWRsNHoAiEAupvfn1uvDD9%2F43YhSxN680guiXeQYYEIsPhRaSvLnXwqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCxbfOOjYNYBi8uqHCrcA%2ByrxhEdl3q2PMk8s9G9TWNa%2FVaqBBOF4yqrX0csKd0hKU8kDmnIvhdBIrtRh7Aeswb386i93b9wPaM%2BXLgrOJ3LQUOVDMS3V%2BmQFHOcENqBgruWL3YpDbh2yEwcL52FRvaXTgVpeHu9y3%2BXIb9%2BLs%2Fh%2FYLIsQ1xajbdHydJUx9TVzXloocRbO1Tba69cSYeO8YVlUoe025cZplC%2Fnu7jlHiSPKLIBrpSI9Qdga6pPlsNn%2BcQXuPDElF4RdDyUNJg7lDfz5hNfUyf2t9oGVrcoxk77pTykarnnuWiN2knS72VBLJqJtkKnxBDRpMYlqkMtvsJZr7Lw8fvm72X9SRuaiPgWs%2Fzu56gtyajJaNcsPIb51jc0Th9qlIDG1VY028HWZSr6N6ImiE0VaiWVr4MJd2A3wn23uiPc84LgKhkSZRPBmdJYmx%2FVUt8yFVkdxQCv7QWJweh8E1NHTo%2BojJahsqGQZFSba06ZuucC7xIKEGQmDEfvTmvRf2foNieXYRy1dp%2BdwFdXsMg2Qn0TK5IbgPMm7%2B6dPKKseyO3U5eZCqcWf96JsiNm6G1eW02%2B%2FQnY%2FQy9qsUSso1oius%2BESnJRQ2ZOa59qYQ0y1TiZvl478OyZK0ukbNoAi9p0OMO3n4s0GOqUBJFKTz3MwAb3ewVaGtpPFRD%2FcEUbEY1zleBDU5FqI%2Bza%2BhqhZH24QV3zFw%2F7JmFbiCfkvYDAt8NErOfRKYqWQq742TKMBwT53l9d8zzNnsjJ4mwrPa1RPnIyTqOOEIWnPQ9fBs%2FUmwTqTqZEPph3PcYD0Cz82JmCfj2dGI6LQk3OTzWRZ4FFa49lEMiTveBjAsCLlIhQxSt7QbnpTS6qN079MhHBp&X-Amz-Signature=51fb296303fe0acfc1206f7366daf4ab7e28bcb4a3e30c7ed26b142b044a890d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664JZ762GF%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031425Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJGMEQCIA9vItrTjyZSSmU6vn5HNxrAOgfPQpLeVgNrL3%2FnMj4zAiA1DcP%2BCMTgKhAu3c6AUxbKgX%2FNGLR%2BF9SM7dbd0pGLXSqIBAjj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMVl%2FGV4Fklf35WFNaKtwD9QQOCUTDFQ44h1TM%2FaxDxCQS%2FBlTJJI967zqy3yZfS7ELWfJGgLE2MgGbo8aAuyLidW3GgPWqaAglYT1nK5FvTNAA3grhMK76a2oSLUut7KGSa9ldklXAVBVvjbkalyDxtqIVTFHGWRLgVivfMzRPaQtcyqQk57%2BHh8IAq%2FVmlcdlWfgeRbUBNmpqNOprfisVgePe8X6ddcZTsg4lK7WX%2F8At38gZdCUThGBdxYRQhLvX7xlTAeVoLcc%2B5KL2zEUiXFUnRB%2FKE1vMTRE34PWn1IDY7pk32Wt7O3qZi7fvoNBneLu7jG2CM6pqZC5tIbZGgL7Eb8mEY9H8JYL3Kx4Mj9xYHdB9Is3PGUL9y2yxzNzV31Rxs78XGCAADZix6AXWpqTQyJlWFh9SD48MrhiTaugGGZkwrJbbMTIxuyco4irxPtdNhGgBzqBWMgDIJv6eHx%2FWzjVKLVz7YMHPEsw46Yh4e3J%2BGb2d2%2FlzX0dekfRptrXBltx2bKfUKi%2B%2Fo1UMIoYEPDAaujQn5ydAQ3d2ofnjAGBbUFIfiqNrz9rD%2FLzOzq2rJ9lG2lD5VMyJ4kXmz%2BkcgkotXi2m8v1P6LXgdNigLyYE3NIWfhKHGUWaL7YFi2TKQj9L6yGz%2F0w2ufizQY6pgHhyBtle7ZY1tC2UB9BvmCnjIiz2k03wBfYlUC716PaoQt%2FxP63PEtiUlCJTTK7epHe2ESwdtPLspAqvpDtzklWx1v%2FlLVKeioQdTVxfAC9bp2ksEGw6GpzJ4xVtS5mqo1kt1FQrNIThQXoLXeXu27f3Ji6d0Vdt9jpar3DYTCFnyb8Tk0BgVPVmaC3xUBDyi2opkLOv%2F6WwwOMGVXsCXAKyhFHrsRg&X-Amz-Signature=f7e72b16922c3479c6ff10314f99f164ac13aadcce8ee2a2a257f9ec6e320510&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663TMYOSWH%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031402Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJGMEQCIC9LEqfX5hweiGSY49s4uOlKk8OexemlSUQdf9o3PvVEAiBnNK%2FR4hq%2FbHmbqIJ39CwpLYICLcbrT5vtl3ewenArniqIBAjj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMrdIpZ%2B6gsy34QooMKtwDJxz2pwAWKMt%2FKJpEEygdpp%2BNmAjl6qCllte3sMEauJbq58EghKie1nF7cvH2ugLFIuUy9z7F5lQtDWKDkBM2%2FtY%2BzX6Wp0BNHagnhg7v7ILUg05TcPXp5aavMI4BlLvUZX%2FvxxxgmXJCI4cglwzcScXl65sLgEEN4%2BtZnP%2Fi93moCrnxmjBlo2px3ux7QfRQKkZW4ElLS5GOP8gFSnw1ox4tumAvLQ0mB%2ByynviGk0EbE18A8hm0JMnbsdoBfv7LvR5d2f9W1qGjgCKhA8pw99tRqG11IcW0OoaJc0qFI3gQUV%2FGdjUQ0gLXmzSoXCmIOZ0r0wbwZUEPVfV5kKZ62ipRmC4C4JLac6QtY6GUUKgpW3DtIpOLtZMYs0Q6m3Fuzl0hvgCsNnryqKVTV18GSxNAP5ArflV6ELB9aHG0fM9sPGp6TFOovAgKq4gGNJH7CvlZe7Nqio1qlSCFH5BUoKy3osctrNpbrqOVPDHQYBx3j8f88KDQh0Xiyy%2BeMajO%2FPVweRmHZGw78YCjTLxCUJYdMWCLe7TUUF06VzB4bZfB%2B%2Be5U2TiFEAfPn2duBvcR5ZV30epk6yi8fawGZihNALc%2Fv65d%2FRpzFq1MMyQYl0xoRj4owKdsauztPUwqefizQY6pgEFCY4NeV32cJwsyyrNGgn7RUT8PHWdKPXMWIFpfjJ%2BEa0dzDbM%2FK005l%2FLb4%2Bi4y5JJm4hzBgB%2BloXdHdocGLO6HJD%2BJv%2FZzDgU7NGPLBuAterfvggoNUGFt21qZprlvWL178TQELp7B%2B7MtC9%2F38jEoAiOao6xBflulPeYkY7hgnMBrZ81SnI5un6Vw7XFcTW5pkZnsSRPzj4OP7dbexOUYQfsi55&X-Amz-Signature=93f2b32367560d0b8e023090ce522e480be9a4f00cfbe3f2f1dd19a67f42a22e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
