---
title: Building ChemWriter 2 - Pivotal Tracker for Project Management
published: "2010-11-19T00:00:00.000Z"
---

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/mTYcHg51sWY" allowfullscreen></iframe>
</div>

If you're involved a software project of any scale, you face the problem of collecting and acting on the numerous bugs, chores, and feature requests relating to it - and doing so in a way that promotes team collaboration. You also face the problem of estimating completion time for various phases of the project.

I have to admit that my solutions to these problems have been pretty pathetic in the past: PostIts, crude databases, and the like. Using systems like this, it's easy for things to fall through the cracks and even to lose track of what you're currently doing as new, higher-priority tasks come in.

Several months ago, I was introduced to a tool that solves all of these problems: [Pivotal Tracker](http://pivotaltracker.com) (or just "Tracker"). Tracker is free, Web-based a project management tool designed around the principles of [Scrum](http://depth-first.com/articles/2010/09/12/scrum-in-under-ten-minutes/). There are two key benefits of this approach:

1.  Tracker forces you to think about the delivery of complex features in terms of smaller, more manageable features (stories).
2.  Tracker provides the same detailed project perspective to all team members - updated in real-time, enabling them to act with less top-level control.
2.  Tracker offers simple yet powerful project delivery forecasting tools.

We've been using Tracker in the development of [ChemWriter 2](http://chemwriter.com) for the last couple of months now. Although Tracker's unique take on project management took some getting used to, it's become an invaluable resource. Within no time at all, our Tracker system has filled in quite nicely:

![ChemWriter Tracker](/images/posts/chemwriter-tracker.png "ChemWriter Tracker")

One of the hard things about using Tracker is estimating how much work will be involved in delivering a feature. For example, very recently we added a feature to ChemWriter 2 that makes it possible to join a sprouted atom by dragging it over an existing molecule atom ([check out the free preview](http://chemwriter.com/signups/new) to see this and other features in action). Given that much of the related work consisted of porting existing Java code from ChemWriter 1.x into JavaScript, I assigned a low score. It turned out that the stark difference in rendering between ChemWriter 2 and ChemWriter 1.x made the task take about 5 times longer than originally estimated.

If you already use a software project management tool, Pivotal Tracker might not offer much beyond a streamlined approach to issue tracking. But if you're starting a new project, or are working on a project without the benefit a real project management tool, it might be worth trying Pivotal Tracker.