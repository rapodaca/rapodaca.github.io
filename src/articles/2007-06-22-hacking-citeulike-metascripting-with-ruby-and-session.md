---
title: Hacking CiteULike - Metascripting with Ruby and Session
published: "2007-06-22T00:00:00.000Z"
---

[CiteULike](http://www.citeulike.org/) lets users easily manage their bibliographies of scholarly works, and in the process discover other users' papers on related subjects. One of the most powerful features of CiteULike is its ability to convert arbitrary URLs into fully-formatted bibliographical citations. CiteULike manages to do this while largely avoiding the [Buggotea Problem](http://depth-first.com/articles/2007/06/15/buggotea-the-problem-with-abundance) in which multiple URLs pointing to the same work are saved. Wouldn't it be useful if this aspect of CiteULike could be independently scripted, tested, and re-integrated? This article describes how to do this using the powerful scripting language Ruby.

# A Simple Test
The core of CiteULike's bibliography lookup system is contained in its *Filters*. Filters accept a URL they're interested in and return a bibliographical citation. Each filter generally works with a specific publisher's URLs and may be written in just about any scripting language.

CiteULike has released nearly all of its filters and the driver as an Open Source package distributed under a BSD-style license. 
Complete documentation on using and writing filters is available [here](http://svn.citeulike.org/svn/plugins/HOWTO.txt), and the package can be obtained through subversion:

```bash
svn co http://svn.citeulike.org/svn/ citeulike
```

After changing into the **citeulike/drivers** directory, you'll see a file called **driver.tcl**. This script coordinates the activities of the various filters contained under their respective language subdirectories. Let's say you want to parse the following URL:

```bash
http://pubs.acs.org/cgi-bin/abstract.cgi/jmcmar/2007/50/i05/abs/jm0611509.html
```

The command to do so would be:

```bash
./driver.tcl parse http://pubs.acs.org/cgi-bin/abstract.cgi/jcisd8/2006/46/i03/abs/ci050400b.html
```

If you get an error starting with:

```bash
couldn't execute "./acs.py": no such file or directory
    while executing
"open "|./[file tail $exe]" "r+""
    (procedure "parse_url" line 31)
    invoked from within
```

then the problem lies with the shebang line of the **drivers/python/acs.py** script. For example, on my system I need to change the shebang to:

```bash
#!/usr/bin/python2.5
```

Making this change and re-running the driver script gives the output I was expecting:

```bash
parsing http://pubs.acs.org/cgi-bin/abstract.cgi/jcisd8/2006/46/i03/abs/ci050400b.html

serial -> 1549-9596
volume -> 46
linkouts -> {DOI {} 10.1021/ci050400b {} {}}
year -> 2006
type -> JOUR
start_page -> 991
url -> http://pubs3.acs.org/acs/journals/doilookup?in_doi=10.1021/ci050400b
end_page -> 998
plugin_version -> 1
doi -> 10.1021/ci050400b
day -> 22
issue -> 3
title -> The Blue Obelisk-Interoperability in Chemical Informatics
journal -> J. Chem. Inf. Model.
abstract -> Abstract: The Blue Obelisk Movement (http://www.blueobelisk.org/) is the name used by a diverse Internet group promoting reusable chemistry via open source software development, consistent and complimentary chemoinformatics research, open data, and open standards. We outline recent examples of cooperation in the Blue Obelisk group: a shared dictionary of algorithms and implementations in chemoinformatics algorithms drawing from our various software projects; a shared repository of chemoinformatics data including elemental properties, atomic radii, isotopes, atom typing rules, and so forth; and Web services for the platform-independent use of chemoinformatics programs.
status -> ok
month -> 5
authors -> {Guha {} R {Guha, R.}} {Howard {} MT {Howard, M.T.}} {Hutchison {} GR {Hutchison, G.R.}} {Murray-Rust {} P {Murray-Rust, P.}} {Rzepa {} H {Rzepa, H.}} {Steinbeck {} C {Steinbeck, C.}} {Wegner {} J {Wegner, J.}} {Willighagen {} EL {Willighagen, E.L.}}
address -> Pennsylvania State University, University Park, Pennsylvania 16804-3000, Jmol Project, U. S. A., Cornell University, Ithaca, New York 14853, Cambridge University, Cambridge CB2 1TN, Great Britain, Imperial College, London SW7 2AZ, Great Britain, Cologne University Bioinformatics Center (CUBIC), Zülpicher Str. 47, D-50674 Köln, Germany, University of Tübingen, Tübingen, Germany, and Jmol project, The Netherlands
plugin -> acs
```

# Metascripting with Ruby and Session

The CiteULike driver is written in [Tcl](http://tcl.sourceforge.net/), a language I've been interested in and heard about, but which I just don't have the time to try to learn. Wouldn't it be great if we could direct the activities of the CiteULike driver from the comfort and power of Ruby?

It turns out that a handy little Ruby library exists which is perfect for the metascripting we'll need to do - [Session](http://raa.ruby-lang.org/project/session/). The Session library can be installed with:

```bash
gem install session
```

Once installed, we can fire up interactive ruby (irb), and tell driver.tcl what to do:

```bash
irb
irb(main):001:0> require 'rubygems'
=> true
irb(main):002:0> require 'session'
=> true
irb(main):003:0> url = 'http://pubs.acs.org/cgi-bin/abstract.cgi/jcisd8/2006/46/i03/abs/ci050400b.html'
=> "http://pubs.acs.org/cgi-bin/abstract.cgi/jcisd8/2006/46/i03/abs/ci050400b.html"
irb(main):004:0> session = Session.new
=> #<Session::Sh:0xb7c03174 @stdout=#<IO:0xb7c02ee0>, @threads=[], @history=nil, @stdin=#<IO:0xb7c02f30>, @use_open3=nil, @opts={}, @errproc=nil, @use_spawn=nil, @debug=nil, @stderr=#<IO:0xb7c02e7c>, @outproc=nil, @track_history=nil, @prog="sh">
irb(main):005:0> result=session.execute "./driver.tcl parse #{url}"
```

# Reprocessing the Bibliography

The last command of our interactive ruby session returns an Array called "result", the first element of which is our article's bibliographical information. We can extract its title with the following commands:

```bash
irb(main):011:0> result[0].match /title -> (.*)/
=> #<MatchData:0xb7b94828>
irb(main):012:0> $1
=> "The Blue Obelisk-Interoperability in Chemical Informatics"
```

Using a series of similar regular expressions, we can re-construct the full bibliographical citation for the paper.

# Conclusions

The availability of the CiteULike filters and driver opens up many possibilities to build collaborative bibliographical management applications. By using some simple metascripting techniques, this can be done in any scripting language. Our little example here is but a glimpse of what might be possible.