---
title: "Look Ma, No Applets!"
published: "2006-11-09T00:00:00.000Z"
---

The state of the art in structure editors for chemical Web services is Java applets. Although closed editors have long dominated this field, <a href="http://depth-first.com/articles/2006/08/21/four-free-2-d-structure-editors-for-web-applications">Open Source editors</a> are a possibly viable option. Java applets are great from a developer's perspective. But applets are avoided by some end users and IT support for their underlying need to install a Java plug-in of some kind and long startup times.

![WEbME](/images/posts/20061109/webme.png "WEbME")

Through David Bradly's <a href="http://www.sciencebase.com/science-blog/chemists-escape-browser-lock-down.html">sciencebase</a>, I came across a non-Java solution to the structure editor problem. The software is called <a href="http://www.molinspiration.com/products/webme/">WebME</a>. WebME looks and feels similar to <a href="http://www.molinspiration.com/jme/">Java Molecular Editor</a>. It loads quickly and provides a clean, inviting user interface. It should work in any modern browser. Most interesting of all, WebME works without a browser plugin of any kind.

The magic behind WebME is AJAX, which has been summarized by Paul Graham as <a href="http://paulgraham.com/web20.html">"Javascript now works"</a>. By asynchronously interacting with a Web server as user interface events occur, WebME is able to cram a lot of functionality into a relatively small deployment package. The user interface is written in a mixture of HTML and JavaScript, thus eliminating the need for Java.

Although WebME's use of AJAX is innovative, other non-Java solutions to the structure editor problem have also been implemented. For example, <a href="http://pubchem.ncbi.nlm.nih.gov/">PubChem</a> have developed an editor in JavaScript/HTML for use with their popular service.

Despite its advantages, the AJAX approach does involve some trade-offs. For example, WebME is not nearly as responsive as, say, JME. I would imagine that unusually high network latency could further erode WebME's responsiveness. Furthermore, the subtle visual cues that make JME a productive tool, such as highlighting the node or edge the cursor is about to edit, are non-existent. It's unclear if this is a limitation of this particular version of WebME I used or the underlying technology.

AJAX is a promising new technology that may well have a place in producing ergonomic user interfaces for chemistry Web services. On the other hand, it wasn't too long ago that JavaScript "didn't work", was loathed, or simply ignored altogether. It may well be that Java applets undergo a revival similar to that of JavaScript, perhaps triggered by built-in support for applets made possible through an <a href="http://java.sun.com/developer/technicalArticles/Interviews/gosling_os1_qa.html">open source Java implementation</a>. Regardless of how Java applet technology evolves, WebME's approach is worth serious consideration.