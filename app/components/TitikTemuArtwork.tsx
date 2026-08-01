"use client";

import { useMemo, useState } from "react";
import TitikTemuNetwork3D from "./TitikTemuNetwork3D";
import { networkNodes, type NetworkNode } from "./titikTemuNetworkData";

type TitikTemuArtworkProps = {
  activeView: "common" | "difference" | "minority";
};

export function TitikTemuArtwork({ activeView }: TitikTemuArtworkProps) {
  const visibleNodes = useMemo(() => {
    if (activeView === "common") return networkNodes;
    const category = activeView === "difference" ? "difference" : "unheard";
    return networkNodes.filter((node) => node.category === category);
  }, [activeView]);
  const [activeNode, setActiveNode] = useState<NetworkNode>(networkNodes[0]);

  const resolvedActiveNode = visibleNodes.some((node) => node.id === activeNode.id)
    ? activeNode
    : visibleNodes[0] ?? networkNodes[0];

  return (
    <div className="titik-temu-artwork" aria-hidden="true">
      <TitikTemuNetwork3D
        nodes={networkNodes}
        visibleNodes={visibleNodes}
        activeNode={resolvedActiveNode}
        onSelectNode={setActiveNode}
        soundOn={false}
      />
    </div>
  );
}
