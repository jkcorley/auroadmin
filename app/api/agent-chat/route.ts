import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Example: Add Laundromat (expand as needed)
async function addLaundromat({ name, address, borough, phone }: { name: string; address: string; borough: string; phone?: string }) {
  const { data, error } = await supabase
    .from('participating_laundromats')
    .insert([{ name, address, borough, phone }])
    .select()
    .single();

  if (error) throw new Error(`Failed to add laundromat: ${error.message}`);
  return `Laundromat "${name}" at ${address} (${borough}) added successfully.`;
}

// Example: Get Offline Machines
async function getOfflineMachines(_: Record<string, unknown> = {}) {
  const { data, error } = await supabase
    .from('machines')
    .select('machine_id, machine_type, participating_laundromats(name)')
    .eq('current_status', 'Offline');

  if (error) throw new Error(`Failed to get offline machines: ${error.message}`);
  return `Found ${data.length} offline machines: ${data.map(m => m.machine_id).join(', ')}`;
}

// --- Function Implementations ---
async function addMachine({ machine_id, laundromat_id, machine_type, current_status }: { machine_id: string; laundromat_id: string; machine_type: string; current_status?: string }) {
  const { data, error } = await supabase
    .from('machines')
    .insert([{ 
      machine_id, 
      laundromat_id, 
      machine_type, 
      current_status: current_status || 'Available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw new Error(`Failed to add machine: ${error.message}`);
  return `Machine "${machine_id}" (${machine_type}) added to laundromat ${laundromat_id}.`;
}

async function addUser({ full_name, email, phone }: { full_name: string; email: string; phone?: string }) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ full_name, email, phone }])
    .select()
    .single();

  if (error) throw new Error(`Failed to add user: ${error.message}`);
  return `User "${full_name}" (${email}) added successfully.`;
}

async function addDriver({ full_name, phone, email }: { full_name: string; phone: string; email?: string }) {
  const { data, error } = await supabase
    .from('drivers')
    .insert([{ full_name, phone, email }])
    .select()
    .single();

  if (error) throw new Error(`Failed to add driver: ${error.message}`);
  return `Driver "${full_name}" (${phone}) added successfully.`;
}

async function getPendingBookings(_: Record<string, unknown> = {}) {
  const { data, error } = await supabase
    .from('bookings')
    .select('booking_id, status, users(full_name)')
    .eq('status', 'Pending');

  if (error) throw new Error(`Failed to get pending bookings: ${error.message}`);
  return `Found ${data.length} pending bookings: ${data.map(b => b.booking_id).join(', ')}`;
}

async function getSystemHealth(_: Record<string, unknown> = {}) {
  // Check various system components
  const [
    machinesStatus,
    bookingsStatus,
    usersStatus,
    driversStatus
  ] = await Promise.all([
    supabase.from('machines').select('current_status').limit(1),
    supabase.from('bookings').select('status').limit(1),
    supabase.from('users').select('id').limit(1),
    supabase.from('drivers').select('id').limit(1)
  ]);

  const allHealthy = !machinesStatus.error && !bookingsStatus.error && 
                    !usersStatus.error && !driversStatus.error;

  return allHealthy 
    ? 'System is healthy. All services operational.'
    : 'System issues detected. Some services may be degraded.';
}

