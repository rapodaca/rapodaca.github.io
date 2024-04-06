---
title: Free Web-Based Proton NMR Prediction and Assignment with NMRDB
published: "2008-05-20T00:00:00.000Z"
---

</a>NMR Prediction software can be a useful tool in spectral assignment and unknown identification. Until recently, the only available software consisted of rather expensive desktop-based packages. But a new Web service called [nmrdb.org](http://nmrdb.org) looks ready to change that.

# About nmrdb.org

[nmrdb.org](http://nmrdb.org) is actually three services in one: [NMR Resurrector](http://www.nmrdb.org/resurector); [NMR Assigner](http://www.nmrdb.org/nemo); and [NMR Predictor](http://www.nmrdb.org/predictor).

NMR Resurector is a remarkable tool that re-creates a proton NMR plot from tabulated peak frequencies. Output is available in PDF, and PNG image format.

NMR Assigner enables the interactive correlation of the atoms of a molecule with the peaks in a spectrum. Output is available in ACS format ready for inclusion in manuscripts, or as a text table.

NMR Predictor generates a complete proton NMR spectrum from an arbitrary chemical structure provided as a molfile or drawn with a structure editor. An interactive display (similar in concept to one [discussed here recently](/articles/2008/02/06/the-chemically-enabled-user-interface-an-introduction-to-leafcutter)) highlights both the atom giving rise to a signal and the signal itself in response to hovering with the mouse. Output is available in both PDF and PNG image format.

With each of nmrdb's services, a precompiled set of data can be used as a way to become familiar with what the service can do.

# nmrdb.org a Web Service

Although useful as a standalone tool, NMR Resurector could be even more powerful when used as a Web service in combination with other Web applications. As a hint of the kinds of things that might be possible, nmrdb is capable of creating a predicted spectrum through a special URL into which a SMILES string is embedded. For example, click on the structure of cholesterol below (or use <a href="http://www.nmrdb.org/predictor?smiles=CC%28C%29CCC%5BC%40%40H%5D%28C%29%5BC%40H%5D1CC%5BC%40%40H%5D2%5BC%40%40%5D1%28CC%5BC%40H%5D3%5BC%40H%5D2CC%3DC4%5BC%40%40%5D3%28CC%5BC%40%40H%5D%28C4%29O%29C%29C">this link)</a>:

[![Cholesterol](/images/posts/20080520/cholesterol.png "Cholesterol")](http://www.nmrdb.org/predictor?smiles=CC%28C%29CCC%5BC%40%40H%5D%28C%29%5BC%40H%5D1CC%5BC%40%40H%5D2%5BC%40%40%5D1%28CC%5BC%40H%5D3%5BC%40H%5D2CC%3DC4%5BC%40%40%5D3%28CC%5BC%40%40H%5D%28C4%29O%29C%29C)

[ChemSpider](http://chemspider.com) has added this capability to its compound summary pages under the link "NMR".

# Conclusions

nmrdb.org is a very well thought-out service that could be of immediate benefit to chemists and developers alike. It also demonstrates that [creating databases](/articles/2007/01/24/thirty-two-free-chemistry-databases) is but one way to chemically enable the Web.