import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { getLocalExpenses } from "~/utils/localStorage";
import { getEnvelopes } from "~/utils/localStorage";

export const loader: LoaderFunction = async ({ params }) => {
  const { env } = params; // Get envelope title from URL
  if (!env) {
    throw new Response("Envelope not found", { status: 404 });
  }

  const envelopes = getEnvelopes();
  const selectedEnvelope = envelopes.find((e) => e.title === env);

  if (!selectedEnvelope) {
    throw new Response("Envelope does not exist", { status: 404 });
  }

  const expenses = getLocalExpenses().filter((expense) => expense.envelope === env);

  return json({ envelope: selectedEnvelope, expenses });
};

export default function EditEnvelope() {
    const { envelope, expenses } = useLoaderData();
  const { env } = useParams(); // Get envelope title from URL

  return (
    <div className="edit-envelope">
      <h1>Modify {envelope.title} Expenses</h1>

      {expenses.length > 0 ? (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              {expense.location} - ${expense.amount}
              <button
                className="button bg-red-500 text-white ml-2"
                onClick={() => handleDelete(expense.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses recorded for {env}.</p>
      )}
    </div>
  );
}