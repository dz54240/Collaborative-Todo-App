# frozen_string_literal: true

module ModelFormProcessor
  extend ActiveSupport::Concern

  def save_record(params, model_instance = nil)
    form = build_form(model_instance)
    if form.validate(params)
      form.save
      render_json(form.model)
    else
      render_json_bad_request(format_errros(form.errors))
    end
  end

  def create_and_save(params)
    save_record(params)
  end

  def update_and_save(params, instance)
    save_record(params, instance)
  end

  private

  def format_errros(errors)
    errors.to_hash(true).transform_values do |value|
      value.map(&:capitalize)
    end
  end

  def build_form(model_instance = nil)
    if context_forms.include?(form_name)
      form_name.new(model_instance || authorize(model.new), current_user)
    else
      form_name.new(model_instance || authorize(model.new))
    end
  end

  def context_forms
    [WorkoutForm, FeedbackForm, ExerciseForm]
  end

  def form_name
    controller_name.classify.concat('Form').constantize
  end

  def model
    controller_name.classify.constantize
  end
end
