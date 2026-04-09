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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662AK7CLKK%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032944Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIGXqETibpl0zJB9DH4UOnH5Fc%2FLM%2Fid1ZpbxfbAMWlMoAiBPa9srNIq60krGVAT45oNzL4yJEBZZZ%2FKhbW3CRV56jSr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMl%2BRB6pYCM4JYKcQVKtwD%2BBOUYdyQXYMofjIYt6Rh278GyvFG%2BLmNqxchXpQTLX12blAs8Tczmp6evjphYI5c1mQQU5iolvHGJX%2BPVzfBaL%2BxZcIEsrd0EuflJW3stf9DPM%2FCaHSgTCJkL%2FYGqWJm64F0xjfL4TvoY7j4Kzn4GKaP4%2FJDJ1RedMB1jksYPADAwv7%2Fk7nwZxtmAXwWx%2Bjl3G5ZY%2FsVabT87jtBd5LhRG2FoT0n4uUXQj5HtB4kaOQX2%2BsUTKsRo%2BPZwrjGoRekYMNw5Lfpi1D7ejKVjNhUAlC4NVcwx3z8d4Kfz2TaHHBUwlufx24nFN1LuGx8%2BoMgq%2BK68QEIndgnh17uNDlivgLmtFE7PdEKsaEd4eK16c7SmY099DHPPUIwk6lTbz7p1EuHPHydDi9SXx7GZJCifPrUgBZCniHjV8UHnJcyxwJmQmZfjmQr%2FxNfWMx7IvrHtUEXlt8ZcJ1kHinHone20D950SmsbgpkHFFz%2By%2BTa%2FNNX5OcR2%2FJ4FroYdsywQPDSigVPHEuCNbN344lCVoCfMlnpm8w%2BwITogyQt3l2x7nBaKUz7D866Hb1WZgjmxcD7qnB53pd7UxYVnvP15vxB%2BOujRESGymrG%2BXQiVAxkigcxoa4qWCyuvi8pS8wsLLczgY6pgE42CTMRDjLNGu20t3zvf59dRn%2BGeBQy4BbCvxMn40VZm7Fdavc2smVvdK9yUYbEfMMnnnLip3ApbCIGwRoM%2FEHmc3RwCRoEJUJyVrq5Dp%2FZIyBTXwAvuFkZ1b3ZvGgyCd5O8OMjHeWB4g2LMZ0EBZ2JQABdXwZATTBkgrtiMQpB3nkOladeWoIZhqGZeWxS2nhTyrQslqYzR8ap8yHd7W43O3p8XIJ&X-Amz-Signature=9b9dd550fe5242fdd8b45ac1ace0d44c0b4f25ae9f8e48c6679a71555e6d6002&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XOPM4OQX%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032944Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJIMEYCIQCbckHgL%2B6dTgsexxRCMXEpbSQkwCHrZjcpAbakp9llYQIhAK%2Fe8g7uym492fT85rg6S0KA09v3tqPTGWv3Z7KFMRMNKv8DCAwQABoMNjM3NDIzMTgzODA1IgwizkNmdqWg9rb8Yeoq3AMpHQoyCuEwH7cOquhpHAN7DWaK%2FYujEBdMzQJCYONIKIVPOvoNxeSMrY6Ad2psnpwkocmzuNkrN4wTX4INBKDHudtFohIN%2BeNUx%2F%2Fyq%2BHQAFutgRyKsJWTRBwGCH%2BBNOuVlVTe7yISgjr43Wq0Y9kZ37%2Bs4cgLsqcMnsnFlgd9IvoL3TZOloNJzylGIpg80muoqd7ur68fSCGixLL1Liu8BYqplGn9dDqjSD6giZHaeE%2FANfJFjMWF48KWd9ay5edv%2BQC5Z6BLhEyyDE%2FuPUHflqaHFZteCbH%2BwEFgdZOCS330liDtQLBQDsUeI%2BKWw7pPCxhEM7e%2FlrF6UwexzxJNJR7dQJhtLw0JJSnKmyyeSWS%2BKZLLntR9s42o%2BPS8WflVCqV3qW549s5LuFwdVhZ9r%2BilXxulyhK5pTjr10YNsp271nS2bHpUNpT7xaH3hkexfkx3gaXWtSUn9j%2B65llYxYFeAV5hXMbMvqyxo9cCezvieQvWToDiNkab6PRUzIME9YZ4Pm6OB5dSzZ1S67JPNBglU9hOR6nm3ek5949JEYwtHJaga4sAN8a0eQgb6v8scda150IH%2FlLCkDkRcFuCs4Eh0X3e56SZUG21SjDGzb4R6qK7XfLzujIkgzDQsdzOBjqkAejOal%2FkHbC5wmxBgEogTbz4fYinPZ%2FrW2qRYVgA9DZX1vfUUKB9NSHsTtb14JSMMrlAbnxTiv0wgKmqUaJEUjg2MWXwcEtPtpbrCCGrVX1v35hIrw%2B1Ls%2BJKBJRq1edVJnyAUoRli3Tk6iZTOio13F9EcgJ0t7yrqaDaVNzzS6y9DN1CW0Q%2F68BpNg1eGQgB7%2BdJ0092niMVS6IgYV8zdtyLJt5&X-Amz-Signature=3bfdbe7f83de35ad6055901141698cdd6ce857a8a3ae645603b60b8dda640802&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663HZUSIMP%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIBo2TPQxZNbjHI4BeOzkufZQyvJ7s7StlQ0gJzju3dn9AiEA4cMTA5ddgcb3FCJmDNzxurW59cV3e%2B7KDRf4RuUBtasq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDMtNVLIbwj01T0LEmircA368qL8%2BzEiVYLh%2FaBs1Ai%2FiNTsPEt3K3mYAEbzuyXxutS3hsF728%2BRVIkBGrBXJv9Ql2ytFLFA70LvW%2BGyxYtepVulvXzkPzNLYhdQugDa%2F01keE0cYylnPH7QVgdjg8rmGUebDVgRkeDyLeC%2BivrrX1bGG2Ox1%2BJn7%2BZ99PaPt8hrkUDp794OC%2FUhZOnBAfccjfHdb%2B9qT7jv2hvTSRvB8DfZWjjon99epMRQ3wcABpnP8QRhvxJnSbjUgSux98akam104sYdYGCANQLTJe1gRBQTY8yVtLiIvBgNiNTOkJKOE3HWIHaFsoXLXas3tSvSW2vzpakCo65ZuYOtTuxmrz0aaGp3e33k6dH5HpIQqeA%2BDZDAqMF4Xd3LLLOr7s3GcTjDC2pxYIE58NnMVkD%2B%2BMlUExW12M2n095Vi%2BvBSIrlovdIcqqYJF9JUDwAqG2ZdtZJB86qqSlB7uCG9RVKWJo4LGnc6g3m6vOvgJ%2FT03RcSkgA8udensIUv%2FUoekuws0VXG9My1E83N7OXGwliUILC%2FVT0tbsuXmkrCXcdeutBg5DMpG0HHz%2F3KrQLPqIPDqX7Vt0LMqJpXZknPEiCo26vjLpIENTNEXO6%2BkIE3hE3aahPpx8%2BtFr1yMMCz3M4GOqUBtnU%2BZmtZDXYtN2zKdXntrt9WWrjCxYaGv%2BSp%2Fz35psCfq%2F7tWtKq76o218bVLn83DFLvb%2Bgplt8LjZcDNVt%2BiwJ1VSrtolcKXh%2B5BmNlaIptZ0lLqtDAtbiDDiF%2BQiUYeqim%2Bdo7Q0S6ek833B2alDTX9TB5OjBT%2B1y1DCdUubEPPO642hf1Rh%2FypaK2brm6A1JDS%2F%2FsQjSI4EFpT2sboaG%2BHvNS&X-Amz-Signature=352f5b8e05566dc7627e18cf6b66edf918303879ba08df078b870aa53409a9cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663HZUSIMP%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIBo2TPQxZNbjHI4BeOzkufZQyvJ7s7StlQ0gJzju3dn9AiEA4cMTA5ddgcb3FCJmDNzxurW59cV3e%2B7KDRf4RuUBtasq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDMtNVLIbwj01T0LEmircA368qL8%2BzEiVYLh%2FaBs1Ai%2FiNTsPEt3K3mYAEbzuyXxutS3hsF728%2BRVIkBGrBXJv9Ql2ytFLFA70LvW%2BGyxYtepVulvXzkPzNLYhdQugDa%2F01keE0cYylnPH7QVgdjg8rmGUebDVgRkeDyLeC%2BivrrX1bGG2Ox1%2BJn7%2BZ99PaPt8hrkUDp794OC%2FUhZOnBAfccjfHdb%2B9qT7jv2hvTSRvB8DfZWjjon99epMRQ3wcABpnP8QRhvxJnSbjUgSux98akam104sYdYGCANQLTJe1gRBQTY8yVtLiIvBgNiNTOkJKOE3HWIHaFsoXLXas3tSvSW2vzpakCo65ZuYOtTuxmrz0aaGp3e33k6dH5HpIQqeA%2BDZDAqMF4Xd3LLLOr7s3GcTjDC2pxYIE58NnMVkD%2B%2BMlUExW12M2n095Vi%2BvBSIrlovdIcqqYJF9JUDwAqG2ZdtZJB86qqSlB7uCG9RVKWJo4LGnc6g3m6vOvgJ%2FT03RcSkgA8udensIUv%2FUoekuws0VXG9My1E83N7OXGwliUILC%2FVT0tbsuXmkrCXcdeutBg5DMpG0HHz%2F3KrQLPqIPDqX7Vt0LMqJpXZknPEiCo26vjLpIENTNEXO6%2BkIE3hE3aahPpx8%2BtFr1yMMCz3M4GOqUBtnU%2BZmtZDXYtN2zKdXntrt9WWrjCxYaGv%2BSp%2Fz35psCfq%2F7tWtKq76o218bVLn83DFLvb%2Bgplt8LjZcDNVt%2BiwJ1VSrtolcKXh%2B5BmNlaIptZ0lLqtDAtbiDDiF%2BQiUYeqim%2Bdo7Q0S6ek833B2alDTX9TB5OjBT%2B1y1DCdUubEPPO642hf1Rh%2FypaK2brm6A1JDS%2F%2FsQjSI4EFpT2sboaG%2BHvNS&X-Amz-Signature=0a5bb018b42d659dacc07c314a3a504c18b62f6fdb40991d091d03f8d1995a1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XK4SFG7G%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032948Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJIMEYCIQCB4fHDfX74p%2FC4GbTKA%2BQqBk041NJOM0mdc%2FUlHhyAkwIhAKER%2F4AVSWwKSMofQLXdHE%2Bu3EpEWasETvcfZq6mgH4OKv8DCAwQABoMNjM3NDIzMTgzODA1IgycJU1%2FPW35DI3FE%2Foq3ANurrvn8nIWfyQXfoxeg6y%2BkoKvo2s7iCGSp%2Ff9r3KoqrektGI9ozUfCLpKuaNcJ2pMEp0guL2ByZ6vxOMnA09nOP8OkiJAPMnxPPJOZrLcghpUmilz8qNFORse3mhFzkZ2wIuLgC2s8zIzaiDcWGciG4qA1uhbO7nal%2Fpfi6UpZ%2Bf9eQMNlKdCCZq4i8JDzZLmfL%2FfSxQUWgSONivSzJRMr1JYjDjwiFk55iNTISn1%2B9nH%2FbO1amQkehlaQTTc0jGOUKh%2FsiscmKs8VKko0qS3PEFQ2ZyzC24ig%2FfWV0Kxt7PDsWWCMwtXr0PRgsB9IJajRkerS7ebLeescgCKKdfPBkQiYuNwo34lxyyLuMD8RRjmxFi2J2dufw5udDZst3Cu0yZpK%2BbhpAeLsNp%2FhRWZc68ETDi33O7QyN62bnj2pjC4p778ExTjQVDZSr5ggiE5caL1wsqEEl6%2FXSyVYJoJVEyRzwJ%2BB%2BoitGCt0CE%2BNVI5IZnvwDL6ctMH3KBkIgXPRLOvcWZwla1xPOzicH%2BdBcNNaxWswKj3bVF5jI45g7uPkHuwiUnuGMh3gd9XQzExkCBd4EDVIQwMIjQgwhnMwQat%2BrJsvstYRNVxS%2B4S%2BrOSDxzkNAnCxIwirzDostzOBjqkARLWLQa2amc7DZLK40r1HXCVwr52sxOmXh9Vhod0Erv6JOvJgY6wzmttENoWcZTQ8%2BiepaQSx0AtPG%2Fjaj5Eo67KpHJ9h95NG7QJxSv2iLCmM3OSmgrL%2Fad6oKnbt4Dtbrg2kWxmN6kHa6tGCgIXAfgGQib%2FRcqak3BuzpeIbhaPiIw%2BAbptZAlgNKznTtDpK2h%2BB1NoBgQSjOLm82Xqdta%2BRKCe&X-Amz-Signature=cde89c12b9b1dd1a98571d935a0499855517188b675f9d6954dcba612cb7d8ed&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S6PG3PSJ%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQCV8PC9SPbVeZYYzjamU16bok0aFpjCwH7EQN2VBJODVQIgPXEJWlrJ1ChD8Q2kV898KiDFuqqp28ySFluVdAVOwwwq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDFvHUGeoEf32GOPXESrcAxG16NkpWIzy8DxM0RmD5X%2FOurAtoXNEgszMRrFZz2rtOXjxglUMV4rAEGdt43Je6Jb%2B5KuRXDguKXczyJdbcHo2CrAhAP6ZS8CwlJBSJB4O0tUQzz3hRME1wONzAy6xLx9J%2FcAl1zY5r95%2BHvg7NMlkj8CkBC6RgIflGTTcz9CrPOq1xMpEn%2ByAZfOTkpbGPhRei9v3VX2vDZlLTGX5KL1KoEs%2FPyFvd0AhGDrWB1GD8EZQxBCrBMW2QL%2FMzTrm6golw8et2ReWxXxy9oFQliHqHnqdMMnsThrp0k6pXl43PPrX4nLRczShAS3LQ%2F3nQfNXodTlvT%2BujPOFLUtax7GxL0JWrgcwm%2BitI5r8%2BO6WHRm%2BFA4O52v8IHUMXYWAlFKmjBeRnzYTFY8Lq8IxQJmdPI6X%2FFfQt0%2FtfyCAS5yiEDBXZ7IU527lWFPU9TktQjEW3CehVIWrx5IwO%2FvNlMv%2BOk6J2cJB1Mn5zZg%2BK0tKB2zjLaJqmEriGJPGZIQw0hNzzFanYSWnUphNcNFNElQWeD5eSd27ujbljhJQ2W05%2BlPDXOWOKFs4CuTmm3yF2pTpcWppHbNiZMRbOB3lgg32UFvC7M5d7O%2FHQancfO51TEO%2FpXn38gxQ0dDEMNGy3M4GOqUBssIF90XdaUkFQceGu5gB3WHXHkiqEMstllqrgwdbBOsgNdM2GSTsvAfk2VDfJ%2BBZU45rqH4OT5xEjqWYoWfSc4QuyQJrypGjO9lCfm1Iucw4Evr738No9MrGyRn3b%2Bxz1OgDnAfyuMs0Y6BLTcCSXa7ipJsAthfwWIfP5DKRheSlk5CyaHj5pehS8sYHJy9OjU1RYuU6oJ6X8VC3%2FSKXh0guV3Yl&X-Amz-Signature=a45e24a3b6c7d28518722de3cf8bc7ee2e0544cbf110858cf78f2916cfd0fc5b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z3AB4OVI%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIFkQbKwXy%2Fj7NxF1CTxCotNK8V02K5gEP8tWMZudK8kzAiAufaOGwUgQ34%2FPRWnIu8lgcs8j719rtqtso1D%2Feh%2BGqyr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMmK%2FbRdgpHoVW7r1dKtwDhbQTLB4BXXRv9o3KgKCs0fBUP1hkaMHP43HTl9Av6ALXcQq%2FSmTV98G33hBY%2Bnk9HNQOa8i2JF9d98kUthgTWEwwEtStENqDTuGr8KPPu59Kvp%2BSWv286Gsrh8MHssJZ10FKqaw9DERs5IM5WxYh%2BNQ8zuwRYpQPvKPdzRz4Fbp2R4m2KrEadXxiOpu%2FJ1wftq9%2F6%2BNrBnjQRpGQoda0c%2F40UEi%2B1CQIlRV2mctxdBBVsQ8JYut5ItPB8jHanTYqBZ8QwqCjmqqWXhhtmQpjwrUplZ7AoVQBOB%2BBlAjzX631cu%2FcSZ%2FWAgiURC8RJyMT%2Bh5W%2F5QmYVE4C4BxvuWYdF7mud0rkOXtlQr3vb%2FbwWZKbmJYaabodzae2rc5gPY0qxwoHzM8g4NQxKAX9yMQtPrWrZhXTDZvwXVyfHpUxjdBh3qV96mN0YKQeOn%2BwjCzgxqdgTJ8QuG8nzI5Ggaiw09f0TJ%2Bj%2F1RgTgyFcWB9F2xvD3wgZFIWK6PPIEfts1jw90I1iQ4WwE1onnByIeDBWIH8mWJB3kQDZ0rV1yadltmG5nEPyAVMKSkQBCwzTmmAI6XgzI%2FXYS57qPHihQRvPn9U7rQvNGVpO5gmmMievspuYRSc7rS8HWOFmQwnrPczgY6pgGxvmJiZrVFt6P8xFmbVS9sgHWlQnIvloDSdqL3YwjyIAqrKqNGiJxZ7%2BcOYZL%2BcajvA3wfQ1VSnJML9qNYMy6jeKB0oGEieBDBsgpT6aGk5eO9gXbZFgPvYEeJrfe8tj1k%2BF4wYSHt9dBD%2FnsO9N%2FMnLnqpAp7MlcHKZfyIA%2BZtsIMv9nSo0zm%2Fzn%2FasFcV84fvis8zcm1Ly80FhvhULoOVFxOjgCX&X-Amz-Signature=166a7463954b970aa5c7bc76c0adc6847061d07eb90edd7f7fb0580fc050e1c7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663CCVFOQ6%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQDQ965WMj%2F6qMVLRmyx2LW%2BYtURqSKOODzBaHHkn4EBIQIgF1lEcEW%2F9amFhTiO2aiTl%2BpZcZY1hzzjvQjrKRxXL8cq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDAsHFnI1%2B2I9rXZD2CrcAxyE73woXZH4R15ffHOSr37%2F6WnvWhWX48uIfNFuY9TKNZ%2FQ10oBXDJI1kNTJSr%2Fi%2Bl%2B7wxQAZSRWbCmX9jFZX8HV4WQ%2FIHey%2FfMv4uDkzQvLbYqtnP5mS%2BD6Uoia5BW7DicWzp4kYbewNY7EQOgd7xtjCWm%2BcpSAnohzflCDKBEHo0tn7wgp2PDO1OZOoJH%2Brui3B%2FqUYMO5SpXjtKzEJ3xtEP4cBGmd%2B%2FpjZvgBTOjMwRNWXCXYmKlyUwBUL1BDOvMPoC341Kz5RgkFMYPsGRg9biGonBaON0FPUjjiEbSAw4HH59dr1cvuIPYxFndlaSyyvQYnUHAu8ITLB%2F%2BQlP%2FKFIsUh5Tg7%2Fp9nELoeY%2BMlYgpTa%2BbD6lJbx54emGz45VBpc57lfSGY1q8d8MDaYtf7%2FoeDsaaSKfXxl3%2FhwlsIbV7mpjTShEtcklzdTGv%2B2YcaYxKfCnKD9XLrcb3wRepz21TJra%2BZ4z0Hsq2JoeiASiOtNUqH1tedbCQRggaLPiZBmOVISpNiegfyH%2FIQSkehm%2FqEWY2J2OMpKCuJNG%2BZUczC3uxetHWZEbrNbtfsKKEr8VNL4qn17%2BH0jXHFHhg%2BKt7vQAP2ge3YTResLxKFTcTF4t%2Fu4vH4BQMN%2Bz3M4GOqUBCCMxk6wWxKUW0gLNFcoOuEWyPQwj8AwNmi1PufYQkA6dg3RF7PRxpVD9u3fRaSb0fnKya%2FCibQIJvBUQgih5rZd0NGT4NYdk8QO1fxPrmk8BK3wpi16KI%2F8IzXKouCpWEEvEYo310Qiq%2F5BP99ObLQWr77V3Wf2fjtlMejaagHgStaQ5K7EffJPpuaBi8Xru1nLE4e2W77pDC83aMU8%2B%2B6TxvjX6&X-Amz-Signature=daa0efe96b2a71aebae1f7f17a8e92f18a9c72e47ee9cd8280ac2e068db3219b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZBTHX52U%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032950Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJIMEYCIQCVN%2FaX0g%2Fq4b3AcpMP47PievSSXjIGsJA7sutmHBbcQwIhAOXGJmCJJVpTcrQSXK79YqbtIwXsNcvPQ4xayN0CEcfmKv8DCAwQABoMNjM3NDIzMTgzODA1IgwOryNoxIuobvRBMsYq3APKvqLP05eeclzTn%2Fk2PqUdw9KYOgTO4Hf6%2B9txizLaG4yyoJeDO%2BpyqH5s5q8EGLJ80mY1K88Ty%2FAueimvNWgkwPUpGkSqJbgQ1IzUHin9pr%2BrGaSWn2CFBsdmcXwUJ0elF2%2FcSVVgqhmcS3tn5TcPCYCJMTX08Yf46tZz3rs3Rz1k3S%2FqzUp1gz8DuKx9MMjh9gSW0VXfdjnmmSRxv3oy1RWhtHb0bxXyPhXAG5Hs0DWmtXvIcWXQsMTAuAysTJGL9Sk9RtqSFjhPKJaAJYt1GaZjqbv55Prkh21QAQSNe01ftCUJjE0KrHfhMpJnvNbtk16D4IheQq5zEt91WzJczvNr1XQT6D3f41v6hmW8z39t47gCbxgBqZ%2FLoS71QPvmfoaUO5ccMnCV5NqhSygDj2VyttqJMT2Wc6b%2BFA1Y9hVkIcF2bSr8dVRVnx0zK7zzKFNAtC%2FmoFjLmn%2BDFOrKUadRcN7Rl654Gt46YH%2F5gTjG09JQrxAXCVFJMyJLvCLnAzyMw0DmStp9M%2FwxBYpqegGlsDxc3Rm5juZM%2BnCbgCmWvjwGSZ1vXq2JlbGZ%2FGlx561RQp6wEiZ5P3oK3V1O6C%2BsbolhOgu%2BJ6L%2Fnu9p1kgzmN8rQURC2amTNTD3s9zOBjqkAT%2FHgZgIyvaghFIvKTx2i5mR3JKECDtiwuzV84aHEts1pW%2BcoluyJdfvyFpFIzmBBvKeQUlphK9t%2BO19PeBXCBG1b9dB%2FJnuX%2FQiICH6lvU%2BMLWC3tTnPS8YlRzGdemYvq0CZ6eDQRCE8WzAZxK2MfzfK9NMB2YbAcTP43jWjO4Q9r8RYqlt8abbv4o5FsQytbfzYoowWMrFGonDbip3gckhlesF&X-Amz-Signature=01f751c231aae71db636c149392390e896fd235fb07e4df362cb403ba5bd3350&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663HZUSIMP%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032932Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIBo2TPQxZNbjHI4BeOzkufZQyvJ7s7StlQ0gJzju3dn9AiEA4cMTA5ddgcb3FCJmDNzxurW59cV3e%2B7KDRf4RuUBtasq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDMtNVLIbwj01T0LEmircA368qL8%2BzEiVYLh%2FaBs1Ai%2FiNTsPEt3K3mYAEbzuyXxutS3hsF728%2BRVIkBGrBXJv9Ql2ytFLFA70LvW%2BGyxYtepVulvXzkPzNLYhdQugDa%2F01keE0cYylnPH7QVgdjg8rmGUebDVgRkeDyLeC%2BivrrX1bGG2Ox1%2BJn7%2BZ99PaPt8hrkUDp794OC%2FUhZOnBAfccjfHdb%2B9qT7jv2hvTSRvB8DfZWjjon99epMRQ3wcABpnP8QRhvxJnSbjUgSux98akam104sYdYGCANQLTJe1gRBQTY8yVtLiIvBgNiNTOkJKOE3HWIHaFsoXLXas3tSvSW2vzpakCo65ZuYOtTuxmrz0aaGp3e33k6dH5HpIQqeA%2BDZDAqMF4Xd3LLLOr7s3GcTjDC2pxYIE58NnMVkD%2B%2BMlUExW12M2n095Vi%2BvBSIrlovdIcqqYJF9JUDwAqG2ZdtZJB86qqSlB7uCG9RVKWJo4LGnc6g3m6vOvgJ%2FT03RcSkgA8udensIUv%2FUoekuws0VXG9My1E83N7OXGwliUILC%2FVT0tbsuXmkrCXcdeutBg5DMpG0HHz%2F3KrQLPqIPDqX7Vt0LMqJpXZknPEiCo26vjLpIENTNEXO6%2BkIE3hE3aahPpx8%2BtFr1yMMCz3M4GOqUBtnU%2BZmtZDXYtN2zKdXntrt9WWrjCxYaGv%2BSp%2Fz35psCfq%2F7tWtKq76o218bVLn83DFLvb%2Bgplt8LjZcDNVt%2BiwJ1VSrtolcKXh%2B5BmNlaIptZ0lLqtDAtbiDDiF%2BQiUYeqim%2Bdo7Q0S6ek833B2alDTX9TB5OjBT%2B1y1DCdUubEPPO642hf1Rh%2FypaK2brm6A1JDS%2F%2FsQjSI4EFpT2sboaG%2BHvNS&X-Amz-Signature=de05bb7e0fee5526793107e49d1a29123ec2b84b2ce37f12eaf211700fe70b08&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
