# Website

* http://tweetsaround.com

# Description

TweetsAround is a Rails application that demonstrates mashing of MongoDB, Twitter API and Google Maps API.

[created by: 'Aslam Tajwala' http://aslamtajwala.com ]

# Details

> #### Using the Twitter Streaming API (https://dev.twitter.com/docs/streaming-api) this web-app lists Tweets near a geographical location specified by the user.

## Internals

This application is built on top of an array of other applications - a mashup in it's true sense. The following is a walkthrough of its making:

- Creates a rake task that consumes the Twitter Streaming API.
- Inserts Tweets into a Capped MongoDB "tweets" collection (http://www.mongodb.org/display/DOCS/Capped+Collections) that is limited to 100K entries. 
- Creates Geo spatial indexes on the collection.
- Creates a page where the user is able to enter an Address (or Long/Lat coordinates) to see the latest tweets near that location. 
- Uses Fibers and EventMachine to speed up inserts into MongoDB.
- Uses Google Maps to visualize location of Tweets.
- Includes some unit tests using RSpec (coming soon).

> #### Model 
Uses mongodb as it's backend. Mongoid is a nice gem that wraps the mongodb syntax with ruby-syntax (*rubyists smiling*). 
The application is hosted on Heroku, and uses mongoHQ for hosting the mongodb database.

> #### Mongoid.yml 
Configuration for the mongodb local database -or- for mongoHQ Heroku hosting.

> #### Tweet.rb 
The coordinates [lat, long] are embedded in the tweet response (json type). To have mongodb index on the coordinates we represent the model in a certain way here. For more information mongoid.org has a great introduction to embedded types.

> #### View 
Jquery (Rails3.1 default). Google Maps API. Makes use of the new 'assets pipeline' feature.

> #### Controller
Light-weight, minimal logic.


### Commands:

> #### Populating the database
- The Procfile (under application root) contains the command for the DelayedJob (Heroku jargon).
- Command 'heroku scale worker=1' will start one worker dyno to run the task defined in Procfile.
  (NOTE: 1 web-dyno and 1 worker-dyno is the limit for Heroku's basic/free package).

> #### Creating geo-spatial indexes
- Run 'heroku run rake db:mongoid:create_indexes' after the DB Collection is created.


### Heroku hosting
- Basic. One Web dyno for webserver and one worker dyna for populating the tweet database on MongoHQ.

### Requirements
- Rails 3.x
- Ruby 1.9.x
- Mongoid (gem, implements EventMachine)
- EventMachine
- Fibers
- RSpec (gem)

### Benchmarking
With one worker dyno, on average 104k tweets are populated in 2200 seconds (about 47 tweets/sec).
So, currently, the average time to refresh all the tweets in the database is about 36 minutes! - yeah, not very realtime :)

### Browser support
Tested with (but not limited to):

- Chrome
- Safari
- Firefox
- Internet Explorer (works best with IE9)
