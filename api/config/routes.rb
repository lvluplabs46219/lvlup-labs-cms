Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # --- Bear Creek domain -------------------------------------------
      resources :horses,  only: %i[index show], param: :slug

      # --- PerformAir domain -------------------------------------------
      resources :parts,   only: %i[index show]
      resources :rfqs,    only: %i[index create]

      # --- Health check ------------------------------------------------
      get "health", to: proc { [200, {}, [{ status: "ok" }.to_json]] }
    end
  end
end
