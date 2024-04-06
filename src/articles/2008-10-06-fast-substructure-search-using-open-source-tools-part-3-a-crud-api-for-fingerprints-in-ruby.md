---
title: Fast Substructure Search Using Open Source Tools Part 3 - A CRUD API for Fingerprints in Ruby
published: "2008-10-06T00:00:00.000Z"
---

The previous article in this series showed how to perform fingerprint screens for substructure searches [using nothing more than SQL](/articles/2008/10/03/fast-substructure-search-using-open-source-tools-part-2-fingerprint-screen-with-sql). Although this is significant progress, working at the level of SQL queries to perform create, read, update, and delete operations ([CRUD](http://en.wikipedia.org/wiki/Create,_read,_update_and_delete)) on our fingerprint table is more work than it needs to be. We'd really prefer to use an API written in a high-level programming language. This article describes a simple Ruby API for managing and querying a database of molecular fingerprints.

All Articles in this Series:

- [Part 1: Fingerprints and Databases](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases)
- [Part 2: Fingerprint Screen With SQL](/articles/2008/10/03/fast-substructure-search-using-open-source-tools-part-2-fingerprint-screen-with-sql)
- Part 3: A CRUD API for Fingerprints in Ruby
- [Part 4: Creating Fingerprints from Chemical Structures](/articles/2008/10/15/fast-substructure-search-using-open-source-tools-part-4-creating-fingerprints-from-chemical-structures)
- [Part 5: Relating Molecules to Fingerprints with SQL](/articles/2008/10/21/fast-substructure-search-using-open-source-tools-part-5-relating-molecules-to-fingerprints-with-sql)
- [Part 6: Modelling a One-To-Many Relationship Between Fingerprints and Compounds in Ruby](/articles/2008/10/29/fast-substructure-search-using-open-source-tools-part-6-modelling-a-one-to-many-relationship-between-fingerprints-and-compounds-in-ruby)

# Some Changes to the Database Schema

Before we move forward, we must deal with one minor detail. By default [MySQL uses signed 64-bit integers](http://dev.mysql.com/doc/refman/4.1/en/numeric-types.html). This gives a range for integers of -9223372036854775808 to 9223372036854775807. Ruby, on the other hand, can work with integers of any size through the <code>Bignum</code> class - and we'll be taking full advantage of this feature.

If we want to avoid the headache of constantly accounting for the difference, we need to tell our database to use unsigned integers in the fingerprints table. This can be done by first dropping the old table:

```bash
mysql> drop table fingerprints;
Query OK, 0 rows affected (0.00 sec)
```

Now let's create a new table in which the <code>fp<sub>n</sub></code> columns store unsigned integers only. While we're at it, let's change the naming of these columns from <code>fp<sub>n</sub></code> to the more descriptive <code>byte<sub>n</sub></code> and set a default value of zero.

The new table can be created with with:

```bash
mysql&gt; create table fingerprints(id int not null auto_increment, primary key(id), byte0 bigint(64) unsigned default 0, byte1 bigint(64) unsigned default 0, byte2 bigint(64) unsigned default 0, byte3 bigint(64) unsigned default 0, byte4 bigint(64) unsigned default 0, byte5 bigint(64) unsigned default 0, byte6 bigint(64) unsigned default 0, byte7 bigint(64) unsigned default 0, byte8 bigint(64) unsigned default 0, byte9 bigint(64) unsigned default 0, byte10 bigint(64) unsigned default 0, byte11 bigint(64) unsigned default 0, byte12 bigint(64) unsigned default 0, byte13 bigint(64) unsigned default 0, byte14 bigint(64) unsigned default 0, byte15 bigint(64) unsigned default 0);
Query OK, 0 rows affected (0.00 sec)

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

We're now ready to create the Ruby API.

# The API

The code below is all we need to begin querying and managing our fingerprint database in Ruby:

```ruby
require 'rubygems'
require 'active_record'

ActiveRecord::Base.establish_connection(
  :adapter    =&gt; 'mysql',
  :host       =&gt; 'localhost',
  :username   =&gt;  'root',
  :password   =&gt;  '',
  :database   =&gt;  'compounds'
)

class Fingerprint &lt; ActiveRecord::Base
  @@bytes_prefix = "byte"
  
  def each_byte
    0.upto(byte_count - 1) {|i| yield send("#{@@bytes_prefix}#{i}")  }
  end
  
  def each_byte_with_index
    0.upto(byte_count - 1) {|i| yield send("#{@@bytes_prefix}#{i}"), i  }
  end
  
  def fill_bytes
    0.upto(byte_count - 1) {|i| send("#{@@bytes_prefix}#{i}=", yield(i))}
    
    self
  end
  
  def to_byte_array
    Array.new(16).fill{|i| send("#{@@bytes_prefix}#{i}")}
  end
  
  def byte_count
    result = 0
    
    while respond_to? "#{@@bytes_prefix}#{result}"
      result += 1
    end
    
    result
  end
  
  def bitstring
    result = ""
    
    each_byte {|byte| result +=  sprintf("%064b", byte)}
    
    result
  end
  
  def cardinality
    bitstring.count("1")
  end
  
  def eql?(other)
    to_byte_array.eql?(other.to_byte_array)
  end
  
  def save
    return false unless Fingerprint.find_by_fingerprint(self).empty?
    
    super
  end
  
  def self.find_by_fingerprint fingerprint
    Fingerprint.find_by_sql sql_for_find_by_fingerprint(fingerprint)
  end
  
  def self.find_children_by_fingerprint fingerprint
    Fingerprint.find_by_sql sql_for_find_children_by_fingerprint(fingerprint)
  end
  
  def self.sql_for_find_by_fingerprint fingerprint
    result = "select fingerprints.* from fingerprints where "
    last = fingerprint.byte_count - 1
    
    fingerprint.each_byte_with_index do |byte, i|
      result += "#{@@bytes_prefix}#{i}=#{byte}" + ((i ==last) ? "" : " and ")
    end
    
    result
  end
  
  def self.sql_for_find_children_by_fingerprint fingerprint
    result = "select fingerprints.* from fingerprints where "
    last = fingerprint.byte_count - 1
    
    fingerprint.each_byte_with_index do |byte, i|
      result += "#{@@bytes_prefix}#{i}&#{byte}=#{byte}" + ((i ==last) ? "" : " and ")
    end
    
    result
  end
end
```

# Testing the API

We can test this library from interactive ruby (irb). Let's add two fingerprints - the first consisting of all bits set to "1" and the second consisting of alternating "1" and "0" bits:

```bash
irb
irb(main):001:0&gt; require 'fingerprint'
=> true
irb(main):002:0> f1=Fingerprint.new.fill_bytes{"ffffffffffffffff".hex}
=> #&lt;Fingerprint id: nil, byte0: 18446744073709551615, byte1: 18446744073709551615, byte2: 18446744073709551615, byte3: 18446744073709551615, byte4: 18446744073709551615, byte5: 18446744073709551615, byte6: 18446744073709551615, byte7: 18446744073709551615, byte8: 18446744073709551615, byte9: 18446744073709551615, byte10: 18446744073709551615, byte11: 18446744073709551615, byte12: 18446744073709551615, byte13: 18446744073709551615, byte14: 18446744073709551615, byte15: 18446744073709551615>
irb(main):003:0> f1.save
=> true
irb(main):004:0> f2=Fingerprint.new.fill_bytes{"aaaaaaaaaaaaaaaa".hex}
=> #&lt;Fingerprint id: nil, byte0: 12297829382473034410, byte1: 12297829382473034410, byte2: 12297829382473034410, byte3: 12297829382473034410, byte4: 12297829382473034410, byte5: 12297829382473034410, byte6: 12297829382473034410, byte7: 12297829382473034410, byte8: 12297829382473034410, byte9: 12297829382473034410, byte10: 12297829382473034410, byte11: 12297829382473034410, byte12: 12297829382473034410, byte13: 12297829382473034410, byte14: 12297829382473034410, byte15: 12297829382473034410>
irb(main):005:0> f2.save
=> true
```

Let's find the fingerprint in which all bits are turned on:

```bash
irb
irb(main):001:0&gt; require 'fingerprint'
=> true
irb(main):002:0> query=Fingerprint.new.fill_bytes{"ffffffffffffffff".hex}
=> #&lt;Fingerprint id: nil, byte0: 18446744073709551615, byte1: 18446744073709551615, byte2: 18446744073709551615, byte3: 18446744073709551615, byte4: 18446744073709551615, byte5: 18446744073709551615, byte6: 18446744073709551615, byte7: 18446744073709551615, byte8: 18446744073709551615, byte9: 18446744073709551615, byte10: 18446744073709551615, byte11: 18446744073709551615, byte12: 18446744073709551615, byte13: 18446744073709551615, byte14: 18446744073709551615, byte15: 18446744073709551615>
irb(main):003:0> Fingerprint.find_by_fingerprint query
=> [#&lt;Fingerprint id: 111, byte0: 18446744073709551615, byte1: 18446744073709551615, byte2: 18446744073709551615, byte3: 18446744073709551615, byte4: 18446744073709551615, byte5: 18446744073709551615, byte6: 18446744073709551615, byte7: 18446744073709551615, byte8: 18446744073709551615, byte9: 18446744073709551615, byte10: 18446744073709551615, byte11: 18446744073709551615, byte12: 18446744073709551615, byte13: 18446744073709551615, byte14: 18446744073709551615, byte15: 18446744073709551615>]
```

Our query has found an exact match for the query fingerprint in the database at row 111. (This id is not 1 because previous automated tests that I wrote and executed have added and removed rows, advancing the id counter).

We can also search the database for the children of an arbitrary fingerprint query. A test fingerprint A is a "child" of query Q if all of the set bits in Q are also set in A. Notice that this leaves open the possibility that A has *more* bits set than Q. For example:

```bash
irb
irb(main):001:0&gt; require 'fingerprint'
=> true
irb(main):002:0> query=Fingerprint.new.fill_bytes{"aaaaaaaaaaaaaaaa".hex}
=> #&lt;Fingerprint id: nil, byte0: 12297829382473034410, byte1: 12297829382473034410, byte2: 12297829382473034410, byte3: 12297829382473034410, byte4: 12297829382473034410, byte5: 12297829382473034410, byte6: 12297829382473034410, byte7: 12297829382473034410, byte8: 12297829382473034410, byte9: 12297829382473034410, byte10: 12297829382473034410, byte11: 12297829382473034410, byte12: 12297829382473034410, byte13: 12297829382473034410, byte14: 12297829382473034410, byte15: 12297829382473034410>
irb(main):003:0> results = Fingerprint.find_children_by_fingerprint query
=> [#&lt;Fingerprint id: 112, byte0: 12297829382473034410, byte1: 12297829382473034410, byte2: 12297829382473034410, byte3: 12297829382473034410, byte4: 12297829382473034410, byte5: 12297829382473034410, byte6: 12297829382473034410, byte7: 12297829382473034410, byte8: 12297829382473034410, byte9: 12297829382473034410, byte10: 12297829382473034410, byte11: 12297829382473034410, byte12: 12297829382473034410, byte13: 12297829382473034410, byte14: 12297829382473034410, byte15: 12297829382473034410>, #&lt;Fingerprint id: 111, byte0: 18446744073709551615, byte1: 18446744073709551615, byte2: 18446744073709551615, byte3: 18446744073709551615, byte4: 18446744073709551615, byte5: 18446744073709551615, byte6: 18446744073709551615, byte7: 18446744073709551615, byte8: 18446744073709551615, byte9: 18446744073709551615, byte10: 18446744073709551615, byte11: 18446744073709551615, byte12: 18446744073709551615, byte13: 18446744073709551615, byte14: 18446744073709551615, byte15: 18446744073709551615>]
```

It worked - both fingerprints stored in the database were found.

We can delete a <code>Fingerprint</code> like this:

```bash
irb
irb(main):001:0&gt; require 'fingerprint'
=> true
irb(main):002:0> f=Fingerprint.find 112
=> #&lt;Fingerprint id: 112, byte0: 12297829382473034410, byte1: 12297829382473034410, byte2: 12297829382473034410, byte3: 12297829382473034410, byte4: 12297829382473034410, byte5: 12297829382473034410, byte6: 12297829382473034410, byte7: 12297829382473034410, byte8: 12297829382473034410, byte9: 12297829382473034410, byte10: 12297829382473034410, byte11: 12297829382473034410, byte12: 12297829382473034410, byte13: 12297829382473034410, byte14: 12297829382473034410, byte15: 12297829382473034410>
irb(main):003:0> f.destroy
=> #&lt;Fingerprint id: 112, byte0: 12297829382473034410, byte1: 12297829382473034410, byte2: 12297829382473034410, byte3: 12297829382473034410, byte4: 12297829382473034410, byte5: 12297829382473034410, byte6: 12297829382473034410, byte7: 12297829382473034410, byte8: 12297829382473034410, byte9: 12297829382473034410, byte10: 12297829382473034410, byte11: 12297829382473034410, byte12: 12297829382473034410, byte13: 12297829382473034410, byte14: 12297829382473034410, byte15: 12297829382473034410>
irb(main):004:0> Fingerprint.count
=> 1
```

# Active Record and the Fingerprint API

The <code>Fingerprint</code> class is so concise because it takes advantage of the Ruby library called [ActiveRecord](http://ar.rubyonrails.com/). ActiveRecord is the object-relational mapping system used in [Ruby on Rails](http://rubyonrails.com/). ActiveRecord can be used outside of Rails, as was done for this library, by including the code at the top of the file beginning with "ActiveRecord::Base.establish_connection...", where you'd use the parameters specific to your database.

We gain three key advantages with this approach: (1) we have very little SQL to code; (2) we have access to all of ActiveRecord's built-in CRUD operations such as counting records through Fingerprint.count and deleting <code>Fingerprints</code> with <code>destroy</code> without writing anything ourselves; and (3) we can easily integrate the <code>Fingerprint</code> class into any Ruby on Rails application.

# Variations

At least two other Object-Ralational Mapping systems could be used from Ruby, [DataMapper](http://datamapper.org/), and [Sequel](http://sequel.rubyforge.org/). The approach described here could be adapted to these other ORMS with minimal effort.

# Conclusions

We now have a working fingerprint screening system built solely from open source components. MySQL houses the data and provides for highly-optimized queries. A concise Ruby API created with ActiveRecord now allows us to deal with our fingerprint database as a collection of objects in a high-level language. We can perform all CRUD operations without writing a line of SQL.

We've come a long way, but we're still not dealing with molecules. We previously saw how Open Babel can [generate fingerprints](/articles/2008/10/03/fast-substructure-search-using-open-source-tools-part-2-fingerprint-screen-with-sql) with which we could, in principle, populate and query our database. The next article in this series will use this capability in creating a more chemically-aware system.


