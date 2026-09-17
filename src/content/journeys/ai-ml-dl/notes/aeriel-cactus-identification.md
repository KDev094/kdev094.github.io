---
title: Aerial Cactus Identification
slug: aerial-cactus-identification
journey: ai-ml-dl
topic: computer-vision
date: 2019-12-20
description: Exploring binary image classification by detecting the presence of columnar cactus in aerial imagery.
---

## What I Explored

I explored binary image classification through Kaggle's Aerial Cactus Identification challenge, where the objective is to determine whether an aerial image contains a cactus.

The project helped reinforce the complete supervised image-classification workflow: preparing image data, constructing a CNN-based classifier, training the model, evaluating predictions, and generating inference results.

## What Confused Me

A key question was how much information a neural network actually needs to distinguish two visually similar categories.

It also highlighted the difference between memorizing training examples and learning visual features that generalize to unseen images.

## What Clicked

I developed a stronger understanding of hierarchical feature learning.

Early convolution layers detect relatively simple patterns such as edges and textures, while deeper layers combine those features into increasingly meaningful visual representations.

## My Mental Model Now

For image classification, I think of a CNN as progressively transforming:

**Pixels → Edges → Textures → Shapes → Semantic Features → Class Probability**

The network does not explicitly receive rules describing what a cactus looks like. Instead, it learns useful visual patterns through optimization.

## Implementation / Example

I created a notebook for the Kaggle Aerial Cactus Identification competition and trained and saved a model for cactus-presence classification.

Repository: [Aerial Cactus Identification](https://github.com/KDev094/Kaggle-Aerial-Cactus-Identification)

## What I Want to Explore Next

I want to compare custom CNN architectures with transfer learning, experiment with stronger augmentation, and study how pretrained representations affect performance when training data is limited.
