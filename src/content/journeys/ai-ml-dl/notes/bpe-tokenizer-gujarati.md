---
title: BPE Tokenizer from Scratch for Gujarati
slug: bpe-tokenizer-from-scratch-gujarati
journey: ai-ml-dl
topic: transformers
date: 2025-01-11
referenceUrl: https://github.com/KDev094/session-11-BPE-Tokenizer/blob/main/README.md
description: Implementing Byte Pair Encoding from scratch to understand how raw Gujarati text becomes tokens consumed by language models.
---

## What I Explored

I implemented a Byte Pair Encoding tokenizer from scratch using Gujarati-language text.

The goal was to understand tokenization as an algorithm rather than treating the tokenizer as an opaque preprocessing component provided by a library.

## What Confused Me

Before implementing BPE, the boundary between words, characters, bytes, and model tokens was easy to blur.

Why not simply tokenize by words? Why do modern language models use subword units? And how does vocabulary size affect sequence length?

## What Clicked

Tokenization is effectively a compression and representation problem.

Frequently occurring symbol sequences can be merged into reusable tokens, while uncommon words can still be represented through smaller units.

This provides a practical balance between character-level flexibility and word-level efficiency.

## My Mental Model Now

I think of BPE as an iterative process:

**Start with small units → Count adjacent pairs → Merge frequent pair → Update vocabulary → Repeat**

The resulting vocabulary reflects statistical patterns present in the training corpus.

## Implementation / Example

I implemented the BPE algorithm from scratch and applied it to Gujarati text, allowing me to inspect vocabulary construction and encoding behavior directly.

Repository: [Gujarati BPE Tokenizer](https://github.com/KDev094/session-11-BPE-Tokenizer)

## What I Want to Explore Next

I want to compare BPE with WordPiece, SentencePiece, Unigram tokenization, and byte-level tokenizers and investigate how tokenizer design affects multilingual language models.
