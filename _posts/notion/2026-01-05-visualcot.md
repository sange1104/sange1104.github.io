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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UVKDAMYJ%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040708Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQCy1yO7waVibH9RXfy5AVKuxHQU2Zw7%2Fsu6wHtRi3meRgIgQ7FMR6TBG2vBH8MvdmvUglYnzEgeJb%2FZaZ9f9wQ1g38q%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDG8syc20XIAgrjCWlCrcA8hJLMetfqlb6NvbM5B%2FC22DUVLI96LRmJ5Uk%2Bhs8hV8gce4hWoR7cv52r%2FfiLdRUOK54x6zFXNKxpEKPn0Y4pmh1xBZ2bv7lB%2B9FgZG2PgQG3b2QKbS9ajY82lW%2FDPo%2FvcY4lmEqohp2O%2Fvj78qw5cKW6gCIsGXANTNRQ2q0XN9Sja4nH0d0nbYzTeUp51VBGAT1pODKZj4U1cPainlED9BbGcAVAwW2zeG%2FTMtrK5m1jXMstJLIiTH%2Fz2IhLJMMYaYFvRQwEvea4pv5dXWliulDA2jATsAH62tDsTW2nRWvzoK1%2BN7oJJtnMqsmQFQyTvDYn8dD76tBs6Xm8mjNFJtkkSAZZjbIoAGOfqS1pp8ntzCSDdu67r8E0swfMH9RCplf7FrWfU3UioOaURrQzcO5Mxjr%2BcQqIt0F4FdkAgIXetYJS4MzB7otFVhImIU3CDod9u6mX467O3vZ7RLuWyNTGRACaBMwMy9ZpLOFVLASkXgduqJ3uC%2FPoZhfEv09y2JsQVBDRg1WoG%2BBUppIRSQGSAbkaEcnd26tUMCcLvdxQQEm9AjWkB3fo67pIZLXTOGTaUAOLchJCEg8rZd%2Bco2q5QEr8kjsO9d7oG1Hz2Om9wAtDIRh9t%2F%2B56NMPihitAGOqUBv%2BM%2BJxFOySEHtcKTgojhMMFYEEOREb4lp5kwOAcN6Po3O%2FaoBKaPM%2B%2Fo0krhrZCJ%2BgcEyA%2BkaFkQJDgJOATb9nRm3SuyAevvqOATk7CNFfQXwyMhLOjw6lNyyt6SamTmzA%2BS%2FuUAUq44cvi%2BQgYzb3Qaz0f9DtDFcV1jhSVjdyCfiXBsq5RJwBNCJGuR%2Fjy0Y6rvbx7WhLfwEm4%2Bdkqp8Z5Nyt60&X-Amz-Signature=80db4a42c3ef89afb026070615998acceff28c27d700cb01ab3372acf839aa8f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663EDT5YAG%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040709Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCICWOBXlgNRpVmVliLlsDdevLaicQaSJUQitlQTCTuDXhAiEAt73wN5gjBAx1XpNRidarYJ%2FrJXkd2J6kCzNaKa6YKtwq%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDG%2BrKEz15q0v0Em5xCrcA5skPIeKm%2BaT8Ch4Qs3fejuUHOypERana1QetEp4Cgd20frFonD5RL8Blcjl9%2F66df6dlX%2BY2QwM%2FM72H1sECCc3JY%2F54%2BL1pWhMOk%2BOY6dLF3cQ%2FLbq0GDmQMYx%2B7BS3wGamNC8i%2B%2FjVkGoNTlNJy4Ii0v310oCjTpLsHhAdKqpo6g2vMDDPWOJ2pyQ7WAD9TC4uU9sYB%2FbcHfKhrN4QiJ%2FWm92W%2F4f%2B0hPcwOcMSjpv7V5JJPfyW1pUSNbE5upjaAhwxtZ8TfeGE9kj5VS0ruAT%2FXqGxJeG3x55F4Xdc28dcoam1GJo50Vk98WgdAxKA4lG%2BqneBQYBtiU5AJtuzYzN2WBOZFycXifciirZSMCsGTcVX1HMorvSkNPkqmsy6VU1azwEutRrb%2F2nHVZDZlJz%2FB2GXmo1JUqztUqodFPg8ECC83CLZodR%2FmAnizkdoqpxxfBjp%2B3KB4qeB6F5e9V9bhx3UKIF59R6ulIuiHMlXyghsIXyuqiDBWr3LfQGApq4IyW9DLELjpNqNzUaIl8vqJTgPk3sLUX4qq9msMs0dPE0vUyZn9mXfwAasgp0YIO3OWtnKeTmVeNLqKISDD3dm04tZRhTkQuk23czwtMu37EDi44zHS78Wu6MOaditAGOqUBmyltqciW%2BGKUFHd2NEtIiWUyMUfjOJ5E6XY0N8Eywind4GGZu4CdqHg0ED3NdJvQypCpRApK6%2Bd59lFO%2BkrqFbbOykH97BgebzzKEbIxxmUoJva5x2emTbaBJYS%2Fyuip4vsOLafZVXpR0vt54Fjf6CVRCwfSfmukP6UCsHMx6b5IyG9umLJgd8aeQ%2FEXzr%2F%2BoWxYPesf59Ytszi5itnFYNKG%2BSl%2B&X-Amz-Signature=113ae3cd3e3989cec5b459dce0d3183689818fac9f588bb76176710ffce48c90&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JETNRM5%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040700Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIBJyi8Q0LDPxORK7VU3%2Fq38cfD7W1%2BpCiI%2F0YZmV8qZNAiEAk7c4U%2BqVF1RrmKvqCBrDBHhI2trKxHNT5YzAPaVwtNsq%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDMvlU521PvX6zUm9NCrcA72flTczv0snHHqRrxH5Y85bI0OkiYi7eJ3qcutUns3x1lqHJrTwwYuaFr96kFNYH1AVWSCdcDpfjmDb3dAG9v2oeaAZciwm%2BwqRCy2LZlNMrjjSkYf2oMS8h93T5IHerNeZ1phGoueFihMAItWeXL%2FF7WnB24xHbocGDtfjwfIMsd4NSHQPPGd2l3Wn5tSQh8fZKGbjpKx3F3ZHehuTY%2Bn8%2B%2FcDzJVAW9ToWPOtxUpTD8ACXhV5pl%2FXYVWSXbbfyHyad%2FVgzCe4CQNnttdi3sTDdnCWnMq%2BNMo%2Bh47vomu5U7CVs31PVTVhQO3rNVJPx3tvP2OJQOrKJuxSizVhGcLcVRzO3EBB7IIm7TIPJKkdyNeIL8HF4GnA0WImeaMnYXfmJ330XxAk0NIh99drsjDwrnb1bN40tGVarqCe%2FoITapKFKHwdDj4nhR2VWN095J5ajY5eEGSMGXLBoD3SMPSIM2tzGbxMg346YmAOINDh0Xr6uYuVCMN6s2%2FUqE%2FsIdRri4C64yW0M9qEYEoquMYWuWotvKvwF1ws2PKETLJGhf3FKbBD3olSHF%2BP21JkdAYuVE40%2BIHXqdsdxjP6yA7gdvLy3HoA%2F1zvqvLovCN6vg%2BbJy4QnAjrm%2BK6MNOhitAGOqUBkcwxAS0MK0va4A4eReWK5HnDjEkB73h%2FmJHSH%2Fv3R55%2FDSJsrdrW6xYYiE30%2Fun57ucbBPHdcj5%2B6nAFlo0ii3rzCe9%2Ba%2F%2BrK0tVPtE%2FniT61K3nZ0eV96v9AIk%2FDd2JmdmvWmYW4l8GcFHhNZRjGq6O5KVC4yONedcbXZPls8gJ0UY%2BRZ0z8HBowmA9bkExOFUC0v0Fw%2FEuVVpY9SsWfz4ee3LF&X-Amz-Signature=874be5c7c7bcf90a4a72486d2b95ebe244092d1452d933422060a54c1cd22ea6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JETNRM5%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040700Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIBJyi8Q0LDPxORK7VU3%2Fq38cfD7W1%2BpCiI%2F0YZmV8qZNAiEAk7c4U%2BqVF1RrmKvqCBrDBHhI2trKxHNT5YzAPaVwtNsq%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDMvlU521PvX6zUm9NCrcA72flTczv0snHHqRrxH5Y85bI0OkiYi7eJ3qcutUns3x1lqHJrTwwYuaFr96kFNYH1AVWSCdcDpfjmDb3dAG9v2oeaAZciwm%2BwqRCy2LZlNMrjjSkYf2oMS8h93T5IHerNeZ1phGoueFihMAItWeXL%2FF7WnB24xHbocGDtfjwfIMsd4NSHQPPGd2l3Wn5tSQh8fZKGbjpKx3F3ZHehuTY%2Bn8%2B%2FcDzJVAW9ToWPOtxUpTD8ACXhV5pl%2FXYVWSXbbfyHyad%2FVgzCe4CQNnttdi3sTDdnCWnMq%2BNMo%2Bh47vomu5U7CVs31PVTVhQO3rNVJPx3tvP2OJQOrKJuxSizVhGcLcVRzO3EBB7IIm7TIPJKkdyNeIL8HF4GnA0WImeaMnYXfmJ330XxAk0NIh99drsjDwrnb1bN40tGVarqCe%2FoITapKFKHwdDj4nhR2VWN095J5ajY5eEGSMGXLBoD3SMPSIM2tzGbxMg346YmAOINDh0Xr6uYuVCMN6s2%2FUqE%2FsIdRri4C64yW0M9qEYEoquMYWuWotvKvwF1ws2PKETLJGhf3FKbBD3olSHF%2BP21JkdAYuVE40%2BIHXqdsdxjP6yA7gdvLy3HoA%2F1zvqvLovCN6vg%2BbJy4QnAjrm%2BK6MNOhitAGOqUBkcwxAS0MK0va4A4eReWK5HnDjEkB73h%2FmJHSH%2Fv3R55%2FDSJsrdrW6xYYiE30%2Fun57ucbBPHdcj5%2B6nAFlo0ii3rzCe9%2Ba%2F%2BrK0tVPtE%2FniT61K3nZ0eV96v9AIk%2FDd2JmdmvWmYW4l8GcFHhNZRjGq6O5KVC4yONedcbXZPls8gJ0UY%2BRZ0z8HBowmA9bkExOFUC0v0Fw%2FEuVVpY9SsWfz4ee3LF&X-Amz-Signature=cb6d760897e8b142e6f9fce64dfc33cecd64de2e5385b0f62d5da1f8d2346e6f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663AIWE7H5%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040716Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCICf4fD7fw4smk8yZ4Uegt5YwUy3g%2BxL2ODzu27Mp%2B5FdAiEAzrWZ1GU9p3OXKtoRIv0G%2BFpaZXBgOpBMBlaSWivvPYUq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDHtMYxAHJwCv7vFdIircA3qpFo3yRRejRpqqwvKJ1%2FvkOAXhZV9Hrp7NwIS5%2FCI68YxGYr4UIc3T5XUG57%2F4Zsc8JrvyJbtVDNbOX%2BuvcDqmr4Mw0ZLf4giQaR3hfUPAcSzp70H8pvrhxeSNUARkklqGYrCpo2gF6CQX9y9Tu%2Bp7n8WuRqo7cu%2BmYNaL8xDS%2Fe5oi0HGgfIu%2BnaJKo%2FkqrLrnkurt%2F0KoDePf7kphTRfDTfAFEsExyQ6nlBu%2BoyoPTi%2FFU2wyPyTlQAwSeawvam0qkJdBYVmBDVbjybVmBCrgRO%2FkfhPuVYPtWgdsQk6Xj1RX8%2B0zVz%2FSSNMiJUCf8809i9DZ7mkls0OxlNFpxWUSvAVp0LBrpk0qylnRzyYYIOBSh4YIBA29KIvzs%2BFnFbp3FxY68KCSepF2mwI6svXdO6ojSAP61XuUjZSf0aa6xlBmpuDh8e0GSWldoMgO79YkMhLN4qBMqH%2FcIUujSxSDsbnpWpFsRGY53gXPIZJfR%2Ba%2BaeQDkVbiT0gOm5kYVDTgum19AkYRmkFnG2uXT6kHq%2FQhy1Jt9AB38PMJJtARqBcrXFCG0jkkGNx1TuFW1eklfrtiPOTxh4qckE1VMO6mYGct70bNxxRqPWYJcJvvjFGivMg9DDU9%2FMYMKSiitAGOqUBAmoLwpDA%2FfQir9o%2BJordP8JIoNOK0jXNkiDfh8Usl78pjsB3EqhPGaOhHAYTkBh35ucm59NqvuvpEkx1udW%2Bvg8I1ujkGCEuVMrlH6e4T09lfGuo%2Bcqp8wFXM5GX4nOBmJD6NGVkSSYm9zvtNC3RRUs7Q1%2FMdmBBEMjutAMigNebLQ2hkN7VVqLfSaY4rd4LqMEMIa9I3yhmgDOwl810Hxr%2FfCm3&X-Amz-Signature=994ee70df9c85def0de4edcbc73e9e1a4376ba9159d91b381ab1582ea2f34e72&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RDNRVYS5%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040718Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIBaKXD2eIgOkNLm5oKVuft00E45wBOnS%2BrIdz5HzzcO3AiBwHQWvo5JI0%2FQxdLzmGRN1JkdoqxBh3rw2wr5CY2qG6ir%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIM7bOPCfejYFC8rjA6KtwDhPvkbrhirM21bnoXhXgjCAoaUMJTyf2kRFSHEs%2FHeFvol0hvFpV%2FBooD7Qvv8Os2c7L69FiRelyil%2BTV6fJU0xttFdEPKR17Mn3xiJpX8jvls3D4nzPchy%2B6%2F%2BYGa9Bjq0q8LPtikYFL9Wnq6laILdSucf%2BcTwXaGX72wCXTnX5fmde9%2BeINNex3XIef6FSClpUqJc1xQtGlGD4UkB5yezTevq3YyvQT%2FGz4RGr63jVMIhgjQD1Ov22hTCPkjelCMdDRfPLGk7%2FXZAWC21JHk6fl4VB36wt5GPCKEuFd%2BYp5UNRCxCJDqI%2FL5jwStJBYkTGR4hhAh2gZ4OSNSoqa662oCjkjOM5Itp8DxsjWvbdOIEcAeHi27dH8DdjNM0jhfAtPCHM25MzhV1Pu6Rxih07FH55%2BQVckom1vXfdK3A5E4SWaDc0I375HVZcR8F4fHgY1FBqFcw1Md4RnerYSBQY8CYrcxqtueQumA%2FWeLkaKuSCpgvSlkt4a%2FTbSrMfdKtgWbo2JZ8anjUJF2mmoyw9IVl%2FHZ1hU7O5UczOfsKZiD1dSkPMMEDb5vCpT3wFkOgu2w%2BwtYfH9agncS%2B27HGtUpWFcTUdEZxVae1dCuF8uPu3wOfIa6hIFHm4wvqKK0AY6pgEWwh3jZHAzDuOs%2BYYngx5nGfbow854otl5kKCpiBaMlbvEgDwmocRPFUB6QSyt9OxjJ9%2Bog%2BmdWV9K4dUNHu12p7BI3YA0hj%2B5l900tCDXD98I%2F6WjNyM0beHa1QzvfyZhQC1kg9%2BB7PL5ggGBc%2FCWfQMOyuwJHozuGjTXpsOwDJav6VHPyHa6NwJVxdz0uIZetn7MeDetvw4aOx7J49ZdewN%2B8paG&X-Amz-Signature=0e4b7f43713b1171cb343bf186f19230c41723b66a8b5ba3baca8cd9c27072e0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R5BRKZ6J%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040719Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCICHurZr87zK7oR3HM3jGDOnSoME95%2FIE5BsqwTrBPgnqAiEA8Z5U%2FRaBxiXjq6tyD5pjggJIEcj44P%2F%2BD7x8Wt1ii2cq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDDsMo5he2nJc2mfFBircA3eri0WE8GpctgfDUbBvkMbtt0OILyrwyvoAcdQ6IbMZA3nhgixJGdWvucJUYWKG2TwMxpY1DyjvMszOpugTzugMyZCKiQg2CI9NY8TuV%2B4o66meoVJophpvnsckG2IUc%2Bvn1jtr8%2FHVIoaQsJzoggGJ%2FFQELhHlItcN1jUkUJiyK%2BURSHJmps1kGXVY1F9sj%2F%2BE0RUgkusdC2C3nZRRyYKRBUrN30FZzo0d8JKYyN9cKqUwNVTWH1J5G%2Ft9sgNcKpRf6D2Cw6ovMbcjKGnJFqSuY71%2BYzxHpAypCM1J5qVZvqZaA36RpaqsYq7g%2BJEEoSvKJ9%2Fb80AZL%2FnbtwMhioUHchKPfIIJFzziHGFUwbtdZQzcCJVkFUM%2BzyoxkMuo3DLI%2FFf4dQlnLAIP6xzNUxXXZH0Rewg8r6Dj4NWdKBXmc3xpqmXSLPfZWViMDYj%2F6X%2B%2FXa5qPUAhBl6uiQwPOtX4WI4kuDU9eXtvkxkEZAMNGvaudTjtePUQ4kdmQh1MeJrBz9fLlymmwaSvLYCtSxTxKeFGmpOIJMTyGydTsEYq47p1u7ldt9m0F9OEzyygQrwk3gAdT1%2BRj9TCZjs3lKZyotQZoJyQcBGe%2FyD8OsyqHMUI%2FhrwjA4LaX2RMLyfitAGOqUBCXwQhZNCTZESPyxZclCLwT%2FIj6GhVmgzrheQHyOo91aLZcT9KmBswEEEvgX5QZJnp5%2FJubBd9plILCKw3E4sqUbMtwZFyMhVM4uBe0J7Ezyxt59fwmzSmwh%2FyxzGlbvN2ijS1IG71oZjbN4MZRIBxCzAmqdcKf6JkoOt%2B9nJoWhPIl7ZGj28EsjogchMvqOgopTox44%2FZZnFkVkVlI3Me%2FxZKKeJ&X-Amz-Signature=3bcf5ba2138b2a85f8e2c0f48211ecdc38e42cdf55a598868e000ccc378ed934&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VKRMOVSG%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040719Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIC9Ojjo4qMP0J32oPN2fbzQUJmW1Wjb6bEDY7UcG58K9AiEAqmq11GrfasKhzaGF2VbJaSODhUo0uyReUNcnFxm00ecq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDBZKwOIBISuKA8Ri8SrcAzs8Dggws80rjLT7r59l%2B0vT3A9%2F%2Fk7wDJZq79rrtnip3LNQ6LgbOVidiFJYZ%2FZlz8RRAtP%2FZ57UMujjam8Ic7Kq2SK%2FXb4qn1olVtPHlsyS0D4kchE%2B70Xhlw5yT%2B86nogw9Uu4LilAMNNHgAxFQLG2dx%2F3v3cgQuwGracIPT6SxOJqt6GqXNpCPOvubuCUn4fv5XHpwOdBR9skmDor2sNNPluUo1mygXl%2Bz1uIWELEGpp73hBBK2gOAQXhtLQrmIw%2FOgZnt%2BgBJHXZPaNcn7zQGqATeKF0ERq48nKhIrGay3g7gweWnW9XS0sMKP2osmk1A3zHZpTIWrF59RPuBw5deE5q%2BQJIauJfzo%2FAEByyt2Xc3LRMb%2FKeijaJYl9kz0sawBeBm2Fn3mS6ia9mFldoN66PYoAzpAPDqVWi%2Bqd7T5Q1N6fKgd1AHFJJXk9eWlRxYv7pMl%2FbGm%2Fq3JYXw%2FXWPhXaY2IpubqpmiYjJETzTQQVfwzdH3t5wu8%2BaVDhBMCRe8o6dVaSad7lHTOL1YGLqIEoK8hyYf5ead%2B87Dwik4nZ%2FPhwwV7lJizHR%2BxhAVAYUNkB%2Bqbz4RFtZYOcUQ3uNjHyPaUvn3zZbYMYPNnS%2Fu8lF%2BCxJ7N0VrA2MIykitAGOqUBvDJOBwII2p3BoJ9zp%2FNgzn5WF9v1dvxkNI8Haz7ty2g7GcKpP5tOCudHKWxwnU%2BEIvTtdP8c69wk65rt9oh1IjIZPxhhDYqXyx0TolhroYJDOPj1zRMNofkudjbhD3pYiAEPyay1VhxCrmLphhTh6jedB5KIXNpelswEQ10rK2iyHhKNKkgP2sHTRtSzCudZfCNGbzBbCKUivUTwyGfYHH%2Fsj3Bs&X-Amz-Signature=87726eded14797d2adb098f66c8c63c7c8c9d2c061f4d25b42e71e7a3a6bf242&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VA7TE32N%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040720Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIDnzedQHC1diIrJKGQnLEg2ezapupqLS3nH2trujNIm1AiA6uvydgTQ3wZw0jx0ziba84xlAK9Ky5DxsaL5vp0GLRir%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMUJPtI7b6smCr2TJVKtwDHaytVg3%2FhWJJgm5O128z6F0ERN79xmeDfoa%2F7BTzpNUvPre8lzXkNA%2B7TTguuoD9aJ977Bm6ZDzVLxRiOXtGKz7N0tGOsujXzNSv21UAFG3COllDwK9PMU5I4UVhskW0niAkbP3qiwnj%2BAgSOLpQDN6YU3gcsvk55rH0ZKYsHO3YzLpXAqN2I8dX4N%2FpwbOdMU6JaOLpqhY8lwgpEuQ%2B0dACSjJBJXbEQSDpUFkO%2FgAeUbGP5928hBiMmUjEKSBQIDzYAj0Y1aDr7U2wQJ2d60GAOSZh%2F368QUbOaPpCx10D5vPXA51XAwuLuL43S3ETjsLpQBC134DYs8rZCwMl61QJbSF5ynKTrx78G%2BLD3W4ds1jkPuDATLZ7xMCV28U365aHIiQjYYGVkkHtk0xSHAYyN0NhZUCjBnlHoTKHysYKYA7VtuaXQLld1Y28YQiSuAA3VtbEOmHL7qA9MnYTI6J%2BHwrxWxNECY0dPbCRd%2BxJjjPmifb8TInsaJsJ7Jr392bAtRZy0TVnM4DC1i3j5PYMEKdPngyWXRgo3TDYozN1WzfoS8ljoEp266L45o7E7pM1Ge1aboemBFsjfHK3K%2Bq%2Bn65Mhka8ceDNlXQVhZzkNWkw6OL52SMaRi0wkKSK0AY6pgGw%2FNzEIN0puctvt%2FbbN8mss0BklN6zGj6CG5xpemvry8wG%2Fn%2BQKhG1s8FMWv5xQG7d4svsRK5HDSkSN5iggLSomtgeVSQ%2FlF2AgZ41fP6qlXepCrp0OLKUuX7RsCZFmNqw1BTZuXGDTYRPmNXSEKKEHiwSb9lL2uB0%2BILiX1GzyMdR9OdiBLS4E8pYBh%2FotC4gVvlm8hJnJ%2FTb7wSVJIO%2B%2BdZcr8sS&X-Amz-Signature=300dcdb6edaca58222238ff06ffb9e289577164e2e2218c602571aa9406088f5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JETNRM5%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040701Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIBJyi8Q0LDPxORK7VU3%2Fq38cfD7W1%2BpCiI%2F0YZmV8qZNAiEAk7c4U%2BqVF1RrmKvqCBrDBHhI2trKxHNT5YzAPaVwtNsq%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDMvlU521PvX6zUm9NCrcA72flTczv0snHHqRrxH5Y85bI0OkiYi7eJ3qcutUns3x1lqHJrTwwYuaFr96kFNYH1AVWSCdcDpfjmDb3dAG9v2oeaAZciwm%2BwqRCy2LZlNMrjjSkYf2oMS8h93T5IHerNeZ1phGoueFihMAItWeXL%2FF7WnB24xHbocGDtfjwfIMsd4NSHQPPGd2l3Wn5tSQh8fZKGbjpKx3F3ZHehuTY%2Bn8%2B%2FcDzJVAW9ToWPOtxUpTD8ACXhV5pl%2FXYVWSXbbfyHyad%2FVgzCe4CQNnttdi3sTDdnCWnMq%2BNMo%2Bh47vomu5U7CVs31PVTVhQO3rNVJPx3tvP2OJQOrKJuxSizVhGcLcVRzO3EBB7IIm7TIPJKkdyNeIL8HF4GnA0WImeaMnYXfmJ330XxAk0NIh99drsjDwrnb1bN40tGVarqCe%2FoITapKFKHwdDj4nhR2VWN095J5ajY5eEGSMGXLBoD3SMPSIM2tzGbxMg346YmAOINDh0Xr6uYuVCMN6s2%2FUqE%2FsIdRri4C64yW0M9qEYEoquMYWuWotvKvwF1ws2PKETLJGhf3FKbBD3olSHF%2BP21JkdAYuVE40%2BIHXqdsdxjP6yA7gdvLy3HoA%2F1zvqvLovCN6vg%2BbJy4QnAjrm%2BK6MNOhitAGOqUBkcwxAS0MK0va4A4eReWK5HnDjEkB73h%2FmJHSH%2Fv3R55%2FDSJsrdrW6xYYiE30%2Fun57ucbBPHdcj5%2B6nAFlo0ii3rzCe9%2Ba%2F%2BrK0tVPtE%2FniT61K3nZ0eV96v9AIk%2FDd2JmdmvWmYW4l8GcFHhNZRjGq6O5KVC4yONedcbXZPls8gJ0UY%2BRZ0z8HBowmA9bkExOFUC0v0Fw%2FEuVVpY9SsWfz4ee3LF&X-Amz-Signature=f405e97f3cf00339f266c11455a9e10b8369cd09d9aafac3dbb9093c6ccdc5f8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
