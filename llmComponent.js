//@ts-check
import { createComponent } from 'omnilib-utils/component.js';
import { getModelNameAndProviderFromId } from './llm.js';

function get_llm_query_inputs(default_llm = "")
{
    const input = [
        { name: 'instruction', type: 'string', description: 'Instruction(s)', defaultValue: 'You are a helpful bot answering the user with their question to the best of your abilities', customSocket: 'text' },
        { name: 'prompt', type: 'string', customSocket: 'text', description: 'Prompt(s)' },
        { name: 'temperature', type: 'number', defaultValue: 0.7, minimum: 0, maximum:2, description: "The randomness regulator, higher for more creativity, lower for more structured, predictable text."},
    ];   

    if (default_llm != "")
    {
        input.push({ name: 'model_id', type: 'string', customSocket: 'text', defaultValue: default_llm, description: 'The provider of the LLM model to use'});
    }
    else
    {
        input.push({ name: 'model_id', type: 'string', customSocket: 'text', description: 'The provider of the LLM model to use'});
    }

    input.push({ name: 'args', type: 'object', customSocket: 'object', description: 'Extra arguments provided to the LLM'});

    return input;
}

const LLM_QUERY_OUTPUT = [
    { name: 'answer_text', type: 'string', customSocket: 'text', description: 'The answer to the query', title: "Answer"},
    { name: 'answer_json', type: 'object', customSocket: 'object', description: 'The answer in json format, with possibly extra arguments returned by the LLM', title: 'Json' },
]

const LLM_QUERY_CONTROL = null;
// TBD: use controls for temperature (slider) and args (json editer/viewer)
//[
    // { name: "temperature", placeholder: "AlpineNumWithSliderComponent" },];
    // { name: "args", title: "Extra args", placeholder: "AlpineCodeMirrorComponent", description: "Extra Args passed to the LLM model" },
//];

function createLlmQueryComponent(model_provider, links, payloadParser)
{

    const group_id = model_provider;
    const id = `llm_query`;
    const title = `LLM Query via ${model_provider}`;
    const category = 'LLM';
    const description = `Query a LLM with ${model_provider}`;
    const summary = `Query the specified LLM via ${model_provider}`;
    const inputs = get_llm_query_inputs();
    const outputs = LLM_QUERY_OUTPUT;
    const controls = LLM_QUERY_CONTROL;

    const component = createComponent(group_id, id, title, category, description, summary, links, inputs, outputs, controls, payloadParser);
    return component;
}


function extractPayload(payload, model_provider) {
    if (!payload) throw new Error('No payload provided.');

    const instruction = payload.instruction;
    const prompt = payload.prompt;
    const temperature = payload.temperature || 0;
    const model_id = payload.model_id;
    const args = payload.args;

    if (!prompt) throw new Error(`ERROR: no prompt provided!`);

    const splits = getModelNameAndProviderFromId(model_id);
    const passed_model_name = splits.model_name;
    const passed_provider = splits.model_provider;

    if (passed_provider != model_provider) throw new Error(`ERROR: model_provider (${passed_provider}) != ${model_provider}`);

    return {
        instruction,
        prompt,
        temperature,
        model_name: passed_model_name,
        args
    };
}



export { createLlmQueryComponent, extractPayload, get_llm_query_inputs, LLM_QUERY_OUTPUT, LLM_QUERY_CONTROL };
