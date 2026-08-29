import {db} from 'hatchable';
export const access='public';
export const methods=['GET'];
export default async function(req,res){const {rows}=await db.query('SELECT count(*)::int AS analysis_count FROM analyses');res.json({version:'quality-v1.0',trained_at:null,feature_count:7,classifier:'Versioned feature-based hybrid inference contract',analysis_count:rows[0]?.analysis_count||0})}