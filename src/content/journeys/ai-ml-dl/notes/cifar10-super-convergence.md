---
title: Super-Convergence and One-Cycle Training on CIFAR-10
slug: super-convergence-one-cycle-cifar10
journey: ai-ml-dl
topic: computer-vision
date: 2019-12-19
referenceUrl: https://github.com/KDev094/EIP-Sessions/blob/master/Week-5/CIFAR-10%20Super%20Convergence/README.md
description: Exploring super-convergence, learning-rate selection, and one-cycle training to train convolutional neural networks faster and more effectively on CIFAR-10.
---

## What I Explored

I explored super-convergence while training a convolutional neural network on CIFAR-10, focusing on how the learning rate and its scheduling can significantly influence both training speed and model performance.

Instead of treating the learning rate as a mostly fixed hyperparameter that should remain small throughout training, this exercise encouraged me to experiment with much larger learning rates and vary them systematically during the training cycle.

This helped shift my attention from only designing better network architectures toward understanding how the optimization strategy itself can substantially affect the final model.

## What Confused Me

My initial intuition was that increasing the learning rate too much would simply make training unstable or cause the optimizer to overshoot useful minima.

That raised several questions:

* How large can the learning rate become before training becomes unstable?
* Why can temporarily using a large learning rate improve generalization?
* How should the maximum learning rate be selected?
* Why can varying the learning rate outperform keeping it fixed?

Understanding the relationship between learning rate, optimization stability, convergence speed, and generalization was the central challenge.

## What Clicked

The key realization was that the learning rate is not merely a small configuration value controlling how quickly weights change.

It fundamentally controls how the optimizer explores the loss landscape.

A learning rate that is too small can make training unnecessarily slow, while a carefully selected larger learning rate can allow the model to move through the loss landscape much more rapidly.

With a one-cycle-style training strategy, the learning rate can first increase toward a relatively high value and then gradually decrease as training progresses.

This makes it possible to achieve strong performance in significantly fewer training iterations—the core idea behind super-convergence.

## My Mental Model Now

I think about the training process as:

Find a useful learning-rate range → Increase LR → Explore rapidly → Reach peak LR → Decrease LR → Refine the solution

Conceptually, the learning-rate cycle looks like:

**Low LR → Increasing LR → Maximum LR → Decreasing LR → Very Low LR**

The higher-learning-rate phase encourages aggressive movement through the optimization landscape, while the decreasing phase allows the model to progressively refine the learned parameters.

This helped me understand that convergence depends not only on the model architecture and optimizer, but also on the trajectory used to train the model.

## Implementation / Example

I experimented with CIFAR-10 classification while applying super-convergence concepts and learning-rate scheduling.

The notebook allowed me to observe how changing the learning rate throughout training affects convergence and provided practical experience with designing a more efficient training strategy rather than relying on a constant learning rate.

## What I Want to Explore Next

I want to explore learning-rate range tests in more depth and understand how learning rate interacts with momentum, weight decay, batch size, and different optimizers.

I also want to compare one-cycle training against cosine annealing, warmup schedules, step-based decay, and the learning-rate schedules commonly used when training modern CNNs and Vision Transformers.
