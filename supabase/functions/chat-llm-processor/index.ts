import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();

    // Create system message with context about available data
    const systemMessage = {
      role: 'system',
      content: `You are an AI assistant with access to planning data. You can:
      1. Filter and show data based on dimensions (time, product, region)
      2. Create visualizations and charts
      3. Run analysis on trends and patterns
      4. Modify data if user has appropriate permissions
      
      Available data includes:
      - Time dimensions (month, quarter, year)
      - Product dimensions (product_id, description, category)
      - Region dimensions (region_id, description, country)
      - Measures (measure1, measure2)
      
      Current context: ${JSON.stringify(context)}`
    };

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...messages],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    // Extract suggested actions from the response
    const aiResponse = data.choices[0].message.content;
    const actions = [];
    
    if (aiResponse.toLowerCase().includes('filter') || 
        aiResponse.toLowerCase().includes('show') || 
        aiResponse.toLowerCase().includes('display')) {
      actions.push('show_data');
    }
    if (aiResponse.toLowerCase().includes('chart') || 
        aiResponse.toLowerCase().includes('graph') || 
        aiResponse.toLowerCase().includes('visualize')) {
      actions.push('show_chart');
    }
    if (aiResponse.toLowerCase().includes('analysis') || 
        aiResponse.toLowerCase().includes('trend') || 
        aiResponse.toLowerCase().includes('compare')) {
      actions.push('run_analysis');
    }

    return new Response(
      JSON.stringify({
        response: aiResponse,
        suggested_actions: actions
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});