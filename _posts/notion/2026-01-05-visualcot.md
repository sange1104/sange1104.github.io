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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665SSFGLOI%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041113Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFOp04IWXWKR3BWMRD2M1Ihiv5UmoVC%2BUFCuaS0koRvwAiAxUbxmhiYxi3tMKz2T%2FlDskIl1CQJ3k1eprlNI%2FnC9eCr%2FAwhMEAAaDDYzNzQyMzE4MzgwNSIMTY7rG48cm2sQxcNQKtwDg8104%2FuScekbchQ3kCqYZ%2BMir7onRhHCcqj%2BJDTdKqywGYWY98Vv5P7%2FEJX4VmLo3ocI5tYjn5%2F53aCJd%2F2JI74tcfRraIcZgl1wX%2FSFSuCvUioEoTzUvAnC1pFGMUv7Z92Lli%2BjFp5ifB1erglHGYUxjY%2Fi%2Fpe%2F5cMmHgNxwaEEYOLAeGtwlUsXCneVZR2cSh0O0GMDpcIJTf%2BWxS1nVNsEB3IeMP3%2BhcMt5Qw6cJVe6thsGqg3p1Er49RcLMFaj8Fd4g%2FMrrG3HvxmyYk9QaLPePct4S20AkYsIFNW60ufuFm6lBZG0zcfeULieExsDK6wdf%2B87FhQO5EeKiX2QQvZBka7Jq%2BBvrFKkQc4QxzVQQ%2Bj%2BwzMhNrwZ7iexRbvAwVrhq5rbXsTK1x%2FBZ10ZSScVt51jmF4x9i5AH70e2Bai%2F%2B5dEYwN1MNm9R6TJGTGkiAR7s8fknYNgcyvVMzWbw9OMiG%2F8nReihDslMsPC6o%2BE%2BMMe9Er1QBfeX3WpBtlA6pokospK5q33kosCuQdRP3Kx1PIsSufjxl0ehx1%2Baikhd7pldiWMrUfb0ZY2FWVtNvydPzgrW2nNyLyOoIMR6zL2A9tBdPETjjURYvyhzoXQd8QTnsEzMraa0wyfXazwY6pgHBhNWD8sVhtSAyhlJukGt9%2FFsfrzXChtniAuZkO95L%2BeZUvG%2BNFTS8WW92zlG7UoqIQNEudJdUTLhjGkpxImrjudFqiTFT9toeT4eCGvEcsxQf0q5ns9JAZOAPXB3S7U07klPKbN5adsKKhso3dHa%2BUD9UCbkBk5lVridHgJ0gIjyIbeICUsYvihhD6LMfLVnzRvEmTVRwtmJJWxNau0c6N3MFeIRa&X-Amz-Signature=b6ebc218ef8e0be7b9b9281a566f0cf1431aa092523f4397754ee1acf5d71eb5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662PWFHGFC%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041113Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEjRIlpLbAubIxVA4Vxh%2BrrRKwY3NnliD85FMkXB5CAeAiEA5t5hU0yQTJYY42HkEECfLelSYObWXYOpj9r%2FMC35538q%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDACx9qC90VhviykCeircAy%2FZMzr17za2%2BY7O8HdYTWFATCC%2BCacMZAFM8G0d%2BMYj6TWFFXmMUqynS%2F0qtLlCFERpesyiqxZxUZY4Fd3cmpgpyCHCRsPXHSMNINTnooxxkPnboWhvP01w9hSzv6xWMj%2Fx61qE25G%2ByIJzqZw9wyTG289wyKQ0GPxpu%2BinKqOia9vibtbKw8QxmTe4%2Bxo0oay7Nr2piAsVGJGzfIVdAvmeHnkYn77w56zSZ81al6mZjB%2FHB9ODwF4BsH1LVAG6r77ROK2nNIkTb%2F28vVVjDLiUCWlhJO7kwX4hyCmuVScmIt7vgzlWWgI19x8un5soSdUEdaIr9v%2FULvxQMu6DqFdttJ8%2BC9o7Uy0Hhkd1K4ATYFqWAUvA28RxKhcWfGg%2FSQF16V%2Bhq0vCzd3nrU0UIYoNI8dJ7sRRHOhGP1EeDp3bRBhMT2QrJ8OAsf9VCs%2FPJ1Hp3NZaheg7TB9JpDhw4Rw24EV9YiLxtXm2j7vEgbRxPZ%2FSNVAWpSdnGPI6OAb1hVUNyA3NfmwcY7Ew%2FqNKogbAS1aHEcxuwMieq4Zt2alBlNygE%2BENR92m%2BNxiw313RIsaMQn4kPuVLxk5ZKXZzmcJbEW6FvBa9Uuyy6GYbJC6iIFoNA5ZxzmzSoshMMn12s8GOqUBpKS1X0HMDjhX9BfiaAs3PTodf7Km1VORTqJ%2F0URS2HIYrIjSAvD9LIbRIv9tav2r6MraEVa1KOdRUDKffdoAf1OhcbAoBk1hFJeU8%2F2a5dfPFbXIavrWKgbKzKeCAIJOtUsSRHcvy%2B27FRSDiFhJhTTKsknwBaxZ8N5gjbAzJadsy2f0l%2BtqzYkDEhiITaJIgfrQiUM08S6GB1eGPEo4l2JOXOao&X-Amz-Signature=8ea542fa6933e53442e32bc3f8375a57e58cda778df0b9055b3f9920500e96b3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WS76VMB2%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041108Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCenNQpvQIDhbIPdr4SvCa2Vpma%2F5TeDdxM6i8hwduvPAIgDlyaXdTLLkt%2FAR6Dn7yUqVxyMZSes80UpX3vGe2oCRUq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDJtjt0fClHm73bpAByrcA6XakA0lEW56tKxS4saCEwJj01iPqFe5Psh5NXXNeDJcMYnrlRn2EhN1zQS0bptAiogslcnrFIVCiK3BdcH4BH2IcLUg3hSZgaqDu73ncsZb3r65N7wi2jpDXhQCfXi1Z8GF93QzOxXoSRiBMqaqZxrmUvlzn1UcE6P7josFzIMzv3A1OFMu%2B4dJuIz7dQqmsFU3oCvsUhYABT18N3VWbIfzp6c1SoeCIIZYu6ZmQTl4%2FBF%2BVEP2RBaqVdeATJcwGuZfUwc8cJaFPHH9CY3zW%2Bp7tYuwjpW6xDbSRHmHrTjo2J8l8Vzj8VLXN0TrOrMViLnJ9ZLMyTvHhrVZtm10k1CwLsxaxWbn5DC%2Fd5wFN9S%2FIuwnt3BnMpO1WqZ1UFYXFDe3DvvN62BLz0Sl0%2FXBN%2FHSa%2BgBwGSd54zIvIaFw7Mub3EfIRj3e0fj1y5xDtqE5KUFkV64EwDGoRxpSZrSmevp7xSd%2BxLk8DzRmpef3AYv%2B6Wq34oOQXdsCzP7SDqvaFsf9ur2dlC7xH%2B9bSkUfOcv4xEbB9T6zbBLgm6hVtsT%2FSYJG1k0azKSEKqIRmd94RO7s1fe1ugMnn9RH%2Fh14l2qlo5y5Hwfz6OaRgUG3A3VjfzxyHs2ySdTnULrMP%2F02s8GOqUByQa7Sxu0vNNDfFcKlFpm5FApvglFcfjkk301ckGgvR8O1oxV4XbOSJH%2F1AkugQxMr%2FPJVH%2Bm6c9DIcKfHg1OnZLhlV6nnZihRDYg5LYSfQ6TlY4LnnC99W1uPF3m05xBgw%2B%2BBltP4LvLUIQt1Sy1k4nsi0OIIIc5PPSHu2QL1ANe6xPL40eZAPo6Q%2BMYjZ2qf0to2bk3A44QaZXIKGOhgPSB8jmY&X-Amz-Signature=ecb5cc311f167cae095743990a8db1cb87b346d27b01c60b1dfe9e6b7a8b440f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WS76VMB2%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041108Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCenNQpvQIDhbIPdr4SvCa2Vpma%2F5TeDdxM6i8hwduvPAIgDlyaXdTLLkt%2FAR6Dn7yUqVxyMZSes80UpX3vGe2oCRUq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDJtjt0fClHm73bpAByrcA6XakA0lEW56tKxS4saCEwJj01iPqFe5Psh5NXXNeDJcMYnrlRn2EhN1zQS0bptAiogslcnrFIVCiK3BdcH4BH2IcLUg3hSZgaqDu73ncsZb3r65N7wi2jpDXhQCfXi1Z8GF93QzOxXoSRiBMqaqZxrmUvlzn1UcE6P7josFzIMzv3A1OFMu%2B4dJuIz7dQqmsFU3oCvsUhYABT18N3VWbIfzp6c1SoeCIIZYu6ZmQTl4%2FBF%2BVEP2RBaqVdeATJcwGuZfUwc8cJaFPHH9CY3zW%2Bp7tYuwjpW6xDbSRHmHrTjo2J8l8Vzj8VLXN0TrOrMViLnJ9ZLMyTvHhrVZtm10k1CwLsxaxWbn5DC%2Fd5wFN9S%2FIuwnt3BnMpO1WqZ1UFYXFDe3DvvN62BLz0Sl0%2FXBN%2FHSa%2BgBwGSd54zIvIaFw7Mub3EfIRj3e0fj1y5xDtqE5KUFkV64EwDGoRxpSZrSmevp7xSd%2BxLk8DzRmpef3AYv%2B6Wq34oOQXdsCzP7SDqvaFsf9ur2dlC7xH%2B9bSkUfOcv4xEbB9T6zbBLgm6hVtsT%2FSYJG1k0azKSEKqIRmd94RO7s1fe1ugMnn9RH%2Fh14l2qlo5y5Hwfz6OaRgUG3A3VjfzxyHs2ySdTnULrMP%2F02s8GOqUByQa7Sxu0vNNDfFcKlFpm5FApvglFcfjkk301ckGgvR8O1oxV4XbOSJH%2F1AkugQxMr%2FPJVH%2Bm6c9DIcKfHg1OnZLhlV6nnZihRDYg5LYSfQ6TlY4LnnC99W1uPF3m05xBgw%2B%2BBltP4LvLUIQt1Sy1k4nsi0OIIIc5PPSHu2QL1ANe6xPL40eZAPo6Q%2BMYjZ2qf0to2bk3A44QaZXIKGOhgPSB8jmY&X-Amz-Signature=379516e351f5ba66bc28799c76692b5e5f30d4d49aa680a4021ba30d49686a26&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y2323HLW%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041118Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBMb%2F9uE3R6xxlScrmIcFrHal3LCBjcBjstH9k0n9if3AiBD%2BhhEhgYFc%2FaFYxvNmH1%2BwlL6lt%2FK22%2BFmX0vYRgnZir%2FAwhMEAAaDDYzNzQyMzE4MzgwNSIMoEroV6%2F%2BnLDkxb9PKtwDOxL5n1JYMQ%2BeSWjuinaYWN6Tyzz0Tid%2BDoHiTRrPyhvrkyeJXU5oSyq6v1L1b48pmYSLL4x%2FuWV5E3MxQXvpRv%2BcfOaKASoRvJ9PvqWZEhigwNxgoaMNPaC0CJqoxe6zQ7WsMEK2GYa0Apz34wXhRtu8fJVZOK5YIYB0S7OjtPIXUcPep22D8EcELW1YFjUq%2FBz28YwbuO4zVb1ugKPFd%2BSZwvhaooxtAItlAAJ1fm%2BEgq%2BmdJRvT9HOvBoGatYG3br1ySdBzQxTxPAXa2PXeSbG53sXGnP7rYUpfYrU2eNdOmqVMDbUMDYHYg6D5DhU3hYBJPAZ%2FRtAjkeJFbh4v%2BZUYfQoRC%2FB1Fl0gWbGPBNjAOyus7tA95GeMWM1Ir%2BtM1BSWgwf8%2BY9%2Fe5IPJh3MU3qj2LZpFBwHMPeB07n0VLGFZTc%2BUk73XOjOSlzeodfUwMD01iDNm%2BdczBXb6mquIp6CoFOaNenSHmhMv0MoZuEa0vEdnocBZq%2Bg4k35IGdBy7%2F0fMUZFaOaemNqMQacq2n%2F%2FECpSiEotT35m%2Flo2p5iKY6T6or68nn5ETmSSraAKVfdwimUis620V%2B0ym9Vq%2F%2ByafzS7ywMll2PKHecrzyzvyVSItc2xQlRG0wyfbazwY6pgGwyaU0N7PvfOCBEOkDVcA9OgOj4k6FrclwL2RnB936PCH7Q0gOx%2Brm71BZoTyXOl7LXPmDbuCeOjX3Fw0Wjyr3Kmpu4kCDnAhrn094TzkLe5lLMoVOyXbfm5IpGTTRW2LWTYJwGNfGbsufyJ9SFyo4SjJaEI4hOe1AF%2Bw5LSB3wbMshjvEFSkkkkuFSBDx8gR2VwIMAqId9L17YwBKWt4CMk4eojRo&X-Amz-Signature=7432b388056ce958eb9cf0d0223b45d0a55f1d429485f4971cc497e48b63dc46&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WU3S5RIZ%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041119Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGy%2BrhPjL4QsZkNqJQSbZoFiLGWNolXddH6DzdCQF42BAiBboiGSCGD%2Bx2US2OLEaEzah5ny7j064GPH%2BpPEDSJ0gyr%2FAwhMEAAaDDYzNzQyMzE4MzgwNSIMi3O373przVlADIESKtwDfaEcIpDf%2BCrW9JumD1MVI4HzYkafUFxaigEKZr%2FeaPPO4QBL9ho9B4%2FzByl1Rpw%2Ba9tvvx2Ty2RwQgJpFHG00B5%2FpfL0%2B8bOlD0UyH5Uo26t%2BQ8V2YnsbuEv0sm2%2FQkdIn2Ig0jHgMADvpYkVThqEwrLw7DHbPPEWwURZqLIVyJCrgIRpEqRTQoGMhqfpveMThO6kqUujATH9V6tTDBuPELRYLQPKKW47yP0pKo9YyNyOkqKn2%2Ffgbp7xMytqOaIGvuow0yMKNPUa7dvCpPJjJu%2FMY588lSY8srppP0%2BS2jIu74IkwlfSz4dmgPCjlZxY%2BAYr4d0o8QArVIH4Nl%2BdxIUGXVav8xJk7ywFJFMcpNZGF6KrsJtLkUVDDWSiAJLvvFBVYt99P0C6wdDcWZhnXx3nqKtnwZ5e9Ol3fF1c12BW%2FYHHOEN%2BhYunIpZ09IYImDXiF0MYZ9sYzrBDjxGefQglscq0ljoif%2FihcmeSNVl2GXH5NwkSkDnX53duvEInZbkOi%2F0G5F%2BwQL1gVVevn9Hq1%2BFx6Jj0U1mfC8bWL3ABqLthkHqiZal0ZrVH711tWoE5ynesrvW8wPthHhS7OreGBjsWfthv%2Bf3c2xH2KGdjkwpDilcXnOC%2B0Iw%2B%2FXazwY6pgGyLRc%2BAqgYSn7j0tq%2FGC2BzJwQIWvL1I9RjImIe7ToE9uJe2v7pxG4eLQ4DItkyXjzSme6JPYdblpLZL8OjTGVVyITafyWS5LQsvEFTRxl1StJXr0Vr3AAGdCJafg8BDo1iXyiyswpLOPqvXhVtqje8jS8gFFp%2FvbsephPABWzQ53pXczfgr1Xv2TnbwUV%2FG4QpkKNnN7jgdoE4l0SkSUawTDi7r7U&X-Amz-Signature=fc09439b98a21f8173700c999bf60fc4b3f035134f2d0c3d82fd5e83344b6399&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QVO33GBE%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041120Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD23hYArXvYjVw10xFXU6C0RSP0rhAzSNGDIF%2BC79mJOAIhAIjEd8RzLdN%2BQ0VkUlFKpgVMicenI%2F4YFBDqfFtxGp4pKv8DCEwQABoMNjM3NDIzMTgzODA1Igy9MBRW4nTc1WmpDhMq3APZm9Jg2XB3Fu6Pmig856KDRw3wfQ8Vv%2FBB5kdJDr0PLyT79GZI0bRXi4abz%2BTTQYAyHplLRaJ0Cz42RcyIYMBA36dEBWu5qavMYRxOFopqLMk%2FkaqGddlGuVfg%2FGgW9oN%2BlhW%2FXVDkAj0DhWzGbGPGFgzN9nFC1Sdu7ZEb3WPDt1GPPDQ0sHx1OC464QbV9FSwaHbphKBu0kibFoPz0wC1w19YzefdHvm%2Fs7AOfpp3y8b28B1blAsVkvrO9o%2FWjnZpF%2F4oKKn320CKzfs70dy3GxHVTpRTjdK0PD6J3ItqGBdA4kSvtR0ugxgre5xtffJl%2F%2BgxDWBJvF8364KBL2%2FUpSsnsWmS6QVICvdbtoCbQCvdmWYgJVVyFl4kOcpTRn9H16xwwo6hHvIzRI%2Bn9Wl1VwR%2FUhm4TnOeIY0JB3Evtt0OJbWyK2CfLHO%2Bge02I0iPCT0V1cc6RWCKjPMzxuET9HZE%2Bgn4FbkIH8jAMzKxPBZ9ph2uCQoSgaaYGKpEUTiihBROl9MkSt5AhzYptH%2BPZi5YUqNxf3TLxNQxKLG6Ld6hcxpEDI4UrgLlyGdu61JFpwhkIxKylwizPkfC1%2FhmuM0SogxrVforW7DS1ATdR4sbgrmakgpaXu9oqzD899rPBjqkAUMzs6gTyc4sb8Kpyue4FiqcEsZuNIwPSQfH7eXIHmU3%2FoWf14Dx8pRVp7LZ%2F47bVzLnRQp%2BNKDWZCdFQwjrE4gc%2BNrTF7s%2BrxqX3Yv%2F%2Bz0ioDwfkBAsFK6g%2FyzRBY2XA%2BoucQ3yKFvSTWiuxezum1M%2FiesbxbPCsEYP7IhWGoQAf9wBSPqb82TCX7ifV7tVRGuEfXRJuEAKB2C5tB%2FBP2Tdt64X&X-Amz-Signature=62ddaeacf62e91e7808f26bd458dcbc6e75e23a0b041baa651e680129a1abe4f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4THFZVB%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041120Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGJLrDYmSC%2BSilJfQnrN%2FJnFAQ3BkG7GYbMAWlZz8VU%2FAiBpwqGGa9F2Pno86Gq61eNp2LSdt598Mo4l1GUjCGLnIir%2FAwhMEAAaDDYzNzQyMzE4MzgwNSIMEml%2B6xiWst4eAKVAKtwDjJ0TIutqLDgEryoONuYYq8WBFWrN9gS1i0VQPVnWFj%2BSMf7H4snXfEtTYHBIHZ5eSIUH3AHXYk34LZAJF98YHIGfBjB%2BywcUGCKz7Zwby8maozoiFXyBrF8Yy4H4MJy8RShnrShQ3VYA4uH%2Fo9wexVKB4GnB0zMQnwsSBMaTQrq%2B7H3xKbdPAcvx0rUvlchznc3bmsfctmNCrN8M460XJTeC%2BwlqzLwtoUNvb1KAUN8nOHsLj%2BzirAs86LIAJYe7EluozMTtO6PnuEIBIxgHKbnaZrYW1DNLdI8D61d7Snk2R5eP3mqEX36nWF09e5f%2FvH5RmyztkfamMRhOYBDZY686%2B4AIEqmCL%2B2S8Hemj4KZWz1lcuHG5PlircFmj4oVxkpGCtHrpUAbEQp%2BVouKJWMjI7N1NxXD3Y1DygfFVDOuPPmWQLBTACznJLhoXMDRGrBdaYks%2FG5kRiQy2yZmAJEaHKL8zmMHNZBGdl8CGhGYLufV056R%2FK8GrmxX2l7pHcyYbnOq0%2FuLjRUWU3xUZNOMLy34NG4brQwEVbAM1IuKNPg%2BoNjRtq2mfCELtnp6MBxuLPAcKu8g097NPSNPQWZ748mRLRY9uPjykgCV1E0C8SIE%2Fba2En%2F2DkIwkPjazwY6pgEEbbIGoz%2BaiWUCt26Rnr7Et%2FkPZeLukT4SJUCHkD0BgShpojG2J1KHkcdDYtC9LZ3jOS09D0fK6NxWJH3RmNvdcByFOw8JbZaDpW0a3KKO2P9URwLNSCGHIj78BTHDgqOsIH6Gj%2FXGn8Pv8Cn023nWuvK0wCGdWSH5ff7WSnuSMrT7fDIucwtQkUYqFoGJRybIit1RrR1coAvbLyv74NGVdqHuUB%2BP&X-Amz-Signature=9fbb5370d53b7de9f753f19a27b530a24f91062eabac3c31c448f51fdc5822b3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667P6JF35B%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041120Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIF1krELwSQ2MRzZbkxCN33AKtfKsd6xhCzamRoqbwjoFAiEA70fGW1AoBK9KxY2F42EfWM7qlgFuWO1HUaqaZvb3X3oq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDO6v4Aeef7PZvcPj7ircA%2FqCOgNsYTRo3%2FGUj%2FFDOyMhSF1GS1my3arlJoVOM1apmybrwF43%2BE%2F77pbBD%2BPiVQlCrHdTGgS37hKl2LPPFh2gqui534BycNanokwMdNT2RmR8aKgMk7b5YvjQg9%2FjH4G2B%2BFna3QlkJIKnm2AaK9pK9OQr7AClbPEbefvsZf%2F3f8p3GCJ91lS9eamfxnPvvkv%2F5RNqpOEMUfaWJoei6vRgKI371cZYOVbZX9%2F0UF%2BCFymvk6mCe8QBcrge56SwfTQJ5lPSVj%2Bq3xhY1CqYd1I7gyOVIwYBNZ%2Fn7IahlJKLuJ5qBzY6Qqjms5%2FNhM3hQ5CUUDZAAspWDntNHof5Wn51L4%2FB19xC44k6ExxnXyGTAQzgpcYe%2Bab2HtgGnSJp6d8iN%2Bn6%2BC1SU4cP7h7OfZ5NZ3xLVHjZqgAZZ1Bp69O61wAe4Pn0NB2uwGmvX06rXethaTTh23859sJxXjhxPp4akLWC8m%2FXonGFpFNH8VxMUGZHFvpQVvCtbYIp%2BjxRRzBtyMvH3po0bjITM6SO8lGnwwJUXJv4NtoFncmYAJY2pAdGvBrK8RY0PyPb5erT097I9JRZ4%2B24zyEF0u4rREbcwB%2FkiLeJl3xkny8bU2xciITbluABUY7GmssMM%2F32s8GOqUBHehbGt8K%2BWCdCAugjW%2BfGwq56cR%2Bb3zNUQt%2BRgkNzkRzhhje4JpZVRu7hF%2BhBuyuAkrlIUGmqv0uNSRVFaHAodmYyAzEeeGFV9u1km9jQJ2XrKtHi9lwc1LsAz%2FnilPR%2FDEuL8QscgjFCR1M7A6XwnlRyNJYs4LeMkkZbrre7OET%2FzUoOHd2cvES9aO6pP56r%2BKYbn7gXz9%2BqZp%2FE32MU35%2FRwJp&X-Amz-Signature=46e5279b40ed63cfd98a14c8c7e582d64c3065000d81b19344a9f3758a0ae108&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WS76VMB2%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041108Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCenNQpvQIDhbIPdr4SvCa2Vpma%2F5TeDdxM6i8hwduvPAIgDlyaXdTLLkt%2FAR6Dn7yUqVxyMZSes80UpX3vGe2oCRUq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDJtjt0fClHm73bpAByrcA6XakA0lEW56tKxS4saCEwJj01iPqFe5Psh5NXXNeDJcMYnrlRn2EhN1zQS0bptAiogslcnrFIVCiK3BdcH4BH2IcLUg3hSZgaqDu73ncsZb3r65N7wi2jpDXhQCfXi1Z8GF93QzOxXoSRiBMqaqZxrmUvlzn1UcE6P7josFzIMzv3A1OFMu%2B4dJuIz7dQqmsFU3oCvsUhYABT18N3VWbIfzp6c1SoeCIIZYu6ZmQTl4%2FBF%2BVEP2RBaqVdeATJcwGuZfUwc8cJaFPHH9CY3zW%2Bp7tYuwjpW6xDbSRHmHrTjo2J8l8Vzj8VLXN0TrOrMViLnJ9ZLMyTvHhrVZtm10k1CwLsxaxWbn5DC%2Fd5wFN9S%2FIuwnt3BnMpO1WqZ1UFYXFDe3DvvN62BLz0Sl0%2FXBN%2FHSa%2BgBwGSd54zIvIaFw7Mub3EfIRj3e0fj1y5xDtqE5KUFkV64EwDGoRxpSZrSmevp7xSd%2BxLk8DzRmpef3AYv%2B6Wq34oOQXdsCzP7SDqvaFsf9ur2dlC7xH%2B9bSkUfOcv4xEbB9T6zbBLgm6hVtsT%2FSYJG1k0azKSEKqIRmd94RO7s1fe1ugMnn9RH%2Fh14l2qlo5y5Hwfz6OaRgUG3A3VjfzxyHs2ySdTnULrMP%2F02s8GOqUByQa7Sxu0vNNDfFcKlFpm5FApvglFcfjkk301ckGgvR8O1oxV4XbOSJH%2F1AkugQxMr%2FPJVH%2Bm6c9DIcKfHg1OnZLhlV6nnZihRDYg5LYSfQ6TlY4LnnC99W1uPF3m05xBgw%2B%2BBltP4LvLUIQt1Sy1k4nsi0OIIIc5PPSHu2QL1ANe6xPL40eZAPo6Q%2BMYjZ2qf0to2bk3A44QaZXIKGOhgPSB8jmY&X-Amz-Signature=797c07be485d8a83802118747b9dd35df61d3983e4cf3bc3315e39e817d12b86&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
