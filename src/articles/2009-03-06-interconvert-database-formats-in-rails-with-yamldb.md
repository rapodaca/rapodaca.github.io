---
title: "Interconvert Database Formats in Rails with YamlDB"
published: "2009-03-06T00:00:00.000Z"
---

The database backends for both [Zusammen](http://zusammen.metamolecular.com) and the [Metamolecular Product Blog](http://products.metamolecular.com) started out as [SQLite](http://www.sqlite.org/) databases during development. If you're not familiar with SQLite, it's a fast, single-file, zero-administration database system. And it works very well in some cases, such as when you're developing a Web application.

But deployment is another matter. In Rails, for example, the SQLite database file lives inside your project directory. This means that it takes some finagling to get it to work right with automated deployment systems such as [Capistrano](http://www.capify.org/). Everything I read on this subject pointed to overcomplexity, so I decided to revert back to MySQL.

Surprisingly, converting from SQLite to MySQL format is not easy, as [this question on StackOverflow](http://stackoverflow.com/questions/18671/quick-easy-way-to-migrate-sqlite3-to-mysql) demonstrates. Fortunately, buried in the discouraging responses to this question was a true gem: [YamlDB](http://blog.heroku.com/archives/2007/11/23/yamldb_for_databaseindependent_data_dumps/) from Adam at [Heroku](http://blog.heroku.com).

YamlDB dumps any Rails database into an intermediate YAML format, which you can then import back into any other database format. This bypasses the thorny problem of incompatible database dump file formats. Although others had reported some problems, in my case it worked perfectly the first time.