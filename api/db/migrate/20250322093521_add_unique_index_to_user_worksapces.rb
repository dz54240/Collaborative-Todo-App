class AddUniqueIndexToUserWorksapces < ActiveRecord::Migration[7.1]
  def up
    add_index :user_workspaces, [:user_id, :workspace_id], unique: true, name: 'index_user_workspaces_on_user_id_and_workspace_id'
    add_index :user_workspaces, :admin
  end

  def down
    remove_index :user_workspaces, name: 'index_user_workspaces_on_user_id_and_workspace_id'
    remove_index :user_workspaces, :admin
  end
end
