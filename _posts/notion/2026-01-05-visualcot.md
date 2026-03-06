---
title: "Visual CoT: Advancing Multi-Modal Language Models with a Comprehensive Dataset and Benchmark for Chain-of-Thought Reasoning"
date: 2026-01-05
categories: [paper-review]
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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QI4AQRPI%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025401Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJIMEYCIQCMvYIvdlA0%2BeSQiiNPyE2k3pk%2BypgUkvI%2F%2BeJmUJ1GmwIhAI0eggIqK5v95bUTKewmdyFV4lY9z5eaUmiFYt%2FyoUrKKogECNr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgypUUof%2BjKLAMIviDUq3APPGLNwLqIBIkAeMJl1xHeit%2FG%2BImNN4pnnZ3ver8Y%2BDWjD9Fx%2Frs4fERQ3SouoVNamGlvQsZDWQx2C5a8W3vZiA33JRXc94uJelpuffCn5BieHie1zcBJswWrgkIOqRao8DDP2xH90W8Z2m5H1VIhh%2FebAYqPRnIRDCidUffr%2BABDhtJERACu%2BKhTNPfwXn7Hou3eWEmIiR3S%2FgnJmKEdir5o47xu1WKwfS%2Fu55eA4PG7SC9EAoPk4AMjtmX%2FfIYRC%2FjehcLze9TaZv4a43GirXDNBhIe%2BKUPm2trxFLH3qASO%2F0%2B0QnQxnATmynlsJbK1xUSwPa9RC1Cqe8IZFT0gyVU%2FUb%2BHKvOmuEnzbnItddSfI0bBMJc%2F8DYwA2%2BMg9gCrrW5L3QlJn2gQJcmkdXOuwrX5BO2Yr1STUrCtFfKZrs8i3KhZ4MkzgQIyxTtd0tuhYDQL5s9d9iWR6VRwlqpePlDIupeoH4Okdvo%2F6YIva9zxc4s04uubnz%2Fr0m0h%2BwxvtD6%2BBUmsMOaEn33p%2FBK3fgMTT2eAY5rDW72R%2BMx8OuIBEm1wAP7dv9sm2hEFmHKaFPwzz5C8PJ7aEDSoiGkke2byf%2FiYp1Sd5ctepCn5XRIGGExr62F8JouBDCHz6jNBjqkAd36F9jOuqn%2B%2Boij%2Fdk%2F7%2BTJnIQfb83z%2BuVkoKiAhFkVGVcMgX2bdDsO6ZamC8L8YzKg0TY0n8wMaqaYtzLtYSeK5kEpkfvgfhD23KzqA6zEOy0K4nVvom2THLncbwa8%2Bzx%2F%2F%2FU4eKqT57YE%2FpswKffCnHlVug6RcX%2FSmiaMW7%2F%2FwFbsePxEnuMqNCcT2ayTlbPJ%2F7pRI1OCyQb79yplv3TD96EA&X-Amz-Signature=407c7fccb2382274189001520d5c562ca9787282bd74c61afb14ef4750a703fc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WXEPIYKQ%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025401Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJGMEQCIBC9f%2FKO5VPwlN8QoOkKiFt05u9%2BLiCbjpYBK8gBldVrAiBNaohmKOmtbkl7LjcxTfQcDGzu%2FwE%2FK%2BKwYunRJmZCWSqIBAja%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM3u5bvwGxlJJmIAnMKtwDYp1qxBxb%2BHw2P8Q4Ivt9OjonKDX2hScmWlBTJa7QB2c%2Byy4rt9SZ1PqTs0zLR7Xayb644%2BvyPWnKi7v6tZABMLIc3ZRrJcTyenjLBQBCrvM1jwfPzfkvnaIynHmY9TbAak5X3iMfBgjKmiQAZ0%2FNbscZiD5Gv9z7TWMUE%2FXG8R1VZgbCZkQRIdY4EIfkFY7BnhGI9%2Fj2qsB8ZotvVVYZT%2BYzEGrJNEmIKxiDKeBzfE80SUXvrdAWVQBoCbJyvVpS%2BgLJaIU7%2FrmOwAUxM8h6Llg%2BwQ8liMIUqXkxWK3oQ03JhmVXfYo3R77H%2FOBp0CFmEVlhg2izIpVHJHkrdb%2B%2BuQuMKqXQJepCpgwMZz8HA44QpZX7uj3Py%2FcB0Ep9vxvExpS1wMpFtE1RogpBT2%2FtyCQrh%2Fri%2FvCAlDVEiho7PiC4K3J0tt%2BpnKwEvcsYIZyQYNOovFl%2Ffept7A5G5igzyNpioJuxWvI0a2GQXA6e3yMLAg7HBcklL7srZdqqjJH6ZCRjmM3ybs3uE4Ju5olt1riVBHYx1ejs7Jt5dqJb%2BbqwJ7FMfHOwGD3%2BZzYeeYR8SXboN7tXWbmWamqayTBWUJlSauDWWhIj0l19Ma2B9Rw%2BhdRELpeUoRZQqdgwv8%2BozQY6pgHxgd0XVDuToY4oVzDK85%2FwFxuSpWk8nx5mNfBa3XW%2FdUmQYLR%2Bl2PpAlq3%2Bu4KB969Q3GFQPugyi9Lk9Z0NvqeBkXARBpAvfJ3G%2BB%2F1vwTyCHJdAfdiS%2BAn32p2VX%2FiaQEIzoXcOM3qBWOUSiWPaD0rDjlo%2B0zcPmNOLn2jyQDM1h7Wg0JmB8XEYSFesIrsZuSPUZRqlh3yuQY45yWa5E2YV4FReVt&X-Amz-Signature=86010aa7bf7bb57b908113dfcb573f67b5ca860f29c8b76fc79b732784c375b7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZLEOPN64%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025344Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJIMEYCIQCIK0AY8yH390sPxxng7%2BJ4a5z81qw3yoEm%2BDWXgJ%2BgSwIhALgPmgkmzB44oQxADoKHxDYgRvWBXU0L8CYCe2YlolrtKogECNr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyENAWeKEM2poYVOFcq3AMIWb1odyDmcaAwTX01KhhEtcE%2FsDON%2BO3E0LkSb%2BnCmMe3bIWNA15WiSnA%2FJUQmHS%2FM1sx5TMX7jpO9pzicrNWNn7ZK%2Blg9aKlZ1SQclMrIQyIGlK2LpKK67hGIyfwS9F%2FtNgFJO%2BMh0zUvtNPNKioOXWFvFjw3buET5pe%2F%2FmC933ihIJtlCBjopRoKfr1ROmoAB6xedjEoxYXbvKsZNhIDxURfGnEZ%2BsrQKlrhWkSfkSY8QdRfdfHVegtZ6IL7810CGFmDE72%2BtbA7o%2B0dQjKXCco1nJ%2FUkMIhekHz9pIOdLzexDRy9y4ITuEx%2B2NXoFevawK9cmy0gYiQIhclv5PlURxGNKN5BH6Jm51XbmiAYR5BY1sy2EHTUfKdLwP8F1FWT7avM4vat9aMuO9W82IFPQspfD2UOlTFh6zzVIxEMc7H269Vw00fBDeg3elB%2FzwLdclhoeI648YC1i9kgHz3a1Gt42cnQlCPL0QTnZ5oq3SwOpKATP%2FZ0zIzdfm4WCnADhgAZSYUaNmS98saRid8Ppn%2BRuVQDTNJ7HUxwRrlDbU7hPjQb%2FeMy3tJWpMrO8%2Bpcff49CljWsNP9mJBxVmGa2tGL44OS63Yu302xYLEuLeFaYTSHdPk2imhzCvz6jNBjqkAUPq8CZ%2BHSj8XwPcdgiMFjyZvyM63cASarcCZubzoPrGB1ajApPqqwBqsGJStNNfeo4yQ%2FWZXCEy9%2BksNglV%2Bjc8N1yI1v%2BYVxKqH4B5tzQ7mLu9PBy7FKqMZ65sllvDKIrKIDuxuzA1bidqQH1Kfrm%2Bf180kD7YdBRSph5RkdqvSv6IeY%2FtAz0OB5TRRURdkglmRC8lVFe4wYk9nYS5BnN5%2BY6J&X-Amz-Signature=264803f935a7011f7940e6af0352f600572eb586c4886fa9d2431a18f89f285d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZLEOPN64%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025344Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJIMEYCIQCIK0AY8yH390sPxxng7%2BJ4a5z81qw3yoEm%2BDWXgJ%2BgSwIhALgPmgkmzB44oQxADoKHxDYgRvWBXU0L8CYCe2YlolrtKogECNr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyENAWeKEM2poYVOFcq3AMIWb1odyDmcaAwTX01KhhEtcE%2FsDON%2BO3E0LkSb%2BnCmMe3bIWNA15WiSnA%2FJUQmHS%2FM1sx5TMX7jpO9pzicrNWNn7ZK%2Blg9aKlZ1SQclMrIQyIGlK2LpKK67hGIyfwS9F%2FtNgFJO%2BMh0zUvtNPNKioOXWFvFjw3buET5pe%2F%2FmC933ihIJtlCBjopRoKfr1ROmoAB6xedjEoxYXbvKsZNhIDxURfGnEZ%2BsrQKlrhWkSfkSY8QdRfdfHVegtZ6IL7810CGFmDE72%2BtbA7o%2B0dQjKXCco1nJ%2FUkMIhekHz9pIOdLzexDRy9y4ITuEx%2B2NXoFevawK9cmy0gYiQIhclv5PlURxGNKN5BH6Jm51XbmiAYR5BY1sy2EHTUfKdLwP8F1FWT7avM4vat9aMuO9W82IFPQspfD2UOlTFh6zzVIxEMc7H269Vw00fBDeg3elB%2FzwLdclhoeI648YC1i9kgHz3a1Gt42cnQlCPL0QTnZ5oq3SwOpKATP%2FZ0zIzdfm4WCnADhgAZSYUaNmS98saRid8Ppn%2BRuVQDTNJ7HUxwRrlDbU7hPjQb%2FeMy3tJWpMrO8%2Bpcff49CljWsNP9mJBxVmGa2tGL44OS63Yu302xYLEuLeFaYTSHdPk2imhzCvz6jNBjqkAUPq8CZ%2BHSj8XwPcdgiMFjyZvyM63cASarcCZubzoPrGB1ajApPqqwBqsGJStNNfeo4yQ%2FWZXCEy9%2BksNglV%2Bjc8N1yI1v%2BYVxKqH4B5tzQ7mLu9PBy7FKqMZ65sllvDKIrKIDuxuzA1bidqQH1Kfrm%2Bf180kD7YdBRSph5RkdqvSv6IeY%2FtAz0OB5TRRURdkglmRC8lVFe4wYk9nYS5BnN5%2BY6J&X-Amz-Signature=5800ec033a2cfeb0c320de729ebebae9407be936189d6dc34b31de0b9855da16&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XMVPZM4Z%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025408Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIQCNEKhRRmgmKtJnjVL%2FFCCtGo91CzKHB2TiD%2Fg%2Fmcz%2F1QIgf7VQGenh4UHrCR%2BOINy9eJ0JbHC5zi97PIO9WGSwD34qiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMJmWzQd0BlBI%2BrHpSrcA072YYncyaqSFu4lhiMbBTAyFtJm6pWlAAvEy2ICE7qbTXROIL%2FNAjq3OaMHq9GLrIXOMJ7xZimigcd9XCOvrNaqiN9Au%2FhRd7oXCSBokdOK2ntKFR6h%2FGRmCkSBmAS%2FbJCPaJtl1SOZD77cbLCpG542j93KeI0Yj95rxxzPohQzMdisfuS%2FH2BmFAKaFpBph3YXIfmb3%2B7AA03C%2Fghwq9Po8Ah6gPHIbM0jRGk9dt4xduSk9BkJFCNeN0jHSuhXfFZH9SvZnzJUFDCM0%2BQBklK6w%2FIgsTNrcGe9fguHvEUcvX22aWsqewUiDU4M0udAF87y4A1vV2VQmz52lfj9GtbIrVw%2BBRXKc8%2FyNSin%2FthTCKDNok3hQGCl%2FWFBJnpNMVV2JUhCIyzudeYkKBoHL3qFjvap39KfYjre3xE3b4J1UdY4bETB8cI7i4tKrIZb4%2FqORRDFYeWeCCpS7zNWITC4yVUYv02n%2FKOtiTG5sADRvnkmxJUAD93e1AvRxbrHeNtmbaSS0EyFyKV865jUj%2FNEry0CVTasLsrFb3T42BmX0wwLGOA9Jo3iQP9JaLxTapu0MHM7x1ag%2FfZ6HnGYIV8GFPOtPiI5C3sZ3UahYvF5N8rlzEkRqUIQSMF2MLfOqM0GOqUBxuAClBOX78wxjxrVkzUi6M0%2BFrggxE0TuNEuZ3giK5VN0z9aaeE92i0%2B0%2FrElgNjB7Wlbyg3LN6MLgFWl1Os3t8hOAHbQht3hdnAFbym5Lxfhgw59sTqQdTMNwR7XN5G5VcepNPJldDOZ2dLJzZpB7D4hA6L3Cl0nJJaBXtnkovHg43E2TZT1N44ijiO0xmo8%2FQoAfLmAFL96YFgjHQByK8kH7kb&X-Amz-Signature=ca4d3d1ce26b76f6eaa3438462c8fb62773a16f09b07c0434d3588c76e5ea5f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RKKC6SE6%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025411Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIFJJJZEoi%2BFNAUgH8TkR3Poj77h20a1FHY9cUGmNFDJ0AiEA1flnQf2a2RP38E7XyPOByoL%2B9k%2BSaYBpT7LhRLmrcJgqiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAwhQlbLmYYqdAkvHCrcA8G1VMjz6XdPpbXlcAzNBAgoQNhb5vPR%2F%2FPJUP8zawiD4zM57EH1u30UbV5zRXvUCJrhaj%2FvGW0gxodPl8Gmbjg1xHfB6ZaK72RHyROlYUWscuskcugvhrFU46qVwoWilGC%2BYkbSLKEJyYhDYgtjQ1j25bbxaXyLsL46ruYPhVa5FUboucuOjVPDgb3Nwfqf5f%2B98nn%2Fzp4abZYbe62aUhn%2BZEuSMyZVgNnpMyU29XriT2yq7Vh45pMff5UzA%2BvqTBNb44TsTjpJ4PB79YPof7bADkelUjGoj7FNqfxbkCsu46mALxEI5pyAGnz%2Bgh2JJppsdCiDSYa170W23Erg81HFwAllF5ZruWXuPjdggaFzF2h0B3rBgZ9PevDUjHjTlXFOSYBkEopuLvawCgw%2FROGNSd6kyt67mlqVAOMaIzERNYFe%2BUA0ZBujbJIpwK4zGb7Nc6QZBxXemySjYSKodYRT2JLYPXrcv3Tm%2FMnrDO%2F8oE0RwkJT5RO1m3moDJStE00fREvjtZlWQP3X5FNrT9evn%2B1emUJ92NLoj4wfUNYpEnNVU%2F1VfCOCLeGZWyfFk4K%2FYdjIvOu10SNIPHGt%2Fh9740ub%2FzDH6d5AzzS8MV%2BkYVfqj9slYINeFTLCMNnOqM0GOqUBBMKYH7v904dRtkECfG671vlXpLDFeX14vgiJk2YolCoG9vXo7ZfSL86UywvoZk9it8dRfa7BtWlo7rgzCnK1vEtoSfkT%2FQjsdE0OEA%2BIfEUqlzY56nOULpDxM05oUVKs6GrrJopPXoQuX0yR5aNfz6Mui5GN4g9owep75yCNbYuGawMg2SXUAjgEcEf8pGxjPcAXAP9oz8nXT6lZ%2FGdvHnGcZH77&X-Amz-Signature=ebad17b9514d962da1c926447b38f62b711ef420cac2891986f830fe74741e82&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665TCTGV3W%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025412Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJGMEQCIA6wxasrXtHSvVLsBEbgRXT%2Bf6udrD2SEUxF7OnJmCToAiA8cCv7bwQyiRhardUei5ZXB0TkVEOlS2SZTb7y0rKHniqIBAja%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMvfYdkw31Zo2wRadbKtwDGAge85Iy3V%2FHRVbiXVA3b9T0k2x1uymiLGxgoHts8b3UjvrDVxisWZTis6hI9UEZocu1OkyFrEjKUTKI6uD6m4%2FRlKyDuQooXbHHilc1TSZqWbIOcyEwnNMA1Wf5OATHq%2BuJV9AP%2FtRhmeaa97Sf6o2wjG%2FzXwhud8gSamI9NAkFTODCmIcvDqSs2JyM3dsH5naQvFYZyJIMQeXOjlQSLQCww5%2BfcwBpSMMkRhkJ81bexYA6qo2LAcnrOKqdzr01RfjOGnXR87VPNWD65iA3%2BZQoy0D9oAufxU6IZuZAyPWMtcRaiw8pdAP%2FvniQ0My1X41TiqQac2rxb98iQK8y6VFKPCHlx5sxR3dDHl7%2FP47qs2kZVppvR6ym873Hqh7sNKGOaKs8LFmkj1et4k%2BlWP%2FEAx%2BoltopVQ3%2Ft%2BxrjDJE0ftDj0B7p4pGN4GYlEqB%2FQfEmfpTAsCDbQBw1WVBPlT73ErTxGwV%2B4UUAfBxhi7R0cPdOGr5i8td5rDpEPOyKiE4I%2BZTacoUt0eF1iLS%2FbenBSy%2ByzNrBTvIGRjZEQ576zOqof%2B7Fcm0D71BE6wm8QR7SX%2FCwuA4%2FWFm6S1Gi60h7K9Gd4BCXihfbAH20399O6i1Ymyo6Hw3fNkw0M6ozQY6pgGpNQ6tziVqUxo3%2BNtUaXPuGyW4muWjz%2F5WzLaaa1B1Fn7bqaBUYCOWWfC2%2B02%2BD7%2FjI6mG206%2FCAQ8bwzb3%2Bd9UHPlO7yZ4FpIWw6pm5C%2F0lf0ncxrG72s6OuQurnCkSE1dq1z54xrcyBgSHj67AKxG8gKsqPWV6o8ueNFUYkXpvZwvW5MGE4tr%2BFw1UsBUrwJ98VAQaiL%2BC65jq1q4EZc6BY7JnkN&X-Amz-Signature=e0df5de6f2ee6546738e4a29c83e53de2f88c6cfbcd1d75cc5a4ac39dd81337a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YIMUNFKU%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025412Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIQC20WDqnp0qpUj%2BiYWZeWMSqGYdkYvoIOC5C1Tn7OQ7CAIgNixcsTdT846Vi60D%2FTOhk%2FqFQsyLIkMWXXknl7KVcccqiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPA3tqmxbGA207wJfircAwiC6cctcbGGSxsyUT2u7gxiRDZ4R93tXiVqrUpbW%2BHRIVd5qRLYWQulye9ySGI6a9LqhNZQs3M%2BB2WQAUFvdNXh6mtwWnCFd65nn8i%2BZdDvOAYOHkkXy6eejzn0sa2zMM79HzLqs3mAV2Y6vZX2%2Fc7irv%2FMeh9A%2B5xd%2FTzA5q1VKlwsqAfESl3dsta36%2F2WuYg4bd5VJCppDVGrsK3uIC6owU4k7OErUILYbAHzQGXAdEV725qjkzRGN4yhe0mS1E2Pjdml6KSJ6DZJFLdjtG2VnLAknNAc4I4a%2BBbNrd3NpogxC8VtdnxU2fmrUps5QUjE08hWkXkJFgW6mbNiMnQNO28gdKHMuTlhN10iwl5FkV%2FN30XCJZ6x%2BeqxdxUDfC6xeQw8r4BqvXsKBRUuX58T9Dmc2e0yWilEPSUbzixHlMpW0aJ5nv3Hf9gIACh6khSW44GUA1ogiUnYNRGXAU%2F4qY289RroooR3dU%2FMODXTtTm4N6glCYKBX6YLuP4CRA2ctdUS8NUwC5V4h0M8yZJl8Zfw0wDJlRsCy2Ijy1lX2TXf5NKwpUz9NGQEY8IxfvPcTsixM9EmKCJSL%2B6JQy5mQUgGBfYzYDODKuveWMdQValcTLyazW5%2FmqHHML%2FPqM0GOqUB5VE%2FFn5XnQSnKmfkRktSubE4QoN10YmpkQ353JNe5Ky%2BwAuG7cfC9eDVAuZFNcXoZO3i6xgXzXjL9zy%2BdBW3qdmbG0JS%2By%2FRzwEZkXScu06KimxAUbtHbWRRrrdPk5zgXolnH7SAzKyJRtW%2FWwJ4Aulk3px%2Bga7yJ%2F%2Bfqs7yod8COv7Kf2%2B6JwWblTraRHI4UaQ4oVX282gxpWhy6Ze0wx2eh%2Fby&X-Amz-Signature=09b6d709bd48dfd05c13f5d41e74fecc057afee5b4a58b4f7070881f2e3aad80&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665FBMKDD2%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025412Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIDV8sjODEpEortgM9bnRD4092BeZn4mimS93a%2FhWa3tEAiEAtdq%2BB9DEA8evw4Z0KgUKskmAJcjOnMJTHC3pHONfSHcqiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDkGyoyxnliG8oHNqircA6AIJETlNxtrIwsMoaLs%2FWLovbqIPGQ9a4WfQqQkUVDJ%2FLe7MxcTTuHkVIaFgn6LDMc4VgJqwSEZ9jyWWdo8oHS9ifJXFaFey66ec1tPKWuSgh3HSCI26q2cK9sovYgcv1ySvFKaaStPd%2BG%2F5p6SyB0CRTwvwiNqJIOQOSPKUOkm6ROzGpTUTzjD%2FQunnLQnh5sumumVokGJsURG7Mv7RCl2TSA1dbykBxgXzNH%2FW1SR3cTqG2ejViz4mFGJr0TQddX6PE6TIm%2FcPgHKSBgaAhd6gsRR0QxfJ9IRNeHP4wN6Lr4TEWYrj3V67Z1NHHxmw1PC1MqFlg6bt8PqqlbX5aNhSKV0LLQqI7TRNumtsDwCwHmbDVP4IlR69tXS4vUhmAI99Irw%2BYg57iGsNPfxOlMR4jbmImCyR3yJaIncrbWSsWQJuq%2BesUIlJ%2BQfiL%2BDbqGqNbjROo5iI%2BD31cktDlQoUo87VrH75%2Bwvs6gZYF8%2BaDKQ1FNQWsP60s7jYqh8%2BMIVqjrgxsC%2B9amLXX4Z%2BpjkRIQa7SsAA0YkMNQDnqsvegzS8q0%2BopRrFwLRZ21wj5LrejAYznQHG6rwOCB0yVNA26%2FK9PaKzKrebZm1N7XCh5JcnyJvtZYDxIa6MKnQqM0GOqUBM92ogkxtc8vsXxxS%2BO8yhPFfRQC790ALPZtPfxc4JwQIqs2QcbX3R4h%2FByVay738es%2Fh4tbe%2BcjbHtkkmu6HqtyODmcHIKKLLHZT4dr5I2XiUKilzFMVl3jXMuU27%2BEgBPPyQ4VHaq5joIafnWgJ5AXJGiGcgIJEYC20iUQakVQjA%2B%2BsIy9YFd50K06KVWzSSErgDVnmBCAPUdPx6jKFg99LiUEA&X-Amz-Signature=b0902184ecf08f8a2dd99613cc93fd8bf14447a564261417330320a606dd80d2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZLEOPN64%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025344Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJIMEYCIQCIK0AY8yH390sPxxng7%2BJ4a5z81qw3yoEm%2BDWXgJ%2BgSwIhALgPmgkmzB44oQxADoKHxDYgRvWBXU0L8CYCe2YlolrtKogECNr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyENAWeKEM2poYVOFcq3AMIWb1odyDmcaAwTX01KhhEtcE%2FsDON%2BO3E0LkSb%2BnCmMe3bIWNA15WiSnA%2FJUQmHS%2FM1sx5TMX7jpO9pzicrNWNn7ZK%2Blg9aKlZ1SQclMrIQyIGlK2LpKK67hGIyfwS9F%2FtNgFJO%2BMh0zUvtNPNKioOXWFvFjw3buET5pe%2F%2FmC933ihIJtlCBjopRoKfr1ROmoAB6xedjEoxYXbvKsZNhIDxURfGnEZ%2BsrQKlrhWkSfkSY8QdRfdfHVegtZ6IL7810CGFmDE72%2BtbA7o%2B0dQjKXCco1nJ%2FUkMIhekHz9pIOdLzexDRy9y4ITuEx%2B2NXoFevawK9cmy0gYiQIhclv5PlURxGNKN5BH6Jm51XbmiAYR5BY1sy2EHTUfKdLwP8F1FWT7avM4vat9aMuO9W82IFPQspfD2UOlTFh6zzVIxEMc7H269Vw00fBDeg3elB%2FzwLdclhoeI648YC1i9kgHz3a1Gt42cnQlCPL0QTnZ5oq3SwOpKATP%2FZ0zIzdfm4WCnADhgAZSYUaNmS98saRid8Ppn%2BRuVQDTNJ7HUxwRrlDbU7hPjQb%2FeMy3tJWpMrO8%2Bpcff49CljWsNP9mJBxVmGa2tGL44OS63Yu302xYLEuLeFaYTSHdPk2imhzCvz6jNBjqkAUPq8CZ%2BHSj8XwPcdgiMFjyZvyM63cASarcCZubzoPrGB1ajApPqqwBqsGJStNNfeo4yQ%2FWZXCEy9%2BksNglV%2Bjc8N1yI1v%2BYVxKqH4B5tzQ7mLu9PBy7FKqMZ65sllvDKIrKIDuxuzA1bidqQH1Kfrm%2Bf180kD7YdBRSph5RkdqvSv6IeY%2FtAz0OB5TRRURdkglmRC8lVFe4wYk9nYS5BnN5%2BY6J&X-Amz-Signature=482e39dcfd26223994ccecbaaac6ed6ad693b0a067559ad822bdf131f7634782&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
