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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662THUE4PM%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033205Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJIMEYCIQDXTfECvJp7fTZ5piXCoAt9BYRDyCkS4UXD24T2tOnmvgIhALOC721f6jDK0COM2pxZBSLA%2BJVSlmmQcEog5TiV6wveKogECND%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igzy%2FQ%2BOQ24POzpyhgsq3AMQQnRhM7dGc5EsuBMGbTirelYIztsi81ipNFMyrhEjQEz9p3WnPSDw9PjtnsxkCbQXh%2FBhMrs25ZQx0pUBdml669nbFkjY9U8EcrX%2FTLszUepZ%2F87DEgqG5OYsD4f3Qs%2FSrYhGuyDNzVjcS5Tq3XSOY%2Bfa7cgFxYTqWFiAv9whR4EHKGirdxQwRKZd49aSRZZkFC2VQccsYAEx7aKwzbRKF7wURovwNPhvENk5Cze%2FuTaD9naRvDHDL4Zqgn1y%2B7ypA0OjnPyfbQy3TPIcJ9mD%2BhYRhfBMoIZXxxcusmUxRnMqNP62ARElsFOsWOKJBAroVWJ2zbmsY7VZv3s45BhxH73pcrWgh6Hb8G8jwwM%2FuaJrGu0sayujvv%2BLzLVndjaCqdRHDw%2B3LdLg%2F%2BjSfJPpUDc%2BA1SmJfaDQEtxTgSzLLy5UwxrIFKDVJQCVyUdTA%2Fw%2Fvjto2YYm3JIYcHUszuVHJ8f909pOuPYqtM2a%2BVGTHh6JHi1RNtB%2FdA%2BLTAVQvo2vQ6UuWW3v6fM%2F8dm%2Fx%2Fk47B3InQwkV0vSqWd496BW9g%2BErmeqQ%2BAUS8jAbKuZDllF%2B2eBOuHm08rnV2pT0qDsFH%2FZhq7BHUNDg3p1iKdr2mTqc6oCSxHSB8EWzDu65bOBjqkAfOFtVWFlmIOH1BGq5aM%2BHCyqzo0io8zjMWLGabHyJm%2FDP6XsmElMW3XPNwvuhrffBVYKYyjVOzDjn8I1HZDY8iegI%2FujqksAxF7l0OovM%2FKgBRtv3LsArRuLqvbbhf4gwBjFJpFiQ2vS6dC0wuwhTFkhCJi10e8SrK9m1981hDoK7LcBwYaL9ZQ%2B%2BRXA7sUExeOCTXB73DqVQ1ElAUGEQvHVVQl&X-Amz-Signature=7b0aa0372fac0752135445d155d0f52aa5accc124e5ea8c6acdef311f8f71763&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YS2ZBTXG%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033205Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIQC2uNJAuvbpcxMfPPy4lwRPWYH0pvSA8Zj4sz6RvDWXgAIgHp535l0ERWb28z1cLtJzWWpIJ8UIaO%2FF4Rj7n58HIkkqiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNn0qQ53hI5fGGiIJircA7B7YECGznsNScrIn3yLo0CbkgGV3YA5bjtHspMXZLCbBQHsSsrT%2B5wM1IOvjdWpUJuIQRr1kL1qnkU9kABPyHaW00oO8KIkTLiLQ5dmc01XqLZ0c0Ea9Xm%2FCzqTOsyv9Le%2Bp9LYJdwTnWGorDXdJKQsHbz%2BaxyifPx6omMKKIxxM%2FyXh1o0%2BMtWuDPEYy4jHYAH4lNmfDg9k7jNdr9kQ6ssjZXeaYJSyXow3r6oIdzZpPRWfKX6fz8ZNsKaByi8tBbQfIM78VPo8to85FH%2FbFiYtibdlrhZG4UHQv5ufuQCuHUxI5RCmFA89YQRWoh8aMv%2FIXE4CJPieXSlJ0Y6k%2BIOoKILH88uLjgYNX%2BB%2F%2BB9ijEd8HwXXQGFY6bt3CX6etQttMXXUgTduVJawYdQmd3dj0TAQSIAw7LIXcutRzGnehWwWE3RO0dowVpuXm8pqCXmANa0wQYpCUn23QBcOZTQGUgbJCYBhPfyyNqxDEA7Y29BcX9Hb5gf7rF4%2FRrhGpDj32yqH42Pcd8YmdJ%2FeNVWmY%2BsN7TN%2BUkEHTEkKVWarjNgLiPv2mOyQqwEgCFYI1yh%2BoB7WsccZJ2FrdYClevN%2FdV54j82IUmBTYP7aQHBaFMYlgj8AeppP8ndMKXrls4GOqUBuJB7DXq%2FihJXCwnv1BVjCJ41MJQq3dQoW0aLCZ1Es6qCjAjq19dG38HceM3hp0ZwTgRhh0mneKu37Y3SKKDEDHn7qhFuikqZGVHCc4gtM14Q6RA8B55DqLYTB6Uwg4IsD7vpMaZ8%2FDVVoIUP%2BeWirT4QcHhRH08SOOt1Ubn6LEM74A5EsTzEm70KNmeDOVM8e69%2BQJjrcgF8BiV4APs8hEryz6KL&X-Amz-Signature=a00c9ffa6175d2af74e3b79778b404ee513875b962edc5d47a659519dfe60590&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663VWIETLH%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033155Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJGMEQCIEtiN%2FXT93sY%2BMWnKinbpA9Qwlteac29rpwcRMBXPaXeAiBX6gX4W4%2Fw3tTxakgYXwBOP0XC4ehG%2Bc7ezN%2F%2BWydCfyqIBAjQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIME32YNrwmFKd8aPk9KtwDfEfqoKp7nSxt%2FSqytZmKxde%2FFQ6NBC1V2exsnYUqy8jomYP749TQFntJxKtI%2B3dPkImJch%2FAtbDDU2ysQVqcNb7Y26bd%2Bt5Tp9o9l%2FS1BQSQnY48bDCwhJaM4DGA6jRNyHAD%2FGrA%2FzUxVZ7bf%2FIzQ1PIDwupNr8hK6PJkbwsAd4o1pdl8YaSI47oprE4n%2B5RUzxRUmdXRCVTfpSv%2FhfwPeRPXdvuXdpZhhm3LqGYHT4WYAY5GBo%2Bw%2B3U2PdBdKiTmkz3DCzef3Hmx8diobveiJItnnD1C8E1Mckn46IOf0oTWhfyOomxawSp6I6Yl84qVj4TYNRu7cS2Sh6NFvwvjmazNgLJAxgcGDqXMJZEvq4Yqluv9vMME7FiF%2FP4B7YNjPBf%2BIpLvdLgDHcHBVx5HvvE4QWj9SSGlhPyfnTL2bFX0n1o5qT6lgT9M2P0CjvYmluYTsZi5lA5RSdsYhjFlsCFXz3O4xWlxWM6L1HSZlFj0j8Bm7TNe8LERkqghsogpjlKxq3KgB4OYuRwvlrd91h2RtB0MOBvNAbFLoZX1r4P484YOm2ShDjUFvo%2FvtmueOgKgmdZW0kRY3DFfQLieq0dGDVQQSR%2BBq%2Fcc4joQlV0hHePiWfgUdxYNwIwpfCWzgY6pgFg6KyCWRJwkmtiF0FP8Ajfj0ZZlETrwqpAPhGa2FYbg0QYxiyfACiSzVwjfcWWwBtAhHOdhUnRkqoekaaQ3AgFZAXZbpX06MV6QbngEWJBopkf%2F0sQiw0y2HA%2FhMai%2FrgFJGwkpi4l7OKuujyy28an2IUFDka2UxKfke7QvMhttTgVxaAG7N%2B%2BitzJp%2F0UPVOUw%2FzuBL4bRiKUkUAm3gdmL0X8zNNj&X-Amz-Signature=26219804aa507d1e0143809a565b7107aec49364844e8d625731e188fd704668&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663VWIETLH%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033155Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJGMEQCIEtiN%2FXT93sY%2BMWnKinbpA9Qwlteac29rpwcRMBXPaXeAiBX6gX4W4%2Fw3tTxakgYXwBOP0XC4ehG%2Bc7ezN%2F%2BWydCfyqIBAjQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIME32YNrwmFKd8aPk9KtwDfEfqoKp7nSxt%2FSqytZmKxde%2FFQ6NBC1V2exsnYUqy8jomYP749TQFntJxKtI%2B3dPkImJch%2FAtbDDU2ysQVqcNb7Y26bd%2Bt5Tp9o9l%2FS1BQSQnY48bDCwhJaM4DGA6jRNyHAD%2FGrA%2FzUxVZ7bf%2FIzQ1PIDwupNr8hK6PJkbwsAd4o1pdl8YaSI47oprE4n%2B5RUzxRUmdXRCVTfpSv%2FhfwPeRPXdvuXdpZhhm3LqGYHT4WYAY5GBo%2Bw%2B3U2PdBdKiTmkz3DCzef3Hmx8diobveiJItnnD1C8E1Mckn46IOf0oTWhfyOomxawSp6I6Yl84qVj4TYNRu7cS2Sh6NFvwvjmazNgLJAxgcGDqXMJZEvq4Yqluv9vMME7FiF%2FP4B7YNjPBf%2BIpLvdLgDHcHBVx5HvvE4QWj9SSGlhPyfnTL2bFX0n1o5qT6lgT9M2P0CjvYmluYTsZi5lA5RSdsYhjFlsCFXz3O4xWlxWM6L1HSZlFj0j8Bm7TNe8LERkqghsogpjlKxq3KgB4OYuRwvlrd91h2RtB0MOBvNAbFLoZX1r4P484YOm2ShDjUFvo%2FvtmueOgKgmdZW0kRY3DFfQLieq0dGDVQQSR%2BBq%2Fcc4joQlV0hHePiWfgUdxYNwIwpfCWzgY6pgFg6KyCWRJwkmtiF0FP8Ajfj0ZZlETrwqpAPhGa2FYbg0QYxiyfACiSzVwjfcWWwBtAhHOdhUnRkqoekaaQ3AgFZAXZbpX06MV6QbngEWJBopkf%2F0sQiw0y2HA%2FhMai%2FrgFJGwkpi4l7OKuujyy28an2IUFDka2UxKfke7QvMhttTgVxaAG7N%2B%2BitzJp%2F0UPVOUw%2FzuBL4bRiKUkUAm3gdmL0X8zNNj&X-Amz-Signature=4a5093fb81656b7e557f658ddee8f58f3bffd44c83df6a26dc19a271d4e05519&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YWQBHU6F%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033221Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAYaCXVzLXdlc3QtMiJHMEUCICO0dj1EJwHG94s1UBIaosHQ%2FKN97cvbCD%2Fg39q3tR%2BdAiEAj1UNOA1EfSCy6zIW%2FWaX%2FQ8kZp%2FLjpY6hPVySC7%2FtYwqiAQIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDN3hwhIFO3ZK7NuXVCrcA9gbvb6WlgOAJdn19MZNAapZOOlzPpCU9typLjreyI4lviQzJJYhkRNbQt82XAXgOqg6riSURyxWOD7lpm%2B%2F83TtsiQqj05WTMH4BZIKjD4qZ4RvjJj1NIMpXd71XMWBM2%2FPk12w2jtd%2B0TCsyUALsK7VyZkLUf3DAy%2FA5JnZ6bleI8LR7CCPWFSkD5KcvxqqjcEfHHsgurke5ZfZali%2FI%2BPtHO8iUeBV%2BjMObhU6X8epitKnXPItIWrYxrIYNr5eUD0Nm6V%2B%2BI3Y6A0pQc%2F7e3rrzNZotQS4%2BBglH%2BqYOdYQl3wvE9c9TcMh5fmPjPIxCDjqUDUFdhWO8acvyTaTzX2AInXHcwrQO4fG73B%2FSxTIpqGKARTQqtXUPydQnDOD0lI1gMGhtZeq9EsrJPBRFuuzr25ie7zUNVQ4Yhf7Sv1JWsoT%2BXA%2BnxgRneX%2B5BQiVEvet3Nld%2FQbC5xd3q%2Bp6NK7Rq4ftSR35zCg%2Bt9p93zsBBsfzP3ANOfR0%2FSrIy55TqJ3AdTILi%2Bz2bS5RY7gwPxGqPYoKVETVNTte6ynrXe5y4ND%2BZHHJN%2FeW%2FVdS5Hc6r6MYWUSKoELa%2Fg8yVXMPPNyAyPLo9ZPi74g2biEEpCCEMFcnj%2BtJ1CG49jMNPRls4GOqUB6wn6mj8XgnValYdKIQuZbsHRUJXI7vjTVcBqJp86CE6gllacAIeesFEivI00R6AY6Ke0Rx8M2hoR4nPnR9YUtLc01HiruLhhaCUw2ySSVxR%2B0Mv%2FM6sLnCVZv4V73qeH5K0asE4Wc%2FW8Zegi%2BswC2XkvJt4OknBrRdMtL5K25E4F1R2CBDdoiibSB6NThYiBQb33OxM5k5L1k%2FP8kpm3j1Oo9XTv&X-Amz-Signature=7a18fc29629c6a25f46aafe230f6f4df8d1a38ce054d8974e13b58a1de686b1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZLIOGNA2%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033226Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJGMEQCIFV9kuH02lYTWfNswLDgekMyCqW4eGqQNZfHTBpN150MAiBir0F05BPhafz%2BlRkAcRBf%2B8d36Adc7%2BJWBAZo5w73ViqIBAjQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMdhdY%2FT5lGMTH43nzKtwDb%2B0%2B5WyjmZL9nMwzaSU4f0ThxM7m7iGbbW36MNYVeJjy4BTwUFPmBP%2BUCML2und6QrSkcDYEjFQ3se15Bbue%2FKE5FrNFDocyCv0KhY0rm1dvgmZjldpCkSdeFfqKseNE3Tur4W2pKDhSbjmfFjwLQbZBzn4I5vwctBWId5KWRKTehnSw%2BPevOhZP5vVQw4NBcbQ4nHHGB%2Fx2NAN3m%2Bqa89qcP1VY8%2BEIaaszVsWsEFDv7DTjAEEVw5iuO7keR8M72ibZOsXgmbrvmaOQpjXSA9P1Mr0g8mDtA2l4%2FogWbose9Jh0%2BiwknXeFdGP4aDfF4Pe%2FJop2nzy%2FZJhwstg%2FFXX%2FjGga%2F6Q7PYvNxMzneCfZMyyKJUx2JUxX573a%2Fl%2FbcfkNO%2BX5YHfJThoKgeeafeR%2FD5c4LA9y%2BMQV2U72zAt8o18PNl6VGUCECLVA5tN1Ws4GpxJyPwYnZqLnLXBNhKNbK477Bn8Bk5EB32Zg8VUwayHTumyo9Zh8%2BKzwHkSE1I7TjX7etXGkSmVy5A9AhEQJ9rpMj3UVzXq6q42cAVkV%2FpPng7Acq%2FgCSgPmcQpBX0JpC%2Fava2e4A9kVEIqLn7FbtQ54FOhNc5b5fMTudPnNVGEj4iLeo2OwFDYw3%2BuWzgY6pgGREPv7o6ORtXbFXvAc%2B49A5TTaKAtL3kuAxH3JeZHwgvLUp6aBoq40ry0xJ8JfcYzcxggy4Xtq1FGmdgMgTAsxWSbfKC0LtezG2SEEfG98xzxfr1Grhk4QZ1nr7cTzt%2B2FEJvLjN%2B2C9DfmvbGsD764xVYW0s0DiapNctZhZOVEraMKlpX9bnpUoDlSC%2BxVrSCsPSkWt3O8TtIhCfbgYrgBdx4y3xm&X-Amz-Signature=1c51dd72c35804cdebce5d4a17586ac69f331c809832fdd288654fe060f1088d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662LEIS4ED%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033227Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAYaCXVzLXdlc3QtMiJGMEQCIHS2MbEDK2%2BkRWFkHuy89S2eLmvJ7QSHFzf5YfU2HfRuAiBtVRVubQoZh%2F%2B0CWGzA2asob4RE%2BIfPf0hqvAr4mxAHCqIBAjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM%2BWyG%2FqdZATqwm0VmKtwD2ZfzCmiuL8lTzsUK0UgQ6E4dZA54llFfG3saaSeRKCQe5BUcJkWU8l1ZrlinU18VCBJ75qg4ZkadaK7tRLsJ0Km97FFitJGa35ANmW1QcLd5BFo3SXfvJEEQMWk2jCKzCh346k15NPoRz5hYyG1Kh7bCSKzfQp%2B8FKkwMDwJYTijtEioLlqF8ZoZDSgbjdE%2BMg9sMf8lgXrNXAIcsLMNyCPshcym6J7tTcwNqO4%2FQ6kVyn90uOUGnW%2B9rgcnejGT3yMyur2BnzOaZ1Y3vLPfW%2BW2FK9gzH5rdQcMwNOjWQYHiKkan%2B9GftCYXPOMq7uZeIpA9AmKYPBLLmDSs57bb451zBt1aam6pFrb31LZ4B6ABqGImWlAn0JL7dAK0VyqHaiMbOWk1JeNcXG8FYHVTU38%2FN66QoH1lnGkPeAwgceglYwryuGmw8P9TH%2B5wILlTkaaXdieIuCo%2Bs10dgNDsK7oE9ByyHz2TMIOgFTRRbN0%2BAtJACl0ccugUOBB%2FDZygRT6LDmlG9ik4O0TmTh5OmqHE0VW%2BVcRjLa2Z0uP%2FTQU1GcS4KrRXWEorRlTgpyA95KoZ6h6eFMIRdwzslws%2BOgv5waRXxccwwzwhcyMXS2LCDfpu9HYJUj5o8Ew0tSWzgY6pgFVAC%2Bn6dscLNZpPtJta1ln5bw8LwUJfgPzALbMtjcPYfq503N7eSLGZ9y7f93M1MDYB6n2TvtFiHS%2FeqbQMXc6qWj6iksIFt7uxy3B4MWC7LEKgwso6YWd6iIeVPdyHvAc8wAB2yZ2ATPI4eIhqPAmNOjPOn6zshftxew1qdj%2FDlZdQvqLizX91US5g%2BZYu7gRHlx0zf1KtBEpthklt1Le6HbWN6OI&X-Amz-Signature=4f5e60e158900a6ecdadedd4ef291957abd449d7896200ac03cb0a469687c5fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XC2I4V3G%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033227Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIQCbPYD9JK%2F5lxggUi%2BluCNT5e7swUjAKN%2BCOG09MyGmdgIgbFZX24bGasCnaWMwcbV2fQhaGVBWTEONldvc11AytroqiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDkBFt5UjXPgMkP6jyrcA2CwVcYEzlf6X5bJJ4H1zPXk6wfeh%2BEp2gsqE9v7c2zcFwvUTyiQryuZWeoCnzaq6OqP7njuoKFl1bZEmvBLf5c0cTDIT%2FNsEBA3vl%2BAWECwtv2kFRVoeLXCOIRq7swHgkrBXuNnaY7NYLIKgv5KQlMA1o%2FHEweKAWTXz6F1NiqP%2Fnn5hrNr5SSBXVFP2CV%2Bc8ACwqoMGCAEfn9OH0YmHVCJxPJ3yqf0xOZKHVBqKx5vSvT8kFUDQYLK5XiYcfhG3WRTu81FGYa6mnMPRs2U2AKsmfyTH6myAwxjaiohyz2fHW587My3C1XXELM%2BBVytO9g%2FKxfYvZF6N7Bgh%2BP9LOyzbnIRvOrvdRtV7%2FDfp5ANCGlJoaWcIE3RenhSiD3N2CQoFsJ3Xqe2Pgt%2FrZlHXMALaHL0uQF6tTMidgBnQe8VdNHzo8MzkTCO3kM95UYSO9NBxzCwlhhLqGTEhS6KDJdIHVnZ4ikeUN3WQOV9WZcmnLxBRcDZvd7ao3RFt0vIJ%2FIJxfsH85WeERxZUDnXKUiBea8kmarW5BsR%2BH9pNTmE0%2BQ5rTbVMv%2BCiJy05zadsp8WFr2xQieopRbsdwTUqyMcNwXwTSQkL%2FYXtJsIXaSMe1iha9Mhhxn0dz%2FtMIXtls4GOqUBppN5qbVVpiH2yiefhnaiNZO9pH%2Fh9wX3LhcZMKGV3UWjtF%2BYEYchk5RQ2eD2cZdYGWo5r6rKe0T6Y2Xs%2F5fUKo1DTvsm%2F6ukEr9XGd7NBpsLXgR1Y99sN7be5Bu7Tq9V9qZEYQGRzM1zbowDy3mAsQbOWhDbhbfEIG%2FrAhWCONJVFcpvAjbzT%2BS9j1YDde9xvbh27fViG1Uv0614hGb4rwj%2BJ4fK&X-Amz-Signature=47610c11a8ae2845a69ef7d526745e52b9f44a044245a1b095ba5f03fb5bbc04&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JR6R7OT%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033229Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJGMEQCIFsLCz%2F4iCdGroQiK8um%2FT6MNJ2uL1613pN7VWOUmGP7AiABr1enzwiDZS9oCy2oKAafPRAb2XdaXywPYb%2B8E3sgsSqIBAjQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM%2FH%2F1%2Bw7f2b1twe0PKtwDq2rqQGh%2Fc7QtpGPgE%2FNjPuS389p7OIcrbX4osKVo38beJQA1DFToZBXuPs5PGjKPmEBF8w2ImeQ1V74CvmlnMCR9N%2BSX%2BJ%2FNbw%2BWvDZV6O29dSHTYeCWlbh6pAilt0CJRJw2IwrW0b0oajf2AG3FGpSeb8pPdnK%2FbmqC3PFXXdp8jTkCcAyjm%2BHs8kVDgIWIKeVk6WJIpPoGGCARi7EZuNKYmb3BUkTX99EJPMxwAw1SY8Z7Os4ssqsDvt7s41qHGMT9P7ODlqyDl%2FbZkSAKSwspFkWRDoayw1%2Fze9aA%2FQNJsM20meQe41uLdH2OdMZLUIqMV3KIFCGmRq5bWO4BpDbhhypYC6xmYoupEfKHR6ys2%2BPPHfWchQcbOsYVlQzXQrm3lb4RElKV5RfLpsz9ub3bhHImC9rGiSLyAWnwmcGbPtIrBZreIqN8bQR14N%2FeXqeP8ewk25sEYWRWF85bf%2Be5%2F4hDyqBGPM1x%2FXP%2BhbVFRt4Ce5fqr4URtKXpkWcWdQMbH%2FahVBB8bltR9MzmgMSbjlJKvknFnQFOah19wcQQyZO%2F7%2Fe1gZEpRkplz0tgPQBpYIBtxNTIFVzwfqD8SF6hunJWe52mebzhTIybTzttpuVkxlTxZwLC5fgw6%2B%2BWzgY6pgHCmUu%2BpzP%2FTW8TT16deDfWpeKlOuq7e%2BDhvum9m2Qg4VT1KfW0oFR1cmbht3ROVyTLItleny%2B6yigzHJjesMP4OdtVuf3TeJSrO3GUNaaM2cLhnFQgThF224x%2BHKPFXWbovD%2F%2B2UlzpPxowJ91%2FuDzZHzICSd5B9L%2BPjHfL3eknMfxjByts0miEXl3MjbHohnDHI1vM47xOjzG0nuU88xZZNA7mWcY&X-Amz-Signature=71270b13f8dfa60546719394982b9d9841582e7952f8321a5e921a64afa0fb47&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663VWIETLH%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033155Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJGMEQCIEtiN%2FXT93sY%2BMWnKinbpA9Qwlteac29rpwcRMBXPaXeAiBX6gX4W4%2Fw3tTxakgYXwBOP0XC4ehG%2Bc7ezN%2F%2BWydCfyqIBAjQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIME32YNrwmFKd8aPk9KtwDfEfqoKp7nSxt%2FSqytZmKxde%2FFQ6NBC1V2exsnYUqy8jomYP749TQFntJxKtI%2B3dPkImJch%2FAtbDDU2ysQVqcNb7Y26bd%2Bt5Tp9o9l%2FS1BQSQnY48bDCwhJaM4DGA6jRNyHAD%2FGrA%2FzUxVZ7bf%2FIzQ1PIDwupNr8hK6PJkbwsAd4o1pdl8YaSI47oprE4n%2B5RUzxRUmdXRCVTfpSv%2FhfwPeRPXdvuXdpZhhm3LqGYHT4WYAY5GBo%2Bw%2B3U2PdBdKiTmkz3DCzef3Hmx8diobveiJItnnD1C8E1Mckn46IOf0oTWhfyOomxawSp6I6Yl84qVj4TYNRu7cS2Sh6NFvwvjmazNgLJAxgcGDqXMJZEvq4Yqluv9vMME7FiF%2FP4B7YNjPBf%2BIpLvdLgDHcHBVx5HvvE4QWj9SSGlhPyfnTL2bFX0n1o5qT6lgT9M2P0CjvYmluYTsZi5lA5RSdsYhjFlsCFXz3O4xWlxWM6L1HSZlFj0j8Bm7TNe8LERkqghsogpjlKxq3KgB4OYuRwvlrd91h2RtB0MOBvNAbFLoZX1r4P484YOm2ShDjUFvo%2FvtmueOgKgmdZW0kRY3DFfQLieq0dGDVQQSR%2BBq%2Fcc4joQlV0hHePiWfgUdxYNwIwpfCWzgY6pgFg6KyCWRJwkmtiF0FP8Ajfj0ZZlETrwqpAPhGa2FYbg0QYxiyfACiSzVwjfcWWwBtAhHOdhUnRkqoekaaQ3AgFZAXZbpX06MV6QbngEWJBopkf%2F0sQiw0y2HA%2FhMai%2FrgFJGwkpi4l7OKuujyy28an2IUFDka2UxKfke7QvMhttTgVxaAG7N%2B%2BitzJp%2F0UPVOUw%2FzuBL4bRiKUkUAm3gdmL0X8zNNj&X-Amz-Signature=94ce0376f4463b7688aa79a6881de597999beff046003b14602d03a18aaab0d5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
