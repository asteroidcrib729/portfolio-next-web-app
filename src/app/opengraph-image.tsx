import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/siteConfig";

export const alt = `${siteConfig.name} — ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#070b12",
        color: "#f4f7fb",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        justifyContent: "center",
        overflow: "hidden",
        padding: 72,
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#0ea5e9",
          borderRadius: 999,
          filter: "blur(90px)",
          height: 380,
          opacity: 0.22,
          position: "absolute",
          right: -80,
          top: -120,
          width: 380,
        }}
      />
      <div
        style={{
          border: "1px solid #263247",
          borderRadius: 36,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: 56,
          position: "relative",
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: 18 }}>
          <div
            style={{
              alignItems: "center",
              background: "#38bdf8",
              borderRadius: 16,
              color: "#07111a",
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              height: 58,
              justifyContent: "center",
              width: 58,
            }}
          >
            {siteConfig.shortName}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 28, fontWeight: 650 }}>{siteConfig.name}</span>
            <span style={{ color: "#9aa8ba", fontSize: 18 }}>{siteConfig.title}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 700,
            letterSpacing: "-3px",
            lineHeight: 1.02,
            maxWidth: 900,
          }}
        >
          Systems that feel as good as they perform.
        </div>

        <div style={{ color: "#38bdf8", display: "flex", fontSize: 18 }}>
          React · Next.js · TypeScript · Design Systems
        </div>
      </div>
    </div>,
    size
  );
}
