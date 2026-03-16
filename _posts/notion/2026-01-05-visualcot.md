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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666S2ODU5I%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033657Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJIMEYCIQDONI%2BlZIhz1athBAhxUQik1xH9%2Fm6RXcTihREPp%2F8DWAIhAMWlhjDv5wW4ApEO54scIgHqSP6x444kAjHj0nLx3E%2BNKogECMv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyeFCg3S1L88NWsvWwq3AOaOE4174U4kELyOkNmy7vKHInPzR9Z7ApdusECOuFtca32f9plkNP4%2BAypP%2FnILswJxMpQ4MutKig%2B7%2BYZZxYIE%2BAZJbt36DDUdfZEvCHvFSGTSMHK4klkWR9cWCyzK2Ts6uIY1aFVKndDNY3Y0m7%2FG%2BY20YVU2rsNu0KEkQeun%2BljML%2Bgcm7pPNptuCbRUADX%2B%2BOgLkc4hULj4Ra5CqgqBfWhjgXfZQ56D%2BG6y%2FpYfzhqSVqMVP9OTtR0wngA8KhYSyCYzI2ddm%2BZaeoWP10WfhhtQFJeUT6vy5b2ie5r9yUamlEvPv9dvtBE82VJsWpHnMYTmyvFuqDZngaU6thdLs97nh8RIe9fcgiMN0xlcL54EGdIgj5Pf8MU%2F9Mn2hS74E51cVDMQ6SVmxH37WBCn3m%2BN80nZItc%2FUqt%2BAXN4DwYKLj9DXCS8Qw5dRv0KSNDcSQvHLO0XcJU0WdKj49YJwzLO%2BI4GlMkBNBeJhlNRLHBKpDpp7cCbqWVNvdoQblaoTPzJ%2BdszIy85vaNPm1vVpq0B%2F1S7P75jAxwqh85q%2FY%2B0OrGEU%2FanfU9GVITA6KjdwM0ikIFdQbAvoQ3RSh9HJdKStpBSbeDSc3aFF7i5%2Fs%2FU49ItmZkbKrt8jC0v93NBjqkAeEkR0NUUZVG6SnQWW%2F9%2F10JpDe6fpu%2BQBweKXghUFyrKYzYv1CX5vPXk43lrNLBKtio4%2B5n61bKKLL1vOld%2FIcR1T4iRrgX8foEu7qw8xX8Sb7VrtiWk6X1UuDxEXsorXJ8PSlsEZYWnwoEaDWZgzqr7QYeFnZ3BxGcLGMhQhEzAyqXXhMrArtw3L1KuT2JfFKeiVf6TYnjUSUyPEWXJ7UlXvG2&X-Amz-Signature=e922e80caf3a0a3209d07a1b150f3e00a16f0d09158f3bc2d1608bbd92a71849&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TDZBE6DP%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033657Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJGMEQCID0rR9rqep%2BAuXk7lhLyaWAEfXfwrd7TW9Ay3GVvUO0fAiAPSuuUWHus7rfrEiJUUH7F45osOgY4%2FKr4MFN4R8w3HSqIBAjL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMGvgsFtkkfb6gqmkbKtwDac6KqV15JdnPxnqQ0wnMnLDMmqyqkzMZr6hax8Duo%2BH9rNK1QMvxxGo%2BSkNL5K6L0J3Dvh5iPzT7Dh0VL3GhE26KF2PPDypC1jxwE3A1IWvFwLjM%2F80jGC18t40pq8TZGYs10%2BCf17lcoBiKyYJuTCv1tuUHKiAMzvPQv9n8syydodaqaSQnhvNHH%2FXBj9qPngqs7VoijjUGHy54udqtw26WjwlRAFncxebNJdaNSlecCYPBq3InOEqWQEROLpJq9Sm6%2BVqrUfYK96EQzSSvHXsl%2B1I4udWT3%2BzTlROgB4ZlyxFh2xhTinFZiRyTG2DWTN416x44fQ8CrFk39lBpdVVKfIMa2Nmx6aC9otDHT0vCRiiYzI4S9l51di4ibBL%2BmbGvGY9Q4h2TGDMJos4Vc%2FzC6puyWSIaCud9BCDEUDNNkPq4tfLyykNGWqljSnLbQKGAX2Ui%2F%2FtcH5%2Bg7Sw7G%2FaaeGFjzAUstRgzHHMxKDRi553Y814Jjzr%2F0uQ5VFgSn87vPTPUzbTCqtzKMm8XUxjlt%2Fze%2B9vUZTavsZkeesJIUkzBfF4tA7%2BolFLFEaYj1ompxqNH8e3CrRFY35cXL5Ef3xgx0lUhY2fBVAJzd4c1%2FogOOnFK3mEwgDUwqr%2FdzQY6pgEe8fiQ8c%2FROSkyz8WObk3GT8fflbvfB0irw3F9bBKa%2BGlbzHG2rgQcZtSkimSN2FtiPTCeiBAH%2FOvn614RwgoExRSH23M79blcsiSwGKLi3FZ27WpnV6RNgqlZxHtkpCF7oOTTq%2B8Q9g0wQTtDzxny4cX2yYFesI00b8yyKGY3eKGK4F9HXSNpmTnUIgmAlUs01I0wd9nJnk3BBgAbzTHKx%2FeIcaCf&X-Amz-Signature=aacd78d82897056267ee9db24a2a7c7b50625c7ff393a6dbadcda679a0dc004f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667BGBICVG%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033639Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCIGeKthy6mlqZFaE6sCZ53n0bN2wKjU6Uyg3imnMrLAFlAiEAhksOhFZ7u7eRSxYzowIjpiMVaE%2FvUlFLeNcvxqaZTt8qiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNK%2FpNfUwju4eJ14cyrcA7b2teKQdzXzzVGdEROAfSE6uOuU9KPo7fjecBoqHJG2VntPLLpqauOZAj5JbqmyW5vOveFvPcI1pm9C1ZTgEQVt6Yiebhkwn3z7MN3G%2FnL1zK1up9rKkxxVFQixi0O27xN3Lgt4sely4e6DiDx0r8OPeNwjsQrOtE1EdloFux5Sihl%2BvdAIyXX0MZL6PAzf7dlatxPxR%2Fm4qP3ev%2F13jkuF%2BsAGMmvljRciX5xBHdxrNI0tb1D4Qrmb0%2FKIv9Q70aa0QONdW%2BPGQ0xrdPQU%2BdlfOl8W6o0KNJ%2BpOJi1zQcBZGfqbyv5LzHDnIjobgWu3LD37K5X3qBiyjZx1UBx29JApm0BywpQzRwUUXGGSgHmP9GncU55v%2FNdMxmyPo171yuvp3yAMiUNU8PY71O%2BLC6hofrzfh7zMhm3o5zkKM1uw9tSKH0hFnuwwwwtheuYGgx32eMvopGFlftsdzGGJVDHWLILS7Eb4%2F63VKM%2B7Qzz6KjND9uoNnGr0otHctJB1bXVnkAQO6l2CbtbpRomrDUIUPaNA3YqbgNT9MPQtx9quh2i2RK43L5gUp4GHQ7ZL%2B70GWrphapB0wX%2FglBAhZ3LfSMzCx9SVF7xjx8pjSudhyjSNGZZ8SmFbZA7MMy%2B3c0GOqUBHzfTr0W4oV85aEvF5sBaVCvYEMhPAOoPYFh2z23HnzFrpZISNsdcV2F7hIKTTrSHB3bojfCUADrVmDNUWJCIFS%2FBvoGNPJchkvSjSx5qCkinl%2B%2B3%2BtwO%2Fmw9kAfZf8w9aE8VVjkK7FuhLUYXKIEUF9zzlDbqOcw7SCKscsPqldEGo1ZEfg4VrId7Lam%2Fn5AUm3n4QeVHKgXbUVTVBBQjiB%2FmrwB1&X-Amz-Signature=ad6d0bb75b938ddda5b884b757d1e05f2c91707dc3f71ce99cd18b200adacbc7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667BGBICVG%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033639Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCIGeKthy6mlqZFaE6sCZ53n0bN2wKjU6Uyg3imnMrLAFlAiEAhksOhFZ7u7eRSxYzowIjpiMVaE%2FvUlFLeNcvxqaZTt8qiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNK%2FpNfUwju4eJ14cyrcA7b2teKQdzXzzVGdEROAfSE6uOuU9KPo7fjecBoqHJG2VntPLLpqauOZAj5JbqmyW5vOveFvPcI1pm9C1ZTgEQVt6Yiebhkwn3z7MN3G%2FnL1zK1up9rKkxxVFQixi0O27xN3Lgt4sely4e6DiDx0r8OPeNwjsQrOtE1EdloFux5Sihl%2BvdAIyXX0MZL6PAzf7dlatxPxR%2Fm4qP3ev%2F13jkuF%2BsAGMmvljRciX5xBHdxrNI0tb1D4Qrmb0%2FKIv9Q70aa0QONdW%2BPGQ0xrdPQU%2BdlfOl8W6o0KNJ%2BpOJi1zQcBZGfqbyv5LzHDnIjobgWu3LD37K5X3qBiyjZx1UBx29JApm0BywpQzRwUUXGGSgHmP9GncU55v%2FNdMxmyPo171yuvp3yAMiUNU8PY71O%2BLC6hofrzfh7zMhm3o5zkKM1uw9tSKH0hFnuwwwwtheuYGgx32eMvopGFlftsdzGGJVDHWLILS7Eb4%2F63VKM%2B7Qzz6KjND9uoNnGr0otHctJB1bXVnkAQO6l2CbtbpRomrDUIUPaNA3YqbgNT9MPQtx9quh2i2RK43L5gUp4GHQ7ZL%2B70GWrphapB0wX%2FglBAhZ3LfSMzCx9SVF7xjx8pjSudhyjSNGZZ8SmFbZA7MMy%2B3c0GOqUBHzfTr0W4oV85aEvF5sBaVCvYEMhPAOoPYFh2z23HnzFrpZISNsdcV2F7hIKTTrSHB3bojfCUADrVmDNUWJCIFS%2FBvoGNPJchkvSjSx5qCkinl%2B%2B3%2BtwO%2Fmw9kAfZf8w9aE8VVjkK7FuhLUYXKIEUF9zzlDbqOcw7SCKscsPqldEGo1ZEfg4VrId7Lam%2Fn5AUm3n4QeVHKgXbUVTVBBQjiB%2FmrwB1&X-Amz-Signature=4da979d9368ee5c103e06af68e8a895ee65cc3c1aebebfe494bf40af970ece0c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X5XORPYH%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033703Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCIQD7cI5cltv80u7z7WenbUGTipEa2OnecXYyE%2FZ7TY%2FTkAIgTNaat1AU094fyc4JPin4GoawaZ%2BeNzQMkIW9wwldAZEqiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDD496ChEsldb%2FKzulSrcAxUjEFDDBxhhfeJ4CVv2ha0oW7mC%2FVSbG3xkjRWXjCjM4Rw3s%2BpmnE2%2BLB0UKzIIC8R9t9BnVq3X9SzREEXTH5HHWq3RuwKDIBl%2Bqe0uNytOqW7LYWnRkKG6JSj1GOm7gizmnsIMkMOjLL582m0labsy5VY4kDpVUBJjiGFoThzn%2BxOp5qsFj%2FKveiesGBiA7Mdy1SnycLk%2FFU0CZt0DyRDuZFoqyVtVR7hPOA4ujE7HTk36srNfDoSQfwETWdWkzC8yH0jNOgpsyMAAy4lStm9NU64i%2Fns3o7AAZ1zBt0xeHeI5yBicD4%2B81WwRRMzyvnk%2BD6WrUvoEusqa2o8fX6sqB3SV%2BLzXLQUf5LVrGf%2BAw6QEzNVS3ZpKQ1dplFDVrQzDmUDDamBNtc0AFSzCLUSOTTCJSuVFZXPekAG1SEfmVp3glf3B0N%2F8uEZg1P48ODLQePPTupiXT6hGeHr0UIQPgYry8LLEW%2FoxMWPEN5Sn8tklF45PzZBYuebVjZOL2j4DOQMXiX06KVl%2FR3IoBPnftXPKjfO8UDproMeD36ROh8rpkPiloODnPLHTND6qE5DV2z3chspWE4LNwbwpqLsEKgC5flOseljA2w67eeVOowjGvZCYmNqvNk0QMN%2B93c0GOqUBycThDSrYMztzXeIS3Ux%2BJAnjDOqkmmvWR%2Bbqzb5d9CdafBEVLRRkCWnUvj%2FhbCYrg9q5h9Pe8tvEPaHVOdtrwsrJVOA7EVqFsamWzJfZdSH2fUlWpkDB7JWATdw62KcCS0kZF4E3gvnMls%2FGhEWLiKWvHlTBdPNI%2FaTdiJ%2BU%2Bxq24dFrLvdC4pUsXQLFkGsG1UiHJ73ybn0txqmHptWji1LU7Uf8&X-Amz-Signature=30f15cb82c160c09ec81e9e0cc1f1bcb4b23f3536618162466a906f2e9f8b6b5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466USVKSK47%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJIMEYCIQCwPa9jszc5LN%2FtLyENZlv6DVPaUzaTWob8WSPNR%2BN9GAIhALAzVj0C0tmMuC0BoT6KKN9u5ydKJlE6I3897BpEADKPKogECMv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzRbvd832mAEkTXc18q3AM3qbaWBX49zX3IRuwe8IDamckNmOeG7GrWwwWafPzkQ68vws5%2Bx6l%2Fq%2FEnycHuS3dc9KVKqjTnVB131pA5OEmJfCIvaSagFvqQwttEfcR2C9Z9rDMGipW219neuvdeY7Jf2fM8fhspxLy6UPPwER7RjyVb4j3T8DPuhjYUJ%2B3jr3pLaEx4Fhc88N%2BYdTZhGB36AWX%2FAgIaOpVTLc2YGr1ObCceMngxksN9%2F5kfwATgeHwCE%2Bn8VhrqYj07NO%2BI7%2BtuxijbdGQyk7ZZ1DFyfhChp6%2BqWIqgV5IATIc3lTjJ0DHWi50zHQaXM0sagPBWBrbvvRmznynRhMoQxTkG%2FX%2FvWgubQzxtnCi6SX7zi5X%2FR%2BY90ojsFPEy9iJTZJ0Wtmxg2orK1qxKo48gQ7n4F4As5qxrkZAN8AyfZU0nrPeT79fsGsOmmM3J3Z%2B9OdzKQkE7fxT4ABs7LKi5hHGMOfuKBzaBTOv83YsuUXG2RN4CDpCP%2BoD27Jkl7JSjdxmyQoW3fIQNE3mceR4lXH2khSCBtAoOndC%2BNFgFRO8%2B7yZll8rbdKeM4vi3mGeAWwe%2B8x6AvdFYxVGnVDYjnjaFKloPrsFxp5td0wpQPgFmBGwF00edtAiJpf%2BfyIxE1zC0vd3NBjqkASOv5xDLBeOPAznEPUGjaB1nqtr5TqJblwFA2LHebA0ssrCV2XJ9Q5WR%2F3vOjmsyuSwUPNl3w8zddNf3EUPeJ0IKhF3yFfScG2rsw2EGjnmap74TG%2BcouHXA6v8anlmAqYqWMPgbpilDz%2BCIboiItNOnKAt9fLxPr4JibmSbYmGAcPXv1p9aIwDWtjYNlKuB8Z6Nbz2%2Bkcn855UZx9LZH7SfybfI&X-Amz-Signature=4f41e8d1e3960040bc697660f175c8e0898a70b47f347c8563d28d30ab9c5999&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662Q3RSQBW%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCIQCW6dp9B6Q4WoGxxcP8vU8lLIOL4EZ4rLIT%2F3LpKfuJkAIgFx6wdtdbett%2BjMnJkv1%2FnnqK%2BlwQnFvAf%2BFGGvKNDREqiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPn5kVZyjPjusopnFSrcA%2Fa6E3jZmaR5Y%2Bhtg8xTVEowFaI1xrqfrdDSJut0THonKIaJ6%2ByBOSG1ZhW%2BeNuwdxzB3%2FZHUl7T63WkBmwtpZCdv6dByMxwMO3AJuOb4T5PlQLdnvY1Hb3rJNqRF371Ihpmq6jDciqMYGL3dXdmGupyAplh3coyzy3EGqc6qd99zPB0UGNbBrR7drhyxvTDtf1uT6innFrmVaxJNu1EDlwhKvpmyuzps3DnRyPrdAoLI7W1IxOHW8TWLwYYCUntpEAf6RgJEyZAJF1LYcV9gsFpI8PinIN5wEv7dOXyLaPmmAuK51rJCe%2BqDH1uxcNXONngxI1SxyDfwXdJVbtUi1QSAh6sUQoyvbQcPwifH2VMj%2FKO1zXJHA5E%2BQwcpSox1XbVrxxW6r5Rr%2B7iB%2F%2FmTZ1WAekvPIbk03e38tN%2Fvtl9Q8x8Bh9NXxOxGblXsUOgt5gp7pnmOj8LFy9e0CmhErXpv%2B1eWogk9n6%2BS%2FbQfqZ4MhDkx%2BJsQGUrLp8smuJyzzCSKun6wlqE29U%2FtQDBA%2FiC%2Ban7q9xFLN7c4TLjSBS5gF1BORDkehvTItyP9NBx%2FU7W77mx29l8Hy5OpOeqOpK9quMZaWI824uQz20QDFQA64ZJ%2Fhc7OpQDXdrSMMa%2F3c0GOqUBujZAWmoMQmSfXOXqtPDOd6By4s6fVAwY21Y9qEx%2BqemZwii2IhwsO7DZ0aeIkINjI0yul0dF8cqDndmnxfVZuYw6Aue6Un%2BdVYVKZBix81%2F6iJr6Wtd0yuPZMoAbQluxBU4hq1gtdeit0qbVosUirqxCcvUkPr%2FRPVbN7ySjX8QDI1EVwYfS3q1qgEjI2t%2BnQOmjLqX9mKDxjQISrvmuAnF6rCu8&X-Amz-Signature=6f092ba0a39f7abd55a66d7d6d45cd87fb7a2d2191146b614f032744df4ae05e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46663MOJZSB%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJGMEQCIQDydEpOiYB4PYngSalOn7Qr7ESbMjraD3tvTpD%2BH74yeQIfNWUAETmeXel56P4L4s9uSxCHT7dGIVAzgVPCyjkuWCqIBAjL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMRotQPAknM2d6MUBIKtwDHeMK0TCe4Ai%2BfA215wLIxGasqtNrwgcDYGnsFsbPMLF5SoMgB2GTJ8ZdgEgoFLRSw5Os3kA7%2BsplwLPepfYqWSTNMDyDM1c%2FTBot2N6Rgc5WVbAqOLArkCOrYSanglZOrJG5HS%2B7d1MQxEm6%2FeQaMfaW8co%2FEzma2QvrWNKEu0dVwZi9HV4mxlUqQ5CDYq%2B4UNpARPzOnxAPAvL06E3zBrWq1h9WiPyTkluw0ayUwbBoTtRMP%2Fax4wq%2Fb%2BxV4C2rPsnw9ZvZgWgXuI7QVKSWO9E198PXjCBER29gqqPnm9BGDtSjf3kLIvV87ODF1%2FiP%2BFSn7tn4qapbWOMQyEMwYxlI%2F%2FoFdhOCnD%2F43NIHgnLzvc8Lki29NRo85nrp7PB3JHiyZSHP9TTO5v1YbrJOoceaUzytEFzE8dRxX2DAUfDb3mssvqWUoAzjKHTQh86diBFlwtjUnMHw4pmGBwI6pDx5xzXEvz9u2W8VYRNbZa6jfrjMhe95Eq%2Fdge4z%2FXYjK1Eloi7CsmagQP3nbltLiMU%2FwACqjHw5rJRDLEkSc%2Bavy2Z9zafXIjaSUfVDGS445eA4xySrVVpiLFMdAk8%2BppyOM%2F1UAT6lGfG1%2FXhsO1CItAY4l51soZ68n6Yw%2B7%2FdzQY6pgHBRDxLdJdjh5zg1m2bGIhAMdB0mNQrYRiRacI3y4xpf0Y%2B1dRUWsh7F%2BCs7u1AIQK5kCubF3C5uoVM%2FOi6eX9VqqXfh3kgwNAfx3r3vKuDZF4OcJfCLnUWbyw4MgkaE0027wLgGvo1axTG8qM%2B%2BNR0raANZAYGQz5NJfEGCnnvSPBeZGyzqClfcmL7UZUuF4sSmSJb4ATaCQQozh0JkY2EhnYJ%2B5%2FA&X-Amz-Signature=99f405366df841aedea813ef20d3a4271f600a9b4406f70c0359b1b9aba13407&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R24QMWHG%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033709Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCIQCDoMs0DIpkORDM1kGms93QUTAlmHWnuAbJH9VIdwiK5QIgOv%2Fe%2Fr2v61bJD4%2BrBc7vY1tZUHJ5uBcmnkCsh7vMH0UqiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGcCPOR380x5ufpLZSrcAwBIYpUTy6x9GFfSxX6DBwofbEuiAUf3D%2BDy15bX%2BdWgZdfv19zxWV6JlbpS29qmTnz2A8Xmisst7emDg6EGWF45tOsBWRLzqk1CKXgCVq3j4f74kkiC2NxEkJOga3SdFpGFmtz8U6Kdzf6MugdQVB%2BIkEKBDztfreJEErPs2FOlCeNxzF622LegHNwDSSe69NA%2FnU1MbBTZs8wn4e0hObpREu9s9BLbJU%2BRDvLEOoKtjLIlWCISMyaw049hAegEfZMKLPyjg%2BSnbRuReneh4kf%2F4RTCjKf5jWOIIWUiOtwb7cbrewFpV0eInqmLh9nDOoDMPs6j8jjItFCULKYtNYedxQLMIaV3HZlSmT6woec4qBcHVHv5A245fe92mq352vbB%2FZVJbrbGDX6E%2F%2FxWm%2Bmud2Qfw6AYm38rmoYSSF0TflXVEaiaj8vozcQJMuP%2FnjuRLNBlRzdF0vifIEo5BR4f3zXfypdZ3JuMjo33PvPmFoigTMDXmr%2F2LJ%2BLg%2FFiEOzx4KCnYwjCGjK2qSjhhdu6LpqmXu1DR3gIp1mxEnhep5s4mirgYYuVTQzCZyRERxe2s6RLPqSDxzD4aHuA10Hr%2Fwl1N7AURvvaiu2gyonLHNGvb3OqCp7uOfu7MIS%2F3c0GOqUBlxTuZhjCTTLJ9F78eyyrCL9LSsfcGTblnFEO9JEIlfAzCxpBigJOTh4%2FGiHJpoOEZSUPdiLp0xI%2FVSAodS4fgnmOwVeOL%2BWZZOP0pWNplcpudsK0d0UhpIDKOxxxauFqxDJI0Gz4Qf1jl9KLPeBA1aUdxIQJ6e0fUOHr9orZItYIBVzNS9NQfTTKC31hQciD7zvPo76vUxsntrVJnJ7ZqG3Py5Ff&X-Amz-Signature=081a0a24906c1abbe9903c7a1acfcbb466c4146fbcd2e8257444263af31b92d0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667BGBICVG%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCIGeKthy6mlqZFaE6sCZ53n0bN2wKjU6Uyg3imnMrLAFlAiEAhksOhFZ7u7eRSxYzowIjpiMVaE%2FvUlFLeNcvxqaZTt8qiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNK%2FpNfUwju4eJ14cyrcA7b2teKQdzXzzVGdEROAfSE6uOuU9KPo7fjecBoqHJG2VntPLLpqauOZAj5JbqmyW5vOveFvPcI1pm9C1ZTgEQVt6Yiebhkwn3z7MN3G%2FnL1zK1up9rKkxxVFQixi0O27xN3Lgt4sely4e6DiDx0r8OPeNwjsQrOtE1EdloFux5Sihl%2BvdAIyXX0MZL6PAzf7dlatxPxR%2Fm4qP3ev%2F13jkuF%2BsAGMmvljRciX5xBHdxrNI0tb1D4Qrmb0%2FKIv9Q70aa0QONdW%2BPGQ0xrdPQU%2BdlfOl8W6o0KNJ%2BpOJi1zQcBZGfqbyv5LzHDnIjobgWu3LD37K5X3qBiyjZx1UBx29JApm0BywpQzRwUUXGGSgHmP9GncU55v%2FNdMxmyPo171yuvp3yAMiUNU8PY71O%2BLC6hofrzfh7zMhm3o5zkKM1uw9tSKH0hFnuwwwwtheuYGgx32eMvopGFlftsdzGGJVDHWLILS7Eb4%2F63VKM%2B7Qzz6KjND9uoNnGr0otHctJB1bXVnkAQO6l2CbtbpRomrDUIUPaNA3YqbgNT9MPQtx9quh2i2RK43L5gUp4GHQ7ZL%2B70GWrphapB0wX%2FglBAhZ3LfSMzCx9SVF7xjx8pjSudhyjSNGZZ8SmFbZA7MMy%2B3c0GOqUBHzfTr0W4oV85aEvF5sBaVCvYEMhPAOoPYFh2z23HnzFrpZISNsdcV2F7hIKTTrSHB3bojfCUADrVmDNUWJCIFS%2FBvoGNPJchkvSjSx5qCkinl%2B%2B3%2BtwO%2Fmw9kAfZf8w9aE8VVjkK7FuhLUYXKIEUF9zzlDbqOcw7SCKscsPqldEGo1ZEfg4VrId7Lam%2Fn5AUm3n4QeVHKgXbUVTVBBQjiB%2FmrwB1&X-Amz-Signature=56630fa5805e0b20e5a788a10d2c33d7fea5c36d17bd19eb491124387c688d0e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
