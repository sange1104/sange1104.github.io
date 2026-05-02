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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U2BJQZGV%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035116Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJIMEYCIQDKCw3IKapYeC%2BzdHvQNUxZ8Jb69NqdGpWyij9izT%2FuMwIhAOs6kS%2B%2BL7OBVkK5QhvfqSe7IiRGXUZlXU3EUuvja3EfKv8DCDQQABoMNjM3NDIzMTgzODA1IgyBkKEtqlHb6g455ssq3AOqKoUzdkXMU%2BHFi0udgz6hjAk0gkZv7mCM3HJC7g%2BgP1guy9NKtcNlwpaz4bdxc7bHa4EdkdLGn5rdO4DmTNxfldMtAlpplMebjlOk97%2FH%2FEygNbNRDi%2Beh3485pIFdgFH9pM7EHOlwJNodg%2FEllXabuNvDUIuWlDVAi2hBpb9RMELWohKro%2FiueJAZQWucCuTkSdTBUwIWKiG3iQFYQNK1L5s4MFIyY5wqhyKYt1IRpKiVMJPcJjgTwqzX9mK2RpVynFwFMoFX%2BpDVIAYc%2BN78wFC6UjnzIPPI3rR8uhovOSky9ErvzP%2FfXA8qVlmHomDgejuet2FB4hykbjk4Bd%2B4d9GYZtKLnUPbrJKh4Yt0El49sJGxvHk0ad1qAz02wHNC1DpEdb4PfLUZiSMoIM90kVdCMvCa7%2BlE%2B5e0yhDAj9WjaB53PsoTPSDTf0OL96rN%2FdB%2FEVfOPtWKwldl%2FTwyAuFlUwSliRAiHML%2B2wrB525U%2BcARUFdI1h%2FUc6W9F35QCwyotdX2fj9wYMOugqdhZtE6%2Bfg8q2QSKrUVnper9zu23CuTyY3Iq0LbqfSLDf%2BHlwZCspRAOsosx3jvSw0YDNOLcidC8AMbLEDSIdOKyND0BvNVxC0GgDGBTDPydXPBjqkAZ4Smfzum3ODtw7%2BeiZVvT716r34YH1ut2zEXg0nwypa6x1fUgcUq6omWxdPAFicmQI0sYCo4t9vQs02w9fFoF66ml6mUzWISRFVlYx4ZcE3VgRG6Ep8TnWP9dxmBrHlHGe%2B7Ey1eqTkNqKm0aVYKwuP0sX5RNigkU%2BGZG95hlpp3W7mFPER1BuU4Evs%2FuG7WceE%2BZyyLJjXhcHICbpVtQmmt4Sn&X-Amz-Signature=ea33e6395e114623a4b21031899c2d7ab44d70c39adf58fba03ff7feb6d62e07&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662W3CBAE6%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035116Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJIMEYCIQC0tNPXM7iCskybkFLslCkYgp0U5Vz04Pv7jcJG5zAVwAIhAJprhcUDFZzJyEjA5Ym0%2BkUTMfVwE4SIImMreDecikSXKv8DCDQQABoMNjM3NDIzMTgzODA1IgxTc5Nm9UPq5479F5cq3ANQiEBa5TDp%2B2bN0a3giveKbT%2FXssa62F9ing8z4Ij0mNmKVnW4Ls5PYU5go%2FmEr6DnJDlbtw%2BcyswjxH9%2FTA3bxVPp5O1tAPVgj1m%2Baqp4rdDAjI%2Ff5JrLl7Q0K6MZksdl7OOpRGxEf507gqYW8t38hIvSuUqGWCLl5QxPycvllMBK61RpGciETAtqvW%2FA0ayHYS8DqoB8Y4c8%2BUjpKC0Nk2kAuuOunrve1lXuYH3%2FB19L4l6Zn5W3LnTcvNoWqTwRuQPupBzqtIn6G9c6LHl%2Bz0cxbs8FltNok1pX1B4YtTcc%2BZJhjAAlvhwzns%2B39%2FYDgWOGSbBjlLt%2F2nwWMtwyLcR0MknJ7HxYqYi6sEAXhwj%2FA2JFMtfikTNlfrbj6Cwh6D6GbPn3pSirneMhrfQp5VG5KVY6V9VZjJ46qI%2Bekaqw9WvFPCFXdvA8bF%2BRDZsgjo8EI3w%2Fk7dw1DUrsrSaoQ2m9nN%2Bb9RPSSmNqOvBXL8TL0oEuRfyBy%2B2MZYQw2JAQyvot1XKlm87yNzIU0Z1ZDw2F9WQNcjFztxOt0hzu1vZ6kmXEaVxHhMqVDkOzFtsZX7ZFHXdvLPe18O7Vg8PuZnq%2BoS0H89Y2jqb6KknG2Ph7NiieHDXdrjlTjDCydXPBjqkAR67UbAC3yv9Yxra7e2ch4jT5DtiqImUBs6nEgYKRJON%2B0zZo2jLevWZIPXCJ%2BMIkI1ZniNMYJCGdCj8hC17XAokw3kY%2FHCkBlYAMWi7v7uKMp4YQj4Qo0NM2r940hYuzjfeKfMAMZsJyFsgtFAdOcC5dTONKdRx0gBxckGaJ7VIl%2BTX5pnSrwLfv%2FNikRC7KUJtXwHH23sMfs4%2BNE4qeXsjGyF%2F&X-Amz-Signature=a8431afba509511657b9c5ee5501c80ec64c690f2a3b36ba52abd3c67d90b359&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TNASYQQD%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035111Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJGMEQCIGfOlbc1ankVQNFz45QAKYldUUqhVxUOGRYYZWT%2BMZiRAiAutBi7hWzcK6m8NcAxagiq3Gk39Y6u8VvSYiIQ4490nir%2FAwg0EAAaDDYzNzQyMzE4MzgwNSIMppAxebQBVJ7ESFPPKtwDJE%2BLHf%2Bc6hEGTaI4p89efjJKry1MA3lSPnb0ZwxzUoECkbFcC6M0kx3Wycn5AVP%2B%2F6nORutELxMm8Cd2QBhWoLCZ4HmLPV7wHhR%2B66t%2BsvawFj9ATLvkm6eRf67YkKvMBNhUBFsvL8jI57RfEqb11O%2BMztzUXrbR%2F1uAEZzzCszvT136eQIAyt8nQuIv2HXO2p8sGM%2F6J8VKUF2guOTsHwZ%2Fczcq3sOYR41ypHfckuhCVaxp81Vbb44mbbYjO0O5ojLgr%2FBxDUXdJsMU3JFbQmsI%2FY7pJNvMRgUCC06FSSfQvhmfftGlog3KqvnuGa9XNXPHdDpHipNGRM3tik5wwXdssgNgfVqjkZfRh4Da7hcYszoITIdU%2Bqt4DJMZOCVZFo%2F%2FvjdQDz7ynJzCvdsgrMqmT7T8elMCeNfN97Adk5Mte%2Bo8a6tVYNv%2Fs%2FB%2FLLgHOeHAheJ1BtjxMawuK%2BWbsXPHMm8mx%2BMqxY%2BfM4AbsatZrP5gOBXo1%2BxZjw4xgh0mWVlEp%2Bkdhc3eoG4efuCMRnW0cMdaLvnIbrqaqKwIudc1gUDuEHnQQQ9uC7V7%2FwgcYaG2J2N24UHZCEHI5xdnnCWSna857QZySuy0stRbDLXwVcv2SD%2BeniDBZ%2Bww8snVzwY6pgERSBIMXDCCHDZkeq%2BqaP3Gmqk8WluSAJ9YtNFpX0pBOtOR%2Fd0SNL6p%2FtXJz6WfjDSF99p1YgePogsKcHZFceYqayCAGlZ4V5YjMFf7qUS3XM8voOaJCN%2FvZU%2Bjv1JHzgwJPajmX1RxDD1SScPiuZdlDVxrmtGE%2BJH0pspf1HCb7OzgVnTTq76FA08MjWOlQCiw%2BFw9CvZrZLA9o%2BpoWd%2FDZzIHndah&X-Amz-Signature=497e9a744ca11b6f89a8571dbad9ebbf77cb151691e9b219b54dc27994910359&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TNASYQQD%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035111Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJGMEQCIGfOlbc1ankVQNFz45QAKYldUUqhVxUOGRYYZWT%2BMZiRAiAutBi7hWzcK6m8NcAxagiq3Gk39Y6u8VvSYiIQ4490nir%2FAwg0EAAaDDYzNzQyMzE4MzgwNSIMppAxebQBVJ7ESFPPKtwDJE%2BLHf%2Bc6hEGTaI4p89efjJKry1MA3lSPnb0ZwxzUoECkbFcC6M0kx3Wycn5AVP%2B%2F6nORutELxMm8Cd2QBhWoLCZ4HmLPV7wHhR%2B66t%2BsvawFj9ATLvkm6eRf67YkKvMBNhUBFsvL8jI57RfEqb11O%2BMztzUXrbR%2F1uAEZzzCszvT136eQIAyt8nQuIv2HXO2p8sGM%2F6J8VKUF2guOTsHwZ%2Fczcq3sOYR41ypHfckuhCVaxp81Vbb44mbbYjO0O5ojLgr%2FBxDUXdJsMU3JFbQmsI%2FY7pJNvMRgUCC06FSSfQvhmfftGlog3KqvnuGa9XNXPHdDpHipNGRM3tik5wwXdssgNgfVqjkZfRh4Da7hcYszoITIdU%2Bqt4DJMZOCVZFo%2F%2FvjdQDz7ynJzCvdsgrMqmT7T8elMCeNfN97Adk5Mte%2Bo8a6tVYNv%2Fs%2FB%2FLLgHOeHAheJ1BtjxMawuK%2BWbsXPHMm8mx%2BMqxY%2BfM4AbsatZrP5gOBXo1%2BxZjw4xgh0mWVlEp%2Bkdhc3eoG4efuCMRnW0cMdaLvnIbrqaqKwIudc1gUDuEHnQQQ9uC7V7%2FwgcYaG2J2N24UHZCEHI5xdnnCWSna857QZySuy0stRbDLXwVcv2SD%2BeniDBZ%2Bww8snVzwY6pgERSBIMXDCCHDZkeq%2BqaP3Gmqk8WluSAJ9YtNFpX0pBOtOR%2Fd0SNL6p%2FtXJz6WfjDSF99p1YgePogsKcHZFceYqayCAGlZ4V5YjMFf7qUS3XM8voOaJCN%2FvZU%2Bjv1JHzgwJPajmX1RxDD1SScPiuZdlDVxrmtGE%2BJH0pspf1HCb7OzgVnTTq76FA08MjWOlQCiw%2BFw9CvZrZLA9o%2BpoWd%2FDZzIHndah&X-Amz-Signature=7cbf19f27d9b7d251db0bd95f3238bbb3fae557ef55489a87664b8340b1796d4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SDDOYX3O%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035124Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIDBC8LFmXZx9YOImD5n%2BdpW6YVRwKuuz7ynEF%2FdthGucAiEA%2F8t7DXl4mJyCXtpqKO0xpKwWWZN4fIugcX22NQ%2BCjiMq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDJvNOCKVD5aChNX0kCrcA8OQgbd9N1dQavMGBwXGb0teJLzF1%2FDY2d5%2BvdLtq6honsemUPELrCCwLb93O9CERMj2uSwdiem4J%2BEDLX5o70EXARVBW%2Bb17uugrfQ9sZ0r7V5TgOZc8oFfEYSQzVQuyPoOlEFcDvfvTH51fMJLr3R2j2xvbMaRNfJhT6vFJ0NZuH1mXxDKQSduM%2F0ow5BM9T5yxwvLr0Cz8yKTfJau%2BGJD9wxudSxp4Hmz04PxBdUPoIwFzKRYc0r9Dv6JKtTKOYM2B0itlffZ1CzkMgQ2zEa2M6cKCHoGwSHxbTRx%2B6ThlxQtAcjzunK4nSqrCu%2Fn4tWzhLmJxxZs0Q7%2B74Mxpdxp3jsI6xa2LR69r4SwH0Cjp58DQTCzRV1v5v8dw63ika5lI3Wx5ANtD52OceinK4nM6%2BOiPapDn1rnkx60Fr5iPMArfQVmTU2YGpvQuIcFBIoFLv%2B8r%2Bu7ItDbhDwADNfQrZPsFkMN35WuIKULpBzw0g1hWwTMNf41QMbjJh%2FyXmBJ4WpKbTDJDZK0EszQhUhhN93AkejnlWk7PqnHnyJQgd3Cac9Fu10Dc3MjT03FWErctpByFBUZpw7ynlAPpb%2FvlSgIcg%2BU2ZSfjY9fcysPBFAjJzkgzn3hY%2F76MPTJ1c8GOqUBhPxYmq2TGKurcSy4IMICx2%2BcxcXA4n7Q2PugmHQ8IIX%2BwnbsZCHlBuMUtqIrZhU9YToyMpRFJK%2FxDQNj6FYsiMXwm4FBg7d2wSIv3cNKmqyzc6bxqI9ZX0JqZpBxbX8Rp2C4U6UpXwibb3I7%2F7nHB%2ByqWmy5PLoTgAogmObaClIsKl7dJmx0KtQxCFmmxjG8rHCNx1uwGp1SsU8nMjou%2BIIVKdGh&X-Amz-Signature=e795c67574ca92e3381adb1b44e39f56f343fd5314773865bcee64de3811c619&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RQITWIU4%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035126Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJIMEYCIQCkmMvau%2BsJ%2FqKAeQ%2BK38xJ%2F4yN1EEUiDEsG5RkfvlJJAIhAIbybyc4iTHb5sJ16m7y%2BTfsJj0EpBpa%2BDL8ls3M7rtLKv8DCDQQABoMNjM3NDIzMTgzODA1Igyq9PhqxUK5uibVolQq3AO5FldHOMWyTakKj%2FXO6ZqcAf4%2Fx8BneNUoOk%2Fm6v1mDFDa7lczJWSNq9SV%2BRnCQvLfom6sqt4Rfoz%2FdLZk3Kw1l5G%2B%2BZIPyRBQrsPOSYF9lx0pfIVdxdfXnFrEmTWherKaDBoC1J7fwJ5b0HCtMOc%2Fa%2BouJSSqqJA8h61Qu%2BlbuWdqWwR%2Bi%2BmSjLCj9QWKlgt4rvWoZlw2U1YHLGFaUdRVnbpYsI1T1L3NKiR2qHd1YJCxffuai6M0L40m3h4oeZjstcLjg9j30%2FzKxZZ3M84pAg3Vef34N6f2T9zxDbDL7XtsJp4N7CrCV1w0U%2B5fHKC%2FtInNTn94ZggaZIFVuUCJI78UKplXSdZ2GvCdurjons4kbLoZSs%2B7fn%2Fa0kigoIDJoDcyym3rSacUnFCTmrRMl04l%2F7B3zgyC88M5Q6oDdxrojnvHrJ4y7divPWFKiXA7YNpQalKHEfOuqVHUVinVVhknbecPZv5tsbjzGAlELp%2Fjj5H8GZX0JbRPtxk4euHvEPhqz56NEh4GA0NUY0roiCyceM6KWoTg3d4C2bxHIf1KGjXQ%2BV9EdE%2FnHVmvdbYqD8XIo1Mef6F4BMmgifB8pC7bz1n%2BYv1S8ZFMJaR9JBaRTUd9XB14Jq5oTjDPy9XPBjqkAVMNHncxIInqtQKelEN6TXnN6SI1DB%2FpsGbuIwEMvEC9VFTOIfeNobbvGW45guUA9VNjTsPkMeVtAm3JfEpyMx2FYBJ1UvJDpiya%2Fmfcuz0urs72ZH4iukigW26oEzo70grfn0cmpHZcmPXE7wXETG%2B4deq77RObSVQgqsJ8D3A9kMyYVCskQR1bPOV%2FfLdqu5z6JcZtzT7nu4LxywuvdILCzfyD&X-Amz-Signature=710cf5a862609b7eb209fb94b24fcad344fb65c5ac9f265c79b31738fc0627df&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466533R3GS7%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035127Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIH%2Bk45UJlPiIzy8iubgWwRIfEmTwvp%2Bwlesla6R%2BAnCAAiEApzUvwGGLknqmcaOM3oOSH5GCw3Woe3rsomYJo8ZDR60q%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDCBV3kqqrYcwrbU%2FoSrcA8AbObdT02WtD3TTd58yLrb%2BIEl4wtZKDwkeQXO%2F%2FuSa6QiTPBBys4WYP9PvWn5fQPDciXJXqcXymZ2FmpFmkVec2oC2kROe9Nq6%2F2Pr4%2B8C%2Fq1RAnJNrTwt134ZeXxCIm2F0hJT2N8rqC9Cj8WAK%2B6evUmOz9WI13OaEwsOGQBrQG7kO0IGIoDkfh9ZUN%2FIhE%2F2xoR8J4hQsaMJYdY1mnWHgksqSzlfqCtKtpNBlxuael9%2FLwoQ8uI67uesrMDb2PyPgrbCQMc9szNQs7o5OpfK6POhcWTi9O91PVRdTcU8H5WxikhAznF9MQbGMW%2BsbGP2u5A04BI%2FUpXVqfzCt3qIaw%2FbkGd38OuvWJhF0oGq%2BTdS%2F4U9IDgaTMG9Dn5U5YRGsexdhPWCIpSG8s4Oi8sc7fgTmwF77UrzaOiuJvZB5ORXATR1ej01odd3zBkIOu9nnu%2BsExElm7KzP0WlaxHDWhVSoVIeGyKDPfLp266MvezYZSS8zqIpFdJblCsUXzsH9QFgHF%2BT%2Bga7faJdPh80B2hro8K%2BMbNiM%2B4zvs4tTfkbnDZw2dAv1xOmE%2FmDl48l4hGVSQWRcjIZ0va21yEaY6NY5b6qUbRVe%2BNKAEgoKpqKnj5PcBv0RyCdMPrI1c8GOqUBnXiJVhXehiXt50sc5VJr9DdcptE%2B8JlPnv9ehx%2BJDNd7u5mURviDJeOmExw4BCSeF1dDOl7nOCM1%2FzlhymwRZMUMCP14qEllYbZ0IFiLYusqU5y5fxn0bvM8ydtiz5MbsMkx1dfQJzrh4Cf8OxQMtZnGRah5GnfMZ1Z%2FusKWtOZ08xv5u5FllsF6J0b6UBIO0eV%2Bc%2BVC4YGN5iVDA%2B4LaDKYExL%2F&X-Amz-Signature=aeeebf854a33bf2c52d930caf9202079b744a0643d2d17b00ca7238c0919c7cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VWWGALFG%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035128Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIQDQG1kub4xds4FEWeqFdgYhkm9xDhjoog9JsAv07HV%2FZQIgMc7DQV%2BRvKT4Ya4QOsHkRgnecueQtm89Li0Bz7PXvygq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDGwmUpSj9EexcUB5EircA0b9gjebO9Z3tXrQU6815fTaUxyXk2PO2kGPB3a8sYOFbrhQjNBkP7hBls5iSeS%2F64XGucOqM7BDnaAysH4mgPmqoWTYk4%2F1WQ3zubvmgwIn3QsqWbCu%2BtaX1D9NowqS3%2B%2F2KbCQ67bXxfvj3A6dIDUb0CRSCv3CfgB%2Ba6i6yXdxCLRnONs35jrsl7HqJ7OiyJpclR4Ik1pD7XnGL22L%2FhIVImSsiyuAkUB0jWjhO0svLoljR25h2pOgCL4sz2BTP5xGWNp88v4rko1t1%2BlkIJ0jE1aqP7h0QRoe3uo%2BnuaDI3%2Bihdpg53MZHumPF%2F90YCAWNCexn8HJw%2B4C7xlJw0Zwka9m0DAvZ1sxOkh6chgNh7q8hbFHq2DOgU75%2BVHrFBbRpFmBtYRD%2BNBev%2Fr673tLgKMP3c6OC3T7XEdXwMgoXfozU5k0iVa9OQgGDXHX%2FxeRmU9uVFeDffrUZgXEZVj%2FBgVr%2FkGo7TlaV%2FS5sAvRYdLcuSMBnVDEG1Ry1Fg990ng5W7JvxNMhhnjbkKLOSehp9Sp0NXv9BFDvdVoVf4kCBCGY1%2BkU4nqTEdMXhPbipoF0Wt3v10%2Fp%2BgTBs%2BYVObysIBeuDqoLtcMdlznsoif%2FH8CEmY2fEwifgI7MI%2FL1c8GOqUBD0Jtfop69L1j6ZOGY72E0Uegpc4v9hMDXrsuyHeVyoUSNU0%2BcHdqKfoGnTTxsB8VM%2B8R15NwWmoNzcAS5xnyRq9FHNS3bkvwi%2BBxYseSwpWIX5T1y2eOctXkDm24w2T8IyMYoM0267NFxMx2Nw8IyFuPiFatQOg7PbayB0Gyp%2Fi4FDp1mqJs%2BZIgU3zmb0Syhmn%2BTg605uib0bJz9F4fBvpO6UU0&X-Amz-Signature=3df6e4832b91960a5e9f6d7ca0b97e78a50c5fd835466d05e842283c4532e970&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XWINZZET%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035128Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJIMEYCIQDmApo0lCQY07d9q3airzKv9zp7GLhSwkwiaWxZOkLDZgIhAJW6zks7vee7dndQ9BblA9%2FPRPzJBR3tpOHuL8F45GkvKv8DCDQQABoMNjM3NDIzMTgzODA1Igw988cJhAhcKMRH6HIq3AN0Vg9uFnUdvaxLGSbIonp8QoQEMXgr1MVltVMgXM4u2SEnDCHuDZg0TY0wNaT%2FusxXzHxPhS6Mb3qhVzuvgptshJw%2F474ynK%2BYHn2t%2BEnvOP%2BFvOWEQkY436HVqJiaFnSLuBo3x0Bm%2BxiS9vdHhs2OroM4xru60w5UwY44dWhFbpVCOQduDhF3UfliX%2Bv6KwIwNsXbVvE%2FzVAgy0gNBizmRBCTfl%2BUBAY6zsNjwdPs2boDelm7n3OMnfw3QTiyiwuH6nfc%2FluYKjhqpTOboTbeF509gyxxP3zJKipjSp%2FpDoxb5pL%2B1NjWOjjXY4kZymZH91t3kuK0VByBQHip5WGcm5STyh6Pw7DfUt05PiBya04u39ZZ5KalXcX2Pp7ki%2FFbllVOkICXokhaas8wOZTrl3IT1A1JWECVHah2%2BXs88ZmC3dtNJW8StjCG7wbOwcYESJW55esYMO034uKoGpKKPqXFq9i9aJx4IQJYKydG618ciOvzL3alxEIGGEIDYQwlj5TQ7mymeHGHvjCCUYCoz8LFXhxn2kuwQeev0JIjs1t26sX%2BTe%2B5R7xso0lvu7KYggfnUTI9ustuudY2gntiYW32L7gqGW%2FtVO2ZP9xuYXyjPNXY%2Fg7Pg1AXFTC5ytXPBjqkAUM0XziVATTIMuuvM14MNVJD%2B7vGMETBYXaEQGPad03PpTA4dyKqD2lpvgO7%2F%2FmHl6mEm3Q5EbxjPmqi6ISHGMmEdJbDDC%2Bgc3TpAxs39Zb66Op7mmyuh2k0IlgAwGXObdNH%2BAJ50V5HZ1EmO0XKxvPQ8cdeFEKWoodiWPJGrn8ZJaT1IFWNORZwckQQ00WEVO3CAIoFdHYbTmsg9NfaI%2BAEyt%2Ba&X-Amz-Signature=e1a91f6a58a9a64034a7d1e51d0a07d28632e552e9e4f22de7e2cffd4591b500&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TNASYQQD%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035112Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJGMEQCIGfOlbc1ankVQNFz45QAKYldUUqhVxUOGRYYZWT%2BMZiRAiAutBi7hWzcK6m8NcAxagiq3Gk39Y6u8VvSYiIQ4490nir%2FAwg0EAAaDDYzNzQyMzE4MzgwNSIMppAxebQBVJ7ESFPPKtwDJE%2BLHf%2Bc6hEGTaI4p89efjJKry1MA3lSPnb0ZwxzUoECkbFcC6M0kx3Wycn5AVP%2B%2F6nORutELxMm8Cd2QBhWoLCZ4HmLPV7wHhR%2B66t%2BsvawFj9ATLvkm6eRf67YkKvMBNhUBFsvL8jI57RfEqb11O%2BMztzUXrbR%2F1uAEZzzCszvT136eQIAyt8nQuIv2HXO2p8sGM%2F6J8VKUF2guOTsHwZ%2Fczcq3sOYR41ypHfckuhCVaxp81Vbb44mbbYjO0O5ojLgr%2FBxDUXdJsMU3JFbQmsI%2FY7pJNvMRgUCC06FSSfQvhmfftGlog3KqvnuGa9XNXPHdDpHipNGRM3tik5wwXdssgNgfVqjkZfRh4Da7hcYszoITIdU%2Bqt4DJMZOCVZFo%2F%2FvjdQDz7ynJzCvdsgrMqmT7T8elMCeNfN97Adk5Mte%2Bo8a6tVYNv%2Fs%2FB%2FLLgHOeHAheJ1BtjxMawuK%2BWbsXPHMm8mx%2BMqxY%2BfM4AbsatZrP5gOBXo1%2BxZjw4xgh0mWVlEp%2Bkdhc3eoG4efuCMRnW0cMdaLvnIbrqaqKwIudc1gUDuEHnQQQ9uC7V7%2FwgcYaG2J2N24UHZCEHI5xdnnCWSna857QZySuy0stRbDLXwVcv2SD%2BeniDBZ%2Bww8snVzwY6pgERSBIMXDCCHDZkeq%2BqaP3Gmqk8WluSAJ9YtNFpX0pBOtOR%2Fd0SNL6p%2FtXJz6WfjDSF99p1YgePogsKcHZFceYqayCAGlZ4V5YjMFf7qUS3XM8voOaJCN%2FvZU%2Bjv1JHzgwJPajmX1RxDD1SScPiuZdlDVxrmtGE%2BJH0pspf1HCb7OzgVnTTq76FA08MjWOlQCiw%2BFw9CvZrZLA9o%2BpoWd%2FDZzIHndah&X-Amz-Signature=f1a8f4a252a827b4941188bdf579dd8dd85b89f2da444b9884dd38c01146444d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
