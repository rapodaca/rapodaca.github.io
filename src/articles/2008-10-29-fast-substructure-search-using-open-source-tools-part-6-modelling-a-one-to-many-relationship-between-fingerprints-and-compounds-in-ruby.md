---
title: Fast Substructure Search Using Open Source Tools Part 6 - Modelling a One-To-Many Relationship Between Fingerprints and Compounds in Ruby
published: "2008-10-29T00:00:00.000Z"
---

We can think of a fingerprint as a bucket into which every molecule in the universe can be reproducibly placed. Each molecule will belong to a single bucket, but each bucket may contain any number of molecules. In other words, there exists a one-to-many relationship between a fingerprint and its associated molecules. The [previous article in this series](/articles/2008/10/21/fast-substructure-search-using-open-source-tools-part-5-relating-molecules-to-fingerprints-with-sql) discussed how to model this relationship using SQL. This article will take the idea one step further by describing one way to model this relationship in Ruby.

All Articles in this Series:

- [Part 1: Fingerprints and Databases](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases)
- [Part 2: Fingerprint Screen With SQL](/articles/2008/10/03/fast-substructure-search-using-open-source-tools-part-2-fingerprint-screen-with-sql)
- [Part 3: A CRUD API for Fingerprints in Ruby](/articles/2008/10/06/fast-substructure-search-using-open-source-tools-part-3-a-crud-api-for-fingerprints-in-ruby)
- [Part 4: Creating Fingerprints from Chemical Structures](/articles/2008/10/15/fast-substructure-search-using-open-source-tools-part-4-creating-fingerprints-from-chemical-structures)
- [Part 5: Relating Molecules to Fingerprints with SQL](/articles/2008/10/21/fast-substructure-search-using-open-source-tools-part-5-relating-molecules-to-fingerprints-with-sql)
- Part 6: Modelling a One-To-Many Relationship Between Fingerprints and Compounds in Ruby

# SQL Recap

So far, we've set up a fingerprints database:

```bash
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
17 rows in set (0.00 sec)
```

This database contains a single (empty) fingerprint:

```bash
mysql> select * from fingerprints;
+----+-------+-------+-------+-------+-------+-------+-------+-------+-------+-------+--------+--------+--------+--------+--------+--------+
| id | byte0 | byte1 | byte2 | byte3 | byte4 | byte5 | byte6 | byte7 | byte8 | byte9 | byte10 | byte11 | byte12 | byte13 | byte14 | byte15 |
+----+-------+-------+-------+-------+-------+-------+-------+-------+-------+-------+--------+--------+--------+--------+--------+--------+
|  1 |     0 |     0 |     0 |     0 |     0 |     0 |     0 |     0 |     0 |     0 |      0 |      0 |      0 |      0 |      0 |      0 | 
+----+-------+-------+-------+-------+-------+-------+-------+-------+-------+-------+--------+--------+--------+--------+--------+--------+
1 row in set (0.00 sec)
```

We've also set up a compounds database containing a foreign key (`fingerprint_id`) into the fingerprints table:

```bash
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

In this hypothetical example, the compounds database is populated by two molecules, benzene and bromobenzene, both of which share the same fingerprint:

```bash
mysql> select * from compounds;
+----+----------------+------------+
| id | fingerprint_id | smiles     |
+----+----------------+------------+
|  1 |              1 | c1ccccc1   | 
|  2 |              1 | c1ccccc1Br | 
+----+----------------+------------+
2 rows in set (0.00 sec)
```

# Adding the Ruby Layer

In [Part 3](/articles/2008/10/06/fast-substructure-search-using-open-source-tools-part-3-a-crud-api-for-fingerprints-in-ruby), we created a CRUD API for fingerprints in Ruby. We now need to modify the class we created there, Fingerprint, to make it aware of the Compounds it will be associated with.

For brevity, you can [view the updated Fingerprint class here](/images/posts/20081029/fingerprint.rb). The main change has been to add a single line of code that tells `Fingerprint` that it's now associated with a class called `Compound`:

```bash
<pre class="prettyprint">
  has_many :compounds
```

All that remains is to bring the `Compound` class into being:

```bash
require 'rubygems'
require 'active_record'
require 'fingerprint'

ActiveRecord::Base.establish_connection(
  :adapter    =&gt; 'mysql',
  :host       =&gt; 'localhost',
  :username   =&gt;  'root',
  :password   =&gt;  '',
  :database   =&gt;  'compounds'
)

class Compound &lt; ActiveRecord::Base
  belongs_to :fingerprint
end
```

The `belongs_to` line is the counterpart to `Fingerprint's` `has_many` line. Together, both `Fingerprint` and `Compound` create a system in which each `Fingerprint` can reference multiple `Compounds` and each `Compound` references one `Fingerprint`.

Let's test this with interactive Ruby:

```bash
$ irb
irb(main):001:0&gt; require 'fingerprint'
=&gt; true
irb(main):002:0&gt; f=Fingerprint.find 1
=&gt; #&lt;Fingerprint id: 1, byte0: 0, byte1: 0, byte2: 0, byte3: 0, byte4: 0, byte5: 0, byte6: 0, byte7: 0, byte8: 0, byte9: 0, byte10: 0, byte11: 0, byte12: 0, byte13: 0, byte14: 0, byte15: 0&gt;
irb(main):003:0&gt; f.compounds
=&gt; [#&lt;Compound id: 1, fingerprint_id: 1, smiles: "c1ccccc1"&gt;, #&lt;Compound id: 2, fingerprint_id: 1, smiles: "c1ccccc1Br"&gt;]
```

Looks good. Our code has made the correct association between a `Fingerprint` and its `Compounds`. What about the other way around?

```bash
$ irb
irb(main):001:0&gt; require 'compound'
=&gt; true
irb(main):002:0&gt; c=Compound.find 1
=&gt; #&lt;Compound id: 1, fingerprint_id: 1, smiles: "c1ccccc1"&gt;
irb(main):003:0&gt; c.fingerprint
=&gt; #&lt;Fingerprint id: 1, byte0: 0, byte1: 0, byte2: 0, byte3: 0, byte4: 0, byte5: 0, byte6: 0, byte7: 0, byte8: 0, byte9: 0, byte10: 0, byte11: 0, byte12: 0, byte13: 0, byte14: 0, byte15: 0&gt;
```

As expected, the first `Compound` became associated with the correct `Fingerprint`.

# Conclusions

Our system can now store and query molecular fingerprints in a relational database. It also associates multiple compounds with each fingerprint.

We have a complete fingerprint screening system, but not a substructure search system.

What's missing? For one thing, we'd need a way to perform atom-by-atom searches (ABAS) of all candidate structures after the fingerprint screening process is complete. Recall that just because a query fingerprint matches a candidate fingerprint doesn't necessarily mean that a substructure match has been found.

We'd also need a way to conveniently get real compounds with real fingerprints into our database. Only then would we be able to test the chemical validity of substructure queries.

The remaining articles in this series will discuss approaches to each of these requirements.
