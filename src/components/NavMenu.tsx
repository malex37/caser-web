'use client'
import LinkButton from './molecules/LinkButton';
import { v4 as uuid } from 'uuid';

interface NavMenuRoute {
  displayName: string;
  path: string;
  exposed: boolean;
}

const NavMenuRoutes: { [routeName: string]: NavMenuRoute } = {
  home: {
    displayName: 'Home',
    path: 'dashboard',
    exposed: true,
  },
  settings: {
    displayName: 'Settings',
    path: 'settings',
    exposed: true,
  }
} as const

interface NavMenuProps {
  className?: string;
}

function NavMenu(props: NavMenuProps) {
  return (
    <div className={props.className}>
      <div className='navbar bg-base-100'>
        <div className='navbar-start'>
        </div>
        <div className='navbar-center'>
        </div>
        <div className='navbar-end'>
          <ul className='menu menu-horizontal px-1'>
            {
              Object.values(NavMenuRoutes).map((routeObj: NavMenuRoute) => {
                if (!routeObj.exposed) {
                  return;
                }
                return (
                  <li key={`${routeObj.path}-${routeObj.displayName}`} >
                    {
                      // YES I got tired and decided to just filter the root path...yeah I'm lazy so what
                    }
                    <LinkButton
                      path={routeObj.path}
                      text={routeObj.displayName || 'No provided text'}
                      key={uuid()} />
                  </li>
                );
              })
            }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavMenu;
