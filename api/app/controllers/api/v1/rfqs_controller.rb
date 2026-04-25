module Api
  module V1
    class RfqsController < BaseController
      skip_before_action :authenticate_request!   # RFQ form is public

      # POST /api/v1/rfqs
      def create
        rfq = @organization.rfqs.build(rfq_params)

        if rfq.save
          # TODO: enqueue RFQ notification mailer via Sidekiq
          # RfqNotificationJob.perform_later(rfq.id)
          render json: { data: rfq_json(rfq) }, status: :created
        else
          render json: { errors: rfq.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/rfqs (staff only — requires auth)
      def index
        authenticate_request!
        return if performed?

        rfqs = @organization.rfqs.order(created_at: :desc)
        rfqs = rfqs.where(status: params[:status]) if params[:status].present?
        rfqs = rfqs.aog                             if params[:aog] == "true"

        render json: {
          data: rfqs.map { |r| rfq_json(r) },
          meta: { total: rfqs.count }
        }
      end

      private

      def rfq_params
        params.require(:rfq).permit(
          :company_name, :contact_name, :email, :phone,
          :message, :is_aog, :source,
          line_items_attributes: %i[part_number quantity condition_requested notes]
        )
      end

      def rfq_json(rfq)
        {
          id:           rfq.id,
          status:       rfq.status,
          source:       rfq.source,
          company_name: rfq.company_name,
          contact_name: rfq.contact_name,
          email:        rfq.email,
          is_aog:       rfq.is_aog,
          line_items:   rfq.rfq_line_items.map { |li|
            { part_number: li.part_number, quantity: li.quantity,
              condition_requested: li.condition_requested }
          },
          created_at:   rfq.created_at
        }
      end
    end
  end
end
