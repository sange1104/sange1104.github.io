---
title: "MindJourney: Test-Time Scaling with World Models for Spatial Reasoning"
date: 2026-04-28
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- 2025.07
- UMass Amherst, JHU, HKUST, Microsoft Research, Harvard
- [https://github.com/UMass-Embodied-AGI/MindJourney](https://github.com/UMass-Embodied-AGI/MindJourney)

한줄 요약: 월드모델 + test-time scaling


## Abstract

- 최신 vlm의 발전, 하지만 2d 인식에 머무르고 3d 변화 (시점 이동 후 장면 변화)는 예측 x
- 이를 해결하기 위해 새로운 프레임워크 MindJourney 제안함
    - 비디오 diffusion 기반의 controllable 월드 모델을 VLM과 결합해서 이 한계를 보완함
    1. VLM은 간단한 카메라 이동 경로를 반복적으로 생성2
    2. 월드 모델은 각 단계에서 그 시점의 이미지를 생성함
    3. VLM은 생성된 멀티뷰 정보를 기반으로 추론을 수행함
- 결과
    - 별도의 학습 없이도, mindjourney는 대표적인 spatial reasoning 벤치마크인 SAT에서 평균 7.7% 성능 향상을달성함
    - 월드 모델을 test-time에 결합하는 방식이 간단하면서도 효과적인 3d 추론 개선 방법임을 보여줌
    - 또한 이 방법은 강화학습으로 test-time inference를 학습한 vlm보다도 더 나은 성능을 보임 → 월드 모델 기반 test-time scaling의 잠재력을 입증함

## Method


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/809d6a25-9e97-48f5-8182-f634d9c5d1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RTK7P6LU%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044244Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCICRGSSweoEa5ypWRvwMVSp5jNonY4UBnd1Qbzb6ZhRIEAiEA2ws%2Fmhfbk14x%2FQlrA4NjBwXSv8%2FjKzzc9xP1tNYFvaYqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGwB2HQUTU6Wjm02dyrcA1jbOEfjweDHNNd1RloGdHB6vDHoiRkA8UCLt3eJW7SJl9iw%2FNBLYZ6JI8kYsE8Rzjei%2Fa8Ynp8U7JcgreHPpxssUsIJuXQEs1QctRETt7MmKXwAg2IxnqpSuxRvQEPc%2B2X2Ze18HyMoLL77BocL2zFSpptT%2B5S%2FLpDY6FGojtQHO1iHGkPh6mW0JKKiOU2sv5SDQdx9XrfjPyTpJHrwgTmCdQDSwgvWbfrq%2Fz56kkpnyJiZLetqauzDkpkcg3mjYlwG5UmjMEMNOXuP%2FMmMyynIO64LRV0GaM8Q%2BrOM0zQWFB0ixNSEaVONgbBmjUx2EDjdy2kc3nugE7nsZy7Jgb3%2FyUMwAaxt%2BLIVjISzymlxDgO2BRRXHvHg1Y%2BXjVSYDckGGwc%2F0glg0sgq99rc%2BW4rjKobEfLCcxM1qmdyvxM8%2FUcLhDZGK%2BO9cD6T4PkCVWeb6poLHuncOH8%2FxWsE%2B91CkyMPlEe7MD4ESOMdU%2FtwyYQ%2FY8wJDIda7v6e9wrf%2BVJbEjBELJXdnVEUA9OGcE4hWQAyrPupD%2F3DfWIe%2B6LWOEDnTkQYHlWqpeMg%2Fi1wesXbU86CA0lI2%2BYzHV7E3TF5sJumHohOdcuZsOdAOH3RKsJA0gct7%2BjHOzGhMMTkudAGOqUBR3yzIaEyMXFr7nnYjh6VXBMYt553uUChmmsG%2BewRuad5ktJY3hc8JgPQq6T9takJzodKNfjRfED0c8iQC2dcLm3yKOIGFxtAmbxCgomNMw5ifDUKaGIzlNtwn0zliNVonijrQ4KAJdAhsyYO%2Fyi2AsN85V4r6Eo%2BfBuTvpQwi5aSNIMRYGwijd6baoAMLsgWAwh6UlFZOIeIngfYyVyFUZN5zz98&X-Amz-Signature=b6bda21c34ef0ac7af360084b4e1c39e4fa7f2c5b75c538048ce28eefc5ff3ee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- **3.1. overview**
    - 목표: 월드 모델의 예측 능력을 활용해서 vlm의 3d 공간 추론 성능을 test-time에서 향상시키는 것을 목표로 함
    - 제안하는 mindjourney 프레임워크는 2가지 핵심 구성 요소로 이루어짐
        1. **비디오 디퓨전 기반 월드 모델**
            - 입력: 하나의 rgb 이미지와 카메라 pose로 정의된 egocentric 행동 시퀀스
            - 출력: 해당 경로를 따라 일관된 시점 변화 영상을 생성함
        2. **Spatial Beam Search**
            - 주어진 question을 기반으로 vlm과 월드 모델이 상호작용 하며, 유용한 시점 경로를 탐색하는 과정임
    - 과정
        - 입력: 이미지, question
        - 모델이 n-step spatial beam search 수행
            - 현재 beam에 포함된 각 trajectory에 대해 월드 모델이 새로운 후보 trajectory와 해당 시점의 관측 이미지를 생성함
        - search VLM은 question을 조건으로 이 관측 결과들을 평가
            1. 답변에 도움이 되는 <u>trajectory-observation 쌍</u>을 helpful observation buffer에 저장
            2. 추가 탐색이 가치 있는 trajectory만 선택해서 다음 단계의 beam으로 넘김
        - 탐색이 종료되면, qa vlm은 원본 이미지와 버퍼에 저장된 관측 정보를 사용해서 최종 답변 생성
- **3.2. World Model Formulation**
    - 본 연구에서
        - 월드 모델: 기준 이미지로부터 시작해서 일련의 행동을 순차적으로 전개하는 egocentric 시뮬레이터로 정의함
        - action space는 이동과 회전으로 구성 - **앞으로 이동, 좌회전, 우회전**
    - 이런 action들을 순차적으로 나열한 것이 trajectory
        - τ = (a₁, …, aₘ)
        - 길이가 m 이하인 모든 trajectory의 집합을 탐색 공간으로 정의함
    - 이 action들은 카메라의 상대적인 pose 변화로 변환
        - 카메라 pose 시퀀스 C = (c₁, …, cₘ)
        - 각 pose는 카메라의 intrinsic matrix K와 extrinsic matrix E = [R | t]로 표현
        - 이 pose 정보를 조건으로 적용해서 비디오 디퓨전 기반 월드 모델이 각 시점의 이미지를 생성함
    - 실제 동작
        - (입력 이미지, trajectory로부터 생성된 pose 시퀀스) → 월드 모델→ 영상 시퀀스 생성
- **3.3. Spatial Beam Search for Action Space Exploration**
    - trajectory의 길이가 길어질 수록 가능한 경우의수도 기하급수적으로 늘어남
    - 이를 효율적으로 탐색하기 위해 beam search를 사용함
    - 2단계의 반복
        - 질문과 무관하게 <u>**후보를 확장하는 단계**</u>
        - 질문을 고려해서 <u>**후보를 제거하는 단계**</u>
    - 전체 탐색은 최대 n step동안 진행
        - 각 step마다 현재 beam에 있는 trajectory들을 확장한 뒤 vlm을 사용하여 공간 질문에 대한 관련성을 기준으로 점수를 매김
    - 각 beam node는 길이 m의 trajectory를 저장함
        - 이 node에서 탐색을 확장하기 위해, 각 primitive action a’에 대해 최대 k번까지 반복 적용
            - 한번에 최대 k개의 action을 붙임
            - 생성된 후보는 월드 모델에 입력되어 해당 시점의 이미지들을 만듦
    - 각 후보에 대해 자연어 설명을 생성하고, 질문 q와 함께 vlm에 입력
        - vlm은 점수를 출력
            1. 해당 trajectory를 계속 탐색할 가치가 있는지
            2. 현재 이 시점이 답을 도출하는 데 얼마나 도움이 되는지
        - 일정 threshold 이하의 후보는 제거
        - 남은 후보 중에서 기준 1 상위 B개는 다음 step의 빔으로 유지, **기준 2 상위 H개는 유용한 관측 정보로 판단되어 evidence buffer에 저장**됌
    - 이 과정을 n step 반복 or 더 이상 후보가 없을 때 종료
        - buffer에 저장된 모든 유용한 trajectory와 그에 대응하는 이미지, 설명을 모아 vlm에 입력하면 vlm은 이를 기반으로 최종 답변을 생성함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3e62d2d7-97c7-4ac0-a628-cdb3dccb482e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46644M42TBW%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044252Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIQDhfXdR3BA6xhUKWmGwOFloFo9je2tFxjxQyCyFmbGZOwIgFxI%2BosLfQ20bmsbGlk9Fr2v3tr8kWduxQYU%2FZZAG3UIqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCNgYHhrrHQLmF0R9CrcA9uxCNu%2F4eynsSk9BwVnqtBKdFIzF7%2Fv2Zos67NzrugmTorIXp06f9U3xuEm9VSNDbN1ZM7TDjUvxXconPDWH7EDqkCu3cJqyvtjgKF%2B8LUCTaZE8QZyVN2euO0EDatE0eMNE0uVC1O8R6m16R10aANeQXnJh5%2BEWw%2F005OoEooNsohhY0lAalSLKXA7jkrNMHIMFRd%2BKBXQ6ZyUJhOSNMsj5BVzKYPDbSRV22KOSBB6%2BFPmsneAzC812PJwxB1CJ%2BhQFy0%2BafSqdGwyeapW44bJf5VWwc60VvrU1GS8c3LcXThC3GOyVhKHYdYYXJi1YgqKjyyr7CoeVapvIoTen071TJdWhn9mKk1tvN36IfO9Q3CNLm3pgehPspsDcpqKlRG3T08MpfrIGPXTllk27VbRlRNzjhmrRxvieKoXHsmiU2hQRiYaPM3Bd7Nsc1yBFjmwsS2xrVoZnGlljQtEbsSfuqmuUYBGPoJ7ssb1osKVC%2F8kv7OW%2B1xWlVBvWwoMCKJX30PppXfi8TYH584AIzCkOAgwyKHONTKfrX95oqqqLgBqUzOV6QAlT6MedAqyvHYrB6wmPaZAFCGsUZAzVzjwYvvbgH7llzWtmJHS3XCqoO2PSKYo%2BMMPMk2hMP7judAGOqUBsyzD8flQu20xIWUpXYwHgEYh6s9%2BAIt67QHZ6Q2CxAFaRh7UrLvxSbzSwgPmolVlu2jxMswhZS6x0B7fhbgcJb04WCLZLtVSVUfYKuKbdPH%2FS71nycAUtxjw76wVMUtKje1lAe0Hw9v%2F8GpSORYjgu1GIVbfXZdSkSQPDeJv9NF2jnRVCM5zAQG%2FsjBve8%2BC9SWus61eOumgnzynKYrgwgK6kt2W&X-Amz-Signature=5e2dada3a7ddd01b35830293131097286ca59de78626db9b3f58e09863de34f5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- **3.4. Search World Model Details**
    - Search World Model이라는 자체 월드 모델을 학습함
        - Wan2.2-TI2V-5B 모델을 기반, ReCamMaster 방식을 따름
        - 카메라 변환은 extrinsic matrix 형태로 표현
        - 이를 임베딩하여 video latent에 픽셀 단위로 직접 더하는 방식으로 반영
    - 학습 데이터
        - **Habitat 2.0 네비게이션 시뮬레이터를 통해 합성**
        - Habitat은 실내 환경에서 전진, 후진, 회전 등의 움직임에 대해 픽셀 수준으로 정확한 렌더링을 제공함 → 정밀한 카메라 제어 학습에 적합함
        - 합성 데이터의 단점을 보완하기 위해 **RealEstate-10K와 DL3DV-10K**와 같은 실제 영상 데이터셋을 함께 사용
        - habitat의 기하학적 정확성과 실제 데이터의 시각적 다양성을 결합
            - <u>**합성 환경을 넘어 실제 환경에서도 잘 일반화되는 월드 모델을 학습함**</u>

## Experiments

- **4.1. Settings**
    - 벤치마크
        - SAT (Spatial Aptitude Training) 벤치마크
        - egocentric 자기 자신 움직임, 물체 움직임 모두 평가함
        - SAT-synthesized / SAT-real
        - 객관식 → 정확도로 평가
        - 5가지 공간 추론 문제
            - EgoM: egocentric 움직임 / “내가 움직이면 장면이 어떻게 변하나”
            - ObjM: 객체 움직임 / “객체가 움직이면 어떻게 변하나”
            - EgoA: 행동 결과 추론 / “특정 행동의 결과는 무엇인가”
            - GoalAim: “특정 목표를 향해 이동하거나 행동했을 때, 그 결과가 어떻게 될지 예측”
            - Pers: 시점 변화 / “시점이 바뀌면 어떻게 보이나”
    - VLM
        - gpt-4o, gpt-4.1, internVL3-14B, o1
    - 월드 모델
        - 본 연구에서 학습한 swm
        - SVC
    - spatial beam search
        - 탐색 깊이 n = 3
        - primitive action k = 3
        - 기준 1, 2 점수 threshold 둘 다 8
- **4.2. Results**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/98028044-fbac-4009-9eb2-fd0f8893ae34/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZX36KW4T%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044254Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIHBpM03Qqb7vWwIP8Jye%2BSfrBg9ZYqDUrjAbVptn3Nx6AiAJlMXg5UBoWaoiCt4rDLAe8ncFRRCubJLmSZF23G56QSqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMQ3MZb%2F9hJgSjWGkjKtwDioN1VjYFYnsWNxryinwxVnz4lLMoZczLATbsU%2BQT0yvcY9q1RToD8Tf931LtHwmPLLZ798UoWhSYmI4kEn%2F7Evzh6Sr4KKQjXiQtc6IrJf9h5dP1Burjdg%2FSfcCGriRPyxT4VnsZaGD09D17uOEx3O5YZkSCNrwxKHpg8AmFDodspMPKFbvVE6HqVUJ78lwNiIry4404f5zDNtBaGZBw8jkFI2IN4qmiCDauw6DVHLJH%2BId8zODImyBrcHyLfBEBYW7a%2Buq1g2oTuwzqD5y5iepXxxTpsMYewqL8BGihRhYTXuoRjA10o5Dqka%2Bb1Y4ad0AxMKtWjpW95b0x3d1e3L7yc41ka0PxnLV8EnrlzH49AJxnU6Bt%2FdvDrlXCou%2FI5SAT4nlkPbbEV6OXjQYkxE1R9YwzpsySQ1OVm0vEQvzLmbLbSgKXsjQMfseDOIeyqwnOMYMREqW7AHvFKM59s%2FwA0%2BxoFMe9%2BdWlFUQI9Tgwfc5Dkn7Nx8pFXk64minDH7Ju4BdzB2TdYjz%2FsF5QBSUDmFeyTg7Nz9V98AqMAIeTVYFmV%2BzLr3cX%2F3e2DCX8IrAAjDJDW8Ie6h9YPc0It8zR%2B7%2BVFWHqf7DdFKY5%2FMM0WX24V%2FohknLf5X8w6eO50AY6pgGWHX6wR5%2B3qn7MFjuqggj1h%2FWcUdNknD9VweavyBoSya2Skw2gJ684%2BYsX5fnQILo2lnK6vB01q1RTfbRLwsB9i5NWs2phpVvp4oheW6voaYY%2BfsUcDqfTQmK9xatUGHvSXDUvSUbvDjqBHl4K3UvCFW8SpySTrB79JVabnZg5ZXbkH9IA%2BY4bjMq1bzvTAuDq9IFuBr5Q1gOey3%2B3WbaLxCPj%2BVU0&X-Amz-Signature=fff891e4d978f3eeb688dfd0474c52d647eba9d24bf4df38a28011b87f87a30f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - **SAT-Real**: 실내외 실제 이미지 150개
        - 모든 vlm에 mindjourney를 적용했을 때 일관되고 큰 폭의 성능 향상이 나타남
        - o1에 mindjourney를 결합햇더니 sota를 달성함
        - 월드 모델 기반 test-time scaling이 rl 기반 scaling과 상호보완적이며, 실제 환경에서도 잘 일반화된다는 것을 보여줌

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/19e8eb40-e0e1-4833-9934-e7c0040ec557/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZX36KW4T%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044254Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIHBpM03Qqb7vWwIP8Jye%2BSfrBg9ZYqDUrjAbVptn3Nx6AiAJlMXg5UBoWaoiCt4rDLAe8ncFRRCubJLmSZF23G56QSqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMQ3MZb%2F9hJgSjWGkjKtwDioN1VjYFYnsWNxryinwxVnz4lLMoZczLATbsU%2BQT0yvcY9q1RToD8Tf931LtHwmPLLZ798UoWhSYmI4kEn%2F7Evzh6Sr4KKQjXiQtc6IrJf9h5dP1Burjdg%2FSfcCGriRPyxT4VnsZaGD09D17uOEx3O5YZkSCNrwxKHpg8AmFDodspMPKFbvVE6HqVUJ78lwNiIry4404f5zDNtBaGZBw8jkFI2IN4qmiCDauw6DVHLJH%2BId8zODImyBrcHyLfBEBYW7a%2Buq1g2oTuwzqD5y5iepXxxTpsMYewqL8BGihRhYTXuoRjA10o5Dqka%2Bb1Y4ad0AxMKtWjpW95b0x3d1e3L7yc41ka0PxnLV8EnrlzH49AJxnU6Bt%2FdvDrlXCou%2FI5SAT4nlkPbbEV6OXjQYkxE1R9YwzpsySQ1OVm0vEQvzLmbLbSgKXsjQMfseDOIeyqwnOMYMREqW7AHvFKM59s%2FwA0%2BxoFMe9%2BdWlFUQI9Tgwfc5Dkn7Nx8pFXk64minDH7Ju4BdzB2TdYjz%2FsF5QBSUDmFeyTg7Nz9V98AqMAIeTVYFmV%2BzLr3cX%2F3e2DCX8IrAAjDJDW8Ie6h9YPc0It8zR%2B7%2BVFWHqf7DdFKY5%2FMM0WX24V%2FohknLf5X8w6eO50AY6pgGWHX6wR5%2B3qn7MFjuqggj1h%2FWcUdNknD9VweavyBoSya2Skw2gJ684%2BYsX5fnQILo2lnK6vB01q1RTfbRLwsB9i5NWs2phpVvp4oheW6voaYY%2BfsUcDqfTQmK9xatUGHvSXDUvSUbvDjqBHl4K3UvCFW8SpySTrB79JVabnZg5ZXbkH9IA%2BY4bjMq1bzvTAuDq9IFuBr5Q1gOey3%2B3WbaLxCPj%2BVU0&X-Amz-Signature=80c298f78f50a8acad6a3b247b5deaa19540b95fd28699cd728a408ad4a69abd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - **SAT-Synthesized**: 4000개 질문, o1 실험의 계산 비용을 고려해서 500개를 샘플링해서 평가함
        - 마찬가지로 mj 결합했더니 평균 정확도가 올라감
        - 모든 SAT task에서 최고 성능은 항상 mj 적용한 모델이 기록
        - MJ는 특정 task에 국한되지 않고 전반적인 공간 추론 능력을 일관되게 개선함 ~~
- **4.3. Ablation Study**
    - 제안한 탐색 방법의 하이퍼파라미터가 성능에 미치는 영향 분석

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b3746131-b519-4adb-860b-213e7fbac55e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UKMMZVRB%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044257Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCID5Ab%2FObFWsPqh1K3hxSVJ7pi9nptmsR1lLA1A%2BFgnEHAiAsJiF4UKUbaZpb5svvDUTrqUrKzSoJe5hZSVTpkDIiJSqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM5vAfM9r6rJvmEC%2FKKtwDVskR6hJCWEWaFnMlhFfaqAw9KEQwkz6yKj8TJfYfTLp0SVt4sv3PlwY3AWXdN8zyWiKMNtOa6XdyFl7ZIeOL9GarZVOfwCzbsWlYIKxhWPyeq9UeEpqTeHu7zPdJ7ECaPPE02J%2BLQBpm4dgXHLDMzDuoDfun5Bc2PAQXdakUKKj7yu%2F2ksiEiVkldoU1F7887fOfVUP%2F7o5Mg60NExIboWN0KXtFVo4Y1J7rArdmlQIBaj8QBn9kCQiXnPekxtYaI2pXJNfIu5wwWGJvy0N1Ec%2BntJjZB9t6QmpR4rD5ykLHLXFGpsD9w9TEhecrox9J%2B7d81UScyk00Z7oGI4RZ8TqM2mXjP5gENuRR5Ni%2BnXYuonuEKOnZGf38PHtL6mZo8ZB%2FJ%2F99uMhs5pRPO%2FMnJfSAMJzYP8ZmYYFmkkOiXVx6ThEEmNn%2BkxeazJwxIJ%2B94YXeFRAuF442d%2FNJrIXVM8i5wTeLMobdHIbN9z7eKk1feqAVvYBPoVd4qEh8NhiH5YiPwEN5PRIit4KQxNQOEaWPt3PuJtOTMyf%2FRL2Jw%2B111YwdA6PF3%2BIMUNVnJjhEhTeVuCVaXGQ3tMFAMf8mhVNcp5385EhjQySptmiIlFx9oH2SOgjHevsL2sEwgOS50AY6pgEf4p1iPjnwYzpZdg095GgtQKB2B%2FjI9rcMcGgrSeScfXe0E1s29v%2Fo2u6JCxlT1LmhZYdjcISI26EKkdAf4gAjVfmKLyPJF2A07kCyFyDk4%2BomyuM4mlhKkajmDV4HgVef23J7m3EvMEgUnsJ0fHwU6FdrpBigx8wOJCExgYXIaOkIv3jwOawB1NzFF3pCtl8DDkYHGVbXdKbHKeZ1LDrHFaK1KhXf&X-Amz-Signature=2b267fd2f39fbf4452d23ef2b78d3beca24298f114e179cfa68aeb713e2f3743&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - gpt-4o + swm 조합
    - 탐식 깊이 n = [1, 2, 3], pruning threshold γ ∈ {4,6,8}
    - SAT-Real
        - threshold 4와 6일 때 step 2에서 최고점
        - trajectory가 길어지면 생성 품질이 떨어짐
    - SAT-Synthesized
        - 학습 분포랑 유사해서
        - trajectory가 길어져도 성능이 향상
        - 월드 모델이 정확하게 long rolllout을 생성할 수 있는 경우에는 deeper exploration이 여전히 유효함
    - pruning threshold
        - threshold가 낮으면 정확도 떨어짐
        - 특히 sat-real에서 두드러짐
        - 실제 이미지에서 생성된 뷰의 품질이 상대적으로 낮기 때문에 필터링의 중요성이 더 커짐
- **4.4. Analysis**
    - 월드 모델 기반 test-time scaling vs RL 기반 test-time scaling
        - 단순 vlm에 월드 모델 기반 탐색을 추가 > o1 모델 (rl 기반 finetuning)
        - o1에 월드 모델 기반 탐색 추가 → 성능 개선

        → 월드 모델이 제공하는 탐색 정보가 rl에서 학습한 cot와는 다른 서로 보완적인 정보임을 의미함

        - 물리적으로 일관된 상상 공간을 제공하는 것이 기존의 reasoning 능력을 대체하는 것이 아니라 오히려 강화하는 역할을 함
    - 월드 모델의 성능
        - trajectory가 길어지면 world model의 생성 품질이 급격하게 저하되는 현상…
        - 이게 전체 추론 능력에도 방해를 함
        - 더 긴 trajectory를 효과적으로 활용하기 위해서는 기하적, 시간적 일관성을 유지할 수 있는 더 강력한 월드 모델이 필요함

 


## Conclusion

- 요약
    - mindjourney: test-time에서 월드 모델을 활용하여 VLM에 상상 능력을 부여하는 최초의 프레임워크
    - spatial beam search를 통해 vlm은 하나의 이미지 뒤에 존재하는 잠재적인 3d 공간을 능동적으로 탐색, 공간 추론에 가장 유용한 시점들을 선택적으로 저장함
    - 이렇게 학습없이 간단한 방법으로 여러 vlm을 사용해서 sat 벤치마크에서 sota 달성
    - 공간 추론 문제에서는 단순히 추론 능력을 강화하는 것보다, 물리적으로 일관된 시뮬레이터를 test-time에 제공하는 것이 rl 기반 self-reflection 방식과 상호 보완되거나 이를 능가할 수 있음을 보여줌
- 한계
    - <u>**하나의 이미지만을 입력으로 가정함**</u>
        - 여러 이미지가 주어지는 경우, 이를 각각 독립적인 탐색 시작점으로 활용 x
        - **multi-view 입력을 처리할 수 있도록 spatial beam search를 확장하는 것이 향후 연구 방향**
    - <u>**현재 비디오 기반 월드 모델은 질문을 고려하지 않고 시점을 생성한다는 한계**</u>
        - **query-conditioned world model을 개발하거나, 생성 과정에 제약을 추가해서 질문과 일관된 시점만 생성하도록 하는 방법이 필요함**

## Appendix - B. Failure Case Analysis


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/49d25601-8997-4f55-a269-7db880ffc043/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RTK7P6LU%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044244Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCICRGSSweoEa5ypWRvwMVSp5jNonY4UBnd1Qbzb6ZhRIEAiEA2ws%2Fmhfbk14x%2FQlrA4NjBwXSv8%2FjKzzc9xP1tNYFvaYqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGwB2HQUTU6Wjm02dyrcA1jbOEfjweDHNNd1RloGdHB6vDHoiRkA8UCLt3eJW7SJl9iw%2FNBLYZ6JI8kYsE8Rzjei%2Fa8Ynp8U7JcgreHPpxssUsIJuXQEs1QctRETt7MmKXwAg2IxnqpSuxRvQEPc%2B2X2Ze18HyMoLL77BocL2zFSpptT%2B5S%2FLpDY6FGojtQHO1iHGkPh6mW0JKKiOU2sv5SDQdx9XrfjPyTpJHrwgTmCdQDSwgvWbfrq%2Fz56kkpnyJiZLetqauzDkpkcg3mjYlwG5UmjMEMNOXuP%2FMmMyynIO64LRV0GaM8Q%2BrOM0zQWFB0ixNSEaVONgbBmjUx2EDjdy2kc3nugE7nsZy7Jgb3%2FyUMwAaxt%2BLIVjISzymlxDgO2BRRXHvHg1Y%2BXjVSYDckGGwc%2F0glg0sgq99rc%2BW4rjKobEfLCcxM1qmdyvxM8%2FUcLhDZGK%2BO9cD6T4PkCVWeb6poLHuncOH8%2FxWsE%2B91CkyMPlEe7MD4ESOMdU%2FtwyYQ%2FY8wJDIda7v6e9wrf%2BVJbEjBELJXdnVEUA9OGcE4hWQAyrPupD%2F3DfWIe%2B6LWOEDnTkQYHlWqpeMg%2Fi1wesXbU86CA0lI2%2BYzHV7E3TF5sJumHohOdcuZsOdAOH3RKsJA0gct7%2BjHOzGhMMTkudAGOqUBR3yzIaEyMXFr7nnYjh6VXBMYt553uUChmmsG%2BewRuad5ktJY3hc8JgPQq6T9takJzodKNfjRfED0c8iQC2dcLm3yKOIGFxtAmbxCgomNMw5ifDUKaGIzlNtwn0zliNVonijrQ4KAJdAhsyYO%2Fyi2AsN85V4r6Eo%2BfBuTvpQwi5aSNIMRYGwijd6baoAMLsgWAwh6UlFZOIeIngfYyVyFUZN5zz98&X-Amz-Signature=b1189cc2d9d517085cd69e1e3664d152ae95127a1b466fcb26eb87bdf26bd1ea&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- Case A
    - forward movement의 부정확성
        - 생성된 trajectory가 전진 거리를 과소, 과대 추정하는 문제
        - 의도한 이동 거리 ≠ 실제 생성된 이동
        - 프레임 간 이동량도 불규칙하게 변함
        - 원인: 학습 데이터 간 스케일 불일치
            - SVC는 다양한 데이터셋을 사용하며 다른 스케일 기준을 가짐
- Case B
    - 생성된 이미지가 비정상적으로 기울어지는 문제
    - 수평선에 어긋나 있음 → 카메라가 의도하지 않은 roll 회전을 수행함
- Case C
    - egocentric 회전 과정에서 시점이 불안정하게 변함
    - 회전하면서 동시에 오른쪽으로 이동하는 것처럼 보임
    - 특히 swm에서 많이 발생 - realestate 10k를 섞어서 학습했기 때문
    - 해당 데이터에는 이동과 회전이 동시에 일어나는 경우가 많음 → 편향을 학습
- Case D
    - 생성된 이미지에 시각적 artifact가 나타남
    - 충분한 시각적 정보가 없는 영역을 생성할 때 약한 prior나 잘못된 패턴에 의존
- Case E
    - out-of-domain의 장면에서 구조를 잘못 해석하는 문제
    - 다양한 환경을 충분히 학습하지 못해 일반화 성능이 부족하기 때문임
- Case F
    - 사람이나 동물과 같은 복잡한 객체를 제대로 생성 못함
    - 변형 가능한 구조에 대한 학습 데이터 부족
