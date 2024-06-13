import { Tab } from '@headlessui/react'

const StyledTab = (props: any): JSX.Element => {
  return <Tab.Panel>
    {props.children}
  </Tab.Panel>
}

export default StyledTab;
