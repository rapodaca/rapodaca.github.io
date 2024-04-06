---
title: Small Molecule 3D Coordinates From PubChem
published: "2008-05-23T00:00:00.000Z"
---

The PubChem team has quietly introduced a new feature - 3D coordinates for many of the small molecules in its compound collection. To my knowledge, these coordinates are only currently [available via FTP](ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound_3D/). From the [README](ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound_3D/README):

> The data contained here consists of a theoretical 3D description of PubChem Compound records computed using the MMFF94s force field without coulombic terms, including MMFF charges.  Each provided theoretical 3D conformer is not a stationary point on the hyper-potential surface (i.e., is not at a minimum energy).  Rather, the theoretical 3D description is a low energy conformer selected from a conformer model (a theoretical description of the conformational flexibility of a chemical structure consisting of multiple 3D representations or poses sampled using an RMSD {root mean squared distance} threshold) describing energetically-accessible and (potentially) biologically relevant coformations of a chemical structure.
>
> Not every PubChem Compound record will have a theoretical 3D description. Structures considered too large (containing more than 50 non-hydrogen atoms) or too flexible (containing more than 15 rotatable bonds) are excluded.  Furthermore, chemical structures containing elements other than H, C, N, O, F, P, S, Cl, Br, and I are also excluded.
>
> Generation of theoretical 3D descriptions of small molecules is computationally intensive.  As such, some PubChem Compound records may be added at a later time.

(A few open source packages for [generating 3D conformers](/articles/2007/12/12/simple-3d-conformer-generation-with-smi23d) are also available.)

Recently, [Geoff Hutchison](http://hutchison.chem.pitt.edu/) wrote in [to suggest](/articles/2008/05/14/the-daily-molecule-the-wonders-of-chemistry-one-molecule-at-a-time#comment-556) that a potentially useful new feature of [Chempedia](http://chempedia.com) could be the ability to directly obtain 3D coordinates for a molecule of interest.

One very economical way to do that would be to use PubChem's 3D dataset. It would also be trivial to display these coordinates as a resizable [Jmol applet](http://jmol.sourceforge.net/), in analogy to [Chempedia's recently-added 2D molecule resizing feature](/articles/2008/05/19/building-chempedia-resizable-structures-with-chemwriter).

Of course, there are many other potential uses for the PubChem conformer dataset, especially when applied to Web applications.