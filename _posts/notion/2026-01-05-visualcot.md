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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VDIS7CBQ%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044017Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEoPQYKXX6r%2BY%2F9GmRumKsk0jMXSMNtaCFIzhB1wtq4pAiEAi%2BztiD2ExgfT8aLzyUrp0GiL%2FoUqPLwPK08jenmWdVwqiAQIpv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJm15ySreP3NHnwCqyrcA9wtG7peg7SpOqfMFCxyDvnn6Zvfvpl7vmK7z89LJ32u3AjJ56lJdibrEc7wcAJLUDhVpzvziA%2F2ASLF6xbOJgJT2c8EiOxEE1WP9oGSD9As%2BVSQW4B%2F2K%2FEYBHqiS2qsCWaSSrih3r%2FYdCCx4%2FIolup2Pq%2FJ7DOkmqFHWdxEapU5UBDyLoWzAiYaCfmelOvoqWc9XTAxfzl1IOQ66o6BOsikxSsWiCdmyXZXhDprCPvtMia6ZIhhI1JQOEVZAYWrCv4FILBqQGQFipBTLyMhyaX5MyGK%2FJyzzL2RIhp8QjVb8VnGYDCFZ3x55KrRAPcHiBjlEYKxdgKIva9Bf4E7aqxKMZqQptIqmCQubLeuk8eBfRdIRbqxlUNfwINnZvFJxqECDE8VG0LzEzEnkF33PCfAju%2F0SKpzlbD92qMDzkO3XPVHp4O%2BFX5xQq2TMTZEyrW4tn0PVG%2BMqlQgB2%2BviDKB%2FSiImaWRVSpA6OyGlXqZQPqtZuPIPtB8DmFBlJhIse3Q9MWeJxIyoYI%2BOjjZSfeN4RW6Nhu22D%2BSZgpH0ADsueGfTLLLuZu0nfvfFv6iSjUJMz5y1FAF0o%2BNqo6Qxvif4%2FWnPLvLDN4i4QKl3HhT9zCAgU8%2FoDpUJVBMNmM39AGOqUBA5dmqb7coepcZOhpdjja3yzTy9uhQOjSNaxFZfMZjPm27jrTWiL1%2FToK0zfU8LHRFwRZqmF9a%2Frq7zU5AqavGSZ4FQ65MPvX35HbNqreEONVraZeIvhSx%2BHMRhXzbHmBmf7UNp29PFaIAoQi%2FJakxOZG%2Br8Vv94XR43XA%2BqCmSRNxn3RMZ1VLlC1QqoADmBwNcrBLhYmxnUaSvM8VFPcg6bq%2BNrE&X-Amz-Signature=8acff9520d5721f8d9c8669f3ccb724f4d54a73238d487c8f8f60834b9f73b47&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663GAUGZRC%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044017Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCmy%2BAocUPZw61UE27Bg7no0oWkfgp8oF2RoszKq%2FXgFQIgICpIBr8t1Kf0Wo%2FhCmSgHB2JoxA0eYCbwSVTkySPOckqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDO6lYJOYCl29WERfDCrcA10fTR%2BcF%2F5UDJpPDbRMwZhc4Taf0ksVPs68yBEzxS74xfFWGPPUH0vI8HU%2BupPwSlGcpkrEj7zXdC7lH1WclbhSeh%2BqU0ex8U5McKgzzItbbjMY%2B3OK4LXsxjo0H4n6vrfNHfZZiv08vgov0l2Dq8tbLs8eu5fsr%2F6QGTeYU%2Bnb8ilMVrsv9kST0Fb%2BEhmD7isK7ucNo7DrO9Is0W%2FdOSqlNBztrEv5UjIj1IKWhx3FaxNkmrAXi%2F%2BFOyWCx3j8n4YLGe3rnZiTopAE%2Bkj7SoF85lP3PuSt6WEt%2BXdr%2F0bisD2H7ivcY7uUGmYrIEkuBv2cGHPwW06DxYZXn49qY4FiJalt6JK2%2BY%2B4WnXjmdSbnoP5rvg84oqA1%2BlPQ6XQuGbggq2Kh2icUcFO9tyUnQFeuvInKhAF%2F6oaD3J6KKCEi3Fk15jPDlhPR9zfwwrgmyW6rsOOauwwlOZQoy22%2BlMQdxElwdEldrAc64M%2BAvXcNWBlo9Vj0L%2BmWHo6VFRw4ZYHwEQGkeQYy2O7ZtIbboZhEUhkHdsL7jsfrLX2HfjwVlWlA6%2F4D2o30PoszxvZ0BYDE4KYasGoMU%2B4felUtsqBmqOkLjTebo4Q5atpRRGnyulO8DEgGuPDHBtcMO3m3tAGOqUBdhLIFAML1ou5NJ2WJY7rXEMdoyltlCHT4XyDzAf0mzX1FjRt5mQkB0y5%2Bnr%2BXkE9GzBpLQytxdC9%2Fxgnjdm4QV5RH%2B9nfap2lbmdxvOG%2FMstS4JnPdGwfIbu6YJGdRHkGVI2xTEI0mcqS7orOTVcljSFuStZNLi%2B2%2BWc0xeADm8Q%2BjWy8Q5gLLq%2B0MD6pbNfLbuIxXgLFbpp8bvy8auINQvtRqp8&X-Amz-Signature=eccf172e51718afd64b7a0acbf1ddc9fadfc1bf580ea22380d40834637a7c722&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WAWTRZDX%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044012Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDj%2BCG494dvg8402ybhBo0IDmyd6wb0dXEE8Tj4piy6WgIgfhehaqWjzea6OupW99lpJa%2BWl3rPrmTmb%2FOB5CUlEc0qiAQIpv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKB97WSpOw%2BFhNjh6ircAynwLXBtMJOzLp%2BFdow3%2BEJDDwkvZLvIJ%2F%2BzuNYiMO7AiCOgeUtoe%2FKl%2BFVfIm6Ou%2F5zqZORoAHTyIUifXz%2FZaGkNGpVDuxeYmQvbJdFx6YyU8d1GIolPqSprWRYNprSiRlrJz5HZkZTdEGe%2BfiD7fmZ1SYyzJsTlhF%2BjN3%2B582PGKiDGqrzvEbA50XACZKT0ZcSPCZJmc2Glp4BGVoyBiUFWLYz4F5%2BkaslIHsRHzQQizyF5ZOUoBYEuVjxxzCwOWF9U%2F2xPuJ7G9s4IFkR5TvZT2CgwLN6jEf76TyN3CctPHMTpl3Ojr%2FMVCLFpyBu5ZPUztfXopFTGwS1GwUSHh1RVT6j1UF1h4%2BqCDB2T%2BTdxmIiimVfIX7C1EsXV6beEnKFABoUmzteJ1LkERRxVoyNW3F5hZLFDVPW0cVSle0HRPV3QbIQls3NI2X6KuTiqHkrSmRv25a94VzxVuU83HB%2B0wmi5FhyBx4fy%2Bbshk3dSOIqaCjJUpf8jspKEjlxvg2HNsyOvJK2Q6DX%2B4PR8XZciUlrSDPhlqUxd5yoJUfMK0ZNvakq9x98W87DTsJluRU0pCYUNSASYBkumJRRj7weJUHttDxIyZcpCYE1YXmhGvVBfWFCDTWbZ00jMICM39AGOqUBvroMjp2Jwt1vFaOfkHwoJfei3PHhGcPLKLWUrQMyLwQtVhWy4JeZd3clYdapNqWr3UlBVv8ky3Xmd1NWDdA%2FOFQ3sp%2FKIBPW1E8HVrSv3Vkex02M%2FONm1CWAv1hOl1A3g3JbvBu%2FvRQmorYAiZLp4lrB8zrK42sV%2BMEq%2B%2B3M0%2FY9B5wMgOPCA2Dy8VoICiDvWld3uPAraLbxmKLUK32Wt0RUmnWX&X-Amz-Signature=e16709f8ec3b012e85271b527c8fca1763770a9273792334fe11985c5c3e04bd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WAWTRZDX%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044012Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDj%2BCG494dvg8402ybhBo0IDmyd6wb0dXEE8Tj4piy6WgIgfhehaqWjzea6OupW99lpJa%2BWl3rPrmTmb%2FOB5CUlEc0qiAQIpv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKB97WSpOw%2BFhNjh6ircAynwLXBtMJOzLp%2BFdow3%2BEJDDwkvZLvIJ%2F%2BzuNYiMO7AiCOgeUtoe%2FKl%2BFVfIm6Ou%2F5zqZORoAHTyIUifXz%2FZaGkNGpVDuxeYmQvbJdFx6YyU8d1GIolPqSprWRYNprSiRlrJz5HZkZTdEGe%2BfiD7fmZ1SYyzJsTlhF%2BjN3%2B582PGKiDGqrzvEbA50XACZKT0ZcSPCZJmc2Glp4BGVoyBiUFWLYz4F5%2BkaslIHsRHzQQizyF5ZOUoBYEuVjxxzCwOWF9U%2F2xPuJ7G9s4IFkR5TvZT2CgwLN6jEf76TyN3CctPHMTpl3Ojr%2FMVCLFpyBu5ZPUztfXopFTGwS1GwUSHh1RVT6j1UF1h4%2BqCDB2T%2BTdxmIiimVfIX7C1EsXV6beEnKFABoUmzteJ1LkERRxVoyNW3F5hZLFDVPW0cVSle0HRPV3QbIQls3NI2X6KuTiqHkrSmRv25a94VzxVuU83HB%2B0wmi5FhyBx4fy%2Bbshk3dSOIqaCjJUpf8jspKEjlxvg2HNsyOvJK2Q6DX%2B4PR8XZciUlrSDPhlqUxd5yoJUfMK0ZNvakq9x98W87DTsJluRU0pCYUNSASYBkumJRRj7weJUHttDxIyZcpCYE1YXmhGvVBfWFCDTWbZ00jMICM39AGOqUBvroMjp2Jwt1vFaOfkHwoJfei3PHhGcPLKLWUrQMyLwQtVhWy4JeZd3clYdapNqWr3UlBVv8ky3Xmd1NWDdA%2FOFQ3sp%2FKIBPW1E8HVrSv3Vkex02M%2FONm1CWAv1hOl1A3g3JbvBu%2FvRQmorYAiZLp4lrB8zrK42sV%2BMEq%2B%2B3M0%2FY9B5wMgOPCA2Dy8VoICiDvWld3uPAraLbxmKLUK32Wt0RUmnWX&X-Amz-Signature=c60694f685b97322caaed12dfb6f447926c5b7725df9e44c4dff84950c118b96&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662JGOHTLY%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044021Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCK9dGV916UMxzj8f4lCMQnCF7%2Fq3zZRUnjiBQ4RyfHcQIhAIe3QfhFFLBwKIOgyHoFzWqwFuCCF4QbCBMmIL%2BgBRTUKogECKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwaAcWBPo8DOMTw1R4q3AM%2BfnKyA0HrNsToSMC%2FZ5j%2F9WxkXolSnMZxIy%2BaisbNGzfGMYUUzAtAW3wrboPQ1LAy8NB2bm%2F1AgKp%2BdmIJ1VO6tgg%2BLyhl%2FHYXN32EI%2BGvg4VR5x4YqJsfuk%2B7GjMQI5kqzC1YA0GPF57KlS6smo4LWVjDkDJVjaH%2FwkHz2HZYtlp312qN0ZXB%2FusqbOv3LCPrF06iujWDf8WExnnoTN4W1heyVz8bpg1ubv9T1LQQtEJETvH%2Fj1be4pRwxobXVtBG1YlF1ubH1YbgNigxgVgLKaQOP8Gl%2F6L4A22hC2DHOrg7AUGA6PyouC4t%2FBHH74xU1gHx3CD%2F66y2%2BSlATEBJuGE39Dtc%2BU0AiWI%2BeTmeG3WOvgknMBfww2AzPvqV2gSk9c6QJB%2Flz6kmC4QsKVLrgnTTZwQ7KptoMP3UD4NFTEkhIgg1ZwDnqXF1JNwsJe6H5115BDI4AGfenYjR6Qu0aKozvksoLPAhH4fPiRcYVg7zoNghEQL0tTwgqsP1dgFBWj93%2BZdafbE%2B0E5GgCgH2FQ%2F%2FKbO1hgNXxKkigNWOefkZPGHR9Zg%2FTyLnnV98DX2IwUZ6ghps0NaiMXLEv3olw4JPyU0eraQKoeJRZsoT3G3pXDNT8HvnYmdzCejN%2FQBjqkAcxfQ9eJzqEDuyFrr4HxjEoiK%2FXlQ2N3YzlknoboXlC%2FRemXX5yuMSJYHahGTAdXuUSkljAIf2IlITT4WZj0NEFyLNcj%2FUIoFOyQtfxZwHOdpyJesteGctPHZ9JM3xCK%2BhP6KNWdK8BWkzwu6LKsHO67lj%2FhgDeK6Ix31rx0yFFMrgrY7g3reaPhsCTbeMpLR1NlBJNgC%2BUb109RG%2FHnd3C0w3qp&X-Amz-Signature=f5cae4d3bab04f7b2f7aa9347fc8519016c8d203130e2a1f8478bd6411ebda89&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QTDDNBGU%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044022Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGmVicYBUOLjhMadwe58F3rEXgOmtSU%2FwiiR7SsuaV7DAiEAo9tc7J6nnrmOhAuXeX2LEHv6LK3zsjVTZlAfFfEaSr4qiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKycPQag1aIjffHZ9CrcAyaP0fMEe4hv%2B99InDlAoM1fgenMshUspFX6CPkJ%2FBt8Hf0L0%2F4Er4K1PonTtwKD6bx2y9oes1Z5UD04pEqzYoBO7QPJOKbPtbH3oi876%2BVgoSwnrQ%2FEvO%2BALfFflwu16Q7721jeyWqI595z5Yuqdj7QJHxfT6tG2hmiNLspSQ6SLrnWZ7E0jcDrr6gwfWOYx2wzhZUzq7lxatfRPc%2BnYGfJP9Nfw9X2unTN6IvhymwWwhfWgWoYmU59M9Xa9Au2Bd9ecLkGzRFwywycH8yeugx8WTUYM7urq7Oua4U0%2BC5RpVtKW6plSVPKaSSk2ylJKVSWl6TQV6YYH2qgNurBL27zHzKoISSWv2xtDBmNNOULkBXZY4GaInvJ7WjmYUG4RTsMQzrASSSBpKqUshyqUTX5KeZrV1YxyYt036EIjfS0%2BxPIJj0Vq%2BfczlJaFcE%2F4Mn8YujFUN6iuQMg9Ag262wws1EtSF%2B7TeNEv0lbBkEdfrMI3X16NTMqugiyYyLx7CCfhPgEJXT2SaYutv2nqAmsUFc2bFurPNTAi0Dqa%2B5xzOyRxkrNBK9q1UJCSZWyySUsy2NSG%2FZTAIwnalxPQcLLBao7Ndl%2FssuuDXIKeeb4A5bAaDGyHjXKhxTwMODm3tAGOqUBr7HfE77VsRZVxtHtMMFfyqoFwSvEuuRb78c3pv78%2BriEDLno%2FhXu5j6cpSVXHEFdysutU3c5fbkjoItFBMtUjqL%2BKIixwvHBL9YzlU8vZ0uyDd2o9YhOaGqZrFmxU31uO6mquJmT78oWs80hn63W3v6G%2F9J7GMl8Surj26SxRDeOW0ae7cjxi210nBvOcJeFM83%2F2lC3OC8DXGhlYs4f3L13zp9y&X-Amz-Signature=73ca88143e11cb64da5f4533777d35d3fbeaf71b1eb7bbb550b28f6645b96590&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QEXIQN76%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044022Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICFYO%2FTdOhYGgIn8BkRU%2BD27UloXwfY4rSa5%2FnhWbhFuAiEA15np1d8H09vmW7N6r5k%2BPKZJGokC125ffwnW6dVWtk0qiAQIpv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPW0NGO3xbeIbVE0nyrcAwkfGeGzy1wpCRNNKkubnMhdeUJHKLzR6Jw1dLNryYkl%2FFAJnZ9qG2rUytdbQ%2FvsvtDIqSgcigmedBWcZ%2FepP6qooiE7NQGyn4nBhoN66czywvNBCc%2BJc%2FwsMN7rCSnbV%2F7K960wE7rOEqxTSaH%2BWgazk2eSHB7euVZ17OclM9F8D%2Fh4J00jynByU7gk%2FmjAJUz5Ld%2B3qDn5vdlVktOyCA16wPRDZ%2FfmhESMpx1cheHI3l%2BDbasztIhR3M0rCPbZDxvk%2BAAvKV0vZAZBKaUQREpWB86ne3Uk2HAoa%2BAC3ihjgELbL%2FyGpX%2BEpCo%2BUMIMhAXN52G7UfCuIpDo2gxjB8D6uumhYCZYC1BQWIPIS5uSzHwPvvV36v1uHJV2y3acejAFH92Al9qJ0hNdGNC%2BZiobITbN7Ix3d8PUQf4PSUugH8oDLRBRLnmfPgVe7tGRlAJOHJ9vtO9Ghh%2Ft211IsZn6OfnfbzzH5pVBiQZRveEwCxpSW6kGMBpFpFXYZGkhl7nqmrwX08VARMMzX7OonnoJa97TQr3SCDT3ALBQekli9%2FH8NdFbra7WeKA0xnJ7uFJ4iEA%2Bi%2FnkFBML8TPVneZMdCS%2FNpOc1xPyIIGRGFDmGL5XhxbkgEi6R8XvMI2M39AGOqUBZHnmf9w%2B5R7STdEm6dLRAmz3vOjP2KuLJ5qvlNoDDTiUhlcHeoYrczIh9xD76s5%2BpRbyMR8bMbdnkABoJb7Cc1iisasntQ68WRYwcaG%2FgjyyakAITT7KthncF3vsLbb8rwRh71riBwVbKwb8XGfphzChqO8CjfzMISYKkPi%2FqlRBfuPCZc9jUWB6qqjrq%2BciOhu9LpODtbInD4eoDlLNlj0Su1Ov&X-Amz-Signature=9aab923e89ed1bf6b5655f2ed0526f5182b8056e56a17628c48511d54e825d0b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46646X242AY%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044023Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAEQTk7hjhnl050xb%2BbbvSfre0BfMNKOL4CD1qp9gCfxAiEA6mR2wyrd47gz%2Bk6M2GLpB%2FdX1kBYLbWetkBe0TKaR1gqiAQIpv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJz99DxWWsmy4vSWfSrcA%2BYof0Xj3yDnZad7w2z%2FH16644HkZs33ZS6R7QQo3a7xA2g%2BwoH8DATAmsPl%2BEBGx5KsRUqkjGpgvWpQ0%2FQqiLJRzmsmTCGRe3nF91Z8s7exaAJ%2BXUSfhmpuAXc%2FCwdWC4SOX1Q6ihfad%2BBu2aUh8Rv4KmDFYMlLs2FchS%2Fa1XqZR8ioe9IQFwlY2BfbdbgaL4Mm87n6zAJGhR1NuJQF9l4P3MICfl6lVOanQ2zlzbzExscJ3Ktow%2B6%2F%2FPGzqQxHzVVKdma1zH2BUizhtwN%2Bc6Cq83xz98i%2FRfAI7uvWIFR%2F%2B9u9kUYoiYEa0v7zFxJ92kDHVOMq%2BZZ4mxyV6riU9qq74s2YGrJMAVJCC2zHR9JWeByo4r8SR9h5dQpSabndNi9XYZHN%2BMgf1h8XuCr%2FWAeet03IXHQIRBeXY1XgzDbDI3rH2fG8GKwKEmU6gnYVo2R6C%2FaGjfdBZcIOXljJO%2FUgQ1GeQdDLtOmbWmDKGs0xTQ5YPbxjIILzhVf4JJcnAZEOtjNWDovUrSC4znypGl92LwzJz6eDvhLATJEihs0rMcZhWqYMG5vM4RwIfhtdOwftfX9gOI3FHTJ9wEB0yRJOeCWobBS%2BAr8R5CSYEm%2FGOq2ZF4U5OvwSxpTyMN6L39AGOqUBqrb1ncONx5Ccivg6HklgFIQ0Wjyny6oELzTGImtF28Bre7auwj%2BfWgoYf8JMlioy%2F8qJHV9FsqCll1LGf93ha6dqAUcP36HIdJZYVDo3ukyoGA9oSlenYIKRtLY4VF4gGnvYDPxoL7Gp6b5mMypGU%2FxTch9TdyZ%2BK%2FjvSTNQ2EBx%2Bw%2BGi%2BUoNTIFZWytKWsD5%2BCRYdTaNuiy6cVkmD1XXlJWcQSL&X-Amz-Signature=d882c14e4d96191380450ad3fbe8c83f3831a1c33539e7ccc8100744686b4ab2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UDLU6OOL%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044023Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAenCLXUIaShdca6LBQCMWdxhmB%2BKeeMPEMIYIdh8kG2AiEApSVgFZBAM4H7NXvisuEHoWf7hPEXoBdMPjAY0CVD%2Fz0qiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDE0BkD93D58AcmDKXyrcA%2FRRgo1Ddg0T39B4VUNNxq6lQijL7RCgZh6OGvPfxJezqWPQCEqz7Ruur0wgLnwYEL7RUGdnIJBJX1wGBu%2BEmBhUxC3ZYRJg1a4z62olIBMatygZ3bHOobCBw%2BC9PJOZjPXSv%2B4rZLbmNv51qZO9JgEwUfbX%2B1TSFTHWtjKvbIo%2FCHazhOUMGx6iZZXNdxBGsI%2FM89H7%2BFBJW%2F3m1UU%2BQuQ1kYdJeb1K4L9xd6EjOO5JfixBY3me0urf4%2BN8XsUVBvlz3%2FELFkoUqMtGoU%2FpGJ58v7l3qFtG4wYe3jy0einnj4x50b7lX2NJOIThuxDIWAOnXSlpGy9FG5BBKA63Y8B2exMEPMZi3tJooTLlerYX6WzzA5o4IDwglFev6DnbVgUt24wW%2F0aPlxo7KicLYntxSiY1ZCbI6QorRX5RAf1fXJ3aFFOkk2wpLISiVGUYzmGxtcqPQOXzhhF9w24s8Y6l88UjWr6mEOSaCSdO7x3RH48Ztj7D%2F6T%2FvT%2FRZzSUaTsfK9feL42joGAiYzF1rDYcvMYoeDsa4pD8v39WN81LoULOaBMtYz%2FK6nY4hAwyE%2Bk8gOZE%2F9mp6Bw2zovhv7fhMLGmfnAT6tcLpoZaDSvUZa7eYYfC1aFAzfIKMNn03tAGOqUBya1YNa05RAhehcie3CO8a3Ww6OMpKjMYa9r3HALdE0XVIqUSzw8ViPj1VymueoxiBDAmC6TDhy3lV53yJITJPb3b2EFFO0tUtdTfzahS2daf%2BCvOCrR8yidlc%2BteC4%2FJwjQX%2BPx9iAMxG3jA5Ju22VHVAhfzhwFUyzlr8KN%2BcBRej8xtxeDTCbrZ8gM7HZe%2FlJx1A8k54Px5vM4gkqMTXlA5m9tD&X-Amz-Signature=76fefe31de05164db2471927337cba92ac2a1b8c332a47966609e0eef420a604&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WAWTRZDX%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDj%2BCG494dvg8402ybhBo0IDmyd6wb0dXEE8Tj4piy6WgIgfhehaqWjzea6OupW99lpJa%2BWl3rPrmTmb%2FOB5CUlEc0qiAQIpv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKB97WSpOw%2BFhNjh6ircAynwLXBtMJOzLp%2BFdow3%2BEJDDwkvZLvIJ%2F%2BzuNYiMO7AiCOgeUtoe%2FKl%2BFVfIm6Ou%2F5zqZORoAHTyIUifXz%2FZaGkNGpVDuxeYmQvbJdFx6YyU8d1GIolPqSprWRYNprSiRlrJz5HZkZTdEGe%2BfiD7fmZ1SYyzJsTlhF%2BjN3%2B582PGKiDGqrzvEbA50XACZKT0ZcSPCZJmc2Glp4BGVoyBiUFWLYz4F5%2BkaslIHsRHzQQizyF5ZOUoBYEuVjxxzCwOWF9U%2F2xPuJ7G9s4IFkR5TvZT2CgwLN6jEf76TyN3CctPHMTpl3Ojr%2FMVCLFpyBu5ZPUztfXopFTGwS1GwUSHh1RVT6j1UF1h4%2BqCDB2T%2BTdxmIiimVfIX7C1EsXV6beEnKFABoUmzteJ1LkERRxVoyNW3F5hZLFDVPW0cVSle0HRPV3QbIQls3NI2X6KuTiqHkrSmRv25a94VzxVuU83HB%2B0wmi5FhyBx4fy%2Bbshk3dSOIqaCjJUpf8jspKEjlxvg2HNsyOvJK2Q6DX%2B4PR8XZciUlrSDPhlqUxd5yoJUfMK0ZNvakq9x98W87DTsJluRU0pCYUNSASYBkumJRRj7weJUHttDxIyZcpCYE1YXmhGvVBfWFCDTWbZ00jMICM39AGOqUBvroMjp2Jwt1vFaOfkHwoJfei3PHhGcPLKLWUrQMyLwQtVhWy4JeZd3clYdapNqWr3UlBVv8ky3Xmd1NWDdA%2FOFQ3sp%2FKIBPW1E8HVrSv3Vkex02M%2FONm1CWAv1hOl1A3g3JbvBu%2FvRQmorYAiZLp4lrB8zrK42sV%2BMEq%2B%2B3M0%2FY9B5wMgOPCA2Dy8VoICiDvWld3uPAraLbxmKLUK32Wt0RUmnWX&X-Amz-Signature=81d74b2a694b5dc176445d5d9e0c07874ec0d47da1e0ad177f58ab1c626592fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
