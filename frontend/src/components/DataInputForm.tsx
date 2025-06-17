import React, { useState } from 'react';

interface ScoreChange {
  score: number;
  change: number;
}

export interface CompanyInfo {
  name: string;
  industry: string;
  primaryColor: string;
  secondaryColor: string;
  logoDesc: string;
  reportPeriod: string;
}

export interface InputData {
  fleetScores: {
    corporate: ScoreChange;
    greatLakes: ScoreChange;
    ohioValley: ScoreChange;
    southeast: ScoreChange;
  };
  hosViolations: { total: number };
  safetyEvents: { total: number };
  unassignedDriving: { total: number };
  speedingEvents: { total: number };
  personalConveyance: { total: number };
  missedDVIR: { total: number };
  contacts: string[];
}

interface DataInputFormProps {
  onGenerate: (
    company: CompanyInfo,
    input: InputData,
    sections: { title: string; markdown: string }[]
  ) => void;
}

export default function DataInputForm({ onGenerate }: DataInputFormProps) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    industry: '',
    primaryColor: '',
    secondaryColor: '',
    logoDesc: '',
    reportPeriod: '',
  });

  const [inputData, setInputData] = useState<InputData>({
    fleetScores: {
      corporate: { score: 0, change: 0 },
      greatLakes: { score: 0, change: 0 },
      ohioValley: { score: 0, change: 0 },
      southeast: { score: 0, change: 0 },
    },
    hosViolations: { total: 0 },
    safetyEvents: { total: 0 },
    unassignedDriving: { total: 0 },
    speedingEvents: { total: 0 },
    personalConveyance: { total: 0 },
    missedDVIR: { total: 0 },
    contacts: [''],
  });

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFleetScoreChange = (
    region: keyof InputData['fleetScores'],
    field: keyof ScoreChange,
    value: number
  ) => {
    setInputData((prev) => ({
      ...prev,
      fleetScores: {
        ...prev.fleetScores,
        [region]: { ...prev.fleetScores[region], [field]: value },
      },
    }));
  };

  const handleSimpleFieldChange = (
    section:
      | 'hosViolations'
      | 'safetyEvents'
      | 'unassignedDriving'
      | 'speedingEvents'
      | 'personalConveyance'
      | 'missedDVIR',
    value: number
  ) => {
    setInputData((prev) => ({
      ...prev,
      [section]: { total: value },
    }));
  };

  const handleContactChange = (index: number, value: string) => {
    setInputData((prev) => {
      const contacts = [...prev.contacts];
      contacts[index] = value;
      return { ...prev, contacts };
    });
  };

  const addContact = () => {
    setInputData((prev) => ({ ...prev, contacts: [...prev.contacts, ''] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('https://e95c0299-36c1-478e-ae78-e8d54752607f-00-2hnwn7mdyqnxz.worf.replit.dev/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyInfo, inputData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.sections) {
          onGenerate(companyInfo, inputData, data.sections);
        }
      })
      .catch(console.error);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold">Company Info</h2>
      {(
        [
          'name',
          'industry',
          'primaryColor',
          'secondaryColor',
          'logoDesc',
          'reportPeriod',
        ] as (keyof CompanyInfo)[]
      ).map((field) => (
        <div key={field} className="flex flex-col">
          <label className="font-medium capitalize" htmlFor={field}>
            {field}
          </label>
          <input
            id={field}
            name={field}
            type="text"
            className="border p-2"
            value={companyInfo[field]}
            onChange={handleCompanyChange}
          />
        </div>
      ))}

      <h2 className="text-xl font-bold">Fleet Scores</h2>
      {(['corporate', 'greatLakes', 'ohioValley', 'southeast'] as const).map(
        (region) => (
          <div key={region} className="grid grid-cols-3 gap-2">
            <span className="capitalize self-center">{region}</span>
            <input
              type="number"
              className="border p-2"
              value={inputData.fleetScores[region].score}
              onChange={(e) =>
                handleFleetScoreChange(
                  region,
                  'score',
                  Number(e.target.value)
                )
              }
            />
            <input
              type="number"
              className="border p-2"
              value={inputData.fleetScores[region].change}
              onChange={(e) =>
                handleFleetScoreChange(
                  region,
                  'change',
                  Number(e.target.value)
                )
              }
            />
          </div>
        )
      )}

      {(
        [
          'hosViolations',
          'safetyEvents',
          'unassignedDriving',
          'speedingEvents',
          'personalConveyance',
          'missedDVIR',
        ] as const
      ).map((field) => (
        <div key={field} className="flex flex-col">
          <label className="font-medium capitalize" htmlFor={field}>
            {field}
          </label>
          <input
            id={field}
            type="number"
            className="border p-2"
            value={(inputData as any)[field].total}
            onChange={(e) =>
              handleSimpleFieldChange(field, Number(e.target.value))
            }
          />
        </div>
      ))}

      <h2 className="text-xl font-bold">Contacts</h2>
      {inputData.contacts.map((contact, idx) => (
        <input
          key={idx}
          type="email"
          className="border p-2 mb-2 w-full"
          value={contact}
          onChange={(e) => handleContactChange(idx, e.target.value)}
        />
      ))}
      <button
        type="button"
        className="bg-blue-500 text-white px-3 py-1"
        onClick={addContact}
      >
        Add Contact
      </button>

      <button
        type="submit"
        className="block bg-green-600 text-white px-4 py-2 mt-4"
      >
        Submit
      </button>
    </form>
  );
}
