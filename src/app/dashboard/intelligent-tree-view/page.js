"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Tree from "react-d3-tree";
import { useDispatch, useSelector } from "react-redux";
import { getNetworkTree } from "@/app/redux/slices/walletSlice";
import { getEncryptedLocalData } from "@/app/api/auth";

import toast from "react-hot-toast";
import Loader from "@/app/common/loading";

const buildTreeData = (data, collapsedMap) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const unique = data.filter(
    (n, i, arr) => i === arr.findIndex((x) => x.Loginid === n.Loginid)
  );

  const nodeMap = new Map();

  unique.forEach((node) => {
    const children = unique.filter(
      (child) => child.SponsorId === node.Loginid
    );
    nodeMap.set(node.Loginid, {
       name: node.Name || node.Loginid,
      loginid: node.Loginid,
      attributes: {
        sponsor: node.SponsorId || "",
        downline: 0,
        email: node.Email || "",
        regDate: node.RegDate || "",
        leaseAmount: node.Package || 0,
        urank: node.uLvl || 0,
        teamBusiness: node.Teambusiness || 0,
        activeTeam: node.ActiveTeam || 0,
        directBusiness: node.DirectBusiness || 0,
        topupDate: node.TopupDate || "",
        totalTeam: node.TotalActiveDirect || 0,
        mobile: node.Mobile || "",
        uLvl: node.uLvl || 0,
        ActivationDate: node.ActivationDate || "",
        leftTeam: node.TotalTeam || 0,
        rightTeam: node.ActiveTeam || 0,
        leftAvtive: node.Teambusiness || 0,
        RightAvtive: node.RightActiveTeam || 0,
        leftBusiness: node.LeftBussiness || 0,
        rightBusiness: node.RightBussiness || 0,
        status: node.status || "",
        level: node.uLvl || 0
      },
      children: [],
      __rd3t: {
        collapsed: collapsedMap.get(node.Loginid) ?? true,
      },
    });
  });

  const roots = [];

  unique.forEach((node) => {
    if (node.SponsorId && nodeMap.has(node.SponsorId)) {
      nodeMap.get(node.SponsorId).children.push(
        nodeMap.get(node.Loginid)
      );
    } else {
      roots.push(nodeMap.get(node.Loginid));
    }
  });

  return roots;
};

const CustomNode = ({ nodeDatum, toggleNode }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 10, left: 0 });
  const nodeRef = useRef(null);

  const lease = Number(nodeDatum.attributes?.leaseAmount || 0);
  const headerColor = lease > 0 ? "#16a34a" : "#dc2626";

  const formatAmount = (amount) => {
    const num = parseFloat(amount);
    return num % 1 === 0 ? num.toString() : num.toString();
  };

  const handleMouseEnter = () => {
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top + window.scrollY - 60,
        left: rect.left + window.scrollX + 80,
      });
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <g>
      <foreignObject x="-100" y="-80" width="200" height="200">
        <div
          className="tree-node-card"
          style={{
            pointerEvents: "auto",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
            fontFamily: "system-ui, -apple-system, sans-serif"
          }}
          ref={nodeRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseOver={handleMouseEnter}
          onMouseOut={handleMouseLeave}
        >
          <div
            style={{
              backgroundColor: headerColor,
              color: "#ffffff",
              fontSize: "10px",
              padding: "6px 12px",
              display: "flex",
              justifyContent: "space-around",
              fontWeight: "bold"
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(nodeDatum.loginid);
                toast.success("ID Copied");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "12px"
              }}
            >
              ❐
            </button>
            <span>ID: {nodeDatum.loginid}</span>
          </div>

          <div className="tree-node-content" style={{ padding: "12px", textAlign: "center", flexGrow: 1 }}>
            <h3 className="tree-node-title" style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 8px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {nodeDatum.name}
            </h3>

            <p className="tree-node-text" style={{ fontSize: "11px", margin: "4px 0" }}>
              Package: ${lease.toLocaleString()}
            </p>

            <p className="tree-node-text" style={{ fontSize: "11px", margin: "4px 0" }}>
              Total Direct: {nodeDatum.attributes?.totalTeam || 0}
            </p>
          </div>

          {nodeDatum.children?.length > 0 && (
            <div style={{ padding: "8px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode();
                }}
                style={{
                  width: "100%",
                  fontSize: "10px",
                  padding: "6px",
                  color: "#ffffff",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: nodeDatum.__rd3t?.collapsed ? "#4f46e5" : "#475569"
                }}
              >
                {nodeDatum.__rd3t?.collapsed ? "Expand +" : "Collapse −"}
              </button>
            </div>
          )}
          {showTooltip &&
            createPortal(
              <div
                className="tree-tooltip"
                style={{
                  position: "absolute",
                  top: tooltipPos.top,
                  left: tooltipPos.left,
                  width: 260,
                  height: 200,
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-2)",
                  fontSize: "1rem",
                  fontWeight:"bold",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  zIndex: 9999,
                  overflowY: "auto",
                  fontFamily: "system-ui, -apple-system, sans-serif"
                }}
              >

                 <p style={{ margin: "4px 0",color:'var(--text-2)' }}>SponsorId: {nodeDatum.attributes?.sponsor || "None"}</p>
                <p style={{ margin: "4px 0",color:'var(--text-2)' }}>Activated Date: {nodeDatum.attributes?.ActivationDate || ""}</p>
                <p style={{ margin: "4px 0",color:'var(--text-2)' }}>Level: {nodeDatum.attributes?.level || 0}</p>
                <p style={{ margin: "4px 0",color:'var(--text-2)' }}>Total Team: {formatAmount(nodeDatum.attributes?.leftTeam || 0)}
                </p>
                 <p style={{ margin: "4px 0",color:'var(--text-2)' }}>Active Team: {formatAmount(nodeDatum.attributes?.rightTeam || 0)}
                </p>
                <p style={{ margin: "4px 0",color:'var(--text-2)' }}>Team Business: ${formatAmount(nodeDatum.attributes?.leftAvtive || 0)}
                </p>

              </div>,
              document.body
            )}
        </div>
      </foreignObject>
    </g>
  );
};

