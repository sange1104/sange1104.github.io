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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ULTRXEVQ%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035157Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCVNxYwBP4lVpf2OXyl2CgCObC8XioqU68c%2B91NTd8ubgIgIGXuLoQQNZjAIvYI63917PRoSZmxHNbLu6GGoSbYqywq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDHuW2tA%2Bgkk%2BRVR27ircA0lZV2WfEIXM%2Fp2B5BNTjF8VdhaPGeqhGromdQOvGh%2BIRHF%2FefsZwZNsExN5lHSGbnXmktA9OTqMoGmJo2YjzaBmFcpaN20iHpMm2hiJKAG9alrEeGx1%2FXWXgm0y6rwRqG1dulewfl86aOfkHZ51pZSG2Bw3Y6Nl%2FVaDnyMdxz8oi64ulylXM%2BzZAh6coy7ZWWtL7fZl%2B3JhkwOsoExH0gp7X%2FkSIRt%2FtlM5A6A1r3mqllM6ojyxIhQoqqjlJ5V0ffyXyfK2o3E%2FUW50YjFxtDpH%2FqtUTK5l8HLWblTqUl4lpPTkjgZDPdgDqj0kp8DXDrbWuF2C07abF6S5CIAntupLKJTxYlYwKQi4pHMZzxM6cVl%2FGj6nqKAXArLJRWpgYxDyi9NOqGKS2%2FPkYARPWRifMmfYELAj1h1HyrlmUH%2BUF%2FW7Aj%2FT497tQL1ew%2FsefmTAgtLyrcHnOr3w9EvAIse4VSuqBsBWC4mauSkJ3F0OdJBdU1%2Fee9DhLMcocJKUAZ66QVN0MXaAnQndS1kb6NhE3MJJCIkXTIfiZu9SCPtxGNz28v%2B%2BHiGGkxlKaVIDRAvC1uV6qVfKrGmGpCi9aOTSAfinOZ3H2c6bM1lhf9czVvHdGemExIyyc0wEMOmm5c8GOqUB6lFJVCnjsUsTNld5BXCEBVdgY1%2B%2FPbNxYNBXa5aUzAuhI3%2BNPbMH3g6tqdgKFRwYHAjHLmnWcWKbiS297olxkdIqFwKdWr50B%2FVYxeJx9FGpkpvhStQy5olpQ3UiOsnR9ogPWe%2F7uF7Mfl2AeVRMjtSqy9AIgfSkVKoOLseeTi4KBoXvtrrh5131uh7xvdu4EIBsE2L1kSv9jMS7CgX3ZV1aQ6wi&X-Amz-Signature=a07ec7b3aed47a52ae5a7e25cebe620e90f28059ee43c050cbaf0ed29a1503fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XF37NNF6%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035157Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAh0mo7ebF%2F1TpxWL7i%2FvjVqHVSYjIoOtXmGFX8G6VDtAiEAisZMQBO759K9ZfpSrxg6FnHwkknXffCWrlZuFTSEKzwq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDOntHIWyCJNPJNwBeircA2Bu26nVAJSJsK3%2BZgC6NFWrrVRxaWkz%2FpKcybhT3wigGOyIhRvd%2Be3avSHEDKnkriyxHsVVn4atwFfnjgvYRxFp92NFxSM7ZfuPm5yllzca1r9gIN1ZlMYZ68q39XinTdCenzrYWdF4yBqO%2BWpgb0nWh%2B3PyoTwviOz7ZRLNskpOmY83FBPp0F7RsHs9uG0XL%2FtoIl7yZabpeU6AqOpQg7RIO5NuQuKlSsakvoPdVjh9hpDYKxEMgFYqBM0NDjhv63ka4O2mn0GePnQ6LbAm2VzY%2FnsKPS6cct7L3TWAU%2BltbdqpBY77CKcdo4VAVbAvhEP%2BB9uWhV%2FimHWgAXtRUEkkaCnDur6SLkUVD9Rj99zPlz7mKoH8x%2BKLGEsh%2BGJxe8Gac44wNx0sG4Xwnpvc0QT5mDIL%2BaeKRp3QlD1OT1tclq%2FhInT75WmwAGs3ZgPVcRX3slCoLj1CMlS6E5DcHCb5RHUIcDVqL%2BI6uv8Zt2vAI8Xf%2FoaGk8Cn2WvT51UVK4WiuUnzifKonnbC9Uv1r0hnjV29Rub57JCmTGrGEay%2FV4IH47EaULll6kxF%2FOWuNDMUMjhg7PpB4s%2FBlgEpxnCJEvNoynyI0GRXkaH3SRtrlbQ6ndyssmUUFOiMLSm5c8GOqUBCLFnPSjdHVOkaQ0juaTBv6a3hzC9wqUl2eceAQ2IhOV6cA0YRklQ98Gs2uas5VJWMXryqBTs3KLSMQD6sk75NtQUw1H8j0sfY2Uf3%2FU5HXa4nsZvReJwAZGDZlK%2Fmd3%2FwgP2SCaWitw6ZI54WQx3wMcumt2WVEmo1ffLY6A6v5S9lFLbvOnZDJ9%2Fo8vpkZZUjoFVCr2Rv7291DvE2ON7CNXJu3wd&X-Amz-Signature=4b87942403ba6c70ca669d027e1a9bf2971906554279fce6215701f37e2eb203&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XTE46BJ3%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035153Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDmnAzV8HvOQ9moaUqEXi3L6aBgk7703j%2FDyzZA37K0dAIhANYCI7AwL53sQMDIUgWuNHjQm56atnNJPTVAZeVg5w%2FCKv8DCH0QABoMNjM3NDIzMTgzODA1Igxci3sKSUkUnTTXUr0q3AOpfU1u4UOLRlBkfmfin0MaT98cY4L80NEBWJ86TGrGrnCZU0jLS9pd3D6ymwsG3xGa8WSjh9iEwyLxMRduLsdPYvZyQCP5%2BYqHcVW%2BFcwgEg3YJV813Ux3BMvd3jFvTwPCgrFdwJ6nhe5H7Ka3XjQ5vHVpfbcnY25tIotFEplXRM1ortyf9Ap4Ocx2eqdrqq7STPZSJm3QcGIY0%2BGz5FhaVrTIecG6eFWhhVFO2Jt6I4%2BJg9vB2xcRwYtUkchRt4OcJnc382THhAFUyKuT42aBsn4Ro06sk3w9Lki4nLq3qVbL4gjHeqUR4c7FKGv2rS5lty50le1hGcyBuvounVSSn5MMr0oWO61hddWa%2B2QzHdnEcx0jyTai10%2BGYI4rTLFfP7pW%2FApmbiK%2FyjSg1RWT5lxWCaYPxpKDLksktfFhKKI7zSRjajHyQBOjuci4YDKNvD7DrtoxEgFod%2BM4lacoTW2dvTEBJD%2FPkWMejuB4pGqiUH3PSjRQ5Gv1mtLpPgG%2FSg1v3ZgtDggegdwp4kkyqm8BYxKeLWAfb8n56i5rREn9FU%2F2ZsNsDum%2B6EPZJ6N8zP%2FrKMvrHzXvQtRjKGlaGdrlVsbCV3Upw7zZ3vz03Gt4f2oocjYIY198HTDWyeXPBjqkAYPTRZHrzns4IJQk9ffaYph783k%2BKr0cdnglv6mx%2BrzmJ%2BnCvjV7PHb99wPWkFaZMRxm6G%2B%2BgBOhJ6hGvvGnNqi%2FcCZU4vm6D7DL8JDmWcp3R5JWAZcKAsf7TdGVJm6GRZSLmgd2S1rcWCTwEu0i7O0x8EEupeoJjx%2BSUmNHjE9BUbv0foQ7j7KOI%2FC3ePGo0Ta31HUzxzhNvE%2BpPQ3faRhdCiiO&X-Amz-Signature=4aac1a652db042dc09d9122a52079d8b563900823708e51714d54304b83017a6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XTE46BJ3%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035153Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDmnAzV8HvOQ9moaUqEXi3L6aBgk7703j%2FDyzZA37K0dAIhANYCI7AwL53sQMDIUgWuNHjQm56atnNJPTVAZeVg5w%2FCKv8DCH0QABoMNjM3NDIzMTgzODA1Igxci3sKSUkUnTTXUr0q3AOpfU1u4UOLRlBkfmfin0MaT98cY4L80NEBWJ86TGrGrnCZU0jLS9pd3D6ymwsG3xGa8WSjh9iEwyLxMRduLsdPYvZyQCP5%2BYqHcVW%2BFcwgEg3YJV813Ux3BMvd3jFvTwPCgrFdwJ6nhe5H7Ka3XjQ5vHVpfbcnY25tIotFEplXRM1ortyf9Ap4Ocx2eqdrqq7STPZSJm3QcGIY0%2BGz5FhaVrTIecG6eFWhhVFO2Jt6I4%2BJg9vB2xcRwYtUkchRt4OcJnc382THhAFUyKuT42aBsn4Ro06sk3w9Lki4nLq3qVbL4gjHeqUR4c7FKGv2rS5lty50le1hGcyBuvounVSSn5MMr0oWO61hddWa%2B2QzHdnEcx0jyTai10%2BGYI4rTLFfP7pW%2FApmbiK%2FyjSg1RWT5lxWCaYPxpKDLksktfFhKKI7zSRjajHyQBOjuci4YDKNvD7DrtoxEgFod%2BM4lacoTW2dvTEBJD%2FPkWMejuB4pGqiUH3PSjRQ5Gv1mtLpPgG%2FSg1v3ZgtDggegdwp4kkyqm8BYxKeLWAfb8n56i5rREn9FU%2F2ZsNsDum%2B6EPZJ6N8zP%2FrKMvrHzXvQtRjKGlaGdrlVsbCV3Upw7zZ3vz03Gt4f2oocjYIY198HTDWyeXPBjqkAYPTRZHrzns4IJQk9ffaYph783k%2BKr0cdnglv6mx%2BrzmJ%2BnCvjV7PHb99wPWkFaZMRxm6G%2B%2BgBOhJ6hGvvGnNqi%2FcCZU4vm6D7DL8JDmWcp3R5JWAZcKAsf7TdGVJm6GRZSLmgd2S1rcWCTwEu0i7O0x8EEupeoJjx%2BSUmNHjE9BUbv0foQ7j7KOI%2FC3ePGo0Ta31HUzxzhNvE%2BpPQ3faRhdCiiO&X-Amz-Signature=5d4ec5c6dccd3228c345c00015d10acc29244bffb7972aa524f49fdd51c52391&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SSKOBM3L%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035201Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFYVDsakTns2TNgDruHd07E5vZb4fx8dPuQiHIz2bnMrAiA82O0RkprmN9za9z5ERvfpSUMwWIcww%2B62XMUMv3d1ryr%2FAwh7EAAaDDYzNzQyMzE4MzgwNSIMWCG4nyV7ZDg9zonkKtwDchwr0IbdZIaNzXyi%2B1TG3UEdA0gPMUlMkmr%2FrnJzYg%2BL1pfSkvYzCzY86U0p79XNRCB0NIas9CIBWyiWSzb39voHRgVjbIr4daLqG7n3QbwtkRcE5KA7wyN8tnrgVbVRAf%2Fh9UfMX2EpsEoHfcS0AQr2mmq0xfWWBWZ6av3OhDXySMy4Chacn9%2BXVeSTNmJGhJgxwetmKXEGU90hyBVGt%2BNq%2BujjpTvb1ggUwIVpgvONDQW0vMgziT3fBxrD2mKD4miYllzExYicP%2FD%2BPDRa1kMNK%2FsvcXf7oRRW3MuTATnUbE%2FnKN9yRBZ6lNIqwea706okuoZK0fDJclBENpB7AhxULpLfEJ58x6sPjrURWTU10n%2FtrkaO6mP04VYNvKObhnprA1JO5v80QUkWqvY9RDzVKQxi3xFsWcQJinPA4uUUD2nFU9tu3RghWhOEIAtzPYJzcicwOvJAAte9tQNayd2y%2FMIDsMj996iUZ%2FBEh03gi%2FWovcUuYHfPSOda1Y8iepSXVBFIY9psxFJ7BBRsL%2BAxPwu6d77rE2dPB34VnqxWC1J8RgeE5uVDMMdQUEmKxdqCwQJ1azPUHROHLb6rd%2FWw5Tq2dmHUI8jAr3HUziG4Z%2BHbHf%2BQSoNi7Uow6qblzwY6pgEj9DVLC4ZY8E2Dynucjx2iFjWBI1PzSRkEz1nCOxGEjscD9hH98XGC5Ms5rKFjeftBM6gua74UI8K4uiBwC3NhqIfOTKFAPdmeJeaxlBU65aF5s7jmfTG1mREa6rKfboU26mqmEQy3hbRUPX4HW2LCmlq0Cub%2BmhvgtXs2LGH9M%2F1l4wAZM3HhKTBne3MURwzM7zeavzOweRA1I%2F5hdlxaAheItJ3B&X-Amz-Signature=68c91e698e185a9eb9d9c527466c2e44a6a40efc02afceefcce623dc579bcd11&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q5EHA6C4%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035203Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGWpT10F0d5P1busR6L8kBXIiE01tPNlaJmjyJO9nd2kAiAno0rPb79cdIlamEZ1CiWBYIk3iXDP4PF1YM5psPZoMir%2FAwh7EAAaDDYzNzQyMzE4MzgwNSIMAgbBjP0ZdNhyvpdeKtwDCnnbDviC7Ic3VjNw1hKZ1ciS5MzhzpQ2aQLv0kP%2FgkIUaexJTKZAGtUkMzabCAaOmZgKjiVvr8aqtT6wdbVdwjqiIvie2wOgV%2F6JUK4DjphB1hwrVEWZg0%2BlH6hNbjOSzqMmWxOmfyhrKZ%2FZ0vzbD2lj6nzBvmOpFcueHq7WOlS51EzNO6uhp3RBB6W0ysgpUyz2J67DvG68fk%2BxK3sfDVIlT%2FJzCf67bc7RJVbAcSzHq9U5ifA6S7uhX0h%2BWWmhq0%2B%2B5TRlzNi5T%2FjYb6ZxWEacmr5bSU9Xc6P%2FC0Uuf68VhcAcmFad6Cd0AKOTmf1FWkspP05ZB9katCwJnx%2FwJygx8d4gJOhUqgxisVzHc84vJmVyzGIMLdQj2E8pVMRMudgXUlmHDXIGmM5ShKEAl5S8K8QpeUcFIfzenuTYj8nA4oopOTduOkEOSsGCpqpXnKnAG5UwEQyf%2FflrndUY%2FMUr9iB9G8nWbA1beQbOHnNE0g0zUSGWnmW1zQaKXuNLQCE7ZWUNAXHrIcnHunoFdfZM5gpKk6IWYzDX7ia1OzN8sejf4fIXAqP9qxPcd5Ci37lJ0zgZQzSSG9aoFnZ8qVUUcNpp0GD0ebEjYR4GwM3%2FE5NYfsQO3PpXzV4wuqflzwY6pgFJLCOYn7KTxZntJaHFvpboCua51EEOx0vEwRVOnO6zb%2FPIdr8V4pVQMMsDyN3j%2BAxrH%2FZB6q8Zcx2prN%2BFb43tSN%2FkMZdH9LgrekjhdFM%2BEKLTTx9AE7mr2GiZAMuyfiD3SbOY9Mb4SmtE8MKr3FDpd4GarJ1FBKj2DKgIsQcbXgOx%2BiylShcLzKU1QYMQ38MouIm9H%2Fm18TfTpe6TAQ5tpdB%2BAuiH&X-Amz-Signature=19de3bc46689697f0969531c6bee149481e920f21bd73c4f21ab536399a17a70&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z376GAGD%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035205Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICZwG4cTfiatRy4%2BxaChHk1ocCtZSqn2L3f2msWvfO1YAiBE38bUyuXJlbslqcmQqaWQTZzrbLYeSbHpEvYTmKoWvyr%2FAwh7EAAaDDYzNzQyMzE4MzgwNSIMwG4gXdiu2i18oUeLKtwD42%2Fj4FXDjRikAjUMS9g2wM0CxoffaeWujTUpY0fGgKWZVLJdGR4S3FeAcSuLGUOGvpze0%2FdrQ1S5nAqT5eoYM6JdhkqeZW7lWzo4KtZ0wbfViNhioOArHLqYfYrEcGB3Uu6HSRF69bvKSjkuuB7KoUlb8PcZmb7d%2Fycg5N%2FHHH3oCIbDkkOQU1okryvNPVyvG1B%2BJLrkDoO2Q9sMfei8o3gkkuZhJ%2BL2TUb1ish9nGoBHFUOw9aZIg%2FtVM7xeifp2xRhFPJ%2BgPmXZxxqnOodlVl8FNJgZR3qP48mwNstPdCm5knwBnJjGYD03KaYP7uRKzMnwDRtuPPmeX587bP95h1pIDeeXl0ksaSSOWVcwCPfrpKKSSvdmE8zhsnk%2BQSjDjmc6sWN6I4wppHNdd4sft8DN9gJppWb3dTZjDhxQtBcp7UMP5Eh%2FbS1pmBIqSLXBCmEooCo0LZe7yUnhklLdHp6n3gmPfI6%2BHw7jM2Xk%2Fbn6%2BKRO5tRPzXC4upD9MKvT3Tk%2BDpPGmH4E03wInAdCOrU15bO0dJZ%2BXXSF%2BfDfRfRwzRELDMxIRrnGWjtdeAgTPykxQKwovbI1eYbztvlMKa%2Frzb5C5bwcM9Ym2Nr7wENvEbZHPkYmJTgcZkw6qflzwY6pgGPlSkjagLPYYvLU8P68787OXB1w0dNFzWlwLR9A3wme%2FftTz27t029F%2FAeBRDzlmYNU4KUFCVpdzPywlRQMDq%2BsduhUHD%2By%2B220moOQlySjzBajCnICApLtsbBuwUXjtO%2BgPHM%2Bu4aV0U%2FTSBOa0IjzaTsNCHProluyhSgcz9XulhaJoPYf9f2w7yyZ3i3CIxbBItUlAmoaAY1qEPg4ZSyLoKrCgg0&X-Amz-Signature=2c758d47e6f5506d554e9733d768628970453cd558b55e5f554895d0f6b4f24b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XFUYEQSL%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035205Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCQyq%2BUnVcJSVgEfjP4XrY7Rq8vF2TWkCAdhujKYiN9PQIgAQ8KPDXRjd4aqOKuiDRSMNvMksOKZ0zB32YL8lNgLokq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDISbYgfmOIUl19eDJircAxlQkc8c09FA%2BWJ%2BvLk4w1LZZ2K85CTICNsuIlisLlfyKcytW%2F45iVwZqcfogIaFVqXLQ5IAgX4JXX6A5dB2TaxDDOGM885VN0kMqarKJj2t3nmA6mzQuEmdB0wKernZcSLwKZU%2BJyqeWBUIG7cOHb6dockuJjwy3oYwixK3e9khjekMfa5a9KcDu2z0v%2BX%2B9H8gjWuQikk1U7V%2Fzo616ED2lUIMrxAuNI6949%2B8GtqPfkb7eKE8T4JKvIoTzrVb36y5%2Beh38RcpCuEi5nwbrAIKprS5wnaCXbf4Cu321n3ROcZa%2BUDUINShUjJ4jIpppsPtHmmXm69Vd2g0JPfaDq5kUzd58vTJojBnTZhhyuH5Pce1n2QJkgn%2Bjv4Y7np%2F1iUJuquh8QOURvSy23LtNgU9Z70LItyNXecY0HmIggD9AmCZJCJ4dpxx71ZZbyTZUPzhl5sJqBaSw1YbkkiZsTUcucQsS6FDY76BUzOTuwfLktrwP0RfhNyQh4VujRRsCy5K5iTNVFJp1WCIvnFd6VdN1uwCyJINanpveO6ekl2xUo6rhTLEFcAAldkDUwpCc5oXhmcI%2FWykUdMPVmstvlzBvsLrUj%2BG32RZFySRhOePv%2F%2BmcYQAj7qT9OFRMLin5c8GOqUBNmtWbwx0eep9%2FrDC8ARFsIw3qk5%2FRdgZ9yx4JwW6f2kb2kzkzQ5UMaZlgQLedAMvgZKXPIn7%2FDyYgrp0FnT9smmuLJxz%2FQmKCZpS6I4h%2FdKM7ehF50GOCWr%2F3Sy4QyHpMdWSaLmmDKKTCFz94MaJDZ%2BvNUsMotQ0uiLNeN5%2B8W2CSkCmoh1l8wPDO5EBQXqaurHvwt8PLZPB%2BNVY2duPM9rV%2BZG4&X-Amz-Signature=54712399661c59886ee11e8c69298527bbec13b2d552bf303aa5188d496e36cc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U22CSO56%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035205Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD2bEsOP%2BTPRHIjVPceZ7YehdsIvhGmaqIS2aThfgEvrQIgWjt%2Fdv16O6%2BGmTH6zipBq59XqDTfxltk%2BoXU77vLFMkq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDJCZ5PYYEQXhIcNUPCrcA%2BablnBai9qK2iuwOLRKueiPCN7BngOWYm5FGZnnT70DLIeXZl3Rxv8flHNqm5IJoXTFwZwFPXdWJXOYgkmpxVP2LbL20XUxVMcNC6VMqoW6JO%2FBLz5G0p%2FC%2Ff8Vk%2FEXjgW48oRuX8MvMd1%2BLsKnEYrJDLsfLzx430tp9rJpiuOGE1mkCxGoyo2T5%2F0hzGVFpc3XDuV2LgYkqsvFv4JfdooO%2FeLrmq0cdXiuk5e15GQE3cOwMXsqaK8b%2B04EBjhhYDzoa3SMAsQUbLaEk%2BIKppMIX%2FhkFQKsecPkjyiUw%2BNBEuhPZpTTkb2qiO169DUD%2BJeIBoB2q%2BsQjeEBfnDE97GEaRu362aoHFqwx53x8kb2mlBVyV%2Fb6Mm%2BYDr1O4d9SYvOfVJJ%2BjavBpXkVMeGwFNSXCAc5xhXClFG36%2BXyxABwNQ4ZezZcfoVI%2FSKqqkKcNP%2Ba3M8jPoZIa6eRj7OhLaCdX9qQIxiHZzYlZGn9PRfPPj699km2ZJdbjjAUPLPZpAasXgAUu6DryQ%2FXtOdZ2Y6eb5jF7babtdAMIdxPdK99SNZAGAVHHC6nS59slYAvpidlcpv5bPO9bFlpZxDNPT1OE0e7VDY0NcFnqYZ7W3747EPv%2B0TTK2rFaMGMOyl5c8GOqUBC9w5plKEJ39zZ8cjCqD9lskETbtjtZBGbyaTD58KpWKcDmfbhkV32m%2BSxvoIF8%2BPLYEYjQfByWqpHka9JztPo0KDeCe7F6KUxdeh0m8jNsIgGG7m%2BjG9vMx36izsSjP96BvoSvx6vtlp9N1X71ZGzq%2BPEVYCJ2te65wa6R7a%2Bh2Sfs4ph60CHz%2FLWMv8WHjAN9Um%2F8G2uSDAzaIGwQG3IYt%2BSxML&X-Amz-Signature=a3b6135219be261361d18701fc97985afb514f8d50c3a0f9ed44922c83591e24&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XTE46BJ3%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDmnAzV8HvOQ9moaUqEXi3L6aBgk7703j%2FDyzZA37K0dAIhANYCI7AwL53sQMDIUgWuNHjQm56atnNJPTVAZeVg5w%2FCKv8DCH0QABoMNjM3NDIzMTgzODA1Igxci3sKSUkUnTTXUr0q3AOpfU1u4UOLRlBkfmfin0MaT98cY4L80NEBWJ86TGrGrnCZU0jLS9pd3D6ymwsG3xGa8WSjh9iEwyLxMRduLsdPYvZyQCP5%2BYqHcVW%2BFcwgEg3YJV813Ux3BMvd3jFvTwPCgrFdwJ6nhe5H7Ka3XjQ5vHVpfbcnY25tIotFEplXRM1ortyf9Ap4Ocx2eqdrqq7STPZSJm3QcGIY0%2BGz5FhaVrTIecG6eFWhhVFO2Jt6I4%2BJg9vB2xcRwYtUkchRt4OcJnc382THhAFUyKuT42aBsn4Ro06sk3w9Lki4nLq3qVbL4gjHeqUR4c7FKGv2rS5lty50le1hGcyBuvounVSSn5MMr0oWO61hddWa%2B2QzHdnEcx0jyTai10%2BGYI4rTLFfP7pW%2FApmbiK%2FyjSg1RWT5lxWCaYPxpKDLksktfFhKKI7zSRjajHyQBOjuci4YDKNvD7DrtoxEgFod%2BM4lacoTW2dvTEBJD%2FPkWMejuB4pGqiUH3PSjRQ5Gv1mtLpPgG%2FSg1v3ZgtDggegdwp4kkyqm8BYxKeLWAfb8n56i5rREn9FU%2F2ZsNsDum%2B6EPZJ6N8zP%2FrKMvrHzXvQtRjKGlaGdrlVsbCV3Upw7zZ3vz03Gt4f2oocjYIY198HTDWyeXPBjqkAYPTRZHrzns4IJQk9ffaYph783k%2BKr0cdnglv6mx%2BrzmJ%2BnCvjV7PHb99wPWkFaZMRxm6G%2B%2BgBOhJ6hGvvGnNqi%2FcCZU4vm6D7DL8JDmWcp3R5JWAZcKAsf7TdGVJm6GRZSLmgd2S1rcWCTwEu0i7O0x8EEupeoJjx%2BSUmNHjE9BUbv0foQ7j7KOI%2FC3ePGo0Ta31HUzxzhNvE%2BpPQ3faRhdCiiO&X-Amz-Signature=3956e678a34066e9581b58f8d75457c1e4587a1124d862aa538f2c7fb1ea738b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
