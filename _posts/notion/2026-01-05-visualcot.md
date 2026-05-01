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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WTGCAUUW%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041628Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCICmIu40v7KV0PaP25h4G7AxMqQFCCj3oCQPhd%2F0iMYv4AiEApV%2FiAPwlOvfUwaKigpPtlfvAqsdTlYfyTxbV3eQX7EEq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDIIF%2BiWefxs7NdagzircA4cClNqqdLzE317WAibN5Lu1Lk6mMdwo%2Bzp0GiOZ4FzD%2FSWzjdy1Fcbw%2BeJqRH7CKtjTSBBjWkXXEF7pzmQo6ZzJyx0l0m4nH6j%2Bj9Ji8amF0wyMkkiyZfcX7EL6w4L7OOb8fmSKbt2KwdQ0rwipRnppU2lKv%2BIyUjitXaeAx5ZGlcivh7YZmwzEyrHpLPlR3e8Ag5iiLemRtD%2ByleHTT8wkgLMBiVSJsj%2BfUj3EEHCpnDjDw32rYuYATdhGWnwhecEM1D6GCMdzqVI1lpFl2YF90ynFyQRt1JZUReAfJS6bSJck2HLDrh4EaTWkRdA19UWeYN5Ffb5d7ANovjbL%2B8Cq2Lb8EawJEkGJYeEo1Akxkr%2FRiXCg7iBBaIFI6xM5ww38IIAoZRyMtw9eGIwNTaM%2B%2Fj%2B9U4rxKuuU94E2yhODScSFxRVvNUT6ZCKYiw8Edcqq7PAC%2B3MlbbYZSbMq%2FaHQevUZ55TXnXKeFZfShKsuiQjHsGDBiZc0039X76y%2B%2BPJ1S8rrupLZWsYPUnNDoAjLBz1MvFwpz78TWY8Ys1L5dx2Rc%2BUQX%2FbtteBdhLI1H7WY%2FfD5UN80q7ffZw7YZWG%2Fpr%2BH0KJ07nUyJCBJmXIMF%2FO6rSfdS8jsxYr2MIS60M8GOqUBi3wq50cWEGV1W%2BS5gLbeH68h2zjhfGSDf6G%2B%2BxbnHeju6sEaYfD%2BBdEav3wvYcNwx%2BQyzPavp62dLX1D9J50w4BN6cCEWvH06c0wvXih6U4lHYdJQpcBJFOddn9rXFGHHlI2aNjJBf5QqVf9KefhknRipUOqWqbuPkMR0X0O5TrJ9iLbU1uh6%2BLlgZgkS3xJUG7X8tka7z3vfQu6guJs0eTCnv0E&X-Amz-Signature=cf01025c4f7332a657de38527d3456cc7b4006c89e1616ecdfcf278cd119de5d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RSPI4OGA%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041628Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQDovasjoXbUr4vTsWdvqs0MdFchYhGQTB09ZtXKP6Dp7AIhAICaWXfyMKYg%2BCRMvh61fUZEzrcpMY7XQ%2FsQWN1QvfeCKv8DCB0QABoMNjM3NDIzMTgzODA1Igz%2FiogUhc2DFSSQwkEq3APaBn%2BsMN%2BHcGTBmt15yed0BWoyDrFr6OUfPePUT2F6JeIjhEB07AHwi3XkGWx0UYYIKl8D3PbnP8LoyIV%2Fu6vBampiYaEMWuA%2Fak3%2FnsMq%2BPE%2FEiErBozWMat2PyfcCJ9n8NskP2TDBfwIE4cnT4wp5LSiVW78VFKX40sQzjFoVVNtTklcH8RtinDBWojdpicokYHOMVM8Vl6MLayoIHGF9Z2dREeLBwVP5p3aqWADiY4YYCnoVJ7WeE54fdgWTESvqdsKkgRZ7rlPPMTsR7b9sNR%2FgJ%2F1rZMEIYHkXKlSjH%2BLkI8Vi4bEOMKCaxTk3SPZxdS10b0US%2BbmKUM%2F7Vqr8W6wkTY4xH9LzIe49%2BIfTGXxgAQUWv7rUjOZ%2BxT4nxwjHQ7Ys1QJcglD1wd7HOcUjf%2FnuPuS5b1SdXl3t3R2btDEs%2B3Pah3lt4SeENT7vYzTLMvIIKepbfGFCXFoT%2B6gjEO%2BjE%2F1QildGj%2F7Av82l7CA9nkwyuzj6zFNQEZkudZQJA72SG3PfBRA5LtqTDiIANH4GGzTL6efrQ8NMM0vA%2FenNdpAtzFDFOR%2BdsxE5xxDw4WpUjvBYUyOpo4NchJ3IXZsudhOTmIDmceLhHysT6nZfn2vg5S6UIBjfzD9u9DPBjqkAYGI%2FyMCKppl8DCdUgF1f0buIbft2B%2FZ5cQqu3tYf4gC%2Bl581Vi8pnhVB1dMT0eabuIUoikmdQgVik5rLQBWIBErK7%2Bm1NKau%2F2G1Bsnblpgr5atSCIrvBnDrlfyENuiWJyinYvqNLuQcBr8S5HBc1jyDKhaB5uKRH1jeCWlQQaV01vM5uPGA7atfyO6lDlPKcBo7Jw8g0f75j5%2Bt%2FnhI0%2BzpYz4&X-Amz-Signature=d97c4c8de318485ec68fb987f172354b344f32c5e4ab5b7e2abb95d987b56689&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466URXAAHIE%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041620Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQDyHMVbK9auozGdqhbQmDYuYdtbnuF9JaRb2K348Iia4gIhANSN0dFTC3G%2BLSY8Ni5SDi7AhQ6w6A%2Ba2Z8cM4UTVWVXKv8DCB0QABoMNjM3NDIzMTgzODA1IgyTlPdu7jdnR4TzXWYq3AMfdd%2BGG5YZRl84r9YEcirBIaYjnllgEu8Mc1F36AvN%2FZ94tLR7zrJuKp3PbWAixnenw1rpQBYJwPBURP%2BIEC4LDtAbhMuLaK0nL5BcGFSCffL8mDvKSyPoxNU7%2BZbkej8QOPizdZZBpeYPFc5lYDKOR4JuD1FWGZEwVMZiMFD7b5%2BLnhFkh98O6Z8JYGgyqyTakDGoriQE63a%2FaBsJri%2FjY6yLqe2Pt3LDj02Jfcfd3JOKbiy%2FbaOgT3bx0WjZB50OltObIG0V%2BQHmNI6T5fQFxZrz9Upjyqk1peDHrCtEFyggZzBpoUEN64OJKKhYiWr7%2F2%2FXzJ7ITCZgoQlq0u26pxRsQJb6KpZPzAL6PTQ3FkJdWM969qfkapN6f87Qj3yCkj7i%2FkoQ0biDPoHhAZoNIxxJKQdyJD18Kf1UdGsdtWRlhswBundLbsLxQPwRJkGXuNxTs0F%2FNjstjTvTQhIN9rk3CaBUg3gsPlS214wDqK36picmllWw9oMrdyC%2BusHfdZdUXM9rmiix4hwDDM%2FrDNpk9urAkrfYiRuU8ax%2FWYEZbM8pWv26KZ%2BuphynIodMLE4rJmzdzT7hak7FfVMto%2BYSPOt%2FaXFrHvVZcGi0CIC3AsGd7%2B25SmopBjCBv9DPBjqkAVy1FFPVNaFh8wzP9HO%2FfnTPQ6Dxbr4tYCgUrlmdH4pALE1JHumhVjlrrLGvaLnNnfx6lOBnu4NVnhFQPjVkPZL2Yechjco9maDon%2BeipDtn5OLJDfpMIP4Ud2c6D24QTKnt0mBvnSpdDiWxGtScj7iFngNHfSqptZ%2B1W59ji%2B9B4nCSjQ98SKqmbmMqRIaJ%2FuJUVFnKRBzg7SM0r%2BrYmpi8b%2FZB&X-Amz-Signature=15bd48d81e39dfa95d1b7417dadd157f586ef085c327cd5075daeb00ec640a46&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466URXAAHIE%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041620Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQDyHMVbK9auozGdqhbQmDYuYdtbnuF9JaRb2K348Iia4gIhANSN0dFTC3G%2BLSY8Ni5SDi7AhQ6w6A%2Ba2Z8cM4UTVWVXKv8DCB0QABoMNjM3NDIzMTgzODA1IgyTlPdu7jdnR4TzXWYq3AMfdd%2BGG5YZRl84r9YEcirBIaYjnllgEu8Mc1F36AvN%2FZ94tLR7zrJuKp3PbWAixnenw1rpQBYJwPBURP%2BIEC4LDtAbhMuLaK0nL5BcGFSCffL8mDvKSyPoxNU7%2BZbkej8QOPizdZZBpeYPFc5lYDKOR4JuD1FWGZEwVMZiMFD7b5%2BLnhFkh98O6Z8JYGgyqyTakDGoriQE63a%2FaBsJri%2FjY6yLqe2Pt3LDj02Jfcfd3JOKbiy%2FbaOgT3bx0WjZB50OltObIG0V%2BQHmNI6T5fQFxZrz9Upjyqk1peDHrCtEFyggZzBpoUEN64OJKKhYiWr7%2F2%2FXzJ7ITCZgoQlq0u26pxRsQJb6KpZPzAL6PTQ3FkJdWM969qfkapN6f87Qj3yCkj7i%2FkoQ0biDPoHhAZoNIxxJKQdyJD18Kf1UdGsdtWRlhswBundLbsLxQPwRJkGXuNxTs0F%2FNjstjTvTQhIN9rk3CaBUg3gsPlS214wDqK36picmllWw9oMrdyC%2BusHfdZdUXM9rmiix4hwDDM%2FrDNpk9urAkrfYiRuU8ax%2FWYEZbM8pWv26KZ%2BuphynIodMLE4rJmzdzT7hak7FfVMto%2BYSPOt%2FaXFrHvVZcGi0CIC3AsGd7%2B25SmopBjCBv9DPBjqkAVy1FFPVNaFh8wzP9HO%2FfnTPQ6Dxbr4tYCgUrlmdH4pALE1JHumhVjlrrLGvaLnNnfx6lOBnu4NVnhFQPjVkPZL2Yechjco9maDon%2BeipDtn5OLJDfpMIP4Ud2c6D24QTKnt0mBvnSpdDiWxGtScj7iFngNHfSqptZ%2B1W59ji%2B9B4nCSjQ98SKqmbmMqRIaJ%2FuJUVFnKRBzg7SM0r%2BrYmpi8b%2FZB&X-Amz-Signature=23b8333d236bbde902c10371875d48d9e17c1b7bbc776614c5fd4873ab7ed987&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V5SDDHVN%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041632Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCID0emQ73d3Z%2BWJq9BMMNOede%2FsFQc%2F1i9NxS%2BenHXqXpAiEAubs7HC2hDENVhalath%2Fy0Q8bRefWBbeKn%2Fv1bZrvDAYq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDAfokjPkcp5Q01%2BDrSrcA7%2BK4TOY6pj%2FXWiCB%2FDEBoTA7PvzmWZlFlA%2B9uI0pWsJVzEf%2BtpH%2FM%2FVUIFiVL%2B7cN0AM4VufxvB21YgPZ04CUy8iGtt%2BvnsRG0V%2BgFe3kC7zY8f4y0DV5h81B5D274i%2Br1kMhrmwMnpHEdqwpXwFBSHhbcUNOGA0Eb36dCD9Xw1tmwGdGSIel82Kig5x0cACD5HAxmSMEhI5xurgDz6zdxsAOKqoQlAC2lUwj0MCqbgN%2B39GzUNo6sAVlj3C%2FRnQRsCxLspJI%2FGSLOSBFpjdrZIZuu2rflxvkhzeYMYC%2FTYxOOuGRM6PcGB1UFG3sGZYdL2aKz99qKfBy1dJG%2FaSyJT9Nbg8R3WpyFdLD3h8Q%2BgYZIZ%2Bxaq%2FzUCA7xSFYtTay%2F7zBl1wbFnfPTkK71fiqGOo1YKf2Jofjewx9vHFrQi5nF5unU%2F%2FWflMg7fL7vfFpvJLJTHxnX4zs9iqgFVbjvWkjg7IoSzVucsw%2BPF9NP%2FRDZKU1pLB8TPO%2BhBwGLSzKEheBfkVm6i9WHjDtUxR%2F3bcSC%2FG6woGy%2FWx4%2BOfyzgpaQ1gyvUzJWAtSDYGHhaOUIx6hwHtEqxYw6GCzMs0kCpX4GYXsczuZC4JmrGO%2FZNlfpFk0QBQ3oqmtAoMO%2B50M8GOqUB4HCpAGE9BymccNIj5MFRihdnkWGb%2BTUtd%2Bt6L%2B1tKtt64sIiw1wNnzrZzhM08kxknakv6R7Jz1VfmaejBN1F51%2BpJ%2FxaxHSLmREBbfmHXTFxxkcbEOc%2BCivD%2FipEo35DZW%2F%2FTKLl2uF6JgZdQqEXCFRFNWqJDD1r7v5nyB4JabfhsfP%2F10KaNP5LtMCL50P%2BGLE4i5hQv7XinF4jC0BYqmXJBKEH&X-Amz-Signature=d3e97f66a4414b9c8a7576854833e8e6663a00724c58ebe79e4a730dfc57b9be&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667QQP244Z%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041634Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIG2F1Z0BMorrdcWrmdJNASSriovUfqaNXcIKYhfyWVbkAiA818Yb4Bzry5f%2FqE%2Bgd2dYlttIWTzSBFrU%2B8I%2FH60LWCr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIM5tB4gYOB%2FWYSyIuPKtwDFVHXasSSjy6S1A0o0N2vTDcxr8vGAiLeU3ViWqTKyHTp9r2JhPPKXKDUdouLZxed1BE5v%2FUAlLqvSa4mizyT7iVGo%2FtDDKV2R0Y25mRfqa1pGZX7%2Fd3ojyZWj0KdQyOQVYhKBlQ8unpSXa3llgfmAVrU3%2BCCh2TMNCUgTiJQV4rOS0iFwO0ekIjVaMs3kyl4XkptTCXQXnEPYfxirc0xs3Asb0Q1GLPxbsXHETZBwCyCsUu9fsa9PpsFBFTe2yUkMr14Qj0RPVE02W%2Fg8RwPyp2MMzbPwchwFTdMgMuvuQLbfA5pRO%2B98I5hDyMwwGlLWhOJF17TsCf44HbjXWHdD0OpmFn8uSxoKpmHnJcXzk6zmf%2BkItO0eVykR%2BGjOUfpgsg56hnP7A97WpAb4z9KEywPG9eeJQ6AG7%2FQvSPBraWYvkR7KWgaK9HpZVV8wE99oKtrC0OaLEa%2BUQtSQuGrdjPShGqwpPJ%2BrYx3La0%2FHr%2FeHZdlQu2SOCtmKei0Zai6W8tYbX2JXyzmfKx68f7Ut962%2BMw3kaupsQMPK3EchyRSSmnNBfu9vzA%2BNfbwNHN7vmF35iT0E91qRUn6NEWBIqRIYSPi4oJGqOxvdkPsTaV4wreyGfhn4KvnEu0wg7nQzwY6pgHfdfyXxPtBY1DH3%2FMvPsV0QxoM6fLtUvX0st68yng94lMoueKK1PCsV8C1CuRRhoZtZ8ebt5Hi4VuelYcWHElN8GaM6GwirY8l0Qn0IHFeN0gCpbvfz4Svxk4XtZoVAUxOnQ5d16NInmKpKYyEJbOSsvw%2BO12YqoYDA3FlXicbpcI1Ts1s1Meg6KSY0i963KlZXiQ0myVjgmWxCzHpVYdmqHxPB6hL&X-Amz-Signature=cfa7943deeb7ec31a9fde8f626681b1d4635aa996bbdff1057a2d19b081b1241&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VU7PXICY%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041634Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQDUF1gfJdYpdqWLEc%2BLXxXkAf78g8wRB11wXFHRNw66RAIgPOUAjL7dRlCJbzcGWWXcZHvTmMtOMuLdg9LceKZfOdwq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDAnPc%2F%2B%2Fr8XV5CjygircAyRR4LJfWvoDMvScMGOyCjQCUdwiBvdp3x6SBgKzxivic414Dh999y5fJVqARwuYtIwfCfuz%2BVFPA1wJGtYdAEFzSj0TuhmluJl%2B782A9HuRx3tXK7I2QsMvESYr%2ByBMf74dj9PGAQhgVJYNDpZeMOpvNFWNXY%2FaZoGLVAmbW93qXNO7URCqkdkZ7D8O1hikyQ0dDGuWbREJYaXYTuqcETedv8Z8%2B8PNL39qt39py6D4VEL7ZRTVcHPktyxc12roK20jOzyQsAwTTXC%2FQm7QvFCQhtPd5B%2FCIXJW%2BbqWdmTvrIE%2Fnl3PVhYGyJFNwpuCKHRaxDP1zkSmMV6UwApfLKdNLJqiA1Stwa2OFrCpkOCC2xeTWEKhtihBDlQZxNTA3He6BRQW7VlWIddhZA2IoUOicdaBT2hAxhd2Bp5g6VKBDSmBL2hZY%2FepGsQ1ZKUXS3KQhYrxWWVaAoMppdT0yDlnjo3DS6wCGuw4kUZrFd05A0N5elJn7nSptfmBNhO089RnklI3g%2FNXbR9smYx2kS7hjN0lNibT64%2B2QtVBJbZFuah350BNqbG1LpitxqADwk2RXAqS8Cq5krvzA6Iy9MqzpGLE%2FUJkbzYvgJq0aW5KGst2Hnbnm3qJuOGJMK250M8GOqUBS1WNUy3A%2FCtokufFyB6h782cRtxK5MHhbGxdwLugGnkh8zX8%2BIBCIP8okI1IqEr%2Fq8GjgGKsXW8d79iH%2FGwqzWWhOqZGZdQlemaiZGiwKNNps6ZfjJB46eb0gtPNr7GPEt2wREYZFHhKQbxZvpt%2BsrfEd9oUNLxwfhLmiotxPgkv4VH%2BvecipwHk27KiRTPQtFyGuWjXS3FaLpEs1lFxG%2B0%2BP67B&X-Amz-Signature=7d7c6f64bf9253317c364dde1515be2fdd1a89bc88d10fc5fd30307dd38814de&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ORAUHO6%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041634Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQCNWT%2FklimLJKG%2FQ8Ba1uWt2In6ezfhq%2FJp9kOtiTEQTwIgZayg8CA3riQveM4IeFqza53qcimlKfSkRkBEwi1JqiYq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDFqKycnTCSP8nZleZircA35wrwX0f35qCmmhS1REG5FugMYf6tpHIWJNFrJAxBjFa7QNOnU7rsBR2kjl0OIPshqPRohKqY9Kaigfp4mq69R3%2BKZOs9%2FXR13dHDLdgeZyKobSPMeUEk22ZHmPfaaWwX4pH99X16pf8Ux6%2F0axCbLc4BLo0OJpqaNcspHrGqJ48lsUtbh9Ms59yx08k5F4Oc9f9DsWMeZ%2FVDGnfrf6LyCTU6rzPFVFX2wmNNZTLH%2BwFpcGIURYLWGMYFDdZuM1OxEYADjVk80XXT1FPItiiuzwVfJhu1OyLJKY4yLrGp15tKWWlBc%2FulT433NgQ1p1KqU0bxB8I2t2ygFv%2FPhjOfzEDFj%2Frs6nj9T6F%2FK8yDRL0DY%2FYWUH5AHKHRpcJiSwgd8SaW6%2FkUiiHajDi0jyeYD8dREQPFmJzoPUA78yN%2Fo%2BY7VjxFWqs%2BTFxJw19U8ck8ohJiUEyqaTF1C1kLKFFrOqzCD12UOoK6Piw%2BOGpATu%2BrQQ0hhwCfSeCNXpgn3Xeml%2FZJSXRTPM6RerlqcFRGiMzNxi8up70ryp%2FGUIrJ2CTdE0jCKPjB9aY%2BYDxcVGectl2bxiaFgjlmddvcMeoyGkb%2BQL3LIABHQcZiI0AoLpdS9PMWF%2FYYCgtpypMKa60M8GOqUBGC32tNXFc4rYN%2F7NdbFXYENc22lEv45gzXo6ERA7cYC%2FpYmUI2wHc23VZzVad8Fc%2FIPQ2NumbRjJFWaRTHtDJjD%2FoG92IhX0BvS%2FnY0HqZm9oR%2BrDU1YxHNg9QFeW1CavPCG0J1cRsYncr6ymcEkU5%2B0shWyq3%2BfMXuYRAWUuXCg5ng2lnEAUu0A0ImymYPzKecAfYB1Qpu0D2n1QbaobxemLEqn&X-Amz-Signature=6c9f714ccc6b2c80ea780671ca5294709f02f991016c6674499e754fedd434d7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666FRZL5HT%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041634Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQDOjhCRA4zOzQZ8UVTwRo%2BTU4iQ2OQMWpyQQtpJlTw%2BJgIgJvYGnDUEDHtuAKjvPbJmmkdLvSEu%2Fgp77gCZ5HxHEXQq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDOTyXJhKfEWGRpMbbSrcA%2F4jno7RB7IzANCrJltk80ttRVwq%2BsItfbItn5wL2SieooFmlTiedp5%2BpNT2GDbEdEcGqlzTKUmVhIXsy%2FFQ%2BeE3NTyPhX3KTBLsmwFeuenv%2BXYNHqiuDvmMH3c52LFFR0e%2F6RMqmTqwFVW0Pl8xECtQynrIc4LYOIVjwn4Ovq925EeBhNbSrgdekbyBfziJLiLw4aoDZ3qWZziINebCcl4BbTCGz%2Fghepx00EJOm7xYLXcjtED1tWjooM9sXHbYp452dzjYg%2B%2FyVlos2SzXQnjjZ5SnQmRu%2FeDJX1MTgSEZN%2B3Jjh34RMWF7L4j01FRdGQ5GazDyAAoQ2mBNY4WIrsP9%2FJy%2BBtcEf75kVEZgQzJCcfLW%2BiD%2FYdYlzmpIGQrC1Ve07VaF2qkSHbeKHa0ZD6pYkyPzSt5cWKhcSAievzxK8xB9rzw4HpKZGxd%2FBPFJpFVWAoSU4z4Ct%2BD9wxCI69OG0w%2ByfVF7NhOtcsApNlXERbIwtvzZM%2F%2FQtH8fbCnKBeZtmvOJAbQ1aBfQL22HFoTB%2Bh%2B74ub1kw998n6Q0lbsJlqCaOsdcmOatEd%2FCYhojldOfPcbj38ztinALfEKTiTPguzWI2ierJLpwYWELdzlumQvVCPIBpBj5kBMOO60M8GOqUBBd9dFJ6oceoukzZbuWN%2BGRoWy3xfvZ9uM4iWjArRdcCMwe%2BfL7%2FOGs6OiA6150Kg8z44q4Or%2FKO2v4d4ZTjQkkmkUXVav0efQpkwHA5L048tGfGQwPXhFitcXh1CyzTocRXJcbjLOmhac7vinLmWxYOxnaFXbikxgtfTYd5kdVLztDBS%2BKdprfCkkC5V6P2qGv4nkqvNTDsNifIsHrhHFVdMpj%2Ft&X-Amz-Signature=f70748bc4e363143039fd5f33f1c5af2ddfe912db2317630a48cc7eae9d45a27&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466URXAAHIE%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041620Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQDyHMVbK9auozGdqhbQmDYuYdtbnuF9JaRb2K348Iia4gIhANSN0dFTC3G%2BLSY8Ni5SDi7AhQ6w6A%2Ba2Z8cM4UTVWVXKv8DCB0QABoMNjM3NDIzMTgzODA1IgyTlPdu7jdnR4TzXWYq3AMfdd%2BGG5YZRl84r9YEcirBIaYjnllgEu8Mc1F36AvN%2FZ94tLR7zrJuKp3PbWAixnenw1rpQBYJwPBURP%2BIEC4LDtAbhMuLaK0nL5BcGFSCffL8mDvKSyPoxNU7%2BZbkej8QOPizdZZBpeYPFc5lYDKOR4JuD1FWGZEwVMZiMFD7b5%2BLnhFkh98O6Z8JYGgyqyTakDGoriQE63a%2FaBsJri%2FjY6yLqe2Pt3LDj02Jfcfd3JOKbiy%2FbaOgT3bx0WjZB50OltObIG0V%2BQHmNI6T5fQFxZrz9Upjyqk1peDHrCtEFyggZzBpoUEN64OJKKhYiWr7%2F2%2FXzJ7ITCZgoQlq0u26pxRsQJb6KpZPzAL6PTQ3FkJdWM969qfkapN6f87Qj3yCkj7i%2FkoQ0biDPoHhAZoNIxxJKQdyJD18Kf1UdGsdtWRlhswBundLbsLxQPwRJkGXuNxTs0F%2FNjstjTvTQhIN9rk3CaBUg3gsPlS214wDqK36picmllWw9oMrdyC%2BusHfdZdUXM9rmiix4hwDDM%2FrDNpk9urAkrfYiRuU8ax%2FWYEZbM8pWv26KZ%2BuphynIodMLE4rJmzdzT7hak7FfVMto%2BYSPOt%2FaXFrHvVZcGi0CIC3AsGd7%2B25SmopBjCBv9DPBjqkAVy1FFPVNaFh8wzP9HO%2FfnTPQ6Dxbr4tYCgUrlmdH4pALE1JHumhVjlrrLGvaLnNnfx6lOBnu4NVnhFQPjVkPZL2Yechjco9maDon%2BeipDtn5OLJDfpMIP4Ud2c6D24QTKnt0mBvnSpdDiWxGtScj7iFngNHfSqptZ%2B1W59ji%2B9B4nCSjQ98SKqmbmMqRIaJ%2FuJUVFnKRBzg7SM0r%2BrYmpi8b%2FZB&X-Amz-Signature=371a660f8728a3dcbb08b44c9e1bb864aa87efdbb0269b1bd4226fb19d372c73&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
