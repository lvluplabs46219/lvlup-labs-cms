module Api
  module V1
    class HorsesController < BaseController
      before_action :set_horse, only: %i[show]

      # GET /api/v1/horses
      # Query params: status, sex, breed, page, per_page
      def index
        horses = @organization.horses
                               .order(created_at: :desc)

        horses = horses.where(status: params[:status]) if params[:status].present?
        horses = horses.where(sex: params[:sex])       if params[:sex].present?
        horses = horses.where(breed: params[:breed])   if params[:breed].present?

        render json: {
          data: horses.map { |h| horse_json(h) },
          meta: { total: horses.count }
        }
      end

      # GET /api/v1/horses/:slug
      def show
        render json: { data: horse_json(@horse, detailed: true) }
      end

      private

      def set_horse
        @horse = @organization.horses.find_by!(slug: params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Horse not found" }, status: :not_found
      end

      def horse_json(horse, detailed: false)
        base = {
          id:            horse.id,
          slug:          horse.slug,
          name:          horse.name,
          registry_id:   horse.registry_id,
          breed:         horse.breed,
          color:         horse.color,
          sex:           horse.sex,
          foaled_year:   horse.foaled_year,
          status:        horse.status,
          price_display: horse.price_display,
          hero_image_url: horse.hero_image_url,
          created_at:    horse.created_at
        }

        if detailed
          base.merge!(
            description: horse.description,
            pedigree:    horse.horse_pedigree && pedigree_json(horse.horse_pedigree),
            documents:   horse.horse_documents.map { |d| { id: d.id, type: d.type, title: d.title } }
          )
        end

        base
      end

      def pedigree_json(pedigree)
        {
          id:                    pedigree.id,
          sire_name:             pedigree.sire_name,
          sire_registry_id:      pedigree.sire_registry_id,
          dam_name:              pedigree.dam_name,
          dam_registry_id:       pedigree.dam_registry_id,
          lineage:               pedigree.lineage,
          mint_status:           pedigree.mint_status,
          token_id:              pedigree.token_id,
          contract_address:      pedigree.contract_address,
          chain_id:              pedigree.chain_id,
          metadata_uri:          pedigree.metadata_uri,
          source_document_cid:   pedigree.source_document_cid,
          source_document_sha256: pedigree.source_document_sha256
        }
      end
    end
  end
end
