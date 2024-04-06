---
title: "Nifty GitHub Features: Integrated Issue Tracking"
published: "2009-06-15T00:00:00.000Z"
---

*Update June 18, 2009: The MX public repository has been moved to [http://github.com/metamolecular/mx](http://github.com/metamolecular/mx).*

[Issue tracking](http://en.wikipedia.org/wiki/Issue_tracking_system) is a critical feature for many software projects. Over the weekend I had a chance to play with a new GitHub feature - [integrated issue tracking](http://github.com/blog/411-github-issue-tracker).

A specific example from [MX](http://rapodaca.github.com/mx), the lightweight cheminformatics toolkit, illustrates the process. It was found that MX was throwing an exception where none should be thrown. A [new issue](http://github.com/rapodaca/mx/issues/closed#issue/2) was created describing the observed behavior in terms of a [failing test](http://gist.github.com/129352). After diagnosing and eliminating the problem, the issue was closed by adding 'Closes #2' to the git commit message. And voila - the issue was closed with a [link to the commit that closed it](http://github.com/rapodaca/mx/commit/cf3e28b1208744e00bea91dc67ea92b6a68615d0) and a link to the original issue in the commit page.