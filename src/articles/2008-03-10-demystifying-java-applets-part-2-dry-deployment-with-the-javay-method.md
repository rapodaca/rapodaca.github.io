---
title: Demystifying Java Applets Part 2 - DRY Deployment with the Javay Method
published: "2008-03-10T00:00:00.000Z"
---

Java applets are easy to deploy in a standards-compliant way across multiple browsers - you just need to know how. The [previous article in this series](http://depth-first.com/articles/2008/02/20/demystifying-java-applets-part-1-cross-browser-standards-compliant-pure-html-deployment-using-the-object-tag) gave some general pointers to better applet deployment, including the use of the <code>&lt;object&gt;</code> tag. This article will show how to make this deployment method even more concise with the **Javay Method**.

# Keeping it DRY

The code from the previous article used two completely different <code>&lt;object&gt;</code> tags: one for Internet Explorer and one for all other browsers:

```xml
<!--[if !IE]&gt; -->
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

Conditional comments are used to ensure that IE sees one definition and standards-compliant browsers see another. But notice the large amount of repetition, specifically the parameters list, the failsafe code, and the closing <code>&lt;object&gt;</code> tag.

Surely there must be a better way.

# A Widespread Problem

Microsoft's idiosyncratic use of the <code>&lt;object&gt;</code> tag doesn't just cause difficulties for Java applets: it rears its head with all plugin content. This problem is so widespread in the Flash world that its solution even has a name: [Flash Satay](http://www.alistapart.com/articles/flashsatay/).

In the language of Drew McLellan, inventor of Flash Satay, the applet code listing above is the "twice-cooked method" - we repeat the same code twice.

The twice-cooked method violates one of the most important principles in software development: [Don't Repeat Yourself (DRY)](http://en.wikipedia.org/wiki/Don't_repeat_yourself). It's an invitation cross-browser bugs. If we forget to include the same parameter twice, or if we mistakenly use one parameter for IE and another for standards-compliant browsers, for example, we've just created a potentially nasty headache for ourselves.

# Drying Up the <code>&lt;object&gt;</code> Tag

We can DRY up our applet <code>&lt;object&gt;</code> tag by factoring out what's common: the parameters listing; the failsafe code; and the closing <code>&lt;object&gt;</code> tag:

```xml
<!--[if IE]><object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" codebase="http://java.sun.com/products/plugin/autodl/jinstall-1_4-windows-i586.cab#Version=1,4,0,0"
width="480" height="350"><script>/*<![endif]--><script type="text/javascript">/**/</script>
<!--[if !IE]><!-->
<object type="application/x-java-applet;version=1.4.2" width="480" height="350">
<!--<![endif]-->
  <param name="code" value="com/metamolecular/chemwriter/applet/EditorApplet.class">
  <param name="archive" value="/applets/chemwriter.jar">
  <param name="persistState" value="false">
  <param name="licenseKey" value="4BC4-3C59-3E7D-182B-92B7-2E68">
  <a href="http://metamolecular.com/java/">
    Plugin required
  </a>
</object>
</pre>
```

This approach was inspired by the [BlaTek Satay](http://www.blatek.co.uk/blateksatay/) method, which uses the cute empty JavaScript as a way to prevent IE from showing unwanted characters. To my knowledge, it's never before been applied to applets.

In the long tradition of naming these hacks after the original Satay method, I call this one "Javay."

The Javay method's only repetition is in the <code>width</code> and <code>height</code> attributes. Even this redundancy could be eliminated, if we chose, by setting each to "100%" and enclosing the result in a <code>&lt;div&gt;</code> tag that did specify size.

The above code works in all major browsers, including Safari, Firefox, Internet Explorer 6 and 7, Opera, and Camino. If you find a browser on which the code doesn't work, I'd like to hear about it.

Here's what the code produces, using my company's 2D structure editor [ChemWriter](http://metamolecular.com/chemwriter) as an example:

<!--[if IE]><object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" codebase="http://java.sun.com/products/plugin/autodl/jinstall-1_4-windows-i586.cab#Version=1,4,0,0"
width="480" height="350"><script>/*<![endif]--><script type="text/javascript">/**/</script>
<!--[if !IE]><!-->
<object type="application/x-java-applet;version=1.4.2" width="480" height="350">
<!--<![endif]-->
  <param name="code" value="com/metamolecular/chemwriter/applet/EditorApplet.class">
  <param name="archive" value="/applets/chemwriter.jar">
  <param name="persistState" value="false">
  <param name="licenseKey" value="4BC4-3C59-3E7D-182B-92B7-2E68">
  <a href="http://metamolecular.com/java/">
    Plugin required
  </a>
</object>

# Conclusions

To summarize, Java applets can be deployed in a cross-browser, standards-compliant way using the Javay Method. This method solves some of the trickier problems when deploying applets, specifically:

1.  Uses the HTML 4 <code>&lt;object&gt;</code> tag, eliminating the deprecated <code>&lt;applet&gt;</code> tag.
2.  Works on both IE and standards-compliant browsers in a DRY way.
3.  Suppresses the annoying "Click to activate" message in IE 6 and 7 with [jActivating](http://jactivating.sourceforge.net/en/).
4.  Avoids the use of <code>document.write</code> and the problems that can arise if JavaScript is disabled.
5.  When Java is either missing or not installed, provides a cross-browser failsafe (more on this next time).
6.  Leaves us with nothing but pure, standards-compliant HTML to write, debug, and maintain.

We've pretty much got everything the old <code>&lt;applet&gt;</code> tag used to have - and more.

But what if your users don't have Java? Tune in next time to see how to solve this problem once and for all.

