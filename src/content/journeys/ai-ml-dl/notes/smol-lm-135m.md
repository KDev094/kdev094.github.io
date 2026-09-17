---
title: Training SmolLM2-135M
slug: training-smollm2-135m
journey: ai-ml-dl
topic: transformers
date: 2025-02-25
referenceUrl: https://github.com/KDev094/SmolLM2-135M/blob/main/README.md
description: Exploring practical language-model training by training the 135M-parameter SmolLM2 architecture on Cosmopedia v2.
---

## What I Explored

After understanding Transformer components individually, I moved toward training a complete language model.

I trained SmolLM2-135M using the Cosmopedia v2 dataset for 5,000 training steps with PyTorch.

This connected architectural understanding with the practical realities of language-model training.

## What Confused Me

Building a Transformer explains how the model computes predictions, but training a language model introduces another layer of complexity.

Sequence preparation, batching, optimization, learning rates, memory usage, checkpoints, and training stability all become important.

## What Clicked

Language-model training is conceptually simple at its core:

**Given previous tokens, predict the next token.**

What makes LLM training difficult is not necessarily the objective itself but the scale at which that objective is optimized.

## My Mental Model Now

I think of autoregressive language-model training as:

**Corpus → Tokenizer → Token Sequences → Transformer → Next-Token Distribution → Cross-Entropy Loss → Backpropagation**

Repeated across enormous numbers of token sequences, this objective gradually teaches the model statistical structure and reusable representations of language.

## Implementation / Example

I trained the SmolLM2-135M architecture on Cosmopedia v2 for 5,000 steps using PyTorch.

Repository: [Training SmolLM2-135M](https://github.com/KDev094/SmolLM2-135M)

## What I Want to Explore Next

I want to investigate scaling laws, longer training runs, data quality, learning-rate schedules, distributed training, mixed precision, evaluation benchmarks, and how dataset composition affects model behavior.
