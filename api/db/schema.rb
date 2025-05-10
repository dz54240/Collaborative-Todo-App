# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_05_09_224541) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "invites", force: :cascade do |t|
    t.bigint "sender_id", null: false
    t.bigint "receiver_id", null: false
    t.bigint "workspace_id", null: false
    t.string "status", default: "pending", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["receiver_id"], name: "index_invites_on_receiver_id"
    t.index ["sender_id"], name: "index_invites_on_sender_id"
    t.index ["workspace_id"], name: "index_invites_on_workspace_id"
  end

  create_table "sections", force: :cascade do |t|
    t.string "name", null: false
    t.integer "position", default: 0
    t.bigint "workspace_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["workspace_id"], name: "index_sections_on_workspace_id"
  end

  create_table "todos", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.string "status", default: "todo", null: false
    t.string "priority", default: "low", null: false
    t.date "due_date"
    t.bigint "section_id", null: false
    t.bigint "assignee_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "created_by_id"
    t.bigint "updated_by_id"
    t.index ["assignee_id"], name: "index_todos_on_assignee_id"
    t.index ["created_by_id"], name: "index_todos_on_created_by_id"
    t.index ["section_id"], name: "index_todos_on_section_id"
    t.index ["updated_by_id"], name: "index_todos_on_updated_by_id"
  end

  create_table "user_workspaces", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "workspace_id", null: false
    t.boolean "admin"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["admin"], name: "index_user_workspaces_on_admin"
    t.index ["user_id", "workspace_id"], name: "index_user_workspaces_on_user_id_and_workspace_id", unique: true
    t.index ["user_id"], name: "index_user_workspaces_on_user_id"
    t.index ["workspace_id"], name: "index_user_workspaces_on_workspace_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name"
    t.string "email", null: false
    t.string "password_digest"
    t.string "token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["token"], name: "index_users_on_token", unique: true
  end

  create_table "workspaces", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "invites", "users", column: "receiver_id"
  add_foreign_key "invites", "users", column: "sender_id"
  add_foreign_key "invites", "workspaces"
  add_foreign_key "sections", "workspaces"
  add_foreign_key "todos", "sections"
  add_foreign_key "todos", "users", column: "assignee_id"
  add_foreign_key "todos", "users", column: "created_by_id"
  add_foreign_key "todos", "users", column: "updated_by_id"
  add_foreign_key "user_workspaces", "users"
  add_foreign_key "user_workspaces", "workspaces"
end
