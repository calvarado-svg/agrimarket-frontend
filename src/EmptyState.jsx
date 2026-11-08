import { Link } from "react-router-dom";

export default function EmptyState({ title, text, actionTo, actionLabel }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p className="muted">{text}</p>
      {actionTo && actionLabel && (
        <Link to={actionTo} className="button-link">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
