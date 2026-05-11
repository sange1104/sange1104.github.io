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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/809d6a25-9e97-48f5-8182-f634d9c5d1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667ZUGFZWH%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043452Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCIBWZUbh8gEZJvQA9sR%2FkDA6UqdHgPQDusrp%2FMawdJcqvAiBwMTcvd5u6NJB3JAzK2njIubpxfzHVfLBiSl2kXFt1bir%2FAwgOEAAaDDYzNzQyMzE4MzgwNSIMj2kxPlK%2FJY04%2FZMGKtwDdJ5IxH8MihSOciNgIzed9J4rpEfBKH8tuq6CGH2Bwno%2FJ5CHtHXXLrzoAotWPRwF%2FSGeSgQsIeJa97uT0hd9pXlWzXMEtQ0HRDBsH6YiNWa1TyHwCvSbDG6%2B7MW07f4F5aVnGhwWyKwyg14jFzISUYWOOtkPLtZya8RTotED2iBXOGHYYtPTjj0GJLfU0RtTfRrHS3V0EsiEr%2BYIfldMLb1VLumgK8VJ3nGaztqg1Fqd%2Bs10kel0CLvg9o3laONK%2FhgPSFxuWKZNhChi8Z6XgiW9jLljJrREQYmpUkup2U9rs3LhBD2Ccsr%2FpTHED%2FgnMX8DnmoiNqFJ2cNQ1jWxTEf3lxPiuamC7ubMEWfIqiZCoRp3MzdUxv3FoSF%2F48XeU8lCNbY2fN4hJHcsQxy2UcNEzIWE7y9Vd2NTBPhYmjsgilWoJVT4N8YaBOdlkBfbYcac8bVSV4xRVkvzXKAHXjAFRx0FdTut%2FTS5XWfyzUdRs2m2Y%2Fxy1j2EiRagkuTpdSU7fO1UWDDz5s71n2%2BeWRcwZ1YGuKIwSFoDVJ67hUEYp4VdP9VUUFJY0SSec5YDVCJPUtnAFZ2qZZ5TRY2SUMx6XPmvZN9xBS3%2B7wfdUY%2FihcPwhajOr7W1Q6Uw8baF0AY6pgFrxODuQWlfS4qVNDH3EXePHl4W4DsNmQU76wEXz7cAJTPM3qbnC5xEX4O1pvNldwVcKb2cLJ9LNqgxmZK2%2BRlrHtsyGhDizNvzfeeioCOMTH5pC4bXaYdcUkVbK9BP34RMUB91i2WtIVSgZGM%2BbJuE6KApR%2BA9MdBeqb6mt8MKi2KH3gP9IO7kDTiOOhqZJF%2Fa%2BGRZOr7fFQu%2Bvqgixc17nufN7BBx&X-Amz-Signature=25ec78280ba4589f4f8db45d2601dc8db52baf5f9107a985222702d7585e3d81&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3e62d2d7-97c7-4ac0-a628-cdb3dccb482e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666FLM447Q%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043500Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIDXGEPj2N11zryufjcmn9cMgKYl3qfx1sQTmvpGWNS%2F7AiEAz2Dvw26ZO1pJTyvcGPqrxKQ6aJogjuFDhiC6fFbHnKwq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDHZ4Xfb2GQ%2BtAC1JtSrcAzITuYF26SyKnJWepVFgQEaJp7rMBu%2F%2FqEs0lpIR2UPtw5SOVClCuQWlEx28SAOFx2W6DGqgfjHtfFoC8CVf4oJfhuo7jMqLXPlxJ8%2Bixlk2kX4SHq%2FdtFkYc4DxyCnpo7Vgs6NuOwQX5%2Ba0pezB1Lhb0vr0dnKf2SuYl8SR%2BJxIIvoxDUrUmXTx4fGbS%2FmWBhJu2XDsln2IG8Oek2qS1NDyM8zCh%2BYfyGmf9gpYXpBWjj1%2Fu0QJOMyyKvTKxTDDiGLp5eHieu3nnd3szx%2BYg6fVBU4Dbh0WX1lz%2B6mbjZ5tQ%2FRsR3XS4%2B%2Fa%2F0wlmq4QntEOlpQFuq67yR90%2F19gJg8OXhwK6%2BSUPSWlao9uk0cYE%2BYrChW4QCyr%2B%2BSuEGX8dx8x99bH842UOieKSNkLTTS7LIXAcbFHSUW8H9TUaldEvu56r07gbDe08P8EiIYlEW5ulcI8fVW14hEZQZUjEHSFt4zQtyDmdLXNExFqy5d8V2%2BCLk0q7chvRr9mlV%2FDn3P7TmaE9ld%2BvbJRZ20iswr6ry1twf83%2By81ElvurZRtbZF3sqVoSy4Itg11qdhe%2BgD%2FsQ2goT8JCuNZdNSmtS%2FuvN38pQBZdYnoZJCLcQ8qImzMuYyznvXdhpOaMLW3hdAGOqUB9qpfSFMnUyrKM0P0G0KyzYOZDGCI43362h28%2BY8JbzIAca%2BZ0b2g8XIbO0GIfX%2FjhgV3yCV83Ye6qx5ZnfHyZFigEuPF6kHkeDNrUXwYBj0uv9YVpV0fdgOOfMpWlF7fn8QL08LVQOgQB2t%2FqXoyy6tiZxx2tJB9SyTH%2BU%2Fct1yhdtXz%2FqAycjbO1uJqOq77UOGPaKYg%2FRISX2zPV4HYETD55l3n&X-Amz-Signature=ead0c689dc14259599efa9caa8ec63a034998ff20fed6d751e3040f33ad68e68&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/98028044-fbac-4009-9eb2-fd0f8893ae34/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WHQ67M72%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCIF1GTBvbu%2BWzQT8LZDPC6le6HgTDU6ecMJi8Lr7GCdvaAiB7ZAcTLDKb9uvlE2ICLFqzuyavb2I9bgy0gehzWEFLcir%2FAwgOEAAaDDYzNzQyMzE4MzgwNSIM6D64EU1d4gt5XLkdKtwD2CzXnxz0KBoRvNnO3S8FJWNHaIawQSTB3RSK25TKEY3fq5xWCQV3p69F7mIOCtRRYR9anrncZYS1Awf5PxOqHeF0sO5xTP0A0yWUhJDTW4CW0pXFXMDoLWyV16HmSMUaVyUTONBKy90ggbO%2BJIiMc%2BQCU1q6H%2BXG9avuHpbNElAgPNZkXqxaJaq84UXVgMGJq%2BR2NOtdPxTP7A1ikdQeqyDP0AVoVt%2BVBN1vkKphuw5EF9YoDd4Bm7%2FHI4Ksthdokeh5HyyWNVzX8unqND7seaxk4TIHycMIX8TEnUqzwd4WCTW5%2FcRh5F9s51kDyeg%2BP4RWEQsf%2BGmPa6FN2iXhCfBhCEtY%2BLDcYKVEs7Zv58BdBWMvSYkk%2FluWshp3Fw3%2Bu%2FOYZhkwZzvwcd0Ja1sGjsmtXDppB787Z%2F1yPMke%2FWRzREwMvRjdnCgoEDSDKj8asoZvT3CoF4EBl3kforD1JXppjfaa79jhj88xqTvObz4OzW7gZs4me9wmXZDrKLo4oMLbvQAzb8jrHOKZsx9l%2FA5jr%2BrBifsJ9xWgHggGzroFUODjaU6Khgv1i6x8impI%2B9t4jYsXOk4eMdRNsMaZyKvIvzEKg%2F64vhZwfk7DvWn9SXIi68j4q2zGCnEwyraF0AY6pgEpH5v9a7cGPS%2BED9eH%2F4Dx2XoACh188T23g2DtclAn1%2FE4DTzK1O3ve1cx4BQ3dLksQpAAmUKUMbJnDrT9Ag6VI19OgKu2vWHIrgpCj1878pL8T2cfy%2FgTug8f%2FjnpwXX3BbIXUcOl%2FBg8aXlYw8mSkaDThVLFdHvK5bMuDW5pM0wleH0Eb9QsAGSqJLyMDJ6wkK7K3D%2Bz610uy%2Fm4c0fMEmtB3uom&X-Amz-Signature=00a7b3dd59331386ef2c65d44c579e07d7c580d2a65ff9afccf2faf64c28cef6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - **SAT-Real**: 실내외 실제 이미지 150개
        - 모든 vlm에 mindjourney를 적용했을 때 일관되고 큰 폭의 성능 향상이 나타남
        - o1에 mindjourney를 결합햇더니 sota를 달성함
        - 월드 모델 기반 test-time scaling이 rl 기반 scaling과 상호보완적이며, 실제 환경에서도 잘 일반화된다는 것을 보여줌

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/19e8eb40-e0e1-4833-9934-e7c0040ec557/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WHQ67M72%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCIF1GTBvbu%2BWzQT8LZDPC6le6HgTDU6ecMJi8Lr7GCdvaAiB7ZAcTLDKb9uvlE2ICLFqzuyavb2I9bgy0gehzWEFLcir%2FAwgOEAAaDDYzNzQyMzE4MzgwNSIM6D64EU1d4gt5XLkdKtwD2CzXnxz0KBoRvNnO3S8FJWNHaIawQSTB3RSK25TKEY3fq5xWCQV3p69F7mIOCtRRYR9anrncZYS1Awf5PxOqHeF0sO5xTP0A0yWUhJDTW4CW0pXFXMDoLWyV16HmSMUaVyUTONBKy90ggbO%2BJIiMc%2BQCU1q6H%2BXG9avuHpbNElAgPNZkXqxaJaq84UXVgMGJq%2BR2NOtdPxTP7A1ikdQeqyDP0AVoVt%2BVBN1vkKphuw5EF9YoDd4Bm7%2FHI4Ksthdokeh5HyyWNVzX8unqND7seaxk4TIHycMIX8TEnUqzwd4WCTW5%2FcRh5F9s51kDyeg%2BP4RWEQsf%2BGmPa6FN2iXhCfBhCEtY%2BLDcYKVEs7Zv58BdBWMvSYkk%2FluWshp3Fw3%2Bu%2FOYZhkwZzvwcd0Ja1sGjsmtXDppB787Z%2F1yPMke%2FWRzREwMvRjdnCgoEDSDKj8asoZvT3CoF4EBl3kforD1JXppjfaa79jhj88xqTvObz4OzW7gZs4me9wmXZDrKLo4oMLbvQAzb8jrHOKZsx9l%2FA5jr%2BrBifsJ9xWgHggGzroFUODjaU6Khgv1i6x8impI%2B9t4jYsXOk4eMdRNsMaZyKvIvzEKg%2F64vhZwfk7DvWn9SXIi68j4q2zGCnEwyraF0AY6pgEpH5v9a7cGPS%2BED9eH%2F4Dx2XoACh188T23g2DtclAn1%2FE4DTzK1O3ve1cx4BQ3dLksQpAAmUKUMbJnDrT9Ag6VI19OgKu2vWHIrgpCj1878pL8T2cfy%2FgTug8f%2FjnpwXX3BbIXUcOl%2FBg8aXlYw8mSkaDThVLFdHvK5bMuDW5pM0wleH0Eb9QsAGSqJLyMDJ6wkK7K3D%2Bz610uy%2Fm4c0fMEmtB3uom&X-Amz-Signature=8eceea278b236b98d7ca584d23446624daaf5112b1cba54365687c3fc7849813&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - **SAT-Synthesized**: 4000개 질문, o1 실험의 계산 비용을 고려해서 500개를 샘플링해서 평가함
        - 마찬가지로 mj 결합했더니 평균 정확도가 올라감
        - 모든 SAT task에서 최고 성능은 항상 mj 적용한 모델이 기록
        - MJ는 특정 task에 국한되지 않고 전반적인 공간 추론 능력을 일관되게 개선함 ~~
