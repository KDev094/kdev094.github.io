---
title: MNIST Classification Under 8K Parameters
slug: mnist-classification-under-8k-parameters
journey: ai-ml-dl
topic: computer-vision
date: 2024-12-13
referenceUrl: https://github.com/KDev094/session-7-MNIST-8k/blob/main/README.md
description: Exploring parameter-efficient CNN design by targeting high MNIST accuracy with fewer than 8,000 trainable parameters.
---

## What I Explored

I explored how to design a compact neural network capable of achieving strong MNIST classification accuracy while operating under a strict parameter budget.

The challenge was to achieve more than 99.4% test accuracy using fewer than 8,000 parameters and within 15 epochs.

## What Confused Me

Initially, it was tempting to associate better accuracy with larger networks.

The parameter constraint forced me to ask a more useful question: **which parameters are actually contributing meaningful representational capacity?**

## What Clicked

I learned that architecture design is about allocating capacity efficiently rather than simply increasing model size.

Receptive field, channel progression, normalization, regularization, pooling, and training strategy can have as much impact as raw parameter count.

## My Mental Model Now

I now think of model design as an optimization problem involving several constraints:

**Accuracy ↔ Parameters ↔ Computation ↔ Training Time ↔ Generalization**

A good architecture balances these constraints instead of optimizing only one.

## Implementation / Example

I iteratively designed and trained a compact CNN with fewer than 8K parameters while targeting more than 99.4% MNIST test accuracy within 15 epochs.

Repository: [MNIST Classification Under 8K Parameters](https://github.com/KDev094/session-7-MNIST-8k)

## What I Want to Explore Next

I want to explore pruning, quantization, knowledge distillation, neural architecture search, and other techniques for building small but capable neural networks.
