require 'uri'
require 'tweetstream'
require 'yajl'

username = 'banjoproject1'
password = 'banjoproject'

TweetStream.configure do |config|
  config.username = username
  config.password = password
  config.auth_method = :basic
  config.parser   = :yajl
end

=begin
class Tweet  
  def self.create!(tweet)
    collection.insert(tweet)
  end

  private
    def self.establish_connection
      Mongo::Connection.new.db("tweets_nearby_development")
    end

    def self.db
      @db ||= establish_connection
    end

    def self.collection
      #@collection ||= db.createCollection("tweets", {capped:true, size:100000})
      @collection ||= db.collection("tweets", {capped:true, size:100000})
    end
end
=end

task :get_stream => :environment do
	max_allowed_errors = 1200
	consecutive_errors = 0
	while consecutive_errors < max_allowed_errors do
		begin
			TweetStream::Client.new.locations('-180,-90,180,90') do |singleton|
        puts "#{singleton.text}"
				Tweet.create!(singleton)
      end
    rescue TweetStream::ReconnectError
			consecutive_errors += 1
		end
		sleep(0.25*consecutive_errors)
	end
end