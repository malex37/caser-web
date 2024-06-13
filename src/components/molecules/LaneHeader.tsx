function LaneHeader(props: any) {
  return(
    <div className='flex flex-row flex-nowrap content-center justify-around text-lg font-bold p-4 border rounded my-1 text-purple-800'>
      <div className='border-b border-b-purple-950 items-center'>
        { props.children }
      </div>
    </div>
  );
}

export default LaneHeader;
