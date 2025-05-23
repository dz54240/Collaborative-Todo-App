class TodosChannel < ApplicationCable::Channel
  def subscribed
    stream_from "todos_channel"
  end

  def unsubscribed
    # Očisti resurse kada se odspoji
  end
end
