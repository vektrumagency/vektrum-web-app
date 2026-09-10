import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "rgb(43, 31, 219)",
          padding: "80px",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "rgb(245, 241, 234)",
            letterSpacing: "-0.03em"
          }}
        >
          Vektrum
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 36,
            color: "rgb(214, 255, 71)",
            maxWidth: 900
          }}
        >
          Practical business automation systems
        </div>
      </div>
    ),
    { ...size }
  );
}
