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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XTYZFOVI%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032917Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDmfAVMoo7JCmMQCwz4LUsbLJgoo2XvXlnTiHPA1MFBfgIhAI367h6LxbCOfm19gDz7d8muwHpN5oeOFqAyt8qJFlRIKv8DCGQQABoMNjM3NDIzMTgzODA1IgyDzLvBmXwcyIGpKmkq3AMoTNhWKP1BCZ%2BqBI4FXCCwyYEKjzdIx0uN%2FLLwMeYtonksnnW9Fyd2%2B7mpo1ii6lCnHFQF2bQi7zXLibSSSaGcRp%2FdKFq2p4GiIafLOGPSFiPjR9dn0eKeeC%2B%2F90oTyNqZLLUeNsDxWmDCdk03BDVtDhyfwccjr%2FzqceNYo%2BbhzTMP7wj00qJ%2Ff2uvZTXiTSlPkOTzRhJtkfgl%2F2o0j3cUw7UPjI9TaEesVisoqsb3sCf%2BLDL4QZpPkw6F38vW7bWKOdswHaIesfhtQUt%2BNy8djN1MUBUR15eQJzjySSoukhghlJVi%2BkdlPwUWoY3tXQfmpFAr3tbAufhJeM7QSDqGfKy0VVd7%2FrgBE%2FG4EiCmzZjWKQeUL8C25a9Pw0tvzJpCk%2BCWDiJsTpDozN6WthjH%2FREKbPKGWSzcZxeIAJA6JubFySEmofY5SGFQmJbj%2BfDPTYxLngpqBaMhQ2esXk9%2F3FWm%2BPJJng5TK98PaGMZvRX0VrlG17NV6641G7fic9Ot72n95Gz%2BLIqqCsr9gS1WSi7VSIMQvxJ7xgs%2Bic21Dp5%2BbRSoFZ6A7Y5nMcFMssZSEVTpOiWnL9T5AUyB7JWkqYUCLoXRw2lsq%2BBjHVrX%2BVDj2bmjZi2e8Ia4NjCcr7fOBjqkAWhUGzHzIE%2FMBItrMMEzYZ3%2B7S9E26DKxDM4vMP%2BeeTd7acW6PxhExtO3K9F2jLcjyxGHaqQc8BzewgEG8UTJpKHX8bAAutc5iT071mG0jHvtGxxdHOtj%2Fu0ih%2ByDVwg0NV3%2B7FhHJ2w9U7JPQUF6pS97TDQKbo563FLB%2BDCUThO7626prrZJNyIhR5nDhrejPUz0rjNG9tLmdGrkJ%2BDv%2FwXLS4F&X-Amz-Signature=0c4f16a095128b7e2dcb69420aec81d1f283306f48f01406a81c2dd3f86ca9a0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QKRIBVLU%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032918Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGb0qHO169gtXIitFTsVizQW0YasuJNsxaQsZDLIyASKAiEAtGZSDwLDkig%2FNUmc6P1B%2BklDDqLdTW%2FOSN%2B0vJ0uWf4q%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDJyj1keEYsfmGQ%2BY6CrcA25j07UG5u8%2F0irCl1lWqoAFG4dpYnDn8HAVnA11TvMs3UylTH3VOP3NYHtLpMn75oDgpDwl5lJWb5OXi4HvjQpUIQKYZMC5uhmSPHb8kxP%2FyQZQrjGyT072LFVXZm4QkG%2BSAWFTQe362VV3l90%2B%2B5MAlx9kk9WlhrqchbhPgQKwHjPYN4jg4iFJSszCFTv9%2Fk4TtZHNJyq%2BHFGgSvVrdqfrUUB0RYMNBDsLSLnptBBYvW8k3h21x5eE2etBsTjl1J0PyjbhuHZU0r8M3RCUC%2B%2FW5oToVxcIG4%2BH%2BFyBIxj2VC1AJQlexCanbbPzMyIVpTDtLqr4m3KuhjgGbmy3p%2FCt3%2FFysAcRnQj56efXoB8PRwNkixkCDSo6xMPtVkwxtVU0j4EnfefkwiSs79zxKrEsXeOEHTMu7p5kB%2B022Lk9LhLynpuhWclS4dW2pu5eHDLuW2eCyQlsEnJBIoMCKTNt0m3BsA9iqE%2B5nOrmqSpfcugjAIslJKAhMTy3qpIS7WdGtqOeTG7vna2hdNPH8dpo5HbT688X10OxTaa1avIbl%2FlrS1DSWVRg3qUEMupmeHSLlAttQkVwhyRqojopUf65iwJhlG7NfVkwQQv6N684XxvrcVuEO7wrGZFPMOWvt84GOqUBvzIsML6cnDe8uVKrlpx%2B2PL7iIGRzLepKtFX4L9osOd4pzRWsg3pVEELFb9iqpA5ctTPLfKK2zz4bvVHy245zU9JX53185DsTlmXWeV4EbJd2HlQ%2FcAP%2FwzZ12bAaRaHO32omJgOrw89ojNW2Dm2U1TtXcns8dFaE3JFV5zh5v%2Fdq4OQ3zHiHcG9ImJj%2FdJHGL7rsPTv%2BHvR%2BVHzqSCeJ3Fbpw1L&X-Amz-Signature=d8f8cb4b7e5622603bae6139a0576080ca777e2e14620722b585599d9b94d575&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662TLGZ6GQ%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032906Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDKvibuP4z8XqnpZVtks%2FIoz2Ks8s90%2FgLP8i6v%2BecgSQIgCt8C7wS26gqMlWWQo6YP66DQ0Dd6D8D%2FZThlWNcFz%2Fwq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDLWyfq3Yy8mbc%2BX6wSrcA91P5%2BUn%2BddoHwoxGeMxwMDsPq136ZaEPS%2FsxWF7pP4lPqXzEhaFg2Ft6n%2FUb6wa%2BWI79doqjwqF2Ar%2BGFsoe8hVHeV96ZZefsXWW7heG%2FUy1yTFMUOneCTprrCQliPD9Kbul2b9KyhMgjeJHvOAHLuw4iZwlFsXJt9RTSz1XWMDzt8FVM6JF2vJuDqWw2pvIRg2%2FdC5BgC2Ag%2FnvBW5vIbrZLO1h82pBsSM1uRvr5URQt%2Bz0uXYgDoka1t45W3DA78%2FXqm55%2FMIzCeY6byo7po%2FD%2FAk3y5rgS%2FksFSDwS15CQlxDnCOoT%2F3rYQj7FCiyP7Rkkczc1vjMQIWash6xu0qfqIojZ1O0UMs7V4syZ%2F6QuWnYtXysR9ISuZrn7a0iag1J0BquQ5ENLoRzux0T3seFBOYmrb4qMYxW%2F0CBeknPr0nqR7F8dQV6a5rEvIRHS7gLIwa8j3IlGs7073dtIo0A1J5WNT1jtJOVPnfh08t%2FlzajPXcBpQrYyNVXpXDJAbEYTCBILWfki0Mc1vzd3vfSHjJPd%2F1CCwu05CKVlicbcbRDuP%2BEO7BZCXpCUMdWp52IdmRPyuJH6GJPfmPxUDv9toiyUXSLvd417%2B%2FDk1dgyT5Es7BrgAgrodgMOiut84GOqUBXamtYF2DsBEPPqA6X1JXBNoYjyXbcNqGUC89mIci%2FrSNFmHZPITZ8LNAYc696YDAokqMIlMpUFEUt7fOSdBDDyItmR4Pk225D1UHom0fT9%2F5STYu4ySPpGjnXL68vxUcRFT%2BGPzN3wkl1%2BWAfsx2HWojBqEJc3omPuq6%2BZyPoTAqS1c7HUMMH9F80d99YSouazOv0C5JTPYbTDmEf6R9t8HshSJN&X-Amz-Signature=49a8a957467bffdbbb895cb815b70dcafe28bf4885a02f12751e5a98537cf5bf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662TLGZ6GQ%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032906Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDKvibuP4z8XqnpZVtks%2FIoz2Ks8s90%2FgLP8i6v%2BecgSQIgCt8C7wS26gqMlWWQo6YP66DQ0Dd6D8D%2FZThlWNcFz%2Fwq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDLWyfq3Yy8mbc%2BX6wSrcA91P5%2BUn%2BddoHwoxGeMxwMDsPq136ZaEPS%2FsxWF7pP4lPqXzEhaFg2Ft6n%2FUb6wa%2BWI79doqjwqF2Ar%2BGFsoe8hVHeV96ZZefsXWW7heG%2FUy1yTFMUOneCTprrCQliPD9Kbul2b9KyhMgjeJHvOAHLuw4iZwlFsXJt9RTSz1XWMDzt8FVM6JF2vJuDqWw2pvIRg2%2FdC5BgC2Ag%2FnvBW5vIbrZLO1h82pBsSM1uRvr5URQt%2Bz0uXYgDoka1t45W3DA78%2FXqm55%2FMIzCeY6byo7po%2FD%2FAk3y5rgS%2FksFSDwS15CQlxDnCOoT%2F3rYQj7FCiyP7Rkkczc1vjMQIWash6xu0qfqIojZ1O0UMs7V4syZ%2F6QuWnYtXysR9ISuZrn7a0iag1J0BquQ5ENLoRzux0T3seFBOYmrb4qMYxW%2F0CBeknPr0nqR7F8dQV6a5rEvIRHS7gLIwa8j3IlGs7073dtIo0A1J5WNT1jtJOVPnfh08t%2FlzajPXcBpQrYyNVXpXDJAbEYTCBILWfki0Mc1vzd3vfSHjJPd%2F1CCwu05CKVlicbcbRDuP%2BEO7BZCXpCUMdWp52IdmRPyuJH6GJPfmPxUDv9toiyUXSLvd417%2B%2FDk1dgyT5Es7BrgAgrodgMOiut84GOqUBXamtYF2DsBEPPqA6X1JXBNoYjyXbcNqGUC89mIci%2FrSNFmHZPITZ8LNAYc696YDAokqMIlMpUFEUt7fOSdBDDyItmR4Pk225D1UHom0fT9%2F5STYu4ySPpGjnXL68vxUcRFT%2BGPzN3wkl1%2BWAfsx2HWojBqEJc3omPuq6%2BZyPoTAqS1c7HUMMH9F80d99YSouazOv0C5JTPYbTDmEf6R9t8HshSJN&X-Amz-Signature=9294920ebfde073f4efdbc67745548bd34029daa7ae01dce868c3b2bd7a67830&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667W65LP4X%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032929Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCLr26bv%2FmNxg5xqnClcnzAxBbkdBoc5TOvNI9J%2Ftpk8gIhAJp8VC1MIm52z3QEPiED%2Fak%2F4HFp00NInKiMk0ZOfpxYKv8DCGQQABoMNjM3NDIzMTgzODA1Igynd%2F%2FGOHq9DBTSdj0q3ANR9f7PCdMI9wnxLVfNjQYIT3rgEyG%2Bqzh7CP%2FZ4TafTccA6h%2Bexr3Nj%2BiIKbKOIDxB2oO3giDI%2F3XPMC9SwQUX7cBV666MlaXtUYLYdiEv4leoUyWbEGmw%2BStrOetv2nUAYwtI0byJT%2BMS%2BOvmh7mWlbw5zUqJmuxMaDHJfeaVu0ChVHjjGXJaqjImr0lvGuRGt7WQigFOrqkNSZtKjXdjaJNhtUb95umgIoJly78m08WXiCMAvYvndbrII1O282WkFLHqY0nyWUaZDdkIrAcsiZ5dO8JuOuS%2Bd7ZmbelQMOH8aLMYpeSvX3i%2BGrQ%2Fb2r25vrHLWJvQ5xI49626aDt7qULxytWLfBEuvpX%2FYFoXdjspdA%2FTF%2FMf8vIjZokXSrs36kPIB7SQTHQYVLB0Qbso8KVePQZXvMEC7ESkt1mPT9PAC1k6r5hjXbH1lIBlkgiI6ttV%2FjgOwBuSyWj6AmQ2w57XMGC%2FHHSpSYCTW7DUWO3BxAiNMKPqd%2Bia5iPUTx%2BrbMqbKcZvseafc7FE9CoAoGw3Q0kT8DjZO%2BF1wbd8BuG9tnOAgpIiuuCPwKsELdAhfuGhaXwQ%2FVelWJuAfZ0k%2FC3tH2faeQD2en0sVyHl2JamWUYFLFvkD9P0TDDr7fOBjqkAa47Xf2y3EfeKW2Tk%2Fhwt76LLgfL1gAi%2FTz3jmVXxbeeqDCnWW0reLJu2Bae93%2FC2ForHSXW7ugyi5tlwOs2NJc0VeHa%2BQRTomVMImUISd4aucK2FzfaFRqD2YUtruRj%2Fb6XGozmhZXC%2BC9X6AEYznZyjqUysz%2FSfGCkkxycxMekJ32c4tjX4106mRLKkbNKeesM6eWmFuHcdqTAgUNpCSklONgh&X-Amz-Signature=4e62cfce23ed5176e6596ff3d434ae846f011b693e4fb08ab852b89e61222beb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466753V2KK5%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032935Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCyVQHw%2BFh0DduLdv4mIXaKv2Ly%2BRyA9sM%2FqWr%2Fp1BG4AIhAKi2gR9O%2BSoWwU5wxjpvLhRAeZondrhpQJUq7IvAr1IuKv8DCGQQABoMNjM3NDIzMTgzODA1IgxNzlhuKziGHtigE0kq3APEa8F%2Fwjy%2FIhQdFUdRKaa1ibH9%2B9z8FPQWwwB0xuYmA5pddQlFdSEbeAWh2Efa06dzKSz%2F80ifGQXAvhZ%2BHMdkA0s7n%2FoARnBpzWOPW5SzPzgn5NytqGw582E3F3HIiaitY5hNYcU3Moe%2BnDzvH2lX5Qvkzzh4mCGEI1wP0E1QCghHMDC2luSEt6TOkW0Z4nHOi1NVgd3tkk5QMukPv0AbFLFC6kMYcD9A8mPHeVJnSLE8Q4fyhWxahwVw2%2BExPe7Qot%2B98TQtXXGs8qQeXSKY7%2BwKgLJwu40yWrq1k1D%2FJy2ZbOpL5oyL5avYBMGsKNHxotztEAmCCBWYZAZ7solhYUNrSL93pNqy34P1Umcb72C1%2FKWG2PJPU4pgZXmZzfMvMRZkahmLk5qOH%2FxdBDpEG6QEW4A32diZ%2BTyUvxM144ElZZR%2B6dJHdA4FAar1sZ9eSliDfc2dkqmwP4ezBtxw%2BIxy%2FcmlEn%2BL%2ByJZEL%2FzFLBhx0Ggodv0E2%2Bk7ktpGg6%2BnnvGXZR0tiEVqYr9346nL1fqX4371ElNmthBgqwkX%2FV0G4ZVpyR5NrhdhmCscyKQSnA03J7Y67TFXKdoe3eOmHZl6sB3qXT%2BgauhL1Cb7AFXZF1K%2BM3wp5PgWDC1rrfOBjqkAW5pkr9YL96PUG5yyymOy5%2BBrqdbIGUi8QnlGpw4y0k9nmlI7RWgt6B%2FVEHecthAjRr%2BYKojSS7d9TOtcY%2B56mpsCBNPVpqF1IrTLO9P%2FRCLk%2FCB0v6JVbbsfDKnGpdhZet9ST%2FHZqsVu6xIdusl5%2B3k1Jx20Y1Adk%2BvjrbYTlPkGtnyvWL0mNgqU3diePjT7bxKaB2qZnbTTVcNVsEeECg13wYF&X-Amz-Signature=f8d00f1c19d876240e46b2cb08e990b8a5d655159a33a156f94d68c54c0434af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZXG7Q5VZ%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032937Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDbIrZInLIHmvUnwjJvgNwRxSpomgaJ%2F7bwzH%2FSmssYtAIgejzV%2BDauSxEjx12fZGtqLgF4ZKRnXG9FOBfHwOqu6asq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDIp1C0B2aXZKSEcMYCrcA%2B3aEbj8xoNlVIw3TZp%2BWNNjBcc%2BW27Gbgke2EbUzMdK%2FmalwpC3JEzL9EG6swJj7ApE7h9l%2BibJKiNyz3st5qbTOXXh3fwVael0V3TDvCkFJamOl9%2F6i%2BIhOCLXY6KT6e%2Fayun0gMDZWx3Y8FxO4Wjo8r0AnB4dSK3wezEI5IXQIJOuVbll%2B8w8THVC%2FiRd6sm3O%2FMsnxflf%2FTsbE8Cls%2F5yiTJCQfUa9TB805LCfttQSCcMLYNn%2FUSTuQvvFAGSTUgcypCDpjgVVrJpjRH%2FDAku2DgxKCAHfrY%2FVMPaE5bOZxeoijfnoxE4ORqIsxWbnE99cNor2lOtmYNWLmrKNEdymnJQ2ieHxN6iJ6EdLkFkZ6zkNS9bj7xrljluHucyGiErviaFtuc9SXoaq5GPYtrju3Ga4udnQveb9CRtygskH71EokZxVTmVXtidKEPbR%2FQQ53AYUap02jcOKDU%2FY15Y8Oq3HxMIEDpdcuPPJy3LrOGRkW%2BVrxiRt7llY4Ig8IVgVU6RsXWsBjKsfZ2gkf3HYY%2BrdQtxiFV9PGW9xQnYVbWkRaEGhU1uIZ%2F9KCf95mhfmRLOpZIc8LScDsG%2F%2BydiOgB8OZ%2BimaD%2BZ2cdfq0KcTxFHlSyIkhkiN9MIuut84GOqUB%2B2SNkrSFeoDg0MoQu7l40n127agyN2gnVi4i0Q0CFzMXtvodTrfxT9M%2BRn2EECgDQKJgbscBSTBDMTC02RXiyjhIOOn2jYFdTjxWW%2FKhhXISzbUoWj2WFVDVeJNWXPQqXbXWjK2IvtdXi0%2BIt0IbH0D110I%2BqnoMMVngG%2BtK9z2fkoVdJYTvkWnRIj1wiuKaAJwxb%2FTUPUGR3zhvZeTk%2B6ktdWIf&X-Amz-Signature=c9a716df8383c788f3cbd92550adb271d30d165a0ffa3648db42d4919b3101d3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466753V2KK5%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032937Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCyVQHw%2BFh0DduLdv4mIXaKv2Ly%2BRyA9sM%2FqWr%2Fp1BG4AIhAKi2gR9O%2BSoWwU5wxjpvLhRAeZondrhpQJUq7IvAr1IuKv8DCGQQABoMNjM3NDIzMTgzODA1IgxNzlhuKziGHtigE0kq3APEa8F%2Fwjy%2FIhQdFUdRKaa1ibH9%2B9z8FPQWwwB0xuYmA5pddQlFdSEbeAWh2Efa06dzKSz%2F80ifGQXAvhZ%2BHMdkA0s7n%2FoARnBpzWOPW5SzPzgn5NytqGw582E3F3HIiaitY5hNYcU3Moe%2BnDzvH2lX5Qvkzzh4mCGEI1wP0E1QCghHMDC2luSEt6TOkW0Z4nHOi1NVgd3tkk5QMukPv0AbFLFC6kMYcD9A8mPHeVJnSLE8Q4fyhWxahwVw2%2BExPe7Qot%2B98TQtXXGs8qQeXSKY7%2BwKgLJwu40yWrq1k1D%2FJy2ZbOpL5oyL5avYBMGsKNHxotztEAmCCBWYZAZ7solhYUNrSL93pNqy34P1Umcb72C1%2FKWG2PJPU4pgZXmZzfMvMRZkahmLk5qOH%2FxdBDpEG6QEW4A32diZ%2BTyUvxM144ElZZR%2B6dJHdA4FAar1sZ9eSliDfc2dkqmwP4ezBtxw%2BIxy%2FcmlEn%2BL%2ByJZEL%2FzFLBhx0Ggodv0E2%2Bk7ktpGg6%2BnnvGXZR0tiEVqYr9346nL1fqX4371ElNmthBgqwkX%2FV0G4ZVpyR5NrhdhmCscyKQSnA03J7Y67TFXKdoe3eOmHZl6sB3qXT%2BgauhL1Cb7AFXZF1K%2BM3wp5PgWDC1rrfOBjqkAW5pkr9YL96PUG5yyymOy5%2BBrqdbIGUi8QnlGpw4y0k9nmlI7RWgt6B%2FVEHecthAjRr%2BYKojSS7d9TOtcY%2B56mpsCBNPVpqF1IrTLO9P%2FRCLk%2FCB0v6JVbbsfDKnGpdhZet9ST%2FHZqsVu6xIdusl5%2B3k1Jx20Y1Adk%2BvjrbYTlPkGtnyvWL0mNgqU3diePjT7bxKaB2qZnbTTVcNVsEeECg13wYF&X-Amz-Signature=d67e8dc459b7b15099c33e731b36c4f9b4a9f832b7532907eca5fc2cf88e6d50&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VRXKAZ2Y%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032938Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEpUBOQjKaOi8xDMwL7FIJ%2FlaiiT%2BFvKUhs6sSFpHqd8AiAwsGLJSZMyh1dOUiIg9JBkf%2BaNJe3jR8SvLMKvHg4%2F6ir%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMA1EZpDgGaq3sUYcsKtwDsj4X%2B3cdpDR0SOpNPOyNzp%2BUdjt8C8LV%2BkORWNGF6kgWmzNHPWfPFjdXbPKeDUiY9edTAIRn3oGZRB2qWDEMUK3bE9mu%2FN483GvzY%2BcDZL5x4Nxsi5DfBOWc4zUVHl2sBbHNNXdQSfG88slhYazT78KdtBcEtKv7orN%2B%2FlPjY4QLuKDNGo0a8%2FvcpEW%2FJqINlrgDJlO1bpgCR49GCIqfNOukFxwioeYogwzm8ljxPrc%2FB0l2Fgr31J6hab67XhuT4uu%2BtZAwRojAiGNPhqDmkLUzlJW9Yjh5avoDC4fTy095EF8cDGxqG5gwxfZ0aUJAYry0qA5fmK0slliCHfGgSdqlczngfgM8AICiaJMN0vD%2BQbapQkJPZlSZnHramReRd4%2Fo6LH1OfwqZS0VjGTfKc2dVwtS5tutrroNSr5QuAUSDggmHxkZxc9mW%2BmgITb%2BK8tw7IM255PRhoL8YWVBHRX0egfYUsUVIVUmf4zvmaopYeD86rYnYWmtAOpZA3pev0jWRaRXRexO%2F%2FM9eil7UD5l%2BftQLOASEywWDnjY9Gy%2BaPyzchYj31Ml%2FSrP9TThOUksZgrGNeb%2BZqS9Ih2LfdUJOdnf%2BZ3YypuIzu7pOEaEI9iKd6zzgyUC7ZwwjK%2B3zgY6pgFPRmawZHvRK%2FiYU%2FjTeHigWBb3S4vuAiDyCzdqtxQpLuElRS6f4KmTejvuJmWXegbBEbp%2FopoKStnoh0l9M5E9iM%2FP6%2F9u40%2F5Lnhfd57fk360AnhiztdHyzvsN0AwbXvKRiaaUyol%2FKzDR4LWe16Jsz3gmYoDro5h34cLIiXSvIQcqjACabkzTLUPiYPTqH%2BGEbrwUcBNUAum%2BuxOvt%2BOTwUVbLO0&X-Amz-Signature=e6ee0e61432e2b25cebd90e4916539d34dc3522038efe902a40e34ec3fa580db&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662TLGZ6GQ%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032906Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDKvibuP4z8XqnpZVtks%2FIoz2Ks8s90%2FgLP8i6v%2BecgSQIgCt8C7wS26gqMlWWQo6YP66DQ0Dd6D8D%2FZThlWNcFz%2Fwq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDLWyfq3Yy8mbc%2BX6wSrcA91P5%2BUn%2BddoHwoxGeMxwMDsPq136ZaEPS%2FsxWF7pP4lPqXzEhaFg2Ft6n%2FUb6wa%2BWI79doqjwqF2Ar%2BGFsoe8hVHeV96ZZefsXWW7heG%2FUy1yTFMUOneCTprrCQliPD9Kbul2b9KyhMgjeJHvOAHLuw4iZwlFsXJt9RTSz1XWMDzt8FVM6JF2vJuDqWw2pvIRg2%2FdC5BgC2Ag%2FnvBW5vIbrZLO1h82pBsSM1uRvr5URQt%2Bz0uXYgDoka1t45W3DA78%2FXqm55%2FMIzCeY6byo7po%2FD%2FAk3y5rgS%2FksFSDwS15CQlxDnCOoT%2F3rYQj7FCiyP7Rkkczc1vjMQIWash6xu0qfqIojZ1O0UMs7V4syZ%2F6QuWnYtXysR9ISuZrn7a0iag1J0BquQ5ENLoRzux0T3seFBOYmrb4qMYxW%2F0CBeknPr0nqR7F8dQV6a5rEvIRHS7gLIwa8j3IlGs7073dtIo0A1J5WNT1jtJOVPnfh08t%2FlzajPXcBpQrYyNVXpXDJAbEYTCBILWfki0Mc1vzd3vfSHjJPd%2F1CCwu05CKVlicbcbRDuP%2BEO7BZCXpCUMdWp52IdmRPyuJH6GJPfmPxUDv9toiyUXSLvd417%2B%2FDk1dgyT5Es7BrgAgrodgMOiut84GOqUBXamtYF2DsBEPPqA6X1JXBNoYjyXbcNqGUC89mIci%2FrSNFmHZPITZ8LNAYc696YDAokqMIlMpUFEUt7fOSdBDDyItmR4Pk225D1UHom0fT9%2F5STYu4ySPpGjnXL68vxUcRFT%2BGPzN3wkl1%2BWAfsx2HWojBqEJc3omPuq6%2BZyPoTAqS1c7HUMMH9F80d99YSouazOv0C5JTPYbTDmEf6R9t8HshSJN&X-Amz-Signature=33faa442f8b4827d72628998aab7a04b039550e538a92c84b3bd8f3c921e2d5e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
