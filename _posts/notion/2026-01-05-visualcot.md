---
title: "Visual CoT: Advancing Multi-Modal Language Models with a Comprehensive Dataset and Benchmark for Chain-of-Thought Reasoning"
date: 2026-01-05
categories: [blog]
tags: [mllm, vision-language]
---


## Abstract

- MLLM의 발전 - 여러 VQA tasks
- 하지만 **interpretability가 약하고**, 답에 관한 정보가 있는 지역의 크기가 작은 **복잡한 visual 입력을 어려워함**
- 이 문제를 해결하기 위해서, 본 연구는 <u>**대규모의 visual CoT 데이터셋을 수집하고 제시함**</u>
    - 438k의 question-answer pairs
    - 질문에 답을 하기 위해 필수적인 핵심 지역을 _**bounding box**_로 표시함
    - 이 중 98k의 데이터셋은 _**상세한 추론 단계**_와 함께 annotation됨
- 또한, multi-turn 프로세싱 파이프라인을 제시함
    - 다이나믹하게 visual 입력에 초점을 맞추고 해석가능한 생각을 제공함
- 관련된 벤치마크도 제시함 - 특정한 지역 파악에 대한 task
- 광범위한 실험을 통해 효과성 입증, better 추론에 대한 가능성 제시

## Introduction

- MLLM의 등장과 발전
    - LLaVA, SPHINX, Qwen-VL
    - 입력 이미지를 시각적 토큰으로 변환해서 llm과 결합하는 방식
    - 여러 task에서 그 성능을 입증함
- 기존 모델의 한계점
    - **블랙박스 구조 & 환각 현상**
        - interpretability가 부족하고 hallucination 생김
        - llm에서 효과를 입증한 chain of thought 기법이 mllm에서는 제대로 탐구되지 않음
    - **비효율적인 이미지 처리**
        - 인간은 복잡한 시각 정보를 처리할때 전체를 훑고 그다음에 중요한 영역에 집중하는 방식을 사용함
        - 하지만 기존 모델들은 고정된 해상도로 전체 이미지를 한번에 처리하려 하기 때문에, 세밀한 정보 파악이 어렵고 인간처럼 효율적인 추론을 못함
        - 인간처럼 추론하려면, 모델은 핵심적인 정보를 담고 있는 지역을 찾아서, 관련된 문맥을 포착하기 위해 그 지역을 확대해야 함
- 이를 해결하기 위해서, multi-turn 대화와 dynamic한 시각적 집중이 가능한 새로운 방법론이 필요함
    - 💡 중간의 visual CoT supervision이 있는 데이터셋이 없음

        **→ Visual CoT 데이터셋 구축**

            - 질문에 답하기 위해서 봐야할 핵심 영역을 바운딩 박스로 표시한 438k의 데이터셋 구축
            - 이 중 98k는 상세한 단계별 추론 과정이 포함됨
    - 💡 유명한 mllm 파이프라인이 정적인 이미지 입력에 의존

        **→ 인간의 인지 과정을 모방한 새로운 모델 파이프라인**

            - 이미지에서 관련된 핵심 영역을 찾고, 확대해서 세부 정보를 파악한 뒤, 전체 이미지 정보와 통합해서 답변을 생성하는 파이프라인
        - 관련된 visual CoT 벤치마크, 사전학습 모델 제시함
- 기여점
    1. <u>visual cot 데이터셋 제시</u>
    2. <u>mllm의 새로운 multi-turn 프로세싱 파이프라인 제시함</u>
    3. <u>새로운 visual cot 벤치마크 제시함 - 특정한 지역 또는 객체를 찾아서 답변해야하는 task</u>

> 💡 기존 모델들은 이미지를 통째로만 보려고 해서 디테일을 놓치거나 엉뚱한 답을 하는데, 인간처럼 중요한 부분을 자세히 들여다보는 능력을 가르치기 위한 새로운 데이터와 방법을 제시함~


## Related Work

- **Multi-modal LLMs**
    - mllm 초기에는 llm을 일종의 scheduler로 사용해서 시각적 작업을 수행하는 전문가 모델들을 연결하는 방식
    - 최근에는 visual과 language라는 두가지 모달리티를 직접 “정렬”하는 데 focus함
        - LLaVA : 이미지 토큰을 llm에 맞게 변환하는 projecter를 학습함
        - BLIP-2: Q-Former라는 구조를 사용해서 이미지 특징을 학습
    - 최근에는 2-stage로 학습함
        1. 이미지-캡션 쌍으로 pretraining
        2. question-answer 쌍으로 alignment를 수행
    - 여러 분야로 확장
- **Reasoning Capabilities of LLMs and MLLMs**
    - llm은 in-context learning, cot 프롬프팅을 통해 놀라운 추론 능력을 보여줌
    - 하지만 visual과 language의 domain gap으로 인해 mllm이 이러한 추론 능력을 물려받지는 못함
    - 관련 연구들
        - 데이터 통합: flamingo
        - 시각적 grounding 활용: Shikra, KOSMOS-2
        - 추론 단계 학습: V*, CogCoM
    - 위치 정보를 활용한 선행 연구와 다르게, 본 연구는 단순히 위치를 찾는걸 넘어 중간 단계의 시각적 사고 과정을 명시적으로 데이터셋으로 만들고 파이프라인에 적용했다는 점에서 차별점이 있음

