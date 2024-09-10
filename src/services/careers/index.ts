import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Make sure this key is properly set
if (!supabaseUrl || !supabaseKey) {
  throw new Error('supabaseUrl and supabaseKey are required.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getOpenJobPostings() {
  try {
    const { data, error } = await supabase
      .from('jobapplications') // Replace with your actual table name
      .select('*')
      .eq('is_open', true);

    if (error) {
      throw new Error(`Error fetching open job postings: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
