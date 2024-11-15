import { MetaFunction, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { getEnvelopes } from "~/utils/localStorage";
import Layout from "~/components/ui/Layout";
import { useEffect, useState } from "react";
import { warnToast } from "~/utils/toast";

export const meta: MetaFunction = ({ name }) => {
  return [
    { title: name ? name : "View Envelope" },
    { name: "description", content: "View your envelope" },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const envelopeName = params.envelope;
  if (!envelopeName) {
    throw new Response("Envelope not found", { status: 404 });
  }
  return envelopeName;
};

export default function EnvelopeDetails() {
  const envelopeName = useLoaderData();
  const [envelope, setEnvelope] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [mostFrequentLocation, setMostFrequentLocation] = useState("");

  useEffect(() => {
    const fetchData = () => {
      const envelopes = getEnvelopes();
      const currentEnvelope = envelopes.find(
        (env) => envelopeName === env.title
      );

      if (currentEnvelope) {
        setEnvelope(currentEnvelope);
        setExpenses(currentEnvelope.expenses || []);

        const total = currentEnvelope.expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        setTotalSpent(total);

        if (currentEnvelope.fixed && total > currentEnvelope.budget) {
          warnToast("Warning: Budget exceeded for this fixed envelope!");
        }

        const locationFrequency = currentEnvelope.expenses.reduce(
          (acc, expense) => {
            acc[expense.location] = (acc[expense.location] || 0) + 1;
            return acc;
          },
          {}
        );

        const frequentLocation = Object.keys(locationFrequency).reduce((a, b) =>
          locationFrequency[a] > locationFrequency[b] ? a : b
        );
        setMostFrequentLocation(frequentLocation);
      }
    };

    fetchData();
  }, [envelopeName]);

  if (!envelope) {
    return <div>Envelope not found</div>;
  }

  return (
    <Layout>
      <h1 className="text-center">{envelope.title}'s Details</h1>
      <p>Budget: ${envelope.budget}</p>
      <p>Total Spent: ${totalSpent}</p>

      <ul>
        {expenses.map((expense, index) => (
          <li
            key={index}
            className={
              expense.location === mostFrequentLocation
                ? "font-bold text-blue-500"
                : ""
            }
          >
            {expense.location}: ${expense.amount}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
