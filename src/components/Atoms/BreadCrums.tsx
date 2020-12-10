import React from 'react'
import { NavLink } from 'react-router-dom';

interface BreadCrumProps {

}

const BreadCrums: React.FC<BreadCrumProps> = (brdPrps: BreadCrumProps) => {

  return (
    <div className="flex flex-row my-4 py-4">
      <div className="w-auto vertical-border">
        <nav className="breadcrumbs" >
          <ol>
            {items.map((item, i) => (
              <li className="children-x-2" key={i}>
                <NavLink to={item.url}>
                  <span className={`${item.last ? 'text-secondary' : 'text-default'}`}>
                    {i === 0 ? item.title.toUpperCase() : item.title}
                  </span>
                </NavLink>
                {!item.last && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`breadcrumb-arrow text-default stroke-current inline-block h-4 w-4`}>
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                )}
              </li>
            ))}
          </ol>
        </nav >
      </div>
    </div>
  )
}

export default BreadCrums

// Will be replaced with actual data

const items = [
  { title: 'Home', url: '/', last: false },
  { title: 'Second level', url: '/', last: false },
  { title: 'Third level', url: '/', last: true }
]