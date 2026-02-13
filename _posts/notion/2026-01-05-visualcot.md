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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZHLGZ3RC%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032219Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIF%2BbiDgJyZ%2BRd0xKJseRywemFrk7fBEbK2NT8a%2B6A09YAiEAnYx99dpbVVc3gSzrWlB4cqGa7RE6%2F7nHV1lmpsS8EBsqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFqRa2LrYxY3a98LpircAy0WnuXdX3ni4AXYQPTHX%2BSXPqXVL0KIPf9B4xpEXxbD2QSbKta8gRvE%2BhcjS0RfgpAbR3HNSpyk0d2iSZ1Zn7G4aAXuOouAti2U77RuHLZew%2BFAmTaQ14zsC4YyNXl2I2gKO%2FIIeO%2B8nkArm5ydu%2Bw3A1I3wJiDnu7%2BjpTZUMw%2BfM29q35Ah9t5TIevbI%2F7Vd9%2F2rSgX6xIYkX2itvrtgxCN0l1v1XHKf8P%2BtQeur8tNIlrwYR%2FQakXTE%2FOztBWjSmgs55%2FgdkPYV1c6nfexZ1jGkZzrR06wZqeJp8Rj3Kt4gOJIhCUUksft67Tfa%2FeC%2FyrvtQtVKT1Zf5sA%2B2MEZQxe5sxC5AjJ%2FVTREk0d6%2BZNHkOJxGFqLG%2FAS10X2rjetitImTSr%2BmEHTbgMVk6%2FyLhA%2FrlJwlZ4KsDT8hfZnZdqm3aR%2B99YqN2jt%2BTdboKC7d5jy5wD8Bw8JSXaAghlAPV7NCXrSlGiwaVDlWjMAAVCQPBHWlby0yoC%2FJh52d9md1PKQdcgrPmmRtGflAS216kBTNzyLe9Flnvm3vf%2Fy0grQMyeSrQEqvBLN3R3W8aAijve5hYc9Fs78qjWoB85mOcHfNaub7vttnSQPZ%2BKp7noyitluAxAC0CJpzAML6TuswGOqUBsP%2BozR%2BmX7Psf12mN7D0Wx962hUOgJ0Df%2BFOvJz7r1mkTiWK8Tl%2FZTyKd%2BI7%2BGn7KeoIpXLz9tWAjclapCHvCJEm9KXrkgYrL4z%2BDLwBR5945923lajUVgAglZARgrwdWxn58yOUpp%2BR22AYye282jMl%2F02WsBlYHu5Vlg%2B5VhZrUtre0D6k1B3Y7uKw9QeLAJSkQ1iMMjtX1i7payDxtf7e6q8a&X-Amz-Signature=83fa6db298083b1247c8f21de23c138b87f2553c0223dcb96628c88e75419b16&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RJXMX7ON%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032219Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIQDDWvVnuvs6vKJ0kvdKh1shbu93Hv7iQX8tSD6mBP%2FvIwIgYExVpp7frjw8df2k2PaDmYxcB3GfOoJgy35wQAeIBKMqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ%2Fd2qsgc3dQQ28HSircA%2Ba%2FmZm4UEcajDzXLxTShwk2a7PhoaWGvARrbCVUyf%2BiQBuTN0nUPmfUN5g5qsah2iEyFbCmxOFSTcCaIACxeSxo3k92wXTtB2I8EZ4E2C5QT2%2FKjW3mqzhTfnvGXKne2b6YC5D9KpVrgnQA9K94b4LHTd2b1t7fWJqltOoGUNDwe46LZpwUTsrKCr2hbiJxJeeuOnFUVAWOLX68NKg%2FKXQjV69AKsjB4fy1PzomxIDVawZ2Fd%2FA3hZNLUn5gTpGh71QDBooSQ8%2FuLrWtrH2hknT33X5TxeALXHyxMvF8PXKQKqeb9UoL8oFmsP4UCRGuncA42hQm8ZBXvQzzSBepIGOL3D98OCS9bfB7FWvujnVByMAOc7srJe%2F8JcGnUtg4GPUChh3WG%2FsH5Wv78lzQFcHVKjK87dIhZcepb9vfFv60cpEO%2F%2FdACGE94y87ZEs6jCvxpJ0kQPE3PXU7bbc7f%2BcTKDrVHcPvdQFV3L8VZztFSiztbfFpZqFftoap3rvLvExKZ4AtNUiGfBzQY72dBEiS%2BLjKs8lcS1c2LTmnwt44xPakdrDqbofHuL5Y%2BZaNCg6ft3VrnOLY7sZgGcBQz4YysP8%2F4JcI%2FOpiTkQibSTWnK50ur52F88U17HMJ2TuswGOqUBP3m7Vk4J2cRfNsLvSlmENPJWoHnqeFYIcp6sbORRCYAxN5y48llyDzhnMJaWKIdnd1or936mZQexLOIT88epNMEAP%2BB8bqD8fgRODZDq2ke4EhYaWwdyZpilDOcRN8kaHdLlR6viY9qvu%2F39E8PB6DlmulNy81ImQYceq4wOrtlybSIclN%2BSLQZVqd%2Fv%2Br9pshmZHOtf6LlTpi6z3FqCmv41x75E&X-Amz-Signature=97778669d63b22e70005bf01d8d2cd8dbc9f852fb2f0b7434a111c94d6daaa83&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YKMKYD2J%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032205Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJGMEQCIAcJ1ZazzclVF4WzuJjXKtLrQXqt4FBAympZJSmC7PN0AiBZ7Jx2U3wmIhovyw%2FtNDTHiu60rscL9lVE0LvZimWKPCqIBAjj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMmEljaHgJd%2FMT3qWgKtwD7aAzLZFBGNregI4nt9ICOOojqtXIah7sW5fDdc2RJH2NV8Aj4VSx4XnwPf9xKE7kP4b3FCgqvb%2FtXra2IgNr8r6RDhDzP17KbZ3ZpOXhe7fTsMIIS%2FIkI9YMFuaGJSVVXGiOe3f361qeOj9bvJijkzwbnDl7oBE%2F1Ktv0TgcNNS3viw%2FG8BaIBzSPe2J3MZz5Th6ZXEbMId9yFSaNl6Zg52jMVT%2Bh59QA3NBsQotpMCerO%2BXMD0g7e169uZG%2BofW5T9w0RhejzEXizxR8tTOsz4HNQDa6fqRjBg9C0gn7Btjyi7hN6ps%2FkW8RQolKtgntC9BBQicD6oellY1NCbCxY3U9nhcAfj8dxUpoabWP1YkgjIuuK6fu4%2B4wIe%2Bs9JLYCSNMp4CvOzV95O6gbpnNZyqGQrjelavh%2FecxovkvsoF%2FOLT7nosPOHKXRbgXW577i4nmuTwYQ8%2Fzs24I0rI%2F9gqF26%2F%2BWma5m4FAAIAyIhSGdVg%2BWSVmsFHR%2BzugDFR9FIHPHhhLI7HrOM4YplDSLpVviTaPxqHhn1JPdx9cQjlrxo8LAMcPqB5j7qCbQJ4i83wj0ST9%2F4lTuDUQ%2B1o063QzzMC7cqshWu7dEf6shKEz1YHIx3lwBjOMYEwsZO6zAY6pgF%2FuOSsnJMd5740I2%2FQjBHRCwGFbhST24I5RDdgsMtzyCH5Im42dSUKw88gglFgnhcQOTBF%2F0D%2BAP9SxsD9%2FsBwro2LN6sv%2FPuJO802qJi17hQfHISEI0Ju0sqV6pvyOhY7XL%2FRmXB69A2sBN9Wg9hNKyre5xPMYNJfqXMotAemQPQO8yI742JFknzpn%2FNSBGtOKbEU3A4y8%2B1wv1b2YTfRPh93%2Bwtt&X-Amz-Signature=08ea8b11d50b10ab4b59c3b4dab7dda09f1fa84517ed4cff4c52117b00c75244&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YKMKYD2J%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032205Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJGMEQCIAcJ1ZazzclVF4WzuJjXKtLrQXqt4FBAympZJSmC7PN0AiBZ7Jx2U3wmIhovyw%2FtNDTHiu60rscL9lVE0LvZimWKPCqIBAjj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMmEljaHgJd%2FMT3qWgKtwD7aAzLZFBGNregI4nt9ICOOojqtXIah7sW5fDdc2RJH2NV8Aj4VSx4XnwPf9xKE7kP4b3FCgqvb%2FtXra2IgNr8r6RDhDzP17KbZ3ZpOXhe7fTsMIIS%2FIkI9YMFuaGJSVVXGiOe3f361qeOj9bvJijkzwbnDl7oBE%2F1Ktv0TgcNNS3viw%2FG8BaIBzSPe2J3MZz5Th6ZXEbMId9yFSaNl6Zg52jMVT%2Bh59QA3NBsQotpMCerO%2BXMD0g7e169uZG%2BofW5T9w0RhejzEXizxR8tTOsz4HNQDa6fqRjBg9C0gn7Btjyi7hN6ps%2FkW8RQolKtgntC9BBQicD6oellY1NCbCxY3U9nhcAfj8dxUpoabWP1YkgjIuuK6fu4%2B4wIe%2Bs9JLYCSNMp4CvOzV95O6gbpnNZyqGQrjelavh%2FecxovkvsoF%2FOLT7nosPOHKXRbgXW577i4nmuTwYQ8%2Fzs24I0rI%2F9gqF26%2F%2BWma5m4FAAIAyIhSGdVg%2BWSVmsFHR%2BzugDFR9FIHPHhhLI7HrOM4YplDSLpVviTaPxqHhn1JPdx9cQjlrxo8LAMcPqB5j7qCbQJ4i83wj0ST9%2F4lTuDUQ%2B1o063QzzMC7cqshWu7dEf6shKEz1YHIx3lwBjOMYEwsZO6zAY6pgF%2FuOSsnJMd5740I2%2FQjBHRCwGFbhST24I5RDdgsMtzyCH5Im42dSUKw88gglFgnhcQOTBF%2F0D%2BAP9SxsD9%2FsBwro2LN6sv%2FPuJO802qJi17hQfHISEI0Ju0sqV6pvyOhY7XL%2FRmXB69A2sBN9Wg9hNKyre5xPMYNJfqXMotAemQPQO8yI742JFknzpn%2FNSBGtOKbEU3A4y8%2B1wv1b2YTfRPh93%2Bwtt&X-Amz-Signature=356dc9c62f65249497f03faa294e069cf1c0b82fbb278d9d88427e1e628bf815&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662MSPEOJT%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032232Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJIMEYCIQDy2Cm7yuKnIKftMD2IWRGXX9b3lLSzXhrxQS5co%2Bi1XAIhAKSnXE7MSpZEKXTts6GcNOfZO7T0JmKMnpVg8ctz609QKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx2%2F1k9hpXYeHjA%2FXoq3AP1nzm5wFaOht3nfZNLRWdRqCex3a7sEjIdNOaB4zcsYnfXP8F2bSO8US6btu%2Bq%2F0ogV8fdkyqe79RwNxrCX1UeFBiO1BO0M2%2B%2BBVWoH4u2iqYC11yCLsublApAG3UqLi7MJBz%2BsutRd3Xmft4F%2BTLF63QPpbLnT88jUz%2BfXwDlnQNXXx6RVQbNZP8VbSGTQ%2BMr86EjxgWOhf1XxEnSiWMwWp6x6XJxh2l27on%2FRg6%2FkwYTJIJS775d782StyhhwnMaHeZZzY7PXUFaE9B4Rokhajb2HhxHpdgPl%2Ft2fHiJV4zHwcspb%2B6BwSnjckgSwte%2BOF5Mn0T95kledNTUKYj30d%2BdmN7Z%2BQ88%2FMK8nhECEz3gqPmgw%2F%2BFdbirYqeWJR86VblwkDqda3d4ULDqIxw5iqwu8dm9LedgPnMfNNoTihCb%2BSlPyj4L6B98LfNMjpbXCMbdlBft0v%2BpaFAVDcNwefnRqFqt0GwMyQzr91eAQlhfjIZFpbecTMgWUtlw9v%2Bgd%2Fpp25kA%2ByGCxa5v4bDfpwQ9B5sCrkfFYeIPrluA44tSIz3iC9nN8ybHHJJoOu3IqG4gshkTuKgzOjpoQDBhcGChQxoTp276J1pKIlJNctQQGV%2BnLjIciSNFzjDyk7rMBjqkAWEALnyKj6oZPjmyMXvI88IvMtfxTOW9EGI%2Fnh7pMLDPm0O%2BpoA1qKHAxRzY%2Bia3bwVdeHBN0pWSjxGBEVYOBxeJoryLYOwt3XJ%2F2aLV7SJiy7ETsP9wgqmzzkgkdZ3JBRMDQNffghd7JyTuT51iOUSN5sX8zN%2BrmVEFVekBP5%2BV%2BmAbBDy%2FCTHa3on9u%2BlcpEBpWConk9htgVNlhkarocbgFJVH&X-Amz-Signature=eb84a7c34219243edda56ee55d2cae3bb5e49616efe69d13458c1cc0fafa5937&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RXE3YWZV%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032237Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCICz20Y0Cmpxo%2Bhyib8sRJ3n2Y0Mhr9J04TF2ImZH%2F9%2BeAiEAv%2Fyo5JGyQ4Zwtj6iuMimTzE20qsnvxA6NWJdRalQSmsqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDD0kCksT5xmXuTeRMircA79CQvPAWU5XyI2LnEWiuwSoFypIdQQocdJWugCv%2B5avRNCVoDszvYsqv1YIfPd32nfgfhAHxJyq3IEkF3XXNwAPbGDI130GkKhe6Jx0s1e3XhffI1smMNdEqURS0vzwwnF6hOpCB6n7Wc7IbgIjfR5%2B9UWRYmmvZo1k1FJ3psOVokyupxCK5abiVPwT%2BKX%2BCuwZIp6sJau5PoggnJ9sHebuGqKrvgBAy9lwpW3GE0i3TG05tzkVJDsOHDuWZ7GOsZvDj0BiP3YWouAK80pyAIwVUOdBiGWH%2Bvn6%2BgrMBytSxwFbvEViYun20xTrH5uufwUtWVLOZmxLj2WZLYBY17vOML18PO2q8fbrV1CqbG4WFbw0Gx02xu1bx9T0ahVRnVtvE1v8O2y13gY44K51PdrKrlDpJ25nfl7ZnLthy2T8xHQcbiaWDwoSyiLdZFKww%2FpfX99ptKWl37LYKUWYYrp1vN%2BN84YzXGQn6PyZwA80dW0Gmm0EWLx54%2BKbOGUgwU%2FzA1O1Ne7A268lr8L2UjGDCMQYwomXNK5cHNDSxWwj13ue8cWFUh2ZgPi9U0z9bPtUpOGaI9waYPB5nFp%2FED1eIFlLpOJuYdJw5LjkGFm508DVm8LS%2BBQvwdKhMP6SuswGOqUBi%2Bd1kXu2As1cEIHWyML5BYUyKtSfN59R0p7PFq%2B9pCFOfhrJTB7ZIvXd4LCjAe%2Bby1wkH6lr3pcnYVJ%2Fl9hkz9vKj3RdLAkt8Vm8vielztuumx9zjfSy3IPTykIohY%2BwaPDJWl7VMaJ5ZLtvKWZzPkq2jY%2B%2BdGyRzCcqbvs7mL58gn6GJiEtebjl1wwTYFmTTQdtiYcRHM926E2EEslq%2FiP%2FuBib&X-Amz-Signature=7f3492c2032209887b91ae695ea9b0b6d7b3c7a69ddce9f141d2ef85531fcb26&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XSFFE64K%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032242Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJHMEUCIQClq21VuU0J4xxE6UDIy5zEZuSY0wK8bqJuiiggLC%2Fe9wIgD8CkNizSKmZQ5LBD85lRE%2B4ZhbXmGxXpOzzeK%2B%2Fd7bEqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHv%2F1vszfG8NZr5Y9ircAwhjM2l6Nty5xNrfcIBJ3A8VL%2Bh%2BbzPmqKTMZ921uAedRgVIqaZ45qqOSDAmuP5QD9lZRrYijTPFdQ%2F%2BOFPw%2BbP5LSZ5LuIZH611h7H6AUVkssFDcblxlDW8P67j9crroquawsKfVC0yxc3xs2F27kcTUgGtwn8LmNAj0laU4h7REQSTN9DkQAKE6grSiU9VCTNCLcjnjv4DUWGHkRfj0avvSaY1Ynd5cCDjqc%2Brbv8KCQpngzJgk76ID3wtIiU0BrxAyYw%2FKnE56m6pfABKzCY5SB2xxb67%2BsVwnPU6KJo8leYzZ18DcAmfG5f0JTmfW%2Fgq13rk9STuCRmLcq04fDwAKrAIG9zJuEc1%2BrN1uufH5tavI193pp7whKrzk8AVlaF5lvSJrQIsEkvNYMHIWWJUieL8yiKa1x6wlxPo4%2BKl45l4qfcztKLZeRpEk55%2FdUdjCA08fkHrI7%2BVaEoN5JbJzBC3cTa8Zs96jc2tCnR1bqTppHbrg2bBYbTzQ35KsKcoaygWz1lu2tswbMabMnC51mM3KIOFfuaXriTsu9Z3VhwQM6zwwZPbTwLyxq3C9ZXBHzps9d2MklBHrfBN%2FhgE8z3SvR6v2WubE%2BttI86%2Fn1x8exBh0vnu7Y4xMNyTuswGOqUBrJ%2Fgr3rWOMY8lxfpHq5ZUpvPmsD2JsXClufqy0nEb7TImnNl9ym0YyuS0qzxr6VPmSfol2euBgMGueXqtGQ9xjYQHXLP5%2FtrkB8YGAwzVVN8ZFrswwJnZDpf1W7V6XVioZcztnOFLjX3Jdc9KpGFmlYFdVgtFe9OJVm56CD7zd%2FJV9M7jiNuLrsvIlAAGSUs5LP%2BOSOb9FrD5dfmKdkUgBGeVvQ0&X-Amz-Signature=cb82f8f783e4647602f599f91eb0f46715773e4b449c8401a45527bfe71ddaa3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QFX2GWGQ%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032242Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIB9Colb8hRWu2hb6Qs%2Fc8qIz7YqDP4c42%2BokQA%2FGpY%2BtAiEAm%2BjfWO2C%2BAqbpRiO8KbQqxsRktGN9olXYBPo7zvJJcIqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAW9AfgaKXminyVZQSrcAwqU%2FtFdwKqvT1xsVAecVypMwri1wF1zsKZq0YQFGjSLQBzYHXsLSLxwKUY7E3U8%2FNus71EFxF30uWJffJUmjrDHbeY1MNaLtO1i2RwVYg%2BFaLcgk9d7ko9u6aw%2B8yyJR%2BoG9HAs899eli34ygBA5pQHplbEbwwgOogj%2BL2fezXE%2BjbXoWMvlGmPcT2dgpnc0combE0L2%2FdkEh3PaWOWqowNRPojP4r%2FnFRv0ta1jJSNW2hG8nGR%2Fx7P9Z011xiD5XbctoqKUcBT%2F8u%2BJOyGg4gbyQBStk2GbezCK2grU1T3IjGx4oWylUZZE1%2FSKtKoWIMtD20MLo%2FDLM8tqRMu3zMgcTE76OVYYLQYI3OCeH3xuq5g1GPxeryeDh7iJAlqeiatRnipixMCQmhTLOPUg9PuZPgIVHstwQ0SnhtseJ1DVKYKlUOYoZPsRElsM%2BKxbdLYcUw3nEFb8OOXnN68pR2QZnaqx%2Bm8IiLxyBR2ddPj1RI2OK426b6SJ4b6dAwn98nj0s75zc3kJvG2BVbat4egV7PyWnEDp6xIQ%2F5r9HkiZJt4tUAeC75PTdD4xFHe4UiMlp9OHf74UiGU5DV8mhuXi1dhwzjuq2OBc5tgrrWPjwhcGPJpl932KclKMKWTuswGOqUB6n9ypHOtynTSjVaL%2FMhI%2BZbPNiJJAtz5kBbFSeTXSFS3M72HfroZAxNzZar7zl21amDjYemWERyKVPrCvT%2FoomM3TESNFkRxZlCux7EOLPG%2FXjF0c5YOyLd0JES4GyU5qQleQk0jGeLiiDeVSdQDYTJcthG6MsfyELQzobxb1Rl1qUIpy9vyPThiQmc3tt%2FZTkDIZeQnEaNYQJrjvd6PzDSj4lTJ&X-Amz-Signature=3405462aac79ac1fc268fa1a02acb9d5769770e78814443a2d43f3a9aa324d85&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VT5HOHRI%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032242Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJGMEQCIFRdsK9ab2L1B8suk709TDJPhAmuCyE5kLZOD%2BiZx7jCAiAJUoQYIif%2BZP0JUJzri1JcgjfkpCxWy6pmrv0eI4rKpyqIBAjj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMzoVmGDGFMztIyfqTKtwDmjL5VUkPloNOhtiTV52j8B3lsWobxmFJa85mWLwN%2BpPVrbqkvb3U4BjNfkGKdYcRswdmEBGEfMB1vAtTmXYN9oV%2FSOzpSCcKRPZa6yCwYnfbwdgfJhmHn9dLHd9zwOE10Az%2FjLxwJ4UlAuOaCcdGp%2FknehFQTrv902eDDlPl2LdNzkx%2Bin2HCRHdU5T8xEnjrQDPzZayylkv40IXpJUUxbfA1QLsFNeo0%2B%2BnhEcD1l234Gozkvo0UMWKHtSkLAYvUQo24a%2FHDnAYp0B%2BGPaQx4CDKm9SkrtusjkkNZPJNlEnm2kd5CBGnEMYiQINfdP7zfHd3Xd9NivS69odNivSXZSr2lNfY8oLnwQQXrkMsHItNPem9Wo6BEYNV6eTC4J5sLvQQUFz9EvTIwK34IVbXuA061jeS8hs0atc3ZzvOcYpThVdULztxOFbwhLLu9AcOt%2BY8Cl2dElZ%2BkglR35dkx53CIokZsOXBV1kM8%2BgYtJ6FUuawfJR03yJBgG%2B33kadde%2BUle6USm4OrRmi8VYHrrfXRvBZt0YxUkG3GukhzBvQaGxMKdF2HWmpMVJhG2%2Fb8h11gLe6g7Sc2jqxTLaWdwknWaO2H%2FoDJCPxTAQvE3VyD4ZWYlxRb7Camww3ZO6zAY6pgGK%2BCznzdPcFdxO5%2BVRSW7agqAKQ%2BNyVaQXkJXbcPilNqOVNwUv6oIzDtq4qu6yxmasvUoLcJMDC4W1vhp6yc2Zw7VoDUhO4QvsPlHKut09kfZehqb3LCPtSok11RAVqJKmgBw7hi8JMoY197R7goocUdJW2oAfHKOwrn6wzg0WUItBfUzB0qqWTCKInVLr1cdpHodZjI4ovdh2ec8xA1kJ5RQcg5tz&X-Amz-Signature=9fce9401e0eb0fdeeb40c4534bafc04755d2a5ccd4e1fab6f62edcfe82f01932&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YKMKYD2J%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032205Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJGMEQCIAcJ1ZazzclVF4WzuJjXKtLrQXqt4FBAympZJSmC7PN0AiBZ7Jx2U3wmIhovyw%2FtNDTHiu60rscL9lVE0LvZimWKPCqIBAjj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMmEljaHgJd%2FMT3qWgKtwD7aAzLZFBGNregI4nt9ICOOojqtXIah7sW5fDdc2RJH2NV8Aj4VSx4XnwPf9xKE7kP4b3FCgqvb%2FtXra2IgNr8r6RDhDzP17KbZ3ZpOXhe7fTsMIIS%2FIkI9YMFuaGJSVVXGiOe3f361qeOj9bvJijkzwbnDl7oBE%2F1Ktv0TgcNNS3viw%2FG8BaIBzSPe2J3MZz5Th6ZXEbMId9yFSaNl6Zg52jMVT%2Bh59QA3NBsQotpMCerO%2BXMD0g7e169uZG%2BofW5T9w0RhejzEXizxR8tTOsz4HNQDa6fqRjBg9C0gn7Btjyi7hN6ps%2FkW8RQolKtgntC9BBQicD6oellY1NCbCxY3U9nhcAfj8dxUpoabWP1YkgjIuuK6fu4%2B4wIe%2Bs9JLYCSNMp4CvOzV95O6gbpnNZyqGQrjelavh%2FecxovkvsoF%2FOLT7nosPOHKXRbgXW577i4nmuTwYQ8%2Fzs24I0rI%2F9gqF26%2F%2BWma5m4FAAIAyIhSGdVg%2BWSVmsFHR%2BzugDFR9FIHPHhhLI7HrOM4YplDSLpVviTaPxqHhn1JPdx9cQjlrxo8LAMcPqB5j7qCbQJ4i83wj0ST9%2F4lTuDUQ%2B1o063QzzMC7cqshWu7dEf6shKEz1YHIx3lwBjOMYEwsZO6zAY6pgF%2FuOSsnJMd5740I2%2FQjBHRCwGFbhST24I5RDdgsMtzyCH5Im42dSUKw88gglFgnhcQOTBF%2F0D%2BAP9SxsD9%2FsBwro2LN6sv%2FPuJO802qJi17hQfHISEI0Ju0sqV6pvyOhY7XL%2FRmXB69A2sBN9Wg9hNKyre5xPMYNJfqXMotAemQPQO8yI742JFknzpn%2FNSBGtOKbEU3A4y8%2B1wv1b2YTfRPh93%2Bwtt&X-Amz-Signature=04533711b90dc8dea0f785b7b045519f98f53038d22c6827c14699b8671f736e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
