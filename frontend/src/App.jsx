import React, { useState, useEffect, useMemo } from "react";
import LandingPage from "./components/pages/LandingPage";

// Import from your original file (temporarily)
// We'll keep PDFSanitizerApp.jsx as-is and extract from it gradually
import { NewClientSetupPage, ExistingClientPage } from "./PDFSanitizerApp-Dummy";

// Utils
const API_BASE = String(process.env.REACT_APP_API_BASE || "").replace(/\/+$/, "");

function isPdf(file) {
  if (!file || typeof file.name !== "string") return false;
  const ext = file.name.toLowerCase().endsWith(".pdf");
  const mime = file.type === "application/pdf" || file.type === "";
  return ext || mime;
}

export default function App() {
  // Routing state
  const [stage, setStage] = useState("home"); // 'home' | 'newClient' | 'existingClient'

  // File state
  const [files, setFiles] = useState([]);

  // Template state
  const [existingTemplates, setExistingTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  // Secondary processing state
  const [pendingSecondary, setPendingSecondary] = useState(null);

  // Load existing templates on mount
  useEffect(() => {
    (async () => {
      setIsLoadingTemplates(true);
      try {
        const res = await fetch(`${API_BASE}/api/clients`);
        const data = await res.json();
        setExistingTemplates(Array.isArray(data.clients) ? data.clients : []);
      } catch (e) {
        console.warn("Failed to load templates", e);
        setExistingTemplates([]);
      } finally {
        setIsLoadingTemplates(false);
      }
    })();
  }, []);

  // File handlers
  const handleFileAdd = (incomingFiles) => {
    const pdfs = incomingFiles.filter((f) => {
      const ok = isPdf(f);
      if (!ok) alert(`"${f.name}" is not a PDF and was skipped.`);
      return ok;
    });

    const key = (f) => `${f.name}::${f.size}`;
    const existing = new Set(files.map(key));
    const merged = [...files];
    for (const f of pdfs) {
      if (!existing.has(key(f))) merged.push(f);
    }
    setFiles(merged);
  };

  const handleFileRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Continue handler
  const handleContinue = () => {
    if (selectedTemplate === "new") {
      setStage("newClient");
    } else {
      setStage("existingClient");
    }
  };

  // Back to home handler
  const handleBackToHome = () => {
    setStage("home");
  };

  // Calculate client name based on selection
  const clientName = useMemo(() => {
    if (selectedTemplate === "new") {
      return newTemplateName.trim();
    }
    return selectedTemplate;
  }, [selectedTemplate, newTemplateName]);

  // Secondary processing handlers
  const handleTreatAsNew = () => {
    setStage("newClient");
  };

  const handleProceedSecondary = async (lowConf, client) => {
    // Download sanitized PDFs for secondary processing
    const targets = (lowConf || []).map((it) => {
      const base = (it.pdf || "").split(/[\\/]/).pop() || "";
      return `${base.replace(/\.pdf$/i, "")}_sanitized.pdf`;
    });

    const fetched = [];
    for (const name of targets) {
      try {
        const url = `${API_BASE}/api/download/${encodeURIComponent(name)}`;
        const resp = await fetch(url);
        if (!resp.ok) continue;
        const blob = await resp.blob();
        fetched.push(new File([blob], name, { type: "application/pdf" }));
      } catch (e) {
        console.warn("Failed to fetch sanitized file:", name, e);
      }
    }

    if (!fetched.length) {
      alert("Could not auto-load low-confidence PDFs for secondary.");
      return;
    }

    setPendingSecondary({ files: fetched, client, lowConf });
    setStage("newClient");
  };

  // Clear pending secondary after use
  useEffect(() => {
    if (stage !== "newClient") return;
    if (!pendingSecondary) return;
    const t = setTimeout(() => setPendingSecondary(null), 0);
    return () => clearTimeout(t);
  }, [stage, pendingSecondary]);

  // Render based on stage
  if (stage === "home") {
    return (
      <LandingPage
        files={files}
        onFileAdd={handleFileAdd}
        onFileRemove={handleFileRemove}
        existingTemplates={existingTemplates}
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
        newTemplateName={newTemplateName}
        onNewTemplateNameChange={setNewTemplateName}
        onContinue={handleContinue}
        isLoading={isLoadingTemplates}
      />
    );
  }

  if (stage === "newClient") {
    return (
      <NewClientSetupPage
        pdfFiles={files}
        clientName={clientName}
        onBack={handleBackToHome}
        initialSecondary={pendingSecondary}
      />
    );
  }

  if (stage === "existingClient") {
    return (
      <ExistingClientPage
        pdfFiles={files}
        clientName={clientName}
        onBack={handleBackToHome}
        onTreatAsNew={handleTreatAsNew}
        onProceedSecondary={handleProceedSecondary}
      />
    );
  }

  return null;
}