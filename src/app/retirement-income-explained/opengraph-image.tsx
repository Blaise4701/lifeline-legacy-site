import { ImageResponse } from "next/og";

export const alt =
  "Retirement Income Explained. Free Dallas retirement education event, Thursday, November 12, 2026, Fretz Park Branch Library. Afternoon workshop 2 to 5 PM, evening seminar 5 to 7 PM.";
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
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#062d24",
          color: "#ffffff",
          padding: "56px 72px",
          fontFamily: "Georgia, serif",
          borderBottom: "14px solid #c89b39",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, color: "#ead493", fontFamily: "Arial, sans-serif", fontWeight: 700 }}>
          FREE DALLAS RETIREMENT EDUCATION EVENT
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 82, lineHeight: 1.02, fontWeight: 700 }}>RETIREMENT INCOME</div>
          <div style={{ display: "flex", fontSize: 82, lineHeight: 1.02, fontWeight: 700 }}>EXPLAINED</div>
          <div style={{ display: "flex", fontSize: 32, color: "#ead493", marginTop: 20 }}>
            How to Turn Your Retirement Savings Into a Retirement Paycheck
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Arial, sans-serif", fontSize: 26 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 700 }}>Thursday, November 12, 2026</span>
            <span>Workshop 2–5 PM · Seminar 5–7 PM</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontWeight: 700 }}>Fretz Park Branch Library</span>
            <span>Lifeline Legacy Financial Group</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
