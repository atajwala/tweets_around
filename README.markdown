# Website

* http://tweetsaround.com

# Description

TweetsAround is a Rails application that demonstrates mashing of MongoDB, Twitter API and Google Maps API.

[created by: 'Aslam Tajwala' http://aslamtajwala.com ]

# Details

## A mash-up app that clubs Twitter API, MongoDB & Google Maps API using Rails.

### Using the Twitter Streaming API (https://dev.twitter.com/docs/streaming-api) it creates an app that lists Tweets with geo location specified by the user.

- Creates a rake task that consumes the Twitter Streaming API.
- Inserts Tweets into a Capped MongoDB "tweets" collection (http://www.mongodb.org/display/DOCS/Capped+Collections) that is limited to 100000 entries. 
- Creates Geo spatial indexes to ensure fast queries.
- Creates a page where the user is able to enter Address (or Long/Lat coordinates) to see the latest tweets near that location. 
- Uses Fibers and EventMachine to speed up inserts into MongoDB.
- Uses Google Maps to visualize location of Tweets.
- Includes some unit tests using RSpec.


### Requirements
- Rails 3.x
- Ruby 1.9.x
- Mongoid (gem)
- EventMachine
- Fibers
- RSpec (gem)
