"use client";

import React, { useState, useEffect } from "react";
import { 
  Terminal, Database, GitBranch, Cpu, Play, CheckCircle2, AlertTriangle, 
  ArrowRight, Shield, Layers, Code2, RefreshCw, Clock
} from "lucide-react";

// Types for SQL logs
interface SqlLog {
  logId: string;
  action: string;
  logDate: string;
  adminName: string;
  adminEmail: string;
  medicineName: string;
  sku: string;
  price: number;
}

export default function DeveloperHubPage() {
  const [activeTab, setActiveTab] = useState<"ai" | "js" | "sql" | "git" | "http">("ai");

  // ==========================================
  // AI & PROMPTING STATE & LOGIC
  // ==========================================
  const [geminiKey, setGeminiKey] = useState<string>("");
  const [isEnvKeySet, setIsEnvKeySet] = useState<boolean>(false);
  const [aiInput, setAiInput] = useState({
    name: "Aspirin Extra",
    sku: "ASP-987-X",
    formulation: "Tablet 500mg Oral",
    price: "12.50",
    expiryDate: "2027-12-31",
    vendor: "Bayer Healthcare",
    composition: "Aspirin (Acetylsalicylic Acid) 500mg, Caffeine 50mg",
    description: "Pain reliever and fever reducer containing caffeine for enhanced effectiveness."
  });
  interface AuditReport {
    success: boolean;
    isMock: boolean;
    rawJson: {
      isCompliant: boolean;
      complianceScore: number;
      auditObservations: string[];
      riskFactors?: string[];
      activeIngredientsCheck?: string;
      regulatoryMatches?: string[];
      recommendation?: string;
      reason?: string;
      extractedChemicals?: string[];
      flags: string[];
      safetyConcerns: string[];
    };
    statusCode: number;
    systemInstruction: string;
    error?: string;
  }

  const [aiReport, setAiReport] = useState<AuditReport | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>("");

  useEffect(() => {
    // Check if env key is set (we can query a lightweight mock check or session check)
    // For safety, we mask the env key status in client.
    const checkEnv = async () => {
      try {
        const res = await fetch("/api/profile"); // Just check connection/status
        if (res.ok) {
          // If the profile request succeeds, we know backend env is initialized
          setIsEnvKeySet(true);
        }
      } catch {}
    };
    checkEnv();
  }, []);

  const runAiAudit = async () => {
    setAiLoading(true);
    setAiError("");
    setAiReport(null);
    try {
      const response = await fetch("/api/ai/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-key": geminiKey,
        },
        body: JSON.stringify(aiInput),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP Error ${response.status}`);
      }
      setAiReport(data);
    } catch (err: unknown) {
      const error = err as Error;
      setAiError(error.message || "Failed to run audit");
    } finally {
      setAiLoading(false);
    }
  };

  // ==========================================
  // JS ENGINE SANDBOX STATE & LOGIC
  // ==========================================
  const [jsSubTab, setJsSubTab] = useState<"eventloop" | "closures" | "hoisting" | "async" | "promises">("eventloop");

  // Event Loop Visualizer
  const [callStack, setCallStack] = useState<string[]>([]);
  const [webApis, setWebApis] = useState<string[]>([]);
  const [microtasks, setMicrotasks] = useState<string[]>([]);
  const [macrotasks, setMacrotasks] = useState<string[]>([]);
  const [jsConsole, setJsConsole] = useState<string[]>([]);
  const [isLoopRunning, setIsLoopRunning] = useState<boolean>(false);

  const clearEventLoop = () => {
    setCallStack([]);
    setWebApis([]);
    setMicrotasks([]);
    setMacrotasks([]);
    setJsConsole([]);
    setIsLoopRunning(false);
  };

  const logToConsole = (msg: string) => {
    setJsConsole(prev => [...prev, `[Console] ${msg}`]);
  };

  const addSyncLog = () => {
    setJsConsole(prev => [...prev, `[Added] Synchronous log statement`]);
    setCallStack(prev => [...prev, "console.log('Sync Code')"]);
    setTimeout(() => {
      logToConsole("Sync Code");
      setCallStack(prev => prev.filter(x => x !== "console.log('Sync Code')"));
    }, 600);
  };

  const addTimeoutTask = () => {
    setJsConsole(prev => [...prev, `[Added] setTimeout(..., 1000)`]);
    setCallStack(prev => [...prev, "setTimeout(...)"]);
    setTimeout(() => {
      setCallStack(prev => prev.filter(x => x !== "setTimeout(...)"));
      setWebApis(prev => [...prev, "Timer (1000ms)"]);
      
      setTimeout(() => {
        setWebApis(prev => prev.filter(x => x !== "Timer (1000ms)"));
        setMacrotasks(prev => [...prev, "cb: setTimeout callback"]);
        setJsConsole(prev => [...prev, `[Scheduled] Timeout callback moved to MacroTask Queue`]);
      }, 1000);
    }, 600);
  };

  const addPromiseTask = () => {
    setJsConsole(prev => [...prev, `[Added] Promise.resolve().then(...)`]);
    setCallStack(prev => [...prev, "Promise.resolve()"]);
    setTimeout(() => {
      setCallStack(prev => prev.filter(x => x !== "Promise.resolve()"));
      setMicrotasks(prev => [...prev, "cb: Promise resolution"]);
      setJsConsole(prev => [...prev, `[Scheduled] Promise callback moved to MicroTask (Job) Queue`]);
    }, 600);
  };

  const runEventLoopTick = () => {
    if (isLoopRunning) return;
    setIsLoopRunning(true);

    const tick = () => {
      // 1. If microtasks has items, resolve all of them first
      if (microtasks.length > 0) {
        const nextMicro = microtasks[0];
        setCallStack([`Executing: ${nextMicro}`]);
        setMicrotasks(prev => prev.slice(1));
        
        setTimeout(() => {
          logToConsole("Microtask complete: resolved Promise output!");
          setCallStack([]);
          setTimeout(tick, 600);
        }, 800);
        return;
      }

      // 2. If no microtasks, take ONE macrotask
      if (macrotasks.length > 0) {
        const nextMacro = macrotasks[0];
        setCallStack([`Executing: ${nextMacro}`]);
        setMacrotasks(prev => prev.slice(1));
        
        setTimeout(() => {
          logToConsole("Macrotask complete: executed setTimeout output!");
          setCallStack([]);
          setTimeout(tick, 600);
        }, 800);
        return;
      }

      setIsLoopRunning(false);
      logToConsole("Call Stack and Queues are empty. Event loop idle.");
    };

    setTimeout(tick, 300);
  };

  // Closures Sandbox
  const [closureMultiplier, setClosureMultiplier] = useState<number>(5);
  const [closureInputVal, setClosureInputVal] = useState<number>(10);
  const [createdClosures, setCreatedClosures] = useState<{ id: string; mult: number; code: string }[]>([
    { id: "mult5", mult: 5, code: "const multiplyBy5 = createMultiplier(5);" }
  ]);
  const [closureLogs, setClosureLogs] = useState<string[]>([]);

  const generateClosure = () => {
    const id = `mult_${closureMultiplier}_${Date.now().toString().slice(-4)}`;
    setCreatedClosures(prev => [
      ...prev,
      {
        id,
        mult: closureMultiplier,
        code: `const multiplyBy${closureMultiplier} = createMultiplier(${closureMultiplier});`
      }
    ]);
    setClosureLogs(prev => [...prev, `Created new closure retaining: multiplier = ${closureMultiplier}`]);
  };

  const runClosure = (multVal: number) => {
    // Standard closure logic
    const createMultiplier = (factor: number) => {
      // factor remains enclosed in scope
      return (val: number) => val * factor;
    };
    const multiplierFunc = createMultiplier(multVal);
    const result = multiplierFunc(closureInputVal);
    setClosureLogs(prev => [
      ...prev,
      `Invoked multiplyBy${multVal}(${closureInputVal}) -> Result: ${result} (Retrieved enclosed multiplier ${multVal} from scope!)`
    ]);
  };

  // Hoisting Visualizer
  const [hoistingType, setHoistingType] = useState<"var" | "let" | "function">("var");

  const { compilationPhase, executionPhase } = (() => {
    if (hoistingType === "var") {
      return {
        compilationPhase:
          "// Compilation Phase:\n" +
          "var a = undefined; // Variable 'a' is registered and initialized to undefined at the top of the scope.",
        executionPhase:
          "// Execution Phase:\n" +
          "console.log(a); // Output: undefined (no error, variable exists!)\n" +
          "a = 10; // Value is assigned only here."
      };
    } else if (hoistingType === "let") {
      return {
        compilationPhase:
          "// Compilation Phase:\n" +
          "let b; // Variable 'b' is registered but NOT initialized. It enters the Temporal Dead Zone (TDZ).",
        executionPhase:
          "// Execution Phase:\n" +
          "console.log(b); // ReferenceError: Cannot access 'b' before initialization!\n" +
          "b = 20; // TDZ ends here after initialization statement."
      };
    } else {
      return {
        compilationPhase:
          "// Compilation Phase:\n" +
          "function greet() { return 'Hello'; } // Entire function declaration is hoisted and fully loaded in memory.",
        executionPhase:
          "// Execution Phase:\n" +
          "console.log(greet()); // Output: 'Hello' (works perfectly before the definition line!)\n" +
          "// ... actual function code sits here"
      };
    }
  })();

  // Async/Await tasks
  const [asyncMode, setAsyncMode] = useState<"sequential" | "parallel">("sequential");
  const [asyncResults, setAsyncResults] = useState<{ id: string; time: number; status: string }[]>([]);
  const [asyncLogs, setAsyncLogs] = useState<string[]>([]);
  const [asyncRunning, setAsyncRunning] = useState<boolean>(false);
  const [asyncTotalTime, setAsyncTotalTime] = useState<number>(0);

  const startAsyncDemo = async () => {
    setAsyncRunning(true);
    setAsyncResults([]);
    setAsyncLogs([]);
    const startTime = Date.now();

    const fetchTask = (id: string, delay: number) => {
      return new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(`Task ${id} resolved`);
        }, delay);
      });
    };

    if (asyncMode === "sequential") {
      setAsyncLogs(prev => [...prev, "Starting sequential tasks using: await task1; await task2; await task3;"]);
      
      const t1Start = Date.now();
      setAsyncResults(prev => [...prev, { id: "API 1: Get Vendor Credentials", time: 0, status: "Pending" }]);
      await fetchTask("1", 1000);
      setAsyncResults(prev => prev.map(r => r.id === "API 1: Get Vendor Credentials" ? { ...r, time: Date.now() - t1Start, status: "Done" } : r));
      setAsyncLogs(prev => [...prev, `[Resolved] API 1 completed in 1000ms`]);

      const t2Start = Date.now();
      setAsyncResults(prev => [...prev, { id: "API 2: Get Formulation Safety Index", time: 0, status: "Pending" }]);
      await fetchTask("2", 1200);
      setAsyncResults(prev => prev.map(r => r.id === "API 2: Get Formulation Safety Index" ? { ...r, time: Date.now() - t2Start, status: "Done" } : r));
      setAsyncLogs(prev => [...prev, `[Resolved] API 2 completed in 1200ms`]);

      const t3Start = Date.now();
      setAsyncResults(prev => [...prev, { id: "API 3: Validate Listing Pricing Rules", time: 0, status: "Pending" }]);
      await fetchTask("3", 800);
      setAsyncResults(prev => prev.map(r => r.id === "API 3: Validate Listing Pricing Rules" ? { ...r, time: Date.now() - t3Start, status: "Done" } : r));
      setAsyncLogs(prev => [...prev, `[Resolved] API 3 completed in 800ms`]);

    } else {
      setAsyncLogs(prev => [...prev, "Starting parallel tasks using: await Promise.all([task1, task2, task3]);"]);
      setAsyncResults([
        { id: "API 1: Get Vendor Credentials", time: 0, status: "Pending" },
        { id: "API 2: Get Formulation Safety Index", time: 0, status: "Pending" },
        { id: "API 3: Validate Listing Pricing Rules", time: 0, status: "Pending" }
      ]);

      const t1 = Date.now();
      const p1 = fetchTask("1", 1000).then(() => {
        setAsyncResults(prev => prev.map(r => r.id === "API 1: Get Vendor Credentials" ? { ...r, time: Date.now() - t1, status: "Done" } : r));
        setAsyncLogs(prev => [...prev, `[Resolved] API 1 completed in 1000ms`]);
      });

      const t2 = Date.now();
      const p2 = fetchTask("2", 1200).then(() => {
        setAsyncResults(prev => prev.map(r => r.id === "API 2: Get Formulation Safety Index" ? { ...r, time: Date.now() - t2, status: "Done" } : r));
        setAsyncLogs(prev => [...prev, `[Resolved] API 2 completed in 1200ms`]);
      });

      const t3 = Date.now();
      const p3 = fetchTask("3", 800).then(() => {
        setAsyncResults(prev => prev.map(r => r.id === "API 3: Validate Listing Pricing Rules" ? { ...r, time: Date.now() - t3, status: "Done" } : r));
        setAsyncLogs(prev => [...prev, `[Resolved] API 3 completed in 800ms`]);
      });

      await Promise.all([p1, p2, p3]);
    }

    setAsyncTotalTime(Date.now() - startTime);
    setAsyncRunning(false);
  };

  // Promises vs Callbacks comparison
  const [promLogs, setPromLogs] = useState<string[]>([]);
  const runCallbacksDemo = () => {
    setPromLogs([]);
    setPromLogs(prev => [...prev, "Initiating nested callbacks (Callback Hell)..."]);
    
    // Callback flow simulating nesting
    setTimeout(() => {
      setPromLogs(prev => [...prev, "Step 1: User details loaded via callback(userId)"]);
      setTimeout(() => {
        setPromLogs(prev => [...prev, "  Step 2: Listing ID matched via callback(details)"]);
        setTimeout(() => {
          setPromLogs(prev => [...prev, "    Step 3: Audit logged successfully via callback(auditId)"]);
          setPromLogs(prev => [...prev, "✓ Callback workflow complete. Hard to read, pyramid structure!"]);
        }, 600);
      }, 600);
    }, 600);
  };

  const runPromisesDemo = () => {
    setPromLogs([]);
    setPromLogs(prev => [...prev, "Initiating Promise chaining..."]);

    const step1 = () => new Promise(res => setTimeout(() => res("User details loaded"), 600));
    const step2 = () => new Promise(res => setTimeout(() => res("Listing ID matched"), 600));
    const step3 = () => new Promise(res => setTimeout(() => res("Audit logged successfully"), 600));

    step1()
      .then(r1 => {
        setPromLogs(prev => [...prev, `Step 1: ${r1}`]);
        return step2();
      })
      .then(r2 => {
        setPromLogs(prev => [...prev, `  Step 2: ${r2}`]);
        return step3();
      })
      .then(r3 => {
        setPromLogs(prev => [...prev, `    Step 3: ${r3}`]);
        setPromLogs(prev => [...prev, "✓ Promise chain complete. Flat structure, highly chainable!"]);
      });
  };

  // ==========================================
  // SQL JOINs STATE & LOGIC
  // ==========================================
  const [joinType, setJoinType] = useState<"INNER" | "LEFT" | "RIGHT" | "FULL">("INNER");
  const [sqlResult, setSqlResult] = useState<SqlLog[]>([]);
  const [sqlQueryText, setSqlQueryText] = useState<string>("");
  const [sqlLoading, setSqlLoading] = useState<boolean>(false);
  const [sqlError, setSqlError] = useState<string>("");

  const executeJoinQuery = async () => {
    setSqlLoading(true);
    setSqlError("");
    setSqlResult([]);
    try {
      const response = await fetch("/api/dev/sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ joinType }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      setSqlQueryText(data.query);
      setSqlResult(data.data);
    } catch (err: unknown) {
      const error = err as Error;
      setSqlError(error.message || "Failed to query raw database joins");
    } finally {
      setSqlLoading(false);
    }
  };

  // ==========================================
  // GIT WORKFLOW STATE & LOGIC
  // ==========================================
  const [gitCommits, setGitCommits] = useState<{ id: string; msg: string; branch: string; parent: string | null }[]>([
    { id: "c1", msg: "Initial setup", branch: "main", parent: null },
    { id: "c2", msg: "Add User/Admin authentication", branch: "main", parent: "c1" },
    { id: "c3", msg: "Implement basic review listing queues", branch: "main", parent: "c2" },
  ]);
  const [currentBranch, setCurrentBranch] = useState<string>("main");
  const [gitLogs, setGitLogs] = useState<string[]>(["Repository initialized on 'main' branch"]);

  const addGitCommit = (msg: string) => {
    const parentCommit = gitCommits.filter(c => c.branch === currentBranch || c.branch === "main").slice(-1)[0];
    const newId = `c${gitCommits.length + 1}`;
    setGitCommits(prev => [
      ...prev,
      { id: newId, msg, branch: currentBranch, parent: parentCommit ? parentCommit.id : null }
    ]);
    setGitLogs(prev => [...prev, `[Commit] ${newId}: "${msg}" on branch '${currentBranch}'`]);
  };

  const createGitBranch = (branchName: string) => {
    if (branchName === "main") return;
    setCurrentBranch(branchName);
    setGitLogs(prev => [...prev, `[Branch] Created and checked out new branch '${branchName}'`]);
  };

  const mergeGitBranch = (srcBranch: string) => {
    if (srcBranch === currentBranch) return;
    const parentMain = gitCommits.filter(c => c.branch === currentBranch).slice(-1)[0];
    const parentSrc = gitCommits.filter(c => c.branch === srcBranch).slice(-1)[0];
    
    if (!parentSrc) {
      setGitLogs(prev => [...prev, `[Merge] Branch '${srcBranch}' has no commits to merge.`]);
      return;
    }

    const newId = `c${gitCommits.length + 1}`;
    setGitCommits(prev => [
      ...prev,
      { id: newId, msg: `Merge branch '${srcBranch}' into ${currentBranch}`, branch: currentBranch, parent: parentMain ? parentMain.id : null }
    ]);
    setGitLogs(prev => [...prev, `[Merge] Merged branch '${srcBranch}' into '${currentBranch}' (Fast-Forward/Three-way merge)`]);
  };

  const rebaseGitBranch = (targetBranch: string) => {
    setGitLogs(prev => [...prev, `[Rebase] Rebased '${currentBranch}' commits on top of '${targetBranch}'. Clean linear history generated!`]);
  };

  // ==========================================
  // HTTP STATUS CODE MAPPING & STATE
  // ==========================================
  const [httpStatusToTest, setHttpStatusToTest] = useState<number>(200);
  const [httpTestResult, setHttpTestResult] = useState<Record<string, unknown> | null>(null);
  const [httpTesting, setHttpTesting] = useState<boolean>(false);

  const testHttpStatus = async (code: number) => {
    setHttpTesting(true);
    setHttpTestResult(null);
    try {
      // We can query a route that handles this, or just mock the request delay 
      // and present the corresponding response payload.
      await new Promise(r => setTimeout(r, 600));
      
      let message = "OK";
      let isSuccess = true;
      
      switch (code) {
        case 200: message = "Success - Request resolved successfully."; break;
        case 201: message = "Created - Resource generated successfully."; break;
        case 400: message = "Bad Request - Input fields failed schema validation."; isSuccess = false; break;
        case 401: message = "Unauthorized - JWT session token missing or expired."; isSuccess = false; break;
        case 403: message = "Forbidden - Role 'ADMIN' is required for this action."; isSuccess = false; break;
        case 404: message = "Not Found - Medicine listing record does not exist."; isSuccess = false; break;
        case 409: message = "Conflict - State mismatch. Only pending listings can be approved."; isSuccess = false; break;
        case 500: message = "Internal Server Error - Server-side stack error encountered."; isSuccess = false; break;
      }
      
      setHttpTestResult({
        statusCode: code,
        success: isSuccess,
        message,
        timestamp: new Date().toISOString(),
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      });
    } catch {
      setHttpTestResult({ success: false, message: "Request failed" });
    } finally {
      setHttpTesting(false);
    }
  };


  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-dark-navy to-[#0F2940] border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-[#0EA5B7]">
            <Terminal className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Developer Hub & Sandbox</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Project MediApprove Concept Inspector</h2>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Inspect, run, and interact with the 11 core computer science and software engineering topics integrated into this web application. Toggle the tabs below to execute code simulations.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 relative z-10">
          <span className="px-3 py-1 bg-[#0EA5B7]/10 border border-[#0EA5B7]/30 text-[#0EA5B7] text-xs font-extrabold rounded-lg uppercase tracking-wider">AI App Eng</span>
          <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-extrabold rounded-lg uppercase tracking-wider">JavaScript</span>
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold rounded-lg uppercase tracking-wider">SQL JOINs</span>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold rounded-lg uppercase tracking-wider">Git Flow</span>
        </div>
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#0EA5B7]/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px select-none">
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "ai"
              ? "border-[#0EA5B7] text-[#0EA5B7] bg-[#0EA5B7]/5"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Cpu className="w-4 h-4" />
          AI & Prompting (Gemini)
        </button>
        <button
          onClick={() => setActiveTab("js")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "js"
              ? "border-[#0EA5B7] text-[#0EA5B7] bg-[#0EA5B7]/5"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Code2 className="w-4 h-4" />
          JS Engine Sandbox
        </button>
        <button
          onClick={() => setActiveTab("sql")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "sql"
              ? "border-[#0EA5B7] text-[#0EA5B7] bg-[#0EA5B7]/5"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Database className="w-4 h-4" />
          SQL JOIN Explorer
        </button>
        <button
          onClick={() => setActiveTab("git")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "git"
              ? "border-[#0EA5B7] text-[#0EA5B7] bg-[#0EA5B7]/5"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <GitBranch className="w-4 h-4" />
          Git Workflow Graph
        </button>
        <button
          onClick={() => setActiveTab("http")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "http"
              ? "border-[#0EA5B7] text-[#0EA5B7] bg-[#0EA5B7]/5"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Layers className="w-4 h-4" />
          HTTP Status Codes
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        
        {/* ==================================================== */}
        {/* AI & PROMPTING PANEL */}
        {/* ==================================================== */}
        {activeTab === "ai" && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Configuration panel */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4">
                  <h3 className="font-bold text-dark-navy flex items-center gap-2">
                    <Shield className="w-4.5 h-4.5 text-primary" />
                    Secrets Management
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Environment variables are securely loaded on the server using Node.js <code>process.env</code>. You can override the Gemini API Key below for client testing.
                  </p>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Backend Secret Status
                    </label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold">
                      {isEnvKeySet ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          <span className="text-slate-600">DATABASE_URL & JWT Configured</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <span className="text-slate-600">Check .env parameters</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Gemini API Key Override
                    </label>
                    <input
                      type="password"
                      placeholder="AIzaSy..."
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-primary"
                    />
                    <span className="text-[9px] text-slate-400 block leading-tight">
                      Leave empty to run the audit in offline demonstration mode (mock analyzer with structured schema matching).
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4">
                  <h3 className="font-bold text-dark-navy flex items-center gap-2">
                    <Layers className="w-4.5 h-4.5 text-primary" />
                    Prompt Engineering Setup
                  </h3>
                  <div className="space-y-3.5 text-xs text-slate-500">
                    <p className="leading-relaxed">
                      Our system prompt uses <strong>System Instructions</strong> to frame the AI model role and defines strict <strong>Structured JSON schema</strong> requirements to constraint the output payload.
                    </p>
                    <div>
                      <span className="font-bold text-dark-navy block mb-1">Key parameters used:</span>
                      <ul className="list-disc pl-4 space-y-1.5 font-semibold text-slate-600">
                        <li>System prompt framing role</li>
                        <li>Defined property rules</li>
                        <li>JSON schema specification</li>
                        <li>Temperature: 0.1 (low randomness)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 space-y-6">
                  <h3 className="font-bold text-dark-navy">Test Medicine Listing Data</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medicine Name</label>
                      <input
                        type="text"
                        value={aiInput.name}
                        onChange={(e) => setAiInput({ ...aiInput, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SKU (Stock Keeping Unit)</label>
                      <input
                        type="text"
                        value={aiInput.sku}
                        onChange={(e) => setAiInput({ ...aiInput, sku: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Formulation</label>
                      <input
                        type="text"
                        value={aiInput.formulation}
                        onChange={(e) => setAiInput({ ...aiInput, formulation: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price ($ USD)</label>
                      <input
                        type="text"
                        value={aiInput.price}
                        onChange={(e) => setAiInput({ ...aiInput, price: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expiry Date</label>
                      <input
                        type="date"
                        value={aiInput.expiryDate}
                        onChange={(e) => setAiInput({ ...aiInput, expiryDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vendor/Manufacturer</label>
                      <input
                        type="text"
                        value={aiInput.vendor}
                        onChange={(e) => setAiInput({ ...aiInput, vendor: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chemical Composition</label>
                    <input
                      type="text"
                      value={aiInput.composition}
                      onChange={(e) => setAiInput({ ...aiInput, composition: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={runAiAudit}
                      disabled={aiLoading}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary-hover active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {aiLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Running AI Audit...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Execute AI Compliance Audit
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Result Report Panel */}
            {(aiReport || aiError) && (
              <div className="border-t border-slate-100 pt-8 space-y-6">
                <h3 className="font-extrabold text-lg text-dark-navy">API Response & Execution Analysis</h3>

                {aiError && (
                  <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs font-bold">
                    {aiError}
                  </div>
                )}

                {aiReport && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Compliance Overview */}
                    <div className="space-y-5">
                      <div className={`p-5 rounded-xl border flex items-start gap-4 ${
                        aiReport.rawJson.isCompliant
                          ? "bg-success/5 border-success/20"
                          : "bg-danger/5 border-danger/20"
                      }`}>
                        <div className={`p-2.5 rounded-lg shrink-0 ${
                          aiReport.rawJson.isCompliant ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
                        }`}>
                          <Shield className="w-5 h-5" />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest block text-slate-400">
                            Audit Recommendation
                          </span>
                          <h4 className={`text-xl font-black ${
                            aiReport.rawJson.isCompliant ? "text-success" : "text-danger"
                          }`}>
                            {aiReport.rawJson.recommendation} ({aiReport.rawJson.isCompliant ? "Compliant" : "Non-Compliant"})
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                            {aiReport.rawJson.reason}
                          </p>
                        </div>
                      </div>

                      {/* Extracted chemicals and Flags */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-xl space-y-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                            Extracted Chemical APIs
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {aiReport.rawJson.extractedChemicals?.map((chem: string, i: number) => (
                              <span key={i} className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-extrabold rounded uppercase tracking-wider">
                                {chem}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-xl space-y-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                            Flags & Indicators
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {aiReport.rawJson.flags.map((flag: string, i: number) => (
                              <span key={i} className="px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-extrabold rounded uppercase tracking-wider">
                                {flag}
                              </span>
                            ))}
                            {aiReport.rawJson.flags.length === 0 && (
                              <span className="text-xs text-slate-400 italic font-semibold">No negative flags.</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Safety Warnings */}
                      <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-xl space-y-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          Safety Warnings & Concerns
                        </span>
                        <ul className="list-disc pl-4 text-xs text-slate-600 font-semibold space-y-1.5 leading-relaxed">
                          {aiReport.rawJson.safetyConcerns.map((warning: string, i: number) => (
                            <li key={i}>{warning}</li>
                          ))}
                          {aiReport.rawJson.safetyConcerns.length === 0 && (
                            <li className="italic text-slate-400 list-none font-semibold">No critical safety concerns identified.</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Console Code Details */}
                    <div className="space-y-4 font-mono text-[11px]">
                      <div className="bg-[#0F2940] border border-slate-800 rounded-xl p-5 text-slate-300 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                          <span className="text-[#0EA5B7] font-bold">API Structured JSON Output</span>
                          <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase">
                            HTTP status {aiReport.statusCode}
                          </span>
                        </div>
                        <pre className="overflow-x-auto whitespace-pre leading-relaxed text-slate-200 select-all p-1 bg-slate-900/50 rounded-lg max-h-[340px]">
                          {JSON.stringify(aiReport.rawJson, null, 2)}
                        </pre>
                      </div>

                      <div className="bg-[#0F2940] border border-slate-800 rounded-xl p-5 text-slate-300 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                          <span className="text-[#0EA5B7] font-bold">System instructions (Prompt Engineering)</span>
                        </div>
                        <p className="text-slate-400 italic leading-relaxed">
                          &quot;{aiReport.systemInstruction}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* JS ENGINE SANDBOX PANEL */}
        {/* ==================================================== */}
        {activeTab === "js" && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-px">
              <button
                onClick={() => setJsSubTab("eventloop")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  jsSubTab === "eventloop"
                    ? "border-[#0EA5B7] text-[#0EA5B7] bg-[#0EA5B7]/5"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Event Loop Queue
              </button>
              <button
                onClick={() => setJsSubTab("closures")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  jsSubTab === "closures"
                    ? "border-[#0EA5B7] text-[#0EA5B7] bg-[#0EA5B7]/5"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Closures Scope
              </button>
              <button
                onClick={() => setJsSubTab("hoisting")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  jsSubTab === "hoisting"
                    ? "border-[#0EA5B7] text-[#0EA5B7] bg-[#0EA5B7]/5"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Hoisting Lifecycles
              </button>
              <button
                onClick={() => setJsSubTab("async")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  jsSubTab === "async"
                    ? "border-[#0EA5B7] text-[#0EA5B7] bg-[#0EA5B7]/5"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                async/await (Tasks)
              </button>
              <button
                onClick={() => setJsSubTab("promises")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  jsSubTab === "promises"
                    ? "border-[#0EA5B7] text-[#0EA5B7] bg-[#0EA5B7]/5"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Promises vs Callbacks
              </button>
            </div>

            {/* Event Loop Queue Visualizer */}
            {jsSubTab === "eventloop" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-dark-navy text-base">JavaScript Single Threaded Event Loop Simulator</h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                      Queue asynchronous events (Microtasks like Promises, Macrotasks like setTimeout callbacks) and click execute to trigger the event loop execution loop animation.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addSyncLog}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 cursor-pointer"
                    >
                      + Sync Statement
                    </button>
                    <button
                      onClick={addPromiseTask}
                      className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg border border-blue-100 cursor-pointer"
                    >
                      + Promise (Microtask)
                    </button>
                    <button
                      onClick={addTimeoutTask}
                      className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 text-xs font-bold rounded-lg border border-purple-100 cursor-pointer"
                    >
                      + setTimeout (Macrotask)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Call Stack */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-4 flex flex-col h-[300px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center border-b pb-1.5">
                      Call Stack (LIFO)
                    </span>
                    <div className="flex-1 flex flex-col-reverse justify-start gap-2.5 overflow-y-auto">
                      {callStack.map((stack, i) => (
                        <div key={i} className="px-3.5 py-2 bg-[#0F2940] text-[#0EA5B7] text-xs font-mono rounded-lg border border-slate-700 animate-slide-up text-center truncate">
                          {stack}
                        </div>
                      ))}
                      {callStack.length === 0 && (
                        <span className="text-xs text-slate-400 italic text-center my-auto font-semibold">Stack Empty</span>
                      )}
                    </div>
                  </div>

                  {/* Web APIs */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-4 flex flex-col h-[300px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center border-b pb-1.5">
                      Web APIs / Background
                    </span>
                    <div className="flex-1 flex flex-col justify-start gap-2.5 overflow-y-auto">
                      {webApis.map((api, i) => (
                        <div key={i} className="px-3.5 py-2 bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold rounded-lg text-center truncate">
                          {api}
                        </div>
                      ))}
                      {webApis.length === 0 && (
                        <span className="text-xs text-slate-400 italic text-center my-auto font-semibold">No active async timers</span>
                      )}
                    </div>
                  </div>

                  {/* Microtask Queue */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-4 flex flex-col h-[300px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center border-b pb-1.5">
                      Microtask Queue (FIFO)
                    </span>
                    <div className="flex-1 flex flex-col justify-start gap-2.5 overflow-y-auto">
                      {microtasks.map((task, i) => (
                        <div key={i} className="px-3.5 py-2 bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold rounded-lg text-center truncate">
                          {task}
                        </div>
                      ))}
                      {microtasks.length === 0 && (
                        <span className="text-xs text-slate-400 italic text-center my-auto font-semibold">Queue Empty</span>
                      )}
                    </div>
                  </div>

                  {/* Macrotask Queue */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-4 flex flex-col h-[300px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center border-b pb-1.5">
                      Macrotask Queue (FIFO)
                    </span>
                    <div className="flex-1 flex flex-col justify-start gap-2.5 overflow-y-auto">
                      {macrotasks.map((task, i) => (
                        <div key={i} className="px-3.5 py-2 bg-purple-50 text-purple-600 border border-purple-200 text-xs font-bold rounded-lg text-center truncate">
                          {task}
                        </div>
                      ))}
                      {macrotasks.length === 0 && (
                        <span className="text-xs text-slate-400 italic text-center my-auto font-semibold">Queue Empty</span>
                      )}
                    </div>
                  </div>

                  {/* Terminal Console */}
                  <div className="bg-[#0F2940] border border-slate-800 rounded-xl p-4.5 space-y-4 flex flex-col h-[300px] text-slate-300 font-mono text-[11px]">
                    <div className="flex items-center justify-between border-b border-slate-700/50 pb-1.5">
                      <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Console Output</span>
                      <button
                        onClick={clearEventLoop}
                        className="text-[9px] hover:text-white underline cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1.5 text-slate-300 leading-normal">
                      {jsConsole.map((log, i) => (
                        <div key={i} className="border-b border-slate-800/30 pb-0.5">{log}</div>
                      ))}
                      {jsConsole.length === 0 && (
                        <span className="text-slate-500 italic block">No output printed</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={runEventLoopTick}
                    disabled={isLoopRunning || (microtasks.length === 0 && macrotasks.length === 0)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary-hover active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Process Event Loop Tick
                  </button>
                </div>
              </div>
            )}

            {/* Closures Sandbox */}
            {jsSubTab === "closures" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-5 bg-slate-50 border border-slate-100 p-6 rounded-xl">
                  <h4 className="font-extrabold text-dark-navy text-base">State Retention via Closures</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    A <strong>closure</strong> is the combination of a function bundled together with references to its surrounding state (the lexical environment). In JavaScript, closures are created every time a function is created, at function creation time.
                  </p>

                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Factor to Enclose (x)</label>
                        <input
                          type="number"
                          value={closureMultiplier}
                          onChange={(e) => setClosureMultiplier(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary"
                        />
                      </div>
                      <button
                        onClick={generateClosure}
                        className="sm:self-end px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary-hover active:scale-95 transition-all cursor-pointer shrink-0"
                      >
                        Create enclosed multiplyBy{closureMultiplier}()
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Enclosed Multipliers (Created Instances)</label>
                      <div className="flex flex-col gap-2">
                        {createdClosures.map((c, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 bg-white rounded-lg text-xs">
                            <code className="font-mono text-primary font-bold">{c.code}</code>
                            <button
                              onClick={() => runClosure(c.mult)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 font-bold rounded text-[10px] border cursor-pointer"
                            >
                              Run function
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 flex flex-col">
                  <div className="flex-1 bg-[#0F2940] border border-slate-800 rounded-xl p-5 text-slate-300 font-mono text-[11px] flex flex-col h-[280px]">
                    <div className="flex items-center justify-between border-b border-slate-700/50 pb-2 mb-3">
                      <span className="text-[#0EA5B7] font-bold">Lexical Environment Scope Tracker</span>
                      <button
                        onClick={() => setClosureLogs([])}
                        className="text-[9px] hover:text-white underline cursor-pointer text-slate-400"
                      >
                        Clear logs
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 text-slate-300">
                      <div className="text-slate-500 italic mb-2">{"// Scope logs trace:"}</div>
                      {closureLogs.map((log, idx) => (
                        <div key={idx} className="border-b border-slate-800/30 pb-0.5 leading-normal">{log}</div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-xl space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Input Value (y)</label>
                    <input
                      type="number"
                      value={closureInputVal}
                      onChange={(e) => setClosureInputVal(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Hoisting Demo */}
            {jsSubTab === "hoisting" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-slate-50 border border-slate-100 p-6 rounded-xl space-y-5">
                  <h4 className="font-extrabold text-dark-navy text-base">Variable and Function Hoisting</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <strong>Hoisting</strong> is JavaScript&apos;s behavior of moving declarations to the top of the current scope during the compilation phase. This lets declarations be used before they are written.
                  </p>

                  <div className="flex flex-col gap-2 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setHoistingType("var")}
                      className={`px-4 py-2.5 text-xs font-bold text-left rounded-lg border transition-all cursor-pointer ${
                        hoistingType === "var"
                          ? "bg-white border-primary text-primary shadow-xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      var declarations (hoisted with undefined)
                    </button>
                    <button
                      onClick={() => setHoistingType("let")}
                      className={`px-4 py-2.5 text-xs font-bold text-left rounded-lg border transition-all cursor-pointer ${
                        hoistingType === "let"
                          ? "bg-white border-primary text-primary shadow-xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      let / const declarations (Temporal Dead Zone)
                    </button>
                    <button
                      onClick={() => setHoistingType("function")}
                      className={`px-4 py-2.5 text-xs font-bold text-left rounded-lg border transition-all cursor-pointer ${
                        hoistingType === "function"
                          ? "bg-white border-primary text-primary shadow-xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Function declarations (Fully hoisted)
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-[#0F2940] border border-slate-800 rounded-xl p-5 text-slate-300 font-mono text-[11px] space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                      <span className="text-[#0EA5B7] font-bold">V8 Engine Compilation Phase (Variables hoisted in Memory)</span>
                    </div>
                    <pre className="text-emerald-400 overflow-x-auto leading-relaxed">{compilationPhase}</pre>
                  </div>

                  <div className="bg-[#0F2940] border border-slate-800 rounded-xl p-5 text-slate-300 font-mono text-[11px] space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                      <span className="text-[#0EA5B7] font-bold">Engine Execution Phase (Code evaluation)</span>
                    </div>
                    <pre className="text-slate-200 overflow-x-auto leading-relaxed">{executionPhase}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* async/await Demo */}
            {jsSubTab === "async" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6 bg-slate-50 border border-slate-100 p-6 rounded-xl">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-dark-navy text-base">Asynchronous Flow: Sequential vs Parallel</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Using <strong>async/await</strong> allows writing promise-based asynchronous code in a structured format. Compare performance differences when queries execute sequentially (one after another) vs in parallel (using <code>Promise.all</code>).
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-4 border-t border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Execution Mode</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="asyncMode"
                          checked={asyncMode === "sequential"}
                          onChange={() => setAsyncMode("sequential")}
                          className="text-[#0EA5B7] focus:ring-[#0EA5B7]"
                        />
                        Sequential (awarded one by one)
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="asyncMode"
                          checked={asyncMode === "parallel"}
                          onChange={() => setAsyncMode("parallel")}
                          className="text-[#0EA5B7] focus:ring-[#0EA5B7]"
                        />
                        Parallel (Promise.all concurrent resolution)
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Async API Requests (Simulated network latency)</span>
                    <div className="space-y-2">
                      {asyncResults.map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-lg text-xs">
                          <span className="font-semibold text-slate-700">{r.id}</span>
                          <div className="flex items-center gap-3">
                            {r.status === "Pending" ? (
                              <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-100">
                                <RefreshCw className="w-3 h-3 animate-spin" /> Pending
                              </span>
                            ) : (
                              <>
                                <span className="text-slate-400 font-bold">{r.time}ms</span>
                                <span className="text-success bg-success/10 px-2 py-0.5 rounded text-[10px] font-bold border border-success/20">
                                  Resolved
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <div>
                      {asyncTotalTime > 0 && (
                        <span className="text-xs font-bold text-dark-navy flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-primary" />
                          Total Time: <span className="text-primary">{asyncTotalTime}ms</span>
                        </span>
                      )}
                    </div>
                    <button
                      onClick={startAsyncDemo}
                      disabled={asyncRunning}
                      className="px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary-hover active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      Run Async Tasks
                    </button>
                  </div>
                </div>

                <div className="bg-[#0F2940] border border-slate-800 rounded-xl p-5 text-slate-300 font-mono text-[11px] flex flex-col h-[400px]">
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-2 mb-3">
                    <span className="text-[#0EA5B7] font-bold">Async Execution Logs</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 text-slate-300">
                    {asyncLogs.map((log, idx) => (
                      <div key={idx} className="border-b border-slate-800/30 pb-0.5 leading-normal">{log}</div>
                    ))}
                    {asyncLogs.length === 0 && (
                      <span className="text-slate-500 italic">Click Run to trace asynchronous execution flow.</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Promises vs Callbacks */}
            {jsSubTab === "promises" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6 bg-slate-50 border border-slate-100 p-6 rounded-xl">
                  <h4 className="font-extrabold text-dark-navy text-base">Promises vs Callbacks</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Compare syntax models: Callback hierarchies create deep nested structures (&quot;Pyramid of Doom&quot;), while Promises offer linear chains that improve readability and maintainability.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                    <div className="space-y-3.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Callback Style</span>
                      <button
                        onClick={runCallbacksDemo}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border-dashed cursor-pointer"
                      >
                        Run Callback Chain
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Promise Style</span>
                      <button
                        onClick={runPromisesDemo}
                        className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Run Promise Chain
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0F2940] border border-slate-800 rounded-xl p-5 text-slate-300 font-mono text-[11px] flex flex-col h-[280px]">
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-2 mb-3">
                    <span className="text-[#0EA5B7] font-bold">Execution Output Console</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 text-slate-200">
                    {promLogs.map((log, idx) => (
                      <div key={idx} className="border-b border-slate-800/30 pb-0.5 leading-normal">{log}</div>
                    ))}
                    {promLogs.length === 0 && (
                      <span className="text-slate-500 italic font-semibold">Select a trigger button to execute.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* SQL JOINS EXPLORER PANEL */}
        {/* ==================================================== */}
        {activeTab === "sql" && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Controls */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-5">
                  <h3 className="font-bold text-dark-navy flex items-center gap-2">
                    <Database className="w-4.5 h-4.5 text-primary" />
                    SQL JOIN Queries (Postgres)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Select a SQL JOIN type. We will compile a query that links the <strong>AuditLog</strong> table with the <strong>Admin</strong> (User) and <strong>MedicineListing</strong> tables on their foreign keys.
                  </p>

                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">JOIN Type</span>
                    <div className="flex flex-col gap-2">
                      {(["INNER", "LEFT", "RIGHT", "FULL"] as const).map((type) => (
                        <label key={type} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-50/50">
                          <span className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="joinType"
                              value={type}
                              checked={joinType === type}
                              onChange={() => setJoinType(type)}
                              className="text-primary focus:ring-primary"
                            />
                            {type} JOIN
                          </span>
                          <span className="text-[9px] text-slate-400 font-normal">
                            {type === "INNER" && "Intersection only"}
                            {type === "LEFT" && "Include unmatched logs"}
                            {type === "RIGHT" && "Include unmatched listings"}
                            {type === "FULL" && "Include all records"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-slate-200">
                    <button
                      onClick={executeJoinQuery}
                      disabled={sqlLoading}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary-hover active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {sqlLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Querying DB...
                        </>
                      ) : (
                        "Execute SQL JOIN Query"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Console & Results */}
              <div className="lg:col-span-2 space-y-6">
                {/* Compiled SQL */}
                <div className="bg-[#0F2940] border border-slate-800 rounded-xl p-5 text-slate-300 font-mono text-[11px] space-y-3">
                  <span className="text-[#0EA5B7] font-bold uppercase tracking-widest text-[9px] block">Compiled SQL Text</span>
                  <pre className="overflow-x-auto leading-relaxed text-slate-200 p-3 bg-slate-900/50 rounded-lg whitespace-pre">
                    {sqlQueryText || `SELECT 
  al.id as "logId",
  al.action,
  al."createdAt" as "logDate",
  u.name as "adminName",
  u.email as "adminEmail",
  m."medicineName",
  m.sku,
  m.price
FROM "AuditLog" al
${joinType} JOIN "Admin" u ON al."adminId" = u.id
${joinType} JOIN "MedicineListing" m ON al."listingId" = m.id
ORDER BY al."createdAt" DESC
LIMIT 10;`}
                  </pre>
                </div>

                {/* DB Output table */}
                <div className="space-y-3">
                  <span className="text-sm font-bold text-dark-navy block">Database Query Results</span>
                  
                  {sqlError && (
                    <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs font-semibold">
                      {sqlError}
                    </div>
                  )}

                  {!sqlError && sqlResult.length > 0 ? (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                      <div className="overflow-x-auto max-h-[280px]">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <th className="p-3.5">Log ID</th>
                              <th className="p-3.5">Action</th>
                              <th className="p-3.5">Admin</th>
                              <th className="p-3.5">Medicine</th>
                              <th className="p-3.5">SKU</th>
                              <th className="p-3.5">Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                            {sqlResult.map((row, i) => (
                              <tr key={i} className="hover:bg-slate-50/50">
                                <td className="p-3.5 font-mono text-slate-400">{row.logId || "NULL"}</td>
                                <td className="p-3.5">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    row.action === "APPROVED" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                                  }`}>
                                    {row.action || "NULL"}
                                  </span>
                                </td>
                                <td className="p-3.5">
                                  <div>{row.adminName || "NULL"}</div>
                                  <div className="text-[10px] text-slate-400 font-normal">{row.adminEmail || ""}</div>
                                </td>
                                <td className="p-3.5 text-dark-navy font-bold">{row.medicineName || "NULL"}</td>
                                <td className="p-3.5 font-mono">{row.sku || "NULL"}</td>
                                <td className="p-3.5 font-bold text-dark-navy">
                                  {row.price !== null ? `$${Number(row.price).toFixed(2)}` : "NULL"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400 italic">
                      No query results loaded. Click Execute SQL JOIN Query to run raw select queries on PostgreSQL.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* GIT WORKFLOW PANEL */}
        {/* ==================================================== */}
        {activeTab === "git" && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Controls */}
              <div className="lg:col-span-1 space-y-5 bg-slate-50 border border-slate-100 rounded-xl p-5">
                <h4 className="font-extrabold text-dark-navy text-base">Git Directed Acyclic Graph (DAG)</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Simulate Git version control operations: Commit new blocks, checkout branches, and merge code changes. Track how the DAG model is constructed.
                </p>

                <div className="space-y-4 pt-4 border-t border-slate-200">
                  {/* Committing */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Version commits</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addGitCommit("Implement AI Medicine Verification")}
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg cursor-pointer text-center"
                      >
                        + Commit AI Audit
                      </button>
                      <button
                        onClick={() => addGitCommit("Fix ESLint cascading issues")}
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg cursor-pointer text-center"
                      >
                        + Commit Lint Fix
                      </button>
                    </div>
                  </div>

                  {/* Branching */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Branch Checkout</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => createGitBranch("feature-ai-audit")}
                        className="flex-1 px-3 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg cursor-pointer text-center"
                      >
                        Checkout feature-ai
                      </button>
                      <button
                        onClick={() => setCurrentBranch("main")}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 cursor-pointer"
                      >
                        Checkout main
                      </button>
                    </div>
                  </div>

                  {/* Merge & Rebase */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">History Actions</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => mergeGitBranch("feature-ai-audit")}
                        className="flex-1 px-3 py-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-600 text-xs font-bold rounded-lg cursor-pointer text-center"
                      >
                        Merge feature-ai
                      </button>
                      <button
                        onClick={() => rebaseGitBranch("main")}
                        className="flex-1 px-3 py-2 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-600 text-xs font-bold rounded-lg cursor-pointer text-center"
                      >
                        Rebase on main
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logs & Graph Representation */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-dark-navy">Visual Commit Nodes Graph</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Current HEAD: <span className="text-primary">{currentBranch}</span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-3.5 py-2">
                    {gitCommits.map((c, i) => (
                      <div key={i} className="flex items-center gap-3 animate-fade-in">
                        <div className="flex flex-col items-center shrink-0">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                            c.branch === "main" ? "bg-[#0F2940] border-[#0EA5B7] text-[#0EA5B7]" : "bg-blue-600 border-white text-white"
                          }`}>
                            {c.id}
                          </div>
                          {i < gitCommits.length - 1 && (
                            <div className="w-0.5 h-6 bg-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 p-3.5 bg-white border border-slate-200 rounded-xl text-xs flex items-center justify-between gap-4">
                          <div>
                            <span className="font-bold text-dark-navy block">{c.msg}</span>
                            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
                              Branch: {c.branch} {c.parent ? `| Parent: ${c.parent}` : ""}
                            </span>
                          </div>
                          {c.id === gitCommits.slice(-1)[0].id && (
                            <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[9px] font-extrabold rounded uppercase tracking-wider">
                              HEAD
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0F2940] border border-slate-800 rounded-xl p-4 text-slate-300 font-mono text-[11px] h-[160px] overflow-y-auto">
                  <div className="text-slate-500 mb-2 border-b border-slate-800/50 pb-1.5 font-bold uppercase text-[9px] tracking-wider">Terminal Git Logs</div>
                  {gitLogs.map((log, i) => (
                    <div key={i} className="leading-relaxed border-b border-slate-800/30 pb-0.5 text-slate-300">{log}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* HTTP STATUS CODES PANEL */}
        {/* ==================================================== */}
        {activeTab === "http" && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Catalog Code Dictionary */}
              <div className="lg:col-span-1 space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">HTTP Status Dictionary</span>
                <div className="flex flex-col gap-2">
                  {[
                    { code: 200, label: "200 OK", desc: "Successful request resolution." },
                    { code: 201, label: "201 Created", desc: "Successful resource creation." },
                    { code: 400, label: "400 Bad Request", desc: "Payload parsing or schema validation failure." },
                    { code: 401, label: "401 Unauthorized", desc: "Authentication credentials token missing." },
                    { code: 403, label: "403 Forbidden", desc: "Role check authorization block." },
                    { code: 404, label: "404 Not Found", desc: "Target database resource does not exist." },
                    { code: 409, label: "409 Conflict", desc: "Listing status state constraint violation." },
                    { code: 500, label: "500 Internal Server", desc: "Database connection or syntax compilation crash." }
                  ].map((item) => (
                    <button
                      key={item.code}
                      onClick={() => setHttpStatusToTest(item.code)}
                      className={`p-3 text-left border rounded-xl flex items-center justify-between gap-3 text-xs transition-all cursor-pointer ${
                        httpStatusToTest === item.code
                          ? "bg-primary/5 border-primary text-primary"
                          : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div>
                        <span className="font-bold block">{item.label}</span>
                        <span className="text-[10px] text-slate-400 font-normal mt-0.5 block">{item.desc}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Testing Sandbox */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 space-y-5">
                  <h4 className="font-extrabold text-dark-navy text-base">Status Code REST Simulator</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Test how the application middleware and route controllers respond to different HTTP status parameters. Click test to run a mock fetch resolution block.
                  </p>

                  <div className="flex items-center gap-4 pt-2 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-600">Selected Code:</span>
                    <span className="px-3.5 py-1 bg-[#0F2940] text-[#0EA5B7] rounded-lg font-mono font-bold text-sm">
                      {httpStatusToTest}
                    </span>
                    <button
                      onClick={() => testHttpStatus(httpStatusToTest)}
                      disabled={httpTesting}
                      className="ml-auto px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary-hover active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {httpTesting ? "Fetching..." : `Simulate API Response`}
                    </button>
                  </div>
                </div>

                {httpTestResult && (
                  <div className="bg-[#0F2940] border border-slate-800 rounded-xl p-5 text-slate-300 font-mono text-[11px] space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                      <span className="text-[#0EA5B7] font-bold">HTTP Client Response Packet</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold ${
                        httpTestResult.success ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
                      }`}>
                        {httpTestResult.statusCode === 200 || httpTestResult.statusCode === 201 ? "Success" : "Error"}
                      </span>
                    </div>
                    <pre className="overflow-x-auto leading-relaxed text-slate-200 p-3 bg-slate-900/50 rounded-lg">
                      {JSON.stringify(httpTestResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
