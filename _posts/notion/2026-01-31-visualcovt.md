---
title: "Chain-of-Visual-Thought: Teaching VLMs to See and Think Better with Continuous Visual Tokens"
date: 2026-01-31
categories: [paper-review, vision-language]
tags: [mllm, vision-language]
---


[bookmark](https://wakalsprojectpage.github.io/covt-website/)


## Abstract

- VLM의 한계를 극복하기 위한 Chain-of-visual-thought (COVT)라는 새로운 프레임워크를 제안함
- 문제점: 기존 VLM은 언어적 추론에는 뛰어나지만, **공간적 추론이나 기하학적 인식과 같이 밀도 높은** **시각적 지각이 필요한 작업에서는 어려움을 겪음**
    - 시각적 정보를 <u>제한적인 텍스트 토큰</u>으로만 처리하려 하기 때문임
- 해결책: VLM이 단순히 단어로만 추론하는 것이 아니라, **연속적인 시각 토큰**을 통해 **시각적으로 사고할 수 있게 하는 COVT 프레임워크**를 도입함
    - 이 시각 토큰들은 2D 외형, 3D 기하학, 공간 배치, 가장자리 구조 등 **풍부한 시각적 신호**를 압축하여담고 있음
    - 약 20개의 적은 토큰 예산으로 **가벼운 비전 전문가 모델의 지식을 distill**해서 학습함
    - 추론 시에는 이 **연속적인 시각 토큰 공간에서 직접 사고**하며, 필요에 따라 이를 시각화하여 모델이 무엇을 보고 있는지 **해석할** 수 있음
- 성과: qwen2.5-vl, llava와 같은 강력한 vlm에 covt를 적용했을 때, 10개 이상의 다양한 perception 벤치마크에서 성능이 향상됨

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PQTI2NZ%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2%2BDjrjBfS5aw9HcQvMTQX9nQfJp1zR6He5mpo4VfWiwIhAN4vz95V2DrlkZ7sc7%2BgB4K0L8ayvim2Qd9FBEFwjDWDKv8DCE4QABoMNjM3NDIzMTgzODA1IgwwZHccvc9OBY4iwKMq3AOG6htEK08CxdlfTVLg29ua9TS%2BwHjiI9LfwBvHKmqeryzKCy9huyntT%2BaL4D2GY55xCXzBSnc7AkteyG80n7LrgabMdXkH1A4uQogZ5prKbtnsjQahb43WIzZENjOIP7chPeRcvmysg32tW4KNIK9i1as2ZCfFJ7tI4GZK5QEhvVQpp90D9f2Rhylg2rN19Z4VGIeBAsHmcleDOYQo2wo6O3ZIkQmjHOguz8lIKoFkbomN7zbLMfglNtNqtxF38OpWQtNmTvu5sfSpC0jeL85bWPSqOebJJOwcguAnQ9IxaON%2FFh%2FLZIE8cIvJb%2Flw7YY52iJzZ2dJHWgegOulUtjGLy80tYNhmZ4HiaW9PQekJRT%2FOKTv7VN4smM2u4ST64EEBgMWlKLnV2ZlPn8Nm%2Ft6HjYNHDlcmcP0Et0lBKyHnXfBJvsWzlKefxawXubZOAB6Iejh60EtuJzmiw6RSqUW05rZvIxCqykZOzD7s1v8dHKIS35dNJNAoCmvRHAg7NIfooclZajcEovodS1pJRE5NmDoBzqGzSVjV7t0ZKsyik9l1dWevrKyY7edDIK08%2FM05k%2BG6gFrEh2lySmWljoczbwwstmtxIAicRfDZUKsDx26w8e%2FeTtguIRhyDDRg4TRBjqkAeIp0N2jj%2F48whzrHkZkTfkIzElg%2B911iv1tgPZZbkYtE32A8Ie56ldrqYDioCxz8pxNJwDnYp9tBZPOL%2FXDBEs8owy4Fh3vxXkHEiQfuPDBWBF6s%2BFgemaYOm5mhAq%2BBB76N%2FHKuHvC4MEyU3ezQUBtlKkI8iCTHhXcgTKDjNp6mTv3jsVhxe42Dm7kI%2BkVBFeH3aVNze%2BnFQh0m2eplGmauiHL&X-Amz-Signature=e8a48a2e879e6c3cd4697d42c340910a356da895a912ab61925dbc84d01666ae&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Introduction

- VLM의 성공 - 시각적 입력을 **언어 중심의 토큰 공간**으로 projection함
    - llm이 가진 강력한 구성력과 논리적 추론 능력을 그대로 상속받아 **자연어를 통한 멀티모달 상호작용**이 가능해졌음
- 텍스트 기반 추론의 한계
    - 기존의 텍스트 기반 cot는 논리/수학 문제에서는 효과적이지만, 시각적 추론에서는 근본적인 한계가 있음
    - 연속적인 시각 정보를 discrete한 텍스트 토큰으로 변환하는 과정에서 <u>세밀한 지각 정보가 손실</u>되기 때문임 - boundaries, layout, depth, geometry …
        - 현재 VLM은 perception이 많은 counting 등의 task는 어려워함
    - 텍스트로만 시각적 관계를 설명하게 하면, 오히려 모델의 시각적 추론 성능이 저하되는 현상이 발생하기도 함
        - qwen3-vl-thinking < qwen3-vl-instruct

        ⇒ **시각적 정보는 내재적으로 연속적이고 고차원인데, 현재 모델들은 language token을 통해서 추론을 하기 때문에 복잡한 인지 추론 능력이 떨어짐** 

- 기존 해결책
    - **외부 비전 도구**를 사용하는 방식 - **계산 비용이 높고 도구의 성능에 결과가 제한된다**는 단점이 잇음
    - 또는 사고 과정에서 이미지를 생성하거나 cropping할 수 있음
        - 이것도 역시 이미지를 text space에 project하는 방법임
    - 본 연구는 이러한 한계를 극복하기 위해, ‘_**vlm이 모든 것을 단어로 번역하지 않고 인간처럼 시각적으로 사고할 수는 없을까?’**_라는 질문을 던짐

    → 외부 도구 없이 <u>모델 내부에서 시각적 신호를 직접 처리</u>하는 COVT를 제안함

- 동작 원리
    - **연속적 시각 토큰**을 도입하여 VLM이 **시각적 단서 - 2D 외형, 3D 기하학, 공간 배치 등 -를 직접 추론**에 활용하도록 함
    - 학습 과정에서 모델은 **가벼운 시각 전문가 모델들의 지식을 distill**해서, 추론 과정 중 이 **시각 토큰들을 예측하고 생성**하도록 훈련됨
    - 전문가 모델 통합
        - task-oriented experts
            - SAM(객체 분할), DepthAnything(깊이), PIDINet(윤곽선)
            - prompt level에서 정렬
        - representation-based expert
            - DINO(의미적 특징)
            - feature space에서 정렬됨
        - 이해, 생성, 추론, 효율적 추론의 4단계 점진적 학습을 통해 모델이 시각적 사고를 익히도록 함
    - 추론 과정
        - 추론 시 모델은 텍스트 / 시각 토큰이 섞인 covt를 형성함
            - 의미론적으로 일관되고 perceptually 근거가 있는 답변을 생성하게 됨
        - 모델 내부에서 이 과정이 처리되지만, 필요하다면 **생성된 시각토큰을 디코더에 넣어서 이미지로 (마스크, 깊이 맵 등) 변환**할 수 있음
        - 이를 통해 사용자는 모델이 무엇을 보고 어떻게 생각했는지 눈으로 직접 확인할 수 있음
- 다양한 벤치마크에서 뛰어난 성능을 보였음
    - cv-bench, depth 관련 task 등
    - 압축된 시각적 사고가 더 정밀하고 근거 있는 멀티모달 지능을 가능하게 함을 증명함
- contribution 요약
    1. **연속적 시각 토큰을 통한 추론 프레임워크 covt 제안**
    2. **효과적인 시각 토큰 정렬 전략 및 4단계 학습 파이프라인 제안**
    3. 다양한 벤치마크에서의 **성능 향상** 및 **모델의 해석 가능성** 입증

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PQTI2NZ%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2%2BDjrjBfS5aw9HcQvMTQX9nQfJp1zR6He5mpo4VfWiwIhAN4vz95V2DrlkZ7sc7%2BgB4K0L8ayvim2Qd9FBEFwjDWDKv8DCE4QABoMNjM3NDIzMTgzODA1IgwwZHccvc9OBY4iwKMq3AOG6htEK08CxdlfTVLg29ua9TS%2BwHjiI9LfwBvHKmqeryzKCy9huyntT%2BaL4D2GY55xCXzBSnc7AkteyG80n7LrgabMdXkH1A4uQogZ5prKbtnsjQahb43WIzZENjOIP7chPeRcvmysg32tW4KNIK9i1as2ZCfFJ7tI4GZK5QEhvVQpp90D9f2Rhylg2rN19Z4VGIeBAsHmcleDOYQo2wo6O3ZIkQmjHOguz8lIKoFkbomN7zbLMfglNtNqtxF38OpWQtNmTvu5sfSpC0jeL85bWPSqOebJJOwcguAnQ9IxaON%2FFh%2FLZIE8cIvJb%2Flw7YY52iJzZ2dJHWgegOulUtjGLy80tYNhmZ4HiaW9PQekJRT%2FOKTv7VN4smM2u4ST64EEBgMWlKLnV2ZlPn8Nm%2Ft6HjYNHDlcmcP0Et0lBKyHnXfBJvsWzlKefxawXubZOAB6Iejh60EtuJzmiw6RSqUW05rZvIxCqykZOzD7s1v8dHKIS35dNJNAoCmvRHAg7NIfooclZajcEovodS1pJRE5NmDoBzqGzSVjV7t0ZKsyik9l1dWevrKyY7edDIK08%2FM05k%2BG6gFrEh2lySmWljoczbwwstmtxIAicRfDZUKsDx26w8e%2FeTtguIRhyDDRg4TRBjqkAeIp0N2jj%2F48whzrHkZkTfkIzElg%2B911iv1tgPZZbkYtE32A8Ie56ldrqYDioCxz8pxNJwDnYp9tBZPOL%2FXDBEs8owy4Fh3vxXkHEiQfuPDBWBF6s%2BFgemaYOm5mhAq%2BBB76N%2FHKuHvC4MEyU3ezQUBtlKkI8iCTHhXcgTKDjNp6mTv3jsVhxe42Dm7kI%2BkVBFeH3aVNze%2BnFQh0m2eplGmauiHL&X-Amz-Signature=7608a8d124d432ff15a1fee47e71767a27ba57c8c7eeaad493f42fc45f3aadfb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PQTI2NZ%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2%2BDjrjBfS5aw9HcQvMTQX9nQfJp1zR6He5mpo4VfWiwIhAN4vz95V2DrlkZ7sc7%2BgB4K0L8ayvim2Qd9FBEFwjDWDKv8DCE4QABoMNjM3NDIzMTgzODA1IgwwZHccvc9OBY4iwKMq3AOG6htEK08CxdlfTVLg29ua9TS%2BwHjiI9LfwBvHKmqeryzKCy9huyntT%2BaL4D2GY55xCXzBSnc7AkteyG80n7LrgabMdXkH1A4uQogZ5prKbtnsjQahb43WIzZENjOIP7chPeRcvmysg32tW4KNIK9i1as2ZCfFJ7tI4GZK5QEhvVQpp90D9f2Rhylg2rN19Z4VGIeBAsHmcleDOYQo2wo6O3ZIkQmjHOguz8lIKoFkbomN7zbLMfglNtNqtxF38OpWQtNmTvu5sfSpC0jeL85bWPSqOebJJOwcguAnQ9IxaON%2FFh%2FLZIE8cIvJb%2Flw7YY52iJzZ2dJHWgegOulUtjGLy80tYNhmZ4HiaW9PQekJRT%2FOKTv7VN4smM2u4ST64EEBgMWlKLnV2ZlPn8Nm%2Ft6HjYNHDlcmcP0Et0lBKyHnXfBJvsWzlKefxawXubZOAB6Iejh60EtuJzmiw6RSqUW05rZvIxCqykZOzD7s1v8dHKIS35dNJNAoCmvRHAg7NIfooclZajcEovodS1pJRE5NmDoBzqGzSVjV7t0ZKsyik9l1dWevrKyY7edDIK08%2FM05k%2BG6gFrEh2lySmWljoczbwwstmtxIAicRfDZUKsDx26w8e%2FeTtguIRhyDDRg4TRBjqkAeIp0N2jj%2F48whzrHkZkTfkIzElg%2B911iv1tgPZZbkYtE32A8Ie56ldrqYDioCxz8pxNJwDnYp9tBZPOL%2FXDBEs8owy4Fh3vxXkHEiQfuPDBWBF6s%2BFgemaYOm5mhAq%2BBB76N%2FHKuHvC4MEyU3ezQUBtlKkI8iCTHhXcgTKDjNp6mTv3jsVhxe42Dm7kI%2BkVBFeH3aVNze%2BnFQh0m2eplGmauiHL&X-Amz-Signature=e0a58b9784bbb4e6526eff917ec376d6286496b9d479be557d9324e58b8e42a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

1. **Tool-augmented reasoning**
    - VLM이 외부의 전문 시각 도구를 호출하여 문제를 해결하는 방식
    - 모델이 스스로 해결하기 어려운 시각적 작업을 외부의 전문 모델에 위임하여 처리함
    - 한계점
        - 외부 모델 실행하는 계산 비용
        - 사용하는 외부 도구의 성능에 따라 최종 성능이 종속됨
2. **Text space reasoning**
    - llm에서 큰 성공을 거둔 cot를 시각적 모달리티로 확장하려는 시도들
    - 이미지 → **캡션**으로 변환하거나, **텍스트 논리**를 통해 이미지를 해석하려고 함
    - 한계점
        - 연속적인 시각 정보를 discrete한 텍스트로 변환하는 과정에서 본질적으로 정보 손실
        - visual cot : 이미지에 대한 텍스트 해석에 의존하여 추론이 텍스트 공간에 한정됨
        - MCoT: 보조 이미지를 생성하거나 편집하여 추론하지만, 계산 비용이 많이 들고 유연성이 부족함
        - VChain: 이미지/텍스트를 번갈아서 사용하지만, 여전히 이미지를 텍스트 공간으로 projection하여 시각 정보가 손실됨
    - covt는 연속적인 “시각 토큰”을 사용하여 3d 인식 / 밀도 높은 시각 정보를 직접 추론에 활용함
3. **Latent space reasoning**
    - 텍스트와 같은 명시적인 토큰 대신, **모델 내부의 잠재 표현**을 사용하여 추론하는 방식
    - 복잡한 다단계 작업 시, 연속적인 latent 임베딩이 명시적인 텍스트 cot보다 효율적일 수 있다는 점에서 착안
    - coconut & ccot: llm에서 추론 과정을 연속적인 토큰으로 압축하여 효율성을 높임
    - aurora: depth, detection 신호의 잠재 표현 (vq-vae latents)를 사용해서 시각적 추론을 강화함
    - mirage: 시각적 추론을 위해 latent imagination을 활용함
    - covt는 이러한 연구들을 확장하여, **tool-use의 개념을 잠재 공간에 직접 내재화**했음
        - perceptual experts와 <u>정렬된 시각적 사고 토큰을 모델 내부에서 생성</u>하며 마치 도구를 쓴 것처럼 정밀하게 사고함

## Method


### **3.1. Preamble**

- 기존 VLM의 한계점
    1. Text-only cot는 error를 누적함 → <u>**초기 단계에서 오류가 발생하면 뒤로 갈수록 오류가 누적되는 문제**</u>
        - 최종적으로 틀린 결과를 도출하게 됨
        - 오류가 퍼지기 전에 시각 정보를 정확하게 포착할 수 있는 **짧고 효율적인 추론 방식**이 필요함
    2. 텍스트 중심 학습 신호의 한계
        - <u>**모델을 학습할 때 정답 supervision이 주로 텍스트로만 주어지는 것에 대한 문제**</u>
        - 텍스트 형식의 정답만 맞추면 되기 때문에, 이미지 내의 edge, depth, region 같은 낮은 수준의 세밀한 시각적 단서를 깊게 파악할 동기가 부족함
        - vlm 자체가 이미지에서 **정밀한 시각 정보를 추출하는 능력**을 갖춰야 하며, 이 정보는 추후 vision decoder를 통해 시각화될 수 있어야 함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PQTI2NZ%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2%2BDjrjBfS5aw9HcQvMTQX9nQfJp1zR6He5mpo4VfWiwIhAN4vz95V2DrlkZ7sc7%2BgB4K0L8ayvim2Qd9FBEFwjDWDKv8DCE4QABoMNjM3NDIzMTgzODA1IgwwZHccvc9OBY4iwKMq3AOG6htEK08CxdlfTVLg29ua9TS%2BwHjiI9LfwBvHKmqeryzKCy9huyntT%2BaL4D2GY55xCXzBSnc7AkteyG80n7LrgabMdXkH1A4uQogZ5prKbtnsjQahb43WIzZENjOIP7chPeRcvmysg32tW4KNIK9i1as2ZCfFJ7tI4GZK5QEhvVQpp90D9f2Rhylg2rN19Z4VGIeBAsHmcleDOYQo2wo6O3ZIkQmjHOguz8lIKoFkbomN7zbLMfglNtNqtxF38OpWQtNmTvu5sfSpC0jeL85bWPSqOebJJOwcguAnQ9IxaON%2FFh%2FLZIE8cIvJb%2Flw7YY52iJzZ2dJHWgegOulUtjGLy80tYNhmZ4HiaW9PQekJRT%2FOKTv7VN4smM2u4ST64EEBgMWlKLnV2ZlPn8Nm%2Ft6HjYNHDlcmcP0Et0lBKyHnXfBJvsWzlKefxawXubZOAB6Iejh60EtuJzmiw6RSqUW05rZvIxCqykZOzD7s1v8dHKIS35dNJNAoCmvRHAg7NIfooclZajcEovodS1pJRE5NmDoBzqGzSVjV7t0ZKsyik9l1dWevrKyY7edDIK08%2FM05k%2BG6gFrEh2lySmWljoczbwwstmtxIAicRfDZUKsDx26w8e%2FeTtguIRhyDDRg4TRBjqkAeIp0N2jj%2F48whzrHkZkTfkIzElg%2B911iv1tgPZZbkYtE32A8Ie56ldrqYDioCxz8pxNJwDnYp9tBZPOL%2FXDBEs8owy4Fh3vxXkHEiQfuPDBWBF6s%2BFgemaYOm5mhAq%2BBB76N%2FHKuHvC4MEyU3ezQUBtlKkI8iCTHhXcgTKDjNp6mTv3jsVhxe42Dm7kI%2BkVBFeH3aVNze%2BnFQh0m2eplGmauiHL&X-Amz-Signature=2e63a5dd89f97c82642fb62e6ec56ff71e0d6a8ba33a75de1b9d6e11d7d40b6b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663QJQ6LNN%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050621Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEaztBAdJUjlYM4Kk8quvxdlPB4CJkhkNdNmYgza%2FF3xAiEA4WhWndbUhXDq%2BQsrjKJcY1iXagpOhDAqKkjU0imRGi4q%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDAUuUotEzbysyEG%2BxyrcA20guFcq7FOPRbZV2fPZWgri2pvpJH%2FvSScuEcevZzv5yR02xr%2BQr3sKJ3QRdygGMmwprrdowxo1NYi2BvVDBMCdiW4FsCRljkKOKI1SPZWoQBUwZm9nrbFXubW%2BubcbopcHWy6jwCw85uvsh%2Bn%2BBJYCc54C6osmOwz0OQq25BPtV5ZSifBRXIwJhXVeHVxwJexSvXRJ0%2Fam6Mm3AE5GC7ZiB2HHpjlbR5LQi44%2F0EfzZjvObMPvj5doVIyP94jJMGsd2ukvU2OUOXHkq2XI1zVzQYNu44IH0r9NOZ9D5wgx8WQfSe6DOeMyoQiWEUqYx9Y6a1CptfWhPR1Uuuq05S9JKCHajk724Uo%2FyuYiVH%2F2%2Bvh%2BIJdsOIehOJ0UOjJLVNKtiI7qqg4bLBgDqKBWQXvb30yNPe7CmljUujlhlcFcXug0M8U5pQfrH8Q7e2BsIqMBujnCQJz60PpFMpykVOHJvxFPlop%2FGUIGEDO3TGwaJ2g4EpuGuI7%2F4CyhsrEcQIr6qvxpfr4ZkpVSG5E5Ah7DMqF%2BOMcicqYUiY0MAtLy0BqqBt3SEzMbL%2BcA7y7Cxdl0uZUdo0%2FOBJjPhHJYZLz2kcsPofvnMJtyfGnL%2BMh56m6CY34Bw28mOF88MJ2DhNEGOqUB5rQRdcg9sptZGG0t0anm51CNWsa%2BwA4AHtnFi1Q5rGyAlU%2Bojcq1y9E5pUYtn%2FLcK0qamMgM0ZoULES9uOxZIBPMMXvY4NFV15wm9sZBzNoFqnHFIB0Y4v%2BoaNsj8B%2BWrifl0diSCvBP44iCIqhUXTohjNQjn9hHUulChwO2D31M8ag7vrYr2kD7sD1EqqJfHXcBg4VCrci9r4BViEtlZBqOoUr3&X-Amz-Signature=d6ffcb0b84e445de5d8e846655c5256b887d93bccae9187844827284d4531c1b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 예측해야 할 토큰 y_i의 범위가 텍스트 뿐만 아니라 시각 토큰까지 포함하도록 확장
    - 답변을 생성하기 전에 <think> 태그를 열고, 그 안에서 시각적 사고를 수행함
        - 여기서 ‘이미지의 깊이 정보는…’이라고 생각하며 텍스트 대신 **압축된 시각 토큰**을 생성함
- **vision experts를 통한 knowledge distillation**
    - vlm이 생성한 시각 토큰이 **실제로 유의미한 시각 정보를 담으려면** supervision이 필요함
    - 이를 위해 4가지 가벼운 vision expert의 지식을 distill하여 학습함
        1. <u>**segmentation tokens - 객체 분할**</u>
            - SAM (segment anything model)
            - VLM이 생성한 8개의 토큰을 SAM 디코더에 넣으면 마스크 이미지가 복원되도록 학습함
        2. <u>**depth tokens - 깊이 인식**</u>
            - 픽셀 수준의 깊이 정보 (3d 공간 관계) 파악
            - DepthAnything v2
            - vlm이 생성한 4개의 토큰을 사용하여 depth map을 재구성하도록 학습함
        3. <u>**edge tokens - 구조 인식**</u>
            - 객체의 경계선 및 기하학적 구조 파악
            - PIDINet
            - 4개의 토큰을 사용해서 edge map을 그려내도록 학습
        4. <u>**DINO tokens - 의미 인식 (semantic)**</u>
            - 이미지의 의미론적 특징 파악
            - DINO v2
            - 생성된 4개의 토큰이 DINOv2가 추출한 패치 특징과 일치하도록 학습
- **추론과 시각화**
    - latent space 추론
        - 실제 사용 시에는 매번 이미지를 생성 x
        - 연속적인 시각 토큰 상태에서 바로 사고를 진행함
        - 이를 통해 계산 비용을 줄임
    - 해석 가능성
        - 필요하다면, 생성된 시각 토큰을 디코더에 통과시켜 사람이 볼 수 있는 이미지로 변환하여 보여줄 수 있음

### **3.3. CoVT tokens**

- **Token selection based on core perception ability**
    - <u>**token selection**</u>: covt 프레임워크가 어떤 종류의 시각적 능력을 학습할 것인가?
    - vlm의 핵심적인 지각 능력을 4가지로 분류하고, 각 능력에 맞는 전문가 모델을 선정해서 시각 토큰을 학습시킴
    1. **instance recognition**
        - 객체의 위치와 모양 파악
        - <u>**SAM**</u> → segmentation tokens
    2. **2d and 3d spatial relationship**
        - 픽셀 수준의 깊이 정보 파악
        - <u>**depthAnything v2**</u> → depth tokens
    3. **structure detection**
        - geometry-level details
        - 객체의 구조적 단서 및 경계선 감지
        - <u>**PIDINet**</u> → edge tokens
    4. **deep mining of semantic information**
        - 이미지의 의미론적 패치 표현 학습
        - <u>**DINO v2**</u> → DINO tokens
- **Tokens alignment based on granularity of visual models**
    - token alignment: vision experts와 어떻게 연결할 것인가?
    - 모든 vision 모델이 동일한 방식으로 작동하지 않기 때문에, 모델의 성격에 따라 2가지 다른 정렬 방식을 사용함
        - <u>**fine-grained task-oriented**</u>: SAM, DepthAnything, PIDINet
            - vlm이 생성한 시각 토큰을 프롬프트 공간으로 project해서 전문가 모델의 decoder와 정렬함
        - <u>**representation-based**</u>: DINO v2
            - 덜 세밀하지만 전반적인 특징을 담고 있음
            - feature space에서 전문가 모델의 encoder 출력값과 직접 정렬함

    ### (1) Segmentation tokens

    - 8개의 토큰 사용 → linear layer → cross attention → T_sam
        - T_sam은 SAM 디코더가 이해할 수 있는 프롬프트 형태
            - sam 디코더의 마스크 프롬프트 역할을 함
        - 입력: 8개의 T_sam, 이미지를 sam encoder에 넣은 이미지 임베딩
        - 출력: 8개의 예측 마스크 생성

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3ZODWZ7%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050629Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDXsH%2BzdPn9NRhGjVX1RAnEMg087xSpGt6jophygS1eoQIgAhoy6pkceWnLVBIkq1Z52Zt7zvdGlxZMzdAWz7Nwruwq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDIRWPrhjsZkwv3igkCrcA60%2F1rSynOZ5rxK%2BVzI%2B%2FA2UsrtCe8HaMWcU8CFE74crpjwZ6X5q8Tu41F%2BwW7qdLHr%2BtBO4xtSc%2F8ctVN%2FZFc6ul6GD%2BQgnu4sseY9MFvTwQkc%2F1%2BweFqEa8iSn%2BJEAbeZxFxFAdks0DBhQfKUF65RNrBQatQNi7H3LHFthkXQIe2DSB8jtsjUlmsMpxsMOSONLEJ1BcplffGztdcd3%2BcjXKc%2BbM4rY9CHK3p9aYDvfzGuzmDsqln7rREl5l8k1pKLy15J6oB11sNnT51k4XYaBt1c%2B%2B86BslsyIdZ3cw1s5GbjmRfuBU7ygfktO8PhrTKE%2Fi329%2F1UQVI0h9oopcxrjqfUzOo%2BfDygC1NC5V40zFVuKk0jM9rS8IOYwWrJ5AcacnfyD%2B66s75VaGVZHWLb6MErnIHmN2USTZEKLLxKU4yjixElwKTEvOQX4dD0uO8wMVr1em18A6aUOoDhqhQ4ZMriTL6WUixWxrx8UmeDFcY%2B%2BWsHLMZ02wsfZjjVn3kwTuErqmMt6eq2SwlJtpiUQxMEUwrwDhu1EFtihXXMgsXsbygyMmoVnVEnM2lfkAo%2BuJuzdglzCXsfu5TJ%2FoEJik9PVS93eUIW7yR1FEbYqqNYztWu207LhEFtMPCEhNEGOqUB2mI6%2FQcUHYPJ27QGa0TZPGe6iWrKh8cTO%2FcbiyrWc%2Bfws9ichVaUuHbkSUqPDuVE9Q%2BjRvR5CUf%2B6V6mG5RdjFBADUgHL%2FMVdEUMxCZxCENMZbeNdZgb%2BatB1besDAGZiVBvV86G%2Bo4KyNPk8cAxkWsW8Fw%2BscVkqRNGI%2FvdjVoT2sOd1RFH5yrzQCWqE3Dc8HWQoHBdF1%2BCLoUBpEm19uTO2%2F8C&X-Amz-Signature=74b27199b1e34ea6a9fa5e186b0968c82f656ffd006051f0daff9ecec2c0f21f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 예측한 마스크와 gt 마스크를 매칭 - dice loss, focal loss
        - gt 마스크: 풀로 sam을 돌려서 여러개의 마스크를 얻은 다음, 품질 높은 8개를 gt로 선정
        - 8개의 pair가 순서가 다를 수 있기 때문에 헝가리안 매칭 알고리즘을 사용
            - 8개의 예측값과 8개의 정답 사이의 모든 조합에 대해 비용을 계산
            - 전체 비용이 가장 적게 드는 최적의 1:1 짝꿍(Pair)을 찾아줌
            - ex. "예측 1번은 정답 3번이랑 짝, 예측 2번은 정답 5번이랑 짝..." 이런 식으로 매칭을 확정
    - loss function
        - **dice loss**: 마스크의 겹치는 영역 (iou)를 최소화
        - **focal loss**: 픽셀 단위의 분류 오차를 최소

    ### (2) Depth tokens

    - 4개의 토큰 → 4개의 프롬프트로 작동
    - depthanything 인코더에서 추출한 dense 피처와 batch matrix multiplication을 통해 depth map D를 재구성함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664LZZ6JML%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050631Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHNexhkDFXduaACikbk1s6DTx3gPoV1eTyWiEiwUrCbEAiARN1qVfaW4uLeXc%2BHyV8W9fauTRwlje0phGKSD1pM1QCr%2FAwhOEAAaDDYzNzQyMzE4MzgwNSIMUYTcjFHO5W7wbWUFKtwDv571tnDiB0V%2BJpO5xl%2BLTSWycZGQN0qQbDvUuFAk0AmyYwY8IaEcGTGAEH%2FagLKggdoDZF6uEPLoL3WA3Tg3%2FySG6soXrHt9eJPEXMIudYkVtMs9z6ZVFOIkFki2Y34Uaf4%2BJErUaMDvgdDsHA0YbLJHhdRyXww3PQ5h9bTfxs1NEkUN%2F0i5RUvdetFrP96Nw2h3c1l5YUAwuCuvoesqvy0BIGzVQXcXQBnDGTLJ%2FFJIs0RSCgCDaqfjzrZn0v%2FQhvxW%2Bjk5JKRy3wQCuyBTd9i2qayg8G1W0MtW0GOdofjPXfBBzoYJcwxSGrl3stFs7BFY0fg01zW2vAWpdQfSz8kyax1VWOmyLBDH2jT3mshaZieErUZdIC3Z0t%2FHP1nN66mWgvzNpsLsH5PN2nrHCZXg6IrsYr8KSe126fkhqci%2FgxsFtgqZgHl%2F3CJfM80jqf5pOKqC4AQ%2BdxSzYNyk3gjUI9BN05BNlR2nALynhlXD37q%2BQRKaNyq6wSLx54qYGMzjZxjD4GLZErXZBmQNdVQ8I3wmfI6yDDmZ2lTGnYrimNV2vIHgsPYeYodcjrZQxADj%2B8ZdjIcXRndEk2%2FmBiqjhyHTVSkF7qq7xpQQOdmRjUNczpfmR%2FCCN8Iw8oKE0QY6pgEDQYWIjKAJRnHapWx7qtY9ryW0G9y5oymaguMzDt%2F09CmN56Wr2RRD7mHF2581HQ9jR69KgDYKPV2XACep0xPxSpUDPCjh%2FelWukuub7UR3JlqSivQVIcigkfevPPtcz3J2WAbQ%2BQbn9ivUpJaiIizTHsVXT%2Fsh09J29M6QDAf5pdszXu6x4yPIfQqeNUeUQtt3IdNupD5IbbQ33gCM15z8F8egz1%2B&X-Amz-Signature=47d6a3d96e1479e7c8d67c4cf3535ec4541558bc8117e3363c1aec3240decd6e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGGM533X%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050631Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCJYn55FYNAoGR9hzbE%2FjE3f5ewkc3t38lFfJ2OQHEzVQIgM4%2BV5fIgAMzjqpKk2r8fgumsWpexX8CVOePy1fBa01gq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDII%2BDYGGgE1kl7rFVyrcA1plzqCr6VZneHWSV4hnRs5hd9Xydrn3DNmndbSUC8O%2BA%2B2FDvwdiI6SB%2F4u1C5KRebv9vRrpaKREMbL315WS8gOKch4X%2FtoDTlmfGhDgSl7I%2FouBG1JMKU0F952s5j6CiQAhnryoACKqyQfOEBvMRxXa2Kz9%2BpUl%2BhPo6r7Kgh02qAX5XYWBgLCVL4kq3trqulWe13DHNcUB0NlHJIJ0h36Vn7rEPuNAB%2F%2BDIqfTCo4j6LFG%2FTetR%2BxHZTuGFj7twJY4psf2aBIpV5sMLWA4gUBAZNhZpxfp2gy0QgdNIGr6HBH2YjOf562%2BbyHh8JKOrkgEHB97WdekiSe5%2FOqTc9dbxtLN8aaSq4p39baNr3mJpuMWRVHtJ5T5tdqTEwNEC6ilW2iYK0hp%2FK9JKHK5Cdm5AWyyT1xKqo7udN5GAlGiAlgCUhzxcFBgBt7S4w0zxzkbiR9nbO1j44MDXOFw5umY9QQJ6jQw2Mf5Vbj%2BwYuSCzX5AQzUqgEWc4QzoHZtP3eWCQy0FvYfZCGYxb1%2B5WNH2deopxjOvlwS546q7oIWJe6k4NIka%2Fs6yUZfJN4fbbVpWLTRqisAJou9IF3sqfalyq5XiW103V3yHkLCpKR1o4HkHecvWQg4RByMIiEhNEGOqUBUU0pA14eWtx19S%2FJ7V59lZcLByl9WNhCE1lElwU%2B6zcEdBY3s9Q8LyRpS8oK1ybzrgxL2wPLKKwIS3kZ8so0jdWMtElJYhGG1p2KRTbShEOF7nFVqWNO4%2F9QYGH4Q68cVBvzIf7eSUc4IlLa5goJ7WfvKM1ub6RzG68zOC2%2BNku5I1%2Fg24nddl58MSyKpydKFtnL%2F40D4hUD11Mt1NUhGyoFqiZv&X-Amz-Signature=6a3d87f5a4371af9df6734bc1f808e750caef43416b4f39306f76db1f408c241&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - **L1 reconstruction loss**를 통해서 최적화

    ### (3) Edge tokens

    - 생성된 4개의 토큰은 각각 PIDINet의 특징 맵에 적용되는 1x1 convolutional kernel로 활용됨
    - 토큰 자체가 필터 역할을 해서 edge map을 그려냄
    - 마찬가지로 4개의 edge map 평균을 예측 edge map으로 사용
    - 마찬가지로 **L1 reconstruction loss**를 통해서 최적화

    ### (4) DINO tokens

    - 4개의 토큰을 DINOv2가 추출한 patch level feature와 모양이 같아지도록 projection함
    - **mse loss**를 통해서 dino feature과 직접 같아지도록 학습함

### **3.4. CoVT Training**


**training loss**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PQTI2NZ%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2%2BDjrjBfS5aw9HcQvMTQX9nQfJp1zR6He5mpo4VfWiwIhAN4vz95V2DrlkZ7sc7%2BgB4K0L8ayvim2Qd9FBEFwjDWDKv8DCE4QABoMNjM3NDIzMTgzODA1IgwwZHccvc9OBY4iwKMq3AOG6htEK08CxdlfTVLg29ua9TS%2BwHjiI9LfwBvHKmqeryzKCy9huyntT%2BaL4D2GY55xCXzBSnc7AkteyG80n7LrgabMdXkH1A4uQogZ5prKbtnsjQahb43WIzZENjOIP7chPeRcvmysg32tW4KNIK9i1as2ZCfFJ7tI4GZK5QEhvVQpp90D9f2Rhylg2rN19Z4VGIeBAsHmcleDOYQo2wo6O3ZIkQmjHOguz8lIKoFkbomN7zbLMfglNtNqtxF38OpWQtNmTvu5sfSpC0jeL85bWPSqOebJJOwcguAnQ9IxaON%2FFh%2FLZIE8cIvJb%2Flw7YY52iJzZ2dJHWgegOulUtjGLy80tYNhmZ4HiaW9PQekJRT%2FOKTv7VN4smM2u4ST64EEBgMWlKLnV2ZlPn8Nm%2Ft6HjYNHDlcmcP0Et0lBKyHnXfBJvsWzlKefxawXubZOAB6Iejh60EtuJzmiw6RSqUW05rZvIxCqykZOzD7s1v8dHKIS35dNJNAoCmvRHAg7NIfooclZajcEovodS1pJRE5NmDoBzqGzSVjV7t0ZKsyik9l1dWevrKyY7edDIK08%2FM05k%2BG6gFrEh2lySmWljoczbwwstmtxIAicRfDZUKsDx26w8e%2FeTtguIRhyDDRg4TRBjqkAeIp0N2jj%2F48whzrHkZkTfkIzElg%2B911iv1tgPZZbkYtE32A8Ie56ldrqYDioCxz8pxNJwDnYp9tBZPOL%2FXDBEs8owy4Fh3vxXkHEiQfuPDBWBF6s%2BFgemaYOm5mhAq%2BBB76N%2FHKuHvC4MEyU3ezQUBtlKkI8iCTHhXcgTKDjNp6mTv3jsVhxe42Dm7kI%2BkVBFeH3aVNze%2BnFQh0m2eplGmauiHL&X-Amz-Signature=2c98a46da7490eaaaa6c6d14f4c52308c7ef430d6c802cef4b4223447119e7e0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- ce loss: vlm이 텍스트를 올바르게 생성했는지 측정하는 기본 손실
- γ,λ : visual loss에 대한 하이퍼파라미터, 실험에서는 모두 1로 설정함

→ text도 잘 생성하고, visual token도 잘 생성하게 됨


**training data**

- 시각 토큰을 점진적으로 익히도록 4단계 커리큘럼을 도입함
- 갑자기 어려운 task을 시키면 기존 언어 능력을 까먹거나 학습이 불안정해지는 것을 방지하기 위함임
1. **이해 - comprehension stage**
    - 모델에게 시각 토큰의 기본적인 의미를 가르침
    - <image> 태그 바로 뒤에 시각 토큰을 삽입하여, 모델이 이미지 입력과 시각 토큰을 연관짓도록 함
    - 입력에 정답 gt visual 토큰을 넣어서 visual token에 대해 이해하도록
2. **생성 - generation stage**
    - 모델이 시각 토큰을 “정확하게 생성”하도록 학습
    - 질문과 답변을 수정해서 모델이 명시적으로 시각 토큰을 출력하도록 유도함
    - 질문-"이미지의 깊이 맵은 무엇인가?", 답변-`<depth tokens>`
3. **추론 - reasoning stage**
    - 시각 토큰을 사용해서 복잡한 문제를 풀도록 함
    - <think> 안에서 시각 토큰을 생성하고, 이를 근거로 최종 <answer>를 출력하는 전체 사고과정을 학습함
4. **효율적 추론 - efficient reasoning stage**
    - 모델이 고정된 패턴에 얽매이지 않고 유연하게 사고하도록 함
    - <u>시각 토큰의 일부 유형을 무작위로 제거하여 학습함</u>
    - ex. 어떨 때는 깊이 token 없이 seg token으로만 추론하도록..
    - 주어진 정보만으로 효율적으로 답을 찾는 법을 학습함
- 데이터셋
    - vision-centric data: llava-onevision 데이터셋 중 시각 중심 서브셋
    - spatial perception data: 공간 지각 능력을 키우기 위한 tallyqa (숫자 세기), ade20k-depth (깊이 인식)

## Experiments


**Experiment Details**

- 메인 베이스라인: qwen2.5-vl-7b
    - lora 사용 adaptation
    - rank 16, alpha 32
- learning rate: lora 5e-5, projection modeul 1e-5
- 학습 step
    - 1단계 (Comprehension): 4,000 steps
    - 2단계 (Generation): 3,000 steps
    - 3단계 (Reasoning): 3,000 steps
    - 4단계 (Efficient Reasoning): 5,000 steps
- a100 1장 or a6000 4장
- 배치 크기 4

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PQTI2NZ%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2%2BDjrjBfS5aw9HcQvMTQX9nQfJp1zR6He5mpo4VfWiwIhAN4vz95V2DrlkZ7sc7%2BgB4K0L8ayvim2Qd9FBEFwjDWDKv8DCE4QABoMNjM3NDIzMTgzODA1IgwwZHccvc9OBY4iwKMq3AOG6htEK08CxdlfTVLg29ua9TS%2BwHjiI9LfwBvHKmqeryzKCy9huyntT%2BaL4D2GY55xCXzBSnc7AkteyG80n7LrgabMdXkH1A4uQogZ5prKbtnsjQahb43WIzZENjOIP7chPeRcvmysg32tW4KNIK9i1as2ZCfFJ7tI4GZK5QEhvVQpp90D9f2Rhylg2rN19Z4VGIeBAsHmcleDOYQo2wo6O3ZIkQmjHOguz8lIKoFkbomN7zbLMfglNtNqtxF38OpWQtNmTvu5sfSpC0jeL85bWPSqOebJJOwcguAnQ9IxaON%2FFh%2FLZIE8cIvJb%2Flw7YY52iJzZ2dJHWgegOulUtjGLy80tYNhmZ4HiaW9PQekJRT%2FOKTv7VN4smM2u4ST64EEBgMWlKLnV2ZlPn8Nm%2Ft6HjYNHDlcmcP0Et0lBKyHnXfBJvsWzlKefxawXubZOAB6Iejh60EtuJzmiw6RSqUW05rZvIxCqykZOzD7s1v8dHKIS35dNJNAoCmvRHAg7NIfooclZajcEovodS1pJRE5NmDoBzqGzSVjV7t0ZKsyik9l1dWevrKyY7edDIK08%2FM05k%2BG6gFrEh2lySmWljoczbwwstmtxIAicRfDZUKsDx26w8e%2FeTtguIRhyDDRg4TRBjqkAeIp0N2jj%2F48whzrHkZkTfkIzElg%2B911iv1tgPZZbkYtE32A8Ie56ldrqYDioCxz8pxNJwDnYp9tBZPOL%2FXDBEs8owy4Fh3vxXkHEiQfuPDBWBF6s%2BFgemaYOm5mhAq%2BBB76N%2FHKuHvC4MEyU3ezQUBtlKkI8iCTHhXcgTKDjNp6mTv3jsVhxe42Dm7kI%2BkVBFeH3aVNze%2BnFQh0m2eplGmauiHL&X-Amz-Signature=bd9583a02eed704b5fc0f3f80dfab326831a39ae5236d9254aed017adb1ca687&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


**Model Evaluation**

- 모든 평가는 VLMEvalKit를 통해서 평가되었음
    - VLMEvalKit: 오픈소스 평가 툴킷
- vision-centric benchmark
    - main 평가를 CV-Bench로 하였음
    - 하위 항목 중 count, depth, distance task를 중점적으로 보았음
    - **BLINK, RealWorldQA, MME-RealWorld:** 현실 세계의 복잡한 이미지 이해 능력 평가
    - **MMStar:** 이 벤치마크에서는 '대략적 인식(Coarse)', '세밀한 인식(Fine-grained)', '인스턴스 추론'과 같은 서브셋만 골라서 평가함
- non-vision-centric benchmark
    - 시각 능력만 키우다가 기존의 일반적인 언어 능력이나 지식을 까먹지 않았는지 확인
        - ocrbench, mme, wemath, hallusionBench 등

**Quantitative Results**

- 베이스라인 모델과의 비교
    - covt를 적용하니까 일관되게 성능이 높아짐
    - cvbench의 경우 5.5% 성능 향상
    - subtask의 경우 depth task에서는 무려 14% 성능이 향상됨
- 토큰 수가 많아질 수록 성능이 올라감
    - 1가지 token: seg
    - 3가지 token: seg + depth + dino
    - 4가지 token: seg + depth + dino + edge
        - 특히 depth, distnace 추론 능력이 극대화 됨
        - 각 토큰들이 서로 겹치는 정보를 주는게 아니라 상호 보완적인 정보를 제공하여 시너지를 냄
- 다른 베이스라인에도 적용해서 결과 봄- llava-v1.5-13b

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WUWOEJCU%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050639Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD7DA8RdOCjFAedulx0IxtMjXGRfktTB4MgwC1iGFbrzwIgB19qsiURpeqw3RT3pu13P45jcP4PUYcWDMNYrGlQXY4q%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDHO8%2FxEZLF1HzuKkqircA91O%2F4c%2BDYuDz5%2BHdTX%2F03joVKSmiJobHejYzUbQa5uhqixOaIZ60sSIgCjIniJQvSL6wID%2FA026ZJH704Hg%2FHYYMYO6dDaCdrvlFWL4qtLEhEnU3v2DtqwHXgg0h3%2FJD64xiQiicDtJxRP5ElKT0EGQWli1bYXPjFZ2NTjGKUaeVS9QMkMOGjN9%2Fw498voEaD9d6M4N67qzUxC%2Fe7zv%2BkT81UjNlXhXIO%2BE%2BeNt55c%2BbTLm%2FPgDD%2FpCWUjRfrW8rXY2K3s8a42wNwwajrxS8f%2FNQdJ3vYZbndyklEak3K7XJcPUanwZCtr0HJDKNGuhQiuvUwwfu2JS6sWKjBr5coGlYRDUt%2Bm0OR1ieSMtCpYbm1tGfBZZpO5oHXE5r32xei3Fs2v%2Fkp0gOby%2BgvMXbmiz7q%2FfIAJi7gMv1cdNZdn8hFY6i31IoWMlXinTBrwpaROyONkE1Nj6Xn1xrnu4f%2FV1PVpZZGcpVorPKWOFco0q5nKon%2FTn6HkIwdYTaAFhI%2BtCMQLxM4%2Fwa9KTlUVYsT5K5gtnJIEW5pK3VAds2g107bBl3aeNfkzvqi4gUtAaHxTNCwR%2B1OE0KG3ondMIduo9vFdqqse8mNVWcAYvxN02boV5hH9R2JBN%2FYtjMLeChNEGOqUB6EKkKVF%2FZ%2FFefVB1deW%2ByAd%2B4uR3GPqG4gzX%2Bs8JxIfEHELLgOp%2BDviYub6egvz9FKFFKMthpM7LqRVPUBZXUjhuIXaYTBqDhF9Ejy6PlBZGQi9tGLwRM73%2B57hOJUVSb5mCKT1BAUazxat4PRzn8uShK0b2Cs0jftjgFmxr54KBB7KnIn5LwmWWzbc6Z%2BV%2FLbqgsLedPQ6vDqXFB5mOG4ziwQUe&X-Amz-Signature=0e715f962eebb21407974f9a3bf18a81c677e545664da7a149d720713faddad4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PQTI2NZ%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2%2BDjrjBfS5aw9HcQvMTQX9nQfJp1zR6He5mpo4VfWiwIhAN4vz95V2DrlkZ7sc7%2BgB4K0L8ayvim2Qd9FBEFwjDWDKv8DCE4QABoMNjM3NDIzMTgzODA1IgwwZHccvc9OBY4iwKMq3AOG6htEK08CxdlfTVLg29ua9TS%2BwHjiI9LfwBvHKmqeryzKCy9huyntT%2BaL4D2GY55xCXzBSnc7AkteyG80n7LrgabMdXkH1A4uQogZ5prKbtnsjQahb43WIzZENjOIP7chPeRcvmysg32tW4KNIK9i1as2ZCfFJ7tI4GZK5QEhvVQpp90D9f2Rhylg2rN19Z4VGIeBAsHmcleDOYQo2wo6O3ZIkQmjHOguz8lIKoFkbomN7zbLMfglNtNqtxF38OpWQtNmTvu5sfSpC0jeL85bWPSqOebJJOwcguAnQ9IxaON%2FFh%2FLZIE8cIvJb%2Flw7YY52iJzZ2dJHWgegOulUtjGLy80tYNhmZ4HiaW9PQekJRT%2FOKTv7VN4smM2u4ST64EEBgMWlKLnV2ZlPn8Nm%2Ft6HjYNHDlcmcP0Et0lBKyHnXfBJvsWzlKefxawXubZOAB6Iejh60EtuJzmiw6RSqUW05rZvIxCqykZOzD7s1v8dHKIS35dNJNAoCmvRHAg7NIfooclZajcEovodS1pJRE5NmDoBzqGzSVjV7t0ZKsyik9l1dWevrKyY7edDIK08%2FM05k%2BG6gFrEh2lySmWljoczbwwstmtxIAicRfDZUKsDx26w8e%2FeTtguIRhyDDRg4TRBjqkAeIp0N2jj%2F48whzrHkZkTfkIzElg%2B911iv1tgPZZbkYtE32A8Ie56ldrqYDioCxz8pxNJwDnYp9tBZPOL%2FXDBEs8owy4Fh3vxXkHEiQfuPDBWBF6s%2BFgemaYOm5mhAq%2BBB76N%2FHKuHvC4MEyU3ezQUBtlKkI8iCTHhXcgTKDjNp6mTv3jsVhxe42Dm7kI%2BkVBFeH3aVNze%2BnFQh0m2eplGmauiHL&X-Amz-Signature=0aa973da1cfedcc2b714b48a98c73687a8506a6b07266a0702af08bfe56775c0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QSIUYC2T%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050639Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEh2w47%2F2LmrLmVE4UR25uTKInkUNhmA6%2FhQUpEjaGtGAiAzxljwdwaYEPx56%2B0Fl%2ByrLOQyLKQPGPOeHdrlgj44XSr%2FAwhOEAAaDDYzNzQyMzE4MzgwNSIM2ROJ7F3td8Sgno20KtwDLd1nUL1lSLmcJ71wkyccqeQ%2Fe0IpqcfAWIXeX%2BGNbKT3r1DlYSj%2FPRzNNS8cBRN8HCpByY%2Fgh2YPDt37N2BUNEY9ZWKbJk36xqspi%2BZmgx60nZBalSsha1F8jXfIdR4M10YToVHtrpl2BoVJe2zW820AJagwjYZLgXj20QizINyN4Fde8XD1rfE2fOcqNX3LZlBUMluBLNxUilWDSYMUIENcuKhO9OSvpKE0nAgIFdQMM%2FdfCSF%2Bk1Alw4%2FqXwsu9Y5aYTAm2oeDMPHZo7HQhBjbz3BnEF50LjXom6Bv0SmRJ6QyhnyKaKzK6E59qhxp86UrJUC%2B2BcTvimJnlx%2BMxc9%2B2Om5Fy2%2BroxbNMyVurpSrZ0ElkwKpLGI5Q3Vt2HZbCmxVDtp9suxUERQBmVnhWuU7xt1krBmu85pxvbyRQjzVDQBCZHcWcVRMSk%2FCjoFgNy4ImUMvqxXb2bTVHLL11KI5RRs%2BTe0%2Bfiwzt%2B%2BUSflq6SE%2F12xePvLyLPE64erJySDQaDrVFyR%2FHlKNxLFzcBP4CK5%2FFxpy45wlDObLf4n3vbrpgVAPq5bg9YPfZD8fELi7HJT4wNO4EZV2PfHOpNuAEXY0chK%2BZ8FWTKYOz3fRt%2FkfaI3zLQBm0w5oKE0QY6pgFJdzclOBbVS%2BYOpukIXAt5UUVk9WElxwyjaxCCo5ko8AQIC68oN9rPvJHx9enERkTzjBQvh2xArii8Lq328OkkTy4tiZb6PFneic5XlfeI7vWwLCojHZwFEt9hAkH3tkUHleE4RVZMXeVkFCJhaEQJuiuDKKBEpyYYawVCy7RlQ7b%2BRNJVz2jvi%2F1c%2BWfv50Is9HGadzSS%2BPWR28szrmKrUZ6BJd5L&X-Amz-Signature=15dc4eb195505cc3925bcc95e59cf3a2e507b20dd23671228e24e913a5658eb9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466THIXMHQH%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCEv1Q34jRxLUeNxGc2h8xMtsu0lAoRL%2B%2F7aBEQKTtj6wIgMkAbK3mar%2B3tADPvJpobZAmpcVl%2FGwqR9f83KTGFMxEq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDIeyWDdxTal1DWH2XyrcA1bpwEc9qQGpP4t914WkxI1idpI7ywY6%2FQQzm6sDjRRL9cihMpu9p5tRrhIyViP9Cwuj02QlqXseTS4kJZP2OEegRH%2FXb21yW7hIHTIrCt5pmfHrVvhCFEZJ1RaNzewG2H9W7dbXrJcnWNXkhVdTlABILpYOz26iqLTAPFUdLNNzkZ9QXu3nAcdARY8M5nkeh1HPoywVQ9zpZxD1%2Flf41fb9R5a4UGzwpZyTLASg21mNsEGeok%2BEV7qiJ9bXu2%2B9AmZTnhq6TOVwZnpMdiPMkcj%2FfOCF%2Fupy%2FdJvpb3jdoQl9WzmoqVs6seD6Qrd0V%2B9ZJH9Bhs0EPyhKvRMNGu4zw%2BLE9xACb9r2ZLqcOiiJWt1BHb%2FnXRYIU7Bw8WzA6lAtvGWKE9AUW85cUwFj%2F5RZNJBJ%2BPGZPViSvcEkTyW19naa2EJSNvN1nW90syhCA1MsNpM%2BNy1uuI1bw9zAtzHDZLzPj%2FEPTeF5JrC1nf%2BygUL4ABSxyMO55mCQ7uS259cZLcR9thgEsw9%2BO8bwyiLoR6YubAtXo6qlVEp3xapNXmnAqgdN1eQha4LaPYKXbNwkar8ZMkLaiCZlt6nZCVqHZ1ouv64CbgWmzHbPINYcpjkms6msZA9%2BCz6xFW7MKuFhNEGOqUBzxt6oZ228vnuyelHGqk3CXLGY%2F2j%2FEJhBRRwCCFvLlgBSZ%2FA5DC7UQxhRxEQppWH1VdeezmvdqvU60DMXoe1lTml1a3hiLErQiLIh%2FIz%2FBqHWy%2F0aRzVsIEENp%2BhHzAk9AjQS%2FQSZ5OFquJpBttl8yC4pq3pNcv6XX03C%2B8p%2FRWZjHf96DJYk18%2FJLwVwUKuy%2FcjlQYBVpFB%2BGKucFS%2FcjfeBKYs&X-Amz-Signature=f04c1d1a9149b2428ad682d89f10dc2df26295999e9594b0d82ca52b06131e9b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q67AGASA%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDbSzHY69%2B%2Bn5hPckAYOBIrQ%2Fk4cMVwGjmxulW25D0bKwIgPcEaFc5%2BrIaKqVAEvYj4Ipgk5cqXGpjLr3FAIr6zveoq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDH1taBadFqBoR8frPircAwfjssQLOuWw2Pw9oA2DKOjSPDPGp5ER7vI%2Fq%2FLIy84vvmciOSSwdpRDQHtQBR9Q%2BErnpOM%2FNoorylYEK%2F95jvbIYZhH3glxEy7G9P%2Fqmp7Sq6VC%2Bu6CgtsyWSmcR%2BIB1jImVp1ve9d47WkrWvTCB0OesTzkJLzn4H5CMJOLQyIhBCxDx0DlBJ%2B5JtJEj9bjbeW%2F7iiVOW%2B%2FnLhx2c1ZfZA4WSXfuRHhKe%2Fp%2BvJOQbqnwrYfQ%2FtpoNtdMj38SthHQH5RT9YXCuDNwuAy5IaIc9YkcqcL2ELY%2BuOss%2B9%2Bj72lv62D0q3zcHBm2flUksfnSKGNgmet%2BsElhweeW0iFk2BB2fKSf4YoFT%2FAZc%2FQJ2ZJEtzBk8mZ%2BqGYsRSdJrqQERSkTKGaTrUsUYZrolsf%2BNwtlPHU0gFU6KrORqqXcooSscWYFgCGBmw%2Fgce9neTBZqa5n4AQlyiALR2IdYwht4xoD0AAYQjVCifa%2B6BBGgCm8kZB2CFnH4HEYK88nvPLdRuYFbk3bOOzAaf44GMBBfE2EDV5k6Rq3YPKAzHbUb6sS94vxkCD8ZA9rEpbS96pFWQqY98ObL6QYSvfQfYblPnVomIOl8IZRK1JMHT1Cu6oIyyq7kIdgRzbS%2F98MMCChNEGOqUB3rcu1cZvT6xmTfNh2xBid%2FYdSITWEx7Y9tsbZEzzNNsscWzeHdc1L%2BkiQqHdrhXljrqpurP%2F1ndgQNC3aFXxTlpXUB7kDeZa19NNJKIWh80qa6STF1dlVpLk3mXfKkGIsmjGk7wif0Qkqifx3SIH2cVTu3%2Fk10qIaE3Z6WN5BMz6nqv8DjGwVJZY5NYigQS6z8P%2FfRYkRzqiJZa5F7NXhzFICsTg&X-Amz-Signature=f8aadaa2929bf95de939ab7ab41ff80cab4cd6ac1a7c35368fe02a76a00d730f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663OMNEMRA%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDjgGICGbgPLA7flJB0wKMh1Y%2FLiYVZONBzsf%2BfVckj3wIgEuxlU5pwEEdsrhgImb5hI8JNwuxR%2BaRqFRDA13fp39Iq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDEtHYlbf3VZ%2F3%2FzEDircA5q%2BCrVbSGNG64RKiq2ZS1reLjHi2p0ZIkBxq7DdzQGD5gEMWYBsSphvWwbqH3DsysRMVh%2FbpJyjeTPu65p4YIFiq4yudFJNI%2BdJmry%2FzrPEXYB02Z6ni6xwoX2SrlmlmQOtByVRqKBaPwB97l%2FrPwP3X%2Fe2dE8Jf8ieDIkMNAGptRw%2BFfUqFhC%2FJf5ConddbEbhwOp88NiQ32rxszIm1wETiIvV0HHbSwFPCH7vw9KDumKEE4EqLm5t4fjtkI6zlQY1YuigVL9nf2DjHchECAKdIwtw7JfRBiSZ5AnjWBSkNkQ23C%2FH05GByGq8Ghkd7U4oP6Zqg9CD3BD03fSAyN27TbwSZGZc4pFFn70x444R%2FxmKaMgtBWgM7X%2FmbVU3Ywi%2FH7dmoY6pTXKwJgBWSwkAcEb0nkmQawScaXAbZgianjvyB4%2Bqox9O522RrncK3p0GR7gxIfe7y5%2Bn5c7mHmgbM%2Fm9kzRtPTcOfnEWRqYt%2FwU3xG1%2BpIsMtDCmS0CQ4RUnOWqj0ij%2Bbj3ItQRamq393rpLLaz4UE63juhCdliw4YPKZb3VBEnFAigHz1gyfOob9L2%2FIzgOeNTnzMj0iDsgY6jl41mi0RMZvf37d2pHlO0%2FdDqKWtz3zkEaMMWEhNEGOqUBIo3aFLdpTH1vs2Zveq7wejGFRuaj9Iw5b%2Bs8u4mJU%2FQt8govnvi%2BP%2Fp%2F56BRTLHBtq8uOidyoIYlVTjPcPx3QNslYIPFPSjSkM36c693KlcJu%2FG1gBLx10ed8eJ0rYJyalDQzgSDHNhPCrwWVryT5TVmk8t7ZacGBG8%2Fxki4eU2rLP4GM3Ml7VXA%2BSTSmBW0waDEj9Pgq67ZoVnS%2B7tdIF9CBfNg&X-Amz-Signature=38de6c5bbf260d181deca7069937efaa972ce1151f82e39a02ae2dcf5fb197d9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PQTI2NZ%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2%2BDjrjBfS5aw9HcQvMTQX9nQfJp1zR6He5mpo4VfWiwIhAN4vz95V2DrlkZ7sc7%2BgB4K0L8ayvim2Qd9FBEFwjDWDKv8DCE4QABoMNjM3NDIzMTgzODA1IgwwZHccvc9OBY4iwKMq3AOG6htEK08CxdlfTVLg29ua9TS%2BwHjiI9LfwBvHKmqeryzKCy9huyntT%2BaL4D2GY55xCXzBSnc7AkteyG80n7LrgabMdXkH1A4uQogZ5prKbtnsjQahb43WIzZENjOIP7chPeRcvmysg32tW4KNIK9i1as2ZCfFJ7tI4GZK5QEhvVQpp90D9f2Rhylg2rN19Z4VGIeBAsHmcleDOYQo2wo6O3ZIkQmjHOguz8lIKoFkbomN7zbLMfglNtNqtxF38OpWQtNmTvu5sfSpC0jeL85bWPSqOebJJOwcguAnQ9IxaON%2FFh%2FLZIE8cIvJb%2Flw7YY52iJzZ2dJHWgegOulUtjGLy80tYNhmZ4HiaW9PQekJRT%2FOKTv7VN4smM2u4ST64EEBgMWlKLnV2ZlPn8Nm%2Ft6HjYNHDlcmcP0Et0lBKyHnXfBJvsWzlKefxawXubZOAB6Iejh60EtuJzmiw6RSqUW05rZvIxCqykZOzD7s1v8dHKIS35dNJNAoCmvRHAg7NIfooclZajcEovodS1pJRE5NmDoBzqGzSVjV7t0ZKsyik9l1dWevrKyY7edDIK08%2FM05k%2BG6gFrEh2lySmWljoczbwwstmtxIAicRfDZUKsDx26w8e%2FeTtguIRhyDDRg4TRBjqkAeIp0N2jj%2F48whzrHkZkTfkIzElg%2B911iv1tgPZZbkYtE32A8Ie56ldrqYDioCxz8pxNJwDnYp9tBZPOL%2FXDBEs8owy4Fh3vxXkHEiQfuPDBWBF6s%2BFgemaYOm5mhAq%2BBB76N%2FHKuHvC4MEyU3ezQUBtlKkI8iCTHhXcgTKDjNp6mTv3jsVhxe42Dm7kI%2BkVBFeH3aVNze%2BnFQh0m2eplGmauiHL&X-Amz-Signature=95080d0249dd2bc620eef74cd5a78322f56eec458f00b6b98c224c8b88998155&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PQTI2NZ%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2%2BDjrjBfS5aw9HcQvMTQX9nQfJp1zR6He5mpo4VfWiwIhAN4vz95V2DrlkZ7sc7%2BgB4K0L8ayvim2Qd9FBEFwjDWDKv8DCE4QABoMNjM3NDIzMTgzODA1IgwwZHccvc9OBY4iwKMq3AOG6htEK08CxdlfTVLg29ua9TS%2BwHjiI9LfwBvHKmqeryzKCy9huyntT%2BaL4D2GY55xCXzBSnc7AkteyG80n7LrgabMdXkH1A4uQogZ5prKbtnsjQahb43WIzZENjOIP7chPeRcvmysg32tW4KNIK9i1as2ZCfFJ7tI4GZK5QEhvVQpp90D9f2Rhylg2rN19Z4VGIeBAsHmcleDOYQo2wo6O3ZIkQmjHOguz8lIKoFkbomN7zbLMfglNtNqtxF38OpWQtNmTvu5sfSpC0jeL85bWPSqOebJJOwcguAnQ9IxaON%2FFh%2FLZIE8cIvJb%2Flw7YY52iJzZ2dJHWgegOulUtjGLy80tYNhmZ4HiaW9PQekJRT%2FOKTv7VN4smM2u4ST64EEBgMWlKLnV2ZlPn8Nm%2Ft6HjYNHDlcmcP0Et0lBKyHnXfBJvsWzlKefxawXubZOAB6Iejh60EtuJzmiw6RSqUW05rZvIxCqykZOzD7s1v8dHKIS35dNJNAoCmvRHAg7NIfooclZajcEovodS1pJRE5NmDoBzqGzSVjV7t0ZKsyik9l1dWevrKyY7edDIK08%2FM05k%2BG6gFrEh2lySmWljoczbwwstmtxIAicRfDZUKsDx26w8e%2FeTtguIRhyDDRg4TRBjqkAeIp0N2jj%2F48whzrHkZkTfkIzElg%2B911iv1tgPZZbkYtE32A8Ie56ldrqYDioCxz8pxNJwDnYp9tBZPOL%2FXDBEs8owy4Fh3vxXkHEiQfuPDBWBF6s%2BFgemaYOm5mhAq%2BBB76N%2FHKuHvC4MEyU3ezQUBtlKkI8iCTHhXcgTKDjNp6mTv3jsVhxe42Dm7kI%2BkVBFeH3aVNze%2BnFQh0m2eplGmauiHL&X-Amz-Signature=5fe2213f123d40dde3e034e2877c89846213feb10517e9ad0d00c1f67a164946&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

