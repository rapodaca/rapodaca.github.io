---
title: Fast Substructure Search Using Open Source Tools Part 1 - Fingerprints and Databases
disqus: true
published: "2008-10-02T00:00:00.000Z"
---

For anyone working in a chemistry-related job, chemical databases are ubiquitous. A printed list of IUPAC names, a spreadsheet containing [CAS numbers](/articles/2008/05/26/simple-cas-number-lookup-and-more-with-chempedia), and a set of hand-drawn structures on index cards are all primitive chemical databases. They aren't nearly as useful as they could be to either the creator or his/her collaborators, but they are databases nevertheless. Anyone who has spent time in industry or academics knows that these low-tech chemical databases are everywhere. And they become more of a problem as more information is moved into electronic format.

All articles in this series:

- Part 1: Fingerprints and Databases
- [Part 2: Fingerprint Screen With SQL](/articles/2008/10/03/fast-substructure-search-using-open-source-tools-part-2-fingerprint-screen-with-sql)
- [Part 3: A CRUD API for Fingerprints in Ruby](/articles/2008/10/06/fast-substructure-search-using-open-source-tools-part-3-a-crud-api-for-fingerprints-in-ruby)
- [Part 4: Creating Fingerprints from Chemical Structures](/articles/2008/10/15/fast-substructure-search-using-open-source-tools-part-4-creating-fingerprints-from-chemical-structures)
- [Part 5: Relating Molecules to Fingerprints with SQL](/articles/2008/10/21/fast-substructure-search-using-open-source-tools-part-5-relating-molecules-to-fingerprints-with-sql)
- [Part 6: Modelling a One-To-Many Relationship Between Fingerprints and Compounds in Ruby](/articles/2008/10/29/fast-substructure-search-using-open-source-tools-part-6-modelling-a-one-to-many-relationship-between-fingerprints-and-compounds-in-ruby)

# The Problem: Structure Search is Hard

Many of the low-tech chemical databases that professional chemists routinely share and work with would become orders of magnitude more useful if they were converted into substructure-searchable databases and published to the Web. Although there has been a [great deal of effort toward this end](/articles/2007/01/24/thirty-two-free-chemistry-databases) in the last few years, there's still much, much more that could be done.

One of the main problems in creating a substructure-searchable chemical database is implementing the substructure search capability itself. This one requirement has done more to stifle the free flow of chemical information than perhaps any other. Solving the problem appears very difficult on first or second glance, and it is very difficult if you don't have the right tools. Many companies offer solutions - but at a price, both in terms of money and time, that is simply out of reach.

What can you do if you're just getting started with modest requirements and budget?

# About This Series

