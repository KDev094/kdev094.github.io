---
title: Transformers
slug: transformers
journey: ai-ml-dl
description: Exploring tokenization, self-attention, decoder-only language models, and the architecture behind modern large language models.
---

Transformers changed how I thought about sequence modeling.

Instead of processing language primarily through recurrence, Transformer architectures use attention to allow tokens to directly interact with other tokens in a sequence.

My exploration began below the model architecture itself by implementing Byte Pair Encoding tokenization. I then built a decoder-only Transformer from scratch and eventually trained a 135M-parameter SmolLM2 model.

This progression helped connect three important layers of language modeling:

**Text Representation → Transformer Architecture → Language Model Training**

The goal of this topic is not only to use Transformer libraries, but to understand what happens underneath abstractions such as tokenizers, attention layers, causal masking, embeddings, Transformer blocks, and autoregressive generation.
