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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662IJWCE4J%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDO6pYh6Qso1Sc8MEynAeaq49q21mW0lN6gjtmMnSeqAAIhAJVEmVl9xzff%2BLhiUuStqD5AW3Qf%2BS2WA0qQJvoATdjeKogECKT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxuIweTFSYR0bItK3Aq3AO2Zv78vBVfVSkKraKqGSecwrCWREM7wEkgJYgVemDQIq7cRhiFGM4Wu88vM6zzRWn6KM%2B2RADiC%2Fv42PXXc%2Fo2HWoRM5ZNOhV0OFrDHuC3SeLnkf41Ar%2BEh%2BIt0DRdGnGEtNIUo%2B3wppFkChCmG7%2FeVSxGi7Eoulyp8kTY1IcN4LXQX5ClxtmY1nOZVX02cXweWQdSfjqFw4ThTAm2304gESCod3MUAKiVc9puWeXpQT4X1WmGdvgLwv%2BRM2B3eg%2BVJfAxtPC7TBed9k0PDdxRYd93M1wJSzBvydTibA4a0ghSN6qRnyC%2BR2RK8qeOO%2FVW2coepmk2524ykHAdtaOSZUVyXAX4EOWid2trGvSBf07mTi5%2BZX%2FDUCwTxTD%2Fv455LLJpy00Tv0OD8d6Kqn3%2FIDMXmyGQs4Kt98x3HMOj%2FwbPG2K9V%2BdHzhcdQYvFphaGtPx%2BPRtdkDZc10FRa%2BuuU8sV9Fa%2FOTKVHtbAWTtcTAxW1JJYHQjG2FpEicwFwh%2BOLNfELEEKPiDOo2B6J1Chidg9IzroPpQK6wKzl%2Bx%2FxGC6M8RhPm5mnlZ2gMGNqGXtGcqBYbENSr%2BDnJTyKpLplu9Jw7hOiwEAPoF8bA%2FdAkX4DfqFBIhIj9NwIjCkpo3OBjqkAQWaZ8jEuy2w5iFtyHFgLP1wzWNUsdkjevuWaGxi9F7Azs7MO4EFueFoexcdFUxLYxtiTbJhblyP1U3Bv7YmN3TM1vPe9%2B9rBFvHp3seWoNlRGknT5xekEAMjUGjo97FK7tmIMZozViwTUQdh%2By61HqaT%2B5wcKGh2NBDxN%2Bp5IWdzDlVlaoWdn3Okg0no4CGQabslpuaxm95ISYjnezenmRHio9%2F&X-Amz-Signature=9ba94dc678de25ff6bcfd44d7b38c0bf44dd8a60e65566ef755620015046d51b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WP7C63LM%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDM8A64lSsKemwVAwshdSmvGqkfHcAl6yglRVuFhC2y0AIgeC4tbYLSAmZSKP8ydPnqBsi2I%2BGdwL4lCL5%2B4fWdZqsqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCwxpfVZM6QWarNzGCrcA0x33A1sqBEy%2Bm0ydu0gZhe6vWiz6AcBMSF29ysS%2FvgYdeZw6koQ3RDQ0G9e9R5jFFKkGLr7r%2FvQ9w05E%2FBGSMxbU0qiJaCMK%2FZ8tAnjVcZKCJR9pzgeDZciFgSz%2BDNX83i0HczjIRqEEc1ZCrYPymWzFGib2sll1NFED5yaOzCf5kc8nepLOYf4kfTBgvC8wJKOPjVrfDwbHJFTi2oAhCMUAkhRP%2FwX2gfdmV9pp8YY2ozRz4hY0BKE%2FXgi%2BdWIKIvZPY9hbPQc1ZzmH1brIlN9yGrVpmdEQUxJdv59iw3p4WS6fzkuSS2pD%2FOIEhVm1pBSMJrAsJ4bw2WLZF2VAPuo1H5KAc%2BlSFeUqraqQeMduG6MGIyxfDuJbJxNey%2BYqXzLwk3ZUvRSi4%2BiE4vm2g1L0cPtTnvVE4hATBvjsQDwxS5j1LRNTyds9aVsk3AhQ0K0wjGy%2BDy52vKIITYCwSesC5qEN5GnhuJoAmePh7cux1JFSIFlMSD0ebO%2FrNqgfxtss3qxjk6ixx3v6NlaY4aAYfnGv8fash7a9XpfEeJHmRboQE%2FWcIsFL48tqXtuE%2F3KQ98K7G5e1uXRm3r6Qi2n1LimTjwM9FBgP4sX%2F1lTS8dppibYzpQedTfpMNqkjc4GOqUBKIxE8Uqz9AYPO%2FpYLbklMe92AwZHu2KfYv8M5UndPte9K6xzgvOwXY%2BoPrS%2B1tGlGzKtzJ935fcqh0iQubry6dgbHJJltKZV4aMAcXqXNxdv77fLPqcdOnR0lOMXOEH12J%2FViTAhGsatTYNbAXm3MKESraAjnSxxskqu89lMIDnrb39syZFEhCTw1qckecCXB9taHezfAXBgL8Xf%2B551QHfIrGj1&X-Amz-Signature=5de14c13a1c3b8fb185769725b34cd88cf0d34d30326d3dce9340907fc57a126&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666E3E3YA4%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032044Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAtbDfu5cAkHxRQYYsj6ZsDQXfBUhDqk52yODshZ%2FrF3AiBSIzrYJ3RzNCV9G5N7eE2qVQAEDDTUK%2F1y%2Bzpl%2F%2FFYhyqIBAik%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM6YiRlI5dKaimd8kAKtwDGhwNcjRSwq2l7qLP1dmT9SnlhotmhOvHTI0uNthp2vAHXtjsqOwjy2ScCUqo0oKzDTQl0R2NzXvte3CwlnTPwyZUOm%2Bf2aY1WykRW17VQJeeURsZz5QqISRL9RlKrcImuBtSkCTURpbro0MQnAAEToArqIVva3o7OjPcr4WjVwQA8PqZcsDnBrP0NtSofnJ1%2BrpRbmrIj0FU9yllkfDcntQT1KZxAMFNIMGaMFFrMosSBdSxrPQWvHlnq2UNw8nvwlMXSXA6R2eNG77rx7IIuBqJdwzDMymB0EYqX80daXsWvxTapEGZvaJNUwE1YI5DDN46Qkz6YQsLhlJU4tWxFUCgHLhkfAa4nL9Ebmu9JOcqht5JqCgAECHuXlksJ%2B%2FotZgEvUY02TF7SglQytRgFHS5KuiezTOtGwq%2BwA4fSJteTkXEl0tGTadvuNjxg0zBsP8CM9l43fhpslhPBKHxe%2FEfxIB08c194sBcLj4F05m%2Fkzb1cHPg0dtwuJFgw%2BnH8XvILeStlO%2FqAMKPacsiKQhbc18NWkWSi8mw9GRzaPI6z3VjxwEh8qYWOHq6VPIc5S1LjS8dctKeTv5lsrE2Tr8XdKIxwjigmS3q%2BdCnLQZB%2FLg8wiCkQrHQ09gwmqWNzgY6pgEoG6GnJ92cjTsP1JblDK8sdtSZldmN1pWWVxHMwIwXjItTNj%2FRZ0At410p9%2FOFxSiSdMMhcZMQcTkVrzPdQzJaU0bphkaEE8GqjVDOTXmcRi2ct%2FiP2Dm6evY30vLEm9f1gGMR1io%2BxMFWl5WpDLfuD7DJbgFhCl9P2rtnVp7uMWHSGAfg7KHdxl1EGidNO%2FDeqWbUc9pVjS8IHOk1aJ5UAK6r78l2&X-Amz-Signature=1932237eb406fabcb60988895300bd6d2e208944834a551a8b93367a642b69f7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666E3E3YA4%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032044Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAtbDfu5cAkHxRQYYsj6ZsDQXfBUhDqk52yODshZ%2FrF3AiBSIzrYJ3RzNCV9G5N7eE2qVQAEDDTUK%2F1y%2Bzpl%2F%2FFYhyqIBAik%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM6YiRlI5dKaimd8kAKtwDGhwNcjRSwq2l7qLP1dmT9SnlhotmhOvHTI0uNthp2vAHXtjsqOwjy2ScCUqo0oKzDTQl0R2NzXvte3CwlnTPwyZUOm%2Bf2aY1WykRW17VQJeeURsZz5QqISRL9RlKrcImuBtSkCTURpbro0MQnAAEToArqIVva3o7OjPcr4WjVwQA8PqZcsDnBrP0NtSofnJ1%2BrpRbmrIj0FU9yllkfDcntQT1KZxAMFNIMGaMFFrMosSBdSxrPQWvHlnq2UNw8nvwlMXSXA6R2eNG77rx7IIuBqJdwzDMymB0EYqX80daXsWvxTapEGZvaJNUwE1YI5DDN46Qkz6YQsLhlJU4tWxFUCgHLhkfAa4nL9Ebmu9JOcqht5JqCgAECHuXlksJ%2B%2FotZgEvUY02TF7SglQytRgFHS5KuiezTOtGwq%2BwA4fSJteTkXEl0tGTadvuNjxg0zBsP8CM9l43fhpslhPBKHxe%2FEfxIB08c194sBcLj4F05m%2Fkzb1cHPg0dtwuJFgw%2BnH8XvILeStlO%2FqAMKPacsiKQhbc18NWkWSi8mw9GRzaPI6z3VjxwEh8qYWOHq6VPIc5S1LjS8dctKeTv5lsrE2Tr8XdKIxwjigmS3q%2BdCnLQZB%2FLg8wiCkQrHQ09gwmqWNzgY6pgEoG6GnJ92cjTsP1JblDK8sdtSZldmN1pWWVxHMwIwXjItTNj%2FRZ0At410p9%2FOFxSiSdMMhcZMQcTkVrzPdQzJaU0bphkaEE8GqjVDOTXmcRi2ct%2FiP2Dm6evY30vLEm9f1gGMR1io%2BxMFWl5WpDLfuD7DJbgFhCl9P2rtnVp7uMWHSGAfg7KHdxl1EGidNO%2FDeqWbUc9pVjS8IHOk1aJ5UAK6r78l2&X-Amz-Signature=c077803636c4849e9d72ebbf794441f62f5bbd0a18787602580def042cfd50e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZOQS7XXL%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032103Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIADz3RYVabb%2F9XUSRnYILSsYgHWbY7rD7m%2FanQE8ubI8AiBKEC%2FqjnVIWoEQuC181EbVXLFEIGxxcpdFRFODqxZykyqIBAik%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM1iHwdFknapYdvUpEKtwDc7nBNonGBJewpUG6PDeG2P%2BqzJZ7etpQ77nRobG15yDyAzMs3MhDkiIJ2%2FHJiFpa71Jkps%2FduHT0zGBwjHtE0XztADsreHaKXCqH1o0JpgT2jdq0ruF6wxTD3sdkOrmjQsnVAcKiWVb89KhzYCZgMl%2B6fDKTOWEHaBRWgCuF0euSGvcH%2F6AYQ%2Bx3i3YdDeJ8ytwwC2kePxkOFhVxbYI%2FE3ud85kdK28IaWJ29Xsl9ALoClm6sX4UxUrkCnjrgex66%2BUaphgpWXwWxGPFuPt75HTobQOIoGWEMlzL90JXv391qFuJBJZR1G6umcHiD%2BQt%2BPynxeYEvt9V1yCUuHbkn8JXx5wUXOWEeJvRLt2NUhc%2FjIj9zr1eZdTVnUkPt9V0VGZ5v5LvfuQpr6AdVKagxu0rueJfznUN9nxJ408kVNlOiIA39qdns%2BLNXckI1fM9ybKBbAWueeWFHHtcDYg01Qu8CP0sAlceRXkwhrW%2BPJKgICk3M6%2BPHnrEhwMJ1aYhki9ECAGjL%2BMjJy1wdb5S9eIsHbmofD1S7yDRHS9NIOSWyuDw21HMlILItCly%2FGZB7jnIGsBUcPlTX3PSZs2ELHUM8j2QW4jegqBRvm7rz%2BhBRhbtj9MwZi%2F4XXUwvqWNzgY6pgGdHtOq0%2Fx63d%2FRidRVWgU11a0AUFWXep9ret07eHSgVhbIJAMCxElXMUZ%2FdUU563uKL%2FPDLWmBvRA4kIFvYRXMv%2FemwMiypjJUoRbu1bkORNFLqMlhHyK5grIUWnk7oh%2FG4JYFprUBbz41BY%2FWhv%2BflCXKLy7DNmHFnjMdxGjO8WgRVoNswqT9NQz46BK8E9%2FIUdMrZ%2BRRteJZrKiiAhNVqRc6T3i1&X-Amz-Signature=b7e1a6fa57fca1f2e49f1310cf81291c3944c1c5b7d0dd26aeef6fa6ff3b2201&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46663M224M7%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032108Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCvjY5InM7nebP4TlGrgBCetRrYiN1CO8Sq3YOQXDvJHQIgcOT11GFslWBzBPl06f5N2eJDgqsM8non55BwXOnQwGwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM4CBy5BOu92QmCfQSrcA9mW0CSpH%2BtS1Rk8OHapl%2BTNGRja6iFJwvCb6XtZj4k9ZOUsvUF%2FSR2gmwNH7lpBe5LVfbrsFbZbKCm%2FccTm8Ev1qvLnrc5mXp%2Bm2H1IFQd%2FZQE1Za3rXI7IjaDKAVzjZxpF6qqQITMvWKgSEZ8FjbN%2BPW6sf5JppabQlA8610enM8Nv9uxG4Z8achbUQLt4JTi44a7%2FXEF8YQVoSQ%2FVFuseCyQcAhn6V6K%2BRRJfNHsOHvYHH7xdp8ugM1EBHTIhsO5HXPc6SIJEBxLNwu1vQaMCBecGyxI67fScmFMytkmHR%2FPAEZHqVNSLMRJ1IyMEJm%2Bf%2FH7jJicVnzP3Kb9AqwaycibSnzD1GTJGP4anQQipGFlSGdvFOEL3k6ZaJt0GwrbGqv%2Fcvhb8XSDuTlvJ6Z1ZgB6h4k4msBKZpz%2FjTY13RLmTTI%2B2D4r3Iv4%2BHuWrDMlqmImOzXeG8afIMhY675wkd6zwBpehg2kPp8ud%2BizEcbXy5XjXSUOt6Y4sdSHJY5PLkEGP%2F4lxM5rhbwcYn2Jw5YwJbYLANcIOHWGUdONxoX7wXCrSaQsPF9jy5WA6YEelq3oQ4pe8CIZITpGNZCcX9EmXFMVkCH7hl7fHIhHV5%2BeWxU0JNz2mfkq4MLunjc4GOqUBgL3bJBMmypQ5xUg3348Cd4YEWqTaVH6F%2FJ7YgVjdVyuamAcprjoboQ970bXinHmTMTQFTN574v3hZsJJOC1bIjYlvF7zP3wDpTdqaj0bjHNMN1pkxU9qaueeYbVxABtQq3fcwbPa9NHhg9x42fgWUg%2FmvvgJqxA4xJKjIpaNrERrPxNXaMDhvjtYgJBi0jMxgiPWTMa%2F%2BTLR3MDWTHYcJxe3IXTu&X-Amz-Signature=259e693693cfbe3c4e0acadaf4b6c4da22245ec12100504cea408ae969870a7a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RZYECKJ2%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032109Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICu7PNE%2FuMgnwS3p8BAVrXnjAM5bwofwRKgNLkAJrnWYAiBpehPFJCx2sC7DDvaTpGOeXTD7bLBaNFsAbygh4cWNMSqIBAik%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM7R4LlzEbs%2B0c254HKtwD0OVxJgYOvutU4lLGDM8fBdPOnWHkdT7wmsaIpBqIpqO8Hfq7Q%2BHogCdKBwVqHJkLR9p1eHdRe8RnDiUr08yScuUnrIrhwZQQp%2BOXNOeuFwV4LJotzj37284t%2FKTyuIifE0W3sBMzVpUEu9oivdPzDDBw9hDkRwOb%2BEta9YmqD7BbWss%2B3Suz6Lh03laJN0moIqJp3mZeGuNTwEUQIDJERO9EIXDIFxsg8UZpnlOf9djK%2BJfZ9KdT6uDpdZkoL9MNdNe0iqt3vRkI6zf5Xf9OpSRpwJqiIg%2FN4SQTG4kLOLxl4kA%2Bq5NSZiVwyGOia%2BfJSDaLiaKOW4LLpGzxd%2BdaAhsG2O43fvnt%2BwPsmnBjFJQOxOvf7vyTMadWNxlucbWdLLdl6LIgib5H1oVrPJ%2B3mS8C7GSsb0MGA%2FQc332VbwI90LXv60OS2gK013rtWw6F8FqwIiv91H%2FeD474UW%2BiwesTk3Pifo%2FNJlZO55NLiUemX%2FBHEcTJiVnijDqjzIxOGYPPu1xuEg6W9t9qj7SN9Yqe%2FjIvAxtnQgZyCiilCk5mWME2%2FigbWzGQzEWX6u6QGBsHoXH%2F1ZB6ZezN2PTD1mySmY6f3OYKQ5ziD8AEwW83B%2FymCc4zw20slecwn6WNzgY6pgFml%2BrAU6V%2BO2F9w3bjrhoWIijcyhSk9geUeMa46PN%2FsE4NIJbD8CCf5VItzGv2lxhIrFdm7KqCWZ9zHBnSfuPtbkB6Rk9m2ad%2Fvv9MdX1fo0mIK9QvbCAyLvdRYFSS%2BShSQRikkM%2BO4kqOHoKPQDZ5ljMjHVsCH3Ad9xyUhtwUalJjtnijDsGL1FRGh1fBb4xyQAhor%2B7zuClkLbiFKVapeA9dgTNS&X-Amz-Signature=5a9c251dc3c1052aa5600b3485f0b1a90a1c1eed23a307550c4b31dbf4e38a25&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466URLSEP43%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032109Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDBJipIHYuO5%2BoHER138l%2BmUKQ2IiBB5e%2FzJj2tvShnwAIgMTOamqs1xUIcNsmj3KQ6KyqsMosXQnOeC0lUxxK0qNkqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLRULKzoea9INkjSeyrcA9PM19%2Be58%2Fml%2F5wFnpZ86%2Fpl1P8Rz67E4Srhlonsd5r%2Ff7G3HfSkUKjSjfOmxjGv7V1rdy9yzrcj5fL2BIRkcFLuldcZXvjsvxAmWdoGYmE3X1dh5TFCV5YKILT3hHGo5TC%2BQc7DEAEWe%2BaiArdePjng4cr8dpe96%2BjYUDLOUct8picNKCpu2ze6R7%2F64yk3FphOyq5b3KnLxFHtBtSwne9tfhfiaGGA73DSDAMVcNT5W6b%2BlsonkVusIp8XTl6BPzSFOMP0qepDvSBZT3t%2FMgxVlgkmb27mtIGjYuW77ktpQs4z17vfq4Y3whV%2FekdZTa4BOLYlQnFP5xgpH4rQxBttogU6ZCr2aAvCtgvSrNcGA9p6u9U%2F1wUGrIen47y4YcBOG%2FlmYixUHgOXXmvCMchHewsYgyhwcHwYUUkfv72Ph6ijn6eJhn3HHG6NtluNBdmF2ZCVc5SbKZiaMm6sDGausHq6adSWbkMlgZ5JWSRKQ2BhgwGtcx5F067NdYxNze6m8lUppuvRWL14GByW%2BPSUw8%2BOeMtLLEL2U3Rb%2BVmIe4H32INZddV6BX%2Fkt1myS%2FLYbDCFNMNzFvtDKUqNLM2LgS5xFG6m0V5wtNeCO5gcCuY%2F1HxEkVAS5LHMLmljc4GOqUBdgntFsTX4XLlPC6ZkklMHiuvlWUormnSWLsjA2YXI%2FZ5AI%2FWA8t%2B%2BupEgZJHnnyfvQ7kceHjSrwWpJWX6oOIYZAQ0yGOihUt9mVI%2BGfOH92t793ASAjTfQaoXTl8RLo2dsHk74agidJEh%2BXs1X9TR0HkrYtCilTfOck%2FlDRT75Yf2o3K6%2FtkAgQqt6bXRcqBUIfU8f3%2BSew3ZHfNYDh0DwBs57WG&X-Amz-Signature=3166830c0f1989a966588af1ce69b6b51ceba80eadf81126e4dbdd715c3d2689&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666QZ2CGD5%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032110Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCP2BEt%2FJAnDaLdgO57A0kzKKbLxASOBsXrWr4KcIFsdAIhANhX9yTdJQETk7djt4xk7TWWcCX4HKUUNbgiWlCtGufrKogECKT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy3AXt834A7zG0%2F3hsq3APkbCUH0kC%2FeWZ67LhOW6CCTvBXgPgVTIZbDZTO5Itll1tjKGkdWnOH%2FRgHhh%2FtOKnxOyRBQcatfBF9XLJxAk9lzr7ZNSXAuv4BErtPWXx5tW42DYztSfL4y5OS3ssxmYeYWYU0jnSPvUHH8Su3umZEmS5%2BihMtYJKAFaxjv3cB8na06nHgorMnx7wuhIftMks0pWYN7k%2Fkzile3HHeW3%2FATxh%2Bw%2FhQ3WVgkvKrtNFdGb5MdQWzX8N8DGdxcfMlE%2BTnV6nXWlGDGVqjZjIi3sD9o1WnKO%2FuVUNykDtgjoyf1n3qCXB6s0ZuEyHfuRfsQDc3d7Bb5ZX0oOTrY3JYlJMBnG68hS7Y0CZE5LjdKTcjEqZLnzdJ2OgSfXoiVRb3syk7qUFr41iZhfjRCmirVr64EqTLLlImXWlYw05mlK0CSd6Np2t4MgIcnKyVfLz89tsuQXZsSczmBxvJ4x28IgVCimlfE1fn8xeqEKWApEhjlPYuP18pAHjF5u2awkFariNT00YgYt%2BAUszD5tIO5cz%2FbiHk12VvMY0oi3rxE9w0euGsQmrhWhOL69Qx87zKlsy3s6E02lhCZUhdkqOMdSxLtltAQZAKG2yjzJUcdSEEirQBv7LeipAZ%2FlSddTDmpY3OBjqkAQ04VPpjxKCcelKYda69%2Bih48AL3PpWZSIVvhy71V1rOlENuqIBzMZe6fY%2Bel4eL6fPk1xuaeHB1nac3CsANHvA3jbdpUuZMuf5YB%2BQIUwxRsdqhVO%2FKxbKNQddEpqnFfB7%2BHSN%2Bdpvg%2FRDr9uXDt3%2Fc0MI5QcHnZCRPKilzJj7ECujZA9Vq%2BIwgFsUhkQ4PsDN9yTctE%2FGA5GpvmkF%2BtqgkYQGl&X-Amz-Signature=10ed24c0bab6fc4b4811b51b5e34b9bc68e74d1e45363d603bc7bf2f3c4ddad2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666E3E3YA4%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032045Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAtbDfu5cAkHxRQYYsj6ZsDQXfBUhDqk52yODshZ%2FrF3AiBSIzrYJ3RzNCV9G5N7eE2qVQAEDDTUK%2F1y%2Bzpl%2F%2FFYhyqIBAik%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM6YiRlI5dKaimd8kAKtwDGhwNcjRSwq2l7qLP1dmT9SnlhotmhOvHTI0uNthp2vAHXtjsqOwjy2ScCUqo0oKzDTQl0R2NzXvte3CwlnTPwyZUOm%2Bf2aY1WykRW17VQJeeURsZz5QqISRL9RlKrcImuBtSkCTURpbro0MQnAAEToArqIVva3o7OjPcr4WjVwQA8PqZcsDnBrP0NtSofnJ1%2BrpRbmrIj0FU9yllkfDcntQT1KZxAMFNIMGaMFFrMosSBdSxrPQWvHlnq2UNw8nvwlMXSXA6R2eNG77rx7IIuBqJdwzDMymB0EYqX80daXsWvxTapEGZvaJNUwE1YI5DDN46Qkz6YQsLhlJU4tWxFUCgHLhkfAa4nL9Ebmu9JOcqht5JqCgAECHuXlksJ%2B%2FotZgEvUY02TF7SglQytRgFHS5KuiezTOtGwq%2BwA4fSJteTkXEl0tGTadvuNjxg0zBsP8CM9l43fhpslhPBKHxe%2FEfxIB08c194sBcLj4F05m%2Fkzb1cHPg0dtwuJFgw%2BnH8XvILeStlO%2FqAMKPacsiKQhbc18NWkWSi8mw9GRzaPI6z3VjxwEh8qYWOHq6VPIc5S1LjS8dctKeTv5lsrE2Tr8XdKIxwjigmS3q%2BdCnLQZB%2FLg8wiCkQrHQ09gwmqWNzgY6pgEoG6GnJ92cjTsP1JblDK8sdtSZldmN1pWWVxHMwIwXjItTNj%2FRZ0At410p9%2FOFxSiSdMMhcZMQcTkVrzPdQzJaU0bphkaEE8GqjVDOTXmcRi2ct%2FiP2Dm6evY30vLEm9f1gGMR1io%2BxMFWl5WpDLfuD7DJbgFhCl9P2rtnVp7uMWHSGAfg7KHdxl1EGidNO%2FDeqWbUc9pVjS8IHOk1aJ5UAK6r78l2&X-Amz-Signature=0edba27a3cdc5d950bb5baa681118f11cd22b0dcd55fbf2145a6d138bd1de9b1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
