---
title: Plugging Into OPSIN - How to Synchronize Git and Mercurial Repositories
published: "2010-12-14T00:00:00.000Z"
---

A previous post [discussed OPSIN](/articles/2010/12/13/open-source-name-to-structure-conversion-of-iupac-nomenclature-opsin-revisited/), the open source IUPAC nomenclature parser, and some of its recent improvements. OPSIN is an open source project, meaning when the software fails to solve a particular problem, changes can be made on the spot and distributed to the community. If you agree that an open, free tool for parsing arbitrary IUPAC names is good for chemistry and you personally, your next question might be 'how do I get started'? In this article, I'll answer that question by showing one way to synchronize your own changes with OPSIN's public source code repository.

# The Mercurial Dilemma

OPSIN's most recent updates are being shared through [Bitbucket](http://bitbucket.org/dan2097/opsin), a Web-based source code repository that uses [Mercurial](http://mercurial.selenic.com/). [Daniel Lowe](http://bitbucket.org/dan2097) is its maintainer. Mercurial is a distributed [version control](http://en.wikipedia.org/wiki/Revision_control) system that enables loosely-connected developer teams to work together efficiently.

Mercurial has many things in common with [Git](http://git-scm.com/), the version control system that I prefer and have [used for some time](/articles/2008/11/25/goodbye-subversion-hello-git-and-github/). Unfortunately, Mercurial isn't something I want to take the time and effort to learn and use regularly, especially since it's so similar to Git.

We want a way to tweak the OPSIN source locally, push our finished changes out to the OPSIN project for merging, and pull in the latest changes from the OPSIN project so that we can take advantage of the most recent features and bugfixes.

How can a Git user push and pull changes to and from the OPSIN Mercurial repository? Read the next section to get the nitty-gritty, or skip down to see the easy way.

# Hg-Git

[Hg-Git](http://hg-git.github.com/) is a tool the bridges the gap. From the documentation:

[![hg-git](/images/posts/hg-git.png "hg-git")](http://hg-git.github.com/)

>This is the Hg-Git plugin for Mercurial, adding the ability to push to and pull from a Git server repository from Mercurial. This means you can collaborate on Git based projects from Mercurial, or use a Git server as a collaboration point for a team with developers using both Git and Mercurial.

Getting Mercurial and Hg-Git up and running on my Snow Leopard system was not trivial. The trick was to [install Mercurial from source ](http://stackoverflow.com/questions/1461374/installing-mercurial-on-mac-os-x-10-6-snow-leopard) and then [manually install Hg-Git](http://stackoverflow.com/questions/2360944/how-do-i-correctly-install-dulwich-to-get-hg-git-working-on-windows/2733516#2733516).

With these prerequisites out of the way, I needed to set up two public forks to host OPSIN code. The first is [Metamolecular's OPSIN fork on GitHub](http://github.com/metamolecular/opsin), running Git. The second is [Metamolecular's OPSIN fork on Bitbucket](http://bitbucket.org/metamolecular/opsin/) running Mercurial. OPSIN developers can pull changes from our Bitbucket repository directly using Mercurial, and we can work exclusively with Git.

That's it for the public-facing side. Now, on to how this coordination works behind the scenes. We need a local hybrid Git/Mercurial repository ('opsin-hg') that can push/pull changes to/from either Git or Mercurial remote repositories. From [the documentation](http://hg-git.github.com/).

```bash
hg clone https://metamolecular@bitbucket.org/dan2097/opsin
mv opsin opsin-hg
cd opsin-hg
hg bookmark -r
```

Now we push the contents of opsin-hg to our public [OSPIN GitHub](http://github.com/metamolecular/opsin) and [OPSIN Bitbucket](http://bitbucket.org/metamolecular/opsin/) repos:

```bash
hg push git+ssh://git@github.com/metamolecular/opsin.git
hg push ssh://hg@bitbucket.org/metamolecular/opsin
```

At this point, we have two exact copies of the OPSIN code, one on GitHub and one on Bitbucket.

If our Github repo accumulates changes we want to push to bitbucket, we can do so with:

```bash
cd opsin-hg
hg pull git+ssh://git@github.com/metamolecular/opsin.git
hg update
hg push ssh://hg@bitbucket.org/metamolecular/opsin
```

You may be thinking that we can use the opsin-hg repo directly using Git commands, but we can't, as far as I know. opsin-hg simply knows how to work with remote Hg and Git repos. We can't issue git commands to opsin-hg because it's not actually a Git repo. We need to create one.

# Using the Metamolecular OPSIN GitHub Fork

We've created an exact [copy of the OPSIN Bitbucket repository hosted on GitHub](http://github.com/metamolecular/opsin) that uses Git and which contains the [entire commit history for the OPSIN project](https://github.com/metamolecular/opsin/commits/master), in addition to changes made by us. Using it is now as simple as creating a local fork:

```bash
git clone git://github.com/metamolecular/opsin.git
cd opsin
```

You can now branch, edit, tag, and merge just like you would with any other Git repository. If you want to spare yourself the trouble of maintaining a Bitbucket account and learning Hg, you can send a pull request for your own GitHub OPSIN fork or another public Git repository. We'll merge the changes for you and pass them on to our Bitbucket repository. The OPSIN team can then merge those changes.

Likewise, as updates are merged into OPSIN from other sources, we'll pull those changes and push them out to our GitHub repo.

# Conclusions

Free, effective parsing of IUPAC nomenclature is a fundamental enabler of chemistry's digital future, and OPSIN is the only software capable of filling this need. As such, OPSIN lends itself very well to an open, distributed development model in which a number of individuals and organizations contribute. This article has shown one way to put this idea into practice.

Future articles will show how to get started using the OPSIN source, and the changes we're making to it.