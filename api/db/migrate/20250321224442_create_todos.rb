class CreateTodos < ActiveRecord::Migration[7.1]
  def change
    create_table :todos do |t|
      t.string :title, null: false
      t.text :description
      t.string :status, null: false, default: 'todo'
      t.string :priority, null: false, default: 'low'
      t.date :due_date
      t.belongs_to :section, foreign_key: true, index: true, null: false
      t.belongs_to :assignee, foreign_key: { to_table: :users }, index: true
      t.timestamps
    end
  end
end
