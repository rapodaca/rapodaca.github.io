---
title: "Mirroring PubChem the Easy Way with PubChem Fu"
published: "2010-07-20T00:00:00.000Z"
---

If you want to work with the [PubChem dataset](http://depth-first.com/articles/2006/09/29/hacking-pubchem-direct-access-with-ftp), two of your biggest problems will likely be creating a local working copy and keeping it synchronized. Although a few articles on doing just this have appeared here on Depth-First, the information is a bit scattered. Also, some time and effort is required in getting a robust mirroring system in place and working as expected. Enter [PubChem Fu](http://github.com/metamolecular/pubchem-fu), a simple tool designed to help you maintain a complete, up-to-date copy of the PubChem dataset.

# Previous Articles in this Series:

-  [Big Data in Chemistry: Incrementally Mirror PubChem the Easy Way](http://depth-first.com/articles/2010/03/01/big-data-in-chemistry-incrementally-mirror-pubchem-the-easy-way)
-  [Big Data in Chemistry: Mirroring PubChem the Easy Way Part 2](http://depth-first.com/articles/2010/02/09/big-data-in-chemistry-mirroring-pubchem-the-easy-way-part-2)
-  [Big Data in Chemistry: Mirroring PubChem the Easy Way](http://depth-first.com/articles/2010/02/08/big-data-in-chemistry-mirroring-pubchem-the-easy-way)

# What it Does

PubChem Fu lets you create and automatically update a local working copy of all PubChem Compound and Substance data.

This tool uses Ruby and a clever little Ruby utility called [Whenever](http://github.com/javan/whenever) to configure cron for you. Simply give it a time to pull daily updates at, and you can always have access to the complete, latest PubChem dataset.

# Usage

Create a full copy of PubChem (in the same directory as PubChem Fu):

```bash
rake full
```

Pull available daily updates (in the same directory as PubChem Fu):

```bash
rake daily
```

Automate pulling daily updates:

```bash
whenever --update-crontab pubchem
```

Make sure your cron task is set:

```bash
crontab -l

...

# Begin Whenever generated tasks for: pubchem
PATH= ...

15 14 * * * cd ~/local/pubchem && RAILS_ENV=production /usr/bin/env rake daily


# End Whenever generated tasks for: pubchem
```

That part about <tt>RAILS\_ENV</tt> is a by-product of Whenever being mainly used in a [Ruby on Rails](http://rubyonrails.org/) environment. I'm sure there's a way to block that output if needed. If you know, please [drop me a line](http://depth-first.com/pages/richard-l-apodaca).

# More Information

PubChem Fu is a simple utility built on a powerful foundation. For more information, see this [video on automating cron with Ruby](http://media.railscasts.com/videos/164_cron_in_ruby.mov).

PubChem's large size presents many challenges, some of which may have solutions that could be included with PubChem Fu, and some of which could be applied to other large datasets. Stay tuned.