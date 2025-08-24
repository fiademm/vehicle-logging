import { supabase } from '../db';

describe('Database Connection', () => {
  it('should connect to the database and fetch data', async () => {
    const { data, error } = await supabase.from('users').select('*').limit(1);

    // We expect the error to be null, but the data might be empty if the table is empty.
    // So, we just check if the error is null.
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});