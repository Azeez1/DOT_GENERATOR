import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { CompanyInfo, InputData } from './DataInputForm';

interface DashboardViewProps {
  companyInfo: CompanyInfo;
  inputData: InputData;
  aiSections: { title: string; markdown: string }[];
}

const COLORS = ['#2563eb', '#dc2626', '#10b981', '#facc15'];

export default function DashboardView({ companyInfo, inputData, aiSections }: DashboardViewProps) {
  const scoreCards = Object.entries(inputData.fleetScores);
  const violationData = Object.entries(inputData.hosViolations).map(([name, value]) => ({ name, value }));
  const pieData = Object.entries(inputData.speedingEvents).map(([name, value]) => ({ name, value }));
  const lineData = [
    { week: 'Week 1', value: 0 },
    { week: 'Week 2', value: 0 },
    { week: 'Week 3', value: 0 },
    { week: 'Week 4', value: 0 },
  ];

  return (
    <div id="full-report" className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {scoreCards.map(([region, { score, change }]) => (
          <div key={region} className="border p-4 rounded shadow">
            <h3 className="font-semibold capitalize">{region}</h3>
            <p className="text-2xl font-bold">{score}</p>
            <p className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
              {change >= 0 ? '+' : ''}
              {change}
            </p>
          </div>
        ))}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={violationData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" stackId="a" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#dc2626" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="border p-4 rounded shadow">
          <h4 className="font-semibold">Safety Events</h4>
          <p className="text-xl">{inputData.safetyEvents.total}</p>
        </div>
        <div className="border p-4 rounded shadow">
          <h4 className="font-semibold">Unassigned Driving</h4>
          <p className="text-xl">{inputData.unassignedDriving.total}</p>
        </div>
        <div className="border p-4 rounded shadow">
          <h4 className="font-semibold">Personal Conveyance</h4>
          <p className="text-xl">
            { /* model only has a single numeric value */ }
            {inputData.personalConveyance.total}
          </p>
        </div>
        <div className="border p-4 rounded shadow">
          <h4 className="font-semibold">Missed DVIR</h4>
          <p className="text-xl">{inputData.missedDVIR.total}</p>
        </div>
      </div>

      {aiSections.map((sec) => (
        <div key={sec.title} className="prose mt-6">
          <h2>{sec.title}</h2>
          <ReactMarkdown>{sec.markdown}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
}
