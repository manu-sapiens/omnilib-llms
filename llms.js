//@ts-check
//llms.js
import { getModelNameAndProviderFromId, DEFAULT_UNKNOWN_CONTEXT_SIZE } from './llm.js';
import { Llm_Openai } from './llm_Openai.js'
import { runBlock } from 'omnilib-utils/blocks.js';
export const DEFAULT_LLM_MODEL_ID = 'gpt-3.5-turbo|openai'

const llm_model_types = {};
const llm_context_sizes = {};

const default_providers = []
const llm_Openai = new Llm_Openai();
default_providers.push(llm_Openai)

export async function getLlmChoices()
{
    let choices = [];
    for (const provider of default_providers) 
    {
        await provider.getModelChoices(choices, llm_model_types, llm_context_sizes);
    }  
    return choices;
}

/**
 * @param {any} ctx
 * @param {any} prompt
 * @param {any} instruction
 * @param {any} model_id
 * @param {number} [temperature=0]
 * @param {any} [args=null]
 * @returns {Promise<{ answer_text: string; answer_json: { function_arguments_string?: any; function_arguments?: any; total_tokens?: number; answer: string } | null; }>}
 */
export async function queryLlmByModelId(ctx, prompt, instruction, model_id, temperature = 0, args=null)
{
    const splits = getModelNameAndProviderFromId(model_id);
    //const model_name = splits.model_name;
    const model_provider = splits.model_provider;
    let block_name = `omni-extension-document_processing:${model_provider}.llm_query`;
    
    if (model_provider == "openai")
    {
        block_name = `omni-core-llms:${model_provider}.llm_query`;
    }
    const block_args = { prompt, instruction, model_id, temperature, args };
    const response = await runBlock(ctx, block_name, block_args);
    return response;
    

}

export function getModelMaxSize(model_name, use_a_margin = true)
{
    const context_size = getModelContextSize(model_name)
    if (use_a_margin == false) return context_size

    const safe_size = Math.floor(context_size * 0.9);
    return safe_size;
}

function getModelContextSize(model_name)
{
    if (model_name in llm_context_sizes == false) return DEFAULT_UNKNOWN_CONTEXT_SIZE;
    
    const context_size = llm_context_sizes[model_name];
    return context_size;
}