---
title: A Lightweight and Portable Java Interface to InChI
published: "2010-10-18T00:00:00.000Z"
---

If you work in cheminformatics and you use Java, you'll eventually face the problem of [how to generate InChIs in Java](http://depth-first.com/articles/2008/12/10/mr-inchi-tear-down-this-wall). This blog has covered a few approaches to integrating InChI over the years, including the use of [SWIG to statically link to the InChI code](http://depth-first.com/articles/2006/09/16/taking-a-swig-of-inchi) and [NestedVM to compile the InChI C source into Java bytecode](http://depth-first.com/articles/2007/12/03/from-c-source-code-to-platform-independent-executable-jarfile-using-nestedvm-to-build-jinchi). NestedVM ports much better than SWIG, but at the price of a  performance penalty on the order of 10-20 fold. What if we could have the best of both performance and portability when using InChI with Java? This article shows one way to do it.

# Adapting a Solution

The approach we'll take in this article is based on [a portable interface to InChI in Ruby](http://depth-first.com/articles/2008/05/30/a-simple-and-portable-ruby-interface-to-inchi-part-2-silencing-console-output) that was presented here a while back. That solution was based on using an operating system shell to invoke the InChI executable from Ruby.

# A Lightweight Java Interface to InChI

Java has long had the ability to execute arbitrary binaries through <code>Runtime.getRuntime().exec()</code>. We can even execute these binaries within a shell environment, giving the ability to use pipes and other high-level features. The only prerequisite is to have the InChI command-line program accessible on our path.

Putting <code>Runtime.getRuntime().exec()</code> together with some syntactic sugar gives the Java class below:

```java
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

class InChI {
  public static BufferedReader runInChI(String molfile) throws IOException {
    String[] command = {
      "/bin/sh",
      "-c",
      "echo \"" + molfile + "\" | inchi -STDIO -AuxNone -NoLabels -Key 2>/dev/null"
    };
    Process inchi = Runtime.getRuntime().exec(command);

    return new BufferedReader(new InputStreamReader(inchi.getInputStream()));
  }

  public static String getInChIFromMolfile(String molfile) throws IOException {
    BufferedReader input = runInChI(molfile);
    String result = input.readLine();      
    input.close();

    return result == null ? "" : result;
  }

  public static String getInChIKeyFromMolfile(String molfile) throws IOException {
    BufferedReader input = runInChI(molfile);
    input.readLine();
    String result = input.readLine();
    input.close();

    return result == null ? "" : result.substring(9);
  }

  public static String readFile(String filename) throws IOException {
    BufferedReader in = new BufferedReader(new FileReader(filename));
    String str = "";
    String molfile = "";

    while ((str = in.readLine()) != null) {
      molfile = molfile + str + "\n";
    }

    in.close();

    return molfile;
  }

  public static void main(String[] args) {
    try {
      String molfile = readFile(args[0]);

      System.out.println(getInChIFromMolfile(molfile));
      System.out.println(getInChIKeyFromMolfile(molfile));
    } catch (IOException ignore) {
      ignore.printStackTrace();
    }
  }  
}
```

You can test this code by saving it to a file called **InChI.java** and compiling it:

```bash
javac InChI.java
```

and then running it:

```bash
java InChI path/to/molfile
```

# Caveats

Lightweight and (mostly) portable though it may be, the approach described here does have limitations. First, if you're on Windows, you'll need to adapt it. The change shouldn't be difficult and we could even add runtime platform detection to decide whether to run the Unix or Windows flavor of <code>Runtime.getRuntime().exec()</code>. Another limitation is that this code should never be used to run untrusted input files. A few properly placed characters would be enough for an attacker to run arbitrary commands. One solution would be to apply a character whitelist for molfile input. Another limitation: this approach will not work in sandboxed environments such as a browser running the Java Plugin.

# Conclusions

With a few lines of Java we've created a lightweight interface to the InChI library. Although not without limitations, it offers the quickest and easiest way to begin working with InChI in Java. But why bother? Future articles will offer some ideas.