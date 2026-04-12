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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XOBHEX2D%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034748Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDe1HD0TyeFlZ4AI0xjfr4TJRQT2KSIye%2FEdDj03YMPfQIgVbdfUHD%2Bt4yAXIyHdNH%2BPEffgpgFfFPA57UEgBoss0wq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDMyEjfuHphhOLcLrkyrcAwh6i4YOT7bO8h6uUMoruAv%2FBDfML3sx7UOOOiHtzMkq%2Frktocv6M6r7dlD2axiSqvn83EgejOtokRboHYhiTPvbgiSLWKeD5ub%2FIj7zV0TvWRS7%2FZVE6hJMJLraUPDV9BEnkI2ayXuOye9WM2EghHDLqKwnuc2dG0YFbmJL2Iy9wRQgeDEwSuudQ%2BXPvzWfzOq15Y4cYjoSaeIA2XDh8SirB43lPdaB3S7TIhbgTbr1aFcAPieu%2B5Vi9o%2F%2F8QPcWu6ovkN9HCVe5yU%2BPdxXYYwMjc%2FQgbQGHY0cktKyL4uFp70RDX87SUd1ux7QccjrXyMP67JCUjttX81EQ1l1nYowm7MMuTL1W3zFbgq82sY%2Bm7mt1C3TNh4OmDPDb2BR1j17rs%2B55Qie72%2Bu6cuSG4FjH8s6o1uDWbq3SNdVowVStcFcIl7aCjnzcWPsoS5Gvyn0RkEeQ5mjVcmQo2lzkmXmI1RrS%2Brf9z6PZMQAn4ad0If3qbBPnAcrGNM%2BuGufcyfbGq%2BTIBFbG46VhEfIlrEa4gTNXfhAKkUQnzRhCHE9YoKQ0yO7rx%2FYGO%2FjBhdQ%2FDPe7hCPinPOn%2F0f5FnNKa9NcqXhxKv6OuCZFkCBxrjUV6npPlPf0w0WeL5GMM6J7M4GOqUBosdho8S%2FTupaAuNJ5Wt2g2OiXByRCTrCjK2KZxjLve%2FTADf77PS8GX%2BXpoGzmgZ%2BJ0RR%2BO8gENV6K2hg%2BcehfOQObioM8sTvWl%2F%2Ftz4IvSeieklc1xZpS6X7BYY6wN4QjEZ7ices0IR6BmCoXQUJN0sOalV936Ndq7%2BIEp2fOZz3kFGElkLeZ6tz7SmY0dtEDY4%2F0fgva9bUV8CV7%2FNNLACAYRnk&X-Amz-Signature=50f8358ef50bdc014cd0f0520f1e011f0b2e650f204cb85f0b7f8e19afe54580&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667K36HGZT%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034748Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICo4FyNjsc5xDOCA8wO%2Fev2C1OwY35YLidkYyrkFU5BkAiAtTyN4sHtPeEhXAig6MuhzaNpGKiUEiICBJUkVEFbhGir%2FAwhUEAAaDDYzNzQyMzE4MzgwNSIMLAuz%2F6sDMaiycWVoKtwDzL4MaGZSXeIpVYIorAOlMqeJGrIKKbHIZlRCrycnel9uVpCBuvuaTA9x4i6tnGqzoq7M%2F4WLrarbHyQgrmOEY4Asm0gXSI2LZmcw1gvj3e7thPHNMJvsDk9IFAYXJB26BL%2BimPRTZJ%2Bwmyo88oFIa0Gpx5%2BayNTJNNEgyTJ7olwbsI%2FSr64CYDjeCaYYPnQYhzvZMcDtCunTqttzVUtPgL7LC8dLAatRSZj8d1Axv6eO1A55wsRdFTqeCUstOJ6ydedsB3GuvPZPQIDu1%2B0ECn1cagGAcPE%2B2i4zmu8HWnnvFx5sn6N68lBIfsfPvgwbxAhVrfFBMmJRKWky6we96hiI%2BU9nptzzwFs1X8f5BGIJHv8cVsbdLjnyhWVWtA36L6a5t4826oExaJLrF6yR8S0yoPhfQyHEGDMl9LAq4Mlsh2eKZLLV4153OTPbD7zIGIiPWdJUEwdyzo2ykJ%2BJE85Cjv1IfIIP9N682mEUfVBMwMRXuRnFsM5OXz3H%2Fghkzlw61n8lqrORtSdC9javPouSeG4Pxm5u42OD%2F5wAxx4SUx%2F2g6%2BTgJnftQfp1wDIEd3UTnsxKfXvFWjyuPwNfIDue%2F%2Bx55mHi1S8ameigu6%2BcezEE948bmaEDBQw3ofszgY6pgEG1mi0cBTkMJ%2FxMGc1oBfmnJ4ClL5PxxKkhrA8oHKTTy477owcCY1EvzsfWenMuM9Gcdfhk9unRIy4kvA7%2Fwilmks8Kkx1BON7sNo4e1qjIgszVMBg4Z51wWSft20ltmPOl7kqhCLAUNIKXGSbMOzzvphu5dZMXfPuCLJfBVMODoE3oUhXXg%2B3pSbCbgtKQKpOKTGPDg61XzTKF6jTCLx9qW6ect9y&X-Amz-Signature=8e2f05eb3e0c9ecdbf9cdeec7ee06074670b88e6b9ff10e15a1ceecc40443b2d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UK5P67I4%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034740Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4iSGZ5VrAUMbqEMIhKdDB64jh7dBZH%2FQ6nCR3fWdefQIgCsYjYeEP2xSGn8%2Bml2ziE3l6d6LO1gGIT3F1pgwK1hoq%2FwMIVRAAGgw2Mzc0MjMxODM4MDUiDMn3ebh8cNoWJTL12SrcA%2FgWC2CFGSDKUKxHerq71rjZ80A9Sftvw9Qh%2BvU7Ho1Z63CXT%2FfaauxuoRqdvPg8zaA%2B6uN5tT18BeJefjWSFZE1EuVKkU5hLG4Vd9b6KM2%2FhQQbhmJK4SkCUAKfzB1xfn30McyXOlPN4eZDiTBrYnPVJCiOs4r992V9S5u3%2B4AEWtUAbFqLq%2BXG5Y%2FPSdysV4XDNPW4svRXuqiIXp79YeDdC0rkzzzi0Jgket1I6l8HxbwmM%2FfkyLYFb2he%2BN0bZzdDRkQr6wZaMMNjn8qm8UHilP5AMqB5GXxt7s8tutdJfgT%2FReDop5HcjQYaAz6sOLj9UjDMn78tr%2BQFYptSxoaTHzl%2FNqZ05F0T7qVVuq2L%2BZzw3a1qMyd7boZafcF25Z2OIIAXIlBOnAYpo7tOIoBFs13FL2jHy940qN18bGMNJBEs%2Bfrmx7bpIA0OKFZIiFXH8vkVncMlHE6TESVOe0t%2F%2BdwBzVVXj8USPBbkEwLLWvUPMWw36vi7Up%2FRoAkXNHLHe7hdLKZnBpnYfuDLf9KeJQokSrsi2V5dSqCEUQkhe48%2F0gqxoJJaLMF8NKo6Hp2pyIf0sd7g9xHS3XoPc2DHu1%2Beke%2Fkjn2SxdgJTqKbAgXV93g6CM5llxbDMPyn7M4GOqUBz6ulAgcOlueMkbd4CCeq4ztalsES4Jjf8UAVqlPP0Kc5XD%2BeAUkVULxuIchLv33Dpo9TgiKwF35twR7oIoO8zGmIv8FsK3eFJQyXYBRVMB%2FHKNi%2FQccOx4Jcwlzed4opSPUEBeByDXOZxkrQih6vgmHMzGG3yb%2F7yw%2BEzdnnhkutJmSnjo238JdFUjxhil1VAlnFUAoQMIzAqmSKla2xSnjwOsHH&X-Amz-Signature=5b891a1158c59a9845ccb5e8de638376196afb4516bdc0f8ad2d780fd9e9dfeb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UK5P67I4%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034740Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4iSGZ5VrAUMbqEMIhKdDB64jh7dBZH%2FQ6nCR3fWdefQIgCsYjYeEP2xSGn8%2Bml2ziE3l6d6LO1gGIT3F1pgwK1hoq%2FwMIVRAAGgw2Mzc0MjMxODM4MDUiDMn3ebh8cNoWJTL12SrcA%2FgWC2CFGSDKUKxHerq71rjZ80A9Sftvw9Qh%2BvU7Ho1Z63CXT%2FfaauxuoRqdvPg8zaA%2B6uN5tT18BeJefjWSFZE1EuVKkU5hLG4Vd9b6KM2%2FhQQbhmJK4SkCUAKfzB1xfn30McyXOlPN4eZDiTBrYnPVJCiOs4r992V9S5u3%2B4AEWtUAbFqLq%2BXG5Y%2FPSdysV4XDNPW4svRXuqiIXp79YeDdC0rkzzzi0Jgket1I6l8HxbwmM%2FfkyLYFb2he%2BN0bZzdDRkQr6wZaMMNjn8qm8UHilP5AMqB5GXxt7s8tutdJfgT%2FReDop5HcjQYaAz6sOLj9UjDMn78tr%2BQFYptSxoaTHzl%2FNqZ05F0T7qVVuq2L%2BZzw3a1qMyd7boZafcF25Z2OIIAXIlBOnAYpo7tOIoBFs13FL2jHy940qN18bGMNJBEs%2Bfrmx7bpIA0OKFZIiFXH8vkVncMlHE6TESVOe0t%2F%2BdwBzVVXj8USPBbkEwLLWvUPMWw36vi7Up%2FRoAkXNHLHe7hdLKZnBpnYfuDLf9KeJQokSrsi2V5dSqCEUQkhe48%2F0gqxoJJaLMF8NKo6Hp2pyIf0sd7g9xHS3XoPc2DHu1%2Beke%2Fkjn2SxdgJTqKbAgXV93g6CM5llxbDMPyn7M4GOqUBz6ulAgcOlueMkbd4CCeq4ztalsES4Jjf8UAVqlPP0Kc5XD%2BeAUkVULxuIchLv33Dpo9TgiKwF35twR7oIoO8zGmIv8FsK3eFJQyXYBRVMB%2FHKNi%2FQccOx4Jcwlzed4opSPUEBeByDXOZxkrQih6vgmHMzGG3yb%2F7yw%2BEzdnnhkutJmSnjo238JdFUjxhil1VAlnFUAoQMIzAqmSKla2xSnjwOsHH&X-Amz-Signature=ee9cd906741800a235f83c421dba40410dec5543b55ea6f673687fbce3a60bc0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SZENS6AP%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034759Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHAUer7ooZVxuyqGJM06oaYzvBsKIiGMJdEFADAjWR43AiEAmHlaKaWyh5q18UK5d5z9koUAaUK90E0oAB9G5s1%2Bp44q%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDOZflbse1pOC%2BP3aRSrcA35DwMMQIMLlUK6SsTfIX9OP0Y5NmE0LKr1Q2NxHfM29ZZCIkh8GXvQknVmr6MauXs%2BveHnZdX1h1CjIDv%2FrKMox5tjMaET0kTNB6LGGPGkwUu0MyWK8xklPXDqiSg%2FkQpJN15whwMkaMXAfpQYiBjFA%2F6hzV80VM1cII%2F51aaBxQT394thN%2BgyY41GmKmxqKjgmO0BNHtA3uWr3j%2BlBtXp3wFtbXttqbfnQL5cQTw2kaVGUIOQeIPYtWPXfLcEThfTap3Yvf0sTZaUIUmWwveI2ra3I4Dc9jj5l7SLDYn123CQl4ZNOENBdzOgajc52b4kOuu33j1Nws9RlqTOJgXtoSR999U4Lc7G6z%2F%2FpkSagVbijt1z5VCTkzVPXDjgT%2FfvyDO2xAS2aM1JglOx2YhhhCIlh3WGcI3YSkg3rrOGknKxQTbSPza3NnJcquYYap%2BCsCve19W3vWdx5wdP69qim7juTOzSIu3DCz7TS36RI%2BHv33UJwdkqGFXUglhmtydcF3YUH1n5gUrGD2cuECtTGgEgKEM9Jo9tCpM33qGkxuifbIWeEC1FNQAS8Ehn41ZKpBL8L2L96QphX1XqZltciOYAbg8PfKbyUYJc84BJXKxhsQMUYBAleN44ZMMeI7M4GOqUBtoDLRaWMv8Z9dDo1ytz52RcW%2BEbDzHD2k5moCfiGHgFHrYa7ktrV4M37fVmswFdcClifzzArO67BTfV2Z%2BBtCi7o7sZoHQDu4MpvkEc%2F0I2ooqPUFj%2BXP8EKLtHS0M0WhQJ2Yg5H1hzUlGl4KFaiBbHFKir0JUI2pSEDzhFPEbZlmx7RbDvZX6uFjSi8IxkbpOjH48VLveYR2%2BY4jNUsFjyGVJXj&X-Amz-Signature=cd4990877a795f7967938b50bd91fd37ecdbd5ff4e6becfcdfb321009e57ed2a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46664PBYAH6%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034802Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFkrsuTjpDr5VqKGijtFkC3MTjDDZ8w3CSNFDk866jQJAiA3V%2BhSZ2vKeWLlD1odJQ69Ouoj9gsoT835TXHN6q2MZyr%2FAwhUEAAaDDYzNzQyMzE4MzgwNSIMn1FzlfIbwc1cqu4wKtwDd9qmQIF7rNnqa4qIM1C0qxJCd%2FqPA91bayz1T1BBLIcxazlgim%2FSdRBMeZivYpAPOkq%2Bg3NDJrT9gQtZtZtxT%2FiVQIi8befUO%2Bx6vjt8%2BuFw9pBnMXFJS0zGG%2BQsafGfy3Mxvu%2FioLetfGOm895T0ejR4yfYZvhuq9WSLHzD1Kruv2HYy6hzy4cJyBhT%2FzLFqAAaq5rqIKMgzynYhoaiyWatBkqpADbk4FqqszYEDgKLI1L5fxIaTSYwlKm72TgZaFEqNr%2BV3bgBr6K447r5CAAJIRZiXpUxLfy3vtf4anY6%2F1%2BHQepwZJgN5%2FPCQLFcKdIuRDd069V3ROQ9YRHX25dEaUL6vwE2epxIkXiTKR%2BgnMb%2FFs3LMY%2BX3OcpdAnGmwFbuD1H19CYuE8oVcn2ib3yoaQHJgkTplMmFEvRK%2FELJDAAnSwGNKyN0KfBe%2B3%2F6YnU6Nsikc7zuVdAOHX6jR8tYibCDCfValP5Ks%2BEWpLvsm5m1XXso1PlxYg2sLVUMLwrEePhpBXZcTYsZwTVJlOk9HFnA3cRsQlihE%2FOKKNDhcxFDf5zIwXifPFiqVQ1JqCDmCLKXZC7btl6lNnpLX3i9L0Zmls5O9M%2F6xAbApFdBB2Y%2FtpcZt0Dgqgw%2FYbszgY6pgE6oHEAGftwLCodLDSPlaqPx4M3KvEI03Ka7q%2FkyTY4MEaAYkeVKDHOHi2j38V1TyBXpkmpPN8vrr7eNnlDFs3wVECLU6O9RAvjx43MTVaJZ0qujjigmN9rRAja4nGWOGlO81WEnQc38ZwiaF5uh%2BgReOQ8areXufZHhbGiUNV74lyydLaTvV%2ByELSFXUmbYSf3CQEJDMa27Xg5eWKDqhNpD4XgH9nL&X-Amz-Signature=2a95c62e4f69b059fa1d8e929cc0b0705b9259e79c0e7cff0030f12b3dfc773e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ULNKTJEN%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034802Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAVHO%2FtopBie59s4T%2B9qPN%2BqesctVGl39c45eVKrELpgAiEAoD9Gk8KnBUNb7H%2B%2F3sIR5jp%2Bq3LCXGdn2dcp1af%2BGccq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDGkxvVhTg99Ydp0FzircA%2BTUK7PIPUcxuUwoCc%2BaUK3URNHDGrOz9rH%2BIM6gXxKZxTi8bTLV1YDgBlc4CV%2FVXF0ank%2FB8ifnBxFVYK2x4DMxN8%2FwS68dhTerfGL97A0EWoum9g4vCuuUtsjWws1oVDS56ZllHHsglLzJcOOVcl243Ojr5ydqF9JhCczwopDEtzXqe5gTZuh3krJXD3so%2B0gsb84e7VALvp70mJJeGwwenOdWlUQ3I4Yyz6ik5Va8y6%2FZ0poLDkBntU3Bhqk3aV72umf%2FmLSR3RvnY%2BVZYvtbxV9cZHCd4R4R1wkz0Z%2BbNtkYuLMAUOiwsfSlJQbmjRZYwV5YefQK6K6KPEOauLqdPHf36OkHSgCIyna8yKRT%2BsQMVmoSqPr05359d0fS%2FGDuyiW43EPDKsXnGKoKEof6N3BAiKrhW6cJ%2FBXvUj8VhK2k4dcDasJQ383UY%2FsPY%2BACTjISTAUASl4enEXTLVfIL4imjuT2dXzcGckstuQhznDFDkoQj8ZltVV%2Bfxsj9epRY%2FTRupYFrfAyDD03QOc0GsOjaUI99RbXlzAJM8eiLMed4e8Qcr6WDNbeWEdAMnIwp%2FCNefc6bNHGD2ELB6%2FmKXxunhdKdOpU8TatH%2BLe4cK9aJuVipuXcyMEMPSI7M4GOqUBay9o5pSymJ6BhefMWsavWvN3%2B7uL3YgFDtns4TTD4y%2BZPVzYlr9CLO3gMqmZVG7Q4FJRzzxINktyu2mU6zKURiRSfnBUrAI%2BvL1ZcL3zRqLgmaaZEHlHrq1jy44NB3aRfeelGDau6Njw6biKvqZS5TKwIwvSJpli4IQELLKshIew9nsz%2FmjyO7gCDaghiZQYNkBkMoYruDMfLHp33XdH8zEkzoJv&X-Amz-Signature=af0dd3317959fe1809a0c5445aad68e8005e2034422482aa0ef3a9c8adb49b96&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RXKO5E6X%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034802Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDFmqv92j33CAQXENJ06YnoEkOsj46hGTO0FGUOOD1rPgIhAK%2BvEi%2BFFm1CcOcagEI9h6IRvv7F7wBQ1%2BL3YojD7LlCKv8DCFQQABoMNjM3NDIzMTgzODA1Igz7PKQHCHDV9zbZaj8q3AOxo9vl92HFzPmU%2BqYfeDAyaKUNQ5ZUQl7JO6gSxSJLC3amXgjFyXAmM4jzU9jO3e9NozDh5wBUi46RhSRASNWzasO83Mmikp6iRXNYYyv4wfQxmk9OK%2FmhaVsJG8LCiYVEg%2BprRKtaoaSRIaEuYCRETVpkGwclBRk%2Bx1j9JOsu7GLm6Jx8HuSrvhWbyM7NtdPG7Mfy%2BuwznFsm6dw5dMyiX2fLRBxoN%2B1PPbg148xks6K%2BT4K3JrhgwNBzpGtkqROKwmzX3ZHtE6rxjFZJuoT7XvIEFfdPO7t9Ws2vVvuOoC7dVAtwMd9F5ztqm2MUHdsTWyYpp4kvGAytzPD0e5h7J4hCrPdRTAeFVqbp9N%2FJf%2BvsGIeGHQLLED1FtKmmyx257FmdXaH5AdcejqDwBEhYTNYyyMd%2B7a8oBM8RJOFYku682OaOEaeLv3uj7O4izM7HkCO5RfRGzqtT%2B6rCmMbq85On5RNUzMkZibtYsEQRIzMDJLbGIuLlOKV4ooj8qdf9skl6wmhzH5aDNqjhU9TP8cnJkwf%2FO7UNu0CCD2uXW1imqwQSfwYV5FkBz3iSdVUeRcv61DatxESHEAelCH1Dvbiqu8hH2uE0Os6d7QHaYIkZXzv5BJEoMUgGyTCNiezOBjqkAQIIEedvzdM5Oe7YG%2FYVp3GqM7bq1hXvtpvzSSjCSkEkUF1DRwfpDUImo%2FaWkSJUf%2F%2BvGVKfe38LkQPOyEWO66bEQEcGEFlolw1bBanbB8ESdjHZ%2B3BANvLrOBGYTXIsblkC1bzZS%2FxR4oKEP44E2uUUGHteNzuKwMVaFdND%2Fc0MOmJgOXj7uwchi73QxJPiZSZXyaN%2BYtsHJDwXZQy6FEvBH8XP&X-Amz-Signature=ff7b10142234bbb1367ac6b2f229fa069a4695ae3000aa29c14dd371c76ea02f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SZLEJHAK%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034802Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDreKMzOL4cJKhFkXodQR8tYuqzryw%2FqDHF7%2BO%2BG8QHXgIgIZz%2FC4mhG%2F458bNPdlmiBsRFcmsKIoxRBDjTk9vXqOMq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDMIa0NesnbKLBK8InSrcA%2FiR3ew1beWaE9K9Dxf9KVAhffk6viCeIZxvbD%2BeVwedJhFbR9J4rvV3dVWjPwlcnRSqPemDg%2Bpxt3gO8dR7v3uQNY4TRr28F4SX2dMMmg24jnnP3TvI8XD%2B03eE5G9RLxII5vQkv6FCNi7YyYJitearzS9SZGpybIrv1al%2B0QxyZ3Df5LT0%2Fb4s5w4SrT55djqqvKINADGYiUy1VshB97Tweuwc8kCEE0xXlNn26XZiLoBY7kTI9PKBQ%2Fz9YJLKL0SYwiKa%2Bv8lf1O4%2BDdhledwk4an2eHiOh1o%2FhM6exiRnT%2F4DXgdiICN9W6Itl3QaVTnS15kKohrElO4KkSyVcn7XvfAFKtX%2BNgoh8QanNflf6xr8mGQwETNtaMMFGxviouogNHZ9nvpOYEV3Ki7Xc1PohjcDFZpJgkW25XQu4E%2BrEgKbxDrPn8KQc483E5eGAYjGWd69wzAhjz%2BW0VdBFWe5NWc0fnqhsS0wCvWI0lmOxxlgY%2BIzHP8FmQC6wFJdOiwhEqWkCC%2BqQULMSOMtD0wkbcJVByOs8kECg9SURU1YhDChbHrF8NqF0igHsJx72jxkRFIkaJS8ZOOCnpXt2eRVipV6EQixWCEWrvvotqrVs13jlSgH4ks5Ga7MP2G7M4GOqUBX8G2SkS8wrzZ%2BSvZAM%2B6Sd3GjjoVm%2Fmd5%2Feu6ikvOr9yXRB3gi%2FC6qOZt%2F7f%2FvbrmdwHK%2B4c95dR3ozZ7l95YGeLhu60%2Bqnk3XESnFu8AkmMfy4kfIOGrMe1xqHPSnXLAxn1JnRYSE3jXcaXg42irNtvEptup4J%2BK8bClyJ8Wy8eJdBa7mIJdVY5NnlZt4pJGtokF5CpaF9no4Lem3pqbaXdAFeO&X-Amz-Signature=780bb9696c376dc2e27e3a6aaa8b46751e17656a6525a92d0d13c284ab8d050c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UK5P67I4%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034741Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4iSGZ5VrAUMbqEMIhKdDB64jh7dBZH%2FQ6nCR3fWdefQIgCsYjYeEP2xSGn8%2Bml2ziE3l6d6LO1gGIT3F1pgwK1hoq%2FwMIVRAAGgw2Mzc0MjMxODM4MDUiDMn3ebh8cNoWJTL12SrcA%2FgWC2CFGSDKUKxHerq71rjZ80A9Sftvw9Qh%2BvU7Ho1Z63CXT%2FfaauxuoRqdvPg8zaA%2B6uN5tT18BeJefjWSFZE1EuVKkU5hLG4Vd9b6KM2%2FhQQbhmJK4SkCUAKfzB1xfn30McyXOlPN4eZDiTBrYnPVJCiOs4r992V9S5u3%2B4AEWtUAbFqLq%2BXG5Y%2FPSdysV4XDNPW4svRXuqiIXp79YeDdC0rkzzzi0Jgket1I6l8HxbwmM%2FfkyLYFb2he%2BN0bZzdDRkQr6wZaMMNjn8qm8UHilP5AMqB5GXxt7s8tutdJfgT%2FReDop5HcjQYaAz6sOLj9UjDMn78tr%2BQFYptSxoaTHzl%2FNqZ05F0T7qVVuq2L%2BZzw3a1qMyd7boZafcF25Z2OIIAXIlBOnAYpo7tOIoBFs13FL2jHy940qN18bGMNJBEs%2Bfrmx7bpIA0OKFZIiFXH8vkVncMlHE6TESVOe0t%2F%2BdwBzVVXj8USPBbkEwLLWvUPMWw36vi7Up%2FRoAkXNHLHe7hdLKZnBpnYfuDLf9KeJQokSrsi2V5dSqCEUQkhe48%2F0gqxoJJaLMF8NKo6Hp2pyIf0sd7g9xHS3XoPc2DHu1%2Beke%2Fkjn2SxdgJTqKbAgXV93g6CM5llxbDMPyn7M4GOqUBz6ulAgcOlueMkbd4CCeq4ztalsES4Jjf8UAVqlPP0Kc5XD%2BeAUkVULxuIchLv33Dpo9TgiKwF35twR7oIoO8zGmIv8FsK3eFJQyXYBRVMB%2FHKNi%2FQccOx4Jcwlzed4opSPUEBeByDXOZxkrQih6vgmHMzGG3yb%2F7yw%2BEzdnnhkutJmSnjo238JdFUjxhil1VAlnFUAoQMIzAqmSKla2xSnjwOsHH&X-Amz-Signature=0a36dfab9ad0b302b84bb42f4a83b3573dd3e9625e95575848a788c7f392e001&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
