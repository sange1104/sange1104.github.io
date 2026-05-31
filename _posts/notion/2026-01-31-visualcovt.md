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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664DPWC4H3%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045135Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIBqw9hBD%2FZGKrzD0aY7RbIFftq%2FvqchlFRmexoeOvXmlAiEAzkY%2F0qsjhPzcU0MITuxy2BtOo2o7JMkr9ZG8D1%2FyD9cqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFVpsGF%2BS%2F6BIEzp9SrcA51w5SixKPISYNmZ3lp7%2FExfoy5NvVpkF3Q7KMrpzC7ksllDH%2F7geGd18uTDUhGx%2BLegVPJEqF09YBCKEH%2FKBGMjnntWyZ82rCVUuWeoCZwjnjrRqpc3J2lAXjZ3o92C4njk9xfWz2lU3fp1zFr9NuQC2KmPolgyxgXI6y2ZS7J4xfUrPu4Ac4VFsJVBgLCNCWFbpymoeHuwqOxQ84e75p4c4%2Fg7scsp9zCSRA99JpBPXO72UO%2FWgAagy0fbxA%2BipleLwcNouEhaFzYUTRIJhKygjFglL%2BDagyeJ0kit6uClog6PmDUDhnLKYAx7QB3OaH%2FioXanmC6YG9jxOpP3iRehyZJoceakORLePcxiDPQUfk%2B5Fe2mp7jxNEisEox0tOhVKBKrrrG7cdoQNnjqNrHZ%2BWYhors0JaX3LUp70i%2Bo2UUgycLJxSV02QekNZ8QKybomCFl1MljlZY4296ViJzXOLKFH6jILGeCaronnQRfvuRtPyd4VJyiCifVDUiDXi6FhYG9KDh4ouMnp0HGb6Q4%2FhT%2Bh%2F69D8Z2qhMn5kXp%2FxJhDCg8%2BLrQQ0HrAoNFl%2F7s35P4ykxrjfRETIeFsGjXm4cvXBI8nT9pjNc4pepSMDWKy%2FlKGVQJRElXMKbX7tAGOqUBdtzCAqQBHXx1uEUDm%2Fh0QAm%2FrA2HaQ%2F8VLt8oq16GbCC03AsyfIbBsA8RcYaSO0%2BnFacH5EseFdclpcDGyd97Q7keTba6JVzWZ65WsA7pFWn%2BpTDz8PRNV6kjVoQ18bHEmcAVFx8Q4GFGdiwsDuS7B5wl2mzZz2fpSf7AMy2xI4wl9ae%2FTC9%2FMdCZdEOiw%2BK8LbvluP0MIHDIbTAV7d9MID6Bkpo&X-Amz-Signature=eb86ccf60f3c0e42fab949a1240decbf0d28e4f73fc150ec77ad422b49eb9d10&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664DPWC4H3%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045135Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIBqw9hBD%2FZGKrzD0aY7RbIFftq%2FvqchlFRmexoeOvXmlAiEAzkY%2F0qsjhPzcU0MITuxy2BtOo2o7JMkr9ZG8D1%2FyD9cqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFVpsGF%2BS%2F6BIEzp9SrcA51w5SixKPISYNmZ3lp7%2FExfoy5NvVpkF3Q7KMrpzC7ksllDH%2F7geGd18uTDUhGx%2BLegVPJEqF09YBCKEH%2FKBGMjnntWyZ82rCVUuWeoCZwjnjrRqpc3J2lAXjZ3o92C4njk9xfWz2lU3fp1zFr9NuQC2KmPolgyxgXI6y2ZS7J4xfUrPu4Ac4VFsJVBgLCNCWFbpymoeHuwqOxQ84e75p4c4%2Fg7scsp9zCSRA99JpBPXO72UO%2FWgAagy0fbxA%2BipleLwcNouEhaFzYUTRIJhKygjFglL%2BDagyeJ0kit6uClog6PmDUDhnLKYAx7QB3OaH%2FioXanmC6YG9jxOpP3iRehyZJoceakORLePcxiDPQUfk%2B5Fe2mp7jxNEisEox0tOhVKBKrrrG7cdoQNnjqNrHZ%2BWYhors0JaX3LUp70i%2Bo2UUgycLJxSV02QekNZ8QKybomCFl1MljlZY4296ViJzXOLKFH6jILGeCaronnQRfvuRtPyd4VJyiCifVDUiDXi6FhYG9KDh4ouMnp0HGb6Q4%2FhT%2Bh%2F69D8Z2qhMn5kXp%2FxJhDCg8%2BLrQQ0HrAoNFl%2F7s35P4ykxrjfRETIeFsGjXm4cvXBI8nT9pjNc4pepSMDWKy%2FlKGVQJRElXMKbX7tAGOqUBdtzCAqQBHXx1uEUDm%2Fh0QAm%2FrA2HaQ%2F8VLt8oq16GbCC03AsyfIbBsA8RcYaSO0%2BnFacH5EseFdclpcDGyd97Q7keTba6JVzWZ65WsA7pFWn%2BpTDz8PRNV6kjVoQ18bHEmcAVFx8Q4GFGdiwsDuS7B5wl2mzZz2fpSf7AMy2xI4wl9ae%2FTC9%2FMdCZdEOiw%2BK8LbvluP0MIHDIbTAV7d9MID6Bkpo&X-Amz-Signature=5ac44f5b3a91f13a1544312d930f4fcc66e063e13608234d86ff78a1aab52b93&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664DPWC4H3%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045135Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIBqw9hBD%2FZGKrzD0aY7RbIFftq%2FvqchlFRmexoeOvXmlAiEAzkY%2F0qsjhPzcU0MITuxy2BtOo2o7JMkr9ZG8D1%2FyD9cqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFVpsGF%2BS%2F6BIEzp9SrcA51w5SixKPISYNmZ3lp7%2FExfoy5NvVpkF3Q7KMrpzC7ksllDH%2F7geGd18uTDUhGx%2BLegVPJEqF09YBCKEH%2FKBGMjnntWyZ82rCVUuWeoCZwjnjrRqpc3J2lAXjZ3o92C4njk9xfWz2lU3fp1zFr9NuQC2KmPolgyxgXI6y2ZS7J4xfUrPu4Ac4VFsJVBgLCNCWFbpymoeHuwqOxQ84e75p4c4%2Fg7scsp9zCSRA99JpBPXO72UO%2FWgAagy0fbxA%2BipleLwcNouEhaFzYUTRIJhKygjFglL%2BDagyeJ0kit6uClog6PmDUDhnLKYAx7QB3OaH%2FioXanmC6YG9jxOpP3iRehyZJoceakORLePcxiDPQUfk%2B5Fe2mp7jxNEisEox0tOhVKBKrrrG7cdoQNnjqNrHZ%2BWYhors0JaX3LUp70i%2Bo2UUgycLJxSV02QekNZ8QKybomCFl1MljlZY4296ViJzXOLKFH6jILGeCaronnQRfvuRtPyd4VJyiCifVDUiDXi6FhYG9KDh4ouMnp0HGb6Q4%2FhT%2Bh%2F69D8Z2qhMn5kXp%2FxJhDCg8%2BLrQQ0HrAoNFl%2F7s35P4ykxrjfRETIeFsGjXm4cvXBI8nT9pjNc4pepSMDWKy%2FlKGVQJRElXMKbX7tAGOqUBdtzCAqQBHXx1uEUDm%2Fh0QAm%2FrA2HaQ%2F8VLt8oq16GbCC03AsyfIbBsA8RcYaSO0%2BnFacH5EseFdclpcDGyd97Q7keTba6JVzWZ65WsA7pFWn%2BpTDz8PRNV6kjVoQ18bHEmcAVFx8Q4GFGdiwsDuS7B5wl2mzZz2fpSf7AMy2xI4wl9ae%2FTC9%2FMdCZdEOiw%2BK8LbvluP0MIHDIbTAV7d9MID6Bkpo&X-Amz-Signature=f270426d8ffd5abdd99e66776e140b221ccaa4ed94bff816b0773a77dbbe95c0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664DPWC4H3%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045135Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIBqw9hBD%2FZGKrzD0aY7RbIFftq%2FvqchlFRmexoeOvXmlAiEAzkY%2F0qsjhPzcU0MITuxy2BtOo2o7JMkr9ZG8D1%2FyD9cqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFVpsGF%2BS%2F6BIEzp9SrcA51w5SixKPISYNmZ3lp7%2FExfoy5NvVpkF3Q7KMrpzC7ksllDH%2F7geGd18uTDUhGx%2BLegVPJEqF09YBCKEH%2FKBGMjnntWyZ82rCVUuWeoCZwjnjrRqpc3J2lAXjZ3o92C4njk9xfWz2lU3fp1zFr9NuQC2KmPolgyxgXI6y2ZS7J4xfUrPu4Ac4VFsJVBgLCNCWFbpymoeHuwqOxQ84e75p4c4%2Fg7scsp9zCSRA99JpBPXO72UO%2FWgAagy0fbxA%2BipleLwcNouEhaFzYUTRIJhKygjFglL%2BDagyeJ0kit6uClog6PmDUDhnLKYAx7QB3OaH%2FioXanmC6YG9jxOpP3iRehyZJoceakORLePcxiDPQUfk%2B5Fe2mp7jxNEisEox0tOhVKBKrrrG7cdoQNnjqNrHZ%2BWYhors0JaX3LUp70i%2Bo2UUgycLJxSV02QekNZ8QKybomCFl1MljlZY4296ViJzXOLKFH6jILGeCaronnQRfvuRtPyd4VJyiCifVDUiDXi6FhYG9KDh4ouMnp0HGb6Q4%2FhT%2Bh%2F69D8Z2qhMn5kXp%2FxJhDCg8%2BLrQQ0HrAoNFl%2F7s35P4ykxrjfRETIeFsGjXm4cvXBI8nT9pjNc4pepSMDWKy%2FlKGVQJRElXMKbX7tAGOqUBdtzCAqQBHXx1uEUDm%2Fh0QAm%2FrA2HaQ%2F8VLt8oq16GbCC03AsyfIbBsA8RcYaSO0%2BnFacH5EseFdclpcDGyd97Q7keTba6JVzWZ65WsA7pFWn%2BpTDz8PRNV6kjVoQ18bHEmcAVFx8Q4GFGdiwsDuS7B5wl2mzZz2fpSf7AMy2xI4wl9ae%2FTC9%2FMdCZdEOiw%2BK8LbvluP0MIHDIbTAV7d9MID6Bkpo&X-Amz-Signature=d550f65b389ea6bae1fbf4a09c927fa828b1ac198f843217bd94c01d8af6580f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QQYXXMKK%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQD2gA3VSON8ahcdS6ooo7MxoLvWWIPpekMhvCir8LOVpAIhALUUhX9JEAd07Boiu4oerxxzVaWi03lCyI6dx57jnUWAKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxxz%2Foliax90hBBdusq3AMqmx7oxJVH9Ro9ZqI5OwiXS8TA1ZTlmL6kRAerJNB2AkhEs%2BIC84k2hwSgik7vcc2bDv%2FWAA134uaqlqoR1pw3Gxizdl%2FkW002rhfrAhgUTC381JpU3kpeKIJGfmbx1JJGzdZECcngXmBXwVWp1gx%2FqwsjYZFm8pW3r%2FFsKYfHHtBFhL2IYLSf7n9YhjreWTer8vpKEGRlQpBW%2BNm321Ot%2FHPfUQVOeCQLgQvAL5i%2B5%2F09GjjWooJ0vaCcWH1fGz56TyqQi%2FHJddVoQAvZaDnvTf%2BrpXNfXAA5PLh3o8fhVkijZsnypME5la32WQFNEGcuiwDeyNO6FLZtc4eSueNCo0G1Bk%2FMVwXdWUaP19kj4e2WeI30FYh%2BBbZ5MLrN0Pf3gvieYlIaHcwRXwTY1Ic0bWn2h2YM4TLNNuDgYdVQy2Q8J%2BqPB2QZFqRUcVxf6e07h30epE1QUNBx8djkK0tNrGOdztA9hK8N0nokUCGchHLPRs24HbZZ4vnqgyOqvbBxtnkQPFpvjJmg%2BsMPFeWbwBSKLZo2q%2FARllTR032sS%2FHAuMRB5uNmKxAoiuEKWXCyKVkeTa4%2BDLSTq72yjDMkvE%2FDH0yP8ZvXHl8GebQwnfxqLDzUUNWNCaue3DDI1u7QBjqkAfcodV0GTCcj4%2BUXa6KrT77O%2B1Cd3uyjgmJ2zruC4QvPnM2GBk79%2B70irRUt6KAoHwKn6HcMGlB9M9TgZ5zP3rP%2F0ltDBs50V05ETpYt8Weg394hnVUwIl2Gt6BZRiFfGkc%2B7VKk3KoWcr1quXGIlAUCU3GlySCnTomhD6xwiXb8QUnSrf93nAUKtPc7rJvD0p1s%2BpwY7bnCsggATNqCNRY%2FeEes&X-Amz-Signature=dd319e7af3097904f567edbdd755ed59cc6fa5b880de1719c8d1fcdbac1127c5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662B4K2QK3%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045147Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQCxcGmSDKKE4k7GNVhON3Nsqnoq0hu2RVl5Fc30i%2FXMlwIhAM48Tiy%2B95S4HoW437ln2t3sFZoC6nSgxLhc4cs8LB7bKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxa%2Brr%2Bf%2F7KUUHPx9Yq3AOcUe80wuk2INKhaR%2F1vRVwetcXaDuP2XJVVMiSrowlwCHQ%2BZwmf%2BrIseWnh9ISb1sn%2F7B5gBRTECtDYsQ7we1I7usKEdEj%2BD4lZ9A%2BHngixA6RVYuUnQUvHum2tn2lqrV11gTPSRr8TPLUSjeqYMldEbV27QmHgQXI8vur079WOCunhIi4At0BlLAwx6hCw3vfnmWbxSeHiUvH%2Fpe6aG0KV%2FL6yyjJjMHsXDpspYWxym923Ez%2BaSEoD4P%2FlrXScyZw9Hq1BeXFzoY5yNNcdz7baIRdNCj0g99vShQAXff%2FwrGj6zeFsG2M0ztySfeTdztqSVKUa7AfenGsxHHD5Cu1D2qbtHcWcNTYjcYm6VFmuMX49VxRAypQyD5w7MlV%2F%2Bxwhp%2B5CgXsOdpQ4G5WG59ZGZeyoQu4MYFTeCnu3noaIL9bj9c4VGOuzw4TD%2B9pBXx%2FWpnPJXeqspR57WStH%2BZR8L9Mydgz0O6uJjPbHyvHaaoM2AJdq%2Ff%2FmxmWkSPpX8ABcUiheOoqqvOovVfqJGjepoxs4yO6KV8lf%2FkKPzQ6hisN%2B1TrkURAOyaScBpNEY38XznU15aKw0xwJRU38smTkHmSO9FUWkTcuE5mezoCFVd8kUYqORJqLEXOODCz1e7QBjqkAeQoMJuMtxntRSkyS1H8tkCpOm9c4OpJjUjIZuqalnusHAlCvr0VfPbLfarJCY7%2FWdx5IkI0hTELBr%2FGEeItaifxaYFXTe3x1rUIlwLR9gd1oaQd338%2BehmmlUIljymROLpp90s%2BNCzjb4mx%2BD3HLZBxnrOXIznR8yMPBsZkE5owR%2BRvdYmz81HqfDcNFlgRuqkUJo6QoAids73xUFY2EdpS0u8k&X-Amz-Signature=4847a82e2b7496b1719abeda3d897224ecd5bcb3c143facd7d4a4c710773986e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667OQZEL2K%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045148Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIBSKOSV6N0l0MsrZm84N4nBGqEVVFOM6Sw9r2oBPno3vAiEA1TpZAnF99fMV8xn9cm3YRAGm4IScD0Qk8rgUsAPwLS0qiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNSPHCH4blJ8corzYSrcA0rgCXBvKR4ytuFrNADh1z9bd%2BT0RJIWZFkg2apZ1gTUrYecdZ9nIhlapCvDNXCsKar2lbzQWA3jJ2mvqldFyl0KF1fo4iDxpVwNZ2wwhiBAzEw8MOlO7%2BozKTGiUbrF36Ne1zOAzDkKizpYAcrYlUZNaUd6LXRVtzexbqhhYd6wPHDGVPKpreVLRkwCh5Hz26K9i0HrJXLYEFdAxlcIbnVTtqn4W5fc2CfAQI9hT3koS9WO4XZzAyz1EIgM5QM9mZni7YxiSc4kv0xouMXvlYrJkIZCw5%2FpiOjo%2BXzSzIskeVPEU0wWLhNw9LRCr%2BVpfbuM1LNdrPZB4aD%2B9eeiHHL966GnKSBiVTvxSTPvptukSgY3FgWoCNqLko6PffLeAFBtKSIu342SAvb%2FnELt4UJgHPWYDNYTnnTWgX1d1ph9o5vpW30L8oo9aIwpqoJK6qwjZVJaWheOIHDdFtfhWv9shAhZ%2B%2FepX8e416%2FQB9aM5jSf7sYR%2Bn%2BbgyAiiHYN6oiLd4Cu7mFGOj59SK7Il7Q7BRIidyu2U%2BrCcz1lDyA23Y3mPG7tQcdNOfdGTq2%2B6uy%2BRmBfMfBmKRZK5yyG56oPc7DFeP2FmDuJWx4ROj8pVUxVdMnc7R1RJR0xMJHX7tAGOqUBXJZ2pN9zgn7nYz%2B%2BdXVi5eJg0mwXfSoqehfgwzFhfbIVWBDRBDjWXBe3zUqRz%2BBA%2Bz718ckRbx6ZQVMDXbpqSpYMocVkRk%2BU2F1nEdZuMAy4Tq4HfHAa2TQHjyr%2F8ilBa2A1P0b7elgFQjyoQQtWkaOIGikQHW3CcOT9A3a3UPn1d4%2F6oWdcICV77dr5C%2Boz9%2F4ASXnkQ8dvarN1KVp84cV0KcnH&X-Amz-Signature=32c125ed7ee9ba02bd94cc33702fb6249d95052d2c51117af055bbec0180cf82&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VF42LPQR%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045149Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIQCBZAreu46sB2OTKAs7HL2pmqasrJfOQXkYrxJnySc%2BLAIgEwz3g1ORw5DPwbmeuA7ULUtgWH2IfVQaFiqA1so8HTcqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHjmTzBlRYoxsUTC8SrcA4sz5XnmiPaZYo0GlfqcyOXfdTKUEoWWiYkPl5veoSFQ2JHHXNwv0kES5EGIUHGw6X%2Br5Gwt4V1amANa89CSmFraxHGAkhxW7YKoQ%2Bb47qL0m5PJdBEQTliE0mQAvpfKWPE%2BuNg7MKWFuAbbmndpRvS18u14ycMumsaCo5dWxQKQ9gg5S4Nn60vVqoDOA7PRpSqlDZa8kwYguwc1xWTAoPpcAgUFjibTf1xgaiqVtZax4%2BaKC91nBiX1SWMQ71yaxcaEO4jnUZzlNZY76mZCP5vf3%2F9w969BBf8sr7UK291HSsN1EePGHPxnx%2Fp5C12k6OmzLyVqJmp5gvHpqBhN5Kyz69gmLQFH23s9SNdruplOo1Mf1iWapJe%2Fgn39exPA78RbuqHkw0N61tl61qhbhlLWJZVX%2BWEKgOVuQ28MeeaHy%2BffvQkWHw3Hvtk0KimbxMTXB4QBCIKLVnEHbCrYJcIVsrioMel8HsOimi%2BAy7IhDHQGsRGTq23rEYjy7eqLJjA4niiz9bPq6%2FDG021PErdzzpeuczYpzfV937yoJXtwIoFVBB1t2UJXXPC354LtC7n1gr5hPRe8rQItT9Z%2FeA94VUqFZzWC55Fgv0t708b%2F2uhb0EOenSkpMEeBMKvX7tAGOqUBdxRt8a6PA72dN0IfDZ2hOAZsIf2yScoYXtT4dWZLqREY%2BR%2FYGEhpVaBn1jLg6HfyQ9gUhvBXm5uR3XLS2kBp2jE%2BqH%2Ble9I9sUsvvFzeqzNXi%2BmdlNbXf2Cm0JFXu%2FNxx7dplSf0cF1gkAVzb3JLEDsW%2F3lwuat9bx8szPj0nK2190kUKTutUKzvo0aC6SEDkYTJ3yBWgDXo9HM4eSfhkFoMXOgP&X-Amz-Signature=ae83cd49965b9a3d382ce96271cb221bd61aeeada9a63a9ecac7f01fb880d823&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664DPWC4H3%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045135Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIBqw9hBD%2FZGKrzD0aY7RbIFftq%2FvqchlFRmexoeOvXmlAiEAzkY%2F0qsjhPzcU0MITuxy2BtOo2o7JMkr9ZG8D1%2FyD9cqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFVpsGF%2BS%2F6BIEzp9SrcA51w5SixKPISYNmZ3lp7%2FExfoy5NvVpkF3Q7KMrpzC7ksllDH%2F7geGd18uTDUhGx%2BLegVPJEqF09YBCKEH%2FKBGMjnntWyZ82rCVUuWeoCZwjnjrRqpc3J2lAXjZ3o92C4njk9xfWz2lU3fp1zFr9NuQC2KmPolgyxgXI6y2ZS7J4xfUrPu4Ac4VFsJVBgLCNCWFbpymoeHuwqOxQ84e75p4c4%2Fg7scsp9zCSRA99JpBPXO72UO%2FWgAagy0fbxA%2BipleLwcNouEhaFzYUTRIJhKygjFglL%2BDagyeJ0kit6uClog6PmDUDhnLKYAx7QB3OaH%2FioXanmC6YG9jxOpP3iRehyZJoceakORLePcxiDPQUfk%2B5Fe2mp7jxNEisEox0tOhVKBKrrrG7cdoQNnjqNrHZ%2BWYhors0JaX3LUp70i%2Bo2UUgycLJxSV02QekNZ8QKybomCFl1MljlZY4296ViJzXOLKFH6jILGeCaronnQRfvuRtPyd4VJyiCifVDUiDXi6FhYG9KDh4ouMnp0HGb6Q4%2FhT%2Bh%2F69D8Z2qhMn5kXp%2FxJhDCg8%2BLrQQ0HrAoNFl%2F7s35P4ykxrjfRETIeFsGjXm4cvXBI8nT9pjNc4pepSMDWKy%2FlKGVQJRElXMKbX7tAGOqUBdtzCAqQBHXx1uEUDm%2Fh0QAm%2FrA2HaQ%2F8VLt8oq16GbCC03AsyfIbBsA8RcYaSO0%2BnFacH5EseFdclpcDGyd97Q7keTba6JVzWZ65WsA7pFWn%2BpTDz8PRNV6kjVoQ18bHEmcAVFx8Q4GFGdiwsDuS7B5wl2mzZz2fpSf7AMy2xI4wl9ae%2FTC9%2FMdCZdEOiw%2BK8LbvluP0MIHDIbTAV7d9MID6Bkpo&X-Amz-Signature=5d2c816c97996fbc626be13f6174638eed3eac8db0d1c24ae22ab7b36b11a3e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664DPWC4H3%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045135Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIBqw9hBD%2FZGKrzD0aY7RbIFftq%2FvqchlFRmexoeOvXmlAiEAzkY%2F0qsjhPzcU0MITuxy2BtOo2o7JMkr9ZG8D1%2FyD9cqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFVpsGF%2BS%2F6BIEzp9SrcA51w5SixKPISYNmZ3lp7%2FExfoy5NvVpkF3Q7KMrpzC7ksllDH%2F7geGd18uTDUhGx%2BLegVPJEqF09YBCKEH%2FKBGMjnntWyZ82rCVUuWeoCZwjnjrRqpc3J2lAXjZ3o92C4njk9xfWz2lU3fp1zFr9NuQC2KmPolgyxgXI6y2ZS7J4xfUrPu4Ac4VFsJVBgLCNCWFbpymoeHuwqOxQ84e75p4c4%2Fg7scsp9zCSRA99JpBPXO72UO%2FWgAagy0fbxA%2BipleLwcNouEhaFzYUTRIJhKygjFglL%2BDagyeJ0kit6uClog6PmDUDhnLKYAx7QB3OaH%2FioXanmC6YG9jxOpP3iRehyZJoceakORLePcxiDPQUfk%2B5Fe2mp7jxNEisEox0tOhVKBKrrrG7cdoQNnjqNrHZ%2BWYhors0JaX3LUp70i%2Bo2UUgycLJxSV02QekNZ8QKybomCFl1MljlZY4296ViJzXOLKFH6jILGeCaronnQRfvuRtPyd4VJyiCifVDUiDXi6FhYG9KDh4ouMnp0HGb6Q4%2FhT%2Bh%2F69D8Z2qhMn5kXp%2FxJhDCg8%2BLrQQ0HrAoNFl%2F7s35P4ykxrjfRETIeFsGjXm4cvXBI8nT9pjNc4pepSMDWKy%2FlKGVQJRElXMKbX7tAGOqUBdtzCAqQBHXx1uEUDm%2Fh0QAm%2FrA2HaQ%2F8VLt8oq16GbCC03AsyfIbBsA8RcYaSO0%2BnFacH5EseFdclpcDGyd97Q7keTba6JVzWZ65WsA7pFWn%2BpTDz8PRNV6kjVoQ18bHEmcAVFx8Q4GFGdiwsDuS7B5wl2mzZz2fpSf7AMy2xI4wl9ae%2FTC9%2FMdCZdEOiw%2BK8LbvluP0MIHDIbTAV7d9MID6Bkpo&X-Amz-Signature=2be62411bedb40d100aa9dd9533b95bd1d81ebccb34d6a1f6ec079a1d56a3d5c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4WCKWBL%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045152Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQCNGFVBr6l9c0lnsSrqEQnZWD1wP3QNJSG0PdjYYn7oQAIhANf2t8l6Cb4GfRt51x1O4fRhQfIR5yjwbfABC7PwSUyrKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzIdnp1ZeDXWnBnVagq3AMGGAOFEushgvekbubPdEDUVM4clIgJt9sxdCy30RoPF4nrckx%2FHIZkgGFb4HegzNdDbWM73wTSGMuH6v6jRGhK%2FU9L8lIXYS6erXkcb91t2OydkvSIBY3PSnDlqimNm%2FUpbeURismenuDY0iVb3tSfG%2FC9L6Bo4krIedtRfq2wPo7av6od5ZC17uFHVUh4l6sAG6%2BIZGCf3QBafsLaIcNc3mcVqfElxvK58UBMH0ZnIVdjNmaUHfaxxQjpc1gUlKIo4dBVsXdje71wXWDENi8hQ%2BbWHtlAA%2BgQqyq0KGfTLb2WLyVj4cSnMTKKQKT83oMTPsEADaOWaXv7LlOUSUJUVjVlejSgtAtgEKN3plKy2I7bxFxxYHu8Zhyk9d4zaEQV2wsVXsRGI3ptpp2AIAwdcMCTWgGQeoqD2vTS0tLXMcjy0zFvMl6QsqSkQRRfyTyS3nP8h1skf5ur5fS0CCJTVrEftevqrpBSM09vPLW2VsvNUuU2GSoQs7i7GfGEvAxh5HwBITTI89hdvhvBHfZvXRK1u2lHRjN%2Bxzib1fNJlOySAOxi%2B%2BgXd1P0qSIZ4JbosMj2JLHF8uPD2%2FRKfxlx8RCPXimDpyPvgUCqdUEuili%2BGIb8nY9dbGPZbzDx1e7QBjqkAT6uvGe3okGBaA2JGmHL7W0iUogrFYvUnI%2FXiSCTF37yCpSKHG9Wo7kWU3ZEP2SvoYt7hwLMY1FviskhjSsu4AZeBlhb5Cyq%2FmvvgM6kyI%2BLvccBqt9y8x%2BHOB7U18Kt1fuecxIWyw7Ny6Pj9oSc%2FZ32xvMYWeJldWKnaEY21NRN1M%2F4ZpGF%2F0GBltRg6lkI4ANS3Y2da5mOPeWy%2FmYugb%2FnKYdT&X-Amz-Signature=d102db71c618da50c2f50325daf838b647c60704ba00854040289d58eb18a1a1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664DPWC4H3%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045136Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIBqw9hBD%2FZGKrzD0aY7RbIFftq%2FvqchlFRmexoeOvXmlAiEAzkY%2F0qsjhPzcU0MITuxy2BtOo2o7JMkr9ZG8D1%2FyD9cqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFVpsGF%2BS%2F6BIEzp9SrcA51w5SixKPISYNmZ3lp7%2FExfoy5NvVpkF3Q7KMrpzC7ksllDH%2F7geGd18uTDUhGx%2BLegVPJEqF09YBCKEH%2FKBGMjnntWyZ82rCVUuWeoCZwjnjrRqpc3J2lAXjZ3o92C4njk9xfWz2lU3fp1zFr9NuQC2KmPolgyxgXI6y2ZS7J4xfUrPu4Ac4VFsJVBgLCNCWFbpymoeHuwqOxQ84e75p4c4%2Fg7scsp9zCSRA99JpBPXO72UO%2FWgAagy0fbxA%2BipleLwcNouEhaFzYUTRIJhKygjFglL%2BDagyeJ0kit6uClog6PmDUDhnLKYAx7QB3OaH%2FioXanmC6YG9jxOpP3iRehyZJoceakORLePcxiDPQUfk%2B5Fe2mp7jxNEisEox0tOhVKBKrrrG7cdoQNnjqNrHZ%2BWYhors0JaX3LUp70i%2Bo2UUgycLJxSV02QekNZ8QKybomCFl1MljlZY4296ViJzXOLKFH6jILGeCaronnQRfvuRtPyd4VJyiCifVDUiDXi6FhYG9KDh4ouMnp0HGb6Q4%2FhT%2Bh%2F69D8Z2qhMn5kXp%2FxJhDCg8%2BLrQQ0HrAoNFl%2F7s35P4ykxrjfRETIeFsGjXm4cvXBI8nT9pjNc4pepSMDWKy%2FlKGVQJRElXMKbX7tAGOqUBdtzCAqQBHXx1uEUDm%2Fh0QAm%2FrA2HaQ%2F8VLt8oq16GbCC03AsyfIbBsA8RcYaSO0%2BnFacH5EseFdclpcDGyd97Q7keTba6JVzWZ65WsA7pFWn%2BpTDz8PRNV6kjVoQ18bHEmcAVFx8Q4GFGdiwsDuS7B5wl2mzZz2fpSf7AMy2xI4wl9ae%2FTC9%2FMdCZdEOiw%2BK8LbvluP0MIHDIbTAV7d9MID6Bkpo&X-Amz-Signature=08c7835e54bbb452ad9d75617655aaa78d26c81ac916f704a3d16033306a46d1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q2JFLVNU%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045152Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQDA%2BqzMeAFBXDg94zsE928Je6YL3aoB5z1LMMBw5ilWxAIhAOUlzCTPc697qnX1wu%2BvzpLbE8%2FhhWPf5vZFq2tO4rbdKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzBLqBtUt2c6LlboCQq3APvU0WxF5hDAhe01qSstkeK0GPrzMTo7NdHJOHMZYAbjupySGpoOlLo2t9FwkGR39cuuqOLL0ewSuY4ENZtewCRjeEZnlxow9Y40KsDhvV8Ia7vBys86jsOuneNGZQTFwv3vTpXGDWtOzgPX%2BYzlkgHEyVTiZqhFgqP%2BoaMZVyf1hjN8rDLH9P801nDyxbf7lmP2lcRon%2FrjXOB42RFQkxPx78Ea608%2Bv7BXekHOeFVxejzaCMOInzcAGKdjp8ug4tGDD9pUEzjFFV7Yn4hFaLDF78ABltm%2FwFzR3S2FZB8CvFD3GFU2iEEsg15h8Q6fNdZjfG%2BfgLKiK3FUUuEAnZIZ7aqsV%2FAjaCmoD023DNnMn%2FD6jjSUKtQAyEB6A04aCFDijdwPqgArz1EpupXG1%2FYeBHhOojc4%2BsooNHInl0Ck2wT67ChYH0yASRRAMlZVG8NeVF32gH7iwCd99rBXpfwmYvcXXirn1EjcEgn7v5NUkGJ0BWUnZCCC9AOW3l%2FpJoIMA2i60FigoxIIVX%2B3QfOEXhupfKxIFEj3DdVGexWeV1WL8jkoYa8lqHIqHulHkzx%2BCoCk5akdQX%2B0BV3ylF1eyL6QrD1SYDjP2pNHI3xOtucCfNCP5PimygECTD11u7QBjqkAUqm%2FVNDUGAatUfZUzUq9Vocb1ke7nGbQ%2FPIaiQH3UG8F%2FeNrgcPtMsrLlRhNi2Vu7aFbguCGVCCM2LMOhNFhiYRZS6MjMLWGADLIK%2B7%2BrRrR5FD8l3koxLVI0UDT92xz7zuETRIReedMHW4gH2liRbJDSNfX%2Bn363OP2qAZSdTgw2njFM0jRufZ8sGLsLmLYgtAk6lOxezoYmF%2FpY0iRPJNQFai&X-Amz-Signature=e1f61825198d81199d1d00fa3fff83abf52e3196e2d73bea1c9a03ded10e3d7f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RPZRZVF3%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045153Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIAa%2FFKP7EqMsZGcRya4UMsSZlNuU8berytCvGTDKchlHAiEAvECPTi0w1br%2BCQn9uz%2FsrPEqQF58lMT%2Fma0NjimbK7gqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAfG3R4cWXkyRIGXOyrcA6cvzgjP5gBILmZ3YTVAVsCmdYARxA9GrNr0di6vEh5zg1tN%2BRxXccgHbbZ%2B00hx2Jp%2FILi22DTnpVIDauUIA6BKPMJ3Z1LpkCYbY7bJz8q21KrrRrBU28D8EGcS0grO4gLcnzi9pQZ4HKo5ttzr1%2F%2F0NwzSFL4PgVWVgGveocNQTh%2FC%2FaDuc6nzNFf2VfK6C%2FgKas%2ByjRUXKOJf78fpXDNuwhmN5PrEYGeuo9M1Mx93w1z7Y3WJe%2Fhn%2FqX%2FXfkPVWEprmbxZfTcYb5eNCRlgWuuhwQFUavVkwyjKaCz2jq%2BkeGkFtAxsU0Y6hiMw6WEIfiHopfdzoR1wmzv6XsP4IeAaPxRHR%2FCM2cJDjie9Eg46%2FFbKtFLO%2BivLbxmrmmVBgkrpm7Q6shSry0IJ%2BzxdOnnZY7wbqW05ZdtMSdayRCvlKW6FC6HXTtpRMMmpBJ8hNgNrEfFpb6yprhmK4IvopK088lBTgG8z7C9XTCIMoXSJdzHt0t%2B4oL5ob%2B%2BM4PqeG1b2vX69s8iZ5GRQMe5kAkCzQ9U8OO2rKeZ88sMF2DkPutAQg%2BQbQH2v2vfMBdEjClyb2PQHXTKnL5eukc5%2BuqEeDQ7lV6G3OeZgp%2ByBbt6tVOEjRGSyw8FAD27MPHV7tAGOqUBy9cgLQpkYG9DODGsb3HYNBuJZo%2BuCORibRKQyRXZrEXYWSyzxdULW6FaYpZdy3YL6GXBfHlZOMVSE9HwtRMR14x8ADZ5p5H9RBL3f4aUjmUQ6i%2Fftl8xgy45rYqU1aTAL1eDkMAC%2FKnaLmg0Fo%2Bg8%2BJx1KDBNSP6IbAsHggdu%2Bx2EkTACrEPpnQGW2quWzjKCeEzee%2BYeSkdyTNWafix80jdxBCN&X-Amz-Signature=a2a265c96f3ff2fd9cc6584314232a13cf35a957b099f65caddf7cf4b0829169&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SAOAP3WL%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045153Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJGMEQCIArCCFp4xafc7RIL2GGYn1xDmR%2Bf1Ftb5RD%2F5GlYAYnrAiAd77SPxBs%2F%2F3qeHx8nADJfrs3PORi462xQJBKblh5yzSqIBAjt%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMQWJ%2F8zUt3kOWCAb3KtwDm%2BsEmx1IjacvCS0J7NQ%2BDoveT9bTmmTSqwl2zNChWMyW6GKnQz8Pcm4QlOxiRX0IzAK2lg7T%2BS0Y6V%2Bgo4iFrsNxNgg4tzpPCnU781I%2F2iA6DFC5SFImK5spXgYun%2FFJ4Ms0HxgNaMI4BtcZaDolB1L%2FIjSs2bzWBesTUSjC8D%2F3S6SAV%2FGnIp14S4TLMhHEPfzDzjBHgYX%2FhOyggAxS1Twoky62BaA00JWtkyK72LBBKOFK0wv%2F6Am1fgvCvTsuac6OvSxjGRV7Uc49otmSr7MXxPDenb1v9UcEyu%2BwpOaRi3%2BBCs9SaGdY%2FHgn7dTHlRM6S1RmmNQAXL9Ob%2FfzVZU8voqVbNxNyPUU4NPYy7a23R7kmG%2BMyjFRO%2BQq9sJJZMSEfUK2yXOB8KUSa48enpBsk14lZpjZP8zv7XAjBexnAkZseFKC5IwE4WHSov3dcAeprpGk42CoQIcaaoqOvPqyflNOMH7Y6jkozU%2BRn1exo9ZW2ZRtlfwxvslMG9wx%2BvyOImH0m4jI40c7I9v3u5Gaag60JIR88iDWxxkTKF7pHhAAd9%2FkpgGweDiZHQ%2FniXi0dgduMAigrsa%2Bw7o2HU2I6gvyI6fmXPSuGxCqBIsDBxJFDEOUFnKkiRYwgtbu0AY6pgHtNX10rbLNTUdNw5v15dpJMM8fVk%2B3V%2FlEDPz%2FSiwJ0ZoZGcbu9s5dsNB2AEKfHn2JF37vLUFMabOjrN33JZxurK7EeeSDFSg0M9Xg93PXidQPmOovHunJMq1UlxtWUyxFNFTbzWyqfs6GWQNvGXzhdg5%2Bl7aklnomy2pWhBWjdibpaks%2BOe7hKI%2F4OKN%2FwMJDDRJOzoeSqwKCcgMh2VFt5ISphEuB&X-Amz-Signature=af81dadd9e7fe26ac67e28d18fcc8d4143ea92824f412d811825d59af54925f5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VJXF3SUR%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045153Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQDrn1A%2BU2u8ck%2FTM20MVdxvVWQF8aaIztb5ND2uIIIKIQIhAIhfEBINeofh7KQQd%2Bqqkf9M2QleQL99oC88jPlKlmQwKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzBHCk9cW0WIDCoXmIq3APONmMf1xMmwJipUvYTy9aEq515MHuDc0wV0NKsCvTAGjR4WaHQzMGcCYVibqdxMbpf15Ark3YLbuccXwSoT1fdesf0xbYwj62FGmq19jDCLEmylD3hVWUOJol%2FFRdonlgYGZjsTudgF2k3HwxGO%2BhRThOTkkHK2MmRwFkwzyr0O84kYKvm8tsYc6i8wJZCm2vG1SoaBN7yXE2U%2BMTAKBtP9TZOwiNlT2ZUtu2jV6zoy0XEY0CJUnhF6qgOqcMt1NF5TUBa3ucNDCF5c6lJx7XaDo5dFb%2BYz7GhIeUsmCKS%2FlPC7TUVkpc9rZI1vpWjezy58pOOJKGxSsiISzc59SWTU8IgM0EsaRNXw3yWElwdJwKQHT3s2PZ1lg4t2us6t2wvBJ1q1a5tjE0JsN3s5va86qxx8BMQczC2InVRsZidxVtlMX9aCbQZHMKMe5rAQGu42FMSxV5STjyxzyGwCHnaNp08k362%2FgylFM0lTkuAzm0uPf%2BuXefmGWh0v1sPGOy7%2FFALPURfFNjZu%2BimwzK7m%2F%2FLNxp2H%2FOlHv6cDtZClD5k6GiTUSoENyWXS%2B0au7fdh2xVwiSeuTG6dF1rkqnZosBBv5Pq4HBwhtrMUW5Eu4s37gkZEljypYpNUjDI1%2B7QBjqkAcBSP%2FaTV83i%2BrL2LH21k8sXrwb3GdfJbp1PW88CbwnaJ8JjiLZ9C9MSBfBeR2YrKQ%2FKteKqfRqDCKmFB3PJ6%2Fp%2BxNcCHjJO561gCClteF%2B8MojAqAP%2Bo8k4B7GkIT%2FU82yhCYjOSMVmaUi6fFLiQrK1rQybVgm%2FmS%2BnFWLJfM3sn8UBxfLRZbTK6CDX%2FI7ClhzPR84dbJS3WACowJ1TKRRpBY7L&X-Amz-Signature=24855cf74045347bdf7f07bac42ae6132945a038c3d2284b09b4db6562b7427c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664DPWC4H3%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045136Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIBqw9hBD%2FZGKrzD0aY7RbIFftq%2FvqchlFRmexoeOvXmlAiEAzkY%2F0qsjhPzcU0MITuxy2BtOo2o7JMkr9ZG8D1%2FyD9cqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFVpsGF%2BS%2F6BIEzp9SrcA51w5SixKPISYNmZ3lp7%2FExfoy5NvVpkF3Q7KMrpzC7ksllDH%2F7geGd18uTDUhGx%2BLegVPJEqF09YBCKEH%2FKBGMjnntWyZ82rCVUuWeoCZwjnjrRqpc3J2lAXjZ3o92C4njk9xfWz2lU3fp1zFr9NuQC2KmPolgyxgXI6y2ZS7J4xfUrPu4Ac4VFsJVBgLCNCWFbpymoeHuwqOxQ84e75p4c4%2Fg7scsp9zCSRA99JpBPXO72UO%2FWgAagy0fbxA%2BipleLwcNouEhaFzYUTRIJhKygjFglL%2BDagyeJ0kit6uClog6PmDUDhnLKYAx7QB3OaH%2FioXanmC6YG9jxOpP3iRehyZJoceakORLePcxiDPQUfk%2B5Fe2mp7jxNEisEox0tOhVKBKrrrG7cdoQNnjqNrHZ%2BWYhors0JaX3LUp70i%2Bo2UUgycLJxSV02QekNZ8QKybomCFl1MljlZY4296ViJzXOLKFH6jILGeCaronnQRfvuRtPyd4VJyiCifVDUiDXi6FhYG9KDh4ouMnp0HGb6Q4%2FhT%2Bh%2F69D8Z2qhMn5kXp%2FxJhDCg8%2BLrQQ0HrAoNFl%2F7s35P4ykxrjfRETIeFsGjXm4cvXBI8nT9pjNc4pepSMDWKy%2FlKGVQJRElXMKbX7tAGOqUBdtzCAqQBHXx1uEUDm%2Fh0QAm%2FrA2HaQ%2F8VLt8oq16GbCC03AsyfIbBsA8RcYaSO0%2BnFacH5EseFdclpcDGyd97Q7keTba6JVzWZ65WsA7pFWn%2BpTDz8PRNV6kjVoQ18bHEmcAVFx8Q4GFGdiwsDuS7B5wl2mzZz2fpSf7AMy2xI4wl9ae%2FTC9%2FMdCZdEOiw%2BK8LbvluP0MIHDIbTAV7d9MID6Bkpo&X-Amz-Signature=9ca3316e029d8e4a5bcc3216a8867f5045a9ed3891b662ba28974bce183b8399&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664DPWC4H3%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T045136Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIBqw9hBD%2FZGKrzD0aY7RbIFftq%2FvqchlFRmexoeOvXmlAiEAzkY%2F0qsjhPzcU0MITuxy2BtOo2o7JMkr9ZG8D1%2FyD9cqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFVpsGF%2BS%2F6BIEzp9SrcA51w5SixKPISYNmZ3lp7%2FExfoy5NvVpkF3Q7KMrpzC7ksllDH%2F7geGd18uTDUhGx%2BLegVPJEqF09YBCKEH%2FKBGMjnntWyZ82rCVUuWeoCZwjnjrRqpc3J2lAXjZ3o92C4njk9xfWz2lU3fp1zFr9NuQC2KmPolgyxgXI6y2ZS7J4xfUrPu4Ac4VFsJVBgLCNCWFbpymoeHuwqOxQ84e75p4c4%2Fg7scsp9zCSRA99JpBPXO72UO%2FWgAagy0fbxA%2BipleLwcNouEhaFzYUTRIJhKygjFglL%2BDagyeJ0kit6uClog6PmDUDhnLKYAx7QB3OaH%2FioXanmC6YG9jxOpP3iRehyZJoceakORLePcxiDPQUfk%2B5Fe2mp7jxNEisEox0tOhVKBKrrrG7cdoQNnjqNrHZ%2BWYhors0JaX3LUp70i%2Bo2UUgycLJxSV02QekNZ8QKybomCFl1MljlZY4296ViJzXOLKFH6jILGeCaronnQRfvuRtPyd4VJyiCifVDUiDXi6FhYG9KDh4ouMnp0HGb6Q4%2FhT%2Bh%2F69D8Z2qhMn5kXp%2FxJhDCg8%2BLrQQ0HrAoNFl%2F7s35P4ykxrjfRETIeFsGjXm4cvXBI8nT9pjNc4pepSMDWKy%2FlKGVQJRElXMKbX7tAGOqUBdtzCAqQBHXx1uEUDm%2Fh0QAm%2FrA2HaQ%2F8VLt8oq16GbCC03AsyfIbBsA8RcYaSO0%2BnFacH5EseFdclpcDGyd97Q7keTba6JVzWZ65WsA7pFWn%2BpTDz8PRNV6kjVoQ18bHEmcAVFx8Q4GFGdiwsDuS7B5wl2mzZz2fpSf7AMy2xI4wl9ae%2FTC9%2FMdCZdEOiw%2BK8LbvluP0MIHDIbTAV7d9MID6Bkpo&X-Amz-Signature=8bec99a3044a62ed458592d660104f2b2233f955a665ac5035f76268263b4dcf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

