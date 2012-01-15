require 'spec_helper'

describe "LayoutLinks" do

  it "should have the right links on landing page" do
    visit root_path
    response.should have_selector('title', 
              :content => "Tweets Around")
    click_link "source on GitHub"
    response.should have_selector('title', 
                         :key => "atajwala")
  end

end
