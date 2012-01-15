require 'spec_helper'
require 'rubygems'
require 'tweetstream'
require 'yajl'
require 'uri'
require 'json'

username = 'banjoproject1'
password = 'banjoproject'

TweetStream.configure do |config|
  config.username = username
  config.password = password
  config.auth_method = :basic
  config.parser   = :yajl
end

def get_tweet
  user_tweet = nil
  TweetStream::Client.new.locations('-180,-90,180,90') do |status, client|
    user_tweet = status
    client.stop if user_tweet
  end
  user_tweet
end

describe Tweet do
  
  before :each do
    @tweet = get_tweet
  end

  it { should embed_one :geo }

  it { should have_index_for("geo.coordinates") }

  it "should be geo-tagged" do
    assert @tweet.geo.coordinates.is_a? Array
  end

  it "should have tweet-text" do
    assert_not_nil @tweet.text
  end

  it "should have tweet-text <140 chars" do
    assert(@tweet.text.length < 140)
  end

  it "should be have a User" do
    assert_not_nil @tweet.user
  end

end

describe Geo do
 
  it { should have_field(:coordinates).of_type(Array) }

end

describe DisplayController do
  render_views

  describe "GET 'home'" do
    it "should be successful" do
      get 'home'
      response.should be_success
    end
  
    it "should have the right title" do
      get 'home'
      response.should have_selector("title",
               :content => "Tweets Around")
    end
    
    it "should have a non-blank body" do
      get 'home'
      response.body.should_not =~ /<body>\s*<\/body>/
    end
  end
end