import { ImageResponse } from "next/og";

export const alt = "Free Retirement Seminar in Wylie on October 12";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#F9F6F4",
          color: "#06204D",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ width: 390, height: "100%", display: "flex", position: "relative", overflow: "hidden" }}>
          <img
            src="data:image/jpeg;base64,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"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 28%" }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 120,
              background: "linear-gradient(transparent, rgba(6,32,77,.92))",
              display: "flex",
            }}
          />
        </div>

        <div style={{ flex: 1, padding: "38px 48px 34px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <img
              src="https://lifelinelegacyfinancial.com/brand/llfg-logo.png"
              alt="Lifeline Legacy Financial Group"
              style={{ width: 270, height: "auto", objectFit: "contain" }}
            />
            <div
              style={{
                background: "#06204D",
                color: "#FFFFFF",
                borderRadius: 12,
                padding: "12px 18px",
                fontSize: 20,
                fontWeight: 800,
                display: "flex",
              }}
            >
              FREE SEMINAR
            </div>
          </div>

          <div style={{ marginTop: 34, color: "#B07A32", fontSize: 22, fontWeight: 800, letterSpacing: 2, display: "flex" }}>
            WYLIE, TEXAS
          </div>

          <div style={{ marginTop: 10, fontSize: 48, lineHeight: 1.04, fontWeight: 900, display: "flex", maxWidth: 700 }}>
            Are You Within 10 Years of Retirement - or Recently Retired?
          </div>

          <div style={{ marginTop: 18, fontSize: 25, lineHeight: 1.3, color: "#374151", display: "flex" }}>
            Build a clearer retirement roadmap before and after the paycheck stops.
          </div>

          <div style={{ marginTop: "auto", display: "flex", gap: 18, alignItems: "stretch" }}>
            <div style={{ width: 150, background: "#06204D", color: "#FFFFFF", borderRadius: 14, padding: "14px 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ color: "#D9B388", fontSize: 17, fontWeight: 800, letterSpacing: 2, display: "flex" }}>OCTOBER</div>
              <div style={{ fontSize: 65, lineHeight: 1, fontWeight: 900, display: "flex" }}>12</div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1.5, display: "flex" }}>MONDAY</div>
            </div>

            <div style={{ flex: 1, border: "1px solid #E4D7C5", borderRadius: 14, padding: "16px 20px", background: "#FFFFFF", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 17, color: "#8A6B48", fontWeight: 700, display: "flex" }}>6:00 PM</div>
              <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900, display: "flex" }}>Rita & Truett Smith Public Library</div>
              <div style={{ marginTop: 4, fontSize: 16, color: "#5D6778", display: "flex" }}>300 Country Club Road, Building 300 · Wylie, TX 75098</div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
