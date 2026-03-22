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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X4SQQTBJ%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032434Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIH94J1xtZdHZYKYM5yZm2DJ3Jwf1UOPVym3YTHAA7f8LAiBvxUizvcyxJUXN6K3p30M4lIAJ%2BjMmOgMJ911GGpJgsyr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIMWiwUIT436R6asmiLKtwDCCjd%2FlUtpa3CZ30qqz7jOPDKYRRqI4cAPmtJ6Eof4s23jIjYC9BW3GXJSI7ROr5u%2B0OTKcUd4XbU53%2FKv6ZuLzzVvnKOTdD7SPRb3ijIC5P7iuU1idyfCSKLKGmKgQ9Yi1Z7fS39H7b1qkH%2F5mIHD6maboD%2Bt5%2FHgiHNr4lr2sOll8lQh%2F9BhwKj6Vj8Aosjad0di%2FiIOZI2LIwE7urjgY%2Bypd%2Fixu15JcxlgsURamyz%2FedQIVLCtF5W3UIcZwCWvfGnbKKzMgmsn4vVeY3Wjh1277biBQNUPJ%2FAncUnmk1HN%2BUARq26EaPnuK8jbMuZBoBNgSS%2BYgQyUmoolvAnLAf8qZLC7kFNDBUwQOT8TKvjvVcdDOeYF56F5uK6OqzDX5%2FB4jiTzJ52NRl4oBZKPrrkWw9sMXzpCPWKoy%2FWjENu3Urgt1eHvMY9onila4fUehEsRdJpmGGG0PX6UETIoY3fyyJL2vkNQkodmJ1yU3eTgxbYo3va%2FWN4wLDKEKWgqgi%2BAjl%2Fd5VAtJGXHtsyufXx%2BQV2eKC1msTrZTaZRy%2FQnbF4G6RBVzc%2B4ArttcpLqnh5QdUBeC26M3qejwacy7iUBACqrN%2B%2BiuNdHWXsv8LvgEwNZ6h0g%2FoIxA8wh639zQY6pgGqk9BFSsk4bOIJflbRTfkedw0tnDmzsprkKCFuLXgFQXfJ8PSAJEGYyi8tnXBnQqa4KGjQ21FKtWqolvo8zzZnZwtlflVu14Q83IZDRd3Dmk5DdG1C1%2Fdzvu20gPJ4F8Q6FDejlfXJnALeIHY9pcZDdgLhbL9Jif01ddIvoyyovM7rByYxRPdr%2Bv3L7CbRN7AwvFCSS5Gz%2FRfE4h2BUkXmSSRA6axr&X-Amz-Signature=835eb4892d3ebfd2922e77c744c0f0fb53d2a8e320df781b70ac891e0e640362&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664M6KTJKD%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032434Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCP%2FlVLZqALVUJHc%2F2mDCN6vad3fNCG5LSqQvdBWs5urQIgIbsM4A10e4qWyeMnT1Gy0UBEONQMiNTweg5w3i7CVx8q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDM%2BQ4wI7bRYuNeyRXircA2quwObpcQgiCDi06QdaO%2FAHiWIgg2d65FLXrvvow47CqIC4GApCTg%2Fwtc2CpmyVzUHbfGzRDYhoY%2FX7xzS1V1JHOhlyF0%2FZP3bH2vk68fqSBfGBZv4HYud4vNHIwQLdwqS6y%2BSEAZlKeO8SLY3mwqYlMSegWB9K6b51AYfBEmSM2EvsuOyQJ7RD8jwk3pdwJtClX3o414FevQX83iVKrYTnRtjHdl3Yg9UYgFHg6NQPLrvbWydb0dTdce2Si2CCiOIH%2FUOa6s2vIbzO37sz3lEJKQxCJnK%2FJ6NNfZyB9skztGkn74HmAuq23dOJ6Ql5lycRBNkK49QtGD0b3fMHXAA81LcDQLeT9ybhHaEI91AsJUM%2BTvBeGwgz1%2FlvsIp8AP4L8FhySQVdVNidDth7IfB81cSaUZNodACx%2B5cb5Pv4VzVa%2BCn2TpxtS4DrA%2FS9tnyFhorIo%2FeKc8Nr0AvnypC42mUJ%2F84A1yPcedrcJD3HzKVE1lhaIIOYLcB6yy0zHeDOueby50RlXEEzngRZIsNnyOKtwiZv%2B9sbBz6juUGM60zA6omTqIR%2F1dE2XBzXhUTnxNEbf2Zi%2BygzGJWXusEcZuz7lWQpR11wQKONW31qfGv2p8az4GRylm8YMLes%2Fc0GOqUBYpneA8vaQtMPWLfnuR96D3Fc8Z64mSsNpRg06rLd%2BlU6FHXqcx0YHS3nxPdburi9QmLgpval%2BhAgwWl56U12S%2BZb7iVRS%2Bg6iX8k4GrAIRrMOclig7LyoRmzU8XqDBQb5Vd0fg%2BLmr4auhnZVN2u2ubY6zJxQtIifBINyPdg9m1MCrh8txSIJGI63kuVyzmb4LrUNOjvIANUCRWnIHHYNhJbzCMX&X-Amz-Signature=49d3d58b0585dd8a6b620804d9e358afcdab79de6f136bd68c53e1796d14abb3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TXLYJAF4%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032419Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHI6ziz6ctlMu7jJozXfVJigRAcMCvyTd%2BVhPcUjA14%2FAiAYXHzjPs69%2FAn4sbN8WG09Cfl5q%2B%2FOV8vcs32zNtF6MSr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIMolH46LM1DntM4NzjKtwD2Ai5o1A3OYXb57jtELAM2aT%2FuU2rur5m6fLm2aLAAxLw71TZhpYBTnVniglolGaw5PE%2B5cgePEm31hC0kGVCZOFOxsB%2FdVTau2QJ0Qyrqkejo1MFQs2r299342AvCStR%2FhTV9EEfgHOVVag2NcFF01yq7AcsOrmnXA25%2B3%2B%2Bmgw0DAkTjarPcOYsoM7v7XclMPv2JHwn7aTmylcAsBMhEaivAoS9N6lo%2BoY0aqRHo7yWTXLZwMzwoN9jrDXAFWPLopFFCMO0kTls3dyTeDDPEzv7fjfr%2FnMZ1ziUqU5RyyNFQy4mMHolgT0odSFzkANst%2FEr5CXyQX40qOHdonkFmEW0D2quKEWoNX0PTY5cAw0xJcAeCCIR%2F1gYrBbaJGa7IF69JZLwaAyETFjhgUZz9kk306Ma2za4WlShyLTLsnW0KE4ZXaexUhNYHVCckLI8I1qkXI7BuLs5xsIsB%2B9ICW5cyV5G9h8mrpFPPg%2BvAuSkZOyrzcI5C%2B%2BaYDWoGttUJEFdXTXHV33E2ShNEu8FFItoj26H%2FnJ47hWXOPqj9dtqYHd6gq2WVNWWRIlZOqegFP%2F4iIGhrXwa34gj%2Bt%2BQ7uCqppKcchg%2BErlVar5%2FB4HJFuiXq%2BjEnomIRsEwgK39zQY6pgF6HsWJZZ%2FxV%2B3H3p5zBibrt5u9UoXRJznv%2BKJbZ%2BFtFyVHWB%2FniXETSonmDpozqCUZVclnPoluz%2Fl0LutumjWyCXm6zt%2FI4K9%2Bzg%2BxBPd0Yeg8DIhAGpZUiQhzBp3DCMhQj%2FqAgJZWwb0KRPDoRWhlruNXKXhZgJW7ZI18LG4kpWbFGCRahloO3cIvejxwFwGHH5loA2Wj6d7AFqDTF8hiDRU4ZhSL&X-Amz-Signature=ddd204039de204015f1cf5a0d6aa5d7bc1385313ce09a00e27c2200f11270922&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TXLYJAF4%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032419Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHI6ziz6ctlMu7jJozXfVJigRAcMCvyTd%2BVhPcUjA14%2FAiAYXHzjPs69%2FAn4sbN8WG09Cfl5q%2B%2FOV8vcs32zNtF6MSr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIMolH46LM1DntM4NzjKtwD2Ai5o1A3OYXb57jtELAM2aT%2FuU2rur5m6fLm2aLAAxLw71TZhpYBTnVniglolGaw5PE%2B5cgePEm31hC0kGVCZOFOxsB%2FdVTau2QJ0Qyrqkejo1MFQs2r299342AvCStR%2FhTV9EEfgHOVVag2NcFF01yq7AcsOrmnXA25%2B3%2B%2Bmgw0DAkTjarPcOYsoM7v7XclMPv2JHwn7aTmylcAsBMhEaivAoS9N6lo%2BoY0aqRHo7yWTXLZwMzwoN9jrDXAFWPLopFFCMO0kTls3dyTeDDPEzv7fjfr%2FnMZ1ziUqU5RyyNFQy4mMHolgT0odSFzkANst%2FEr5CXyQX40qOHdonkFmEW0D2quKEWoNX0PTY5cAw0xJcAeCCIR%2F1gYrBbaJGa7IF69JZLwaAyETFjhgUZz9kk306Ma2za4WlShyLTLsnW0KE4ZXaexUhNYHVCckLI8I1qkXI7BuLs5xsIsB%2B9ICW5cyV5G9h8mrpFPPg%2BvAuSkZOyrzcI5C%2B%2BaYDWoGttUJEFdXTXHV33E2ShNEu8FFItoj26H%2FnJ47hWXOPqj9dtqYHd6gq2WVNWWRIlZOqegFP%2F4iIGhrXwa34gj%2Bt%2BQ7uCqppKcchg%2BErlVar5%2FB4HJFuiXq%2BjEnomIRsEwgK39zQY6pgF6HsWJZZ%2FxV%2B3H3p5zBibrt5u9UoXRJznv%2BKJbZ%2BFtFyVHWB%2FniXETSonmDpozqCUZVclnPoluz%2Fl0LutumjWyCXm6zt%2FI4K9%2Bzg%2BxBPd0Yeg8DIhAGpZUiQhzBp3DCMhQj%2FqAgJZWwb0KRPDoRWhlruNXKXhZgJW7ZI18LG4kpWbFGCRahloO3cIvejxwFwGHH5loA2Wj6d7AFqDTF8hiDRU4ZhSL&X-Amz-Signature=d662aea1306773e24d791de5824f88dbb386205485d0bd64150333538f1eed29&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BWB2ZFI%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032440Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQmQ1h8F7OQY1MjbNSvwEB3M%2FT2zxjeptRGw7Yr4T%2BvAIgNhx%2FhP6bOpU8c%2BSZsuu6efQJVUbwdxa4j6cIPjRypt8q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDMBzs0lq%2FOfWTsFPKSrcA3MLuVVSovmmwSyluskx68zAGT1zSxaYfeZd4CsWePspgRQwXKQ7TDkG%2FU5E%2FCv%2BCmCWaqKW7ayE7JDKqBf5ryt49N1DZo3ZkmdTs%2FKkxZRzxUMRh%2BoEx908WxSKTBPK3slkcivK%2FF1ZHndT8Q4JgKbmvyi0X6UYxMVGsDINb7DzG2wYmA2aNN0UulVh%2FPiyY3GHekrgyGA194C7C8H3z2CWNXtgucscnHUIRmTj4mwaDrGLS%2F9trtiSlfrv6nNuOrvjLtwnMP53YKBDAvAErmP3dd8bNBHcuDPqcJXi8ZQ23lKccKA5xXO8UMkHmLsBM7JZW0nP3OnTfKxxugSQzanMwjoKnbeVA1Rx%2FWGODsTF4pls%2BBmnpmUN8bfGhkZ6qQt%2Fhpy21tBgrqiGyxqXH6EiPuZBadcmdL%2FjjmMHRMSa0lLavEMi7gBjrc4Y0%2FeovX6vBDP6hMs76fv9Degw%2F%2BAcRxj%2FF6T9pN%2FUp571L10FeA3BOpUDHfGM341ZKKLdjBnj0I%2B%2F2Xa1nczBQeEa%2B%2BXydVRtjmImZ4rCwqVVjIr4b5h1cTg7sdhgjU5cad%2BLr4%2Fy%2BpU1tShCUxLsuSGWWVr0Vd%2FPqfB0lpRDL2dgIv4pHaMTLaiKRFQ6MIb2MI6t%2Fc0GOqUBGUq7Fs%2Blbzr9uHKtcaoWBPI2%2BxWYehvpYGFZCFe3%2BZy3I%2Fg8KdalQZyFVeL2QBqsRxyIUL73yhpVFNwZzAuH3%2BKMKUTWjie0F4%2BIanXE8nwMU03kr5C9FiM1ZkYCeOcuf05wVMj5kB%2FtFSjkpqEDXoAmrmm1h9FTGXc7CBrVjE%2B45YORx2zKcVK6IoOU5f1PwUM%2B%2FqKEEuEtQ35GwXqq6l7WmD61&X-Amz-Signature=e15a862bcd64204a1a756ca543e16a0c3825b57be1878556707a4149ff0dbdac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VKZNMMZR%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032443Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDjJa%2BTmsXnc9YPkqBAoEynK8kztLEGQq9fUze7VkqmbgIhAJSc4fLY3YdAlRsmplO8sRfr6%2FmmDObgokLW1aarrsmFKv8DCFwQABoMNjM3NDIzMTgzODA1IgwWqAuL7M%2FeYHa2I5Uq3ANoLk0aOFyFRX1XoUo7CtUFbsrpmhJnHNxbdZ39QltL%2B9w3yWGq7A%2FZxhSjmmrbLwzERuNen3ihkoSy%2BZNgZBEu8CTpYtMZvZJTcBSTq%2FLT9C0Wz%2BLeEWx5BhjspPivjP41myMX9a3FZHV43lLAXnl%2BCKhmzCRpCue1vR80eWbWGlnQ1rQUGahLbNeqrNMUUHpf3d5h0XSOjh9Nmvp%2BAQID8ZPgRUHjyZ2ghoElJWCr5rIiOVSpkftiVQPz7bgFevFTfspL2uHrdr1E%2FgZUz%2F7iF8v5slcbmHL1k%2BZNC5H9M68RV0hYAv5R9qqL0Q%2BfXiQm%2BVtmNxH5peGmDjfzjwP8L8vIumKnTHKfcX%2BpRnsAh9hAqpn2p2CbmOTI1FootkYu5ChlUqMAC6cA%2FujDMvkH04ipi9omWnFBHvFG%2FlAdZy7xF5wkJim1K%2Bnf8JEDW4pquRSJsxw0kGT56swt%2BJVcWsFelfJotk7J6h8v7mvPSuvSXUMFvqGimNPcGuXbxBB%2Fin8YRKYZJwoAu%2FX0zJk7VMinGtqAfHxm1pTMCgDzO%2Bn9RPQfRLCJDH%2BJXm0nYiZkxeCq0yBHZ9rRfh3USoF6w31yx5Pl19lGUSO0BwOcQwIHxC2LWO8pNQoNujDGrP3NBjqkASXY7n7q0NmE6NCGOCNEx8%2Fnfkzz4ryO%2FWGRxVAo0JyFrnuhQ1CycFQ8mVo5B3PjLclgI0e9KTUpujESZkvgPHeedgVXbiu4z%2B63KS511Mf4qq%2BdymaRLp7PmthAWeCjcW5p1QlZo4O%2BOYUxCXxpPibuFi6r5byZ9fZSqfbo51ESaL4z01hvkaA72deZ8Ta%2FCtuW9AHRhZ9c7eBlON6iUoZrpla4&X-Amz-Signature=04529019d964917f773be03a988d5c2d8ad35d0b8449b333b6d5157b4f5085ef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667XWCYRSW%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICkquHXLqWKSV2605Iy37ekA4cPQDOo5Keb5Yp5zAZNAAiAgFcX1km3s05cXlX2%2FUp%2FrLaFOzA1wKl3C1848PYFL8Cr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIMcL7EC1TQYuWgxK41KtwDzaIqNnHsF6HN9bsBNUrGlvTQjmrRZgisYgrE%2FDPlMAQgo2uANlFyf0MVAx3gBfa6GhCFdpUUUU9sHTvYjBbUyAj%2F8o%2FDb15HpQI54edWG0F1x%2BA83qg7v4jeXIIFeIBd%2F7tvIo97UCbXnhxxqDoNNDzaHwu%2FxjNaVfgV9d0cpcmQBjgEWRnKNudJa4JheEQaD%2FuJLhZnZE7Ijm9I3gYkv0Vwuxs57S5AfiOLMJ%2FjNcmYTEY3ooO1bhQmeU2X3A2hVuhNkXqrzn1LDU3%2BkKraz0vha7p%2Bsj7UwgGOOgRDAXbWkSGWdkksEbwpZzgDbY4Sn%2FNvR5x%2BorUZfyXxe0vohmIcKduN7me7apXzDy6F2QZ1l9graeoulgettDikKG9pCU2lv37wY0aDz0PsYRgfxlQO26eXhElEUDxZBZDANYhzbu2c29KQiXikI6zIqyLC%2FinijZmyRXNWTCjdMHNASyJTUV9%2B8L948bJWtOb3bdCLGCU3rZubjtQiWL95%2FDiKp21fsKcZmv0sI3DT%2BQnVlUHnY7M2NweeNw9TaDToVTTIKc%2B8zLedM%2F0SrT%2BPRANFKFOe1CnalDad9jwLG%2FcrnmNuD3xQ1J3CWAgjwNRWE7ZmYawmudGFzekTSYMw0K39zQY6pgFIFyfVt0zoT%2B6UsAXi9B6%2FRfMphKA%2B5hMSPUKuOLG%2BN%2BRecAisAvzFqYREAjnAKWP1EPd6CQct0zBlT7U%2FCjCeqex7L78m%2BpNFYwp4L4C5jL0Uy96VEudloHNTmHrsjIQN59yC0ZUw68IYX1pNXdImgOt5uOGQRh5vUsd%2FA09OoV9edIH1IIjrAg1RsCXivX%2BSm%2By5g6yGayTUu3uV%2Bn9dOwYY49Pj&X-Amz-Signature=548a134f3582bcd21d83b53f39e24e66cb79287c391663d9184353d048aabfbe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BCKIK4F%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCreNo7JMGIddXdio%2FKmBxIGYqZnUzg%2BAhIfmxPRN2mPAIhAJgk1%2Fhf64f0Q0UA9KEwnCvxz0kF8%2F1%2B7wFMKQlzE1aKKv8DCFwQABoMNjM3NDIzMTgzODA1IgzoDVRHmomwgwjaFL4q3AMgZgNLTcMsrsLBfWq22LK8CjrYeE46CQxH60dGYs3h0rIzVj2Ox7YJ2XQiMqh8%2BR0S%2F2gxktY2bixVOmGvTGtYkj6xbl8mhRf24lxX9vGiJ5Qu2Q4jKweS%2BqX2KCqlZFDxFHssegbUWWTf4Qxxww1j%2B9EkcKaIVrhPrMI1xSjTHfe5LyZcR3pU8Woag6uIh7mHpC%2F6jYORQpGmyyjk9lCfWIz0oeVhrwBIoEZcBoszF0yVyL5l4vVy%2B69QwZc9W0AvsFtwROMg5OfeK%2BeCCthB1z6ngxgEPnc58kPW0kQv5DPvphnyUAflBgQbGw753niK5rcmZWYFN4MotUb4lsWVSwCo%2FnNiVDA8pvsv187JsWYlyHBEGq9CnJV2p9e9cvZBUkMYvl%2Brbi%2Fs9PCTk8tcP5N8Ev8QTJT3%2F2Lop%2FlZB0mluY4BVWxYFcTEl6n3RYjADwycxXpCqTggEkyM22t86G1AN%2BKiP8JRFvW%2FbUkcTmrWjnwhz%2B6aNk761qJzY1PhUxy8o20S5V6Gc6Lija37dz9KBgn3Kjv9ldGl%2Fmhrc9xc5rpSIR6ALtSN%2B7t3xME5q7RPCBz26fNvVQU9JewFfjWdQgdRu0nN%2FiF43Af8IjNZbjhg1gWzo7DfpzCtrP3NBjqkAXovK2FT7bL7t3Bx%2F5%2FGltOmbvaVVhGp6k5q1l%2Ba1iNyS5zD%2Ftm8aOhHBDnxx8vFysrisMLz9TFvVMMkesZzBBCykFqoGziR9%2Bo6JR%2FaPRwKnmieveKv6YA6ViozajAMrlPI5BTZDoLZv2EuN0qmHZs1TLIC%2BJL8PWKkoChIPTBNDOJTxWW1rhfy2zHBD4aRS7Qgf6Gteb%2BZC3RjKJANRlVRNpm4&X-Amz-Signature=21343e2d4be4032093657e183621a2f14dfc4fab77eabb08e989d39b4acac311&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IVF2QK4%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032447Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIF0qpd2HoA9MBE5XgPyYVuBcYlKBg1G4p14U5SCdtj%2F5AiEA%2F7PtfICN2wS4Zv6JiXU2zytZmOal21b5eCnTF1WbuM0q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDCKkjYQnCRJX%2FvgCASrcA%2FdRHcM0bzwt2XtWBTDOd1rihlRTabLIRb70DDGYqgO%2Buv6jQQTB5DsU%2FKQa0%2FdmNFiJ8a6fdf81O5txkEquk28YjTLq4Y8G3GyPAehneIdlc8irG%2B%2FCY5a9GPRR1uB7zn6UvFOXB%2B%2F3k86hb9wS4Q72fDFp%2B6UP3ihlIsGRSzpi6IMJoVlIkDgpT%2Bn4KoLKWvSSu%2B16TvocTOm4I%2BvBWyf3st1YI206Na9xVVWvoeO8wqUgyytGrKbVSHrV%2F4QERXG4VrkR1Z9gfEjap%2F3R2L2rSD8fxtS3RpqEwV8Ri9dJoBVv69cefLXshKqn3OY%2BUwEagC40xMHmhaG7AtnUOoBh8ntD5U8xwab2Gk67lx%2BzPtZFDKLpvQHNKUsUDQFDQXq1TGw82V0NiAJkUa6tNZ7TJmL3WtYGpzLvvprPEfguAIyvpsaCG1n3uByO2u6oMxqTAiymjmzHBboegEkzeoJ1K%2F%2FWhpajXbNC1umdD9Kh%2BV3I4y5mzq0hpsTKkcEljvETLocpjbxtD5a6%2BJP4n72KZuQmK0%2Fgnlfd%2B37dnbcTFhipSl03sWPEf6nNYe%2FDRjz2ZfbHWh4hRiSdas53urI7NZlmE66UCqV5BiiOFv7aS7I6hqhCfo55DUYpMK6t%2Fc0GOqUBbg1zXwO4v%2FPUywxs6zPXeQr5NyfPT5XnzJBSIwEwIRQs72SX5%2BXIi5CxuLmiOavDyk%2BIlXi2iCKa8GVAfbICGJPysYvsGwXpHWKixUh4d2dR65eRNLhaUJIYDlEV52aQqsCwxzHRKn6UohFmhssJIGC1NOVbgQ07hP2bnBf%2BBqr%2FsUX2%2F%2BJo1ozHqc0gm3hoWz6cL685RDHz0b17%2BZ4atIHzdHEv&X-Amz-Signature=64ded1b81a1c683af4daa51356c38bcc09a6bf9f4f50bf8113b7dc2be4acc48b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TXLYJAF4%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032420Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHI6ziz6ctlMu7jJozXfVJigRAcMCvyTd%2BVhPcUjA14%2FAiAYXHzjPs69%2FAn4sbN8WG09Cfl5q%2B%2FOV8vcs32zNtF6MSr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIMolH46LM1DntM4NzjKtwD2Ai5o1A3OYXb57jtELAM2aT%2FuU2rur5m6fLm2aLAAxLw71TZhpYBTnVniglolGaw5PE%2B5cgePEm31hC0kGVCZOFOxsB%2FdVTau2QJ0Qyrqkejo1MFQs2r299342AvCStR%2FhTV9EEfgHOVVag2NcFF01yq7AcsOrmnXA25%2B3%2B%2Bmgw0DAkTjarPcOYsoM7v7XclMPv2JHwn7aTmylcAsBMhEaivAoS9N6lo%2BoY0aqRHo7yWTXLZwMzwoN9jrDXAFWPLopFFCMO0kTls3dyTeDDPEzv7fjfr%2FnMZ1ziUqU5RyyNFQy4mMHolgT0odSFzkANst%2FEr5CXyQX40qOHdonkFmEW0D2quKEWoNX0PTY5cAw0xJcAeCCIR%2F1gYrBbaJGa7IF69JZLwaAyETFjhgUZz9kk306Ma2za4WlShyLTLsnW0KE4ZXaexUhNYHVCckLI8I1qkXI7BuLs5xsIsB%2B9ICW5cyV5G9h8mrpFPPg%2BvAuSkZOyrzcI5C%2B%2BaYDWoGttUJEFdXTXHV33E2ShNEu8FFItoj26H%2FnJ47hWXOPqj9dtqYHd6gq2WVNWWRIlZOqegFP%2F4iIGhrXwa34gj%2Bt%2BQ7uCqppKcchg%2BErlVar5%2FB4HJFuiXq%2BjEnomIRsEwgK39zQY6pgF6HsWJZZ%2FxV%2B3H3p5zBibrt5u9UoXRJznv%2BKJbZ%2BFtFyVHWB%2FniXETSonmDpozqCUZVclnPoluz%2Fl0LutumjWyCXm6zt%2FI4K9%2Bzg%2BxBPd0Yeg8DIhAGpZUiQhzBp3DCMhQj%2FqAgJZWwb0KRPDoRWhlruNXKXhZgJW7ZI18LG4kpWbFGCRahloO3cIvejxwFwGHH5loA2Wj6d7AFqDTF8hiDRU4ZhSL&X-Amz-Signature=61af11d0e157ee2b58b42ef3493eae0a0ba9aaa76648f85acb4d1a668fda6d4e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
