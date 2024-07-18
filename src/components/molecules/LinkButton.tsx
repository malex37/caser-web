'use client'
import Link from "next/link";

function LinkButton (props: { path: string, text: string, id?: string, state?: any }) {

  return(
    <div
      id={
        props.id ?
          props.id :
          `link-button-${props.path.replace('/','-')}-${props.text}`}
    >
        <Link href={'/'+props.path}>{props.text}</Link>
    </div>
  );
}

export default LinkButton;
