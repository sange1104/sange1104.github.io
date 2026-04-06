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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UHXFKKQV%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T034309Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDO8ifKNwdl%2Ft7%2F0pRZP6rlzihF7CPLnBGjA53yg1Vt4gIgNOgjyAcC5y%2Fmozp2G7tYgmS0pzm15xmV7pju5kO31cAqiAQIw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBSmBudgjkEnd9j0ICrcAz6jx8HSyWn7fwh21mg6ZQwTK3Bda2olgnYdvN0gBUCRIckygaJRt6gj2mi9sYwAx8pmKp49LLfo9RSObo6c591PAHESpZbgvB5YEvlkofCBuoInKNNvesl6IN25D9G8efpitN3YoLy4A8S8vYmkArXwnkwnMVgeBzBYPwrzrkWPBKAwBeRu5Eic5EDYdppXd7mPXUn28mu%2BN2qZnBNU5Wroeo3Y3KrW6EiO6xKaFfoM%2FKoiIAIM6VGcLWC%2FGsPSpz6t%2BHgF57Rm9VcpVVZr28H7qpsLodwhifw%2FtA1jXfwqJOokVm3rSMK6IjB1J9isdWoowP%2FPccgbroaInmJ9AV8aGS6ckv%2FXo5YhqVf5JvFp6sjBbIWUlzMsvptwPXheHBgQx6VloPenTpBuY%2Fj%2BiQJQ8%2BgmIhR3QBjR346kF4J2WsQWbfqx15ozv6yThSKaQvfih5a%2FcXmvoqAnIxH8JgmRp9oqspuNRi2IiXmmM1k1P65FekcDm3qrxnIwFcyds47VSKMV16f7G2L5ey%2FoCtIW%2BwMqF6dKH6OSFzcrVeCQoFy2C4dXQvatmZ8f2n61NSK1hiZttBAOV7BNY5NtS6Ckekj2hbyyzR8tayBQHI8uqx6sEdvZ7t0fNKaxMPOxzM4GOqUB71q9QrTBM0s%2BR2SBxQ7%2FRjtLoUbuu%2BaK3FthPMqj9gLMLOu%2FgCJeeOQjHCP3l17b%2F%2BEONclgwOefjhdmSMaUb6YstqAI5Vi8LUX2HnOQEHzaHdWQe0CWXYHbeJSMSzU7uNY8PWvimqh7a2i3%2B6RXvuH8447dwZ3LN6SUaK7NpjBZov4CD%2BzQCIQGGwNDmnR7jdhcxbW46L1A1SbYdOVqX79YrL3s&X-Amz-Signature=a2d9b8a9a5ed9532a7dedd1c11d8dfdb68152510bd202cffb11ab7a6b201a5c9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XFDOTUU5%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T034310Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIElgo98BfZcab88gDT01Zl0h7g85pRvYCiTdXQTxSz94AiEApUm3RxwejMgInHYSeB9vxm0%2BMvU2cow3jKWo1fAAZg4qiAQIw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHjoRe%2B4OeEkhomDDyrcAwa1K%2BtPJ8iudNo4VPeDK4v7Y1gprmZ8U7Oyj7ygbXGKejW9WjGzmCMhswog4W3bbBs0YQK1AgpXjE5GowHAoFQ0xgxzi9ELZmHzNXX60AjSR63uDr%2F0hro%2B5smK3tYLFUPJ6dY9IMnSwR49y0jwMSshjwliYi8t3AmYdyBxRhACB0L95e5g8i1jyFvfzUe5xgSe8Clob5Esid3lnobZFMDj3J6xMHukGijX8X2Uo1M3SIRdUejSs3biVSRE2AY6USrajYHhREdNhbURccnYcxySSHJv05rxaqo4hWfTGrAJFT%2BZxUP8SvOlWrsU%2BJbxk2h%2Fhplmmyk9kjq75C%2FF0vWbZ%2FfZ%2BXkZkeWlUDWPslPLagEKPtq%2BjqhOUrESH6%2B%2BhY6rV9enxKSK2uZoHX%2B%2FzqLEa8%2F%2F9jk6%2BotnlNlOUugshTAJc6aMB3ZWc1VO0nzQ0cNUenohMauluum1FCFIrZdikQiqCxXkaaq%2BG5H5IgA4mRPdUwqZOqLVmIetY4XCsAoWrpoVAuxl9yqUEYPjPWkhZRv4JISv4mXIdlhilIzHpxQ8dyy6dN%2Bdh0bcbXrSoFFVwyP%2BY%2FhoX%2BEufZIP0cYcTHtOlTnA%2BSkE0DqSyozA46N5tK9P9Db0RTBbMPiwzM4GOqUB%2Fu9t%2BL9gZo1HMc%2Bg0JCwpl0nKrCByaaYeZaDOXPkf2%2F77lUdB6F4brYftThJC7oNI5hrB54Av5WCP0fpFWLQ87JYl3%2F%2BQjosRhGrbaDg8FHj6ObiP%2FAO7uOyRxIcea%2FF4Jnvh3YtBQjuRFR1CyvewxdWrMONCx2Lpy3xlxQBVRURIJ13vnWT19PxbcNYqMfkpLENG4JQEdOngcmCd5eFQo5eFlKi&X-Amz-Signature=db4e3b8e820e7c9e3db6b6973ba987315e2ea7768d98d1fe358c3ecc94f60e91&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46657OZ76XV%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T034302Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCoLaS0pxrKzzn8aVTaVCkT21c2iaHBw4c4Xo%2FuC5WIdAIhAO7Vj4golBpZFfvdx%2Fbl12iAOV3U1XYZawucCdnRCZY8KogECMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igwoikq4l5WH6lkBUUwq3APfFWK8ahfOMort%2FCVjS8p%2BnOSaM0TN7VZpAUAj9OpW39i4MXeXdijvSCb91e3TfKMWAJmAvrwykKWLJ2zeHQ%2FQs1F7N464ZG1dLcsP%2BJ%2Bw2gYEul%2FYDXdbGPzJSwQ3vwCt6DgeI8%2BK7YUOHlfKxIu6CH9p%2BqkzczImp0oQxBFTwvPZrPqHZmqkaacAo0eoze6VetbiWwrBx3di7kEQJAJZbJ4ar%2BVwQoUTfAYGqPY%2FHg1zF3DFqCotP3Q0pHFIOpDGw58M%2BsGOyYG4yK9GGUfcpGrZnscEINainUdy%2BNbxxPKg85y4GjXiewjx%2BxgRIh4aV%2BO7R20PjQ4P7l6%2BQ7%2F2qsUA55Lj1NHs3s%2BN2Jz6SqJcwwAELW7qaPox%2FjU1oCFupIzs2qAypvVIgev7AfYGHcWzuN804EKmlOFSb3JbyW1hPxhSAd%2FtkLPCTCYYFe8QjkbLN9eo1dCMehLEDbDVNnAPc%2FXUAXNG48DYPX1vDsthB9LFkVbRVILLs0oISmGp%2FuN7MaEe9TFtxy0qO7ornEthhM%2FA6a6EQCfPAI%2FX6QVCzhcN1l%2FgZXvhGqU0COr8TjN7gK0cowGSQOT0fl6jkxUZaaUK9ehzm0jvAZHqFZCvuqf1yrV58aUjYDDksMzOBjqkAVF06cH2actM73r8G%2Bw%2FOKXvpDiJCgSN8sT9Y4AkEMJOGZf7gPF90cQNRVH1ktIiK6a%2FwXbuQK2HX95oKB2o4eBJQx9utErEx0mzoFHQQZh20%2BtW%2FiPgWJMXzldoymMs0Mk6BHPH0wZxfYMNBxCOPC7gU7B4hiXoY2jzdm38e6HccnhEQ1ZRCOzkhBKYs692fNRaeQJG7s%2FG5Cd4XOO04tYN616Y&X-Amz-Signature=500f75442639b9a6633f465fa23d2f21af8aed113977a72be332be74325efe83&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46657OZ76XV%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T034302Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCoLaS0pxrKzzn8aVTaVCkT21c2iaHBw4c4Xo%2FuC5WIdAIhAO7Vj4golBpZFfvdx%2Fbl12iAOV3U1XYZawucCdnRCZY8KogECMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igwoikq4l5WH6lkBUUwq3APfFWK8ahfOMort%2FCVjS8p%2BnOSaM0TN7VZpAUAj9OpW39i4MXeXdijvSCb91e3TfKMWAJmAvrwykKWLJ2zeHQ%2FQs1F7N464ZG1dLcsP%2BJ%2Bw2gYEul%2FYDXdbGPzJSwQ3vwCt6DgeI8%2BK7YUOHlfKxIu6CH9p%2BqkzczImp0oQxBFTwvPZrPqHZmqkaacAo0eoze6VetbiWwrBx3di7kEQJAJZbJ4ar%2BVwQoUTfAYGqPY%2FHg1zF3DFqCotP3Q0pHFIOpDGw58M%2BsGOyYG4yK9GGUfcpGrZnscEINainUdy%2BNbxxPKg85y4GjXiewjx%2BxgRIh4aV%2BO7R20PjQ4P7l6%2BQ7%2F2qsUA55Lj1NHs3s%2BN2Jz6SqJcwwAELW7qaPox%2FjU1oCFupIzs2qAypvVIgev7AfYGHcWzuN804EKmlOFSb3JbyW1hPxhSAd%2FtkLPCTCYYFe8QjkbLN9eo1dCMehLEDbDVNnAPc%2FXUAXNG48DYPX1vDsthB9LFkVbRVILLs0oISmGp%2FuN7MaEe9TFtxy0qO7ornEthhM%2FA6a6EQCfPAI%2FX6QVCzhcN1l%2FgZXvhGqU0COr8TjN7gK0cowGSQOT0fl6jkxUZaaUK9ehzm0jvAZHqFZCvuqf1yrV58aUjYDDksMzOBjqkAVF06cH2actM73r8G%2Bw%2FOKXvpDiJCgSN8sT9Y4AkEMJOGZf7gPF90cQNRVH1ktIiK6a%2FwXbuQK2HX95oKB2o4eBJQx9utErEx0mzoFHQQZh20%2BtW%2FiPgWJMXzldoymMs0Mk6BHPH0wZxfYMNBxCOPC7gU7B4hiXoY2jzdm38e6HccnhEQ1ZRCOzkhBKYs692fNRaeQJG7s%2FG5Cd4XOO04tYN616Y&X-Amz-Signature=9b4c22ee0a33e34052885e8913478666cb4537a14500b03f6471dfccf11cff9d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YF4BLJA4%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T034317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDBwEHE4lWlsIgRWgRAWRo8vXkdHHhRm32xz8VUWZg3MAIhAO0yMgB90KeXluF3TadGbOzySaHRaLN9K23%2BorHIpXISKogECMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy%2FdVne5vJB4N6Ih8Uq3AOsfnisBrOoqr3d4ZxSeKZW24frqvmUmIe7hESaMuWAV%2Be2jwDkhDQkcX7%2Ftbd3U%2Bkxji9uIawrihwTlKF4vjDqekabU81Al3qdErAiI7d%2B3Cz63tK1EIAv4kkfQDN6YUIE6tDtju36rEsK6PPi9F8xK0IMXtGgQEDpFWkSLl47Qzi%2B5kBLSZLRogEoPVlz4fWs0Wog9eutqzJKCT9jGFKCRkdXSEybCBkKM7WhJfAqLP%2FjJbpSQskOH6%2Bl4CR%2F2BE%2FA4inEHT8CFG7Je1mYr3C6Fw76ACcmM9enyqja4iBHzJ7PiWSz6s5r4bDH2oVXan%2BgeCJWCaE4n96%2FaalSPdmDPbpt3ES1iwl1bAut1kEQCRZvLI2hZHX5%2FkK0pI3NURtKMpz7D1P9mkoW9VW5EqS2EPhcrWwYawK62Jl36%2BQUGdWvRc6%2Fpsm06DTO7bonFZw0unU8%2FnYTBm1NK%2BQd0kkE0BTsvgyGyeAKbZDeRTimuMeI0PEBIhTnbT32FkQ7QJmqRTb5PjKEGjyx9Ar6T%2BA%2FVecu852sVSSjm%2FMBXlW004snWndl%2FGgdibH%2BOoPiKG9TTLM%2BCuq06xoMKNxh%2FmvRWfgI9eGSaKtcYHDBfJ9GhvKdB6QxyRjrEFQTjDHr8zOBjqkAaaBAmleqXqx7dBQJdQEg31iDA8x3%2BbHNbckPICgsRPe0IgX6qukFULwhKrbkB2T6mVXqUdauG9iZe0mp2HFUyaPk5gKSl3JIlbkHuOKdCL5SdV8GGvMq7NvRNc6DWtoeVBisiREyiX12ASEkJZs4j4wiVcXekFsYqubun3rkRnsdZ8YfdLUqsYL65OPGfUOsIm1lUToYVqOfCn3h%2BKOcSk6U33X&X-Amz-Signature=0a82e7897891c9afca3b8181bcc78e5b0d2befb585dbda6510b45f7aff63502d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R5CHKSWM%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T034322Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCpfQr2UgskdSL45NErGeuKWr518bK4CBvubTZQePhm7wIhAPGsI6jFmqH6kxDiHLd%2Fw5PCKzHn5v72DNFABo%2FjP79SKogECMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzXK%2B0%2BFwWN2epgoZ8q3APQI0cohchsvSkKhnqSxazxSehQKcJxqPLElT2LwsTK470Y5Nz7DwN4JZT%2BT%2BVpCvQh%2BVrUe0FLICOjY6KamGOxTl9tYBCZyOWTQS%2BML7jBC92QkYXIwRtHrDgZQ92AlX%2FumwnHQIVDaduN%2FZuCOxub0cdn85%2F1uVfx2qTaQvMHtGrkoN0PUy3H4WezCfJddk9z4CQRWBnyy0h0vsEUcEoIMjDuDo%2BDlj%2FbELd1ge%2FFCM9JXa1ZVhjiUXMlGCzgmj0cXsoVP7oIIOBmNxoFJCtrDZbLKUbBZolW6n7VySvxgcU%2F%2F21m9dlgXKvCKFzl37Mj%2BeRBbr1DgrZSQaja8ohvcsmU8sDGPEx%2BwoLD56G%2F%2FTemy8Zkds9Dv9PPujVym9uyaLXFRR2K0Qtc5guRn1X7gYD3a126VRcafBhCDnwpJShOKdR%2BLYeVormA9yhSWvESG3Ih%2BaLfLj6T640pcrhkjsNAuiSSpGl7Hmytrg4nmpmYk67vZhH7WnxNTziUyE7BnSFH4ZO3oTmcO4gpOvGsztSgGF44lFIqH6KO0%2BDoLGSv1ucpfIhnV9Lzs3jBDYW2Fo8lZ4rV%2FmSqtyresPHwoOPfJO3qtwzpdxgX%2BWQ8okmZ8I2mnPnZIaxgNTCcsszOBjqkATWzXxEWTY%2BfwfI2fk%2F2TacI7YlGVOf3VtheyTg78UVt7Nok5WH9yToFxxv%2Ftn%2F4HW1s3WUfFw5PJQDIGklCPf%2B3sos8tS%2FnDQXd%2Fd197KSX0GxLXtg%2BzxdRCFTvTrOYdB%2Fd2lSPHirsovvbvL6gmh696GIeEUn7BogVkjOE00a71zS9r%2FX6LMzRnTGF3CWi%2B4HO4%2F31wz7vB2JowVQ7lt2oupG4&X-Amz-Signature=cde2746907a18016002ea8a0f7a25f18b091db2d77a72a617472dcca4210d454&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466USGX7A72%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T034323Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD4OWZ8io%2FkShoTpuIcnt%2FZqVghVjfFTmXNA8HuBQYxMgIgIZRKfyKQmcUKiDtOI%2BoxszQPVjXci%2BFx7m18axsuugoqiAQIw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDL3stinRAoSB6NVV1SrcA%2FXyXK%2BvxzqZtmYC0o3Ggr6rCfOAOe%2FOfl33FtPjKB%2F3ng9HNcSPlZhRyB6%2FDWfI0Xbr4UVCCudxPHwinUhHpjwTfqtKi8rwKT%2Fj1Q%2BuVGqWGdk50cCEAmh2kjzDtNRqO2u1tD2FM2oS%2BuFhhbH7qE6Kr3esjDcT%2B0gCVRg01kcgB1vUii2EMSj3AUyhyFNTRfbz3LaLuCvbhxa%2Bc%2BhqPzlh%2F6scZeAFXXJ%2BFZns3p5tcyTBWXE2iz88DPMJNypvGhjZt4sGj8dA0e5rztvw3vWUqoDDYCy2wbUHj26CYCRz8tED9tAVw%2BbCpQPXsMb3tbP3aRFCGOa28B6NhKQDcBIigXN2rxRyKQrp24hAcjP%2Bs5ye9wRoKOihz3lXul0N%2FpnzL2Jhr%2B43hX%2FAVAVMugEyAoJKO78zyEHF9x1%2BbbjdxTkUA%2FYcMTW%2FRXRHM7Fve0NktHDnXQGvSzGToGWEucoPt2BQ7AbfTqS74MvTlC25LgSqc4eepJTmFr6vr4nO7v6nm%2BU3MlnuRMBGdgI3PaHTDY3Gv0%2BRstbL%2BPQ%2FyRtfBKh8orSujZWqrwnDPsE%2Bk8PWZYPOSEwuoq5qc73WtujRl0K6dY2DpA2eefMXqZ7fqmriQLyfjN5uYqcgMICyzM4GOqUB4RnN8wo63Py0R7WqdYheI%2FPhCPGkFClqJMhonuVdWt4%2B7nwLuAyt7aqd5L%2FSOU3bqctN5PBCV35OoSnzURDuIg2xVEsSIo1aL9g3IxsNZAnNoaY0ztdwHJrdkQmLGIpZnruBf74SRGD%2Fb%2FgiBUDGBieY1V%2FHiqMNtXeKswhg60mdFJXVGqXzUWae0Oc5fUj8D3Se3acnuD3Bjb%2BdDLkURmk611CM&X-Amz-Signature=680f6a99f3c72b64b7ca01915efb1e9521d8e4ba7c9b11a8bb5bad142106a9da&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T532TULI%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T034323Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD1Pe3wrl50u75guBQpVvV7tXOw2sK5CsCYX4jr99AqHgIhAMq53KpFy2735FKQOw5BFBR5t2%2BO20%2F8YuCYX2hmSQRFKogECMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxGlWnvep257%2BqsGyYq3AOwS07bq7GXGIY3nmQsRWmBOdX%2FfaF74e7xdO1PKF3EY46ngVrj6MFRvnIS4WbZ3njnPzrgJWG2EPGCqgFhket5PSDCGsYZN7MBFOH9V0S4RAJrbE1nhnK%2B02c7t3CrJorRGTwzBH4Nk8EFKLNtCPuVYVSMLiTJmfXYgctWWiSPYxuypZi9k9HWcc4z9nbFeWOon7dxKtTuYgIo4rHgetWsW%2B8%2F2ycW3%2FV7tQ9um%2BhgdgvAZOnSS82sj3ujguZvAPR37Vg%2Bsi48OrIZlEhG6hlFC7JkiEofAC7UslTWTQR32SFQEcdo3OPfLvkI8GTlqHGdhgjE84c%2FM2K5RMI1ti6HAZVJZgiX4fwthNbWiDXmqaqaNHmib1FEFUOCyub%2FGeUIdVIBGSmGZwPx%2FaHt2oSrCutSD2oeHIBWyVeLv1Q3A8LvdiTyHVUiJjQTBrXdWvpovcwrUkOm3N9oc%2FmgXiGP8le81XuJhRxIKwuOimaUlgkyXV6mHIiBXzBSW4SS5giHhcLQ4Sx6lO1i95JbGs6ydiZBCFi%2Bq19iK0WBBLk73Y1T0%2B2LNBMadybrkbpRuvfecgB%2BB7RNRt8Sgh%2BjnLZ%2BiEyYKhZdPJl7uJOtdbsN8z5DUSfhf%2Fq8kOlzmzDQsczOBjqkAX%2FexznD9NEahJYommkNgXVsOn7yJeL3puM26SSAlNhQB6C9OIfavcuEGrkVFU4LXbdum3Nghm4zivy1jmmwxGr6b9gmu8c4a4oLQTug%2F%2FzQ6HZqHeYDbDPQPrKCLWSGUxKktq5osu3GI%2F%2F4h3wOeff0LriNqNzliJ5Et8LkHiAQqWvJIo61VUvlrS9dNzr1eApIYCXH8gqH1SnIyCiTXyScRvF2&X-Amz-Signature=8a4c28d307e75bfa64778d47dda02278b42d0dad76ba50cbf2cb5662cbe5840d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YM2OGQE7%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T034324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQyqdsxCOyMMedV3%2FA1h%2F85KBc1e0Ii1ddnOsBSmT2eQIgO25deicGjGpNrbfHNgaF1dbbMHVwtfLY6VV9i61T7Z0qiAQIw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF0sgif3%2BMWGdrQe3CrcAybUrRyNsP1pPN7AQ0tRnZcquQe3f12Nysqg2InocNOnxoal0xLfoOZMC%2FDGMt%2BF8eY5wH92%2FyhOlEyHMmUglpSR4v3q1Ke7VRV7OhhFNzgA4xQRanKFO9eMXelqkAn00j6aMw4j6EbjgBZwQvdbUBbkFDUDqtl33dyvSvBMYi6HmdCFt4Hxg%2Bg1RdX%2BsQ5042tK5xD91KN6OOVdqoHiMCm3ReVv6VOkYuGhD4VY0%2FS1GyFD5eV5Q2JeJ9L1AqM7b3NB6r4pvpwzVldnZdia%2BQXmpN9KRHw1KteG08A8DMjIGDXd5xgro%2FmfOq1kpiTzSeIgS7DsJlnLft4EabU305qyGBYqgt20qHcxWSmY%2Fe1FRFYgZvhh%2Fqx7FrxhltvmU7MgKTZcmNErj0euupy2mQvwwf8iW22bGdAWc%2FBW7jPcaaWUmbgrO6%2Fw68kQx9AxA9zKABn2cUweIGEuhB39Jw2NmrlaODus87Va1BxSTwa96ZDPlRySloAkROcBNWdPZvW1z%2F73h9nWbMIM3lWDZAsJw5Db%2BzpLGoS%2BNqaZ21lWMrohiwvJ7GMWV7TMFc2aqWTt3Bs%2BT7BHfUYQHIamGP1ItnVZAPS2ZsMsFFGLC%2FQVrJNoZh%2F1jilKnqDMMPywzM4GOqUBOVy76QPV%2F59MMIcRZdSdGyIpqv%2BQdTW8FlzNrD602h6mbL0Q1Mcz%2BWxPZ0fZmqpYbPXYpuMY3fyU3VVU8RRNi8cEVUyZh5qYdtkS1ObxPCwkpT%2FV2dM8K2T1TThPTS7CBk6G2PMOdU6ep2rybmg%2F%2FSzrpmAvtQcCQrIObrCkRJ5%2Bf57hHnPTH0Oty2ekL64rHfbiWfnADKYmXnNLiiM%2Bm3TdEf9u&X-Amz-Signature=d6bcd8215521d98fda3489d019f4b102f93f4e988170f2d4f9a414cf6a3d9c8b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46657OZ76XV%2F20260406%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260406T034302Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCoLaS0pxrKzzn8aVTaVCkT21c2iaHBw4c4Xo%2FuC5WIdAIhAO7Vj4golBpZFfvdx%2Fbl12iAOV3U1XYZawucCdnRCZY8KogECMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igwoikq4l5WH6lkBUUwq3APfFWK8ahfOMort%2FCVjS8p%2BnOSaM0TN7VZpAUAj9OpW39i4MXeXdijvSCb91e3TfKMWAJmAvrwykKWLJ2zeHQ%2FQs1F7N464ZG1dLcsP%2BJ%2Bw2gYEul%2FYDXdbGPzJSwQ3vwCt6DgeI8%2BK7YUOHlfKxIu6CH9p%2BqkzczImp0oQxBFTwvPZrPqHZmqkaacAo0eoze6VetbiWwrBx3di7kEQJAJZbJ4ar%2BVwQoUTfAYGqPY%2FHg1zF3DFqCotP3Q0pHFIOpDGw58M%2BsGOyYG4yK9GGUfcpGrZnscEINainUdy%2BNbxxPKg85y4GjXiewjx%2BxgRIh4aV%2BO7R20PjQ4P7l6%2BQ7%2F2qsUA55Lj1NHs3s%2BN2Jz6SqJcwwAELW7qaPox%2FjU1oCFupIzs2qAypvVIgev7AfYGHcWzuN804EKmlOFSb3JbyW1hPxhSAd%2FtkLPCTCYYFe8QjkbLN9eo1dCMehLEDbDVNnAPc%2FXUAXNG48DYPX1vDsthB9LFkVbRVILLs0oISmGp%2FuN7MaEe9TFtxy0qO7ornEthhM%2FA6a6EQCfPAI%2FX6QVCzhcN1l%2FgZXvhGqU0COr8TjN7gK0cowGSQOT0fl6jkxUZaaUK9ehzm0jvAZHqFZCvuqf1yrV58aUjYDDksMzOBjqkAVF06cH2actM73r8G%2Bw%2FOKXvpDiJCgSN8sT9Y4AkEMJOGZf7gPF90cQNRVH1ktIiK6a%2FwXbuQK2HX95oKB2o4eBJQx9utErEx0mzoFHQQZh20%2BtW%2FiPgWJMXzldoymMs0Mk6BHPH0wZxfYMNBxCOPC7gU7B4hiXoY2jzdm38e6HccnhEQ1ZRCOzkhBKYs692fNRaeQJG7s%2FG5Cd4XOO04tYN616Y&X-Amz-Signature=0e935efe3095c8e75d9804cf3e2ab5c17371b44dfbb4975eef3d35f31ad66ab8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
