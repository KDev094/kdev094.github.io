---
title: LLM Tool Use with MCP and LibreOffice Draw
slug: llm-tool-use-mcp-libreoffice-draw
journey: ai-ml-dl
topic: generative-agentic-ai
date: 2025-04-26
referenceUrl: https://github.com/KDev094/LibreOffice-Draw-MCP-Tool-Demo/blob/main/README.md
description: Exploring agentic AI by allowing a language model to interact with LibreOffice Draw through tools and GUI automation.
---

## What I Explored

I explored how a language model can move beyond generating text and interact with an external desktop application.

The project connects an LLM with LibreOffice Draw using an MCP-style tool interface and PyAutoGUI-based interaction.

This shifted my focus from asking what a language model can generate to asking what a language model can **do** when provided with tools.

## What Confused Me

Language models operate primarily in token space, while desktop applications operate through visual interfaces, coordinates, mouse actions, keyboard input, and application state.

Connecting these worlds requires a mechanism for translating model intentions into deterministic operations.

## What Clicked

Tool use provides an abstraction boundary between reasoning and execution.

The language model does not need to directly manipulate an application internally. Instead, it can choose from structured capabilities exposed as tools.

Those tools translate the model's requested actions into operations performed against the environment.

## My Mental Model Now

I think of an agentic system as a loop:

**User Goal → LLM Reasoning → Tool Selection → Tool Execution → Environment Changes → Observation → Next Decision**

The important distinction is that the model is no longer producing only an answer.

It is participating in a feedback loop with an external environment.

## Implementation / Example

I built a demonstration where an LLM interacts with LibreOffice Draw through an MCP-based tool layer and PyAutoGUI automation.

Repository: [LLM Tool Use with MCP and LibreOffice Draw](https://github.com/KDev094/LibreOffice-Draw-MCP-Tool-Demo)

This experiment helped connect LLM reasoning, structured tool interfaces, GUI automation, and environment interaction into a single workflow.

## What I Want to Explore Next

I want to investigate more reliable computer-use agents, structured tool schemas, state observation, planning, error recovery, multi-step task execution, memory, tool permission boundaries, and evaluation of agentic workflows.
