import { useState } from "react";
import { createEnvelope, Envelope, getEnvelopes } from "~/utils/localStorage";
import { successToast, warnToast } from "~/utils/toast";
import { envelopeColorsList } from "~/utils/colors";

interface EnvelopeModalProps {
  onClose: () => void;
}

export default function AddEnvelope({ onClose }: EnvelopeModalProps) {
  const [title, setTitle] = useState("");
  const [fixed, setFixed] = useState("");
  const [budget, setBudget] = useState<number>(0);
 const [comments, setComments] = useState("");
  const envelopes = getEnvelopes();

  const pickEnvelopeColor = (): string =>{
    for (const color of envelopeColorsList) {
      const isColorInUse = envelopes.some((envelope) => envelope.color === color);
      if (!isColorInUse) {
        return color;
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !fixed || !budget) {
      warnToast("Please fill in all required fields.");
      return;
    }

    const isFixed = () => {
      if (fixed === "set") {
        return true;
      } else {
        return false;
      }
    };

   const assignedColor = pickEnvelopeColor();

    const newEnvelope: Envelope = {
      title,
      fixed: isFixed(),
      expenses: [],
      icon: "",
      budget,
      color:assignedColor,
      comments,
    };

    createEnvelope(newEnvelope);
    successToast(`"${newEnvelope.title}" envelope created`);

    setTitle("");
    setFixed("");
    setBudget(0);
    onClose();
  };

  return (
    <div className="modal-bg">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-main">
        <h2 className="text-center">Create an Envelope</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Is this budget <span className="font-semibold">set</span>, or{" "}
              <span className="font-semibold">variable</span>?
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fixed"
              name="fixed"
              value={fixed}
              onChange={(e) => setFixed(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Total Allowance ($)<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value))}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700">
              Comments?
            </label>
            <input 
            type="text"
            id="comments"
            name="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 rounded-md hover:neg-item"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
