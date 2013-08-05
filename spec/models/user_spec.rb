require 'spec_helper'

# describe User do
#   before(:all) do
#     User.delete_all
#   end

#   context "user email already exists in the database" do
#     let(:user) { User.find_or_create_by_email(email: "foo@bar.com") }

#     it "should return user with input email without creating new user" do
#       expect(User.return_user_from_email("foo@bar.com")).to eq(user)
#     end

#     it "should not increase the total number of users" do
#       expect(User.return_user_from_email("foo@bar.com")).to_not change(User.count)
#     end
#   end
# end