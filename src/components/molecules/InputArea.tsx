
export interface InputAreaProps {
  changeEventHandler: (areaText: string) => void;
  text: any;
  label: string;
  grid? : {
    spanWidth: number,
    spanHeight: number,
  }
}

const InputArea = (props: InputAreaProps): JSX.Element => {

  const changeHandler = (newAreaText: string) => {
    props.changeEventHandler(newAreaText);
  };

  const gridDimensions = props.grid ? `col-span-${props.grid.spanWidth} row-span-${props.grid.spanHeight}` : '';

  return (
    <div className={`${gridDimensions} flex flex-col gap-3`}>
      <label>{props.label}</label>
      <textarea
        name='areatext'
        className='resize-none textarea w-full border text-black border-purple-500'
        rows={3}
        onChange={(e) => changeHandler(e.target.value)}
        value={props.text}
      >
      </textarea>
    </div>
  );
}

export default InputArea;
