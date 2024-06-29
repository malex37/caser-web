'use client'
import CreateFolder from "@api/CreateFolder";
import ComposableForm from "@components/molecules/ComposableForm";


export default function NewFolder({ modalId }: { modalId: string }): JSX.Element {

  return (
    <div className="flex flex-col">
      <div className="w-full text-xl">
        <p>New Folder</p>
      </div>
      <div>
        <ComposableForm action={CreateFolder} submitButtonText="Create" modalId={modalId} onSuccess={'dismiss'}>
          <label>Folder name: </label>
          <input
            type="text"
            className="w-full input border-moonstone-700 focus:border-carrot_orange"
            name="name"
            required
          />
          <label>Client name:</label>
          <input
            type="text"
            className="w-full input border-moonstone-700"
            name="client"
            required
          />
          <label>Case type:</label>
          <input
            type="text"
            className="w-full input border-moonstone-700"
            name="caseType"
            required
          />
          <label>Judge:</label>
          <input
            type="text"
            className="w-full input border-moonstone-700"
            name="judge"
          />
          <label>County:</label>
          <input
            type="text"
            className="w-full input border-moonstone-700"
            name="county"
            required
          />
        </ComposableForm>
      </div>
    </div>
  );
}
