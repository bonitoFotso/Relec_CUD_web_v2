// api/equipement.service.ts
import apiClient from "./apiClient";

export interface EquipementStreetlights {
  color: string;
  color_id: number;
  command_type: string;
  command_type_id: number;
  created_at: string;
  has_lamp: number;
  id: number;
  is_on_day: number;
  is_on_night: number;
  lamp_type: string;
  lamp_type_id: number;
  location: string;
  municipality: string;
  municipality_id: number;
  network: string;
  network_id: number;
  orientation: string;
  orientation_id: number;
  photo: string;
  power: number;
  qrcode_id: number;
  streetlight_type: string;
  streetlight_type_id: number;
  support_condition: string;
  support_condition_id: number;
  support_type: string;
  support_type_id: number;
  track: string;
  track_id: number;
  updated_at: string;
  with_balast: string;
}

export interface EquipementMetters {
  id: number;
  substation_id?: number;
  is_present: number;
  meter_type_id: number;
  qrcode_id: number;
  photo: string;
  number: string;
  xy_coordinates: string;
  brand: string;
  model: string;
  is_mounted: number;
  location: string;
  created_at: string;
  updated_at: string;
  municipality_id: number;
  meter_type: {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  municipality: {
    id: 2;
    name: string;
    created_at: string;
    updated_at: string;
  };
  substation?: string;
}

export interface EquipementCabinets {
  id: 1;
  qrcode_id: 28;
  photo: string;
  is_present: 1;
  is_functional: 1;
  lamp_count: 12;
  location: string;
  created_at: string;
  updated_at: string;
  municipality_id: 2;
  municipality: {
    id: 2;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

export interface EquipementSubstations {
  id: 1;
  qrcode_id: 33;
  photo: string;
  name: string;
  number: string;
  xy_coordinates: string;
  location: string;
  popular_landmark: string;
  block_route_number: string;
  created_at: string;
  updated_at: string;
  municipality_id: number;
  municipality: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
}


export const EquipementService = {
  getAllStreetlights: async (): Promise<EquipementStreetlights[]> => {
    const { data } = await apiClient.get("/equipments/get-all-streetlights");
    console.log(data.data)
    return data.data || [];
  },

  getAllMetters: async (): Promise<EquipementMetters[]> => {
    const { data } = await apiClient.get("/equipments/get-all-meters");
    return data.data || [];
  },

  getAllCabinets: async (): Promise<EquipementCabinets[]> => {
    const { data } = await apiClient.get("/equipments/get-all-cabinets");
    return data.data || [];
  },

  getAllSubstations: async (): Promise<EquipementSubstations[]> => {
    const { data } = await apiClient.get("/equipments/get-all-substations");
    return data.data || [];
  },

  updateStreetlightLocation: async (id: number, location: string): Promise<any> => {
    const formData = new FormData();
    formData.append("id", id.toString());
    formData.append("location", location); // format : "latitude,longitude"
  
    const { data } = await apiClient.post("/interventions/streetlight/update-location", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  
    return data;
  },
  

};

export default EquipementService;
