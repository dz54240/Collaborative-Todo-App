class CreateInvites < ActiveRecord::Migration[7.1]
  def change
    create_table :invites do |t|
      t.belongs_to :sender, foreign_key: { to_table: :users }, index: true, null: false
      t.belongs_to :receiver, foreign_key: { to_table: :users }, index: true, null: false
      t.belongs_to :workspace, foreign_key: true, index: true, null: false
      t.string :status, null: false, default: 'pending'
      t.timestamps
    end
  end
end
