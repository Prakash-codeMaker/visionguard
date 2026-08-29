import {db} from 'hatchable';
export const access='public';
export const methods=['GET'];
export default async function(req,res){await db.query('SELECT 1');res.json({status:'ok',model_loaded:true,model_version:'quality-v1.0'})}