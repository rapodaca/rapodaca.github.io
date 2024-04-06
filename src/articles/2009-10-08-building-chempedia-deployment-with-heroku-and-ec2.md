---
title: "Building Chempedia: Deployment with Heroku and EC2"
published: "2009-10-08T00:00:00.000Z"
---

Developing a Web application is one thing but deploying it is quite another - and not in a good way. If you've ever had to install, configure and maintain a production server from scratch, you may know the job as being both tedious and thankless.

That's why [Metamolecular](http://metamolecular.com) is doing something different for the re-launch [Chempedia](http://chempedia.com). Rather than provisioning a server from scratch, as we've done with previous applications, we're giving [Heroku](http://heroku.com) a shot.

Heroku is a Web application deployment platform based on Amazon's [Elastic Compute Cloud](http://aws.amazon.com/ec2/) (EC2). Among many advantages offered by Heroku are: dead-simple application deplyment through git; on-demand scaling; and zero-maintenance. With Heroku, the idea of a "server" ceases to exist - instead, all you need to consider is your application and how much power you want behind it at any given time. A [recent presentation](/articles/2009/10/02/tech-fridays-deploying-rails-and-rack-applications-with-heroku) by [Blake Mizerany](http://twitter.com/bmizerany) convinced me that Heroku is worth considering for Chempedia.

Over the next several weeks, I'll be discussing the creation and deployment of Chempedia, the technologies we've used, and the obstacles we've overcome in building a data-driven, socially-oriented Web application for chemistry.

If you're interested finding out what we're cooking up with Chempedia from an end user perspective, feel free to signup for the [Chempedia Newsletter](http://chempedia.com).