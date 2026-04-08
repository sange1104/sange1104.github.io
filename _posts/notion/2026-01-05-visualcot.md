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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XZFEMY5B%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033426Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQCwDlabqf3WcOh08fc%2F8Qe57sCV5jIR0ruKwTekJKlFtwIhAJHyIC%2BubvMk1TTsgfkV1jjgSelLYzUGr8N1Vzw6m2ItKogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxHnQ6UOV09rlhdBJkq3APf23ZXjjirJciiCUNu5n5HmHnXmdaSW5p%2BUHyw3bN2FfDFojTCFVo3LjIK8amFp6gGh54uyou4BIEo4ZF9E8Fz2wH%2FACb1nVxtEvVdwwd38VmVoPlmXPtUTIgPdcMzN9W1IIgrObxHQVOR0UG6Emd8D2oiF47m8ZazGZ0w72b4tjliHbrAS1f4%2B1I4n5kv5q1RfiFm6%2BmXXiAA3NSxg30N0KkGh6zbnBsG6sXwbIjOGYO87mkyNJdfIzElswc3%2F8cyEGFZG%2BC3MhmgvWiWpOvYq2eD9XYNRl0qy6ymZPd7PryVjoeuENKwh5CXhGhfj%2BJowIiiuEk7c8UjWKpqbR%2B3s%2BQAsw%2Fit1XXCdBeJsy0cjySewdksq1nNgbpCm2%2F6dRwyECpYdns0%2FRqipYyw3sLSZt3txaqK%2FGa%2Bk7dzW8wQvcZGSwxxMvX%2F1%2FbUeXa82ccoRQ1CMEtBhIOMvX6eXRG9B5ZfE%2BJ%2B12Qdou6VSIIU0qQ%2Bxgnem%2Bot7NXH6Q3Phx%2Fing1ODgsnMjpyZq22M8sJSgAVcv4r2jWLK26Z%2BtQhP3dnGC4f%2FKTxA1zWogWaunbLeF1KRhIbW4zvFrUVp%2FqqiiGdR2U1sLdFDxIFipvhhrCwVqraNoUMpCHxzDah9fOBjqkAT7eMA5XQx6mIHVRGzmLIUJ6DfNol3XdvaQCI9ExG6UB8v%2BYZAHfocLhtBVR8Ud9x1tb6YYfypEmp0%2Bsjo%2BmepUruTeFwESMGi5QTejpdSCEoLMpco2307KGUmnQb5refCKXxigOGR5RRKsVRLvi9b4Zx4RVp%2FZ6KvrQMc3nA7IrHevwMVQrRe1BUjDH4gVHE%2F7xHEmqfmtudN7KOdb9jUkw5epD&X-Amz-Signature=1013fbf30d5c55bdf21aab5325105432553cd19ae7fb4448645af29ee3213da7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662J52KMXG%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033426Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIF15sEQ0vfpxiEKCZ8yf1WH9zL85Z1UMovyjFZSBizchAiAp2wbrhCIv1gOoWTYxGmhAgBIxkLzmGIJ4Cg3M7ydwbCqIBAj0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMr05X1DmfBo5nCPdRKtwDWwx96mBic21yA2KrygNK14y09zPzHdjAJ1kPDIoIUyOuIM%2Bk54gzk6VXqb0XV%2BVSWGP9ZdHhuAcaWf3TvkRF%2B7boxY7znb9lcXl0k74TxrRQjchjBab4e%2F1ZKVlqnqOebXjTXSEsEAsQOdr08Ta9dr6j%2FymjWlBLuaLtLCstR8WOPtc59FNaAAK1gVn5WQ%2Fyr6MsELaT7Nru0H5rDK6fwSPYfL6CvEI%2BYCpBwL57iis0aFN42IT1h82wm450n5zUK7csJYxxi%2FxDgeXx9tM11RGIckThi37Pd79WSIvDPV2K9ZQFciCDECfOlmZQKK5u8w7e1cBOt1RJJgqoU%2FBNaUbTcNNhACWmDX1YUPMDfrLefIhmqlQfyvbbUS%2ByUygqkmeMX5RZ4f1m7B%2FIhTzwd4FxocA%2BUA03Y4qc0J%2BkL0m68yMC2NhaTToVhRiG%2F0J28%2BHFRQ%2BKmqyJdCQYBEUk3PXWTx5xxZMifYWN7pGmORNqSrz8Or89QJu9gnPotp%2BKPxDTN2qZfQ9P3%2BTkc7k%2FDjS7%2FcqH240NhvvCCoxMFzkaOy55c1RwArtdYdVP0wKa0Zz3VCXoSgqnauCn4UdLasZfv5ChcWJowQYZjKr9INJ17s3DZZ%2BF0UPONa4w7ofXzgY6pgHDpNuQ2CzRhXUfzVhTJ%2FL0yWvQbGerm3EpcgaJnW%2Fte0sqJx7%2BJgS2QRXiKaZb88uSi9zor72bkdOCVzDgRu8x55Iq1SevMfwtNk%2FsPjbWk7v1bdlvorIpveVcgKBqlTjUkRAj7Jc0zoWky57LeyaJIWhwBGlNVyFtmdtnSk8dOsvZoYQnElx5i06stPQ7NnX7EbAaqRcIAgbUsbH%2FXXC00KiZ%2Bq2y&X-Amz-Signature=ee1e023193e3d445f922770042607e8e23049a4f7664b784c10928a025c33676&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RDCJUP4D%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033417Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIGFI8EyGuS2T0rAfL7QekdeDzMHkbB3JeVIEG7V7dZ9hAiEAzW3%2Fqjpi%2FsQARyf1%2BLtBWFzoze59a%2BU%2B0ZgMbkJFW%2B0qiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLteNios0kM0ENW9AircA3UkeK6xvWzBk%2B2xHiXo%2Bo0yU5zwJrINdYqDGGcIgYq1UU7Qkh1ndA1tsa9rIhzkLoWMtHKWKfPxU7sWn6EsYj9I%2F3qS5IkVjaUYuTu1DTcw2zVkSq4wdlCKDYj8pbn6YWymXPTYKGWUk54IN2%2FBODP0eDYIircz4L2xiY5tufBo7ZFA5foiBeBM0e8LtdMCqROyJzaoUJ96kcxHEz2pqUGbMYwAsAYIqizN08dcVgcu835CYWwMwhgr2qrRV9NqIfswkrUw%2FUHU1YP77bKFja%2BSsTnPgESTQVFdb1MsqPEOXyZj0tc2VZ5AALJGl8qw7SxXw1F7Ou0KWRyEUJ6YYJXXsAa64OGD65SGwNDD8kT7Z99JBTaU%2Fn5nH1JH4NwOZ0zeLJwrOmTKcy8dDWauwWYodO2K8EqB4ZGLhMp17H%2BP%2BIJUAsjFZPcS4Q0BpPhMt7MBufd1cHT2wres%2FdA8EDRhZQl7%2BOoQeQVGOPS%2FCIM0zCzITKjW9L0j2q%2BYhOzA35gXLOc75%2BO6v1OWnfJD2mBYi%2BUPhT4QvQUaU%2Bh0aSrrnTc5zTvYKQEZHHsrKjVfWAbpqTkQpaerRJSV5hy6U069ausfOzRm6b%2FBD12LDligxpkw4y669oNVzEfJMLmI184GOqUBZYpKtxhPVxm1KM%2FaTthl5C0iLyVaBlPxhphWWK%2FppfM6CUQSoc8uaZYz2wGhui2n%2BtsVfnAAanIM03qO27n2WUHO2NWchzPFnQUlRIXbLhDOfZeNPZmnOVBirQkX2OdrcWvUjFnw%2FQFKxy0ktleFXODmGDvHU41yYrnnsywe2oicNC54qAl552i7J8r%2BXK96DOgEe0JCj8cYqsPpwDhZUS8iE7in&X-Amz-Signature=17b6c9df7ce5040110ae4ac9286fab1403df0f33694ae6dd6140065342f1ecf5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RDCJUP4D%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033417Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIGFI8EyGuS2T0rAfL7QekdeDzMHkbB3JeVIEG7V7dZ9hAiEAzW3%2Fqjpi%2FsQARyf1%2BLtBWFzoze59a%2BU%2B0ZgMbkJFW%2B0qiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLteNios0kM0ENW9AircA3UkeK6xvWzBk%2B2xHiXo%2Bo0yU5zwJrINdYqDGGcIgYq1UU7Qkh1ndA1tsa9rIhzkLoWMtHKWKfPxU7sWn6EsYj9I%2F3qS5IkVjaUYuTu1DTcw2zVkSq4wdlCKDYj8pbn6YWymXPTYKGWUk54IN2%2FBODP0eDYIircz4L2xiY5tufBo7ZFA5foiBeBM0e8LtdMCqROyJzaoUJ96kcxHEz2pqUGbMYwAsAYIqizN08dcVgcu835CYWwMwhgr2qrRV9NqIfswkrUw%2FUHU1YP77bKFja%2BSsTnPgESTQVFdb1MsqPEOXyZj0tc2VZ5AALJGl8qw7SxXw1F7Ou0KWRyEUJ6YYJXXsAa64OGD65SGwNDD8kT7Z99JBTaU%2Fn5nH1JH4NwOZ0zeLJwrOmTKcy8dDWauwWYodO2K8EqB4ZGLhMp17H%2BP%2BIJUAsjFZPcS4Q0BpPhMt7MBufd1cHT2wres%2FdA8EDRhZQl7%2BOoQeQVGOPS%2FCIM0zCzITKjW9L0j2q%2BYhOzA35gXLOc75%2BO6v1OWnfJD2mBYi%2BUPhT4QvQUaU%2Bh0aSrrnTc5zTvYKQEZHHsrKjVfWAbpqTkQpaerRJSV5hy6U069ausfOzRm6b%2FBD12LDligxpkw4y669oNVzEfJMLmI184GOqUBZYpKtxhPVxm1KM%2FaTthl5C0iLyVaBlPxhphWWK%2FppfM6CUQSoc8uaZYz2wGhui2n%2BtsVfnAAanIM03qO27n2WUHO2NWchzPFnQUlRIXbLhDOfZeNPZmnOVBirQkX2OdrcWvUjFnw%2FQFKxy0ktleFXODmGDvHU41yYrnnsywe2oicNC54qAl552i7J8r%2BXK96DOgEe0JCj8cYqsPpwDhZUS8iE7in&X-Amz-Signature=c8770a1f046dbf7701aa93166a3424655189374a50c1446381fc978029e5cde0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46647CP77NN%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033433Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIAWGBDL1XniqIXDwcwqZhKhpLnz%2BIULvD8QJ1ij3BWVoAiEAofOaOwl%2BOMgwZh%2BEa1O3HGaeqcIBB3WbSMcLKwd%2BYLYqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBIZBxwhGicfDwiCmyrcA2OK%2BTMPIRrF8OZcHztMHPzDfWeqBtuTchmqTl7Ru%2BYLZedr73ZajJyely%2F8xiA5A4PwyiR11o%2BhapNmbJPSSLJGTLawSgmCQQPhvCkxZ0UtzY0LU1gxDd0Xckjb1G8pzVCLX9YR68mALlB7WvuHl7U5xKIUlNjuabrpDL13tf7X56JpmvclY74BkB7w%2FsPSbdtw%2BAVAqAre71VWJFKjzJdozVFTZg3ZE954g%2FmMWN%2F1vIEl0eRJ%2BVN3FYtuU1JeF3Y46GaMHHTTzUv0yXYR4c1JCbJ%2FTiYjS5dTC5jx6SQE6%2Bm1ICoqFmXv2p6a1GpRSm%2B2yHGtmtrpyxjaztycknQGekdthxOQG0zQBG%2BJb9dlPfdFBq%2FBkHmTf90LinsOffUCLzd0LzBx%2BIpjK04Hf0KWdKMV93bEFh8sC8w1cJohsh5EtiS2RblIKgZQj2BpDjObd3Y3Wa1dzna6mlcYUAEJ47fxMwOmQfq9CYT2SKKHv1qeruCkMGQu%2FZDcn57m5OHSsVnt2fiKEAktP6CjKKqN0WUYj55nFf6yrq7%2Fb2BZKuab8qIWXTML9BQcDzIgt4li3pYJRD77o5fYRUIiURcO6FkHWG%2BH0Qr3GpcUpNE7RaB4X%2Fk7HsG1znEuMPOH184GOqUB9ce9Z2PO3FJK%2FiWnLOcjmw4gnSGsDD7d9YUmUTgHJyniS%2F8Z797bspX%2Bo%2BeoV8WzHmfcEVof%2BYY3N1JyT0HAaNt6YoAncu3lTHycCzoz6%2BcBCuvcy7TM%2B%2FgWZWujfeua3xjnozEFb1gg9GbDeED7eFYm429XpYfMaVijUJ%2FMVkzGON7W6oi5RWKvx%2BSsfld5bO4M%2FEEtEI8UNDRtwPOCiP04LSWT&X-Amz-Signature=982328460dcd5feb5839cd47106be1f64814029627a1c869b40eb9f1ebb96828&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665IF63TDQ%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033435Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQCyL420ySRmxqA%2FVb9DFc25EsEcYVb64y5GdvWLNtJiuQIhAJPGLhAZf8CH5jLVQglhNN02kvD18J%2FAF6KVoYeXKHpTKogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyqV4GvCclolu0mn9Mq3APSRL0ZaBnwS0x7bmfZS5AgTJIPChYd7ol6%2Bo%2FCtbJTr0uKzU1F4RThER2z09zdPbbMrkzwGb6xZz7xgYYcnytFUVAOIifLk2AMmyk%2BzA%2Bbjte2GFpqRBJywWegQgczPMcsBGiPgHYGxWqwFWIALtuYflORdprHYxm5OxceJZHO4HjpWPz5ydj35nETOYo%2F89izQJgJ52%2BljPISCThliQV8hzy0SfYS%2FYKSZzaFeoZjZ1H%2BWqOwXCJwGfUVPBIGqxjfDt1jdr4vjx391KGFh8EcFuLGxBYqBBduwhg5BDY4HQjAEU%2FqrUh7P%2BlqskpzEekZfgxEusUyoyccVOLqJj8o2eOQaB33zl37yH9jFvBsreRbzRuLxGT%2F6BOV39nx%2F6CVQjaltXDVUtcLciVCCwFmzk0KT%2B9Cyreh%2BvuOuk7G0i9WduZzrU5Ide%2BqXODRj88%2BF55xpJv5RZuKNmc1jUClT%2B6e9rNtBJGJJ%2Byh2ESdHrsgPhUK%2BwOSmPdrw5w0P1qEWcNr726Fm8DqOE7dkHcRqSptEDjsSrx653c%2B1YTLJOxP%2FHAv%2BGSmU6L2i3DDVbn%2BFHpobG9DPOU6AVdpTRTgQnOusRoY9JBu3mGu%2FEL92%2B%2FTs65v78LzpCuVFTCCiNfOBjqkAfJTUqh0OxzBP1dMIe4TUrg2EEBNbKVZQNOilqhZYmRMXXpA12HEX1haEFQF9UahtcJ9FvWUILX0%2FJ%2F1dhmnqlYuTO25w9jYymU5yOZTQf5VwgVFsX8s4GUa6HNsCD%2FFnBAJSKabsTU%2BgPy4zIEkZpH8NJRz7D5TNX566zn28X5rtijYrDktytLIKTdVkZARWiE0lWcXUwb2hBCrSWLfuLnfJIbm&X-Amz-Signature=bd3d2517911cf8cc3afc39be7ebc7f489d8ecf5d1dd296bc10a68b5dbf1b311b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663477FKS7%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033436Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQC5Z215%2BGi%2Fjc1wPb22rpLrXRot61uahAS2s%2FFBWsigOgIhAOXRrVZm957ocmLoXa9E73NpLySeFw%2Fa9FlU34jRNvOxKogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzYZxl5GBiblw8u%2FHIq3AOOXRxodCff1dOVO4hvKI6hS0FrmUNRMRkgll3y94Jd0VTHfVaE9Rp6j65Vssm3a%2Fuk%2BTu33UWkwzC7qicrV%2Fe4pANSZUKE8IufDsoGMJ2ZhEqj%2FXqJ9m%2BcRp0OMtjtYNMq8OVOmGJXL98RPB2zRSfNBLFOL9yRRwXbLVhSLQ5q87NXWpU8naT%2B2IHcserahMtpoleFtQRusS6wm4uNE3aF6Y8davtTWfU60qS8eivLrWtP%2F3iPRtjNu1HP3Lk%2BVa3df84qhPzn76PMWW00MHvnzIHMHNGI2%2FBH5y14JIgVikqwxhmvZA%2B6imPJ3Z9SebMml0FTsP2F2Z1a3y26agCtCUXK9cK5ZgXUynup0vo%2FSHcWJFh9JhoGu%2FWGgPdB5wb02qpQKmv4FtFd9hvzLzgWbCNewMQNlcdT%2Bu1bmInC2LIQMb4MQYgOh7%2FdexmNK4qtxUoxZPTqW174mzQyFCfrtQeopzYZ0mX5%2BclAfUtmDIqepEK%2BdUcpeylx2yk4VKqQqs9lYOJVWFBeip8rYAuOfojDh4VH05UOctwIGjlBzI7tWFnt0rMq151dRWb7I%2FPB5Zult%2BnEzlYGmR8MNyYlA4vwful3OjXoa1dm7tZXlCLHkX9wOBDxoYmCiTDpidfOBjqkAcs9BmaYs77hD6o8ymOp1CKDPPCN2DV%2B7Sz65mqcXsJkfAoBAc5wQeCnN%2FxVXsrjbJF9gmbSayPXgysReLsijGLsKSY4K5z%2BgHvXeStt33ycZNTuHlijdnGt0PDhd%2BXD%2B6enUCoccJx1lfZQmKsTAxX34rYh8lD9YLQqBqrw6I6iE4h1dMi4P4dNlOMC5BVP%2FCWkR4v8TxGXUdg62JbhHQDHEIB7&X-Amz-Signature=54b1e1471ed38f8ce8c2fb2913bf41fb11cc8951fa9c52788834c146947b5825&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y7Z6J7VM%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033436Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQD5dQsjuca60l2K5YfwBv8nskOkgWW7viTbVMKa5eUP1AIgVpSGbfOwk4HAU0GLUyFaSeKCSdHSEafni9LFmSmY4%2FoqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDL4aFytjQtU69BoA0SrcA5yhatXqYJJbzdvy6v3JJeCyPt4SlraWWX%2BqFNXLJKdpI9WYrNfpjkfxmfTfs1j9tOWO5rScDte1tCfyYN2ggeJdSshids4ujtppZFho2b1yMRKE1aJstCVvcpIpY5j9omoq7dPyK2hkyGLx2taVoQr1%2FbrrcxKpILQUtBJd1jkOsGqO%2B7FHOjoGoqsRrga2t4KRon3oZm8hNLzKVIRmanQ8giBE91K9IiAegCNipiub94m2UQgpg%2FLzTk0p%2BO4qhO7NOCT%2F%2BsotDXcan6MBI5JzrPUIKXRLUk8wl5cJ9Niur6Y3trKUH85JbUqYEv%2FdVxSK%2F3xT56AhTgo8EtxnVZfJSc%2B4qPsebd6iiTHUFZ3cXvpvJvEwKV5hgddIPIysxNCjMXQQw7oUpGOSt5WAzF4JVGVgTXl8DTt1EjtjZgpsWePX2xAP9hnSYMwokTKs0QYijhx6xBAcNvh0ZLtrIzMbrNdD3q8nDOgCLi3iK9RlLCxmJ7BVaxDoXtaa9TMAacscRdnLtDqOAs1bW9bBtvdxnjev%2B56AgGrrxKnLro9DgBKc%2F9tglA62Vup89QZSywO6%2Bbs%2FNHMRDbbPNDuYucUjLJKBVTHmffrvFH8LtbD%2BGT552tRMd5K%2FSPdfMIKK184GOqUBXKPVZDLBknPvePER7LJaqhgHxAx%2F1mVhMcRIAx%2Fl8haXU%2Fpv4%2BQEpoC2BXJUse1N32beRet%2BwceAHw%2B5mEAhwXGTcATMR06VlY7Sa5Or0%2FyrArMWiEQcQexUbt6TTsJHopVnI%2FZy5h7pTVYWvTIKc9lhxDrgPZpcIfSNhH1LrBc6KsEjVq4J5SRDv9xWXYCzO%2B1gRuAVbSH931XGFFGGejGV4zYY&X-Amz-Signature=ac667d3319a70d58a716bea4f41f52fa716a0d86adbf11226cb2dd9d0fabd901&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TCNDH2IL%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033437Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIC%2BQszxP1ed70bhy9JyPt0hW%2B1v6SWe6MOrC7S2vpHp3AiAlIxlNrb35ihcwF5HhGVSobC95GUZ%2Bsk0VCPpfg6PXlCqIBAj0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMFf%2B%2Bu9cBk2gs2LrbKtwDn61OtAGHfOhmFLCNhH7sT89TyDxBqmq1gVqDfdTetIlsgDlJBUMvSD7rPSibbvtMncvwXIdHJcWWdpkYFqO37jSP5HnPN7L6GK2rgU%2BjfzcDyVxMq13PPLFob%2B9yBSAtlR4M%2BVaF%2FxXsaGd2%2BWAgzWDMji1CTMjXcer3DTW3n%2F2BEW862FN92mFftkPJpb7le%2BjO51iwR7a6%2Bc9DL34bfEAm%2FCmfT4zNYvlXfsG3QxXevtVjr3KDU9Gdz%2BeA9ZVHSSSJLaOpii3ivQoluSnUVcYsMBdsHQqeQ%2FDZVQ1dgCoxlJtW6mndXipKLl5x3j44cW%2FR59euY1rKO4XT%2B%2B9743WKSiYGK%2F%2FVKhJQGHVjN8gmjYvuC9ZX7Xj%2Ft8y0nwVQuWsJ92MeiG66WcO%2F%2F5Px6x0mqDPiEOb7zcrM8U3PamH4OMHkFepX0E7%2BLo1ciHHY%2FlPEWlsz%2FJUUzIpTH%2Fm3ynE76O3anTBfEdrfVOBZiNDaThPOO7YYKZKrBStl1mK8EC9SbukF1BLq9fS1rKbwUBsPdO3pOG1Jxr98UiJiDyryM9WVqjTVCeH18llxjvQLCrDTu3kzzedSnFHDPH3GoHgXI9nAf67sGOGaSsTCzYJCo425B547FZMDtTMwkonXzgY6pgH%2FXYaWxwwZLLc9IUswfSsxnP5rZtdpzijAdNMQM%2FBSTQ5lMTCoM5uxAYiAJnUSgsnGn5ba%2BIOWTuIa3gAmAk7AqF326v7FTh9mHFJuDOgq%2BvT9p7%2BP2P4xLhTLPGzlUmsbMxw9Q6KQ5uy8cVI20fQne5FTyhJ%2F05r2euyUrJgil3kQ%2BHtOHfVcyqqG5A1ppC1BmKsa9CLX2pi5%2BS0XQ0B35OfVtMvH&X-Amz-Signature=921be1b144df5f33a28ef20ae8c256d2f1dbb5133612f83d147a514e91ce42a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RDCJUP4D%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033417Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIGFI8EyGuS2T0rAfL7QekdeDzMHkbB3JeVIEG7V7dZ9hAiEAzW3%2Fqjpi%2FsQARyf1%2BLtBWFzoze59a%2BU%2B0ZgMbkJFW%2B0qiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLteNios0kM0ENW9AircA3UkeK6xvWzBk%2B2xHiXo%2Bo0yU5zwJrINdYqDGGcIgYq1UU7Qkh1ndA1tsa9rIhzkLoWMtHKWKfPxU7sWn6EsYj9I%2F3qS5IkVjaUYuTu1DTcw2zVkSq4wdlCKDYj8pbn6YWymXPTYKGWUk54IN2%2FBODP0eDYIircz4L2xiY5tufBo7ZFA5foiBeBM0e8LtdMCqROyJzaoUJ96kcxHEz2pqUGbMYwAsAYIqizN08dcVgcu835CYWwMwhgr2qrRV9NqIfswkrUw%2FUHU1YP77bKFja%2BSsTnPgESTQVFdb1MsqPEOXyZj0tc2VZ5AALJGl8qw7SxXw1F7Ou0KWRyEUJ6YYJXXsAa64OGD65SGwNDD8kT7Z99JBTaU%2Fn5nH1JH4NwOZ0zeLJwrOmTKcy8dDWauwWYodO2K8EqB4ZGLhMp17H%2BP%2BIJUAsjFZPcS4Q0BpPhMt7MBufd1cHT2wres%2FdA8EDRhZQl7%2BOoQeQVGOPS%2FCIM0zCzITKjW9L0j2q%2BYhOzA35gXLOc75%2BO6v1OWnfJD2mBYi%2BUPhT4QvQUaU%2Bh0aSrrnTc5zTvYKQEZHHsrKjVfWAbpqTkQpaerRJSV5hy6U069ausfOzRm6b%2FBD12LDligxpkw4y669oNVzEfJMLmI184GOqUBZYpKtxhPVxm1KM%2FaTthl5C0iLyVaBlPxhphWWK%2FppfM6CUQSoc8uaZYz2wGhui2n%2BtsVfnAAanIM03qO27n2WUHO2NWchzPFnQUlRIXbLhDOfZeNPZmnOVBirQkX2OdrcWvUjFnw%2FQFKxy0ktleFXODmGDvHU41yYrnnsywe2oicNC54qAl552i7J8r%2BXK96DOgEe0JCj8cYqsPpwDhZUS8iE7in&X-Amz-Signature=95b164edca2c16fa60a4dbc276943f9db7e5d2f311a912ee417390dbef483f73&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
