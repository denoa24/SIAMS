import { PageHeader } from '../../components/PageHeader';
import './ArchitecturePage.css';

type ArchitectureLayer = {
  id: number;
  title: string;
  description: string;
  items: string[];
};

export function ArchitecturePage() {
  const layers: ArchitectureLayer[] = [
    {
      id: 1,
      title: 'Vehicle Layer',
      description: 'Connected vehicles generate access requests and communicate with nearby RSUs.',
      items: ['Vehicle ID', 'Digital certificate', 'Position data', 'Access request'],
    },
    {
      id: 2,
      title: 'RSU Infrastructure Layer',
      description: 'Road Side Units receive requests and forward them to the backend services.',
      items: ['RSU ID', 'Location', 'Signal status', 'Vehicle communication'],
    },
    {
      id: 3,
      title: 'V2I Communication Layer',
      description: 'The communication channel between vehicles and infrastructure components.',
      items: ['Secure message exchange', 'Authentication request', 'Encrypted traffic'],
    },
    {
      id: 4,
      title: 'Authentication Server',
      description: 'Validates vehicle identity, certificates and access permissions.',
      items: ['Certificate validation', 'Access rules', 'Request approval', 'Denied access'],
    },
    {
      id: 5,
      title: 'Cloud Database',
      description: 'Stores vehicles, access requests, security alerts and system logs.',
      items: ['Vehicle records', 'Access logs', 'Security alerts', 'Analytics data'],
    },
  ];

  return (
    <div className="architecture-page">
      <PageHeader
        title="System Architecture"
        description="Visual representation of the SIAMS V2I communication and access management flow."
      />

      <section className="architecture-overview-card">
        <div>
          <h2>SIAMS Architecture Overview</h2>
          <p>
            The SIAMS platform is structured as a layered system that simulates
            secure communication between connected vehicles, roadside
            infrastructure, backend authentication services and cloud storage.
          </p>
        </div>

        <div className="architecture-status">
          <span>Architecture Status</span>
          <strong>Simulation Ready</strong>
        </div>
      </section>

      <section className="architecture-flow-card">
        <h2>Communication Flow</h2>

        <div className="architecture-flow-diagram">
          {layers.map((layer, index) => (
            <div key={layer.id} className="flow-layer-wrapper">
              <div className="flow-layer">
                <div className="layer-number">{layer.id}</div>
                <h3>{layer.title}</h3>
                <p>{layer.description}</p>
              </div>

              {index < layers.length - 1 && (
                <div className="flow-connector">↓</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="architecture-details-grid">
        {layers.map((layer) => (
          <div key={layer.id} className="architecture-detail-card">
            <div className="detail-card-header">
              <span>{layer.id}</span>
              <h3>{layer.title}</h3>
            </div>

            <p>{layer.description}</p>

            <ul>
              {layer.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="data-flow-card">
        <h2>Authentication Data Flow</h2>

        <div className="data-flow-steps">
          <div className="data-step">
            <span>1</span>
            <p>Vehicle sends access request to nearest RSU.</p>
          </div>

          <div className="data-step">
            <span>2</span>
            <p>RSU forwards the request through the V2I communication layer.</p>
          </div>

          <div className="data-step">
            <span>3</span>
            <p>Authentication server validates certificate and access rules.</p>
          </div>

          <div className="data-step">
            <span>4</span>
            <p>System returns Granted, Denied or Pending status.</p>
          </div>

          <div className="data-step">
            <span>5</span>
            <p>Event is stored in the cloud database for monitoring and analytics.</p>
          </div>
        </div>
      </section>
    </div>
  );
}