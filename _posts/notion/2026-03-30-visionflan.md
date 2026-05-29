---
title: "Vision-Flan: Scaling Human-Labeled Tasks in Visual Instruction Tuning"
date: 2026-03-30
categories: [paper-review, vision-language]
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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VM56CJR2%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044152Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCaECUYrF0qtgIOcyjzFfRPdeSi2bYTof8HgvL0bTwa4gIgImilzQYOsB9pVoCHBfsSJBmPt9AfLLFQvsd%2FkBn1dhUqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMb1jA1kracMVgf3vircA5ZfKRpNf6fw7nD16%2FnqNCVJtI2IH6nwDlHV2YFDa%2BRZIZJHr5ci5F4izoYIK6ul5tUvRAwDyq2N6Mt3Et9XfeedjSlwyvQfazAs4cuPaOrjOEfKANJclRq8u4V%2FbuS%2Bu92doRG2n72k%2BQp2HVlDSQWMrYUT6Y9ueLdxhs%2BfVCCbYML5RvK0mSFPPcAmm4GyT628uWKbiKQv%2F3nrICFla2o0ZwEMWkRoBr19o%2FDLHLiP%2FajBc9rlUM8gCfkmjZ0ABQKOlaDGtSezomE9RqofBdaomXGWBD5jM%2Bav6M1Ue9Gss4z%2FniY75cmjn4u4Rp8%2Bk7uccI1h7sQp3txjIhnIftEkONwbxfAM%2Bn5ZY2xx6XEbWUAc51k8KU7iVSo2EJOtG04y%2FGVcsnk70SS7a%2BwamLbnKv4Y%2B4sdla8FZc%2FUg8OlbwdGOJbR6NUxXPVCkk7YRDbvjazuDEYaUKvW%2BkQzs%2BeAlidkFtb8O1NGO4d3iwlsdW3m2yK9k5viouvWkIUX034KEFMehC1D9UPVcDpcw77vKlxuT9nR5W%2BNMXstgs%2FIZDlPew3n%2FfKxEtq9SWo1aj3ka8BvR8iTAuyADrXS5MgzNFLtvKyW%2FDxPI3fZopLayUpREHhfn3vT1PzXMJWV5NAGOqUBoZCYN3nMOUT9LK9julp0w%2B8W8yESxSwprRt4R1XOINtdLEz3N2mLJr73qs6NwRI%2FakxzalrfZKT1BqsGZojHfN44RGmsfN6AhGAnP6PhL%2BmEoegQMtNskwoCzvatEqTSTFBToHA%2BYAwE2wjX%2BRrFGGf3iqzr1ZlBtlPK7Uykd5I1EzFxA9%2BTKhPQV9xFizrZRbh5gdLIyI4%2FeOHIvBBXYNYxmxx6&X-Amz-Signature=c77cef2a5b43289b3c969600c552a0d2245c2e5ce26e8c9ce4abdf2d141d0c99&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W2PSPS2Y%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044153Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFVbVCTr4cH%2FzdN1YhysrTuOoNkQ43Firp%2BeWDvRfYGLAiEA%2B07vjdKX49QujQ1NZ3G7LD%2BiVh966c782bvMSw19zMgqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDP4pTuJVKBd5etgLJSrcA9WFMV9UNHMfpelMg7pl8SYW9SrU7EC3BnLOT4Wb9K7YKQZLmJOP5vg5GCzyobxp%2BsOudr93DKih2tBHxiyDOBh8hYMuF0DYNnqIpx8Vz2UFv2Fs6cbfYt04d5XqhDeMMjQ9Uf1N5W4C6TRsEcwBCoWs%2FCSPq95QVPi9JMNx2DVIGnendGNDCN0LkI3tQ9cXteWP6d03PdEWN0%2BeEX3pB1MHWw1rAyMJkE%2F76HwaG%2Bhac%2FVMwUGapNq%2Bm5vx6H3WWzRDSkZFrL%2BluhTK6W9%2B898bH7ubKEjz%2Fhoxe8vbcZIuKaL3xwasobMcdsrijgjFXJVNEwmUppEhOk5Qqx4GgsM8ZBXxFxgodA103M8O0hImwyT6sHk3ccUY%2F3dfe10b6viUS6To0xbh0X92Bgi0sxHdfDPL0%2Bs5vxsdpMiax8iYXwfNVCe5K4z%2B5vrmFBAfG%2F7vEZ3FPwQDWbIOmHB1Zzw0g%2FIscpWniBClzISo02TCkgFCmkH89NZW1YXbJQjjRAeyUY9kBD5rje%2BY0k%2F%2FSBBU6L2TImOgbiVzn3UFzAXdG%2F6LbKNjHgtDkOujU7Ww2sJ23k9%2BX%2BByNaz7veqXYXn8k%2FYaR0jpho3VfZ2U%2FOlqn2Ad5EdF6Jyx77ioMKiV5NAGOqUB71c7d1KxSDcGCsY5Q7xzA%2B4qDED6jnnN9rEWED0ggcpe54Cq50CONUTgZ6vIX6pugdgEHMXBwC%2B2FEewfDD%2F5fmM75WMkzZlmHGh5fsXR4ykFLFNvOrjysuB5uWj5XBLdeXAhTag89VAaVkgIu8F3E81EgT9OenkEBzUnY6ivVTHH8kJDlCsizvqwutcf4PeUasB4%2BUU9mzUx0WN1tuHVxVfN5N7&X-Amz-Signature=d4dd676d00027576032e5d49893ee74b3da1c999170c2ee33e2d632b1d0d49a6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZRL2Z2Q6%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCMCScLPVMfjuP%2FYEXlWoGnDK9%2BN4z8PyZ1V6hRRH2q5wIgBysnujqrRAuRdoLF6XhpqqFnRUJ%2FUZS8l7LkczJlBmEqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGe0JW%2BIHpekf3NCyyrcA7%2FJZgjRMCKnXG51KAGjNPm9FZ8%2FRu4gvA6b7ljGcc9uSlr1RwwnB0vgu3Qvt5KTBDpfiU4QbczsJ9PhLamhLTOBPW52B9SPl3AdiltUAAP1Iwy7khhtS7vAcLTjTZO%2Bk7rtEcDEiOdgz4eYPH8i8QqRUxx8mp954fbuXHmVa5ArM8%2FGzpUFtGpMgmz0O%2FCA2mPiFm6jF%2B2ORSXO5YHiWC8w%2BwofTPDLq2bIPb9s4LLkstxuepzHY6MbpdJHUg3GRvdHPsRAQ6dcVEPWCujy8Q2M8pIDKaiMQqVocLeKKXa81aRuyFMvz0jhhxBJqcODRWbj4jXGUNhcNTfgHipxE1sPtyeA%2FCOKY9OVbjjmob%2FmXHEOGKHNexUzzaUlAYig09P0taRpBlx4prYLkVond%2FWgqQxALMCjwv5iHYdACuTjG08kFuKu6RWH3FOXNiJAKGtH9TTWR%2Fq%2BfDoYbCXcAzIoAQKly03XAaHYghMQrOFNnTR9bsp7RHFNCa7%2BWlOpTpQah1z9cd1t61osY8tw3EMxgoPkDMGEVBKZ%2F1zqiHyz9IkR%2B0rp4ETg7z%2BthfgjK80PhMSZ4Lt5UcexAayYphzKOeihM4lF1cE4wSzmeNz7k6pWRGa49t0d9M%2B%2FMOCW5NAGOqUB8MZzrAOUqKz%2Bf9bf7sdKGWi7e08UUNl2NmFVIZohjHTi3ilaL0GbCIj8JkGW1fgK7tZgxfy7L%2FYdmHhwrW7dQ%2FlmkzheUBwHBMzdGllGj1UXrQ1N5AbqRFli9dZAvhqLwkSadvFFdyvehar771ITI3BDtbnqyoaHmUU8D1S%2F%2B7hPClGOCaOfyz0GfvG1aC2svcrfuDSw2VGLWT%2BtW4GvdAuqrFZC&X-Amz-Signature=f0c40e01a61456fbe1f60d96225978b9d1d23e37bb660b876bacb70f05c4d465&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZFW45BWD%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044159Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD5XAjDFRlgg9J18XdGpRreWH4yyEYb7n3sYN9rha08mAIhAKadwmTjRvEoI8sWE6h9BLLBl2jirqWjsCc7KLtwTcIyKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy%2BcWK5i%2F%2BMSO%2BaNysq3AML47Owj9BBBRXrFsTsraQZ6g0t6qmBj6kRLNI%2FZQk6DAhIZ1tqcDdw7kPdV1jh5THswWIfI0fAI2PVM%2B6R2FMv0HdaLE%2ByTgWQYnDSZUXKxHzGqZEJU2F0yGbl0a6bMWppYgW4x%2Bt8Z11falHqkPU%2BXyZQ9uDTbAhn4jJWvbmhTeC8ZJMTdFOFvXW56zTzgjIp4SpTsRAf%2BVd9c65EdcY5dPbJiVOVbqxwBB9rwgo0TZ1u7ZSGw18SJHVIFSSExyB1uBnG8rgLPG5GlmyvkzW%2BEXO8ZA%2BhKLvopuIIN4%2BNmiLWZNCKRi5g1mQ%2B5NLyqfwhmE33xm2iX8mblem%2F82FHP2jX4VJUOQnawfAL8B61TxcRs6%2FrPPqyaRCqAIpeLPlazfVwLFHQjmw%2BfU3ZAj1Tw4VQPvl2Njz14vzNa0JgL65uZd%2Fc4hwDJtmmL1Tbrv9B9WMatiPI2YHYEfY07oHumDJGay7IwGvveshwYxGEkqly3eRR6Y04eCeeEchbwqxDY1YpZc%2BXp8iZg%2FSAUB4ui%2F%2F%2BhfbY%2FDQxJkQQpDObXQjQXZAT3D45tcq%2FyQqQTnxGmDwieyGd7BFQpdnf2EhXV%2BbcWAWWEyHa4e78dE9ziex4v%2FX%2FKu24U4pOfDCdleTQBjqkAeVeDT3JQNgKA5ow1UGtNsNsEGlqMms2GhzFfn76gJQNR37QGFfwMYrydx3uARcoNDiJCg1H34CTdC7I0oiG3Fj%2B1MHSJR0dQfe9H%2Fg%2BgN1%2BWIKw9AVKUTWfOvruu7KL3pILUM49vEAzSWDdfZ5qpNdm6aoxAZ6n%2FZuwnxawtN3Vtx03NRzyL86e2tvML%2BGhwChEt1W%2FQ4D7KK98GO%2FsqoocTowo&X-Amz-Signature=5456b18768cb739783372afd3a5c62c47e0a1290ee792a4033655b57f1b323a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YG6CPPEY%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044200Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDlUZtaTKRAIOZ5pFg%2B%2BLq4nJt6lcQ%2F40jn%2Fdu%2B5Aq%2B9wIgO3Od2aGDkxur%2BCxhLGiNkmDsJZ%2BUOkuGRf5SRmxZbWkqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGjC56Qsu3DofIBf1SrcA4%2BAyD4tR3uMhGKd9%2BH0MAn8PH4PxVBcY%2Boh9QXPHPO1JTVdLwbQLf3Pr5rIeY1uCh2Vbd%2BMCE9TVvy%2FushaYzXyYqNd03TO2QVrwnZv5ViXAq2mB4BiI2f1vTSwwRk9rydqiBkmRRF6lbKrZBwh%2Bc%2Bm9TaUJZdDTQ0vuOpQoKGO%2FCdWl7DqUqrS8SBEpkWOJ7o5ACrp8ZPy9JrJp2D62asALJ%2B7A5yjeaSDmQstBtc514UWo88%2Fxk%2F7G%2BDZYNRQRP9nGK%2FdIlnmwPGDR9Urct7Y62td795EmrDCYDLKjqmXtqizKX4giMECiaI527fj1bY3BJSN%2BLSZuPITB0nvoJSKMG0Y4CkzWDJntE%2Bni9CkwtIj6W8UpIAmlDR5Hjfk%2BSETnPDvI00LAfvuvYHSzY7TLUPYu6LOTci%2BJA1Zd3frVIRp61XeelbhBxYMJZtZsuFZqYpZtsG6mum8RkUlepJq1LtahNPxBywqa9Z6JHZn%2F8auIoM3QzCH7pBK8DFuUQY1uaKTOLcNTO5pZPB8RbiDAgCcnpos1q%2BGdmlmDS0QS440y4eyf%2FKl%2Ftq01qj7tgAd690aKK6Ulq%2BOd1y2rbGpTfgLaB1SLIrVmrXzPReGeaRUxcf8fyn3uBsGMJCW5NAGOqUBSt4FGD%2BLAtLUyMorshs5hOGKEk84a6CnzF8n4S4NEmX6og%2FP%2FhPXbn3LUe3o9zhUdQm%2B6ghFM2RhnvnBklOgM6oVMzy3gPVY3t6%2FzucQR8KpfrospyC2txRmLMxS8PTYVwFlUu4KoQt2juw%2BBjBGYSC4e7vKnt3nGWN2p6MNvyFmSGgr8aH494E8FtNpM%2FX6iF6y%2BfBfX81lfaQ4ANDeBfdWN7iQ&X-Amz-Signature=5db9d96b2d0274294b7be03c4221f020ea59e3172fb2036184e3022b2533b298&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675NXQQFI%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044200Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHy9FabtiN6Fb%2Botn5%2B80920YKypg%2F1XLfhJPihhXeirAiEAkpFPeQbYEUteUv4ILfhkK2XHBLXJvVaACC5IG%2BsJlg0qiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEdEeitJKYMVpxilMyrcA4BkEVnnu8E4XdE5V11Ach73KTmgIQdnMJ0yNfoR26VR4L%2FLi5xmMdcZWM1TtLp4ouhQanHieK5mRu3VWI5lPMKSe%2F68KySpuOjia9iQ3Es%2FaKliiF8f%2BoAcjETi6mU%2FoODm3k5CZAe84PXPpvDVpC8XEfz%2BEFjiEFiX0qWxb1og33yPsHJWsDGazWyR6NQjQ57su6k5tQ8%2Fxpo%2FduaIws8w9%2FQeKCfMMtt6zvAFwV%2BqYmAfbdORzScOWkDuH47UGBv7Pt9tzwJuvWBrQEpMtVjHE4aF8SzKkW%2BlCOyOqOyLGZn9%2F42EafpHOodGcjNbvfYuiN7ce76Icl%2FiDE8cKlMv%2FCAnLGTfOPSowQQzkkYC%2BaA0yPE%2B2Q6oNQiCexw02h7zhPMHLXlMX%2BI3tKWegkvz9eZ%2BMjSYXzlsR4%2Bw%2FBHID%2BgSpMPZRZESW%2Fa38dRh5RL74rl%2FnL3nyw5YylvdqikxTm6%2B4V5%2Bf4SdgaaKfcSidoe4Xykh4%2FY7zBnR5lZiBytpySBm8Oim08OxtcdLFMVKDREUXEPPbjZMyl1SMrISfiSMTtSwyQw6M6I0U4bOBxfCGy1CmhR%2BsniMVjGH%2B5EQL3cFsQCMPOwt7ZZu9zFD1Le01Ao5D7PsnzolMIGW5NAGOqUBFpBSwLBRIa1PbgDD9e00uLDBffeH4msIv36EA%2FrFsKqzMfyGaGYwMzzBln7cQhymCWeL4FPHX6yEeC5ppMaxrQDAGc8RvBAo90%2BP63v1mj5CaLOoHAWofaDdLF1P5UAU327L%2B%2Fw8fF1sVkqfBaRicbyTvL09A6M2%2Bz%2FGkZHeM1fWSBzv0%2BLQEjEzCJ2wNMDyn1Z0AizPwbdkqYlBRBOXXYuVK4Cm&X-Amz-Signature=88c6627979fb660e9e6663d6c563f91a4d855e4ab415b60159974a18c1a06dd5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VH4HGET2%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044201Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBYsDQLOlRRHsl8A64brVv%2FHhsEqBn3jTl6V1nZqyV0mAiB0JNjNaUW9tJyMdCpshKyJstP1mb%2F3EvrCKicKIkw33CqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM%2FeqPF12sPMXCPCv6KtwDv4HfbDsNWUKztFvv8cyJc%2BI6uRZ%2FalKCKDVmeoDw2Sv98Slcp43K8lcVtxSYoGvLKW2jKzQfGV6yRYRZJ2J882EK0%2BvP1sOa%2BKt6mRXqRuujvSL3cyH2Ifz7Oz8zkIwD8%2Bc6%2BV%2FwIZEfGvsv6xwihiLKuo%2FlBnOl4NWnhrRbYU6VGpCUeYrn0v3XtGOzvJo5I4ARlj4M6Dg1DT98zRvHo74eok7EBZMW%2F0onPJWFCed7N52sQUjEjpmYIDciVVIPNOL0rw9F7DcquhiEgmWKSS%2FtAGEwKhrrxxA%2FiHJiTZDC5A4AkKYeLGTRJrnF5ltC%2BkV9%2BQHFwlu17vx6IeHQlHt7mbl0ttda9HHpBd6AX9w2xaElMDSQMdn3kzIi9%2FbpdU19AyIeXyO%2B5CUkRdrW7BQqhqZSDLtVBvYwdDc1dNqYom9zp2hcRMn9ef2yZ9%2BQ5j9bd1d%2BZZWxBVx9TvNJpAf86RBU8JU8Wnrk0%2FEzYK0ETs9VbfuOoQV6SXvXCezmtV45x5hrZ9%2FtQtZ8cG7yJN1RpFCvZmgXpuzxXtHsxBhusGfcIn4tvORq9WZE1gFib%2BszqPqeCuFNqbG0MiuMI%2BHeOCh6G%2FXjG2a4ye6J9z3TJsHSEakO9IE801MwmJfk0AY6pgHlMP2AvJHTp5CaRDJmmgfHZ%2BlbvRVWLg3pw3UVXLzKcILx963KOGUGUJiHnSSLa3NZB1EIFl1Og6LondUC7U%2FL1kBUgNGpAkT3o34ZYGnzCHcSoHhZZjZyTeEvQirr4J8lQxLbyr4n72Bh5k%2Br4ZN0iH1Rs%2FBMdZdQneYhGwwI8tIqsPT8uzz2So3Wq68sFnpFNP1JwTBtS9ynODnKJY%2FOZKkgTi6A&X-Amz-Signature=50badb33316c0a48e529a88730cd2876c9468321877d696a8c12b7b8d9173457&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664HEJ7F5D%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044201Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHFlzv29S9rDqGaDQl4U9LmQ4tE51tnQF%2BDOctmw%2BzHuAiA%2FbU%2FAbmQqmvKfL3W74vyx47NbZhTuRfbJt07VcIFLTCqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMcuioNTYVcwLnaKpFKtwD1lyOmc4DeCw1mmkbvGUq%2Fwzp0gnV%2ByGsBD6avbQGOnaGxe3Gs9uQbPIeZHjgfXNspwbDxvnjay0zrS%2Fny8Q2ECVjrYX3d8xRVNJqBCENYeY539gdkMFp%2BON3YXg1p8TzY2gsVITVRyrVZ55AUozatse6v1JdKylIiPjno9PxshWxJYQGpT7%2B%2FMxwesbsaJ3iwm3MXhp%2FJ2wA1%2Fwini3odk7%2F6OF%2BNZDhpnjYR0vVHGz3eM42owpoClhb%2F2OPLSVhEPM%2FuzYIVr1IXVTNTtZo6m6j4u8bsNa5QWx7Q0r43FsUeATCmGtVla1KutOF6aRGrHHwspidv6ju9ZCYRmzqzP3LawyriSodUCPSNsxgF3z9cTce1Bu00wVhTtDnI7dh0NlKNKHNdZRfFwdSnE8VMEKDWQh9cmtyxcUw%2B7xKcMNzTKj0%2FkOmcOgImx7kggH2GeBbyNAugHzPhNRJDT6tNGmRSh%2FEt%2B%2Fyc%2BeT6XrfSyLS7sZnqbSEBqH%2BKr9ra7ZJx7vukMXgOzIVN88%2FagJIF%2B0tF2E%2FkzbpnvuwM9lWTWoYekLYzbsu3SE2%2F2LwrapP%2FwTlFC9KFzN2KI63Cxvktbpsftg0CeE%2FRHnO67PVnO8zwjvXvJ7jnSsL1IAwupTk0AY6pgFha919GZyCtlTY%2BPzPtlvnUdd51aRQivE2R26AzXRYHWzAe7Z47CClec08pBxBN4UlmfDErmi7GrJTMOHFe9ezMYTUGcfB33n%2F3YSkoSEiT%2FbF2ppUnsHiE8QqnUY7IjvbjA0NT8gQe4PVNmIlHRXsXwLC8HrCckhzEj2UCxY5kQl7Oecjw7a7qrTVZB6QGZtZ%2B8yFRzUOh8fdnlr4JoK9dFRxVuUT&X-Amz-Signature=5ea9d44bee8af911db5b23f3520419f049e910413797aff92e084b04343ecbe5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q5RC2YSC%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044201Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFqW%2F799TlrEvP2ZO576TM8eU8BFZhIM2XHgBKVWlPFmAiEAz78%2BRPLjrOrKDDnxLdhylWjIRoc%2FuRgs8Vu42UYgW7sqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLyQPYN64D1dRvSo4ircAyXBYaQyYRLcLMA7atO6kDUXNBz1%2B%2FtYD61oT4do6hx9Ri0hJJ9mcMs6i%2B5%2BhhsuD3cc%2FMkLYWX8o8h%2B%2BNx2aMGRIA7rekWjh224im5H97P46KMJe1%2BqMybZqN8f%2F4N524KHOMJGYfMl6Mt8aL%2BVccGcnn%2BhaFsvVvCAwV6XK26nM9giDrXMMFxwtpz4oIvbldFmEnfIcH6L964vmQGpDz%2FWRq6tIpcZ6DdrXUtWGp%2F7xcfzGrozclBcKUS6P5qNgZCvR0fq2S%2BEnQw%2F53ENcxZAHrwbrLs%2BJE8JMch6exUezW7g7cLyDRA4PaE2KrSGD48qpOSmg%2BrrgzhhBT8l5XrZ7sm%2F4AKtP44Pe82LnBD7lLz6zUBW7xLXYZwdYa2uFNiRDNp5Bn6FEXV%2BKdQKv9yMjns7Z77DpaftFO0U8D%2F8CKjoJcizpBcuvMzDN7ifCw7bZ9bfdVRnuYKrCxuJaK%2FYr3nwtvXxfz0rUt1vRm%2FCcXoW2mjgPZj2mCAgv%2BJ32xlpMpdUx4wF4b%2ByYle5kLLIl%2FVifGnpCge0q81u6CuvsByt9FtfCBrSpGyVpuNlz63WD9nSyrLxGvtj1gO3DDg1B4y1Tp6GYMzM%2BYg35WVdRiTrM3sKJsgjc%2B%2FxMJqV5NAGOqUBAVuz9RAjfc55sqOO99uXH2ojbK8yDq%2FeCFZX0hx5Uc9CqBach6jQ77lYI7jZ%2Fb3YCAUSsh7Rw9AE2xsRm2FagoClmIhVeoWaiPLD3sZdNPu3HT1Dnd2lx%2Bdk9MeRO41f1%2B1EX55ra8KxpEGyu3crQW0rfeEDNWLm%2FRleM4EdDUa%2Fp5zXsOHgUFzdVXvPCL71uUChL7WSUPuZsUNr5hNAleomsPqD&X-Amz-Signature=f058a443490974641a8e10adfa18c4753cc7c56bffae0a003c58767779b18425&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TNVYHYV6%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044202Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCEeziHS8cog332abo4CYYRvPQGg6QrwB2h4WEGJXXaBgIgR1z4J3b7jLLOHfPrQ9kWuUDOHx16E0clMegud4MUzM8qiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGf5qCgWEqXW9qIddSrcAzyngBX6YEeBUHNqYNsjyx%2B%2FP6tUEH7UfO3Z%2BLck4inZ2ST8qCdCnh2Z4EhBLdkJVI85FW4MnjrZxE7K8kyCw6apJ7IHZnDHUlHJibhPtSsKKqLfLdpxQQ4cqq44l4sx2bqJpMYH%2BxpIEet2f0oo%2B2L2DUWiXt6HOpPKnBaYRyJ30GsejnMZ7u8k%2Bad%2BCjZ6rrShAAzTvzFTtB5Gqydqq9dGwl4sOzpRJGwoE7RW38ppm9v1hCGHwntwjRkqNqn0cP4Fxl7F9OM1nKYAN13UTmX9S3uR3eziCbmzSAp9j9xOKXFg2yMRR8vvA%2BnCtzXHx2LjYn2xiB0tzls5iqH1DbsDlJgK7RiM%2BmED3PI0oDe%2FAhANYk7X5%2BUEdDFhH1pda9Bo%2BvR8rT9hosfX8%2BQiDDUJTd0MN0LFjJ9h5kIxVMwNhNEacawul1a3I4%2FTrpMOngCHFYV7rkNXi0AY3eq%2F0oW5%2F8qRIW8G8MDT94%2BsC2vxGGe6glYcQGfNmmrUqLP%2F7sVYwsifnkr4bQRFzHFeraBaPXHdauOlSwL3X6pHll%2F8X3SEwpEppbr7fybhELkGCt9sYBZFMbzqqFqpQk5VpNKRqWRMC2ktXWN6TO%2BvZYnhp4eEz4KPSPAudbXfMIeV5NAGOqUBsZvHvmsqwp%2FID8ZTfBPRlIWgIy9xVIL%2F6XYtgO9uDaIGEC3NupXwbu3o7KLw%2Bh%2BkMMIv7JZTXwpfHMkHm%2F5SXxAZ0xiTBGxev2F9XP5r1a38IHVDGchrr11%2F5tt7wRCm3Y4ZWMq62klnkqvLfPL%2Bu0BkOvKxEiO9nYG3%2BnG9QRl78QFkkrg9NrfZUyVeM2H5n48aMlfMACe3KdaA0u6555EOZwCt&X-Amz-Signature=cbbb4e06a031b647fecc6615bb6ee7356525dde548792ccff1c5ed09a3d67010&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VRWVBJPQ%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044202Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDWLXkteQ4A6Yt0xFfPdzyB%2BKox4NVH%2FbcuLQia3%2FtH0wIgA5f%2B9idwKBRPLCGRvw1HltbZrEYYopq4zdt1ZSfyeW4qiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIGJhUEM4UVU1D9%2BNircA%2FyeoV5Ev24BzrpSxC7DsXV6Lq50qONxMFDr9I3IuM%2BIdO48UpGFc6x8eBUQuTT%2BH3Lfuqg0ExYRphLQ3%2BpmEjnbnsiLSWS9RyxbABj%2FNPcMg5VF9CSDsT9jOh6SvSeFjyM0kkkV6jzIK95fJeMoNO4JWWo272fFyrp3T8FRASB3fDMJGzbwxngBm9V6689%2BEAD4yI5d3gvAeJRn4dGb5NvXFPgUiPS1psKcvCw8klGKvi2X1RwfKKiAhGz%2FaU06PwIuCo1uYw5eZ00g9clwNKj7n55eSM9fxpWBVoSJfAA9KSIQKWoIHoN0R1J%2FbHZNTppUAsYsqrj62OtZ%2FOed%2BV0%2BX6pV%2FS9DycCtUOkPIhi8zpT9d8OYmAd%2Fisre1r7oJl%2B9cedzDnozezWA6t4OSLC1K7GLMa5OyTa7MfRiP57CzWAKNu6aI8gFxFUbw3Wt9eipc7qcA%2FNjtnKbBjr4ea52JPtv35vqB0AxhozFMfHnYsLcYDdBzFXS4cfSdjJLBApofyX14I9WlsUFnNHbbv5aQYYumpdN8A0wlM5HrlrDp%2BUZ2PSaAnLroLq58DBimuX5e7NdQhoC9mGPGpb1PhyNZt6qqzF1Bg9u3FoUK%2BtCLwrGR1RR2rS30FAwMKmW5NAGOqUBe8OquRWc1xqKlexdwwWc9cPaoNh8qGJCcxYli4zqGHOhpwqwFTgUnD4hIV6PZdI45VKMtjlt5jjWiets8RGA8N3GrTdKipz7kmU9dTvcB8GfgDu6UdWYz91an%2B4pLuxJ9Wdr5G0M7J7WfyZSKb5DaMv5oVCgOMIZyqBHnI75I3SdryzrcoKb%2BFUaujC85qUxybC9ky4g30wYBH8cUlvQhr%2FE8nsC&X-Amz-Signature=cd4cc9f7ff668bb7fc38f6a0aa969fb45f439476d82ca4097e2c3aa374186656&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VIBHEBQ7%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044203Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICh9JyaYqzI8%2FordqxYHDWIWPTSkoeCHjZFnCcbNIx%2BRAiBlaR3ZR3aDgkSdVV5RrMYzKpmZxOaNFr90pfxdQmzP7yqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM2OZWgw0oKPvBX858KtwDYoKLIuLOdtN010OQnOwyyScudtCl544%2B1aHm5nnqNO46WVbn%2FkOgtKivwXAujNmOR01wpJfO3%2FRNVjopeRo5CxEig2uKD3mawOMAr7C1ZQDiFO7CPzGfvVX44BSh8atXxr5dCBRT0NpSQMHXueUwHTXx%2BHK4kbieSYwxuRn0EV6W%2BlGPFLADAYgBlFNIPOb4n0GpIXi39QjhxJMIAHltTAOq6LUqIYE07fwFcIeWJ%2BnIuXCzZLsDrF9EmCvcFOZiyOrR%2Fxcwpbe7UWwhH5%2BKQxo7Ay9pQpF9Lbsm1%2B2W47I0q3PHVt5Hi%2B2HfsTzyD40gI0XeLA1vlAay6I%2BiKO0n4gOxFlU29FrmXXpgMPawqstLXqxemUYctFvn0j2twc5Kk%2FOAGmKZa0uBEolMtt8XAvimG6Oi7z450CF50UmjRYEy%2BA7Qhpe8SNu%2FZo9G487dEqQ4xqDaUw4r4%2BdYRUHAqhBqja%2BZg%2BFl6M%2BudZ2RjcaMtw%2FZgPFq4Vjyn7C0D51XgZsgwQpQl0dG8YXdlpWrpACAPls%2FCTxHSdFK3YaRwz6Dj3nUYCEsrezwvDK%2FHP6ofwt5%2BL%2Fdyf6C7o3hlfjG5d1TKp5aoqFOdzuGW5GSblIgiYL%2F7rOqsMpH%2FMwipXk0AY6pgG6GRK2ZerYDvSMQTUVkLCdrzF6RbFEBDA%2FxQiUHvXtD73f2bZhCsB13Sr4Vpu0kswvS54vlePc8yy%2FjE9fozoYGrhu41NJaoX7uKNsQEBtI8BiRdlYofYPC5pGec7JT3u6FMA3JAZhMZVIvAGRWKtDTdrS7LG%2Bu8lxnaKLmPuEaK3e0sskfvoYOfTq3TWTDVErv5VW8ARDK96GvIt2uYcnO4ASIqXy&X-Amz-Signature=a51eff3d83239e843eb16da37e0e8fdbeb6698f95c62805470b81756eec40fa9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SGHFUG5W%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDncqoxJ45Fb3g5FsxT1YPgRMUw8Ad905PLGPnvKIMfUAiBJqbB7Ud8fk%2FaYkWYlIhjduaBDaYZR4Pad0wv2EKTDOiqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMikkPy0hL1lBFCvtFKtwDyjtGOBZwvPRyPClImbVwbPcaRGUHEJL0AtKZM%2BdqGzjRYogBtwC2WsxcvcIPGEJgrvJPuS62UWLuCk4CquSEdVJIZBWxCjfDN2aajJ3%2Fc%2BBOreyEfUHobjgM8Z2bDTQyUFZWo%2BqNd5z9XHnAu%2BQuiXekh6Y8bIiBmXe%2F5HslhDOcwZtq60vyg8eUDiE0V4hlNJngnnosHMhgbJ9qEpUtXK108EqlU5es8SflF%2Bn7Y3kBFJayNtFeTqujtjaMiW6Fcz0jNtWIZjHmHGwwnyD2%2FQ4KmJJMRWWeGF4FHe90O1e65t3bu0sErmKp91U%2BQ77agceZTLSH%2BgCT5ScEBzKBosOh0Z4o%2F9Qio6LxkSXtc%2F5gzHcYVFDMM88fHHqLhz1MyE9sUz907X4YvagbM3KwOcR0CR3d59JlsZ9DJM4tOKKuWPROdnQDlRTKQZy51zcZvZcfq1wc%2B%2B5i4DkN38qo1ZVXlYm9%2FYV9Fc%2Ffr2Xxj3EME2RRo5HKEKOiQKx3yLXSuWE%2BJo71tYn9gSMzEctAhd19IfLDrwUPFJrr6TX7EmKlvQomqcbyESq8IFbz%2FMOAY9zLMEyKtZaVExJVwu5ROrm%2Bb0m52GL%2BVFR5m1GN3V0dB9Ccf4xkD8T0h5swgJbk0AY6pgHG0gW8kMcuT%2BFUgY%2FfYAlFfWLwSegm8h68jH3WHgZGQb01potlCuCVA9ao3%2FsVrPVyiGS5VbMl5jYzO9Dejwd8CnwpvN9imnrRZbHhzVv83H1o8mEGJVoAQOnaDnLJ0Pz5bobNDZFt4ZzRlay5fPuYSnzIjfOWXZRWuP4eEeTnZoWHeX5VgI6I%2BQ7%2F9f0m141Jza4I4mXpmPOt3doV6ABPLivEURfj&X-Amz-Signature=a7357a7c4a101ddbeb6c9cf508821a16d27b9ca471e337f13275afb4c0250341&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SGHFUG5W%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDncqoxJ45Fb3g5FsxT1YPgRMUw8Ad905PLGPnvKIMfUAiBJqbB7Ud8fk%2FaYkWYlIhjduaBDaYZR4Pad0wv2EKTDOiqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMikkPy0hL1lBFCvtFKtwDyjtGOBZwvPRyPClImbVwbPcaRGUHEJL0AtKZM%2BdqGzjRYogBtwC2WsxcvcIPGEJgrvJPuS62UWLuCk4CquSEdVJIZBWxCjfDN2aajJ3%2Fc%2BBOreyEfUHobjgM8Z2bDTQyUFZWo%2BqNd5z9XHnAu%2BQuiXekh6Y8bIiBmXe%2F5HslhDOcwZtq60vyg8eUDiE0V4hlNJngnnosHMhgbJ9qEpUtXK108EqlU5es8SflF%2Bn7Y3kBFJayNtFeTqujtjaMiW6Fcz0jNtWIZjHmHGwwnyD2%2FQ4KmJJMRWWeGF4FHe90O1e65t3bu0sErmKp91U%2BQ77agceZTLSH%2BgCT5ScEBzKBosOh0Z4o%2F9Qio6LxkSXtc%2F5gzHcYVFDMM88fHHqLhz1MyE9sUz907X4YvagbM3KwOcR0CR3d59JlsZ9DJM4tOKKuWPROdnQDlRTKQZy51zcZvZcfq1wc%2B%2B5i4DkN38qo1ZVXlYm9%2FYV9Fc%2Ffr2Xxj3EME2RRo5HKEKOiQKx3yLXSuWE%2BJo71tYn9gSMzEctAhd19IfLDrwUPFJrr6TX7EmKlvQomqcbyESq8IFbz%2FMOAY9zLMEyKtZaVExJVwu5ROrm%2Bb0m52GL%2BVFR5m1GN3V0dB9Ccf4xkD8T0h5swgJbk0AY6pgHG0gW8kMcuT%2BFUgY%2FfYAlFfWLwSegm8h68jH3WHgZGQb01potlCuCVA9ao3%2FsVrPVyiGS5VbMl5jYzO9Dejwd8CnwpvN9imnrRZbHhzVv83H1o8mEGJVoAQOnaDnLJ0Pz5bobNDZFt4ZzRlay5fPuYSnzIjfOWXZRWuP4eEeTnZoWHeX5VgI6I%2BQ7%2F9f0m141Jza4I4mXpmPOt3doV6ABPLivEURfj&X-Amz-Signature=1077815e714b9c2e66cd3609f513224339b1ee419d0948d763d2b7838dca03f9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
