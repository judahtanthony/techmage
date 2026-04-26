---
title: "Stop Guessing: Build an AI System That Finds Marketing Trends for You"
publishedAt: 2026-04-26 16:23:00
author: judah-t-anthony
image: /images/posts/stop-guessing-build-ai-system-that-finds-marketing-trends.png
excerpt: Build a simple AI-powered workflow that gathers signals from across the web, detects emerging trends, and delivers a daily report you can actually use.
tags:
  - Marketing Automation
  - Workflows
  - Zapier
  - Google Sheets
  - Prompt Engineering
---

Most marketing teams do not have a shortage of ideas. They have a shortage of signal.

If you are anything like me, trend discovery probably looks familiar. Open Reddit. Check Hacker News. Skim a few articles. Maybe look at Twitter. Try to decide what is noise, what is real momentum, and what actually matters.

An hour later you may have some ideas, but not much confidence.

I did this for years.

It works, but it does not scale. And eventually I realized something important:

**Trend discovery is not a research task. It is a systems problem.**

Instead of getting better at searching, I started asking:

*How do I build a system that finds the signal for me?*

That led to a simple workflow I now use every day.

It pulls in content from a handful of trusted sources, aggregates it into a small dataset, and uses AI to surface the patterns worth paying attention to.

Not headlines.

Patterns.

The output takes five minutes to read and is more consistent than what I was doing manually.

In this post I will show you how to build it.

## The Shift: From Searching to Systems

The tools here are simple.

1. RSS feeds
2. Zapier
3. Google Sheets
4. OpenAI

Nothing exotic. The bigger shift is conceptual.

Most people treat trend discovery like something they periodically do. I think it is better treated as something a system continuously does.

Instead of asking:

> What should I go read today?

Ask:

> How do I build a workflow that is always collecting the right inputs?

That is a very different question. And it changes everything downstream.

At a high level, we are building this:

![Simple system diagram showing Sources feeding Google Sheets, then OpenAI, then a Daily Email Report](/images/posts/ai-automation-marketing-design.png)

That is the whole system. Small enough to build in an afternoon. Useful enough to keep.

## What We’re Building

This is not a dashboard. It is not another content feed. It is a lightweight trend detection engine.

It does three things:

1. Collects signals from trusted sources  
2. Structures them into a simple dataset  
3. Uses AI to synthesize patterns across the dataset

The output is a short report:

- Top 3 trends
- Why they matter
- One content angle for each

Something you can actually use.

## Step 1: Aggregating Signal with RSS and Zapier

Good systems start with good inputs.

For this first version I used:

- r/artificial  
- r/ArtificialInteligence  
- Hacker News  
- Ars Technica

You could add more later. I would not. Start small.

> [!NOTE]
> **How I Found the Reddit RSS Feed**  
> Try appending `.rss`, `/rss`, or `/feed` to a site URL.  
> It works surprisingly often.

### Build the Zap

Create a Zap:

Trigger:

```text
New item in RSS feed
```

Action:

```text
Create spreadsheet row in Google Sheets
```

![Diagram of Zapier workflow: RSS trigger connected to Google Sheets Create Row action](/images/posts/ai-automation-rss-zap.png)

Each new article or post becomes a row in a shared sheet.

That is it. No intelligence yet. Just reliable capture.

> [!NOTE]
> **Hold off on using Zapier's AI Copilot**  
> The goal is not merely to automate this workflow. It is to understand the pattern.
> Once you understand the pattern, Copilot becomes an accelerator.

## Step 2: Structuring the Data in Google Sheets

Once signals start flowing in, resist the urge to jump straight to AI.

Structure matters.

I used a simple schema:
![Screenshot of Google Sheet with source, title, url, published_at, ingested_at columns](/images/posts/ai-automation-gsheets.png)

That may look trivial. It is not. Structured inputs beat raw content. Always.

Every source now looks the same. And once everything looks the same, you can reason over it as one dataset. That is what makes the next step possible.

> [!TIP]
> **Fast-track a Google sheet**
> Did you know you can navigate to `sheets.new` to quickly spin up a new spreadsheet?

## Step 3: Synthesizing Trends with AI

Now we add the second Zap.

A scheduled workflow:

Trigger:

```text
Every day at 8 AM
```

Action sequence:

![Diagram of daily scheduled Zap: Schedule trigger, Get Many Spreadsheet Rows, OpenAI Conversation step, Email output](/images/posts/ai-automation-email-zap.png)

This is an important distinction:

We are not summarizing articles. We are asking the model to detect patterns *across* articles.

That is different.

In this workflow, we are using AI primarily as a synthesizer. Not as a content creator. That is where the value shows up.

## Prompt Engineering, Simple but Powerful

The quality of this system depends heavily on prompt design.

Prompting is not about clever wording.

It is about clarity.

### Weak prompt

```text
Summarize trends from this data.
```

Too vague.

### Better

```text
Identify top trends in AI from this dataset.
```

Better. Still under specified.

### Recommended

```text
You are a marketing strategist for a B2B technology company.

Each row is:
[source, title, url]

Your task:

1. Identify the top 3 emerging trends
2. Explain why each matters for a marketing team
3. Suggest one practical content angle for each

Rules:

- Focus on patterns across multiple items
- Be concise
- Avoid hype
- Be actionable

```

That gives the model:

- role
- audience
- task
- constraints

Huge difference.

One small instruction improved outputs dramatically:

```text
Focus on trends appearing across multiple items, not isolated headlines.
```

That single line made the system feel much smarter.

## What the Output Looks Like

A daily report might look like this:

```text
Daily AI Trend Report

1. AI agents moving into production
Why it matters:
Companies are operationalizing AI workflows.

Content angle:
How marketing teams can move beyond isolated AI experiments.

2. Growing focus on model reliability
Why it matters:
Trust and evaluation are becoming central.

Content angle:
Guide to evaluating AI outputs in marketing workflows.

3. Tool fragmentation in the AI ecosystem
Why it matters:
Teams struggle choosing tools.

Content angle:
Framework for selecting an AI workflow stack.
```

It is intentionally lightweight. Read in minutes. Useful immediately.

## Limitations

This system is helpful. It is not magic.

Some caveats:

- **Inputs are noisy -** Reddit can be speculative. Hacker News can skew technical. That noise shows up.
- **The model is pattern matching, not doing deep research -** Sometimes outputs will be generic. Sometimes wrong. That is normal.
- **It lacks your context -** It does not know your business strategy. It surfaces possibilities. You apply judgment. Think of this as a filter. Not an oracle. That framing matters.

## Why This Matters for Marketing Teams

At first glance this looks like a time saver. It is. But that undersells it. The bigger gain is attention.

Most teams do not struggle because they lack execution. They struggle because attention is fragmented.

Too many inputs.

Too much noise.

Not enough synthesis.

This changes that.

Instead of reacting to what you happen to see, you review a consistent signal layer. That leads to better decisions. And it hints at something larger.

AI becomes useful when embedded inside workflows. Not as a standalone tool. As part of a system.

That pattern scales far beyond trend discovery.

## What’s Next

Right now this system stops at insight. Next we turn those insights into output.

In the next post, we’ll use these trends to generate short-form social content and begin building a multi-step AI-assisted content workflow.

We move from:

```text
signal → insight
```

to:

```text
signal → insight → content
```

And that is where things start to get interesting.

---

If you build a version of this, or extend it in a clever way, I’d love to hear how.

I suspect once you start thinking in workflows, you’ll begin seeing opportunities for automation everywhere.
