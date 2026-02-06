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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WORJ2NFX%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T031018Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIELe7qj3gByMuOLYUXSoukFaw3mHM4HO8pO8s1Rv48JHAiEAqAcIlLnlqliIXYwpJUfeqjlfAchyv5GU%2BrsvTFKjL7Uq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDObEatXZkzSVaagD%2FSrcA%2Baf07gh8w%2FWt%2FxClUZdi0XAjkgQKJvsABODWesYlQkZOm90fgNfE8noLPq1aMofrKuSyld%2BblKFv3wvzg762bPBWWx1XsBQ5YGMroDdLVq47K4XkHps4FoYZk0MuhoQMnhe9t0wDbNeyMo12DIfZOcfuN26zt%2FsJSgX0P%2FEfupjJsjCsy0wyB9s3q2G9OiQvenMJSPTBOSB14QlF0Q0bd20Q8znPA1Ry4o3kWD6uHaMqBZd6oKRvj1GJ1W21JuiSmxGYBmlPUb364l7q30OA5NVyBNkU%2BDeKsVNNqHZ7p%2Fb83%2F0e4bbr1TToo%2FMfcgR4zFwOtqe4jVoyk6lo8TU9au%2BGhc7D%2F0sj%2FpY9Sbb8hIfGBapHQRjmUudIVQEMc735Z8PHrKdnj9507o8P7CrdjZT17S%2BIt9hSkq3R5Ud867Rcpe8tjpCjMYvUtvotvAV8w2zZAQQN%2FTXpdUpuTrd6LIP4uo5xH1tOQN4HK58WaRtDLtss9PPBc21%2B0kzyiKO%2FMCGCGF78ndSTO5yjvtsIkcgEN51GUyrA3Vtc7FgrQ3T2DzihU6MAy6Uv2mqvGxInRW0GEM%2BEY%2FKwVt%2BOVdfZYj3samhwSQj1dvzBSp79vIivrjhu9uneoVXK7kbMKLDlMwGOqUBKQzTmWFql5nUvVjKHfsYx6Xa4ehqaSHVM8W72AlF2QHLoTRr8euBA28Zoz%2BbdGrkxTtuQkc7T5LtDa3daXLAmuw8NRVpK7meBtVAk3lKpC3Kt411QdStfDCRqlU3oL9P7GnYauj%2F7JGHT5SXqrsz5q4ByNuYCRmWzn4ipPXJHAnxiiB69thlCwot4B%2BOGe5XF1c7MtVwYLNeKnJjvFHlDap%2F118m&X-Amz-Signature=addf9cf3769fbf9abb9b2ef90ef31f7c6cd6a01b2a212bbba894ad542c22c547&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664JRV3TZL%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T031018Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIE4zBAR6R2OWAjZ0yPCX4EtYXu%2Fe0F8axySSVo43dlCtAiEA%2FQACb20nmLx5gLkBxB3H9rs6PjXZoxzynl6ZLOIKSEIq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDJpaasru72qq7277OyrcA69XFdYSu%2FzLaqq4xe69veTnPHb5%2FZXNXcVtNnCEpXMg%2FUqH7swpMuXG0f3fmCcBMV8DEc2Deeq3lnW13KH8rDUn1udnFe%2BE5gWIty8UvBfJL3zvrSbnNxUVwTyY%2FUAc8bnypckYgRM5ebeOz8qDZtNRLeGvEYp3otcjTf7a5rCWG0vdgV%2F9LJY9awnZW2YZ6eJCod6cHr7EN9aI0pdD4BZwDKyf64GzOenElABKIcB13bzA4IBpcuy4aI3jX6e6SCk4zYEzTo8bhNV9DRhV7EiA1EM02p4gh8JoQ3D5QLuVFbDapJS5QrioPed9D7pisWwx6xDxPRt45VFS3geQmPFbzP6mZHJcyOvWR6v0aaIHNN%2B3x%2B19loiua%2F7him68g4jFd6ppdAOVnlE%2Fi4sQy6DH1i2KjDrTp3YVAcc05FE%2BO%2BZlFp%2FHiWQ%2Bz1sDtaTe%2BJFo8JeQ2a456qMidQU3MEiGmTWWXE0MP7qKf%2FCgivB3jud1M7tI27pQATvEc%2B6gwQvuablnF94jNppN%2BZvR62oCB6hk6tzRbRpa3kPmYSFCTeHF4v7es8VwOvt9scgSZAqcMIguK5ZaPlvaBfdSGI93BzDrpFXEXlZEQzl8GiFMwRwjq5jjdTmxC43qMOzDlMwGOqUBu8gRxcYeBSYSI2pa0BkQFPcCws9EHCJumqsQAJZ6ljB4YTlpkPgcl26Pu4Z0tRvFesE4DGUcUK%2Bvsdr%2FKxjyQsAS3SmRdOUfsYOhIjtgJnUckQHCbCkHlB202OQ%2F0aN1rh8ZKdQ85COU4Z5QsQhy8GExOhqDeBp%2BthJ7LVTZ7Le9GOXJ8KI1pNHrepHE5lGUqIkmDFdhvyddH5smD8gSBm%2B5aEdm&X-Amz-Signature=4822e8fbc4945f05ab3e2610b1b5d01181ec4d393821e8b97bc92c177a8cc2e8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WD2GMEQ3%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T031002Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCICOtU7fBpPyFgSihUYn1mWZzYWclYuFMWTtNFkkBRLskAiEAswNLmdaoBC2CQBDHP7NAsyluVffAfpk%2BhiM6W5YmG2oq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDAVXB6OOpmD2XuGOwSrcA9kAFmjQyPe3Ou9F3ek5%2F4pQC1jkVhMWeCYA3qgfnCAykD05X25zespTn1rg4CfV0BaZ7bqx%2BNPO%2FI5gFM20cCvidoq4nHtnsLGnBe3ON7D08w1dBDHDxwglP0GAsJXE%2BkVGiuPvSFm3s%2FVCWJtezivm52AfMSns%2BxGOQdcriG9stIWniwtVU4%2FvGYEXGCZeYFOrgN%2FTIsm450kN6VbVQRBwuog58m8tVNoIIMQ7zlCAa3OuOm0jPYe30VM3tBhiLnzUyjEXsnd1BFJNt7g0WNnxcboiWZH4nlvLBRXOngg8uLblymHv2t9vbGQc2bEZTsbdJzEqb9uXUlIfdRexOnjr7CNJm3ab4X1AkG09Ooibq57fdMnV098N9%2BtUjRH%2BTyPd4ZeOS5cfNkZMvVGeuTciZ3I2On0G%2F%2B25wtL1O3krwGCxL1GpV7u7FEvO45m%2BRcuzAxHHzSoZss2FT7jyYept0OihZciVDdxslhWYLrAUl%2F8ulPEMQbISKLfA60HCOWMDJADwJtEO%2Bl63f9bXxAJ1IJsJdLe6FF7Pn0flJu9aWPEnvt5BbwelO1b3gXqeTI6K7V4QKNjMG0o7gdvtJ1ig9PK75gqfPyq08CCfXX1jLRLIZncMprA%2FZWvoMNfClMwGOqUBmzVL6zpGwXvCySXcysE8Gz%2FxXupB85ior5jqimr%2B0Job%2FKw1GeihXJzxHjWp10b0UyMteQfW%2FDOvZywMApLUr1sUKieEb%2BTdtdH5irC%2Fo%2BHKtD6JP6rn4V%2FBtRpvPszwfeGisJCbONdAVzYwpodH%2Fy6hmQfhqspsJ%2FuDcB0goD5lxt6gECtCskGEHq3LHywOJrWQH6aT%2BMKP0scjQEsTBRXO3MeT&X-Amz-Signature=745758ec8e6aef9898f104de92aec1c5e57ba380e7ce86d5d07339c373c8bd92&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WD2GMEQ3%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T031002Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCICOtU7fBpPyFgSihUYn1mWZzYWclYuFMWTtNFkkBRLskAiEAswNLmdaoBC2CQBDHP7NAsyluVffAfpk%2BhiM6W5YmG2oq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDAVXB6OOpmD2XuGOwSrcA9kAFmjQyPe3Ou9F3ek5%2F4pQC1jkVhMWeCYA3qgfnCAykD05X25zespTn1rg4CfV0BaZ7bqx%2BNPO%2FI5gFM20cCvidoq4nHtnsLGnBe3ON7D08w1dBDHDxwglP0GAsJXE%2BkVGiuPvSFm3s%2FVCWJtezivm52AfMSns%2BxGOQdcriG9stIWniwtVU4%2FvGYEXGCZeYFOrgN%2FTIsm450kN6VbVQRBwuog58m8tVNoIIMQ7zlCAa3OuOm0jPYe30VM3tBhiLnzUyjEXsnd1BFJNt7g0WNnxcboiWZH4nlvLBRXOngg8uLblymHv2t9vbGQc2bEZTsbdJzEqb9uXUlIfdRexOnjr7CNJm3ab4X1AkG09Ooibq57fdMnV098N9%2BtUjRH%2BTyPd4ZeOS5cfNkZMvVGeuTciZ3I2On0G%2F%2B25wtL1O3krwGCxL1GpV7u7FEvO45m%2BRcuzAxHHzSoZss2FT7jyYept0OihZciVDdxslhWYLrAUl%2F8ulPEMQbISKLfA60HCOWMDJADwJtEO%2Bl63f9bXxAJ1IJsJdLe6FF7Pn0flJu9aWPEnvt5BbwelO1b3gXqeTI6K7V4QKNjMG0o7gdvtJ1ig9PK75gqfPyq08CCfXX1jLRLIZncMprA%2FZWvoMNfClMwGOqUBmzVL6zpGwXvCySXcysE8Gz%2FxXupB85ior5jqimr%2B0Job%2FKw1GeihXJzxHjWp10b0UyMteQfW%2FDOvZywMApLUr1sUKieEb%2BTdtdH5irC%2Fo%2BHKtD6JP6rn4V%2FBtRpvPszwfeGisJCbONdAVzYwpodH%2Fy6hmQfhqspsJ%2FuDcB0goD5lxt6gECtCskGEHq3LHywOJrWQH6aT%2BMKP0scjQEsTBRXO3MeT&X-Amz-Signature=9b099178e71c50246c300a605b328408967e4c71edd5bd9de37b094aed9214c9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666R6WKSXB%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T031028Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJIMEYCIQCW9%2BU4pw8dvq0kajpqz3CEJt0diu4MtTXcXYKns%2BQSjgIhAL3ocL8I5w8o1CXrXTRAXnvgT9GkQ%2F89Sxj94lPGkoRYKv8DCDgQABoMNjM3NDIzMTgzODA1IgytPIdIkCAgXlRzoWIq3AOTQPc0CftHWN13K9LnbLZ6Aj3xxKKNSDpm8mZM1yLBjQG4lG8CZ%2BO%2FtCIM7uptc1LEMERewl8BTQNvMg65OBZgFgCwoz5PREW5iKOqocRxSbnasK3onXVSMcAgjtCeIJTJkuAtegd%2BHDBoTFfybH3ukwpGfSF3DqSPyeIdPdcbwqYbiwRT1OJBxe7CT7HQFs9dvJAMFDMGrKOVWBGLjuABGAfIDp66VNnkd20I0rH%2FSYs7gg%2FfVSvpcIentwDt5p3ADXHiiVXXALE2ifJPG0mj4Qn6SWCRAfw794qR4BpLltxxBiPfu%2BJBywXdrYYstd0%2BsdLjCH6sde7AbL%2BbU1jtSsv%2F8slSNYXRs4X7t7qW2lFNFR1cHmFhgOgdb1cM4e3%2BKyLgGPKD63Vb%2BQwvz4WKbHrIrc%2F6m59u0wQ8wBHoe0Lqkv3rElofcXiOwMISpyKKWC34fIgoN2eTf%2Fy8kdGfDOnNVAdA6g%2Focz48Ali0kGootBUAf6qXxVlvJEfYHwo19HNpVZH5xwlRsQVUGiq8OtjqOcf%2FHztgtX1VDYTQuSE0PpqVXImHvuKG8AG%2Bymsbqh5k78xlg3bO6FHIHOwU22D6oZnU3QVyCYEZE4ifKnK3r2YUD%2F4yk1ldKDDXw5TMBjqkAb%2B%2FCMRmAfyQChbm9G2Ws%2FCP8EGhOZnfjMx7D45cU40tyDUh26lQ635cqpeRwpDlS7q29PPQ04efc8jhxT8OnGnk4KIip%2BII42KxHDDKAa8lihnFeHci%2Fg9b3RXAeliIcSZsqYseaVAXeaR6y9x9oWSNRRcTgeTb9%2FqDxFnE11%2BEzI9A76LH0PxwwmZxiznfVMTb7LKzR%2FJnbQcgUsEh4GmMgK98&X-Amz-Signature=478de462a4d1b0f63e5341e2055c3a95ca0ce5731760fd37e315e6d238dacd4c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZYPNGS4K%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T031034Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJIMEYCIQCJn%2BiY%2FebDUhIoRbPqBFAbcy6HVI0I%2BbAj%2Fbogl%2Fh%2B3wIhAPccQVVyqUKky54FZifkhx%2FD%2BjEApmaeC8C7rRh%2F0npqKv8DCDgQABoMNjM3NDIzMTgzODA1Igx%2BFjH1IJX2q7DyIQ0q3AOV0FPSie6Hcy%2BZHMzT2yVCInZI0lbsQCWkuZlTSoqhmUFInM46sVAumb1gS4FwplRyH%2BeKf44r1k3TgC4NKUFhRKSBXc8RXhp08NfPnNcQB%2Bkur7FtHeqrKj9SGnJfgPnrSPbpUE1gjzCJ1BdJHre7nX%2BK%2BcYdhKWipty43mu%2BCg7S6P5Hi0hkoYP4AqWrzl4HZ%2FtMWcsqt4lwCcSc4ZPWmp3gs2RrnPN56i9kreQ%2FSqWW8ZYzz6kK82BDf%2ByAXGyyZU8hSYSjTb27AV01TxLukY2GuxcTCU1bZlogE4SZm0bDx14%2FLX4N7FJfv6gfq2ENa2Duzd3jmOxgxo7hERcoRHz214XkL9UY%2BxU%2BGhbsf8gp%2FuPLEeuzjlwRJDSVaelNFcjk6UHpewK3eWiWN6I4c8%2FQ9viNrypCODPxZoWCiWPCICvWNGH2aUJBVLCXXXEB9p9dzNfqSE0hPB0M9FIqpywPEsI3qnhCkpjShT9mZYc3xXr79ON%2BVPzZUgF%2BxJpUhnovLhe4NAsPeLucGIhwIYSenyBhLk%2Fbmiz2LjOZJ%2F22mrF%2Fz8u76nVwTU%2BZUuYc4wU36hieoAZFLW0bKrgUJSdrN2cW8lwJk50%2BXCb5vtuEyKmEQnPEiHaUCTDNwpTMBjqkAUVlrTjHkQHhRstC%2FiLr5ddp3h%2FCTzFOGAmOuJSRVVz9axq35C%2BqpfBtjVmoOEwacY9xKASgCgTJVeVHkdhfR94OULithWIW7eDrt3Yy11fIMg8uhYv%2B9H4djBfRnS4G67aKA%2FDExksIQu9iKF1h0JaXnehU0QJ%2FZMOlgT1D8Q6BNXB4tr%2FD42NJOtzCI5D39jZHoJ61XRPkV%2BPuo52uk%2BzUmsc%2F&X-Amz-Signature=6ff4cd85637836495647ee63f68a534c77b60015dbbc8380e4f54e12df4e3026&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RMM622VG%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T031036Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIQDj71rPNLlQ4E1yyuTPk057j2B%2BmqEHMwusmSj0JbGDgQIgIJ2GrLfKnj4pOdyEgd2nIR5WV4FKYhAgb7juuk0qURQq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDJb5iYfuoYEXLPKCVyrcA1xgEgUAnamIXfUPd8Q0dkEQN1CLCKtMM4bqqahPdpEpoCCkyyduobNri4%2FIXh3c11Uj4THwSMZm6E14ONNYZO6mLYzHkv7KWreGU%2FtOidbFAwBh8fjXBi7jP%2ByyxexlwljLEIV11CYZR6VMz3p5tfqftz82eeKIgRhJIw5s%2FnEaC3N6cJtvVUV1k8wRokCtG9I0MhmmxzKqFRL9fctRkTL0Z6E4MyDFiCK9BDeCZoSPkl8%2FOgvkCcGVcmLzgUj7S8KFBamuxY8DT9hsgVm7KQ1ka4PQEkqZqMeCxZpIfgCXPjHx9ckfNuEi9WdEfwN8kbkRO6a8tNES3cSg%2FGNtSYfqOHavSJfdTqjqTC1K9NFQ%2BwLEhn8p5owosESb5sAULAmLZ6G8DHS0WPSNZI3%2FVNbE%2FB8FKtOuAMGQiHbZx2%2FeLZ9p6x68EwS5PKNztArUU2HtqrIjLN6kHGN4jOhGC0LC81tBOiaI%2BYxs30JewG9yioYGrgT%2Bqc084Q%2By8JwhNjzaWU5qxWW1HegKVbfXEyeEncZ6RZekjm5%2Fsar6bsOVrfDzP0vuupQOydYvWrN8EkE36jzqv5EcNfEre1%2FB%2BrfcAVFV9wX1MGEKXfXOW3ZSP%2BNp6DMImzss9FYRMMvClMwGOqUB%2B0BAeqP6gHk9ZFVfjkBWPV%2B%2BdHJwCoezgU0CDxxtfuJy9MlyoyS9VJNkGY9HsBc9w9rPK39KD6ZX0fmJeH83IKS1FmXlmOw6ERH8tfyDcXQplutaGiz%2Ba%2BMsoLRsY7cC7bWcHxYjGout0eG7o0eAzij6AIeVOj%2FGG5cm7VHR%2Bi43w%2B8bpyrizm%2Blap1rjUHtJhMY%2BID1VAB6Rs%2BQfs%2BXSkZt1uW3&X-Amz-Signature=7cb8894d30a8f9fdee1a3be35b6592bc6f5c4691c437df1e6b6e0022dfec29bb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SK6TPXGJ%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T031041Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJGMEQCIGDRvpNM10dlEeAtuoPAkWhbn3NFtXaXbA7g5ooqu52OAiBWYTdk%2Bvj5ThkHNgH21Dr6jVuiTHfuM6nQpWLL%2BUq51yr%2FAwg4EAAaDDYzNzQyMzE4MzgwNSIMstBQ3UfuZ4HIrzCNKtwDRY6q0rw4z3%2BVdMHwD%2BUGKPG5q8ah1Y5vBDKfmOd94dpRyidPYhpHHNmnXzM0mYYcrJuBYAOWZh6vHMHghXUNRJ8jjWG77LE4gMS6722GhUNwc3lIMHQb4zUoqxJs0bIeXq20wFtBx9w0O5r40Aj9GJGgtaPSRVMPc7HojmvpbOASIluYdQK3S9sFZFks%2FtUoDzCrGC0JJN6Iv%2FGVd2Y3n9Q3nK9AnMUZ2jXpvNLzOMhoLoZ4Vt%2FaVKWnlN6164mdXQAD1w3wGiOJA%2B9JVO2S2U6jkoCcsNtgyQOFj3AhAyq%2BWz26BdWL2VVgxruoBPYWBAxv3jfYHPW%2BMVB1MfPFiDgineenkEpQ%2FyE247mGpCvHrCMTj3dXNtSlDwMNkOIKYGCfYI7m%2BbjBSEDlcfhBNLRxEO2Blnx%2B4dOl0zbQxtpxtoxlAVqsMv9MNt5BHxSZHofd1%2BxV%2BWQKL3iffZLx6yJYkTsQsnWNqz7cihFfJO7JvmP7F4idCgTf1kFOKDUkzze3eG2AYjDjCTqbMz%2FhT7lvxeiupWhhO4P%2Flb3gi2358ANeNxEanvejZB27y5HJTziOMszv2N2phtRk5051nqupI3Sex%2FK4c8GaeXztS03PlvBNLVg2%2BHLdo38wosOUzAY6pgEorTQvpmgwEdKT7dqEC%2B32NmecJUywZLZ941l7C5Q9Eh2Xgi%2BxKY6%2BD5Vph4%2BbXlP9KXPiJ5osDBKpuPgv%2FAUiiWLAs6l8DjxZUR%2FI0UJYG4poJuyAFuHDKVjIDas2l212iTmnmBuxefUCSW%2F2ErFJf7OQe9gznbiZ66PQ%2BOPFNwVL1nOXKTljo%2BDaQobvHW3UlPw7utYCpF7aMF38Zm5cNl%2BBzrrK&X-Amz-Signature=7f2f5eae8fbd70ea966dd07d5e96692efd5b36eb64122886391c906ca53918dd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMEV42PD%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T031041Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIQCnXK9yRgiZZDfvxlKtnVNJl3pZMbdYPc0ZUge5Ag3vrgIgNX5OMC3BhnlYuZjnlqKmzicmLxDLA%2FrStpx1KnNg6Egq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDEKlp2D0x15mHV2ULSrcA9QmWpiUggC4F5WHwW7Z0n9jkQDRIKc6oHPxN7FqNfrGs5mT1iIEsubHoReOrL1IZCITvIoqDwzUfJHrKnwQEyL1egvlZdag7%2F0KwM9ZOG8qiq2CBnf8Foys0oehyG7Xp1opxS2RbHITguPbG8K%2F%2F8WAsBricWhL82K9ntUsHrBLZb%2Fy7Al54zSMrqMe7moLfbkVFBDjOkPDKdDnUV%2BrpNvRA%2B%2BBuLjUEehTIXjhoWbVlFYx%2FyyTATXcqmvvbl1G1XI3ZP0rbOhEHbxzNVNBMyM0F1KuJ6qJPbc5qBwt5B1ZryFwnoa2l%2F9YTUwIAfsGORCnH5C7V9Ke5uMahn3LqPiUQTuyvqU%2FKTdVAO0SOZLr2l%2FOghbyj8B74EcP4Y1g5LhDvbSGUWdH5hHkgzQjhhWEaDujaUgwUWsJd6raZBeu9U2H4JeJWv5AjahqBvph8mWdi7U0aoX0ex9DZjzrnFOguOM7i9iE8qIYMxkK8cinOYoH1BEeDGWFA6PjtXpzGuLVEY3R2HJwSJ23dzuoI56kfqa2oEcVqKoZVzWyRne0PBXeVi1%2FLcPvW1bHo1dP56AL0zGNbmVjzq5FOZQZO2hS5%2BdBgpYvtPzrHvOuIozXWOiRAtizYio0FqL5MLbClMwGOqUBvmyOB%2BlhrzMWgYxmHgmj88Hzp8pkJgH0dnPa1g%2B0Mgb3B9fXUJzgDbmFEmpVYgYmEQbgGt6CYLYMtMB%2BpfnWWA4%2FVEytbWccBOZvq2aovpUG88u5TSdH4a31rIro3EXyo%2FOKiQDQPQT4I8%2BPEOkPweVnb3vvEZVKY1KcgnYFuL%2FBycKyUmPFKtWIm7AZKSWA7vIVvJcVRpmegA7A4%2BXGRp58TgE4&X-Amz-Signature=086c9bc52d50c945da12f58d14a428d88f90957801f6ac9667cca9f81482d00a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WD2GMEQ3%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T031002Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCICOtU7fBpPyFgSihUYn1mWZzYWclYuFMWTtNFkkBRLskAiEAswNLmdaoBC2CQBDHP7NAsyluVffAfpk%2BhiM6W5YmG2oq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDAVXB6OOpmD2XuGOwSrcA9kAFmjQyPe3Ou9F3ek5%2F4pQC1jkVhMWeCYA3qgfnCAykD05X25zespTn1rg4CfV0BaZ7bqx%2BNPO%2FI5gFM20cCvidoq4nHtnsLGnBe3ON7D08w1dBDHDxwglP0GAsJXE%2BkVGiuPvSFm3s%2FVCWJtezivm52AfMSns%2BxGOQdcriG9stIWniwtVU4%2FvGYEXGCZeYFOrgN%2FTIsm450kN6VbVQRBwuog58m8tVNoIIMQ7zlCAa3OuOm0jPYe30VM3tBhiLnzUyjEXsnd1BFJNt7g0WNnxcboiWZH4nlvLBRXOngg8uLblymHv2t9vbGQc2bEZTsbdJzEqb9uXUlIfdRexOnjr7CNJm3ab4X1AkG09Ooibq57fdMnV098N9%2BtUjRH%2BTyPd4ZeOS5cfNkZMvVGeuTciZ3I2On0G%2F%2B25wtL1O3krwGCxL1GpV7u7FEvO45m%2BRcuzAxHHzSoZss2FT7jyYept0OihZciVDdxslhWYLrAUl%2F8ulPEMQbISKLfA60HCOWMDJADwJtEO%2Bl63f9bXxAJ1IJsJdLe6FF7Pn0flJu9aWPEnvt5BbwelO1b3gXqeTI6K7V4QKNjMG0o7gdvtJ1ig9PK75gqfPyq08CCfXX1jLRLIZncMprA%2FZWvoMNfClMwGOqUBmzVL6zpGwXvCySXcysE8Gz%2FxXupB85ior5jqimr%2B0Job%2FKw1GeihXJzxHjWp10b0UyMteQfW%2FDOvZywMApLUr1sUKieEb%2BTdtdH5irC%2Fo%2BHKtD6JP6rn4V%2FBtRpvPszwfeGisJCbONdAVzYwpodH%2Fy6hmQfhqspsJ%2FuDcB0goD5lxt6gECtCskGEHq3LHywOJrWQH6aT%2BMKP0scjQEsTBRXO3MeT&X-Amz-Signature=4699ea2af606ed8b9c8cfd3494806115d159f0a9cf215c2027cca389c8fc9720&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
