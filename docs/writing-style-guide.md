# Writing Style Guide

This guide captures the house voice used across the long-form posts in this site.
It is meant to help future drafts feel like they were written by the same author,
not just about the same topics.

## Voice in One Sentence

Clear, systems-minded, teacherly writing that turns complex topics into practical
explanations with calm confidence and a slightly conversational rhythm.

## Core Traits

- Practical: focus on useful ideas, not abstract theory for its own sake.
- Explanatory: define terms, then build understanding step by step.
- Systems-oriented: frame problems in terms of workflows, tradeoffs, feedback loops,
  dependencies, and constraints.
- Calm and confident: sound sure of the material without sounding loud or flashy.
- Friendly, not casual: approachable, but still professional and thoughtful.
- Slightly playful: use a light touch of humor or analogy when it helps clarity.

## What the Writing Usually Feels Like

- A strong hook at the start, often with a question, observation, or familiar problem.
- A sequence that moves from problem to concept to example to takeaway.
- Explanations that assume curiosity, not prior expertise.
- A preference for concrete examples over vague inspiration.
- A closing that distills a principle the reader can carry forward.

## Structural Pattern

Most posts follow a pattern like this:

1. Open with a relatable situation or frustration.
2. Reframe the problem in simpler terms.
3. Define the key concept.
4. Walk through an example or model.
5. Compare alternatives or tradeoffs when relevant.
6. End with a principle, warning, or next step.

## Language Patterns

- Use plain language first, then introduce technical terms.
- Favor short, direct sentences for key claims.
- Use headings to create a clear learning path.
- Use bullets or numbered lists when the reader needs to scan decisions or steps.
- Use rhetorical questions sparingly to guide attention.
- Use first person to establish experience, but keep the focus on the reader.

## Diagrams, Code Fences, and Visual Explanations

- Reserve fenced code blocks for material the reader may need to copy, paste, or reproduce exactly: code, configuration, prompts, schemas, template text, formulas, API payloads, CLI commands, and exact field values.
- Do not use fenced `text` blocks as pseudo-diagrams for ordinary workflow explanations. Avoid arrow-and-gate sketches like `Airtable -> OpenAI -> Slack` or stacked flow diagrams made from text characters.
- Use prose for short flows. A sentence or paragraph is usually clearer when the sequence has only a few steps.
- Use numbered lists for procedural instructions the reader should follow in order.
- Use tables for field definitions, schema comparisons, status meanings, or configuration references.
- Use real screenshots for UI-driven steps in tools like n8n, Airtable, Slack, Buffer, Pinecone, or Google Drive.
- Use custom diagrams or illustrations for conceptual architecture, state machines, loops, or mental models.
- Only add Mermaid when the site supports it and the diagram source should remain editable in Markdown. If Mermaid is not already part of the rendering pipeline, prefer prose plus a designed image placeholder.

## Common Moves

- Start with an analogy from daily life, traffic, swimming, or systems behavior.
- Reframe a topic as a problem of design, not just execution.
- Show why the naive approach fails before showing the better approach.
- Emphasize risk, tradeoffs, or opportunity cost.
- Distinguish related ideas carefully, especially when they are easy to confuse.
- End by naming the principle rather than just summarizing the article.

## Tone Guidelines

### Do

- Sound like a thoughtful engineer or manager explaining something useful.
- Be encouraging without being overly sentimental.
- Make the reader feel oriented and capable.
- Keep the pace steady and intentional.
- Let nuance stay in the piece when it matters.

### Do Not

- Do not sound like marketing copy.
- Do not overuse hype, urgency, or buzzwords.
- Do not flatten everything into generic advice.
- Do not make the piece feel robotic or overly academic.
- Do not explain concepts in a way that feels detached from real-world use.

## Sentence and Paragraph Rhythm

- Use a mix of short framing lines and longer explanatory paragraphs.
- Let important ideas stand alone as their own paragraph.
- Break up dense material with section headings and examples.
- Keep transitions smooth and logical.
- Avoid overly ornate prose; clarity matters more than style flourishes.
- Prefer essay-like paragraph development over dramatic line-by-line emphasis; use fragmentation as an exception, not a default.

## Content Preferences

- Favors engineering, leadership, productivity, and AI workflow topics.
- Strong interest in systems, processes, architecture, and operational thinking.
- Likes to show how a concept works, not just what it is.
- Often concludes with advice that is both strategic and practical.

## Reusable Rewrite Prompt

Use this prompt when rewriting a draft into this voice:

```text
Rewrite the following draft in my voice.

My voice is:
- clear, practical, and thoughtful
- teacher-like, but not preachy
- grounded in systems thinking and first principles
- friendly and confident, with a calm tone
- structured with headings, short explanations, examples, and takeaways

Style rules:
- Start with a relatable hook, problem, or observation
- Explain concepts in plain language
- Use concrete examples, analogies, and tradeoffs
- Break the post into logical sections with descriptive headings
- Prefer concise paragraphs over dense blocks
- Use lists when it helps clarify process or options
- Include gentle rhetorical questions where they help the flow
- End with a useful conclusion or principle the reader can apply
- Keep the tone warm, smart, and useful
- Avoid sounding overly corporate, overly academic, or generic AI-generated
- Do not add hype or filler
- Do not make it overly dramatic
- Preserve technical accuracy and nuance
- Keep my natural rhythm: explanatory, structured, and slightly conversational
- Use natural paragraph development, typically 3–5 sentences per paragraph
- Avoid excessive one-sentence paragraphs
- Use short paragraphs only for rare emphasis
- Favor developed prose over fragmented rhetorical beats
- Vary sentence length for cadence, but avoid staccato rhythm
- Let important ideas emerge through explanation, not repeated declarations of importance

When useful, use this overall shape:
1. Hook
2. Define the problem
3. Explain the concept
4. Walk through an example
5. Summarize the key lesson

Now rewrite this draft:
[PASTE DRAFT HERE]
```

## Quick Self-Check

Before publishing, ask:

- Does this open with a clear problem or observation?
- Did I explain the concept in plain language before using jargon?
- Did I show at least one concrete example?
- Did I make the tradeoffs or risks explicit?
- Does the ending leave the reader with a principle or decision rule?
