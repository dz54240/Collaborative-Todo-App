class CreateUserWorkspaces < ActiveRecord::Migration[7.1]
  def change
    create_table :user_workspaces do |t|
      t.belongs_to :user, foreign_key: true, index: true, null: false
      t.belongs_to :workspace, foreign_key: true, index: true, null: false
      t.boolean :admin
      t.timestamps
    end
  end
end
