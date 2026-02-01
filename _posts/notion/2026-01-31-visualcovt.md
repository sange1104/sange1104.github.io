---
title: "Chain-of-Visual-Thought: Teaching VLMs to See and Think Better with Continuous Visual Tokens"
date: 2026-01-31
categories: [blog]
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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A7J2FPP%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022329Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDe0pSAxyZ46KFPst%2FpzMwSEWxKFKfVPaiw9Bow%2BbH%2BrwIgA4tOK2bA8%2F5B4as73DxeUkMBuX1Wt0NOpKql8R6ueU0qiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPgTBaMcUuzuhuwQfCrcAw9G7R%2BraMxRZJ9ZxKaH83ZNvkJXTDvWdaBAm0ZnEJbg6gb9hpXNF8NVhHdqUD4eUrbjeN4z0YjwLPW%2BgH%2BG3t8lsP40OueoXbOT84gUK90%2FbiABgBU6U7kITS0TxrAq4PswH6IlvqYTBOXH1ukOGnadbJo3Zf4BCuboEFkJGUx5Nt5pfYbhiV%2F3GBySVRWVTs8nrs9PRuhmTm3oeQwQ8yasLYdMAwfKoxGTCvzdJIK%2FAKHCX%2BQsUjIatjlsAYWII1fxveByqPW%2BUCkkfFBzopj753d8ynAEQgeRGkE%2BIyAf1I7njoT5YPdO6EfxJLUgjSZpBR%2BtB%2FqvVbhWutPnSBMwJebudj1IllPDARmEVriZ1QmHjYrZeSgi0Jf99h2xK%2BV07cSokN%2FjwFdYwpxhLoOyjwtjO6qSduubXu7K3AC%2Btsr%2BSVScDPw35bCG62Rez9Ox4VaKh4NbmxchmQIZ5YZIydwaq8bbYyDhMwXzYrU9T9xW%2F45sSUu37hZVwgCHqgHJAOEsD0tuhlktSWN8ocXmYWWrGQPOisCvM6WmJxpVZu5sQW5guDYgXT4czU9tZ%2BcG05t0GHRIOl2ZfbWBagLFuoZhridXm8PScEWGlqSFA6OXLxGwmUEcYX4ZMN3x%2BcsGOqUBOR%2BrIUNyWISDz7Kv3MuK7VZlKz6dhe%2Fla53QdqdO1GQmb1GHgPqtfVvD9bav6qYNxUKERL5tL3vYPhjfCbBog1rzDTixSfIJEfALac1cc8rRC7oPGLhHGzqGKIPxwYetcGeBckuLKWPOJl6i4cskPClmZh%2BbGY7WPGfg9fKJS%2F%2BfpGBS49%2FiJHVO9WkFrAmDoR%2FTSUT0azDXScrY4TqOSWnoxkqE&X-Amz-Signature=086c4373a8edc777dbdb3940f26a40c69ebf9fa800672157c5820f4c042c47a5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A7J2FPP%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022329Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDe0pSAxyZ46KFPst%2FpzMwSEWxKFKfVPaiw9Bow%2BbH%2BrwIgA4tOK2bA8%2F5B4as73DxeUkMBuX1Wt0NOpKql8R6ueU0qiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPgTBaMcUuzuhuwQfCrcAw9G7R%2BraMxRZJ9ZxKaH83ZNvkJXTDvWdaBAm0ZnEJbg6gb9hpXNF8NVhHdqUD4eUrbjeN4z0YjwLPW%2BgH%2BG3t8lsP40OueoXbOT84gUK90%2FbiABgBU6U7kITS0TxrAq4PswH6IlvqYTBOXH1ukOGnadbJo3Zf4BCuboEFkJGUx5Nt5pfYbhiV%2F3GBySVRWVTs8nrs9PRuhmTm3oeQwQ8yasLYdMAwfKoxGTCvzdJIK%2FAKHCX%2BQsUjIatjlsAYWII1fxveByqPW%2BUCkkfFBzopj753d8ynAEQgeRGkE%2BIyAf1I7njoT5YPdO6EfxJLUgjSZpBR%2BtB%2FqvVbhWutPnSBMwJebudj1IllPDARmEVriZ1QmHjYrZeSgi0Jf99h2xK%2BV07cSokN%2FjwFdYwpxhLoOyjwtjO6qSduubXu7K3AC%2Btsr%2BSVScDPw35bCG62Rez9Ox4VaKh4NbmxchmQIZ5YZIydwaq8bbYyDhMwXzYrU9T9xW%2F45sSUu37hZVwgCHqgHJAOEsD0tuhlktSWN8ocXmYWWrGQPOisCvM6WmJxpVZu5sQW5guDYgXT4czU9tZ%2BcG05t0GHRIOl2ZfbWBagLFuoZhridXm8PScEWGlqSFA6OXLxGwmUEcYX4ZMN3x%2BcsGOqUBOR%2BrIUNyWISDz7Kv3MuK7VZlKz6dhe%2Fla53QdqdO1GQmb1GHgPqtfVvD9bav6qYNxUKERL5tL3vYPhjfCbBog1rzDTixSfIJEfALac1cc8rRC7oPGLhHGzqGKIPxwYetcGeBckuLKWPOJl6i4cskPClmZh%2BbGY7WPGfg9fKJS%2F%2BfpGBS49%2FiJHVO9WkFrAmDoR%2FTSUT0azDXScrY4TqOSWnoxkqE&X-Amz-Signature=3505b82038818f5d36e9eff9e9d83008bd34312a07f8349ff1e2f6f0cc873e34&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A7J2FPP%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022329Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDe0pSAxyZ46KFPst%2FpzMwSEWxKFKfVPaiw9Bow%2BbH%2BrwIgA4tOK2bA8%2F5B4as73DxeUkMBuX1Wt0NOpKql8R6ueU0qiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPgTBaMcUuzuhuwQfCrcAw9G7R%2BraMxRZJ9ZxKaH83ZNvkJXTDvWdaBAm0ZnEJbg6gb9hpXNF8NVhHdqUD4eUrbjeN4z0YjwLPW%2BgH%2BG3t8lsP40OueoXbOT84gUK90%2FbiABgBU6U7kITS0TxrAq4PswH6IlvqYTBOXH1ukOGnadbJo3Zf4BCuboEFkJGUx5Nt5pfYbhiV%2F3GBySVRWVTs8nrs9PRuhmTm3oeQwQ8yasLYdMAwfKoxGTCvzdJIK%2FAKHCX%2BQsUjIatjlsAYWII1fxveByqPW%2BUCkkfFBzopj753d8ynAEQgeRGkE%2BIyAf1I7njoT5YPdO6EfxJLUgjSZpBR%2BtB%2FqvVbhWutPnSBMwJebudj1IllPDARmEVriZ1QmHjYrZeSgi0Jf99h2xK%2BV07cSokN%2FjwFdYwpxhLoOyjwtjO6qSduubXu7K3AC%2Btsr%2BSVScDPw35bCG62Rez9Ox4VaKh4NbmxchmQIZ5YZIydwaq8bbYyDhMwXzYrU9T9xW%2F45sSUu37hZVwgCHqgHJAOEsD0tuhlktSWN8ocXmYWWrGQPOisCvM6WmJxpVZu5sQW5guDYgXT4czU9tZ%2BcG05t0GHRIOl2ZfbWBagLFuoZhridXm8PScEWGlqSFA6OXLxGwmUEcYX4ZMN3x%2BcsGOqUBOR%2BrIUNyWISDz7Kv3MuK7VZlKz6dhe%2Fla53QdqdO1GQmb1GHgPqtfVvD9bav6qYNxUKERL5tL3vYPhjfCbBog1rzDTixSfIJEfALac1cc8rRC7oPGLhHGzqGKIPxwYetcGeBckuLKWPOJl6i4cskPClmZh%2BbGY7WPGfg9fKJS%2F%2BfpGBS49%2FiJHVO9WkFrAmDoR%2FTSUT0azDXScrY4TqOSWnoxkqE&X-Amz-Signature=0efcb6b7b26a95cc52e28e2c0d4d34e8dc09775af8ddd62b7651bfb63a84073e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A7J2FPP%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022330Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDe0pSAxyZ46KFPst%2FpzMwSEWxKFKfVPaiw9Bow%2BbH%2BrwIgA4tOK2bA8%2F5B4as73DxeUkMBuX1Wt0NOpKql8R6ueU0qiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPgTBaMcUuzuhuwQfCrcAw9G7R%2BraMxRZJ9ZxKaH83ZNvkJXTDvWdaBAm0ZnEJbg6gb9hpXNF8NVhHdqUD4eUrbjeN4z0YjwLPW%2BgH%2BG3t8lsP40OueoXbOT84gUK90%2FbiABgBU6U7kITS0TxrAq4PswH6IlvqYTBOXH1ukOGnadbJo3Zf4BCuboEFkJGUx5Nt5pfYbhiV%2F3GBySVRWVTs8nrs9PRuhmTm3oeQwQ8yasLYdMAwfKoxGTCvzdJIK%2FAKHCX%2BQsUjIatjlsAYWII1fxveByqPW%2BUCkkfFBzopj753d8ynAEQgeRGkE%2BIyAf1I7njoT5YPdO6EfxJLUgjSZpBR%2BtB%2FqvVbhWutPnSBMwJebudj1IllPDARmEVriZ1QmHjYrZeSgi0Jf99h2xK%2BV07cSokN%2FjwFdYwpxhLoOyjwtjO6qSduubXu7K3AC%2Btsr%2BSVScDPw35bCG62Rez9Ox4VaKh4NbmxchmQIZ5YZIydwaq8bbYyDhMwXzYrU9T9xW%2F45sSUu37hZVwgCHqgHJAOEsD0tuhlktSWN8ocXmYWWrGQPOisCvM6WmJxpVZu5sQW5guDYgXT4czU9tZ%2BcG05t0GHRIOl2ZfbWBagLFuoZhridXm8PScEWGlqSFA6OXLxGwmUEcYX4ZMN3x%2BcsGOqUBOR%2BrIUNyWISDz7Kv3MuK7VZlKz6dhe%2Fla53QdqdO1GQmb1GHgPqtfVvD9bav6qYNxUKERL5tL3vYPhjfCbBog1rzDTixSfIJEfALac1cc8rRC7oPGLhHGzqGKIPxwYetcGeBckuLKWPOJl6i4cskPClmZh%2BbGY7WPGfg9fKJS%2F%2BfpGBS49%2FiJHVO9WkFrAmDoR%2FTSUT0azDXScrY4TqOSWnoxkqE&X-Amz-Signature=145ff67b69dcdff5db8b990f3a9054d976f6a02a68da39f562e23aaac7da1507&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YMSRSVT4%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022344Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF%2FUErQjQskDGd7kz%2FNO7BesqNN0kKM4v1XBpoYXwxXlAiBIslfU1kOG19IbSCdTwBlOP3jIPJvUh9c%2Bbus95mkoySqIBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMEOXkz%2B5VT4zobc%2BwKtwDeHJNBaqounVac8UOvGrjV4udXlUc1rcNV3nn70gH0AwcgyWcsW7ec%2BwI4GDKS5RABpYpkL89bc%2FAp3%2F3yUPx6o2A9wmCExXlw8sABQ2cW9AohgQ4CVJxEHplxf%2Bo%2Bkhj55bRaZ7sH3E2RlkX8ydNR%2FNnRk7YG1gXv8c2WKIuDSD6YZooNEpluXcxU6MdjxnpniMN63Jx6FjYLyv9xUcEiREBVqPLFjr3K93g%2B99P7TWFOl%2Bb53%2FxWaI%2FzqE42ETnPQvSEIcDLvwbLW%2FlsY%2BTRZLM9E2SQYoyeEeUK7fNvuTfZOEdO%2FfKwKLS6zxS0Gy9b54WYGjQ4OZNLITwiP65bmAAYJ5TDmd8FxUGDa%2Fr%2B%2Fo388EQ0xSzP1LGv4YzY9QZEJWgs6APjTP53SxiVf6IZj%2BrXWa3sbHRSZUOTycv9P6JejxpzjKBWcgqsnP0SO38CmXgLkPIKNEmeMk3EHsBd6ZHla8Jhu8%2B%2FUGVTk430H6bcB4rvNFs1KMR94esPnpkIJNoxVYUPZOR2SbsFfwR%2FPQcWsXsx0VRFC1SNOA6%2BwyCF6DW33f02Lu6RKrlXX0hk%2BOU3M6LTBpF2yQzlRIWlzSDk1DklQFY7SGzByQuzReOMEjULDG7W%2B%2BVq0AwxPH5ywY6pgGi0OSIEPvDHhHzBcDYEjL7Og%2BDtgA4%2B5IBN0bRdQy18Htcl2BF2TzDQTySvRhqoL5U0F5nayjVJuEmw0VU0YUvdpipADZ%2BCEGOE48sEnQASPLsYqPUMpR1sBDrP0EFp77e2YGb8lFNGdyfbAKEtBRIuTeX%2Fvlnf77Qp1gnb%2B6ZpnXhOjYSJX53olRE1%2FrbCjXyiyYCzrAAV1Q%2BbC3bFuOj7X1Sxdjn&X-Amz-Signature=fd81bd629fc02f62d7aa78aa451549e69c2e6915e1683bdb34e8f8edd6c08d06&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R7T7KWK7%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022351Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFQ%2BZO1%2BU5atkQ44P3BuFbTgfhEPChIvdy3dHTS9L6LvAiBNoAiXorj7dJUWCCzRHim3ScJ%2FCGw4o1cIikKt5YvJeyqIBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMcc43NKvEU%2FDWf0pcKtwDZwX6QH6Ztdd%2FTPkLrSXzBpTHT%2FsnyTM6H6sv2ivq7QP5MHX6mWNjfRpA1HowwRAUcHI9EiLOWOnjJS%2Binjk9z2OboKUb61QVER0D5X6d%2F%2BxeuKULr10G9JTPToE17U5T7QB88ObAt5bvPrbUWERRmH0wzcgGh0u3Bi1x%2Bert0HEBshl%2F%2F6SBKVAkZ9aNchmntF3TtGeRk%2BJFBxI%2F2lsaQMb3Cv9Kau31XnlTEcAb52JhFgDRjLzdfFniqTHVz8QdYnwI%2F5GjDMX6Koc1z69rnY9mTkSpfURcas3uiwt6PAIjEBsC8tOcGBUsRFgPI9f%2BfkAp%2FiJSVSC14emhJtWPzCNrdYCGzKgG08WlA8UrdrWwAebHO2g%2FCnSF1mWB%2FakZdjiVomKOsCFGdIIzXE3ZHbWQTgVwZRSJd6F2jrs%2BqcZYZ3H%2Big4PbL2BcEi8DglFOsQRApReF%2F9GOuYiThSKqXmEKpsmyw32qcteKhcUZtJ3uVGVGgqUUa%2Bg%2FXuuugQMg8wenlcO2hYRjxLn%2Fe9OK6k39GRAJiTov0JkJPRkjdn%2Foou1kfgAtqD47CeGWqKIVp2iugtAUJ%2B0FpsD4j3hkUXN1e5GbMPMKzNNsieXQEUo0z%2FdGc1owAri8vIw4PH5ywY6pgH045t9NBGAPA1OZcD6guZJVSO9vjo5v%2B6aIcwqEz04vRE5vJMWIajuHB3PYvvZ6hTgD%2BH8imsxkwBbfJkHZ2qhZvQviqgDaZNzwtxf%2BxIoMsDJHE9yyUeHWE1zWYmMBjw%2FmxvZOwghLUA34rTiefl6xzIZYVEG7sCb5ijR8OkTu85%2BwDDWNREx6nls9K3eXYPQceM%2B74EphEgIgSuSNuzlyrMr4NGJ&X-Amz-Signature=e74a793de2d34a7c9897e513af73a77cd0624c718c4a2f14a6258d1e1911c0f1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664IQ7HJFN%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022352Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDSeBO%2BossG4dyGqn0JD8Lva%2BCMc4W7MoAtKxVsBdbMKgIhAKdfIDcq4ZXaVFpL8oyPTSNTCOV9pKy8JHKWMhB4UtLxKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgznSZI2MZ5WSrfnq%2Bgq3AN8cXOJrvOgAkpwu%2Fo08lILXa5A9gP01YTiBGY5eyyKxQts%2FUPsL%2FsmC%2BKC6H5IFGnUMi6LpzX2GA1geoIOGydaE9H2irQ3aQ%2BRclDOkNm44udS%2B8UPSz02fbH4jJIZEXqQ247EUAkqH3Kh2CZ4pHTAND4ITWc3COTfCpXwomW%2FtXR0KCWzkiY4PI8fc%2FJOuROMPXpd5mJUNGBYU4plBZFKI4FR5JJudU57AATKng7avXTLu8rbUyq0R27CwuriZfC6YktofYWwtWFr52444j4JO4LDXoRwaYyN%2Fe%2FFLsfENYotfE7MJnVg%2FWSeJHXhym0frd6w3JMWUUVFJwnsLS6qGxTTmsVJUAXYnzrPsXt3ZA2Z5p%2FmeqO8K8BAxMpHuCdjHEGDgo2HzENmQjbO67wSL%2BRePX2gw1LsFUk9R5TB7VAAZlKhI1sH0DHb2d%2BPz3rXab0EeCHjyL9Y1bOF0T%2BjaAiP95nT1KGfPsqQLghv%2F%2Byp9%2F5HZjvoyEcCLUOsx29IHIXwIkP8JZLPGH0Mmfye3SmDRuMhPfJ3lddwrUhUkajuwO5ivX7mXrD7iwTDeFItSjzlycTxzG4syMU%2BMVk%2FurM%2FiiS7%2BqZY0QQWzJp%2FeUM0140KhdC67zMaDzCX8vnLBjqkActwu1mqfJhlr96SjYI4Izx5XD00aGG6Uj2Hp5JtSReJU28G9EhQ2QnOP%2Ban4mJGzz3vw1ruD5JumcSll6SPngTc7mszPGNlORZOoLoQjERY8oItwtJrzINCaJH%2BRMr3xA0Cn5tYlwSijNc2zTLVMgr1PLCbLt%2FDoHxprZ2etSX80j7gELTz2m49M34hAA4oOLYhIU2zJJs3xMdJ8i5shoLfYrzn&X-Amz-Signature=722a21b405948c8f8688145119fc51411ffda3453d69e8316e23d91024970799&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q2DW5HBK%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022352Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAN3YZI8IhAGxhR5ut47E5QIYLZiUJf%2BGcdxeme2WSA9AiEA5NT45Hx50ii7ZTgP%2FUAitNghXH92mGe9tEfY9ClOJ58qiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHOplfGAp4JNQEw3dCrcA3j%2Fy4LrEY7WVT1378KqsZMJWjxz5brFsL8Ec9bQEjMIqog%2FgBOulX13nB9EZbhDs%2BrqWAZwhWDPYg1618IBDJySc8GzLxu3EkvVsw81S%2FivtKQbxPAA65A%2B00vIMdHUFw53mdRAa76LrciCAIGl%2F57eS4fv6ENUnZE0eiN2qaj%2FFgWlzDGha9GigqQP4Xn86U2CEBgLQ%2BJaxjDka6mN0ceUKql8oCwdfBzf%2FcMYILjf6GYnLTmfX%2FpahlP%2Fbq1VYYxCKaQ%2BbtfMIL9h2nCR3ymR7TTrAgCMRUijtcl84Hb2mN62ZWMHZCHPzmKpxQQyJNILe%2FxTDX3irP1%2Fb%2FNcddG5%2BP0YIisRMtBxJE9D4r6Jz5dmFCCMZJdGMVzLpIHxyxUH4qR6pBR72vPx3p1yuPLAo%2BjJkDbn%2BBJFFTHoalQiQu5dZ13Ml82hnbaoJ27RNcL4n%2BCy%2BKyr5EfAzjCGfKxuVLGvDOCPFfMf4aYED%2Bf6SntxMf0Ci6PBtmxV8%2BL%2Ba7Rk89ul14zmZH%2F386R9GIO3lBJr8X7OvANPJvY4WKPUxFWi6uikXprECEcVwtDZR0seP2wV5YP%2BfRZEYdKdXAqdG%2Fpwxop7z21%2BDdjWNj8%2BHSNBl3kRq7xrMD0VMIny%2BcsGOqUBu1DskjLBbPHlWwQ%2BXIdhDhlMSGa5Lrbj1%2F%2FVcaXRXznjXlFQZ1xYrIumkUjL830kZ7lk4URJfYwIWy%2FJo52EQONgFPity1DFsGIJTYTIFk7mmdJLdImnQRuE3t0Dsj1E8b4ZaCQxs7ITbXyDeC2wUMv27LasuYEjSrxSBpS6w7zvOv4uxjK%2FBKQ89%2FlVCGpl3k44goLWOLNuk9Dd63ZFtqvgCeqM&X-Amz-Signature=9c1fd16b0dbb95fe1a7692a6f81d626dc4d69aa14306d28a839297b42d638b2c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A7J2FPP%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022330Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDe0pSAxyZ46KFPst%2FpzMwSEWxKFKfVPaiw9Bow%2BbH%2BrwIgA4tOK2bA8%2F5B4as73DxeUkMBuX1Wt0NOpKql8R6ueU0qiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPgTBaMcUuzuhuwQfCrcAw9G7R%2BraMxRZJ9ZxKaH83ZNvkJXTDvWdaBAm0ZnEJbg6gb9hpXNF8NVhHdqUD4eUrbjeN4z0YjwLPW%2BgH%2BG3t8lsP40OueoXbOT84gUK90%2FbiABgBU6U7kITS0TxrAq4PswH6IlvqYTBOXH1ukOGnadbJo3Zf4BCuboEFkJGUx5Nt5pfYbhiV%2F3GBySVRWVTs8nrs9PRuhmTm3oeQwQ8yasLYdMAwfKoxGTCvzdJIK%2FAKHCX%2BQsUjIatjlsAYWII1fxveByqPW%2BUCkkfFBzopj753d8ynAEQgeRGkE%2BIyAf1I7njoT5YPdO6EfxJLUgjSZpBR%2BtB%2FqvVbhWutPnSBMwJebudj1IllPDARmEVriZ1QmHjYrZeSgi0Jf99h2xK%2BV07cSokN%2FjwFdYwpxhLoOyjwtjO6qSduubXu7K3AC%2Btsr%2BSVScDPw35bCG62Rez9Ox4VaKh4NbmxchmQIZ5YZIydwaq8bbYyDhMwXzYrU9T9xW%2F45sSUu37hZVwgCHqgHJAOEsD0tuhlktSWN8ocXmYWWrGQPOisCvM6WmJxpVZu5sQW5guDYgXT4czU9tZ%2BcG05t0GHRIOl2ZfbWBagLFuoZhridXm8PScEWGlqSFA6OXLxGwmUEcYX4ZMN3x%2BcsGOqUBOR%2BrIUNyWISDz7Kv3MuK7VZlKz6dhe%2Fla53QdqdO1GQmb1GHgPqtfVvD9bav6qYNxUKERL5tL3vYPhjfCbBog1rzDTixSfIJEfALac1cc8rRC7oPGLhHGzqGKIPxwYetcGeBckuLKWPOJl6i4cskPClmZh%2BbGY7WPGfg9fKJS%2F%2BfpGBS49%2FiJHVO9WkFrAmDoR%2FTSUT0azDXScrY4TqOSWnoxkqE&X-Amz-Signature=17187950beaa25cebb1c4bb9e56128572de4317cd78ee152414fe9f5132ddbe8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A7J2FPP%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022330Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDe0pSAxyZ46KFPst%2FpzMwSEWxKFKfVPaiw9Bow%2BbH%2BrwIgA4tOK2bA8%2F5B4as73DxeUkMBuX1Wt0NOpKql8R6ueU0qiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPgTBaMcUuzuhuwQfCrcAw9G7R%2BraMxRZJ9ZxKaH83ZNvkJXTDvWdaBAm0ZnEJbg6gb9hpXNF8NVhHdqUD4eUrbjeN4z0YjwLPW%2BgH%2BG3t8lsP40OueoXbOT84gUK90%2FbiABgBU6U7kITS0TxrAq4PswH6IlvqYTBOXH1ukOGnadbJo3Zf4BCuboEFkJGUx5Nt5pfYbhiV%2F3GBySVRWVTs8nrs9PRuhmTm3oeQwQ8yasLYdMAwfKoxGTCvzdJIK%2FAKHCX%2BQsUjIatjlsAYWII1fxveByqPW%2BUCkkfFBzopj753d8ynAEQgeRGkE%2BIyAf1I7njoT5YPdO6EfxJLUgjSZpBR%2BtB%2FqvVbhWutPnSBMwJebudj1IllPDARmEVriZ1QmHjYrZeSgi0Jf99h2xK%2BV07cSokN%2FjwFdYwpxhLoOyjwtjO6qSduubXu7K3AC%2Btsr%2BSVScDPw35bCG62Rez9Ox4VaKh4NbmxchmQIZ5YZIydwaq8bbYyDhMwXzYrU9T9xW%2F45sSUu37hZVwgCHqgHJAOEsD0tuhlktSWN8ocXmYWWrGQPOisCvM6WmJxpVZu5sQW5guDYgXT4czU9tZ%2BcG05t0GHRIOl2ZfbWBagLFuoZhridXm8PScEWGlqSFA6OXLxGwmUEcYX4ZMN3x%2BcsGOqUBOR%2BrIUNyWISDz7Kv3MuK7VZlKz6dhe%2Fla53QdqdO1GQmb1GHgPqtfVvD9bav6qYNxUKERL5tL3vYPhjfCbBog1rzDTixSfIJEfALac1cc8rRC7oPGLhHGzqGKIPxwYetcGeBckuLKWPOJl6i4cskPClmZh%2BbGY7WPGfg9fKJS%2F%2BfpGBS49%2FiJHVO9WkFrAmDoR%2FTSUT0azDXScrY4TqOSWnoxkqE&X-Amz-Signature=6760bd0f10e9f15933c211c11b27e7ca6cb7ba62ae1aab462b629dd0b37838f4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666G7OBDNU%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022358Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCIuypeqjKDNw2vkOqnxFnKgkxpswbdqFF%2ByzFkMZGaggIgDnrsbDf76P%2BpQMKRqNItvDfjcU3Qw2flLrjj1HgjhZMqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDB3%2FZPh%2BjR8Ai2BipCrcA2Od6c7w8sMalKVqcIFZq4pt0HOAIS65HvZmesOQj%2FmQ42Syzc8fvYcjeXLgaCYozn5%2B%2Bw51pYBotWuNRWQYxRi35mj%2FgnWNYDl2fCxVeyQODUJBE%2BEua2z6O%2FZ66rsjiAMGxiQjZc1iYWBUXi5XidPS%2BRldaVRg0JYSDYqEia%2BMogLuAC%2Bf2TAwZ1p2Fj1m0Nja5MxA84ChAk7KQHjuHsp%2BhJoRuY97BNUp4AWlBXyD3jdJbj9WNYopbPcgxmtcTOGACZZD0JerbCtAu4U%2BHge8YQCtS6fsgakjgm%2BwLRJQID%2FIHKQnTIXO8W4c%2Bw%2BjnqFcCKOdl%2B7QwXC4T9gB9w%2B3%2F6uC5%2FT5yhy7HLeSejcQSK%2F18NTZoestVumgs5cjM6Q18IkO3WPdQFej1cqtDUFM1ltUuUaOW7lKSRofM8Zk0RpawvhMlX6rGkMenC%2Fci8PaAuxBIcQcYknNeXftda6b2YfSypqfDym9L1aua5fMIdSG43AToUtDJh%2Be3T7VujGc%2BaX7gH1KENJS%2B%2BNoqvb4vZVO56ix%2FRQTwzRz9p0D6kIWpLnHQCvqrhwu%2Brnofl5jBmIBDxxBsfQ6aM%2FnTccbN%2FENclyuR8XtPpcTo6rPTzYN7lPBGRRo569GMJPy%2BcsGOqUBj3%2FLccZAbDdDfzRqGbzqNTjLwmHuQVKs288OInFt%2FVWMXDKt2YvnbeRiqMX%2BIrEsKvpKphYNA7vdGdy2rn9BWWzV1XS8LAbF0cuLF2vTXZxR8SCaNveXzo%2FdN84GGGo3Vhwd6sx7si7CkytYzijWFugV5kd1aDyK4orJ6UfLxM6EkXorAu9nF08sdsrlGRPAz55DTsAdy0NeoiWTHSZqM8GDtUaP&X-Amz-Signature=bf13f2c1687cacde4b4ea05193f2d55d991200fc1800ebf7ebca9b7c5c2ac978&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A7J2FPP%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022330Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDe0pSAxyZ46KFPst%2FpzMwSEWxKFKfVPaiw9Bow%2BbH%2BrwIgA4tOK2bA8%2F5B4as73DxeUkMBuX1Wt0NOpKql8R6ueU0qiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPgTBaMcUuzuhuwQfCrcAw9G7R%2BraMxRZJ9ZxKaH83ZNvkJXTDvWdaBAm0ZnEJbg6gb9hpXNF8NVhHdqUD4eUrbjeN4z0YjwLPW%2BgH%2BG3t8lsP40OueoXbOT84gUK90%2FbiABgBU6U7kITS0TxrAq4PswH6IlvqYTBOXH1ukOGnadbJo3Zf4BCuboEFkJGUx5Nt5pfYbhiV%2F3GBySVRWVTs8nrs9PRuhmTm3oeQwQ8yasLYdMAwfKoxGTCvzdJIK%2FAKHCX%2BQsUjIatjlsAYWII1fxveByqPW%2BUCkkfFBzopj753d8ynAEQgeRGkE%2BIyAf1I7njoT5YPdO6EfxJLUgjSZpBR%2BtB%2FqvVbhWutPnSBMwJebudj1IllPDARmEVriZ1QmHjYrZeSgi0Jf99h2xK%2BV07cSokN%2FjwFdYwpxhLoOyjwtjO6qSduubXu7K3AC%2Btsr%2BSVScDPw35bCG62Rez9Ox4VaKh4NbmxchmQIZ5YZIydwaq8bbYyDhMwXzYrU9T9xW%2F45sSUu37hZVwgCHqgHJAOEsD0tuhlktSWN8ocXmYWWrGQPOisCvM6WmJxpVZu5sQW5guDYgXT4czU9tZ%2BcG05t0GHRIOl2ZfbWBagLFuoZhridXm8PScEWGlqSFA6OXLxGwmUEcYX4ZMN3x%2BcsGOqUBOR%2BrIUNyWISDz7Kv3MuK7VZlKz6dhe%2Fla53QdqdO1GQmb1GHgPqtfVvD9bav6qYNxUKERL5tL3vYPhjfCbBog1rzDTixSfIJEfALac1cc8rRC7oPGLhHGzqGKIPxwYetcGeBckuLKWPOJl6i4cskPClmZh%2BbGY7WPGfg9fKJS%2F%2BfpGBS49%2FiJHVO9WkFrAmDoR%2FTSUT0azDXScrY4TqOSWnoxkqE&X-Amz-Signature=d1efe1f96ed8ff25ea5cca133d81c849630043364af344e436771765cd39b707&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667M2N5O46%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022358Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDdQJNsxoTx586LrLP0Pic06e18dr6hoKNTyDb%2BepP8nQIhAJIDpENIml2POcDsnhapCxXYJrnvkqesBN65JAR9tQkNKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzWRuZ5Vl0ZUZ8Lynwq3AOTiuL%2FUFIqdwnuihXxXxTU5ynhD9mHG3UIeKou9eORbH1qeRFJbS1HSGFQ6W5cwAxrcJXRnzhIPRSKcfFwddo87K0pvk2D6z4CIwLjDMoHAoWlXYQcaNcgXA5ewaLaST%2BCoeHgn%2BHrqp%2FbKKpdZaq%2Bf3oMNCf8DY2JcVaqXWPld3G9Ue9huFpfRikMfMpDqZnbefc8gJAVoHjhw1T6kEH1%2BTwhXxGJm8tAES4ZGMZTUCeMEalEbR0uNsrUKgibL97R0FTvvQ59Ci5Bpd8jUsj6QhA0wxV4HiFDru9H%2FPiZOTI1yHhFMiY4xj9AZLfE0odipkFnyK%2F0IGwjFP7V6IagHX9kWMQwd2Tj2fl3m%2Fmgi%2FjdACOUIo58KVOnvCJg00YMzbzpe1q8bK%2F1dpoMrITg66EaZ3tMoLta%2BGlK9ugGYhJy6zPnk9217TXQvUTZJbJfKK%2FVwAh5mLVKGnOD2HRlFcGUUmBUZAvSwDpu%2FFpxbfySopBGYnPKjqYlYwqQeUOzmay5rktzkq9JiLnkup2natJrnsqsMhYSsQ7VM7LuHNn%2FoGNo9NQ23HKRbq9e9JE8zBnhWCXI0qqIW5ovN4%2BcbRqUjt7lUqz9gctW4OPH4hb4TQ6mbxGtlAnCUTCA8vnLBjqkAXdfu11axb7yWk6ZF2%2F1Jnh8NJmstaH%2BvfKYtx8A%2F0ghKn6vu0ZKmWvKWmftQUZjqAHwoK2mxUYlxwkn9VWd9WQ%2FU9uz2gHgq%2B6ihicox90I1zUr3lscOqwfiwY0iimQ%2BdVbp%2B2eXUpf6o%2FI6Vg5JDFetp2ORKhP7j4JgweDwegY%2Frge8w4gq6Diqq59Ey9rw8XBOzXGa5ttsQgiYUNWTzPyrT9D&X-Amz-Signature=3a3b113d5f4541a5d078fdbc3b2b5c75a6a0763311552930a46c07bbecceb790&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W2O45KSN%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022359Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCClK4jO%2BGovH%2FWMV6XHpVVRoBVX5C1M5Vufnbgk2jcqAIgI9ExNUQVR6cO%2BHxiUMOatagwKkvBZLAroMsiuf%2FeD%2BsqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAwn%2BCUUEZQ84s1mXircA0w%2Bn6j75V85oIZP38e08jwSyPmXOQaE5Dgb3Hcx%2BNX2rZMDMDQMx3ZwVZru4vpL2fkxYcDle18KpXPOs5resuledIng00pW1PfJ4qCv6eA0BVjml0%2B082pRWSW5myMh95xG6Ya41mAyLXEvocCdfY4cC8yz3kO5oyWukQtYXv3kPiI58TJbv5A4Bq0WtiNcwRjBZXfcE6J2qj67hNy7NZoPsQj0KQs0uGzuNsIK2ha22r%2BcD3l5oK%2FeTlKJpamxiq2xUJ4jMiKtqJoJmNN%2BLba93zJwtVz9%2FDrV800ViNDt%2FdmC3jNuq2BWbFumAmGHLrQBnwYc797naKixVgLa4YKSPEom77llAb25gb3mBS%2BPGO217ME5CeL03PrKOs1UdnnNippfCkKTDyyHVR30sHGalxTBr24J1UUlEJb5gKSfRPfcmLiBBujSrqo4LadHGPB8OX5QMWRLUUAkceLdQJg9rZshMXsAOuTxiOZCJcx%2Bnuhov7IXVYPTJ%2F2dsQLXgb5KZkgekHl4FkgCKWFwd%2BVvV5hHg0Izto7ZF5NPCZjKKDRk1vPveyJjY1gWEthvWcNmr7BwvebpgZEq2ETLct3ADI4%2FL6AfCkvJEo9%2BYiV43n%2FdvXFHT0OoJ9%2BqMK3y%2BcsGOqUBtN4WGHMGZUp9SbEbZuWHI9Qj0TD4nbxhKyFLHWcLxu%2BOsgn157gVpm5V89%2BLB4FuGfSCL9HzlR50DamrVJ9rpQf2RwIOjxcAgoGPKTeMXaK7h0h4m6Yfoa6NFsQzgxOp1zXLjhUH%2F9i3X5ryskzDPDb8Y7Mrd9OMM994QlxniwitCgf5KC4AP7DQEVfb1zGS6Hos9LP5744Bsj4YFXLWgrNiMuEC&X-Amz-Signature=a2381a3168cf0573b952f163ab67dbda5c4d153fb386097480a4ca556aa30c8b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZBGN6THT%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022359Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDFqPz%2B7sjl5m2ib%2FELNjZDItJjEKsB7gUp%2FoYPr8cK6AiEA9Tzd2lONPo8317w4J%2BwSWCwxOV%2Bg84w5SislIKIBxOUqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNzsD%2F35ghb9fe%2BuFircA59NoPdki%2FtbxpyF5V3i4N%2FI1wIalH7E0pk5i4b1Ys8d8j443xQiR9%2FxQ7gqc3Pc7AS%2FQOPn%2FNKLTbWG69CxxTvpWw0WWJMmZ7hP9kM0Nu6PZg%2BMChUIYGBbvtl4pUXU0EMEulzUcrEIfnfBIDBf2sNnkvdCjDdr%2B5C5HuXEdzWAgt5tuIVY2R5iV4MUyL8j%2BmekNIdUmbxmuKwEoTi5S9twgLl6KcdjAOMgtr5EF36pyfUb5ZdFew%2B4%2F9njBclFuSdMskumNVB4N%2BfYWagtqWqxwhq%2FGRmyJ5rVp%2FYLA5qMeTMALmwWR9g%2Bp9s7g%2FExk%2BWp0z%2B3P8omLw1cGBDo3ewcvsr%2Be00E9iaHyP4TJFyXnEFJiQ4pFr8z6hNppFeDW2QRkOX0MGgFCJq3c%2BTAMvt1cgkUH2uIgA3jhV2E4%2FqUfHFaYc07wro5gLqOckZt4SQ0QSeU4%2FW1i1puzLDR3tCMviK6yvxeTj2rk%2B%2BCB366Ku0K0MEw4E0QFg0VNsWMgToaoHfaVTLY5Ogsehye8mlsU0dAvexhYLxA9n8ILIDfjIDjQllN%2BdGAymIbsRuDuiutrmfo%2B5UrsYgvHAHbaUxqZjqT9H4VR6RR9FoukPkq%2BBx1A7xA1JFmPAIpMNrx%2BcsGOqUBAudKWXZZB6uZ6sKkUetG02RkG5TYLF1ALJOJEnSIeyIQnp93iEhEqdsDD1XCLj43Y2pCIDcVTOWn68niZQ9IbpFzFMKreeli1fivkQAmPW4gzVh%2FCufO3KQwLcUKJEaqT3TKyKU0k1ZZZn8WD2Ng6W%2FNfh4ZPqVXLZ38f0pr4H3ek2Vcjz8Xz7iBhIksf6iMLXiVPJ9ZQZ1vac0ffuMstEnIlNfH&X-Amz-Signature=905f33db39efb6ecb88aa0ee81cacae6582f74a73b9545aabfcbe9791253daf0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665CPRQCF4%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022400Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCNdvC85PbxPg8ReQ8yjQDgtMu05ujgYQS7lx6lS4RehQIhAOA52O53rP3ViKON7TAZXe%2BuTgcr1lVPg4WBzfnMyFOqKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzHiHlcm9gvuI%2FIFd8q3APamZIZaVP53UaeuURiDvm43ZFw4FKr%2B%2FqDXhKgd8heQM30ma656l96VMqAKtKCHMepZvZVrWN3%2BTJYmvuBv7mjXCinoV%2FrF2GOX90YOIRCH8WoXofB06hZJg%2FWkrkb3PQ2L5sSsZOUphQISfzeVJfY2ZdL5W0KxSCOCjVa%2F%2BPC9o%2BXYpYwBJEOXlQe64I4WMbMGfqF4Ocvh3WMaLwpOLu1HGyoxxU68zPfbe1KDxiszcc9s9yZgzdpw7Z4Gb%2FpxDsdK15E8aw7bPPY9SMxiCZ0pkMvmO5l1EPr%2FufIg1R46jMNmIS1xiRMkcCFh221eYFXb0FziDrxN6JVaTPGql9%2BCiCtoA36S1DdGpbd0%2BmCIEnICo%2F3YOYPJB3ROzR6%2Fn6N%2F9g95Tcf11daoxjtZYg9v7veVsN4Cl%2F%2F8WW42o22X49B1Qk70c7%2BllET08Q%2BER%2F%2BqJ75G%2F4YZ2zWGBImFH2wzwow6Jf4rbCkfmS2tLB0xpGU%2BqtlTHxJktru%2F2bpBGkaOWj9RIavj%2FmhhIPULp4LYLIg09nhVsNNvBXQvXwJa4xeSk1sP8kOQJNWpVlO2zk7jELyZCHF9bAoxLEkuZ3pUX2GNtSsHqhviVvM4X%2BISM3kcFXzPme31Om2BzCK8vnLBjqkAb2NavyLowncSSJR0OpDDUL%2Fl%2B0fTFE7Ybe21N4SzE4TpNlPitN8G0zy8fTRi5HI3hkV3o%2Fppf8akN%2FMowckq%2F8JAQqcQbpTluQGkj%2BNvA%2BLWEA17XPVo5kzvayC4JWGzgHY2ECi5FusOodMypB3NX6jgLTPijkLVq2wzjGh8ojr6HCkOQMOU0jV%2BlW3UNWQ5sCJcwQr5Vap0oJCtscUuxAn2ADm&X-Amz-Signature=8304ea9e386ddcfb7d2224ee0604878c15c9764839002aac4f56e8f3ae2ae069&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표
