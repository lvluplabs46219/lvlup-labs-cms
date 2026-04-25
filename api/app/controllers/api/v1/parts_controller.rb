module Api
  module V1
    class PartsController < BaseController
      # GET /api/v1/parts
      # Query params: q (part number or nomenclature), ata_chapter, easa, caac,
      #               der_available, page, per_page
      def index
        parts = @organization.parts.active.order(:part_number)

        # Full-text search on part_number + nomenclature
        if params[:q].present?
          q = "%#{params[:q].upcase}%"
          parts = parts.where(
            "UPPER(part_number) LIKE :q OR UPPER(nomenclature) LIKE :q",
            q: q
          )
        end

        parts = parts.by_ata(params[:ata_chapter])   if params[:ata_chapter].present?
        parts = parts.easa                            if params[:easa] == "true"
        parts = parts.caac                            if params[:caac] == "true"
        parts = parts.der_available                   if params[:der_available] == "true"

        render json: {
          data: parts.map { |p| part_json(p) },
          meta: { total: parts.count }
        }
      end

      # GET /api/v1/parts/:id
      def show
        part = @organization.parts.find(params[:id])
        inventory = part.inventory_items.available.map { |i| inventory_item_json(i) }

        render json: {
          data: part_json(part).merge(inventory_items: inventory)
        }
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Part not found" }, status: :not_found
      end

      private

      def part_json(part)
        {
          id:            part.id,
          part_number:   part.part_number,
          nomenclature:  part.nomenclature,
          ata_number:    part.ata_number,
          ata_chapter:   part.ata_chapter,
          manufacturer:  part.manufacturer,
          description:   part.description,
          easa:          part.easa,
          caac:          part.caac,
          der_available: part.der_available
        }
      end

      def inventory_item_json(item)
        {
          id:            item.id,
          serial_number: item.serial_number,
          condition:     item.condition,
          status:        item.status,
          location:      item.location,
          price_cents:   item.price_cents,
          price_on_request: item.price_on_request,
          shelf_life:    item.shelf_life
        }
      end
    end
  end
end