async function triggerSelfHealing(_: Record<string, unknown> = {}) {
  // 1. Check for machines stuck in "In Use" for too long
  const { data: stuckMachines, error: stuckError } = await supabase
    .from('machines')
    .update({ current_status: 'Available' })
    .eq('current_status', 'In Use')
    .lt('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .select();

  // 2. Check for stale bookings
  const { data: staleBookings, error: staleError } = await supabase
    .from('bookings')
    .update({ status: 'Cancelled' })
    .eq('status', 'Pending')
    .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .select();

  if (stuckError || staleError) {
    throw new Error('Failed to complete self-healing routine');
  }

  return `Self-healing complete. Reset ${stuckMachines?.length || 0} stuck machines and ${staleBookings?.length || 0} stale bookings.`;
}

// Add new functions for analytics and reporting
async function getMachineAnalytics(_: Record<string, unknown> = {}) {
  const { data, error } = await supabase
    .from('machines')
    .select('current_status')
    .then(({ data }) => {
      const statusCounts = data.reduce((acc, machine) => {
        acc[machine.current_status] = (acc[machine.current_status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return { data: statusCounts, error: null };
    });

  if (error) throw new Error(`Failed to get machine analytics: ${error.message}`);
  return `Machine Status Distribution: ${Object.entries(data).map(([status, count]) => `${status}: ${count}`).join(', ')}`;
}

async function getRevenueAnalytics(_: Record<string, unknown> = {}) {
  const { data, error } = await supabase
    .from('machines')
    .select('average_monthly_revenue')
    .not('average_monthly_revenue', 'is', null);

  if (error) throw new Error(`Failed to get revenue analytics: ${error.message}`);
  
  const totalRevenue = data.reduce((sum, machine) => sum + (machine.average_monthly_revenue || 0), 0);
  const avgRevenue = totalRevenue / (data.length || 1);
  
  return `Total Monthly Revenue: $${totalRevenue.toFixed(2)}, Average per Machine: $${avgRevenue.toFixed(2)}`;
}

// --- Function Definitions for OpenAI ---
const functions = [
  {
    name: 'addLaundromat',
    description: 'Add a new laundromat to the system',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name of the laundromat' },
        address: { type: 'string', description: 'Address of the laundromat' },
        borough: { type: 'string', description: 'Borough' },
        phone: { type: 'string', description: 'Phone number' },
      },
      required: ['name', 'address', 'borough'],
    },
  },
  {
    name: 'addMachine',
    description: 'Add a new machine to a laundromat',
    parameters: {
      type: 'object',
      properties: {
        machine_id: { type: 'string', description: 'Machine ID' },
        laundromat_id: { type: 'string', description: 'Laundromat ID' },
        machine_type: { type: 'string', description: 'Type of machine (e.g., Washer, Dryer)' },
        current_status: { type: 'string', description: 'Current status (e.g., Available, In Use)' },
      },
      required: ['machine_id', 'laundromat_id', 'machine_type'],
    },
  },
  {
    name: 'addUser',
    description: 'Add a new user to the system',
    parameters: {
      type: 'object',
      properties: {
        full_name: { type: 'string', description: 'Full name' },
        email: { type: 'string', description: 'Email address' },
        phone: { type: 'string', description: 'Phone number' },
      },
      required: ['full_name', 'email'],
    },
  },
  {
    name: 'addDriver',
    description: 'Add a new driver to the system',
    parameters: {
      type: 'object',
      properties: {
        full_name: { type: 'string', description: 'Full name' },
        phone: { type: 'string', description: 'Phone number' },
        email: { type: 'string', description: 'Email address' },
      },
      required: ['full_name', 'phone'],
    },
  },
  {
    name: 'getOfflineMachines',
    description: 'Get a list of all offline machines',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'getPendingBookings',
    description: 'Get a list of all pending bookings',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'getSystemHealth',
    description: 'Get the current health status of the system',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'triggerSelfHealing',
    description: 'Trigger the self-healing routine to resolve operational issues',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'getMachineAnalytics',
    description: 'Get analytics about machine status distribution',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'getRevenueAnalytics',
    description: 'Get revenue analytics across all machines',
    parameters: { type: 'object', properties: {} },
  },
];

const functionMap: Record<string, (args: any) => Promise<string>> = {
  addLaundromat,
  addMachine,
  addUser,
  addDriver,
  getOfflineMachines,
  getPendingBookings,
  getSystemHealth,
  triggerSelfHealing,
  getMachineAnalytics,
  getRevenueAnalytics,
};

export async function POST(req: NextRequest) {
  const { query, history } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 });
  }

  const messages = [
    { role: 'system', content: 'You are an agentic admin assistant for a laundromat platform. Answer questions, execute admin actions, and help the user manage the system.' },
    ...(history || []).map((m: any) => ({ role: m.role === 'agent' ? 'assistant' : m.role, content: m.content })),
    { role: 'user', content: query },
  ];

  // Call OpenAI with function calling
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-0613',
      messages,
      functions,
      temperature: 0.2,
      max_tokens: 512,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error }, { status: 500 });
  }

  const data = await response.json();
  const choice = data.choices?.[0];
  if (choice?.finish_reason === 'function_call' && choice.message?.function_call) {
    // LLM wants to call a function
    const { name, arguments: args } = choice.message.function_call;
    if (functionMap[name]) {
      let parsedArgs = {};
      try { parsedArgs = JSON.parse(args); } catch {}
      const result = await functionMap[name](parsedArgs);
      // Send result back to LLM for final response
      const followup = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-0613',
          messages: [
            ...messages,
            { role: 'assistant', content: null, function_call: choice.message.function_call },
            { role: 'function', name, content: JSON.stringify(result) },
          ],
          temperature: 0.2,
          max_tokens: 512,
        }),
      });
      const followupData = await followup.json();
      const reply = followupData.choices?.[0]?.message?.content || 'Action completed.';
      return NextResponse.json({ reply });
    }
  }

  const reply = choice?.message?.content || 'Sorry, I could not generate a response.';
  return NextResponse.json({ reply });
} 