import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState();

  useEffect(() => {
    setActiveLink(location.pathname)
  }, [location.pathname])

  const dashboardSidebar = () => [
    { id: 1, name: "Dashboard", slug: "/admin/dashboard", active: true },
    { id: 2, name: "Profile", slug: "/profile", active: true },
    { id: 3, name: "Upload Paper Product", slug: "/admin/dashboard/upload-paper-product", active: true },
    { id: 4, name: "Settings", slug: "/settings", active: true },
  ];

  return (
    <div className="min-h-screen max-h-screen fiexd top-0 left-0">
      <div className="flex gap-5">
        <div className="max-w-xs min-w-80 min-h-screen h-full text-black py-5 flex flex-col gap-4 px-5 shadow-md">
          {dashboardSidebar().map((item) => (
            <Link
              key={item.id}
              to={item.slug}
              className={`block w-full text-lg p-2 bg-green-50 rounded-sm ${activeLink === item.slug ? 'bg-green-500 text-white' : 'hover:bg-green-300'
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex-1 pr-4 sm:pr-20">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