## Visual CoT dataset

- 데이터셋 구축 배경: 기존에는 MLLM이 답변을 생성할 때 <u>**이미지 내의 특정 영역에 집중하도록 훈련할 수 있는 데이터셋이 부족**</u>했음
    - 이 공백을 메우고 모델이 **해석 가능한 중간 단계의 시각적 주의 영역을 출력할 수 있도록** 돕기 위해 데이터셋 구축함
- 구성: 438K개의 데이터셋
    - **Question-answer**
    - **Visual cot bounding box**
    - **상세 추론 단계**: 전체 데이터 중 98k의 쌍에는 단계별 논리적 사고 과정이 추가로 주석처리 되어 있음

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V6HAT25W%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140331Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDiOiXq%2FlMaQ0cSiejcKoLTBtypeTblcIynozXPk%2BNQeQIhAM%2BW7ARFtNi%2BGT1YaWxd8%2B%2BSER9T2GcJ4v8EnlzSeBTnKogECLb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy4WIofiPCxle%2BmOz8q3AOsYho2JhkDv4NsQLmjRiOHb5HYBv0gLXQ2NFCOV5NsBDW%2FSQSbdVsVFw3AP9fi75Uec4PO5B5Z6%2BShGo1BLLicfKu9GGrjZLYq3vEKibZlRQjbrNsSDtiJzI%2FLfcL0XDxq%2BPNS%2Bl40FI6EY%2FcQTvp8%2FXO3k5YYQ0CzJSZRJ5h3Iwekg5%2BBxoLXpWoRYkNeuWrFChvQhsW9A538sptir%2FAr0jCtYwBjNckIps0cFkrwww3n7e%2FZcy3z28tkmmk5BUGjDqCNvdJd5Y9dVw5r1NGnDU2feHhMyV5JcgFhsca7QPMpbW9zb7%2Ftp5V357cgzn%2B0QTosIEu%2FCz%2FMda6D28vz5%2FoTHdfSA%2FheQt0K5eQHn3e8%2F3TFffmlPkPbeJxzs%2B%2F4Ogf75EX8u%2BnAnxTzFurMFna7trs7uHmLzqOChGvlFGgCGNVBWt6mwkirQ1xNf%2F0RS6T0pl%2BGDtz232dQILNF9eITqDkTryrMMpHOcxZMI4lxgaGi85zi5zCgmFOCmSdY%2FUWz2ry7f4HzLayCjxow2xzWOc%2FTG0G3ovarMNZvnq3aYUk8tNj1v6Mn5UGIolvf8VsUDBO6k6RqYcW8tifs%2FcYhfqu0Xl3W9Re8EEKgBVKbBBhhY62qogeqPDD6%2BvfLBjqkARGMv%2FJ8mDqUvPmPdeSTmTZX2eZXxgJtvlVj90hB4sRB33FMH%2F85LWtAjT%2FCcOaXSNKHpJ9lpLebC%2BBQR4LVr4XPE0KGq1aYQ8jYp65EpoC7ZL0plCFO4t%2FOBDTaSkd5oDf2c80hR6Th5UYud%2FKRcEUHk6YYTXvXJPgs%2BYMhV0d3ekp4u0R7aCzfyarPDJkAs6u1oRXrcpPqNQsMSRUATtFZBnOK&X-Amz-Signature=1ed29c35eb2a2ae95b6fb258ab736558881a3a826d7704519fc601f1ee45160e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665T43LIAT%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140331Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCoRdDBTxpKYvs9N08O9R9US6dEpwE9uub9UcFhBkEiXwIgYCgMGNSyrGZKbOAtXaLo60VNOg8JiCvN3EoVD4ISxc8qiAQItv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIKSIITHr8D%2FBswBaSrcA%2FvbpdYBjsHX03PS4qOwa2r4rcQ%2Bf9mE9%2BC3RbpUqMRzXgunt%2F6WOj4M%2Bi2%2BUVYTbO6X7mO8GuhmuB73Zau39ZbIQ3GwjGQGzMg%2Fg86rArfnmptfopkIKiu9kH1PKfUQuitZ0WQIJ8H3NGFep2KUyZwYi4MAfRw%2FCaVgVYevb82OV5qgv4KIFiRs7MBO3Hwi1IXZfX5nr2vkMXUe5uM3SKbcKtVVHyF6oXAFq9fr6Qt6OyK4H%2BSarGWjUUVElHtMuDRzeDQGYxe0dh%2Fv5ynK2aKi%2BV5MFoMvU3F52WhCa9YQio%2F5j5osxh4roowZz%2B5BZkVNz1qP3m9qoYRKpTbLnGGm3lvh3jMDdJSi6j3zyD%2B1tyznOOIXKnfANE9NJJccgVD%2BFalEcP4R9un8sDiyMOzmDG7Qz3%2FAwkabZwz5Dcu83MwQC43xCu%2B1iACDu5BogfM3rKeWwy9y1BMTeomkQky%2FGxL6oXTp5NzLRcZzh1sf3L1v%2BublvB%2FneQqFEtDuOS6KNZ1QRFAvn6yLUNniahUqodXzml1vfpWUuTgaTOGk8AQtoN0YuOlAshVdlbPXPji4xL6Shv3hotAyC5N%2FFqfcIjpaJkVIM9F%2Fc2ajeAjbt5wz%2F8dfNSF5RRzfMKb798sGOqUBENvk9DT%2FZiJvZXs5klrWazuWdEyP2jZM8PLaoK8WhugovnoS3kAtHNDjOucRQ7RKmT3gDXhvd9Hp0biNudDBstciFYv5CfEW%2BkWvqOseWD2XCgXijVO9J7SeVrExJ%2BZ3soauDDutzNMP0%2B%2Bhnk4lSYwHobEIKlXJ9lcAdYMM2CKrj7oclKAFtx%2Fj6b7mcnNOaYrLkaYbmAOVgPnnMVOHnCoKa51U&X-Amz-Signature=d9445a7e8194f180ec0c2ab767c0cb8b36d9815b3ab2d821a323729525802d7f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 모델이 단순히 이미지-텍스트 pair를 넘어서 “어디를 봐야하는지”, “어떻게 생각해야 하는지”를 훈련할 수 있도록 설계된 포괄적인 데이터셋임

