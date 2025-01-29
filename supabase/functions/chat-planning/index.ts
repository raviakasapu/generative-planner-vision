import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Process message using GPT-4
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a planning assistant that helps with data analysis and planning tasks. 
            Available tools: update_spreadsheet, get_business_logic.
            Current context: ${JSON.stringify(context)}`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    const gptResponse = await response.json();
    const aiMessage = gptResponse.choices[0].message.content;

    // Determine suggested actions based on AI response
    const suggestedActions = [];
    if (aiMessage.toLowerCase().includes('filter') || 
        aiMessage.toLowerCase().includes('show') || 
        aiMessage.toLowerCase().includes('data')) {
      suggestedActions.push('show_data');
    }
    if (aiMessage.toLowerCase().includes('chart') || 
        aiMessage.toLowerCase().includes('graph') || 
        aiMessage.toLowerCase().includes('visualize')) {
      suggestedActions.push('show_chart');
    }
    if (aiMessage.toLowerCase().includes('analysis') || 
        aiMessage.toLowerCase().includes('trend') || 
        aiMessage.toLowerCase().includes('compare')) {
      suggestedActions.push('run_analysis');
    }

    // Store chat message in database
    const { error: chatError } = await supabase
      .from('chat_messages')
      .insert({
        message,
        response: aiMessage,
        context,
      });

    if (chatError) throw chatError;

    return new Response(
      JSON.stringify({
        response: aiMessage,
        suggested_actions: suggestedActions
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing chat message:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});