import { supabase } from '../db';

export interface VehicleLog {
  id: number;
  vehicle_type_id: number;
  entry_time: Date;
  exit_time: Date | null;
  logged_by: number;
  license_plate: string | null;
  notes: string | null;
  is_deleted: boolean;
  duration: number | null;
  parking_fee: number | null;
  timezone: string | null;
}

export const VehicleLogModel = {
  async create(log: Omit<VehicleLog, 'id' | 'is_deleted' | 'duration' | 'parking_fee' | 'timezone' | 'exit_time'>): Promise<VehicleLog> {
    const { data, error } = await supabase
      .from('vehicle_logs')
      .insert([log])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async findById(id: number): Promise<VehicleLog | null> {
    const { data, error } = await supabase
      .from('vehicle_logs')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();
    if (error) throw error;
    return data;
  },

  async updateExitTime(id: number, exit_time: Date, duration: number, parking_fee: number, timezone: string): Promise<VehicleLog | null> {
    const { data, error } = await supabase
      .from('vehicle_logs')
      .update({ exit_time, duration, parking_fee, timezone })
      .eq('id', id)
      .eq('is_deleted', false)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async softDelete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('vehicle_logs')
      .update({ is_deleted: true })
      .eq('id', id)
      .is('exit_time', null);
    if (error) throw error;
    return true;
  },

  async findActive(): Promise<VehicleLog[]> {
    const { data, error } = await supabase
      .from('vehicle_logs')
      .select('*')
      .is('exit_time', null)
      .eq('is_deleted', false)
      .order('entry_time', { ascending: false });
    if (error) throw error;
    return data;
  },

  async findWithFilters(filters: { startDate?: string; endDate?: string; vehicleType?: number, page?: number, limit?: number, search?: string }): Promise<VehicleLog[]> {
    let query = supabase
      .from('vehicle_logs')
      .select('*')
      .eq('is_deleted', false);

    if (filters.startDate) {
      query = query.gte('entry_time', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('entry_time', filters.endDate);
    }

    if (filters.vehicleType) {
      query = query.eq('vehicle_type_id', filters.vehicleType);
    }

    if (filters.search) {
      query = query.or(`license_plate.ilike.%${filters.search}%,notes.ilike.%${filters.search}%`);
    }

    query = query.order('entry_time', { ascending: false });

    if (filters.limit && filters.page) {
        const offset = (filters.page - 1) * filters.limit;
        query = query.range(offset, offset + filters.limit - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};