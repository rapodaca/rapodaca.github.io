---
title: Building Rubidium - Creating a RubyForge Project Space
published: "2007-10-26T00:00:00.000Z"
---

Recent articles have discussed [Rubidium](http://depth-first.com/articles/tag/rubidium), the cheminformatics toolkit for Ruby. In this article, the first in a series, I'll go beyond the Ruby code to discuss the technical aspects of taking an Open Source idea from concept to release.

# Finding a Home

Before setting up your Open Source project, you'll need to decide on how to host it. Project hosting can be as simple or elaborate as you wish, but the basic services include: a website; a mailing list; a discussion forum; a source code repository (typically CVS or Subversion); a bug tracking system; and a file release system.

The multitude of choices can be broken down into two basic options: host the project yourself or use a free hosting service. Fortunately, Ruby-based projects enjoy two excellent free hosting options: [SourceForge](http://sourceforge.net) and [RubyForge](http://rubyforge.org). Although SourceForge could certainly be used for a Ruby project, RubyForge is a more popular option. One of the reasons is that any RubyGem your project releases automatically becomes installable through the [RubyGems](http://rubygems.org/) package management system with a simple one-line incantation:

```bash
sudo gem install <yourprojectname>
```

Another reason to use RubyForge is discoverability. RubyForge only hosts projects related in some way to Ruby. So, your project will stand out a lot more in its category than with a much larger site like SourceForge.

Given RubyForge's advantages, and my own interest in minimizing the work needed to maintain an Open Source project, Rubidium will be hosted on RubyForge.

# Requesting a Project Space

Having decided on RubyForge as Rubidium's host, all that's left is to ask for free services. You'll need to [register for a user account](http://rubyforge.org/account/register.php) if you haven't done so already. Then, simply [apply for project space](http://rubyforge.org/register/projectinfo.php). After about three business days, you should be notified whether your project was accepted.

Several days ago, I completed this process for Rubidium. Its new home on RubyForge will be:

[http://rubyforge.org/projects/rbtk](http://rubyforge.org/projects/rbtk)

The Rubidium home page can be found at:

[http://rbtk.rubyforge.org](http://rbtk.rubyforge.org)

There's nothing useful there yet, a situation that will hopefully be fixed in a few weeks.

# Next Steps

With powerful free services now available for the Rubidium project, we'll want to start taking advantage of them. The next articles in this series will discuss some ways of doing so.
