/* eslint-disable @typescript-eslint/no-explicit-any */
// api/equipement.service.ts
import apiClient from "./apiClient";

export interface EquipementStreetlights {
  [x: string]: any;
  brightness_level: number;
  on_time: number;
  off_time: number;
  id: number;
  power: number;
  is_on_day: number;
  is_on_night: number;
  photo: string;
  location: string;
  lamp_count: number;
  streetlight_type_id: number;
  qrcode_id: number;
  network_id: number;
  orientation_id: number;
  track_id: number;
  command_type_id: number;
  support_type_id: number;
  support_condition_id: number;
  created_at: string;
  updated_at: string;
  meter_id?: number;
  municipality_id: number;
  cabinet_id?: number;
  streetlight_type: string;
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
  streetlight_id: number;
  lamp_type_id: number;
  color_id: number;
  has_lamp: number;
  power: number;
  is_on_day: number;
  is_on_night: number;
  with_balast: number;
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
  municipality: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  street:{
    id:number;
    municipality_id:number;
    name:string;
    created_at: string;
    updated_at: string;
  };
  substation?: string;
  cabinet_id?: number;
  street_id: number;
}

export interface EquipementCabinets {
  id: number;
  qrcode_id: number;
  photo: string;
  is_present: number;
  is_functional: number;
  lamp_count: number;
  location: string;
  created_at?: string;
  updated_at?: string;
  meter_id?: number;
  substation_id?: number;
  municipality_id: number;
  municipality: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  street_id: number;
  
}


export interface EquipementSubstations {
  id: number;
  qrcode_id: number;
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
    console.log("lampadaires")
    const { data } = await apiClient.get("/equipments/get-all-streetlights");
    console.log(data.data)
    return data.data || [];
  },

  getAllMetters: async (): Promise<EquipementMetters[]> => {
    const { data } = await apiClient.get("/equipments/get-all-meters");
    console.log("compteurs",data.data)
    return data.data || [];
  },

  getAllCabinets: async (): Promise<EquipementCabinets[]> => {
    const { data } = await apiClient.get("/equipments/get-all-cabinets");
    console.log("armoires",data.data)
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
  updateCabinetLocation: async (id: number, location: string): Promise<any> => {
    const formData = new FormData();
    formData.append("id", id.toString());
    formData.append("location", location); // format : "latitude,longitude"

    const { data } = await apiClient.post(
      "/interventions/cabinet/update-location",
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
  updateSubstationLocation: async (
    id: number,
    location: string
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("id", id.toString());
    formData.append("location", location); // format : "latitude,longitude"

    const { data } = await apiClient.post(
      "interventions/substation/update-location",
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
