import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const routeLabels: Record<string, string> = {
  '/': 'Inicio',
  '/nosotros': 'Nosotros',
  '/servicios': 'Servicios',
  '/cotizar': 'Cotizar',
  '/agendar': 'Agendar Cita',
  '/products': 'Productos',
  '/contacto': 'Contacto',
};

export const Breadcrumbs = () => {
  const location = useLocation();

  if (location.pathname === '/') return null;

  const pathnames = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Inicio', path: '/' }];

  let currentPath = '';
  pathnames.forEach((segment) => {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      label: routeLabels[currentPath] ||
             segment.charAt(0).toUpperCase() + segment.slice(1),
      path: currentPath,
    });
  });

  return (
    <nav className="bg-gray-100 border-b py-4">
      <div className="max-w-7xl mx-auto px-6">
        <ol className="flex items-center text-sm text-gray-600">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && <ChevronRight size={18} className="mx-3 text-gray-400" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-gray-900">{crumb.label}</span>
              ) : (
                <Link to={crumb.path} className="hover:text-purple-600 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};