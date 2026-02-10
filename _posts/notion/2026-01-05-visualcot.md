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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QI3PDYAP%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032824Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBn%2BFwNAdFBzblwghj1xOZw6RLY5S3gsaPUAEVOn9%2FqDAiEAzTXlx%2BLmiFTDrv0Tzlwu8LNRq6lb%2BXgWZBMZcH7FTnEqiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDHBAXy%2FFuRXSJXWmircA%2Fvv%2BsFoQ5H0CKCpITkRQ3%2FwaX5fNFBkmBGnzUxOU7%2FfthzS%2FTfDpg7kOP%2Fd5y7nUktZefwjD0V9du9I9cmIHMcHtZsWlmdMtYa8JYQXjuh9E%2FyHua6aMVg3DJoNadwn4Hckq%2F%2BGuEh0FMK1c1gcLlDcF0hvp0HOhz%2BAGHRV5c90JCY2EFCPqk2to3oR1D6m9E2m0hUIBw8R0P5R%2BFXmJfrPDqAGObfEjZJgcUVbLdYTKxGyGRtXtCf4eXfo02hggUYv70hccqCu6D%2Ff3ZJE0JZ4Z4Co2URWxcsHmn%2FKnn8vkjV7FUWPfYwrkPEkgpyGaTiloqXcSt9RWJexJVswXl1bMC4TEHSw67Dz%2BeuDhMCTqQB8H%2Bv7xL95kGdQkeV9HJcTBWG1vFvC7Zz3YDmS%2BERKg2X76o7qh9%2BwS2CA5M9wtYaPx7KuG6%2F%2BXUGdkU2OnkAfYMdZjpkuJEYblGrfwY2GpP7foAnJJfNzquldDbVLkAKpwZeMMF30408lrqlQ3W9qAGBmhwj%2FmD3YHD%2FT%2Biwcd2GrFo4A3z0QhfdMbh0tSGyOhFQ56gOCennepf%2Fav%2BFxUJbMA7wJmPAM%2BaLx3s7kjCj%2FCu4w5wN30QssBUvkkKfSWTQ8h%2FWx1LjeMM%2FDqswGOqUBV0%2F7rDgsHTydK3ZsI7My6neTjMR7AycZzq0juEOHalWB7JFS22%2BvH%2BiYxvTYJbdRnd%2FlJUIUGtuePoqud%2FFgnHsXYLlHk1bD2V2%2FRew6Fmfu1KBlqSf%2B1MOTl3ZVjWdTq2%2BXzGm%2FRxwslPkaJSIzlZcosr4pOP5nPGyb%2BDogjqrsxLf0uTOqKb%2FqG5EDGIYn9MpFHJ%2BOZzI4YdlGqZjhXb0Ri13y&X-Amz-Signature=05dd13ced171b99bfd98899b24de8637eaa69cef183407bc283d33984d5d74c3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46674JVYZ3X%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032824Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD9BcagnNu2QdcDlzgLlPQH76%2BDJPCc6etPl%2Bc3P7xqCAIhALDS2r%2FhocdmgrR3CknqsiWo9yH%2BHtDEfBT7JTUguzNzKogECJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwMIgiqe%2B4OqYdTwoUq3AMummugba5vSSfqNVRLs7%2B0BZHBQUbZRmmczHEr7WhS3Sk2odR806jCRt%2B64MmFyBHDDxeCrR1l6HiFmO2%2F9h9OZlhLjrK8BTo50RsTzX2Z37LYhxs%2BTaE7R%2BONP71H9t4k%2BiKIBU1BUOw2nqW0%2BYwK9gf5XEwE948difmnkriT63MdWVxLSBrDONZehuJBJqe6erOfl5heaLBu%2BzjC1OP6GpdRWEdRlugsxXHy9gO9QG2XJUKq%2FvSCeCaovZkeXbv2Z5YIcP8irvNPDX9qy32YG0XFH2cd1uemb8%2F1FQl%2FPTCKVPU2kW%2B1he50X2wd7WPVd7Y%2BR3bogw6gfS8t9XIze6%2FEGE7wbHMG7lbVSX8mL007uy84SYm0AYRftx%2FhACpo0YbXLWEYLGl09Ez9ZjY%2BfidygP%2BEk%2FE%2BG84%2FjvuxJ%2Fn893YWWH4Pdo6pKY43KAxSHtZvYgoFA3Jp9a2x1wZCuDfK51FZbon05zvDZOH1NwFLzhIV7U2vLtCugwylNWlzIxmM7fElbAhSEpkSqefMBAy6EWRYl0l4viyyYirxaAB94AGZnfEXftNiXuTJngms%2FQ3zMtpAVib3tedH1vf3nOQDN0AeSZ6e1%2FGBawBu8DGcNEnNaTcKuSXpaDCYw6rMBjqkAYwg5wlZzZLMenhLMYh%2BDj3cOy46wwZu8Tnt%2F8SJF2DN%2FcoIGjmZ3Y2%2B1BgYfMk8gjkcCGOl8uYnQ4jOdQlxiNaS8EF6LPyEDUbrnLbnwdkOOzdQ6oyirrZWAN%2BlKEl95BEWxLpJAxSn4vZq30uIPWFvMQ4DkPd1089ts%2BfjyA4p6%2F%2FWoM%2BSRBM4afMXxLrM5%2FQV9iZxEcw0O2V1mloqd2ciJYIU&X-Amz-Signature=5a999861c5230900e7bd802cc629e539cc18382b7ebf67e1158301996e23a87a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TIXQ6H6L%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032814Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCxvHRyHl4Ct3PX%2Fo2NoOFWVcwxxo1g7%2FYuqhCQHYbSSAIgV9xVec%2BMNCFSofzB4ztdHh0BI7rck4Z2KjTpXd0yRlcqiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOWI9FSuDmHpSqD0VyrcA48O90U0%2FKI2tGr16GlHYjRtkM1twaDHjG4qdS4HT%2BGHtvEKHd36ZVcF1%2BLE148Ldh%2BZSAyrBMqJrIp73i4zTaV2KI7oQ6htAM%2B%2FAdBzmTSs1mztD6OP29voLPmMm98ZDWd6PZ8DgxGf7WLz5w29MQU5gZ%2B4pRNwVjU9soE8lt7bEtW3TosujidqfGIY8ibpUWixxlLwFpqt7nxOWEPTOue3MqMcCllKDzFqlcM%2BPsX5igQ3yZvpCMm4Z4SBdeJDjJGP30Q7c3hbsfUm5yehVN4kQQfpmsnoTkmoHRD7uk7Ag7GRy4zKYmNu8LGUp%2BlUE%2B4T3zsCM8Ac0uZ6Lbt3Wr9rVbRRWhFFYuju%2B4Yvb27UxMpK2xrxy9Q14W0sS%2FOA6omKS9K2qN3yMKL%2FV6eFRwmuLzVnIfmZYcW3UIuyNvdsvfh9qKHtvt%2FNdbxl3iZbZhkKD98vBziICVhWbKirGPFKenKNSEwlRF02BrPC5j12ssSDIYNfBE9Nt3wlZbWLBYM33sAchsUbNKPAkExMNw9hKdVAtF9LL9r%2Fqdkl2VJ2mPF8Y2p80CKhQ2y4yVOf1jEDdFZObHYaGWqyjk6jXa4ZjE9qkKyYvbVcn38Hxm%2FA55sH6gDNk30iUpOZMIzDqswGOqUBUWSNsY2nP5RfM86eqMvTXCi4JFb2MoPU93wBDaqm7AUeq83TxP5Ue63Dn7PzzX9pH0YX%2BwVoUK%2F3IqJ5smSzgPdL4d3U9Mj7ozSj9HE8tMgjIrAMRCFxaYyCzp9Tthd7JvVWWK6uqP8EHkr9jlylliK40XLv38sJRSH4GEEOcrm2I1OMpTcqybYb5JWWi4GeJsrU3DMTCSj6hWMWUozxGgSK%2BeoC&X-Amz-Signature=01c8b2208f81b4a222e112f63f85c8e1756aedc6b708848f98b4c0dce7bb1bcc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TIXQ6H6L%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032814Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCxvHRyHl4Ct3PX%2Fo2NoOFWVcwxxo1g7%2FYuqhCQHYbSSAIgV9xVec%2BMNCFSofzB4ztdHh0BI7rck4Z2KjTpXd0yRlcqiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOWI9FSuDmHpSqD0VyrcA48O90U0%2FKI2tGr16GlHYjRtkM1twaDHjG4qdS4HT%2BGHtvEKHd36ZVcF1%2BLE148Ldh%2BZSAyrBMqJrIp73i4zTaV2KI7oQ6htAM%2B%2FAdBzmTSs1mztD6OP29voLPmMm98ZDWd6PZ8DgxGf7WLz5w29MQU5gZ%2B4pRNwVjU9soE8lt7bEtW3TosujidqfGIY8ibpUWixxlLwFpqt7nxOWEPTOue3MqMcCllKDzFqlcM%2BPsX5igQ3yZvpCMm4Z4SBdeJDjJGP30Q7c3hbsfUm5yehVN4kQQfpmsnoTkmoHRD7uk7Ag7GRy4zKYmNu8LGUp%2BlUE%2B4T3zsCM8Ac0uZ6Lbt3Wr9rVbRRWhFFYuju%2B4Yvb27UxMpK2xrxy9Q14W0sS%2FOA6omKS9K2qN3yMKL%2FV6eFRwmuLzVnIfmZYcW3UIuyNvdsvfh9qKHtvt%2FNdbxl3iZbZhkKD98vBziICVhWbKirGPFKenKNSEwlRF02BrPC5j12ssSDIYNfBE9Nt3wlZbWLBYM33sAchsUbNKPAkExMNw9hKdVAtF9LL9r%2Fqdkl2VJ2mPF8Y2p80CKhQ2y4yVOf1jEDdFZObHYaGWqyjk6jXa4ZjE9qkKyYvbVcn38Hxm%2FA55sH6gDNk30iUpOZMIzDqswGOqUBUWSNsY2nP5RfM86eqMvTXCi4JFb2MoPU93wBDaqm7AUeq83TxP5Ue63Dn7PzzX9pH0YX%2BwVoUK%2F3IqJ5smSzgPdL4d3U9Mj7ozSj9HE8tMgjIrAMRCFxaYyCzp9Tthd7JvVWWK6uqP8EHkr9jlylliK40XLv38sJRSH4GEEOcrm2I1OMpTcqybYb5JWWi4GeJsrU3DMTCSj6hWMWUozxGgSK%2BeoC&X-Amz-Signature=a75086682ae7df656e4d8858f630962e5f0a491727fb8d17e41cf0eb69dabd4f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W7PH6IMS%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032840Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICab44Ec88Fk38KpDcdDv02SFwt51zG2Tdkuvou6VncpAiEAqSzIqLT%2Fk9hs%2B%2BOuGrnipnrPu22Yk7e%2BowBm7C9BqmAqiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEvKzI5LRVyPfpp7sircA3X86iHoz1xDwavRNwpFmKqrqMs17kyMKUdBdYDIiSqRk%2BFoYPo%2Fb0k8E%2FkJLyJa2sidL3l%2FMehV3JonzhmWLFJmsKICLo91PINbA8RSWRP6wk1BYbihsz5Exz7xjGnTIBIsmBLrU6j94c9t%2FRktcjvd8ZAyn23GQZGEgsTPZ6u3H4N8tbSnvXsz8sGvRJD8ZyjjtF%2BA4%2BIkF%2Bm%2F7h7mHQqrVpwmJffEARxybn54rVI066xbhmQlIZRr4bNe5UseFbA%2BG3yNjk5asL%2FbSv5cYekzAEBvnB2h95p6SWqaORGoje2LMryO4mEZ7dP%2BGpyHBsNYXh2QokkBJcludfZtYODTqKXO98x7CF1BaUh8Se1UDmQzNxWsIo1iR%2FKEjNFlUZaRB1taVBs6671RPaHTHUYyicmar4vYcxhztBYTM8O9Nai4MNl1tHTt0pXzcUhfuy1ZrO2EHb65hc12g1TamccFGlbBFjZzQQHXHTmbhFI9TwKdOdVs9iiZCQGqbRfSZZDzTXba4WzAwj0ZOTzxK5q%2BEIPLY51B07TQ4NHrSNyoHkr5DSu10uzqhul588dEkFMaHje04obtz00KWgl5Z5amhng5dzgIf4bTDKvM9lpKedNXQE4JIYGUTvJjMPzCqswGOqUBl9wcb5URHdpBjAnQ5bpquuRUy4JROu3H%2BM672FvxiieAh04P1fwEFfwnR6Xh0AZYEdzmIzOHqKAEa39ETxdbgUNPL6cob2Xncv2NlNMg68q0ZvRKz3MgQKO1lqpg9R5qLNdnhfDRCmh2K7UdJLPhcW6tD8l7nBDHp3mm5Ab%2BdZtVAYtliMx%2FMt6p0hDZ%2F9jIZT5hfbdWIH6ERGJUyZT%2F6cpxUNYT&X-Amz-Signature=b51f2abfd3b9f565e613ec3259f873684b2c04d7f38abeff0a8a81f60f34eb2a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663OSUH4KH%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032846Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB1ZcmkYSbJKaYUyskV9LTAjOQ3ob4B4jqqk5OrwXgB6AiEAhbs4YFT6bO40DAP%2Btu%2B0SDh1fFaB4p%2FPo9Na1GbQdoYqiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMs3PH%2FFpZUywJVK2ircA3c0oGdSi9gGUugjn7DTWtYLj7QQv%2BFZi0xhVE6DQsOqZlA%2BHlKQ0hUvUMy0c9%2FtdWTlypFoEA%2BibJtxkij3GkWSEOT9YnqJzLMq4p3KwjBL3Sd4HQhelVB9RH3VbjPpUt4621aK6U4KS6qtxPVAtAWfR%2F%2BIh4lVFisuNXPp9q0h1HyuLNzScfZ2%2F2dHumpnjwqReYZ2CPOZbGDDDS6iADkFGqJlaWwZngFrD0HLM6cwt%2FW9GVctm3nU3E1UjYimSWGNgZbBoTplj0KJ58lM8NAyc4kDiskLZmwGk6ZOgncvPZted5BQdNJ12tgwpk0sFtiGZNt%2BGCFlDH4XoUELFwxJPV0jCdM2kILhZkjNrrt9szHkEbc8C1bRZdOxKKNaPn8juxPNIYKzcgGSQtY21PEvrspvzZCaRVm967jOzsK5tqmHQZu0KRYkRPvHbYnWilDVeSwo0GUFwq71Q4m7Ez%2BO6L0qoUCIYVKMXCTfJhMz6dpuxgtM0WTHECe5Ydr6bXGWHlyQhuUjz%2B0OCjN%2FqzkefzLU7eXJ%2Fm%2Beslk8JCOJ%2BzYNuIBNCS3UjevH1jos5tVZo9ABPsj3LPU2821295zboD2g215uHQ0q77RBJ44dhkU0Ohhvyo4wepXCMKHEqswGOqUBXBTx0nO70f%2F7k9XhhF%2FZHM6O55lRdCOkvgY%2BQOTJ5o2RoV91QCW5Ij4SwkAsEIU%2Fr5zjkj0DmCDtyJI8oj%2FpsqKq2JBhsjdDfUy32KD4sWleRPrFDlSu7c7k4XQuCRRAEjZ7727TFmfRP7lNTzcRO9uhF6mjVAh7MY7eL%2BbaJdu6PcnXxwzSHJR6J4LtlR9BnR6PPoPOlLWBlyrncUdwGhflJAej&X-Amz-Signature=8f761d0309e53662f7e6d074897a89ed4ac6927cbcf6eed0f161442ce376dcc6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663BUNNA72%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDPcJAfIJ%2BSJq47DSMttuJKHhFVgDPRfJRl9IzW2OKHSQIgUQ9GwcWFog6FmQeWbW0r5dtzI7AI0iKUpIWcZ%2Fw4I9gqiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPRyanpiTOI3x7yhoSrcA3zO7jUJk3AjA9YvOu%2Fa6uKd3v4l0OLcE1ZeJ999r6%2Fug6xEQEklx3HNX8YdS2Qvwns29gO1rIpF1E%2FhiD5L9lIytILmKiL0C2YSyZoLqmJv4V7J92Uh%2BPegwOovCfWF750mX%2BagmQpQlaNq58%2Fh1jf13M5dh6WVVRfgC6w%2BoPpR8MCbTyhcD6LdoBmyt%2FY32Q1JXXFnJYM3FP%2BxmNydMvxGN6RE9oGSsfA1J4KQNqrOspRY0XbrDyVFu09X8X5vgsBHWel26CBS6rGGdp9YTFycCJldP3j0JqF9u9Md3DzE3%2F1JUl5f1RELidgCLjCV7i1LF8ZLCamDmzLZIxc%2B7DUsjSQXlJSUbfp3gThy2lnLzFjpGPYB715G1aRl5jwIVqmFQlpFQPXsVfJkdq8qEmhfUrL3NUVxfVwyR6IhdMA0iDf89O7yfYztSgTzz%2B5WOUJhev9YWJowK8yW%2FKMfN8J3An3g3Q5CiSSY5TMEtsOUCAz1mIig2G1dwuHXNGwHPar%2FmDkpwbOEVOeJLRdVVwi74DblT2JlXQWvaG8N%2Bh%2BbC5Ev9UfthFJDpLVAXMYedFowhW8owU7Cjv%2Fi1gSmcgm1lfUS6nbq3ZswWMId9RqPDLnqqyqjJHdvPs%2FeMMXDqswGOqUBQG%2FJmp%2FLWehBHgCGSSrtW2ETAB5Czj1oR%2BnsWYwsyfH3e961JGT%2BbOFFiiA%2BaFMcCytossnQPrY1Ou7lVbaZlRLoCJd3kUmDp8ZhOHoIQDhMYnlQGaakNYHBJ1bIwQgYtpqF%2FzW2aLtxKvbd6dgzlTms5pi9B%2BjmFKKkDXtss073qFZZwLDlhETJgS%2FIhtQi0nioMh5iSac5KZlk5Vsz94YUl0yZ&X-Amz-Signature=c09c2390af040e1e3954f815ba2f91e65f606939ba78ffc506a73742c42d2a63&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZRRMA3VW%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICU8Gq5cJRiz0gC6kHIiwJDThfMC31fRSFgyEMR1efV6AiBml6etjEL8%2ByuDnIzn4iaihsNBOoLW0%2Fhcu%2BIcvdxd9CqIBAic%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMpGN9uaQDr9drt5A8KtwD0BbJHs%2BY5eXtrd8ZGRDjqQ4ctvEwC0G4vY%2FDp2tyuPeUj%2F8Q7dtZ3dIkuk32c%2BRSzWi4iL14srhr%2FL1EmxNQO6G%2FyKjkdWq%2F2DQhMUXQ7vHefQlEbeg6HdIz31%2Br2y7yXM664MBR5s6tEmYg5cMSpRYmyCxu8uWL8odSwmb1DR%2FohHj%2FvSjyORXb06px6Rs%2BlDmA0E3CHXMkp7KMuxfmTwkP6Z3UbhUtO0b2x8POWd206LPtdkw74L4AxeIoqNpr%2FIF%2F0X7W0OuwKaq73wevsDfgXW9BnAe6%2FcXS3Fo7m1fBvaeLIS%2FZXu2Ty6K%2B9RaBHnLUiS7yGeucLsTiKb8SkydWSnxrjMTN5fpp%2Fqqy1CJwqQRI1Hu2hVVCalIJXuMBAvVvkLDz6M4VDOpqTv%2BfGHxAobF3Cm93hqsnwkcsNMwaKNMHYizNGK7HNzFYk3L9EKqfjET7C%2BZzI8FE6HQ%2BjpaRTFJpfjgKEOaXJUf9VpIs1t6Bgl7q0Fczy%2FpeyOffPD7RoPLnbOdXpeIHUx2PZ9Xh2ZDHbwjUXrjNfT%2BvXdplwvJ%2BIHUjQNde4KJZA6im1vNpL%2B47JQgfakJYg8G9pQulaAqdKZNWlUkq1r81LD4N0Jm2%2FSBG9JgdEy4w0cOqzAY6pgFxq%2Bn4bs77%2BWhNxOK8afEitlsphdGziI6zN%2FI3dsZmh0ckRJ8jwr%2B531sgvjbVKb49w69VGOSziQCwCzyvU7fdwzUG1RTHVStQQnlWVjddbPk1BatbOHutMVNlQPdyH69B9sjyXYtySbLdp6TU8t64nrQ7hp130sefGUG0Xn1ZveQesusQVGt%2FX7BOP6LeAtluAepqku9NhQZcW%2FYJEfLE61wzKfVA&X-Amz-Signature=6cc09ecc24130f3fc371398ed35e9f65eb20e6901bc9c1671ffe58401bc35af7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q756SQDP%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFx5Vi0wvl0ECiX9qoWijXPehOHiX1NcAuBBrPLVmt%2BSAiBaLzuAVYuZ3UwCgfeDC4UwOZTbOOXBFlmW7TmjfqOeMiqIBAic%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMb8Zjx%2FR5U1ibG%2F2BKtwDPH8qaSvhOEWdmGqKlN20x0O9bDu5a%2FcjMpO00gYplOyzuRBrpExTPLijbxSh8sMfg8JUuNwOYHPnXzRd9RAO8pAhMQ3z0RHgTh%2FTElNc%2BZ1FW4sngzgXYi%2Ft9nd%2FcYUYVPAdpsmDenx5sIcrwNEbDA%2BzP2%2BXm3DRPa1Z2rlemCdTt7xe%2F8RPXHhTJclv3a8QE2BlP7u2I%2FPHXCwbRckRUq4o%2FanCQ1fLFZ1EahBP%2BIFOk1CX748EOqcz6nGj4Vb352qSqSG5KkFSC513vDwRARfqoyaB3sfZyQOhNlLvqKP4Dl6QfXyGsX27INk2AflqCUzbSDIwKurTPjy%2BzuTZfyVkKvPsbfOjgQhZUzPIZSkeaVnU0ICQGGxGzrHUDO95bRndwXlTOJoF8ov%2F9KWHASW%2BrGC53csrVyjeW%2F4iLrcvDcKJ8LILQJ5nU6YRgBCXizOXrTqe3iP8WsojejOWxVXzPCGF%2FLuRLzat3NLcwlsqSy985m9WRBzgQ8EohKDmBHesbHuG7ycUBGU2UbdkQeACAY1P2f4WJnEzGBjUWpVFMqAS4RrnaEjRcwqS7Gsp0%2F3L8ygXGwLO0xRa6BrBJSLIKtM6d3e9oJLbFiVNJ%2BrFmdzdfvB9rNUy42EwpMOqzAY6pgEMCQMtSPqzuFwBDRKLTxCLZYf59%2FtB%2FRcpCpQHi%2B%2BccUasKkR5rb4gFb0mdQoSIpf2294aZAzqx4bPT4%2F%2BHvzgr0YbWhq90hR%2FU5iClIQXZOLKqdnkz9oneqCaPT5XexLBKLUH%2FGrGhz1mDVhOKcXZBejdKzKsIxuuJB%2B4dNUiY91VSQCF454gTKRDr8gaxSe2IKWtWsayLZE2Yq7H69L2ieRBnaug&X-Amz-Signature=3ce52703a5da199b9138fb13f50372a123f37cb674675b51fe59aa34f8afd7c4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TIXQ6H6L%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032814Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCxvHRyHl4Ct3PX%2Fo2NoOFWVcwxxo1g7%2FYuqhCQHYbSSAIgV9xVec%2BMNCFSofzB4ztdHh0BI7rck4Z2KjTpXd0yRlcqiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOWI9FSuDmHpSqD0VyrcA48O90U0%2FKI2tGr16GlHYjRtkM1twaDHjG4qdS4HT%2BGHtvEKHd36ZVcF1%2BLE148Ldh%2BZSAyrBMqJrIp73i4zTaV2KI7oQ6htAM%2B%2FAdBzmTSs1mztD6OP29voLPmMm98ZDWd6PZ8DgxGf7WLz5w29MQU5gZ%2B4pRNwVjU9soE8lt7bEtW3TosujidqfGIY8ibpUWixxlLwFpqt7nxOWEPTOue3MqMcCllKDzFqlcM%2BPsX5igQ3yZvpCMm4Z4SBdeJDjJGP30Q7c3hbsfUm5yehVN4kQQfpmsnoTkmoHRD7uk7Ag7GRy4zKYmNu8LGUp%2BlUE%2B4T3zsCM8Ac0uZ6Lbt3Wr9rVbRRWhFFYuju%2B4Yvb27UxMpK2xrxy9Q14W0sS%2FOA6omKS9K2qN3yMKL%2FV6eFRwmuLzVnIfmZYcW3UIuyNvdsvfh9qKHtvt%2FNdbxl3iZbZhkKD98vBziICVhWbKirGPFKenKNSEwlRF02BrPC5j12ssSDIYNfBE9Nt3wlZbWLBYM33sAchsUbNKPAkExMNw9hKdVAtF9LL9r%2Fqdkl2VJ2mPF8Y2p80CKhQ2y4yVOf1jEDdFZObHYaGWqyjk6jXa4ZjE9qkKyYvbVcn38Hxm%2FA55sH6gDNk30iUpOZMIzDqswGOqUBUWSNsY2nP5RfM86eqMvTXCi4JFb2MoPU93wBDaqm7AUeq83TxP5Ue63Dn7PzzX9pH0YX%2BwVoUK%2F3IqJ5smSzgPdL4d3U9Mj7ozSj9HE8tMgjIrAMRCFxaYyCzp9Tthd7JvVWWK6uqP8EHkr9jlylliK40XLv38sJRSH4GEEOcrm2I1OMpTcqybYb5JWWi4GeJsrU3DMTCSj6hWMWUozxGgSK%2BeoC&X-Amz-Signature=0b447a7e66e56f6a8204bafb9715b88b4969c107bf690c8c1ef6f2935d850e2b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
