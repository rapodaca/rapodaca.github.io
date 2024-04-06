---
title: "Out With the Old (Or At Least The Stuff That Prevents Progress)"
published: "2010-01-05T00:00:00.000Z"
---

Depth-First's [first article](/articles/2006/08/12/changes) appeared on August 12, 2006. It used what was at the time an up-and-coming blogging engine called [Typo](http://wiki.github.com/fdv/typo/). I chose Typo because it did most of what I needed and was written in [Ruby on Rails](http://rubyonrails.org), a Web development framework I wanted to learn more about.

# Bitrot

I had no idea that 597 articles later, I'd still be using essentially the same software. At some point very early on I was unable to upgrade Typo and that was that - Depth-First's blogging engine became frozen.

Although Typo continued to work, a combination of factors convinced me this was a dead-end. The frequent reboots to treat a persistent memory leak, and the need for a beefy server to cope. The double-posted comments due to a buggy AJAX implementation. The syntax highlighting system that didn't do Java or JavaScript, and which choked on larger code samples. The inability to interface with conversations happening elsewhere online. And most recently, a barrage of [compliment spam](http://www.jasonmorrison.net/content/2008/quick-tip-keeping-comment-compliment-spam-off-your-blog/) (there's a special place in hell for these people).

# Out With The Old

I had had enough. I looked at alternatives, and didn't find any that suited my needs:

-  **Written in Ruby on Rails.** I'm not a fan of waiting for a patch to be written or a plugin to be developed. If something needs to be fixed or added, I want to know I can get right in and do it. For example, I'm playing with ideas for using Depth-First's nearly 1,000 tags more effectively, and there's nothing like doing that iteratively with a live system.
-  **Inline Admin Interface.** Separating administration from content is not a good idea. Not only do you end up with duplicated code, but it forces the administrator to jump back and forth between contexts to fix things ('now, what was the title of that article I needed to edit...').
-  **Designed around [OpenID](http://openid.net/) (authentication) and [Disqus](http://disqus.com) (comments).** The Web is getting more organized, with services starting to take the place of monolithic systems. OpenID and Disqus are two names to watch in this area.
-  **Deployable with Heroku's Free Plan** I've [written about Heroku before](/tags/heroku) and think it's a great service. The ideal blogging system should work out of the box with [Heroku's free hosting plan](http://heroku.com/pricing#blossom-1).
-  **Pluggable** To customize most Rails applications means getting way too intimate with the underlying models, views, and controllers. I needed an application that could be selectively 'overridden'. [Warp Drive](http://github.com/markbates/warp_drive) was just what I was looking for, but no blogging engine supported it out of the box.

# Hubbub

Not finding any blogging system that fit the bill, I decided to write my own. After all, how hard could it be ;-) ? The result is [Hubbub](http://github.com/rapodaca/hubbub), the pluggable Rails blogging engine. I'll have more to say on Hubbub and what 'pluggable' means in future articles.

There are still some rough edges to be sure. For example, the layout and JavaScript commenting system are broken (to different degrees) in IE 6 and IE 7. And I'm still working on adding the static content pages (those links at the very top of this page). If you find anything else that doesn't work as expected, please <a href="http://mailhide.recaptcha.net/d?k=01OXiugCGBytdikvGnBlesKw==&amp;c=Qk29zI5J5DohAe4sL4_Hz2Zf1_bqUhv8nU6CAbMlSJc=" onclick="window.open('http://mailhide.recaptcha.net/d?k=01OXiugCGBytdikvGnBlesKw==&amp;c=Qk29zI5J5DohAe4sL4_Hz2Zf1_bqUhv8nU6CAbMlSJc=', '', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=500,height=300'); return false;" title="Reveal this e-mail address">drop me a line</a>.

# On Backward-Compatibility

One of the biggest challenges on this project was maintaining backward-compatibility. For example, it was essential that all articles continue to be accessed from their existing URLs (to maintain the [integrity of the archive](/articles/2007/08/09/ten-things-that-surprised-me-about-blogging)). Likewise, comments needed to be moved and reformatted, a custom-job that took much more time than expected. I may write about the tools I used to convert Depth-First's comments to Disqus at some point.

Although there are rough edges around the imported comments, all article links should work as before. Please let me know if you find otherwise.

# Conclusions

In the case of Depth-First, 'broken' didn't happen all at once, but developed over time. Solving the problem resulted in Hubbub, a pluggable blogging engine that may actually have some application to cheminformatics. But more about that later.
