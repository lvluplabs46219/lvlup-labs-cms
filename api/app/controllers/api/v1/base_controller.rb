module Api
  module V1
    class BaseController < ApplicationController
      # Resolve organization from subdomain or header
      # X-Organization-Slug: bear-creek  (or ?org=bear-creek for dev)
      before_action :set_organization

      private

      def set_organization
        slug = request.headers["X-Organization-Slug"] ||
               params[:org] ||
               (Rails.env.development? ? ENV.fetch("DEFAULT_ORG_SLUG", nil) : nil)

        @organization = Organization.active.find_by(slug: slug)
        render json: { error: "Organization not found" }, status: :not_found unless @organization
      end

      def pagination_meta(collection)
        {
          current_page: collection.current_page,
          total_pages:  collection.total_pages,
          total_count:  collection.total_count,
          per_page:     collection.limit_value
        }
      end
    end
  end
end
