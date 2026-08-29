import {trainAndEvaluate} from 'lib/mlRuntime.js';
export const access='admin';
export default async function(req,res){const t=Date.now();const r=trainAndEvaluate();res.json({model:r.model,validation:r.validation,test:r.test,dataset:r.dataset,training_ms:Date.now()-t});}