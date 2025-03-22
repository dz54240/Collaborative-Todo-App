# frozen_string_literal: true

# == Schema Information
#
# Table name: sections
#
#  id           :bigint           not null, primary key
#  name         :string           not null
#  position     :integer          default(0)
#  workspace_id :bigint           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class Section < ApplicationRecord
  belongs_to :workspace

  validates :name, presence: true, length: { minimum: 1 }
  validates :position, presence: true, numericality: { greater_than_or_equal_to: 0 }
end
