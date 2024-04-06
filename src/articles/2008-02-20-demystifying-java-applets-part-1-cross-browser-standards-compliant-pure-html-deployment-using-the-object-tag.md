---
title: Demystifying Java Applets, Part 1 - Cross-Browser, Standards-Compliant, Pure HTML Deployment Using the Object Tag
disqus: true
published: "2008-02-20T00:00:00.000Z"
---

**Update June 10, 2009**: *The information in this article, while accurate, has been superseded by [Applet-Fu](http://products.metamolecular.com/2009/06/08/better-applet-deployment-with-applet-fu), a small JavaScript library that simplifies the use of the applet deploy technique described here.*

A [2006 survey on java.net](http://today.java.net/pub/pq/89) posed a simple question to developers: What's wrong with applets? By a significant margin, the number one complaint was that they are "too hard to deploy." This article, the first in a series, takes a look at the issue of Java applet deployment and in particular how using the &lt;object&gt; tag can radically simplify and enhance both the developer and end user experience.

# Applets? You Must Be Joking!

Applets got a well-deserved bad reputation in the early days of Java. They were slow, difficult to deploy across browsers, and over-hyped. The situation has signficantly changed for the better, but the bad reputation lingers.

There are many situations in which applets are inappropriate. The most important of these is when simple interactivity can be achieved through HTML or JavaScript (Ajax).

But in many situations, HTML and JavaScript make a poor platform choice. As a specific example, consider [Web-based chemical structure editors](/articles/2007/11/27/chemwriter-chemical-structures-and-the-web). The high level of [graphical manipulation](/articles/2008/02/14/the-art-and-science-of-chemical-structure-diagrams-chemwriter-as-chemically-aware-vector-graphics-system), sophistication of data processing, and responsiveness required by these components, coupled by their ubiquity, means that it will be a long time indeed before Ajax (or Flash for that matter) is up to the challenge - and they may never be, given their design constraints.

For a large number of specialized Web components, applets are the only platform.

Regarding the "uncool factor", it's worth pointing out that not more than four years ago JavaScript was one of the most loathed, ridiculed, and ignored technologies around. Now it [finally works](http://www.paulgraham.com/web20.html) - meaning it's reliable enough to be used on all modern browsers. The result is Ajax and a host of interactive Web technologies that played a major role in redefining what the Web was all about.

Whether a similar renaissance happens for applets is anybody's guess, but most of the prerequisites have already been met.

# Deployment with the `<applet>` Tag

If you decide to develop Web applications with applets, a major consideration will eventually become how to deploy them. Unfortunately, a bewildering array of often contradictory advice is available on the subject - most of it outdated.

Many sources recommend using the `<applet>` tag. It's the oldest method, and will generally work on most browsers. For example, to deploy my company's structure editor applet [ChemWriter](http://metamolecular.com/products/chemwriter), the following code could be used:

```xml
<applet code="com/metamolecular/chemwriter/applet/EditorApplet.class"
        archive="/path/to/applets/chemwriter.jar"
        width="600" height="300">
  <param name="persistState" value="false" />
</applet>
```

Unfortunately, the `<applet>` tag has some very important strikes against it. The first is that its use is [now deprecated](http://www.w3.org/TR/html401/struct/objects.html#h-13.4) in HTML. In other words, whatever support browsers now have for it is living on borrowed time.

The second problem with the `<applet>` tag is an insidious bug in Internet Explorer (as if there were any other kind). Most hardware suppliers pre-install Java onto their Microsoft-based machines, which is a good thing. The bad thing is that at least one major manufacturer disables the Java console in IE 7 at the same time. Under IE 7, disabling the Java console renders all `<applet>` tags invisible. Counterintuitive as it may seem, this is what happens. The insidious part is that perplexed users *know* they have Java installed because they can see the plug-in, are being told by IE that it's active, can find some applets that *do* work and - well, you get the idea.

The third problem with the `<applet>` tag is that, by itself, it has no mechanism to indicate which version of Java is required. This can be a very important consideration for applets that take advantage of the major advances in functionality and performance of the Java platform in recent years.

# A Better Way: Deployment with the `<object>` Tag

All major browsers support the `<object>` tag, and this is the [preferred method for deploying applets](http://ww2.cs.fsu.edu/~steele/XHTML/appletObject.html). Provided that Internet Explorer's peculiarities are accounted for, a single piece of valid HTML can render applets on all major browsers including:

- IE 6/7
- Firefox 1.5/2
- Safari

As a specific example using ChemWriter, the `<applet>` tag above can be re-written with the `<object>` tag:

```xml
<!--[if !IE]> -->
<object classid="java:com/metamolecular/chemwriter/applet/EditorApplet.class" 
              type="application/x-java-applet"
              archive="/path/to/applets/chemwriter.jar" 
              height="350" width="550" >
  <param name="code" value="com/metamolecular/chemwriter/applet/EditorApplet.class" />
  <!-- For Konqueror -->
  <param name="archive" value="/path/to/applets/chemwriter.jar" />
  <param name="persistState" value="false" />
  <center>
    <img src="/path/to/images/chemwriter_logo.png" />
    <p><strong>ChemWriter content requires Java 1.4.2 or higher, which your browser does not appear to have.</strong></p>

    <p><a href="http://www.java.com/en/download/index.jsp">Get the latest Java Plug-in.</a></p>
  </center>
</object>
<!--<![endif]-->
<!--[if IE]>
<object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" 
                codebase="http://java.sun.com/products/plugin/autodl/jinstall-1_4-windows-i586.cab#Version=1,4,0,0"
                height="350" width="550" > 
  <param name="code" value="com/metamolecular/chemwriter/applet/EditorApplet.class" />
  <param name="archive" value="/path/to/applets/chemwriter.jar" />
  <param name="persistState" value="false" />
  <center>
    <img src="/path/to/images/chemwriter_logo.png" />
    <p><strong>ChemWriter content requires Java 1.4.2 or higher, which your browser does not appear to have.</strong></p>
    <p><a href="http://www.java.com/en/download/index.jsp">Get the latest Java Plug-in.</a></p>
  </center>
</object>
<![endif]-->
```

Before explaining the code, here's what the verbosity buys:

-  It works with both IE 6/7 *and* standards-compliant browsers such as Firefox.
-  It avoids the use of [JavaScript JVM detection methods](/articles/2007/11/20/write-once-run-anywhere-simplifying-java-applet-deployment).
-  It prompts the user to download the correct JVM, *without immediately directing them away from the current page*.
-  Firefox and IE users can opt to install the Java plugin without ever leaving their current page.
-  It works in IE 7 with the Java console disabled.

# You've Got Some 'Splainin' to Do

The code above is based on documentation found on [this site](http://ww2.cs.fsu.edu/~steele/XHTML/appletObject.html), which also details the meaning of the `codebase` and `classid` attributes.

The main idea is that Internet Explorer handles the `<object>` tag in its own idiosyncratic, lovable way. Most of this difference is in the `<object>` element itself and the `classid` attribute in particular. By taking advantage of Internet Explorer's support for [conditional comments](http://msdn2.microsoft.com/en-us/library/ms537512.aspx), we can handle both IE and the rest with one chunk of HTML.

# A Live Demonstration

For a live demonstration of the above technique, see the [ChemWriter Home Page](http://metamolecular.com/products/chemwriter/). If you have Java 1.4.2 or higher installed and activated in your browser, you'll see the most recent version of the ChemWriter editor applet. If not, you'll see the ChemWriter logo and a link to install Java. Firefox and IE will also display an "Install Plugin" bar at the top of the browser for in-place installation of the JVM.

# Click to Activate: Working Around Eolas

A [recent Depth-First article](/articles/2007/11/02/eolas-and-jactivating-working-around-a-workaround) discussed the problem that IE 6 and 7 have involving a "click to activate" (or "Eolas") message that appears with applets and all other browser plugins. To eliminate this issue, the [ChemWriter Home Page](http://metamolecular.com/products/chemwriter/) uses the excellent [jActivating library](http://jactivating.sf.net/). This JavaScript library, which is included in the HTML `<head>` tag, obviates the need to write the `<object>` tag using JavaScript. All that's left is pure, standards-compliant HTML to debug, deploy, and maintain.

# Conclusions

Applet deployment, like Java itself, has come a long way in the last ten years. This article has shown one method to deploy applets into highly heterogeneous computing environments with relatively little effort.

But deployment is only one aspect of interactive Web development using applets. Future articles will discuss some of the others.
