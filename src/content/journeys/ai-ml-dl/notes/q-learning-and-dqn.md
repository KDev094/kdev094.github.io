---
title: Q-Learning and Deep Q-Networks
slug: q-learning-deep-q-networks
journey: ai-ml-dl
topic: reinforcement-learning
date: 2025-03-21
referenceUrl: https://github.com/KDev094/RL-QLearning-DQN/blob/main/README.md
description: Moving from tabular Q-learning in GridWorld to neural-network-based value approximation with Deep Q-Networks.
---

## What I Explored

I explored Q-learning using a GridWorld environment and then extended the same fundamental ideas toward Deep Q-Networks through a car-game demonstration.

This helped connect classical reinforcement learning with deep learning.

## What Confused Me

A major conceptual shift was moving from learning the value of a state to learning the value of taking a particular action in that state.

Another challenge appeared when considering large state spaces where storing every state-action pair in a table becomes impractical.

## What Clicked

Q-learning learns an action-value function:

**Q(state, action) → Expected long-term return**

Once this function is known, selecting an action becomes a matter of comparing the Q-values available in the current state.

DQN extends this idea by replacing the explicit Q-table with a neural network that approximates Q-values.

## My Mental Model Now

I see the progression as:

**Value Iteration → State Values**

**Q-Learning → State-Action Values**

**DQN → Neural Approximation of State-Action Values**

This makes deep reinforcement learning feel like a natural extension of classical RL rather than an entirely separate technique.

## Implementation / Example

I implemented Q-learning in GridWorld and explored Deep Q-Networks through a car-game environment.

Repository: [Q-Learning and Deep Q-Networks](https://github.com/KDev094/RL-QLearning-DQN)

## What I Want to Explore Next

I want to investigate experience replay, target networks, Double DQN, policy-gradient methods, actor-critic architectures, PPO, and reinforcement learning for language models.
