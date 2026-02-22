---
title: Product Development Principles
publishedAt: 2022-08-12 00:00:00
author: judah-t-anthony
image: /images/posts/0_DoRJDZ8twKci051P.webp
excerpt: Everything should be made as simple as possible, but not simpler. — _Albert Einstein (kind of)_
tags: 
  - Product Management
  - Product Development
  - Project Management
  - Hypothesis Driven Design
source:
  name: Medium
  url: https://medium.com/@judahtanthony/product-development-principles-43d4a045a734
---

Much of my philosophy around product development pertains to risk management. There are three main things I aim to avoid:

1. Compromising quality and timelines.
2. Building what the product manager doesn’t actually want.
3. Building what the customer doesn’t actually need.

These three things are in ascending order of importance. If you build something that is great and on time but isn’t what the company wants, you‘ve wasted your time. Likewise, if you give the company exactly what it wants, but it does not solve a legitimate need for the end-user, then you didn’t actually create any value.

## Identify the problem

This is far more difficult than you may think. Henry Ford once said, “If I had asked people what they wanted, they would have said faster horses.” This is because we usually jump to the solution we think we need, but that solution is often based on the options we have previously seen. We often haven’t taken the time needed to dig down to first principles and identify the underlying problem that we are trying to solve.

In an environment that is volatile and dynamic, it is valuable to take a hypothesis-driven approach.

## Observe a behavior

The first thing to do when faced with many unknowns is start with what is known. Perhaps you have already done some research. Perhaps your customers have given you feedback in the past. Perhaps you have some analytics that portray a poor drop-off rate. Perhaps you have identified an underserved market. Whatever the data, bring it to the table.

Think of this as your evidence. However, don’t assume you know the problem right away. For example, let’s say you have some data that says only 30% of learners that sign up ever start a course. You might assume you’ve made it too difficult to start courses; however, that is just one hypothesis.

## Create a hypothesis

Now is the time to start brainstorming what are the possible root causes of this behavior. What is the problem? Here are some examples:

* high friction to start a course
* a misunderstanding in the types of learners or the learners’ intentions that led to poor value alignment
* learners not able to find the right course
* lack of browser or language support for certain populations
* faulty data due to errors in tracking or e2e (end to end) test pollution

It is even possible that there is no problem at all. The drop-off rate may in fact be inline with the industry norms.

As you can see, there are many different possible problems (including the possibility of no problem at all) that warrant very different solutions.

## Test your hypothesis

Now we need to prioritize and test your problem statements. This is where people often try to jump into large solutions. I encourage you to avoid that. Your test should only be as big as your confidence in the problem, and sometimes the smallest and simplest test can save you from a large, costly mistake.

If you notice, most of these problem statements require no code to test. Some ways to test without writing a single line of code include gathering additional data or auditing your e2e test. However, if there is a problem statement that you simply don’t have enough data for, try to invent an experiment that will be the least effort to answer the question, “Is this really the problem”.

## Plan a solution

If you are confident about the problem, you can continue to iterate on solutions using the same hypothesis-driven approach. Again, try to scale the size of your solution to the confidence you have with the problem.

For example, let’s say you find, through user surveys, that it was simply too difficult and confusing to start a course. Some possible experiments you might run:

* Turn your onboarding into a mini-course that gets people comfortable with the tools and environment.
* Simplify the UI so people don’t get lost in the options.
* Provide a brief survey that determines the learner’s intention and directs them into an appropriate course.
* Give them the option to explore later, with an email reminder.

With this experimental approach, we are being just as objective about our solution as we were with the problem statement. For example, you might find a brief survey actually decreases engagement because the learners want to actually see the tools and features available right away. You might also find that not trying to force users into a course right away but instead providing an easier “remind me” feature reduces the course starts in the first session, but increases initial course starts in aggregate.

## Iterate

There is no clear end to this process. Indeed, that is by design. We are in an infinite game, and we need to set up our processes to ever direct us, not deliver us to some assumed destination. Problems are complex, and customers are varied. You may need a combination of multiple approaches.

The key here is not to “fix” the problem. I know that sounds antithetical to your aim, but I want to make sure you avoid spiraling into perfectionism. The number of problems you are trying to address is always greater than your capacity to address them. That is why it is important to remember the opportunity cost of addressing any given problem.

This is why the key is to have a system in place to re-examine the data, the body of evidence, and the possible problems underlying it, to determine if now is the time to pivot your focus onto the next most important thing.
