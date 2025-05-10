# frozen_string_literal: true

class AddCreatedByAndUpdatedByToTodos < ActiveRecord::Migration[7.1]
  def change
    add_reference :todos, :created_by, foreign_key: { to_table: :users }, index: true
    add_reference :todos, :updated_by, foreign_key: { to_table: :users }, index: true
  end
end
