function LinkButton (props: { path: string, text: string, id?: string, state?: any }) {
  return(
    <div
      id={
        props.id ?
          props.id :
          `link-button-${props.path.replace('/','-')}-${props.text}`}
    >
        <a href={'/'+props.path}>{props.text}</a>
    </div>
  );
}

export default LinkButton;
