import React, { useState } from 'react';
import { MOCK_CLIENTS, Client } from './data/clients';
import { saveAs } from 'file-saver';
import './App.css';

type EmailMode = 'none' | 'basic' | 'enhanced';
type AppState = 'list' | 'detail';

function App() {
  const [view, setView] = useState<AppState>('list');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [emailPrompt, setEmailPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [analysisNotes, setAnalysisNotes] = useState('');
  const [emailMode, setEmailMode] = useState<EmailMode>('none');
  const [loading, setLoading] = useState(false);
  const [loadingMode, setLoadingMode] = useState<'basic' | 'enhanced' | null>(null);
  const [error, setError] = useState('');
  const [showEmailPanel, setShowEmailPanel] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setView('detail');
    setGeneratedEmail('');
    setAnalysisNotes('');
    setEmailMode('none');
    setEmailPrompt('');
    setShowEmailPanel(false);
    setEmailSubject('');
    setError('');
  };

  const handleBack = () => {
    setView('list');
    setSelectedClient(null);
  };

  const generateSubject = (prompt: string, clientName: string): string => {
    const lower = prompt.toLowerCase();
    if (lower.includes('christmas')) return `Season's Greetings — ${clientName}`;
    if (lower.includes('hanukkah') || lower.includes('hannukah')) return `Warm Wishes This Hanukkah — ${clientName}`;
    if (lower.includes('new year')) return `Wishing You a Wonderful New Year`;
    if (lower.includes('birthday')) return `Happy Birthday, ${clientName.split(' ')[0]}!`;
    if (lower.includes('review') || lower.includes('portfolio')) return `Your Portfolio Review — Action Items`;
    if (lower.includes('mortgage')) return `Regarding Your Upcoming Mortgage Renewal`;
    if (lower.includes('retirement')) return `Planning for Your Retirement Milestone`;
    return `A Note from Your RBC Advisor`;
  };

  const callAPI = async (mode: 'basic' | 'enhanced') => {
    if (!emailPrompt.trim() || !selectedClient) return;
    setLoading(true);
    setLoadingMode(mode);
    setError('');

    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: emailPrompt,
          client: selectedClient,
          mode,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error');
      }

      const data = await response.json();
      setGeneratedEmail(data.email);
      setEmailMode(mode);
      setEmailSubject(generateSubject(emailPrompt, selectedClient.name));
      if (mode === 'enhanced' && data.analysis) {
        setAnalysisNotes(data.analysis);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate email. Is the server running?');
    } finally {
      setLoading(false);
      setLoadingMode(null);
    }
  };

  const handleSend = () => {
    if (!selectedClient) return;
    window.alert(
      `Email sent successfully!\n\nTo: ${selectedClient.name} <${selectedClient.email}>\nSubject: ${emailSubject}\n\nThis action has been logged in the client activity feed.`
    );
  };

  const handleDownload = () => {
    if (!generatedEmail || !selectedClient) return;
    const content = `To: ${selectedClient.name} <${selectedClient.email}>\nSubject: ${emailSubject}\nDate: ${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}\nAdvisor: ${selectedClient.advisorName}\n\n---\n\n${generatedEmail}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `email_${selectedClient.lastName}_${new Date().toISOString().slice(0, 10)}.txt`);
  };

  return (
    <div className="app">
      {/* Top Navigation */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="rbc-logo">
            <span className="logo-rbc">RBC</span>
            <span className="logo-divider">|</span>
            <span className="logo-product">Advisor Workspace</span>
          </div>
        </div>
        <nav className="topbar-nav">
          <span className="nav-item active">Clients</span>
          <span className="nav-item">Opportunities</span>
          <span className="nav-item">Reports</span>
          <span className="nav-item">Tasks</span>
        </nav>
        <div className="topbar-right">
          <div className="advisor-badge">
            <div className="advisor-avatar">SC</div>
            <div className="advisor-info">
              <span className="advisor-name-top">Sarah Chen</span>
              <span className="advisor-role">Senior Wealth Advisor</span>
            </div>
          </div>
        </div>
      </header>

      <div className="app-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <p className="sidebar-label">NAVIGATION</p>
            <ul className="sidebar-nav">
              <li className={`sidebar-item ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
                Client List
              </li>
              <li className="sidebar-item">Activity Feed</li>
              <li className="sidebar-item">Scheduled Reviews</li>
            </ul>
          </div>
          <div className="sidebar-section">
            <p className="sidebar-label">QUICK FILTERS</p>
            <ul className="sidebar-nav">
              <li className="sidebar-item">Private Banking</li>
              <li className="sidebar-item">Wealth Management</li>
              <li className="sidebar-item">Personal Banking</li>
            </ul>
          </div>
          <div className="sidebar-section">
            <p className="sidebar-label">TOOLS</p>
            <ul className="sidebar-nav">
              <li className="sidebar-item active-dim">Email Composer</li>
              <li className="sidebar-item">Document Vault</li>
              <li className="sidebar-item">Model Portfolios</li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {view === 'list' && (
            <div className="page-clients">
              <div className="page-header">
                <div>
                  <h1 className="page-title">Client List</h1>
                  <p className="page-subtitle">2 active client relationships</p>
                </div>
              </div>

              <div className="client-table-wrap">
                <table className="client-table">
                  <thead>
                    <tr>
                      <th>Client ID</th>
                      <th>Name</th>
                      <th>Segment</th>
                      <th>City</th>
                      <th>Occupation</th>
                      <th>Client Since</th>
                      <th>Last Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_CLIENTS.map((client) => (
                      <tr
                        key={client.id}
                        className="client-row"
                        onClick={() => handleSelectClient(client)}
                      >
                        <td className="mono">{client.id}</td>
                        <td>
                          <div className="client-name-cell">
                            <div className="client-avatar-sm">
                              {client.firstName[0]}{client.lastName[0]}
                            </div>
                            <span className="client-name-text">{client.name}</span>
                          </div>
                        </td>
                        <td><span className={`segment-badge ${client.segment.toLowerCase().replace(' ', '-')}`}>{client.segment}</span></td>
                        <td>{client.city}, {client.province}</td>
                        <td>{client.occupation}</td>
                        <td>{client.clientSince}</td>
                        <td>{client.lastContact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === 'detail' && selectedClient && (
            <div className="page-detail">
              {/* Breadcrumb */}
              <div className="breadcrumb">
                <span className="breadcrumb-link" onClick={handleBack}>Client List</span>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-current">{selectedClient.name}</span>
              </div>

              {/* Client Header */}
              <div className="client-header-card">
                <div className="client-header-left">
                  <div className="client-avatar-lg">
                    {selectedClient.firstName[0]}{selectedClient.lastName[0]}
                  </div>
                  <div className="client-header-info">
                    <div className="client-header-top-row">
                      <h2 className="client-fullname">{selectedClient.name}</h2>
                      <span className={`segment-badge ${selectedClient.segment.toLowerCase().replace(' ', '-')}`}>
                        {selectedClient.segment}
                      </span>
                    </div>
                    <p className="client-sub">{selectedClient.occupation} &bull; {selectedClient.city}, {selectedClient.province}</p>
                    <p className="client-meta">Client since {selectedClient.clientSince} &bull; ID: {selectedClient.id}</p>
                  </div>
                </div>
                <div className="client-header-actions">
                  <button
                    className="btn-primary"
                    onClick={() => setShowEmailPanel(true)}
                  >
                    Compose Email
                  </button>
                </div>
              </div>

              {/* Detail Grid */}
              <div className="detail-grid">
                {/* Left col: profile + contact */}
                <div className="detail-col-left">
                  <div className="card">
                    <div className="card-header">Client Profile</div>
                    <div className="card-body">
                      <div className="field-row">
                        <span className="field-label">Full Name</span>
                        <span className="field-value">{selectedClient.name}</span>
                      </div>
                      <div className="field-row">
                        <span className="field-label">Age</span>
                        <span className="field-value">{selectedClient.age}</span>
                      </div>
                      <div className="field-row">
                        <span className="field-label">Marital Status</span>
                        <span className="field-value">{selectedClient.maritalStatus}</span>
                      </div>
                      <div className="field-row">
                        <span className="field-label">Background</span>
                        <span className="field-value">{selectedClient.background}</span>
                      </div>
                      <div className="field-row">
                        <span className="field-label">Occupation</span>
                        <span className="field-value">{selectedClient.occupation}</span>
                      </div>
                      <div className="field-row">
                        <span className="field-label">Annual Income</span>
                        <span className="field-value">{selectedClient.annualIncome}</span>
                      </div>
                      <div className="field-row">
                        <span className="field-label">Est. Net Worth</span>
                        <span className="field-value">{selectedClient.netWorth}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card" style={{ marginTop: '16px' }}>
                    <div className="card-header">Contact Information</div>
                    <div className="card-body">
                      <div className="field-row">
                        <span className="field-label">Email</span>
                        <span className="field-value">{selectedClient.email}</span>
                      </div>
                      <div className="field-row">
                        <span className="field-label">Phone</span>
                        <span className="field-value">{selectedClient.phone}</span>
                      </div>
                      <div className="field-row">
                        <span className="field-label">Advisor</span>
                        <span className="field-value">{selectedClient.advisorName}</span>
                      </div>
                      <div className="field-row">
                        <span className="field-label">Last Contact</span>
                        <span className="field-value">{selectedClient.lastContact}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right col: financial profile */}
                <div className="detail-col-right">
                  <div className="card">
                    <div className="card-header">Financial Overview</div>
                    <div className="card-body">
                      <div className="field-row">
                        <span className="field-label">Portfolio Value</span>
                        <span className="field-value highlight-blue">{selectedClient.portfolioValue}</span>
                      </div>
                      <div className="field-row">
                        <span className="field-label">Risk Tolerance</span>
                        <span className="field-value">{selectedClient.riskTolerance}</span>
                      </div>
                      <div className="field-row stacked">
                        <span className="field-label">Composition</span>
                        <span className="field-value">{selectedClient.portfolioComposition}</span>
                      </div>
                      <div className="field-row stacked">
                        <span className="field-label">Financial Goals</span>
                        <span className="field-value">{selectedClient.financialGoals}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card" style={{ marginTop: '16px' }}>
                    <div className="card-header">Current Products</div>
                    <div className="card-body">
                      <p className="field-value">{selectedClient.currentProducts}</p>
                    </div>
                  </div>

                  <div className="card opportunity-card" style={{ marginTop: '16px' }}>
                    <div className="card-header">Advisor Notes &amp; Opportunities</div>
                    <div className="card-body">
                      <div className="field-row stacked">
                        <span className="field-label">Recent Events</span>
                        <span className="field-value">{selectedClient.recentEvents}</span>
                      </div>
                      <div className="field-row stacked" style={{ marginTop: '10px' }}>
                        <span className="field-label">Identified Opportunities</span>
                        <span className="field-value">{selectedClient.opportunities}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Composer Panel */}
              {showEmailPanel && (
                <div className="email-panel">
                  <div className="email-panel-header">
                    <h3 className="panel-title">Email Composer</h3>
                    <button className="btn-close" onClick={() => setShowEmailPanel(false)}>Dismiss</button>
                  </div>

                  <div className="prompt-section">
                    <label className="input-label">
                      Describe the email you want to send to {selectedClient.firstName}
                    </label>
                    <div className="prompt-row">
                      <input
                        className="prompt-input"
                        type="text"
                        placeholder={`e.g. "I want to send ${selectedClient.firstName} a Christmas email"`}
                        value={emailPrompt}
                        onChange={(e) => setEmailPrompt(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') callAPI('basic'); }}
                      />
                      <button
                        className="btn-primary"
                        onClick={() => callAPI('basic')}
                        disabled={loading || !emailPrompt.trim()}
                      >
                        {loading && loadingMode === 'basic' ? 'Generating...' : 'Generate Email'}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="error-banner">
                      {error}
                    </div>
                  )}

                  {generatedEmail && (
                    <div className="email-output">
                      <div className="email-output-header">
                        <div className="email-meta-row">
                          <span className="email-meta-label">To:</span>
                          <span className="email-meta-value">{selectedClient.name} &lt;{selectedClient.email}&gt;</span>
                        </div>
                        <div className="email-meta-row">
                          <span className="email-meta-label">Subject:</span>
                          <input
                            className="subject-input"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                          />
                        </div>
                        {emailMode === 'enhanced' && (
                          <div className="mode-badge enhanced">Enhanced — AI-Personalized</div>
                        )}
                        {emailMode === 'basic' && (
                          <div className="mode-badge basic">Standard Template</div>
                        )}
                      </div>

                      {analysisNotes && emailMode === 'enhanced' && (
                        <div className="analysis-notes">
                          <p className="analysis-label">NOMI Analysis (not visible to client)</p>
                          <p className="analysis-text">{analysisNotes}</p>
                        </div>
                      )}

                      <div className="email-body-area">
                        <textarea
                          className="email-textarea"
                          value={generatedEmail}
                          onChange={(e) => setGeneratedEmail(e.target.value)}
                          rows={14}
                        />
                      </div>

                      <div className="email-actions">
                        <div className="email-actions-left">
                          {emailMode === 'basic' && (
                            <button
                              className="btn-enhance"
                              onClick={() => callAPI('enhanced')}
                              disabled={loading}
                            >
                              {loading && loadingMode === 'enhanced' ? 'Enhancing...' : 'Enhance with Client Insights'}
                            </button>
                          )}
                        </div>
                        <div className="email-actions-right">
                          <button className="btn-secondary" onClick={handleDownload}>
                            Download
                          </button>
                          <button className="btn-send" onClick={handleSend}>
                            Send Email
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