// Global styles as a style tag
const GlobalStyles = () => (
  <style>{`

    .tree-content {
      padding: 16px 24px;
      flex-grow: 1;
    }

    @media (max-width: 768px) {
      .tree-content {
        padding: 8px 12px;
      }
    }

    .tree-wrapper {
      width: 100%;
      height: 75vh;
      background-color:var(--bg-card);
      border-radius: 16px;

    }

    @media (min-width: 768px) {
      .tree-wrapper {
        height: 85vh;
      }
    }

    .loading-container {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .loading-dot {
      width: 12px;
      height: 12px;
      background-color: #4f46e5;
      border-radius: 50%;
      animation: bounce 1s infinite;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .loading-text {
      color: #94a3b8;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-size: 12px;
    }

    .rd3t-link {
      stroke: #cbd5e1 !important;
      stroke-width: 2px !important;
    }

    .rd3t-label {
      display: none;
    }

    svg {
      touch-action: none;
    }

    /* Dark mode styles for tree nodes */
    @media (prefers-color-scheme: dark) {
      .tree-node-card {
        background-color: #1f2937 !important;
        border-color: #374151 !important;
      }

      .tree-node-title {
        color: #f9fafb !important;
      }

      .tree-node-text {
        color: #d1d5db !important;
      }

      .tree-tooltip {
        background-color: #1f2937 !important;
        border: 1px solid #374151 !important;
      }

      .rd3t-link {
        stroke: #4b5563 !important;
      }
    }

    /* Class-based dark mode support */
    .dark .tree-node-card {
      background-color: #1f2937 !important;
      border-color: #374151 !important;
    }

    .dark .tree-node-title {
      color: #f9fafb !important;
    }

    .dark .tree-node-text {
      color: #d1d5db !important;
    }

    .dark .tree-tooltip {
      background-color: #1f2937 !important;
      border: 1px solid #374151 !important;
    }

    .dark .rd3t-link {
      stroke: #4b5563 !important;
    }
  `}</style>
);

export default function IntelligentTreeView() {
  const dispatch = useDispatch();
  const { getNetworkTreeData } = useSelector((s) => s.wallet);

  const containerRef = useRef(null);
 

  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [collapsedMap, setCollapsedMap] = useState(new Map());
  const [treeKey, setTreeKey] = useState(0);

  useEffect(() => {
    const auth = getEncryptedLocalData("AuthLogin");
    dispatch(getNetworkTree(auth));
  }, [dispatch]);

  useEffect(() => {
    if (!Array.isArray(getNetworkTreeData) || !getNetworkTreeData.length)
      return;

    const ids = new Set(getNetworkTreeData.map((n) => n.Loginid));
    const map = new Map();

    getNetworkTreeData.forEach((node) => {
      const isRoot = !node.SponsorId || !ids.has(node.SponsorId);
      map.set(node.Loginid, !isRoot);
    });

    setCollapsedMap(map);
    setTreeKey((k) => k + 1);
  }, [getNetworkTreeData]);

  const treeData = useMemo(
    () => buildTreeData(getNetworkTreeData || [], collapsedMap),
    [getNetworkTreeData, collapsedMap]
  );

  useEffect(() => {
    const updateCenter = () => {
      if (!containerRef.current) return;
      setTranslate({
        x: containerRef.current.offsetWidth / 2,
        y: 80,
      });
    };

    updateCenter();
    window.addEventListener("resize", updateCenter);
    return () => window.removeEventListener("resize", updateCenter);
  }, []);

  return (
    <div className="">
      <GlobalStyles />

      <div className="">
        <div
          ref={containerRef}
          className="tree-wrapper"
        >
          {treeData.length ? (
            <Tree
              key={treeKey}
              data={treeData}
              translate={translate}
              orientation="vertical"
              renderCustomNodeElement={(rd3tProps) => (
                <CustomNode {...rd3tProps} />
              )}
              nodeSize={{ x: 240, y: 280 }}
              pathFunc="diagonal"
              separation={{ siblings: 1.2, nonSiblings: 1.5 }}
              zoomable
              draggable
              initialDepth={1}
              enableLegacyTransitions
              transitionDuration={500}
              onNodeToggle={(node, toggled) => {
                setCollapsedMap(
                  (prev) =>
                    new Map(prev).set(node.loginid, toggled)
                );
              }}
            />
          ) : (
            <div className="loading-container">
              <div className="loading-dot"></div>
              <span className="loading-text">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}