### **3.1 Data Generation**

- 어떻게 원본 12개의 데이터셋을 활용해서 visual cot 데이터셋을 구축했는가
    - 기존의 이미지, 주석을 사용하되, gpt-4와 paddleOCR 같은 도구를 활용하여 부족한 질문-답변 쌍을 생성하거나 시각적 근거 (Bounding box)를 자동으로 추출함
1. **Text/Doc**
    - 데이터셋: TextVQA, DocVQA, DUDE, SROIE, TextCaps
    - 이미 질문과 정답이 있는 데이터셋은 그대로 사용
    - 캡션만 있는 textcaps의 경우, gpt-4가 캡션을 기반으로 질문-정답을 생성함
    - paddleOCR를 사용해서 이미지 내의 텍스를 감지하고, 정답과 일치하는 단어나 문장이 포함된 영역을 visual CoT 바운딩 박스로 지정함
    - 필터링 파이프라인을 통해 지정된 bbox가 직접 질문과 관련있는지를 보장함
2. **Fine-grained understanding**
    - 데이터셋: birds-200-2011 (새의 종류와 속성, 부위별 위치 정보가 포함)
    - 모델이 이미지 내의 미세한 디테일을 식별하는 능력을 테스트하기 위해서 **특정 새의 특징을 묻는 질문을 구성함**
3. **General VQA**
    - 데이터셋: Flickr30k, Visual7W
    - Flickr30k - 이미지 캡션과 객체 위치 정보가 있음
        - 이 객체에 대한 질문을 gpt-4를 통해 만들어냄
        - 이 객체 위치가 bbox가 됨
    - Visual7w - 객체 수준의 위치 정보가 있는 question-answer pair가 있어서 바로 활용
4. **Charts**
    - InfographicsVQA
    - ocr 기술을 활용해서 정답이 위치한 영역을 식별하고 bbox로 활용함
5. **Relation reasoning**
    - Visual Spatial Reasoning (VSR), GQA, Open Images
    - 위 데이터셋들은 객체 간의 **공간적 관계 정보가 풍부**한 데이터셋들임
    - 질문과 관련된 객체의 bbox를 cot bbox로 지정함
    - detailed reasoning steps
        - **gqa 데이터셋** - 객체와 관계에 대한 <u>**scene graph를 기반으로 gpt-4**</u>를 이용해 단계별 추론 과정을 함

