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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663JQCF4DD%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIEfnwgEVGz%2BVXufhOdB0%2BWQWvBPfG38ZQ1m7p5wuSrNFAiEA7BIyzMPR7hzNz6ncpZdkjDJfNt3tD%2BLTnwJ1Ajr5Hjoq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDKQM8w0va9CZf6hc%2FircA%2BhGwK7bhknMz8L3mzG%2BI8O65Kx8UGdVMO%2FeithepDGhYcRfL8FFrWIq2Jq9D7id0HegNeTweK76S3GAijg9CBG6viVyaiGcUY17AlANzrzk4Bg93nhu%2FDAU5LjFJSpj7Dc1yWrgc0GtQnLNvh1ysVi%2BsidwK3HGjG5VceTMyx4%2BiQx4p3zfGg9RwyJ%2B%2FAN%2FuwAqkceUZ1LlBB7kkTZRQHuXJ4neymiTsiukVFlYU0LFOPfQbXdBojuJ0nfSghuwiCNrJid8b%2FVx4rJRYQmkKPAE%2BjwKCS4lNwC7g0ZS5nJCPPAaR%2Bvy6V%2BR3VQoGgfxJ8Ff94AwMCT48tDLNkWY%2BjGEqiPdfcAPutmGS3PDrCS4kec4Qx04G0Odgk9KVWMbVxpzkwMqa1xLuXn6WwHawWbCpvmBAjIzeA9QAFoow5uzG2qPfop1mcavX0ygwFmVhUm0C3pwiHDUEgN97mdXFVZvwGZVgCbXbFTRbrSBjZI9BhLnxN5lOCjMhldpMQuOb5RuXR5UooXDtWIQ6Fn6oXb3o0R3UDZDyxWs5Niu0LKu7obyw96Ezs64pe1sflWBJ6veUwUld%2F%2Fg2292FBXIJAxotLvaqcf6ZrDEZBSkgp9khLsqxxTQ96jHl80bMOem%2BdAGOqUB1iOGTk3fGWGQT8zCjWaHKuq0XLK2pHdRgS7XxESGHgJpUq5jxBUK%2F8fXaCp7uFX0dQkerzcP9sWpb9XxlSaT43jGb%2FzyGH9TsYDNGHzdQec4MafR73yAx0p3C8nGfCPZrISUv5HcNs1xSvsrjZXGMqAGY7GAmGQ3dYtjAA76wHxTlHS8FXBYo8yCoIc%2Fx6y2BkGMSAbRcC%2F3TcHtTw69XVXhVK2m&X-Amz-Signature=70215d3f0f2399c4b04daefb53b9d118ac60cc69cd81e909c6735f5d12c88e6d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663JQCF4DD%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIEfnwgEVGz%2BVXufhOdB0%2BWQWvBPfG38ZQ1m7p5wuSrNFAiEA7BIyzMPR7hzNz6ncpZdkjDJfNt3tD%2BLTnwJ1Ajr5Hjoq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDKQM8w0va9CZf6hc%2FircA%2BhGwK7bhknMz8L3mzG%2BI8O65Kx8UGdVMO%2FeithepDGhYcRfL8FFrWIq2Jq9D7id0HegNeTweK76S3GAijg9CBG6viVyaiGcUY17AlANzrzk4Bg93nhu%2FDAU5LjFJSpj7Dc1yWrgc0GtQnLNvh1ysVi%2BsidwK3HGjG5VceTMyx4%2BiQx4p3zfGg9RwyJ%2B%2FAN%2FuwAqkceUZ1LlBB7kkTZRQHuXJ4neymiTsiukVFlYU0LFOPfQbXdBojuJ0nfSghuwiCNrJid8b%2FVx4rJRYQmkKPAE%2BjwKCS4lNwC7g0ZS5nJCPPAaR%2Bvy6V%2BR3VQoGgfxJ8Ff94AwMCT48tDLNkWY%2BjGEqiPdfcAPutmGS3PDrCS4kec4Qx04G0Odgk9KVWMbVxpzkwMqa1xLuXn6WwHawWbCpvmBAjIzeA9QAFoow5uzG2qPfop1mcavX0ygwFmVhUm0C3pwiHDUEgN97mdXFVZvwGZVgCbXbFTRbrSBjZI9BhLnxN5lOCjMhldpMQuOb5RuXR5UooXDtWIQ6Fn6oXb3o0R3UDZDyxWs5Niu0LKu7obyw96Ezs64pe1sflWBJ6veUwUld%2F%2Fg2292FBXIJAxotLvaqcf6ZrDEZBSkgp9khLsqxxTQ96jHl80bMOem%2BdAGOqUB1iOGTk3fGWGQT8zCjWaHKuq0XLK2pHdRgS7XxESGHgJpUq5jxBUK%2F8fXaCp7uFX0dQkerzcP9sWpb9XxlSaT43jGb%2FzyGH9TsYDNGHzdQec4MafR73yAx0p3C8nGfCPZrISUv5HcNs1xSvsrjZXGMqAGY7GAmGQ3dYtjAA76wHxTlHS8FXBYo8yCoIc%2Fx6y2BkGMSAbRcC%2F3TcHtTw69XVXhVK2m&X-Amz-Signature=580261d5831350b19226709adc6680f8f66fb9258dfd0678c9773488f90a8305&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663JQCF4DD%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIEfnwgEVGz%2BVXufhOdB0%2BWQWvBPfG38ZQ1m7p5wuSrNFAiEA7BIyzMPR7hzNz6ncpZdkjDJfNt3tD%2BLTnwJ1Ajr5Hjoq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDKQM8w0va9CZf6hc%2FircA%2BhGwK7bhknMz8L3mzG%2BI8O65Kx8UGdVMO%2FeithepDGhYcRfL8FFrWIq2Jq9D7id0HegNeTweK76S3GAijg9CBG6viVyaiGcUY17AlANzrzk4Bg93nhu%2FDAU5LjFJSpj7Dc1yWrgc0GtQnLNvh1ysVi%2BsidwK3HGjG5VceTMyx4%2BiQx4p3zfGg9RwyJ%2B%2FAN%2FuwAqkceUZ1LlBB7kkTZRQHuXJ4neymiTsiukVFlYU0LFOPfQbXdBojuJ0nfSghuwiCNrJid8b%2FVx4rJRYQmkKPAE%2BjwKCS4lNwC7g0ZS5nJCPPAaR%2Bvy6V%2BR3VQoGgfxJ8Ff94AwMCT48tDLNkWY%2BjGEqiPdfcAPutmGS3PDrCS4kec4Qx04G0Odgk9KVWMbVxpzkwMqa1xLuXn6WwHawWbCpvmBAjIzeA9QAFoow5uzG2qPfop1mcavX0ygwFmVhUm0C3pwiHDUEgN97mdXFVZvwGZVgCbXbFTRbrSBjZI9BhLnxN5lOCjMhldpMQuOb5RuXR5UooXDtWIQ6Fn6oXb3o0R3UDZDyxWs5Niu0LKu7obyw96Ezs64pe1sflWBJ6veUwUld%2F%2Fg2292FBXIJAxotLvaqcf6ZrDEZBSkgp9khLsqxxTQ96jHl80bMOem%2BdAGOqUB1iOGTk3fGWGQT8zCjWaHKuq0XLK2pHdRgS7XxESGHgJpUq5jxBUK%2F8fXaCp7uFX0dQkerzcP9sWpb9XxlSaT43jGb%2FzyGH9TsYDNGHzdQec4MafR73yAx0p3C8nGfCPZrISUv5HcNs1xSvsrjZXGMqAGY7GAmGQ3dYtjAA76wHxTlHS8FXBYo8yCoIc%2Fx6y2BkGMSAbRcC%2F3TcHtTw69XVXhVK2m&X-Amz-Signature=487fae8b167a2d292df09baabc59d07b928d28c6bc39750c1f0a9092e9bb36d9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663JQCF4DD%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIEfnwgEVGz%2BVXufhOdB0%2BWQWvBPfG38ZQ1m7p5wuSrNFAiEA7BIyzMPR7hzNz6ncpZdkjDJfNt3tD%2BLTnwJ1Ajr5Hjoq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDKQM8w0va9CZf6hc%2FircA%2BhGwK7bhknMz8L3mzG%2BI8O65Kx8UGdVMO%2FeithepDGhYcRfL8FFrWIq2Jq9D7id0HegNeTweK76S3GAijg9CBG6viVyaiGcUY17AlANzrzk4Bg93nhu%2FDAU5LjFJSpj7Dc1yWrgc0GtQnLNvh1ysVi%2BsidwK3HGjG5VceTMyx4%2BiQx4p3zfGg9RwyJ%2B%2FAN%2FuwAqkceUZ1LlBB7kkTZRQHuXJ4neymiTsiukVFlYU0LFOPfQbXdBojuJ0nfSghuwiCNrJid8b%2FVx4rJRYQmkKPAE%2BjwKCS4lNwC7g0ZS5nJCPPAaR%2Bvy6V%2BR3VQoGgfxJ8Ff94AwMCT48tDLNkWY%2BjGEqiPdfcAPutmGS3PDrCS4kec4Qx04G0Odgk9KVWMbVxpzkwMqa1xLuXn6WwHawWbCpvmBAjIzeA9QAFoow5uzG2qPfop1mcavX0ygwFmVhUm0C3pwiHDUEgN97mdXFVZvwGZVgCbXbFTRbrSBjZI9BhLnxN5lOCjMhldpMQuOb5RuXR5UooXDtWIQ6Fn6oXb3o0R3UDZDyxWs5Niu0LKu7obyw96Ezs64pe1sflWBJ6veUwUld%2F%2Fg2292FBXIJAxotLvaqcf6ZrDEZBSkgp9khLsqxxTQ96jHl80bMOem%2BdAGOqUB1iOGTk3fGWGQT8zCjWaHKuq0XLK2pHdRgS7XxESGHgJpUq5jxBUK%2F8fXaCp7uFX0dQkerzcP9sWpb9XxlSaT43jGb%2FzyGH9TsYDNGHzdQec4MafR73yAx0p3C8nGfCPZrISUv5HcNs1xSvsrjZXGMqAGY7GAmGQ3dYtjAA76wHxTlHS8FXBYo8yCoIc%2Fx6y2BkGMSAbRcC%2F3TcHtTw69XVXhVK2m&X-Amz-Signature=d13ebdf38d4e6f5436ea216392b91160e7506e8925e086bbed66948698331a57&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666MFMUXT7%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050211Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQCzAQ5edNkZhP1J2jNmPiL8Sk848gU6oixid91DS%2BTPPAIgfC%2BZglT4RnpDN5V1HcfN1K0jhlfU9DCXS8E%2FgSlng7gq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDFmOBgt2rylUWV%2FpaSrcA%2FJxQwTA0QN6GGxEx4Z4sEyFnKEiRZy4SBsSaGuLt1WcgCe23l9ekRZdlwu%2FDHwyzivMo8p1iErBCLs8mL7e%2FpdaS7scObIFVHI%2BCBn1e6HXS48vYx1SaQRmnRgJSVzy0IgG5%2B12TajsZgUZ5DyYZIVl3RAzs0PyCITuQK%2BS2eMSUC8f5xEjd%2B8B%2BFiAyR%2FGJOaHs6XwIUZlDIXs8m7jowoXKMm7A4n35MwjYHBbEyEp5rx7bV5lbEshNw9SiNA0x1P0REj3UemXyy4st3bkIz2aaMeFBKxBoHatK9NctI9d09ZcEok4KoWwZG1iBAgHZCfsa2yakqdQr%2BOZSNMccwoTUBc%2B7rHzaARGmbUpvcyTwMi8UQ8Q1Nz%2BGTdwUq2DhMkVi9ltZIFKg6oVBpmfHuT%2FYiq6K6Mh6GecqyL9owao2y9PijNk25ddhmLXNQI%2BN%2FSZ0jGBSUl8G7VGms3VpQ%2BW1Q5uIjKg8Xsf4Hxfc5u%2BrNEmgGkcgufpHGGCjriQ03aozvfAjkOvLzNgRl%2FpwWHW0MftUbuANBzetSAiFohS1uU2Lv%2B33AYWl1nMLLzBLy1mumbbsaS7H1aUwH3bI5GO1pnIzbzBsv9S%2BdpVuCeL5EB2t0LeBzZXtPkoMKGi%2BdAGOqUB63flEj6%2Fo7G2%2BQaMCwMs8vZ2lxKtRUfjSTa9GLtgi1iUC7InOvcpB%2FW5v7WMfNY%2FwQVji%2F5SrkbysbOtgXxxNq%2FjDRDVgqWxDA8uqKI%2BZ3C6bK8uWcHlEKyVgsvFeQox%2BX8%2FyztKCSdwwrdQAAh7voGVDBeowHT8B4vkneq29U5ICWDxvjEivKNjmMyz4nuO5ArjJ2sx2sxt47wRdo8OzywZrNQd&X-Amz-Signature=d5bbd232063aaa34de3cf1f1cf835504e8b23c05250c95f3824f5ba506c7ce07&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663DJLZYHF%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050214Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIG%2FAaq3u5pAdK%2B%2F%2FELzDT4mARI1uUllMAwDEqIEGINzbAiBd1YQ8Buid4e3PRat3xZoRkgHyZloqogcxbeEPDKNPbSr%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMuQ2mjRCivapgcSDrKtwDmOkhVyMkr4Y1glLJvN1YKCJhZKTHfwI1B7v0Cnjr8gquSYiL0kKP9KuXQNDJSBKHkN4uP4itJZHQy40cZPN5rvojCqIhDp45VwC4VnrSL33wqRkcXntalIKF%2B4CtLOuQRorlN3ZsC3U9OfEv6fiDCJM7LUgLVke8SGhMmCiD6q4QcPb%2FEgCKYXgO88eww01ODpHW9jDY1onjU5ndoS8a7HZJvNnfR%2F9lfrm6Q9MnVIJXXu2IlB4lEV%2FB%2BUbx5wCsF1PVYmO7Icc8lIogPls0SPXOdoWyslDNM7qnIpufiEwrUuli6HVC2PfMNYlsRukcHezw6J6As3IgJ8EDwDBYHCYXBkiKTZPab6bpKbbaFcOeSft18dlmfUjaelv%2BmltDI8dTDI5yTsu2bfufA7tetwAA74ygsjuPUO062sqYf9z7MnFVdPUhmwi%2BsXdFDVhlGeUHXwkcnIoKSpvGFg%2BlXSFWXaa55YAQOnDyeIrdW1YswcoPteK3mDjThgZO84KRu0QuyTJNaAQvk08QZyCQzpwOaAAd%2BaOCCLgkZIONrZ4Iz6RtHDisDi8bsGJab6WZ35j0V7wUXD%2Br2PVgiKi7n2D2RlD5esPyiG8GG%2FxZ494Og85C4yFi4csJsRUw76X50AY6pgGyOZbOuWNn2tqI1TVh%2BE%2FIzDeciviQS0CqOVnqvrD7MUvm5qsbwFrXAoCqLYUUZSmIJkhY%2BMjOHeoa5EvC6gMgQ8wokRiiZocTewjaCuOf5dgnDlMJPRp6%2Fhp%2FJ1DRfas3ENdMThGbx7Wp6%2FeO61urwGVgAQkeD1BZgy1Gx6pLGNgI3L2FOz3LqxSvgThqzZmgyE7FcgOvXwdKnn0s57BHVKY%2FrcpZ&X-Amz-Signature=3c94a434fefd349ac0e70722406892a95b927b8e0cc684e66ff0b2459dc03755&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665UQSABBD%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050215Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQCHfbVJersIwdQ3UC%2F2SG2HPSOs%2BVarf0XukKloJipQlAIgXrihOXnujh1x7EwZjQgS3zPFtkToVFGMgBgDojxevyMq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDGsKxjjjGvXOL01q5SrcA6cAu8jXMiRZazw7DZlhsM%2BKb60sLgc2km%2Bx2A4aWMmBwYf3mS8ICAFSg6zWi9QMEuCRLp%2FAD4KpqJttF26AzHoaBdcQnCa8Ohi5ZN%2FibQq12QZcrYATsoQPBuRTkVoLEAMgVsS07V5s4AkPno1%2BF9oHMc8b0yVtX9K8Gg72ic3Vb3CVZVVIHekYvSr99YJH8%2B%2BiMVheOJAoOLp8jWiu4l9G%2FVf8k2U1X6iStu19cFer9L%2BDJWYFGa6y6DIJJa5Bezuyi%2FSKBis1BAZY4T3Y9sKUEgE7uNe87rh%2FytWCU0g70Qdi2nlBbkW3fHMwkFHd4XXEDHudmcqJRxXxlkNAl%2FQ3glI5gMKaOz6tkao40iO9VmEnuzUM%2BpR8OPaCuyN%2F1EkkDJY69Qip3dVcWMrASiKwGBBuqgpbv5m2rTdt%2FEQVTHCH0QwE8rHD7hd6iIk02D%2FX7ZwMfFUgFq%2F5fY7Rb253b%2BfzDopwUxrIwL2gshsEyGR4u4OHXei%2Br25d%2Bb1j%2F%2BEN6PB1WtxkAQJBewZVqxM8xuShxzsUy3Mpt%2BjPmvUupu%2BYqEPM0vOIreVaxMhhRhq31vwDkQ%2B%2BHT0fpfanasiRsvDbhhbcN747taGb9DxzSDQkvQLaccpDfmyvMISr%2BdAGOqUB9rPS41eO5%2BeBnMD%2FISNWTdwaDW75fjlIAI3rbf1H2b3E1l7lIvSxz2Ul2jFqLCL2IHK4sqJob80Wuk0MPgTrMSYXurH%2B2Puf20S3VzRrO4n%2FC5URT%2FqKBNpiRvHTPwVRNTxlEQudDyO77CEgIR3ZtYm28UZqcRa2HeoCklcWNzgh39shOqR5Gnb3EEWMt%2FPaiPhmvz7GSL3rFFJbCvRJlnRN7GVI&X-Amz-Signature=862e7dcd3a4a31feb753848b1b09bb07cdb7d2bbb5fb6c1cb9bd83e5a201eadb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RZ37E4UZ%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050215Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQD4IetHH3DJd4%2BZxzaZ2h4lciLEDrq91qapA4IilyK7fAIhALPOUlvMQWfFlow1VgYUqjb3y4gZIQVAKug8RR0ikLkCKv8DCB0QABoMNjM3NDIzMTgzODA1IgxU5tTL76Crz2dP8w4q3AMFHt9I2768uJPgVNEgabX0FruNLe1bkXoQTrSSXwGzAEeNJaZz%2BtORsATvIDPU%2FV84%2BgE6Ic7B6sJjjjqfjCF87AIuQXa6l%2BTrImEA5oC5VHSTMokYCuJ0%2FonrzbQ8BOUCDgaZZPaIyz%2FiWGVUraHYLZyrMJKd0Z256WTSLWmewPKEZflnWPz27GDejVoq4Rkkgk1frJQF%2FDRXvvnerZkU8dZVeHlZELFKJH4rxmUkjWMM6mTVYBUzFM24xuTB7yvzuD%2FhkclzaBp5ooQ89G2U7wM%2FtLaJhkm7ELfwkjDPAN0q6kTHH5LiAvoW05maf6VEvYyhaSY7CnHJujpaxBv6ioAwFGg426Ph6Lr%2Fy3Pd30iUiN%2BBOJyDPtjuC8I5Bjdb3c0fYO5d41YFvb1%2BPGAcdv6M7hJ8wva6hIBZHzYQR558nYLLjReJwH6teNzJkFe0kwxSEf6ybjcTCq6aq68ZoWZWfSWulg8I%2BxN4KdmerR3zd0SyY0HkbCj2N3EAquA4QMGRk4Mq0e9%2BxmpwCugAVEwi%2FjqOuaWm%2FIbSazCn%2BXL6X1xrwqPolHZzAKQzHLzHP8o09LvwFtGnfe8SNDpczEwLzKOxNHYDyqG7d94eQaijAXnuA8d2E%2BmPHDC6qPnQBjqkAUHtx7cBbF4UtbwLqgoWM4B%2FjFRN%2BkZeWoQPXltPIIJOn2%2BzHIHOLKnfIrfwFPo9IsG00uGlcYXB5sdwO2VUHnqa7t6JcRde6aVLos6BOPH4riE6bXHAskc706JKBmTBKpRkc46BVuie5IfWoqnAb%2FviIh%2BV2bBEdeW6MWBF08ldYsdQ11PSiOLLDJkHUxUvWTEW5QeZe9j1YD3pL6nokr%2B1RYrs&X-Amz-Signature=2efd520546d89389fdc503d40e786db07ad7b70cba9d9545ed04e6e791da9315&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663JQCF4DD%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIEfnwgEVGz%2BVXufhOdB0%2BWQWvBPfG38ZQ1m7p5wuSrNFAiEA7BIyzMPR7hzNz6ncpZdkjDJfNt3tD%2BLTnwJ1Ajr5Hjoq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDKQM8w0va9CZf6hc%2FircA%2BhGwK7bhknMz8L3mzG%2BI8O65Kx8UGdVMO%2FeithepDGhYcRfL8FFrWIq2Jq9D7id0HegNeTweK76S3GAijg9CBG6viVyaiGcUY17AlANzrzk4Bg93nhu%2FDAU5LjFJSpj7Dc1yWrgc0GtQnLNvh1ysVi%2BsidwK3HGjG5VceTMyx4%2BiQx4p3zfGg9RwyJ%2B%2FAN%2FuwAqkceUZ1LlBB7kkTZRQHuXJ4neymiTsiukVFlYU0LFOPfQbXdBojuJ0nfSghuwiCNrJid8b%2FVx4rJRYQmkKPAE%2BjwKCS4lNwC7g0ZS5nJCPPAaR%2Bvy6V%2BR3VQoGgfxJ8Ff94AwMCT48tDLNkWY%2BjGEqiPdfcAPutmGS3PDrCS4kec4Qx04G0Odgk9KVWMbVxpzkwMqa1xLuXn6WwHawWbCpvmBAjIzeA9QAFoow5uzG2qPfop1mcavX0ygwFmVhUm0C3pwiHDUEgN97mdXFVZvwGZVgCbXbFTRbrSBjZI9BhLnxN5lOCjMhldpMQuOb5RuXR5UooXDtWIQ6Fn6oXb3o0R3UDZDyxWs5Niu0LKu7obyw96Ezs64pe1sflWBJ6veUwUld%2F%2Fg2292FBXIJAxotLvaqcf6ZrDEZBSkgp9khLsqxxTQ96jHl80bMOem%2BdAGOqUB1iOGTk3fGWGQT8zCjWaHKuq0XLK2pHdRgS7XxESGHgJpUq5jxBUK%2F8fXaCp7uFX0dQkerzcP9sWpb9XxlSaT43jGb%2FzyGH9TsYDNGHzdQec4MafR73yAx0p3C8nGfCPZrISUv5HcNs1xSvsrjZXGMqAGY7GAmGQ3dYtjAA76wHxTlHS8FXBYo8yCoIc%2Fx6y2BkGMSAbRcC%2F3TcHtTw69XVXhVK2m&X-Amz-Signature=e9e20cb3d4df8cfc45c90e63f6719e2ecffd6a733ecc1b1062e1f3e25e8c0055&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663JQCF4DD%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIEfnwgEVGz%2BVXufhOdB0%2BWQWvBPfG38ZQ1m7p5wuSrNFAiEA7BIyzMPR7hzNz6ncpZdkjDJfNt3tD%2BLTnwJ1Ajr5Hjoq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDKQM8w0va9CZf6hc%2FircA%2BhGwK7bhknMz8L3mzG%2BI8O65Kx8UGdVMO%2FeithepDGhYcRfL8FFrWIq2Jq9D7id0HegNeTweK76S3GAijg9CBG6viVyaiGcUY17AlANzrzk4Bg93nhu%2FDAU5LjFJSpj7Dc1yWrgc0GtQnLNvh1ysVi%2BsidwK3HGjG5VceTMyx4%2BiQx4p3zfGg9RwyJ%2B%2FAN%2FuwAqkceUZ1LlBB7kkTZRQHuXJ4neymiTsiukVFlYU0LFOPfQbXdBojuJ0nfSghuwiCNrJid8b%2FVx4rJRYQmkKPAE%2BjwKCS4lNwC7g0ZS5nJCPPAaR%2Bvy6V%2BR3VQoGgfxJ8Ff94AwMCT48tDLNkWY%2BjGEqiPdfcAPutmGS3PDrCS4kec4Qx04G0Odgk9KVWMbVxpzkwMqa1xLuXn6WwHawWbCpvmBAjIzeA9QAFoow5uzG2qPfop1mcavX0ygwFmVhUm0C3pwiHDUEgN97mdXFVZvwGZVgCbXbFTRbrSBjZI9BhLnxN5lOCjMhldpMQuOb5RuXR5UooXDtWIQ6Fn6oXb3o0R3UDZDyxWs5Niu0LKu7obyw96Ezs64pe1sflWBJ6veUwUld%2F%2Fg2292FBXIJAxotLvaqcf6ZrDEZBSkgp9khLsqxxTQ96jHl80bMOem%2BdAGOqUB1iOGTk3fGWGQT8zCjWaHKuq0XLK2pHdRgS7XxESGHgJpUq5jxBUK%2F8fXaCp7uFX0dQkerzcP9sWpb9XxlSaT43jGb%2FzyGH9TsYDNGHzdQec4MafR73yAx0p3C8nGfCPZrISUv5HcNs1xSvsrjZXGMqAGY7GAmGQ3dYtjAA76wHxTlHS8FXBYo8yCoIc%2Fx6y2BkGMSAbRcC%2F3TcHtTw69XVXhVK2m&X-Amz-Signature=146ae30c952c104b1825afe3fcf7de51cc264088406a69ffb0e20bbe0facc12a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666CBMH3EZ%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050218Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQCyyX375lAMBM3Mxv8FLPrXHRSsYQB30VRRY32VqsU4nQIgZ6uw5PJV7WfqYWKT%2FkTcoffxsTEdEpPnq6dD3rdg6KQq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDEsBQaMRUQH1nb3FQSrcAyyw3bkh3tSdYsefSFwahKvWw11VVBcuzq3FUwEpN7PqxAmFjKHzFqrZJVVWNTkcbmjdkorW08zPy8ntOhgF6jIkZH2HAVcCEZ7ujd0cWFagV63t%2FpvyCsvfXLpjCDqXbz4KsegwLDFjelMrJGA%2BdJkZZarfp0csyvd4MbBRmIwWtMwE44fjwCwydMxwWlWTY0vxSwfeAAaFEEIdZjxXBJNSwSkYpdzEyTwYY1b0pnUg9jJ%2FscvC45nIeYj5jkx2WS4B9wAe%2FZKTY0ObO9uUXJcozxZWBLGUiqg8AxbcoTxJ5P37m1Xi2cyoqSz1tqiuy37lkNBjgL7MuoNxl8S2aynldaOdkOwB5E9IHW6YZMlocNuWKtAhDVtl0ozuZvn3pRg6QkbQPSl3qUpg4EEiNcB9KCkY46Lzgi%2FkXVYX6OLnQDJsrresNqSbZ3rDX67BIPtBhwPMgJrsTaD9Ns5bT2RCTPC%2Fi2nRHcbBEVuiXPA81PtFYqCWSdvNDNNxhltpxYlevq7wAMz89Swoj3SCKVXA7iHeRDdj3NoZaGrXRHMnFUMElhtpZHtzmOFeRztILeR0a1Sr5kVM%2F1sPoaASQ6tqZXN5Mb6%2FCuc%2BZNUOEciyZ7LlDSU3jX7N66neMIOr%2BdAGOqUBlsoPnRpjgBHr1XtFRcG%2FSW2vXUEEJwSN54EPc9AjfMGWiMWpFLGaZUdxMJV0M36LJKq%2BNMmQbaNqTXDrZmfdmeM8S39SmWDIlLlYVvrEVL8e5CFJB10X3INB7DqTApoyZt9QyQ6rjwlTwH8J%2FvtNkjTmc3zxytu7%2BrpcuN5F1XolSWRCYPlc%2Fa4EYfjdhMW6PJnt0Sh50pRvGaZ9N0mbJoaa2kLo&X-Amz-Signature=d8a9f197b14d3a63eb6635022f9951f5ba67016d4c2a505f5ac3fe1f4e658b00&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663JQCF4DD%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIEfnwgEVGz%2BVXufhOdB0%2BWQWvBPfG38ZQ1m7p5wuSrNFAiEA7BIyzMPR7hzNz6ncpZdkjDJfNt3tD%2BLTnwJ1Ajr5Hjoq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDKQM8w0va9CZf6hc%2FircA%2BhGwK7bhknMz8L3mzG%2BI8O65Kx8UGdVMO%2FeithepDGhYcRfL8FFrWIq2Jq9D7id0HegNeTweK76S3GAijg9CBG6viVyaiGcUY17AlANzrzk4Bg93nhu%2FDAU5LjFJSpj7Dc1yWrgc0GtQnLNvh1ysVi%2BsidwK3HGjG5VceTMyx4%2BiQx4p3zfGg9RwyJ%2B%2FAN%2FuwAqkceUZ1LlBB7kkTZRQHuXJ4neymiTsiukVFlYU0LFOPfQbXdBojuJ0nfSghuwiCNrJid8b%2FVx4rJRYQmkKPAE%2BjwKCS4lNwC7g0ZS5nJCPPAaR%2Bvy6V%2BR3VQoGgfxJ8Ff94AwMCT48tDLNkWY%2BjGEqiPdfcAPutmGS3PDrCS4kec4Qx04G0Odgk9KVWMbVxpzkwMqa1xLuXn6WwHawWbCpvmBAjIzeA9QAFoow5uzG2qPfop1mcavX0ygwFmVhUm0C3pwiHDUEgN97mdXFVZvwGZVgCbXbFTRbrSBjZI9BhLnxN5lOCjMhldpMQuOb5RuXR5UooXDtWIQ6Fn6oXb3o0R3UDZDyxWs5Niu0LKu7obyw96Ezs64pe1sflWBJ6veUwUld%2F%2Fg2292FBXIJAxotLvaqcf6ZrDEZBSkgp9khLsqxxTQ96jHl80bMOem%2BdAGOqUB1iOGTk3fGWGQT8zCjWaHKuq0XLK2pHdRgS7XxESGHgJpUq5jxBUK%2F8fXaCp7uFX0dQkerzcP9sWpb9XxlSaT43jGb%2FzyGH9TsYDNGHzdQec4MafR73yAx0p3C8nGfCPZrISUv5HcNs1xSvsrjZXGMqAGY7GAmGQ3dYtjAA76wHxTlHS8FXBYo8yCoIc%2Fx6y2BkGMSAbRcC%2F3TcHtTw69XVXhVK2m&X-Amz-Signature=93d9d5b93a788f23be1f8bb609c00984d2838a4938eeefe81a3b716ef8afa487&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QNA3W54Y%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050220Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQChmtPrbAf8pYPPVXeeokamgWsAT8XhEXgFgIEczdzvbAIgdXBcDzkYpBBO0Vpnrw9jOlATxm%2F%2Flpq%2Brb4aSSf2CP0q%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDPY%2BGWXNi%2BGsnXyRzyrcA5FsN1z65fquQ1GFfVpaFbCYXDnDPHyxYHt5aUOJNhw6QpcsdBowOk%2FVyH6ebZPVeq472BPatz2HCBy1KMqWp68G9jjgqrC4kOIX79%2FKOEKgRhs0RR%2FhudZpC%2Bw4JToWA5flXgtUAxtGY8jicVtVXZv%2FlNRlv5v7PaxVc58X8mcYXfLzcV5nMaGQcYtx1hzMkCsUTuDawaQyohN8ap0BwehKNBVbez51HimSe16ofWQaTGuxIRfwfsCLwCkkHYJnO27q06DIax1u61f0Tqv2o4BmcASK6Tkrap1st599fVsImQpS5Xh8wUAM3emuXTm8KHuNf%2F%2BmmHwUWLdqe%2FwiPUMbX6Kkk89qG76jNu6c4Xe8XZW8TFGpq2GSH16jaiEYl%2BrL7hjFZNNBdG%2FARoS1ZuTMtRuIyT8AKz8%2B5ESqiFeT8bfbpdMN6rKP1lQNqmGYqPIKQUjJYrTojL6voCKlv%2BVi5WT80jC5MLt4ZGTqIS6iH%2B8MxHDJKshmdv45LmSEk2VYjEYkKPB7ovXSECOK4MIzaYUdFg977kiVJTVllRIVX7ECY0%2FxX6b7lox1ztR10KilvM8pCMlD5DuZgq%2BbNWKBxm30lcVD4NOMgbg791t8emACHp9c6YdGh625MM6n%2BdAGOqUBjs8Nz3NmTWo2i6v%2Bc3C90VH6zNPHEKI1Of7l4XQgZhP7boh6WT1Iu7iEIwz0nA4bfLOx3Qq1AiRd%2F6Yov7EMBzBJ6nFChXBWi0DLtGknCTsgYP2yX7P0E3mSlCpjniQozVEIcYNB9B3w3R1gDxW3%2FzJX%2FlPR7moQaG1cQ0kY87tha1kR9xlzvCyMssoHQwtbF6ukL%2F4dCA6xddLs2RbKQ3LMb4Br&X-Amz-Signature=d066180e167814c44ca9316d9493175c3d5f4a0a9b2a9cc0afb85c0cd3199db5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664DUURS5G%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050220Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQDsHaDO0agESdXSnDNmIyj5ITlmzfxkkO8tqsJoCiqI8AIgNVMggoln0sfytApFRk4LeWBsIo4tMk3RvldIWX1tXYgq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDP0rAOiL43y2pVQ1HCrcA2D9fmSMp4ef43dDuJI%2Bn0twvVbbG1MM1hhOEocmVdT5d%2FJe6RIiooWwCpwxSEmX3H7E069SFGLkQ%2FJrLyaeBOokLPqFFFv%2BFSPBvZohNXdjCTZ7LGU0nIOnLQbrWmKNC5eUSTHJakxO9OHEg3Cyk2RfzQ0B9i1mTP9KNEO6xpJqoR%2Br%2BMxueXNA6FFQMi15HbKNzcO4jUiG5q0elhCdtv3VBpQGAJvUMzvg%2BAD8ZNGYR95sWhuC86Y8twbKzibULHuwPCpuTu%2Fb4q9N8MGYvqnLTp9r9NYc48Of14VxvGQ3n14N9A4BvinKdaSXqMxIvMfJkKLjXbTrCUF8Hn4%2F7f08IYyL1r5fMo3e3GqVcgDIBrG3gTx8aNt5EKhZ6QNiShyEF9nknaNNVMuaGL5rQ074M3eAlLbQDYFuqu%2FsGPHU0L4JDudnu9P9znFPrrHlD2dyAsnrN5TUmyysGUAwlC9vqEnYM%2FjTHqB6VYiEqgwhbCkS13hAYCQeh9Qp0zjLAkV%2FZ7csmA71XAw1swxrfHpTcNzgaI5Pvuq4KDfbihhXoelnnAaAzjVaH5HHMM%2FnkgAeP84ILVPV51u59nF0ct%2Bh1eyeic8krbgGfzuJe4eVl4pvQGmoRK16nIlZMNyp%2BdAGOqUBOiuv4Uo991mAYhkmz7xK1keHf%2BLhLaT%2BaTD6cwMD0qGWpnjIfHD8956y0j9PAUWx7%2FIi9veBVZogpb31CkUlKDQRmMaZ7zIFXn4%2BgMFwgF%2B14eybGLZgxt6fayRq1ml8zOckem4cHkUBKgxbGdUQZ98HBFMSOFRxVCBpON5Azq5vHogV%2Baatx6k7N9WfiWzIYkDir3dPOG5l%2BTiwUqqZ2olPss%2FU&X-Amz-Signature=10435a720bafd356ffdfed0cc1f199460f704a94cea9d040491312093dc0d4c8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VOLBYKIZ%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050220Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQC673Ty9cs37QB%2BtXTIykjIWdPm%2FucSriNs3zzcoPNugQIhANI3kfmQGRVjw8NYELYYknBVjbyPPR9UEj168uG0vtzhKv8DCB0QABoMNjM3NDIzMTgzODA1IgyViSssjwr1KlcTmxAq3AOBZZeoTjsHqPlcq03srmy61nuMiKz6ABMymhxWgwep78TG%2B6CYYR2QztynJwlrllrpa%2B4%2FEMJlirIbusBe%2FhzewTRu4e9tg21CDwYlniyKTbRlM2IwNzyQj68rWJ9B5aNku5tlAKBBN0GdrwensVKhMnjejDDmJVRyNNg3IE3A5%2FlijZ9SjmgyUzAR0aJcam948pzk7cGDSMemPU1uK5uGaCn18CK9dGQqh8h2XYAnNH05QBf4V6L44vBdjhrYk024NHVE8UCTZ782IYOeQfukoWyTsjMgFtTj%2B39zCbjq1tfFNOgFBY1MvaVAMaZMQe5dtik0pRm9GBxOEhm9LKom9jxPZ4ojnSxn29uZ3POGyEReQ%2BpqLuvJPUWE3%2FaxIauERaReAnrd8qWato4uW1tryquTiwivzk6Az006Gwh%2B1rNhl0wA4ep388cOhytSO1HsVvT0NR1lXLz2YzTR%2FqPEoZKb8vI3RkW2Lfj4N2hRnLpQ9JxIOg2U5qwCGQBAxOCk13msVAP98FN%2FkKYUiXfzmg5%2FyoFRYV%2BMjVvX7%2B%2F07QhI%2B%2FQ3yoXNZYT0RnW9dOk9E%2BiVeVMJpaEyv20S9TMXXPvSc1fljsHZI96Gmj959HTyBkayEbZQ9pk%2FYzCZo%2FnQBjqkAXzAH%2BS9r9rb%2BHdZ9IzXIUIbXCcAsXXbLu6K9tTs9o5gs5JCLcCkaXdznKeZ%2FG0iH2XWkugexKEFavfsgeprzlIpRkdpezg1OHxkocPUYYFGpg9P1Pz%2BgLNvCTVmcPSpPfKA5%2BeiF6qztQwdkrjfM8kYe%2FnYNDrk5GEiEt76VR%2FpK05Mg%2FG%2FSUCgxby%2FAAXAISqrcZxn8mMA1oCH00DXpic1xlwQ&X-Amz-Signature=90052a8a7e622a9b76896914398363050937c8624032146bf7f1a75fa8561c1b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663SH6TOWS%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050220Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIDYMoXNRvQ1rMirrbxu%2F0rbrhlbCdgEbxu2zEJvuDe9qAiEA62UhIvRxJ%2Bb8cajwvQVocYoC4FplHk50BG9TthJ%2BlmUq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDOlEFs3aoHsEKM8WayrcA0gvBlzrg2X4ojiGe4GPoDXtVn%2BqKhPhAoK22kl1A%2FoYNXNn9zxHanlicmcm0oCJ4zLV19S8Ow1mJMDjaWCjMy2CkMERBySttFtcNCcsB%2FaRvduWj9kzADyRDI3cbQyEAuEIVYSIwxqrpw6Y4Q0R%2FSEYdDyAl8RNFBAGqlyQndPUoUaiNZ6rA7kuzRlwwg5gvT%2FexImGttYFEjn7%2B0sRDYLCl%2B6AIg32uLg2Sz3gSa2eA%2F15C3NeEwAVjfKMl5%2FLrgPkvevgJrKN8umFfOO5kgY5pK%2FypZKvjpyvQgjnHho32ahWL4n0YaAlsDYkTjcTA%2B1c6s3xCNRCFq7b2PxxsfBiYu67jXDfYAFFRgtIs2NteXfzUySOalA3Jeqnvy06l1BxovhpURa66xUkyE3iqDhhos%2FhkFm2tx2zccTHZPQkgtcalNDQ%2FeH2lJV0vH3Yf%2FDjVfwqMP29E4caPJ7xDM4cKs1dSbFvUAL16Ee0zEyteKJu%2FATva%2BppNOnwb2IZFjfBWvSnesYAaogmwJ0tLsTt4nF72ZGbWl7KJHjO%2FtsQUMD15oTAIN8fSNxDXeHe6R4biDKwxkYuM2sqQSKuEZJ5Lg9K2hDRK6o62%2BGIXqVXgw0E55Nj%2Frra9G3ZMPqq%2BdAGOqUBIOg5UiWhQaiP9ajkkLsj7MuETaPhiGvuFB4%2F1cooumcbUolvsIuSfIIunAEYJ%2FPBf%2Bu07Fkjy3qRhBLlptqh5QVzlwo%2F8amHLLKrvwH61LDCRNzXHH8alCruY%2FgdPSd6ThCe%2FPXUJnkzS%2BEyYUaAPVSqaEY2B%2B21v47TiADIS7ku1R18NHtJsg%2FOCOoVV3j0sTtKAwSpHHCEP%2FTkSMgZRJJaa9pN&X-Amz-Signature=6968f6940b1361cf00b96e31e50f746804a4a6b386bb2a22314114bcd2d9e481&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663JQCF4DD%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIEfnwgEVGz%2BVXufhOdB0%2BWQWvBPfG38ZQ1m7p5wuSrNFAiEA7BIyzMPR7hzNz6ncpZdkjDJfNt3tD%2BLTnwJ1Ajr5Hjoq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDKQM8w0va9CZf6hc%2FircA%2BhGwK7bhknMz8L3mzG%2BI8O65Kx8UGdVMO%2FeithepDGhYcRfL8FFrWIq2Jq9D7id0HegNeTweK76S3GAijg9CBG6viVyaiGcUY17AlANzrzk4Bg93nhu%2FDAU5LjFJSpj7Dc1yWrgc0GtQnLNvh1ysVi%2BsidwK3HGjG5VceTMyx4%2BiQx4p3zfGg9RwyJ%2B%2FAN%2FuwAqkceUZ1LlBB7kkTZRQHuXJ4neymiTsiukVFlYU0LFOPfQbXdBojuJ0nfSghuwiCNrJid8b%2FVx4rJRYQmkKPAE%2BjwKCS4lNwC7g0ZS5nJCPPAaR%2Bvy6V%2BR3VQoGgfxJ8Ff94AwMCT48tDLNkWY%2BjGEqiPdfcAPutmGS3PDrCS4kec4Qx04G0Odgk9KVWMbVxpzkwMqa1xLuXn6WwHawWbCpvmBAjIzeA9QAFoow5uzG2qPfop1mcavX0ygwFmVhUm0C3pwiHDUEgN97mdXFVZvwGZVgCbXbFTRbrSBjZI9BhLnxN5lOCjMhldpMQuOb5RuXR5UooXDtWIQ6Fn6oXb3o0R3UDZDyxWs5Niu0LKu7obyw96Ezs64pe1sflWBJ6veUwUld%2F%2Fg2292FBXIJAxotLvaqcf6ZrDEZBSkgp9khLsqxxTQ96jHl80bMOem%2BdAGOqUB1iOGTk3fGWGQT8zCjWaHKuq0XLK2pHdRgS7XxESGHgJpUq5jxBUK%2F8fXaCp7uFX0dQkerzcP9sWpb9XxlSaT43jGb%2FzyGH9TsYDNGHzdQec4MafR73yAx0p3C8nGfCPZrISUv5HcNs1xSvsrjZXGMqAGY7GAmGQ3dYtjAA76wHxTlHS8FXBYo8yCoIc%2Fx6y2BkGMSAbRcC%2F3TcHtTw69XVXhVK2m&X-Amz-Signature=f20da6d82435f55604703f2976c486beefa2d9d1de5019febdeeaa0b6cc020da&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663JQCF4DD%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIEfnwgEVGz%2BVXufhOdB0%2BWQWvBPfG38ZQ1m7p5wuSrNFAiEA7BIyzMPR7hzNz6ncpZdkjDJfNt3tD%2BLTnwJ1Ajr5Hjoq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDKQM8w0va9CZf6hc%2FircA%2BhGwK7bhknMz8L3mzG%2BI8O65Kx8UGdVMO%2FeithepDGhYcRfL8FFrWIq2Jq9D7id0HegNeTweK76S3GAijg9CBG6viVyaiGcUY17AlANzrzk4Bg93nhu%2FDAU5LjFJSpj7Dc1yWrgc0GtQnLNvh1ysVi%2BsidwK3HGjG5VceTMyx4%2BiQx4p3zfGg9RwyJ%2B%2FAN%2FuwAqkceUZ1LlBB7kkTZRQHuXJ4neymiTsiukVFlYU0LFOPfQbXdBojuJ0nfSghuwiCNrJid8b%2FVx4rJRYQmkKPAE%2BjwKCS4lNwC7g0ZS5nJCPPAaR%2Bvy6V%2BR3VQoGgfxJ8Ff94AwMCT48tDLNkWY%2BjGEqiPdfcAPutmGS3PDrCS4kec4Qx04G0Odgk9KVWMbVxpzkwMqa1xLuXn6WwHawWbCpvmBAjIzeA9QAFoow5uzG2qPfop1mcavX0ygwFmVhUm0C3pwiHDUEgN97mdXFVZvwGZVgCbXbFTRbrSBjZI9BhLnxN5lOCjMhldpMQuOb5RuXR5UooXDtWIQ6Fn6oXb3o0R3UDZDyxWs5Niu0LKu7obyw96Ezs64pe1sflWBJ6veUwUld%2F%2Fg2292FBXIJAxotLvaqcf6ZrDEZBSkgp9khLsqxxTQ96jHl80bMOem%2BdAGOqUB1iOGTk3fGWGQT8zCjWaHKuq0XLK2pHdRgS7XxESGHgJpUq5jxBUK%2F8fXaCp7uFX0dQkerzcP9sWpb9XxlSaT43jGb%2FzyGH9TsYDNGHzdQec4MafR73yAx0p3C8nGfCPZrISUv5HcNs1xSvsrjZXGMqAGY7GAmGQ3dYtjAA76wHxTlHS8FXBYo8yCoIc%2Fx6y2BkGMSAbRcC%2F3TcHtTw69XVXhVK2m&X-Amz-Signature=de7d275e72bea391d85672da8dbecdee9a26720c926c2b2ced188063a7273270&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

