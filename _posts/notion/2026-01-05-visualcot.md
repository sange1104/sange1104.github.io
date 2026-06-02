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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPJZKPFK%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050228Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIGd2HL8m5wL7TCn%2B8U2%2B5uWqm9eaOTT8GPaqJ2UdJ6LgAiEAw%2F0iDZNxF6Twe2DPO7RxBkNKfaKp4zDbSBJerF3vDvcq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDIgTylS7kuBXtU3clSrcA4GK9ncM2rsWbprIXZHJp6SCTWK144%2Fh1P44rVJDvNRm15cMcj9BHCErem2Mw84Lw%2FkkPDMqFjoPKQ%2BbPxybP%2FzFJGvwfe%2B7upXQdn18ZCPxu1TRNWtcf84MAOQJUdrpkhSuQ9z1qiKJ5nqQDgnGSzK04aYrVC3HokHH9aodmp5C34638CziQuh5PWhBwo%2F4N%2FhMGfts7lGFaT5TaondlhxlUBcwg5u5fMGy9gTPoPMfS4yP6VSTnBGmiXS7C%2Bh0YlQlAK422EH8SDY3emgiPlifu4xmVorMn6ZYFJXWiRmuVGNbN5WPfnHk8bgo09uClPsdAhyzpY2j29Pi30Qbs3yGxH2ghrZeCQ4g9P3g%2F1JCfb%2FRluSlYCqO87yVAZYgfMlPLTx%2FxBWfQkxMTl2gh89aVopp7Y5TDHM05P9XgsCA%2FERvQZ0%2BZ8GPUZMj%2FJOOv4inWsyj4oHUgiididWEiaj24cDsiDf%2BGa9z69nm7tqlCGJ8exEUfkDz1BUlO%2FK8vhADy80d8E%2FQViRTLfKG0AhcVUTewa%2FBryZmWJ4qFJ7OE64t%2F8%2B6I%2BeKhEWE68oUJs9uaXadXNObqGarjdArTvHNRwQdSVer4XmaAx4KrEnybcwB0IYWL76qVyzBMNei%2BdAGOqUBCK%2BwaEvGWqbfZ92AzIQPDkxLwwpN6JoFa6cZ60C4c9Oa3lxJpOxUv%2F6VgWuZYIATmUlKZ7YtbazQk50RBnF1ZapE9gfYSyntDoq94v3ScSO8ZX8MA%2FCANN8TRLrnFVHgU93bHiZAmsTWVNSqzXIoeboyXJ7LpE1zvN3JAo6U9Qlpfz%2F0CcQijWx9lSJ2Epu9Ov6F7hm2addGfETzrLXycxZ1YZze&X-Amz-Signature=9acf98e7cc3f13c704933f33b5491473eafb5f16af2896ee22138d1129fbd129&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SCEXJB5Y%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050228Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCRnPdqm3HDyPUWMYDmtqy67BRZBQxYXXVTZCKAH2qNLgIhANSobnE3VuZpqQm32KJ92x8jotYKwOxoPcl7U4o3LQXjKv8DCB0QABoMNjM3NDIzMTgzODA1IgwXefgcY4bwWQ8Cb9Yq3AM9%2By4k9HGaVQ2OQdstUfLUwH9FfH8HuXCKmtObt7Hftk24%2B%2BLoIpYELA%2FlGA53pm%2FPTC%2F0yfulqYyK3z1rcydHBKc3GlTlk0nQ3j035H7prcUyTsAvDlxDd4ARCY0waCrg5mugRlyOGBYq8yziTD0L4vXvp3dzPXaxBGVt%2Bw3JrItNAvrzXI0VfVpYW5S1H4rRkGdGVt82aCCkQ96SAPmom%2BxOYEbbOtazfgeQbBQ7EZwSCGmC%2B0h3ShJ8WodZenX3bAWxBGCdZLMfhKw10M%2BTaExGdKFiAx8x%2FenLjNGnzGvODYo93qI3JB608V2C8JXPnTxDXiivMXS5XC0jqNrYNFkXEodC7w5InBILKD4lmyZ1qmmSPp%2BVm1I%2F53fwHb2fPQ3Vy0lKsQpEaeVHbrYMRd%2BOiMP2Q7cX3I2Oj0aGjdOUGViMDzKzOfbJ%2BpIAkoBnLZngfbxih1rMuRaFrVL1SiHQI9pWFw7njUUGVOq78UCyS6eHtb6nt%2BGIiRfpDRfW6tl5UmW4pR3j6WP2JcRJBRL2cdaqoFFEYJeuVAEAfpAq%2B79G4C3PBWQ%2BVdDA4Gho5xOUz26aeZjAi%2FiqUO%2Fr5nGd8llFJw4lsoS%2FK8wUx4AR1I%2BlMFn3TcR%2BJjDNqPnQBjqkAVivEaX%2F4fKAefhJwP5Uzgzg6tkLRFTXwjQBhURWX%2BH6mUahUP0esJxj68G5pNhTlxcsPafqhM0tIb%2Bkh%2BiSXyVCvoQyqzoJ7trSUmL0APC%2BzZDRugvT1shGBTNXNcQ10Jshpt1aaV5qlQKFzZBh7YHAIhREB2aKb4HMRanGtbXpLpdsOiycVLZ%2FwNpCckTOm2wnXAzRnY%2BbOytGk2pbJyInE9ka&X-Amz-Signature=9240eff29a9dc92cd9f140ac07f93856dfcdcbb1c377d95a80f1bf4cafe5aaef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7GXC63P%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050223Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIDIIxhaG47sLw9N6lhbZpygLAAy9JAI6kpBHHu1hEChnAiEAqxT0WfPRmX39ifn%2B7fLtUDZRfOcv0GXGB8R3QQOiru0q%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDP0akCM6kb2zhi2tUircAxTURNRr0XGj0RYsAiX3huuRRKgrR%2FIY8aoCArpudxUjtoRABm3wADqURHj%2FSXA1f%2FJJaz0fk3Qc78IkUPqU9ox42R9NqSWYYAm%2Fg%2BwCTR214mWK2dGtSbtdD9uSjU78oG2D8y%2FbxhE%2BQBQ9f6dupaRN3Ce5l2kDzFjS42l6EGOZtybNGsNjlTsRT3ejQ04w92LZ%2BJYkGPc4rSAaenx3OKxIQ%2B%2FWu1oDnTQhDbykZlbXhBlyfTFXS%2B6B7QC%2BrrTHLPRmdP3L6oONrCe5AURPrkRgnJ6CrSW897K0M2dCH3ha%2BKnretR1aEBbu0JHUkqWPZ3laWM3MxwwN5E1xR8UCfgyLtu16PBLV0rzjgyX7Ub4HY7s208tVsJgV8u84FXjdAYdS1EUjUMZlGysZxruxf1x2JRv%2FWzLK%2BkgEI%2Fxxvu7bBQqBfBlounj%2FqGXAyLmL689%2FcHh7u62Oj3EYI%2FZiZ3ZR1dFdbRdLjUu7apIpiK4gFrA4B6Btk6zGIQ9wb4Qxt%2BYsdeRiv7bZWw4W0Tr4%2B7W98wlxEBrCrO59wLs5JKH8OAejEvXA72pHvrOgrGIib1%2FF8C%2FOJOe7Uuv2XMv59i2%2Bslkk6V5w%2FXp2FVIPp1UHtsYC3tQ2VKCu1ylMKKq%2BdAGOqUB5Co5Z%2FTeaLZ23eClt89BK4Me%2FGIStqiqoS0gcFTjpk3846nbY3HIo%2B07cCBt0Hjum9Y%2F1w%2FsL%2BZj8aQW0iwjFb1YJMyL9gGy5H90m9PWhM91MyrVoIPfNRLH6VaJWXFvR%2FYBtt95LhVOmi2hT1Z9F8ECyiJ%2Fu8bzXDd5rklgt19VY9E1SKRQat%2FdSrQixCP4mYwfp4juASTNhB2S9gBoV4StE2UG&X-Amz-Signature=4187bc2cb1cdb605c80818e3f24ff70f5f21dd4554ab379dbfd20db4eeb897a4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7GXC63P%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050223Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIDIIxhaG47sLw9N6lhbZpygLAAy9JAI6kpBHHu1hEChnAiEAqxT0WfPRmX39ifn%2B7fLtUDZRfOcv0GXGB8R3QQOiru0q%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDP0akCM6kb2zhi2tUircAxTURNRr0XGj0RYsAiX3huuRRKgrR%2FIY8aoCArpudxUjtoRABm3wADqURHj%2FSXA1f%2FJJaz0fk3Qc78IkUPqU9ox42R9NqSWYYAm%2Fg%2BwCTR214mWK2dGtSbtdD9uSjU78oG2D8y%2FbxhE%2BQBQ9f6dupaRN3Ce5l2kDzFjS42l6EGOZtybNGsNjlTsRT3ejQ04w92LZ%2BJYkGPc4rSAaenx3OKxIQ%2B%2FWu1oDnTQhDbykZlbXhBlyfTFXS%2B6B7QC%2BrrTHLPRmdP3L6oONrCe5AURPrkRgnJ6CrSW897K0M2dCH3ha%2BKnretR1aEBbu0JHUkqWPZ3laWM3MxwwN5E1xR8UCfgyLtu16PBLV0rzjgyX7Ub4HY7s208tVsJgV8u84FXjdAYdS1EUjUMZlGysZxruxf1x2JRv%2FWzLK%2BkgEI%2Fxxvu7bBQqBfBlounj%2FqGXAyLmL689%2FcHh7u62Oj3EYI%2FZiZ3ZR1dFdbRdLjUu7apIpiK4gFrA4B6Btk6zGIQ9wb4Qxt%2BYsdeRiv7bZWw4W0Tr4%2B7W98wlxEBrCrO59wLs5JKH8OAejEvXA72pHvrOgrGIib1%2FF8C%2FOJOe7Uuv2XMv59i2%2Bslkk6V5w%2FXp2FVIPp1UHtsYC3tQ2VKCu1ylMKKq%2BdAGOqUB5Co5Z%2FTeaLZ23eClt89BK4Me%2FGIStqiqoS0gcFTjpk3846nbY3HIo%2B07cCBt0Hjum9Y%2F1w%2FsL%2BZj8aQW0iwjFb1YJMyL9gGy5H90m9PWhM91MyrVoIPfNRLH6VaJWXFvR%2FYBtt95LhVOmi2hT1Z9F8ECyiJ%2Fu8bzXDd5rklgt19VY9E1SKRQat%2FdSrQixCP4mYwfp4juASTNhB2S9gBoV4StE2UG&X-Amz-Signature=f28ace0f8c5f60d33eaedab18cb510a591bd2b7e4816caf56ed0c5663ce905fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PAPNXXM%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050232Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQDT3Mdr8ovfjR0eplBvIjw6vaa52KL0rzBK0xM41YdNZwIgKMMNgFR2khJnoKrA15lG1XIb3TTLcgZKbULmFCUm96Uq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDOxROpXJqiuTykPhNSrcA66m0FeD6H25aUbs0TnF%2FBcHYnMsTbLKJgN8vzsSijcLSF5Zu4h5oPugWWW0Txo2s%2FUv1OEXuzEkOOU%2FJ8fxbnghvFD7xbkenVcYnPIbO1P5CVNv6I6goy%2B1bmawBNdpESq04I9ocfZFJ5VPzVm6Sro%2FGjVeAl09aFHNJrvAE%2BM%2B0ry%2FKzF5HG0lsHVi9sSe7Lwb1dn8dExAvy9JZI%2Fcze9MhRLR72KMXVTD8WdPeUvf8UUkFOVZlw1PwWHCq6HV5UpcqsnyZ12x4VkhYZxfXCJ4%2Bw5MVWIjqru%2BaD%2Fp3qHLgjAQqrJIr%2FzQnsb4HA1aof7izN4AWRb7h2Vdl2fPOLM12DQEfsw2cMIs5mKEsPmG4fWabR0sEPeJ81Nv7h9wJH2wrKB3YpAtTLNo6N9luCL4lDDF9wpAl3NgF1PjoXtLaT1bFW6pRab6gwwtM9aBOFUeuH%2BYhmR3MvcbicIKB6tUUe9gU0u0%2B%2BQkl%2FWmS8563YNYjtoeEjzd34J%2FQtAPEIeW5XgRRW8LlshfP4nrxlndQ%2BqV%2FfobI5%2BQn4C6PlRqScaGdaqtyW6KAh2VoM5Za3P8tJOGQCvpYo%2FyL90%2BU%2F%2Buj82lEEyfEBNxqbhyjqjI%2BMShP7EzvA1owY5HMOeo%2BdAGOqUB1Zj7TwFnMaANA4vJCSUw1rs53HhlYpPWOn7cxsiDZ%2FqOsoNVc97YZi80fZhzSaXYJQNB%2FJwaDR1k9%2BHR5G3N1PVVg9nQW0C7CTkbGuCuW7Rj9q9LQ2910tDyMLYT%2F2hG3SIv2DDjkQ2Hrbth9GDsjkCOJviO0cYShAK1vrwMy7q5wulP%2BbBwMqk%2BeE2uio8mclYTCnlDjTsOg3Mm0OkSFcGSJh4z&X-Amz-Signature=d75efac402146d08906fb3c8c96d1cfd864123f76cebb2d072b8edf32f7709e7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664H4VWF4F%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQCdUb7uYgqj4K3819MmrqKVksQWRNZRttayO69LDGSAmAIgZnJyO6CwU0hrCKBAJ6kpoaq4dZyw1t8kVMw4MsDIdxQq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDFHHt6qeWLQ3PejipSrcA60NJNIs6N5zvhH2gJAmLDVh4G%2FzWHmuJlhneeQPB%2FOWDCRNmDeSYlVuA%2Blk3u6kJOV2%2BmeZUXbwRSZ%2B8OFiMz%2FLicX7rpC1zSKfCqSOjxq1TPtWYE3A8OoOTu8l8MmMEq4QSLOlbfXp2aa7X7ion7hiMM12LMqGYUwSb8d6wPqIMgcD62paoD2oxDfiXLpRKdLcjcTK6NHfkxnpfBHmnfV9aWbcaE2tvouKNO8H17QMezQ%2BIhN2m2NXnQ3vGUqnK8RrIkRGh%2BL21NyVMskEULHzn7nki2YoLIXnquENPF8H42NNEUWXzTOd1znyeGqpQQxz1iL%2FSWV5v3QU7t83Dzosdpkv1F12uZFICii5hlq0ldPs8tCXWJS3B0wbDREKYLFD67WZr7aBcZA%2FIjQdAUEDVqN9zUg5h4vTY5NLN37cKFkEoUtumP4Q6HVeKCiX%2Bg32%2FUPNhI0%2BcEmS%2BazIipsaMpla6wYelWlmH3WGvqaR%2BK2zQykM0ox38iaCYSy8pyZU41pLzVGt1bDok3YTefE9XoL2xuQYtWOMHEdefdTOF5bcTKDrf4Nn%2BmRfVbcQ7dPCFRbWI6tO28uiBN7wf4XK42ZZ28GhMfEp3qycnSx1mpuZ8%2FMjzYjReXLoMMyq%2BdAGOqUBv8N%2BlyCFh0S8ef%2F8LGKcrOE8v25DC7BwkJRKE%2BX9MQf2mM1wBlchq2DliW584AwhrityyhXu2qrslHNBTXQsgE6bxtf6m3h6HNEsFlwyiLHWjwBB%2FIgN1eOUdm60ZfpaiT4oG7t7wgtylCKYeZ6YSBhHFdM4ZO0PGJ9R2ONn2RRPS6m0Kv%2BzfFXpE0k9iZL55rwILuW7xdiSu93K1usDGoJ%2BB5le&X-Amz-Signature=dadafabcf988c4bdde4730564967ffca2ccb1022b296abfb3bb2074ef1982ddb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666YENVUVB%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIHUx0ohSrO98NNc3Flewv3Iu%2B3i0lE2i%2Fa7es6ZekcHgAiBoRIEefMPQjElxUuSwBOWG1CLNoYQH2b%2BJU1wCs4Lyoyr%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMlsJJn6JezMo2mzy7KtwDCrNUJ7sRCyf75REE1Qs7DixxWM7%2BoYgLApyXVCbjPSwhW8yhnvltjaiaI052hzYja1k%2F887BAg8bpkyoVOis%2BhkmhNFvajTtqU%2BpWDmqLqXAJvp%2F%2BKYYJXbyDusBbuPdd43TkYnXJUTK%2B%2BIgPkpy3%2F%2FenD46FNJyxwk6RX9IXsnsvTQ2Fb%2FRXVJ5NEYcGLnyZhh2RZsuxJj%2FW6lZvCCVxJ6egcp5G377aqNl8NYHNpKwHPSbJ1bhZffh6h0B%2FDJhJQVJ97Xw7A4MyxmibPn7joXoV%2Fjc8vA5OTJXJG9pA%2BCs7Y6z9IyVWG6%2FyEVviZn9Kv4XZI1xESHh3TFnSngUbW7JfXlRK4oqDNr8PoJVTelA3t6Ip%2FWjlNoyZvuOYmOxxgLf0UPFyd5LUdsDOQn395XlXdJ%2FNmzpunhSlpj4cN2sdxFnLxAQcpteLyT1TRHyKbgkDgmLcXKI8A0ZSs5T%2BiaCpvSqJSfYaMnH2Z%2FnpMe8NuGa9z4VBrus5%2FNmx5MHMtAAuOeXmUMD5Qaf1gaNbyrLR9zRlS7kEgwD2oniUevJm%2FVo%2F%2Bbu9jp7pmjxLauGjcQW5xZ2HcSW%2BeXqpOwUsAX9HHi7mRL8Tm%2FZ03I58KrEJXvB70jFpAqiZlsw%2BKL50AY6pgFRQsTjj1uFTMCYaFYTRNKIIo4x8JmxrKgSAsOja2tGSTaK0vwXBCklvzlc%2BPJjOyGhmlhHEEXh9%2F%2FHZUTXD%2BO2CQIkoHQkz%2B0PokymjEAnEL1pxjhpW1sknhG3FTH9JNXnb4dX1fY4KHgvrdlQ%2Ffq59jRw4ETO6mAL8ouZnOL%2FXq6yUt9s7ZlAtZznD06knMZ8fSCOkLHx9gIFKj8wEHqybwOmpdE7&X-Amz-Signature=9cfdb28e1041f4f78295e99349be3e465e4f64a1c6006dddea5896cd63d6104d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UT4P5Y7C%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIGWu%2B1%2FJ%2BetEL5jyA2WTlSE2%2FBCUpDkGgJeTm1VZrjqiAiEAkS39sCv0nq5CM7rh%2FAtuCda5Cd6oz3Mw8QnvcBlTca4q%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDIEtuG7Pc%2BD3QRBt6SrcA6cMtMOnuKRcOy%2BI1cWBB3p6H2UUvb19OZ6SXBZEe8r6ZLU2WK1LfPMnRkSY6e5CvK%2F%2FGTdI3HFUl07y235WUGwXxhec5IfHQ8mh%2BWSOjhw6b6Bwj%2F%2F8f8qEBIDDlVsiP7zayAIcARbagyZqh7VPp4AVU85t09aa7Ho7LHRGUsRLG6%2BL%2Fy7DOxVLbKxDGMyAIvuf7cZvV7IS7doXpTHhFLyFuRWAHoP3CLOIp1qO8h9BUmYL6WDx2IOKvkga%2FGVlWIuV99QoOba2IEiLSMtmmEalkcUqkUcp58v%2BAv4CmCb3Pm1XvVoLbXzR0mGdZOjt0ic9yVW267GAhSBxhPYuWbYN0FkgVGFGaHyKmc8Q8Y%2FYekoL6LztE2IaNtZMOMe0ruWC2WcOYF60OvokJH75CkFV0wfpHdzlXSjg67dD4IgWId6uCwwogEPTizw6mvEMwh1cUJaPLhKdP3jG%2BGnr1xr3XdsmitT7vTpJWIUk%2FECi6Rw9YPHVi6AcX%2BcjX3HwfmlZCNLlJX9MsfOFYZYSwYx2JpaKltL9vgJhiMtGzeHbwwmijbokXmfHoD2PydEzzm1EXZ8OWnSFk%2BiNEYHfx2PXIrOLMcmapZX9T97BR0zPCAfxCAdrKfO%2BU0JVMKul%2BdAGOqUB7NGicOt3%2BSA2GzqwBAAcqmICINH1bQpSZB%2Fl%2F3K6bTkihkQ%2B3fzE%2BNny%2BqKZNZ5bDMueReyqkWgrY7%2Fqt2uYDBCWRJt92ZXq9LgjTFjtQCrFsX5DkcNC94gsxXqhea47Q4oq8SX%2B8Yq2wQPiaYBA5v2wfW0RxZfOsSn5jbE8MLcEula3lmyYks6Bv7pF%2FDuKG5XmcXMGJv2rvyPlj1uy4spmrJLQ&X-Amz-Signature=9aebc29da382597871a75d288062dd91db1c420b30dbe2c589588aeeacf135cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665AIIBCR2%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCfAcXUEzhboIN7KiSmsWw%2BEVz3ZxzUe4yLtdBF3udagwIhAMoA0XwSjz25G9Z%2F7Ql5pJ8TtR6fC2Wb4NQilXfMUV2GKv8DCB0QABoMNjM3NDIzMTgzODA1Igy98bIa8qFhCVZTGnEq3AOhu%2FraSooLOHiKuPhpCJ%2FGzYLuVRpyfdeQJbSjK7t0CQvUV80j0uBr%2BtzHvETinldFxRU70Ih5GCbgTvDRYdL5PNXGcBn%2Fr1tsAtz06M8Qzp3fX5SoNVaqbdwZyEvoIUBzaI%2FpqnLCwbnZDCpy9akdBeaI0cCanX3VqEpZUIhCoh3N8Q9ICf8sMV%2B%2Bn6bHI57YHgMZ76t6vTsxflyozYIEbkvLk%2BxVDSVnrJBzXKJMj%2B%2B2WAJEGAiLuBEjdBKFtEfcnjppPpnzxWbQHw17BPwY4kEC7Xa9kXquJzEHWDoPuTbde8ZJzDiUyJAtCgA6ODdTuXyVFwMdxYRT%2Bp7b0busv3uk478e5gp9NSONyoTB%2BG%2Bm1q1FwGpuNEat6UKbewJIDLBxffvI%2BLC2IVjMv1ZeQevRRWYz5RF%2BWxf3RKlgFvb1FxhyO7qSuXg5zxBiGROVBKfBxsrEvAszyIvqHqcW7PJXzaMAjwKoQJRTN8bB%2BEyeTegy8fAM%2BDZU3Qtex5oH8uLcevHHUpbW7UJ%2FQ5Iq5LtYN3PoT6AwcMdiZpSzRjXaXl2n0tqb7dcgC%2FyZeBK1AOfWgXH1rGz7fypr6YVVPbrPIQ8OVcO0hOzGUiAaBtmKl%2B9wV6SrbsLXmTC6rPnQBjqkAdrtC5tZgFGlQeLwcH4Vn0qHcgr1%2BMB9jL6XUCNmK0ueLdaNG%2B1lrLZgIJjnD0svpvjSND6%2Ft7RVACnv9jSyL0oW0PsjzYHBGA7Fofyn4YTSmcZCBxYruTr%2BMk%2FFcS34OyaaboZ034fBL9l%2FbE4OnQd2PFT%2BzVT0zRHMzBwxz1LeCAae3%2Fo%2FiRR2rquyClE2hcCvJ2xXSCvnprQmFV2cEQR4S8Xu&X-Amz-Signature=ce316ebf229ebca63de984d3a288bcfde5f6754e9b56003d5b59486a06c0eb0d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7GXC63P%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050224Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIDIIxhaG47sLw9N6lhbZpygLAAy9JAI6kpBHHu1hEChnAiEAqxT0WfPRmX39ifn%2B7fLtUDZRfOcv0GXGB8R3QQOiru0q%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDP0akCM6kb2zhi2tUircAxTURNRr0XGj0RYsAiX3huuRRKgrR%2FIY8aoCArpudxUjtoRABm3wADqURHj%2FSXA1f%2FJJaz0fk3Qc78IkUPqU9ox42R9NqSWYYAm%2Fg%2BwCTR214mWK2dGtSbtdD9uSjU78oG2D8y%2FbxhE%2BQBQ9f6dupaRN3Ce5l2kDzFjS42l6EGOZtybNGsNjlTsRT3ejQ04w92LZ%2BJYkGPc4rSAaenx3OKxIQ%2B%2FWu1oDnTQhDbykZlbXhBlyfTFXS%2B6B7QC%2BrrTHLPRmdP3L6oONrCe5AURPrkRgnJ6CrSW897K0M2dCH3ha%2BKnretR1aEBbu0JHUkqWPZ3laWM3MxwwN5E1xR8UCfgyLtu16PBLV0rzjgyX7Ub4HY7s208tVsJgV8u84FXjdAYdS1EUjUMZlGysZxruxf1x2JRv%2FWzLK%2BkgEI%2Fxxvu7bBQqBfBlounj%2FqGXAyLmL689%2FcHh7u62Oj3EYI%2FZiZ3ZR1dFdbRdLjUu7apIpiK4gFrA4B6Btk6zGIQ9wb4Qxt%2BYsdeRiv7bZWw4W0Tr4%2B7W98wlxEBrCrO59wLs5JKH8OAejEvXA72pHvrOgrGIib1%2FF8C%2FOJOe7Uuv2XMv59i2%2Bslkk6V5w%2FXp2FVIPp1UHtsYC3tQ2VKCu1ylMKKq%2BdAGOqUB5Co5Z%2FTeaLZ23eClt89BK4Me%2FGIStqiqoS0gcFTjpk3846nbY3HIo%2B07cCBt0Hjum9Y%2F1w%2FsL%2BZj8aQW0iwjFb1YJMyL9gGy5H90m9PWhM91MyrVoIPfNRLH6VaJWXFvR%2FYBtt95LhVOmi2hT1Z9F8ECyiJ%2Fu8bzXDd5rklgt19VY9E1SKRQat%2FdSrQixCP4mYwfp4juASTNhB2S9gBoV4StE2UG&X-Amz-Signature=3a5cbaca7b5103e23e516d679246f3155bf9f4451319e42e6b480a72861ff5ee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
