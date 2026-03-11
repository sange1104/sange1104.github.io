---
title: "Chain-of-Visual-Thought: Teaching VLMs to See and Think Better with Continuous Visual Tokens"
date: 2026-01-31
categories: [paper-review]
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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNPS2ERH%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025030Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB6oF3p6hH%2Bqn2lwicoc%2FYq%2FbZ7wYEr5vUBispUSZuL8AiEAwYBNYX6UiVl0WvVT6kWnO1SlGiPcJtEiP1qObrN7dywq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDDM%2B6%2F2t%2B%2FIazalvpCrcAwxfP3i3zMkceby0KkyG%2BVpVP5ZwGEwQlVuhQd%2BvElsMh8Q9HfYrhEVj%2FU1xv47ZPeh3qBvs56Ea9UH4%2BMo%2FE%2BBonAwYBALpe%2Fhk2Mo%2Fy9WW8FYGYey90chgwjYAqTf%2BunXzVrwxFlYq1J5NyckQCDYw5FVo5D4JvH%2Bl9bCTRsp03keYj9Gpg9tc9kDPFlkV%2BN7008%2BbDvqGKPS7xHUNcpgm6O29QfNkfJiQzY8LG0HUlFCb6eXnH%2BCbb2IdBJkxVA8g%2BENmnq47gR5iIyQQNYaWjAWALmmGuFTycOzrulhTp9onTRoPPpYSz%2FoF7lQ4NQ0j1kg9zTkJeaaGUW6NmKSgzIH9DJoxwCQ5%2Bp9yjjnV0vQnypXwwMpdzYU6qOWmWLBHajkOZj%2BhKAqDzo3QPf4Ao657CLvkJx4e%2B5lKtm5LgMt8chhdHqZlkkwNewZV5qXNGKSQbpSSbjAZ9cKzDtYkWOrbYcBSJ2NEOYwD3r8Uh3Dnx34ADliJCVjcqnfn3S4lDUCwUu9pSM2nQ6lS3Ssmz2jQiJRzj%2FiK5BSGjhDWTJEYZKfFzu%2BtW7evjBBBuVuS3t7OEXh%2FvcocAe4r3fmNh3lqlP27IfzSE7CxddYmOyzAVE8fvreM3hy0MLfyws0GOqUB6dd%2Bx39C6T2BDGNpfNJhqQi8LN5RlpZyd%2FzEnU96RmrFlLZzIL%2Fgv2Xpf2E1AqlpWITNYN7RK7aiPKUD%2FrYGJ%2B0O9qimu0TTNzVF%2FtpCoGji3UN3e8UbAmJgUlPgT1BZUy7oEHrVEzKY8IY5E8v%2FDe9tHxmpqmFUpNpVCRTTBXTE8pxBPksECCyIdHqwWRxvUR8Lya2YyyGuy7K%2FISSahcf3sw6z&X-Amz-Signature=5e8542bbb59f7449f5caf6908ce5fe967545fe41b320e160eda5048fc9fc8aeb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNPS2ERH%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025030Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB6oF3p6hH%2Bqn2lwicoc%2FYq%2FbZ7wYEr5vUBispUSZuL8AiEAwYBNYX6UiVl0WvVT6kWnO1SlGiPcJtEiP1qObrN7dywq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDDM%2B6%2F2t%2B%2FIazalvpCrcAwxfP3i3zMkceby0KkyG%2BVpVP5ZwGEwQlVuhQd%2BvElsMh8Q9HfYrhEVj%2FU1xv47ZPeh3qBvs56Ea9UH4%2BMo%2FE%2BBonAwYBALpe%2Fhk2Mo%2Fy9WW8FYGYey90chgwjYAqTf%2BunXzVrwxFlYq1J5NyckQCDYw5FVo5D4JvH%2Bl9bCTRsp03keYj9Gpg9tc9kDPFlkV%2BN7008%2BbDvqGKPS7xHUNcpgm6O29QfNkfJiQzY8LG0HUlFCb6eXnH%2BCbb2IdBJkxVA8g%2BENmnq47gR5iIyQQNYaWjAWALmmGuFTycOzrulhTp9onTRoPPpYSz%2FoF7lQ4NQ0j1kg9zTkJeaaGUW6NmKSgzIH9DJoxwCQ5%2Bp9yjjnV0vQnypXwwMpdzYU6qOWmWLBHajkOZj%2BhKAqDzo3QPf4Ao657CLvkJx4e%2B5lKtm5LgMt8chhdHqZlkkwNewZV5qXNGKSQbpSSbjAZ9cKzDtYkWOrbYcBSJ2NEOYwD3r8Uh3Dnx34ADliJCVjcqnfn3S4lDUCwUu9pSM2nQ6lS3Ssmz2jQiJRzj%2FiK5BSGjhDWTJEYZKfFzu%2BtW7evjBBBuVuS3t7OEXh%2FvcocAe4r3fmNh3lqlP27IfzSE7CxddYmOyzAVE8fvreM3hy0MLfyws0GOqUB6dd%2Bx39C6T2BDGNpfNJhqQi8LN5RlpZyd%2FzEnU96RmrFlLZzIL%2Fgv2Xpf2E1AqlpWITNYN7RK7aiPKUD%2FrYGJ%2B0O9qimu0TTNzVF%2FtpCoGji3UN3e8UbAmJgUlPgT1BZUy7oEHrVEzKY8IY5E8v%2FDe9tHxmpqmFUpNpVCRTTBXTE8pxBPksECCyIdHqwWRxvUR8Lya2YyyGuy7K%2FISSahcf3sw6z&X-Amz-Signature=ed43c5ff86e3c1dbe21fb2fb3d92fa9da6240d711ae7cf6a2815d1a16c1f490c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNPS2ERH%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025030Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB6oF3p6hH%2Bqn2lwicoc%2FYq%2FbZ7wYEr5vUBispUSZuL8AiEAwYBNYX6UiVl0WvVT6kWnO1SlGiPcJtEiP1qObrN7dywq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDDM%2B6%2F2t%2B%2FIazalvpCrcAwxfP3i3zMkceby0KkyG%2BVpVP5ZwGEwQlVuhQd%2BvElsMh8Q9HfYrhEVj%2FU1xv47ZPeh3qBvs56Ea9UH4%2BMo%2FE%2BBonAwYBALpe%2Fhk2Mo%2Fy9WW8FYGYey90chgwjYAqTf%2BunXzVrwxFlYq1J5NyckQCDYw5FVo5D4JvH%2Bl9bCTRsp03keYj9Gpg9tc9kDPFlkV%2BN7008%2BbDvqGKPS7xHUNcpgm6O29QfNkfJiQzY8LG0HUlFCb6eXnH%2BCbb2IdBJkxVA8g%2BENmnq47gR5iIyQQNYaWjAWALmmGuFTycOzrulhTp9onTRoPPpYSz%2FoF7lQ4NQ0j1kg9zTkJeaaGUW6NmKSgzIH9DJoxwCQ5%2Bp9yjjnV0vQnypXwwMpdzYU6qOWmWLBHajkOZj%2BhKAqDzo3QPf4Ao657CLvkJx4e%2B5lKtm5LgMt8chhdHqZlkkwNewZV5qXNGKSQbpSSbjAZ9cKzDtYkWOrbYcBSJ2NEOYwD3r8Uh3Dnx34ADliJCVjcqnfn3S4lDUCwUu9pSM2nQ6lS3Ssmz2jQiJRzj%2FiK5BSGjhDWTJEYZKfFzu%2BtW7evjBBBuVuS3t7OEXh%2FvcocAe4r3fmNh3lqlP27IfzSE7CxddYmOyzAVE8fvreM3hy0MLfyws0GOqUB6dd%2Bx39C6T2BDGNpfNJhqQi8LN5RlpZyd%2FzEnU96RmrFlLZzIL%2Fgv2Xpf2E1AqlpWITNYN7RK7aiPKUD%2FrYGJ%2B0O9qimu0TTNzVF%2FtpCoGji3UN3e8UbAmJgUlPgT1BZUy7oEHrVEzKY8IY5E8v%2FDe9tHxmpqmFUpNpVCRTTBXTE8pxBPksECCyIdHqwWRxvUR8Lya2YyyGuy7K%2FISSahcf3sw6z&X-Amz-Signature=f6fcae254fc2c12c03e4cf6713b6047ab6abb6b4c6c84a84eecebe1f8efea5a6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNPS2ERH%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025031Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB6oF3p6hH%2Bqn2lwicoc%2FYq%2FbZ7wYEr5vUBispUSZuL8AiEAwYBNYX6UiVl0WvVT6kWnO1SlGiPcJtEiP1qObrN7dywq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDDM%2B6%2F2t%2B%2FIazalvpCrcAwxfP3i3zMkceby0KkyG%2BVpVP5ZwGEwQlVuhQd%2BvElsMh8Q9HfYrhEVj%2FU1xv47ZPeh3qBvs56Ea9UH4%2BMo%2FE%2BBonAwYBALpe%2Fhk2Mo%2Fy9WW8FYGYey90chgwjYAqTf%2BunXzVrwxFlYq1J5NyckQCDYw5FVo5D4JvH%2Bl9bCTRsp03keYj9Gpg9tc9kDPFlkV%2BN7008%2BbDvqGKPS7xHUNcpgm6O29QfNkfJiQzY8LG0HUlFCb6eXnH%2BCbb2IdBJkxVA8g%2BENmnq47gR5iIyQQNYaWjAWALmmGuFTycOzrulhTp9onTRoPPpYSz%2FoF7lQ4NQ0j1kg9zTkJeaaGUW6NmKSgzIH9DJoxwCQ5%2Bp9yjjnV0vQnypXwwMpdzYU6qOWmWLBHajkOZj%2BhKAqDzo3QPf4Ao657CLvkJx4e%2B5lKtm5LgMt8chhdHqZlkkwNewZV5qXNGKSQbpSSbjAZ9cKzDtYkWOrbYcBSJ2NEOYwD3r8Uh3Dnx34ADliJCVjcqnfn3S4lDUCwUu9pSM2nQ6lS3Ssmz2jQiJRzj%2FiK5BSGjhDWTJEYZKfFzu%2BtW7evjBBBuVuS3t7OEXh%2FvcocAe4r3fmNh3lqlP27IfzSE7CxddYmOyzAVE8fvreM3hy0MLfyws0GOqUB6dd%2Bx39C6T2BDGNpfNJhqQi8LN5RlpZyd%2FzEnU96RmrFlLZzIL%2Fgv2Xpf2E1AqlpWITNYN7RK7aiPKUD%2FrYGJ%2B0O9qimu0TTNzVF%2FtpCoGji3UN3e8UbAmJgUlPgT1BZUy7oEHrVEzKY8IY5E8v%2FDe9tHxmpqmFUpNpVCRTTBXTE8pxBPksECCyIdHqwWRxvUR8Lya2YyyGuy7K%2FISSahcf3sw6z&X-Amz-Signature=7fb87e9dfe6f088bbab823a761ab664d9d4bc279da14849206c52d0ebf8b81a7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663NAP73A2%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025051Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAIAFHbnWZzFvfeaXEsxXw7E4p9ZRbLIkP9zxfQ8PfItAiEAghZtsYIGbyf4ETaiL5Tkw4HjjwySunhHnD9sVDagxZ4q%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDIkm%2FeaX2jQwUCCbUSrcA2%2F7kAmqhrHo6%2F4BEZ7qAndt1y9v95aT60%2FYMSPYcGwwvOtslH85HdcQjFJH0koq0SHRXA18UmgPxrNp02Xr16w8gx%2FqRJvtbkH%2Ba%2BuXmiLqOBzWYeMIsSEncVNN1ee6oA%2FzdQ7%2FXN9i%2BUhmXFKLVWXAHn8MPQhmX86lOs6azb9Jg6BV1mM%2BB8sZuFE%2Bw%2B3UH9hFV%2BdJAktwHzrIM8q6n0r4K87y24VFHuDxfFu%2FbDDH6dcb0FMAN9JiY62MWZhYXpEUoRoSplHT8ZLYAabJ027C8Q7%2FUwpEiEn9UJdRs%2B0oZRsnCbsDE5JDF%2F9DJouu304X53mnRlF%2BRP3jlTLhjzRgaBh6C9qxkPg%2FZ8gr2SVn%2Bg0HXGWjtEAEpk%2BtKghmj7lS2llt4s0hcGVP5FsxWcLYvwXCzFtETjByjDg9zhOL3%2BHfqOD8JLti5PODRhOWBFYcuHph3GIoYEyPBMagEUJSDaoGSyw2g51F57HkXRfhd22iiMgeWiDCoEXzGNQK2fNHOob2A8CNCtrLr6C5g1XYShwtf9bwS767BdT5Y7iocCA4Ex4dUPTzQC17HiiwUxe0H4UfgNBQtF2SylQiXl3XPqCGO95xlHHKNlHpMULdjof0258uUatcifyAMM7yws0GOqUBp9ADFLqqx5e8jfBskDuh0RssUDJlWXNgoUD1R5QXPrR7xon%2BkUpTCSJSWDedcj6%2F9G%2Bid3kl%2B%2B6UTSXg5fgf8uDkT93KjHoaIFg8MqKY9aaOmm%2FfVETXPQfGnjOO39xu7l87qEjITtElMNOMB9N7nNQiJT9fftFo5dT8iZHD2r%2FvQXswf3KCY62Py%2B1jgvAEe1RCiAa4LcVBA%2BtgKObUknr6pVG2&X-Amz-Signature=4dcd7ac52e840796361c63b18ab131f9049f564614dbb94bdb1cc4348177aa82&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666V6DXQLR%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025101Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDAdE1HTgSCn5bMhuZg2qssl%2FSNLX8tRX2Y9M6P%2Fp%2FxTgIgEQ5ATN4BdKd8MMYAge%2B%2Bu8RAtySrZH%2Bc0rPPbanX0XAq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDBNFT590Vo8BmHEZxCrcA51KRpocfL3PT6JyEJWhgFHQmeg7J662Fiw%2FMDIJW0v%2Bb8ToilDIm82wxQOc0tts8GJGIFv8PfSnqfFoJ%2BJFKRFGVtJdZ0G5VVMrHyBZsQR6k3WRNHj0DAfWY9SkCklY4py%2FphI4eAGAXdGo9sCE8g5TFDwC0Du0bIEarE0xsmUPzKwgFigy8qdUQOt1pcwksRjQioo%2F%2FS8ojCrLAvg6ILGmeJgxaHERg1pdPgbU3SalNkF2Pcmi8cweRsLnvu3RjWB5TZruzXnQthueqQdqrm3%2BkCePQxybVUAeT2rfs51OY46LV5WWd44iWXHxZjLNS0QqrJqIpxF1MN3%2BCMkgNjucqfkR%2Fb96cdvMoJ%2Fvbqoew4RjmYba4ICzActVpxRigzIQt2ZKibihvY9L%2FgQiJYFEz9jWEuAmeYJPTm%2BQuj15qBJ88I9cSnZU%2F0zE3gejZAKmh4BiZ%2FZCXL6bc%2FL9lSsOVegcsWMN0uTMMBNVFq8v55d0PiuvC7BOH%2FbSWcnHOAZUef%2FkCqdKWx5MNke5dHzsnEbagSMGBoNuHKmNSgGPZnIIapI4luYnG8Ecu3Gcsl2s33f0w1JQTi18xmexkWC6%2F8jGhOGiuQO0IUd%2By0C4JNstft45EMFWr6v5MLfyws0GOqUBKYdZyn%2FNTBk%2F90pU3zRhRAxe3iMbz853uGi0KymTRfNMZXgZ44VA3AQUYyirw44DlebzFM5cyFF84iugIkXH0XM8pfF9p%2FyqqgBKmS7XoMUoRFx%2FjWsPwCb3RjEfhtDGkUNWwrsdZ0vzcvi6RNhzz9T7scJSsUvbXrzBphaErlD2GTDKCnDlMggdtLdybv%2Bs2jqVqtMC8k%2Bw6PeGgsWbdrfz5%2Bys&X-Amz-Signature=fd2b7246858ed7d5039c820742e2c1c136980d6fa7e11e84ed0d3ea8378bb952&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YUAKOEMS%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025103Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFx6UrXhsdKOti504EipKIGdFVCyJC2BMDtrfjaioi1aAiAPsrn7lGek2keYflXIdhWt9wsN6xreLRBFDUimLMcaJyr%2FAwhSEAAaDDYzNzQyMzE4MzgwNSIMsXv2JrDqm0ErShXXKtwDpWWvRSRpsXhOdWVRG0j3aH84q679D5zOYe8thIbDSyspLfTwOf27N6n0DxbdfYi%2F5FUbJOysGTcyqulKk12H6nhrR1O4XX8ng6BEdkExrwDa2Xyt64pCVCKcd9XvbhSAWPTpnlXxtGOxnIAHYr4TJFzPe1rJy9%2FV%2FzCAhjaexwbSLJ9WF2bIyAdAYCDb%2FrWXNA8CnC2q7DhWmH%2FiS30f1CfYQV80dV%2F6Aouvd7E5RAtTPVubI26Do8JoqETtbXthVGam23rk5GxHT9r1sMcm9SZZk7pWNt37wPmTVkNmXc7Z7xjQWL9od5q%2BLf%2Fh7zY3ZMNp3ycvoG17uMcX%2Bj8EoLor%2FTvtsdYrXCkpBqXAzi%2BkpePCzBZV3TTeDq1JvzF%2B8DK9z5wYqgC0PHA6ZYxwPPQsSiOkzuLKNo8CPR78bOKXXvzSErtZMGLLVSr82Rb8rErLtixsHfMzpneS79Xr9zgvTke1tKKFscoLrYpflcN4R4zT6r01KkB6pB8NRb3dQ6GAv4QyWABY1FafwySaQ0lHmtAbEtYbzGDwf3e%2F0APEXWD11eoRb9IlOYjCzB0ppxLMH0k%2BZOoAxLRHG%2BKEVTeKiD6PG8RRbWrn6kjCWHNDfif5ypeMhCpUgkowjfLCzQY6pgGp3l%2BIfPIdnU1teHW8rWuKIMMwHfctSeYOLTayOVyY3XjB6uaLz27WwDc8IW5t4hCBfpZbyixnVDAqRADMB73OpXgjCIJOY02tUKZ%2F8Eq3opOC1v5QFR8ut98SS8kMojzJ3S66MN1SfdVt7AuNUEocZH653HCInbaNYsOkA346w2kzE6DCGfF8BAhoLM3VvUmQlyRhduaMn3OfZ8oSxpHoPR2k1e2t&X-Amz-Signature=bd1dd15a09eb01babfd4a61bb49ec7c9c76ea0903149dd787f1f98cae5138495&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46627PN7O6L%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025103Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFMY4QdpJ42P7AfRBSxWkUyguiscunpQQVbWEbFiVBouAiA1Mmy7X6XJW70qM0B3OOpncb59HzKkpqv2DynSg4Tn0yr%2FAwhSEAAaDDYzNzQyMzE4MzgwNSIMviMtWbp%2F6kYra7rlKtwDEttyyT6Emi%2FdGG6NkZFb%2BgjDu3i5xkoBRMf4wgt9JSn9PhnSLK%2BmDyEM%2BoryAvfu6rnQ%2FVmCUdmVsjxX0uhkUmpXlsDgRSorir9xaf%2FvJ%2FU6pJ1BOhVLZG1NLMfhkp4WrwEIcQ9pgcPDWyqCJYhj9GC1SC1gjHSfyXj7Jgbqg%2FtVC4Pros4TWLH86yp3ErJju78ZXxBbJiCuTT3ho1O8y%2Fzhj2JmMGSepEgnZFApH9HFPk8aewK7CoMDHGSKTepVnNdQ7zzOIoWMDCJCGC8XDtI%2B52FQH5Gp3y4FKMmiFlA6kMn1rdmXUpvqfYFmrihkbGlRho3%2BVgtz%2BbBkjK9VvV2ct4aTrrC196OPJSbyxTo1XQqcwJ1ilJvkT68xW1bKpGVBt3aQc%2BTRPfDT3DBTog1W1aYw9w4%2FWqWqq%2BKWXfZDl9ZAotkYWPplpFhJqY6YYMBYMNmlhYv60OdICw45PpyW2VG0OiYoZBZpqfiRRCrR1tSmE1H2lZJGkRAnXHsHcmMEDIHGmk%2FhCZ%2FHt2PXcf%2BUgpw8T3xALEhTKXAXdClrVfsMy2DmPr%2BYvvIGzBTeH3YS9gqf6elLv0uacSbO%2FrxGdJC%2B7a1E7UgEwYhUnv6o7RSMti%2BiC4BJ8Z8wv%2FLCzQY6pgEFwGPFNMOm%2FBEKEJTlompCpmNUBOl6K0n68bHepdwtSw6CHnXgmCotYBhMoGNbeo9PZN8IoO3S47V%2FRx15e5FyhFqn6sGH9zz%2BSesqgbyQENKhZ%2B6zFNZthK9l5QQdQ856qkrexcyAmWmwRoZgHWyrLI2Dfzf1ywKNuzZ%2BoYqVDQIKOl4HTzH6pYFxvv%2FSpxY30kQsl7hzfMhufQ3RXpeidyVAVTXg&X-Amz-Signature=4e3b965c73f51f18e9d9681797cbb0c2413dbc8b7dbaae111c3a26296d3c1af3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNPS2ERH%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025031Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB6oF3p6hH%2Bqn2lwicoc%2FYq%2FbZ7wYEr5vUBispUSZuL8AiEAwYBNYX6UiVl0WvVT6kWnO1SlGiPcJtEiP1qObrN7dywq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDDM%2B6%2F2t%2B%2FIazalvpCrcAwxfP3i3zMkceby0KkyG%2BVpVP5ZwGEwQlVuhQd%2BvElsMh8Q9HfYrhEVj%2FU1xv47ZPeh3qBvs56Ea9UH4%2BMo%2FE%2BBonAwYBALpe%2Fhk2Mo%2Fy9WW8FYGYey90chgwjYAqTf%2BunXzVrwxFlYq1J5NyckQCDYw5FVo5D4JvH%2Bl9bCTRsp03keYj9Gpg9tc9kDPFlkV%2BN7008%2BbDvqGKPS7xHUNcpgm6O29QfNkfJiQzY8LG0HUlFCb6eXnH%2BCbb2IdBJkxVA8g%2BENmnq47gR5iIyQQNYaWjAWALmmGuFTycOzrulhTp9onTRoPPpYSz%2FoF7lQ4NQ0j1kg9zTkJeaaGUW6NmKSgzIH9DJoxwCQ5%2Bp9yjjnV0vQnypXwwMpdzYU6qOWmWLBHajkOZj%2BhKAqDzo3QPf4Ao657CLvkJx4e%2B5lKtm5LgMt8chhdHqZlkkwNewZV5qXNGKSQbpSSbjAZ9cKzDtYkWOrbYcBSJ2NEOYwD3r8Uh3Dnx34ADliJCVjcqnfn3S4lDUCwUu9pSM2nQ6lS3Ssmz2jQiJRzj%2FiK5BSGjhDWTJEYZKfFzu%2BtW7evjBBBuVuS3t7OEXh%2FvcocAe4r3fmNh3lqlP27IfzSE7CxddYmOyzAVE8fvreM3hy0MLfyws0GOqUB6dd%2Bx39C6T2BDGNpfNJhqQi8LN5RlpZyd%2FzEnU96RmrFlLZzIL%2Fgv2Xpf2E1AqlpWITNYN7RK7aiPKUD%2FrYGJ%2B0O9qimu0TTNzVF%2FtpCoGji3UN3e8UbAmJgUlPgT1BZUy7oEHrVEzKY8IY5E8v%2FDe9tHxmpqmFUpNpVCRTTBXTE8pxBPksECCyIdHqwWRxvUR8Lya2YyyGuy7K%2FISSahcf3sw6z&X-Amz-Signature=a076342c73d658aa8d87c0c58ed433014ff7d0de840bab1674d452b8d6b5bf29&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNPS2ERH%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025031Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB6oF3p6hH%2Bqn2lwicoc%2FYq%2FbZ7wYEr5vUBispUSZuL8AiEAwYBNYX6UiVl0WvVT6kWnO1SlGiPcJtEiP1qObrN7dywq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDDM%2B6%2F2t%2B%2FIazalvpCrcAwxfP3i3zMkceby0KkyG%2BVpVP5ZwGEwQlVuhQd%2BvElsMh8Q9HfYrhEVj%2FU1xv47ZPeh3qBvs56Ea9UH4%2BMo%2FE%2BBonAwYBALpe%2Fhk2Mo%2Fy9WW8FYGYey90chgwjYAqTf%2BunXzVrwxFlYq1J5NyckQCDYw5FVo5D4JvH%2Bl9bCTRsp03keYj9Gpg9tc9kDPFlkV%2BN7008%2BbDvqGKPS7xHUNcpgm6O29QfNkfJiQzY8LG0HUlFCb6eXnH%2BCbb2IdBJkxVA8g%2BENmnq47gR5iIyQQNYaWjAWALmmGuFTycOzrulhTp9onTRoPPpYSz%2FoF7lQ4NQ0j1kg9zTkJeaaGUW6NmKSgzIH9DJoxwCQ5%2Bp9yjjnV0vQnypXwwMpdzYU6qOWmWLBHajkOZj%2BhKAqDzo3QPf4Ao657CLvkJx4e%2B5lKtm5LgMt8chhdHqZlkkwNewZV5qXNGKSQbpSSbjAZ9cKzDtYkWOrbYcBSJ2NEOYwD3r8Uh3Dnx34ADliJCVjcqnfn3S4lDUCwUu9pSM2nQ6lS3Ssmz2jQiJRzj%2FiK5BSGjhDWTJEYZKfFzu%2BtW7evjBBBuVuS3t7OEXh%2FvcocAe4r3fmNh3lqlP27IfzSE7CxddYmOyzAVE8fvreM3hy0MLfyws0GOqUB6dd%2Bx39C6T2BDGNpfNJhqQi8LN5RlpZyd%2FzEnU96RmrFlLZzIL%2Fgv2Xpf2E1AqlpWITNYN7RK7aiPKUD%2FrYGJ%2B0O9qimu0TTNzVF%2FtpCoGji3UN3e8UbAmJgUlPgT1BZUy7oEHrVEzKY8IY5E8v%2FDe9tHxmpqmFUpNpVCRTTBXTE8pxBPksECCyIdHqwWRxvUR8Lya2YyyGuy7K%2FISSahcf3sw6z&X-Amz-Signature=6c0e0553cb8f4a37243f655bfadb88f7aa4f63481ff45c5eb4394e9143eb0606&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RAEQWVHO%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025114Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCrbJ89K%2FrM%2BE5H5%2BjBrO%2BRwQaWlf579gmcYxdiIr%2BpYQIhAOlg5rB0fi2q2M8QofPcIYon6sbQdK2%2Bih9tqc9hbebzKv8DCFIQABoMNjM3NDIzMTgzODA1Igzl8nzjz%2F9k8lYh6soq3ANLUT1%2FbskeQsoQO7pwNWWm0VWhTZsAtbLnNTeStzxeVjnQ7cxadUdjpGUt2JrA0RknoHfQz0fazmyU6ptEVdlcT%2F9%2ByxN0XdNAguzqXs2LikAl1ZEwLLI%2B2T7vFhUR%2BHVwF7ZSA3UFTIapRisK%2F0FIPAJZjwQCoQlbhHRXfgGbBHQ9Ny1BnjcnV5HA9bHjibJ00AbLWLw4h9SbWIhbcMqBOS1uzFM32i4lmhEP4wwsiohMo8m3LLtL6erDuO22VpJmdBqTe7d7%2Ff89SzCzKylkVOKMIgdC3vfLYsMyrLzZ0Rc5BEp5r1taYhMQUb0rYa64HuB6i3b2kFruvu2kvhHuD%2FeEkQ1OTTz%2FPVVElbb%2BJ9tCQYejot%2FYRie4atqOXTmD63gGq0GHO4b99a9ZalF0XW0mSz8RaIiLfE%2B3Qoxi9DDQmkelDXgEpph07ry9dPFSvpo%2BnFoQ8iYK9bm9vxxUAGAKE8c5Wrb4Wwi5JKBMiLdgkZ8f2ARpYNi2%2FjvpXUBqLooPCfvULsfOZ1BH3bV8Mvpm7vg2lYtfuLmbjP9nb6nmEHw6C%2FsQxqoQ8ecKXpTbwSM8X%2F%2FInFL2UfKSsDQBu16T9zeVK%2B0KkW8ke%2F8pGyoM5LriLWaH1xKidjD%2B8sLNBjqkAUVyA12UzWylCUGl6GU3iE3HKgI24OCkovFmvL8nztBkPwJsk5YS4v%2F%2FqbXS2acExZMOri7w1d%2Fc0q4QIKgPF5rvr4w%2F84OtPBccx9K8kcR1UhWHkY0V2gBKYvVHqrpC5pJSe35xfEofo1Lwioy%2Fv5NCBbVSWuovJT%2B%2FkMdTKV4BJ4XI4iNPJS43wD4r5%2FAYURyDCqqZdd2c5RJFBCdUv%2Bka8eo4&X-Amz-Signature=28ae87ef446cfcab266fd00ce1a8028677f213c6857cb2fdf3ff93e16c8d9a89&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNPS2ERH%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025032Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB6oF3p6hH%2Bqn2lwicoc%2FYq%2FbZ7wYEr5vUBispUSZuL8AiEAwYBNYX6UiVl0WvVT6kWnO1SlGiPcJtEiP1qObrN7dywq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDDM%2B6%2F2t%2B%2FIazalvpCrcAwxfP3i3zMkceby0KkyG%2BVpVP5ZwGEwQlVuhQd%2BvElsMh8Q9HfYrhEVj%2FU1xv47ZPeh3qBvs56Ea9UH4%2BMo%2FE%2BBonAwYBALpe%2Fhk2Mo%2Fy9WW8FYGYey90chgwjYAqTf%2BunXzVrwxFlYq1J5NyckQCDYw5FVo5D4JvH%2Bl9bCTRsp03keYj9Gpg9tc9kDPFlkV%2BN7008%2BbDvqGKPS7xHUNcpgm6O29QfNkfJiQzY8LG0HUlFCb6eXnH%2BCbb2IdBJkxVA8g%2BENmnq47gR5iIyQQNYaWjAWALmmGuFTycOzrulhTp9onTRoPPpYSz%2FoF7lQ4NQ0j1kg9zTkJeaaGUW6NmKSgzIH9DJoxwCQ5%2Bp9yjjnV0vQnypXwwMpdzYU6qOWmWLBHajkOZj%2BhKAqDzo3QPf4Ao657CLvkJx4e%2B5lKtm5LgMt8chhdHqZlkkwNewZV5qXNGKSQbpSSbjAZ9cKzDtYkWOrbYcBSJ2NEOYwD3r8Uh3Dnx34ADliJCVjcqnfn3S4lDUCwUu9pSM2nQ6lS3Ssmz2jQiJRzj%2FiK5BSGjhDWTJEYZKfFzu%2BtW7evjBBBuVuS3t7OEXh%2FvcocAe4r3fmNh3lqlP27IfzSE7CxddYmOyzAVE8fvreM3hy0MLfyws0GOqUB6dd%2Bx39C6T2BDGNpfNJhqQi8LN5RlpZyd%2FzEnU96RmrFlLZzIL%2Fgv2Xpf2E1AqlpWITNYN7RK7aiPKUD%2FrYGJ%2B0O9qimu0TTNzVF%2FtpCoGji3UN3e8UbAmJgUlPgT1BZUy7oEHrVEzKY8IY5E8v%2FDe9tHxmpqmFUpNpVCRTTBXTE8pxBPksECCyIdHqwWRxvUR8Lya2YyyGuy7K%2FISSahcf3sw6z&X-Amz-Signature=08c4b0433e58204484e71b5b503b2d719abb275010c18d2ef61d833e85d56973&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666GXBLNJX%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025114Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICCCEHtqAtJfsdr9s9MCL9a%2FP8TGWykpJxex%2BdKyY4NoAiAO46dSac6S6zUbY1ii%2BKTQgIyyVTBBQMlBnp7%2BZBWkpyr%2FAwhSEAAaDDYzNzQyMzE4MzgwNSIMOmBdRAgxeg8hn9pWKtwDqWieXwOBppEQ3nNEKTcoNKBvP%2BSszuWtDmJA616PNn52JxcZE5DaIDv1G3i146GATWTq3nlgWGaTQYSewNX2gOGatECWGS0ZG0eRi58jDvDIWps2dA0Nq9lOC98tLnQufDx%2BAei0o5yb0%2F3BvfHTzZ%2BMBwQDMBvFb2uQej0%2Bw6MAkbVo%2BIkioprY2Qerh36%2BdWATVy%2BotkfNThDyXq1XvIpUXz6gSEDbJg8ncTXS7RyJlikLhfs1%2FAsZ9tqZn4iopYLnrKFQd%2BhypyQ2LGDJHpOGe2GcVNpJJX0mmRgGbDmteXG49amccgxR8RKFyQ%2F5RIDoMi0MIl21aem6F51VyEX0UBO%2Beeh%2B7x38PDbakd1%2F%2FLvZPWUBeLZaVw%2BpCAoVRQhMtwJv8rpWRBqB4xCNFWDRUyXXOSkXN9%2F0%2FHjBH225siU6ynjOuc56f0OFND9NFHAEIViYMnObNkuyiT%2FI05sqRetZbLsDyPaGUPY6pzJvr4sXP7Tffw6wwSCwaeeEtEM%2BEdQ%2BE0EWbt%2BhhKt05CKBmwTem%2BRfxX%2F1nx2tnoOEpQKV9T8aDOZ%2F%2BTgqLashgJmpTtJ0dQeQfVnwqMj3dwc%2BTkUeyMCdE1swbZxi%2FWR9CtxD92uYbCBUyhgwjPLCzQY6pgHb7KfcHsOuziBPvGOA5U6gs5XHSzPyAFSUiIDqEDVOwVCEBFkvKfsZdYGTdN6EvWUjYOJCbMLz45Vz1OUmaapgbjGE4P0K%2BB4vqhjbrVObO5EJzvw5a%2FXF12J3UQOGlxl6%2BdTZmmE%2FlaFvBTJjq6aDFAtgUVk%2BCEuMzwrBdy8ztGh6COpPsZC%2Blw%2FRHeW8zbAwUpH%2BPQxkuPKHdNq2hpKGLc%2FPb2sF&X-Amz-Signature=4f7fd9fda41fdcc598b7eaee9621c300ee40474ff0a54b67b06b87a59df4bbd4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YUK7OFCP%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025115Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEPH16rpfCheyYEa7aAw%2F86hLFITr9xm8IemkyFxwRd0AiEAm0h15Klum4w7aCmlztj0lAmKKuHiDUI33th9bDiqvG8q%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDKOoDkb4ART4Nm6FlyrcA6bu%2F82%2F%2FtRZJr1EsMuZZ82tcikVdn%2BjYVQSiiWu9XvziIQyxZZEHR6qIjDXr39D6YSFysy2khbf9r0TWQu%2FlXjk8aoIfv3vY7Ydh3Z%2FD4wh4wqF%2FbBywax9yODsLhR63xaVSaX7NcZlhMt0ptcx6tmqUZhkkqb18P0WSBue5CoKfwsFJ9j7e%2FzCvJjq10C6gjbtw0ElVQPtSIIZaDnMC6tQDzXEVVLlPsZFM6lWHMdkh5FjkPEaEmUBBgZ2uveA2VYR1haa9JhYlCB6YFZq2WXAeCqmyCp%2B9hGVrwIdhqTRo8u4naKd1iCxTLXttIKKe7%2BiwK1THsPe21%2BaKYyahY1%2FQAxGbmPMJz602uH8awtcOg5wIodKew%2FlMJxjV3a4Osvv9xmS9iAZXCjUbRonuiMLYHcw3oVi%2FyIptI%2Fab8CsDe8MbzZyvRfqY7zHVR2kQBbxHjZOeTzYdBU3Z8Ghq5VYKTgqTTPaQJcO0wcKun6xH43Iyy%2BUzy%2FGDpra%2Fooo3m37q5b0nn%2Fq8eOwU%2BZSy0Zae8Cn0Oa2%2B%2BHNpByWRL9uScAir44UcUCe81OkDVKFSSJ6gx7ICLXsFDF2tWzYCZEzGT9ZDW6%2FPsf9K4OhF2d5JIBJ3PpAwB1a%2B%2BsMMJvyws0GOqUBfa2L0S8l9d6PDPXCbs2gigLlH8nnHpdGq8l8nVAj1S3xglTRt5cN%2FMCrI1IQm29oQ1W8nG1jaPTdGmeiadcFV2I1It4kWHQmgD9skIjoiVKqUY4FJoJMxB18ktyn6xV0aknyXDUtk0sAxlTGyBePhhGlhihjQsKONGXeMgRTsXAxiH9DXkvv6AZQGBLiJufPG3rEyJgkv8a%2Fk7w5rhcTJSKe4M6H&X-Amz-Signature=144ac2cf41118f17fe79fbf1354793feb5502886f14f3d47f4a8b8333073900f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TFMG6VZ7%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025115Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2BQg56xjxgFKb2ekRj7MN7Yo0LYb73FFTaxxT03YUIhAIhANcMzTDEWtOppumkKsIHeIYmPZLp9o08dcq%2BnkpkX90aKv8DCFIQABoMNjM3NDIzMTgzODA1IgyZohqKIJi7FkxGZy0q3AO2TrwW5rYG%2B1l%2BkNlupZ5ftkQ6%2F3sIY9%2FrGvdI3JQ5OXVDsG%2BTpDWlZQLgcxxTj7%2FRVoe0cbOsTQBPurOa6tcI%2B73Q%2BiRFh0jT6Vq%2FVdi%2BER0330dvnjW25kDbBYPJ7V7O0oOhT3wuyo4aIDVPB4JURRQDFY3TXbC21fDW42sen%2F1KAug7rQq93cRiCE6WQduSyoEQQ2r%2FKbRlfvr3cwP6dXfKDRolmLgiGj8%2F%2Fa%2FEtSQDH%2FSOoq20cY4j8eSQhmpzbovj%2Bgu%2Bd6vFW9RiA4SI%2BuOhMTDEgrpJRdnmxcAp1sdCCGkHVUfbd5z2eyYHgYLO9HOBt4eRQzlfnhax%2FmQtstQiiyhmdzlkrqPwGEclcFWivmsXhDWCeQ3uIGMzetPfWa3%2B626FnQKbmwG0V7XBvJa2BtTCii5USoe70DcvjHcxSvmHo0mgTY6dM472XZebD04CYaCq6%2FfbFiBOh%2BX8FV0Um2WetUJWqBiLx988zHzUdFzk%2BDHst0GSQcAAoSXcmhANaXxAxLUfAlUMnx3QYREJDFRBc72Ti4lX0OooYUZtV3C11pGRmBrBgkXxYIXTuJ6HKVqYLyShAWVzQC2RQu4iF0vXABcxsrj3gpDxkLOo3M0Rm9Hv0LcvbzD78sLNBjqkAdOkn%2FG15TzQg3wFZByTEec%2Fi7GBpsBKEYe7RL8T0ZVh4Z9EWBtYkbbgl599J8wZVlkt7c4Lxgu8sFWCUIFXB7c9cXXkEKIIxRm%2BbmVruBaX8I1nBQhjVJibSqdOAuHN%2FNB6oShibirxKr16SgH3YjpExr5OpdctHVug2rSiNMLDoCDX3P%2Fy%2FRIS%2FkMmHEOCA1mF41IWeRmdECi7YJCnnnPpSHHc&X-Amz-Signature=074f85dbf06b0a38e2720eb56970a4df725fb5a183d0458d1352bcdd405c2fc6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TJZBWYNL%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025115Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEirYzKds68zxn4l4FixM7272pZrFde20CffijullrahAiBDznYlclwzkUaw7dZbi%2F3eVba0G%2FgsOBTLsaHqEN6%2BtCr%2FAwhSEAAaDDYzNzQyMzE4MzgwNSIMexLAtI%2BrMr58g26BKtwDrbVbPPnOzviwOIvYy5Ku8Q8kYRUNMAqKMptdYyaP%2FM3WV%2BU1Gw2miHwLPlm%2Bb9oYiuWfmhD%2FoYwZn0wjy480e%2F62OOHPX2%2FpjgEI9ipstkGu4kkAXs5oTJNP6enBVCLyA8WTgyReLV2Uj7qGpoFR429tj6WNqu60JRZPiy4VNvX2%2FoXhDtmFkqkIAOHhl%2FRS3%2Bdde8Ij%2Fg18btCjQGbbwq12o0VeNkNAWlJG9zCOlHtB%2FVYDzGm5YzMIxSsgv7AdR4GKyWCPPGsiJnw8ALSPBWykBSAmsqMyn73yCe%2Ba87GzBAF%2Fk6MK867nQug9nkPvK%2B2ChQw1Y3c7fCoG1VI1%2BBZQ6xfVlAMIOuzcU8V5UyzImm8numHH1MqTHM9YylzFtG29PkUDhFYDBM%2BaOV1ub8rfuYPXqhLDcPPpQYQxncKXVxaJXBLaD4iu%2BjnOVCovzVinqM2ayOOdpoNirBuqZJBqj%2FKK%2F4YiCBnpLTvGaK0ymBDzuMC6tk7WEukRYp3%2BwcsRouiVzvLcWYy%2FKvzOnuq5UnoOa8rJYreyw3YiKDwoEqjUsibE4py1YglbG8IgDfSqJ0vk%2BD%2F%2BnK7hfMK4dIXwwrpCT4bs8rdBd7nIgvd6QDyYozn82RprStkw6%2FHCzQY6pgENsYIQ2mUEVEiPwVg31s%2BN9Ob1ArTF%2Fw1mbncrq%2BTkrkLCA8kMi9UNywzD9HhXJcEwoH0nyboPfjhSvkBiJpGDminEpZp3H9izE2tn4XPHlU12%2FZ%2Fcq%2BT40G%2BsBEextrw%2FDLKg8YYEb8owP3afUs6PUwcRfu6bITh1%2FMs%2FX7uplrEebC18e%2BDmi6IXgvayIqFUIp2q3FhyYx1oxcsNn2gqOIxKL2eF&X-Amz-Signature=a929de25cf695c3dcccb5af9a55f395134fdca40673abb0eb4bde0ab72cacbf2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNPS2ERH%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025032Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB6oF3p6hH%2Bqn2lwicoc%2FYq%2FbZ7wYEr5vUBispUSZuL8AiEAwYBNYX6UiVl0WvVT6kWnO1SlGiPcJtEiP1qObrN7dywq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDDM%2B6%2F2t%2B%2FIazalvpCrcAwxfP3i3zMkceby0KkyG%2BVpVP5ZwGEwQlVuhQd%2BvElsMh8Q9HfYrhEVj%2FU1xv47ZPeh3qBvs56Ea9UH4%2BMo%2FE%2BBonAwYBALpe%2Fhk2Mo%2Fy9WW8FYGYey90chgwjYAqTf%2BunXzVrwxFlYq1J5NyckQCDYw5FVo5D4JvH%2Bl9bCTRsp03keYj9Gpg9tc9kDPFlkV%2BN7008%2BbDvqGKPS7xHUNcpgm6O29QfNkfJiQzY8LG0HUlFCb6eXnH%2BCbb2IdBJkxVA8g%2BENmnq47gR5iIyQQNYaWjAWALmmGuFTycOzrulhTp9onTRoPPpYSz%2FoF7lQ4NQ0j1kg9zTkJeaaGUW6NmKSgzIH9DJoxwCQ5%2Bp9yjjnV0vQnypXwwMpdzYU6qOWmWLBHajkOZj%2BhKAqDzo3QPf4Ao657CLvkJx4e%2B5lKtm5LgMt8chhdHqZlkkwNewZV5qXNGKSQbpSSbjAZ9cKzDtYkWOrbYcBSJ2NEOYwD3r8Uh3Dnx34ADliJCVjcqnfn3S4lDUCwUu9pSM2nQ6lS3Ssmz2jQiJRzj%2FiK5BSGjhDWTJEYZKfFzu%2BtW7evjBBBuVuS3t7OEXh%2FvcocAe4r3fmNh3lqlP27IfzSE7CxddYmOyzAVE8fvreM3hy0MLfyws0GOqUB6dd%2Bx39C6T2BDGNpfNJhqQi8LN5RlpZyd%2FzEnU96RmrFlLZzIL%2Fgv2Xpf2E1AqlpWITNYN7RK7aiPKUD%2FrYGJ%2B0O9qimu0TTNzVF%2FtpCoGji3UN3e8UbAmJgUlPgT1BZUy7oEHrVEzKY8IY5E8v%2FDe9tHxmpqmFUpNpVCRTTBXTE8pxBPksECCyIdHqwWRxvUR8Lya2YyyGuy7K%2FISSahcf3sw6z&X-Amz-Signature=896f79f49dd912785ca7cd88d2322c97e2b7ae3034b2cc5d46d9520db0e040c2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNPS2ERH%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025032Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB6oF3p6hH%2Bqn2lwicoc%2FYq%2FbZ7wYEr5vUBispUSZuL8AiEAwYBNYX6UiVl0WvVT6kWnO1SlGiPcJtEiP1qObrN7dywq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDDM%2B6%2F2t%2B%2FIazalvpCrcAwxfP3i3zMkceby0KkyG%2BVpVP5ZwGEwQlVuhQd%2BvElsMh8Q9HfYrhEVj%2FU1xv47ZPeh3qBvs56Ea9UH4%2BMo%2FE%2BBonAwYBALpe%2Fhk2Mo%2Fy9WW8FYGYey90chgwjYAqTf%2BunXzVrwxFlYq1J5NyckQCDYw5FVo5D4JvH%2Bl9bCTRsp03keYj9Gpg9tc9kDPFlkV%2BN7008%2BbDvqGKPS7xHUNcpgm6O29QfNkfJiQzY8LG0HUlFCb6eXnH%2BCbb2IdBJkxVA8g%2BENmnq47gR5iIyQQNYaWjAWALmmGuFTycOzrulhTp9onTRoPPpYSz%2FoF7lQ4NQ0j1kg9zTkJeaaGUW6NmKSgzIH9DJoxwCQ5%2Bp9yjjnV0vQnypXwwMpdzYU6qOWmWLBHajkOZj%2BhKAqDzo3QPf4Ao657CLvkJx4e%2B5lKtm5LgMt8chhdHqZlkkwNewZV5qXNGKSQbpSSbjAZ9cKzDtYkWOrbYcBSJ2NEOYwD3r8Uh3Dnx34ADliJCVjcqnfn3S4lDUCwUu9pSM2nQ6lS3Ssmz2jQiJRzj%2FiK5BSGjhDWTJEYZKfFzu%2BtW7evjBBBuVuS3t7OEXh%2FvcocAe4r3fmNh3lqlP27IfzSE7CxddYmOyzAVE8fvreM3hy0MLfyws0GOqUB6dd%2Bx39C6T2BDGNpfNJhqQi8LN5RlpZyd%2FzEnU96RmrFlLZzIL%2Fgv2Xpf2E1AqlpWITNYN7RK7aiPKUD%2FrYGJ%2B0O9qimu0TTNzVF%2FtpCoGji3UN3e8UbAmJgUlPgT1BZUy7oEHrVEzKY8IY5E8v%2FDe9tHxmpqmFUpNpVCRTTBXTE8pxBPksECCyIdHqwWRxvUR8Lya2YyyGuy7K%2FISSahcf3sw6z&X-Amz-Signature=2f211669d2cfe8e94a28460bb619e0c3ceae1dc4d940f2abef6501c5e326197e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

