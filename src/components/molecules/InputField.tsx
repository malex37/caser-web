export interface InputFieldProps {
  name: string,
  label?: string,
  placeholder?: string
  className?: string;
  containerClass?: string;
  labelClass?: string;
  inputClass?: string;
  value: string;
  action?: (field: string) => void;
}

function InputField(props: InputFieldProps) {
  return(
    <div className={`flex flex-col gap-2 ${props.containerClass} justify-start`}>
      { props.label ? <label className={props.labelClass}>{props.label}</label> : <></> }
      <input
        name={props.name}
        className={`w-full input input-bordered border-purple-500 ${props.inputClass}`}
        placeholder={props.placeholder}
        onChange={(e) => props.action ? props.action(e.target.value) : () => {} }
        value={props.value}
      />
    </div>
  );
}

export default InputField;
