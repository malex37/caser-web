import { RouterConfig, Routes } from '@source/Router';
import LinkButton from './molecules/LinkButton';
import { v4 as uuid } from 'uuid';

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
              Object.values(Routes).map((routeObj: Partial<RouterConfig>) => {
                if (!routeObj.exposed) {
                  return;
                }
                return (
                  <li key={`${routeObj.path}-${routeObj.friendlyName}`} >
                    {
                      // YES I got tired and decided to just filter the root path...yeah I'm lazy so what
                    }
                    <LinkButton
                      path={routeObj.path === '/' ? '/' : '/' + routeObj.path}
                      text={routeObj.friendlyName || 'No provided text'}
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
