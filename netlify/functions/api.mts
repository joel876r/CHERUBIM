const routeSpecs = [
  ['MAA-DEL','Chennai','Delhi',1760,18,.18,6120,5.1,18.4],
  ['DEL-BOM','Delhi','Mumbai',1148,24,.24,5480,3.8,15.2],
  ['DEL-BLR','Delhi','Bengaluru',1740,19,.19,6280,2.9,16.1],
  ['BOM-BLR','Mumbai','Bengaluru',840,15,.15,4210,1.8,13.8],
  ['DEL-CCU','Delhi','Kolkata',1305,13,.13,5570,2.6,14.9],
  ['BLR-HYD','Bengaluru','Hyderabad',500,11,.11,3510,1.5,12.7],
] as const
const airlines = ['IndiGo','Air India','Air India Express','Akasa Air','SpiceJet']
const sources = ['IndiGo','Air India','MakeMyTrip','Cleartrip','Ixigo','Goibibo','Yatra','EaseMyTrip']
const windows = ['T+1','T+7','T+15','T+30','T+45']

function observations() {
  return Array.from({length: 180}, (_, i) => {
    const n=i+1, r=routeSpecs[i%6], airline=airlines[i%5], source=sources[i%8]
    const mult=[1.65,1.3,1.12,1.03,.98][i%5]
    const base=Math.round((Number(r[6])*.76*mult*(.96+(i%7)*.012))/10)*10
    const rejected=n===481 || n%97===0, review=!rejected && n%67===0
    const total=rejected?35900:base+Math.round(base*.05)+650+(source===airline?90:290)
    return {id:`OBS-${String(n).padStart(6,'0')}`,source,source_type:source===airline?'AIRLINE':'OTA',airline,
      origin:r[0].split('-')[0],destination:r[0].split('-')[1],route:r[0],flight_number:`${['6E','AI','IX','QP','SG'][i%5]}-${101+(i*37)%799}`,
      departure_datetime:`2026-10-${String(1+i%28).padStart(2,'0')} ${String(6+(i%8)*2).padStart(2,'0')}:00`,booking_window:windows[i%5],fare_class:'Economy',
      base_fare:rejected?32000:base,taxes:rejected?3500:Math.round(base*.05)+650,fees:rejected?400:(source===airline?90:290),total_fare:total,
      baggage:'15 kg check-in + 7 kg cabin',refundability:'Partial refund',availability:'AVAILABLE',observed_at:'2026-09-30 10:30:00',
      fingerprint_hash:`9c3a${String(n).padStart(6,'0')}7f1d82beed64130a958f066b686c9e8753d92db449db313a`,trust_score:rejected?28:review?68:96.2,
      status:rejected?'REJECTED':review?'REVIEW':'VALID',freshness_score:100,completeness_score:review?80:100,consistency_score:95,
      source_agreement_score:rejected?25:93.8,anomaly_score:rejected?15:97.1,quality_reasons:rejected?['Extreme deviation from comparable stratum distribution','Excluded from APIx calculation']:['Freshness verified within 1h scrape window','All statutory tax and fee items complete','Consensus validated across airline and OTA quotes'],
      raw_payload:{currency:'INR',cabin:'ECONOMY',collection_mode:'DEMO'} }
  })
}

const routes=routeSpecs.map(r=>({route:r[0],origin_city:r[1],dest_city:r[2],distance_km:r[3],pax_share_pct:r[4],weight:r[5],current_avg_fare:r[6],movement_30d:r[7],volatility:r[8]}))
const adapters=sources.map((source_name,i)=>({source_name,type:i<2?'AIRLINE':'OTA',domain:`${source_name.toLowerCase().replaceAll(' ','')}.com`,rate_limit_rps:2,status:'OPERATIONAL',latency_ms:118+i*13,robots_txt_status:'COMPLIANT',anti_bot_policy:'No bypass',mode:'DEMO CONNECTOR'}))
const quality={total_observations:9450,valid_count:9308,review_count:133,rejected_count:9,valid_pct:98.5,review_pct:1.4,rejected_pct:.1,dimension_averages:{freshness:96.8,completeness:99.1,consistency:95,anomaly_resistance:97.4,cross_source_agreement:93.2,composite_trust:96.3},weights_applied:{freshness:.2,completeness:.2,consistency:.2,anomaly_resistance:.2,cross_source_agreement:.2},methodology:'Five equally weighted quality pillars with robust MAD anomaly gating.'}

