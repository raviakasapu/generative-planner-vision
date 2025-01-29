import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { action_type, action_data, chat_message_id } = await req.json();

    console.log(`Processing action: ${action_type} for message: ${chat_message_id}`);

    let result;
    switch (action_type) {
      case 'show_data':
        // Fetch data based on action_data parameters
        const { dimension_type } = action_data;
        const table = dimension_type === 'product' ? 'masterdimension1' :
                     dimension_type === 'region' ? 'masterdimension2' :
                     'masterdatasourcedimension';
        
        const { data: dimensionData, error: dimensionError } = await supabase
          .from(table)
          .select('*')
          .limit(10);

        if (dimensionError) throw dimensionError;
        result = { data: dimensionData };
        break;

      case 'show_chart':
        // Fetch aggregated data for visualization
        const { data: planningData, error: planningError } = await supabase
          .from('planningdata')
          .select(`
            measure1,
            measure2,
            mastertimedimension (
              month_name,
              year
            )
          `)
          .limit(12);

        if (planningError) throw planningError;
        result = { data: planningData };
        break;

      case 'run_analysis':
        // Perform data analysis
        const { data: analysisData, error: analysisError } = await supabase
          .rpc('insert_planning_data_combinations');

        if (analysisError) throw analysisError;
        result = { message: 'Analysis completed successfully' };
        break;

      default:
        throw new Error(`Unsupported action type: ${action_type}`);
    }

    // Store the action result
    const { error: actionError } = await supabase
      .from('chat_actions')
      .insert({
        chat_message_id,
        action_type,
        action_data,
        result
      });

    if (actionError) throw actionError;

    return new Response(
      JSON.stringify({ result }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing chat action:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});