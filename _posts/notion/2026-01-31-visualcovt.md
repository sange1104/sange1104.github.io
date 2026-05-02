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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466674MUFCL%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIQCZUS41b53Ujfv%2BWzh3EprPsJnIrweMzkeL5gOOAyBzWQIgWZKAE5nF6wXizBG6IcI9ytQawfrdnM96g4qBUSu0Figq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDItQQ4Tyi4o39jraaCrcA6pmSyAL7J%2FEXN45kqVd%2BUem28P5uq5MNHsWn%2FopJHhpFsRfKsM%2FF5uHGn7%2FMMo6JAuy7CAdChXKM8dEq0aY20uEmG67XcIdeg5ThuCpwktjqYIVhuX4HtntHCEaryjidD4nDTL4XLJ4nv7wa4k%2FY4oiZNfZE%2BYJJe%2BpfhINtZ%2FhjuhFhCseq67cvsMCDrGk%2FnRTEEYBkNjduJxO%2BSMy%2BOO1%2BQ%2F3ngtmxJZRMe5m6sjvK4Ws41D7Eaoo4L7orWTotKsz12Y3pMAm3tPRAfAcNb7KLxjMDuF3G2AE9e1tSx26BkVVeiWXTS%2BftbTblBxKltZATtiwMR%2FI6IKzZ22kOjKQuJ10f9gaSwlNB2CgwMZBT49o7O3cJekcp72%2FbhVLsa31XVhwtQ31XdCI6R1OGM0Ma2y6A9chAvmRt3J01LmjDVX6mcRgOaEtx3tJZtyuWxXzUpuLsRpuLpehIC7pGEIT2CmE%2BBF1OlEe7%2BRBNOnnzWFxbf%2B6QTG3VDdmo0K02wkaFp2z1%2FHELoNIiS2Kt6zSEMbvjMCvWuyDMn9Kdp6YWtyQBB9svbeBJnL4vFFon7Un0n1vw7SfaFFcySpP0Qm4g83yp4sAxyJAR77Q%2BJWivD0fpHa2ZIaVL5DZMO3J1c8GOqUBJgGRgNC8bRrnsQjSIGWPYA2gyGi%2BEr4DmO4MJE3eGg%2F03unDFDgld6gJd%2B9iF8YbbkdA%2B8irhV%2FmF7cnDb6Fwg2Jga3A6rUjQUpkK6WjvBtfvRbIX4qmMXRhoglM9nyNXUWgDR%2BUbjnKuTE92CpC%2BEu20tTazDCLDTh123FgKk0wx2fl7QlvwcBQFy7a9nwascoYfpdRdvM7KThcOOT43VmvVN83&X-Amz-Signature=5ade3d6d93e61a49afecf34d08ca491a7702148e8e9947ab6ebb26773acaf6f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466674MUFCL%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIQCZUS41b53Ujfv%2BWzh3EprPsJnIrweMzkeL5gOOAyBzWQIgWZKAE5nF6wXizBG6IcI9ytQawfrdnM96g4qBUSu0Figq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDItQQ4Tyi4o39jraaCrcA6pmSyAL7J%2FEXN45kqVd%2BUem28P5uq5MNHsWn%2FopJHhpFsRfKsM%2FF5uHGn7%2FMMo6JAuy7CAdChXKM8dEq0aY20uEmG67XcIdeg5ThuCpwktjqYIVhuX4HtntHCEaryjidD4nDTL4XLJ4nv7wa4k%2FY4oiZNfZE%2BYJJe%2BpfhINtZ%2FhjuhFhCseq67cvsMCDrGk%2FnRTEEYBkNjduJxO%2BSMy%2BOO1%2BQ%2F3ngtmxJZRMe5m6sjvK4Ws41D7Eaoo4L7orWTotKsz12Y3pMAm3tPRAfAcNb7KLxjMDuF3G2AE9e1tSx26BkVVeiWXTS%2BftbTblBxKltZATtiwMR%2FI6IKzZ22kOjKQuJ10f9gaSwlNB2CgwMZBT49o7O3cJekcp72%2FbhVLsa31XVhwtQ31XdCI6R1OGM0Ma2y6A9chAvmRt3J01LmjDVX6mcRgOaEtx3tJZtyuWxXzUpuLsRpuLpehIC7pGEIT2CmE%2BBF1OlEe7%2BRBNOnnzWFxbf%2B6QTG3VDdmo0K02wkaFp2z1%2FHELoNIiS2Kt6zSEMbvjMCvWuyDMn9Kdp6YWtyQBB9svbeBJnL4vFFon7Un0n1vw7SfaFFcySpP0Qm4g83yp4sAxyJAR77Q%2BJWivD0fpHa2ZIaVL5DZMO3J1c8GOqUBJgGRgNC8bRrnsQjSIGWPYA2gyGi%2BEr4DmO4MJE3eGg%2F03unDFDgld6gJd%2B9iF8YbbkdA%2B8irhV%2FmF7cnDb6Fwg2Jga3A6rUjQUpkK6WjvBtfvRbIX4qmMXRhoglM9nyNXUWgDR%2BUbjnKuTE92CpC%2BEu20tTazDCLDTh123FgKk0wx2fl7QlvwcBQFy7a9nwascoYfpdRdvM7KThcOOT43VmvVN83&X-Amz-Signature=0a67fabbae1584986b1599b137d560ac0b1c517368f96c70b7e4c993577565fd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466674MUFCL%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIQCZUS41b53Ujfv%2BWzh3EprPsJnIrweMzkeL5gOOAyBzWQIgWZKAE5nF6wXizBG6IcI9ytQawfrdnM96g4qBUSu0Figq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDItQQ4Tyi4o39jraaCrcA6pmSyAL7J%2FEXN45kqVd%2BUem28P5uq5MNHsWn%2FopJHhpFsRfKsM%2FF5uHGn7%2FMMo6JAuy7CAdChXKM8dEq0aY20uEmG67XcIdeg5ThuCpwktjqYIVhuX4HtntHCEaryjidD4nDTL4XLJ4nv7wa4k%2FY4oiZNfZE%2BYJJe%2BpfhINtZ%2FhjuhFhCseq67cvsMCDrGk%2FnRTEEYBkNjduJxO%2BSMy%2BOO1%2BQ%2F3ngtmxJZRMe5m6sjvK4Ws41D7Eaoo4L7orWTotKsz12Y3pMAm3tPRAfAcNb7KLxjMDuF3G2AE9e1tSx26BkVVeiWXTS%2BftbTblBxKltZATtiwMR%2FI6IKzZ22kOjKQuJ10f9gaSwlNB2CgwMZBT49o7O3cJekcp72%2FbhVLsa31XVhwtQ31XdCI6R1OGM0Ma2y6A9chAvmRt3J01LmjDVX6mcRgOaEtx3tJZtyuWxXzUpuLsRpuLpehIC7pGEIT2CmE%2BBF1OlEe7%2BRBNOnnzWFxbf%2B6QTG3VDdmo0K02wkaFp2z1%2FHELoNIiS2Kt6zSEMbvjMCvWuyDMn9Kdp6YWtyQBB9svbeBJnL4vFFon7Un0n1vw7SfaFFcySpP0Qm4g83yp4sAxyJAR77Q%2BJWivD0fpHa2ZIaVL5DZMO3J1c8GOqUBJgGRgNC8bRrnsQjSIGWPYA2gyGi%2BEr4DmO4MJE3eGg%2F03unDFDgld6gJd%2B9iF8YbbkdA%2B8irhV%2FmF7cnDb6Fwg2Jga3A6rUjQUpkK6WjvBtfvRbIX4qmMXRhoglM9nyNXUWgDR%2BUbjnKuTE92CpC%2BEu20tTazDCLDTh123FgKk0wx2fl7QlvwcBQFy7a9nwascoYfpdRdvM7KThcOOT43VmvVN83&X-Amz-Signature=7103852555b661c6053895d5c6fce08010c7e348d95e4ab018547535d050a728&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466674MUFCL%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIQCZUS41b53Ujfv%2BWzh3EprPsJnIrweMzkeL5gOOAyBzWQIgWZKAE5nF6wXizBG6IcI9ytQawfrdnM96g4qBUSu0Figq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDItQQ4Tyi4o39jraaCrcA6pmSyAL7J%2FEXN45kqVd%2BUem28P5uq5MNHsWn%2FopJHhpFsRfKsM%2FF5uHGn7%2FMMo6JAuy7CAdChXKM8dEq0aY20uEmG67XcIdeg5ThuCpwktjqYIVhuX4HtntHCEaryjidD4nDTL4XLJ4nv7wa4k%2FY4oiZNfZE%2BYJJe%2BpfhINtZ%2FhjuhFhCseq67cvsMCDrGk%2FnRTEEYBkNjduJxO%2BSMy%2BOO1%2BQ%2F3ngtmxJZRMe5m6sjvK4Ws41D7Eaoo4L7orWTotKsz12Y3pMAm3tPRAfAcNb7KLxjMDuF3G2AE9e1tSx26BkVVeiWXTS%2BftbTblBxKltZATtiwMR%2FI6IKzZ22kOjKQuJ10f9gaSwlNB2CgwMZBT49o7O3cJekcp72%2FbhVLsa31XVhwtQ31XdCI6R1OGM0Ma2y6A9chAvmRt3J01LmjDVX6mcRgOaEtx3tJZtyuWxXzUpuLsRpuLpehIC7pGEIT2CmE%2BBF1OlEe7%2BRBNOnnzWFxbf%2B6QTG3VDdmo0K02wkaFp2z1%2FHELoNIiS2Kt6zSEMbvjMCvWuyDMn9Kdp6YWtyQBB9svbeBJnL4vFFon7Un0n1vw7SfaFFcySpP0Qm4g83yp4sAxyJAR77Q%2BJWivD0fpHa2ZIaVL5DZMO3J1c8GOqUBJgGRgNC8bRrnsQjSIGWPYA2gyGi%2BEr4DmO4MJE3eGg%2F03unDFDgld6gJd%2B9iF8YbbkdA%2B8irhV%2FmF7cnDb6Fwg2Jga3A6rUjQUpkK6WjvBtfvRbIX4qmMXRhoglM9nyNXUWgDR%2BUbjnKuTE92CpC%2BEu20tTazDCLDTh123FgKk0wx2fl7QlvwcBQFy7a9nwascoYfpdRdvM7KThcOOT43VmvVN83&X-Amz-Signature=f60e354838f9b75211f92723a75562e722105ea3ef2282c20a4f1a7e1f8c5ed2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662ZED6RNK%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJGMEQCIC5rmI%2FaWtqh2xnhJpftmb9D7XaoPivi0Vsi1OxL5QIgAiAjX2415qMoZpbHe%2BMYA40qJNW9P2ep7UL6pKEZsEuNYCr%2FAwg0EAAaDDYzNzQyMzE4MzgwNSIMbypYyB7JDazUdHiqKtwDC%2BmD0sRyTLCXEceYTPnmnjyPq404ArLSD712mkG2PjcczXwJkl6w26hArx2WQJJNSz2m9ZrqaK4lHAb%2F22TYnv5m9YCKzrhbh8qnsnv%2FsbZ0V0tP2XIH%2FLGPAGcK2%2Bz036vejHFugOG0nzVv1smPlKUk04OI77wc6WoKpfvSJ9MaM6nKz7n5WJ0%2B24xZzNVoMz5eF26ZNdWInZbNDM5cQQagrZvpB2O5osjBRC31pjSMmhbEERRCMAjePA4cBMtBOkkwPV3f2kNuRszQExzYguHOheATlXRpEimeDg0IuwpSY1dD86sBiw7gBvefivG8dbObyRbOXD9Q7zrypbUntWmKZwknk%2Bp0OjsqljQAH6y%2FgETyg1uNWu1X4IOH5oT82o7Ss%2FNCVNr724xcMVmgnCYqZwOKTOtsMaetZFbCoy%2F7H6VezOa%2FgLnyJSa%2FGWISBlNX4ra0EZuZqrvLfgiTwT9G%2FZ1rEararl6toLA3NN%2FeSmtrN8Sq%2BfJprmSREF3Yb2%2BEr6s%2FS4%2FqRUou5g1W9PT7M%2F2Km8HtdoacNnzd7Oq2mctLTwURu%2F1SqvGrJM7iEq0B3h9dk33EG%2BKY7aWPWdF24w8qOqtKomUlFCOAQEDzkdxNEjuCLjgU7eUw7MjVzwY6pgHoy8Smik3ugMi6cEosD9V8F0JRRmnFh80X7S07h037AdMNihtE4qFvusApeznYcnShmXPZcuH9lY4evXK7naRVbqEaSZ1FJn%2BYVtjv2fJQqu0gsIuWqKWMeOSWXwHUG5Y0HtaWnL3UzWSA5SUUM9gZZUZJNSDI8m054E8OPJTw0PJI5C2KD572bqxW2X1KvxU%2Fug1eYYm0HfCC3IKs17BqgpzyOc9Q&X-Amz-Signature=81ee5cccc9a51856e6828507f6190015fd66df81fda5125578fabad8d9506316&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XVYH7GVG%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035104Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJIMEYCIQCLZMgA4vN%2FbCeEoHOOwJ7AZj%2BJTiJoUg0YfAdeww0SYQIhAJkMIM%2FfcvvvAKZD%2Faf%2BD0YLzJCppl93ZnrX8956wFN%2FKv8DCDQQABoMNjM3NDIzMTgzODA1IgxCJD4xFKD6V3YD1Hcq3AP9%2BrfmeGSvs%2BMN2gNXFt86Pgn0NICuiEAEM8Y3XJlqjXqB4cayCoLsO8wVjPgb7YKapBbHyZeos0ZBesfiUZuq9qpF6Eu%2Bo3gvfYXtp074CwlHZ3NwKlsMEExMYkuXCyi9rRnJLWtKMAiw5jzmlSlu6yQNUmPvllX%2BZtOE7xgcaj3WOzZJghF%2FKY1YPG4t1IqNuS%2FbMC5LHcYLYppnuCl5glgN7QuVkzu%2BAujRcBUSiCTSJWD0juO5o%2BSYGUHP4G0U8eqaWbhVZvaCcdU17%2FlZNDfiSS3SOdnkG1XIvYK2cFEbbPzkWHQ6fadfIdx4MToJCQZlwE7rt3RLFoV4RLsKLc2jNv43vVaww04vdoEngtlD4x8zUGp8zCbV6pZ1aOzWiLwDaeQ8Xy6bPkiZ8dmPJIml0HteXe6YTMwueaDjsv%2BJ%2BqyXnhcAVd6GfumAYMTM38IeFDaeCl6wkbUQEUGzLLCmkBeA0RpvRtjwYrQjjd5suJGajV1CPUk4FQ84n9jmpToVXZuFTLB5zJg6csn0nX69%2FotCXB2IizKdYma6JS74O4DhIGyn9lhfrk9s2cg5CDKv20Rb2ytT8NUeJmDwwBJmczKNMyglpMcaqvdcDN2U1CZSgJ1VK86V6zDqyNXPBjqkAWjc3kRTvt3ecjl6R0rV9owhE5gYC4ZOwdS9MTrHPIXkpXXleuDobNltxoGiZe5oAGviH3pV%2FYIUc7z01QS536CfW7RSHfx8WIi5GNsCyxKy849xPRlMZmNO3qwhV3oiEw%2FCzbhe68aecWqv%2BccU8WC2i9eYTNJzNY9U2s0LCjrJ4tnUqYAbqYhPQAbYUtpmrmEU9%2F4Rn7A22mfy%2F1Bs5u7wYael&X-Amz-Signature=446e5fe6af9425c175f19860ee7040bf118093ff219f7b3cce1388dd0ba97447&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XARMMYIA%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035106Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJIMEYCIQDAkrhjgNUtaNYEIa6S51hM%2FWxOD%2BKQaaJeMyCkQG6JUAIhAJ6EBL2driMcWqI4AA0lFihW0jFX%2FCC9SEEtYyjmpgcXKv8DCDQQABoMNjM3NDIzMTgzODA1IgzsNkkQncxSDBe5aTQq3ANVVBmTwZa2oMoeJvBwDVR5ftU7qOerowlYAFebzVN82bbxHBV0FgXU6uEGS1gPZ9ug1weBVSt%2FBrULXnALlYRkfuGlgdN9%2F8cBEDjQmU460tKI%2F537Pgm2s6KI4M28%2BkVollF7kn9W1IF9bI79RgNHNzph3qkVJK31fT1%2BdABuYpHYTUMzFldqzuvHdqFJb582x0yLE3MzD%2FSuk0mJ4sk767BXfKLkMMw1ss0WEINFCZv5MJd7o06NP0DJBIfkwItwajHKHNyi9Iw8W7g8f%2FHOc35tCpJgLqKseO5bx%2FVnS%2F7xfIrd%2F%2F9JwZoULWzhSRu60%2BHI1EcWvPvAP%2Fu7U%2B47qSNUJJ%2B5oBePmjNr8CNMjhU5ews4oi7faDTyta7GGpGhq5hHSlsBNQaVB68Q6LIKLvX6g2eGjD1IHW6JC4j2zGjFz4g7l%2FxGGzRXVP9OGrq976ELEiyNC%2B9mNzQ8q7OexaQDLp1z9NGAinQD0DULXOAVQBKcEl9kVPGNrTeRhkHtjpyBuVN5lW3jPboEHJLEL6QXn4bsYKurJuA1IPg4FXbYamtirskOW5WZyH7S6oZZ1Mi7S%2BbZh4btk3u1mjiXGc1wrkB9tdh1cvVmis873lBp6lj%2B7TK8%2FrAGHjC7y9XPBjqkAdmKxKxGFb5srGEond%2BNRQywH55tYQ%2FkacnOud7nviRhyOJy7%2BBa%2FEbRvsGXqge5hqrPQTuL4cp%2FUN48Gc%2BRQ0EEPz3JZtHfc6sAF0b2HYvojGAFhpADd93s5vEwfk3ouBOVivg5XxlpdCANUobnCymel9d27iKJmJGBEXgj16S88OYKAbsWa%2F%2BRKmnZUpxKyXW3MY%2Bnb9oOS94bmsr5VR%2BU7LpF&X-Amz-Signature=3f872769e74c98e7149e88c3698550793901470a7eeb18fb30635f27c8d70f48&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QQZ7VJAQ%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035106Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIQD%2F3jV6nu6lp30v15WUfZv%2BrEIqr6bnpKaWhbGMliWFCgIgBr8NnDHhGvp4Ja%2FOJ919I3o1jDoKSiF9f4%2FnSFlgJnoq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDOkWsbnbGoUrLEA01CrcA0o9onOUwF8eGJDt9ogux8Hcmz5RNf1MuTYWJObRxjZ2ZIgGTgKH9rB4sV6kg%2B66f%2FvLMxznd8oU%2FT%2FAiqF6UV9eS0REOEa259pRtTGup3JkwBEPU0vJRh6PBms%2FO3vu4A1a9zqOHv0jjia95lD6BNkZVMYdn%2FxDsRnuDS%2F%2Bg3foQLEGmZ1wLCzO%2BckC1SWZ%2FTV5A9hv0xIdtp0iWw7YCWhgx48bgGJw%2Fh1NGZJA5mSAQ%2BuKTAlURRPJJUebh%2Bb6zc2n8PxhIMU6F8wfGVeMgILw868YBvIQEJVU%2Fm2VpFxlUnh3CPU9WlCpZMyMMUeZVLTAM6eBQnfVdnHevzM84GyhJ4KPale2JaUijJGFDo0OpltWeTyPSnayr7pmGvW1XGSPHcywSNKW2JcZ3hc1DLe9VnvjXibIHTEXugbnzGlvUp6qpYI6mlUk2YoX%2B1BXmUOWmb4gS3p1ivWF2qLdBa34Agwq0SD5qkx8gfycA8YQIjbMfFn4RjvClNZcRGf8bUaTEHwiJn%2Bu%2F1nHG8ThJAM250zR8lcoK3IV0lgcKv9UbcfcMnomkSehILL7YjUDmdlfovLeo4ATvzluI36hGaTBxj6kDtwNZpRVkXZ5CM860vCHwz8UxKfk0KFZMOfK1c8GOqUBIZUw0TANfeygDDm58Fh0qsf8Yfza2Rl6WR1UzuPIdnX599nONmNOx8LfirEMPkDov3TXfyW%2FMsQ34YwUT02VFnlLcs%2BL312KVfoqaqAaV5eKsYGUoZXn7lVvuqaBhG4zkoyYuMyyKxjibomaikutt%2FxMUE3Jflu%2B4JmZa%2BwaCOLrti2bveVDmgI6Huhkpst0gNz%2ByIhsSnRV%2BUFiGZJ3a%2BtFNjzz&X-Amz-Signature=e38903ac9b24f4041d2df5ec4f59104848261a48eb42511abeea071dd713c78b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466674MUFCL%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIQCZUS41b53Ujfv%2BWzh3EprPsJnIrweMzkeL5gOOAyBzWQIgWZKAE5nF6wXizBG6IcI9ytQawfrdnM96g4qBUSu0Figq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDItQQ4Tyi4o39jraaCrcA6pmSyAL7J%2FEXN45kqVd%2BUem28P5uq5MNHsWn%2FopJHhpFsRfKsM%2FF5uHGn7%2FMMo6JAuy7CAdChXKM8dEq0aY20uEmG67XcIdeg5ThuCpwktjqYIVhuX4HtntHCEaryjidD4nDTL4XLJ4nv7wa4k%2FY4oiZNfZE%2BYJJe%2BpfhINtZ%2FhjuhFhCseq67cvsMCDrGk%2FnRTEEYBkNjduJxO%2BSMy%2BOO1%2BQ%2F3ngtmxJZRMe5m6sjvK4Ws41D7Eaoo4L7orWTotKsz12Y3pMAm3tPRAfAcNb7KLxjMDuF3G2AE9e1tSx26BkVVeiWXTS%2BftbTblBxKltZATtiwMR%2FI6IKzZ22kOjKQuJ10f9gaSwlNB2CgwMZBT49o7O3cJekcp72%2FbhVLsa31XVhwtQ31XdCI6R1OGM0Ma2y6A9chAvmRt3J01LmjDVX6mcRgOaEtx3tJZtyuWxXzUpuLsRpuLpehIC7pGEIT2CmE%2BBF1OlEe7%2BRBNOnnzWFxbf%2B6QTG3VDdmo0K02wkaFp2z1%2FHELoNIiS2Kt6zSEMbvjMCvWuyDMn9Kdp6YWtyQBB9svbeBJnL4vFFon7Un0n1vw7SfaFFcySpP0Qm4g83yp4sAxyJAR77Q%2BJWivD0fpHa2ZIaVL5DZMO3J1c8GOqUBJgGRgNC8bRrnsQjSIGWPYA2gyGi%2BEr4DmO4MJE3eGg%2F03unDFDgld6gJd%2B9iF8YbbkdA%2B8irhV%2FmF7cnDb6Fwg2Jga3A6rUjQUpkK6WjvBtfvRbIX4qmMXRhoglM9nyNXUWgDR%2BUbjnKuTE92CpC%2BEu20tTazDCLDTh123FgKk0wx2fl7QlvwcBQFy7a9nwascoYfpdRdvM7KThcOOT43VmvVN83&X-Amz-Signature=2f841a506a45ba963f7123123cbbfd8ca60be8e82854f88be7f3eb862fd24b78&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466674MUFCL%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIQCZUS41b53Ujfv%2BWzh3EprPsJnIrweMzkeL5gOOAyBzWQIgWZKAE5nF6wXizBG6IcI9ytQawfrdnM96g4qBUSu0Figq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDItQQ4Tyi4o39jraaCrcA6pmSyAL7J%2FEXN45kqVd%2BUem28P5uq5MNHsWn%2FopJHhpFsRfKsM%2FF5uHGn7%2FMMo6JAuy7CAdChXKM8dEq0aY20uEmG67XcIdeg5ThuCpwktjqYIVhuX4HtntHCEaryjidD4nDTL4XLJ4nv7wa4k%2FY4oiZNfZE%2BYJJe%2BpfhINtZ%2FhjuhFhCseq67cvsMCDrGk%2FnRTEEYBkNjduJxO%2BSMy%2BOO1%2BQ%2F3ngtmxJZRMe5m6sjvK4Ws41D7Eaoo4L7orWTotKsz12Y3pMAm3tPRAfAcNb7KLxjMDuF3G2AE9e1tSx26BkVVeiWXTS%2BftbTblBxKltZATtiwMR%2FI6IKzZ22kOjKQuJ10f9gaSwlNB2CgwMZBT49o7O3cJekcp72%2FbhVLsa31XVhwtQ31XdCI6R1OGM0Ma2y6A9chAvmRt3J01LmjDVX6mcRgOaEtx3tJZtyuWxXzUpuLsRpuLpehIC7pGEIT2CmE%2BBF1OlEe7%2BRBNOnnzWFxbf%2B6QTG3VDdmo0K02wkaFp2z1%2FHELoNIiS2Kt6zSEMbvjMCvWuyDMn9Kdp6YWtyQBB9svbeBJnL4vFFon7Un0n1vw7SfaFFcySpP0Qm4g83yp4sAxyJAR77Q%2BJWivD0fpHa2ZIaVL5DZMO3J1c8GOqUBJgGRgNC8bRrnsQjSIGWPYA2gyGi%2BEr4DmO4MJE3eGg%2F03unDFDgld6gJd%2B9iF8YbbkdA%2B8irhV%2FmF7cnDb6Fwg2Jga3A6rUjQUpkK6WjvBtfvRbIX4qmMXRhoglM9nyNXUWgDR%2BUbjnKuTE92CpC%2BEu20tTazDCLDTh123FgKk0wx2fl7QlvwcBQFy7a9nwascoYfpdRdvM7KThcOOT43VmvVN83&X-Amz-Signature=4e8155a68764e68e09e6dc5611c7eab5b5d5c3363a9a099d413314d41194f1c1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667VYWIKDL%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035109Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIQDEk%2FK0OxTSLwNVlaJbjLfaXOyx3dbeVk6wWU6QVJVrDQIgY0iqE5XXwPqY4ss2weNG0VSM9NsnlapD6WbNq7E5iTYq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDCvHMJ6li5B3UDEQAyrcAwrWhERdc1VgNqMqlx78HSmBBLzO%2FKO0HWeH2WEXgPC2N%2FZeO2qhmQ%2FIj6UtJq081XES534lQz1A3iivV%2FV1qtci32pgp2M%2FgJhkauvK%2FgXYlXN6A1waCsujeIeFIzsi%2F11MqgP0eDrpGqqACBq8R1mmXmwi76Ft3lJbI0H9NAalMK3QbkFL9%2FiU59neMRs9k%2FjSfWuczEwRrC7tqERkc%2Bkue5Nl5mToRmSaBFvPYfzRHAlFLTGfhQ1am7RjiZt1fA3bNAM3dknRXOvuNAYMXujHbfVRGmfjBbh%2FC3dhflzdYouutM4ieMYNW5oPYl3JnFWCEthG9IbfdkVQ4r%2FphZdJXlAr6hr05E9y8bwsIp7OeAUEOGJI%2B3s1tSdPeoM19vecsDAY%2B1wTCdbAc89j4Fu6FKKEPNGz8dcBxCYIYdypWTRaUZwgD9aDJABInfIBVo3c%2BBUxxUArh5cgqJZc9%2BW2MVNdfRYPX7sjdNGBuSAFbnu%2FeYXnMoLYasF75v7lbpdAT3lYptBQX6A9a4A44m6OB2kmXdrRoK%2FKaDXlXsZoHv5QYSj%2B8TEYmDJ7AB9LWFL2tkB%2BwEbyNE4DdyZF4N0VMfRK8l2O6XS56YblYHMTcXx5SwiQ6ENSCwPtMKLL1c8GOqUBPCjQXZ9EWlurAkXekNFv%2F%2F6oHMLYf6eJ3VlbWc%2Bb%2BMqdZxQUpU61DxAH70nTrAQ6He8h4dyYcSyAdKR8VSctmTuyBkv8amoQLK6GWj%2BoUdJ6k9z1JWym9ZWLLIKKLNp5FPo3zPSpc1MpDW0s4ruVPwvqDcmTr2xmWbKyYWtDRlK11hZdrUzBpt%2Fo2Xaw%2F5klZFLaKeQYuH7%2F7WV9skER7bhKvggs&X-Amz-Signature=ee4525e69a572348df6b3ef95b42d28c77d2611fa5c4ce1bbaf49ad893e17172&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466674MUFCL%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIQCZUS41b53Ujfv%2BWzh3EprPsJnIrweMzkeL5gOOAyBzWQIgWZKAE5nF6wXizBG6IcI9ytQawfrdnM96g4qBUSu0Figq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDItQQ4Tyi4o39jraaCrcA6pmSyAL7J%2FEXN45kqVd%2BUem28P5uq5MNHsWn%2FopJHhpFsRfKsM%2FF5uHGn7%2FMMo6JAuy7CAdChXKM8dEq0aY20uEmG67XcIdeg5ThuCpwktjqYIVhuX4HtntHCEaryjidD4nDTL4XLJ4nv7wa4k%2FY4oiZNfZE%2BYJJe%2BpfhINtZ%2FhjuhFhCseq67cvsMCDrGk%2FnRTEEYBkNjduJxO%2BSMy%2BOO1%2BQ%2F3ngtmxJZRMe5m6sjvK4Ws41D7Eaoo4L7orWTotKsz12Y3pMAm3tPRAfAcNb7KLxjMDuF3G2AE9e1tSx26BkVVeiWXTS%2BftbTblBxKltZATtiwMR%2FI6IKzZ22kOjKQuJ10f9gaSwlNB2CgwMZBT49o7O3cJekcp72%2FbhVLsa31XVhwtQ31XdCI6R1OGM0Ma2y6A9chAvmRt3J01LmjDVX6mcRgOaEtx3tJZtyuWxXzUpuLsRpuLpehIC7pGEIT2CmE%2BBF1OlEe7%2BRBNOnnzWFxbf%2B6QTG3VDdmo0K02wkaFp2z1%2FHELoNIiS2Kt6zSEMbvjMCvWuyDMn9Kdp6YWtyQBB9svbeBJnL4vFFon7Un0n1vw7SfaFFcySpP0Qm4g83yp4sAxyJAR77Q%2BJWivD0fpHa2ZIaVL5DZMO3J1c8GOqUBJgGRgNC8bRrnsQjSIGWPYA2gyGi%2BEr4DmO4MJE3eGg%2F03unDFDgld6gJd%2B9iF8YbbkdA%2B8irhV%2FmF7cnDb6Fwg2Jga3A6rUjQUpkK6WjvBtfvRbIX4qmMXRhoglM9nyNXUWgDR%2BUbjnKuTE92CpC%2BEu20tTazDCLDTh123FgKk0wx2fl7QlvwcBQFy7a9nwascoYfpdRdvM7KThcOOT43VmvVN83&X-Amz-Signature=9edf885e4d2378d4cf69112d7e91979f330b5f9e3404dbca9564a61d9831946b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46665UCIDYN%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035109Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIEnBNUDgR7d3lqzC5i%2FMN%2BoeIeeuqevuthgUVm1lDX9KAiEA4bHjdk9r7rFJc3jLo38emxMP5Tr5G9s97I%2FunaEvapsq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDDSB0i9XezjvLsFccyrcA%2B1pAtjg3W4OgYYjEKEIQzzydDjpme36bKOg%2BF5wIFTVTnxLu8dfIA0qmsXS4Cza6ebgmfIa%2Fxo5C6RrfkuQ%2FLTAnTZcwO7STd5Wzvu%2F1YvGlODPdgBCWUWE%2Fc%2F9Z8dk8Iow%2Bg3JbTjl%2BkK1C81bgM7FMpUG0o9XS5dZFhkQi9sVtZ%2B%2BSHyoX%2FH0tJSRtdloCS2gjFP8p50S17jhS4XDoG9renIOOHO73hCzL%2BDD7ZY%2BoUdUSnfojuLWsSH3YqxI7UECJCaAoKFizIPz7oJ9EcSpYUzZB5Tey3FClHpUmNVm1wYp6cJ1l%2BDyp8kYRWKccWZdqvgXH86zFKeVp0OJV2u%2BbVoPuVpA%2BgvtwK6hN%2BvhmZbpa2oL1HDZXUwTy5PTxqcZAHq9r9i7hyd2XfokdHk7zluLePWa5ibbeDp6EGupTPB0E9xf7Q6P57XHPkSc%2BH3xUfpCgPsZUCCpLk9w%2B5%2BBPlYjaAyHLceHAzFcJ4G4cySGrHd%2FAx9CE50QWMN%2F0%2BlbfTBXtVV1t2p%2FUta64GJ7PYZFchX0LteTiCcBUjwrMmziaL1QLteIXw4RJk2EVkKkCpuZUv9%2FeEibg1dtbydWx%2BlDDHYJ7uRjMXyqRPraNrctCPlEu0FiiEg%2FMIrK1c8GOqUBAtirbijavQeygRXuCpsQG7SDFX1%2FrH9ZEKb5GWgsBWSrffD9nClvPx1QdIOGT3%2FfHLHaC%2BM6iqnIUFuYmuPc2qU66jMyzsMivlXiOfm8je02RIpqFAhkx3gEMHHrdhrU8KIsa32HangdAQs32XM5GHcnbCTa9Y4n0JZwDfWKUDuz6DUe8d3d2XbDxRxskKtbLjpGgFZgqxVgUjs6xnkHWwt63hrH&X-Amz-Signature=ec032fedb22a7782d52962dcdd2aab5676a368cf92850d40d1836303fcc8f822&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QGFMFS2Z%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035110Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIHO%2Bv5NWhICT2rq2H%2F5IBNc%2FrauXNS3j3CJ3u97LoqXgAiEA55rUlkrIC%2F8DMR7uT4KiMyk2Jtab82KS8p%2FAP7QCHmQq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDBg3hI%2FXQVBmU1mLASrcA6A9SrAs9tw1%2B9uZjA0qbPEgxTDqe2fp9dI8IZo6vQOHNDUfK%2BPnAWWLGeUxlrjD8iCXEazqbII89mF06qMbycILTBDngXkPdD%2BZhhVedcZIHoFXTCnNloqqbbg%2BtWdoXKDbTkLpZoaUKVzqyqfEXllPTny2lSAzRxQQmuD6AXoyg602%2BvUVS07CE1wrIhD%2BM3vUqwZSttXWwB4Pd40Ppgj6DS9A5ei7KjdgJ7zHnb4kHf2oSGkq%2BGwWAlmDI2CJ9CeBPeBrIQJCiYB2PwxRa8jUeXOGLGalHFKlz7WIwDe0LmbSTPTpHw9KOfuMHWSyd6b73BiV%2FpRZe2XNa3ZIvmYV3Ws%2B9JEAHJiLvGzA%2FIskD5v%2FGfEwNDUVoGZvTXKH43Z06zFXXVKkTLbvSKDUg2%2B36kxgAr3DH8gZfMCOfmUWY%2BNuSGds3cpYiTLBkazzJGpBkBuWkR7MgeFsm70TyaiQld5aW3QmYwCAl8tGm%2BJxoEGWM%2BwJYZTJIRZ3J%2BNRhRn9%2Bq7PWrj17CKOW0DNnG3%2FTZXxVlXe7Hus1t9rH9b4Kk8aVpsJnAycvCknY9oWqxhlxN9lKV9sZJt%2B6MzHYMnkX5CPT9PZ5KyiInilq5qAWA5njj9jt2%2BLwT3hMPLJ1c8GOqUBCFGVbH4kOiR7aA0I%2BMjr0P%2B4I9TtnK%2BbjsEEj9zc4izHzuyRtIG9ZB0DcdKOt4ZHtoypq1wj3yOSWWCvat83XFM88%2BeXtgD9%2FjYD5YAavmnZkCO9nEzqzMkEBnVOnekMT5oBiNyi2jICMYws7UJGd0393LIe1ZXG7rSsaWrs%2BqONbecVtFm8RU69xlRKL1I5IhEO8YDPkcX%2FwBd1aakRQ9cPgWaH&X-Amz-Signature=324e123fc28dbb68d6e5394b796c5d0cc96ddb094e55ed188cb5519d484727e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VSQQODFD%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035110Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJGMEQCIC22Rvq2US79atL2i7wFMTWNUNz9jagkMdr8MXJ9nh3gAiABFappinLXflLWwZkwoqh5VtmYOxfEcvlPAEeqjQrdzyr%2FAwg0EAAaDDYzNzQyMzE4MzgwNSIM1f8pJXZLBszcfnpTKtwDg0ntCK4TmU5N8%2BXg1O6uRzvDsUzt9E%2Bj4PMDaVuoiB%2FHY9Toz3jePf%2B2skB1ah4imdC%2BHdAExkN%2FUXyVQDIeJEer8dC1esfadv%2Bodq6zjOlLvxKY%2FoCgMc%2B%2FwxYDp%2BTfUJfXOal9661c1Le4Oskun21mdwFTDfMYTHMHb9gGAqyfFzyrjxJgaVteSrXNEm1RsuNHuivB5ZwuL3etbwwZr9tGLV0ydKdcCwArq7upnT9BGexMDqlPjWiuq0DE4gQbc391QRN2XGbwOKNqz9%2Fy6%2BllqZ9ciQrI2mYfyAe0J8vYofpp5tp2Fhze4MDOoVPJI77fuCQqHhmGicW0ZGQAC2xy8f5YXWnRGQikWSNpS0KFQSwpPKhO%2F%2Ba53ksbjNGGabesH%2FEzJJN1m2phVtsYOKclSP4UBjaT3alKiFeLPwg8%2BplFt01kHWnS7TYhJ7%2BTKKQKnqZiWZvmy4r7SxfmWsVZd7maaSM0QbvPq0qsscjmKhs3G7K3vSsxG0VbPGipqEtJZExGrgVqNy7Se2E1VLB4thymiLXQOE4Ubac8wk9N%2FQNuouZ4Tb7%2F1Ik1reK2rZySYoqsO5EQwo6SemC2fdUi3b7z%2BPtSjBD89oUTv8kJKHPmHtcK5Eiweegw%2F8vVzwY6pgFegrJuy0ERQjz%2BkGvBpMuaZAfMnCX6Go3XeArdwbzXY0d57cnYxKl16HXB5XtRZl7LUhpNVSpjtpv9LcI37qu2bVSqKerZ2wpz3fX6oUY8Qk0Gqfg3cNkHKMcpSm2ZKVHPOHwySNBKzbOlcWYzEC1bHEoRu4%2FmpOzUh9kThQ%2FyfiUbgAj2O1ktCKxvYT0abKfY9uwn6fPfQIzHZm1Gqb6JOfSbZM45&X-Amz-Signature=73e9a67a44e6ce0e70ed271aa3237d8afbc4cc184f7ea434390697558b99f27f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667WF4NQW3%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035110Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIGKedwVpILMRm2HRgc72iiSAKbWcyKYPLBQGkQRxwTOKAiEAyp5MJnFgdx3hRxToxkOFx4b495aVqABIas4KHoKAIIoq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDNWuaFJ%2F1oSjbV7kcCrcA7OGrIjum%2BvEwL4Y5mZ68zqXJP3E0lM4FzjLYewWRvGXH8MxfrPNnyfGx4RikSOKY2%2BxZ55a9b6hU%2BfHKdDLyytkCJHET6LBv67aQdNHxI%2BAjUr2%2Fz%2BW3Q8jWjYarjhCpcOXtc6SU0qd1Iq%2F%2B8nav4RQ0SJVkREK1pzkYwfSGZYoi6omCbhl8wHX%2Bc0qOvyhM3199DlSUjR0M4oTOjpzdO8%2FQb0Yi78h%2BoxbS%2F5eszyWfGAihnPn6tSl9%2FPKbhywZmtaALpTJSTrDYyw9yfyiNopdoh9BTv7wZsnRgCv%2FS9NkaGZhpLsk18KZZXUV%2B%2BW2oY3m4MUJrSvHlhWG0l7HoUM8nfx%2BvHayPnjK0SGHZ68pAf3UQgPXe%2BVKb8o0femfuoxXq4mrJJIiCta6cmoFb3lIlLpROd6czU6GtrU5y6V5xthTDhRfvYgW7HVxvxVLbUIax5Pevz9pZiGPGa%2FomN90Pn8aHkG%2F%2Bh3dPHoxGRSKSXN2roAti6lWc5LGvaS23QKp8Mm3XE240jfW7G7ZSb4MsNjPmXFdmxa0mYBAJV22K78h2d3Fp4bFlEZhYMCS9%2FO2%2FIvJJ5XltlBgmWLOGiRcW%2FRFFNqRPnVwlOoCfTVs1dTZR5%2BcwKIeZ8xMPrI1c8GOqUBMAq9UBIgHDoQch8fXWw9qW9GiM13tXLoaCDvR27xa9KZ2znAA71Ohq0QkbchnbNXqhqC9yVs3Ai7FQG13aK652iJxXA339%2FQankJ3d2XNnr9Id%2FtLVPTiaH2rXORIs%2BInhSIgs6i9x9O6Xmicwd83WVoZdhMNAEH%2BWbXQVXoHpeKIQkll5FB8KX7tgXXhAya5HMQxItKcVmPppLnk2fZa55vNl3D&X-Amz-Signature=bff6b56236285954ecea7baf5ba12577a9aac7eec9e5e2c03a5171ce8e06841d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466674MUFCL%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIQCZUS41b53Ujfv%2BWzh3EprPsJnIrweMzkeL5gOOAyBzWQIgWZKAE5nF6wXizBG6IcI9ytQawfrdnM96g4qBUSu0Figq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDItQQ4Tyi4o39jraaCrcA6pmSyAL7J%2FEXN45kqVd%2BUem28P5uq5MNHsWn%2FopJHhpFsRfKsM%2FF5uHGn7%2FMMo6JAuy7CAdChXKM8dEq0aY20uEmG67XcIdeg5ThuCpwktjqYIVhuX4HtntHCEaryjidD4nDTL4XLJ4nv7wa4k%2FY4oiZNfZE%2BYJJe%2BpfhINtZ%2FhjuhFhCseq67cvsMCDrGk%2FnRTEEYBkNjduJxO%2BSMy%2BOO1%2BQ%2F3ngtmxJZRMe5m6sjvK4Ws41D7Eaoo4L7orWTotKsz12Y3pMAm3tPRAfAcNb7KLxjMDuF3G2AE9e1tSx26BkVVeiWXTS%2BftbTblBxKltZATtiwMR%2FI6IKzZ22kOjKQuJ10f9gaSwlNB2CgwMZBT49o7O3cJekcp72%2FbhVLsa31XVhwtQ31XdCI6R1OGM0Ma2y6A9chAvmRt3J01LmjDVX6mcRgOaEtx3tJZtyuWxXzUpuLsRpuLpehIC7pGEIT2CmE%2BBF1OlEe7%2BRBNOnnzWFxbf%2B6QTG3VDdmo0K02wkaFp2z1%2FHELoNIiS2Kt6zSEMbvjMCvWuyDMn9Kdp6YWtyQBB9svbeBJnL4vFFon7Un0n1vw7SfaFFcySpP0Qm4g83yp4sAxyJAR77Q%2BJWivD0fpHa2ZIaVL5DZMO3J1c8GOqUBJgGRgNC8bRrnsQjSIGWPYA2gyGi%2BEr4DmO4MJE3eGg%2F03unDFDgld6gJd%2B9iF8YbbkdA%2B8irhV%2FmF7cnDb6Fwg2Jga3A6rUjQUpkK6WjvBtfvRbIX4qmMXRhoglM9nyNXUWgDR%2BUbjnKuTE92CpC%2BEu20tTazDCLDTh123FgKk0wx2fl7QlvwcBQFy7a9nwascoYfpdRdvM7KThcOOT43VmvVN83&X-Amz-Signature=0d1e09acaf1516ec68fbccb1a7fa46e36f95ea9fe23ca6922758219a22e810d2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466674MUFCL%2F20260502%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260502T035047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLXdlc3QtMiJHMEUCIQCZUS41b53Ujfv%2BWzh3EprPsJnIrweMzkeL5gOOAyBzWQIgWZKAE5nF6wXizBG6IcI9ytQawfrdnM96g4qBUSu0Figq%2FwMINBAAGgw2Mzc0MjMxODM4MDUiDItQQ4Tyi4o39jraaCrcA6pmSyAL7J%2FEXN45kqVd%2BUem28P5uq5MNHsWn%2FopJHhpFsRfKsM%2FF5uHGn7%2FMMo6JAuy7CAdChXKM8dEq0aY20uEmG67XcIdeg5ThuCpwktjqYIVhuX4HtntHCEaryjidD4nDTL4XLJ4nv7wa4k%2FY4oiZNfZE%2BYJJe%2BpfhINtZ%2FhjuhFhCseq67cvsMCDrGk%2FnRTEEYBkNjduJxO%2BSMy%2BOO1%2BQ%2F3ngtmxJZRMe5m6sjvK4Ws41D7Eaoo4L7orWTotKsz12Y3pMAm3tPRAfAcNb7KLxjMDuF3G2AE9e1tSx26BkVVeiWXTS%2BftbTblBxKltZATtiwMR%2FI6IKzZ22kOjKQuJ10f9gaSwlNB2CgwMZBT49o7O3cJekcp72%2FbhVLsa31XVhwtQ31XdCI6R1OGM0Ma2y6A9chAvmRt3J01LmjDVX6mcRgOaEtx3tJZtyuWxXzUpuLsRpuLpehIC7pGEIT2CmE%2BBF1OlEe7%2BRBNOnnzWFxbf%2B6QTG3VDdmo0K02wkaFp2z1%2FHELoNIiS2Kt6zSEMbvjMCvWuyDMn9Kdp6YWtyQBB9svbeBJnL4vFFon7Un0n1vw7SfaFFcySpP0Qm4g83yp4sAxyJAR77Q%2BJWivD0fpHa2ZIaVL5DZMO3J1c8GOqUBJgGRgNC8bRrnsQjSIGWPYA2gyGi%2BEr4DmO4MJE3eGg%2F03unDFDgld6gJd%2B9iF8YbbkdA%2B8irhV%2FmF7cnDb6Fwg2Jga3A6rUjQUpkK6WjvBtfvRbIX4qmMXRhoglM9nyNXUWgDR%2BUbjnKuTE92CpC%2BEu20tTazDCLDTh123FgKk0wx2fl7QlvwcBQFy7a9nwascoYfpdRdvM7KThcOOT43VmvVN83&X-Amz-Signature=d4b761aa8785d94d9fbaf750e023a873700e974547dcea8fcb827a65ae42c2ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

