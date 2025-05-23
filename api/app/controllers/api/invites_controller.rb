# frozen_string_literal: true

module Api
  class InvitesController < ApplicationController
    before_action :authenticate_user
    before_action :preload_resource, only: [:accept, :reject, :destroy]
    before_action :create_resource, only: [:create]

    def index
      render_json(policy_scope(Invite.includes(:workspace)))
    end

    def create
      save_record(create_params)
    end

    def accept
      render_json(invite_acceptor.accept)
    end

    def reject
      @resource.update(status: 'rejected')

      render_json(@resource)
    end

    def destroy
      @resource.destroy

      head :no_content
    end

    private

    def includes
      [:workspace, :receiver, :sender]
    end

    def invite_acceptor
      @invite_acceptor ||= Invites::InviteAcceptor.new(@resource, current_user)
    end

    def saver(params)
      @saver ||= Base::InviteSaver.new(@resource || @new_resource, params, current_user)
    end
  end
end
