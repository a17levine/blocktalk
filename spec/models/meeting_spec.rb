require 'spec_helper'

describe Meeting do
  let(:meeting) { Meeting.create_meeting('foo@bar.com', ["2013-08-05T10:28:01-05:00"]) }

  context "the meeting was created properly" do
    it "creates a user with the appropriate email" do
      expect(meeting.users.last.email).to eq("foo@bar.com")
    end

    it "creates a meeting with planned=false on that meeting" do
      expect(meeting.planned).to eq(false)
    end

    it "the host of the meeting is the person who created the meeting" do
      expect(meeting.host).to eq(User.find_by_email('foo@bar.com'))
    end
  end
end