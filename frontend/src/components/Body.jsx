import React from 'react'

const Body = () => {
  return (
<section className="home-main">
  <div className="hero">
    <h1>Unlock the Power of Sports Analytics</h1>
    <p>Track live scores, analyze player performance, and make data-driven decisions — all in one platform.</p>
    <button className="cta-button">Get Started</button>
  </div>

  <div className="features">
    <h2>Why Choose Us?</h2>
    <ul>
      <li><strong>📊 Real-Time Insights:</strong> Live match tracking and player stats.</li>
      <li><strong>🧠 Smart Analytics:</strong> Performance breakdowns across formats and venues.</li>
      <li><strong>🔍 Advanced Search:</strong> Filter players by team, format, or match history.</li>
      <li><strong>🛡️ Role-Based Access:</strong> Tailored dashboards for admins, players, and team owners.</li>
    </ul>
  </div>
</section>
  )
}

export default Body
