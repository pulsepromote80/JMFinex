
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { AuthLogin } from "@/app/api/auth";
import { createPortal } from "react-dom";

// ─── Helper to build tree from flat API data ────────────────────────────────//
const buildTreeFromApi = (apiNodes) => {
  if (!apiNodes || !Array.isArray(apiNodes) || apiNodes.length === 0) {
    return null;
  }

  const allNodes = apiNodes;
  const nodeMap = new Map();

  allNodes.forEach((apiNode) => {
    const colorPath = apiNode.binarycolorimg || "";
    const isGreen = colorPath.includes("green");
    const isRed = colorPath.includes("red");
    const isGrey = colorPath.includes("grey");

    nodeMap.set(apiNode.id, {
      mapId: apiNode.id,
      id: apiNode.AuthLogin || `EMPTY`,
      username: apiNode.Name || "Available Slot",
      active: isGreen,
      nodeColor: isGreen ? "green" : isRed ? "red" : "grey",
      binaryColor: colorPath,
      position: apiNode.Position || "",
      level: apiNode.level || 0,
      leftBV: Number(apiNode.LeftBussiness || 0),
      rightBV: Number(apiNode.RighttBussiness || 0),
      leftActive: Number(apiNode.LeftActiveMember || 0),
      rightActive: Number(apiNode.RightActiveMember || 0),
      carryForward: Number(apiNode.CarryForwardBussiness || 0),
      actDate: apiNode.ActDate || "",
      sponsor: apiNode.SponosorDetails || "",
      package: Number(apiNode.Package || 0),
      urid: apiNode.URID,
      buttonLink: apiNode.ButtonLink || "",
      isExists: apiNode.IsExists,
      isEmpty: apiNode.IsExists === 0,
      left: null,
      right: null,
    });
  });

  const rootApi = allNodes.find((n) => n.level === 0);
  if (!rootApi) {
    console.error("Root node not found");
    return null;
  }

  allNodes.forEach((apiNode) => {
    if (apiNode.id === rootApi.id) return;
    const currentNode = nodeMap.get(apiNode.id);
    const parentId = Math.floor(apiNode.id / 2);
    const parentNode = nodeMap.get(parentId);
    if (!parentNode || !currentNode) return;
    if (apiNode.Position === "L") parentNode.left = currentNode;
    if (apiNode.Position === "R") parentNode.right = currentNode;
  });

  return nodeMap.get(rootApi.id);
};

// ─── Count Active Nodes ─────────────────────────────────────────────
const countActiveNodes = (node) => {
  if (!node) return 0;
  let count = node.active ? 1 : 0;
  return count + countActiveNodes(node.left) + countActiveNodes(node.right);
};

