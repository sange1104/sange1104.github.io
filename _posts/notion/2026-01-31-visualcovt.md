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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QURYYXKF%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032316Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICj3HfPIxYtFikQcs9huyrn3KFy1cBCHbzbMuX1QXSPBAiEAzvyq2omZ49kxVFh7n3mkB5nYHzM3Dk0wTko0UcZ7IT4q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDKjsBW%2Biv%2BLM27L2ZircA5ux68PDR5E8Iesj4yR8bodvrgHhXy3ZOYozQ6aI3kR1%2B8FMg%2FdnJoDs%2BD1sgmfoJek66MT5p1NK4WBQEKI7Ds8hge0qe8sZo1kMuo3s%2Fy1efqk%2FKa5fQ%2BSypE1moEUXzJ6B4yAEsQQ%2BVvnfi0Gm8yQLRuiV18mAVOuFBIV3KqEhGVwu1SKhNzSQ9E%2Fir91FbsZDP7oL3koTJtvssMOPcex8JLqxqym%2F%2BYn31LWilNWZ3O1VyF%2F5D6VM06cdz6xqVoyn7v5vQiS6pgiaCCe1SSub1w%2FmejrTr6xabdGioZrMAoi1ZmMTx0q6NKrqcz1P1AnFSW5C6GKrcofhVkBVOUP19NXNZyeSmMH6xJqMHwDz5%2FWMLAnP%2F075IvqKP5PoUqmMoVIthi9sxwbb1wbA1gpBW9aDNiwU%2BNgRbTlQ3%2FJcGRt%2B47OJgar2D5%2Bj4zYb7O5CfZE%2BMZPcKHvUWYljpdUjOW%2BfQSEcoZuOzgGf3jywobiX7UFin%2BPMLakMu%2BEP5lIpxOKKPlxbwtMWq8LtOBtoEdpkTh2kY78xgN4R8yO9r%2BJqcS%2F03QD6uPwZpYcEPCZCeQOIuTA2OLuyKlZX2ygImuAnrOHhC8U6nMapVQZnlgENdMMPRpNpFp8UMI6t%2Fc0GOqUBFyByeHKV8XduH3joRVXBun%2FWokE8k1Ji5j0YkUTZjOtOaR%2BZhmfnkcU9D75zVytXFW6Y1EhHdcYGQpD1Z2%2Bkelty%2BGqHp13YHD4L4PKFD%2FATIsw%2BR3bymx8XRkaB%2BB9ud3EnI3sq06bideGxUEf7wxlZt7DM5R%2FyVQi2CaiHWzKQyn6na%2BdvI%2BkwyT7%2FDXkYnLyYzobBJJHncHkfiSRElea6KQq7&X-Amz-Signature=2f77a1491f9e518684740783ad20bd2710c4684fe11e69bad5c19fad273c4eaf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QURYYXKF%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032316Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICj3HfPIxYtFikQcs9huyrn3KFy1cBCHbzbMuX1QXSPBAiEAzvyq2omZ49kxVFh7n3mkB5nYHzM3Dk0wTko0UcZ7IT4q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDKjsBW%2Biv%2BLM27L2ZircA5ux68PDR5E8Iesj4yR8bodvrgHhXy3ZOYozQ6aI3kR1%2B8FMg%2FdnJoDs%2BD1sgmfoJek66MT5p1NK4WBQEKI7Ds8hge0qe8sZo1kMuo3s%2Fy1efqk%2FKa5fQ%2BSypE1moEUXzJ6B4yAEsQQ%2BVvnfi0Gm8yQLRuiV18mAVOuFBIV3KqEhGVwu1SKhNzSQ9E%2Fir91FbsZDP7oL3koTJtvssMOPcex8JLqxqym%2F%2BYn31LWilNWZ3O1VyF%2F5D6VM06cdz6xqVoyn7v5vQiS6pgiaCCe1SSub1w%2FmejrTr6xabdGioZrMAoi1ZmMTx0q6NKrqcz1P1AnFSW5C6GKrcofhVkBVOUP19NXNZyeSmMH6xJqMHwDz5%2FWMLAnP%2F075IvqKP5PoUqmMoVIthi9sxwbb1wbA1gpBW9aDNiwU%2BNgRbTlQ3%2FJcGRt%2B47OJgar2D5%2Bj4zYb7O5CfZE%2BMZPcKHvUWYljpdUjOW%2BfQSEcoZuOzgGf3jywobiX7UFin%2BPMLakMu%2BEP5lIpxOKKPlxbwtMWq8LtOBtoEdpkTh2kY78xgN4R8yO9r%2BJqcS%2F03QD6uPwZpYcEPCZCeQOIuTA2OLuyKlZX2ygImuAnrOHhC8U6nMapVQZnlgENdMMPRpNpFp8UMI6t%2Fc0GOqUBFyByeHKV8XduH3joRVXBun%2FWokE8k1Ji5j0YkUTZjOtOaR%2BZhmfnkcU9D75zVytXFW6Y1EhHdcYGQpD1Z2%2Bkelty%2BGqHp13YHD4L4PKFD%2FATIsw%2BR3bymx8XRkaB%2BB9ud3EnI3sq06bideGxUEf7wxlZt7DM5R%2FyVQi2CaiHWzKQyn6na%2BdvI%2BkwyT7%2FDXkYnLyYzobBJJHncHkfiSRElea6KQq7&X-Amz-Signature=75c62c3001dd89b80b50f0d0632b5705f869ca1cd4a6f44298b3e680910f470c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QURYYXKF%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032316Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICj3HfPIxYtFikQcs9huyrn3KFy1cBCHbzbMuX1QXSPBAiEAzvyq2omZ49kxVFh7n3mkB5nYHzM3Dk0wTko0UcZ7IT4q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDKjsBW%2Biv%2BLM27L2ZircA5ux68PDR5E8Iesj4yR8bodvrgHhXy3ZOYozQ6aI3kR1%2B8FMg%2FdnJoDs%2BD1sgmfoJek66MT5p1NK4WBQEKI7Ds8hge0qe8sZo1kMuo3s%2Fy1efqk%2FKa5fQ%2BSypE1moEUXzJ6B4yAEsQQ%2BVvnfi0Gm8yQLRuiV18mAVOuFBIV3KqEhGVwu1SKhNzSQ9E%2Fir91FbsZDP7oL3koTJtvssMOPcex8JLqxqym%2F%2BYn31LWilNWZ3O1VyF%2F5D6VM06cdz6xqVoyn7v5vQiS6pgiaCCe1SSub1w%2FmejrTr6xabdGioZrMAoi1ZmMTx0q6NKrqcz1P1AnFSW5C6GKrcofhVkBVOUP19NXNZyeSmMH6xJqMHwDz5%2FWMLAnP%2F075IvqKP5PoUqmMoVIthi9sxwbb1wbA1gpBW9aDNiwU%2BNgRbTlQ3%2FJcGRt%2B47OJgar2D5%2Bj4zYb7O5CfZE%2BMZPcKHvUWYljpdUjOW%2BfQSEcoZuOzgGf3jywobiX7UFin%2BPMLakMu%2BEP5lIpxOKKPlxbwtMWq8LtOBtoEdpkTh2kY78xgN4R8yO9r%2BJqcS%2F03QD6uPwZpYcEPCZCeQOIuTA2OLuyKlZX2ygImuAnrOHhC8U6nMapVQZnlgENdMMPRpNpFp8UMI6t%2Fc0GOqUBFyByeHKV8XduH3joRVXBun%2FWokE8k1Ji5j0YkUTZjOtOaR%2BZhmfnkcU9D75zVytXFW6Y1EhHdcYGQpD1Z2%2Bkelty%2BGqHp13YHD4L4PKFD%2FATIsw%2BR3bymx8XRkaB%2BB9ud3EnI3sq06bideGxUEf7wxlZt7DM5R%2FyVQi2CaiHWzKQyn6na%2BdvI%2BkwyT7%2FDXkYnLyYzobBJJHncHkfiSRElea6KQq7&X-Amz-Signature=68bcb787580d414883dc77e04faa8a9d9c218ededa055ed61ba0a5a9b1e6b935&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QURYYXKF%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICj3HfPIxYtFikQcs9huyrn3KFy1cBCHbzbMuX1QXSPBAiEAzvyq2omZ49kxVFh7n3mkB5nYHzM3Dk0wTko0UcZ7IT4q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDKjsBW%2Biv%2BLM27L2ZircA5ux68PDR5E8Iesj4yR8bodvrgHhXy3ZOYozQ6aI3kR1%2B8FMg%2FdnJoDs%2BD1sgmfoJek66MT5p1NK4WBQEKI7Ds8hge0qe8sZo1kMuo3s%2Fy1efqk%2FKa5fQ%2BSypE1moEUXzJ6B4yAEsQQ%2BVvnfi0Gm8yQLRuiV18mAVOuFBIV3KqEhGVwu1SKhNzSQ9E%2Fir91FbsZDP7oL3koTJtvssMOPcex8JLqxqym%2F%2BYn31LWilNWZ3O1VyF%2F5D6VM06cdz6xqVoyn7v5vQiS6pgiaCCe1SSub1w%2FmejrTr6xabdGioZrMAoi1ZmMTx0q6NKrqcz1P1AnFSW5C6GKrcofhVkBVOUP19NXNZyeSmMH6xJqMHwDz5%2FWMLAnP%2F075IvqKP5PoUqmMoVIthi9sxwbb1wbA1gpBW9aDNiwU%2BNgRbTlQ3%2FJcGRt%2B47OJgar2D5%2Bj4zYb7O5CfZE%2BMZPcKHvUWYljpdUjOW%2BfQSEcoZuOzgGf3jywobiX7UFin%2BPMLakMu%2BEP5lIpxOKKPlxbwtMWq8LtOBtoEdpkTh2kY78xgN4R8yO9r%2BJqcS%2F03QD6uPwZpYcEPCZCeQOIuTA2OLuyKlZX2ygImuAnrOHhC8U6nMapVQZnlgENdMMPRpNpFp8UMI6t%2Fc0GOqUBFyByeHKV8XduH3joRVXBun%2FWokE8k1Ji5j0YkUTZjOtOaR%2BZhmfnkcU9D75zVytXFW6Y1EhHdcYGQpD1Z2%2Bkelty%2BGqHp13YHD4L4PKFD%2FATIsw%2BR3bymx8XRkaB%2BB9ud3EnI3sq06bideGxUEf7wxlZt7DM5R%2FyVQi2CaiHWzKQyn6na%2BdvI%2BkwyT7%2FDXkYnLyYzobBJJHncHkfiSRElea6KQq7&X-Amz-Signature=2bb99a85e5ec6bb9ed84af1fb2df5240cf6e4ca84834db772aaecf1e5174d97f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662P3FLBHN%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032335Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAs81iAVeCwPK1XBORlM66Vg%2FejrMFb9DdnMmRdbw0exAiEA%2BS8elDaHaEdn%2FiLcAB1%2BnIameX30y8C8917%2BsrZZyJ8q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDMVJNowM0iTiM45vdCrcA6M7xj5sDyS%2F9dJnzcknFf1yGJ8JNHmKsf4GM3BV6O8%2Bn4XLEoqVLUxpwJ07Ol93hdd1N%2BPb8928tLe1HqtxNNrBd8OX4n46nogjTV6R8gbKf7JU9RF%2BlfoG%2FijG5iZkpgZlfk6%2Fp8OQpIFqecOHJ%2B64aKd2SCdFCg2S7Ay%2Fbtbg6CCpGtIzpQkJZt1iR0PxAl%2FVimoepOMDv%2B7TzamzkFRookkWWUoIG8OfQa%2BKlQUIOt%2B1auT3IqSQ9D7AcAxBsuMkASX%2BIXSp7VAV5MOfkO2vzaA9Gi3hKcHjHlTkkfYEiPX0Micd892uqgnyI5gjL102sio6ZXfZeX3q%2Bn%2Bhdc%2B%2BCkCE%2FwkiRf1EEzHAlLEFUNmXnCghIoBGmp3969mNqA%2BwHJ13StOskP3NtIwNmC%2FFBe02xR4o9P%2BPbD11oRVsArlSx1DPDvpyyAKwzY5Rxt9gpd%2BgdlOKi0k95CgIG1E8wtjZ4vWFd1Y2WX7oww8At6HeEjzAlSLTPlxjT3kjQ4xz89HGL4QcXLFYP0o2RWy%2F%2BzbuYHJGVWOSnyiXOOBEZg%2B7gEar%2F3NNrTgVyzw9%2FYJTwA2jEwXhQYxnvvuFoj%2BTVtnZvo90F2LAIuwg2hYlqiebPIqFb7tGpicRMJGt%2Fc0GOqUBdMxV9bsjL%2BrnGqpBy79Z2P17STo%2F5SlIFaRWXa7ICq2U8rOe%2BSCvyqZDRkCJZ3gw0MCcdJTcNZrAuUSqDbJR%2BDwfPdxbKFHzNcmDRSNeeyYr5aqyuDBsQQCGVbI%2FEvZx2hmssvXmstu14Is3zHGPWsddAzuJeagDS%2FfvvDRHi3bH%2FtnOtQcIvFB4kAqmIih%2B1z6pbNhj9o%2F07AKIqOWDHsqH6i75&X-Amz-Signature=80f7c9a8d93a46bd81dd055acd8c1fb656d6b9503e537c3d094ea8761cfc2ee7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WG23ANYZ%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032406Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFYKFn0mygc1mSuhoApcrWWld95s9WMtP529yw1HuTOvAiBUUZpg4xclqTvzVOgdbo%2FyosBdN1Q%2BHoVSZigQT7rokyr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIMAqTsyO%2FRy27lhRSKKtwD5gDx6No2Uz4qkv1djAXYTvO3%2FIFvZJEff0lrSSdE3h93ozlGuPmFfFycKvDtNyqy5gSyXJyWT3gaPeqVvkPu3IE%2Fx3h5pmHYLIkYJGnLpT9oJjNIA2NPaga4Y2UgRRnruRXxof6GA2rtTNjUAN2hizIABJLwV1nKmf7lErh8QeftM7gtFynHUUWQUI0tYtPwdcf%2BqDwiC0ZlRTJ0qV3ylijlj8%2FwvmlgJE%2FUOR3F4FXN68%2FjFM9NkEejJvqjYXtb220Fj7yr5cRY9NLSGk2jpoPDCXC%2BaDFMxHw%2BrgnQELbhsCmxFtdlqla85mQ0ytL4ey4IvMgYsvYokgxPPCjZgWKIhGb%2FDYYKXGgSOw9RHA3rqUruVsM7k8eJN%2Fo2CqbBJ1RrYerNlOtBX0K5zvES1kygRDNWmwnE1e0tw9hGMlLgtx9drM2QiNG%2FRz7Rtq1QqhZj6i2tRhEfG59USSzfJfkKsVvx4onkRy%2F6m9JvsyfzV%2Foi4NdQ52l2LwjmY5C%2BUKak6d%2F0Yv4R1fnWSy%2BsjwnjEar1BZcYOqcYTmcZypOf0PpBjwnilLdXkQs9k4%2BNW9fO%2B4hki%2F%2F9nsjZuRUe%2FjJRGEJGHQtFjxefXiZ4SX0U1K87bh5oBU9XUP8wra39zQY6pgEw3NNTsnFwFtftTjiaoCIRSCeciPNaPKezzycwurYcHQ0aYvI6rRkCd3l4jAXoRYCPvjNhg7JPTjFzkrxuE8lLQvN8grK%2B94%2B2Lu26r9V3VZv1tsilP6uCs4TzaOykikYqBIs5ChMzkipmJUCatCxa9TDzlsI1cOBfPxIk3iCGaJaeZVmvgTo1JIExQrcdL0rWdV95WFjSks9XR%2Fackk3M5U9q5xfc&X-Amz-Signature=5f8cca9eaab2105452555972552e5f748544a961df35523783df114974e4f0f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46635KTE5U2%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032407Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDg4932xSq%2Bq4K%2BcD78k6HySUm6VL0h%2F%2BHo1LbY80YRUAiA3UjSDNMha7%2BVaSPwkMCpJQlmDxTcIe%2FIZFh3qttRF7Sr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIMEQB6ftBovzJfSl95KtwD8osNjRcBwJcHtK15ZJpnl4%2FkdQ%2FSqvZabZN0pfyFdERXhXWf%2B%2FZ5ra12refnVYqQ0fX7pnSLdlWpSOY365vz3jb%2Fd24l9KT9HpqU4WjW9Z6Jc2I%2B2DBxO6Pi0MUz6YavFjp4CEI4gGTdskfRHv50MUrzlod6l799QkEIXXTuolAmDFw5swp99VAlQ1pAo6sQubzJPuUOT0DuaoDIDsfxptobf4BsGTXXVKLBsCK7pmJgn3kxDIGZz2gcLTCceaE7q6VyZdWtxyPOA56Zle4wxxaMzONXFdAk3%2BHlTytqHfRkhPVyol5P%2BRZTf3ZwGQCikxWMk%2Fjw32tRQ%2Fhtn4MidqjBSFnlYYbNYZTsfGUnkfAbRL55fBt3D%2FEv%2FehaGvz7BUOGOqt92lpjyYIq3ghE2nI9kSHcdLNRvK%2BplEC1phSGq3p7RCVCfv8OaYfUoTCgaPpGg%2FEKQo2JkiYf%2BoiGLxTQ8Gyn0qHin9HDxDXOpDP73ZZTSLjS%2F2Y2pB3YMG2%2FsWVgx9gHODWZKkxhcqUWB5lYmVf%2FxWsTN4HcFRjFfDPjCUkavT787XbRT3IKqgvz6tMq8Ui1b5nA8VSKuOlL39vymH%2FBA4gD9sOUj962MXsvUcl%2By7xMJPzo8vMwrK39zQY6pgFznfHUjZ1JhkRE1EfRvrvGrbxdGU2Q8AoO0XpfV%2FukX47M4xua6ahVKay0fWCSyR%2BxzvdeZDerT3TjrYho116AKNrSnJx22P5UwZ3FpUyP6t5esxJrKXT81%2FKlT0IeNeeAAecv7ZDUJAfUuLYtB0rzhC3KIt8YDHLeLMmnVfltdc6PMxOjaIhBdV79WUOnSQSAJsfrZ8mcRMu%2BqxDizATiOdm%2F0%2FLa&X-Amz-Signature=0f4750aa8459ac784cdd831a5b262e94605281c3e2b18c43509d4b183f26546d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VXO22FAL%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032407Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDJBwECTy2pNeWJj5s%2BH2ZsezEB70HUcl7Xud0jt%2FbnJAIgHzy1iCD7904HP3jGMgCXrbuwJpshHZ%2F7LMLw4KYO6cUq%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDJT4fdY96MXCPB04fCrcAwvurPJIoCuxW%2Bdsz%2Bv9a273zLUcaqgU3ez7qOtH5165d%2BK9E7696FxZf18xMJc5bbiISYbb7o%2FmBrZGiZGBbWFDkuJMCVGQnoIRgpPoBhkqjDFsS%2FHMKKXpaFUUziimlPcVTNgoh5N8uu0Dlugkl17UWMSOQdpXEDbeHwdu3dTLX38sYnQfdibU05sV3kFU6x%2FD9sTQSyl5alVxz2AdFnr8l5IdOmuwcXSDr9yH7J%2FE8rFuJ1L3YChXh9l2gGMZarZY06%2F8iKHRH5NIEmY1iGHTEm4Vi5dytbJe4URTnbbzB%2BLHVaMp7W685zx4Wt3o2GlkIV44B26VfCrtxfprxaqUXS1vuPd90Y0RvOdHRo%2FSwHGmrz3O00SfcpyPR9HsPmdq0Cxra2ZhnmhQq%2FNHMiPA1McWJa4NHfaOEpfknKcL2o%2B0Du9XD5q9eyCmLw3Y7keS4Ht5onhhjV%2Bu9MV1Vedy9%2BE%2FH1vjfXvbE0kz%2BLAny63K8IAlktI5iTT3fRmTkRPH2Q3oFQ42kYO8WOIE6C%2Bc1QGxKTLDJqHIkCdiDLM3FIIvyDvbmXbY7fpxD2ijcSedJ9d5XslLLgEmXdRrYTPNbwlt1H22fGE6UxB2F%2BsjfBnxAD7QnC24g1uAMLas%2Fc0GOqUBg25KV5ATRkMrMj9XcP1nm2wmSDGXELYR7IH8sbtNBbco4qWY8v5YZgpCNlIICsha%2B0jVXFTM51IdOoqbZ2PjCbpGw%2BaivlYwnKKR10%2FSfG0aUkRj7p6bvbPMlKDtsef4lPzTpjrpUl4B8ERBNUFA9QhATfmqDrDji9KYv3AJhAKbhYhHsEk4xGtmP2hB0KVUPMjzEIs6PgwT1cMox5tacZeg9PwX&X-Amz-Signature=05b8cc31777987dfeb8cc6aea3ae7ca3b187b68e4d95338630d5fd991ff2d7e2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QURYYXKF%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICj3HfPIxYtFikQcs9huyrn3KFy1cBCHbzbMuX1QXSPBAiEAzvyq2omZ49kxVFh7n3mkB5nYHzM3Dk0wTko0UcZ7IT4q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDKjsBW%2Biv%2BLM27L2ZircA5ux68PDR5E8Iesj4yR8bodvrgHhXy3ZOYozQ6aI3kR1%2B8FMg%2FdnJoDs%2BD1sgmfoJek66MT5p1NK4WBQEKI7Ds8hge0qe8sZo1kMuo3s%2Fy1efqk%2FKa5fQ%2BSypE1moEUXzJ6B4yAEsQQ%2BVvnfi0Gm8yQLRuiV18mAVOuFBIV3KqEhGVwu1SKhNzSQ9E%2Fir91FbsZDP7oL3koTJtvssMOPcex8JLqxqym%2F%2BYn31LWilNWZ3O1VyF%2F5D6VM06cdz6xqVoyn7v5vQiS6pgiaCCe1SSub1w%2FmejrTr6xabdGioZrMAoi1ZmMTx0q6NKrqcz1P1AnFSW5C6GKrcofhVkBVOUP19NXNZyeSmMH6xJqMHwDz5%2FWMLAnP%2F075IvqKP5PoUqmMoVIthi9sxwbb1wbA1gpBW9aDNiwU%2BNgRbTlQ3%2FJcGRt%2B47OJgar2D5%2Bj4zYb7O5CfZE%2BMZPcKHvUWYljpdUjOW%2BfQSEcoZuOzgGf3jywobiX7UFin%2BPMLakMu%2BEP5lIpxOKKPlxbwtMWq8LtOBtoEdpkTh2kY78xgN4R8yO9r%2BJqcS%2F03QD6uPwZpYcEPCZCeQOIuTA2OLuyKlZX2ygImuAnrOHhC8U6nMapVQZnlgENdMMPRpNpFp8UMI6t%2Fc0GOqUBFyByeHKV8XduH3joRVXBun%2FWokE8k1Ji5j0YkUTZjOtOaR%2BZhmfnkcU9D75zVytXFW6Y1EhHdcYGQpD1Z2%2Bkelty%2BGqHp13YHD4L4PKFD%2FATIsw%2BR3bymx8XRkaB%2BB9ud3EnI3sq06bideGxUEf7wxlZt7DM5R%2FyVQi2CaiHWzKQyn6na%2BdvI%2BkwyT7%2FDXkYnLyYzobBJJHncHkfiSRElea6KQq7&X-Amz-Signature=9f2aede0bd55e6a3b8bd8f8b4074dbcdccc60933a8f688986a60e69dcff302ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QURYYXKF%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICj3HfPIxYtFikQcs9huyrn3KFy1cBCHbzbMuX1QXSPBAiEAzvyq2omZ49kxVFh7n3mkB5nYHzM3Dk0wTko0UcZ7IT4q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDKjsBW%2Biv%2BLM27L2ZircA5ux68PDR5E8Iesj4yR8bodvrgHhXy3ZOYozQ6aI3kR1%2B8FMg%2FdnJoDs%2BD1sgmfoJek66MT5p1NK4WBQEKI7Ds8hge0qe8sZo1kMuo3s%2Fy1efqk%2FKa5fQ%2BSypE1moEUXzJ6B4yAEsQQ%2BVvnfi0Gm8yQLRuiV18mAVOuFBIV3KqEhGVwu1SKhNzSQ9E%2Fir91FbsZDP7oL3koTJtvssMOPcex8JLqxqym%2F%2BYn31LWilNWZ3O1VyF%2F5D6VM06cdz6xqVoyn7v5vQiS6pgiaCCe1SSub1w%2FmejrTr6xabdGioZrMAoi1ZmMTx0q6NKrqcz1P1AnFSW5C6GKrcofhVkBVOUP19NXNZyeSmMH6xJqMHwDz5%2FWMLAnP%2F075IvqKP5PoUqmMoVIthi9sxwbb1wbA1gpBW9aDNiwU%2BNgRbTlQ3%2FJcGRt%2B47OJgar2D5%2Bj4zYb7O5CfZE%2BMZPcKHvUWYljpdUjOW%2BfQSEcoZuOzgGf3jywobiX7UFin%2BPMLakMu%2BEP5lIpxOKKPlxbwtMWq8LtOBtoEdpkTh2kY78xgN4R8yO9r%2BJqcS%2F03QD6uPwZpYcEPCZCeQOIuTA2OLuyKlZX2ygImuAnrOHhC8U6nMapVQZnlgENdMMPRpNpFp8UMI6t%2Fc0GOqUBFyByeHKV8XduH3joRVXBun%2FWokE8k1Ji5j0YkUTZjOtOaR%2BZhmfnkcU9D75zVytXFW6Y1EhHdcYGQpD1Z2%2Bkelty%2BGqHp13YHD4L4PKFD%2FATIsw%2BR3bymx8XRkaB%2BB9ud3EnI3sq06bideGxUEf7wxlZt7DM5R%2FyVQi2CaiHWzKQyn6na%2BdvI%2BkwyT7%2FDXkYnLyYzobBJJHncHkfiSRElea6KQq7&X-Amz-Signature=5a2e66d2a4d95debaed2cb8dd4ae7a05109ec3680048bfe4b2c8bd100ee86f8d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YKU7IJJ6%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032416Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCrtI8qUbO94vt4Cyl6qAwN5eMYMJw0z8%2FcDOLg2bT0HwIgRkoPDqU04qPdTLZnN%2FciG3zObCcSV6m6fOy1dZYULdoq%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDNM9oFl9k6ovgkHXkSrcA5MIrTzBRXQ1f0%2ByjBQqcr2e20y4Y2f2mEYi76tAoygV7Oo15otXox1kW4mrVkBtrX4z1lBQhpmtHOHFWOLXCYZl64Qsb7Zy2p7SkM6t7UyaVZP0BRXfSi1sowyeZby4zDcofwYX4KJ5R7YkDSoA%2FTDNwoG9FmOtjK6a1vY6ALC6GwQva3LHVyQErCVWh7J5%2FrYHCLaVRaWFtJM1baMrLtxf%2BSZoE9pq7YqUErBRjtBRsMqMrmKHFRPhA%2BTZomXNru2KcSfVxzr86r8fWU0mN%2BU62%2FLM05icLUOyRGv4%2Bl3Nuv87fqt5ADo%2FGNu4k7dJu7TJNyPIt8cF%2BIxjA6MMTBMZRh3YijT0KGtnhF9gFrbO%2FxsEXosqF716n0IPDuUBx8Jb1nERZPZ2Sc6bx4qYNUrw8ZMycdXV%2Fk6uwjVzj0KBiY%2B%2FNSAl7F15KkriPlljgMXDE9rktjD688H7I1ksLKMWBO3AbhAEkDrh0uT1tmmfg6tsQyRyok0eci2t%2FT4INvPziJlTQEb%2BNdk3sVyIcMjZ66t%2BA0i5nvjs68c8CT8PfsLijdxU8c4EAVU107v05IQDoZ0XE4oYPdY7bN1XJIw%2Bv8DoiEIB1UB9VJkWRBpdyXI%2Fag%2B0cErK61YyMMis%2Fc0GOqUBj2TQYmH3tbiunluXVKfNV3Jyi5PCwdxRme6siTMpAmFj1BSqSaZO5LbnoHs5rc%2B%2BiTvIZ0%2FEweldvHAjcZyTNpfWme%2F9aISjxvkMPcYBHwMJkyVpohOts1lG%2Ffmg7AKWQI45fZu8qeOMaYQCGTB7PaZnvSMUM9yR6EzDFVrlxVyfi%2F%2BxilE4FekZKKaRwaYbo6heUD8ExlL7IcDqw%2Bz36EvDm7zR&X-Amz-Signature=4cb9ff7c5cfa00d9de77b5419d767b40ad6d610fe408e74125f306df8fdc30a7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QURYYXKF%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICj3HfPIxYtFikQcs9huyrn3KFy1cBCHbzbMuX1QXSPBAiEAzvyq2omZ49kxVFh7n3mkB5nYHzM3Dk0wTko0UcZ7IT4q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDKjsBW%2Biv%2BLM27L2ZircA5ux68PDR5E8Iesj4yR8bodvrgHhXy3ZOYozQ6aI3kR1%2B8FMg%2FdnJoDs%2BD1sgmfoJek66MT5p1NK4WBQEKI7Ds8hge0qe8sZo1kMuo3s%2Fy1efqk%2FKa5fQ%2BSypE1moEUXzJ6B4yAEsQQ%2BVvnfi0Gm8yQLRuiV18mAVOuFBIV3KqEhGVwu1SKhNzSQ9E%2Fir91FbsZDP7oL3koTJtvssMOPcex8JLqxqym%2F%2BYn31LWilNWZ3O1VyF%2F5D6VM06cdz6xqVoyn7v5vQiS6pgiaCCe1SSub1w%2FmejrTr6xabdGioZrMAoi1ZmMTx0q6NKrqcz1P1AnFSW5C6GKrcofhVkBVOUP19NXNZyeSmMH6xJqMHwDz5%2FWMLAnP%2F075IvqKP5PoUqmMoVIthi9sxwbb1wbA1gpBW9aDNiwU%2BNgRbTlQ3%2FJcGRt%2B47OJgar2D5%2Bj4zYb7O5CfZE%2BMZPcKHvUWYljpdUjOW%2BfQSEcoZuOzgGf3jywobiX7UFin%2BPMLakMu%2BEP5lIpxOKKPlxbwtMWq8LtOBtoEdpkTh2kY78xgN4R8yO9r%2BJqcS%2F03QD6uPwZpYcEPCZCeQOIuTA2OLuyKlZX2ygImuAnrOHhC8U6nMapVQZnlgENdMMPRpNpFp8UMI6t%2Fc0GOqUBFyByeHKV8XduH3joRVXBun%2FWokE8k1Ji5j0YkUTZjOtOaR%2BZhmfnkcU9D75zVytXFW6Y1EhHdcYGQpD1Z2%2Bkelty%2BGqHp13YHD4L4PKFD%2FATIsw%2BR3bymx8XRkaB%2BB9ud3EnI3sq06bideGxUEf7wxlZt7DM5R%2FyVQi2CaiHWzKQyn6na%2BdvI%2BkwyT7%2FDXkYnLyYzobBJJHncHkfiSRElea6KQq7&X-Amz-Signature=91721e756a9dc0d99a44b7ea31bd95959d3ece8cda1e13296c28320c59e919f4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662EQLIBGQ%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032417Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDQZiNERknPV4y%2Fmf2FJ8L%2BRF%2FM6Rg8Q8V8RQDxT6jpZgIhAOg5Bf9B9KAdnrN5d5f4IlLcjx%2Ft6Y6AE20RIBB3eXq1Kv8DCFwQABoMNjM3NDIzMTgzODA1IgyIYbM%2FQWFblsFX8LIq3ANtdGw0MyqKjyQQ2FdzcWLxDgUtkcxlG4orObswH7ad%2FuQvuP4NL0oOOE3ma190o9wexBje%2F5VoCpXlULGsRb2cUuIZEL%2FAbdMMcPZNEoDvvkjs5Mc%2BBtLAmOUA8rqg0YDbmFoHXDX8%2Bv9v0DCGoDbCzaifCWzCBobR%2BIYDfMhd39YTyMA3CV3AIjO6b%2F0QfF1FojcPMTtN2XILpC4uNbn3ddHxrh2m%2BbUnbocPxB5XaAPAD%2BZb5zaZ%2BHW0z%2FaFvJmxQZa6IeVl2GF%2F0tmDbTNzFNUEQFNdLNbidFbrPDrL2QxTo3XJDh0osy8ImF8%2FLiSd37NlL7c%2FKxAh%2BWHp%2B5Ud%2BOFxjdKXl94qpZI8B5KG7KOLp62kIXYoJQpiS%2FGs6tlUCHin0yq4xPvFMshCdW%2BOT7f0TVn3vtd39htEBXdonJylCEi0NVa%2FoySgglhOIQQTOGIi%2BMSl%2BrMX2x59fxBDN2WUmM1cPmDMdXhRS1aALdxG5qrMokrR4nw2Fu%2BzTsPuIzi57z59uQs%2BzCOUQe6dsTfzGcInka9pk6fNlz7uPBeB5yTcRAWTt96ZmP0RVue8m19wZo6pEXJ4SK8X8rt3vZtP7i2KaqXFME3URm2wELP4RMI2XFQ4FLqLszC%2FrP3NBjqkAYfNjdmzGrReHPqpjZsSw7QEwqdqqpwqsj%2BZCiawoJ%2Ba53a9Tlh7%2F2deYE6QfRcsUNz0Y7HklrjC8JP%2FUS6cWsZZiOveJzLoZvO3MDJssvIrLmKFWF2RFOOoG7yK%2FrNJQXwMJFcD7Ndd82jvLgg34Iq7vHUsr%2BxVwp7pXVgH2FgFjlzvvMJwEx57a7uZKSRo9LzuL8A2Dc%2FOSbUBMGJh8GHDKNpM&X-Amz-Signature=8ac251e2fad067fdb15708f2376313ee0147ade5d453294b31b08fdb6fd07f79&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TSSYOZKY%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032417Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEZpVCnI3y%2BsxxGIbY%2FX80JaXyI2OaAYb9sBX5EAjZmlAiA1bWc17Oz0qN9s08TgF9UPFwcMs0NZ9rsz4irIIAVThyr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIMvH9TIfEF89P%2FYh6NKtwDjzS5yxKk4wzDA7YyEOLwggorCequanYduqF9DXC6ZX32MS%2F43j9DzOMlhoG31Do1rEfGqmFmQvP2Or26wfCbgYNhdOK1SzkRNpu6bZ6x%2FlyCOrepo6PI9VXu1LaBBgteSWt4jn9KjN2tY84xE8hwE8sG6bNTFAQLD48LP5uU2%2B9wutl3RkGJwZ0eZObniQWaZ3cpthgrt03aEiNUGB0kr3afbnWAAV%2FX%2BLF5yY%2F78xmRqu9k9VT1bXmTJXXIOqv97t325BTJWb%2F%2Fk7OYO%2FbI6vAVQ2iA%2B%2FR6kfvsx26rXM3QAam9kGeHvRaOiZ2wiFbp56f1JPmvo18ohnk2Y3dvuxVywD2XPOCPJZtoAfsFLfEPpIRQWfh2NPp26vLSE8XGf%2BLSTFwsQ%2F%2BwgSy66%2FuZusH08L1g8up2ysjeRDU1L%2FIwnFO36KRtkTNzy84DUaRAOEzDGlqRIwaXHqpAmYAzVKpb5Sr0w6sI4fFPVaL2O6mqbiOz7uaNjLcuRVmMEZ%2FmuNOEnanRiaUX1d%2FOlYTX9%2FNJWQ56c8LMUBgUo%2FcUcVUrYyRgdXcvwEzRlv8TzIn%2Ficfb7uzhmn7vwVkGQBIgnp6rA1gnfxAmvXAKFG5oqktQUfzPmlTiiLTYOx4woqz9zQY6pgHZY%2FBPKDHD5grVA9n8x3yILG%2BdznWWfWsWoQkALu0zWdrjYMRQVSXPDhmkfgLjof428DloIQ8V80JhthDT441NjJJlSddd9mWwoWfvu9DdYU%2BhYTYZVqGn9p%2FKz1C%2Bz0hST4iyqTBqndhR1DaAIMwpBbkwPxvVY2uIAQK%2FWrE2OEq18fNd7UXzHw8RLNTridDS0YZax3nyiO3WXkhx5br%2B%2BUi%2Fn%2F5u&X-Amz-Signature=34bee33d392232d7756c0b92098bea624bc3a50e88d7b274e1a7e6be89b3e5ac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZDIT4PO5%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032417Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCj0CFv3C5rHVdPigGXREqeiETct4AG%2F1lK8EeYoZyxWQIgSz9MXnQZ2f6oopUzfiOPiv1tQX0cBkHtaa%2BnLtA8e2cq%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDH%2FZcw2IqCVJhQi95ircA6dIxGSMRt4GuskAXKgtzaK%2BaDWw687F5D1S6Bubs2%2BQGiJdMR%2FYa4H6Opt0QQqHsi5RU03CbWMSP8L9HmlC2Sgq17pxuI3vzc79EgdEMCL4shRjGMe4voPemAUz%2BlYXCUy%2FeMSYn24pPooNLk0Nm7wv%2BpJ5f3i3aw2pCKKqIXeAqwKRGRBW6YKvaUjbqJS7s8Zr7DHn%2FMWMTaM4XzcO8Z4JQNjEKaqk2YU4CHmFOlAVBch8kWWlE%2ForFM1Hfs1BfyRHmoVKwaIP%2BQhvRJdpWMDxepsIztYUPFUR6T5%2BJ79mBzNOTEOLW1AQXh1VpoWr9%2FLxcp1le9lwt1GDu92v1m%2BLefGZnCiDMJhlcMSeBF9B8TqrnDo%2BkH9C6gLMiCepExfDaH%2BcqGlf%2FNePmpFC%2BlP4%2F3Ltwa6dUZqKrIRuo4%2FYrzDpb3%2BpBVWvq3jSPDNP%2F0sIos6N8PhwS%2FMWYXxUPTjm2M7m49tqBxU3R0Y6b1%2BB8uO%2FittVPaUraoXHsOgZmftMbvzudKFYprW9WfHhGCmmBW9muBWKOp%2B7He7yKM%2FQ9Q04NxIvryoB4Ajw5%2FiVwaJzTD3blJIPFaeTogCunEdk0t7F17ixPcYj4BCX42FDq%2FCHQ2PdmyQSMddCMOys%2Fc0GOqUBh7BqS1sQFN8IrY5HpKjz73gqFvmdBeUqFG59nkPugLCxmc7net0veNsMyNWb16gWOOTp3S7%2Bo456yh%2B1sH%2BII%2Fw9EqUi8%2FRmFi2V7698bcFmtnBclRt3rXqvz6yOLT6wDQLtF7LZ0nxDKQEtQS%2Bv2NUsA27uxsBRjSBnL9WEe3EwU%2FH1gc9TjZBDbk3peo97dhy7l8%2FVRbvWQAIAmUabnqp2PD%2Fa&X-Amz-Signature=1b4576ec4526abb079499e47cc0f6910153c80595ccf48463cef3e2e3ada0b3d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662U5ZNLZZ%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032418Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEVkqXgliGarXk3abrCVTbf9%2BuegrlwL94nP5inYDbCyAiEAkkOIgg3EoYR2lIwQ5pOhziZT8CLGjNlCtq378JO%2B4BMq%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDFlQGoOwLoEAWXac0ircAxBeT4ACzDC0bd2qfc%2FIInFnqCVAYoUHsmwFxKVfjo4pK6xxz%2FpqsRc8s%2FYt7Fl1nhMn%2FSxlLdkcQICf%2FDvVbV68P88G3NvJ%2B%2B%2FMkdCo8Q38cPvBPLSrcjr9Wl7RKLSEHb4ISDTkuhEOwwYAzr2a4phezuVN%2BWkZQ3XPkDUYAEV2gvsADCYdshOl1wyMsj09rHo5rVCAzip6EcNyFu8g9Y5Jkij1Psg%2FXDe5lbU89INqow%2BdEB4czsKU7Rua332OycKCcdApeJupMom0EVrpqteknOfMxKjDXkQCYaxse3cEAyTuG2hsf5Emql8atER4tp3AakXn05BZXvfkWou5svPpBKf%2FpXCF5QkMqxoMCE%2Fk7s2GFRDkZv%2FEYpMcGfTlPcl3RNUG6YtC3TC8NYwmlGIwW80EqICL1%2FzyYLY0p0mV9RPOyo0BE6e86gEDDxCMg%2BpSDnqt9qZfL3Mqy5LdN4dgvdIUSP2S6BqfEkc2HGxyNZUh7RynZW4Wq2s6jfVYntul4b9BvNcZU5d%2FKbYtw5CG%2BC3VwEkTCvu%2BFU30tMTodFVavV%2BLELjZJldx%2FOp62DbEAATgfC9CyGzRGtdXsTuz6%2Fcpvp4C1RQPMyLUVwzi0WrqoeMRxRlSc2h6MKes%2Fc0GOqUBpTb87Ne58B2wX%2Bj7V3BVuMAE%2FosUNLHaGdo3ASb%2BbHsb6PSVE4hoBNDXPEbH8ugsjm9jZ00GN0o3L28Ob%2BmAYmOXKSG4CBFKJw3UOSkNJGaLDT6R123%2BD6Y7dwdZdBLdvnto0Qohfw9ZKlsFoGU1o70SvqAhCux2UbMlBKv8uQAFXMjM43NtdHg0RHY1Tb4EEOAw9bnAnCSp4gJgeGwknhzTc7z9&X-Amz-Signature=7eccd45b5e2e11996142ef584ec3befee93d534eaca4d6c3c9ea1fa11caf20c3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QURYYXKF%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICj3HfPIxYtFikQcs9huyrn3KFy1cBCHbzbMuX1QXSPBAiEAzvyq2omZ49kxVFh7n3mkB5nYHzM3Dk0wTko0UcZ7IT4q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDKjsBW%2Biv%2BLM27L2ZircA5ux68PDR5E8Iesj4yR8bodvrgHhXy3ZOYozQ6aI3kR1%2B8FMg%2FdnJoDs%2BD1sgmfoJek66MT5p1NK4WBQEKI7Ds8hge0qe8sZo1kMuo3s%2Fy1efqk%2FKa5fQ%2BSypE1moEUXzJ6B4yAEsQQ%2BVvnfi0Gm8yQLRuiV18mAVOuFBIV3KqEhGVwu1SKhNzSQ9E%2Fir91FbsZDP7oL3koTJtvssMOPcex8JLqxqym%2F%2BYn31LWilNWZ3O1VyF%2F5D6VM06cdz6xqVoyn7v5vQiS6pgiaCCe1SSub1w%2FmejrTr6xabdGioZrMAoi1ZmMTx0q6NKrqcz1P1AnFSW5C6GKrcofhVkBVOUP19NXNZyeSmMH6xJqMHwDz5%2FWMLAnP%2F075IvqKP5PoUqmMoVIthi9sxwbb1wbA1gpBW9aDNiwU%2BNgRbTlQ3%2FJcGRt%2B47OJgar2D5%2Bj4zYb7O5CfZE%2BMZPcKHvUWYljpdUjOW%2BfQSEcoZuOzgGf3jywobiX7UFin%2BPMLakMu%2BEP5lIpxOKKPlxbwtMWq8LtOBtoEdpkTh2kY78xgN4R8yO9r%2BJqcS%2F03QD6uPwZpYcEPCZCeQOIuTA2OLuyKlZX2ygImuAnrOHhC8U6nMapVQZnlgENdMMPRpNpFp8UMI6t%2Fc0GOqUBFyByeHKV8XduH3joRVXBun%2FWokE8k1Ji5j0YkUTZjOtOaR%2BZhmfnkcU9D75zVytXFW6Y1EhHdcYGQpD1Z2%2Bkelty%2BGqHp13YHD4L4PKFD%2FATIsw%2BR3bymx8XRkaB%2BB9ud3EnI3sq06bideGxUEf7wxlZt7DM5R%2FyVQi2CaiHWzKQyn6na%2BdvI%2BkwyT7%2FDXkYnLyYzobBJJHncHkfiSRElea6KQq7&X-Amz-Signature=671dd6331e6f0569e6bc4664464ce28ab1ed9416fc1ce50b2125e2db74e255a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QURYYXKF%2F20260322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260322T032317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICj3HfPIxYtFikQcs9huyrn3KFy1cBCHbzbMuX1QXSPBAiEAzvyq2omZ49kxVFh7n3mkB5nYHzM3Dk0wTko0UcZ7IT4q%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDKjsBW%2Biv%2BLM27L2ZircA5ux68PDR5E8Iesj4yR8bodvrgHhXy3ZOYozQ6aI3kR1%2B8FMg%2FdnJoDs%2BD1sgmfoJek66MT5p1NK4WBQEKI7Ds8hge0qe8sZo1kMuo3s%2Fy1efqk%2FKa5fQ%2BSypE1moEUXzJ6B4yAEsQQ%2BVvnfi0Gm8yQLRuiV18mAVOuFBIV3KqEhGVwu1SKhNzSQ9E%2Fir91FbsZDP7oL3koTJtvssMOPcex8JLqxqym%2F%2BYn31LWilNWZ3O1VyF%2F5D6VM06cdz6xqVoyn7v5vQiS6pgiaCCe1SSub1w%2FmejrTr6xabdGioZrMAoi1ZmMTx0q6NKrqcz1P1AnFSW5C6GKrcofhVkBVOUP19NXNZyeSmMH6xJqMHwDz5%2FWMLAnP%2F075IvqKP5PoUqmMoVIthi9sxwbb1wbA1gpBW9aDNiwU%2BNgRbTlQ3%2FJcGRt%2B47OJgar2D5%2Bj4zYb7O5CfZE%2BMZPcKHvUWYljpdUjOW%2BfQSEcoZuOzgGf3jywobiX7UFin%2BPMLakMu%2BEP5lIpxOKKPlxbwtMWq8LtOBtoEdpkTh2kY78xgN4R8yO9r%2BJqcS%2F03QD6uPwZpYcEPCZCeQOIuTA2OLuyKlZX2ygImuAnrOHhC8U6nMapVQZnlgENdMMPRpNpFp8UMI6t%2Fc0GOqUBFyByeHKV8XduH3joRVXBun%2FWokE8k1Ji5j0YkUTZjOtOaR%2BZhmfnkcU9D75zVytXFW6Y1EhHdcYGQpD1Z2%2Bkelty%2BGqHp13YHD4L4PKFD%2FATIsw%2BR3bymx8XRkaB%2BB9ud3EnI3sq06bideGxUEf7wxlZt7DM5R%2FyVQi2CaiHWzKQyn6na%2BdvI%2BkwyT7%2FDXkYnLyYzobBJJHncHkfiSRElea6KQq7&X-Amz-Signature=b8226f375a4a2a9c5a5e25c96ef4b1c268770f9ee900ff09124f07b83ab94944&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

