class CreateSections < ActiveRecord::Migration[7.1]
  def change
    create_table :sections do |t|
      t.string :name, null: false
      t.integer :position, default: 0
      t.belongs_to :workspace, foreign_key: true, index: true, null: false
      t.timestamps
    end
  end
end
