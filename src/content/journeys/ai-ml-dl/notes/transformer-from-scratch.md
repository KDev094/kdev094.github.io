---
title: Decoder-Only Transformer from Scratch
slug: decoder-only-transformer-from-scratch
journey: ai-ml-dl
topic: transformers
date: 2025-01-18
referenceUrl: https://github.com/KDev094/session-12-Transformer-from-scratch-pt2/blob/main/README.md
description: Building and training a decoder-only Transformer to understand embeddings, causal self-attention, Transformer blocks, and autoregressive text generation.
---

## What I Explored

I implemented a decoder-only Transformer and trained it on William Shakespeare's *Coriolanus*.

The goal was to understand the architecture underneath autoregressive language models instead of relying entirely on high-level Transformer libraries.

## What Confused Me

Attention contains several concepts that initially appear independent: queries, keys, values, scaling, causal masks, multiple heads, residual connections, and positional information.

The challenge was understanding how these pieces cooperate to produce contextual token representations.

## What Clicked

Self-attention became clearer when I stopped thinking about it as a mysterious neural-network layer and instead viewed it as learned information retrieval.

Each token creates a query describing what information it needs. Other tokens expose keys describing what they contain and values containing the information that can be aggregated.

## My Mental Model Now

For each token:

**Query → What am I looking for?**

**Key → What information do I represent?**

**Value → What information should I contribute?**

Attention scores determine how strongly the values from different positions contribute to the new token representation.

Causal masking then ensures that generation can only depend on previously available tokens.

## Implementation / Example

I implemented and trained a decoder-only Transformer for autoregressive text generation using *Coriolanus* as the training corpus.

Repository: [Transformer from scratch](https://github.com/KDev094/session-12-Transformer-from-scratch-pt2)

## What I Want to Explore Next

I want to investigate efficient attention, rotary positional embeddings, KV caching, normalization strategies, grouped-query attention, and architectural decisions used in modern LLMs.
