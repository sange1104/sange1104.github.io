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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U5P24PJQ%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051731Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQCpxs6QQxiK7TxVlFnu%2BUr7vG3z3fIrJLmiqWr%2BxctYuwIgQxVRMZwDwt3XRPbCg5e5Fmyu00UDssmaK3uN%2BoI%2Fg1Qq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDBirRtZFQ%2FZiTHSVCircA45Z4el7UbWig%2BLvIPVvlTRXeqBPS3o%2FhTXcID9gu1mhaLkUnvKehaAoM6ONKfWcgzZM%2FX%2Fg6OJLfKqx%2FYatq%2FfSfsG9X3bexLLGdKH0nDYKrPXgEiW3R206UBPqieTBeLhOEjP%2B1Q0FohonZotbDN6rtPcWrCnOQX5sVGgLiyUdVG8vpL6nBrZo9%2FIG8A9m3wSFv%2FuIBjAfwCUnM5XF8SEVBFAephhSXTRaViezpG3PYHzrBwVTaBwB%2BHMLkUrS85yum%2BdCxrSV3wyPTcLE1A3hNMgJYjCuFzDH3ficxXFizbnlRhEtPrzsWCnl4AF%2F%2Fjwg4MIvzwYobWVNujPSbOBbtYQHOVUpG%2F39XCEcZvHYxXlRq1QluPZEEdTA0WNE9MDSktuNTEmJ62OMgKQZrbJFaIxHOj0HinTMr8KrlLC5DldpWdAhFVVdGM2fTJlbYVGJVhfAIcfHs0WdvGn6%2ByNAs%2FaBh09W3muZRETrA4uY1WIbIb7OwuooDWTfVPTnALCnJ2bozu3aHFPSSM5%2FESobw6cypQnrU4bbeMPuh7u2GJNZzW0V3u%2BOYHzrnvJQO1u4TAoyXUN5rZvWVi4pFZWMtY%2Fs0wJY%2BXNGY17kYmxo0FiknadlCTemVZ%2F4MOGl89AGOqUBf00dMwDBow6Jxinxq%2FvsvRXpAACad8PtP%2B2%2Bw2z4AUrc72fv5BeADrxVZON9YFrSHe%2F9kp4TWSPe9hb8CK2FQcmItF4qFppE3xPE1YLA7HAKH%2FUGQsOO%2BMyD%2FVL0A2EHHmLKhLwx3ESGEuzA1IvvlloJWm%2B%2FEdVrBQQpmJtNpGMtAal5zPvAwXbNHbOPQz2ouoieLMSqU8OXOjMsAFylfKI6f18m&X-Amz-Signature=9c56a51df59aa6ef4105e249054b7f65d93d4e28c28daf22fb79d2f5b61101a2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZYTILPAZ%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051732Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQCElU%2FSWMhc%2B8YjU%2FPpcb%2BWdDE7CfirEOY2aUP4oexCMgIhAKX8c2yqwgcwUvvL0XTLORmwbFpemoeULxm019hKoEZaKv8DCAIQABoMNjM3NDIzMTgzODA1IgxE28LRvodBOZYYE9Iq3AMtZIS3t7dto97%2ByNTA7oUeYeY4OzOjCeIF5Gair2zmBq4o9wMtT3iKEZ0OEeWdWgWZHkKR%2BSoUohBcGxHDkyp8L%2F%2BdSe8EjJ3ZyAyoHv72sHfzL8N2Nu0FPTLRCY4zfw2Qt65cWA1hnxrEZ1C4dj4S%2FTQhPpijyhFq6ij5LnbbSdPT8VSZ8ZWBJSd%2FxKk19gv5bcLGsaYnxtRhitDIHc5sl3T%2ByWcV0gFHotnSexHSS3ZeEPGOuUwc0Uya0UaGRVYyTInqB6t2Z7cC7l0ypRWJrOYQD8kYnUgFjFnH9751dc%2FvRH%2FdionWsJAvpRlpT6sxaYxRgYHC7%2BRqOaROsEpRYHtiVMpBZjc9VKu3vkPAuXSY0SDt5Sw1UGuqTOxKs5%2F9n%2BFTJdfm3szf4phsBq3DJ1x1RURQqnS7Ve0R2e3DvhjBssxVB8XN9%2FMOZocnE4KAPqrvgZGEjy%2FU%2BeNHBiSScb4mlNsjoEIWoJvyPu8aFRipYAf0Mzj2vLli3c1uUw9XZJaOeARiwf64QWJb4kGO1virD52ZL8L0VgCjd9DnijISDZVSCtYb07s2CRugv3e8PClcrjDnbrsufXJxZ27uAShg8YfXlI789%2Fx841r9cxr%2FOTZaSsNBBelMRTDQpfPQBjqkAW4ywT5ak1LQ5YYX3GAuwQ5no8XfExGfCA3qh7QOQxZYlLP7zhPuQqI%2B2KTVlz7B%2FZP62Ofg9vSHcF%2B9TN5xf%2Fx7A%2Bo03CpCruS70BTCRoV3ftWsInCJj%2FcYZE%2FJdZyIU6%2F74A3nsGvgFTTuVI1j7k%2FXpiuT8gLeGJz0RxvuF5WE5rhqmjxPaaE46H7JRidaOxVMiZPxLIoaeBbWJBQs2H61w%2FgX&X-Amz-Signature=5bc5453a82691d79521ac6d0fccfd80b965fc8a7de3871dd64838cfcdf9f7fee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RJDBHHW%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051727Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQD58YyEax3aXaHmFhJe3r3MTgZ5Kb5kA2S9aNCRkTf%2FfgIgcpjMbY2uLrJMdo4AUn6bW0b%2BkaZ9WE4qg0hsa1zRIbsq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDI6oqZM27lv58qAl6ircA2t5B9teCxXZLGBjyS71bpwh9mWwNGuQwlynOCHoxvQwrU%2BTg5dVq7w%2FWflXQjs2CGZXCZnuTsvQdc3nPBNGCPyssy3Nzg6DSUx9YY%2BSCgYAQgynOvQByCAUMujYJREWn3owE%2BgRvHSh54S86Zuq0Vp7eLZr9MGc7TMZlkP2lBiuF%2Fqe4dxSv4K%2FvJwGec1jwEm9EGYS%2F3BbaIg%2BudZOM1tCiFLpplbY0j%2BEsMO%2FfIuaDF3OrZx97XsOkBJwEu0N8Xc1nE45YqCCoZl8CuPD%2F%2B8D4PwuuTWjfaMfTBf1W6YvceRLvgrQIVBPwge1cdUC1JzBo3L1Xjq%2BTJA5l1if5DmsWq7eFIH%2BGxcsnmMrnbJtKqNWzlNI9Wn7OXBjT%2Bl1To9s8FcGga4udG6sj6WB5gqVFlA%2BJFxNb8ImZyt0pHjuug8A3buPAhXLflVzSkBw6oEzVyO2dRwTfZZ9ZpvLca2pZg8RJoIxGz8%2FYL0CGmlfTRzN38RexuXUi0rTBD4FPDvx3DPqImJec76AaOi53wQD418K5W9R2kmzc6OJEJRtxBmg1zv7hiIxxBWFT2xqCjqAWHfJwcMubEx%2BNuGKynK8SFLHOJxTvRcDF6TIoWtkNL0BrGwSpHy8m2%2FDMMOm89AGOqUBR0iI6er1jFjo7eovabB5FFlMn%2Blp61BWuJAtU9wMbhQJGqq32lUH%2FJ%2F4qWXvQAUlWk8%2BZNOPDmFQw%2Fn349rhPdhQ4IeouW49CBWj16eQqwy95gD%2BaWVx8WgGZerh8FysG0L1KDIlNqLPMcHEkU0%2F9SJra7%2F2dYZbW7nGE4VzvSjq3Kc4Z0bsW6o65CMTw4C7sJQWcfvmnMJDz8TzfVKd71ixnaj1&X-Amz-Signature=5220342a4398a8d1cd641b455567b4e271830df16bac84a87112e2435b9e1a83&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RJDBHHW%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051727Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQD58YyEax3aXaHmFhJe3r3MTgZ5Kb5kA2S9aNCRkTf%2FfgIgcpjMbY2uLrJMdo4AUn6bW0b%2BkaZ9WE4qg0hsa1zRIbsq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDI6oqZM27lv58qAl6ircA2t5B9teCxXZLGBjyS71bpwh9mWwNGuQwlynOCHoxvQwrU%2BTg5dVq7w%2FWflXQjs2CGZXCZnuTsvQdc3nPBNGCPyssy3Nzg6DSUx9YY%2BSCgYAQgynOvQByCAUMujYJREWn3owE%2BgRvHSh54S86Zuq0Vp7eLZr9MGc7TMZlkP2lBiuF%2Fqe4dxSv4K%2FvJwGec1jwEm9EGYS%2F3BbaIg%2BudZOM1tCiFLpplbY0j%2BEsMO%2FfIuaDF3OrZx97XsOkBJwEu0N8Xc1nE45YqCCoZl8CuPD%2F%2B8D4PwuuTWjfaMfTBf1W6YvceRLvgrQIVBPwge1cdUC1JzBo3L1Xjq%2BTJA5l1if5DmsWq7eFIH%2BGxcsnmMrnbJtKqNWzlNI9Wn7OXBjT%2Bl1To9s8FcGga4udG6sj6WB5gqVFlA%2BJFxNb8ImZyt0pHjuug8A3buPAhXLflVzSkBw6oEzVyO2dRwTfZZ9ZpvLca2pZg8RJoIxGz8%2FYL0CGmlfTRzN38RexuXUi0rTBD4FPDvx3DPqImJec76AaOi53wQD418K5W9R2kmzc6OJEJRtxBmg1zv7hiIxxBWFT2xqCjqAWHfJwcMubEx%2BNuGKynK8SFLHOJxTvRcDF6TIoWtkNL0BrGwSpHy8m2%2FDMMOm89AGOqUBR0iI6er1jFjo7eovabB5FFlMn%2Blp61BWuJAtU9wMbhQJGqq32lUH%2FJ%2F4qWXvQAUlWk8%2BZNOPDmFQw%2Fn349rhPdhQ4IeouW49CBWj16eQqwy95gD%2BaWVx8WgGZerh8FysG0L1KDIlNqLPMcHEkU0%2F9SJra7%2F2dYZbW7nGE4VzvSjq3Kc4Z0bsW6o65CMTw4C7sJQWcfvmnMJDz8TzfVKd71ixnaj1&X-Amz-Signature=f8c63553149198de2cb897f9376f92a0dca374e4631c5c183fb46d840b4497be&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RSCG7AF3%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051738Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQCYMH6T%2B9ngJxjxzb%2FG4tvoCdCKxeBwBtYufZNgyC1BKwIgKOyQ89Qe%2FaWchDMzItswRxUS3Op7jS7H7hEu%2Fg9w87oq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDKg6r5MJKgacCJvp2CrcA3PlaPODhKk%2Ff5Yq24Oj6p6uU7buqKcOKICELkQy0x%2BEKUGjRFYjHd5HDpE%2FKM3YdH2YF0NJTDJk5Ly0j8%2F8WyMj2ywTHJj1QFmAo1fl9zVHcehA%2BgjZ1hoh7gbbCQdMOLdNnB7L%2BPNzKhVq3qzacdhNnKSo95%2B%2FLmX34H20ot439ww2uJC06eAhF2aWiDC0raVBxU4d9eQKhuLE1weieTIUdT5H4d4yB25qW8gAuQve3wncFbQLGzrSkrMLQDD67eo%2BzOs93EFyw7jiF%2BIslrTPzP3dhTrjITjlD9SmgebtbAXwinF97Znkqr%2Faotqvd3RGuCkop%2BVgxVcehM5C7VdzYKty5kaKrlsXLePXwjK1DExrGjH%2FAbTWffu431bWCWy40LlQyrP0PZlx0PsS73BUP6K0A2omgYZa0cnaZyzJ19nXqfqkDDVBSyJ3eYkQOTx5XHXuyHsYw7rYOLX%2Bh0lNxoRzDKmGUYUs055XDKjApKiPPxM7cf1XGHCE1qur6fn%2FWwtbSQhFSgcgjG23u7Bd8CsU%2BWtHCNcM%2BkOZ9MqWmMPXUZIA1uSZtiBhBaud5Ugdt5DpShCzjTnnOjiNKIZUzeDjaZ5U0dwxQN5N5PPezN3aWKAc4PYbCOWxMMSn89AGOqUBratgLBzLgoVW%2FvXaLesGLrwBcAaRGceTIxfE%2B7WbMlV14ybxyne%2BHGpJd6r7STuB%2BINrDgo69Jgc8f4mXuzQhhLOb0LfAgyEPjoZfJIW582HGFcgeV6Tk3gtkUJgvaYpjbzhIVVoWOx9xnuSz0VKULzG69o1T7Q25Ben9nLJT%2F22AQsKgrTYJfzYNa9MNC7Rs57dXkcAAY6dSUTEpLzLwq%2BnqP%2Fq&X-Amz-Signature=8186d75fbd7175f303a89a9e0343827e1a74f29150e1181673f3bd40ee707883&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YYXFNHVD%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051740Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQDC9y0nHUc%2FhxdW4gVgqXYEdIbPzTdMlXv4K4kw2OZ16QIgdjikOnQr%2Beverp6fVeNYQWt7nSPrQaUBvfQu8QpsVRQq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDFWlLXd8KTFmXcZdFyrcA4m7WYcnJIGX0OEshW9xAyHB7B%2Fb1r1L%2FXC2oNpw9StXxJaM2dYDM5ofwOen1%2Bpwpp9SyiSicXfGa2%2FnKvbimlqQGSGgHVsfkBc3ALFOCVdHNgw%2FQRx6cjpPh9Sg%2F3Rnd7noH4rgOuGiqVA8hhFAX7rCdnPiJAtG%2FUnUDvoclqzALSz2ubrER7GL2ACLwmfIxhDIAtf7gFPWeoIU0pA%2FLZi8j0XjbfLdn9laxBFIxlF5WrqInahZwhOQr1IpzndQqk%2BJLyYs9wJq%2BBem8lVvZ6IIAoEROoDt3G0zkqgaREBr9QHLRgnFM%2B4ey5mk%2BIXVrl%2B4wlKqtFySVRdYbp6VSvY1G8ql3tZ%2BtvAKhQWmmziPPntYhSuUkocGE1ipbTsA%2BAbq5bNY%2BHwOS7PkBlpqmOXl1O0xHuQ2TJB9HfpqJCYCrgYXKAgPbkORLHFUjDYLrt5X6sMxNdrLkmxMbTqS0jr7gNavlPiHyHhoDwTlcK7xmQ2FvwXlHMubWN0G6%2B7a9SJQE5D35wBTb17Z1D4HC2349a5zbGlv8XAWMfE35bl6V4IaGA3R%2FZ3Bl0CNGRoe4PeEzhE6YLOMahGn86a2lCezymokefZkXmGGFm6etBiHshZbbfcjAjcDqAacMPil89AGOqUBezn3Gnm8QnN%2FcB4IerGnafDXyVjL%2BvQoD2aFHsB1bNqx25OO2s4NP8U3YqLXwYX%2Bom9qlFoeaYy4W9EDNWKLzwlLChFWr2ei5mU2BL3bqb27l4ZRkNBKZaUV0JVvzEppg8ExaEvis47lY6g%2F5HzJt0qTRyGcOreWC193nbZKxPHvlWeRAmrjH7Vcl6YWoC8kKkI%2FuyB3NDkYabTrbkKGReCmzhXK&X-Amz-Signature=d3184534a6e51642f7fa524c3f14f8024de7cd0b7f3971fdf3c65fe2983cad12&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZFSOWX4G%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051741Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQD1yJIV2eNbfanZcCBPdUqRryAWYCKlkxmVl04TiBZQSQIhAId5XkD1AdCqCUUHHdWauvlz33PB10GuAea2LVSRfl2yKv8DCAIQABoMNjM3NDIzMTgzODA1IgxtJHpUEz2sFIlpS8Aq3ANNVSFuQIlDpxXsAoUsd6VLtCQbr3JboNPqqldSQpDjCkviK7ItVUzpu%2F52CyKYnO%2FYM8E6I09%2BJbr34l2A%2BNtl%2BnGLnM0QdKN3L73o1Q1E2LT2juXbc%2BeVe2PNMyUJs4ysaglBe%2FwPFfKzpqrKB2J6%2B4gTpYKi2zjBjL4TnDaULfryXfz%2Bw8RbY5scMS3KWvza4qmLDyZ7jwZmqI2iCqn%2FUfAhmYIAJJxZ5lrBPsz1fOamJyUZNvFV3rPAfCM%2FBUqyoQNJHdEftS6ycVz5VIFbGKDramXgJDMJAgZhZGWp6yNd2piVOV2vK3tX1p7T6dJROPMzk6u%2BkeD0Ymu8mD0aaZM%2BgkxQW78HAbQJhar3CxvJem96xKWTfnSZghy3f2XnC31GOQOZvuSAwum4Yp5dlt4ILWnImv1TJYQjBp0sba%2F6711WB%2FQCz2Cy7ef7EyQCzM3XcxRoTV8goTJrHWGhzmVfI3kI30kEEt%2FYlQOYoGDkS5bZaiWbDZWPMqGrwmcXkaUe2v9aL5zqn%2BSNW0%2BOaIpKv8%2BBIJXJ5LAGGol843Q5MgBHQBGG7U%2B8qxM5KdtJK5HCG8vFA46skFEpfVKhukPSeaSPHGT7zQQM%2F8URN9TITG%2F9QX6qk03IXzDUpvPQBjqkAVwfUeaPH%2FDPar63qNnVolMMxn3%2FkfK3vQmwfrTKgABfPCH97jV%2FBgxgSjAinUgBq%2Fj%2FSQ6HdHSwh30ZzWGgnOPp2oL4UUUdG%2FZmDvGPugcXIFUNczHa%2BgDmLp7dsE%2FUQwV10Hvsjp4ePWU3MySLt9g%2BeosT%2BzxHGUc5J2L%2BnZtZk8Uu4qjUWyToFUFD39yKeWjbg1gTCYW69ZJS20QRcWJ7dZHT&X-Amz-Signature=4dd299a9d21fc6cb46b779a43d4ed19d0620638e9188ae36bd4e65caedcbe58a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WCZP4DOA%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051741Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQDdXVa0zrQ%2Fdy0i%2FM1KQpMxzgv6Q3IuOElhyTTakt0ZAwIgW94Kfmiqc23TGE%2FIr4s7preU7XPHPBtWRw4VJuLddvAq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDCyX3DB66rR88QTKFCrcAxCEyKdc6t8KiAfhnN063dbdRF1zFVd%2F9kYEeNLOmp97cL4uCRcYzpWoMn0cH%2FcLDWxw6kmLcAb75lYVh6cbQMXsErVsS%2FNs2Gv%2Fcj0nkq9abhtvHP3HkXJXWnTM4ZGTRw2yCut4DQpcjVrsrltRSW1txnzasOyNJbiywAqKJFYBVqN9xls0x0%2FsBXDhFu30WCYwFq1BZUIRlux5SBmlizt1yjRL8Rh7MN2oTxxM2%2Frgmh9pnPy7bkUFYOGknTktRZtXKFhEr9Ws8tXgeJdvBhuR%2FR5ZT2nS2pasU75O3oHG6sZAEJsz8cQUmCCvbPwY%2BJSNvesnq4xVmQTB4pLhKW3PHaH0hik3X5m6zZCUitHPLvdwPolLyHGhB6lfTmXpmp6Na%2FKDOOOXOa0PIhopzkfJRKoaAWy1XDSis8C9dG3vNmVn8YA4LwHtIvCEhSdDXszWfThQbHZvkFtyEumcXu7tKtFxoxIC%2FyAWIGwN5ZD8i4KksGmJ9ivIzHRkKvGJk3aCBvAkKoQb%2B86HS5kfP4ojz7R5UgmPs%2BtVwTJWLkBUgMnal%2BW91ZCwc%2FghercHl1pnIyiNoOsLOSYmy6LHZtUDtP4PzoCSTeFEfQTlFNUL%2BFBFrwHccbtLYUoIMIKl89AGOqUBT9U6f7sXcPABeAIvWeiYy819CQHJWpEti1irONwL2zaaaLz0jdkAaTJ%2FAxJYbgBPPbWJ98OJKuNnmydHrZJFvA%2BANrrWsy0ZOVK9uZnmWfRcLO3cxwr80LxSL1%2BgpSli7CiqArFN4W%2B8KLxvW5Vky1JstuPup6aFrNSyNGdaCpE7LhqubsdGqc1JOEUF1zPCU8r70ogP5cge6oQueJVkOXLyt1z%2F&X-Amz-Signature=eda26f3ff22ef50ca6d71f16b5e9e254363938381d08d268e1bf2383e91e2bff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RSDLYQRM%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051741Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIE%2FUp49y6%2BXsdPc2RFCQVSggzT7Gea4yCssoXSkVmhkxAiB%2FL6rENKuaB46yE6fsAdzM3uvsc7s9bq2vuwxlSIcRsSr%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMZTb0ir9gxDHH3MDYKtwDKSeZqWDrccwD%2Fy6%2B0nx4xveoPZhn%2Fw6j3EuCKTMt9lkV0GBQeRKDlUU%2BWz3LxxD4YSNWrMVJtKebOcN537O1hFHbnG0TGjjm%2F3B0PaYzK94moY07EiHFmDVQvjnB1RHUFR5jBHc%2FxtWA4J4BbKrwgMxlL7ZmPTmnTg1p8pb6cZfK%2BI30y894vIKjI6pBOYGcHZuN6P%2FM%2BHdxy7HdMAk1lZJ%2FcK6T%2B8skIO4fTwKGxfFStIoDl4VFR7n59dGH8EgdkYvLiCnJBP05Q7DGAxVV4VD7bPtFhU%2Fw%2BZLp0T3B1Qjq6RncECXXYFJzVqRGCM3seSNROwTOjLla9MV6bBtsHCrRlpuFn0FM%2B6M2051c4kcQYqjmomsiiaxSK7n8w4aCjH2PLMivTOt%2FEnMuondmzwUXOup5mfokipOqSfSyhK2yy4QQ6OWl9Exvn5mTdbBP5EhGH6s2A1Mn9TBwX4mbNqMLw3XbS9%2FIBdd%2F5VG7K4zr%2F%2Fiqj5wlU6vP%2B%2BMN4gbUPrd8%2BRiQuvqqyTiME%2Bf%2FNdJwpj%2FaBhRpOVtx59aaWpeibS96Zh7Ic99h1EfpPgzsYmbTQpDA0%2BSi9eDp%2B3ahIEhKymOnOOi9dbb83Ey7xfcxKiD133McIkmY8p8wkKfz0AY6pgFmGxwc%2B2k1xYMfunvF0lipX%2FvP7nhNriKCm6oAqVpbhc7rHMpfgcmCT002cTz5%2FZhJlz91ecZ3oWtsXrsXuc3sH2yF70y4BXLwqE%2FfECYY32lns9CA8%2Fu0XEFf5E7D21QM1l7JSKMm5RNCjNyQ5zPE8w8R21i6LpuH7R4OSBQZHy8CduLMQGLqt%2FK23q75MVnA0qchLYJDmsSsdqmCn38FyS5EGkij&X-Amz-Signature=2d1b25d1b5b86db278ec7f10a311d83700341e7276f61d4558990e21d5db1da5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RJDBHHW%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051728Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQD58YyEax3aXaHmFhJe3r3MTgZ5Kb5kA2S9aNCRkTf%2FfgIgcpjMbY2uLrJMdo4AUn6bW0b%2BkaZ9WE4qg0hsa1zRIbsq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDI6oqZM27lv58qAl6ircA2t5B9teCxXZLGBjyS71bpwh9mWwNGuQwlynOCHoxvQwrU%2BTg5dVq7w%2FWflXQjs2CGZXCZnuTsvQdc3nPBNGCPyssy3Nzg6DSUx9YY%2BSCgYAQgynOvQByCAUMujYJREWn3owE%2BgRvHSh54S86Zuq0Vp7eLZr9MGc7TMZlkP2lBiuF%2Fqe4dxSv4K%2FvJwGec1jwEm9EGYS%2F3BbaIg%2BudZOM1tCiFLpplbY0j%2BEsMO%2FfIuaDF3OrZx97XsOkBJwEu0N8Xc1nE45YqCCoZl8CuPD%2F%2B8D4PwuuTWjfaMfTBf1W6YvceRLvgrQIVBPwge1cdUC1JzBo3L1Xjq%2BTJA5l1if5DmsWq7eFIH%2BGxcsnmMrnbJtKqNWzlNI9Wn7OXBjT%2Bl1To9s8FcGga4udG6sj6WB5gqVFlA%2BJFxNb8ImZyt0pHjuug8A3buPAhXLflVzSkBw6oEzVyO2dRwTfZZ9ZpvLca2pZg8RJoIxGz8%2FYL0CGmlfTRzN38RexuXUi0rTBD4FPDvx3DPqImJec76AaOi53wQD418K5W9R2kmzc6OJEJRtxBmg1zv7hiIxxBWFT2xqCjqAWHfJwcMubEx%2BNuGKynK8SFLHOJxTvRcDF6TIoWtkNL0BrGwSpHy8m2%2FDMMOm89AGOqUBR0iI6er1jFjo7eovabB5FFlMn%2Blp61BWuJAtU9wMbhQJGqq32lUH%2FJ%2F4qWXvQAUlWk8%2BZNOPDmFQw%2Fn349rhPdhQ4IeouW49CBWj16eQqwy95gD%2BaWVx8WgGZerh8FysG0L1KDIlNqLPMcHEkU0%2F9SJra7%2F2dYZbW7nGE4VzvSjq3Kc4Z0bsW6o65CMTw4C7sJQWcfvmnMJDz8TzfVKd71ixnaj1&X-Amz-Signature=873a7bf4998e8826f5a5192fc30598d423b75c1a3f6759c95efffb9d7efa51bb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
