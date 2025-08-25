import { supabase } from '../db';

export interface VehicleType {
  id: number;
  name: string;
  color: string;
}

export const VehicleTypeModel = {
  async getAll(): Promise<VehicleType[]> {
    const { data, error } = await supabase.from('vehicle_types').select('*');
    if (error) throw error;
    return data;
  },

  async getById(id: number): Promise<VehicleType | null> {
    const { data, error } = await supabase.from('vehicle_types').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async create(name: string, color: string): Promise<VehicleType> {
    const { data, error } = await supabase.from('vehicle_types').insert([{ name, color }]).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: number, name: string, color: string): Promise<VehicleType | null> {
    const { data, error } = await supabase.from('vehicle_types').update({ name, color }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase.from('vehicle_types').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};