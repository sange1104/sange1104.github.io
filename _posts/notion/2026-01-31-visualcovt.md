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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YXPFETHV%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGu3MJX1AvN7kmtVvbVt46RbIaJqoCm7osIUmovVbftCAiBg4%2BH5wlYVQBmSlGouhDFcY8MTDAo92bV2S20FfMzOVSqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSObYE0qjxUeYeFfxKtwDpRkHMwPqwWHYpMa8%2B8gmD%2FXDZrhDuseDcdR%2Ba4r9944WG8ZB%2BvEdyHh%2F%2F5aTTQR3%2FKTKBht00YWvLl8sSHOOFxWLvE3ijq%2FQRAL1%2B74hVjv1nasM%2FcvQ0InWQwVHbuZrvxnhHO3CCYbt0w8jFuWWmJ3Rj3Q9QdtxU3cD3xe9AnFzubzBp5ckAoxxRL%2FUxa2try1chd1D39Rtk800zmWXx3TSk86w3h%2FiKKaKNqZKHDH%2Fw2XNpiNeuJZmJqPppG%2Bz7j0yzF1Grd%2B22Cw%2B6Ruys%2F9p2aaYh6sY9W4f0EfM7kx5kgeAuP%2BC4xRbHKik0H%2BkK2xQkrXrpwrxJLISigYdg8T9auk2MILZd1BgfQi81V2%2F5fPTCvy4YRi64NUy11%2FTX9FCcMsfUHJiHuxuQsHILXYaqw8QhzlKslfuLyT1srMfT42xQCaR7QhsypGCa1ChkXpSq9KSFLS0vTTSqActc0fLHBSvDbCghw5R7wcwpD9Thh7BkAvka3cYV7faI134RzfV7Q71JYwSii4QnBSUt3t2k1d2cZ1DGIyur6XAxWgQMKLAEaINHrLLV9RUkwNBFlYfi%2Fy4UmN429Rs1mkZh1cyLJRG9%2FVLcLtSizE0lOlGVr5TcqbCKoVAvrQwsMuvzAY6pgG%2BzwFhC6Gsa8Iy4A7RbOnxTKSZo7Wwhhhm1orgliS489HdCgRKiAig7euipEQ0OPhSUvMrZwzd8EbIeWfBktrdYZXkj59S%2FB2%2B54VmmTiEWMow7X36dTJVQ%2FdIMqGf9jccOUFoZzk3SIsHuOTMZFFatyhE3nHrq9nAOzqcNQ67oADAMEtdYlsVpZi6BVgI242T5bp74yyBF3Wikx%2FzbIUs6DByBE54&X-Amz-Signature=c4b36271eacbadf13c403686922581a0f46d1ff3c8e7d1ea1e1e1a2659871f9f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YXPFETHV%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGu3MJX1AvN7kmtVvbVt46RbIaJqoCm7osIUmovVbftCAiBg4%2BH5wlYVQBmSlGouhDFcY8MTDAo92bV2S20FfMzOVSqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSObYE0qjxUeYeFfxKtwDpRkHMwPqwWHYpMa8%2B8gmD%2FXDZrhDuseDcdR%2Ba4r9944WG8ZB%2BvEdyHh%2F%2F5aTTQR3%2FKTKBht00YWvLl8sSHOOFxWLvE3ijq%2FQRAL1%2B74hVjv1nasM%2FcvQ0InWQwVHbuZrvxnhHO3CCYbt0w8jFuWWmJ3Rj3Q9QdtxU3cD3xe9AnFzubzBp5ckAoxxRL%2FUxa2try1chd1D39Rtk800zmWXx3TSk86w3h%2FiKKaKNqZKHDH%2Fw2XNpiNeuJZmJqPppG%2Bz7j0yzF1Grd%2B22Cw%2B6Ruys%2F9p2aaYh6sY9W4f0EfM7kx5kgeAuP%2BC4xRbHKik0H%2BkK2xQkrXrpwrxJLISigYdg8T9auk2MILZd1BgfQi81V2%2F5fPTCvy4YRi64NUy11%2FTX9FCcMsfUHJiHuxuQsHILXYaqw8QhzlKslfuLyT1srMfT42xQCaR7QhsypGCa1ChkXpSq9KSFLS0vTTSqActc0fLHBSvDbCghw5R7wcwpD9Thh7BkAvka3cYV7faI134RzfV7Q71JYwSii4QnBSUt3t2k1d2cZ1DGIyur6XAxWgQMKLAEaINHrLLV9RUkwNBFlYfi%2Fy4UmN429Rs1mkZh1cyLJRG9%2FVLcLtSizE0lOlGVr5TcqbCKoVAvrQwsMuvzAY6pgG%2BzwFhC6Gsa8Iy4A7RbOnxTKSZo7Wwhhhm1orgliS489HdCgRKiAig7euipEQ0OPhSUvMrZwzd8EbIeWfBktrdYZXkj59S%2FB2%2B54VmmTiEWMow7X36dTJVQ%2FdIMqGf9jccOUFoZzk3SIsHuOTMZFFatyhE3nHrq9nAOzqcNQ67oADAMEtdYlsVpZi6BVgI242T5bp74yyBF3Wikx%2FzbIUs6DByBE54&X-Amz-Signature=ed9556300b4e1fd604577cba68246abe018ff344a61c6fe9085e994eb5210951&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YXPFETHV%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGu3MJX1AvN7kmtVvbVt46RbIaJqoCm7osIUmovVbftCAiBg4%2BH5wlYVQBmSlGouhDFcY8MTDAo92bV2S20FfMzOVSqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSObYE0qjxUeYeFfxKtwDpRkHMwPqwWHYpMa8%2B8gmD%2FXDZrhDuseDcdR%2Ba4r9944WG8ZB%2BvEdyHh%2F%2F5aTTQR3%2FKTKBht00YWvLl8sSHOOFxWLvE3ijq%2FQRAL1%2B74hVjv1nasM%2FcvQ0InWQwVHbuZrvxnhHO3CCYbt0w8jFuWWmJ3Rj3Q9QdtxU3cD3xe9AnFzubzBp5ckAoxxRL%2FUxa2try1chd1D39Rtk800zmWXx3TSk86w3h%2FiKKaKNqZKHDH%2Fw2XNpiNeuJZmJqPppG%2Bz7j0yzF1Grd%2B22Cw%2B6Ruys%2F9p2aaYh6sY9W4f0EfM7kx5kgeAuP%2BC4xRbHKik0H%2BkK2xQkrXrpwrxJLISigYdg8T9auk2MILZd1BgfQi81V2%2F5fPTCvy4YRi64NUy11%2FTX9FCcMsfUHJiHuxuQsHILXYaqw8QhzlKslfuLyT1srMfT42xQCaR7QhsypGCa1ChkXpSq9KSFLS0vTTSqActc0fLHBSvDbCghw5R7wcwpD9Thh7BkAvka3cYV7faI134RzfV7Q71JYwSii4QnBSUt3t2k1d2cZ1DGIyur6XAxWgQMKLAEaINHrLLV9RUkwNBFlYfi%2Fy4UmN429Rs1mkZh1cyLJRG9%2FVLcLtSizE0lOlGVr5TcqbCKoVAvrQwsMuvzAY6pgG%2BzwFhC6Gsa8Iy4A7RbOnxTKSZo7Wwhhhm1orgliS489HdCgRKiAig7euipEQ0OPhSUvMrZwzd8EbIeWfBktrdYZXkj59S%2FB2%2B54VmmTiEWMow7X36dTJVQ%2FdIMqGf9jccOUFoZzk3SIsHuOTMZFFatyhE3nHrq9nAOzqcNQ67oADAMEtdYlsVpZi6BVgI242T5bp74yyBF3Wikx%2FzbIUs6DByBE54&X-Amz-Signature=7b906ab964a1f8c6c3eaa958acad2db20c4706804577cd5d7d6343ce01ca32aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YXPFETHV%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGu3MJX1AvN7kmtVvbVt46RbIaJqoCm7osIUmovVbftCAiBg4%2BH5wlYVQBmSlGouhDFcY8MTDAo92bV2S20FfMzOVSqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSObYE0qjxUeYeFfxKtwDpRkHMwPqwWHYpMa8%2B8gmD%2FXDZrhDuseDcdR%2Ba4r9944WG8ZB%2BvEdyHh%2F%2F5aTTQR3%2FKTKBht00YWvLl8sSHOOFxWLvE3ijq%2FQRAL1%2B74hVjv1nasM%2FcvQ0InWQwVHbuZrvxnhHO3CCYbt0w8jFuWWmJ3Rj3Q9QdtxU3cD3xe9AnFzubzBp5ckAoxxRL%2FUxa2try1chd1D39Rtk800zmWXx3TSk86w3h%2FiKKaKNqZKHDH%2Fw2XNpiNeuJZmJqPppG%2Bz7j0yzF1Grd%2B22Cw%2B6Ruys%2F9p2aaYh6sY9W4f0EfM7kx5kgeAuP%2BC4xRbHKik0H%2BkK2xQkrXrpwrxJLISigYdg8T9auk2MILZd1BgfQi81V2%2F5fPTCvy4YRi64NUy11%2FTX9FCcMsfUHJiHuxuQsHILXYaqw8QhzlKslfuLyT1srMfT42xQCaR7QhsypGCa1ChkXpSq9KSFLS0vTTSqActc0fLHBSvDbCghw5R7wcwpD9Thh7BkAvka3cYV7faI134RzfV7Q71JYwSii4QnBSUt3t2k1d2cZ1DGIyur6XAxWgQMKLAEaINHrLLV9RUkwNBFlYfi%2Fy4UmN429Rs1mkZh1cyLJRG9%2FVLcLtSizE0lOlGVr5TcqbCKoVAvrQwsMuvzAY6pgG%2BzwFhC6Gsa8Iy4A7RbOnxTKSZo7Wwhhhm1orgliS489HdCgRKiAig7euipEQ0OPhSUvMrZwzd8EbIeWfBktrdYZXkj59S%2FB2%2B54VmmTiEWMow7X36dTJVQ%2FdIMqGf9jccOUFoZzk3SIsHuOTMZFFatyhE3nHrq9nAOzqcNQ67oADAMEtdYlsVpZi6BVgI242T5bp74yyBF3Wikx%2FzbIUs6DByBE54&X-Amz-Signature=88dfec72b6ebe789326c80537209fa960c80ee1325e3bfed522d813ff952d25c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q5L4P4Z5%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032520Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4lrDtAxFTzznpzeTjT5rCTsTwdKZ3HBlbk5DHqSsYGwIgZHwWRnHsv1pdL9y60Ur%2BSpZgcOSmGQP2bkB5gQ74Oy8qiAQIs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBlUugF6iDDYjdyRVyrcA66cBhOSHZmyWmeRe3n%2FfqWQ5f5%2Fpw784Goy1B%2FG33wjF3cAr8VurxoEIicek55uVEMdnn8pg%2BzhrLxJKCR3BRp3zqnsNQCyYOAjngpWrPm%2BY5qwenWpyuASLliJuUOwSgk%2FaRX%2FUg2%2FUt4mOfAlptxukjxlng4l7MNYVEeAtdNRQyre8P3nNKokSFlVaPkEJkU9biAnghjKjuhYrPJb8mddQz5T6LQVocdGDh4wzMv9f0HoMaSQTMqPvo4XSGzqh7NSYLVVOe4fiUaZxYdP7BY7YynlHEoG7XROy6BDcqoFX9a3DYHHa99iub%2FLG2zV%2FUyix9ugC38vwdMh6kg0nF%2BPRLVc0a79AS4fK3Xi1nS7VHU1zSrls9%2ByVIc%2FvikRh5Hof1fcucBXvlXXvPINQWG9Qsjb7fKsF5EbXOPYlBsSpFiOTPNISvXio9sVQ2FmF117rReA9bouXjNhGAHAjRn8oIFTHT%2F%2BJ0NjZBKCSKcMtA51opiU7YcJmOd5eufo76bnu%2BBn02yuoZ6IZjgoJ2%2FogQhi8yW2C96cGnViLcdVb26%2FvQWH3VeX7Op02S%2Beq%2BkTqr3I1Uwru0XOMtimKxJJDD9A7367xkDhHHEN8Xq3tqLsyKUOCZvaaagVMJ3Lr8wGOqUB4KEfoPtst3aCzHI2mk9k2BY8a6iSYeeyot%2BPpyuOU%2BuSB9%2Fa8ScLopNL2TTEYB7COMLoQikkVm3QX7OCvMRZL8gcuwFHHH%2FhM6RiB%2BPbCrW4yeSRXUpSJF5zGF2arv1Wj3vYBO7LvHe12a%2Fkp%2BaO97kZNfcFVw5RpSNF4fJglRTlik4uCdApr8Xebn6BH%2FrAObT4j4m1aQc2jRvTeHOH6ESntAwL&X-Amz-Signature=fbf35cfa17f7fb29c9298c29ba62ef26db7bf8b6a2daefc99ae16605f5762f36&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R4HUN7EL%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032528Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIB1Tf%2Fu4UHdfZTE%2BIH5F55KedPJ20HLE%2FfsSAoyY3sQZAiAdTCNroRtJxmTVzykBu0bf0P75jkymY3xfdKU8WaKC7yqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMmbyZtC9vxbPGJWz2KtwDr%2B2rrNKomnujNK1yG8rml%2BpcIQvALBubaLDUlI5wTTuGQxI79RWork6PTvPgJW8Fl1rsINs%2BCSbS%2F%2Fif21DsjA2yUPo5JfXmoNp7Ky9ZUhoWxRFn01r51yavpiidARZm%2FZm7%2BkcSCn8el1PT8cozgWY1e%2BbRuwxO8v4ezPIjDHzZLR8%2BlbCQnBGbkNitJsK0MTwI19r6RWb%2FvXRH%2FTZsBwujvtO7rdktbvAlp2V748w4%2BE81ZrvvwoeosCQOK9qxAJrGR%2B4IEFZdBGe4yt7WxdD7fQBMNGH%2B6XOusHY%2B2M22rf9QkX%2BIisNcrNURozZ5mXtVWONfLIBhgBOv3lXUOoPiduqiYovhcy%2BnbC11lMZU%2FfcTRuso2RNSYIvNnUXBVvLsI4%2BazJhiHu5mkaNfjK6abEkm2ax3zMgDdlEBuQPw0i06lKRYR2MMoH7mMqBnmHt3Z63bDj%2F%2FHB6L0ygGgeiRXqP4lfWQKWNCGyghUp7aS0Dx7E47MAmfKin37VcRS0thJrI3zYxCLoH%2BF91z7tBQ3VPIdz4CyVKAFbkyBfb7fZTJneAPMZAB%2FOXgVAl%2FfeETVgwMciezWvKR64FfmuNHEPb8E6i5gUNpZtdBzjOjCDrKSe0hoKmmgwwwmcuvzAY6pgHpgAQqU%2Fh4qT%2FoePKWNnyblDkV0mCMz4G%2FmL68lLKTJTHAW3%2BK3S4IsPEv8LSCzL0KdHIoX8zuRjf51wWs8jVltwAwTgZ1lH%2BDQ0PKzH%2Fjm5Gi6jDCI3T92sHyw0e6qMsRy9OjMTHbhEkGfDZb8%2BsEjxXyPtQAMy7qCKoQd4IxeyUQgKrOALGYYtEwc6rTt7TCPX4b6ZJI3KpOQ2QAqx6MmjDRMOIL&X-Amz-Signature=cc39713ee557d077c08cac35f10943ce5576e33c868abbbba09f48126d801efd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RTOX2WHB%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032529Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDAUNLOThzRNbp7qfVwIHSUZs3QanYJ2LHZ%2FCCyAvk3bwIhAM7bqnIQRqktOKF%2FBNE7UXVHZ2xZqwThPCyAdIS%2FoL0RKogECLP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxzsIzLV6pVS5h4xtMq3APYRpfwOiirLb5nHARBbp9Pxu8Y0qui%2F2A1s3VpNsc829xH3vQDwy%2BBilXLMecZ47V8YX60qEXrPXtckhhQvZ7RvL%2Baz7veh%2F9uVKrICoG73%2BkX4P8e3dQgNh2r0xjSBBmcMa5NPk6lBYTX1Basb3v62bndESSMSuMe%2FvaWAFGxdZ%2FEUg3uZjoGvLK1nWQ7BeldkkRsBPBFrB0O6BgF%2FLveqbDeh%2BS28vqAmpEELQCyjQiJmenhZdAuCwLlO8Sxb3j14lfJesh%2F8EH2IgE12e3P1mFjPgtEUQxT0ND1nMYx4YIi5f8kUcTNBJ%2FQU6FjHaQ68lCJ2QwKlxdK34IBdXxDJo37ss6t3ApJ4DOlu9RT9sj570CKcmR2X7k3TZqrMzVG5xRSz3GyRFhY1yHbHfn6rvgVzIgAD5Z9Vof%2BsFoBj8%2FyO963KS7hCwkIHsfU6O5bRex1Kwc1E9QGNVBBfMAIeglQfozJ4NlLdvFCLsWN%2BekpogfkdLgArwPkHeJlPgP9eYEq2yo2NibFOH2zNV2OC3aXNGcqFTy4okCSi4kKBz%2FMtDweBN%2BYtbgbGX3HHUiR%2BL7G0E1auWeXFDHDozm2QLq1k2xk4stykWrjjwEsqOPzfwHnHKFnSdqomTDay6%2FMBjqkAe7W%2FVnLahQSMXxWKnu8G75fCiZZWwz%2FNOkLb0Jkgs7GuqSsZOy595Kq0HupBP%2FSUnQY5VaokyIhDI03KIHKmr%2FQk0GltfNGzXFxgckxhWL3Zwlrkziv30RrC2III3EzMZt%2B%2FHaS9kGZtlDujmyXe2u5KAXiFxXkuW8rBzzyjD22eQ4gY3hp9ZlCq2KFYN3QNPs7mrUkrYWQ7I3DhI9MApRR51Ue&X-Amz-Signature=a51d94dca5c291fb67fe341af3cbb75bd7d6f9c49467ce8f91a18f5a67a0905f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664X7GJWGV%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032531Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQChQcADnWRht46eYp3eGy3mb1zq4Ev2oyozk881lxxNMQIhAJiZXU0q0TR6zwMNKiPZCXeMVzBcm4u4SqnfQvp9%2BGsMKogECLP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwYedJR4l%2FXcQCKH%2B4q3APgV74BXJqqSHk69TKu8m4KB9uO6nq0%2BmHZoCDJfVCT53YSQqLXtGhYEsnCbmV%2BwuglvGlRnT5fmLL0g%2Be8zCuDF6nMpM76lMPokCp%2BZluGCQFcUG08Sp8so9j1IVX6wZrqp9bv9Te1zLP%2Fi4p1VG1jpzFmBWjLLF9FpVX57szPeHCF%2Fe4T3MIFgJph0hmMN99r50PCb9QzABBEt7l5ePFehIZv9eyyNNF5LiHxtsf%2B8HYLSC%2FLdtwzlNQD%2FL4rpHy%2Bj4TEIeGE2kXH1zpJW7an7eMpwmmBEv%2FBM1ZcNFnvajSwruhNLzTF5hcKUYkpwYAiSpPGHezCnxFP2DeebGRXGaFmo%2BViV1phfbVTkbVYj5c%2BTEp9HU7H9UrCZESOL%2BBjKVbLa3AaV%2Fusnj7wCy2WCEsIS%2F%2BMyH%2Bk7RCIxYUKYxzm5QzqAUcyI%2FiCKUmvLfUuIrqL1YPsYpJaHyR3JV0Ms3%2Bzm2JqR3D%2Fz5pMfcwX9TaUe3KWdQNv%2BVf7z073LUMZ7qy2f4z41WX5Ga8FfoBzEo3oA6buAKIOf6X%2B1tur%2FrOSHTKPSVkhGc0HmXBBFLjWshstddqjwFL7j67j5yZDHLFritLv7mMFQzFaKjMiWjTYcuRC7bT2erTvjTCay6%2FMBjqkAaeOqCSpaUTq9KY6RpJXLL9QMFU0nU3UvOsGU%2BcMFW2Qfb8o1sANXxXVqnOhzJJ1kbjZUFwInsldfloE7Gpw4PeZoA4DP8HQ3Bv%2BtekR%2FYIt%2BgsteEtriizGqGxZam9VmcK1s7xtlMhhh1nKf24wz7zVnbgZyFRgY1jCaRjR%2BJgN4YZ4mg1A8qZVLZSdHU%2F%2FJBFfaieBe9Bn2XhhVMRuc1%2BHHb5v&X-Amz-Signature=4ec6dde381a09accfec50e253d5eee72357f8c2b9ceb478fca40e8c1e83322e2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YXPFETHV%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGu3MJX1AvN7kmtVvbVt46RbIaJqoCm7osIUmovVbftCAiBg4%2BH5wlYVQBmSlGouhDFcY8MTDAo92bV2S20FfMzOVSqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSObYE0qjxUeYeFfxKtwDpRkHMwPqwWHYpMa8%2B8gmD%2FXDZrhDuseDcdR%2Ba4r9944WG8ZB%2BvEdyHh%2F%2F5aTTQR3%2FKTKBht00YWvLl8sSHOOFxWLvE3ijq%2FQRAL1%2B74hVjv1nasM%2FcvQ0InWQwVHbuZrvxnhHO3CCYbt0w8jFuWWmJ3Rj3Q9QdtxU3cD3xe9AnFzubzBp5ckAoxxRL%2FUxa2try1chd1D39Rtk800zmWXx3TSk86w3h%2FiKKaKNqZKHDH%2Fw2XNpiNeuJZmJqPppG%2Bz7j0yzF1Grd%2B22Cw%2B6Ruys%2F9p2aaYh6sY9W4f0EfM7kx5kgeAuP%2BC4xRbHKik0H%2BkK2xQkrXrpwrxJLISigYdg8T9auk2MILZd1BgfQi81V2%2F5fPTCvy4YRi64NUy11%2FTX9FCcMsfUHJiHuxuQsHILXYaqw8QhzlKslfuLyT1srMfT42xQCaR7QhsypGCa1ChkXpSq9KSFLS0vTTSqActc0fLHBSvDbCghw5R7wcwpD9Thh7BkAvka3cYV7faI134RzfV7Q71JYwSii4QnBSUt3t2k1d2cZ1DGIyur6XAxWgQMKLAEaINHrLLV9RUkwNBFlYfi%2Fy4UmN429Rs1mkZh1cyLJRG9%2FVLcLtSizE0lOlGVr5TcqbCKoVAvrQwsMuvzAY6pgG%2BzwFhC6Gsa8Iy4A7RbOnxTKSZo7Wwhhhm1orgliS489HdCgRKiAig7euipEQ0OPhSUvMrZwzd8EbIeWfBktrdYZXkj59S%2FB2%2B54VmmTiEWMow7X36dTJVQ%2FdIMqGf9jccOUFoZzk3SIsHuOTMZFFatyhE3nHrq9nAOzqcNQ67oADAMEtdYlsVpZi6BVgI242T5bp74yyBF3Wikx%2FzbIUs6DByBE54&X-Amz-Signature=bc6d74cd16a212dd36975b32db860ad94ba22912e48e0c7295965c4efa0cdf5c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YXPFETHV%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032505Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGu3MJX1AvN7kmtVvbVt46RbIaJqoCm7osIUmovVbftCAiBg4%2BH5wlYVQBmSlGouhDFcY8MTDAo92bV2S20FfMzOVSqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSObYE0qjxUeYeFfxKtwDpRkHMwPqwWHYpMa8%2B8gmD%2FXDZrhDuseDcdR%2Ba4r9944WG8ZB%2BvEdyHh%2F%2F5aTTQR3%2FKTKBht00YWvLl8sSHOOFxWLvE3ijq%2FQRAL1%2B74hVjv1nasM%2FcvQ0InWQwVHbuZrvxnhHO3CCYbt0w8jFuWWmJ3Rj3Q9QdtxU3cD3xe9AnFzubzBp5ckAoxxRL%2FUxa2try1chd1D39Rtk800zmWXx3TSk86w3h%2FiKKaKNqZKHDH%2Fw2XNpiNeuJZmJqPppG%2Bz7j0yzF1Grd%2B22Cw%2B6Ruys%2F9p2aaYh6sY9W4f0EfM7kx5kgeAuP%2BC4xRbHKik0H%2BkK2xQkrXrpwrxJLISigYdg8T9auk2MILZd1BgfQi81V2%2F5fPTCvy4YRi64NUy11%2FTX9FCcMsfUHJiHuxuQsHILXYaqw8QhzlKslfuLyT1srMfT42xQCaR7QhsypGCa1ChkXpSq9KSFLS0vTTSqActc0fLHBSvDbCghw5R7wcwpD9Thh7BkAvka3cYV7faI134RzfV7Q71JYwSii4QnBSUt3t2k1d2cZ1DGIyur6XAxWgQMKLAEaINHrLLV9RUkwNBFlYfi%2Fy4UmN429Rs1mkZh1cyLJRG9%2FVLcLtSizE0lOlGVr5TcqbCKoVAvrQwsMuvzAY6pgG%2BzwFhC6Gsa8Iy4A7RbOnxTKSZo7Wwhhhm1orgliS489HdCgRKiAig7euipEQ0OPhSUvMrZwzd8EbIeWfBktrdYZXkj59S%2FB2%2B54VmmTiEWMow7X36dTJVQ%2FdIMqGf9jccOUFoZzk3SIsHuOTMZFFatyhE3nHrq9nAOzqcNQ67oADAMEtdYlsVpZi6BVgI242T5bp74yyBF3Wikx%2FzbIUs6DByBE54&X-Amz-Signature=1b95f0ff7d7b3e159b62e5e358961a700202cf898757ad9f050bf049425daa84&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UNYZ4WKN%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032535Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBOHZ3DC6Y3ZWZN0EpOWpwQvkfv02XS8eJS55sDEbw3lAiBYG36b4cWcrIRiOYVg%2FTlVlMMc2FNxTdpwRR7lBMaErCqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJ9jzJU2h%2B%2Bsoc9f5KtwDbqmaYadu9ctZ4bwB0%2FWQS2fVJW1rMhK%2FYQDZXpWaJWykUQsgkuo9P0J5obkN4cBYdJaWfpDMcq%2FzNofbDotBMpVeNDTjrgTku%2FTBaZi%2B15Ah20gb50FzcaZh6GAQKHuYP%2B0y%2FPL99C6WbPzn44g85U33OW68P1RYPpumsteuOIknhwkA6r14k57w7HOSAsZera3SDRYlduzY7hzbhHO8ww9fBEWHymRtlYUXiwjBmzSIkM2N6A%2BSPhGFwW%2FghGUqhifmi4I3KjERcUlN%2FVxlfUxOFhE3dwwHNW8T9H4XyL08lvss7tBacgVX2HqD16xqNAuKbbGoAxWvsxssS2fKkcIUaS1n2XVUqdo8rnUBYtoTd1ETCmcmMBA5tdFsv4nqC7vZJZqs%2F9yHz4c34YYJryhN%2BIQ8ViMdiCEIiWORf%2BEPNx%2FsF71NxzfQU8dKwARq9MWgwir8d5W95H2qhInwoKUTlPivE86YVXIevhNkHyIs%2BOiS8dogSez1WiAO0VhscqI7%2FMvpQ%2FNUQMp4e%2BNf2YQx74ZUE9maUzBDrkNYEwpMOfn4d6l2Apt1pjTLnchmxkyrNgjIa7F424dlOnapNP7nlPaSi7SjjWcIW6ot7HIDEkXpuJuT%2B6y2EqUw9sqvzAY6pgHnmf5MwQTBBTD2KgqB2DldB9zHfN%2FsxyvjEnFrvjzuxHsQHPEpA%2BhvCiN3oMTB1k0G56ABqtI63i%2FZUuPYRewYTvyq%2FVet2ykZaJjWZZzNKeTJDBFzb%2BafTwAM9%2B3N3vh%2B44nSMhl8ZP8mGlJFVgEKY05L75R82v2ggS88jtDSFYQVOd33d49SvVNnZNjfC7BI8SNEBymXlPClr02ZCjVsFPekYJTS&X-Amz-Signature=f83d789db19c9f0d12596559d85f997b673864efb3c61a7a0cf0fcf1570790f2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YXPFETHV%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032505Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGu3MJX1AvN7kmtVvbVt46RbIaJqoCm7osIUmovVbftCAiBg4%2BH5wlYVQBmSlGouhDFcY8MTDAo92bV2S20FfMzOVSqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSObYE0qjxUeYeFfxKtwDpRkHMwPqwWHYpMa8%2B8gmD%2FXDZrhDuseDcdR%2Ba4r9944WG8ZB%2BvEdyHh%2F%2F5aTTQR3%2FKTKBht00YWvLl8sSHOOFxWLvE3ijq%2FQRAL1%2B74hVjv1nasM%2FcvQ0InWQwVHbuZrvxnhHO3CCYbt0w8jFuWWmJ3Rj3Q9QdtxU3cD3xe9AnFzubzBp5ckAoxxRL%2FUxa2try1chd1D39Rtk800zmWXx3TSk86w3h%2FiKKaKNqZKHDH%2Fw2XNpiNeuJZmJqPppG%2Bz7j0yzF1Grd%2B22Cw%2B6Ruys%2F9p2aaYh6sY9W4f0EfM7kx5kgeAuP%2BC4xRbHKik0H%2BkK2xQkrXrpwrxJLISigYdg8T9auk2MILZd1BgfQi81V2%2F5fPTCvy4YRi64NUy11%2FTX9FCcMsfUHJiHuxuQsHILXYaqw8QhzlKslfuLyT1srMfT42xQCaR7QhsypGCa1ChkXpSq9KSFLS0vTTSqActc0fLHBSvDbCghw5R7wcwpD9Thh7BkAvka3cYV7faI134RzfV7Q71JYwSii4QnBSUt3t2k1d2cZ1DGIyur6XAxWgQMKLAEaINHrLLV9RUkwNBFlYfi%2Fy4UmN429Rs1mkZh1cyLJRG9%2FVLcLtSizE0lOlGVr5TcqbCKoVAvrQwsMuvzAY6pgG%2BzwFhC6Gsa8Iy4A7RbOnxTKSZo7Wwhhhm1orgliS489HdCgRKiAig7euipEQ0OPhSUvMrZwzd8EbIeWfBktrdYZXkj59S%2FB2%2B54VmmTiEWMow7X36dTJVQ%2FdIMqGf9jccOUFoZzk3SIsHuOTMZFFatyhE3nHrq9nAOzqcNQ67oADAMEtdYlsVpZi6BVgI242T5bp74yyBF3Wikx%2FzbIUs6DByBE54&X-Amz-Signature=88ea56d9b911f97c48354af05c049c45944f81c626b588a49d011c9be444f6d2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UTHWDOB7%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032535Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDcaLUQetbSEKY%2Btb%2B7euC1b62N5Ynd%2B06IZ2DbXvLzVAiEAz0txdD4u2myzDLPndizKJJbyAwHS%2FeIZheo11lAg7fgqiAQIs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFx%2BP1clsv%2BXBGzZBSrcA5FHXu8CV5YZUYrWrGF1%2FQyy%2FmzBo3TPCRl4MdTdelZYWUNIrka5gtI%2BHho4MttwdsYfyv2DY6ByHGZgiPCkHsXyK1%2FwDNNdDRdToZtn0rdR1UHed%2B2wiw0DnWjcznPNhcoP4FYn7s0hNnmJ0Ileh4O7sDHjm0AW24397%2BN%2FPQRx3lYFhx%2BXM7SeDKrjFxk9F7fcf5Qg5kjt4b15Eavjlsfa2x6pUuD%2FtCY9BywZYsZfS2bIStkfHdUVfSCQoIJGVFhGDWpeEIB4%2FuQmP19pvzR037TuU6kpfp3KYLJV3DpNaatoQv7O5%2B%2Be6OQwGGsLYvE8D3PAh%2FelQ%2Bsi6FwXqR3lKL4ZqpwYwyhlSx3h9gSfDgG41LQH43RjZlI3n0417vsOeVdkUaEXQvEtioRdw05M5GdQZXYRnXqHl0HjY2WClBoANZ1hNA%2BNcg%2FySP7jY48DcJTDzqy5WnKw4GTEyUSfE7qD618hDTees1DT%2F0fOXcMeLpceIDoJ9M9VOldeSW%2FfKnujltxEY13vXX9%2B0KtiW0li%2B5MjJweK4vsqz7z4IjeY8IYD2C17RTarjjEKfKPGZxgaC%2BUajWpolijzo%2FeHZdKz9x%2B3q%2BCXeU4wFerJVkGKyEHldpcY33H7MObLr8wGOqUBagory0my3DYiJ9Jac%2FuWdDyqVEfOMFmCXxdFkpO0TUaKgPIyJVKlLgHTze4i5yp1B0xjeMfF%2B8%2BfnpMaMNWDHXNkNGmGneLi7GMYK5yXb64A8Aq%2B9Huz6Csm%2F%2FbTuFFzk14s9S0Oy36k9QDkw7ZEdMC5lIY4uHQtT4Vqap6e%2FdRlzg4OBK5aX96xAA6MFJgT7IpiK2qG93D72EKt2WewxBTHqOc3&X-Amz-Signature=aa42dc04bebfd66fd5b46a484c1a8c7571ccf85f6d3e839d0b6fb302dee0a6a5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T76DGFDJ%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032537Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDsNaSJHGu6Vh1uiRB2ciflj2wxCWmtRWOMvFEtu3nmugIgGof3hgfQ%2FyLtmz%2BXYupo%2Fdc5qJ8OAmudbWgCRcKq4ggqiAQIs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBpnbbGbLjzaiwM99CrcA7WTDIxyL59XWcMVk%2B5z7sbV5gBVHX6bYGeWmttF8IQaQGm0GPwds4X%2BC%2BKPCHC66oxPULXoiF3GlkD1BvxlDnXEH5uw3Uk%2BtAW7Y8sJxJvBoOJ9KXvTVSnscn2da1Wi%2Fjijsh10GqtlhowhyyXUYoVSEPC9xtoTRsUtZ%2F6Uy7FH8FhM147T3H7Dzbp%2BvHdg3TQ7LhkFQMSfjOfmUnWop2MA99gniuYEKhWD3d%2F7rBzzXyUGKJiZF2jj5DQRPRJyRlZGLR3IS2aYZaDLx7mmttSKejEZNwgb%2FlG0KVhnbJylZgfpHbi2i2lZP06YTbpBnjBpo6IuvoZoDEOGofYhUPG%2FCCUZcfgkV8jG8hM4j4l6crR8hsdcw8zntgprKFcVwsHsw3WMwn0gPTX7Vrs0Sd0reTeJt7%2FjQZzWvX1Gnx2mszR8OTwkd406TdPLMShkiM3MoP9bipi4MDFSFYaKlCW7HPTx%2BdZgYcnISOaexJYnmuahEuNwSfi8ycBtUoTw5NVZmRW5B2kmX0J71oFtRfFbOb862juy%2FxiX0WkfrGPVy3DHimv3tQ1t5CKe1uxTZpcasSxABiXoMkZgycchW%2Fj%2FBBvjQe51H%2FnIRh5rVLcLwq1PKwVxgpEGGSR%2BMPHKr8wGOqUBIEytTfDsRKJyJYiLGpk0ziHzkffeyCedug%2Fcqvl%2Bjb9cpPN6pW%2BLTMV6Dml9FeYT4Pyvl38nU01rOcgoLA%2F48mVSgASDl%2F9RgdOy%2BXdYMDQRgaDHhME7Mvm%2F%2BbQ3dY3xOtW7XZL1gkR98Hw2tiUwjd9yHbVgONxNOTQXJ3X8eZK%2BzEkHq7rnc1ZwgD3rOw2FcfA44T1wlEyrEZT1QgEj%2B6iwbbFa&X-Amz-Signature=f4af9c3bb24391a17144c1ffe32fa5128733034c7f6160b16fe7d5e4f85cbac6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T53AMGU4%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032537Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHR1p3%2Bmp%2F7atOwhkrK58y4Zr2Q5vfDpb1bJRkBdKnsDAiEAwD9VZawPHd%2BM%2BhggAKjFwCRolASwlTa4BFToJNbvmEgqiAQIs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDD95VSmX0Zren0mXwircA0W3Xzb5oJdaK0%2Fi82exdbrjG6%2BuAMrNbmKY49lYD%2FilxZiw722Wgm%2Bg9qk3EhrzFgKwSJlEwG32MPESlrOo2lUFweXbMXeuFb5plYATpRP9Y9XAHZxHiKKJVGyGGXSaBsscC%2Bvn3YJEMO4RwcgcTOqsUl3sEqFeRFySL6dpZyVd1RIIq4oSVHUmJuwoBzExnLxe7kPhZY6xAqWWuPPe2jw1aKijxqJRA%2FVO6HzWJL4XJ8LcKaqdqInNidh73ysUmcBNGNZcKbc%2B56jeIi0ZfxanqiKqMCo4eXx5vxOti4E5d%2BNxbkYEHbpPdfoVtZnG7Ayv0t8UoKXKjKbwsOjIFcvMTSw9BKiA5JXbQquuTKsxVxKNrsy6CeUP%2BMeEyEoR4k7Lw5mfcKL651ETy0Nrnk5%2FY9UhlwkoT4NUeNJoGUU2r07%2FwOejBkwvatPmJv9zICSCYyk%2B9zQAf%2BMVyUNAITIh0pSgeUbTWXQEerjDr4rqpJSNwvF3H7vp1oQZJc03nPg%2B5vWVGs0bFDYJ0M8d6jAjRZ21J7bGColh3FA%2BhwNZoSx6nIYOXg6M7uXZk2qm62KRgNYc1DlQyVTmrfKsNjYpAQj8BXB1OKq%2FgmCF%2FahdNCWE9OqReaxdDIuVMJnLr8wGOqUBMYxd8pFeDH13JE4wZz2xBvVoDtJi84HnGKLCcAxq0wpBqwh94L%2FfdLH4BEstUrpErkbjdLhB5%2BsKNJVjbRf8Q9qOC0uGwb9r9znfFy5BumPHyoDHLefTmxKzys%2Bftfi7597lKGleUfK3Y4mCVsNE8Jr0tsdjTfzJmL%2FIVRuHnZJ5SQmI%2B9SaXiVzRK9zga4xIjY3jBX%2BVFysNA1LlbFiQmXLlptL&X-Amz-Signature=07be531cbceb54665ebfa2c92f74c606b8772e7b0376b8f0cd3573198d361dcd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664KKRCP25%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032537Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQChanslz%2BfkxkrB%2Bnhluh%2B2iyD0br2BVwhPEvOOxZPiVQIhAJk7KIe6tKQ3NIUoYtvC32GtMe1N%2BJHjBXdwegQnaXoAKogECLP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyW7Qm%2FIEvJylAFavwq3AMSpOq0S5eE9pokAroeCx3M%2Bih9SyywFLF3pJAPNwdmlxPWmRm5LeP3G%2FUkqED68hGv%2BkOMpIOKIU%2BALde3KEc9AXsH%2BFUiiYiKYiRAR00Te%2B84rfmChcgkXcz4uAuTdetNKMcG33iJ8%2FwmxIfw857rr8EhwnKNgjENC5mNTcsYOeEaA83NuvOL2WLxWC6MzAFyQH5q%2BecleITSbmgSthmPgoMYXv%2B1iBqR8LkM%2FAnlpPowr%2F6WFXh4LFBVBCYfs5lRPWJdlIQSVG4dJdhgXDWmsCjF%2BYthiO7PnZysdC%2FU5Yjq6cpMhRn3kzggYp9dDQ2rb3T7Nkvs0wdgUlih9i1qAcj9ya%2Be0DMSCXM1BHZPTRroE6zgwVsDIdmTNf6YWnk2St1K75fTA6dOuFTe6ECL%2BjiXfwH7aIkv4jRDHOedxyrA%2F7CeVEPsKVgzMbFl11vy34z2GezZnhEw4SEXyMJhKIzJn7noK8T3LQfifR0pYef54xmkwhWA88CJJhTOloXiwUqXf27C2pfzNi%2BLGjBl7DGqJ4nZRaI%2BMClhtS28mLGVKKrxsyPEABqWc1UwZiWzJ3UT1wZs3tf6QbfgH%2FMmOhUpA4sHcGbVTPj8qrQUhZuCtokCA2AjLVyOUjD2y6%2FMBjqkAaBOAETwXXSMbqqDFHkRI%2BpfzOvzOPOrfNUK0Vb5HKhgQ2S8nIccwEmFY%2FF8eAudG0D2rMYi55l3CAmnxU%2BS3axiodiDwed31R3E56RNwnJk1%2BFVZazbhIr%2Fb8TOgiwgcjvkAA6PAHuepF5oaLAsdU0k%2BP0oeVtVSA7OpaPyoswMx1jj90smpNKPLMhUs2lSOxktAePmQQo84wLrfh9u81DHivGX&X-Amz-Signature=c1062149101227d3c2d08cbc69b22b32b38be73fdbf4513e8a9429295df4de49&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YXPFETHV%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032505Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGu3MJX1AvN7kmtVvbVt46RbIaJqoCm7osIUmovVbftCAiBg4%2BH5wlYVQBmSlGouhDFcY8MTDAo92bV2S20FfMzOVSqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSObYE0qjxUeYeFfxKtwDpRkHMwPqwWHYpMa8%2B8gmD%2FXDZrhDuseDcdR%2Ba4r9944WG8ZB%2BvEdyHh%2F%2F5aTTQR3%2FKTKBht00YWvLl8sSHOOFxWLvE3ijq%2FQRAL1%2B74hVjv1nasM%2FcvQ0InWQwVHbuZrvxnhHO3CCYbt0w8jFuWWmJ3Rj3Q9QdtxU3cD3xe9AnFzubzBp5ckAoxxRL%2FUxa2try1chd1D39Rtk800zmWXx3TSk86w3h%2FiKKaKNqZKHDH%2Fw2XNpiNeuJZmJqPppG%2Bz7j0yzF1Grd%2B22Cw%2B6Ruys%2F9p2aaYh6sY9W4f0EfM7kx5kgeAuP%2BC4xRbHKik0H%2BkK2xQkrXrpwrxJLISigYdg8T9auk2MILZd1BgfQi81V2%2F5fPTCvy4YRi64NUy11%2FTX9FCcMsfUHJiHuxuQsHILXYaqw8QhzlKslfuLyT1srMfT42xQCaR7QhsypGCa1ChkXpSq9KSFLS0vTTSqActc0fLHBSvDbCghw5R7wcwpD9Thh7BkAvka3cYV7faI134RzfV7Q71JYwSii4QnBSUt3t2k1d2cZ1DGIyur6XAxWgQMKLAEaINHrLLV9RUkwNBFlYfi%2Fy4UmN429Rs1mkZh1cyLJRG9%2FVLcLtSizE0lOlGVr5TcqbCKoVAvrQwsMuvzAY6pgG%2BzwFhC6Gsa8Iy4A7RbOnxTKSZo7Wwhhhm1orgliS489HdCgRKiAig7euipEQ0OPhSUvMrZwzd8EbIeWfBktrdYZXkj59S%2FB2%2B54VmmTiEWMow7X36dTJVQ%2FdIMqGf9jccOUFoZzk3SIsHuOTMZFFatyhE3nHrq9nAOzqcNQ67oADAMEtdYlsVpZi6BVgI242T5bp74yyBF3Wikx%2FzbIUs6DByBE54&X-Amz-Signature=35ff43ef5a8b8a92b2ca90a17da8b10c448a560f6b2da7a376c05a32db2c12cd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YXPFETHV%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032505Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGu3MJX1AvN7kmtVvbVt46RbIaJqoCm7osIUmovVbftCAiBg4%2BH5wlYVQBmSlGouhDFcY8MTDAo92bV2S20FfMzOVSqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSObYE0qjxUeYeFfxKtwDpRkHMwPqwWHYpMa8%2B8gmD%2FXDZrhDuseDcdR%2Ba4r9944WG8ZB%2BvEdyHh%2F%2F5aTTQR3%2FKTKBht00YWvLl8sSHOOFxWLvE3ijq%2FQRAL1%2B74hVjv1nasM%2FcvQ0InWQwVHbuZrvxnhHO3CCYbt0w8jFuWWmJ3Rj3Q9QdtxU3cD3xe9AnFzubzBp5ckAoxxRL%2FUxa2try1chd1D39Rtk800zmWXx3TSk86w3h%2FiKKaKNqZKHDH%2Fw2XNpiNeuJZmJqPppG%2Bz7j0yzF1Grd%2B22Cw%2B6Ruys%2F9p2aaYh6sY9W4f0EfM7kx5kgeAuP%2BC4xRbHKik0H%2BkK2xQkrXrpwrxJLISigYdg8T9auk2MILZd1BgfQi81V2%2F5fPTCvy4YRi64NUy11%2FTX9FCcMsfUHJiHuxuQsHILXYaqw8QhzlKslfuLyT1srMfT42xQCaR7QhsypGCa1ChkXpSq9KSFLS0vTTSqActc0fLHBSvDbCghw5R7wcwpD9Thh7BkAvka3cYV7faI134RzfV7Q71JYwSii4QnBSUt3t2k1d2cZ1DGIyur6XAxWgQMKLAEaINHrLLV9RUkwNBFlYfi%2Fy4UmN429Rs1mkZh1cyLJRG9%2FVLcLtSizE0lOlGVr5TcqbCKoVAvrQwsMuvzAY6pgG%2BzwFhC6Gsa8Iy4A7RbOnxTKSZo7Wwhhhm1orgliS489HdCgRKiAig7euipEQ0OPhSUvMrZwzd8EbIeWfBktrdYZXkj59S%2FB2%2B54VmmTiEWMow7X36dTJVQ%2FdIMqGf9jccOUFoZzk3SIsHuOTMZFFatyhE3nHrq9nAOzqcNQ67oADAMEtdYlsVpZi6BVgI242T5bp74yyBF3Wikx%2FzbIUs6DByBE54&X-Amz-Signature=7021ac8e1a391622b82c3d092220be024e0ff09e25c6048beed1ee86ff747af7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

