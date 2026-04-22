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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UJRR4IHO%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034239Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJGMEQCIHJEuG8aA5kC21RBB3l2TRMd01A6dQFO9uQhf647Hks9AiA5CZFRkMPb3UjSsEUxtH8I%2Fl1B%2Fla%2FfEjGq09uK9MBJir%2FAwhEEAAaDDYzNzQyMzE4MzgwNSIM8%2FnukEK7PVCK%2FHgvKtwDOx1vFgrhoVs0sq%2Bfuvi5v%2By0ZFKQWxJMrJk%2FQvA5XVAIRG0YU9nhAjT8%2BD%2FnsjqXo5pZbwt0IMpzbP5w8TChncs%2BtGedL3ZPbKx%2BJU9J1CVbmycu3tibDpHCwzclXtkgSxH6XZUlblXQlMSvluktCMNrUJ0oRh9BsqscmMc5F79OzBu%2BEkTDsuQ45YpRX%2F0LTxGe%2Beq809wdzMR%2FHRqII%2Bq62Z5KCCFfmNsXCIeQyQE7WCMsKUSZMqZHpUo6jQ4g5ueghikx529rYvjeXAwcVqcorE7F4D%2BfsTtM5tiPSMLK4JPimsUfYxFIBvH8ew0rYdMbvRmeh0pCXLqtXSL4G1eNjYU2UXnXtoVEoqX1kqC92ZE8wXF5YpgtqSDcEBy6QO8aHwcdaPCTQ6LMXX3MvNojut5gE40wWZ3qpUNrC8icVrwsy1GLz1bYnjwNXalaFlIF%2FKY0shrKqh%2BoYidDCaejF2WhuwDJJ5Ya9lZ%2B6j4KYG%2Ffo3p0xBm8nkFjPqzIRARU%2BtizJvwbo%2B151AlJmk5n%2B6OTQHzXZgG66cZ4hO3RMzzeZ6HAOnq3Kbp%2FeLBswL%2Bk0qFGJq%2BrotUa13YINxfIW1kYqfO%2FAwtRKAoR%2BrxtNNBJKiEY0%2FKwT7wwyvqgzwY6pgE9XVD%2F1REVBaWJPSdy7HRaZCeyRDCJR3fFMVbuVIRGHqilDz9j02GOf90Y006xFT%2BNOAWynnfeLCLQORB4CqiL7ElyrQSAqvr6XnYeXHBlbliTHoqu5Qn5XNqFZa0%2FR3XWMF1QGoMj%2BXd2h7xaPovPPTzSnSXNyeSmDIdTt13YAu8Z%2Bk2uMr6IS1gvYwmGak3868hoTrXj71SaUESopZLAJSDrEQBi&X-Amz-Signature=0ae26eaf0b800725c4f57bf79e363d5a8df5a462fb16481c25e271e954e93484&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RFE7PVFS%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034239Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJGMEQCIHfjQDc0u1xaOdJNT7hKW%2B6MwKvZ3FJ0XtkmIX%2BqQcGGAiAtW2zexSstL76vz1B%2Funt9MYnPkO6ka8ub8gdFdI6biSr%2FAwhEEAAaDDYzNzQyMzE4MzgwNSIMIpoX4e3JuXi1J4H9KtwDAE%2FC2RCuyYm09EBMeYJ3vQwo4LOaSt3fphobMOrtSpI6qFGpLRWBjlGFd7UcqdnfrDncbyUY%2F13IDoWGDklfJWYn2djumdWjEp%2BiFxZhJCoH%2Flznh6eh8xiEwyf2mnfHb%2FXcGMEw6UhIYt%2FTaXyANWSBzbltQXSvhp%2BcjpXiCYP%2FKkzreKmfI79csQGvppZQSSLnElqiKKUAT45Sp8xHLK4wtg77Ge3kilI7Q2z3jdLuVjUmLzgpK8HEeiNIH6Xmq%2B6wmDZ60a0mcsWT4Ew6etbBhf7s%2BlGIQZNsY1NqHYHCn9llKk%2BGx5k9bPQZJZoVPZ5s5bDZhKxHrZj%2BrXI9VWch52lkROXghAkaVq%2FTEyEpaWefNt5wApl1aeHJdL4pVhdakQ%2B6XTxb5aotq69tOnh3Ss4B51TriW7Z2sy5FctI49QEDVwh5JhuFwXW6w%2Fyev4ryOYsOcGucEc0MmcSFHe2kSuAOzeeZF%2BKdBxPQ%2F3cti%2FYTko3dv8EjaFGfEBuCat3%2FM4GLBk090e5t7rcprnyKOTPEwuJLymUhTojAvNAYa6XZe72nlM577PbUBE%2Bt6cjwvBFhXJE0b3ABCjnnqhFhwwDTw%2BPMrOiNW%2FILC1f6%2F6onjJiddF4hlAwgvugzwY6pgEkpcCLh8Kgqj3ViK4Z%2BR3%2BV8pINwUIQnXqiMgxpzfPCLJQsAm1PFHHYha0n%2Be75vB5IsbdJmjHFFzIHHsi3rJH6BiyWnjymw4WhfjGcXq06ZmFyUEuVqAvDtz47MKbRz6pPcLXgu%2FTrqWkIXMUN7DgFskOcZZfagvMQlK60IkTSev4AzMM3KQupsYg2UeLRKsJLLJjFywlguQQ5QGiftiogzdXyhDT&X-Amz-Signature=f48a896a340cc09f929c2093da506f953f74498cd8caf9c60d0fd9a580cba859&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RN7LGV3G%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034235Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCIQCGdzE8YYbYB8DRxt1G0V62%2BbOuySu%2BICJp47fizJYIRAIgLD3sjZbTk9xA2zzePyI2CtZzA0ziXiN%2BC3wh3UM7Iu4q%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDKhJLzFYfvBqO6ktsCrcA5naMH0aZR%2FW0m7tW0hpJxCGnJMoWpouKgWY7mZwuh6Ixb9O%2BLrW8%2FMxuwlzBXbBp7ldGKO7fPUxHy5NbRz7XbUYWlESXWvKW3NrSTpqe1musHDGFzZ8HjTI6AU0SmhKr%2FfyaSza0JaThoAWNnSi1Lxrs%2FaR65TrxAyz%2FtxqF9u%2BfJ6W7t%2BKpZVFlt0cAFygOx12ZHt7c6AE3bkkel2ZAyb07Uocbs6nPSaJNeRHCw13oMUcdT5e98pMphb3eSeYOwnIwsn9ZjXwHYCLNC7QkJ8fgJkjwu6DR2GTSbtusI%2Bj37XIOj6qCq%2FpeiMPpruBex7Xzi1Z7qCok8L9ixm0yr6PVYjutiCuM4Kl%2FZ35s0e4JQ5Vcq%2Fh7MqYj2x4us%2FnokxtHd8Gd4q4f6j6Y5EMgl8cQAWLdSZ0AjFfVZKXFDFqCpkYG72ISYCpirTWTMfVCcCloTT2MFVe6%2FLEeQVQIYbRDtTwACUtOQlT6KaMpceNpc4FoPzapVsdbhRgSCQkdyk2H3NT%2FkOnZMZip7R9M8FY4iYcMXNYOJda8D2n4EDjKn%2B5L1RNNJ03p7KzxDPi4%2FYt1cQv%2BQP2okw4Oi9sZkdIVCPfOK1MBdRHZiNUsQPdAZnPQ5Ym5OT4NQ%2BBMLf6oM8GOqUBxE%2Fa1DEkVCj4Id4HqQW5ap2Uuab6%2Bf4M%2BqXJsRkQysnhebSJI6rsy4X9EFshOA%2BE1PMYQBhKo22k7%2B%2FY%2FNke%2BYeo8ws1EUrso6do8j%2FHkvMg7RrSZUsAazZh4fbqN%2BlxKwtiXqv3xEJbXHmUKob2MiLUyoZoRPZl9XqYXXXHASZ6cDMwzdeC8t6Jo8qQD39ZWwvz6fydvszyNWqg2YoBKr5AoLyK&X-Amz-Signature=8196cc4bcdbfab59282274c68ed6bf70e58e528fc9d95a38fcc06f2622b7cd00&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RN7LGV3G%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034235Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCIQCGdzE8YYbYB8DRxt1G0V62%2BbOuySu%2BICJp47fizJYIRAIgLD3sjZbTk9xA2zzePyI2CtZzA0ziXiN%2BC3wh3UM7Iu4q%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDKhJLzFYfvBqO6ktsCrcA5naMH0aZR%2FW0m7tW0hpJxCGnJMoWpouKgWY7mZwuh6Ixb9O%2BLrW8%2FMxuwlzBXbBp7ldGKO7fPUxHy5NbRz7XbUYWlESXWvKW3NrSTpqe1musHDGFzZ8HjTI6AU0SmhKr%2FfyaSza0JaThoAWNnSi1Lxrs%2FaR65TrxAyz%2FtxqF9u%2BfJ6W7t%2BKpZVFlt0cAFygOx12ZHt7c6AE3bkkel2ZAyb07Uocbs6nPSaJNeRHCw13oMUcdT5e98pMphb3eSeYOwnIwsn9ZjXwHYCLNC7QkJ8fgJkjwu6DR2GTSbtusI%2Bj37XIOj6qCq%2FpeiMPpruBex7Xzi1Z7qCok8L9ixm0yr6PVYjutiCuM4Kl%2FZ35s0e4JQ5Vcq%2Fh7MqYj2x4us%2FnokxtHd8Gd4q4f6j6Y5EMgl8cQAWLdSZ0AjFfVZKXFDFqCpkYG72ISYCpirTWTMfVCcCloTT2MFVe6%2FLEeQVQIYbRDtTwACUtOQlT6KaMpceNpc4FoPzapVsdbhRgSCQkdyk2H3NT%2FkOnZMZip7R9M8FY4iYcMXNYOJda8D2n4EDjKn%2B5L1RNNJ03p7KzxDPi4%2FYt1cQv%2BQP2okw4Oi9sZkdIVCPfOK1MBdRHZiNUsQPdAZnPQ5Ym5OT4NQ%2BBMLf6oM8GOqUBxE%2Fa1DEkVCj4Id4HqQW5ap2Uuab6%2Bf4M%2BqXJsRkQysnhebSJI6rsy4X9EFshOA%2BE1PMYQBhKo22k7%2B%2FY%2FNke%2BYeo8ws1EUrso6do8j%2FHkvMg7RrSZUsAazZh4fbqN%2BlxKwtiXqv3xEJbXHmUKob2MiLUyoZoRPZl9XqYXXXHASZ6cDMwzdeC8t6Jo8qQD39ZWwvz6fydvszyNWqg2YoBKr5AoLyK&X-Amz-Signature=b7079ec3b47ad1d8598fd950b912696cea3af17ff9c165c74744c7d7df1b51a5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666GGMCP4N%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034242Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCIQCAvkEun8nOvBBu%2BtScwWfOCbCZfUhH9rym3OXQWpbcnAIgINTW3ngxqoN9%2FvBU3wzIF3gcrZt7OOC6cQvFX4HJ4cwq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDPvu6nypDlncoXH3UircAwvRRxOjMWzMAHR3TWyAJ3EFX9vofis3I3%2FlYea4Ssgi19NzBnFWFWl9d91So1mgab5aXrdcARqcxQZvlOgNBPdqvb2q9n%2BoZVgJt%2B6DC8rD5NbTe%2FJu6xlAfm43Rmb4t3%2BFWqIeLeJHixYZCagqfych%2FvxlrIvG7kiiGSVCSC3%2F9nXKRsH1wklDggLAP9YvogORYIhrIsNXAbcEueB5AVaFL1t5CHbha666kuuybHu2JwxqHbl67K8ygwjMtoRncB7Nix48ilIUjHSOJwCZzJENs9yOMizgtSh0nju4cvzgA9i135vgVJg8iEMvXmsJd4PBy1F%2BcEUJ7bp68U6%2BkOF7Jd2ktrlzqKxOTBySkeRF3Nh6eIalml0jvoio8c5fFiaYlwIHhykt%2FIcDR5fMQ07uTN6Hh1IPNN9sRg%2BiG0XrZpQYMzxCYhOc62ATTPS8zP2ZXfp4F3y8GGOYq3OsrshklEsNqUzrHFuxUEXW%2BvgAlbOq4IixRD80YtsKAEQ%2Bbr%2FoOUCozbvmq%2BYoAUShKSEzRwpeK9INCQv%2FPRYVkOxsQcNIQCTZnFWG619v1mAAb0%2B9Jtv3fJn82aSAZ2FWh7ok7IV0Nub6jIm9hUV%2FbSU2I3MuMeWJflKt%2BKRtML75oM8GOqUBNRAHARcBX5gJiDB6yzRnNV36lTEKYjK9dOOUeqtqMYGOs%2BAP9HvR2br9g13key9FeoQr6uBYC%2FqUYT9VKhzSeEI1R1Qkl2eCK5vz%2FVxzC%2FOOXvCaJEh9YyRls5PJ3lu%2BBIhMv9S%2F5CqKhNBWTEuI2i5I279KeFhWmH5j7ahfvA7TVc2ZZu1H7oVPcNfR5T41xkk%2F7dhIqxM0gpxGhgKFLtnc3Nk5&X-Amz-Signature=215c5eb9e0f511ed2cb86fce620266f87f465e3a2c3d07b000af1665a3bc1a64&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SXPFDOA4%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034244Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHwaCXVzLXdlc3QtMiJHMEUCIQCRKh2E%2BaDSmH5NOU0BxoZK47Vj%2FHd5lvly6ZARlIMgFAIgCbg%2BCq0QXOsTw9zTxW9qFFsQF8ScSGuiocNX7hotzXEq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDPGA6kGC6Z6xYK1XbCrcA9P1QexPwJwWhjCmT8efdJmBxBk3P5h5SQ4eDHE%2FlrNxmXawWx1FQAb686kfbghGKLyZenEso6uSHZ5%2B2pHfeJb17wDJGO6OQZr%2BATM75hGYf5f5V4b%2F0VZkCeK0ZqSVICP8Y2BLSmYTWMfS4JhXosZjEQimYGhomF7qZyP1fmo5CDXExhqFzqt84HLU3HnIDNXU93V17HpCCzBlCexS3Oxlxj0qLegvTmAOmhkSj1VP9Sfq03S%2F0azCAXuJqrDTqairLk8vQgDJyym0PPtCYL3Y1eJ6pNfE77x%2BJmCbbrT0cnCaykUz3MWwOWFQIcaAf9ZMeGWM3aDnsXHByX91RHAY5Jo8Ubz9stH6YFS0MuIeqFxmZAKbHguAN9vmAv7QVpcnzraJST5tEatjP2Y2jR4w69E8DErBzSTtpuWs81hfhUmvHC%2F0gcU2JEZVfRAnj89ZdUHPmN5lkuR7AezLivlxfLt71WM3zbMCXukmJs%2FGCVf4vuCkmGG2XM9KSFSzAqDjzvOcFC9oN5bWZ%2F2vXFq%2BYyZwHL%2FnAZf3K6qG6%2FMV2AL3F%2FdtcpWTdC0IVaM0hE5%2BqW9HahV9Rs9pzJfW5hBezuT7RIkQYbl7DNoKfBKEv0ywfUoikGFqodA1MJ38oM8GOqUByHSoD4hY6ZwcW%2BW%2Btb84CyhSo0PE68clsDNVXnMnfq09LODEP83y1%2BoBVEvsZmE82ZifaDE6N9lqzaKTilgR9vXbSGgC%2BcvMxjTyCIzJnEg7ti2%2FNAn%2FxV0fcBrAlGaJF2hUN4Vz1NZt18nFg%2FgUugn85CoZCRq0NDyfT03cdC5rAAwzw8N411%2BFguUsTixjVRAfgIPZiuQ3azmWqyKG57Qey14q&X-Amz-Signature=b22f076c808352d58c25bcae7ac4de1090f5bcb14410b2d35e1a515bef231699&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VAQUJDAJ%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034245Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCIQDUzhtHcZwKTLywzIV%2FooZ7%2BPI6mTcxFgg1%2BzSU3cZMvwIgWY5K01N3STQcnchTnk1oj0P%2BaW9jSmHz0%2Beu7GOKejUq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDCjRMcAF4six%2F6aNoircA9I85pt5x709D32YULrXRJcZhnIEC5bcedKQ1LVKO%2B%2F7%2B18isfhxpKTKfW%2Fjn%2BlghKft5HOv10L2KknO7%2B035%2FPqYuZGQT8dqbt9LkgRKwnoWTrRLTKmw2194JAgMV0gX673T%2FQDXDfgXe1BsI1SjDFbcfii2wIztATRRawXLmDxgRd8T7kI3sAO%2Bs6G9DvFXGthrKfBoN7Ef90ZDBJjOGG7m%2BWjsPvx%2BBDlk082bVr%2FFcPRZQ7VH7dIpu31W%2BQjzQgLcm5JkD%2BHVYp8A2SkIctNGkWxybsD1hfT%2FgwH3HVoDd8273b8vTrI3nNkU4yA%2BC1FJA3qJjlJgBwr6JaAx8ttgT3%2Fnt8kRGkNuD7e7xLci2TUElCnSz%2BGaWkDazsy04CPQj7rYlK0snUoVQW2ND46ckuHL03mEp5uqTA%2Bn9osYZ%2BI11fH%2BBfSgjTwbMEsfdJyXqoZ0NbrV%2BGMQJcKcgbm34nyVOBHc6x78YAw%2FiH%2B57UzOPo8F7pfd6n2lI5FX8EX46Q0Wks6j3Xz5Hy4Td06DVG6DY%2FrZXErJPXWvSeKLkhqD0dBnWg3Ne6qfPPeQ8TmYYrxDG7AspshKyKF5uRmuVMpDxWbdUGEl6W0ahtMgaopDn8Cgdnr5dn%2BMM75oM8GOqUBcrWi2OI1HPoOGGeKtlth012X%2BbJS8Fevdrer9s129hGLukNUIFJbMBhk%2BSUhLuH9FF0Aw7l5F%2BK9l%2BTbVtpu1Aqbso7wMMIc8g9rxIm0a%2BA1roNI0WpsZGBZzLl8kiCBhH1uM5aEHzP9YvWozrV10yJzxJTuQv91e62qz3sqo7S1Ks65bZbKpMabgWgIXVmJPWWb1SDqKsQJrKPDUDoFSSERpgEd&X-Amz-Signature=91a68d8c1a6b10cb62f361723d3614a764660bf6646ae5cf5d2f931e55fdc0fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667ZQLMZZC%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034245Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCIEAgKscT%2Byy72dFQ%2BAI8vHsIXUjfT4zzkhTLtXR7y8zfAiEAr77cpqWryyQdL4EIxTF88jey6isdx9vrWIt0EgGd3EIq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDBkiTXIFDhIBBAnGZCrcA%2FCjiwxggFVLBAzQ7S1MUFTz4IicJvUVA1I3jTprIZrhnnbn9LrEJSe0%2Fu0qF%2BYRK%2BNv6rPHLLDkOrEQvOcVIUoyIa%2FNhcCqNpsTPUkGvVEbihz0%2BktYDZbL9%2BUh1dSKWTC3XuBR0h2n9DX1m8p7DHP1IFq2vlskKFXdLWpB0kMeLlZBdvY4%2BmTbGKqt0RSJtUEM5FeN5%2FNqiheDRXQvz179zkZ707cyGMO2MsG6qtGcZEaKmXuE3mU0%2BUGT5dovnn1G2yAatP3SCkaxFtqg%2FYhUbMRnsj5WkEzC6qY6puva0%2BYrjyRBiAiExYYKN%2F2pm1LJJJ8v4KTzFp62sLvq5TePpATvoiJzj48X3X4WunSNaid5pkmTksUQdiCGaB%2Bg5yt0XxeYTBihbH0KYwj8AFcUW0mURLQPcpd%2BucCYHAf3elJoC5XhWXn5cy1SpRPGf%2B82sWr3VgNV1W%2FdEJ5Bss%2BC1ozZkxZdfOzZ3axBlgTU5oADzfN6q9Wq0Dl%2BojIaMZ1ef6wr9H8Tm0WC7rqNdASJMmfRlOvFEbvq8TNJNOOfWQNBJ%2FOD8EGT8ijmmtDmFMzW0YLttySY1KAgxVAjmOm4w4Us2dr0mx7xydAZ1yLvKaB5jBE19Yakl1cbMLD5oM8GOqUBjAqAJ8V%2FlGOCzcoVMaEPlPYq5eXcOdg8KTyiL2YOiiFFy3OmJt3B0cGEZAQGQt3%2BcplKr8xz5l2AKSrYc2aO5MiU6YtCBAtZjpx1%2FWh9qFL3jp9zkdsGUmLtglO4ioYlv4UQiMDT%2F2OEwVdpZ3Q20DJPCBewYCXvrTh12vfw6x3L5OOyKZW%2FJMKt%2FN9T1qnZxfzr0LPbHOzQDG9n6voW8gbEZM9Y&X-Amz-Signature=a3c59569bf57f130ebad883623b5e10b1d54233eaa46116ebc871dc59b085849&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YX6TRLJQ%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034245Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHwaCXVzLXdlc3QtMiJHMEUCIQCDHaywp4idlgjhjM%2FDcbqVlJ2DsFMMYqbq6kcIBfHqqAIgM9%2BToWKnBtgjqVOi086w90pVIilWkRTYcgjPDp38U68q%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDJflFeZdsWmjVdoU7ircA0eHRziFs%2BKyCnDC0c5SawKiY77TGPgtb2mv6Q%2B7J05ZNx%2FK53%2F00Dlqs1%2BT0y%2FRlR7LyMds6bqjovEKh2W1Sez1nIc0RJHwrvG7UVlTxk3cbO%2FEhNYKrN303939qVuPjjiFBGp1RRYi%2FDKUO80ypWeE68tdlkY25WcVDfp%2Fy2abmPZy4EIHj6%2FDUz%2B7EIGB0tQUgl0K9DTbrCKgpBC8QEkOWUXWh7aVymJpvkMsdSbTYBEf%2FpDlijk1VscM1qdZDa1U6rH%2FkR1CA5DYairBWeiMEnH1tSuD%2FBZFGdL9kKGQuWAqAa0dAe4TCyFnyBd4Udy3PJD2rQ%2FMHNqyCor5eyh0LdQbPXhDQAaTOrsOjoAIUa%2B0GYx70oMRT6TmzspNihKQx3XECTvzvVNAzNlIaSWGqPBs286kCDGvfEhroJ%2BcQLb6cuz1dzfokqpIr%2FL79zOpRbRqtHJRAwshAj4o077nHsVl%2BTOmruKPirswpAXNOTQ49kOu6rvJU%2B6hCM5cUwpnvmBfFF4j9p1v0y00XbG9iyt%2BPpFoT9qzrwaOZaROXXNMB00oySF2ydbHwxqZH0%2FAHsUeImJIABLqJOHDP0MFtdEkCS5OP78wXVpHA7ddfHY6EmI21XPadiEhMPf7oM8GOqUBc8YU7WqDNR2NZanfMHBWaGDYyR6onsS9FLJOWLf9rr43Q%2Bf5FHOXT00RrCgwYVEnw8%2FqbPwtIV1VGa2Z3LyLWlzX8aIl58aLbHzF2VRPy4MlWKHIgL4hWkGTeV395tuQalZHWpcgFmIVrcW4VBbQLrBU2mKTz53VLU47zQxknGKUIfREetzd0Rq%2FxNPICOi0jisiHVmMIw1L3ydY94czQVn8ecQd&X-Amz-Signature=68751b3f652854a41fc8cadf03de98252dede9fe1304614998471d65d26b7450&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RN7LGV3G%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034235Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCIQCGdzE8YYbYB8DRxt1G0V62%2BbOuySu%2BICJp47fizJYIRAIgLD3sjZbTk9xA2zzePyI2CtZzA0ziXiN%2BC3wh3UM7Iu4q%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDKhJLzFYfvBqO6ktsCrcA5naMH0aZR%2FW0m7tW0hpJxCGnJMoWpouKgWY7mZwuh6Ixb9O%2BLrW8%2FMxuwlzBXbBp7ldGKO7fPUxHy5NbRz7XbUYWlESXWvKW3NrSTpqe1musHDGFzZ8HjTI6AU0SmhKr%2FfyaSza0JaThoAWNnSi1Lxrs%2FaR65TrxAyz%2FtxqF9u%2BfJ6W7t%2BKpZVFlt0cAFygOx12ZHt7c6AE3bkkel2ZAyb07Uocbs6nPSaJNeRHCw13oMUcdT5e98pMphb3eSeYOwnIwsn9ZjXwHYCLNC7QkJ8fgJkjwu6DR2GTSbtusI%2Bj37XIOj6qCq%2FpeiMPpruBex7Xzi1Z7qCok8L9ixm0yr6PVYjutiCuM4Kl%2FZ35s0e4JQ5Vcq%2Fh7MqYj2x4us%2FnokxtHd8Gd4q4f6j6Y5EMgl8cQAWLdSZ0AjFfVZKXFDFqCpkYG72ISYCpirTWTMfVCcCloTT2MFVe6%2FLEeQVQIYbRDtTwACUtOQlT6KaMpceNpc4FoPzapVsdbhRgSCQkdyk2H3NT%2FkOnZMZip7R9M8FY4iYcMXNYOJda8D2n4EDjKn%2B5L1RNNJ03p7KzxDPi4%2FYt1cQv%2BQP2okw4Oi9sZkdIVCPfOK1MBdRHZiNUsQPdAZnPQ5Ym5OT4NQ%2BBMLf6oM8GOqUBxE%2Fa1DEkVCj4Id4HqQW5ap2Uuab6%2Bf4M%2BqXJsRkQysnhebSJI6rsy4X9EFshOA%2BE1PMYQBhKo22k7%2B%2FY%2FNke%2BYeo8ws1EUrso6do8j%2FHkvMg7RrSZUsAazZh4fbqN%2BlxKwtiXqv3xEJbXHmUKob2MiLUyoZoRPZl9XqYXXXHASZ6cDMwzdeC8t6Jo8qQD39ZWwvz6fydvszyNWqg2YoBKr5AoLyK&X-Amz-Signature=d0076fd75b4ebde4fe9e065b443768e34c4dc7e0b650be84048a0bcada2390c7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
