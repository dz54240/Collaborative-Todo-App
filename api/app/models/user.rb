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

  validates :first_name, presence: true, length: { minimum: 2 }
  validates :email, presence: true, uniqueness: { case_sensitive: false }

  default_scope { order(email: :asc) }
  scope :by_email, ->(email) { where('email ILIKE ?', "%#{email}%") }
end