### **3.2 Dataset Analysis**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BCVKMF4%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCaJMpLFPzaj6LufhNGhauNVkPlJhbwmOdRlykMKPrduAIgXKa4niavkt9Qj1T0qXRy0OJUwNkqWAq%2BmcNdTNYH3SkqiAQItv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDONakQ0S6rp7TJfjPCrcAwQkkDA32LgdVf%2BVhkTYjrcPPZcQGDWONY%2FZBgcflgSiEHULBBVMsS8uT8l0Sgf3vdLERBpupaGyCGTqGJui%2BoVSNu4Ep1G5P8y5kE%2F%2Frd6xPswUQXU7YsJNPdAl6Qya8k%2FbSl64WGyGU09k3Ty2sKNIzFheLlGFgxgofdm%2Fa5VrWD9cS5L%2BqnAdxgmhti7YsscFIzkmCEowtI%2B2rvqeuHpYx25cK2T%2BI%2BV60qKbU1jI2ImzYnsu4IKhZIUWTRAaQZ0iaugUWviDMsvhUfyAT%2FuxN12oit6bMkM8llOy2FiMONa15pTKY%2BcZ%2Bh8FMxEZvy1m4pJcyNY2aMEXws0gih0XLFADA0DjnyKcaDbvd7%2FAue7eoKFbRkbqtmH6jwLigC84%2FsETHdGrGXD3vtylSmcppFq%2BAKs0lOpTSUFVxQCZ5vYRKnHbwipfDFZ5HJo1gKeCz1KqziXA2y8FW0PkevyNTWZbxKkgFVEsBpa%2F62H4qrdi20S8hLyE6RYJLDcJQdfB5bcz4g1O0lOfMJ9MCy%2FMTJM%2FZmoQ6MfB03TrjU6LeebuNPAPPms6g33WPgJyrvpWLZeArEdTJx7Kw7AoeYk95St9RL7RmhSdlqm7iCOw11IKN1XcgTzk2noPMKb798sGOqUBefleiZ2sG6s9RaGEDZgWi%2BkYb4ac7EibIbgwnxmtuV7d2ZJCI9ehiBx4KheyefdJxr5tcI9CZxBlPuQ3U6V%2BaPlsP4nnVriGhXZJ1GO85AXjgIErL52kXtiKG5dE6UfILbaIjd538Oy0NkNxYb3p9EYnTZ2PbtcBzafV%2FciAO7gxDej30nZAF4byI2KQ7Bp6NRgQ7PHlGNjhOMlWfH9YOpY%2FRSy6&X-Amz-Signature=d7acbc7b6294e379b9a5871fb477569afd77222e21a3bb7de074577f6790084b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- bounding box 크기 분석
    - 전체 이미지에서 bbox가 차지하는 비율을 기준으로
    - 소형 (1% 미만), 중형 (1~20%), 대형 (20% 초과)
    - text/doc 데이터셋에서 대부분 small/medium임
- 평균 영역 비율: 전체 이미지 면적의 13.2%
    - 나머지 86%는 질문 해결에 불필요한 정보일 가능성이 높음
- 평균 픽셀 크기: cot bbox의 평균 픽셀 크기는 247.82 픽셀임
    - 일반적인 비전 인코더의 입력 해상도가 보통 224~336 → 핵심 영역만 잘라내면 화질 저하 없이 딱 입력 가능함
    - 입력 이미지는 매우 큰데 비전 인코더의 입력 크기는 작아서, 보통 down sampling해서 이미지를 넣음 → **핵심 영역의 정보가 손실됨**
    - visual cot의 필요성: <u>**모델이 핵심 영역을 먼저 찾고, 그 부분만 확대해서 보는 능력이 필수적임**</u>

## Enhancing MLLMs with Chain-of-Thought Capabilities

- visual cot 데이터셋을 활용해서 멀티모달 성능을 높이기 위해 제안된 **VisCoT 프레임워크**와 파이프라인

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BCVKMF4%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCaJMpLFPzaj6LufhNGhauNVkPlJhbwmOdRlykMKPrduAIgXKa4niavkt9Qj1T0qXRy0OJUwNkqWAq%2BmcNdTNYH3SkqiAQItv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDONakQ0S6rp7TJfjPCrcAwQkkDA32LgdVf%2BVhkTYjrcPPZcQGDWONY%2FZBgcflgSiEHULBBVMsS8uT8l0Sgf3vdLERBpupaGyCGTqGJui%2BoVSNu4Ep1G5P8y5kE%2F%2Frd6xPswUQXU7YsJNPdAl6Qya8k%2FbSl64WGyGU09k3Ty2sKNIzFheLlGFgxgofdm%2Fa5VrWD9cS5L%2BqnAdxgmhti7YsscFIzkmCEowtI%2B2rvqeuHpYx25cK2T%2BI%2BV60qKbU1jI2ImzYnsu4IKhZIUWTRAaQZ0iaugUWviDMsvhUfyAT%2FuxN12oit6bMkM8llOy2FiMONa15pTKY%2BcZ%2Bh8FMxEZvy1m4pJcyNY2aMEXws0gih0XLFADA0DjnyKcaDbvd7%2FAue7eoKFbRkbqtmH6jwLigC84%2FsETHdGrGXD3vtylSmcppFq%2BAKs0lOpTSUFVxQCZ5vYRKnHbwipfDFZ5HJo1gKeCz1KqziXA2y8FW0PkevyNTWZbxKkgFVEsBpa%2F62H4qrdi20S8hLyE6RYJLDcJQdfB5bcz4g1O0lOfMJ9MCy%2FMTJM%2FZmoQ6MfB03TrjU6LeebuNPAPPms6g33WPgJyrvpWLZeArEdTJx7Kw7AoeYk95St9RL7RmhSdlqm7iCOw11IKN1XcgTzk2noPMKb798sGOqUBefleiZ2sG6s9RaGEDZgWi%2BkYb4ac7EibIbgwnxmtuV7d2ZJCI9ehiBx4KheyefdJxr5tcI9CZxBlPuQ3U6V%2BaPlsP4nnVriGhXZJ1GO85AXjgIErL52kXtiKG5dE6UfILbaIjd538Oy0NkNxYb3p9EYnTZ2PbtcBzafV%2FciAO7gxDej30nZAF4byI2KQ7Bp6NRgQ7PHlGNjhOMlWfH9YOpY%2FRSy6&X-Amz-Signature=794eb22b511890b2059d18f0dd20e78a01712da3fa73678b675d2f19020368ad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 특별히 복잡한 구조 x, visual encoder로 clip, llm으로 vicuna를 사용함
- **multi-turn 처리 방식**
    1. **CoT 프롬프트 입력**
        1. _"Please provide the bounding box coordinate of the region that can help you answer the question better."_
        2. 위 프롬프트를 질문 뒤에 추가해서 입력함
    2. **핵심 영역 식별**
        1. 모델은 전체 이미지를 보고 질문과 관련된 가장 중요한 영역을 bbox 형태로 예측해서 출력함
        2. 훈련 시에는 **정답** bbox, 추론 시에는 모델이 **예측한** bbox
    3. **이미지 크롭**: 예측된 bbox 부분을 잘라내서 local 이미지 x1을 만듦
    4. **feature 통합 및 답변 생성**
        1. 전체 이미지의 특징 + 로컬 이미지의 특징
        2. 통합된 특징을 모델에 넣고 최종 답변을 생성함
