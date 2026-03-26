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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZWZACHD2%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032918Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDSnTa1XEBXcaSW4OfrTfFt7Ibxbjhsb520Gxh9Eac2zwIhAJW%2Fm8hqlw7LKP2DdjNcotzq55ZO7UJEXmohr67qFKbQKogECLz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyAMfX7%2FpkcMa0sXNAq3AOrZJMCMUUxzbb70PnxRiXEfb5uaOviv%2FscTv%2BXetL2SJA61iRFHFEYrkbC2rNY0hluvfSGbzEyJGnBiyKzCdGJ3y44Z9lWZN70MADRCVbq5r%2Bv1G%2FhN6xSBbpTTXA0%2BsqcribrT1eAbSgaf1SZ%2FAczOeGF36YDSbRhxnNm03dlqPqrIfOvQA3V6G1ebA3agMdxJVVc7e1J5gyx0FVuAkJo6n9esMPh%2FchS3DObQeS8iKpp0N1isp6bTEHqpBSTp8cBHPBzgDyhNy2ZdnOwwfSozFATOnE8W77PdtrB7UugYt%2B%2B0Y2N23CxcnA39YlLZtsiRkHSfRsfAErbQvAJFfrZRVuKMfQikkYpZcSOtGCIKMREAQGlmuitry%2FxxUE25NuSVljVmYKHVdRECOHF4G1Bi9x9%2B1k61CVgLMe%2F9ujmt%2B3AVVtLjThBJlPW16K1y8FwQoxwkRmnJe48ag7amNkrNHV3y12KcQF5rpw3bE7rX%2BX4cY5DjvoVoVfVizxGfpPMcsOziYZvFMF9Ip9hlJQgi8N043sLPJPUxgSNLpi21HQwbgXxqTMXP8LDvdWSx77m%2BUiSSWc%2FA%2By3zCJ%2BO7BfO2DH2t6sQs9FpgCrYqWaGdoP02C1xW5HpZiNjjCbyZLOBjqkAXUWHITrlRb%2BTcpcI6QUy3xEuWnU%2F83n7sLQ1Hn8e%2BVSKwhplxrL%2F6GP%2B3jb9gihOnIhyKBDdeLtB93whAMLZpOCgIcdcU92QZN5jjKvwSPdsIDhSpx%2BhyFr0k2zFRd11eTXEakrck4dfSwUtzkGhAHuQmGxjHOWdpqKEWWrXwItNY7uye3Z9GbKSMSOuUQpjUMUW%2BFkS%2FcHKXbl1C%2FG9K9s689E&X-Amz-Signature=52f77506496f8e7f73caee86d6cf9eca411864afa4e686158a8e01f88b267986&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VHZGRWLG%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032918Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHHThwNiHLpy3A%2BEYCKABKKcF6tCkc0uWn%2FcgaSFRAOaAiEA90p8K8woBv4%2BIyTQYuU1ep5K7XRPVbzF51pjFpUI4oAqiAQIvP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF6m%2BTXtphx0Uv%2F6%2BCrcAzleZJTIkb89iv5mphFFqebUbCcFyP9cu3R10VoWQ1Ldh2B2XBH6mWjORsqVBegB3uIvPDH4VLCyH3Ad%2F6%2BE3YXCWrlJCxiJ9IyRPsJyoWGPQJ8%2FYFdRWSX3EOqVbeDQwGeXzma3r2%2BdLfwJkQQOzm7PLbPXx06faEynuqpKpbjipYLfbg%2BNTWtHO8d8vx2jVWusyDVS1hq%2F%2Bw8R04XdvCtNAdVtZl0pEMdJx6fmUWCJqQIyWNY8kOTf3yzEmlengX52UjyC1ytGKz8O10FQf8yyMiE8UOohEggj8MxwcbylxoD8Tk1tYKMwUWXY91FXONFy0FFNNlPrABFrZDpNffasMwCbRUX%2BmofsZbnswSMxFJUp3Cy3kI2YnQ3QUJbJgxZH0U6Bb27fzaeWoAF8zEqTJhtUwlL5M%2BUqDVAZetwI9c4JSjR0vEi46tXCVyNNDMCPolJ%2BOplq6G8iTVTstGWv2fUFMiQpdl1nq%2BhpGQzIKWU3M9sRp1R%2Fq1SMu4soPIydgw5YnSTCCxDgvClLbD%2Fofs9wRNZiQRE9copF4J5dwspGZON277diFdzf3NMvEPGv3pr226Nawv%2FXMpvU7mvT0P58XbAe33anTU9xfZ8w7%2BMYeFwi25H8awg3MIzKks4GOqUBdAgKX6Vedqi2M7toHsAn2FYlXtnRq5ROlrtiSYswJQvA1WmJDFy8DllyiGwMctN7%2B6ZYVDMnEiJGsdneZ2na66tWYqObtJPRHUDeDEh1jMR6pv%2B8IpcINnvQB%2BBEdkcI9V0TLPYcFH%2F1hCtLY8POJnmx4F4XZgw7z55%2Fz25%2Bjf3xe4tjpu0usMEcjtD5p3x%2BGC8fR%2F5%2Ftz41B96h8sezaMDHaokU&X-Amz-Signature=39f8efba1d63e89cea52c3768f450a4f214d69f315b8264591b9fe1b516164fd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667H6MJL76%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032907Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDlxGAVh2CNkZEGq4Gttw4oladCECQEO%2B8vC6%2Fth0kNowIhAMblE98xdwK4E9fo39mNG6s3tX3P4%2F96BBM6dAGuC9%2F%2BKogECLz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzSAYALA4VOXuOQNqUq3APgZnE4GnGZoTgKNUe%2B9MhUSwGjgIaaKOhhR0KttDCtPRne6uahpmGfIRtGcIAN90gvCd6zbZd%2FkKERWk5bFiez2o9RVPyX2Ahat7%2BlPQTq58P2Vn4OpnUkmLX%2BfhNAfOs67OzC%2BqfnUC3vRvy3OK9h9VtGKrSp%2FbwKuNkuO1ocvSuic0iRWPHpqlP8yYX1ZiclFPyhLkvGu%2FTyRneZ368VztEVdFMB2KZzFWRkfwkrFmssWs%2B39DtfKvvc9FoVbLq4NbhRDsn1ZZFBfD3VrQjva8OCmlLZ9t7Xav5mCOEm6u2JV5Se1UKCyS1vAXZiSU16hH6mBuKKDXZZ64bDnzFUstJeChnxkws%2FIVMViulQ6l72HiNXcINSj56dz64GbtyW0JlV84GgjEH1FvwxFNb3Aw9ynQ0hhwZ%2FMZYHFgBd1bER2HMoOMeU8jJTfZEHTR%2Fr%2BDvwNkAQJzKO6NSo%2BB55rgJmx7%2FfzdrHB%2BiKl7Db1Ujk97l9q1uaSvcjAr3xjPbPMHsc2tdw1kTFNQQAc%2FMhGWhWqgNFM05Sld6nYeXi53%2F1MEJTipA296d5L7l%2FVmeX0Vyfge9mSwZPnVcxpo0skO87QmESINRbSGjr%2BS960WZVWWCB%2B0BARC%2B%2B5jCzyJLOBjqkAavv%2BjdUTh5FySnWlNg94NYgmPXtdzqPQZIE1ev0OFbty0B5NKY9oiwXxctqeeePSAINtAYO5rjjRtwpsz2tQOu9CydoD0cDyob4kTm9%2FZJSXx65UJZiIALpHC%2BLlb5mOSXIZVjKY9mq1bIOpiGFdo5XwXd9Ykg4rUhKm1heagLVwE1rmr6os10zyHBeKQRKkHgFjDD7spoeZOm1YGQS3XUnAiIw&X-Amz-Signature=c1dfc02fdf54edd4010c53703868a0efc5b9ee41a4610581e0774955754dc7e0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667H6MJL76%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032907Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDlxGAVh2CNkZEGq4Gttw4oladCECQEO%2B8vC6%2Fth0kNowIhAMblE98xdwK4E9fo39mNG6s3tX3P4%2F96BBM6dAGuC9%2F%2BKogECLz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzSAYALA4VOXuOQNqUq3APgZnE4GnGZoTgKNUe%2B9MhUSwGjgIaaKOhhR0KttDCtPRne6uahpmGfIRtGcIAN90gvCd6zbZd%2FkKERWk5bFiez2o9RVPyX2Ahat7%2BlPQTq58P2Vn4OpnUkmLX%2BfhNAfOs67OzC%2BqfnUC3vRvy3OK9h9VtGKrSp%2FbwKuNkuO1ocvSuic0iRWPHpqlP8yYX1ZiclFPyhLkvGu%2FTyRneZ368VztEVdFMB2KZzFWRkfwkrFmssWs%2B39DtfKvvc9FoVbLq4NbhRDsn1ZZFBfD3VrQjva8OCmlLZ9t7Xav5mCOEm6u2JV5Se1UKCyS1vAXZiSU16hH6mBuKKDXZZ64bDnzFUstJeChnxkws%2FIVMViulQ6l72HiNXcINSj56dz64GbtyW0JlV84GgjEH1FvwxFNb3Aw9ynQ0hhwZ%2FMZYHFgBd1bER2HMoOMeU8jJTfZEHTR%2Fr%2BDvwNkAQJzKO6NSo%2BB55rgJmx7%2FfzdrHB%2BiKl7Db1Ujk97l9q1uaSvcjAr3xjPbPMHsc2tdw1kTFNQQAc%2FMhGWhWqgNFM05Sld6nYeXi53%2F1MEJTipA296d5L7l%2FVmeX0Vyfge9mSwZPnVcxpo0skO87QmESINRbSGjr%2BS960WZVWWCB%2B0BARC%2B%2B5jCzyJLOBjqkAavv%2BjdUTh5FySnWlNg94NYgmPXtdzqPQZIE1ev0OFbty0B5NKY9oiwXxctqeeePSAINtAYO5rjjRtwpsz2tQOu9CydoD0cDyob4kTm9%2FZJSXx65UJZiIALpHC%2BLlb5mOSXIZVjKY9mq1bIOpiGFdo5XwXd9Ykg4rUhKm1heagLVwE1rmr6os10zyHBeKQRKkHgFjDD7spoeZOm1YGQS3XUnAiIw&X-Amz-Signature=514d5976afe6c67b9de542678518f3d0e6f02a640d9d7f18887ae2098165e8ee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VJAKJ62Q%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032926Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIC%2B6mUPet6YizbL%2FtUrd8Kn%2B0t1lZpWjOrh9KginMSvEAiBRxLpGq%2BeF5HppA1cSFk8GjujGRh4VbnwG8%2F3%2FWZ9I8iqIBAi8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMXqOTpYbkkbzXk7GAKtwDp%2FCjDjHorT4wfyxoBAm7RoO%2FElc%2F5hOXz5v8In958cY9Vy28EPlfa8iXDvFLUeUzb1pqlC4Bxejg0CQx%2FexK5ICSpBL1NtiqCkGj%2FpVMmolmO9bXUs2%2FpKuFaytucR4642vq9SbV4pcs7XLUTBTIpg2fqjf66qJX5fKuZP6L814al2XdyLsy4Y1B9LoUd%2F4VFNXUTme1vBu5P2EYTKj1VZaJX0tZ6aBvNkRN1Upa7bR0WX%2BFZKE6LgCFBP9mGIjCi3Z4c7ibRh3imtRWIvjFbAtXvKo1gSeH2cwn08eoWyFZH4VnSfT%2FWyp9NHct2FEkeHGuozQL1pas83ngbj8YpyWyIjrWWosm5PfvbLUh05C4hDoxuBUXt3wNpkTuUGX4dbZya69dp10KYULm1estdZuRFz2%2B8nA28yi5aP4%2B0j5u2cGTvQcPSnLgoDBUR6p%2FsCPJEiH3y7BHBlF5aW1%2FXruXwBUwOh7aHbbFuvVMGitcV2h5JFNINsVxVFU512%2FmHbr%2FQcX8mxQs%2BkVHCBopdCNc8yAUV90fkoyQNYmMio7ofaR0SZeZ7qM2mSgh02qG7umyYoD5DwF1tdqnDi%2BixqGmkQoMht%2BzXb6XmKbCdR6oZQz0f0ZVqwCbwfUwgcmSzgY6pgEkp9In0Y15ExHiqXDXO2ldfdtBKR9F2gP%2FAbva27TzMIY2BDaBSM%2FwJ0Yo3cwCTVm4Nrh6ivL6qxdlF2GkxlDdhoIp39PQrAOwZhJ7j7Fu0HhqDDkyX0IgDiH7Vko9oZTVIr8lxGCJdC9ocOKstZ7PJxBMs%2BSqzBhT8VqV6d2bmX76Pcq7vb7Ru%2FFjvFP%2BenhEzQ%2F7s9wVmzwXUpFfZYltNms50DEC&X-Amz-Signature=3d78507d9eff917c37624f148989adddff1dc62affebfac883f09725f0c8762b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RO6FCCZ5%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHv%2FARgk8SOVwfFZWQ4Zh%2B6lYp2a8AdcC9uyxx17StcxAiBLGZA2AaOkSg5q9Cag9H%2B%2FRJVjfAU%2FsmbeBL5enX4etCqIBAi8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMXAtaBbtxzrFnaVZyKtwDqIs%2BOjPm1Y%2BY6CzW2BHyLiQwOFGaQuV33SDR%2FxKMInBu6dDNuQaeyZAfdnYi%2B6pdfnd6Z%2Ft3eYuWLupM2AbsoUGSau6KF6PDobImwFa8je2C%2FdFTlFV8E3nzAxS3SjuPf9vRvRTHDsy5rgBicbm%2FPKvJNzQzzrP33%2Bhqy28WCzIHaJuUmj7znJDwi4DlkDMdVQhLnqnwOOo%2BU8M9YDUQLMd%2FgzHdkDcQ733cNaORhm%2F1ev4676s8qJqHXvQsL75BwXePKsDr%2FlosyhZXUOfcNjmQQEWlV6MTyWR6cz1%2FX7Pmc4iggLIxbAvL4SwqC6yzcj%2F8lAxZCPCTy0ZD4yOaDW6W%2BfxFEOZXw2OOwEiZPXSExN3sRI9kWfDLuGQpgrWTOpEhklQmdb2duSv2VuCMslfLNLsmOI4TaVaWqsKHAmuzh9Q8ZDID%2BbxpponyDWnn8K%2BjgAvdjL2VfJZLgUPXfnkY5tQfSoH2tUqJukunaVZjyY0vrGLcK02sftt%2BEhcHw8FOzaVzgshhHk89TxXLjnry9GIpKA6onXqfwDMyqB4PtSJH0jX2db%2BpTaWfVUnqWfhgPSRA%2FMBZn21nfpePZrhULh4e4HenEHZjdqQVttkaanLBWvcqtXFFZnIwg8mSzgY6pgGHdKCSB9TS91LuMsXGtxtU97rbw8UDad3p9RZo1hF1pVCn8WtFVljoeOOplPU8WuGZYocdpuqTs92%2FayiRrpdKq1T4dY%2Bs0dzG1NRfNxzErwr9gf8FzoqR95CwfQxHPPNi2S%2FG%2FGQ8tPvdBKNHUKRx6r%2BB%2FNsjR8eS%2BwlWroyXgLH0%2Bnvj158QPtq9fcEw20W5sDTcVWZjxpxcUff2VN3MT1GG5Buq&X-Amz-Signature=7bfb6ce776f798be14b43e438ae71e57dc1121a3fc7706b1dea75fff35e0bc00&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S3H7N2KZ%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICH3orwZjlAdwoPtaocjQSpzTvJexTAt9VJYd2dbGQhPAiAYulvqNhWDjTCFNOFaOzoPE19qXouiW5BFBHXjkELRuiqIBAi8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMy%2Br05yAxS0smH1S%2BKtwDkf51Tlassino9Mcc8oAQB2N5tJ1U6cWDjuKWPvQtpj1FoGG7cyliMNC13mExiIplzHuZaG15bHk2O%2B146%2BaG2V6WxSBV%2FqQP%2F4WldXe%2F8w6ycW6GGaxjRkYzJRMih1%2FcXncODfm%2B%2BlIKipkE%2Bh642KGzm8m0VBYmTJkl0iXh%2Bmw%2FVneKfsxQWk40kpfkwSuGDICah3BcY%2Fy59dCcYGhapbABffgNUmvY03RzYgQSnIf64yQkIvFQxviBCFkJOL411Xy95NE9C8EdOBDoQ8rOTRKl0PxldojXZoDVKQbMA4PJwpGIcOPkZBCDzgM9dEupsbmgPZ64BSctqvOP635tt58Wb%2BdW%2BohqgQn4fvJau7nIDw0F1HSDyc7dS97cQSen%2FfiDfxQOXQjuSXeRHYd7HN7eiTeNGtjWtqTEtYVNwEFP1kRshz7P7fYsZD%2B1LpTdx68lAObAw9ru9je14lO1GTw0FedSsDihGb9u7fCQuN%2BzOEYCHOR5USXwoIH3anhFyO%2BJPD%2FV7pCjMfLeHileDv6KiH3k4p587TPZmrAvpDgta%2BDE8Ru84QEKaBlornfVOfd56irB%2Bdl2t5%2FR1vSmyCW3rCSBCcexe90TNY1QbmQ0QyufUjLhri256akwq8mSzgY6pgFRkHla7ABjdk5ctYW6TADIkA5G2RzEwbdreFaZYYQEqEokjESPaPhZgE2zEi7FHuskdA8TngYbryIW%2BTkzXvydfvRyvwrGJe44wAc9ofQJK%2FwD23A5L%2BtQtCqBRE9KAhI88D6rlMqKAogPr97q7QJLhLlWhhzG%2FqLAULq0tIegOP9e8vg3dKK55YAYd1JCJxooqRVJIk9WykZDGD8zbiakLhNxCSoH&X-Amz-Signature=d7992a0c22b650e0e11b316585fd18aa1e7b826354fa7e80f18f2c1e91e9f1c2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YVW7BA5V%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFEcTnXGZRgBSf%2FpeZsQvEGH%2Fe6QcToWrioq66NkkQoyAiEAig7JfUqPh6wWy17%2Fm98%2BZ8s1UhY%2Fb%2FvFxirl6DMe%2FcgqiAQIvP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLqQ7gnPJFCbSwySgyrcA2hIB9xi9pdyvMjQDR3VHEhvMFykQIUoyGC%2BbbtLaEifO5cIH4rYB1XjWg2j4THMOiAPATRmV3FKSwJZiHiptrmqn3tfzQZK6rlUZhhAf%2F2RJb239tuJ%2FNxe3xFHd0vzo5dKtUQB34zNcFut9MXx9RoocgEbHRzV9ITPrpmMBOXgBYit5069pCvrTbj3MXxQjWnwKuLpszhG0f9pkjEcquY%2BUq79b9%2Bpzoca6TwHSeWK0RieDlV0ngIWIyCRVdJwd0t1vlVhcFyQ%2FpU6ZDn6jFkUFKTwI7W4VMLcJd2mZPkLZrPwXr7mkJrZ6y91qDrUNqBqQK%2BeIpkrFPlsMzfCdDEaFPKaf600%2Fs7tnGyq90sDj95eoAzPD9KK1OK7XOqOZ26oGts78XYvMXslqd3seaaH8Lw4r4KLaf%2Bw5QD0uM4PQRj9zRcAtT%2FQcABB78nzyHL3lqBNOreOiYLCHcyp8LGBB5DckzqIH5MWZ5dzsnLxytENmqmFmcNmlT2WN4m2G6qLqPNRvQ4zzfG1WPRMyjLXbHjWiUs0dec9Rf9FyBAEeQJsSbY0yqZfYzhbDmAUcpxRyG%2BFeOmi%2FXBCbXSNm8hldT3LmZeIt599xOWfv9D2aemLv%2BHF5lb56HdyMILJks4GOqUBm%2FmClFp4a2cOjW4L72Inkpv0zRlBYBJ5DDveu8BT3StzN8FFjzXU0q5vHHjDpLR9Z6m5r6dzhcsd61J8pQ5bng95nJwnUE4pGpxIv07AprNSvnOw1WRgmKvvV8Y68E77T9PjG7veQayrL3Wtx6EbrV%2BxmW8Td4KN6Liu9z6gIOMOTOIHwvG%2FVQRLTE8B8AFZc9HNr8uw2H39tm%2FHq3vU%2FcM2osm7&X-Amz-Signature=029fe0f203461eaa88da69643d6849963b98ccc7c1f7e8f1220cd25bc372dda4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQ46GNMW%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC4cn%2BmYumQGKZcjXAnibP3YwW%2BLUqM0IcVirz7vCx%2FPwIhAL2ePaHHp%2BY0C5fPaOvcfE8PxxJc0F9Md%2FI7huAX9IgAKogECLz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzZEz5Uw3vw%2Fb9BwGUq3AMY%2FZkD0k93YfOzCVKnxBODvAdP053ktn3NgyJMSBxm1hKD98rdzXGpG%2B4Has%2F8TzVmBkjrLoOUeJplmXU0Jz5z8mDhgIYhkcCb8wSbwSU5ZKwszI0zU4DtWMWujiLbOMQY%2By%2Fy1CLDaRFqsKqifBeCclMlOXAdSl3UG72Psjs1RAsgVldGT3%2BNYXcHutssb7Y7IVMtsMMyb%2FeRWs5BEkBldLaqi2frniQ1iVgulXU%2BFIeqaacOxQ4xQJAM7xB0bTjSsrDbqRZhKN%2FEh5Go8asIfIX%2BJvOc%2BtmLdetq6GkOJ%2FnohmIzoh%2FdTcJyClfUB5GFpgI06uoUzym2to6Wd0au61h9Sfsn4AClO7OUZKAW%2F8PxmK0oBKslk69eqqBFEKn%2B7JaP0mvVaVOSWoMSKhXZgg2XmpfDHGC%2FvmV0PrI8ThkfcxOmQICWFGSHoJsQZk6BMjna8BcBkr1I1c5HuFtf0Q%2BrO3h93ShO5e4N64BJiLyWmtOEsJyy%2FjhjIMCqI1d3fS%2B%2BKYDh%2B6duP4Sf%2BzduhsKLSJvpg1trjNk1Q6CFpRd0RTo4dJFx0l%2FMvXO19DD7ExjKOJcOEgt3eDAsEqva6hTTKauuVV5UIBRfrZG0lQFrv2GlCKjTogYsRjC6yJLOBjqkASHKkKTBWY10NYYb4%2Bfv5wjh6lLMjrZsA7F8VBMTRxl5MMypuKFNmypZ4cWn%2BlKpE%2FP3Nrn%2Bhu3SAHfC873h2L7vHcd0q%2FYBDj9nXG8AFx23eEsusM1M2174tWM60ZxScqHIyf9F4xMVNC8o5eZzxtzLuoD53hMYDhzumYT0bRjE8bO8maAetaGKo0tuzda8GCLGbtN33WjgNB3WP%2FHAfMIMpvbT&X-Amz-Signature=159d817e280d641168c31291956a2d75e6191f2312e4f1320b168c73689317cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667H6MJL76%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032907Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDlxGAVh2CNkZEGq4Gttw4oladCECQEO%2B8vC6%2Fth0kNowIhAMblE98xdwK4E9fo39mNG6s3tX3P4%2F96BBM6dAGuC9%2F%2BKogECLz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzSAYALA4VOXuOQNqUq3APgZnE4GnGZoTgKNUe%2B9MhUSwGjgIaaKOhhR0KttDCtPRne6uahpmGfIRtGcIAN90gvCd6zbZd%2FkKERWk5bFiez2o9RVPyX2Ahat7%2BlPQTq58P2Vn4OpnUkmLX%2BfhNAfOs67OzC%2BqfnUC3vRvy3OK9h9VtGKrSp%2FbwKuNkuO1ocvSuic0iRWPHpqlP8yYX1ZiclFPyhLkvGu%2FTyRneZ368VztEVdFMB2KZzFWRkfwkrFmssWs%2B39DtfKvvc9FoVbLq4NbhRDsn1ZZFBfD3VrQjva8OCmlLZ9t7Xav5mCOEm6u2JV5Se1UKCyS1vAXZiSU16hH6mBuKKDXZZ64bDnzFUstJeChnxkws%2FIVMViulQ6l72HiNXcINSj56dz64GbtyW0JlV84GgjEH1FvwxFNb3Aw9ynQ0hhwZ%2FMZYHFgBd1bER2HMoOMeU8jJTfZEHTR%2Fr%2BDvwNkAQJzKO6NSo%2BB55rgJmx7%2FfzdrHB%2BiKl7Db1Ujk97l9q1uaSvcjAr3xjPbPMHsc2tdw1kTFNQQAc%2FMhGWhWqgNFM05Sld6nYeXi53%2F1MEJTipA296d5L7l%2FVmeX0Vyfge9mSwZPnVcxpo0skO87QmESINRbSGjr%2BS960WZVWWCB%2B0BARC%2B%2B5jCzyJLOBjqkAavv%2BjdUTh5FySnWlNg94NYgmPXtdzqPQZIE1ev0OFbty0B5NKY9oiwXxctqeeePSAINtAYO5rjjRtwpsz2tQOu9CydoD0cDyob4kTm9%2FZJSXx65UJZiIALpHC%2BLlb5mOSXIZVjKY9mq1bIOpiGFdo5XwXd9Ykg4rUhKm1heagLVwE1rmr6os10zyHBeKQRKkHgFjDD7spoeZOm1YGQS3XUnAiIw&X-Amz-Signature=c9f5426787f5905a0f6407ba2c0e5f229aa618e7abe336f552f391567defb78a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
