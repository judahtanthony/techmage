---
title: Effective Project Management
publishedAt: 2023-01-05 00:00:00
author: judah-t-anthony
image: /images/posts/effective-project-management.png
excerpt: Scrum, Kanban, Gantt, and Jira tickets. The world of project management is full of a bewilderment of tools and frameworks. Organizing a large team to bring a complex, abstract idea to fruition takes skill, experience, and just a bit of luck. Don’t worry. I will walk you through all the considerations in managing a software engineering project.
tags: 
  - Project Management
  - Product Management
  - Software Development
  - Agile
  - Engineering Management
source:
  name: Medium
  url: https://medium.com/@judahtanthony/effective-project-management-d183b3f46427
---

Scrum, Kanban, Gantt, and Jira tickets. The world of project management is full of a bewilderment of tools and frameworks. Organizing a large team to bring a complex, abstract idea to fruition takes skill, experience, and just a bit of luck. Don’t worry. I will walk you through all the considerations in managing a software engineering project.

## Roles and Responsibilities

One of the first things you will have to establish for any project is clarity on the roles and responsibilities required.

### The Agile Trio

Within the Agile system, it is recommended that you identify three roles that have differing and sometimes competing priorities: the product owner, the scrum team, and the scrum master.

![a triangle describing the relationship of the Product Owner, Scrum Team, and Scrum Master](/images/posts/1_FRrHKIQZdE47sZPvO9rK0A.webp "agile roles")

The _product_ owner is the one who is responsible for requirements; they define success. Often, they are the one that is commissioning the work, but that is not always the case. They tend to be the one who prioritizes the work and is incentivized to optimize on time-to-value.

The _scrum team_ is the people doing the work. This includes engineers but can also include designers and data scientists. They understand the systems and are closest to the work, so they are better equipped to dictate how difficult, complex, and risky any given solution is. They are responsible for pointing the backlog and are incentivized for stability.

The _scrum master_ is the traffic director. They run the scrum processes. They track progress, ensure communication, and are responsible for the health of the system. They are incentivized to optimize on accuracy.

Not all companies that use scrum identify these three roles. Some companies have product managers that play a similar role to product owners, but they have to weigh efforts across a number of products and features and are often responsible for objectives. Some companies let engineering managers play the role of scrum master, while others split the responsibilities with a project manager.

## DACI

