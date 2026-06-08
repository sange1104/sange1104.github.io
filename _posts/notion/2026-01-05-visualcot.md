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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46676IQEPAA%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050339Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAdnYxBlyRorko8gQy0zzLd%2FmDFylfFEHqH%2BlOTpXaRtAiEAg8mfVTkZeQFWzhPaTGkhnNcnr3%2BVyA%2BpluFiBbdJfO0qiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBj4yT%2B6gVNs%2BkO2NSrcA5eHFN0g19wVPD%2BaMOWU0izuAXDNF%2B1f3Msi12nvDXbEV8d3kGX6SQW5MZpAn%2BmMa5A4KIbpNF89MCI%2Bf1c1VkmtqXRELktCXWX2v8ht4j%2Bwf2VD99jpv1zs296CSJeWf4RZYIS2IldPVa%2BS1x%2FqaALtEeX31ZOMnvzjL%2F9o%2F0%2FrZMji9hKqMSQ4tXecvdW%2FZrWtDpAP3vLn55TKyQB9gtS8yGovPcxwFpCeNZVLXaR8Z7bxIqArLcgPBF%2FQY5DreUA7s%2FJiiGBLCWTDZDD7FDK%2Bj0yfDeU%2BMUkg35b%2F8s7p%2FxNttTAjd2611u9%2BQwDg4vkPzmGRnY22ttyR%2FTwExBA5CStxmzNrpt0c88GtFLPJ4yIZ73BJxdGU6ZDiB5KkoknvqzXY2v5xDFrL9OhG%2B2fePSGOC1hBLmTOhlyGHCpOlZGxE00m8UwodFLoFZjDbUb0Vnn63uye89Q7GHr39fAgpAbgVD7BRX0JXOta60rLSpZ7WKJFbsJB22Yi8GTsIOkEseLIwIgaHllag9KaFa7Kd2aP75SINaE05JTBGM7NrloADoGDQUhg62aRRRoBSqEvvg8l6f3EHNuJahPJjo8522KWPsPC3VVhsqbTLxHuWcoYHrxjTwrJ3xeyMPWJmdEGOqUBvipaf7iIV9sZ3y9ppZoasML0j4i5BWcLyqlBBcqY3BVquj2rqRJR1Y2pWhg6e8Jj0JaIZjETcCBryFAafqPD0Zi1WEMerjtXeYbGWhjjkI8TKPtlm5hA6Ij8KL43WWLB6EPiyga%2BI6hDvyfETFlpnAL92tfcQ1ni7Rv00jIA8%2BX%2B5IZ40AoFUeX6ZuYbi0eBa9n8NVwCGr1qibqp51kk%2FRKUWDSG&X-Amz-Signature=ad2bf50531a5c8a6ae374e893dbce8c4782066ee93dee0398885ec202a33f712&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46623G52CO3%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050340Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICgiVeYES0giHlyYKIOHAs4Q%2FcVZreMoRk9NrWBpiZoFAiB2G7oxMBHrVjuwVhqwvY27U8mm1YhuQYgs%2BbrxaeljYyqIBAiu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM01ogad5ire6qMO6gKtwDUw%2FaehkAJD28TwFC9QU43TcR1WWR%2Fr%2FuDs3ZkIzp6DUDvqZn%2FyfGhs4WkVcwkQgnl9XS33ykW6PfGvOEptVwI8UyJ67Yo3ZQN%2FSYdRdEUW3Ex9b4TWPijvJdMdt4aZsXkvvyQjmaRBZNtYrquGwJcc5gC3POvo7TPiXoyvbs%2FSQ0FNjO4wlP5BO4pPvHqCWB5SXUVvJap5PeZknrp3uXKoMKYPxvWhs7SPxmMEzkD74SHic0q6GvJApcMSrCdXwp%2B04W7c%2FiGnoOYQ9nFgqC6kOygbhGlTZGoh3NXgbnec13XQDCWQoV7idCweyhyCTPux9wfmrS4LeNsl8B90jGwVJxs5KeUT2cs3vOQnHopSmPtnfX4wR5biT8GzKErAmpozB81B8G3aXghYyBqIcl8chWWROnxKw2X7gYVivig8oKVOB%2BQR8pbt2bi50JibzYG%2F2NTA9bDz2vDwEipNKSVH0Dyt03R5sYSYWA3LPva%2FxmjTrdIjRUaHqG8vJ7qddbcTlICZ8SWHbSLsD7d4p1abB%2FGPSDPr1p75lvSzP8S7ykFzrrgKT%2FHh3awGUOoyHSAVe%2BpC8AtpYjxpLncFwh7pvZ685gaeNrIB1Lwg%2FGi7Ei7fGDljEiVtWiKg0w0YqZ0QY6pgGhE76JuXjKniEe9Le0PiGhfxxMi8i40%2FIxHMpMmrDvlFeaw94CqtIj6eO3nNSvdkR%2FG9mJsB0tgNIgg3AXuwCLUTEqalSp8CAO44Xs4yCedMf3WCzWaiXXNJPLwTwa6reUmNnshoBcLIw2nlOY573KKFi7l3O6WiPTchOVh5sNu94qAD%2B7Vx4d87dy3FikJ%2B016Y5KYM5xELHWloYD69mw2%2BKPAJ8p&X-Amz-Signature=4531f261a7aa99e043dd2015a59fec0c3e2e803ca19be419e2632f0e5a2077fc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662LIPDCOU%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC1TyFvyArDNM1%2FzuZgNJ%2B3288eML7nKBO1dhG1x%2B86tgIhAOj7qvScWEv%2FM%2FsoG9FBMRvgMB6Gif52BN6F3cLsk88mKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxMbOfsBGHg6u7dRIsq3APCXMPc4uVhQ9PplOnAXn%2Fke0tkEIMR6wGc32B7rNmSKldcMVA6X8QYyOrY9RI4276z9z1%2BHSUBQqB9biStrRdgq2HbKEPHovMCULomBZjnPWzxgVBMT%2Bqc1a%2FSdFk09ZHedoFZ%2FjvvDj8TPLwMrt8VhoiPCsM00Dd%2FCuILqrlYasPeaVeNmNpZEV%2BQCPzHdyZulzIGDYDQBu%2F010UvPBiCVmwgCYwqg%2FrFVzJLrilycheGtEsloAhgRIFttaHbbOx4dXGc77IVvcWsJfF4KgnesxuRsmH0WbAZHs9cQ0xY3%2F50v6y%2BludptD2kc0dipB41GSqJHd3Pmgz17UWD5jSM1NEnbUzcdKUDPHcdszNxtGQh%2BQoZd51YPLlEdgVrdofnaBbivY%2BfJ4bdNqQTAtZkqKQGXxZzcK3K%2FdLBhESnkhfAt%2BHxoygcc8OHfqhoDC58dlDobvY0O3Tb6eczdNa7vY2zDu6YLTQPM1k9ZwX9F71AXQgcCYV4c9P9SECNMBSJeD%2BV%2Fc4V%2Bu42Dr6My1NWvUvrS0YY3tUuH8MXHuqL8tilhJ0JKxqp0r%2Fk6tMm9XRKcNNFktbsAIEwzpUY%2FegPn%2FZezo5g2i%2FPPw%2FWcQ9hl%2BnPCTWtfRp42vqIfTCBjZnRBjqkAYXrXGZAH6m4d481KRfZRXdkTpFb6yDwKaYTNF4VaJiHl751YJiaRgwYI2JTLIBUETJ4dEzuBUkeBwJOhBIm%2FXwbD3yVZsbZ9D%2Fqhk6pBy3LTjF0%2BaPV8iqdKvP9CXXDZZsUqUE2247ZTpSLKooAxRs5Bm3NQ9sHDo%2FGCtmexSwYysRf2irXtxQBGq%2BeCehKpxK15iHVc84enpN%2BbZ3Ivfqdq5bU&X-Amz-Signature=3799538a52ceea06f1f50fe7b36add68f5e909516bc6784c9dfad84f5f2a2884&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662LIPDCOU%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC1TyFvyArDNM1%2FzuZgNJ%2B3288eML7nKBO1dhG1x%2B86tgIhAOj7qvScWEv%2FM%2FsoG9FBMRvgMB6Gif52BN6F3cLsk88mKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxMbOfsBGHg6u7dRIsq3APCXMPc4uVhQ9PplOnAXn%2Fke0tkEIMR6wGc32B7rNmSKldcMVA6X8QYyOrY9RI4276z9z1%2BHSUBQqB9biStrRdgq2HbKEPHovMCULomBZjnPWzxgVBMT%2Bqc1a%2FSdFk09ZHedoFZ%2FjvvDj8TPLwMrt8VhoiPCsM00Dd%2FCuILqrlYasPeaVeNmNpZEV%2BQCPzHdyZulzIGDYDQBu%2F010UvPBiCVmwgCYwqg%2FrFVzJLrilycheGtEsloAhgRIFttaHbbOx4dXGc77IVvcWsJfF4KgnesxuRsmH0WbAZHs9cQ0xY3%2F50v6y%2BludptD2kc0dipB41GSqJHd3Pmgz17UWD5jSM1NEnbUzcdKUDPHcdszNxtGQh%2BQoZd51YPLlEdgVrdofnaBbivY%2BfJ4bdNqQTAtZkqKQGXxZzcK3K%2FdLBhESnkhfAt%2BHxoygcc8OHfqhoDC58dlDobvY0O3Tb6eczdNa7vY2zDu6YLTQPM1k9ZwX9F71AXQgcCYV4c9P9SECNMBSJeD%2BV%2Fc4V%2Bu42Dr6My1NWvUvrS0YY3tUuH8MXHuqL8tilhJ0JKxqp0r%2Fk6tMm9XRKcNNFktbsAIEwzpUY%2FegPn%2FZezo5g2i%2FPPw%2FWcQ9hl%2BnPCTWtfRp42vqIfTCBjZnRBjqkAYXrXGZAH6m4d481KRfZRXdkTpFb6yDwKaYTNF4VaJiHl751YJiaRgwYI2JTLIBUETJ4dEzuBUkeBwJOhBIm%2FXwbD3yVZsbZ9D%2Fqhk6pBy3LTjF0%2BaPV8iqdKvP9CXXDZZsUqUE2247ZTpSLKooAxRs5Bm3NQ9sHDo%2FGCtmexSwYysRf2irXtxQBGq%2BeCehKpxK15iHVc84enpN%2BbZ3Ivfqdq5bU&X-Amz-Signature=111599f6599d155cb20e2b12d17b74346511df914f6eb11799484282fc99273d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662U3MTIFF%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050344Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDFrOyoZipWI0jrv%2FaTUcEHv%2BEI6aEQmkiEihC4wGeHJAIhAMIUm1jvEuovupiJf0k63aKs6XeE2mxy6t87SqTUh8aAKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzprpKTxTVvWzHEsSEq3AMq9tk0aRgSgfycQYcctakju3%2FZ9U3TI5TJTM9B%2Bk4%2BzWzjoIsv8wioONdkFVxP%2BadwzXLXo7ZeZJ%2FfwfHp79l8AJ5kXriI5x55tv1%2FUFesS%2B9JXNUByVAXeAae9Bfg3%2B%2FfoBAQnkAhXGj7Mf4zCei5Pe9DR0LoAlVgjoYyHUN1KsRSyA5ODObqOq8Md%2FWn1XZxNDAcCBvU%2Frx5GrX%2BNXGWqi9yb9yUutDW8YQ45bmvVS%2BZ2uy1DfkKHF2nQbLtR7gvEbxPWOHe2iTZhX5I6pfMsY%2B%2B%2FnUmZlx9OirWcNy1E9Gj5Ia4rV5qq3wgKcBc584gtVhodS8HEvniE%2B7wFsAbwSUVhbJYb2rDLzy2e54Icb7M7IdhD4QFQH3kAraVtpn4oKz8sy9q%2BM9AZRgtmJhqOiG250DJchm6zAVB99jaKKlLlKlSnuauGngCt7geb4etcAXOdBHk1AWpZ6DY4m33Jfac2iecUSzm5GodQYFHfZun5khvxHoKbm6LvtrJR0uxmWB1YoC6xYUaahGkDTA%2BOjPhlE84oL7lUHcvNoh8egvJj8Gto%2BlUyxqDBW2%2BZBknSlnUAAtKzMKhHDpNOuN7xJYp1m3Kajej4EqfR0Fq83Jb1zwCyPD4igYfsTCqjJnRBjqkAZK1Gw7koXgeWuVwf1MfnjNKD8ljWXlnLYphHunbfQcQrbSlq1imkS%2BrwgrLbIqeeApJ1e2ncexRkHLrfRbf3eyUJtr5oGsFV476WMVDf8kiF1ehUFWtOMog3we8SEEH1KJphcdBT0sTGVSfbhu%2BsmtCmLqaLDEfCJkAEsdg3dBuKMbcIa6xDCOzNjlKUjhew9%2FllfG8g%2BGm%2FISXeia8Gle99wXY&X-Amz-Signature=88e6584e80c6e84df97eb2a9a602ef16f1af1b64408c47e1069bafd14c80ddac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662LBCMJBH%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050347Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB4u9OVqsy8%2Bi9qbgs5FWX%2FNlniqcsW02nb53kADGYrbAiEAnU9o1PzGOOz1N2%2FxtVn%2BMOGZ1AjjAktgQ5tWlukSi3MqiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKqzbocG9MiiwmGd4SrcA9eka%2BAetPfwAT7mdjhd1rB8mQ%2F9JB7TK4IrobaUw7zaLLz0rvZdz2bFAF6Hl06ww2zeOQ3%2FDznGyYw9H%2Fd5n5UbXtse%2FcjBiAC%2BZQjUQHv3C7qcLYBZKk7cptCM3%2BabtDs7L%2Bk1WvHq17KYXOWnsEAYEGwUjXAjJP8N43MEwvAfVUdUujq9MJcKZes9fGgb7eR2g%2FVSYULrjQq5BjzaZVs84juDxG2zy%2BBHvy20QjNpYJ6CMj%2BcXVYR35pLYeb25IN3GESWW9g2rovZ9f4X79tYffEqK0tBOYCp5bfTcCKviAgL72KSkAyCUE%2B2%2BgW9jtkmkLqkD3axlZdugAahkvoOD9QW4Nb%2F%2BHgI2VbkJciiAshREPfF7JbXq7vLRxW%2FZHIQmEnpbA8Exr6pfiD0%2B94n%2Ferap4oRlByTx3i6HaGn6neTZ0hbxI%2FyUYxA31SHKOL35Dt%2BfAsrw7hNyvpydraKtM8A9mQ%2FQ30ZsA7WJvHetjsCEn1aewA0jzTTyq8zWdYKcnIPp4y7zfb0XfEJT%2BWTKa6u2ejVjr4j3VNLZMtaoR5EhqymLtFhLnnKZXm4i5VLyfwJrf5j%2FdyT0t3J7ReDaUhQb0VCOiGZzNJXaBO4ntc%2Fwcu23vKcEUYlMKSLmdEGOqUBT8WdEGEDtwNeG7aE%2F8I83N8GBEqYlHR%2Fdkw0SezCUYXC7uSN%2BGSIgM37%2B4aRWMJqOHcvazUbofl%2FNzDIPmUSuP2MJvrISxCPYIvtVGf%2FWDpXYwVO4g%2F0i0MyieDmUV40tAGt4PaMfTaklJz7ADtQN1y6E%2FLNA3A1abR%2FDKDQMyGChY4ybpzvxL5EuWJBxnzpIz1cNSBxCxfExxoY9%2BjEriBbGCNi&X-Amz-Signature=023e55dcd2df04c216b9105ca4e48f685101feb911ba92df1624eb2639b75d77&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662UYNIDWO%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050347Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCzsKl9Uq6gMHgz1kMU3%2FruhL8QsBucL8F6m%2FBOvjvhrgIhAO5zeP%2Br29EIDyA1idnndQ95jU5J7JtF%2BzUW9Ga6ySruKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igzhzc0GRVQm8UIxK5oq3AOhjG0JyZbZABAhH0r4HrLqjb%2BkKEG5NflEyRdNeABGK7YatiK0CPQIYN8regh0EmxSngerSkBOtnXQrhQavX87FTli36kmv5OTfsLnZdHwu6k51s3jutl7qTxa034ZIzIjr4qMyKPkNK6HunvWRbtJEjDsdPUZtcUK5DuAFdZ%2B0RM%2FU6R%2BxNhAr%2B1QC7rs6kPlcYIgjXEYPNysPswXu4Bh%2FiT%2FjE5193jClbJt3xQrS2Tiwj0qdVNZQw%2BdFCMYbjHErcE4ioOStxxwMMy9uBiem1GphqnKlfkwDUr4Q36qNpXzOjaGsXCtMtnkUqipslDkzpovKeNuGhhEnslwHcflh5K2I5WfiYJwJEalx2%2BDkojxIiZPpHsf0ZzrtYcQYf1OH67VuoueczIyfNMKrnIYVcsm2NqR4yvNMjsV3mEQTMkRyWMrdB7EZszeXcSHQCo%2FznDxPAhs7GFqlKX0YcYYcyXynQXU78tcM6S5imOpBzkfi0yAn4EXeA7aLQmv4%2BeMXvPSW6b5QAiWRKfdfd108%2Fb%2BKpAA8Lqkv30xxtJNRFHgj5k4R7nG%2BVcYZdbiv2MENaNh78o9yolEQX%2FSfS1OzZ5Tczp5cYFm%2BBWIRTtMU2iNSs3c%2F%2FDcJE3wNDCuipnRBjqkAYg3IWUPy%2BjSf8nDZB2izjWYm%2Bkbi%2BBI8XMrhFUjY%2Bl9jDjOGb4hkomaJBVz1vMvcpEo5hlvbTM1J%2FKXt5Jw4UMXzBcTh41wc%2FBrM0aKqa3pG1Nl83f%2BBfviR5cG1aNHCKnrhZm0lEYEeX01RPPyLxahJF6%2FzyBHs1sAHmAxD9ma%2BGp00Zvegl8gnNS7V9992obxTzGXxmwb%2Flv7h2B2gS7XWndV&X-Amz-Signature=bbc1f172f4a004fbec63d615c830cfda5813157c7ea82a6abe37fd48aed9715d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VTZVJAGW%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050347Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDIdIZO7I88U3hoI%2Fyuy0jpl3%2FJjxRgXwSr%2Ft9MoZFLVwIgXIJblD5ZOBQ6SGV3NgnD8KxlzGtJTXNoO%2F9UJWGWpYcqiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPOh5u6oFwrldV%2F3iCrcA3Kv%2BYnG2UFku4LGOXHFXi1VYdSAq%2BAGBa1aGfkuI5Pu3oiKuGOXxYNw%2Bs9M3FGBbbPzX92hxTfOrOtuJc85Fu3nB6nuXera7%2BveYv6aPQT6kaeQs7o7hNvCGviwIKR0axw%2FcVLfNaB55P%2FpLMuB7alHUu5ToMQj5NyoL5ICtHZz%2FE2GdRVM3kmaHMX%2BFNi3HPkOrLN3E7i2GMQGYbPiCYCjrMq51zokZxfzURkvyjUImTI2ErQ4W7X9klvg3qeCmRn1wAzU0VyfNeYwsgDRlV4BIhhFxa0Has%2BG5Dehk03Ao6CRwhrLFeapg0I5YUSoazYq4FmiItfMdN%2FUSuhvz4Zuf8ibOQhPPpwq%2BFmijCwOg4HD%2BiOWtHYX195mqLsSp0jfZJHTBF6GeTYl%2BSt7aOws6KyJcDbsc4MlS%2B1MynUYwUYEHO5SBffzk2QYkJ9D1cfTy2KsVKX7R6wYHr8RHPswlrYwwh0U3H5C2bixQHTFXCaNRS6CD9rgGBti13yCutwzdxVienk8CN6qBgAunyIQPUv2iCi9%2B%2B2rovD3Uc3Ppy87Qr08jIMWIf2PDz2D3%2BIVNyiHjdSxdmMXwiNvVY8z2pCLlNb2Ee86OTK9F4HeMz62YT6oATeDwh%2FaMKGLmdEGOqUBJ3yXhyC%2BatSmhsHsHsYI0fDc%2BxElWrH7%2F8vLdq2BA1ri7%2F8aFWFdC2XAHsD2kZAZi7Ne8n4niZ8wVX2q0T3l18TJXX7IW%2FtzmsAEuetH0BMvAVimK%2FUg7%2FDSlkoC87Fh8SjnDL%2FGLZZSpntLaPN6Mekkl5mKS7pZbupwvn4nQuLVXpoL1tQMSWmGxvYgDWhg7%2BMAEwifGFnoJiKPiC8yDKBD1dqT&X-Amz-Signature=f5dddead0dd3f8d58a9c08f639e4e0fad6de1537446c907b040590880c00ab6b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGHA2M56%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050348Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDov9VYLEB4SmkxW8g26ciS8mEDhThisH%2BaMIRZkZjChwIgbXskoRRHF21iQSEofNDqKHSe1gk2BReXFvqBDyib0yoqiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNWC%2FNTsMwwCFpMZRSrcAzAeMU%2BQpAMQGFoxEfX9xYQFW1hAu%2F1mZQX5N6llRi6OsB4PpkfLSJabiSJAO8s9lJNwPjDr3HYHaSLPWdi1CguM0vw3JcttKvR09%2B4tXEaa%2F3JIPN8lFi7lk4yP8mMoIvScIdEjEkBOo6jIwbJm1IBFPjCbs%2BmrFMn67mQkC79vZBrIWkMUzzaxsoTveJSFRaAneiLCbgXnsPJYb2SafM9mO0i1XylGyYo9pmyPyQ1uhVwNky0VdOc5MUHH%2F8Koteq1j6yj1FnInCsTDyyk9CyklnFFfCSmZP1Nn3VqTZh6qJMBY7OqwKOM6xzNfvnGL3XwYVRTF%2BY4HCB6ldbtpJpcxAYR5RbJvn0QlVKvfiYO%2FaKzSHFJuls0DpNOhAgR2UljBcp1wkNQdJShDiBZ24g9X%2B0Lhhw4A0pqHgUJNRaLMNy%2Blx0zN8EzbotIRoTBNUjbKwONsD71LvB5f8Omvlru0VPV68nGAjTLh%2F1T4QWjgm0KEbQQQ%2BXw8WPr%2FlQFTxM9vbp9mdPnlghxKYbmk2wMwe18ijysv3UEHKiWvYwcGZUYlTLKrsz1d3MQ0BL66aFE6EYMDeQcvIQ2Gfy%2BaUK9tOLzDQnrpIi0pqfmF7aQNs7DH%2B0AtUVgYCF1MNCKmdEGOqUBVjia3DuihQ6QjxnXusHXaBIL3jLR9vNfHZCG1jF0aVdHlek4bnCsM8lhXzC0szUyt1C1sgpWhEWiQljrMtWzoz4xzbgLjs9ZZ67ESiE4Sk0g1cpqTT7yCwMZd1db8cg6BbrRC0flsh562QkBV4tnMY9%2FCmxnXMYpsrkIz59Umhs7yHTVPU012W6UV2miABI8YQ9IAd8dGQbLRGjC6EHZaoweAbtB&X-Amz-Signature=49a1ba2c221373017255e7c3e2aa288b38d6397eb6f00c5dff3a4de74c73731f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662LIPDCOU%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC1TyFvyArDNM1%2FzuZgNJ%2B3288eML7nKBO1dhG1x%2B86tgIhAOj7qvScWEv%2FM%2FsoG9FBMRvgMB6Gif52BN6F3cLsk88mKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxMbOfsBGHg6u7dRIsq3APCXMPc4uVhQ9PplOnAXn%2Fke0tkEIMR6wGc32B7rNmSKldcMVA6X8QYyOrY9RI4276z9z1%2BHSUBQqB9biStrRdgq2HbKEPHovMCULomBZjnPWzxgVBMT%2Bqc1a%2FSdFk09ZHedoFZ%2FjvvDj8TPLwMrt8VhoiPCsM00Dd%2FCuILqrlYasPeaVeNmNpZEV%2BQCPzHdyZulzIGDYDQBu%2F010UvPBiCVmwgCYwqg%2FrFVzJLrilycheGtEsloAhgRIFttaHbbOx4dXGc77IVvcWsJfF4KgnesxuRsmH0WbAZHs9cQ0xY3%2F50v6y%2BludptD2kc0dipB41GSqJHd3Pmgz17UWD5jSM1NEnbUzcdKUDPHcdszNxtGQh%2BQoZd51YPLlEdgVrdofnaBbivY%2BfJ4bdNqQTAtZkqKQGXxZzcK3K%2FdLBhESnkhfAt%2BHxoygcc8OHfqhoDC58dlDobvY0O3Tb6eczdNa7vY2zDu6YLTQPM1k9ZwX9F71AXQgcCYV4c9P9SECNMBSJeD%2BV%2Fc4V%2Bu42Dr6My1NWvUvrS0YY3tUuH8MXHuqL8tilhJ0JKxqp0r%2Fk6tMm9XRKcNNFktbsAIEwzpUY%2FegPn%2FZezo5g2i%2FPPw%2FWcQ9hl%2BnPCTWtfRp42vqIfTCBjZnRBjqkAYXrXGZAH6m4d481KRfZRXdkTpFb6yDwKaYTNF4VaJiHl751YJiaRgwYI2JTLIBUETJ4dEzuBUkeBwJOhBIm%2FXwbD3yVZsbZ9D%2Fqhk6pBy3LTjF0%2BaPV8iqdKvP9CXXDZZsUqUE2247ZTpSLKooAxRs5Bm3NQ9sHDo%2FGCtmexSwYysRf2irXtxQBGq%2BeCehKpxK15iHVc84enpN%2BbZ3Ivfqdq5bU&X-Amz-Signature=2b9953bb1649287a2318ee2a75d7248bb97a2d014b482118eedbae394285bf45&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
