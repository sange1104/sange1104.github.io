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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RMJ45DPN%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T005610Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCBIw82jAaFDqPjbOqthDzkMtc1tHjTfIhCL3W5QljPEgIge9ycT1dZMe4pbjGQnm3tkgLsIftVVjJbXCYEFC0FI5Aq%2FwMIahAAGgw2Mzc0MjMxODM4MDUiDF8w%2BTAK7hreSuNd8SrcA5cwocSyEtgvOEguX3Grp4B7Lw3lzxdHBwci4nS4NBlwP6Urwma6kHZRv7IFBJo9uzFbCuqKAN7hTsS0Gju%2FyXGziaCNEvKemZPQ1Nf4u9%2BGKYUBtt4JictVpJdFIR6TZ%2FKdbDkdR%2FhRBIzLASee4aRM5ViEjhW99ouDwftBkEs0ByxH56f72iLyMdThgy92Z%2FIvGUYIr5uURx33yl0pYY8NBUh9pcRvolEqrg%2Fxw%2F5VlNtXf8P1%2BZustZmxiJoJ85f8CBA2Wv45VF2A7pOjqc4ukGNVr8iiB%2B74%2Fkq7d0h9lnKr897ogKEe1VeRBScG1d6ov9SIxafcOQG4wO7Sp357oIyy5wgGr8n6Ke7bCEzF9MPcW%2BKhSzEfubOViHTDMRPzk7S3Vjsd1tu7NionWuvoQCcD3j2r47yOGOyk%2BEqG3hhgi4DRVAyer7vqm9cUsgh9PvSnY3HYR%2BYBpx1GUxq1veKsgYmPm2dsBwJ2xtoGxj6Np%2BFwOTR3vZqICTUFdVftz%2FBrIhrUAvtTQsuD%2Fk7oPU8W%2FdjxHsmgaZFeNifR%2BfMZa2CeYU6Zjo1LYCAaSS4IO%2FuYbaKYCfz0XPc%2B3PV%2FvhX8VCuU29STf960dlW2TxrEwJtq37Tz7cyvMObW9soGOqUBax17Z4QP0NO%2BE%2FPXnrb4P4yXqPctkfN15JJasy6l56Q0zOTIVK%2BnJjASEXNDWM1XsxctPQjJjrFLhad9emy6uzwap2zcaHOAT%2B2V3x6e9%2FpebSCq0Z09cOkAwQ1JLSULq1lfkQTY0BHYw2hdZswQRMnjT5EV7hJhkFCelGEU9%2BFcQW9yATje1Fc4UQOnRIkZv0prPRuLkdObvdH7Ix2xpcaNE9es&X-Amz-Signature=ec279fbcd153499894f56e94d7187ed66e7ac6432888ce5a046e3062027a5e83&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W4BG23T4%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T005610Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDZSv9tndjGpuqn%2Fl2CgiBhcpHq4VbYb5oaMG1VnKcEMAIgbHJAfIDNyo5d2sIr6giyCkq5ArIki1v64CuUOcQqBhwq%2FwMIahAAGgw2Mzc0MjMxODM4MDUiDMIVTmv1LWg8MEtNqCrcA5exGt9rKThXuuW8e8df7JEfB9vL4qAg17xk7WUwJ58YvxmfSgAKmKh9Ej8AAXPTudR9Rf1bxmJhemGK662CKq6ATWw9VyFFaqIX3XJqLuwZ%2FzCp%2FWBKpNlbOznchRgwkFO5gqVnNjNX8ebND4WAfTZx4zu43Ym2ABHKtekiGtRcI8VFiB7wom2lyjZdaEJUxZ71LnBYQiPVkIzeQIkN8ymJHHnS7VoxXF46nG4HypLTmo%2FP9ILaucq%2BWWWgLTC9%2BYHi8TacxyLpC8ORelh8yVoAEeDpIDABe8HZNbwgAiMbSqj2WFMn3pQjGbl%2FCPeyoJS1KC5%2FtLLNAZelo3Yv2rRbjhp%2BvjXB3u6gPJjXQF3bRnjeZr8u%2BSAVtKih2%2FhVG9AWlsJeNFPWeXwElfclhYH5pti0dan7rcSFwXWYp1YO7ydfNPfYBs%2BUAEGEKjVbNHsPoKXxnqVA%2FOkuK%2BkADeSOEnu1tEp6jrDDT0f8EAP8k0P5lfy82fUpJiUleUnIeduMEdKCZZAIaiVnif43PkxVSkU8y%2BDFHzy7HE0dgrA9An7GopyUxkhrwfkOJ5xT2iujEhb8m31mdIoq7BKxp6JTExH14GkxPzBCBx81XIETMb6NSnu1Bytrs40bMOfW9soGOqUB28H5IfcFpif2hlXr2eotP%2Bdw5xe4l22DsJ5xGkf4WOVfQ40XN7HbZsDQPoaPHqCZKDRbpppUaZ5ggjaqG4NyOIeTHbZDYouCdyFnX3bibt5v2EI1XwmhVWhwyc%2FZ2RmNEHtE2ZDX%2FIi0KiC8ybiQy5zDMD5F6ZaCokHhCvnnKm8ySZP8kgI3ZESoKs15%2FT%2Bwn407HKYR%2FE%2FjMOOzTrrQ5KU7Uz28&X-Amz-Signature=c6e91979e2f207df689fe224f5bb152f7f3a5af25a6c14af2874d51ae8cc33aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46642PIFSX3%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T005603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEyKrUjFs4sRNo%2FxMI6CJg7PfHHSPb460TYr8untjAAcAiEA4lspVyyr2nr3Ga0qDDt1C%2F8GQ%2BFtPcoBgnbLxqtM0Ycq%2FwMIahAAGgw2Mzc0MjMxODM4MDUiDLBB2WGULmBcDWntFircA4zq3c2XGWO1q2p%2BbEGdSbA4cwXX%2FBIUGFGnhOr7wMUmLd3ZppIwAOruWKvIPrqE3HUgcnTBDs%2BhK42IFHFSbZdnkVMgpURLcno8lbmWyVG1tuFx4aPBbKEiR3jgxhSGqUAiKPHQZAm0LRO%2BMGFnj6EOaCiZU16usuJgOo69MYeuJVruSNwY1%2FC0KCZM%2B4kVsU19BJiUNEvL3%2BVS6A%2ByBOOeCnoIkDB%2BqWsThKitxwikpUXfn3KWxfVfdVmAxWpRrxacnnA7FTTGohveeChb%2FkLDUxblsB01TSnpza%2B3opMH9PvdViEv3D8TXnAs1AN8Jq8H8Q5ZYahftY%2BZacrSipoTBYv4xKi8%2BDa1WfUBrtMAM2Lr25XLPEd5I7CqQJOziO0KVboNG1itMWZWBDDoSgavrfSo4xYmk1HI%2Bua3lZGT9OpqgYDevRR0L8mzHm0imq3GgqfqGH9ihX6WTrZLhWL2BtJaMR%2Ba9aSCfm7bp%2FzWPCfD5prz5CJjnECevIb%2Fwa0duoWHnpfh0paJOHycBjLrK6xAhJTF7NdFGkmKD%2Bb4HmAXFxIkkRlAIrdSGAt9%2FTzAVWltwtcVVJ99rCUQddkP6OSWRJdpzrNXdltvrxmv7trogqSk0J2zBkvnMLbW9soGOqUBulNgYZi5YtkhaE0qzmppcThtL65r1UrE83to4F5DWG94GvCASP8814CwZUs%2Bvp0oKa9Me%2Fo4qmk9K4Wy0syW%2FN9wuqbBRf2QBojs0Bp2bsW3XNy2LOyqLZPjw9SRvmzGGhe7Ac99pp9phw8HZ3jlU%2Bmxu6WVEUs%2FgCGaOwowh8ip1TQ0x4AR1Jpbvc5BGpIoRjUdeNgxZwwaEXKxgXBy7qu0q18Y&X-Amz-Signature=5ceefe1c14b9d2ea189ee24c45b63e290b9afddf2c324d4288bda397688faf6b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46642PIFSX3%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T005603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEyKrUjFs4sRNo%2FxMI6CJg7PfHHSPb460TYr8untjAAcAiEA4lspVyyr2nr3Ga0qDDt1C%2F8GQ%2BFtPcoBgnbLxqtM0Ycq%2FwMIahAAGgw2Mzc0MjMxODM4MDUiDLBB2WGULmBcDWntFircA4zq3c2XGWO1q2p%2BbEGdSbA4cwXX%2FBIUGFGnhOr7wMUmLd3ZppIwAOruWKvIPrqE3HUgcnTBDs%2BhK42IFHFSbZdnkVMgpURLcno8lbmWyVG1tuFx4aPBbKEiR3jgxhSGqUAiKPHQZAm0LRO%2BMGFnj6EOaCiZU16usuJgOo69MYeuJVruSNwY1%2FC0KCZM%2B4kVsU19BJiUNEvL3%2BVS6A%2ByBOOeCnoIkDB%2BqWsThKitxwikpUXfn3KWxfVfdVmAxWpRrxacnnA7FTTGohveeChb%2FkLDUxblsB01TSnpza%2B3opMH9PvdViEv3D8TXnAs1AN8Jq8H8Q5ZYahftY%2BZacrSipoTBYv4xKi8%2BDa1WfUBrtMAM2Lr25XLPEd5I7CqQJOziO0KVboNG1itMWZWBDDoSgavrfSo4xYmk1HI%2Bua3lZGT9OpqgYDevRR0L8mzHm0imq3GgqfqGH9ihX6WTrZLhWL2BtJaMR%2Ba9aSCfm7bp%2FzWPCfD5prz5CJjnECevIb%2Fwa0duoWHnpfh0paJOHycBjLrK6xAhJTF7NdFGkmKD%2Bb4HmAXFxIkkRlAIrdSGAt9%2FTzAVWltwtcVVJ99rCUQddkP6OSWRJdpzrNXdltvrxmv7trogqSk0J2zBkvnMLbW9soGOqUBulNgYZi5YtkhaE0qzmppcThtL65r1UrE83to4F5DWG94GvCASP8814CwZUs%2Bvp0oKa9Me%2Fo4qmk9K4Wy0syW%2FN9wuqbBRf2QBojs0Bp2bsW3XNy2LOyqLZPjw9SRvmzGGhe7Ac99pp9phw8HZ3jlU%2Bmxu6WVEUs%2FgCGaOwowh8ip1TQ0x4AR1Jpbvc5BGpIoRjUdeNgxZwwaEXKxgXBy7qu0q18Y&X-Amz-Signature=c00f0102812da21b1faae549a2b820e87209a7ab098981f426c3984370e9b1ef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWGBK44Y%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T005618Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFzsy9RkAADgUCpqgN0lmrFJhPtj2B6%2FFNt0hXgQ7oiNAiBhkEdmGrU24w%2BKG4YHeTPQE1mo%2BlMtND0zzp%2BMb3radir%2FAwhqEAAaDDYzNzQyMzE4MzgwNSIMOOtESmoZLC%2Fbm4gwKtwDLRSMyjS2wFrr%2F3fopiqusN8QkC5hhJhRVvmpoluGIBqbxReuJCZpsp3yk%2BsMBHjvB2%2BYJr3%2BeZgFcATF0VJ1fY8GUobQZxuGb2lpM8J1D%2BPzHSeU2THLjvJq%2BlxtUoFsK7irU0F9DqEk62xSr%2FKRCARj4PhiZ6ZPohMDcxSV9c1qYFz7sXsUA%2B14R2A%2B53IT%2BvyYqQsNMSY5xJs%2F63Ej4aATHgLaXg%2BIy4iP31CeMRdFh5XlOQYWkUeBJUJkkEXVkmEo0NK1XgpsNHvnmngbZmapU%2FyBp6RtuiCqSLoIleRsOQVC1W8urxHGB3n9Z2FZnlESpblOfIYcbBtLb1fL%2B%2BLkJU24nLrJbI8u31YxNEkxCC5EmWZuBN14gW4%2Ba8JNFHfa1PGtJ7pAxC4A%2FJEerA25jZZpOttrvHAK%2Bb7kEGWqdUU6k1V%2F4ICg%2FOs5EBbZmf%2F3EALfyFmMd1OD8QPR98UP51ziya4oxkpwYzQhm%2FG19DXnF%2Ft%2BBC9oo4D70a%2Bf28awFyeKLRADnfgYJh7Q33t%2FXn64HICn%2BOehoLjk1Y%2F3D%2FSKe%2Bz6iN8DMfXceYEgYg0WRM1dw3zVLuFTrUOVwTBd6SNSW1EhvAh1tOf2EQbBDqxW5mNTr8f2qeMwq9b2ygY6pgH7bI1alxOgGWOGnNv7egGSyU81glGm0aJrIE9ukdm%2FcTR7%2BstaNWr%2FdfKMwYdFctl6TK8sBf31EVMshYzZxnA5tiK5UHZR2%2FNE9l9tOwg7oP%2FjP5aNWR3Hn%2FrrxF3Vz3A6r91R3hycmlm1XCw0tun8jeSfx2D2BKnosrIyKcB6cNjKDGdUBwBwoKvVBEqsnZmkLNWREfP24rvHfNya%2Bs7PE65K9Rso&X-Amz-Signature=25fd28dbdbf81dec03b086cc160ce357f59ab519d0fb17aaf3635d9c8b1150cc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666KVXH4SL%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T005621Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCjnP56taFG70OANCPP5yj4pg4FbbmPIoGyZvBFxpm5FAIgEvMOi%2FpDyhsTWxFNCQJiSZ%2FE8Kres4l2cOvIBY4UC3Iq%2FwMIahAAGgw2Mzc0MjMxODM4MDUiDDdPEcffF9CEfPpcfSrcA2PLxtFyD1WvLBogrIGzlBsnV8N2e5%2FZfxX9wpUNPh%2F0bdo4nI1hNtaKG9WmEkrDVZeBf2TUZZDPUiiacXvXpEvzn5iWpFy1lpn3AVJP%2BBUoEk4XVHlkQ%2F%2Bm5bzk3GDZrPRDk9J3yprdwCXwRMPxd156cgiOoaIw1em55uypP1h2hIk8YfnAcyIk3v%2F1s1FP3U7Ol3xkLFkmPFhvX6TQVG369gx7dLPF3oB7bTDEMwMS9X%2B9ecnUN8BPdyRLLlaRmWcd2E3W3%2F5rP0Kz7qSmbjFVHHtD5E2PptzeWb0bhZT7pV91P%2BbRNIA%2FZWSiFhyJ7zBPeL8WeLfbkx%2FE3QofVaaPrXQ0YN6pN%2BVTixNbOxlvqlnDJBTSorr1VAJzTY1FhgltYUmSZNLq39GoMv5Gk9UTYfg%2FU%2B%2F5kkoK9qXtALo5XGLRjeBah2vhK4D0%2BBo%2B0K47qks5nhpEEdaJTGqyNCVrLRKMJ1aIq1qnUWOfS6Aez9ovN9QXPX8mETnHQP8skvBs0D7ZJlL%2BfzqZDdpKZ99jQDqkxlnW%2Buf9nyJrEPKRnOC6AfFEwXi2cDKWfo4gI5W1XOc65eWaTlFaPRWggyCiFhTSxsI%2Bm3XIuOybcbrb2v0nxzovDw47qc8%2FMLTW9soGOqUBJMoOU5L9i%2BH94xfnUOXn%2B7UUOgJTdjFty61tSasyxFZDzC%2FoyuqPjMa8jkHB1EXY5MFYThjLjsYpjlcY3D6MZ7zFYWCZM%2FFpm3kJR84XWrDoKztvi93EM21HIjACg8AGsC2%2FIax5nbUC%2BCRJGwzTAFbkk7KfmNHg%2Bpng8hYI03UwnrNmzorEiuZZ7DhbrQMt0uXpEt4J9%2BEXvLeX49VKIHShqUf6&X-Amz-Signature=b8d7aa1976cdd1dba8dbfe953d70f31d26afabf7c925d34b2888b3d8ac0affbb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SAV2UGHI%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T005622Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQChoyp7grL8W9Niuo3SRKeoGbcy8wcrWx5b018pzMzR4AIgYyhjkuXOHPOUxuA1iITBqknqZ0DW2VO%2FjqDN7i6tyv4q%2FwMIahAAGgw2Mzc0MjMxODM4MDUiDGYf5GzMsPBZrcbRwircA3gbLH3o6M28tFVBV6roCwBe29XKhKNTzD0Nb07ear43EzFtJgDNpWj9dFpto87QJzY%2BAFIFxKqfj9X04EubWQjtEyzrTbN5mKRq0jI9Y5TZSY4KyAYThUWNsQufFZ%2FGbpd9I%2B5UOjTiMTu%2Bnp1Qqvc%2B6HSnlToko7n61K%2Fo0n9sz%2BJ47YVNPyfbJzW%2Fln78o9sD%2FbHkENiG8DvVs%2BCqC3WBMj7UmGdPWHu9iv%2FGWWRzxKADKMcLvKYpJzG6NL75q%2FkzxwEdBqLeFBTFFAz%2B5cDYILKwobuvKxLD6YqLfSNGvDd%2B9GB1OYBsNU0tf9XxD0fZKn%2BYHeIU3W0VYV9JDXgnev23%2FLKBSA8jyYuOQdBmWWwjA6XeRrIqeLcjZ8hVz4zYPA9IrlvKA31F2qEHB90PfyN7X05%2FLnphB5NwxZ1HKXcC7zPtw31wq2N7BJnfzkdH1XBr7oq9iP8s1tYKu7yzCHotRlwytc2qoT23%2BtEfomNgqgad24fj4%2B2ovW47x5eEmSOE1VCc5MxdPiBvXzoKHh5eEydSZeM1OQ9UJXvpKticDswc92tsXnM05GaxvSptvkQ2ojauFAmtBKa0Zx5i5Snv%2FCbhqZoRHjGiKg7iGIgOsbXn4np0dEyCMJjW9soGOqUB%2FGZlynfExa5N%2BYmNxgGLLo6RFqwGcJWUTxxn4pqHoqR%2F7e2iMxbVsQgAb8V0Z6ov1%2FM7DjZAMJBIFFNvneUAmIBruQO5Ep01Q5JAA4pVBCsV15MubWyVu6fh3jnOLe8IuyorInfBSl%2FHHq%2F32FgVJP%2FutktXVy5s%2FpByEcysnjdIr0aTDMKu4KYK4L%2Bp6QtT1n0%2FIWazhGz7hyu%2BnAT5rRASOC2g&X-Amz-Signature=f57ed1dd19384a8d1433dcfed3cd8dc87bcae009f3edc603eb9399a5138e547d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMMCY4NH%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T005622Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCNBsoKZH4XWceKMJFmPi5TbDVbGg46gk%2F1VUER4c4HgQIhAIlxQSc8DyBz1xtmm7o96xmcvzd3R4oyrifbSS2aSSzIKv8DCGoQABoMNjM3NDIzMTgzODA1Igyl0Ar8riyO%2FoIjdzAq3AMp0LO8IFbn68%2FSB8D3t0qJeAtsBiq3sQei4ENfEQK4lOR3xXEFLNQjhx87PyPyRTgCyv%2BHREzEdA1vO90wMxjb0ss8SZ9nazpNxp6CgxjCEOkHHpMGFpwvouqU3LlZYRvBFsxkXKAaPzvuNfbRU%2FHv%2FK3KEZoUNXRWjff33swqxxn%2BVXtC57Qy144JfHLeFn5KitGc1D6vybk7bSeF1Yz6F4dver8ykxzsPVPTI9y48LcC2AKDxIFoQy2quKiNoNLrpzW77BdMbkRiAI2CIc%2FbJ0f3h9j%2BfA9qVp1uABfwTfhdllhe6talJXS%2F%2FvGGzW7qrrbdP%2Fq0LvGBkr7nVYufg4gC41%2FmbJZuHv%2BiFuRqCUf9IRTuNtNUv5wv%2ByZABpBpCvhtkfmM55wvVd%2FV9eYIF78oKAwy3w62V2xOiDvlbA2d7iZhlaC8UJjhr8eHwKPF67spKKLIb5gv5bMDwRGm73dMBY3KE6EQIYiij5JFJ93K9YMiG5yxD%2BjCwqH4loXIpoosRDCZ8jkl8qFzJxYW02yyxrubGccMiL0nMsV%2Bxeu5bc%2FKFvLw5R27boSryERlx7f1jzupTYhIaS6DoHD2k5U55rvGz%2Fz3nNfRgY%2FEPMJ4qJ2T4srDWmASxDCi1vbKBjqkAcu8CRdYd8UC0cATgIi8dVFV2ZEzCGwJc6161RJJJhGf1Kn%2Fh2%2FMRzzW%2B0xHGRhI7I6fChtdUv6VFAN5fKVXUTTTmVvHgRLK7NlfS%2BfDqrklkd5Vy30q5yw0Ppx5rEZwPCcSvxJ%2BvPuq8kS%2FPFqVzjKk6V9lKun4E%2B0CsUNELBTGE0IRDH%2Bnk5cfcHVNvg1YEUvkodxC0P1JlwasLlM6FR9qMaNt&X-Amz-Signature=62d01c711aa6f24df68052ebb597a531b4579878fd8e62488a98ff1e88155509&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UEKP2MW6%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T005622Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBsIV%2BzqTGApN0hvXpgeZd%2FrDI79L%2FjgmfhElz8ih2VSAiEA4Osxyc7rLxTzg3PjNWctgnyVJCCDciNKiSX%2BwQ9G1WAq%2FwMIahAAGgw2Mzc0MjMxODM4MDUiDOT14la4wDZvBehc9yrcA4rRKmOO%2B8i2vz8JvlxCfoSNQTixrRWZta9B1L5oxX14JzuuxrU0a%2Bf9H%2F%2FJ%2FODO4XCoyk1iy72mtpX0Ngr0QeUqDX%2BzYSjRMmh2gCRKl6OLbGh0ODumUmBzMe3pOupyQOkUBznII4PKH8GVzR%2F2pehdOIrywAoQVdwgpWucIUeXz7mvkM24zcUPkSAWTaJj5VZ9OrOGCcyZrx9cRTxzryRQU3HrOvR8PFql0QS2R10J%2BraGImKJAf5hx962AmrZm45I893zUG%2FcRaHvNp2ofZg9NiIvA8ZLQOxOfA2d%2F1BkuYeFvtDRRVl54s0gCkAPuONYUYFgX0h0c7LwSwJ7gl25OBTdHE67eNuBphvdM3fH58H4nKudEjR3HyeP5%2Bulw41s4PryfjyELGfD8ayKixWQBfoJ5Qbbg4%2BhV1Okl95LQQkgz6I6G1z%2BeKaisRCTlDynNDihhrz92GWVQIYS4qC76PC5U%2B9QWqLAqJNuIF0Z2NiZE%2BeX6i94zjuZfsAdGyeW7MBOaaKP%2FbvjbutjUUkZ8%2FcOLoBRbwe6%2FQxkuHfwIT93hUobVXN5UZY1SGG7qEuS6O7kkhG%2FX1CD%2F6AMPp2H4j1clYu7K%2Fn1cdUhYwKwbtnK1nos7KZUDMHfMIjW9soGOqUBxslQ3jHxdO%2FSF9I6iytwKmy7x%2BFl46O%2FSwyuqI0M0jG8jiYY43b5TZbXKoH3yXnMFbujBD8JmlKR5zBEdX30t9qthbVr%2BkvSY1CWmX8VIg%2F%2FL0Gdl0HeNk0neuaAeJzAFWLf%2FZa01SkqmxkOQ5FBr1TofY%2F7IOLuCJBx6c6TTbYvqs3gkEgRlL3X1nCCfhSxiFQaFnUjKC761DLVII7poVE%2BWLyE&X-Amz-Signature=ab9bacc8cb6b4e91a8ad3258aacbe047b8fc5d137a86aa48317053d5a395df5a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46642PIFSX3%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T005604Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEyKrUjFs4sRNo%2FxMI6CJg7PfHHSPb460TYr8untjAAcAiEA4lspVyyr2nr3Ga0qDDt1C%2F8GQ%2BFtPcoBgnbLxqtM0Ycq%2FwMIahAAGgw2Mzc0MjMxODM4MDUiDLBB2WGULmBcDWntFircA4zq3c2XGWO1q2p%2BbEGdSbA4cwXX%2FBIUGFGnhOr7wMUmLd3ZppIwAOruWKvIPrqE3HUgcnTBDs%2BhK42IFHFSbZdnkVMgpURLcno8lbmWyVG1tuFx4aPBbKEiR3jgxhSGqUAiKPHQZAm0LRO%2BMGFnj6EOaCiZU16usuJgOo69MYeuJVruSNwY1%2FC0KCZM%2B4kVsU19BJiUNEvL3%2BVS6A%2ByBOOeCnoIkDB%2BqWsThKitxwikpUXfn3KWxfVfdVmAxWpRrxacnnA7FTTGohveeChb%2FkLDUxblsB01TSnpza%2B3opMH9PvdViEv3D8TXnAs1AN8Jq8H8Q5ZYahftY%2BZacrSipoTBYv4xKi8%2BDa1WfUBrtMAM2Lr25XLPEd5I7CqQJOziO0KVboNG1itMWZWBDDoSgavrfSo4xYmk1HI%2Bua3lZGT9OpqgYDevRR0L8mzHm0imq3GgqfqGH9ihX6WTrZLhWL2BtJaMR%2Ba9aSCfm7bp%2FzWPCfD5prz5CJjnECevIb%2Fwa0duoWHnpfh0paJOHycBjLrK6xAhJTF7NdFGkmKD%2Bb4HmAXFxIkkRlAIrdSGAt9%2FTzAVWltwtcVVJ99rCUQddkP6OSWRJdpzrNXdltvrxmv7trogqSk0J2zBkvnMLbW9soGOqUBulNgYZi5YtkhaE0qzmppcThtL65r1UrE83to4F5DWG94GvCASP8814CwZUs%2Bvp0oKa9Me%2Fo4qmk9K4Wy0syW%2FN9wuqbBRf2QBojs0Bp2bsW3XNy2LOyqLZPjw9SRvmzGGhe7Ac99pp9phw8HZ3jlU%2Bmxu6WVEUs%2FgCGaOwowh8ip1TQ0x4AR1Jpbvc5BGpIoRjUdeNgxZwwaEXKxgXBy7qu0q18Y&X-Amz-Signature=b8478703e8b767d93b38a194acff31f93afbc05eead0e3f4eb570a0b60f4bc2a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
