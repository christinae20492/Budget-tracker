import { useLoaderData, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getEnvelopes, getLocalExpenses } from "~/utils/localStorage";
import {
  getBudgetLimits,
  getFormattedDate,
  totalSpend,
} from "~/utils/expenses";
import { warnToast } from "~/utils/toast";
import Layout from "~/components/ui/Layout";
import { useEffect, useState } from "react";
import AddEnvelope from "~/components/ui/EnvelopeModal";

export const loader: LoaderFunction = async () => {
  const expenses = await getLocalExpenses();
  const budgets = await getBudgetLimits();
  return json({ expenses, budgets });
};

export default function EnvelopesPage() {
  const navigate = useNavigate();
  const [envelopes, setEnvelopes] = useState([]);
  const [isEnvelopeModalVisible, setEnvelopeModalVisible] = useState(false);

  const fixedEnvelopes = envelopes.filter((env) => env.fixed === true);
  const variableEnvelopes = envelopes.filter((env) => env.fixed === false);

  const fetchData = async () => {
    const currentEnvelopes = await getEnvelopes();
    setEnvelopes(currentEnvelopes);
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchData();
      envelopes.forEach((envelope) => calculateRemainingBudget(envelope));
    };

    initializeData();
  }, []);
  const { expenses } = useLoaderData();

  function calculateTotalSpentToday() {
    const expenses = getLocalExpenses();
    const today = getFormattedDate();
    const total = expenses
      .filter((expense) => expense.date === today)
      .reduce((total, expense) => total + expense.amount, 0);

    return total;
  }

  const goToDetails = (env) => {
    const name = env.title;
    navigate(`./${name}`);
  };

  const calculateRemainingBudget = (envelope) => {
    const totalSpent = totalSpend(envelope);
    const remainingBudget = envelope.budget - totalSpent;

    if (remainingBudget <= 0 && envelope.fixed === true) {
      warnToast(`${envelope.title}'s budget has been exceeded for this month.`);
    } else if (remainingBudget <= 30 && envelope.fixed === true) {
      warnToast(
        `${envelope.title}'s budget is close to being exceeded. Only $${remainingBudget} left.`
      );
    }

    return remainingBudget;
  };

  const envelopeRender = (data, title) => {
    return (
      <div>
        <h3 className="envelope-container-title">{title}</h3>
        <div className="envelope-container">
          {data.map((env) => (
            <div key={env.title}>
              <div className="envelope" onClick={() => goToDetails(env)}>
                <p className="font-semibold">{env.title}</p>
                <p>
                  ${totalSpend(env)} spent from ${env.budget}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      {isEnvelopeModalVisible && (
        <AddEnvelope onClose={() => setEnvelopeModalVisible(false)} />
      )}

      <h1 className="text-2xl font-bold text-center">Budget Overview</h1>
      <h3 className="my-4">
        Total Daily Spending: ${calculateTotalSpentToday(expenses)}
      </h3>
      <button className="button" onClick={() => setEnvelopeModalVisible(true)}>
        Add Envelope
      </button>

      <main className="w-11/12 border border-gray-200 mx-auto mt-6 grid grid-rows-2">
        <div className="w-1/2">
          <div>{envelopeRender(fixedEnvelopes, "Fixed")}</div>
          <div>{envelopeRender(variableEnvelopes, "Variable")}</div>
        </div>
      </main>
    </Layout>
  );
}
