---
title: Fine-Tuning Llama 3.2 3B with QLoRA
slug: llama-3-2-3b-qlora-fine-tuning
journey: ai-ml-dl
topic: generative-agentic-ai
date: 2025-03-09
referenceUrl: https://github.com/KDev094/Llama-3.2-3b-Instruct-QLoRA/blob/main/README.md
description: Exploring parameter-efficient LLM adaptation by fine-tuning Llama 3.2 3B Instruct with QLoRA on conversational instruction data.
---

## What I Explored

I explored parameter-efficient fine-tuning by adapting Llama 3.2 3B Instruct using QLoRA on the OpenAssistant `oasst1` dataset.

The goal was to understand how large pretrained language models can be specialized without updating every parameter in the original model.

## What Confused Me

Full fine-tuning intuitively makes sense: update the model weights using new training data.

QLoRA initially seemed less obvious. How can a comparatively small number of trainable parameters meaningfully change the behavior of a model containing billions of parameters?

## What Clicked

LoRA relies on the idea that useful model adaptations can often be represented through low-rank updates rather than modifying every weight independently.

QLoRA combines this approach with quantization, keeping the base model memory-efficient while training lightweight adapter parameters.

## My Mental Model Now

I think of QLoRA as:

**Pretrained Model → Quantized Base Weights → Insert Low-Rank Adapters → Train Adapters → Adapted Model**

Instead of rebuilding the model's knowledge from scratch, the adapters learn targeted modifications to an already capable representation.

## Implementation / Example

I fine-tuned Llama 3.2 3B Instruct using QLoRA against the OpenAssistant `oasst1` conversational dataset.

Repository: [Fine-Tuning Llama 3.2 3B with QLoRA](https://github.com/KDev094/Llama-3.2-3b-Instruct-QLoRA)

## What I Want to Explore Next

I want to compare LoRA ranks, target modules, quantization configurations, dataset quality, supervised fine-tuning strategies, preference optimization, and evaluation methods for adapted language models.
