---
title: Demystifying Java Applets Part 3 - Failing Gracefully When Your Users Don't Have Java
published: "2008-03-12T00:00:00.000Z"
---

Contrary to popular misconception, Java applets are a mature technology ideally suited for building highly interactive Web content. Although this hasn't always been the case, a lot has changed since Sun's introduction of Java over a decade ago. Previous articles in this series have discussed why [the object tag alone can and should be used to deploy applets](/articles/2008/02/20/demystifying-java-applets-part-1-cross-browser-standards-compliant-pure-html-deployment-using-the-object-tag) and how [using the Javay deployment method](/articles/2008/03/10/demystifying-java-applets-part-2-dry-deployment-with-the-javay-method) can make life easier if you do. This article will address one of the most important questions of all when using applets: what happens if your user doesn't have Java?

# Assume Your Users Won't Have Java

Java is ubiquitous, but it's not universal. Some users simply won't have a Java Virtual Machine (JVM) installed at all on their systems. Some will have one, but it will be disabled. Still others may have been browsing the Web for years, never realizing that Microsoft [installed a hopelessly obsolete JVM](http://java.sun.com/j2se/1.4.2/docs/guide/deployment/deployment-guide/upgrade-guide/) on their machines without their knowledge, rendering useless a large amount of Web content.

Regardless of why they might not have the JVM your applet requires, assume that a good number of your users won't and plan accordingly.

But how?

# The Javay Method and Deployment Failsafes

[The Javay method](/articles/2008/03/10/demystifying-java-applets-part-2-dry-deployment-with-the-javay-method) for applet deployment can be broken down into three main parts:

1.  Using the HTML 4 `<object>` tag - period. Neither `<applet>`, which is deprecated, nor `<embed>`, which isn't even part of HTML, are needed any longer.
2.  Using Microsoft's conditional comments to create an opening object tag that will work with its browsers, but keeping it DRY by re-using the rest of the tag.
3.  Suppressing the ridiculous "Click to activate" message in IE 6/7 with [jActivating](http://jactivating.sourceforge.net/en/).

In contrast to other approaches, with the Javay method, we can:

-  Know our applet will instantiate on all major browsers, and many niche browsers as well.
-  Work only with standards-compliant HTML from start to finish.
-  Stop using `document.write` to create tags, a method which unless properly trapped will silently fail without any indication of what's wrong when JavaScript is disabled or if the script fails for some other reason.
But perhaps the biggest advantages of the Javay method are the ones most often overlooked:

-  It offers a cross-browser method to display failsafe content should Java be disabled or not installed.
-  It provides a highly effective, cross-browser method for users to install Java directly from the page displaying the applet.

# How the Failsafe Works

When modern browsers such as Firefox and Internet Explorer encounter an `<object>` tag requesting a plugin they don't understand, they do two very useful things:

1.  They render any valid HTML appearing after the `<object>` tag's child `<param>` elements.
2.  They prompt the user to install the correct plugin to view the content - without redirecting them to another page.

These two behaviors give us everything we need to gracefully fail if the Java plugin is unavailable. When the Java plugin is installed and enabled, users see the applet as planned. When the Java plugin is either not installed or disabled, users see both a placeholder of our choosing and a prompt, created by the browser itself, offering to install the missing plugin.

The `<object>` tag lets us take this even further. We can specify, down to the revision level, the exact version of Java needed to run an applet. If that requirement changes, all we need to do is change the `<object>` tag and users will be prompted to upgrade their JVM the next time they see our applet - if necessary.

# Live Demo

Here's my company's 2D chemical structure editor, [ChemWriter](http://metamolecular.com/chemwriter), deployed with the Javay method:

[Java content scrubbed]

And here's what the failsafe code looks like when it's rendered:

[Image scrubbed]

# One More Thing

We can take failsafes to yet another level, if we'd like. Let's say Joe comes to our site without the an installed Java plugin. Internet Explorer 6 informs him via a popup that Java is needed. Impatient to see the site's content, he closes the dialog. Without being redirected, Joe can see all of the site's content, except for the parts requiring Java, for which he sees a custom "Plugin Not Found" placeholder. Discovering that the site's content consists of highly-relevant information, he decides he wants to install the Java plugin after all. Clicking on placeholder image takes him to a Java installation page.

Unlike other Java installation pages Joe may have seen, this one is specific to his browser, Internet Explorer 6.

This approach work very well in practice. For example, my company's website, [metamolecular.com](http://metamolecular.com) uses it. Try visiting the [default Java installation page](http://metamolecular.com/java/), and if your browser is included below, you'll be redirected to the browser-specific Java installation page:

-  [Default Page](http://metamolecular.com/java)
-  [Firefox Page](http://metamolecular.com/java/firefox)
-  [Internet Explorer 6 Page](http://metamolecular.com/java/ie6)
-  [Internet Explorer 7 Page](http://metamolecular.com/java/ie7)
-  [Safari Page](http://metamolecular.com/java/safari)

More information can be found in [this article on deploying ChemWriter](http://metamolecular.com/articles/chemwriter-deployment).

# Last Thoughts

Java applets gained a deserved reputation in the late '90s for being difficult to deploy, a view that's now worth reconsidering. Using some simple techniques, Web applications can fail gracefully if Java is unavailable and then take steps to quickly get users back on track.

Getting software reliably and securely installed on any client system is difficult, especially on the open Web. But the Java plugin and the Javay deployment method make it about as straightforward as it can possibly be.

It's time reconsider applets.
