---
title: Welcome to Chempedia!
published: "2009-10-28T00:00:00.000Z"
---

After a few weeks of intensive effort and help from some awesome alpha testers, the new [Chempedia](http://chempedia.com) is now up and running.

# What is It?

Chempedia is the free and open chemical substance registry. It enables anyone to register, at no cost, individual substances through a Web-based interface. Each substance receives a unique, numerical, checksummed identifier that can be used anywhere and looked up at no cost. Each substance also gets a canonical URI from which everything that is known through Chempedia can be found.

Substances are also named, again, through a Web based interface.

Right now, Chempedia is exclusively focused on the problems of public substance registration and naming. It turns out these problems are widespread and central to just about every situation in which information technology can be applied to chemistry.

However, I think Chempedia has taken a unique approach that can be applied to many other kinds of chemical information, both publicly-hosted and privately-hosted.

# Opinionated Cheminformatics Software

Chempedia was built around some strong opinions, the central one being that chemists care about their fellow chemists at least as much as the data they generate. Chemistry is a global community effort. The problem is that most chemical information systems focus exclusively on data, leaving the people behind that data marginalized at best, and out of the equation altogether at worst.

# Trust and Reputation

Trust and reputation play major roles in the practice of chemistry, as any of you who have had bad experiences with "one of those journals" or "one of those groups' results" can attest to. When you have some measure of confidence in the quality of information, you're more likely to use it.

Chempedia aims to offer high-quality chemical information through a community-guided process of peer-review and the smart application of Web technologies, rather than an expensive, bureaucratic authority.

# Peer-Review

Chempedia uses a [streamlined from of peer review](http://chempedia.com/about/peer-review) that combines concepts used in traditional peer review with experiences learned from modern social media.

The system is simple to understand (although remarkably complex to implement).

Every Chempedia user gets a reputation score. This score is visible, along with your name, with the bits of information you submit to Chempedia. Your score changes based on how you use the system:

- When you successfully register a new substance, your score increases.
- When another user names your substances, your score increases.
- When you name a substance, and another user votes it up, your score increases. If your name is voted down, your score decreases (by less than the point value of an upvote).
- You can delete any substance naming that was voted down, thus adding back all reputation points that were subtracted by downvotes.

Similarly, each naming also has a score that changes as users vote it up or down.

In other words, we're tying to create a system that keeps itself in check by empowering users themselves to make important changes in real-time.

# OpenID - Promoting Engagement by Reducing Login Fatigue

Because Chempedia places such an extremely high value on community involvement, it needed a robust technical solution to the problem of login and password fatigue.

Chempedia has implemented a system with one-click login and two-click account signup. The system allows users with Gmail and Yahoo! email accounts, among others, to signup using those services. To do that, we're using [OpenID](http://openid.net/) and the excellent [OpenID selector](http://code.google.com/p/openid-selector/) package.

Quite to my amazement, in 30+ account creations, I've received only one report of a problem in signing up/logging in, which was easily fixed.

Apparently, OpenID actually works now.

# The Future

Building chemical information systems that put people in the center of the action is just one of the things about Chempedia that makes it unique. As the system gets used, I'm sure many new insights will be gained, and many new ideas for additional services will present themselves. Some of them will be discussed here. Most will be discussed through the [Chempedia feed](http://products.metamolecular.com/chempedia) and the Chempedia email newsletter ([signup here](http://metamolecular.com/contact) with a subject line of 'Chempedia').