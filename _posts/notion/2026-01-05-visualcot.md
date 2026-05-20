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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VRNUDGU4%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043723Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJIMEYCIQCJO4MJ77V%2B3ko0Mdod%2FDm%2BcAjPia0ZLPrH4ACP9MaDgwIhAMOw7RrCYhFlySUUMyR2X%2BWYI6HkOIHVYRFZvj9aa50QKogECOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwaGqFfpKaW2gWdtzkq3AMtxPqz3o%2B3w53KF72ODoK8uqRUngQDbNWMJh6s9%2FVaXOqgX9GG3n%2Bsi4xIEXXvp5%2B3DiIfy1kU5KSbe%2BXJksG0omm0ivaNYdKWh7l4Y%2BJ5mqTTfOukUDec5NwsIxmII5CVCyYl1rmvhcLEB5ODoF8FN9EJ%2B9SC1YlJ5R0L8yB3CYOqX252gbDI%2F3HuUaUcFQyINGAHORRUBkXrwbgYHHj9UKby6gKe4%2Buxs1NVBTYezu07xLMoQaqgjNLRgrKlfQddDGuq11Zvm7Z6bNN4HwODsdu4b7%2BlsVvcOOD74SCG4vdjwy9cWCufO%2BTxpnwb9NXmBTtSgPUHAxq1Ttlp7GkccLkGVDaOUNox5Tifiml8FUePNB8wLnBhDwXCacBFBRuV2n6TR3FJmEcsx%2BYEEmhtVHTt0MPib9KlYe1CQD7%2FlBU7A%2F8FYRN%2B%2BKg8HJq2FyaEIHqBex4pPqoKEHgzWf%2BycTFIhYyhn%2BFHCEUg5rOEJNK1KA%2B8HmTakvXzQ4cjkCN0e%2F9vWFEjcm%2Bc1bTO%2Ftj8IcsOUYoff6nCIXJ%2F1dPmW7v0wxJBzZJNd3tDC18sQxG1%2FtQWrUaaxzEivh0K%2FGB%2FQLjrqmFE1K2mLnqX%2FoE9%2BEsSCO8HV0kHcrxtHzDL27TQBjqkAcffMic6QPdXrn9IgfAeoYszAMip10LzIQ%2Bcf5OthIUwzLbf%2BoW5mwSQ9Gextk2ci0EwKlgIkUyqf7DZ9COC9KZZZXgT0vjN2We%2BbKRdE1swTnJnyAtLLFQsbJH30ZSg3CKafljVIY4pZJWBzKQIXUP3ViQy5RVfWCJwx778onQaDqM8ChhUhXb5EO4wxPZ8f3wFNRkXwNY1DlQU0Knt4PZNJm3x&X-Amz-Signature=530c88615dd534165374e71168fc7269e639fccc9e42829593df8da611375792&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VDUIEFC3%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJIMEYCIQCrnB25D04hz4on6LyHhSOXQ1R%2BnaBop14Vot7ZMPZgxAIhAJrvl0hTlrNwm2dAL1rUfAAfTRgA9nDrmyi8ycfQDn8dKogECOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzAz8Oi69yIMB%2Fzivwq3AOBMsrjOTXfaN5xoKwVr3HuDRfziiKDMwoSVVAWqO%2FgXxOySxV%2BX2oov5Gwyj6tzvxe4gCRkq%2BJLuMgxs8R%2Fs3xna59Tu3ZGaP%2BJA7jgrmfeqKjNnzCeu3PJWo2ZH2cN4fwjDWeVO7a5KNK6xBHxVVZ9Ux1S3VxN2iY7dGnsiwkw8QQxs5PWpG%2FwbXupucp9zIq36j35ppEsthYPczrciBypf3vvDTcy%2Bret4bcMT1frt5rMiO2BQmd322wTft80SEczvGpZTNracUTkAdmiKuJMyXzHCTPmLKw5NEXYXktj9cMp02hb0osM%2Foz1LlG9jfo1amBCx0mi0HPGyfdLwJ80e6Iq%2FQAeGNTTlDr7c5Ob3zT4J%2BEbl7LvLF6DLvkfI2NLFq%2FStemzvW3oxoAxxHnBDfymlGWKpBxBlYwzVnddnbR47pIdj8O4DetH8IiABMk5e%2BMz42mERmnyj5r3Pz6oI%2B3CBdpUFi3FYQKI0MvtzZQIjIfX6n4699okBnXuujG70%2F5mNBi82evuTa4dqQtq75xFbhavAlQNbxbFcx0mKOh6h%2BJg5YZwK3Zek%2FE1yrZDKFoOZhGIhmrzPd3AH5Ij%2FssGfLerbBCpzp8vBtzWJoQwKwFWzfQkuQRWzCO2rTQBjqkAXuks8tj05vmQCXupuzv7vMrIUEcqb%2FlqjfS%2BIPQ86qNzQs5m1uZajUBlWB2eCa1SZ7AS47jzZnmCDOdrOchEOce04MHoQeN7a09VIUac4KW7yVPo%2FoM4mWJhhwDJ9DkSmxBF8mALh0gKOin8GFAByRi%2BgqQH2CNKL30VsUAHU59nrzv%2B1oozW5jtovdKr2s870wyaT2IwYA9OG%2FaJvIwsMJ%2BAq5&X-Amz-Signature=855a34ac0dc3c9bc1f7a33c1105c7a81c11c25bc7ab4335acddc8b561bec98a6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YVLNT3YV%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043718Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIQC%2FwIcchTdo3tPzn0ypMz93JHbYUoKPdUpWH%2FnfGLnZtAIgNEBBEsRrE1TXLlY7l1e0lukvFKihUpVsIw5ceaqopIAqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEjU%2B2aDUx6EaiBn%2FircA5gF8fb%2F5jyvpLjYBEMDFzdpeRaw5kQ8VNYxfyT0MbCgmc8c3OM9v1Qc9AflQUg1ccxhaxY56jDAuW9g%2BUuO84EQ%2FXbTaq587W%2BtL%2FlA9GkFwBBMz6L3wo6rporoD7eULJUC46QczmDJ%2BFS2RxuLO1bh2TFDJasF2Ta6aTL0E64xyQ3Fgyq1OkhdK1VJkHQ13ix%2Bkdk7RSrPLTcdWpH%2Fh8FmGcwb%2FXtu4OysaRWLGZgrCk5OMKjH61PdDTG%2BuuHAFtnzHtJ0mIyqLSLP0xmXYkqVVBBob%2Bv5MoC%2FnhxMAJIbskR6HObwxQSgXAspIhMbZY0DZEzeTEhjjUm9SfWFBvVcYgXqphBwoqHINOMwUbVJE71MwMJgrmS8BaplL%2Bf4YVUhOpMMXO0fuX6rEmKB62kpRdrBP%2F8I9G2cCfeM3RLrAhDhMD73Z1ttNm9P0qiWBGpu3Bx1KBo2f%2BjLFbZ26upOEJ3mhbq5rND9DKT1vNa%2F1K1o59Xy0t0sgkNRBv1dI3%2FLtpQcw%2BQpGRRk6ld6VOi47mVfN4laG%2FICb26qFq914md5RSDfMqQa3co6DmZprHqyU0k5EdJdli2SjJH4gOft2JmVGciq%2Be7UGXvFZDILantAUHWKuku42w5dMKzatNAGOqUBWfVXhZU1DwtIq5hnzcPEGRdLrCz2m9WXFSUt4qNPl2He8POxcfXAFULG5zBEzgg2LVd17Mbb%2F%2BBGZ%2BpsUw8fVoGd3Vbz%2FFKTmRh2149ax9Lf4NV7NLIy2wWErm5eLii53MSFRe7R7iW4oWJm3Bg1IzhLizEGaxZ84nSx%2FtX1qag0vz9GwSJ7fqIuTp%2B47vjnXdsmvix2fl9P%2FSywC2jqIQiS1o0i&X-Amz-Signature=06640368bf975641a44f848b0d737858ec50a1e87825c334dc78e3822ebe386b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YVLNT3YV%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043718Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIQC%2FwIcchTdo3tPzn0ypMz93JHbYUoKPdUpWH%2FnfGLnZtAIgNEBBEsRrE1TXLlY7l1e0lukvFKihUpVsIw5ceaqopIAqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEjU%2B2aDUx6EaiBn%2FircA5gF8fb%2F5jyvpLjYBEMDFzdpeRaw5kQ8VNYxfyT0MbCgmc8c3OM9v1Qc9AflQUg1ccxhaxY56jDAuW9g%2BUuO84EQ%2FXbTaq587W%2BtL%2FlA9GkFwBBMz6L3wo6rporoD7eULJUC46QczmDJ%2BFS2RxuLO1bh2TFDJasF2Ta6aTL0E64xyQ3Fgyq1OkhdK1VJkHQ13ix%2Bkdk7RSrPLTcdWpH%2Fh8FmGcwb%2FXtu4OysaRWLGZgrCk5OMKjH61PdDTG%2BuuHAFtnzHtJ0mIyqLSLP0xmXYkqVVBBob%2Bv5MoC%2FnhxMAJIbskR6HObwxQSgXAspIhMbZY0DZEzeTEhjjUm9SfWFBvVcYgXqphBwoqHINOMwUbVJE71MwMJgrmS8BaplL%2Bf4YVUhOpMMXO0fuX6rEmKB62kpRdrBP%2F8I9G2cCfeM3RLrAhDhMD73Z1ttNm9P0qiWBGpu3Bx1KBo2f%2BjLFbZ26upOEJ3mhbq5rND9DKT1vNa%2F1K1o59Xy0t0sgkNRBv1dI3%2FLtpQcw%2BQpGRRk6ld6VOi47mVfN4laG%2FICb26qFq914md5RSDfMqQa3co6DmZprHqyU0k5EdJdli2SjJH4gOft2JmVGciq%2Be7UGXvFZDILantAUHWKuku42w5dMKzatNAGOqUBWfVXhZU1DwtIq5hnzcPEGRdLrCz2m9WXFSUt4qNPl2He8POxcfXAFULG5zBEzgg2LVd17Mbb%2F%2BBGZ%2BpsUw8fVoGd3Vbz%2FFKTmRh2149ax9Lf4NV7NLIy2wWErm5eLii53MSFRe7R7iW4oWJm3Bg1IzhLizEGaxZ84nSx%2FtX1qag0vz9GwSJ7fqIuTp%2B47vjnXdsmvix2fl9P%2FSywC2jqIQiS1o0i&X-Amz-Signature=7e323ef11412083f7234b99a271be051de1e160ee09d98099f059111aad459c5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664SNY6Y64%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043726Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJIMEYCIQCA3Q8H1AKfKpa%2FgKFaMeqsl4ptXKMpJ%2B15a6OuYfV3vAIhAKW1q7LwQXroFMljd9%2BEGe8ATDT6eb%2BgGEMuSPQuPEWzKogECOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyFmo3MB39i2dKBtyAq3AMyiHQqT81HEeJ2zrwCqv2IOlhahA9tEVrzh3MBHIWpcJtjNkqc2Mz2Kt0dd33Dg3TcdmeW6cgXuzudKkxiYn39XrYgp%2BaTdzUtiShVsSr3b1q4wMbhr%2BhOEbTuAcQLennR6uNxdz94qDQ0MahDKHFHxqwYcV5nYTr%2B4Nn4B2CmJ10b9ROMUMqqEN6sL7B%2F5mPH1iIZSDrH%2F5vUsIUawBmcgPDlf8S8%2FK1jeOXPA38l8cl95o9JJ45qWSU9vknhvIo%2FAxcf%2FlLqbvPNNLMOKkj6K8YNl%2FIRacjjwSSAx4b1hTYb8meNMe2no%2FaNM6IDTm8tFGl5I4WdIoq7L%2BtJHIobN3UrfffeauMuFvA6AgrzLaaJV9NRlao5qyEGNYhHN20GQIdT3RnSB9rSekV7q0crLmbytYj7ue28rXS8uLu4kA3fdwu6M1j%2F1W2wq2ZDmeh06H5aGNTrIxlqhYQOuVup8MJsWg41clhrlDdVvOXBMFAXbAOfJQJiiquNsTWv5Yrv%2FrYif7XMZRL0kRLTn%2FgGQamBvJOXj78R87%2B%2BtHtw8GvVPBIWoZG%2BSNnYwMOyuZtEFlByu5sZSRhYYVv7AVUe47V3YPL9jEyOTvkiZLBLYqA9TSBlC%2BJMGEWoHzC82rTQBjqkAb504KpkvS7aJU2eapEID9Ex68U2t4KS6jylvMTQXJ%2F2LxXw3GMecC9coLrG8MFkZubdPm01qr3LeeirDElCFI%2FKP0CjXFUMqne63EUle%2BWcB0z7WDV0IgjyYQkTSSOSYaKqTUEZZr7TiWGrRXR73EHqd2IF94AdOtGfGGOwXksfU49RCRiJ70QbcO1JTeBPeLWrb4RIYP5UwlYpBRQrpFiylC4J&X-Amz-Signature=be55a76102309e409e1ba22bb44db262dd1df352b69caf3d0c33c9066a30e0e7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VWCP2YO4%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043728Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCICzcgw1OevCbcI3cLwMJ1XSIZ6NitTJX8Fy4T7T2ygWlAiBdY%2FoN%2BCqMpskP4Aaf7vKJexAV7wmuoFV2pkLY30ZTJiqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMhhyFJvDxsWO1WUgVKtwDZ3sRy5pqkNCh9U9c97ru3xxrcZL3zQlpCjTHIPV5GYL%2FOnwD8uNN1i3N8tgAHhBkIQZ%2FyAdh13iGfxQoRW4u%2FzGBGcrX9GTkF3GDsTAOdynKeSJlI0kXdppoTpvr4MGzmUXuIzMZXJic%2BQAWh1g4J65dEIKBSeui%2Bcy3e9RV3xzkTy9ScbCWVfTMRvqjelXvGgzwTGlfpqxsyNvij5OEKztfpcpdrI2NQh9K5ZmAAdqwNQnN0sbx8FNn%2BxW1ASs8T%2FwYArqViN74h1NYr0Fiap%2BMg0GYxJ2dxTfOKufrW9HHzh9uIfFVcKsiegTqR6BPPRRam20iTeSdoP3G9zGPe%2B%2FKtVRK%2F4JU9n1GLeb7kdpaoU4LyoZOMgsIdoeZd0gPGECNkJ1ja%2FNF3freVPR3rIvZU6WqW11OvT8ASAfnvfYryU6XqeHSWM0aX5LCgKB8DD5PRAeo4PJ7aBERfx8BKrPgBe52fwHsX1y8R0lDU%2FXlCs2V%2BaXv03hQMn6hWWkh2rrlQwK7%2B2ZDzc4YhTuy13SWVjjYcHAfrnRFSZB2BxJJBrGtvsuQEAVd7RLsaQe1ONP54GKzBmS8%2FV5N7UUFiMT5jjf88teoml3Mh%2FFZ1Jm2KLFvYe0al2r%2FfDQwq9y00AY6pgHki68bbb2t6NQX3Jv4s8W%2F%2FLIo0DwxZ%2FSRSP1%2BGfxtrfREwcj%2F%2BrTk%2F%2BlkV2ObXxSFwRMWAmRp38FkQ7ZuqC27ZSyHNEQjDajoZiuKZM9jZcLaAP4fW09wjm6RgIB40fFqpW0aaWzsznAbeDQ2F8jtjXAKOvSkSfWasg3CX93zyYiP67dTtA8ZkioUWN9VAdr9yIfR6Agk7xikwIM4U%2Fcqg8rx8cbT&X-Amz-Signature=ef962c452b5561546a89b92d294bd8e5a4887e843238be36a7796ca02fe0666a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46623RQ5TYO%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJIMEYCIQDTt0Cq3JeHDQOFMW5Is89KuOqy%2BdmLx689EL7XeS5eKgIhAOV3khUlX%2F1Q7rLczzQxR8gpfe4aBAAVtWCVrAETANI8KogECOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxnnvLrKfhMrUGOj7Yq3AO%2B0M3e5Wklw1lJcm%2BItl1l7Xt4pTCliPbTEs63r9OaRAIMm%2Fa5zH61e7BLTwyloSYIHsDEz%2FtoKDjXzPzY38Hv6a2GrS9REDc%2FhKvbsO8Wu7vCqGOtGS0ps1%2Fb4kJr1V0seCQDbirq6D15OTQaluEPRrJ5nqjuzu6TTvYEDp%2FR1ltgswCg6vWof455VS%2BLK0zeML2xOWeb%2B3mDYjqT9UQhZWhxpk%2FIgTaRsFqTC1QvfDTjkTzsC%2F8Qj2X5NZMOtb8ry9my8pb1M%2BIu8fdav5j3XGTSAUCRXfbv8zLVh9%2BmQ%2FIhEt%2BhN0QJrqbOocsP6gmON%2FtcW2DlBctGBTDZLVv%2BtPuUS%2Fv9If0gK8pcbX6mr65Jc7q1VR0YAqYo4kGf7XnVTg7IRW7UsW8jH08I0KuN5fGg5J8F96eBnvNgd7ZmB4EZf9%2F1K9NPr1KUdoXRxRo4bTrgUyph592pwnd0oh%2FJTTUa3JvOTjftJwA4XCFZLegEWJlVrCU0siYuXId71o%2FVz4k1Mi8C9e85a62z4LtssO90YWdhXBZfcsXdcLmk3YVYRpFg8BhsOQcB81RF047qv0WsBMEKDHQFd9%2BTOHWiv9gfOLuM0LByQKGwTelZzH8og%2BgZYk%2FA0b%2BYaDD%2B2bTQBjqkAWcJ5qzti0UApUur5hdIV%2F9N3Lp1ZJ3ZgqVNfTlTvqoz3ZSfd054Z%2B%2FEUFzfZK8VoUilq249%2FAf%2B8k32wQB9N6f26ZY5%2BHWI%2BA2bkwjHJwFGr0N8mrDkogK1eCpzzP%2B09Gjl8l4VkGm7c61s67m%2BXMXSAbC97idqer4hiuYctS2npJIhKCarhUfE0LzPm2wUcraFI75DoE6IR2ItIbNLrKdmH6vo&X-Amz-Signature=35f3d87f1532630dde3f858cc8932c01ff2a6d9bf1811b46cbb6e2af8bda0ba2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S4JG7HMR%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIQC%2F%2BfkaoQ9sXXMTLAc1%2BGFRKpepIorLQECnyIBeVE%2BpsQIgWXgF%2Bem1dcPA2PyjfD%2B%2F4qeRQvdWPDeoNIOLGXmY%2FHAqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBv0rB4M3F%2FtXfbLPyrcAyBZkhJxICB8qCqSgrcJVVs6hAmDaRiL%2FPslAfJ%2B%2BTn7wD7NWdu%2BZve8RWYlSMzdeFh4d%2BPfqAUDHnc2K5uxUkKfUsa4N%2FF0wjWRN7EV1tsyCu%2BE2b5UJR%2BJRfhE%2FKADHJ8Ma96XpXVHZAbQhHfSVXAwPHD0cZyWY6bjklqPVHHyyApc%2FawFH1k%2FYi4VEuA2KDOkdH3xcheEuJhs2U4FpNAWyA2DrR1Q3yEin6xZIKsr1Y0IpW%2BpjiKo46I7Pppm7Drpa8PiscxP0z1WrlegH9%2Be6hItZPiuHlwH5w7CNTiGRPr2rrb1XAYm3%2ByT2%2FdIvr%2BxeIyd9Z88C1p71BvvFgKXifSEZAvuKyVhe%2BDD0aGU6GPM0JsP%2Fj%2F73agq6CJ1Bqrfkkjnjj38XvTecHzk%2F0MXQMcFvwG1rC8HA3tvH9WfUBwAuw0PHj0cmUaDOh%2FBHWqmsEdQxHPEBco4al7rBnRiDqeCqYGTm%2FSIESf8SB%2FUb24QR4TzPczbWVMvDJ%2FO%2BckUeTRx4uLfH7vvQK7NplxvCDg9M4NOJ%2BwxXoJtWye1MuXDLlH2IMInoRV0jV%2FZG6MLR1fvPO8Ik6jfC0OlorocrNm%2FxHSiZ9csRkNObQOsf0QUXwcMkxqEAsprMMvctNAGOqUBcui%2FODX90IfoZZUFhTeNeHXej%2BPfFJ94YYH1AQwW4lP3EfGfufo%2B4n0M%2B3FPpgrF5bltLdfl3LPyIcSsswuOIOFLf8nAm8S2cXrIXDuPUMF0mI40pZLtp09BaV9OzRjK6ctOuW7fRaVBib4dghx6130h7E4AC%2Fv1Tg2sTDK9NkQ0475vVkQrH1MsU8KjjzNbtM2YgDE%2FOWNThm0KCVH4J51U%2F0Th&X-Amz-Signature=7afa18e7f6f3d35c227ab5e0a634e6c911da9ea308bd3de85247a9d882c027ff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XENPSYAH%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIQDkZsngQsr%2F8dKf0AlZ4eiTQ%2BT%2B9cFoBDHgOXcnps62mwIgV6DxBnb%2BYz4fZn%2BYMxAkH%2BhrvGQNjfAwX7DSFAyFGvoqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDDIRLXKh7xb6GIiXyrcA3JqiIpIwKHp5WjCgaFFGKrHK18A6Y1yisuM6RguPkp8OfrupP1wKmZrqecc%2BdA6JUIAOaxud3j5f%2Ft2j49PYhpPC%2BDZaavA7nYCdA%2FriSADPUqIfNgtuThTj6Vh9I%2Fg2P5PvP%2BbhZl1mmstcm2SnHrrP5vR0%2FwNHZrqaoWV%2F9V8hI60iYqFKplhy1CKN3Xkj2CZosIqBl9PXxfZmDGSWJpzVI%2BAxRqgYMPwht%2BH8Hf%2Bg%2Bw69D7HCZmx5awvpvMWYLFnsv9bPAillmLg%2Bs5Vn%2BgHXj4JKsq8xaYFdOjUDiTgtfpuxchpqzE8ulfBlWspy6KtQkyLlVpC9pOJDCN38XGeEafl4Tk5lDWNNM7N%2F5pGP8bHe7LvOcgMops1MMi2WL1oBEF3%2FzYg5u2nE26YoWN19ao4e9tVPeauNIlFpldGv5Jjf8VW195dL9Ql7%2B7EtkQ8%2FCmtRwuvUy65NDJktHgD0zbhX0QvWOeBViImoisQ5cdKdLm%2FKuKGybBJkv%2B%2FgS6ihV7RH3Mi5bT1TCsq00H5yZu1weuIOzoRNC1WVbtME%2FCGmzHb19uelv0dsurV3nZuZdB5tCnInm3wmAQfMjsQ8jfIiUt4wwbxunpWuVM27MdifRavKxZCJcaFMPDatNAGOqUBWtSxDEGWuOFvHaA9zB6oFa6AH3k7ny4LDbxRjYY6LBuvcrdR%2F6%2BfXtDyUeMJlwqNQG6T9dvXwll%2F76XfUi4oGChibbBjoMNPKFxESvBsHfShtIkeAzlCSUN4zVUGVAqbfpjMQPZsMlkna8n8xM%2BXS500hkfHQIUkJzjKF8jjALDkunntwNyTYHfoc5j1m97CWVQbBtPUPN7ylYiP%2Ff04kJt852Gw&X-Amz-Signature=b962252e7cb43e7d6fa575cec9e045680fcdfe79782602ca33f0be5d7703e50f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YVLNT3YV%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043718Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIQC%2FwIcchTdo3tPzn0ypMz93JHbYUoKPdUpWH%2FnfGLnZtAIgNEBBEsRrE1TXLlY7l1e0lukvFKihUpVsIw5ceaqopIAqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEjU%2B2aDUx6EaiBn%2FircA5gF8fb%2F5jyvpLjYBEMDFzdpeRaw5kQ8VNYxfyT0MbCgmc8c3OM9v1Qc9AflQUg1ccxhaxY56jDAuW9g%2BUuO84EQ%2FXbTaq587W%2BtL%2FlA9GkFwBBMz6L3wo6rporoD7eULJUC46QczmDJ%2BFS2RxuLO1bh2TFDJasF2Ta6aTL0E64xyQ3Fgyq1OkhdK1VJkHQ13ix%2Bkdk7RSrPLTcdWpH%2Fh8FmGcwb%2FXtu4OysaRWLGZgrCk5OMKjH61PdDTG%2BuuHAFtnzHtJ0mIyqLSLP0xmXYkqVVBBob%2Bv5MoC%2FnhxMAJIbskR6HObwxQSgXAspIhMbZY0DZEzeTEhjjUm9SfWFBvVcYgXqphBwoqHINOMwUbVJE71MwMJgrmS8BaplL%2Bf4YVUhOpMMXO0fuX6rEmKB62kpRdrBP%2F8I9G2cCfeM3RLrAhDhMD73Z1ttNm9P0qiWBGpu3Bx1KBo2f%2BjLFbZ26upOEJ3mhbq5rND9DKT1vNa%2F1K1o59Xy0t0sgkNRBv1dI3%2FLtpQcw%2BQpGRRk6ld6VOi47mVfN4laG%2FICb26qFq914md5RSDfMqQa3co6DmZprHqyU0k5EdJdli2SjJH4gOft2JmVGciq%2Be7UGXvFZDILantAUHWKuku42w5dMKzatNAGOqUBWfVXhZU1DwtIq5hnzcPEGRdLrCz2m9WXFSUt4qNPl2He8POxcfXAFULG5zBEzgg2LVd17Mbb%2F%2BBGZ%2BpsUw8fVoGd3Vbz%2FFKTmRh2149ax9Lf4NV7NLIy2wWErm5eLii53MSFRe7R7iW4oWJm3Bg1IzhLizEGaxZ84nSx%2FtX1qag0vz9GwSJ7fqIuTp%2B47vjnXdsmvix2fl9P%2FSywC2jqIQiS1o0i&X-Amz-Signature=7ff98c8721ba2f68bca91989867acd62e26d60d4cd85872fca05cd8f591df04e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
