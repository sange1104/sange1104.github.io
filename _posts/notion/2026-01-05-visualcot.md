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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667MWC3WSA%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032104Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJGMEQCIAxubR219OU8rVZvMahXO55c0DIpPqnIp%2BTQAycA3K%2BKAiAViHCOvdDgZjXSlnBxlK1xedmB7PwO9xBuNqdH8HQbSCqIBAjT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMDpSnv5DHUJo0LV9CKtwDf%2BOEv6tIM3nldH1Zs4M2I8mKOiA8EVwnQfSlWHuUq3EIXfviunJYkVeMK6yxkCdUtN27NjPpYNaBm5G8nInbqGwQQde4bf0OdKcLrCULgoNzgb7aHQpcaAYtfBLUlhjAx5dSIZPQ0ubk%2Bae3t519FM6lNPtAdoXX6BUpez5zyulIYVQa2FKx%2BsIDOXg2GYvenV8qw9h0n44Iz35ASeMpDvzewgxEhvtcJdPpw2BQwVVQ%2Bq0dYmTSGZTyQhvCo7RZamknO46Yg%2B0xFBWsDTizuK5UbffH3Cmar6C%2BM9hAlbKeKJJqchxm1lnV3z9G6ywTLg5r8NkBnRaIRSBk1xdHS7b%2FxxeA%2FYsrbM47Mg90gsKJXpWsy5LL6r%2FBGy68da%2F%2FrvfKCPCmbJXkc%2BdpzyRCytGifpOesIGkbg40oxsaK419Wmj4fFxl4YTinZcp4bTt5BCCU2krbwOebUQ99PlnQhn1Cj2pr%2BdiDHGKPwpu5mzd04N5atPJx7tKQ3nYuebJpuQdZCK17t%2B6Q%2FfGjitiwhppGhx%2F%2FgxDifZTDkiMGTffV%2BElxSzROZ4JeB1vgN2wzwgGLhwYdad4vOilfkITRP9QUjQMY54Yn%2BqO%2BuaEzWkX7d%2BZm4jExlw%2BmaIwm%2B3uzAY6pgGzuVNh56fRhQnsrc6woXGvpBxbUG5Ru5aZYrkl4O2G0Ffh8MIFStvW7u8cnoMssvw%2Fq2aF2an80EjISkasF2KffCHVCiRCH%2Fs2psDwJarMMQgpNaDEVpBhCoMVxk9NeHCktPOvDuX6fp%2F0fhEc7OaFRLtGUa3NLEKvIWt%2FlhjBJTBMWT%2B9u%2F9p2seaRBdZQr1DMLf6RpUgcSz57J9Jq861jcKd3m6h&X-Amz-Signature=fb382f5221725a7e3c0db94cda9a4df7030b4bf6288cdc408654769b3281cbab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YML6BRBV%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032104Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJGMEQCIFCPmiOtcUHT95CPSfV6xpxYEe1%2Bc3wJpJBCg39IIuzJAiB6H%2B9%2FuH7Htt9ddqkU0jadTXUWfmqF9b8rbkZ6FGMzriqIBAjT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM2F%2FFMpON13c44DJCKtwDzLzN4bE%2Bxs5bffqMz0ZT%2FLzlJmsX2kl4I4hb7qGrGd5JFLYAv6cA%2FtUVdXEgksDSrHHSYmmhClbqx35HXIdC9FAwGCFVTYGjMgF%2B5KyJ3vW%2BpSuAds3ybFpp2fxCOAoZu5OdUwL23cKzVmPGcCcIYX6F21YeLYWdVengvRrb4t8qgzaAZT0cDLooKz0T1qMThhUOno0jX27ooX0AhSZUC0fG6vZBmdOn0AQr7zA19GruRyVFy64o1JbaegG8jQQbFpAx3%2B2UbKZLYpPoQ1u9TW7ZexjnqFr5nZ1K8AsGqWQl4qIdBP8KjIQ66XtoQ0L%2B92xkP%2FoTlPJh8Q8djoPR2HQ0kUFSELjzkHx67Gl2CQjVaWWQhPQMp5KRNeAbjkQ1WA%2FsXEwFzPK5RsuPmXKUmWZNUvW2c7mhcFsnin1fmNZJ99BQe7njLD%2F8y%2FTscUyGr89MDM5P%2B9weom0YMzz%2FXIQ2Gol%2Bwj8C1vEjK2j4ZcCZwrsa1AkqOeqnodSgSZ6RlRLoPCD8%2Bcj3DiXbnTLszdJKXJIRAecWZH3%2B3z3rJDzpRIjMlsx7vM4Nf9aGuUyF7DSJwSza%2FcL6BNh19K3dhT6yHOSK%2Fg8YRzzpNdtR65z3Rcb5kvWpiNObQcIw3OvuzAY6pgGMUIwDxP94MfDROrkPB431by99DfEyEz2UXlzaXjR3SMLqSlfcBdrFKZMsk23uivxc20mF3iOTNhgdgNSg3ZMIrOykoRkLx5CrJLbnLPUe3vL5hQQ%2FETrfwUoB3m2vHTz0Q3itxDz%2BoLQilaCsFOiTzA%2BbrzLlwgcLGhtcjz1sBv7bPGHDsNZCIaTfOgiB2BhDCTIEpJ7Ypyx9AY%2FgOQm%2F8zbGFdkW&X-Amz-Signature=89d12d306c198d727d110f9fd9b42b32bc9da21b4b878a67b4da728b2f11b741&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TSB5WH73%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032043Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJHMEUCIC%2ByMSsypAyGvWKTlKRq7t2YNgFripYNOtp7HroypyvGAiEA2K%2BR3iMKrvu0xn3FawhT7U5fsRZPj73SjITaHj5AZ98qiAQI0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNwJkv7uwmpRgtcdYCrcA20QdZHrZv%2BDxWNC2vCEs5swll2Q0Jil6jEbJFRV88F2BZIdm4lNghIddWdP0yvGaK6z9CO4e%2BWEYgRjhOZf2FXtKkBi7kPUqi34pQMAL0Zm4cQOQ03jDSqgVHXSJwA9XMyI54A9zuj8A1grZ9oawE6UsQ3tsgyYvpqSZVoqRarXqIhdiSGN0WePpi5FmFbaEPhyt6GQQ%2BY7%2BDXFrIVKX9bXVhWABEqximcRTFXokWU2f46OpL%2BPJ2HPzMiOstlO1bBfNOKyg2AJFMhxMgwtz6ZxH28%2B1esFFkIKq%2FQja2h79Ohkj3HdDlIiJWSRbYSfxq6j5mHvFl1TVLofhToSxnAdVsLdb3K4w2uKA%2FwGSpGd3Cj7QBTE17O0PLDzVxBpQ7s1AfabxGe2h3pFA2ropfcb7%2B9ZkjjWgsRPA5RhUdo4zFqIRjFkDWIZJNTBFaiat15zzwrnFWz7%2FbhZ88%2BKubBU4vroUgVwbCoPGIUd2zGffTrjIjDLGWdZRYxWif%2FCmuupmCYw19%2F01V7hNJqmG71TgH8UyyxNXovVBNs8fY1e0pDKkJBB7%2BQYz1xGJJTXeMRFKqB8v%2F37OSA7UJWU0QYPoS2TcbEMhYyliprRWKcha%2BFivFAKfO1AKkd4MNjs7swGOqUB3di4PU8T67O2ysYQvBBn%2FMkyYAqWomP5v6jf5PZmn3Anyac4UDXFDb233DeJTwjC%2FqRNdlVQz%2BJcUM02ktbl3NciyoRsO6iNz7l%2FG1cLcgM4FEzmz6F63BeeMsVEpe1rXG3Sl3V%2BhTqUvNSf2c79Bm9NJArAa%2FNlW9PvjzEhdU2PcHmwdnn3cctcOE9Gclc2w1Z16M5ULnVLhg5Ph4TvXL7spKHM&X-Amz-Signature=22c47be778d6d87d4b01059c4a641e4fa78437ec3ac3a8c7d071c7c45afc9d67&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TSB5WH73%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032043Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJHMEUCIC%2ByMSsypAyGvWKTlKRq7t2YNgFripYNOtp7HroypyvGAiEA2K%2BR3iMKrvu0xn3FawhT7U5fsRZPj73SjITaHj5AZ98qiAQI0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNwJkv7uwmpRgtcdYCrcA20QdZHrZv%2BDxWNC2vCEs5swll2Q0Jil6jEbJFRV88F2BZIdm4lNghIddWdP0yvGaK6z9CO4e%2BWEYgRjhOZf2FXtKkBi7kPUqi34pQMAL0Zm4cQOQ03jDSqgVHXSJwA9XMyI54A9zuj8A1grZ9oawE6UsQ3tsgyYvpqSZVoqRarXqIhdiSGN0WePpi5FmFbaEPhyt6GQQ%2BY7%2BDXFrIVKX9bXVhWABEqximcRTFXokWU2f46OpL%2BPJ2HPzMiOstlO1bBfNOKyg2AJFMhxMgwtz6ZxH28%2B1esFFkIKq%2FQja2h79Ohkj3HdDlIiJWSRbYSfxq6j5mHvFl1TVLofhToSxnAdVsLdb3K4w2uKA%2FwGSpGd3Cj7QBTE17O0PLDzVxBpQ7s1AfabxGe2h3pFA2ropfcb7%2B9ZkjjWgsRPA5RhUdo4zFqIRjFkDWIZJNTBFaiat15zzwrnFWz7%2FbhZ88%2BKubBU4vroUgVwbCoPGIUd2zGffTrjIjDLGWdZRYxWif%2FCmuupmCYw19%2F01V7hNJqmG71TgH8UyyxNXovVBNs8fY1e0pDKkJBB7%2BQYz1xGJJTXeMRFKqB8v%2F37OSA7UJWU0QYPoS2TcbEMhYyliprRWKcha%2BFivFAKfO1AKkd4MNjs7swGOqUB3di4PU8T67O2ysYQvBBn%2FMkyYAqWomP5v6jf5PZmn3Anyac4UDXFDb233DeJTwjC%2FqRNdlVQz%2BJcUM02ktbl3NciyoRsO6iNz7l%2FG1cLcgM4FEzmz6F63BeeMsVEpe1rXG3Sl3V%2BhTqUvNSf2c79Bm9NJArAa%2FNlW9PvjzEhdU2PcHmwdnn3cctcOE9Gclc2w1Z16M5ULnVLhg5Ph4TvXL7spKHM&X-Amz-Signature=c66ffebb1cb09ba182a76a8854f0629b719f350cf87e34fcedfa5982541a8bde&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664VQHV7IP%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032115Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJIMEYCIQDA1GGcv%2Flg8b5fhvHW%2F3kRIm4eoOdVKID4GHm3omPRlAIhAOPTIhp1nfuWEFk7mpiBpNH4FFJDXeuWZ%2BlP9OYkMFOKKogECNP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzZlXELM3Hg99sdnjEq3AMB6YvG%2FBNRCYI5ZXl9YQ0v9U3BBlYceYgUB%2FiK1PWAgC3onhUQQ9ChKLZwgArXypAc0xo2DZ4ITRIIY98KQaybf37yoPbJMtpWFDLHapx9XIXLb6N8kHjKKlAQfODCfR8bKyST5wMKST1a3ZB9%2FwhRAOWPM86d%2BeA4W2PvtWR%2BS3s0%2BZEA%2FXl5rOMk%2Fl5Eddnu%2Bm0wwuaLTjl8dm8zzsl4BH0A%2FHc6sKNJs4vUpLy1mMqVgtf4lXI28gf6hcdBkXJloGcQ2%2BfNAJ7irCFPKICaKj8%2BcDwFNtNFQNrOYpvEK9780fs%2BcIGlYaN1mCKuwlXg8GYg1L5c0ecQif0VCspgDsgaDdN%2F9Wj%2FD%2FeffKkZ9Ot%2BjEGrUmsoLx3mGSOY3xFZwP9ET40DNdgJb5eufjIfbQFaSWCBMyf9FZzNHLV1hmXRxUtbT%2F4TAhQ2rhQ7HTTVpmTxxJUCkbW5d2pOhGuhy6so0%2BvBevysrkXTSu4YEtKNV82c9zHFOxGHV2Y1eCiUigeAUdLP96FatVnpJ6QKYPyuxulYLT5TJR2XNYRXBturSg5mDy52aBttHfohwana5Bj3QFzAYaGVZeMj6dmrpzepXOgIIuaAYqS5HlteMUVmASre925TOdijdjCj7O7MBjqkAU03E2W3sGbsC3jRk9FEoJqMKYfqHj3x81ERpIUGbBIwCAZygaC%2BOpt2skEZVZaqBgrPPNG5WACtWnPjY3PYWfr2%2B2fROx3UEkbaDyV6WLxNlGWuWluRvoFA%2FWyJaUdKIKirSUrz0McDsWiYE%2BvGWAbUrd%2BSu5MlFunsy9h8WjXRvosvuLtW6TJsnRz0KpkIYUpwpDOrSZgtBHMOA8VSQXYxbhTH&X-Amz-Signature=03a5de5f41e39c62a49001ebbf5b3538b3f1b063ed365a93c840ece6889cb47a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WDK4LSE7%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032123Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJIMEYCIQCphSmXJ1kH4ThEGDljkg4SpXcTJ8bPzAOqCSuSLVndYgIhAPyRtdshecsKE%2B9R3tyjBVpQNTmBH%2FUrIUTKrEehYdH4KogECNP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igwhkc%2BX4G4KsRH%2BLh4q3AO48ZyuB7gAidEhnqQ5n9FLB1Nv6rIm899wflgsfyOlxbp%2FG3NQRjb6oIS1b0JdRD7dnjJXsClh2lpyO3%2BuMF%2BWJBWuwObapp8Ov4Z7f%2FMk7485IrUfOh2iV93jKCORxV%2FTB1u0E1%2BYC9NMzQhMeAFtnalcKVXkzZk2ExxwEfssz5wLbYKZxTiIugR0eITF4nhGqBdZU9%2BDGH6hHOCrY%2FbTf%2B6pG4%2FUIves5zTcuUR1mj7dJzFo3rhSyCILHg7TpNRfa75cdt55NnXBsIuH6LL%2FDQPHIgh5zlJHAqFYnf%2BQJBNO8b5pAZ4gunsRyBHxbJmZF3wgzqaq8bY77QNzD1A%2BGMYyj%2F%2FHEfCj1774bkzmFYUGpoQTzIwwn%2B58xHyBQ46yxo%2B4YgdFs3b3N5m4gh1BJmVx5InYTJ3jytSPUit3wib8iKM0QGcySClia6CmVpRtAMBI3AznOq%2ByeQ8hsegkxSWN4Bi8LdjKCvNiVGDK0NRyCllgGD2kD7DjcPsM2JxVI7C3lKCDxz7%2ByClRGRZky%2FV60kY8X5BYtrSgj%2Fohr2oHg%2B9b%2FdEm4ct1EMPcqSdGuS%2FEHRtmnGzn8K8OH6CCFkSF%2Fg9OOjFuAhayyIwWb%2BJtlJ5RCsi2wAqBVjCj7O7MBjqkAQKgVv7BojTtv8l3CVM6eIpRzbXRzZkTZWLkswPVKGP9edyDxlzJP37Pv05OXoO0RQEyF%2FksK4uhUI5PcAYVx%2BR0IFbgaTMieVJaZzNt1%2F%2F65IJJbohJvqSJUI81c%2B7CzngZCq1YNf15t8fdRgKabBlrbm2YEfqvvLusqRNMpnNXLYmWh8%2Fi6BrOz4jcr3RuMs3L80WFCCFJRQE7P4fHgiEITkBD&X-Amz-Signature=963c9ab885e105f55880f62e0da2eef9e0eceb78504b5d5f8829e913908fac5e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667ZAM7CO2%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032127Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJIMEYCIQCHaDmbC7satjPwVHhDggbMzife8ZrjwpmXX34HarX02wIhAIsM1gGeBHt1JRSc%2Bvn9snN3DB1qPvZVEF6ss1oGptCfKogECNP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igw9i%2FMDcJvud9%2FcJS0q3ANH%2B5%2FYLd0%2Fr0%2F2PfuDsaQUW%2BO%2BeTigRI49sFnfxBQjDm0ykrH8cfgx2wcoLumIYWEAEAlKET5KZA7isEsBUN1UOCzEPFJUnTgtGkdD72UuOQGwAvtGCRIS%2Fo0M%2FLmhQeP%2FomVNmawX8Uq2kAB7iK5LIK13u8B64onOEiV14sa9oZ9XnTT06cnuk6Zr4zD0uczdGlnUAr1neXbBaXOH1xflkZluGsR4jrX9bwVendgU%2FPY0lSX53z1KljwDBnoCGOqG3iQ9FvdqkVqiUG7RqaOGsERQr%2BMwyoCONAe31CNdwwWqMnBQbXZnNcHsvqPqn09l8agvaD9ODh6fOTfI75bgM4B9RXxgdvWY5rvHwnkr5Hf%2BseE3uUxQwxsARqSgprZRi3fZzLUA26k7HX9HvqIwUP12nZqh6LFtavvddoMQ%2B%2FwitnDU6yrYjUUk4BeAV1k%2F%2B7BD8WiUi0q7dXCKIdQLvblgwRtYZklcotslr9dxb4JFmW1MYheduNwVcx99kN8CZWnR3v5Sz1qDNWReoUk5FOeN4jNXM%2BjAirkXXb6JU9lk9qjoAL5EPvDZR%2B3ya%2B4e3PVn90i82yKAoXRdNM2CzFElJQDu3rG1XNM2Rjw2UTuzctjnPrTBhqKuXjDM6%2B7MBjqkAds7WcRkGLEOkbj9wSVLTSRIHX9I%2BaKVRLsL8Sv4OzNcnN8O4RSngj7EcLOmZ9zkl7RGEjC%2Bnv7SIxcV01%2Fd2KERpfbkh1ZXEZlXm1%2FTtz2rOnTOfA3oFtppnjNVXpuN9Gde49Mwl6Ulie0m%2Btn%2FipjEv3UBAYKQV%2Fx1kNQmVCk7GW1ZgkUEZm60p02EYbEQBzDAmltF5VU%2Bj133pQqhSXoph35L&X-Amz-Signature=ef9da819352662516fe1f1ffd80dd980846d591b33e92eb1512ebd57e707cc46&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WCGDMECZ%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032127Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJHMEUCIGThBBQXJzJ4CkC%2FHcdK8IvxZHMolbXBnyZQcKwJWj4uAiEAkm7YP0fLjd8hKE%2F8BDZLEX4%2FSO4qdn%2BV4Mfg6O%2F2W44qiAQI0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDC%2B3XMT2Mg9y6DyadSrcA7czKz%2FryfidobVnv91lCLQ1S8Q0KiNFgtQwLT2u9kO9CrHwOBogf8J%2BH2l%2FSU2511xzPSK93zR0YI9vEPpZi29bLWw7X0T%2BrHIl1MC7XufiXXYk1B7xI6Veh3ukcMUENqRi1lZdllHqDCJ55%2FCVDm0KNOeyeGE6gMZfv7bs9YrDhB2oG1n5h2wtIJQgheyYtmptVoX6y1cH64TPXgFMksieeuJpoNqLDzG62idm5bfRv1t4M9DrFlKJelHaamywJhcb3oWcZiESAPIYl46SwGE%2BG4P%2FDnpEmALic%2Bt5vYvcBtLJwHtWdbRBrULHuqtgrvYrUVc4EhTA2dl3j%2FikSh9mTr8FGik9oem9g87Rpb0x7%2BZeto9jMJicRJwl0c7dq4xPFxmHhMfsLT0pYRBxtMwajQsfuJXS2nNUincTRkEcTtUJ7WoqrQ9Vn8vvAbQAC%2Feygooi3vM7ijj%2Fo8sQRUZnvft5hsVKTD%2FKXEAQxE7EGB8FHBflFVxoXUzf3%2B89Np9CqLSxR0gc21wmie82jQ%2BsH7MMOnb3ZjmPo94eiNUhAR9h5VoZkFI%2Fj1rT22HHvth3HHU%2B3dtp8iNUmWxNltwTMHJU7Eym7EPB6%2FNgacCsnmCHD3wtt2lmb5TIMKrs7swGOqUBFiEfuOyesKKM3Ari%2BN9612ACDf0iMACGr%2BFHvajt8%2BHKz9i6G66FfBUMgM819SuMyOUipHJ%2F5YwM3CHucNw%2F0Nyt%2B0%2FZ2NRmaQoWoQBVCECmuShaGrdV9aoeey6Ndq%2FVQ08xfYwQVIqbvAnOtsl2rFjhuHR7QdyJUhCwX0sV%2Fi%2FJxYb%2BQPNVJwL5%2B0jvKRIe1JH63J5flu5eadiPyXGhiQ4j4aKj&X-Amz-Signature=6b50bc6e44f01f5bf855f278cef3914ba8f308b454cb0b350469d6aba2d1db41&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665WDGJNEG%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032128Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJGMEQCIFe7kekC0PrVrNqdpVsoU1HvAURJ5PfhflhlBh6fbnvlAiAW97Sp46qGh9j9zR7hMaJpnLDi%2B4WIs5WhEN5rA0fFJSqIBAjT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMe7RFAXrgV2bEFiWsKtwDbSilsUVjBKRiNQUWUxOOe0LE1yRgKWXxO%2BgBL%2FuqP6xcMhoKlXTvHfHVoiDGJtoCdrRiK6LR%2FKa2Ek2dQdHfCCQGyFrHlTCF%2FbVk0YNwwMyMoiKihAkLLc90FguLnR7SBoj%2B%2Fzs4a62YlJD8ZPiagEe2a2k9f1vMmukaXGgxPq8bjIObIsP13avJkJxyoQW1kz34pISeIIh873tDgW85vAspvQ%2FnuKm3JHlXHxKMf716Ka3TUjwAtFKA3vp0rItCxJP3cxnho96wAmIOZQuZCT8ZNKoHKt3Bb7pyvNYJ76ffHOdsRIVlYcYKx%2BgIS9LYgO6wYbAeHH4rexrAWiTMHURciC5P8SuWf%2B6Z79EcLt8O5ICzEfLnO%2FBC3nz3eX7qXRC9GFC0OS%2BfiJu6Ngp41ODJfccQG%2BSN49OGu02tz3n6%2Bnf2U3Bb4PNIiNwolJY0go0gTDeAQ6YdB9aN7bMx1FVLsVKUYedNXHW24cK7KXKyrt2U8AGc7kvKIUQNKtjgiSq73pkbbQuJbyHsCV5SdBhhd51MEU%2B%2Bwh1k0QMyZirfPzZemwjo4SdBKNcpLBarloolQMiT7ef6FR6mWiLsAmQb%2FxzBXlzS0Ol5WYzNKhSXeO4xaekvJy7t3RYwmezuzAY6pgHLipXy2h6LgIU%2Bo2JtuPLjoG46W46K2%2B7SmpdODQnwFeIYG1JCApH8ilhKhnCDbBcJdCrVFnngIz50pxbDngfSG0%2FIIGcNw6QLEAGKP%2FiYZsYdD0c1Pe%2FvFEPZHOFVXMcTCMqLHU8oso1sUzGuNhil4TMhbdciRBPvgKCV2LdQ2Rd9h%2B%2BPDVQPBMrgFZsZNykK5y%2BJltPt7dychCQEqHaAJL0Hp%2FVj&X-Amz-Signature=f3dc511bcda855c06fb9ddf7c608e5ed8291c6487b3a18d7003816e84f23594f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TSB5WH73%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032045Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJHMEUCIC%2ByMSsypAyGvWKTlKRq7t2YNgFripYNOtp7HroypyvGAiEA2K%2BR3iMKrvu0xn3FawhT7U5fsRZPj73SjITaHj5AZ98qiAQI0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNwJkv7uwmpRgtcdYCrcA20QdZHrZv%2BDxWNC2vCEs5swll2Q0Jil6jEbJFRV88F2BZIdm4lNghIddWdP0yvGaK6z9CO4e%2BWEYgRjhOZf2FXtKkBi7kPUqi34pQMAL0Zm4cQOQ03jDSqgVHXSJwA9XMyI54A9zuj8A1grZ9oawE6UsQ3tsgyYvpqSZVoqRarXqIhdiSGN0WePpi5FmFbaEPhyt6GQQ%2BY7%2BDXFrIVKX9bXVhWABEqximcRTFXokWU2f46OpL%2BPJ2HPzMiOstlO1bBfNOKyg2AJFMhxMgwtz6ZxH28%2B1esFFkIKq%2FQja2h79Ohkj3HdDlIiJWSRbYSfxq6j5mHvFl1TVLofhToSxnAdVsLdb3K4w2uKA%2FwGSpGd3Cj7QBTE17O0PLDzVxBpQ7s1AfabxGe2h3pFA2ropfcb7%2B9ZkjjWgsRPA5RhUdo4zFqIRjFkDWIZJNTBFaiat15zzwrnFWz7%2FbhZ88%2BKubBU4vroUgVwbCoPGIUd2zGffTrjIjDLGWdZRYxWif%2FCmuupmCYw19%2F01V7hNJqmG71TgH8UyyxNXovVBNs8fY1e0pDKkJBB7%2BQYz1xGJJTXeMRFKqB8v%2F37OSA7UJWU0QYPoS2TcbEMhYyliprRWKcha%2BFivFAKfO1AKkd4MNjs7swGOqUB3di4PU8T67O2ysYQvBBn%2FMkyYAqWomP5v6jf5PZmn3Anyac4UDXFDb233DeJTwjC%2FqRNdlVQz%2BJcUM02ktbl3NciyoRsO6iNz7l%2FG1cLcgM4FEzmz6F63BeeMsVEpe1rXG3Sl3V%2BhTqUvNSf2c79Bm9NJArAa%2FNlW9PvjzEhdU2PcHmwdnn3cctcOE9Gclc2w1Z16M5ULnVLhg5Ph4TvXL7spKHM&X-Amz-Signature=d1ff7d57b719ab1806a4b494983cb686c2f5b23fb1b0ae03874abd9f418a1ed6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
