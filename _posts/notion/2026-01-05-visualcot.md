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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XXEL2SFO%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032630Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDnSWoeE7nUKEgAo0oUa4rzdF9rD7OLa9jCS%2FVS09cxSQIhAPXVMaW5DbYQiqaEBAqWOiI1xEA1a%2BW%2BVEjdKrgh2p3dKv8DCHUQABoMNjM3NDIzMTgzODA1IgxKeiA16EW6TXTr6oUq3AN0TXWBMpVKQggdZsMjK0NQ4KxnwpLWAdOpQcuavFAOxq1hW2fv0xW5diNfCvNqNUK1mAaAx5xMmulvtbOnph7ptIoBC0Rsjh9MlenErRs7ljhQTHxMhQezYAttU6acFytNWMeUhCDzTlIp2nJXS7Rz%2FapDpc5cCZLlh1Qfox%2B9U7%2F9k5ClUbiKuynssPIxLW9l%2BOJ9aVXQt9WMpYVuKK9tLYzjBZ%2BU5VfrREBrXDXhkZKSXdxQSIRXA8Z8rfmC39HIvhRF%2BBSNmYA2PSzFrABY8HcwoHpwLh%2BsHHKMKkVn%2F3VsumXNKDC6FWypAnt7yyA6ns5tJ5%2BFEAmvaXq4%2FMtBbI4WPvubUwpZPw5Qu6do8Im7DuNFBvNgSHT%2F21JSAoxF4JZnAo1a0oSGDwV6HDMPFsnv42MbLlPRzHpaG058hZtrOpffSOrglRNW07ZaD5GWhOYPX9Bur%2By%2FE3oe5LvOFsAkJg7dtcLYSwMY1E6ekdheDmet38jRjVWEIwVD%2B%2Bpt%2Fso7TPURq6BV5MoxvBSRirP55BIeQM31boW%2Fhhex7cvepufYhCuM5NpMiCgFtLeUiu%2F9iKMX%2FbnHINBfxtX4wQUlrMfNg1j7AvyOMAMND9joANZFgq4UqVoGeDDC5ILOBjqkAVZdh1rTNRo3uVrViDGpQii9nOeG09oO7Bi2X9pgrF1TvdTO04G0n8xedfKtazdvv8ALOT6xm9X6fbMo4ntwaXZ53FASJPaxGr%2B4mwARjZ%2B7I4GysaajleBqTmbmLesVZQuM%2BW8M%2FQeP08Y2kqhtiRK9RuSw5B%2BldSphcDJqrX%2FlIGvtH53vezLQiQ58SwaG9CX7rmSWID3XxiscuR2%2Fohr80ON9&X-Amz-Signature=3d87d1931aded433263d06c67ef1ad2fad3712e7b5ce8d67235b02a61b5bdda8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RK3MGWQG%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032630Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIASaf3DedT0zY%2FT6IlRtDRjglYhcInWnrkogpNP8x0WRAiEAkGlD8DH%2Bfjt7EOXngZLTdbkEkS8xVuU0%2Bs7Ar8SUJKsq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDFO6cCq3TcvWsRiYxyrcAytZLYlIrTJFsu%2F1Il%2Fmm1%2FyjKdIDXZkATfJH5FDblUmMFmLcBBmIOqi9hFCNKNfggYqCImUPHl6AFMlwkfsWJxnPUxFK3HdFNPZfS%2BhhCmhIaVxODxLPIijZTd9idx6hFcEMdc4CoKDf2III8Dje9I%2B8LfV71PFdPq2Xe5Tqid%2FhzKHYk5SDx4c8m73IvU2SVliZQqMM0ZkauDQMc%2FP4JRcVrIIE9m3j8A0S7QQr8d5kbMzy0Eyy%2BKtdg808lYUSgBF2O9YDYbe3Vy5%2FOy8ymGUkdiJlUg%2B3drrkZ%2BDfQS7Z3vHTve6kL6MxPkMvNXN0EfHtUFCUCyKM2kJY6GUJnE7W2tm5UNBrG%2BiZOxBGMAgt4F5PMNx6REYuop%2BiP%2Be%2BAuJONVL5YWwxeSQjaa8hpbSwbD2b9gcDJDlqNp0Bvn%2BKRlm%2BfEoro%2Bpx0fxBnF8qMlufTIpSJasZKDAKiIYecLIId6dSqo29fsiLyjj7rEUrqeV92FC57CnBIHWxl12epdr2dmpXJ9tAgUC1APSOsgMITD1iQC6xDsY%2BKhgZ96EnD351iIw9ImvUiPNOoUiek78pPvvSi9rXJlh%2FStazbbwTO0nmJ1wkK%2B16cECQFV2b8Ol7XRGR9yML2czMP2%2Bgs4GOqUBnEF%2BXxX2Xpqk451IkiPB%2FB1eqdaYRYCtO8YiHoHoU4keI3g12RoUHhFzNgAFU%2BDQUVuoX3nxvzun93n9kemDVDW0l5ow9Ala2E5XO8oUaNsiff9IJO%2F37hWmFPGwfORKl2S3l4pqT5opfV62fXSVKwptmDgVmIhMlGM9Z8Xb4HHq5%2Fi%2BdnrhkQaE4RvU25RhoxpgxU71RcCEOM8kBTO2i98ogEic&X-Amz-Signature=d3b494650aa06d3c6fd1cfcecad5835553a80985f06f740131f02989930244b7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V65CA4OR%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032622Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIE2knO2xglhvvuSFX7dqOiuG%2BRbiHbGv359JQmQ6zVPjAiACRqZY2TsBomQEvR71LESWA2TRVeE30ySl0hTbPbPEgSr%2FAwh1EAAaDDYzNzQyMzE4MzgwNSIM8AgzXrr960SZ7JAMKtwDd06%2FUxxq7eq0aLeTkQNYtiOT7rN7u9lglt5sl6Jyu6M597R5Qkv%2BielEoc7DFNl86LfgoUpbucSlWuIjt3I2iVvGfZR9B9iXOm%2FScZMIDuWhMtjOLTv8dSQP1Yi3H4PnlnYrDcBtOhPz2ItkfDSvHFRA0WdpNHwY77FYbboCLDnlDm3vB8fAytYn2C5o%2BWL0%2F8M0A5DFuJ1z%2ByeFjIFKT7co6%2Bk9b%2B5cZYXlkpCF5wX%2ByvOWdSlnMCOMKIeoBo5vXzQBUmTZW57waOXOna1M81W7%2BVM0N9rDKPUCSjIhTy2cGgagw%2B1w8kueZwauiHgW1vSv7OXPuVwvQrn6Omgc3J%2Fz45CmoWdbzeA8m6tepo388fDH98NM15FNcdIJ%2F6oWjCIEdGqN0wv8iA%2FaknnB3v2QHytHBdOrYtmausBBKAdiB5%2FBQR8jnYM%2FhOAwdezL7RERjPWNfAYyq%2B%2FoqVx2IJq%2BI5nw9daldReLou0oK7D%2FOqq%2F%2F79jUSCd9xXJP1B%2B7zELeKXHwRNDTyhsQMm%2FrrYq24GA3lbTuJqXTiXqxQoUB48c1otNbRVztVrlbD6mFxUP85%2FoovWYzuUpV9EbxJcR7vvigICGpAGSsAXQ7cN9i4IlGXbseXKG9TkwluSCzgY6pgGmaLZtRToLgO5pU28GmIV7i%2FoSbTVVAAa50B82YWuK8o%2BDG9GicFtTRXvWC5jpyHmcm%2BI7Db8odEteU5%2Bm8dT2GenL6RZfqHlIeSzMUDZavDPKYqv%2Bq1HMyeOFSndK9NRHmtlTfIKMmIfsJbCoPOwysoqIYdDhj3MZb8wQV3ribqcb2cV%2FAr8zOacA15f85EEmH9Y3JidQRiKWSH8xVdoq42inPwdG&X-Amz-Signature=4a102bf6be38a3169903df1037c80ffab13a424680d2a3f824e316add7a48527&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V65CA4OR%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032622Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIE2knO2xglhvvuSFX7dqOiuG%2BRbiHbGv359JQmQ6zVPjAiACRqZY2TsBomQEvR71LESWA2TRVeE30ySl0hTbPbPEgSr%2FAwh1EAAaDDYzNzQyMzE4MzgwNSIM8AgzXrr960SZ7JAMKtwDd06%2FUxxq7eq0aLeTkQNYtiOT7rN7u9lglt5sl6Jyu6M597R5Qkv%2BielEoc7DFNl86LfgoUpbucSlWuIjt3I2iVvGfZR9B9iXOm%2FScZMIDuWhMtjOLTv8dSQP1Yi3H4PnlnYrDcBtOhPz2ItkfDSvHFRA0WdpNHwY77FYbboCLDnlDm3vB8fAytYn2C5o%2BWL0%2F8M0A5DFuJ1z%2ByeFjIFKT7co6%2Bk9b%2B5cZYXlkpCF5wX%2ByvOWdSlnMCOMKIeoBo5vXzQBUmTZW57waOXOna1M81W7%2BVM0N9rDKPUCSjIhTy2cGgagw%2B1w8kueZwauiHgW1vSv7OXPuVwvQrn6Omgc3J%2Fz45CmoWdbzeA8m6tepo388fDH98NM15FNcdIJ%2F6oWjCIEdGqN0wv8iA%2FaknnB3v2QHytHBdOrYtmausBBKAdiB5%2FBQR8jnYM%2FhOAwdezL7RERjPWNfAYyq%2B%2FoqVx2IJq%2BI5nw9daldReLou0oK7D%2FOqq%2F%2F79jUSCd9xXJP1B%2B7zELeKXHwRNDTyhsQMm%2FrrYq24GA3lbTuJqXTiXqxQoUB48c1otNbRVztVrlbD6mFxUP85%2FoovWYzuUpV9EbxJcR7vvigICGpAGSsAXQ7cN9i4IlGXbseXKG9TkwluSCzgY6pgGmaLZtRToLgO5pU28GmIV7i%2FoSbTVVAAa50B82YWuK8o%2BDG9GicFtTRXvWC5jpyHmcm%2BI7Db8odEteU5%2Bm8dT2GenL6RZfqHlIeSzMUDZavDPKYqv%2Bq1HMyeOFSndK9NRHmtlTfIKMmIfsJbCoPOwysoqIYdDhj3MZb8wQV3ribqcb2cV%2FAr8zOacA15f85EEmH9Y3JidQRiKWSH8xVdoq42inPwdG&X-Amz-Signature=48ba7ba0301c87d4618ed6cd7489609c918204f324e5a8e2c018a792e1fd0a11&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UJDUIHS6%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032645Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHxMLEpQiO69eP%2BGoLOyHZdZ12kj32KffAuqRSNjYHqKAiB9%2Fp5Qcuz7EIw6O4T%2BwPQAKnOWoTKZ8vAAhb6JApVM0yr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMkwyzxu1pZHCI6cZxKtwDbI64%2BAqsL%2FfaWOLMcTEQrESlTW5XO4DgbMfL6U%2FKJRpB8yLiIWsHozGDn4G4cVCWplmjRghNUnEshn54VFY%2F2ulD4fEXuo4ZBaVfeGxKSYUMBI4LwDUWWz6eVoc8xdUFqhO%2F5GhvNbisyXIh%2BpXHwGklTGXIKZ52mCYSITb3pAaQuwgsf3NBs14ybXUVN87JX3Z5Pghs3yo0v8%2FCTpiuRe5j%2Fk0vPGKfq9NH8nTz53jUXAtQ60gj5tktLbHUmJGtxafw7IArHDnIMgdWKXoHtXhuW3kzQphTS7mao3L%2FR9B5yZf8%2BeUUXFK3H9h6nyf5q4SuOmdXlcsisS7Bhgc5IKEsX6At5AxdznY%2FmCHJZUvleLooaViUrAL7Sq4dgMLu3UgqEvbuNpjvW9E43asWcxaM19sB6GE1PFZUAuLVzejDRvUXdaYxqHdJF4Gx34cAgshuSDXhh13Rdq0oESmu5j2C%2BfcDPj8uir1dD4Y3sqWCZQOl8aBL8jZ1NrI8J9XatUsCVEfK1fPBQ9Hc%2BAHPFZeBgWiyp8xt87d7hmw6qZId1AuAdtz%2FuwYPqx%2BRKkiZAxFvRxlzeAAq5PKXMdryyiBItOVNDkJohdCwRa4xPtuuFMWZ%2BuiKaEkqzEowg%2BSCzgY6pgEqZWoX5DRNzEc13BOqj6DHp3jLupZsgITcLD0Hvvj39zgWMM1D2EXk%2BdccqPUdnWxFbhYm7Z7VhTkTVTjgaQZRyzbQuVz%2BLe9Wawb125OrSwJpvUClkmzeYTuHo58NfHurb4bEAQ2e45t5lngBEbWjWQzqBGa2iXQnYwBNyoVqlsew4mIaGLYueX9LNXJPcUeNIKjEyOIeMYihk5EZ905WQDRo8Xuu&X-Amz-Signature=d80c9281e232f87764bf7b064f7c7d4f1c66e54f7875d4fdd33781b22954f610&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z6P5WQZN%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032655Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFoe4ys2cQBhJGNoFknA3Ib1O7rEGBzWlNnmOztc0QZGAiBcuzYfXTr012hUB%2FGuTBNppNuFOavWtTBY5RaeFqslJyr%2FAwhzEAAaDDYzNzQyMzE4MzgwNSIMJexxWaNIUIMJIn6QKtwD2FvLp%2FQsTdodzB4OaXmeRgOrRXvHPusgH%2FnxMIxq1kby%2FN3eJVlMCv8vJA9QgrxMsoyKGrJ8Uuv03gS%2Bz0jEBCUE9cLRBujb4ZGey%2FGJMlFNx%2F0t%2FjaNp0zVS3YiPTNkkevVTZ8yxlJ77CXPB1qfhONiG8BikbqrjlpSrSLpsWDQNLKphrIO1uY9oqcTr1dLQlJ%2BM5OrnS5VjDJ4sc3E9O5rRglWW7jv%2FQ8bYvXP3CE5lAATfIgfkALV9kCQnOdtLN8I6zcdfnmjjxPRgJgQTXTm5z9FZB36WkXgoVh%2FB9LDuxiNkq6LtS6sfyiq%2BX2drXu2dmkV%2Bv4wzGL1tOs7yVgADLcaVojf%2BC5Ec%2Fv1wSzJhsbGcKAL2%2Fafe8hUKj%2BWuP0Tlv9W3gFh373gSq1riGxsbPh3naaVb341aIA7blnHFF%2F5tgSk9sKf9Hx8%2BvCc8XQwjSP0fimATJU%2BVAw1ZGIGb89%2F30Ol1kYwD8NNGyO00GqRjyUl1SbeQshG7dtk6fCOJ0RaZRfJ%2FuA11wGNtFTdwp6ZNrPTxefLpqf8IZjZvyAUay4rZsxwoE6yF3kCu95IV9hD3e0xZVrDnGcnb3ZUWVzzH%2FA0ByFZI8OAGydh3l0j5XvdqVmWpq0wxMCCzgY6pgF21rWwzrVrZhhQWMp7Bce%2FqFNte%2FhanaoJnQji8tB%2B6AJhL595AueW%2FniYC3X05NSuWlr03clV%2BOpYCO0XDB2fZsSdTe8tClk0qN970EiHsOnqAdnGZJlNw%2FWewbvBAfiZ%2FyRclE90gVBlpHp9FCcuL%2F9A5fzDzvgP73enhxvRhDAUxxeTr%2BWP9JCIba8rYt6i7CCv7mKnaChoAKfwpHwZAeuqsanO&X-Amz-Signature=1ec144e60009dcdaef583881546f5094dcc0ee934891926224c183ed65e05650&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YMHRFO7I%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032656Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBvXLxJMwl%2Fxq00SYoX4nate0XjY2lM%2B6dbzca3jQR5gAiAzDiN%2F33wNW%2F7pJMgb7I8avcgBIt5PDHcap0GpPx08PCr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMqLRzOqAOGtrwYFLSKtwDoMG93GQsqavAtGOhbFa%2Bifl80ksIliE2TEhM2lIgpEePW53D8Hg1sNsBJTyn0X5jV6mtr7mvtkOeEJm999xiIsX6z7leU%2BjlG5JVLg2H4yhfA2gXJV32W1g5koHJegrJKbqyR6JnBoQu7s3Hu4tvrILCbob7%2FCGgIJyH3owhuQtoB6cpb1ClUT9RAg3QDtideMH483Y%2FI3Ru4e%2BV7oFloQkMBCO7Yc8VzCKH7%2B%2BfwXMBbdrzzYtQMHxdTspVn9npxlTKeraEdqbS6VkdPg0vrp%2FR5w8JY4XEzqEgmLham6K4%2BMvbyNwGAK3%2FQYqs08IeL1FtqQ3GsbPbT1RlWVbLr8Dul5vW3NYcNR36Nq2Eu1PCj5lV4HVERBB3jHl999p7yZw69pU13J8HYhB8ufrLYoxE8%2B4k8z48KonLVr4xItbzibkkbZPfbenB%2FBObXCavyxl2TP6xxGD6Liim1Cc%2BgH3K51rGjIjsQHgm8op%2BvPNfheAuyr%2FNQ13oXfiC8h0B3h4%2BBmiyVhYp04ytgU5GG1bZLT8ctgidfnOaUYoW%2FPeu8STTNGcUVCNoA9EirZPGDcCPgkgN3rbCxcRon5uFjdj%2FEAguUtIz%2BnHzhwZ%2F9WsXYgYt2TJEji%2BBRrswnuSCzgY6pgGrXuNxZokjldQBn17ptrHTAKaLSXzvPUOQj1H9nOac1JJGYt%2Fx7eSrJdWJEMDQ7F7lz9taBbRE88lLoFHhHg3DJ%2B%2Bqsfqwq5R853XiEAKzacUkhfaiu1Z2lb%2FXJlzBlLujMraQRChGo2Hl6g%2FVDPpa1CWHoYoNUMCjT2I9UM3KoNECUACMdaXJfesKP96zAcAUdJ%2Bc%2B2C840QGGKeP0kCLg6L05iFC&X-Amz-Signature=30c749ea106ead4e5f229aab3bf6876264731087f731c82f1889dcc17cac9cb7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VGGVJSBL%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032656Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIATbZc9HRt0cHRwlbMD18GowYkcam%2FnfzHTUQYKYTgnUAiBgjjl3MKec6fG8ga44M1lAZU9G6KDi%2Bu7FmgIvv%2BFrgyr%2FAwh1EAAaDDYzNzQyMzE4MzgwNSIM9f3A%2B3NIT7csNEYmKtwDye7G9ZTZg6DcKiXN2TQyGH4jcPZO4TLzFxKVFzYtbRHoBs66A3Zy1%2Fs6kvs6QZcKC6WFS%2FJC%2FATBZpTO3oHNJUYPDIslm3g1M4pWa90vd%2B9Oofzj3TfJPRtwHe1qMrYe7GwdKtqspEnZIfVA%2BcvVMJ%2BiHRkqi0%2BMnJWY5wo0EsWT%2BoG844NWoDjkNp9758W29Rg68ZSLBShnwSGwDR2JTGgIW0BoTtvzUZYOoAwhstl0wXlutMMkvpNcSNml3%2FZ1T43xsq4I3m8a66j%2BAscYtB9G148wKv9jpCNWIdH6x31pTJaiSg2PhRHVN96djDok353PytlfgHnCMlA7FDBwBElJeAElo%2Bsq7mlgwZ488TCM7AKpTHB6Ewc4AXuQB6KYkgv85%2FB%2FIjVVv%2Fi9dUBbCmi%2F1OY6ZTsJ9h9myA5Ok2XvcKFvwSQaymj4nkQFUB%2Fo%2F2YoOukgP6XYuyHPAaGPGuzow4QlGv9ajdiWElnP9E3hxpm%2Fo%2BMUKLQ6%2BbCX4Z367LK48oP%2BZGkhf%2BYGP5kUcmSfmeAFYfgUtRG7Z%2FUJNU1K5vd06GszIlmIn8b%2FxkfTwmzNZ8NOvPOcZhFaj9drbOP5bhTHPlhsFDKLxYghEp3VEhpwZNBOiH%2FV5G0wseSCzgY6pgGmEwi2FfLdWynIzPzQn7Ya7Yp1u5lXV9sz2LTDgM%2BhnvFL1PdszTu7h6HHTuppFjSGLE0LWZ7d9UaaVl5Bp9POeUP4xeF6SULRglZJBAHRTSKKJcMQ7xOtQpW%2BS8JF95vB8TlyfhTLFBj%2FjUss%2FlLGx06CnP60uhcohzKi9sDQDg2Nz%2FUJrYy5od3kWwtmSlhvqBqpB69GmXwPz%2FoCoA59Aro6ltWJ&X-Amz-Signature=f950bfb7f44ecc654e3fc665919640b34d8d99f53a0f79c8b714fd309883a950&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46645MNULBY%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032658Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDd%2F0AhHwO%2BGxMdWvJ0QbyWTrYOmepXHdQtxhmI%2BsUAcAIgGdQp65t%2B%2BBeee9BAqr9bU07ixDJRGaJS2OukFItlcmsq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDFnOix4bVTGtpn7yXCrcAxdxIU8dwOyHtbjLkLiLZR7QNyKHvF%2BnfAhUyvdKe4%2BmRLOSLuJiRH7d95PhxFxk0wlXx1Vqr5YuYGfYdDW5OmAKOlYaKiG4obCdIQHVgAMoILzht3VK%2F2sqfB%2BWQvY04i%2FVDMYgz81GFLdx3d0uJJ1woSvMrPpsAcsIW0t76%2BS4k%2FmGVDjj2CVkq25OuOxNeTTR6yK6RTVuw4XlvXz9nuAcSN771m8UuOSb8fOTnk5SVHRowTrKTBfNTKDJredT62yNcV6wa6JWMTeCxa9FiobQDJ8p2esZIPsThdd0%2F9FvALh0%2Bcs9e6pTD6p8bazBRsqHujZ4oDwCZG0uJcIJd65PU3cnrKofU7LqEeg28tP9Bk57tOGk491s7eFtw%2FuO7ORfLUFByV%2FOQr5C2Vki3p9%2Bd92%2FqYQRIZaQxFiwaCDZWP7X4CClu3Gu%2B8jGR3X%2BmR3y1cHri1MUOdpMQqDXaEj%2BFc6AoyZlmK4cMhJATJUFz3xBnN45fJltXDlZuDXb6UpxTr%2FZxAJPEjO9kd8bRq%2Fr5zvWDolG747M0AlC2yUdBs3q3Oa%2BE%2F1nz11CIiVjKO86Ys75%2B7tjjAjnRY7eYNCHVSzWupNW9E7rmMSjMmRaChQoIP%2BqeQQuZlrVMLjkgs4GOqUB5UaAW0IZf5ZhvvcautIP4ZDV6IfNc9IGYf0vtVZFyBnwEdJuJ6pt2SUJjTEJdjsKVQYk8jG6VaDlSm4GMdO%2FrSa%2B0uW07NOMoVLgBPQDOkvp3XmFFLYkB3BsvVZjsBiI%2F2soN93ltU6tOEfMLiQWTPjIPytU9j262pahGr3YEkhU8KOa4wHGAAgZsfNupWMeUILKKKSQdj6izYVJV7c01sWb4UCU&X-Amz-Signature=fc11310c113941b955ab3835d8aec6788783e07e0a396bf1370509d516c7469f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V65CA4OR%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032622Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIE2knO2xglhvvuSFX7dqOiuG%2BRbiHbGv359JQmQ6zVPjAiACRqZY2TsBomQEvR71LESWA2TRVeE30ySl0hTbPbPEgSr%2FAwh1EAAaDDYzNzQyMzE4MzgwNSIM8AgzXrr960SZ7JAMKtwDd06%2FUxxq7eq0aLeTkQNYtiOT7rN7u9lglt5sl6Jyu6M597R5Qkv%2BielEoc7DFNl86LfgoUpbucSlWuIjt3I2iVvGfZR9B9iXOm%2FScZMIDuWhMtjOLTv8dSQP1Yi3H4PnlnYrDcBtOhPz2ItkfDSvHFRA0WdpNHwY77FYbboCLDnlDm3vB8fAytYn2C5o%2BWL0%2F8M0A5DFuJ1z%2ByeFjIFKT7co6%2Bk9b%2B5cZYXlkpCF5wX%2ByvOWdSlnMCOMKIeoBo5vXzQBUmTZW57waOXOna1M81W7%2BVM0N9rDKPUCSjIhTy2cGgagw%2B1w8kueZwauiHgW1vSv7OXPuVwvQrn6Omgc3J%2Fz45CmoWdbzeA8m6tepo388fDH98NM15FNcdIJ%2F6oWjCIEdGqN0wv8iA%2FaknnB3v2QHytHBdOrYtmausBBKAdiB5%2FBQR8jnYM%2FhOAwdezL7RERjPWNfAYyq%2B%2FoqVx2IJq%2BI5nw9daldReLou0oK7D%2FOqq%2F%2F79jUSCd9xXJP1B%2B7zELeKXHwRNDTyhsQMm%2FrrYq24GA3lbTuJqXTiXqxQoUB48c1otNbRVztVrlbD6mFxUP85%2FoovWYzuUpV9EbxJcR7vvigICGpAGSsAXQ7cN9i4IlGXbseXKG9TkwluSCzgY6pgGmaLZtRToLgO5pU28GmIV7i%2FoSbTVVAAa50B82YWuK8o%2BDG9GicFtTRXvWC5jpyHmcm%2BI7Db8odEteU5%2Bm8dT2GenL6RZfqHlIeSzMUDZavDPKYqv%2Bq1HMyeOFSndK9NRHmtlTfIKMmIfsJbCoPOwysoqIYdDhj3MZb8wQV3ribqcb2cV%2FAr8zOacA15f85EEmH9Y3JidQRiKWSH8xVdoq42inPwdG&X-Amz-Signature=a4ef89dde6a083ee39c46a98a29994016347942ad60545d6739b5a14d0a5f269&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
