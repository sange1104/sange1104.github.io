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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664MCKXHAE%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033332Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEZ8Ss71VVby6p64RJLSiBQT6WXODUB9ng1mSOjlbBBAAiA0UXaPYZ9peLIr8VmsHx2KMxruTrz%2BcduZQlxzVQlzJyqIBAiy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJjVJSq6lE1mhWq6XKtwDSLKP6%2Bn3F%2FVjhXN%2F%2BNwGYY2FJAlEkWc0Gr08o0dQMAVht1Dk7ODoAQOzeZMFu%2BI9onRmLrDDMIeoYdh%2Bkb2rpe0yREfQj%2F0oAiCy7Oecvvmha5Df8SxaDbSYqTsfIk%2BACScWsqCPaOb5oqcgIRjUfg3IEgoJJBLwLRb%2FlgTZa7SF8jcKCMyIzZH%2Bnm72JLjm9qWuVwv1%2BK6OP5FkoFbOOEuMAn9RfGASFfsK6SdtagPwxjRvFrPEBvsX7QMejpfJDv5%2BVDtt03BSXqfu56fryXDvzCApwoNp03gbEBa0g8Ncolflb39kank7nogKipx0Ku0yWfNKMwwSQnqNr5vujhLuJCdQqksnchZpGD%2FKpIRhNi8BMZF1%2F2jWtNFoX1B7MQzGQskqOvGJgsSlfoDzytSPj%2Bof0b%2B8mMlPBxGsZTU8t2GTrzGaap1SOMf%2Fp%2B5eNIjNOVqTyYNkTizlnRupl3%2Fz7bd%2FB1mqlLqTmojtnC1OPX%2FB255rSpF3fC39RNIDi76KGuLe%2BAZHvxPuMf0wpKhJ2uWYEDyTSr9weE86mF8MWdto1bjfxnl2yXMc8m2aEWxBFI2J0x9p0SMqyht2%2FUjQnTSKUvxH7IZBwYOuKSW92r8XhKmzP9urteownpHYzQY6pgEOavWswDnls%2Bjjz8C1XxYb15dqm6%2BTGjssJkSa7J64FrR%2Ft8zXujhOTyt%2FNlegKGXhWf%2FN4W7E7PVFBVkp88iHM85HmG4KmMx%2BdxLJlg%2BNKJWUiP17iTxb7bHuYmE4sY%2FvH7gld6G0Bow0zNFyVhcIz0zzh7alCFby3aI4Sz9OpKDqUZ%2BoErG%2B6Z2klVEmfO0VUpV%2Br9XHLglwWPOgLrvsfTaK63go&X-Amz-Signature=bae4fc273ffdf9483ac7c440357bf7285999f117c1b0105db57840fcb441c44c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666UIFB3RO%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAFgUJaGzYxTcgLj58vGkQMIsHp5I3LPSeSubwI0fc0xAiAMUyVXQoCQfC%2BfwbwBjzxokbonJ8UMgKTp1gWuP4LG%2FSqIBAiy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMYHIx%2Bh95o0vGf6ohKtwDo%2Fevf%2BFZHkeoWDctPIYfmVzp3RNyJ3VWS7xaBdpUebVFECFnRi7HMIGpSTrwNvZdr5vrV6WHpHbSmxVkLgh2BXjgdg7yZ2lqJtkMhJIUK18qQlz8z4KDgTWvw7QXS59aFoUsjTFjMtUBs3EKmTqAJLBvGiZAZTnB8qmzH9d7TgrEtDVJIrp3A%2BnSk72buo0aN3CbGt5LM0W02utbjVNbAi8ML3zsWeAXU4swA9DNbgJWdWoV64UUgpF3kwPZouWKQIJwuTz7od4skvMy054xAQ7w3QIp9sgRT3oa84SUK2Qu8%2F4xYZ1mZgoOdtnfaZX%2BVLf15svadwtRXn1I%2F1F5mLly4500yUulGah8guHbxDYXIFa0tbEILFoXQ8tGBxrIVLzx9EhXS45uGT8sH3LqrB86B7T2B%2F7I3qfFol%2BOkCnL9v0E%2FCLClLA%2FbIQPXZ9cQd3Zbpb93NZMKeY8eZY7E0G7vPLt012Y93yv8ryKr2h7U%2FsEpafh7XweMqBA8qWj%2B2sv6SfAeL7xA%2BR5DjAVs9ImxXPOt4bhB2QPVGSSSu2VvNDAwAyyd4OahUIepUQueT1G5A%2BnemOE4oF3u1yI6cmigS0t%2F45E5ul%2Fv5uQ2R9unZR1r0u3jIHUawww1pDYzQY6pgF65p8fxIfp1ylwBt9QOqQmwF0Ofbzy7a%2BZNK9V050oRoW3lGP4NolUh8T4zZQthauGhrTelWy7L6UYkau2AXJoHl73chB7ASR%2BNsuSqbJHTLOzVm2Ww%2Fvq2Ia2leuvG2V8xzgiDSeqgwSi%2BoZ%2F%2FFvcEnd2zVTELeBmovYAZ0sJiJbVHWLOmtdqf17cY3%2Fn0%2BftMdo09hE7%2BSzYg7SHhgsD5WVBS6HQ&X-Amz-Signature=1769860d83c9cdb60c2e2eaa7a598a845f6e719003b4f8e61aa509e9d5aa4833&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667ESFYNEZ%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033321Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCmdYsu3V83lTz7ZSVmqtug2yrPEty8XHdjF9%2BbqYxG0gIhAMb0aYrycZU0ljrpzJJob0CLw5Ix3WPYa%2BHdFyXeIFk%2FKogECLL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igyq7TQceAqOuV79LRoq3APUtGlvGNFLgLpiev1Tr7PFF2Y553Gbje%2BZ9ve4TDU9ZDTqvh2pmo1LlEpzv3KwwyhxxsIYJksJPs3dAk%2FoxyyhEcwiQ0HSQp9BfWt0cY4IOxCDdDGiYuy%2F51lnkQvDoYEwbg3y1Cq4f72rkhH3jrMNEvY7P5obb5X0zuGcaLLsXIJ084NBJ3EW2bzH6pMLC0Jcovw9btRVn2kJzZLwQx1RMpkJtwnHTxLszR9ex6XV%2Bdd8LwqzeR4E0wKTvw3gzDAkGtQ9ZwplMBFPv5JYv%2B6szDK9JpMhJQ5gDXlO5TLS4XTJhr6DY3IN8mCfwTVXnDqCnUIdYL5i62JFzTOrI1uLj71KTqxyUGvSEE8bCyjpJFgPTOuq9fXIbvxd0Z2bcZkHlGX02PGg5%2FoKjtlD1tZ%2BI5HAtTMcPvu8PSnChMfcQkemq5opLUCDnSgIWBWk56bftMJttKjYaCAdHZ%2BXtkWSoweGgOaMWo%2FosmZUlKwmQqmnDNRNb64wvRAIf62eCLketko5V5i%2BvUtCd3ICjTJmQvInrxNtbBov0OTUCMy7djZsz9ZyI9UGntrPlO48wDs%2BaADoGiYO2Wv%2FEW%2Fp0eU9gzHLv0cVNri2q%2Fx0EV4PuY46VfnfiOmmntR%2FGzCWkdjNBjqkAR%2FDANeEbmLqjh%2Bd9HdqrYB9wSb4naIGuQKLBS37L9SxOhNlGrBYctskaaA3TVk4aIRE5h6BwQWiFmuXbxVCinTyXNwKevOV%2FFXe2BthhwNHAsfXPH7ReeSr%2BezalD%2BljeCZ0Zg0l3ZE8son2x3K%2BooyM84qNy10yRnVwSCZD0LztUTijaocFYBhyu3emxUqYVdU8Rm6SvjWGipLEjNT%2BJ3Me%2Bk9&X-Amz-Signature=9a7cba34a5424d6be03d55742fac2e505681822e95228c8566457f4075b1112b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667ESFYNEZ%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033321Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCmdYsu3V83lTz7ZSVmqtug2yrPEty8XHdjF9%2BbqYxG0gIhAMb0aYrycZU0ljrpzJJob0CLw5Ix3WPYa%2BHdFyXeIFk%2FKogECLL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igyq7TQceAqOuV79LRoq3APUtGlvGNFLgLpiev1Tr7PFF2Y553Gbje%2BZ9ve4TDU9ZDTqvh2pmo1LlEpzv3KwwyhxxsIYJksJPs3dAk%2FoxyyhEcwiQ0HSQp9BfWt0cY4IOxCDdDGiYuy%2F51lnkQvDoYEwbg3y1Cq4f72rkhH3jrMNEvY7P5obb5X0zuGcaLLsXIJ084NBJ3EW2bzH6pMLC0Jcovw9btRVn2kJzZLwQx1RMpkJtwnHTxLszR9ex6XV%2Bdd8LwqzeR4E0wKTvw3gzDAkGtQ9ZwplMBFPv5JYv%2B6szDK9JpMhJQ5gDXlO5TLS4XTJhr6DY3IN8mCfwTVXnDqCnUIdYL5i62JFzTOrI1uLj71KTqxyUGvSEE8bCyjpJFgPTOuq9fXIbvxd0Z2bcZkHlGX02PGg5%2FoKjtlD1tZ%2BI5HAtTMcPvu8PSnChMfcQkemq5opLUCDnSgIWBWk56bftMJttKjYaCAdHZ%2BXtkWSoweGgOaMWo%2FosmZUlKwmQqmnDNRNb64wvRAIf62eCLketko5V5i%2BvUtCd3ICjTJmQvInrxNtbBov0OTUCMy7djZsz9ZyI9UGntrPlO48wDs%2BaADoGiYO2Wv%2FEW%2Fp0eU9gzHLv0cVNri2q%2Fx0EV4PuY46VfnfiOmmntR%2FGzCWkdjNBjqkAR%2FDANeEbmLqjh%2Bd9HdqrYB9wSb4naIGuQKLBS37L9SxOhNlGrBYctskaaA3TVk4aIRE5h6BwQWiFmuXbxVCinTyXNwKevOV%2FFXe2BthhwNHAsfXPH7ReeSr%2BezalD%2BljeCZ0Zg0l3ZE8son2x3K%2BooyM84qNy10yRnVwSCZD0LztUTijaocFYBhyu3emxUqYVdU8Rm6SvjWGipLEjNT%2BJ3Me%2Bk9&X-Amz-Signature=069df51a34aa8aae3bcfcfe2e15b3b98650d80dec36530f1f5bd04039ea66165&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S4UNUQCX%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033344Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC82%2BNEhC9o%2BNeNkJWuJiigQ%2Bm%2BnmUhA2sie1Zw5aZrmAIhAJzQqPR5tETZW7vRmKRLnEWO%2BgftPDbU34FT%2F9iuGPZ7KogECLL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzHwqzfJIYDHmwSdn4q3ANvHrvej924mP8hOUcrnqrXhhbJWGK4NrC3LJD%2FwPtAm%2FZR7N%2FT7304sxl7I3NhzXVw3BBbXpDAHNYnEdbniTj3cqgyLZSbkU3y6TFCD%2Bk%2FO5O6M8aXaQXbu5Epnkp7mwjMgfbFgK3XW4Ove2rnDFBjszGyczob3lC8J%2FH0cKWwp89Ov3TAPSaqpD0AxkZP%2BrMnpsJVQbmw%2FSKxPjENkAjy5%2BYGQEqUT1oC056zqyuV6sLS1CK2C423ephPqQybfcqgjgbMtHUNgxNz%2F84zNMUmF6uAk6zxAF6puNkiYU0k9wMoLDlthHdNl18HQy3BKFMpOlxKI5uifSDtXij9703dhdKVk9gENk0Vyc9EcpozP2H5nDvDbSpNPP16Xzz%2F4fu%2Fvf6B9p0N%2FjtVdM8r5lS%2F6sjbv%2BkOMcbk%2F6pUwECw04q0p6XCjAuaUcGUasPwdzkqqNiRKsy5M4tbwe6vXqywJ3IxElZ6xYCKce77G4lspAN%2BGwUGr2T0iIjnTnb%2BLXy%2FN3OcsLBgL4d1ySI7lyRmXli0dVglMhZ%2F18n5WhjnSzIZId7wvnjZXrqLBQTOx7auvUZKnML8dNH7J2Gi1axSE3e4s%2FOKs5P0Ur8bcWUGluqsYdCM30Wqh8lgDjDbj9jNBjqkAWN2xb1AKiliL%2FBXfDetQL%2FlHNif%2FJFbukWrrvPwmrzWjEQguVNEk4jOI7YrqnI5GxTQ7gr2tVS3wuY0BTc8m9aonzXAI%2BIh1cHK5yOlp2dgIW0pM20zNLQNzsuej6c8sHsDRZUVFZbHD2rPNFeR35OBNNR8g4yD4xq4ue35iYa9TcnD6OtvnSPOpn3TUiqt57TUzYI0oLZZIE2u%2BGFb7IDTja8U&X-Amz-Signature=706ae11e9ea97ceed1bd88144aeaa21235fe582169494f0e36a7bc70324d88e3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RLAE5IJO%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033349Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHrsO20Op%2BGovS5p%2FnJfV0xi92z5l6u29r%2FxxWrvyJ0uAiEAh9zQwCy9wtPJ6nApIyOcu7gNlnfSviMbJc7bKwwDgdIqiAQIsv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLxZt7PSIRN%2BA%2FowZyrcA4VDCncarrqVsEXjXzceSfs0Hdi5xkNC9Vx%2F9zV9ij%2FzcYp2jxJRnmdMNnXqJi%2BRQLSS3sehqco5W9tbqMNHogZwzLp1RPE2FcdRGNaU87mwFrZflZV68Wt3uSUldz4Feyzw2nLbGV56MdyscE9Txbd3GX00OT1rOhriCviiC0mct3lITM1jloKW3ZnoZKenoTSySStj4NuMZZozVDoSZAZcilXfwHsBQ7ENOcqwq3TOsOVuZSu305MsenRP1dCBqYXe1TPXXHqOzUGRlwL1xy2062AuIOr2s0hxCtIL0bpWST9ntybFIZ6UWtwCqbjrcMmnxlAOWkcNhvHs8Zx%2Bxee0XLWRsgLmEvcuYgxpoUz0iKEqzPQa%2BYrTWXUXnbn1HKQbaWy3gWH2QUmqSCrLNDxanO7IDMtMXefnAgtDzaht0usYh0Jc2phGTU3pony1pxN%2FY3X3NbYEUOm52Pud8iUqnjxNFOOkGqZr3%2BmxA4UMYTEOD9jr0g%2BqndJkVpNGDnvW4qYoFj106zfNPiNJ3v29Xi%2Fv%2FgLhXPk7qaXa1a57izcGiQ5pnt01aHlZ5MIk0BPlgfD2Np0ShiqvMhApjVhBk5zYjuEZfoV86fAjLDJz0ba2M3NAqD16k7yKMK2Q2M0GOqUBsvGl6qIxHQEjNlNZdDCbwIQhAKQ4v4ylmeiQzb0Eh5dXfIruZOiOrr2%2F92ugaX8QEaW0n8RwFKhkrQDHJUgEAOierAEK52dYJo2OJKAx%2Fo3v%2BebLtxuOXWgXZ9QenGGADCJs8owrhITlQdA5JaSPKvuqT7uS10p3TyCbY1pzfuO6WqTVPJElhPKZRAQRI3Lc0ltY6wnuVKZsG2cVU%2Fm%2BJwAqk%2Bcf&X-Amz-Signature=807ffea3eaa930456140dcd7043deac87eb6c335aa0e1ec7270304190101c9c5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LJGANFD%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033350Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD30uHO4XvKKOkiDC8x89YqcTB%2FVmBQwgpWrgen7YsNBgIgK0JRXb9sVA8rWDIRdWvYHnEXXnGHxbCCpgNuzfutEPwqiAQIsv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPziamZwE7MEqRBBzyrcA6XEmJIjWrlfPGkBMdkfb9B481l6OJuEGkt5%2FptBEOCKmtIEd9iTpGyzXj%2BUkFk4euEkwrN3%2FmdNaG6Cv5WeLniT2YRjGoxpyPQ8XPvCzJ8Suwv%2FKuUSSPTrQVlra46s42zbBT%2BoSAbnNaxAZpfA6FGiJdxdm9VE8mBAAkyY2Fba%2BdXD5BbCszvl9wkFgKgUs5d7l6L0HI7h6YddRTpYSHBcggo5drnaxXfexnkz1IfvbDAA6xjQW7pGHao2bcbWeChhZPVTVogiZpRQ%2FQY%2FTi4DjixcstL8SotcxJdTy2gIKizDzxNIo76ANnWCGUgt5HNmy9NuvlcsvIblV2WxElOZfqTUts0HsygNioUt4KHKz%2FAWLDsi3O38YHj8M9kKsy29CCTO74%2FiddtQupLCJpdvV9LzTLU7o3PA8VbgAx7zn2RwyQ%2F55vM4g2vIs5S1F9TBS3%2BUCuzk8svWtV%2FXXXrs8OXZjKpw5LS8KX9b4yikjQK9anSWwF3oosYp0pFOPUQnZYxaIvj6qy0JvWDsfOn3jZkF9uemhWJtKJp4rc5KAhVPw5%2FxS%2BGmekfaKyj7yZlsFwuSg%2Bbrz8khxp294vpkeLTH4wQ8a3HmcIgse0bJAqJ5rHNX2uhyjwjvMJyQ2M0GOqUBT%2B4fHssN5Srsyi8DK58ZAj1S7jSvCC8COfCg6RGTDLmrqC328jKsF09vAFZ9L3RzIiQi8DlfI8jjVD8eoCOlONzxG4xhCrwaNG4Tl0TX%2FTszkES3xdRHGbJEo6bRXYjqPxgDJctQDOL5tnTSaksVXHqJxel9aDnd32b7Q2yZBzJQOxrjE7DglgNNgZv603dr4jO6eqZyrf7EbMkl0HaXg1fiA8v2&X-Amz-Signature=3ffc53e0f96e847d07389873ab5965f89a74b5df1258154a7bf6476a9383780f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TLP2BPTG%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033350Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFtHkuZxqv7u2EnckAGUR1ra%2BFKdKPVNhvWTSLLpk7YaAiAPqqyH9fZj7PEDXORL9l2hOCPW1faULudLdUWY%2FkvCDSqIBAiy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMWZN%2BiqBCJ%2FcyWPWsKtwDG%2BDWIgni6%2FbaN9WN0laZLfQj0y6GTg2SCLsGkNEqmaye9OBYzNxdm2IkOIPFfQsQNBRJTDusjo8hRREQDcfvQCNJrep8Y01c%2FlPsVdKivZ5B8%2FpI9725siF6gc%2Bm8hNV2q60e14MxcNo7urT%2FktDJl%2B7zY6aBmiPgMh7KHPP3aaDpUJ6OoxVw%2BUj7elRG6pI%2FgJp5GY5RIa0P8Wo8piyT%2FsdLG90XaN%2FOPzBd9AHB93PUV2xU2Pr7TjbKD0TTc6CLpCfQyPzRCNl4Hd7hWmufKtBEOD4nEK7AOssex0XmZOdvFh2kwSy46TodLF5GTZbW773BYxbqA81n9A3cuk7mNgBdHmOeXWpUrP%2F%2FBMfd3PcLw7k7DmaLougPCyl9xlLZxqcv47qFweWnJMZHm7A8AZbWOrdDLuAfkrj7yFEDqgmMGqlebTy0cH8fPGrkAcpygTKfeomKYcS26In%2FxxFUYjzdYbes5buAwewb2FjlaucxR67Pt5yXJfroqRt84zZz1acYR2Y1C%2FeFDNRZQCKnzFmcm9Bex98lRTJuvBVRbUUBC9Gsv8%2Faq%2F%2FG17ZCcaCjT8blBd%2F4%2FrcpSCnY4klK7m4DmyU2Z8qHCpcREU9%2FWpxoiwZYPRXMLY1l5AwgZHYzQY6pgHRBOjbiOiDNuxfrctPHxHMOoBD3aoBvQeCKgMcGLZNMjXugfc1U5yqzDg2841oTm5pRuHMuZy1F3jD5jdWNz54nadnpn6ogjIOQrmbQWB3QNpCMikm7Ffb2mnBqhZaz6GebofNUeeZRT2I5r6t1AuYhcugmtXvPp9s0ya54EcOhcBHInquCQ40VGQaLAGuVh624JQiife24meqa%2B1%2BJvzlzZIsyBDW&X-Amz-Signature=53fa28e85b0063da55abdb1d39ed5cf4ed3e488e22d95739382b17f7e9cf24c4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46632AL4T4N%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033350Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFJnPcTdcnB8lhSaAz%2FKM0%2FrBsOAII3vxlVEFaURcIW0AiBBXVwThMerZA7DEu76aUm%2Bm5GcdILfJnQWyZUj78jqHyqIBAiy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMN6k5JByfkSOxPQV2KtwDwkz2tyvSmz%2BHQSvWxHckvq0qbWV5T3FdL6Is4cahBXeU9EOD6r8xDUXTsIV2T%2Fxaspa3z8TmSNCfKgZe%2FhuOb4qQYdjZjjgOAbCFFX7uzEUTOoGZdskOs7cE4RMQHBZyMqdikFqhzBCNU%2BPJXpHpQoeXquMCvUSLoATSO2tf%2FXi3bDPUzogok9DVmsOhj9ECWNW5U0hKKpEpCE7ZWY9rVRVLCYXAfFvrU4c0Y2m3bTIBMw2W3b8IxN%2BIdtnAcoHuF7mGje7OKqydv9YPxad1U38tj8q0l7PJN9aM84pithMXyv5zTdfEWCXgF1GgrAigg%2F4U624AK1jRiF%2B%2B%2BHBKVsQIMxveBI8YZHIeEZrbTyfkE7nvynX6L%2B1x%2FYO9n%2BM3%2FFsm2FLoFP1IIju2qMRsE%2Fa3RJnzWXlXUoE4PFuMN2g31Uo2TOdO2J%2F6AwcRY0J4yr2Kh%2Fg%2BlAYyJFLHaLEMo%2FZocERezO0U9m1XnZ7CD84QUt4ZdTMxPKUUJImyQH6%2F3uqlnwHemY4d01Aduod5F8HPN5loSlzMKT%2B64qDpEmbYtlpMOOsc0%2BDkILegiJ32IE0hg0nxwoB%2F31OQstn9ZrYicQh9oByIVbb%2F6Zt37Fu3FBsx5JWEG2GH3WAw%2BZDYzQY6pgGQbkFwejEPfTpgFaWQvkpxL4pJcTSfpolwGm0zwX7psBTlsN1JB8CktsSnKll1LYm357PKkLZWtFnktI9cNqyLE6lrPUWvtTZgmns3L9%2B3Eg6aZHEL2sdzU2%2Bfbj5L5x4czBPjXuydeqJUXCMAJF0R3WDKKKdA9Ijt2MbY7YzOAV3FrHq4iyGwWznu8G8%2F%2FHyPgkaDTICPaQs0SFaswP%2FD1C63%2BTc1&X-Amz-Signature=0aac9acc06d816789a1806aa17607165ad79cdba295fabac6ab6316b9afe2c73&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667ESFYNEZ%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033322Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCmdYsu3V83lTz7ZSVmqtug2yrPEty8XHdjF9%2BbqYxG0gIhAMb0aYrycZU0ljrpzJJob0CLw5Ix3WPYa%2BHdFyXeIFk%2FKogECLL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igyq7TQceAqOuV79LRoq3APUtGlvGNFLgLpiev1Tr7PFF2Y553Gbje%2BZ9ve4TDU9ZDTqvh2pmo1LlEpzv3KwwyhxxsIYJksJPs3dAk%2FoxyyhEcwiQ0HSQp9BfWt0cY4IOxCDdDGiYuy%2F51lnkQvDoYEwbg3y1Cq4f72rkhH3jrMNEvY7P5obb5X0zuGcaLLsXIJ084NBJ3EW2bzH6pMLC0Jcovw9btRVn2kJzZLwQx1RMpkJtwnHTxLszR9ex6XV%2Bdd8LwqzeR4E0wKTvw3gzDAkGtQ9ZwplMBFPv5JYv%2B6szDK9JpMhJQ5gDXlO5TLS4XTJhr6DY3IN8mCfwTVXnDqCnUIdYL5i62JFzTOrI1uLj71KTqxyUGvSEE8bCyjpJFgPTOuq9fXIbvxd0Z2bcZkHlGX02PGg5%2FoKjtlD1tZ%2BI5HAtTMcPvu8PSnChMfcQkemq5opLUCDnSgIWBWk56bftMJttKjYaCAdHZ%2BXtkWSoweGgOaMWo%2FosmZUlKwmQqmnDNRNb64wvRAIf62eCLketko5V5i%2BvUtCd3ICjTJmQvInrxNtbBov0OTUCMy7djZsz9ZyI9UGntrPlO48wDs%2BaADoGiYO2Wv%2FEW%2Fp0eU9gzHLv0cVNri2q%2Fx0EV4PuY46VfnfiOmmntR%2FGzCWkdjNBjqkAR%2FDANeEbmLqjh%2Bd9HdqrYB9wSb4naIGuQKLBS37L9SxOhNlGrBYctskaaA3TVk4aIRE5h6BwQWiFmuXbxVCinTyXNwKevOV%2FFXe2BthhwNHAsfXPH7ReeSr%2BezalD%2BljeCZ0Zg0l3ZE8son2x3K%2BooyM84qNy10yRnVwSCZD0LztUTijaocFYBhyu3emxUqYVdU8Rm6SvjWGipLEjNT%2BJ3Me%2Bk9&X-Amz-Signature=ffd571a30af9ce62248f0eb0987fee24317b86c371a2b536f85fea4857cae30a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
