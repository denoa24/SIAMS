import { useNavigate } from 'react-router-dom';
import './PageHeader.css';

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: string;
  logoText?: string;
};

export function PageHeader({
  title,
  description,
  icon,
  logoText = 'SIAMS',
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="page-header">
      <div className="page-header-main">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="page-header-logo">
          {icon ? (
            <img src={icon} alt={`${title} icon`} />
          ) : (
            <span>{logoText}</span>
          )}
        </div>

        <div className="page-header-text">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      </div>
    </header>
  );
}