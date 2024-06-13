export interface ModalContainerProps {
  buttonText: string;
  modalId: string;
  children: any;
  additionalClassNames?: string;
}

const ModalContainer = (props: ModalContainerProps) => {
  function showModal(id: string) {
    //@ts-ignore next-line
    document.getElementById(id).showModal();
  }

  function closeModal(id: string) {
    //@ts-ignore next-line
    document.getElementById(id).close();
  }

  return(
    <span>
      <button className={`btn btn-sm ${props.additionalClassNames}`} onClick={()=> showModal(props.modalId)}>{props.buttonText}</button>
      <dialog id={props.modalId} className='modal'>
        <div className='modal-box'>
        {props.children}
        <div>
            <button className='btn btn-sm' onClick={()=>closeModal(props.modalId)}>Close</button>
        </div>
        </div>
      </dialog>
    </span>
  );
}

export default ModalContainer;
