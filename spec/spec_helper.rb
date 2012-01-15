# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'rspec/autorun'
require 'webrat'
require 'webrat/core/matchers'

# Rails3 & Webrat config
Webrat.configure do |config|
  config.mode = :rack
  config.open_error_files = false
end

#put this in your spec_helper.rb if you're using Rails 3, Rspec2, Mongoid, and #ActiveRecord together until the "real" fix comes along
class RSpec::Core::Configuration
  attr_accessor :fixture_path, :use_transactional_fixtures

  def fixture_path=(path)
    @fixture_path = path
  end

  def use_transactional_fixtures=(bool)
    @use_transactional_fixtures = bool
  end
end

class RSpec::Core::ExampleGroup
  def fixture_path
    RSpec.configuration.fixture_path
  end
end

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}

RSpec.configure do |config|
  # == Mock Framework
  #
  # If you prefer to use mocha, flexmock or RR, uncomment the appropriate line:
  #
  # config.mock_with :mocha
  # config.mock_with :flexmock
  # config.mock_with :rr
  config.mock_with :rspec

  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_path = "#{::Rails.root}/spec/fixtures"

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # If true, the base class of anonymous controllers will be inferred
  # automatically. This will be the default behavior in future versions of
  # rspec-rails.
  config.infer_base_class_for_anonymous_controllers = false

  # mongoid-rspec matchers
  config.include Mongoid::Matchers

  # Rspec2 and Rails3 issue - workaround
  config.include RSpec::Rails::ControllerExampleGroup

  # Rspec and Webrat
  config.include Webrat::HaveTagMatcher

end
