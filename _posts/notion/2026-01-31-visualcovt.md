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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46673K4VJHR%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042522Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG24zZiN1FD8%2F%2BwePHj4%2F57L8sCq%2Bkttz9SI56iCVo01AiADi3E9ti3Z9qEUS4ZIurkz9SNISuJ0giwkMGXcPCXQsyqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMRw4dKkbD52i7nAidKtwD2YQ6B6EcXCBznB6hYKEiK5z5L99pdyLtkZbvF0a3H7yXtjg%2FM%2BqrUkI9ZjzL6i%2FrggCr1FsnjRb0HgcadQPw8G8SIB0JAVDWK%2F%2BGxTHTmKF31%2BidwWZi1AcOMkY0S4ODsqQ8x0OwvExvxuZF%2FcUTxJU0msy4xiO01SWz5HDGJphsdbRsF38rcpHE7Jvf0pmOm4E0OywfkufgLsQbOdQ9h3UncZXUUIsLRNfkAc%2FcgZ2PWfax5XwkqOLuQ%2BPp0eZtbaFGmaWERfikVCfRNH0gaRUb3tlAmjYaBO7x4VVSMXcI2imJ1wmxcPKP7J2cBaJPXF1ildYfKsHxALHCvMBOfsdUNMSiGua1pvwp6xnwFbpxI5t1DWWf3JlRr6%2FMQgP%2FUR9uL60DJFThPbFDZUwTPdZP4WGCRUAkuSRiSe%2FT5aI7irBW1Hrl8bEAxbvSPjHOjAIFeYQHCQvEhStocsn2qICCrQTV2AuAuICrHPRU%2Bn%2BEyzvuH45om8pKrhPJeRIehKOQ24N2gXGGRRlOBjYfxxCvs86zSJWzbOcjTKCKReYsbVLLaQWg321xRkUzwT7nVXMA1kZaZg0PMl3MH9FMgX9bl3cMMdxIwvjIZ1iTAcUq%2F375k3tY0rGaGYgwsIWe0QY6pgG%2FGLePHXvpJE%2BldoubnHjT%2Fu9I82aphi%2FrbIqaY2%2BvVgFJPLZ6Ul1HyCk5rqLLRSS3iOMYVXlPh1njvwxkoHckpmQX%2FlLZYYS%2Bs%2FwMaXwS5L5d6G2de8ZnTiCKBK%2F4Zp8kzmYqIyy2u0oIgAyATB2boxntmiUbs%2FCAWz2f0VgjjKn8fZDrxc5YfM%2BXaFmFZfwMJavMQ%2FqxiBH8m6BxrO18ySZA7Vtq&X-Amz-Signature=f22f8cef3da9cf71e7c7c788e24c64c007bbc5614d58b98f848ea6c63ca2cbf5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46673K4VJHR%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042522Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG24zZiN1FD8%2F%2BwePHj4%2F57L8sCq%2Bkttz9SI56iCVo01AiADi3E9ti3Z9qEUS4ZIurkz9SNISuJ0giwkMGXcPCXQsyqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMRw4dKkbD52i7nAidKtwD2YQ6B6EcXCBznB6hYKEiK5z5L99pdyLtkZbvF0a3H7yXtjg%2FM%2BqrUkI9ZjzL6i%2FrggCr1FsnjRb0HgcadQPw8G8SIB0JAVDWK%2F%2BGxTHTmKF31%2BidwWZi1AcOMkY0S4ODsqQ8x0OwvExvxuZF%2FcUTxJU0msy4xiO01SWz5HDGJphsdbRsF38rcpHE7Jvf0pmOm4E0OywfkufgLsQbOdQ9h3UncZXUUIsLRNfkAc%2FcgZ2PWfax5XwkqOLuQ%2BPp0eZtbaFGmaWERfikVCfRNH0gaRUb3tlAmjYaBO7x4VVSMXcI2imJ1wmxcPKP7J2cBaJPXF1ildYfKsHxALHCvMBOfsdUNMSiGua1pvwp6xnwFbpxI5t1DWWf3JlRr6%2FMQgP%2FUR9uL60DJFThPbFDZUwTPdZP4WGCRUAkuSRiSe%2FT5aI7irBW1Hrl8bEAxbvSPjHOjAIFeYQHCQvEhStocsn2qICCrQTV2AuAuICrHPRU%2Bn%2BEyzvuH45om8pKrhPJeRIehKOQ24N2gXGGRRlOBjYfxxCvs86zSJWzbOcjTKCKReYsbVLLaQWg321xRkUzwT7nVXMA1kZaZg0PMl3MH9FMgX9bl3cMMdxIwvjIZ1iTAcUq%2F375k3tY0rGaGYgwsIWe0QY6pgG%2FGLePHXvpJE%2BldoubnHjT%2Fu9I82aphi%2FrbIqaY2%2BvVgFJPLZ6Ul1HyCk5rqLLRSS3iOMYVXlPh1njvwxkoHckpmQX%2FlLZYYS%2Bs%2FwMaXwS5L5d6G2de8ZnTiCKBK%2F4Zp8kzmYqIyy2u0oIgAyATB2boxntmiUbs%2FCAWz2f0VgjjKn8fZDrxc5YfM%2BXaFmFZfwMJavMQ%2FqxiBH8m6BxrO18ySZA7Vtq&X-Amz-Signature=e5cf0dd2698db8ea15a9918a9ef638619970ebf7ff8d05b36e811b52d9407df7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46673K4VJHR%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042522Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG24zZiN1FD8%2F%2BwePHj4%2F57L8sCq%2Bkttz9SI56iCVo01AiADi3E9ti3Z9qEUS4ZIurkz9SNISuJ0giwkMGXcPCXQsyqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMRw4dKkbD52i7nAidKtwD2YQ6B6EcXCBznB6hYKEiK5z5L99pdyLtkZbvF0a3H7yXtjg%2FM%2BqrUkI9ZjzL6i%2FrggCr1FsnjRb0HgcadQPw8G8SIB0JAVDWK%2F%2BGxTHTmKF31%2BidwWZi1AcOMkY0S4ODsqQ8x0OwvExvxuZF%2FcUTxJU0msy4xiO01SWz5HDGJphsdbRsF38rcpHE7Jvf0pmOm4E0OywfkufgLsQbOdQ9h3UncZXUUIsLRNfkAc%2FcgZ2PWfax5XwkqOLuQ%2BPp0eZtbaFGmaWERfikVCfRNH0gaRUb3tlAmjYaBO7x4VVSMXcI2imJ1wmxcPKP7J2cBaJPXF1ildYfKsHxALHCvMBOfsdUNMSiGua1pvwp6xnwFbpxI5t1DWWf3JlRr6%2FMQgP%2FUR9uL60DJFThPbFDZUwTPdZP4WGCRUAkuSRiSe%2FT5aI7irBW1Hrl8bEAxbvSPjHOjAIFeYQHCQvEhStocsn2qICCrQTV2AuAuICrHPRU%2Bn%2BEyzvuH45om8pKrhPJeRIehKOQ24N2gXGGRRlOBjYfxxCvs86zSJWzbOcjTKCKReYsbVLLaQWg321xRkUzwT7nVXMA1kZaZg0PMl3MH9FMgX9bl3cMMdxIwvjIZ1iTAcUq%2F375k3tY0rGaGYgwsIWe0QY6pgG%2FGLePHXvpJE%2BldoubnHjT%2Fu9I82aphi%2FrbIqaY2%2BvVgFJPLZ6Ul1HyCk5rqLLRSS3iOMYVXlPh1njvwxkoHckpmQX%2FlLZYYS%2Bs%2FwMaXwS5L5d6G2de8ZnTiCKBK%2F4Zp8kzmYqIyy2u0oIgAyATB2boxntmiUbs%2FCAWz2f0VgjjKn8fZDrxc5YfM%2BXaFmFZfwMJavMQ%2FqxiBH8m6BxrO18ySZA7Vtq&X-Amz-Signature=2a80cfa12874aceaf766f15bfa7138e799045ce2a55bacefa8cb6b4b014d4b0d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46673K4VJHR%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042522Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG24zZiN1FD8%2F%2BwePHj4%2F57L8sCq%2Bkttz9SI56iCVo01AiADi3E9ti3Z9qEUS4ZIurkz9SNISuJ0giwkMGXcPCXQsyqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMRw4dKkbD52i7nAidKtwD2YQ6B6EcXCBznB6hYKEiK5z5L99pdyLtkZbvF0a3H7yXtjg%2FM%2BqrUkI9ZjzL6i%2FrggCr1FsnjRb0HgcadQPw8G8SIB0JAVDWK%2F%2BGxTHTmKF31%2BidwWZi1AcOMkY0S4ODsqQ8x0OwvExvxuZF%2FcUTxJU0msy4xiO01SWz5HDGJphsdbRsF38rcpHE7Jvf0pmOm4E0OywfkufgLsQbOdQ9h3UncZXUUIsLRNfkAc%2FcgZ2PWfax5XwkqOLuQ%2BPp0eZtbaFGmaWERfikVCfRNH0gaRUb3tlAmjYaBO7x4VVSMXcI2imJ1wmxcPKP7J2cBaJPXF1ildYfKsHxALHCvMBOfsdUNMSiGua1pvwp6xnwFbpxI5t1DWWf3JlRr6%2FMQgP%2FUR9uL60DJFThPbFDZUwTPdZP4WGCRUAkuSRiSe%2FT5aI7irBW1Hrl8bEAxbvSPjHOjAIFeYQHCQvEhStocsn2qICCrQTV2AuAuICrHPRU%2Bn%2BEyzvuH45om8pKrhPJeRIehKOQ24N2gXGGRRlOBjYfxxCvs86zSJWzbOcjTKCKReYsbVLLaQWg321xRkUzwT7nVXMA1kZaZg0PMl3MH9FMgX9bl3cMMdxIwvjIZ1iTAcUq%2F375k3tY0rGaGYgwsIWe0QY6pgG%2FGLePHXvpJE%2BldoubnHjT%2Fu9I82aphi%2FrbIqaY2%2BvVgFJPLZ6Ul1HyCk5rqLLRSS3iOMYVXlPh1njvwxkoHckpmQX%2FlLZYYS%2Bs%2FwMaXwS5L5d6G2de8ZnTiCKBK%2F4Zp8kzmYqIyy2u0oIgAyATB2boxntmiUbs%2FCAWz2f0VgjjKn8fZDrxc5YfM%2BXaFmFZfwMJavMQ%2FqxiBH8m6BxrO18ySZA7Vtq&X-Amz-Signature=0bd8c5d990ac0a583f5832e15cbbb0bd476fcebe783edfa2ba7aab8a78b6d7ad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466REGXIPFR%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042530Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDfmxJXW3FmfOdYGd2Ld0hpOojBiW3yY3FtG1kXz70H%2BwIhAPsBnoByd04bOPcdr2M2E4LgXXDlOHSu%2Fsf%2Bk5oarokjKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igwlll38upJXHIDISfkq3ANrNK7U6MvqlyJdCsQqraqmuUiQ%2F9HNcM6%2Bse%2B2FcKdcDcpBPgcpBJBsuPP070LvcOtPIfBUZFIp7k2dS4mPeLr3HrsmR2KLSIQnVuAL04xGDkm00h718fstfxZ008RdeB2eHuXiQoC0B6rIvwV6%2Buga6ZSr9u8X1SoJ7RKcz9bPhvoDRdkTb7iioG7lLW02dxoNXYv36qBwMLkKChQeuiGzTjUE98ivQv4OJ5AFxrdO52hMoSsF5k%2FcCagxKNW1FsSnP%2B8GiQHo62%2FtSbLcsOsn6RrzCfEhCxjttj0vL%2BxIQW3zQHKMKF1NpY24MLN4ot9qY16S7SHWqRIo5DGXdBwgQtXckhNwSUc2R1veRAnHeA201bJkaiWm1i8MjqtEVgFt7ajnfJE5zNbBWh%2Byh5qAWmrKFnIJQTPvhh%2FuGLgUXxaqrNucnx5d2bT2gSRCdBOpu6Fyj4B1j8zZ7BWcJg79QxIqMZvK9Lv65EVQ%2BXANEZRxw3XkoaVpoXavbikYEiJ9xmA5s897%2FaVtbwtEZ5Ajdm6B%2FzzEsM%2B4NDIE%2Fhnb88Eu%2Ba3f45sj7r%2FmHG7I%2BIyze0dkdlrljpF%2By0wl4a5jj7NrC4obEmcIV1M%2BkazaAVgoVdvuIs%2FNIiwZDCEhp7RBjqkAeycFLRS8tvx3XdcnW51L0oF%2B7LvhksfjXpD7kXWdUUkcWw2f14rvmxgM%2FKPCAoo%2BuL8ZRcZ4RHGVqqn4EFj7YEuQCOjuDtqtFVM1dXcuO12btzp2nDjZkduizLz%2BHfZbGrKRsxzYzbc4FkwdSv2iZyCsaS%2B3C1dfsSQz0x1R0yKjaZoNdNNzh39Ty7JouScuVBxOQ8QHoyTjZP%2FssdYGFTc4SIm&X-Amz-Signature=2d2be3bc873df5189638f3228473864e80d09e6efaee1a576e9600f8609d1d9b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U7FMKVDC%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042535Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCR7n4o9cPwVI%2Bp%2FptoY6SybwReicJdKEPFozNGXW0XRwIgeIVHwcn6C53u9wb34KrchDk3EUfJz1m%2B6ABo5rwRC4kqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEe3JG6vwSukYDTvGircA3aj6pQZjwkv3%2FA6BwC8fGKN4p8SHfp8c8PKRhfE%2BqhFkh0Vg%2BQ69WezFi9Lek9BgeOKd9vYHi%2BX49OyuZGbqrd5QTJhZUJ%2BbW7G5VTkadQAaw1tpSjup344yOTad3JnW8U5r%2BPDFzoKIrbYMdOwIea5o4txS0NYQgjxS2CPwp84ZRaxWJiN9zJGiJEmL%2FXqozLOUCa2KOy7eLpTd0LIJfDaevPAv0VEgnQs8%2Bokiph22Ji7HwZazjzrTtvEwTihyVw7pa3j3nA%2BoihsTA0%2Bb%2B1V%2BbxDB7uEVlLzePmMnuAunEP73o2eUAPm7snCp3XnMTOpzBq%2Fv57I4UL%2FVpjz6m0y1ss%2F6SJDKqFtjaSZIJUfE07OUWmlX1T6HeFVWsL1u4cjMaTkchDF4nIAL2eRLrqBQw9kB5cX07WL6qznpvvrnulzXHW4VxKzD%2BAX%2FnfJ1RmJNP0EFuj%2F9D%2BYkVJjJMIl1TCMF%2BmxGORzJFxeeS6Fbg9oz7TevKE2PWL8n3JB%2BC70yXIbCQClFb2IU4NvRTZcBMbloLBDrb6A0Klq6gRNLaaoTCRqPiRWM9yXFqqUKqSAQ90HVTsKx3YvfXOdaoAf%2BTkKbSe%2Fr4jj8Av5VumwR5qRRgnkDoEQPyyQMKCFntEGOqUBqvedPa9siyIrc35PBI2FEp9HtubczPp0%2BKDNdf2ip2Iz8o7EDe3s%2BUZNOzoyZJmL18HC7zbY1RKeO2m6awSJ8n4NqgkmQh8mnCKgJYOUpOzIJOiCawYNIzNmycCL%2FBZixUPKHPBZ3GwjSfGNFzTYymwX6G8mZD%2B1C5LZH%2F0rAu5Mrnp2fwwDEIWhBrWhgjQWFdJgMHPw%2F1X6kFyqd%2FG91pui0ds2&X-Amz-Signature=2a28201b428f2ccef31734f8acf75df355825dd4a586c3d219b8e0e78ee53dbe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WKFA3ERY%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042536Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAXTK6IWvnDBB9TnFt%2BnyxOSiPHnTYfrYcpl86DTO%2F4iAiB5fSrofEg3MrlIA1b1SQXDmDJ7YK5C9qVhKyZ5bHp%2BayqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM7Mxhk2mbJkyAe5z1KtwDrNo8HCfsOG16Ee5ZVE0ie2HoqTnPBQiyHhQniR6QW9E%2FH7%2FX4teG9IWFD7r8HZ2FK5hgy%2F42XmiigGjj4q9Vp0a94JXgGq5%2F0m9buHZ00bs8Wo1WI2S2WX%2Fb9p0jXF7Y100kirOR86XM4G0Au4ciVaw63EtXN%2F%2Fu4R3p5Iz9e1a2%2BU1lrtoPw%2B4OvB2EcM2pyq0d3UOmaJgBBsLXX%2BFKu%2FVrQNaPW2SgZTnhTOgjzvh%2BglwfBHVvNZoz8AN9%2FDa%2FDMmI%2ByktrNYKGrh1ntwQllyK%2FGfwMNqEuS52CEPV3HocDRTwmShBvGAPUZ%2BvOtCelnva9nFwhwoQdJsTfIc%2F3dIj%2FOqdwetHanR5h%2BBloZeVkuonuUlZF9%2BjZBh2LhPB54CYjeYdd0HELaBLgxc6NLyRLSoTTllPBKaEdt5Rc5uq3%2BSVPqopz5fWwLlJcPSmQDsBOFzE%2Fre2P8wz4R5hGCYYCFzaHuZcvK9Jbeg5vmS80YCk9AhEJ9yjaQPdsOux%2F95xu4xZi7MSrQxRR%2FCUr0Pl%2BMhjoSA88zPBT9yHtuDzMSZpDRuOMFmgBGuXDhrWcRaycRIh4R5ZNScrac%2BeVj3stitFSEh07UEvqzpIyMEFAiXpwmoVzGWOIKcwmIee0QY6pgEjxfG4i%2FGXOP1KLMFZsg1IRIR1P2nKZenx1vPLp5DujywuBYladZbGseHoxBO%2BCuHwer69pqrVbnXNJdzA8NYsqLNgI7cNVFJ1QWxqiKsBMLS8acMAn4hhlONDutiZaYHGAugw5fL6r2tsyzqy82FG4UT09zjZCxbUArvG7x7OF7%2FyNvMGiJhW318%2BuzH%2BxnnelP4cNYJHJaaZktyUJHQoMSvBsohA&X-Amz-Signature=3bbb60744c02a689f9cf234b4931bfb91d410c0890277751f9f835992a4df027&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VHT47XWL%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042537Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEgBO4qKHDsmpyhB6s2LQet6WifXsiD753JjI7KHb%2FLFAiB7%2Bhv8b%2Focq9M8dw5E2HFhE3rVpWeKHYDVYivEYmmaWyqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqNDuMLB2hNVThEGMKtwDEcrHkCZCAS9UYY3c3SB8xCke%2FT1Nf4exAzdp5fqSAG%2FAjB5PLlhMuOE6DCdjcAsU5wPwiQ94x9HWMxRq8%2F12uCFyN2ty64vEp1L9j2PyWCRFu9%2B3p%2FDaCjPH5kXWo3Bk7cAX8SUEMPQ9J4Xy9H%2F0hN6mZI4RkZ99qiG5RQV7xiGtWQXkIlUZK28LBqjZDggNIOMeP2yqqgMULSnGI43WjvvCVFpxp%2Ba2ATSSk3rLxFK30SiSqQL6%2FhZ%2FV2VGOlcc9Z%2FNq9HoJSXYGgJzpqBrI%2BfrVUIV5o%2BzIPhgT2iCqCCZgZplA%2Bc91mJcwU%2BoBGhdhiYhQfJQoiKXaKYGFf1Khw6U72i4wnt%2BNfXWQGXKA6G6EnWCM%2Bxzmi1ZehqTlzjQBarl7EWchPKhc%2Bf6vX4UB0G%2BaStQtOhDjAYWYIHIvUX1dMWHUqr9s87OLdjsDG4xrRD2uydNzpckFLU0pyfmbXwL0GGOoJXSg0Z1i%2FnqGqnXU9qPqW5c%2FLVKl7tfufTDo4dw1hIvvs9UL0qr58se5s1FGGOFluiZHGGPquIJYUl4XLizCgcqn4cQW5IE1gh6rBkolTuY8n1QSO2YziJTzOVqWLnPAQtCLyOYdWZXdOFRnSFL4UP3Sko7%2FmMwsYWe0QY6pgHY7qFNxGO5k7MfMACIvs1tiCpbgbfma2Ree68jZQWfeei8xx11E7DXKQA796xtyTBrVBIk1ha5HKswbVyhjZbbpm%2Ff7A7ETQ7rVw7dY41dMv4PyeKuijazcXxhQ2rFzOgwbFsSIl2lhns%2BCVdS%2Bx%2B37mkoaS82a46NBgH0fVpuczkKPgEXQdogcOMz4Q4WMIZ6hL%2FeiIgU1mIwihrmJVdZ7iiSzQbx&X-Amz-Signature=4386ad691e9f1eefcd4ed5c7ceb899c32f4210dcbd40f9b79449cdd137e09643&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46673K4VJHR%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042522Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG24zZiN1FD8%2F%2BwePHj4%2F57L8sCq%2Bkttz9SI56iCVo01AiADi3E9ti3Z9qEUS4ZIurkz9SNISuJ0giwkMGXcPCXQsyqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMRw4dKkbD52i7nAidKtwD2YQ6B6EcXCBznB6hYKEiK5z5L99pdyLtkZbvF0a3H7yXtjg%2FM%2BqrUkI9ZjzL6i%2FrggCr1FsnjRb0HgcadQPw8G8SIB0JAVDWK%2F%2BGxTHTmKF31%2BidwWZi1AcOMkY0S4ODsqQ8x0OwvExvxuZF%2FcUTxJU0msy4xiO01SWz5HDGJphsdbRsF38rcpHE7Jvf0pmOm4E0OywfkufgLsQbOdQ9h3UncZXUUIsLRNfkAc%2FcgZ2PWfax5XwkqOLuQ%2BPp0eZtbaFGmaWERfikVCfRNH0gaRUb3tlAmjYaBO7x4VVSMXcI2imJ1wmxcPKP7J2cBaJPXF1ildYfKsHxALHCvMBOfsdUNMSiGua1pvwp6xnwFbpxI5t1DWWf3JlRr6%2FMQgP%2FUR9uL60DJFThPbFDZUwTPdZP4WGCRUAkuSRiSe%2FT5aI7irBW1Hrl8bEAxbvSPjHOjAIFeYQHCQvEhStocsn2qICCrQTV2AuAuICrHPRU%2Bn%2BEyzvuH45om8pKrhPJeRIehKOQ24N2gXGGRRlOBjYfxxCvs86zSJWzbOcjTKCKReYsbVLLaQWg321xRkUzwT7nVXMA1kZaZg0PMl3MH9FMgX9bl3cMMdxIwvjIZ1iTAcUq%2F375k3tY0rGaGYgwsIWe0QY6pgG%2FGLePHXvpJE%2BldoubnHjT%2Fu9I82aphi%2FrbIqaY2%2BvVgFJPLZ6Ul1HyCk5rqLLRSS3iOMYVXlPh1njvwxkoHckpmQX%2FlLZYYS%2Bs%2FwMaXwS5L5d6G2de8ZnTiCKBK%2F4Zp8kzmYqIyy2u0oIgAyATB2boxntmiUbs%2FCAWz2f0VgjjKn8fZDrxc5YfM%2BXaFmFZfwMJavMQ%2FqxiBH8m6BxrO18ySZA7Vtq&X-Amz-Signature=9d1a4259d0e4e34956fdb1c8e94dd15b58886cb221044ec14c762bf79fafa7f9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46673K4VJHR%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042523Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG24zZiN1FD8%2F%2BwePHj4%2F57L8sCq%2Bkttz9SI56iCVo01AiADi3E9ti3Z9qEUS4ZIurkz9SNISuJ0giwkMGXcPCXQsyqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMRw4dKkbD52i7nAidKtwD2YQ6B6EcXCBznB6hYKEiK5z5L99pdyLtkZbvF0a3H7yXtjg%2FM%2BqrUkI9ZjzL6i%2FrggCr1FsnjRb0HgcadQPw8G8SIB0JAVDWK%2F%2BGxTHTmKF31%2BidwWZi1AcOMkY0S4ODsqQ8x0OwvExvxuZF%2FcUTxJU0msy4xiO01SWz5HDGJphsdbRsF38rcpHE7Jvf0pmOm4E0OywfkufgLsQbOdQ9h3UncZXUUIsLRNfkAc%2FcgZ2PWfax5XwkqOLuQ%2BPp0eZtbaFGmaWERfikVCfRNH0gaRUb3tlAmjYaBO7x4VVSMXcI2imJ1wmxcPKP7J2cBaJPXF1ildYfKsHxALHCvMBOfsdUNMSiGua1pvwp6xnwFbpxI5t1DWWf3JlRr6%2FMQgP%2FUR9uL60DJFThPbFDZUwTPdZP4WGCRUAkuSRiSe%2FT5aI7irBW1Hrl8bEAxbvSPjHOjAIFeYQHCQvEhStocsn2qICCrQTV2AuAuICrHPRU%2Bn%2BEyzvuH45om8pKrhPJeRIehKOQ24N2gXGGRRlOBjYfxxCvs86zSJWzbOcjTKCKReYsbVLLaQWg321xRkUzwT7nVXMA1kZaZg0PMl3MH9FMgX9bl3cMMdxIwvjIZ1iTAcUq%2F375k3tY0rGaGYgwsIWe0QY6pgG%2FGLePHXvpJE%2BldoubnHjT%2Fu9I82aphi%2FrbIqaY2%2BvVgFJPLZ6Ul1HyCk5rqLLRSS3iOMYVXlPh1njvwxkoHckpmQX%2FlLZYYS%2Bs%2FwMaXwS5L5d6G2de8ZnTiCKBK%2F4Zp8kzmYqIyy2u0oIgAyATB2boxntmiUbs%2FCAWz2f0VgjjKn8fZDrxc5YfM%2BXaFmFZfwMJavMQ%2FqxiBH8m6BxrO18ySZA7Vtq&X-Amz-Signature=9e41df6caae5dad60b296efe302daf362edaa64aaee577d434f62acd9e39be64&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X5NF2K26%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDt%2BinonUprPblT14O1pRtUGHz8EyqYkySR6Nh%2F120V7AIgG0QbapWArgd1IWhPkHyw%2FbhVwvaHzPmtRSVco58hOK0qiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOf2PQd%2FeQzCI%2B7%2B%2FircA%2FLWfS%2FwUUtvCUzocza5ncGclncguRF7FIybo0llwFn%2F6P2HRLZKrYYrM%2FCLBKbEd4n8ZUSMSDiceg6njL80%2FH35Ea0cZokWWh2qs08rUREaow3sAf27kb8aRkUdb5ULlw2AC5D3CJCOwMyASnta5RNoBrWEqX7yfaNkoSw%2FHxVmo%2Brw6FN8QRg1ePBGGw0b8UTwe9E88hR2kqYzSYK6GaIz22dLD6oxhTausw%2FsCiXDsHrVSdZHumYdRnkJGGVxNvlMlELCRyqvwXzg%2BcB7wEAkQUtJL5JP0S2QZmRTAIOsK%2FR91CLsfeHXatDQnUZ1NUcrJ3j2t5N80xyeJOTnDyYgLs%2BHeqMHdZaX5dfYYDiGlfT2Nl0O0Hyn8ABf%2B8merFig4tdCWqLYphMgvjCSzEhoFrZnM%2BRmAiHKSrwM%2Bq4cftonjXkspQf%2BTaaBDtqmq3EiIewrFXhT2HNshv9Fv%2FON0oMfdME5KUxLsKePyUbvCzd1ckc6va5qJFD2bmwdEmxVz0MnybHvPClJjTLDCgyWJSbw8uEfHdRB9u58j%2BNq%2BAxotKJz5IGRxthNgfxXx%2BZsKwT83Wow18XFmQ1mgr3%2FB3RjT8hVTkYUosacDmn3dyFwY5CBTPDb%2B5MtMIiFntEGOqUBBbd68sBK1UTvCI5yxW6pG7zYw4E2CafwR%2BCmT6NozYogR9u%2B5fzOqiZoZyJuCa7V4QtpwkAsBv%2FlEghvPEUp53HybMoPuqswYx3bc9wCeIuWVjA96HrTJ2okudFOK%2BAuXCQ2BgKEQfm31J6Hm4c5mS1FktRd3aYOdOHXF6i5B0NWcdBy85LboDfEAKZwfKS0zImwmH39akB6VAwuQM7o7R1zWNV3&X-Amz-Signature=81b3e41cbfb2ab14bd7ac56994e166e1f3f5d78e3a634f55129cccf15798f177&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46673K4VJHR%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042523Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG24zZiN1FD8%2F%2BwePHj4%2F57L8sCq%2Bkttz9SI56iCVo01AiADi3E9ti3Z9qEUS4ZIurkz9SNISuJ0giwkMGXcPCXQsyqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMRw4dKkbD52i7nAidKtwD2YQ6B6EcXCBznB6hYKEiK5z5L99pdyLtkZbvF0a3H7yXtjg%2FM%2BqrUkI9ZjzL6i%2FrggCr1FsnjRb0HgcadQPw8G8SIB0JAVDWK%2F%2BGxTHTmKF31%2BidwWZi1AcOMkY0S4ODsqQ8x0OwvExvxuZF%2FcUTxJU0msy4xiO01SWz5HDGJphsdbRsF38rcpHE7Jvf0pmOm4E0OywfkufgLsQbOdQ9h3UncZXUUIsLRNfkAc%2FcgZ2PWfax5XwkqOLuQ%2BPp0eZtbaFGmaWERfikVCfRNH0gaRUb3tlAmjYaBO7x4VVSMXcI2imJ1wmxcPKP7J2cBaJPXF1ildYfKsHxALHCvMBOfsdUNMSiGua1pvwp6xnwFbpxI5t1DWWf3JlRr6%2FMQgP%2FUR9uL60DJFThPbFDZUwTPdZP4WGCRUAkuSRiSe%2FT5aI7irBW1Hrl8bEAxbvSPjHOjAIFeYQHCQvEhStocsn2qICCrQTV2AuAuICrHPRU%2Bn%2BEyzvuH45om8pKrhPJeRIehKOQ24N2gXGGRRlOBjYfxxCvs86zSJWzbOcjTKCKReYsbVLLaQWg321xRkUzwT7nVXMA1kZaZg0PMl3MH9FMgX9bl3cMMdxIwvjIZ1iTAcUq%2F375k3tY0rGaGYgwsIWe0QY6pgG%2FGLePHXvpJE%2BldoubnHjT%2Fu9I82aphi%2FrbIqaY2%2BvVgFJPLZ6Ul1HyCk5rqLLRSS3iOMYVXlPh1njvwxkoHckpmQX%2FlLZYYS%2Bs%2FwMaXwS5L5d6G2de8ZnTiCKBK%2F4Zp8kzmYqIyy2u0oIgAyATB2boxntmiUbs%2FCAWz2f0VgjjKn8fZDrxc5YfM%2BXaFmFZfwMJavMQ%2FqxiBH8m6BxrO18ySZA7Vtq&X-Amz-Signature=8a0f524bca2fa3dd42fd86ef8d2d1fc446e9159846ebf73997b3bd0ebdcc34fc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663BULCDGA%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFJW1S2GPDcj7LwnMcyxsWMXttSz%2FyGq6NTQrjgfrSrjAiAy1vcOUfnVVXoq%2BE00Ho0wGaEwmdpsk8BxbcLMzn%2BgiSqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMAjV8fzvg67TyRuiFKtwDyYTM14akhM6SA4asAbFhIGHBn%2FVPe9FG5XyyFURhhUJnTXaFSJs60mbuqq1sz4DwZknPkKjYAKEcFpV66SvftEkK49SjUsQojA%2FGD2WcHRpX46uqdvDViGyUxqSJDRSkl2yY9ERniiD8nvjXeU0tG8iZ77kp9OG7Cho4VL%2BsZX2Mao4wt0oI4Bwz%2F6vmRfAjuPyh5j2X0mMuzB7TxXSEeMp%2BKQ%2FYT9L1Wp%2BucDw3nN3r7v1bb19teBd0xG4yLLkOQCaVLEAmDEJzDAU5ZXZnn6eVm%2B3tC7SQxGu1oEuTU7BQFHt9w3kvwqv1q%2BzjPUqQs%2FEizmk%2FknfNdLdYgBj%2BGIHk0vS9ElqBwJZCa08bPTlY4qh5tpolxzHJqQYEK%2BQ04iKiQF57KiLbuFxp4I3xQVklSdig5n4jbyTlKtvfHrsUUnAM7xBsZtNHC1XG20SKC0BxnzWQevZZ25kwoT3O6eeBmbRjrW0bmmvHyZfkWkfYmPixuNmrjU%2FVg1DPMbklpcozwsA3bL09xuJtlhPrfkvGz%2B6TRvvdx%2FwOG%2F8askggYQkhQctPlQw7hau4O3d%2FpuHWeAkqp19f79jkaALJ%2BOq1tFW89kFBld8SIzFQ0eBOwOW4KKIgggV%2BpJMws4We0QY6pgGDr8SLoXaWbtwLSN1siWzK%2BsSQrgKsBjrN%2BdHltr0S5aYerMSFhNmH2c12FSRHBbsRQ4XK04KH800WVyRzubYvQ2XJ5M5AYqsdC%2Fxr08xhkp4S4DZmzk49ThSE8%2FOwM%2Fjclm%2F1YZ98lLVGhkYvh%2B1q1WOZjFDq1qVZNraS9W2YJ4Y0NC9O9UDaIt8fSt9W9rp1jSpovTZ4wBVoyphpFFLSnOfBI8rf&X-Amz-Signature=cae5584c599510f45bcec35f8e2fdd27c187dfdc237554315aefdd7bf67057b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WRYELZCK%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIClITikDkUTYKxhKD2veOzpcmNOHwnJxCVA4nFRCm8z1AiAdwZNdkhiFIGB5IXkMdHmPOiU8EKYCU8TQyBpKcuU3TCqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMXJpM%2BsA2Z1tFdX1JKtwDU4F66hEop6Cx2hWutlJaklIW1zDW0i4DCoqmTpSQ6VGJe7cjFZEVOj9tV%2BOj2km1j5Pu43UNLXuDqEpiXpUIvVLodhWOYiz2yMLWwEemPRQJnEPgKeHIavHpaYkmbqHffnqY%2F6AKMTQXnsi0sLEykpLbNwtfP6xnW682sq3ziaFfB0YIwOVK2EgwB%2FvThr%2FfAzQjKPmRqIWIRpbyaCOOTsYRAA8RYKTul6b94yb%2F7fq7MewoIYMILk4bIVFq%2FEyUhretSYGlY%2F2QwQckHX48nqkRxP0JRwwCuY8fh%2Foy4eBPSOWqENUfJFYttHgGEl8d%2FqAcPIPwqNLHF5RuFuoQ8w1cwysRrWNSdf%2FPKCKXpgbj5RlFNE4kA8K1vUxxf3B5yuGsVHbJ6Igl2kiiL3g5MbZM74%2B2S05Be1oafo0TMZri9wwIquIEeA%2FRD7P5l2wXXqXLUvIKhTCC7ILKxwJ3Z3V3%2By%2FrgztGtpa74ti2vswzc7wAGt428QH8raclsgS7vTZLNQ%2BkojBCx4mMGqAdp2WxCP%2BOA1z8kjeO6VFY3nQhmQItP%2BGEuaxS0y1%2Bm0VmJKzJgsGkaguRzDJj8FelW%2F%2BQyMyVnpaLHkvFVd89i8BktPzNvMRpR6nOqD8wmIee0QY6pgGNzIZJZKz8hFETlb441H3fcDEGUlBsXjiD62BBg0W%2FHmWwN%2BbVJFA5lzSjChJ77G8PPrpiK0YaFtbcOosGslqeJPK140MfRlZ7iS4dHvKjP58zNBZe0f1wDC6YUPPImO42vZhn6npE2YqfhjaAvrraLzttzJwhpXBAl1PMMdTtropO7LIfg4PtCMT%2FNm0fb5wCujW1%2Basn7XVTzdUU7qY1%2FxkVKVOj&X-Amz-Signature=d3d386bd64e496df5136254f4a3a55abe1263d11288c2be31e3b33bf1dffb88b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q5LG7IVB%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDjBgNavHTYEXwEkmT9dTSLGnqVybsRQv6tK%2F5bWxGMbwIgVYA6NdGeWhE3ot6M4oTIvM0uaSlISlMh5Q4b%2FGGX5h8qiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDKbvMjBpQPPdsQKxyrcA1FqgHWpVcCiCibuzHyKkmTnrfBlnyuutyY3u3S%2F%2F0TuQ%2Bz%2FlfKOKvV5YQvlUhIcgn6%2BbWb91Coivb2D5mFvK3kduQQJg3UORzNfkeRW%2BNIweprK11VR2GjWFoSWxb6TGHeeCWEyoO8LgpCwyUZNN4sI6P5dE0fIzRMx3tEO%2FzVGyT0yXBeAKY%2F6X4Qjddw1Tcm2%2FwwkBcK%2Bn%2B2n8Pqic8Soi%2Bymh65dw4IMLNhgvbNB%2F4%2B3m89aEO%2BvOVyIgR%2ByCsPXzYIMJ2RjP4fdZHYd%2B3BJUxu4Y4pJxvtUVZNhl2fj9PLK4qgL87J4eCtdoOXicIdMbdAAucWDEJY6uOV8kzVXniHS%2FTg6s5ZWn9HsTQqXtKM561UG5ZSAvv8nYrJHzQU%2BPPTC5%2FPWXs2fb0J09sbmg9VDDglg0NBV8EIbsLh2zEkV%2FrEriLW%2FCYTKv3DuDkCkl%2FmPJ%2Bkn1Fnxusu0wvvVX5P88PQgMzaBtOnRyxfbcXLp1C2GDB1Saj41SxtcjNhwlRPpf8TYc1rnn5ywqmovlB9sjTv8Sx74seC0EOwfRxH17Tolgp30X0APF1jYjZyTNKi%2FUXjUxxJcCjNX7UTQEOOaerf2iPtdp9Y9V%2Burl6mbJW6CPVDsCDcsMNyFntEGOqUBGtv%2B9LAQrPVYR%2FrCgCTN0fVukFpapR67T4n12dfW8xMGX3RYzIobOpTFiA4pgIEcn%2BaJbhtBrPim1j8JCNzJFdGUKyR1Av9v5lg1PEDcztMuDmokZ%2FhxprvvTnwwn5vBVvcW9q19GJdRKnZnti0%2FzR6RE%2B4QIiTxkt93Ux5rO5T6oNInUG3YVd%2FMLzL%2BHl00dAf%2FD0B0VBKbb42Q0Y%2FCQSogwkPt&X-Amz-Signature=b8877d486f659d68506e5b874447e7d3bc817ab361604ec154e61f8f80943378&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVPND7RX%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042541Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFWV6GErai6AsAgWmr8qGV5%2BMQS1M09VDyy9zbDcovLVAiAtcNYk3%2B2nZqQGuyIFerLe%2Feo9R%2BKHCROlWv0FZlTsfyqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMvCiSDGIBSxVtXuHRKtwDieMKypArbx0r9n8nFSh1qml75yF0isWVuCWqO43dHTLfwsLDBLf%2BDTQLLKy9PkZuy9kqnnTFIawyopg17F79ELVoTLZMqfRNMgTLzhK8hveP48xkNIHQnM3CHayA8sgNeBFXihy6r3UzrI4o7Jr%2FLP2F4E%2F%2BTGSCMZDZKui4fxXPy2zyfa7EXi23qe3%2FK2Cto4FjeSMLwN7TYVTl%2BGfOGzvBpUIhLINLtNXjsya%2BWBOQpbTwaj%2FxLAMfxYUxaACkprkMMUxMrdqcdIIVt6ElaIMdDVLYk0QTLGZP2QOZQfvLKe6SES2CqbL0M4gI0%2B3fw%2BnEnj2lqSYHmbxn7Jt%2BcoBhti3qtULIlPf1ePgiH46WFFkmuEMYWRf2v4VjMOxBxN19Tjg0dsC6Fgtk5o%2BgvsqcPVOBw47jxp4UXSKixqv%2Bq%2FA0uKshppo7Xq0XgB0Udq5kg5YTII8ITYvcF3DC5nfWtJr6mgN689CF1C8G82Tq2wGj0rWwVcDTwTc%2B9Tvhr38b%2BotNYvmx7QHtDM61L%2BFv2K6PNz1t9ZCJzFkJO0UjwWSVW5Z34OSUoAW5Rb7iTgaJL7PsrDVJ25scQeLPOwza0b4MT3wYWjJtY%2B6c8sLxbN7uMFTvKimBxJ4wmoWe0QY6pgGFzJBxA7ZtHOGFN%2BA03It%2FfJpUyFvtL2m0E%2BmwK2nutXIGJ6IpJ4VPiBm41JSo8sy0nT4BtjfuujywWq29SrxvzdT6yewYmTXzH4ZyZsvrMmXTqeuoOAHk56fEhWMycmJs4iUqHneM4fIhDNEbCc7aFtuAFgU1ETdE0TvSve8L76T9CbxHQ4YhU2nofSUmdnPwoPOP5%2FkjQZ42sVhZQOo%2BDN1JRA8U&X-Amz-Signature=92ee1d66430e3636a40133ef19a82a8275702deeb5dedece8bd66b02be8bb2e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46673K4VJHR%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042523Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG24zZiN1FD8%2F%2BwePHj4%2F57L8sCq%2Bkttz9SI56iCVo01AiADi3E9ti3Z9qEUS4ZIurkz9SNISuJ0giwkMGXcPCXQsyqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMRw4dKkbD52i7nAidKtwD2YQ6B6EcXCBznB6hYKEiK5z5L99pdyLtkZbvF0a3H7yXtjg%2FM%2BqrUkI9ZjzL6i%2FrggCr1FsnjRb0HgcadQPw8G8SIB0JAVDWK%2F%2BGxTHTmKF31%2BidwWZi1AcOMkY0S4ODsqQ8x0OwvExvxuZF%2FcUTxJU0msy4xiO01SWz5HDGJphsdbRsF38rcpHE7Jvf0pmOm4E0OywfkufgLsQbOdQ9h3UncZXUUIsLRNfkAc%2FcgZ2PWfax5XwkqOLuQ%2BPp0eZtbaFGmaWERfikVCfRNH0gaRUb3tlAmjYaBO7x4VVSMXcI2imJ1wmxcPKP7J2cBaJPXF1ildYfKsHxALHCvMBOfsdUNMSiGua1pvwp6xnwFbpxI5t1DWWf3JlRr6%2FMQgP%2FUR9uL60DJFThPbFDZUwTPdZP4WGCRUAkuSRiSe%2FT5aI7irBW1Hrl8bEAxbvSPjHOjAIFeYQHCQvEhStocsn2qICCrQTV2AuAuICrHPRU%2Bn%2BEyzvuH45om8pKrhPJeRIehKOQ24N2gXGGRRlOBjYfxxCvs86zSJWzbOcjTKCKReYsbVLLaQWg321xRkUzwT7nVXMA1kZaZg0PMl3MH9FMgX9bl3cMMdxIwvjIZ1iTAcUq%2F375k3tY0rGaGYgwsIWe0QY6pgG%2FGLePHXvpJE%2BldoubnHjT%2Fu9I82aphi%2FrbIqaY2%2BvVgFJPLZ6Ul1HyCk5rqLLRSS3iOMYVXlPh1njvwxkoHckpmQX%2FlLZYYS%2Bs%2FwMaXwS5L5d6G2de8ZnTiCKBK%2F4Zp8kzmYqIyy2u0oIgAyATB2boxntmiUbs%2FCAWz2f0VgjjKn8fZDrxc5YfM%2BXaFmFZfwMJavMQ%2FqxiBH8m6BxrO18ySZA7Vtq&X-Amz-Signature=1936ced4f588ec6095cfd41413bbb26113cfda6531ca7fc26ae17663545e2adc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46673K4VJHR%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042523Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG24zZiN1FD8%2F%2BwePHj4%2F57L8sCq%2Bkttz9SI56iCVo01AiADi3E9ti3Z9qEUS4ZIurkz9SNISuJ0giwkMGXcPCXQsyqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMRw4dKkbD52i7nAidKtwD2YQ6B6EcXCBznB6hYKEiK5z5L99pdyLtkZbvF0a3H7yXtjg%2FM%2BqrUkI9ZjzL6i%2FrggCr1FsnjRb0HgcadQPw8G8SIB0JAVDWK%2F%2BGxTHTmKF31%2BidwWZi1AcOMkY0S4ODsqQ8x0OwvExvxuZF%2FcUTxJU0msy4xiO01SWz5HDGJphsdbRsF38rcpHE7Jvf0pmOm4E0OywfkufgLsQbOdQ9h3UncZXUUIsLRNfkAc%2FcgZ2PWfax5XwkqOLuQ%2BPp0eZtbaFGmaWERfikVCfRNH0gaRUb3tlAmjYaBO7x4VVSMXcI2imJ1wmxcPKP7J2cBaJPXF1ildYfKsHxALHCvMBOfsdUNMSiGua1pvwp6xnwFbpxI5t1DWWf3JlRr6%2FMQgP%2FUR9uL60DJFThPbFDZUwTPdZP4WGCRUAkuSRiSe%2FT5aI7irBW1Hrl8bEAxbvSPjHOjAIFeYQHCQvEhStocsn2qICCrQTV2AuAuICrHPRU%2Bn%2BEyzvuH45om8pKrhPJeRIehKOQ24N2gXGGRRlOBjYfxxCvs86zSJWzbOcjTKCKReYsbVLLaQWg321xRkUzwT7nVXMA1kZaZg0PMl3MH9FMgX9bl3cMMdxIwvjIZ1iTAcUq%2F375k3tY0rGaGYgwsIWe0QY6pgG%2FGLePHXvpJE%2BldoubnHjT%2Fu9I82aphi%2FrbIqaY2%2BvVgFJPLZ6Ul1HyCk5rqLLRSS3iOMYVXlPh1njvwxkoHckpmQX%2FlLZYYS%2Bs%2FwMaXwS5L5d6G2de8ZnTiCKBK%2F4Zp8kzmYqIyy2u0oIgAyATB2boxntmiUbs%2FCAWz2f0VgjjKn8fZDrxc5YfM%2BXaFmFZfwMJavMQ%2FqxiBH8m6BxrO18ySZA7Vtq&X-Amz-Signature=3b48e262b243330322a2e015fd681a61a83e58bb1e11658057b0bc595c1db9b2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

