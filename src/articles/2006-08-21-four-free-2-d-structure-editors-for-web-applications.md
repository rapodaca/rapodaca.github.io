---
title: "Four Free 2-D Structure Editors for Web Applications"
published: "2006-08-21T00:00:00.000Z"
---

The increasing trend toward hosting free chemical databases and other services on the web brings with it the need for a free, ergonomic, capable, and fast 2-D structure editor. For years, the options were rather limited. However, this situation has started to change. Four web-enabled editors are discussed here, with an emphasis on the steps needed to deploy them within a webpage and retrieve a text-based molecular representation. A sample webpage is provided for each editor that allows a user to draw a molecule and view the corresponding output in a browser.

# Building a Web Application: The Key Players

Consider the case of John, who would like to know the TPSA of caffeine. John finds a new website that calculates the TPSA of any molecule. This site presents John with a 2-D structure editor applet and a "Submit" button. John uses the applet to draw caffeine and then presses the  button. After one second, John sees a new page showing the structure of caffeine and its TPSA descriptor.

By pressing the "Submit" button, John sets in motion a series of transactions between the editor applet, the webpage, and the server. First, the webpage extracts a molfile representation of caffeine from the editor using JavaScript. This molfile is then submitted to the server using an HTTP POST request. After processing the molfile, the server returns a page containing the TPSA that John requested.

Several variations on this pattern are conceivable, each involving varying levels of involvement by the browser, the applet, and the server. Advanced use of JavaScript can lead to elimination of the applet entirely, an approach taken by the [PubChem structure search](http://pubchem.ncbi.nlm.nih.gov/search/). Even more interesting is the use of [AJAX](http://www.ajaxian.com/), which would eliminate both the applet and the page refresh step, setting the stage for highly-interactive chemical content using only a browser and JavaScript. Although no AJAX-powered 2-D structure editors currently exist, this situation can be expected to change in the future.

# Obtaining Text Output From a 2-D Editor

Extracting text-based output requires the same boilerplate code for all four editors. This code consists of four main components: (1) an editor applet into which the user draws a structure; (2) a JavaScript function that collects the output from the applet; (3) an HTML text field into which the JavaScript function inserts the output; and (4) an HTML form containing a button that when pressed sets the process in motion.

These commonalities make it possible factor out editor specific code and logic. The HTML below gives an example of what one basic template looks like.

```html
<html>
  <head><title>Molfile Test</title></head>
  <body>
  <!-- JavaScript -->
  <script language="JavaScript">
      function writeOutput()
      {
       document.form.output.value = document.applet.OUTPUT_METHOD();
      }
  </script>

  <!-- Applet -->
  <applet code="APPLET_CLASS" name="applet"
                archive="APPLET_JARFILE.jar"
                width=510 height=360>
    Please enable Java and JavaScript on your machine.
  </applet>

  <br />

  <!-- Form -->
  <form method="post" name="form">
      <input type="button"
                 value="Get Output"
                 onclick="writeOutput()"></input>
      <br /><br />
      <textarea name="output" rows=20 cols=80></textarea>
    </form>
  </body>
</html>
```

The above HTML contains three editor-specific pieces of information: (1) APPLET\_JARFILE; (2) APPLET\_CLASS; and (3) OUTPUT\_METHOD. APPLET\_JARFILE is the name of the Java archive file (*.jar) containing the applet code. This name is created by the developer when s/he saves the archive to the webserver. APPLET\_CLASS is the fully-qualified class name of the editor applet. OUTPUT\_METHOD is the name of the applet method that returns output. These last two pieces of editor-specific information are listed in the summary that follows.

# Java Molecular Editor (JME)

**Homepage:** [Molinspiration](http://www.molinspiration.com/jme/)

**License:** Free for noncommercial development.

**Source Code:** N/A

**Size:** 39 Kb

**APPLET_CLASS:** JME

**OUTPUT\_METHOD:** molFile(); smiles(); nonisomericSmiles(); jmeFile();

[View the Sample Page](/images/posts/20060820/jme/jme.html)

# JChemPaint

**Homepage:** [CDK](http://almost.cubic.uni-koeln.de/cdk/jcp) 

**License:** [GPL](http://www.opensource.org/licenses/gpl-license.php) 

**Source Code:** [SourceForge](http://sourceforge.net/project/showfiles.php?group_id=20024&package_id=173599&release_id=400854)  

**Size:** up to 6.2 Mb

**APPLET_CLASS:** org.openscience.cdk.applications.jchempaint.applet.JChemPaintEditorApplet  

**OUTPUT_METHOD:** getMolFile();

**Comment:** Although getSmiles() and getSmilesChiral() methods are available, neither produced the desired output during this test (version 2.1.5). The applet consists of 35 jar files, only some of which are necessary for minimal functionality.

[View the Sample Page](/images/20060820/jchempaint/jchempaint.html)

# JMolDraw

**Homepage:** [SourceForge](http://sourceforge.net/projects/jmoldraw)  

**License:** [GPL](http://www.opensource.org/licenses/gpl-license.php)  

**Source Code:** [SourceForge](http://sourceforge.net/project/showfiles.php?group_id=155468&package_id=173185&release_id=379497)  

**Size:** up to 1.4 Mb 

**APPLET_CLASS:** org.jmd.editor.main.JMolDraw

**OUTPUT_METHOD:** getContentsAsMolfile(); getContentsAsJMEString()  

**Notes:** In contrast to the other three editors, there is no option to display this applet in the browser itself; it must be rendered as a separate window. In addition, this editor requires that several configuration and resource files be accessible on the server. Molfile output uses V3000 ctabs. Although V2000 ctabs are supported, the only way to activate this functionality is to modify the source code.

[View the Sample Page](/images/20060820/jmoldraw/jmoldraw.html)

# MCDL

**Homepage:** [SourceForge](http://sourceforge.net/projects/mcdl)  

**License:** Public Domain  

**Source Code:** [SourceForge](http://sourceforge.net/project/showfiles.php?group_id=148281&package_id=163529&release_id=405662)  

**Size:** 256 Kb

**APPLET_CLASS:** mcdl.MCDLEditor  

**OUTPUT_METHOD:** getMDCL()  

**Notes:** This editor only supports output in [Modular Chemical Descriptor Language](/articles/2006/08/19/a-first-look-at-modular-chemical-descriptor-language-mcdl) format.

[View the Sample Page](/images/posts/20060820/mcdl/mcdl.html)

# Conclusions

This review has only scratched the surface of what is possible with these editors. For example, all accept input as well as providing output. As a result, they can be used to render 2-D molecular images, with more or less Java coding. Both MCDL and JME are especially attractive from the developer perspective because they are each distributed as a single jar file with a small footprint.

Although numerous 2-D structure editors [are available](http://dragon.klte.hu/~gundat/rajzprogramok/dprog.html), those reviewed here meet the minimum requirements for the development of free chemical web applications: they work on nearly all computing platforms thanks to Java; and they are themselves free.