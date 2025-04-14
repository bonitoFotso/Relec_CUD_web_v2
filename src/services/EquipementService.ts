/* eslint-disable @typescript-eslint/no-explicit-any */
// api/equipement.service.ts
import apiClient from "./apiClient";

export interface EquipementStreetlights {
  [x: string]: number;
  id: number;
  power: number;
  is_on_day: number;
  is_on_night: number;
  on_time: string;
  off_time: string;
  photo: string;
  location: string;
  lamp_count: number;
  streetlight_type: string;
  qrcode_id: number;
  network_id: number;
  orientation_id: string;
  track_id: number;
  command_type_id: number;
  support_type_id: number;
  support_condition_id: number;
  created_at: string;
  updated_at: string;
  meter_id?: number;
  municipality_id: number;
  cabinet_id?: number;
  streelight_type: string;
  network: string;
  orientation: string;
  track: string;
  command_type: string;
  support_type: string;
  support_condition: string;
  municipality: string;
  lamps: lamp[];
}
export interface lamp {
  id: number;
  streelight_id: number;
  lamp_type_id: number;
  color_id: number;
  has_lamp: number;
  power: number;
  is_on_day: number;
  is_on_night: number;
  with_balast: boolean;
  created_at: string;
  updated_at: string;
  lamp_type: string;
  lamp_color: string;
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

  updateStreetlightLocation: async (
    id: number,
    location: string
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("id", id.toString());
    formData.append("location", location); // format : "latitude,longitude"

    const { data } = await apiClient.post(
      "/interventions/streetlight/update-location",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  },

  updateMeterLocation: async (id: number, location: string): Promise<any> => {
    const formData = new FormData();
    formData.append("id", id.toString());
    formData.append("location", location); // format : "latitude,longitude"

    const { data } = await apiClient.post(
      "/interventions/meter/update-location",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("voici les datas", data);

    return data;
  },
};

export default EquipementService;
