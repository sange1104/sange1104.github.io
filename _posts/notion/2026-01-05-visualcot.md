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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TJO5CVX3%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045157Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIHb2AlLYABpvjX9rSPDbApxlDA0jgpKeOpjaUYNhZaF4AiEAtWIP7ACFfKna6OUC61E4%2FHyVrbiTc4djkpFzcdDTheAqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLuXatfv1Xd6lGcTOCrcAy0ZBwXUDxT9IRANKdlbTa4xWRQP0l7t4y0n3HhrDXs3Hb1heVrpvWYRk9ja2iXfbGiGdJeSoUVkfCBaxPzo0aGhOCkHfwZ5CvE4k7Id5mkcqAb7p3dzuoO3uNGcjYAGtdOTjygCso%2FjlK092mTm5CML6BLH0Y%2ButLe66TLGv8GA2gmqvzOKoXN9oROWgyABd65I5fgZgXMOFul9dhV4MszISb98z4s8VlYXxElPkDtENjmK8z2hGrGGHzxoI%2Bm4W8B8i7lcjzLR%2B9Y3NW4m1j3PWicmT0YNst%2FBS8Ix5WfGfbwnAGnmYO9kCqs8dOMWki%2BKV9%2BeBsfGJsRUQw%2BfipgUDupjbSC%2FtJi%2FtfvDQqc5XTGib%2FbaHDfs7Xv7PzAgUPoq74wqDCpPBuLcYxfMkmTsOdxFxWz05iaT7dBAifYI4cz7ZJQQMUyBn5QHrEN%2FE6lLFCIAMCU80LBDJxm2jDdrpgqpOzFp4cefrUBodTwInpbxrrFDsWLpNWdFK0kalj4LZeH0QpMSsn19P8HON1FZN0ZsrlUC1FiINFFdC27TGBgs7LwgOJViBMAH1Fk%2FZp1tX4tcO5U2yrnHf38FZdff1NZ5JHsfX80YXChxYok4NLnt%2B4VtusymGlzmMILW7tAGOqUBzV7G7hrcdr2LxpERAZa1bKIJKtG0e%2FZXgHhR%2Frv8VqZta2P07OFDqi44DFx9RxLFMbZe%2BFUBQrvXnEhpVmNvTRYAj7miem%2BL5JT7EbrBhMOffhqusEZa%2BL87SGhX4Wlk1GBIUVxCBUULu1cCc6ntjTrDxop%2BwtDhDP9xBpClazTmMbCvYae35dwc8X3Iyq4xDes82IP9ldAQStHpINPwgbpaOBq2&X-Amz-Signature=6e32ea9593877ef95e9be734de0f5f821331bf403e0beec4e3c015638fa32c6d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q5QFWCP7%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045158Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJGMEQCIQCut4FyG6xaoCdG2m%2FOQ%2Fr3W6UUXkaoR2%2FdnG5tvYJExAIfHQmc6r75LJoCU0KetGN02X2sZOXoXsHOTOvECV5luCqIBAjt%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMUTVUMzosGPrtSSDYKtwDeXP%2FJwwLSR7pAama3wQ%2B5jmO2OCC1KkvKDZZVBsgBsrJcyMsDoi6OHT%2F6zcv8Y4BlV9GaUyqvTeJ%2BP7DeXY9jb0cDDfRGzjL7aplZjnfZ4yMWjwebWiclvmMiVYoYbQGAzyR6J%2F%2FtzCyTWofsPvJSLoop5gNFW98tU6PbLmkoQSESVaFg8YilRL57ZhzsAzQYpgSKP4VoAHVhsQNwuvuwvy8knUSif2PPuJlOr0ijigHa%2BQr8U6NPNaBVqaQSCv%2Ftt6XHzZngQGVn9xq5vGqmu2QGp5y8T0vuFQxDZp8AUeMJOYXx8isZ98mdWxgrJOtPSovCBQncghpdQPL9y2E26xehrpDsN%2F1QHhdpAyKNThRHkWfCufL1lR9zScTHuLl0ov8qdiMMYG6W3zMLM%2BMnTfPJAt9WQFpflwJ9ldmnKNxe%2BkB5wWdmektZDy5UeO%2Bkp3SYbx0Vd%2FB6ZauxXiBhu9CIyIO%2FQfEppKCfLh2rJUjxVi6%2BGsrmxQykSST6Ks1M1Gj080JVb9eW72UuGBUMboSebbHy%2FHp7mqfOKbg3%2BzbQ69i7hfcQNuoNFJJ3bmyAtDvOeXNNC2yk%2F7wv8gx%2FsUYsexgdbJ8P7gvFLa4FO13j%2Bw8vc1MIL%2FG8Tow5dfu0AY6pgFgNsKEBhP2adJW%2BBhFL17bmQDDutzLmUvRpGhmjO0N7%2B4ayxXwD%2BulePptnH4MxNmnMnh3uCwjWQJnxpthufWkzd7Sb%2BE4jJYQ1d6ST7Acpty543WCmzw0HAvSG9bHKLnt7YJIzAYnnbwmrtwdoAJCwvSwNsTN2p1sq0dM9pQqVRoCK9b3KTkumXoGtq3WefwVDBk3%2BFIEe06xQlWZUYgLQqrCulMI&X-Amz-Signature=a9439afba955bc00ef2898ace5a96fd5afa0845158ee957b9c84d2af9d7b4d4e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XCQH2KR4%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQDC93HwB6nln0AnM%2FgaT6UPwhTRxeueQ3A6qMMVhVCktgIhAPA9xsNDKbOK%2FMokfw4EtL2FtOF8kh7Gs4pMhXpZJj5LKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwIkFo3Ed6hOKkwr34q3APo%2BmgunDTBRSJZysBjI%2BNgF7naYBacyWQ3Ec4mxXolghOpv3Dyb%2F7P1UhQVQA7WxNQP%2BNZO2%2F%2FT8bb0rZIMNC2J8pa5kSm%2BAuMdCxB0K0a1%2F%2Bio%2BRqVScB8nZYNEGmVmv56nmdm%2B4v564Ei6MEQMC8TQWi9meYdYKZU6uqfMyvySiqc0KfvIAxBg5a0b7gR1i2Fj6xiEjuMs0A6vDp7%2Bu3tDC%2BzzXM5o%2BSaCxoy3SOxbgEr45f1ERCZY%2FA9rls9wVVsVIcdL0gRphpY6zP%2B1hjpaJ19mqspNxLjYWQOq5yIvlrcNIYjzkQTKpjDmbFugA7860n7CbRrlS0Py5MXUKhFdkCmKxm2mBrYB3BNqhxxFUH0ikVpxxiVeRpSg9RE7vwjghf4kuN0nNUKxJVor1pk9OixvABRnemdUN1izlFHoosoJzU0btf%2FeYcspLrpH%2BgnNjmExI3ismzqgOKFLpVlhom9ZmCjoGVJAF60EcqPlgQ3hvpF%2FuLNeERCG7IG7Y0bF9honCONtjqIAdTgibgglIZzt1IgiUksCtXfvlxcCYw07Z4TqygpGVM1sTW3HxdiM1ORCxe1p2KW6oel1htwW21zPrTRFl%2FK%2FseX%2FOHyhGvUdKt%2FEuFjNSovDC01e7QBjqkAROUCu9IC%2F6hImMq1AeCDNnMVh%2BMSvSuAGpQo%2FKHgH%2BIYEs7DvHVQpOPkTFEvNNm97wK391x3eObcyNpxcMbZFiWeZ%2BY2fFv24pOmdpg3B9W6TufUdjph1LAa4xXi%2BhNaowQpTRAsgGv%2BOHVgJgJ%2FoNGfqpgMKF6Hc1db6e0UesOcSJq8VaVqwxJtc5rON0grIPoF8jhmnDumk4u3L3rM4vNHDbV&X-Amz-Signature=a499cfbe2274290dc195523b68bb2f4c0ed67a55f30c247db799b90ee3e6402a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XCQH2KR4%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQDC93HwB6nln0AnM%2FgaT6UPwhTRxeueQ3A6qMMVhVCktgIhAPA9xsNDKbOK%2FMokfw4EtL2FtOF8kh7Gs4pMhXpZJj5LKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwIkFo3Ed6hOKkwr34q3APo%2BmgunDTBRSJZysBjI%2BNgF7naYBacyWQ3Ec4mxXolghOpv3Dyb%2F7P1UhQVQA7WxNQP%2BNZO2%2F%2FT8bb0rZIMNC2J8pa5kSm%2BAuMdCxB0K0a1%2F%2Bio%2BRqVScB8nZYNEGmVmv56nmdm%2B4v564Ei6MEQMC8TQWi9meYdYKZU6uqfMyvySiqc0KfvIAxBg5a0b7gR1i2Fj6xiEjuMs0A6vDp7%2Bu3tDC%2BzzXM5o%2BSaCxoy3SOxbgEr45f1ERCZY%2FA9rls9wVVsVIcdL0gRphpY6zP%2B1hjpaJ19mqspNxLjYWQOq5yIvlrcNIYjzkQTKpjDmbFugA7860n7CbRrlS0Py5MXUKhFdkCmKxm2mBrYB3BNqhxxFUH0ikVpxxiVeRpSg9RE7vwjghf4kuN0nNUKxJVor1pk9OixvABRnemdUN1izlFHoosoJzU0btf%2FeYcspLrpH%2BgnNjmExI3ismzqgOKFLpVlhom9ZmCjoGVJAF60EcqPlgQ3hvpF%2FuLNeERCG7IG7Y0bF9honCONtjqIAdTgibgglIZzt1IgiUksCtXfvlxcCYw07Z4TqygpGVM1sTW3HxdiM1ORCxe1p2KW6oel1htwW21zPrTRFl%2FK%2FseX%2FOHyhGvUdKt%2FEuFjNSovDC01e7QBjqkAROUCu9IC%2F6hImMq1AeCDNnMVh%2BMSvSuAGpQo%2FKHgH%2BIYEs7DvHVQpOPkTFEvNNm97wK391x3eObcyNpxcMbZFiWeZ%2BY2fFv24pOmdpg3B9W6TufUdjph1LAa4xXi%2BhNaowQpTRAsgGv%2BOHVgJgJ%2FoNGfqpgMKF6Hc1db6e0UesOcSJq8VaVqwxJtc5rON0grIPoF8jhmnDumk4u3L3rM4vNHDbV&X-Amz-Signature=1d8ab08a0b5c691d9cc4d9fae8e21196a655548061f66fa5d7369d0eb9710dfa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466543KSABR%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045205Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIEvz1%2F%2FagatYGlep0UcwC34YcBVLdUvYT6dyOs3ccVAFAiEAqHI7ZhX96Vg8z6jD%2BrzeVYpg7rt4hkNM2jXq3AZA1HgqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBIg98F86vFrSci%2FfSrcA20UbRSBExgZQxYzXE%2FnKI6MoxBzUZ3iDp0x1JimyZeaPcfar1Gmzcn25CaW6CGHLTBIzaKzFhIYVhwhaZeDHN%2BtcKAKcx6v5dmKFgKoB7bjfCVCPL3c4E09QqTe35Rigsb9WNEO2jCfZk22wW2dNZe6Snd%2Be9Mw6VW3kGRdBhQfxb1NRaT%2FTcFGyW6Q%2BLfdSssGXSbeJyHmyH6AtHdZ2WS0ttAowfzatE9hlNjvgbxCvPvSXB%2FOY97XWgES%2FP25VTNOjY1OykH8G5IC1EHZl1j7gkLXjyFyNM4p8xjh5B%2FEOVH5kUQIFa2vQvMvR7RNrOLIzH0qGdSUviHIeNavZy7xN55lsE7y3b3PvM8e5C3KXbtOc8tCYMDy5ZJSr94gaXl1OTcprW073jckMpcfZRgAWo0rFjX%2FIBG6jUcxyk66HKAWSyc9VR2kbCXYem%2F34v%2F0X25UKCRfkneMeJaOh4QWIUnZbOTh3n4rADRmL7T9tEon8XBhk6Ucqy498zmjzAsVQFEJ9Dl3yTxsxqp1AyH%2BUbQfXPdnEKLfFVLgkRBXSjxAZt%2BzoL8x0UaDE%2BM2UlKn2y%2BdcKnahVNUx3SoRp2BFBb2rC86NF%2FfK4M26OpUzDO1Kf3J7P6ExMdPMPPU7tAGOqUBIwJS3QuwP%2FGkEQjEIVs1efmtgMbwcIbOkixJrNMcXkz06HMp%2F6P%2BOsuZiE%2FvAdSnbIfaI%2BX9aSY9pAeuT8Znf0Pb42aa1I5WwNoUrbu6XPDoBYBKMeGX6MawZN9lLiYaPzrxPjhegDgxTQ31eRr%2FaJyvRY4IZfNXRdOce2%2B3IEF%2FvNHYA8nf%2FSyISro%2B2PlzWLbMeY4KQp%2BNH%2BMPJZBe%2FNA3eKUi&X-Amz-Signature=c5620446bd3dd31ee29ac395a5efab45cc0fbe9488acd832ed7bd7db841e62cd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QVLE3ENP%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045206Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJGMEQCICB9gBaGVrRuZf8bIm8X8JhBJk5hfacbCJwMKarZMLK5AiBCBCO9qcpKi5pofVcmPgI2gQHN9N0NdTyDlu3PFLjAkyqIBAjt%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM%2Fk6m9RRkbA%2Bi%2FXTIKtwDJHzsU88oq2YLoVFu99gcB1EzbWVevhHC%2FjiZzlnlPriWOt9Yk21FHjwSvUrKMaYvztwhkjZXhm86J7ZunnvKbw0FKrmOhGydGNvvx5Qo7FUj7crYcboWtlnhcocLM5oUBBJyyKLwTRDFz6b8lAz%2BKFRGrjOjCbtVaxCsXdIJ8%2F3h5tCNV9iy1sKluiJYj23qKsxXmcmlizJYyTeHmcb28vn%2BYIGHjB882xxOSBtZbmVpuWNIPbiYcPZF2q%2FDhxB9UJe4XvL6c4ODiczazWPDbnyvemcRikXn8KCv0fHswjFc7%2B57typ7vNTBcaCEgClAu3fExsFVRcsY1OvL%2BVO6%2BQF3kyyEtj4ld8YCqF4nl06MZrJ03kxJoXJn0vV%2FumKt4gyiwKIaRkyRDELi0JM6s2W%2BICSex%2B20pSl8%2BPNMXao%2BDl3%2F%2BYc2PIh267ffqTautciqITPYRScl15bQ16MRrwEhY8DJESHt0BymP7N0CV%2BEpNsPuwa6qXfgy4bJCYkE3e6VW28waGNJgjQ6CZtV2wMmwQsnjAdBGkMOLaB0HvpwWBp6q%2BJ887qLMJw8aI0Pm%2Bt4Hw02IrxnVV6poOyu9Py%2FaV6a8F1O4YMymJgJCk3MzLRYYu48RMRFaw4wyNfu0AY6pgFo%2FAb9823m1mXcf8i2yCOxV6BjXzGQDMMxTD4Ll5uOCtst%2FmsoNgwnlRUZvq31SSzv8yQ%2BYsB8aP6D6moQa%2BnCPJUh%2BTpLjLVt%2Fr%2BZQkl%2F9jVkZ%2F3xrsFZybj%2BIW2KXIQ7pjOZ07lgS99EtAcicCJ%2Fk%2F29M%2FwF4oHCOSknvJ4%2BKm9GI39yWlagDocCIDCRo2F5Y3vdbpwOzW36IrGgk2ArXg%2FBSPIG&X-Amz-Signature=d8740f75b8ebefc6af5e9c779ba0c5fdd1d3ee2e83c58cd32352408dcfcd13f3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQ6V5YGM%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045207Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIFxdQdkUsMjfzqTzWUkB4SdmnvgK80Rp3VIPJYiCi4%2F8AiEAuxRWYhWLOtTUHMuXyNHbgpz%2FuOpAK97au3d%2FzBKGiYMqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJhGdCRY96I266C%2FZircA2IfTDD1BSdETa45zULXiu4A2r5wWqcAWHrriWSb7S3fO%2BHbK4P2ioh26joJ%2B0UPP9SF4bgygVy%2FM8DENxsD2ggEVmXmo4SDoVT96h4ZWkc96cAuSxgmen1%2BBPvOKkfyphQvl29q8T4xwGd%2BpsIfFFLFaAaDVSig%2FhyIYeH8uwvlRtQLSxM%2FBkYRRL4BL2sBuuElyraJCyx9Oh3jMH6wIX8KTRM5UW82dA8tpdber75CNz1NfGHfyRsplv%2Fcij4LU1lBFbqxYWFYE0h99p5nRTGWGzBQetM2qnXsQrLRSbsKxGwW9LtPtgwM1jOU8nnTl3vpvCxNT9vuoWDncWlhU5Rv8GOps9kvxAyxK9ygXSK%2FXKUAe0dkOWej9JpjvdIF2Dw5Nb249i8nSHSTUNmX%2F%2B4bIG%2B4ftNPup1ahMTKknQ57KcCBhSAP4R19amPDSJjeMM58sVbIfdq5uI%2BDdO3ohau3XEMPqo%2FSHtt%2Fke1zx50u4PvIyWtenW7PhbcE2tJvz%2FAVe9v%2BK02SS5Zk3u6e7ty7xNAB3F8SZ3F0zo0JY1f8nutk7KO%2Bl%2FeuKsqLEqLJuXkW0XKlriUx%2B7ExaNOljGPXRC712AP0xP07icKJs%2Bn2CAWWg6lglMUPYnkMJHX7tAGOqUBg3kipfs%2FgJGuPT%2FwBuyxMECXJgBD107zzPj4wORKooiZAtWhBZYXhcu0xf6cx8NFLRZNgvNH8tEA8%2FneB6jzwFtaJFuDw8EhPSU8CphMzqSpHAvQ5thFc7JJrnebeUikqWQUtd%2F3BOHdWkZlp4ATGOrGKgiZDgp4URRaNGMMfBb4vtCtdML1pJMFqDYE3%2FcnQOgbHhW0RXjyyvl%2BfLuzASO%2BDLqs&X-Amz-Signature=94fd0e65b7432ee260f929a1880d5aa428219e256de7f1f1265659b71055ca38&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665I5MSHNR%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045207Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQDE9oR3mfSlmYd6KR9IonejdC4L74G7PDlY8otcu6gcZQIhAIrTkAfQjnGz19hps0yxc4N6m2smUV7rfXYIFhYktgOAKogECOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzQULAdmcPBFRFbFswq3AMFV1hducEriANsWu0OqgHBPzotdWlJ3mpzso1V%2FNHjpJ4VGtbFOz76mp3O6RBoCiVoShAKnQ%2B5sSA1vR%2BCUtkfCdlFLvOC7cdHpUp%2BGzNOVlpD6UWvP8gD7J5eTsYNrvw7l%2F%2BzGXhwNXMlrfmOK9e4Wyg50VL%2BcozGgEWU%2BjbLXTBFkgQ13gIPrZvxoiJKWeBJgQE4cBx0AaT0GXFnaRipBEv6NJ2T66VfJOypa66%2B1fl%2FLe2jskQDU40JJlpEdfmhoT2peoQSqZQj5WoSvMBePGr9jhA4jK7mikv0eaomqJiICBrMYO9eDLSciX3Ocl6YHsYlqqXAfZHhDQQWDJArNFGXObtVcmnkZK977Pq5Ezm00x8iHkR9CXKs%2FyMLR3CLfAhbZaGl6kuY6UvgX%2FbjfBXfOOaF0rcFdXecltvP%2Bbc1QN1JbpdzOE7hCrnFOUdm%2BH6feJwtKP0KWO6RrLURXm8Wc9WJOR%2FGFIZk3jS94zRUrrqqUoA4nOA8n%2FBsYS7FU2buVUkU3%2Br7Dsb1NJl5I1B2pQ3zkEM%2BXQfF13LVLNWcUu3mFWH9K7SvAOgKJMiCvEA4hxE%2BGBGN%2BjMrEsMOv4MdnlbJXxoLudxhKs574fHgBLEWXaTeJh5o5TCg1u7QBjqkAV8WMnAGkOnh%2FKwwcQOOoIdiFa%2BwJ%2BQne8wl4nJfrgXy4ViQHF2qkgtqdPo0yL7w9I66%2FL%2B4DvHPn9RmwjRLZoQexbMXh8PuacBcQbotNE%2B6LkLBluqu1sEdSfWA6SCIorC1LeZaPN3YhxEZ0bnTXqwGpoV7HTyUJZ6aXBM6WOG71Yu1Umkw9Jz2uEiN2qyE1dEQS867L2r%2FWdll1piibKqMolC9&X-Amz-Signature=7fdf84b9119ada813f15ce157b50d4c9a0965148a62458ecf9f1c25356fcae30&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VCZ4DRX5%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045207Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIGDY1c%2B7j%2BDyAElQdIBmR4NgcIY%2FSO2y9%2FDTFVXps%2BlRAiEAyaJ7gORD4WjTX6NVi7ASyLx017tmdhjkafAkwKmEAFgqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJKHaVzzzdLEtkjDEircA%2FtfM5RFj4%2Fj1GrmuOsfgzNmiiM%2B4wAzxNB4a5NmhzuauOB8mgMmYfLJnV2BwRTgDblIH65xsWtQGMOUCRR910BPYBo6X40Tzibt8T1y1NM8e4XnJB79pkezjNurDtx4BOFTjBwBS17HgRWYf%2BmC9nd91LsF7pNgOq7%2Fo7PxokezTfDBtUP9z%2BfOLPHQgiQ2imdOSG%2BYXa%2Bs5PBZDKs8abN32BFa6w8QAAyHyoLKN0gwBwkv9CO2qBjY41kqnEnbjxBcT6MnkNUoJmpwAKZMP0yCY63a6HoWDX5FgwRwmpT0KvldwouFXNyuzZlbJNr3hCVwumOEv6A5HhKrCnkKjQOvXYl2TB5jKA8anzJgtAcN1zn3aEyNEUj4siN9PtAe1ltxsSjFNh20TCE1rLaUgU4B%2BhpPZ5u7YOqG0Y2m%2FtYtYSdqb0yplgsAWGwYfaisHgpoOWO9VekPTQkAqNQqLodYrN2nUbIyQQyl%2BqUoM1YJzUcS1nY1tAVrz791FgNPLx6dJ184HIBHRUiCrGE9vf7EuBlbgd2VMaX9pa5HtI8RNZEXcc7CI8fXNctOx4ziH2O2AdviTgADWh25xA%2BifZlA9MaAFnHPhtYPI%2BO4P0bLnbOSEAkwdKnm0BOrMMbX7tAGOqUBmdQLwGLSHoC9s%2BqtXh9jddf8plZ6XbDWXZrTkZK1f299sL78OfEhsCqQzFpGdHFi3MH9GqVmR7s5HsLH1BS5URXsnVsAHCvPlH7QToZcAfDL0nDWdVYP4wq8pG1RkKYwE9rFXdfIqLzvTnfG03skNyEMnW7vVeUPc39DSVXLpunoM6d6CwKkSHj0GosvfhvJCCGPlVkbHxz4SLificRZuSZ6vpTO&X-Amz-Signature=5f0b9c9843cd5ad4be0dfdcdf677f64f735bb46db510fa77217587d58f315084&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XCQH2KR4%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQDC93HwB6nln0AnM%2FgaT6UPwhTRxeueQ3A6qMMVhVCktgIhAPA9xsNDKbOK%2FMokfw4EtL2FtOF8kh7Gs4pMhXpZJj5LKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwIkFo3Ed6hOKkwr34q3APo%2BmgunDTBRSJZysBjI%2BNgF7naYBacyWQ3Ec4mxXolghOpv3Dyb%2F7P1UhQVQA7WxNQP%2BNZO2%2F%2FT8bb0rZIMNC2J8pa5kSm%2BAuMdCxB0K0a1%2F%2Bio%2BRqVScB8nZYNEGmVmv56nmdm%2B4v564Ei6MEQMC8TQWi9meYdYKZU6uqfMyvySiqc0KfvIAxBg5a0b7gR1i2Fj6xiEjuMs0A6vDp7%2Bu3tDC%2BzzXM5o%2BSaCxoy3SOxbgEr45f1ERCZY%2FA9rls9wVVsVIcdL0gRphpY6zP%2B1hjpaJ19mqspNxLjYWQOq5yIvlrcNIYjzkQTKpjDmbFugA7860n7CbRrlS0Py5MXUKhFdkCmKxm2mBrYB3BNqhxxFUH0ikVpxxiVeRpSg9RE7vwjghf4kuN0nNUKxJVor1pk9OixvABRnemdUN1izlFHoosoJzU0btf%2FeYcspLrpH%2BgnNjmExI3ismzqgOKFLpVlhom9ZmCjoGVJAF60EcqPlgQ3hvpF%2FuLNeERCG7IG7Y0bF9honCONtjqIAdTgibgglIZzt1IgiUksCtXfvlxcCYw07Z4TqygpGVM1sTW3HxdiM1ORCxe1p2KW6oel1htwW21zPrTRFl%2FK%2FseX%2FOHyhGvUdKt%2FEuFjNSovDC01e7QBjqkAROUCu9IC%2F6hImMq1AeCDNnMVh%2BMSvSuAGpQo%2FKHgH%2BIYEs7DvHVQpOPkTFEvNNm97wK391x3eObcyNpxcMbZFiWeZ%2BY2fFv24pOmdpg3B9W6TufUdjph1LAa4xXi%2BhNaowQpTRAsgGv%2BOHVgJgJ%2FoNGfqpgMKF6Hc1db6e0UesOcSJq8VaVqwxJtc5rON0grIPoF8jhmnDumk4u3L3rM4vNHDbV&X-Amz-Signature=b8c78bb5ee244a0fe978e556ac687cf563541f9a0f4ac41cdd9ba06e7437d196&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
