import { useNavigate } from 'react-router-dom';
import logo from '../assets/siams-logo.png';
import './PageHeader.css';

type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({
  title,
  description
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="page-header">
      <div className="page-header-left">
        <div className="page-header-logo">
          <img src={logo} alt="SIAMS Logo" />
        </div>

        <div className="page-header-text">
          <h1>{title}</h1>

          {description && (
            <p>{description}</p>
          )}
        </div>
      </div>

      <button
        className="page-header-back"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
    </header>
  );
}