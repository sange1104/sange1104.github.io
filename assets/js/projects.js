const projectData = [
  {
    title: "Structure-Aware Fine-Grained 3D Multimodal Embedding (2025.07–present)",
    goal: [
      'Develop a structure-aware 3D multimodal embedding that maintains semantic alignment while <span class="highlight-blue">capturing intra-class geometric variations</span>, addressing the limitations of existing approaches that fail <span class="highlight-blue">to differentiate fine-grained structural differences within the same category.</span>'
    ],
    role: [
      'Designed a <span class="highlight-blue">geometry-aware intra-class hard negative sampling strategy</span> to encourage the model to distinguish structurally different samples within the same semantic class.',
      'Built a <span class="highlight-blue">GPT-based text generation pipeline</span> that produces multi-view, part-level descriptions to ensure structural cues are reflected in the text modality.',
      'Proposed and implemented a joint learning framework combining multimodal contrastive loss (3D–text, 3D–image) with <span class="highlight-blue">a structure-aware triplet loss applied on the 3D branch to enhance geometry-sensitive representation learning.</span>'
    ],
    results: [
      'Improved FG3D chair fine-grained classification Top-1 accuracy by +2% compared to the OpenShape baseline.'
    ],
    techStack: [
      'PyTorch, HuggingFace Transformers'
    ]
  },
  {
    title: "Fine-Tuning Hunyuan3D 2.1 for Industrial Plant Domain (2025.01–present)",
    goal: [
      'Build <span class="highlight-blue">a domain-specialized image-to-3D generation model tailored for industrial plant environments</span>, where complex mechanical structures require higher geometric accuracy and visual consistency compared to generic pretrained models.'
    ],
    role: [
      'Fine-tuned the <span class="highlight-blue">Hunyuan3D 2.1 shape module</span> using a domain-specific dataset with LoRA-based adaptation.'
    ],
    results: [], 
    techStack: [
      'PyTorch, Diffusers'
    ]
  },
  {
    title: "Retrieval-Augmented 3D Mesh Generation Pipeline (2024.01–2024.12)",
    goal: [
      'Address limitations of end-to-end image-to-3D generation models (slow inference and insufficient asset quality for industrial use) by building a retrieval-based approach that <span class="highlight-blue">first finds the closest 3D mesh from a large-scale database using multimodal embeddings, then generates texture map conditioned on the retrieved mesh.</span>'
    ],
    role: [
      'Developed an image-to-3D retrieval pipeline using <span class="highlight-blue">OpenShape multimodal embeddings</span> to effectively match input images with the most similar 3D mesh assets.',
      'Evaluated multiple texture generation approaches, selected the best-performing model, and integrated it with the retrieval module to build a full end-to-end generation system.'
    ],
    results: [
      '1 domestic conference paper, 1 international conference paper, and 1 domestic patent.'
    ],
    techStack: [
      'PyTorch, Diffusers'
    ]
  },
  {
    title: "Webtoon Generation Automation System (2023.01–2023.12)",
    goal: [
      'Develop a system enabling webtoon creators <span class="highlight-blue">to generate character images based on prompts/images through generative models</span>, including style-conditioned generation trained on a specific artist’s drawing style.'
    ],
    role: [
      '<span class="highlight-blue">Fine-tuned Stable Diffusion 1.5 using a webtoon character dataset via DreamBooth to learn consistent artist styles.</span>',
      'Integrated <span class="highlight-blue">ControlNet</span> to support pose, facial expression, and background editing.',
      'Developed key modules of a web-based creative workflow tool supporting conti → sketch and sketch → coloring pipelines.'
    ],
    results: [
      'Achieved +0.1 LPIPS improvement and +0.71 recall in character identity recognition compared to the baseline model.',
      'Technology showcased at the 2023 Bucheon International Comics Festival (BICOF).',
      '1 domestic journal paper, 1 domestic conference paper, 1 international conference paper, and 1 domestic patent.'
    ],
    techStack: [
      'PyTorch, HuggingFace, Diffusers, ControlNet'
    ]
  },
  {
    title: "Contrastive Learning for Knowledge-Grounded Dialogue Generation (2022.07–2022.08)",
    goal: [
      'Improve the ability of knowledge-grounded dialogue models <span class="highlight-blue">to distinguish relevant information from irrelevant knowledge using a contrastive learning approach.</span>'
    ],
    role: [
      'Built the experimental environment for <span class="highlight-blue">contrastive learning</span> and <span class="highlight-blue">adversarial perturbation–based training.</span>',
      'Supported benchmarking and ablation studies on the Wizard of Wikipedia dataset, including evaluation and comparative analysis against baseline models.'
    ],
    results: [
      'Achieved measurable improvement with +6% increase in KF1 over the baseline.'
    ],
    techStack: [
      'PyTorch'
    ]
  },
  {
    title: "AI-Based Landmine Detection Model Development (2021.06–2022.12)",
    goal: [
      'Build a <span class="highlight-blue">5-class object detection model</span> capable of identifying landmine type and location from Ground-Penetrating Radar (GPR) imagery to support real-world field detection and reduce manual inspection workload.'
    ],
    role: [
      'Fine-tuned a <span class="highlight-blue">Faster R-CNN object detection model</span> using a custom GPR dataset.',
      'Designed preprocessing and augmentation strategies optimized for unique signal and texture characteristics in GPR imagery.'
    ],
    results: [
      'Successfully achieved the target recall score.'
    ],
    techStack: [
      'PyTorch, OpenCV'
    ]
  }
];