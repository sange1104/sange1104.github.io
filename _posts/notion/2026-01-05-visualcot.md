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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46647KWAXFG%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031619Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJIMEYCIQDSlUEFSpDwtnsuoVXPJRTSGGN0bvqw8A8fyJvWJ0soGAIhAJfmiNbFG6Z9t7FO9rvW%2BjQerCt5UfyJ9fFg0lwAWalbKogECOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwA70S%2FqTP5GOVmlgkq3AND9MG7X%2BsovehMT8aZjEQKJbVLc7BYkUu8z1hoqgA50Lov6XKdFJ6QgwEa6rvOU6a5gomMt%2FhxbiYamS%2BkJxCtAvVDYfgo%2Bi%2BlT0JxbS%2BfQ7upZYIzQ33vAvP3yFR2u%2FJIO10a5QgIHSb%2FQ8dEyziObdNvvLxsr1TM4c%2FbGammSgjpZsSmom3TFmmEfbaLs3eUMsEYsKiWGZ%2B5qjpjxjd7z%2FtUmjPPL%2FEGSCpQHS6bjfG5En7bWgnCaJRNh4YoJP1lk89o5iVp3tZha%2BL9uRLw2w6yZjU5vEnPKjsxUW4neTk9YfhSAOFkjNQQWy2M1sh6Tq%2BMviqGkmd%2BKvpClEP3Wg4IWNES%2Fvb0RbCORY4NidojAf6UdeJRU5t6ah06Z4N65EgKvls5ZyQxwdKNMr7jKiQfBFBhz4QN9PQFWeQiFLfn4LOdpsuzXcb7qm%2B2NXJewNh4X8UEzf50cC418WmY0iWaQeGcOVL5DSYmIcWT3hQriclgae%2Bom7EqNdn3maiwHBA4YdCR8UydVJBb6K5tVlId%2F5Pl%2BQ2oti5wZ4ingBj5AIe5tDZyfgPTpcsfBehxc4p3QlcoZp4ETD7Ou8n72iMpgD1zT03mGYBEDJCUeOsUBkT%2BzD95ofFh5DDqiPTMBjqkAZ0x%2BHmpoLlIJ9lGpUvbfuNDuAWWcBVbxAT%2FkhFGVCn2eXsBY5CsVGTQ1AtBnNg2stkHTGLxKpVlVQwkUGjfWFb4ebF5Qn5WqGfpA3IPId8lOa8U6MGQpmrQMTNBIPV8gKAER33QBsFpAasXzooo25xxfpdIFcEk5eKm4rZqf%2FAGfE3ciBWPphSazD7KuJlBqq2vJQLfnkFVeX6%2FmGEkKjIyoV3R&X-Amz-Signature=0cc2aed35a68c6627adc50082f63b690fe16dfff8f68bd1110f5f39bce7f6e2d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YUNJQABR%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031620Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJHMEUCIQD9BrESvKtPkh1ShpLDaLKZOWG5opxUZvP3pnFAfUiQbAIgVCxvnct%2FJRNWIp1ZbwhO%2BviFY0NMvr0F9NM8MgJA%2BCQqiAQI6%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLYriRJPYLRc%2BBhOySrcA0rjUv5Ua%2BbuOyK6upA5P5%2BJWa4V%2FJ9Y817XH3GhVkYhT4b7kkZZd1GKQHjPW1vsCe%2Ffl1UA5CYjmPz3Bj23wpvzdErZAjd3Yfok%2F9YvzRiXMoVm2nH8RXBAd2muruRIZX%2FRx77s4iRAohb7olOaZLfcgi6JVL9b1EGAUYpx%2BSU%2FQTzDmQCr3ETlvfGlAzMgl4lH1iJ7N5hnPYEXaukVCOPMs2YXUETbeHQhDjYHZwR8wHNPnuWs7IoU8tCgGWlTbO7h4Oyb8uxI7FzUbmqQJWxrEcw07RaKf1urs4LKlQFKZKZf%2BAOk8di8cwWtvRbnQY2RtErOYuRJsNglljfTXLphHvMJXUdEFza5WAc3MfYUU%2BGzTq8qfrBfqg%2FqKfUv9QmcJuRHguSrVjb2kd2pHtt%2Bta7nyKLQU1%2BL6vo%2BIs270QoZP7dsQMDGtuZfIiBtZiBAlDG%2FdGMVUy7Mg%2FmNtfwJefMe9eJb8WS1bDZr8AuBr8P6N8T5JLfO6Le4U58r2MnujuiinXupBDzG0gLQ2RZruZiU5jii%2FPvvWt9s12tczPpIbUvlkc9AqVLSIWKdzdzCI45Er%2B0tMI2mmjDUtXBdwPFObEKRexqaLs3MrZ8gatTXdreNsuXAppECMOGJ9MwGOqUBc5a%2B5vEhycU11plHr%2Be1XGaiGaNedo01BRNp%2BDXMh361cru2IbxP7LtGZ6U%2FFGMuHfpM5pSGK7BM9PDAk6OvMcLOJ%2FdH84%2FQOBTfIA5QLwHEEMeEea9bbU280cH8H4pccvkhpxEbSONZOSTyb5cr4yOVIVwitBtmUdSOuiNTUDzTXSBWTOf3eSMWt4kZ7bpdyAov4udxlgVFrzqvcr60G1Ylhf6%2F&X-Amz-Signature=e1166ebe66c7bca01f8ffbc05cc791ee36cf5a2dd153f172a56666dbbc5cad08&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZHFNDCJ6%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031611Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJGMEQCIAbxAy883szClEjHWVVtYpDccVvjjoC0bwmAorfQ345dAiBEcjKYifyNauTvOP6kjH7qw698O71d72a%2BgK%2BV2nYifCqIBAjr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMmHrDXwSYNlASgXGdKtwDkigJpDOzt25um2M6DbkF51cC3xY5cOJwteBxt7Hd2uMGW1aqhNj10N0gBfUTDBm%2BCL%2FLjjI%2Bnh4S2dEynwy8ArR80iYdPqp6VydcBCU6c5EiZax1U79f4ZETSoWHoxfJwm%2FTP9IuGqMyuc7DU1h3vkfnR4yV%2B6OV0O5ieBipTLdfo%2BhFmkAHVSHOUrj%2B1zowwkLvXU6T84gXOLI20SalaVIqsfZD9hVcBPqt22GbI3ufQkjo38kCzHzR2zkPlhKGich9slWh20CIp9qeUkHFasmTTBuEXDZdc3Em3oDSLcpOj1E2pgNMPYZqXQQ9TffnG7ABDu1D0f%2FCNX2j7ogiB%2BO65Mzxhogx7yR4fh%2BcCRqu91WH%2Bwl8ao1c0qe%2Fyf1Jd9%2FZMrl1JvnGmcIiEzsL2m2fYkNsjY9WFcuED8pRSm7lJ7elfrSy0zOAAG5A%2BHcZ8UT%2BS%2FPwhNiEHWF8ZHI9KI4PYekPDKmaxfra%2Bl9wQuQUA8M48CPNrM%2B948SmkWCFBQZVUiYbxaNhUS57Ktbrr6eumssiQRmPnhHJGy96Q%2Faw83o6KonxODr%2B80hl4ra%2FTzojdbU0hWfmNbudLri6698AGTe2p%2FE5ZyxorPP0DIlfllmgVYSslz9rZ8kwqYr0zAY6pgHohJ0zw1Xi%2BFM33pEy3bux2oTCRsnBtQxZS%2FsYOao8KL8F11WJ7Z8NmiVjdlmAodtaLg9sv%2F9NHJi6PV94X1YbyAAyDenmZnuEb%2FKcywjq3eYyTGsJw60tgT0jtvdNUqNgYx%2F0a5vAjdTGp2rSzkmhIVYsGpwfx9ZYR%2FzigQrBdIRbPri%2FNH3GcDBKmPDb5QRMR2m5QOQT7dbqQgebuijjbzzGASza&X-Amz-Signature=bc1f182cc15528650d06fe0561043c2596d40de36adc48a4464ae6e595a08d35&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZHFNDCJ6%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031611Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJGMEQCIAbxAy883szClEjHWVVtYpDccVvjjoC0bwmAorfQ345dAiBEcjKYifyNauTvOP6kjH7qw698O71d72a%2BgK%2BV2nYifCqIBAjr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMmHrDXwSYNlASgXGdKtwDkigJpDOzt25um2M6DbkF51cC3xY5cOJwteBxt7Hd2uMGW1aqhNj10N0gBfUTDBm%2BCL%2FLjjI%2Bnh4S2dEynwy8ArR80iYdPqp6VydcBCU6c5EiZax1U79f4ZETSoWHoxfJwm%2FTP9IuGqMyuc7DU1h3vkfnR4yV%2B6OV0O5ieBipTLdfo%2BhFmkAHVSHOUrj%2B1zowwkLvXU6T84gXOLI20SalaVIqsfZD9hVcBPqt22GbI3ufQkjo38kCzHzR2zkPlhKGich9slWh20CIp9qeUkHFasmTTBuEXDZdc3Em3oDSLcpOj1E2pgNMPYZqXQQ9TffnG7ABDu1D0f%2FCNX2j7ogiB%2BO65Mzxhogx7yR4fh%2BcCRqu91WH%2Bwl8ao1c0qe%2Fyf1Jd9%2FZMrl1JvnGmcIiEzsL2m2fYkNsjY9WFcuED8pRSm7lJ7elfrSy0zOAAG5A%2BHcZ8UT%2BS%2FPwhNiEHWF8ZHI9KI4PYekPDKmaxfra%2Bl9wQuQUA8M48CPNrM%2B948SmkWCFBQZVUiYbxaNhUS57Ktbrr6eumssiQRmPnhHJGy96Q%2Faw83o6KonxODr%2B80hl4ra%2FTzojdbU0hWfmNbudLri6698AGTe2p%2FE5ZyxorPP0DIlfllmgVYSslz9rZ8kwqYr0zAY6pgHohJ0zw1Xi%2BFM33pEy3bux2oTCRsnBtQxZS%2FsYOao8KL8F11WJ7Z8NmiVjdlmAodtaLg9sv%2F9NHJi6PV94X1YbyAAyDenmZnuEb%2FKcywjq3eYyTGsJw60tgT0jtvdNUqNgYx%2F0a5vAjdTGp2rSzkmhIVYsGpwfx9ZYR%2FzigQrBdIRbPri%2FNH3GcDBKmPDb5QRMR2m5QOQT7dbqQgebuijjbzzGASza&X-Amz-Signature=12f2cceb53eee3131d4a6e9f345435d1c8939b2f54527faf596b5860ecabe315&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WS27IQXS%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031625Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJIMEYCIQC0Erfs%2FPFwUWtmPi6Kz8FZycZ2p%2FGuLG5lapZg3swiOwIhAIAn2eisyZcZo9pCUvH%2BPWRYCLlCjm%2Fvx46ZpnE3%2F9ExKogECOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyGlNfZE9g5FCH%2Fgq8q3AN5FjKQTsy%2BmuT5KXv0vlAdmqIgC0Df7t%2FQVCaCZByLHmYdLwuy6WnNSnDjLaN1F6T38UoKTuewLZAB%2BC%2BM4s4gbCc%2Fcbb3i77TDD1CBBtP81SC27Kwcx3qRsqbLZVNU%2BCHQO8wnGFSgc00WueYnzs4ljD4kpr8pn9DXjSagFsllL69gj%2BRSNTE3D7z1ltEaubfnxnXNlafsn%2BQS6iZlJdPYfTR5zszT7cdfBnMuHl1lUoN2J%2FdHl8MSJ%2B3v3fQYStjCcEskQ6BNegUvVVsdwMwZqzBzgin%2FQGDQDlcUeXMKRPlARLxIm40F1VhAv%2FLgZnpUD8BVAeXCnomn3bK5Yn3Pd4tCucjiSTcmQ5BXfGX7ntqquwXt3YU%2Bzsb8h7AdSy%2BIqOzHi5AYnNSp%2FzEUs4pi28r38heJTYm1fqwUrtZy0P9243gYCOZ5UtR6EJoEtyoyV3yGxBnLE6hH2%2BjpOS3wNCo29Ewrrs1bZOCaq%2BWXxkt0dATeEbQg8Jm5n5Jy0GKEpJ4JG8iTGKtcNXk95i20LNf%2F1maYZ%2BE8RGN09zhQlpX5V0boKizSTPryRXsuL5ktiQljL7zedg%2BbKtUHylE66%2FXiSiLLcEh%2Bl4fu2MYQvMc96m6GMnS1VMmHDDviPTMBjqkAdCEaC8yNXKI2j14u84fYNiq9qBe%2ByAYU7LZ9FOTss%2BqyUN9oYVKBZ5nyS0tksMCocaZz%2Bsv1JKSBreJqJ09AY%2Fyof7j62m6yQ%2BgnFv9q%2BruGVNAZFxaKu60ffS9T5xMuq82N0WlABIYHkkXTwLCS%2F1NjUkBm5pB23ynNd2WkjAzwDh2cO16di8VU4zsBo2gLCmeBCp%2BrqaHQO6GvFfAe2gDNPuU&X-Amz-Signature=2ce31a3a996c62da832816c596a0124d3c8a36309f4bbbc52f09c22cae8b58c7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466734D6DK3%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031630Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJHMEUCIHCsUejhz0qdQohX1769qgFkoR9aXlWNZHgmeYNilQ1KAiEA9qSjMQfQqVd8Y8MKRM3%2F32LGwletajZBzZkQZDHThgcqiAQI6%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGnnUi2aUqRF2%2F46fSrcA6QoJzGIGTbMzKHHPEhADLfJuuT%2B9vnn6kWkuHJc0ikn2LQ6U80AIXFIire4kmI19ecxJ5oBT3UBM7i3ShbeqY1r3f9YNmNfJ7CorpP0EDk9MzTDyDnz8NW3clAgCkGR6OuNVILV%2Fl%2FrioS5Of8ixGMY9xnYJKRWuo%2B%2BojtB2nVRaTesgI7YHtT4fHiUhWtUe5I51juthIZrhVkFblGnVsgq9RO8uau9zxpuKPduvkzhO2sChiKFXiRZ7YrnXYtU8Ae4HMzp4zSH%2FJhYeIVSY6cheEgKV%2Fy8RWVhGldbKgR1ZJ7uWaCp7XjCb3cK53AWN0l1YBc5HimO%2B%2BPZLveUe2ru9A%2FIHBMl6%2B3WqHYaXO67AXwtgLXNw9G1aEuqDn97xk5CnzclsjlifMSTZx3R%2FJGFhdKgj25HFmVZ%2BtyRFrWJpqeJQ4ZKjY6%2F3Uj%2F1TSVJoCPMTqc6MUUPWyYnhGBWN7wZWw81tNCPJn7KQtvgtj0sKtUuhqJ%2FslGYxmdSy0VSef8iIBmxoDUpiqJnv%2Bsn4OlZIOHABe%2FOlSicaq8MGbaWozz9asSdLO0FdU8mdz4ajjJrxLe2LgcFavm2LA3x9Uzuk7dp3GmQXnfEnYV3KtHDiQkiNrjnaMFGvBLMMSJ9MwGOqUB0mQz42dt4h2dT93ojKmdMtJX%2BpagTMLFFs%2F%2F319b%2FyBfQxekD8Yd%2FdKMPcbqf3HWcPh1LAyETg%2Bg%2B6GQl094ICJJe5dTHZtP51anlUL%2F1I%2Bt95tbMaaeaeMnYVApZBhBHk361iZ%2BXenE309SG7ZyXWLZCXH7ZxRMMrn4YuTHEKmfzFtb4M%2FhR6zMF31p90CYAb0YFSIX6SKVEorrHgSFxcLTH5hR&X-Amz-Signature=97f80ae36ef28ca0f473cb4f13fa49641ad847ccfe530a4cb86c6592b2fa7bec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PWM3KE3%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031633Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJHMEUCIQDm0QCXE1vHSh%2BdIXNuXjJVkM63y5izRrkF1cPGHTzb0gIgYs3pXfSCe6k1RMX1k%2BarekZ2X5iAHKROLxnl%2BkF%2Fe8IqiAQI6%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJZVdhxienNwLYYAKircA5hVTDhd%2BjgU25IXTAlMvDo8oc0mwYnpsRCbe4m7dyV7JS7w%2Fqu9p1cRy4VqMT37HMPVG28N%2F29%2Bj6BiCjm%2BRhkjIzn39c%2FaHH33V6%2B6Dkr0TkuGuqhxTXuBBT0lwn3zHA6H4UYQiSEKiplZOqna%2BFsg8tkjWQyenh6dPhInXx8%2FAIndxHho71KECRhCpbhf13HEAdxqyXSGeiVyWgq9BeqTgsq3vxNa0bSZdaYOTMSNBe9lON0AQcccQlgI8JHboQsMcW98K1r%2BbpWiq%2FwcT4TO%2FtuQWG7DEOb4tcXrODxCCmgXbGllV4mNpH7Q98atl%2FBqiY4ftn2EzgfwdYtxDsIqlZqxEist9pGHCZUBerYumtxHHaykanT9Mt92Y3F5P1lPUNvMjfhWwZoZn3Tka0dZ0UbWLzhpuorddkeRSiGbkvgnl3%2FDfRV7yvOe7OYUnrxgxMsLAZiCGrqHT%2B8uXhkuSXf7We1p%2FD0jqauhL0kjXR0H8PaY1plv9SQ4MQMGqt5%2F%2BJY61QXhCeJVBJt4XAK27KjyZy%2Fa5VyliqCoo6XYFxClBDUskaJWzzIGfKT5f1Vrm8YTObedhZTXG1M979fUY5FlVoJgWMoQdga8N7dPCibEcRVRCv8dU8EhMMyK9MwGOqUBemm1WwoddOqNFrYEQ4g95NScij9FGLu3MyPinCO%2FoSZWEQ96SHi9qQds0pyS97knUd8b8NReCgtRtcmmEfxfweQYbDtOJHGFe%2BGokZeHx%2FAzVQzjuJes7MJ%2BGJGgkxDHwk7UtS7tZia9JIbM3xV0csrbwrkigzBBilsKKJxQfMNBSfyTgY9dZXYUn5Ezx%2F2mr9HIlnTsRPVQg6vAIDDg9ElHoIQ7&X-Amz-Signature=11e3dffb837b718c35979cbd933d8c3e932c9bdc9458d13f96b683d53613fc1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663RRKAYW7%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031633Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJHMEUCIEMeYozV3CcDcFSEEtIVDK1Vtq%2BvdDvIa2UNBfWzwLXpAiEAjDwzNYyY%2BmZUgM46EhYZ%2FgrCPbmVlKLofgxo4gwxPy0qiAQI6%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH6u9sLWuSgkTQnWrSrcAzOI61D2QhYhvgv43kFyluCzATXN5%2FYomDlBfYZr5EEr0dnkHcp0IrjwhBphGPVkHw8s5vIhtzHZnxXmeguEIgUbpogtI%2F9UZCn4qNUX6oI3%2FwyotthotA7Jk7SXEz1W7wZQr%2FtjDIvDPdwRFAn7W70gTboPim6Ld%2FZEDLPcBhjXm1fa7rZRcmtlo6kSxjIHPXCSpZqG7kgZf6OB%2BrGPFG9qFYTAYnl9aHvurHARAvNEWotXhXktAdc2lESS0irEBfFWhjZM9fD6%2B8yXInFAmztnzr8xdRX9pqOVSZkmY3ZK3a8FhnG0DAsSTRF8kvDdupxkkdLo2QpgX5qeMYY9lrRTCT%2Fvg0XUsuk8C%2FlbKOQiw9x0hu218qq9Cp3ZetKGPTSZSt%2FCiiVYWWmOzcmEWtlZ7%2BvYz4ItBZicXkHIAGmhCM%2Fj%2BLlE786vAfXgbgaqkIXuBgKVLzTtnv1TSBbsHZodCl4QJGv5qSJpX7hgXr3XFS38s23Eh9jYAqXavFIMk5ICcgI55Xq271TbZcCEZZXzWpk0tgiXjagtevxyjEz7EsjJRnSx%2FiygPgJqnMAOhGKy3nfJD9aFJWl49yOV66uz9SxsPot6TYnsCi1y7rcPgRCfxbXaLess9EDlMJmI9MwGOqUB8KCqgPbILE7v14ZFNAglqojaBB7mqVonWC44dTU7XQyJkAC9llGuiVUl7aWrUE7Q7NsyVNAgQRIoQM%2F%2BPHnqyX67O7TKuvXXavln5fbQRdIjRWWDGMIfws3oEZ6nSKzWil8yKbH7ybAxI%2B%2FaRJI6XaFGRDoGGM2lAhMVqdskdVcUnprwvR2Bh4FwJ%2Bv%2FMqu9giDwCntjRwvjn%2BG%2B42fLGIWA2AkF&X-Amz-Signature=e590f78d41e5f45e76674337aad2b789bbcc0528518d565e86983776811360a3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665PRBZP6L%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031633Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJHMEUCIGgBfLBAXzsmAjkravq6glr5yH1yp63%2FINERqo2IoCshAiEAqw8y8zthAWovgDG1wGnkCV2%2FmympMEH6U8JzJv%2FxmpIqiAQI6%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLMZrUnSz0FLFFe9YCrcAxaI5ghkpm%2FyZD8cV0USydhN%2Byx8q2YOj5mSlz766kyzI98xQCEdVZcAjwP33EPqJj7%2FoJ%2BMjmCk5L6Qqan9PyjHx6wCLyN8kxzkqeUWI4Rwn77T5bsNhtEogIUtmhFSVEDZS4Hr9HOFcGa0ISvG6D8rbD4xi4mQP2zfj%2BIiS55TGqtAuw4NRuNpfGroxCCJiubC0rDUkP4ZVA6pYYXX9CC5whi%2Fbgz3jxtiLi3v0%2Fd8qqVS6iKTxaNDbbNlnuQr9oZhLzfv1hDHyZWSro7%2FiUEQ0MSMgaxojCoRbUCIZIP%2FhXS8pydf%2BgRmxIC8K5cjElXAD0uDnnqgnenmCV9193VKAOSJLi4K550USgVtsFZhSgtAF2M%2F3UhD8utC6%2BLl5jynd0Vqg7Kxtpm07V8HrLsMTNr9f0ybXQ4SU403e16LpHsIUn1Yvf77qooyiaoKRAeTHDUij5aLDwExR1%2FrdD4RzMsr8krFP8CeBa2KuRbpGCeuUBA71im%2FkNHCWikI2Be478sVAtKN6Edb86PtemubZ%2BQ3dL9JFQYP9vIKyGSkq7XxtmfLfl6YVG8ru5Isq28XlEBUcw%2B1hJcEiZ%2BJ2iX%2FfnfAd4V66FKjjMHOEc3pjCRjhWMirg5fBPN1MICJ9MwGOqUBv%2Fb5YJHzsdwFsrJVhLL%2FzqR7z1Qn8T5Di6OXnNErzbf0C6Td5Upbt3gj650OGTPNuEPtpoKHHbIaH6C%2FxTTWNqFZA00Xp7OxWQiH7NYALakZhkWQ90PFW7fVTaqvdvFMq2D1FLgYd8g9UcmvdPyM5DGht5%2BI2iW9cglNMQM8yycgSAsDZzq0DM0QjycPtNWOzy%2FQYo6j4ExZGLPMe7o57FKEHHqe&X-Amz-Signature=8eb1412e3c56572074d27226b1a330a0db52ad83edc5859b33681d06aafa7564&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZHFNDCJ6%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031611Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJGMEQCIAbxAy883szClEjHWVVtYpDccVvjjoC0bwmAorfQ345dAiBEcjKYifyNauTvOP6kjH7qw698O71d72a%2BgK%2BV2nYifCqIBAjr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMmHrDXwSYNlASgXGdKtwDkigJpDOzt25um2M6DbkF51cC3xY5cOJwteBxt7Hd2uMGW1aqhNj10N0gBfUTDBm%2BCL%2FLjjI%2Bnh4S2dEynwy8ArR80iYdPqp6VydcBCU6c5EiZax1U79f4ZETSoWHoxfJwm%2FTP9IuGqMyuc7DU1h3vkfnR4yV%2B6OV0O5ieBipTLdfo%2BhFmkAHVSHOUrj%2B1zowwkLvXU6T84gXOLI20SalaVIqsfZD9hVcBPqt22GbI3ufQkjo38kCzHzR2zkPlhKGich9slWh20CIp9qeUkHFasmTTBuEXDZdc3Em3oDSLcpOj1E2pgNMPYZqXQQ9TffnG7ABDu1D0f%2FCNX2j7ogiB%2BO65Mzxhogx7yR4fh%2BcCRqu91WH%2Bwl8ao1c0qe%2Fyf1Jd9%2FZMrl1JvnGmcIiEzsL2m2fYkNsjY9WFcuED8pRSm7lJ7elfrSy0zOAAG5A%2BHcZ8UT%2BS%2FPwhNiEHWF8ZHI9KI4PYekPDKmaxfra%2Bl9wQuQUA8M48CPNrM%2B948SmkWCFBQZVUiYbxaNhUS57Ktbrr6eumssiQRmPnhHJGy96Q%2Faw83o6KonxODr%2B80hl4ra%2FTzojdbU0hWfmNbudLri6698AGTe2p%2FE5ZyxorPP0DIlfllmgVYSslz9rZ8kwqYr0zAY6pgHohJ0zw1Xi%2BFM33pEy3bux2oTCRsnBtQxZS%2FsYOao8KL8F11WJ7Z8NmiVjdlmAodtaLg9sv%2F9NHJi6PV94X1YbyAAyDenmZnuEb%2FKcywjq3eYyTGsJw60tgT0jtvdNUqNgYx%2F0a5vAjdTGp2rSzkmhIVYsGpwfx9ZYR%2FzigQrBdIRbPri%2FNH3GcDBKmPDb5QRMR2m5QOQT7dbqQgebuijjbzzGASza&X-Amz-Signature=8d95fc0e54e71d65de0ee673f67493b022ce2207cd887fa88cc784d859245e94&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
