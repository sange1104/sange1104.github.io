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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665CCB26EC%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T053348Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDPCxScgXql2BSg%2FuWBAhLDFPvk5zGrnfqRS3AvXmTIcQIgfKbJHK9tZTxtL71L%2FnQZJ%2B%2Ff4ouYENjfpV5bjdcPCB8q%2FwMIbhAAGgw2Mzc0MjMxODM4MDUiDN7klqtpDHfmU3K0VCrcA2JzoMso5IiaSpPNIOTjybAgqlUQ8g4M0mkj6%2Bx%2BcFlx5Ps%2BImExwaQASqAyeqeUJ2ulxlBnqAmgV94ItuOdHWmhA0lO1W%2FOHoE8mvYs63RHp1%2BD6RvrWSs7xanzLwfB6gJVlqwY9wA2N3MkjBTSjmJ6Fku%2Bn6814RSaCvgBihxvTl4JEJDZn2ecixQttIJCy8rWfgOVslyrfHw4uNEeXnmJ9t0q88SfW5sz0e7dptBZG6nLnVEBlpjtzMlvfK3BvOiie3dTagE%2Brbl5B%2Fn7DLLYH1q8OHiuu5YL6F2EzRm0t%2F3vOEweeOoLIFBxsrybJNQ9rPiDMfpuLBmms4W%2FHyTS7UTsLW%2FvC8vNV0dMozKvj4ee85sIU33B77d%2Bt29hLNTcljJs23CbBrRbs%2FcfTL4dWJif%2BABZWq2nmxJchCH9fBYJw%2F%2BxZUzWeeb7Vs%2FCc7w%2BqCH7MZe%2B2tzNMJ0uMO9UjioTsfAfaZGpHFQ6DL%2B5YMjvNmtS1O95UdcHq2a7E9iZPOsmOXof%2F5TLBuvd0MnnTsKxrh6fc2JChqWv5UD1Av8xL1AtBG34QTM35DNwVhoGKonXQaRvge3KvFt9%2F2c4geQg2Cig%2BASjvuiphuMIkhIRhTcPszhFFC%2FkMLTb98oGOqUBHcWw7FuV%2BUuTXdXS95gfDmfuL6df2zLpw%2FyllMOI50EHeJDfKRoc%2FjoTesY4El8R8abD5tT3rIsN1krPH%2FSf0wctDy4WnSdAKYeTQ66ElqxuL1vs5CmkldE2vD5vc3rwv85UY%2FhRXZrM8NGS%2Fu3YG9fRhvWwhk6uu6AMQxaa1TO7q51r%2BtCQ8PC%2BRCwOpfxBXdb%2Fu2RwuIYckuAZCtLrvZy5NHJ4&X-Amz-Signature=5ecc1f67b540a6140983e800de7e16fb3de82b3728c03e0f330614df8d2263be&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SSLNTXBH%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T053348Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCx8JXfaLI4fWnNvZPH2uA9gBeCg3%2FtK%2BVitun9B5qISgIhAIXa5LATBoQ5kgppHk%2FeziGc5nkhy6UtFDfxcJcOPyKyKv8DCG4QABoMNjM3NDIzMTgzODA1IgzU3%2B0f0luWWmxo9Ywq3ANY8O7oSKlWwI9vmJXpvVrFEzU%2BJszaGpDNRmdyZyUg0rLp8dWjCkWtwNDf6%2BmQ1dWCx4GwPK6JIwJ04bJWFET9GXUmttn5VJRxP76mudZz%2Bwpg3M6v4VaatoKD8zA1cwujJDWq05CzLunf9umGuTxUe8voa9undKe6mCwW1AYUGeJBIuDpGj4IMxW5H449t6NWffe13rdNlh8V1Zj7tSKOKPwsDzmcoK47QbMGbTwdQlYGuZKApZ6Yhfm1cfOPMXiHsxaDxbAleJ8IWwQcxg1xAdYTQaSSzNBdjdnBkYKwN0t6TuSLN6Alq87m8YZl8cTJCa2j6wxFn%2FM7RkSMwNPxqYeJLq1TMWJfgD8FGlJx0bZCw4n2XDwwJnjbvyR%2F0DWpJiRdHlHDm9oWIDNMOFUybvcdKCx%2F5iaaaAK%2Fl73Lzj35i0jedC9fEHoM9RJvjTY5cOwbsgXi5dpckW1toLek9R%2B12uiGTRUC66gN4HzEwfCzTOFosP1oKFqS8U37dVO5mR7bXtiJyRv7II7uvJLrRFEWN%2B0vGQoUY1YQ%2FPn9gcRDN8muK4sL1rpIxztvr1p3p9RlRxdwiRaiFF9xaDbHIp9AbnkyZRNHbRDiVEz0MmO8haXvzDMYstKydDDn2%2FfKBjqkAdlB8st8C5zXe2UBPqc7bwFPfXIk80Bwb%2B1K%2FI31lTbbdzzLb6DZJyDtTNwuadrYlw4Ov8NnPGIpL80q2lb1JnrwitIH8O%2BgpS4fUnX4NC3%2F4861oPDSXz0PHLlPHvH%2FDZliu1Bfh0j0VWg%2F3heeT8ihItrs2ObdG1%2FFWc%2BZQ%2FMvCJmL8Hy7AJf5sykefifJcN4dsR8DR1bV1CGNdmT7NlY49Kwd&X-Amz-Signature=bf9ee09cf9a76349ab06388f99e52fb9ab9ed2937acc438de7dc77acf3bf5fbd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666C67DWOK%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T053335Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDMC4wK5rsLOxJOB8pJg115I4nkMksUeKBq4S3xbGk4%2BwIhAKePMy3bRJ5tHnMrdmax2048xhN4ek%2BA8yTzm237Bw1PKv8DCG4QABoMNjM3NDIzMTgzODA1IgzMUaKPknLDADqOxlEq3AOjwiIHplo%2F4J3R3OQIeLYwz29k7b2n61pHv9h9lt5MKWs9m5zRxtxlgB%2FKecuIHW1JTnjxIJwNNnZSOy9DACVOo4cm9zudEmI3YEul1f7IE1T9ZaWDfMbq2ikBDfdDYaCM7S6mIWLcLHzBfC9SyVAsBRSeYPkYWk56breZdw56i2BJlFj1xcMg%2BvpmCLQWXdsaAMZM%2F%2FoRuM%2B1LNL9xmhfnciaDseNhcjIX3do2zleNh1yFjUSF3U3cqENg5CT1oj2uGy6PlpmQEmgP2F%2BJL35i0GvlmlzzGPJTm96ZLYjQ%2ByMUOMo1oVAj3ku9%2BBCabs59ky%2FTRtjnJSUJmGNoAAMhe21vZV0Db0WJsO7LjSMFA8WDpHOeSN%2BFnuKGjgff6xeK%2BYdhI%2B93DinzxDSFDLJGETQ3Qz%2BfZc6gzS6euFhEsvAf5XkwXTkdQCWUaHMC1nVo3AX9T7H3D4Lq81vo7MAoClzlR2J9OZCX%2B2BY6hZyGcn46tgs9MKSm7%2BFwyrRIXwaBAf%2B5Ljm1tqwPnK7pzWmvIlncKLYUeayExf5MPsOwU5GMa0OOZcw86lxPG%2F%2FdUbpvD9cNs0YSNinpiRIV0uoDJyLJDiXcI8rIdIpysrIBV49ze%2BdO2e7Hk3STDJ2%2FfKBjqkAfMS5fAAhR7FxRybx7lSmI1xs7TLRJixCpTpQ65bbvaGk7i0Xzw7kJYiuOKD66cNLkol1tcukxlB3WgG%2FdKaCMNJbznU65%2FVE7X2zWDRh9ccR71aCXobqRmyjUCcGR7Mu5MqhlzcUpZ1uUiXU0XSH96xwlbblqD4pyM8idQB4S2zmZ2Q8zqyAAOaxwOlEqUVfVUhCCzFyldzKAab6bIrmXN5pIsW&X-Amz-Signature=ad5e1a40badcb5bb58330cb213bdc7edd3e102a0fb287c99f6c7a9ee75d73809&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666C67DWOK%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T053335Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDMC4wK5rsLOxJOB8pJg115I4nkMksUeKBq4S3xbGk4%2BwIhAKePMy3bRJ5tHnMrdmax2048xhN4ek%2BA8yTzm237Bw1PKv8DCG4QABoMNjM3NDIzMTgzODA1IgzMUaKPknLDADqOxlEq3AOjwiIHplo%2F4J3R3OQIeLYwz29k7b2n61pHv9h9lt5MKWs9m5zRxtxlgB%2FKecuIHW1JTnjxIJwNNnZSOy9DACVOo4cm9zudEmI3YEul1f7IE1T9ZaWDfMbq2ikBDfdDYaCM7S6mIWLcLHzBfC9SyVAsBRSeYPkYWk56breZdw56i2BJlFj1xcMg%2BvpmCLQWXdsaAMZM%2F%2FoRuM%2B1LNL9xmhfnciaDseNhcjIX3do2zleNh1yFjUSF3U3cqENg5CT1oj2uGy6PlpmQEmgP2F%2BJL35i0GvlmlzzGPJTm96ZLYjQ%2ByMUOMo1oVAj3ku9%2BBCabs59ky%2FTRtjnJSUJmGNoAAMhe21vZV0Db0WJsO7LjSMFA8WDpHOeSN%2BFnuKGjgff6xeK%2BYdhI%2B93DinzxDSFDLJGETQ3Qz%2BfZc6gzS6euFhEsvAf5XkwXTkdQCWUaHMC1nVo3AX9T7H3D4Lq81vo7MAoClzlR2J9OZCX%2B2BY6hZyGcn46tgs9MKSm7%2BFwyrRIXwaBAf%2B5Ljm1tqwPnK7pzWmvIlncKLYUeayExf5MPsOwU5GMa0OOZcw86lxPG%2F%2FdUbpvD9cNs0YSNinpiRIV0uoDJyLJDiXcI8rIdIpysrIBV49ze%2BdO2e7Hk3STDJ2%2FfKBjqkAfMS5fAAhR7FxRybx7lSmI1xs7TLRJixCpTpQ65bbvaGk7i0Xzw7kJYiuOKD66cNLkol1tcukxlB3WgG%2FdKaCMNJbznU65%2FVE7X2zWDRh9ccR71aCXobqRmyjUCcGR7Mu5MqhlzcUpZ1uUiXU0XSH96xwlbblqD4pyM8idQB4S2zmZ2Q8zqyAAOaxwOlEqUVfVUhCCzFyldzKAab6bIrmXN5pIsW&X-Amz-Signature=7545ad518b102f2a179d1bccbc62c7820e56cc206800642ed3ee373bd8ed5a7e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UZ2X47YA%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T053352Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDox9rxcP1ClkGjypNspcZvHqUiOlOOqQK81sEDu8uRQgIhAI%2Bmh1ADrmD5euAQfcrcYBQ3syZ0nLRtmIizv8IRtRvDKv8DCG8QABoMNjM3NDIzMTgzODA1IgzAu8V%2Fz%2BiEisunvH0q3AOgKgkQ79NcYcZFmSr4F66AdUjpja%2BD%2FyKpu2Md4szA0Sq9U1tsCEjKR%2BHGFQelguHCu0%2FgLPUBSjJUhwxG5TN%2FG0rRG56VLi7q7TEhz2meezDZcZtCkraF3ZoWVnd%2FQxuRKUE6zu9LR5b6rqMDXvk1BfuGWkba2mXKSlR9hvzRI8HGDfcWyTEZh6JiNMB6cXnfyPYwg%2BAEIVvujcqO4cc%2FBmcHze2Iiy8ULMo0Btb6tNeaqvatUQgagusq2RCVvlPTYUcbW7KzbAcGLPBHmGS8MQOVtdXzhLRuXv%2FYdAkO2gs4MwCeFQDgthjlj6ZZ0toHlup0LovmgOwDeI0W4YFqPWji13nUSvWq%2FH2B8N0qMqbWTUAP1%2F831fbyAKgKtNrgoYplT0jg3t7UUeCTyxF7I8dLJFrKQX91PkzH8DZeSz5g3WK3QnGarnYF57RFuY2ai%2FJ32SeN2g8kc2gvLpFaPV04oj1ymSZzxmUSxAT2AaES6S23k%2BjYuDMhuGDm%2FLLDfWbgiGEZaQfd8CqCgjjcKVwjyhhYy8cHOGjsZ2Nz%2BkfnRmQQHEc55%2Flb%2FMUWdTDTdYJ5sjGNiAQHfF%2BcdWIR14%2FTLbxa6zkSVKULz9VQGhzmfy1x%2FEDnk81ZqDDd2%2FfKBjqkAflLaPg%2FfW9UQ0MtQ1plgB0S8A8octaN8ZfqSVmuAhhm2H4%2FYV6iJWcAKMscKYrPkbrXqfI4oPcMHJsDfZt3jCceG7JyBLg7hwYFxgbB%2FrpUBM8R9YVX8gVefQn%2BQa8PnzfljBDNizU61yygStYVmigIXo1HnqAQzMS%2FZ16d%2F2aaPNQMEyv9oQNxYeAStUJr95qsNhwBNZIivY9YWyTK9c1zJgAw&X-Amz-Signature=5f78c5096cd4d1965636bc79c7dd7e3322ca93b564c48cbe812e4a0cc19f1315&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667H6RGBIR%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T053357Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC56QKxyecs13GNfIHdRa2vdIHFtUF99GlskD7x9s4z8AiEAyaABgBOT4O%2FV5PFAoVRZ2zWATYkNyZ61e6hFrL2n%2FS4q%2FwMIbhAAGgw2Mzc0MjMxODM4MDUiDDMpUNgK6b%2Fib0UBoyrcAzhBUx1CWfa0tp3csSyJKmx9%2BoiQKLRT69n8Iq6mIhG7gt22wieSRruxKVPP83gD7vnHeijXx24QfVv6dfb6jxG%2BGwXcCgcr0qeaUX0%2Blqxku19xTjTAxj4JpXW2hdKSkkfz7lKXHz0n74dXbRgiaY7JzCh5orhSll6JO8A8%2BA%2B%2FijDWNS0Epd7YOdQUPRCD8DtpEM32Cfhx0xhjJfjiWqE%2BiNZASQUmTe6m9Rs5zcXnLjz3bkyFGv7ASVlHyVpTWwb47mBO%2Bu6uQrRcxKUwX%2BdiFoTnee12NGMIbARURCl2rAummHPKApb6V8NRWxP%2BwG3K1DJfIHVfbfzbDIBNh1W7mHvI4RpBF%2BkXwwTaQCnGMCxJLbxgWNkBmrdHNvJI%2BUuuR21xMDz%2BqP%2F%2BM47RX0l683rssn%2BVGfM6Pso61vCYuQx8GlNp1LYpzQtPtvAyOI6vdNXmAsARp9MqcwoaSs5Ijk%2BNPwlpsIL2DjdyvftV%2FxzUgYb5uNTjT17hFhAIf20HzsqPBaQLKxuzGWB94aqQp4d18Xo17yd7wkdkA%2FDUGdcHS4N0%2B6V0NlI0QqGVEavfX3kuKD5i8QoniHfWU8A5L8PNzEukHsech3GaBCG38RQDz6p2U1nWlW51MMjb98oGOqUBPk%2Bk1Rb7k9jkZM4X7bMBT5dl2vk57PSvShj87lDesUMt6ajzYZPnrpuUQQfaisDRY6FPgrw%2FbXQMxmqfTIvR%2FQ%2FUd89NznG%2BOFW%2F1sySYMRBlQhg6ua7M2vK%2FR6oDSLSOwRmgsdBCcFVhJd43c7gciWD0ySCIGEfZRZydrqDTMNxnzdOx8pq0%2FYBsY4%2FPAPAC2m3%2By00P%2FOrXvr6yY5F0qf4l%2Fjs&X-Amz-Signature=d6746ea2d6351f3acf7e130bfe45d8c15ae8209e042ab12be6c14d2da36ac829&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W3QY4H6A%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T053358Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD%2FQy7PDXMOwYELGEl5JDl1vKGB6Cv7O2ue63SNBh8BywIhAMoPdeZmFBg8vcb8NdmfeWekWcpCmLKxC%2FvkSQ878knQKv8DCG4QABoMNjM3NDIzMTgzODA1Igz1A4yGBvlvWH%2FT%2FXgq3AOQy%2BEhmpP4pt5KbWDredZTU%2Fxto8AJv4q5TZRCgeX3MXmZ3Iic9JdUd6qBxetRfW%2B%2BbpiaHfPiZFdUHa5Tl3TSP4Dqh3yKbpfwYc9pUFNtKb2EsyBvxFCbpA%2F9rJEYDHxnYMNC2A4DK%2B00wgDSMPx8l%2F7lRE4Hk4UPcugpRBeuNAQRrDU%2FUKcXQnlsgP9eBel9TN9P%2F1OjxtlhTRpid03XfxXHhklkQn1z%2F633QUwO%2FzqjI%2Fg07UtBVqay6bqJmU6CeYmkZdRIRzfSgFvtbZOTuIPDUb99mUxRWh4bC7hCyL9mF1lrzd9XACk%2BYBZLjWptsx%2B%2BIg65pRVgbtuyscqhj37azbeIb9VRszbuMrwxjsUF%2Bxw1isMfY31g2eNVz0iY7%2FkXDfCMCKhDwOtFObjfbmar%2Fy5u423mfp7w1RYabJETV2WxOa4qJZEy46Sxv0nHA8txKRekHskfmqVE3XisVT3rf%2BTdaeVZj5SGBs%2FonPuEgvZxXqLsDi2sCfctuGjRd7Io%2F3dwXysoz2rKZ76DJropWpF9P2QZgmGE38tDEZTAHLiZJ%2BsTfot%2FMGef%2FFK5LPXMGEZacj9yo7kSXE5CaREdG4bH%2BtVkh3xJ0MrcI030yO3v3OrJHcFQIzDl2%2FfKBjqkAdFsypbfOG1k03txT7MTSvmyHo4G9tGZZjrASgQeiaXPCYjUssTavJNnlWkD1ezUZUiiqDodvM7ynMeTMmsIZ%2B9V8b9PB9fnb2%2BhItnOmSmAU1Nfrxv7%2B0HzS%2FXVXfKMwuH%2BTmbNne3EHjDKwGa6PA6Zydx40M0ihKcbFESzT6tsVCzet8j6Xj59gK0pWoyW%2FdJxdg3t552MSU0Ggqh6E7UNSric&X-Amz-Signature=ec70c796c767a0d1a98016c1ab895761114ca0099641f7380230532f983f88ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZWZCW4SW%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T053359Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDqPWPAk2PLOt5YXd62%2FKwFgsA3vnnFIq4t7yE%2BqyMTyQIhAOvwIbzidQpjWeRtZViE0W%2FqqJOSsQILAEsE9uUMa1B%2FKv8DCG4QABoMNjM3NDIzMTgzODA1IgwBRajlQ9865BCXoz4q3AMYxCoz9f6Xk26uZUTYnFXsDu0kQq65FpilGSbXb3cYOQaCwh7P%2F%2BB0Quh%2FbQ8AvonTq8LzH5Ix1%2FXzjq37AHxGEYb%2B1%2BZ%2FC0%2F6yq5mSvyiVwKYfBg3KFEXD4JRFR8nfTT3nlWXpJyfvCTJGSTmd09t3rS1uELRKQOAK7L9hRLSO4s8YsvbVLtnU7ozlV9FYDUzuD1dI0MsuqAwbuKQveUBzQ3GCydlSkDKppUDbdQyAvaENPYAzWRALlouGgN6b8Iwsgpevfwj6RnUpu%2BF%2F4GLG4CeaSSvo%2F6dN1qr2xpM7HhhVduDL90o49%2Fh5WCPW3Uz0cpX3BlPYhqShr%2Bh%2F7xKvGQ431c2e9lkyjF%2FH0JLR75Byvl9FtLRgSsqbeMWi963i8fYF2EfBf2AyyImYkgE13DvRLMjTwOk6w66zu3vADhVgy9ZgAGEX6DMK7TXzfAh7FNOucz7GO%2F4QGT2rsASzy7n2Qa58fQ5YTrtufvAQWuVMoCG%2FNfI%2FqWpyK8goeWMBkuRy8x37HmNPy2CsL62XfZq7bqvB05D9g5pW8%2FjzSAeF%2BCw1MSoQFUKw%2BURnz1hNr6ya4KIaB%2BRI06FDAGyakOec%2BixbvrblZUTlJkME%2FT8YjhO7C5jiqsTAjDq2vfKBjqkAf3%2FUBLXmDo730E3iOrbgnXWvoCewOP0GLxRIyQxkPlXyKbEu723CyeHmycR1WG6hAGsHlcJyhrA%2FY3IHdbqCLRg1GwC%2Fyp5mmmFft8sSt6JRwgA525G18wrZGxQSwjvI4l1Ma%2B%2FVEWdiHET10h80odr003eE%2Fh8vrK0LIUkTbmZvs9Lk5KIa4vR1bgMjON3ax9kYwfn9ONAOKHzitBU6D98wlUk&X-Amz-Signature=6a4f96331f8c22691e0148bfd816bed673dd910b841fc68c12818e977b3c3303&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VJNPZDB7%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T053359Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAQ0FUNjC1L2sNDlmrrQi2IST2gOAJIXzRNC7yM1%2B6gPAiEA10ml68zJHlFR5%2FvvvRWWTUk46TiNa5O6qd%2FEqrXrKAMq%2FwMIbhAAGgw2Mzc0MjMxODM4MDUiDD2IjH8LxlT3iiQb7yrcA5ANvJgRvWTZ4S8wi1vwjZGQ%2BRQMMymKrwjrhZ%2F7%2FHFrq8CZPIBm80M5mb0bCliygkn3fhi9JX97zaRV5k91%2FY7%2F5br6TP0YujuN5za6GDBQqRc1NFaU%2BfGLdknH62UMuhsRz4bCL1wSaATysUTKppgMgrIluwOrGb5Sjl5PpkEtDEGFqUht3Phwc8bTYapK3ePKOW3%2F55B1JiSsgUgbjxKULHVFXwvh7dIyUrchzvFh63S0bkT3UxsgMDy0uW%2BQ06FsqJnmEMnKhTIUxwIpF5qoWKkWXCRd8JP8wcgHfmVoGaAIIBAifcAqMDEfZ8J5W6qE%2F%2B6sU1ZMEz611pcAUy0vTFbc7lKEvoX5HOy%2BYLzrB%2BIaZiGejBVVzMqsE0v13Mn%2BHXxuzXP%2BG%2FF44Fb6Odm3w40RP82J62yGuHi8GByAVunfLlNb0zvcgzSI%2FL%2BsiRJ%2BO7wiZscXpSltZCWXfqcb7iL5AsNRQr%2B%2FRxpVX1bc5JZTzNhqHB7MIbfYFTgnB9HapWfX9MdTaKFMyOZzTpe6t7R6U7r0kQz5UtSn00onaAnX6OuWQOI%2BSRXpaixKWkZNwgZpR8rCF7W4KoU8ritxZkFng5Ta1PACQXf1gEzF6waKpYEZJCyW7tA9MPPa98oGOqUBgBsNNzBGg8WsR877b7DARuNhWFZ%2Bl6rXyfp3dSH88G4L%2FLv9MBB3sT%2FSX0y0jijq48xdzfAGVWaS%2FhSVXUpqkxGjJyW8EvLcMiNTch71daVidVtsn0Fd8vBsUXFGx5tMT%2BwnR8cQO6cRVTr1cyfR8oTffd2PHm3I%2Fj%2BtJ2IX8GE%2Bv4ZFQSuyksZ%2BCYyIYY7hv5gs00I%2FZS44Sp%2BSLuC76t1o6qUa&X-Amz-Signature=5320eca473f275f920754ffda81779060992ee70979a091f8372f021375776ad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666C67DWOK%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T053335Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDMC4wK5rsLOxJOB8pJg115I4nkMksUeKBq4S3xbGk4%2BwIhAKePMy3bRJ5tHnMrdmax2048xhN4ek%2BA8yTzm237Bw1PKv8DCG4QABoMNjM3NDIzMTgzODA1IgzMUaKPknLDADqOxlEq3AOjwiIHplo%2F4J3R3OQIeLYwz29k7b2n61pHv9h9lt5MKWs9m5zRxtxlgB%2FKecuIHW1JTnjxIJwNNnZSOy9DACVOo4cm9zudEmI3YEul1f7IE1T9ZaWDfMbq2ikBDfdDYaCM7S6mIWLcLHzBfC9SyVAsBRSeYPkYWk56breZdw56i2BJlFj1xcMg%2BvpmCLQWXdsaAMZM%2F%2FoRuM%2B1LNL9xmhfnciaDseNhcjIX3do2zleNh1yFjUSF3U3cqENg5CT1oj2uGy6PlpmQEmgP2F%2BJL35i0GvlmlzzGPJTm96ZLYjQ%2ByMUOMo1oVAj3ku9%2BBCabs59ky%2FTRtjnJSUJmGNoAAMhe21vZV0Db0WJsO7LjSMFA8WDpHOeSN%2BFnuKGjgff6xeK%2BYdhI%2B93DinzxDSFDLJGETQ3Qz%2BfZc6gzS6euFhEsvAf5XkwXTkdQCWUaHMC1nVo3AX9T7H3D4Lq81vo7MAoClzlR2J9OZCX%2B2BY6hZyGcn46tgs9MKSm7%2BFwyrRIXwaBAf%2B5Ljm1tqwPnK7pzWmvIlncKLYUeayExf5MPsOwU5GMa0OOZcw86lxPG%2F%2FdUbpvD9cNs0YSNinpiRIV0uoDJyLJDiXcI8rIdIpysrIBV49ze%2BdO2e7Hk3STDJ2%2FfKBjqkAfMS5fAAhR7FxRybx7lSmI1xs7TLRJixCpTpQ65bbvaGk7i0Xzw7kJYiuOKD66cNLkol1tcukxlB3WgG%2FdKaCMNJbznU65%2FVE7X2zWDRh9ccR71aCXobqRmyjUCcGR7Mu5MqhlzcUpZ1uUiXU0XSH96xwlbblqD4pyM8idQB4S2zmZ2Q8zqyAAOaxwOlEqUVfVUhCCzFyldzKAab6bIrmXN5pIsW&X-Amz-Signature=2f5f69b5b1accb13c6155b0f43d277f0a365cb74f7ba23d9db65f0b2a86cafdd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
