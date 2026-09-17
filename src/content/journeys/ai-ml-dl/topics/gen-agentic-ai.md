---
title: Generative & Agentic AI
slug: generative-agentic-ai
journey: ai-ml-dl
description: Exploring efficient LLM fine-tuning, mixture-of-experts architectures, and systems where language models interact with external tools and applications.
---

Generative & Agentic AI represents the transition from understanding how language models are built to exploring how they can be adapted and connected to real-world systems.

My work in this area spans three related directions.

First, I explored **parameter-efficient fine-tuning**, using QLoRA to adapt an instruction-tuned Llama model without requiring full-model training.

Second, I explored **Mixture-of-Experts architectures**, implementing ideas inspired by DeepSeek-V3 within SmolLM2 to understand how conditional computation can increase model capacity.

Finally, I explored **agentic interaction**, connecting an LLM with external tools to control LibreOffice Draw through an MCP-based workflow.

Together, these projects helped me think about modern AI systems as more than isolated models:

**Foundation Model → Adaptation → Reasoning → Tool Use → Environment Interaction**
