---
title: "Visual CoT: Advancing Multi-Modal Language Models with a Comprehensive Dataset and Benchmark for Chain-of-Thought Reasoning"
date: 2026-01-05
categories: [blog]
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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MOGTWCR%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031413Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJIMEYCIQDLhjuUqVeY%2FSQ9cdB74xP2uOAIUQPNQDJb27JJAy%2FZDgIhAKh6xk2xHBwqQZ3fW%2BHr6BfEzkwun4Xcd3ojE6LsttlgKv8DCEMQABoMNjM3NDIzMTgzODA1IgyfWpgkeBapXWyknvAq3AOApjIhdbSX2WltIveYZAf9DSEOIun3HTL5WtSEf2g1Sswur72yNtSfdUvZd4DFpJwvfEWxOJdRFUrL8uiCIO7eZZkNLBdzn7jjnKY3OgKdoTP4ThLqkxEj%2B7xmw8NRrwDUr94cfg%2Bc3E3wcu%2BhIAqghidHNnxW5hkD2myr4OtQDBeXwqd3AF5XHthN5rvVpqTnX5QqrKf88v%2B%2BpWfZLjvBdoVsvhtMgj4CLU0VIxQiFUlDPrCfj8rOuxWcGHygx0Z7KjIkxhchpvpJZAlFCIIsvpowk1Z1rbF5m37o1oT0OW7T8pPT0alnplU1wLcF%2BZzl2LilwBWyo7ch2f66MK2%2BgimTAvJ5jFCkkKN1yFTCMXzfHEdRMhrx%2FhFTbh%2BE8vFbFrmucZcsFrw14%2BfpxfbH2DHCvHBMPqDbE8p2dE7iF%2FgV%2FhgYEnR9G8IwBLT7BzCM6WY9fYf9NUGMa0z5XB7E22D6ONG5Vft74m4iYw4rii95cZ3LcCAw%2B5jcw5gPmu9Khm%2BqXgEjnKrKRkR9BjG4P11o5xP5VcCZdHrEvwL2TUoLVMoChQ%2BGW8yJKcW6E%2BRdxJEGEbDoyJ07qH%2Fi5jsA8JQhhzamlkGo1i6S5PNlZ5J5KiXIuMThjOZr7TD7mM%2FMBjqkAU43t2FBRhMD7OqGdFuObYle0cSb%2Frw8Db%2FZTqvrzkK39eyApXJ6xKYYQUy1VZ9bD4rDDIuUb1QuMMDWmfkL9%2BY%2BWwjqghl7Pg87BpalxxHeW25fHoUDEwrzfcB4d6J0%2B%2FRg4zMpmFCcgi%2BvDmghTtJn0uxAVTMWU9CFMfBFtl01BTsnTK8W2iSjaS5R0o4JPYYRpSKj8I4WQjTSOHpd22c7Sh6u&X-Amz-Signature=d9510cbe8e03f1f705e6653debc41b8df7b2aebf3f7037bc960eb5ce91feb4db&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46674RBGRUS%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031414Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJGMEQCIDC4qtZ4ZQRfYefUaoIbhDlNW0GKtHiOLMrR5aTpQDJXAiBu47Gxpjt85lZgnPgQ%2BRZf6EOiZzUQUz7SKEX65j0O4ir%2FAwhDEAAaDDYzNzQyMzE4MzgwNSIMxdZLgIzqjzLpWJRRKtwDC5hPZ2Ya4gFCBMp%2FCmRQsfMLf9YEl7iEWEem3JmSI8Ae4saSXXSRlnkn2MaZ5IdK1Cy450vHfWC3nFvPHbN%2FA8gEXOhXMmSnhEhTOVsuD99pRejHzFYk4MLO9Sd7wIwZKZglFWaHxH4ZYIKh6%2FSCI3LYZFXRfTHFXzOjFwr54PyvaolfYZ4PT5hnBWNbLJwaujcWtAPxEJC%2FzM0qJbkQjBZBiMlsBUwy7CoaVoAY1FvfkX54RyY%2BNdIhZs0fMDMXwHCOmaB8I2VLp7L55u0IGTA1fNHBgxPSvbD%2FB4qh%2ByzgVMaH2fW6R4CAWq3aDyqTVkp6itu4trrAFLihQANHLcEbaDm4qxDpjk%2B3hrWmwdeNOVdFGBCYf8gS%2B7LGPA2e7XJnHEBBckAUNAjHYPiVUk20Cd93JMEpLbdHTJxty4e%2BEvq2%2FxtjAojffvrNIEeNme%2Faj%2BWnwJs8Sr%2FGMEH1wSZEbZGms%2BvaLGiNzGuPErW0NdRkwpAZqzMQ4uXuRrlJmB4VXREbdQnqVP38gnlSYiLmTGL%2FuHLywxmlU61DYgWbhj%2BlXb68bDBgM4wPxt9FvM3NiB%2FnouKv8jt4nhQoqI3XG0Iu8ThobxF6oyYh08bwiOVHjIbHUGxjA0IwiJjPzAY6pgGK%2B6ArU7wZzkxdWsjwppAdeu05Zf8irzpnaIjQ74Uy2UEAapCLAbC2vXGIqeakpQKdYmMUWcJKMkQkFDoLb1KPa9%2BQThXafsPR735DxZyW3SpgWuOqtfm8cVQnMqemY5sDEUAD34DnsjxLIht7PpAqxjdL7O3LqjJtuobx%2B34gkUkFndIRxFtO654midykwWq%2FEHiJf6iI5KAuAPqFOMoWU0zX%2FgFm&X-Amz-Signature=840dcdce4f7c966ff6a879e444b742c96811ae1a2a8310459014efa39505f29d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663JEEZ3SX%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031402Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIQDtZPg%2BIJE7BdxdXCipyK3aQpm5Y3jL%2BeO37MRYFXnqUQIgW0IyBiGKXUFgBDMhT5rMji6JkRnrmfgB2XvOCXZxOKsq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDOzCfEDm%2Fzc6xKGU0ircA06MsIw2PgQ5jchE70T2mfLFLnGbtg0Df1idfeUGIuCkFe04%2F%2B%2FndphUnN4DgzHJ952MGEHlSD%2FyQCz5Xc6sOdx046s%2BGoGeTtndL9rr8KDsYY6Ihs4l4FPoGja4EP0oI4pvv6IWJQsrC3yFRAqgHjb2TZGIGFF1axVvtJpuSQya2nu1zZjSrJ1VxqfDGVUlHSZ9RPnlM8mEE4jit%2FflECGe0F1Z0t2TftM42M0O4ALDKvirP%2BAS3doc5EAWTMfJ1mmPFcry9kExS8t9sXdIMokFQ3vaX2vQ0kqMeFVM749wHbGxASsvF3z%2FWymQ6oP%2B3lnTU2n8s9cXSVEMgDiJpKIsVp6Li6fpx%2BxDQLV12HyIaTIROcsPbqyc0qnia6mobpNLqWqrh35QVY5W0kyjZjujFL1DrKCo0AoQt05IIs6s1gDDIQq%2FfFU5kq%2Be4kNjoCNs7wi%2FGw7eNqtrlzRHYMDptUTsxzfD%2B88UIcK2%2Bum5nRNztbKeM5HlrXD8kE09xg3JLVyk1I8uSOmbw1V4HXMAjpraPY%2F3EBEkn2Q9DUl9I1j%2BCU%2F1N5FUZO6BnIfiZdsKmKQ2ary%2BGByPbRHuIdMrD5TYgUeobDp5EmWRR180Z4de4Gt2KU5zqXaVML%2BYz8wGOqUBK4Dt6G3tMv%2FYTLO16cIstZ%2FGVVGLaTDlhXkGWNDe6SqTYrLIqlGw%2FA6iFzujtpeDZKg%2F7VEC5Zq2WF%2F%2Ft30TT%2FbLJIM6ZhFtYjtiXpU9y5o0xrfx%2BPr6lYNUM%2FoXoAjri8heEJeOPhAwOyS9v%2BRk7lUr5D0NOwJidO%2FxeYrfqzHg0%2FTVudm9TKQSeQ5LJ6QPfhjKGXbRPBukgC0DOFQZ9oNrUFh0&X-Amz-Signature=55f8e9a27ba76e1e0240715c8762c42182b26062a5f85d789c15eec81f4a2b4c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663JEEZ3SX%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031402Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIQDtZPg%2BIJE7BdxdXCipyK3aQpm5Y3jL%2BeO37MRYFXnqUQIgW0IyBiGKXUFgBDMhT5rMji6JkRnrmfgB2XvOCXZxOKsq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDOzCfEDm%2Fzc6xKGU0ircA06MsIw2PgQ5jchE70T2mfLFLnGbtg0Df1idfeUGIuCkFe04%2F%2B%2FndphUnN4DgzHJ952MGEHlSD%2FyQCz5Xc6sOdx046s%2BGoGeTtndL9rr8KDsYY6Ihs4l4FPoGja4EP0oI4pvv6IWJQsrC3yFRAqgHjb2TZGIGFF1axVvtJpuSQya2nu1zZjSrJ1VxqfDGVUlHSZ9RPnlM8mEE4jit%2FflECGe0F1Z0t2TftM42M0O4ALDKvirP%2BAS3doc5EAWTMfJ1mmPFcry9kExS8t9sXdIMokFQ3vaX2vQ0kqMeFVM749wHbGxASsvF3z%2FWymQ6oP%2B3lnTU2n8s9cXSVEMgDiJpKIsVp6Li6fpx%2BxDQLV12HyIaTIROcsPbqyc0qnia6mobpNLqWqrh35QVY5W0kyjZjujFL1DrKCo0AoQt05IIs6s1gDDIQq%2FfFU5kq%2Be4kNjoCNs7wi%2FGw7eNqtrlzRHYMDptUTsxzfD%2B88UIcK2%2Bum5nRNztbKeM5HlrXD8kE09xg3JLVyk1I8uSOmbw1V4HXMAjpraPY%2F3EBEkn2Q9DUl9I1j%2BCU%2F1N5FUZO6BnIfiZdsKmKQ2ary%2BGByPbRHuIdMrD5TYgUeobDp5EmWRR180Z4de4Gt2KU5zqXaVML%2BYz8wGOqUBK4Dt6G3tMv%2FYTLO16cIstZ%2FGVVGLaTDlhXkGWNDe6SqTYrLIqlGw%2FA6iFzujtpeDZKg%2F7VEC5Zq2WF%2F%2Ft30TT%2FbLJIM6ZhFtYjtiXpU9y5o0xrfx%2BPr6lYNUM%2FoXoAjri8heEJeOPhAwOyS9v%2BRk7lUr5D0NOwJidO%2FxeYrfqzHg0%2FTVudm9TKQSeQ5LJ6QPfhjKGXbRPBukgC0DOFQZ9oNrUFh0&X-Amz-Signature=c2cff706a0301a0fe867eb8f31b6d2bc625b04d0d10fec18163d2cafb7f63d46&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667IPBPIPW%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031424Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIQDmKBBiHqi%2FK0CVF0Ur3k5a1blopyOAVNqxHoMtuLOjcwIgTAZwDlxdnNAnXJhXI2ITQs%2BEjlTWPF8%2Bhj7g4IuYINYq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDBP%2FZFqV4Ha8%2BhzKPSrcA4GG7RbJ8cZFXQtnoJ0hBc5NVu8H8qpxBzLNvlRz66rpJ7qyDaEv6T3TGLMbYyHAKb3ULCmmnBN5sZNbHHPvttknqLzuLNCeYBNYAZ%2BbVmcxskcNJ5rWH%2FTDnrorliNTcKzbK9sSvJqaOoZR11Sgzu0tttmc0c4rt28Fv%2FGKRdv4Xpy2xuzR0J1Hqo6AcW%2Bq9uhJRGqAKqKmxkI%2Be4JNcdzm8x0QRFqHsv9rNoYm7TvdS%2Frn4s2Yfr3AOLAwni92an93oQm4RJiTkjPMcknqxXC4MwKNNQ0bEuwjjoe3FJFnpj3rbVzgWm9RKkn3yMEz%2FugveTQFbiSMb4yvBksImpm12zJpEL6dQ7HKTk52hyc%2BH7lQkQRjwNuGxISG6v5ImFr78gQaLZbOsRgIa0vfoUxRjqjc9VK%2FlM3va6FMdvsh4hu5gSeUuuxvO8bK1NdI8g1jDFop1JPSdvNb4%2FBvF6Wd7JIrghRvdr%2BrG0Rr8y9UbfE5NNkyWk%2BcaR1uWWKe9cosO6iNUjGQGM%2FG6l9Ejc2d2AyAl44T7iQQxCzRlPfWCn%2FBV6uvDcg8Bzf8dnRcEspxIvChKyNkYW3iEcvOE0ZuGnvcBzqXSSHN78Hy%2BS1zs0Wy5S6S%2BaVxtmBsMJSYz8wGOqUBw6RqKwAgA0zYYun%2BlW07qS%2FqVSXpQkjG%2BPGjauWe7l7kVmW5cOKweeCVEnG9i5xLTjiZY6Qw6IVNBCiMTZl01JGTJBW19uj3hiRDYdzqy5lXSnsHIBZI6bTcIU0EE8DaDwdLA72%2BOHSu9UKDZdclF1wOJvZ7F3Qgp0usyrRgMhplVau8UXdFT1rrXfCiZQVzjj1OPsSmEPWd0KuRRFNUek7VfAeZ&X-Amz-Signature=d5f0b509d3eb59188952fc2242b9b1641a35105b3e293eb9edb4642cc5b498af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XYT6AVVO%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031443Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIFwiqTd%2Flh4VOWt3aRL6n%2B4c1JJk1Cb%2BmIXIo8uT7qknAiEAugzltS77KDRhoxOk1qyjcaf2Nclhz3xTxPJlpN21Cmsq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDEZ3la3T%2Bzww9Jl8HyrcA6ofAybcDujcC%2FDGEcW6RNTkozyLLLowzYg6OQ5RVEVC7%2BElWL4uGi2Kdm3aLA%2BjvyChV3oFkuK0edy3edzoNW9UcNJcEAZjMk5RVPr9BkkRxkkTM2kE6qxOOm7YzsOiuLE1NwK1zAptHznv8xeLdFMYy2w7ytlDJzK0V%2BWSgs468BYUwjwf%2F1SpXRKocXWd46bpEk3e5mbZGTHDG8SAmbEbYIpuGuOze4K5%2Ft9yaa6vsplooD9besvOZGo7w8TfnHpbP3rtrkasrc%2BqhbtJdjHdA%2B5MqAYDEAEs5kC6mv0L621j0BMbx%2B4m2OihmI7KwhOaNsyAMvs%2Fn5QMHQM%2BYMeB%2BhYOKoZQ1Kt3kgI5zDxRAktjs5zQ9AYc8iXl1oa0LX%2Bvl7%2FnHvfTzOX7jwqJX0%2FVXjtMgBBTCibhYveRYhaIz2mB0rVibXtygHdtr6QMvk6mRtjmgJ8%2FS%2FL%2Fm01X7IMcYV9VzPedBmYBgMy4MNVmdERBhRTiz6shLeDcj5BVPpf1Udnzh%2B5hDh3hBGeEzwohmDO2aU2h3gzgrCNSU1woJb1a3KLVAhauzaHb0nbnLRIiqazlgHZivBSMGEBV3o7e4bfwJ5iP%2BV2iB2PpGdRJpcb7Y0EC8CuptL%2BEMN%2BXz8wGOqUBS%2FEq4NiggbkOsAtnWZVgT3Yr2WQPWVo3aCr06BwFRaI1C%2B0eV1UAnj3Feabn%2B%2BLb55h0XC5elXvYYJJEZdQzxDEKvgkjV6ljnOjt6Jw8s%2BRTK1qa1nGMC6GY32OCalA3fflrutknzpJNRw%2Bm5IcZH6g%2BMJQPnUCfXb%2FWTt5SgX6Fkix1aBNNKrvO%2Bsgx8avp5ctwcVQIf%2F8tilm6ADutnTcRal5Z&X-Amz-Signature=a99491e1aa32de586cb9c016e3b528d4c94daa5729d0d853a076fecc56e22373&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663WXAZTRU%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJIMEYCIQDJ4UHOBkE29aB%2B%2FSe1Bo5RN425ATIS0uK6MNuZvf58%2FQIhAIDFemsgZEmsUBpij74GM9JKUkGNpcMUaqyRBXq1DgofKv8DCEMQABoMNjM3NDIzMTgzODA1IgztJ3YcMVo8%2FJJBUbEq3AM5hMd8n9vlNRrLk2dGJWsHprsqyJHHR6zmxz5jjuQ21Zu4ipkgi2k4UIIKpm114iMTUUc7u2dL7pJqWnfCd9me1asjKvBDfJkyvE8xgTF%2B2EQhSJc2edVulav4TTHHX0TnB%2F8mnAlutUk8P99OqreHixglZb4H%2F1Zg5tqCk3QBF8DYpoDd6E5ryAr1%2Fe2ujxq6KKXSfoiHuv%2Bi9aYv9KGRNXZNqbmXo%2FYiE5T17SQm%2Fpw5jYQf9ajpiIylDm48TjxUOqE9pxogoJ4y9ZsKjuh%2BqwDst3FnasSSsnkPuOS6wrQvSDocStm8FuAmqM7UIUQGRhX8jao4cYaIJ6xCbe2swx4MHlgc%2BPoo8zjNbUn8NxZOs8eJX1Qcm8nmWJLl5By%2Bt1WyXyEt07w3tS62EHicFTGex5cWRTowETv%2BfS4y%2FCUTl485N6D8k6%2BXKByGIFZ9hlzsdzzpK2YCs%2FZnfA2Uonnrzz0btfBgkI30dN73vvj6%2B1KTOMlvrxVhyX9fHed0xb3IksLHSaFi96MqEZ2wipFDXlMqmSOGsINWTq0spb9rENWr6ETYBPKgh1fqRiaoxkUn0Eifs9E29CPkwkAWBhvkGkx2cMF2L%2BLXnkXtbbExgZk2eslTkKmn%2FDDMl8%2FMBjqkAWlNP6mwpGtGqvSNi1ykrE5YY8zO7UEi0ennp1xsfdrJgz7%2BYbZPGl5xiXl5d0HfpCKRVSrWMQHplpt5H2OPXtbFFUHURv1apAbMNcMpNORzgUhS4r0IAYp9EaotBu39JOptKXkXy9fHpXjgBq%2FDaIRQhb97W02MXQvRdeNZ9ll7vz9mHAG7Gh13GNuKQ3Ibz3JYRKJbYoemy9Xm3Le2tHyVw5xo&X-Amz-Signature=f1ebd9b848b07a0fbf9d241956ccf072ed633e2a10a01839a485f36428b3deab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662HL7BYKZ%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIQDJfMny3MLyHMlavT4zbepx6S%2BErBlguRdAOUl6inMxfgIgKhMCZbYy7y%2ByUelJ41gYGWf7zbw6H4ykBq7Uv0KGXYAq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDKjW17qVNVOvrFEbeCrcA1Oz6GMBFP8KbN%2B4G4o4D15tH2P5k%2FxiVZRp2Q%2FhRWafbY41sDeDbK7Df%2F0YhTdyCc68XhxWsnmpcVCe1GJSUEKa7uFpXIfAROcuyJdCJP7d165lNYryB1Fpm79jLHsVYJtJYhiYGLPja9FtGJ%2B9zYOP6j%2F8Cnqlu73vLl5j%2FtAD273GnP3skEliHR7jZZD3u8Uob7g76lNbgaoN1LZfYNeM2Gbs3Wh2ZB0Vyctq9st5iu1KgwZe9ox87t0UkQaHWNbDooXmsPHc2zXNqAZ6OtJAwJ3MDgShvug8E%2F3%2FSsIR%2Fyk1AtB6DWrSadJoXhtdY2M3xoaavJrsFueKpe%2FdxH5ELLQsDJX7xQ49IVSvtlKWawM95bGwWMzxjUGB3nbJdKDamNDpv2iTr6qzqGQW6esE7EJa2gDMs2IvWKNpPVKONBUxqTNFZ8N68p5haJvr%2BGqczc6M3wNFGmHLWcjeHlU3wc91nXmjxEob0Sxh8Me9to1MwXhM0aVt1S2uIDGl2Lf57tWZCQhMjEiPozMEcBke3ZaqMUXR%2BL3BeF3fRN1T%2B1w2iaKjj4SToeCQO%2FIK1eL%2FFNAc9nzkmhOmRHrs8OQwEZZjrTxp8Tu1CZBmdNFFnKFxhh9gLBbNahD6MIiYz8wGOqUBWoiViFZ5WlAIRe%2BDEmR6yrU%2BQoytn8ERf2saAacsgiDohaNfyImWs3cJVu9AOTaiS%2FiFhK5lueBc657ZRv5BtsL7pwyEXC4fd2g01Rm3wzr1893q4Dvc%2BhihY%2Fpw0yvXfHJyC3Oau%2Bgf%2BRgl6fyhP9bR%2FkVg%2BeWsiw6KI8rmedxwCqn5FeL7deI3y95VIuGH1KL2xF8xdeEA2NdJrKEyhOTQMUrc&X-Amz-Signature=8442c3ccf3acf4ed337a90870f99ac3a3a3313c13febb100184ca64976d2b6b4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S2BAMW3W%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJGMEQCIFhzsSBBDj8M9PpijOVoPP7zMwITV1s1EAD%2ByT1pQpwlAiBt07iWiWPsvyZm%2F6pKzdy4n%2BeC0e1E8mYZR6lfvqpE8ir%2FAwhDEAAaDDYzNzQyMzE4MzgwNSIMNqoqy8ucLgK3i%2BEfKtwDXN33otnThi9ZIzMswk1SRNIRwMduSxD8jrXcngrRpXsE0%2FmdTUGcYsprbw8EIlkIaY12PykLcx94q3Qb6zxzqWNO2t%2BcmqOKtoHHesHJ64hg3%2Bv7mU6Z%2FYyx27pTeBnfzAlmBuXCIXbneKiWLBQ9JH5nKCvknbUTnvaSNzdVI9GHtnZUhQSf%2FIJSvBExnPTqtzRxrSmjMcoHyMt29NpfTXn5ICmMjQ6NnMAIz3uyuKBfBuBHkOtTGgfsIiLQLz5rySBA0vRQb%2BWO8IOKfBh7uj8Ed0eaxgKEvhizcXVQQPU5i63dB4vwAON%2BzVJYp9dbe6EFORl1%2Bk%2BLjtfDqpPcf3LhKfHwtaEever2clpsar46mBLl3ZMG%2BCapQJ%2F8wEKn7qoekSehyPBQYNGbUgLWYReUPulhsPM4m8fpM4VVsSdZ7%2BTur%2BUepX0psDk5mNXSeVcwR2ss3MoRJdzNsAlcOJwcR851uPxJeQRceVf4J%2FN5jH3juIXneu0gtBPgeaFAdCCi6NiartYqLOEe6USKsvtW2c3lhWmaSPN%2Bbf2S5eyAWx5XG9ztsUdhDGXBYENm3VRONnx6LgKzl9mKB7MQWbdvLHBDmntGjo%2FE%2Fqnn9PPn3c8CWCfxSdfj938w8pjPzAY6pgEfPx57Y3woTVO0ERekD95MrMpmZH5KPHCkq9NNbxe%2B0PWAhilocRissKwaz0lYkGCV%2F9xBWYLR6wtqfNnfkqYgNYI9lRmxbGzZQjFJVsZ2pObIkhRgL9OVdbU0twWpoWp6o%2FqCAwzxZGCiYwIA%2BSG6hBXCAPqiHfiIFObfnhH%2ByKKOrrwX%2Burpku7tAySsL%2FY4yP%2BKEhVJgUrnqky8YxhjzRidCUBO&X-Amz-Signature=836fa583ba2d32d42d9c94450d7a75a487d86e55727c4de1666658d214580234&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663JEEZ3SX%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031402Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIQDtZPg%2BIJE7BdxdXCipyK3aQpm5Y3jL%2BeO37MRYFXnqUQIgW0IyBiGKXUFgBDMhT5rMji6JkRnrmfgB2XvOCXZxOKsq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDOzCfEDm%2Fzc6xKGU0ircA06MsIw2PgQ5jchE70T2mfLFLnGbtg0Df1idfeUGIuCkFe04%2F%2B%2FndphUnN4DgzHJ952MGEHlSD%2FyQCz5Xc6sOdx046s%2BGoGeTtndL9rr8KDsYY6Ihs4l4FPoGja4EP0oI4pvv6IWJQsrC3yFRAqgHjb2TZGIGFF1axVvtJpuSQya2nu1zZjSrJ1VxqfDGVUlHSZ9RPnlM8mEE4jit%2FflECGe0F1Z0t2TftM42M0O4ALDKvirP%2BAS3doc5EAWTMfJ1mmPFcry9kExS8t9sXdIMokFQ3vaX2vQ0kqMeFVM749wHbGxASsvF3z%2FWymQ6oP%2B3lnTU2n8s9cXSVEMgDiJpKIsVp6Li6fpx%2BxDQLV12HyIaTIROcsPbqyc0qnia6mobpNLqWqrh35QVY5W0kyjZjujFL1DrKCo0AoQt05IIs6s1gDDIQq%2FfFU5kq%2Be4kNjoCNs7wi%2FGw7eNqtrlzRHYMDptUTsxzfD%2B88UIcK2%2Bum5nRNztbKeM5HlrXD8kE09xg3JLVyk1I8uSOmbw1V4HXMAjpraPY%2F3EBEkn2Q9DUl9I1j%2BCU%2F1N5FUZO6BnIfiZdsKmKQ2ary%2BGByPbRHuIdMrD5TYgUeobDp5EmWRR180Z4de4Gt2KU5zqXaVML%2BYz8wGOqUBK4Dt6G3tMv%2FYTLO16cIstZ%2FGVVGLaTDlhXkGWNDe6SqTYrLIqlGw%2FA6iFzujtpeDZKg%2F7VEC5Zq2WF%2F%2Ft30TT%2FbLJIM6ZhFtYjtiXpU9y5o0xrfx%2BPr6lYNUM%2FoXoAjri8heEJeOPhAwOyS9v%2BRk7lUr5D0NOwJidO%2FxeYrfqzHg0%2FTVudm9TKQSeQ5LJ6QPfhjKGXbRPBukgC0DOFQZ9oNrUFh0&X-Amz-Signature=8ed4d4b92aae42a7b04f694bd511ada50a4ec341e0b65bf1ca2e0f1c8fa3c40e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
