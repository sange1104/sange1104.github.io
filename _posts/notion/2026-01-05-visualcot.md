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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VERWPFQN%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032205Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIAfLILVC5p81s%2F5ZdRXYuobB7FrXJiyEVI9%2BpFRMVYBrAiAIhqVzL8A6JTcmiJ6Md2NWXTjV8mu7CDcNdl2dz093byqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMvpEunoV5EIG7RREbKtwDbXlKKFRGx%2BEDizTObEiw5jvumePpaykWvIwhIjvsXceNNEKc7O%2Bynu9jOgEcVNjf09nunXKSc2Rr735vwWTWwweT5chf61okMaQ9l%2FYNGwNY5p1vw6%2BRpMIn4RQyFhSAoubnV22hqpN7H8lC%2BNwvyP38bnAgCQY8ipblhO%2BmEPD2xmv5i9QWmY9ksBnp9zvSJFXCiEep7MBq4wa81S3K6a5sHQi6nnA7bU1E453Q%2BJwPfVv88U1QE33xVmpPBdnu51aDy8KZomxRpB3nAxnvLdDOY%2BP9IOrLqUEmszQW9dmgjWPM%2BQzlVKfuVJX5OOa62z4bDBuNDrxO0%2BK2i2QxtDpKn%2FVopB%2FtH%2FzJROjr0lAiNme7E1PHJukHcJZGdvjIWI9a1FzW2Q3z%2FPWvVF%2BFQbks%2BNHdjfb6fuTE7VHjodTUsHS2Z8k2SIYs3U0XI6Wb0I7o0VFaL6cnka7I6TKRZFyBck570vBKnWVHhTu%2F49zxbo8sICIui0wTfLEJzyuhXUgW%2Flb7%2FCt8vqiJbWlPCW%2BtAafsZpnsiuU5mDEAof3Akb%2BHay7sSHLS34GuGC8vdhjUiXOhWMFv%2BsNzy%2FGGU0Kdi8%2BRElbJa8A7bbOELKABW%2FFkFx0M%2FU66d2swsabozQY6pgHHIndinISZAApPknxkBTxV40iWoJkjzTq4WemZhohtwNN5%2B%2FNAGUg3YUUl4zott2Q61e%2BELdES5a%2BmSyk23HN9s2cXaA7QN6iAC38EQExHKrkaCCdWBJkx4E29TkIi3NC3RV%2BgK0MQafCw%2FL6g32tj5d4velu2liYdeQ%2BZK4apI6gA07P%2F8HKm%2FeOSL4YC7Cn3U8l6pWBYH3khAtVnEhhOlPakc3fk&X-Amz-Signature=ac6dde4ba39a14059a82cec2bba4f4b8272b7ea8fc04d2b244aeeffe8edb06f7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XFFG6532%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032209Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIGThkVpzP7UaMTTeRiJJvixfFEwsUBNqeBF6eiepTswlAiEAxHxfSIlBIYS7dDm0XcBgxDYuwwJb4SwUmhQtsV9wmP4qiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBmOB1Z9Oz89Vke1YCrcA71iojEK1nRbGcB24hL7bIg%2Fj%2F%2BgFi6IupPwt0cXZNW5e3%2FefN6oS%2FU6Ea4mo6MH2Ccnv%2FUaKRN%2FDrItCE6Cte7nMnf5tfzQ0YzXqTwVIHh4VqhUyRgrkHc2vrXvVP31H%2FLi8ZtyqdotRL%2BhDCbwJKrueDTJeDAJbcZuUKslholF3VzNKBgt7QXUPfBwiZRnX2otxuFZVqoEnNlxt%2FIlm1UAaEI8%2B0Ash%2BfoAB4lfbt0egXYg0OVAhUe6HBF5mzqMED49X6rsYUlmFb2LsBg%2B45wENWdvYf5oPrkxwreMa3e%2F%2FnVpC4bFQ%2BGDt%2BHMpDTlszJyMLFI9pFRWp5vxPEA5PkGd6SWLiicUyHyalK5zgqYC0h612KW49Nat%2FK93eaV0i0vFVBFbrsUd3eW1lEQko6yts3%2FxWK07DBdd1HoAnVk%2BbOuZR3AtUCzRpTdK3ed32oUSBWZXuwRhXF19y785gpxCH38C2Qenw1lM6Zy05Xn8NS8lEGYRBmL3%2FcVXOAH9jO%2FMXhcaPrl8nOjSYECy0oGXzCRBbgfedsmncO6VeKcwaYdDZjBWwiJMwyktIUbazREJXZDRBpRWqtbhl0%2B%2BZS5WUufjFc2cbMOMCdYislMoTF0c4HUwcL3bjVMJ6m6M0GOqUBs2IZRSnu%2FUCq4xe4xpCI6gdVN4heCYBr5%2B4yYOm4TcyoyHRbZDxvU2P8jSDwpwKXbn2F%2FCa44g3dZt66uOvymaG3vi3TtYzRLJPEZ10XOC8bh4OyzJWt6a8xfQH9TTLxS1qXjdRyq9xp8y62ZIwAVm05eIaaaGVtqKNMAgKNM5wnzZ2uwaB5HR5d6xxm5a8tDd0SpivXMak6aBPhQ0mvK%2BbRRFAz&X-Amz-Signature=516a311ef1a5422aca3c0714ab40f18f707c1720abf3ee97f166bbb63805835e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QFUVRASD%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032149Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIBQBuOlZxFDXHICSXN3L4D4J%2B%2Bo8VKOavXe5Cx%2Btyd30AiEA9f49lYecWgWnOop8qVSl%2FU5%2BtVOrF2BJL%2FoVcw2%2B8XsqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDC3QKT0i2ImnNzRaSircA%2BrNjS%2FvGx6wvxrg0PxDwLaDp60bW%2BpEl8vaIMk5O8o0duYwSo4BoVwRQIXFJygqkaYazukCClDmiVnocu%2BKUufrXF8Lf21xh96Bpo8PcVzDMojnUNUYUQ49k7Xso2OCD1O0wh7lbxW4ntQ6W5ZajeglVrkigmIpx7UKiQRDh5gImWi7aoCBUMBq%2BQiV44AkiJtX34Qx2j%2ByE1WpZ4rG2qRzDstQeON%2FPMdFG2HLAopn9AnEZ1ol%2F1Ox2Fcgr71JWBV63lJPD5ojOOVXpqEdUKYkiSxxq4Yz7rxybmrjgGny6Qwu%2BJIdQXIkZzCgSQWheOv0w7JslLcSup%2BqfHPssJcs9U5zm0XQq4VpIRUytrXS3N2Tvbsdq3mJLvMBB7CcXeFDahRAogE%2FHteq5J9uUSoXWraKFldXCDHLn2c9HY4QH%2FY%2F7iX8gxBrznrh%2BUCb3GEZ%2FHSPPZeR3GA0O9b8e48sFAPAHO56SjRhd%2BSFyoTViAyo2yy%2FxuC0R6zPsaHGrqdNvmOPOlFqsiE0ncBXLbmw7GyMH%2F6FHWuunPqgRQyENiKRq%2F4CO1Rto7AnVoaYIgerqw%2BxqqQBL77HzV5pkuzZ3V%2FnkesE7TSyY8VKgHuheCjNPusay%2FVt%2FL3RMMWl6M0GOqUBVhurV3tBdWqRO24iLtH1jLytmDDZj3oxoM3A5w53t4kvkroDaIHe18bDIqbroV8ECIX6SBX5W4XWC%2BC6DsWjpm5%2BwHu%2B6qYCvmFAp7meYknTjnPhuwuLnSTaJB9O629Wo9IGJOkJGJzkXdIQ7b6jYvJLIo11RGMpnAvrNMIEs3KDXnJWw0NOz6kSPGphSwX6XuLQyhpX4hKi44mF%2BG%2BhPhm%2Ff3oy&X-Amz-Signature=ef8100ca887f1f23ee7e217f4cdd7bd50473acff50f130fcedbfae82b1468d2f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QFUVRASD%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032149Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIBQBuOlZxFDXHICSXN3L4D4J%2B%2Bo8VKOavXe5Cx%2Btyd30AiEA9f49lYecWgWnOop8qVSl%2FU5%2BtVOrF2BJL%2FoVcw2%2B8XsqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDC3QKT0i2ImnNzRaSircA%2BrNjS%2FvGx6wvxrg0PxDwLaDp60bW%2BpEl8vaIMk5O8o0duYwSo4BoVwRQIXFJygqkaYazukCClDmiVnocu%2BKUufrXF8Lf21xh96Bpo8PcVzDMojnUNUYUQ49k7Xso2OCD1O0wh7lbxW4ntQ6W5ZajeglVrkigmIpx7UKiQRDh5gImWi7aoCBUMBq%2BQiV44AkiJtX34Qx2j%2ByE1WpZ4rG2qRzDstQeON%2FPMdFG2HLAopn9AnEZ1ol%2F1Ox2Fcgr71JWBV63lJPD5ojOOVXpqEdUKYkiSxxq4Yz7rxybmrjgGny6Qwu%2BJIdQXIkZzCgSQWheOv0w7JslLcSup%2BqfHPssJcs9U5zm0XQq4VpIRUytrXS3N2Tvbsdq3mJLvMBB7CcXeFDahRAogE%2FHteq5J9uUSoXWraKFldXCDHLn2c9HY4QH%2FY%2F7iX8gxBrznrh%2BUCb3GEZ%2FHSPPZeR3GA0O9b8e48sFAPAHO56SjRhd%2BSFyoTViAyo2yy%2FxuC0R6zPsaHGrqdNvmOPOlFqsiE0ncBXLbmw7GyMH%2F6FHWuunPqgRQyENiKRq%2F4CO1Rto7AnVoaYIgerqw%2BxqqQBL77HzV5pkuzZ3V%2FnkesE7TSyY8VKgHuheCjNPusay%2FVt%2FL3RMMWl6M0GOqUBVhurV3tBdWqRO24iLtH1jLytmDDZj3oxoM3A5w53t4kvkroDaIHe18bDIqbroV8ECIX6SBX5W4XWC%2BC6DsWjpm5%2BwHu%2B6qYCvmFAp7meYknTjnPhuwuLnSTaJB9O629Wo9IGJOkJGJzkXdIQ7b6jYvJLIo11RGMpnAvrNMIEs3KDXnJWw0NOz6kSPGphSwX6XuLQyhpX4hKi44mF%2BG%2BhPhm%2Ff3oy&X-Amz-Signature=77d73c3e6d0e3f1cd5829a9fc5b974efc5978ca919048d48e329f57c434f84e7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46653UPJ7DA%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032221Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJIMEYCIQDgPLz%2FRTb2Z075UIU%2F4QnjWBW1wOxcUnAgx2LM1%2BtD3wIhAK77%2FrCIpUE%2Bys2t7cLQB7fMZ8NHiuYKh%2B5L%2B1IEvCEGKogECPz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwyJI0pwObFunwZqugq3AMwEc%2FG0xN2CT%2FLc8FuQ8xQqOm2sKpQ93CMY0S8rCwxEN87d9VRYpPWi%2B5t6BvaxQBoSmnczSegUfongjFnOX8zrzHaO6pnYOOezmccyw2WcbA2jUFt2NlG79RWBrKTT9iRPgyGzata%2B3umvqCNzcVw0GY5MB8kHOJw4YpYhzUfSHXblDGkLRDhtYE6OFCxzlE29ai0KmckgEAdNuPhJBhNdUv3DtYQngDkagrv25fkxkhV7HORPu5NO%2FEJY%2FGuQhDEGdy8elC1TAWKM5mFc6yhZ4D%2FLHR3VHqyqcgwDAT6J3iDJlfy%2B9vsEtqRndCth60dLu6UScrfSpnfNn4MMUZO9FwOAZbIvNSW27bUkU07aAA%2F%2FbjPy%2BABgRUZ99S89m8wlE4fOKU%2BGdtRv4Bz3HdtfyfC0BGDAVPU6R%2BnM%2B6l54Ztp%2FhWieIPBK9rZGG0yO8cG6Foct8DNM%2FD61xrzOB9OPgnJTDZlup%2BgjPYIa6HFJ1yVTExExJt9gZj1DL6k75GebsBmYg4WjOvbUcPtXF1xLEVI6tTZPRw7Fs1ERv51eAgZ3h5pjwlUccJtAr5Tn3%2F%2FRCApdC4TeUTzW2DYyGvmEGwREmhT1X3SlzJRy7vY5YZBi7h4OKin6t%2F2TCEpujNBjqkAbGtlya8BJvjmh5O0WurugmO6LZAWR84NHFgtklN21B%2B8AXv9WxU4tVwCrOb95%2FlUxdR3NCrhAW76UlYeHyshScaSrKc%2BjgT%2Fj2hFWaGeocVZeCIQf%2FACiER7LXNVXC1Xgnbyu%2BPnq92npJl%2BC%2BZaKNoLZDdI5M%2F8vt6U6nVbfyRvg8M4i926KXs%2BxNrZ80Nbtu8%2F%2BUO6nA3HJWvgxi5Dkj7VuN8&X-Amz-Signature=741022640baec330a13fe3dc2f811667131fc681704e4cbe02797a22cd4d7e9d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664WRF7NBN%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032224Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIFhX3qAb00%2F2UB4vsLA%2BZHNFoYnRdlB%2BHMz2vK5lMmt0AiEApontDySh9ocBR8ah5AFTQmM8B%2B2rFLhh8ZTCOue%2BBLcqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEkSGQ7YGwc%2BBhCAOCrcA%2BwSoZSFL1gIIBK87Grg1jIpJx5YJPEMu4GXDjwySdXGCJYoCsRBvGbYpIzs%2B6%2Flq62QZmTU0eT24a66QrMYQbtJycAu4OKtzthNSeC9mhOjVgfK0dUpKu4J6QhzQM%2BH5euJRBduFFoudkYGmcwnubw3F5gHEec9U5lGJvkltENRKkO3RabqBVCu8qsn4idAncgHIXmTAG8Q9MtXuAMttArcX7LnIUYTWdfPlJmXgae4FpOHpWD1B79D%2BwaMfnAkLo0JzVkYZKAaEQI3vHNvKTUsH4uSN%2FuX5jd8XC6FthbsdVor4SJ3FivduUYvh6QQ2mAYRrY2A1wC3zBYzya7sFzQyH7amlzysvLWdYJFf8047%2FrWLL21CqcS%2Ft%2FFWIBxBbefaot7uhNPXLurj36MCMAdky08op%2FV5XTvMShi8AexJUDoLOhxqVC5iZzurQPRGmcvdXBQ4KolNJ1BT1tskGotM4HCEzB2tgEJE6XQuDlOUblRJQGqCcLiGfCnTdDzkhFkKIwrga3yGGmhfJ8pokZZ5tfdVXAi45pUSR01u34y3slSlTOU3mDTKG0QGbP1fmzzkKmoKbw%2BJ9nVjDnfykqcuHflkX%2FQmxXsalvwy7KhVchUA00Pus%2FuMee5MJqm6M0GOqUBik2zViqH9fgNp801B11rD7j4Ehnbj7CXGjcK7kuV6%2FTDxTKBDNsjsb9iXdYY4nQRWnflHhM1sjdD7%2BQ9nHqoeC3asDMKrhFQ05BJH2a%2B5dHMTquc0D%2FqoDel9MduwvXjlMHAgyii7NIUYeLPFb8gF1dwTWFILAcFo8sS84BvOzR4ikNhQ3fJl54UfPtQoeVaHHIAfJbyyhX0jHFg50xHL1Vfx%2FSi&X-Amz-Signature=3d809623ea8e07f381538ed0223d78e2477a18b15e16785f80cbf6f1bd1541fd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XDQW7EVU%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032226Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCICrCSsv3twTWVMD6JTVw0IzdCu8uKhynxuAfg0WT61y%2FAiEA0ZCHAtb9vwjWFLisfBrB22ieW7ml42tRh%2BLbHIy29B0qiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJTs0nu13vgxaPH9IircAwhmJtbpoj%2F%2B8oT2WpMRCyhc9bJhQ%2BQyk4%2BpSCHCJDI9uiiUUOVb5vJ049qftFsjoLg%2BysPz4%2FG%2B4S7Fd6bPdqkszpygoUpZmeKRCvfJJ7D9UcG93pxAxHjG4rs7ZrPUcz2s%2BuBViXlrtp5gZDKPTz9yFa6gK1Z39uFNDEqShVDQe9T2OTYGL0Rt226ycb3YFg7hmklboSpsjj01mfLNa1LdaEfnZqzOXPTXs6fSNf97rwuXPxHtXxhvvypCCqHwc8iYCkk4JPxqrxwfQPC1zIM%2BWJftQFJ4VkyznBzlWPIcAopwtZLSNG7%2Bv7ax3q8I8LfWHuwgfW7iNCobJ2m5zmQlChqh3%2B2OplqbzeAhQOo28dZQa4tj2cRWpCoLL%2Fxy0jPGfnzB8deA5JdPaKyVRR37st4p47vCObcUHXGYznizAZOsCBlqQVztNFrzvJyVSplkeDdsOzSebddjlHQYFBna9kV9KjMZtIJgdqlv4ot1LdUvdMb80kANMKykP7iuQzOp2uiMsXdtlotWigMBpVUASS%2FCMX0djxbLF35lVwXR2sho6C2Io7oTFLmVtvtDqE5uc9j1DNLk8m5%2FoHlS%2BNbv%2F1S9kbF%2FvCgtmPKRyxALeKtO2PA%2F9UGZ2HwpMP2m6M0GOqUBjLCV51EA7Dg9AKfaVFoxnpa5EF3FVJM3%2FMF9iFezvdI8UJ8fbq58gajN7aN2teizhYCI5bElMSNyFCVQooN9pXfR6FKIV2i4EpITVq3PbVHj5KiNpd8D1jE5pf5lGMSypxtSFgr4S0FOvPM4gdJGDVc9CRjzvCPdJEUivM%2F8xJN6VMvcfdPjaUvLlAwMazHETVV%2FHFICr%2BnpZV1TccAGZJSDMQsj&X-Amz-Signature=fe2c3bc6c5b086728ae30b157ea1645d512ebe89544aea4c157b5d5d780c11b0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RRDUXZYT%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032227Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIDkegJ20FsGlN6aQwblZ0XEuG20ZebcoonSsPUAvhL8OAiEAoC2cmMALxQUYYf3%2FUvZbrGMJ8IRFaeFUMfCZrMLdhhkqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHjW2932zkbrWFTtDircAwgbJucSAijb8k0u773YwwV9WV0SD9kQ0sjSyDM2aSTYxTUu8CN30MAuhP9hVWHdx%2BtgKjMQpt3gQMttY9ectayjabhMovxUGdyeEkpBcUwtAODojS1J9b13%2BnZIB1K7JyNyDasY9eTFrI%2BZFnWtVvmVXpPz%2ByIkKQ5e9P0HXrTNsXKRcWKRtADwT1xCftcK3MN0OKJV29zfiBoAObpZDzQyyoZVKm8Sk9kKh7g7xSh%2FfnESAs2B5mwblT%2Bahf1lvi4prbVvIcin%2FoXGEVb%2B1N8xRg1BexlNzxKy3xGY4mgTuvKFej0NeniaP5r%2BOscfHmfCUhUVYHrVp6pN34GTznJrki8HBHNP4YaBG65GJRTPbWc8i8%2BtaRDjoFOZinXAVf1c6KY9g7HwG7pZ%2Bn4H5qhPt4x%2F%2BqyFiBa6y7f%2F3ucF9rHSfNi96MN1l9keqZswZ6eL03v%2FCXcimlyGqlQpEaWl5NxvHUQrF2n4qWgc63MFzzHn58zigNKavJsDViItVguJKv9s5Dbj5dsxPhDKL4Mz0gjZEeZmxvu4VPZa9FXaaEyUporOIP8HEUPQfzZgBOj66ezRKHpSUtWqyWP7CxtXJmb0VT39Sv5lBtQi3vFHh47xRUSIDsSnSLonMI6m6M0GOqUBHEY0MW1zVmk8n6URkpaggX8ofyO%2Fh367G3jZ3UB%2FL3IZvGkg36OTRZ6uOroliDhESnL0ix%2BPvN6MoenWZhBk24mcHh9qA5o5UMNbtpKraKE6CZO8lNUr%2BCJl2GGvfpxNdZZTk7COFc2BioX55Ou6PFE6M6Onb2gzYgkUCaNW824Qqsxsb2yCbCJ2X1aV33t9%2FdHnvN1qCBhF2%2FNU8RQkV3rU8Wf8&X-Amz-Signature=6d4e2d737777ee0730bd9e14ce6ae2232030f3deeda786830c62f2502b7e6ccd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667PJ34274%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032228Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIE%2Bz6t9rNfoQybKW30rVKWE9zMoZRBEP%2BfTlraQNLxEiAiEA6SpOXubb9hlhUQD4h4KtNfNrzZ9eAWgsZEHeTcg7FXwqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJzGNZksZxpZlIXQByrcAykffQcE%2BmNiF8wfXvtzOJCdhmZqOUfwziNVfw5zt0V0rnMa1HH1F5DwWl1w38%2FId%2BuixY3foKaZtydgNkYNY1xOyNly%2F7S4SsugR0TvQq2LRMnNXzck9%2FciDCoySG3zDuHi2g0%2BfrXrAXlj4phY4Wa6wTvs4TXJf2MvkyYAYq4sG%2FEynKtnqkid%2Bl2C%2FjGLqPEECBKsp2tGNiIe4Je1meIfiuqcv26rGSp%2BqafML5JXhNQG3%2FOQfKDVg%2FNgRqL93yGLgshcVm6oERGmWJ8Gy9EW3hdFBgQWOwQhm%2Bf1uRV%2FmnsJd0XLrO%2FdHcLkH9ONytB3E82Wqk3turHjGiAd%2BIh6kzusYYH13b5VOENCuD7FkfQXQfSQDzYkUorrdaxHjlHCEK1kjXBJYRIgM6%2B65fgY4bzrsclue8iNkTNmn5OVFORAwHxXh72xb0uvjLriC8XspHjZZ%2FRRUqtHBwyRtvc2O2szr73ZbxS%2F1P2joBV1X2ATaDCwG1kf60foBETA3HIYsy7VhP4Ftve4LJoJhg%2FpMUgsB3pMaSjHo0uV5stp1Hyz5nUQi7cpi8rpo1q%2FUP1w3o4GAw%2BjxdqKRZvkc8cf%2Ft7C%2BW%2Fv0Bw%2Fue9nAwsEvfNu%2FmkBk4wg3yaBMPCm6M0GOqUB6D6o6AZY5MmyB9mzgt5v4trfNZWY7e4SCK%2ByHbSpX%2BoK7pVsdS84VT6%2BWV6iS3k12yPiRztWxzKB%2B06W0W3ynXJCW%2FQ4kClB53%2FyBGWymvlbFPqrDbNls3ilSZd526aGMG4PnsVoqL6ne06pSs09IXXvHmiebX7rZlvweRZLk9i23Tw3rIaTqoQy2vK7X4YZ1ReBDlY%2Fvkf5NJ9EfYEmiWPSTNz9&X-Amz-Signature=7dbac2ac566af51eab92ac609e70478e82df7beb045e9fed5038207478f61a99&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QFUVRASD%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032149Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIBQBuOlZxFDXHICSXN3L4D4J%2B%2Bo8VKOavXe5Cx%2Btyd30AiEA9f49lYecWgWnOop8qVSl%2FU5%2BtVOrF2BJL%2FoVcw2%2B8XsqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDC3QKT0i2ImnNzRaSircA%2BrNjS%2FvGx6wvxrg0PxDwLaDp60bW%2BpEl8vaIMk5O8o0duYwSo4BoVwRQIXFJygqkaYazukCClDmiVnocu%2BKUufrXF8Lf21xh96Bpo8PcVzDMojnUNUYUQ49k7Xso2OCD1O0wh7lbxW4ntQ6W5ZajeglVrkigmIpx7UKiQRDh5gImWi7aoCBUMBq%2BQiV44AkiJtX34Qx2j%2ByE1WpZ4rG2qRzDstQeON%2FPMdFG2HLAopn9AnEZ1ol%2F1Ox2Fcgr71JWBV63lJPD5ojOOVXpqEdUKYkiSxxq4Yz7rxybmrjgGny6Qwu%2BJIdQXIkZzCgSQWheOv0w7JslLcSup%2BqfHPssJcs9U5zm0XQq4VpIRUytrXS3N2Tvbsdq3mJLvMBB7CcXeFDahRAogE%2FHteq5J9uUSoXWraKFldXCDHLn2c9HY4QH%2FY%2F7iX8gxBrznrh%2BUCb3GEZ%2FHSPPZeR3GA0O9b8e48sFAPAHO56SjRhd%2BSFyoTViAyo2yy%2FxuC0R6zPsaHGrqdNvmOPOlFqsiE0ncBXLbmw7GyMH%2F6FHWuunPqgRQyENiKRq%2F4CO1Rto7AnVoaYIgerqw%2BxqqQBL77HzV5pkuzZ3V%2FnkesE7TSyY8VKgHuheCjNPusay%2FVt%2FL3RMMWl6M0GOqUBVhurV3tBdWqRO24iLtH1jLytmDDZj3oxoM3A5w53t4kvkroDaIHe18bDIqbroV8ECIX6SBX5W4XWC%2BC6DsWjpm5%2BwHu%2B6qYCvmFAp7meYknTjnPhuwuLnSTaJB9O629Wo9IGJOkJGJzkXdIQ7b6jYvJLIo11RGMpnAvrNMIEs3KDXnJWw0NOz6kSPGphSwX6XuLQyhpX4hKi44mF%2BG%2BhPhm%2Ff3oy&X-Amz-Signature=8dea922ba67af5ba71830d7dd4ff5d765b3fe5669ea5a09e6ab798e385154bf5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