This article, the first in a series, will describe the creation of a chemical substructure search engine using exclusively well-maintained and robust open source tools: [Open Babel](http://openbabel.org) for generating fingerprints and peforming atom-by-atom searches; [MySQL](http://mysql.com) as a relational database; and [Ruby](http://ruby-lang.org) as a scripting language.

Each of these three components is a commodity that can be replaced with any one of a number of open-source or proprietary substitutes, maximizing flexibility and minimizing vendor lock-in.

# Other Resources

[Norbert Haider](http://merian.pch.univie.ac.at/pch/nh_info.html) of the University of Vienna has written a very useful tutorial on [creating a structure-searchable database using free tools](http://merian.pch.univie.ac.at/~nhaider/cheminf/moldb.html), which is part of a [larger series](/articles/2007/04/13/roll-your-own-chemical-database-with-free-components). That series differs from this one in the technology stack used and the level of detail to be provided. The series of articles to appear here will spell out the low-level series of steps needed to create a working substructure search system. It's hoped that taking this perspective makes clear the steps needed to apply the approach to alternative technology platforms.

# Binary Fingerprints and Relational Databases

At the heart of the system we'll build is the chemical fingerprint which is a (usually) lossy binary representation of a chemical structure. Creating a binary fingerprint is like putting every chemical structure, known or unknown into just one bin out of a very large, but finite set of bins. Although the same molecule is guaranteed to always go into the same bin, more than one molecule can be placed into each bin. This is a general feature of all [hashing](http://en.wikipedia.org/wiki/Hash_function) schemes.

[Andrew Dalke](http://www.dalkescientific.com/index.html) has written [an excellent series of articles](http://www.dalkescientific.com/writings/diary/archive/2008/06/26/fingerprint_background.html) on fingerprints and what can be done with them. Another good overview is [available from Daylight](http://www.daylight.com/dayhtml/doc/theory/theory.finger.html). This article will assume you know what fingerprints are and how they can be used to compare chemical structures.

The problem with binary fingerprints is that they are generally several hundred bits long - too long to be represented in a form that allows direct and rapid query by a relational database system. They need to be broken up - but how?

A widely-used approach (and the one that will be taken here) involves breaking up the fingerprint into a series of integers that are stored in the database.

For example, let's say we have a 1024-bit fingerprint. We could represent this as a number from 0 to 2^1024, which of course is way to big for most computers to handle today. We could, however, represent this fingerprint as a series of sixteen 64-bit integers (which are available on most systems).

So, the binary fingerprint:

```bash
1111111101111111110110111011011000101000011000011010011100010000
1001100010101101000110100010110011101100100000100100000111010100
0101010000101011001010011001000100011001100000101100111010001110
1001000101001010000001011001100101101011111111011000111100000111
1010101100100101000100001100011001010111001001110101101100010010
0011101011101110110011111010000010111001100101001001101010110001
1100111000010100000100110111101001011100010111010001010101101101
0010001111111010111011110110000000001010111011111001111001111101
0101011100011111110111011110011110100110010110010101011001011111
0110100001111001101111011101001101101001000100010001100101111000
0011111001000100001111111110001100111001101000000100010010010110
0000011101001001011000111110101110010101110001111010100001100100
0100100111101010110101101010110110101010110110111011011001111111
0011100100101101101001000001000111110101011101110101101001101001
0110100100111001111001001111110111111001110100100110010100011110
0010101100101000011110101110111011001110101111100001011010101100
```

could also be represented as this decimal fingerprint (assuming your machine is [big-endian](http://en.wikipedia.org/wiki/Endianness)):

```bash
18410675377121896208
11001478244984832468
6064987026359504526
10469186440276053767
12332281598675737362
4246559787872197297
14849515287603909997
2592647731284516477
6277980392575817311
7528256967824972152
4486781373924787350
525060695046727780
5326305550703244927
4120129631153511017
7582343227124114718
3109870708788696748
```

We can easily store this set of 16 numbers in a relational database table. For example, if we had a MySQL database called "compounds", we could create a "fingerprints" table:

```bash
mysql> create database compounds;
Query OK, 1 row affected (0.02 sec)

mysql> use compounds;

Database changed
mysql> create table fingerprints(id int not null auto_increment, primary key(id), fp0 bigint(64), fp1 bigint(64), fp2 bigint(64), fp3 bigint(64), fp4 bigint(64), fp5 bigint(64), fp6 bigint(64), fp7 bigint(64), fp8 bigint(64), fp9 bigint(64), fp10 bigint(64), fp11 bigint(64), fp12 bigint(64), fp13 bigint(64), fp14 bigint(64), fp15 bigint(64));
Query OK, 0 rows affected (0.01 sec)

mysql> describe fingerprints;
+-------+------------+------+-----+---------+----------------+
| Field | Type       | Null | Key | Default | Extra          |
+-------+------------+------+-----+---------+----------------+
| id    | int(11)    | NO   | PRI | NULL    | auto_increment | 
| fp0   | bigint(64) | YES  |     | NULL    |                | 
| fp1   | bigint(64) | YES  |     | NULL    |                | 
| fp2   | bigint(64) | YES  |     | NULL    |                | 
| fp3   | bigint(64) | YES  |     | NULL    |                | 
| fp4   | bigint(64) | YES  |     | NULL    |                | 
| fp5   | bigint(64) | YES  |     | NULL    |                | 
| fp6   | bigint(64) | YES  |     | NULL    |                | 
| fp7   | bigint(64) | YES  |     | NULL    |                | 
| fp8   | bigint(64) | YES  |     | NULL    |                | 
| fp9   | bigint(64) | YES  |     | NULL    |                | 
| fp10  | bigint(64) | YES  |     | NULL    |                | 
| fp11  | bigint(64) | YES  |     | NULL    |                | 
| fp12  | bigint(64) | YES  |     | NULL    |                | 
| fp13  | bigint(64) | YES  |     | NULL    |                | 
| fp14  | bigint(64) | YES  |     | NULL    |                | 
| fp15  | bigint(64) | YES  |     | NULL    |                | 
+-------+------------+------+-----+---------+----------------+
17 rows in set (0.01 sec)

```

# Conclusions

Although we have neither a substructure search engine nor a database, we've laid a solid foundation for those things. The next article in this series will show how to use this humble beginning to model some simple substructure queries in a way that lets MySQL do most of the heavy-lifting.
