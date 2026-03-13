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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XN3HUKUR%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025450Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD1Mj%2BmRkMRGUp3BTF1C5G6A%2BPnWPEveR4x4fBDUzP9EAIhALaijoPtM%2FQru3cc1a0mwIUlkKbW9rVDn%2BzZEGcJg6e7KogECIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyzNuNtFbUcnPQdJOwq3AOLWGL17UtPKecHJmdiSUpF1Ax%2F460BKQ1Wy2rvZrxGklX1WB53Kelv4yULa9sWduIfdBU%2BHrE%2Be3LN1HYbEmRpkbgzKK8NuTMmNxQjSgkOOcVMu0xvuuOe%2BLncFF5HeqyohYf6GBndGIJFZ8WTPWisOau%2FqgFc7KiZsxXaFF%2BL%2BzXwtOuo9T8gEgVFU%2FPzRGn%2B8Y5i2cwDCzEaHV4ut%2FrTWHwFHPZbAoyCreYZ4i2Dx%2BpALyPzlL6LHpAFKPJFAGhF4IU6juqsOAJB0zUKvjBH2YJS3UMXRBazEbYEgFXhOfqXOfw3ufJmhGKdtnRphQhRa0%2FMGJfA1meAcFE4lNGUeehOzX3R3Wbge4X0Q6qWEzTsIN%2FCsWXvOq06oekaZnLfZ6U4Bqflo4UG1MvTus3NoyJTho1mRthCv9hFjffZ%2Fdp5gzBxHD5cz3f%2BqZobaBcRduya%2FbdmFdRLXZjAPG2H%2FnXRHA8REEFizBndgSMxe7SZtrzvNnJ9JXG%2Fm2kL9wx0QiqHDwPx7K2jaxtuGpf3OdoysT1UYxCGdEvB3Yy%2FpDtPUv2AqxjZKAkCxqlzaMhMV75UM2xpWmJkTT3HZtVdOYOcp9SGZ%2BHrafT4A%2B%2BewYpe1vuuOuCTt7SKMjCguc3NBjqkAc02WfTmeEMxH%2FAlWvH0HuuFbrvQoUIMYCLIJSOaEFUX5RzZlRMKeui1hJ%2BUFl9kciAM1OfYnDdYmcLhkmc1707lQcTm2cCjOhbaXte4u%2FTSGwcKeA%2FY83X1YcdMCUp9Tkb0VDH%2FG714QcuSsFGKY2hRSyL5eQLTyDmLAgwJ5LFA5buuceGdrNk8mI6ptebdLmDV2DWEGfhBlsqKXy8IODJ8KmtT&X-Amz-Signature=ed6c5733d4435b849d70ec8ecbc37f7d83a6f6d2f88c168152c6d1035a1e7b1d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNWCJPAB%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025451Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCucqL4UeT8jkuVbEamOlxGJgWX%2BVeBb5bljJgtAHxW2AIgSXa6VSRaVTnJHl%2FUCb5nJXUK1sGSkdPyZszTIxipM5IqiAQIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGB0EihrVQ3HnIDbmyrcA7WxMUuGCLjV0TIPBddGfWv%2B%2BFyE1dEkhcfdLMQWCiMsZKfOCysH84ew4jIJAQQkV7VMgV77Fw50A%2FE%2BajE%2BJRkP%2BNqlIJwa0ktB%2FbWRMA19ZbiwC9K%2FK0xsP2d4kXxsX0eC2CXRBmNlveSj3a2x8PkGHCtrI7%2Fei2BzQr69mqr%2F4R2bUqvovlXhbG0HCaTeNbcTVfziruYK3gwRkqqPwo08Zm9uG9XymXPbDC%2Bv45pTTx%2BL%2FElFuue8SDN%2FNVa0%2F4Wws21XzuoVWWB%2F36EsTD8whu7RRXrFjSBdsJfjZpFHh%2F8iGuH0IMAQ5mezspWazCpOxsJUF8pOPhS2iCBdmQ1yL7hE2D7%2B2cDZ4Hfqr6b8GXgKlQRwcNtuf22uOPGCzYDGtFje91JTM1PilButA4Bbpoy5Cx6AnLHxr3oQS9%2FmD86PM8igB2tZTXg1ANZOZGGujnmx3AU3Y2PuAHpCzJbI5w73owRIapskAXRkqoLm3ohTVBAKifnIUWnvYK4vr%2BCJq0VdZ83K%2Fuie2KMvMx5cCQyFOTtaO4M%2BeV%2Fbdvr9ARZ4ZWJbtMCih95rtyYcBTtC6SnOgz8FewcRHK1i%2FNRg%2BAb5ZD4h5T5qHrV0SFkQPi3nJpd4dEzWLxCDMMm3zc0GOqUBIdIM6ESpWpk9fSD8bIVWItI2ybA526%2BbVC%2BN%2BD5RRI2qsFioBZH8pp6KA6ukslV1%2FKYFqbdCBhOpl5%2Bj56RHUmo66IeBOECgh6AdiHLiM2QDWmUILKsodWBBWIigsMHhJzz6fKWp0HkjIrxaR%2FjnOysqliTWDhTvQfDgMUh8xIwFNZYuknQ584uVKNgkJx76W7YwZIaoi3Yp4cJ9UD%2BrO7C0WJqx&X-Amz-Signature=461e4782be409effa37319fd7a34338a108d9c85dea3070d04f59528916aa67c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RNMYTYEO%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025442Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBtYWYQQ2ai7qVEbV8H5m8ExOcugiSw6fWCX4dsJdHf3AiEAmXh3PYvfJG4C%2FFGOAX3flcilmCsPdp4CyxQXchBmmLsqiAQIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBAP0AwNMSUvL73bGircA46ODiu6o6VnVdf5BH950dWGuvADYr2aq5grbM4R8td2fW%2F3J%2FT%2BZHvnl4zGlQiJSK5j3Z0Z0kqVI857vinokpkEhh6mMbmCjQkL9BWfG8Hol5KBKJ9meqgQQmt6hzTjeYXvC%2BLeN5I%2B8I6PirFaKqE5pJwt1i9kU085fsoaDRTma5R2E9hnnJy%2BXCLF3s6MnNzVjT9s1GWi%2FViKdzs7H2qWM9Se6%2BtjPgaZFy%2FYNEe86Gk9CX6rN7SWdzBgKFhMGW3zSFK1GtpW%2BTE%2B18SMX6aTYc8gEJ3v%2FWVmkoqgqdDzRq0qlEkQsaRWN16MmT8iBkKeEJzGLxwAAdmAAuegXzRV3HC%2BY%2Bb0a4Wm6x84y%2FGkIoUAp323ztUgKVJJXROGD%2BZmq4GraCY5VXmNdlFYN5mgY3jxyw%2BTLkl0bZW1y3dVo2Htn63%2FAV%2Bf8IHDi4FY6bAOhDpADJRgCLGbZyryXW%2BPcdUJRgwtdf07kHSjLeizPKEl5AhX5%2FZi3flie6nw3f9yMXW2GC6%2FUEhRi9Yf9xfxet7YkdqK31UmfP8jyJzxsIjsKOe%2BWheqzjEw6DY3iTLBovGxq9J8rcX1mUUQCxXQ%2FijQPK3pdy5UO%2F4H6fIFXh4UU7DBryjXkozxMLy4zc0GOqUBbRFE%2F10O1PNxNOl5txW5%2Fl65%2FUTdbf3UcTGYHcupSJRG7yCz%2FYYux7HOZt%2FUH1FNMXqMOWDRHn89csPGvnf5Ul6j8V%2BVePR6rwQqNTM3a3om7c8U0qcDoWfsXGrwZFty6YM9e%2BaRxc1ICBf97pwbLpJv9%2F74rkCNzuTKFOq5iq%2B%2BMG2u0M3yfGPvQP6Ec56Ra4SVpkV8Z60SI2JrdnLYQuzNUvMb&X-Amz-Signature=e9de59f071bf687ed5b73f4031d8b3d48e5747d798518d6ef3026042b883deb1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RNMYTYEO%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025442Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBtYWYQQ2ai7qVEbV8H5m8ExOcugiSw6fWCX4dsJdHf3AiEAmXh3PYvfJG4C%2FFGOAX3flcilmCsPdp4CyxQXchBmmLsqiAQIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBAP0AwNMSUvL73bGircA46ODiu6o6VnVdf5BH950dWGuvADYr2aq5grbM4R8td2fW%2F3J%2FT%2BZHvnl4zGlQiJSK5j3Z0Z0kqVI857vinokpkEhh6mMbmCjQkL9BWfG8Hol5KBKJ9meqgQQmt6hzTjeYXvC%2BLeN5I%2B8I6PirFaKqE5pJwt1i9kU085fsoaDRTma5R2E9hnnJy%2BXCLF3s6MnNzVjT9s1GWi%2FViKdzs7H2qWM9Se6%2BtjPgaZFy%2FYNEe86Gk9CX6rN7SWdzBgKFhMGW3zSFK1GtpW%2BTE%2B18SMX6aTYc8gEJ3v%2FWVmkoqgqdDzRq0qlEkQsaRWN16MmT8iBkKeEJzGLxwAAdmAAuegXzRV3HC%2BY%2Bb0a4Wm6x84y%2FGkIoUAp323ztUgKVJJXROGD%2BZmq4GraCY5VXmNdlFYN5mgY3jxyw%2BTLkl0bZW1y3dVo2Htn63%2FAV%2Bf8IHDi4FY6bAOhDpADJRgCLGbZyryXW%2BPcdUJRgwtdf07kHSjLeizPKEl5AhX5%2FZi3flie6nw3f9yMXW2GC6%2FUEhRi9Yf9xfxet7YkdqK31UmfP8jyJzxsIjsKOe%2BWheqzjEw6DY3iTLBovGxq9J8rcX1mUUQCxXQ%2FijQPK3pdy5UO%2F4H6fIFXh4UU7DBryjXkozxMLy4zc0GOqUBbRFE%2F10O1PNxNOl5txW5%2Fl65%2FUTdbf3UcTGYHcupSJRG7yCz%2FYYux7HOZt%2FUH1FNMXqMOWDRHn89csPGvnf5Ul6j8V%2BVePR6rwQqNTM3a3om7c8U0qcDoWfsXGrwZFty6YM9e%2BaRxc1ICBf97pwbLpJv9%2F74rkCNzuTKFOq5iq%2B%2BMG2u0M3yfGPvQP6Ec56Ra4SVpkV8Z60SI2JrdnLYQuzNUvMb&X-Amz-Signature=ee1e1d61841b9c72b3fa0c914ee0457e88413c5b1b3edca2ae90ffde5c68b9e5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WKSGHYO2%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025458Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBT57pdAew00I53DtEcCuTJsmaJSJP0hsEb7dQOqhwH7AiEAphPwmThe9atoyqlz6kuNsbIapgRNNYyOsOsgfpi3LKkqiAQIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDA1KrV1EjTs9uYc9qCrcA0eMNLJGmqcpGC8%2FrAmdN1smg4Bhten1ERwmcwVFg7wZNrEYtIBbDlCfyvouujjYm%2BpMO%2BySg9xDXhqFbxgB7%2FtyI7jwtciv%2FXaXB2O5ZNV6Ht0ez5Dt5JpX9wri41a4sMfStcFXmUyHxWL6VmzzMYlMNVZwOJbbROKzMbVOb6%2BwL14v41Fd65B0DTU6ZffYw6BNdyb3cVDyFjBwhbaK2L1SXBoTTa1wvlGoGXz8j02hZVtcZUPB%2BYtcsxLAHFN5pdknHh6rqdHbITWAHIjnIIo5H%2Bi9gCWqTCIqR6vnt%2BvYpT7Zei2LqfNZBjY5MSxjnS%2BDtjZIPvk1o7UGvysPms1mMkShP0Qjwybq42hqgdiuf8N%2BVknT9BLk7iWrlfNqCLbYLiH6G8DqHByz3FPg1kU2KnGGwa3cvKUBYpSGhowytOkgxoVval9Bh5YroVrvXex4gIaARjpA0NGnJVVjclZ87uSllvzPpEat1zw8nVFxkTIW8RUmz5WFEcnlUUTGi01D96wHiu1%2B8smqH3mskkBEJkU7dEWcoxVCnNA4GEtrTEIbCW%2FEdziIPxuN9bogDRG%2B6f8E5PalTCArDofKtQIlmAde8hLKkWBTrr%2FcJH00L%2F0ykuouDE91U5dWMJa5zc0GOqUBxDnsHeMW3A9oNWNla6awm4qY%2BWrRZWLTpd0VEX%2FncEKPVOd%2F7qFQNkHdvwEkQd0pMv35KOrpeJTTIGeN%2BtSdh2HNtEo1grWiK0Bql9Ny%2FUKSU7lz5UOI%2B51loPIRhvUtcpn0zZU3PvGi8hN4Ap0QvdRHjS9gbe7LoYJAhPIN2kzzeSxQxv%2Bqu8P%2FSvC8J1oP2lq4wQfVzcXA7R05h%2Fu34jRnmBHs&X-Amz-Signature=f3cfd99082b7ca3ea2112bbff6f87c6761d366ef99e91ea1331d81c2b693554f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WWKQZCUK%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025501Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDG7afC6qy%2Fk0X1vNuSENfW2JmeZgSkwo%2FurLeIwo%2BP6QIgZeKaktMX74GCOSnc7yVurNnApJQSHn2gCOWk4g0tRGMqiAQIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOWyj2MoEW55%2B%2F%2BhMyrcA07f0lE9O7sgCwejVXHMZzdcMCFv6cZ1FVhRK0WcpHselJT%2FCOY3DMNeataJRkc7goahG11MW5ZFvD9NUjpSyk5t8%2FgpVymXqQqDGR4Lpa8Xb7MKR%2B8R1Edf8jZpBJ5hjcO7Kd2nrFRhATQzAUO7fHVlj6D%2FA87db9uaXaXZBp3KzCPxZpmiEaYdfi0ROO7fc9i0TxwDl94skHSjnJIAhxdPHkuWCWiGHRymXg0X5mPm3gh3eUTslqfv4PrRXf1qtRtLDNZ3IyTUgGlachMBzkb%2BlCKz0W5jtUDDfd2z70VMRQazAnLbztna3jnUHKbvdyfulJZ2rlHy1%2BdNdqcVJ%2BC2jwCzojCFUtRVXENLTJXqvknO3GWzWyLd%2F7Dru1V9JgcXwVFo77CGByh0KibIICIqq4deHUIZWy1ZqZW6Z0vsguaskJpYsQD0aFpixgcDl68cRNGVI%2FwOSwaHG6M83QhKGNO9mFnlJyXxjDkCqtvR27p3Rt80Zv0dXrPG%2FTlO1pIM%2F%2BEnOE72%2BAvpfza07OPyy3GGagcdW4DoFRL%2Fl%2FEW5c5SPEWyGgLpO5xdy8RTYp0oFk4naPiGVzgKYjdt%2Bum5xDOuK337QoJrOreUYs%2B2ngRZ54y%2FR3G9p2AkMLS5zc0GOqUB2XSSrU9m5h0yS3UfkaNxESV6Cybx1%2Fk6vEHlYx0Meyx5QXaneKs1KLukLvEviq7ex%2F1d7zDwwhWImZk8fcKpFTV0UZTztp9GBButIOx%2B4dv04aBWcFcqcG4gap9ayov1B0tsVZ7aLs0GD7roxs1eSurpO8TVY7f7Lb%2F3Ms0ZpIRmO7LAcrLvwZrw%2BdZ7A3P1HxiAuIDcph6zLOnpMFCiWDKcGVKO&X-Amz-Signature=06bf244444950c479fe10789bc3df7cf5d2209af2fe01954cf4dd55d4ce49569&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X3GCLVFW%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025506Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBFJo2twbJHqgDhnJZkdmpoXGQKDPQmu1Phf2w44t4KQAiEAlwSsWC29Jn%2B%2FkuBStkXfIF8ngEUWURIOXKllKGYXBaYqiAQIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMQKKOh3517BwJUVtircA0oPUTlulq%2B3A9qEWZtmdSnAX8aNsUOvmFScX5CEku27tfVyV%2FQ64jkUu2AQijPAjBqTPq4VZ7gtACtml9%2FdlRn8IA1og5yXurSKOLbQaufWIPwDTo8Kthr6ElUI0iPpOxhz98fO6l1rPboRavUVXW%2BYEZ5J90ifubNtZfNta4cnUU5FZGYcqMt05yoeqnz9%2Fjrzv745PRYwzD2kwZMqiDpgE1zpJ%2F9w9izl38GtUg7KHQe8fyzLqUTQXkCg7uqica9YoXQIwNuD4Spx9L6EsMcYwClDH%2B2tZ1OfwaQcLwhSpWGRzRG1u5L428%2BrIdP3n3hqkZ%2B7lQzxJs84Oiq99B9ZIYtQi3URVtOsjDE7VkpsIWBuf1zM4IhZGdYcsk6mm5Vvv7EjxZvWjnT85OzF5WhXYCwxGC8UkBkY2tzRR3kywpy6X%2Flks7%2B4ggwMsjqf2gu5g807BZG9MEwBg4PFizo7Oo6uqE6bJ77HFaHIHiZ685O03H1zeU8YTy3SHxx5iOEFjzuQFrpCfBAw%2F5IyiQZFnvZtxmPNt9KtsOC6XvZN9gLj2JAHsVoSwI7e0rDqxmsVeRMOGsSKie59run%2FDiV9wdVB1T4Nt%2BYUDo0aFFe7S2yhGm6CC2VlGHYmMNa3zc0GOqUBtDOokVGX9XbfJjTuFVIm1rq5%2FcHJ%2B7%2BO1Zz9ZSBoxMSNOsoXoszYnCtaGmzq2SFByqNDnpkqCsji%2FmM74%2FjXZlh6CSaFQYFgv50TTvdOU129eQCQ%2BeWOHr8kbhbNCBKztAiIW7znTXIbbly6aFxDrbDsk9Kx8smuPnat6Tucr%2FIB6lfXrXGCt%2FX63KKV85BLN9D4TfFDVQK8ZudPifPWjz0lI4S6&X-Amz-Signature=36eaccb3d8c52f5d62376c68cc10999f803b0692e4b991f3a54070f46b6f487e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664DGZOEVQ%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025508Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDzuKWRFx5r5muURwK%2BTXp%2FCxnfS1rZ%2FUA9zQF8yRhqxgIgGrIs96L%2F400TEZL%2B39w7W2ldHI5W6k12%2Fp9mj3VfKGEqiAQIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCus%2BfopGtGBEwLONCrcAwtCqnKRV6OWNPwv3YkE%2FKMjFj1oBYApY9j%2B4RNvlIZ173Mrs3161lz7b0RdXz7LzzPqqK5WkA%2Bi2Yg%2B8IXAsPAFsE9IdqTDdV8GSYLyjg0uoKPvmMDQtizxha%2F%2B7upda6azdw3o0ZXwZ7mUH%2BfeDMqkK%2BqHf5blwk2noHF0Wd3J6iLW8IRnEzfJSqeY067w1GUT5XORhF%2BwchB3WZb6THaUoChjh%2BOX2d00tFZeriS9SaMYhH7Aw6UW1oAUDnrDuWwbG0T6VsOskUFL6z1bMKydTa7p2TUMiOHFpcDmepi4SLXSUMnK%2Bx7yg6S4uvm98cBUc%2BhcGIEICX1GW9%2BK%2BVZYntpaJQRbgi%2BkMQMUaiu8fj6v02NZcFvUc4BxCl447KFkSO6vlo3h24kAFIIfSYINKK%2BHZExWW0Lvkxt7glW8ImrJvq5eKqp2TqudPqVmX8fFwcpd%2FXZjVNTcrLQaFWraTJ4r%2Be4Vr%2BDFJIMT%2B6pChfHSmdlD3KPla%2FE9N7Ltvw7kXxA4Tuckkpk9mMFOhgRih9TFT9Ge4P6uTkQ%2BXGvLIae%2BkRJ3wA%2F0uly4Rmr4Mv3ipaibzS8CYpz1LJHdQSkIf2kg8g4p8b%2FFKfG3sN3MmSy4V5fgH%2FZut5CKMOC3zc0GOqUBLAgw6nTp%2FGPReNIXQSQsNuVCWy3x4tlqtpqYsMf7VPRU2aZN7vZb90UzMXZHoJNTzs2D06HVDQ2M%2FqvoiZpEkwA6RDq0LqoNBxO0iX4C4OjeF6Z1r%2BYj5xQWGRmOncuvnAoVbzmkGJHdAKS%2BKKnn37I9q3yEnLa4VCnNozE7cy%2B3Pk6pYDXekC3aO2rL3nDODzbD59VDv%2BvHmIqCKliidCJpNB8U&X-Amz-Signature=8406dabd03763c099e3f496b56413ee672f82a55e1f7dac3d0e1ec96c67f8541&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664SVGYSSK%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025510Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDjhdtv8akXOEClSujNGJlJuujEZdWU%2FErorZB5lZiatAiEA6%2B1b%2Bt0LI1gBK4fVsNCaLJ0p8aCPgEgeacgxdLgIvqYqiAQIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDG1kTPZIaBOVwyeMWyrcA4WTH9Y%2F2PLsc%2B2Uu9u6pbrUVvVU%2F679pbZfWVCK54MK4eI8yr7vuee8XSxgyaoqDjhKi5SmrFl0m%2FGrX%2BSWoqNibe0tARi1wqQCT%2Bmxkcyt%2FgfqchQmNiv920OlNXvnkaIyZn1BQPA%2F35GhHVl2WWcGzGCfxS1sjnOiiSgXgTvXtj9NUNdbmNchlky0Knw2PvZLYm74BhTwLaawWcsfsEt7GiepOGwbvPwdFuVTSIjIV5VQkFJCF3V6bBH3hhj6L1nVtiaPAUeAAXUPPPdL%2BL2h4FfuUplOr322%2F%2Fvdo0onQF9SR8kjlNg1w2jenl0fpQeU6rjbhtYOvA07TS0bZfIPK%2FW3JNJaWSAk43x6aHVDJXN4JJ3SDkgT%2B1Nl946EGeh4qNvdhKjP4nr4IdmEOSCqA2dPbbDaPEZP5pwMlEkpbRmP5ziR2cmd1r6FMEgeoZWzarZVchmH4WoDQQ14%2FOpx7Ydx8p6KaFBNXSVmeKCLlOesD0OjCg2QuXyvungyLnmKPadUJ8BZZMZ%2F0CX2OUIGtV1NI%2BThKzkYh%2FRIKkGbse4p2x4kRpXVAICG4RHY7RDj5X2LuZUloKmZddRmyrNWevmLR%2FpQ1SXukSNEkYh6jjozpnLlXC45Su%2FdMNu4zc0GOqUBp1%2Bbw1n35tP9mbwxqcsqEUxQ9QSnJy0tvrANe7Xyk1t3VuliImG1mOgr2LPwSHnpNTRjn2N219z94H0%2BUJr5bC8nsUmOtwoKrC%2Bi0R8aIAALf7YggZUvCP%2FO5CZUfoKXkGRfvB7rCHKmAfpGPB9W4kpenHxsvDlNtd0o9w79%2BzXcx7bHhOPSBcZ06BBYn4kyrSUc%2BTE70n2zpVmYLaH2aDZf4Aoi&X-Amz-Signature=e7b5668ef08a814feeb48b5165449ab32650e469f23eb1ee39aba25f67ec6e1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RNMYTYEO%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBtYWYQQ2ai7qVEbV8H5m8ExOcugiSw6fWCX4dsJdHf3AiEAmXh3PYvfJG4C%2FFGOAX3flcilmCsPdp4CyxQXchBmmLsqiAQIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBAP0AwNMSUvL73bGircA46ODiu6o6VnVdf5BH950dWGuvADYr2aq5grbM4R8td2fW%2F3J%2FT%2BZHvnl4zGlQiJSK5j3Z0Z0kqVI857vinokpkEhh6mMbmCjQkL9BWfG8Hol5KBKJ9meqgQQmt6hzTjeYXvC%2BLeN5I%2B8I6PirFaKqE5pJwt1i9kU085fsoaDRTma5R2E9hnnJy%2BXCLF3s6MnNzVjT9s1GWi%2FViKdzs7H2qWM9Se6%2BtjPgaZFy%2FYNEe86Gk9CX6rN7SWdzBgKFhMGW3zSFK1GtpW%2BTE%2B18SMX6aTYc8gEJ3v%2FWVmkoqgqdDzRq0qlEkQsaRWN16MmT8iBkKeEJzGLxwAAdmAAuegXzRV3HC%2BY%2Bb0a4Wm6x84y%2FGkIoUAp323ztUgKVJJXROGD%2BZmq4GraCY5VXmNdlFYN5mgY3jxyw%2BTLkl0bZW1y3dVo2Htn63%2FAV%2Bf8IHDi4FY6bAOhDpADJRgCLGbZyryXW%2BPcdUJRgwtdf07kHSjLeizPKEl5AhX5%2FZi3flie6nw3f9yMXW2GC6%2FUEhRi9Yf9xfxet7YkdqK31UmfP8jyJzxsIjsKOe%2BWheqzjEw6DY3iTLBovGxq9J8rcX1mUUQCxXQ%2FijQPK3pdy5UO%2F4H6fIFXh4UU7DBryjXkozxMLy4zc0GOqUBbRFE%2F10O1PNxNOl5txW5%2Fl65%2FUTdbf3UcTGYHcupSJRG7yCz%2FYYux7HOZt%2FUH1FNMXqMOWDRHn89csPGvnf5Ul6j8V%2BVePR6rwQqNTM3a3om7c8U0qcDoWfsXGrwZFty6YM9e%2BaRxc1ICBf97pwbLpJv9%2F74rkCNzuTKFOq5iq%2B%2BMG2u0M3yfGPvQP6Ec56Ra4SVpkV8Z60SI2JrdnLYQuzNUvMb&X-Amz-Signature=4ce1f55efe70eb55e838d3d769073f1e486913dc2cb24ded39b87b2b16d9fc89&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
