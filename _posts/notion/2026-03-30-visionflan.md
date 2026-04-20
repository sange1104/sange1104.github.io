---
title: "Vision-Flan: Scaling Human-Labeled Tasks in Visual Instruction Tuning"
date: 2026-03-30
categories: [paper-review]
tags: [mllm, vision-language]
---

- ACL Findings, 2024
- Virginia Tech, Washington U, Michigan U, 홍콩과기대, meta

[https://github.com/VT-NLP/Vision-Flan](https://github.com/VT-NLP/Vision-Flan)


### Abstract

- VLM 발전, 여전히 두가지 큰 문제가 있음
    1. **task 다양성 부족** - pretraining, instruction tuning 모두 특정 task에 치우침
    2. **gpt-4 synthetic data의 오류/편향**
        - 자동 생성 데이터라서 noisy, bias 존재

    → 일반화 약함, hallucination 발생, catastrophic forgetting (기존 능력 망가짐)

- 해결방법
    1. **데이터셋: vision-flan 데이터셋 구축**
        - 약 187개 task, 166만 샘플, human-curated instruction
    2. **학습방식 - 두 단계 학습**
        - stage 1: vision-flan으로 학습 → capability learning / 개념 이해
        - stage 2: gpt-4 데이터로 추가학습 → format alignment / 표현을 다듬기
- gpt 데이터는 vlm 능력을 키우기 보다는 출력 스타일을 사람처럼 맞춤 → alignment 용도
- gpt 데이터는 많이 필요 없음, 1000개 정도면 충분
- instruction tuning의 핵심은 llm이 이미지 피처를 이해하게 만드는 것

### Introduction

- 기존 VLM 구성 요소
    - bridging module (이미지 인코더 ↔ llm 연결)
    - 대규모 이미지-텍스트 데이터 → 사전학습용
    - GPT-4 기반 instruction 데이터 → instruction tuning용
        - 사람이 원하는 스타일로 답하도록 alignment
    - 구조
        - 입력 → encoder → bridging → llm → 답변
- <u>**문제 1: pretraining 데이터가 너무 단순함**</u>
    - 이미지 캡셔닝 중심 - 다양성 부족
    - → 다른 task에 대한 일반화가 약함
    - ex. llava의 경우 ocr 성능이 낮은데, text detection 학습 안함
    - 이 문제를 해결하기 위해서 instruction tuning으로 task의 다양성을 개선하려고 시도한 연구들
        - 하지만 여전히 task의 coverage가 부족함..
- <u>**문제 2: gpt 기반 데이터의 구조적 한계**</u>
    - 합성 데이터라서 생기는 문제점
    - gpt 데이터 만드는 방식은 주로
        - 기존 캡션을 gpt로 변형 (대화, vqa, 설명..)
    - 문제점
        - task의 다양성이 부족함 → 결국 같은 source에서 변형한 것들
        - spurious pattern * object들이 함께 나오는 패턴이 있음
            - cup - 테이블이 항상 같이 나오는 패턴
        - long-form output 문제
            - 쓸데없이 길고 비슷한 패턴

        → hallucination 증가, catastrophic forgetting 발생 (기본 task 성능 감소)

- 해결방법

    _**“GPT로 데이터 만들지 말고 진짜 task를 모아라”**_

    - **Vision-FLAN이라는 데이터 제시함**
        - 가장 다양한 유형을 포함한 academic dataset 기반 visual instruction dataset임
        - 187개 task
        - 여러 유형 포함
            - perception
            - domain-specific
            - reasoning

            → 진짜 task 다양성 확보하기 위함

        - 기존 데이터셋은 caption을 gpt로 변형한것에 그쳤다면, vision-flan은 처음부터 다양한 task를 고려함 + expert-written instruction임
    - 2단계 학습 구조
        - <u>**stage 1: 능력 학습**</u>
            - LLaVA 모델을 vision-flan으로 finetuning함 → **Vision-FLAN Base**
            - 정확하지만 답이 짧고 딱딱함
        - <u>**stage 2: 스타일 정렬**</u>
            - Vision-FLAN Base를 gpt-4로 만든 소량의 데이터를 사용해서 **Vision-FLAN Chat**을 만듦
            - 사람처럼 자연스럽게 답하도록 조정
    - 결과
        - hallucination, catastrophic forgetting 위험은 적고 성능은 높임
    - key insights
        1. **human-labeled task 수가 올라갈 수록 성능은 높아짐**
        2. **gpt 데이터는 성능을 거의 올리지 않음 → 능력 향상에는 별 도움 안됌**
        3. **gpt 데이터는 조금만 필요함 (약 1000개), 너무 많으면 hallucination랑 bias 증가함**
        4. **instruction tuning의 본질은 llm이 visual feature를 이해하게 만드는 것**
            - bridging 모듈은 거의 사전학습 단계에서 다 학습 → instruction tuning은 이해 능력을 강화하는 것이 목적임

### Vision-FLAN


2.1. Collection pipeline

- annotator 선정: 21명 중 2번의 training-test 과정을 거쳐 7명의 컴퓨터공학 대학원생이 선정됨
1. **기존 데이터셋 수집 및 전처리**
    - 두 연구자가 고품질 vision-language 데이터셋 선정
<details>
<summary>예시</summary>

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466REP66QIK%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035041Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJHMEUCIHeKsGbY98XvbA9IkKJX6R6wJgEcwNtDM7gCVif6vd6AAiEArggmKjsGy9uRrrNXlZkPhVNiBseCo5xtfHMAepmzAzMq%2FwMIExAAGgw2Mzc0MjMxODM4MDUiDHqy1XHnc5uPMnd6dyrcA0scm34kEbXozSgdFBVIQ%2FE4r57l3T4CO3ntSfA5B51xxmf%2FUTjtrNZi%2B8P8Q8MX2wjgSXGrzRhPIKHK27rIJ0fcvOaefRZjuFkFDsf3hqgSQ6UNtGhe021%2BcwkdJA7OoAGDBt7SieLUuxWVXYaYPMKrcsFVeNpvV0NfTUVueAsGCHEpk%2BATnyuATk8itY9JZ5qIchf6z%2FdaxhOLmv5vTQ7KBvj%2BTFefD6EJdTEpERlclQMV3RYGnyZruTf5FfpjNOK3J9OVVMoFxqnd4JiVqN7it1EsBGXHkk69ML8fbU80ZXHOUsQoMMUYBN0yMY%2FNKiYy8LgQO28AZcX2SWr6TmzbOA5ZXy29iZKr6aLdLyzzu1nFtJIR6MwKNsJXocgbW15oagSm%2F5z86K1xKJS5y2BD%2F3e2Xssn6f8Kk5wzlrVLTgcy0yGTEgIgDdD9a99%2BWV2gpnxESBi3pneg%2Bk2E64Jl6BBTnAHgnZyrzZZLbbaHU9h8%2FfOTMJe%2FKs5v3MrzVB%2B%2F3f2TnyQaQ6nWctdrLrXHhgAkPT%2B8EdDG2O5wtV%2F8J%2FR3t9Ir3BgqyCwZ0403XdSx8ugahl2Oxp%2BCFSiYCxXkqaL762gvKpSZRB9UzE2U0ZSBhCpuSZ9cg933MMSWls8GOqUBowswVrjJKXQ7ID%2B9V7iIn%2Bo%2BcPVPafcom7oz0uf4PdXCv29mFryZTKZPFefZJMayabWmCX6vViH%2BNXVSucC%2B1WqSf1rpYIApNxRLWOIIZbRlaPpp8TCNrqk648uJVZ0nMJVGC1K5ns7J%2BAmVAL%2BpDz0%2FvrKEQLYridmt5ioFcqBuxFS%2F8Xj55aQr3HcbLUvDqB2QYy7Hc8Pxe%2BJARSJpJpb5Wkfb&X-Amz-Signature=6e41beb3a5ccfbf93a19afdbb9b7da00b50046ebd56f73b5afc67e1886557437&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


</details>

    - 7명의 annotator들에게 분배해서 각각 다운로드하고 전처리함
    - 각 데이터 샘플 구조: image, instruction, text input (필요시), target output
2. **새로운 task 생성**
    - 여러 annotation 결합: 캡션 + 지식 → 합친 output
    - task 단순화: object detection → 이 이미지에 나타난 object 선택 문제
    - 새로운 task에 대해서 20개의 샘플을 사람이 직접 풀어보고, 정답과 일치하면 taks를 유효하다고 판단함
3. **instruction 및 output template 개선**
    - 기존에 있던 task는 annotator가 instruction 작성
    - 새로운 task는 annotator와 연구자가 함께 작성함
    - 연구자가 랜덤으로 할당되어 검토, 피드백 후 반복 수정
4. **task 품질 검증**
    - 두 명의 연구자가 instruction이 자연스럽고 명확한지, 다른 task와 중복되지 않는지 품질 검증함
- 결과적으로,
    - 총 187개의 task
    - 각 task 당 최대 10,000개의 샘플
    - <u>_총 1,664,261개 데이터 구성_</u>

2.2. Comparison with Existing Datasets

- _Vision-FLAN이 기존 데이터 대비 무엇이 더 나은가?_

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662RD4RPZD%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035042Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJIMEYCIQD8mcPKQ0VyY2u7LvTfIcuvc2xEhdFeJDXoz10EW6epgwIhAK4C2ZXGVvSUo8Dfd7y8Ifi8wR5mY9bGOadv28gthIP0Kv8DCBMQABoMNjM3NDIzMTgzODA1IgxU2fuwASBzvXGXCSgq3ANMjPR8Uc7PbBk6cABdY0nfymbbRDm1VbUTkp2qY1uw7evszhoE3u1XUItQbkIq8qK0DKkRiTaZQFpqQw8hv3XE7BnKn4RfreycjHWfDDpPHZTSXcLq5qf%2B1UzmJPekjcM61Z4SYOH%2BzWSdMYKVudQYaXNRq5UibV4q060IxBJzMB4BYBLPSMv%2B2OSXoFpizjWvo7ewb5fOUFO7kXmoSu8Icibr8hkWgQY09oVdObAGbj1J20puShsq2XtyuOt8W1YUANU8HVtF2aQNp9q6o%2Froxw6c4voJdub5q%2Fvv2ep4bI727QmaFjQwqd5jnQj%2FDxgNbqLxZg5R2FCEmmzRMwVUCTrBiB3p%2Bd82VTLKuDfwkXVKnLXOUmhfIb4pQ9Hry1HNkHFL6b3H7t8FWTGLUS8n%2BatReYgGkHetlDdQJe9JdqNXpRavHx73Sk0jY0l3gJAjO7afgnad2M95Fegp9LK3G9gsDzrKIx4yD0WOuLXToOvKKE4qGan8NEf3iGuTpy6%2BT9nc%2BBJeFIy6Nxz9gzZ3GetHzzQZmOvaylWZTzpwrWdzPBdM64qFjZn7PHHAG2NkKPyGWT%2FNJEqEos372qEftqfdZsjSAi2AkRIkycUKqonGDvOrFZ%2Bhqa6OQTCAl5bPBjqkAaGEKIQ92tZR4sWWt%2Be6SKnYAo9qJAHV4Hs%2B2z%2FvZwcvBU5LfK%2BkFeIcAOpP6yA4Kg2d6eDGrrzVqdSf%2BBrdxxGreG6Ft2hDUgbf4qewOQg%2B88xL7zKI8SAEYTFpVZfEwvSMkst7%2BtdUveB2EcoGuaGXOAWhJSzAprlG8lvoUNzbafAryQSsTM7xnnWe1XOXj1xAmVVWrQC1DiW0ci1QEw2yJn5u&X-Amz-Signature=495a6f2a990ea79136ea9a89341b951b312b283d1677d34c7903a0c8cbb9825e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 기존 데이터 (대부분 GPT 기반 생성 데이터)
    - task의 다양성이 좁고, 대부분 합성 데이터 중심
    - VL-Qwen: 사람이 만든 데이터셋, 하지만 **비공개**
    - MultiInstruct: 공개 데이터기반, task 수가 29개고 특정 task에 치우침
        - visual grounding 중심임
        - 일부 정보가 부족 - region-specific 정보 없음
- 하지만 Vision-FLAN은,
    - task 수가 엄청 많음- multiinstruct 대비 약 3배
    - task 종류가 다양함
    - figure 2를 보면..
        - 우선 vision-flan은 크게 3가지 종류로 나뉘어짐
            - question-answering, generation, classification
        - classification의 경우 general / vehicle model… → 단순 vs 세밀함 모두 있음

### Vision-FLAN Finetuning


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WFH4RWE5%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035035Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJHMEUCID1tEb6J5u%2F7cYvTU%2B%2BQvFIaaQ1TdYPYNwM%2Fkjsw%2Fg9eAiEArqTAQ8dIjA7Lz7CHXauhQMLuKChCPX3ikeMEzk%2FP6wMq%2FwMIExAAGgw2Mzc0MjMxODM4MDUiDHIGNU1US5bPVLRwSircA6PxNYJ8c6OmQdkZ5NxPhgWX3R09LAMv8pnQ3t7jIlLFOGtR3AkMageUtCqK%2BJeDARHWz9oB0vD667Z4hbcpf7dAwOHtX8WWJhoaajeJ%2FPg%2F74zeJI6FJNrDSf5kyGC9vlGRH0f5EfB%2BZhLZ6UqODVCiReAZYRPbwUrJfyuQf0QKteO9fUDw4ypFDpD9ne3BqHrE%2Fh9t%2Fbe9FahIJcaI6jFKKEwlIfyxQx2J7H2GKozQ562qwrhXUcC%2BcFRrWYKmHlw2sYOz%2B%2B00xK6nThh3jDawfm35auG8cpXbKgBxMSSlw3wz79%2BgSC0tK9j0AiEKfmjvpOVZY1l1%2F7wXe4OS15J85Czj6rPrfvTIOAdws%2FOqCegd5%2B7qwLom4akLb5YTSZnywpwikrJpocObDex2cfyKRvheCIGY9mtbEfm0JdxdY2AudTUn9OOe40CoWai6TOZ42tu6i%2B6Rqd%2B8n8zz3yzvjWK16pFpF1hG6ij9MuJWRcxVBi%2BSZDTSzFUop3S4UOMaIfv6HDY5Bc3Q6W34qQWKHnWhCk6H7BEAH8PXs%2BzH823xNwakyS9Ly%2FW5CzV4ZmcY%2FWGykKj%2Bg4ZX%2Bh6tdjxt2oL2zN2UoZsXIFjqjev4GQeRoNoLrii82TYKMNSWls8GOqUBBcHj3%2BQP90uJR7Y%2BrIzP1IC2OcH0x6Tk97nN4sUfpRhAyA%2FsfmsxQbhPm0wPHdCYmRyOvJ5XY9rPSMMXgSbH1NF6Yp%2FBMGZkXlTqJC%2FG%2Bn4k%2BR5kNhI3Llg%2FDxbjWx257VICNbm9sNP6aNofB9sZWbWWF7Ajs%2BgjkuBe8XPM83NzWV0ljhpVcXT46Z1U3Cdq1g9%2B8TdQOZiPJxxmgEx4nUFgVLye&X-Amz-Signature=3a2e026db62f0c94a46cdbd5990c668bec714a425405535e6bfef9e667428758&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 모델 구조
    - llava와 동일한 구조 사용
    - vision encoder, llm, 2개의 mlp
- 두 단계 visual instruction tuning
    - **stage 1: 능력 학습**
        - 데이터: vision-flan (187개 task 전체)
        - 학습 대상 모듈: mlps, llm
        - instruction tuning 안 된 LLaVA 모델을 initial 모델로 사용함
        - 학습 결과 모델: Vision-FLAN-Base
        - 목적: 다양한 task 수행 능력 확보
        - academic dataset이라서 출력이 짧고 단순함
    - **stage 2: 출력 정렬**
        - 데이터: 소량의 gpt-4 생성 데이터
        - 학습 대상 모듈: mlps, llm
        - Vision-FLAN-Base에서 finetuning
        - 목적: 사람 선호 형태로 답변 생성
- implementation details
    - 구조: llava
        - vicuna-13b v1.5, clip vit-l (336px), mlp 2 layers
    - stage 1: lr 2e-5, bs 16, epoch 1
    - stage 2: lr 1e-5, bs 8, steps 128
        - <u>**llava dataset에서 1000개 랜덤 샘플링함**</u>

### Experimental Setup

- 평가 데이터셋
    - 객관식 - MMbench, MME, MMMU
    - 자유 생성 - MM-Vet, LLaVA-Bench
    - hallucination 평가 - POPE
    - catastrophic forgetting 평가 - CIFAR-10, CIFAR-100, MNIST, miniImageNet
- 평가 방식
    - 공식 벤치마크인 MMbench, MME, MM-Vet, LLaVA-Bench, POPE, MMMU
        - 공식 평가 코드 사용
    - 아닌 경우
        - CIFAR-10, CIFAR-100, MNIST, miniImageNet
        - Vicuna 1.5 13B를 사용해 평가 수행
        - 4개 데이터셋 평균 성능을 **CF 컬럼**으로 보고
- 베이스라인 모델
    - BLIP-2, InstructBLIP, Shikra, LLaVA, Qwen-VL, Qwen-VL-Chat, LLaVA 1.5

### Results and Analysis

- 메인 실험 결과

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZVAKKBP%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035051Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJIMEYCIQCrbZOdzzwqt30KZV%2F35eP%2FIuqwohUvaSCA8ZUwZRpHRgIhAON74%2BcMpG4mlckIVrNFl6BH98DdnChPsZfReOyGcW7oKv8DCBMQABoMNjM3NDIzMTgzODA1IgxqCzRAIvGfLrOn8IYq3AN84UKGvm%2FY6h7WF463jIArhZHQkWYxUOpB8kM3pZ3QitnISLRDNR8pckRUf2u7V7ayeonJOAzUiQR4tajZWmwVSDRnkFaS0PUWkFlMFSHVWEadHD4PHBQrbvwHdtT5PteP92a%2BJ4pJsHqhLnN8uYRQX%2BgMHdCpQ37oTY%2Fxp%2BAYctQdqrm9nYeMGQLElXobWTITeYiDPE%2B%2FmRUvwu8OYEyv%2F1LrYomflzgW9KuB%2FO8QtpiM4OeSC8odMDd%2BWhCbQ%2BMapfPHgDv74bYvYdXBUL3316Hs%2BpOC2XlwLoinG4nNZCb6eCpTk88l2prO3FdeghzxUVi7sH1vewlcZJwbVsAbbVk1CQAAt4sRfLt7RtTX08%2BP5i3wzOi9xmsBUqdRP1%2BZmCsLrUYPq2ivcM%2BAogG6or6e3vcShQE0hvdK3AWoDUonrxs8Ey3xkJ9fbV%2Bu2jydbp%2BTqoSmrIvP0WFKl2P%2BnwrZ%2FOi8fEDV9i8%2BeFYXtt8hKjbZ%2BHIWXyUPJAkMpNshe%2Fdcy%2FJ4xsGqwP7WUnD1p%2FWSyCNp6YyTcu8ws9%2BsgmIBgDj9b%2Bx2L5lLDXOCec9zRQNTX7%2B3X6WsrvKof8cSPytN9IF2hXft%2Fqh2j%2BLVAsaIpSbymdcnMQg28TDclpbPBjqkAXSOd55llddXhTgPX9ATcSoMbEMGTg5ZvIf43FQGhwntG1n326%2BbN8grVYbAGOOE1Gtm3CZ2pdEdHtj5FRZqbegtjdVjA6rbsB0nCWDDwA1URkDPhZWcaGoMR7r6oceNzP8F0gc1hoszXrDCmfmNILFwWpLgpVUe1YJ8yR3dCy0FUXR%2FYQZIuPhTcqpcm0N%2F62UL6Ep5AGVeAwdwMwVXgcZthXxH&X-Amz-Signature=11a54f5484b8c3cfd276271d86c477df11a6356f0e3d029a4f87bb237a3ec08b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - VISION-FLAN BASE 성능
        - mm-bench 등에서 sota 달성
        - llava-bench에서 성능이 낮음 → **academic 데이터로 학습해서 모델이 짧게 답하는 경향을 학습, 사람 선호 스타일과 불일치**
    - VISION-FLAN CHAT 성능
        - llava-bench에서 성능 크게 향상
        - 동시에 hallucination, forgetting 낮음
        - chat 데이터에서는 성능이 향상되었지만 일부 벤치마크 성능은 떨어짐
            - gpt 데이터가 bias를 유입하고, hallucination이 증가해서 그렇다고 함… 이후 study에서 보여줄 것
- **Human-labeled and GPT-4 합성 데이터의 효과**
    - task 수 증가 vs 성능
        - task 수가 증가할 수록 모든 벤치마크에서 성능이 증가함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T3GZAKZ5%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035052Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJIMEYCIQCWAZXNLe1Ljbi4IqxcNXFUNtDJKyDTIq3ecEX4YDb8EgIhAI2j349MdmvDs3UkvtDN26%2B01pzFNB%2Buw3rjQk7GxdfYKv8DCBMQABoMNjM3NDIzMTgzODA1IgxMq%2Bu%2Bt2pJbmlm8vEq3ANN11M1r0ytM8EGLoc747lraIqvfS0kPfuKKvFf36r6FlhlLSIgPDr2iHv7SbWipTMVJXn2GR3LANKdLru5ubcbdN0hXf75EoOx7NCpm25oNCH9EOL11LKX3Qqmg9jNIiGeqzFJEZff67jkaqAUERDe7vWVCtni8H3GzGY2ega6snZeHg2no9%2BlHQGhMisteHyhFGZ%2FPfAbGMaF2%2BaTSXRPnEPYSVNRhNVd7nHMpyte3chCTG%2BjIRVrg0tztsYTIn6hzK2hvRO%2B97hmurQVedKdegnXHOZuZHDJfgoHbv%2F7xOQFFTt%2FDr49ea%2BLMCEOQWmeM6GGHjrPqwN%2BTFRWgqG896JZyvMrrf7zC%2FkopcC5aOtvicL6ZhGKTuSXt1iyaJ3A5EVItxKCPb2l4EDNQ5ImHGxVK8wvUOoekBYd%2B3iJ9BeZ0R%2FOish2ZNH4YS6pHy1bOd%2F3%2F4nfuBslCVSU8X5EC5FOGl1NbEQysxjAKUqSk33zOWO0AwZ1QXVaXR%2BosWjU1upGdaEbPyHHxH7swTGhR0RYj6y6WWAfxpM9MSwYyDy0PQvEz2JklxbiDZkbF80fomnMxdMm9OCQLtJ3fzPxwJJKNNR%2FTqDSFqR8Pr%2Bw4bw3L9EUGWm1%2F%2Bk3iTDRl5bPBjqkAQd%2B6790xLOLLmq%2FrxksB9RRS%2B4VGsER%2FyMRgoa9ROaf3bpIVKooR%2BWfoP0WkK3ExdAIH997hCckbE5HP%2BG1xY0cTbQ8m%2FzAgTUOuUOGN4ETKSRnU3c54Q7wdMtIFoLXvUSdBoswpEIpJD4vn%2BqLBLhp6m2EB33zDVqA2eVmR0kJCx72lBtjYqq%2BFcRNBcbLG2cGRDVlVXoR34b8RKhjp517W%2FIi&X-Amz-Signature=c0af843ba37e509a4b9f5ea658bfc5ae684498b9840c20196eb2e693acc9602e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664OPUJS5X%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035052Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJIMEYCIQDr3IudWSOf2ky%2BFzX9gVcgBHjCa3FzhiDZAS%2F7SWDSKAIhAKP9Laj7q4259GNXkk4Yug029bX2RfY8gDRIHOc0CC5WKv8DCBMQABoMNjM3NDIzMTgzODA1IgzNlQOoG6tlfkmmOQQq3AN%2FCA3c32cgletwI9K7FwPVW%2FAHc1E7o794z0miiYjn9X7YfUy5DWBKMaNBwl0P8vitq%2FUGuaJaRayn5pSGTgp5GFqGQWuhjClPYMKAwRZ3xkvAJC5xC9lYQhKxv2iQdcc9%2B1oBrn8%2FpO0J8ln3MZDDwhRSF1P5YtVhIfkPf3Cb%2B%2FeAsPtUw1qk2s6maRipeMUu3EBn%2BPhWeaCDOrJ4%2FlVvh%2B8Z5wbUFUCR%2BvREdf%2F%2FGTulVrUU5dOLkfOdG%2BfHhJ%2BGWIx8MtvScKHhx9JzbMwn1XIopPZcJMn60mfbBdSC1zodjhrChqK9C%2F9zmNhnSwKi6Whg5VRR%2FCIpqLj6CpsSsVihTF9fkMQqPdM6W60YcTCgXFgmTt9YsLtslz00tl3GaMKrTUOxOJcZWzBDLSOdq72DacDhtQEa7%2Bt6KdtBP9h7u9bfup56ajh%2FoHztOq%2BfW%2BI9wTFVI5a2ofTZl81MtSsndLjh3fqs2pgwTKX7Kev90%2BdKlps5gJTtNABPksxIby%2Fby6AKmU%2Bj0LIn69Vf7%2FnfLG9P%2BTpLaUXNwtC5EoH522pdcmaone1ICHAJKueCnix%2BKJKn3DjWmNWn2%2FTTiqqPBHOb7uCi1Fhh511Z1JRD6ZJu4YsCXcQc9TDYmJbPBjqkAYKHrZX%2Fux4axd4MrpO2jt3e2VPwfnptNue3SoptiAjyvfI2qKwI8Il6ZB7ilEdoVR%2BrlWbL9DUE11OFruQmJS%2BqH0FFe47BEFLPcolKOy5ov5m889QpKNoXD7tzmQIIk1kSqaiKGN3ZXBKRLrRA%2BKLOHDWjphrZivKIVyqdNBHC057Skc87V0EvKV3sZEzf3RJ5mfGzyokrlIjVYHpDwz5QfuSX&X-Amz-Signature=7f585a6d7340b8f68b5a3bdec6702de766abfb9ed044d5ba9763be14916aa9c5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WORNKOPS%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035052Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJHMEUCIQDOYrwO3WMssZ59P%2FqzYUmLAo4ubWaoXiSn3XdSFL1c0AIgaE8izrDkIQqEgVrJY%2BV1ttGn8SgbnmoiA%2Bb7D7QjZ9sq%2FwMIExAAGgw2Mzc0MjMxODM4MDUiDNNBEtnIjWmBlhTw9SrcAypzdua7qDwjtF%2F4TlR%2FBjtUKbI0SRHcPaCR9jaO058oDevoGRoVeVBfym4OZHBYnGZoLUDnHJPewKp43QF3mY2b993MXm%2Fly0UpYA%2BVFjGpM2nqr3nJR%2FTZ3s3535iBOl7ONgclGG2z5sQtW36RNL91TF%2Fe1BhzJ8pkIOOdBDI3f110M2%2BW1V8Q5K3trBayJlPJXOoz5OoO%2Fr0SUq0SgvEslt9D8nMGgf4%2BmYBsd3QhG1naRk11beJAndO%2BgTrcFceMse6dLaCy60TWSq1o1tFtwOUFVm1GVdbOXyaBFkKnPuQ8IHdzbDx%2BQjJzniKv8BG4%2B8Hy73Nv299621TOw2vhXr6Vi059adDxJZAyhAvaU6JUKRS9YHX%2FiB%2B8vQfnHpTav2hNfkhHw8l3fsVtZQ3a4lmIyLKUdxQkJLDZjKLgtobm4ME0IliukyLeWJc91X2uyQPH6G3dIV%2B6KpC0MhQIjOvVanHO152GB87yFSTw%2B4NfRL85Cs1Lqb3dmHxymt%2BRFQdPukzFlV6VdZbe7QehW6ZBTdV%2FIhRFbz8U%2BqVavkseqAKFYsmLKQe59Y6AY64F%2Fd0GHRgOwi5wwfPIUnoSfIbla69AXPcx5pee6wGlPLATCesuAUoTgPkpMKqYls8GOqUBcFoDc6bnwCxrb6gc%2FKEYWFCZaPUiIQbT2FMDj13Qk0mnVGERCqHhnCjkmi27XSLTgBhafrvnyx0Nom8NoAopoyGklPNGPYhF9jkjpVnt%2BFqm%2FODb%2BkEM32UR8GM%2BEeYR%2FfRLihvhC964oN1tYf4Z9hltTvIN4UTtmzJevwp3RC9XP08GwKg0c%2FtZda72tFfbNawQ1qhHIn60cZdmvPw6kDpH9VvT&X-Amz-Signature=5c340f97f2cc991df5fcb91e50ed359f62bb74b8993ddf8f3f43bd97ee27a0cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XX7YREFX%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035053Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJGMEQCIGdydHDS64PtsaLvB1XpW%2BbQ3EtYDoKbL52B42DihPWKAiBmY6zbjkT1loSpfk8i%2BJs2Wrpp%2B3TX6GO8ZRvp1PduiSr%2FAwgTEAAaDDYzNzQyMzE4MzgwNSIMfV2JLarjNzk9QfW1KtwDvQmytjpeNi7fX5tu5G%2BjawOgoRBrinidxuHk4QiqG%2BWCqfLyOuOCgRdCZu1npEFyaIOoucIllrIiqVV97T2TYJ4NY0k47lCCLy57mkNerUJmTtc6zXUj9ZNq2RrkgHuC9ucN5YRvJQvvdvaUBGuSrzh%2B8diuUI02dZ4Va7YZCN0eprslyrU8Tg0UCBbRJqUxi9K1FRCVwEmYQlVnwSfKTX44ePpTI6QzVfmf8ltq7CjP4LZDUGHikJd7pCb3qoJ55vFtXbrwtag7GL6wrB%2BlPKfiECMmkjnMMP9OKeuocIFqytzzLw3HoaKjTfjeLSJ9NdpKxa1%2BTsS5%2F%2BHSkGDEEfu3dtJua7%2BU%2BEMbwBmKrknq7MIplyhxFTVqisTFYICiVBDipJfZV3JiUa864obqtEKj7TmXO%2Blyy%2B3lZQM1VM%2BBhUrREmE6AjTWdeMf1twufr5j8oyaGzl3LpUzDOxGHITf9J9oMZ91li3ZgUNfbU01bKwvnZl%2BSuCoqFC7ADcXMaUqcFoXUv0EzTJqsFOKeULzNxQBWMc7wkNYTc6MM2X1VpiC4%2FgdgSW0MQysaY7%2FWvz9DsGdTffvJrRr0Azol9ZjSuBXzQYxiHLNtjCKadPbuoo%2F6eExAhNIGDswwpeWzwY6pgHAsIne99fvwFRmtHETCUEmk30r2Vlu%2FQ%2FL7Z81rO2H7LI1JZLEQ%2BdWQtMQ7sVSGqYnwEB9oDSWVRaN5UL39RFwPenv1eHLvBS%2BOkfzX2Noz%2F0cByQE0RLwCpRSVYPonlHYoQzdfhrUxLQacbEUkPkbnuQd5m%2BMF%2Fn8F2lwovRa%2B%2BmWQ3V7AVlDg327mnGRyyYrNvEjC7wsV6txFfFCMFE8fVwL5Gzw&X-Amz-Signature=4085e2a5e95804291ecab733c9915125f09b59d6e400fcd3c97907fc94e39cb2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663ZG4LPIG%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035053Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJHMEUCIQDRoeFBeJON8ZPVNPdNiFdZJuoVuXC%2FQZ0VAHlpZYYj3wIgCYPrYcEdwQerYSHvJS%2FgsNRcSywLfHOc1K3asPuKicsq%2FwMIExAAGgw2Mzc0MjMxODM4MDUiDGCQxr09skvGyCM0lSrcA1COggD%2BMNEVBJBABbiq6GXZw%2B64MeiJpCAqUhiHyX7obyoLyuKIzLbTcPb5SGR%2FJttP1DY6mOEWGJWkcqnWdKD5uqS%2F3QVIiNxP7Hk%2Flmgx9h4rHBRRswMkOJ4ewHzNcWiZZfgGOAa4HZqO4l%2B6DMPT7ug%2BXZ5%2BbSJq0Gg9l%2Bdt7C%2BIXCDYKVPPoBiDc43bgPqHKfYpZ3HpgR5O7uynNz%2BEHM6SQonerFXMzlZ5hK%2FyqoG5YuxXTUVTD48nWwC%2FFh%2B%2B0R%2BPQoqR8reUHaZosH6wgVq2IGlc4aAX4Y2CsL0EmVcQ7LpLPk%2BZAz2ztNFzORHRnMXFrkqiZ1WtB8Tl8A6gPa2yog4uIkJwVHlVu%2BY3ypeI4YSRjh05epibrxGsd8N6SN4Hc7lgdtst3LNNdECsB2tWK9rmZFrFmAfU2%2FGn4RR%2FgYCGksnA4Jwy3N0g%2B8w5FiLavrJr8etL%2FxsyvGt4I%2Bj0RRxURgnCLUYfK6BCBNprvdNK55e0a4EfbTLt30ItApCfb8hgguaRBZZSkD7QZXGESkQbu4TeRW%2FBBfbbztmjbHKvA0Hsqg6BOjr1Lnfj3EY4PKuSF%2BYZ85TryRBrcF5spaJKKeMtDH%2BIc4Ae4%2Bl8iRcw2FXvLZ9AMNKXls8GOqUBcFeKh7PXhoNQP21AFSmubzGPgiaqI59BHf0%2BDqdjsGkeWSmYhf5kDwX6Dra3eU1ZosiL2UWjvtMlmvwbSoF%2B%2BYDT%2BegjuRjDOqa7q%2FpnW8N3UmB16LDAr5tDyKr7B3SB9DpmSm5vN3289BA7Ihi5yvhcuJvathzTPwsLy4os41UVJDcoagNixVhvPactVmoybLzK9NlmJAA3pMg8MJn82HFCN%2Fkj&X-Amz-Signature=9197286d3a999a51bc0c87862fb6655419a6710055cb8046fd828451313722e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664YCK575L%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035053Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJGMEQCIE51Z9N74hiA%2B2DQgFYPzLBLWvtDXMd46XNgRAkprtG1AiAca%2FAqZdKr2TGAW%2BJhWZGqZwGX0iPuarSNyE1togoRISr%2FAwgTEAAaDDYzNzQyMzE4MzgwNSIMWYzRKtiLJtynmsGzKtwD%2Bb2pOxKROf2Z1V0OLB%2FVWolZo1O7RQXcwPgCwhQ4AIUbmOHt4MCWS73%2FLm2lgaNfaHK9yl9oREtVw%2FuPsEJJVx%2Fftz%2FPNH0DeeZitD5bYfRcL1gsznCW1HEbR1mTw52JjANCUEz1umHy80XQCU3ba2XWy0wSJqCvjNt4gpdP53cBqddvvhpIDJ8fB2YkkgiGbEXcmOp11Ct45yQ6mE%2BF7ngQGbD75ZcbKlz04H3cnLyoPAC4IZa6aaoyF7zzJFepYRbNZSekvhNz3rP6v0RExli4%2FV8ekxRUCNKFMdiqykCfomHHP9tFHXgC42c%2FLVNYDfVzznUhhbqq3uLOLLgLyJChM3dzRVFo%2Fb%2F85%2BYq8PEnUwHlgzdoZdBS1RWAgRmPMiLnvXULzuFNkJiZvdQojM1dlsz4iVQjis12iQQAeqC2WYLX9xZtXBFx2GaJ8TMBwDS3kZPGi1P2aRQkf%2FCUsuy7W%2FLC94evR0pbQl9PwT2ulMUz9cP2Trah9VGoEDR8jFwuHj%2Bnfjvewg5BTQSZwKCo07lq05yoSMle95KQOwgUAt6mSEbOTnUfgTzuEhx1PW94gWuhee%2BHs%2F0GMCbJls9kKp04mtPFUH0T2Kw%2Bc8bus4utUgn6iR4miUIw0paWzwY6pgGsangZ1l9RhAN8jlyo4lj8Vss%2BYOgyLGSr58Wm6pLGO%2FooY00KTCHGHhsfP3EQbdpLKekGo7A3380QDrHS3gEG%2BD2mq%2F4BgNf8EGR9S2%2FPjCIHxFttLmukbaxVtU1ZRlwwN82DcOsWow1k4erVx%2BWe8vE8xLcCFk0kXvhaFeHmmQDIp39OTKnMorieQguzvlJQcgAAn2NnV8FRoXKpPXec2InC5maP&X-Amz-Signature=55ce1f333ac4ee0844c8db9889653957f429fcb72e5fdbfaafe94da6c53a1611&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S4H2QRBA%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035054Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJGMEQCIH9r1Zmt6%2Fid8kIDdsnDGI1%2Frr05Bjm9jFHwaHmAMYoXAiBKe7%2BgVBX8d%2FsXP8RzQ73sBISjI8%2BDc1GTezW5HzhZ0yr%2FAwgTEAAaDDYzNzQyMzE4MzgwNSIMSklEq79nb7ctXmTDKtwDkb3%2FW2MU17QO5b4A4j0Eas9PXlGyFpAaPM0bZoJ%2FEjyIo0i1NnRS7fTFE8YsGoOENX2uEREHaBAlBPURTgakQN6owArh%2BD4N1%2FZJvtMrzlL88JDJ%2FZOr2NLopTlr%2FgF1WSIOBrZFTGJSSf7eWjND0fXANbusiVTAgZZUeZ0DniwSEFeQdo9fL5sBAPQcfm3bvVdFmI4j%2FSJfjCZ46V0fgOJ1DKlw3cGlkNhnuEjtpY5Pt0AIU5fch1XmnrwmZ%2BT8r8zsOikSiFROHnDGdROBVFRLoci%2B38UtdDJcuzTThgIdCHVv0DUShsM%2BJVeh2omtaOuqpAzkgqHPSlQ%2BCC2xTZZkxDiJIESJo1GMs4j2sPj%2Fqbv0rc1MZY2pYbr%2B3y856eljjolmQYJNZnx2ufCGHLRhumT5vltyuzAVo4RcqZR%2BizlQImpraXhdeQVNjVQfs72OoTG2EDBOAexwxAAmAKkjG%2BjYbwyGsRaxUuFTUdjBJPJx9gg%2BfHWLJTsW5JLK7NrF2w9e1mIZb8uaIsSKFHcV1k9lpepMKNKLBh8P02ZJUTAJYQs6iZL6%2B%2FaqQdWrAr3tqPdRI2eZuNzCU%2FAqJi9Ikjnxg7vGgyNLOV3ukb4ve56yi2vmoX5r8Ukw75iWzwY6pgG7OV0JOGsv2Uj8Ho0vtAKEEqZUcYSRmCt6i%2B0d9xNBlHcrN2pwmFw5x6d4ufwILb2%2FGaPmuytipgvwWgfymDaNXpn9RGbV6LGd4SbznieWWEVbro3I4%2FNhyOKCQoOB%2B5twa5%2FpYnapOB0Ez4%2B2374tMDC%2BLrfpmIlDRYi1fCu7gPWlrAygNsc9Y9xvUh3T9w40uYEAjaSlIkIlIbjkszVDEFoe9SkR&X-Amz-Signature=79f1baa3c93eab5144249af17d2cd3a6ae28d8d680cac8aff3402620fd661648&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T6RDVU7V%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJHMEUCIH4Hbfls5UY5uxD31a9XfCVmJahLHj77CQi%2FMbeeN1fqAiEA20Fl5qMgOCsvwy1mOg17%2Fp49VXY4cCGa1G%2FkvHzAxGcq%2FwMIExAAGgw2Mzc0MjMxODM4MDUiDIqEs%2Bn991tiQm%2F2AyrcA%2BwMOeSPC9ZvKz4gfcl1TONkKPIYENw2Scl0SqCDX14aU%2FtuBisCzFbONQxnzovCy8V%2BZMtTeeGmghcuWYIt9HaBCX3StG8dOOZCqqmS%2FpKsWSNFA0%2BpccwHqyHL%2FtQyz3atYpaqYHmXpge%2BkktByUytlJW%2BQJya2300mK%2BRc6bNPoQBbwbgDBf4t2gIau%2FfwnXwzkGdIeq0HD9Ck3yDa2eCLF4Z2jqRp9%2BjTkgSex5K2bqM%2Fml03bZ1e47VrSpgOrr2Ba8GzX5yjjN1jAJ1S8cHgvWJJfWzRkbBJbPkCJXEbV4ZHp0zlXGO7ibACVZlwr8C8XQUikztP7n%2BFLNFcOHDDM%2BEUTeov0KZfTagRbZthPt4JHtF5i9H21xKPbaWNzkjNNAh2SfxylFWcEYFh2wHki4XlP90m%2BTIvhCse8Fms9xmWNRRCgD2KzGlkBgc2dkdOv%2B1vmOp8zT6OTKV5s0HalMEbRF4JwFgMsNSJXXVYxoSTIdTu2lZ789cgfA1PO%2B7or0Auj90aGVqZ0kDwG0QC98HyZqPPpGwJXcaUT5rCO4FvmbYjongGtHtaKRyBs%2BSBA6gC16Gh%2FafNKXNjq85bIAIIvN3fiKNsGP%2BsuCNhlAVBOMDmkP6wvpJMKCXls8GOqUBRVNa3PYxsD0YGDvoWHYeQgWtEegvLKDhw7dRyE2Dmx0UYPO3T9snRQtt6NzPIrbfoH3zl7i6uXo99BDr505GuNZZXorZT2YMP6es%2BZwyOuRlREOgaHaAriko0ZNci62%2Fw4TWhnULfKLKR6mQpTiMdMFyoGQWwYr206sAhV7XEzXeEjj2CWZqBYB96r9qD2%2BR6aYDfdWtNKf5DtzY8XtdogcUPjuP&X-Amz-Signature=3858f1c68690bad547abd64eac6b65857b2b024aa81059a9aaec6226e0968002&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UZ4TM5YQ%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJIMEYCIQD6PdERorwhMSpULHTVpt3HVdX%2BLhBwuVCDsavAEvLoLAIhAL8j6aJZT1teQpPshGrlnGwn%2FVNhcTTBsBung9Li26zMKv8DCBMQABoMNjM3NDIzMTgzODA1Igzy0WDRWjI6RKOJOVoq3APTjR9YFlYP9ygEJslgfJkDmUxerISMv1URV9nSURr0oM4FoBCHWMMpMnFRpHbMiLg80bRPpkRjBAz7jcBwnjICNnncdZp178hewIZEFpFpsNlWt7qLOX1NM9oSGFQC%2BuPPuqeL5l291kbNq8vk5kkZjyaez6b7uRWBkPQ2i%2B5AgIysuAHSz792wXLPCnHDEpUm8VKyDgAMqVz5lU7WpVyHTKppE7bKtcSK8zAj0R9vftvwhTbOfxogDR7v7ThDL9g5%2BR2ETk8pxOqF1uPNgXLscXWtqQFcSgTsCYeAZOUMBPhmfZJm8gWRblKAX0A%2FoXJrxDQ%2FMn7lJQZ5jB3FnL9TDvPm4T%2FG0J%2B825GujmUHoNnUvxupo08q9zRH%2BxrOZV6%2BgGvG3Kv024laQT2DgGHQyGb7caZNS8wEKVufkT%2FEWMo1iSIqIwO5TRLd5sNqXJeNmH2bklYTyPcfj3YdGtRFTiy1NWzByqqw%2FUlke1EHhto4SvpWYWZw6jZScOT%2Ft8IODbinO3ARwIbTvzzHl30FYa7a1ix4xEE7D26SZ4uS8R93WQf8yRzeB4HaX4KOxN66cwIq%2FRpQOmqe5ymDG3cCydNr1u0BVvvukWSOmyGNEmAjvRTMZWLuaX9w7DCKmJbPBjqkAdxSJeCx3nzlUwW7ew8MvZjbeaHJocxgFiElgqFFkhet4l%2FS9N8lJxnzjppMkhoHSZKiR%2BUfNiRwdJMnNr%2ByJ2nIQBhQ8XJjOg9AKVTrpduSwCpa8w3ytuIXsyHPMe9UnULL%2FsNgAQWEAhZ8PwmAvOEz0d%2FRFcJcU1DnSgVUige6zsT7s8zm8mcn3wUm1olDtqGrDoOf1jDubUvwGxHSG5jpaQYd&X-Amz-Signature=acd8f18fb47b1ec0a6a311cfb1d5b1b108d6aee2f6c8ac84a874a9e6c47f9e5f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UZ4TM5YQ%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJIMEYCIQD6PdERorwhMSpULHTVpt3HVdX%2BLhBwuVCDsavAEvLoLAIhAL8j6aJZT1teQpPshGrlnGwn%2FVNhcTTBsBung9Li26zMKv8DCBMQABoMNjM3NDIzMTgzODA1Igzy0WDRWjI6RKOJOVoq3APTjR9YFlYP9ygEJslgfJkDmUxerISMv1URV9nSURr0oM4FoBCHWMMpMnFRpHbMiLg80bRPpkRjBAz7jcBwnjICNnncdZp178hewIZEFpFpsNlWt7qLOX1NM9oSGFQC%2BuPPuqeL5l291kbNq8vk5kkZjyaez6b7uRWBkPQ2i%2B5AgIysuAHSz792wXLPCnHDEpUm8VKyDgAMqVz5lU7WpVyHTKppE7bKtcSK8zAj0R9vftvwhTbOfxogDR7v7ThDL9g5%2BR2ETk8pxOqF1uPNgXLscXWtqQFcSgTsCYeAZOUMBPhmfZJm8gWRblKAX0A%2FoXJrxDQ%2FMn7lJQZ5jB3FnL9TDvPm4T%2FG0J%2B825GujmUHoNnUvxupo08q9zRH%2BxrOZV6%2BgGvG3Kv024laQT2DgGHQyGb7caZNS8wEKVufkT%2FEWMo1iSIqIwO5TRLd5sNqXJeNmH2bklYTyPcfj3YdGtRFTiy1NWzByqqw%2FUlke1EHhto4SvpWYWZw6jZScOT%2Ft8IODbinO3ARwIbTvzzHl30FYa7a1ix4xEE7D26SZ4uS8R93WQf8yRzeB4HaX4KOxN66cwIq%2FRpQOmqe5ymDG3cCydNr1u0BVvvukWSOmyGNEmAjvRTMZWLuaX9w7DCKmJbPBjqkAdxSJeCx3nzlUwW7ew8MvZjbeaHJocxgFiElgqFFkhet4l%2FS9N8lJxnzjppMkhoHSZKiR%2BUfNiRwdJMnNr%2ByJ2nIQBhQ8XJjOg9AKVTrpduSwCpa8w3ytuIXsyHPMe9UnULL%2FsNgAQWEAhZ8PwmAvOEz0d%2FRFcJcU1DnSgVUige6zsT7s8zm8mcn3wUm1olDtqGrDoOf1jDubUvwGxHSG5jpaQYd&X-Amz-Signature=8b741d7c38ade0a5750427b879e57bd56348da3eed8b077f4a684299c0e0fa57&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instruction tuning된 mlp를 제거하고 pretraining mlp로 교체함
    - 성능이 90% 이상 유지됨 → 큰 차이는 아님

    → visual instruction tuning의 본질은 mlp가 아니라 llm이 visual feature를 이해하게 만드는 것임 


### Related Work

- instruction tuning
    - nlp에서 시작 → vision-language로 확장
    - multiInstruct
        - 최초의 human-labeled 멀티모달 instruction 데이터
    - llava
    - 이후 확장 연구 - 3d, multi-image, video로 확장
    - 혼합 데이터 방식
- 성능 개선을 위한 여러 시도들
    - 데이터 생성 다양화
    - bias/robustness 개선
    - visual grounding 강화
    - ocr 관련 개선
    - scaling 연구
    - gpt-4”v” 활용
- 본 연구의 차별점: human-labeled task 확장에 집중 / task 다양성을 늘림

### Conclusion

- VISION-FLAN 구축
    - 187개 task, 166만개 데이터, 모두 academic 기반 + expert instruction
- two-stage 적용 시 여러 벤치마크에서 sota 달성함
- human-labeled data vs gpt 데이터의 역할을 분석함

### Limitations

- 모든 task가 영어
- 모든 task가 단일 이미지 기반
- gpt-4 기반 데이터하고만 비교하고, 더 최신 gpt-4v 데이터는 고려 안함
- 모델 구조 제한 - llava만 사용해 봄
