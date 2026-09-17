---
title: Human Detection and Background Removal
slug: human-detection-and-background-removal
journey: ai-ml-dl
topic: computer-vision
date: 2020-01-10
referenceUrl: https://github.com/KDev094/Body-Detection-With-BG-Removal/blob/master/README.md
description: Combining object detection and semantic segmentation to detect people and extract human bodies from image backgrounds.
---

## What I Explored

I explored how multiple computer vision models can be combined into an end-to-end application.

The application first detects people within an image and then removes the surrounding background to extract the human subject.

This moved beyond training an isolated model and helped me understand how different vision tasks can work together inside an application.

## What Confused Me

Object detection and background removal initially seemed closely related, but they solve different problems.

Object detection tells me where an object is, while segmentation determines which pixels belong to that object.

## What Clicked

The important realization was that practical AI applications often compose multiple specialized models.

A detection model can first locate a person, after which a segmentation model can operate on the relevant image region to isolate the foreground more precisely.

## My Mental Model Now

I think of the pipeline as:

**Input Image → Human Detection → Bounding Region → Segmentation → Foreground Mask → Extracted Human**

Detection provides coarse localization while segmentation provides pixel-level understanding.

## Implementation / Example

I built a Flask-based web application using YOLOv3 through ImageAI for human detection and an Xception-based DeepLab model for background removal.

The application takes an image, identifies human bodies, and produces extracted subjects without the original background.

Repository: [Human Detection and Background Removal](https://github.com/KDev094/Body-Detection-With-BG-Removal)

## What I Want to Explore Next

I want to explore modern object detectors and segmentation architectures, instance segmentation, real-time inference, and unified models capable of simultaneously detecting and segmenting objects.
