import Link from "next/link";

export interface AppendCrumb {
  text?: string;
  path?: string;
  state?: Record<string,any>;
};

export interface CrumbsProps {
  pathToConvert: string;
  crumbsWithNoPath: string[];
  crumbsToIgnore?: string[];
  crumbsToAppend?: AppendCrumb[];
  delimiter: string;
  stateForPath: Record<string, any>;
}

const Crumbs = (props: CrumbsProps): JSX.Element => {
  return (
    <div className='breadcrumbs'>
        <ul>
          {
            props.crumbsToAppend ? props.crumbsToAppend.map((crumb: AppendCrumb, index: number) => {
              if (!crumb.text || !crumb.path) return;
              return (
                <li key={`${crumb.text}-${index}`}>
                  <Link href={crumb.path} className='hover:text-purple-499' >{crumb.text}</Link>
                </li>
              );
            }) : <></>
          }
          {
            props.pathToConvert.split(props.delimiter).filter(crumb => {
              // filter ignorable paths and empty strings resulting from split
              return props.crumbsToIgnore && !props.crumbsToIgnore.includes(crumb) && crumb !== '';
            }).map((crumbText, index) => {
              if (props.crumbsWithNoPath.includes(crumbText)) {
                return <li key={index}><span className='border rounded border-purple-500 pr-2 pl-2'>{crumbText}</span></li>
              }
              return(
                <li key={index} id={`cr-${crumbText}`}>
                  <Link href={'..'} className={`hover:text-purple-500`}>
                    {crumbText}
                  </Link>
                </li>
              );
            })
          }
        </ul>
    </div>
  );
}

export default Crumbs;
