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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4BV2I33%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040702Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCWnzC5XN2uJ%2FVO11EyGXzhn3wDcHol1endpNHDRAdiTwIgVRsAGIukw%2FEP8sOnt8LwWQpGOHIo%2FEFbN5Xlm0grBjwqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDENrqRYnu9kLxw7nqSrcAxe0c5NPnXzZaCFHZdNiQIrerX2EhbWCYk0lHSoqalGVMvf0YKW%2Fa1asNUTS6zjSZokk0bkF4KJARnXvwpHlS820MZTtlCnJCBflF78oT7ljBVDqzq%2FN7COLOcCis5nwFxH98cn83ptVke2cbzdPilq6Eu308D010FcgrUVMSKEAXCB98zTT7W%2BtgpsD%2FSfcd5ehqeR8KOGmZ67%2FjvtyrJNhPhtGZcLqBA%2BT6eXE8AxGtUDJMEEHxodMo8G51j9cV6Jes4hZpxQoo6G89VWMg%2Fbuz0hMZtsJjZPMrKvsyWlgHEl6HGB9ZveMJ4LPMPtjDX19GCA5YbTzeWiRWzIUyd2bJfPJ29w2hk5W6QR0nUaHuq2uWW6kaji5lzAd8ZngBVGwYCmnfPPCagD%2FibEP%2FRch9yexfGA4QZjs5WVq%2Bu1WmR0y3ujRotDViUvU8Hlw0uOYcE%2BuaDDSytHJbCBYwbsg%2B1Q95FC1NP%2Bx4b1pgPjYhSPh8yBgQUHtL01En%2BqsEaW0U9J%2B%2FWGghmbL00YIm%2BLGYGs9SkWvCiM%2Fvg13POQew3P8xepyaKSMyuOpy8m42l4XVvd2GtWAgBA%2B9gxN3TzeSd95X3lIh8hFEi1Zbi%2BpVbjdEnQOjCRJIAtlMOqI8M8GOqUBIAnG4CuVIVahvdBLXJRwpd34ArgDgqmpwiSowRPuLmkfGueNT4QvQi6HA8Cuu48%2Fjh0mGV0PfywYJGASN58mmjT3nrTQ%2FewUybiRD1JxN1CDBkXiRZZRzvWLKSKApKQch7uFY77eI0rz5biNp%2FP94tg0Sp5Imt5gIVo3wJv%2BM%2FhQAhqOVDHLylsqU6if%2BOUsXKHQTj3VftY5L6nP1I6Q9xAcRFn3&X-Amz-Signature=15bbf9a3027b0bb27c32fbba8c1fe09bd350041a45372e0ad333697ff0b3ac6f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46654GMQYLW%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040703Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICpQryIAajGuYDO91HjCSkMHc1eNyNPJPg4M7Ct9CsuKAiAN7EytBOgMB1Z%2FXB29lxQqS8244pL0d%2FAf9q%2FWcti5giqIBAit%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMQmVYHWZ4ONYSCxvNKtwD9yJyrpAGzxGp1NW94UMgNgXlZ19RKVyzHn8sltvkjyaqyS6sICTrz2MnCMcjmdDq904hRlgFBT8zq8fVItHzIteLp%2BK7OSViYyMdzi2j45rEZusN%2Bqsce%2FRK7014Gc3azKaSG4iItKPct00kCWBsK6v%2FXwCAQugbn7CalAWCsPaZ5ndwmrH5ixWAT02yFE3uJHiC1pY%2FPFemZqMNBkxnKgvLsDzr4pUDkFJwKOshXBGfkML08LnIyOHZPRR9cQL3WVL3yjqUOPHtTMU6A9yM1ix2Gorm4hL41jiLs1d8tBwvraxYowns0FRNJBJSxJkhq7n01wrQdtFjPQ5ic0dNjhxgROFHUhGHZHfQ5Tp1TP7RttEfVOaU42%2Bws3QzNLKOSFAclQeHxYgJX8U6L1TCtZXC6%2F6KOUIVXpLXs912luoSmPK1dBi9UxTGjx%2Fhhi8iRZOdZqCAOA81hCOt223W5%2FO6%2FYXeWxyoMOsBhU%2F4MbWbdFRUvjhUitYVFCbVb1daE7s9qyAtgTsOQunAph7Agn0xThwLvWqt9JGCwf06w1asvEKXb%2BvX%2BnOtM4vmoZQz5ZYHhZl9czgjGU4YsdiC7Vr0A51IcB5xwh5fxTehAQ9Zk9sVEskFM3GiOXwwmJXwzwY6pgH1caqcuKeD56CL6%2FiOH3mHnSTxlUfY9cynmr%2Frh0WySHS9OPA7mo4eJsrHundBTV2Hzc3LE9H00IpLNX0yBqiHH0%2FexKluhtSidIrYYTIpvhpbNhc%2BZsLuaGzQpQw4GoDgjjBWKgRmRh8xVJ0BO2o4XOnDJ%2FKh5P7DZrzDk1AsgqapaZZR%2FFy%2Ff9mapiPhqUL%2Foe%2FRmbSzINflL9ckxjPUC%2B%2BnTOwr&X-Amz-Signature=b2477290097550e023b31eb009b1696273b59a0e55bada934c6b98356ad08e8e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UJUNHVAT%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040657Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCcOWfZGNOxyV8M4pYnTgDtpVlUt1ZKsL4n0%2BzHuwV%2FgwIgMYSuoVlqscbyIksBWUSO6ykgCSWOAV0KXdNKi8fFiA0qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKeAcRU3Zxfzde7LmCrcAxMmawJX6M%2BBRRMN1lHSIZjXTKRKl6tSw%2BiW0awgsnjsbqAhY6%2FQ1GXMctGYRk8T057%2FkX3iX3gnKVLG07fJo9ifjCalpXkIv6ca7uZFzqkT1QmjkxdtaOjZMojOBUGSY7Alco8A59jlvXvtiCOKs9VefM%2Bl5v%2BxkFL6AFrMSWaeX8mMTE0QJE%2BSiHdxT8%2BW2vbtImY5DWCUMAqH%2BBa4252QrzeZjI%2FJV3FeFhaMOLsABHDdUhtu2H0YWsKj1X5oNxHfbhYyGG481%2BlnzrU8%2BMkSG3iSxH%2BAHhAPVMvG0KpHIUt5HynFxvQ9w0u98NGhpxnYVbgFIJN6BAUAjI7eJc08ejy54cgJKP%2FbhcZDVloWTvysOmT35AAmP3%2B%2BWWQQ6VMUnX6Z%2BhDWRcBNprBLQou9KbAd0sxJp3a5Z9oPPUjFD7MVsmJtNLdYH1ZP0yCgWrzE41z4KgFgmVEO%2FdTEQb17uwozgW%2BNyHQgRNyGfayH8lLdYEDEv3uf2PpaqSMz9%2FvFa7gMopupM1A1j%2FT7eCxNxV%2BGH7NF4oTiO0vobKy5v23UiNXc5JsBCswuzFZv8tPnkv%2B2E7kT8cMO5mCX7vacJ%2B2iG%2Bd7gPKT59cKk2u6OzQU5xYQZf3ztOeXMP2J8M8GOqUB%2BPCw7%2F8qIFrNHhtKcuZvcTntHk9QAmRc4hvMz7Ka77Lplqamgl%2ByQ6%2BgW7dK%2BmuLxaW%2FYxZ6DnAde6H4QuopFKCV%2Fu2m%2F1aubs9hQnIGPzYo5f7kLotyg4zPTa8%2BFuWtyNA5GCaz9nIyMcg1Wb%2FLI3asOrRpq5ENhTS0RvDiYXBxfrC5%2BodSyfxRJi7QrsGJ7YhH9PxpXW9yZMfkSHE4TAwzzI%2F6&X-Amz-Signature=c6b4f058d40244b2f7cedd9e3004c6decff7449da74322c8e4809461ba037a33&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UJUNHVAT%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040657Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCcOWfZGNOxyV8M4pYnTgDtpVlUt1ZKsL4n0%2BzHuwV%2FgwIgMYSuoVlqscbyIksBWUSO6ykgCSWOAV0KXdNKi8fFiA0qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKeAcRU3Zxfzde7LmCrcAxMmawJX6M%2BBRRMN1lHSIZjXTKRKl6tSw%2BiW0awgsnjsbqAhY6%2FQ1GXMctGYRk8T057%2FkX3iX3gnKVLG07fJo9ifjCalpXkIv6ca7uZFzqkT1QmjkxdtaOjZMojOBUGSY7Alco8A59jlvXvtiCOKs9VefM%2Bl5v%2BxkFL6AFrMSWaeX8mMTE0QJE%2BSiHdxT8%2BW2vbtImY5DWCUMAqH%2BBa4252QrzeZjI%2FJV3FeFhaMOLsABHDdUhtu2H0YWsKj1X5oNxHfbhYyGG481%2BlnzrU8%2BMkSG3iSxH%2BAHhAPVMvG0KpHIUt5HynFxvQ9w0u98NGhpxnYVbgFIJN6BAUAjI7eJc08ejy54cgJKP%2FbhcZDVloWTvysOmT35AAmP3%2B%2BWWQQ6VMUnX6Z%2BhDWRcBNprBLQou9KbAd0sxJp3a5Z9oPPUjFD7MVsmJtNLdYH1ZP0yCgWrzE41z4KgFgmVEO%2FdTEQb17uwozgW%2BNyHQgRNyGfayH8lLdYEDEv3uf2PpaqSMz9%2FvFa7gMopupM1A1j%2FT7eCxNxV%2BGH7NF4oTiO0vobKy5v23UiNXc5JsBCswuzFZv8tPnkv%2B2E7kT8cMO5mCX7vacJ%2B2iG%2Bd7gPKT59cKk2u6OzQU5xYQZf3ztOeXMP2J8M8GOqUB%2BPCw7%2F8qIFrNHhtKcuZvcTntHk9QAmRc4hvMz7Ka77Lplqamgl%2ByQ6%2BgW7dK%2BmuLxaW%2FYxZ6DnAde6H4QuopFKCV%2Fu2m%2F1aubs9hQnIGPzYo5f7kLotyg4zPTa8%2BFuWtyNA5GCaz9nIyMcg1Wb%2FLI3asOrRpq5ENhTS0RvDiYXBxfrC5%2BodSyfxRJi7QrsGJ7YhH9PxpXW9yZMfkSHE4TAwzzI%2F6&X-Amz-Signature=c3141031640ea04a96447ec40fdd4035f2bf849c60771f1c4fb6154921113561&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKIQF7RO%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040710Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGguhhLe8tDh%2BcqsZXZldFDDv5%2FEevfgUCA2ijgV6myqAiEAiHtXrph2Xpnwk%2FLnyEfD%2FX9zPaUtYFoE6AuNYm%2B5YmUqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBIEfAmkYObiny452SrcA91ML%2FoUrQp1j9hbDuy6O9F19uZJZr5dODx67cH5C%2FBSiWspZeTDrrSOC6e%2Fr60VT1h84UiIWmfwooBaZrl1LXPwSImQ%2F1tleNxoEToC%2FXqSwgPHQiI9QfXaxWzCNTYyH2B5n%2Fx1%2B0D77EbWllRGZEcTEiih50JPbdjBIMSwkWNATZZAr6ssdKFm3qW%2BPNnIBE1lgcAXbdcdDsLwcclChrDkqhODJ8MQYv1z55RHl4O%2FvvofMXGilKECScXn82fC8jL2ghXu2ygGlbQKCw1VPGqoDvONYubJIfUQ4z7HKpy3Ycw38s7kMtwnxIiXaX%2FM%2Fe0ztMrrOYE1vIC05beZHLoa0mE1DrgSG6D5ZDe2QCVXa3I77jp7AcoBBpyEdANXlJDar4neChqbisgbdS1iqskmg40vx92ykDbChLCL6IjWMB7kY%2Bc27%2FLq1dkkQPjdlIUNz4qPGjUKoXd61Vy%2BxMqvrH81BRaiIjSRW8cArlCtD8dZBgcAvepEuw2kDO0tfD5w3mJy0J0EEqhvokODgyb2%2FlFRL22%2BH2MvkpX6Uln982phcX7uy2Jtlp1n2noqBu%2FF3ubshv7H5WsoY754LfUayXO4PQDOxkU9epWKkiPWQM659dvGhUW%2F%2BILgMOqK8M8GOqUBK0%2FV%2By5MV9zMHaCVO1JqC%2Bd0zasxUQvnXSj8%2BVqhTLzXKjp9Yh3l3ocHoxGhXttYB8lvj9RGqfx8y%2BJmPtpl0KEwMzTIxwQ8A6M36lqArk4quvHKrMuM6RULd79bjdhJPkAEATJaHSKzr0i7u1OVYK%2F%2Bwz27BwmqJUsVyPp3LuwityfQreF7veT4bII%2FGJB9j0ZoRYum5MkCv1OK0GJRLFMcg%2FZN&X-Amz-Signature=71f9c94c3203f968c79d5a82d8cb0402013badc98afab292d72272c8617fb8b3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XIKQSDUQ%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040712Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICkSjm6NolsvSF6s5sWph37kt2AY9Z%2FJH75YTJMsZfizAiBxeaLel6ohcHwBOMkKbMp4YUwZdOp6aJ4oqgkw7zyZ2SqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMdGkrWkH7S3vgtu%2FmKtwD2AoaZPvV1nLSxpj9SCLD1XOSTN3OnQ9rd9KATMMJXgbbR9nUcx6IhDGr7sK2jOr6nk0CWAZsv7nBbesEqfmlS%2BJj23hTcFYLKdiprCaQ5kxoL0VHFfxxCjd2vxDCowhjDex6qmNP93jeZy7TGMYC85uRu6iUznk%2BjjMf%2B6HkpCgK4DJT%2FWT6%2BFvUWhqUH3fS%2BEmsrWP5dZkin5mdECLitT0sly0VYVR6u41dy9463Q%2BdKNNPrt9JagtPYNhopgtaTnocE0Oa3wpmEx5puhHNyhh0nbrCua7VkXDRQfi3R4qfPNeZWzaG2nX3Sad%2BMf6JFJbqDzWAC35k1UfXj8ZPDj2X7L3xi2S3AylZR2xU7nOwOOL7tlrn%2B5bqAvrxnWp4ZpipIfWdDOebCknzeY%2F7YdB3UraZn951AGHmOPPz%2BoYFId7pqf91zuhv3DGTKcVoI7ZfCJb%2BrIgAJacjayuT4fofJKTsrNfcWuuqMzv9v9W%2FD38z0dAVkm8GEFiavSacr5C2UzBr6RpZwAfqUA%2FOk3itVVNRagBrVxmwIkyP4uv3jHbjpqoc9D214N3O%2BRZZ2Sgv%2FM5IX4m5SaVKOhkc8yYSdweFpwyh7uJaaPdHKmBV790li9BFH1YNSlUwv4rwzwY6pgFVw2LWbZmV1uvAa0ZLettps%2BjkfGUPbsVpGY2WSerCZk5EMcW6ZCij0jUd%2FOQKMYDayZvawO9Anr%2Ff3mxPA3R7bXlsvXL2rdEj34dfcnCZ2UKNNoE4VdPMnqTAgBNtKJVeylXLeVqNNASIYkgFD2RDM4Mro4V0mqaVuvUjRH%2BpMhSR44t65fne4vzZidT291fEnT651Jso059Gbqmou0WBoTBrQYM9&X-Amz-Signature=524252d633a3a67612eca3a0530f338d1dc7ab50985e15776dceaae4be5f0334&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663DZGCUH6%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040713Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIC5YqyK%2B6s7L0IK%2BDo36pyeH2C4ryKu8iYY%2B496eLE19AiA8EW6ozgJltw5C%2BKyVNjDZunlqHzFHpS32TpE%2F78qC7SqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM0Xt7AoV2zZEdeG%2BlKtwDcfEvS58h28b019ZdXW%2BS8AJ%2F5Y%2B0NAla6ctvPeqKhqwcGhPxDTfbapEwuelMxKLU8JU5A2cJ3PQLdmYdieQtEjjfWDk%2BwRcrV8px15rbvg%2FULfn4WA%2FYbwRJb2CWGrdcngj1Yu6%2BbwiLpOGgNi2tcSvvfq%2BnerkqKuYS%2FiFlJ6isDpnaWMSNMfxqfhl8xyDxWNyMXQo6my0KSqdPJK%2Fz8gdlI5ATy2%2Bx0xEDtxCHZ9VbK5p%2Blm57gLLsXdKpgvVcRnzkTC7rzMUKPBJVTj4ffm7tCXICuHjGekEcGv7IgNxwUQW5TvBy33%2Fj9jMfaLU6zfQYm7e9HNFeMgGAlDBNCgY%2F%2BRKUQ9vDY3K39cwPqaefdjwSBZgxbQimllFbTjTCmiREtk3uF898W%2FtHpvTPAeLUh7bpDCfsLtYPZ%2BwEBkwJrL%2BMiSUKvnYqb%2Famp9oRiRBnmX532sDVSbj3Se7f%2FgqkHNSM7IUIUKcHH6Jj6Xg7gZG2KtUqd84K440CX3CsNWQjwSkmPCSWPoQc8rusKaBj96Hh7z5yom1Cnp2SPKjkbnW%2BTJYnTafuNuuDGkTyN5buc2scPdiHo0VG5C8Nbu3FAMo3pv2RMXQ6tCStHjFtATnvh5BMlpIAuBswtorwzwY6pgFc65I4aJqQSguCeY3NV3LA9rq4voT9WD0aSIk5YYUWGfHvNMoLyE5sb3Te4wuwbFHJrfSHvv5evuH9vAU7d97149lNJZakXXgM%2ByTvgXCh0ZQyWKs5Iwqu1xwUf%2BKbvaaoMkknSFVs3wrDGZ%2Bkn9oMC1JPGz6gJLgCFXosfEZ64RnRTJPje1CzRnp8kH3ciyNqTtS8rc6mrQ2Qd8RvVETLLw47DzZE&X-Amz-Signature=b002792a9cdab30b40f97afabf32d3adaa482bb80b9ededcf0fbfac50217b25f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466577MGVVA%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040713Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDb5HjGqNyJRJAIig%2BhxFCEbwsOsrZl6UBd8f1wm2aBiAIgWHAiFnp%2FE4fD0T%2BnmgoIG4s84HzwcvUSY2cQ7NcSd3kqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCAtSBDs0DI69SU%2FwircA11Ci%2BMc%2FL1np%2FGw%2BNYMSMP5SefozWbupK%2FW602UDx9u%2FrM1QUolXh9q2oRHyfFSOUSi2BDsbnEbtKywvTO6qQfRNJ11mTViya%2F3DnP7nonIhm1RnSQv9F15B47S%2BtIxSpssNJxxQ1eYUfOcGY2yKq0KYip6NyRYNfTXNAAgCk7I0dkgSwuopR0gPNIFf9ICYTd9VEMpIU8s6Pf0%2BgqD1fAjePbLmHE45szGKhYCRcqIiFmq%2B9cfSWMfjyoGW0E0YuYQXRLij888q2MLhTqljEsI667lLAoNrPzBUc35A3KV2i5gJ%2Fu6L2QKg0QqJA0NSflg2TKyPKDofqvCkGl6LYObjOiDjUB51mKf%2B0okHrv83Blu%2FFzkSTBBVR9elBcA83DuaKxNr92F3TjWqKPF7L29tZE9faBTYMWMpEYJiVa0df6zRbh%2Fj6lKVnjZliInZ6cloONu%2F48ZAhO%2BX9llZ%2BdVrio9v0aQJG3kiLUaOntMVidDGQPUF7cf0XNeyLWvuyk7NIhDhhOiB5vAG6zaCv450Bb93ZCrZT4vAk4TfUpZjYuQM2FBb7eE8Ad9AaLWOxWJMlXgGKkpHmyseM5%2BT27xN1C36umS5ByOHM55P5cCW6wIZ34IdjaEJV9EMJuK8M8GOqUBtzRiurzpqKRYLoVTz792ALY1b9wEJX1Z%2BIw%2FaQ2VMJk9szCT76x59anC1AaIxeIzndm5Y6hIDgAq0oDr%2FITo5MSdTyQzqFsgdtna5hRIQdcwstNGbN5rj2HvgAtCBtuP9AUvrSs4K3uWYw5YqqSziD0iygrFaQc%2BOZQskOJgoxL2ahJKz2%2BnZ42dKA5NgA0HSgUTy4TOcK%2FHG7X3XAiKabPbrhtJ&X-Amz-Signature=9759e3b9d284875ec79776489bdc0bff4ddda4fc9a92ffa858f49d6e6eef36e3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UXL4VSF4%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040714Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCKp3TChbS3er3ngSQbqlmbKSt4F9fO06x7Ka%2B7IhQ3%2BQIhAJifqyfJFj98djbBsokZyzS9BJI02t4AtVd4CQTJDZ0jKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyNliHc6Q7roXT07Ewq3AM1O16wsTFu48rCj4f2uEBI7KD2izP9BI9PkhqLMjuX%2FeFqmJ%2BSosVJLHmQI%2FPqXdBi7TA4iPbp9yJmi5I9up3BfNRzGJPX2kxVqmOSLKbsGLQqtR2Ax8b1ZRKZT6SqETBAcienz3v2Wf%2FDk4IYgRBQ6i%2F1QoHrnzurQQ1XxSqPiygLSLTIUcd8ZgU8WYd6kQG2ok%2F6nalzVrJGwaO6x%2FaCRlroaowmk%2Fu7XyReBh0%2F3pB9mPAMN3yvQidDAkLYua%2FA8lEU%2BwuwrGAQ97%2FsaWqLIDiRY3JVVKG%2F0%2BuBqlcRUiU15F3eqF8DJ0%2B8hMxzfPtubAek4rq6CZeSGIGuxFyAIzDPagwM%2FMhtAjZRiplOxD7SgqpoOip2mtouzz5AEtOCYdQ0m4KLCVA%2FJIQTtjqsDcAzkkXAAxfU1GNYypDnZzkEitw2%2Fg44bpTevpZ4Bg%2FskIHneXixB5tKmtylTXLM0FcO1ENh1o45c1h127jMupRH%2BvcfMKcv%2BctgdoNL7blJ58r6TlhY5TWfcvmdl0aHe6JuSeBxAYTq4eEe4588Y2lubpsBT%2FufXU5V%2FLT0%2BTKKyHDUuSvNwqrm5rXC7cLstlhhnAKrVl%2FS4ygI%2BDJEonRIag5vzAhMH%2F0SqDCxi%2FDPBjqkAa1BoFFpOM1XtXnSXNwIj5UN5Wp7pDdg0fb9HjJgKSacfCyuNTc2DJAz2uYptUt%2B5ECAdSJUQFEMh3IaUn%2FQteIw9SpepJYAC5ARqADDuD6CFaiFqmS6u83dPYWiUIQBfM6nN5XmcaWXb%2FYiwivoeb7z1QlRopEXlK8%2F%2BawUPIBtMDHgaBHALByFBomLX4bWeYbzwtbhchZMCcKD6wj5ZgjNvwp5&X-Amz-Signature=aed11e88ab79e86b0f791b8567601c2d5d60646d0027a2a0c09c1c18ef98ed6d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UJUNHVAT%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040657Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCcOWfZGNOxyV8M4pYnTgDtpVlUt1ZKsL4n0%2BzHuwV%2FgwIgMYSuoVlqscbyIksBWUSO6ykgCSWOAV0KXdNKi8fFiA0qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKeAcRU3Zxfzde7LmCrcAxMmawJX6M%2BBRRMN1lHSIZjXTKRKl6tSw%2BiW0awgsnjsbqAhY6%2FQ1GXMctGYRk8T057%2FkX3iX3gnKVLG07fJo9ifjCalpXkIv6ca7uZFzqkT1QmjkxdtaOjZMojOBUGSY7Alco8A59jlvXvtiCOKs9VefM%2Bl5v%2BxkFL6AFrMSWaeX8mMTE0QJE%2BSiHdxT8%2BW2vbtImY5DWCUMAqH%2BBa4252QrzeZjI%2FJV3FeFhaMOLsABHDdUhtu2H0YWsKj1X5oNxHfbhYyGG481%2BlnzrU8%2BMkSG3iSxH%2BAHhAPVMvG0KpHIUt5HynFxvQ9w0u98NGhpxnYVbgFIJN6BAUAjI7eJc08ejy54cgJKP%2FbhcZDVloWTvysOmT35AAmP3%2B%2BWWQQ6VMUnX6Z%2BhDWRcBNprBLQou9KbAd0sxJp3a5Z9oPPUjFD7MVsmJtNLdYH1ZP0yCgWrzE41z4KgFgmVEO%2FdTEQb17uwozgW%2BNyHQgRNyGfayH8lLdYEDEv3uf2PpaqSMz9%2FvFa7gMopupM1A1j%2FT7eCxNxV%2BGH7NF4oTiO0vobKy5v23UiNXc5JsBCswuzFZv8tPnkv%2B2E7kT8cMO5mCX7vacJ%2B2iG%2Bd7gPKT59cKk2u6OzQU5xYQZf3ztOeXMP2J8M8GOqUB%2BPCw7%2F8qIFrNHhtKcuZvcTntHk9QAmRc4hvMz7Ka77Lplqamgl%2ByQ6%2BgW7dK%2BmuLxaW%2FYxZ6DnAde6H4QuopFKCV%2Fu2m%2F1aubs9hQnIGPzYo5f7kLotyg4zPTa8%2BFuWtyNA5GCaz9nIyMcg1Wb%2FLI3asOrRpq5ENhTS0RvDiYXBxfrC5%2BodSyfxRJi7QrsGJ7YhH9PxpXW9yZMfkSHE4TAwzzI%2F6&X-Amz-Signature=1f5bfe1ea3ff7cd5fc0765a62c55556d8b556496cb40da2effe2c4a7ecf118d5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