// ─── Tooltip Component ──────────────────────────────────────────────────────
function Tooltip({ node, x, y }) {
  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{ left: x + 16, top: Math.max(y - 10, 20), transform: "translateY(-50%)" }}
    >
      <div className="bg-[var(--bg-card)] dark:bg-[#10222e] border border-[var(--border2)] dark:border-[rgba(47,217,211,0.32)] rounded-xl p-3.5 min-w-[220px] shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${node.active ? 'bg-[var(--brand-green)] dark:bg-[#2ed99a] shadow-[0_0_6px_var(--brand-green)]' : 'bg-[var(--brand-red)] dark:bg-[#f0708a]'}`} />
          <span className="font-mono text-xs text-[var(--brand-cyan)] dark:text-[#2fd9d3] font-semibold flex-1">{node.id}</span>
        </div>
        <div className="text-base font-bold text-[var(--text-1)] dark:text-[#eaf5f7] mb-2.5">{node.username}</div>
        <div className="h-px bg-[var(--border)] dark:border-[rgba(140,200,205,0.16)] my-2" />
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-semibold tracking-[1.2px] text-[var(--text-3)] dark:text-[#728b98]">LEFT BUSS.</span>
            <span className="font-mono text-sm font-semibold text-[var(--brand-green)] dark:text-[#2ed99a]">${node.leftBV.toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-semibold tracking-[1.2px] text-[var(--text-3)] dark:text-[#728b98]">RIGHT BUSS.</span>
            <span className="font-mono text-sm font-semibold text-[var(--brand-cyan)] dark:text-[#2fd9d3]">${node.rightBV.toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-semibold tracking-[1.2px] text-[var(--text-3)] dark:text-[#728b98]">LEFT ACTIVE</span>
            <span className="font-mono text-sm font-semibold text-[var(--brand-green)] dark:text-[#2ed99a]">{node.leftActive}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-semibold tracking-[1.2px] text-[var(--text-3)] dark:text-[#728b98]">RIGHT ACTIVE</span>
            <span className="font-mono text-sm font-semibold text-[var(--brand-cyan)] dark:text-[#2fd9d3]">{node.rightActive}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-semibold tracking-[1.2px] text-[var(--text-3)] dark:text-[#728b98]">C/F BUSS.</span>
            <span className="font-mono text-sm font-semibold text-[var(--brand-gold)] dark:text-[#f4b740]">${node.carryForward.toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-semibold tracking-[1.2px] text-[var(--text-3)] dark:text-[#728b98]">SPONSOR</span>
            <span className="font-mono text-xs text-[var(--text-2)] dark:text-[#9db4be]">{node.sponsor || "—"}</span>
          </div>
        </div>
        <div className="h-px bg-[var(--border)] dark:border-[rgba(140,200,205,0.16)] my-2" />
        <div className="flex gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-semibold tracking-[1.2px] text-[var(--text-3)] dark:text-[#728b98]">PACKAGE</span>
            <span className="font-mono text-xs text-[var(--text-2)] dark:text-[#9db4be]">${node.package}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-semibold tracking-[1.2px] text-[var(--text-3)] dark:text-[#728b98]">ACT. DATE</span>
            <span className="font-mono text-xs text-[var(--text-2)] dark:text-[#9db4be]">{node.actDate}</span>
          </div>
        </div>
        {(node.left || node.right) && (
          <>
            <div className="h-px bg-[var(--border)] dark:border-[rgba(140,200,205,0.16)] my-2" />
            <div className="flex gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-semibold tracking-[1.2px] text-[var(--text-3)] dark:text-[#728b98]">LEFT ID</span>
                <span className="font-mono text-xs text-[var(--text-2)] dark:text-[#9db4be]">{node.left ? node.left.id : "—"}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-semibold tracking-[1.2px] text-[var(--text-3)] dark:text-[#728b98]">RIGHT ID</span>
                <span className="font-mono text-xs text-[var(--text-2)] dark:text-[#9db4be]">{node.right ? node.right.id : "—"}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Node Component ───────────────────────────────────────────────────────────
function TreeNode({ node, onTooltip, onHideTooltip, onSignup, onFocus, depth, isRoot = false }) {
  const [hovered, setHovered] = useState(false);
  const nodeRef = useRef(null);

  const handleMouseEnter = (e) => {
    if (node.isEmpty && !isRoot) return;
    setHovered(true);
    onTooltip(node, e.clientX, e.clientY);
  };
  const handleMouseMove = (e) => {
    if (node.isEmpty && !isRoot) return;
    onTooltip(node, e.clientX, e.clientY);
  };
  const handleMouseLeave = () => {
    setHovered(false);
    onHideTooltip();
  };

  const color = node.active ? "var(--brand-green)" : "var(--brand-red)";

  return (
    <div className="flex flex-col items-center relative">
      <div
        ref={nodeRef}
        className={`relative w-[88px] h-[88px] bg-[var(--bg-card)] dark:bg-[#10222e] border rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shadow-sm overflow-visible z-20 pointer-events-auto ${
          hovered ? 'border-[var(--bt-node-color)] shadow-[0_0_20px_color-mix(in_srgb,var(--bt-node-color)_25%,transparent),0_4px_20px_var(--shadow)] -translate-y-0.5 scale-105 z-10' : ''
        } ${
          node.active 
            ? 'border-[var(--border2)]' 
            : 'border-[color-mix(in_srgb,var(--brand-red)_20%,var(--border))]'
        }`}
        style={{
          "--bt-node-color": color,
          "--bt-ring-color": node.active ? color : "var(--brand-red)",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onFocus(node)}
      >
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full border-2 opacity-60 animate-[ring-pulse_3s_ease-in-out_infinite]`} style={{ borderColor: "var(--bt-ring-color)" }} />
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `color-mix(in_srgb, var(--bt-node-color) 12%, var(--bg-card))` }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="10" r="7" fill={color} opacity="0.9" />
              <path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <div className={`absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--bg-card)] ${node.active ? 'bg-[var(--brand-green)] shadow-[0_0_6px_var(--brand-green)]' : 'bg-[var(--brand-red)]'}`} />
        </div>
        <div className="font-mono text-[9px] font-medium text-[var(--text-3)] dark:text-[#728b98] tracking-[0.5px] mt-0.5 max-w-[80px] text-center truncate">{node.id}</div>
      </div>

      <div className="flex gap-6 relative pt-7">
        {node.left ? (
          node.left.isEmpty ? (
            <EmptySlot side="left" parentId={node.id} onSignup={onSignup} />
          ) : (
            <TreeNode node={node.left} onTooltip={onTooltip} onHideTooltip={onHideTooltip} onSignup={onSignup} onFocus={onFocus} depth={depth + 1} />
          )
        ) : (
          depth < 3 && <EmptySlot side="left" parentId={node.id} onSignup={onSignup} />
        )}

        {node.right ? (
          node.right.isEmpty ? (
            <EmptySlot side="right" parentId={node.id} onSignup={onSignup} />
          ) : (
            <TreeNode node={node.right} onTooltip={onTooltip} onHideTooltip={onHideTooltip} onSignup={onSignup} onFocus={onFocus} depth={depth + 1} />
          )
        ) : (
          depth < 3 && <EmptySlot side="right" parentId={node.id} onSignup={onSignup} />
        )}
      </div>

      <style jsx>{`
        .bt-node-children::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 28px;
          background: linear-gradient(180deg, var(--border2), var(--border));
        }
        .bt-node-children > *::after {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 28px;
          background: var(--border2);
        }
        .bt-node-children > *:not(:only-child)::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          right: 50%;
          height: 1px;
          background: var(--border2);
        }
        @keyframes ring-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}

// ─── Empty Slot ─────────────────────────────────────────────────────────────
function EmptySlot({ side, parentId, onSignup }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="flex flex-col items-center relative">
      <div
        className={`relative w-[88px] h-[88px] bg-[var(--bg-1)] dark:bg-[#0b1a24] border border-dashed border-[var(--border)] dark:border-[rgba(140,200,205,0.16)] rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden ${
          hov ? 'border-[var(--border2)] dark:border-[rgba(47,217,211,0.32)] bg-[var(--bg-card)] dark:bg-[#10222e] shadow-[0_0_16px_var(--glow-c)]' : ''
        }`}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => onSignup(parentId, side)}
      >
        <div className="flex flex-col items-center gap-1 text-[var(--text-3)] dark:text-[#728b98]">
          {hov ? (
            <div className="flex flex-col items-center gap-1 text-[var(--brand-cyan)] dark:text-[#2fd9d3]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-[11px] font-semibold tracking-[0.8px]">{side.toUpperCase()} JOIN</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <span className="text-[11px] font-semibold tracking-[0.8px]">Available</span>
            </div>
          )}
        </div>
        <div className="absolute top-1.5 right-2 text-[9px] font-bold text-[var(--text-4)] dark:text-[#4d626e] tracking-[1px]">{side[0].toUpperCase()}</div>
      </div>
    </div>
  );
}

// ─── Search Modal ───────────────────────────────────────────────────────────
function SearchModal({ onClose, onSearch }) {
  const [val, setVal] = useState("");
  return (
    <div className="fixed inset-0 bg-[color-mix(in_srgb,var(--bg-base)_70%,transparent)] dark:bg-[rgba(8,19,27,0.7)] backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[var(--bg-card)] dark:bg-[#10222e] border border-[var(--border2)] dark:border-[rgba(47,217,211,0.32)] rounded-xl p-7 max-w-[420px] w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="text-xl font-bold text-[var(--text-1)] dark:text-[#eaf5f7] mb-2 flex items-center gap-2.5">Search User</div>
        <input
          className="w-full bg-[var(--input-bg)] dark:bg-[#142936] border border-[var(--border3)] dark:border-[rgba(244,183,64,0.3)] rounded-xl text-[var(--text-1)] dark:text-[#eaf5f7] font-sans text-sm px-3.5 py-2.5 outline-none focus:border-[var(--border2)] dark:focus:border-[rgba(47,217,211,0.32)] transition-colors mb-4"
          placeholder="Enter User ID or Username..."
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch(val)}
          autoFocus
        />
        <div className="flex justify-end gap-2.5 flex-wrap">
          <button className="bg-[var(--input-bg)] dark:bg-[#142936] border border-[var(--border3)] dark:border-[rgba(244,183,64,0.3)] text-[var(--text-3)] dark:text-[#728b98] font-semibold text-sm px-4 py-2 rounded-lg cursor-pointer transition-all hover:border-[var(--border2)] dark:hover:border-[rgba(47,217,211,0.32)] hover:text-[var(--text-1)] dark:hover:text-[#eaf5f7]" onClick={onClose}>Cancel</button>
          <button className="bg-gradient-to-r from-[var(--brand-cyan)] to-[var(--brand-cyan2)] dark:from-[#2fd9d3] dark:to-[#18c7c2] border-none rounded-lg text-[var(--bg-base)] dark:text-[#04131a] font-bold text-sm px-6 py-2 cursor-pointer transition-all hover:opacity-85 hover:scale-[0.98]" onClick={() => onSearch(val)}>Search</button>
        </div>
      </div>
    </div>
  );
}

// ─── Signup Modal ───────────────────────────────────────────────────────────
function SignupModal({ parentId, side, onClose }) {
  const positionCode = side === "left" ? "L" : "R";
  const link = `http://localhost:3000/user/register?ref=${parentId}`;
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-[color-mix(in_srgb,var(--bg-base)_70%,transparent)] dark:bg-[rgba(8,19,27,0.7)] backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[var(--bg-card)] dark:bg-[#10222e] border border-[var(--border2)] dark:border-[rgba(47,217,211,0.32)] rounded-xl p-7 max-w-[420px] w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="text-xl font-bold text-[var(--text-1)] dark:text-[#eaf5f7] mb-2 flex items-center gap-2.5">
          <span className={`text-[11px] font-bold tracking-[1px] px-2 py-0.5 rounded-md ${
            side === 'left' 
              ? 'bg-[color-mix(in_srgb,var(--brand-green)_12%,transparent)] dark:bg-[rgba(46,217,154,0.12)] text-[var(--brand-green)] dark:text-[#2ed99a] border border-[color-mix(in_srgb,var(--brand-green)_30%,transparent)] dark:border-[rgba(46,217,154,0.25)]' 
              : 'bg-[color-mix(in_srgb,var(--brand-cyan)_12%,transparent)] dark:bg-[rgba(47,217,211,0.12)] text-[var(--brand-cyan)] dark:text-[#2fd9d3] border border-[color-mix(in_srgb,var(--brand-cyan)_30%,transparent)] dark:border-[rgba(47,217,211,0.25)]'
          }`}>{positionCode}</span> Signup Link
        </div>
        <div className="text-sm text-[var(--text-3)] dark:text-[#728b98] mb-4">Referral under <strong className="text-[var(--text-1)] dark:text-[#eaf5f7]">{parentId}</strong></div>
        <div className="flex gap-2 items-center bg-[var(--input-bg)] dark:bg-[#142936] border border-[var(--border3)] dark:border-[rgba(244,183,64,0.3)] rounded-xl px-3 py-2.5 mb-4 flex-wrap">
          <span className="flex-1 min-w-0 font-mono text-[11px] text-[var(--text-3)] dark:text-[#728b98] break-all">{link}</span>
          <button className={`bg-[var(--bg-3)] dark:bg-[#142936] border border-[var(--border2)] dark:border-[rgba(47,217,211,0.32)] text-[var(--brand-cyan)] dark:text-[#2fd9d3] font-semibold text-xs px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-all flex-shrink-0 ${
            copied ? 'bg-[color-mix(in_srgb,var(--brand-green)_15%,transparent)] dark:bg-[rgba(46,217,154,0.15)] border-[color-mix(in_srgb,var(--brand-green)_40%,transparent)] dark:border-[rgba(46,217,154,0.4)] text-[var(--brand-green)] dark:text-[#2ed99a]' : 'hover:bg-[var(--bg-hover)]'
          }`} onClick={copy}>{copied ? "✓ Copied" : "Copy"}</button>
        </div>
        <div className="flex justify-end gap-2.5 flex-wrap">
          <button className="bg-gradient-to-r from-[var(--brand-cyan)] to-[var(--brand-cyan2)] dark:from-[#2fd9d3] dark:to-[#18c7c2] border-none rounded-lg text-[var(--bg-base)] dark:text-[#04131a] font-bold text-sm px-6 py-2 cursor-pointer transition-all hover:opacity-85 hover:scale-[0.98]" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Bar ──────────────────────────────────────────────────────────────
function StatsBar({ root }) {
  if (!root) return null;

  const leftCount = root.leftActive;
  const rightCount = root.rightActive;
  const rootActive = root.active ? 1 : 0;
  const total = leftCount + rightCount + rootActive;
  const leftPct = total > 0 ? Math.round((leftCount / total) * 100) : 50;

  return (
    <div className="flex items-center justify-center flex-wrap gap-4 px-6 py-3.5 mb-10">
      <div className="flex items-center gap-3 bg-[var(--bg-card)] dark:bg-[#10222e] border border-[var(--border3)] dark:border-[rgba(244,183,64,0.3)] rounded-xl px-4 py-2.5 min-w-[130px] shadow-sm border-l-2 border-l-[var(--brand-green)] dark:border-l-[#2ed99a]">
        <div className="text-[11px] text-[var(--text-3)] dark:text-[#728b98]">◀</div>
        <div>
          <div className="text-[10px] font-semibold tracking-[1.5px] text-[var(--text-3)] dark:text-[#728b98]">LEFT USERS</div>
          <div className="text-2xl font-bold font-mono text-[var(--text-1)] dark:text-[#eaf5f7]">{leftCount}</div>
        </div>
      </div>

      <div className="text-center flex-1 min-w-[160px] max-w-[260px]">
        <div className="text-[10px] font-semibold tracking-[1.5px] text-[var(--text-3)] dark:text-[#728b98] mb-1.5">TOTAL ACTIVE USERS : {total}</div>
        <div className="flex h-1.5 rounded-full overflow-hidden bg-[var(--border)] dark:border-[rgba(140,200,205,0.16)] gap-px">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${leftPct}%`, background: "linear-gradient(90deg, var(--brand-green), color-mix(in srgb, var(--brand-green) 70%, #2dd4bf))" }} />
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${100 - leftPct}%`, background: "linear-gradient(90deg, var(--brand-cyan2), var(--brand-cyan))" }} />
        </div>
        <div className="flex justify-between text-[11px] font-medium mt-1">
          <span className="text-[var(--brand-green)] dark:text-[#2ed99a]">Left: {leftCount}</span>
          <span className="text-[var(--brand-cyan)] dark:text-[#2fd9d3]">Right: {rightCount}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-[var(--bg-card)] dark:bg-[#10222e] border border-[var(--border3)] dark:border-[rgba(244,183,64,0.3)] rounded-xl px-4 py-2.5 min-w-[130px] shadow-sm border-r-2 border-r-[var(--brand-cyan)] dark:border-r-[#2fd9d3]">
        <div>
          <div className="text-[10px] font-semibold tracking-[1.5px] text-[var(--text-3)] dark:text-[#728b98]">RIGHT USERS</div>
          <div className="text-2xl font-bold font-mono text-[var(--text-1)] dark:text-[#eaf5f7]">{rightCount}</div>
        </div>
        <div className="text-[11px] text-[var(--text-3)] dark:text-[#728b98]">▶</div>
      </div>
    </div>
  );
}

// ─── Loading / Error ────────────────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-base)] dark:bg-[#08131b] gap-5">
      <div className="w-12 h-12 border-3 border-[var(--border)] dark:border-[rgba(140,200,205,0.16)] border-t-[var(--brand-cyan)] dark:border-t-[#2fd9d3] rounded-full animate-spin" />
      <div className="font-mono text-[var(--text-3)] dark:text-[#728b98] text-sm tracking-[1px]">Loading tree data...</div>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────
export default function BinaryTree() {
  const [tooltip, setTooltip] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [signupModal, setSignupModal] = useState(null);
  const [history, setHistory] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [treeData, setTreeData] = useState(null);
  const [focusedNode, setFocusedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = AuthLogin();
  const token = Cookies.get("token");

  const fetchTreeByURID = async (userId, saveHistory = true) => {
    try {
      setLoading(true);
      setError(null);

      if (saveHistory && treeData?.id) {
        setHistory((prev) => [...prev, treeData.id]);
      }

      const response = await fetch(
        `https://app.xoxofx.com/api/Community/getdownLineTreeDetails?Loginid=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.statusCode === 200 && result.data?.downLineTreeDetails) {
        const builtTree = buildTreeFromApi(result.data.downLineTreeDetails);
        if (builtTree) {
          setTreeData(builtTree);
          setTooltip(null);
        } else {
          setError("Could not build tree");
        }
      } else {
        setError(result.message || "Failed to load tree");
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Missing authentication. Please log in.");
      setLoading(false);
      return;
    }
    fetchTreeByURID(userId);
  }, [token, userId]);

  const handleTooltip = useCallback((node, x, y) => setTooltip({ node, x, y }), []);
  const handleHideTooltip = useCallback(() => setTooltip(null), []);
  const handleSignup = useCallback((parentId, side) => setSignupModal({ parentId, side }), []);

  const handleFocus = useCallback((node) => {
    if (!node?.id) return;
    fetchTreeByURID(node.id);
  }, [token, treeData]);

  const handleSearch = useCallback((query) => {
    if (!query.trim() || !treeData) return;
    const searchInTree = (node, term) => {
      if (!node) return null;
      if (node.id.toLowerCase().includes(term.toLowerCase()) || node.username.toLowerCase().includes(term.toLowerCase())) return node;
      return searchInTree(node.left, term) || searchInTree(node.right, term);
    };
    const found = searchInTree(treeData, query);
    if (found) {
      setFocusedNode(found);
    } else {
      alert("User not found in tree");
    }
  }, [treeData]);

  const displayRoot = treeData;

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] dark:bg-[#08131b] text-[var(--brand-red)] dark:text-[#f0708a] font-mono text-lg">Error: {error}</div>;
  if (!treeData) return <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] dark:bg-[#08131b] text-[var(--text-3)] dark:text-[#728b98] font-mono text-lg">No tree data available</div>;

  return (
    <div className="font-sans text-[var(--text-1)] dark:text-[#eaf5f7]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-6 py-3 border-b border-[var(--border)] dark:border-[rgba(140,200,205,0.16)] bg-gradient-to-b from-[var(--bg-2)] dark:from-[#10222e] to-[var(--bg-base)] dark:to-[#08131b] backdrop-blur-sm sticky top-0 z-[100]">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-[38px] h-[38px] bg-[var(--bg-card)] dark:bg-[#10222e] border border-[var(--border2)] dark:border-[rgba(47,217,211,0.32)] rounded-xl flex items-center justify-center shadow-[0_0_20px_var(--glow-c),inset_0_1px_0_var(--border2)] flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L3 8.5V15.5L12 21L21 15.5V8.5L12 3Z" stroke="var(--brand-cyan)" strokeWidth="1.5" fill="none" />
              <path d="M12 3v18M3 8.5l9 6 9-6" stroke="var(--brand-cyan)" strokeWidth="1.2" opacity="0.5" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-[1px] text-[var(--text-1)] dark:text-[#eaf5f7] whitespace-nowrap">Tree<span className="text-[var(--brand-cyan)] dark:text-[#2fd9d3]">View</span></span>
        </div>

        <div className="flex-1 min-w-[180px] max-w-[480px]">
          <div className="flex items-center gap-2 bg-[var(--input-bg)] dark:bg-[#142936] border border-[var(--border3)] dark:border-[rgba(244,183,64,0.3)] rounded-xl px-3 py-1.5 text-[var(--text-3)] dark:text-[#728b98] transition-colors focus-within:border-[var(--border2)] dark:focus-within:border-[rgba(47,217,211,0.32)]">
            <input
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-[var(--text-1)] dark:text-[#eaf5f7] font-sans text-sm"
              placeholder="Search User ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  handleSearch(searchQuery);
                  setSearchQuery("");
                }
              }}
            />
            <button
              className="bg-gradient-to-r from-[var(--brand-cyan)] to-[var(--brand-cyan2)] dark:from-[#2fd9d3] dark:to-[#18c7c2] border-none rounded-lg text-[var(--bg-base)] dark:text-[#04131a] font-bold text-sm px-3.5 py-1.5 cursor-pointer transition-all hover:opacity-85 hover:scale-[0.98] whitespace-nowrap"
              onClick={() => {
                if (searchQuery.trim()) {
                  handleSearch(searchQuery);
                  setSearchQuery("");
                } else {
                  setSearchOpen(true);
                }
              }}
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {history.length > 0 && (
            <button
              className="bg-[var(--bg-card)] dark:bg-[#10222e] border border-[var(--border3)] dark:border-[rgba(244,183,64,0.3)] text-[var(--text-1)] dark:text-[#eaf5f7] font-semibold text-sm px-3.5 py-1.5 rounded-lg cursor-pointer transition-all hover:border-[var(--brand-cyan)] dark:hover:border-[#2fd9d3] hover:bg-[var(--glow-c)] dark:hover:bg-[rgba(47,217,211,0.16)] whitespace-nowrap"
              onClick={async () => {
                const prevHistory = [...history];
                const lastId = prevHistory.pop();
                setHistory(prevHistory);
                if (lastId) await fetchTreeByURID(lastId, false);
              }}
            >
              ← Back
            </button>
          )}
          <div className="flex items-center gap-1.5 text-sm text-[var(--text-3)] dark:text-[#728b98] font-medium whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-green)] dark:bg-[#2ed99a] shadow-[0_0_6px_var(--brand-green)]" /> Active
            <span className="w-2 h-2 rounded-full bg-[var(--brand-red)] dark:bg-[#f0708a] ml-3" /> Inactive
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsBar root={displayRoot} />

      {/* Tree */}
      <div className="overflow-x-auto overflow-y-auto px-5 py-10 pb-16 min-h-[calc(100vh-180px)] bg-[var(--bg-base)] dark:bg-[#08131b] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--glow-c)_0%,transparent_60%),radial-gradient(ellipse_60%_40%_at_80%_80%,var(--glow-p)_0%,transparent_50%)]">
        <div className="flex justify-center min-w-max">
          <TreeNode
            node={displayRoot}
            side="root"
            isRoot={true}
            onTooltip={handleTooltip}
            onHideTooltip={handleHideTooltip}
            onSignup={handleSignup}
            onFocus={handleFocus}
            depth={0}
          />
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && createPortal(<Tooltip node={tooltip.node} x={tooltip.x} y={tooltip.y} />, document.body)}

      {/* Modals */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} onSearch={(q) => { handleSearch(q); setSearchOpen(false); }} />}
      {signupModal && <SignupModal parentId={signupModal.parentId} side={signupModal.side} onClose={() => setSignupModal(null)} />}

      <style jsx global>{`
        .bt-tree-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .bt-tree-scroll::-webkit-scrollbar-track { background: var(--bg-base); }
        .bt-tree-scroll::-webkit-scrollbar-thumb { background: var(--border3); border-radius: 3px; }
        .bt-tree-scroll::-webkit-scrollbar-thumb:hover { background: var(--border2); }
      `}</style>
    </div>
  );
}