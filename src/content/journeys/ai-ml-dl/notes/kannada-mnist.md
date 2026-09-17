---
title: Kannada MNIST Classification
slug: kannada-mnist-classification
journey: ai-ml-dl
topic: computer-vision
date: 2020-03-03
description: Exploring handwritten character recognition by applying convolutional neural networks to Kannada digits.
---

## What I Explored

I explored handwritten digit recognition using the Kannada MNIST dataset.

The problem extends the familiar MNIST classification task to Kannada numerals and provided another opportunity to understand CNN-based image classification, preprocessing, training, validation, and prediction.

## What Confused Me

An interesting question was why models that perform extremely well on one handwritten digit dataset may not automatically generalize to another.

Even though both tasks involve digits, differences in visual structure and writing styles change the underlying data distribution.

## What Clicked

I learned to think about datasets not simply by their labels but by their distributions.

A model learns patterns present in its training distribution rather than an abstract universal concept of a digit.

## My Mental Model Now

Handwritten digit recognition can be represented as:

Image → Local Stroke Features → Character Structure → Class Scores → Predicted Digit

CNNs work particularly well because local stroke patterns can be composed hierarchically into complete character representations.

## Implementation / Example

I used the Kannada MNIST Kaggle challenge to build and experiment with an image-classification pipeline for handwritten Kannada digits.

Repository: [Kannada MNIST Classification](https://github.com/KDev094/Kaggle-Kannada-MNIST)

## What I Want to Explore Next

I want to investigate robustness across handwriting styles, augmentation strategies, multilingual character recognition, and how representations learned from one script transfer to another.
