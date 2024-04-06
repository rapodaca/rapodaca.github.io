---
title: "Always Be Testing: Using Mockito in MX"
published: "2009-06-29T00:00:00.000Z"
---

[Test-driven development](http://en.wikipedia.org/wiki/Test-driven_development) (TDD) is an iterative technique for software development in which a failing test is written *before* a single line of production code is written. Like any technique, it has its limitations and isn't applicable in every situation. Nevertheless, TDD is a powerful method to create more robust low-level code and more effective high-level designs.

The early days of TDD were not much fun. The reason: the whole idea behind object-oriented software is to divide responsibilities among cooperating objects, which greatly complicates independent testing of isolated object behavior. A test that started out verifying the behavior of a single object could quickly become a test verifying the behaviors of large numbers of dependent objects (and their dependencies) as well.

An approach to this problem that has gained traction over the last few years is [mocking and stubbing](http://martinfowler.com/articles/mocksArentStubs.html). Although the terminology has become a bit tortured, the basic idea is to use stand-in objects whose behaviors can be pre-defined and later verified when testing an object with dependencies.

If all of this sounds a bit abstract, consider this example from [MX](http://metamolecular.com/mx), the lightweight cheminformatics toolkit.

Current activity in MX is focused on a Walker class that 'walks' the graph structure of a Molecule representation in depth-first order, reporting what it finds to a Reporter. To direct its progress, a Walker uses a Step. So, to write tests for Walker, we're dealing with at least two dependencies: Step and Reporter.

Given that we'd like to use test-driven development, how do we write the first Walker test?

The approach taken in MX is to use mock objects created with the [Mockito](http://mockito.org/) library. Although there are many mocking solutions for Java, I've found Mockito to be the most  intuitive and easy to use.

For example, consider this test, which verifies that a Walker doesn't continue walking past a maximum depth (click [here](http://github.com/rapodaca/mx/blob/36d044b6ca2f5ec8cc71db25545fa2a3ca368458/src/com/metamolecular/mx/test/DefaultWalkerTest.java) to see the whole test):

<script src="http://gist.github.com/137972.js"></script>

where doStep simply calls walker.step:

<script src="http://gist.github.com/137681.js"></script>

In other words, rather than concocting a real Molecule that would set up the path behavior we need to test, we set up the states of all our dependencies directly such that they exhibit the testable behavior.

This buys us a couple of things. First, when our test fails, we can be sure it's failing because of either the way we set it up or the Walker implementation we're testing - not the dependencies. Second, we can specify the test environment and the actions taken on it with far greater precision.

There are many approaches to solving the testing dependency problem, and this is but one. Finding an approach that works for you can be a powerful way to increase your individual productivity and that of your team.

*Update June 29, 2009: The original test didn't work as intended and has since been replaced with a simpler approach that does.*