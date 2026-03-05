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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YN7XPSB2%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025517Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC6DKk0Ni6fCPuVsIW1NTk1Pf9igMQI8SZQFsh%2FjVN4TQIhAKuUvO%2FuR4nnG1sj%2BTNiy3tPDSrer4GMCedkb3X2WkbbKogECML%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy4MuEK2JeaXgML9gsq3APSyYa8cWtu58lnJ28u4VsH4tCh44ai%2BMdfICtofvePpiBIrMfpNJRhTAE667hINoGDTmAxdvIA%2FWUmuGN0BOLVjOlPNrOR%2FVRWgfzW75gMsU0btfuRGAN2ZNt1sLD5u7Jngz68lS8CHwI5QUSncdBmBR5XyEkdLXj4Qb19AK17E7kTi5MtDRtxS4b0JMaPCFbAgaRlAZDPJa4RCNMc6ZqjfKg6lGKk4zFUv2kmOzCdg%2FSEq3VMU%2BD692GtRoHF9DtLiy2HFiWJeKQE0ZhuOyYIt97ZLEr9UbuAE%2FaxFtuDhHRbt0GtxvCw%2B02Qgpn1DUZb%2FIn2Hoyn4oCUGaMoJRXd27y18X1TfCrFfqBwJhzAXZ4ATv6yWQrJqfjzThRoWS%2BPS5zX42YzDvXZSJ9t3SSNCHQwcA0NDe3ql%2FH3LglWMeJr8p6xokb%2FoAMlbZ1OjxD4ivwGyRzkndkrWj6j42WSe2hxPnlQVu%2FuUKVF6BMRLNM5CAXj%2BuDteioDHVtpZcMl2%2Fnc%2BYODyuRepw6x2vBjt42gHCBy5sCjbvmN7qsJiq740TRfyOL3z3DkanFv%2FckhWvTinMhEWgs1YAku9bpPu900R7XHgJgBPKHJszTGjSLLqiq6KAMQJqD5WzCqsaPNBjqkAenZyAJN7eXhw8eYWYQf8BXNFMB6HRde0p8z%2FbajSotsXgyPGRQS8voop3FDa1z1F4fHIHj6jA0852i0NSc5WkH2f0UC0CvBx2nIMRavSb7J4WlnLlufwgAI%2FyoEY7QurhzwU0MXgeCAnR6LDOg1c6wOa88snG1soqW91nDa1yC5fXsvkmF%2FVjBycYLQJh59a8OnzE0LHu6oCn2Pfe9Yc80d%2BlfC&X-Amz-Signature=974f3667bd3243b8a787d1e6351523c6ebd14a6e157b35e1788eb351e59220ae&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TYLVGIDF%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025523Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCR1Rvaa2NriYyhG9qPG8g1G5dOrO%2F5vHi9Y9Z96kChcgIhALHUKwXXH35W4BBSxqPy37IiP9Wgh2VJsj4bjKkr4k%2B4KogECML%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxAgN8Rb3CpqBJRpqIq3APQxHqyZGclBnOc4P%2FVk7hrwWAx2d63fAP0%2FxSGU6YMWPRVDpD%2BECYu4iXA9HjssKPkCP3coPQ9jg636OpLHhTgzeI4gWNdKpi6wmLeOY%2FrcFgz2w6cMlM9SUEJ9OqUCaXE6%2BE9tjhG2HIgHQTNdTdvqkI6gA7ZXKypKFmr1LootWQuoxnKXQ0Sz3aG3yHD4EwEwLd1XkUfh5Zcj%2FxR5uWCFG21QAFWgM3ZOBRWr6pOnDJcmeTE8EsVepXeRB5jHhs1BNd%2F0%2Bmb6bXcKqLILYIN9dac%2FO5BM8XGzMFi4%2FI0z2Umd%2B1%2FEQTwRWdQqPnq7iTp1r%2FrU2phYoKzD7M9J%2B98EhvyqbHv4ICyX3CpUdkrgiB%2BMBz8fOQjvbu1d5jlC3wAh5X6lTOPnpXo4bHImCNRluxl8zaFcOeSSP%2F%2B1%2FPHr689akWWsuTbPOMjfS1lVIesuvOXWchJkGXPGcPWrQdkZmogbBQDYnyTDU24eifWZ8xXd8ym6zxVOgjwDspRsLa64GR%2BdsLtmRJkKenTjs3Mi9gEoL85TePjItc%2BcrEWLazD6h%2BS%2F0EK%2Bg%2FceS95gQrtsqmQQRtIWrKkxZPgc5qElL2yEXWUkOLZwDNFfm2SD6mUtZ%2FHgRFVb07eiDC6r6PNBjqkAQAd3D4xisZKXhRH3xFpzHPLpdUuRdV%2FCO%2FJ%2BwmZXl7irJzGC8GjoWikwxDn4Vr02Ed9g9Htvxro0KnX6p15NrbvawqLrIWEXOsN16lP0K06iMaU5UK3v%2Bnsxf92MUhXp%2FnCtfGYwTJqhSNjBOJ%2FcUD3f9GYSBsIu86L%2FitTWvBjMSRexAQdDgHOTzYHgonjzUsUIOXo8xjtnsvr5WYJfEvam%2FR6&X-Amz-Signature=65b14cd593cea47ae3556cb1b20d84a967cd4ac6113e891b88eec7dc8c28eab8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QLYVI45P%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025502Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBKqfICAC4GsF95QzfeEJUy1a3nhJP2uTGLYqwyfoxVvAiBjV%2BP5IQ4vgTUVEj2%2FJLwyjE7W%2FQP9MMNX8y7shWSBXCqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMlYK5Wihogmcb%2BKwWKtwDNEvU5WrCEekKJIKynaIZJRllHDKvK0cBjK1lvyEuu2mbirceKqIhVtghZfZjWHH%2BAcFCaZOu57p9R14ebCqN6OFnjcWr53EbwEE2tqtSx%2Fs080%2Bqx9crAdcl6%2BDVzPverHNcmPATG0LZvHpujdoshVkjFgYn3fmysYBrj894lpAn%2FXiDDrq9KxMIaxLAmn7MFCgT%2BfRVi86ciaPKAOVVoSc1U7IDl2fdc0oPxBJ%2FndlMEN6mUSbncs4UAVx8XajSo1Kbn7ozCn7rFz%2FdI5zm%2BHdcHDnQe9BUqDoB%2FYwCim1J5SOatQ4iGgWuyCYwzRAmH73JGVxH%2FwWhaZCCup7SrejKtZ%2FXkZQUoFVxb2CSLluYrle5NrTuEWXwsqjyN9TCBXpO2DsHfyKlZ4xUGCBA3QWKMfjcmb8o%2FHn3scJ5hlMuDBMQyTzJspCV40umnA9Vgg0LChXaL289antVCL4okQnfcJaSJ9IoNqimIqey0XkY46WJlfyv98C3GlAoIp33pA3wblFfw%2FfTxg521%2BheeDQb5kyVMLtc4WXe9vJlezZRLFPXHyOMrBRggCt1vkDz%2BPuI537nKHGMRP0vm7pXtjI2RqxCSGKFh%2BRwA1FBxUQp16Kebpjdr8v9h4ww8d%2BjzQY6pgEQUYy8QPAupu09LHnDLDGL1Q%2F8YziMebOx7gHV9mE6jmIxMPAxIKMTR59cc3IFcX8FCzh3plzABoDD3LvT71Fbw3XFIE9SL3ct6N%2F2Q%2FKvnpt6EQsZfbp3FLzM9FQHT1P8AWt48qyj7kOo%2BjMkmWF9y5Z2Yh%2BSZSitKS1uMlU1QwII2ucWY1AKNnCoKOxXqCo%2F%2FBgDmHphMQhGXBv%2BfSNHvxszbdME&X-Amz-Signature=fa939fcab6d1917e4385c07de67f8aa10309c87570f174ebf0ff7a3d8236ccb1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QLYVI45P%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025502Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBKqfICAC4GsF95QzfeEJUy1a3nhJP2uTGLYqwyfoxVvAiBjV%2BP5IQ4vgTUVEj2%2FJLwyjE7W%2FQP9MMNX8y7shWSBXCqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMlYK5Wihogmcb%2BKwWKtwDNEvU5WrCEekKJIKynaIZJRllHDKvK0cBjK1lvyEuu2mbirceKqIhVtghZfZjWHH%2BAcFCaZOu57p9R14ebCqN6OFnjcWr53EbwEE2tqtSx%2Fs080%2Bqx9crAdcl6%2BDVzPverHNcmPATG0LZvHpujdoshVkjFgYn3fmysYBrj894lpAn%2FXiDDrq9KxMIaxLAmn7MFCgT%2BfRVi86ciaPKAOVVoSc1U7IDl2fdc0oPxBJ%2FndlMEN6mUSbncs4UAVx8XajSo1Kbn7ozCn7rFz%2FdI5zm%2BHdcHDnQe9BUqDoB%2FYwCim1J5SOatQ4iGgWuyCYwzRAmH73JGVxH%2FwWhaZCCup7SrejKtZ%2FXkZQUoFVxb2CSLluYrle5NrTuEWXwsqjyN9TCBXpO2DsHfyKlZ4xUGCBA3QWKMfjcmb8o%2FHn3scJ5hlMuDBMQyTzJspCV40umnA9Vgg0LChXaL289antVCL4okQnfcJaSJ9IoNqimIqey0XkY46WJlfyv98C3GlAoIp33pA3wblFfw%2FfTxg521%2BheeDQb5kyVMLtc4WXe9vJlezZRLFPXHyOMrBRggCt1vkDz%2BPuI537nKHGMRP0vm7pXtjI2RqxCSGKFh%2BRwA1FBxUQp16Kebpjdr8v9h4ww8d%2BjzQY6pgEQUYy8QPAupu09LHnDLDGL1Q%2F8YziMebOx7gHV9mE6jmIxMPAxIKMTR59cc3IFcX8FCzh3plzABoDD3LvT71Fbw3XFIE9SL3ct6N%2F2Q%2FKvnpt6EQsZfbp3FLzM9FQHT1P8AWt48qyj7kOo%2BjMkmWF9y5Z2Yh%2BSZSitKS1uMlU1QwII2ucWY1AKNnCoKOxXqCo%2F%2FBgDmHphMQhGXBv%2BfSNHvxszbdME&X-Amz-Signature=7b7ee8b1275025bba3bccbb4650e9eb0ad2df123b49a7a895c256d82882a8172&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WBLBYK7L%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025528Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICXRgqhRPSM5UfVpqd9aphxHSkig6O9jR%2FKy8yPkTntdAiEA5WBUq0IYHjROxnLDlBe2t10z9YgyIVg081Pq3lWHbGkqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIGrB38tfCL5IBC0vCrcA2riof8xCEb08yV5pNlKEiBH7mRzSezxXYS1ZX7hkau0uKNeWvK2Ijfuu4iUVwhARuX4cVOzmXS0zZpO2O%2FpKz6rvieDgEAljbVWsiqn%2Fv23KmOdzRVov2sMXWhoO%2B7TGqzSGNPn4r7GOuMAMhQAB0oJ%2FJPzCdIyBSrAC6FVOUjTIO94ygIlaobUGia2wsg5n0pacu%2BqqiDNbQT1DhEkvF5HBKxHC4PLR5ujKTKmy69khK69FCRJbITBGJI5OQrAHNGM7U3Cz7L%2B96fhPKgUjQNnHYaeUCTvxQFFFrm8oxRsiNnCzSCmL0rcL44N31lzBM2SgrW7qsyeS9PMMt8DhbtZYFxazG7SwI1Yf3Tw1JqOW92PTpDq7DWH01e7dXT2fHieFvdeX3Xv8YLWtncbVOc3yCLJm4FkchTCSLsz2Q2aBNEPnQ1qW8x4fbDblLKQFBw%2FzhcelC3JOcrmV9YJyJcsTcaD362i7cp2jLhsedRfWfXEy%2F%2FoULSAh2MohwzGSkkYMjzWjPmQk0ojzMiy7%2F%2B9cqK6B86BKQJeSgoeWcNQOsGCn76DMnp%2FKu8Vk6FALt3hiJNrHfCz52C86ylX%2F0BQb3ImeJt50y%2BfTTWOHK1fgz%2Fxn3p5yNK3zrgJMITgo80GOqUBijYPmRnd6FrlEgQv8EcnZSyXaDpsrXVo0wlH7gQ%2F9Y2xgaFK621cxsDs0IzcqgVJ5yUGaFcXSIwq88Ei7%2FbuAWm5GpBzlDIZKyg62NDhur3x1lfdq1YbT%2B5haF16Tg2zFRGdtHoEILDygJWrnMnIcFbTjK3VXb5w8u%2FGw0DtsohGgYHwae4vmICdOliJtwFa9f4Zrn2ZxQesZRwT%2B922O6WFC%2B%2F6&X-Amz-Signature=d5b04d31f26c7ab266c87b3da63f6f997047f086c274fca62c1c2d6cff852dfd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XLCAUIWZ%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025530Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDBbxvdv8nj4J9z%2B327v7YqpUUNw%2B2VvrbHN9IPDq%2Fe8AiAEHp1qPgr0on6aQ3pRW5Ppj6Bb45Gh6R5%2B0HH4ATtCZSqIBAjC%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMxQiTDfV7ZN%2Fek5MDKtwD1X8SyxYuzdlpiZs%2FTIrKRgtg4m%2F6aIKhki1FD4yXQd%2FXb0hcX1XVEjHfNaQEP%2BFhZ0NCrqUrEJCsk4jp5rZ1EJxrAmFBGy7D6f49Au2UfJS3%2BLdTagX9bHNDwBhFVAvkoQ5qNRbFbleQG%2BfB4PSlxPzJEoT2iO%2BmiDAyd5HMvAZgA7AmJGgEu4s8T5gnPvx1YWyBgh5tGc%2BXrPhBzMrO6PTTNzK6e%2F8Get8Cz9S0UtZVRs%2Bzx1HYQxbScIrHgGkJKKsmWqDYGRzhDVQtPjbfxrOlQ1I%2FeeZrx87KP3rFt51fPPyhUuul3M3xm6OvMI6piHGpU9IjuRgPcPx61yl2eTB7s92l7%2B0UZt2L1Ok0MNFg5FsHJvIPZ%2BDwMUmAotBx9lIEIWNJQBVNd9dfvRojmCtTnfadKfFZQl9%2BoGd7VbxaCzoy9Pd6XDDvFP3jt1hsxj9FY9y2lafhHO62zAyNgYviJoodizEPbZOlEPYbslm9%2BARqDADhDRuaXNvdTmu7l3gvASASRkCK%2FNk9FF6UmWTE3iRE0N5FF%2FIoUza567kWtcE7SKNDNE3Ug8KkONVlCkuWNuHs%2FiHgoYUOnGYoINdYQcT35CHQGB%2FKPrmHFTzVsGWeHOD9Q27zHYIw26%2BjzQY6pgH8KmjKYyYFgCkCLbWmJDso%2FyQkoyAN3xL4PA05kHxcj4YPwWxYyhlKO3jdZEVpb7TZ%2BKAQ2qp%2BL9JbhJwgbGCzn3mie7GJLuxbzLLchC5BKCiZH6Tx0xKraXQNGtCaQSIbT%2BKGMsAWUAqr1dFtErW14CwM6yD90CksJrM6XrgpObfyv8%2BSpHLSMHHK7LrhTl9RXWv8ggrTVouCc9NGLzXT6840WwdN&X-Amz-Signature=cb4c60282e7d68b77a92553d37948ee68062ccdba16ebfd08957e7f8218535df&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466225RPKUE%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025530Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC9tj4kcz35I1mFQj1cGVN2SY1vrY3AOILj82fmpCCknAiEArGTSaJtgrzZoUpX9marFllVy481nUTjcGaxADOpPp3UqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGpkVB9rrFjnL6jtySrcA0Hrfel9IKM9eb3kESHGNnC8iUHsLFqN1jcMyVfWsbpGdJccDfnvjQx5SIOSaEz%2F0HHpI8pX6cqaknXFncld3mQJYNXXIN1fGlUKco%2B4XZEfDoDDmknrhTLpMONjnBjjzW5Ynhtot%2FM%2Fr5sKcTeQaGpH2e4k5rJNA%2Bc1OWCab6b4mpn85i%2Bqut47qPT70ACsN%2BV%2BZQLc1PD1clhNcqhuIqEGQF4u5RAFxo%2FQkpTa9eADmsPkQBNzWPAphWZM739Vgd8nYpJxQ%2BBAobSRA3F8IZtU65%2Bzjiztx3MvdvNyUIQ5e1VB7JyVSZWVIYWJWUOTWDAly1s0fyKLwzJCAal0%2BELHYqXH9cvfdrI4%2FvousoHK9sgfxnySWxDgJwx2OIrhpTKXj37lK2kPSmbIQLeFk3MOgjuK3UTwymiWIleq%2BDMtEj8JWahOu5Am9pE9wccniZWwK7eDBU0C%2FxwwioyKF%2BbDi6i5IXJmdAlfUzsQDxTLblKsbD%2FL9eiYrOHN9IlBNAlD6A8%2BmYkWhMSr3bgKkVKFNiNEWrkCQfhYASPoYlQVnRivtVwf1XsQ1tt1tYhQlLNqol%2BgVYpBpy8CtAK%2FQOiWQnSKrpf53LkuG6PSF07QbQ%2Ff4UEM5Ygwd%2BQDMN7go80GOqUBJzNentfpF%2F1CDDm5%2BLOPz5TKxKLYUzhloeb9gC%2Bk1tZk%2BkyHlXYEgLZp9Ie2bhF5HKdiP6fp0zYGirfEBE1iEW6re9OQz7%2FzLV2s9efD0hRVah8l49u6TCCzWkZm9AB074KkRC0EO8HTZCASJVDLzq4JbMZUVsFmlgfTm%2F6t4yn8cyREOkOp3A0%2FObxGZy9nrJulCYC1HPu786PbUjXw8nk4nrvt&X-Amz-Signature=73616ac4aadef5bb39cfa2c2329cbceb26a257ccda31532a97fb78121a497b80&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TLI3N4UN%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025531Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCu%2FVFoopMw8XdAtBSDQWWf1apVZVVf%2FCwhQhLTkFnXKAIhAMgPiOY7y4yKg%2BBhfV1hVSN57ZupVJA4av0%2Bioe%2Fc0%2BzKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwtbYwzNkHfqmaA1PMq3AMKrbzfl3QE5r0yyVtSv6r9EPl%2FyQjNIn%2Bjf5LmWD%2BBxs9n3oRYtAHgdGLAhNjEt7PFMEy394XnwdH05TWJd43icdJy%2F6eBqGF8ujrwH6u1NtHyM1%2F4dU8erAg8rj51iTCNJUo869FEa%2FR6fSiD2mmJyHTilsEdDTOGOT8yAEsc14G%2Fn%2F362OzN5sjeo6fWdrCWZCaRdKof4QCpk%2F%2F9C0FsndQQDviG1IZ9Yf7%2FZTDK2hRmCcGYD6pSFpJ0%2Bh9cBBRA54zHAcxiIUxZmAIKRcjMewRSM%2BZhQ1PvxV%2Frl9mvbozYpgmDDpoqVIvFFYTroH1rcPo2uzUWP3bALt01ohlBi9lYqizLLhPZaHdgA5RxFmGvhJAddCmYOiiC73rCV%2B3jzrfhN5tfqM%2Fv7iN6q4%2Ff2HOZJJaakwC1fcDD0JN%2BjhAqQo%2BzXPFXyKfr3CdkXNz0UbGl6GgtrOMZkh%2FIHyav%2BvnVw5EV1flbFXLiPaJolWNjD1Cwql27rlViJSxaau7qQ9YMupCLvgqmDu%2FO5EXt2qFRAHpkqruo2zg5ZJbO1nVX0NQtNMVbX7PcY0m98DxMo4QI1vGpSn%2FF2kmyTF5YMzEAIwhz%2B3w19WgqXDjW7FRjOeI2mL6Y5zhMBTDv36PNBjqkAbO0jY%2F9geKhNYRFgeMFSHzra3GO8%2BGY2zVqoPFuBydrCvFwoY5zb6XrBsCqyusRJlPFPQ1LU8TxM19RqBSMXJ9QHHaIQrDAOc8eoe%2BXggw%2FEncMVjRwgADs5%2Fho0cKnPh%2FAo187yU1W7OMTtIZ4WYs9ZYW5g1VUtGyYcaxqXzW7Xg1RK9HDTrDvX%2Fk%2Fvf4mQFN%2F1aGBzYQGH4V%2Bpy%2BFjoQgQ3oT&X-Amz-Signature=c2f0133a15496036b93c58abe006986be27ebfc9440979bd15103051dea35f04&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663SYXBZHH%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025531Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCID2A3%2BdPgOYSbf9FYO4Atxhw2aww4PriXvs5Z918muZcAiEA1X6nnTD%2B%2FyjSnT2aKvlNPYu%2BXHuM9QgDsF5PG%2Fvm8uQqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNVJpgj%2FanZVAf1i6CrcA0%2FHJerBuwZtTERWRmt7yYuZzasmOtsmpOhSaLjLKQ6V0Ov2o4on7Vsnyxqs%2BIMgZDGwu84GFp4BvTNOwZgweqHblaleovSMaNg4tiZQkaq8Q7s0uRqx1nFIMm4z9IP9TXhD9vuK9lITm6O90Oq1zalM9BEseQZUAOhuH1qA4gZTiDFYVEJQRCesnUfqIPdhEhxpJTIfJ%2FHSJEx27tKaF3W9fhomR3v0w9LED%2Fwey0P3mvTqFEFduDLX0COFvuE7bnaENenBPrd7n96LZCB%2Bv7INJsLTLxGlOEWW7YPSZ8NIr%2Ft%2FceHhETn7rpkUdQQ8baTWJ3%2Fy3WrHhXUBrRMTQpSEmrKAN8K%2Fywi%2Ful8up0aVAYwQQ3WJtW%2FpQpbypee5GizETGRscHi7PV28JMXLixZN8C1KBNn5Vmut34IF%2Bc%2FVIEdtsRm81RLAGB0Rl5jtu7TPqCM8kZe6nJRH7odNKjGVB3uxfLnKyClUWCY7Ni8LBgzupFKOnxGlDZnz6%2FPGRELQiXL%2BkH7q4WmMKMXPRKugsWjH%2BtlXBp7Fx8J6gTBEfx9RUzvxDCYERx2h1BYP%2FO%2FU8SXYp6hfhkYChEsoLoaQ3KexRJtpxkM4dOg470gZ0iF%2BCq1g9ik%2FFgLBMJLgo80GOqUBqRorI1ofq06V%2B0TuR2iFzdTIm20kRVpDwVrjiAKMaJrz7YLLEdSd2IPvtA0Hhhq%2F%2BNTuwcJb7pU284fJYuYOZaF2FrzVrBJWpRu0jqRjr88qxppzMOZqG1JJGQVqbfuHVmIgQdl0F2OC4wMO9wP4fv75Zgj13u82RyB14kbiCOIZ%2B4qBoJY1dUvgZunGJEv2WY7ga8258Q0XSjndk9cG0oCqwirp&X-Amz-Signature=93d0fa0a40bb3adf22bd2b60f138dfbb115054f29330b8acfc7a58d21f8194b8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QLYVI45P%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025502Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBKqfICAC4GsF95QzfeEJUy1a3nhJP2uTGLYqwyfoxVvAiBjV%2BP5IQ4vgTUVEj2%2FJLwyjE7W%2FQP9MMNX8y7shWSBXCqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMlYK5Wihogmcb%2BKwWKtwDNEvU5WrCEekKJIKynaIZJRllHDKvK0cBjK1lvyEuu2mbirceKqIhVtghZfZjWHH%2BAcFCaZOu57p9R14ebCqN6OFnjcWr53EbwEE2tqtSx%2Fs080%2Bqx9crAdcl6%2BDVzPverHNcmPATG0LZvHpujdoshVkjFgYn3fmysYBrj894lpAn%2FXiDDrq9KxMIaxLAmn7MFCgT%2BfRVi86ciaPKAOVVoSc1U7IDl2fdc0oPxBJ%2FndlMEN6mUSbncs4UAVx8XajSo1Kbn7ozCn7rFz%2FdI5zm%2BHdcHDnQe9BUqDoB%2FYwCim1J5SOatQ4iGgWuyCYwzRAmH73JGVxH%2FwWhaZCCup7SrejKtZ%2FXkZQUoFVxb2CSLluYrle5NrTuEWXwsqjyN9TCBXpO2DsHfyKlZ4xUGCBA3QWKMfjcmb8o%2FHn3scJ5hlMuDBMQyTzJspCV40umnA9Vgg0LChXaL289antVCL4okQnfcJaSJ9IoNqimIqey0XkY46WJlfyv98C3GlAoIp33pA3wblFfw%2FfTxg521%2BheeDQb5kyVMLtc4WXe9vJlezZRLFPXHyOMrBRggCt1vkDz%2BPuI537nKHGMRP0vm7pXtjI2RqxCSGKFh%2BRwA1FBxUQp16Kebpjdr8v9h4ww8d%2BjzQY6pgEQUYy8QPAupu09LHnDLDGL1Q%2F8YziMebOx7gHV9mE6jmIxMPAxIKMTR59cc3IFcX8FCzh3plzABoDD3LvT71Fbw3XFIE9SL3ct6N%2F2Q%2FKvnpt6EQsZfbp3FLzM9FQHT1P8AWt48qyj7kOo%2BjMkmWF9y5Z2Yh%2BSZSitKS1uMlU1QwII2ucWY1AKNnCoKOxXqCo%2F%2FBgDmHphMQhGXBv%2BfSNHvxszbdME&X-Amz-Signature=35f1f83f9d7e6a998205701f8b2d20e0762965e25c7fc7b3c47b2158a3c89824&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
