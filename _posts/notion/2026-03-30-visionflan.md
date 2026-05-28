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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RI5DRG6D%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043820Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDSqvXuv7RJndWYstOxneyzfLPIWBJLvq6K5P05xUqMnAIgVdY9UwZ62rB6NH6YNJxt5MPqSaCAtfXNZ9EkM1Ix4JUqiAQIpv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDObYF0QTs%2F0weCq9YyrcA6YvFBKxoDfpFMW8lYJXWdQK%2FbDKx%2FI0XutIpSsTn7DzePIgD3HUukmFpMtcEKkysRwqDRow5bXveXwtUbMO8jU1K5UidFcyYcIeBiVJ14lI0MHIjDTt5oT6pLP2%2BJD7ni1gCI4OdzcXE%2BTYyppxbYG2dPR%2FDwOiIJXKxL3KA5po6Dl9F%2BcOlCvpBqktkCmNjDLyCNWF8HuQnQjJUlbrUtPPITU7r8ale%2FBT8C%2FSXPUuKUFcGXGH2Vd2NcgymASrz3AcmMDrWfu2yqqrNRXKvf9HPuR%2B2vP4%2F2olspnJguLvXNbsiDlTA%2FZ2CylnPRz721YmygbsKkRaP8OnR4sF4lwA%2FEBBz%2BU21dMPplAfR8C95XgJhMhUntrhY8nS0DdUVDZiCNayecFvha6s0qIZhF9KTu%2F7uT1vDBU6SycoKL1F02n6dteXkq29LJ6BjM5f6WvBCMwb0nCXjxueoFHew3B2Uuu7ys9nfQ6erwS8%2FOe1OlYIKOBR0YPcHxSqjsVYaY4ccIcnnwgcPtlrskc2pKW2Z4km%2BerCHnQ3f5tOkKTJfva349KoCFb5mDa95SjVNd0qG8AfkohLdhN7YnVdU8eSHMoaBZmTwYacQFRB1n0sAIokBjB96I18smFIMPaL39AGOqUBEPKCjodyX43ubGQuru0C0aMkUmP22vU5vIJhgzVBaN95YrXPLly2NNyg13qMRWXSIJotfb7YYcpsrNhkykeNJMg8NyPRxalXOIlj58CmnrwUcT8Ec7YNz40nkwBb3lNWyfHscQQkQm%2FbRtpBc5Ao4R1RpgY3czTbPmutCgQ1ze3GaHkY6s%2FzUCw16eWZoSauLRIRQOYpoky6yxqGxncwhBl7f2mS&X-Amz-Signature=691be222559bb482afd45882e535a501ff5dc292a059aa4da4691b15f0a3988e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663UGAALUS%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043821Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD%2B26srTqawjDRM%2Fm3uvTJC19dpdm06d7YjW7jY9LqROAIhAL8Cu4o604Gpqq6bjt%2Be3Mgue0GZi%2FY0A%2FQeQwST8%2BozKogECKT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz1NHaHeoBQL5jya6Qq3AOvAnIFaJuegvlzNaCqA6GACp7ILnzds%2BFTd3%2FE7pxbM1JG4imIFZHRCwab6D%2BdDdWSRXCbZrFcbpjCPkmoTnGyl5BghFfBlD8YPGHZf%2FRScXILOHS90goumi50ClnGLH0094sVSTt4ImdeaioFVpTpg8OIWdQJ13BEUGCR9%2BhqyqQNu2Q96c3wGRDjsZd7RidDDOvvnjsqu3z3SraLmWC0b%2Bqe1GmYDCPObOFRvN3%2FdmoeKyyMxKZcYXWyXO6uP5oUrMRfD5Mz8y1wb5Ke1xpiF5xSYzWPwpQYCMCwlIOiPqCeIuZ5M6mp6zAoCbJOxgjuDU8k2x1WdUS9qnLy8gTLeQM3rE%2BKbLE2R%2BADH6cSkGXXmuLQ2Sa6P2amrxEq4dG6kwlmAjTqJfuLwybuSMicMGBOh%2FUf%2BUsoXrufHITyjnuB%2FNqcYIAnbmi9qxOC9tXK8d2yIRXyYaln5MP2PotLVsSgQBth6oWMrFuQO%2BUwIY1WyWhaqWvsN0eekq%2FvO5Z3JFMOw4C%2FqdiUPXcJWIsqt8SbCmvt%2BgHRKXYqbrJb%2B4oc81WiwjmRzl06VreaWonsoFDO%2FAHtQPtDKQMbJJbPR5jha5rR84o9lhN9M3JWWpuTG6J%2Fq68K2HzToTCW5N7QBjqkAVwTr4%2FjWugT%2FWBom5d4DzQX%2BeyPbd7dR5joSlnijjBkt6kiONhZeizVUzN%2B91OpoLXZpL46XNlcSEXihZw%2BdiPXnLPFnvVLJbibOHSa4iE%2BU4ql6uIKC%2Fj2WSV3tJs%2FM26YdDRc38bZKqm2e82Wk1GsEzFMydrg%2BXoQVFjRcoqdP7ab86u%2BQ03yh1lSVgyPp0GqAxIuJuZDVg7JRPvIQ81%2F6Tom&X-Amz-Signature=fbfb1ab257eec5d377cdc9cf106f711f31b320076e1ee34a952529218e67ca78&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YNOC6EOZ%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043816Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG%2BO3qpeDrW7P0mNgyzK1VWPDHX6EYV7P%2BtkyJSZpg1cAiB1QT6K7or3DdhSxb9ahbqZctrq%2BDEXs8I0E5RFIOsIkiqIBAik%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMjjxexZx%2Fuap6guI6KtwDn7I71aU3B54exYrn8XlVNURRuHhROxK1%2BHCvgWEoOpAU8r2gZLTFg3uFkCFpnrnBAzABxVrVX5S9ZC9fC%2F3RuwWehiFAyz6hMPAWC4hKedKtCY5SpGaF036YYQBvpf3f1mnhKpGgcwiILNWFHT%2FGTFHbZ6DObevG96%2BXtKu1La9BDaYxgJRrVgPTE4YSSGG6q6e2Y8N3GkTXZ%2B6Tb%2BJ3jLXRx8AP8Hw%2Fa23POc1Lf03KSfW%2BNRcB%2FNDgcGLGjaN4ibRcHgxwbOdpHhTMnkx6i8GOlzPrimsPzrh5jscQAdGLpaP5sCnucDTQZmxp2UaQceASQvVZiXC608ETqmC8yf45m8zkOjYCvktcxyeQ9uSLNFc6ZTmBuVu0nAgTwkJofFqBlDJ0I%2FaSjl%2FD3BLgOQmGcaPT5d%2F6nIihFHCLaK8FfJpP%2BwX%2FO90gvJ5HOTWZb8mvKo7Y7uSMfr92521rJozJz26dML%2BDhD6%2BFHR8%2Bo6bfa4nWq%2FEpBxP8mOpb1zFUy9p0N1pBHklSrAr%2FLb2zoQajTiiAKbnOFW2xPFdR9UgwNXsHUlFYg1IgT7uJBgtUkdhbR7zOczFfjbTeejE6OE2kuX3KPSM%2BK1VeJZL3ZMllxEZ8zZgdLW9Jd8w2uXe0AY6pgG687SfHl0iCxveCdfDpG%2FjqaRSqyPDeFogrnYG8tuxB4%2FDFMCIsKo2MZncCIfxCBGzmlCh1DKXC5wdxu2PWW7zpOSLBAf%2FWEpRElDE8mcRgiHuMQSImuCstZgO18FzyPFkoSt624eAFXT2DcwjXncBC%2BfvDL1cTVm9l2coQyoAqavgNTUTgujKAM0tzVwdcjLeNL1QDSQwdpKPO%2Bsorp11nXKINwZw&X-Amz-Signature=339fe01d0640342e01084ca9c0a268e1625d91d13baf755b75154406b81918e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466US742A26%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043828Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHRBRgzC3wFTFcesqfhDgQjzHob8tXYn93G0Gxo%2Bop6PAiEAvKKKfZvVgo0QAMgmUnhOy%2FuVyCKemGEGNOnkjgeZFewqiAQIpv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLtQXRyM3ie23pxnwyrcA6%2BouT2CWv1OFpORTfaDwBvzLERztSFYad60b1rBHWnIKHgMjTFv03QeiNvq4H6agLooKG%2Fwxz7KBQWwNGpjb1I6AASFqCD99WKd3V86GuJ6aUoU%2B1cT7MKuImNldY8%2FrHUKX29JBINkCw4ibGVlcytfX4OoKKwescLB5M1HPq2YfUOsrW9ST5c2yj3vH5yziJVCmq5%2BJ3UzwC1Ao92lg6eIfNx2fU3HJYCLbUnIwFIomhMSAVkAc365qKEZrejRw1d%2BUwlh2XlzNfqKhHfXZJl%2B%2Fwvq9f81FEwlu9LQr42hJZSOZeJhBafCL%2BiItMzUJxY90Kg3h87fMV8W6CnbHA0CwBIp%2F9KIqp0Tf09s5esztdxnjzNWnBO1spOeiN27XnpOWeqsNHP53JSbUqplkOWKQBsY9MR2hnp3nmDFEGSaQy0%2BSLPa7oIbIo%2FM3fO5qA62Rdn8deXx6jnUkttnfDdUVQyC8XC5uoGOC9U5XDlYumKNAhvRFbdFY%2Bl4itKQYPyJ7Io2TW3KlPkafW5iPylZ1pAKaoMu5tWWOxswMkKNgeCxpUfAG8NMLflDAxHnSRNuhV2zlIbRr%2Fs0anOUhdMeoN%2FJuhG6YgsTTLCytA3dtmetlgcZLKGvFwZlMOCL39AGOqUBc%2Bt0JhSebXHLQlGgAM2s4esMVgWOMtHRx5psrUhVCMoLZWfP5cBqfwYjvPH%2FF8tD%2FVJTVO7QXG8mo%2FF3aaHYXvjTQmV5Mi2p%2FsA0%2BQp%2FRc38BVUfd145T3%2B8LWjUs7Ex1CyGcRMr4sub%2Bf27RsTz7LMWT86rDLyp0fuGNuCcfIiuC2TG3hnWEoFzPd2sOxPEGR564%2F3csL30YvtEhEZDtLp2h62I&X-Amz-Signature=cd233eaebbbcf137b4402d6df1157166b1f7276d71d277df1ee66f440fcd726e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGPZIOIS%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043830Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDbtBU%2BT74Vfyc2x7v%2FvXsmkPnB1o4i59b0fbckw%2B0h7QIhALXMy5wDYsZQZllornHMBsApMFQo6h8Y5mVNvrle4h1GKogECKT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igzu2txPpgDZzANMo4cq3ANcQ0KEErHE9PjbIIk4neqAqAnYr0rI16GJSKFqQ99YLVzCarvgTAXT1z54TGAinTqgt5R4A2rDA3jfXfVOsoEDLv7pB4zg%2Fm%2FZ6BbDQWyGWkizj9pZmD3MO6KUXRHbydpa%2FdRSkLa7xCjGzvhOiK7JSD928Ew9sw4Eq%2B90xZTlblLCp8YJbg5flZEq7CzA3EQIXUIPiMELCC2xi3jCKBGGd2NqbwWiOhUxVajArySd5ZUMetT7%2Fj6%2B1Gcp%2FQXPdiTeeffqno%2FIl8cgTQFjbeAnTgRoUGkwZJRv7JZA2BmIRNjmYQSsMXUnLPwhC9xbrnZj0aKEmxQPFaq2Yi0vqqAKtbM3JI9LaOad4aBczpBhkX5NxVEitVkK6JFhSlSxIRSntFaBf%2FxlvekgZsMM6KxKWAKnXgr1YwOIwT%2Fyp%2FQ8%2Bya%2FefPIP%2BOCzwoRbu%2BnT%2FDMDKT5ZJKMqFlR0pNvcGimfAhQNlig5R6v%2FFiTBV7EefK78Azn1%2FgDlHR91YsZSBT%2FuTwW8TlBApw5Uf9z35o0q%2Bp1U44JlcpxwV7KJDnEH1CHytDtpTAOw%2BQywkehokoxgNggLs97iMGGb8xuHXo37qQdBsyGdBbq8sa3iKCYTvR0hMAD5xLxzTUmTzCo5d7QBjqkAecVXabrGdxYsEs5jvu8t9Uhoba%2Bz%2F8n8Vtb%2FMNhS%2BlPpe1hHnc7AFL4wurYrM95tWDtAKqXRyoApuNyTqJm80PcQQAxgnPq1xLbSheElExMu78%2FUzNfspEiiT0SjZbIMfwtZkEhnEna%2BBHL7cWRgazyGhQYnqGXCY4YnO82%2Bjde2%2Fcr7av0TIrvnSattndfWopJHCtuyWk6ugpjIyvAWGOOt5kb&X-Amz-Signature=64b0d7d4067dfc2c8cd9f2e27d89222a4e5d79f94284d4b3525f0df6be5f0dce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TIVDBTUH%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043830Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDibb5fXKpsg5ATKjYvh3tPx%2Br2%2BNBVYceCzeJ6f%2FUEKQIhAMfTOfuaBROTFtNnRK1M0ZuV%2FbR9m1A5wRchozacZfj6KogECKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igw0F5%2FB%2BHPcLcxcb28q3AMlLGX255CxKMO12c41Mub48C%2BYputSQr0e4drmHWHJ8iEvh2KQJSbmge1TbhpfLbh8RL4ThErSKi0arA%2FEywu4DcTkaeUX6gcoM615MGmHDA0J5CGV5%2F7z4Ew7%2BBJueTsHwqL6W8F%2Fd%2Ftie%2BD6g0elfaJhY0QAhsOdUodFkcrhSgJHBlAnAl3iFl5SGKluovrMFEszOXx6ISl%2BIjBoACOtw85kyOz1szxA6kplJZZqMx3XFTGgjyunD8GIQbwGg7AfX3TGwKDO%2F0Rhg%2BWq8j5N9VmrQp4i1s89eu5eyupinlJWVvxi%2BUmmaJSgbdov2enUFqmVJM7o5lct4ZWpvWyzNVSgt8Kd6eTzoa8YErJCMsgUGusQrfNtdpI20oCqlSROfIuqOqIWniLHafqNDyz6k2ZZDqO2fvblAnkqZnIJ%2F0oQA1GRepoBskCmzUyWL9ydytooORkVb1UNwt%2Fqpi099e3lFSxO5dhXTGYmD4P5T92Ik%2BMzNbPtKqMtyEKe%2Fb2VJ5qoqeYz2WdD4YRwulL%2FM5YbghXajRDmheJ4eF3GWD%2BebaWRKyeVczXvyutXvX%2ByZgIiCYIWZsfnfuDPjY%2FmE7N4nd90fetiFQ%2Fpxs3%2F%2BG0oNOQxSj7fJsdDAjDtjN%2FQBjqkARAbcFaxUx4KtD0nDE5k6RvlmmWhp7r4AYO6ZEEw7hb8KVOImVDjp2BcUhV2s%2Bdyk7LFAg8JXMvbubDSl0HQLWYbTOiUUntV1fpslxgjTvr5HGItv0mCFCbKRlrFtYSHKpfaif5h6vY1Wqa6eHV3h3I6cH8ypVm3Kh1HAYcoUWlp10g3o%2F0ahgOKMCAQav4kBcOVqD58gvYMXWOszhjyc%2F3707iW&X-Amz-Signature=255e3cafe8449b156c8d2e7ebacf9c5d80ad117541ce499248dc0eb7f829788b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665GWKEM3S%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043830Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDLJPWcP%2Fnkc4NWyeJfvSk8z5LZy4qQR20cYUgLpLtthAIhAJxkdvosbCVQ5Z%2B5lIblE6y7IsQnt1XHT%2FyqAp3GR%2FzPKogECKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy5p7lqoNPosuFHF7Iq3AOxSYLzqcJkOUKuo4fIUZkjYh8AJqWJ%2FyZm%2FdExjqH%2FOA9WHjtpAWuIXKwg5MaaF82rV7%2FhoBdh2ZJE38C2E435gjVdOtXZ3FRSb%2BeUPLkeuaFr3BqF2xB914kMQj%2FSbQTBGsHBRQQT2RXPj8DtutAz6rTcM33cY0Nr3jPBHoNpNZOEFZ1ASRmF6dbbnDBpndOA5xLd3pp8hn6tdVDC3A2rWSGsNTTm6rK3HpHqCuYT%2FQGXldKCZNY1K0uX357RlHLkSuM44r9wq3UObUtts8LUWF1NcoMMeOzP6Lo2Q6iMklt6pHa5Mg%2BNCr%2B81HTU%2FfKXTdNt55gtPJBthNf3Y77L%2FhcdeBuHnGyMRximkSR%2FJ7Ha3TDBkkXffTHH%2B4T%2FRfu8TjOUrki7q6XnSFE%2BMMirORC2bMRxT%2Bto8jlE5B5%2FyUtn%2Bpq00kKMWBa76%2FtanaA0YjrNbUJX%2FZstdOP8G0SaTGpOCUZnwAeMgyQbC7rCBYhqEcfBs5TFftuhutAzzGIzQAJXDPSDWmi4aGYiJDqLBVceplkM1bj7qzsih%2Bi%2Bv4ZeOXRpHuZM5k%2BPDS3YoDWKKCUK%2FjvXUehTpx4sMQXFcCWnnkqTTI7VQ7TlFtz3F6lmkKKiQFiPkY145DCajN%2FQBjqkAY1gNYyLV%2FbtzPPuV2lM962wZ3Tbs7bXkL5PICdtUK9cU0J2d3CdkLCNa5CKsYRfVPTXo4sQhEU2JVEgT07v0P2t%2Bi47FTcKUnk32EySKxG2JWBuMiEtX5YQWSpsDeVTEgYD6Il%2FRdlQfoYmXjALS%2B7NbDkws42KPkw%2F1tV2V286pHMVyuWZ31JnYgJw%2BsaumbnAgKA9NwMkPvypg1GgH5tvAEg7&X-Amz-Signature=295abf2fd4d096fa6a8a4bfd3c8a5c28212293f95b35d9a27022a1512b10bbb1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XO2FBFFO%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043831Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCevgeyasR8rki1%2FwHgDv0XfyGPoT3Clz%2BzTqvBSn61dgIgSQg0MY%2Bw%2BK1UccMFBiCUW%2FQ%2FPajk83XjDGlmdml%2BR0EqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMfMWi45DgQTvxzIBSrcA1XO1PuI0usho1qvHG9fV0fX21578wxW%2FOJy1U9vpb4sWn9JsZuWMlrwI2sTRUsW5nHEzUHQHIAok4fwxTxXzx9%2BZWsZ1Q6nnj0SrdXe%2Ffb7zUOgi5pEH3D6uH%2FZKlYKBcYe7gJML7mMS9qc%2FXHr0990OuD6gsfh75F8hDKPfqnj0ZDKZdqnG9kFaFzZ7lshmYaTKaRtlANM4egT94IiFzBz%2FcdTBo7PHJYuEQwh9Oqrtj7lgUjY2tDZ%2F8RUugnAEhA7awsi1g39Hrk2g9yHoy1tKJHDl5lBjWTd8XgPapA5XJUj9Cs02Z3ITZOra%2B5lw33vq4cEtqZpm1R%2FrpF52WzogRvoYdvtYky4U%2FoZNg7n2uQAbQT%2BN0bFy9ijAuQC%2FXCrm3zMZaRYVDoDXTMnApMS0ryu3p7H%2BneDrTRfXVLDCsuB0EcoFf22Z57CdqDU%2FVVyjWRSw8LThQB4fFZOOU%2FWstVtlPU%2FUxThfNXqE6hIxkMZqtYjCSBLK8KxbMvyYzyl79NYNMHbhuq2AcISOnc1pjV6JLxZgP6OiW3dEhBakCKTmSDIyLp9nzxffqhcCfrXLqqL9VIL8h5TO7FLCnkmc6tJlynJZ1mwFkOhSnJxgeseWGoVPzxbs%2BCZMPbl3tAGOqUBtebyilLGqkoD4sgmmvTVpR%2FhMQa0p4XfaFeFEMMPhHg%2BVtt2g5CoznoVgUgCMf%2BmNdB%2B6TV0A4elO%2Fk6OwLp7Abpd2M14D%2F6o2GrtB4pyjGrv774fQQA7upMFFaw3QKk0wC6s2KaTH4WoXwZGbVPqxmYD0tNR0%2B6bU5pmZgfLey5%2BXD0kvfk0Sr7vPyD%2B7zC%2FRXxusCcZKJRIjUd8pFkViMBVQnq&X-Amz-Signature=b727283752140cafe3e719f5e19735aa25cff5424eb50f4a07d775dc3711c61e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664GSKOI4R%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043831Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFmhNbj2tGE2vFO2A7fK%2FBMV6XdsNx3FxARG8GN%2FMqc6AiEAyAtQzAj1xPnWWKG5KpXwNgwI52Pj7dXQWw5fWu7kzB0qiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGE1Cfm4GQvpOcekhSrcA92VyllKIUTgP1ex6nxr6kMDhL3zrXEVicxu4zhm2wSrA8dAv7IXTTZ2aKd4q%2B%2BAjTN9kdvjaaeeHxqv8x6Hat9paol%2Fxy%2B0qv4zBB3z2TD7qK%2BA5TTRkGJIF4qmq1%2BTOu34OguBb2xqQCq7F%2B%2FZh7Up2jTqUeWWSASryDq1zBY3ieoyJhaXu5PRbjsRgumzUKDPxZwlJzNsiswsvay6iM%2FW%2FMTsPLquBYRlULyL6pfHQ6BnhLm84BNHPW2Fa9fCr7tv6TAx6oa3cHhLXHTI3vwiXuMhFCwAPc1V6aQm4m5xIhDHi9G3DI%2FTgexn%2Bb2Eb2WOrBoTeN7GTupdvAzTbGN97gP%2BC6ro%2BY6RE72s9aVPFpXMlSIscaa2o1A1Nwd56wyOu%2FoodaGqUFl7a2G3P4SGlu7pPxSXw64c%2FIALv7%2F3WPKqeyjWsytsfmxFWRX4oVBPU%2FeEnRDEkLga%2Bfs%2F51vzlyE%2F1FJ3I9GdbtUiVnGDNNqGIZfxnL0%2BnoJFa%2Fc%2BZXrHcOywKwnLeGqDWrW1QfvXekD3trz0v02Rf6dmlhL9PW74C%2B4qkElk8qSbPBqh1AoS%2BVFdXQ%2F6UP95JGlVOQNH%2FPniurCdEHNLAHUWHzVZiaVhIbC9Sf%2BkH7W6ML7k3tAGOqUBw2b4kRI2qdQUz2QaDZS0q0rQVj7klbGzv7QZ9N7z1PhiuPU9ZDfcCuOi6179QzHE1aYPa1fCGlB5P%2Fy83yXUBzpmYkcDDaP8xZTguprt8kdD%2FBnyYjwJhVg0DpX6qsRTxNGoKlrEEZRGNvu%2B3jUHsvQIYSBTuI2LOCTDruu2Czp2xfQCoNFquJZkqEKgOc4LADHeIkhdk6YHQqIbUGPA%2Byy34N8%2B&X-Amz-Signature=168a392461d63cb76ef9646e222fe652b7df876042334eb8c1d859636083748d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q3PKUOSU%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043832Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBM0293ijbLTAi0gAQZVIVgtnBf2Jbq0pD%2BFiwrDFFWNAiEApDq%2FdrkO%2BMAGaMgOcTZ9upt7k9HaTBOzbbC492Wtbl4qiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMA7R%2FtsKONYWDMSTCrcA9ZxrAzr9wbEq3c1CB5HQ%2Fv9jcGhro%2BLkI5u9p2Axv8W3C1JoO3LwvJyW1%2BTl7GAw78wASF2pex%2BzpINd9y6mBRShs%2BF1vxpRWEeagcuusMDCxsYrQImQkxxcXh2KpJ%2BeiwxuT6%2B0Mk4zDyTQXx1XYaLI5Rh3VXJMzpN3liw2LEZ6LCXP7gVcYAtBpNTLuMpVnsOBCYxmVx17sVigD6H%2FqfX4BPGMCNuU5DJGeKOLQdLeFR5Ij40OqTvCiDkVBHdXMsPyBxSgYmW%2Brpbcxj8v5%2F9gGQd7TQN4CZIub92IXz%2BF1sXEsaqYIrnFLkIY4z1sZLNxs1IWY9HYGdho%2BpAZZEKBOOPr4XVr2VdXHVC9Y8P7OOMTxXXTMuhMbmMjeJVfIiTNeN2GyeOEVMHVAWdOeEy45nyy95ACM2O9OmLt8MBLED1%2FKi5OCgQGInnCG2x674e9WEtFTYzKaoplTdL1cAAB56yBcg5k30qpSvI3VxwTrRcq%2Bk2ggnAQNCDH030G1IgGd6So64ecnIvJXCkVf42e7iPAyW7ZuPtjdYXGbVRpDuPRjXsgYhUoiJU8biJK86jW0v%2BuOaGrimtMutkDuYA3ie36DQldpeus5Nbq8f03DTZXnzWb54W5oIrMLfl3tAGOqUBF6ru5h68m7f3WRJQq1oL%2BJgGlgr1CjyvwFoLrcNlOiD%2BDNzmA1itSx%2FC9fq0AnUGOWiTNFHOzOznNxlAcVEiXd5Hh2W5IT81gsxIjLzWbzQlsTR%2BTy81N18q6Wg9zo02RiZOUzM4%2B%2BCGmD7DsLbV9dx%2Bz44%2BhRXLmK2LTjviffaLWialY70uqwgsNmo6NgrcDUB2%2BrICaj2oSnTfHoimyz4SIlHs&X-Amz-Signature=fa6a9ebc339bd0c578b474af2fc1430edb08f3f413ab1b0642689395f978b174&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TNYITWQH%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043832Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGMCpvxXTwXJ1ZyNPUGxlIitpXVwosyo9C6WRFlfhirjAiAkJLop4IrFZwOSNFnaqGa7Qm8vgX7R8FRxnKsvsj5H8yqIBAim%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMGc9P3gRRv6I%2FEIVlKtwDwBEP84XSoXRJI9fM6x2i2Tsp%2FTdo3mmRTM6o1ksaovKMG9KPleKrc0Wk%2B0X13JuT7PlRGEuDCU%2Bw8iJyKbwPZA1McDHsk9H78vBtiQYZjwLTK7zPxLaGzLpnncXZU9FrUO5QClMZKQR63jVx0aycPnDO%2FDrTlhmUhhsUJNvUz40Ijf0MT8rMgQKd8VBzf%2B5MCVk5fDHe77GlJK3rCnq1ue31Jkd%2Fi5AVkmOrwpuPMpGQeXfnT3HsxCG%2FmvYVvJHe3FhJgnkSpLhCCZPq3lfA9gDPLMPbODop69CCFueM0XNyEUPxLfN4a76EaJbsbHgAEPLcrlUXgPHW3Jvs9fj1xYlms5HgDDWkeMgZ3xnfCOnb7TN4JNriwY2cSdEga%2FXzoDJiFD18K2L%2FRTRhW3nXV4XYdwdL%2Bed9dGYw6G2sOBusn5Z%2FAzwq3lqNztXKhvy4GQkV47twU%2BRV%2BakfxfOBinnltE1stBvlrfNRNQs07FmdLSYloIo8gsKm81L%2FKODNYnzlyPARw6VTuczDqWtVCQDHS%2BF5a9o%2FBFr3rplmlHXAqoSz6rQoDsrGDoJgJ4NU5yF2gTEjtp%2Be7IwE03x%2BqxJ8yjFbRRlXePPkLbTutQ6cjrlP%2B7ACcvULVOEw%2FYvf0AY6pgE9pKtwCLlhTnhqymB807E8PfgBz0iqzbnzeot1uwBxoTUotkW%2BpJHuhVExhucIOc6PPuAzDt8n4D7MjIDcccqjZ4t6Lfu%2FbP4%2Bb4T93UbwUD8LThl%2BnIxzkbLMgkbcQD6dtKU45Vg32qoyRSOVKW3kCmqZjmw3R2mdApl8YPAsZHlqKChQihJn9RSuHzH9hK1RMeEbQ1KF%2B%2BBp%2BhvmhDaL2tNQ8Z%2Fi&X-Amz-Signature=8a9638ec2d44ed70bf3594ffa9e8b3ff5ea150dd26fad09a44a32c2953d40cc4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S44ZUAHL%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043833Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGsFH%2BJIqRhNy9%2BNRk0pPl3YRJx5Qx6pio4zNnl0ORh9AiAKSeZQ1V%2Fvb5QNp8wiqd58Wgw5usP7QuQ9qDGDI7QP%2BSqIBAim%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMuE78aL5Vr8EptWVSKtwDeEkxutpCxL5QIe0m8zT8KzQSaSvB%2FAy%2F738WADOZ0VFfRYLdTHbxk%2FCbA1hhfqsaolKuo%2B9Aj6KUJr5NOj3AlFRUEHBjsgOyUrxF4RXglKpM6jP9hsKfZnE4d2GslSlEFiJWHKKdm7ftUJszzI9IEwmk8V4TiJOGBAzjVHPwsCKAkTgp2Yk%2BxZkNV0CXT%2BmqtpNmiGvHsV%2FoVlh4Gyyxc7pgFXeoq6Jk23vk4mlUgoHPdYQLXXsod%2BrOX7pAL%2FBo%2BmOT0xtPFS9w%2BgX0Ox0ceg%2F%2FCAXlXajMCM2eWd8aawXC4p6nHLmTDHblhM7crFTrs%2F8aIag0347mQ38g74ujslLtlhvwf%2BzS3uZepofgwCkLcl02nOyTvE6XdDNwIQE2s%2Bl1YZ3rsdZgtiXQWj%2FZtLC6M3LqvR8ChDSF26TUHT0vVuG%2Bq%2Bgyo4FClhJRlHmRjpSSZkkRevJhPVydWSsn%2BWkPa5JtzTPB4Z7huOdWdqAthOotImDQiKnJv0NGFhnE86v%2FmM5R%2BF2GwyFj8WVtG8HdfJ2PyOaIUGor7POVMUExDURi3iKMTzTBGSsutP9TvKIkF2RR%2BFu%2F9g43m3W3Kg1YyO%2BhhPhOvCXRdSsAwKeNJExivra2jscM3Lww%2F4zf0AY6pgH8BVaJsZMP1obZf3AUSmGJBh9FVwr8VE0U4fmUVhabudGJYMVrwBB4ss%2BFz%2BzgQhmdqsGFGzSrQ7extuah7PITc9ZJmFR6zsPFz%2F0DAHBrfXRTH6BULHB%2FHt6PUJPYrsoHG09Y2Wwzi5K1L4MGA6KDpeghoHhyBFQoem1U4ZUMJ6KJzEUJ3U9v6i%2Fn2Df9%2BqztAz1FyLQEUmjv1%2F5SGMI%2FWvj608zU&X-Amz-Signature=0ff7028ff0a597ad6b4b657d97602fea7a1967fb89cbfafecf883dc73665f029&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIAIBESC%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043833Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDh7U4OvswflovzMQ%2BvgI9UsY6Hx0hpz6UghmSH55zgVgIhAPK5PCSyLjZN8Hl%2BXipl%2F3Yp4lFafcWTuVWKsU2ekNPeKogECKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyhIMaLA%2FO4BdzoWgsq3AN85rxC%2F%2BOsRNdMUXF8b9PIIaITzbdJDgy0kOEgsSqAEXm39eYz%2F1aN3nI%2F%2F4knBxLbwikImIl0TSVUKbDZV1m0Yr5Euh59tC7GPXJ15ie6EBgMjcgEHEO4dZfu4GyEFrcajj06suj6u3sF%2ByP4cuO3u6lGFnVgvZ6w%2FPJeN8BQkltUD%2BB84BAauqwdIj3rtiXhHnRz1hsk%2Fes0Z9TQrXJuPtujOK5mTmP6fOvf30DtAB0qCpPh5wOsRlnwaVeG2KD2DgffkX3Nlhp%2BGIOW4OrEQLaQILTwBXPkAD32KV3TXkg%2BV2ffKypN64E1hp7A6o7pxST%2FxH%2FsOp5WlBoryL1Gh9ZTo2h5GfPR5M2FbysXRd%2F%2Fv4sYE0K%2FSYELVCN7pR8LzrSyFSa2b66uGDwqMhoONNmgTiw7a70ciwKfLAS9naEY8srwRcuYNME0hQHvkLHX%2Fy8%2ByLGR4PTYC0N6yUvUauUAW6l5l8zG2LKzjlNYwk5qoPJ8TEnefFh2FcRbuOU149cXsAACvqXT%2F694tjdxmlR0UzYYOLuj46%2Bb38vHu2PBhl6KxMrvXTgJIXPI3rXOhXJbkl3%2BwucreJEvPUsWNLx%2BEJGY7Y5l4B4F0Aphh%2Bvl9jkF1WV6voZGdjDfi9%2FQBjqkAW3YZEKrPHuxoyfUqu7mSiTmDA4evAbZbVgXPj7Juitk6aYFWs1hEKYhCRk8UkJDIsLamQSVtHau74tPoLxkNViZCePuuZuTwTmQvQamATUugVwjQRq%2FjaA0IPuC0lw56a2Rfm4Q4dY3Q67gcI9yHgT4liwhEoy2iVEK%2FonKHua65ou350ykYrNN4MlyVcUBf6Q1c3yXabe5hHLO%2FrVIZ08Pn33O&X-Amz-Signature=21d2c78335a05f78092145323d67c1a124d5f8b7a9e154aa5a819a8d71431460&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIAIBESC%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043833Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDh7U4OvswflovzMQ%2BvgI9UsY6Hx0hpz6UghmSH55zgVgIhAPK5PCSyLjZN8Hl%2BXipl%2F3Yp4lFafcWTuVWKsU2ekNPeKogECKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyhIMaLA%2FO4BdzoWgsq3AN85rxC%2F%2BOsRNdMUXF8b9PIIaITzbdJDgy0kOEgsSqAEXm39eYz%2F1aN3nI%2F%2F4knBxLbwikImIl0TSVUKbDZV1m0Yr5Euh59tC7GPXJ15ie6EBgMjcgEHEO4dZfu4GyEFrcajj06suj6u3sF%2ByP4cuO3u6lGFnVgvZ6w%2FPJeN8BQkltUD%2BB84BAauqwdIj3rtiXhHnRz1hsk%2Fes0Z9TQrXJuPtujOK5mTmP6fOvf30DtAB0qCpPh5wOsRlnwaVeG2KD2DgffkX3Nlhp%2BGIOW4OrEQLaQILTwBXPkAD32KV3TXkg%2BV2ffKypN64E1hp7A6o7pxST%2FxH%2FsOp5WlBoryL1Gh9ZTo2h5GfPR5M2FbysXRd%2F%2Fv4sYE0K%2FSYELVCN7pR8LzrSyFSa2b66uGDwqMhoONNmgTiw7a70ciwKfLAS9naEY8srwRcuYNME0hQHvkLHX%2Fy8%2ByLGR4PTYC0N6yUvUauUAW6l5l8zG2LKzjlNYwk5qoPJ8TEnefFh2FcRbuOU149cXsAACvqXT%2F694tjdxmlR0UzYYOLuj46%2Bb38vHu2PBhl6KxMrvXTgJIXPI3rXOhXJbkl3%2BwucreJEvPUsWNLx%2BEJGY7Y5l4B4F0Aphh%2Bvl9jkF1WV6voZGdjDfi9%2FQBjqkAW3YZEKrPHuxoyfUqu7mSiTmDA4evAbZbVgXPj7Juitk6aYFWs1hEKYhCRk8UkJDIsLamQSVtHau74tPoLxkNViZCePuuZuTwTmQvQamATUugVwjQRq%2FjaA0IPuC0lw56a2Rfm4Q4dY3Q67gcI9yHgT4liwhEoy2iVEK%2FonKHua65ou350ykYrNN4MlyVcUBf6Q1c3yXabe5hHLO%2FrVIZ08Pn33O&X-Amz-Signature=98baef258bf4540e478547dae4435dbe1f160a50efefa980a459f8396a8e9588&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