function routeDna(code:string) {
  const r=routes.find(x=>x.route===code) || routes[0]
  return {...r,average_fare:r.current_avg_fare,lead_time_pressure:'HIGH',lead_time_pressure_pct:57.6,source_agreement:91,observation_quality:98.5,sample_size:1575,
    fare_curve:{'T+45':4120,'T+30':4350,'T+15':4780,'T+7':5520,'T+1':6490},
    carrier_contribution:airlines.map((airline,i)=>({airline,avg_fare:Number(r.current_avg_fare)+(i-2)*135,share_pct:[55,22,8,9,6][i],contribution_pct:[1.2,.5,.15,.2,.1][i]})),
    source_dispersion:sources.slice(0,6).map((source,i)=>({source,source_type:i<2?'AIRLINE':'OTA',avg_fare:Number(r.current_avg_fare)+(i-3)*42,diff_from_route_avg:(i-3)*.7}))}
}

function json(data:unknown,status=200){return Response.json(data,{status,headers:{'cache-control':'public, max-age=60'}})}
export default async (req:Request) => {
  const url=new URL(req.url), path=url.pathname.replace(/^\/api\/?/,'')
  const current={index_value:102.4,change_percent_30d:2.4,change_percent_24h:.18,base_index:100,base_period_date:'2026-08-31',current_date:'2026-09-30',total_observations:9450,valid_observations:9308,high_quality_percentage:98.5,monitored_routes_count:6,active_sources_count:11,formula:'APIx = 100 × exp(Σ ws ln(Pt/P0))',methodology_disclaimer:'Reproducible prototype data for statistical evaluation.'}
  if(path==='apiX/current') return json(current)
  if(path==='apiX/history') return json(Array.from({length:31},(_,i)=>({date:i===0?'2026-08-31':`2026-09-${String(i).padStart(2,'0')}`,index_value:Number((100+i*.08+Math.sin(i/2)*.18).toFixed(2)),change_percent:Number((i*.08).toFixed(2)),base_fare_avg:4580+i*4,comparable_fare_avg:5340+i*5,valid_observations_count:296+i%12})))
  if(path==='routes') return json(routes)
  if(/^routes\/[^/]+\/dna$/.test(path)) return json(routeDna(decodeURIComponent(path.split('/')[1])))
  if(path==='lead-time/pressure') return json({lead_time_points:[['T+45',45,4120,0],['T+30',30,4350,5.6],['T+15',15,4780,16],['T+7',7,5520,34],['T+1',1,6490,57.6]].map(x=>({booking_window:x[0],days_out:x[1],comparable_fare:x[2],change_vs_t45_pct:x[3],sample_count:1860})),lead_time_pressure_pct:57.6,t45_fare:4120,t1_fare:6490,formula:'((T+1 fare / T+45 fare) - 1) × 100'})
  if(path==='quality/summary') return json(quality)
  if(path==='contributions') return json({total_movement_pct:2.4,route_contributions:routes.map((r,i)=>({category:'route',label:r.route,contribution_pct:[.9,.8,.35,.18,.1,.07][i],weight_pct:r.pax_share_pct,fare_change_pct:r.movement_30d,drilldown_route:r.route})),window_contributions:windows.map((w,i)=>({category:'window',label:w,contribution_pct:[.9,.62,.43,.28,.17][i],weight_pct:20,fare_change_pct:[4.5,3.1,2.15,1.4,.85][i]})),top_drivers:[],explanation:'Broad-based airfare inflation was led by MAA–DEL and DEL–BOM, with near-departure T+1 fares applying the strongest pressure.'})
  if(path.startsWith('consensus/')) { const [,route,window]=path.split('/'); const obs=observations().filter(o=>o.route===route&&o.booking_window===decodeURIComponent(window)).slice(0,8); const median=6027; return json({route,booking_window:decodeURIComponent(window),market_consensus_fare:median,source_agreement_pct:91,sample_size:obs.length,quotes:obs.map(o=>({observation_id:o.id,source:o.source,source_type:o.source_type,airline:o.airline,flight_number:o.flight_number,fare:o.total_fare,base_fare:o.base_fare,taxes:o.taxes,fees:o.fees,deviation_rs:o.total_fare-median,deviation_pct:Number(((o.total_fare-median)/median*100).toFixed(1)),trust_score:o.trust_score,status:o.status,is_outlier:o.status==='REJECTED'})),consensus_rule:'Median of trusted cross-source quotes after MAD outlier rejection.'}) }
  if(path==='observations') { let rows=observations(); for(const key of ['route','airline','source','window','status']) { const v=url.searchParams.get(key); if(v) rows=rows.filter((o:any)=>o[key==='window'?'booking_window':key]===v) } const s=url.searchParams.get('search')?.toLowerCase(); if(s) rows=rows.filter(o=>[o.id,o.flight_number,o.route].some(v=>v.toLowerCase().includes(s))); const page=Number(url.searchParams.get('page')||1), size=Number(url.searchParams.get('page_size')||25); return json({total:rows.length,page,page_size:size,total_pages:Math.ceil(rows.length/size),observations:rows.slice((page-1)*size,page*size)}) }
  if(path.startsWith('observations/')) { const id=path.split('/')[1]; const row=observations().find(o=>o.id===id) || (id==='OBS-000481'?{...observations()[0],id,total_fare:35900,base_fare:32000,taxes:3500,fees:400,status:'REJECTED',trust_score:28}:null); return row?json(row):json({detail:'Observation not found'},404) }
  if(path==='adapters') return json(adapters)
  if(path==='pipeline/status') { const run={run_id:'RUN-000184',started_at:'2026-09-30 10:30:00',completed_at:'2026-09-30 10:32:18',sources:11,routes:6,observations:720,valid_count:681,flagged_count:27,rejected_count:12,duration_sec:138,status:'COMPLETE'}; return json({status:'OPERATIONAL',last_run:run,recent_runs:[run],active_adapters:adapters,schedule:'Daily 4-hour cycles',safeguards:{rate_limiting:'Active',robots_txt:'Enforced',anti_bot_evasion:'Disabled'}}) }
  if(path==='pipeline/run'&&req.method==='POST') return json({run_id:`RUN-${Date.now()}`,status:'COMPLETE',new_observations_collected:180,valid_quotes:168,flagged_quotes:8,rejected_quotes:4,duration:'01.8s',message:'Demo collection completed successfully across 11 source adapters.'})
  if(path==='index/recalculate'&&req.method==='POST') return json({status:'SUCCESS',index_value:102.4,days_recalculated:31,message:'APIx history recalculated.'})
  if(path==='health') return json({system:'CHERUBIM',status:'OPERATIONAL',api:'HEALTHY',runtime:'Netlify Functions',data_mode:'REPRODUCIBLE PROTOTYPE',timestamp:new Date().toISOString()})
  if(path==='export/json') return new Response(JSON.stringify(observations(),null,2),{headers:{'content-type':'application/json','content-disposition':'attachment; filename="cherubim-audit.json"'}})
  if(path==='export/csv') { const rows=observations(), keys=['id','observed_at','route','airline','flight_number','booking_window','source','base_fare','taxes','fees','total_fare','trust_score','status','fingerprint_hash']; const csv=[keys.join(','),...rows.map((o:any)=>keys.map(k=>JSON.stringify(o[k]??'')).join(','))].join('\n'); return new Response(csv,{headers:{'content-type':'text/csv','content-disposition':'attachment; filename="cherubim-audit.csv"'}}) }
  return json({detail:'Endpoint not found'},404)
}

export const config = { path: '/api/*' }
