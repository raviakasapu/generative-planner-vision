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
    const { action_type, action_data = {}, message_id } = await req.json();

    console.log(`Processing action: ${action_type}`);
    console.log('Action data:', action_data);

    let result;
    switch (action_type) {
      case 'show_data': {
        const { filters = {}, dimensions = [] } = action_data;
        let query = supabase
          .from('planningdata')
          .select(`
            *,
            masterdimension1 (product_id, product_description, category),
            masterdimension2 (region_id, region_description, country),
            mastertimedimension (month_id, month_name, year),
            masterversiondimension (version_id, version_name),
            masterdatasourcedimension (datasource_id, datasource_name)
          `);

        // Apply filters if they exist
        if (filters.year) {
          query = query.eq('mastertimedimension.year', filters.year);
        }
        if (filters.product) {
          query = query.ilike('masterdimension1.product_description', `%${filters.product}%`);
        }
        if (filters.region) {
          query = query.ilike('masterdimension2.region_description', `%${filters.region}%`);
        }

        const { data: filteredData, error: filterError } = await query;
        if (filterError) throw filterError;
        result = { data: filteredData };
        break;
      }

      case 'show_chart': {
        const { 
          aggregation = 'sum', 
          measure = 'measure1', 
          groupBy = 'time' 
        } = action_data;

        let query = supabase
          .from('planningdata')
          .select(`
            measure1,
            measure2,
            mastertimedimension!inner (month_name, year),
            masterdimension1!inner (product_description),
            masterdimension2!inner (region_description)
          `);

        const { data: chartData, error: chartError } = await query;
        if (chartError) throw chartError;

        // Process data for visualization
        const processedData = chartData.reduce((acc: any, curr: any) => {
          const key = groupBy === 'time' 
            ? `${curr.mastertimedimension.month_name} ${curr.mastertimedimension.year}`
            : groupBy === 'product' 
              ? curr.masterdimension1.product_description
              : curr.masterdimension2.region_description;

          if (!acc[key]) {
            acc[key] = { total: 0, count: 0 };
          }
          acc[key].total += curr[measure] || 0;
          acc[key].count += 1;
          return acc;
        }, {});

        result = {
          labels: Object.keys(processedData),
          values: Object.values(processedData).map((v: any) => 
            aggregation === 'average' ? v.total / v.count : v.total
          )
        };
        break;
      }

      case 'run_analysis': {
        const { analysisType = 'trend', timeRange } = action_data;
        
        let query = supabase
          .from('planningdata')
          .select(`
            measure1,
            measure2,
            mastertimedimension!inner (month_name, year)
          `)
          .order('mastertimedimension.year', { ascending: true })
          .order('mastertimedimension.month_name', { ascending: true });

        const { data: analysisData, error: analysisError } = await query;
        if (analysisError) throw analysisError;

        // Calculate trends or other analysis
        const trends = analysisData.reduce((acc: any, curr: any) => {
          const period = `${curr.mastertimedimension.month_name} ${curr.mastertimedimension.year}`;
          acc[period] = {
            measure1: curr.measure1,
            measure2: curr.measure2,
            variance: curr.measure2 - curr.measure1,
            variancePercentage: ((curr.measure2 - curr.measure1) / curr.measure1) * 100
          };
          return acc;
        }, {});

        result = { trends };
        break;
      }

      default:
        throw new Error(`Unsupported action type: ${action_type}`);
    }

    // Store the action result
    if (message_id) {
      const { error: actionError } = await supabase
        .from('chat_actions')
        .insert({
          chat_message_id: message_id,
          action_type,
          action_data,
          result
        });

      if (actionError) throw actionError;
    }

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