At Codecademy, we have found that big, complex initiatives need a system like DACI. DACI is one of [many acronyms](https://en.wikipedia.org/wiki/Responsibility_assignment_matrix) that describes a set of relationships to a given problem. In this case, it represents Drivers, Approvers, Contributors, and Informed.

**Drivers** are just that. They are the main person driving a project or initiative. They handle coordinating work and communicating progress. This person is on the gas pedal.

**Approvers** are oftentimes the same person as the Driver but not always. If driving was delegated down, an approver might be in leadership. If the problem has a specific risk, an approver may be someone in the security or finance departments.

**Contributors** are anyone that is working on the project. Some contributors, like developers, may be working on it full time. Others, like SEO consultants or the marketing team, may simply be providing some advice or assistance.

**Informed** is the group of people that aren’t working on a project but would benefit from knowing about it. This may be people on adjacent teams or in other departments. They will be informed of the progress and outcome, but they are not responsible for any work or decisions.

I have heard the term stakeholder used to describe the “informed” group, but this term has been used so broadly that it is beginning to lose meaning. Some use it to mean anyone outside the dev triad (product, engineering, and design). Others have used the pig-chicken analogy. The dev team is the pig, and stakeholders are the chicken. In order to get a bacon and egg breakfast, the chicken may contribute, but the pig’s butt is on the line.

The key here is to establish who is involved and to clarify what is expected of each person.

## Plan the Work

Certainty is comforting, but it is also expensive. Absolute certainty is a luxury (if not an illusion). That is why I recommend getting comfortable with ambiguity.

If you completely plan and research a project, you will have more accuracy in the execution, but if there is a strategic priority shift you will find yourself throwing away a lot of work. If you don’t plan at all, you can reprioritize and pivot at will, but it is bound to be a bumpy ride. How will you even know when you have arrived if you haven’t bothered to decide where you are going?

For this reason, I recommend making planning an ongoing process that you continue to refine as you are more confident in the requirements.

### Phased Approach

Many times the clearest and most efficient way to run an engineering project is through four distinct phases that are driven by different parties and have clear, pre-established deliverables.

The _planning phase_ is driven by a product manager and involves defining the problem you are trying to solve, identifying a solution, and creating success criteria. The deliverables are often a product brief and sometimes go as far as a set of user stories (described in the Structure Your Work section. A product brief is a short document outlining the problem, goals, metrics, and any context necessary to understand, prioritize, and start research.

The _design phase_ is driven by product designers. They take the solution and their understanding of the existing product and industry best practices to create a fully fleshed out plan for how this solution will look and behave. The deliverables are often userflows, wireframes, and full designs. Userflows are a visual map of how a user interacts with and navigates through a feature.

The _build phase_ is driven by engineers. They take all the definitions of “what” should be built, and they figure out “how” to build it. The deliverables of this phase should be working software.

The _measure phase_ is driven by a data scientist (if available) or the product manager. This generally involves some kind of testing, rollout strategy, and reporting. The goal of this phase is to determine if you actually solved the problem you set out to solve. The deliverables are often dashboards and (preferably) a pivot/iterate decision.

![a phased schedule of multiple phased broken out over 31 days](/images/posts/1_AhzSttsfwM_OZJbr9PDoiQ.webp "waterfall")

This method has been called the waterfall method due to the way one stage flows into the next. Though this may be an efficient way to run a project, it is not necessarily the most effective. People have rightly criticized it as risky. One of the sources of risk is the fact that you don’t actually know you have solved your users’ problem until all the work is completed.

Many have suggested that, in order to reduce risk, you need to deliver the value more quickly. However, a naive approach to this would simply entail doing everything you did before but faster.

![the same schedule as above, but with half the time](/images/posts/1_MNEWOXW5o5dVsgGb5r9Uog.webp "agile-fall")

This is an understandable impulse, but in reality, you don’t get something for nothing. What this hurried approach inevitably results in is a compromise of scope or quality, which leaves either the product manager or the engineers unhappy with the final results.

### Staggered Approach

In order to get a different outcome, you need to change how you approach the work in the first place. The first step to this is to blur the lines a bit between the phases. I call this the staggered approach.

![a staggered schedule over 24 days where most phases begin slightly before the previous ended](/images/posts/1_90I75h79IRkdolbmv-StEg.webp "staggered")

As I suggested at the beginning, you should start to invest in any area (or phase) to the degree you are confident in it.

When starting the process, you are often not confident in what you are trying to achieve, so that naturally has to be the first thing to establish. However, you don’t have to be fully confident with the solution in order to start exploring userflows and even wireframes. Similarly, if you have solid wireframes, you usually have enough information about the solution to start some technical exploration, modeling, and even work on the backend APIs.

This nuanced approach leads to a more sophisticated way of planning out a project.

### Dependency oriented Approach

The real gains come when you deeply understand the work and map out the various dependencies among each task. This is a systems approach that organizes based on inputs and outputs.

![a complex diagram of work (not phases) that tracks the various dependencies for each task.](/images/posts/1_6D4TXYVyntQ9c-IZG9m0zw.webp "dependency oriented")

Structuring your work like this is not easy. It requires lots of communication and collaboration; however, it allows you to fan out your work across more work-streams (or people), so that you can deliver value sooner.

Is this the most efficient way to structure your work? No.

### The Project Management Triangle

As I have said previously, you don’t get something for nothing. I have promised that you can realize gains in time without compromising on _quality_ or _scope_. So how can I deliver on that promise while not betraying the [project management triangle](https://en.wikipedia.org/wiki/Project_management_triangle)?

![a venn diagram of quality, time, and cost where only two ever over overlap](/images/posts/1_mZL5QXEXw3NSf-dZGppS2Q.webp "project management triangle")

This parallels the saying, “Fast, Cheap, and Good…pick two.”

A clue was hidden in the list of benefits. You can effectively distribute the work over a larger team. In increasing the parallelization of the work, you turned one workstream into at least five.

Why would I recommend a practice that is less efficient?

### Efficient is not the same thing as effective

I have learned that often the success of a project (and more importantly a company) is not solely dependent on how cheaply you can get work done. I don’t have the space here to fully address this topic, but suffice it to say, there are many factors (focus of the team, time to market, ability to pivot, the 80/20 rule, etc.) that make delivering a high quality solution as fast as possible more preferable to as cheaply as possible.

### Estimating

Another important part of planning your work is estimating it. I recommend you approach estimations in an ever-refining manner.

Learn about Medium’s values
For very early opportunity assessments, I suggest broad categories. I like to use “t-shirt” sizes when estimating effort, as to avoid our natural desire for a more quantitative, and thus reassuring, estimation.

Before you really understand and have researched a solution, there are still many unknowns and high risks. I want to avoid giving the impression that these estimations can easily be laid out on a calendar. The only value these estimations have is in relation to other similar estimations among opportunities.

As you do the necessary research, and begin to break down and plan the work (described above), you can give more quantitative and accurate estimations.

Some people say you can never accurately estimate work, and you shouldn’t even try. Though I understand the sentiment (through painful experience), I would suggest a more subtle precept. You can never _completely_ know how long something will take until you have completed it.

### RICE

Sometimes a simple cost-benefit analysis will be enough to surface some low hanging fruit, but if you want a more disciplined assessment of many similarly competing projects, you can conduct a RICE scoring.

RICE stands for reach, impact, confidence, and effort. I like this approach because it includes “confidence” into the mix. Similarly to how [Fibonacci](https://en.wikipedia.org/wiki/Fibonacci_number) story point sequences create a “cost” for complexity, RICE penalizes low confidence, high risk projects.

## Structure the Work

There are primarily two different cadences when structuring your work. The work rituals are ongoing activities that follow the sprint cycle. Project rituals are organized around the timing of larger deliverables like projects or milestones.

### Work rituals

If you are operating in some form of scrum/agile methodology, you probably already have a set of practices and rituals to help track and maintain steady progress against goals. A full explanation of scrum is outside the scope of this conversation; however, let me list some of the basic rituals and their purpose.

* story generation — Work is organized in “stories” which are units of user functionality and value. They are often structured as “as a … when I … then I … so that …”. This focuses on what is enabled while providing engineers and designers some flexibility in how they solve these problems.
* story pointing — Story pointing involves collaboratively agreeing on the complexity and effort of a story by assigning it a numerical value. The sequence of numbers used is often [Fibonacci](https://www.scrum.org/resources/blog/practical-fibonacci-beginners-guide-relative-sizing) or powers of two. These sequences serve to penalize large, complex tasks that include more risk, acting as a forcing function causing you to break the work down into smaller units or pad the estimation to compensate for the complexity.
* backlog grooming — Making sure the backlog (or at least a portion of it) is well defined and prioritized, and making sure that all parties are clear on the requirements (e.g. acceptance criteria).
* sprint planning — Collectively looking at your past velocity and your upcoming capacity and committing to a set of stories. This can also include breaking stories down into fine-grained dev tasks as well as setting high-level sprint goals to keep the team focused.
* stand-ups — These are short check-ins to communicate progress and blockers.
* retrospectives — These are meetings to reflect on the most recent sprint. What went well? What didn’t? How can we improve? Often action items and new team working agreements/commitments come out of these meetings. You should be as agile with our processes as with our projects.

At the end of a sprint, you should have completed a set of stories, all of which should be “potentially deliverable”. However, that is from an engineering perspective. That does not always reflect what is possible from a product perspective.

Note, if you can make every story truly deliverable, great! Do it! But, many times the code will be working and stable; however, it will not be a complete enough of an experience to define a minimum viable product (MVP). If that is the case, I encourage you to still break down your grand and glorious vision of your new product into a set of milestones. This will not only allow you to track progress on a high level, but it will also allow you to potentially deliver value and get insights as soon as possible.

### Project Rituals

In addition to the fine-grained work flow control that these systems provide, you will likely (at least for significant projects) require a set of project-related rituals that occur per project but not necessarily on a sprint cadence.

* project kickoff / inception — This happens at the very beginning of a project. This includes introducing all contributors and stakeholders, getting everyone on the same page about the problem, and potentially doing some brainstorming. This could also include some kind of [MoSCoW](https://en.wikipedia.org/wiki/MoSCoW_method) exercise to create some sense of scope, and an agreement on communication methods and constraints.
* dev kickoff — Often times product managers, designers, and engineering managers are involved very early in the process to plan, research, and even build proof of concepts; however, when you are confident enough in a solution to involve a more expensive build out, you will need to get the rest of the engineers up to speed. Dev kickoffs introduce the entire dev team to the project. It allows them to ask questions, review userflows and wireframes, and to be introduced to (or to create) the user stories.
* bug bash / demo — Ideally, you have a strong continuous delivery system that includes feature flags or experimentation frameworks; however, it can still be helpful to have a ritual near the end when things are deployed (but not necessarily “launched”) to review and test all the major flows with the various stakeholders. Designers will review a feature with a different eye than an engineer. A data scientist may spot a misspelling in a tracking call that the product manager overlooked. At the very least, it is good to get clear on what is being included in this release and what is not.

## Track the Work

In the heart of the dev/build section is a period of steady progress toward your goals. This phase’s important responsibilities are to effectively track, communicate, and coordinate the work.

### Track

There are several metrics against which you can track. The easiest metric to track is the number of completed tasks in some kind of ticketing system like Jira or Asana. If you compare this to the total number tasks, you can get a very rough estimate of what percent of the work is done.

One of the weaknesses of this approach is that not all tasks are created equally. In agile systems, you tend to track and measure velocity in the units of story points. In Scrum, you commit to a set of story points and burn down on story points (or dev tasks) over the course of the sprint. In Kanban, you don’t commit to a set of stories at the beginning, but you can track completed stories (or dev tasks) as the sprint proceeds in a burn up chart. This allows you to be more flexible mid-sprint but also requires discipline to enforce other constraints such as active task limits.

![examples of burnup and burndown charts that show how progress can be compared to expectations](/images/posts/1_5FbkYciaIqP_nHFFjlSxBQ.webp "burn down vs burn up charts")

With a healthy, mature team doing fairly understood work, there should be a stable velocity (number of story points completed in a sprint) you can track over time. This helps with projecting and estimating timelines to know if you are on track or if you need to add engineers, move deadlines, or cut scope.

### Communicate

Establishing clear lines of communication is an important element of project management. Hopefully, the DACI (described above) exercise has clarified who needs to understand what information when. You should set up communication channels that are appropriate to the level of visibility and engagement each person needs.

Plan your communication strategy carefully. Scrum planning and stand-ups are important rituals for clear communication, but often only a small set of people will need that level of insight. Some may only need to be present at the final demo or receive a simple newsletter post. Others will need regular check-ins, so they can coordinate the timing of their own work. Think about synchronous or asynchronous methods. Do you need a recurring meeting, or can you get away with a shared document or dashboard?

### Coordinate

If you have a highly complex project that requires deliverables across multiple functional areas, you might find it helpful to use a [Gantt chart](https://en.wikipedia.org/wiki/Gantt_chart) to be able to track requirements and dependencies. Gantt charts can help you organize multiple lines of work that have complex interdependencies. You can configure some tasks to start after others end or even define multiple tasks that need to end at the same time.

![an example of a Gantt chart](/images/posts/1_ZsFfXUWwTxbgJFHk9fjIHQ.webp "source: https://en.wikipedia.org/wiki/File:GanttChartAnatomy.svg")

This means if you have marketing requirements that need to be done at the same time as the launch, you can give your marketing team estimates of when they should get started, but if you have design dependencies that are blocking development, you can clearly find your bottlenecks. Most Gantt charts will allow you to find your “critical path”, the set of tasks that have hard dependencies all the way to the end. Any slippage on the critical path has an impact on the final timeline.

## Deliver the Work

If a project is large, complex, or done in the context of a larger experimental paradigm, there is a lot more to consider than just the code being done.

![a four quadrant diagram of plan, design, build, and measure emphasizing that delivery is an iterative ongoing process](/images/posts/1_TCfPxNdIRW6GiImHiLtLLw.webp "iterate")

### deployed !== done

As an individual contributor, it is easy to fall into the idea that hitting “push” and letting the CI/CD system take it away means your job is done. As an engineering manager, you don’t have that luxury. You need to think about the work in a more holistic fashion.

In a hypothesis-driven approach, post launch is the time to measure your success metrics and actually understand if you have accomplished the goal you set out to accomplish. Even if you are not using a hypothesis-driven approach, you should have enough monitoring to at least answer:

* How do I know my code is working?
* How do I know my code is NOT working?

These are two separate things, and it is tempting to think that one is the contra of the other, but that is not always the case. You may see that people are using your new checkout flow (working), but you might not realize that everyone in the EU is failing to checkout (not working).

### Iterate or pivot

The worst type of data is data that is not being used. That is because you spent the time to collect it and maintain it, but you are not actually using it to make decisions. During the course of a project there needs to be times where you look at the data and decide if you will iterate or pivot.

_Iterate_ — You can iterate for multiple reasons. You may discover the current solution didn’t deliver the expected results or had an unexpected side effect. If the goal/opportunity is still valuable enough, it is worth it to iterate until you get the results you were looking for. A team can get jaded if it sees a recurring pattern of delivering a suboptimal “MVP” but then moves on to the next initiative. In addition, you may note that you are seeing positive results, and that signals it is worth investing more in this area, so you can queue up the next milestones in the project.

_Pivot_ — Similarly, the data may reveal that there was a fundamental flaw in a low-level assumption, and the real solution will likely look very different. Congratulations! This is what learning looks like. Don’t miss the lesson. One thing you should consider is that no code is free. There is always some cost in complexity to your product and codebase, so if some feature is truly not returning any value, you should be responsible by promptly sunsetting the feature. This is how you avoid accumulating technical debt over time.

## These are tools not a recipe

As you can see, managing large successful projects can be complicated, and many of the skills you used as an engineer do not translate or prepare you for it. That being said, there is no better teacher than experience.

I have shared a plethora of concepts and frameworks in this article. You don’t need them all. The calling card of any craftsman is knowing their tools and being able to bring the right tool/solution for the problem at hand.

Start small. Only solve problems you actually have. Perhaps just having a prioritized backlog of tasks is all that you will ever need; however, if you recognize failures in communication, coordination, or expectations, you now have a set of principles that will scale to any sized project.
