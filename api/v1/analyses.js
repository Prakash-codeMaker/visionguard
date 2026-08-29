import {db} from 'hatchable';
export const access='public';
export const methods=['GET'];
export default async function(req,res){const {rows}=await db.query('SELECT id,created_at,filename,quality_score,quality_label,confidence,model_version,processing_time_ms FROM analyses ORDER BY created_at DESC LIMIT 100');res.json({items:rows})}