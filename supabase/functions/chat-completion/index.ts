import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { OpenAI } from 'https://esm.sh/openai@4.20.1';
import { corsHeaders } from '../_shared/cors.ts';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY') || '',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { messages, userId } = await req.json();

    // Store the incoming message
    const { data: chatMessage, error: insertError } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        message: messages[messages.length - 1].content,
        context: { full_conversation: messages }
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Get AI completion
    const completion = await openai.chat.completions.create({
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      model: 'gpt-3.5-turbo',
    });

    const aiResponse = completion.choices[0].message.content;

    // Update the chat message with AI response
    const { error: updateError } = await supabase
      .from('chat_messages')
      .update({ response: aiResponse })
      .eq('id', chatMessage.id);

    if (updateError) throw updateError;

    // Check for action triggers in the response
    const actions = [];
    if (aiResponse.toLowerCase().includes('data')) {
      actions.push({
        chat_message_id: chatMessage.id,
        action_type: 'show_data',
        action_data: { trigger: 'data_keyword' }
      });
    }
    if (aiResponse.toLowerCase().includes('chart') || aiResponse.toLowerCase().includes('graph')) {
      actions.push({
        chat_message_id: chatMessage.id,
        action_type: 'show_chart',
        action_data: { trigger: 'visualization_keyword' }
      });
    }
    if (aiResponse.toLowerCase().includes('analysis')) {
      actions.push({
        chat_message_id: chatMessage.id,
        action_type: 'run_analysis',
        action_data: { trigger: 'analysis_keyword' }
      });
    }

    // Store actions if any were triggered
    if (actions.length > 0) {
      const { error: actionsError } = await supabase
        .from('chat_actions')
        .insert(actions);

      if (actionsError) throw actionsError;
    }

    return new Response(
      JSON.stringify({
        choices: [{ message: { content: aiResponse } }],
        actions: actions
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
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