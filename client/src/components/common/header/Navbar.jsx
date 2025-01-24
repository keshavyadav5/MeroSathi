import * as React from "react";
import { NavLink } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const navItem = [
    // { label: "About", to: "/About", active: true },
    { label: "Contact", to: "/contact", active: true },
  ];

  const productItem = [
    { name: "Paper Products", slug: "allproducts/search?q=paper-product", active: false },
    { name: "Gifts", slug: "allproducts/search?q=gifts", active: false },
    { name: "Stationary", slug: "allproducts/search?q=stationary", active: false },
    { name: "Marketing", slug: "allproducts/search?q=marketing", active: false },
    { name: "Merchandise", slug: "allproducts/search?q=event_merchandise", active: false },
  ];

  return (
    <NavigationMenu className="your-custom-class">
      <NavigationMenuList>

        {/** Home */}
        <NavigationMenuItem className="text-lg">
          <NavLink
            to='/'
            className={({ isActive }) =>
              `${navigationMenuTriggerStyle()} ${isActive ? "bg-gray-10" : "bg-transparent"}`
            }
          >
            Home
          </NavLink>
        </NavigationMenuItem>

        {/* All Products Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={`${navigationMenuTriggerStyle()} flex items-center bg-transparent`}>
            <span>All Products</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-white shadow-lg py-2 px-4 rounded-md">
            {productItem.map((product, index) => (
              <p key={index}>
                <NavLink
                  to={product.slug}
                  className="block min-w-36 px-3 py-1 hover:bg-gray-200 rounded-md text-md"
                >
                  {product.name}
                </NavLink>
              </p>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/** About contact */}
        {navItem.map((item, index) => (
          <NavigationMenuItem key={item.label + index}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `${navigationMenuTriggerStyle()} ${isActive ? "bg-gray-10" : "bg-transparent"}`
              }
            >
              {item.label}
            </NavLink>
          </NavigationMenuItem>
        ))}


      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  );
};

export default Navbar;
