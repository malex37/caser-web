const Avatar = (props: {first?: string, second?: string;}): JSX.Element => {
  return (
      <div className='flex flex-row justify-center'>
        <div className='flex justify-center row-span-1'>
          <div className='avatar placeholder'>
            <div className='bg-neutral text-neutral-content rounded-full w-16'>
              <span className='text-3xl'>{props.first || 'J'}{props.second||'D'}</span>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Avatar;
