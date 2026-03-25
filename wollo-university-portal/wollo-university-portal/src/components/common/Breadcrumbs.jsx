import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs__list">
        {items.map((item, i) => (
          <li key={i} className="breadcrumbs__item">
            {i < items.length - 1 ? (
              <>
                <Link to={item.href} className="breadcrumbs__link">{item.label}</Link>
                <ChevronRight size={14} className="breadcrumbs__sep" aria-hidden="true" />
              </>
            ) : (
              <span className="breadcrumbs__current" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
