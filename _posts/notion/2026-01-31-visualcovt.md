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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YAV7IKQ%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034145Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDv0N3YfhCjt%2BAHv0py%2BpZyWkNA5r5CEoqXlPpHtutuPgIgd4atVO27qLn8JmQubhLClqrNM3yTV0iH0%2Bm%2FV2m5keIqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKMWH2urp117%2BY96aircA9nzw368LEyCUngg0SDBoXphpJDpL%2F25ZHfkXbb8zZNY0vG%2FGuiLQrvA32p1BYy5j38tcg90vKcfb9Kry69fg%2BrZ7qMDr6VqlDkKn09z5QHAyV072EKDVsidjQHqy%2BgN07SN2ZTQS5eX39zNWyvdyK2IpztRAL8wK3SeM8uWCwSGGuSJwyw8d4pZKX4XSOqfNxtaSGHfGLIhs5zIXS1NDrlF%2Ba2uWL1Gdm4HAeeCrjtDb7bE%2FS2s%2FHkdd7p7wefXliBFiXSrL%2FZ1xX4ejHZsYXeFoIdYaWb2kU9zAsGdyL7B7Sl0263Rcwc%2FG1MgoRIEk8vMOwmqMc%2BzXqdglU5O3mml6%2Fny5fXqdn%2BrkZCnjuhnNQMoWLwEjE5SZrmYhrlrf1QDsuCRj%2FkdStDB34Meb7BuhusCz%2FvnfG2xqMHbuiVuCrP2ldDDrjazAREdzLfSfqWnOthgl9jZgJ72nIXag6FXBY1%2FqKQ0SzMIkKkEyd68LAmfIB6qnYIn9EVsIxF5JKafScK1fcxmVenBw7r1xgyYZ1xKtOm2ZhvRkgZWytgvsId9l2RMPQVorNIF%2F%2Bxm1vzgLgpanbfbNKMBfqchfch7hlLG2wXM1ZaW4RXX%2FjenSXncxRggI1e3gd6FMOLe9s4GOqUBm%2FaH7StFLvDTR26wIufqdWDsDmm1OxvIHb3wfYJ31juET65p825kKbr%2FrHdIqZ2FMX1WsDvbDCq8qSp%2Fzrqs%2BZEbX4MrRhpVXQtVf6v3JlkJ24kFcAE1muFXbBQaDrhHoDVrUQ4C%2BEbEV2N1wzg6AU8G5McEzzckVeNtofgcd1NouMkjKrZp6Oo4tOdU4Fl%2FvhVncT%2F%2FjUkRozRnZXEYpoLvCRu7&X-Amz-Signature=0cd7c44e943fd14d02a4b2e828a1f9f621967abdbc828d009c0823291d75c032&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YAV7IKQ%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034145Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDv0N3YfhCjt%2BAHv0py%2BpZyWkNA5r5CEoqXlPpHtutuPgIgd4atVO27qLn8JmQubhLClqrNM3yTV0iH0%2Bm%2FV2m5keIqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKMWH2urp117%2BY96aircA9nzw368LEyCUngg0SDBoXphpJDpL%2F25ZHfkXbb8zZNY0vG%2FGuiLQrvA32p1BYy5j38tcg90vKcfb9Kry69fg%2BrZ7qMDr6VqlDkKn09z5QHAyV072EKDVsidjQHqy%2BgN07SN2ZTQS5eX39zNWyvdyK2IpztRAL8wK3SeM8uWCwSGGuSJwyw8d4pZKX4XSOqfNxtaSGHfGLIhs5zIXS1NDrlF%2Ba2uWL1Gdm4HAeeCrjtDb7bE%2FS2s%2FHkdd7p7wefXliBFiXSrL%2FZ1xX4ejHZsYXeFoIdYaWb2kU9zAsGdyL7B7Sl0263Rcwc%2FG1MgoRIEk8vMOwmqMc%2BzXqdglU5O3mml6%2Fny5fXqdn%2BrkZCnjuhnNQMoWLwEjE5SZrmYhrlrf1QDsuCRj%2FkdStDB34Meb7BuhusCz%2FvnfG2xqMHbuiVuCrP2ldDDrjazAREdzLfSfqWnOthgl9jZgJ72nIXag6FXBY1%2FqKQ0SzMIkKkEyd68LAmfIB6qnYIn9EVsIxF5JKafScK1fcxmVenBw7r1xgyYZ1xKtOm2ZhvRkgZWytgvsId9l2RMPQVorNIF%2F%2Bxm1vzgLgpanbfbNKMBfqchfch7hlLG2wXM1ZaW4RXX%2FjenSXncxRggI1e3gd6FMOLe9s4GOqUBm%2FaH7StFLvDTR26wIufqdWDsDmm1OxvIHb3wfYJ31juET65p825kKbr%2FrHdIqZ2FMX1WsDvbDCq8qSp%2Fzrqs%2BZEbX4MrRhpVXQtVf6v3JlkJ24kFcAE1muFXbBQaDrhHoDVrUQ4C%2BEbEV2N1wzg6AU8G5McEzzckVeNtofgcd1NouMkjKrZp6Oo4tOdU4Fl%2FvhVncT%2F%2FjUkRozRnZXEYpoLvCRu7&X-Amz-Signature=1785a5d32f049b657c6dedf5f2a5561aa7512f84b9be25aa707bef01d5f86b0f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YAV7IKQ%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034145Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDv0N3YfhCjt%2BAHv0py%2BpZyWkNA5r5CEoqXlPpHtutuPgIgd4atVO27qLn8JmQubhLClqrNM3yTV0iH0%2Bm%2FV2m5keIqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKMWH2urp117%2BY96aircA9nzw368LEyCUngg0SDBoXphpJDpL%2F25ZHfkXbb8zZNY0vG%2FGuiLQrvA32p1BYy5j38tcg90vKcfb9Kry69fg%2BrZ7qMDr6VqlDkKn09z5QHAyV072EKDVsidjQHqy%2BgN07SN2ZTQS5eX39zNWyvdyK2IpztRAL8wK3SeM8uWCwSGGuSJwyw8d4pZKX4XSOqfNxtaSGHfGLIhs5zIXS1NDrlF%2Ba2uWL1Gdm4HAeeCrjtDb7bE%2FS2s%2FHkdd7p7wefXliBFiXSrL%2FZ1xX4ejHZsYXeFoIdYaWb2kU9zAsGdyL7B7Sl0263Rcwc%2FG1MgoRIEk8vMOwmqMc%2BzXqdglU5O3mml6%2Fny5fXqdn%2BrkZCnjuhnNQMoWLwEjE5SZrmYhrlrf1QDsuCRj%2FkdStDB34Meb7BuhusCz%2FvnfG2xqMHbuiVuCrP2ldDDrjazAREdzLfSfqWnOthgl9jZgJ72nIXag6FXBY1%2FqKQ0SzMIkKkEyd68LAmfIB6qnYIn9EVsIxF5JKafScK1fcxmVenBw7r1xgyYZ1xKtOm2ZhvRkgZWytgvsId9l2RMPQVorNIF%2F%2Bxm1vzgLgpanbfbNKMBfqchfch7hlLG2wXM1ZaW4RXX%2FjenSXncxRggI1e3gd6FMOLe9s4GOqUBm%2FaH7StFLvDTR26wIufqdWDsDmm1OxvIHb3wfYJ31juET65p825kKbr%2FrHdIqZ2FMX1WsDvbDCq8qSp%2Fzrqs%2BZEbX4MrRhpVXQtVf6v3JlkJ24kFcAE1muFXbBQaDrhHoDVrUQ4C%2BEbEV2N1wzg6AU8G5McEzzckVeNtofgcd1NouMkjKrZp6Oo4tOdU4Fl%2FvhVncT%2F%2FjUkRozRnZXEYpoLvCRu7&X-Amz-Signature=0e09bc0e959c43672d3672816df16a3e205043e9b85f3fafb662b87fed00593c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YAV7IKQ%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034146Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDv0N3YfhCjt%2BAHv0py%2BpZyWkNA5r5CEoqXlPpHtutuPgIgd4atVO27qLn8JmQubhLClqrNM3yTV0iH0%2Bm%2FV2m5keIqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKMWH2urp117%2BY96aircA9nzw368LEyCUngg0SDBoXphpJDpL%2F25ZHfkXbb8zZNY0vG%2FGuiLQrvA32p1BYy5j38tcg90vKcfb9Kry69fg%2BrZ7qMDr6VqlDkKn09z5QHAyV072EKDVsidjQHqy%2BgN07SN2ZTQS5eX39zNWyvdyK2IpztRAL8wK3SeM8uWCwSGGuSJwyw8d4pZKX4XSOqfNxtaSGHfGLIhs5zIXS1NDrlF%2Ba2uWL1Gdm4HAeeCrjtDb7bE%2FS2s%2FHkdd7p7wefXliBFiXSrL%2FZ1xX4ejHZsYXeFoIdYaWb2kU9zAsGdyL7B7Sl0263Rcwc%2FG1MgoRIEk8vMOwmqMc%2BzXqdglU5O3mml6%2Fny5fXqdn%2BrkZCnjuhnNQMoWLwEjE5SZrmYhrlrf1QDsuCRj%2FkdStDB34Meb7BuhusCz%2FvnfG2xqMHbuiVuCrP2ldDDrjazAREdzLfSfqWnOthgl9jZgJ72nIXag6FXBY1%2FqKQ0SzMIkKkEyd68LAmfIB6qnYIn9EVsIxF5JKafScK1fcxmVenBw7r1xgyYZ1xKtOm2ZhvRkgZWytgvsId9l2RMPQVorNIF%2F%2Bxm1vzgLgpanbfbNKMBfqchfch7hlLG2wXM1ZaW4RXX%2FjenSXncxRggI1e3gd6FMOLe9s4GOqUBm%2FaH7StFLvDTR26wIufqdWDsDmm1OxvIHb3wfYJ31juET65p825kKbr%2FrHdIqZ2FMX1WsDvbDCq8qSp%2Fzrqs%2BZEbX4MrRhpVXQtVf6v3JlkJ24kFcAE1muFXbBQaDrhHoDVrUQ4C%2BEbEV2N1wzg6AU8G5McEzzckVeNtofgcd1NouMkjKrZp6Oo4tOdU4Fl%2FvhVncT%2F%2FjUkRozRnZXEYpoLvCRu7&X-Amz-Signature=ef0f36ec9c370d03eb5c0b636a7ce8608d5c4e566900439a3c70591b71e0e3df&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQ4JQLCL%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034158Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIElKSYxJCIsxrk8VwDYgUVgKvxqEozpwL999rLCnu2udAiAoHoYtckRmP5U8eH%2FvG0zefCZkEUhLwLtYF%2BowZtM4UiqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMgI0O45WLPVHYkz0WKtwDG6naIxeDKL1PAzqbcUB0waN33oWTSmoOHcfLaQRffz%2F08v39coOtb47Lznkc7FDdQiMeftu5zM%2FFGTo0GyvkbZroc4WVO2PiLgNVRZfvzoBICTxDUTZwyL%2FimQ4By1b%2Fysuzq2WaSey%2FUdxE0VJJNe%2FWD5YRwCT%2FB%2FaEeqZ5erajEJG2XPCTJyPMERfVLq35KSeo5umkWjTwiAFgrpIgAjj98fYxu%2Bgf02jPnL0NWqfvLX%2B%2B1d2zPKQp0FFLc%2Brvw9yMl9lenI0EPucgPVqqI8Tpv7%2BRsha0AIdNcKssLKIlB3fEMV7u1rnZixU1O02tQcvUxvLl5PQqO0u8CqwBCNUo7sCScktsajMiW3YCvPTbXYkG0K7fZShlIZx7xMk3c8Uj%2F%2BoF6Oma0p2w%2BvtgfwvGJUhB8ReZ%2Bwqj8oNfj4ZO7vGxz%2BU9HtVSUhqn37MzOBfA8gSaf6JbHySZNDvFy0NPfXdVgfgQlILjpGot9WrcvyCG0IlaDSNWjVBJI%2FH2zyvOzlPVzlejnXT1sYS9uK53VfIUqk8XECzUUy%2FJKe5NiJhKfwK8%2BT5PNX%2Bq3NFQ8V3RuVEaNoUVcNNe9wn6PGXtDrU2SN5Eg6WROX2oT1RfVlcHwV9rq1wtHvEw8N72zgY6pgHDL7gEvOFkAXCgF6Cr5eQExPWAFSTx03US6xMeOV8jADJJHDF9JSDQix4R1HJwsWCttJ2g6E8iUo3GuL9w33KoX2LcFSrywCYiP19ZQEKAKWqHUla5PJEIWhr2EQH8N8mEH6sE2rUioz7RxbHeGBOoKmu%2Fenz6jFqLDxq9ehB0cgGU70QNUnXo0eWVYVVM%2F3JAvy%2BLE5t%2BpfLfDkk4pcBQxchgH0V%2F&X-Amz-Signature=816d0964127876780ee6227a7a223bf9eda686ced54f2a0242fc5c343345ddc3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W3ACEOM4%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034203Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDXwhJIrotMcvHhRpQ1uVUeLUW7cZR8b3oN4raSIlm8FQIgJtjnLHdJFRFw%2B6KiUzbv54ARRTqvcytSEhtEdO77X5EqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDO8BBV2a9DrDeILRqircA%2FLILuO3bFsby1xRFrpfmTLSdUglMMAnzbBoGivPutEv5q4Y9G4LKM48h4%2BOpprWQNFiEkj5CCAPB%2BTr01UEx7dwONtOQ%2B1B2FrVdtwwsyBjeP%2FcNaBcEh8Q0JxNKPoe%2B%2FtjTV1zozdcHlHQ5GJlza0eIUub%2BqjT4rAuSvMUk7V8KSC1PtVW9EwPdaSpc1WgLzd4z225vOLJ6Vtz%2FEYn15b75u2TC%2BHRDop4dLOXCflseKFXUk0wF00mrCVuXwQ%2FrT9p26XCyc5I7DVjy25gbkyDc3OqQJkkkR%2BG3lqEBEdbg3iueESZcXburDVYP28YW6lJRnlWlPyDXQfJ8CG4HiHbrrxTnPAP5Ixwfp7x6MU3%2FRjI9XDBZhZH6AA2Pj3viRkPwstUZgsiby8XB0uMz%2BtEKmGF51D1gK2ojkiilIZgyjl8ah1w5SdKBMUqHl1i3Wi8%2BcbqwBFBM30xWaMVWnfcwCz0eIK9uRA2%2FCZedC4PxQAy2YxQwCHGGWSdILOyh%2BtS6ZYiGDIVYgtVYzIp3qyDpotOjnl4rulncjQpbLBmpSDh7OAZhEa0JfAS9gFBoa83lXUCDFKs6U2q9%2Ber8sGqv6QTX82XiyStLwEepHoiCjJPeRVHBd%2BhGZFtMKHf9s4GOqUB%2BhruHBbBHa7sK9aKYp1p5525raZhhlSe6%2BteX%2FByoylz2vHaVQqdslgcHv3LCbEVZXd8ZO9JqmeWOyzRg0ZDxo45RXl3EBu0NWM%2BQ8ByVwBAafultW6Uj3JLQFcNJygV4zE1IcS01vMRmrh4XWbWnrw44C0C4Q%2BnDHu20%2Fl3QoA2eOenV2nqwH%2BdktdXo7aW58MLYZOwwumFT2BPgpmN9BCr7ZjA&X-Amz-Signature=525dda5e5583ea61f1ee21e09e5a335891aa9a08697958346427396f98deba0b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RB7S5LU5%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICu%2BV5tHZ98RQqT4p08Xv%2FIEGxyvINMAJAea4Qhx7EhLAiEAnviiH6TLvGMs4zrJPZiUPXqkOlmcfaUVtNjPwIMzTd4qiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKbGBoZE5dVPbO3pXSrcA62IGrJ2sxsz10e7pUz5bJzfk2wGWnMDON1R8njGihQxFi89N6KP578iEgKyBUD2xXnDpgclrlBDAUrMtnEl0b%2FWl%2BbcNqbdRSzCMvEyW6Zrvy8zDaan8eJMnCMDKla%2BXsZm355wcTW8ARzmFI3sU5Th4T32yCaGjmJLEfWtGWx4OM1QkHzHJvOpq4OUHMrq9wv6X1%2BysbSQbFOpjc%2FGTn0AHeULPARCQsXRGb8y4J4c%2BBra5Fca%2FwdOP3kivom7OgcdlgH4Dk4OiylrkCzOHnzSue74XQIwhcpy%2FLbLGKnEmdpGm30kz8HfH8q8ZI3Vw0%2FOKAa0g9Ra2XU3gxSSV6eYzDd1%2BRbUwrs4E0IEfSgHQqLoeeJx7tZcbhoo9zdtLven4kFd5dxWoWRPODLbEravzR%2BJ0gVc3bHVw2lZMzJKVfp4QQFQnTPQgsqV30ggwn5L8yhpAOFPXFsgg4zbYxYA2WPVXzt9QQkT3OjPwAo4ib5eSckSytvC6k0CF7F0ZLIJuJTUk3XqxJbOzkXgANtctHVvaTIfU%2FXBiN4FuA4o8yJZBIx6dCvSmxQJsr2ar1Kotn43flK19IQVHC7MbwE8153V%2FtHoXkhcO%2FcVKT0LQD4eoabH7xMuci3%2BMMTg9s4GOqUBuFzUhLZxvsPF5hJ5o70GsAYqNSaLzGXIZiJxnTh6bRSTeZ9tqtFhIg4z%2BOQ%2BM8jxRzLy8pkxvGX59ZflhGYZ0IvQfmSCkeLVY%2Fuxfbyk%2FKzdZuVShEaL1yxbUWTIO469hI2wUx%2FD9Kc9NP%2Boq%2Fj9iCviXLUjQr2rcnxRms4qWFvxhKfR0K%2F%2FBhvzRbgw1IhpW6Cp2C260pOwxdsA53Li%2BJXyM435&X-Amz-Signature=70bd4eb1a37703132d4fbc074a83c66a23c1d2fe72b1c1a9adfeecd0702ffcbe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U2DUO3DJ%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBMFpFPEm7SPyIBwZCP1ZlFl7d8HorVhVaNBkY9JK%2FL2AiEAl8icbbsOv8Or6iZcDp79uvvfulEXez8hY41HGLGwK7UqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF6Akp7S5Wo1tHg7WSrcA%2Fa5Fyacdzs1kfpHFESxJ8VLZuDy1Xc8JRrfMvKCtiej4nlUyyQSRNzSX0OPgCzRvyktw2nyPRMfXfYGYQzIezSpdYtfS6X2bo%2BHQbefDuJflpbiRv0UPVe0RwemF9I8%2Frw65qIBwS%2FLaJXc9s3QndgMXyAzoNSasJe5N5THnlb4BVe6Szy1vt5jieOvwiCA%2FLCCs%2By2MYynjlWJWkLb9Nyq6QdmZ360T3GJB%2B5mDCPDguHktVbmqpvQg7urh%2BvaZ1gYx4md9JSJb2Q1pD%2BbhmQnDgmvGhsc8fsxKzf0bILGSeJGcDLu%2BXnKkA4g6qEfO6yB5tz%2BV4dfLmK5YT6%2Bi6nfWgrdgxQDkYHaSRbvhaG6qY7BYe6l%2FMKKcFT4GvhKoUtwJCUvrP9kGzNokerCFj6bkuGZCh%2Fmh3m8ltpByDRqUCxcIWjHhThS4BnS9uWA6YwzCm38irYIdZFHSXWMW6mPLk%2Fc0E%2F23SqvPu45eC2WH%2F8J6MP0UetLIJM9XnIAgrZ%2FVQEIhj4kaTjAWxKLWYeAJ6SOmwH9%2BKqaVC%2B9l%2BDYS5HNiqP0Mc062o0Dl8t%2FQkWH8Yv9gzbtkMilwriPyKO0A3j2NF2KE4Sq7EbeJ3hbos5mnDJy2GOIfSKZMPXd9s4GOqUBUcInv4f4GzFaMQBO0j1XYGh1GbkoiBMNOrYeJkMdgo%2Bg897nkFOGHHHJm8G1Tr16Jg4F78dMDBKKaceh0r5JoI30LZtY7d%2BSqzPd%2F7Mqxda%2FdayunFyReWcQAuTcYP59qfaqwTwTz%2BivSrtJ4eDyEnQYUn1%2BlrabmKEdaTG0Wise0h1kwriZSx%2BaD4U39Pi3OTk%2Bzxk5Yev0rgQyXe0n%2BGto%2BfpF&X-Amz-Signature=e58b745fc3112af8443d6a4bf9cc174a03d4b11aaa3d28e8c14c136d87e6a477&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YAV7IKQ%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034146Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDv0N3YfhCjt%2BAHv0py%2BpZyWkNA5r5CEoqXlPpHtutuPgIgd4atVO27qLn8JmQubhLClqrNM3yTV0iH0%2Bm%2FV2m5keIqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKMWH2urp117%2BY96aircA9nzw368LEyCUngg0SDBoXphpJDpL%2F25ZHfkXbb8zZNY0vG%2FGuiLQrvA32p1BYy5j38tcg90vKcfb9Kry69fg%2BrZ7qMDr6VqlDkKn09z5QHAyV072EKDVsidjQHqy%2BgN07SN2ZTQS5eX39zNWyvdyK2IpztRAL8wK3SeM8uWCwSGGuSJwyw8d4pZKX4XSOqfNxtaSGHfGLIhs5zIXS1NDrlF%2Ba2uWL1Gdm4HAeeCrjtDb7bE%2FS2s%2FHkdd7p7wefXliBFiXSrL%2FZ1xX4ejHZsYXeFoIdYaWb2kU9zAsGdyL7B7Sl0263Rcwc%2FG1MgoRIEk8vMOwmqMc%2BzXqdglU5O3mml6%2Fny5fXqdn%2BrkZCnjuhnNQMoWLwEjE5SZrmYhrlrf1QDsuCRj%2FkdStDB34Meb7BuhusCz%2FvnfG2xqMHbuiVuCrP2ldDDrjazAREdzLfSfqWnOthgl9jZgJ72nIXag6FXBY1%2FqKQ0SzMIkKkEyd68LAmfIB6qnYIn9EVsIxF5JKafScK1fcxmVenBw7r1xgyYZ1xKtOm2ZhvRkgZWytgvsId9l2RMPQVorNIF%2F%2Bxm1vzgLgpanbfbNKMBfqchfch7hlLG2wXM1ZaW4RXX%2FjenSXncxRggI1e3gd6FMOLe9s4GOqUBm%2FaH7StFLvDTR26wIufqdWDsDmm1OxvIHb3wfYJ31juET65p825kKbr%2FrHdIqZ2FMX1WsDvbDCq8qSp%2Fzrqs%2BZEbX4MrRhpVXQtVf6v3JlkJ24kFcAE1muFXbBQaDrhHoDVrUQ4C%2BEbEV2N1wzg6AU8G5McEzzckVeNtofgcd1NouMkjKrZp6Oo4tOdU4Fl%2FvhVncT%2F%2FjUkRozRnZXEYpoLvCRu7&X-Amz-Signature=77b8305bbfbde394f781bf1a3e2b84f6bf5174211dcc98431541e840adad7d88&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YAV7IKQ%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034146Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDv0N3YfhCjt%2BAHv0py%2BpZyWkNA5r5CEoqXlPpHtutuPgIgd4atVO27qLn8JmQubhLClqrNM3yTV0iH0%2Bm%2FV2m5keIqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKMWH2urp117%2BY96aircA9nzw368LEyCUngg0SDBoXphpJDpL%2F25ZHfkXbb8zZNY0vG%2FGuiLQrvA32p1BYy5j38tcg90vKcfb9Kry69fg%2BrZ7qMDr6VqlDkKn09z5QHAyV072EKDVsidjQHqy%2BgN07SN2ZTQS5eX39zNWyvdyK2IpztRAL8wK3SeM8uWCwSGGuSJwyw8d4pZKX4XSOqfNxtaSGHfGLIhs5zIXS1NDrlF%2Ba2uWL1Gdm4HAeeCrjtDb7bE%2FS2s%2FHkdd7p7wefXliBFiXSrL%2FZ1xX4ejHZsYXeFoIdYaWb2kU9zAsGdyL7B7Sl0263Rcwc%2FG1MgoRIEk8vMOwmqMc%2BzXqdglU5O3mml6%2Fny5fXqdn%2BrkZCnjuhnNQMoWLwEjE5SZrmYhrlrf1QDsuCRj%2FkdStDB34Meb7BuhusCz%2FvnfG2xqMHbuiVuCrP2ldDDrjazAREdzLfSfqWnOthgl9jZgJ72nIXag6FXBY1%2FqKQ0SzMIkKkEyd68LAmfIB6qnYIn9EVsIxF5JKafScK1fcxmVenBw7r1xgyYZ1xKtOm2ZhvRkgZWytgvsId9l2RMPQVorNIF%2F%2Bxm1vzgLgpanbfbNKMBfqchfch7hlLG2wXM1ZaW4RXX%2FjenSXncxRggI1e3gd6FMOLe9s4GOqUBm%2FaH7StFLvDTR26wIufqdWDsDmm1OxvIHb3wfYJ31juET65p825kKbr%2FrHdIqZ2FMX1WsDvbDCq8qSp%2Fzrqs%2BZEbX4MrRhpVXQtVf6v3JlkJ24kFcAE1muFXbBQaDrhHoDVrUQ4C%2BEbEV2N1wzg6AU8G5McEzzckVeNtofgcd1NouMkjKrZp6Oo4tOdU4Fl%2FvhVncT%2F%2FjUkRozRnZXEYpoLvCRu7&X-Amz-Signature=c595f31c2009c98cf603e5a4aa49a9fdea0e537028e04ef8a7bdc635cc8bce05&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662UBVYRVA%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034208Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAdVpD%2FGY5nv7vlSOKSmOt8eOseixPWOAwGeqryUjWIkAiEA4kFC0NXKEHouoQhJFHuNiQG8vNJw2SNS6Lxtl3kqdCwqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMj5PpYY7PTAbEw0CyrcA4fp6cVV4854OL%2FJypScJ88lXPdokLoJDe8O6DBXsdwo%2BQS2EbE%2FORWDpf%2FIg6gcUp6lZzehRPtEYiC9dolOgmQYv%2BS9tw79cf4nRnxCObXmz5xUN6ImQ%2Byrannt8%2BzSFo7Ks6CWprXcw4L61EsR310YNh%2F7NQ6f6aKBDucWN5kZfdsYPl5Ux521oZlpusMhKZwnvslZfc17UjjDkHZMhbA%2FurQG%2FGfg9hj2snj%2F0MOU1RcCyFPuFryf92YB2ao5GNwAem%2FjXhyELAEqJrdJ00EXRsl%2FQXLP1w%2FBn5xi6Dwn11dIkaFSvjpVn%2FxrNoaaPOv9BAmvn9dYBENOIZtjJnbepMvYpdrq3%2BPyI6uyQ58tGDBAx5qZIRZWq79Vff9oiBGuMSaYQFK9J5GSRyzx4AkJOuanzSlGyCKSB1GewH%2BEBspbv8VWj1bjP6iqJk5vM9eu8o5yQG4Ohil%2BQFwHA4oXz%2Bkz21VbYNq%2F%2B3UuA%2BeS%2BbRgg3tyIVesvrHr2efeFiHiJ9%2FgDtEt4cfIoRB7xW%2FYhmstScjk0CiqE2xAhKdtiM1yFYcGqFTYu9M9sNBuekbg%2Ba4m44O5qRkoMDNof%2BYO67owO%2B8apC5RXbnRvGAnmIN%2FYeYBhentao2OMNvf9s4GOqUBx6TKRMX6jVhCDmzETzSIkmxvSTomTb09N6hIbFWub%2FvONtTgcufAWa8iru3N3MxVNuBZ1tdp7klwraSV6kD5wZM7E7xLwT1q9ELLHSqybYy0%2F1Z9AUKhxKkoc7TXRZTyAp9Ap9o3Msj6TTCj1PPnxa%2FD4TZ1tuEAW%2Bz5DFTdwhlm6W8IANgZL%2FmGQ7zfXKkJyyGM8c1t0BpenAip2yAfWlPxs0SY&X-Amz-Signature=a696273f04984bc08f6e80027f60fa8d58e2f8340c08c9261a6c2f5520997325&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YAV7IKQ%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034146Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDv0N3YfhCjt%2BAHv0py%2BpZyWkNA5r5CEoqXlPpHtutuPgIgd4atVO27qLn8JmQubhLClqrNM3yTV0iH0%2Bm%2FV2m5keIqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKMWH2urp117%2BY96aircA9nzw368LEyCUngg0SDBoXphpJDpL%2F25ZHfkXbb8zZNY0vG%2FGuiLQrvA32p1BYy5j38tcg90vKcfb9Kry69fg%2BrZ7qMDr6VqlDkKn09z5QHAyV072EKDVsidjQHqy%2BgN07SN2ZTQS5eX39zNWyvdyK2IpztRAL8wK3SeM8uWCwSGGuSJwyw8d4pZKX4XSOqfNxtaSGHfGLIhs5zIXS1NDrlF%2Ba2uWL1Gdm4HAeeCrjtDb7bE%2FS2s%2FHkdd7p7wefXliBFiXSrL%2FZ1xX4ejHZsYXeFoIdYaWb2kU9zAsGdyL7B7Sl0263Rcwc%2FG1MgoRIEk8vMOwmqMc%2BzXqdglU5O3mml6%2Fny5fXqdn%2BrkZCnjuhnNQMoWLwEjE5SZrmYhrlrf1QDsuCRj%2FkdStDB34Meb7BuhusCz%2FvnfG2xqMHbuiVuCrP2ldDDrjazAREdzLfSfqWnOthgl9jZgJ72nIXag6FXBY1%2FqKQ0SzMIkKkEyd68LAmfIB6qnYIn9EVsIxF5JKafScK1fcxmVenBw7r1xgyYZ1xKtOm2ZhvRkgZWytgvsId9l2RMPQVorNIF%2F%2Bxm1vzgLgpanbfbNKMBfqchfch7hlLG2wXM1ZaW4RXX%2FjenSXncxRggI1e3gd6FMOLe9s4GOqUBm%2FaH7StFLvDTR26wIufqdWDsDmm1OxvIHb3wfYJ31juET65p825kKbr%2FrHdIqZ2FMX1WsDvbDCq8qSp%2Fzrqs%2BZEbX4MrRhpVXQtVf6v3JlkJ24kFcAE1muFXbBQaDrhHoDVrUQ4C%2BEbEV2N1wzg6AU8G5McEzzckVeNtofgcd1NouMkjKrZp6Oo4tOdU4Fl%2FvhVncT%2F%2FjUkRozRnZXEYpoLvCRu7&X-Amz-Signature=3543db22ac94fb75281522a4f83a7070d7d24e5a066baa6a6e8efb2b8471ac60&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z2LSJFYN%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034209Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIF2b28h4BEcAkMxNzF62tXxewzHMLSDUNsdZO1MbtPW9AiEA1X079Zo9zUDMY%2FY0%2FY7FuW5PuoZNe5yGPLCiBgmuER0qiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPsIYrWK1Asf9rfrJSrcA0hsnXq1%2BVcG7yDT4Z3gcrf%2FLPs%2B82TuLTxCcrWwZ9zXGa2q6H7xXg3X4Ff9anf%2F7iBpEf80%2FDsss4X0f7W%2FsX2G3JOiQmPndxmTIMbVULJ%2FCVwn82Byb7yQZV5u6vqbAU%2FebwOXdEWldgQwKFGDY1ixkUMJsU8KllKsboS%2FhFr2J0qWh9aPR7q2TUxqsiE8G2D6ZPVf76SKDIDtIsh%2BdxZv3ojwsh%2FDEie%2BG4gDgC0ox0nTcZcaVjxYzemPS4x8r0TQrr8ZrGUOmnsLZ5a4C%2FXmij4ed9USKBGYoNFAtOCulbUxHwNbcSxxfdhjOYTLvEtNO02LLghBQAzX5dzkXD5U2BtkfLG%2FR23emPRUbLbzJu5Z7Z2oKfKnOYxozlX3hgDLi5OS8KbQV26iEDIUDppwHicSw7LACmefDGnlK9JnWdQJB4eyNDgj08FmRlrCzjH3SENF1ruPGNru9LcVPAqe%2FaeKwyazQreLoUhFCDKp%2BK5fT0YAPnojxOv%2FLBJ2E4UHCHmZ60yJlFiQKKeNWnLuTYakqRe67WDDBQNH7tHP32dQs4PDxkoesesDxRa5AFct%2BzVNOMsEmxqo7PfNNFqBxf5QihR7QyucgCQRe%2BXa638NWWg6QPaEsjD4MNjf9s4GOqUByzg3wXpeqqVw30%2BVla0Kh%2FLsel8uZ4yDvMSgz9astF8JQixk%2Bb%2BEhlGHN2LmVyzhAcRuggKiqAlw%2B7GfjUUqkCsAoQHpEO7ZeGjTrbisz1adU6h6p%2FXn1RomdqLOanbefOaBa3AYJetCf3T3Lg55SeyoZdgMjCtYhs9WzRGaaLRsMeTu5CGH1WBgVyTxyP0r0%2Fnur6xzx82TCtnWWveqsUYKm4uA&X-Amz-Signature=076045e9c537d3a2e01c5d6d37ad4589f5a3e5d5c86133b409cf201b80bb9b39&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WTXMHJGN%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034210Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDXSX3cA3Yreww%2F3v4RFoMyo968%2BEtbHqULDBDEel%2B3ZAiAlS%2FhC4t9xoG5MVlV2UmAI79Rk%2BRUeIbFPZC4bd8lGvSqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMUVxhaT45Qnxk%2FjdnKtwDvWLmKD4GPrHWUpPyISdMcz1Qd56A3YRBfolmhNniupx05EhoCGgu2sa1%2B8lC2cXH9kuFydWGHViNGA9oeICsmfa37AC6Wl8VXq6pIPkWwXDztVHISiRagKNI1Niulx%2FStCyCoglsv%2BNcPs2Y9PEc%2F9FI9ZDvg7zOdj0o57x8hbeHSni0gvnoQzKmxIUjBp3IHZNUmETvr2MmtAAoXg05qKVZTcJg2%2FTeF6o1TVyd8rQGrLselnOEfuakR4i7ORFEGNwDPrX5E1zl6EuxNdIIYSv83jTaVKOpw6qt95B4YnJrCW6Qxjg5Z2YZWFRG3f2anf776nlge4V8VY6ZvayzpItZa8AarMBzuBEIwOUzAjmxCFB5SiIMVJn6g5hbol8HCi3KS4YY3M%2FTUlZJffJol66%2FlZX8m7YeOQDm8IST15hsLg0ZA%2BVgbvTDWVXL5iJebgE0ZVGUSATn9Q%2F%2FrDwLwI4l9yLIZyiudB0buaGvjISCwbGe1UIWpFnq7Zz149NiZDb81ERQTHaELSEngemaXzLkRxUZvLcfdCoqUWi6LPIIVgqXK995Lm78cmIs16eiokuKgYQrAFRSAWErWA4dikKoJenUBp2Wono8Qn0SQZb%2FcLQm%2FAkuhIcJTMUwpuD2zgY6pgH%2Fdu6IoZ93557QZWww5KjrdNtu73I0ROhjkGl%2Fboly12tOvT1IqLszeM%2BAhqJs5OPkTcNfUaRkfKt63%2FuZtsL%2Ba54LezEzvcLlvoCdU%2FWYbzlC%2BZpKjq2G4veOMldX2zzyTsR7WjERE9%2FzpMlpyLI29ptqjxW1mYYteCcXa0KCGuCj%2F0wBiPONcqSHr2kflPSbghHmWqUQ2wKb3ExJ%2FrMEKEt8%2BLKG&X-Amz-Signature=e106b0f8f285e4d1e49550fd89e97522608fe02c16bf5ae4b4d7e1714ed1251b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z4LTOW45%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034211Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC6M8MxVaNkIv4wEPouu7n79waWyXDs7R8l8OXAhuygDgIhAJSmy7Q%2FGjVCKcZG5dXpjiJbJDMDbXDeOqzj5bNXMqnxKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzNBxJuxGPPk0LZeQEq3AMnqZjSxybvuVl6dFeNI%2BTk7I0RPXLABWA%2BzrTSeijEWep3qNYbbKhfqh9W22WS8TmZh7qyZhjMgAh6swwrNg7wx5ePyvvOUPF%2BQD6Z9CMVIPTCA%2FgWE1IA6Rhesb8Y1liiLQUZzmDVyXgrW163%2F47hwuGvM4wfuuGnsNJvpv4hsAwVK0ntkfeiM7nBEtksc0wHbNnKVsWeTd9WMdstj6A%2BLlyE%2BIfK%2BGhu62Bod%2FN5ijTX08pFFvTvndKz77%2FEhPFJWqE1XsvMx0wXJMRGIlFfgjaG1uBWy8C9G3TspUJejz5qpZfTSl5Z%2B9AwtLcQJS1tlvjKEpryVc6VpT528ELkrKp5KwseGTsX%2Fr%2F%2FEKM%2F0J72QV93e90F3y8hWYuQfE%2BE2xiqHPsxJS3sc1MbL5rKIb83SSKh0nGGvNnTRM5IzDMvtafk0FZuPRpd8uY%2FXLYzdUah3ZLMDIDLa1fe8aFEJs3S65bycb0nxM7Px%2Fmb0dH4sevC38sPxqdEzrPZ1OmQIRmjwksHGAMiET6mKSi5IHs1YCsy8WmCfpltlja6TIxZlqUZw%2BnmLAhQ0J3epVUctEXGRo4Y%2FP%2FvbtCTbt7YcrNYEDgoOdoqxSxZHq8b7D9htnD24rP3%2B9fo7TDx3vbOBjqkATWbQiw%2FVJcyBZUbLshdoOqtr0AxO7DDAYtE24ub0kBiPF97oZY30fQArCWxUp41%2Fw%2FDGtqZHYjFfhp170SDFkMxnzJ04Vu0rUduBK5NpowXce%2BrwEhNS2HBAGlFJZM7WihGSbUyR12bnpusFk9SvNqqCtfv6e6F9jsotpc167jvg%2B3mShsi521dVWhd4qP6HYxWRPXhwWAtta88n8d1u3Ii%2FIvV&X-Amz-Signature=d2d0175f4c4fa1f1839d125a15949d2d82001a2dafa793f9d1970354569b105e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJLEHQX2%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034211Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIC6JoL2ziWh4VA9G79agxRpYiX%2Btc0dtfajYlBBhAiTOAiABaC5gCkTjVqiYbdK4lbULJwHw22K8tebTm2WhAeEXTyqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM3x%2B79WRYI%2FX04yyyKtwDTFI2yej%2FNriklchpuAcEHmDRQUyR54GEWJjARmQDhjbcXolwVe70%2FZkiOHjctNZfRc0q9bvav781gNlRIVaxLF4dWoLbyKfsBZidsDboKqhgIrZcC0aO49MFfvmIJWXNIIJKzFhtyWCYSRjJ7E3ABlSQsVjcmen1nBkxIwxCZ2Fd4KIG4vdnipQSh40DCxcr1Cxg%2FvB0hb6puKfAqn3Aqw9nyIWK6P4l8iGLKZyou3BTXjOFeZb3akp%2FWftnjO64UYHobBn4swaWJUEO4yoEl%2FP8Tn4BC57EQqhfZFmurteUjENPpt54yhmRUhnLm980zVFsaR%2FbZFCvON%2BrcbAc8dJKP2DO1RTClNtFUlmFoL2Fbbx9rruUoOplM0HAgzhTq4Mp3CZIYCYmh3j9ycRIfmvr1T9nWwT1403l%2BDmsHSZQZ9LXE%2BuxaGP4W1WobB5huFYTc5kruE%2B2pEiAEwFR%2B1oPe1cPLFCC9UtL%2FIyZY%2FNM6%2BMF9DvOsPGVVeyvuhBL5Lql0IcU%2FMHEKWMNi0%2BQjxZNZ5TQpyAId6CXk%2BNRkGy%2Bt5LzHtE%2FKah4vZmVucveoKMLd77IUkCfdUU4Yi1TkKD8pZqH5xV1WnY%2BZNP9idfATeKCauUenOFFIlMwud72zgY6pgE6%2FHBhzsggGx0gFrUsQBPKVa8xj3EYkq3TN3Oq6CNnpclXamNTHL%2B6hpr%2FHg2AK9Eq0b5hIyoPNyOV44FPb9nptTIFUp2HP%2FLJiDfTld94Poxmanmw%2BFDYRxNDDI1ORiG%2Bns0iTALhvhK27MjO3yppEsWiI9tD%2Betk%2FErw8fnXCjOUYNl2wYcaQxw2IgDYk6DI6jCEMjPg8gcFGoxHaX%2FQJWE5ivV%2B&X-Amz-Signature=70e33c22b7084dad596640a2627ff2d725587fc6a8543326f001680d7da3a78c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YAV7IKQ%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034146Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDv0N3YfhCjt%2BAHv0py%2BpZyWkNA5r5CEoqXlPpHtutuPgIgd4atVO27qLn8JmQubhLClqrNM3yTV0iH0%2Bm%2FV2m5keIqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKMWH2urp117%2BY96aircA9nzw368LEyCUngg0SDBoXphpJDpL%2F25ZHfkXbb8zZNY0vG%2FGuiLQrvA32p1BYy5j38tcg90vKcfb9Kry69fg%2BrZ7qMDr6VqlDkKn09z5QHAyV072EKDVsidjQHqy%2BgN07SN2ZTQS5eX39zNWyvdyK2IpztRAL8wK3SeM8uWCwSGGuSJwyw8d4pZKX4XSOqfNxtaSGHfGLIhs5zIXS1NDrlF%2Ba2uWL1Gdm4HAeeCrjtDb7bE%2FS2s%2FHkdd7p7wefXliBFiXSrL%2FZ1xX4ejHZsYXeFoIdYaWb2kU9zAsGdyL7B7Sl0263Rcwc%2FG1MgoRIEk8vMOwmqMc%2BzXqdglU5O3mml6%2Fny5fXqdn%2BrkZCnjuhnNQMoWLwEjE5SZrmYhrlrf1QDsuCRj%2FkdStDB34Meb7BuhusCz%2FvnfG2xqMHbuiVuCrP2ldDDrjazAREdzLfSfqWnOthgl9jZgJ72nIXag6FXBY1%2FqKQ0SzMIkKkEyd68LAmfIB6qnYIn9EVsIxF5JKafScK1fcxmVenBw7r1xgyYZ1xKtOm2ZhvRkgZWytgvsId9l2RMPQVorNIF%2F%2Bxm1vzgLgpanbfbNKMBfqchfch7hlLG2wXM1ZaW4RXX%2FjenSXncxRggI1e3gd6FMOLe9s4GOqUBm%2FaH7StFLvDTR26wIufqdWDsDmm1OxvIHb3wfYJ31juET65p825kKbr%2FrHdIqZ2FMX1WsDvbDCq8qSp%2Fzrqs%2BZEbX4MrRhpVXQtVf6v3JlkJ24kFcAE1muFXbBQaDrhHoDVrUQ4C%2BEbEV2N1wzg6AU8G5McEzzckVeNtofgcd1NouMkjKrZp6Oo4tOdU4Fl%2FvhVncT%2F%2FjUkRozRnZXEYpoLvCRu7&X-Amz-Signature=989b0995b19aeeaea55539115814abb1a7693d5360b531a2d7b66f5d454892a3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YAV7IKQ%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T034146Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDv0N3YfhCjt%2BAHv0py%2BpZyWkNA5r5CEoqXlPpHtutuPgIgd4atVO27qLn8JmQubhLClqrNM3yTV0iH0%2Bm%2FV2m5keIqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKMWH2urp117%2BY96aircA9nzw368LEyCUngg0SDBoXphpJDpL%2F25ZHfkXbb8zZNY0vG%2FGuiLQrvA32p1BYy5j38tcg90vKcfb9Kry69fg%2BrZ7qMDr6VqlDkKn09z5QHAyV072EKDVsidjQHqy%2BgN07SN2ZTQS5eX39zNWyvdyK2IpztRAL8wK3SeM8uWCwSGGuSJwyw8d4pZKX4XSOqfNxtaSGHfGLIhs5zIXS1NDrlF%2Ba2uWL1Gdm4HAeeCrjtDb7bE%2FS2s%2FHkdd7p7wefXliBFiXSrL%2FZ1xX4ejHZsYXeFoIdYaWb2kU9zAsGdyL7B7Sl0263Rcwc%2FG1MgoRIEk8vMOwmqMc%2BzXqdglU5O3mml6%2Fny5fXqdn%2BrkZCnjuhnNQMoWLwEjE5SZrmYhrlrf1QDsuCRj%2FkdStDB34Meb7BuhusCz%2FvnfG2xqMHbuiVuCrP2ldDDrjazAREdzLfSfqWnOthgl9jZgJ72nIXag6FXBY1%2FqKQ0SzMIkKkEyd68LAmfIB6qnYIn9EVsIxF5JKafScK1fcxmVenBw7r1xgyYZ1xKtOm2ZhvRkgZWytgvsId9l2RMPQVorNIF%2F%2Bxm1vzgLgpanbfbNKMBfqchfch7hlLG2wXM1ZaW4RXX%2FjenSXncxRggI1e3gd6FMOLe9s4GOqUBm%2FaH7StFLvDTR26wIufqdWDsDmm1OxvIHb3wfYJ31juET65p825kKbr%2FrHdIqZ2FMX1WsDvbDCq8qSp%2Fzrqs%2BZEbX4MrRhpVXQtVf6v3JlkJ24kFcAE1muFXbBQaDrhHoDVrUQ4C%2BEbEV2N1wzg6AU8G5McEzzckVeNtofgcd1NouMkjKrZp6Oo4tOdU4Fl%2FvhVncT%2F%2FjUkRozRnZXEYpoLvCRu7&X-Amz-Signature=458b36be98b5b8ed379889f9a99a54db302d22f0cdf7caf62fee7d1e5304d8bb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

