---
title: "Balancing Chemical Equations in ReactionMate Part 1: More Than Meets the Eye"
published: "2012-05-17T00:00:00.000Z"
---

Balancing chemical equations is one of the first things taught in most introductory chemistry classes. As such, it might seem as if everything there is to know about the topic was published 75 years ago or more by chemists long since gone.

To my surprise, I found this was simply not so.

This post, the first in a series, discusses why a cheminformatics fan like myself would even consider the problem of balancing chemical equations as a serious topic, and what a deeper understanding of the subject might mean for you.

# Origins: ReactionMate

[ReactionMate](http://metamolecular.com/reactionmate-app/) ([App Store](http://itunes.apple.com/us/app/reactionmate/id524541263?mt=8)) at the moment is a little iOS app with big ambitions. It aims to become a useful companion to anyone studying, performing, or using chemical reactions.

One of the fundamental requirements for processing chemical reactions computationally is the automatic balancing of chemical equations, a function ReactionMate performs relatively well.

Given this foundation, there are many interesting directions the app could be taken, both in education and research. Hopefully, I'll be discussing some of them later.

When I started working on ReactionMate, my main motivation was to better learn iOS development with Objective-C. A reaction balancer, so I thought, would be an easy project.

Although I did reach the first milestone and now have an app for sale to show for the effort, the path was much longer and darker than I imagined.

# Balancing By Inspection

You may remember back to learning how to balance chemical equations in General Chemistry. A  common method still taught is known as *balancing by inspection*. This explanation from Khan Academy is typical:

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/RnGu3xO2h74" allowfullscreen></iframe>
</div>

Although a fine approach for balancing simple equations by hand, balancing by inspection does not lend itself well to use in a software algorithm. I suspect that the same thing that makes balancing by inspection so difficult for students to master is the same thing that makes it unsuitable for use as algorithm: it's hit or miss and then try again.

# Balancing With Matricies/Linear Algebra

A more general and deterministic method for balancing chemical equations uses linear algebra. Given the constraint that the number of atoms of a given type on the left of the equation must equal the number of that type of atom on the right, it's possible to set up a system of linear equations and use matrix operations to solve for coefficients. The video below shows how this works conceptually:

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/IBXTqzBnLqg" allowfullscreen></iframe>
</div>

# Issues

Implementing the necessary matrix algebra in Objective-C was not terribly difficult in a first pass. Coefficients for the first few chemical equations were found without problems.

However, as the number and complexity of tested equations grew, problems began to surface - each demanding a solution. The next installment will discuss some of the issues and how they were addressed.

# Conclusions

Balancing chemical equations is a deep topic at the intersection between mathematics and chemistry. Balanced chemical equations also lie at the heart of many important areas in chemistry. With academic papers appearing as recently as a couple of years ago, this topic is full of surprises.