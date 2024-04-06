---
title: "InChI Canonicalization Algorithm"
disqus: true
published: "2006-08-12T00:00:00.000Z"
---

The InChI canonicalization algorithm uniquely numbers the atoms of a molecule. To date, the only implementation is found in the C source code of the <a href="http://www.iupac.org/inchi/">InChI software</a>. To enable new InChI implementations, for example in other programming languges, the complete canonicalization procedure is needed. Although it has not been published formally, the information exists in [two messages](http://sourceforge.net/mailarchive/message.php?msg_id=5.1.1.5.2.20050708111329.02502190%40email.nist.gov) posted to the inchi-discuss mailing list by Dmitrii Tchekhovskoi. To make this information more accessible, these messages have been compiled and re-formatted. The resulting document applies to v1.0 of the IUPAC InChI software. The following article refers to the [*InChI Technical Manual*](http://sourceforge.net/project/showfiles.php?group_id=142870&package_id=217748), which can be downloaded from SourceForge.

# Background

Below is a general brief description of the InChI canonicalization algorithm. I did not dare to include canonicalization steps involved in the treatment of mobile hydrogens; included is only a brief Note on how it is implemented.
 
The order of minimization may be found in the section IV.e Canonicalization, InChI Tech. Of course all details are in the code.
 
The minimization itself is a highly technical and boring issue; an essential part of it is built on the well-known B. D. McKay algorithm (ref. 5 in the InChI Tech. Man.) which itself is not an easy to read text. Given our limited resources, we decided to postpone the detailed documentation of the canonicalization. However, the InChI code is freely available and the references to the corresponding variables in the code are given in the Figure 30, InChI Tech. Man.
 
Here is a very brief description (leaving aside mobile H treatment and almost all technical details; almost all numerical examples below refer to 2-chlorobutane).
 
# Major Step A: hydrogenless constitution
 
1. The atoms (ignoring terminal hydrogens) that are vertices in the "molecular graph" are given numerical "colors" in this order of precedence: (a) Ordering number in the sequence: C, other atoms in alphabetic order, bridging H. In case of C4H9Cl all C will be given 1, Cl will be given 2 (b) Number of connections (number of bonds). In 2-chlorobutane CH3CH2CH(Cl)CH3 these are (in brackets): C[1]C[2]C[3](Cl[1])C[1] The resultant "ordered lists of colors" presented in order of the atoms in the semistructural formula CH3CH2CH(Cl)CH3 are: C:  1, 1; C:  1, 2; C:  1, 3; Cl: 2, 1; C   1, 1
 
2. Atoms are assigned new colors according to lexicographical comparison of the "color lists", in ascending order [for example, (1,1) < (1,2) < (2,1); (1, 2) < (1, 2, 1)] (C:  1, 1 => 2; C:  1, 2 => 3; C:  1, 3 => 4; Cl: 2, 1 => 5; C   1, 1 => 2). You may notice here an unimportant detail: each color is equal to the number of atoms that have this or smaller color.
 
3. Atoms are assigned new "ordered lists of colors": the first in the list is the color of the atom, the rest are sorted in ascending order colors of other atoms, connected to this atom: (C:  2, 3; C:  3, 2, 3; C:  4, 2, 3, 5; Cl: 5, 4; C   2, 4).
 
4. Atoms are assigned new colors according to lexicographical comparison of the "color lists", in ascending order (C:  2, 3 => 1; C:  3, 2, 3 => 3; C:  4, 2, 3, 5 => 4; Cl: 5, 4 => 5; C   2, 4 => 2).
 
5. Steps 3-4 are repeated until all new colors are different or no more changes occur (for 2-chlorobutane the colors - canonical numbers - have already been found). The resultant colors produce a so called equitable partition, in a way which is conceptually almost same as the intermediate result of the SMILES-2 algorithm ["SMILES. 2. Algorithm for Generation of Unique SMILES Notation" by  Weininger, D.; Weininger, A.; Weininger, J.L.; JCICS Vol. 29, pp. 97-101, 1989](http://dx.doi.org/10.1021/ci00062a008).
 
6. If some of the colors are still identical, then the smallest is picked up and reduced to the previous color + 1. For example, if colors are (this example does not refer to 2-chlorobutane): 1,2,5,5,5,7,7 then the smallest duplicated color is 5, the previous color is 2. A color of one of the colored-5-atoms will be reduced from 5 to 2+1=3.
 
7. Repeat steps 3-6 until all colors become different (this is almost same as obtaining the final result of the SMILES-2 algorithm) and save the "connection table". To make the reading easier, the process of obtaining this table (actually, a list of number) is split into 3 steps. (a)The connection table is made out of segments, ordered in ascending order of the color of the first atom in a segment. The number of the segments is the number of atoms. Each segment starts with the color of an atom and is followed by a colon and a sorted list of the colors of atoms, connected to it: 1:3; 2:4; 3:1,4; 4:2,3,5; 5:4; (b) Since this connection table contains each connection 2 times (for example, the bond between atoms of color 1 and 3 is in the segments "1:3" and "3:1"), it is rewritten by excluding colors that are greater than the first color in the segment: 1; 2; 3:1; 4:2,3; 5:4; (c) The delimiters now are redundant because the members of each segment are always smaller than the first member of the segment. This is the final connection table to be saved and used later: 1, 2, 3, 1, 4, 2, 3, 5, 4
 
8. There could be a great deal of arbitrariness in choosing the atom whose color was to be reduced at step 6 (in the example, 3 atoms have color 5; each of them could be chosen). Therefore, repeat step 7 for all possible sequences of choosing the atoms whose color is reduced. Lexicographically compare each obtained connection table to the previously saved and keep the smallest one together with the assignment of the colors to the atoms. These colors are the canonical numbers for the hydrogenless structure. If two connection tables are identical then atoms that have same colors in two connection tables belong to the same equivalence class; this information is saved and used. The equivalence class is the smallest color in the equivalence group. (You may find this approach in, for example, ["A Computer-Oriented Linear Canonical Notational System for the Representation of Organic Structures with Stereochemistry" by Agarwal, K.K.; Gelernter, H.L.; JCICS v.34, pp.463-479, 1994](http://dx.doi.org/10.1021/ci00019a001). However, the implemented in InChI algorithm from Ref 5 allows to avoid a combinatorial explosion in typical chemical structures, obtain equivalence classes, and even find the order of the permutation group and its generators). So far we got a canonical numbering (colors) for a hydrogenless structure and the canonical equivalence classes (=the smallest color in each set of equivalent atoms).
 
9. Make new colors out of the canonical equivalence classes and repeat steps 3-8 if these colors are different from the colors previously used at Step 3. Obtain the new minimal connection table. Use these classes as initial colors in the next steps (If equivalence classes are, for example, 1, 1, 1, 4, 4, 5, 5, 5 then the corresponding colors are 3, 3, 3, 5, 5, 8, 8, 8)
 
# Major Step B. Add hydrogen atoms to the structure
 
\[A Forward Note: in the first reading you may want to skip it. In case of mobile H the steps are somewhat different, namely: (m-a) Add a list of only those H that are not mobile (similar to B.1 below) and minimize both the connection table (it will be same) and the list. (m-b)Add mobile groups as pseudoatoms connected by directed edges (it means that these pseudoatoms are not included in the connection table segments of the real atoms) to the atoms where the mobile H and possibly negative charges may reside and canonicalize this structure. Number of H and (-) in the groups are in one more list to minimize. The result is the Mobile H canonical numbering and the corresponding equivalence classes, including equivalence classes of the mobile H (and possibly negative charge) groups. Mobile groups that have only negative charges are not included in this process. (m-c) Add isotopic list (see Major Step C below) to the number of lists to be minimized. Do not include in it the exchangeable isotopic atoms H. The result of the minimization is the Mobile H canonical numbering and equivalence classes for the isotopic structure. (f-a) For the fixed mobile H (FixedH option) start with the results of (m-a) and add a list of the fixed positions of the mobile H (colors of the atoms where these H reside) and numbers of these atoms H. The result of the minimization is the Fixed-H canonical numbering and equivalence classes. (f-b) Add isotopic list (see Major Step C below). The minimization result is the Fixed-H canonical numbering and equivalence classes for the isotopic Fixed-H structure.\]
 
Use previously obtained equivalence classes at Step A.9 and use the previously obtained minimal connection table for the comparison. Run Steps A.3-8 with the following difference: each time the connection tables are compared at Step A.8, in case of identical connection tables also compare the list of terminal atoms H in the following form: 1, number_of_H(1), 2, number_of_H(2), ...n, number_of_H(n) where  number_of_H(c) is the number of terminal atoms H attached to the atom that has color c; n = number of atoms. Save the found this way minimal list of the terminal atoms together with the assignment of the colors to the atoms. Also obtain the equivalence classes as it was done earlier.
 
We now have the canonical colors (numbering) of the non-isotopic non-tautomeric structure.
 
# Major Step C. Add isotopic composition to the structure
 
If the structure is isotopic then add one more list to compare if the connection tables and the lists of terminal atoms H are same: 1, iso_weight(1), 2, iso_weight(2), ...n, iso_weight(n) where iso_weight(c) is the "isotopic weight" of the atom to which the color c was assigned.
 
For each atom the isotopic weight is calculated according to the formula:
 
iso_weight=nH1 + 32*(nH2 + 32*(nH3 + 32*shift))
 
nH1 = number of terminal atoms of protium attached to the atom

nH2 = number of terminal atoms of deuterium attached to the atom

nH2 = number of terminal atoms of tritium attached to the atom

shift = [(integral) mass of the isotopic atom] - [rounded average atomic mass]
 
Note: hydrogen H is treated differently from it isotope protium: H has "natural" isotopic composition while protium is treated as an isotopic atom
 
In case of a not isotopic atom the shift = 0 by definition. If the atom is isotopic and its mass number is greater or equal to the rounded average atomic mass (that is, shift is not negative) then the shift is incremented to avoid shift=0 for isotopes.
 
If the formula produces iso_weight=0 (the atom and the attached H are not isotopic) then iso_weight(c) is set equal to LONG_MAX from include file limits.h (for a 32-bit systems it is usually 2,147,483,647 - greater than any iso_weight). This forces isotopic atoms assume the least possible canonical numbers.
 
Repeat Major Step B, adding the list of isotopic weights to those already minimized.
 
At this point we are finished with the modified B.D.McKay"s algorithm.
 
It should be pointed out that for the sake of simplicity, avoiding dependence on the hardware or operating system, and possibility to reproduce the results "by hand", the efficiency of the original B.D.McKay"s algorithm has been reduced. The greatest impact is due to abandoning hashing for the connection table comparison and introducing additional to the connection table lists to be minimized. Also the implemented algorithm for calculating the equitable partition from the given colors is less effective than the one suggested in Ref. 5. All further improvements introduced by B.D.McKay after publishing Ref. 5 in his famous Nauty program are not implemented in the InChI code.
 
# Major Step D. Stereochemistry
 
1. For the found canonical colors (numbers) calculate double bond (>X=Y<) and cumulene (>W=X=Y=Z<) parities:For each atom at the ends of the double bond or cumulene find connected to it by a single bond atom that has larger canonical number. If these two found atoms are in "cis" positions then the parity is (-), otherwise the parity is (+) Save parities list: c1[1],c2[1],p[1],c1[2],c2[2],p[2],...,c1[n1],c2[n1],p[n1] arranged in ascending order of (c1[i],c2[i]) pairs where n1=number of possibly stereogenic double bonds and cumulenes c1[i]>c2[i] are colors of the atoms at the end of a double bond or cumulene p[i] is the parity ("u" > "?" > "+" > "-") Order: let a1>a2 and b1>b2 be the colors of the atoms for two double bonds, (a1,a2) and (b1,b2). (a1,a2) > (b1,b2) if and only if ((a1 > b1) || (a1==b1 && a1 > b1)) (here the C programming language notation is used).
 
2. For each allene >X=Y=Z< consider a tetrahedron that has as its apices the four atomsconnected by single bonds to the allene atoms X and Z. If you look at other apices from the apex that has the smallest canonical number and see canonical numbers of these three other apices arranged in ascending order clockwise then the parity is (+), otherwise it is (-). Save parities list: c[1],p[1],c[2],p[2],...,c[n2],p[n2] arranged in ascending order of c[i]where n2=number of possibly stereogenic allenes c[i] are the colors of atoms Y p[i] are the parities.
 
3. For each possibly stereogenic atom consider a tetrahedron that has as its apices the four atoms connected this possibly stereogenic atom. If you look at other apices from the apex that has the smallest canonical number and see canonical numbers of these three other apices arranged in ascending order clockwise then the parity is (+), otherwise it is (-). Save parities list: c[1],p[1],c[2],p[2],...,c[n3],p[n3] arranged in ascending order of c[i] where n3=number of possibly stereogenic atoms c[i] are the colors of the atoms p[i] are the parities. Note. Terminal hydrogen atoms do not have colors (canonical numbers). In parity calculations, hydrogen atoms are assumed to have colors less than the smallest color of other atoms, that is, less than 1. The values of their colors c are assumed to be: c[H] < c[protium] < c[deuterium] < c[tritium] < 1 In a special case of all four connected to the same atom the atom is not stereogenic. In case of a tetrahedral atom that has only 3 bonds (for example, >S=O or >N-) the direction of the lone electron pair is used as one more bond; c[lone pair] < c[H].
 
4. Repeat steps 1-3 for all other mappings of the canonical numbers on the atoms thatproduce same results as in Major Step B or C and find the mapping(s) that produce thelexicographically smallest result in this order of the lists: D.1, D.2, D.3. To each result apply a heuristic to detect possibly stereogenic elements that in realityare not stereogenic; if such elements have been found then remove their parities and repeat D.1-4.
 
5. Repeat steps 1-4 for the spatially inverted structure. Accept the one that has smallerstereo (D.1 stereo should be same). Set "inverted" flag if the inverted stereo was selected.
 
This description refers to a single component.