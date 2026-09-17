---
title: Bellman Equation and Value Iteration
slug: bellman-equation-value-iteration
journey: ai-ml-dl
topic: reinforcement-learning
date: 2025-03-12
referenceUrl: https://github.com/KDev094/RL-Bellman-Value-Iteration/blob/main/README.md
description: Exploring value functions, discounted future rewards, Bellman optimality, and iterative policy improvement.
---

## What I Explored

I explored value iteration using the Bellman equation to understand how an agent can estimate the long-term usefulness of different states.

This provided the mathematical foundation for understanding reinforcement learning before introducing neural networks.

## What Confused Me

The most important conceptual difficulty was understanding why immediate reward alone is insufficient.

An action may produce little reward immediately but lead to a state from which much larger rewards become available later.

## What Clicked

The Bellman equation showed me how reinforcement learning recursively connects the value of the present with possible future states.

A state's value depends on immediate reward plus the discounted value of what can happen next.

## My Mental Model Now

I think of value iteration as repeatedly asking:

**If I already had reasonable estimates of future states, what should the value of this state be?**

Conceptually:

`V(s) = max_a [reward + discounted future value]`

Repeated updates propagate information about rewards backward through the state space until the estimates stabilize.

## Implementation / Example

I implemented the value iteration method using the Bellman equation and experimented with how state values converge toward an optimal decision strategy.

Repository: [Bellman Value Iteration](https://github.com/KDev094/RL-Bellman-Value-Iteration)

## What I Want to Explore Next

I want to explore policy iteration, temporal-difference learning, Monte Carlo methods, and how Bellman-based reasoning extends to environments where the transition model is unknown.
