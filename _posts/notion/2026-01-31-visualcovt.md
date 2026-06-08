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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGPHPB7J%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050307Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2BEuWW9gx3Cm7yStSf9m7YoXT%2BbCIUN72wCHm51ju2ngIhAPYfgmGW1e7idiTUIBrASpjO92IGrTX6uZ4zz9sypi5PKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwmyVtER05zRBler40q3ANNXR%2F3cVSdOp7tBtY%2BxaMOUqtxEECaf%2BZkLKxKWsUpy5lfMEm9EdW8GTVAybcKZPKiUCWo18zFb%2BuLTARAFeBDEbViHW5ZfN3n6E4AqD2w%2FE%2BoJUgS21CgYGd5U2wB%2B%2FFqu3Z5uud%2ByhZLyCpMwvBVKX60h%2BI%2BYtDwBOi7QvGHuvMb0P6zcsX%2FLQE1EyCMTrvv%2FAYslwQGHxawqMmkFGOlFinhmuEwkAMJBKTVi65vYWL3k0es5eKagjpZFYQBf%2Fuf3BHh3ZpkRfRur2IESgICSlEDzEFkgr5Wa87DTXYFSycPlngAptSKHPcx%2FFTM8wtEf7cE6RD8Yf0OFqbYOZEeNqkHTleIb1ZAdEyowWrOw5NsClh%2FjNi3MGdf2hEcvn%2FXAxva%2BpzAc1l4s3KifR6%2B%2FquR8xwnMdaKKke8G80xaXyPwbKREzwwbJypnHpBqzfdjUeMGFGWndxp9f66EajMKmEN7kLdMMtZQ0vEYeTEAE6Xj4eROqnKwCdcC2nlsrj%2BczP00WiKeaWu2m0m%2Bv6%2FCUs6a8bp9cgrYhyFZObLH%2FmMkTIPO4SgoJZM%2FgkidZDBK7rQjLWG3qyQjPhOwyZ6GG3G48Xi79QHlkDvoK84FmJGgm%2FeJNoiAubdKjDsjJnRBjqkAU0xo5bbQtPvBffweZFA1Vh3IV1Qh%2B7nB9LNj0yQYo4QyCirl2zMtprlM47gF79rqsVnxqnBJ9sub8L4j8QxB4mFgxPgy482fiCi4UH2%2FzDNMzbJy%2BYPejiCrD37uOdK3pEpS9oh1vZW3QXBFgZ8HDOpEVbVmydYWrzda0vLIEOkRqaa2kEvYWrVIzH857KUiKgi2bw7KdcHcVZ%2FlKYqtxTmQIGk&X-Amz-Signature=98207dfa1456e73fc15fe83aa41561464b2ec9993807a195680937c2452c8b47&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGPHPB7J%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050307Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2BEuWW9gx3Cm7yStSf9m7YoXT%2BbCIUN72wCHm51ju2ngIhAPYfgmGW1e7idiTUIBrASpjO92IGrTX6uZ4zz9sypi5PKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwmyVtER05zRBler40q3ANNXR%2F3cVSdOp7tBtY%2BxaMOUqtxEECaf%2BZkLKxKWsUpy5lfMEm9EdW8GTVAybcKZPKiUCWo18zFb%2BuLTARAFeBDEbViHW5ZfN3n6E4AqD2w%2FE%2BoJUgS21CgYGd5U2wB%2B%2FFqu3Z5uud%2ByhZLyCpMwvBVKX60h%2BI%2BYtDwBOi7QvGHuvMb0P6zcsX%2FLQE1EyCMTrvv%2FAYslwQGHxawqMmkFGOlFinhmuEwkAMJBKTVi65vYWL3k0es5eKagjpZFYQBf%2Fuf3BHh3ZpkRfRur2IESgICSlEDzEFkgr5Wa87DTXYFSycPlngAptSKHPcx%2FFTM8wtEf7cE6RD8Yf0OFqbYOZEeNqkHTleIb1ZAdEyowWrOw5NsClh%2FjNi3MGdf2hEcvn%2FXAxva%2BpzAc1l4s3KifR6%2B%2FquR8xwnMdaKKke8G80xaXyPwbKREzwwbJypnHpBqzfdjUeMGFGWndxp9f66EajMKmEN7kLdMMtZQ0vEYeTEAE6Xj4eROqnKwCdcC2nlsrj%2BczP00WiKeaWu2m0m%2Bv6%2FCUs6a8bp9cgrYhyFZObLH%2FmMkTIPO4SgoJZM%2FgkidZDBK7rQjLWG3qyQjPhOwyZ6GG3G48Xi79QHlkDvoK84FmJGgm%2FeJNoiAubdKjDsjJnRBjqkAU0xo5bbQtPvBffweZFA1Vh3IV1Qh%2B7nB9LNj0yQYo4QyCirl2zMtprlM47gF79rqsVnxqnBJ9sub8L4j8QxB4mFgxPgy482fiCi4UH2%2FzDNMzbJy%2BYPejiCrD37uOdK3pEpS9oh1vZW3QXBFgZ8HDOpEVbVmydYWrzda0vLIEOkRqaa2kEvYWrVIzH857KUiKgi2bw7KdcHcVZ%2FlKYqtxTmQIGk&X-Amz-Signature=13dc7616094d43dc8fdaf01a58d92081a60f914b12a5122fedbe1c71beaf61c4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGPHPB7J%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050307Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2BEuWW9gx3Cm7yStSf9m7YoXT%2BbCIUN72wCHm51ju2ngIhAPYfgmGW1e7idiTUIBrASpjO92IGrTX6uZ4zz9sypi5PKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwmyVtER05zRBler40q3ANNXR%2F3cVSdOp7tBtY%2BxaMOUqtxEECaf%2BZkLKxKWsUpy5lfMEm9EdW8GTVAybcKZPKiUCWo18zFb%2BuLTARAFeBDEbViHW5ZfN3n6E4AqD2w%2FE%2BoJUgS21CgYGd5U2wB%2B%2FFqu3Z5uud%2ByhZLyCpMwvBVKX60h%2BI%2BYtDwBOi7QvGHuvMb0P6zcsX%2FLQE1EyCMTrvv%2FAYslwQGHxawqMmkFGOlFinhmuEwkAMJBKTVi65vYWL3k0es5eKagjpZFYQBf%2Fuf3BHh3ZpkRfRur2IESgICSlEDzEFkgr5Wa87DTXYFSycPlngAptSKHPcx%2FFTM8wtEf7cE6RD8Yf0OFqbYOZEeNqkHTleIb1ZAdEyowWrOw5NsClh%2FjNi3MGdf2hEcvn%2FXAxva%2BpzAc1l4s3KifR6%2B%2FquR8xwnMdaKKke8G80xaXyPwbKREzwwbJypnHpBqzfdjUeMGFGWndxp9f66EajMKmEN7kLdMMtZQ0vEYeTEAE6Xj4eROqnKwCdcC2nlsrj%2BczP00WiKeaWu2m0m%2Bv6%2FCUs6a8bp9cgrYhyFZObLH%2FmMkTIPO4SgoJZM%2FgkidZDBK7rQjLWG3qyQjPhOwyZ6GG3G48Xi79QHlkDvoK84FmJGgm%2FeJNoiAubdKjDsjJnRBjqkAU0xo5bbQtPvBffweZFA1Vh3IV1Qh%2B7nB9LNj0yQYo4QyCirl2zMtprlM47gF79rqsVnxqnBJ9sub8L4j8QxB4mFgxPgy482fiCi4UH2%2FzDNMzbJy%2BYPejiCrD37uOdK3pEpS9oh1vZW3QXBFgZ8HDOpEVbVmydYWrzda0vLIEOkRqaa2kEvYWrVIzH857KUiKgi2bw7KdcHcVZ%2FlKYqtxTmQIGk&X-Amz-Signature=d7c1227bbb38c4e4576711e74d39599f103ba9f3400e606193ace9ae39fc8288&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGPHPB7J%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050307Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2BEuWW9gx3Cm7yStSf9m7YoXT%2BbCIUN72wCHm51ju2ngIhAPYfgmGW1e7idiTUIBrASpjO92IGrTX6uZ4zz9sypi5PKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwmyVtER05zRBler40q3ANNXR%2F3cVSdOp7tBtY%2BxaMOUqtxEECaf%2BZkLKxKWsUpy5lfMEm9EdW8GTVAybcKZPKiUCWo18zFb%2BuLTARAFeBDEbViHW5ZfN3n6E4AqD2w%2FE%2BoJUgS21CgYGd5U2wB%2B%2FFqu3Z5uud%2ByhZLyCpMwvBVKX60h%2BI%2BYtDwBOi7QvGHuvMb0P6zcsX%2FLQE1EyCMTrvv%2FAYslwQGHxawqMmkFGOlFinhmuEwkAMJBKTVi65vYWL3k0es5eKagjpZFYQBf%2Fuf3BHh3ZpkRfRur2IESgICSlEDzEFkgr5Wa87DTXYFSycPlngAptSKHPcx%2FFTM8wtEf7cE6RD8Yf0OFqbYOZEeNqkHTleIb1ZAdEyowWrOw5NsClh%2FjNi3MGdf2hEcvn%2FXAxva%2BpzAc1l4s3KifR6%2B%2FquR8xwnMdaKKke8G80xaXyPwbKREzwwbJypnHpBqzfdjUeMGFGWndxp9f66EajMKmEN7kLdMMtZQ0vEYeTEAE6Xj4eROqnKwCdcC2nlsrj%2BczP00WiKeaWu2m0m%2Bv6%2FCUs6a8bp9cgrYhyFZObLH%2FmMkTIPO4SgoJZM%2FgkidZDBK7rQjLWG3qyQjPhOwyZ6GG3G48Xi79QHlkDvoK84FmJGgm%2FeJNoiAubdKjDsjJnRBjqkAU0xo5bbQtPvBffweZFA1Vh3IV1Qh%2B7nB9LNj0yQYo4QyCirl2zMtprlM47gF79rqsVnxqnBJ9sub8L4j8QxB4mFgxPgy482fiCi4UH2%2FzDNMzbJy%2BYPejiCrD37uOdK3pEpS9oh1vZW3QXBFgZ8HDOpEVbVmydYWrzda0vLIEOkRqaa2kEvYWrVIzH857KUiKgi2bw7KdcHcVZ%2FlKYqtxTmQIGk&X-Amz-Signature=1e34afc042acb92c068705d455d2eb46af4c30bb44cb53bda6a981a75ba298b0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667N5ITBSI%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCE4sAwTYHHOwZE2D0kbj%2BH%2BChk7WjWm9YJ6XyuZdhYywIgV%2BvnlXBPdja8YVVVtRGof%2FExzXESIY2ET5dPkD04LVYqiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOFMmRDBrooXberXRSrcA0KWgseUHpBlvrVxqCdaAhC4EPAebY9tmJ%2FZaRC2mD9qtZvvwH6HyhfFk5ANWsAXT%2FqCSFG2KSBAUegngC3f43da8jjDzh1vGGnxb3FA29HRaPbWy%2B6XLZEwnko%2FuT37lRilyjf9Rsrfh%2FhIctEXpKI0nUj%2Bjg8t1s6lRuxbSU2DvDx8L9DzBcJEN9eD5f9h7UvcM621IxFHosctml0Lbftd1%2BmweBIuy3%2FZ%2FYBh4SjZPV4IrRnFSt5%2FXYBHo8UsXuuVTbaYShFvN6IY83wpJ6%2BmTyO4mDMIOQqa%2FiV8vt96wW8A6ijJYLgN2zwgQnw95%2FbNDPWM4ZMnri7QOu0VMR3hvsqfhhQ88SI4UKkqHsGrm5SFJAXa3L8buJCJnKbZ7uF79q9tj9iP%2F2GUqv%2Bp0K5GbwYY7GENvNxuEPv0zmbakM1EsxK69IshrTXuwatmBKghnB7Jo6YQ9Dku0m9OOuGKDLKA%2FblJ0oqFYXtkaj%2BIspEqdwtHI1MZ1I6lwJ4Z7E1puW4OCcyH5lMgn%2F6oqpI5Ub6w%2Fr3Y8o5%2FveA8GuKXH3CV7LpTu0xR8KMipgCuajXIrbRSxJfIp4tAe%2FEeySIWdtJIP6IL%2BOYe1cB7ccTdPwYyzSPLigPgPIzqMIiKmdEGOqUBpflt2OA%2Bw56Y%2F%2Bbhs4oVri2mXndvclpntfgMD0mtXWRebUyjm8GDXwBrmP6RwKRHuE91x3objBw108L7dyCyiCUG8px8yqqn6X6ShxiVtMSjmPxcpdl95L9tid%2FfgOyljxOddlX1csTvaHsv1GTtvTAi0BdigygfZHfUHSdJ04PzNuKrKmYhGsuyc89EYKyJyFkgEIpVb3QzijI%2BX5vyPByf5v5u&X-Amz-Signature=f47c385d058bf066e4582a6a44e55699420271828e8afcd6d640e2bbda7bb38c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ZP2VTR3%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050323Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIANgr7RpphXd6ofZyAg2MJFaxzNVt%2F6FGUl%2FqeRYKeuNAiEAv4PiectGUl%2Fh5cCwo%2FitrjHHjvWmCqh3IbvLe%2BHj9e4qiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLzRQ7sECDF3a8aYEyrcA1tKPgyGhFDmKmJHScDKH3gyX7c9SOZ4Xi8CcmsuNtN0eNmIlJnhuQmSzEqc5T%2Fk4ls56m6FU1xKP7AguY7DI%2FLH%2BfNfUzE5St9TROdPn3%2BJfx3zXyxD28pECZul%2Bf3RpcFe8wGrfpqs175aCDnwse%2Bzkyn2NVZEGc6hcMeRPUtNu5mIjfoztVsAnS6Cix1AAsNwo%2BycwENo5IsbB%2F7OkbozaZEDLec7RifWyNjOksjuYhWXk1ytjkMAH2sGCvlvzC8fUWcL59qQ4viHsxogMy6ZquFnRmDV0Tmku2GYSa%2Bp5lqRrrsvPFYHkqVw%2BZ7Ru6m3xnXFhxGTvq9naWW3tt8PbpwXHIDwBq05U%2BIAjZvhy%2BgOuZ5Z7gXxkC%2FZpwO%2FNaIEGhhCU5LBB9zOrjVU26W6dyq8bTgJe6Vv7SOkyH6t2LanhMzgYoe8CWkttD4yi4SLJ%2Fn5m7mZkX%2FYvclV0cF6qOjDW%2Bc8np5BHYr6W2KPDI3K8vBErKTxk9vYtu1HpvOoGLdCOXLSyXvard5am2sPFaBqhUtkPKwcAs3p55%2BKhiPmRIYq8LrWe24%2FDAOxKvhBP%2BHpEeYoaL6psrOjzkjI9i%2ByUdVtXmacHHAERwbpuyG1LE1pnDTu2HYTMKKKmdEGOqUBPUHNLMk2KwfubyqrMJTB9Sdq44ZtnD%2BPUa9gGzE1LbHmhBioVQNQYY9SWNEdVhfROrD8iPN67tS%2F%2Bx%2F6a%2BxAYfC20GACH4MSt6%2Bm7vcqKsEl%2FoYgCku6pm8Ljs%2BUxGR6joJ4BEEHcnEfDEyM1JkkGuYZtggj0%2BoKZeKYOC4Hd1NR%2BRXk2X3%2FbpjaMxM8oZopsxfLNKCSd%2Fd%2FVxtNhnqDgdCbOS2%2B&X-Amz-Signature=772e0fa7035d10547b6f23441b823109d56761700d906b77a580dae06d298a54&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XIBSYHVU%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050326Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICWgkjsW9OFZwNfZ9RcE44Oz%2FBc6%2BovfBTQNFkxmVuW5AiBj7fYEb0e8ppYqPCV9L7vDx5sbdhdpi%2BNUI2itj%2BoCUSqIBAit%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM087T9eJ5wGoCmxwqKtwDjjktq5QbbIgi7GxDeoUV6GDEBemLoa4tTXGiS1IMXSCdzIAuUT%2Belc7K%2FAyWiXOTezy1zd4FzJR36GdRd342TPFjIGd215j7niaR46qvX8sQioAHWlf770fn5nwwXNUN7GmhEAjNwYNt92adxofQvjEA6b20q25nZ2NLn6bSyJBRBZqG2D6tA5CGS1dt%2BOqytbsrfsjnbDXtKkEemzrwRQAeNnhTDeZ%2F0PNrwQifBIFCpMGFhmXObsR%2FZblM8k9wNKYb%2FSU4AkfDwRtzMjYwHGLbJQae5LP7GuOC00xzoEAQtlGjLxjf7Ue9mlIXy9S6m61uMKTm3%2F3226Yd5uX%2FVgH2ftBQw5%2Fh7COOVNYXGoac41jro9dGMZAS0QCfmKK%2Bxe1QPe9VzvL11gB3e1%2FDuQ2jE5UfAh72RNNqmYnsFGZu6KhYP9V%2F80YUeMVzC9LWzevnAqrkUzFFyxpLw9mAwkiPm8jJcVJGlDgQqOUdTjwQS3%2FELKFazUmEjN228AkUd7993bGKq4xppyE7NSutZW61h3Y4aqTOCYz%2BnYehEdx%2BH4ufEHiNU%2BiGPYw3hMaNU4XYlyebTf9L%2F%2FTnVgpx6akxr9NeVpQPqMKE78Sn0Yj8M%2F3%2BiraNdtHkCccwuoqZ0QY6pgGR0EiFMcaWAsXC6WIJD58zttTBXJgAy3FFfrfiZJ2A0ywdNVpAt3faFhnuHy0LtURWlzbaDBLu0aaj3BEUxLffP4UEwJYkOTCKPToNDmw%2B5cZP%2B94OwiAENvfQ7h%2B0nb4izHRXrIb6cGmVPG0taVIrxSGoicJflOCJ2T5O8Cq1v5hTbJITMHNWnoaBtSdt2JVALfROe%2FSMEwt3SMcpz8800f1rhiXk&X-Amz-Signature=50ddb09be8e77d16b24555091b6edc2692ff9b21c9c306136332250307d17dc3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YPMOWAE5%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050326Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCb0EzB%2Fk2ia8k%2FXluOm80vmlyOwEz7P2jZWlYakCuFGQIhAPy9VzdhwZWdvMJVL8veStNo7QZ5OEr64V13XOCgtoIrKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwPAF0jZamNZuI22noq3ANYCPce5oa6zVpC67fJtdvwEvO9Dmxbj1bGHkp7%2BzIjlueFBA0wViXkVBZeXFSW%2BLnONpq4v%2FKR38i4vQeaocpSA2ViBU8HRTcd%2FPFO0W68s6b0MQZjhbU4LX4VoaCoemv4dE4vYfF9Ul87UHs7kAj4wVt5F4RDUUEjRJv10bJI7o1q373Ra5YnugztaGjSWHmwr1myQz3Aj6%2B169QTW5dU5%2FKgIoR7KebOyoh7zVXzATUQjOaM%2FFRd0IqPVP4YHOwnxmLJ7Uf7WXAf2WBbTA5N7uMqbagJ32bbdRYg43AbauM%2FXX3CxHylm1beWrtX%2BaA5QNmpHRbisjZTx%2FcaQDru%2Fg5Ck%2FcOYgSPLdof0rIHGFCt0FogG%2Bfbas5y57WN2JJspdKrgE6cpDpHLJtzVyoAvZm1sG9bfB1%2Fx5iV7iI3wlxH2kxikzC9u5D7umvJYQ2hUsRnZRKC3GlQFrV3ckweqZO8Gx4PGjiI4trhbONz%2BQD1gR%2Bw%2BWzDv8uYbnPN1D42i3ra0rlIB%2BjcwQT%2FAxcEquShOJJ7Miyg74muhutwabRdG809aW3u7a5LyryL47s9CUSYEtrUfIVX3CxyybMa3UbDUBkmhkfpdB9fMJm%2FZyxGCUeSvZ4X8LWrSzCxipnRBjqkAVEO9uf%2ByKCBFNIgDrlOGrrsjPuQ5zJYaH1B0%2Bdic4c545pfz%2FVONu5jmCoI2s4rqP1D7KBO5CKL0lmDejvBRDJfMoSFtXFBQnEnLn1DBY4NaFvRTGwhxAO7DbiMeRxVeZFPzmUxVfH8qptU%2FfotsKmafetkMs4aexe44d5sQT8Byks%2BlC8j6kY668bkBpbozjPUISjOolUGNeMZBIDjeGMrpYI9&X-Amz-Signature=f393fbd3e5b0896f248aaa4f4512753ba7acd42eba9ae0c4558b2bb5e127ae8b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGPHPB7J%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050307Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2BEuWW9gx3Cm7yStSf9m7YoXT%2BbCIUN72wCHm51ju2ngIhAPYfgmGW1e7idiTUIBrASpjO92IGrTX6uZ4zz9sypi5PKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwmyVtER05zRBler40q3ANNXR%2F3cVSdOp7tBtY%2BxaMOUqtxEECaf%2BZkLKxKWsUpy5lfMEm9EdW8GTVAybcKZPKiUCWo18zFb%2BuLTARAFeBDEbViHW5ZfN3n6E4AqD2w%2FE%2BoJUgS21CgYGd5U2wB%2B%2FFqu3Z5uud%2ByhZLyCpMwvBVKX60h%2BI%2BYtDwBOi7QvGHuvMb0P6zcsX%2FLQE1EyCMTrvv%2FAYslwQGHxawqMmkFGOlFinhmuEwkAMJBKTVi65vYWL3k0es5eKagjpZFYQBf%2Fuf3BHh3ZpkRfRur2IESgICSlEDzEFkgr5Wa87DTXYFSycPlngAptSKHPcx%2FFTM8wtEf7cE6RD8Yf0OFqbYOZEeNqkHTleIb1ZAdEyowWrOw5NsClh%2FjNi3MGdf2hEcvn%2FXAxva%2BpzAc1l4s3KifR6%2B%2FquR8xwnMdaKKke8G80xaXyPwbKREzwwbJypnHpBqzfdjUeMGFGWndxp9f66EajMKmEN7kLdMMtZQ0vEYeTEAE6Xj4eROqnKwCdcC2nlsrj%2BczP00WiKeaWu2m0m%2Bv6%2FCUs6a8bp9cgrYhyFZObLH%2FmMkTIPO4SgoJZM%2FgkidZDBK7rQjLWG3qyQjPhOwyZ6GG3G48Xi79QHlkDvoK84FmJGgm%2FeJNoiAubdKjDsjJnRBjqkAU0xo5bbQtPvBffweZFA1Vh3IV1Qh%2B7nB9LNj0yQYo4QyCirl2zMtprlM47gF79rqsVnxqnBJ9sub8L4j8QxB4mFgxPgy482fiCi4UH2%2FzDNMzbJy%2BYPejiCrD37uOdK3pEpS9oh1vZW3QXBFgZ8HDOpEVbVmydYWrzda0vLIEOkRqaa2kEvYWrVIzH857KUiKgi2bw7KdcHcVZ%2FlKYqtxTmQIGk&X-Amz-Signature=63f15fb534cba9a82108b2e940993b8ba27117e4afa2df709504e953aa134e65&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGPHPB7J%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050307Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2BEuWW9gx3Cm7yStSf9m7YoXT%2BbCIUN72wCHm51ju2ngIhAPYfgmGW1e7idiTUIBrASpjO92IGrTX6uZ4zz9sypi5PKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwmyVtER05zRBler40q3ANNXR%2F3cVSdOp7tBtY%2BxaMOUqtxEECaf%2BZkLKxKWsUpy5lfMEm9EdW8GTVAybcKZPKiUCWo18zFb%2BuLTARAFeBDEbViHW5ZfN3n6E4AqD2w%2FE%2BoJUgS21CgYGd5U2wB%2B%2FFqu3Z5uud%2ByhZLyCpMwvBVKX60h%2BI%2BYtDwBOi7QvGHuvMb0P6zcsX%2FLQE1EyCMTrvv%2FAYslwQGHxawqMmkFGOlFinhmuEwkAMJBKTVi65vYWL3k0es5eKagjpZFYQBf%2Fuf3BHh3ZpkRfRur2IESgICSlEDzEFkgr5Wa87DTXYFSycPlngAptSKHPcx%2FFTM8wtEf7cE6RD8Yf0OFqbYOZEeNqkHTleIb1ZAdEyowWrOw5NsClh%2FjNi3MGdf2hEcvn%2FXAxva%2BpzAc1l4s3KifR6%2B%2FquR8xwnMdaKKke8G80xaXyPwbKREzwwbJypnHpBqzfdjUeMGFGWndxp9f66EajMKmEN7kLdMMtZQ0vEYeTEAE6Xj4eROqnKwCdcC2nlsrj%2BczP00WiKeaWu2m0m%2Bv6%2FCUs6a8bp9cgrYhyFZObLH%2FmMkTIPO4SgoJZM%2FgkidZDBK7rQjLWG3qyQjPhOwyZ6GG3G48Xi79QHlkDvoK84FmJGgm%2FeJNoiAubdKjDsjJnRBjqkAU0xo5bbQtPvBffweZFA1Vh3IV1Qh%2B7nB9LNj0yQYo4QyCirl2zMtprlM47gF79rqsVnxqnBJ9sub8L4j8QxB4mFgxPgy482fiCi4UH2%2FzDNMzbJy%2BYPejiCrD37uOdK3pEpS9oh1vZW3QXBFgZ8HDOpEVbVmydYWrzda0vLIEOkRqaa2kEvYWrVIzH857KUiKgi2bw7KdcHcVZ%2FlKYqtxTmQIGk&X-Amz-Signature=5963dc10d091ac29fe385747548dbdfbc710b2bcda495a90d0decc9ab3f35a7f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XR2L3NDB%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050330Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDPlBZSe5Se15mU9O%2F3WH%2FDCPXMTdiF%2FluFShRAESi9%2BgIgNcN41wHKYtJWPn1xLtl%2BeWUMi460RG6FS2Q3%2FCTmWO4qiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCbAE5vz7Ud82%2BnYkSrcA%2FTE7WV%2FjnmFvftiGXM%2FLzZPkAsWeaWfimaEZ3ZhENeWIkw%2BIo9VYTmJ1RP89CAnySZv3f0%2FalNkbL7%2F2DBbTMzCM4Z2ePxbcLfFmeHv7GjSIcA73WfzwETHx4pvY1H%2FraZk%2FRuHlsj6IJgJyRmE3FpppUpP3NB0eI6ojMDYMiMoVFZO2UAat%2F0y1PJbVDQ3LcA5FG56nObrTsae9IPMURIIfgsmuAY04AReVwJbb7c%2BYPCq30JWxWUWH7SCnh4vusmwlpfkoxbjgneYbnxUd0kky7sw90nCndQSofRUDI6dZPneLcwet5hLZ%2Bh8lM4Ud6wxHmPvxKSV406QC2AdmHXNVfo8T53HI5%2BSkM6RYbHR9IOyjv2C6P9RX3MWPrX8byAkMo9wlghbUkiGq4mPlnA3xwEXtZFpsGsl0wkcLvo2U4uqNCqofLXEtaRyuxls4MivUihLRNx4fOs46v%2Foe%2F40V6CP6IARvkxbIDy8wHSoNLf3me0Z8kiMxigXae4RM5wZs2NrabShfmZlqhNnh%2FKshjMuyKaLfSZ9OZBguztMs9QE4xpWXve4cdzX1h3NcJtXPtLEruogr%2BwsmkVdBM4jKQOCAocUwJpjQV48RFR5T74qF1E3Zb6pOlUXMJaMmdEGOqUB63JXPMNOs5IclEqhYn36Y3ubWf3nLlY0FDu%2FTsHdYsb%2BrQIib8jNx3u%2FocA4wiyZ%2BDKNHqph%2BS3S7ck74Sz59YrBF%2BRXRpMyatzBC2yDGBjaFYDT6m61FWvA0i1n%2BdNpWrMm4PgSdGsGOyVTsYeZsuY8HHAAj%2B41OZsYXrIJU3wpDVqV8aZpNdccRiRDaqpyYak6%2Bg4XbYJyzjvL%2BZE%2FhDtk9g7v&X-Amz-Signature=13e8b96e6789e72a1c2d86b73e8a306afea007699e038c5de97793874f953fd3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGPHPB7J%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050307Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2BEuWW9gx3Cm7yStSf9m7YoXT%2BbCIUN72wCHm51ju2ngIhAPYfgmGW1e7idiTUIBrASpjO92IGrTX6uZ4zz9sypi5PKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwmyVtER05zRBler40q3ANNXR%2F3cVSdOp7tBtY%2BxaMOUqtxEECaf%2BZkLKxKWsUpy5lfMEm9EdW8GTVAybcKZPKiUCWo18zFb%2BuLTARAFeBDEbViHW5ZfN3n6E4AqD2w%2FE%2BoJUgS21CgYGd5U2wB%2B%2FFqu3Z5uud%2ByhZLyCpMwvBVKX60h%2BI%2BYtDwBOi7QvGHuvMb0P6zcsX%2FLQE1EyCMTrvv%2FAYslwQGHxawqMmkFGOlFinhmuEwkAMJBKTVi65vYWL3k0es5eKagjpZFYQBf%2Fuf3BHh3ZpkRfRur2IESgICSlEDzEFkgr5Wa87DTXYFSycPlngAptSKHPcx%2FFTM8wtEf7cE6RD8Yf0OFqbYOZEeNqkHTleIb1ZAdEyowWrOw5NsClh%2FjNi3MGdf2hEcvn%2FXAxva%2BpzAc1l4s3KifR6%2B%2FquR8xwnMdaKKke8G80xaXyPwbKREzwwbJypnHpBqzfdjUeMGFGWndxp9f66EajMKmEN7kLdMMtZQ0vEYeTEAE6Xj4eROqnKwCdcC2nlsrj%2BczP00WiKeaWu2m0m%2Bv6%2FCUs6a8bp9cgrYhyFZObLH%2FmMkTIPO4SgoJZM%2FgkidZDBK7rQjLWG3qyQjPhOwyZ6GG3G48Xi79QHlkDvoK84FmJGgm%2FeJNoiAubdKjDsjJnRBjqkAU0xo5bbQtPvBffweZFA1Vh3IV1Qh%2B7nB9LNj0yQYo4QyCirl2zMtprlM47gF79rqsVnxqnBJ9sub8L4j8QxB4mFgxPgy482fiCi4UH2%2FzDNMzbJy%2BYPejiCrD37uOdK3pEpS9oh1vZW3QXBFgZ8HDOpEVbVmydYWrzda0vLIEOkRqaa2kEvYWrVIzH857KUiKgi2bw7KdcHcVZ%2FlKYqtxTmQIGk&X-Amz-Signature=ef8e01b9f66ce549d71b342d933bec36a7130a6aac68c8486fc3fee3c38f755e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YYWRLEA7%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050331Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDkMsY2McefcY%2B%2BNmY3pH5YaecO8OI5D%2FuMVwpQYLGbhAIhAO43ToBWxvSMW%2BzFxi8SDEqlYZHmiScaaMqc9iVsSquUKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyRJ5JhpG8P2bSbQ%2Bkq3AMqxPcpWgOb4wRoVRz4SYGrML1MJQT4TIl4Ic%2FSdk42mnnfoChn7c5LlbTY0oLI6neZReOhB0hIJN8YMDO6tJGzfHDhL6zasgvrO1Tyw1IKtgD2jowKu74ftizoo%2FeSqF0vegKt1zLWpkOtWxtroGj5oIQMEeTELNL59l71ubiLDhSv75e2eU7C6QT8PQeCxYrzi187OgcWxh%2BTfnL9OMHo0xjJ6gzzsIOo5e1aPpRYXkBZeZYzg3u0BlJhVdtrwY02L%2BefEG2AmNCFerD4kQFS7UEmSNY8AEVBkWlxcayIPSGI0oZyVPNnRFDpGja4fR3BozZdBk%2FzdfHtBICqORQNaiI3Cc3a%2FrGIGSypTnqMcxw26NfcaHNecqlMXUBLgWnxxBfpVHwFgCmvN%2FQo%2FXCfUCzPFhyUtzj8%2FkAuiQWPe3NOxBnV4pCom7NkuLKl2bvoTjiE%2FFvqpa%2BO%2Fz0A1KuZRlqkCOwUjTCw9UZ8ekVAZ2DlyMMgfxJ8VaIbqKCIuBR33JExJsH%2FtWdEGNysz%2BnJPGLaZZLMQyMxxxMgZC9l3JncJt8x390tLKYoGb9pS1kV4RYsZEhlRYP%2Boeohrhh3RZFLz5cLC4U511ZlMAMFi%2FpFZ0HhkxXoLA0CDTCJipnRBjqkAajjM%2BW00h0rSWrBuFhkokHQcy%2B%2BEDbQ%2B0%2F4pFKd9I5nJH2r9iUUQMOu0Jck0DATeUx6LuzHivTJKDd9iSS68HdEWfny64Egeo%2B859RFWlIoPyK7Ioknti9fA07gw%2B8PAYYxBj8hHpbhqUCWegp0ri%2By%2FVed9kg0DBMT97TQc3ddbLNf5yuwV5gSmQ%2BH4yJpordDnDJ%2BeAE7OjLEmQ8NQbl1J%2B6J&X-Amz-Signature=f7d78d8cbee94992981c2e87bd83b86d2caee4d735fb4e7d8bcdd2b3c5ef9431&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VVJCINUU%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050331Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCKFR2St666%2F7SjoowxIUKuLe%2Braj5PUl6vjGm5WuF%2BjwIgFBMuBhCDyAtbcqwJIl0V0VP1PiMI4zQJG9hyncVgKi8qiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCWWPCCL%2BmjgXp2HxCrcA7V4KBFbiLIyy4RpXb6ElbQCKAsBMLAGT%2BpI1CANs1z9W0CXmZVhUC2IRLG7WZlXqDYchvBwpatFtWPPg5t1qPjbIpZ9GP96rTSKKXrUcPE%2BvJOnFoaGkm3UTBQQgNI17e2MBwxKwyH9qDWTgW1mNMTMKnwYprxUxKimcyGOD8nLVAdqpHKu8FsYH432Uhe8ynVwxB4rlIGORzQ4Z2weTn2Q7LRF%2FY6eFWExbpcNSraoVEbdExcggTJEYWpPGYF9B4%2Fmw6k2ZdTEJRBzDEOKokouXgx%2BEGyaSBvMwSHgPqnwF6XXtm5xXRDFPF4ikLfIew7KjiACdSZ%2FUDLpDwhGJZPVdhFr1E%2F1j5Ekow9zK5KpWhBKxO0id0GMRV176hQxvzN2cuG%2BVzaMkPxTxVAogKt4OqlO%2FYKjGMF0dXopayy%2FLtR4mW4GnBnJO868%2BdOegijaDL16Xc7PVtx27E1Ct1rQKp6L6azZ%2BUZaEzPb7bAyZYpwvlbWAcTXwoDxtmwplRTYMwC%2F%2BlgDWWBuD2uw1SJMIZdveutMq7W5zD5q%2Fq6G%2F3xmmkVjYhoxUVXO%2BVxknJrny4FyDRG3qXk%2FTqifj3%2BhFyqD1aQ6rVHq3Q9%2BRPtoDAcpz%2Blyhgt23yP7MLuMmdEGOqUBsyKirfM8FGNpDzQ5gBeN4WBymA3hwdBP3zvkAto3Jh%2F%2BmRgqtKKNMIXIM%2BzfpfletgZN2WYC3lOV9xSB0Js%2B7f2Z%2F92XBGkkBzosMovA6fIiiAUJgxl08NIQx64QK2fyItOaUfZuZjBdN9Lrch26R870bCk7c1YbUeYt8ZVq5bmSaB7%2B1vUmaxRyuwG7AqKT4LA%2BPvHIppgumelgebzGlBYAvIy7&X-Amz-Signature=32dd0cb286d47486e038ba7c1d112abfd8ba49b8512492641b9d46295dc15201&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QUPUWXJC%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050331Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICfXF7PUU72IkSYDEtZfdmDyNbwHLt8hIpS%2FJ%2BKCwTSpAiEA2wyTT4v65LYSmLps1pp5MpFmp33uUmMcrZaeH4hZ4X0qiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEu6OHuc5ev4EVQEZSrcA4FQRxAy7ahDAeeDGF23rt7HIXbJav8MC1dGWhBvgjORzA2c8rSBRRIIe8daswQuSvsJIuL8LpWqqYosHH3mnXTLTQBPwWM4IjTkWMWT1NNF7lEqbQvINX84iydZ33OYwUwk5hsaBPLK9YBvgEw6sB59TPYs4fpJDoqRWYQprGIGABPjF1Hu97z%2Ffg984m%2FMRCv4Yzls7WIOd%2Fg7tnArsQLECtqr66lQs%2FjbZtlL9b%2Fo85evAtG4T4jADHpK%2FPGJJCQlWnRcqEZamn6O4m4T%2FJ9HYWM%2FUoUp6e83zTGIYZwQCum7tEMTVAP%2F4NuqzV%2Fg0Sm7rg6HVVDPS9%2Bq74Sp1py1XXHNYChUXoZBbNW%2Fart7ugQe7uI62XDKLUBO4zL6tGm4%2FcUoBUtFv9tfae%2F%2FzTBM8VLhhP5r003asLqSAe8Kwq3%2BsltedCFKYOyPmnOgObgN2oes8HYPT65XFfM4n3H3j7jzp6HafkUtX2byfMM1Th2NloAaM2p9ZUyODjvVB9tnyf58dBBniM52%2Byxlme40COmtU%2F4lEffQUY%2B%2FTG7xticNPhSjMUFclGpO7jmROq%2BXoQfNPnGt69PNXMyen%2FdnRUxn00pftAxN6MfoZCEKT5PnpRzb5g7lNZ8OMMuLmdEGOqUB%2BKX42WM3LdubTvxIEzQrVlRbfIBLh408ALSNyJ7aRbvGTS37UZU0TxPh1n%2BR%2Fn%2F3gkyJWE5tslbqlYwy%2FjwW6HlevnvOMPJ7wwDrCSdhrO1ymq2bRsnf3%2Fm7c7gGmAwQtlxLuczMzcXgeGwmZwyYVX4Kk6Bsf7dF74lRoEltTs2EADgmSNrCCVjXdkXj5v%2FrYjWyz69I62bBWabXppPhX9i1ilJ3&X-Amz-Signature=52b100dac36a58e3bc849388c22148569a23317ff15236eccbf4311ef6798867&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SWW4I2H4%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050332Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAWnFhPqOMuhGhLFDfCwU4KztniJsrPT7qc03Pn16YnxAiBPLwgKQf%2F05QffRrrhNdAgp10c4MhwmSQZjgNc0Pv5FCqIBAiu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMQ5lQqPQldNrX7cLaKtwDHwFkZanmLqY2wvm8mxFtSKv25WvaiEw6%2B%2FO%2Fdy5LfIOq9XqbHG4RRp0qxYnhBMuBfzZfEYfGUVsktfmUnb7XPgGZNglfLMjo65edVwgtSI%2FIPTgDVgnm%2Fyt9IgcctxIkF7gcTWuYlgE8X7IoVzXKVcFTCtSr2u8%2Bwnn4cA%2BQLSLMsyAZ1vbSQDJbF2UQDia%2BeY%2FzdHsA0EjG9YH1MZIXRu0UoKGy2vcyTqtesrT3Enxgmxdd5chQIesUWGF8kYmaHsCIODlGF4yAPzHo1rttxBTYo1iDDsQwPz1JIIUUZjkLLdKT8fY7es2t92m7ZkwwsHxuy9MN4GCHYzuSScbEOKJTcF%2FZNvSMtAiKIw7JvV7TDSxlWzCLLEudASbpa%2BLeXE733x5mxawdGl4cGXWboRkZBNqQVrxudsKcyVgtFNv5iLCebYUiFkd77Pv%2F3h%2BsYp2Rrgy72GDt%2FNbYgUzyEbV2YJ0YtFjbZxP%2BP0sw%2FWsQ8IFUKA%2FGMgosCgO1lqsN8DF%2Ft%2Bn4uX4%2BeAZwE4xlazoVZej3R9eNdgM4bw1hiRffTXNFahKfbQFhPsBuW3YxfZdxRn6h9PmeRetEE5QvQ1zmLDM0lwTWiFEA7CwXEyeNP9svgiWD6V9Gdvcw64yZ0QY6pgGbQrjSnqguKs2hijKqX%2FmRLBfPhqy3vo1laA05s%2BXE8mj4HQsRl6Lfg3%2B1uvnFZcofMUddIEQ7b2gX72tcA3laMpuck%2Bz0kwQ8LLQYbKbtyfHkmgXeqMf3jOLSjpIMPj4BFnWZ1Noi33T3n6E0zebnIGtTMR4DUpeAUQkNMn%2BgGHbGU30Dg%2FQl67JL6MOC2BGCzFTKUcNhks387enDL%2FXRDF1Uc7C4&X-Amz-Signature=b8e53d278e717047e2a28029052384c19bc35711f69fc1685ddd4353736099f8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGPHPB7J%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050307Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2BEuWW9gx3Cm7yStSf9m7YoXT%2BbCIUN72wCHm51ju2ngIhAPYfgmGW1e7idiTUIBrASpjO92IGrTX6uZ4zz9sypi5PKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwmyVtER05zRBler40q3ANNXR%2F3cVSdOp7tBtY%2BxaMOUqtxEECaf%2BZkLKxKWsUpy5lfMEm9EdW8GTVAybcKZPKiUCWo18zFb%2BuLTARAFeBDEbViHW5ZfN3n6E4AqD2w%2FE%2BoJUgS21CgYGd5U2wB%2B%2FFqu3Z5uud%2ByhZLyCpMwvBVKX60h%2BI%2BYtDwBOi7QvGHuvMb0P6zcsX%2FLQE1EyCMTrvv%2FAYslwQGHxawqMmkFGOlFinhmuEwkAMJBKTVi65vYWL3k0es5eKagjpZFYQBf%2Fuf3BHh3ZpkRfRur2IESgICSlEDzEFkgr5Wa87DTXYFSycPlngAptSKHPcx%2FFTM8wtEf7cE6RD8Yf0OFqbYOZEeNqkHTleIb1ZAdEyowWrOw5NsClh%2FjNi3MGdf2hEcvn%2FXAxva%2BpzAc1l4s3KifR6%2B%2FquR8xwnMdaKKke8G80xaXyPwbKREzwwbJypnHpBqzfdjUeMGFGWndxp9f66EajMKmEN7kLdMMtZQ0vEYeTEAE6Xj4eROqnKwCdcC2nlsrj%2BczP00WiKeaWu2m0m%2Bv6%2FCUs6a8bp9cgrYhyFZObLH%2FmMkTIPO4SgoJZM%2FgkidZDBK7rQjLWG3qyQjPhOwyZ6GG3G48Xi79QHlkDvoK84FmJGgm%2FeJNoiAubdKjDsjJnRBjqkAU0xo5bbQtPvBffweZFA1Vh3IV1Qh%2B7nB9LNj0yQYo4QyCirl2zMtprlM47gF79rqsVnxqnBJ9sub8L4j8QxB4mFgxPgy482fiCi4UH2%2FzDNMzbJy%2BYPejiCrD37uOdK3pEpS9oh1vZW3QXBFgZ8HDOpEVbVmydYWrzda0vLIEOkRqaa2kEvYWrVIzH857KUiKgi2bw7KdcHcVZ%2FlKYqtxTmQIGk&X-Amz-Signature=d71b12faedc62ee45dde801dc7187e49b3de17335a78c46e659105e3b31350d9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGPHPB7J%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050307Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2BEuWW9gx3Cm7yStSf9m7YoXT%2BbCIUN72wCHm51ju2ngIhAPYfgmGW1e7idiTUIBrASpjO92IGrTX6uZ4zz9sypi5PKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwmyVtER05zRBler40q3ANNXR%2F3cVSdOp7tBtY%2BxaMOUqtxEECaf%2BZkLKxKWsUpy5lfMEm9EdW8GTVAybcKZPKiUCWo18zFb%2BuLTARAFeBDEbViHW5ZfN3n6E4AqD2w%2FE%2BoJUgS21CgYGd5U2wB%2B%2FFqu3Z5uud%2ByhZLyCpMwvBVKX60h%2BI%2BYtDwBOi7QvGHuvMb0P6zcsX%2FLQE1EyCMTrvv%2FAYslwQGHxawqMmkFGOlFinhmuEwkAMJBKTVi65vYWL3k0es5eKagjpZFYQBf%2Fuf3BHh3ZpkRfRur2IESgICSlEDzEFkgr5Wa87DTXYFSycPlngAptSKHPcx%2FFTM8wtEf7cE6RD8Yf0OFqbYOZEeNqkHTleIb1ZAdEyowWrOw5NsClh%2FjNi3MGdf2hEcvn%2FXAxva%2BpzAc1l4s3KifR6%2B%2FquR8xwnMdaKKke8G80xaXyPwbKREzwwbJypnHpBqzfdjUeMGFGWndxp9f66EajMKmEN7kLdMMtZQ0vEYeTEAE6Xj4eROqnKwCdcC2nlsrj%2BczP00WiKeaWu2m0m%2Bv6%2FCUs6a8bp9cgrYhyFZObLH%2FmMkTIPO4SgoJZM%2FgkidZDBK7rQjLWG3qyQjPhOwyZ6GG3G48Xi79QHlkDvoK84FmJGgm%2FeJNoiAubdKjDsjJnRBjqkAU0xo5bbQtPvBffweZFA1Vh3IV1Qh%2B7nB9LNj0yQYo4QyCirl2zMtprlM47gF79rqsVnxqnBJ9sub8L4j8QxB4mFgxPgy482fiCi4UH2%2FzDNMzbJy%2BYPejiCrD37uOdK3pEpS9oh1vZW3QXBFgZ8HDOpEVbVmydYWrzda0vLIEOkRqaa2kEvYWrVIzH857KUiKgi2bw7KdcHcVZ%2FlKYqtxTmQIGk&X-Amz-Signature=a28e517b8384a8fc6041c320dcc3a33b1a2c5a9984893a07892a013fcea3c76f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

