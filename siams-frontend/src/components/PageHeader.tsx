import { useNavigate } from 'react-router-dom';
import './PageHeader.css';

type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="page-header">
      <div className="page-header-left">
        <button
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Back
        </button>

        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      </div>
    </div>
  );
}