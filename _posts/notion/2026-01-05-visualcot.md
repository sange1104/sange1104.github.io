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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VG6BIZI7%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041630Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD3SfkUBWT1yJF7CeSf6eu1ieSNFafkqQKx1AlHLV8ikAIhANnxr1SNOpVBX2Ue27lWOo%2FTFaXBrRfwqTM9%2FQm1MTuoKogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzxGEwJku6qLg3P0Jcq3APZXZBmt4rn5g2K2DpQuWSUTd5iaKDq%2B%2B9b5JrA5VDPaqQL%2BFfdDyND6HoeD0eNjqrX71ERDElsoUeTqtKkE0cRimoHujc32SBbYdI%2BPyRjJxftqqIPl9dgYY4LkRn1VWSLKCNLJT9S%2Fh6Fi0z%2FshNFjFg29nUWEHiGGIrEsc7YkrEYaT8VpcJK2aMODjd2ouaQkm35hPpHn3osp35US%2FRQ8qFntis9Rk2t1nqoJyDyCbN2UX%2Fl5DccJau77jpYcmUUTobi4kT4QrTrqKg57giWSpKTAOW2zMZAMzJtpE8iuDxfDPb7cmyORzbmuUql3K50tBdETEyw%2BjUTbtreBnAIi76lAbIwVLQndOkIq%2FAACDOrVdh2WRsCReRvVm9NwTTfdNaRwLmm1R7fR5IDiEMc4gFRFRwppR5zXW8SvrbBzxSBO3LrH%2BpVjmJj%2FHZ5yrI4%2BfW6GAb%2B24YH2ymYrDHvof%2FATTYkYob%2B%2BkG9OGG7tT993QF4AaKVETAn0gaVhcXJWYZfH7d%2FVfPUshTcaTbrt%2FwTJ1Khwly%2FI5029aI0FWWvJrcr9BChJGVXVmmpSrjoBfuZIBCr0NeGrRmxGrWXEbknWa05pkp0HgimfJXHoTZVwwcC5qJeM%2BreMTDZ3%2F%2FPBjqkAZxyAeblIKmiyciUVJgXBG%2BqpSQQpFO6rDepIc0bp2ZkRSIVJvX16vVp20v%2BCl%2FZRxNeLdT4YeEd%2BMHPVCDpSXltK%2F5z0btXnVs3aPuegHBCsNHVbjib7PoZI20q2uEDIKk47XafySgtT2auoiiPt8a8%2BnKRSmk%2BE%2FMvCye1GrDUVhvCl9y7oDhTf4uIEVBKtEBsQ3plGoxO3zWyeD9yCuxRhi33&X-Amz-Signature=4e2b47d7a07bf371868aa7281241f28f6c863aee94ec1e044dc8a8b888551bda&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QHQPA2IF%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041630Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIFbKk%2Fgjj%2FkfofkD5%2FTwFnphe%2FksOARDzb%2FU3bRPEleXAiEAxrqWYtCvEbLw8a7TGZUwroY5ySopZcIpeExt0u4STjEqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFy7p4akFsjP3EsaSCrcA0WmzhqPb83hDr%2F3PzJJMJbtgtiat29o61sNyQQi6nmfraGOyJ%2Fc8B8NY1axz2qttiagDwLzb%2BDpGsndB6xc7NjQCPAmiRrL3ve76UYLrvX7dTOQjzgwdoPsphAmBKo3NUaumzAJ0z7lxempQ%2FBCsskXs8UOXx0fFWpsiYm%2Fd80%2BzyHRJYlY3hVXE3CLW0faZYLhyHoiaOfrVudNVqsqAPX71a9BkdUIxX3cHpvYZUupZuvgZkjIVm%2BTBwlFPQTKjnMxvri8Wb29iDI%2F7ny%2FcmdudccHUbK23wA4You6gHOOCD%2BHIugHiUEwWsOjOhNyh8%2BVAvCWWyGoY%2BC%2FtTmDx%2B%2Fj1bDDrxQ48LBqizymbIPkMBoQstOQgpPAF58il8%2B75IBqYJRIj0oyJwbao5iaBphpAIkqoFUhX%2BHB61LEIsdRf7O2WEL8HUogJiOzUSp%2BQTAwgXXkN60gQVKEyVRLh1A1Ari1Z3NKexPx%2FZ9G8IikVKpfXL8jMfIYXQ8FxTl%2BDaNhfXuwWkLgnOoWM%2Ba5LcFvs%2Bv2XmsxIHFfixFu17%2F0SuMEWN%2BBogKGz%2FcCb2XUiUYvTQLGaDxfZ58h6yytSvbo%2FjQGXAmXuCcJ9UGHY8J98pLYVbLSCNFoX9LjMIPf%2F88GOqUBv0%2F5be6153BtJsY8Sihwbu%2Bazvm5bDSixOU6zP%2FeRIKFCgAd8B6BC3LuyGAL1J1GgF0nlttJFWqon4uuaZFcYhdhW9bYaqDn8VmJnzaTfkezLycNRPrukmONQhKiWOv1CDzAdPS7dzluizzualM6lJI0H0Fk1LJIZo5nhBR60jgCs2517HzsWbeg5EDjLQigSRt0SEkzzNVOiT003LHEUCG687yl&X-Amz-Signature=06e88e40d12870bc3fa6f674d6f76dd7364782e7dfd91530b6f996727977c7f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QXMUK5Z4%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041627Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQDs4KptDtNoqevQwRLmHIeCDrZss65hO5GGE1%2F%2FOSPWjQIgbv7M3HMt5D0YI8M4c6SnXP0xyKkcYpQp%2BO95i0ca42YqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHQZ5JdPasBMZyiCKSrcA3b7jFHb1MXd3usCAkLtYWj9QEsj7yLGUk2QWcaKukrMX4FuaL5S2nvd3EnRnMt6AIhRNy4OZ5%2BneGkrr9eFVK9E%2B%2FwJdsIIrlr9K0nFnTSTMqnSrwhAU%2FfK7HmSnN7PIbwVrF%2BwaDyv9U3VpF6aG0ZQXItYJ99RIbTCcx5RFFqbMWtOfu5krEeKdIl8UBQOJRBxmArmdnNmzywg%2FknDqvxRPughH6vZVz93M0psbpFKEWScJwyvfV7PcyB0Q2Rj9odc9Kq87X687wdB223okH9UmM2lWeY8GYRlLFVCrJp%2FfvIQwscX4Q9DbsNP4slIbc7bVA1qK3PtAIXP3878OST%2BGG3VXGo0a0Tz0w1KNTcUrsp4XqeqX45v88%2Fb%2BeFOPMqcgNhzKatXC7bmgKBjMlaYG5BdhxJuMVqgmcGEBr3GyL0eX77zUUErg2fnBgKroRPMHsU%2B0dPtn1U5IUDqeXVQMn7VlGGuAOhZTdEdftUVrXLhpdI3YFJQst6bGG7QeXGSZ5HYEXnrCB42pDOusnMMuNG%2BUJ4cjk0YQspS0PsgEm4mVCr%2BKRr1M4LeyWp1JELvCZ5dsu8u20jQzZGw4lQRX5fmSSb5%2BTuEsRcptM002zcI%2F0798CXMu%2BFgMMXh%2F88GOqUB2wsUxlXuXwNEEMzxzOoc%2FrqJLF13Dhih3pX9hWwvpYR8yhI21KlET%2FqyCQlgjCu8D5k8lzV46raqqRucmHPQoBy85di1ppsspiB9cokOgTu4ZqWTDNDBYlwvrgrV3AeAL3dVo9iW9dcO0AFhR229vTIQEiU%2BLD6armPx2dsrqJkvyYlbk%2Fel%2BeM0TAEe7EKnKSfF3xz4VM%2B9IkajNrawxrqd616%2F&X-Amz-Signature=654bfafa471f7e38ac603ae8dc54cb4bb48d3829d15c18ae4fd97c29aac313f0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QXMUK5Z4%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041627Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQDs4KptDtNoqevQwRLmHIeCDrZss65hO5GGE1%2F%2FOSPWjQIgbv7M3HMt5D0YI8M4c6SnXP0xyKkcYpQp%2BO95i0ca42YqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHQZ5JdPasBMZyiCKSrcA3b7jFHb1MXd3usCAkLtYWj9QEsj7yLGUk2QWcaKukrMX4FuaL5S2nvd3EnRnMt6AIhRNy4OZ5%2BneGkrr9eFVK9E%2B%2FwJdsIIrlr9K0nFnTSTMqnSrwhAU%2FfK7HmSnN7PIbwVrF%2BwaDyv9U3VpF6aG0ZQXItYJ99RIbTCcx5RFFqbMWtOfu5krEeKdIl8UBQOJRBxmArmdnNmzywg%2FknDqvxRPughH6vZVz93M0psbpFKEWScJwyvfV7PcyB0Q2Rj9odc9Kq87X687wdB223okH9UmM2lWeY8GYRlLFVCrJp%2FfvIQwscX4Q9DbsNP4slIbc7bVA1qK3PtAIXP3878OST%2BGG3VXGo0a0Tz0w1KNTcUrsp4XqeqX45v88%2Fb%2BeFOPMqcgNhzKatXC7bmgKBjMlaYG5BdhxJuMVqgmcGEBr3GyL0eX77zUUErg2fnBgKroRPMHsU%2B0dPtn1U5IUDqeXVQMn7VlGGuAOhZTdEdftUVrXLhpdI3YFJQst6bGG7QeXGSZ5HYEXnrCB42pDOusnMMuNG%2BUJ4cjk0YQspS0PsgEm4mVCr%2BKRr1M4LeyWp1JELvCZ5dsu8u20jQzZGw4lQRX5fmSSb5%2BTuEsRcptM002zcI%2F0798CXMu%2BFgMMXh%2F88GOqUB2wsUxlXuXwNEEMzxzOoc%2FrqJLF13Dhih3pX9hWwvpYR8yhI21KlET%2FqyCQlgjCu8D5k8lzV46raqqRucmHPQoBy85di1ppsspiB9cokOgTu4ZqWTDNDBYlwvrgrV3AeAL3dVo9iW9dcO0AFhR229vTIQEiU%2BLD6armPx2dsrqJkvyYlbk%2Fel%2BeM0TAEe7EKnKSfF3xz4VM%2B9IkajNrawxrqd616%2F&X-Amz-Signature=1a49999b2544f27c71bf3c43c08ae1b5c4f8c642d38a789f534b061aade5737c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667BGYDFUU%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041635Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD%2Bb2vKNJwHOpG05%2BX3cUGlksNI56qQ3E%2Bw2HQwVeOf%2FwIhAMbPIUEFEv%2BZFGSrrHzt9xJGwVpc0IfYw67OVg%2FL2JsjKogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgycmErkOz%2B60E2u%2FjUq3APfbFEMnRGMVZoqRvxum%2BLMV9dTbNMkH7ThgbecQBIp6p9XQLycd8ZuF8GQFZzAHEIMR5vSNQDl3qi8degqa96v5AlBG4t7Q46CdyWL%2FjTEFIOGnHFL%2F5ZC%2BwrLYerp3gM9JMMf1QTkJbl%2BkeTu9iiuuetcja1MXNcAVht38fJ1S68KfCPyeoD8rp%2BPw5O9zP8oCInSw%2F5nqC7rQK6TiCMVvOveVwIQdnMSBf9nqrmQ1DM9P0juiXnMhL3uBG%2BjeSQ6JPlMZhdyRWcXxpL1J3dam%2Br0%2F3T3%2BXbqflfGY6ByETNQTWRKJy0bR8%2F%2BcZ%2BoPV%2FFKS3psNeyAnHaCepvIGGaXrcDAehPHNPKU%2BgcHT4W5WmK91lHFDB3zIjvAvxZS1r3DclYyv5NKZWicJQnJ6KzgzV%2F7RrHykCGEqu32Nu%2FgsVxOObSoUyTMw%2FpBCHQhyVplTlt4tRxojdbd3SyS0g00pA08KAqrQ58RNHIMJRrBtxzFKL2F9ADZFoyqay6Dh0kn4meyTyzvHF6gjxFkQlHtJRjbIsaTgofp05xvNvlfMXq4ZKYCKVMreex%2BvDAncV2qt0onqEzbNBKXE4U7PFnrLSS7X7faV52FcwByJKRn9Wt86odcePcLT3LqjD53v%2FPBjqkAWDNfl0yP%2B1oSdHZQEbHSiUpWuMYPsNHShiSMeek%2FmcDlVjeoSBmWmsXu5l3uqg829Bu5GGXKwUm4FGa%2Fa4JGUOMNZh%2BIybtFImcndm64OPjor%2Feg%2BrIkNsyhu7b9vQvKgyz0wcmEECtLfGuh8PJurDmxOs9wQypR6kAS0j%2FxGjoIjJTaUCOGE3NxwAul%2BWC4JaEf79EGStSMPWm1XqfCeTGVRgq&X-Amz-Signature=73ade92fa3de92a6359c5b71f89e64380b6769e8b734deaf5e217d210c59491e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46645IAUAYQ%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041638Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIF4fmORrU83yd6z6IJB3Ryz3bDadj8G7CbAQpxwBbwOqAiBH%2BEXckmxgK8YOYgAC1pusTXf%2BwZVCv1HyYhAdmBMOiSqIBAj0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJbys990wZ7tWkXZiKtwDSK5L9dozE19GFWViufi6XsBycAx3e9Ml763EERUk9mgrJqnHAc8iPc%2Ff9RWd1wZHUJusdaRAAncCZxszGZitf8sIPq7qoWN9unqafZOjWDqojg1y0dNfCE%2FYk0Oe8yDGL8sTCTBaTIl%2FfSbEZ1KZ9IroLHsFvYM4yA8CBSqQLjX4GBoLhAf5eM%2F1p35JmGNezBcEWRMfLEOnm8dJY%2BqAxGAWQO5QNJANeHRP3aJEDaufl5XPqYPcsR4tQL7l2PuSJnE0Hjs1BuL1EByyTCWLDbeOeUk4%2Fqn%2BjUwtpEMeeWuf8kkB%2FL9vxY0AHIkdKlYBZnKb2A%2Fza0%2BM7bIgcI21hfz2ynM0iz2o%2FFYHhDneqDZU9Y7Uu2t4lmPGuf7fzJuw9jjNAGrLfOlo3XWK%2F0dZuNKJncqaJCZr0tp%2BB4aSQKHPm7GrNpefn2G4P7PtTVG9Jv31nNeZs4IOGzyGz5bpO1hPr%2FcfSnIqt88vQ0uPxhcz0fRzNwQn1x0gsLkZFRFlIEHcJHky3sIFNsHgEAvMWngi1%2F7x98SOl8leSIbVF%2B73mCNP1WWrk3Wsa5Ui7iuVdaNnhtQSDY%2B0iwwwDpkJmmuLG%2F418YegYh%2F5ww%2BAbUJxvbzNnWyKPq3uEwYwlN%2F%2FzwY6pgEjAm5WcsLkbQfJoGomqBRMJoQgC0g09OEL0Zu74zynzELtnoU%2F7CCtFOerW6AHc5AJx%2BSNLrh2PC%2B9imFWM3zp1zsDigC5xjKBxSp6vueagC56X2mPz8Yl3awpqfVXF2XeZB%2Fi2%2FOtS8mEkpl5cJh3kX0F%2BQ2WCkLinPPGyN74fazw%2B82vRDvsKMAHDkC2IgKIF1ks1BBy5%2FyqgOyqYmoPV4xyVi1f&X-Amz-Signature=03d0a6a64aec6eb447910538ba8e5f89f55ec6eee0ab696bf3c9dc6e04ea905e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZOH3G6Z4%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041638Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIGvglTMGeHTX47sX6Uv7pcPUvB2HgQ5GOv8qEG3HOb%2FWAiBn6cM31sqJTWzC%2FIIJ1YSGe3dmIFfnsLNJ9Tb4yrPypCqIBAj0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMW27dZ%2BbmAzMtO1DmKtwDYM6MqhKoN788eNZyfU7B1iphzRBS%2BfqZ6FAMeuoxTPtzV7I%2FLNma73z%2FTlvSosvgJQ2ZjknYhwyLQhFQ3m9FYpW4zDuvyZoSCNu3P8puP%2BMetgOEixqdN8yzmpr3Rz16GTxRfFUeqqRSCqBTXBPyu1dy%2B5ZFZUrUYgZW4ix8TapLkXqCpIIJSezSkhPmPmvvEry9JYGshVZIWy01WaOUjUv6rT5WHbrS5nIla%2F6%2BbstKbE7%2FxVD7EBO%2FBcc37P16ksxqBbhvzKfsm1LnNX25g2zNB%2FmXbyu%2BICl6sPnan81L1IoXwPfm4hxRXFXsA5xVr12fHJAw2XYa2ha1%2FaG%2FLqRZewl5MFJLMoNyMmHAkHGJTWSnkkCcDeboDcFoL%2F%2F%2BxMQqqrtqYVjE0ge7YaHx%2FZLHMPC56ueoBzsTTOsR%2BC5gJHJf3rDHmLeJCsIm392ZTuTM4M2cg0IM3yyIqIydpKfq5m6AiYGCRG0heNbAKABOd9ysefCLd847VzRSIWNiF1OpLaeAsz4TDBlIE9ivhFg9735cpjM1LOhOVtS4iQif2wfoo4Z3sa9hcq0X1A4gqTQml3iR7SDuArQJJmk5%2BCzLyraPAEG%2Fx83OBp187Iia7Su7Dv8dFjBLdtcwjN%2F%2FzwY6pgFsvUa1kYKVb8%2Bxic70E6eFBo5akBweUQxj5Fo5m2SZjPITTGBycvUsYHn7JdU1QyOvo401yBtCwmV%2BV0eJa5iRTudi%2F3b2607NH1Hx5OmD1S47dBAQIf0o%2FF3yaHNB4nrE89n2%2BJhgfGdxVCaxjFxXYi%2FSfmryt40uDn0lJsYlU3N%2FPxEnwlnA%2BYImm7o0GTx2DBGHxIKNN5%2BMeG%2FFmzTy8EQQ%2FH5M&X-Amz-Signature=68f3f693ce7f75c435a525a769af2b691579eca96a25fe397a6812cc46d62028&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZWY6AXXB%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041638Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIHVwdpH8VM5xy4YWFixIXsJUKGlLm10g93CbvcdsgB%2FZAiB0aYmt8odzh6soW3Ygy%2FiQr4GvqkGh2XOFJE%2FLkichjSqIBAj0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMsrsJVUVx4JQBqhdDKtwDTiOcZAYFMTQOc%2B%2FhGhIOCQz9Id0Sk4TJNTRzMX25ZNmxPCBnXbLbI0CSqcRDtMZ2P3tMyNBl1APYK7xx1OmoplUzk0RIDvtscj5a0qIWGJ8PWheMxce5%2BXiA1AnDU5sy6CpATmEB9rrWRgPcCcR05pEkfIHNXgV4w8qGTvik8M4J3ppZsblOHiZJh9qT0vSEwCQkeIxX%2ByN3qjo8PvBM4sDE1Pl1ZcNel9p2NjhwYS83Pu8sIb22J6SMXhxp8lKNWfFEWo2SxeK0YlFMk2NjinO1OEyEytNrl74RzOkUn6fvAwu1J8pmsDMTmlwft7yD77BrsXgQmVF10t%2BpahnnFi2Kk84QkK2DEliug1kiX%2Fp1ztXbpZ0yEnfNdpalWFLNV4bKxqStMtP211h38d%2BSdq4IXYUTGH14L3jXmtrFub%2F3g4Zd6eEdeO7P1a0Ft862ru3GEaWMOmGCROyRLiQcq%2FjLkoVYC0zeDB17CxUepiUcJfMVUViezSfAnOxfIw4IiU6C6ErNVucXKmHqsmZpgV9VskyrL3ykmitRW0UWZQl9xMYgHj6mqmfQL1%2FJnjF9TMeUjm6X7IkvsYrwPJ8K0ucVx4TMz%2Fv0ehHiefKSEkRxGOxWqkLaADwdPYowg9%2F%2FzwY6pgECuoNnFv7Zy2M7xX4c6mUKIVF0XIEc6K5ZCDPLcvcSAZ8u1Crk%2BkrPTRwQHRBWlALO5yvhECHQ5yaJOnXiAaWfTlSyzGPE%2FJJ9y8xkZf0Kd%2Fc8lOYJx36pJ%2F3esMHfgF9DMy%2BPSrZlEbcRka109HiBkZgv84K0XHac5R%2FMR6R3Hz9zhZt40eHGXGmxADZFspMBi4iIZF%2B50GAHl6oPnKgi0k8J1zke&X-Amz-Signature=7c8ce9d77d29609178de0ed769d645a14bda406e1b491085c6c277c705247ca9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XW7AHONE%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041638Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQD%2BsSEK0en1UlCdZBe0WG9HY3I%2BwauTh8FsZDQUKIoLKgIgDnZiXYDGp%2BEyt%2BVAcCNVYm3J0Po1ASvGuvL54sgHREgqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBDm%2BQIFbUd6hbgnVSrcA%2FoT35enCLIQg0sZiQ2eS916Ah%2BcRfMPGa5fVMuJPBLxkLIjcE7pAh%2B2J0LcfGcV48n5t0MRIM%2FbUxdfi2FwDlZy%2BPJwWGRG517TQST7vEJOKH8TIbmqECLC%2B13rIKcnfrM56Y8v7wJM%2BZooDe4Vx%2FyPIfVCNmXH%2BdJnt07H1jTypgOEG50t1YA8uJIAzEQmcLXSMgCN8jIE7K6gAz4SkvPU2baesrQlYRz1ba2vcTNaFewTkry0qRFIS3W6GE6OMtG2eiFNZD3iLUF9scD%2FGVXybtIcFWIIv36xTQpL%2BKkKIVa%2BO5iKTMOLNiR5%2FgyBlSNIrMH5JuuZSKuNjqwrr3cUBZE49VMEsXIiJRH5eu9l1oGeazPy5RT%2FcSTQCTeUMIknCvjjRlikFSFWcuHrvp77drNjv%2FZNKyN5xh4fufIduNT74F1tmCstAwG74qGlRTbLrBGUQFRz865ICMEYHR%2FTMfvMlK3DX7uBktnoymqFHJlWlUHUfHmd02kjNV1FL8CpQ1k9x7NAgFgIQ4P%2B8onaO7yYu8MDg0w5QEBuuN5rEfRkwZWoPKUFCR7Yk%2Fz7vzKhG9kxvnifrLISTcDRJeamG8sUcLYH9jQMSagSmjNZVnnOeUyJtqGK89IPMMrg%2F88GOqUB1NfUztN0xAwD8aT5QgHt64oUPwyipNCvt7Gu4JLfIVBTwu5%2BcofiL1CJru6%2BRMDdxeSO00Mti%2BEbz%2FZef3iq%2FHF7et4V19rtXoSVcnO%2FPInKqTYYiqg0sq43On7ZMj6h1wPYUEuUfnCmowsyvrqnRon%2BCev62TCa5LP3S48QiE%2BJqpq5Cqy%2FolEzinVoWwiB%2BVhN17Sa8RNKB0SxylfQZA9WLkzA&X-Amz-Signature=d4126f67c4964bc4bc5b15e65b5a0fb51be1bfe118cb661ef9dd2661c6275121&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QXMUK5Z4%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041627Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQDs4KptDtNoqevQwRLmHIeCDrZss65hO5GGE1%2F%2FOSPWjQIgbv7M3HMt5D0YI8M4c6SnXP0xyKkcYpQp%2BO95i0ca42YqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHQZ5JdPasBMZyiCKSrcA3b7jFHb1MXd3usCAkLtYWj9QEsj7yLGUk2QWcaKukrMX4FuaL5S2nvd3EnRnMt6AIhRNy4OZ5%2BneGkrr9eFVK9E%2B%2FwJdsIIrlr9K0nFnTSTMqnSrwhAU%2FfK7HmSnN7PIbwVrF%2BwaDyv9U3VpF6aG0ZQXItYJ99RIbTCcx5RFFqbMWtOfu5krEeKdIl8UBQOJRBxmArmdnNmzywg%2FknDqvxRPughH6vZVz93M0psbpFKEWScJwyvfV7PcyB0Q2Rj9odc9Kq87X687wdB223okH9UmM2lWeY8GYRlLFVCrJp%2FfvIQwscX4Q9DbsNP4slIbc7bVA1qK3PtAIXP3878OST%2BGG3VXGo0a0Tz0w1KNTcUrsp4XqeqX45v88%2Fb%2BeFOPMqcgNhzKatXC7bmgKBjMlaYG5BdhxJuMVqgmcGEBr3GyL0eX77zUUErg2fnBgKroRPMHsU%2B0dPtn1U5IUDqeXVQMn7VlGGuAOhZTdEdftUVrXLhpdI3YFJQst6bGG7QeXGSZ5HYEXnrCB42pDOusnMMuNG%2BUJ4cjk0YQspS0PsgEm4mVCr%2BKRr1M4LeyWp1JELvCZ5dsu8u20jQzZGw4lQRX5fmSSb5%2BTuEsRcptM002zcI%2F0798CXMu%2BFgMMXh%2F88GOqUB2wsUxlXuXwNEEMzxzOoc%2FrqJLF13Dhih3pX9hWwvpYR8yhI21KlET%2FqyCQlgjCu8D5k8lzV46raqqRucmHPQoBy85di1ppsspiB9cokOgTu4ZqWTDNDBYlwvrgrV3AeAL3dVo9iW9dcO0AFhR229vTIQEiU%2BLD6armPx2dsrqJkvyYlbk%2Fel%2BeM0TAEe7EKnKSfF3xz4VM%2B9IkajNrawxrqd616%2F&X-Amz-Signature=ca44a8caca3ac2955b4cba5f72f3de100d100e208ccab2dae86d21b36eff15ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