- **visual sampler**
    - 단순히 bbox대로 자르는 것이 아니라, 비전 인코더의 특성에 맞춰 이미지를 처리하는 중요한 모듈
    - **정사각형 유지**: clip 모델은 정사각형 입력을 선호
        - bbox의 가로/세로 중 긴 쪽이나 인코더의 입력 크기 절반 중 가장 큰 값을 기준으로 샘플링 크기를 정함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663EIDIKT5%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140344Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBgfP%2BYVcpgeRnmZdka4Q50Us%2BOva1yHx%2Fas%2BPRLLhQgAiEAoKVAtLpbDNIM7xmIBgtDbhbUWG2jvPYsP7hvi2oIPccqiAQItv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDto8ei8fWsnk%2Bk0qyrcA9za0V7q6TtVgtv%2BygHmOG30yk%2FtnP7Of%2F7YYEYF8CXCnXcYFjjbh6UDjxB3ssE3ysGnNdNgR9bb1%2BMTCQn1p049BPzrWmzOWmjgayzRKfdowD%2Bms2nOMz0e%2B14pAHbLMlpUkP5UGxrriXf3Xn%2BXsmBpv9JoUYzhH%2FlkhXrzrpI6efRc%2B6u%2F%2B24RDqYc1uOfv2lTKWeIXZLlDdiIgpqmU4yxZfM5DqhnH%2BjrP9X%2FsRaQMnt4v6WL%2F4V1hLUy0os%2B%2FF8q9HI8RAvQuig5G3VDEXumlNPUc%2FRB%2BKqR6qW29mGxhguc%2FQjmGxyhlCHFqmYwejNotuGG9PBez9DhN67a0TRp7weVGvqXS0g2LMurqgudGFDT5wpt5BwumIQENxK%2F%2F%2BetTjK%2BoHl%2FmxYCVlHeIE%2BlsSrTlvurufTjxPfD5ifuyguXL3UQ%2F2gVQ6BadL6iGpAY56uZJKy7fAIt0UE08beK%2FZ0qlLDGkFXmWRnk%2FdQDm0ZhZDquZgbk%2BiOprPmRD64bAVJCUg%2FM8FCGitx9E6kmubBdwaukg4QSUaasuMVmJSolg4mhFn3CH54vYgVl41wZt1p%2FsxVI5RFpUEJ%2B2oFS%2BmzS7xr41YnaSY9o3FUT%2FNuC7tAc6tjm8D58MMz898sGOqUBv6UWkuJoOKZ0sLN625CwpRYhJL5H0kXYEcSFK4F4SfByMU9PCzoBviQFbxm0LJhDJixri2rrbOY97rALDx8u9wO8h244GIkOo8ScGPvTVibW6%2FzaN%2FZJ59i80saiTp1bWY2rb97fRIJX6xSI%2BjucsQaK%2BuiXGG4jDew3awiPqc94ioRdvBTestME%2BM0lLQ1elBpE3szMFNjrUzUOmZWrbtJJf%2BUW&X-Amz-Signature=c9bf7ae1b3fe38b10dacd7c36ffda6357e3f947d61d9929a89b9308801b97002&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 문맥 보존: 너무 타이트하게 자르지 않고 **주변 문맥을 포함하도록** 영역을 설정함
    - 경계 보정: 잘라낼 영역이 이미지 바깥으로 나간다면, **중심점을 이미지 안쪽으로 이동시켜서 검은 여백 없이 유효한 이미지 정보만 담기도록 조정함**
        - 가장 바깥 부분에 해당하는 영역인데, bbox가 크기보다 작아서 크기대로 자르려면 이미지 바깥으로 나가야하는 경
