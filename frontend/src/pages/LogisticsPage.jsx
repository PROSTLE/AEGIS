import React, { useState, useEffect } from 'react'
import { INDIAN_CITIES } from '../utils/constants'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { logisticsApi } from '../services/api'
import { useAppStore } from '../context/appStore'
import { getCityWeather } from '../utils/weatherDataset'

function LogisticsPage() {
  const store = useAppStore()
  const defaultCity = store.dashboardCity || 'Bangalore'
  const [city, setCity] = useState(defaultCity)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Real-Time Sensors State (Arduino simulation)
  const [sensors, setSensors] = useState({
    motion: 'None',
    distance: 0,
    vibration: 'Stable',
    soilRaw: 550,
    soilStatus: 'MEDIUM'
  })

  // Fetch static legacy logistics data
  useEffect(() => {
    let active = true
    setLoading(true)
    logisticsApi.getBreakdown(city)
      .then(res => {
        if (!active) return
        const frontendMetrics = res.metrics.map(m => {
          let icon = 'local_shipping'
          if (m.name.includes('Supplier')) icon = 'factory'
          if (m.name.includes('Highway')) icon = 'road'
          if (m.name.includes('Port')) icon = 'anchor'
          if (m.name.includes('Cold')) icon = 'ac_unit'
          if (m.name.includes('Cost')) icon = 'savings'
          return { ...m, icon }
        })
        const chartData = res.metrics.map(m => ({
          name: m.name.split(' ')[0], 
          score: m.value
        }))

        setData({
          score: res.overall_score,
          recommendation: res.recommendation,
          metrics: frontendMetrics,
          chartData: chartData
        })
        setLoading(false)
      })
      .catch(err => {
        console.error("Logistics API err:", err)
        setLoading(false)
      })
    return () => { active = false }
  }, [city])

  // Real-Time Arduino Loop Effect (100% Fake Simulation)
  useEffect(() => {
    const weather = getCityWeather(city);
    
    // Simulating delay(2000) from Arduino
    const interval = setInterval(() => {
      setSensors((prev) => {
        // HC-SR04 distance (cm) - slightly variable representing cargo placement
        const newDist = Math.max(0, prev.distance + (Math.random() * 20 - 10));
        const distance = prev.distance === 0 ? Math.floor(Math.random() * 300) + 10 : Math.floor(newDist);
        
        // HC-SR501 Motion detected randomly 30% of time
        const motion = Math.random() > 0.7 ? 'DETECTED' : 'None';
        
        // SW420 Vibration
        const vibration = Math.random() > 0.8 ? 'VIBRATING' : 'Stable';
        
        // Soil Moisture / Temp context influenced by the real-world city weather
        let soilRaw = Math.floor(Math.random() * 1023);
        if (weather.condition === 'Rainy' || weather.condition === 'Thunderstorm') {
          soilRaw = Math.floor(Math.random() * 300); // WET tendency
        } else if (weather.condition === 'Sunny' || weather.condition === 'Clear' || weather.temp > 35) {
          soilRaw = 700 + Math.floor(Math.random() * 323); // DRY tendency
        } else {
          // Normal/Medium spread
          soilRaw = 300 + Math.floor(Math.random() * 400); // MEDIUM tendency
        }

        let soilStatus = 'DRY';
        if (soilRaw < 300) soilStatus = 'WET';
        else if (soilRaw < 700) soilStatus = 'MEDIUM';

        return { motion, distance, vibration, soilRaw, soilStatus };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [city]);

  const scoreColor = data?.score >= 80 ? 'var(--secondary)' : data?.score >= 60 ? '#fbbf24' : 'var(--error)'
  const weather = getCityWeather(city);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title" style={{ fontFamily: 'Manrope', fontWeight: 800 }}>Real-Time Logistics Fleet & Cargo Node</h1>
        <div className="page-subtitle">Live IoT telemetry bonded with static macro-logistics data</div>
      </div>

      {/* City/Fleet Selector */}
      <div className="card" style={{ marginBottom: 24, padding: '14px 20px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.15em', marginRight: 4 }}>Fleet Origin:</span>
        <select 
          className="select" 
          value={city} 
          onChange={e => setCity(e.target.value)} 
          style={{ background: 'var(--bg-surface-container)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: 'var(--radius-md)', minWidth: 150 }}
        >
          {INDIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.8, background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: 20 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#85adff' }}>thermostat</span>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.8rem', fontWeight: 600 }}>Ext. Temp: {weather.temp}°C</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.8, background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: 20 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: weather.condition.includes('Rain') ? '#85adff' : '#fbbf24' }}>
              {weather.condition.includes('Rain') ? 'rainy' : 'partly_cloudy_day'}
            </span>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.8rem', fontWeight: 600 }}>{weather.condition} ({weather.humidity}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--secondary)', background: 'rgba(105, 246, 184, 0.1)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(105, 246, 184, 0.2)' }}>
            <span className="material-symbols-outlined" style={{ animation: 'pulse 1.5s infinite', fontSize: 18 }}>sensors</span>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>LIVE COMMS</span>
          </div>
        </div>
      </div>

      {/* Real-time Hardware Sensors Grid */}
      <h2 style={{ fontFamily: 'Manrope', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 16px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12 }}>
        IoT Telemetry Node / Container 042x
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        
        {/* HC-SR501 Motion */}
        <div className="card" style={{ background: sensors.motion === 'DETECTED' ? 'rgba(255, 107, 107, 0.1)' : 'var(--bg-surface-container-high)', border: sensors.motion === 'DETECTED' ? '1px solid var(--error)' : '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 10, transition: 'background 0.3s, border 0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--outline)', fontWeight: 600 }}>Security (HC-SR501)</span>
            <span className="material-symbols-outlined" style={{ color: sensors.motion === 'DETECTED' ? 'var(--error)' : 'var(--outline)', fontSize: 22 }}>directions_run</span>
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.6rem', fontWeight: 700, color: sensors.motion === 'DETECTED' ? 'var(--error)' : 'white' }}>
            {sensors.motion}
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Container Perimeter Scan</div>
        </div>

        {/* HC-SR04 Sonar */}
        <div className="card" style={{ background: 'var(--bg-surface-container-high)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--outline)', fontWeight: 600 }}>Cargo Depth (HC-SR04)</span>
            <span className="material-symbols-outlined" style={{ color: '#85adff', fontSize: 22 }}>straighten</span>
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.6rem', fontWeight: 700, color: 'white' }}>
            {sensors.distance} <span style={{ fontSize: '0.9rem', color: 'var(--outline)', fontWeight: 500 }}>cm</span>
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Proximity from door/load</div>
        </div>

        {/* SW420 Vibration */}
        <div className="card" style={{ background: sensors.vibration === 'VIBRATING' ? 'rgba(251, 191, 36, 0.1)' : 'var(--bg-surface-container-high)', border: sensors.vibration === 'VIBRATING' ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 10, transition: 'background 0.3s, border 0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--outline)', fontWeight: 600 }}>Shock (SW420)</span>
            <span className="material-symbols-outlined" style={{ color: sensors.vibration === 'VIBRATING' ? '#fbbf24' : 'var(--outline)', fontSize: 22 }}>vibration</span>
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.6rem', fontWeight: 700, color: sensors.vibration === 'VIBRATING' ? '#fbbf24' : 'white' }}>
            {sensors.vibration}
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Transit turbulence monitoring</div>
        </div>

        {/* Soil Moisture */}
        <div className="card" style={{ background: 'var(--bg-surface-container-high)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--outline)', fontWeight: 600 }}>Moisture Sensor</span>
            <span className="material-symbols-outlined" style={{ color: sensors.soilStatus === 'WET' ? '#69f6b8' : sensors.soilStatus === 'DRY' ? 'var(--error)' : '#fbbf24', fontSize: 22 }}>water_drop</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '1.6rem', fontWeight: 700, color: 'white' }}>{sensors.soilRaw}</span>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', fontWeight: 700, color: sensors.soilStatus === 'WET' ? '#69f6b8' : sensors.soilStatus === 'DRY' ? 'var(--error)' : '#fbbf24', paddingBottom: 6, letterSpacing: '0.1em' }}>
              → {sensors.soilStatus}
            </span>
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
            Calibrated to external climate ({weather.condition})
          </div>
        </div>
      </div>

      <h2 style={{ fontFamily: 'Manrope', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 16px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12 }}>
        Macro Infrastructure Baseline
      </h2>
      {!data || loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--on-surface-variant)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 32, animation: 'spin 1.5s linear infinite' }}>refresh</span>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: '0.8rem', marginTop: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Routing Infrastructure Data...</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 24 }}>
            <div className="card" style={{ textAlign: 'center', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>Logistics Base Score</div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '5rem', color: scoreColor, lineHeight: 1, letterSpacing: '-0.04em' }}>
                {data.score}
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.65rem', color: 'var(--outline)', marginBottom: 20 }}>/100</div>
              <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', lineHeight: 1.65, color: 'var(--on-surface-variant)', margin: 0 }}>{data.recommendation}</p>
            </div>
            <div className="card">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={data.chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#666', fontSize: 11, fontFamily: 'Space Grotesk' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11, fontFamily: 'Space Grotesk' }} width={80} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontFamily: 'Space Grotesk' }} />
                  <Bar dataKey="score" fill="#85adff" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {data.metrics.map((m) => {
              const col = m.value >= 70 ? 'var(--secondary)' : m.value >= 50 ? '#fbbf24' : 'var(--error)'
              return (
                <div key={m.name} style={{ padding: 20, borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface-container-low)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: col, marginBottom: 10, display: 'block' }}>{m.icon}</span>
                  <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '2rem', color: col, lineHeight: 1, letterSpacing: '-0.02em' }}>{m.value}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--outline)', marginTop: 6 }}>{m.name}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: 'var(--on-surface-variant)', marginTop: 4, marginBottom: 10 }}>{m.unit}</div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${m.value}%`, background: col, borderRadius: 99 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default LogisticsPage
