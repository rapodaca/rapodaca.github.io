---
title: Simple Installation of Rubidium
published: "2007-11-21T00:00:00.000Z"
---

[Rubidium](http://rbtk.rubyforge.org/) is a Ruby cheminformatics scripting environment. Previously, [a problem](/articles/2007/11/12/parsing-sd-files-with-ruby-and-rubidium) was reported with the RubyForge gem repository that prevented the simple installation of the Rubidium gem. After filing a [bug report](http://rubyforge.org/tracker/index.php?func=detail&aid=15665&group_id=5&atid=101), the problem was resolved.

The problem, which led to a 404 being issued when trying to install the gem from the remote RubyGems repository, was a variant of a [known RubyForge issue](http://rubyforge.org/tracker/index.php?func=detail&aid=15417&group_id=5&atid=102).

You can now install Rubidium like this:

```bash
$ jruby -S gem install rbtk
```

Installation takes a few minutes due to the large size of the included [Chemistry Development Kit](http://cdk.sf.net) jarfile.