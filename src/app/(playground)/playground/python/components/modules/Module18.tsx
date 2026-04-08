"use client";
import React, { useState } from "react";
import { T } from "../python-constants";
import { PyBlock, OutBlock, Note, Hint, Quiz, Course, SLabel as SL } from "../python-shared";

function JsonExplorer() {
  const JSON_DATA = {
    employees: [
      { id: 1, name: "Amara Osei",  dept: "Engineering", salary: 85000, scores: { q1: 88, q2: 92 }, tags: ["senior","remote"] },
      { id: 2, name: "Bola Adeyemi", dept: "Analytics",  salary: 72000, scores: { q1: 79, q2: 85 }, tags: ["mid-level"] },
    ],
    meta: { total: 10, page: 1, currency: "NGN" },
  };
  const PATHS = [
    { label: "First employee", expr: `data["employees"][0]`,                     result: `{"id":1,"name":"Amara Osei","dept":"Engineering",...}` },
    { label: "Employee name",  expr: `data["employees"][0]["name"]`,              result: `"Amara Osei"` },
    { label: "All names",      expr: `[e["name"] for e in data["employees"]]`,    result: `["Amara Osei","Bola Adeyemi"]` },
    { label: "Nested score",   expr: `data["employees"][0]["scores"]["q1"]`,      result: `88` },
    { label: "Meta total",     expr: `data["meta"]["total"]`,                     result: `10` },
    { label: "All salaries",   expr: `[e["salary"] for e in data["employees"]]`,  result: `[85000, 72000]` },
  ];
  const [sel, setSel] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>Click a path to see how to navigate nested JSON. This is the exact pattern for parsing API responses.</Hint>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SL c={T.cyan}>JSON STRUCTURE</SL>
          <div style={{ background: "rgba(4,9,20,.9)", border: "1px solid rgba(34,211,238,.2)", borderRadius: 8, padding: "10px 14px", fontSize: 10, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.7, overflowY: "auto", maxHeight: 280 }}>
            <pre style={{ color: T.white, whiteSpace: "pre-wrap" }}>
              {JSON.stringify(JSON_DATA, null, 2).split("\n").map((line, i) => {
                const hasKey = line.match(/^(\s*)"([^"]+)":/);
                if (hasKey) return (
                  <div key={i}>
                    {line.slice(0, line.indexOf('"'))}
                    <span style={{ color: T.cyan }}>"{hasKey[2]}"</span>
                    {line.slice(line.indexOf(":"))}
                  </div>
                );
                return <div key={i} style={{ color: line.trim().startsWith('"') ? T.green : T.orange }}>{line}</div>;
              })}
            </pre>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SL c={T.cyan}>NAVIGATE THE DATA</SL>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {PATHS.map((p, i) => (
              <button key={i} onClick={() => setSel(i)} style={{ padding: "4px 9px", borderRadius: 7, fontSize: 9, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${sel === i ? T.cyan : "rgba(255,255,255,.08)"}`, background: sel === i ? "rgba(34,211,238,.12)" : "rgba(255,255,255,.02)", color: sel === i ? T.cyan : T.grey }}>{p.label}</button>
            ))}
          </div>
          <PyBlock code={`import json\n\nwith open("data.json") as f:\n    data = json.load(f)\n\n# Access:\n${PATHS[sel].expr}`} />
          <OutBlock label="Result">{PATHS[sel].result}</OutBlock>
        </div>
      </div>
    </div>
  );
}

export default function Module18() {
  return (
    <Course
      intro={{
        explain: "An API (Application Programming Interface) lets programs communicate over the internet. You send an HTTP request to a URL, the server processes it and sends back a response — almost always in JSON format, which maps directly to nested Python dicts and lists. In Python, the requests library handles the HTTP request, and pandas handles the data. This is how you pull live data from financial services, HR systems, CRMs, analytics platforms, and any modern business tool.",
        learn: [
          "Make HTTP GET requests with requests.get() and inspect the status and body",
          "Check the status code and parse the JSON response body into Python objects",
          "Navigate nested JSON safely to reach the fields you actually need",
          "Flatten a nested list of JSON records into a flat DataFrame using pd.json_normalize()",
        ],
        concepts: [
          "response.status_code == 200 means success — always check this before processing the body",
          "response.json() parses the JSON response body into Python dicts and lists automatically",
          "Nested access: data['employees'][0]['scores']['q1'] — chain brackets to navigate the structure",
          "pd.json_normalize(data) flattens nested keys into columns — 'scores.q1' becomes a column name",
        ],
        why: "Most live business data is served through APIs. CRMs, payroll systems, analytics tools, financial data providers. Being able to pull, parse, and load API data into pandas is one of the most in-demand practical skills in data work today.",
      }}
      c={T.cyan}
      steps={[
        {
          title: "JSON explorer",
          desc: "JSON (JavaScript Object Notation) is a text format that represents data as nested objects (like Python dicts) and arrays (like Python lists). When an API sends you a response and you call response.json(), Python parses that text into actual dict and list objects. You navigate the structure using bracket notation: data['employees'][0]['name'] means: take the employees key, take the first item in that list (index 0), then take the name key. Click the path buttons to see each navigation pattern with its code and result.",
          content: () => <JsonExplorer />,
        },
        {
          title: "Calling APIs",
          desc: "The requests library is the standard way to make HTTP requests in Python. requests.get(url) sends a GET request to the URL. The response object has two key attributes: .status_code (200 means OK, 404 means not found, 500 means server error) and .json() which parses the response body from JSON into Python objects. Always check the status code before processing. Use headers= to pass authentication tokens. Use params= to pass query parameters — requests builds the URL string for you.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.cyan}>APIs return JSON. The pattern is always: make request → check status → parse JSON → extract data → load to DataFrame.</Note>
              <PyBlock label="Python — requests + pandas" code={`import requests\nimport pandas as pd\n\n# Basic GET request:\nurl = "https://api.example.com/employees"\nresponse = requests.get(url)\n\n# Always check the status:\nif response.status_code == 200:\n    data = response.json()  # dict/list\nelse:\n    print(f"Error: {response.status_code}")\n\n# With auth headers:\nheaders = {"Authorization": "Bearer YOUR_TOKEN"}\nresponse = requests.get(url, headers=headers)\n\n# With query parameters:\nparams = {"dept": "Engineering", "active": True}\nresponse = requests.get(url, params=params)\n# → /employees?dept=Engineering&active=True\n\n# Response to DataFrame:\ndata = response.json()\ndf = pd.DataFrame(data["employees"])\n\n# Handle errors safely:\ntry:\n    response = requests.get(url, timeout=10)\n    response.raise_for_status()  # raises on 4xx/5xx\n    df = pd.DataFrame(response.json())\nexcept requests.exceptions.Timeout:\n    print("Request timed out")\nexcept requests.exceptions.HTTPError as e:\n    print(f"HTTP error: {e}")`} />
            </div>
          ),
        },
        {
          title: "Flatten nested JSON",
          desc: "API responses are almost always nested — a list of employee records where each record has nested address, scores, and contact objects. pd.DataFrame(data) only flattens one level. pd.json_normalize(data) goes deeper — it finds nested dicts and promotes their keys into columns using dot notation: 'scores.q1' becomes a column. For very deep nesting, use the record_path and meta parameters to specify exactly which nested array to expand and which top-level keys to include as metadata columns alongside it.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.cyan}>API responses are often deeply nested. <code>pd.json_normalize()</code> is the key tool for flattening them into a flat DataFrame.</Note>
              <PyBlock label="pandas — json_normalize" code={`import json\nimport pandas as pd\n\ndata = [\n    {"id":1,"name":"Amara","scores":{"q1":88,"q2":92},\n     "address":{"city":"Lagos","country":"Nigeria"}},\n    {"id":2,"name":"Bola","scores":{"q1":79,"q2":85},\n     "address":{"city":"Accra","country":"Ghana"}},\n]\n\n# pd.json_normalize — flattens nested structure:\ndf = pd.json_normalize(data)\n#    id   name  scores.q1  scores.q2  address.city  address.country\n# 0   1  Amara         88         92         Lagos          Nigeria\n# 1   2   Bola         79         85         Accra            Ghana\n\n# Rename the dot-separated columns:\ndf.columns = df.columns.str.replace(".", "_", regex=False)\n\n# For paginated APIs:\nall_pages = []\nfor page in range(1, total_pages+1):\n    r = requests.get(url, params={"page": page})\n    all_pages.extend(r.json()["data"])\ndf = pd.json_normalize(all_pages)`} />
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz c={T.cyan} questions={[
              {
                question: "response.json() after a requests.get() call returns what?",
                options: ["A JSON string", "A Python dict or list (parsed from the JSON response body)", "A bytes object", "A DataFrame"],
                correct: 1,
                explanation: ".json() parses the response body as JSON and returns the equivalent Python object — usually a dict or list. It's equivalent to json.loads(response.text). Call .json() only after confirming response.status_code == 200.",
              },
              {
                question: "What does response.raise_for_status() do?",
                options: ["Returns the status code", "Raises an HTTPError exception if status code is 4xx or 5xx", "Logs the status to stderr", "Always raises an exception"],
                correct: 1,
                explanation: ".raise_for_status() raises requests.exceptions.HTTPError for 4xx (client errors) and 5xx (server errors). For 2xx responses it does nothing. It's a clean pattern to crash-early on API failures rather than silently processing empty or error responses.",
              },
            ]} />
          ),
        },
      ]}
    />
  );
}