- 추론 시 2가지 모드로 작동함
    - with visual cot: cot 프롬프트를 추가하는 경우
    - without visual cot: 일반적인 mllm처럼 이미지와 질문만 입력해서 빠르게 답변 가능
- 학습
    - 1-stage: llava1.5처럼 visual encoder랑 llm은 freeze하고, image-text 캡션 데이터를 사용해서 projector만 학습
    - 2-stage: 모든 weight는 trainable / visual cot 데이터 사용함

## Experiments

- **Visual CoT benchmark**
    - 이미지 내의 특정 영역에 집중해야만 답을 할 수 있는 시나리오를 평가하기 위해서 어떻게 벤치마크를 구성했는가?
    - 데이터 구성
        - visual cot에서 사용한 5개 도메인의 12개 원본 데이터셋을 활용함
        - 이미 공식적인 train/val 분할이 있으면 그걸 사용함
        - 없으면 random하게 나눠서 벤치마크를 구성함
    - zero-shot 평가 설정
        - 모델의 범용적인 능력을 테스트하기 위함
        - SROIE, DUDE, Visual7w의 test split을 사용해서 zero shot 성능을 측정함
    - 평가 방법
        - chat gpt를 평가자로 사용
        - 모델의 답변과 정답을 주고, 의미가 얼마나 일치하는지를 판단해서 0부터 1까지의 점수를 매기도록 함
