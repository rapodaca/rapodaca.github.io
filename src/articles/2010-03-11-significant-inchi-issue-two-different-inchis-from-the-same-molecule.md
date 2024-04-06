---
title: "Significant InChI Issue: Two Different InChIs from the Same Molecule"
published: "2010-03-11T00:00:00.000Z"
---

Timo Boehme of [OntoChem GmbH](http://www.ontochem.com/) has recently reported a significant issue in the most recent InChI implementation (v2.02). Given two molfiles, both of which encode the same structure but use different atom numberings, two different InChIs are produced. The bug can be reproduced with the following molfiles:

```bash
0001
  OCTest  0310101

 11 10  0  0  0  0            999 V2000
    2.1434    2.0625    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.4289    2.4750    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.4289    3.3000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    0.7145    2.0625    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
   -0.0000    2.4750    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    2.8579    2.4750    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    2.8579    3.3000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.5724    3.7125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.5724    4.5375    0.0000 N   0  3  0  0  0  0  0  0  0  0  0  0
    3.5724    5.3625    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    2.1434    3.7125    0.0000 O   0  5  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  2  3  2  0  0  0  0
  2  4  1  0  0  0  0
  4  5  1  0  0  0  0
  1  6  1  0  0  0  0
  6  7  1  0  0  0  0
  7  8  2  0  0  0  0
  8  9  1  0  0  0  0
  9 10  3  0  0  0  0
  7 11  1  0  0  0  0
M  CHG  2   9   1  11  -1
M  END
```

which yields the InChI:

```bash
InChI=1S/C4H7N5O2/c5-8-2-3(10)7-1-4(11)9-6/h2,5-7,10H,1H2/b3-2-
```

and:

```bash
0002
  OCTest  031010

 11 10  0  0  0  0            999 V2000
    2.1434    3.7125    0.0000 O   0  5  0  0  0  0  0  0  0  0  0  0
    2.1434    2.0625    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.4289    2.4750    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.4289    3.3000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    0.7145    2.0625    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
   -0.0000    2.4750    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    2.8579    2.4750    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    2.8579    3.3000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.5724    3.7125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.5724    4.5375    0.0000 N   0  3  0  0  0  0  0  0  0  0  0  0
    3.5724    5.3625    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
  2  3  1  0  0  0  0
  3  4  2  0  0  0  0
  3  5  1  0  0  0  0
  5  6  1  0  0  0  0
  2  7  1  0  0  0  0
  7  8  1  0  0  0  0
  8  9  2  0  0  0  0
  9 10  1  0  0  0  0
 10 11  3  0  0  0  0
  8  1  1  0  0  0  0
M  CHG  2  10   1   1  -1
M  END
```

which yields the InChI:

```bash
InChI=1S/C4H6N5O2/c5-8-2-3(10)7-1-4(11)9-6/h2,6-7,10H,1H2/q-1/p+1/b3-2-
```

As you can see, two different InChIs are produced from molfiles encoding the same structure, an image of which is provided below:

![Bug](/images/posts/20100311/inchi-bug.png "Bug")

In his description of the bug on the [InChI Discussion List](http://sourceforge.net/mailarchive/message.php?msg_name=4B98AD34.5000307%40ontochem.com) 
Boehme writes:

>The problem is in the preprocessing phase where hydrogen atoms are
(re)moved/added. Whether hydrogens are removed depends on the above
mentioned order atoms are defined in the InChI input structure and thus
will produce completely different InChI(keys).
>
>The bug is independent of the molecule input format. The provided test
case is given as SDF which can be used directly with the InChI command
line tool while I tried the same with our Smiles parser which utilizes
the JNI-INCHI library to direclty call InChI API via GetStdINCHI. Thus
the problem is 'in the heart' of the InChI generation algorithm.

You can view the original bug report [here](http://sourceforge.net/tracker/?func=detail&aid=2967428&group_id=136669&atid=741489).

I have reproduced the bug myself on an OS X system running Snow Leopard with a binary compiled from the 2.02 source.

The extent of this bug remains unclear, although at a minimum I suspect that any structure in which the above sample is a substructures would display the behavior.

# Why Does It Matter?

This issue is important because of the central role InChI (and the derived InChI Key) has started to play as a unique molecular identifier, both for internal database table lookups for exact structure searches, and for inter-database communication. A great deal of work by a number of parties could be necessary should this issue be shown to be not limited to the example structure. The issue also underscores the importance of developing a written, English-language InChI specification and a comprehensive test suite.