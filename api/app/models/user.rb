# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  first_name      :string           not null
#  last_name       :string
#  email           :string           not null
#  password_digest :string
#  token           :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
class User < ApplicationRecord
  has_secure_password
  has_secure_token

  has_many :sent_invites, class_name: 'Invite', foreign_key: 'sender_id', inverse_of: :sender, dependent: :destroy
  has_many :received_invites, class_name: 'Invite', foreign_key: 'receiver_id', inverse_of: :receiver, dependent: :destroy
  has_many :user_workspaces, dependent: :destroy, inverse_of: :user
  has_many :workspaces, through: :user_workspaces
  has_many :todos, dependent: :nullify, inverse_of: :assignee

  validates :first_name, presence: true, length: { minimum: 1 }
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates_email_format_of :email, message: 'is invalid'

  default_scope { order(email: :asc) }
  scope :by_email, ->(email) { where('email ILIKE ?', "%#{email}%") }

  # before_destroy :handle_admin_workspaces

  def owned_workspaces
    workspaces.merge(UserWorkspace.where(admin: true))
  end

  def joined_workspaces
    workspaces.merge(UserWorkspace.where(admin: false))
  end

  # def handle_admin_workspaces
  #   user_workspaces.where(admin: true).find_each do |uw|
  #     workspace = uw.workspace

  #     other_uws = workspace.user_workspaces.where.not(user_id: id)

  #     if other_uws.any?
  #       other_uws.first.update(admin: true)
  #     else
  #       workspace.destroy
  #     end
  #   end
  # end
end
