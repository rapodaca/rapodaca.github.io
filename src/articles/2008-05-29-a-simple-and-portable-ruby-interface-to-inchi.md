---
title: A Simple and Portable Ruby Interface to InChI
published: "2008-05-29T00:00:00.000Z"
---

Although the [InChI](http://depth-first.com/articles/2007/09/27/inchi-for-newbies) software itself is written in C, it can still be used via Ruby. [Rino](http://depth-first.com/articles/2007/03/19/customize-inchi-output-with-rino) offers one implementation of a Ruby InChI interface that makes use of a C extension. This article describes a more concise and portable solution.

# The Code

The following code will accept a String encoding a molfile and return either its InChI, or an empty String if no InChI could be found:

```ruby
module InChI
  def inchi_for molfile
    output = %x[echo "#{molfile}" | cInChI-1 -STDIO]

    output.eql?("") ? "" : output.split(/\n/)[1]
  end
end
```

This code takes advantage of Ruby's built-in support for <a href="http://www.ruby-doc.org/docs/ProgrammingRuby/html/tut_expressions.html#UA">Command Expansion</a>.

# Testing the Code

The code below tests the library:

```ruby
require 'inchi'
include InChI

molfile =
"http://chempedia.com/compounds/106.mol
  -OEChem-03010811072D

 12 12  0     0  0  0  0  0  0999 V2000
    2.8660    1.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.0000    0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.7321    0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.0000   -0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.7321   -0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.8660   -1.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.8660    1.6200    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.4631    0.8100    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.2690    0.8100    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.4631   -0.8100    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.2690   -0.8100    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.8660   -1.6200    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0  0
  1  3  1  0  0  0  0
  1  7  1  0  0  0  0
  2  4  1  0  0  0  0
  2  8  1  0  0  0  0
  3  5  2  0  0  0  0
  3  9  1  0  0  0  0
  4  6  2  0  0  0  0
  4 10  1  0  0  0  0
  5  6  1  0  0  0  0
  5 11  1  0  0  0  0
  6 12  1  0  0  0  0
M  END"

puts "Found InChI: #{inchi_for(molfile)}"
```

We can run the test by saving it in a file called <strong>test.rb</strong> and executing it:

```bash
ruby test.rb
InChI version 1, Software version 1.02-beta August 2007
Log file not specified. Using standard error output.
Input file not specified. Using standard input.
Output file not specified. Using standard output.
Options: Mobile H Perception ON
Isotopic ON, Absolute Stereo ON
Omit undefined/unknown stereogenic centers and bonds
Full Aux. info
Input format: MOLfile
Output format: Plain text
Timeout per structure: 60.000 sec; Up to 1024 atoms per structure
End of file detected after structure #1.
Finished processing 1 structure: 0 errors, processing time 0:00:00.00
Found InChI: InChI=1/C6H6/c1-2-4-6-5-3-1/h1-6H
```

# Prerequisites

The above approach only requires that it be run on a UNIX-like system, and that a copy of the InChI library be present on your path.

# Advantages

The approach described here offers some important advantages over Rino:

-  It works without modification on both the [Matz Ruby Interpreter](http://en.wikipedia.org/wiki/Ruby_MRI) (C-Ruby) and [JRuby](http://jruby.codehaus.org/).
-  It neither creates nor uses files.

# Disadvantages

This approach creates a lot of noisy log output to the console. There must be a way to suppress it, but so far I haven't found out how.

# Conclusions

Using Ruby's support for Command Expansions has enabled the creation of a concise and portable Ruby interface to the InChI toolkit. Similar principles would apply to any Unix command-line binary, including for example, [Open Babel](http://openbabel.org/wiki/Babel).


