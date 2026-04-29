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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666U33Z3GK%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040336Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJIMEYCIQDCEGP5N9AT3HAGPrWIzk6mZDu9hcfPI4rzahbgoDKFtAIhALkbjL25OZk5QZyqM0ghfy5FcNMXibUpF1lBMmoGwyNWKogECOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxfAnxsEOj6I0Nmy80q3AMgeiuZCQ%2FbeOfbN0VM2RleyzV4PHJcFnyM3xrzREfYOv4Bj%2BPk7BvxQrnMrmRq43WXpAg5HPFzEzH8NYhmB9vV6PpFd%2FzdlfJUCLaEXce9iVsWNjgHBm4XPswSsHCC8UcfERYEbi8x49S%2Fnu1sufH0poOa%2FQkbpuWvEcV2sqmUouqDXcdLn%2FM6W5HUUa8PGwDZxA278sZ2XvDLvJB02MwjjnPktVdCoZN6PclIBc8GMxrpgFoQRPmeGKOdOQa4Wrv4RUvwP%2BRJHTtCfXwCBZft38diM6b2hShZ8ArfwpVCn76nc3WK82ThJG9q6LpIe423FBu33wUREgC4LrC%2BRDW%2FBaS%2BUt1KinhRrcQd5omBKp5%2F%2FbzIj1Pb%2Br4bE0MuEvpHkvXSyO4i0Gi3HJRuIkb1fzZEgp96CAeIjbpN3icLStdS7wLKoRU6sPcgwJDCthCHB9jANZhYyee58B5ehACTHQ15c9C7F13Cf7YMCFeW0uLX4Qy0FvmUMq6TWM8y0sHApjaJ7XiWYx8JFbYjlFfVQL9tCT0FSCM18smEB8TwKD3KpQGOAHYvCLciosbpHTRP1tB5fgE9gr0Py3lbBEx2PHxIHyK8kL030GkTynGss6BIVBrdUYFeYVAAWjCV7sXPBjqkASiCR5d1kMj4Ti%2F4YdmUKlukar6FOLn0wgvV2yxkK2YKkihsV%2F5kk8Ti%2FAqAueLScdIXpnRWrBQKMfT2GmMVVVEAbt%2FDrS91HjEg%2Bs9FX1CyfYjlvEBx0gNqR3hSvmdYCu63okKHt2k5oAx6uoqlyevXzPUvRUE7lgnfRQnpRrxJgsofiFSwm2z%2Bz3VO4LqsN%2Fiy7ahZhO5jA1gn4MaTlOYTm4X9&X-Amz-Signature=ae0fc5263c5cc7d5614e0bb7848112c8f5b6e3fc1793fd43b1da4401dc6cfd30&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SHVM7V7J%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040337Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJGMEQCIBY7Hf2fbWBiTLKWxKawnWixgVSzlwWx818chFKcOZSmAiBjasbUIw%2F1MskoKK%2BqCLnTfZtCO9xPKX54D0B4tyfEJSqIBAjs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM1r4TG2prIkSbIBqfKtwDGX5zvcljKeCpWONZZlnkqUW9IBWm1J%2FXlqu1qsgjI7Mmw5zdf0eWTjXrgwgpLhSJia3bDeMnNurBN8depD4%2FQ0FT%2BLI8bbxXpQqur23Jn0xM4wDIGitoYYfaei57jAeMjy5ZPAjJiF9RC%2BYHMnoB8S6qxLE9w3ZkUf6Lk4lnUogzKmgDwz8W5QaCyl51JCNVbElSc20QiaM9xfpz6sHCW0EhRkRA%2Bjb4TJiQUKZjOrLLVi1NpzT4RZdPOu4vfhSDV7pyJ8c9Vs0T0Ft75uhFSGelcIDfLGMcJeZ4tx10mIwwWDQxTzZmN5EIs9VQUSlBqeuDDMqohhJ0wHgf5GwYNi18vs6VkiHcaeZD9%2BdV05PCu4NdbtxQJk%2F%2Bdn0Y%2BXMq0zegZa5PfGRFkOm%2Fqe2XL%2B%2FXVykqiaFuqZhsrIpVnjDL8nqWxNI67EJdlklMuLZEfw40LHt44e43whtc6ddkqT%2FmQOJBh%2BKi8WgKkY81SgQe95%2F0tcpkKUeip0gWQSVxcPQxfDTzFu3LCNCwf7OjxjmRdUHCDJFsarPdi1Hlg6ypAn5kPLTE3Bi%2Fc7sseVpEWY4yPU9JG7ef1mFx32JtgfmG5e6nXN3Fz1zDlGYVUQjhHDzfbjewKc5oVp8w%2F%2B3FzwY6pgFCFn76uqrN5jITmrEWfhrBniaL%2B9%2B0Wi4es9biU2Mb2GAeb6BxfOyNRlApbPSEm3qunsifXpbK%2FzRCpLTex2WMsGrkE4uIn8UjUaVHpz%2FXMH80eTW%2BSqDlU8Cm7MwHgEIMvkVpRnWS30XIsY%2BiCwrNSif9heaPt2pdjniC5B9Cmk11Tc1K6Fh66OG2UTmfgtH6Y%2F7wLX1aVtvWDZtCKt%2FC66ikLwUP&X-Amz-Signature=6287740b5b3cbf5bd1831c10a110a5534fcc2fcefc60956e2d4f84859e7cd8ff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662U6T7MC5%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040331Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQCR1sZjpDgNL5AJWBsV4sdTlfjmlSCvM0Xx%2BTUwWBLTqAIgX7ArrbEuQlg%2BAK1njqrbj1EOO9dBPYEtg4mHhB8VSgUqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPgKqb6kvaZNKpYRLircAx%2BcjHrmqzv9YYYgundD4ybHLNOTeW0HSBDAMzXEzHPPuCl9akiUe96%2BsPHFL2danQaLkFTTaxCVZ1jimwEgh3GiT6i7qFfkl7a%2Bov3L77YVZgLcQL2FpKeIS%2F2lb4ygiXQRPA6Qe8BYr5DvqwOyXs%2FwqibuqaguaEipLLYqUHUP2QyfnQRJQHgL9KmnplQGC4Ouy4PDxsaOd66%2BJehDhnVf6NmCwj%2Bt0CigFkdupcnD5eqk7Rjth2rFsrhSogGSxkGez6ufSKwjTilDin0n9XErBu9foPk%2BKhn8EmBG7RE4FlGoRNOXK6jj3MhnM%2BJqoZtbB6FkYnySQXtSR9eAxQ2QdndDulfkCCndA9AxalkavAfPkH2A9SjH03GMz7fuaZm6%2FIJAmb%2FKV%2BJlgigh%2BHFqpYe%2FRa52vM%2F7wvmzx8m7lycpmm%2FvXkRlTfYNb6ijcdVB%2FDGgDNJG2on9tvlqQe4w4Mze0wUrU7NCAKt%2BeRSignyUy8RY0GBEwapqJhCr1YKDzPlyVbq%2FteVjVi5OzmgMJPhOxqkAKAhKNHyUpisO0wEma62VM5%2FLZO4EVj2cofG7Rp5BLlFPSOaGIcRjGWPrFhkVgeSKVgYM%2FqKKhnh0laUdJlBvqLRkcqy%2BMNvsxc8GOqUBf8O8LoxtCY3y2DcGMWXgcs2WFA4BL0%2F5vvTouHgG0MdgbsS8gSg14uE5pyBz10LvKAfUSBBM1PtIiak86xPnwJmYMS9y1wBdE40UyDJ67%2Bkl140MDXMhL1uuRKXYr9tT%2BtocRTdooZC7W%2FRmzvGY%2FbuWHmdD2soZrmS7cO%2F70atR4hyaHraFeb7jPVfIuAnuxMF%2BrnA5f00PgHVIMs9vgLEImhvA&X-Amz-Signature=a915a2a8e84560809326bd0bdd6a73c8b72045de9b4eb01332bf4bd6f2c38c31&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662U6T7MC5%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040331Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQCR1sZjpDgNL5AJWBsV4sdTlfjmlSCvM0Xx%2BTUwWBLTqAIgX7ArrbEuQlg%2BAK1njqrbj1EOO9dBPYEtg4mHhB8VSgUqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPgKqb6kvaZNKpYRLircAx%2BcjHrmqzv9YYYgundD4ybHLNOTeW0HSBDAMzXEzHPPuCl9akiUe96%2BsPHFL2danQaLkFTTaxCVZ1jimwEgh3GiT6i7qFfkl7a%2Bov3L77YVZgLcQL2FpKeIS%2F2lb4ygiXQRPA6Qe8BYr5DvqwOyXs%2FwqibuqaguaEipLLYqUHUP2QyfnQRJQHgL9KmnplQGC4Ouy4PDxsaOd66%2BJehDhnVf6NmCwj%2Bt0CigFkdupcnD5eqk7Rjth2rFsrhSogGSxkGez6ufSKwjTilDin0n9XErBu9foPk%2BKhn8EmBG7RE4FlGoRNOXK6jj3MhnM%2BJqoZtbB6FkYnySQXtSR9eAxQ2QdndDulfkCCndA9AxalkavAfPkH2A9SjH03GMz7fuaZm6%2FIJAmb%2FKV%2BJlgigh%2BHFqpYe%2FRa52vM%2F7wvmzx8m7lycpmm%2FvXkRlTfYNb6ijcdVB%2FDGgDNJG2on9tvlqQe4w4Mze0wUrU7NCAKt%2BeRSignyUy8RY0GBEwapqJhCr1YKDzPlyVbq%2FteVjVi5OzmgMJPhOxqkAKAhKNHyUpisO0wEma62VM5%2FLZO4EVj2cofG7Rp5BLlFPSOaGIcRjGWPrFhkVgeSKVgYM%2FqKKhnh0laUdJlBvqLRkcqy%2BMNvsxc8GOqUBf8O8LoxtCY3y2DcGMWXgcs2WFA4BL0%2F5vvTouHgG0MdgbsS8gSg14uE5pyBz10LvKAfUSBBM1PtIiak86xPnwJmYMS9y1wBdE40UyDJ67%2Bkl140MDXMhL1uuRKXYr9tT%2BtocRTdooZC7W%2FRmzvGY%2FbuWHmdD2soZrmS7cO%2F70atR4hyaHraFeb7jPVfIuAnuxMF%2BrnA5f00PgHVIMs9vgLEImhvA&X-Amz-Signature=e9b2d6fe7720dd2a38b469bbf5d0bf313c93c0cff78a523d91cce2a94b50fd63&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662VSPTTZF%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040343Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJGMEQCIHy9UPgpmCzMXH3R11UFxgzWBEr2WgRixZVxomV4tYuQAiAWz6PWR33wzqs3qWNYMKqRQaMTEM5iZi0OosS2mPfnsCqIBAjs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMN3g2mUg1KBc3ubvNKtwDnI%2FiZBXo6D2HsaeRBxjqyFJK7rAcSOaK3K0gvbfG5tK6sPqL8gmHEds2x%2F2kaxS8aQyDsvJnh8cqTS7mWhdrJEDiWYJtEii4EUtGuFB4fiKtC4dYsVJ6U8sIznkO%2F9CcRvmHvAk2b5iF6UaIKS3EHxdormCKw6bNSSVJfJPT%2F4gVRgXBaRmyagXZNzdByqeVA1z3nzZVZqCRBt6ZECRR%2Beldx8Xm24c0jilENOvyqDh5vJeDf84f%2FzJGQrW40pEwgnKJDOxgXgEZErbTUlGxpCeoAMkH1%2FSmg1gDOZAPvdLo1r3UPLpgb17j4d%2Fui6ED2MOGLzfn82D0wrbYgRbN2%2F2Gq25AQ%2F%2FgZuvf6e8TUSJpUXEeHLN75BaSdn7texcBsJWo%2B3RwSX4Bxv227HJYYJsXk35N%2F%2BTt0%2BDUDIymrd8UoeAjE3sVI%2FruBgmQ8jL10Kr%2Fb4KDIJzjfgBhZ0YpC%2FvajApRDtPYKq88514FoVqwLn69A6yvSMItt1gmRjuUIWWLKPGVlyQdYd5ds87fzLd%2FjXzZ%2F6IV0a%2B0E8BEQLksdrAoy%2BwZUsgaeOMfluYAXpUnWVLODgZcyOEb01tQywNP34Jt46Ssf4ntgnQT7ezoEUNbfXEFp0r29yIws%2BzFzwY6pgF22yTTddNH3Rcor84U9NUKp7vw2hJC3iJXTh1AakvZTb0PgWKFYfCLY5tSJwqr9uC%2FBJoEme%2FCsnsauRKybTgQk4dJ1ZWUrcbyEAMa2pNQDo1th7AKqqoy%2Bply6R8zPJioayhVBaTjASc%2BxjnVub8sOEfJtO8PltUWOjFBVfW9XfDOnl4eLHJ3erz%2BAj%2FR9%2B9IqOQ0YOSsgm9mZgnmfyTI%2FSTvYHaB&X-Amz-Signature=cf5be279552e50bfa7dc67868dda9c6c5711855ca5ecf9e9f04a0b3b6e0c6991&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665TKZ63TG%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJIMEYCIQD3frhvzyehoasJcfFk2jdxG1FTKDa4C9GgI8SXdxebDgIhANKu1H8c5wU%2FYmoe6MtW3ZN16AjYLt2UEY9z529h0g6JKogECOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy8fIVsYNgeEYS1PB8q3AONgrcQrEWiHV%2FdnQ%2BK%2B%2FFp44wRgFXzfMElTX%2FVUMqkpRGGsky94RHclKcyf0sgZCa8rmQ0xOElcZOClopT07bWkarM3MFeP3a4Yz6I%2F%2FFOijqId9YFIn3EkHRp0Cm8URZ3fiXC55SUvad9zVnT55FMmCM6UeHN3aLIYbzwiBETZ3tFyzqLlHKy6nyi%2FmgHMSokWe82xdzNkOPcVGcZnwfYfnNYPOP6NwUmNLWpLjD9%2FVHedBoenu8GUN3PWwiSZWAWzENBgqSFW0H8uUTsgx%2FIwWCaSGhQFB5Qma6Cl2Hxli33vI4hjfMfn5CDmR%2BIZdIfLc1LdywU%2B2JDzAMqdQGiom%2B8iXGXJ%2B9m0633Sd5PrIfRwQW%2BCuOhw6UwAiE925lAW6r7jj%2BRFu0h6ybTOKABrU1WoRDV17FHUmlwipO2pANMF9EJMh6j0ekJclHEZ9CDW3VavtKdkTRI8uwRdpPy4FWlndu4wVcKtENoG3FUxswJeeRBGPzggIRkjC1KkDSJsAf0wHjKM62jbKrvyxIg9xODlKGyyG5PHdCCtEDoBEg7UFidLaBhtL1oXHDAdLQEYeWVcbuAEEfrOiHp%2Fw7uPjkJg8QokQMxsmxYksJfyysOgvyRXfeG5DsY2DDI7sXPBjqkASeMItP%2F0%2FvfGnEIE6tXmdBfUlSkfpE2On7etkHQ6G4zT4H%2BDmlKPS3wa7ACIvKJxALUCKHVf70Y9PYB5xd%2FqHhkNERnEgSrvJ30w5EP2tCcaqWP1XShFD3e%2B3qZoFVNYO3HqRZKEln6Xabc8L34fuINRLKbgy8ft2dJCpqBa3AT%2FEn8nSAOrTgpXp%2FQpH99NWp1flBJv36SZHt9DeD%2FE586qG5D&X-Amz-Signature=95ae909ffc580455a1200e757d5ea765014270cb62663a712811f2b5727b15ac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QSMNUIJC%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJIMEYCIQDB4qI3ej%2Bm3rpCKo2ROeqk71TqDuAdtZ32z1q5wD0IqwIhAJGrYeJrqh1GToSIYclNBwfRm4r47GgA%2BxWTcAIi8U2bKogECOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxmGPHC6JpDwPApXRoq3AOiRb%2FwZdrkm5Rt2XiPjF1lY5CFWpkhpBo5uebzw478o0NGo1KPT%2F%2BCuRmcsHlT5pcCMFl3wq9gxF7URw5fIUEdHRj78r4yiRxi0J1xtaeIgF%2B7tpSJ%2FjdHM18deyLXIJcOAarb8nvD810rITXTTUKAiYC6Z2TxYgF21tKrzWlT1sWLGMiqVBmXNg1yrFgpw3BgMttCH%2BT4JCh15QEy28PrsQbe9kA7PNUpix7JhvsbFahvb1W0QzB4QQQYqun4odWN3OaEvMyRVg5lv75njUWuFHRPakW6iH9x8kG6IUqxOytmf3C96149SLuLaPEybV677X72j1G3139qogQJEOthsyxikscGd%2BXwI%2FDIaniVmr9R%2FnTtAWS2Z%2BCX0adm5SN4tUem2V4CagY8Z9Jxl8zJHXpjrGGsJA6WusGOSymRClod%2BsspHTgrWAEJMpl1G6ugs2WQT2wdysB0RZBHyqPSREg2%2BxD%2FYLJJjCvAYo5xLRtWBXFTTzPXjc2SaS%2FoquyRwlj0d3oWuCh9Hcl%2FrHO1H9%2Bf3YnONXT2GiUX5lm16sE%2Fz2fT%2BYFV7QDX%2BX6lssbqUUg%2BjZn8PAmuwcqomkUPRFcWxkuC09sJ3kudfq06UWOT%2FS6Oi8D00bcgdDCV7MXPBjqkAaVNyNkXF%2BWBvydLPr5KMG04E%2Bj%2BAh%2Bav66lkODa2CJdFcJmjwNREnui%2BEuvf4L%2BQ2QNzmkZI7HPVtU8xOkx6OMSG%2Fy9eslLc%2Fii3nIsiFzAsCEVatiNYTwje74rtYvC%2FsbZX2UKZjE2rKl13jh2kvIgiIh%2FuB26J4Kjb05mRuMM6Wc6%2BgmbEd6i750JRdYwRow5LlvnDjM%2BiFJZLqG4k77GOEqg&X-Amz-Signature=a1d5fca8cc18d88e2a598a81d086f17aa1e6f5ef1eb73b4491959a94f308f146&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QWG7GNP%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040347Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIDDMhq54KpazihGaiuAC5eLH5buwOh9Pzs%2F%2FSjpWUsqZAiEAkHSKeCEf8D43wdLDO7KBSd49CrIy9epAP2U%2FQEiGhD0qiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJtRh%2BPcLN%2BadVZVOSrcA7jNgzn12UQh1WMzF8fnkR64cqDyNAoOVjDVfb8FaXYbndQc4xONpmL8qkXDUjXsyKQOkTSScZ%2F80%2FV3gXkUspKGkSQBFs1f4XwPqukeTILTRwlkFpIVSfc1YZPiCDLjL8Wm8om41Wfb5c4b65JeDBgueMI%2BbL9uitxOWwafZ%2FQOSFy8jdrAtI1%2BSI%2B%2FUdzUakwM219%2FlDy3%2Fhl0FpRdRBJpg2GtzfRh087sFIydTupPTRlU%2BIBCafvBx19VyZg3IV0XrE9coE6L608uGcJozejgDbB7gRDpE0BiAMQLChza7pNwVd2P3zPbYJNA6epQ1L8VtNg%2FZzCbhC%2FIeWXLWkDWXpuhNV1tTDjWUBGBZ%2BBJKHTiuVMDEwcfQw0Ig7Rh19xcVXPJgGKo5u9pRn0lVWyeAFqbHr3BrIFqSltbvcj%2B6%2Fm26KvzeWuebcMZMEOzlaafq%2FVqWBxxGI5XewktT9JeR57SwbPjG1d33k90W9qSogovkOfJgtT%2FT8n2XRoEPkAX0EEEhP0YpyHJfGOcio2sfIHqVUM%2FaPNt4FZO5JoDmFOGOD8v6lOUS%2BYsec3IJf%2FgksY9jhDQorJWIggtxVTA82LYGSu66M2X5fdOThcSYNJWf2ezm7K%2BrN3EMJLtxc8GOqUBvcfEuu5LWN7oIdFswRoy8%2FfI83EYsZ2CKd9KmVWE50OuLI6PUuQ%2BWaeLRUBvsraFrYjOGKyEKKVLLg7gpXF9mlcPP0xbr%2FeI%2B3VW8ZcEawBH3P%2ByGSRsNhGrZhJRIW9xNMauT9NIczd1QXIelX76o3F4QqQ%2ByLqdDVIwFTrNvSDgDLHj%2BNjujKzkM%2BzNnnmWIageQ%2FZHcLgAZVmCosm%2B2GkG3Wn1&X-Amz-Signature=b835bd49138fd648520736792623651776ad504761b7f8c77084c9abeb0925ea&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y2MITEZU%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040347Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIA9YKESWLImrGCEUZ3AzUjAP1TcQmdYIzoSXd9IY72HKAiEAusBEElpwwQzif%2F7qQNdSfIFEEOKx%2FxgC4svUJZtSjFEqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLexb%2FcO%2BaNbxyfSnCrcAw%2BV5MSeB6Q6qQeTWMEKtaIR5ulB3xD7poRngpCREvwXHDtolkbe00JoKcwkCfXVTsv%2BF5njzJK05Me4THdHaL7K%2F4%2FD8MjxU6So4Floqiu83gATuZHpbneLsoh26j50AXxERE4B7hU1nrH2W%2Fp49AtJqru%2FaPEBCvzxhNoN8CODTLlplC9h00khNWcE5FXD6dqFvUk0kMWavpfd7IJqaJlsKH3tg3Nn6v3azYjvzRV7uKDnTxlOVyq2G2gmkUOLW%2FnPcXcwa6ZMORAqWkCwHsO5LNsgRVdJdu5lUZCIAD0zjC3EF4a0QMo3U5BLmzXymptKIC7YgvOqvKIEyzdrheD3%2BjbBZC%2FHp%2Fn7R8DaNBdkTjesspjCRKnEgorcPFkmYX%2FGxD7MA%2B%2BXfz5DW7F3TSIijOZ9coKQGoMn4PLBMCT8ejs36JkYkQxNvRqzcDO5gCdzKTUY7JXJeeqoPD2xq5Hznp99rKG4PmB9O2iL0s5z4YsVKT5BRwM6tOCR5l%2F2z4IUUFR6U%2B8V79YXsfiNk7SS%2B9gdEMPIRFvtvGcZPkC8lVot5SmRTUzrW8w7R%2B22JqpI%2FTB4mEDnBUpAicVWpA4bg65vrM2LVajoVuQmNUjmszm0d5gGfjxzpb7VMJPtxc8GOqUBKnLOuXaqepW%2FLhnT521y7PjhRU4k5NjU%2Fn2Se7P3lFEpFbQlJmX8JNcXswNCM5pFADgmQpHPijN8XVEgmCdK9ChjkYg5b8seVnmyTD15sk9m23BLgEs1yr1a%2BRWCJfSAip8cYmiNfRi%2FpS4YN%2FJ6F4u%2BOD%2FzS8flVlw%2FVQ12S0G3e37zTSIMk8BznihklLUwOWwxCOKsT6JKQ5lJHr7tI05pxiHo&X-Amz-Signature=ad88df0237d654f7c4816955d10d0b59dcc87c74968f8169c1a1f531eec74b74&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662U6T7MC5%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040331Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQCR1sZjpDgNL5AJWBsV4sdTlfjmlSCvM0Xx%2BTUwWBLTqAIgX7ArrbEuQlg%2BAK1njqrbj1EOO9dBPYEtg4mHhB8VSgUqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPgKqb6kvaZNKpYRLircAx%2BcjHrmqzv9YYYgundD4ybHLNOTeW0HSBDAMzXEzHPPuCl9akiUe96%2BsPHFL2danQaLkFTTaxCVZ1jimwEgh3GiT6i7qFfkl7a%2Bov3L77YVZgLcQL2FpKeIS%2F2lb4ygiXQRPA6Qe8BYr5DvqwOyXs%2FwqibuqaguaEipLLYqUHUP2QyfnQRJQHgL9KmnplQGC4Ouy4PDxsaOd66%2BJehDhnVf6NmCwj%2Bt0CigFkdupcnD5eqk7Rjth2rFsrhSogGSxkGez6ufSKwjTilDin0n9XErBu9foPk%2BKhn8EmBG7RE4FlGoRNOXK6jj3MhnM%2BJqoZtbB6FkYnySQXtSR9eAxQ2QdndDulfkCCndA9AxalkavAfPkH2A9SjH03GMz7fuaZm6%2FIJAmb%2FKV%2BJlgigh%2BHFqpYe%2FRa52vM%2F7wvmzx8m7lycpmm%2FvXkRlTfYNb6ijcdVB%2FDGgDNJG2on9tvlqQe4w4Mze0wUrU7NCAKt%2BeRSignyUy8RY0GBEwapqJhCr1YKDzPlyVbq%2FteVjVi5OzmgMJPhOxqkAKAhKNHyUpisO0wEma62VM5%2FLZO4EVj2cofG7Rp5BLlFPSOaGIcRjGWPrFhkVgeSKVgYM%2FqKKhnh0laUdJlBvqLRkcqy%2BMNvsxc8GOqUBf8O8LoxtCY3y2DcGMWXgcs2WFA4BL0%2F5vvTouHgG0MdgbsS8gSg14uE5pyBz10LvKAfUSBBM1PtIiak86xPnwJmYMS9y1wBdE40UyDJ67%2Bkl140MDXMhL1uuRKXYr9tT%2BtocRTdooZC7W%2FRmzvGY%2FbuWHmdD2soZrmS7cO%2F70atR4hyaHraFeb7jPVfIuAnuxMF%2BrnA5f00PgHVIMs9vgLEImhvA&X-Amz-Signature=1f3092f91c7c63bdd8b23ab28e9040908ba3f84fd2efe40216690a6d28187f1b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
