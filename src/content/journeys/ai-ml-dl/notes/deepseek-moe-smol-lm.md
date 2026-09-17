---
title: DeepSeek-Style Mixture of Experts with SmolLM
slug: deepseek-mixture-of-experts-smollm
journey: ai-ml-dl
topic: generative-agentic-ai
date: 2025-03-24
referenceUrl: https://github.com/KDev094/Deepseek-MoE-SmolLM/blob/main/README.md
description: Exploring sparse Mixture-of-Experts language-model architecture by incorporating DeepSeek-V3-inspired MoE ideas into SmolLM2-135M.
---

## What I Explored

I explored Mixture-of-Experts architecture by implementing DeepSeek-V3-inspired MoE concepts for SmolLM2-135M.

The project helped me investigate how language models can increase their effective capacity without activating every parameter for every token.

## What Confused Me

Traditional Transformer layers generally process each token through the same feed-forward network.

Mixture-of-Experts changes this assumption by introducing multiple specialized expert networks and dynamically routing tokens between them.

This raised several questions: How should tokens be routed? Why do experts become specialized? What happens if a small number of experts receive most of the tokens?

## What Clicked

The central insight is **conditional computation**.

A model can contain more parameters than it uses for an individual token. A router determines which experts are relevant, allowing only a subset of the available computation to be activated.

## My Mental Model Now

I think of MoE as:

**Token Representation → Router → Select Experts → Expert Computation → Combine Outputs**

Instead of every token following exactly the same computational path, the model dynamically chooses specialized processing paths.

This creates an interesting trade-off between model capacity, computational efficiency, routing quality, and load balancing.

## Implementation / Example

I implemented a DeepSeek-V3-inspired Mixture-of-Experts architecture around SmolLM2-135M to explore routing and sparse expert computation.

Repository: [Deepseek Mixture-of-Experts SmolLM](https://github.com/KDev094/Deepseek-MoE-SmolLM)

## What I Want to Explore Next

I want to investigate expert specialization, auxiliary load-balancing losses, expert collapse, shared experts, routing strategies, expert parallelism, and how large production MoE models distribute computation across hardware.
