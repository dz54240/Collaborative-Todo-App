# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    owned?
  end

  def create?
    true
  end

  def update?
    owned?
  end

  def destroy?
    owned?
  end

  def permitted_attributes
    [:email, :first_name, :last_name, :password]
  end

  class Scope < Scope
    def resolve
      scope.where(id: user.id)
    end
  end

  private

  def owned?
    record.id == user.id
  end
end
