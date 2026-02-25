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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R7RZ3D5C%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031642Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQDud7zNUI9qXfE1E2EDjBUIH%2B5f18fmSFUNXbRQvgN1CwIhAKa6xojotjy4nBQlrMuRmanLcQfPH8b02cifBHSKmRKyKv8DCAIQABoMNjM3NDIzMTgzODA1IgxSyjE9JXIbiwnLiKQq3APU%2F%2FdN45URxrE170l0uzbZA1Nnge2oIMrJMIHgl6mm9GIdDWLMrc9kyu66X6qsW0acfFRy8n3EZt8CJCMppHrInYfsHOsUa%2FTlwfm82LoFxAodigKlzFECe8Zsw2OnCCcc%2B%2FDa0uRj%2B%2BPj9Khgn4zi5QNEn2nbmumE8Tmi4Db34LxNUef9zd15Pfb%2Fj4D%2BrwvmSrfJcuRFK%2B3LidtWqGmFxSMYm05RaIUwjfZ%2FMpcCiRxliyQwkaBigJOAR0JnhtXO73Kal%2BeScin%2BOudUhToFqDMVBE1o9pL%2Bi8wXX0D0XRq%2FyoM4BelK55YKirYis3%2FohYejzf5iQoI65HREBYBVytMokkZ%2B%2BXCJw59n5y7UgdXjWuPZgmzPFMURq3TIAoNTrI7fw%2B1tZ1rc2ryIogcc54U0ADHby7vHrLkINQCxoj3JPU81BwVDr6ePAdm%2BE2%2BdtIf4rvg05abfJ9Y7PFfjv4xb%2FYFvJpoiUZMOWrwrxrQMBkG%2F1DpRATH4ExpOsS0ycWoVLmSwyMlQJ4ot4ViaZOe64HXU4%2FfUWsOUOY00MKL3n3BeSrTd7sWqRn5Xq0PDEFfoWT1%2FStNn64ro96D3beqESWsEb7MKo2KiKZySdKjPNdXQiH5yClPWcjCLhPnMBjqkAfgrt%2Fw04rrlEbXphNv4YiwA122bYR5m9Scfet%2Fh0qd50l8ukzfZf426b2kxKXzlNkjBVA8CMJz3Vxtqtj7hSq8fCuxWwK5wyNLiCse09S7Ok2T6kNulGPNZWhNXo1BlaY7ffmdtsCJwcD7D1g7EgTF%2Be5XOvvjXEsWYhhTeuxAHLqc6H3N4JEEHph3ff8RSfOO%2FnysidzT6q1LExhJvBOZ7p3Fx&X-Amz-Signature=1ae44fb4b297e2dff445a14b975f92542d67596be1fcb2c2d822626b57dd1d49&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R7RZ3D5C%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031642Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQDud7zNUI9qXfE1E2EDjBUIH%2B5f18fmSFUNXbRQvgN1CwIhAKa6xojotjy4nBQlrMuRmanLcQfPH8b02cifBHSKmRKyKv8DCAIQABoMNjM3NDIzMTgzODA1IgxSyjE9JXIbiwnLiKQq3APU%2F%2FdN45URxrE170l0uzbZA1Nnge2oIMrJMIHgl6mm9GIdDWLMrc9kyu66X6qsW0acfFRy8n3EZt8CJCMppHrInYfsHOsUa%2FTlwfm82LoFxAodigKlzFECe8Zsw2OnCCcc%2B%2FDa0uRj%2B%2BPj9Khgn4zi5QNEn2nbmumE8Tmi4Db34LxNUef9zd15Pfb%2Fj4D%2BrwvmSrfJcuRFK%2B3LidtWqGmFxSMYm05RaIUwjfZ%2FMpcCiRxliyQwkaBigJOAR0JnhtXO73Kal%2BeScin%2BOudUhToFqDMVBE1o9pL%2Bi8wXX0D0XRq%2FyoM4BelK55YKirYis3%2FohYejzf5iQoI65HREBYBVytMokkZ%2B%2BXCJw59n5y7UgdXjWuPZgmzPFMURq3TIAoNTrI7fw%2B1tZ1rc2ryIogcc54U0ADHby7vHrLkINQCxoj3JPU81BwVDr6ePAdm%2BE2%2BdtIf4rvg05abfJ9Y7PFfjv4xb%2FYFvJpoiUZMOWrwrxrQMBkG%2F1DpRATH4ExpOsS0ycWoVLmSwyMlQJ4ot4ViaZOe64HXU4%2FfUWsOUOY00MKL3n3BeSrTd7sWqRn5Xq0PDEFfoWT1%2FStNn64ro96D3beqESWsEb7MKo2KiKZySdKjPNdXQiH5yClPWcjCLhPnMBjqkAfgrt%2Fw04rrlEbXphNv4YiwA122bYR5m9Scfet%2Fh0qd50l8ukzfZf426b2kxKXzlNkjBVA8CMJz3Vxtqtj7hSq8fCuxWwK5wyNLiCse09S7Ok2T6kNulGPNZWhNXo1BlaY7ffmdtsCJwcD7D1g7EgTF%2Be5XOvvjXEsWYhhTeuxAHLqc6H3N4JEEHph3ff8RSfOO%2FnysidzT6q1LExhJvBOZ7p3Fx&X-Amz-Signature=2adb7985226c645f5e96ecd0d5a8c6b4aba887a11d5b1d9033ac9d3594c4e059&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R7RZ3D5C%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031642Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQDud7zNUI9qXfE1E2EDjBUIH%2B5f18fmSFUNXbRQvgN1CwIhAKa6xojotjy4nBQlrMuRmanLcQfPH8b02cifBHSKmRKyKv8DCAIQABoMNjM3NDIzMTgzODA1IgxSyjE9JXIbiwnLiKQq3APU%2F%2FdN45URxrE170l0uzbZA1Nnge2oIMrJMIHgl6mm9GIdDWLMrc9kyu66X6qsW0acfFRy8n3EZt8CJCMppHrInYfsHOsUa%2FTlwfm82LoFxAodigKlzFECe8Zsw2OnCCcc%2B%2FDa0uRj%2B%2BPj9Khgn4zi5QNEn2nbmumE8Tmi4Db34LxNUef9zd15Pfb%2Fj4D%2BrwvmSrfJcuRFK%2B3LidtWqGmFxSMYm05RaIUwjfZ%2FMpcCiRxliyQwkaBigJOAR0JnhtXO73Kal%2BeScin%2BOudUhToFqDMVBE1o9pL%2Bi8wXX0D0XRq%2FyoM4BelK55YKirYis3%2FohYejzf5iQoI65HREBYBVytMokkZ%2B%2BXCJw59n5y7UgdXjWuPZgmzPFMURq3TIAoNTrI7fw%2B1tZ1rc2ryIogcc54U0ADHby7vHrLkINQCxoj3JPU81BwVDr6ePAdm%2BE2%2BdtIf4rvg05abfJ9Y7PFfjv4xb%2FYFvJpoiUZMOWrwrxrQMBkG%2F1DpRATH4ExpOsS0ycWoVLmSwyMlQJ4ot4ViaZOe64HXU4%2FfUWsOUOY00MKL3n3BeSrTd7sWqRn5Xq0PDEFfoWT1%2FStNn64ro96D3beqESWsEb7MKo2KiKZySdKjPNdXQiH5yClPWcjCLhPnMBjqkAfgrt%2Fw04rrlEbXphNv4YiwA122bYR5m9Scfet%2Fh0qd50l8ukzfZf426b2kxKXzlNkjBVA8CMJz3Vxtqtj7hSq8fCuxWwK5wyNLiCse09S7Ok2T6kNulGPNZWhNXo1BlaY7ffmdtsCJwcD7D1g7EgTF%2Be5XOvvjXEsWYhhTeuxAHLqc6H3N4JEEHph3ff8RSfOO%2FnysidzT6q1LExhJvBOZ7p3Fx&X-Amz-Signature=26a9a7a98f65a0e8b33baf2aa215e205373ed4116fef91390b75f65685dd8d42&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R7RZ3D5C%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031642Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQDud7zNUI9qXfE1E2EDjBUIH%2B5f18fmSFUNXbRQvgN1CwIhAKa6xojotjy4nBQlrMuRmanLcQfPH8b02cifBHSKmRKyKv8DCAIQABoMNjM3NDIzMTgzODA1IgxSyjE9JXIbiwnLiKQq3APU%2F%2FdN45URxrE170l0uzbZA1Nnge2oIMrJMIHgl6mm9GIdDWLMrc9kyu66X6qsW0acfFRy8n3EZt8CJCMppHrInYfsHOsUa%2FTlwfm82LoFxAodigKlzFECe8Zsw2OnCCcc%2B%2FDa0uRj%2B%2BPj9Khgn4zi5QNEn2nbmumE8Tmi4Db34LxNUef9zd15Pfb%2Fj4D%2BrwvmSrfJcuRFK%2B3LidtWqGmFxSMYm05RaIUwjfZ%2FMpcCiRxliyQwkaBigJOAR0JnhtXO73Kal%2BeScin%2BOudUhToFqDMVBE1o9pL%2Bi8wXX0D0XRq%2FyoM4BelK55YKirYis3%2FohYejzf5iQoI65HREBYBVytMokkZ%2B%2BXCJw59n5y7UgdXjWuPZgmzPFMURq3TIAoNTrI7fw%2B1tZ1rc2ryIogcc54U0ADHby7vHrLkINQCxoj3JPU81BwVDr6ePAdm%2BE2%2BdtIf4rvg05abfJ9Y7PFfjv4xb%2FYFvJpoiUZMOWrwrxrQMBkG%2F1DpRATH4ExpOsS0ycWoVLmSwyMlQJ4ot4ViaZOe64HXU4%2FfUWsOUOY00MKL3n3BeSrTd7sWqRn5Xq0PDEFfoWT1%2FStNn64ro96D3beqESWsEb7MKo2KiKZySdKjPNdXQiH5yClPWcjCLhPnMBjqkAfgrt%2Fw04rrlEbXphNv4YiwA122bYR5m9Scfet%2Fh0qd50l8ukzfZf426b2kxKXzlNkjBVA8CMJz3Vxtqtj7hSq8fCuxWwK5wyNLiCse09S7Ok2T6kNulGPNZWhNXo1BlaY7ffmdtsCJwcD7D1g7EgTF%2Be5XOvvjXEsWYhhTeuxAHLqc6H3N4JEEHph3ff8RSfOO%2FnysidzT6q1LExhJvBOZ7p3Fx&X-Amz-Signature=c35264ece1cd84e0d99f40b7fb4dfad05b6183f52f1e8bee780890d58d57bc0f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662675V4J7%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031654Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQCPdKBPCXvi%2Fg%2Bq88v0JZcK%2BE0TNJstStVmVV1qIW%2FkvwIgb6RdaaH8mF7zAWMs1S9G%2BknULoMaV5jnTw%2FSYauBJ3cq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDGdIqfDEccSlSwJ9pSrcA3O86zMiZ5NRww3yKWa1TE19uABWLNMO9SbFdgzCf36wn966Bv2BEGtM1N6hF5ZI2IA9fgQPqZ6YyVBskTEd%2B7dTgSInpVd%2B%2FBoLIHXUv2gb3D43s17Xt1%2F70V1xQ2Pnys56rJIEK6nVNFAracyIc7As%2Fm6WoL9vaHkwZtQIIYc1CGK8gHNRWK1X4EExoPKLrFrNPzPFEbZA5b0JoQVG%2BQKou7nXusnPWLGuqEiQcK9iEqNS0C6K2xScg5QtwOhRbbV23fJbS7%2FYDu63nFzP8KrXCwUw0pdZy30lyNzgzeHXJMuyy9ajhSV1xrc7%2B8G%2BcubEcD31uAGFMKoPNBLXF10BW8r3KDIH9hsMdN6dQtR30rsW7TGm2OpNaLHCkzAjJLolBvluKDa3qYLSt2vfvMhsRfU8HRjgQ3TFBgUo4ZArMVzt4iT0q919F0VJTBlUHg3lVFuAsQgypAIu%2BKFcsdY36iBPoMItX7%2B3v9B0x1KChRxyGdil0KcD2%2BXg2wNhl4upK8CV0OHt8rpQ%2BCmAMP53sj9NXB7E5Hz%2BpAK91BKpJ6C%2F0x4AwQqKkVhiBskScAjpBroAwygo7Vy1b18nI4Nma%2FX371PwmmPJxFdGBreLuQsFYyXaF4Vd8NpBMLKE%2BcwGOqUBBpucCLITBcmBXwM%2F1IGlJbO1sgCogvuZy6qmGLOKw9336sEbh1Q%2F4J9s2%2B90IlOE08TZXH96n4EEBQqLTkM6kWivnVuKYUJ%2BTiYApYNtF1mJd6BAEQApYBE68Viy2MqhrnDqsUh86F6jvhDOdnPtE%2F%2FPs0U9UZVRE6PdO7VZoP0Rs479T70MXRAehf8MqYIUwhP7kIvITCGEJ6zqXBBkamR2ebPl&X-Amz-Signature=5f55b95e3c3aa285645688965588e80a6d38d591a90c2d27756760f12905ae08&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VQLDH236%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031713Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIB%2B90Umzb60P5Ul5uPEJTW1fU019AGK5Bk4uSkZeVRqLAiEA7sfqNEHO%2BwNykb%2B6Xb0B3wv3sdgZecs1kSS4wJHkRvEq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDHuKp573Ub7iGPVE1yrcA16kMoyjipjIQLJovkmqb0AqpZ2pM663K1gRGaBNB0Cr1IV7jQCBetc%2B99ZvM9jHCZBd4MZPnlVwLdsJsl%2BlM4Dsy6Q4epBHVTk9RamxXz9ZnBOM5u4Pf2ErvzIDN7aN9J6hv0asUOYrnJSyelGj4ear%2Bmqhek%2F9tGbSq3vdvdyUyuaedAJ4aMDSXEnH3w%2FHeF6t4Mrc8hqNvXRIcbYyQ6F5%2Fvf6xAyX4ZXr2AniQW0CCvaqu5xbfGFp830B4qSZ4dh6QFGVNLqJajFTHYVKpf4n83NVcrTQ6qo%2FICStl8tusflH%2B0Vd5DwK6nN4l%2BvDFxwwHJVNCj9980zS7S3ZD5jKg5CyJysJGuXw5ARg%2BsFBZXIQCjR%2F%2FY%2FDCtZs8fc8LVEbwWGtASNWeU48PhxHwUhNE2RJbaXrtVA5v7oZRG0mlaJc29uKy90I7KVxNG5xjnJhE65NyKigHMvnYE%2BRaEIU1z4UyHUgEsHc7ihh6gUitSpYwTpVtwaJbYbXJ2EykjLL6BZHcUO5oC8g1JN2PL%2F2lgQsZB6sOJ7GgT3UL6Zg4q%2BiXioE4UlKb5CI31rXDoP03CdBFwXmw1ytcRYjHfvpX6pGWlnUhsYLlb2qta2lC0yAIrfbZCauIUP3MJ%2BD%2BcwGOqUBnHb0PRa9MFsOvzK5VjV7opazsvChpj9%2F3UJY6hWWYqzBtJSjTW9ohLogVc7cWIUF62CwyEQIGxN0HpARlNxyabsAAS5zH8gCst1hLd1pVBeHMGaO%2BQ9btH%2BZfsHyD7kt1GmBwcUbLms3hv82g5%2BVG0DVTHPjo8cbssPwS1bN9uw0kT1UdCYM6v7ZysXhkHi2swEuDp8hpnqF1RJ%2FjsVantquyzMV&X-Amz-Signature=93111b26c380745c8fb8dc35c8d06bebb843bec94c7a67ed7fd158158669f875&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46653G534ES%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031717Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQD%2BPUNd%2Bsj5qvxYA6KT0bqQdKmZcEGTIjQRqLAJEoluIgIgAwB5onkKxVi0Ci1UW2tnA2yBcaWyxw9TPTE2tZaV9T0q%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDPFf4owiJRpmcm%2BqZyrcAxzZBj7HNSHVQMvx%2FM3vH9PZrnwA5A7bdOM90KJuYb2m9h%2BZpUDSaDWmOCypj%2BB%2BtQypaeHhxYNIHmopuD17prC9UqD0IpAyTZ3nlJVsCnTlotTkifQUWNkSaPo4aaAWHsMN%2FCD2Hns5aAo%2BZvn2cFT6jQ7Dl%2BOkaA4Bkwvjw1z7XPHsByQWPEjjR90WVyO4q7jE8RIlm75sK%2F%2F%2FrQau8U32GF7sVbETwonMjfkMeDyN5xAbfIN%2Bne0V35N38aBMXuzf5DOvvLh3XyC%2Fi5zj55DSJOs4dFYwIk4IZHQXcfgkPzQTyvV%2BuL26zGNVaWIhvLLH2aROOfTWEMeu98ymPZZihPKq1jgdsmteww8vDwuS7V1CRwsgp4y%2FHd6P2LSizkW9RUqkinIFgeXvdHwrb5qv36IfIyRAEwLRUglzWp9vy6xlh26GDWJOkx2XbcRxihCVOhTyf8bZmBCz%2FjG2xoqDXe%2B1SKtoJyDIKTpzMYwfOc%2BsXYg%2BOiNpjMrrH%2FggVaP3qkgXg1t1uJ2W7P3wICa8%2BSPaF0%2BLo7M7CK%2BxmCSpcspzSDyMEZby1V%2BNHbmpLLwU2JDnBgyn%2B%2FGD%2FnR6NzFD9JWsyZoJh1bod6jkKslXsjcw1bd8yxSjyLv2MI6E%2BcwGOqUBm2y7Fee7upKKGvlbcvTe4TpY2LnICFKge4VgveproE%2BkE8GO4ObDpA8aZReIzpu6SatuAreQWRvrUBVOjCBa9rDAhs%2BL9N2UebZWdnWTgtRbfJNaEPhPC1G%2BNhB0%2FzKiyxC56u%2BBBG4qge2Igj4Kc%2F6AK7dVlxQryLGghpViAvlzxnkQ7YQUq%2BVOSo%2Bq8LRujPTQwsH4yhKqBibKfsvlFfCRHCeP&X-Amz-Signature=2353a928cbca4850e17d7e3b6e1b17ec59c81c58263de663eee079d0b08f70ae&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666AUNVZUM%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031717Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIGYCsmDQLO5i0ZK0qk3X11qa5w7OH5CKq8EGXcNehzIXAiEAwF57MamVF%2FOfiAoKrEQjZyH4JOutc0EXzeF68I2RZ6oq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDL%2BznJDS35yj%2BcWBSyrcA6I6467AD3J7CDgYA2b8RauzxFprH9HnzGMjyDkw33KiopGhJoPym5dL2MsCZgxEl3Y6jbx8yNMLxkt61riTPei0jjIrKvLFh5ELIHkwdPUX9R7u6Bjswb1xgCMXCb8GUi6FJFhl7hFF8r16yDk4lqbuC7WOKbGyt0kyFf1RWRhYorGS3DJIbW1iYfa0FKKjdYyTbooXXYSwpUb4Jshmw4A7VPD9J5CoSEZKR6meZN9PN0WyxWrXZiA2e0szujAMBQFqN4xYf5BhPedBTnpaTlJq38tottPPOKbfnBTO4WkL7zg%2FAzVfcgDMsYXf3ro3BBLhZvPcocYL%2FAm8QibVKbOmm9Mp6InabDASOdh3e4AoVmwBfZ6DOD9fnSNDnUYJKhFEPfH0s2zlC5QuDXnkzeRvM56AI803qBCZdbuSdu4sYdXRquxyg8Nm3OKoUGwuccpngZP%2BgDEhB0R51r6UrgsjLiZxbuGgR9d6W0%2Fead3xtLdoPt8SL7y%2FWqlSotuIJZioWqIbyF6nxgQq8S6Uq%2FVvbODB8JrnYcJFDDo%2FPhA7rGiEEFh%2FqeTUnHI5mzBtG4X1ZUqJK6Mjips32v7cAn2GSyOqZEqB6LZILkCKtpifK84lA8ABGHBUkTX3MKGE%2BcwGOqUBCG1%2FT4iK0ugA8%2BOJ5PKcHHRhxvJYm7hful9CJKMlRMeZphF8wdgjp%2Bw6Hk2MLbjBrndj8wAasOyn71KL6wBPaXdxW6AjNNib2Kb46PWJCLOVdK%2B11GlmLWqy%2Fm6W3V1BZp27y%2FtES8Ew1MDsys%2FNG64hR490FjO7wXh6fi8qtaZhGH9vhH7nE4TOF4SzXszym399ut%2BBNGfPLjAMncjn57r0CrRw&X-Amz-Signature=fc6b2c438170a29f054a9e1a8343fe90a4ecee1c322178f64ef8cf92ccb11d94&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R7RZ3D5C%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031642Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQDud7zNUI9qXfE1E2EDjBUIH%2B5f18fmSFUNXbRQvgN1CwIhAKa6xojotjy4nBQlrMuRmanLcQfPH8b02cifBHSKmRKyKv8DCAIQABoMNjM3NDIzMTgzODA1IgxSyjE9JXIbiwnLiKQq3APU%2F%2FdN45URxrE170l0uzbZA1Nnge2oIMrJMIHgl6mm9GIdDWLMrc9kyu66X6qsW0acfFRy8n3EZt8CJCMppHrInYfsHOsUa%2FTlwfm82LoFxAodigKlzFECe8Zsw2OnCCcc%2B%2FDa0uRj%2B%2BPj9Khgn4zi5QNEn2nbmumE8Tmi4Db34LxNUef9zd15Pfb%2Fj4D%2BrwvmSrfJcuRFK%2B3LidtWqGmFxSMYm05RaIUwjfZ%2FMpcCiRxliyQwkaBigJOAR0JnhtXO73Kal%2BeScin%2BOudUhToFqDMVBE1o9pL%2Bi8wXX0D0XRq%2FyoM4BelK55YKirYis3%2FohYejzf5iQoI65HREBYBVytMokkZ%2B%2BXCJw59n5y7UgdXjWuPZgmzPFMURq3TIAoNTrI7fw%2B1tZ1rc2ryIogcc54U0ADHby7vHrLkINQCxoj3JPU81BwVDr6ePAdm%2BE2%2BdtIf4rvg05abfJ9Y7PFfjv4xb%2FYFvJpoiUZMOWrwrxrQMBkG%2F1DpRATH4ExpOsS0ycWoVLmSwyMlQJ4ot4ViaZOe64HXU4%2FfUWsOUOY00MKL3n3BeSrTd7sWqRn5Xq0PDEFfoWT1%2FStNn64ro96D3beqESWsEb7MKo2KiKZySdKjPNdXQiH5yClPWcjCLhPnMBjqkAfgrt%2Fw04rrlEbXphNv4YiwA122bYR5m9Scfet%2Fh0qd50l8ukzfZf426b2kxKXzlNkjBVA8CMJz3Vxtqtj7hSq8fCuxWwK5wyNLiCse09S7Ok2T6kNulGPNZWhNXo1BlaY7ffmdtsCJwcD7D1g7EgTF%2Be5XOvvjXEsWYhhTeuxAHLqc6H3N4JEEHph3ff8RSfOO%2FnysidzT6q1LExhJvBOZ7p3Fx&X-Amz-Signature=16d0e1ec9f6822a25c6f72f5248fea3f89feb820ce77b5881d5c35906e691d2b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R7RZ3D5C%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031643Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQDud7zNUI9qXfE1E2EDjBUIH%2B5f18fmSFUNXbRQvgN1CwIhAKa6xojotjy4nBQlrMuRmanLcQfPH8b02cifBHSKmRKyKv8DCAIQABoMNjM3NDIzMTgzODA1IgxSyjE9JXIbiwnLiKQq3APU%2F%2FdN45URxrE170l0uzbZA1Nnge2oIMrJMIHgl6mm9GIdDWLMrc9kyu66X6qsW0acfFRy8n3EZt8CJCMppHrInYfsHOsUa%2FTlwfm82LoFxAodigKlzFECe8Zsw2OnCCcc%2B%2FDa0uRj%2B%2BPj9Khgn4zi5QNEn2nbmumE8Tmi4Db34LxNUef9zd15Pfb%2Fj4D%2BrwvmSrfJcuRFK%2B3LidtWqGmFxSMYm05RaIUwjfZ%2FMpcCiRxliyQwkaBigJOAR0JnhtXO73Kal%2BeScin%2BOudUhToFqDMVBE1o9pL%2Bi8wXX0D0XRq%2FyoM4BelK55YKirYis3%2FohYejzf5iQoI65HREBYBVytMokkZ%2B%2BXCJw59n5y7UgdXjWuPZgmzPFMURq3TIAoNTrI7fw%2B1tZ1rc2ryIogcc54U0ADHby7vHrLkINQCxoj3JPU81BwVDr6ePAdm%2BE2%2BdtIf4rvg05abfJ9Y7PFfjv4xb%2FYFvJpoiUZMOWrwrxrQMBkG%2F1DpRATH4ExpOsS0ycWoVLmSwyMlQJ4ot4ViaZOe64HXU4%2FfUWsOUOY00MKL3n3BeSrTd7sWqRn5Xq0PDEFfoWT1%2FStNn64ro96D3beqESWsEb7MKo2KiKZySdKjPNdXQiH5yClPWcjCLhPnMBjqkAfgrt%2Fw04rrlEbXphNv4YiwA122bYR5m9Scfet%2Fh0qd50l8ukzfZf426b2kxKXzlNkjBVA8CMJz3Vxtqtj7hSq8fCuxWwK5wyNLiCse09S7Ok2T6kNulGPNZWhNXo1BlaY7ffmdtsCJwcD7D1g7EgTF%2Be5XOvvjXEsWYhhTeuxAHLqc6H3N4JEEHph3ff8RSfOO%2FnysidzT6q1LExhJvBOZ7p3Fx&X-Amz-Signature=b32dc734385641dda5e99c191a490e443e398f3362e26b464701c90b203ec682&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46656MNOR4D%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031726Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIEwb7pcqLNKvhN0bpExnp7%2BYfSx79HqWXqXTAPJetMIEAiAaaipsuBg0xxU%2F45Oa%2BmFVXte7%2FhZA5NUVIid6kJUi7Cr%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMoShMQn1tTYAHyoVFKtwDe%2Byhw8js1BlMTutBMptN8n3YlZokWeb3YCxyj9GbJ4EezR4JfjG9orZZf%2BucbRaTlG2Vb8lk2LNSUYOoyZcX9bv3MQNDnDkg3vILAmw5%2BmCqNSfrZuuPF1pg2G2sB6rTm2FG4v1PfHGehMH4lefYWCLUmBeDYJ6BLv3OUAnOWIR98Is0dZbWGSPTh58wnz1uB%2B1ND3Sq54hvfFTSilSOCpr%2BVCBOJDEDILw%2BHbl8CdQHTF2b77rnjxgnSjPw4ih6zEcWkHt5t6NgxoWVP%2Bz88Qt55l75kvpXXQndN84PBZgE9jOTznrWhsatqmU5GdBZHno9HFCCkid7xB9Ycztk%2BZ9jXwKgnuYZnJx6Wmg6MTBM7lGHcCzFNWmAe1IK%2B70G87Yxth6GdBY7gQ7m1GW1wwU9ya9KRY0GvNAEEY9rEDNZxkWcIcdqE6vTj4g96Mbw76QLecLX2wwSxpZcx2uM2UGKG7NmGonJqLyZXK5mPs16ciNLN7fmIu4SswJZF4trSKtu4R9V%2BOxmJSdHh7RFw6PAJ%2Bx9FctdnlzNCDFpUnJtgcxqcaa3JDFByzUgtPFG7AIlS7iloy%2FPOylkEQFnEX5DnG%2F7q6G0ZjPmEayvHFBEbpmNy4DF4LOS6uYw4YT5zAY6pgHk7G7WhCnmMnE1YkvCSE17RQRZJLOPxDhEKYLnEWcqpmanPdy9EjzIF7LYBlyFo849cMvThUOo70BPb7oUXWN8C4Xbr%2FRvR3k8VviPgcppiHVyfRNRdFf%2FhEjBqaAQk%2FSvfoWmOdbelZomqShqwjPDGu6r9%2Fa6KecUXi3M8flUFDcdXrwfru8YQMOCsol20G8uvEkmt5j61xiLy8KIjmNkXeUgz5w7&X-Amz-Signature=7b9842772451f0ef8a61a3c464b73dd80ca9629fb74cb77394f3260b3152daa4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R7RZ3D5C%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031643Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQDud7zNUI9qXfE1E2EDjBUIH%2B5f18fmSFUNXbRQvgN1CwIhAKa6xojotjy4nBQlrMuRmanLcQfPH8b02cifBHSKmRKyKv8DCAIQABoMNjM3NDIzMTgzODA1IgxSyjE9JXIbiwnLiKQq3APU%2F%2FdN45URxrE170l0uzbZA1Nnge2oIMrJMIHgl6mm9GIdDWLMrc9kyu66X6qsW0acfFRy8n3EZt8CJCMppHrInYfsHOsUa%2FTlwfm82LoFxAodigKlzFECe8Zsw2OnCCcc%2B%2FDa0uRj%2B%2BPj9Khgn4zi5QNEn2nbmumE8Tmi4Db34LxNUef9zd15Pfb%2Fj4D%2BrwvmSrfJcuRFK%2B3LidtWqGmFxSMYm05RaIUwjfZ%2FMpcCiRxliyQwkaBigJOAR0JnhtXO73Kal%2BeScin%2BOudUhToFqDMVBE1o9pL%2Bi8wXX0D0XRq%2FyoM4BelK55YKirYis3%2FohYejzf5iQoI65HREBYBVytMokkZ%2B%2BXCJw59n5y7UgdXjWuPZgmzPFMURq3TIAoNTrI7fw%2B1tZ1rc2ryIogcc54U0ADHby7vHrLkINQCxoj3JPU81BwVDr6ePAdm%2BE2%2BdtIf4rvg05abfJ9Y7PFfjv4xb%2FYFvJpoiUZMOWrwrxrQMBkG%2F1DpRATH4ExpOsS0ycWoVLmSwyMlQJ4ot4ViaZOe64HXU4%2FfUWsOUOY00MKL3n3BeSrTd7sWqRn5Xq0PDEFfoWT1%2FStNn64ro96D3beqESWsEb7MKo2KiKZySdKjPNdXQiH5yClPWcjCLhPnMBjqkAfgrt%2Fw04rrlEbXphNv4YiwA122bYR5m9Scfet%2Fh0qd50l8ukzfZf426b2kxKXzlNkjBVA8CMJz3Vxtqtj7hSq8fCuxWwK5wyNLiCse09S7Ok2T6kNulGPNZWhNXo1BlaY7ffmdtsCJwcD7D1g7EgTF%2Be5XOvvjXEsWYhhTeuxAHLqc6H3N4JEEHph3ff8RSfOO%2FnysidzT6q1LExhJvBOZ7p3Fx&X-Amz-Signature=a82ce23e6dbcc8e3570328cc9617edaf2a89881a75849d4e11d4f66763f44979&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IC5QYQ5%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031727Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQChnFBc9MjaYGsiMakuqlsN%2BFYVdNPFdHsVjoWKWqlpZgIhAMX1c1ORRYWIsRvNy6soph4cS3CS9%2F5hoJbMfkgP5nv1Kv8DCAIQABoMNjM3NDIzMTgzODA1IgyDetQW7LutVzfEkp8q3ANfkNqhIR3ZspRZRFd%2F5i%2Bo3C2uY3eP5E0T%2BK5iKktlEIrVBC97NSHr4qYL0ZWsgtpbOva%2FFixLkQi%2BTQ6negju6efV78H8B%2F2d64x7PCBaZefUWcY9rEbs72JhFrAlKEX4QP59iUZqyUfgL83mryyUQ7X0Jfi5Zpl8eEpljy1d2KiDmvsVqY66BzXLNCQOScJ5ENdGdztg9Iysc4edTSXo33vvdbJa%2FHbB7a8hC3H%2BkXZkH9PMqvkRpCot1JinCZ5BMwp54eWEj5lTvjXSPokA7Op0XpQRfEXBGKy8G4YgHsg0ypTRUTZVb2CsBHvEw8ejl7HgjAyQ3nrZuSUUm4KKvwjsReGvFLJvKsyZL0K1%2Fd5wojy%2BSdT4HJvj8onSXpr6X0XCx5d58LwzGLLSt7oParrh2m7zlAOirgHTgqLyZ8jFPgmeV4Ll9xx%2FM%2F900ZzpcAfuRoTvj%2Fthven3Thsn%2Bqrd6wvEY%2FLounQxNsgBtJG039EnASLg5lnJYVyzlF0GzWnCkqJQrYTNa3kHOVcYOsMDtwygf%2BDKJEWN50JrEyUlIUmn5ALWWfJwImCBOV8ypRZfOhOGFdWY%2BALMOi4t1uQYYMZlze6d6cch6ghnkRX3PWlvbVMv%2F26diDChhPnMBjqkAdJbLYIJiEmM2CIiXRe9W0v3G0PwcAGQ5tMIwu8TauDN8MWtvSK1LZJWvXXy7xSY%2FVgXCnXtp%2FqoT9W4pL5eyB%2F3OUy7JTslTMfK0rHv4S1BYA29UEY5kwC09WnGgRgG8N2YKBYrCdqm1HjeTenfsp%2BBrV453XrSd%2F1%2FdTOhElh53%2FB%2FP3vUBz%2BeSUAX5LVVoqG1jBM6Tx%2FBsoduHwi2LeGEHHP4&X-Amz-Signature=c5811330332773173227b503340a19bb3eb36b5336d8d36d7ca74c5b4b83435c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RF5HT3WW%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031728Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQCaN6xmgawPXJLKaQgesMBm9c3VBEhRjuT%2F3xge6u65HwIhAMnbNOzyg17blzKMS1mq77g6JPasa4tKTFSf4aChdrCRKv8DCAIQABoMNjM3NDIzMTgzODA1IgxSL7iGehf5H6ZouzQq3AOfMvHGhRv71y49sohv37XN5EBe%2FNB6a%2Fa%2F7MqyTTYZn2hr3OeZVEGIYW5o1DRkD%2Bpr8511zuNNdQH6sBAQK0nmU8triryBaHwnH7qmcCdsqDJpcEAa7aV%2BeWWW%2FF7cjmg4YVnUannNGQtsw3l%2Ft49JYy%2BvkjIoYQTKeebrL48UPBcVVXe6ngDNodEkwkFKW1LkmLjrNTa5wGfS23D%2FBAHDHdGxg0Sb9m4zvDQjQ7lNkMgjW7oZ156pPFA2b3tmCgtRcqrAqcwxFj2ZsbL%2BkpEJ4T%2B%2B%2BO2jv7enl3mg2%2FzphlEAlc1CGGbXMTl1pQhPS6%2FJ4Q%2BWR1WqWDHmT5OXX2sTnWDcoHInq88VRSLMsLupCN7NC%2B9O5xkLDANga4%2ByJ%2F4zHxMZvFzmdzGAQf%2BvfD%2BwQJgpWU1NNZuFvJWIkKeeqfkIM4d4G7Zhn8VhN01m6e96kAk%2FvIHvCacWHNEFmU67ZL6dmBpt7pRqLY14o%2BUAo6y74bgQQqoc2aoUFovOhVrZMFkotRP55pQWCvGgPwLPOR0bZmqvb5CCBl%2F2slEXOSf5009ztipptpbHnU42CRi1htW7FkLMZOCOFsOOCHKuZcRnRYMc5q24%2BSafi%2BdijiMjGsuWXt7ulm%2BTbDCqg%2FnMBjqkATIG2mEvgIRrn4oCCF2yvx8jwfhfdugiW4M65Yd9LfNuR%2FzZnCfi5i8cEi2UczxHUy4HcAK8KKl2QndpPiGBE7I2Qr%2F8upmiiFCkF8cPoCLOQsWDBTMfUgWfgcAFxRAEhhQTfxXX%2F%2B5fzKMBzR47PceemH9HBS3rtwKG4JjbM1%2FEB%2FvjgmKTU4w7OtQDx1CV06t3fs1dnMSPIcMUot9xl0ceZYk6&X-Amz-Signature=e3633b7f18c0dfac44dc0fdc248064eac6971babdaab12bfa418845603f04818&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664BVJO7MZ%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQCBoJ2NKPdK7gcbccERZGqKfoAyjXtfccFNyNn9pLJ0twIhAIteRLZ1ZWUFQbPzO910J3X5L31iwFh8vQuNFYxu0oLtKv8DCAIQABoMNjM3NDIzMTgzODA1IgzOpVWLmnJU5dJDOgoq3AP6PkgZT%2BiwljwfDOLb%2FNTq08SOzGReJGrfThDTkTgkjjypWoTm%2BFUXIBxPoP8OIlJe%2BZIgpSZWAV%2BvHjCFdh%2FhPpRCnB3GbjS3%2F8rMbYRZulV1161%2BxSRyOHCopfDbIBabxzs21IaI1Z%2BdsPcwVuJvCFugkgCNWRukoSrDIM5lfoDRJWKn4XlAOXdfJ%2BHeb8s%2F0cXHoUCoZAqepXw2%2Fl2VdR6FSyv1p0nZUmXOe%2FgqNiuVJv%2BqGgbOrFutj2NRsViw4TRu4PtcNLZTwJPKkp1CPbhN16zU%2BjXWERnyPV6FmAZIyg6MK9gcWLwgr5L6%2BroZHeqT3uJmxSdw3I8Kq5S6c8CJA26Jk8o5VrIp5mVhEqZhTn8JPE3XmSUg%2FZsoCJ%2BuGSKZAfLKDja192qkq9VL7bqszkPfVccOxgDAOlnapE734d7y3dKZLgIEyzhiE7ic0bP4vHT%2BiOj7LAWEhwe5Z%2FZ3JWkRa0WGXkzMZ8fTW6HsJ1sPhuiHQovDwBh5PkoMtOVf%2BkbR8P0kE5Z3QTh86DIamROxnKMCBK3h3WnM%2BJMHP%2FmWPml5wf3nVQOyykuMAkSCzRyo6CslUsZLCyhoK3oZ0mDsrU9o0sm5tb9cTM%2BYNPdBg07B0VSq%2FjD%2Bg%2FnMBjqkAaa0HguvOTqiGxhS3r3v2ktdcKEq7IVTurE%2BgCAtRTKRfmK87ZZPBSU8mtlXN10pUrfK8bLKNXuHeAXd51rGIyLwqNZTts4iyMPEBIX8hKwtd94YKSL2nryfhnF2asqYgbqFkmBXelN58JDgmBTEcr8%2FnlmL2WDrrXNM%2B17Qc1wRnEfg2fq51LCEYV0jh9psTHqVE%2B3maHuRukypmSa7uObc1ozk&X-Amz-Signature=9d58b1eef5557618d6e658a66193c1148555a48d04b35ca6c88a7a050822e71e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WLGL4QMW%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQCLwXO8uKiU%2F%2FjwyKXH%2FO719DmB5lztYK%2FshcWe0gRstAIhAKLR7jP%2FU09T2MKMn84mLZKLqxlTEATONP%2FfzOoAggFuKv8DCAIQABoMNjM3NDIzMTgzODA1IgyPpjfbg3%2B7gY3eav8q3AMD54wpzmD7jHfAKi%2FciYxFjgnGj%2BnAkygLLlCbr3MH7%2BvyUdFyzLbPOz%2ByoAxMf7U3Atu6UQncfv9dHi6jHP%2BZUbGzf3K%2FBnaSIWlQDNzxTabnK2AMkLJH3KBiqKIklBwwmYp0dvq7kHQTt0ee1NzTYNLGutSUmgAC49nnQyxnHYNCI1MZI29wH6M94QMBmuiyd%2BKgAPIMwjgufx8g5I5N9m81tcJTPPLIuzmmUtZg5WBOthUsTLdmA0EuO9W5QGe%2FehR7sgp%2FrcsB7aONDc5ABcmzo5hHMW2NlgZW5uA1l7ScKwmbByboYEiS%2F%2BMLFQcYhVFa0Mum00fM06FNorQU79VDnQiYm7MGrNdQCxJSykMwNhY7zOToHU2todksiMZQG3Pwu5J2mtalZJZ4Lg56GvtXz9mo04%2BvNCrVRmzCwD8yN4K47Z5l%2FYi4H9McGYuDypR8v6RQCX3jL1eOXXvoW%2Bnkjf9oB%2BO%2B7UiNEH68%2Bm1Iu2YnyyQJq1by%2FP%2Ff67BiZMOAT0iKo9MGkgs%2BtK1xFIbgBNUk5Ji3LriyVMUmpOLnGLYBd5Q9MKy%2FV1%2FIuL7SBWzbXljIMnNqSrOno3cETWsyk3OtBOQ2zaHvceZEjTXJO0Y0STPm%2BX2LWzCyg%2FnMBjqkAc6cMM%2BJCzcVEzsYvgkXuA4VehvtTupRRjAjrQ58shAjCjdRpD5yRapdhZWy37xvovYWQOcnernlEekcE6t1OPdm8thwMAfZRL23M9TYmjsK3goW4UVSaDXwOnsr%2Fu0AMigw6Y9A9LCaYN36KXz3E9o9Ol2URDNvnI6LzKfVJYCXXsOWphvPvwYnnR4PLHqUj1KJDJgUt4FHGoctLpAZxjWF1oxU&X-Amz-Signature=c08d391f25ad099562493830ead12825b6151f28e4585ad9ffe04e492ba8dd2e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R7RZ3D5C%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031643Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQDud7zNUI9qXfE1E2EDjBUIH%2B5f18fmSFUNXbRQvgN1CwIhAKa6xojotjy4nBQlrMuRmanLcQfPH8b02cifBHSKmRKyKv8DCAIQABoMNjM3NDIzMTgzODA1IgxSyjE9JXIbiwnLiKQq3APU%2F%2FdN45URxrE170l0uzbZA1Nnge2oIMrJMIHgl6mm9GIdDWLMrc9kyu66X6qsW0acfFRy8n3EZt8CJCMppHrInYfsHOsUa%2FTlwfm82LoFxAodigKlzFECe8Zsw2OnCCcc%2B%2FDa0uRj%2B%2BPj9Khgn4zi5QNEn2nbmumE8Tmi4Db34LxNUef9zd15Pfb%2Fj4D%2BrwvmSrfJcuRFK%2B3LidtWqGmFxSMYm05RaIUwjfZ%2FMpcCiRxliyQwkaBigJOAR0JnhtXO73Kal%2BeScin%2BOudUhToFqDMVBE1o9pL%2Bi8wXX0D0XRq%2FyoM4BelK55YKirYis3%2FohYejzf5iQoI65HREBYBVytMokkZ%2B%2BXCJw59n5y7UgdXjWuPZgmzPFMURq3TIAoNTrI7fw%2B1tZ1rc2ryIogcc54U0ADHby7vHrLkINQCxoj3JPU81BwVDr6ePAdm%2BE2%2BdtIf4rvg05abfJ9Y7PFfjv4xb%2FYFvJpoiUZMOWrwrxrQMBkG%2F1DpRATH4ExpOsS0ycWoVLmSwyMlQJ4ot4ViaZOe64HXU4%2FfUWsOUOY00MKL3n3BeSrTd7sWqRn5Xq0PDEFfoWT1%2FStNn64ro96D3beqESWsEb7MKo2KiKZySdKjPNdXQiH5yClPWcjCLhPnMBjqkAfgrt%2Fw04rrlEbXphNv4YiwA122bYR5m9Scfet%2Fh0qd50l8ukzfZf426b2kxKXzlNkjBVA8CMJz3Vxtqtj7hSq8fCuxWwK5wyNLiCse09S7Ok2T6kNulGPNZWhNXo1BlaY7ffmdtsCJwcD7D1g7EgTF%2Be5XOvvjXEsWYhhTeuxAHLqc6H3N4JEEHph3ff8RSfOO%2FnysidzT6q1LExhJvBOZ7p3Fx&X-Amz-Signature=df2d457e2ac943602a4015e6d960c974b45dcf338ff0aa8caf62e60f6e2dc41b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R7RZ3D5C%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031643Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQDud7zNUI9qXfE1E2EDjBUIH%2B5f18fmSFUNXbRQvgN1CwIhAKa6xojotjy4nBQlrMuRmanLcQfPH8b02cifBHSKmRKyKv8DCAIQABoMNjM3NDIzMTgzODA1IgxSyjE9JXIbiwnLiKQq3APU%2F%2FdN45URxrE170l0uzbZA1Nnge2oIMrJMIHgl6mm9GIdDWLMrc9kyu66X6qsW0acfFRy8n3EZt8CJCMppHrInYfsHOsUa%2FTlwfm82LoFxAodigKlzFECe8Zsw2OnCCcc%2B%2FDa0uRj%2B%2BPj9Khgn4zi5QNEn2nbmumE8Tmi4Db34LxNUef9zd15Pfb%2Fj4D%2BrwvmSrfJcuRFK%2B3LidtWqGmFxSMYm05RaIUwjfZ%2FMpcCiRxliyQwkaBigJOAR0JnhtXO73Kal%2BeScin%2BOudUhToFqDMVBE1o9pL%2Bi8wXX0D0XRq%2FyoM4BelK55YKirYis3%2FohYejzf5iQoI65HREBYBVytMokkZ%2B%2BXCJw59n5y7UgdXjWuPZgmzPFMURq3TIAoNTrI7fw%2B1tZ1rc2ryIogcc54U0ADHby7vHrLkINQCxoj3JPU81BwVDr6ePAdm%2BE2%2BdtIf4rvg05abfJ9Y7PFfjv4xb%2FYFvJpoiUZMOWrwrxrQMBkG%2F1DpRATH4ExpOsS0ycWoVLmSwyMlQJ4ot4ViaZOe64HXU4%2FfUWsOUOY00MKL3n3BeSrTd7sWqRn5Xq0PDEFfoWT1%2FStNn64ro96D3beqESWsEb7MKo2KiKZySdKjPNdXQiH5yClPWcjCLhPnMBjqkAfgrt%2Fw04rrlEbXphNv4YiwA122bYR5m9Scfet%2Fh0qd50l8ukzfZf426b2kxKXzlNkjBVA8CMJz3Vxtqtj7hSq8fCuxWwK5wyNLiCse09S7Ok2T6kNulGPNZWhNXo1BlaY7ffmdtsCJwcD7D1g7EgTF%2Be5XOvvjXEsWYhhTeuxAHLqc6H3N4JEEHph3ff8RSfOO%2FnysidzT6q1LExhJvBOZ7p3Fx&X-Amz-Signature=5bf61bbb19fc85dff30397290bd125d683fd3310d1b117d70c2f7b6ad5707350&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

