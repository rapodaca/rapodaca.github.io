---
title: "Anatomy of a Cheminformatics Web Application: Structure Cleanup in Java Molecular Editor"
published: "2006-12-18T00:00:00.000Z"
---

A very useful feature of many 2-D structure editors is a "clean" function that tidies up bond lengths and angles. <a href="http://www.molinspiration.com/jme/">Java Molecular Editor</a> (JME) is a lightweight 2-D editor that lacks this functionality. In this article, I'll describe a small Web application called "Cleanup" that adds a "clean" function to JME through Ajax and server-side programming, rather than directly extending JME itself. The technique described here differs somewhat from that described in a previous article on <a href="http://depth-first.com/articles/2006/12/15/anatomy-of-a-cheminformatics-web-application-inchimatic">adding InChI support to JME with Ajax</a>.

# Cleanup in Action

Let's say Bob needs to draw the structure of the H<sub>1</sub> antagonist <a href="http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=2725">chlorpheniramine</a> with JME. He mistakenly creates irregular bond angles at several points, but continues drawing anyway. His finished molecule looks like that shown below:

!["Molecule to Clean Up"](/images/posts/20061218/screenshot_1.png "Molecule to Clean Up")

Rather than starting over to beautify his molecule, Bob, simply presses the <strong>Clean Molecule</strong> button. This produces a structure with much more aesthetically-pleasing atom coordinates:

!["Cleaned up Molecule"](/images/posts/20061218/screenshot_2.png "Cleaned up Molecule")

If Bob needs to continue drawing at this point he can. In fact, he can press <strong>Clean Molecule</strong> as many times as he wants to clean his structure at any time. Each time he presses the button, his structure is retained within the JME window.

# Download and Prerequisites

Cleanup requires <a href="http://rubyonrails.org">Ruby on Rails</a> and <a href="http://depth-first.com/articles/2006/10/30/agile-chemical-informatics-development-with-cdk-and-ruby-rcdk-0-3-0">Ruby CDK</a>. Both of these libraries can be installed using the <a href="http://rubygems.org/">RubyGems</a> packaging system.

A recent article described the small amount of system configuration required for <a href="http://depth-first.com/articles/2006/09/25/cdk-the-ruby-way-rcdk-0-2-0">Ruby CDK on Linux</a>. Another article showed how to install <a href="http://depth-first.com/articles/2006/10/12/running-ruby-java-bridge-on-windows">Ruby CDK on Windows</a>.

The <a href="http://rubyforge.org/frs/download.php/15687/jme-cleanup-0.0.1.tar.gz">complete Cleanup source package</a> can be downloaded from RubyForge. For convenience, a copy of JME is included with the distribution. The author, Peter Ertl, has kindly given permission for the bundled JME applet to be used with Cleanup. For other uses, consult the <a href="http://www.molinspiration.com/jme/">JME homepage</a>.

# Running Cleanup

After inflating the Cleanup archive, the following commands will start the server:

```bash
cd jme-cleanup-0.0.1
ruby script/server
```

AMD64 Linux users will need to prepend a <code>LD_PRELOAD</code> assignment to the <code>script/server</code> invocation. On my system, which uses Sun's JDK, this looks like:

```bash
cd jme-cleanup-0.0.1
LD_PRELOAD=/usr/java/jdk1.5.0_09/jre/lib/amd64/libzip.so ruby script/server
```

After starting the Cleanup server, pointing your browser to <a href="http://localhost:3000/editor/cleanup">http://localhost:3000/editor/cleanup</a> will run the application.

# How It Works: A Web Application in Two Parts

Cleanup is a Web application consisting of two main parts - one written for a Web server, and one written for a Browser client. These two components work together to achieve an effect that, to a user, is indistinguishable from extending the JME applet with Java.

The first component consists of small Rails application that accepts a Molfile as input and produces a Molfile with re-assigned coordinates as output. A Rails Action, <code>clean_structure</code> accepts a Molfile encoded as form data and produces a response Molfile with re-assigned coordinates.

The second component of the Cleanup application is written in JavaScript and executed from within the Browser. Let's take a look:

```javascript
/*
* Returns the client-specific version of XMLHttpRequest
*/
function createXHR() {
  var xhr;

  try {
    xhr = new ActiveXObject("Msxml2.XMLHTTP"); // IE 5.0+
  }

  catch (e) {
    try
    {
      xhr = new ActiveXObject("Microsoft.XMLHTTP"); // IE 5.0-
    } catch (E) {
      xhr = false;
    }
  }

  if (!xhr && typeof XMLHttpRequest != 'undefined') {
    xhr = new XMLHttpRequest(); // every other browser
  }

  return xhr;  
}

function cleanStructure() {       
  var molfile = document.jme.molFile();
  var xhr = createXHR();

  xhr.open("GET", "clean_structure?molfile=" + encodeURIComponent(molfile));

  xhr.onreadystatechange=function() {
    if (xhr.readyState != 4) return;

    cleanMolfile = xhr.responseText;

    document.jme.readMolFile(cleanMolfile);
  }

  xhr.send(null);
}
```

As you can see, the client side of Cleanup consists of two JavaScript functions, <code>createXHR</code> and <code>cleanStructure</code>.

The purpose of <code>createXHR</code> is to return a valid instance of the central Ajax JavaScript object, <code>XMLHttpRequest</code>. This function is a standard idiom in Ajax programming, and many JavaScript toolkits eliminate the need to write it explicitly. The function is included here mainly for the purpose of illustration. Microsoft browsers define two different flavors of <code>XMLHttpRequest</code>, and both differ from the flavor supported by every other browser. To take this browser-specific behavior into account, a series of try/catch blocks are used.

The second function, <code>cleanStructure</code> does all of the JME-specific work. After obtaining an instance of <code>XMLHttpRequest</code>, a HTTP GET request is built from JME's molfile. Of course, the magic of this request is that it is <em>asynchronous</em>; it will not block the browser while it is being processed. When the request is complete, the cleaned Molfile is read by JME.

Through the coordinated action of both of Cleanup's components, the application gives the appearance that JME has cleaned its own structure.

# So What?

Well-designed, rich functionality makes software interesting and useful. At the same time, users demand software that loads and responds quickly. Using the technique presented here, it's possible to satisfy both of these contradictory requirements. Delegating key tasks to a server obviates the need to transmit large Java libraries to clients. Instead, small Java libraries can be transmitted, and several small asynchronous requests will be processed along the way.

Viewed from this perspective, the capabilities of a good Java applet take on a very different character from what many have become accustomed to. In particular, extensibility and a robust, text-based communication protocol become much more important than built-in features.

For example, we could provide a much more consistent user experience if the <strong>Clean Molfile</strong> button were contained inside the JME editor itself, instead of on the Web page. In a more general sense, we'd like JME to offer the option of defining custom buttons that can be assigned arbitrary actions. Because Java/JavaScript integration is very well-supported, these custom actions could actually be written in JavaScript.

# Conclusions

Java applets have been much maligned of late, partly due to the realization that in many situations they can be replaced with Ajax. However, well-designed, small, and extensible Java applets can play a key role in certain kinds of Ajax applications such as the one described here. Future articles in this series will explore some more of the many possibilities.