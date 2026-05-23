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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RSMAAU6W%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040905Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIC48KMmnKfUA4lnMSRv%2BNDKZ3G5j2SBsIjzS%2FLAI9DoTAiBYgB3xdDhXIPKHZPq%2FssZaGS6hDziaXi%2Fy9yy5tgSTdir%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIM3upsU3ynN8cO%2F%2F3YKtwD0j2%2F7gdPI7GLWgAtlajS99iyYNfvNgpGYhiT8N1eYWaPc2%2BwPOK4PwFt8Xo1AADK9RJ4rXFFkFaIdcP4ph1k6XXq51XUFmLChlxzryD%2Bu2Ym4bY8WcJh94Jf%2BMzO7gxvZYRe9MPcfiSSXL78URel6U3IZzMu5MvrZXXZP5x4ojapX5qkxLSLqyoccjDyglCC4P5M1ZIj6jiEQbDZldTjaBQ9Epjs75vYaU2jQaUnAhSIPGi6LoayZb1ekz44Tx1ZHjcdzNryXq4xN5m1g54aC2ErsT8obFYUg3pTANEpbycGm%2BrhSmPKtO1s9tD9g5ibXJM1eYgnG%2FcZRcPrCtlV1MckKqyRV6rCCQTF81L6a%2F1j5GIFo0l3D8SvdkzKv28p86pifv3nrs7PR8p6sPksnU%2F0cHWhNcq2I%2BY8Ftq3V1FYmivji1cQd0pfYzZD03LrJDINCbOKGUY4qdamO8bsw9TpU3smHJIZkTuJ2AYKhKZyOMpBpK0BAtYZcmwQIC5lP2v2xrnAFfe2vVZ%2FvRJjy6PbOL03%2FpL3T4C1E06pN6w2kjgtA0jqw3BgRjlTPucI%2F3XodN%2BBSUtnhM%2Ff9d195r06ouUmb0KOTQBe2ei44ESWfWDIEyduPIrNAK0wicvE0AY6pgFoGXGg02dyvA3lTpvQd93AowW89NlQJBMdJHwPdDTi37VSpHIkHfOktvdZ6K5v%2BRxjI2qGkTopckvALB1iVO0eE%2FsGcB17f%2F6FS%2Bp3vM2s4IzdTNlg3GGk2264VsmASBBB7cdjOpKQZaybKRXM5xlc21nrh%2F%2BVQk284dwxR%2B6CE528B%2FV%2B7vO8jhQmJJxNUr59k55gtCfn8nE6zu%2BtZ73UMg9XU%2F6o&X-Amz-Signature=b012e61f9d2184c709b0c94e058208778b48ad2aeb82bc2272aafdebe12569ec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TAPNO53R%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040905Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIHU%2FqpO8DCb0hICBZHK%2FLh7abmKFK7MeieD1kVPYLw%2B3AiBmAQo9rMq0JU5zBS3dk47Xg31WNzl8A42v6ki8VW2dVSr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIMbZdqA908bAaJo9KuKtwDH2DDQuWSca6bdi3fZ8jC97KAOcp0x35oEQQMf41U%2F7R%2BNyl54TzpfhZBNEgnAgse7cPg4jWhAem1v%2B031%2BgbqEnyaunPh8t7zzzaDVNMy09Q2p2nSVjZFYRBBcyH%2FqI0NNJ3jEIG3AChcioTs1fLt7W7Qm4QHb2KSDAXs4gCtzcTHzILwJG1du7TQ3HQdTtDf598XRv%2FUfpESZS7s%2FB7LlPHSfm4b0KeKsbb9wswpTiqjD7pW6ZvfrfhnoLvkbYdd%2B%2Frx9qxHogTtsIK03TfupfR%2B%2FFjmbZ%2Fa2N%2Bd9NfsdH7oGXDyrFAgNer6xMUx137VrQPDd%2FfytOI6wMt79Muyw1ON4vgAUmt2xrAPEZ0quIGQQD5MpcB1x6xwNV4IcuayDuE0ZQYsrCDoVIMGqF6fD%2BK0q56CMZOAY8BO9t1yflPM7%2Fh2ibXOuFb0%2BmIvzYQSKRFydSl%2FcGHnvkamTufirzTtC77x6uq7l1dVfIR6sAmc58k5j5buEtHOjhQUd%2BrB2sB%2F%2BMk5DcgoIJNZ4zoT1pceUPiXJHsmPYolzMHxVfoo2VBgAJWY8Vx1dibvkyfC0jQJfxGGoa2rlmy6O95WfWPG51lmq4SAZ4%2BGN6Z0r1SrH5uxVNs2BLVxY8w6crE0AY6pgHk4WyFDNQ3%2BBBLGR6Y3Vs3RG0y4n7acB9K5P0j76Z9oxe4VXwkal0VrQ85%2FoshPrXGa%2B00KrF3LxCfJfoF3BD5c3gcTuosrH8H2wlgLOeB8q%2BdCOKaQd3FINlUqLtk68DRZln14VqVT4tJeGfl3Ab7xPnuaL8XDnnOGbQzgiFJfKebKPcwBQKJ5UtXhyH2K8bgfCJ6la8sZs4XGB90BbtJ4L9jkXfq&X-Amz-Signature=1eb19e53b763e25d1c706ef1fabe1ada74572f84b2157e4f97483b5bfc437e87&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZOYBYR2K%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040902Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJFMEMCICoLz0n3v%2Fjb0Jufu9c7sc0eoYs28EbxJEOlWpDOS7GjAh9MStfvW7KSY4Ia53aTGsVGW2hQV1eSD1Z6IoFgqeRUKv8DCC0QABoMNjM3NDIzMTgzODA1IgwiaisSp0FkV%2BzYmAUq3AMVUGVfZe%2BGhO7dFQdiet0tJt2NrP91xPUlPiHBDykxwiz%2BwOzA62%2BDRPTdpSP4Ip4gppPs1fV7jnbgmr3jVbFsbbfVvVre7gbb8Idv4JK5cjs7eyI%2BzyCNYOrpK8NRJpf9ltau0FzeeQUxqd8QDoYzcGfjzIquAJyxDdWoUVkWHD%2BE9QK4O2dn%2Fj621Xui3zSlenKePtww%2Fyn6y6lqj7TEx0tqlHlN6C1T1g%2F6sgoG%2BNz26dpEFdfPqDe7571rUQo%2BYgFdY2077cNywcZf5nm0SLRgqchcB7fFrPbcR06R5rYSsAscqwHleir3NIPvP1Db7MpFqYjycLYPaeCSvYHdVegMptxvJYv1fM0sFSSmnhleDIZ9YC%2FlOL4whx4h5aEON3kKG3T5V4vEibAOCwhS1ZDZ7YMpqSi1j3pW2bwy3SH%2BFVyjidoFR4p7pXz%2F4YAZSrck1g9cvyiGO4d8SyvwxhTpPaLIHV309PWphF%2FU7s9ED15pGYoXieMgcJDMIbfNgdMbJglxaRs%2FaKcSbSJi3AX3Td9zYdJ348WH66VSSr0InuZ3zG7q1CFMwv3bRHo8F1nbZlaDsbGOPU2J0jLawbVggkf6Mgk9yQZfecpHEIpDXX9SDkXa0Ww57zCkzMTQBjqnAYljz41mXieCEv%2B6QO4tI31Ocy77g18b9lV2gB3e5SNVkJItmmipmAaR2dVUMLiuGtckR60U96yL%2BG9pfPMoXIIXb40S69GwdufpNvLu14P41Akk0JUsGugi%2FjVP695XglWLXIDaZ38NnXR8xpvmiWuWa0Y%2B%2BSh%2B6wzuOSIWfYEtdH%2BlckhwikS4i2oLcv3Ih5nviLT16joZI49Lb2dZY%2BwGt3BKd1f%2F&X-Amz-Signature=6741980d06fb5df294625d0b8009e6587eaae4c371c7a1532a84097cf7b67386&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZOYBYR2K%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040902Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJFMEMCICoLz0n3v%2Fjb0Jufu9c7sc0eoYs28EbxJEOlWpDOS7GjAh9MStfvW7KSY4Ia53aTGsVGW2hQV1eSD1Z6IoFgqeRUKv8DCC0QABoMNjM3NDIzMTgzODA1IgwiaisSp0FkV%2BzYmAUq3AMVUGVfZe%2BGhO7dFQdiet0tJt2NrP91xPUlPiHBDykxwiz%2BwOzA62%2BDRPTdpSP4Ip4gppPs1fV7jnbgmr3jVbFsbbfVvVre7gbb8Idv4JK5cjs7eyI%2BzyCNYOrpK8NRJpf9ltau0FzeeQUxqd8QDoYzcGfjzIquAJyxDdWoUVkWHD%2BE9QK4O2dn%2Fj621Xui3zSlenKePtww%2Fyn6y6lqj7TEx0tqlHlN6C1T1g%2F6sgoG%2BNz26dpEFdfPqDe7571rUQo%2BYgFdY2077cNywcZf5nm0SLRgqchcB7fFrPbcR06R5rYSsAscqwHleir3NIPvP1Db7MpFqYjycLYPaeCSvYHdVegMptxvJYv1fM0sFSSmnhleDIZ9YC%2FlOL4whx4h5aEON3kKG3T5V4vEibAOCwhS1ZDZ7YMpqSi1j3pW2bwy3SH%2BFVyjidoFR4p7pXz%2F4YAZSrck1g9cvyiGO4d8SyvwxhTpPaLIHV309PWphF%2FU7s9ED15pGYoXieMgcJDMIbfNgdMbJglxaRs%2FaKcSbSJi3AX3Td9zYdJ348WH66VSSr0InuZ3zG7q1CFMwv3bRHo8F1nbZlaDsbGOPU2J0jLawbVggkf6Mgk9yQZfecpHEIpDXX9SDkXa0Ww57zCkzMTQBjqnAYljz41mXieCEv%2B6QO4tI31Ocy77g18b9lV2gB3e5SNVkJItmmipmAaR2dVUMLiuGtckR60U96yL%2BG9pfPMoXIIXb40S69GwdufpNvLu14P41Akk0JUsGugi%2FjVP695XglWLXIDaZ38NnXR8xpvmiWuWa0Y%2B%2BSh%2B6wzuOSIWfYEtdH%2BlckhwikS4i2oLcv3Ih5nviLT16joZI49Lb2dZY%2BwGt3BKd1f%2F&X-Amz-Signature=93cce4ffd6910c3c34d3a60f41b5d1827f62e6455da6035c0844f04208e8a797&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YO2O3R6S%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040910Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIETFGqUpIlffLe5q7KihorVXO2VeOlidoA1j%2BD5UlHc8AiEAmJIRqxNnADqBg%2BTVpHU6XcFIh0pB%2Fxjw86RyY%2F0PkJMq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDJ7h4mhkZ%2BFscRtGnircA1gIEDdytc1EnnVFT9PhPzxJ7ayGoiqEWpk0r5eBpemOLLK4rnqtqHnJMzOJU6xCDEOE0%2FOwjLTT2XQA6tLVj2I2L8NJ%2FCynJISodIsU0zuQ7p7Tmr1F9M%2BnYlxdZ4eAcuu8Wm%2BnYjiBirxx8yPtz2j454oA7PnLKeqL%2BZl2XPVw2PAEyRucSfG2RZ%2F9HgWhuCsrk5nPem3fv04j1yPgIcbQ8jtTOOeDeTt2nAPUHB%2BB6VupRgbQiKa8c%2BoKS01ySciby%2B%2B6unonivJNhmr63meuPKU5OtXB3zzX%2FDXzoPKDLOJAE8H2Z5o0S177WsgQCt1aPEaT13F06FzY2r%2F4BZpc3wyCNN7yY5iTSd%2BV%2FJG9g1borX7hfHMGkfgyN2%2F6gdtkKb%2FXPhp7H8eKSofkuOgDKWe1egNOBOKEWsncBE3y4CSbxbW9AgS%2FNyH%2Fm%2FowwNOFubMKUPXmG2e6umj%2BLPAoWDBryIS2hPU3IV4dCiG%2B8nytdcCVa6pLvYVoStlh9HIpFnRDouC0fas5MZV4NumqXh4j%2BrID6RAHbHQnI8b0cUCKoW0gV%2FN4lbD08749a5acxaeS2S47goWDCqHiozp%2FfRI0g7cEkoU6FGcWcc1xc%2BmlGKQiWQpBeyt6MIHMxNAGOqUBTqZW%2BkLCu6V71JkrP%2FudJAZH9krGdqYuehihVIji5F%2F3NL%2FLYxkNGSFy3%2Bb%2FNEcnhcNYnh20YipovDW9zPBnjMf%2BM%2Fk746gFKLdYBlJXKVrnZuKHQ7AuLzeH3OIqvbL7yV1rZQSS%2Bu88G44Im6hsI%2B38AL%2FRN3AtuZhgnNJYvN1bM3SQf5m16S5ccYLAnZsxcWkOy1EfZTzRQZ4D%2BzHCcCBBk5ZD&X-Amz-Signature=c8bbc25aca3c3e85fe63d47d95a205a3e019efeb45958f2ceb5436cf490adbb3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YLLEWHMA%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040911Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIBSdeUCIcmhEQ3Gdho2ZzjKcrelMNmhw8jI8iBfOTx%2FNAiBeZ9wq%2FnVTRQHqFE08wyRCz0Xpfob%2BXJIPx2OOVT%2FLUyr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIMRo%2FRVvFx2bjS1pUaKtwDVkWPWD2wtTMf6wF%2BfjbCjlfLO%2FO1uujb%2BlQzknF0xAorKhuXywjvwclBUM54s8aew7q7OsNA0bl88ACP5Y2C93Tw1w%2BiZKb9%2Fn5ZQqvlBY1xZaN%2BhgfJKVUB4hEVefZ2uY5HVKYULHPTifTj7SBajCRtfcMQQxhiU76hGXciM4p%2F2YmM%2BZYVgyqIU%2FaDL4gpQOl21ClB6jhuZx5%2FPsLo2NuOcPIxR6TNPF%2BJGX69bpIDaYSRSdThzK%2FtMkcrZN8weGGFZTUzVbCBQqK%2Fk7vpBdYCn83BfFh%2F687%2Bw8YaA9nqbQvvq9DwEk%2BHc6eheobo%2B%2FKArac%2FYMxfFBJmpvo2ltRJKuwZhomeVXC63wvdGm3RT8rBYnZORN3SGLLLUfLyCtgttbqJcvIaOsAP9ZsKjxnaON3I3irK61Fc5e8dqJs7HGeBe6YFadDtcuj7qlcTRgdMCGwZv0ztjWyDk8Z4%2B7hZF7i7qVZLJgXBYsLTtWyx6b65tmtfz5VD%2FiPXRd7KuQb3XFfw%2FYa0Tr1UEOxaWRlnGE7uHEKERsd8JiZhDyN%2B95JP5LASPzej6HpWCSRL4vTST1AYr1fm47pHkptbGx92ggkb0IyTDOwajlWobKcJt34jt7BUPW18vTQw7MzE0AY6pgFOcWMy4FQXm03lDW7nc3ikwX1b3xWT0d6BqLGhXMuuhA8FCb%2FI%2BAHl%2BKuT1hO%2B9GYPAnmTJo0A0iwhtHdosYkVzxeBSX2ESOjYqd%2F2rDqLAPOoXgQ%2Bso7Xup6uUdwtAY6y%2FN2ogT6%2BEXqlY2dZm6nHSiJnVjVFonMocWkfA%2BhixNyl2kL1ufUEtMafaIDNsh6kITx2HqlIwWV%2BTVUu8VkGGKUdDAQj&X-Amz-Signature=045d1ae9ea9afbe4a6d0f161610f1b3bb9795909a9d18d5b8b1fbd7094183a36&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QJBLE7KR%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040912Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJIMEYCIQCQU7xqR0P0%2BBHPeCUz6KwXIuaxBiTm%2FMMV6oVcbRBjkgIhANGmF13RMDd%2BW5LvbgvyZbIzKO3ehA%2B%2FvVkqj6i6Ly4wKv8DCC0QABoMNjM3NDIzMTgzODA1IgwDYW9mKiUB5T%2Biulwq3APayLTLv1lepXDqXaQBMFllB9pFbFf%2Beeq9qY1qkzEOrcEf7AACF3kXWEScLOuVd%2F4jCdXfjSjXEuXs9oDTjYlnU3es8MyUkW37aMCP%2FoleQ%2BXfVJu95SvVl%2FqbTQGvnEX9o0zA45pUmNbglr1TLWecZN0AMtquC194K9gJF%2BLDsVcvlilAINmr%2BZzQoZXSQztk6ddz3CFWh0jNma4ApYtLvwVbOcOWvjtkelx4bGPpl5vQHBvSgLNcnLsFMA5MqG36aE%2BBuIof%2BH7qeUUji6rklrZqHD7ntlH3Fdb%2F9jh%2BER8mQhdNU7Ft6e81ccWNBikxbZlTgVSVJ9mbtlQKx%2F6KnAm9WMiMiyMjlq10Iu1k1hRlYZ9EDCTyOGWYGl1CxHEyi9oVEumopLIu4k%2BgS6HlSWi9xDZP8jKSHi70XYE9XFCXZMv9jkPenqh4mKvf9MvNy%2BwPnJupv%2BglOrbXUyy%2FwCUDy%2BcoFi5YwAJpkMgQqFAjeKx8wVUFmOhGwxnKVE41fGVZTBP6s39g91RZvlXJPzrUL4rDQUr3thZEXCcz8WImVY2PQ%2BjARX5FSdFhhd8bm3irRWfqbYKZTlhRtN5XarZDEFdHgFwlPKIe7r0wVc2lmkwxva9bclj%2BDTC0y8TQBjqkAcvctjS2IUEphOD35AovL7GUtwxSutXL5b9f%2B5nbaJ1j%2FJiAalAfqwAKtQqRiLaTFx54w6spji6gf6PArSg8rysOCA1COE0m%2BN687pJNKmYsRgrAYWN8mDHZcpFmFlytdhMOJPzW650nd0TL0B7n4mc8YEun%2BY2Hq94gTVuGpUp8ebieuE6cUB%2FacE7sCI6sCVi6%2FsUSFBmVRyXYdYmeiXtG3Pvm&X-Amz-Signature=093738d15c0b3b8d4ed2bd98cebe5db16d830211c954cf10555f86a6eaa04c72&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665HS3UD2R%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040912Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIQCRKaq4jPoeAEP5gSg3y%2BbznjrVkQrjaJByvO2TzzA4LAIgAjbCuELALour%2FKN7KjBjkNk6kAvIPDyc%2F%2FDaxsa7oeYq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDHDvI0giju8MfE5FjyrcA%2B3zkgjqKt%2BFbvTZINBCF5TPxrUoVzFakFmvcJWcB2catZnipuLp87kpVglXJOlb%2FYwyKlLfiluKYW6bx2%2FpSrich9JdTw18no0%2BNSGqeDVJaO6TLLWc4HED9bESpHx2yaSLyi3rRHEIE6UNVtQT5VOyswz1xzxICYXExgAprBZ2SZPpo3bhjrI2Vc4lR2zBbnU0I9LUnoopGi1cg%2FW6kZ%2FUcFtzEDtAESHVN03Vy2OWek7QXasY0Mk%2B9GR9yXhlajfKitws7VRJWeErC4vXCpbkmux%2BQk0f%2FgxebHSVLbUZBdPmP9vQw3zrvegDRnLyMk0pdTbD259RRedUcvh8uS3UkDiI2B3RPGLxX82he2o2rMLcvsgCXd8f%2BO1MP6WZg5wNYrvr4qll%2F3pyRkx6YM0sAioPnHufnzfgjzbx7ehmBcP7bFQoggfwj2kdjBSyDXmEddLsCoYd1seGfMd88lxZiASYeT6t8tQjBo1Wb%2BRAnuJU0JXCJrQAcoBNgRaH4pi045PoFlzQF7ArnrapYEiOruhTr2XCZEowVBs34gh94%2F5f4U3zq2Eg2bUGXMohpmAU2nMcc2uHWVqhVvQQ9CCuLBEsfwkaeqToC4y0pA3IQ3w04VYqzaBWa3gtMKfLxNAGOqUBdTiFLvYTn0D9lZpgUzShu0qJAZ%2BPAmHlypa7%2FZsqXDk2vVr116DFofSpee5qHIGFIPUqb3faEVgyDd0U2wyeHAe947T6zLSTwRZ4RC0gLWoMoxE5wq5L5IRD5LNtaWAetoU0Gz1gt3kpMxeNOXDOKNqSGQXBP5XMY6%2FO%2BlEBFD5oG9HRy0t3H7pgoCMm%2FUEIb2DefZsk5LEP5Dm5gCPa9oypk3xE&X-Amz-Signature=f5ff234cfaa9e1f1e50a917243f43b5a2a33393570947c8beb55b41bc935d577&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UFH3YNFY%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040913Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJIMEYCIQDqeV7TuFsrTUxlUJ5W4emq%2BuAkRtdP%2B9AgPHFpZL5TywIhAJ4liK1jMgYUjAe0cfzFX0HS72uj2RYacYuwihvRcSOnKv8DCC0QABoMNjM3NDIzMTgzODA1Igy9HkbnpvkYfnWOfksq3ANxWf5HIp9ZUxmNSoSj6eaJEzhtKC7j48PVpjFgLhF392W2oXSmAINJm8wOE6BrDP%2BDv7uOr0FcXXeZmw1AkyxyPRyg%2BrVeaniHQptvZAkAtYpArqGsMVpHjJ239fMK5avEe6y5k6RkEcsxF3weJNQiIgdbOBmTeHZPv60ivO3CheSYyhRacROUlykeEGq03QiDyaVa%2BubT61%2FTRFsh4Q9iuVhYx69ccNBRZ546JLYPgaEpwEwi3WQR8Rsg9sManlxYD5XmggM4JyTZxLWoj8pC9O41vMs2nZQz7amzpsNHmuix9tjiOWzDRRtnlOFEwUuXFrpY99TQkBRz7Nofe3bb8%2FCAfK2nz0K7KVd3D2yakCvuJsXUiQzF9ByoxMMtuF62zdMHxDyAQgtl%2BYzef5gtp5FEN0c%2FH5msArCv%2B0s3A2ptpcFBIMbcUZnT3ygyUzAQui%2BC4V8q5Q9EtbcELLSfc6wQ7mCfq%2BtHWIrKBFUD3MExuoO4Hy%2BC2sxPMhhRRdWVX5yw3nl9Cb3R4QTZcrvB1ytG4YQvfpyXYiiQ%2FYoSczHae4EOUuMB9BjIp81H7HwcIWpwUPL9o6QkSvcw2KGuBYfx69W4nzH5%2FiiWLqjGmR34BRpZokgF%2BRpNJjCgzcTQBjqkAZu5DFq2tzB1BoD5jDEef9XpMaqcsQ%2BfvcopW5%2BFfUuhgWsMrn8wvKjH0NN1%2FSHga19ekO3uJsRNUgvLecoUwh4MBDCtV%2BiaeX6vfe7H%2B6jSGLitPJVejxELM4kgxXG2ASAIB%2BdiKisIIavkYTG%2BTjRUClCbD1jAZXml%2BlBfZwKr6NYInMnFAj3COOK%2F4Z9Xg%2FbDKpHsM4ccP8ldmt5btaLGSey%2B&X-Amz-Signature=8904bc7e997bf46f14bdfbb96cebc2cef204292441cb2cf5ee67deb6a4de24a5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZOYBYR2K%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040902Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJFMEMCICoLz0n3v%2Fjb0Jufu9c7sc0eoYs28EbxJEOlWpDOS7GjAh9MStfvW7KSY4Ia53aTGsVGW2hQV1eSD1Z6IoFgqeRUKv8DCC0QABoMNjM3NDIzMTgzODA1IgwiaisSp0FkV%2BzYmAUq3AMVUGVfZe%2BGhO7dFQdiet0tJt2NrP91xPUlPiHBDykxwiz%2BwOzA62%2BDRPTdpSP4Ip4gppPs1fV7jnbgmr3jVbFsbbfVvVre7gbb8Idv4JK5cjs7eyI%2BzyCNYOrpK8NRJpf9ltau0FzeeQUxqd8QDoYzcGfjzIquAJyxDdWoUVkWHD%2BE9QK4O2dn%2Fj621Xui3zSlenKePtww%2Fyn6y6lqj7TEx0tqlHlN6C1T1g%2F6sgoG%2BNz26dpEFdfPqDe7571rUQo%2BYgFdY2077cNywcZf5nm0SLRgqchcB7fFrPbcR06R5rYSsAscqwHleir3NIPvP1Db7MpFqYjycLYPaeCSvYHdVegMptxvJYv1fM0sFSSmnhleDIZ9YC%2FlOL4whx4h5aEON3kKG3T5V4vEibAOCwhS1ZDZ7YMpqSi1j3pW2bwy3SH%2BFVyjidoFR4p7pXz%2F4YAZSrck1g9cvyiGO4d8SyvwxhTpPaLIHV309PWphF%2FU7s9ED15pGYoXieMgcJDMIbfNgdMbJglxaRs%2FaKcSbSJi3AX3Td9zYdJ348WH66VSSr0InuZ3zG7q1CFMwv3bRHo8F1nbZlaDsbGOPU2J0jLawbVggkf6Mgk9yQZfecpHEIpDXX9SDkXa0Ww57zCkzMTQBjqnAYljz41mXieCEv%2B6QO4tI31Ocy77g18b9lV2gB3e5SNVkJItmmipmAaR2dVUMLiuGtckR60U96yL%2BG9pfPMoXIIXb40S69GwdufpNvLu14P41Akk0JUsGugi%2FjVP695XglWLXIDaZ38NnXR8xpvmiWuWa0Y%2B%2BSh%2B6wzuOSIWfYEtdH%2BlckhwikS4i2oLcv3Ih5nviLT16joZI49Lb2dZY%2BwGt3BKd1f%2F&X-Amz-Signature=1fe9ad2834fb5051b4b2af033ac34fae4360bf8378d60e1a015a0ddea9be1750&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
