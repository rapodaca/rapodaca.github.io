---
title: Fast Substructure Search Using Open Source Tools Part 2 - Fingerprint Screen With SQL
disqus: true
published: "2008-10-03T00:00:00.000Z"
---

The [previous article in this series](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases) discussed the configuration of a MySQL database for fast substructure search with binary fingerprints. This article first shows how to populate this database with real fingerprint data for two molecules. Then it shows how to formulate standard SQL queries to screen the database for substructures.

All articles in this series:

- [Part 1: Fingerprints and Databases](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases)
- Part 2: Fingerprint Screen With SQL
- [Part 3: A CRUD API for Fingerprints in Ruby](/articles/2008/10/06/fast-substructure-search-using-open-source-tools-part-3-a-crud-api-for-fingerprints-in-ruby)
- [Part 4: Creating Fingerprints from Chemical Structures](/articles/2008/10/15/fast-substructure-search-using-open-source-tools-part-4-creating-fingerprints-from-chemical-structures)
- [Part 5: Relating Molecules to Fingerprints with SQL](/articles/2008/10/21/fast-substructure-search-using-open-source-tools-part-5-relating-molecules-to-fingerprints-with-sql)
- [Part 6: Modelling a One-To-Many Relationship Between Fingerprints and Compounds in Ruby](/articles/2008/10/29/fast-substructure-search-using-open-source-tools-part-6-modelling-a-one-to-many-relationship-between-fingerprints-and-compounds-in-ruby)

# Creating the Fingerprints with Open Babel

The <code>babel</code> command line utility will, among it many conversions, return a fingerprint when given a valid SMILES string.  For example, we can create the fingerprint for benzene like this:

```bash
babel -ismi -ofpt
c1ccccc1
>   6 bits set 
00000000 00000000 00000000 00000200 00000000 00000000 
00000000 00000000 00000000 00000840 00000000 00008000 
00000000 00000000 00000000 00000000 00000000 00000000 
00000000 00000000 00000000 08000000 00000000 00000000 
00000000 00000000 00000000 00000000 00000000 00020000 
00000000 00000000 
1 molecule converted
12 audit log messages
```

Similarly, we create the fingerprint for phenol like this:

```bash
babel -ismi -ofpt
c1ccccc1O 
>   12 bits set 
00000000 00000008 20000000 00000200 00000000 00000000 
02000000 00000000 00000000 00000840 00000000 00008000 
00000002 00000000 00000000 00000008 00000000 00000000 
00000000 00020000 00000000 08000000 00000000 00000000 
00000000 00000000 00000000 00000000 00000000 00020000 
00000000 00000000 
1 molecule converted
19 audit log messages
```

The exact meaning of these fingerprints is interesting, but not relevant. Without getting into the details of the Open Babel fingerprint formats, which are discussed in detail [elsewhere](http://www.dalkescientific.com/writings/diary/archive/2008/06/27/generating_fingerprints_with_openbabel.html), the output contains the binary fingerprint of each molecule as an array of 32-bit hexadecimal numbers.

# Adding Fingerprints to the Database

To use Open Babel's fingerprints with out database, we need to convert the 32-bit hexadecimal numerical output to 64-bit decimal format. This is not difficult and most programming environments make this very simple. For example, the following Ruby code will convert the third and fourth 32-bit hexadecimal numbers in the benzene fingerprint into a 64-bit decimal number:

```bash
irb
irb(main):001:0> "0000000000000200".hex
=> 512
```

Performing this conversion for every pair of 32-bit hex numbers in each fingerprint gives a set of numbers we can place directly into our database:

```bash
mysql> # Add benzene decimal fingerprint.
mysql> insert into fingerprints
(fp0,fp1,fp2,fp3,fp4,fp5,fp6,fp7,fp8,fp9,fp10,fp11,fp12,fp13,fp14,fp15)
values
(0, 512, 0, 0, 2112, 32768, 0, 0, 0, 0, 134217728, 0, 0, 0, 131072, 0);
```

Similarly,

```bash
mysql> # Add phenol decimal fingerprint.
mysql> insert into fingerprints
(fp0,fp1,fp2,fp3,fp4,fp5,fp6,fp7,fp8,fp9,fp10,fp11,fp12,fp13,fp14,fp15)
values
(8, 2305843009213694464, 0, 144115188075855872, 2112, 32768, 8589934592, 8, 0, 131072, 134217728, 0, 0, 0, 131072, 0);
```

Our table is now ready to be queried:

```bash
mysql> select * from fingerprints;
+----+------+---------------------+------+--------------------+------+-------+------------+------+------+--------+-----------+------+------+------+--------+------+
| id | fp0  | fp1                 | fp2  | fp3                | fp4  | fp5   | fp6        | fp7  | fp8  | fp9    | fp10      | fp11 | fp12 | fp13 | fp14   | fp15 |


+----+------+---------------------+------+--------------------+------+-------+------------+------+------+--------+-----------+------+------+------+--------+------+
|  1 |    0 |                 512 |    0 |                  0 | 2112 | 32768 |          0 |    0 |    0 |      0 | 134217728 |    0 |    0 |    0 | 131072 |    0 | 
|  2 |    8 | 2305843009213694464 |    0 | 144115188075855872 | 2112 | 32768 | 8589934592 |    8 |    0 | 131072 | 134217728 |    0 |    0 |    0 | 131072 |    0 | 
+----+------+---------------------+------+--------------------+------+-------+------------+------+------+--------+-----------+------+------+------+--------+------+
2 rows in set (0.00 sec)
```

# Querying the Database

With a table of fingerprints in hand, we can begin formulating queries. To do so, we'll use MySQL's built-in support for [binary arithmetic](http://dev.mysql.com/doc/refman/5.0/en/bit-functions.html).

A molecule with fingerprint A can represent a substructure of another molecule with fingerprint B if all of the bits in B are also present in A. Mathematically, we'd say that:

B<sub>i</sub> & A<sub>i</sub> = B<sub>i</sub>

for all bits i in A and B.

Let's say we have a two-bit fingerprint consisting of 01 and 11 (binary) in our database. We can use MySQL to test whether the molecule from which the second fingerprint was derived could be a substructure of the molecule from which the first fingerprint was derived with this syntax:

```bash
mysql> select 1&3;
+-----+
| 1&3 |
+-----+
|   1 | 
+-----+
1 row in set (0.00 sec)
```

The answer is yes, there could be a substructure match because 1&3 = 1.

We're now ready to perform our first substructure screen using SQL. This consists of selecting all rows for which each of the 16 fingerprint components, when anded together with a query fingerprint component, gives back the original component.

To see if phenol is a substructure of benzene, we could use the following:

```bash
mysql> select id from fingerprints where fp0&0=0 and fp1&512=512 and fp2&0=0 and fp3&0=0 and fp4&2112=2112 and fp5&32768=32768 and fp6&0=0 and fp7&0=0 and fp8&0=0 and fp9&0=0 and fp10&134217728=134217728 and fp11&0=0 and fp12&0=0 and fp13&0=0 and fp14&131072=131072 and fp15&0=0;
+----+
| id |
+----+
|  1 | 
|  2 | 
+----+
2 rows in set (0.00 sec)
```

Our query results are telling us that phenol is both a substructure of benzene and itself, as expected.

# Conclusions

We now have a database populated with two molecules represented as fingerprints. We can even scan the database for possible substructure matches using nothing more than standard SQL queries. Nevertheless, we've had to use a lot of manual coding to convert hex into decimal and create SQL. We need a library to do this mundane work for us. The next article in this series will discuss a better approach using Ruby.
