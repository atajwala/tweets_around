require 'uri'
require 'tweetstream'
require 'yajl'

task :stream => :environment do
@statuses = []
TweetStream::Client.new.locations('-180,-90,180,90') do |status, client|
  @statuses << status
  client.stop if @statuses.size >= 1
end

puts @statuses
end