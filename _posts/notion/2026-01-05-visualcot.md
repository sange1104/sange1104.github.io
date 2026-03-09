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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666QR3OFAJ%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031727Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJGMEQCIFPX6mLSafRjC7f3OZMhatauAK8vcKlJ2QmbdLgxFivBAiBFmA5iVaiA%2BCrusaQYbc%2BlgrAtbL1azvbuxoHWddNA2yr%2FAwgjEAAaDDYzNzQyMzE4MzgwNSIMJeKZAX1c3Abd0CnDKtwDaYTy2v4TpG7d%2FtoyWGpJaJp4BKjMjz9dRIdR%2F5AwgdpSHKAXt%2F41AfpvdDl4pGWQ3PZVDzMIAGo1WUyCMAycMbereyOj14YDSbTcN96Fst5mM%2F9bQuGV8MyduOA6NibudEVyZ3PEOB%2BKsZZtdhmFugMN2HdbaKzasdjll26EZ2mqYO%2BKTgUrDrffAUH%2FHRroiExdqxyBqrqT9fAS18rKWUgNNtK%2FCUn%2FG0e71uMuq0Fa8eQeJXV58%2FC4u3KIVTr3uLzTRoasI0yqwH%2BRu9kLAXSjeuBSoiuJqRc5bmsxc%2FlcKjd%2BBrtbrXLz86H5h5D%2BNCYxO1bgZz7wYIFzCyZK4PAyvYNi4cdpEv2eFitZqYSwWgZD7%2FSlfiNwPUEZnNYReNDla84gk%2FLWSiLwR5FeFDYLq6sWB1jXEvqfZBJLBShJkYwPJu29u6vm71hC7851PM2df%2BP8KqmK%2BnRnfB%2BjjIjJQWkQXKKrYx8iMDpOt%2BBKd3aa8GseqDDX4EvntC4bCnZrcZNjjq71l1NiseSqDAzRlY8Q2MSEopE8ALe3nYi6CgLhTPu1t8kCW%2BrkA2GO8XYPugTOHXDjc76k3%2BS1x5FSgJgdcMqz3nu3abQOTxQ%2FqZswKq8yDSCy46Ew7dW4zQY6pgE1xOeciwH57f6sa5P8F%2BguhuwdnjaYKchBLYbukklSsbtsd%2BLHORJplkieUqVIe%2BM4bRIOVXrgEL2M8yshSW%2BVcz77%2Bd3jhj%2FXB%2FbMnoL71b%2B%2F%2BPL4jUgMis4vIyE9pHVAcV5ZzbjBSJb3kuRRMmv2jH0U1LwQ2Q%2BgkNHRDFuvOGqa5A9FcckgGFTzG%2BfyBl3TzW60O%2BNalK5hyA7ojJgU0NT3rh20&X-Amz-Signature=4e51e968a9b59b5dcf75fccf45199887ad8c2e71682d76f4902ee35568ae83b8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667OGFN4BF%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031727Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJHMEUCIGYnKWjwW68wLHKR3DfIrMtYkbLap25%2BTpykjlBvrIIYAiEAnhZ85ts6kCK1vhu3X%2FbGSFh6%2FpryqNB3dwlSoYpFGrIq%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDH53ge8imXErPGOajCrcA5sWezgZVf%2BRvSAV3kuT9p5Q9sgptY85uz9ssuEvYbPcQZx79YlyQuJ3O3WjdhScmVPyHfVyYvPZd81QtxXMYM504v3nBthGzwXg8SWdAoHoPlPR3hjSWBmRD9pVAkbt0Lq7SjWNFlKOrHTH%2BPg6MOmwR2icDQ1cf9Ifx%2FlA5n1NjI4ZfURm7ckRXy27Jz6drSSpjt3m3cszHJWhlKidRimIepGnxm4Ng41vqyj%2F9sJKr4LsH4wl8oZdZv2BxO41FaZMOi30%2FgLYoDgVOAdjXvjHn2XhhbPESgt13Nj2zExCGFr06%2BmOHM3ak0EPe9On33u95NDws52Q%2Bj77V0qXyJ%2BN%2FHgl7RYtGSr8gHFvE7D8hAnsLodPRcZ5Ig904cheOEeMBbnedBWO8y8VSC1n3Kqkw0%2FoJul18AP20WbMta0owagNvR4RuCZGLroBRoCe8bnt%2BQR2tNkfCTkDZvYxDOJ94eVnFtZMzbEXgjpNPWv9oail%2FY1qa7af59JDXVo0oRWwzk5s62gLX%2B%2B9gq%2B0CwSLxqLFkkMNt%2FbeYvtcXkWegHEUMIh5tXQWx%2FfoY0PLvuwCJ4HD4yUFc6mFcurtfiu3zi%2FT8OF34hZLqJPrHpfDmDfwgHv9SP5H4woHMOXWuM0GOqUBwa4MIObXqTjh5JIQH0hBRPfBuzicaHxHglbJQt%2Fdnnk5LqLbcm3BReI%2BUikIUcMBj9La6p5jAbU0XNcOvFeGbyWbSo8UHfmcoAD5njAr4sYgYvnOuDMxuKtiUxrDansGJ12aQFKoiqCrCI1Ad4C%2F%2BSZ6Zeh3KEno%2FqNukQ02BUQW9NvMXGXNebAqStpiRUDwrlGnyghLKlAvunizbL4PKyANYCpa&X-Amz-Signature=dedc100951dd8a8ee1d1adfaa4a968904515fc5114b48cb7cfb5bfddbddcc5f8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664J6SW5IA%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031716Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJGMEQCIA%2BHNxIxuXPbxX8hgU7sHCH9BzaZiorSgGE%2BQzCi37VzAiBFC%2BLgvr6GLqPtdpzDhkLy2YKEywAcwMfl2%2F8d0Mvuxyr%2FAwgjEAAaDDYzNzQyMzE4MzgwNSIMxS%2Bb6cL5Xy1lMMHNKtwDKvjR5DZ7CFUg9bYE%2BrPmlU6RN5dLV56mIPxoCg4zzsez1vjTSkGPixW0iAiT9BU2NDRq8gE6X%2BmeZHmcxCyZlI7oelUHOy5cE8kgFbBMCy24OZJzB8H5yAPAYhs7G7euTkKnzyfaCSB%2FDkC0hWnREhF4s8Rd7pdFgTnInVTaj6pT%2FzwgRGgOoqgkEZ4lWxzSReoSUZGa1QvFLR0njIl8Y9AX%2BbEbRF%2F2X6PjwVZtSEuVM5N88X%2B6%2FWRX9royZstJSSIeX%2FKm%2BgGkCfQ0%2BaVJgbS%2BsmycmXzkvVQ06OSx4xBQMpHAWN5cCtvwf193ZoRNqhou4nyDQbC8F5QXaK8pdPbzCP2FGDTTVjmoT0V2kq6VjhPmG1O%2FAjOv40iNpadw0Od9deY9MEjWq3%2B8l2wjf4GAbt1ZQQHVIrf1DV1iIFqmuaflCpkVcmJ6bPfH10A3G2Bo0FqeZRc8%2BDu0Vh5WS2Niwd8uYlvs9tmuWSA%2BuA34%2Ff43M3oGez63EK%2BQZaJCj9QzWPLQaiH2Pz3DNrGp3AGAA4ycKtNYhpFh0zaa4VvCN%2FU3Un59mWOBdc6qHg5UHUdjrYpVZ%2B1qBmbIS5Zjqe8LPlUEEzVVmql93x0udadreYcQ9lgFToBamWQwmde4zQY6pgGK6pJ3JsTFZnr1wq8GCDUHOi1kfb3SVPtDTga56NpUXR1VLoKYcp2X%2BAbWks2nv%2F52S3DhTAE2ibdPfx3PyWZ2A2%2FSZME7eAHm20JY9fAZ4BTriE67nOpU5gnO86hyLx%2BAcQfzsMyD%2FgmpvOFIR03TlJXwwBRQ4O9W4p04SIuR2INPVRQ%2B%2F9HV0p21QgfVDKAlptfiKlFEWURhYyqg2M33g%2FpqHhSN&X-Amz-Signature=11bc3271392d69b32e48193dea14f53496a33129d1e4d19c0e8fa0d6a55f3420&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664J6SW5IA%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031716Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJGMEQCIA%2BHNxIxuXPbxX8hgU7sHCH9BzaZiorSgGE%2BQzCi37VzAiBFC%2BLgvr6GLqPtdpzDhkLy2YKEywAcwMfl2%2F8d0Mvuxyr%2FAwgjEAAaDDYzNzQyMzE4MzgwNSIMxS%2Bb6cL5Xy1lMMHNKtwDKvjR5DZ7CFUg9bYE%2BrPmlU6RN5dLV56mIPxoCg4zzsez1vjTSkGPixW0iAiT9BU2NDRq8gE6X%2BmeZHmcxCyZlI7oelUHOy5cE8kgFbBMCy24OZJzB8H5yAPAYhs7G7euTkKnzyfaCSB%2FDkC0hWnREhF4s8Rd7pdFgTnInVTaj6pT%2FzwgRGgOoqgkEZ4lWxzSReoSUZGa1QvFLR0njIl8Y9AX%2BbEbRF%2F2X6PjwVZtSEuVM5N88X%2B6%2FWRX9royZstJSSIeX%2FKm%2BgGkCfQ0%2BaVJgbS%2BsmycmXzkvVQ06OSx4xBQMpHAWN5cCtvwf193ZoRNqhou4nyDQbC8F5QXaK8pdPbzCP2FGDTTVjmoT0V2kq6VjhPmG1O%2FAjOv40iNpadw0Od9deY9MEjWq3%2B8l2wjf4GAbt1ZQQHVIrf1DV1iIFqmuaflCpkVcmJ6bPfH10A3G2Bo0FqeZRc8%2BDu0Vh5WS2Niwd8uYlvs9tmuWSA%2BuA34%2Ff43M3oGez63EK%2BQZaJCj9QzWPLQaiH2Pz3DNrGp3AGAA4ycKtNYhpFh0zaa4VvCN%2FU3Un59mWOBdc6qHg5UHUdjrYpVZ%2B1qBmbIS5Zjqe8LPlUEEzVVmql93x0udadreYcQ9lgFToBamWQwmde4zQY6pgGK6pJ3JsTFZnr1wq8GCDUHOi1kfb3SVPtDTga56NpUXR1VLoKYcp2X%2BAbWks2nv%2F52S3DhTAE2ibdPfx3PyWZ2A2%2FSZME7eAHm20JY9fAZ4BTriE67nOpU5gnO86hyLx%2BAcQfzsMyD%2FgmpvOFIR03TlJXwwBRQ4O9W4p04SIuR2INPVRQ%2B%2F9HV0p21QgfVDKAlptfiKlFEWURhYyqg2M33g%2FpqHhSN&X-Amz-Signature=241b1cf65215555682a613bc811ac43d2a3118302829fd7b524f6382cc190ef3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667TTXJFRF%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031732Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJGMEQCID%2F7Njjt%2BozQN6wnVzKWuEqrhwjpql3xUfuJQ87%2BJpD9AiBgmdvXoZdYXoj4Xj3%2BYXyL1KnkcinidnGlf8CTkTTp6Cr%2FAwgjEAAaDDYzNzQyMzE4MzgwNSIMhWO4RUufwhxUSntkKtwD431a5Eq7wMKL%2FqEL%2BUyCPRi4YfwPAvRKtl8em%2BRU3UfJ8DLodQ%2F0BrOetjrFC9299bql6Td8uEZcbHD%2F0XuacSRPO2pNw44N65lT%2BJJ%2BeFi3moPj%2FiPEY7C8NwKvaQAO3VdGl4%2Frwr%2FhQ1TLEhbjAqybHvXsad%2FtXAxInYvcdnjI%2FqLplHZyF2nK07mHxRsekcyTpaSS67ACYZFu5O%2BDvt1KMeGI4xJ5RkNevpecrTgIIvLRAVCWe%2FpJ55%2F2i6jl1V29FocoDV8Oui89F%2B5u47PIK%2Fm%2FFvjP51pACmjKWyUEchlws%2F%2B5nEuxiKpqDz2oigEgCvdlTa9G3md1FS1MYxntis9BfjXY6S6B6uemi8Mbgag9TP%2F3O5qqrjk4mLXmc92pIDbkv4CfZfW%2FYaS3tc3m8nV8dWzU%2FrAHCKoSC2%2FSM%2FXDrc17z9x3PKH9Fc2qPmc89YIoysPl4C9oiwl6quR4m6%2BeLajoHTse2MFWDrd59hOfanSXoIT459XSXBPAajTkpDOaU42M%2Be1YjKUE9l6lHW2RIccJLFISfk6mGXOPCn7dgCY9arpT51%2BsFiWBqNi5KoXo4jOfFl7mkx0797M8o6h%2BZk0tGRMYIROHsaBVvpRaWVXaJ2AQLUYwwdW4zQY6pgG4uW4qIOywxrPMW8TnOgQUtzu7iMsp2sDHS%2Bc6mGlEwn8YXPAWi9XRMQ%2BkpErnyJwZD5GCe0xuuo88MrZFrzdiHs9%2BHQHnU%2BiUOvRYAxf9JX5vUsNO1nq5jALDBh7EKnzgqEonKnEj0%2FeC6DfmsBAwhh9BQp0fkmx899oiYyg8nWWEJ5zgna0g2y8%2B%2B2KhppBWGu%2B29dPvtAkRRE9dHkUMlImwmrt5&X-Amz-Signature=b2ac6ba7fd7308ef8990244f473a81bc43f01a04a79c46ca384814b5c12faf4d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667SMAU22U%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031736Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJGMEQCIG2Kk6dHhqO1yHRNufvIurmFoFZxRyGX7aQRy16AA7PRAiB%2BJmombSPuozR9knJ3przwU3TvbHPh7IYDgLNC9L0Zoyr%2FAwgjEAAaDDYzNzQyMzE4MzgwNSIMHFIaQcs6tWRm%2BxfDKtwDaxe8f5EdK3NfzDDDjUTWLT3dHrkaHssAB1tWpTebd5XcdVag8GCM3qmcCJXncN2RFcaBryrnSztkM2%2BO0jo0WtPTkaDVe1awOImipyeFJMGAVCMYEiCzBtZA84S%2B2T9Ms4m8MRijj7J1BORnGOk%2FPkpx9%2BE2PduO5fdSMLkts%2FKKbwu4%2B8oST1vcECQt3cVo88jaRs49Auk%2FNu0Wf6PqICJ8mWsRQgt8fZLzcP8qYtcp3knRqI52tLV2Xd7mvM4otylBfwbapekZFtY%2BRrHgcZMQb%2FMGeWUeh1ow8RuW7QyhDCrS%2Bsy8RcD7CuMOp47YW7KW%2Bj2wLjRXxzYD3UNc1R%2BS1Wif0TBT2Nj0PqYebLsUbTLy5WMSG%2B95wIddVpM2XxX9q1DoGJMlgvBxw9WvC48qlAM%2B7DNuKUE6hnSKTE08N4rCVudRKGSuqc4cMpvIoW1XG%2FjxO%2BYGxpcAcaUIF1yYJVjLXQuCPK7u0vZGz%2BJaeUDc%2FytMj%2FKQWPWV38Ly2R%2BYm7kHUoTdWp39fRjVSOJqgnknFVld81PMaF8TimoaJFVC9LVcWLkUdBDGi05R8MY583ld%2B5pIHjJJ8t0SZUKu0TPUSRS3ZDS5dtwYrjAg4ieJRVSd6mqDfecwmNa4zQY6pgGeaq7OFNFluV2vwRNb1Wfn4IlNLWucOu8dywW%2BqLL0TVnClBygbxcTnXLBWVw9JdUMOtIiPr3YAhK%2Fy37Jvt6GD1eOsN%2FGFziZUS0zRn1Rz2rSh2ja%2BZ2aJGzppkD4GpIUswPfoXoRLj5NxjYq3Q0y0PUGDuqfzCc6vgO6nwr1TDhd5CQCbPdaBsBfuERdWKyIODNmv8saOn%2BjHPYR0BCGNPJjt7rU&X-Amz-Signature=958d741c9b2eaad44f8a88d9245775581b4b87c63c140d4899896926f24b5b60&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VYERWGX3%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031738Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJHMEUCIEb6tFS%2Btsd4PURvQapaDKIYr1j0V4b4pZIMlsfFQpNzAiEAqWe%2F8Y5QQGmHxyxreBAm6zkCLGMC1XWby%2F47KWnaTgMq%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDB9cRsR%2FWy%2BBYxArwCrcAyw2Nk7WQHpJj5OQnZseJqC9Uzx%2BENUT%2BbZYE2V9eJPKrF%2BK9KeBuXkx5r%2BcMYvmr6%2BvQtkIHIxv1m4y4I0LDMpsp%2FVLBIGJjG7CCdwbT09qU%2FjBQUgHDPbJye6r5fWOm4ZGw7dZus8TcAsyqcQjtojWDAR4xe7%2FTMx2mB%2BR341ut%2BfTmUWaWeimVp%2B%2B%2Fm8lXJNviR%2BLDEr7ylN5j2dVbB4i78FM3Fhlb5%2Fq%2BZJrORKPOCePQ0j%2F%2BpeuJeT6MV1%2Fhzfd5lYg2vJJyN4zlxRJxDIWm0lzsivniVSuiTVb39P85B1M3gpWPEVOIbrod0BbYXY%2B88ufDaHareKbd3AnRH8mgTxk23F4h49WceO5zXm1ixRrhqFPUxKFzcN2zD5D1jCfeGlYt54WZ%2FQPYd0kNz%2FKUf0cuUWLWFH6yd3eDMRAUo2byxPlidkSeichP0u5YHSnJap1%2FQK%2BNCL7iLhO016EokzsNUr8Y1HwzOOoPdS2zoZ4hiZjdEE0uEK5OhYImkAJsW7Qcb8r5X6YfW3t%2F%2BIpLmwW3wZNFnrzyUOc%2BDj4Xnd9ZR711y%2BWYDHn8r%2FAUMS149sk%2BIfjpCt%2F7wvDqN%2BmA0U2sGnZyN0MkdMFlP76B%2Bu9V0AaXpuOX8wMMNPWuM0GOqUBf0pOTEgXoKURPJ0RQjbogIki9bLjTBdTk6ioL09LJ9ak8ez9SWSKEDSgMz%2B5PVlVbfULzwbTrhQJ3MB%2FCpNNZmx%2BEekdM1oqJSNPFNabF%2FttUPslEVfeqLqyk9obN8n0jNFu0qTVKJ4ccIjgVZYxQ0dWIUQahD0rPZKtey2q4kHLCfkQDOyY0Mff4pvm%2BIefmisUQtmew0vQDn%2FNDhrZsRAVZxAP&X-Amz-Signature=5efb0f49a07c338923a2bc5d1be4201f0d0828453e25ca5007c6dfd067ff83c5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663NQRD3WM%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031738Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJGMEQCIEQ0QkcalbuWCu%2BW2xiDhvOMppAlLs9RAEQzQDaYxAzoAiBXHjbGDIYekJYK%2BXbrxZNp4wzpAZj1ae5Uw%2BXTArZpDir%2FAwgjEAAaDDYzNzQyMzE4MzgwNSIMR89drWGr1gTsXx4TKtwD1MNaeiuk%2B9HiaXAropYIIzWHX8Bnm%2B9i%2FUFmoYJPI4m5hORQ%2FV7uNT0ZBGdNgAPEHxvlCbBKlDRsdytMjMKcXwA%2F2mRpQMUnAPnRvmPvKusgnwVUZiEmT%2FTeejcIR5PkPyH94PU1VZt%2FtdQa91f30oofrH4R1RnZghZyyMaFoFmWt5o%2FgHzJ%2FcVyWPDmS8SYd6c1AUHqrDxrGrBL7r62hq5fJ6nkd0zWS6fxuUe5n1s5DsI3aflAaNNJDACCzv7zXu%2BkISZ0O3CjG%2BBl%2FImaADjpr1caOVeDYJf3g7Q0g4j78wtU%2Bt%2BfYb8H9HP5H0qH%2BAHFlPNxgT6%2FcBBe5kINYfOHZC1CPTDVo4l9WUFRJLFEDGQ2l%2BdPFiTyAa3s3ojOE56RgKUhtb47BlLX%2BboTPT8NpxZPpqTFPRryHMs5c7qPZuCuqN%2Fuk0IAvTampUIJRWNae3nk1rVaaX9aTxkDmTW9fpAJe1PoVVF9DBr1H631%2FnIqAvIjnhcQc46PDMM7s4493AGU5XfgR4lzoawj5LAkM7K9b5FJFYuBgLqUFvRYcsYCW0WA9cElXnevuZpfyeWIE0GzeBTescelK5cyhS2M622iAj%2Br4%2BAvQQNPHaVHw6AZ%2B%2B05ItttcqAwgta4zQY6pgH58O%2B6iGOzykr1612YqbPHRnSCyGa6TA9ga%2FJvVL8dpWKgVnwA7TvlhYLnS7xFzcaxd19MhBkmfepfAWpplGRYUyck5WF242b6L4EvVx4Rde%2FWDFtAOyEDPVUpVVM3bOAucOYY1sxBwi8m2ZvBSHpNvWeSKALyHbaAOrP9pxGIRYiM1y%2BA1yWt3HPKQFS6t3sWksy1TzI8yuLRRdACbJY1Ji7cYSSw&X-Amz-Signature=d7137bae7f6a417b8835fcdf79eca11f1742ac16c327426ea1c0c5aa58a0214f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663UODSMDX%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031739Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJIMEYCIQCtagXIuwun5DWjzQEtL9mpvr6VAGPJaK1M6%2F6dcYaeUwIhAKhcPA4ZgF3pvufXsTgMPJexKmHU83tb1b8zg1gxXuhVKv8DCCMQABoMNjM3NDIzMTgzODA1IgyJEusxtX%2BmsvgKA4kq3AP0R2T8fFmJsxzMFc8nq8ULKdtV5fo6t9NIP6RIlWcaaKHprKN2sXOxev3vfqW704%2BrkBj9ch4KvCMwRjFj%2BxJ%2BG7ViD5KX8MCeF2KyX25CXcAxWKKlbazqV2ZMHShQ%2BYQZtXQlw28mihMEi7VvAK2ifH6zAZZ4PQlISZIyR3wj4IJU0OKig6EqJIHDIR5Y6m8qVKezg%2FbgZ2j%2F1CQuSsajPfE0%2Fo3KTh2xeCKJIYZPS80zZCroa43lbSV77GO5lxOt4OV0jhf89p2pm437ge5v2RpEOVKo6V1sJfzd%2BXGpg%2BHuIdwqeU2E5wMVTEVL7gPYwPMtVk2UC0RBCVvYZakzSNyzP4%2BDKkUvkfOe3n02rNN3kLBG3nuqzFledkshs3N1apM9yJvJulh2hG6rG118SZ8MO6mFqqcH03ccb7T0KkI1S1ObnqThIR6aEZCZSd9KYrtQOyhLdCKxDducxjOCWt1PXNlLv0eDnn78NgsjMLm9JyityHLrp%2BigjSX8VrS6s1w71nc7lC2dbZ7Jxj7v0yn%2B1bHEiKezDzOBVzhR%2B1UfUWLB6cuAmgkf%2F1Sv1SXaEPLKPtm%2FNqEpZwYKN3LcA%2Bv1wKe6HkoK8v1229fPYQ6YyZRNm8%2BTL3rL8DCC17jNBjqkAYDO8TZ6WW5aFg9fQh4CKTgdYV25QnWi2Xz1OYJ%2FtZgsHasNcxSept2y5BqY%2FDyqql5if%2F1o%2BK5HA%2BSG45lHtYLfbxXZKH0QnvP802bmKTChAEeeVH4OZNnh6s0yWppz7HmuKHT7jw8Unb21awgDUw2%2FqrVX0NxR%2F4d0x2r%2BXseZwb%2BwFk3WWwIALAmEgijIXBt5Gyo2m7K64EW1uzH3dBOkCZQF&X-Amz-Signature=4a1a7063b356a91f12e3cae24ba86ee132b2f615aba17acbe718f7aa818ff519&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664J6SW5IA%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031716Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJGMEQCIA%2BHNxIxuXPbxX8hgU7sHCH9BzaZiorSgGE%2BQzCi37VzAiBFC%2BLgvr6GLqPtdpzDhkLy2YKEywAcwMfl2%2F8d0Mvuxyr%2FAwgjEAAaDDYzNzQyMzE4MzgwNSIMxS%2Bb6cL5Xy1lMMHNKtwDKvjR5DZ7CFUg9bYE%2BrPmlU6RN5dLV56mIPxoCg4zzsez1vjTSkGPixW0iAiT9BU2NDRq8gE6X%2BmeZHmcxCyZlI7oelUHOy5cE8kgFbBMCy24OZJzB8H5yAPAYhs7G7euTkKnzyfaCSB%2FDkC0hWnREhF4s8Rd7pdFgTnInVTaj6pT%2FzwgRGgOoqgkEZ4lWxzSReoSUZGa1QvFLR0njIl8Y9AX%2BbEbRF%2F2X6PjwVZtSEuVM5N88X%2B6%2FWRX9royZstJSSIeX%2FKm%2BgGkCfQ0%2BaVJgbS%2BsmycmXzkvVQ06OSx4xBQMpHAWN5cCtvwf193ZoRNqhou4nyDQbC8F5QXaK8pdPbzCP2FGDTTVjmoT0V2kq6VjhPmG1O%2FAjOv40iNpadw0Od9deY9MEjWq3%2B8l2wjf4GAbt1ZQQHVIrf1DV1iIFqmuaflCpkVcmJ6bPfH10A3G2Bo0FqeZRc8%2BDu0Vh5WS2Niwd8uYlvs9tmuWSA%2BuA34%2Ff43M3oGez63EK%2BQZaJCj9QzWPLQaiH2Pz3DNrGp3AGAA4ycKtNYhpFh0zaa4VvCN%2FU3Un59mWOBdc6qHg5UHUdjrYpVZ%2B1qBmbIS5Zjqe8LPlUEEzVVmql93x0udadreYcQ9lgFToBamWQwmde4zQY6pgGK6pJ3JsTFZnr1wq8GCDUHOi1kfb3SVPtDTga56NpUXR1VLoKYcp2X%2BAbWks2nv%2F52S3DhTAE2ibdPfx3PyWZ2A2%2FSZME7eAHm20JY9fAZ4BTriE67nOpU5gnO86hyLx%2BAcQfzsMyD%2FgmpvOFIR03TlJXwwBRQ4O9W4p04SIuR2INPVRQ%2B%2F9HV0p21QgfVDKAlptfiKlFEWURhYyqg2M33g%2FpqHhSN&X-Amz-Signature=c694b25ad638d4a5a1529629058012dd2c851b0f317331d190d088a9ed57793b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
