---
title: "Fighting Comment Spam on the Cheap with CAPTCHA"
published: "2007-09-01T00:00:00.000Z"
---

If you run a blog or website that allows public input, you've almost certainly been subjected to a spam attack. This is a problem because even one successful attack can eat up hours of time. After a recent spam attack on this blog, comments were disabled altogether. They've now been restored with the help of a more robust kind of protection, which is the subject of this article.

One of the best forms of spam protection is the [Completely Automated Public Turing Test to Tell Computers and Humans Apart](http://en.wikipedia.org/wiki/Captcha) (CAPTCHA). CAPTCHA comes in many guises but usually consists of a noisy image of some text that a user must enter, like this one from [Digg](http://digg.com):

![Diggcap](/images/posts/20070901/diggcap.png "Diggcap")

There are many CAPTCHA systems. The disadvantage most of them share is that they must be deployed on a server. Depending on your hosting situation and your platform, this may or may not be feasible. D-F is run by the [Ruby on Rails](http://rubyonrails.org) blogging software [Typo](http://typosphere.org). Most CAPTCHA systems for Ruby require the installation of the C extension [RMagick](http://rmagick.rubyforge.org/) and its dependencies, which is either difficult or impossible on many hosts.

I recently found two solutions to this problem, and have implemented one of them:

-  **[captchas.net](http://captchas.net)** This free service generates CAPTCHAs on a remote server, which your own server uses. By writing a small Ruby library and some glue code, I was able to integrate this solution, which is currently running on D-F. Here's an example in action:

![dfcap](/images/posts/20070901/dfcap.png)

-  **[reCAPTCHA](http://recaptcha.net)** Not only does this service generate CAPTCHAs for you, but your users actually help solve OCR problems in the process. Talk about a win-win situation. If this sounds impossible, check out the description [here](http://recaptcha.net/learnmore.html). As an added bonus, [reCAPTHCA APIs](http://recaptcha.net/resources.html) are available in a number of languages, [including Ruby](http://www.loonsoft.com/recaptcha/). reCAPTCHA is currently used on popular sites such as [Twitter](http://twitter.com) and looks like this:

![Recap](/images/posts/20070901/recap.png "Recap")

The struggle against spam is an arms race. Currently, the best weapon for legitimate content producers is CAPTCHA, but even it can be foiled by a determined spammer. If past history is any guide, even more sophisticated forms of spam attacks and countermeasures are just around the corner.
