class SectionsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "sections_channel"
  end

  def unsubscribed
    # Očisti resurse kada se odspoji
  end
end
