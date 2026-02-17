import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hnujnpucsrmhlvpicakz.supabase.co';

/**
 * UPDATED WITH NEW PROJECT CREDENTIALS
 * Project ID: hnujnpucsrmhlvpicakz
 */
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudWpucHVjc3JtaGx2cGljYWt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExODY4MjcsImV4cCI6MjA4Njc2MjgyN30.IScAPU1X-CAbTiTqqpFW-T91ZfTCzRgNZ1UiFQPYJgU'; 

export const supabase = createClient(supabaseUrl, supabaseKey);