- **성능 평가**
    - VisCoT 모델, LLaVA-1.5, SPHINX

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LZVN3HE%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140348Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEJLW%2FJkHdAD35AeA5QalnhCztgzT4ic%2BId8Jm8DLmqLAiBseVumOupCabNPJJddcV5smGUXZG0J%2B64uf2CZyh0IAyqIBAi2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMTlSTxQf7ILYiS4I6KtwDhxgrxmmx2jXZc%2Fr2ook7nuw1wr1QcU%2FTFuCtZDcq7Wn%2BVTjxdY9aJchPaULPfxnr9FJ80TiKTlMeoxdFCPYcS2uk92TDWlDfS%2BYRJDC8LhdXlOZUSzxDw8E9Ba7JIDmq%2BDSMQhaT6CQh%2F2i5bs84O6GVoKBY%2BLlGDknif4hNC%2BeHiXxMFNknwZ4A%2F8P3%2FKjLeDfFe1ER5ZZbHBVNkwReN1hpi04CNnzAiugvsVeF15iIFSVHV54B5FFY%2FQbS1rQHetVrgr4IFogBlm5UNyt29keUx75FU8hILMLybBE2ChEvFjZNkSLimntolA76mas3FTdIaPelzAL%2BvuZk%2FCyteKATGuaWU1kzmYqWPOGxr8KOzFePMP9Xht5BTe2bJP%2Fvs0sAYSGkbrxIgz15xs2G740vyGcC6kEDQ7OiXiI2Qs6o5ki8XIZi9d2GsHCpnHmwblyuIXbatM%2FJNQn53WZan3yK9FMYfjoYdHg8Wy4h4SKj5w9dXfeF20C2cJotoKWcUcNxqTVxmq4GurgcR6FDrq%2FtPLOWfVNKqzC2Mb5yxC%2FX8V8OZg1pGzPvg1Ttm5K0QpTQfLhTsrcYYaj0tEpAjiztDG0rpTvri58hmjJfA2J8vYVPK4W%2BDnqI84Qwpfv3ywY6pgHIgMZJFtItwtR0cJOOe9%2FOSQspLTcXZMDaztYLjaIgjBBoa8F1aVATQchYGPdPLr6vMn%2BIT949wk6Lk4asTi7UTOd%2FBchevDOq64Xd7auii1uhEbZEyfxOKxnhLC9dHKefQkywA%2B410YjOnix2TjLlHuQ5NOE03cTcrPaXanWwisPDwSBFsXOUKDqgmYYYF53uQ8IxmeXeV6kl4cg24DsdOQdxbjpH&X-Amz-Signature=f661544b80fe4bc23df71e4b9032b681d2d7223953e17a892c4c616921248b99&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664E2EYNSJ%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140348Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIE9HvdYvWUZWHhXqWq8Pc1QA9tc695IpmBJoRzCd2k1wAiA9%2BtsC5vf%2FWSrEs2vqr9Huj1%2Bgelzd%2B0Sg6Pk1pbyVeiqIBAi2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMdAenL0WHBi13PVp9KtwDnLA%2BvTyJzFJbSdTI01S6quwqD9%2FCkyVnHNzEgNheed6U7yaRyb%2FvlhW0PZ0kHiqBqZuf8pZv13gTV%2BaACbcXEAGjWWsytu%2F4oxeI%2FR2Bj3nHezWO773l80Nngr6tIc3o0%2FzDdiY3j5IlekkJm1W7njOUzyLF2nKekkDhyVMDRHR6qomcxogdqQi%2FJ6MbyNaGPSjCoa8q%2B8rUwgZcJhS4QuXPR2ZQs5xA5NfH8swsLHkSLamiyhmijFXlVNT9ouVuqibOT%2BMzFn06j%2BGXJ1VH8leCMNEBItBW3F0UxZf4IimsHL59hYIkK3DjQYQcEesTscjGPZYHUcttRYh3zA5ZXsdOaqSvP%2FwxNh4skh7q%2BKn3o1pWtSGq4pMCfDORC2SDaoTH0%2B%2F99d5shknhz%2Brf9eRbOk%2BGddKNcSargTSJ3xMu07d5WoRTgeD2vGOwHGk0%2BiVifLtq6bybWDc1nrsdSZIkgvJc18LTDqSqGr5oeu8niJT6rEzeXgu6pwXQx%2FQep6vCF4LglPcnok4hvS05LimrQXxjJWgCfT2YjEAkjVV6B4zZIRINU3m6ssuPvc8CbqqeAxDpFC7ORuSBRc2LdqGkv%2FPmpYkWbe6Ikbiu1SgoWIdXTTyZoDYPXPcww%2Fv3ywY6pgHHLdox5VbRMJXQLrvWRzBxwcwLqH9CBofK5KoWtl6CwlfZucWndMMQAg8p7rzeGPGep7KzdHc5fOVKDepDKP%2B36NS3WrG7Px39ofswu7P3NG24q2A6jGTFrHEStEfwHKdfX8oRTtIA7kkUA5xjHJaUZNw7%2Frfh5JUTdcW7FdTtRW7DgC5%2BynToeEZgxKKxKNrLX1ZGxYEnQkfBTKte4v60TMBTrvNu&X-Amz-Signature=52e82b5052b317e8ac95281419f4d949aac7ce091ccc834cba267c54f57c378d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UDOHJX4K%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140349Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCFtSqGiC3AD5OV%2FjEKKu48YuVwbv%2Fs2gJXYAVNQ7CMoAIgG6IoSHV1X5r0vdkC4H%2B1fp%2B0PJ8Cv%2Fsh5m0dNSO%2FErgqiAQItv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDE3lBrb9IyFYiZrnvyrcA5oITvc%2BISCjAy%2Frbr1QL7r0UJw0u7OsYcrj0oSFFQc%2BJH7TdINICjE4lff0vioAl1SIlJNfyBOMHoaRzRJ9ghwrhuDoWS%2BNnQaLA%2Bkudg3n9pt94IHKnUxrkGTS1UhMABoFQrUaYjwv9WeF1%2FkFWeExahBmASx2%2FoJSl%2Bd4%2BV0v5wDbcl5fuKZ%2FzyyOOlT8YZsDRgYHQDbHqsnDxjEH79sYKuT7GKJ33rEUQ5aU%2FN%2F93zHNYiolyRPhjmP3YMYWnBLw7CGWafDPkqCQXnBzQKKNcCkLTmOvloSKR%2B3Cfkob2V%2F3xoS%2FDkeywrwqFiqdhg6%2FbABDLh9gGExCECrdBAI8msyIRVzC1bJfBM10mEBgaZwxRQnK%2BUR%2BZiUzm%2B8kSwXUmKFdF8kdAmS0o%2BgxMabUd6ywcrKEv3t7GZy%2Fy2hvaQJ2%2B0qGwOnqRDqB%2FuX84eIP3Jkm2nf4z6c7roDt20r36wB%2BIdJhjJX39BM26WDLl%2BdDknG004chz7mSVAKHjtDyRlDoFd38iEjPjxwpoBiTW%2BZSphOgZrfOxOoOlRKvBOOd%2F7vHtkvSMcrEjfagq%2FBeKXGmCWiD1CTe%2FyvRFvKRafxJLobl5pbUIsB1YJwwmurey7hFggrLDgDhMMT898sGOqUBRKw%2Fx%2BCTRfqaRQoH0ynSb3t9CD8Mh0qZ6VWtxFXqjrytL3yGfabr1yQrXp7RwH8byPEwG6NKjMr0hnot2m1W4TQrmcAHBLSMyDP%2F4qwvzckPOrbzqLcfZDcp8t2MvZAeAj0x6p2BkAAx25CKdRQe28mgVD%2F01B95i3B132QxgnopinkSNyhDy6tBgVzQroLAkK8c78Co2m2%2FO8Y0hN0LcI83WrsZ&X-Amz-Signature=7db9f5eee5aded3dfc8fddfd25003be647c26a2358140d3d9e8ff5aaf968eaae&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664SCTHHBJ%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140349Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCxCzgArfMnKGP2dCJ8rSstkbCzx5ypJ0aOf4f5uAlBVwIhAIRsVp0Oi495Kx8F%2B3b9f6hDjUl2XLoqWnhJFmqfLdlQKogECLb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy%2Bpm3%2BYmPAY2uWJMIq3AOvqyXdVt4mpfYS0%2BuvrY4Hw22LNjCV2D7w8b5p0NPwuxKosr%2BuxKaRoBiu0zVGxtTRPnv1QxtAFIYtgmRckkl7SfRKtUibQ0KKOpHM1t3uxcMsTvoiepCmMSxdrFAzhgBY81IVr%2Bmvd%2BR8nXaFmcKpJlFjKinXuEM2MNsyYynZikSW8EQYizVP4Qa0vPQs1jB7NpLb1Dc6eFcNB7vblsAINsyzBxgFn%2BLo0x9b0kYCFoL1%2FvG83YM60BlQxaqoFPIaBErjMWoBxTRI3kiADqoR%2FsYu77JjALg9fEMlhQtK0AwZFmRF8G1MxlckVSVsJ%2B%2Fj2ojLLRYtICkWlpd0CpH%2BD0VGyOHF1xjCLHCMKDDTj4wQRcCsMFFe0v1KwHjZdZV9xDfs4NAE%2FEhFpWlWCYMsHQrBEitbfLz50DXiMl9G2rUAx2%2F%2Bb0QPVTnexChSvm0hi%2FV8zXghwjpSx7bHThmUqkkz3WoPTF3G0%2FlnbwWcrAqbPyZWpzUkpIRiCBiQ7XKOyrRLAW4PZq37j7v2DrLS30%2BQ5ghQiDss8bTGjT43iIggLMNNiGTArEQDrZ%2FBhlfdmkhATfqM4YyAxOHRThlRmBymUiOTTFs3Sm8HLi4%2FdoxbjSsIsco%2Bww1t2zCa%2B%2FfLBjqkAchEG%2FHp771o%2Bl%2Ba4UPjGgFl7%2FPYPO8kXeHFK%2BEXGhloxax%2BNliiK1ff419IwJaX3iEmI2eheFOpBKfZyDU3%2FrzTSSUOviwErX%2FE9%2B5w5kuCQsEET8Y1TKN4ZfIzEbySe80ikq5BsLJeMhGLjS%2Bl8nw9QFDU34yXiXW5oiGGEIy1YvUzvHWJ2q44fesX21FfoCrHhcXBzyECMHgQHAqiliz9zqEr&X-Amz-Signature=53bed97037eff0c62182bfb9e5ef98c7422b7fc7483ca28f4e290710af8f496f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BCVKMF4%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140320Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCaJMpLFPzaj6LufhNGhauNVkPlJhbwmOdRlykMKPrduAIgXKa4niavkt9Qj1T0qXRy0OJUwNkqWAq%2BmcNdTNYH3SkqiAQItv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDONakQ0S6rp7TJfjPCrcAwQkkDA32LgdVf%2BVhkTYjrcPPZcQGDWONY%2FZBgcflgSiEHULBBVMsS8uT8l0Sgf3vdLERBpupaGyCGTqGJui%2BoVSNu4Ep1G5P8y5kE%2F%2Frd6xPswUQXU7YsJNPdAl6Qya8k%2FbSl64WGyGU09k3Ty2sKNIzFheLlGFgxgofdm%2Fa5VrWD9cS5L%2BqnAdxgmhti7YsscFIzkmCEowtI%2B2rvqeuHpYx25cK2T%2BI%2BV60qKbU1jI2ImzYnsu4IKhZIUWTRAaQZ0iaugUWviDMsvhUfyAT%2FuxN12oit6bMkM8llOy2FiMONa15pTKY%2BcZ%2Bh8FMxEZvy1m4pJcyNY2aMEXws0gih0XLFADA0DjnyKcaDbvd7%2FAue7eoKFbRkbqtmH6jwLigC84%2FsETHdGrGXD3vtylSmcppFq%2BAKs0lOpTSUFVxQCZ5vYRKnHbwipfDFZ5HJo1gKeCz1KqziXA2y8FW0PkevyNTWZbxKkgFVEsBpa%2F62H4qrdi20S8hLyE6RYJLDcJQdfB5bcz4g1O0lOfMJ9MCy%2FMTJM%2FZmoQ6MfB03TrjU6LeebuNPAPPms6g33WPgJyrvpWLZeArEdTJx7Kw7AoeYk95St9RL7RmhSdlqm7iCOw11IKN1XcgTzk2noPMKb798sGOqUBefleiZ2sG6s9RaGEDZgWi%2BkYb4ac7EibIbgwnxmtuV7d2ZJCI9ehiBx4KheyefdJxr5tcI9CZxBlPuQ3U6V%2BaPlsP4nnVriGhXZJ1GO85AXjgIErL52kXtiKG5dE6UfILbaIjd538Oy0NkNxYb3p9EYnTZ2PbtcBzafV%2FciAO7gxDej30nZAF4byI2KQ7Bp6NRgQ7PHlGNjhOMlWfH9YOpY%2FRSy6&X-Amz-Signature=ac940f96a0fac6ca4c5a96aa3ca9a74e397775f0a0f25cd50f1bd4943ad80351&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