- **4.3. Ablation Study**
    - 제안한 탐색 방법의 하이퍼파라미터가 성능에 미치는 영향 분석

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b3746131-b519-4adb-860b-213e7fbac55e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666Q5RNL4Y%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043505Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJIMEYCIQDoG9GUAWn08xTq85QCUQiTA6HZHRjlXsnxVx6l6%2B6A9wIhAJXtQW96z5aANDP456eE1RF3ELaSBjaJOHhkZoIvEWqcKv8DCA4QABoMNjM3NDIzMTgzODA1IgyqMCkhAXITt1tRi7wq3APT%2BTQ5mc%2B5moT9s6n09WiF5JC0HpL3jrBsH0mlYyMh%2BbWa6aLwEOcpzz0jmDHishvDyODIMBpTNC04wvTXxbb7GsclZfVRlA1MyLgSkKq0NPXRUccb%2Fk3HpW6nkAwcFhHyBT5CL9ellssTvke6AStFBmAVdyGLgD1VunoMLdTpDOYF%2Fv8WA7TZIrEG9mSQQtneXlSdIH%2Bst1gY7ZrSxMSMZD8W8HyGBd4aY09BdtfOPuxVGO4ctc9CbT4ArYUO0RoXfJ9wWzpWGa8P8lFW0twLGCpEutzTtFupPQSqY29RYX1xDbNPvP6eqU3RL3Mgex2B2ARhA7DbdfqIM8U9pZ12xRDJ9JCF2E9plYciBVifqiny%2B4qR%2FPm4bhxA6j0%2B5J3lu1v%2BhkYz7ftJQ8fETu64tEjbpL9FiSmkR2hLgl3tS1zF9nQtqYPWB%2FpCSCXwefA9TDFPXh0J6JAEFSzWl2cQFOtPUQqqZOqjpjlskLTq3M5Gph2Lpz9EPfxRKdJHyxAJjPxI2X4oOo3XS7jkHjib0I0MtSFPZ2hsTB3D1rMqY6LSd89tuoaD9m2Y6VyCqVu0QkdZSsgTU2LCTPuDiBKSube0nS7M%2Fg5ICz2QI0Ku9pHQ6LiSbXmajTFw%2FDDmt4XQBjqkAdBBpDepZVRGvD8h6YF35VLOhHWoRYt%2BBf0936AmQccGEX6M4uYJcWDXjyMpJBfsZpEVBlmLnvU3thL%2BNZhYajY4oL7ckefHA09vHUDhH%2BJqnazn6R90KkI37%2FLmRHnU%2BEB4x2RKQdnibo7uVmQ%2F%2FbcSwN8gKCEStbA0By8aFk9pAh%2FcaeJMPfNUMTH8WK4QDui4G8nt0tu5Hkeefpu0VRNy5ifQ&X-Amz-Signature=2cb49a0a6a382960e4348630773d0ef2a5252bbe8ede7dc84d34d7cba15e9c6e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/49d25601-8997-4f55-a269-7db880ffc043/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667ZUGFZWH%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043453Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCIBWZUbh8gEZJvQA9sR%2FkDA6UqdHgPQDusrp%2FMawdJcqvAiBwMTcvd5u6NJB3JAzK2njIubpxfzHVfLBiSl2kXFt1bir%2FAwgOEAAaDDYzNzQyMzE4MzgwNSIMj2kxPlK%2FJY04%2FZMGKtwDdJ5IxH8MihSOciNgIzed9J4rpEfBKH8tuq6CGH2Bwno%2FJ5CHtHXXLrzoAotWPRwF%2FSGeSgQsIeJa97uT0hd9pXlWzXMEtQ0HRDBsH6YiNWa1TyHwCvSbDG6%2B7MW07f4F5aVnGhwWyKwyg14jFzISUYWOOtkPLtZya8RTotED2iBXOGHYYtPTjj0GJLfU0RtTfRrHS3V0EsiEr%2BYIfldMLb1VLumgK8VJ3nGaztqg1Fqd%2Bs10kel0CLvg9o3laONK%2FhgPSFxuWKZNhChi8Z6XgiW9jLljJrREQYmpUkup2U9rs3LhBD2Ccsr%2FpTHED%2FgnMX8DnmoiNqFJ2cNQ1jWxTEf3lxPiuamC7ubMEWfIqiZCoRp3MzdUxv3FoSF%2F48XeU8lCNbY2fN4hJHcsQxy2UcNEzIWE7y9Vd2NTBPhYmjsgilWoJVT4N8YaBOdlkBfbYcac8bVSV4xRVkvzXKAHXjAFRx0FdTut%2FTS5XWfyzUdRs2m2Y%2Fxy1j2EiRagkuTpdSU7fO1UWDDz5s71n2%2BeWRcwZ1YGuKIwSFoDVJ67hUEYp4VdP9VUUFJY0SSec5YDVCJPUtnAFZ2qZZ5TRY2SUMx6XPmvZN9xBS3%2B7wfdUY%2FihcPwhajOr7W1Q6Uw8baF0AY6pgFrxODuQWlfS4qVNDH3EXePHl4W4DsNmQU76wEXz7cAJTPM3qbnC5xEX4O1pvNldwVcKb2cLJ9LNqgxmZK2%2BRlrHtsyGhDizNvzfeeioCOMTH5pC4bXaYdcUkVbK9BP34RMUB91i2WtIVSgZGM%2BbJuE6KApR%2BA9MdBeqb6mt8MKi2KH3gP9IO7kDTiOOhqZJF%2Fa%2BGRZOr7fFQu%2Bvqgixc17nufN7BBx&X-Amz-Signature=2f83a449670dd42f3dab056b524b4745f420e20729f36547bff5abf4f0dfaa1b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
