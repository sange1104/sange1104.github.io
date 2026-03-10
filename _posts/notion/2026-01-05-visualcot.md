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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667NAELYA4%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025203Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJGMEQCIGKX%2Bhyv5YW1Ze50mRnWwQpocTlf%2F9qbCH2yw4KwfiiFAiB2kOGjB4Gt9PnYIItRZ9pVn1HgbSPLnHNOvPUY%2BAaOsCr%2FAwg6EAAaDDYzNzQyMzE4MzgwNSIM3ofNwGa%2Be325sPd4KtwDRt%2BTgliFSejKJMPdiWvQ04RCcB%2FGQZbL6htaWS6JPP5Lp0OKehg5xGaDr96eJ2PoH%2BeQ%2F6%2F7BkJSbqPujjjASD8WxyudhcC7Qd16mdUBt87eTxD66a5I%2BYtE8HDeBtPxSoud1ZosAKTNSl1t8Rqgp9B4D7kP7YsnNQG8Cx26RWjq8EIVTtqeae4U2cCFc8tfwj9taAqtVpRTjtEQhkLGDcNqqdQ5E2Qy2QJJ3URzUAYTBbRjXiq7UZFcS9SMUa%2FsPQgFbxrQSOu2BgTRZKOLyVUOASjOqI21WQQcIQGmFuJMQYSkm6%2BmqxL%2FBel4WiZAi%2FaxW%2B72Xxrc8QFjMzvxyqp9Xilhwv31T%2FfsjpSkAZoWoMF52P7xCMZs9I8g31I3cRWcyZq%2FSDY9sN%2FJlh4Bby2wf5pQspsIDRWkZm5YVYUViS5E0ZhmD3LV2g%2FEkPh77GsSZTNU0ONKrwpqwQuYTSSOFZUI6ENkaSahM0aF1x37d1W1eq3COR0rmVsR44TLbjGm6cOxPPeiiuta7Q%2BG%2FNy9li22hLf3RZnwa0uGPMVjJ4QSJBA0R%2BCMREbIhqzWbE5kHIbR9PBsbUv1DzGoCrnJyOgCeXfyaifKXryLx%2BPCfSKz8hQUq6KKDg4w4OW9zQY6pgHdydgFj8gtEl0ibmfDdome5gsNZS4MHvyavwhPfsIKCeVjdIzfp386gGryPinaEy%2BFGZ4X0QVp60qC7QWKj1BJwm3GPh%2BHlhVr%2Bb2VVzrhi70mBZp%2By1hRVscrNxvKQeO3XDrLWp7urUnTY0o1%2FG5nNxRAi8l9Yom8VN1bpFwguLbicbLRohGDvVBslbGCNO6JLuq9MJGOHmSo5L3VXi%2FKPAi5FGro&X-Amz-Signature=8c529bdb79709c661c10c934fdd566eb09b02360091278de58d5a407c11d038e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QIP6FAZI%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025205Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJIMEYCIQDdObmJ%2Bu1uWfNb2e2kzllBG2zlYGjDL9U%2FGhJXcxbG2gIhAL5ao7%2BFd5DOSh0bjKdPoY7HgE1Qs9e%2ByeILG3M0F5%2F4Kv8DCDoQABoMNjM3NDIzMTgzODA1IgzXI9A5Ms1lemwDmUkq3AMnIuRB8eRQuLG1BMWkF6MhoTiAFKUZXlfRZB3dSzTEwKSHa6NOuCPm%2FS%2BBgR0KVsAZWB8P%2FygxWXeTJYSK9JNsvPwXUZbFW%2FP2Fdl109eor%2BQPAjuh%2Fl5IYFDdeehg6BxHIdZSTZqviUj299%2Frx0%2FBq28dKAa%2BO6mRx2j2i0lQleHENbLWkYT0gRK%2Bk74aUz8pJJt5XaZrOtfVMpOmClyFhdrgjXYuXqj%2Bkqd%2BX%2B0IwqjzrPcgc32z3FgteQ2LVvl4uOmZ32C3wUNFEgj6fOSU5wNs78h2Imy1hBDFp1LjQLKs06rYz9PdoJ5knV5hQNdSscON7TTmyYz5bFXXvKiZzZauYtNEPp%2BCdfjHALD05Yh7aNVtoLtpuk%2FRno4vPP4hTPqbu%2FLuWfljMoMOUpCwZ6M4239QgZkQJhIaZpr7lW6QHpwnIbf2UJvZ%2FIZxchFhfxAgUHwvmzx75B1Rf86FiRD3E4sjyuaD4cEDPlw%2BLDR2uXfUq3YjT3MU5sNOPOz31DCiV6Lqm3ljWiV%2F2dN4xNqbHBItWkUVe584FLStLWLrx6bVJlkHdo7emg3oNEMyy0gWdkYUVjsv3%2F2gTN1ZmdxEeOKGcE4UUdMcuq6Yb%2BylfxCCe5A2r%2FsvXTCp5b3NBjqkAa5pZPrLXAWr%2B0kqoD2IeLsSl9pH7FQer7ObpKSR87wPVGTU7Be3EWJvSfNS2i%2B%2Fd2AtHE8vyUtGxZl2sqrkAGVx78GCUdG2nB9CveMYsjRdtFQXiCVJhCgSnxHhETg3LVzK9ScLMsuee7r%2B3AZrQkcZhJGTmJfQO7xEXt06G0V%2Bso9vap%2Bn0LXr8%2FmJ%2BlVLxWRcqmJPNYheCimKRDf8MLTsNq8y&X-Amz-Signature=45270f3798d030d4498202ac1ae51d4c47f4e653bfaa02629e0e9fca13ff9dc6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7NVJ62N%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025149Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIC4orDYihFd22HGi1lKmGZ%2FhIsC5iVfAOmazCyTQKIvnAiEAo4lEXO8Y0tUZDacLI6DjTtsZrHjoG2Bof7n%2BJHqTxV4q%2FwMIOhAAGgw2Mzc0MjMxODM4MDUiDH%2Bysjy9ffa8ZBEiNSrcA3zuo8KMApWiit%2FPtPx0qVJCq8Woht6G4qqqUD3sOsBNmNSc2CgvyeXIhQzV852id5qAWsACxItYa71mOJ%2FHX86TQcHxctpDw2g8OOhch4AnGjgJHXt3FWA8wITjRA%2Fa6VR5FryrRRiiLyCZdxgOWYei5uiBkhSf26OezqZQyO46V08xkogfggPXGIHaCXXCrIK0BGHqCxsim4YJTjCbDWTk%2FKKL49WLvIEwvPXUkLwEiR3vX6uJ8rIO78kHPT%2BK0oAMpkwfDz5N4Bwd1%2FxD1phwDbJc%2FaW50M91PYPB2xd12iyxPVztHjvFX%2BQqyeW8%2B1h8Mij%2FjVdB3wOXakToqlZII77%2BiOhmu5iB8aakXFiGF50v456CKlb8T28lCxDgQAmBSYXzWs8SnMWuA6ota%2BeeYRUU9Aj%2BNsUeFFBSqkw0l6lw9uCIfaKMKYWoGKBF1gg%2Fa01cIZ5AfneuiPd%2B7ceHYwPJyG5qtIFMSJ0S8YeO8SP%2BRrmTWquJ1TZSodGAsXfbDulYTCKJbxI69lQSsamRICIMyfHGU0gYJwRowfask44i6eSlkDbwDw8htqJtoWBgKMZ6XLIMRvIESoN%2B%2F5xeOgelL8CGGNVYklO2FMjBUQqiDFK3uRbBFATcMMHmvc0GOqUBNKonh%2BiTHbZj84SxpFNPi3S0R6A%2BjUhhWWhfhG5wlzIjQvuZyySW8TkdMiPO4F%2FXi0D6AbkN%2FUkZ%2BPkyxjVFd%2B16aO6YmAPWJXG2FwBsE%2B6vEwp7ya43C3DFtoJ4I%2FWvECHzszaK5I%2BVAmqW4YiZPDAMH2xZajHdlr67StgbLVuoK0ffOiJZD2l%2FPrkVmliaAs30IOYpR6QMTFrQKbsJKi0hOE59&X-Amz-Signature=1bd91926ba0352d0c7aec3c92815f7090ddcb58f37c374de46f89f4e3fdf254e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7NVJ62N%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025149Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIC4orDYihFd22HGi1lKmGZ%2FhIsC5iVfAOmazCyTQKIvnAiEAo4lEXO8Y0tUZDacLI6DjTtsZrHjoG2Bof7n%2BJHqTxV4q%2FwMIOhAAGgw2Mzc0MjMxODM4MDUiDH%2Bysjy9ffa8ZBEiNSrcA3zuo8KMApWiit%2FPtPx0qVJCq8Woht6G4qqqUD3sOsBNmNSc2CgvyeXIhQzV852id5qAWsACxItYa71mOJ%2FHX86TQcHxctpDw2g8OOhch4AnGjgJHXt3FWA8wITjRA%2Fa6VR5FryrRRiiLyCZdxgOWYei5uiBkhSf26OezqZQyO46V08xkogfggPXGIHaCXXCrIK0BGHqCxsim4YJTjCbDWTk%2FKKL49WLvIEwvPXUkLwEiR3vX6uJ8rIO78kHPT%2BK0oAMpkwfDz5N4Bwd1%2FxD1phwDbJc%2FaW50M91PYPB2xd12iyxPVztHjvFX%2BQqyeW8%2B1h8Mij%2FjVdB3wOXakToqlZII77%2BiOhmu5iB8aakXFiGF50v456CKlb8T28lCxDgQAmBSYXzWs8SnMWuA6ota%2BeeYRUU9Aj%2BNsUeFFBSqkw0l6lw9uCIfaKMKYWoGKBF1gg%2Fa01cIZ5AfneuiPd%2B7ceHYwPJyG5qtIFMSJ0S8YeO8SP%2BRrmTWquJ1TZSodGAsXfbDulYTCKJbxI69lQSsamRICIMyfHGU0gYJwRowfask44i6eSlkDbwDw8htqJtoWBgKMZ6XLIMRvIESoN%2B%2F5xeOgelL8CGGNVYklO2FMjBUQqiDFK3uRbBFATcMMHmvc0GOqUBNKonh%2BiTHbZj84SxpFNPi3S0R6A%2BjUhhWWhfhG5wlzIjQvuZyySW8TkdMiPO4F%2FXi0D6AbkN%2FUkZ%2BPkyxjVFd%2B16aO6YmAPWJXG2FwBsE%2B6vEwp7ya43C3DFtoJ4I%2FWvECHzszaK5I%2BVAmqW4YiZPDAMH2xZajHdlr67StgbLVuoK0ffOiJZD2l%2FPrkVmliaAs30IOYpR6QMTFrQKbsJKi0hOE59&X-Amz-Signature=b4bfb5f5e397768068d7d096f1431d730bb90a9875f5e9e7dcbba882071d2c35&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665VKONSQY%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025220Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJGMEQCIBMVortXnQMFxHC8hkf%2FR%2FZ4T19k2RpV3tI09EG08KfPAiACRN%2FE8DD9zPcjL0KSg27y1SnHmT2adDOFUiLZFHhzhir%2FAwg6EAAaDDYzNzQyMzE4MzgwNSIMnhD1fHRo4DFRutXPKtwDPNdaPdbCsmD3oSdVaGz%2BmDN2GDV8MtJcjsiuxlQLLn2OpmxzxRpWfPwqD%2BFHhlIanf4l5x5EyMHRDbt1K22QhPuPZGEPYAW0B0zc9L1elmE4bQ7h20xHQhkw7ATCkwCCaCfFOzqe0SzalAUXsS8n3jaVpa95EFZZAyY0jCn6i6bSKjN%2BScZ8OEzXC1UQgr19%2FCMo3J5EkLqc4VwiWYJFd5GhOYod9lKaOCDPnRJM9zLd4Dt4o5D3tACIKzgm%2Fo%2FD1YJkcpTC2fdHwt5mq7Mj72nj43rig6dWFJPfrzc4tgs2DM1worKFor6IXOK%2B1n64I%2BGQddTEcyOaqwjdUee7Rl%2FKhXYra%2B%2FuTgGJ4GgENWFZWc60ibzCs8oTb%2F%2FrkL46ZTPEigY2B%2Fgl%2FzHVAmRfsrlpOHp7MwtMGLw8iK9iPm97QxC7sWhTg9S8UaaeUOJCHB7INzm0HstPzsOJ3F54GMvwognFVbvJlzLsOZYo9ssIFcQGRv97F4szSTqBL9Fih7XuUBolE8dvgyb1ZlkSWPj1hmKe8SiSlLydC9ZenvgPVVIUq64RYITlXW7LWCF6o%2BDRBTpUpoa73Mes6YNjJ%2BIIs3NTAuOnaLNc6MPuqtJdxbShjaolycY%2FRZww8uW9zQY6pgEbklwXG7lTQ%2BCaPIHxVFBVE%2FsygnPA3Yb%2BPkgEmHUkJZZEanA9jMbgO9zRJSuIfYUQIexSqaadEGO7FYcaSDr6mFZhAKqqrC%2BdZ5w%2Bb1MnA8CY0Mp%2B6vtxKpxxHwpPrlug%2B8HMTmqRf1VKTq4y90MQj92bHWAqJp3Q2JBekctLwKtwPBXdpvzZmZ3uVzH%2BD9stW0makl0UYwPv9vyeJKyMyWG0OIDs&X-Amz-Signature=dbcfc3a90e7133246b7e95651465ea9a336a7a98335057ff57f11b0ccb04bc2e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666PZODVE3%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025224Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIQDjbfZU84bhRc5rtGiaaTqjRcKZn91e69X9u9ofznaRXwIgBbq36VDOiZeQLmIeVcVxnMlOsxUyEaYNK6hOslt6vuMq%2FwMIOxAAGgw2Mzc0MjMxODM4MDUiDEdrYpHaqnE2JTa0USrcA5nK54nyogDTe%2Fs6qXykTdbB%2FupXoP2QOZcmWhw38IbkhkvEjihdlM2C7Sns%2Fb2Us0%2BCqJ54tnPOjCobUn2c7%2BrNY5AfNDIWDzWSibZpP9d5USkOk45bp1BMXt%2BAr%2F2zbXICDsCWxQRND6Znzl71NQCLuwzjba4%2FGXi6sQmH2xS0iuHEhvC0Wof0GIcaOicbFygqxd%2FMV6SbrbOiLjC725A5OoWBlB0HTcRQFqzUxEyUKTjxa8bohkVVDbK129uyAHqOR3Z%2FX4oK7j0DwB0qwFBptniuCzffqfenrfnqhVJdyYcV%2Bxgx1WRpAkE%2Bt3n%2FzC9frHo2lOssUq2NHKaFKeockep8KKCm2GHOWIV6fB%2F5yWepm6bGMlDMtGPh1c8VyqWZB1pBjl806loS1Rm77PC0tHfblihDOS498zZZtXglxKTYpsNJY2MWYZhTzfd8WYCn8%2Bn16FX4%2BAs0eX%2FtmyeE4NwvpHGsc0uqmXNFpR1mk6vLEHXAe8JUriD6I2XhYufCVhzCROeLEX6slHdFnpFQckZRiJNBLGgnWDwIhth7CqHbZt9gYGEDRs8sN6%2FTMSBHteb%2FmH8VP44f2YVNx4qtC77erNYmQFZ3whWwhGkXR2BmiP%2Bc9zgI%2FI2pMJ%2Flvc0GOqUBiqqhqq%2BPvSfBpKz5220Cr69wY4%2FPvKmf6Ghrv11EZNPlhGEGd40EHmzQ4ijRIti%2FD0vw1gXEYE%2FVS7%2Fe0pltg9eukDLlGp%2BumU689X%2Fz7xkYklwOmOj%2B5gyRD6InckDWrkcwBrN0sBeAM7mxnQtyMKW7UqbYEutDpvTpDv2is8%2FMe7RQVmtqVwUjzEsv2fVrOFQ6dA3%2Bk3Suee2IFRpn3HE0SOaR&X-Amz-Signature=bdf6a67f71a96e98baa1799581bbeb4af9ec2920a724804afa3eb5f9b9578245&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W45YP4LB%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025227Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJIMEYCIQC6dcX%2Fy%2FMhl0HtCFO%2BNrW9x%2F1ihiOxM6RIkuAKeO5LJQIhAO2BEEuF2m7xMglLdf0pHn1D6QmYj%2F8QsFEzZfd53IllKv8DCDoQABoMNjM3NDIzMTgzODA1IgyavJT3lfI00xSWdjgq3AP1ECsTN3KQ7CkorLBVwBODSEGz6ONL4U6d%2FpMJ3%2FjPI9UuL1%2FwoRV%2BnkLpFd6CmOWsACJJi%2FHOD2Ff0%2FJ7mdahupIUDajXgPWKLL1ZyPSXy%2FyAfdBvIJH5tEKoJkZxsciKxU7e%2FmiEbaFb%2BEY3do4GIkk3WzrxrQ9cyRuKFMI2ClN4P%2FYRX%2Fo219DPEwZIriXQkN8lNwiPAe3qh%2Fswg0ohbCxKiIOuf08Oy9gskV4qd7SMk6%2F9DNgh84d3dOBuVQ4tbEZAhOBoHbic5qjFof5ksUKUrLhc38WzAj5R%2BpJN2wpFQBs3fLDaeQ9YuRkfDcFn3A%2F6jI3DWqBJ6poKFdgqEc7GEzZf%2FNYi0SFdm74NcAt7MCeLeAMGZyc1%2BRJRYL%2F97dS9T37iMK%2BJxwYahN5xKlG637tOxk2KZWb06aNdXfzBUT8DnmYZRZPtwflUe5WVrWy1PH7kQYuvcmvwhSlKSMZ7HJmRXO6EBd%2Fap7ipNrk0rQkeEWcoVdqRFWQ0cE0YiQwBWB0ofcsU5zMqZhhWObgPnJNxtbMmDx8LqZ0IqziKlvT%2B2ZjP7AFFjfFPuxnifSXxm%2B57ep92TFp8Ix1GnE32FkKSVdZcGjMJ2qAIhoIRqUqzUg68ZP9avzCL5r3NBjqkAYchakxf5%2BFEVKSPq1P%2B4o8sj%2FKbSRazVDGEVCCppl3YOBVYEr95KrD9uOebLI%2FtX4rii6M33T%2Bmcn48CveGz739pVgvrNTDDsJL4K0TnHLoj1PFDwFJ8wFc3EjIseMHPRqWrzMH3LIeSrbnSqpmI9mU6Ndg3W98BDC2L5kKOrGnOT3Xd3wGnxU9%2Fugon4SYrEfa6xeE3RStSvBls4nX%2FxSEHXb1&X-Amz-Signature=34606deb259622516adae8ccaf8c429b49de324e0e66ad19e17985f37f35e3d7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WHRDR3DY%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025227Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIQCOJqbI4C%2BAe8XBZ685J8mc6DElvF%2BOgtmv7gxX%2FiheTQIgBXVIl4ANU4I6xztzidtbiBbJiRLYZdF0mdDNLOgNPwwq%2FwMIOxAAGgw2Mzc0MjMxODM4MDUiDL5sHgErzxDrdhaO9yrcA2SoggE%2BBcjRreCYbqniEilWxO3NguWep1AExt2%2Bey2PMgxy%2BxHf892Z%2BdefBA%2Fp1VcdzHcYb9BD6uXL1WzyKEotBx8LeWj5679fGTROKbDnC%2B2WytoIodrPzUO3Pqe8UM0p01zrjzpIrTs0m2KdJYXEmK9OnEJqjUCE3tcBcLikJ%2FEO5QYU71l4DMokL0Vdo%2FtOc0MN1PZjGM8aiMpdasfN1UPWAyfvdKmqG%2Fxual2dTlHDB64CwB9Di8JU38QPCcvXsaNmtsI2FZgql9E%2FaI0nCNzrTMHkTtNUoAv4g%2FMVD%2Br8s%2B4wLkxALlK%2B0i4nX8b5kEmafHjzF701XAhiQM2mxSzOIa6T9DcQiZk2VyxdsYw2gKx3CPgsSS4v%2Bi%2FVKAeHp2TnkJAFRY9UUFVfssX%2FBWpQhaUN%2FgsTWO%2B0wKXFflk5TVpHXQb89g4O9ZKJm%2FBS41njlVctOBMY2JrlYEU4HapEJFh9zaa62kFU5S6ykHQH4a43ITCpo6xixX46qQktLH9xzQ0utEjFlV6P%2Fudv9JKn35q1iEEdcr5cO3QbioKyFYYfgk1XYJopPHYtpGg%2BLszgDZueA9ucFRJxSqrLzCxlALe94hk8eK9Mk7etZ3BUhAv%2FUzYbZkfbMPHlvc0GOqUBjpQy3bW%2BqQ6W1a3LJkLlXraTCXjJPAxchZhoqgkUwtZJeV2pYrB2NORFwqWd33W%2FlZehrpwJslj7%2BYLnOVRjHcGPkmIzPkx2jL8vFHxJmQgeWGAYtU7wC1P2lzBOJRirpbpiut5qhRstthxPoMw8Rw6pmlPuCWy1uZCfw4yS4ArUxIJHz8w6XOddEOHZL1bc7DnelJXOIb0pOzIe8Pacn9XMjNXo&X-Amz-Signature=908e53100c84d4d107225478ece14c48f8d6f07d83e35287cb7ee05501376b1a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WADAVBT2%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025229Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJGMEQCIEhOU4aO23ut%2FA%2FhxW8P8WpnIOuIaHSybUHv22V5t9YkAiAKEAyZ6dTUoQSQXXqXmwlBw6pYcbxQO0r0vbHKoqZsrir%2FAwg6EAAaDDYzNzQyMzE4MzgwNSIMdNcEaOugaSRi6TgmKtwDhiiKDTY%2BgxP%2BxHu0nk2A5MSefT%2FLFnPWiEGNnD4arv3tvxo5SN9ePvPKcMZsyrpzIFp%2FVu%2BsdgtTCzzWXC43Z9Zr52uOq3GAxiL3OOtDHrOwYuKF0gpfrq1wO%2FCU4OygTaVQXBDRz2A8IKPul1rwOEFuv%2FCE402ftRcGnIEcq8hzZn569VWLP9mYdXKz9erJEURXYVeARm4%2FK1uzZ3j8gj9CrnUxuJC0Zny9cya5eCJLzyX7uSAkuliGDi%2B2TMxlvULG%2BydpiiXxEmKs8lZkuLqQcdxwVOsHwqNUmKmNV1fMr%2FMaIklBd1t9lEFNM41S7toxVCq8thij3jU14py9Yq5FMEbpXrxW4j9D%2F5%2F2W10D967DmBDYWyj2wP3p5h%2BXNWx4JulPBoXUpoDmP%2BnCwNIB6V0GSyzgEUso2r3BRAKKPnmZZ5tv3aGXfRIrZY5ZOcGmk2r%2BrX4zsGGguLzrEILrVgaSenl7JTjUwFk1uR9%2F4GMEW8MlOw9flsTxB9LN6haoJAF%2BneRNRuWeEQcjzL9%2BDEm8qG9mIscJVAaMDcc9vIoIHfKL0ribf21Ue9319ks4tTc3qWw1Dh1rbsoMw%2BQSLbsqnAfHkIWSwADWycM2XksPQ%2BTz02S%2B07cw0OW9zQY6pgGk5IZH0Wako%2B9lOuYEv3ny%2Fq9iLcZ8PrpKV3yQT0pMfPyDmtHKuDSblR64l%2FHZ6aOhcv52rZLeZJEgoSbgmXxMNTTDP9RpzY2yab6VaDhwzjPPu4RT%2BohItyziTDyib%2BJpme0ykNUr%2B1n4H31KqWyqUfdNKLTwz3%2BBOUWdEIV4JnS5BPdZL3TOPbumBd1%2BCcRCDHhhO2cG5PQNKzumVJ7Llhmui%2Bxa&X-Amz-Signature=43b8d802a6cb79b551ea1803aceaa2207b3d53121b571aeb6fc81f6f11f48cdb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7NVJ62N%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025150Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIC4orDYihFd22HGi1lKmGZ%2FhIsC5iVfAOmazCyTQKIvnAiEAo4lEXO8Y0tUZDacLI6DjTtsZrHjoG2Bof7n%2BJHqTxV4q%2FwMIOhAAGgw2Mzc0MjMxODM4MDUiDH%2Bysjy9ffa8ZBEiNSrcA3zuo8KMApWiit%2FPtPx0qVJCq8Woht6G4qqqUD3sOsBNmNSc2CgvyeXIhQzV852id5qAWsACxItYa71mOJ%2FHX86TQcHxctpDw2g8OOhch4AnGjgJHXt3FWA8wITjRA%2Fa6VR5FryrRRiiLyCZdxgOWYei5uiBkhSf26OezqZQyO46V08xkogfggPXGIHaCXXCrIK0BGHqCxsim4YJTjCbDWTk%2FKKL49WLvIEwvPXUkLwEiR3vX6uJ8rIO78kHPT%2BK0oAMpkwfDz5N4Bwd1%2FxD1phwDbJc%2FaW50M91PYPB2xd12iyxPVztHjvFX%2BQqyeW8%2B1h8Mij%2FjVdB3wOXakToqlZII77%2BiOhmu5iB8aakXFiGF50v456CKlb8T28lCxDgQAmBSYXzWs8SnMWuA6ota%2BeeYRUU9Aj%2BNsUeFFBSqkw0l6lw9uCIfaKMKYWoGKBF1gg%2Fa01cIZ5AfneuiPd%2B7ceHYwPJyG5qtIFMSJ0S8YeO8SP%2BRrmTWquJ1TZSodGAsXfbDulYTCKJbxI69lQSsamRICIMyfHGU0gYJwRowfask44i6eSlkDbwDw8htqJtoWBgKMZ6XLIMRvIESoN%2B%2F5xeOgelL8CGGNVYklO2FMjBUQqiDFK3uRbBFATcMMHmvc0GOqUBNKonh%2BiTHbZj84SxpFNPi3S0R6A%2BjUhhWWhfhG5wlzIjQvuZyySW8TkdMiPO4F%2FXi0D6AbkN%2FUkZ%2BPkyxjVFd%2B16aO6YmAPWJXG2FwBsE%2B6vEwp7ya43C3DFtoJ4I%2FWvECHzszaK5I%2BVAmqW4YiZPDAMH2xZajHdlr67StgbLVuoK0ffOiJZD2l%2FPrkVmliaAs30IOYpR6QMTFrQKbsJKi0hOE59&X-Amz-Signature=03ae710e23a94304e7a5803289ac006c7b84fcfe5e3b87eaa9da5eef777bda04&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
