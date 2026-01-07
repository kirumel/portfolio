"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("비밀번호가 올바르지 않습니다.");
    } else {
      router.push("/portfolio");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "var(--dark-bg)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "40px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          borderRadius: "12px",
          minWidth: "300px",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "var(--light-text)" }}>
          로그인
        </h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            background: "rgba(255, 255, 255, 0.1)",
            color: "var(--light-text)",
          }}
          required
        />
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "var(--primary-color)",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          로그인
        </button>
      </form>
    </div>
  );
}

