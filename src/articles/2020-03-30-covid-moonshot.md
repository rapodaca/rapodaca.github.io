---
title: COVID MoonShot
summary: "Open Source Drug Discovery takes on COVID-19."
twitter: true
summary-image: images/posts/20200330/summary.png
published: "2020-03-30T15:00:00Z"
---

[Open Source Drug Discovery](https://doi.org/10.1002/cmdc.201900565) offers an alternative to the proprietary system driving new drug development today. The idea has taken a variety of forms over the years, but in essence is an attempt to replace closed, proprietary processes with open, public ones. A new initiative, the [COVID-19 MoonShot](https://covid.postera.ai/covid), seeks to apply similar principles to development of antiviral treatments for COVID-19. This article offers an overview of the effort.

# COVID MoonShot Project

The COVID MoonShot Project is an *ad hoc* group of individuals and institutions working to develop a drug inhibiting the SARS-CoV-2 main protease (M<sup>pro</sup>). Participating institutions include:

- [Diamond Light Source](https://www.diamond.ac.uk/Home.html). The UK national synchrotron science facility.
- [London Lab](http://www.weizmann.ac.il/Organic_Chemistry/London/). A research lab located at the Weizmann Institute ([Twitter](https://twitter.com/london_lab)).
- [PostEra AI](https://postera.ai). A Y-Combinator funded medicinal chemistry as a service startup.

# Getting Started

The two best sources for up-to-date information about the project are the [Website](https://covid.postera.ai/covid) and the [Twitter account](https://twitter.com/covid_moonshot). What follows has been mostly gleaned from them.

# M<sup>pro</sup> as the Target

MoonShot's focus is the M<sup>pro</sup> protease, also known in the older literature as 3CL<sup>pro</sup>. This enzyme was [first characterized by X-ray crystallography](https://science.sciencemag.org/content/300/5626/1763?ijkey=0a8e5246a508573738f4b6f57c540972d64be6a6&keytype2=tf_ipsecsha) in 2003 using the enzyme expressed by SARS-CoV-1. M<sup>pro</sup> cleaves a polyprotein chain transcribed from viral RNA at 11 or more sites. The enzyme is thought to exist as a dimer in its active state, with an unobstructed, shallow active site hosting a catalytic Cys-His diad. M<sup>pro</sup> is thought to be essential for the virus, but evidence on this point seems fuzzy at best.

More recently, the [X-ray crystal structure](https://science.sciencemag.org/content/early/2020/03/20/science.abb3405) of SARS-CoV-2 M<sup>pro</sup> was determined both alone and bound to peptides **13a**, **13b**, and **14b**. Inhibition of purified recombinant CARS-CoV-2 M<sup>pro</sup> by **13b** was determined as 670 nM. A functional assay of SARS-CoV-2 activity using **14b** was performed (EC<sub>50</sub> 4-µM). Mouse ADME parameters for both **13a** and **13b** were determined.

<figure>
  <img alt="Inhibitors" src="/images/posts/20200330/mpro-inhibitors.jpg">
  <figcaption>
    <strong>Inhibitors.</strong> Using SARS-CoV-1 M<sup>pro</sup> inhibitor <strong>11r</strong> as a starting point, three inhibitors of SARS-CoV-2 M<sup>pro</sup> were developed. [<a href="https://doi.org/10.1126/science.abb34059">source</a>]. 
  </figcaption>
</figure>

As-yet [unpublished results](https://www.diamond.ac.uk/covid-19/for-scientists/Main-protease-structure-and-XChem.html) from the [Diamond Light Source](https://www.diamond.ac.uk) have yielded X-ray crystal structures for 66 fragments, 44 of which were covalently bound to SARS-CoV-2 M<sup>pro</sup>. Data are available in a [variety of formats](https://www.diamond.ac.uk/covid-19/for-scientists/Main-protease-structure-and-XChem/Downloads.html), including PDB and Excel files.

The goal of the COVID MoonShot project is to apply the growing amounts of structural data on M<sup>pro</sup> to the development of "effective, easy-to-make anti-COVID drugs."

# Timeline

The Diamond Light Source team has compiled a [timeline](https://www.diamond.ac.uk/covid-19/for-scientists/progress-highlights.html) of its efforts. Recently, [a hackathon](https://www.linkedin.com/posts/davide-sabbadin-34b5403a_hackaton-covid-sars-activity-6647895532851249152-xQz8) was announced. The MoonShot group announced the closure of the [first wave of structure design submissions](https://twitter.com/covid_moonshot/status/1243702399526563840). Candidates from this set have [been selected](https://twitter.com/covid_moonshot/status/1242895527596797952), and samples have been requested from supplier Enamine. Results (of unspecified type) are to be posted [here](https://covid.postera.ai/covid).

A recent [C&EN Article](https://cen.acs.org/pharmaceuticals/drug-discovery/Crystal-structures-novel-coronavirus-protease/98/web/2020/03) mentions the MoonShot project. [Pat Walters](http://practicalcheminformatics.blogspot.com/2020/03/building-on-fragments-from-diamondxchem.html) and [Alex Clark](https://cheminf20.org/2020/03/28/cheminformatics-from-quarantine-some-interactive-covid-19-resources/) have recently begun writing about techniques for working with the available data.

# Looking Ahead

It's early days for the COVID Moonshot. Even so, I don't recall any project quite like it. If you have a background in or inclination toward molecular design, the project may be worth your time.

Having worked in drug discovery as a medicinal chemist for many years, however, I can't help but thinking about the steps following design and compound synthesis. In vitro assays, probably with recombinant enzyme, will be a vital component of any successful project. For a relatively unexplored target such as SARS-CoV-2 M<sup>pro</sup>, in vitro assay throughput could become a bottleneck. It's not clear how the MoonShot will address the problem of in vitro assays, and a [request for information I sent by Twitter](https://twitter.com/rapodaca/status/1243356536287531009) remains unanswered. That's just the start of the labor and expense. The project is going to need resources in DMPK/ADME, not to mention functional animal models. It will also need an information technology infrastructure, as the limits of simple websites and Twitter already begin to surface. The there's the thorny problem of intellectual property, particularly among participants who also work in industry. These and many other challenges could help shape new models for running drug discovery programs.

Crises have a way of making previously unthinkable leaps into the unknown possible.

# Conclusions

The COVID MoonShot is a loose association of institutions and individuals organized around the goal of finding a practical COVID-19 treatment. Current efforts are focused on SARS-CoV-2 M<sup>pro</sup> inhibitors, but I suspect that could change as new information emerges. Regardless of your scientific background or skills, the project is worth exploring.