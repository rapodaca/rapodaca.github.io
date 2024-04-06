---
title: Fast Substructure Search Using Open Source Tools Part 5 - Relating Molecules to Fingerprints with SQL
disqus: true
published: "2008-10-21T00:00:00.000Z"
---

A molecular fingerprint is a special kind of [hash function](http://en.wikipedia.org/wiki/Hash_function) that can reproducibly place any molecule, known or unknown, into one of a large but finite set of groups. Each molecule will be associated with exactly one fingerprint, but each fingerprint can be associated with multiple molecules. In other words, there exists a one-to-many relationship between fingerprints and molecules. This article outlines one of the final steps in creating a substructure-searchable relational chemical database by describing a simple method for associating fingerprints and molecules.

All Articles in this Series:

- [Part 1: Fingerprints and Databases](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases)
- [Part 2: Fingerprint Screen With SQL](/articles/2008/10/03/fast-substructure-search-using-open-source-tools-part-2-fingerprint-screen-with-sql)
- [Part 3: A CRUD API for Fingerprints in Ruby](/articles/2008/10/06/fast-substructure-search-using-open-source-tools-part-3-a-crud-api-for-fingerprints-in-ruby)
- [Part 4: Creating Fingerprints from Chemical Structures](/articles/2008/10/15/fast-substructure-search-using-open-source-tools-part-4-creating-fingerprints-from-chemical-structures)
- Part 5: Relating Molecules to Fingerprints with SQL
- [Part 6: Modelling a One-To-Many Relationship Between Fingerprints and Compounds in Ruby](/articles/2008/10/29/fast-substructure-search-using-open-source-tools-part-6-modelling-a-one-to-many-relationship-between-fingerprints-and-compounds-in-ruby)

# Modelling a One-To-Many Relationship

The [one-to-many relationship](http://www.onlamp.com/pub/a/onlamp/2001/03/20/aboutSQL.html) is one of the most fundamental concepts in relational databases. In our case, we'd like to create a new table called `compounds`. We'd furthermore like to link each row in the `compounds` table with a row in the `fingerprints` table. This can be accomplished by adding a column to the `compounds` table that's capable of holding an id from the "fingerprints" table ([foreign key](http://en.wikipedia.org/wiki/Foreign_key)).

This would then give us the ability to gather all of the rows in the `compounds` table that match a particular fingerprint (or group of fingerprints).

# Creating the `compounds` Table

The `compounds` table we'll create will store three pieces of information:

1.  A unique id (something that all of our tables will have).
2.  An integer column called "fingerprint_id" that will store the unique id of a fingerprint described by a row in the `fingerprints` table.
3.  A string column called "smiles" that will hold the SMILES string of each compound in compact form.

We can create the table with the following:

```bash
mysql> create table compounds (id int not null auto_increment, primary key(id), fingerprint_id int, smiles text);
Query OK, 0 rows affected (0.01 sec)

mysql> describe compounds;
+----------------+---------+------+-----+---------+----------------+
| Field          | Type    | Null | Key | Default | Extra          |
+----------------+---------+------+-----+---------+----------------+
| id             | int(11) | NO   | PRI | NULL    | auto_increment | 
| fingerprint_id | int(11) | YES  |     | NULL    |                | 
| smiles         | text    | YES  |     | NULL    |                | 
+----------------+---------+------+-----+---------+----------------+
3 rows in set (0.00 sec)
```

# Using `compounds` and `fingerprints` Together

Now let's populate our database with some simple, fake data. If you haven't done so already, delete all rows from your existing `fingerprints` table:

```bash
mysql> delete from fingerprints;
Query OK, 0 rows affected (0.00 sec)

mysql> select * from fingerprints;
Empty set (0.00 sec)

mysql> describe fingerprints;
+--------+---------------------+------+-----+---------+----------------+
| Field  | Type                | Null | Key | Default | Extra          |
+--------+---------------------+------+-----+---------+----------------+
| id     | int(11)             | NO   | PRI | NULL    | auto_increment | 
| byte0  | bigint(64) unsigned | YES  |     | 0       |                | 
| byte1  | bigint(64) unsigned | YES  |     | 0       |                | 
| byte2  | bigint(64) unsigned | YES  |     | 0       |                | 
| byte3  | bigint(64) unsigned | YES  |     | 0       |                | 
| byte4  | bigint(64) unsigned | YES  |     | 0       |                | 
| byte5  | bigint(64) unsigned | YES  |     | 0       |                | 
| byte6  | bigint(64) unsigned | YES  |     | 0       |                | 
| byte7  | bigint(64) unsigned | YES  |     | 0       |                | 
| byte8  | bigint(64) unsigned | YES  |     | 0       |                | 
| byte9  | bigint(64) unsigned | YES  |     | 0       |                | 
| byte10 | bigint(64) unsigned | YES  |     | 0       |                | 
| byte11 | bigint(64) unsigned | YES  |     | 0       |                | 
| byte12 | bigint(64) unsigned | YES  |     | 0       |                | 
| byte13 | bigint(64) unsigned | YES  |     | 0       |                | 
| byte14 | bigint(64) unsigned | YES  |     | 0       |                | 
| byte15 | bigint(64) unsigned | YES  |     | 0       |                | 
+--------+---------------------+------+-----+---------+----------------+
17 rows in set (0.01 sec)

```

Now let's create a dummy fingerprint for the sake of simplicity:

```bash
mysql> insert into fingerprints () values();
Query OK, 1 row affected (0.00 sec)

mysql> select * from fingerprints;
+-------+-------+-------+-------+-------+-------+-------+-------+-------+-------+-------+--------+--------+--------+--------+--------+--------+
| id    | byte0 | byte1 | byte2 | byte3 | byte4 | byte5 | byte6 | byte7 | byte8 | byte9 | byte10 | byte11 | byte12 | byte13 | byte14 | byte15 |
+-------+-------+-------+-------+-------+-------+-------+-------+-------+-------+-------+--------+--------+--------+--------+--------+--------+
| 16806 |     0 |     0 |     0 |     0 |     0 |     0 |     0 |     0 |     0 |     0 |      0 |      0 |      0 |      0 |      0 |      0 | 
+-------+-------+-------+-------+-------+-------+-------+-------+-------+-------+-------+--------+--------+--------+--------+--------+--------+
1 row in set (0.00 sec)
```

Let's associate two compounds with this fingerprint:

```bash
mysql> insert into compounds (fingerprint_id,smiles) values(16806,'c1ccccc1');
Query OK, 1 row affected (0.01 sec)

mysql> insert into compounds (fingerprint_id,smiles) values(16806,'c1ccccc1Br');
Query OK, 1 row affected (0.00 sec)

mysql> select * from compounds;
+----+----------------+------------+
| id | fingerprint_id | smiles     |
+----+----------------+------------+
| 20 |          16806 | c1ccccc1   | 
| 21 |          16806 | c1ccccc1Br | 
+----+----------------+------------+
2 rows in set (0.00 sec)
```

We can now find all compounds with fingerprints containing no bits set:

```bash
mysql> select compounds.* from compounds inner join fingerprints on compounds.fingerprint_id=fingerprints.id where fingerprints.byte0=0 and fingerprints.byte1=0 and fingerprints.byte2=0 and fingerprints.byte3=0 and fingerprints.byte4=0 and fingerprints.byte5=0 and fingerprints.byte6=0 and fingerprints.byte7=0 and fingerprints.byte8=0 and fingerprints.byte8=0 and fingerprints.byte9=0 and fingerprints.byte10=0 and fingerprints.byte11=0 and fingerprints.byte12=0 and fingerprints.byte13=0 and fingerprints.byte14=0 and fingerprints.byte15=0;
+----+----------------+------------+
| id | fingerprint_id | smiles     |
+----+----------------+------------+
| 20 |          16806 | c1ccccc1   | 
| 21 |          16806 | c1ccccc1Br | 
+----+----------------+------------+
2 rows in set (0.00 sec)
```

We could just as easily replace the "=" operator with the "&" operator to perform substructure fingerprint screens. Although the data we're using is hardly realistic, the same concepts apply regardless of how the fingerprints are constructed.

# Conclusions

We now have a way to associate fingerprints with compounds stored in our database. Although we could continue to populate and query our database using hand-coded SQL statements, what we'd really like to use is an API written in a high-level programming language. The next article in this series will demonstrate how this can be done in Ruby.