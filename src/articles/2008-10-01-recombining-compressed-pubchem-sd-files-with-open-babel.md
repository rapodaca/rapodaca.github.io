---
title: Recombining Compressed PubChem SD Files with Open Babel
published: "2008-10-01T00:00:00.000Z"
---

While testing [ChemPhoto](http://metamolecular.com/chemphoto), it became necessary to test the [chemical structure imaging application](http://depth-first.com/articles/2008/09/08/smarter-cheminformatics-from-sd-file-to-image-collection-with-chemphoto) with SD Files containing several hundred thousand records. Although it's tempting to meet this need by constructing "dummy" files with the same record or small set of records repeated, tests are always far more illuminating when real data is used.

[PubChem](http://pubchem.ncbi.nlm.nih.gov/) is an excellent source of large molecular datasets, and the entire database can be [downloaded by FTP](http://depth-first.com/articles/2006/09/29/hacking-pubchem-direct-access-with-ftp). Because of PubChem's massive size, what's downloadable consists of files broken up into groups of about 25,000 in gzipped SD File format (*.sdf.gz). Although this is an excellent resource, it creates a problem: how can you conveniently recombine this set of compressed SD Files into a single SD File?

You might think about writing some "quick" code in your language of choice. Fortunately, [Open Babel](http://openbabel.org) gets the job done - without any of the coding or debugging.

The following command will create a single SD File from all of the compressed SD Files in a given directory, while also stripping explicit hydrogens and removing all fields except PUBCHEM\_COMPOUND\_CID.

```bash
babel *.sdf.gz pubchem.sdf -d --delete PUBCHEM_COMPOUND_CANONICALIZED,PUBCHEM_CACTVS_COMPLEXITY,PUBCHEM_CACTVS_HBOND_ACCEPTOR,PUBCHEM_CACTVS_HBOND_DONOR,PUBCHEM_CACTVS_ROTATABLE_BOND,PUBCHEM_CACTVS_SUBSKEYS,PUBCHEM_IUPAC_OPENEYE_NAME,PUBCHEM_IUPAC_CAS_NAME,PUBCHEM_IUPAC_NAME,PUBCHEM_IUPAC_SYSTEMATIC_NAME,PUBCHEM_IUPAC_TRADITIONAL_NAME,PUBCHEM_NIST_INCHI,PUBCHEM_EXACT_MASS,PUBCHEM_MOLECULAR_FORMULA,PUBCHEM_MOLECULAR_WEIGHT,PUBCHEM_OPENEYE_CAN_SMILES,PUBCHEM_OPENEYE_ISO_SMILES,PUBCHEM_CACTVS_TPSA,PUBCHEM_MONOISOTOPIC_WEIGHT,PUBCHEM_TOTAL_CHARGE,PUBCHEM_HEAVY_ATOM_COUNT,PUBCHEM_ATOM_DEF_STEREO_COUNT,PUBCHEM_ATOM_UDEF_STEREO_COUNT,PUBCHEM_BOND_DEF_STEREO_COUNT,PUBCHEM_BOND_UDEF_STEREO_COUNT,PUBCHEM_ISOTOPIC_ATOM_COUNT,PUBCHEM_COMPONENT_COUNT,PUBCHEM_CACTVS_TAUTO_COUNT,PUBCHEM_BONDANNOTATIONS,PUBCHEM_CACTVS_XLOGP

865543 molecules converted
7 info messages 15372962 audit log messages 
```

Apparently, there is no way to tell babel to *keep* just a particular field in an SD File - they need to be removed individually.

Still, not bad for a few seconds on the command line.