import React, { useState } from "react";
import "./index.css";

const productData = {
  C8245: {
    segFloor: 9745,
    xeroxLease: 191.88,
    dllLease: 214.39,
  },
  B8255: {
    segFloor: 8455,
    xeroxLease: 166.48,
    dllLease: 186.01,
  },
  B8270: {
    segFloor: 11015,
    xeroxLease: 216.89,
    dllLease: 242.33,
  },
};

export default function LeaseDecisionApp() {
  const [product, setProduct] = useState("C8245");
  const [channel, setChannel] = useState("SEG");
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [roll, setRoll] = useState(0);
  const [buyout, setBuyout] = useState(0);
  const [result, setResult] = useState(null);

  const calculateDecision = () => {
    const data = productData[product];
    const cost = data.segFloor + parseFloat(roll) + parseFloat(buyout);
    const gpXerox = monthlyPayment * 66 - data.xeroxLease * 66 - cost;
    const gpDLL = monthlyPayment * 66 - data.dllLease * 66 - cost;

    const marginXerox = gpXerox / (monthlyPayment * 66);
    const marginDLL = gpDLL / (monthlyPayment * 66);

    const allowDLL = gpDLL - gpXerox > 300; // example threshold

    setResult({
      gpXerox: gpXerox.toFixed(2),
      gpDLL: gpDLL.toFixed(2),
      marginXerox: (marginXerox * 100).toFixed(2) + "%",
      marginDLL: (marginDLL * 100).toFixed(2) + "%",
      decision: allowDLL ? "YES - Use DLL" : "NO - Use Xerox",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Lease Evaluation Tool</h2>

        <select value={product} onChange={(e) => setProduct(e.target.value)}>
          {Object.keys(productData).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>

        <select value={channel} onChange={(e) => setChannel(e.target.value)}>
          <option value="SEG">SEG</option>
          <option value="Dealer">Dealer</option>
        </select>

        <input
          type="number"
          placeholder="Monthly Payment"
          value={monthlyPayment}
          onChange={(e) => setMonthlyPayment(parseFloat(e.target.value))}
        />

        <input
          type="number"
          placeholder="Roll (residual)"
          value={roll}
          onChange={(e) => setRoll(parseFloat(e.target.value))}
        />

        <input
          type="number"
          placeholder="Buyout (if any)"
          value={buyout}
          onChange={(e) => setBuyout(parseFloat(e.target.value))}
        />

        <button onClick={calculateDecision}>Evaluate</button>

        {result && (
          <div className="space-y-2 mt-4">
            <div>GP (Xerox): ${result.gpXerox}</div>
            <div>GP (DLL): ${result.gpDLL}</div>
            <div>Margin (Xerox): {result.marginXerox}</div>
            <div>Margin (DLL): {result.marginDLL}</div>
            <div className="font-bold text-lg">Decision: {result.decision}</div>
          </div>
        )}
      </div>
    </div>
  );
}
